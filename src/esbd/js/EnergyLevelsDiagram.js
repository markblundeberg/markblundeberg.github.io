// EnergyLevelsDiagram.js
// A D3 component for drawing simple energy/potential level diagrams
// with discrete horizontal categories.

// Assumes D3 and KaTeX (core library AND auto-render extension) are loaded.

import { debounce, renderSpanMath } from './utils.js';

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
     * @param {number} [initialConfig.transitionDuration=500] - Duration for D3 transitions (ms).
     * @param {number} [initialConfig.resizeDebounceDelay=200] - Debounce delay for resize events (ms).
     */
    constructor(containerId, initialConfig = {}) {
        this.containerId = containerId;
        this.container = d3.select('#' + this.containerId);
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
            margin: { ...defaultMargin, ...(initialConfig.margin || {}) },
            yAxisLabel: initialConfig.yAxisLabel ?? 'Potential / Energy',
            yRange: initialConfig.initialYRange || [0, 1],
            showYTicks: initialConfig.showYTicks !== false, // Default true
            categories: initialConfig.categories || [],
            defaultLevelStyle: initialConfig.defaultLevelStyle || {
                color: 'black',
                lineWidth: 2,
                dasharray: null,
            },
            transitionDuration: initialConfig.transitionDuration ?? 500,
            resizeDebounceDelay: initialConfig.resizeDebounceDelay ?? 200,
        };

        // --- Internal state ---
        this.plotWidth = 0;
        this.plotHeight = 0; // Will be calculated by _updateScales
        this.levelsData = [];
        this.arrowData = []; // Stores arrow definitions from setArrows
        this.levelPositions = new Map(); // Stores calculated pixel positions {x_center_px, y_px} for each levelId
        this._redrawScheduled = false;

        this._setupD3Structure();
        const initialWidth =
            this.container.node().clientWidth || this.config.width;
        const initialHeight =
            this.container.node().clientHeight || this.config.height;
        this.config.width = initialWidth;
        this.config.height = initialHeight;
        this.svg
            .attr('width', this.config.width)
            .attr('height', this.config.height);
        this.redraw(); // Initial draw

        // Setup resize observer
        this._debouncedHandleResize = debounce((width, height) => {
            this._handleResize(width, height);
        }, this.config.resizeDebounceDelay);
        this._resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                this._debouncedHandleResize(width, height);
            }
        });
        this._resizeObserver.observe(this.container.node());
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
        this._scheduleRedraw();
    }

    /**
     * Updates the arrows displayed between levels.
     * @param {Array<object>} [arrowData=[]] - Flat array of arrow definition objects.
     * Expected format: [{ arrowId, fromLevelId, toLevelId, label?, arrowStyle?, cssClass? }, ...]
     */
    setArrows(arrowData = []) {
        if (!Array.isArray(arrowData)) {
            console.error(
                'EnergyLevelsDiagram Error: setArrows expects an array.'
            );
            return;
        }
        this.arrowData = arrowData;
        this._scheduleRedraw();
    }

    /**
     * Sets the vertical range (domain) of the Y axis.
     * @param {number} min - Minimum value for the Y axis.
     * @param {number} max - Maximum value for the Y axis.
     */
    setYRange(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number' || min >= max) {
            console.error(
                'EnergyLevelsDiagram Error: Invalid arguments for setYRange.',
                { min, max }
            );
            return;
        }
        this.config.yRange = [min, max];
        this._scheduleRedraw();
    }

    /**
     * Sets the label for the Y axis. Supports KaTeX delimiters.
     * @param {string} label - The label text (e.g., 'Potential $V$ (V)').
     */
    setYAxisLabel(label) {
        this.config.yAxisLabel = label || '';
        // Only need to redraw axes for label change if scales/size are unchanged
        if (this.plotArea) this._drawAxes();
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
        // Don't change order of the following. Each helper relies on state set by
        // the previous helpers.
        this._updateScales();
        this._drawAxes();
        this._drawLevels();
        this._drawArrows();
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
        this.container.attr('overflow', 'hidden'); // reduce resize looping

        this.svg = this.container
            .append('svg')
            .attr('class', 'energy-levels-svg') // Use class for CSS
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.plotArea = this.svg
            .append('g')
            .attr('class', 'energy-levels-plot-area');
        // Transform set in _updateScales

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

        // Axis Groups
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
            .style('text-align', 'center')
            .style('text-anchor', 'middle'); // Note: text-anchor on foreignObject might not work as expected

        // Add span inside foreignObject for KaTeX rendering
        this.yAxisLabel
            .append('xhtml:span')
            .attr('class', 'katex-axis-label-container')
            .style('display', 'inline-block') // Important for rotation and sizing
            .style('font-size', '11px')
            .style('color', '#333');
        // Transform set in _updateScales

        // Layer group for levels
        this.levelsGroup = this.plotArea
            .append('g')
            .attr('class', 'energy-levels');

        this.arrowsGroup = this.plotArea
            .append('g')
            .attr('class', 'level-arrows');
    }

    _scheduleRedraw() {
        // If a redraw is already scheduled, do nothing
        if (this._redrawScheduled) {
            return;
        }
        // Set the flag
        this._redrawScheduled = true;
        // Schedule the redraw to run before the next browser paint
        requestAnimationFrame(() => {
            this.redraw(); // Call the actual redraw method
            this._redrawScheduled = false; // Clear the flag after redraw runs
        });
    }

    /** Handles resize events (debounced). Updates config/SVG size and triggers redraw. */
    _handleResize(width, height) {
        // Update config dimensions based on container size reported by observer
        this.config.width = width;
        this.config.height = height;

        // Update SVG element size to match container
        this.svg
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        // Trigger redraw which will handle scale updates etc.
        // Debouncer ensures this doesn't fire too often.
        this.redraw();
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
            this.plotWidth = Math.max(10, this.plotWidth);
            this.plotHeight = Math.max(10, this.plotHeight);
        }

        // Update plot area transform
        this.plotArea.attr(
            'transform',
            `translate(${effectiveLeftMargin},${this.config.margin.top})`
        );

        // Update Y scale
        this.yScale.domain(this.config.yRange).range([this.plotHeight, 0]);

        // Update X scale
        this.xScale
            .domain(this.config.categories.map((c) => c.id))
            .range([0, this.plotWidth]);

        // Update axis group positions
        this.xAxisGroup.attr('transform', `translate(0,${this.plotHeight})`);

        // Update Y axis label position and dimensions
        const yLabelX = effectiveLeftMargin / 2.5;
        const yLabelY = this.config.margin.top + this.plotHeight / 2;
        this.yAxisLabel.attr(
            'transform',
            `translate(${yLabelX}, ${yLabelY}) rotate(-90)`
        );
        const labelWidthEstimate = 300;
        const labelHeightEstimate = 20; // Estimates
        this.yAxisLabel
            .attr('width', labelWidthEstimate)
            .attr('height', labelHeightEstimate)
            .attr('x', -labelWidthEstimate / 2)
            .attr('y', -labelHeightEstimate / 2);
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
        // Apply axis generator with transition
        this.yAxisGroup
            .transition()
            .duration(this.config.transitionDuration)
            .call(this.yAxisGen);
        // Style grid lines and remove domain line after transition (or immediately)
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
                    ?.label ?? categoryId
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
        const bandwidth = this.xScale.bandwidth();
        const lineHalfLength = Math.max(5, bandwidth * 0.5); // Adjusted based on bandwidth
        const labelOffset = 0;
        const defaultStyle = this.config.defaultLevelStyle;

        function applyLineAttributes(sel) {
            sel.attr('x1', -lineHalfLength)
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
        }

        const levelGroups = this.levelsGroup
            .selectAll('g.level-group')
            .data(this.levelsData, (d) => d.levelId);

        const mergedGroups = levelGroups.join(
            (enter) => {
                const g = enter
                    .append('g')
                    .attr('class', 'level-group')
                    .attr(
                        'transform',
                        (d) =>
                            `translate(${this.xScale(d.categoryId) + bandwidth / 2}, ${this.yScale(d.yValue)})`
                    );

                // Fade-in transition
                g.style('opacity', 0)
                    .transition('fade-in')
                    .duration(transitionDuration)
                    .style('opacity', 1);

                g.append('line')
                    .attr('class', 'level-line')
                    .call(applyLineAttributes);

                // Label structure (foreignObject + span) positioned relative to group origin
                const fo = g
                    .append('foreignObject')
                    .attr('class', 'level-label')
                    .attr('x', lineHalfLength + labelOffset)
                    .attr('y', -12)
                    .attr('width', 1)
                    .attr('height', 1) // Let content define size
                    .style('overflow', 'visible')
                    .style('pointer-events', 'none')
                    .append('xhtml:span')
                    .attr('class', 'katex-label-container')
                    .style('white-space', 'nowrap')
                    .style('display', 'inline-block')
                    .style('padding', '1px 3px')
                    .style('font-size', '10px')
                    .style('background', 'rgba(255,255,255,0.7)')
                    .style('border-radius', '2px');

                return g; // Return the entering group
            },
            (update) => {
                // Update styles that might change immediately (before transition)
                update
                    .select('line.level-line')
                    .transition()
                    .duration(transitionDuration)
                    .call(applyLineAttributes);

                // Apply position transition
                update
                    .transition('position') // Name transition
                    .duration(transitionDuration)
                    .ease(d3.easeExpOut) // need fast-start transitions to avoid lag
                    .attr(
                        'transform',
                        (d) =>
                            `translate(${this.xScale(d.categoryId) + bandwidth / 2}, ${this.yScale(d.yValue)})`
                    );
                return update;
            },
            (exit) => {
                exit.transition('fade-out') // Name transition
                    .duration(transitionDuration)
                    .style('opacity', 0)
                    .remove(); // Remove element after transition
                return exit;
            }
        );

        // Update label position and render KaTeX
        mergedGroups
            .select('foreignObject.level-label')
            .style('color', (d) => d.color || defaultStyle.color)
            .select('span.katex-label-container')
            .each(function (d) {
                renderSpanMath(this, d.label);
            });

        this.levelPositions.clear();
        mergedGroups.each((d) => {
            // Calculate and store positions after transform is set/updated
            const x_center_px = this.xScale(d.categoryId) + bandwidth / 2;
            const y_px = this.yScale(d.yValue);
            if (isFinite(x_center_px) && isFinite(y_px)) {
                this.levelPositions.set(d.levelId, { x_center_px, y_px });
            }
        });
    }

    /** Draws/Updates arrows between specified levels. */
    _drawArrows() {
        const transitionDuration = this.config.transitionDuration;
        const arrowData = this.arrowData || [];
        const levelPositions = this.levelPositions; // Use cached positions

        // 1. Filtermap: Prepare data for drawing (only valid arrows with coordinates)
        const drawableArrowData = [];
        for (const arrowDef of arrowData) {
            const pos1 = levelPositions.get(arrowDef.fromLevelId);
            const pos2 = levelPositions.get(arrowDef.toLevelId);
            if (!(pos1 && pos2)) continue;
            drawableArrowData.push({
                arrowId: arrowDef.arrowId,
                x1: pos1.x_center_px,
                y1: pos1.y_px, // Use calculated pixel coords
                x2: pos2.x_center_px,
                y2: pos2.y_px,
                label: arrowDef.label, // Raw LaTeX
                arrowStyle: arrowDef.arrowStyle || '->', // Default to forward arrow
                cssClass: arrowDef.cssClass || '',
                color: arrowDef.color || '#555', // Default arrow color
            });
        }

        // 2. Data Binding for Arrows

        // Helpers: shared attributes for on-enter (immediate) and update (transition)
        function applyLineAttributes(lineSel) {
            lineSel
                .attr('stroke', (d) => d.color)
                .attr('x1', (d) => d.x1)
                .attr('y1', (d) => d.y1)
                .attr('x2', (d) => d.x2)
                .attr('y2', (d) => d.y2);
        }
        function applyLabelAttributes(labelSel) {
            labelSel
                .attr('x', (d) => (d.x1 + d.x2) / 2 + 5) // Offset slightly right of midpoint
                .attr('y', (d) => (d.y1 + d.y2) / 2 - 8); // Offset slightly above midpoint
        }

        const mergedGroups = this.arrowsGroup
            .selectAll('g.level-arrow')
            .data(drawableArrowData, (d) => d.arrowId)
            .join(
                (enter) => {
                    const g = enter
                        .append('g')
                        .attr('class', (d) => `level-arrow ${d.cssClass || ''}`)
                        .style('opacity', 0);

                    const line = g
                        .append('line')
                        .attr('class', 'arrow-line')
                        .attr('stroke-width', 1.5)
                        .call(applyLineAttributes);

                    const fo = g
                        .append('foreignObject')
                        .attr('class', 'arrow-label')
                        .attr('width', 1)
                        .attr('height', 1)
                        .style('overflow', 'visible')
                        .style('pointer-events', 'none')
                        .style('text-align', 'center')
                        .call(applyLabelAttributes);
                    fo.append('xhtml:span')
                        .attr('class', 'katex-label-container')
                        .style('color', (d) => d.color)
                        .style('white-space', 'nowrap')
                        .style('display', 'inline-block')
                        .style('padding', '0px 2px')
                        .style('font-size', '9px')
                        .style('background', 'rgba(255,255,255,0.8)');
                    return g;
                },
                (update) => update,
                (exit) => {
                    exit.transition()
                        .duration(transitionDuration)
                        .style('opacity', 0)
                        .remove();
                }
            );
        // Fade-in on both enter and update (sometimes update fires after exit)
        mergedGroups
            .transition()
            .duration(transitionDuration)
            .style('opacity', 1);

        // Update line position and style
        mergedGroups
            .select('line.arrow-line')
            .transition()
            .duration(transitionDuration)
            .ease(d3.easeExpOut) // need fast-start transitions to avoid lag
            .call(applyLineAttributes)
            // Apply arrowheads based on style
            .attr('marker-start', (d) =>
                d.arrowStyle.includes('<') ? 'url(#arrowhead-start)' : null
            ) // Assumes marker ID is 'arrowhead'
            .attr('marker-end', (d) =>
                d.arrowStyle.includes('>') ? 'url(#arrowhead-end)' : null
            );

        // Update label position and render KaTeX
        mergedGroups
            .select('foreignObject.arrow-label')
            .transition()
            .duration(transitionDuration)
            .ease(d3.easeExpOut) // need fast-start transitions to avoid lag
            .call(applyLabelAttributes)
            .select('span.katex-label-container')
            .each(function (d) {
                renderSpanMath(this, d.label);
            });
    }

    // ========================================================================
    // Private Calculation/Utility Helpers
    // ========================================================================
    // (None needed yet)

    // ========================================================================
    // Destroy Method
    // ========================================================================

    /** Cleans up the SVG element and observers. */
    destroy() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        if (
            this._debouncedHandleResize &&
            typeof this._debouncedHandleResize.cancel === 'function'
        ) {
            this._debouncedHandleResize.cancel();
        }
        this.container.html('');
    }
} // End of class

export default EnergyLevelsDiagram;
