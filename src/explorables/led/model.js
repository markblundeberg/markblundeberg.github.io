// The LEDs behind every picture on this page: a p–n junction of one semiconductor, driven forward,
// solved with driftlet (https://github.com/markblundeberg/driftlet). Electrons and holes meet and
// recombine two ways: by giving off a photon (radiative), or through a defect, giving the energy to
// the crystal as heat (Shockley–Read–Hall). The light is the first.

import { Device, FARADAY, GAS_CONSTANT, AVOGADRO } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/index.js';
import { build, layer, ohmic, particles } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/kit.js';

export { particles };

export const T = 300;
const perCm3 = (n) => (n * 1e6) / AVOGADRO; // per cm³ → mol/m³
export const VT = (GAS_CONSTANT * T) / FARADAY;
export const HC = 1239.84198; // eV·nm

// The semiconductors, at 300 K: gap (eV), effective densities of states (per cm³), mobilities
// (cm²/Vs), permittivity, the radiative coefficient B (cm³/s; the rate of light is B·n·p) and the
// defects' lifetime (s). GaAs and Si as in driftlet's SEMICONDUCTORS (Sze); B for GaAs 7.2e-10
// (Ioffe NSM archive), for Si 4.73e-15 (Trupke et al., J. Appl. Phys. 94, 4930, 2003). The lifetimes
// are those of good material: 100 ns in GaAs, 10 µs in silicon. Al₀.₃Ga₀.₇As, the wider-gap crystal
// that walls the light-making layer in, from the Ioffe archive's fits in the aluminium fraction x
// (E_g = 1.424 + 1.247x, the electrons' and holes' masses, mobilities), still a direct gap at x = 0.3.
export const CRYSTALS = {
  GaAs: { Eg: 1.424, Nc: 4.7e17, Nv: 7.0e18, mun: 8500, mup: 400, epsr: 13.1, B: 7.2e-10, tau: 1e-7 },
  AlGaAs: { Eg: 1.798, Nc: 7.8e17, Nv: 8.6e18, mun: 2300, mup: 145, epsr: 12.2, B: 7.2e-10, tau: 1e-7 },
  Si: { Eg: 1.12, Nc: 2.8e19, Nv: 1.04e19, mun: 1500, mup: 450, epsr: 11.9, B: 4.73e-15, tau: 1e-5 },
};
// Where GaAs meets Al₀.₃Ga₀.₇As, the conduction band steps up 0.23 eV and the valence band down
// 0.14 eV: the gap's 0.374 eV difference split about 62:38 (Ioffe; Adachi, GaAs and Related
// Materials).
export const DEC = 0.23;
// "a gap of …": every crystal shifted by the same amount, so that only the gap changes (real red
// and blue LEDs are other crystals, with other numbers too).
export const shifted = (c, dEg) => ({ ...c, Eg: c.Eg + dEg });

function material(c) {
  return {
    epsr: c.epsr,
    species: {
      'e-': { D: c.mun * 1e-4 * VT, mu0: 0, cRef: perCm3(c.Nc) },
      'h+': { D: c.mup * 1e-4 * VT, mu0: c.Eg * FARADAY, cRef: perCm3(c.Nv) },
    },
  };
}
export const ni = (c) => Math.sqrt(c.Nc * c.Nv * Math.exp(-c.Eg / VT));

// Two diodes. 'plain': an n layer on a p layer of one crystal (GaAs, or silicon), a contact on each
// face. 'walled': the real design of the 1970s on, a thin p layer of GaAs between walls of the
// wider-gap crystal, n on one side and p on the other (a double heterostructure), so that the
// electrons and holes are held in the same thin layer until they meet.
export const um = 1e-6;
export const ND = perCm3(1e18), NA = perCm3(1e17);
export const PLAIN = { n: 1 * um, p: 3 * um }, WALLED = { wall: 1 * um, active: 0.5 * um };

export function diode({ kind = 'walled', crystal = 'GaAs', dEg = 0 } = {}, V = 0) {
  const c = shifted(CRYSTALS[crystal], dEg), w = shifted(CRYSTALS.AlGaAs, dEg);
  const rec = (m, x) => [
    // light: e⁻ + h⁺ → photon, at B(np − n_i²)
    { equation: 'e- + h+ = 0', kf: Object.fromEntries(m.map((k, i) => [k, x[i].B * 1e-6 * AVOGADRO])) },
    // heat, through defects
    { equation: 'e- + h+ = 0', srh: Object.fromEntries(m.map((k, i) => [k, { tauN: x[i].tau, tauP: x[i].tau }])) },
  ];
  if (kind === 'plain')
    return build({
      T,
      library: [{ species: SPECIES, materials: { X: material(c) } }],
      stack: [ohmic(0), layer('X', PLAIN.n, { name: 'n', donors: ND }), layer('X', PLAIN.p, { name: 'p', acceptors: NA }), ohmic(V)],
      bulkReactions: rec(['X'], [c]),
      grid: { hmin: 0.5e-9, hmax: 0.05 * um },
    });
  const step = (dE) => ({ step: { species: 'e-', value: dE * FARADAY } });
  return build({
    T,
    library: [{ species: SPECIES, materials: { X: material(c), W: material(w) } }],
    stack: [ohmic(0), layer('W', WALLED.wall, { name: 'n wall', donors: ND }), step(-DEC), layer('X', WALLED.active, { name: 'p', acceptors: NA }), step(DEC), layer('W', WALLED.wall, { name: 'p wall', acceptors: NA }), ohmic(V)],
    bulkReactions: rec(['X', 'W'], [c, w]),
    grid: { hmin: 0.5e-9, hmax: 0.02 * um },
  });
}
const SPECIES = [
  { name: 'e-', z: -1 },
  { name: 'h+', z: 1 },
];

// A diode driven at V (volts across it, p side positive): its current (A/cm², forward positive),
// its light and heat (each as a current, A/cm²: the electrons that end that way), and what's left,
// the electrons that cross the whole p layer and reach its contact.
export class LED {
  constructor(opts) {
    this.opts = opts;
    this.dev = new Device(diode(opts, 0));
    this.solution = this.dev.solve();
  }
  at(V) {
    // step up in small steps from where it was, so the solver always starts close
    const from = this.V ?? 0, n = Math.max(1, Math.ceil(Math.abs(V - from) / 0.05));
    for (let k = 1; k <= n; k++) {
      this.dev.set({ contacts: { right: { V: from + ((V - from) * k) / n } } });
      this.solution = this.dev.solve();
    }
    this.V = V;
    return this.read();
  }
  read() {
    const S = this.solution, A = (r) => (r * FARADAY) / 1e4;
    return { V: this.V, J: Math.abs(S.current) / 1e4, light: A(S.bulkReactions[0].total), heat: A(S.bulkReactions[1].total), S };
  }
  // the voltage that drives a current J (A/cm²), by bisection on log J
  drive(J, lo = 0.3, hi = 3.5) {
    for (let k = 0; k < 40; k++) {
      const m = (lo + hi) / 2;
      if (this.at(m).J > J) hi = m;
      else lo = m;
    }
    return this.at((lo + hi) / 2);
  }
}

// The light's spectrum: photons per energy, in proportion to E² α(E) e^{−E/kT} (van Roosbroeck and
// Shockley), with the absorption of a direct gap, α ∝ √(E − E_g). Energies in eV.
export const spectrum = (Eg, E) => (E <= Eg ? 0 : E * E * Math.sqrt(E - Eg) * Math.exp(-(E - Eg) / VT));
