// BandDiagram.js

import * as d3 from 'd3';
import renderMathInElement from 'katex/contrib/auto-render';
import ResponsivePlot from './ResponsivePlot.js';
import { interpAtFrac, rejectUnexpectedFields } from './utils.js';

// Hatch shading: marks one side of a trace (e.g. the concentrated/degenerate
// side of a standard-state rung, like band-edge hatching in semiconductor
// diagrams). All lengths in screen px; `side` is in diagram y ('up' = +y).
// (Exported: EnergyLevelsDiagram shares these defaults for its level hatch.)
export const HATCH_DEFAULTS = {
    side: 'down',
    type: 'lines', // 'lines' (diagonal strokes) | 'tint' (solid fill)
    height: 14, // band extent from the trace, px
    yScale: 1, // signed vertical scale of the WHOLE texture (ESBD wrapper
    //            sets 1/z_i: band height ×1/|z|, stripe slope arctan(1/z),
    //            mirrored for anions — the μ̄° hatch pushed through the
    //            1/(z_i F) coordinate change)
    spacing: 3.5, // stripe pitch, px ('lines' only)
    lineWidth: 1, // stripe width, px ('lines' only)
    angle: 45, // stripe angle before yScale, deg ('lines' only); 45 = '/'
    opacity: 0.35,
    fade: true, // dissolve toward the band's far edge instead of a hard stop
};

// Default styling constants
const STYLE_DEFAULTS = {
    line: { lineWidth: 3, dasharray: null },
    interface: {
        lineWidth: 1,
        dasharray: '1,1',
        color: 'rgba(128,128,128,0.7)',
    },
    verticalMarker: {
        symbol: '↕',
        fontSize: '14px',
        color: '#333',
        backgroundRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backgroundStroke: '#AAA',
        legColor: '#666',
        legWidth: 2,
        legEndRadius: 3,
        highlightColor: 'rgba(0, 123, 255, 0.3)',
        highlightStroke: 'rgba(0, 123, 255, 0.5)',
    },
};

// px: how close (vertically) a pointer must be to a trace to hit it, for both
// hover tooltips and click-to-pin.
const HIT_THRESHOLD_PX = 15;

// The ⌇ break glyph: a small vertical zigzag, axis-break vocabulary. Shared by
// the on-trace refShift glyphs and the corner blurb that keys them.
const REFSHIFT_ZIG = 'M0,-7 L-3,-3.5 L3,0.5 L-3,4.5 L0,8';

/**
 * Creates an interactive Band Diagram using D3.js.
 * Uses a boundaries array and region properties array for layout.
 * Caller provides fundamental physical data with explicit units.
 * Interaction model: Click/Tap shows persistent popup and highlight. Click background clears.
 */
class BandDiagram extends ResponsivePlot {
    // ========================================================================
    // Constructor
    // ========================================================================

    /**
     * Creates an instance of the band diagram.
     * @param {string} containerId - ID of the HTML element (div) to contain the plot.
     * @param {object} [config={}] - Initial configuration options. See ResponsivePlot for more options
     * @param {Boolean} [config.xMode='abstract'] - Should x have numbered ticks or is it more 'abstract'.
     * @param {Boolean} [config.yMode='numeric'] - 'numeric' for numbered y ticks, or 'abstract' to hide them (schematic / "not to scale").
     * @param {number} [config.hoverThrottleDelay=50] - Mouseover throttling.
     * @param {string} [config.refShiftBlurbCorner='tl'] - Which plot corner ('tl'|'tr'|'bl'|'br') holds the ⌇ explainer note. The note itself is mandatory (it appears whenever any trace carries a refShift); the corner is the caller's choice, to keep it clear of the traces.
     */
    constructor(containerId, config = {}) {
        // Configuration with defaults
        const defaults = {
            xMode: 'abstract',
            yMode: 'numeric',
            hoverThrottleDelay: 50,
            refShiftBlurbCorner: 'tl',
        };
        super({ containerId: containerId, ...defaults, ...config });
        // ^ sets this.config, with extra defaults

        this.traceData = [];
        this.boundaries = [];
        this.regionProps = [];
        this.regionLabels = [];
        this.markerData = [];
        this._yAxisLabelStr = 'Energy';

        // Callbacks & Interaction state
        this._tracePopupCallback = null;
        this._customDrawCallback = null;
        this._pinnedPopupInfo = null; // Stores null or ['trace'|'marker', id]
        this._highlightedElementInfo = null; // Stores null or {type, id}
        this._hoverThrottleTimeout = null; // Throttle timer for pointermove highlights
        this._hoverThrottleWaiting = false; // Throttle flag

        this._popupDiv = this.container
            .append('div')
            .attr('class', 'bd-popup')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('opacity', 0)
            .style('z-index', '10')
            .style('transition', 'opacity 0.2s');

        // --- D3 Setup ---
        this._setupD3Structure();
    }

    // ========================================================================
    // Public API Methods
    // ========================================================================

    setYLabel(yLabelStr) {
        if (typeof yLabelStr !== 'string') {
            throw TypeError('not a string');
        }
        this._yAxisLabelStr = yLabelStr;
    }

    /** Updates the complete set of trace data to be plotted.
     * @param {string} traceDefs[].id - Must be unique.  Match on subsequent calls for smooth transitions.
     * @param {Array<number>} traceDefs[].x - x values (positions), must be ascending
     * @param {Array<number>} traceDefs[].y - y values (energies)
     * @param {string} [traceDefs[].color] - line color
     * @param {object} [traceDefs[].style] - line styling
     * @param {string} [traceDefs[].label] - (TeX math mode) visual label to plot, leave empty if unwanted
     * @param {string} [traceDefs[].toolTip] - (TeX text mode) tooltip text, defaults to '$ label $'
     * @param {object} [traceDefs[].extraData] - arbitrary extra data (will be returned e.g. during popup callback)
     *
     */
    updateTraceData(traceDefs) {
        if (!Array.isArray(traceDefs)) {
            throw Error('array required');
        }
        this.traceData = [];
        const seenIds = new Set(); // for checking dups
        for (const traceDef of traceDefs) {
            try {
                let {
                    id,
                    x: xData,
                    y: yData,
                    color,
                    style,
                    label,
                    showLabel = true,
                    toolTip,
                    extraData = null,
                    labelFrac = 1,
                    labelHAlign = 'left',
                    labelVAlign = 'center',
                    refShift = null,
                    refShiftFrac = 0.28,
                    hatch = null,
                    ...extraFields
                } = traceDef;
                rejectUnexpectedFields(extraFields);

                if (typeof id !== 'string') throw Error('missing/bad id');
                if (seenIds.has(id)) throw Error('duplicate id: ' + id);

                // validate and transform x and y data
                if (!Array.isArray(xData)) throw Error('missing/bad x array');
                if (!Array.isArray(yData)) throw Error('missing/bad y array');
                const len = xData.length;
                if (yData.length != len) throw Error('mismatched x/y lengths');
                if (len < 1) throw Error('empty trace');

                const points = [];
                for (let i = 0; i < len; i++) {
                    // coerce to numbers
                    const x = +xData[i];
                    const y = +yData[i];
                    if (!isFinite(x)) throw Error('x data must be finite');
                    if (i > 0 && x < xData[i - 1])
                        throw Error('x data cannot decrease');
                    points.push({ x: x, y: y });
                }

                color = color ?? '#333';
                style = style ?? STYLE_DEFAULTS.line;

                label = String(label ?? '');
                toolTip = String(toolTip ?? '') || `$${label}$`;

                // Label sits at a fraction along the trace's x-extent (default: the
                // right end), y interpolated; labelHAlign decides which side. The
                // refShift break glyph sits at refShiftFrac. refShift: this species
                // is drawn displaced from its true (IUPAC-referenced) position by
                // `refShift` volts, for readability.
                const hasLabel = showLabel && label;
                const hasRefShift =
                    typeof refShift === 'number' && isFinite(refShift);
                let labelPos = null;
                let refShiftPos = null;
                if (hasLabel || hasRefShift) {
                    const xs = points.map((p) => p.x);
                    const ys = points.map((p) => p.y);
                    if (hasLabel) labelPos = interpAtFrac(xs, ys, labelFrac);
                    if (hasRefShift)
                        refShiftPos = interpAtFrac(xs, ys, refShiftFrac);
                }
                if (!hasRefShift) refShift = null;

                if (hatch) hatch = { ...HATCH_DEFAULTS, ...hatch };

                const processedTrace = {
                    id,
                    points,
                    color,
                    style,
                    label,
                    labelPos,
                    refShift,
                    refShiftPos,
                    labelHAlign,
                    labelVAlign,
                    toolTip,
                    hatch,
                    extraData,
                };
                this.traceData.push(processedTrace);
                seenIds.add(processedTrace.id);
            } catch (e) {
                console.warn(
                    'Band diagram: Skipping trace definition (' + e + '):',
                    traceDef
                );
            }
        }
        this.scheduleRedraw();
    }

