// The pictures of the transistor (model.js), for the page and its film. Each draws into a figure's
// context in its own virtual units (f.VW × f.VH), from a state:
//   st.V        the gate's voltage
//   st.sweep    the channel at every gate voltage: { V, n (per cm²), climb (eV) }
//   st.here     the slice at st.V: { V, n, climb, profile }

import { VT } from './model.js';

export const COL = {};
export const FONT = {
  display: '"Big Shoulders Display", "Arial Narrow", sans-serif',
  mono: '"Martian Mono", ui-monospace, Menlo, monospace',
  serif: '"Newsreader", Georgia, serif',
};
let TS = 1;
const font = (ctx, size, weight = 400, family = 'mono') => (ctx.font = `${weight} ${size * (family === 'mono' ? TS : 1)}px ${FONT[family]}`);
const text = (ctx, s, x, y, { size = 13, weight = 400, family = 'mono', color = COL.ink, align = 'left', base = 'alphabetic' } = {}) => {
  font(ctx, size, weight, family);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillText(s, x, y);
};
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const fmt = (x, d = 2) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('-', '−');
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export function sci(x, d = 0) {
  if (!(x > 0)) return '0';
  const e = Math.floor(Math.log10(x)), m = x / 10 ** e;
  const sup = String(Math.abs(e)).split('').map((c) => SUP[+c]).join('');
  return d === 0 && Math.round(m) === 1 ? `10${e < 0 ? '⁻' : ''}${sup}` : `${m.toFixed(d)} × 10${e < 0 ? '⁻' : ''}${sup}`;
}
// the channel at a gate voltage, from the sweep (log-interpolated)
export function channelAt(sw, V) {
  const k = clamp(sw.V.findIndex((v) => v > V) - 1, 0, sw.V.length - 2);
  const t = clamp((V - sw.V[k]) / (sw.V[k + 1] - sw.V[k]), 0, 1);
  return 10 ** (Math.log10(sw.n[k]) + t * (Math.log10(sw.n[k + 1]) - Math.log10(sw.n[k])));
}
const OFF_V = 0; // "off": the gate at 0 V

// ---------- picture 1: a switch ----------

// Electrons crossing from source to drain as dots, a fixed number each, at a rate in proportion to
// the channel's electrons (the current, with a small fixed voltage from source to drain): DOTS a
// second at 5 × 10¹² per cm², in real time.
const DOTS = 24, FULL = 5e12;
export function stepFlow(st, dt) {
  if (!st.here) return [];
  st.flow ??= [];
  st.acc ??= 0;
  st.acc += (st.here.n / FULL) * DOTS * dt;
  const events = [];
  for (; st.acc >= 1; st.acc--) {
    st.seed = ((st.seed ?? 5) * 16807) % 2147483647;
    st.flow.push({ t: 0, y: st.seed / 2147483647 });
    events.push({});
  }
  for (const d of st.flow) d.t += dt;
  st.flow = st.flow.filter((d) => d.t < 1.6);
  return events;
}

