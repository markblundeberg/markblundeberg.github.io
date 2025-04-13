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
     * Expected fields: species (H+, HSO4-, e-), solids (mu_Pb, mu_PbSO4, mu_PbO2, mu_H2O),
     * electrolyte (initialConc, nu_H, nu_HSO4), layout (boundaries, regionProps), plotHeight.
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
        this.currentAcidConc = componentConfig.electrolyte?.initialConc ?? 4.0; // Default to ~4 M H2SO4
        this.showStdStates = componentConfig.initialShowStdStates ?? false;
        this.showHSO4 = componentConfig.initialShowHSO4 ?? true; // Show HSO4- by default

        try {
            this._createInternalHTML();
            this._findInternalElements();
            this._setupESBD();
            this._attachListeners();
            this.updateDiagram(); // Initial draw
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
        // Optionally add SO4^2- if needed later
        // this.diagram.addSpeciesInfo('SO4^2-', this.config.species['SO4^2-']);

        // Set layout
        this.diagram.setSpatialLayout(
            this.config.boundaries,
            this.config.regionProps
        );

        // Set general tooltip callback (for lines)
        this.diagram.setTracePopupCallback(
            this._getTracePopupContent.bind(this)
        );

        // Add reaction markers for the electrode interfaces
        this.diagram.addVerticalMarker('anode_eq', {
            symbol: '⇌',
            speciesId1: 'electron',
            speciesId2: 'H+', // Link e- and H+ visually? Or HSO4-? Let's try H+
            popupCallback: this._getInterfacePopupContent.bind(this, 'Anode'), // Use generic handler
        });
        this.diagram.addVerticalMarker('cathode_eq', {
            symbol: '⇌',
            speciesId1: 'electron',
            speciesId2: 'H+', // Link e- and H+ visually?
            popupCallback: this._getInterfacePopupContent.bind(this, 'Cathode'), // Use generic handler
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
        const C_STD = config.c_std_M || 1.0;

        // Get standard chemical potentials (J/mol)
        const mu_Pb = config.solids.mu_Pb;
        const mu_PbSO4 = config.solids.mu_PbSO4;
        const mu_PbO2 = config.solids.mu_PbO2;
        const mu_H2O = config.solids.mu_H2O;
        const mu_std_H_plus = config.species['H+'].mu_standard_J_mol; // Should be 0 by definition
        const mu_std_HSO4_minus = config.species['HSO4-'].mu_standard_J_mol;

        // Calculate constants for equilibrium equations
        const Const_A = (0.5 * (mu_PbSO4 - mu_Pb)) / F; // Approx -4.21 V
        const Const_C = (0.5 * (mu_PbO2 - mu_PbSO4 - 2 * mu_H2O)) / F; // Approx +5.54 V
        const V_span = (-mu_std_HSO4_minus - mu_std_H_plus) / F; // Approx +7.83 V

        // Calculate activities (Simplification: a_i = C / C_STD, ignore dissociation)
        // A real model needs HSO4- <=> H+ + SO4-- equilibrium based on C and Ka
        const a_H_plus = Math.max(acidConc / C_STD, 1e-9); // Approximation
        const a_HSO4_minus = Math.max(acidConc / C_STD, 1e-9); // Approximation
        const activity_term = -RT_F * Math.log(a_H_plus * a_HSO4_minus);

        // --- 2. Set Reference Potential ---
        const V_e_anode = 0.0; // Set anode electron potential as reference

        // --- 3. Solve for Ion Potentials (V_H+, V_HSO4-) relative to V_e_anode=0 ---
        // Eq1 (from Anode Eq): V_H+ + V_HSO4- = 2 * (V_e_anode - Const_A)
        // Eq2 (from Nernst Diff): V_HSO4- - V_H+ = V_span + activity_term
        const V_H_plus =
            V_e_anode - Const_A - 0.5 * V_span - 0.5 * activity_term;
        const V_HSO4_minus = V_H_plus + V_span + activity_term;

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
            // Expecting 5 regions: C|Pb|Elyte/Sep|PbO2|C
            console.warn(
                'LeadAcid Config Warning: Expected 6 boundaries for 5 regions. Adjusting trace ranges.'
            );
            // Adjust boundary indices if layout differs, assuming 5 regions for now:
            // R0=Coll1[0,1], R1=Pb[1,2], R2=Elyte[2,3], R3=PbO2[3,4], R4=Coll2[4,5]
            if (!b || b.length !== 6) b = [0, 0.15, 0.35, 0.65, 0.85, 1.0]; // Default layout
        }
        const traceDefs = [];
        const traceIdSuffix = this.plotDivId;

        // Electron Traces (Collector|Anode and Cathode|Collector)
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

        // H+ Trace (Electrolyte/Separator region)
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

        // HSO4- Traces (Optional)
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
                potential_diff_volt: V_H_plus + V_HSO4_minus - 2 * V_e_anode, // Should be -2*Const_A
                interfaceName: 'Anode/Electrolyte',
            };
            this.diagram.updateVerticalMarker('anode_eq', {
                x: b[2], // Pb/Elyte interface boundary index
                y1: V_e_anode, // Electron potential
                y2: V_H_plus, // Use H+ potential as the other anchor? Or HSO4-?
                inputUnits: 'V_volt',
                tooltipArgs: anodeTooltipArgs,
            });

            const cathodeTooltipArgs = {
                reaction:
                    '\\mathrm{PbO}_2(s) + \\mathrm{HSO}_4^{-} + 3\\mathrm{H}^{+} + 2\\mathrm{e}^{-} \\rightleftharpoons \\mathrm{PbSO}_4(s) + 2\\mathrm{H}_2\\mathrm{O}(l)',
                potential_diff_volt:
                    1.5 * V_H_plus - 0.5 * V_HSO4_minus - V_e_cathode, // Should be -Const_C
                interfaceName: 'Electrolyte/Cathode',
            };
            this.diagram.updateVerticalMarker('cathode_eq', {
                x: b[3], // Elyte/PbO2 interface boundary index
                y1: V_e_cathode, // Electron potential
                y2: V_H_plus, // Use H+ potential as the other anchor?
                inputUnits: 'V_volt',
                tooltipArgs: cathodeTooltipArgs,
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

            content += `<br>Region: Electrolyte/Separator`;
            content += `<br>Stoich Conc ≈ ${elyteConc.toFixed(3)} M`;
            if (info.speciesId === 'H+')
                content += `<br>Activity($\\mathrm{H}^{+}$) ≈ ${a_H_plus.toFixed(3)}`;
            if (info.speciesId === 'HSO4-')
                content += `<br>Activity($\\mathrm{HSO}_4^{-}$) ≈ ${a_HSO4_minus.toFixed(3)}`;
        }
        // Add electrode info? (No variable SoC here, just material type)
        else if (info.regionIndex === 1) content += `<br>Region: Anode (Pb)`;
        else if (info.regionIndex === 3)
            content += `<br>Region: Cathode (PbO₂)`;
        else if (info.regionIndex === 0 || info.regionIndex === 4)
            content += `<br>Region: Current Collector`;

        return content;
    }

    /** Tooltip callback specific to interface markers */
    _getInterfacePopupContent(identifier, info) {
        // info contains: { markerId, xValue, y1_volt(V_e), y2_volt(V_H+), y1_display, y2_display, currentMode, customArgs, pointEvent }
        const args = info.customArgs || {};
        const reaction = args.reaction || 'Reaction';
        const potentialDiff = args.potential_diff_volt; // This is a check value, should be constant
        const mode = info.currentMode;

        let content = `<b>Interface: ${identifier}</b><br>
                       Reaction: $${reaction}$<br>`;

        // Verify equilibrium (potentialDiff should be constant related to solids)
        if (potentialDiff !== undefined) {
            // V_e = 0.5*(V_H+ + V_HSO4-) + Const_A => 2V_e - V_H+ - V_HSO4 = 2*Const_A
            // V_e = 1.5*V_H+ - 0.5*V_HSO4- + Const_C => 2V_e - 3V_H+ + V_HSO4 = 2*Const_C
            // Displaying the check value might be confusing. Let's just state equilibrium holds.
            content += `Equilibrium holds at this interface.`;
            // content += `<br>Check Value ≈ ${potentialDiff.toFixed(3)} V`;
        }
        // Display the potentials being linked by the marker
        content += `<br>$V_{e^-}$(${mode}) ≈ ${info.y1_display.toFixed(3)}`;
        content += `<br>$V_{H^+}$(${mode}) ≈ ${info.y2_display.toFixed(3)}`; // Assuming marker links V_e and V_H+

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
