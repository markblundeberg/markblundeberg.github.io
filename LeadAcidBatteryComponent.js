// LeadAcidBatteryComponent.js
// Component for displaying an ESBD of a Lead-Acid battery at equilibrium (OCV).

import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';
import { formatPopupBaseContent, debounce } from './utils.js';

// --- Physical Constants ---
const R = 8.31446; // J / (mol K)
const F = 96485.3; // C / mol
const TEMP_K = 298.15; // Kelvin
const RT_F = (R * TEMP_K) / F; // Approx 0.02569 V
const C_STD = 1.0; // Standard concentration (1 M) for molar activity scale

class LeadAcidBatteryComponent {
    /**
     * Creates and manages a lead-acid battery diagram instance.
     * @param {string} containerSelector - CSS selector for the parent div element.
     * @param {object} componentConfig - Configuration object defining the battery specifics.
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

        // --- Validation ---
        if (
            !this.config.species?.['H+'] ||
            !this.config.species?.['HSO4-'] ||
            !this.config.species?.['e-']
        ) {
            throw new Error(
                `LeadAcid Config Error: Missing essential species definitions (H+, HSO4-, e-).`
            );
        }
        if (
            this.config.solids?.mu_Pb === undefined ||
            this.config.solids?.mu_PbSO4 === undefined ||
            this.config.solids?.mu_PbO2 === undefined ||
            this.config.solids?.mu_H2O === undefined
        ) {
            throw new Error(
                `LeadAcid Config Error: Missing chemical potentials for solid/liquid phases.`
            );
        }

        // Initialize state
        this.currentAcidConc = componentConfig.electrolyte?.initialConc ?? 4.0;
        this.showStdStates = componentConfig.initialShowStdStates ?? false;
        this.showHSO4 = componentConfig.initialShowHSO4 ?? true;

        try {
            this._createInternalHTML();
            this._findInternalElements();
            this._setupESBD();
            this._attachListeners();
            this.updateDiagram();
            console.log(
                `LeadAcidBatteryComponent initialized in ${containerSelector}`
            );
        } catch (error) {
            console.error(
                `Error initializing LeadAcidBatteryComponent in ${containerSelector}:`,
                error
            );
            this.container.innerHTML = `<p style="color: red;">Error initializing diagram component: ${error.message}</p>`;
        }
    }

    /** Creates the HTML structure for controls and plot */
    _createInternalHTML() {
        const config = this.config;
        const instanceId = this.plotDivId;
        const concSliderId = `conc-${instanceId}`;
        const showStdId = `showStd-${instanceId}`;
        const showHSO4Id = `showHSO4-${instanceId}`;
        const modeSelectId = `mode-${instanceId}`;
        const voltageOutputId = `volt-out-${instanceId}`;

        this.container.innerHTML = `
            <div class="controls esbd-controls">
                 <div class="control-row">
                    <label class="control-label" for="${concSliderId}">H₂SO₄ Concentration (M):</label>
                    <input type="range" class="conc-slider" id="${concSliderId}" min="0.1" max="6.0" step="0.1" value="${this.currentAcidConc}">
                    <output class="conc-value">${this.currentAcidConc.toFixed(1)}</output> M
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
                             <input type="checkbox" class="show-std-checkbox" id="${showStdId}" ${this.showStdStates ? 'checked' : ''}>
                             <label for="${showStdId}" style="min-width: initial; font-weight: normal;">Show Standard States</label>
                        </div>
                        <div class="control-row">
                             <input type="checkbox" class="show-hso4-checkbox" id="${showHSO4Id}" ${this.showHSO4 ? 'checked' : ''}>
                             <label for="${showHSO4Id}" style="min-width: initial; font-weight: normal;">Show HSO₄⁻ Potentials</label>
                        </div>
                    </div>
                </details>
            </div>
            <div class="plot-container" id="${this.plotDivId}" style="width:100%; /* height set by CSS */ border: 1px solid #ddd; margin-top: 10px;"></div>
        `;
    }

