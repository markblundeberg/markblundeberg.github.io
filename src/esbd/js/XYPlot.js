// XYPlot.js
// A minimal generic X-Y plot with a NON-SPATIAL numeric x axis, built on
// ResponsivePlot. For panels like "net charge vs ladder offset" (and future
// I-V / Q-V style curves) — places where BandDiagram's spatial-region
// machinery (regions, boundaries, position popups) is the wrong vocabulary.
//
// Traces reuse the familiar def format:
//   { id, x: [...], y: [...], color?, style?: {lineWidth?, dasharray?},
//     label?, showLabel?, labelFrac?, labelHAlign? }
// plus simple point markers: { id, x, y, color?, r? }.

import * as d3 from 'd3';
import ResponsivePlot from './ResponsivePlot.js';

class XYPlot extends ResponsivePlot {
    /**
     * @param {string} containerId - ID of the containing element.
     * @param {object} [config={}] - Options (plus ResponsivePlot options).
     * @param {string} [config.xLabel=''] - X axis label (KaTeX `$..$` ok).
     * @param {string} [config.yLabel=''] - Y axis label (KaTeX `$..$` ok).
     * @param {Array<number>} [config.xRange=[0,1]] - Initial x domain.
     * @param {Array<number>} [config.yRange=[0,1]] - Initial y domain.
     * @param {string} [config.xMode='numeric'] - 'numeric' ticks or 'abstract' (none).
     * @param {string} [config.yMode='numeric'] - 'numeric' ticks or 'abstract' (none).
     */
    constructor(containerId, config = {}) {
        const defaults = {
            xLabel: '',
            yLabel: '',
            xRange: [0, 1],
            yRange: [0, 1],
            xMode: 'numeric',
            yMode: 'numeric',
            defaultTraceStyle: { lineWidth: 2, dasharray: null },
        };
        super({ containerId: containerId, ...defaults, ...config });

        this.xRange = [...this.config.xRange];
        this.yRange = [...this.config.yRange];
        this.tracesData = [];
        this.markersData = [];

        this._setupD3Structure();
    }

    // ========================================================================
    // Public API
    // ========================================================================

    setXRange(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number' || min >= max)
            throw new Error('Invalid arguments for setXRange.');
        this.xRange = [min, max];
        this.scheduleRedraw();
    }

    setYRange(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number' || min >= max)
            throw new Error('Invalid arguments for setYRange.');
        this.yRange = [min, max];
        this.scheduleRedraw();
    }

    setXLabel(label) {
        this.config.xLabel = label || '';
        this.scheduleRedraw();
    }

    setYLabel(label) {
        this.config.yLabel = label || '';
        this.scheduleRedraw();
    }

    /** Replaces the full set of traces. See def format at top of file. */
    updateTraceData(traceDefs = []) {
        this.tracesData = [];
        const seenIds = new Set();
        for (const def of traceDefs) {
            try {
                const {
                    id,
                    x: xData,
                    y: yData,
                    color = '#333',
                    style = null,
                    label = '',
                    showLabel = true,
                    labelFrac = 1,
                    labelHAlign = 'left',
                    ...extraFields
                } = def;
                if (Object.keys(extraFields).length > 0)
                    throw Error(
                        'Unexpected fields: ' +
                            Object.keys(extraFields).join(', ')
                    );
                if (typeof id !== 'string') throw Error('missing/bad id');
                if (seenIds.has(id)) throw Error('duplicate id: ' + id);
                if (!Array.isArray(xData) || !Array.isArray(yData))
                    throw Error('missing/bad x/y arrays');
                if (xData.length !== yData.length || xData.length < 2)
                    throw Error('bad x/y lengths');

                // Label anchor: a fraction along the trace's x-extent,
                // y linearly interpolated (same convention as BandDiagram).
                let labelPos = null;
                if (showLabel && label) {
                    const n = xData.length;
                    const tx = xData[0] + labelFrac * (xData[n - 1] - xData[0]);
                    let ty = yData[n - 1];
                    for (let k = 1; k < n; k++) {
                        if (tx <= xData[k]) {
                            const t =
                                xData[k] === xData[k - 1]
                                    ? 0
                                    : (tx - xData[k - 1]) /
                                      (xData[k] - xData[k - 1]);
                            ty = yData[k - 1] + t * (yData[k] - yData[k - 1]);
                            break;
                        }
                    }
                    labelPos = { x: tx, y: ty };
                }

                this.tracesData.push({
                    id,
                    xData,
                    yData,
                    color,
                    style: style ?? this.config.defaultTraceStyle,
                    label,
                    labelPos,
                    labelHAlign,
                });
                seenIds.add(id);
            } catch (e) {
                console.warn('XYPlot: skipping trace (' + e + '):', def);
            }
        }
        this.scheduleRedraw();
    }

    /** Replaces the point markers: [{ id, x, y, color?, r? }, ...] */
    updateMarkers(markerDefs = []) {
        this.markersData = markerDefs;
        this.scheduleRedraw();
    }