    /**
     * Sets the spatial layout using boundaries and region properties.
     * @param {Array<number>} boundaries - Sorted array of x-coordinates defining region edges (e.g., [0, 0.2, 0.5, 1.0]). Must include 0 and max x.
     * @param {Array<object>} regionProperties - Array of properties for regions between boundaries. Length must be boundaries.length - 1. E.g., [{name, color}, {name, color}, ...]
     * @param {Array<object>} [labels] - Override the default labels via [{label, x, y, dx, dy}, ...]
     */
    setSpatialLayout(boundaries, regionProperties, labels = null) {
        this.boundaries = [];
        this.regionProps = [];
        // Basic validation
        if (
            !Array.isArray(boundaries) ||
            boundaries.length < 2 ||
            !Array.isArray(regionProperties) ||
            regionProperties.length !== boundaries.length - 1
        ) {
            throw [
                'Invalid input for setSpatialLayout. Need boundaries array (N+1 >= 2) and regionProperties array (N).',
                { boundaries, regionProperties },
            ];
        }

        for (let i = 1; i < boundaries.length; i++) {
            if (boundaries[i] < boundaries[i - 1])
                throw ['Boundaries must be sorted.', boundaries];
        }

        this.boundaries = boundaries;
        this.regionProps = regionProperties;

        if (!labels) {
            // Make default labels at region midpoints
            labels = [];
            for (let i = 0; i < this.regionProps.length; i++) {
                const { name, color } = this.regionProps[i];
                const x = 0.5 * (this.boundaries[i] + this.boundaries[i + 1]);
                labels.push({ label: name, x: x });
            }
        }

        this.regionLabels = [];
        for (const labelDef of labels) {
            let {
                label,
                x = 0,
                y = 'bottom',
                dx = 0,
                dy = null,
                ...extraFields
            } = labelDef;
            rejectUnexpectedFields(extraFields);
            if (dy === null) {
                if (y === 'bottom') {
                    dy = '+0.8em';
                } else if (y === 'top') {
                    dy = '-0.3em';
                }
            }
            this.regionLabels.push({
                label,
                x,
                y,
                dx,
                dy,
            });
        }

        // Redraw static elements immediately if possible
        this.scheduleRedraw();
    }

    updateVerticalMarkers(markerDefs) {
        const markerData = [];
        const seenIds = new Set();
        for (const markerDef of markerDefs) {
            const {
                id,
                x,
                yDefs,
                symbol = STYLE_DEFAULTS.verticalMarker.symbol,
                label = null,
                labelHAlign = 'left',
                popupCallback = null,
                popupArgs = null,
                driven = null,
                ...extraFields
            } = markerDef;
            rejectUnexpectedFields(extraFields);

            if (typeof id !== 'string') throw Error('missing/bad id');
            if (seenIds.has(id)) throw Error('duplicate id: ' + id);
            seenIds.add(id);

            const legData = [];
            let yMin = yDefs[0].y;
            let yMax = yDefs[0].y;
            for (let i = 0; i < yDefs.length; i++) {
                // Optional per-leg color: a species-coloured "node dot" (the
                // circuit-schematic 'this connects' dot) for equilibrium-only
                // markers; driven markers get theirs via `driven` below.
                const { id: yid, y, color = null } = yDefs[i];
                if (y < yMin) yMin = y;
                if (y > yMax) yMax = y;
                const leg = {
                    id: yid ?? 'leg-' + i,
                    y: y,
                };
                if (color) leg.ghostColor = color;
                legData.push(leg);
            }

            // Driven-reaction residual (the 2026-07-10 marker design): the
            // LAST yDef is the GHOST — the arrowed rail's equilibrium
            // position — and driven.y is that rail's actual level. The
            // engine draws a fat species-coloured residual ghost->actual
            // with the arrowhead at the LOWER end (which for a dissipative
            // reaction is always the conventional-current-receiving rail,
            // under either sign of bias: current falls downhill). Set
            // driven.pump = true for a pumped reaction (e.g. photogeneration)
            // to put the arrowhead at the UPPER end instead.
            // Degenerates to a plain marker as driven.y -> ghost.
            if (driven) {
                if (typeof driven.y !== 'number' || !isFinite(driven.y))
                    throw Error('bad driven.y');
                const ghostLeg = legData[legData.length - 1];
                ghostLeg.ghostColor = driven.color ?? '#555';
            }

            markerData.push({
                id,
                x,
                legData,
                ySymbol: 0.5 * (yMin + yMax),
                yMin,
                yMax,
                symbol,
                label,
                labelHAlign,
                popupCallback,
                popupArgs,
                driven: driven
                    ? {
                          y: driven.y,
                          yGhost: legData[legData.length - 1].y,
                          color: driven.color ?? '#555',
                          label: driven.label ?? null,
                          pump: !!driven.pump,
                      }
                    : null,
            });
        }
        this.markerData = markerData;
        this.scheduleRedraw();
    }

