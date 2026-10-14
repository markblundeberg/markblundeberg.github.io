// The pictures of the three nerves, drawn on canvases from their solutions (model.js): shared by
// the page and by the film made from it. Each figure is { ctx, VW, VH }, a virtual page the canvas
// is scaled to; the pictures share one x mapping, so 1 cm sits at the same place in each.

import { L, KINDS, NODE, G, D, DA, VT, OUT, z } from './model.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mV = 1e-3, F = 96485.332, RT = VT * F;
// The colours, filled in from the page's CSS by whoever draws (both themes).
export const COL = {};
let X0 = 40, X1 = 920, FS = 1;
export const MONO = (px, w = 400) => `${w} ${px * FS}px "Martian Mono", ui-monospace, monospace`;
export const DISPLAY = (px, w = 800) => `${w} ${px * FS}px "Big Shoulders Display", "Arial Narrow", sans-serif`;
export const px = (x) => X0 + ((X1 - X0) * x) / L;
export function span(f) {
  const narrow = f.VW < 900;
  X0 = narrow ? 30 : 40;
  X1 = f.VW - (narrow ? 30 : 40);
  FS = narrow ? 1.3 : 1;
}
export const NAMES = { bare: 'bare', myelin: 'wrapped in myelin', squid: "a squid's giant nerve" };
export const LANE = () => ({ bare: COL.bare, myelin: COL.myelin, squid: COL.squid });

