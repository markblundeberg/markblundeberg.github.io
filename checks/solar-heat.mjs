// The numbers the solar-heat page and film state, recomputed from their own model (checks/README.md).
//   node checks/solar-heat.mjs     (needs a driftlet checkout at ~/git/driftlet, version 1.0.1's code)
// It copies the page's model with driftlet imported locally, measures the cell from cool to hot, and
// prints each claim's number as JSON, for checks/solar-heat-claims.md to point at. The checks against
// measured silicon print as PASS or FAIL lines on stderr.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lib = join(homedir(), 'git/driftlet/src/');
const tmp = mkdtempSync(join(tmpdir(), 'solar-heat-'));
let source = readFileSync(join(here, '../src/explorables/solar-heat/model.js'), 'utf8').replaceAll('https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/', pathToFileURL(lib).href);
// BREAK=gap holds the band gap at its 300 K width whatever the temperature, to see the checks fail.
if (process.env.BREAK === 'gap') source = source.replace('export const Eg = (T) =>', 'export const Eg = (T) => 1.1245; const unused = (T) =>');
writeFileSync(join(tmp, 'model.mjs'), source);
const M = await import(pathToFileURL(join(tmp, 'model.mjs')).href);
const { check } = await import(pathToFileURL(join(lib, 'kit.js')).href);

const out = {}, t0 = performance.now(), F = 96485.33212;
let failed = 0;
const expect = (name, value, lo, hi, why) => {
  const ok = value >= lo && value <= hi;
  if (!ok) failed++;
  console.error(`${ok ? 'PASS' : 'FAIL'} ${name} = ${+value.toPrecision(4)} (want ${lo} to ${hi}: ${why})`);
};

// The cell from 15 to 75 °C under the full sun.
const cell = new M.Cell(M.KELVIN + 25, 1);
const sweep = [];
for (let C = 15; C <= 75; C += 10) sweep.push(cell.set(M.KELVIN + C, 1).measure());
const by = (C) => sweep.find((m) => Math.abs(m.T - M.KELVIN - C) < 1e-9);
out.sweep = sweep.map((m) => ({ C: Math.round(m.T - M.KELVIN), Jsc: +m.Jsc.toFixed(3), Voc: +m.Voc.toFixed(4), FF: +m.FF.toFixed(4), Pmax: +m.Pmax.toFixed(3) }));
const c25 = by(25), slope = (k) => (by(35)[k] - by(15)[k]) / 20; // per K, centred on 25 °C
out.at25 = { Jsc_mA_cm2: +c25.Jsc.toFixed(2), Voc_V: +c25.Voc.toFixed(4), FF: +c25.FF.toFixed(3), Pmax_mW_cm2: +c25.Pmax.toFixed(2), efficiency: +(c25.Pmax / 100).toFixed(4) };
out.dVoc_dT_mV_per_K = +(1000 * slope('Voc')).toFixed(3);
out.Voc_coeff_pct_per_K = +((100 * slope('Voc')) / c25.Voc).toFixed(3);
out.Jsc_coeff_pct_per_K = +((100 * slope('Jsc')) / c25.Jsc).toFixed(3);
out.FF_coeff_pct_per_K = +((100 * slope('FF')) / c25.FF).toFixed(3);
out.Pmax_coeff_pct_per_K = +((100 * slope('Pmax')) / c25.Pmax).toFixed(3);
// Against theory: dVoc/dT = −(Eg0/q − Voc + γkT/q)/T (M. A. Green, Prog. Photovolt. 11, 333
// (2003)), Eg0 the gap extrapolated linearly to 0 K from 25 °C, and γ how J₀ grows besides n_i²'s
// exponential: J₀ ∝ T^γ e^{−Eg0/kT}. Each place the cell leaks has its own γ here: N_cN_v gives
// T³; recombination in the base adds nothing more (γ = 3); carriers diffusing to a contact add D ∝
// T^{1−2.2} in the emitter (γ = 1.8) and T^{1−2.42} into the back layer (γ = 1.58). So γ is
// between 1.58 and 3, whatever the mix.
{
  const T = c25.T, h = 1e-3, dEg = (M.Eg(T + h) - M.Eg(T - h)) / (2 * h), Eg0 = M.Eg(T) - T * dEg;
  out.Eg0_linear_eV = +Eg0.toFixed(4);
  out.gamma_implied = +((-T * slope('Voc') - Eg0 + c25.Voc) / M.VT(T)).toFixed(2);
}
// What the sun can give: every pair the cell absorbs, as a current.
out.absorbed_mA_cm2 = { C25: +((F * M.absorbed(M.KELVIN + 25, 1)) / 10).toFixed(2), C65: +((F * M.absorbed(M.KELVIN + 65, 1)) / 10).toFixed(2) };

