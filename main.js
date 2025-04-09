// main.js
import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';

// --- Configuration Section ---

// Cell Setup Parameters
const cellConfig = {
    // Species Definitions
    cation: {
        id: "Ag+",
        z: 1,
        latexPrettyName: "\\mathrm{Ag}^{+}",
        // From user: μ⊖(Ag⁺) ≈ +77 kJ/mol
        mu_standard_J_mol: 77000.0,
        color: "#E6AB02" // Gold/Yellow
    },
    anion: {
        id: "NO3-",
        z: -1,
        latexPrettyName: "\\mathrm{NO}_3^{-}",
        // From user: μ⊖(NO₃⁻) ≈ -111 kJ/mol
        mu_standard_J_mol: -111000.0,
        color: "#66A61E" // Green
    },
    electron: {
        id: "e-",
        z: -1,
        latexPrettyName: "\\mathrm{e}^{-}",
        // Standard state here is arbitrary as V_e is set by equilibrium
        mu_standard_J_mol: 0,
        color: "#1B9E77" // Teal
    },
    electrode_neutral: {
        // Chemical potential of the solid electrode material (relative to elements=0)
        mu_J_mol: 0.0 // For pure Ag(s)
    },

    // Spatial Layout (relative coordinates 0 to 1)
    layout: {
        electrode1_start: 0.0,
        electrode1_end: 0.2,
        electrolyte1_start: 0.2,
        electrolyte1_end: 0.48, // Leave small gap for "bridge" visualization
        electrolyte2_start: 0.52,
        electrolyte2_end: 0.8,
        electrode2_start: 0.8,
        electrode2_end: 1.0,
    },

    // Background Regions
    regions: [
        { start: 0.0, end: 0.2, name: 'Electrode 1 (Ag)', color: '#E0E0E0' },
        { start: 0.2, end: 0.48, name: 'Electrolyte 1', color: '#E6F5FF' },
        { start: 0.52, end: 0.8, name: 'Electrolyte 2', color: '#D6EFFF' }, // Slightly different
        { start: 0.8, end: 1.0, name: 'Electrode 2 (Ag)', color: '#D0D0D0' }
    ],
    // Interface Lines
    interfaces: [0.2, 0.48, 0.52, 0.8] // Mark all boundaries
};

// Physical Constants
const R = 8.31446; // J / (mol K)
const F = 96485.3; // C / mol
const TEMP_K = 298.15; // Kelvin
const RT_F = (R * TEMP_K) / F; // Approx 0.02569 V
const C_STD = 1.0; // Standard concentration (1 M) for molar activity scale

// --- DOM Element References ---
const plotContainerId = 'plot-container';
const c1Slider = document.getElementById('c1_slider');
const c1Value = document.getElementById('c1_value');
const c2Slider = document.getElementById('c2_slider');
const c2Value = document.getElementById('c2_value');
const cellVoltageOut = document.getElementById('cell_voltage');
const modeSelector = document.getElementById('unit-mode-selector');

// --- Instantiate Diagram ---
// Pass initial width/height hints matching CSS (optional)
const diagram = new ElectrochemicalSpeciesBandDiagram(plotContainerId, { width: 800, height: 500 });

// --- Define Species Info from Config ---
diagram.addSpeciesInfo(cellConfig.cation.id, cellConfig.cation);
diagram.addSpeciesInfo(cellConfig.anion.id, cellConfig.anion);
diagram.addSpeciesInfo(cellConfig.electron.id, cellConfig.electron);

