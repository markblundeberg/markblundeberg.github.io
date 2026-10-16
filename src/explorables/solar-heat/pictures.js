// The pictures of two solar panels (model.js), for the page and its film. Each draws into a
// figure's context in its own virtual units (f.VW × f.VH), from a state:
//   st.panels   two of { T, panel (a Panel), op (Panel.operate at its voltage) }
//   st.same     whether both are held at the first one's best voltage
//   st.sun      the sun, as a fraction of the standard 1000 W/m²
//   st.dots     the dots on the wires (drawPanels' animation), from stepDots()

import { KELVIN, CELLS, VT, panel, WE, levels } from './model.js';

export const COL = {};
export const FONT = {
  display: '"Big Shoulders Display", "Arial Narrow", sans-serif',
  mono: '"Martian Mono", ui-monospace, Menlo, monospace',
  serif: '"Newsreader", Georgia, serif',
};
// text is drawn larger on narrow figures (read on a phone), by TS
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

// A panel's colour, from its temperature: the cool one's at 25 °C or less, the hot one's at 65 °C or
// more, mixed between.
function mix(a, b, t) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [A, B] = [p(a), p(b)];
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
}
export const tempColour = (T) => mix(COL.cool, COL.hot, clamp((T - KELVIN - 25) / 40, 0, 1));
// what a panel at T in full sun suggests (cells run some 25–35 °C above the air)
export function describe(T) {
  const C = T - KELVIN;
  return C < 5 ? 'a freezing day' : C < 35 ? 'a cold, bright day' : C < 55 ? 'a warm day, on a roof' : 'a hot day, on a roof';
}
const fmt = (x, d = 1) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('-', '−');

// ---------- picture 1: the two panels ----------

// The dots on each panel's wire: a dot for a fixed number of electrons (DOT per second of a full
// panel's current, at most), delivered up to the panel's voltage, or leaking back. A deterministic
// stream: each panel accumulates its rates and lets a dot go when it reaches one.
const DOT = 14; // dots per second at 8.5 A
export function stepDots(st, dt) {
  st.dots ??= [];
  st.acc ??= [[0, 0.5], [0.25, 0.75]];
  st.clock = (st.clock ?? 0) + dt;
  st.panels.forEach((p, i) => {
    const out = Math.max(0, panel.A(p.op.J)), leak = Math.max(0, panel.A(p.op.leak));
    const acc = st.acc[i];
    acc[0] += (out / 8.5) * DOT * dt;
    acc[1] += (leak / 8.5) * DOT * dt;
    for (; acc[0] >= 1; acc[0]--) st.dots.push({ i, kind: 'out', t: 0, s: (st.seed = ((st.seed ?? 7) * 16807) % 2147483647) / 2147483647 });
    for (; acc[1] >= 1; acc[1]--) st.dots.push({ i, kind: 'leak', t: 0, s: (st.seed = ((st.seed ?? 7) * 16807) % 2147483647) / 2147483647 });
  });
  const events = [];
  for (const d of st.dots) {
    const before = d.t;
    d.t += dt;
    // events, for the film's sound: delivered at the top (t = 1.2), leaked back at the bottom (t = 1.5)
    if (d.kind === 'out' && before < 1.2 && d.t >= 1.2) events.push({ i: d.i, kind: 'out' });
    if (d.kind === 'leak' && before < 1.5 && d.t >= 1.5) events.push({ i: d.i, kind: 'leak' });
  }
  st.dots = st.dots.filter((d) => d.t < (d.kind === 'out' ? 2.0 : 1.9));
  return events;
}

