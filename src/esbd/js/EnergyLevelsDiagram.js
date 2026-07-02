// EnergyLevelsDiagram.js
// A D3 component for drawing simple energy/potential level diagrams
// with discrete horizontal categories.

import * as d3 from 'd3';
import ResponsivePlot from './ResponsivePlot.js';
import { bandScale } from './utils.js';

class EnergyLevelsDiagram extends ResponsivePlot {
    // ========================================================================
    // Constructor
    // ========================================================================

    /**
     * Creates an instance of the EnergyLevelsDiagram.
     * @param {string} containerId - ID of the HTML element to contain the plot.
     * @param {object} [config={}] - Initial configuration options. See ResponsivePlot for more options.
     * @param {string} [config.yAxisLabel='Potential / Energy'] - Label for Y axis (can contain KaTeX delimiters like $..$).
     * @param {Array<number>} [config.yRange=[0, 1]] - Initial [min, max] for Y axis domain.
     * @param {boolean} [config.showYTicks=true] - Whether to show Y axis ticks and labels.
     * @param {Array<object>} [config.categories=[]] - Categories for the X axis. Array of {id: string, label: string}.
     * @param {number} [config.bandPaddingInner=1.0] - Gap between bands, as a fraction of bandwidth.
     * @param {number} [config.bandPaddingOuter=0.5] - Inset at each edge, as a fraction of bandwidth (0 = bands touch the margins; works for a single band too).
     * @param {number} [config.bandMinPaddingInner=0] - Pixel minimum for the inter-band gap (room for labels hung off band ends; survives responsive squeeze).
     * @param {number|{left:number,right:number}} [config.bandMinPaddingOuter=0] - Pixel minimum for the edge insets, per side if an object.
     * @param {object} [config.defaultLevelStyle] - Default styles for levels.
     */
    constructor(containerId, config = {}) {
        const defaults = {
            yAxisLabel: 'Potential / Energy',
            hoverThrottleDelay: 50,
            yRange: [0, 1],
            showYTicks: true,
            categories: [],
            bandPaddingInner: 1.0,
            bandPaddingOuter: 0.1,
            bandMinPaddingInner: 0,
            bandMinPaddingOuter: 40,
            defaultLevelStyle: {
                color: 'black',
                lineWidth: 2,
                dasharray: null,
            },
        };
        // Doctrine: margins default TIGHT (label room is exercised through the
        // band padding controls, not the margins); numeric y ticks need a
        // wider left margin than an abstract axis.
        const margins = {
            top: 8,
            right: 12,
            bottom: 20,
            left: (config.showYTicks ?? defaults.showYTicks) ? 48 : 24,
            ...config?.margins,
        };
        super({ containerId: containerId, ...defaults, ...config, margins });
        // ^ sets this.config, with extra defaults

        this.setYRange(...this.config.yRange);

        this.levelsData = [];
        this.arrowData = []; // Stores arrow definitions from setArrows
        this.levelPositions = new Map(); // Stores calculated pixel positions {x_center_px, y_px} for each levelId

        this._setupD3Structure();
    }

    // ========================================================================
    // Public API Methods
    // ========================================================================

    /**
     * Updates the levels displayed on the diagram.
     * @param {Array<object>} [levelsData=[]] - Flat array of level objects.
     * Expected format: [{ categoryId, levelId, yValue, label (raw LaTeX), color?, style?: {lineWidth?, dasharray?} }, ...]
     */
    setLevels(levelsData = []) {
        if (!Array.isArray(levelsData)) {
            throw new Error(
                'EnergyLevelsDiagram Error: setLevels expects an array.'
            );
        }
        this.levelsData = levelsData;
        this.scheduleRedraw();
    }

