// ResponsivePlot.js

// Assumes D3 is loaded globally or imported appropriately.

import { debounce } from './utils.js';

/**
 * Responsively-sized plot using D3.js
 * Makes a single SVG plot area inside.
 * It is assumed you will control the plot container's size using HTML/CSS.
 * Important: Parent div must have an explicit known height, so that height:100% works!
 *
 * .svg -- the whole SVG canvas
 * .plotArea -- translated plot area group (top/left margins applied)
 * .plotWidth and .plotHeight -- computed plot size
 */
class ResponsivePlot {
    // ========================================================================
    // Constructor
    // ========================================================================

    /**
     * Creates an instance of the plot
     * @param {string} containerId - ID of the HTML element (div) to contain the plot.
     * @param {object} [margins={top: 5, right: 35, bottom: 20, left: 60}] - Plot margins.
     * @param {number} [transitionDuration=250] - Transition time (ms).
     * @param {number} [resizeDebounceDelay=200] - Debounce delay for resize events (ms).
     * @param {function} [onBeforeRedraw=null] - Callback for final art parameter tweaks before redraw() is run.
     */
    constructor(config) {
        const defaults = {
            margins: {
                top: 5,
                right: 35,
                bottom: 20,
                left: 60,
            },
            transitionDuration: 250,
            resizeDebounceDelay: 200,
            onBeforeRedraw: null,
        };
        this.config = { ...defaults, ...config };
        if (!this.config.containerId) {
            throw new Error(
                "Configuration Error: 'containerId' is a required property."
            );
        }
        this.outerContainer = d3.select(`#${this.config.containerId}`);
        if (this.outerContainer.empty()) {
            throw new Error(
                `Container element #${this.config.containerId} not found.`
            );
        }

        // Internal state initialization
        this._redrawScheduled = false;
        this.svgWidth = this.outerContainer.node().clientWidth;
        this.svgHeight = this.outerContainer.node().clientHeight;
        if (this.svgHeight == 0) {
            console.warn('initial height is 0 on ', this.config.containerId);
        }

        // Populate the container
        this.outerContainer.html('');

        // Wrapper to control positioning and overflow; will be used to observe
        // container size and size changes.
        this.container = this.outerContainer
            .append('div')
            .style('position', 'relative')
            .style('overflow', 'hidden')
            .style('display', 'block')
            .style('width', '100%') // 100% of parent
            .style('height', '100%') // 100% of parent (parent must have explicit height)
            .style('margin', '0')
            .style('padding', '0')
            .style('border', '0');

        this.svg = this.container
            .append('svg')
            .style('width', '100%')
            .style('height', '100%')
            .style('position', 'absolute') // make sure position:absolute to avoid resize infinite loops!
            .style('-webkit-user-select', 'none')
            .style('user-select', 'none')
            .style('-webkit-tap-highlight-color', 'transparent');

        this.plotArea = this.svg
            .append('g')
            .attr(
                'transform',
                `translate(${this.margins.left},${this.margins.top})`
            );

        // Debounced resize handler
        this._debouncedHandleResize = debounce((width, height) => {
            this.svgWidth = width;
            this.svgHeight = height;
            this.scheduleRedraw();
        }, this.config.resizeDebounceDelay);

        this._resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                this._debouncedHandleResize(width, height);
            }
        });
        this._resizeObserver.observe(this.container.node());

        // Note ResizeObserver is guaranteed to be fired, will set our size appropriately.
    }

    // ========================================================================
    // Public API Methods
    // ========================================================================

    // Request a redraw (e.g. due to updated data)
    scheduleRedraw() {
        if (this._redrawScheduled) {
            return;
        }
        this._redrawScheduled = true;
        // Schedule the redraw to run before the next browser paint
        requestAnimationFrame(() => {
            this._doRedraw();
        });
    }

    // To be implemented by child classes - perform the redraw at appropriate time
    redraw() {}

    // ========================================================================
    // Public Accessors (Getters)
    // ========================================================================

    get margins() {
        return this.config.margins;
    }

    get plotWidth() {
        return Math.max(
            10,
            this.svgWidth - this.margins.left - this.margins.right
        );
    }
    get plotHeight() {
        return Math.max(
            10,
            this.svgHeight - this.margins.top - this.margins.bottom
        );
    }

    // ========================================================================
    // Core Private Update Logic
    // ========================================================================

    /** called by requestAnimationFrame */
    _doRedraw() {
        if (!this._redrawScheduled) return;
        if (typeof this.config.onBeforeRedraw === 'function')
            this.config.onBeforeRedraw();

        // onBeforeRedraw is expected to freely call scheduleRedraw as it makes
        // final tweaks to art parameters. But, scheduleRedraw should not be called
        // after this; set to false just so we can detect and flag that.
        this._redrawScheduled = false;

        this.plotArea
            .transition()
            .duration(this.config.transitionDuration)
            .ease(d3.easeExpOut)
            .attr(
                'transform',
                `translate(${this.margins.left},${this.margins.top})`
            );
        this.redraw();

        if (this._redrawScheduled)
            console.warn('scheduleRedraw was called during redraw. Ignoring.');

        this._redrawScheduled = false;
    }

    // ========================================================================
    // Destroy Method
    // ========================================================================

    /** Cleans up resources like observers and listeners. */
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

export default ResponsivePlot;
