// LiIonBatteryComponent.js
// Component for displaying an ESBD of a Li-ion battery at equilibrium (OCV).

import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';
import { throttle } from './utils.js';

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
     */
    constructor(containerSelector, componentConfig) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(
                `Container element ${containerSelector} not found.`
            );
        }
        this.transitionDuration = 500;
        this.throttleDuration = 100;

        this.config = componentConfig;
        this.diagram = null;
        this.plotDivId = `esbd-plot-${Math.random().toString(36).substring(2, 9)}`;

        this.currentSoCPercent = Math.max(
            0,
            Math.min(100, componentConfig.initialSoCPercent ?? 50)
        );
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
        const instanceId = this.plotDivId;
        const socSliderId = `soc-${instanceId}`;
        const voltageOutputId = `volt-out-${instanceId}`; // Give output an ID
        this.container.innerHTML = `
            <div class="plot-container" id="${this.plotDivId}""></div>
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
            </div>
        `;
    }

    /** Finds references to the dynamically created DOM elements */
    _findInternalElements() {
        this.socSlider = this.container.querySelector('.soc-slider');
        this.socValue = this.container.querySelector('.soc-value');
        this.cellVoltageOut = this.container.querySelector('.cell-voltage');
        this.plotDiv = this.container.querySelector('.plot-container');
    }

    /** Sets up the ESBD instance */
    _setupESBD() {
        if (!this.plotDiv) throw new Error('Plot container div not found.');
        this.diagram = new ElectrochemicalSpeciesBandDiagram(this.plotDivId, {
            height: this.config.plotHeight,
            transitionDuration: this.transitionDuration,
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

        this.diagram.addVerticalMarker('anode_eq', {
            symbol: '⇌', // Or use config.anode.symbol?
            speciesId1: 'electron', // Corresponds to y1 in update call (V_e_anode)
            speciesId2: 'li+', // Corresponds to y2 in update call (V_Li_plus_elyte)
            popupCallback: this._getAnodeEqPopup.bind(this), // Dedicated callback
        });
        this.diagram.addVerticalMarker('cathode_eq', {
            symbol: '⇌',
            speciesId1: 'electron', // Corresponds to y1 (V_e_cathode)
            speciesId2: 'li+', // Corresponds to y2 (V_Li_plus_elyte)
            popupCallback: this._getCathodeEqPopup.bind(this), // Dedicated callback
        });
    }

    /** Attaches event listeners to controls */
    _attachListeners() {
        this.socSlider.addEventListener(
            'input',
            throttle(() => this.updateDiagram(), this.throttleDuration)
        );
    }

    /** Reads inputs, calculates state, updates diagram and outputs */
    updateDiagram() {
        if (!this.diagram) {
            return;
        } // Don't update if diagram failed to init

        // Read current state from UI controls
        if (this.socSlider)
            this.currentSoCPercent = parseFloat(this.socSlider.value);
        // Update UI displays
        if (this.socValue)
            this.socValue.textContent = this.currentSoCPercent.toFixed(0);

        try {
            // Calculate the new state
            const { traceDefs, calculatedVoltage } = this._calculateState(
                this.currentSoCPercent,
                this.config
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
    _calculateState(socPercent, config) {
        const x_anode = (socPercent + 5) / 105.0;
        const y_cathode = 1.0 - x_anode;

        // Store calculated values for popup use
        this.currentXAnode = x_anode;
        this.currentYCathode = y_cathode;

        const OCV_anode = config.anode_ocv.func(x_anode);
        const OCV_cathode = config.cathode_ocv.func(y_cathode);
        const cell_voltage = OCV_cathode - OCV_anode;

        // Calculate Primary Potential Lines (V_e, V_Li+) ---
        const V_e_anode = 0;
        const V_Li_plus_elyte = -OCV_anode;
        const V_e_cathode = V_e_anode + cell_voltage;

        // Prepare trace definitions ---
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
            xRange: { min: b[1], max: b[6] },
            x: [b[1], b[6]],
            y: [V_Li_plus_elyte, V_Li_plus_elyte],
        });

        const anodePopupData = {
            reaction:
                '\\mathrm{Li(graphite)} \\rightleftharpoons \\mathrm{Li}^+ + \\mathrm{e}^-',
            ocv: OCV_anode,
            x: this.currentXAnode, // Pass lithiation state
        };
        this.diagram.updateVerticalMarker('anode_eq', {
            x: 0.5 * (b[1] + b[2]), // Anode/Elyte1 interface boundary index
            y1: V_e_anode, // Electron potential (speciesId1 = 'electron')
            y2: V_Li_plus_elyte, // Li+ potential (speciesId2 = 'li+')
            inputUnits: 'V_volt', // Units of potentials passed
            popupArgs: anodePopupData,
        });

        const cathodePopupData = {
            reaction:
                '\\mathrm{Li(oxide)} \\rightleftharpoons \\mathrm{Li}^+ + \\mathrm{e}^-',
            ocv: OCV_cathode,
            y: this.currentYCathode, // Pass lithiation state
        };
        this.diagram.updateVerticalMarker('cathode_eq', {
            x: 0.5 * (b[5] + b[6]), // Elyte2/Cathode interface boundary index
            y1: V_e_cathode, // Electron potential (speciesId1 = 'electron')
            y2: V_Li_plus_elyte, // Li+ potential (speciesId2 = 'li+')
            inputUnits: 'V_volt',
            popupArgs: cathodePopupData,
        });

        return { traceDefs, calculatedVoltage: cell_voltage };
    }

    _getAnodeEqPopup(info) {
        // info contains: { markerId, xValue, y1_volt, y2_volt, y1_display, y2_display, currentMode, customArgs, pointEvent }
        const args = info.customArgs;
        const diff_display = info.y1_display - info.y2_display; // V_e - V_Li+ in current units
        const mode = info.currentMode;
        const unit = mode === 'kJmol' ? 'kJ/mol' : mode;

        let content = `<b>Anode Interface Equilibrium</b><br>
                       Reaction: $${args.reaction}$<br>`;
        if (args.ocv !== undefined) {
            content += `OCV vs Li/Li⁺ ≈ ${args.ocv.toFixed(3)} V<br>`;
            // Display difference in current units, note V_e - V_Li+ = OCV
            content += `Δ(${mode}) = $${info.labelString || 'V_e - V_{Li^+}'}$ ≈ ${diff_display.toFixed(3)} ${unit}`;
        }
        if (args.x !== undefined) {
            content += `<br>Anode Lithiation x = ${args.x.toFixed(3)}`;
        }
        return content;
    }

    _getCathodeEqPopup(info) {
        // info contains: { markerId, xValue, y1_volt, y2_volt, y1_display, y2_display, currentMode, customArgs, pointEvent }
        const args = info.customArgs;
        const diff_display = info.y1_display - info.y2_display; // V_e - V_Li+ in current units
        const mode = info.currentMode;
        const unit = mode === 'kJmol' ? 'kJ/mol' : mode;

        let content = `<b>Cathode Interface Equilibrium</b><br>
                       Reaction: $${args.reaction}$<br>`;
        if (args.ocv !== undefined) {
            content += `OCV vs Li/Li⁺ ≈ ${args.ocv.toFixed(3)} V<br>`;
            content += `Δ(${mode}) = $${info.labelString || 'V_e - V_{Li^+}'}$ ≈ ${diff_display.toFixed(3)} ${unit}`;
        }
        if (args.y !== undefined) {
            content += `<br>Cathode Lithiation y = ${args.y.toFixed(3)}`;
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
