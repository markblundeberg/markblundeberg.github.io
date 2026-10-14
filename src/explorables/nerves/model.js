// The nerves behind every picture on this page: three axons, each a line of axoplasm with Hodgkin
// and Huxley's channels in its membrane, solved live with driftlet
// (https://github.com/markblundeberg/driftlet), from its propagation and myelin demos.
//   bare    a thin axon, 5 µm in radius, its membrane full of channels all along
//   myelin  the same axon wrapped in myelin, leaving channels only at nodes of Ranvier
//   squid   a squid's giant axon, 238 µm in radius (Hodgkin and Huxley's own), bare
// The ions inside (K⁺, Na⁺, Cl⁻ and impermeant anions) diffuse and drift along the axon; the
// membrane is a port to the sea water (or body fluid) outside, held at φ = 0.

import { Device, FARADAY, GAS_CONSTANT } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/index.js';
import { hodgkinHuxley, injector, pulse } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/kit.js';

const mV = 1e-3;
export const z = { 'Na+': 1, 'K+': 1, 'Cl-': -1, 'A-': -1 };
export const T = 273.15 + 18.5, VT = (GAS_CONSTANT * T) / FARADAY;
// Hodgkin and Huxley's squid: concentrations putting each ion's Nernst potential at their reversal
// potentials at 18.5 °C, and their channels (S/m² of membrane).
export const IN = { 'Na+': 50, 'K+': 400, 'Cl-': 52.5, 'A-': 397.5 };
const E0 = { 'Na+': 50 * mV, 'K+': -77 * mV, 'Cl-': -54.387 * mV };
export const OUT = Object.fromEntries(['Na+', 'K+', 'Cl-'].map((s) => [s, IN[s] * Math.exp((z[s] * E0[s]) / VT)]));
export const G = { 'Na+': 1200, 'K+': 360, 'Cl-': 3 };
// The small ions' diffusivity, for their axoplasm's resistivity, 35.4 Ω·cm; the anions barely move.
const DA = 1e-11;
export const D = (1 / 0.354 / ((FARADAY * FARADAY) / (GAS_CONSTANT * T)) - DA * IN['A-']) / (IN['Na+'] + IN['K+'] + IN['Cl-']);

export const L = 0.02; // each axon's length, m: the race is end to end
export const THIN = 5e-6, SQUID = 238e-6, NODE = 1e-6;
export const KINDS = ['bare', 'myelin', 'squid'];
export const RADIUS = { bare: THIN, myelin: THIN, squid: SQUID };
// The wrapping: its layers, the node spacing (m), and the nodes' channels against bare membrane's (real
// nodes pack sodium channels far more densely than bare membrane does).
export const MYELIN = { wraps: 200, gap: 1e-3, gNode: 5 };
const SETTLE = 30e-3; // s, to rest before anything fires

const sealed = { species: { 'Na+': 'blocked', 'K+': 'blocked', 'Cl-': 'blocked', 'A-': 'blocked' }, phi: 'neutral' };
const channels = (am, g = 1) => hodgkinHuxley({ T, area: am, g: { Na: g * G['Na+'], K: g * G['K+'], leak: G['Cl-'] } });
const membrane = (name, region, am, g) => {
  const hh = channels(am, g);
  return { name, region, V: 0, area: am, capacitance: { C: 0.01, zeroCharge: 0 }, bath: { c: OUT }, gates: hh.gates, species: hh.species };
};
// The stimulus: K⁺ injected at the left end, the same charge per area of membrane in each axon.
const STIM = { bare: { to: 20e-6, I: 600, width: 0.1e-3 }, myelin: { to: NODE, I: 100, width: 0.1e-3 }, squid: { to: 1e-3, I: 30, width: 0.2e-3 } };

function definition(kind, p, fireAt, L) {
  const am = 2 / RADIUS[kind], s = STIM[kind];
  const I = fireAt === null ? 0 : pulse({ start: fireAt, width: s.width, amplitude: s.I });
  const regions = [], ports = [];
  if (kind === 'myelin') {
    const n = Math.floor(L / (NODE + p.gap)) + 1;
    for (let k = 0; k < n; k++) {
      regions.push({ name: `node${k}`, material: 'axoplasm', length: NODE, c0: IN });
      ports.push(membrane(`node${k}`, `node${k}`, am, p.gNode));
      if (k === n - 1) break;
      regions.push({ name: `internode${k}`, material: 'axoplasm', length: p.gap, c0: IN });
      // myelin: no channels, and the capacitance of so many membranes in series
      ports.push({ name: `myelin${k}`, region: `internode${k}`, V: 0, area: am, capacitance: { C: 0.01 / p.wraps, zeroCharge: 0 } });
    }
    ports.push(injector({ name: 'stim', region: 'node0', from: 0, to: s.to, species: 'K+', I }));
  } else {
    regions.push({ name: 'axon', material: 'axoplasm', length: L, c0: IN });
    ports.push(membrane('membrane', 'axon', am, 1));
    ports.push(injector({ name: 'stim', region: 'axon', from: 0, to: s.to, species: 'K+', I }));
  }
  return {
    T,
    species: Object.entries(z).map(([name, zz]) => ({ name, z: zz })),
    materials: { axoplasm: { epsr: 0, species: Object.fromEntries(Object.keys(z).map((sp) => [sp, { D: sp === 'A-' ? DA : D, mu0: 0, cRef: 1000 }])) } },
    regions,
    contacts: { left: sealed, right: sealed },
    ports,
    grid: kind === 'myelin' ? { hmin: 0.5e-6, hmax: 50e-6, ratio: 1.5 } : kind === 'squid' ? { hmin: 2e-4, hmax: 2e-4 } : { hmin: 10e-6, hmax: 50e-6, ratio: 1.3 },
  };
}