// Membrane voltage at x, from a solution (the outside is held at φ = 0, so V_m is φ inside).
function vmAt(S, x) {
  const xs = S.x;
  let lo = 0, hi = xs.length - 1;
  if (x <= xs[0]) return S.phi[0];
  if (x >= xs[hi]) return S.phi[hi];
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (xs[m] <= x) lo = m; else hi = m; }
  const u = xs[hi] > xs[lo] ? (x - xs[lo]) / (xs[hi] - xs[lo]) : 0;
  return S.phi[lo] + u * (S.phi[hi] - S.phi[lo]);
}
// rest (about −65 mV) dark, the spike's peak (about +40) bright
const heat = (v) => clamp((v + 62 * mV) / (100 * mV), 0, 1);
function mix(a, b, u) {
  const p = (c) => (c.startsWith('#') ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) : c.match(/\d+/g).slice(0, 3).map(Number));
  const [A, B] = [p(a), p(b)];
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',')})`;
}

// ---------- picture 1: the race ----------
// Three nerves, each 2 cm, fired together at their left ends; each glows where it's firing.
export function drawRace(f, nerves, opts = {}) {
  const { ctx, VW, VH } = f, narrow = VW < 900;
  ctx.clearRect(0, 0, VW, VH);
  // (a film may lay it out bigger: opts.lanes, and the thin and squid nerves' drawn widths)
  const t = nerves.bare.time, lanes = opts.lanes ?? (narrow ? [138, 278, 428] : [112, 228, 354]);
  // the clock
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.font = MONO(14, 600);
  ctx.fillStyle = COL.ink;
  ctx.fillText(nerves.bare.fired === null ? 'ready' : `${(1000 * t).toFixed(2)} ms after firing`, X0, 30);
  ctx.textAlign = 'right';
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  if (opts.pace) ctx.fillText(`slowed down ${opts.pace}`, X1, 30);
  // the finish
  ctx.strokeStyle = COL['line-2'];
  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(px(L), 48); ctx.lineTo(px(L), VH - 30); ctx.stroke();
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  ctx.fillText('2 cm', px(L), VH - 12);
  ctx.fillText('0', px(0), VH - 12);
  KINDS.forEach((kind, i) => {
    const n = nerves[kind], S = n.solution, y = lanes[i], h = kind === 'squid' ? opts.thick ?? (narrow ? 34 : 40) : opts.thin ?? 10, colour = LANE()[kind];
    // its name, and how it's doing
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = MONO(13, 600);
    ctx.fillStyle = colour;
    // (its name above it, and what it is beside the name)
    const nx = X0, ny = y - h / 2 - (kind === 'myelin' ? 18 : 12);
    ctx.fillText(NAMES[kind].toUpperCase(), nx, ny);
    const sub = kind === 'squid' ? '48× as wide (drawn 4×)' : kind === 'myelin' ? 'the same nerve, wrapped' : '10 µm across';
    const wName = ctx.measureText(NAMES[kind].toUpperCase()).width;
    ctx.font = MONO(12);
    ctx.fillStyle = COL.muted;
    ctx.fillText(sub, nx + wName + 12, ny);
    ctx.textAlign = 'right';
    ctx.font = MONO(13, 600);
    if (n.arrived !== null) {
      ctx.fillStyle = COL.ink;
      ctx.fillText(`${(1000 * n.arrived).toFixed(2)} ms`, X1, ny);
      // the finish, flashed in the first moments after it arrives (the first one in, brighter)
      const since = n.time - n.arrived, first = KINDS.every((kk) => kk === kind || nerves[kk].arrived === null || nerves[kk].arrived > n.arrived);
      if (since >= 0 && since < 0.25e-3 * (opts.flash ?? 1)) {
        const u = 1 - since / (0.25e-3 * (opts.flash ?? 1)), r0 = (first ? 70 : 34) * (h > 20 ? 1.4 : 1);
        const g = ctx.createRadialGradient(px(Math.min(n.end, L)), y, 0, px(Math.min(n.end, L)), y, r0);
        g.addColorStop(0, first ? COL.spike : colour);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = u * (first ? 1 : 0.5);
        ctx.fillStyle = g;
        ctx.fillRect(px(Math.min(n.end, L)) - r0, y - r0, 2 * r0, 2 * r0);
        ctx.globalAlpha = 1;
      }
    }
    else if (opts.over && (n.front ?? 0) < 0.5 * L && kind === 'myelin') {
      ctx.fillStyle = COL.warn ?? COL.na;
      ctx.fillText('stopped', X1, ny);
    }
    else if (opts.over && n.front !== null && Number.isFinite(n.pace)) {
      // still crawling when the others are in: when it would arrive, at its own speed so far
      ctx.fillStyle = COL.muted;
      ctx.font = MONO(12.5);
      ctx.fillText(`${n.pace.toFixed(1)} m/s: in at about ${(1000 * (n.at[n.at.findLastIndex(Number.isFinite)] + (L - n.front) / n.pace)).toFixed(1)} ms`, X1, ny);
    }
    // the nerve: a lit trail as far as the spike has reached (the wrapped one's leaps a gap at a
    // time), and axoplasm glowing by membrane voltage
    const x0 = px(0), x1 = px(L), N = Math.round((x1 - x0) / 2);
    if (n.front !== null) {
      ctx.fillStyle = mix(COL.axon, colour, 0.45);
      ctx.fillRect(x0, y - h / 2, px(n.front) - x0, h);
    }
    for (let k = 0; k < N; k++) {
      const x = ((k + 0.5) / N) * L;
      if (x > n.end) break;
      const u = heat(vmAt(S, x));
      if (u < 0.05) continue;
      ctx.globalAlpha = Math.min(1, u * 1.4);
      ctx.fillStyle = mix(COL.axon, COL.spike, u);
      ctx.fillRect(x0 + ((x1 - x0) * k) / N, y - h / 2, (x1 - x0) / N + 0.6, h);
      ctx.globalAlpha = 1;
    }
    // glow where it's firing
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < N; k += 3) {
      const x = ((k + 0.5) / N) * L;
      if (x > n.end) break;
      const u = heat(vmAt(S, x));
      if (u < 0.35) continue;
      const g = ctx.createRadialGradient(x0 + ((x1 - x0) * k) / N, y, 0, x0 + ((x1 - x0) * k) / N, y, h + 18);
      g.addColorStop(0, COL['spike-glow']);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = (u - 0.35) * (kind === 'squid' ? 0.3 : 0.5); // (the squid's glow is big enough already)
      ctx.fillStyle = g;
      ctx.fillRect(x0 + ((x1 - x0) * k) / N - h - 18, y - h - 18, 2 * (h + 18), 2 * (h + 18));
    }
    ctx.restore();
    // myelin: a sheath over each stretch between nodes (the gaps drawn wider than life)
    if (kind === 'myelin') {
      const step = NODE + n.p.gap;
      ctx.fillStyle = COL.sheath;
      ctx.strokeStyle = COL['sheath-line'];
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.62; // (the voltage under it shows through)
      for (let x = NODE; x < n.end - NODE; x += step) {
        const a = px(x) + 2.5, b = px(Math.min(x + n.p.gap, n.end)) - 2.5;
        if (b - a < 2) continue;
        ctx.beginPath(); ctx.roundRect(a, y - h / 2 - 6, b - a, h + 12, 7); ctx.fill(); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // a flash at each node as it fires (the spike reaching it), fading over 0.06 ms
      for (let x = 0; x < n.end; x += step) {
        const i = Math.round(((x + NODE / 2) / n.end) * (n.spots.length - 1)), since = n.time - n.at[i];
        if (!(since >= 0 && since < 0.06e-3)) continue;
        const u = 1 - since / 0.06e-3;
        const g = ctx.createRadialGradient(px(x), y, 0, px(x), y, 26);
        g.addColorStop(0, COL.spike);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = u;
        ctx.fillStyle = g;
        ctx.fillRect(px(x) - 26, y - 26, 52, 52);
        ctx.globalAlpha = 1;
      }
    }
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1.5;
    if (kind !== 'myelin') { ctx.beginPath(); ctx.roundRect(px(0), y - h / 2, px(Math.min(n.end, L)) - px(0), h, h / 2); ctx.stroke(); }
  });
}

// ---------- picture 2: the wave ----------
// Membrane voltage along each nerve, the three on one scale.
export function drawWave(f, nerves) {
  const { ctx, VW, VH } = f, narrow = VW < 900;
  ctx.clearRect(0, 0, VW, VH);
  const top = narrow ? 90 : 60, bottom = VH - 60, lo = -90 * mV, hi = 60 * mV, y = (v) => bottom - ((v - lo) / (hi - lo)) * (bottom - top);
  // grid and axis
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;
  // (each grid line labelled at its right end, just above it)
  for (let v = -80; v <= 40; v += 40) {
    ctx.beginPath(); ctx.moveTo(px(0), y(v * mV)); ctx.lineTo(px(L), y(v * mV)); ctx.stroke();
    ctx.fillText(`${v < 0 ? '−' : ''}${Math.abs(v)} mV`, px(L), y(v * mV) - 3);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  for (const c of [0, 0.5, 1, 1.5, 2]) ctx.fillText(`${c} cm`, px(c / 100), bottom + 22);
  // node positions, as ticks along the bottom
  const step = NODE + nerves.myelin.p.gap;
  ctx.strokeStyle = COL.sheath;
  ctx.lineWidth = 2;
  for (let x = 0; x < nerves.myelin.end; x += step) { ctx.beginPath(); ctx.moveTo(px(x), bottom - 6); ctx.lineTo(px(x), bottom); ctx.stroke(); }
  for (const kind of KINDS) {
    const S = nerves[kind].solution, colour = LANE()[kind];
    ctx.strokeStyle = colour;
    ctx.lineWidth = kind === 'myelin' ? 3 : 2.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let k = 0; k <= 480; k++) { const x = (k / 480) * Math.min(L, nerves[kind].end); const yy = y(vmAt(S, x)); k ? ctx.lineTo(px(x), yy) : ctx.moveTo(px(x), yy); }
    ctx.stroke();
  }
  // a key, in a row above the plot (two rows on a narrow page)
  ctx.font = MONO(12.5, 600);
  ctx.textAlign = 'left';
  let kx = px(0), ky = 26;
  KINDS.forEach((kind) => {
    const w = ctx.measureText(NAMES[kind]).width;
    if (kx + w > px(L)) { kx = px(0); ky += 22 * FS; }
    ctx.fillStyle = LANE()[kind];
    ctx.fillRect(kx, ky - 8 * FS, 14, 3);
    ctx.fillText(NAMES[kind], kx + 20, ky);
    kx += w + 44;
  });
}

// ---------- picture 3: who carries it ----------
// The bare nerve's membrane currents, and the current along its inside split by ion.
export function ions(S) {
  const mem = S.ports[0], xs = Array.from(S.x), Vm = Array.from(mem.Vm), { m, h, n } = mem.gates;
  const E = (s, g) => (VT / z[s]) * Math.log(OUT[s] / S.c[s][g]);
  const cross = { // outward, A/m² of membrane
    'Na+': Vm.map((v, g) => G['Na+'] * m[g] ** 3 * h[g] * (v - E('Na+', g))),
    'K+': Vm.map((v, g) => G['K+'] * n[g] ** 4 * (v - E('K+', g))),
  };
  const xm = xs.slice(1).map((x, g) => (x + xs[g]) / 2);
  const along = Object.fromEntries(['K+', 'Na+', 'Cl-', 'A-'].map((s) => [s, xm.map((_, g) => (-(F * F) * (s === 'A-' ? DA : D) * 0.5 * (S.c[s][g] + S.c[s][g + 1]) * (S.V[s][g + 1] - S.V[s][g])) / (RT * (xs[g + 1] - xs[g])))]));
  return { xs, cross, xm, along };
}
export function drawIons(f, nerve) {
  const { ctx, VW, VH } = f, narrow = VW < 900;
  ctx.clearRect(0, 0, VW, VH);
  const S = nerve.solution, I = ions(S);
  const yMem = 130, yIn = 228, band = 46, yAxis = 318;
  // outside, the membrane, inside
  ctx.fillStyle = COL.outside; ctx.fillRect(px(0), 40, px(L) - px(0), yMem - 40);
  ctx.fillStyle = COL.axon; ctx.fillRect(px(0), yMem, px(L) - px(0), yAxis - 18 - yMem);
  ctx.fillStyle = COL['line-2']; ctx.fillRect(px(0), yMem - 3, px(L) - px(0), 6);
  ctx.font = MONO(12.5);
  ctx.fillStyle = COL.muted;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('outside', px(0) + 8, 58);
  ctx.fillText('inside the nerve', px(0) + 8, yMem + 22);
  // crossing the membrane: Na⁺ in (down), K⁺ out (up), as arrows every few hundred micrometres
  const peak = Math.max(1e-9, ...I.cross['Na+'].map((v) => Math.max(0, -v)), ...I.cross['K+'].map((v) => Math.max(0, v)));
  for (let k = 0; k < 64; k++) {
    const x = ((k + 0.5) / 64) * L, g = I.xs.findIndex((v) => v >= x), xp = px(x);
    if (g < 0) continue;
    const na = Math.max(0, -I.cross['Na+'][g]) / peak, kk = Math.max(0, I.cross['K+'][g]) / peak;
    if (na > 0.04) arrow(ctx, xp - 3, yMem - 40 * na - 4, xp - 3, yMem + 26 * na + 4, COL.na, 1 + 2.5 * na);
    if (kk > 0.04) arrow(ctx, xp + 3, yMem + 26 * kk + 4, xp + 3, yMem - 40 * kk - 4, COL.k, 1 + 2.5 * kk);
  }
  // along the inside: a band as thick as the current there, split by ion
  const tot = I.xm.map((_, g) => I.along['K+'][g] + I.along['Na+'][g] + I.along['Cl-'][g] + I.along['A-'][g]);
  const big = Math.max(1e-9, ...tot.map(Math.abs));
  const order = [['K+', COL.k], ['Na+', COL.na], ['Cl-', COL.cl], ['A-', COL.anion]];
  for (let k = 0; k < I.xm.length; k++) {
    const a = px(I.xs[k]), b = px(I.xs[k + 1]), T = tot[k], w = (Math.abs(T) / big) * band;
    if (w < 0.3) continue;
    let y0 = yIn - w / 2;
    for (const [s, c] of order) {
      const part = (I.along[s][k] / T) * w;
      if (part <= 0) continue;
      ctx.fillStyle = c;
      ctx.fillRect(a, y0, b - a + 0.5, part);
      y0 += part;
    }
  }
  // the shares, where the current along the inside is biggest
  let gMax = 0;
  tot.forEach((v, g) => { if (Math.abs(v) > Math.abs(tot[gMax])) gMax = g; });
  const share = (s) => Math.round((100 * I.along[s][gMax]) / tot[gMax]);
  if (Math.abs(tot[gMax]) > 1) {
    const x = px(I.xm[gMax]), dir = Math.sign(tot[gMax]);
    arrow(ctx, x - 30 * dir, yIn + band / 2 + 16, x + 30 * dir, yIn + band / 2 + 16, COL.ink, 1.5);
    ctx.font = MONO(12.5, 600);
    ctx.textAlign = 'left';
    ctx.fillStyle = COL.ink;
    const tx = X0;
    ctx.fillText('current along the inside, carried by:', tx, yAxis + 44);
    ctx.font = MONO(13, 600);
    const parts = [[`K⁺ ${share('K+')}%`, COL.k], [`Na⁺ ${share('Na+')}%`, COL.na], [`Cl⁻ ${share('Cl-')}%`, COL.cl], [`large anions ${share('A-')}%`, COL.anion]];
    const widths = parts.map(([t]) => ctx.measureText(t).width + 18), all = widths.reduce((a, b) => a + b);
    let sx = tx;
    parts.forEach(([t, c], i) => { ctx.fillStyle = c; ctx.fillText(t, sx, yAxis + 68); sx += widths[i]; });
  }
  // a key for the crossings
  ctx.font = MONO(12.5, 600);
  ctx.textAlign = 'right';
  ctx.fillStyle = COL.na; ctx.fillText('Na⁺ in', px(L) - 8, 58);
  ctx.fillStyle = COL.k; ctx.fillText('K⁺ out', px(L) - 80 * FS, 58);
  ctx.fillStyle = COL.muted;
  ctx.font = MONO(12.5);
  ctx.textAlign = 'center';
  for (const c of [0, 0.5, 1, 1.5, 2]) ctx.fillText(`${c} cm`, px(c / 100), yAxis);
}
function arrow(ctx, x0, y0, x1, y1, colour, w) {
  const a = Math.atan2(y1 - y0, x1 - x0), hl = 5 + 2 * w;
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - hl * 0.7 * Math.cos(a), y1 - hl * 0.7 * Math.sin(a)); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - hl * Math.cos(a - 0.45), y1 - hl * Math.sin(a - 0.45));
  ctx.lineTo(x1 - hl * Math.cos(a + 0.45), y1 - hl * Math.sin(a + 0.45));
  ctx.closePath(); ctx.fill();
}

// ---------- a zoom on the wrapped nerve ----------
// A few millimetres of it, magnified, following its front: each gap's firing and the trail's leap
// to the next. (Space is magnified; time runs as in the race.)
export function drawZoom(f, n, opts = {}) {
  const { ctx, VW, VH } = f, span = opts.span ?? 5e-3, h = opts.h ?? 56, y = VH / 2 + 10;
  ctx.clearRect(0, 0, VW, VH);
  const front = n.front ?? 0, a = clamp(front - 0.6 * span, 0, Math.max(0, n.end - span)), b = a + span;
  const zx = (x) => 30 + ((x - a) / span) * (VW - 60);
  const S = n.solution, step = NODE + n.p.gap;
  ctx.save();
  ctx.beginPath(); ctx.rect(30, 0, VW - 60, VH); ctx.clip();
  ctx.fillStyle = COL.axon;
  ctx.fillRect(30, y - h / 2, VW - 60, h);
  if (n.front !== null) { ctx.fillStyle = mix(COL.axon, LANE()[n.kind], 0.45); ctx.fillRect(30, y - h / 2, zx(front) - 30, h); }
  for (let k = 0; k < 200; k++) {
    const x = a + ((k + 0.5) / 200) * span, u = heat(vmAt(S, x));
    if (u < 0.05) continue;
    ctx.globalAlpha = Math.min(1, u * 1.4);
    ctx.fillStyle = mix(COL.axon, COL.spike, u);
    ctx.fillRect(zx(a + (k / 200) * span), y - h / 2, (VW - 60) / 200 + 0.8, h);
    ctx.globalAlpha = 1;
  }
  // the sheath, and a flash at each gap as it fires
  ctx.fillStyle = COL.sheath; ctx.strokeStyle = COL['sheath-line']; ctx.lineWidth = 1.5;
  for (let x = Math.floor(a / step) * step; n.kind === 'myelin' && x < b; x += step) {
    const l = zx(x + NODE) + 9, r = zx(x + step) - 9;
    ctx.globalAlpha = 0.62;
    ctx.beginPath(); ctx.roundRect(l, y - h / 2 - 16, r - l, h + 32, 18); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 1;
    const i = Math.round(((x + NODE / 2) / n.end) * (n.spots.length - 1)), since = n.time - n.at[i];
    if (since >= 0 && since < 0.08e-3) {
      const u = 1 - since / 0.08e-3, gx = zx(x + NODE / 2);
      const g = ctx.createRadialGradient(gx, y, 0, gx, y, 90);
      g.addColorStop(0, COL.spike); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = u; ctx.fillStyle = g; ctx.fillRect(gx - 90, y - 90, 180, 180); ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
  // a scale bar and a label
  ctx.font = MONO(13, 600);
  ctx.fillStyle = LANE()[n.kind];
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(opts.label ?? 'CLOSE UP', 30, 26);
  ctx.strokeStyle = COL.muted; ctx.lineWidth = 2;
  const bx = VW - 30 - (VW - 60) / (span / 1e-3);
  ctx.beginPath(); ctx.moveTo(bx, VH - 22); ctx.lineTo(VW - 30, VH - 22); ctx.stroke();
  ctx.font = MONO(12.5); ctx.fillStyle = COL.muted; ctx.textAlign = 'right';
  ctx.fillText('1 mm', VW - 30, VH - 30);
  ctx.textAlign = 'left';
  if (n.kind === 'myelin') ctx.fillText('a gap in the wrapping every millimetre', 30, VH - 30);
}