// --- Calculation Function ---
// Calculates V_volt values based on concentrations and config
function calculateState(c1, c2, config) {
    c1 = Math.max(c1, 1e-9); // Avoid log(0) issues
    c2 = Math.max(c2, 1e-9);
    const a1 = c1 / C_STD; // Ideal activity = c/c_std
    const a2 = c2 / C_STD;

    // Get parameters from config
    const cation = config.cation;
    const anion = config.anion;
    const electron = config.electron;
    const mu_electrode = config.electrode_neutral.mu_J_mol;
    const n_reaction = cation.z; // Number of electrons in M -> M^n+ + n e-

    // Calculate standard state potentials V^⊖ = μ^⊖ / (zF) in Volts
    const V_STD_cation = cation.mu_standard_J_mol / (cation.z * F);
    const V_STD_anion = anion.mu_standard_J_mol / (anion.z * F);

    // Calculate potential term RT/(zF) * ln(a) for each ion/region
    const nernst_cation1 = (RT_F / cation.z) * Math.log(a1);
    const nernst_cation2 = (RT_F / cation.z) * Math.log(a2);
    // Assume anion activity scales with cation activity (e.g., a_anion = a_cation for 1:1 salt)
    const nernst_anion1 = (RT_F / anion.z) * Math.log(a1);
    const nernst_anion2 = (RT_F / anion.z) * Math.log(a2);

    // Assume ideal salt bridge: phi is constant in both bulk electrolytes. Set phi=0.
    const phi_electrolyte = 0;

    // Calculate V = V^⊖ + (RT/zF)ln(a) + phi for ions in each electrolyte
    const V_cation_1 = V_STD_cation + nernst_cation1 + phi_electrolyte;
    const V_cation_2 = V_STD_cation + nernst_cation2 + phi_electrolyte;
    const V_anion_1 = V_STD_anion + nernst_anion1 + phi_electrolyte;
    const V_anion_2 = V_STD_anion + nernst_anion2 + phi_electrolyte;

    // Calculate V_e in electrodes based on equilibrium at interface:
    // V_cation - V_electron = mu_electrode / (n * F)  => V_e = V_cation - mu_electrode / (n*F)
    const V_e_1 = V_cation_1 - mu_electrode / (n_reaction * F);
    const V_e_2 = V_cation_2 - mu_electrode / (n_reaction * F);

    // Calculate Cell Voltage
    const cell_voltage = V_e_2 - V_e_1; // Potential of right electrode minus left

    // Prepare trace definitions using V_volt input unit
    const x = config.layout; // Shortcut for layout boundaries
    const traceDefs = [
        // --- Cation Traces ---
        {
            id: `${cation.id}_potential_1`, speciesId: cation.id, curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_cation_1, V_cation_1], // Constant value within range
            x: [x.electrolyte1_start, x.electrolyte1_end] // Define x points for this segment
        },
        {
            id: `${cation.id}_potential_2`, speciesId: cation.id, curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_cation_2, V_cation_2],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
        { // Standard state needs only one value per region as phi=0 is constant
            id: `${cation.id}_standard_1`, speciesId: cation.id, curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_STD_cation + phi_electrolyte, V_STD_cation + phi_electrolyte],
            x: [x.electrolyte1_start, x.electrolyte1_end]
        },
         {
            id: `${cation.id}_standard_2`, speciesId: cation.id, curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_STD_cation + phi_electrolyte, V_STD_cation + phi_electrolyte],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
       // --- Anion Traces ---
        {
            id: `${anion.id}_potential_1`, speciesId: anion.id, curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_anion_1, V_anion_1],
            x: [x.electrolyte1_start, x.electrolyte1_end]
        },
        {
            id: `${anion.id}_potential_2`, speciesId: anion.id, curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_anion_2, V_anion_2],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
        {
            id: `${anion.id}_standard_1`, speciesId: anion.id, curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_STD_anion + phi_electrolyte, V_STD_anion + phi_electrolyte],
            x: [x.electrolyte1_start, x.electrolyte1_end]
        },
         {
            id: `${anion.id}_standard_2`, speciesId: anion.id, curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_STD_anion + phi_electrolyte, V_STD_anion + phi_electrolyte],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
        // --- Electron Traces ---
        {
            id: `e_electrode1`, speciesId: electron.id, curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrode1_start, max: x.electrode1_end },
            y: [V_e_1, V_e_1],
            x: [x.electrode1_start, x.electrode1_end]
        },
        {
            id: `e_electrode2`, speciesId: electron.id, curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrode2_start, max: x.electrode2_end },
            y: [V_e_2, V_e_2],
            x: [x.electrode2_start, x.electrode2_end]
        },
    ];

    return { traceDefs, calculatedVoltage: cell_voltage };
}

// --- Tooltip Callback ---
function getTooltipContent(info) {
    // info contains: { speciesId, traceId, xValue, yValueDisplayed, yValueVolts, currentMode, pointEvent }
    const config = cellConfig; // Access outer scope config
    const species = config[info.speciesId] || config.cation.id === info.speciesId ? config.cation : (config.anion.id === info.speciesId ? config.anion : config.electron);
    let content = `<b>\$${species.latexPrettyName || info.speciesId}\$</b><br>x = ${info.xValue.toFixed(3)}<br>`;
    const mode = info.currentMode;
    const val = info.yValueDisplayed;

    if (val !== null && isFinite(val)) {
        content += `${mode} = ${val.toFixed(3)} ${mode === 'kJmol' ? 'kJ/mol' : mode}`;
    } else {
         content += `${mode} = N/A`;
    }

    // Add concentration info if it's an ion in an electrolyte region
    let conc = null;
    const x = info.xValue;
    const layout = config.layout;
    if (info.speciesId === config.cation.id || info.speciesId === config.anion.id) {
        if (x >= layout.electrolyte1_start && x <= layout.electrolyte1_end) {
            conc = parseFloat(c1Slider.value);
            content += `<br>Region: Electrolyte 1`;
        } else if (x >= layout.electrolyte2_start && x <= layout.electrolyte2_end) {
            conc = parseFloat(c2Slider.value);
            content += `<br>Region: Electrolyte 2`;
        }
    } else if (info.speciesId === config.electron.id) {
         if (x >= layout.electrode1_start && x <= layout.electrode1_end) {
            content += `<br>Region: Electrode 1`;
         } else if (x >= layout.electrode2_start && x <= layout.electrode2_end) {
             content += `<br>Region: Electrode 2`;
         }
    }

    if (conc !== null) {
        content += `<br>Conc ≈ ${conc.toFixed(3)} M`;
        // Could add activity calculation here if needed: a = conc/C_STD
        content += `<br>Activity ≈ ${(conc/C_STD).toFixed(3)}`;
    }

    return content;
}
diagram.setTooltipCallback(getTooltipContent);

// --- Update Function and Event Listeners ---
function updateDiagram() {
    const c1 = parseFloat(c1Slider.value);
    const c2 = parseFloat(c2Slider.value);
    c1Value.textContent = c1.toFixed(3);
    c2Value.textContent = c2.toFixed(3);

    // Calculate the new state based on slider values and cellConfig
    const { traceDefs, calculatedVoltage } = calculateState(c1, c2, cellConfig);

    // Update the diagram instance's data
    diagram.updateTraceData(traceDefs);

    // Update displayed cell voltage
    cellVoltageOut.textContent = calculatedVoltage.toFixed(3);
}

// Listener for sliders
c1Slider.addEventListener('input', updateDiagram);
c2Slider.addEventListener('input', updateDiagram);

// Listener for mode selector
modeSelector.addEventListener('change', (event) => {
    diagram.setMode(event.target.value);
});

// --- Initial Draw ---
diagram.setRegions(cellConfig.regions);
diagram.setInterfaces(cellConfig.interfaces);
updateDiagram(); // Calculate initial state and draw

console.log("Concentration cell example loaded.");
