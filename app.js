// app.js
// Main application script to initialize diagram components.

// Import component classes
import ConcentrationCellComponent from './ConcentrationCellComponent.js';
import LiIonBatteryComponent from './LiIonBatteryComponent.js';
import LeadAcidBatteryComponent from './LeadAcidBatteryComponent.js';
import EnergyLevelsDiagram from './EnergyLevelsDiagram.js';
import { throttle } from './utils.js';

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
        color: '#377EB8',
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
    initialC2: 1.5,
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
    initialSoCPercent: 50, // Start at 50% SoC (relative to anode x)

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

// Configuration for the Lead-Acid Battery
const leadAcidConfig = {
    // Species Definitions (using standard mu^⊖ values in J/mol)
    species: {
        'H+': {
            z: 1,
            mu_standard_J_mol: 0,
            color: '#E41A1C',
            latexPrettyName: '\\mathrm{H}^{+}',
        }, // Red
        'HSO4-': {
            z: -1,
            mu_standard_J_mol: -755900,
            color: '#009F9F',
            latexPrettyName: '\\mathrm{HSO}_4^{-}',
        }, // Orange
        'e-': {
            z: -1,
            mu_standard_J_mol: 0,
            color: '#377EB8',
            latexPrettyName: '\\mathrm{e}^{-}',
        }, // Blue
        // Optional: Add SO4^2- if implementing dissociation later
        // 'SO4^2-':{ z: -2, mu_standard_J_mol: -744500, color: '#984EA3', latexPrettyName: '\\mathrm{SO}_4^{2-}' }, // Purple
    },
    // Standard chemical potentials for solid/liquid phases (J/mol)
    solids: {
        mu_Pb: 0,
        mu_PbSO4: -813000, // Using Gibbs Energy value
        mu_PbO2: -217300,
        mu_H2O: -237100,
    },
    // Electrolyte properties
    electrolyte: {
        initialConc: 4.0, // Starting H2SO4 concentration (M)
        // For simplified activity calculation a_i = nu_i * C / C_STD
        nu_H: 1, // Effective stoichiometry for H+ in H2SO4 (simplification)
        nu_HSO4: 1, // Effective stoichiometry for HSO4- in H2SO4 (simplification)
    },
    c_std_M: 1.0, // Standard concentration 1 M

    // Spatial Layout (5 regions: Coll | Pb | Elyte/Sep | PbO2 | Coll)
    boundaries: [0, 0.15, 0.35, 0.65, 0.85, 1.0], // 6 boundaries
    regionProps: [
        { name: 'Collector (Pb)', color: '#AAAAAA' },
        { name: 'Anode (Pb)', color: '#D0D0D0' },
        { name: 'Electrolyte/Separator', color: '#E6F5FF' },
        { name: 'Cathode (PbO₂)', color: '#606060' }, // Darker grey for PbO2
        { name: 'Collector (Pb)', color: '#AAAAAA' },
    ],

    // Initial slider values and ranges
    concMin: 0.1, // Min H2SO4 conc
    concMax: 6.0, // Max H2SO4 conc
    plotHeight: 300,
    initialShowStdStates: false,
    initialShowHSO4: true, // Show HSO4- by default
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

    // Initialize Lead-Acid Battery Component
    const leadAcidContainerId = '#lead-acid-container'; // Make sure this ID exists in your HTML
    const leadAcidContainer = document.querySelector(leadAcidContainerId);
    if (leadAcidContainer) {
        try {
            // Pass the specific config for the lead-acid battery
            new LeadAcidBatteryComponent(leadAcidContainerId, leadAcidConfig);
            console.log('LeadAcidBatteryComponent initialized.');
        } catch (error) {
            console.error(
                `Failed to initialize LeadAcidBatteryComponent in ${leadAcidContainerId}:`,
                error
            );
            leadAcidContainer.innerHTML = `<p style="color: red;">Error loading lead-acid battery diagram.</p>`;
        }
    } else {
        console.warn(
            `Container ${leadAcidContainerId} not found for LeadAcidBatteryComponent.`
        );
    }
}); // End DOMContentLoaded listener

// --- Energy Level Diagram Example: Solvent Comparison ---

// Assuming EnergyLevelsDiagram class is imported:
// import EnergyLevelsDiagram from './EnergyLevelsDiagram.js';

// 1. Define Configuration for this diagram instance
const solventDiagramConfig = {
    width: 200, // Wider to accommodate two categories + labels
    height: 400, // Taller to accommodate potential range
    yAxisLabel: 'Illustrative $V^\\ominus_i$ (Volts vs. Arb. Ref.)',
    initialYRange: [-3.5, 3.5], // Example range covering typical values vs SHE somewhat
    showYTicks: true, // Show ticks for reference
    categories: [
        // Define the two horizontal categories
        { id: 'h2o', label: 'Water (Aq)' },
        { id: 'an', label: 'Acetonitrile (AN)' },
    ],
    defaultLevelStyle: { lineWidth: 1 }, // Use thin lines for standard states
};

