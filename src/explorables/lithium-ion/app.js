// The page: one live battery (model.js), the bar that drives it, and four pictures of it, plus a
// race between two chargers. Every picture is a canvas drawn in its own virtual units and scaled
// to fit; the spatial ones share one x mapping, so the graphite lines up from picture to picture.

import { Cell, C1, Q, L, La, Ls, Lc, GR, LFP, SALT, VMAX, VMIN, MARGIN, X_EMPTY, ocvCurve } from './model.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- colours, from the page's CSS (both themes) ----------
let COL = {};
function readColours() {
  const cs = getComputedStyle(document.documentElement);
  for (const k of ['bg', 'surface', 'line', 'line-2', 'ink', 'ink-2', 'muted', 'li', 'li-glow', 'e', 'anion', 'graphite', 'graphite-line', 'electrolyte', 'lfp', 'lfp-line', 'copper', 'aluminium', 'metal', 'charge', 'use', 'warn'])
    COL[k] = cs.getPropertyValue(`--${k}`).trim();
}
readColours();
// The night/day switch: an explicit choice overrides the system's, and is remembered.
const themeBtn = $('theme');
function setTheme(t) {
  if (t) document.documentElement.dataset.theme = t;
  const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark');
  themeBtn.textContent = dark ? '☀ day' : '☾ night';
  readColours();
}
try { setTheme(localStorage.getItem('li-theme')); } catch { setTheme(); }
themeBtn.addEventListener('click', () => {
  const next = getComputedStyle(document.documentElement).colorScheme.includes('dark') ? 'light' : 'dark';
  try { localStorage.setItem('li-theme', next); } catch {}
  setTheme(next);
});
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', () => (readColours(), (dirty = true)));
const MONO = (px, w = 400) => `${w} ${px * FS}px "Martian Mono", ui-monospace, monospace`;
const DISPLAY = (px, w = 800) => `${w} ${px * FS}px "Big Shoulders Display", "Arial Narrow", sans-serif`;

// ---------- canvases ----------
// Each figure draws on a virtual page, VW × VH, scaled to the canvas's width; a narrow screen
// gets a narrower page (so larger type and dots).
const figs = [];
function figure(canvas, wide, narrow, draw) {
  const f = { canvas, ctx: canvas.getContext('2d'), wide, narrow, draw, visible: true };
  figs.push(f);
  new IntersectionObserver(([e]) => (f.visible = e.isIntersecting), { rootMargin: '200px' }).observe(canvas);
  fit(f);
  return f;
}
function fit(f) {
  const w = f.canvas.clientWidth || f.wide[0], dpr = Math.min(2, devicePixelRatio || 1);
  [f.VW, f.VH] = w < 560 ? f.narrow : f.wide;
  f.canvas.width = Math.round(w * dpr);
  f.canvas.height = Math.round((w * f.VH * dpr) / f.VW);
  f.canvas.style.height = `${(w * f.VH) / f.VW}px`;
  f.ctx.setTransform((w * dpr) / f.VW, 0, 0, (w * dpr) / f.VW, 0, 0);
}
addEventListener('resize', () => { for (const f of figs) fit(f); dirty = true; });
const dot = (ctx, x, y, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };

// The device's span, shared by the spatial pictures (virtual units, 960 wide).
let X0 = 70, X1 = 880, FS = 1, RS = 1;
const px = (x) => X0 + ((X1 - X0) * x) / L;
// The span and the type and dot scales, for this figure's page.
function span(f) {
  const narrow = f.VW < 900;
  X0 = narrow ? 64 : 70;
  X1 = f.VW - (narrow ? 58 : 80);
  FS = narrow ? 1.3 : 1;
  RS = narrow ? 0.8 : 1;
}
const REGIONS = () => [[0, La, COL.graphite], [La, La + Ls, COL.electrolyte], [La + Ls, L, COL.lfp]];
function regionLabels(ctx, y) {
  ctx.font = MONO(15);
  ctx.fillStyle = COL.muted;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('graphite', px(La / 2), y);
  ctx.fillText('electrolyte', px(La + Ls / 2), y);
  ctx.fillText('iron phosphate', px(La + Ls + Lc / 2), y);
}

