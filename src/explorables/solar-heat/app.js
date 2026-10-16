// The page: two live panels (model.js, solved in worker.js), the bar that sets their temperatures,
// the sun and their voltage, and the pictures of them (pictures.js). Every picture is a canvas
// drawn in its own virtual units and scaled to fit.

import { KELVIN } from './model.js';
import { COL, stepDots, drawPanels, drawHill, drawShare } from './pictures.js';

const $ = (id) => document.getElementById(id);
const figs = [];

// ---------- colours, from the page's CSS (both themes) ----------
const TOKENS = ['bg', 'surface', 'line', 'line-2', 'ink', 'ink-2', 'muted', 'sun', 'e', 'h', 'cool', 'hot', 'leak', 'cell', 'cell-line', 'frame'];
function readColours() {
  const cs = getComputedStyle(document.documentElement);
  for (const k of TOKENS) COL[k] = cs.getPropertyValue(`--${k}`).trim();
}
readColours();
const themeBtn = $('theme');
function setTheme(t) {
  if (t) document.documentElement.dataset.theme = t;
  const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark');
  themeBtn.textContent = dark ? '☀ day' : '☾ night';
  readColours();
  for (const f of figs) f.dirty = true;
}
try { setTheme(localStorage.getItem('li-theme')); } catch { setTheme(); }
themeBtn.addEventListener('click', () => {
  const next = getComputedStyle(document.documentElement).colorScheme.includes('dark') ? 'light' : 'dark';
  try { localStorage.setItem('li-theme', next); } catch {}
  setTheme(next);
});
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', () => setTheme());

// ---------- canvases ----------
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
addEventListener('resize', () => { for (const f of figs) fit(f); });

// ---------- the panels, and the bar ----------
const left = $('left'), right = $('right'), sun = $('sun'), same = $('same');
// a link may set the bar: ?left=25&right=65&sun=100&same
{
  const q = new URLSearchParams(location.search);
  for (const el of [left, right, sun]) if (q.has(el.id)) el.value = q.get(el.id);
  same.checked = q.has('same');
}
const want = () => ({ T: [KELVIN + +left.value, KELVIN + +right.value], sun: +sun.value / 100, same: same.checked });
function showBar() {
  $('leftOut').textContent = `${left.value} °C`;
  $('rightOut').textContent = `${right.value} °C`;
  $('sunOut').textContent = `${sun.value}% · ${sun.value * 10} W/m²`;
}
showBar();
const st = { panels: null, same: false, sun: 1 };
// One request at a time: a change made while the worker is busy is sent when it answers.
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
let busy = false, pending = false, asked = 0;
function ask() {
  if (busy) return void (pending = true);
  busy = true;
  pending = false;
  const w = want();
  worker.postMessage({ id: ++asked, ...w });
  st.next = w;
}
worker.onmessage = ({ data }) => {
  busy = false;
  st.panels = data.panels;
  st.same = st.next.same;
  st.sun = st.next.sun;
  window.panels = st.panels; // (for the console)
  $('status').textContent = '';
  for (const f of figs) if (f.static) f.dirty = true;
  if (pending) ask();
};
worker.onerror = (e) => ($('status').textContent = `the simulation failed to load: ${e.message ?? e}`);
for (const el of [left, right, sun]) el.addEventListener('input', () => { showBar(); ask(); });
same.addEventListener('change', ask);

// ---------- run ----------
figure($('figPanels'), [960, 720], [440, 640], (f) => drawPanels(f, st));
const hillFig = figure($('figHill'), [960, 440], [440, 760], (f) => drawHill(f, st));
const shareFig = figure($('figShare'), [960, 300], [440, 560], (f) => drawShare(f, st));
hillFig.static = shareFig.static = true;
let last;
function frame(now) {
  const dt = Math.min(0.1, (now - (last ?? now)) / 1000);
  last = now;
  if (st.panels) {
    stepDots(st, dt);
    for (const f of figs) if (f.visible && (!f.static || f.dirty)) { f.draw(f); f.dirty = false; }
  }
  requestAnimationFrame(frame);
}
addEventListener('resize', () => { for (const f of figs) f.dirty = true; });
document.fonts.ready.then(() => {
  for (const f of figs) fit(f);
  $('status').textContent = 'solving the panels…';
  ask();
  requestAnimationFrame(frame);
});
