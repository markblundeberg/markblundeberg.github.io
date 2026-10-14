// The battery behind every picture on this page: a toy thin-film lithium-ion cell,
// graphite | liquid electrolyte | iron phosphate (LFP), solved live with driftlet
// (https://github.com/markblundeberg/driftlet), and the charger that drives it.

import { Device, FARADAY, GAS_CONSTANT } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/index.js';
import { build, layer } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/kit.js';

// Each host is a lattice of sites for lithium, filled to a fraction x, with an open-circuit
// voltage against lithium metal from a regular solution (interaction Ω):
//   E(x) = E0 − (RT/F) ln(x/(1−x)) + (Ω/F)(2x − 1)
// so lithium's chemical potential in it is μ_Li = −F E(x), with lithium metal at zero.
export const RT = GAS_CONSTANT * 298.15;
export const GR = { name: 'graphite', cMax: 30000, Om: 1.0 * RT, E0: 0.1, D: 1.5e-15 };
export const LFP = { name: 'iron phosphate', cMax: 22800, Om: 1.9 * RT, E0: 3.42, D: 5e-14 };
export const La = 2.2e-6, Ls = 3e-6, Lc = 2.5e-6, L = La + Ls + Lc, SALT = 1000;
export const X_EMPTY = { a: 0.02, c: 0.97 };
export const Q = LFP.cMax * Lc * FARADAY; // capacity, C/m² (the phosphate's; the graphite has 15% spare)
export const C1 = Q / 3600; // 1C, A/m²
export const VMAX = 3.65, VMIN = 2.8, MARGIN = 0.015;
export { FARADAY };
const mu0 = (h) => -h.E0 * FARADAY + h.Om;
export const E = (h, x) => -(mu0(h) + RT * Math.log(x / (1 - x)) - 2 * h.Om * x) / FARADAY;

const host = (h) => ({
  epsr: 0,
  species: { 'Li+': { D: h.D, mu0: mu0(h), cRef: h.cMax }, 'e-': { D: 1e-6, mu0: 0, cRef: h.cMax } },
  statistics: [{ type: 'insertion', species: ['Li+', 'e-'], cMax: h.cMax, A: [h.Om] }],
});
// Li⁺ crosses each surface through a charge-transfer resistance (about 2.5 A/m² of exchange current).
const surface = { species: { 'Li+': { type: 'conductance', G: 100 } } };
function definition() {
  return build({
    species: [{ name: 'Li+', z: 1 }, { name: 'e-', z: -1 }, { name: 'PF6-', z: -1 }],
    materials: {
      graphite: host(GR),
      lfp: host(LFP),
      electrolyte: { epsr: 0, species: { 'Li+': { D: 3e-11, mu0: 0, cRef: 1000 }, 'PF6-': { D: 5e-11, mu0: 0, cRef: 1000 } } },
    },
    stack: [
      { V: 0, terminal: 'e-', species: { 'e-': 'equilibrium' }, phi: 'bulk' }, // copper
      layer('graphite', La, { c0: { 'Li+': X_EMPTY.a * GR.cMax, 'e-': X_EMPTY.a * GR.cMax } }),
      surface,
      layer('electrolyte', Ls, { c0: { 'Li+': SALT, 'PF6-': SALT } }),
      surface,
      layer('lfp', Lc, { c0: { 'Li+': X_EMPTY.c * LFP.cMax, 'e-': X_EMPTY.c * LFP.cMax } }),
      { V: E(LFP, X_EMPTY.c) - E(GR, X_EMPTY.a), terminal: 'e-', species: { 'e-': 'equilibrium' }, phi: 'bulk' }, // aluminium
    ],
    grid: { hmin: 10e-9, hmax: 80e-9, ratio: 1.1 },
  });
}

// Reading a solution: the lithium in each part, the state of charge, each host's filling at its
// surface and on average, and the plating margin: the graphite's electrons against the Li⁺ arriving
// beside them, V_e⁻ − V_Li⁺ (lithium metal can form where it's negative).
export function read(S) {
  let g = 0, e = 0, c = 0;
  for (let k = 1; k < S.x.length; k++) {
    if (S.region[k] !== S.region[k - 1]) continue;
    const a = 0.5 * (S.c['Li+'][k] + S.c['Li+'][k - 1]) * (S.x[k] - S.x[k - 1]), r = S.region[k];
    if (r === 0) g += a; else if (r === 1) e += a; else c += a;
  }
  const ia = S.region.lastIndexOf(0), ic = S.region.indexOf(2), n = S.x.length - 1;
  const xa = g / (GR.cMax * La), xc = c / (LFP.cMax * Lc);
  return {
    soc: (X_EMPTY.c - xc) / X_EMPTY.c, xa, xc, ia, ic,
    xsa: S.c['Li+'][ia] / GR.cMax, xsc: S.c['Li+'][ic] / LFP.cMax,
    V: S.terminalVoltage, ocv: E(LFP, xc) - E(GR, xa),
    margin: S.V['e-'][ia] - S.V['Li+'][ia + 1],
    // Where the volts go, from the anode's collector to the cathode's (they sum to V):
    ledger: {
      ocv: E(LFP, xc) - E(GR, xa), // the rest voltage at this charge
      solids: (S.V['e-'][n] - S.V['Li+'][ic]) - E(LFP, xc) - ((S.V['e-'][0] - S.V['Li+'][ia]) - E(GR, xa)), // lithium piled up or drained inside each host
      surfaces: (S.V['Li+'][ic] - S.V['Li+'][ic - 1]) + (S.V['Li+'][ia + 1] - S.V['Li+'][ia]), // crossing in and out
      electrolyte: S.V['Li+'][ic - 1] - S.V['Li+'][ia + 1],
    },
  };
}