// ---------- the battery, and the bar ----------
let cell = new Cell();
const rate = $('rate'), watch = $('watch');
const C = () => 10 ** +rate.value;
const fmtTime = (min) => (min >= 90 ? `${(min / 60).toFixed(min >= 600 ? 0 : 1)} h` : `${Math.round(min)} min`);
const fmtC = (c) => (c < 1 ? c.toFixed(2) : c < 10 ? c.toFixed(1) : c.toFixed(0)).replace(/\.0$/, '');
cell.rate = C();
cell.setMode('charge');
let playing = true, dirty = true;
function showBar() {
  const st = cell.state;
  $('rateOut').textContent = `${fmtC(C())}C · ${fmtTime(60 / C())}`;
  for (const b of document.querySelectorAll('.modes button')) b.setAttribute('aria-pressed', b.dataset.mode === cell.mode);
  const pct = clamp(st.soc, 0, 1);
  $('gFill').style.width = `${100 * pct}%`;
  $('gIcon').classList.toggle('low', pct < 0.15);
  $('gPct').textContent = `${Math.round(100 * pct)}%`;
  $('gV').textContent = `${st.V.toFixed(2)} V`;
  const c = cell.I / C1, plating = st.margin < 0 && cell.I > 0;
  let s;
  if (cell.mode === 'charge') s = `charging at <b>${fmtC(c)}C</b>${cell.cv ? ' · at the voltage limit' : cell.watch && c < cell.rate * 0.98 ? ' · easing off' : ''}`;
  else if (cell.mode === 'use') s = `discharging at <b>${fmtC(-c)}C</b>`;
  else s = cell.events.at(-1)?.kind === 'full' && cell.time - cell.events.at(-1).t < 1800 ? '<b>full</b> · resting' : cell.events.at(-1)?.kind === 'empty' && cell.time - cell.events.at(-1).t < 1800 ? '<b>empty</b> · resting' : 'resting';
  if (plating) s += ' · <span class="warn">past the plating line</span>';
  $('status').innerHTML = s;
}
for (const b of document.querySelectorAll('.modes button')) b.addEventListener('click', () => { cell.setMode(b.dataset.mode); dirty = true; });
rate.addEventListener('input', () => { cell.setRate(C()); showBar(); });
watch.addEventListener('change', () => { cell.watch = watch.checked; if (cell.mode === 'charge' && !cell.cv) cell.setI(cell.rate * C1); });
$('more').addEventListener('click', () => { const open = $('bar').classList.toggle('open'); $('more').textContent = open ? 'Less' : 'More'; $('more').setAttribute('aria-expanded', open); });
$('play').addEventListener('click', () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; $('play').setAttribute('aria-pressed', playing); });
$('empty').addEventListener('click', () => {
  const mode = cell.mode === 'rest' ? 'charge' : cell.mode;
  cell = new Cell();
  cell.rate = C();
  cell.watch = watch.checked;
  cell.setMode(mode === 'use' ? 'rest' : mode);
  crowdReset();
  dirty = true;
});
// Time-lapse: a full charge (or discharge) at the speed in the bar takes about fifteen seconds.
const simPerWall = () => 3600 / C() / 15;