    /**
     * Sets the vertical range (domain) of the Y axis
     * @param {number} min - Minimum value for the Y axis.
     * @param {number} max - Maximum value for the Y axis.
     */
    setYRange(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number' || min >= max) {
            throw new Error('Invalid arguments for setYRange.', { min, max });
        }
        this.yRange = [min, max];
        this.scheduleRedraw();
    }

    /** Registers a callback function to generate verbose popup content for data traces. */
    setTracePopupCallback(callbackFn) {
        this._tracePopupCallback = callbackFn; // Use base formatter if null/invalid
    }

    /**
     * Registers a callback for drawing custom artwork (e.g. capacitors between
     * rails) on top of the diagram. It runs at the end of every redraw with the
     * diagram itself as its argument, so it has the live scales, the `customGroup`
     * layer, and `drawElements()`/`transition()` for full fade-and-motion support.
     * Pass null to clear.
     */
    setCustomDrawCallback(callbackFn) {
        this._customDrawCallback = callbackFn;
        this.scheduleRedraw();
    }

    /** Main drawing/update function. */
    redraw() {
        const pw = this.plotWidth;
        const ph = this.plotHeight;

        this.xScale.range([0, pw]);
        this.yScale.range([ph, 0]);
        this.interactionRect.attr('width', pw).attr('height', ph);

        // 1. Prepare Data
        const hasPlottableData = this.traceData.some(
            (t) => t.points.length > 0
        );

        // 2. Update Scales
        let xDomain = d3.extent(
            this.boundaries && this.boundaries.length > 0
                ? this.boundaries
                : this.traceData.flatMap((t) => t.points.map((p) => p.x))
        );
        if (xDomain[0] === undefined) xDomain = [0, 1];
        this.xScale.domain(xDomain).nice();

        if (this.yRange) {
            const ymin = this.yRange[0];
            const ymax = this.yRange[1];
            this.yScale.domain(ymin < ymax ? [ymin, ymax] : [ymax, ymin]);
        } else {
            const allYValues = this.traceData.flatMap((t) =>
                t.points.map((p) => p.y)
            );
            let yDomain = d3.extent(
                allYValues.filter((y) => y !== null && isFinite(y))
            );
            if (
                !hasPlottableData ||
                yDomain[0] === undefined ||
                yDomain[1] === undefined ||
                yDomain[0] === yDomain[1]
            ) {
                const fallbackCenter =
                    yDomain[0] !== undefined ? yDomain[0] : 0;
                yDomain = [fallbackCenter - 1, fallbackCenter + 1];
            } else {
                const padding = (yDomain[1] - yDomain[0]) * 0.1;
                yDomain[0] -= padding;
                yDomain[1] += padding;
            }
            this.yScale.domain(yDomain).nice();
        }

        // 4. Draw Static Elements
        this._drawAxes();
        this._drawBackgrounds();
        this._drawInterfaceLines();
        this._drawRegionLabels();

        // 5. Draw Data Elements
        this._drawHatches();
        this._drawTraces();
        this._drawRefShiftGlyphs();
        this._drawRefShiftBlurb();
        this._drawVerticalMarkers();
        this._drawTraceLabels();

        // Custom artwork on top (capacitors, etc.), with the live scales.
        if (this._customDrawCallback) this._customDrawCallback(this);
    }

    // ========================================================================
    // Public Accessors (Getters)
    // ========================================================================

    // ========================================================================
    // Core Private Setup & Update Logic
    // ========================================================================

    _setupD3Structure() {
        // Layer groups (order matters for rendering)
        this.backgroundGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-region-backgrounds')
            .style('pointer-events', 'none');
        this.interfaceGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-region-interfaces')
            .style('pointer-events', 'none');
        this.regionLabelsGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-region-labels')
            .style('pointer-events', 'none');
        this.hatchDefs = this.plotArea.append('defs');
        this.hatchGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-hatches')
            .style('pointer-events', 'none');
        this.linesGroup = this.plotArea.append('g').attr('class', 'bd-lines');
        // Interaction rectangle sits ON TOP of lines but BELOW markers/labels
        this.interactionRect = this.plotArea
            .append('rect')
            .attr('class', 'bd-interaction-overlay')
            .style('fill', 'none')
            .style('pointer-events', 'all'); // Catches events not caught by elements above it
        this.verticalMarkersGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-vertical-markers')
            .style('pointer-events', 'all');
        this.traceLabelsGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-trace-labels')
            .style('pointer-events', 'none');
        this.customGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-custom-drawing');
        this.axesGroup = this.plotArea
            .append('g')
            .attr('class', 'bd-axes')
            .style('pointer-events', 'none');

        // Set up scales & Axes
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.xAxisGen = d3.axisBottom(this.xScale).tickSizeOuter(0);
        this.yAxisGen = d3.axisLeft(this.yScale).tickSizeOuter(0);
        if (this.config.xMode == 'abstract') {
            this.xAxisGen.tickValues([]);
        }
        if (this.config.yMode == 'abstract') {
            this.yAxisGen.tickValues([]);
        }

        // --- Interaction Rect Listeners ---
        this.interactionRect
            .on('pointermove', (event) =>
                this._handlePointerMoveInteractionRect(event)
            ) // Throttled hover check
            .on('pointerout', (event) =>
                this._handlePointerOutInteractionRect(event)
            ) // Clear hover highlight
            .on('click', (event) => this._handleClickInteraction(event, null)); // Background click

        // Note: Listeners for markers (including hover) are added in _drawVerticalMarkers
        // Note: Lines will be added with pointer-events: none
    }

    // ========================================================================
    // Private Drawing Helpers
    // ========================================================================

    _drawAxes() {
        const ph = this.plotHeight;
        this.drawStaticElements({
            parentGroups: this.axesGroup,
            element: 'g',
            cssClass: 'bd-x-axis',
            onUpdateTransition: (s) =>
                s.attr('transform', `translate(0,${ph})`).call(this.xAxisGen),
        });
        this.drawStaticElements({
            parentGroups: this.axesGroup,
            element: 'g',
            cssClass: 'bd-y-axis',
            onUpdateTransition: (s) => s.call(this.yAxisGen),
        });

        this.drawYAxisLabel(this.axesGroup, this._yAxisLabelStr);
    }

    _drawBackgrounds() {
        // Create data pairs: [ { start: b[0], end: b[1], props: r[0] }, { start: b[1], end: b[2], props: r[1] }, ... ]
        const regionDrawData = this.regionProps.map((props, i) => ({
            id: `bg_${i}_${props?.name?.replace(/\s+/g, '-') || i}`, // Unique ID based on index/name
            start: this.boundaries[i],
            end: this.boundaries[i + 1],
            props: props || {}, // Ensure props object exists
        }));

        this.drawStaticElements({
            parentGroups: this.backgroundGroup,
            element: 'rect',
            cssClass: 'bd-region-bg',
            data: regionDrawData,
            dataKey: (d) => d.id,
            onUpdateTransition: (s) =>
                s
                    .attr('x', (d) => this.xScale(d.start))
                    .attr('y', 0)
                    .attr('width', (d) =>
                        Math.max(0, this.xScale(d.end) - this.xScale(d.start))
                    )
                    .attr('height', this.plotHeight)
                    .attr('fill', (d) => d.props.color || 'transparent'),
        });
    }

    _drawInterfaceLines() {
        if (this.boundaries.length < 3) {
            // Need at least 3 boundaries for 1 interface line
            this.interfaceGroup.selectAll('line.bd-interface-line').remove();
            return;
        }
        // Draw lines at internal boundaries (excluding start and end)
        const interfaceData =
            this.boundaries.length >= 3 ? this.boundaries.slice(1, -1) : [];

        this.drawStaticElements({
            parentGroups: this.interfaceGroup,
            element: 'line',
            cssClass: 'bd-region-line',
            data: interfaceData,
            dataKey: undefined, // Key by index
            onNew: (s) =>
                s
                    .attr('y1', 0)
                    .attr('stroke', STYLE_DEFAULTS.interface.color)
                    .attr('stroke-width', STYLE_DEFAULTS.interface.lineWidth)
                    .attr(
                        'stroke-dasharray',
                        STYLE_DEFAULTS.interface.dasharray
                    ),
            onUpdateTransition: (s) =>
                s
                    .attr('x1', (d) => this.xScale(d))
                    .attr('x2', (d) => this.xScale(d))

                    .attr('y2', this.plotHeight),
        });
    }

    _drawRegionLabels() {
        this.drawStaticElements({
            parentGroups: this.regionLabelsGroup,
            element: 'text',
            cssClass: 'bd-region-label',
            data: this.regionLabels,
            dataKey: undefined, // Key by index
            onUpdateImmediate: (s) =>
                s.attr('text-anchor', 'middle').text((d) => d.label || ''),
        });

        // Mobile declutter: the authored x fractions overprint each other
        // once the plot squeezes (labels keep their font size while the
        // regions shrink). Measure each label, nudge it inside the plot
        // edges, then greedily fill two rows for the default bottom labels:
        // the normal below-the-axis row, and a fallback row tucked just
        // inside the frame (the inside-the-frame move some figures already
        // hand-apply at the top edge). A label fitting in neither row is
        // hidden. On a wide plot everything lands in the normal row at its
        // authored spot, so desktop output is unchanged. Author-placed
        // y:'top'/numeric labels are exempt. Positioning must live in this
        // measured pass (not a transition): widths only exist post-render.
        const PAD = 2;
        const rowEnd = [-Infinity, -Infinity];
        const nodes = this.regionLabelsGroup
            .selectAll('text.bd-region-label')
            .nodes();
        const placed = this.regionLabels
            .map((d, i) => {
                const w = nodes[i].getComputedTextLength();
                const cx = Math.min(
                    Math.max(this.xScale(d.x) + (d.dx || 0), w / 2),
                    this.plotWidth - w / 2
                );
                return { d, i, w, cx };
            })
            .sort((a, b) => a.cx - b.cx);
        for (const { d, i, w, cx } of placed) {
            const sel = d3.select(nodes[i]);
            if (d.y === 'top' || typeof d.y === 'number') {
                sel.attr('x', this.xScale(d.x) + (d.dx || 0))
                    .attr('y', d.y === 'top' ? -2 : this.yScale(d.y))
                    .attr('dy', d.dy)
                    .style('display', null);
                continue;
            }
            const row = [0, 1].find((r) => cx - w / 2 >= rowEnd[r] + PAD);
            if (row === undefined) {
                sel.style('display', 'none');
                continue;
            }
            rowEnd[row] = cx + w / 2;
            sel.attr('x', cx)
                .attr('y', this.plotHeight + 2)
                .attr('dy', row === 0 ? d.dy : '-0.5em')
                .style('display', null);
        }
    }

    /** Hatch/tint bands shading one side of a trace (see HATCH_DEFAULTS). */
    _drawHatches() {
        const FADE_SLABS = 3;
        const hatched = this.traceData.filter((d) => d.hatch);
        const patId = (d) => `${this.config.containerId}-hatch-pat-${d.id}`;

        // Per-trace stripe pattern defs, rebuilt each redraw (cheap, and they
        // carry no transitions of their own).
        this.drawStaticElements({
            parentGroups: this.hatchDefs,
            element: 'g',
            cssClass: 'bd-hatch-defs',
            data: hatched.filter((d) => d.hatch.type === 'lines'),
            dataKey: (d) => d.id,
            onUpdateImmediate: (s) =>
                s.html((d) => {
                    const h = d.hatch;
                    return `<pattern id="${patId(d)}" patternUnits="userSpaceOnUse"
                        width="${h.spacing}" height="${h.spacing}"
                        patternTransform="scale(1,${h.yScale}) rotate(${h.angle})">
                        <line x1="0" y1="0" x2="0" y2="${h.spacing}"
                        stroke="${d.color}" stroke-width="${h.lineWidth}"/></pattern>`;
                }),
        });

        // The fade is stacked area slabs stepping down in opacity: a gradient
        // mask can't follow a sloped/curved trace, and a thick STROKE of the
        // trace is wrong too (stroke width is perpendicular, so a steep wall
        // grows hatching on both of its sides — the dilute one included).
        // Strict vertical offsets stay one-sided everywhere. Geometry is
        // applied immediately, NOT tweened: re-rasterizing pattern fills
        // every animation frame is too slow on mobile, so during transitions
        // the hatches hide and rematerialize in final position (below).
        const slabPath = (d, j, n) => {
            const h = d.hatch;
            const sgn = h.side === 'up' ? -1 : 1;
            const hgt = h.height * Math.abs(h.yScale);
            // overlap slabs a hair toward the trace: no seam pixels
            const near = sgn * ((hgt * j) / n - (j ? 0.5 : 0));
            const far = (sgn * hgt * (j + 1)) / n;
            const gen = d3
                .area()
                .x((p) => this.xScale(p.x))
                .y0((p) => this.yScale(p.y) + near)
                .y1((p) => this.yScale(p.y) + far)
                .defined((p) => p.y !== null && !isNaN(p.y) && isFinite(p.y));
            return gen(d.points) ?? '';
        };
        const slabData = hatched.flatMap((d) => {
            const n = d.hatch.fade ? FADE_SLABS : 1;
            return Array.from({ length: n }, (_, j) => ({
                id: `${d.id}~${j}`,
                trace: d,
                j,
                n,
            }));
        });
        let moved = false;
        this.drawElements({
            parentGroups: this.hatchGroup,
            element: 'path',
            cssClass: 'bd-data-hatch',
            data: slabData,
            dataKey: (s) => s.id,
            onNew: (s) =>
                s
                    .attr('stroke', 'none')
                    .attr('d', ({ trace: d, j, n }) => slabPath(d, j, n)),
            onUpdateImmediate: (s) =>
                s
                    .attr('fill', ({ trace: d }) =>
                        d.hatch.type === 'lines'
                            ? `url(#${patId(d)})`
                            : d.color
                    )
                    .attr(
                        'fill-opacity',
                        ({ trace: d, j, n }) => d.hatch.opacity * (1 - j / n)
                    )
                    .each(function ({ trace: d, j, n }) {
                        const nd = slabPath(d, j, n);
                        if (this.getAttribute('d') !== nd) {
                            moved = true;
                            this.setAttribute('d', nd);
                        }
                    }),
        });

        // Hide during motion, fade back in once settled. A continuous slider
        // drag keeps re-hiding, so the hatches stay gone until the drag ends.
        // (?static / zero-duration mode never hides: seeds stay complete.)
        if (moved && this.config.transitionDuration > 0) {
            this.hatchGroup
                .interrupt('hatch-show')
                .attr('opacity', 0)
                .transition('hatch-show')
                .delay(this.config.transitionDuration)
                .duration(200)
                .attr('opacity', 1);
        }
    }

    _drawTraces() {
        const lineGenerator = d3
            .line()
            .x((d) => this.xScale(d.x))
            .y((d) => this.yScale(d.y))
            .defined((d) => d.y !== null && !isNaN(d.y) && isFinite(d.y));

        this.drawElements({
            parentGroups: this.linesGroup,
            element: 'path',
            cssClass: 'bd-data-line',
            data: this.traceData,
            dataKey: (d) => d.id,
            onNew: (s) =>
                s
                    .attr('fill', 'none')
                    .attr('stroke', (d) => d.color)
                    .attr('stroke-width', (d) => d.style.lineWidth)
                    .attr('stroke-dasharray', (d) => d.style.dasharray)
                    .attr('stroke-linecap', (d) => d.style.linecap ?? null),
            onUpdateTransition: (s) =>
                s.attr('d', (d) => lineGenerator(d.points)),
        });
    }

    /** Break glyphs marking per-species display offsets (refShift). */
    _drawRefShiftGlyphs() {
        // Crosses the trace, per species. Hover gives the exact shift.
        const ZIG = REFSHIFT_ZIG;
        const groups = this.drawElements({
            parentGroups: this.linesGroup,
            element: 'g',
            cssClass: 'bd-refshift',
            data: this.traceData.filter((d) => d.refShift != null),
            dataKey: (d) => d.id,
            onNew: (g) => {
                g.style('pointer-events', 'all').style('cursor', 'help');
                g.append('title');
                g.append('path')
                    .attr('class', 'bd-refshift-halo')
                    .attr('d', ZIG)
                    .attr('fill', 'none')
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 4.5)
                    .attr('stroke-linecap', 'round');
                g.append('path')
                    .attr('class', 'bd-refshift-zig')
                    .attr('d', ZIG)
                    .attr('fill', 'none')
                    .attr('stroke-width', 1.6)
                    .attr('stroke-linecap', 'round');
            },
            onUpdateTransition: (s) =>
                s.attr(
                    'transform',
                    (d) =>
                        `translate(${this.xScale(d.refShiftPos.x)}, ${this.yScale(d.refShiftPos.y)})`
                ),
        });
        groups
            .select('title')
            .text(
                (d) =>
                    `drawn ${d.refShift >= 0 ? '+' : ''}${d.refShift.toFixed(2)} V from its IUPAC-referenced position (per-species display offset)`
            );
        groups.select('.bd-refshift-zig').attr('stroke', (d) => d.color);
    }

    /** Corner note keying the ⌇ break glyphs. Drawn whenever any trace carries
     * a refShift; config.refShiftBlurbCorner picks which corner. The glyph is
     * drawn as artwork (the same zig path as on the traces), not font text. */
    _drawRefShiftBlurb() {
        const corner = this.config.refShiftBlurbCorner;
        const PAD = 4;
        const ZIG_SCALE = 0.6;
        const anyRefShift = this.traceData.some((d) => d.refShift != null);
        this.drawStaticElements({
            parentGroups: this.linesGroup,
            element: 'g',
            cssClass: 'bd-refshift-blurb',
            data: anyRefShift ? [corner] : [],
            onNew: (g) => {
                g.append('text').attr('class', 'bd-blurb-open').text('(');
                g.append('path')
                    .attr('d', REFSHIFT_ZIG)
                    .attr('fill', 'none')
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 4.5)
                    .attr('stroke-linecap', 'round');
                g.append('path')
                    .attr('class', 'bd-blurb-zig')
                    .attr('d', REFSHIFT_ZIG)
                    .attr('fill', 'none')
                    .attr('stroke', '#555')
                    .attr('stroke-width', 1.6)
                    .attr('stroke-linecap', 'round');
                g.append('text')
                    .attr('class', 'bd-blurb-rest')
                    .text('= per-species offset)');
            },
            onUpdateImmediate: (s) =>
                s.each((d, i, nodes) => {
                    const g = d3.select(nodes[i]);
                    const open = g.select('text.bd-blurb-open');
                    const rest = g.select('text.bd-blurb-rest');
                    const baseline =
                        corner[0] === 't' ? PAD + 8 : this.plotHeight - PAD;
                    // lay out "(" + zig + "= per-species offset)" left to right
                    const xGlyph =
                        open.node().getComputedTextLength() + 1.5 + 3 * ZIG_SCALE;
                    const xRest = xGlyph + 3 * ZIG_SCALE + 3;
                    open.attr('x', 0).attr('y', baseline);
                    g.selectAll('path').attr(
                        'transform',
                        // zig path spans y -7..8 around its origin; centre it
                        // on the text's x-height
                        `translate(${xGlyph}, ${baseline - 3.8}) scale(${ZIG_SCALE})`
                    );
                    rest.attr('x', xRest).attr('y', baseline);
                    const total =
                        xRest + rest.node().getComputedTextLength();
                    g.attr(
                        'transform',
                        `translate(${corner[1] === 'l' ? PAD : this.plotWidth - PAD - total}, 0)`
                    );
                }),
        });
    }

    /** Draws or updates the vertical marker symbols. */
    _drawVerticalMarkers() {
        const markerStyle = STYLE_DEFAULTS.verticalMarker;

        // Per-marker overall group
        const markerGroups = this.drawElements({
            parentGroups: this.verticalMarkersGroup,
            element: 'g',
            cssClass: 'bd-marker',
            data: this.markerData,
            dataKey: (d) => d.id,
            onUpdateTransition: (s) =>
                s.attr('transform', (d) => `translate(${this.xScale(d.x)}, 0)`),
        });

        // Per-marker vertical line
        this.drawElements({
            parentGroups: markerGroups,
            element: 'line',
            cssClass: 'bd-marker-line',
            data: (d) => [d],
            onNew: (s) =>
                s
                    .attr('stroke', markerStyle.legColor)
                    .attr('stroke-width', markerStyle.legWidth)
                    .attr('x1', 0)
                    .attr('x2', 0),
            onUpdateTransition: (s) =>
                s

                    .attr('y1', (d) => this.yScale(d.yMin))

                    .attr('y2', (d) => this.yScale(d.yMax)),
        });

        // Per-marker legs group
        const markerLegGroups = this.drawElements({
            parentGroups: markerGroups,
            element: 'g',
            cssClass: 'bd-marker-legs',
            data: (d) => [d],
        });

        this.drawElements({
            parentGroups: markerLegGroups,
            element: 'circle',
            cssClass: 'bd-marker-leg-dot',
            data: (d) => d.legData,
            dataKey: (leg) => leg.id,
            onNew: (s) =>
                s
                    .attr('stroke-width', 0)
                    .attr('cx', 0),
            onUpdateImmediate: (s) =>
                s
                    .attr('r', (leg) =>
                        leg.ghostColor
                            ? markerStyle.legEndRadius + 1
                            : markerStyle.legEndRadius
                    )
                    .attr('fill', (leg) => leg.ghostColor ?? markerStyle.legColor),
            onUpdateTransition: (s) => s.attr('cy', (d) => this.yScale(d.y)),
        });
        // Coloured node dots must land on top of plain black dots when levels
        // coincide (e.g. a driven marker relaxed back to equilibrium).
        markerLegGroups
            .selectAll('circle.bd-marker-leg-dot')
            .filter((leg) => !!leg.ghostColor)
            .raise();

        // Driven-reaction residual: fat coloured segment ghost -> actual,
        // arrowhead at the lower end. Hidden (opacity) when the residual is
        // shorter than a few px, so it degenerates smoothly to plain ⇌.
        const drivenGroups = this.drawElements({
            parentGroups: markerGroups,
            element: 'g',
            cssClass: 'bd-marker-driven',
            data: (d) => (d.driven ? [d] : []),
            dataKey: () => 'driven',
        });
        this.drawElements({
            parentGroups: drivenGroups,
            element: 'line',
            cssClass: 'bd-marker-driven-line',
            data: (d) => [d],
            onNew: (s) =>
                s
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('stroke-width', 4)
                    .style('cursor', 'help')
                    .on('pointerover', (event, d) =>
                        this._handleMarkerPointerOver(event, d.id)
                    )
                    .on('pointerout', (event, d) =>
                        this._handleMarkerPointerOut(event, d.id)
                    )
                    .on('pointermove', (event) => event.stopPropagation()),
            onUpdateImmediate: (s) => s.attr('stroke', (d) => d.driven.color),
            onUpdateTransition: (s) =>
                s
                    .attr('y1', (d) => this.yScale(d.driven.yGhost))
                    .attr('y2', (d) => this.yScale(d.driven.y))
                    .attr('opacity', (d) =>
                        Math.abs(
                            this.yScale(d.driven.yGhost) -
                                this.yScale(d.driven.y)
                        ) > 4
                            ? 1
                            : 0
                    ),
        });
        this.drawElements({
            parentGroups: drivenGroups,
            element: 'path',
            cssClass: 'bd-marker-driven-arrow',
            data: (d) => [d],
            onNew: (s) => s.attr('stroke-width', 0),
            onUpdateImmediate: (s) => s.attr('fill', (d) => d.driven.color),
            onUpdateTransition: (s) =>
                s
                    .attr('transform', (d) => {
                        // head at the LOWER (larger pixel-y) end; a pump
                        // instead points at the UPPER end, glyph flipped
                        const y0 = this.yScale(d.driven.yGhost);
                        const y1 = this.yScale(d.driven.y);
                        const yHead = d.driven.pump
                            ? Math.min(y0, y1)
                            : Math.max(y0, y1);
                        return `translate(0, ${yHead})${d.driven.pump ? ' scale(1,-1)' : ''}`;
                    })
                    .attr('d', 'M -5 -8 L 0 0 L 5 -8 L 0 -4.5 Z')
                    .attr('opacity', (d) =>
                        Math.abs(
                            this.yScale(d.driven.yGhost) -
                                this.yScale(d.driven.y)
                        ) > 4
                            ? 1
                            : 0
                    ),
        });
        this.drawElements({
            parentGroups: drivenGroups,
            element: 'text',
            cssClass: 'bd-marker-driven-label',
            data: (d) => (d.driven.label ? [d] : []),
            onNew: (s) =>
                s
                    .attr('font-size', 12)
                    .attr('font-style', 'italic')
                    .attr('text-anchor', 'start')
                    .attr('dominant-baseline', 'middle')
                    .attr('x', 7),
            onUpdateImmediate: (s) =>
                s.attr('fill', (d) => d.driven.color).text((d) => d.driven.label),
            onUpdateTransition: (s) =>
                s
                    .attr('y', (d) =>
                        0.5 *
                        (this.yScale(d.driven.yGhost) + this.yScale(d.driven.y))
                    )
                    .attr('opacity', (d) =>
                        Math.abs(
                            this.yScale(d.driven.yGhost) -
                                this.yScale(d.driven.y)
                        ) > 12
                            ? 1
                            : 0
                    ),
        });

        // Per-marker central symbol (symbol: null -> no bubble; used by
        // bare single-species current arrows, where the arrow IS the marker)
        this.drawElements({
            parentGroups: markerGroups,
            element: 'g',
            cssClass: 'bd-marker-symbol',
            data: (d) => (d.symbol ? [d] : []),
            dataKey: () => 'symbol',
            onNew: (symbolGroup) => {
                symbolGroup
                    .append('circle')
                    .attr('class', 'bd-marker-bg')
                    .attr('r', markerStyle.backgroundRadius)
                    .attr('fill', markerStyle.backgroundColor)
                    .attr('stroke', markerStyle.backgroundStroke)
                    .attr('stroke-width', 1)
                    .style('cursor', 'help')
                    .on('pointerover', (event, d) =>
                        this._handleMarkerPointerOver(event, d.id)
                    )
                    .on('pointerout', (event, d) =>
                        this._handleMarkerPointerOut(event, d.id)
                    )
                    .on('pointermove', (event) => {
                        // Prevent move reaching interactionRect
                        event.stopPropagation();
                    })
                    .on('click', (event, d) => {
                        event.stopPropagation();
                        this._handleClickInteraction(event, d.id);
                    });

                symbolGroup
                    .append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('font-size', markerStyle.fontSize)
                    .attr('fill', markerStyle.color)
                    .style('pointer-events', 'none')
                    .text((d) => d.symbol);
            },
            onUpdateTransition: (s) => {
                s.attr(
                    'transform',
                    (d) => `translate(0,${this.yScale(d.ySymbol)})`
                );
                // symbol text can change between updates (e.g. +/− markers)
                s.select('text').text((d) => d.symbol);
            },
        });

        // Optional KaTeX label beside the symbol bubble, naming the marked
        // gap (e.g. an electrode potential E). labelHAlign 'left' extends
        // rightward from the marker line, 'right' extends leftward.
        this.drawLabelsFancy({
            parentGroups: markerGroups,
            cssClass: 'bd-marker-label',
            labelData: (d) =>
                d.label
                    ? [
                          {
                              ...d,
                              mathMode: true,
                              hAlign: d.labelHAlign,
                              vAlign: 'center',
                          },
                      ]
                    : [],
            dataKey: () => 'label',
            onUpdateTransition: (s) =>
                s
                    .attr('transform', (d) => {
                        const standoff =
                            markerStyle.backgroundRadius +
                            (d.symbol ? 4 : 2);
                        const dx =
                            d.labelHAlign === 'right' ? -standoff : standoff;
                        return `translate(${dx}, ${this.yScale(d.ySymbol)})`;
                    })
                    .select('span.rp-label-span')
                    .style('color', markerStyle.color),
        });
    }

    _drawTraceLabels() {
        // TODO: Smarter label positioning to avoid overlaps.
        this.drawTraceLabels({
            traces: this.traceData,
            parentGroups: this.traceLabelsGroup,
            cssClass: 'bd-line-label',
        });
    }

    // ========================================================================
    // Private Interaction Handlers
    // ========================================================================

    /** Handles all click events on the plot area */
    _handleClickInteraction(event, targetId = null) {
        if (targetId) {
            event.stopPropagation(); // Stop if click was on a specific element (line/marker)
        }

        // If clicking the currently pinned element, unpin it.
        if (
            targetId &&
            this._pinnedPopupInfo &&
            this._pinnedPopupInfo[1] === targetId
        ) {
            this._hidePopup(); // Clears pin state and highlights
            return;
        }

        // Clear previous pin state and highlights before setting new one
        this._pinnedPopupInfo = null; // Clear pin first
        this._hidePopup(); // Clear pin, hide popup, reset highlights

        if (targetId === null) {
            // Click on background - try to find closest trace
            const [pointerX, pointerY] = d3.pointer(
                event,
                this.plotArea.node()
            );
            const xValue = this.xScale.invert(pointerX);
            const closestResult = this._findClosestTrace(xValue, pointerY);

            if (closestResult && closestResult.minDistPx < HIT_THRESHOLD_PX) {
                this._showTracePopup(event, closestResult); // Show trace popup
            }
            // If no close trace, _hidePopup was already called, so nothing more to do
        } else {
            // Click on a vertical marker → show its custom popup (if one is
            // registered); otherwise this quietly leaves the popup hidden.
            this._showVerticalMarkerPopup(event, targetId);
        }
    }

    /** Gathers info, calls callback, shows popup for a data trace */
    _showTracePopup(event, closestResult) {
        if (!this._tracePopupCallback) return;
        const trace = closestResult.trace;
        const point = closestResult.pointData;
        const xValue = point.x;

        // Find Region Info
        let regionIndex = -1;
        let regionInfo = null;
        if (this.boundaries && this.boundaries.length > 1) {
            // Find index i such that boundaries[i] <= xValue < boundaries[i+1]
            // or boundaries[i] <= xValue <= boundaries[i+1] for the last region
            regionIndex = this.boundaries.findIndex((b, i, arr) => {
                if (i === arr.length - 1) return false; // Stop before last boundary element
                const next_b = arr[i + 1];
                const isLastRegionCheck = i === arr.length - 2; // Is this the last interval?
                // Check within bounds, handle floating point precision near boundaries
                const epsilon = 1e-9; // Small tolerance
                return (
                    xValue >= b - epsilon &&
                    (xValue < next_b - epsilon ||
                        (isLastRegionCheck && xValue <= next_b + epsilon))
                );
            });

            if (
                regionIndex !== -1 &&
                this.regionProps &&
                this.regionProps[regionIndex]
            ) {
                regionInfo = {
                    index: regionIndex,
                    name:
                        this.regionProps[regionIndex].name ||
                        `Region ${regionIndex}`,
                    color: this.regionProps[regionIndex].color, // Pass color too
                    startX: this.boundaries[regionIndex],
                    endX: this.boundaries[regionIndex + 1],
                };
            } else {
                // Handle case where xValue might be exactly on the start/end boundary?
                // Or slightly outside due to padding/nice(). Assign to nearest?
                // For now, null if not strictly within a defined region.
                // console.warn(`Could not find region for xValue: ${xValue}`);
            }
        }

        const popupInfo = {
            traceId: trace.id,
            label: trace.label,
            xValue: xValue,
            yValue: point.y,
            traceExtraData: trace.extraData,
            regionIndex: regionIndex,
            regionInfo: regionInfo,
            pointEvent: event,
        };

        try {
            const content = this._tracePopupCallback(popupInfo);
            if (content) {
                this._setPopup(event, content, ['trace', trace.id]); // Show pinned popup
                this._setActiveHighlight({ type: 'trace', id: trace.id }); // Set highlight
            } else {
                this._hidePopup();
            }
        } catch (e) {
            console.error('Error in trace popup callback:', e);
            this._hidePopup();
        }
    }

    /** Gathers info, calls callback, shows popup for a vertical marker */
    _showVerticalMarkerPopup(event, markerId) {
        const markerData = this.markerData.find((x) => x.id === markerId);
        if (!markerData || typeof markerData.popupCallback !== 'function') {
            // No custom popup registered for this marker — leave the hover
            // tooltip as the only affordance; nothing to pin.
            this._hidePopup();
            return;
        }

        const markerPopupInfo = {
            markerId: markerId,
            xValue: markerData.x,
            y1_display: markerData.yMin,
            y2_display: markerData.yMax,
            customArgs: markerData.popupArgs,
            pointEvent: event,
        };

        try {
            const content = markerData.popupCallback(markerPopupInfo);
            if (content) {
                this._setPopup(event, content, ['marker', markerId]); // Show pinned popup
                this._setActiveHighlight({ type: 'marker', id: markerId });
            } else {
                this._hidePopup();
            }
        } catch (e) {
            console.error(`Error in popup callback for marker ${markerId}:`, e);
            this._hidePopup();
        }
    }

    /** Handles pointer move over the main interaction rectangle (for line highlights/tooltips) */
    _handlePointerMoveInteractionRect(event) {
        // Throttle this handler
        if (this._hoverThrottleWaiting) return;
        this._hoverThrottleWaiting = true;
        this._hoverThrottleTimeout = setTimeout(() => {
            this._hoverThrottleWaiting = false;
            this._hoverThrottleTimeout = null;
        }, this.config.hoverThrottleDelay); // Use configured delay

        // Logic to execute on throttled event
        if (this._pinnedPopupInfo) return; // Do nothing if popup is pinned

        const [pointerX, pointerY] = d3.pointer(event, this.plotArea.node());
        const xValue = this.xScale.invert(pointerX);
        const closestResult = this._findClosestTrace(xValue, pointerY);

        if (closestResult && closestResult.minDistPx < HIT_THRESHOLD_PX) {
            const trace = closestResult.trace;
            // Generate brief content
            const briefContent = trace.toolTip + ' ›'; // Add hint arrow

            this._setPopup(event, briefContent); // Show brief tooltip
            this._setActiveHighlight({ type: 'trace', id: trace.id }); // Show temp highlight
        } else {
            this._hidePopup(); // Also de-highlights
        }
    }

    /** Handles pointer leaving the main interaction rectangle */
    _handlePointerOutInteractionRect(event) {
        if (!this._pinnedPopupInfo) {
            this._hidePopup(); // Also de-highlights
        }
    }

    /** Handles pointer entering a vertical marker */
    _handleMarkerPointerOver(event, markerId) {
        event.stopPropagation();
        if (!this._pinnedPopupInfo) {
            const markerData = this.markerData.find((x) => x.id === markerId);
            const symbol = markerData?.symbol || '⇌';
            // Generate generic brief content for marker hover
            let briefContent = null;
            if (symbol == '⇌') {
                briefContent = `Equilibrium ›`;
            } else {
                briefContent = `Vertical difference ›`;
            }
            this._setPopup(event, briefContent); // Show brief tooltip
            this._setActiveHighlight({ type: 'marker', id: markerId }); // Show temp highlight
        }
    }

    /** Handles pointer leaving a vertical marker */
    _handleMarkerPointerOut(event, markerId) {
        event.stopPropagation();
        if (!this._pinnedPopupInfo) {
            // Only clear if leaving the currently hover-highlighted marker
            if (
                this._highlightedElementInfo?.type === 'marker' &&
                this._highlightedElementInfo?.id === markerId
            ) {
                this._hidePopup(); // Also de-highlights
            }
        }
    }

    // ========================================================================
    // Private Popup/Highlight Helpers
    // ========================================================================

    /** Sets the popup content, renders KaTeX, calculates position, displays it. */
    _setPopup(event, htmlContent, pinnedPopupInfo = null) {
        if (!htmlContent) {
            this._hidePopup();
            return;
        }
        // If this is to be a pinned (clicked) popup, enable pointer events to allow
        // text selection. Otherwise, for mouse hover popups disable pointer events
        // to discourage potential flickering problems.
        this._pinnedPopupInfo = pinnedPopupInfo;
        this._popupDiv
            .style('pointer-events', pinnedPopupInfo ? 'auto' : 'none')
            .html(htmlContent);
        if (typeof renderMathInElement === 'function') {
            try {
                renderMathInElement(this._popupDiv.node(), {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true },
                    ],
                    throwOnError: false,
                });
            } catch (e) {
                console.error(e);
            }
        } else {
            console.warn('KaTeX auto-render extension not loaded.');
        }

        // Measure actual popup dimensions
        const popupNode = this._popupDiv.node();
        const popupWidth = popupNode.offsetWidth;
        const popupHeight = popupNode.offsetHeight;

        // Get coordinates relative to container for positioning anchor
        const [containerX, containerY] = d3.pointer(
            event,
            this.container.node()
        );
        const containerWidth = this.container.node().clientWidth;
        const containerHeight = this.container.node().clientHeight;

        let targetX = containerX + 5;
        let targetY = containerY - 5 - popupHeight;
        if (targetX + popupWidth > containerWidth) {
            targetX = containerX - 5 - popupWidth;
        }
        if (targetX < 0) {
            targetX = 5;
        }
        if (targetY < 0) {
            targetY = containerY + 5;
        }
        if (targetY + popupHeight > containerHeight) {
            targetY = containerHeight - popupHeight - 5;
        }
        this._popupDiv
            .style('visibility', 'visible')
            .call(
                this.transition((s) =>
                    s
                        .style('left', `${targetX}px`)
                        .style('top', `${targetY}px`)
                        .style('opacity', 1)
                )
            );
    }

    /** Hides the popup and resets all highlights and pinned state. */
    _hidePopup() {
        this._popupDiv.style('visibility', 'hidden').style('opacity', 0);
        this._setActiveHighlight(null); // Clear any active highlight (pinned or hover)
        this._pinnedPopupInfo = null; // Clear pinned state
    }

    /** Applies/resets highlight style ONLY for data traces. */
    _applyHighlight(targetTraceId) {
        const highlightWidthIncrease = 2;
        const isPinned = targetTraceId !== null; // Check if a specific trace should be highlighted
        this.linesGroup
            .selectAll('path.bd-data-line')
            .interrupt()
            .transition()
            .duration(50)
            .style('opacity', 1.0) // Keep all lines opaque
            .attr('stroke-width', (d) =>
                isPinned && d.id === targetTraceId
                    ? d.style.lineWidth + highlightWidthIncrease
                    : d.style.lineWidth
            );
    }

    /** Apply/reset highlight styles for vertical markers */
    _applyVerticalMarkerHighlight(targetMarkerId) {
        const markerStyle = STYLE_DEFAULTS.verticalMarker;

        // Select all marker groups: highlight our target and return the others to normal.
        this.verticalMarkersGroup
            .selectAll('g.bd-marker')
            .each((d, i, nodes) => {
                const group = d3.select(nodes[i]);
                const isTarget = d.id === targetMarkerId; // Is this the specific marker to highlight?

                // Transition background circle style
                group
                    .select('circle.bd-marker-bg')
                    .interrupt()
                    .transition()
                    .duration(50)
                    .attr(
                        'fill',
                        isTarget
                            ? markerStyle.highlightColor
                            : markerStyle.backgroundColor
                    )
                    .attr(
                        'stroke',
                        isTarget
                            ? markerStyle.highlightStroke
                            : markerStyle.backgroundStroke
                    );

                const myLegColor = isTarget
                    ? markerStyle.highlightStroke
                    : markerStyle.legColor;
                const myLegWidth = isTarget
                    ? markerStyle.legWidth + 1 // Make legs slightly thicker
                    : markerStyle.legWidth;
                const myLegRadius = isTarget
                    ? markerStyle.legEndRadius + 1 // Make end circles slightly larger
                    : markerStyle.legEndRadius;

                group
                    .selectAll('line.bd-marker-line')
                    .interrupt()
                    .transition()
                    .duration(50)
                    .attr('stroke-width', myLegWidth)
                    .attr('stroke', myLegColor);

                // Species-coloured node dots keep their color and size bump —
                // repainting them to the leg color made them vanish against
                // the black dot whenever any trace was hovered.
                group
                    .selectAll('circle.bd-marker-leg-dot')
                    .interrupt()
                    .transition()
                    .duration(50)
                    .attr('r', (leg) =>
                        leg.ghostColor ? myLegRadius + 1 : myLegRadius
                    )
                    .attr('fill', (leg) => leg.ghostColor ?? myLegColor);
            });
    }

    /** Sets the active highlight, ensuring only one element is highlighted. */
    _setActiveHighlight(highlightInfo = null) {
        // Avoid redundant work if highlight target hasn't changed
        if (
            this._highlightedElementInfo?.type === highlightInfo?.type &&
            this._highlightedElementInfo?.id === highlightInfo?.id
        ) {
            return;
        }

        const newType = highlightInfo?.type;
        const newId = highlightInfo?.id;

        // Reset highlights based on type (call simplified helpers)
        this._applyHighlight(newType === 'trace' ? newId : null);
        this._applyVerticalMarkerHighlight(newType === 'marker' ? newId : null);
        // Add resets for other future types here

        // Store the new highlight state
        this._highlightedElementInfo = highlightInfo;
    }

    /**
     * Finds the trace that is vertically closest to the pointer at a given x-coordinate.
     * @param {number} xValue - The x-coordinate in data space.
     * @param {number} pointerY - The y-coordinate of the pointer in pixel space.
     * @returns {object | null} - Object { trace, pointData, minDistPx } or null if no suitable trace found.
     */
    _findClosestTrace(xValue, pointerY) {
        let closestTraceInfo = null;
        let minDistPx = Infinity;
        const yValue = this.yScale.invert(pointerY);

        for (const trace of this.traceData) {
            // Skip traces without points spanning this xValue
            if (
                trace.points.length < 2 ||
                xValue < trace.points[0].x ||
                xValue > trace.points[trace.points.length - 1].x
            ) {
                continue;
            }

            // Find points bracketing xValue
            let lindex = d3.bisector((p) => p.x).left(trace.points, xValue);
            // result: x[lindex] is >= xValue, and all previous x are < xValue.

            if (lindex === 0) {
                // special case for x[0] === xValue so that p0 and p1 work below
                lindex = 1;
            }
            if (lindex >= trace.points.length) {
                // should never happen due to prior checks
                continue;
            }

            // Now interpolate
            const p0 = trace.points[lindex - 1];
            const p1 = trace.points[lindex];
            // x_interp = xValue
            let y_interp = null;

            if (p1.x !== p0.x) {
                // Sloped line segment: interpolate
                const t = (xValue - p0.x) / (p1.x - p0.x);
                y_interp = p0.y + t * (p1.y - p0.y);
            } else {
                // Vertical segment weird special case
                let ymin = Math.min(p0.y, p1.y);
                let ymax = Math.max(p0.y, p1.y);
                // choose y coord closest to target
                if (yValue < ymin) y_interp = ymin;
                else if (yValue > ymax) y_interp = ymax;
                else y_interp = yValue;
            }
            // Calculate vertical distance in pixels if interpolation was successful
            if (isFinite(y_interp)) {
                const distY = Math.abs(this.yScale(y_interp) - pointerY);
                if (distY < minDistPx) {
                    minDistPx = distY;
                    closestTraceInfo = {
                        trace: trace, // The closest trace object
                        pointData: { x: xValue, y: y_interp },
                        minDistPx: distY, // Store the distance found
                    };
                }
            }
        }

        return closestTraceInfo; // Return object { trace, pointData, minDistPx } or null
    }

    // ========================================================================
    // Destroy Method
    // ========================================================================

    /** Cleans up resources like observers and listeners. */
    destroy() {
        clearTimeout(this._hoverThrottleTimeout);
        this._hidePopup();
        super.destroy();
    }
} // End of class

export default BandDiagram;
