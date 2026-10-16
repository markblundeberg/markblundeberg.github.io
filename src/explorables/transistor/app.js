// The page: a live transistor (model.js, solved in worker.js), the bar that sets its gate, and the
// pictures of it (pictures.js). Every picture is a canvas drawn in its own virtual units and scaled
// to fit.

import { COL, stepFlow, drawSwitch, drawDown, drawCurve } from './pictures.js';

const $ = (id) => document.getElementById(id);
const figs = [];

// ---------- colours, from the page's CSS (both themes) ----------
const TOKENS = ['bg', 'surface', 'line', 'line-2', 'ink', 'ink-2', 'muted', 'e', 'h', 'gate', 'ox', 'climb', 'frame'];
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
const still = matchMedia('(prefers-reduced-motion: reduce)');

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
  f.dirty = true;
}
addEventListener('resize', () => { for (const f of figs) fit(f); });

// ---------- the gate ----------
const vg = $('vg');
{
  const q = new URLSearchParams(location.search);
  if (q.has('vg')) vg.value = q.get('vg');
}
const showBar = () => ($('vgOut').textContent = `${(+vg.value).toFixed(2).replace('-', '−')} V`);
showBar();
const st = {};
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
let busy = false, pending = false, asked = 0;
function ask() {
  if (busy) return void (pending = true);
  busy = true;
  pending = false;
  worker.postMessage({ id: ++asked, V: +vg.value });
}
worker.onmessage = ({ data }) => {
  busy = false;
  st.sweep = data.sweep;
  st.here = data.here;
  st.V = data.here.V;
  window.slice = data; // (for the console)
  $('status').textContent = '';
  for (const f of figs) f.dirty = true;
  if (pending) ask();
};
worker.onerror = (e) => ($('status').textContent = `the simulation failed to load: ${e.message ?? e}`);
vg.addEventListener('input', () => { showBar(); ask(); });

// ---------- run ----------
figure($('figSwitch'), [960, 380], [440, 470], (f) => drawSwitch(f, st));
const down = figure($('figDown'), [960, 460], [440, 600], (f) => drawDown(f, st));
const curve = figure($('figCurve'), [960, 420], [440, 520], (f) => drawCurve(f, st));
down.static = curve.static = true;
let last;
function frame(now) {
  const dt = Math.min(0.1, (now - (last ?? now)) / 1000);
  last = now;
  if (st.here) {
    if (!still.matches) stepFlow(st, dt);
    for (const f of figs) if (f.visible && (f.dirty || (!f.static && !still.matches))) { f.draw(f); f.dirty = false; }
  }
  requestAnimationFrame(frame);
}
document.fonts.ready.then(() => {
  for (const f of figs) fit(f);
  $('status').textContent = 'solving the transistor…';
  ask();
  requestAnimationFrame(frame);
});
