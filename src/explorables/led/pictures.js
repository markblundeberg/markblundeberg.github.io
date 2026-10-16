// The pictures of the LEDs (model.js), for the page and its film. Each draws into a figure's
// context in its own virtual units (f.VW × f.VH), from a state:
//   st.VB       the battery's voltage
//   st.leds     each LED where it runs: { key, V, J, light, heat, through } (A/cm²)
//   st.curves   each LED's current at every voltage: { V, logJ }
//   st.inside   the LED the inside picture shows: as st.leds, plus { walls, profile }

import { LEDS, CHIP, VT, HC, photonEnergy, spectrum } from './model.js';

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
const fmt = (x, d = 1) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('-', '−');
const Q = 1.602176634e-19;
export const lightColour = (key) => COL[key];
const nameOf = (key) => LEDS.find((l) => l.key === key);
// numbers like 3 × 10¹⁶
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export function sci(x, d = 0) {
  if (!(x > 0)) return '0';
  const e = Math.floor(Math.log10(x)), m = x / 10 ** e;
  const sup = String(Math.abs(e)).split('').map((c) => SUP[+c]).join('');
  return `${m.toFixed(d)} × 10${e < 0 ? '⁻' : ''}${sup}`;
}
// an LED's current in milliamps, its light in photons per second
const mA = (J) => J * CHIP * 1e3;
const photons = (light) => (light * CHIP) / Q;
function current(J) {
  const m = mA(J);
  return m >= 1 ? `${fmt(m, m < 10 ? 1 : 0)} mA` : m >= 1e-3 ? `${fmt(m * 1e3, 0)} µA` : m >= 1e-6 ? `${fmt(m * 1e6, 0)} nA` : 'nothing';
}

// ---------- picture 1: three LEDs on one battery ----------

// The light leaving each LED as dots: one per fixed number of photons, at most DOTS a second (at
// 20 mA of light), in real time. A deterministic stream, as on the solar panels' wires.
const DOTS = 16, PER = (0.02 / Q) / DOTS; // photons per dot
export function stepPhotons(st, dt) {
  st.photons ??= [];
  st.acc ??= LEDS.map((_, i) => i / 3);
  const events = [];
  st.leds?.forEach((l, i) => {
    st.acc[i] += (photons(l.light) / PER) * dt;
    for (; st.acc[i] >= 1; st.acc[i]--) {
      st.seed = ((st.seed ?? 11) * 16807) % 2147483647;
      st.photons.push({ i, t: 0, a: -Math.PI / 2 + (st.seed / 2147483647 - 0.5) * 2.2 });
      events.push({ i });
    }
  });
  for (const p of st.photons) p.t += dt;
  st.photons = st.photons.filter((p) => p.t < 1.4);
  return events;
}

// The glow's strength: nothing below a microamp's worth of light, full at 20 mA's (four decades,
// about as our eyes judge brightness, by ratios).
const glow = (light) => clamp((Math.log10(Math.max(1e-30, mA(light))) + 3) / 4.3, 0, 1);

function drawLED(ctx, x, y, s, key, light) {
  const g = glow(light), col = COL[key];
  // the glow
  if (g > 0) {
    const R = s * (1.2 + 2.2 * g), grad = ctx.createRadialGradient(x, y - s * 0.55, 0, x, y - s * 0.55, R);
    grad.addColorStop(0, col);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.85 * g;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y - s * 0.55, R, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // the legs
  ctx.strokeStyle = COL.frame;
  ctx.lineWidth = s * 0.06;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.22, y + s * 0.1);
  ctx.lineTo(x - s * 0.22, y + s * 0.9);
  ctx.moveTo(x + s * 0.22, y + s * 0.1);
  ctx.lineTo(x + s * 0.22, y + s * 0.75);
  ctx.stroke();
  // the dome, tinted by its colour, lit by its glow
  ctx.beginPath();
  ctx.moveTo(x - s * 0.42, y + s * 0.1);
  ctx.lineTo(x - s * 0.42, y - s * 0.55);
  ctx.arc(x, y - s * 0.55, s * 0.42, Math.PI, 0);
  ctx.lineTo(x + s * 0.42, y + s * 0.1);
  ctx.closePath();
  ctx.fillStyle = COL.surface;
  ctx.fill();
  ctx.globalAlpha = 0.25 + 0.75 * g;
  ctx.fillStyle = col;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // the rim
  ctx.fillStyle = col;
  ctx.fillRect(x - s * 0.5, y + s * 0.06, s, s * 0.1);
  // the chip, a dark speck in the dome
  ctx.fillStyle = COL.ink;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(x - s * 0.06, y - s * 0.12, s * 0.12, s * 0.1);
  ctx.globalAlpha = 1;
}

