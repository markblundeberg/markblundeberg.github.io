// ConcentrationCellComponent.js
// Encapsulates the logic and UI for an interactive concentration cell ESBD.

import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';
import { formatPopupBaseContent, throttle } from './utils.js';

// --- Physical Constants ---
const R = 8.31446; // J / (mol K)
const F = 96485.3; // C / mol
const TEMP_K = 298.15; // Kelvin
const RT_F = (R * TEMP_K) / F; // Approx 0.02569 V

class ConcentrationCellComponent {
    /**
     * Creates and manages a concentration cell diagram instance.
     * @param {string} containerSelector - CSS selector for the parent div element.
     * @param {object} cellConfig - Configuration object defining the cell chemistry, layout, etc.
     */
    constructor(containerSelector, cellConfig) {
        this.config = cellConfig;
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(
                `Container element ${containerSelector} not found.`
            );
        }
        this.throttleDuration = 100;

        this.diagram = null;
        this.plotDivId = `esbd-plot-${Math.random().toString(36).substring(2, 9)}`;
        this.junctionSelectorName = `junction-${this.plotDivId}`;

        this.currentC1 = cellConfig.initialC1 || 0.1;
        this.currentC2 = cellConfig.initialC2 || 1.0;
        this.junctionType = cellConfig.initialJunction || 'saltbridge';

