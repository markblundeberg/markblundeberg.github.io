// ElectrochemicalSpeciesBandDiagram.js
// ESBD Module using D3.js (v7+)

// Assumes D3 and KaTeX (core + auto-render) are loaded globally or imported appropriately.

import { formatTooltipBaseContent, debounce } from './utils.js';

// --- Constants ---
const R = 8.31446261815324; // J / (mol K)
const F = 96485.33212331001; // C / mol (Faraday constant)
const e_charge = 1.602176634e-19; // C (Elementary charge)
const Na = 6.02214076e23; // 1 / mol (Avogadro constant)
const TEMP_K = 298.15; // Standard Temperature (Kelvin)
const J_PER_MOL_TO_EV = 1 / (Na * e_charge); // eV / (J/mol)
const V_TO_EV_PER_CHARGE = 1; // Factor for E = -V scaling in eV mode
const F_kJmol = F / 1000.0; // F in kJ / (V mol), used for G_display = V_volt * F_kJmol

// Default styling constants
const STYLE_DEFAULTS = {
    potential: { lineWidth: 3, dasharray: null },
    standardState: { lineWidth: 1, dasharray: null },
    bandEdge_C: { lineWidth: 2, dasharray: '4,2' },
    bandEdge_V: { lineWidth: 2, dasharray: '4,2' },
    phi: { lineWidth: 1, dasharray: '5,5', color: 'grey' },
    other: { lineWidth: 1, dasharray: null },
    connector: { lineWidth: 1, dasharray: '2,2' },
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
        legColor: '#888',
        legWidth: 1,
        legThresholdPx: 15, // Min gap in pixels to draw legs
        highlightColor: 'rgba(0, 123, 255, 0.3)', // Example highlight (semi-transparent blue bg)
        highlightStroke: 'rgba(0, 123, 255, 0.5)',
    },
};

/**
 * Creates an interactive Electrochemical Species Band Diagram using D3.js.
 * Uses a boundaries array and region properties array for layout.
 * Caller provides fundamental physical data with explicit units.
 */
