// app.js
// Main application script to initialize diagram components.

// Import component classes
import ConcentrationCellComponent from './ConcentrationCellComponent.js';
// import LiIonBatteryComponent from './LiIonBatteryComponent.js'; // Import later when created

// --- Configuration Objects ---

// Configuration for the AgNO3 Concentration Cell
const agNO3Config = {
    // Species Definitions
    cation: {
        z: 1,
        mu_standard_J_mol: 77000.0, // aqueous Ag+ rel H+ standard state
        color: '#E6AB02', // Gold/Yellow
        latexPrettyName: '\\mathrm{Ag}^{+}',
    },
    anion: {
        z: -1,
        mu_standard_J_mol: -111000.0, // aqueous NO3- rel H+ standard state
        color: '#66A61E', // Green
        latexPrettyName: '\\mathrm{NO}_3^{-}',
    },
    electron: {
        z: -1,
        mu_standard_J_mol: 0, // Not directly used
        color: '#1B9E77', // Teal
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

// Configuration for the Li-ion Battery (Placeholder for later)
// const liIonConfig = {
//     // ... Define Li-ion specific parameters ...
// };

// --- Initialization ---

// Wait for the DOM to be fully loaded before initializing components
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded, initializing components...');

    // Initialize Concentration Cell Component
    const concCellContainerId = '#ag-conc-cell-container'; // ID used in index.html
    const concCellContainer = document.querySelector(concCellContainerId);
    if (concCellContainer) {
        try {
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

    // Initialize Li-ion Battery Component (Later)
    const liIonContainerId = '#li-ion-container'; // Assumed ID in index.html
    const liIonContainer = document.querySelector(liIonContainerId);
    if (liIonContainer) {
        // try {
        //     // new LiIonBatteryComponent(liIonContainerId, liIonConfig); // Uncomment when ready
        //     console.log("LiIonBatteryComponent would be initialized here.");
        // } catch (error) {
        //     console.error(`Failed to initialize LiIonBatteryComponent in ${liIonContainerId}:`, error);
        //     liIonContainer.innerHTML = `<p style="color: red;">Error loading Li-ion battery diagram.</p>`;
        // }
        liIonContainer.innerHTML =
            '<p><i>Li-ion battery diagram placeholder...</i></p>'; // Placeholder content
    } else {
        console.warn(
            `Container ${liIonContainerId} not found for LiIonBatteryComponent.`
        );
    }
}); // End DOMContentLoaded listener