        try {
            this._createInternalHTML();
            this._findInternalElements();
            this._setupESBD();
            this._attachListeners();
            this.updateDiagram();
        } catch (error) {
            this.container.innerHTML = `<p style="color: red;">Error initializing diagram component: ${error.message}</p>`;
            throw error;
        }
    }

    /** Creates the HTML structure for controls and plot */
    _createInternalHTML() {
        const config = this.config;
        // Generate unique IDs for elements needing association
        const c1SliderId = `c1-${this.plotDivId}`;
        const c2SliderId = `c2-${this.plotDivId}`;
        const anionId = `anion-${this.plotDivId}`;
        const sbId = `sb-${this.plotDivId}`;
        const cationId = `cation-${this.plotDivId}`;
        const voltageOutputId = `volt-out-${this.plotDivId}`; // ID for output element

        // Note: Using classes for elements that JS needs to find within the component instance
        this.container.innerHTML = `
            <div class="bd-container" id="${this.plotDivId}" "></div>
            <div class="controls esbd-controls">
                <div class="control-row">
                    <label class="control-label" for="${c1SliderId}">Concentration C₁ (Left, M):</label>
                    <input type="range" class="c1-slider" id="${c1SliderId}" min="${config.cMin || 0.001}" max="${config.cMax || 2.0}" step="0.001" value="${this.currentC1}">
                    <output class="c1-value">${this.currentC1.toFixed(3)}</output> M
                </div>
                <div class="control-row">
                    <label class="control-label" for="${c2SliderId}">Concentration C₂ (Right, M):</label>
                    <input type="range" class="c2-slider" id="${c2SliderId}" min="${config.cMin || 0.001}" max="${config.cMax || 2.0}" step="0.001" value="${this.currentC2}">
                    <output class="c2-value">${this.currentC2.toFixed(3)}</output> M
                </div>
                 
                 <fieldset class="control-row radio-group" style="border: none; padding: 0; margin: 0; margin-bottom: 8px;">
                    <legend class="control-label" style="padding: 0; margin-right: 10px; float: left; width: 200px; text-align: right;">Junction type (ideal):</legend>
                    <div style="display: inline-block;">
                    <input type="radio" value="anion" name="${this.junctionSelectorName}" id="${anionId}" ${this.junctionType === 'anion' ? 'checked' : ''}>
                        <label for="${anionId}" style="min-width: initial; margin-left: 2px; margin-right: 10px; font-weight: normal;">Anion membrane</label>
                        
                    <input type="radio" value="saltbridge" name="${this.junctionSelectorName}" id="${sbId}" ${this.junctionType === 'saltbridge' ? 'checked' : ''}>
                        <label for="${sbId}" style="min-width: initial; margin-left: 2px; margin-right: 10px; font-weight: normal;">Salt bridge</label>
                        
                    <input type="radio" value="cation" name="${this.junctionSelectorName}" id="${cationId}" ${this.junctionType === 'cation' ? 'checked' : ''}>
                        <label for="${cationId}" style="min-width: initial; margin-left: 2px; margin-right: 10px; font-weight: normal;">Cation membrane</label>
                </div>
                 </fieldset>

                <div class="control-row">
                    <label class="control-label" for="${voltageOutputId}">Calculated Cell Voltage:</label>
                    <output class="cell-voltage" id="${voltageOutputId}">?.???</output> V
                </div>
            </div>
        `;
    }

    /** Finds references to the dynamically created DOM elements */
    _findInternalElements() {
        this.c1Slider = this.container.querySelector('.c1-slider');
        this.c1Value = this.container.querySelector('.c1-value');
        this.c2Slider = this.container.querySelector('.c2-slider');
        this.c2Value = this.container.querySelector('.c2-value');
        this.junctionRadios = this.container.querySelectorAll(
            `input[type="radio"][name="${this.junctionSelectorName}"]`
        );
        this.cellVoltageOut = this.container.querySelector('.cell-voltage');
        this.plotDiv = this.container.querySelector('.bd-container'); // Found by class
    }

    /** Sets up the ESBD instance */
    _setupESBD() {
        if (!this.plotDiv) throw new Error('Plot container div not found.');
        this.diagram = new ElectrochemicalSpeciesBandDiagram(
            this.plotDivId,
            {
                cation: this.config.cation,
                anion: this.config.anion,
                electron: this.config.electron,
            },
            {}
        );

        // Set layout
        this.diagram.setSpatialLayout(
            this.config.boundaries,
            this.config.regionProps
        );

        // Set general tooltip callback (for lines)
        this.diagram.setTracePopupCallback(
            this._getTracePopupContent.bind(this)
        );

        if (this.config.VRange) {
            this.diagram.setVRange(
                this.config.VRange[0],
                this.config.VRange[1]
            );
        }
    }

    /** Attaches event listeners to controls */
    _attachListeners() {
        // Check elements exist before adding listeners
        if (this.c1Slider)
            this.c1Slider.addEventListener(
                'input',
                throttle(() => this.updateDiagram(), this.throttleDuration)
            );
        if (this.c2Slider)
            this.c2Slider.addEventListener(
                'input',
                throttle(() => this.updateDiagram(), this.throttleDuration)
            );
        if (this.junctionRadios && this.junctionRadios.length > 0) {
            this.junctionRadios.forEach((radio) => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        this.junctionType = radio.value; // Update internal state
                        this.updateDiagram(); // Trigger redraw
                    }
                });
            });
        } else {
            console.warn(
                `Junction selector radios not found for component in ${this.container.id || this.containerSelector}`
            );
        }
    }

    /** Reads inputs, calculates state, updates diagram and outputs */
    updateDiagram() {
        // Ensure elements are available
        if (
            !this.c1Slider ||
            !this.c2Slider ||
            !this.c1Value ||
            !this.c2Value ||
            !this.cellVoltageOut ||
            !this.diagram
        ) {
            console.error(
                'Cannot update component: Missing internal elements or diagram instance.'
            );
            return;
        }
        // Read current state from UI controls within this instance
        this.currentC1 = parseFloat(this.c1Slider.value);
        this.currentC2 = parseFloat(this.c2Slider.value);
        // Junction type is updated by its listener directly to this.junctionType

        // Update UI displays
        this.c1Value.textContent = this.currentC1.toFixed(3);
        this.c2Value.textContent = this.currentC2.toFixed(3);

        try {
            // Calculate the new state
            const { traceDefs, calculatedVoltage } = this._calculateState(
                this.currentC1,
                this.currentC2,
                this.junctionType,
                this.config
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

    /** Calculation logic specific to concentration cell */
    _calculateState(c1, c2, junctionType, config) {
        const cation = config.cation;
        const anion = config.anion;
        const compound = config.compound_stoichiometry;
        const mu_electrode = config.electrode_neutral.mu_J_mol;
        const C_STD = config.c_std_M;

        // Check compound neutrality (solutions must be charge neutral!)
        if (compound.cation * cation.z + compound.anion * anion.z !== 0) {
            throw 'non-neutral compound; fix stoichiometry';
        }

        // Ensure concentrations are positive, calculate ideal molar activities
        c1 = Math.max(c1, 1e-9);
        c2 = Math.max(c2, 1e-9);
        const a_c1 = (compound.cation * c1) / C_STD;
        const a_a1 = (compound.anion * c1) / C_STD;
        const a_c2 = (compound.cation * c2) / C_STD;
        const a_a2 = (compound.anion * c2) / C_STD;

        // Calculate Nernst potential term offset: (RT/zF) * ln(a)
        // This is the offset between V_STD_i and V_i
        const nernst_cation1 = (RT_F / cation.z) * Math.log(a_c1);
        const nernst_cation2 = (RT_F / cation.z) * Math.log(a_c2);
        const nernst_anion1 = (RT_F / anion.z) * Math.log(a_a1);
        const nernst_anion2 = (RT_F / anion.z) * Math.log(a_a2);

        // Electrode reaction M^n+ + n e- <-> M
        // (1/z)mu_cation+ + mu_e- = (1/z)mu_electrode   (divide by z of cation)
        // V_cation - V_e- = (1/zF)mu_electrode          (divide by F)
        const V_reaction = mu_electrode / (cation.z * F);

        // Calculate standard state potentials V^⊖ = μ^⊖ / (zF),  (relative to phi)
        const iV_STD_cation = cation.mu_standard_J_mol / (cation.z * F);
        const iV_STD_anion = anion.mu_standard_J_mol / (anion.z * F);
        // Only the difference between them will matter:
        const V_STD_span = iV_STD_cation - iV_STD_anion;

        // Now, calculate all the levels. We work our way from left to right.

        // (Region 0) Set left electrode as ground reference:
        const V_e_1 = 0;

        // (Region 1) left side solution:
        const V_cation_1 = V_e_1 + V_reaction;
        const V_STD_cation_1 = V_cation_1 - nernst_cation1;
        const V_STD_anion_1 = V_STD_cation_1 - V_STD_span;
        const V_anion_1 = V_STD_anion_1 + nernst_anion1;

        // (~Region 2) The effect of the junction:
        // For simplicity, we'll calculate the jump between V_cation_1 and V_cation_2
        // Note:
        // cell_voltage == V_e_2 - V_e_1 == V_cation_2 - V_cation_1 within numerical error
        let cell_voltage = 0;
        switch (junctionType) {
            case 'cation':
                cell_voltage = 0;
                break;
            case 'saltbridge':
                cell_voltage = nernst_cation2 - nernst_cation1;
                break;
            case 'anion':
                cell_voltage =
                    nernst_cation2 -
                    nernst_cation1 +
                    nernst_anion1 -
                    nernst_anion2;
                break;
            default:
                throw `Unknown junction type: ${junctionType}`;
        }

        // (Region 3) right side solution:
        const V_cation_2 = V_cation_1 + cell_voltage;
        const V_STD_cation_2 = V_cation_2 - nernst_cation2;
        const V_STD_anion_2 = V_STD_cation_2 - V_STD_span;
        const V_anion_2 = V_STD_anion_2 + nernst_anion2;

        // (Region 4) Right electrode:
        const V_e_2 = V_cation_2 - V_reaction;

        // --- Prepare trace definitions ---
        const b = config.boundaries;
        const mid = 0.5 * (b[2] + b[3]);
        const traceDefs = [
            {
                id: `cation_potential_1_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'potential',
                showLabel: true,
                x: [b[1], junctionType == 'cation' ? mid : b[2]],
                y: [V_cation_1, V_cation_1],
            },
            {
                id: `cation_potential_2_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'potential',
                showLabel: true,
                x: [junctionType == 'cation' ? mid : b[3], b[4]],
                y: [V_cation_2, V_cation_2],
            },
            {
                id: `cation_standard_1_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'standardState',
                showLabel: false,
                x: [b[1], b[2]],
                y: [V_STD_cation_1, V_STD_cation_1],
            },
            {
                id: `cation_standard_2_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'standardState',
                showLabel: false,
                x: [b[3], b[4]],
                y: [V_STD_cation_2, V_STD_cation_2],
            },
            {
                id: `anion_potential_1_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'potential',
                showLabel: true,
                x: [b[1], junctionType == 'anion' ? mid : b[2]],
                y: [V_anion_1, V_anion_1],
            },
            {
                id: `anion_potential_2_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'potential',
                showLabel: true,
                x: [junctionType == 'anion' ? mid : b[3], b[4]],
                y: [V_anion_2, V_anion_2],
            },
            {
                id: `anion_standard_1_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'standardState',
                showLabel: false,
                x: [b[1], b[2]],
                y: [V_STD_anion_1, V_STD_anion_1],
            },
            {
                id: `anion_standard_2_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'standardState',
                showLabel: false,
                x: [b[3], b[4]],
                y: [V_STD_anion_2, V_STD_anion_2],
            },
            {
                id: `e_electrode1_${this.plotDivId}`,
                speciesId: 'electron',
                curveType: 'potential',
                showLabel: true,
                x: [b[0], b[1]],
                y: [V_e_1, V_e_1],
            },
            {
                id: `e_electrode2_${this.plotDivId}`,
                speciesId: 'electron',
                curveType: 'potential',
                showLabel: true,
                x: [b[4], b[5]],
                y: [V_e_2, V_e_2],
            },
        ];

        const leftpopupArgs = {
            reaction: `${cation.mathLabel} + ${cation.z}\\mathrm{e}^{-} \\rightleftharpoons \\mathrm{Ag(s)}`, // General form
            potential_diff_volt: V_cation_1 - V_e_1, // Should be V_reaction (approx 0)
            interfaceName: 'Electrode 1 / Elyte 1',
        };
        const rightpopupArgs = {
            reaction: `${cation.mathLabel} + ${cation.z}\\mathrm{e}^{-} \\rightleftharpoons \\mathrm{Ag(s)}`,
            potential_diff_volt: V_cation_2 - V_e_2, // Should be V_reaction (approx 0)
            interfaceName: 'Elyte 2 / Electrode 2',
        };
        this.diagram.updateVerticalMarkers([
            {
                id: 'left_interface_eq',
                symbol: '⇌',
                x: b[1],
                yDefs: [{ y: V_e_1 }, { y: V_cation_1 }],
                popupCallback: this._getInterfacePopupContent.bind(
                    this,
                    'Left Electrode'
                ),
                popupArgs: leftpopupArgs,
            },
            {
                id: 'right_interface_eq',
                symbol: '⇌',
                x: b[4],
                yDefs: [{ y: V_e_2 }, { y: V_cation_2 }],
                popupCallback: this._getInterfacePopupContent.bind(
                    this,
                    'Right Electrode'
                ),
                popupArgs: rightpopupArgs,
            },
        ]);

        return { traceDefs, calculatedVoltage: cell_voltage };
    }

    _getTracePopupContent(info) {
        // Start with the default tooltip, to which we will append (as appropriate)
        let content = formatPopupBaseContent(info);

        let conc = null;
        let activity = null;
        // Determine concentration based on region index
        if (info.regionIndex === 1) {
            // Electrolyte 1
            conc = parseFloat(this.c1Slider.value);
        } else if (info.regionIndex === 3) {
            // Electrolyte 2
            conc = parseFloat(this.c2Slider.value);
        }

        // Calculate activity only if it's an ion and concentration is known
        if (
            (info.speciesId === 'cation' || info.speciesId === 'anion') &&
            conc !== null
        ) {
            const species = this.config[info.speciesId];
            const nu = this.config.compound_stoichiometry[info.speciesId];
            activity = (nu * conc) / this.config.c_std_M;
            content += `<br>Formal Conc ≈ ${conc.toFixed(3)} M`;
            content += `<br>Activity($${species.mathLabel}$) ≈ ${activity.toFixed(3)}`;
        }
        return content;
    }

    /**
     * Generates tooltip content for the electrode interface equilibrium markers.
     * @param {string} identifier - 'Left Electrode' or 'Right Electrode'.
     * @param {object} info - The markerTooltipInfo object from ESBD module.
     */
    _getInterfacePopupContent(identifier, info) {
        // info contains: { markerId, xValue, y1_volt(V_e), y2_volt(V_cation), y1_display, y2_display, currentMode, customArgs, pointEvent }
        const args = info.customArgs || {};
        const reaction =
            args.reaction ||
            `${this.config.cation.mathLabel} + ${this.config.cation.z}e^- \\rightleftharpoons \\text{Electrode}`;
        const potentialDiff = args.potential_diff_volt; // V_cation - V_e = V_reaction
        const mode = info.currentMode;

        let content = `<b>Interface: ${identifier}</b><br>
                       Reaction: $${reaction}$<br>`;

        // Display the equilibrium condition V_cation - V_e = V_reaction
        if (potentialDiff !== undefined) {
            content += `Equilibrium: $V_{${this.config.cation.mathLabel}} - V_{\\mathrm{e}^{-}} = ${potentialDiff.toFixed(3)}$ V`;
            // Explain if V_reaction is zero
            if (Math.abs(potentialDiff) < 1e-6) {
                content += ` (\$= \\mu_{\\mathrm{${this.config.cation.mathLabel.replace('+', '')}(s)}} / ${this.config.cation.z}F = 0\$)`;
            } else {
                content += ` (\$= \\mu_{\\text{electrode}} / nF\$)`;
            }
        }

        // Optionally show the difference in current display units
        // const diff_display = info.y2_display - info.y1_display; // V_cation - V_e in current units
        // const unit = mode === 'kJmol' ? 'kJ/mol' : mode;
        // content += `<br>Displayed Δ(${mode}) ≈ ${diff_display.toFixed(3)} ${unit}`;

        return content;
    }

    /** Cleanup method */
    destroy() {
        if (this.diagram) this.diagram.destroy();
        // Remove listeners if needed (though removing elements might suffice)
        this.container.innerHTML = ''; // Clear generated content
    }
}

// Export the class
export default ConcentrationCellComponent;