    /** Finds references to the dynamically created DOM elements */
    _findInternalElements() {
        this.concSlider = this.container.querySelector('.conc-slider');
        this.concValue = this.container.querySelector('.conc-value');
        this.cellVoltageOut = this.container.querySelector('.cell-voltage');
        this.modeSelector = this.container.querySelector('.mode-selector');
        this.showStdCheckbox =
            this.container.querySelector('.show-std-checkbox');
        this.showHSO4Checkbox = this.container.querySelector(
            '.show-hso4-checkbox'
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
        this.diagram.addSpeciesInfo('H+', this.config.species['H+']);
        this.diagram.addSpeciesInfo('HSO4-', this.config.species['HSO4-']);
        this.diagram.addSpeciesInfo('e-', this.config.species['e-']);

        // Set layout
        this.diagram.setSpatialLayout(
            this.config.boundaries,
            this.config.regionProps
        );

        // Set general popup callback (for lines)
        this.diagram.setTracePopupCallback(
            this._getTracePopupContent.bind(this)
        );

        // Add vertical markers for the electrode interfaces
        this.diagram.addVerticalMarker('anode_eq', {
            symbol: '⇌',
            speciesId1: 'electron',
            speciesId2: 'H+',
            popupCallback: this._getInterfacePopupContent.bind(this, 'Anode'),
        });
        this.diagram.addVerticalMarker('cathode_eq', {
            symbol: '⇌',
            speciesId1: 'electron',
            speciesId2: 'H+',
            popupCallback: this._getInterfacePopupContent.bind(this, 'Cathode'),
        });
    }

    /** Attaches event listeners to controls */
    _attachListeners() {
        const addListener = (element, eventType, handler) => {
            if (element) element.addEventListener(eventType, handler);
            else console.warn(`Element not found for listener (${eventType})`);
        };
        addListener(this.concSlider, 'input', () => this.updateDiagram());
        addListener(this.modeSelector, 'change', (e) =>
            this.diagram.setMode(e.target.value)
        );
        addListener(this.showStdCheckbox, 'change', (e) => {
            this.showStdStates = e.target.checked;
            this.updateDiagram();
        });
        addListener(this.showHSO4Checkbox, 'change', (e) => {
            this.showHSO4 = e.target.checked;
            this.updateDiagram();
        });
    }

    /** Reads inputs, calculates state, updates diagram and outputs */
    updateDiagram() {
        if (
            !this.concSlider ||
            !this.concValue ||
            !this.cellVoltageOut ||
            !this.diagram
        ) {
            return;
        }
        this.currentAcidConc = parseFloat(this.concSlider.value);
        this.concValue.textContent = this.currentAcidConc.toFixed(1);
        // Checkbox states are updated directly by listeners

        try {
            const { traceDefs, calculatedVoltage } = this._calculateState(
                this.currentAcidConc,
                this.config,
                this.showStdStates,
                this.showHSO4 // Pass flag
            );
            this.diagram.updateTraceData(traceDefs);
            this.cellVoltageOut.textContent = calculatedVoltage.toFixed(3);
        } catch (error) {
            console.error('Error during state calculation or update:', error);
            this.cellVoltageOut.textContent = 'Error';
        }
    }

    /** Calculation logic specific to Lead-Acid battery OCV */
    _calculateState(acidConc, config, showStd, showHSO4) {
        // --- 1. Define Constants & Inputs ---
        const mu_Pb = config.solids.mu_Pb;
        const mu_PbSO4 = config.solids.mu_PbSO4;
        const mu_PbO2 = config.solids.mu_PbO2;
        const mu_H2O = config.solids.mu_H2O;
        const mu_std_H_plus = config.species['H+'].mu_standard_J_mol;
        const mu_std_HSO4_minus = config.species['HSO4-'].mu_standard_J_mol;

        // Calculate constants for equilibrium equations
        const Const_A = (0.5 * (mu_PbSO4 - mu_Pb)) / F;
        const Const_C = (0.5 * (mu_PbO2 - mu_PbSO4 - 2 * mu_H2O)) / F;
        const V_span = (-mu_std_HSO4_minus - mu_std_H_plus) / F;

        // Calculate activities (Simplification)
        const a_H_plus = Math.max(acidConc / C_STD, 1e-9);
        const a_HSO4_minus = Math.max(acidConc / C_STD, 1e-9);
        // This is the term for V_HSO4- - V_H+
        const nernst_diff_term =
            V_span - RT_F * Math.log(a_H_plus * a_HSO4_minus);

        // --- 2. Set Reference Potential ---
        const V_e_anode = 0.0;

        // --- 3. Solve for Ion Potentials ---
        const V_H_plus = V_e_anode - Const_A - 0.5 * nernst_diff_term;
        const V_HSO4_minus = V_e_anode - Const_A + 0.5 * nernst_diff_term;

        // --- 4. Calculate Cathode Electron Potential ---
        const V_e_cathode = 1.5 * V_H_plus - 0.5 * V_HSO4_minus + Const_C;

        // --- 5. Calculate Cell Voltage ---
        const cell_voltage = V_e_cathode - V_e_anode;

        // --- 6. Calculate Optional Standard State Levels ---
        let V_STD_H_plus = null,
            V_STD_HSO4_minus = null;
        if (showStd) {
            V_STD_H_plus = V_H_plus - (RT_F / 1) * Math.log(a_H_plus);
            V_STD_HSO4_minus =
                V_HSO4_minus - (RT_F / -1) * Math.log(a_HSO4_minus);
        }

        // --- 7. Prepare Trace Definitions ---
        const b = config.boundaries;
        if (!b || b.length !== 6) {
            throw new Error('Invalid boundaries configuration for 5 regions.');
        }
        const traceDefs = [];
        const traceIdSuffix = this.plotDivId;

        traceDefs.push({
            id: `e_anode_side_${traceIdSuffix}`,
            speciesId: 'e-',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            xRange: { min: b[0], max: b[2] },
            x: [b[0], b[2]],
            y: [V_e_anode, V_e_anode],
        });
        traceDefs.push({
            id: `e_cathode_side_${traceIdSuffix}`,
            speciesId: 'e-',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            xRange: { min: b[3], max: b[5] },
            x: [b[3], b[5]],
            y: [V_e_cathode, V_e_cathode],
        });
        traceDefs.push({
            id: `H_plus_elyte_${traceIdSuffix}`,
            speciesId: 'H+',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            xRange: { min: b[2], max: b[3] },
            x: [b[2], b[3]],
            y: [V_H_plus, V_H_plus],
        });
        if (showStd && V_STD_H_plus !== null) {
            traceDefs.push({
                id: `H_plus_std_${traceIdSuffix}`,
                speciesId: 'H+',
                curveType: 'standardState',
                showLabel: false,
                inputUnits: 'V_volt',
                xRange: { min: b[2], max: b[3] },
                x: [b[2], b[3]],
                y: [V_STD_H_plus, V_STD_H_plus],
            });
        }
        if (showHSO4) {
            traceDefs.push({
                id: `HSO4_minus_elyte_${traceIdSuffix}`,
                speciesId: 'HSO4-',
                curveType: 'potential',
                showLabel: true,
                inputUnits: 'V_volt',
                xRange: { min: b[2], max: b[3] },
                x: [b[2], b[3]],
                y: [V_HSO4_minus, V_HSO4_minus],
            });
            if (showStd && V_STD_HSO4_minus !== null) {
                traceDefs.push({
                    id: `HSO4_minus_std_${traceIdSuffix}`,
                    speciesId: 'HSO4-',
                    curveType: 'standardState',
                    showLabel: false,
                    inputUnits: 'V_volt',
                    xRange: { min: b[2], max: b[3] },
                    x: [b[2], b[3]],
                    y: [V_STD_HSO4_minus, V_STD_HSO4_minus],
                });
            }
        }

        // --- 8. Update Vertical Markers ---
        if (this.diagram) {
            const anodeTooltipArgs = {
                reaction:
                    '\\mathrm{Pb}(s) + \\mathrm{HSO}_4^{-} \\rightleftharpoons \\mathrm{PbSO}_4(s) + \\mathrm{H}^{+} + 2\\mathrm{e}^{-}',
                potential_check_volt: V_H_plus + V_HSO4_minus - 2 * V_e_anode,
                interfaceName: 'Anode/Electrolyte',
            };
            this.diagram.updateVerticalMarker('anode_eq', {
                x: b[2], // Pb/Elyte interface boundary index
                y1: V_e_anode, // Electron potential
                y2: V_H_plus, // Use H+ potential as the other anchor
                inputUnits: 'V_volt',
                popupArgs: anodeTooltipArgs,
            });

            const cathodeTooltipArgs = {
                reaction:
                    '\\mathrm{PbO}_2(s) + \\mathrm{HSO}_4^{-} + 3\\mathrm{H}^{+} + 2\\mathrm{e}^{-} \\rightleftharpoons \\mathrm{PbSO}_4(s) + 2\\mathrm{H}_2\\mathrm{O}(l)',
                potential_check_volt:
                    1.5 * V_H_plus - 0.5 * V_HSO4_minus - V_e_cathode,
                interfaceName: 'Electrolyte/Cathode',
            };
            this.diagram.updateVerticalMarker('cathode_eq', {
                x: b[3], // Elyte/PbO2 interface boundary index
                y1: V_e_cathode, // Electron potential
                y2: V_H_plus, // Use H+ potential as the other anchor
                inputUnits: 'V_volt',
                popupArgs: cathodeTooltipArgs,
            });
        }

        return { traceDefs, calculatedVoltage: cell_voltage };
    }

    /** Tooltip callback specific to data lines */
    _getTracePopupContent(info) {
        let content = formatPopupBaseContent(info); // Base content
        const config = this.config;
        const elyteConc = this.currentAcidConc; // Use stored value

        // Add electrolyte concentration/activity info
        if (info.regionIndex === 2) {
            // Electrolyte Region (index 2 in regionProps array)
            const C_STD = config.c_std_M || 1.0;
            const a_H_plus = Math.max(elyteConc / C_STD, 1e-9); // Approximation
            const a_HSO4_minus = Math.max(elyteConc / C_STD, 1e-9); // Approximation

            content += `<br>Stoich Conc ≈ ${elyteConc.toFixed(3)} M`;
            if (info.speciesId === 'H+')
                content += `<br>Activity($\\mathrm{H}^{+}$) ≈ ${a_H_plus.toFixed(3)}`;
            if (info.speciesId === 'HSO4-')
                content += `<br>Activity($\\mathrm{HSO}_4^{-}$) ≈ ${a_HSO4_minus.toFixed(3)}`;
        }

        return content;
    }

    /** Tooltip callback specific to interface markers */
    _getInterfacePopupContent(identifier, info) {
        const args = info.customArgs || {};
        const reaction = args.reaction || 'Reaction N/A';
        const mode = info.currentMode;

        // Format reaction with KaTeX delimiters
        const reactionStr = `$${reaction}$`;

        let content = `<b>Interface: ${identifier}</b><br>
                       Reaction: ${reactionStr}<br>`;

        content += `Equilibrium Condition Holds`;

        // Display the electron potential at the interface
        content += `<br>$V_{\\mathrm{e}^{-}}$(${mode}) ≈ ${info.y1_display.toFixed(3)} ${mode === 'kJmol' ? 'kJ/mol' : mode}`;

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
export default LeadAcidBatteryComponent;