// ---------- picture 1: the crowd ----------
// Lithium as sites that fill: each host a lattice of them (rows between the graphite's sheets, a
// grid in the phosphate), each site a fixed amount, filled column by column as the solution says.
// The electrolyte's ions are a fast-mixing crowd. Lithium leaving a host flies to the crowd and
// lithium entering one comes from it, so the dots are conserved.
const CT = 116, CB = 396, CPAD = 9, FLY = 14;
const HOSTS = [
  { region: 0, x0: 0, x1: La, cMax: GR.cMax, cols: 24, rows: 13, side: 0, y: (j) => CT + 21 + 21 * j, xd: (K) => ((K + 0.5) / 24) * La, nudge: (j) => (j % 2) * 3 },
  { region: 2, x0: La + Ls, x1: L, cMax: LFP.cMax, cols: 15, rows: 18, side: 1, y: (j) => CT + CPAD + 6 + ((j + 0.5) * (CB - CT - 2 * CPAD - 12)) / 18, xd: (K) => La + Ls + ((K + 0.5) / 15) * Lc, nudge: () => 0 },
];
const WEIGHT = (GR.cMax * La) / (24 * 13); // mol/m² of lithium per dot, the same everywhere
let rnd = mulberry(11);
function mulberry(seed) { return () => ((seed = (seed + 0x6d2b79f5) | 0), (((seed ^ (seed >>> 15)) * (1 | seed)) >>> 0) / 4294967296); }
const crowd = { sites: [], li: [], anions: [], flyers: [] };
// Positions are kept as [device x (m), page y], and placed on the page as each frame is drawn.
const crowdXY = (p) => [La + (0.04 + 0.92 * p.x) * Ls, CT + CPAD + p.y * (CB - CT - 2 * CPAD)];
const siteX = (s) => px(s.xd) + s.nudge * RS;
function fillings(S, h) {
  const f = new Float64Array(h.cols), n = new Float64Array(h.cols);
  for (let k = 0; k < S.x.length; k++) {
    if (S.region[k] !== h.region) continue;
    const K = Math.min(h.cols - 1, Math.floor(((S.x[k] - h.x0) / (h.x1 - h.x0)) * h.cols));
    f[K] += S.c['Li+'][k] / h.cMax;
    n[K]++;
  }
  return f.map((v, K) => v / n[K]);
}
function targets(S, h) {
  const per = (h.cMax * (h.x1 - h.x0)) / WEIGHT / h.cols;
  const want = fillings(S, h).map((f) => Math.min(h.rows, f * per)), base = want.map(Math.floor);
  let spare = Math.round(want.reduce((a, b) => a + b)) - base.reduce((a, b) => a + b);
  const order = [...want.keys()].sort((i, j) => want[j] - base[j] - (want[i] - base[i]));
  for (const K of order) if (spare-- > 0) base[K]++;
  return base;
}
function pick(list, n) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, Math.max(0, n));
}
function crowdReset() {
  const S = cell.solution;
  crowd.sites = [];
  crowd.flyers = [];
  HOSTS.forEach((h, hi) => {
    const t = targets(S, h);
    for (let K = 0; K < h.cols; K++) {
      const col = [];
      for (let j = 0; j < h.rows; j++) col.push({ h: hi, K, xd: h.xd(K), nudge: h.nudge(j), Y: h.y(j), state: 0 });
      for (const s of pick(col, t[K])) s.state = 1;
      crowd.sites.push(...col);
    }
  });
  const n = Math.round((SALT * Ls) / WEIGHT);
  const fresh = () => ({ x: rnd(), y: rnd(), vx: 0, vy: 0 });
  crowd.li = Array.from({ length: n }, fresh);
  crowd.anions = Array.from({ length: n }, fresh);
}
function crowdStep() {
  const S = cell.solution;
  HOSTS.forEach((h, hi) => {
    const t = targets(S, h);
    for (let K = 0; K < h.cols; K++) {
      const col = crowd.sites.filter((s) => s.h === hi && s.K === K), held = col.filter((s) => s.state > 0).length;
      if (t[K] > held) {
        for (const site of pick(col.filter((s) => s.state === 0), t[K] - held)) {
          let from;
          if (crowd.li.length) {
            const k = crowd.li.reduce((b, p, i) => ((h.side ? p.x > crowd.li[b].x : p.x < crowd.li[b].x) ? i : b), 0);
            from = crowdXY(crowd.li.splice(k, 1)[0]);
          } else from = crowdXY({ x: h.side, y: rnd() });
          site.state = 2;
          crowd.flyers.push({ from, to: [site.xd, site.Y], age: 0, site });
        }
      } else if (t[K] < held) {
        for (const site of pick(col.filter((s) => s.state === 1), held - t[K])) {
          site.state = 0;
          const p = { x: h.side ? 0.97 : 0.03, y: (site.Y - CT - CPAD) / (CB - CT - 2 * CPAD), vx: 0, vy: 0 };
          crowd.flyers.push({ from: [site.xd, site.Y], to: crowdXY(p), age: 0, join: p });
        }
      }
    }
  });
  for (const f of crowd.flyers) if (++f.age >= FLY) f.site ? (f.site.state = 1) : crowd.li.push(f.join);
  crowd.flyers = crowd.flyers.filter((f) => f.age < FLY);
  for (const list of [crowd.li, crowd.anions]) for (const p of list) {
    p.vx = 0.93 * p.vx + 0.03 * (rnd() - 0.5);
    p.vy = 0.93 * p.vy + 0.03 * (rnd() - 0.5);
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > 1) { p.x = clamp(p.x, 0, 1); p.vx = -p.vx; }
    if (p.y < 0 || p.y > 1) { p.y = clamp(p.y, 0, 1); p.vy = -p.vy; }
  }
}
let wire = 0;
function drawCrowd(f) {
  const { ctx, VW, VH } = f, st = cell.state;
  ctx.clearRect(0, 0, VW, VH);
  for (const [a, b, fill] of REGIONS()) { ctx.fillStyle = fill; ctx.fillRect(px(a), CT, px(b) - px(a), CB - CT); }
  ctx.strokeStyle = COL['graphite-line'];
  ctx.lineWidth = 1.5;
  for (let j = 0; j <= 13; j++) { const y = CT + 10.5 + 21 * j; if (y > CB - 2) break; ctx.beginPath(); ctx.moveTo(px(0), y); ctx.lineTo(px(La), y); ctx.stroke(); }
  // collectors and the wire, with what's on it
  ctx.fillStyle = COL.copper; ctx.fillRect(px(0) - 18, CT - 8, 18, CB - CT + 16);
  ctx.fillStyle = COL.aluminium; ctx.fillRect(px(L), CT - 8, 18, CB - CT + 16);
  const wy = 46, xl = px(0) - 9, xr = px(L) + 9;
  ctx.strokeStyle = COL['line-2'];
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xl, CT - 8); ctx.lineTo(xl, wy + 16); ctx.arcTo(xl, wy, xl + 16, wy, 16);
  ctx.lineTo(xr - 16, wy); ctx.arcTo(xr, wy, xr, wy + 16, 16); ctx.lineTo(xr, CT - 8);
  ctx.stroke();
  const charging = cell.I > 1e-9, using = cell.I < -1e-9, bw = 150 * FS, bh = 44, bx = (xl + xr) / 2 - bw / 2;
  if (charging || using) {
    const path = [[xr, CT - 8], [xr, wy], [xl, wy], [xl, CT - 8]];
    const seg = path.slice(1).map((p, k) => Math.hypot(p[0] - path[k][0], p[1] - path[k][1])), total = seg.reduce((a, b) => a + b);
    const at = (s) => { for (let k = 0; k < seg.length; k++) { if (s <= seg[k]) { const u = s / seg[k]; return [path[k][0] + u * (path[k + 1][0] - path[k][0]), path[k][1] + u * (path[k + 1][1] - path[k][1])]; } s -= seg[k]; } return path.at(-1); };
    const gap = 30;
    for (let s = ((wire % gap) + gap) % gap; s < total; s += gap) {
      const [x, y] = at(s);
      if (Math.abs(x - (bx + bw / 2)) < bw / 2 + 6 && Math.abs(y - wy) < bh) continue;
      dot(ctx, x, y, 4.5, COL.e);
    }
  }
  ctx.fillStyle = COL.surface;
  ctx.strokeStyle = charging ? COL.charge : using ? COL.use : COL['line-2'];
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(bx, wy - bh / 2, bw, bh, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = charging ? COL.charge : using ? COL.use : COL.muted;
  ctx.font = DISPLAY(26);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(charging ? 'CHARGER' : using ? 'PHONE' : 'UNPLUGGED', bx + bw / 2, wy + 1);
  // lithium
  for (const s of crowd.sites) {
    if (s.state === 1) dot(ctx, siteX(s), s.Y, (s.h ? 5.6 : 5.2) * RS, COL.li);
    else if (s.h === 1) { ctx.strokeStyle = COL['lfp-line']; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(siteX(s), s.Y, 3.6 * RS, 0, 7); ctx.stroke(); }
  }
  for (const p of crowd.anions) { const [x, y] = crowdXY(p); ctx.strokeStyle = COL.anion; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(px(x), y, 3.8 * RS, 0, 7); ctx.stroke(); }
  for (const p of crowd.li) { const [x, y] = crowdXY(p); dot(ctx, px(x), y, 5.6 * RS, COL.li); }
  for (const fl of crowd.flyers) {
    const u = fl.age / FLY, e = u * u * (3 - 2 * u), x = px(fl.from[0] + e * (fl.to[0] - fl.from[0])), y = fl.from[1] + e * (fl.to[1] - fl.from[1]);
    dot(ctx, x, y, 9 * RS, COL['li-glow']);
    dot(ctx, x, y, 5.6 * RS, COL.li);
  }
  // past the plating line: where metal would deposit
  if (st.margin < 0 && charging) {
    const g = ctx.createLinearGradient(px(La) - 26, 0, px(La) + 4, 0);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, COL.warn);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = g;
    ctx.fillRect(px(La) - 26, CT, 30, CB - CT);
    ctx.globalAlpha = 1;
    ctx.fillStyle = COL.warn;
    ctx.font = MONO(14, 600);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('lithium would plate here', px(La) + 10, CT - 12);
  }
  regionLabels(ctx, CB + 30);
}