class ElectrochemicalSpeciesBandDiagram {
    /**
     * Creates an instance of the ESBD diagram.
     * @param {string} containerId - ID of the HTML element to contain the plot.
     * @param {object} [initialConfig={}] - Initial configuration options.
     * @param {number} [initialConfig.width=800] - Initial width hint (will adapt).
     * @param {number} [initialConfig.height=500] - Initial height hint (will adapt).
     * @param {string} [initialConfig.mode='Volts'] - Initial display mode ('Volts', 'eV', 'kJmol').
     * @param {object} [initialConfig.margin={top: 15, right: 25, bottom: 20, left: 60}] - Plot margins.
     * @param {number} [initialConfig.transitionDuration=250] - Duration for D3 transitions (ms).
     * @param {number} [initialConfig.throttleDelay=100] - Delay for tooltip throttling (ms).
     * @param {number} [initialConfig.resizeDebounceDelay=200] - Debounce delay for resize events (ms).
     */
    constructor(containerId, initialConfig = {}) {
        this.containerId = containerId;
        this.container = d3.select(`#${this.containerId}`);
        if (this.container.empty()) {
            throw new Error(`Container element #${containerId} not found.`);
        }

        // Configuration with defaults
        this.config = {
            width: initialConfig.width || 800,
            height: initialConfig.height || 500,
            mode: ['Volts', 'eV', 'kJmol'].includes(initialConfig.mode)
                ? initialConfig.mode
                : 'Volts',
            margin: initialConfig.margin || {
                top: 15,
                right: 25,
                bottom: 20,
                left: 60,
            },
            transitionDuration: initialConfig.transitionDuration ?? 250,
            throttleDelay: initialConfig.throttleDelay ?? 100,
            resizeDebounceDelay: initialConfig.resizeDebounceDelay ?? 200,
            tempK: initialConfig.tempK || TEMP_K,
        };

        // Internal state initialization
        this.speciesInfo = new Map();
        this.traceData = [];
        this.boundaries = [];
        this.regionProps = [];
        this.verticalMarkers = new Map();
        this.lastDrawData = [];

        // Callbacks & Interaction state
        this._modeChangeCallback = null;
        this._tooltipCallback = formatTooltipBaseContent; // Default formatter
        this._throttleTimeout = null;
        this._throttleWaiting = false; // For tooltip throttling

        // Clear container initially
        this.container.html('');

        // Tooltip Element setup
        this._tooltip = this.container
            .append('div')
            .attr('class', 'esbd-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('opacity', 0)
            .style('background', 'rgba(245, 245, 245, 0.95)')
            .style('border', '1px solid #aaa')
            .style('border-radius', '4px')
            .style('padding', '8px')
            .style('font-size', '11px') // Slightly smaller tooltip text
            .style('pointer-events', 'none')
            .style('z-index', '10')
            .style('transition', 'opacity 0.2s')
            .style('max-width', '250px') // Prevent tooltip getting too wide
            .style('box-shadow', '0 2px 5px rgba(0,0,0,0.2)');

        // --- D3 Setup ---
        this._setupD3Structure();

        // --- Responsiveness ---
        const initialWidth =
            this.container.node().clientWidth || this.config.width;
        const initialHeight =
            this.container.node().clientHeight || this.config.height;
        this._handleResize(initialWidth, initialHeight, false); // Initial size calculation, no redraw

        // Debounced resize handler
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

        console.log(
            `ESBD Initialized in #${containerId}. Mode: ${this.config.mode}`
        );
    }

    _setupD3Structure() {
        this.svg = this.container
            .append('svg')
            .attr('class', 'esbd-svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height)
            .style('position', 'absolute') // make sure position:absolute to avoid resize infinite loops!
            .style('-webkit-tap-highlight-color', 'transparent');

        this.plotArea = this.svg
            .append('g')
            .attr('class', 'esbd-plot-area')
            .attr(
                'transform',
                `translate(${this.config.margin.left},${this.config.margin.top})`
            );

        // Layer groups (order matters for rendering)
        this.backgroundGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-backgrounds');
        this.interfaceGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-interfaces');
        this.gridGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-grid')
            .style('pointer-events', 'none');
        this.connectorsGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-connectors')
            .style('pointer-events', 'none');
        this.linesGroup = this.plotArea.append('g').attr('class', 'esbd-lines');
        this.interactionRect = this.plotArea
            .append('rect')
            .attr('class', 'esbd-interaction-overlay')
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('pointerout', () => {
                clearTimeout(this._throttleTimeout);
                this._throttleTimeout = null;
                this._throttleWaiting = false;
                this._hideTooltip();
            })
            .on('pointermove', (event) => this._handleInteraction(event, false))
            .on('click', (event) => this._handleInteraction(event, true));
        this.verticalMarkersGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-vertical-markers');
        this.labelsGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-labels')
            .style('pointer-events', 'none');
        this.customGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-custom-drawing');

        // Scales & Axes
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.xAxisGen = d3.axisBottom(this.xScale);
        this.yAxisGen = d3.axisLeft(this.yScale);
        this.xAxisGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-x-axis');
        this.yAxisGroup = this.plotArea
            .append('g')
            .attr('class', 'esbd-y-axis');

        // Interactive Y-Axis Label
        this.yAxisLabel = this.svg
            .append('text')
            .attr('class', 'esbd-y-axis-label esbd-interactive')
            .style('text-anchor', 'middle')
            .style('cursor', 'pointer')
            .style('-webkit-user-select', 'none')
            .style('user-select', 'none')
            .on('click', () => this._handleYAxisLabelClick());

        // Line generator template
        this.lineGenerator = d3
            .line()
            .x((d) => this.xScale(d.x))
            .y((d) => this.yScale(d.y_display)) // Use y_display for plotting
            .defined(
                (d) =>
                    d.y_display !== null &&
                    !isNaN(d.y_display) &&
                    isFinite(d.y_display)
            );
    }

    // --- Public API Methods ---

    /** Stores properties for a given species ID. */
    addSpeciesInfo(speciesId, properties) {
        if (!speciesId || !properties) {
            console.error('ESBD Error: Invalid input for addSpeciesInfo.');
            return;
        }
        if (properties.z !== null && typeof properties.z !== 'number') {
            console.warn(
                `ESBD Warn: Invalid charge number for species ${speciesId}. Setting z to null.`
            );
            properties.z = null;
        }
        this.speciesInfo.set(speciesId, {
            z: properties.z,
            color: properties.color || 'black',
            latexPrettyName: properties.latexPrettyName || speciesId,
        });
    }

    /** Updates the complete set of trace data to be plotted. */
    updateTraceData(traceDefs = []) {
        if (!Array.isArray(traceDefs)) {
            console.error('ESBD Error: updateTraceData expects an array.');
            this.traceData = [];
        } else {
            this.traceData = traceDefs;
        }
        this.redraw();
    }

    /**
     * Sets the spatial layout using boundaries and region properties.
     * @param {Array<number>} boundaries - Sorted array of x-coordinates defining region edges (e.g., [0, 0.2, 0.5, 1.0]). Must include 0 and max x.
     * @param {Array<object>} regionProperties - Array of properties for regions between boundaries. Length must be boundaries.length - 1. E.g., [{name, color}, {name, color}, ...]
     */
    setSpatialLayout(boundaries = [], regionProperties = []) {
        // Basic validation
        if (
            !Array.isArray(boundaries) ||
            boundaries.length < 2 ||
            !Array.isArray(regionProperties) ||
            regionProperties.length !== boundaries.length - 1
        ) {
            console.error(
                'ESBD Error: Invalid input for setSpatialLayout. Need boundaries array (N+1 >= 2) and regionProperties array (N).',
                { boundaries, regionProperties }
            );
            this.boundaries = [];
            this.regionProps = [];
        } else {
            // Optional: Add validation for sorted boundaries
            let sorted = true;
            for (let i = 1; i < boundaries.length; i++) {
                if (boundaries[i] < boundaries[i - 1]) sorted = false;
            }
            if (!sorted) {
                console.error('ESBD Error: Boundaries must be sorted.');
                this.boundaries = [];
                this.regionProps = [];
            } else {
                this.boundaries = boundaries;
                this.regionProps = regionProperties;
            }
        }
        // Redraw static elements immediately if possible
        if (this.plotArea) {
            this._drawBackgrounds();
            this._drawInterfaceLines();
        }
    }

    /**
     * Defines a vertical marker to be displayed, often at an interface or specific point.
     * Can represent reactions, energy gaps, overpotentials etc. via tooltip callback.
     * @param {string} markerId - Unique identifier for this marker.
     * @param {object} definition - Marker definition.
     * @param {string} [definition.symbol='↕'] - SVG text symbol to display.
     * @param {string} [definition.speciesId1] - Optional: speciesId for potential y1 (for z lookup).
     * @param {string} [definition.speciesId2] - Optional: speciesId for potential y2 (for z lookup).
     * @param {function} definition.tooltipCallback - Function(info) to generate tooltip HTML.
     */
    addVerticalMarker(markerId, definition) {
        if (
            !markerId ||
            !definition ||
            typeof definition.tooltipCallback !== 'function'
        ) {
            console.error(
                'ESBD Error: Invalid definition for addVerticalMarker. Requires markerId and tooltipCallback.',
                definition
            );
            return;
        }
        this.verticalMarkers.set(markerId, {
            definition: {
                symbol:
                    definition.symbol || STYLE_DEFAULTS.verticalMarker.symbol,
                speciesId1: definition.speciesId1,
                speciesId2: definition.speciesId2,
                tooltipCallback: definition.tooltipCallback,
            },
            currentData: null, // Position/data updated via updateVerticalMarker
        });
    }

    /**
     * Updates the position and data for a defined vertical marker.
     * @param {string} markerId - Identifier of the marker to update.
     * @param {object} data - Data for positioning and tooltip.
     * @param {number} data.x - X-coordinate (data units) where the marker should appear.
     * @param {number} data.y1 - Potential/Energy value 1 (in specified units).
     * @param {number} data.y2 - Potential/Energy value 2 (in specified units).
     * @param {string} data.inputUnits - Units of y1 and y2 (e.g., 'V_volt', 'mu_bar_eV').
     * @param {any} [data.tooltipArgs={}] - Custom data to pass to the tooltip callback.
     */
    updateVerticalMarker(markerId, data) {
        if (!this.verticalMarkers.has(markerId)) {
            console.warn(
                `ESBD Warn: No vertical marker found with ID "${markerId}" to update.`
            );
            return;
        }
        if (
            !data ||
            data.x === undefined ||
            data.y1 === undefined ||
            data.y2 === undefined ||
            !data.inputUnits
        ) {
            console.error(
                `ESBD Error: Invalid data for updateVerticalMarker. Requires x, y1, y2, inputUnits.`,
                data
            );
            return;
        }

        const marker = this.verticalMarkers.get(markerId);
        // Look up z values if needed for conversion (using optional speciesId from definition)
        const z1 = this.speciesInfo.get(marker.definition.speciesId1)?.z;
        const z2 = this.speciesInfo.get(marker.definition.speciesId2)?.z;

        // Convert input y values to internal V_volt representation and store
        const y1_volt = this._convertToVolts(data.y1, data.inputUnits, z1);
        const y2_volt = this._convertToVolts(data.y2, data.inputUnits, z2);

        // Store current data including pre-calculated volt values
        marker.currentData = {
            x: data.x,
            y1_volt: y1_volt,
            y2_volt: y2_volt,
            tooltipArgs: data.tooltipArgs || {}, // Store custom args
        };
    }
    // --- End Refactor ---

    /** Sets the display mode and triggers redraw and callback. */
    setMode(newMode) {
        const validModes = ['Volts', 'eV', 'kJmol'];
        if (!validModes.includes(newMode) || newMode === this.config.mode)
            return;

        this.config.mode = newMode;
        console.log('ESBD Mode switched to:', this.config.mode);
        this._hideTooltip();
        this.redraw(); // Redraw applies new scaling

        if (this._modeChangeCallback) {
            try {
                this._modeChangeCallback(this.config.mode, {
                    xScale: this.xScale,
                    yScale: this.yScale,
                });
            } catch (e) {
                console.error('Error in onModeChange callback:', e);
            }
        }
    }

    /** Registers a callback function triggered after the mode changes and redraw starts. */
    onModeChange(callbackFn) {
        this._modeChangeCallback =
            typeof callbackFn === 'function' ? callbackFn : null;
    }
    /** Registers a callback function to generate tooltip content dynamically. */
    setTooltipCallback(callbackFn) {
        this._tooltipCallback =
            typeof callbackFn === 'function' ? callbackFn : null;
    }

    /** Main drawing/update function. */
    redraw() {
        if (!this.svg || !this.plotArea) {
            console.error(
                'ESBD Error: Attempted redraw before structure setup.'
            );
            return;
        }

        // 1. Prepare Data (converts units, scales to display mode)
        this.lastDrawData = this._preparePlotDataAndScale();
        const hasPlottableData = this.lastDrawData.some(
            (t) => t.points.length > 0
        );

        // 2. Update Scales
        const xDomain = d3.extent(
            this.boundaries && this.boundaries.length > 0
                ? this.boundaries
                : this.lastDrawData.flatMap((t) => t.points.map((p) => p.x))
        );
        if (xDomain[0] === undefined) xDomain = [0, 1];
        this.xScale.domain(xDomain).nice();

        const allYValues = this.lastDrawData.flatMap((t) =>
            t.points.map((p) => p.y_display)
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
            const fallbackCenter = yDomain[0] !== undefined ? yDomain[0] : 0;
            yDomain = [fallbackCenter - 1, fallbackCenter + 1];
        } else {
            const padding = (yDomain[1] - yDomain[0]) * 0.1;
            yDomain[0] -= padding;
            yDomain[1] += padding;
        }
        this.yScale.domain(yDomain).nice();

        // 3. Update Axes (apply transitions)
        this.xAxisGroup
            .attr('transform', `translate(0,${this.plotHeight})`)
            .transition()
            .duration(this.config.transitionDuration)
            .call(this.xAxisGen);
        this.yAxisGroup
            .transition()
            .duration(this.config.transitionDuration)
            .call(this.yAxisGen);
        this.yAxisLabel.text(this._getYAxisLabel()); // Update text immediately

        // 4. Draw Static Elements (backgrounds/interfaces don't usually need transitions)
        this._drawBackgrounds();
        this._drawInterfaceLines();

        // 5. Draw Data Elements (these use transitions internally)
        this._drawTraces();
        this._drawConnectors();
        this._drawVerticalMarkers();
        this._drawLabels();
    }

    /** Cleans up resources like observers and listeners. */
    destroy() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
        // Clear any pending timeouts
        clearTimeout(this._throttleTimeout);
        if (
            this._debouncedHandleResize &&
            typeof this._debouncedHandleResize.cancel === 'function'
        ) {
            this._debouncedHandleResize.cancel();
        }
        this._hideTooltip();
        this.container.html('');
        console.log('ESBD Destroyed.');
    }

    // --- Public Accessors ---
    get svgNode() {
        return this.svg?.node();
    }
    get mainGroupNode() {
        return this.plotArea?.node();
    }
    get currentXScale() {
        return this.xScale;
    }
    get currentYScale() {
        return this.yScale;
    }
    get plotWidth() {
        return Math.max(
            10,
            this.config.width -
                this.config.margin.left -
                this.config.margin.right
        );
    }
    get plotHeight() {
        return Math.max(
            10,
            this.config.height -
                this.config.margin.top -
                this.config.margin.bottom
        );
    }

    // --- "Private" Helper Methods ---

    _handleResize(width, height, shouldRedraw = true) {
        // Update config dimensions based on container size reported by observer
        this.config.width = width;
        this.config.height = height;

        // Update SVG element size to match container
        this.svg
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        // Calculate new plot area dimensions using getters
        const pw = this.plotWidth;
        const ph = this.plotHeight;

        // Update things that depend directly on pw, ph
        this.plotArea.attr(
            'transform',
            `translate(${this.config.margin.left},${this.config.margin.top})`
        );
        this.xScale.range([0, pw]);
        this.yScale.range([ph, 0]);
        this.xAxisGroup.attr('transform', `translate(0,${ph})`);
        this.yAxisLabel.attr(
            'transform',
            `translate(${this.config.margin.left / 2.5}, ${this.config.margin.top + ph / 2}) rotate(-90)`
        );
        this.interactionRect.attr('width', pw).attr('height', ph);

        // Trigger redraw if requested and data exists
        // Debouncing prevents this being called excessively or causing loops
        if (shouldRedraw && this.traceData.length > 0) {
            this.redraw();
        }
    }

    _handleYAxisLabelClick() {
        const modes = ['Volts', 'eV', 'kJmol'];
        const currentIdx = modes.indexOf(this.config.mode);
        const nextIdx = (currentIdx + 1) % modes.length;
        this.setMode(modes[nextIdx]);
    }

    _getYAxisLabel() {
        // Add unicode arrows or similar to hint clickability
        const arrows = ' \u21F5 '; // Up down arrows symbol
        switch (this.config.mode) {
            case 'eV':
                return `Energy (eV)${arrows}`; // E = -eV convention
            case 'kJmol':
                return `Molar Energy / z (kJ/mol)${arrows}`; // G = FV = μ̄/z
            case 'Volts':
            default:
                return `Potential (V)${arrows}`; // V = μ̄/(zF)
        }
    }

    /** Converts input data value to the internal V_volt representation. */
    _convertToVolts(value, inputUnit, z) {
        if (value === null || !isFinite(value)) return null;

        switch (inputUnit) {
            case 'mu_bar_kJmol':
                if (z === null || typeof z !== 'number' || z === 0) {
                    console.warn(
                        `ESBD Warn: Cannot convert 'mu_bar_kJmol' to Volts without valid non-zero charge z (received z=${z}).`
                    );
                    return null;
                }
                return (value * 1000) / (z * F); // V = μ̄/(zF)

            case 'mu_bar_eV':
                if (z === null || typeof z !== 'number' || z === 0) {
                    console.warn(
                        `ESBD Warn: Cannot convert 'mu_bar_eV' to Volts without valid non-zero charge z (received z=${z}).`
                    );
                    return null;
                }
                // V = value[eV] / z
                return value / z;

            case 'E_band_eV':
                // Convention V = -E_band / e_charge
                return -value / V_TO_EV_PER_CHARGE; // Effectively -value

            case 'phi_V':
                return value; // V_phi = phi

            case 'V_volt':
                return value;

            default:
                console.warn(
                    `ESBD Warn: Unknown input unit "${inputUnit}" for conversion to Volts.`
                );
                return null;
        }
    }

    /** Scales the internal V_volt value to the final display unit based on mode. */
    _scaleVoltToDisplay(value_volt, z) {
        if (value_volt === null || !isFinite(value_volt)) return null;

        switch (this.config.mode) {
            case 'Volts':
                return value_volt; // Factor = +1

            case 'eV':
                // E = -V_volt * V_TO_EV_PER_CHARGE (where constant is 1)
                // Represents Energy in eV using E = -V convention
                return value_volt * -V_TO_EV_PER_CHARGE; // Factor = -1

            case 'kJmol':
                // G = V_volt * F_kJmol
                // Represents Molar Energy / z in kJ/mol (if V_volt derived from mu_bar)
                // Or represents F*phi/1000 if V_volt derived from phi_V
                // Or represents -Na*E_band/1000 if V_volt derived from E_band_eV
                return value_volt * F_kJmol; // Factor = +F/1000
        }
        return null;
    }

    /** Processes traceDefs, converts inputs to internal V_volt, then scales to y_display */
    _preparePlotDataAndScale() {
        const processedTraces = [];
        for (const traceDef of this.traceData) {
            if (
                !traceDef ||
                !traceDef.id ||
                !traceDef.x ||
                !traceDef.y ||
                !traceDef.inputUnits
            ) {
                console.warn(
                    'ESBD Warn: Skipping invalid trace definition:',
                    traceDef
                );
                continue;
            }
            const species = this.speciesInfo.get(traceDef.speciesId) || {};
            const z = species.z;
            const color = traceDef.color || species.color || 'black';
            const defaultLabelName =
                species.latexPrettyName || traceDef.speciesId || traceDef.id;
            const curveType = traceDef.curveType || 'other';
            const points = [];
            let lastValidPointData = null;
            const xData = traceDef.x || [];
            const yData = traceDef.y || [];

            for (let i = 0; i < xData.length; i++) {
                const x = xData[i];
                const y_input = yData[i];
                const isInRange =
                    !traceDef.xRange ||
                    (x >= traceDef.xRange.min && x <= traceDef.xRange.max);
                if (!isInRange) {
                    lastValidPointData = null;
                    continue;
                }
                const y_internal_volt = this._convertToVolts(
                    y_input,
                    traceDef.inputUnits,
                    z
                );
                const y_display = this._scaleVoltToDisplay(y_internal_volt, z);
                const currentPoint = {
                    x: x,
                    y_display: y_display,
                    y_volt: y_internal_volt,
                    source_y: y_input,
                    source_units: traceDef.inputUnits,
                };
                points.push(currentPoint);
                if (y_display !== null && isFinite(y_display)) {
                    lastValidPointData = { x: x, y: y_display };
                }
            }

            if (points.length > 0) {
                let labelPos =
                    traceDef.showLabel && lastValidPointData
                        ? lastValidPointData
                        : null;
                // Always calculate labelString even if not shown by default
                const labelString = traceDef.labelOverride
                    ? traceDef.labelOverride[this.config.mode] || traceDef.id
                    : this._getAutoLabel(defaultLabelName, curveType);

                processedTraces.push({
                    id: traceDef.id,
                    speciesId: traceDef.speciesId,
                    curveType: curveType,
                    color: color,
                    style: {
                        ...STYLE_DEFAULTS[curveType],
                        ...(traceDef.styleOverride || {}),
                    },
                    points: points,
                    labelPos: labelPos,
                    labelString: labelString,
                    showLabel: Boolean(traceDef.showLabel),
                });
            }
        }
        return processedTraces;
    }

    /**
     * Generates default label based on mode, species name, curve type, and species ID.
     * Returns raw LaTeX string without delimiters.
     */
    _getAutoLabel(prettyName, curveType) {
        let symbol = '?';
        let subscript = prettyName || '?'; // Default to species name
        let superscript = '';

        // Determine base symbol based ONLY on mode
        symbol = { Volts: 'V', eV: 'E', kJmol: 'G' }[this.config.mode] || '?';

        // Add superscripts or modify symbol/subscript based on curveType
        switch (curveType) {
            case 'standardState':
                superscript = '\\ominus';
                break;
            case 'bandEdge_C':
            case 'bandEdge_V':
            case 'bandEdge':
                superscript = '\\text{band}';
                break;
            case 'phi':
                // special case! for volt mode we show \phi, not V_\phi
                symbol =
                    { Volts: '\\phi', eV: 'E', kJmol: 'G' }[this.config.mode] ||
                    '?';
                subscript = this.config.mode === 'Volts' ? '' : '\\phi';
                break;
            case 'potential': // Default case, no changes needed to symbol/subscript/superscript
            default:
                // Keep symbol from mode, keep subscript from prettyName
                // Clear subscript if prettyName was null/undefined?
                if (!prettyName) subscript = '';
                break;
        }

        // Construct final label string (no delimiters)
        if (subscript) {
            // Format like V_{Ag^{+}}^{\ominus} or E^{band}_{e^{-}}
            return `${symbol}${superscript ? `^{${superscript}}` : ''}_{${subscript}}`;
        } else {
            // Format like \phi or V^{\ominus} (if prettyName was cleared)
            return `${symbol}${superscript ? `^{${superscript}}` : ''}`;
        }
    }

    _drawBackgrounds() {
        if (
            !this.boundaries ||
            this.boundaries.length < 2 ||
            !this.regionProps ||
            this.regionProps.length !== this.boundaries.length - 1
        ) {
            this.backgroundGroup.selectAll('rect.esbd-region-bg').remove();
            return;
        }
        // Create data pairs: [ { start: b[0], end: b[1], props: r[0] }, { start: b[1], end: b[2], props: r[1] }, ... ]
        const regionDrawData = this.regionProps.map((props, i) => ({
            id: `bg_${i}_${props?.name?.replace(/\s+/g, '-') || i}`, // Unique ID based on index/name
            start: this.boundaries[i],
            end: this.boundaries[i + 1],
            props: props || {}, // Ensure props object exists
        }));

        this.backgroundGroup
            .selectAll('rect.esbd-region-bg')
            .data(regionDrawData, (d) => d.id) // Key by generated ID
            .join('rect')
            .attr('class', 'esbd-region-bg')
            .attr('x', (d) => this.xScale(d.start))
            .attr('y', 0)
            .attr('width', (d) =>
                Math.max(0, this.xScale(d.end) - this.xScale(d.start))
            ) // Ensure non-negative width
            .attr('height', this.plotHeight)
            .attr('fill', (d) => d.props.color || 'transparent')
            .lower(); // Ensure backgrounds are behind everything else
    }

    _drawInterfaceLines() {
        if (!this.boundaries || this.boundaries.length < 3) {
            // Need at least 3 boundaries for 1 interface line
            this.interfaceGroup.selectAll('line.esbd-interface-line').remove();
            return;
        }
        // Draw lines at internal boundaries (excluding start and end)
        const interfaceData = this.boundaries.slice(1, -1);

        this.interfaceGroup
            .selectAll('line.esbd-interface-line')
            .data(interfaceData, (d) => d) // Key by x-coordinate value
            .join('line')
            .attr('class', 'esbd-interface-line')
            .attr('x1', (d) => this.xScale(d))
            .attr('x2', (d) => this.xScale(d))
            .attr('y1', 0)
            .attr('y2', this.plotHeight)
            .attr('stroke', STYLE_DEFAULTS.interface.color)
            .attr('stroke-width', STYLE_DEFAULTS.interface.lineWidth)
            .attr('stroke-dasharray', STYLE_DEFAULTS.interface.dasharray);
    }

    _drawTraces() {
        this.linesGroup
            .selectAll('path.esbd-data-line')
            .data(this.lastDrawData, (d) => d.id)
            .join(
                (enter) =>
                    enter
                        .append('path')
                        .attr('class', 'esbd-data-line')
                        .attr('data-trace-id', (d) => d.id)
                        .attr('fill', 'none')
                        // Initial position can be set if desired before transition
                        .attr('stroke', (d) => d.color)
                        .attr('stroke-width', (d) => d.style.lineWidth)
                        .attr('stroke-dasharray', (d) => d.style.dasharray),
                (update) => update,
                (exit) =>
                    exit
                        .transition()
                        .duration(this.config.transitionDuration)
                        .style('opacity', 0)
                        .remove() // Fade out removed lines
            )
            .attr('stroke', (d) => d.color) // Update color immediately if changed
            .attr('stroke-width', (d) => d.style.lineWidth)
            .attr('stroke-dasharray', (d) => d.style.dasharray)
            .transition()
            .duration(this.config.transitionDuration)
            .attr('d', (d) =>
                this.lineGenerator.y((p) => this.yScale(p.y_display))(d.points)
            );
    }

    _drawConnectors() {
        // Extract points for standard state and potential for connection
        const connectorPairs = [];
        const potentialPointsByX = new Map(); // Map<x, {y, color}>
        const standardPointsByX = new Map(); // Map<x, {y, color}>

        // Optimize lookup: create maps of points keyed by speciesId and x
        const pointsMap = new Map(); // Map<speciesId, Map<x, point>>
        this.lastDrawData.forEach((trace) => {
            if (!pointsMap.has(trace.speciesId))
                pointsMap.set(trace.speciesId, new Map());
            const tracePoints = pointsMap.get(trace.speciesId);
            trace.points.forEach((p) => tracePoints.set(p.x, p)); // Assumes unique x per trace
        });

        this.lastDrawData.forEach((trace) => {
            if (trace.curveType === 'potential' && trace.speciesId) {
                const stdTraceDef = this.traceData.find(
                    (td) =>
                        td.speciesId === trace.speciesId &&
                        td.curveType === 'standardState'
                );
                if (stdTraceDef) {
                    const stdPointsMap = pointsMap.get(trace.speciesId); // Re-use lookup? No, need standard trace points
                    // Find the corresponding standard trace in lastDrawData
                    const stdTrace = this.lastDrawData.find(
                        (ldd) => ldd.id === stdTraceDef.id
                    );
                    if (stdTrace) {
                        const stdPointsLookup = new Map(
                            stdTrace.points.map((p) => [p.x, p])
                        );
                        trace.points.forEach((p_pot, i) => {
                            const p_std = stdPointsLookup.get(p_pot.x);
                            if (
                                p_pot.y_display !== null &&
                                isFinite(p_pot.y_display) &&
                                p_std &&
                                p_std.y_display !== null &&
                                isFinite(p_std.y_display)
                            ) {
                                connectorPairs.push({
                                    id: `${trace.speciesId}_conn_${p_pot.x}`, // Unique ID based on species & x
                                    x: p_pot.x,
                                    y1: p_pot.y_display,
                                    y2: p_std.y_display,
                                    color: trace.color,
                                });
                            }
                        });
                    }
                }
            }
        });

        this.connectorsGroup
            .selectAll('line.esbd-connector-line')
            .data(connectorPairs, (d) => d.id)
            .join(
                (enter) =>
                    enter
                        .append('line')
                        .attr('class', 'esbd-connector-line')
                        .attr('stroke', (d) => d.color)
                        .attr(
                            'stroke-width',
                            STYLE_DEFAULTS.connector.lineWidth
                        )
                        .attr(
                            'stroke-dasharray',
                            STYLE_DEFAULTS.connector.dasharray
                        ),
                (update) => update,
                (exit) =>
                    exit
                        .transition()
                        .duration(this.config.transitionDuration)
                        .style('opacity', 0)
                        .remove()
            )
            .attr('stroke', (d) => d.color) // Update color immediately
            .transition()
            .duration(this.config.transitionDuration)
            .attr('x1', (d) => this.xScale(d.x))
            .attr('y1', (d) => this.yScale(d.y1))
            .attr('x2', (d) => this.xScale(d.x))
            .attr('y2', (d) => this.yScale(d.y2));
    }

    _drawLabels() {
        const labelData = this.lastDrawData.filter(
            (d) => d.labelPos && d.showLabel && d.labelString
        );

        this.labelsGroup
            .selectAll('foreignObject.esbd-line-label')
            .data(labelData, (d) => d.id)
            .join(
                (enter) =>
                    enter
                        .append('foreignObject')
                        .attr('class', 'esbd-line-label')
                        .attr('width', 1)
                        .attr('height', 1) // Start small, let content expand
                        .style('overflow', 'visible')
                        .style('pointer-events', 'none') // Labels shouldn't block interaction
                        .html(
                            (d) =>
                                `<span class="katex-label-container" style="color: ${d.color}; white-space: nowrap; display: inline-block; padding: 1px 3px; background: rgba(255,255,255,0.7); border-radius: 2px;"></span>`
                        ),
                // Added background for readability
                (update) => update,
                (exit) =>
                    exit
                        .transition()
                        .duration(this.config.transitionDuration)
                        .style('opacity', 0)
                        .remove()
            )
            .each(function (d) {
                const fo = d3.select(this);
                const span = fo.select('.katex-label-container').node();
                // Render KaTeX (ensure KaTeX JS is loaded)
                if (span && typeof katex !== 'undefined') {
                    try {
                        katex.render(d.labelString, span, {
                            throwOnError: false,
                            displayMode: false,
                        });
                    } catch (error) {
                        span.textContent = d.speciesId || d.id;
                    }
                } else {
                    if (span) span.textContent = d.speciesId || d.id;
                }
            })
            // Apply transitions AFTER KaTeX might have changed size (slight delay ok)
            .transition()
            .duration(this.config.transitionDuration)
            .attr('x', (d) => this.xScale(d.labelPos.x) + 5)
            // Adjust y to roughly center the label vertically on the line end point
            // This assumes ~1em line height; might need refinement based on actual rendered height
            .attr('y', (d) => this.yScale(d.labelPos.y) - 10);
        // TODO: Smarter label positioning to avoid overlaps.
    }

    _handleInteraction(event, isClick = false) {
        // Handle clicks immediately, reset any pending move updates
        if (isClick) {
            clearTimeout(this._throttleTimeout);
            this._throttleTimeout = null;
            this._throttleWaiting = false; // Reset state in case click happens during wait
            this._updateTooltip(event, true); // Call core logic directly
            return;
        }

        // Throttle move events using the immediate execution + delay flag pattern
        if (this._throttleWaiting) {
            return; // Already waiting for timeout, ignore this move event
        }

        // --- Execute immediately on the first move event after delay ---
        this._updateTooltip(event, false);
        this._throttleWaiting = true; // Set the flag

        // --- Set timeout to clear the flag after the delay ---
        // Use stored timeout to potentially clear if needed (e.g. on pointerout)
        this._throttleTimeout = setTimeout(() => {
            this._throttleWaiting = false; // Allow next execution after delay
            this._throttleTimeout = null;
        }, this.config.throttleDelay);
    }

    // Helper function to apply/reset highlight styles
    _applyHighlight(targetTraceId = null) {
        const highlightWidthIncrease = 2; // How much thicker to make the highlighted line
        const fadedOpacity = 0.4; // Opacity for non-highlighted lines

        this.linesGroup
            .selectAll('path.esbd-data-line')
            .interrupt() // Stop previous transitions
            .transition()
            .duration(targetTraceId ? 50 : this.config.transitionDuration / 2) // Faster fade back
            .style('opacity', (d) =>
                targetTraceId === null || d.id === targetTraceId
                    ? 1.0
                    : fadedOpacity
            )
            .attr('stroke-width', (d) =>
                targetTraceId !== null && d.id === targetTraceId
                    ? d.style.lineWidth + highlightWidthIncrease
                    : d.style.lineWidth
            );
    }

    _hideTooltip() {
        this._tooltip.style('visibility', 'hidden').style('opacity', 0);
        this._applyHighlight(null);
        this._applyVerticalMarkerHighlight(null);
    }

    _updateTooltip(event, isClick) {
        if (
            !this._tooltipCallback ||
            !this.lastDrawData ||
            this.lastDrawData.length === 0
        ) {
            this._hideTooltip();
            return;
        }
        const [pointerX, pointerY] = d3.pointer(event, this.plotArea.node());
        if (pointerX < -5 || pointerX > this.plotWidth + 5) {
            this._hideTooltip();
            return;
        }
        const xValue = this.xScale.invert(pointerX);

        // --- Find Region Info (NEW LOGIC) ---
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

        // --- Find Closest Trace using Helper ---
        const closestResult = this._findClosestTrace(xValue, pointerY);

        const verticalThresholdPx = 25;

        // --- Display Tooltip ---
        if (closestResult && closestResult.minDistPx < verticalThresholdPx) {
            const trace = closestResult.trace; // Get trace info from result
            const point = closestResult.pointData; // Get point data from result

            const tooltipInfo = {
                speciesId: trace.speciesId,
                traceId: trace.id,
                curveType: trace.curveType,
                labelString: trace.labelString,
                xValue: xValue, // Use xValue under cursor
                yValueDisplayed: point.y_display, // Use interpolated/closest y
                yValueVolts: point.y_volt,
                yValueSource: point.source_y,
                yValueSourceUnits: point.source_units,
                currentMode: this.config.mode,
                regionIndex: regionIndex, // Pass region index
                regionInfo: regionInfo, // Pass region properties
                pointEvent: event,
            };
            try {
                const content = this._tooltipCallback(tooltipInfo);
                if (content) {
                    // Get coordinates relative to container for positioning anchor
                    const [containerX, containerY] = d3.pointer(
                        event,
                        this.container.node()
                    );
                    // Set tooltip content and position using the new helper
                    this._setTooltip(containerX, containerY, content);
                    // Apply highlight to the line
                    this._applyHighlight(trace.id);
                } else {
                    this._hideTooltip(); // Hide if callback returns no content
                }
            } catch (e) {
                console.error('Error in tooltip callback:', e);
                this._hideTooltip();
            }
        } else {
            this._hideTooltip(); // Hide if no close trace found
        }
    }

    /**
     * Sets the tooltip content, renders KaTeX, calculates position with boundary checks, and displays it.
     * @param {number} targetX - The anchor x-coordinate (relative to container) for positioning.
     * @param {number} targetY - The anchor y-coordinate (relative to container) for positioning.
     * @param {string} htmlContent - The HTML content string for the tooltip (may contain KaTeX delimiters).
     */
    _setTooltip(targetX, targetY, htmlContent) {
        if (!htmlContent) {
            this._hideTooltip();
            return;
        }

        // Set content FIRST, make briefly visible off-screen to measure
        this._tooltip
            .html(htmlContent)
            .style('left', '-1000px') // Position off-screen while measuring
            .style('top', '-1000px')
            .style('visibility', 'hidden') // Keep hidden
            .style('opacity', 1); // Make opaque

        // Render KaTeX within the tooltip
        if (typeof renderMathInElement === 'function') {
            try {
                renderMathInElement(this._tooltip.node(), {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true },
                    ],
                    throwOnError: false,
                });
            } catch (katexError) {
                console.error(
                    'KaTeX auto-render failed in tooltip:',
                    katexError
                );
            }
        } else {
            console.warn('KaTeX auto-render extension not loaded.');
        }