export function drawSwitch(f, st, { clear = true } = {}) {
  const { ctx, VW, VH } = f, narrow = VW < 800;
  TS = f.ts ?? (narrow ? 1.38 : 1.15);
  if (clear) ctx.clearRect(0, 0, VW, VH);
  if (!st.here || !st.sweep) return;
  const x0 = narrow ? 20 : 60, x1 = VW - (narrow ? 20 : 60), w = x1 - x0;
  const top = narrow ? 150 : 130, surf = top + 46, bot = VH - (narrow ? 90 : 70);
  const sx0 = x0 + w * 0.26, sx1 = x1 - w * 0.26; // the channel's ends, under the gate
  // the silicon body, its holes as a faint warm shading
  ctx.fillStyle = COL.surface;
  ctx.fillRect(x0, surf, w, bot - surf);
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = COL.h;
  ctx.fillRect(x0, surf, w, bot - surf);
  ctx.globalAlpha = 1;
  // source and drain: wells full of electrons
  ctx.fillStyle = COL.e;
  ctx.globalAlpha = 0.55;
  const well = (a, b) => {
    ctx.beginPath();
    ctx.moveTo(a, surf);
    ctx.lineTo(b, surf);
    ctx.quadraticCurveTo(b, surf + 70, (a + b) / 2, surf + 74);
    ctx.quadraticCurveTo(a, surf + 70, a, surf);
    ctx.fill();
  };
  well(x0 + w * 0.06, sx0 + 10);
  well(sx1 - 10, x1 - w * 0.06);
  ctx.globalAlpha = 1;
  // the channel: electrons drawn up to the surface, shaded by how many (10⁸ per cm² faint, 10¹³ full)
  const n = st.here.n, a = clamp((Math.log10(n) - 8) / 5, 0, 1);
  if (a > 0) {
    ctx.globalAlpha = 0.85 * a;
    ctx.fillStyle = COL.e;
    ctx.fillRect(sx0, surf, sx1 - sx0, 6 + 6 * a);
    ctx.globalAlpha = 1;
  }
  // the oxide and the gate
  ctx.fillStyle = COL.ox;
  ctx.fillRect(sx0 - 6, surf - 10, sx1 - sx0 + 12, 10);
  ctx.fillStyle = COL.gate;
  ctx.fillRect(sx0 - 6, surf - 46, sx1 - sx0 + 12, 36);
  text(ctx, `gate ${fmt(st.V)} V`, (sx0 + sx1) / 2, surf - 22, { size: narrow ? 13 : 14, weight: 600, color: COL.bg, align: 'center', base: 'middle' });
  // the wires
  ctx.strokeStyle = COL.frame;
  ctx.lineWidth = 3;
  for (const [x, label] of [[x0 + w * 0.14, 'source'], [x1 - w * 0.14, 'drain']]) {
    ctx.beginPath();
    ctx.moveTo(x, surf);
    ctx.lineTo(x, top - 30);
    ctx.stroke();
    text(ctx, label, x, top - 40, { size: narrow ? 12 : 13, color: COL['ink-2'], align: 'center' });
  }
  // electrons crossing: along the channel, from source to drain
  ctx.fillStyle = COL.e;
  for (const d of st.flow ?? []) {
    const u = d.t / 1.6, x = x0 + w * 0.14 + (x1 - x0 - w * 0.28) * u, y = u < 0.12 || u > 0.88 ? surf + 22 - 18 * Math.sin(Math.PI * clamp(u < 0.5 ? u / 0.24 : (1 - u) / 0.24, 0, 0.5)) : surf + 4 + 4 * d.y;
    ctx.beginPath();
    ctx.arc(x, y, narrow ? 3.6 : 4, 0, 2 * Math.PI);
    ctx.fill();
  }
  // readouts
  const off = channelAt(st.sweep, OFF_V), ratio = n / off;
  const y = bot + (narrow ? 30 : 32);
  text(ctx, `channel: ${sci(n, 1)} electrons per cm²`, x0, y, { size: narrow ? 12 : 13, weight: 600, color: COL.e });
  const rel = ratio >= 10 ? `${sci(ratio, 1)} times the current at 0 V` : ratio >= 0.1 ? `${fmt(ratio, ratio < 1 ? 2 : 1)} × the current at 0 V` : `1/${sci(1 / ratio, 1)} of the current at 0 V`;
  const two = narrow || TS > 1.3; // big text: the second readout on its own line
  text(ctx, rel, two ? x0 : x1, two ? y + 22 * TS / 1.2 : y, { size: narrow ? 12 : 13, color: COL['ink-2'], align: two ? 'left' : 'right' });
  text(ctx, 'p-type silicon', x0 + 8, bot - 10, { size: 11, color: COL.muted });
}

// ---------- picture 2: straight down ----------

