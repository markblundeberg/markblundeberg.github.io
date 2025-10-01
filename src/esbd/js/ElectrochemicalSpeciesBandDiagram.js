// ElectrochemicalSpeciesBandDiagram.js

import { formatPopupBaseContent } from './utils.js';
import BandDiagram from './BandDiagram.js';

// --- Constants ---
const F = 96485.33212331001; // C / mol (Faraday constant)

// curveTypes
const CURVE_TYPES = {
    voltage: {
        name: 'species voltage',
        style: { lineWidth: 3, dasharray: null },
    },
    voltageImplied: {
        name: 'implied species voltage',
        style: { lineWidth: 3, dasharray: '3,3' },
    },
    standardState: {
        name: 'standard state voltage',
        style: { lineWidth: 1, dasharray: null },
    },
    bandEdge_C: {
        name: 'conduction band edge',
        style: { lineWidth: 2, dasharray: '4,2' },
    },
    bandEdge_V: {
        name: 'valence band edge',
        style: { lineWidth: 2, dasharray: '4,2' },
    },
    phi: {
        name: 'electrostatic potential',
        style: { lineWidth: 1, dasharray: '5,5' },
    },
    other: { name: 'unknown', style: { lineWidth: 1, dasharray: null } },
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
        this.diagram = new BandDiagram(containerId, diagramConfig);
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
    setSpatialLayout(boundaries, regionProperties) {
        this.diagram.setSpatialLayout(boundaries, regionProperties);
    }

    /** Updates the complete set of trace data to be plotted. */
    updateTraceData(traceDefs) {
        const outData = [];
        for (const def of traceDefs) {
            const {
                id,
                speciesId = null,
                curveType,
                style: styleOverride = {},
                showLabel = true,
                labelOverride = null,
                x,
                y,
                ...extraFields
            } = def;
            if (Object.keys(extraFields).length > 0) {
                const unexpectedKeys = Object.keys(extraFields).join(', ');
                throw new Error(
                    `Unexpected fields were provided: ${unexpectedKeys}`
                );
            }

            const sInfo = this.speciesInfo[speciesId];
            const curveTypeInfo = CURVE_TYPES[curveType];
            const style = { ...curveTypeInfo.style, ...styleOverride };
            const curveDescription = curveTypeInfo.name;
            const color = sInfo?.color ?? 'black';
            const autoLabel = this._getAutoLabel(sInfo?.mathLabel, curveType);
            const label = labelOverride || autoLabel;

            outData.push({
                id: id,
                x: x,
                y: y,
                color: color,
                style: style,
                label: label,
                showLabel: showLabel,
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

    /**
     * Generates default label based on mode, species name, curve type, and species ID.
     * Returns raw LaTeX string without delimiters.
     */
    _getAutoLabel(prettyName, curveType) {
        let symbol = '?';
        let subscript = prettyName || '?'; // Default to species name
        let superscript = '';

        // Determine base symbol based ONLY on mode
        symbol = 'V';

        // Add superscripts or modify symbol/subscript based on curveType
        switch (curveType) {
            case 'standardState':
                superscript = '\\circ';
                break;
            case 'bandEdge_C':
            case 'bandEdge_V':
            case 'bandEdge':
                superscript = '\\text{band}';
                break;
            case 'phi':
                // special case! for volt mode we show \phi, not V_\phi
                symbol = '\\phi';
                subscript = '';
                break;
            case 'voltage': // Default case, no changes needed to symbol/subscript/superscript
            case 'voltageImplied':
            default:
                // Keep symbol from mode, keep subscript from prettyName
                // Clear subscript if prettyName was null/undefined?
                if (!prettyName) subscript = '';
                break;
        }

        // Construct final label string (no delimiters)
        if (subscript) {
            // Format like V_{Ag^{+}}^{\circ}
            return `${symbol}${superscript ? `^{${superscript}}` : ''}_{${subscript}}`;
        } else {
            // Format like \phi or V^{\circ} (if prettyName was cleared)
            return `${symbol}${superscript ? `^{${superscript}}` : ''}`;
        }
    }

    _tracePopupCallbackIntermediary(popupInfo) {
        const ted = popupInfo.traceExtraData;
        const expandedPopupInfo = {
            speciesId: ted.speciesId,
            curveDescription: ted.curveDescription,
            ...popupInfo,
        };
        return this._tracePopupCallback(expandedPopupInfo);
        //     speciesId: trace.speciesId,
        //     curveType: trace.curveType,
        //     labelString: trace.labelString,
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
