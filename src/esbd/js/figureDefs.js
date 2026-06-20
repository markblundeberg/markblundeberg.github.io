// figureDefs.js
// Canonical species definitions and region presets for ESBD figures.
// Single source of truth so colours and labels stay consistent across every
// diagram (and consistent with the prose). Import what a figure needs:
//
//     import { SPECIES, REGION } from '{{ esbdJsPath }}figureDefs.js';
//     const speciesInfo = { electron: SPECIES.electron, ferrous: SPECIES.ferrous };
//     diagram.setSpatialLayout(boundaries, [
//         { ...REGION.metal, name: 'Inert metal' },   // override name as needed
//         REGION.solution,
//     ]);
//
// Colours are drawn from the equilibrium.md figures (the palette Mark likes).
// NOTE: the solutions.md full-ladder figure is a deliberate exception — it
// colours ions by valence, not by this palette.

/** Charge carriers: { z, color, mathLabel }. */
export const SPECIES = {
    electron: { z: -1, color: '#377EB8', mathLabel: '\\mathrm{e}^{-}' },
    lithium: { z: 1, color: '#E41A1C', mathLabel: '\\mathrm{Li}^{+}' },
    sodium: { z: 1, color: '#d87E37', mathLabel: '\\mathrm{Na}^{+}' },
    potassium: { z: 1, color: '#B84E63', mathLabel: '\\mathrm{K}^{+}' },
    proton: { z: 1, color: '#c04040', mathLabel: '\\mathrm{H}^{+}' },
    hydroxide: { z: -1, color: '#40a0a0', mathLabel: '\\mathrm{OH}^{-}' },
    chloride: { z: -1, color: '#80B030', mathLabel: '\\mathrm{Cl}^{-}' },
    nitrate: { z: -1, color: '#30B090', mathLabel: '\\mathrm{NO_3}^{-}' },
    silver: { z: 1, color: '#E6AB02', mathLabel: '\\mathrm{Ag}^{+}' },
    zinc: { z: 2, color: '#c04060', mathLabel: '\\mathrm{Zn}^{2+}' },
    ferrous: { z: 2, color: '#bba442', mathLabel: '\\mathrm{Fe}^{2+}' },
    ferric: { z: 3, color: '#a01808', mathLabel: '\\mathrm{Fe}^{3+}' },
};

/**
 * Region presets: { name, color }. Spread into a setSpatialLayout region entry,
 * overriding the name where a specific material is meant:
 *     { ...REGION.metal, name: 'Silver wire' }
 * The *2 variants are slightly shifted shades for heterojunction / two-phase
 * figures (silicon|silicon, water|water, etc.).
 */
export const REGION = {
    vacuum: { name: 'Vacuum', color: '#f8f8f8' },
    metal: { name: 'Metal', color: '#E0E0E0' },
    solution: { name: 'Solution', color: '#E6F5FF' },
    solution2: { name: 'Solution', color: '#eaf6ff' },
    semiconductor: { name: 'Semiconductor', color: '#d2d8e0' },
    semi2: { name: 'Semiconductor', color: '#dcd6c8' },
    solid: { name: 'Solid', color: '#eeeeee' },
};