// ---------- shared: a two-window level plot (one scale, a break between) ----------
function windows(top, bottom, lowRange, highRange, gap = 34) {
  const h = (bottom - top - gap) / 2;
  return {
    high: (v) => top + ((highRange[1] - v) / (highRange[1] - highRange[0])) * h,
    low: (v) => bottom - ((v - lowRange[0]) / (lowRange[1] - lowRange[0])) * h,
    bands: [[top, top + h], [bottom - h, bottom]],
    breakY: top + h + gap / 2,
  };
}
function drawBands(ctx, w) {
  for (const [y0, y1] of w.bands) for (const [a, b, fill] of REGIONS()) { ctx.globalAlpha = 0.6; ctx.fillStyle = fill; ctx.fillRect(px(a), y0, px(b) - px(a), y1 - y0); }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = COL.muted;
  ctx.lineWidth = 1.2;
  for (const dy of [-5, 5]) {
    ctx.beginPath();
    for (let x = px(0); x <= px(L); x += 5) ctx.lineTo(x, w.breakY + dy + 2.5 * Math.sin(x / 5));
    ctx.stroke();
  }
}
function ticks(ctx, y, range, step, fmt) {
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let v = Math.ceil(range[0] / step - 1e-9) * step; v <= range[1] + 1e-9; v += step) ctx.fillText(fmt(v), X0 - 10, y(v));
}
const fmtSigned = (v, d = 1) => `${v < -1e-9 ? '−' : ''}${Math.abs(v).toFixed(d)}`;
function trace(ctx, S, value, keep, y, color, width = 4) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  let on = false;
  for (let k = 0; k < S.x.length; k++) {
    const v = keep(S.region[k]) ? value(k) : NaN;
    if (!Number.isFinite(v)) { on = false; continue; }
    if (on) ctx.lineTo(px(S.x[k]), y(v)); else ctx.moveTo(px(S.x[k]), y(v));
    on = true;
  }
  ctx.stroke();
}

