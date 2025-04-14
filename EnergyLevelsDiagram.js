// EnergyLevelsDiagram.js
// A D3 component for drawing simple energy/potential level diagrams
// with discrete horizontal categories.

// Assumes D3 and KaTeX are loaded globally or imported appropriately.
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import { debounce } from './utils.js'; // Not strictly needed yet

class EnergyLevelsDiagram {
    // ========================================================================
    // Constructor
    // ========================================================================

    /**
     * Creates an instance of the EnergyLevelsDiagram.
     * @param {string} containerId - ID of the HTML element to contain the plot.
     * @param {object} [initialConfig={}] - Initial configuration options.
     * @param {number} [initialConfig.width=300] - Width of the SVG element.
     * @param {number} [initialConfig.height=400] - Height of the SVG element.
     * @param {object} [initialConfig.margin={top: 20, right: 50, bottom: 40, left: 60}] - Plot margins.
     * @param {string} [initialConfig.yAxisLabel='Potential / Energy'] - Label for the Y axis.
     * @param {Array<number>} [initialConfig.initialYRange=[0, 1]] - Initial [min, max] for Y axis domain.
     * @param {boolean} [initialConfig.showYTicks=true] - Whether to show Y axis ticks and labels.
     * @param {Array<object>} [initialConfig.categories=[]] - Categories for the X axis. Array of {id: string, label: string}.
     * @param {object} [initialConfig.defaultLevelStyle={color: 'black', lineWidth: 2, dasharray: null}] - Default styles for levels.
     * @param {number} [initialConfig.transitionDuration=250] - Duration for D3 transitions (ms).
     */
    constructor(containerId, initialConfig = {}) {
        this.containerId = containerId;
        this.container = d3.select(`#${this.containerId}`);
        if (this.container.empty()) {
            throw new Error(`Container element #${containerId} not found.`);
        }

        // --- Configuration with defaults ---
        this.config = {
            width: initialConfig.width || 300,
            height: initialConfig.height || 400,
            margin: initialConfig.margin || {
                top: 20,
                right: 50,
                bottom: 40,
                left: 60,
            },
            yAxisLabel: initialConfig.yAxisLabel || 'Potential / Energy',
            yRange: initialConfig.initialYRange || [0, 1], // Store current range
            showYTicks: initialConfig.showYTicks !== false, // Default true
            categories: initialConfig.categories || [], // {id: string, label: string}
            defaultLevelStyle: initialConfig.defaultLevelStyle || {
                color: 'black',
                lineWidth: 2,
                dasharray: null,
            },
            transitionDuration: initialConfig.transitionDuration ?? 250,
        };

        // Calculate plot dimensions
        this.plotWidth =
            this.config.width -
            this.config.margin.left -
            this.config.margin.right;
        this.plotHeight =
            this.config.height -
            this.config.margin.top -
            this.config.margin.bottom;
        if (this.plotWidth <= 0 || this.plotHeight <= 0) {
            throw new Error(
                'Calculated plot dimensions are not positive. Check width/height and margins.'
            );
        }

        // --- Internal state ---
        this.levelsData = []; // Stores the current array of level objects

        // --- D3 Setup ---
        this._setupD3Structure();
        this.redraw(); // Initial draw (likely empty)

        console.log(`EnergyLevelsDiagram Initialized in #${containerId}.`);
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
            console.error(
                'EnergyLevelsDiagram Error: setLevels expects an array.'
            );
            return;
        }
        this.levelsData = levelsData;
        // Optional: Update Y range based on new data if not fixed?
        // For now, assume fixed range set by config or setYRange.
        this.redraw();
    }

    /**
     * Sets the vertical range (domain) of the Y axis.
     * @param {number} min - Minimum value for the Y axis.
     * @param {number} max - Maximum value for the Y axis.
     */
    setYRange(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number' || min >= max) {
            console.error(
                'EnergyLevelsDiagram Error: Invalid arguments for setYRange. Requires min < max.',
                { min, max }
            );
            return;
        }
        this.config.yRange = [min, max];
        this.redraw();
    }

    /**
     * Sets the label for the Y axis. Supports KaTeX.
     * @param {string} label - The label text.
     */
    setYAxisLabel(label) {
        this.config.yAxisLabel = label || '';
        this._drawAxes(); // Only need to redraw axes for label change
    }

    /**
     * Updates the entire diagram based on current data and config.
     */
    redraw() {
        if (!this.svg || !this.plotArea) {
            console.error(
                'EnergyLevelsDiagram Error: Attempted redraw before structure setup.'
            );
            return;
        }
        this._updateScales();
        this._drawAxes();
        this._drawLevels(); // Pass data implicitly via this.levelsData
    }

    /** Cleans up the SVG element. */
    destroy() {
        this.container.html(''); // Clear SVG
        console.log(`EnergyLevelsDiagram in #${this.containerId} destroyed.`);
    }

    // ========================================================================
    // Public Accessors (Getters)
    // ========================================================================

    get svgNode() {
        return this.svg?.node();
    }

    // ========================================================================
    // Core Private Setup & Update Logic
    // ========================================================================

    /** Sets up the core D3 and SVG structure. */
    _setupD3Structure() {
        this.container.html(''); // Clear previous content

        this.svg = this.container
            .append('svg')
            .attr('class', 'energy-levels-svg') // Different class from ESBD
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.plotArea = this.svg
            .append('g')
            .attr('class', 'energy-levels-plot-area')
            .attr(
                'transform',
                `translate(${this.config.margin.left},${this.config.margin.top})`
            );

        // Layer groups
        this.levelsGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels');

        // Scales
        this.xScale = d3
            .scaleBand()
            .paddingInner(0.5) // Adjust padding between categories
            .paddingOuter(0.3);
        this.yScale = d3.scaleLinear();

        // Axis Generators
        this.xAxisGen = d3
            .axisBottom(this.xScale)
            .tickSize(0) // No ticks, just labels
            .tickPadding(10);
        this.yAxisGen = d3.axisLeft(this.yScale);

        // Axis Groups
        this.xAxisGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels-x-axis');
        this.yAxisGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels-y-axis');

        // Y-Axis Label Element
        this.yAxisLabel = this.svg
            .append('text')
            .attr('class', 'energy-levels-y-axis-label')
            .attr(
                'transform',
                `translate(${this.config.margin.left / 2.5}, ${this.config.margin.top + this.plotHeight / 2}) rotate(-90)`
            )
            .style('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('fill', '#333');
    }

    /** Updates the domains and ranges of the D3 scales. */
    _updateScales() {
        // Recalculate dimensions in case config changed (though unlikely without resize handling)
        this.plotWidth =
            this.config.width -
            this.config.margin.left -
            this.config.margin.right;
        this.plotHeight =
            this.config.height -
            this.config.margin.top -
            this.config.margin.bottom;

        // Update Y scale (linear)
        this.yScale
            .domain(this.config.yRange) // Use configured fixed range
            .range([this.plotHeight, 0]) // Pixels (bottom to top)
            .nice(); // Adjust domain slightly for nice ticks if shown

        // Update X scale (categorical band scale)
        this.xScale
            .domain(this.config.categories.map((c) => c.id)) // Use category IDs for domain
            .range([0, this.plotWidth]); // Pixels (left to right)
    }

    // ========================================================================
    // Private Drawing Helpers
    // ========================================================================

    /** Draws/Updates the X and Y axes. */
    _drawAxes() {
        // Update Y Axis
        this.yAxisGen.scale(this.yScale);
        if (!this.config.showYTicks) {
            this.yAxisGen.tickValues([]); // Remove ticks if configured
        } else {
            this.yAxisGen.tickValues(null); // Restore default ticks
        }
        this.yAxisGroup
            .transition()
            .duration(this.config.transitionDuration)
            .call(this.yAxisGen);
        // Remove domain line for cleaner look? Optional.
        this.yAxisGroup.select('.domain').remove();

        // Update Y Axis Label Text (KaTeX rendering handled by browser in SVG text?)
        // For SVG text, KaTeX doesn't work directly. Need foreignObject or manual formatting.
        // Let's just use plain text for axis labels for simplicity in this component.
        this.yAxisLabel.text(this.config.yAxisLabel);
        // Reposition Y label in case height changed
        this.yAxisLabel.attr(
            'transform',
            `translate(${this.config.margin.left / 2.5}, ${this.config.margin.top + this.plotHeight / 2}) rotate(-90)`
        );

        // Update X Axis (Category Labels)
        this.xAxisGen.scale(this.xScale);
        // Use category labels for tick formatting
        this.xAxisGen.tickFormat(
            (d, i) => this.config.categories[i]?.label || d
        );

        this.xAxisGroup
            .attr('transform', `translate(0,${this.plotHeight})`)
            .call(this.xAxisGen)
            .select('.domain')
            .remove(); // Remove x-axis line

        // Style x-axis labels if needed (e.g., rotation for long labels)
        this.xAxisGroup.selectAll('text').style('text-anchor', 'middle');
        // .attr("transform", "rotate(-30)"); // Example rotation
    }

    /** Draws/Updates the energy/potential level lines and labels. */
    _drawLevels() {
        const transitionDuration = this.config.transitionDuration;
        const lineHalfLength = 20; // Example half-length for level lines
        const labelOffset = 5; // Example offset for labels from line end
        const defaultStyle = this.config.defaultLevelStyle;

        // --- Data Binding ---
        const levelGroups = this.levelsGroup
            .selectAll('g.level-group')
            .data(this.levelsData, (d) => d.levelId); // Use unique levelId as key

        // --- Exit ---
        levelGroups
            .exit()
            .transition()
            .duration(transitionDuration)
            .style('opacity', 0)
            .remove();

        // --- Enter ---
        const enterGroups = levelGroups
            .enter()
            .append('g')
            .attr('class', 'level-group')
            // Set initial position based on data
            .attr(
                'transform',
                (d) =>
                    `translate(${this.xScale(d.categoryId) + this.xScale.bandwidth() / 2}, ${this.yScale(d.yValue)})`
            )
            .style('opacity', 0); // Start transparent

        // Add line segment
        enterGroups
            .append('line')
            .attr('class', 'level-line')
            .attr('x1', -lineHalfLength)
            .attr('y1', 0)
            .attr('x2', lineHalfLength)
            .attr('y2', 0)
            .attr('stroke', (d) => d.color || defaultStyle.color)
            .attr(
                'stroke-width',
                (d) => d.style?.lineWidth || defaultStyle.lineWidth
            )
            .attr(
                'stroke-dasharray',
                (d) => d.style?.dasharray || defaultStyle.dasharray
            );

        // Add label structure (foreignObject + span)
        const fo = enterGroups
            .append('foreignObject')
            .attr('class', 'level-label')
            .attr('x', lineHalfLength + labelOffset)
            .attr('y', -10) // Adjust vertical alignment offset
            .attr('width', 1)
            .attr('height', 1) // Let content define size
            .style('overflow', 'visible')
            .style('pointer-events', 'none');

        fo.append('xhtml:span')
            .attr('class', 'katex-label-container')
            .style('color', (d) => d.color || defaultStyle.color)
            .style('white-space', 'nowrap')
            .style('display', 'inline-block')
            .style('padding', '1px 3px')
            .style('font-size', '10px') // Smaller font for levels?
            .style('background', 'rgba(255,255,255,0.7)')
            .style('border-radius', '2px')
            // Render KaTeX ONCE on enter
            .each(function (d) {
                const span = this;
                const labelText = d.label || d.levelId; // Raw LaTeX
                if (span && typeof katex !== 'undefined' && labelText) {
                    try {
                        katex.render(labelText, span, {
                            throwOnError: false,
                            displayMode: false,
                        });
                    } catch (e) {
                        console.error('KaTeX render error:', e);
                        span.textContent = labelText;
                    }
                } else if (span) {
                    span.textContent = labelText;
                }
            });

        // --- Update + Enter ---
        const mergedGroups = enterGroups.merge(levelGroups);

        // Transition opacity and position
        mergedGroups
            .transition()
            .duration(transitionDuration)
            .style('opacity', 1)
            .attr(
                'transform',
                (d) =>
                    `translate(${this.xScale(d.categoryId) + this.xScale.bandwidth() / 2}, ${this.yScale(d.yValue)})`
            );

        // Update styles only if they might change (optional)
        mergedGroups
            .select('line.level-line')
            .attr('stroke', (d) => d.color || defaultStyle.color)
            .attr(
                'stroke-width',
                (d) => d.style?.lineWidth || defaultStyle.lineWidth
            )
            .attr(
                'stroke-dasharray',
                (d) => d.style?.dasharray || defaultStyle.dasharray
            );
        mergedGroups
            .select('span.katex-label-container')
            .style('color', (d) => d.color || defaultStyle.color);
        // Note: KaTeX content not re-rendered on update
    }

    // ========================================================================
    // Private Calculation/Utility Helpers
    // ========================================================================
    // (None needed for this simple component yet)
} // End of class

export default EnergyLevelsDiagram;