function drawPanelArt(ctx, x, y, w, h, T, sun) {
  // the frame, and 6 × 10 cells
  ctx.fillStyle = COL.frame;
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  const cw = w / 6, ch = h / 10;
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 6; c++) {
      ctx.fillStyle = COL.cell;
      ctx.fillRect(x + c * cw + 1, y + r * ch + 1, cw - 2, ch - 2);
    }
  // the busbars
  ctx.strokeStyle = COL['cell-line'];
  ctx.lineWidth = 1;
  for (let c = 0; c < 6; c++)
    for (const f of [0.33, 0.67]) {
      ctx.beginPath();
      ctx.moveTo(x + (c + f) * cw, y + 1);
      ctx.lineTo(x + (c + f) * cw, y + h - 1);
      ctx.stroke();
    }
  // sunlight on it, and its warmth
  ctx.fillStyle = COL.sun;
  ctx.globalAlpha = 0.1 * sun;
  ctx.fillRect(x, y, w, h);
  const heat = clamp((T - KELVIN - 25) / 40, 0, 1);
  if (heat > 0) {
    const g = ctx.createLinearGradient(0, y + h, 0, y);
    g.addColorStop(0, COL.hot);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.45 * heat;
    ctx.fillRect(x, y, w, h);
  }
  ctx.globalAlpha = 1;
}

function drawSun(ctx, x, y, r, sun) {
  ctx.save();
  ctx.globalAlpha = 0.35 + 0.65 * sun;
  ctx.strokeStyle = COL.sun;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35);
    ctx.lineTo(x + Math.cos(a) * r * (1.6 + 0.25 * sun), y + Math.sin(a) * r * (1.6 + 0.25 * sun));
    ctx.stroke();
  }
  ctx.fillStyle = COL.sun;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

// The layout of picture 1, shared by the film: each panel's column, and the chart below.
export function panelsLayout(VW, VH) {
  const narrow = VW < 800, cw = VW / 2;
  const top = narrow ? 92 : 84, pw = narrow ? cw * 0.4 : cw * 0.36, ph = pw * 1.45;
  return {
    narrow, cw, top, pw, ph,
    lift: (i) => i * cw + (narrow ? 20 : 34) + pw + (narrow ? 34 : 56),
    panelX: (i) => i * cw + (narrow ? 20 : 34),
    base: top + ph,
    chart: { x0: narrow ? 52 : 70, x1: VW - 24, y0: top + ph + (narrow ? 170 : 160), y1: VH - 44 },
  };
}
const VMAX = 44; // the panels' voltage scale, V

