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
        this.junctionSelectorName = `junction-${this.plotDivId}`; // Although no junction selector used here yet

        // --- Validation for essential config ---
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
        // --- End Validation ---

        this.currentSoCPercent = Math.max(
            0,
            Math.min(100, componentConfig.initialSoCPercent ?? 50)
        );
        this.currentLiTotalNorm = componentConfig.initialLiTotalNorm ?? 0.95;
        this.currentElyteConc = componentConfig.initialElyteConc ?? 1.0;
        this.showStdStates = componentConfig.initialShowStdStates ?? false;
        this.showAnion = componentConfig.initialShowAnion ?? false;
        this.currentXAnode = null;
        this.currentYCathode = null;

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
            this.container.innerHTML = `<p style="color: red;">Error initializing diagram component: ${error.message}</p>`;
        }
    }

    /** Creates the HTML structure for controls and plot */
    _createInternalHTML() {
        const config = this.config;
        const instanceId = this.plotDivId;
        const socSliderId = `soc-${instanceId}`;
        const showStdId = `showStd-${instanceId}`;
        const showAnionId = `showAnion-${instanceId}`;
        const totalLiSliderId = `totalLi-${instanceId}`;
        const elyteConcSliderId = `elyteConc-${instanceId}`;
        const modeSelectId = `mode-${instanceId}`;
        const voltageOutputId = `volt-out-${instanceId}`; // Give output an ID

        this.container.innerHTML = `
            <div class="controls esbd-controls">
                <div class="control-row">
                    <label class="control-label" for="${socSliderId}">State of Charge (%):</label>
                    <input type="range" class="soc-slider" id="${socSliderId}" min="0" max="100" step="1" value="${this.currentSoCPercent}">
                    <output class="soc-value">${this.currentSoCPercent.toFixed(0)}</output> %
                </div>
                 <div class="control-row">
                    <label class="control-label" for="${voltageOutputId}">Cell Voltage (OCV):</label>
                    <output class="cell-voltage" id="${voltageOutputId}">?.???</output> V
                </div>
                 <div class="control-row">
                    <label class="control-label" for="${modeSelectId}">Display Mode:</label>
                    <select class="mode-selector" id="${modeSelectId}" style="margin-left: 10px;">
                         <option value="Volts" selected>Volts</option>
                         <option value="eV">eV</option>
                         <option value="kJmol">kJ/mol</option>
                    </select>
                </div>
                <details class="advanced-controls">
                    <summary style="cursor:pointer; font-size: 0.9em; margin-top: 5px;">Advanced Controls</summary>
                    <div style="padding-left: 20px; margin-top: 5px;">
                        <div class="control-row">
                            <label class="control-label" for="${totalLiSliderId}">Total Li Inventory (Norm.):</label>
                            <input type="range" class="total-li-slider" id="${totalLiSliderId}" min="0.1" max="1.0" step="0.01" value="${this.currentLiTotalNorm}">
                            <output class="total-li-value">${this.currentLiTotalNorm.toFixed(2)}</output>
                        </div>
                        <div class="control-row">
                            <label class="control-label" for="${elyteConcSliderId}">Electrolyte Conc (M):</label>
                            <input type="range" class="elyte-conc-slider" id="${elyteConcSliderId}" min="0.1" max="2.0" step="0.01" value="${this.currentElyteConc}">
                            <output class="elyte-conc-value">${this.currentElyteConc.toFixed(3)}</output> M
                        </div>
                        <div class="control-row">
                             <input type="checkbox" class="show-std-checkbox" id="${showStdId}" ${this.showStdStates ? 'checked' : ''}>
                             <label for="${showStdId}" style="min-width: initial; font-weight: normal;">Show Standard States</label>
                        </div>
                        <div class="control-row">
                             <input type="checkbox" class="show-anion-checkbox" id="${showAnionId}" ${this.showAnion ? 'checked' : ''}>
                             <label for="${showAnionId}" style="min-width: initial; font-weight: normal;">Show Anion Potentials</label>
                        </div>
                    </div>
                </details>
            </div>
            <div class="plot-container" id="${this.plotDivId}" style="width:100%; /* height set by CSS */ border: 1px solid #ddd; margin-top: 10px;"></div>
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
        this.totalLiSlider = this.container.querySelector('.total-li-slider');
        this.totalLiValue = this.container.querySelector('.total-li-value');
        this.elyteConcSlider =
            this.container.querySelector('.elyte-conc-slider');
        this.elyteConcValue = this.container.querySelector('.elyte-conc-value');
    }

    /** Sets up the ESBD instance */
    _setupESBD() {
        if (!this.plotDiv) throw new Error('Plot container div not found.');
        this.diagram = new ElectrochemicalSpeciesBandDiagram(this.plotDivId, {
            height: this.config.plotHeight,
        });
        // Define species known to the diagram
        this.diagram.addSpeciesInfo(
            'li+',
            this.config.li_ion || {
                z: 1,
                color: '#E41A1C',
                latexPrettyName: '\\mathrm{Li}^{+}',
            }
        );
        this.diagram.addSpeciesInfo(
            'anion',
            this.config.anion || {
                z: -1,
                color: '#4DAF4A',
                latexPrettyName: 'PF_6^-',
            }
        );
        this.diagram.addSpeciesInfo(
            'electron',
            this.config.electron || {
                z: -1,
                color: '#377EB8',
                latexPrettyName: '\\mathrm{e}^{-}',
            }
        );

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
        // Helper to add listener if element exists
        const addListener = (element, eventType, handler) => {
            if (element) {
                element.addEventListener(eventType, handler);
            } else {
                // REVIEW: Added warning if element expected but not found
                console.warn(
                    `ESBD Component Warn: Element not found for listener (${eventType})`
                );
            }
        };

        addListener(this.socSlider, 'input', () => this.updateDiagram());
        addListener(this.modeSelector, 'change', (e) =>
            this.diagram.setMode(e.target.value)
        );
        addListener(this.showStdCheckbox, 'change', (e) => {
            this.showStdStates = e.target.checked;
            this.updateDiagram();
        });
        addListener(this.showAnionCheckbox, 'change', (e) => {
            this.showAnion = e.target.checked;
            this.updateDiagram();
        });
        addListener(this.totalLiSlider, 'input', () => this.updateDiagram());
        addListener(this.elyteConcSlider, 'input', () => this.updateDiagram());
    }

    /** Reads inputs, calculates state, updates diagram and outputs */
    updateDiagram() {
        if (!this.diagram) {
            return;
        } // Don't update if diagram failed to init

        // Read current state from UI controls
        if (this.socSlider)
            this.currentSoCPercent = parseFloat(this.socSlider.value);
        if (this.totalLiSlider)
            this.currentLiTotalNorm = parseFloat(this.totalLiSlider.value);
        if (this.elyteConcSlider)
            this.currentElyteConc = parseFloat(this.elyteConcSlider.value);

        // Update UI displays
        if (this.socValue)
            this.socValue.textContent = this.currentSoCPercent.toFixed(0);
        if (this.totalLiValue)
            this.totalLiValue.textContent = this.currentLiTotalNorm.toFixed(2);
        if (this.elyteConcValue)
            this.elyteConcValue.textContent = this.currentElyteConc.toFixed(3);

        try {
            // Calculate the new state
            const { traceDefs, calculatedVoltage } = this._calculateState(
                this.currentSoCPercent,
                this.currentLiTotalNorm,
                this.currentElyteConc,
                this.config,
                this.showStdStates,
                this.showAnion
            );
            // Update the diagram
            this.diagram.updateTraceData(traceDefs);
            // Update displayed cell voltage
            if (this.cellVoltageOut)
                this.cellVoltageOut.textContent = calculatedVoltage.toFixed(3);
        } catch (error) {
            console.error('Error during state calculation or update:', error);
            if (this.cellVoltageOut) this.cellVoltageOut.textContent = 'Error';
        }
    }

    /** Calculation logic specific to Li-ion battery OCV */
    _calculateState(
        socPercent,
        LiTotalNormInput,
        elyteConc,
        config,
        showStd,
        showAnion
    ) {
        // --- Phase 1: Determine Lithiation State ---
        const x_min = config.anode?.x_min ?? 0.01;
        const x_max = config.anode?.x_max ?? 0.99;
        const y_min = config.cathode?.y_min ?? 0.01;
        const y_max = config.cathode?.y_max ?? 0.99;

        // Clamp total Li used in calculation to valid range based on min/max limits
        // Min possible sum: x_min + y_min
        // Max possible sum for full range: x_max + y_min == x_min + y_max (assuming equal spans)
        const LiTotalNorm = Math.max(
            x_min + y_min,
            Math.min(x_max + y_min, LiTotalNormInput)
        );

        // Calculate the amount of lithium that can actually be shifted between electrodes
        const Li_movable = LiTotalNorm - (x_min + y_min);

        // Map SoC % (0-100) to the distribution of movable lithium
        const socFrac = socPercent / 100.0;

        // REFACTOR: Calculate x_anode and y_cathode based on distributing Li_movable
        const x_anode = x_min + Li_movable * socFrac;
        const y_cathode = y_min + Li_movable * (1.0 - socFrac);

        // Store calculated values for tooltip use
        this.currentXAnode = x_anode;
        this.currentYCathode = y_cathode;

        // --- Phase 2: Determine Electrode OCVs using Langmuir model ---
        const E0_anode = config.anode?.E0_vs_Li ?? 0.15;
        const E0_cathode = config.cathode?.E0_vs_Li ?? 3.8;
        // Langmuir term: ln(x/(1-x)) - ensure x is strictly between 0 and 1
        const langmuir_term = (x) => {
            const x_safe = Math.max(1e-9, Math.min(1.0 - 1e-9, x)); // Avoid exact 0 or 1
            return (RT_F / 1) * Math.log(x_safe / (1 - x_safe)); // n=1 for Li+
        };
        const OCV_anode = E0_anode - langmuir_term(x_anode);
        const OCV_cathode = E0_cathode - langmuir_term(y_cathode);

        // --- Phase 3: Calculate Primary Potential Lines (V_e, V_Li+) ---
        const V_Li_plus_elyte = 0; // Set electrolyte Li+ potential as reference V=0
        const V_e_anode = OCV_anode; // V_e = OCV vs Li/Li+ when V_Li+ = 0 ref
        const V_e_cathode = OCV_cathode;
        const cell_voltage = V_e_cathode - V_e_anode;

        // --- Phase 4: Calculate Optional Secondary Potentials ---
        let V_anion = null,
            V_STD_Li_plus = null,
            V_STD_anion = null;
        if (showStd || showAnion) {
            const C_STD = config.c_std_M || 1.0;
            // Use current electrolyte concentration
            const a_Li_plus = Math.max(
                ((config.electrolyte?.nu_Li || 1) * elyteConc) / C_STD,
                1e-9
            ); // Use stoichiometry if provided
            const a_anion = Math.max(
                ((config.electrolyte?.nu_Anion || 1) * elyteConc) / C_STD,
                1e-9
            );

            const mu_std_Li_plus = config.li_ion?.mu_standard_J_mol;
            const mu_std_anion = config.anion?.mu_standard_J_mol;
            const z_anion = config.anion?.z ?? -1;
            const V_span_placeholder = config.V_span_placeholder ?? 1.0;

            V_STD_Li_plus = V_Li_plus_elyte - (RT_F / 1) * Math.log(a_Li_plus);

            if (mu_std_Li_plus !== undefined && mu_std_anion !== undefined) {
                const V_STD_Li_abs = mu_std_Li_plus / (1 * F);
                const V_STD_anion_abs = mu_std_anion / (z_anion * F);
                const V_span_calculated = V_STD_Li_abs - V_STD_anion_abs;
                V_STD_anion = V_STD_Li_plus - V_span_calculated;
            } else {
                V_STD_anion = V_STD_Li_plus - V_span_placeholder;
            }
            V_anion = V_STD_anion + (RT_F / z_anion) * Math.log(a_anion);
        }

        // --- Prepare trace definitions ---
        const b = config.boundaries;
        if (!b || b.length !== 8) {
            throw new Error('Invalid boundaries configuration for 7 regions.');
        }
        const traceDefs = [];
        const traceIdSuffix = this.plotDivId;

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
            if (V_STD_Li_plus !== null)
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
            if (showAnion && V_STD_anion !== null)
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
        if (showAnion) {
            if (V_anion !== null)
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

        return { traceDefs, calculatedVoltage: cell_voltage };
    }

    /** Tooltip callback specific to this Li-ion component instance */
    _getTooltipContent(info) {
        // 1. Get base content
        let content = formatTooltipBaseContent(info);

        // 2. Add Li-ion specific info
        const config = this.config;
        const elyteConc = this.currentElyteConc; // Use stored value

        // Add electrode lithiation state using stored values
        if (info.regionIndex === 1) {
            content += `<br>Anode x = ${this.currentXAnode?.toFixed(3) ?? 'N/A'}`;
        } else if (info.regionIndex === 5) {
            content += `<br>Cathode y = ${this.currentYCathode?.toFixed(3) ?? 'N/A'}`;
        }
        // Add electrolyte info
        else if (info.regionIndex >= 2 && info.regionIndex <= 4) {
            // Electrolyte / Separator regions
            const C_STD = config.c_std_M || 1.0;
            // Assuming 1:1 salt for activity display
            const a_Li_plus = Math.max(elyteConc / C_STD, 1e-9);
            content += `<br>Elyte Conc ≈ ${elyteConc.toFixed(3)} M`;
            content += `<br>Activity($\\mathrm{Li}^{+}$) ≈ ${a_Li_plus.toFixed(3)}`;
            if (
                this.showAnion &&
                (info.speciesId === 'anion' || info.speciesId === 'li+')
            ) {
                const a_anion = Math.max(elyteConc / C_STD, 1e-9); // Assume 1:1
                const anionName = config.anion?.latexPrettyName || 'Anion';
                content += `<br>Activity($${anionName}$) ≈ ${a_anion.toFixed(3)}`;
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
