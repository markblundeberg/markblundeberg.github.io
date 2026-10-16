// The page: three live LEDs (model.js, solved in worker.js) on one battery, the inside of one of
// them, and the pictures of them (pictures.js). Every picture is a canvas drawn in its own virtual
// units and scaled to fit.

import { COL, stepPhotons, drawLeds, stepInside, drawInside, drawColour, drawLedger } from './pictures.js';

const $ = (id) => document.getElementById(id);
const figs = [];

// ---------- colours, from the page's CSS (both themes) ----------
const TOKENS = ['bg', 'surface', 'line', 'line-2', 'ink', 'ink-2', 'muted', 'e', 'h', 'ir', 'red', 'blue', 'heat', 'frame'];
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

// ---------- the battery, and which LED is opened up ----------
const vb = $('vb'), walls = $('walls'), picks = [...document.querySelectorAll('[data-pick]')];
const st = { pick: 'ir' };
{
  const q = new URLSearchParams(location.search);
  if (q.has('vb')) vb.value = q.get('vb');
  if (q.has('pick')) st.pick = q.get('pick');
  if (q.has('plain')) walls.checked = false;
}
const showBar = () => ($('vbOut').textContent = `${(+vb.value).toFixed(2)} V`);
showBar();
const showPick = () => picks.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pick === st.pick)));
showPick();
// One request at a time: a change made while the worker is busy is sent when it answers.
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
let busy = false, pending = false, asked = 0;
function ask() {
  if (busy) return void (pending = true);
  busy = true;
  pending = false;
  worker.postMessage({ id: ++asked, VB: +vb.value, pick: st.pick, walls: walls.checked });
}
worker.onmessage = ({ data }) => {
  busy = false;
  Object.assign(st, { VB: data.VB, leds: data.leds, curves: data.curves, inside: data.inside, ledger: data.ledger });
  window.leds = data; // (for the console)
  $('status').textContent = '';
  for (const f of figs) f.dirty = true;
  if (pending) ask();
};
worker.onerror = (e) => ($('status').textContent = `the simulation failed to load: ${e.message ?? e}`);
vb.addEventListener('input', () => { showBar(); ask(); });
walls.addEventListener('change', ask);
for (const b of picks) b.addEventListener('click', () => { st.pick = b.dataset.pick; showPick(); ask(); });

// ---------- run ----------
figure($('figLeds'), [960, 640], [440, 820], (f) => drawLeds(f, st));
figure($('figInside'), [960, 500], [440, 640], (f) => drawInside(f, st, performance.now() / 1000));
const colour = figure($('figColour'), [960, 300], [440, 420], (f) => drawColour(f));
const ledger = figure($('figLedger'), [960, 180], [440, 290], (f) => drawLedger(f, st));
colour.static = ledger.static = true;
let last;
function frame(now) {
  const dt = Math.min(0.1, (now - (last ?? now)) / 1000);
  last = now;
  if (st.leds) {
    if (!still.matches) {
      stepPhotons(st, dt);
      stepInside(st, dt, now / 1000);
    } else if (!st.box || st.box.of !== st.inside) stepInside(st, 0, now / 1000);
    for (const f of figs) if (f.visible && (!f.static || f.dirty) && (!still.matches || f.dirty || !f.static)) { f.draw(f); f.dirty = false; }
  }
  requestAnimationFrame(frame);
}
document.fonts.ready.then(() => {
  for (const f of figs) fit(f);
  $('status').textContent = 'solving the LEDs…';
  ask();
  requestAnimationFrame(frame);
});