const XMAX = 40e-9; // the oxide and the first 38 nm of silicon
export function drawDown(f, st) {
  const { ctx, VW, VH } = f, narrow = VW < 800;
  TS = f.ts ?? (narrow ? 1.38 : 1.25);
  if (!f.noClear) ctx.clearRect(0, 0, VW, VH);
  if (!st.here) return;
  const P = st.here.profile, gx = narrow ? 64 : 110, x1 = VW - (narrow ? 16 : 30), top = narrow ? 40 : 34, bot = VH - (narrow ? 64 : 50);
  const X = (x) => gx + ((x1 - gx) * x) / XMAX;
  // energy range: from the holes' band below to the gate's level or the bands above, whichever is wider
  const Efsi = P.Ef[0], gateE = Efsi - st.V; // the gate's electrons sit qV_G below the silicon's
  const vis = P.x.map((x, g) => x <= XMAX && P.region[g] === 0);
  const Es = [...P.Ec.filter((_, g) => vis[g]), ...P.Ev.filter((_, g) => vis[g]), gateE];
  const hi = Math.max(...Es) + 0.2, lo = Math.min(...Es) - 0.15, Y = (E) => top + ((bot - top) * (hi - E)) / (hi - lo), px = (bot - top) / (hi - lo);
  // the gate (a metal block, its electrons filled to its level) and the oxide
  ctx.fillStyle = COL.gate;
  ctx.globalAlpha = 0.18;
  ctx.fillRect(gx - (narrow ? 46 : 80), top, narrow ? 46 : 80, bot - top);
  ctx.globalAlpha = 0.55;
  ctx.fillRect(gx - (narrow ? 46 : 80), Y(gateE), narrow ? 46 : 80, bot - Y(gateE));
  ctx.globalAlpha = 1;
  ctx.strokeStyle = COL.gate;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gx - (narrow ? 46 : 80), Y(gateE));
  ctx.lineTo(X(2e-9), Y(gateE));
  ctx.stroke();
  text(ctx, 'gate', gx - (narrow ? 23 : 40), top + 16, { size: 11, color: COL.gate, align: 'center' });
  ctx.fillStyle = COL.ox;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(X(0), top, X(2e-9) - X(0), bot - top);
  ctx.globalAlpha = 1;
  text(ctx, 'oxide', X(1e-9), bot + 16, { size: 10.5, color: COL.muted, align: 'center' });
  // the electrons in the silicon, shaded above their band's edge by how many (10¹⁵ faint, 10²⁰ per cm³ full)
  for (let g = 1; g < P.x.length; g++) {
    if (P.region[g] !== 0 || P.region[g - 1] !== 0 || P.x[g] > XMAX) continue;
    const s = clamp((Math.log10(Math.max(1, P.n[g])) - 15) / 5, 0, 1);
    if (s <= 0) continue;
    ctx.globalAlpha = 0.7 * s;
    ctx.fillStyle = COL.e;
    const xa = X(P.x[g]), xb = X(P.x[g - 1]);
    ctx.fillRect(Math.min(xa, xb), Y(P.Ec[g]) - 4 * VT * px, Math.abs(xb - xa) + 0.5, 4 * VT * px);
  }
  ctx.globalAlpha = 1;
  // the bands and the electrons' level
  const line = (arr, color, w, dash = []) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.setLineDash(dash);
    ctx.beginPath();
    let first = true;
    P.x.forEach((x, g) => {
      if (P.region[g] !== 0 || x > XMAX) return;
      (first ? ctx.moveTo : ctx.lineTo).call(ctx, X(x), Y(arr[g]));
      first = false;
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };
  line(P.Ec, COL.ink, 2.2);
  line(P.Ev, COL.ink, 2.2);
  line(P.Ef, COL.e, 1.6, [6, 5]);
  text(ctx, 'electrons’ band', X(XMAX) - 4, Y(P.Ec[0]) - 8, { size: 10.5, color: COL.muted, align: 'right' });
  text(ctx, 'the source’s electrons', X(XMAX) - 4, Y(P.Ef[0]) - 8, { size: 10.5, color: COL.e, align: 'right' });
  // the climb, at the surface: from the electrons' level up to their band's edge
  const gs = P.region.lastIndexOf(0), xs = X(P.x[gs]) + 14, c = P.Ec[gs] - P.Ef[gs];
  const ya = Y(P.Ec[gs]), yb = Y(P.Ef[gs]);
  ctx.strokeStyle = COL.climb;
  ctx.fillStyle = COL.climb;
  ctx.lineWidth = 1.6;
  if (c > 0) {
    ctx.beginPath();
    ctx.moveTo(xs, yb);
    ctx.lineTo(xs, ya);
    ctx.stroke();
  }
  if (c > 0 && Math.abs(ya - yb) > 10) {
    ctx.beginPath();
    const d = ya < yb ? 1 : -1;
    ctx.moveTo(xs, ya);
    ctx.lineTo(xs - 4, ya + 8 * d);
    ctx.lineTo(xs + 4, ya + 8 * d);
    ctx.fill();
  }
  // its label in the open space between the band and the level, a little way in
  const gm = P.x.findIndex((x) => x <= XMAX * 0.5), ly = (Y(P.Ec[gm]) + Y(P.Ef[gm])) / 2 - 4, lx = narrow ? X(XMAX * 0.18) : xs + 24;
  const knock = (str, x, y, size, weight, color) => {
    font(ctx, size, weight);
    const w = ctx.measureText(str).width;
    ctx.fillStyle = COL.surface;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(x - 3, y - size * TS, w + 6, size * TS * 1.3);
    ctx.globalAlpha = 1;
    text(ctx, str, x, y, { size, weight, color });
  };
  knock(c > 0 ? `the climb: ${fmt(c, 2)} eV` : 'no climb left', lx, ly, narrow ? 12 : 13, 600, COL.climb);
  knock(c > 0 ? 'each 0.06 less: 10× the electrons' : 'the channel is on', lx, ly + 18 * TS * 0.85, 10.5, 400, COL.muted);
  // the energy axis
  ctx.save();
  ctx.translate(narrow ? 8 : 14, (top + bot) / 2);
  ctx.rotate(-Math.PI / 2);
  text(ctx, 'energy of an electron →', 0, 0, { size: 10.5, color: COL.muted, align: 'center', base: 'middle' });
  ctx.restore();
  // depth scale
  for (const nm of narrow ? [10, 20, 30] : [10, 20, 30, 40]) text(ctx, `${nm} nm`, X(nm * 1e-9), bot + 16, { size: 10.5, color: COL.muted, align: 'center' });
  text(ctx, 'depth below the gate', x1, bot + 36, { size: 10.5, color: COL.muted, align: 'right' });
}

