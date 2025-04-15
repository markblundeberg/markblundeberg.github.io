// EnergyLevelsDiagram.js
// A D3 component for drawing simple energy/potential level diagrams
// with discrete horizontal categories.

// Assumes D3 and KaTeX (core library AND auto-render extension) are loaded.

class EnergyLevelsDiagram {
    // ========================================================================
    // Constructor
    // ========================================================================

    /**
     * Creates an instance of the EnergyLevelsDiagram.
     * @param {string} containerId - ID of the HTML element to contain the plot.
     * @param {object} [initialConfig={}] - Initial configuration options.
     * @param {number} [initialConfig.width=200] - Width of the SVG element.
     * @param {number} [initialConfig.height=400] - Height of the SVG element.
     * @param {object} [initialConfig.margin] - Plot margins. Defaults provided if omitted.
     * @param {string} [initialConfig.yAxisLabel='Potential / Energy'] - Label for Y axis (can contain KaTeX delimiters like $..$).
     * @param {Array<number>} [initialConfig.initialYRange=[0, 1]] - Initial [min, max] for Y axis domain.
     * @param {boolean} [initialConfig.showYTicks=true] - Whether to show Y axis ticks and labels.
     * @param {Array<object>} [initialConfig.categories=[]] - Categories for the X axis. Array of {id: string, label: string}.
     * @param {object} [initialConfig.defaultLevelStyle] - Default styles for levels.
     * @param {number} [initialConfig.transitionDuration=250] - Duration for D3 transitions (ms).
     */
    constructor(containerId, initialConfig = {}) {
        this.containerId = containerId;
        this.container = d3.select(this.containerId);
        if (this.container.empty()) {
            throw new Error(`Container element #${containerId} not found.`);
        }

        // --- Configuration with defaults ---
        const defaultMargin = {
            top: 10,
            right: 5,
            bottom: 20,
            left: 45, // Default left margin when ticks are shown
            left_compact: 20, // Default left margin when ticks are hidden
        };

        this.config = {
            width: initialConfig.width || 200,
            height: initialConfig.height || 400,
            // Merge provided margin with defaults carefully
            margin: { ...defaultMargin, ...(initialConfig.margin || {}) },
            yAxisLabel: initialConfig.yAxisLabel || 'Potential / Energy',
            yRange: initialConfig.initialYRange || [0, 1],
            showYTicks: initialConfig.showYTicks !== false, // Default true
            categories: initialConfig.categories || [],
            defaultLevelStyle: initialConfig.defaultLevelStyle || {
                color: 'black',
                lineWidth: 2,
                dasharray: null,
            },
            transitionDuration: initialConfig.transitionDuration ?? 250,
        };

        // Calculate initial plot dimensions (will be updated by _updateScales)
        this.plotWidth = 0;
        this.plotHeight = 0;

        // --- Internal state ---
        this.levelsData = [];

        // --- D3 Setup ---
        this._setupD3Structure();
        this.redraw(); // Initial draw

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
     * Sets the label for the Y axis. Supports KaTeX delimiters.
     * @param {string} label - The label text (e.g., 'Potential $V$ (V)').
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
        this._drawLevels();
    }

    // ========================================================================
    // Public Accessors (Getters)
    // ========================================================================

    /** Returns the main SVG DOM node. */
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
            .attr('class', 'energy-levels-svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.plotArea = this.svg
            .append('g')
            .attr('class', 'energy-levels-plot-area');
        // Transform set in _updateScales based on dynamic margin

        // Scales
        this.xScale = d3
            .scaleBand()
            .paddingInner(0.5) // Space between category bands
            .paddingOuter(0.2) // Space at edges
            .align(0.25); // Shift left
        this.yScale = d3.scaleLinear();

        // Axis Generators
        this.xAxisGen = d3.axisBottom(this.xScale).tickSize(0).tickPadding(6);
        this.yAxisGen = d3.axisLeft(this.yScale);

        // Axis Groups (positioned in _updateScales or _drawAxes)
        this.xAxisGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels-x-axis');
        this.yAxisGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels-y-axis');

        // Y-Axis Label Element using foreignObject for KaTeX
        this.yAxisLabel = this.svg
            .append('foreignObject')
            .attr('class', 'energy-levels-y-axis-label')
            .attr('width', 1)
            .attr('height', 1) // Size determined by content/transform
            .style('overflow', 'visible')
            .style('text-anchor', 'middle'); // Note: text-anchor on foreignObject might not work as expected

        // Add span inside foreignObject for KaTeX rendering
        this.yAxisLabel
            .append('xhtml:span')
            .attr('class', 'katex-axis-label-container')
            .style('display', 'inline-block') // Important for rotation and sizing
            .style('text-align', 'center') // Center text within span
            .style('font-size', '11px')
            .style('color', '#333');
        // Transform set in _updateScales

        // Layer group for levels
        this.levelsGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels');
    }

    /** Updates the domains and ranges of the D3 scales and positions elements. */
    _updateScales() {
        // Calculate effective left margin based on tick visibility
        const effectiveLeftMargin = this.config.showYTicks
            ? this.config.margin.left
            : (this.config.margin.left_compact ?? this.config.margin.left / 2);

        // Calculate plot dimensions using effective margin
        this.plotWidth =
            this.config.width - effectiveLeftMargin - this.config.margin.right;
        this.plotHeight =
            this.config.height -
            this.config.margin.top -
            this.config.margin.bottom;
        if (this.plotWidth <= 0 || this.plotHeight <= 0) {
            console.warn(
                'Plot dimensions are not positive after margin calculation.'
            );
            // Optionally handle this case, e.g., by setting a minimum size
            this.plotWidth = Math.max(10, this.plotWidth);
            this.plotHeight = Math.max(10, this.plotHeight);
        }

        // Update plot area transform using effective margin
        this.plotArea.attr(
            'transform',
            `translate(${effectiveLeftMargin},${this.config.margin.top})`
        );

        // Update Y scale
        this.yScale
            .domain(this.config.yRange)
            .range([this.plotHeight, 0])
            .nice();

        // Update X scale
        this.xScale
            .domain(this.config.categories.map((c) => c.id))
            .range([0, this.plotWidth]);

        // Update axis group positions
        this.xAxisGroup.attr('transform', `translate(0,${this.plotHeight})`);
        this.yAxisLabel.attr(
            'transform',
            `translate(${this.config.margin.left / 2.5}, ${this.config.margin.top + this.plotHeight / 2}) rotate(-90)`
        );
    }