        // Measure actual tooltip dimensions
        const tooltipNode = this._tooltip.node();
        const tooltipWidth = tooltipNode.offsetWidth;
        const tooltipHeight = tooltipNode.offsetHeight;

        // Calculate final position with boundary checks (relative to container)
        const containerWidth = this.container.node().clientWidth;
        const containerHeight = this.config.height; // Use configured height for boundary

        // Default: position top-right of cursor anchor point
        let finalX = targetX + 15;
        let finalY = targetY - 15 - tooltipHeight; // Position top edge above anchor point

        // Boundary Checks
        if (finalX + tooltipWidth > containerWidth) {
            finalX = targetX - 15 - tooltipWidth;
        } // Flip left
        if (finalX < 0) {
            finalX = 5;
        } // Prevent going off left
        if (finalY < 0) {
            finalY = targetY + 15;
        } // Flip below cursor
        if (finalY + tooltipHeight > containerHeight) {
            finalY = containerHeight - tooltipHeight - 5;
        } // Stick near bottom

        // Apply final position and make visible
        this._tooltip
            .style('left', `${finalX}px`)
            .style('top', `${finalY}px`)
            .style('visibility', 'visible'); // Opacity handled by transition
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

        this.lastDrawData.forEach((trace) => {
            const originalTraceDef = this.traceData.find(
                (td) => td.id === trace.id
            );
            const xRange = originalTraceDef?.xRange;
            const isInExplicitRange =
                !xRange || (xValue >= xRange.min && xValue <= xRange.max);

            // Also check if the trace actually has points spanning this xValue
            // (Handles cases where xRange might be wider than actual data points provided)
            const hasPointsInRange =
                trace.points.length >= 2 &&
                xValue >= trace.points[0].x &&
                xValue <= trace.points[trace.points.length - 1].x;

            if (!isInExplicitRange || !hasPointsInRange) {
                return; // Skip trace if xValue is outside its defined range or data extent
            }

            // Find points bracketing xValue and interpolate y_display
            let y_interp = null;
            let p_interp = null;
            const bisect = d3.bisector((p) => p.x).left;
            const index = bisect(trace.points, xValue, 1);
            const p0 = trace.points[index - 1];
            const p1 = trace.points[index];

            if (p0 && p1) {
                if (p1.x === p0.x) {
                    // Vertical segment
                    if (Math.abs(p0.x - xValue) < 1e-9) {
                        y_interp =
                            Math.abs(this.yScale(p0.y_display) - pointerY) <
                            Math.abs(this.yScale(p1.y_display) - pointerY)
                                ? p0.y_display
                                : p1.y_display;
                        p_interp = y_interp === p0.y_display ? p0 : p1;
                    }
                } else {
                    // Interpolate
                    const t = (xValue - p0.x) / (p1.x - p0.x);
                    if (
                        p0.y_display !== null &&
                        isFinite(p0.y_display) &&
                        p1.y_display !== null &&
                        isFinite(p1.y_display)
                    ) {
                        y_interp =
                            p0.y_display + t * (p1.y_display - p0.y_display);
                        // Create an interpolated point data object
                        p_interp = {
                            x: xValue,
                            y_display: y_interp,
                            // Interpolate y_volt as well? Or take from nearest point? Let's take from nearest for simplicity.
                            y_volt: t < 0.5 ? p0.y_volt : p1.y_volt,
                            source_y: t < 0.5 ? p0.source_y : p1.source_y,
                            source_units:
                                t < 0.5 ? p0.source_units : p1.source_units,
                        };
                    }
                }
            } else if (p0 || p1) {
                // Edge case: xValue might match first or last point
                const p_edge = p0 || p1;
                if (Math.abs(p_edge.x - xValue) < 1e-9) {
                    y_interp = p_edge.y_display;
                    p_interp = p_edge;
                }
            }

            // Calculate vertical distance in pixels if interpolation was successful
            if (y_interp !== null && isFinite(y_interp)) {
                const distY = Math.abs(this.yScale(y_interp) - pointerY);
                if (distY < minDistPx) {
                    minDistPx = distY;
                    closestTraceInfo = {
                        trace: trace, // The full trace object from lastDrawData
                        pointData: p_interp, // The specific (potentially interpolated) point data
                        minDistPx: distY, // Store the distance found
                    };
                }
            }
        }); // End loop through traces

