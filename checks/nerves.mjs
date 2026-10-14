// The numbers the nerves page and film state, recomputed from their own model (checks/README.md).
//   node checks/nerves.mjs     (needs a driftlet checkout at ~/git/driftlet, version 1.0.1's code)
// It copies the page's model with driftlet imported locally, races the three axons, and prints
// each claim's number as JSON, for checks/nerves-claims.md to point at.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lib = join(homedir(), 'git/driftlet/src/');
const tmp = mkdtempSync(join(tmpdir(), 'nerves-'));
writeFileSync(join(tmp, 'model.mjs'), readFileSync(join(here, '../src/explorables/nerves/model.js'), 'utf8').replaceAll('https://cdn.jsdelivr.net/npm/driftlet@1.0.1/src/', pathToFileURL(lib).href));
const M = await import(pathToFileURL(join(tmp, 'model.mjs')).href);

const out = {};
const t0 = performance.now();
const nerves = Object.fromEntries(M.KINDS.map((k) => [k, new M.Nerve(k)]));
for (const n of Object.values(nerves)) n.fire();
// the bare thin axon is slowest: run until it arrives (or 20 ms)
for (const n of Object.values(nerves)) {
  for (let t = 0; t < 20e-3 && n.arrived === null; t += 0.25e-3) n.advance(t + 0.25e-3);
  out[n.kind] = { speed_m_per_s: +n.speed().toFixed(2), arrives_ms: +(1000 * n.arrived).toFixed(3) };
}
// Steady speeds, away from the ends: the middle third of axons 6 cm long (the bare one's middle half
// of the race axon: it's slow, and its ends matter less).
for (const k of ['myelin', 'squid']) {
  const n = new M.Nerve(k, M.MYELIN, 0.06);
  n.fire();
  for (let t = 0; t < 10e-3 && n.arrived === null; t += 0.25e-3) n.advance(t + 0.25e-3);
  out[k].steady_m_per_s = +n.speed(1 / 3, 2 / 3).toFixed(2);
}
out.bare.steady_m_per_s = out.bare.speed_m_per_s;
// The wrapping slider's ends: thick (800 layers) and too thin (20, the slider's least).
{
  const thick = new M.Nerve('myelin', { ...M.MYELIN, wraps: 800 }, 0.06);
  thick.fire();
  for (let t = 0; t < 10e-3 && thick.arrived === null; t += 0.25e-3) thick.advance(t + 0.25e-3);
  out.myelin_800_layers_m_per_s = +thick.speed(1 / 3, 2 / 3).toFixed(1);
  const thin = new M.Nerve('myelin', { ...M.MYELIN, wraps: 20 });
  thin.fire();
  thin.advance(10e-3);
  out.myelin_20_layers_reaches_cm = +(100 * (thin.front ?? 0)).toFixed(2);
  out.myelin_20_layers_arrives = thin.arrived !== null;
}
out.bare_from_squid_by_sqrt_radius = +(out.squid.steady_m_per_s * Math.sqrt(M.THIN / M.SQUID)).toFixed(2);
out.myelin_over_bare = +(out.myelin.steady_m_per_s / out.bare.steady_m_per_s).toFixed(1);
out.myelin_over_squid = +(out.myelin.steady_m_per_s / out.squid.steady_m_per_s).toFixed(2);
out.squid_radius_ratio = +(M.SQUID / M.THIN).toFixed(1);
out.squid_area_ratio = Math.round((M.SQUID / M.THIN) ** 2);

// Who carries the current along the inside: at the spike front in the squid axon, each species'
// share of the axial current (z F N), from the solution's fluxes.
{
  const n = new M.Nerve('squid');
  n.fire();
  n.advance(0.55e-3); // the front near the middle
  const S = n.solution, F = 96485.332;
  let best = 0, shares = null;
  for (let g = 0; g < S.x.length - 1; g++) {
    const j = Object.fromEntries(Object.keys(M.z).map((s) => [s, M.z[s] * F * S.flux[s][g]]));
    const tot = Object.values(j).reduce((a, b) => a + b);
    if (Math.abs(tot) > best) { best = Math.abs(tot); shares = Object.fromEntries(Object.entries(j).map(([s, v]) => [s, +(v / tot).toFixed(3)])); }
  }
  out.axial_shares_at_peak_current = shares;
  out.axial_current_peak_A_per_m2 = +best.toFixed(1);
  // how far an ion inside drifts in one spike: the largest drift velocity there times about a millisecond
  const E = best * 0.354; // V/m, from the axoplasm's resistivity
  const vK = (M.D / M.VT) * E; // m/s
  out.K_drift_um_per_ms_at_peak = +(vK * 1e-3 * 1e6).toFixed(4);
}
out.compute_s = +((performance.now() - t0) / 1000).toFixed(1);
console.log(JSON.stringify(out, null, 2));