    // ========================================================================
    // Private Drawing Helpers
    // ========================================================================

    /** Draws/Updates the X and Y axes. */
    _drawAxes() {
        // Update Y Axis
        this.yAxisGen.scale(this.yScale);
        if (!this.config.showYTicks) {
            this.yAxisGen.tickValues([]);
        } else {
            this.yAxisGen.tickSize(-this.plotWidth);
            this.yAxisGen.tickValues(null);
        }
        this.yAxisGroup
            .transition()
            .duration(this.config.transitionDuration)
            .call(this.yAxisGen);

        // Style grid lines (if shown)
        this.yAxisGroup
            .selectAll('.tick line')
            .attr('stroke', '#e0e0e0')
            .attr('stroke-dasharray', '2,2');
        this.yAxisGroup.select('.domain').remove(); // Remove y-axis line

        // Update Y Axis Label Text using renderMathInElement
        const yLabelSpan = this.yAxisLabel
            .select('span.katex-axis-label-container')
            .node();
        if (yLabelSpan && this.config.yAxisLabel) {
            // Set the raw text content (including delimiters like $...$)
            yLabelSpan.textContent = this.config.yAxisLabel;
            // Call the auto-render function on the span
            // Ensure KaTeX auto-render script is loaded in HTML
            if (typeof renderMathInElement === 'function') {
                try {
                    renderMathInElement(yLabelSpan, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '\\[', right: '\\]', display: true },
                        ],
                        throwOnError: false,
                    });
                } catch (e) {
                    console.error('KaTeX render error for Y Axis Label:', e);
                }
            } else {
                console.warn('KaTeX auto-render extension not loaded.');
            }
        } else if (yLabelSpan) {
            yLabelSpan.textContent = ''; // Clear if no label
        }

        // Update X Axis (Category Labels)
        this.xAxisGen.scale(this.xScale);
        this.xAxisGen.tickFormat(
            (categoryId) =>
                this.config.categories.find((c) => c.id === categoryId)
                    ?.label || categoryId
        );
        this.xAxisGroup
            .transition()
            .duration(this.config.transitionDuration) // Transition axis update
            .call(this.xAxisGen);
        this.xAxisGroup.select('.domain').remove(); // Remove x-axis line
        this.xAxisGroup
            .selectAll('text')
            .style('text-anchor', 'middle')
            .style('font-size', '11px');
    }

    /** Draws/Updates the energy/potential level lines and labels. */
    _drawLevels() {
        const transitionDuration = this.config.transitionDuration;
        const lineHalfLength = 0.5 * this.xScale.bandwidth();
        const labelOffset = 0;
        const defaultStyle = this.config.defaultLevelStyle;

        // --- Data Binding ---
        const levelGroups = this.levelsGroup
            .selectAll('g.level-group')
            .data(this.levelsData, (d) => d.levelId); // Use unique levelId as key

        levelGroups.join(
            (enter) => {
                const g = enter
                    .append('g')
                    .attr('class', 'level-group')
                    // Set initial position based on data for transition start
                    .attr(
                        'transform',
                        (d) =>
                            `translate(${this.xScale(d.categoryId) + this.xScale.bandwidth() / 2}, ${this.yScale(d.yValue)})`
                    );

                // Fade-in transition
                g.style('opacity', 0)
                    .transition('fade-in')
                    .duration(transitionDuration)
                    .style('opacity', 1);

                g.append('line')
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

                // Label structure (foreignObject + span) positioned relative to group origin
                const fo = g
                    .append('foreignObject')
                    .attr('class', 'level-label')
                    .attr('x', lineHalfLength + labelOffset)
                    .attr('y', -10) // Approximate vertical center offset
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
                    .style('font-size', '10px')
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

                return g; // Return the entering group
            },
            (update) => {
                // Update styles that might change immediately (before transition)
                update
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
                update
                    .select('span.katex-label-container')
                    .style('color', (d) => d.color || defaultStyle.color);
                // Note: KaTeX label text is NOT updated here assuming it's static per levelId

                // Apply position transition
                update
                    .transition('position') // Name transition
                    .duration(transitionDuration)
                    .attr(
                        'transform',
                        (d) =>
                            `translate(${this.xScale(d.categoryId) + this.xScale.bandwidth() / 2}, ${this.yScale(d.yValue)})`
                    );
            },
            (exit) => {
                exit.transition('fade-out') // Name transition
                    .duration(transitionDuration)
                    .style('opacity', 0)
                    .remove(); // Remove element after transition
            }
        );
    }

    // ========================================================================
    // Private Calculation/Utility Helpers
    // ========================================================================
    // (None needed for this simple component yet)

    // ========================================================================
    // Destroy Method
    // ========================================================================
    destroy() {
        this.container.html(''); // Clear SVG
        console.log(`EnergyLevelsDiagram in #${this.containerId} destroyed.`);
    }
} // End of class

export default EnergyLevelsDiagram;