expect('dVoc/dT, mV/K per cell', out.dVoc_dT_mV_per_K, -2.3, -1.8, 'measured silicon cells, about −2 mV/K');
expect('Voc coefficient, %/K', out.Voc_coeff_pct_per_K, -0.36, -0.26, 'datasheets, −0.27 to −0.35 %/K');
expect('Jsc coefficient, %/K', out.Jsc_coeff_pct_per_K, 0.01, 0.08, 'datasheets, +0.03 to +0.06 %/K');
expect('Pmax coefficient, %/K', out.Pmax_coeff_pct_per_K, -0.5, -0.3, 'datasheets, −0.3 to −0.5 %/K');
expect('γ implied by dVoc/dT (Green 2003)', out.gamma_implied, 1.58, 3, "between the emitter's and back layer's 1.58 and the base's 3");

// A cloudy day: half the sun at 25 °C. The current halves; the voltage drops by only V_T ln 2.
{
  const half = cell.set(M.KELVIN + 25, 0.5).measure();
  out.half_sun = { Jsc_ratio: +(half.Jsc / c25.Jsc).toFixed(4), Voc_drop_mV: +(1000 * (c25.Voc - half.Voc)).toFixed(2), VT_ln2_mV: +(1000 * M.VT(c25.T) * Math.LN2).toFixed(2), Pmax_ratio: +(half.Pmax / c25.Pmax).toFixed(3) };
  expect('half sun: Jsc ratio', out.half_sun.Jsc_ratio, 0.499, 0.501, 'current ∝ light');
  expect('half sun: Voc drop over V_T ln 2', out.half_sun.Voc_drop_mV / out.half_sun.VT_ln2_mV, 0.97, 1.03, 'an ideal diode');
}
// The leak: the dark cell's current at a fixed voltage (what flows back across the junction when the
// light pushes it to that voltage), cool against hot, and how fast it grows per kelvin.
{
  const dark = new M.Cell(M.KELVIN + 25, 0), V = 0.55, leak = (C) => -dark.set(M.KELVIN + C, 0).at(V);
  const l25 = leak(25), l65 = leak(65), l26 = leak(26);
  out.leak_at_0_55V_mA_cm2 = { C25: +l25.toPrecision(3), C65: +l65.toPrecision(3), ratio: +(l65 / l25).toFixed(1) };
  out.leak_doubles_every_K = +(Math.LN2 / Math.log(l26 / l25)).toFixed(2);
}
// The two panels of the film and the page's pictures: 25 °C (a cool bright day) and 65 °C (a hot
// summer roof), under the full sun, each at its best voltage, and the hot one held at the cool one's.
{
  const cool = new M.Panel(M.KELVIN + 25, 1), hot = new M.Panel(M.KELVIN + 65, 1);
  const show = (p, V) => {
    const o = p.operate(V), F0 = o.fates, per100 = (x) => +((100 * x) / F0.made).toFixed(1);
    return {
      V: +M.panel.V(V).toFixed(1), A: +M.panel.A(o.J).toFixed(2), W: +M.panel.W(o.P).toFixed(1),
      hill_eV: +o.hill.toFixed(3), one_in: +Math.exp(o.hill / M.VT(p.T)).toPrecision(2),
      per100: { delivered: per100(F0.delivered), front: per100(F0.front), base: per100(F0.base), back: per100(F0.back) },
      per100_sum_error: +Math.abs((F0.delivered + F0.front + F0.base + F0.back) / F0.made - 1).toExponential(1),
    };
  };
  out.panel_cool_best = show(cool, cool.Vmp);
  out.panel_hot_best = show(hot, hot.Vmp);
  // held together, as the page and film do: at the cool one's best voltage, or the hot one's open
  // circuit if that's lower (it is, by half a millivolt a cell)
  out.held_V_cell = { cool_Vmp: +cool.Vmp.toFixed(5), hot_Voc: +hot.Voc.toFixed(5) };
  out.panel_hot_at_cool_V = show(hot, Math.min(cool.Vmp, hot.Voc));
  out.delivered_at_0V_per100 = { cool: +((100 * cool.short.delivered) / cool.short.made).toFixed(1), hot: +((100 * hot.short.delivered) / hot.short.made).toFixed(1) };
  out.hot_over_cool_power = +(hot.Pmax / cool.Pmax).toFixed(3);
  out.panel_Voc_V = { cool: +M.panel.V(cool.Voc).toFixed(1), hot: +M.panel.V(hot.Voc).toFixed(1) };
  out.panel_Isc_A = { cool: +M.panel.A(cool.Jsc).toFixed(2), hot: +M.panel.A(hot.Jsc).toFixed(2) };
  out.one_in_ratio_same_V = +(out.panel_cool_best.one_in / out.panel_hot_at_cool_V.one_in).toFixed(1);
  expect('the hot panel held at the cool one\'s voltage delivers nothing', Math.abs(out.panel_hot_at_cool_V.W), 0, 0.5, 'held at its own V_oc, half a millivolt a cell below the cool one\'s V_mp');
  expect('…and that\'s the cool one\'s best voltage, to a fraction of a mV', 1000 * (cool.Vmp - hot.Voc), -1, 1, 'both read 34.0 V');
  expect('the per-100 ledger closes', out.panel_cool_best.per100_sum_error, 0, 1e-6, 'every pair accounted for');
  // The leak, by where it ends: what each loss grows by from 0 V to the best voltage, per 100 pairs
  // (holes leaking into the front layer show up at the front; electrons into the base, in the base
  // and at the back).
  {
    const best = cool.operate(cool.Vmp).fates, zero = cool.short, d = (k) => (100 * best[k]) / best.made - (100 * zero[k]) / zero.made;
    const total = d('front') + d('base') + d('back');
    out.leak_by_place_cool = { per100: +total.toFixed(2), front_share: +(d('front') / total).toFixed(2), base_share: +(d('base') / total).toFixed(2), back_share: +(d('back') / total).toFixed(2) };
    // what's lost at the front at 0 V, against what the light frees within the front layer and the
    // first 0.1 µm past it (mostly blue: absorbed within a fraction of a micron)
    const within = (x) => M.NM.reduce((s, nm, k) => s - M.FLUX[k] * Math.expm1(-M.alphaAt(nm, cool.T) * x), 0);
    out.front_loss_at_0V_per100 = +((100 * zero.front) / zero.made).toFixed(1);
    out.freed_in_front_layer_per100 = +((100 * within(M.WE)) / zero.made).toFixed(1);
    out.freed_in_front_layer_below_500nm_share = +(M.NM.reduce((s, nm, k) => s - (nm < 500 ? M.FLUX[k] * Math.expm1(-M.alphaAt(nm, cool.T) * M.WE) : 0), 0) / within(M.WE)).toFixed(2);
  }
  // a dot on the wires: 14 a second at 8.5 A
  out.electrons_per_dot = +(8.5 / 14 / 1.602176634e-19).toPrecision(2);
  // A cloudy day (half sun) and a freezing bright one (−10 °C), against the cool panel.
  const half = new M.Panel(M.KELVIN + 25, 0.5), cold = new M.Panel(M.KELVIN - 10, 1);
  out.panel_half_sun = { W: +M.panel.W(half.Pmax).toFixed(1), Vmp: +M.panel.V(half.Vmp).toFixed(1), Voc: +M.panel.V(half.Voc).toFixed(1), A_sc: +M.panel.A(half.Jsc).toFixed(2), Voc_drop_V: +M.panel.V(cool.Voc - half.Voc).toFixed(2) };
  out.panel_minus10 = { W: +M.panel.W(cold.Pmax).toFixed(1), over_25C: +(cold.Pmax / cool.Pmax).toFixed(3) };
  // a hot day: air at 30 °C, cells 25–30 °C above it
  out.power_over_25C = { C45: +(by(45).Pmax / c25.Pmax).toFixed(3), C55: +(by(55).Pmax / c25.Pmax).toFixed(3), C65: +(by(65).Pmax / c25.Pmax).toFixed(3) };
}
// The kit's checks at 25 °C, open circuit: where every pair goes, and a grid twice as fine.
{
  const d = cell.set(M.KELVIN + 25, 1);
  d.openCircuit();
  const report = check(d.dev, d.solution);
  out.check_ok = report.ok;
  if (!report.ok) failed++;
  console.error(report.text);
}
out.compute_s = +((performance.now() - t0) / 1000).toFixed(1);
console.log(JSON.stringify(out, null, 2));
if (failed) console.error(`${failed} FAILED`), (process.exitCode = 1);