// The cell and its charger. mode: 'charge' (constant current up to a voltage ceiling, then constant
// voltage: CC–CV), 'use' (constant current down to a floor) or 'rest'. With `watch`, the charger also
// holds the graphite's plating margin above 15 mV.
export class Cell {
  constructor() {
    this.dev = new Device(definition());
    this.dev.solve();
    this.dev.set({ contacts: { right: { V: undefined, I: 0 } } });
    this.mode = 'rest';
    this.rate = 4; // C-rate asked for
    this.watch = false;
    this.I = 0;
    this.state = read(this.dev.solution());
    this.trace = []; // { soc, V, I (C-rate), t, mode, plating }
    this.events = []; // what happened, for the page to show
    this.plated = 0; // seconds spent past the plating line
    this.u = null;
    this.dt = Infinity;
  }
  get time() { return this.dev.solver.time; }
  get solution() { return this.dev.solution(); }
  setI(I) {
    this.I = I;
    this.dev.set({ contacts: { right: { V: undefined, I } } });
  }
  setMode(mode) {
    this.mode = mode;
    this.cv = false;
    this.dt = Infinity;
    this.u = null;
    this.setI(mode === 'charge' ? this.rate * C1 : mode === 'use' ? -this.rate * C1 : 0);
    this.mark();
  }
  setRate(rate) {
    this.rate = rate;
    if (this.mode === 'charge' && !this.cv) this.setI(rate * C1); // (watching, the charger brings it back down if it must)
    if (this.mode === 'use') this.setI(-rate * C1);
  }
  mark() { this.trace.push({ ...this.point(), gap: true }); }
  point() { return { soc: this.state.soc, V: this.state.V, I: this.I / C1, t: this.time, mode: this.mode, plating: this.state.margin < 0 }; }

  // Advance toward simulated time t, in steps short enough to follow the surfaces and the charger,
  // for at most budgetMs of computing. Returns false if a step failed (the cell is left at rest).
  advance(t, budgetMs = Infinity) {
    const start = performance.now();
    while (this.time < t - 1e-6 && performance.now() - start < budgetMs) {
      const t0 = this.time, C = Math.abs(this.I) / C1;
      const dtMax = Math.min(C > 0 ? 3600 / C / 300 : 600, this.mode === 'charge' && this.watch && !this.cv ? 3600 / Math.max(this.rate, 0.1) / 800 : Infinity);
      const s = this.dev.advance(t0 + Math.min(t - t0, dtMax, this.dt));
      if (!s.converged) {
        this.setMode('rest');
        this.events.push({ t: this.time, kind: 'stuck' });
        return false;
      }
      const st = (this.state = read(this.dev.solution()));
      // Each host's surface filling, as ln(x/(1−x)), which its voltage follows and which diverges as
      // the surface fills or empties: the next step moves it by at most 0.25 (about 6 mV).
      const u = [st.xsa, st.xsc].map((x) => Math.log(x / (1 - x))), took = Math.max(s.time - t0, 1e-12);
      const rate = this.u ? Math.max(...u.map((v, j) => Math.abs(v - this.u[j]))) / took : 0;
      this.u = u;
      this.dt = rate > 0 ? Math.max(1e-6, 0.25 / rate) : Infinity;
      if (st.margin < 0 && this.I > 0) this.plated += took;
      if (this.mode === 'charge' && this.cv) {
        // Constant voltage: the solver finds the current, which falls as the hosts even out.
        this.I = -this.dev.solution().current;
        if (this.I < 0.05 * C1) {
          this.events.push({ t: this.time, kind: 'full' });
          this.setMode('rest');
        }
      } else if (this.mode === 'charge') {
        // Constant current, as much as asked for or (watching) as keeps the graphite's plating margin
        // at 15 mV, smoothly; at the voltage ceiling, constant voltage.
        if (this.watch) this.setI(Math.min(this.rate * C1, this.I * Math.exp(Math.max(-0.04, Math.min(0.02, (st.margin - MARGIN) / 0.05)))));
        if (st.V >= VMAX) {
          this.cv = true;
          this.dev.set({ contacts: { right: { V: VMAX, I: undefined } } });
        }
      } else if (this.mode === 'use' && st.V <= VMIN) {
        this.events.push({ t: this.time, kind: 'empty' });
        this.setMode('rest');
      }
      const last = this.trace.at(-1);
      if (!last || Math.abs(st.soc - last.soc) > 0.002 || Math.abs(st.V - last.V) > 0.003 || this.time - last.t > 120) this.trace.push(this.point());
      if (this.trace.length > 4000) this.trace.splice(0, 1000);
    }
    return true;
  }
}

// The open-circuit voltage against state of charge: both hosts evenly filled, lithium conserved.
export function ocvCurve(n = 120) {
  const total = X_EMPTY.a * GR.cMax * La + X_EMPTY.c * LFP.cMax * Lc, out = [];
  for (let k = 0; k <= n; k++) {
    const soc = 0.005 + (0.99 * k) / n, xc = X_EMPTY.c * (1 - soc), xa = (total - xc * LFP.cMax * Lc) / (GR.cMax * La);
    out.push({ soc, V: E(LFP, xc) - E(GR, xa), xa, xc });
  }
  return out;
}
