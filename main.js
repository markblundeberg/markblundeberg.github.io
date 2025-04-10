// main.js
import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';

// --- Configuration Section ---

// Cell Setup Parameters
const cellConfig = {
    // Species Definitions
    cation: {
        textName: 'Ag+',
        z: 1,
        mu_standard_J_mol: 77000.0, // aqueous
        color: "#E6AB02", // Gold/Yellow
        latexPrettyName: "\\mathrm{Ag}^{+}",
    },
    anion: {
        textName: "NO3-",
        z: -1,
        mu_standard_J_mol: -111000.0, // aqueous
        color: "#66A61E", // Green
        latexPrettyName: "\\mathrm{NO}_3^{-}",
    },
    electron: {
        textName: "e-",
        z: -1,
        // mu_standard_J_mol not needed for electron
        color: "#1B9E77", // Teal
        latexPrettyName: "\\mathrm{e}^{-}",
    },

    // Other chemical info
    electrode_neutral: {
        // Chemical potential of the solid electrode material (relative to elements=0)
        // It is assumed electrode is made of cation with 1:1 stoichiometry for purposes
        // of this chemical potential.
        mu_J_mol: 0.0 // For pure Ag(s)
    },
    compound_stoichiometry: {
        // Stoichiometries of the ions inside of the formal electrolyte compound:
        //    (anion)_x(cation)_y
        // this is used to map the user-selected concentration to ion concentrations.
        anion:1,
        cation:1,
    },

    // Spatial Layout (relative coordinates 0 to 1)
    layout: {
        electrode1_start: 0.0,
        electrode1_end: 0.2,
        electrolyte1_start: 0.2,
        electrolyte1_end: 0.48, // Leave small gap for junction visualization (salt bridge / membrane)
        electrolyte2_start: 0.52, //
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
const RT_F = (R * TEMP_K) / F; // Approx 0.026 V - 'thermal voltage'
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
['cation', 'anion', 'electron'].forEach(id => {
    diagram.addSpeciesInfo(id, cellConfig[id]);
});

// --- Calculation Function ---
// Calculates V_volt values based on concentrations and config
function calculateState(c1, c2, junctype, config) {
    // Get parameters from config
    const cation = config.cation;
    const anion = config.anion;
    const compound = config.compound_stoichiometry;
    const mu_electrode = config.electrode_neutral.mu_J_mol;

    if (compound.anion * anion.z + compound.cation * cation.z != 0) {
        throw('non-neutral compound; fix stoichiometry');
    }

    c1 = Math.max(c1, 1e-9); // Avoid log(0) issues
    c2 = Math.max(c2, 1e-9);
    // Assume ideal molar activities:
    const a_a1 = c1 * compound.anion / C_STD;
    const a_c1 = c1 * compound.cation / C_STD;
    const a_a2 = c2 * compound.anion / C_STD;
    const a_c2 = c2 * compound.cation / C_STD;
    // Calculate potential term RT/(zF) * ln(a) for each ion/region
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

    // Now work our way from left to right. 
    
    // left electrode is ground
    const V_e_1 = 0; 
    // left side solution:
    const V_cation_1 = V_e_1 + V_reaction;
    const V_STD_cation_1 = V_cation_1 - nernst_cation1;
    const V_STD_anion_1 = V_STD_cation_1 - V_STD_span;
    const V_anion_1 = V_STD_anion_1 + nernst_anion1;

    // junction!
    // for simplicity, we'll calculate the jump between V_cation_1 and V_cation_2
    // cell_voltage == V_e_2 - V_e_1 == V_cation_2 - V_cation_1 within numerical error
    let cell_voltage = 0;
    switch(junctype) {
        case 'cation':
            cell_voltage = 0;
            break;
        case 'saltbridge':
            cell_voltage = nernst_cation2 - nernst_cation1;
            break;
        case 'anion':
            cell_voltage = nernst_cation2 - nernst_cation1 + nernst_anion1 - nernst_anion2;
            break;
        default:
            throw(junctype);
    }

    // right side solution:
    const V_cation_2 = V_cation_1 + cell_voltage;
    const V_STD_cation_2 = V_cation_2 - nernst_cation2;
    const V_STD_anion_2 = V_STD_cation_2 - V_STD_span;
    const V_anion_2 = V_STD_anion_2 + nernst_anion2;
    // right electrode:
    const V_e_2 = V_cation_2 - V_reaction;

    // Prepare trace definitions using V_volt input unit
    const x = config.layout; // Shortcut for layout boundaries
    const traceDefs = [
        // --- Cation Traces ---
        {
            id: `cation_potential_1`, speciesId: 'cation', curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_cation_1, V_cation_1], // Constant value within range
            x: [x.electrolyte1_start, x.electrolyte1_end] // Define x points for this segment
        },
        {
            id: `cation_potential_2`, speciesId: 'cation', curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_cation_2, V_cation_2],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
        { // Standard state needs only one value per region as phi=0 is constant
            id: `cation_standard_1`, speciesId: 'cation', curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_STD_cation_1, V_STD_cation_1],
            x: [x.electrolyte1_start, x.electrolyte1_end]
        },
         {
            id: `cation_standard_2`, speciesId: 'cation', curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_STD_cation_2, V_STD_cation_2],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
       // --- Anion Traces ---
        {
            id: `anion_potential_1`, speciesId: 'anion', curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_anion_1, V_anion_1],
            x: [x.electrolyte1_start, x.electrolyte1_end]
        },
        {
            id: `anion_potential_2`, speciesId: 'anion', curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_anion_2, V_anion_2],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
        {
            id: `anion_standard_1`, speciesId: 'anion', curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte1_start, max: x.electrolyte1_end },
            y: [V_STD_anion_1, V_STD_anion_1],
            x: [x.electrolyte1_start, x.electrolyte1_end]
        },
         {
            id: `anion_standard_2`, speciesId: 'anion', curveType: 'standardState', showLabel: false,
            inputUnits: 'V_volt', xRange: { min: x.electrolyte2_start, max: x.electrolyte2_end },
            y: [V_STD_anion_2, V_STD_anion_2],
            x: [x.electrolyte2_start, x.electrolyte2_end]
        },
        // --- Electron Traces ---
        {
            id: `e_electrode1`, speciesId: 'electron', curveType: 'potential', showLabel: true,
            inputUnits: 'V_volt', xRange: { min: x.electrode1_start, max: x.electrode1_end },
            y: [V_e_1, V_e_1],
            x: [x.electrode1_start, x.electrode1_end]
        },
        {
            id: `e_electrode2`, speciesId: 'electron', curveType: 'potential', showLabel: true,
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
    const species = config[info.speciesId];
    let content = `<b>\$${info.labelString}\$</b><br>x = ${info.xValue.toFixed(3)}<br>`;
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
    if (info.speciesId === 'cation' || info.speciesId === 'anion') {
        if (x >= layout.electrolyte1_start && x <= layout.electrolyte1_end) {
            conc = parseFloat(c1Slider.value);
            content += `<br>Region: Electrolyte 1`;
        } else if (x >= layout.electrolyte2_start && x <= layout.electrolyte2_end) {
            conc = parseFloat(c2Slider.value);
            content += `<br>Region: Electrolyte 2`;
        }
    } else if (info.speciesId === 'electron') {
         if (x >= layout.electrode1_start && x <= layout.electrode1_end) {
            content += `<br>Region: Electrode 1`;
         } else if (x >= layout.electrode2_start && x <= layout.electrode2_end) {
             content += `<br>Region: Electrode 2`;
         }
    }

    if (conc !== null) {
        content += `<br>Conc ≈ ${conc.toFixed(3)} M`;
        // Could add activity calculation here if needed: a = conc/C_STD
        content += `<br>\$${species.latexPrettyName}\$ activity ≈ ${(conc*config.compound_stoichiometry[info.speciesId]/C_STD).toFixed(3)}`;
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
    const juncradio = document.querySelector('input[name="junction-selector"]:checked');
    if (!juncradio) { throw('no junction type selected'); }
    const junctype = juncradio.value;

    // Calculate the new state based on slider values and cellConfig
    const { traceDefs, calculatedVoltage } = calculateState(c1, c2, junctype, cellConfig);

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
document.getElementsByName('junction-selector').forEach(
    item => item.addEventListener('click', updateDiagram)
)

// --- Initial Draw ---
diagram.setRegions(cellConfig.regions);
diagram.setInterfaces(cellConfig.interfaces);
updateDiagram(); // Calculate initial state and draw

console.log("Concentration cell example loaded.");
