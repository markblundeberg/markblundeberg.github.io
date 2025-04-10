// main.js for Concentration Cell Example

import ElectrochemicalSpeciesBandDiagram from './ElectrochemicalSpeciesBandDiagram.js';

// --- Configuration Section ---

// Cell Setup Parameters for AgNO3 Concentration Cell
const cellConfig = {
    // Species Definitions (using generic keys 'cation', 'anion', 'electron')
    cation: {
        z: 1,
        mu_standard_J_mol: 77000.0, // aqueous Ag+ rel H+ standard state
        color: '#E6AB02', // Gold/Yellow
        latexPrettyName: '\\mathrm{Ag}^{+}', // For auto-labels
    },
    anion: {
        z: -1,
        mu_standard_J_mol: -111000.0, // aqueous NO3- rel H+ standard state
        color: '#66A61E', // Green
        latexPrettyName: '\\mathrm{NO}_3^{-}',
    },
    electron: {
        z: -1,
        mu_standard_J_mol: 0, // Standard state choice irrelevant as V_e set by equilibrium
        color: '#1B9E77', // Teal
        latexPrettyName: '\\mathrm{e}^{-}',
    },

    // Other chemical info
    electrode_neutral: {
        // Chemical potential of the solid electrode material (relative to elements=0)
        // Assumed to be the metallic form of the cation species.
        // I.e. cation is M^(z+) and electrode is M = M^(z+) + z*e^-
        mu_J_mol: 0.0, // For pure Ag(s)
    },
    compound_stoichiometry: {
        // Stoichiometries of the ions in the formal electrolyte compound M_nu_c X_nu_a
        // Used to map formal concentration 'c' to ion activities
        cation: 1, // nu_+ for Ag+ in AgNO3
        anion: 1, // nu_- for NO3- in AgNO3
    },
    // Standard concentration for activity calculation (a = gamma * nu*c / C_STD)
    // Assuming gamma=1 (ideal) and C_STD=1M here.
    c_std_M: 1.0,

    // Spatial Layout definition using boundaries and regionProps
    boundaries: [0.0, 0.2, 0.48, 0.52, 0.8, 1.0], // N+1 boundaries for N regions
    regionProps: [
        // N regions
        { name: 'Electrode 1 (Ag)', color: '#E0E0E0' },
        { name: 'Electrolyte 1', color: '#E6F5FF' },
        { name: 'Junction', color: 'rgba(255,255,255,0)' }, // Transparent region for the gap
        { name: 'Electrolyte 2', color: '#D6EFFF' }, // Slightly different blue
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

// Physical Constants
const R = 8.31446; // J / (mol K)
const F = 96485.3; // C / mol
const TEMP_K = 298.15; // Kelvin
const RT_F = (R * TEMP_K) / F; // Approx 0.02569 V

// --- DOM Element References ---
const plotContainerId = 'plot-container';
const c1Slider = document.getElementById('c1_slider');
const c1Value = document.getElementById('c1_value');
const c2Slider = document.getElementById('c2_slider');
const c2Value = document.getElementById('c2_value');
const cellVoltageOut = document.getElementById('cell_voltage');
const modeSelector = document.getElementById('unit-mode-selector');
const junctionRadios = document.getElementsByName('junction-selector'); // Get radio group

// --- Instantiate Diagram ---
// Ensure container exists before instantiation
const plotContainer = document.getElementById(plotContainerId);
if (!plotContainer) {
    // TODO: ? Disable controls and display error in HTML
    throw `ESBD Error: Plot container #${plotContainerId} not found.`;
}
const diagram = new ElectrochemicalSpeciesBandDiagram(plotContainerId, {
    width: 800, // Initial hint
    height: cellConfig.plotHeight,
});

// --- Define Species Info from Config ---
diagram.addSpeciesInfo('cation', cellConfig.cation);
diagram.addSpeciesInfo('anion', cellConfig.anion);
diagram.addSpeciesInfo('electron', cellConfig.electron);

// --- Set boundaries / regions ---
diagram.setSpatialLayout(cellConfig.boundaries, cellConfig.regionProps);

// --- Calculation Function ---
// Calculates V_volt values based on concentrations, junction type, and config
function calculateState(c1, c2, junctionType, config) {
    // Get parameters from config
    const cation = config.cation;
    const anion = config.anion;
    const compound = config.compound_stoichiometry;
    const mu_electrode = config.electrode_neutral.mu_J_mol;
    const C_STD = config.c_std_M;

    // Check compound neutrality (optional but good practice)
    if (compound.cation * cation.z + compound.anion * anion.z !== 0) {
        throw 'non-neutral compound; fix stoichiometry';
    }

    // Ensure concentrations are positive, calculate ideal molar activities
    c1 = Math.max(c1, 1e-9);
    c2 = Math.max(c2, 1e-9);
    // Activity a_i = gamma_i * nu_i * c / C_STD. Assume gamma_i=1 (molar gamma!).
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
    switch (junctionType) {
        case 'cation':
            cell_voltage = 0;
            break;
        case 'saltbridge':
            cell_voltage = nernst_cation2 - nernst_cation1;
            break;
        case 'anion':
            cell_voltage =
                nernst_cation2 - nernst_cation1 + nernst_anion1 - nernst_anion2;
            break;
        default:
            throw junctionType;
    }

    // right side solution:
    const V_cation_2 = V_cation_1 + cell_voltage;
    const V_STD_cation_2 = V_cation_2 - nernst_cation2;
    const V_STD_anion_2 = V_STD_cation_2 - V_STD_span;
    const V_anion_2 = V_STD_anion_2 + nernst_anion2;
    // right electrode:
    const V_e_2 = V_cation_2 - V_reaction;

    // --- Prepare trace definitions ---
    const b = config.boundaries; // Use boundaries from config
    const traceDefs = [
        // --- Cation Traces ---
        {
            id: `cation_potential_1`,
            speciesId: 'cation',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            x: [b[1], b[2]],
            y: [V_cation_1, V_cation_1],
        },
        {
            id: `cation_potential_2`,
            speciesId: 'cation',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            x: [b[3], b[4]],
            y: [V_cation_2, V_cation_2],
        },
        {
            id: `cation_standard_1`,
            speciesId: 'cation',
            curveType: 'standardState',
            showLabel: false,
            inputUnits: 'V_volt',
            x: [b[1], b[2]],
            y: [V_STD_cation_1, V_STD_cation_1],
        },
        {
            id: `cation_standard_2`,
            speciesId: 'cation',
            curveType: 'standardState',
            showLabel: false,
            inputUnits: 'V_volt',
            x: [b[3], b[4]],
            y: [V_STD_cation_2, V_STD_cation_2],
        },
        // --- Anion Traces ---
        {
            id: `anion_potential_1`,
            speciesId: 'anion',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            x: [b[1], b[2]],
            y: [V_anion_1, V_anion_1],
        },
        {
            id: `anion_potential_2`,
            speciesId: 'anion',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            x: [b[3], b[4]],
            y: [V_anion_2, V_anion_2],
        },
        {
            id: `anion_standard_1`,
            speciesId: 'anion',
            curveType: 'standardState',
            showLabel: false,
            inputUnits: 'V_volt',
            x: [b[1], b[2]],
            y: [V_STD_anion_1, V_STD_anion_1],
        },
        {
            id: `anion_standard_2`,
            speciesId: 'anion',
            curveType: 'standardState',
            showLabel: false,
            inputUnits: 'V_volt',
            x: [b[3], b[4]],
            y: [V_STD_anion_2, V_STD_anion_2],
        },
        // --- Electron Traces ---
        {
            id: `e_electrode1`,
            speciesId: 'electron',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            x: [b[0], b[1]],
            y: [V_e_1, V_e_1],
        },
        {
            id: `e_electrode2`,
            speciesId: 'electron',
            curveType: 'potential',
            showLabel: true,
            inputUnits: 'V_volt',
            x: [b[4], b[5]],
            y: [V_e_2, V_e_2],
        },
    ];

    return { traceDefs, calculatedVoltage: cell_voltage };
}

// --- Tooltip Callback ---
function getTooltipContent(info) {
    const config = cellConfig; // Access outer scope config
    const species = config[info.speciesId];

    // Fallback if speciesId isn't one of the main keys (e.g., for manual traces later)
    if (!species) {
        return `Trace: ${info.traceId}<br>x = ${info.xValue.toFixed(3)}<br>${info.currentMode} = ${info.yValueDisplayed?.toFixed(3)}`;
    }

    let label = info.labelString;
    // Add $ delimiters for KaTeX rendering in tooltip
    if (label) label = `$${label}$`;
    else label = species.latexPrettyName || info.speciesId;

    let content = `<b>${label}</b>`;
    // Add description based on curve type
    if (info.curveType === 'standardState')
        content += `: Standard State Potential`;
    else if (info.curveType === 'potential')
        content += `: Electrochemical Potential`;
    else if (info.curveType === 'bandEdge_C')
        content += `: Conduction Band Edge (E<sub>C</sub>)`;
    else if (info.curveType === 'bandEdge_V')
        content += `: Valence Band Edge (E<sub>V</sub>)`;
    else if (info.curveType) content += `: ${info.curveType}`;

    content += `<br>x = ${info.xValue.toFixed(3)}<br>`;

    const mode = info.currentMode;
    const val = info.yValueDisplayed;
    if (val !== null && isFinite(val)) {
        content += `${mode} = ${val.toFixed(3)} ${mode === 'kJmol' ? 'kJ/mol' : mode}`;
    } else {
        content += `${mode} = N/A`;
    }

    // Use regionInfo passed from module
    if (info.regionInfo) {
        content += `<br>Region: ${info.regionInfo.name} (#${info.regionIndex})`;
    }

    // Add concentration/activity info if applicable
    let conc = null;
    let activity = null;
    // Determine concentration based on region index (indices from cellConfig.regionProps)
    if (info.regionIndex === 1) {
        // Electrolyte 1
        conc = parseFloat(c1Slider.value);
    } else if (info.regionIndex === 3) {
        // Electrolyte 2
        conc = parseFloat(c2Slider.value);
    }

    // Calculate activity only if it's an ion and concentration is known
    if (
        (info.speciesId === 'cation' || info.speciesId === 'anion') &&
        conc !== null
    ) {
        const nu = config.compound_stoichiometry[info.speciesId]; // Get stoichiometry (1 for both here)
        activity = (nu * conc) / config.c_std_M;
        content += `<br>Formal Conc ≈ ${conc.toFixed(3)} M`;
        // Use species.latexPrettyName for the activity label
        content += `<br>Activity($${species.latexPrettyName}$) ≈ ${activity.toFixed(3)}`;
    }

    return content;
}

// Set the callback only if diagram was initialized
diagram.setTooltipCallback(getTooltipContent);

// --- Update Function and Event Listeners ---
function updateDiagram() {
    // Add checks for element existence
    if (
        !c1Slider ||
        !c2Slider ||
        !c1Value ||
        !c2Value ||
        !cellVoltageOut ||
        !diagram
    ) {
        console.error('Missing UI elements or diagram instance.');
        return;
    }
    const c1 = parseFloat(c1Slider.value);
    const c2 = parseFloat(c2Slider.value);
    c1Value.textContent = c1.toFixed(3);
    c2Value.textContent = c2.toFixed(3);
    const juncRadio = document.querySelector(
        'input[name="junction-selector"]:checked'
    );
    const junctionType = juncRadio ? juncRadio.value : 'saltbridge';

    const { traceDefs, calculatedVoltage } = calculateState(
        c1,
        c2,
        junctionType,
        cellConfig
    );
    diagram.updateTraceData(traceDefs);
    cellVoltageOut.textContent = calculatedVoltage.toFixed(3);
}

// Add listeners only if elements exist
if (c1Slider && c2Slider) {
    c1Slider.addEventListener('input', updateDiagram);
    c2Slider.addEventListener('input', updateDiagram);
}
if (modeSelector) {
    modeSelector.addEventListener('change', (event) => {
        if (diagram) diagram.setMode(event.target.value);
    });
}
if (junctionRadios.length > 0) {
    junctionRadios.forEach((radio) =>
        radio.addEventListener('change', updateDiagram)
    );
} else {
    console.warn('Junction selector radio buttons not found.');
}

// --- Initial Draw ---
// Trigger initial calculation and draw
updateDiagram();
console.log('Concentration cell example loaded using setSpatialLayout.');
