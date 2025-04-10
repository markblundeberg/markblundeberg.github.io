// ElectrochemicalSpeciesBandDiagram.js
// ESBD Module using D3.js (v7+)
// Assumes D3 and KaTeX are loaded globally or imported appropriately.

// --- Constants ---
const R = 8.31446261815324; // J / (mol K)
const F = 96485.33212331001; // C / mol (Faraday constant)
const e_charge = 1.602176634e-19; // C (Elementary charge)
const Na = 6.02214076e23; // 1 / mol (Avogadro constant)
const TEMP_K = 298.15; // Standard Temperature (Kelvin) - Make configurable?
const J_PER_MOL_TO_EV = 1 / (Na * e_charge); // eV / (J/mol)
const V_TO_EV_PER_CHARGE = 1; // eV / V (for energy E = qV where q=e)
const F_kJmol = F / 1000.0; // F in kJ / (V mol)

// Default styling constants
const STYLE_DEFAULTS = {
    potential: { lineWidth: 3, dasharray: null },
    standardState: { lineWidth: 1, dasharray: null },
    bandEdge_C: { lineWidth: 2, dasharray: '4,2' },
    bandEdge_V: { lineWidth: 2, dasharray: '4,2' },
    phi: { lineWidth: 1, dasharray: '5,5', color: 'grey' },
    other: { lineWidth: 1, dasharray: null },
    connector: { lineWidth: 1, dasharray: '2,2' },
    interface: { lineWidth: 1, dasharray: '3,3', color: 'rgba(128,128,128,0.7)' },
    differenceMarker: { lineWidth: 1, color: 'black' }
};

/**
 * Creates an interactive Electrochemical Species Band Diagram using D3.js.
 * The caller provides fundamental physical data (e.g., electrochemical potentials in J/mol,
 * band edges in eV, electrostatic potential in V) with explicit units. The module
 * handles scaling to the selected display mode (Volts, eV, kJmol) and rendering.
 */
