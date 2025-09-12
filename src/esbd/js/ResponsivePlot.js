// ResponsivePlot.js

// Assumes D3 is loaded globally or imported appropriately.

import { debounce, Fader } from './utils.js';

/**
 * Responsively-sized plot using D3.js
 * Makes a single SVG plot area inside.
 * It is assumed you will control the plot container's size using HTML/CSS.
 * Important: Parent div must have an explicit known height, so that height:100% works!
 *
 * .redraw() -- you override this.
 * .svg -- the whole SVG canvas
 * .svgWidth and .svgHeight -- whole canvas size
 * .plotArea -- translated plot area group (top/left margins applied)
 * .plotWidth and .plotHeight -- computed plot area size
 */
class ResponsivePlot {
    // ========================================================================
    // Constructor
    // ========================================================================

    /**
     * Creates an instance of the plot
     * @param {string} containerId - ID of the HTML element (div) to contain the plot.
     * @param {object} [margins={top: 5, right: 35, bottom: 20, left: 60}] - Plot margins.
     * @param {number} [transitionDuration=250] - Transition time (ms) for continuous updates.
     * @param {object} [transitionEase=d3.easeExpOut] - Transition easing function (note this needs a fast start).
     * @param {number} [fadeDuration=400] - Fade time (ms) for elements fading in/out.
     * @param {object} [fadeEase=d3.easeCubicInOut] - Fade easing function (anything is ok).
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
            transitionEase: d3.easeExpOut,
            fadeDuration: 400,
            fadeEase: d3.easeCubicInOut,
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
        this._requestAnimationFrameID = null;
        this.svgWidth = null;
        this.svgHeight = null;

        this.fader = new Fader(
            this.config.fadeDuration,
            this.config.fadeEase,
            'fade'
        );

        // Populate the container
        this.outerContainer.html('');
        if (this.outerContainer.node().clientHeight == 0) {
            console.warn('initial height is 0 on ', this.config.containerId);
        }

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
        this._debouncedScheduleRedraw = debounce(() => {
            this.scheduleRedraw();
        }, this.config.resizeDebounceDelay);

        this._resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const firstRO = this.svgWidth === null;
                const { width, height } = entries[0].contentRect;

                if (this.svgWidth === width && this.svgHeight === height) {
                    console.info('Ignoring unchanged size.');
                    return;
                }

                this.svgWidth = width;
                this.svgHeight = height;

                if (firstRO) this.scheduleRedraw();
                else this._debouncedScheduleRedraw();
            }
        });
        this._resizeObserver.observe(this.container.node());

        // Note ResizeObserver is guaranteed to be fired, will set our size appropriately
        // and then schedule our first redraw.
    }

    // ========================================================================
    // Public API Methods
    // ========================================================================

    // Request a redraw (e.g. due to updated data)
    scheduleRedraw() {
        if (this._redrawScheduled) return;

        // Do not proceed if ResizeObserver has not yet fired.
        if (this.svgWidth === null) return;

        console.assert(this._requestAnimationFrameID === null);

        // Schedule the redraw to run before the next browser paint
        this._requestAnimationFrameID = requestAnimationFrame(() => {
            this._requestAnimationFrameID = null;
            this._doRedraw(); // will unset _redrawScheduled
        });

        this._redrawScheduled = true; // only place where this is assigned true.
    }

    // To be implemented by child classes - perform the redraw at appropriate time
    redraw() {}

    /**
     * Helper to apply transitions.
     * Note: for fade-ins and outs, it's better to use the .fader helper instead.
     *
     * Usage example: selection.call(diagram.transition(s=>s.attr('x',newX)))
     *
     * @param {function} applyAttrsCallable
     */
    transition(applyAttrsCallable, name = undefined) {
        return (s) =>
            applyAttrsCallable(
                s
                    .transition(name)
                    .duration(this.config.transitionDuration)
                    .ease(this.config.transitionEase)
            );
    }

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
        // final tweaks to art parameters. We will silently ignore those. But,
        // scheduleRedraw should not be called after this; set to false just so
        // we can detect and flag that.
        this._redrawScheduled = false;

        this.plotArea
            .transition()
            .duration(this.config.transitionDuration)
            .ease(this.config.transitionEase)
            .attr(
                'transform',
                `translate(${this.margins.left},${this.margins.top})`
            );
        this.redraw();

        if (this._redrawScheduled)
            console.warn('scheduleRedraw was called during redraw. Ignoring.');

        this._redrawScheduled = false;
        this._debouncedScheduleRedraw.cancel(); // might as well
    }

    // ========================================================================
    // Destroy Method
    // ========================================================================

    /** Cleans up resources like observers and listeners. */
    destroy() {
        this._resizeObserver.disconnect();
        this._debouncedScheduleRedraw.cancel();
        if (this._requestAnimationFrameID !== null)
            window.cancelAnimationFrame(this._requestAnimationFrameID);
        this.svgWidth = null; // disable scheduleRedraw just in case
        this._redrawScheduled = false; // disable _doRedraw just in case
        this.outerContainer.html('');
    }
} // End of class

export default ResponsivePlot;
