// The numbers the LED page and film state, recomputed from their own model (checks/README.md).
//   node checks/led.mjs     (needs a driftlet checkout at ~/git/driftlet, version 1.0.1's code)
// It copies the page's model with driftlet imported locally, drives its diodes, and prints each
// claim's number as JSON, for checks/led-claims.md to point at. The checks against measured LEDs and
// the textbook laws print as PASS or FAIL lines on stderr.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lib = join(homedir(), 'git/driftlet/src/');
const tmp = mkdtempSync(join(tmpdir(), 'led-'));
let source = readFileSync(join(here, '../src/explorables/led/model.js'), 'utf8').replaceAll('https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/', pathToFileURL(lib).href);
// BREAK=walls takes the walls away (the wider-gap crystal made GaAs, no band steps), to see the
// checks fail: the electrons then run on through the thin p side to its contact.
if (process.env.BREAK === 'walls') source = source.replace('export const DEC = 0.23', 'export const DEC = 0').replace('AlGaAs: { Eg: 1.798', 'AlGaAs: { Eg: 1.424');
writeFileSync(join(tmp, 'model.mjs'), source);
const M = await import(pathToFileURL(join(tmp, 'model.mjs')).href);

const out = {}, t0 = performance.now();
let failed = 0;
const expect = (name, value, lo, hi, why) => {
  const ok = value >= lo && value <= hi;
  [lo, hi] = [lo, hi].map((v) => +v.toPrecision(3));
  if (!ok) failed++;
  console.error(`${ok ? 'PASS' : 'FAIL'} ${name} = ${+value.toPrecision(4)} (want ${lo} to ${hi}: ${why})`);
};
const kT = M.VT, r4 = (x) => +x.toPrecision(4);

// 1. The colour: the spectrum's peak and width, from the band edge's law.
const G = M.CRYSTALS.GaAs.Eg;
const E = Array.from({ length: 20001 }, (_, k) => G + (k / 20000) * 20 * kT), s = E.map((e) => M.spectrum(G, e));
const top = s.indexOf(Math.max(...s)), half = s[top] / 2;
const lo = E[s.findIndex((v) => v >= half)], hi = E[s.findLastIndex((v) => v >= half)];
out.peak_above_gap_kT = r4((E[top] - G) / kT);
out.width_kT = r4((hi - lo) / kT);
out.peak_nm_GaAs = r4(M.HC / E[top]);
out.width_nm_GaAs = r4(M.HC / lo - M.HC / hi);
expect('peak above the gap (kT)', out.peak_above_gap_kT, 0.45, 0.55, 'E_g + kT/2 (Schubert, Light-Emitting Diodes, ch. 5)');
expect('full width at half height (kT)', out.width_kT, 1.7, 1.9, '1.8 kT (Schubert)');
expect('GaAs peak (nm)', out.peak_nm_GaAs, 850, 880, 'GaAs band-edge light at room temperature, about 870 nm');

// 2. The walled LED: volts, light and heat.
const led = new M.LED({ kind: 'walled' });
const at20 = led.drive(20);
out.walled = { Vf_20A_cm2: r4(at20.V), light: r4(at20.light / at20.J), heat: r4(at20.heat / at20.J), lost: r4(1 - (at20.light + at20.heat) / at20.J) };
expect('walled GaAs: volts at 20 A/cm² (about 20 mA on a 0.3 mm chip)', at20.V, 1.15, 1.35, 'GaAs infrared LEDs, about 1.2 to 1.3 V before their resistance');
expect('walled GaAs: share of electrons that make light', out.walled.light, 0.85, 1, 'good GaAs LEDs make light from most of them (internal efficiency near 90 % and over)');
const ladder = [1e-3, 1e-2, 1e-1, 1, 10].map((J) => led.drive(J));
out.mV_per_decade = ladder.slice(1).map((p, i) => r4((1000 * (p.V - ladder[i].V)) / Math.log10(p.light / ladder[i].light)));
expect('light: mV per tenfold', Math.max(...out.mV_per_decade), 57, 62, 'kT ln10 = 59.5 mV at 300 K (the diode law, ideality 1)');
expect('light: mV per tenfold (least)', Math.min(...out.mV_per_decade), 57, 62, 'the same, across five decades');
out.photon_eV_mean = r4(G + 1.5 * kT);
out.qV_at_20 = r4(at20.V);

// 4. The gap sets the volts: every crystal shifted, at the same current.
out.Vf_by_gap = [0, 0.5, 1.3].map((d) => ({ Eg: r4(G + d), Vf: r4(new M.LED({ kind: 'walled', dEg: d }).drive(20).V) }));
const slope = (out.Vf_by_gap[2].Vf - out.Vf_by_gap[0].Vf) / 1.3;
out.dVf_dEg = r4(slope);
expect('volts per eV of gap', slope, 0.98, 1.02, 'n_i² ∝ e^{−E_g/kT}: one volt more per eV');
out.gap_minus_qV = r4(G - at20.V);

// 5. Silicon: a defect gets the electron first.
const si = new M.LED({ kind: 'plain', crystal: 'Si' }).drive(20);
out.Si = { light_over_light_plus_heat: r4(si.light / (si.light + si.heat)), Vf_20A_cm2: r4(si.V) };
out.GaAs_walled_light_over_light_plus_heat = r4(at20.light / (at20.light + at20.heat));
const tauRad = (c) => 1 / (c.B * 1e17);
out.radiative_wait = { GaAs_ns: r4(tauRad(M.CRYSTALS.GaAs) * 1e9), Si_ms: r4(tauRad(M.CRYSTALS.Si) * 1e3) };
expect('silicon: light / (light + heat)', out.Si.light_over_light_plus_heat, 0, 0.01, 'silicon LEDs: well under 1 % (1 % only with special care, Green et al., Nature 412, 805, 2001)');

out.ms = Math.round(performance.now() - t0);
console.log(JSON.stringify(out, null, 1));
writeFileSync(join(tmp, 'out.json'), JSON.stringify(out));
if (failed) {
  console.error(`${failed} check(s) FAILED`);
  process.exit(1);
}
