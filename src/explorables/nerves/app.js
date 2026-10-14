// The page: three live nerves (model.js) on one clock, the bar that fires and rewraps them, and the
// pictures of them (pictures.js). Every picture is a canvas drawn in its own virtual units and scaled
// to fit; they share one x mapping, so 1 cm lines up from picture to picture.

import { Nerve, KINDS, MYELIN } from './model.js';
import { COL, span, drawRace, drawWave, drawIons } from './pictures.js';

const $ = (id) => document.getElementById(id);

// ---------- colours, from the page's CSS (both themes) ----------
const TOKENS = ['anion', 'warn', 'bg', 'surface', 'line', 'line-2', 'ink', 'ink-2', 'muted', 'axon', 'outside', 'spike', 'spike-glow', 'sheath', 'sheath-line', 'bare', 'myelin', 'squid', 'na', 'k', 'cl'];
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
}
try { setTheme(localStorage.getItem('li-theme')); } catch { setTheme(); }
themeBtn.addEventListener('click', () => {
  const next = getComputedStyle(document.documentElement).colorScheme.includes('dark') ? 'light' : 'dark';
  try { localStorage.setItem('li-theme', next); } catch {}
  setTheme(next);
});
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', readColours);

// ---------- canvases ----------
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
addEventListener('resize', () => { for (const f of figs) fit(f); });

// ---------- the nerves, and the bar ----------
const wraps = $('wraps'), gap = $('gap'), loop = $('loop');
const params = () => ({ ...MYELIN, wraps: Math.round(10 ** +wraps.value), gap: +gap.value * 1e-3 });
function showBar() {
  const p = params();
  $('wrapsOut').textContent = `${p.wraps} membranes`;
  $('gapOut').textContent = `${gap.value} mm`;
}
showBar();
let nerves = null, next = null, want = false, clock = 0, rest = 0, over = false;
const PACE = 0.2e-3; // simulated seconds per second: slowed down five thousand times
const RACE = 3e-3; // the race ends when the wrapped and squid nerves are in, or at 3 ms
// Each race starts from nerves at rest: the next three settle in the background, a few
// milliseconds a frame, and fire when they're ready (a nerve just fired is still recovering).
const prepare = () => (next = Object.fromEntries(KINDS.map((k) => [k, new Nerve(k, params(), undefined, false)])));
function fire() {
  nerves = next;
  next = null;
  want = false;
  for (const k of KINDS) nerves[k].fire();
  clock = 0;
  rest = 0;
  window.nerves = nerves; // (for the console)
}
$('fire').addEventListener('click', () => (want = true));
for (const el of [wraps, gap]) el.addEventListener('input', () => { showBar(); prepare(); want = true; });

// ---------- run ----------
figure($('figRace'), [960, 420], [600, 500], (f) => drawRace(f, nerves, { pace: '5000×', over }));
figure($('figWave'), [960, 400], [600, 460], (f) => drawWave(f, nerves));
figure($('figIons'), [960, 410], [600, 440], (f) => drawIons(f, nerves.squid));
let last;
function frame(now) {
  const dt = Math.min(0.1, (now - (last ?? now)) / 1000);
  last = now;
  const done = ['myelin', 'squid'].every((k) => nerves[k].arrived !== null) || clock > RACE;
  over = done;
  if (!done && !want) {
    // one clock for all three: it waits for whichever is slowest to compute
    clock = Math.min(clock + dt * PACE, ...KINDS.map((k) => nerves[k].time + 0.3e-3));
    for (const k of KINDS) nerves[k].advance(clock, 6);
  } else {
    // held at the finish while the next three settle
    rest += dt;
    if (!next) prepare();
    const k = KINDS.find((kk) => !next[kk].ready);
    if (k) next[k].settle(10);
    else if (want || (loop.checked && rest > 2.5)) fire();
  }
  for (const f of figs) if (f.visible) { span(f); f.draw(f); }
  requestAnimationFrame(frame);
}
document.fonts.ready.then(() => {
  for (const f of figs) fit(f);
  $('status').textContent = 'settling the nerves to rest…';
  setTimeout(() => {
    prepare();
    for (const k of KINDS) next[k].settle();
    fire();
    $('status').textContent = '';
    requestAnimationFrame(frame);
  }, 30);
});
