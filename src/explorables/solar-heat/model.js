// The solar cells behind every picture on this page: one silicon cell, a thin n⁺ emitter on a
// 180 µm p base with a p⁺ back layer, under the standard sun, solved with driftlet
// (https://github.com/markblundeberg/driftlet), from its solar-cell demo, at any temperature.
// A panel is 60 of these cells in series, so its voltage is 60 times one cell's.

import { Device, FARADAY, GAS_CONSTANT, AVOGADRO } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/index.js';
import { build, layer, ohmic, particles } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/kit.js';

export { particles }; // for the page's picture of the whole cell

export const KELVIN = 273.15, CELLS = 60;
const um = 1e-6, perCm3 = (n) => (n * 1e6) / AVOGADRO; // per cm³ → mol/m³
export const VT = (T) => (GAS_CONSTANT * T) / FARADAY;

// Silicon at temperature T (K). The band gap narrows as it warms (Varshni's fit, Eg(0) = 1.170 eV,
// from Sze, Physics of Semiconductor Devices); the bands' effective densities of states grow as
// T^1.5, and the mobilities fall as the lattice shakes harder (T^-2.42 and T^-2.2, Sze), with the
// diffusivities from them by Einstein's relation, D = μkT/q. At 300 K these are driftlet's own
// silicon (SEMICONDUCTORS.Si), but for the gap, 1.1245 eV rather than 1.12.
export const Eg = (T) => 1.17 - (4.73e-4 * T * T) / (T + 636);
export function silicon(T) {
  const t = T / 300;
  return {
    species: [
      { name: 'e-', z: -1 },
      { name: 'h+', z: 1 },
    ],
    materials: {
      Si: {
        epsr: 11.9,
        species: {
          'e-': { D: 1500e-4 * t ** -2.42 * VT(T), mu0: 0, cRef: perCm3(2.8e19 * t ** 1.5) },
          'h+': { D: 450e-4 * t ** -2.2 * VT(T), mu0: Eg(T) * FARADAY, cRef: perCm3(1.04e19 * t ** 1.5) },
        },
      },
    },
  };
}
// The intrinsic density n_i, from n_i² = N_c N_v e^{−E_g/kT}, per cm³.
export const ni = (T) => Math.sqrt(2.8e19 * 1.04e19 * (T / 300) ** 3 * Math.exp(-Eg(T) / VT(T)));

// The sun: the standard spectrum (ASTM G173-03, AM1.5 global, 1000 W/m²) in 10 nm bands from 300 to
// 1200 nm, each band's photon flux in mol/(m²·s); and silicon's absorption coefficient (1/cm) at
// each band's centre, from M. A. Green, Sol. Energy Mater. Sol. Cells 92, 1305 (2008), at 300 K.
export const FLUX = [4.855e-07, 3.517e-06, 8.602e-06, 1.208e-05, 1.379e-05, 1.57e-05, 1.949e-05, 2.135e-05, 2.037e-05, 2.484e-05, 3.909e-05, 4.167e-05, 4.219e-05, 4.365e-05, 5.336e-05, 5.874e-05, 6.058e-05, 6.272e-05, 6.2e-05, 6.49e-05, 6.509e-05, 6.419e-05, 6.716e-05, 6.924e-05, 6.958e-05, 7.085e-05, 7.113e-05, 7.137e-05, 7.289e-05, 7.23e-05, 7.459e-05, 7.479e-05, 7.412e-05, 7.606e-05, 7.653e-05, 7.45e-05, 7.823e-05, 7.926e-05, 7.31e-05, 7.398e-05, 7.647e-05, 7.145e-05, 6.59e-05, 7.297e-05, 7.703e-05, 7.438e-05, 4.605e-05, 7.606e-05, 7.538e-05, 7.263e-05, 7.236e-05, 6.306e-05, 6.285e-05, 6.743e-05, 7.034e-05, 6.835e-05, 6.923e-05, 6.946e-05, 6.846e-05, 5.909e-05, 5.35e-05, 5.058e-05, 5.317e-05, 2.133e-05, 2.648e-05, 2.858e-05, 4.23e-05, 5.099e-05, 5.881e-05, 6.194e-05, 6.07e-05, 6.036e-05, 5.945e-05, 5.883e-05, 5.792e-05, 5.683e-05, 5.52e-05, 5.461e-05, 5.27e-05, 4.9e-05, 4.247e-05, 2.314e-05, 1.099e-05, 1.729e-05, 1.803e-05, 2.505e-05, 3.854e-05, 4.313e-05, 4.14e-05, 4.448e-05];
export const ALPHA = [1.61e+06, 1.38e+06, 1.24e+06, 1.14e+06, 1.08e+06, 1.04e+06, 8.74e+05, 4.8e+05, 2.12e+05, 1.15e+05, 8.04e+04, 6.05e+04, 4.61e+04, 3.51e+04, 2.71e+04, 2.17e+04, 1.8e+04, 1.55e+04, 1.35e+04, 1.18e+04, 1.04e+04, 9.24e+03, 8.31e+03, 7.44e+03, 6.71e+03, 6.08e+03, 5.55e+03, 5.1e+03, 4.68e+03, 4.33e+03, 3.98e+03, 3.66e+03, 3.4e+03, 3.15e+03, 2.91e+03, 2.68e+03, 2.48e+03, 2.29e+03, 2.12e+03, 1.96e+03, 1.83e+03, 1.73e+03, 1.61e+03, 1.48e+03, 1.36e+03, 1.25e+03, 1.14e+03, 1.06e+03, 978, 888, 812, 740, 676, 618, 561, 506, 454, 406, 362, 322, 287, 255, 224, 196, 169, 145, 123, 104, 87.1, 71.1, 57.2, 45.2, 34.7, 26.1, 19.2, 13.5, 9.42, 7.04, 5.4, 4.06, 3.07, 2.32, 1.73, 1.22, 0.825, 0.534, 0.304, 0.12, 0.0484, 0.0281];
export const NM = FLUX.map((_, k) => 305 + 10 * k);
const HC = 1239.84198; // eV·nm
// The absorption at temperature T: the whole edge shifted with the gap (as it narrows, each photon
// is absorbed as one a little more energetic would be at 300 K). 1/m.
export function alphaAt(nm, T = 300) {
  const at = HC / (HC / nm + Eg(300) - Eg(T)), t = Math.min(Math.max((at - NM[0]) / 10, 0), NM.length - 1);
  const k = Math.min(Math.floor(t), NM.length - 2);
  return 100 * Math.exp(Math.log(ALPHA[k]) + (t - k) * Math.log(ALPHA[k + 1] / ALPHA[k]));
}

