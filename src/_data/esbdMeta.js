// Per-topic metadata for the ESBD book, keyed by page fileSlug.
// Kept here (not in each page's front matter) so the sidebar/meta plumbing
// stays out of the way of prose edits. Topic ORDER comes from the esbd_topic
// collection (orderESBD); this file only annotates it.
//
// sectionStarts: the topic that OPENS each section gets the section heading
// emitted above it in the sidebar. Assumes sections are contiguous in
// orderESBD (true today; update here if a page moves).
// rabbitHolesStart: where the main line ends and the appendix tier begins.
// descriptions: one-liners for <meta name="description"> / social cards,
// adapted from the blurbs in esbd_topic_list.md.
export default {
    sectionStarts: {
        v_i: 'The Vᵢ landscape',
        solutions: 'Materials I: Dilute Charge Carriers',
        basicelectrostatics: 'Materials II: Electrostatics, Transport, and Complex Materials',
        half: 'Redox and electrode potentials',
        muintro: 'Thermodynamics',
        phi: 'Messy electrostatics',
        data: 'Appendices',
    },
    rabbitHolesStart: 'muintro',
    descriptions: {
        esbd:
            'What belongs in the middle of a battery diagram? A visual ' +
            'framework for electrochemistry: species voltages Vᵢ, drawn the ' +
            'way semiconductor physics draws band diagrams.',
        v_i: 'The fundamentals of species voltage Vᵢ: a real voltage for every type of charge carrier.',
        equilibrium: 'Electrodes and reactions in the species-voltage picture.',
        lib: 'Application spotlight: a lithium-ion battery as an electrochemical species band diagram.',
        reading: 'A field guide to every line and symbol on the ESBD diagrams.',
        solutions: 'Concentrations, standard states V°ᵢ, and ion activities.',
        solidstate: 'Conduction and valence bands as V°ᵢ levels; electrons and holes as ion analogs.',
        charge_neutrality: 'Doping, Donnan potentials, and the common-ion effect.',
        bipolar: 'Bipolar membranes as the visual twin of pn junctions: water splitting and electron–hole pair generation.',
        basicelectrostatics: 'Debye screening and the local charge neutrality approximation.',
        capacitors: 'Dielectric and chemical capacitance; the capacitive divider.',
        basictransport: "Per-species Ohm's law, concentration polarization, and liquid junction potentials.",
        other_conductors: 'Metals, fast ionic conductors, and mixed conductors.',
        saturation: 'The common reason why current saturates in transistors and electrochemical processes.',
        half: "Electrons 'in solution': redox and the Nernst equation in Vᵢ terms; standard electrode potentials as floating levels.",
        e: 'One electrode: visualizing electrode potential E, overpotential, and mixed potentials.',
        references: "Reference electrodes, full cells, liquid junction potentials, and the 'absolute' vacuum reference.",
        kinetics: 'The current–overpotential law: Butler–Volmer as the exponential interface element; Tafel, the diode connection, and Marcus–Gerischer.',
        muintro: 'Why the electrochemical potential is the real, indivisible chemical potential — and why that makes Vᵢ (and band diagrams) work.',
        nuances: "Are Vᵢ 'real voltages'? How to access each one in practice.",
        offsetsgalore: 'An interactive tour of every arbitrary convention in the framework — and which ones actually move anything.',
        nonideal: 'The technical difficulties of single-ion activities.',
        chemical_capacitance_matrices: 'Mutual vs internal chemical capacitance, as capacitance matrices.',
        phi: 'Which φ? The microscopic potential, its smoothed average, and the working convention: why ions answer to none of them.',
        vacuum: 'The one honest potential: real, measurable, and ending at the surface.',
        inhomog: "Per-species quasi-electric fields: what replaces 'the electric field' inside materials.",
        data: 'Numerical data for ionic solutes’ V°ᵢ values in water.',
        translation: 'A Rosetta Stone: standard electrochemistry symbols and equations translated into Vᵢ terms.',
        about: 'How the ESBD project came about.',
        topics: 'Table of contents for the ESBD project.',
    },
};