// 2. Define the Level Data (Using PLACEHOLDER / ILLUSTRATIVE V^⊖ values)
// Values roughly based on aqueous E0 vs SHE, with arbitrary shifts for AN
// DO NOT TREAT THESE AS ACCURATE THERMODYNAMIC VALUES FOR AN!
const solventLevelsData = [
    // --- Water ---
    {
        categoryId: 'h2o',
        levelId: 'Ag+_h2o',
        yValue: 0.8,
        label: 'V^{\\ominus}_{\\mathrm{Ag}^{+}}',
        color: '#E6AB02',
    },
    {
        categoryId: 'h2o',
        levelId: 'H+_h2o',
        yValue: 0.0,
        label: 'V^{\\ominus}_{\\mathrm{H}^{+}}',
        color: '#E41A1C',
    }, // SHE reference
    {
        categoryId: 'h2o',
        levelId: 'Cu2+_h2o',
        yValue: 0.34,
        label: 'V^{\\ominus}_{\\mathrm{Cu}^{2+}}',
        color: '#D95F02',
    }, // Example
    {
        categoryId: 'h2o',
        levelId: 'Zn2+_h2o',
        yValue: -0.76,
        label: 'V^{\\ominus}_{\\mathrm{Zn}^{2+}}',
        color: '#7570B3',
    }, // Example
    {
        categoryId: 'h2o',
        levelId: 'Li+_h2o',
        yValue: -3.04,
        label: 'V^{\\ominus}_{\\mathrm{Li}^{+}}',
        color: '#E41A1C',
    }, // Example Li+
    {
        categoryId: 'h2o',
        levelId: 'Cl-_h2o',
        yValue: 1.36,
        label: 'V^{\\ominus}_{\\mathrm{Cl}^{-}}',
        color: '#66A61E',
    }, // Example Cl- (from Cl2/Cl-)
    {
        categoryId: 'h2o',
        levelId: 'NO3-_h2o',
        yValue: 1.15,
        label: 'V^{\\ominus}_{\\mathrm{NO}_3^{-}}',
        color: '#66A61E',
    }, // From previous

    // --- Acetonitrile (Illustrative Shifts) ---
    // Cations generally less stable (more positive V^⊖)
    // Anions generally much less stable (much more positive V^⊖)
    {
        categoryId: 'an',
        levelId: 'Ag+_an',
        yValue: 0.8 + 0.5,
        label: 'V^{\\ominus}_{\\mathrm{Ag}^{+}}',
        color: '#E6AB02',
    }, // Shifted up
    {
        categoryId: 'an',
        levelId: 'H+_an',
        yValue: 0.0 + 0.6,
        label: 'V^{\\ominus}_{\\mathrm{H}^{+}}',
        color: '#E41A1C',
    }, // Shifted up (arb.)
    {
        categoryId: 'an',
        levelId: 'Cu2+_an',
        yValue: 0.34 + 0.5,
        label: 'V^{\\ominus}_{\\mathrm{Cu}^{2+}}',
        color: '#D95F02',
    },
    {
        categoryId: 'an',
        levelId: 'Zn2+_an',
        yValue: -0.76 + 0.5,
        label: 'V^{\\ominus}_{\\mathrm{Zn}^{2+}}',
        color: '#7570B3',
    },
    {
        categoryId: 'an',
        levelId: 'Li+_an',
        yValue: -3.04 + 0.5,
        label: 'V^{\\ominus}_{\\mathrm{Li}^{+}}',
        color: '#E41A1C',
    },
    {
        categoryId: 'an',
        levelId: 'Cl-_an',
        yValue: 1.36 + 1.0,
        label: 'V^{\\ominus}_{\\mathrm{Cl}^{-}}',
        color: '#66A61E',
    }, // Large shift up
    {
        categoryId: 'an',
        levelId: 'NO3-_an',
        yValue: 1.15 + 1.0,
        label: 'V^{\\ominus}_{\\mathrm{NO}_3^{-}}',
        color: '#66A61E',
    }, // Large shift up
];

// 3. Find container and instantiate the diagram
const solventContainerId = '#solvent-comparison-container';
const solventContainer = document.querySelector(solventContainerId);
if (solventContainer) {
    try {
        const solventDiagram = new EnergyLevelsDiagram(
            solventContainerId,
            solventDiagramConfig
        );
        solventDiagram.setLevels(solventLevelsData);
        solventDiagram.redraw();
        console.log('Solvent comparison diagram initialized.');
    } catch (error) {
        console.error(
            `Failed to initialize EnergyLevelsDiagram in ${solventContainerId}:`,
            error
        );
        solventContainer.innerHTML = `<p style="color: red;">Error loading level diagram.</p>`;
    }
} else {
    console.warn(
        `Container ${solventContainerId} not found for EnergyLevelsDiagram.`
    );
}