export function drawPanels(f, st, opts = {}) {
  const { ctx, VW, VH } = f, L = panelsLayout(VW, VH), { narrow } = L;
  TS = opts.ts ?? (narrow ? 1.2 : 1);
  if (opts.clear !== false) ctx.clearRect(0, 0, VW, VH);
  drawSun(ctx, VW / 2, 34, narrow ? 15 : 18, st.sun);
  st.panels.forEach((p, i) => {
    const x = L.panelX(i), col = tempColour(p.T), lx = L.lift(i), H = L.ph;
    text(ctx, `${fmt(p.T - KELVIN, 0)} °C panel`, i === 0 ? x : i * L.cw + L.cw - (narrow ? 14 : 24), 40, { size: narrow ? 34 : 40, weight: 800, family: 'display', color: col, align: i === 0 ? 'left' : 'right' });
    text(ctx, describe(p.T), i === 0 ? x : i * L.cw + L.cw - (narrow ? 14 : 24), 62, { size: narrow ? 11 : 12, color: COL.muted, align: i === 0 ? 'left' : 'right' });
    drawPanelArt(ctx, x, L.top, L.pw, L.ph, p.T, st.sun);
    // the wire from the panel's foot to the lift, and the lift: as high as the panel's voltage
    const V = panel.V(p.op.V), top = L.base - (H * clamp(V, 0, VMAX)) / VMAX;
    ctx.strokeStyle = COL['line-2'];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + L.pw / 2, L.base + 3);
    ctx.lineTo(x + L.pw / 2, L.base + 14);
    ctx.lineTo(lx, L.base + 14);
    ctx.lineTo(lx, top);
    ctx.lineTo(lx + (narrow ? 34 : 70), top);
    ctx.stroke();
    // the voltage scale beside the lift
    ctx.fillStyle = COL.line;
    ctx.fillRect(lx + 7, L.top, 4, H);
    ctx.fillStyle = col;
    ctx.fillRect(lx + 7, top, 4, L.base - top);
    text(ctx, `${fmt(V)} V`, lx + 14, top - 10, { size: narrow ? 13 : 15, weight: 600, color: COL.ink });
    // the dots: delivered up the lift and off to the right; leaks climb partway and fall back
    for (const d of (st.dots ?? []).filter((dd) => dd.i === i)) {
      let px, py, a = 1;
      const foot = [x + L.pw / 2, L.base + 14];
      if (d.t < 0.25) [px, py] = [foot[0] + ((lx - foot[0]) * d.t) / 0.25, foot[1]];
      else if (d.kind === 'out') {
        const u = Math.min(1, (d.t - 0.25) / 0.95);
        [px, py] = d.t < 1.2 ? [lx, foot[1] + (top - foot[1]) * u] : [lx + ((d.t - 1.2) / 0.8) * (narrow ? 34 : 70), top];
        a = d.t > 1.6 ? (2 - d.t) / 0.4 : 1;
      } else {
        const peak = 0.35 + 0.6 * d.s, up = (d.t - 0.25) / 0.6, hgt = up < 1 ? up * peak : peak * Math.max(0, 1 - (d.t - 0.85) / 0.65);
        [px, py] = [lx, foot[1] + (top - foot[1]) * hgt];
        a = d.t > 1.5 ? Math.max(0, (1.9 - d.t) / 0.4) : 1;
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = d.kind === 'out' ? COL.e : COL.leak;
      ctx.beginPath();
      ctx.arc(px, py, narrow ? 3.2 : 3.8, 0, 2 * Math.PI);
      ctx.fill();
      if (d.kind === 'leak' && d.t > 1.45 && d.t < 1.9) {
        ctx.strokeStyle = COL.leak;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 4 + 22 * (d.t - 1.45), 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // the meters
    const mx = i === 0 ? x : x, my = L.base + (narrow ? 50 : 52);
    text(ctx, `${fmt(panel.W(p.op.P), 0)} W`, mx, my + (narrow ? 22 : 26), { size: narrow ? 40 : 52, weight: 900, family: 'display', color: col });
    text(ctx, `${fmt(V)} V × ${fmt(panel.A(p.op.J), 2)} A`, mx, my + (narrow ? 44 : 52), { size: narrow ? 11 : 13, color: COL['ink-2'] });
  });
  if (!opts.noChart) drawPV(ctx, st, L.chart, narrow);
}

// Power against voltage, both panels on one scale, each dot where it runs.
function drawPV(ctx, st, c, narrow) {
  const { x0, x1, y0, y1 } = c, Wmax = Math.max(60, ...st.panels.map((p) => panel.W(p.panel.Pmax))) * 1.18;
  const X = (V) => x0 + ((x1 - x0) * V) / VMAX, Y = (W) => y1 - ((y1 - y0) * Math.max(0, W)) / Wmax;
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y1);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  for (let V = 0; V <= VMAX; V += 10) text(ctx, `${V}`, X(V), y1 + 16, { size: 11, color: COL.muted, align: 'center' });
  text(ctx, 'panel voltage (V)', x1, y1 + 32, { size: 11, color: COL.muted, align: 'right' });
  const step = Wmax > 200 ? 100 : 50;
  for (let W = step; W < Wmax; W += step) {
    text(ctx, `${W}`, x0 - 8, Y(W) + 4, { size: 11, color: COL.muted, align: 'right' });
    ctx.strokeStyle = COL.line;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(x0, Y(W));
    ctx.lineTo(x1, Y(W));
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  text(ctx, 'power (W)', x0, y0 - 10, { size: 11, color: COL.muted });
  if (st.same) {
    const V = panel.V(st.panels[0].op.V);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = COL.muted;
    ctx.beginPath();
    ctx.moveTo(X(V), y0);
    ctx.lineTo(X(V), y1);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  st.panels.forEach((p) => {
    const col = tempColour(p.T), { V, J } = p.panel.curve;
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    V.forEach((v, k) => (k ? ctx.lineTo : ctx.moveTo).call(ctx, X(panel.V(v)), Y(panel.W(v * J[k]))));
    ctx.stroke();
    const ox = X(panel.V(p.op.V)), oy = Y(panel.W(p.op.P));
    ctx.fillStyle = col;
    ctx.strokeStyle = COL.surface;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox, oy, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  });
}

// ---------- picture 2: the hill ----------

const XMAX = 1.6e-6; // the front 1.6 µm: the emitter, the junction, and the start of the base
export function drawHill(f, st) {
  const { ctx, VW, VH } = f, narrow = VW < 800;
  TS = narrow ? 1.2 : 1.15;
  ctx.clearRect(0, 0, VW, VH);
  const lv = st.panels.map((p) => p.op.levels ?? levels(p.op.S));
  // one energy scale for both: from below the lowest E_v to above the highest E_c, in the window
  const inWin = (l, k) => lv.flatMap((L) => L[k].filter((_, g) => L.x[g] <= XMAX));
  const lo = Math.min(...inWin(lv, 'Ev')) - 0.12, hi = Math.max(...inWin(lv, 'Ec')) + 0.18;
  const cw = narrow ? VW : VW / 2, ch = narrow ? VH / 2 : VH;
  st.panels.forEach((p, i) => {
    const L = lv[i], ox = narrow ? 0 : i * cw, oy = narrow ? i * ch : 0;
    const px0 = ox + (narrow ? 56 : 64), px1 = ox + cw - (narrow ? 124 : 124), py0 = oy + 46, py1 = oy + ch - 34;
    const X = (x) => px0 + ((px1 - px0) * x) / XMAX, Y = (E) => py1 - ((py1 - py0) * (E - lo)) / (hi - lo);
    const col = tempColour(p.T), idx = L.x.map((x, g) => g).filter((g) => L.x[g] <= XMAX * 1.0001);
    text(ctx, `${fmt(p.T - KELVIN, 0)} °C`, px0, oy + 26, { size: 26, weight: 800, family: 'display', color: col });
    text(ctx, st.same ? `held at ${fmt(panel.V(p.op.V))} V` : `at its best, ${fmt(panel.V(p.op.V))} V`, px0 + 62, oy + 26, { size: 11.5, color: COL.muted });
    // the emitter, shaded
    ctx.fillStyle = COL.line;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(X(0), py0, X(WE) - X(0), py1 - py0);
    ctx.globalAlpha = 1;
    text(ctx, 'front layer', X(WE / 2), py1 + 16, { size: 10.5, color: COL.muted, align: 'center' });
    text(ctx, 'base →', X(WE) + 40, py1 + 16, { size: 10.5, color: COL.muted, align: 'left' });
    // the bands: electrons live at E_c and above, holes at E_v and below
    const band = (k, sign, fill) => {
      ctx.beginPath();
      idx.forEach((g, j) => (j ? ctx.lineTo : ctx.moveTo).call(ctx, X(L.x[g]), Y(L[k][g])));
      ctx.lineTo(X(L.x[idx.at(-1)]), sign > 0 ? py0 : py1);
      ctx.lineTo(X(0), sign > 0 ? py0 : py1);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.globalAlpha = 0.13;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      idx.forEach((g, j) => (j ? ctx.lineTo : ctx.moveTo).call(ctx, X(L.x[g]), Y(L[k][g])));
      ctx.strokeStyle = COL['ink-2'];
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };
    band('Ec', 1, COL.e);
    band('Ev', -1, COL.h);
    // the quasi-Fermi levels: the electrons' and the holes' own levels
    for (const [k, c] of [['Efn', COL.e], ['Efp', COL.h]]) {
      ctx.beginPath();
      idx.forEach((g, j) => (j ? ctx.lineTo : ctx.moveTo).call(ctx, X(L.x[g]), Y(L[k][g])));
      ctx.strokeStyle = c;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }
    const g0 = idx.find((g) => L.x[g] >= 0.1e-6), g1 = idx.at(-1);
    text(ctx, "electrons' level", px1 - 4, Y(L.Efn[g1]) - 8, { size: 10.5, color: COL.e, align: 'right' });
    text(ctx, "holes' level", px1 - 4, Y(L.Efp[g1]) + 17, { size: 10.5, color: COL.h, align: 'right' });
    // the hill: how far E_c rises from the front layer into the base
    const hx = X(0.12e-6), yA = Y(L.Ec[g0]), yB = Y(L.Ec[g1]);
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(hx, yB);
    ctx.lineTo(X(XMAX), yB);
    ctx.stroke();
    ctx.setLineDash([]);
    arrow(ctx, hx, yA - 2, hx, yB + 2, col);
    const tx = X(0.55e-6);
    text(ctx, `hill ${(p.op.hill).toFixed(2)} eV`, tx, yB - 26, { size: 12, weight: 600, color: col });
    text(ctx, `1 in ${oneIn(Math.exp(p.op.hill / VT(p.T)))} gets over`, tx, yB - 10, { size: 10.5, color: COL['ink-2'] });
    // the split between the levels, at the back of the window: the cell's voltage
    const sx = X(XMAX) + 40, yn = Y(L.Efn[g1]), yp = Y(L.Efp[g1]);
    arrow(ctx, sx, yp - 2, sx, yn + 2, COL.ink, true);
    text(ctx, `${(L.Efn[g1] - L.Efp[g1]).toFixed(3)} V`, sx + 6, (yn + yp) / 2 - 6, { size: 11.5, weight: 600, color: COL.ink });
    text(ctx, 'split', sx + 6, (yn + yp) / 2 + 9, { size: 10.5, color: COL.muted });
    text(ctx, '× 60 cells', sx + 6, (yn + yp) / 2 + 23, { size: 10.5, color: COL.muted });
    text(ctx, `= ${fmt(panel.V(L.Efn[g1] - L.Efp[g1]))} V`, sx + 6, (yn + yp) / 2 + 37, { size: 10.5, color: COL.muted });
  });
}
function oneIn(n) {
  if (n < 1e3) return `${Math.round(n)}`;
  if (n < 1e6) return `${(Math.round(n / 1e3)).toLocaleString('en')} 000`;
  if (n < 1e9) return `${+(n / 1e6).toPrecision(2)} million`;
  return `${+(n / 1e9).toPrecision(2)} billion`;
}
function arrow(ctx, x0, y0, x1, y1, color, both = false) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  const head = (xa, ya, xb, yb) => {
    const a = Math.atan2(yb - ya, xb - xa);
    ctx.beginPath();
    ctx.moveTo(xb, yb);
    ctx.lineTo(xb - 7 * Math.cos(a - 0.4), yb - 7 * Math.sin(a - 0.4));
    ctx.lineTo(xb - 7 * Math.cos(a + 0.4), yb - 7 * Math.sin(a + 0.4));
    ctx.closePath();
    ctx.fill();
  };
  head(x0, y0, x1, y1);
  if (both) head(x1, y1, x0, y0);
}

// ---------- picture 3: count and height ----------

// Left: power as an area, electrons per second (current) across, energy each (voltage) up. Right:
// where every 100 pairs the light makes go.
export function drawShare(f, st) {
  const { ctx, VW, VH } = f, narrow = VW < 800;
  TS = narrow ? 1.2 : 1;
  ctx.clearRect(0, 0, VW, VH);
  // the rectangles
  const r = narrow ? { x0: 56, x1: VW - 30, y0: 30, y1: VH * 0.5 - 30 } : { x0: 64, x1: VW * 0.46, y0: 36, y1: VH - 46 };
  const Amax = 10, Vmax = VMAX, X = (A) => r.x0 + ((r.x1 - r.x0) * A) / Amax, Y = (V) => r.y1 - ((r.y1 - r.y0) * V) / Vmax;
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(r.x0, r.y0);
  ctx.lineTo(r.x0, r.y1);
  ctx.lineTo(r.x1, r.y1);
  ctx.stroke();
  for (let A = 0; A <= Amax; A += 2) text(ctx, `${A}`, X(A), r.y1 + 15, { size: 11, color: COL.muted, align: 'center' });
  for (let V = 10; V <= Vmax; V += 10) text(ctx, `${V}`, r.x0 - 8, Y(V) + 4, { size: 11, color: COL.muted, align: 'right' });
  text(ctx, 'current: electrons per second (A)', r.x1, r.y1 + 31, { size: 11, color: COL.muted, align: 'right' });
  text(ctx, 'voltage: energy each (V)', r.x0, r.y0 - 12, { size: 11, color: COL.muted });
  st.panels.forEach((p, i) => {
    const col = tempColour(p.T), A = Math.max(0, panel.A(p.op.J)), V = panel.V(p.op.V);
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(X(0), Y(V), X(A) - X(0), Y(0) - Y(V));
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(X(0), Y(V), X(A) - X(0), Y(0) - Y(V));
    text(ctx, `${fmt(Math.max(0, panel.W(p.op.P)), 0)} W`, X(A) - 8, Y(V) + (i ? 18 : -8), { size: 15, weight: 700, color: col, align: 'right' });
  });
  // the fates, per 100 pairs
  const b = narrow ? { x0: 20, x1: VW - 20, y0: VH * 0.5 + 56 } : { x0: VW * 0.54, x1: VW - 24, y0: 52 };
  text(ctx, 'every 100 pairs the light makes', b.x0, b.y0 - 18, { size: 11.5, color: COL.muted });
  const parts = [
    ['delivered', 'delivered', COL.e],
    ['front', 'lost at the front', COL.muted],
    ['base', 'in the base', COL.h],
    ['back', 'at the back', COL['ink-2']],
  ];
  const bh = 30, gap = narrow ? 64 : 78;
  st.panels.forEach((p, i) => {
    const y = b.y0 + i * gap, F = p.op.fates, col = tempColour(p.T);
    text(ctx, `${fmt(p.T - KELVIN, 0)} °C`, b.x0, y + 20, { size: 20, weight: 800, family: 'display', color: col });
    let x = b.x0 + 54;
    const w = b.x1 - x;
    for (const [k, , c] of parts) {
      const share = Math.max(0, F[k] / F.made), dx = w * share;
      ctx.fillStyle = c;
      ctx.globalAlpha = k === 'delivered' ? 0.85 : 0.6;
      ctx.fillRect(x, y, Math.max(0, dx - 2), bh);
      ctx.globalAlpha = 1;
      if (dx > 26) text(ctx, `${Math.round(100 * share)}`, x + dx / 2, y + bh / 2 + 1, { size: 12, weight: 600, color: k === 'delivered' ? COL.bg : COL.ink, align: 'center', base: 'middle' });
      x += dx;
    }
    // the same panel at short circuit: what's never collected, whatever the voltage
    const xs = b.x0 + 54 + w * (p.panel.short.delivered / p.panel.short.made);
    ctx.strokeStyle = COL.ink;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(xs, y - 5);
    ctx.lineTo(xs, y + bh + 5);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  // a key, wrapping as it needs to
  let kx = b.x0 + 54, ky = b.y0 + 2 * gap + 6;
  for (const [k, label, c] of parts) {
    font(ctx, 11);
    const w = 16 + ctx.measureText(label).width;
    if (kx + w > b.x1) (kx = b.x0 + 54), (ky += 20);
    ctx.fillStyle = c;
    ctx.globalAlpha = k === 'delivered' ? 0.85 : 0.6;
    ctx.fillRect(kx, ky, 11, 11);
    ctx.globalAlpha = 1;
    text(ctx, label, kx + 16, ky + 10, { size: 11, color: COL['ink-2'] });
    kx += w + 16;
  }
  ctx.strokeStyle = COL.ink;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(b.x0 + 54 + 5, ky + 26);
  ctx.lineTo(b.x0 + 54 + 5, ky + 40);
  ctx.stroke();
  ctx.setLineDash([]);
  text(ctx, narrow ? 'delivered at 0 V' : 'delivered at 0 V, where nothing leaks back', b.x0 + 54 + 16, ky + 37, { size: 11, color: COL['ink-2'] });
}