// ---------- picture 2: two shelves ----------
const SH_TOP = [-0.39, 0.06], SH_LOW = [-3.62, -3.17];
function drawShelves(f) {
  const { ctx, VW, VH } = f, S = cell.solution, st = cell.state;
  ctx.clearRect(0, 0, VW, VH);
  const w = windows(26, VH - 50, SH_LOW, SH_TOP);
  drawBands(ctx, w);
  ticks(ctx, w.high, SH_TOP, 0.1, (v) => fmtSigned(v));
  ticks(ctx, w.low, SH_LOW, 0.1, (v) => fmtSigned(v));
  // lithium metal: the ceiling
  ctx.strokeStyle = COL.metal;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(px(0), w.high(0)); ctx.lineTo(px(L), w.high(0)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = MONO(14, 600);
  ctx.fillStyle = COL.metal;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('lithium metal', px(L) - 8, w.high(0) - 6);
  // the shelves: μ_Li/e = V_Li⁺ − V_e⁻ in each host
  const mu = (k) => S.V['Li+'][k] - S.V['e-'][k];
  trace(ctx, S, mu, (r) => r === 0, w.high, COL.li, 5);
  trace(ctx, S, mu, (r) => r === 2, w.low, COL.li, 5);
  // lithium arriving at the graphite: Li⁺ from the liquid with an electron from the graphite
  const arrive = -st.margin, ya = w.high(clamp(arrive, SH_TOP[0], SH_TOP[1] + 0.03));
  ctx.strokeStyle = arrive > 0 && cell.I > 0 ? COL.warn : COL.li;
  ctx.lineWidth = 3;
  ctx.fillStyle = COL.surface;
  ctx.beginPath(); ctx.arc(px(La) + 9, ya, 7, 0, 7); ctx.fill(); ctx.stroke();
  const plating = arrive > 0 && cell.I > 0;
  ctx.font = MONO(13, plating ? 600 : 400);
  ctx.fillStyle = plating ? COL.warn : COL['ink-2'];
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const lines = plating ? ['arriving lithium is above', 'the metal: it plates'] : [cell.I > 1e-9 ? 'lithium arriving' : cell.I < -1e-9 ? 'lithium leaving' : 'lithium at the surface'];
  lines.forEach((t, k) => ctx.fillText(t, px(La) + 22, Math.max(ya + 10, w.high(0) + 10) + 17 * k));
  // the jump between the shelves (at rest: the battery's voltage), drawn down the liquid
  const ga = S.region.lastIndexOf(0), gc = S.region.indexOf(2), xm = px(La + Ls * 0.86);
  const hi = w.high(clamp(mu(ga), SH_TOP[0], SH_TOP[1])), lo = w.low(clamp(mu(gc), SH_LOW[0], SH_LOW[1]));
  ctx.strokeStyle = COL.muted;
  ctx.lineWidth = 1.4;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(xm - 34, hi); ctx.lineTo(xm + 14, hi); ctx.moveTo(px(La + Ls), lo); ctx.lineTo(xm - 14, lo); ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = COL['ink-2'];
  ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(xm, hi + 3); ctx.lineTo(xm, lo - 3); ctx.stroke();
  for (const [y, s] of [[hi + 3, 1], [lo - 3, -1]]) { ctx.beginPath(); ctx.moveTo(xm - 6, y + 10 * s); ctx.lineTo(xm, y); ctx.lineTo(xm + 6, y + 10 * s); ctx.stroke(); }
  const jy = w.high(SH_TOP[0]) - 62;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = COL.ink;
  ctx.font = DISPLAY(40);
  ctx.fillText(`${st.ocv.toFixed(2)} eV`, xm - 14, jy);
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  ctx.fillText('per lithium, at rest:', xm - 14, jy + 22);
  ctx.fillText(`the battery's ${st.ocv.toFixed(2)} V`, xm - 14, jy + 40);
  ctx.textAlign = 'center';
  ctx.fillText('no shelf in the liquid:', px(La + Ls * 0.36), w.low(-3.45));
  ctx.fillText('lithium crosses', px(La + Ls * 0.36), w.low(-3.45) + 18);
  ctx.fillText('in two halves', px(La + Ls * 0.36), w.low(-3.45) + 36);
  ctx.save();
  ctx.translate(18, (w.bands[0][0] + w.bands[1][1]) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('μ_Li (eV per atom)', 0, 0);
  ctx.restore();
  regionLabels(ctx, VH - 14);
}

// ---------- picture 3: the charging curve ----------
const OCV = ocvCurve(160);
function drawCurve(f) {
  const { ctx, VW, VH } = f;
  ctx.clearRect(0, 0, VW, VH);
  const xl = 90, xr = VW - 30, sx = (s) => xl + clamp(s, 0, 1) * (xr - xl);
  const top = [20, 290], bot = [340, VH - 60], vr = [2.75, 3.75], cmax = Math.max(1, Math.ceil(cell.rate));
  const sy = (v) => top[1] - ((v - vr[0]) / (vr[1] - vr[0])) * (top[1] - top[0]);
  const cy = (c) => (bot[0] + bot[1]) / 2 - (c / cmax) * ((bot[1] - bot[0]) / 2);
  // grids
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let v = 2.8; v <= 3.75; v += 0.1) { ctx.beginPath(); ctx.moveTo(xl, sy(v)); ctx.lineTo(xr, sy(v)); ctx.stroke(); if (Math.round(v * 10) % 2 === 0) ctx.fillText(`${v.toFixed(1)} V`, xl - 10, sy(v)); }
  const cstep = cmax > 4 ? 2 : 1;
  for (let c = -cmax; c <= cmax; c += cstep) { ctx.beginPath(); ctx.moveTo(xl, cy(c)); ctx.lineTo(xr, cy(c)); ctx.stroke(); ctx.fillText(`${c > 0 ? '+' : c < 0 ? '−' : ''}${Math.abs(c)}C`, xl - 10, cy(c)); }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let p = 0; p <= 100; p += 20) ctx.fillText(`${p}%`, sx(p / 100), VH - 46);
  ctx.fillText('charge', (xl + xr) / 2, VH - 24);
  ctx.strokeStyle = COL.muted;
  ctx.beginPath(); ctx.moveTo(xl, cy(0)); ctx.lineTo(xr, cy(0)); ctx.stroke();
  // limits and the rest curve
  ctx.setLineDash([2, 4]);
  ctx.strokeStyle = COL.muted;
  for (const v of [VMAX, VMIN]) { ctx.beginPath(); ctx.moveTo(xl, sy(v)); ctx.lineTo(xr, sy(v)); ctx.stroke(); }
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = COL['ink-2'];
  ctx.lineWidth = 2;
  ctx.beginPath();
  OCV.forEach((p, k) => (k ? ctx.lineTo(sx(p.soc), sy(p.V)) : ctx.moveTo(sx(p.soc), sy(p.V))));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('voltage limit', xl + 6, sy(VMAX) - 4);
  ctx.fillText('cut-off', xl + 6, sy(VMIN) - 4);
  ctx.fillText('at rest', sx(0.5) + 4, sy(OCV[80].V) + 22);
  // the run so far: its voltage and its current, coloured by what it was doing
  const tr = cell.trace, colour = (p) => (p.plating ? COL.warn : p.mode === 'charge' ? COL.charge : p.mode === 'use' ? COL.use : COL.muted);
  for (const [y, val] of [[sy, (p) => p.V], [cy, (p) => p.I]]) {
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    for (let k = 1; k < tr.length; k++) {
      const a = tr[k - 1], b = tr[k];
      ctx.strokeStyle = colour(b);
      ctx.beginPath(); ctx.moveTo(sx(a.soc), y(clamp(val(a), -1e3, 1e3))); ctx.lineTo(sx(b.soc), y(clamp(val(b), -1e3, 1e3))); ctx.stroke();
    }
  }
  const now = cell.state;
  for (const [y, v] of [[sy, now.V], [cy, cell.I / C1]]) { dot(ctx, sx(now.soc), y(v), 7, COL.ink); dot(ctx, sx(now.soc), y(v), 4, COL.surface); }
  ctx.font = DISPLAY(24);
  ctx.fillStyle = COL.ink;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('VOLTAGE', xr, sy(3.0) - 4);
  ctx.fillText('CURRENT', xr, cy(-cmax) - 30);
}