class ElectrochemicalSpeciesBandDiagram {
    /**
     * Creates an instance of the ESBD diagram.
     * @param {string} containerId - ID of the HTML element to contain the plot.
     * @param {object} [initialConfig={}] - Initial configuration options.
     * @param {number} [initialConfig.width=800] - Initial width hint (will adapt).
     * @param {number} [initialConfig.height=500] - Initial height hint (will adapt).
     * @param {string} [initialConfig.mode='Volts'] - Initial display mode ('Volts', 'eV', 'kJmol').
     * @param {object} [initialConfig.margin={top: 30, right: 60, bottom: 50, left: 70}] - Plot margins (increased for labels).
     * @param {number} [initialConfig.transitionDuration=250] - Duration for D3 transitions (ms).
     */
    constructor(containerId, initialConfig = {}) {
        this.containerId = containerId;
        this.container = d3.select(`#${this.containerId}`);
        if (this.container.empty()) {
            console.error(`ESBD Error: Container element with ID "${containerId}" not found.`);
            throw new Error(`Container element #${containerId} not found.`);
        }

        // Configuration
        this.config = {
            width: initialConfig.width || 800,
            height: initialConfig.height || 500,
            mode: ['Volts', 'eV', 'kJmol'].includes(initialConfig.mode) ? initialConfig.mode : 'Volts',
            margin: initialConfig.margin || { top: 30, right: 60, bottom: 50, left: 70 },
            transitionDuration: initialConfig.transitionDuration === undefined ? 250 : initialConfig.transitionDuration,
            tempK: TEMP_K // Allow overriding later?
        };

        // Internal state
        this.speciesInfo = new Map(); // { z, color, latexPrettyName } keyed by speciesId
        this.traceData = []; // Array of trace definition objects provided by caller
        this.regions = []; // Array of { start, end, name, color }
        this.interfaces = []; // Array of x-coordinates
        this.differenceMarkers = []; // Array of marker definitions
        this.lastDrawData = []; // Store processed data used in last draw { id, speciesId, curveType, color, style, points:[{x, y_display, y_volt, ...}], labelPos, labelString }

        // Callbacks
        this._modeChangeCallback = null;
        this._tooltipCallback = null;

        this.config.throttleDelay = initialConfig.throttleDelay === undefined ? 100 : initialConfig.throttleDelay; // Throttle delay in ms
        this._throttleTimeout = null; // Timeout ID for throttling
        this._throttleWaiting = false; // Flag to indicate if waiting for timeout

        // Clear container
        this.container.html(''); // Clear previous content

        // Tooltip Element
        this._tooltip = this.container.append("div")
            .attr("class", "esbd-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("opacity", 0) // Start hidden and fade in
            .style("background", "rgba(245, 245, 245, 0.95)")
            .style("border", "1px solid #aaa")
            .style("border-radius", "4px")
            .style("padding", "8px")
            .style("font-size", "12px")
            .style("pointer-events", "none") // Prevent tooltip interfering
            .style("z-index", "10")
            .style("transition", "opacity 0.2s"); // Fade effect

        // --- D3 Setup ---
        this._setupD3Structure();

        // --- Responsiveness ---
        // Initial calculation of dimensions
        const initialWidth = this.container.node().clientWidth || this.config.width;
        const initialHeight = this.container.node().clientHeight || this.config.height;
        this._handleResize(initialWidth, initialHeight, false); // Initial size calculation without redraw

        // Attach observer
        this._resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                // Debounce or throttle resize events if needed, but often fine directly
                const { width, height } = entries[0].contentRect;
                this._handleResize(width, height);
            }
        });
        this._resizeObserver.observe(this.container.node());


        console.log(`ESBD Initialized in #${containerId}. Mode: ${this.config.mode}`);
    }

    _setupD3Structure() {
        this.container.style("position", "relative"); // For tooltip positioning

        this.svg = this.container.append("svg")
            .attr("class", "esbd-svg")
            .attr("width", this.config.width)
            .attr("height", this.config.height)
            .style("-webkit-tap-highlight-color", "transparent"); // Improve mobile tap experience

        this.plotArea = this.svg.append("g")
            .attr("class", "esbd-plot-area")
            .attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);

        // Groups for different layers (drawing order: bottom first)
        this.backgroundGroup = this.plotArea.append("g").attr("class", "esbd-backgrounds");
        this.interfaceGroup = this.plotArea.append("g").attr("class", "esbd-interfaces");
        this.gridGroup = this.plotArea.append("g").attr("class", "esbd-grid").style("pointer-events", "none");
        this.connectorsGroup = this.plotArea.append("g").attr("class", "esbd-connectors").style("pointer-events", "none");
        this.linesGroup = this.plotArea.append("g").attr("class", "esbd-lines"); // Lines will get pointer events for tooltips
        this.markersGroup = this.plotArea.append("g").attr("class", "esbd-markers").style("pointer-events", "none");
        this.labelsGroup = this.plotArea.append("g").attr("class", "esbd-labels").style("pointer-events", "none");
        this.customGroup = this.plotArea.append("g").attr("class", "esbd-custom-drawing");

        // Scales (ranges set in _handleResize)
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();

        // Axis Generators
        this.xAxisGen = d3.axisBottom(this.xScale);
        this.yAxisGen = d3.axisLeft(this.yScale);

        // Axis Groups (positioned in redraw)
        this.xAxisGroup = this.plotArea.append("g")
            .attr("class", "esbd-x-axis");
        this.yAxisGroup = this.plotArea.append("g")
            .attr("class", "esbd-y-axis");

        // Y-Axis Label (Interactive) - Append to main SVG for easier absolute positioning
        this.yAxisLabel = this.svg.append("text")
            .attr("class", "esbd-y-axis-label esbd-interactive")
            .style("text-anchor", "middle")
            .style("cursor", "pointer")
            .style("-webkit-user-select", "none").style("user-select", "none") // Prevent text selection on click
            .on("click", () => this._handleYAxisLabelClick());
            // Position updated in _handleResize

        // Line generator template
        this.lineGenerator = d3.line()
            .x(d => this.xScale(d.x))
            // y value set during trace processing based on y_display
            .defined(d => d.y_display !== null && !isNaN(d.y_display) && isFinite(d.y_display));

        // Interaction rect (overlay for detecting hover/click anywhere on plot area)
        this.interactionRect = this.plotArea.append('rect')
             .attr('class', 'esbd-interaction-overlay')
             .style('fill', 'none')
             .style('pointer-events', 'all');
        // Add touch/mouse listeners
        const interactionHandler = (event) => {
             event.preventDefault(); // Prevent scrolling on touch drag maybe
             this._handleInteraction(event);
        };
        const clickHandler = (event) => {
             event.preventDefault();
             this._handleInteraction(event, true); // Pass click flag
        };
        this.interactionRect
             // ... (attributes and styles) ...
   //          .on('pointerover', () => this._tooltip.style('visibility', 'visible').style('opacity', 1)) // Keep immediate feedback on enter
             .on('pointerout', () => {
                 // Hide immediately on mouse out, cancel any pending throttled update
                 clearTimeout(this._throttleTimeout);
                 this._throttleTimeout = null;
                 this._throttleWaiting = false; // Reset throttle state
                 this._hideTooltip();
             })
             // Apply throttling ONLY to pointermove
             .on('pointermove', (event) => this._handleInteraction(event, false)) // Pass isClick = false
             .on('click', (event) => this._handleInteraction(event, true)); // Pass isClick = true
    }


    // --- Public API Methods ---

    /** Stores properties for a given species ID. */
    addSpeciesInfo(speciesId, properties) {
        if (!speciesId || !properties) return;
        this.speciesInfo.set(speciesId, {
            z: properties.z,
            color: properties.color || 'black',
            latexPrettyName: properties.latexPrettyName || speciesId
        });
    }

    /** Updates the complete set of trace data to be plotted. */
    updateTraceData(traceDefs = []) {
        this.traceData = traceDefs;
        this.redraw();
    }

    /** Sets background region definitions. */
    setRegions(regionDefs = []) {
        this.regions = regionDefs;
        // Only need to redraw backgrounds if axes/scales haven't changed
        if (this.plotArea) this._drawBackgrounds();
    }

    /** Sets interface line positions. */
    setInterfaces(interfaceCoords = []) {
        this.interfaces = interfaceCoords;
        if (this.plotArea) this._drawInterfaceLines();
    }

     /** Sets definitions for vertical difference markers. */
    setDifferenceMarkers(markerDefs = []) {
        this.differenceMarkers = markerDefs;
        if (this.plotArea) this.redraw(); // Needs full redraw
    }

    /** Sets the display mode and triggers redraw and callback. */
    setMode(newMode) {
        const validModes = ['Volts', 'eV', 'kJmol'];
        if (!validModes.includes(newMode) || newMode === this.config.mode) return;

        this.config.mode = newMode;
        console.log("ESBD Mode switched to:", this.config.mode);
        this._hideTooltip();
        this.redraw(); // Redraw applies new scaling

        if (this._modeChangeCallback) {
            try {
                this._modeChangeCallback(this.config.mode, { xScale: this.xScale, yScale: this.yScale });
            } catch (e) {
                console.error("Error in onModeChange callback:", e);
            }
        }
    }

    /** Registers a callback function triggered after the mode changes and redraw starts. */
    onModeChange(callbackFn) {
        this._modeChangeCallback = (typeof callbackFn === 'function') ? callbackFn : null;
    }

     /** Registers a callback function to generate tooltip content dynamically. */
    setTooltipCallback(callbackFn) {
        this._tooltipCallback = (typeof callbackFn === 'function') ? callbackFn : null;
    }

    /** Main drawing/update function. */
    redraw() {
        if (!this.svg || !this.plotArea) return; // Not initialized

        // --- 1. Prepare Data & Calculate Display Values ---
        this.lastDrawData = this._preparePlotDataAndScale();

        // --- 2. Update Scales ---
        const xDomain = d3.extent(this.lastDrawData.flatMap(t => t.points.map(p => p.x)));
        if (xDomain[0] === undefined) xDomain = [0, 1];
        this.xScale.domain(xDomain).nice();

        const allYValues = this.lastDrawData.flatMap(t => t.points.map(p => p.y_display));
        let yDomain = d3.extent(allYValues.filter(y => y !== null && isFinite(y)));

        if (yDomain[0] === undefined || yDomain[1] === undefined || yDomain[0] === yDomain[1]) {
            const fallbackCenter = yDomain[0] !== undefined ? yDomain[0] : 0;
            yDomain = [fallbackCenter - 1, fallbackCenter + 1];
        } else {
             const padding = (yDomain[1] - yDomain[0]) * 0.10;
             yDomain[0] -= padding;
             yDomain[1] += padding;
        }
        this.yScale.domain(yDomain).nice();

        // --- 3. Update Axes ---
        this.xAxisGroup
            .attr("transform", `translate(0,${this.plotHeight})`)
            .transition().duration(this.config.transitionDuration)
            .call(this.xAxisGen);
        this.yAxisGroup
            .transition().duration(this.config.transitionDuration)
            .call(this.yAxisGen);
        this.yAxisLabel.text(this._getYAxisLabel());

        // --- 4. Update interaction overlay size ---
        this.interactionRect.attr('width', this.plotWidth).attr('height', this.plotHeight);

        // --- 5. Draw Backgrounds & Interfaces (No transitions needed) ---
        this._drawBackgrounds();
        this._drawInterfaceLines();

        // --- 6. Draw Traces, Connectors, Labels, Markers (With Transitions) ---
        this._drawTraces();
        this._drawConnectors();
        this._drawLabels();
        this._drawDifferenceMarkers(); // TODO: Implement fully
    }

    /** Cleans up resources like observers and listeners. */
    destroy() {
         if (this._resizeObserver) {
            this._resizeObserver.disconnect();
         }
         // Remove D3 listeners if any were added directly to window/document
         this.container.html(''); // Clear SVG and tooltip div
         console.log("ESBD Destroyed.");
    }


    // --- Public Accessors ---
    get svgNode() { return this.svg?.node(); }
    get mainGroupNode() { return this.plotArea?.node(); }
    get currentXScale() { return this.xScale; }
    get currentYScale() { return this.yScale; }
    get plotWidth() { return Math.max(10, this.config.width - this.config.margin.left - this.config.margin.right); }
    get plotHeight() { return Math.max(10, this.config.height - this.config.margin.top - this.config.margin.bottom); }

    // --- "Private" Helper Methods ---

    _handleResize(width, height, shouldRedraw = true) {
        this.config.width = width;
        this.config.height = height;
        const pw = this.plotWidth;
        const ph = this.plotHeight;

        this.svg.attr("width", this.config.width).attr("height", this.config.height);
        this.plotArea.attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);

        this.xScale.range([0, pw]);
        this.yScale.range([ph, 0]);

        this.xAxisGroup.attr("transform", `translate(0,${ph})`);
        // Position label centered vertically, slightly left of axis
        this.yAxisLabel.attr("transform", `translate(${this.config.margin.left / 2.5}, ${this.config.margin.top + ph / 2}) rotate(-90)`);

        if (shouldRedraw && this.traceData.length > 0) { // Avoid redraw if no data yet
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
        const arrows = " \u21F5 "; // Up down arrows symbol
        switch(this.config.mode) {
            case 'eV': return `Energy (eV)${arrows}`; // E = -eV convention
            case 'kJmol': return `Molar Energy / z (kJ/mol)${arrows}`; // G = FV = μ̄/z
            case 'Volts':
            default: return `Potential (V)${arrows}`; // V = μ̄/(zF)
        }
    }

    /** Converts input data value to the internal V_volt representation. */
    _convertToVolts(value, inputUnit, z) {
        if (value === null || !isFinite(value)) return null;

        switch (inputUnit) {
            case 'mu_bar_kJmol': // input is μ̄ in kJ/mol
                if (z === null || z === 0) return null; // Cannot convert without charge
                return (value * 1000) / (z * F); // V = μ̄/(zF)

            case 'mu_bar_eV': // input is μ̄ in eV/particle
                 if (z === null || z === 0) return null;
                 // V = μ̄_J_particle / (z * e_charge) = (value * e_charge) / (z * e_charge) = value / z
                 return value / z;

            case 'E_band_eV': // input is E_band in eV/particle
                 // Using convention V = -E_band / e_charge
                 return -value / V_TO_EV_PER_CHARGE;

            case 'phi_V': // input is φ in Volts
                 return value; // V_phi = phi

            case 'V_volt': // input is already V_volt
                 return value;

            default:
                console.warn(`ESBD Warn: Unknown input unit "${inputUnit}" for conversion to Volts.`);
                return null;
        }
    }

    /** Scales the internal V_volt value to the final display unit based on mode. */
    _scaleVoltToDisplay(value_volt, z) {
        if (value_volt === null || !isFinite(value_volt)) return null;

        switch(this.config.mode) {
            case 'Volts':
                return value_volt; // Factor = +1

            case 'eV':
                // E = -e * V
                return value_volt * (-V_TO_EV_PER_CHARGE); // Factor = -1

            case 'kJmol':
                // G = F * V = μ̄/z (if V came from μ̄/(zF))
                // We want kJ/mol, so factor is F/1000
                 return value_volt * F_kJmol; // Factor = +F/1000
        }
        return null;
    }

    /** Processes traceDefs, converts inputs to internal V_volt, then scales to y_display */
    _preparePlotDataAndScale() {
        const processedTraces = [];
        for (const traceDef of this.traceData) {
            const species = this.speciesInfo.get(traceDef.speciesId) || {};
            const z = species.z;
            const color = traceDef.color || species.color || 'black';
            const defaultLabelName = species.latexPrettyName || traceDef.speciesId || traceDef.id;
            const curveType = traceDef.curveType || 'other';
            const points = [];
            let lastValidPointData = null;
            const xData = traceDef.x || [];
            const yData = traceDef.y || [];

            for (let i = 0; i < xData.length; i++) {
                const x = xData[i];
                const y_input = yData[i];
                const isInRange = !traceDef.xRange || (x >= traceDef.xRange.min && x <= traceDef.xRange.max);
                if (!isInRange) {
                    lastValidPointData = null;
                    continue;
                }
                const y_internal_volt = this._convertToVolts(y_input, traceDef.inputUnits, z);
                const y_display = this._scaleVoltToDisplay(y_internal_volt, z);
                const currentPoint = {
                    x: x,
                    y_display: y_display,
                    y_volt: y_internal_volt,
                    source_y: y_input,
                    source_units: traceDef.inputUnits
                };
                points.push(currentPoint);
                if (y_display !== null && isFinite(y_display)) {
                     lastValidPointData = { x: x, y: y_display };
                }
            }

            if (points.length > 0) {
                let labelPos = (traceDef.showLabel && lastValidPointData) ? lastValidPointData : null;
                const labelString = traceDef.labelOverride ?
                      (traceDef.labelOverride[this.config.mode] || traceDef.id)
                    : this._getAutoLabel(defaultLabelName, curveType);

                processedTraces.push({
                    id: traceDef.id, speciesId: traceDef.speciesId, curveType: curveType,
                    color: color, style: { ...STYLE_DEFAULTS[curveType], ...(traceDef.styleOverride || {}) },
                    points: points, labelPos: labelPos, labelString: labelString, showLabel: traceDef.showLabel
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
        let superscript = "";

        // Determine base symbol based ONLY on mode
        symbol = { Volts: 'V', eV: 'E', kJmol: 'G' }[this.config.mode] || '?';

        // Add superscripts or modify symbol/subscript based on curveType
        switch (curveType) {
            case 'standardState':
                superscript = "\\ominus";
                break;
            case 'bandEdge_C':
            case 'bandEdge_V':
            case 'bandEdge':
                superscript = "\\text{band}";
                break;
            case 'phi':
                // special case! for volt mode we show \phi, not V_\phi
                symbol = { Volts: '\\phi', eV: 'E', kJmol: 'G' }[this.config.mode] || '?';
                subscript = (this.config.mode === 'Volts') ? '' : '\\phi';
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
        this.backgroundGroup.selectAll("rect.esbd-region-bg")
            .data(this.regions, d => d.name || `${d.start}-${d.end}`) // Use key if available
            .join("rect")
            .attr("class", "esbd-region-bg")
            .attr("x", d => this.xScale(d.start))
            .attr("y", 0)
            .attr("width", d => Math.max(0, this.xScale(d.end) - this.xScale(d.start)))
            .attr("height", this.plotHeight)
            .attr("fill", d => d.color || 'transparent')
            .lower(); // Draw behind other elements
    }

     _drawInterfaceLines() {
         this.interfaceGroup.selectAll("line.esbd-interface-line")
             .data(this.interfaces)
             .join("line")
             .attr("class", "esbd-interface-line")
             .attr("x1", d => this.xScale(d))
             .attr("x2", d => this.xScale(d))
             .attr("y1", 0)
             .attr("y2", this.plotHeight)
             .attr("stroke", STYLE_DEFAULTS.interface.color)
             .attr("stroke-width", STYLE_DEFAULTS.interface.lineWidth)
             .attr("stroke-dasharray", STYLE_DEFAULTS.interface.dasharray);
     }

    _drawTraces() {
        this.linesGroup.selectAll("path.esbd-data-line")
            .data(this.lastDrawData, d => d.id)
            .join(
                enter => enter.append("path")
                             .attr("class", "esbd-data-line")
                             .attr("data-trace-id", d => d.id)
                             .attr("fill", "none")
                             // Initial position can be set if desired before transition
                             .attr("stroke", d => d.color)
                             .attr("stroke-width", d => d.style.lineWidth)
                             .attr("stroke-dasharray", d => d.style.dasharray),
                update => update,
                exit => exit.transition().duration(this.config.transitionDuration)
                           .style("opacity", 0).remove() // Fade out removed lines
            )
            .attr("stroke", d => d.color) // Update color immediately if changed
            .attr("stroke-width", d => d.style.lineWidth)
            .attr("stroke-dasharray", d => d.style.dasharray)
            .transition().duration(this.config.transitionDuration)
            .attr("d", d => this.lineGenerator.y(p => this.yScale(p.y_display))(d.points));
    }

    _drawConnectors() {
         // Extract points for standard state and potential for connection
         const connectorPairs = [];
         const potentialPointsByX = new Map(); // Map<x, {y, color}>
         const standardPointsByX = new Map(); // Map<x, {y, color}>

         // Optimize lookup: create maps of points keyed by speciesId and x
         const pointsMap = new Map(); // Map<speciesId, Map<x, point>>
         this.lastDrawData.forEach(trace => {
             if (!pointsMap.has(trace.speciesId)) pointsMap.set(trace.speciesId, new Map());
             const tracePoints = pointsMap.get(trace.speciesId);
             trace.points.forEach(p => tracePoints.set(p.x, p)); // Assumes unique x per trace
         });

         this.lastDrawData.forEach(trace => {
             if (trace.curveType === 'potential' && trace.speciesId) {
                 const stdTraceDef = this.traceData.find(td => td.speciesId === trace.speciesId && td.curveType === 'standardState');
                 if (stdTraceDef) {
                     const stdPointsMap = pointsMap.get(trace.speciesId); // Re-use lookup? No, need standard trace points
                     // Find the corresponding standard trace in lastDrawData
                     const stdTrace = this.lastDrawData.find(ldd => ldd.id === stdTraceDef.id);
                     if (stdTrace) {
                           const stdPointsLookup = new Map(stdTrace.points.map(p => [p.x, p]));
                           trace.points.forEach((p_pot, i) => {
                                const p_std = stdPointsLookup.get(p_pot.x);
                                if (p_pot.y_display !== null && isFinite(p_pot.y_display) &&
                                    p_std && p_std.y_display !== null && isFinite(p_std.y_display))
                                {
                                     connectorPairs.push({
                                          id: `${trace.speciesId}_conn_${p_pot.x}`, // Unique ID based on species & x
                                          x: p_pot.x,
                                          y1: p_pot.y_display,
                                          y2: p_std.y_display,
                                          color: trace.color
                                     });
                                }
                           });
                     }
                 }
             }
         });


         this.connectorsGroup.selectAll("line.esbd-connector-line")
            .data(connectorPairs, d => d.id)
            .join(
                enter => enter.append("line").attr("class", "esbd-connector-line")
                             .attr("stroke", d => d.color)
                             .attr("stroke-width", STYLE_DEFAULTS.connector.lineWidth)
                             .attr("stroke-dasharray", STYLE_DEFAULTS.connector.dasharray),
                update => update,
                exit => exit.transition().duration(this.config.transitionDuration)
                           .style("opacity", 0).remove()
            )
            .attr("stroke", d => d.color) // Update color immediately
            .transition().duration(this.config.transitionDuration)
            .attr("x1", d => this.xScale(d.x))
            .attr("y1", d => this.yScale(d.y1))
            .attr("x2", d => this.xScale(d.x))
            .attr("y2", d => this.yScale(d.y2));
     }


    _drawLabels() {
        const labelData = this.lastDrawData.filter(d => d.labelPos && d.showLabel && d.labelString);

        this.labelsGroup.selectAll("foreignObject.esbd-line-label")
            .data(labelData, d => d.id)
            .join(
                enter => enter.append("foreignObject")
                             .attr("class", "esbd-line-label")
                             .attr("width", 1).attr("height", 1) // Start small, let content expand
                             .style("overflow", "visible")
                             .style("pointer-events", "none") // Labels shouldn't block interaction
                             .html(d => `<span class="katex-label-container" style="color: ${d.color}; white-space: nowrap; display: inline-block; padding: 1px 3px; background: rgba(255,255,255,0.7); border-radius: 2px;"></span>`),
                             // Added background for readability
                update => update,
                exit => exit.transition().duration(this.config.transitionDuration)
                           .style("opacity", 0).remove()
            )
            .each(function(d) {
                 const fo = d3.select(this);
                 const span = fo.select('.katex-label-container').node();
                 // Render KaTeX (ensure KaTeX JS is loaded)
                 if (span && typeof katex !== 'undefined') {
                     try {
                         katex.render(d.labelString, span, { throwOnError: false, displayMode: false });
                     } catch (error) { span.textContent = d.speciesId || d.id; }
                 } else { if(span) span.textContent = d.speciesId || d.id; }
            })
            // Apply transitions AFTER KaTeX might have changed size (slight delay ok)
            .transition().duration(this.config.transitionDuration)
            .attr("x", d => this.xScale(d.labelPos.x) + 5)
             // Adjust y to roughly center the label vertically on the line end point
             // This assumes ~1em line height; might need refinement based on actual rendered height
            .attr("y", d => this.yScale(d.labelPos.y) - 10);
             // TODO: Smarter label positioning to avoid overlaps.
    }

     _drawDifferenceMarkers() {
         // TODO: Implement fully as discussed before.
         // Get pairs from this.differenceMarkers, find corresponding points in this.lastDrawData,
         // calculate difference using y_display, draw lines/brackets and text/KaTeX labels.
         this.markersGroup.selectAll(".esbd-diff-marker").remove(); // Clear old
         if (this.differenceMarkers.length > 0) {
              console.warn("Difference marker drawing not yet implemented.");
         }
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
        const fadedOpacity = 0.4;        // Opacity for non-highlighted lines

        this.linesGroup.selectAll("path.esbd-data-line")
            .interrupt() // Stop previous transitions
            .transition().duration(targetTraceId ? 50 : this.config.transitionDuration / 2) // Faster fade back
            .style("opacity", d => (targetTraceId === null || d.id === targetTraceId) ? 1.0 : fadedOpacity)
            .attr("stroke-width", d => (targetTraceId !== null && d.id === targetTraceId) ? d.style.lineWidth + highlightWidthIncrease : d.style.lineWidth);
    }

    _hideTooltip() {
        this._tooltip.style("visibility", "hidden").style("opacity", 0);
        this._applyHighlight(null);
    }

    _updateTooltip(event, isClick) {
        // Guard clauses
        if (!this._tooltipCallback || !this.lastDrawData || this.lastDrawData.length === 0) {
            this._hideTooltip();
            return;
        }

        const [pointerX, pointerY] = d3.pointer(event, this.plotArea.node());

        // Check if pointer is within plot bounds horizontally
        if (pointerX < -5 || pointerX > this.plotWidth + 5) {
            this._hideTooltip();
            return;
        }

        const xValue = this.xScale.invert(pointerX);

        let closestTraceInfo = null;
        let minDistY = Infinity;
        const verticalThresholdPx = 25;

        // Iterate through the processed data used for the last draw
        this.lastDrawData.forEach(trace => {
            const originalTraceDef = this.traceData.find(td => td.id === trace.id);
            const xRange = originalTraceDef?.xRange;
            const isInRange = !xRange || (xValue >= xRange.min && xValue <= xRange.max);

            if (!isInRange || trace.points.length < 2) {
                return; // Skip trace
            }

            // Find points bracketing xValue and interpolate y_display
            let y_interp = null;
            let p_interp = null;
            const bisect = d3.bisector(p => p.x).left;
            const index = bisect(trace.points, xValue, 1);
            const p0 = trace.points[index - 1];
            const p1 = trace.points[index];

            if (p0 && p1) {
                 if (p1.x === p0.x) { // Vertical segment check
                      if (Math.abs(p0.x - xValue) < 1e-9) {
                            if (Math.abs(this.yScale(p0.y_display) - pointerY) < Math.abs(this.yScale(p1.y_display) - pointerY)) {
                                y_interp = p0.y_display; p_interp = p0;
                            } else {
                                y_interp = p1.y_display; p_interp = p1;
                            }
                       }
                 } else { // Interpolate
                      const t = (xValue - p0.x) / (p1.x - p0.x);
                      if (p0.y_display !== null && isFinite(p0.y_display) && p1.y_display !== null && isFinite(p1.y_display)) {
                          y_interp = p0.y_display + t * (p1.y_display - p0.y_display);
                          p_interp = (t < 0.5) ? p0 : p1; // Use nearest point's other data
                          p_interp = { ...p_interp, y_display: y_interp }; // Update point data with interpolated y
                      }
                 }
            } else if (p0 || p1) { // Edge case check
                 const p_edge = p0 || p1;
                 if (Math.abs(p_edge.x - xValue) < 1e-9) {
                    y_interp = p_edge.y_display; p_interp = p_edge;
                 }
            }

            // Calculate vertical distance if interpolation was successful
            if (y_interp !== null && isFinite(y_interp)) {
                const distY = Math.abs(this.yScale(y_interp) - pointerY);
                if (distY < minDistY) {
                    minDistY = distY;
                    closestTraceInfo = { trace: trace, pointData: p_interp, xValue: xValue };
                }
            }
        }); // End loop through traces

        // Display tooltip if a close enough trace was found
        if (closestTraceInfo && minDistY < verticalThresholdPx) {
            const trace = closestTraceInfo.trace;
            const point = closestTraceInfo.pointData;

            const tooltipInfo = {
                 speciesId: trace.speciesId, traceId: trace.id, xValue: xValue,
                 labelString: trace.labelString,
                 yValueDisplayed: point.y_display, yValueVolts: point.y_volt,
                 yValueSource: point.source_y, yValueSourceUnits: point.source_units,
                 currentMode: this.config.mode, pointEvent: event
             };

            try {
                // --- Generate Content via Callback ---
                const content = this._tooltipCallback(tooltipInfo);

                if (content) {
                    // --- Set HTML Content ---
                    this._tooltip.html(content);

                    // --- Render KaTeX within the tooltip ---
                    // Requires KaTeX auto-render extension JS to be loaded
                    if (typeof renderMathInElement === 'function') {
                         try {
                            renderMathInElement(this._tooltip.node(), {
                                delimiters: [
                                    {left: "$$", right: "$$", display: true},
                                    {left: "$", right: "$", display: false},
                                    {left: "\\(", right: "\\)", display: false},
                                    {left: "\\[", right: "\\]", display: true}
                                ],
                                throwOnError: false // Set true for debugging LaTeX errors
                            });
                         } catch (katexError) {
                             console.error("KaTeX auto-render failed in tooltip:", katexError);
                         }
                    } else {
                         console.warn("KaTeX auto-render extension not loaded.");
                    }

                    // --- Measure and Position Tooltip (with boundary checks) ---
                    const tooltipNode = this._tooltip.node();
                    const tooltipWidth = tooltipNode.offsetWidth;
                    const tooltipHeight = tooltipNode.offsetHeight;

                    // Use container-relative coordinates for positioning logic
                    const [containerX, containerY] = d3.pointer(event, this.container.node());
                    const containerWidth = this.container.node().clientWidth;
                    // Use plotHeight for bottom boundary check relative to container coords
                    const plotBottomY = this.plotHeight + this.config.margin.top + this.config.margin.bottom;


                    // Calculate desired position (e.g., above-right of cursor)
                    let targetX = containerX + 15;
                    let targetY = containerY - 15 - tooltipHeight; // Position top edge above cursor

                    // Boundary Checks (relative to container)
                    if (targetX + tooltipWidth > containerWidth) {
                        targetX = containerX - 15 - tooltipWidth; // Flip left
                    }
                    if (targetX < 0) { targetX = 5; } // Prevent going off left

                    if (targetY < 0) { // Check top edge
                         targetY = containerY + 15; // Flip below cursor
                    }
                     // Check bottom edge (relative to container height)
                    // Note: This assumes tooltip is positioned relative to container, not page.
                    if (targetY + tooltipHeight > this.config.height) {
                         targetY = this.config.height - tooltipHeight - 5; // Stick near bottom
                    }


                    // Apply final position and make visible
                    this._tooltip
                        .style("left", `${targetX}px`)
                        .style("top", `${targetY}px`)
                        .style("visibility", "visible")
                        .style("opacity", 1);
                    this._applyHighlight(closestTraceInfo.trace.id);
                } else { // No content returned by callback
                    this._hideTooltip();
                }
            } catch (e) { // Error in user's callback
                 console.error("Error in tooltip callback:", e);
                 this._hideTooltip();
            }
        } else { // No close trace found
            this._hideTooltip();
        }
    }


} // End of class

export default ElectrochemicalSpeciesBandDiagram;