// The arrival line: where the spike's arrival is timed, as it crosses −30 mV going up.
const UP = -30 * mV;

// One axon: settled to rest, then fired on request. Times are from the firing (t = 0 at the pulse).
// (Rest is where it settles in 30 ms, not a steady state: with no pumps, this model's only true
// steady state has every ion's flux zero, which is a nerve run down, near −14 mV. So it's settled
// in time; pass settle = false to do that in budgeted pieces, with settle(ms), until ready.)
export class Nerve {
  constructor(kind, p = MYELIN, length = L, settle = true) {
    this.kind = kind;
    this.p = { ...p };
    this.def = (at) => definition(kind, this.p, at, length);
    this.dev = new Device(this.def(null));
    this.ready = false;
    if (settle) this.settle();
    this.fired = null; // device time of the latest firing
    this.front = null; // where the spike has reached: the furthest x past −30 mV since firing
    this.arrived = null; // when it reached the far end
    this.end = this.dev.solution().x.at(-1);
    this.spots = Array.from({ length: 41 }, (_, i) => (i / 40) * this.end); // timed along the axon
    this.at = this.spots.map(() => NaN); // when the spike reached each spot, s after firing
  }
  settle(budgetMs = Infinity) {
    if (!this.ready) this.ready = this.dev.advance(SETTLE, { tol: 1e-4, budgetMs }).done;
    this.sol = null;
    return this.ready;
  }
  get time() { return this.fired === null ? 0 : this.dev.solver.time - this.fired; }
  fire() {
    const now = this.dev.solver.time;
    this.fired = now + 1e-6;
    this.dev.set(this.def(this.fired));
    this.sol = null;
    this.front = null;
    this.arrived = null;
    this.last = null;
    this.at.fill(NaN);
  }
  // Advance to t after the firing (or by dt at rest), for at most budgetMs; returns whether it got there.
  advance(t, budgetMs = Infinity) {
    const target = this.fired === null ? this.dev.solver.time + t : this.fired + t;
    const probes = this.spots.map((x) => ({ x, quantity: 'phi' }));
    this.sol = null;
    const sol = this.dev.advance(target, { tol: 1e-4, dtMax: this.kind === 'squid' ? 10e-6 : 5e-6, budgetMs, probes });
    if (this.fired !== null) {
      // (each call's readings, joined to the last call's last, so a crossing between calls counts)
      const ts = [this.last?.t ?? NaN, ...sol.trace.t], pr = this.spots.map((_, j) => [this.last?.v[j] ?? NaN, ...sol.trace.probes[j]]);
      for (let j = 0; j < this.spots.length; j++)
        for (let i = 1; i < ts.length; i++)
          if (Number.isNaN(this.at[j]) && ts[i] > this.fired && pr[j][i - 1] < UP && pr[j][i] >= UP)
            this.at[j] = ts[i - 1] + ((ts[i] - ts[i - 1]) * (UP - pr[j][i - 1])) / (pr[j][i] - pr[j][i - 1]) - this.fired;
      if (sol.trace.t.length) this.last = { t: ts.at(-1), v: pr.map((r) => r.at(-1)) };
      const k = this.at.findLastIndex((v) => Number.isFinite(v));
      if (k >= 0) this.front = this.spots[k];
      if (Number.isFinite(this.at.at(-1)) && this.arrived === null) this.arrived = this.at.at(-1);
    }
    return sol.done;
  }
  // Its speed so far (m/s): between the furthest spot it has reached and one 2 mm back.
  get pace() {
    const k = this.at.findLastIndex((v) => Number.isFinite(v)), j = this.spots.findLastIndex((x, i) => i < k && x <= this.spots[k] - 2e-3);
    return k > 0 && j >= 0 ? (this.spots[k] - this.spots[j]) / (this.at[k] - this.at[j]) : NaN;
  }
  // Speed between two spots (m/s), from the arrival times: the middle of the axon, away from its ends.
  speed(a = 0.25, b = 0.75) {
    const i = Math.round(a * 40), j = Math.round(b * 40);
    return (this.spots[j] - this.spots[i]) / (this.at[j] - this.at[i]);
  }
  // (read once per change: the pictures read it several times a frame)
  get solution() { return (this.sol ??= this.dev.solution()); }
}