// --- End Energy Level Diagram Example ---

{
    // --- Unison Shift Demo ---

    // 1. Data for Generic Species
    // Using ecp_init as baseline mu_bar at phi=0 (arbitrary energy units, assuming F=1)
    const ionData = {
        // Using simple keys A, B, C, D, E
        A: { z: -2, ecp_init: +1.0, color: '#984ea3', latex: 'A^{2-}' }, // Purple
        B: { z: -1, ecp_init: -0.9, color: '#377eb8', latex: 'B^{-}' }, // Blue
        C: { z: 0, ecp_init: +1.7, color: '#4daf4a', latex: 'C' }, // Green (Neutral)
        D: { z: +1, ecp_init: +0.5, color: '#ff7f00', latex: 'D^{+}' }, // Orange
        E: { z: +2, ecp_init: +2.6, color: '#e41a1c', latex: 'E^{2+}' }, // Red
    };
    const speciesKeys = Object.keys(ionData);

    // 2. Configuration for the Diagrams
    const commonConfig = {
        width: 100, // Narrower plots
        height: 250,
        showYTicks: false, // No numerical ticks as requested
        categories: [{ id: 'levels', label: '' }], // Single category, no label needed below
        margin: { top: 10, right: 0, bottom: 20, left_compact: 25 }, // Minimal margins if no Y axis label/ticks
    };

    const muBarConfig = {
        ...commonConfig,
        yAxisLabel: '$\\bar{\\mu}_i$ (Arb. Energy)', // KaTeX label
        initialYRange: [-2.5, 5.0], // Calculated range + padding
    };

    const vConfig = {
        ...commonConfig,
        yAxisLabel: '$V_i$ (Arb. Volts)', // KaTeX label (Volts relative to F=1)
        initialYRange: [-2.0, 2.8], // Calculated range + padding
    };

    // 3. DOM References
    const phiSlider = document.getElementById('phi-slider');
    const phiValue = document.getElementById('phi-value');
    const muBarContainerId = '#mu-bar-diagram-container';
    const vContainerId = '#v-diagram-container';

    // 4. Instantiate Diagrams (check containers exist first)
    let muBarDiagram = null;
    let vDiagram = null;
    const muBarContainer = document.querySelector(muBarContainerId);
    const vContainer = document.querySelector(vContainerId);

    if (muBarContainer && vContainer) {
        try {
            muBarDiagram = new EnergyLevelsDiagram(
                muBarContainerId,
                muBarConfig
            );
            vDiagram = new EnergyLevelsDiagram(vContainerId, vConfig);
        } catch (error) {
            console.error('Failed to initialize level diagrams:', error);
        }
    } else {
        console.warn('Container divs for level diagrams not found.');
    }

    // 5. Update Function
    function updateUnisonShiftDiagrams() {
        if (!muBarDiagram || !vDiagram) return; // Don't run if diagrams failed to init
        const phi = parseFloat(phiSlider.value);

        const muBarLevelsData = [];
        const vLevelsData = [];

        speciesKeys.forEach((key) => {
            const ion = ionData[key];
            const z = ion.z;
            const ecp_init = ion.ecp_init;

            // Calculate mu_bar (assuming F=1)
            const mu_bar = ecp_init + z * phi;
            muBarLevelsData.push({
                categoryId: 'levels',
                levelId: key + '_mu', // Unique ID
                yValue: mu_bar,
                label: `\\bar{\\mu}_{${ion.latex}}`, // Raw LaTeX for component
                color: ion.color,
            });

            // Calculate V (only if z is not 0)
            if (z !== 0) {
                // V = mu_bar / z (since F=1)
                // OR V = V_init + phi = (ecp_init / z) + phi
                const V = ecp_init / z + phi;
                vLevelsData.push({
                    categoryId: 'levels',
                    levelId: key + '_V', // Unique ID
                    yValue: V,
                    label: `V_{${ion.latex}}`, // Raw LaTeX for component
                    color: ion.color,
                });
            }
        });

        // Update the diagrams
        muBarDiagram.setLevels(muBarLevelsData);
        muBarDiagram.redraw();
        vDiagram.setLevels(vLevelsData);
        vDiagram.redraw();
    }

    // 6. Event Listener for Slider
    if (phiSlider) {
        phiSlider.addEventListener(
            'input',
            throttle((event) => updateUnisonShiftDiagrams(), 100)
        );

        // Initial update
        updateUnisonShiftDiagrams();
        console.log('Unison shift demo initialized.');
    } else {
        console.warn('Phi slider not found.');
    }

    // --- End Unison Shift Demo ---
}