// ---------- picture 3: tenfold per 72 millivolts ----------

export function drawCurve(f, st) {
  const { ctx, VW, VH } = f, narrow = VW < 800;
  TS = f.ts ?? (narrow ? 1.38 : 1.3);
  if (!f.noClear) ctx.clearRect(0, 0, VW, VH);
  if (!st.sweep || !st.here) return;
  const x0 = narrow ? 70 : 110, x1 = VW - (narrow ? 16 : 30), y0 = narrow ? 30 : 34, y1 = VH - (narrow ? 60 : 56);
  const V0 = -0.5, V1 = 1.2, L0 = 2, L1 = 13;
  const X = (v) => x0 + ((x1 - x0) * (v - V0)) / (V1 - V0), Y = (lg) => y1 - ((y1 - y0) * (lg - L0)) / (L1 - L0);
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;
  for (let lg = L0; lg <= L1; lg += 2) {
    ctx.beginPath();
    ctx.moveTo(x0, Y(lg));
    ctx.lineTo(x1, Y(lg));
    ctx.stroke();
    text(ctx, sci(10 ** lg), x0 - 8, Y(lg) + 5, { size: 10.5, color: COL.muted, align: 'right' });
  }
  for (let v = -0.5; v <= 1.2 + 1e-9; v += 0.5) text(ctx, fmt(v, 1), X(v), y1 + 20, { size: 10.5, color: COL.muted, align: 'center' });
  text(ctx, 'gate voltage', x1, y1 + 42, { size: 10.5, color: COL.muted, align: 'right' });
  text(ctx, 'channel electrons per cm²', x0, y0 - 12, { size: 10.5, color: COL.muted });
  // the 60 mV-per-tenfold line, the best any gate can do at room temperature, through the curve at 0 V
  const lim = VT * Math.LN10;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, x1 - x0, y1 - y0);
  ctx.clip();
  ctx.strokeStyle = COL.muted;
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1.4;
  // (from the curve's foot, at the bottom of the scale, rightward: so it stays to one side of the curve)
  const k0 = st.sweep.n.findIndex((n) => Math.log10(n) >= L0), Va = st.sweep.V[k0];
  ctx.beginPath();
  ctx.moveTo(X(Va), Y(L0));
  ctx.lineTo(X(Va + 0.8), Y(L0 + 0.8 / lim));
  ctx.stroke();
  ctx.setLineDash([]);
  // the curve
  ctx.strokeStyle = COL.e;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  st.sweep.V.forEach((v, k) => (k ? ctx.lineTo : ctx.moveTo).call(ctx, X(v), Y(Math.log10(Math.max(1e-3, st.sweep.n[k])))));
  ctx.stroke();
  ctx.restore();
  // (its label in the empty lower right)
  text(ctx, narrow ? '- - the steepest possible:' : '- - the steepest possible, 60 mV per tenfold', x1 - 4, Y(L0 + 2), { size: 10.5, color: COL.muted, align: 'right' });
  if (narrow) text(ctx, '60 mV per tenfold', x1 - 4, Y(L0 + 2) + 16, { size: 10.5, color: COL.muted, align: 'right' });
  // where it is now
  const lg = Math.log10(st.here.n);
  ctx.fillStyle = COL.gate;
  ctx.beginPath();
  ctx.arc(X(st.V), Y(clamp(lg, L0, L1)), 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = COL.surface;
  ctx.lineWidth = 2;
  ctx.stroke();
}
