// The page: one live battery (model.js), the bar that drives it, and four pictures of it, plus a
// race between two chargers. Every picture is a canvas drawn in its own virtual units and scaled
// to fit; the spatial ones share one x mapping, so the graphite lines up from picture to picture.

import { Cell, C1 } from './model.js';
import { COL, span, createCrowd, crowdStep, drawCrowd, drawShelves, drawCurve, drawSpecies } from './pictures.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const figs = [];
const touch = () => { for (const f of figs) f.dirty = true; };
// Reduced motion: the time-lapse starts paused (Play runs it), and a race is run out of sight and
// shown when it's over; each figure is drawn when what it shows changes.
const still = matchMedia('(prefers-reduced-motion: reduce)');
still.addEventListener?.('change', touch);

// ---------- colours, from the page's CSS (both themes) ----------
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
  touch();
}
try { setTheme(localStorage.getItem('li-theme')); } catch { setTheme(); }
themeBtn.addEventListener('click', () => {
  const next = getComputedStyle(document.documentElement).colorScheme.includes('dark') ? 'light' : 'dark';
  try { localStorage.setItem('li-theme', next); } catch {}
  setTheme(next);
});
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', () => setTheme());
// ---------- canvases ----------
// Each figure draws on a virtual page, VW × VH, scaled to the canvas's width; a narrow screen
// gets a narrower page (so larger type and dots).
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
  f.dirty = true;
}
addEventListener('resize', () => { for (const f of figs) fit(f); });
// ---------- the battery, and the bar ----------
let cell = new Cell();
const rate = $('rate'), watch = $('watch');
const C = () => 10 ** +rate.value;
const fmtTime = (min) => (min >= 90 ? `${(min / 60).toFixed(min >= 600 ? 0 : 1)} h` : `${Math.round(min)} min`);
const fmtC = (c) => (c < 1 ? c.toFixed(2) : c < 10 ? c.toFixed(1) : c.toFixed(0)).replace(/\.0$/, '');
cell.rate = C();
cell.setMode('charge');
let playing = !still.matches;
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
for (const b of document.querySelectorAll('.modes button')) b.addEventListener('click', () => { cell.setMode(b.dataset.mode); touch(); });
rate.addEventListener('input', () => { cell.setRate(C()); showBar(); touch(); });
watch.addEventListener('change', () => { cell.watch = watch.checked; if (cell.mode === 'charge' && !cell.cv) cell.setI(cell.rate * C1); touch(); });
$('more').addEventListener('click', () => { const open = $('bar').classList.toggle('open'); $('more').textContent = open ? 'Less' : 'More'; $('more').setAttribute('aria-expanded', open); });
const showPlay = () => ($('play').textContent = playing ? 'Pause' : 'Play');
showPlay();
$('play').addEventListener('click', () => { playing = !playing; showPlay(); touch(); });
$('empty').addEventListener('click', () => {
  const mode = cell.mode === 'rest' ? 'charge' : cell.mode;
  cell = new Cell();
  cell.rate = C();
  cell.watch = watch.checked;
  cell.setMode(mode === 'use' ? 'rest' : mode);
  crowd = createCrowd(cell);
  touch();
});
// Time-lapse: a full charge (or discharge) at the speed in the bar takes about fifteen seconds.
const simPerWall = () => 3600 / C() / 15;

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
  if (still.matches) {
    // the animation's 60-a-second steps, as many as fit in 40 ms, undrawn
    const t0 = performance.now();
    while (racing && performance.now() - t0 < 40) raceTick(1 / 60);
  } else raceTick(dtWall);
}
function raceTick(dtWall) {
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
let crowd = createCrowd(cell);
figure($('figCrowd'), [960, 440], [600, 440], (f) => drawCrowd(f, cell, crowd));
figure($('figShelves'), [960, 520], [600, 560], (f) => drawShelves(f, cell));
figure($('figCurve'), [960, 600], [600, 640], (f) => drawCurve(f, cell));
figure($('figSpecies'), [960, 520], [600, 560], (f) => (drawSpecies(f, cell), showLedger(cell.state)));
let last;
function frame(now) {
  const dt = Math.min(0.1, (now - (last ?? now)) / 1000);
  last = now;
  if (playing) {
    const was = cell.mode;
    cell.advance(cell.time + dt * simPerWall(), 10);
    crowdStep(crowd, cell);
    crowd.wire += (70 * dt * cell.I) / (C() * C1); // electrons, right to left round the wire while charging
    if (was !== cell.mode) touch();
    if (!still.matches) raceStep(dt);
  }
  if (still.matches) raceStep(dt);
  showBar();
  for (const f of figs) if (f.visible && (playing || !still.matches || f.dirty)) { span(f); f.draw(f); f.dirty = false; }
  if (!(still.matches && racing)) drawLanes();
  requestAnimationFrame(frame);
}
document.fonts.ready.then(() => { for (const f of figs) fit(f); requestAnimationFrame(frame); });