export function ledsLayout(VW, VH) {
  const narrow = VW < 800;
  return narrow ? { narrow, top: 30, ledY: 200, s: 62, chart: { x0: 70, x1: VW - 18, y0: 430, y1: VH - 56 } } : { narrow, top: 30, ledY: 210, s: 70, chart: { x0: 92, x1: VW - 30, y0: 380, y1: VH - 48 } };
}

export function drawLeds(f, st, { clear = true, noChart = false } = {}) {
  const { ctx, VW, VH } = f, L = ledsLayout(VW, VH), { narrow } = L;
  TS = narrow ? 1.38 : 1;
  if (clear) ctx.clearRect(0, 0, VW, VH);
  if (!st.leds) return;
  const xs = LEDS.map((_, i) => VW * (narrow ? [0.2, 0.5, 0.8][i] : [0.3, 0.55, 0.8][i]));
  // the battery
  if (!narrow) {
    const bx = 80, by = L.ledY - 60;
    ctx.fillStyle = COL.frame;
    ctx.fillRect(bx - 20, by, 40, 80);
    ctx.fillRect(bx - 8, by - 8, 16, 8);
    text(ctx, `${fmt(st.VB, 2)} V`, bx, by + 116, { size: 30, weight: 800, family: 'display', color: COL.ink, align: 'center' });
    text(ctx, 'battery', bx, by + 134, { size: 11, color: COL.muted, align: 'center' });
    text(ctx, 'each LED through 50 Ω', bx, by + 150, { size: 10.5, color: COL.muted, align: 'center' });
  } else text(ctx, `battery ${fmt(st.VB, 2)} V · each LED through ${50} Ω`, VW / 2, 18, { size: 11, color: COL.muted, align: 'center' });
  // the photons in flight
  for (const p of st.photons ?? []) {
    const i = p.i, x = xs[i], y = L.ledY - L.s * 0.55, r = L.s * 0.45 + p.t * (narrow ? 70 : 85);
    ctx.globalAlpha = clamp(1.6 * (1.4 - p.t), 0, 1);
    ctx.fillStyle = COL[LEDS[i].key];
    ctx.beginPath();
    ctx.arc(x + r * Math.cos(p.a), y + r * Math.sin(p.a), narrow ? 3.4 : 3.8, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  st.leds.forEach((l, i) => {
    const x = xs[i], spec = nameOf(l.key), col = COL[l.key];
    drawLED(ctx, x, L.ledY, L.s, l.key, l.light);
    const y = L.ledY + L.s + 30;
    text(ctx, spec.name, x, y, { size: narrow ? 24 : 28, weight: 800, family: 'display', color: col, align: 'center' });
    text(ctx, l.key === 'ir' ? (narrow ? '863 nm · unseen' : 'GaAs · 863 nm, unseen') : `${spec.nm.toFixed(0)} nm`, x, y + 18, { size: 11, color: COL.muted, align: 'center' });
    text(ctx, `${fmt(l.V, 2)} V`, x, y + 42, { size: narrow ? 13 : 14, weight: 600, color: COL.ink, align: 'center' });
    text(ctx, current(l.J), x, y + 60, { size: 11, color: COL['ink-2'], align: 'center' });
  });
  if (!noChart) drawIV(ctx, st, L.chart, narrow);
}

// Each LED's current at every voltage across it (log scale), the dot where it runs, and its gap.
export function drawCurves(f, st) {
  const { ctx, VW, VH } = f, narrow = VW < 800;
  TS = narrow ? 1.38 : 1.35;
  ctx.clearRect(0, 0, VW, VH);
  drawIV(ctx, st, narrow ? { x0: 78, x1: VW - 18, y0: 34, y1: VH - 64 } : { x0: 120, x1: VW - 30, y0: 40, y1: VH - 64 }, narrow);
}
function drawIV(ctx, st, c, narrow) {
  if (!st.curves || !st.leds) return;
  const VMAX = 3, LO = -6, HI = 2; // log₁₀ mA
  const X = (v) => c.x0 + ((c.x1 - c.x0) * v) / VMAX, Y = (lg) => c.y1 - ((c.y1 - c.y0) * (lg - LO)) / (HI - LO);
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;
  for (let lg = LO; lg <= HI; lg += 2) {
    ctx.beginPath();
    ctx.moveTo(c.x0, Y(lg));
    ctx.lineTo(c.x1, Y(lg));
    ctx.stroke();
    text(ctx, lg >= 0 ? `${10 ** lg} mA` : lg >= -3 ? `${10 ** (lg + 3)} µA` : `${10 ** (lg + 6)} nA`, c.x0 - 8, Y(lg) + 5, { size: 10.5, color: COL.muted, align: 'right' });
  }
  for (let v = 0; v <= VMAX; v += narrow ? 1 : 0.5) text(ctx, `${v}`, X(v), c.y1 + 20, { size: 10.5, color: COL.muted, align: 'center' });
  text(ctx, 'volts across the LED', c.x1, c.y1 + 44, { size: 11, color: COL.muted, align: 'right' });
  text(ctx, 'current through it', c.x0, c.y0 - 14, { size: 11, color: COL.muted });
  ctx.save();
  ctx.beginPath();
  ctx.rect(c.x0, c.y0 - 4, c.x1 - c.x0, c.y1 - c.y0 + 8);
  ctx.clip();
  st.curves.forEach((cv, i) => {
    const key = LEDS[i].key;
    ctx.strokeStyle = COL[key];
    ctx.lineWidth = 2;
    ctx.beginPath();
    cv.V.forEach((v, k) => (k ? ctx.lineTo : ctx.moveTo).call(ctx, X(v), Y(cv.logJ[k] + Math.log10(CHIP * 1e3))));
    ctx.stroke();
  });
  ctx.restore();
  st.leds.forEach((l, i) => {
    const key = l.key, Eg = nameOf(key).Eg;
    // the gap, as a tick on the voltage axis
    ctx.strokeStyle = COL[key];
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(X(Eg), c.y1);
    ctx.lineTo(X(Eg), c.y0);
    ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, narrow ? `${Eg.toFixed(2)}` : `gap ${Eg.toFixed(2)} eV`, X(Eg) + 4, c.y1 - 10, { size: 10.5, color: COL[key] });
    const lg = Math.log10(Math.max(1e-30, mA(l.J)));
    if (lg > LO) {
      ctx.fillStyle = COL[key];
      ctx.beginPath();
      ctx.arc(X(l.V), Y(Math.min(HI, lg)), 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = COL.surface;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}

// ---------- picture 2: inside an LED ----------

// The electrons that have crossed into the light-making side, as dots, a fixed number of
// electrons each: they arrive at the rate the current brings them, live as long as the
// simulation's electrons do there (its count of them over the rate they're lost), and end as the
// simulation's do, in light, heat, or on through to the far contact, in its proportions and where
// it says. Slowed down SLOW times; between, each wanders over where the simulation has its
// electrons, faster than the eye can follow, so drawn smoothed.
export const SLOW = 3e8, PERDOT = 1.2e8; // electrons per dot
const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
function sampler(x, w) {
  const cum = [0];
  for (let g = 1; g < x.length; g++) cum.push(cum[g - 1] + 0.5 * (w[g] + w[g - 1]) * (x[g] - x[g - 1]));
  const T = cum.at(-1);
  return { total: T, pick: () => {
    const u = Math.random() * T;
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (cum[m] < u) lo = m;
      else hi = m;
    }
    return x[lo] + (x[hi] - x[lo]) * Math.random();
  } };
}
// the electrons on the light-making side: past the n layer (region 0)
function prepare(inside) {
  const P = inside.profile, keep = (a) => a.map((v, g) => (P.region[g] >= 1 ? v : 0));
  const n = sampler(P.x, keep(P.n)), light = sampler(P.x, keep(P.light)), heat = sampler(P.x, keep(P.heat));
  const N = n.total * 1e2 * CHIP; // electrons there (n per cm³ × m → per cm², × chip)
  const lost = (inside.J * CHIP) / Q; // electrons ending each second (all of the current)
  const edge = P.x[P.region.indexOf(1)];
  return { n, light, heat, N, tau: N / lost, edge, W: P.x.at(-1), share: [inside.light / inside.J, inside.heat / inside.J] };
}
export function stepInside(st, dt, now) {
  const I = st.inside;
  if (!I) return [];
  const box = (st.box ??= { dots: [], flashes: [], acc: 0 });
  if (box.of !== I) {
    box.of = I;
    box.p = prepare(I);
    // a jump to a new state: as many dots as it holds, placed where its electrons are
    const want = box.p.N / PERDOT;
    while (box.dots.length > want + 0.5) box.dots.splice(Math.floor(Math.random() * box.dots.length), 1);
    for (const d of box.dots) d.target = box.p.n.pick();
    if (box.dots.length < want - 0.5 && box.dots.length < 400) for (let k = Math.round(want - box.dots.length); k > 0 && box.dots.length < 400; k--) box.dots.push(newDot(box.p, box.p.n.pick()));
  }
  const p = box.p, events = [];
  if (!(p.tau > 0) || !(p.N > 0)) return events;
  const life = p.tau * SLOW; // seconds on screen
  box.acc += (p.N / PERDOT / life) * dt;
  for (; box.acc >= 1; box.acc--) if (box.dots.length < 400) box.dots.push(newDot(p, p.edge, true));
  const keep = [];
  for (const d of box.dots) {
    if (Math.random() < dt / life) {
      const u = Math.random(), kind = u < p.share[0] ? 'light' : u < p.share[0] + p.share[1] ? 'heat' : 'through';
      const x = kind === 'light' ? p.light.pick() : kind === 'heat' ? p.heat.pick() : p.W;
      box.flashes.push({ kind, x, t: now, e: d.e });
      events.push({ kind });
      continue;
    }
    // wander: a new spot every so often, eased toward; the energy above the band's floor jiggles
    if (Math.random() < dt / 0.35) d.target = p.n.pick();
    d.x += (d.target - d.x) * Math.min(1, dt * 6);
    if (Math.random() < dt / 0.25) d.e = -Math.log(1 - Math.random());
    keep.push(d);
  }
  box.dots = keep;
  box.flashes = box.flashes.filter((fl) => now - fl.t < 1);
  return events;
}
const newDot = (p, x, fresh = false) => ({ x, target: p.n.pick(), e: -Math.log(1 - Math.random()), fresh });

export function drawInside(f, st, now, { clear = true, ts } = {}) {
  const { ctx, VW, VH } = f, narrow = VW < 800, I = st.inside;
  TS = ts ?? (narrow ? 1.38 : 1.3);
  if (clear) ctx.clearRect(0, 0, VW, VH);
  if (!I) return;
  const P = I.profile, key = I.key, col = COL[key], box = st.box;
  const x0 = narrow ? 18 : 40, x1 = VW - (narrow ? 18 : 40), top = narrow ? 104 : 30 + 30 * TS, bot = VH - (narrow ? 60 : 26 + 30 * TS);
  const W = P.x.at(-1), X = (x) => x0 + ((x1 - x0) * x) / W;
  // energy scale: the bands' range, plus room
  const hi = Math.max(...P.Ec) + 0.25, lo = Math.min(...P.Ev) - 0.25, Y = (E) => top + ((bot - top) * (hi - E)) / (hi - lo), px = (bot - top) / (hi - lo); // px per eV
  // layers: shaded by crystal
  const runs = [];
  P.region.forEach((r, g) => (runs.at(-1)?.r === r ? (runs.at(-1).b = g) : runs.push({ r, a: g, b: g })));
  const walled = I.walls;
  runs.forEach(({ r, a, b }) => {
    const wall = walled && r !== 1;
    ctx.fillStyle = wall ? COL['line'] : COL.bg;
    ctx.globalAlpha = wall ? 0.35 : 0.5;
    ctx.fillRect(X(P.x[a]), top - 30, X(P.x[b]) - X(P.x[a]), bot - top + 50);
    ctx.globalAlpha = 1;
    const label = walled ? ['n side', narrow ? 'light-making layer' : 'the light-making layer', 'p side'][r] : ['n side', 'p side'][r];
    const sub = walled ? [`wider gap`, key === 'ir' ? 'GaAs' : `${nameOf(key).name} LED’s gap`, 'wider gap'][r] : '';
    const cx = (X(P.x[a]) + X(P.x[b])) / 2, mid = walled && r === 1;
    // on a phone the middle layer's label goes above the others
    text(ctx, label, cx, top - (narrow && mid ? 62 : 8 + 24 * TS), { size: 11, color: mid ? COL.ink : COL.muted, align: 'center' });
    if (sub && (!narrow || mid)) text(ctx, sub, cx, top - (narrow ? 46 : 8 + 10 * TS), { size: 10.5, color: COL.muted, align: 'center' });
  });
  // the seas: electrons above the n side's band floor, holes below the valence top, shaded by how
  // many there are (per cm³, 10¹⁵ faint to 10¹⁸ full)
  const shade = (c) => clamp((Math.log10(Math.max(1, c)) - 15) / 3, 0, 1);
  for (let g = 1; g < P.x.length; g++) {
    const xa = X(P.x[g - 1]), xb = X(P.x[g]);
    const se = shade(P.n[g]) * (P.region[g] === 0 ? 1 : 0), sh = shade(P.p[g]);
    if (se > 0) {
      ctx.globalAlpha = 0.5 * se;
      ctx.fillStyle = COL.e;
      ctx.fillRect(xa, Y(P.Ec[g]) - 3 * VT * px, xb - xa + 0.5, 3 * VT * px);
    }
    if (sh > 0) {
      ctx.globalAlpha = 0.5 * sh;
      ctx.fillStyle = COL.h;
      ctx.fillRect(xa, Y(P.Ev[g]), xb - xa + 0.5, 3 * VT * px);
    }
  }
  ctx.globalAlpha = 1;
  // the bands
  const line = (arr, color, w = 2.2, dash = []) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.setLineDash(dash);
    ctx.beginPath();
    arr.forEach((E, g) => (g ? ctx.lineTo : ctx.moveTo).call(ctx, X(P.x[g]), Y(E)));
    ctx.stroke();
    ctx.setLineDash([]);
  };
  line(P.Ec, COL.ink, 2);
  line(P.Ev, COL.ink, 2);
  line(P.Efn, COL.e, 1.6, [6, 5]);
  line(P.Efp, COL.h, 1.6, [6, 5]);
  // the flashes: a meeting that gives off light (a drop across the gap, and the photon leaving), one
  // that gives heat (the crystal shaken), and an electron reaching the far contact
  const at = (x) => {
    const g = Math.max(1, P.x.findIndex((v) => v >= x));
    return g;
  };
  // (the photons fade before they reach the labels)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top - 16, VW, VH);
  ctx.clip();
  for (const fl of box?.flashes ?? []) {
    const age = now - fl.t, g = at(fl.x), xx = X(fl.x);
    if (fl.kind === 'light') {
      const yTop = Y(P.Ec[g]) - fl.e * VT * px, yBot = Y(P.Ev[g]);
      ctx.globalAlpha = clamp(1 - age * 2.5, 0, 1);
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(xx, yTop);
      ctx.lineTo(xx, yBot);
      ctx.stroke();
      // the photon: a short wave, flying up and out
      ctx.globalAlpha = clamp(1 - age, 0, 1);
      const yc = (yTop + yBot) / 2 - age * (bot - top) * 0.7, xc = xx + age * 24;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let k = 0; k <= 24; k++) {
        const u = k / 24, ww = narrow ? 30 : 40;
        ctx.lineTo(xc - ww / 2 + ww * u, yc + 5 * Math.sin(u * 4 * Math.PI) * Math.sin(u * Math.PI));
      }
      ctx.stroke();
    } else if (fl.kind === 'heat') {
      ctx.globalAlpha = clamp(1 - age, 0, 1);
      ctx.strokeStyle = COL.heat;
      ctx.lineWidth = 1.6;
      const yc = (Y(P.Ec[g]) + Y(P.Ev[g])) / 2;
      for (const r of [6, 12]) {
        ctx.beginPath();
        ctx.arc(xx, yc, r + 14 * age, 0, 2 * Math.PI);
        ctx.stroke();
      }
    } else {
      ctx.globalAlpha = clamp(1 - age, 0, 1);
      ctx.fillStyle = COL.e;
      ctx.beginPath();
      ctx.arc(x1, Y(P.Ec.at(-1)) - 6, 4 + 10 * age, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  // the electrons, just above the band's floor: most within kT of it, drawn to scale
  ctx.fillStyle = COL.e;
  for (const d of box?.dots ?? []) {
    const g = at(d.x);
    ctx.beginPath();
    ctx.arc(X(d.x), Y(P.Ec[g]) - (d.e * VT + 0.004) * px - 3, narrow ? 3.2 : 3.6, 0, 2 * Math.PI);
    ctx.fill();
  }
  // the split and the gap, read in the middle of the light-making layer (or the p side)
  const g1 = P.region.indexOf(1), g2 = P.region.lastIndexOf(1), gm = walled ? Math.round((g1 + g2) / 2) : g1 + Math.round((g2 - g1) * 0.06);
  const bx = walled ? X(P.x[g2]) + (narrow ? 10 : 16) : X(P.x[gm]) + 24, gap = P.Ec[gm] - P.Ev[gm], split = P.Efn[gm] - P.Efp[gm];
  // the gap's label near its top, the split's near its bottom; on a phone the split's bracket is at
  // the right edge, labelled to its left
  const bracket = (xb, ya, yb, color, label, sub, { atTop, left = false }) => {
    const t = left ? -1 : 1;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(xb, ya + 6);
    ctx.lineTo(xb, yb - 6);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const [y, d] of [[ya, 1], [yb, -1]]) {
      ctx.beginPath();
      ctx.moveTo(xb, y);
      ctx.lineTo(xb - 4, y + 8 * d);
      ctx.lineTo(xb + 4, y + 8 * d);
      ctx.closePath();
      ctx.fill();
    }
    const y = atTop ? ya + (narrow ? 44 : 6 + 13 * TS) : yb - 6 - 16 * TS, align = left ? 'right' : 'left';
    text(ctx, label, xb + 7 * t, y, { size: narrow ? 12 : 13, weight: 600, color, align });
    text(ctx, sub, xb + 7 * t, y + 13 * TS, { size: 10.5, color: COL.muted, align });
  };
  bracket(bx, Y(P.Ec[gm]), Y(P.Ev[gm]), col, `gap ${gap.toFixed(2)} eV`, narrow ? 'each photon' : 'each photon, just over', { atTop: true });
  const edge = narrow || TS > 1.5; // big text: the split's bracket at the right edge, labelled to its left
  bracket(edge ? x1 - 4 : bx + 150, Y(P.Efn[gm]), Y(P.Efp[gm]), COL.ink, `split ${split.toFixed(2)} V`, 'the voltage', { atTop: false, left: edge });
  // the legend
  const ly = VH - (narrow ? 36 : 4 + 26 * TS);
  // a legend in runs of colour
  const runsOf = (parts, x, y) => {
    for (const [s, c] of parts) {
      text(ctx, s, x, y, { size: 10.5, color: c });
      font(ctx, 10.5);
      x += ctx.measureText(s).width;
    }
  };
  const slow = `slowed ${SLOW / 1e6} million times`;
  if (narrow) {
    runsOf([['— bands  ', COL.muted], ['- - electrons’', COL.e], [' and ', COL.muted], ['holes’', COL.h], [' levels', COL.muted]], x0, ly);
    runsOf([['● electrons', COL.e], ['  ▬ holes', COL.h], [` · ${SLOW / 1e6} million× slower`, COL.muted]], x0, ly + 18);
  } else {
    runsOf([['solid: the bands · dashed: the ', COL.muted], ['electrons’', COL.e], [' and ', COL.muted], ['holes’', COL.h], [' levels', COL.muted]], x0, ly);
    runsOf([['● electrons', COL.e], [`, ${sci(PERDOT, 1)} each · `, COL.muted], ['shading: holes', COL.h], [TS > 1.5 ? '' : ` · ${slow}`, COL.muted]], x0, ly + 15 * TS);
  }
  // energy arrow
  if (!narrow) {
    ctx.strokeStyle = COL.muted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(14, bot);
    ctx.lineTo(14, top);
    ctx.lineTo(10, top + 7);
    ctx.moveTo(14, top);
    ctx.lineTo(18, top + 7);
    ctx.stroke();
    ctx.save();
    ctx.translate(26, (top + bot) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'energy of an electron', 0, 0, { size: 10.5, color: COL.muted, align: 'center' });
    ctx.restore();
  }
}

// ---------- picture 3: one colour each ----------

export function drawColour(f) {
  const { ctx, VW, VH } = f, narrow = VW < 800;
  TS = narrow ? 1.38 : 1;
  ctx.clearRect(0, 0, VW, VH);
  const x0 = narrow ? 18 : 40, x1 = VW - (narrow ? 18 : 40), y0 = narrow ? 84 : 34, y1 = VH - (narrow ? 70 : 60);
  const NM0 = 380, NM1 = 920, X = (nm) => x0 + ((x1 - x0) * (nm - NM0)) / (NM1 - NM0);
  // the colours we see, as a strip
  const strip = ctx.createLinearGradient(X(380), 0, X(750), 0);
  const stops = [[380, '#4b0082'], [440, '#2a3cff'], [490, '#00b3ff'], [520, '#1fd655'], [570, '#e5e500'], [600, '#ff9a00'], [650, '#ff2a1a'], [700, '#a30000'], [750, '#2a0000']];
  for (const [nm, c] of stops) strip.addColorStop((nm - 380) / 370, c);
  ctx.fillStyle = strip;
  ctx.fillRect(X(380), y1 + 8, X(750) - X(380), 10);
  ctx.fillStyle = COL.line;
  ctx.fillRect(X(750), y1 + 8, X(NM1) - X(750), 10);
  text(ctx, 'what eyes see', (X(380) + X(750)) / 2, y1 + 36, { size: 10.5, color: COL.muted, align: 'center' });
  text(ctx, 'infrared', (X(750) + X(NM1)) / 2, y1 + 36, { size: 10.5, color: COL.muted, align: 'center' });
  for (const nm of narrow ? [400, 600, 800] : [400, 500, 600, 700, 800, 900]) text(ctx, `${nm} nm`, X(nm), y1 + 54, { size: 10.5, color: COL.muted, align: 'center' });
  // each LED's light: photons per wavelength, scaled to one height
  for (const l of LEDS) {
    const pts = [];
    for (let nm = NM0; nm <= NM1; nm += 0.5) pts.push([nm, spectrum(l.Eg, HC / nm) * (HC / nm) ** 2]);
    const top = Math.max(...pts.map((p) => p[1]));
    ctx.fillStyle = COL[l.key];
    ctx.strokeStyle = COL[l.key];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X(NM0), y1);
    for (const [nm, v] of pts) ctx.lineTo(X(nm), y1 - ((y1 - y0 - 20) * v) / top);
    ctx.lineTo(X(NM1), y1);
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
    const peak = pts.reduce((a, b) => (b[1] > a[1] ? b : a)), i = LEDS.indexOf(l);
    // on a phone, the labels step down so they don't meet, and the last keeps inside the edge
    if (narrow) text(ctx, `${l.name}, ${l.nm.toFixed(0)} nm`, i === 0 ? x1 : X(peak[0]) + 6, 24 + 18 * i, { size: 11, weight: 600, color: COL[l.key], align: i === 0 ? 'right' : 'left' });
    else text(ctx, `${l.name}, ${l.nm.toFixed(0)} nm`, X(peak[0]), y0 + 4, { size: 12, weight: 600, color: COL[l.key], align: 'center' });
  }
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y1);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}