// The cell: an n⁺ emitter on a p base, with a p⁺ layer at the back that turns electrons back, and a
// contact on each face. Light enters the front, x = 0; none is reflected, and what reaches the back
// leaves.
export const WE = 0.3 * um, WB = 180 * um, WBSF = 1 * um, W = WE + WB + WBSF;
export const ND = perCm3(1e19), NA = perCm3(1e16), NBSF = perCm3(1e19);
// Recombination, e⁻ + h⁺ ⇌ 0 at rate k_f(np − n_i²): the base's electrons live τ = 1/(k_f N_A) =
// 100 µs, and in the heavily doped layers the minority carriers a thousand times less.
export const TAU = 100e-6, KF = 1 / (TAU * NA);

// Where the sun makes electron–hole pairs: G(x) = Σ Φ α e^{−αx} over the bands, mol/(m³·s), as a
// profile on points spaced geometrically from the front (they need to be close where the blue is
// absorbed, in the first tens of nm).
export function generation(T, sun) {
  const alphas = NM.map((nm) => alphaAt(nm, T));
  const x = [0, ...Array.from({ length: 500 }, (_, j) => 1e-11 * (W / 1e-11) ** (j / 499))];
  return { x, values: x.map((xx) => alphas.reduce((g, a, k) => g + sun * FLUX[k] * a * Math.exp(-a * xx), 0)) };
}
// The pairs made in the cell, per second, mol/(m²·s): what the light can deliver, at most.
export const absorbed = (T, sun) => NM.reduce((s, nm, k) => s - sun * FLUX[k] * Math.expm1(-alphaAt(nm, T) * W), 0);

export function cell(T, sun, V = 0) {
  return build({
    T,
    library: [silicon(T)],
    stack: [ohmic(0), layer('Si', WE, { name: 'n⁺', donors: ND }), layer('Si', WB, { name: 'p', acceptors: NA }), layer('Si', WBSF, { name: 'p⁺', acceptors: NBSF }), ohmic(V)],
    bulkReactions: [
      { equation: 'e- + h+ = 0', kf: { Si: KF } },
      // The photons' μ is set at the gap's edge, the least a photon here has; the reverse, a pair
      // recombining into the light, is then negligible however the levels split.
      ...(sun > 0 ? [{ equation: 'photon = e- + h+', fixed: { photon: (HC / 1200) * FARADAY }, kf: { Si: generation(T, sun) } }] : []),
    ],
    grid: { hmin: 0.25e-9, hmax: 2 * um },
  });
}