        return closestTraceInfo; // Return object { trace, pointData, minDistPx } or null
    }

    /** Draws or updates the vertical marker symbols. */
    _drawVerticalMarkers() {
        const markerData = Array.from(this.verticalMarkers.entries())
            .map(([id, data]) => ({ id, ...data }))
            .filter(
                (d) =>
                    d.currentData &&
                    d.currentData.x !== undefined &&
                    d.currentData.y1_volt !== null &&
                    d.currentData.y2_volt !== null
            );

        const markerStyle = STYLE_DEFAULTS.verticalMarker;
        const legThreshold = markerStyle.legThresholdPx;
        const symbolSize = markerStyle.fontSize;
        const bgRadius = markerStyle.backgroundRadius;

        // Data binding within the verticalMarkersGroup
        this.verticalMarkersGroup
            .selectAll('g.esbd-vertical-marker') // Renamed class and group target
            .data(markerData, (d) => d.id)
            .join(
                (enter) => {
                    const g = enter
                        .append('g')
                        .attr('class', 'esbd-vertical-marker') // Renamed class
                        .attr('data-marker-id', (d) => d.id)
                        .style('cursor', 'help'); // Indicate interactivity

                    // Add background circle for easier hover/click detection
                    g.append('circle')
                        .attr('class', 'marker-bg')
                        .attr('r', bgRadius)
                        .attr('fill', markerStyle.backgroundColor)
                        .attr('stroke', markerStyle.backgroundStroke)
                        .attr('stroke-width', 1);
                    // Add the symbol text
                    g.append('text')
                        .attr('class', 'marker-symbol')
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'central')
                        .attr('font-size', symbolSize)
                        .attr('fill', markerStyle.color)
                        .text((d) => d.definition.symbol);

                    // Add lines for legs (initially zero length, positioned later)
                    g.append('line')
                        .attr('class', 'marker-leg-1')
                        .attr('stroke', markerStyle.legColor)
                        .attr('stroke-width', markerStyle.legWidth);
                    g.append('line')
                        .attr('class', 'marker-leg-2')
                        .attr('stroke', markerStyle.legColor)
                        .attr('stroke-width', markerStyle.legWidth);

                    // Attach listeners to the group
                    g.on('pointerover', (event, d) => {
                        event.stopPropagation();
                        this._handleVerticalMarkerInteraction(event, d.id);
                        this._applyVerticalMarkerHighlight(d.id, true);
                    })
                        .on('pointerout', (event, d) => {
                            event.stopPropagation();
                            this._hideTooltip(); /* Resets highlights */
                        })
                        .on('click', (event, d) => {
                            event.stopPropagation();
                            this._handleVerticalMarkerInteraction(
                                event,
                                d.id,
                                true
                            );
                        });
                    return g;
                },
                (update) => update, // Nothing static needs updating usually
                (exit) =>
                    exit
                        .transition()
                        .duration(this.config.transitionDuration)
                        .attr('opacity', 0)
                        .remove() // Fade out removed markers
            )
            // Update position and legs with transitions
            .each((d, i, nodes) => {
                // Calculate pixel positions for this marker
                const markerG = d3.select(nodes[i]);
                const data = d.currentData;
                if (!data || data.y1_volt === null || data.y2_volt === null) {
                    markerG.style('display', 'none'); // Hide if data is invalid
                    return;
                } else {
                    markerG.style('display', null);
                }

                // Get display values for positioning
                const z1 = this.speciesInfo.get(d.definition.speciesId1)?.z;
                const z2 = this.speciesInfo.get(d.definition.speciesId2)?.z;
                const y1_display = this._scaleVoltToDisplay(data.y1_volt, z1);
                const y2_display = this._scaleVoltToDisplay(data.y2_volt, z2);

                // Skip if potentials aren't valid for display
                if (
                    y1_display === null ||
                    !isFinite(y1_display) ||
                    y2_display === null ||
                    !isFinite(y2_display)
                ) {
                    markerG.style('display', 'none');
                    return;
                } else {
                    markerG.style('display', null);
                }

                const x_px = this.xScale(data.x);
                const y1_px = this.yScale(y1_display);
                const y2_px = this.yScale(y2_display);
                const y_mid_px = (y1_px + y2_px) / 2;
                const gap_px = Math.abs(y1_px - y2_px);

                // Transition group to new position
                markerG
                    .transition()
                    .duration(this.config.transitionDuration)
                    .attr('transform', `translate(${x_px}, ${y_mid_px})`);

                // Update legs based on gap
                const showLegs = gap_px > legThreshold;
                // Calculate leg endpoints relative to the group's center (y_mid_px)
                const legTargetY1 = y1_px - y_mid_px;
                const legTargetY2 = y2_px - y_mid_px;
                // Start legs just outside the background circle radius
                const legStartY1 = Math.sign(legTargetY1) * bgRadius;
                const legStartY2 = Math.sign(legTargetY2) * bgRadius;

                markerG
                    .select('line.marker-leg-1')
                    .transition()
                    .duration(this.config.transitionDuration)
                    .attr('display', showLegs ? null : 'none')
                    .attr('x1', 0)
                    .attr('y1', legStartY1)
                    .attr('x2', 0)
                    .attr('y2', legTargetY1);

                markerG
                    .select('line.marker-leg-2')
                    .transition()
                    .duration(this.config.transitionDuration)
                    .attr('display', showLegs ? null : 'none')
                    .attr('x1', 0)
                    .attr('y1', legStartY2)
                    .attr('x2', 0)
                    .attr('y2', legTargetY2);
            });
    }

    _handleVerticalMarkerInteraction(event, markerId, isClick = false) {
        event.stopPropagation(); // Prevent interactionRect listener

        const markerData = this.verticalMarkers?.get(markerId);
        if (
            !markerData ||
            !markerData.currentData ||
            typeof markerData.definition.tooltipCallback !== 'function'
        ) {
            console.warn(
                `No marker data or callback found for markerId: ${markerId}`
            );
            this._hideTooltip();
            return;
        }

        // Retrieve stored potential values (internal V_volt representation)
        const currentData = markerData.currentData;
        const y1_volt = currentData.y1_volt;
        const y2_volt = currentData.y2_volt;

        // Calculate the values scaled for the current display mode
        const z1 = this.speciesInfo.get(markerData.definition.speciesId1)?.z;
        const z2 = this.speciesInfo.get(markerData.definition.speciesId2)?.z;
        const y1_display = this._scaleVoltToDisplay(y1_volt, z1);
        const y2_display = this._scaleVoltToDisplay(y2_volt, z2);

        // Prepare the comprehensive info object for the callback
        const markerTooltipInfo = {
            markerId: markerId,
            xValue: currentData.x,
            y1_volt: y1_volt,
            y2_volt: y2_volt,
            y1_display: y1_display,
            y2_display: y2_display,
            currentMode: this.config.mode,
            customArgs: currentData.tooltipArgs, // Pass the custom data
            pointEvent: event,
        };

        try {
            // Call the specific callback registered for this marker
            const content =
                markerData.definition.tooltipCallback(markerTooltipInfo);
            if (content) {
                // Get coordinates relative to container for positioning anchor
                const [containerX, containerY] = d3.pointer(
                    event,
                    this.container.node()
                );
                this._setTooltip(containerX, containerY, content);
            } else {
                this._hideTooltip();
            }
        } catch (e) {
            console.error(
                `Error in tooltip callback for marker ${markerId}:`,
                e
            );
            this._hideTooltip();
        }
    }

    /** Helper function to apply/reset highlight styles for vertical markers */
    _applyVerticalMarkerHighlight(targetMarkerId = null) {
        const markerStyle = STYLE_DEFAULTS.verticalMarker; // Renamed style key
        this.verticalMarkersGroup
            .selectAll('g.esbd-vertical-marker circle.marker-bg') // Renamed group/class
            .transition()
            .duration(50)
            .attr('fill', (d) =>
                d.id === targetMarkerId
                    ? markerStyle.highlightColor
                    : markerStyle.backgroundColor
            )
            .attr('stroke', (d) =>
                d.id === targetMarkerId
                    ? markerStyle.highlightStroke ||
                      markerStyle.backgroundStroke
                    : markerStyle.backgroundStroke
            );
    }
} // End of class

export default ElectrochemicalSpeciesBandDiagram;
