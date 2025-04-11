// app.js
// Main application script to initialize diagram components.

// Import component classes
import ConcentrationCellComponent from './ConcentrationCellComponent.js';
import LiIonBatteryComponent from './LiIonBatteryComponent.js'; // Import the new component

// --- Configuration Objects ---

// Configuration for the AgNO3 Concentration Cell
const agNO3Config = {
    // Species Definitions
    cation: {
        z: 1,
        mu_standard_J_mol: 77000.0,
        color: '#E6AB02',
        latexPrettyName: '\\mathrm{Ag}^{+}',
    },
    anion: {
        z: -1,
        mu_standard_J_mol: -111000.0,
        color: '#66A61E',
        latexPrettyName: '\\mathrm{NO}_3^{-}',
    },
    electron: {
        z: -1,
        mu_standard_J_mol: 0,
        color: '#1B9E77',
        latexPrettyName: '\\mathrm{e}^{-}',
    },
    // Other chemical info
    electrode_neutral: { mu_J_mol: 0.0 }, // Ag(s)
    compound_stoichiometry: { cation: 1, anion: 1 },
    c_std_M: 1.0,
    // Spatial Layout
    boundaries: [0.0, 0.2, 0.48, 0.52, 0.8, 1.0],
    regionProps: [
        { name: 'Electrode 1 (Ag)', color: '#E0E0E0' },
        { name: 'Electrolyte 1', color: '#E6F5FF' },
        { name: 'Junction', color: 'rgba(255,255,255,0)' },
        { name: 'Electrolyte 2', color: '#D6EFFF' },
        { name: 'Electrode 2 (Ag)', color: '#D0D0D0' },
    ],
    // Initial slider values and ranges
    initialC1: 0.1,
    initialC2: 1.0,
    cMin: 0.001,
    cMax: 2.0,
    plotHeight: 250,
    initialJunction: 'saltbridge',
};

// Configuration for the Li-ion Battery (Using Langmuir OCV model)
const liIonConfig = {
    // Define species relevant to Li-ion (can reuse some keys if careful)
    // Note: Using generic 'anion' key for PF6- or similar
    li_ion: { z: 1, color: '#E41A1C', latexPrettyName: '\\mathrm{Li}^{+}' }, // Red for Li+
    anion: { z: -1, color: '#FF7F00', latexPrettyName: '\\mathrm{PF}_6^{-}' }, // Orange for PF6- (example)
    electron: { z: -1, color: '#377EB8', latexPrettyName: '\\mathrm{e}^{-}' }, // Blue for electron

    // Electrode definitions with Langmuir E0 vs Li/Li+
    anode: {
        // Graphite (simplified)
        E0_vs_Li: 0.15, // Approx. standard potential vs Li/Li+ for Langmuir model
        latexPrettyName: 'Graphite',
        color: '#666666', // Dark Grey
    },
    cathode: {
        // Generic Oxide (simplified)
        E0_vs_Li: 3.8, // Approx. standard potential vs Li/Li+ for Langmuir model
        latexPrettyName: 'Oxide',
        color: '#E41A1C', // Red (same as Li+ maybe?) or different
    },

    // Electrolyte properties (assuming 1M LiPF6, ideal activity)
    electrolyte: {
        Li_activity: 1.0,
        anion_activity: 1.0,
        // Standard potentials for solution ions (optional, needed for V_std lines)
        // If these are omitted, V_span_placeholder will be used.
        // li_ion_mu_standard_J_mol: ??? , // Difficult to define for non-aqueous
        // anion_mu_standard_J_mol: ??? ,
    },

    // Balancing and SoC
    Li_total_norm: 0.95, // Total Li relative to one electrode's site capacity (assumed equal)
    initialSoC: 0.5, // Start at 50% SoC (relative to anode x)

    // Placeholder for relative standard state potential difference if mu_std not provided
    V_span_placeholder: 1.0, // Placeholder V_std(Li+) - V_std(Anion) in Volts

    // Spatial Layout (7 regions, 8 boundaries based on previous discussion)
    // Widths: 0.1 | 0.25 | 0.13 | 0.04 | 0.13 | 0.25 | 0.1
    boundaries: [0, 0.1, 0.35, 0.48, 0.52, 0.65, 0.9, 1.0],
    regionProps: [
        { name: 'Collector 1', color: '#AAAAAA' },
        { name: 'Anode (Graphite)', color: '#DDDDDD' },
        { name: 'Electrolyte 1', color: '#E6F5FF' },
        { name: 'Separator', color: '#FFFFE0' }, // Light yellow for separator
        { name: 'Electrolyte 2', color: '#E6F5FF' }, // Same electrolyte color
        { name: 'Cathode (Oxide)', color: '#FFDDDD' }, // Light red for cathode
        { name: 'Collector 2', color: '#AAAAAA' },
    ],

    // Plot height
    plotHeight: 300, // Slightly taller for battery?
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded, initializing components...');

    // Initialize Concentration Cell Component
    const concCellContainerId = '#ag-conc-cell-container';
    const concCellContainer = document.querySelector(concCellContainerId);
    if (concCellContainer) {
        try {
            // Pass the specific config for the concentration cell
            new ConcentrationCellComponent(concCellContainerId, agNO3Config);
            console.log('ConcentrationCellComponent initialized.');
        } catch (error) {
            console.error(
                `Failed to initialize ConcentrationCellComponent in ${concCellContainerId}:`,
                error
            );
            concCellContainer.innerHTML = `<p style="color: red;">Error loading concentration cell diagram.</p>`;
        }
    } else {
        console.warn(
            `Container ${concCellContainerId} not found for ConcentrationCellComponent.`
        );
    }

    // Initialize Li-ion Battery Component
    const liIonContainerId = '#li-ion-container';
    const liIonContainer = document.querySelector(liIonContainerId);
    if (liIonContainer) {
        try {
            // Pass the specific config for the Li-ion battery
            new LiIonBatteryComponent(liIonContainerId, liIonConfig); // Instantiate the new component
            console.log('LiIonBatteryComponent initialized.');
        } catch (error) {
            console.error(
                `Failed to initialize LiIonBatteryComponent in ${liIonContainerId}:`,
                error
            );
            liIonContainer.innerHTML = `<p style="color: red;">Error loading Li-ion battery diagram.</p>`;
        }
    } else {
        console.warn(
            `Container ${liIonContainerId} not found for LiIonBatteryComponent.`
        );
    }
}); // End DOMContentLoaded listener