// A cell at a temperature and a sun, its terminal driven as asked. Currents in mA/cm², the
// photocurrent positive (holes to the back), so the power out is V·J, mW/cm².
export class Cell {
  constructor(T, sun) {
    this.T = T;
    this.sun = sun;
    this.dev = new Device(cell(T, sun));
    this.solution = this.dev.solve();
  }
  // a new temperature or sun, the state carried over as a start
  set(T, sun) {
    this.T = T;
    this.sun = sun;
    const { contacts, ...def } = cell(T, sun);
    this.dev.set(def);
    return this;
  }
  at(V) {
    this.dev.set({ contacts: { right: { V } } });
    this.solution = this.dev.solve();
    return this.solution.current / 10;
  }
  openCircuit() {
    this.dev.set({ contacts: { right: { I: 0 } } });
    this.solution = this.dev.solve();
    return this.solution.terminals.right.V;
  }
  // the most power: V·J at its peak, by golden section between 0.7 and 0.95 of V_oc
  maxPower(Voc = this.openCircuit()) {
    const g = (Math.sqrt(5) - 1) / 2, P = (V) => V * this.at(V);
    let a = 0.7 * Voc, b = 0.95 * Voc;
    let c = b - g * (b - a), d = a + g * (b - a), Pc = P(c), Pd = P(d);
    while (b - a > 2e-4) {
      if (Pc > Pd) {
        b = d, d = c, Pd = Pc;
        c = b - g * (b - a), Pc = P(c);
      } else {
        a = c, c = d, Pc = Pd;
        d = a + g * (b - a), Pd = P(d);
      }
    }
    const V = (a + b) / 2, J = this.at(V);
    return { V, J, P: V * J };
  }
  // short circuit, open circuit and the most power
  measure() {
    const Jsc = this.at(0), Voc = this.openCircuit(), mp = this.maxPower(Voc);
    return { T: this.T, sun: this.sun, Jsc, Voc, Vmp: mp.V, Jmp: mp.J, Pmax: mp.P, FF: mp.P / (Jsc * Voc) };
  }
}

// Where the pairs the light makes go, mol/(m²·s): delivered (out through the front contact and round
// the circuit), or lost: holes reaching the front contact, where they meet its electrons;
// recombining in the emitter or the base; or at the back, in the p⁺ layer or electrons reaching the
// back contact. They add up to what's made (to round-off).
export function fates(S) {
  const rec = S.bulkReactions[0].regions;
  return {
    made: S.bulkReactions[1]?.total ?? 0,
    delivered: S.current / FARADAY,
    front: -S.contacts.left.flux['h+'] + rec[0],
    base: rec[1],
    back: rec[2] + S.contacts.right.flux['e-'],
  };
}

// The energies across the cell, eV per electron: the band edges E_c and E_v, and the quasi-Fermi
// levels E_Fn and E_Fp, whose split is the cell's voltage at its contacts.
export function levels(S) {
  const of = (a, f) => Array.from(a, f);
  return {
    x: Array.from(S.x),
    Ec: of(S.muStd['e-'], (m) => m / FARADAY),
    Ev: of(S.muStd['h+'], (m) => -m / FARADAY),
    Efn: of(S.mu['e-'], (m) => m / FARADAY),
    Efp: of(S.mu['h+'], (m) => -m / FARADAY),
  };
}
// The hill electrons must climb to leak back: how far E_c rises from the emitter to the base (taken
// at x = 0.1 µm and 1.5 µm, either side of the junction's depleted layer), eV.
export function hill(S) {
  const at = (x) => S.x.findIndex((v) => v >= x), Ec = (g) => S.muStd['e-'][g] / FARADAY;
  return Ec(at(1.5 * um)) - Ec(at(0.1 * um));
}

// A panel: CELLS cells in series, each AREA in size (15.6 cm square), at one temperature and sun;
// its current–voltage curve, its best operating point, and its state at any voltage.
export const AREA = 243; // cm²
export const panel = {
  V: (cellV) => CELLS * cellV, // V
  A: (J) => (J * AREA) / 1000, // mA/cm² → A
  W: (P) => (CELLS * P * AREA) / 1000, // mW/cm² → W
};
export class Panel {
  constructor(T, sun) {
    this.cell = new Cell(T, sun);
    this.set(T, sun);
  }
  set(T, sun) {
    const c = this.cell.set(T, sun);
    Object.assign(this, c.measure());
    this.short = fates((c.at(0), c.solution));
    // the curve from short circuit to just past open circuit, warm from point to point
    this.curve = { V: [], J: [] };
    for (let k = 0; k <= 40; k++) {
      const V = (k / 40) * 1.01 * this.Voc;
      this.curve.V.push(V);
      this.curve.J.push(c.at(V));
    }
    return this;
  }
  // the panel held at a cell voltage V: its current, power and state
  operate(V) {
    const J = this.cell.at(V), S = this.cell.solution;
    return { V, J, P: V * J, leak: this.Jsc - J, S, fates: fates(S), hill: hill(S) };
  }
}
