// ResponsivePlot.js

import * as d3 from 'd3';
import { debounce, renderSpanMath } from './utils.js';

const fadeTransitionName = 'fade';
const noFadeClass = 'no-fade-in-children';

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
        this.config = {
            ...defaults,
            ...config,
            // merge margins partially so callers can pass e.g. { right: 90 }
            // and have the other sides fall back to the defaults.
            margins: { ...defaults.margins, ...config?.margins },
        };
        // Deterministic render for screenshots/tests: append ?static to the page
        // URL to drop all fade/transition timing, so figures paint fully on the
        // first frame instead of racing a headless capture.
        if (
            typeof location !== 'undefined' &&
            new URLSearchParams(location.search).has('static')
        ) {
            this.config.transitionDuration = 0;
            this.config.fadeDuration = 0;
            this.config.resizeDebounceDelay = 0;
        }
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
            .classed(noFadeClass, true)
            .style('-webkit-user-select', 'none')
            .style('user-select', 'none')
            .style('-webkit-tap-highlight-color', 'transparent');

        this.plotArea = this.svg
            .append('g')
            .attr(
                'transform',
                `translate(${this.margins.left},${this.margins.top})`
            );

        // ?debug: visualize the plot-area extent (Mark's lightpink trick —
        // instantly surfaces padding/margin bugs). Sized in _doRedraw.
        this._debugBgRect = null;
        if (
            typeof location !== 'undefined' &&
            new URLSearchParams(location.search).has('debug')
        ) {
            this._debugBgRect = this.plotArea
                .append('rect')
                .attr('fill', 'lightpink');
        }

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

        // ?static mode: ResizeObserver rides the rendering pipeline, and a
        // headless capture stops producing frames once the page looks done —
        // so a load-time container resize (scrollbar, late CSS/fonts) can be
        // silently missed, leaving the figure drawn at a stale width. Force a
        // fresh measure + redraw once the page has fully settled.
        if (this.config.transitionDuration === 0) {
            const settle = () => {
                const node = this.container.node();
                if (node.clientWidth > 0) {
                    this.svgWidth = node.clientWidth;
                    this.svgHeight = node.clientHeight;
                    this.scheduleRedraw();
                }
            };
            if (document.readyState === 'complete') queueMicrotask(settle);
            else window.addEventListener('load', settle, { once: true });
            if (document.fonts?.ready) document.fonts.ready.then(settle);
        }
    }

    // ========================================================================
    // Public API Methods
    // ========================================================================

    // Request a redraw (e.g. due to updated data)
    scheduleRedraw() {
        if (this._redrawScheduled) return;

        // Do not proceed if ResizeObserver has not yet fired.
        if (this.svgWidth === null) return;

        // ?static mode: schedule via microtask, NOT requestAnimationFrame.
        // Headless captures stop producing frames once the page looks
        // "visually complete", starving any late rAF (e.g. the redraw after
        // a load-time container resize) — microtasks always run.
        if (this.config.transitionDuration === 0) {
            this._redrawScheduled = true;
            queueMicrotask(() => this._doRedraw());
            return;
        }

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
     *
     * Usage example: selection.call(diagram.transition(s=>s.attr('x',newX)))
     *
     * @param {function} applyAttrsCallable
     */
    transition(applyAttrsCallable, name = undefined) {
        // Zero duration (?static): apply synchronously with NO d3 transition.
        // A zero-duration transition still waits for a timer tick, which a
        // headless capture or an interrupting redraw can race — leaving
        // elements at stale positions.
        if (this.config.transitionDuration === 0)
            return (s) => applyAttrsCallable(s);
        return (s) =>
            applyAttrsCallable(
                s
                    .transition(name)
                    .duration(this.config.transitionDuration)
                    .ease(this.config.transitionEase)
            );
    }

    /**
     * Helper to draw elements with fade-in and transition support.
     * The onX functions take a selection and do whatever with it. Return values ignored.
     *
     * Roughly parentGroups.selectChildren().data(data,dataKey).join(element)
     * But with fancy fade-in logic and various hooks.
     *
     * New elements are appended then they see:
     *      (fadein)              [transition started on enter]
     *      onNew -> onUpdateImmediate -> onUpdateTransition   [all immediate]
     * Updating elements see:
     *      onUpdateImmediate     [immediate]
     *      (onUpdateTransition)  [via a transition]
     * Exiting elements see:
     *      onExiting             [immediate]
     *      (fadeout -> remove)   [transition started]
     */
    drawElements({
        parentGroups,
        data = [null],
        dataKey = undefined,
        element,
        cssClass = null,
        fadeIn = true,
        fadeOut = true,
        onNew = null,
        onUpdateImmediate = null,
        onUpdateTransition = null,
        onExiting = null,
    }) {
        const selectedElements = parentGroups
            .selectAll(
                ':scope >' + // direct children only (a bit more performant than D3's .selectChildren)
                    element +
                    (cssClass ? '.' + cssClass : '') +
                    ':not([data-join-exited])' // don't revive zombies (see exitingElements below)
            )
            .data(data, dataKey);

        // Handle incoming elements
        const enterParents = selectedElements.enter();
        const newElements = enterParents.append(element);
        if (!newElements.empty()) {
            if (cssClass) newElements.classed(cssClass, true);
            // With fades disabled (?static), never pass through the opacity-0
            // birth state at all: a zero-duration transition still needs its
            // timer tick to fire, and a headless capture (or an interrupting
            // redraw) can race it, leaving elements stuck invisible.
            if (fadeIn && this.config.fadeDuration > 0) {
                // Find which elements to fade in. If an ancestor has just started to
                // fade in, then we should just appear directly (no double fade).
                const elementsToFade = newElements.filter(
                    function (d, i, nodes) {
                        // `this` is our DOM node.
                        return !this.parentNode.closest('.' + noFadeClass);
                    }
                );
                if (!elementsToFade.empty())
                    elementsToFade
                        .attr('opacity', 0)
                        .classed(noFadeClass, true) // Ask our children to not fade in.
                        .transition(fadeTransitionName)
                        .duration(this.config.fadeDuration)
                        .ease(this.config.fadeEase)
                        .attr('opacity', 1)
                        .on('start', function (d, i, nodes) {
                            // One frame after we enter, now children are allowed to
                            // fade in. `this` is our DOM node.
                            this.classList.remove(noFadeClass);
                        });
            }
            if (onNew) onNew(newElements);
        }

        // Handle updating elements
        const updateElements = selectedElements;
        const mergedElements = newElements.merge(updateElements);

        if (onUpdateImmediate) onUpdateImmediate(mergedElements);

        if (onUpdateTransition) {
            if (!newElements.empty()) onUpdateTransition(newElements);
            if (!updateElements.empty())
                this.transition(onUpdateTransition)(updateElements);
        }

        // Handle exiting elements
        const exitingElements = selectedElements.exit();
        if (!exitingElements.empty()) {
            if (onExiting) onExiting(exitingElements);
            // The data-join-exited attribute is applied here
            // so that once elements start fading out, they cannot
            // be picked up again by the selectChildren and re-enter
            // as 'zombies'.
            if (fadeOut && this.config.fadeDuration > 0)
                exitingElements
                    .attr('data-join-exited', true)
                    .transition(fadeTransitionName)
                    .duration(this.config.fadeDuration)
                    .ease(this.config.fadeEase)
                    .attr('opacity', 0)
                    .remove();
            else exitingElements.remove();
        }

        return mergedElements;
    }

    /**
     * Like drawElements() but for static elements (the 'stage').
     */
    drawStaticElements({ data = [null], ...fields }) {
        return this.drawElements({ data, fadeIn: false, ...fields });
    }

    /**
     * A generic helper to draw HTML+KaTeX/KaTeX labels using <foreignObject>.
     * Supports math, multi-line, alignment, and text wrapping.
     * @param {object} options - The configuration for drawing labels.
     * @param {d3.Selection} options.parentGroups - The parent D3 selection.
     * @param {string} options.cssClass - The CSS class for the <foreignObject> elements.
     * @param {Array<object>|function} options.labelData - Data set for the labels. Each object can have `label`, `mathMode`, `align` ('top/center/bottom left/center/right'), `wrapWidthPx`.
     * @param {function} [options.dataKey] - The key function for the data join when there are multiple labels.
     * @param {boolean} [options.fadeIn=true] - Whether to fade in new labels.
     * @param {function} [options.onUpdateTransition] - A callable to apply transitions for positioning.
     */
    drawLabelsFancy({
        parentGroups,
        cssClass,
        labelData,
        dataKey = undefined,
        fadeIn = true,
        onUpdateTransition = null,
    }) {
        this.drawElements({
            parentGroups,
            element: 'foreignObject',
            cssClass,
            data: labelData,
            dataKey,
            fadeIn,
            onNew: (s) =>
                s
                    .classed('rp-label-foreign-object', true)
                    .attr('width', 1)
                    .attr('height', 1)
                    .style('overflow', 'visible')
                    .html(
                        // raw span: this can be targeted for CSS text styling (colors, borders, etc)
                        '<span class="rp-label-span" style="display: inline-block;"></span>'
                    ),
            onUpdateImmediate: (s) =>
                s.each(function (d) {
                    const fo = this;
                    const span = fo.firstChild;
                    const {
                        label,
                        mathMode = false,
                        hAlign = 'left',
                        vAlign = 'bottom',
                        wrapWidthPx,
                    } = d;

                    if (wrapWidthPx === undefined) {
                        span.style.setProperty('white-space', 'nowrap');
                        span.style.removeProperty('max-width');
                    } else {
                        span.style.setProperty('white-space', 'normal');
                        span.style.setProperty('max-width', `${wrapWidthPx}px`);
                    }

                    renderSpanMath(span, label, !mathMode);

                    const width = span.offsetWidth;
                    const height = span.offsetHeight;

                    const x =
                        hAlign === 'left'
                            ? 0
                            : hAlign === 'right'
                              ? -width
                              : -width / 2;
                    const y =
                        vAlign === 'top'
                            ? 0
                            : vAlign === 'bottom'
                              ? -height
                              : -height / 2;

                    fo.setAttribute('x', x);
                    fo.setAttribute('y', y);
                }),
            onUpdateTransition,
        });
    }

    /**
     * Draws a centered, rotated Y-axis label using a <foreignObject>.
     * This is a common helper for plots that inherit from ResponsivePlot.
     * @param {d3.Selection} - Parent group to append to.
     * @param {string} labelText - The text for the label, supporting KaTeX.
     * @protected
     */
    drawYAxisLabel(axesGroup, labelText) {
        this.drawLabelsFancy({
            parentGroups: axesGroup,
            cssClass: 'rp-y-axis-label',
            labelData: [
                {
                    label: labelText,
                    hAlign: 'center',
                    // 'top' + the rotate(-90) below = the label box extends
                    // from the anchor toward the axis.
                    vAlign: 'top',
                },
            ],
            fadeIn: false, // It's a static element
            onUpdateTransition: (s) =>
                s.attr(
                    'transform',
                    // Anchored at the OUTER edge of the left margin, so the
                    // margin size directly sets the label-to-axis gap (an
                    // abstract axis with no tick text can use a small margin).
                    // The old -0.6*left anchor floated proportionally far away.
                    `translate(${-this.margins.left + 4}, ${0.5 * this.plotHeight}) rotate(-90)`
                ),
        });
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

        this.transition((s) =>
            s.attr(
                'transform',
                `translate(${this.margins.left},${this.margins.top})`
            )
        )(this.plotArea);

        if (this._debugBgRect)
            this._debugBgRect
                .attr('width', this.plotWidth)
                .attr('height', this.plotHeight);

        this.redraw();

        if (this._redrawScheduled)
            console.warn('scheduleRedraw was called during redraw. Ignoring.');

        this._redrawScheduled = false;
        this._debouncedScheduleRedraw.cancel(); // might as well
        this.svg.classed(noFadeClass, false);
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