// ---------- picture 4: every species ----------
const SP_LOW = [-0.36, 0.14], SP_HIGH = [3.2, 3.7];
function drawSpecies(f) {
  const { ctx, VW, VH } = f, S = cell.solution, st = cell.state;
  ctx.clearRect(0, 0, VW, VH);
  const w = windows(26, VH - 50, SP_LOW, SP_HIGH);
  drawBands(ctx, w);
  ticks(ctx, w.high, SP_HIGH, 0.1, (v) => v.toFixed(1));
  ticks(ctx, w.low, SP_LOW, 0.1, (v) => fmtSigned(v));
  const Vli = (k) => S.V['Li+'][k], Ve = (k) => S.V['e-'][k];
  const within = (y, r) => (v) => y(clamp(v, r[0] - 0.02, r[1] + 0.02));
  trace(ctx, S, Vli, () => true, within(w.low, SP_LOW), COL.li, 4.5);
  ctx.setLineDash([7, 6]);
  trace(ctx, S, (k) => S.V['PF6-'][k], (r) => r === 1, within(w.low, SP_LOW), COL.ink, 2.2);
  ctx.setLineDash([]);
  const im = S.x.findIndex((x) => x > La + 0.3 * Ls);
  ctx.font = MONO(13, 600);
  ctx.fillStyle = COL.anion;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('PF₆⁻ (dashed)', px(La + 0.3 * Ls), within(w.low, SP_LOW)(S.V['PF6-'][im]) + 10);
  trace(ctx, S, Ve, (r) => r === 0, within(w.low, SP_LOW), COL.e, 4.5);
  trace(ctx, S, Ve, (r) => r === 2, within(w.high, SP_HIGH), COL.e, 4.5);
  const n = S.x.length - 1, ia = S.region.lastIndexOf(0);
  ctx.font = MONO(15, 600);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = COL.li; ctx.fillText('Li⁺', px(L) + 10, w.low(clamp(Vli(n), SP_LOW[0], SP_LOW[1])));
  ctx.fillStyle = COL.e; ctx.fillText('e⁻', px(L) + 10, w.high(clamp(Ve(n), SP_HIGH[0], SP_HIGH[1])));
  ctx.textAlign = 'left';
  ctx.fillText('e⁻', px(0) + 8, w.low(clamp(Ve(0), SP_LOW[0], SP_LOW[1])) - 14);
  // the plating check: red just outside the graphite against blue just inside
  const red = Vli(ia + 1), blue = Ve(ia), over = red > blue && cell.I > 0;
  if (red > blue - 0.03 && cell.I > 0) {
    const y = w.low((red + blue) / 2);
    ctx.strokeStyle = over ? COL.warn : COL.muted;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(px(La), y, 26, 0, 7); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = MONO(13);
    ctx.fillStyle = over ? COL.warn : COL.muted;
    ctx.textAlign = 'left';
    ctx.fillText(over ? 'red above blue: lithium can plate' : 'red nearing blue', px(La) + 34, y - 28);
  }
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  ctx.save();
  ctx.translate(18, (w.bands[0][0] + w.bands[1][1]) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('species voltage (V)', 0, 0);
  ctx.restore();
  regionLabels(ctx, VH - 14);
  showLedger(st);
}
// The battery's voltage taken apart: rest voltage, plus each place the push is spent.
const ledgerEl = document.createElement('div');
ledgerEl.className = 'ledger';
$('figSpecies').after(ledgerEl);
function showLedger(st) {
  const l = st.ledger, mv = (v) => `${v >= 0 ? '+' : '−'}${Math.abs(1000 * v).toFixed(Math.abs(v) < 0.0095 ? 1 : 0)} mV`, scale = 0.15;
  const row = (name, v, color) => `<span>${name}</span><span class="bar-v" style="width:${clamp(Math.abs(v) / scale, 0, 1) * 100}%;background:${color}"></span><b>${mv(v)}</b>`;
  ledgerEl.innerHTML =
    `<span>at rest, at this charge</span><span></span><b>${l.ocv.toFixed(3)} V</b>` +
    row('lithium crowding in the hosts', l.solids, COL.li) + row('crossing the surfaces', l.surfaces, COL.li) + row('the liquid', l.electrolyte, COL.li) +
    `<span style="color:var(--ink)">the battery's voltage</span><span></span><b>${st.V.toFixed(3)} V</b>`;
}

// ---------- the race ----------
const lanes = [$('laneA'), $('laneB')].map((el, i) => ({ el, watch: i === 1, cell: null, pts: [] }));
let racing = false;
function raceStart() {
  for (const ln of lanes) {
    ln.cell = new Cell();
    ln.cell.rate = C();
    ln.cell.watch = ln.watch;
    ln.cell.setMode('charge');
    ln.pts = [];
  }
  racing = true;
  $('raceGo').textContent = 'Race again';
  $('raceNote').textContent = `Both from empty, at up to ${fmtC(C())}C.`;
}
$('raceGo').addEventListener('click', raceStart);
function raceStep(dtWall) {
  if (!racing) return;
  const t = Math.max(...lanes.map((l) => l.cell.time)) + dtWall * (3600 / C() / 12);
  for (const ln of lanes) if (ln.cell.mode === 'charge') {
    ln.cell.advance(t, 6);
    ln.pts.push({ t: ln.cell.time, c: ln.cell.I / C1, p: ln.cell.state.margin < 0 });
  }
  if (lanes.every((l) => l.cell.mode !== 'charge')) {
    racing = false;
    const [a, b] = lanes.map((l) => l.cell.time / 60);
    $('raceNote').textContent = `Careful costs ${fmtTime(b - a)} here, and the plain charger spent ${fmtTime(lanes[0].cell.plated / 60)} past the plating line.`;
  }
}
function drawLanes() {
  for (const ln of lanes) {
    const c = ln.cell, el = ln.el;
    const soc = c ? clamp(c.state.soc, 0, 1) : 0;
    el.querySelector('.cell-icon i').style.width = `${100 * soc}%`;
    el.querySelector('.big b').textContent = `${Math.round(100 * soc)}%`;
    el.querySelector('[data-k=time]').textContent = c ? `${(c.time / 60).toFixed(1)} min` : '0 min';
    const pl = el.querySelector('[data-k=plate]');
    pl.textContent = c ? `${(c.plated / 60).toFixed(1)} min` : '0 min';
    pl.classList.toggle('warn', !!c && c.plated > 0);
    const cv = el.querySelector('canvas'), w = cv.clientWidth, h = 70, dpr = Math.min(2, devicePixelRatio || 1);
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!c || ln.pts.length < 2) continue;
    const tmax = Math.max(60, ...lanes.map((l) => l.cell?.time ?? 0)), cm = c.rate;
    ctx.lineWidth = 2.5;
    for (let k = 1; k < ln.pts.length; k++) {
      const a = ln.pts[k - 1], b = ln.pts[k];
      ctx.strokeStyle = b.p ? COL.warn : COL.charge;
      ctx.beginPath(); ctx.moveTo((a.t / tmax) * w, h - 4 - (a.c / cm) * (h - 10)); ctx.lineTo((b.t / tmax) * w, h - 4 - (b.c / cm) * (h - 10)); ctx.stroke();
    }
  }
}

// ---------- run ----------
const fCrowd = figure($('figCrowd'), [960, 440], [600, 440], drawCrowd);
const fShelves = figure($('figShelves'), [960, 520], [600, 560], drawShelves);
const fCurve = figure($('figCurve'), [960, 600], [600, 640], drawCurve);
const fSpecies = figure($('figSpecies'), [960, 520], [600, 560], drawSpecies);
crowdReset();
let last;
function frame(now) {
  const dt = Math.min(0.1, (now - (last ?? now)) / 1000);
  last = now;
  if (playing) {
    const was = cell.mode;
    cell.advance(cell.time + dt * simPerWall(), 10);
    crowdStep();
    wire += (70 * dt * cell.I) / (C() * C1); // electrons, right to left round the wire while charging
    if (was !== cell.mode) dirty = true;
    raceStep(dt);
  }
  showBar();
  for (const f of figs) if (f.visible) { span(f); f.draw(f); }
  drawLanes();
  requestAnimationFrame(frame);
}
document.fonts.ready.then(() => { for (const f of figs) fit(f); requestAnimationFrame(frame); });
