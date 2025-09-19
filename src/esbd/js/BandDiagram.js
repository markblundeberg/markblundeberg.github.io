// BandDiagram.js

// Assumes D3 and KaTeX (core + auto-render) are loaded globally or imported appropriately.

import { renderSpanMath } from './utils.js';
import ResponsivePlot from './ResponsivePlot.js';

// Default styling constants
const STYLE_DEFAULTS = {
    line: { lineWidth: 3, dasharray: null },
    interface: {
        lineWidth: 1,
        dasharray: '3,3',
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
     * @param {number} [config.hoverThrottleDelay=50] - Mouseover throttling.
     */
    constructor(containerId, config = {}) {
        // Configuration with defaults
        const defaults = { xMode: 'abstract', hoverThrottleDelay: 50 };
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
        if (!typeof yLabelStr == 'string') {
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
                    ...extraFields
                } = traceDef;
                if (Object.keys(extraFields).length > 0) {
                    const unexpectedKeys = Object.keys(extraFields).join(', ');
                    throw new Error(
                        `Unexpected fields were provided: ${unexpectedKeys}`
                    );
                }

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
                // place label at right end of trace
                const labelPos = showLabel && label ? points[len - 1] : null;

                toolTip = String(toolTip ?? '') || `$${label}$`;

                const processedTrace = {
                    id,
                    points,
                    color,
                    style,
                    label,
                    labelPos,
                    toolTip,
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
            if (Object.keys(extraFields).length > 0) {
                const unexpectedKeys = Object.keys(extraFields).join(', ');
                throw new Error(
                    `Unexpected fields were provided: ${unexpectedKeys}`
                );
            }
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
                popupCallback = null,
                popupArgs = null,
                ...extraFields
            } = markerDef;
            if (Object.keys(extraFields).length > 0) {
                const unexpectedKeys = Object.keys(extraFields).join(', ');
                throw new Error(
                    `Unexpected fields were provided: ${unexpectedKeys}`
                );
            }

            if (typeof id !== 'string') throw Error('missing/bad id');
            if (seenIds.has(id)) throw Error('duplicate id: ' + id);
            seenIds.add(id);

            const legData = [];
            let yMin = yDefs[0].y;
            let yMax = yDefs[0].y;
            for (let i = 0; i < yDefs.length; i++) {
                const { id: yid, y } = yDefs[i];
                if (y < yMin) yMin = y;
                if (y > yMax) yMax = y;
                legData.push({
                    id: yid ?? 'leg-' + i,
                    y: y,
                });
            }

            markerData.push({
                id,
                x,
                legData,
                ySymbol: 0.5 * (yMin + yMax),
                yMin,
                yMax,
                symbol,
                popupCallback,
                popupArgs,
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
        this._drawTraces();
        this._drawVerticalMarkers();
        this._drawTraceLabels();
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
            onUpdateTransition: (s) =>
                s
                    .attr('x', (d) => this.xScale(d.x))
                    .attr('y', (d) => {
                        if (d.y === 'top') return -2;
                        else if (typeof d.y === 'number')
                            return this.yScale(d.y);
                        // Default to 'bottom'
                        return this.plotHeight + 2;
                    })
                    .attr('dx', (d) => d.dx)
                    .attr('dy', (d) => d.dy)
                    .attr('text-anchor', 'middle')
                    .text((d) => d.label || ''),
        });
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
                    .attr('stroke-dasharray', (d) => d.style.dasharray),
            onUpdateTransition: (s) =>
                s.attr('d', (d) => lineGenerator(d.points)),
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
                    .attr('r', markerStyle.legEndRadius)
                    .attr('stroke-width', 0)
                    .attr('fill', markerStyle.legColor)
                    .attr('cx', 0),
            onUpdateTransition: (s) => s.attr('cy', (d) => this.yScale(d.y)),
        });

        // Per-marker central symbol
        this.drawElements({
            parentGroups: markerGroups,
            element: 'g',
            cssClass: 'bd-marker-symbol',
            data: (d) => [d],
            onNew: (symbolGroup) => {
                symbolGroup
                    .append('circle')
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
            onUpdateTransition: (s) =>
                s.attr(
                    'transform',
                    (d) => `translate(0,${this.yScale(d.ySymbol)})`
                ),
        });
    }

    _drawTraceLabels() {
        // Map trace data to the format expected by drawLabelsFancy
        const labelData = this.traceData
            .filter((d) => d.labelPos && d.label)
            .map((d) => ({
                ...d, // Pass original data through
                mathMode: true, // Trace labels are KaTeX math
                hAlign: 'left',
                vAlign: 'center',
            }));

        // TODO: Smarter label positioning to avoid overlaps.

        this.drawLabelsFancy({
            parentGroups: this.traceLabelsGroup,
            cssClass: 'bd-line-label',
            labelData: labelData,
            dataKey: (d) => d.id,
            onUpdateTransition: (s) =>
                s
                    .attr(
                        'transform',
                        (d) =>
                            `translate(${this.xScale(d.labelPos.x) + 5}, ${this.yScale(d.labelPos.y)})`
                    )
                    .select('span.rp-label-span')
                    .style('color', (d) => d.color),
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
            const clickThresholdPx = 15; // How close vertically?
            const closestResult = this._findClosestTrace(xValue, pointerY);

            if (closestResult && closestResult.minDistPx < clickThresholdPx) {
                this._showTracePopup(event, closestResult); // Show trace popup
            }
            // If no close trace, _hidePopup was already called, so nothing more to do
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
            console.warn(
                `No marker data or callback found for markerId: ${markerId}`
            );
            this._hidePopup();
            return;
        }

        const markerPopupInfo = {
            markerId: markerId,
            xValue: d.x,
            y1_display: d.y1,
            y2_display: d.y2,
            customArgs: d.popupArgs,
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
        const hoverThresholdPx = 15;
        const closestResult = this._findClosestTrace(xValue, pointerY);

        if (closestResult && closestResult.minDistPx < hoverThresholdPx) {
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
            .selectAll('g.bd-vertical-marker')
            .each((d, i, nodes) => {
                const group = d3.select(nodes[i]);
                const isTarget = d.id === targetMarkerId; // Is this the specific marker to highlight?

                // Transition background circle style
                group
                    .select('circle.marker-bg')
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
                    .selectAll('line.marker-leg-1, line.marker-leg-2')
                    .interrupt()
                    .transition()
                    .duration(50)
                    .attr('stroke-width', myLegWidth)
                    .attr('stroke', myLegColor);

                group
                    .selectAll('circle.marker-leg-end-circle')
                    .interrupt()
                    .transition()
                    .duration(50)
                    .attr('r', myLegRadius)
                    .attr('fill', myLegColor);
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
