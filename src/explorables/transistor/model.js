// The transistor behind every picture on this page: a slice straight down through the middle of
// one, from its gate through a thin oxide into the silicon below, solved with driftlet
// (https://github.com/markblundeberg/driftlet). The gate's voltage pulls electrons up to the silicon's
// surface; past a threshold they form a sheet there, the channel, which joins the transistor's
// source to its drain and switches it on. Here it's held at equilibrium, as a transistor is with no
// voltage between source and drain, and the electrons come and go through the silicon's contact.

import { Device, FARADAY, GAS_CONSTANT, AVOGADRO, EPS0, units } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/index.js';
import { build, layer, ohmic, semiconductor, metal } from 'https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/kit.js';

export const T = 300, VT = (GAS_CONSTANT * T) / FARADAY;
const perCm3 = (n) => (n * 1e6) / AVOGADRO;
// p-type silicon, 10¹⁸ acceptors per cm³, under 2 nm of oxide: about a 2005-era transistor (a
// 65 nm node's oxide was about 1.2 nm, its channel doping a few 10¹⁸).
export const NA_CM3 = 1e18, NA = perCm3(NA_CM3), TOX = units.nm(2), LSI = units.nm(200);
export const EPS_SI = 11.9 * EPS0, EPS_OX = 3.9 * EPS0, COX = EPS_OX / TOX; // F/m²
// The gate: a metal whose flat-band voltage, the work-function difference with the silicon, is
// that of an n⁺ silicon gate on this p-type silicon, −1.03 V (set through the gate face's zeroCharge,
// found by solving: see flatBand below).
export const VFB_TARGET = -1.03;

// Silicon, with Fermi–Dirac statistics: the channel's electrons crowd past the band's effective
// density of states, where Boltzmann's would overcount them.
const silicon = semiconductor('Si');
silicon.materials.Si.statistics = [{ type: 'fermi-dirac', species: ['e-', 'h+'] }];
export function mos(zeroCharge, V = 0) {
  return build({
    T,
    library: [silicon, metal('Au')],
    materials: { SiO2: { epsr: 3.9, species: {} } },
    stack: [
      ohmic(0),
      layer('Si', LSI, { name: 'p-Si', acceptors: NA }),
      { dipole: 0 },
      layer('SiO2', TOX, { grid: { hmin: units.nm(0.2), hmax: units.nm(0.4) } }),
      { phi: { type: 'capacitive', C: 100 }, zeroCharge },
      layer('Au', units.nm(20)),
      ohmic(V, ['e-']),
    ],
    grid: { hmin: units.nm(0.05), hmax: units.nm(5), ratio: 1.08 },
  });
}

// A gate at V volts: the electrons and holes in the silicon (per cm², summed down from the
// surface), and the bands.
export class Gate {
  constructor(zeroCharge) {
    this.zeroCharge = zeroCharge;
    this.dev = new Device(mos(zeroCharge, 0));
    this.V = 0;
    this.solution = this.dev.solve();
  }
  at(V) {
    const n = Math.max(1, Math.ceil(Math.abs(V - this.V) / 0.05)), from = this.V;
    for (let k = 1; k <= n; k++) {
      this.dev.set({ contacts: { right: { V: from + ((V - from) * k) / n } } });
      this.solution = this.dev.solve();
    }
    this.V = V;
    return this.read();
  }
  read() {
    const S = this.solution, cm2 = (mol) => (mol * AVOGADRO) / 1e4;
    let n = 0, p = 0;
    for (let g = 1; g < S.x.length; g++) {
      if (S.region[g] !== 0 || S.region[g - 1] !== 0) continue;
      const h = S.x[g] - S.x[g - 1];
      n += 0.5 * (S.c['e-'][g] + S.c['e-'][g - 1]) * h;
      p += 0.5 * (S.c['h+'][g] + S.c['h+'][g - 1] - 2 * NA) * h;
    }
    return { V: this.V, n: cm2(n), dp: cm2(p), S };
  }
}

// The textbook's numbers for this slice: the bulk's Fermi level below midgap φ_F, the threshold
// (the surface as rich in electrons as the bulk is in holes) V_T = V_FB + 2φ_F + √(2ε_s q N_A 2φ_F)/C_ox,
// and the subthreshold swing, the gate volts per tenfold more electrons below threshold,
// S = (kT/q) ln 10 (1 + C_d/C_ox), with C_d the depletion layer's capacitance there.
export function textbook(VFB, ni_cm3) {
  const phiF = VT * Math.log(NA_CM3 / ni_cm3), q = 1.602176634e-19, N = NA_CM3 * 1e6;
  const VT_ = VFB + 2 * phiF + Math.sqrt(2 * EPS_SI * q * N * 2 * phiF) / COX;
  const swing = (psi) => VT * Math.LN10 * (1 + EPS_SI / Math.sqrt((2 * EPS_SI * psi) / (q * N)) / COX);
  return { phiF, VTh: VT_, swing };
}

// The bands and levels straight down through the slice, eV per electron (the gate on the left, the
// silicon's depth to the right, x from the gate's face), and the electrons' and holes' densities
// (per cm³). At equilibrium the electrons' and holes' levels are one, the Fermi level.
export function profile(S) {
  const of = (a, f) => Array.from(a, f), cm3 = (c) => (c * AVOGADRO) / 1e6;
  const keep = S.region.map((r) => r <= 1); // the silicon and the oxide, not the gate metal
  const pick = (a) => a.filter((_, g) => keep[g]);
  const Ec = of(S.muStd['e-'], (m) => m / FARADAY), Ev = of(S.muStd['h+'], (m) => -m / FARADAY), Ef = of(S.mu['e-'], (m) => m / FARADAY);
  const W = S.x[S.region.lastIndexOf(1)];
  return {
    x: pick(of(S.x, (x) => W - x)), // depth below the gate's face
    region: pick(Array.from(S.region)),
    Ec: pick(Ec), Ev: pick(Ev), Ef: pick(Ef),
    n: pick(of(S.c['e-'], cm3)), p: pick(of(S.c['h+'], cm3)),
    phi: pick(of(S.phi, (v) => -v)), // −φ, the oxide's only line
  };
}
// How far the electrons must climb from their level to the silicon's surface: E_c there minus the
// Fermi level, eV. Each kT ln10 (60 meV) less is ten times more electrons there.
export function climb(S) {
  const g = S.region.lastIndexOf(0);
  return S.muStd['e-'][g] / FARADAY - S.mu['e-'][g] / FARADAY;
}
// The gate's sweep: channel electrons per cm² at every gate voltage, warm from point to point.
export function sweep(zeroCharge, from = -1.2, to = 1.5, step = 0.01) {
  const g = new Gate(zeroCharge), V = [], n = [], c = [];
  for (let v = from; v <= to + 1e-9; v += step) {
    const r = g.at(v);
    V.push(v);
    n.push(r.n);
    c.push(climb(r.S));
  }
  return { V, n, climb: c };
}
// The gate face's zeroCharge that puts flat band at VFB_TARGET (found by the check: −1.03 V).
export const ZERO_CHARGE = 0.03034;
