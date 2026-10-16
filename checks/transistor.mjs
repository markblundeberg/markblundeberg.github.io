// The numbers the transistor page states, recomputed from its own model (checks/README.md).
//   node checks/transistor.mjs     (needs a driftlet checkout at ~/git/driftlet)
// It copies the page's model with driftlet imported locally, sweeps the gate, and checks the
// channel against the textbook's MOS laws and real transistors. BREAK=oxide makes the oxide ten
// times thicker in the model only (the textbook keeps 2 nm), to see the checks fail.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lib = join(homedir(), 'git/driftlet/src/');
const tmp = mkdtempSync(join(tmpdir(), 'transistor-'));
let source = readFileSync(join(here, '../src/explorables/transistor/model.js'), 'utf8').replaceAll('https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/', pathToFileURL(lib).href);
if (process.env.BREAK === 'oxide') source = source.replace("layer('SiO2', TOX,", "layer('SiO2', 10 * TOX,");
writeFileSync(join(tmp, 'model.mjs'), source);
const M = await import(pathToFileURL(join(tmp, 'model.mjs')).href);

const out = {}, t0 = performance.now(), q = 1.602176634e-19;
let failed = 0;
const expect = (name, value, lo, hi, why) => {
  const ok = value >= lo && value <= hi; // (NaN fails)
  [lo, hi] = [lo, hi].map((v) => +v.toPrecision(3));
  if (!ok) failed++;
  console.error(`${ok ? 'PASS' : 'FAIL'} ${name} = ${+value.toPrecision(4)} (want ${lo} to ${hi}: ${why})`);
};
const r4 = (x) => +x.toPrecision(4);

// Flat band: the gate voltage at which the silicon holds no charge. Found for one zeroCharge, then
// the zeroCharge moved to put it at the target (it moves one for one; checked).
function flatBand(zc) {
  const g = new M.Gate(zc);
  let lo = -2.5, hi = 0.5;
  for (let k = 0; k < 40; k++) {
    const m = (lo + hi) / 2, r = g.at(m);
    if (r.dp - r.n > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const v0 = flatBand(0.1), v1 = flatBand(0.2);
out.flatband_per_zeroCharge = r4((v1 - v0) / 0.1);
const zc = 0.1 + ((M.VFB_TARGET - v0) * 0.1) / (v1 - v0);
const VFB = flatBand(zc);
out.zeroCharge = r4(zc);
out.VFB = r4(VFB);

// the sweep
const gate = new M.Gate(zc), sweep = [];
for (let V = -1.2; V <= 1.5 + 1e-9; V += 0.01) sweep.push(gate.at(V));
const ni = Math.sqrt(2.8e19 * 1.04e19 * Math.exp(-1.12 / M.VT)); // the library's silicon at 300 K, per cm³
const tb = M.textbook(VFB, ni);
out.phiF = r4(tb.phiF);
out.VT_textbook = r4(tb.VTh);
// subthreshold swing: gate mV per tenfold more channel electrons, where there are 10⁷ to 10⁹ per cm²
const logn = sweep.map((r) => Math.log10(r.n)), at = (lg) => {
  const k = logn.findIndex((v) => v >= lg);
  if (k < 1) return NaN; // never reached in the sweep
  return sweep[k - 1].V + ((lg - logn[k - 1]) / (logn[k] - logn[k - 1])) * (sweep[k].V - sweep[k - 1].V);
};
out.swing_mV = r4(1000 * ((at(9) - at(7)) / 2));
out.swing_textbook_mV = [r4(1000 * tb.swing(tb.phiF)), r4(1000 * tb.swing(1.5 * tb.phiF))];
expect('subthreshold swing (mV per tenfold)', out.swing_mV, out.swing_textbook_mV[1] * 0.97, out.swing_textbook_mV[0] * 1.03, '(kT/q) ln10 (1 + C_d/C_ox), C_d between surface potentials φ_F and 1.5 φ_F');
expect('subthreshold swing above the 59.5 mV limit', out.swing_mV, 59.5, 90, 'Boltzmann: no classical gate does better than kT ln10 per tenfold; real transistors 65 to 100');
// above threshold: electrons per cm² rise as C_ox (V − V_T)/q; fit a line from 0.4 to 0.8 V past the textbook threshold
const fit = sweep.filter((r) => r.V >= tb.VTh + 0.4 && r.V <= tb.VTh + 0.8), nx = fit.length;
const mx = fit.reduce((a, r) => a + r.V, 0) / nx, my = fit.reduce((a, r) => a + r.n, 0) / nx;
const slope = fit.reduce((a, r) => a + (r.V - mx) * (r.n - my), 0) / fit.reduce((a, r) => a + (r.V - mx) ** 2, 0);
out.VT_extrapolated = r4(mx - my / slope);
out.Cinv_over_Cox = r4((slope * q * 1e4) / M.COX);
expect('threshold (extrapolated) against the textbook', out.VT_extrapolated - out.VT_textbook, -0.08, 0.12, 'V_FB + 2φ_F + √(2ε_s q N_A 2φ_F)/C_ox, classical; the extrapolated line sits a few kT/q past it');
expect('channel per volt above threshold over C_ox', out.Cinv_over_Cox, 0.8, 1.0, 'just under C_ox: the channel sheet has a thickness, in series');
// on and off: channel electrons at the threshold + 0.7 V against at 0 V, and the gate volts per tenfold
const nAt = (V) => sweep.reduce((a, r) => (Math.abs(r.V - V) < Math.abs(a.V - V) ? r : a)).n;
out.n_at_0V = r4(nAt(0));
out.n_at_VT = r4(nAt(tb.VTh));
out.n_on = r4(nAt(tb.VTh + 0.7));
out.on_over_off = r4(out.n_on / out.n_at_0V);
out.ni = r4(ni);

out.ms = Math.round(performance.now() - t0);
console.log(JSON.stringify(out, null, 1));
if (failed) {
  console.error(`${failed} check(s) FAILED`);
  process.exit(1);
}
