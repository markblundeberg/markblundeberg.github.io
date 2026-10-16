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

// The page's three LEDs: GaAs, which glows in the infrared, and two with the gaps of a red LED's
// and a blue one's light (630 and 460 nm, at E_g + kT/2), as GaAs with only its gap changed.
export const LEDS = [
  { key: 'ir', name: 'infrared', dEg: 0 },
  { key: 'red', name: 'red', dEg: HC / 630 - 0.5 * VT - CRYSTALS.GaAs.Eg },
  { key: 'blue', name: 'blue', dEg: HC / 460 - 0.5 * VT - CRYSTALS.GaAs.Eg },
].map((l) => ({ ...l, Eg: CRYSTALS.GaAs.Eg + l.dEg, nm: HC / (CRYSTALS.GaAs.Eg + l.dEg + 0.5 * VT) }));

// Each LED is a chip 0.32 mm square (10⁻³ cm², so 1 A/cm² is 1 mA), wired to the battery through
// its own resistor, as LEDs must be: alone, an LED takes as much current as it's offered.
export const CHIP = 1e-3, OHMS = 50;
// The energy a photon carries away, on average, eV: E_g + 3kT/2 (the spectrum's mean, near enough).
export const photonEnergy = (Eg) => Eg + 1.5 * VT;

// Where its electrons end up, per second, as currents (A/cm²): light, heat, and on through the
// diode to the far contact (or, for holes, the near one), from a solution.
export function fates(S) {
  const A = (r) => (r * FARADAY) / 1e4, J = Math.abs(S.current) / 1e4;
  const light = A(S.bulkReactions[0].total), heat = A(S.bulkReactions[1].total);
  return { J, light, heat, through: Math.max(0, J - light - heat) };
}

// The bands and levels across a diode, eV per electron, with the electrons' and holes' densities
// (per cm³) and the rates of light and of heat (per cm³ per s).
export function profile(S) {
  const of = (a, f) => Array.from(a, f), cm3 = (c) => (c * AVOGADRO) / 1e6;
  return {
    x: Array.from(S.x),
    region: Array.from(S.region),
    Ec: of(S.muStd['e-'], (m) => m / FARADAY),
    Ev: of(S.muStd['h+'], (m) => -m / FARADAY),
    Efn: of(S.mu['e-'], (m) => m / FARADAY),
    Efp: of(S.mu['h+'], (m) => -m / FARADAY),
    n: of(S.c['e-'], cm3),
    p: of(S.c['h+'], cm3),
    light: of(S.bulkReactions[0].rate, cm3),
    heat: of(S.bulkReactions[1].rate, cm3),
  };
}

// An LED's current at every voltage, from 0 to just past its gap, for wiring it to a battery: V
// (volts) and log₁₀ J (A/cm²), warm from point to point.
export function curve(led) {
  const V = [], logJ = [], top = led.opts.dEg + CRYSTALS.GaAs.Eg + 0.02;
  for (let v = 0.2; v <= top + 1e-9; v += v < top - 0.5 ? 0.05 : 0.01) {
    V.push(v);
    logJ.push(Math.log10(Math.max(1e-300, led.at(v).J)));
  }
  return { V, logJ };
}
// Wired to a battery of VB volts through OHMS: the LED's own voltage, where V + J·CHIP·OHMS = VB.
export function operate(c, VB) {
  const J = (v) => {
    const k = Math.min(c.V.length - 2, Math.max(0, c.V.findIndex((x) => x > v) - 1));
    const t = (v - c.V[k]) / (c.V[k + 1] - c.V[k]);
    return 10 ** (c.logJ[k] + t * (c.logJ[k + 1] - c.logJ[k]));
  };
  let lo = 0, hi = Math.min(VB, c.V.at(-1));
  if (!(VB > c.V[0])) return VB;
  for (let k = 0; k < 50; k++) {
    const m = (lo + hi) / 2;
    if (m + J(m) * CHIP * OHMS > VB) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}
