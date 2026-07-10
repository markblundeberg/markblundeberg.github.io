// ElectrochemicalSpeciesBandDiagram.js

import { formatPopupBaseContent, rejectUnexpectedFields } from './utils.js';
import BandDiagram from './BandDiagram.js';

// --- Constants ---
const F = 96485.33212331001; // C / mol (Faraday constant)

// curveTypes
const CURVE_TYPES = {
    voltage: {
        name: 'species voltage',
        style: { lineWidth: 3, dasharray: null },
        labelGen: (species) => `V_{${species}}`,
    },
    voltageImplied: {
        name: 'implied voltage',
        style: { lineWidth: 3, dasharray: '3,3' },
        labelGen: (species) => `V_{${species}}`,
    },
    standardState: {
        name: 'standard species voltage',
        style: { lineWidth: 1, dasharray: null },
        labelGen: (species) => `V_{${species}}^\\circ`,
    },
    standardStateImplied: {
        name: 'standard implied voltage',
        style: { lineWidth: 1, dasharray: '3,3' },
        labelGen: (species) => `V_{${species}}^\\circ`,
    },
    bandEdge_C: {
        name: 'conduction band edge',
        style: { lineWidth: 1, dasharray: null },
        labelGen: (species) => `V_{${species}}^{\\text{band}}`,
    },
    bandEdge_V: {
        name: 'valence band edge',
        style: { lineWidth: 1, dasharray: null },
        labelGen: (species) => `V_{${species}}^{\\text{band}}`,
    },
    phi: {
        name: 'electrostatic potential',
        style: { lineWidth: 1, dasharray: '5,5' },
        labelGen: (species) => `\\phi`,
    },
};

/**
 * Creates an interactive Electrochemical Species Band Diagram
 * This is a BandDiagram but with some consistent styling applied on it.
 */
class ElectrochemicalSpeciesBandDiagram {
    // ========================================================================
    // Constructor
    // ========================================================================
    /**
     * Defines the properties for a single species to be plotted.
     * @typedef {object} SpeciesStyle
     * @property {number} z - The charge number of the species (e.g., +1, -1).
     * @property {string} color - The CSS color string (e.g., '#a00', 'red') for traces and labels.
     * @property {string} mathLabel - The KaTeX or LaTeX string for rendering the species' label (e.g., '\\mathrm{Li}^+').
     */

    /**
     * Creates an instance of the ESBD diagram.
     * @param {string} containerId - ID of the HTML element to contain the plot.
     * @param {Object.<string, SpeciesStyle>} speciesInfo - An object mapping unique species IDs (e.g., 'li_ion', 'electron')
     * @param {object} [diagramConfig={}] - Initial configuration options passed to BandDiagram
     */
    constructor(containerId, speciesInfo, diagramConfig = {}) {
        this.diagram = new BandDiagram(containerId, {
            legendLinkHref: '/esbd/reading/', // ESBD speaks the legend's language
            ...diagramConfig,
        });
        try {
            this.speciesInfo = speciesInfo;
            this.diagram.setYLabel('Species Voltage (V)');
            this._tracePopupCallback = formatPopupBaseContent;
            this.diagram.setTracePopupCallback(
                (popupInfo) => this._tracePopupCallbackIntermediary(popupInfo) // binding `this`
            );
        } catch (error) {
            this.diagram.destroy();
            throw error;
        }
    }

    // ========================================================================
    // Public API Methods
    // ========================================================================

    /**
     * Sets the spatial layout using boundaries and region properties. A wrapper for
     * {@link BandDiagram.setSpatialLayout }.
     */
    setSpatialLayout(boundaries, regionProperties, labels = null) {
        this.diagram.setSpatialLayout(boundaries, regionProperties, labels);
    }

