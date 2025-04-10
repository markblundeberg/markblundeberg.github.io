// ConcentrationCellComponent.js
// Encapsulates the logic and UI for an interactive concentration cell ESBD.

import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';
import { formatTooltipBaseContent } from './utils.js'; // Assuming utils.js exists

// --- Physical Constants ---
// Moved here or could be in utils.js
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
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error(
                `ConcentrationCellComponent Error: Container "${containerSelector}" not found.`
            );
            // Consider throwing an error or returning early
            throw new Error(
                `Container element ${containerSelector} not found.`
            );
        }
        this.cellConfig = cellConfig; // Store config
        this.diagram = null; // ESBD instance
        this.plotDivId = `esbd-plot-${Math.random().toString(36).substring(2, 9)}`; // Unique ID for plot container
        this.junctionSelectorName = `junction-${this.plotDivId}`; // Unique name for radio group

        // Initialize state from config or defaults
        this.currentC1 = cellConfig.initialC1 || 0.1;
        this.currentC2 = cellConfig.initialC2 || 1.0;
        this.junctionType = cellConfig.initialJunction || 'saltbridge';

        try {
            this._createInternalHTML(); // Generate controls and plot div
            this._findInternalElements(); // Find the generated elements
            this._setupESBD(); // Create the diagram instance
            this._attachListeners(); // Attach listeners to controls
            this.updateDiagram(); // Perform initial calculation and draw
            console.log(
                `ConcentrationCellComponent initialized in ${containerSelector}`
            );
        } catch (error) {
            console.error(
                `Error initializing ConcentrationCellComponent in ${containerSelector}:`,
                error
            );
            // Display error in the container?
            this.container.innerHTML = `<p style="color: red;">Error initializing diagram component.</p>`;
        }
    }

    /** Creates the necessary HTML structure within the container */
    _createInternalHTML() {
        const config = this.cellConfig;
        // Generate unique IDs for label 'for' attributes if needed
        const c1SliderId = `c1-${this.plotDivId}`; // Reuse plot id for uniqueness prefix
        const c2SliderId = `c2-${this.plotDivId}`;
        const anionId = `anion-${this.plotDivId}`;
        const sbId = `sb-${this.plotDivId}`;
        const cationId = `cation-${this.plotDivId}`;
        const modeSelectId = `mode-${this.plotDivId}`;

        // Note: Using classes for elements that JS needs to find within the component instance
        this.container.innerHTML = `
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
                 <div class="control-row radio-group">
                    <label class="control-label">Junction Type:</label>
                    <input type="radio" value="anion" name="${this.junctionSelectorName}" id="${anionId}" ${this.junctionType === 'anion' ? 'checked' : ''}>
                    <label for="${anionId}">Anion Membrane (Ideal)</label>
                    <input type="radio" value="saltbridge" name="${this.junctionSelectorName}" id="${sbId}" ${this.junctionType === 'saltbridge' ? 'checked' : ''}>
                    <label for="${sbId}">Salt Bridge (Ideal)</label>
                    <input type="radio" value="cation" name="${this.junctionSelectorName}" id="${cationId}" ${this.junctionType === 'cation' ? 'checked' : ''}>
                    <label for="${cationId}">Cation Membrane (Ideal)</label>
                </div>
                <div class="control-row">
                    <label class="control-label">Calculated Cell Voltage:</label>
                    <output class="cell-voltage">?.???</output> V
                </div>
                 <div class="control-row">
                    <label class="control-label" for="${modeSelectId}">Display Mode:</label>
                    <select class="mode-selector" id="${modeSelectId}" style="margin-left: 10px;">
                         <option value="Volts" selected>Volts</option>
                         <option value="eV">eV</option>
                         <option value="kJmol">kJ/mol</option>
                    </select>
                </div>
            </div>
            <div class="plot-container" id="${this.plotDivId}" style="width:100%; height:${config.plotHeight || 250}px; border: 1px solid #ddd; margin-top: 10px;"></div>
        `;
    }

    /** Finds references to the dynamically created DOM elements within this component */
    _findInternalElements() {
        this.c1Slider = this.container.querySelector('.c1-slider');
        this.c1Value = this.container.querySelector('.c1-value');
        this.c2Slider = this.container.querySelector('.c2-slider');
        this.c2Value = this.container.querySelector('.c2-value');
        this.junctionRadios = this.container.querySelectorAll(
            `input[type="radio"][name="${this.junctionSelectorName}"]`
        );
        this.cellVoltageOut = this.container.querySelector('.cell-voltage');
        this.modeSelector = this.container.querySelector('.mode-selector');
        this.plotDiv = this.container.querySelector('.plot-container'); // Found by class
    }

    /** Sets up the ESBD instance */
    _setupESBD() {
        this.diagram = new ElectrochemicalSpeciesBandDiagram(this.plotDivId, {
            height: this.cellConfig.plotHeight, // Pass height config to ESBD
            // Pass other ESBD config if needed
        });
        // Add species info using this.cellConfig
        this.diagram.addSpeciesInfo('cation', this.cellConfig.cation);
        this.diagram.addSpeciesInfo('anion', this.cellConfig.anion);
        this.diagram.addSpeciesInfo('electron', this.cellConfig.electron);
        // Set layout
        this.diagram.setSpatialLayout(
            this.cellConfig.boundaries,
            this.cellConfig.regionProps
        );
        // Set tooltip callback (binding 'this' to maintain context)
        this.diagram.setTooltipCallback(this._getTooltipContent.bind(this));
    }

    /** Attaches event listeners to controls */
    _attachListeners() {
        // Check elements exist before adding listeners
        if (this.c1Slider)
            this.c1Slider.addEventListener('input', () => this.updateDiagram());
        if (this.c2Slider)
            this.c2Slider.addEventListener('input', () => this.updateDiagram());
        if (this.modeSelector)
            this.modeSelector.addEventListener('change', (e) =>
                this.diagram.setMode(e.target.value)
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
                this.cellConfig // Pass config to calculation method
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
        // This logic is identical to the previous calculateState function
        // It now uses 'config' argument instead of global cellConfig
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
        const traceDefs = [
            {
                id: `cation_potential_1_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'potential',
                showLabel: true,
                inputUnits: 'V_volt',
                xRange: { min: b[1], max: b[2] },
                x: [b[1], b[2]],
                y: [V_cation_1, V_cation_1],
            },
            {
                id: `cation_potential_2_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'potential',
                showLabel: true,
                inputUnits: 'V_volt',
                xRange: { min: b[3], max: b[4] },
                x: [b[3], b[4]],
                y: [V_cation_2, V_cation_2],
            },
            {
                id: `cation_standard_1_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'standardState',
                showLabel: false,
                inputUnits: 'V_volt',
                xRange: { min: b[1], max: b[2] },
                x: [b[1], b[2]],
                y: [V_STD_cation_1, V_STD_cation_1],
            },
            {
                id: `cation_standard_2_${this.plotDivId}`,
                speciesId: 'cation',
                curveType: 'standardState',
                showLabel: false,
                inputUnits: 'V_volt',
                xRange: { min: b[3], max: b[4] },
                x: [b[3], b[4]],
                y: [V_STD_cation_2, V_STD_cation_2],
            },
            {
                id: `anion_potential_1_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'potential',
                showLabel: true,
                inputUnits: 'V_volt',
                xRange: { min: b[1], max: b[2] },
                x: [b[1], b[2]],
                y: [V_anion_1, V_anion_1],
            },
            {
                id: `anion_potential_2_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'potential',
                showLabel: true,
                inputUnits: 'V_volt',
                xRange: { min: b[3], max: b[4] },
                x: [b[3], b[4]],
                y: [V_anion_2, V_anion_2],
            },
            {
                id: `anion_standard_1_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'standardState',
                showLabel: false,
                inputUnits: 'V_volt',
                xRange: { min: b[1], max: b[2] },
                x: [b[1], b[2]],
                y: [V_STD_anion_1, V_STD_anion_1],
            },
            {
                id: `anion_standard_2_${this.plotDivId}`,
                speciesId: 'anion',
                curveType: 'standardState',
                showLabel: false,
                inputUnits: 'V_volt',
                xRange: { min: b[3], max: b[4] },
                x: [b[3], b[4]],
                y: [V_STD_anion_2, V_STD_anion_2],
            },
            {
                id: `e_electrode1_${this.plotDivId}`,
                speciesId: 'electron',
                curveType: 'potential',
                showLabel: true,
                inputUnits: 'V_volt',
                xRange: { min: b[0], max: b[1] },
                x: [b[0], b[1]],
                y: [V_e_1, V_e_1],
            },
            {
                id: `e_electrode2_${this.plotDivId}`,
                speciesId: 'electron',
                curveType: 'potential',
                showLabel: true,
                inputUnits: 'V_volt',
                xRange: { min: b[4], max: b[5] },
                x: [b[4], b[5]],
                y: [V_e_2, V_e_2],
            },
        ];

        return { traceDefs, calculatedVoltage: cell_voltage };
    }

    _getTooltipContent(info) {
        // Start with the default tooltip, to which we will append (as appropriate)
        let content = formatTooltipBaseContent(info);

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
            const species = this.cellConfig[info.speciesId];
            const nu = this.cellConfig.compound_stoichiometry[info.speciesId];
            activity = (nu * conc) / this.cellConfig.c_std_M;
            content += `<br>Formal Conc ≈ ${conc.toFixed(3)} M`;
            content += `<br>Activity($${species.latexPrettyName}$) ≈ ${activity.toFixed(3)}`;
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

// Export the class to be used by app.js
export default ConcentrationCellComponent;
