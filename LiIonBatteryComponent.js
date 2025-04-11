// LiIonBatteryComponent.js
// Component for displaying an ESBD of a Li-ion battery at equilibrium (OCV).

import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';
import { formatTooltipBaseContent, debounce } from './utils.js';

// --- Physical Constants ---
const R = 8.31446; // J / (mol K)
const F = 96485.3; // C / mol
const TEMP_K = 298.15; // Kelvin
const RT_F = (R * TEMP_K) / F; // Approx 0.02569 V

class LiIonBatteryComponent {
    /**
     * Creates and manages a Li-ion battery diagram instance.
     * @param {string} containerSelector - CSS selector for the parent div element.
     * @param {object} componentConfig - Configuration object defining the battery specifics.
     * Expected fields in componentConfig:
     * anode: { E0_vs_Li, capacity_sites?, color?, latexPrettyName? }
     * cathode: { E0_vs_Li, capacity_sites?, color?, latexPrettyName? }
     * electrolyte: { Li_activity, anion_activity?, anion_z?, anion_mu_std_J_mol?, anion_color?, anion_latex? }
     * li_ion: { mu_standard_J_mol?, color?, latexPrettyName? } // For Li+ standard state
     * electron: { color?, latexPrettyName? }
     * Li_total_norm: number (Total Li relative to single electrode site capacity)
     * V_span_placeholder: number (Placeholder V_std_Li+ - V_std_Anion)
     * initialSoC: number (0 to 1)
     * boundaries: array<number>
     * regionProps: array<object>
     * plotHeight: number
     */
    constructor(containerSelector, componentConfig) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(
                `Container element ${containerSelector} not found.`
            );
        }
        this.config = componentConfig;
        this.diagram = null;
        this.plotDivId = `esbd-plot-${Math.random().toString(36).substring(2, 9)}`;

        if (
            !this.config.boundaries ||
            !Array.isArray(this.config.boundaries) ||
            this.config.boundaries.length < 2
        ) {
            throw new Error(
                `LiIonBatteryComponent Error: config.boundaries must be an array with at least 2 values.`
            );
        }
        if (
            !this.config.regionProps ||
            !Array.isArray(this.config.regionProps) ||
            this.config.regionProps.length !== this.config.boundaries.length - 1
        ) {
            throw new Error(
                `LiIonBatteryComponent Error: config.regionProps must be an array with length = boundaries.length - 1.`
            );
        }
        // TODO: Could add validation for sorted boundaries

        // Initialize state
        this.currentSoC = componentConfig.initialSoC ?? 0.5;
        this.showStdStates = false;
        this.showAnion = false;

        try {
            this._createInternalHTML();
            this._findInternalElements();
            this._setupESBD();
            this._attachListeners();
            this.updateDiagram();
            console.log(
                `LiIonBatteryComponent initialized in ${containerSelector}`
            );
        } catch (error) {
            console.error(
                `Error initializing LiIonBatteryComponent in ${containerSelector}:`,
                error
            );
            this.container.innerHTML = `<p style="color: red;">Error initializing diagram component.</p>`;
        }
    }

    /** Creates the HTML structure for controls and plot */
    _createInternalHTML() {
        const config = this.config;
        const instanceId = this.plotDivId; // Unique prefix for IDs
        const socSliderId = `soc-${instanceId}`;
        const showStdId = `showStd-${instanceId}`;
        const showAnionId = `showAnion-${instanceId}`;
        // Add placeholders for total Li slider if needed later

        this.container.innerHTML = `
            <div class="controls esbd-controls">
                <div class="control-row">
                    <label class="control-label" for="${socSliderId}">State of Charge (Anode x):</label>
                    <input type="range" class="soc-slider" id="${socSliderId}" min="0.01" max="0.99" step="0.01" value="${this.currentSoC}">
                    <output class="soc-value">${this.currentSoC.toFixed(2)}</output>
                </div>
                 <div class="control-row">
                    <label class="control-label">Cell Voltage (OCV):</label>
                    <output class="cell-voltage">?.???</output> V
                </div>
                 <div class="control-row">
                    <label class="control-label">Display Mode:</label>
                    <select class="mode-selector" style="margin-left: 10px;">
                         <option value="Volts" selected>Volts</option>
                         <option value="eV">eV</option>
                         <option value="kJmol">kJ/mol</option>
                    </select>
                </div>
                <details class="advanced-controls">
                    <summary style="cursor:pointer; font-size: 0.9em; margin-top: 5px;">Advanced Controls</summary>
                    <div style="padding-left: 20px; margin-top: 5px;">
                        <div class="control-row">
                             <input type="checkbox" class="show-std-checkbox" id="${showStdId}">
                             <label for="${showStdId}" style="min-width: initial; font-weight: normal;">Show Standard States</label>
                        </div>
                        <div class="control-row">
                             <input type="checkbox" class="show-anion-checkbox" id="${showAnionId}">
                             <label for="${showAnionId}" style="min-width: initial; font-weight: normal;">Show Anion Potentials</label>
                        </div>
                        </div>
                </details>
            </div>
            <div class="plot-container" id="${this.plotDivId}" style="width:100%; height:${config.plotHeight || 300}px; border: 1px solid #ddd; margin-top: 10px;"></div>
        `;
    }

    /** Finds references to the dynamically created DOM elements */
    _findInternalElements() {
        this.socSlider = this.container.querySelector('.soc-slider');
        this.socValue = this.container.querySelector('.soc-value');
        this.cellVoltageOut = this.container.querySelector('.cell-voltage');
        this.modeSelector = this.container.querySelector('.mode-selector');
        this.showStdCheckbox =
            this.container.querySelector('.show-std-checkbox');
        this.showAnionCheckbox = this.container.querySelector(
            '.show-anion-checkbox'
        );
        this.plotDiv = this.container.querySelector('.plot-container');
    }

    /** Sets up the ESBD instance */
    _setupESBD() {
        if (!this.plotDiv) throw new Error('Plot container div not found.');

        this.diagram = new ElectrochemicalSpeciesBandDiagram(this.plotDivId, {
            height: this.config.plotHeight,
        });

        // Define species known to the diagram
        // Use generic IDs that match keys in config for easy lookup
        this.diagram.addSpeciesInfo(
            'li+',
            this.config.li_ion || {
                z: 1,
                color: '#E41A1C',
                latexPrettyName: '\\mathrm{Li}^{+}',
            }
        ); // Red
        this.diagram.addSpeciesInfo(
            'anion',
            this.config.anion || {
                z: -1,
                color: '#4DAF4A',
                latexPrettyName: 'PF_6^-',
            }
        ); // Default anion if not specified
        this.diagram.addSpeciesInfo(
            'electron',
            this.config.electron || {
                z: -1,
                color: '#377EB8',
                latexPrettyName: '\\mathrm{e}^{-}',
            }
        ); // Blue
        // Add info for electrode species if needed for labels/tooltips (optional)
        this.diagram.addSpeciesInfo('anode_host', {
            z: null,
            color: this.config.anode?.color || 'grey',
            latexPrettyName: this.config.anode?.latexPrettyName || 'Anode',
        });
        this.diagram.addSpeciesInfo('cathode_host', {
            z: null,
            color: this.config.cathode?.color || 'black',
            latexPrettyName: this.config.cathode?.latexPrettyName || 'Cathode',
        });

        // Set layout
        this.diagram.setSpatialLayout(
            this.config.boundaries,
            this.config.regionProps
        );
        // Set tooltip callback
        this.diagram.setTooltipCallback(this._getTooltipContent.bind(this));
    }

    /** Attaches event listeners to controls */
    _attachListeners() {
        if (this.socSlider)
            this.socSlider.addEventListener('input', () =>
                this.updateDiagram()
            );
        if (this.modeSelector)
            this.modeSelector.addEventListener('change', (e) =>
                this.diagram.setMode(e.target.value)
            );
        if (this.showStdCheckbox)
            this.showStdCheckbox.addEventListener('change', (e) => {
                this.showStdStates = e.target.checked;
                this.updateDiagram();
            });
        if (this.showAnionCheckbox)
            this.showAnionCheckbox.addEventListener('change', (e) => {
                this.showAnion = e.target.checked;
                this.updateDiagram();
            });
        // Add listeners for other advanced controls later
    }

    /** Reads inputs, calculates state, updates diagram and outputs */
    updateDiagram() {
        if (
            !this.socSlider ||
            !this.socValue ||
            !this.cellVoltageOut ||
            !this.diagram
        ) {
            console.error(
                'Cannot update component: Missing internal elements or diagram instance.'
            );
            return;
        }
        // Read current state from UI
        this.currentSoC = parseFloat(this.socSlider.value);
        // Read optional flags (already updated by listeners)
        const showStd = this.showStdStates;
        const showAnion = this.showAnion;

        // Update UI displays
        this.socValue.textContent = this.currentSoC.toFixed(2);

        try {
            // Calculate the new state
            const { traceDefs, calculatedVoltage } = this._calculateState(
                this.currentSoC,
                this.config,
                showStd,
                showAnion
            );
            // Update the diagram
            this.diagram.updateTraceData(traceDefs);
            // Update displayed cell voltage
            this.cellVoltageOut.textContent = calculatedVoltage.toFixed(3);
        } catch (error) {
            console.error('Error during state calculation or update:', error);
            this.cellVoltageOut.textContent = 'Error';
        }
    }

    /** Calculation logic specific to Li-ion battery OCV */
    _calculateState(soc_anode_x, config, showStd, showAnion) {
        // Phase 1: Determine Lithiation State
        const Li_total_norm = config.Li_total_norm || 0.95; // Default if not provided
        const cap_anode = config.anode?.capacity_sites || 1; // Relative site capacity
        const cap_cathode = config.cathode?.capacity_sites || 1; // Relative site capacity

        // Let slider control anode state x directly (0.01 to 0.99)
        const x_anode = Math.max(0.01, Math.min(0.99, soc_anode_x));

        // Calculate cathode state y based on conservation (relative to total sites)
        // Assumes Li_total_norm is relative to *one* electrode's capacity if equal
        // More general: Li_total = x * Cap_A + y * Cap_C
        // Let's assume slider SoC refers to anode x, and Li_total_norm is relative to anode cap
        // Li_total_moles = Li_total_norm * cap_anode (relative moles)
        // y_cathode_moles = Li_total_moles - x_anode * cap_anode
        // y_cathode_fraction = y_cathode_moles / cap_cathode
        // If cap_anode = cap_cathode = 1, then y_cathode = Li_total_norm - x_anode
        const y_cathode = Math.max(
            0.01,
            Math.min(0.99, Li_total_norm - x_anode)
        );

        // Phase 2: Determine Electrode OCVs using Langmuir model
        const E0_anode = config.anode?.E0_vs_Li ?? 0.15;
        const E0_cathode = config.cathode?.E0_vs_Li ?? 3.8;
        const langmuir_term = (x) => (RT_F / 1) * Math.log(x / (1 - x));
        const OCV_anode = E0_anode - langmuir_term(x_anode);
        const OCV_cathode = E0_cathode - langmuir_term(y_cathode);

        // Phase 3: Calculate Primary Potential Lines (V_e, V_Li+)
        const V_Li_plus_elyte = 0; // Set electrolyte Li+ potential as reference V=0
        const V_e_anode = OCV_anode;
        const V_e_cathode = OCV_cathode;
        const cell_voltage = V_e_cathode - V_e_anode;

        // Phase 4: Calculate Optional Secondary Potentials
        let V_anion = null,
            V_STD_Li_plus = null,
            V_STD_anion = null;
        if (showStd || showAnion) {
            const a_Li_plus = config.electrolyte?.Li_activity ?? 1.0;
            const a_anion = config.electrolyte?.anion_activity ?? 1.0;
            const mu_std_Li_plus = config.li_ion?.mu_standard_J_mol;
            const mu_std_anion = config.anion?.mu_standard_J_mol;
            const z_anion = config.anion?.z ?? -1;
            const V_span_placeholder = config.V_span_placeholder ?? 1.0; // Use 1V placeholder default

            V_STD_Li_plus = V_Li_plus_elyte - (RT_F / 1) * Math.log(a_Li_plus);

            if (mu_std_Li_plus !== undefined && mu_std_anion !== undefined) {
                const V_STD_Li_abs = mu_std_Li_plus / (1 * F);
                const V_STD_anion_abs = mu_std_anion / (z_anion * F);
                const V_span_calculated = V_STD_Li_abs - V_STD_anion_abs;
                V_STD_anion = V_STD_Li_plus - V_span_calculated;
            } else {
                V_STD_anion = V_STD_Li_plus - V_span_placeholder;
                // Only warn once maybe? Or use a flag.
                // console.warn("Using placeholder V_span for anion standard state.");
            }
            V_anion = V_STD_anion + (RT_F / z_anion) * Math.log(a_anion);
        }

        // --- Prepare trace definitions ---
        const b = config.boundaries;
        if (!b || b.length !== 8) {
            throw new Error('Invalid boundaries configuration for 7 regions.');
        }
        const traceDefs = [];
        const traceIdSuffix = this.plotDivId; // Make trace IDs unique per instance

        // V_e- Traces
        traceDefs.push({
            id: `e_anode_side_${traceIdSuffix}`,
            speciesId: 'electron',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            xRange: { min: b[0], max: b[2] },
            x: [b[0], b[2]],
            y: [V_e_anode, V_e_anode],
        });
        traceDefs.push({
            id: `e_cathode_side_${traceIdSuffix}`,
            speciesId: 'electron',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            xRange: { min: b[5], max: b[7] },
            x: [b[5], b[7]],
            y: [V_e_cathode, V_e_cathode],
        });

        // V_Li+ Trace (Spans Elyte1, Separator, Elyte2)
        traceDefs.push({
            id: `li_elyte_${traceIdSuffix}`,
            speciesId: 'li+',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            xRange: { min: b[2], max: b[5] },
            x: [b[2], b[5]],
            y: [V_Li_plus_elyte, V_Li_plus_elyte],
        });

        // Optional Traces
        if (showStd) {
            if (V_STD_Li_plus !== null) {
                traceDefs.push({
                    id: `li_std_${traceIdSuffix}`,
                    speciesId: 'li+',
                    curveType: 'standardState',
                    showLabel: false,
                    inputUnits: 'V_volt',
                    xRange: { min: b[2], max: b[5] },
                    x: [b[2], b[5]],
                    y: [V_STD_Li_plus, V_STD_Li_plus],
                });
            }
            if (showAnion && V_STD_anion !== null) {
                traceDefs.push({
                    id: `anion_std_${traceIdSuffix}`,
                    speciesId: 'anion',
                    curveType: 'standardState',
                    showLabel: false,
                    inputUnits: 'V_volt',
                    xRange: { min: b[2], max: b[5] },
                    x: [b[2], b[5]],
                    y: [V_STD_anion, V_STD_anion],
                });
            }
        }
        if (showAnion) {
            if (V_anion !== null) {
                traceDefs.push({
                    id: `anion_elyte_${traceIdSuffix}`,
                    speciesId: 'anion',
                    curveType: 'potential',
                    showLabel: true,
                    inputUnits: 'V_volt',
                    xRange: { min: b[2], max: b[5] },
                    x: [b[2], b[5]],
                    y: [V_anion, V_anion],
                });
            }
        }

        return { traceDefs, calculatedVoltage: cell_voltage };
    }

    /** Tooltip callback specific to this Li-ion component instance */
    _getTooltipContent(info) {
        let content = formatTooltipBaseContent(info); // Call base formatter

        // Add Li content (x or y) if hovering over an electrode region
        const config = this.cellConfig;
        const Li_total_norm = config.Li_total_norm || 0.95;
        const x_anode = Math.max(0.01, Math.min(0.99, this.currentSoC)); // Assuming slider is x_anode
        const y_cathode = Math.max(
            0.01,
            Math.min(0.99, Li_total_norm - x_anode)
        );

        if (info.regionIndex === 1) {
            // Graphite Anode
            content += `<br>Lithiation x = ${x_anode.toFixed(3)}`;
        } else if (info.regionIndex === 5) {
            // Metal Oxide Cathode
            content += `<br>Lithiation y = ${y_cathode.toFixed(3)}`;
        } else if (
            info.regionIndex === 2 ||
            info.regionIndex === 3 ||
            info.regionIndex === 4
        ) {
            // Electrolyte / Separator
            // Add electrolyte concentration? Assume constant for now.
            const li_activity = config.electrolyte?.Li_activity ?? 1.0;
            content += `<br>Li+ Activity ≈ ${li_activity.toFixed(3)}`;
            if (
                this.showAnion &&
                (info.speciesId === 'anion' || info.speciesId === 'li+')
            ) {
                const anion_activity =
                    config.electrolyte?.anion_activity ?? 1.0;
                content += `<br>Anion Activity ≈ ${anion_activity.toFixed(3)}`;
            }
        }
        return content;
    }

    /** Cleanup method */
    destroy() {
        if (this.diagram) this.diagram.destroy();
        // Remove listeners if needed (though removing elements might suffice)
        this.container.innerHTML = ''; // Clear generated content
        console.log(
            `Component in ${this.container.id || this.containerSelector} destroyed.`
        );
    }
}

// Export the class
export default LiIonBatteryComponent;