    /** Updates the complete set of trace data to be plotted. */
    updateTraceData(traceDefs) {
        const outData = [];
        for (const def of traceDefs) {
            const {
                id,
                speciesId = null,
                curveType,
                color: colorOverride = null,
                style: styleOverride = {},
                showLabel = true,
                label: labelOverride = null,
                labelFrac,
                labelHAlign,
                refShift,
                refShiftFrac,
                hatch = null,
                x,
                y,
                ...extraFields
            } = def;
            rejectUnexpectedFields(extraFields);

            const sInfo = this.speciesInfo[speciesId];
            const curveTypeInfo = CURVE_TYPES[curveType];
            const style = { ...curveTypeInfo.style, ...styleOverride };
            const curveDescription = curveTypeInfo.name;
            const color = colorOverride ?? sInfo?.color ?? 'black';
            const label =
                labelOverride ?? curveTypeInfo.labelGen(sInfo?.mathLabel);

            // Rung hatching, default-on for real standard states and band
            // edges (pass hatch: false to opt out). NOT the implied redox
            // rungs: V°(Ox/Red) has no one-sided concentrated direction —
            // its gap to V_e reads the Ox/Red ratio, both signs meaningful
            // (the symmetry the Gerischer picture spreads into two humps).
            let hatchEff = hatch;
            if (
                hatchEff == null &&
                /^(standardState|bandEdge_C|bandEdge_V)$/.test(curveType)
            )
                hatchEff = true;
            // The hatch texture pictures the 1/(z_i F) rescaling from μ̄°_i
            // (where every species' decade is the same RT·ln10, same side,
            // same slant) into V°_i: yScale = 1/z_i compresses the band and
            // pitch by 1/|z| and tilts the stripes to arctan(1/z), mirrored
            // for anions ('/' vs '\'). The >c° side is up for cations and
            // down for anions (hatch goes *into* the band for e⁻/h⁺ band
            // edges). Caller-specified fields win.
            if (hatchEff && sInfo?.z)
                hatchEff = {
                    side: sInfo.z > 0 ? 'up' : 'down',
                    yScale: 1 / sInfo.z,
                    ...(hatchEff === true ? {} : hatchEff),
                };

            outData.push({
                id: id,
                x: x,
                y: y,
                color: color,
                style: style,
                label: label,
                showLabel: showLabel,
                labelFrac: labelFrac,
                labelHAlign: labelHAlign,
                refShift: refShift,
                refShiftFrac: refShiftFrac,
                hatch: hatchEff,
                extraData: {
                    speciesId: speciesId,
                    curveDescription: curveDescription,
                },
            });
        }
        this.diagram.updateTraceData(outData);
    }

    /**
     * Updates the position and data for a defined vertical marker.
     */
    updateVerticalMarkers(markerData) {
        this.diagram.updateVerticalMarkers(markerData);
    }

    /**
     * Sets the vertical range (domain) of the Y axis, in Volts
     * @param {number} min - Minimum value for the Y axis.
     * @param {number} max - Maximum value for the Y axis.
     */
    setVRange(min, max) {
        this.diagram.setYRange(min, max);
    }

    /** See {@link BandDiagram.setCustomDrawCallback}. The callback receives the
     * underlying BandDiagram (with customGroup, scales, drawElements, transition). */
    setCustomDrawCallback(callbackFn) {
        this.diagram.setCustomDrawCallback(callbackFn);
    }

    /** Registers a callback function to generate verbose popup content for data traces. */
    setTracePopupCallback(callbackFn) {
        this._tracePopupCallback =
            typeof callbackFn === 'function'
                ? callbackFn
                : formatPopupBaseContent; // Use base formatter if null/invalid
    }

    // ========================================================================
    // Public Accessors (Getters)
    // ========================================================================

    // ========================================================================
    // Private Calculation/Utility Helpers
    // ========================================================================

    _tracePopupCallbackIntermediary(popupInfo) {
        const ted = popupInfo.traceExtraData;
        const expandedPopupInfo = {
            speciesId: ted.speciesId,
            curveDescription: ted.curveDescription,
            ...popupInfo,
        };
        return this._tracePopupCallback(expandedPopupInfo);
    }

    // ========================================================================
    // Destroy Method
    // ========================================================================

    /** Cleans up resources like observers and listeners. */
    destroy() {
        this.diagram.destroy();
    }
} // End of class

export default ElectrochemicalSpeciesBandDiagram;