    // ========================================================================
    // Redraw
    // ========================================================================

    redraw() {
        this.xScale = d3
            .scaleLinear()
            .domain(this.xRange)
            .range([0, this.plotWidth]);
        this.yScale = d3
            .scaleLinear()
            .domain(this.yRange)
            .range([this.plotHeight, 0]);

        this._drawAxes();
        this._drawTraces();
        this._drawMarkers();
        this._drawTraceLabels();
    }

    // ========================================================================
    // Private
    // ========================================================================

    _setupD3Structure() {
        this.axesGroup = this.plotArea.append('g').attr('class', 'xy-axes');
        this.tracesGroup = this.plotArea.append('g');
        this.markersGroup = this.plotArea.append('g');
        this.labelsGroup = this.plotArea
            .append('g')
            .style('pointer-events', 'none');
    }

    _drawAxes() {
        const xAxisGen = d3.axisBottom(this.xScale).tickSize(4).tickPadding(4);
        if (this.config.xMode === 'abstract') xAxisGen.tickValues([]);
        const yAxisGen = d3
            .axisLeft(this.yScale)
            .tickSize(-this.plotWidth)
            .tickPadding(6);
        if (this.config.yMode === 'abstract') yAxisGen.tickValues([]);

        const xAxis = this.drawStaticElements({
            parentGroups: this.axesGroup,
            element: 'g',
            cssClass: 'xy-x-axis',
            onUpdateTransition: (s) =>
                s
                    .attr('transform', `translate(0,${this.plotHeight})`)
                    .call(xAxisGen),
        });
        xAxis.selectAll('.domain').attr('stroke', '#aaa');

        const yAxis = this.drawStaticElements({
            parentGroups: this.axesGroup,
            element: 'g',
            cssClass: 'xy-y-axis',
            onUpdateTransition: (s) => s.call(yAxisGen),
        });
        yAxis
            .selectAll('line.tick, .tick line')
            .attr('stroke', '#e0e0e0')
            .attr('stroke-dasharray', '2,2');
        yAxis.selectAll('.domain').attr('stroke', '#aaa');

        this.drawYAxisLabel(this.axesGroup, this.config.yLabel);

        // Centered x-axis label below the ticks.
        this.drawLabelsFancy({
            parentGroups: this.axesGroup,
            cssClass: 'xy-x-axis-label',
            labelData: this.config.xLabel
                ? [
                      {
                          label: this.config.xLabel,
                          mathMode: false,
                          hAlign: 'center',
                          vAlign: 'top',
                      },
                  ]
                : [],
            fadeIn: false,
            onUpdateTransition: (s) =>
                s.attr(
                    'transform',
                    // below the tick labels (which need ~18px of the margin)
                    `translate(${0.5 * this.plotWidth}, ${this.plotHeight + 0.55 * this.margins.bottom})`
                ),
        });
    }

    _drawTraces() {
        const lineGen = d3
            .line()
            .x((d) => this.xScale(d[0]))
            .y((d) => this.yScale(d[1]));

        this.drawElements({
            parentGroups: this.tracesGroup,
            element: 'path',
            cssClass: 'xy-trace',
            data: this.tracesData,
            dataKey: (d) => d.id,
            onNew: (s) => s.attr('fill', 'none'),
            onUpdateTransition: (s) =>
                s
                    .attr('d', (d) =>
                        lineGen(d.xData.map((xv, i) => [xv, d.yData[i]]))
                    )
                    .attr('stroke', (d) => d.color)
                    .attr('stroke-width', (d) => d.style.lineWidth ?? 2)
                    .attr('stroke-dasharray', (d) => d.style.dasharray ?? null),
        });
    }

    _drawMarkers() {
        this.drawElements({
            parentGroups: this.markersGroup,
            element: 'circle',
            cssClass: 'xy-marker',
            data: this.markersData,
            dataKey: (d) => d.id,
            onUpdateTransition: (s) =>
                s
                    .attr('cx', (d) => this.xScale(d.x))
                    .attr('cy', (d) => this.yScale(d.y))
                    .attr('r', (d) => d.r ?? 4.5)
                    .attr('fill', (d) => d.color ?? '#333'),
        });
    }

    _drawTraceLabels() {
        const labelData = this.tracesData
            .filter((d) => d.labelPos && d.label)
            .map((d) => ({
                ...d,
                mathMode: true,
                hAlign: d.labelHAlign || 'left',
                vAlign: 'center',
            }));

        this.drawLabelsFancy({
            parentGroups: this.labelsGroup,
            cssClass: 'xy-trace-label',
            labelData: labelData,
            dataKey: (d) => d.id,
            onUpdateTransition: (s) =>
                s
                    .attr('transform', (d) => {
                        const dx = d.labelHAlign === 'right' ? -5 : 5;
                        return `translate(${this.xScale(d.labelPos.x) + dx}, ${this.yScale(d.labelPos.y)})`;
                    })
                    .select('span.rp-label-span')
                    .style('color', (d) => d.color),
        });
    }
}

export default XYPlot;