    /**
     * Updates the arrows displayed between levels.
     * @param {Array<object>} [arrowData=[]] - Flat array of arrow definition objects.
     * Expected format: [{ arrowId, fromLevelId, toLevelId, label?, arrowStyle? }, ...]
     */
    setArrows(arrowData = []) {
        if (!Array.isArray(arrowData)) {
            throw new Error(
                'EnergyLevelsDiagram Error: setArrows expects an array.'
            );
        }
        this.arrowData = arrowData;
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

    /**
     * Sets the label for the Y axis. Supports KaTeX delimiters.
     * @param {string} label - The label text (e.g., 'Potential $V$ (V)').
     */
    setYAxisLabel(label) {
        this.config.yAxisLabel = label || '';
        // Only need to redraw axes for label change if scales/size are unchanged
        this.scheduleRedraw();
    }

    /**
     * Updates the entire diagram based on current data and config.
     */
    redraw() {
        // update scales
        this.yScale.domain(this.yRange).range([this.plotHeight, 0]);
        this.xScale
            .domain(this.config.categories.map((c) => c.id))
            .range([0, this.plotWidth]);
        const levelPositions = this._calcLevelPositions();

        this._drawAxes();
        this._drawLevels(levelPositions);
        this._drawArrows(levelPositions);
    }

    // ========================================================================
    // Public Accessors (Getters)
    // ========================================================================

    // ========================================================================
    // Core Private Setup & Update Logic
    // ========================================================================

    /** Sets up the core D3 and SVG structure. */
    _setupD3Structure() {
        const defs = this.svg.append('defs');
        // Simple arrowhead marker
        defs.append('marker')
            .attr('id', 'arrowhead-end')
            .attr('viewBox', '-0 -5 10 10') // Coordinate system for marker
            .attr('refX', 5) // Position marker relative to line end
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5') // Path for the arrowhead shape
            .attr('fill', '#555') // Arrow color
            .style('stroke', 'none');
        defs.append('marker')
            .attr('id', 'arrowhead-start')
            .attr('viewBox', '-0 -5 10 10') // Coordinate system for marker
            .attr('refX', 5) // Position marker relative to line end
            .attr('refY', 0)
            .attr('orient', 'auto-start-reverse')
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5') // Path for the arrowhead shape
            .attr('fill', '#555') // Arrow color
            .style('stroke', 'none');

        // Layer groups for artists
        this.levelsGroup = this.plotArea.append('g');
        this.arrowsGroup = this.plotArea.append('g');
        this.levelLabelsGroup = this.plotArea.append('g');
        this.arrowLabelsGroup = this.plotArea.append('g');

        // Axis drawing groups
        this.axesGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels-axes-group');

        // Set up axis scale functions. Our own bandScale (see utils.js):
        // paddings are fractions of the bandwidth and behave the same for any
        // number of bands (d3.scaleBand ignores paddingOuter when n = 1).
        // Defaults preserve the classic look (half-width centered band);
        // set bandPaddingOuter: 0 for band edges exactly on the margins.
        this.xScale = bandScale()
            .paddingInner(this.config.bandPaddingInner)
            .paddingOuter(this.config.bandPaddingOuter)
            .minPaddingInner(this.config.bandMinPaddingInner)
            .minPaddingOuter(this.config.bandMinPaddingOuter);
        this.yScale = d3.scaleLinear();

        // Axis drawing generators
        this.xAxisGen = d3
            .axisBottom(this.xScale)
            .tickSize(0)
            .tickPadding(6)
            .tickFormat(
                (categoryId) =>
                    this.config.categories.find((c) => c.id === categoryId)
                        ?.label ?? categoryId
            );
        this.yAxisGen = d3.axisLeft(this.yScale).tickSize(-this.plotWidth);
        if (!this.config.showYTicks) this.yAxisGen.tickValues([]);
    }

    // ========================================================================
    // Private Drawing Helpers
    // ========================================================================

    /** Calculate pixel positions of levels */
    _calcLevelPositions() {
        const bandwidth = this.xScale.bandwidth();
        const lineHalfLength = Math.max(5, bandwidth * 0.5); // Adjusted based on bandwidth
        const labelOffset = 0;

        return this.levelsData.map((level) => {
            const xCenter = this.xScale(level.categoryId) + bandwidth / 2;
            const xLeft = xCenter - lineHalfLength;
            const xRight = xCenter + lineHalfLength;
            return {
                id: level.levelId,
                y: this.yScale(level.yValue),
                xCenter,
                xLeft,
                xRight,
                // labelSide 'left' puts the label at the line's left end
                // (right-aligned) — lets two families of levels (e.g. carriers
                // vs standard-state rungs) never collide.
                xLabel:
                    level.labelSide === 'left'
                        ? xLeft - 5
                        : xRight + labelOffset,
                level,
            };
        });
    }

    /** Draws/Updates the X and Y axes. */
    _drawAxes() {
        const ph = this.plotHeight;

        const xAxis = this.drawStaticElements({
            parentGroups: this.axesGroup,
            element: 'g',
            cssClass: 'energy-levels-x-axis',
            onUpdateTransition: (s) =>
                s.attr('transform', `translate(0,${ph})`).call(this.xAxisGen),
        });
        xAxis.selectAll('.domain').remove(); // remove main line

        const yAxis = this.drawStaticElements({
            parentGroups: this.axesGroup,
            element: 'g',
            cssClass: 'energy-levels-y-axis',
            onUpdateTransition: (s) => s.call(this.yAxisGen),
        });
        yAxis
            .selectAll('line.tick')
            .attr('stroke', '#e0e0e0')
            .attr('stroke-dasharray', '2,2');
        yAxis.selectAll('.domain').remove(); // remove main line

        this.drawYAxisLabel(this.axesGroup, this.config.yAxisLabel);
    }

    /** Draws/Updates the energy/potential level lines and labels. */
    _drawLevels(levelPositions) {
        const defaultStyle = this.config.defaultLevelStyle;

        this.drawElements({
            parentGroups: this.levelsGroup,
            element: 'line',
            cssClass: 'level-line',
            data: levelPositions,
            dataKey: (d) => d.id,
            onUpdateTransition: (s) =>
                s
                    .attr('x1', (d) => d.xLeft)
                    .attr('y1', (d) => d.y)
                    .attr('x2', (d) => d.xRight)
                    .attr('y2', (d) => d.y)
                    .attr('stroke', (d) => d.level.color || defaultStyle.color)
                    .attr(
                        'stroke-width',
                        (d) =>
                            d.level.style?.lineWidth || defaultStyle.lineWidth
                    )
                    .attr(
                        'stroke-dasharray',
                        (d) =>
                            d.level.style?.dasharray || defaultStyle.dasharray
                    ),
        });

        const labelData = levelPositions.map((d) => ({
            ...d,
            label: d.level.label,
            mathMode: true,
            hAlign: d.level.labelSide === 'left' ? 'right' : 'left',
            vAlign: d.level.labelVAlign || 'center',
        }));

        this.drawLabelsFancy({
            parentGroups: this.levelLabelsGroup,
            cssClass: 'level-label',
            labelData: labelData,
            dataKey: (d) => d.id,
            onUpdateTransition: (s) =>
                s
                    .attr('transform', (d) => `translate(${d.xLabel}, ${d.y})`)
                    .select('span.rp-label-span')
                    .style('color', (d) => d.level.color || defaultStyle.color),
        });
    }

    /** Draws/Updates arrows between specified levels. */
    _drawArrows(levelPositions) {
        const arrowData = this.arrowData;
        const levelPositionsMap = new Map();
        for (const level of levelPositions)
            levelPositionsMap.set(level.id, level);

        // 1. Filtermap: Prepare data for drawing (only valid arrows with coordinates)
        const bandwidth = this.xScale.bandwidth();
        const drawableArrowData = [];
        for (const arrowDef of arrowData) {
            const pos1 = levelPositionsMap.get(arrowDef.fromLevelId);
            const pos2 = levelPositionsMap.get(arrowDef.toLevelId);
            if (!(pos1 && pos2)) continue;
            // dxFrac: horizontal offset as a fraction of the category bandwidth,
            // so several arrows within one category don't overlap.
            const dx = (arrowDef.dxFrac || 0) * bandwidth;
            drawableArrowData.push({
                arrowId: arrowDef.arrowId,
                x1: pos1.xCenter + dx,
                y1: pos1.y,
                x2: pos2.xCenter + dx,
                y2: pos2.y,
                label: arrowDef.label, // Raw LaTeX
                labelHAlign: arrowDef.labelHAlign || 'left',
                arrowStyle: arrowDef.arrowStyle || '->', // Default to forward arrow
                color: arrowDef.color || '#555', // Default arrow color
            });
        }

        // 2. Data Binding for Arrows

        const arrowLines = this.drawElements({
            parentGroups: this.arrowsGroup,
            element: 'line',
            cssClass: 'level-arrow',
            data: drawableArrowData,
            dataKey: (d) => d.arrowId,
            onNew: (s) => s.attr('stroke-width', 1.5),
            onUpdateTransition: (s) =>
                s
                    .attr('x1', (d) => d.x1)
                    .attr('y1', (d) => d.y1)
                    .attr('x2', (d) => d.x2)
                    .attr('y2', (d) => d.y2),
        });
        arrowLines
            .attr('stroke', (d) => d.color)
            .attr('marker-start', (d) =>
                d.arrowStyle.includes('<') ? 'url(#arrowhead-start)' : null
            ) // Assumes marker ID is 'arrowhead'
            .attr('marker-end', (d) =>
                d.arrowStyle.includes('>') ? 'url(#arrowhead-end)' : null
            );

        const labelData = drawableArrowData
            .filter((d) => d.label)
            .map((d) => ({
                ...d,
                mathMode: true,
                hAlign: d.labelHAlign,
                vAlign: 'center',
            }));

        this.drawLabelsFancy({
            parentGroups: this.arrowLabelsGroup,
            cssClass: 'level-arrow-label',
            labelData: labelData,
            dataKey: (d) => d.arrowId,
            onUpdateTransition: (s) =>
                s
                    .attr(
                        'transform',
                        (d) =>
                            `translate(${(d.x1 + d.x2) / 2 + (d.labelHAlign === 'right' ? -6 : 5)}, ${(d.y1 + d.y2) / 2})`
                    )
                    .select('span.rp-label-span')
                    .style('color', (d) => d.color),
        });
    }

    // ========================================================================
    // Private Calculation/Utility Helpers
    // ========================================================================
    // (None needed yet)
} // End of class

export default EnergyLevelsDiagram;
