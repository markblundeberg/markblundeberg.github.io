// fx.js — the anime-OP effects toolkit for PROBLEM SET ∞.
// Sunflower petals, speed lines, flashes/impacts, camera shake, transitions (whip pan, iris, page turn, petal wipe),
// light (leaks, god rays, sparkles, glints), kinetic chorus type, lyric subtitles, the Q.E.D. hook, the title logo,
// and staff credits.
//
// Rules: every function is a pure function of t with explicit start times (t0) and durations (dur); randomness comes
// from rng(seed); heavy textures (petal sprites, glyph sprites, stamps, logo layers) go through cached().
// Transitions take two "sources": a frame callback (g, t) => void that draws a full frame, or a CSS colour string.

// ------------------------------------------------------------------------------------------------------------------
// utilities
// ------------------------------------------------------------------------------------------------------------------
const fxFrame = t => Math.floor(t * FPS + 1e-4);               // 24 fps frame index
const FX_INK = '#3b2418', FX_WHITE = '#fff8ea', FX_PAPERIN = '#f6ecd4';
let _fxDepth = 0;

// Scratch canvas, cleared on every use. Contents never carry between frames.
function _fxBuf(name, w = W, h = H) {
  const c = cached('fxbuf:' + name + ':' + _fxDepth + ':' + w + 'x' + h, w, h, () => {});
  const x = c.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none';
  x.clearRect(0, 0, w, h);
  return c;
}
function _fxCanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
// Draw a source (frame callback or colour) straight into g.
function _fxPaint(g, src, t) {
  if (!src) return;
  if (typeof src === 'string') { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = src; g.fillRect(0, 0, g.canvas.width, g.canvas.height); g.restore(); return; }
  _fxDepth++; g.save(); src(g, t); g.restore(); _fxDepth--;
}
// Render a source into a named scratch buffer and return it.
function _fxRender(name, src, t) {
  const c = _fxBuf(name), x = c.getContext('2d');
  _fxPaint(x, src, t);
  return c;
}
// Multiply a layer by the pigment texture without spilling into transparent areas.
function _fxTexturize(c, amt = .35, ox = 0, oy = 0) {
  const x = c.getContext('2d'), keep = _fxCanvas(c.width, c.height);
  keep.getContext('2d').drawImage(c, 0, 0);
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'multiply'; x.globalAlpha = amt;
  x.drawImage(pigmentTexture(), -ox, -oy); x.globalAlpha = 1;
  x.globalCompositeOperation = 'destination-in'; x.drawImage(keep, 0, 0); x.restore();
}
// Alpha speckle (dry ink / rubber stamp breakup). 1024² tile.
function _fxSpeckle(kind = 'fine') {
  return cached('fxspeck:' + kind, 1024, 1024, g => {
    const N = makeNoise('speck' + kind), img = g.createImageData(1024, 1024), d = img.data, r = rng('speckr' + kind);
    for (let y = 0; y < 1024; y++) for (let x = 0; x < 1024; x++) {
      let a;
      if (kind === 'fine') { const n = N(x / 3.1, y / 3.1) * .6 + N(x / 11, y / 11) * .4; a = clamp((n - .62) * 5); }
      else if (kind === 'blotch') { const n = N.fbm(x / 70, y / 70, 4); a = clamp((n - .45) * 2.2) * .9; }
      else { const n = N(x / 1.6, y / 1.6) * .5 + N.fbm(x / 40, y / 40, 3) * .5; a = clamp((n - .58) * 4); }
      const i = (y * 1024 + x) * 4; d[i] = d[i + 1] = d[i + 2] = 0; d[i + 3] = a * 255;
    }
    g.putImageData(img, 0, 0);
    if (kind === 'stamp') { g.fillStyle = '#000'; for (let i = 0; i < 260; i++) { g.globalAlpha = r.range(.3, 1); g.beginPath(); g.arc(r() * 1024, r() * 1024, r.range(.6, 3.2), 0, 7); g.fill(); } }
  });
}
function _fxErode(c, kind = 'fine', amt = .5, seed = 0) {
  const x = c.getContext('2d'), s = _fxSpeckle(kind), r = rng('erode' + seed);
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-out'; x.globalAlpha = amt;
  const ox = -r() * 512, oy = -r() * 512;
  for (let yy = oy; yy < c.height; yy += 1024) for (let xx = ox; xx < c.width; xx += 1024) x.drawImage(s, xx, yy);
  x.restore();
}
// Hand-drawn wobble: displace a sprite in horizontal then vertical strips by smooth noise.
function _fxWobble(src, amp, wl, seed) {
  if (amp <= 0) return src;
  const w = src.width, h = src.height, N = makeNoise(seed), step = 2;
  const a = _fxCanvas(w, h), ax = a.getContext('2d');
  for (let y = 0; y < h; y += step) ax.drawImage(src, 0, y, w, step, (N(y / wl, .5) - .5) * 2 * amp, y, w, step);
  const b = _fxCanvas(w, h), bx = b.getContext('2d');
  for (let x = 0; x < w; x += step) bx.drawImage(a, x, 0, step, h, x, (N(7.3, x / wl) - .5) * 2 * amp, step, h);
  return b;
}
// Concave four-point star (glints, sparkles, the logo spark has 8 points: see _fxSpark).
function _fxStar(g, x, y, R, pts = 4, inner = .16, rot = 0) {
  g.beginPath();
  for (let k = 0; k <= pts; k++) {
    const a = rot + k / pts * Math.PI * 2, am = a - Math.PI / pts;
    const tx = x + Math.cos(a) * R, ty = y + Math.sin(a) * R;
    if (k === 0) { g.moveTo(tx, ty); continue; }
    g.quadraticCurveTo(x + Math.cos(am) * R * inner, y + Math.sin(am) * R * inner, tx, ty);
  }
  g.closePath();
}
// Claude's eight-point spark (✷), painted, with ink edge.
function _fxSpark(g, x, y, R, rot = 0, opts = {}) {
  const { fill = PAL.cream, line = FX_INK, lw = R * .07, boil = 0, glow = 0 } = opts;
  g.save();
  if (glow > 0) {
    const gr = g.createRadialGradient(x, y, 0, x, y, R * 2.4);
    gr.addColorStop(0, `rgba(255,236,190,${.6 * glow})`); gr.addColorStop(1, 'rgba(255,236,190,0)');
    g.fillStyle = gr; g.fillRect(x - R * 2.4, y - R * 2.4, R * 4.8, R * 4.8);
  }
  const p = [];
  for (let k = 0; k < 16; k++) { const a = rot + k / 16 * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? R * .42 : (k % 4 ? R * .78 : R); p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  g.fillStyle = fill; tracePoly(g, p); g.fill();
  g.save(); tracePoly(g, p); g.clip(); g.fillStyle = 'rgba(214,164,67,.35)'; g.beginPath(); g.arc(x + R * .25, y + R * .3, R * .8, 0, 7); g.fill(); g.restore();
  inkPoly(g, p, { width: lw, color: line, seed: 'spark' + Math.round(R), boil, wobble: R * .012 });
  g.restore();
}

// ------------------------------------------------------------------------------------------------------------------
// 1. SUNFLOWER PETALS
// ------------------------------------------------------------------------------------------------------------------
const FX_PETAL_L = 180, FX_PETAL_W = 25, FX_PETAL_N = 8;
const FX_PETAL_COLS = ['#d97757', '#e0844e', '#d06a48', '#e49a4e', '#da7a52', '#c9603f', '#e8a845', '#d8744c'];
function _fxPetalPoly(v) {
  const r = rng('fxpetal' + v);
  const L = FX_PETAL_L * r.range(.88, 1.04), Wd = FX_PETAL_W * r.range(.78, 1.08), asym = r.range(-.16, .16), curl = r.range(-18, 18), pm = r.range(.55, .7);
  const top = [], bot = [], n = 34;
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    // sunflower ray: narrow stalk at the base, near-parallel sides, widest past the middle, a soft point at the tip
    const rise = Math.pow(Math.sin(Math.PI / 2 * Math.min(1, s / pm)), .7), fall = s > pm ? Math.pow(1 - Math.pow((s - pm) / (1 - pm), 2.2), .55) : 1;
    const hw = Wd * (.2 + .8 * rise) * fall;
    const c = curl * s * s;
    top.push([s * L, c - hw * (1 + asym)]); bot.push([s * L, c + hw * (1 - asym)]);
  }
  return { pts: [...top, ...bot.reverse()], L, Wd, curl, asym };
}
// sprite: 220×110, petal base at (20, 55), pointing +x. back = reverse side; blur 0/1/2 for depth of field.
function _fxPetalSprite(v, back, blur = 0) {
  return cached(`fxpet:${v}:${back}:${blur}`, 230, 120, gg => {
    if (blur) { gg.filter = `blur(${blur === 1 ? 2.4 : 5.5}px)`; gg.drawImage(_fxPetalSprite(v, back, 0), 0, 0); return; }
    const { pts, L, Wd, curl } = _fxPetalPoly(v), r = rng('fxpc' + v + back);
    const base = FX_PETAL_COLS[v % FX_PETAL_COLS.length], deep = mix(base, '#6e2c14', .5), light = mix(base, '#fff0d8', .5);
    const col = back ? mix(base, '#f2cfae', .3) : base;
    gg.translate(22, 60);
    paintFill(gg, x => P2(x, pts), col, { tex: .3 });
    gg.save(); P2(gg, pts); gg.clip();
    // watercolour: pigment darkens toward the base, a wet bloom of light along the upper side, cel shade below the crease
    let lg = gg.createLinearGradient(0, 0, L, 0); lg.addColorStop(0, rgba(deep, back ? .6 : .9)); lg.addColorStop(.35, rgba(deep, 0)); lg.addColorStop(.7, rgba(light, 0)); lg.addColorStop(1, rgba(mix(light, '#ffd27a', .4), back ? .3 : .55)); gg.fillStyle = lg; gg.fillRect(-5, -60, L + 10, 120);
    const rg = gg.createRadialGradient(L * .6, -Wd * .35 + curl * .3, 2, L * .6, -Wd * .3, L * .38); rg.addColorStop(0, rgba(light, back ? .35 : .6)); rg.addColorStop(1, rgba(light, 0)); gg.fillStyle = rg; gg.fillRect(-5, -60, L + 10, 120);
    gg.fillStyle = rgba(deep, back ? .12 : .22); gg.beginPath(); gg.moveTo(0, 2);
    for (let i = 0; i <= 20; i++) { const s = i / 20; gg.lineTo(s * L, curl * s * s + 2 + Wd * .08 * Math.sin(s * 9)); }
    gg.lineTo(L, 60); gg.lineTo(0, 60); gg.closePath(); gg.fill();
    // midrib crease: a dark line with a light ridge beside it
    gg.lineCap = 'round'; gg.strokeStyle = rgba(deep, back ? .2 : .4); gg.lineWidth = 2.2; gg.beginPath(); gg.moveTo(4, 1); for (let i = 1; i <= 16; i++) { const s = i / 16 * .85; gg.lineTo(s * L, curl * s * s + 1); } gg.stroke();
    gg.strokeStyle = rgba(light, back ? .2 : .45); gg.lineWidth = 2.4; gg.beginPath(); gg.moveTo(8, -3); for (let i = 1; i <= 16; i++) { const s = i / 16 * .8; gg.lineTo(s * L, curl * s * s - 3.5); } gg.stroke();
    if (!back) { // veins
      gg.lineCap = 'round';
      for (let k = -2; k <= 2; k++) {
        gg.strokeStyle = rgba(deep, r.range(.18, .32)); gg.lineWidth = r.range(1, 1.8);
        const e = k * Wd * .32, s1 = r.range(.7, .9);
        gg.beginPath(); gg.moveTo(L * .04, k * 1.5); gg.quadraticCurveTo(L * .45, e * .9 + curl * .2, L * s1, e * .55 + curl * s1 * s1); gg.stroke();
      }
    }
    // pigment pools at the edge
    gg.strokeStyle = rgba(deep, .38); gg.lineWidth = 6; P2(gg, pts); gg.stroke();
    gg.restore();
    inkPath(gg, [...pts, pts[0]], { width: 3.6, color: '#5a2d1a', seed: 'fxpi' + v + back, wobble: .45, taper: false, alpha: .92 });
  });
}
// Draw one petal. size = on-screen length (px). tumble: flip about the long axis (foreshortened), pitch: about the short axis.
function fxPetal(g, x, y, size, rot, tumble = 0, pitch = 0, variant = 0, blur = 0, alpha = 1) {
  const c = Math.cos(tumble), back = c < 0 ? 1 : 0;
  const sy = Math.max(.16, Math.abs(c)), sx = .78 + .22 * Math.abs(Math.cos(pitch));
  const spr = _fxPetalSprite(((variant % FX_PETAL_N) + FX_PETAL_N) % FX_PETAL_N, back, blur), k = size / FX_PETAL_L;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(k * sx, k * sy * (back ? -1 : 1));
  g.globalAlpha *= alpha;
  g.drawImage(spr, -22 - FX_PETAL_L * .5, -60);
  g.restore();
}

// The petal system. Pure function of t: every petal's path comes from its seed and emit time.
// mode 'wind'  : continuous stream blown across the frame by `wind` (px/s), emitted at `rate` per second between t0..t1.
//                prewarm:true fills the frame at t0. Use a downward wind ([60,150]) for gentle falling petals.
// mode 'burst' : `count` petals explode from (x,y) at t0 (within `stagger` s), decelerate (drag) and get taken by the wind.
// mode 'swirl' : petals orbit (x,y) in a tilted vortex (squash), spiralling outward; `rate` stream or `count` at t0.
// common: seed, size [min,max] px, depth [zmin,zmax] (scale/speed/parallax), turb (flutter px), alpha, blur (DOF), spin.
function petals(g, t, o = {}) {
  const mode = o.mode || 'wind', seed = o.seed || ('pet' + mode), zr = o.depth || [.55, 1.5], sz = o.size || [52, 92];
  const alpha = o.alpha ?? 1, turb = o.turb ?? 46, list = [];
  const tt = o.onTwos ? Math.floor(t * BOIL + 1e-6) / BOIL : t;
  const push = (r, x, y, z, a, k = 1, extra = 0) => {
    const size = r.range(sz[0], sz[1]) * z * k * (o.scale ?? 1);
    if (x < -size - 50 || x > W + size + 50 || y < -size - 50 || y > H + size + 50) return;
    const spin = r.range(.8, 3.2) * (r() < .5 ? -1 : 1) * (o.spin ?? 1);
    list.push({ x, y, z, size, rot: r() * 6.283 + spin * a + extra * .6, tum: r() * 6.283 + r.range(2.2, 6.5) * (r() < .5 ? -1 : 1) * a * (o.spin ?? 1) + extra,
      pit: r() * 6.283 + r.range(.8, 2.4) * a, v: Math.floor(r() * 64), al: k });
  };
  if (mode === 'wind') {
    const wind = o.wind || [520, 80], wl = Math.hypot(wind[0], wind[1]) || 1, d = [wind[0] / wl, wind[1] / wl], n = [-d[1], d[0]];
    const R = Math.hypot(W, H) / 2 + 180, rate = o.rate ?? 20, maxLife = 2 * R / (wl * zr[0] * .8) + .5;
    const t0 = (o.t0 ?? 0) - (o.prewarm ? maxLife : 0), t1 = o.t1 ?? 1e9, cx = o.x ?? W / 2, cy = o.y ?? H / 2;
    const iLo = Math.max(0, Math.floor((tt - maxLife - t0) * rate) - 1), iHi = Math.floor((Math.min(tt, t1) - t0) * rate);
    for (let i = iLo; i <= iHi; i++) {
      const r = rng(seed + ':' + i), te = t0 + (i + r()) / rate, a = tt - te;
      if (a < 0 || te > t1) continue;
      const z = r.range(zr[0], zr[1]), v = wl * z * r.range(.8, 1.2), life = 2 * R / v;
      if (a > life) continue;
      const u = r.range(-1.1, 1.1) * R * (o.band ?? 1);
      const f1 = r.range(1.1, 2.6), f2 = r.range(3.3, 6.5), p1 = r() * 6.3, p2 = r() * 6.3, A = turb * z;
      const sway = A * (Math.sin(f1 * a + p1) + .45 * Math.sin(f2 * a + p2)), surge = A * .5 * Math.sin(f1 * .7 * a + p2);
      const along = -R + v * a + surge;
      push(r, cx + d[0] * along + n[0] * (u + sway), cy + d[1] * along + n[1] * (u + sway), z, a, clamp(a / .25), sway * .02);
    }
  } else if (mode === 'burst') {
    const N = o.count ?? 80, k = o.drag ?? 2.4, sp = o.speed || [500, 1600], spread = o.spread ?? Math.PI * 2, dir = o.dir ?? -Math.PI / 2;
    const wT = o.wind || [140, 170], life = o.life ?? 5, t0 = o.t0 ?? 0, x0 = o.x ?? W / 2, y0 = o.y ?? H / 2, r0 = o.r0 ?? 30;
    for (let i = 0; i < N; i++) {
      const r = rng(seed + ':' + i), te = t0 + r() * (o.stagger ?? .05), a = tt - te;
      if (a < 0 || a > life) continue;
      const z = r.range(zr[0], zr[1]), ang = dir + (r() - .5) * spread, s = r.range(sp[0], sp[1]) * (.55 + .45 * z);
      const vx = Math.cos(ang) * s, vy = Math.sin(ang) * s * (o.squash ?? 1), e = (1 - Math.exp(-k * a)) / k, rr = r() * r0;
      const f1 = r.range(1.4, 3), p1 = r() * 6.3, A = turb * z * (1 - Math.exp(-k * a));
      const x = x0 + Math.cos(ang) * rr + wT[0] * z * a + (vx - wT[0] * z) * e + A * Math.sin(f1 * a + p1);
      const y = y0 + Math.sin(ang) * rr + wT[1] * z * a + (vy - wT[1] * z) * e + A * .6 * Math.cos(f1 * 1.3 * a + p1);
      const fade = 1 - clamp((a - life + .6) / .6);
      push(r, x, y, z, a, (.35 + .65 * clamp(a / .12)) * fade, Math.exp(-k * a) * 4);
    }
  } else if (mode === 'swirl') {
    const x0 = o.x ?? W / 2, y0 = o.y ?? H / 2, rad = o.radius || [120, 620], sw = o.swirl ?? 2.2, ex = o.expand ?? 50, sq = o.squash ?? .42;
    const life = o.life ?? 5, wind = o.wind || [0, -30], t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
    const count = o.count, rate = o.rate ?? 24;
    const iLo = count ? 0 : Math.max(0, Math.floor((tt - life - t0) * rate) - 1), iHi = count ? count - 1 : Math.floor((Math.min(tt, t1) - t0) * rate);
    for (let i = iLo; i <= iHi; i++) {
      const r = rng(seed + ':' + i), te = count ? t0 + r() * (o.stagger ?? .3) : t0 + (i + r()) / rate, a = tt - te;
      if (a < 0 || a > life || te > t1) continue;
      const r0 = r.range(rad[0], rad[1]), th0 = r() * 6.283, om = sw * Math.sqrt(300 / r0) * (o.cw === false ? -1 : 1);
      const th = th0 + om * a, rr = r0 + ex * a, zb = r.range(zr[0], zr[1]), z = zb * (1 + .35 * Math.sin(th));
      const x = x0 + Math.cos(th) * rr + wind[0] * a, y = y0 + Math.sin(th) * rr * sq + wind[1] * a + turb * .4 * Math.sin(a * 2.3 + th0);
      const fade = clamp(a / .35) * (1 - clamp((a - life + .7) / .7));
      push(r, x, y, z, a, fade, th);
    }
  }
  list.sort((p, q) => p.z - q.z);
  const blurOK = o.blur !== false, zspan = Math.max(.01, zr[1] - zr[0]);
  for (const p of list) {
    const blur = blurOK ? (p.z > 1.85 ? 2 : p.z > 1.4 ? 1 : 0) : 0;
    const far = .72 + .28 * clamp((p.z - zr[0]) / zspan * 1.6);
    fxPetal(g, p.x, p.y, p.size, p.rot, p.tum, p.pit, p.v, blur, alpha * p.al * far);
  }
  return list.length;
}
const petalWind = (g, t, o = {}) => petals(g, t, { ...o, mode: 'wind' });
const petalBurst = (g, t, o = {}) => petals(g, t, { ...o, mode: 'burst' });
const petalSwirl = (g, t, o = {}) => petals(g, t, { ...o, mode: 'swirl' });

// Petal wipe: a wave of petals sweeps across at `angle` (0 = left→right), revealing `to` behind the front.
// { t0, dur, from, to, angle, density, size, seed }
function petalWipe(g, t, o = {}) {
  const { t0 = 0, dur = 1, from, to, angle = 0, seed = 'pwipe', density = 1, size = [60, 190] } = o;
  const p = (t - t0) / dur;
  if (p <= 0) { _fxPaint(g, from, t); return; }
  if (p >= 1) { _fxPaint(g, to, t); return; }
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const Lx = Math.abs(W * ca) + Math.abs(H * sa), Ly = Math.abs(W * sa) + Math.abs(H * ca);
  const S = (u, v) => [W / 2 + ca * (u - Lx / 2) - sa * (v - Ly / 2), H / 2 + sa * (u - Lx / 2) + ca * (v - Ly / 2)];
  const margin = 420, pe = ease.inOutQ(p), uf = lerp(-margin, Lx + margin, pe);
  const edgeU = v => uf + 80 * Math.sin(v / 230 + p * 4) + 40 * Math.sin(v / 90 - p * 7 + 1.3);
  _fxPaint(g, from, t);
  g.save(); g.beginPath();
  const st = S(-3000, -200); g.moveTo(st[0], st[1]);
  for (let v = -200; v <= Ly + 200; v += 24) { const q = S(edgeU(v), v); g.lineTo(q[0], q[1]); }
  const en = S(-3000, Ly + 200); g.lineTo(en[0], en[1]); g.closePath(); g.clip();
  _fxPaint(g, to, t);
  g.restore();
  // a soft warm glow riding the front hides the hard edge of the reveal
  g.save(); g.filter = 'blur(18px)'; g.globalCompositeOperation = 'screen'; g.strokeStyle = 'rgba(255,226,180,.55)'; g.lineWidth = 90; g.beginPath();
  for (let v = -200; v <= Ly + 200; v += 40) { const q = S(edgeU(v) + 20, v); v === -200 ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); }
  g.stroke(); g.restore();
  const N = Math.round(300 * density), list = [];
  for (let i = 0; i < N; i++) {
    const r = rng(seed + ':' + i), v = r.range(-160, Ly + 160), z = r.range(.55, 1.8);
    const off = r.gauss() * 120 * (.6 + .4 * z) + 30, fl = 34 * Math.sin(t * r.range(2, 4) + r() * 6);
    const [x, y] = S(edgeU(v) + off + fl, v + 30 * Math.sin(t * 2.3 + r() * 6));
    const sp = r.range(2, 6) * (r() < .5 ? -1 : 1);
    list.push({ x, y, z, size: r.range(size[0], size[1]) * z * .62, rot: angle + r() * 6.28 + sp * t * .5, tum: r() * 6.28 + sp * t, pit: r() * 6.28 + t * 2, v: i });
  }
  list.sort((a, b) => a.z - b.z);
  for (const q of list) fxPetal(g, q.x, q.y, q.size, q.rot, q.tum, q.pit, q.v, q.z > 1.5 ? 1 : 0, 1);
}

// ------------------------------------------------------------------------------------------------------------------
// 2. SPEED LINES (boil on twos)
// ------------------------------------------------------------------------------------------------------------------
// Radial focus lines converging on (x,y), leaving an elliptical clear zone rx×ry.
// { x, y, rx, ry, count, color, alpha, width [min,max] at the frame edge, jitter, t0, dur, fadeIn, fadeOut, fps, seed, dry }
function speedLines(g, t, o = {}) {
  const { x = W / 2, y = H / 2, rx = 430, ry = 270, count = 96, color = FX_INK, alpha = 1, width = [6, 30], jitter = .5,
    t0 = -1e9, dur = 2e9, fadeIn = 0, fadeOut = .12, fps = BOIL, seed = 'sl', dry = .35 } = o;
  if (t < t0 || t > t0 + dur) return;
  const env = alpha * Math.min(1, fadeIn > 0 ? (t - t0) / fadeIn : 1, fadeOut > 0 ? (t0 + dur - t) / fadeOut : 1);
  if (env <= 0) return;
  const f = Math.floor(t * fps + 1e-6), r = rng(seed + ':' + f);
  const R = Math.max(Math.hypot(x, y), Math.hypot(W - x, y), Math.hypot(x, H - y), Math.hypot(W - x, H - y)) + 80;
  const buf = _fxBuf('sl'), bx = buf.getContext('2d');
  bx.fillStyle = color; bx.beginPath();
  for (let i = 0; i < count; i++) {
    const a = (i + r() * .9) / count * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    if (r() < .12) continue;
    const k = 1 + Math.pow(r(), 2) * jitter * 2.2, ix = x + c * rx * k, iy = y + s * ry * k;
    const ed = Math.hypot(ix - x, iy - y), w = r.range(width[0], width[1]) * .5 * (R - ed) / Math.max(200, R * .75 - ed);
    bx.moveTo(ix, iy); bx.lineTo(x + c * R - s * w, y + s * R + c * w); bx.lineTo(x + c * R + s * w, y + s * R - c * w); bx.closePath();
  }
  bx.fill();
  if (dry > 0) _fxErode(buf, 'fine', dry, f);
  g.save(); g.globalAlpha *= env; g.drawImage(buf, 0, 0); g.restore();
}
// Parallel action lines streaking along `angle` (radians, 0 = moving right). clear: half-width of an empty lane through the centre.
// { angle, count, color, alpha, length [min,max], width [min,max], speed px/s, clear, t0, dur, fps, seed }
function actionLines(g, t, o = {}) {
  const { angle = 0, count = 70, color = FX_INK, alpha = 1, length = [260, 1100], width = [3, 12], speed = 2600, clear = 0,
    t0 = -1e9, dur = 2e9, fadeIn = 0, fadeOut = .12, fps = BOIL, seed = 'al', cx = W / 2, cy = H / 2 } = o;
  if (t < t0 || t > t0 + dur) return;
  const env = alpha * Math.min(1, fadeIn > 0 ? (t - t0) / fadeIn : 1, fadeOut > 0 ? (t0 + dur - t) / fadeOut : 1);
  const f = Math.floor(t * fps + 1e-6), tq = f / fps, D = Math.hypot(W, H), U = D + 2400;
  g.save(); g.globalAlpha *= env; g.translate(cx, cy); g.rotate(angle); g.fillStyle = color; g.beginPath();
  for (let i = 0; i < count; i++) {
    const r = rng(seed + ':' + i), rb = rng(seed + ':' + i + ':' + f);
    let v = r.range(-D / 2, D / 2); if (Math.abs(v) < clear) { if (r() < .85) continue; }
    v += rb.gauss() * 5;
    const len = r.range(length[0], length[1]) * rb.range(.85, 1.15), w = r.range(width[0], width[1]) * rb.range(.8, 1.2);
    const u = ((r() * U + speed * r.range(.75, 1.3) * tq) % U) - U / 2;
    g.moveTo(u - len / 2, v); g.quadraticCurveTo(u - len * .1, v - w, u + len / 2, v); g.quadraticCurveTo(u - len * .1, v + w, u - len / 2, v);
  }
  g.fill(); g.restore();
}

// ------------------------------------------------------------------------------------------------------------------
// 3. FLASH / IMPACT / SHAKE / TRANSITIONS / LIGHT
// ------------------------------------------------------------------------------------------------------------------
// Flash frame(s): full-frame colour for `frames` frames after each time in `at`, then a `tail` of fading frames.
// { at: number|number[], frames=2, tail=2, color, alpha, op }
function flashFrame(g, t, o = {}) {
  const ats = Array.isArray(o.at) ? o.at : [o.at ?? 0], frames = o.frames ?? 2, tail = o.tail ?? 2;
  let k = 0;
  for (const at of ats) {
    const fi = fxFrame(t - at);
    if (fi < 0) continue;
    if (fi < frames) k = 1; else if (fi < frames + tail) k = Math.max(k, 1 - (fi - frames + 1) / (tail + 1));
  }
  if (k <= 0) return 0;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k * (o.alpha ?? 1); g.globalCompositeOperation = o.op || 'source-over';
  g.fillStyle = o.color || '#fff7e8'; g.fillRect(0, 0, g.canvas.width, g.canvas.height); g.restore();
  return k;
}
// Impact frame: re-grades what is already drawn for 1–2 frames. mode 'duo' (hard B&W in ink/paper, inverted by default),
// 'invert' (luminance-inverted, hues kept), 'clay' (inverted duotone in ink/clay).
// { at: number|number[], frames=1, mode, invert, contrast, tones:[dark, light] }
function impactFrame(g, t, o = {}) {
  const ats = Array.isArray(o.at) ? o.at : [o.at ?? 0], frames = o.frames ?? 1;
  if (!ats.some(at => { const fi = fxFrame(t - at); return fi >= 0 && fi < frames; })) return false;
  const mode = o.mode || 'duo', c = g.canvas, buf = _fxBuf('impact', c.width, c.height);
  buf.getContext('2d').drawImage(c, 0, 0);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'copy';
  if (mode === 'invert') { g.filter = 'invert(1) hue-rotate(180deg) contrast(1.25)'; g.drawImage(buf, 0, 0); }
  else {
    const inv = o.invert ?? true, tones = o.tones || (mode === 'clay' ? ['#2a140c', '#f08a5e'] : ['#2b1a12', '#fbf1dc']);
    g.filter = `grayscale(1) contrast(${o.contrast ?? 3.2}) brightness(${inv ? 1.05 : 1.15})${inv ? ' invert(1)' : ''}`;
    g.drawImage(buf, 0, 0); g.filter = 'none';
    g.globalCompositeOperation = 'multiply'; g.fillStyle = tones[1]; g.fillRect(0, 0, c.width, c.height);
    g.globalCompositeOperation = 'screen'; g.fillStyle = tones[0]; g.fillRect(0, 0, c.width, c.height);
  }
  g.restore();
  return true;
}
// Camera shake: returns a transform {x, y, rot, scale, env} for time t given impact times (numbers or {t, amp}).
// Alternating kicks on every frame, decaying exponentially. The scale term keeps the frame edges covered.
function cameraShake(t, impacts, o = {}) {
  const { amp = 26, decay = 7, dur = .7, rot = .012, fps = FPS, seed = 'shake', dir = [1, 1.25], zoom = 0 } = o;
  let x = 0, y = 0, r = 0, env = 0;
  const f = Math.floor(t * fps + 1e-4);
  (impacts || []).forEach((im, i) => {
    const it = typeof im === 'number' ? im : im.t, ia = typeof im === 'number' ? 1 : (im.amp ?? 1);
    const a = t - it; if (a < 0 || a > dur) return;
    const e = Math.exp(-decay * a) * ia * (1 - a / dur), rr = rng(seed + i + ':' + f), sg = f % 2 ? 1 : -1;
    x += amp * e * dir[0] * sg * rr.range(.4, 1); y += amp * e * dir[1] * (f === Math.floor(it * fps + 1e-4) ? 1 : -sg * rr.range(.3, 1)); r += rot * e * (rr() * 2 - 1);
    env = Math.max(env, e);
  });
  return { x, y, rot: r, scale: 1 + env * (amp * 2.6 / H + zoom), env };
}
function applyShake(g, s, cx = W / 2, cy = H / 2) { g.translate(cx + s.x, cy + s.y); g.rotate(s.rot); g.scale(s.scale, s.scale); g.translate(-cx, -cy); }

// Whip pan: `from` accelerates out with motion blur and streaks, `to` decelerates in.
// { t0, dur=.45, from, to, dir 'left'|'right'|'up'|'down' (direction the picture moves), streaks }
function _fxStreaks(horiz) {
  return cached('fxstreak' + horiz, W, H, g => {
    const r = rng('streaks'), cols = ['#fff3dc', '#f6d9b0', '#e9a07a', '#c9d6cf', '#ffe9c4', '#d97757', '#f1e6cc'];
    if (!horiz) { g.translate(W, 0); g.rotate(Math.PI / 2); g.scale(H / W, W / H); }
    for (let i = 0; i < 420; i++) {
      const y = r() * H, h = r.range(1, 10) * (r() < .1 ? 4 : 1), x = r.range(-400, W), L = r.range(300, 1800);
      const gr = g.createLinearGradient(x, 0, x + L, 0), c = r.pick(cols), a = r.range(.12, .5);
      gr.addColorStop(0, rgba(c, 0)); gr.addColorStop(.5, rgba(c, a)); gr.addColorStop(1, rgba(c, 0));
      g.fillStyle = gr; g.fillRect(x, y, L, h);
    }
  });
}
function whipPan(g, t, o = {}) {
  const { t0 = 0, dur = .45, from, to, dir = 'left', streaks = true } = o;
  const p = (t - t0) / dur;
  if (p <= 0) { _fxPaint(g, from, t); return; }
  if (p >= 1) { _fxPaint(g, to, t); return; }
  const horiz = dir === 'left' || dir === 'right', sg = (dir === 'left' || dir === 'up') ? -1 : 1, D = horiz ? W : H;
  const first = p < .5, q = first ? p * 2 : (p - .5) * 2;
  const off = first ? ease.inC(q) * D * .9 * sg : -(1 - ease.outC(q)) * D * .9 * sg;
  const bl = Math.pow(Math.sin(Math.PI * p), .55);
  const frame = _fxRender('whipF', first ? from : to, t);
  const small = _fxBuf('whip56', horiz ? Math.round(W / 56) : W, horiz ? H : Math.round(H / 56));
  { const sx = small.getContext('2d'); sx.imageSmoothingEnabled = true; sx.imageSmoothingQuality = 'high'; sx.drawImage(frame, 0, 0, small.width, small.height); }
  // multi-tap motion blur of the sharp frame (equal weights via running alpha), over a heavily smeared base
  const mb = _fxBuf('whipMB'), mx = mb.getContext('2d'), taps = 9, len = bl * D * .22;
  for (let k = 0; k < taps; k++) { mx.globalAlpha = 1 / (k + 1); const d = (k / (taps - 1) - .5) * len; mx.drawImage(frame, horiz ? d : 0, horiz ? 0 : d); }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  const put = (img, a, tile = true) => { if (a <= 0) return; g.globalAlpha = a; for (const k of tile ? [-1, 0, 1] : [0]) g.drawImage(img, horiz ? off + k * W : 0, horiz ? 0 : off + k * H, W, H); };
  put(small, 1);
  put(mb, 1 - clamp(bl * 1.6 - .6), false);
  if (streaks) {
    const s = _fxStreaks(horiz), so = (t * 9000) % D;
    g.globalCompositeOperation = 'screen'; g.globalAlpha = Math.pow(Math.sin(Math.PI * p), 1.5) * .9;
    for (const k of [-1, 0]) g.drawImage(s, horiz ? sg * so + k * W * sg : 0, horiz ? 0 : sg * so + k * H * sg);
  }
  g.restore();
}

// Iris / circle wipe. `inside` shows within the circle, `outside` beyond it (callbacks or colours).
// Radius keyframes: keys [[time, radius], ...] (eased between), or t0/dur/from/to. Radius 'max' covers the frame.
// { x, y, keys | (t0, dur, from, to), inside, outside, ring, ringColor, e }
function irisWipe(g, t, o = {}) {
  const { x = W / 2, y = H / 2, inside, outside = FX_INK, ring = true, ringColor = '#d97757', e = ease.inOutC } = o;
  const Rmax = Math.max(Math.hypot(x, y), Math.hypot(W - x, y), Math.hypot(x, H - y), Math.hypot(W - x, H - y)) + 30;
  const val = v => v === 'max' ? Rmax : v;
  const keys = o.keys || [[o.t0 ?? 0, o.from ?? 0], [(o.t0 ?? 0) + (o.dur ?? .6), o.to ?? 'max']];
  let R = val(keys[0][1]);
  for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i][0]) R = lerp(val(keys[i][1]), val(keys[i + 1][1]), e(inv(keys[i][0], keys[i + 1][0], t)));
  if (t >= keys[keys.length - 1][0]) R = val(keys[keys.length - 1][1]);
  if (R >= Rmax - 1) { _fxPaint(g, inside, t); return R; }
  _fxPaint(g, outside, t);
  if (R > 0.5) {
    const bf = boilFrame(t), circ = deform(polyCircle(x, y, R, R, 64), rng('iris' + bf), 1, .004);
    g.save(); tracePoly(g, circ); g.clip(); _fxPaint(g, inside, t); g.restore();
    if (ring) {
      inkPoly(g, circ, { width: Math.min(12, 3 + R * .03), color: ringColor, seed: 'irisr', boil: bf, wobble: .8 });
      g.save(); g.globalAlpha = .55; inkPoly(g, polyCircle(x, y, Math.max(1, R - 12), Math.max(1, R - 12), 64), { width: 2.4, color: PAL.cream, seed: 'irisr2', boil: bf, wobble: .6 }); g.restore();
    }
  }
  return R;
}

// Page turn: `from` is a sheet peeling from its bottom-right corner toward the left, revealing `to`.
// { t0, dur=.9, from, to, lift (how high the corner travels, 0..1) }
function _fxClipHalf(poly, M, n, keepPos) { // Sutherland–Hodgman against the line through M with normal n
  const f = p => ((p[0] - M[0]) * n[0] + (p[1] - M[1]) * n[1]) * (keepPos ? 1 : -1), out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const k = fa / (fa - fb); out.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]); }
  }
  return out;
}
function pageTurn(g, t, o = {}) {
  const { t0 = 0, dur = .9, from, to, lift = .38 } = o;
  const p = (t - t0) / dur;
  if (p <= 0) { _fxPaint(g, from, t); return; }
  if (p >= 1) { _fxPaint(g, to, t); return; }
  const e = ease.inOutQ(p), O = [W, H], C = [lerp(W, -W * 1.05, e), H - Math.sin(Math.PI * e) * H * lift - e * H * .1];
  const M = [(O[0] + C[0]) / 2, (O[1] + C[1]) / 2], dl = Math.hypot(O[0] - C[0], O[1] - C[1]) || 1, n = [(O[0] - C[0]) / dl, (O[1] - C[1]) / dl];
  const page = [[0, 0], [W, 0], [W, H], [0, H]];
  const keep = _fxClipHalf(page, M, n, false), fold = _fxClipHalf(page, M, n, true);
  const refl = fold.map(q => { const d = (q[0] - M[0]) * n[0] + (q[1] - M[1]) * n[1]; return [q[0] - 2 * d * n[0], q[1] - 2 * d * n[1]]; });
  _fxPaint(g, to, t);
  // shadow on the revealed page along the fold
  g.save(); if (fold.length > 2) { tracePoly(g, fold); g.clip(); const sg = g.createLinearGradient(M[0], M[1], M[0] + n[0] * 260, M[1] + n[1] * 260); sg.addColorStop(0, 'rgba(60,35,20,.45)'); sg.addColorStop(1, 'rgba(60,35,20,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, H); } g.restore();
  if (keep.length > 2) { g.save(); tracePoly(g, keep); g.clip(); _fxPaint(g, from, t); g.restore(); }
  if (refl.length > 2) {
    // cast shadow of the flap onto the page beneath
    g.save(); g.filter = 'blur(14px)'; g.globalAlpha = .4; g.fillStyle = '#3a2214'; g.translate(-n[0] * 18 + 6, -n[1] * 18 + 10); tracePoly(g, refl); g.fill(); g.restore();
    // the back of the sheet: paper, shaded like a curl (bright at the fold, darker toward the lifted corner)
    g.save(); tracePoly(g, refl); g.clip();
    g.drawImage(paperTexture('pageback', W, H, '#efe0bf'), 0, 0);
    const cg = g.createLinearGradient(M[0], M[1], M[0] - n[0] * dl * .5, M[1] - n[1] * dl * .5);
    cg.addColorStop(0, 'rgba(255,250,235,.55)'); cg.addColorStop(.12, 'rgba(255,250,235,.1)'); cg.addColorStop(.6, 'rgba(120,80,40,.12)'); cg.addColorStop(1, 'rgba(90,55,30,.35)');
    g.fillStyle = cg; g.fillRect(0, 0, W, H); g.restore();
    inkPoly(g, refl, { width: 2.2, color: 'rgba(90,60,40,.55)', seed: 'pgedge', boil: boilFrame(t), wobble: .5 });
  }
}

// Light leak: warm film-burn blobs drifting at the frame edge (screen blend).
// { t0, dur, fadeIn, fadeOut, seed, intensity, colors, side 'left'|'right'|'top'|'any' }
function lightLeak(g, t, o = {}) {
  const { t0 = -1e9, dur = 2e9, fadeIn = .4, fadeOut = .6, seed = 'leak', intensity = .55, colors = ['#ff9a5a', '#ffcf86', '#e8674a', '#ffe2b8'], side = 'any', blobs = 5 } = o;
  if (t < t0 || t > t0 + dur) return;
  const env = intensity * Math.min(1, (t - t0) / fadeIn, (t0 + dur - t) / fadeOut);
  const r = rng(seed); g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < blobs; i++) {
    const s = r.pick(side === 'any' ? ['left', 'right', 'top'] : [side]);
    const along = r(), sp = r.range(.15, .4), ph = r() * 6.3, wob = Math.sin((t - t0) * sp + ph);
    let x = s === 'left' ? -r.range(50, 250) : s === 'right' ? W + r.range(50, 250) : along * W, y = s === 'top' ? -r.range(50, 250) : along * H;
    if (s === 'top') x += wob * 320; else y += wob * 260;
    const R = r.range(380, 900) * (1 + .15 * Math.sin((t - t0) * .7 + ph)), c = r.pick(colors), a = env * r.range(.45, 1);
    const gr = g.createRadialGradient(x, y, 0, x, y, R);
    gr.addColorStop(0, rgba(c, a)); gr.addColorStop(.45, rgba(c, a * .45)); gr.addColorStop(1, rgba(c, 0));
    g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R);
  }
  g.restore();
}
// God rays from a light source, soft (drawn at quarter resolution and upscaled), slowly breathing.
// { x, y, angle (pointing into frame), spread, count, length, color, intensity, t0, dur, seed, op }
function godRays(g, t, o = {}) {
  const { x = W * .78, y = -120, angle = 1.95, spread = 1.0, count = 12, length = 2400, color = '#ffe0a6', intensity = .5,
    t0 = -1e9, dur = 2e9, fadeIn = .6, fadeOut = .6, seed = 'rays', op = 'screen' } = o;
  if (t < t0 || t > t0 + dur) return;
  const env = intensity * Math.min(1, (t - t0) / fadeIn, (t0 + dur - t) / fadeOut);
  const b = _fxBuf('rays', 480, 270), bx = b.getContext('2d'), r = rng(seed);
  bx.scale(.25, .25);
  for (let i = 0; i < count; i++) {
    const ph = r() * 6.3, a = angle + (r() - .5) * spread + .03 * Math.sin(t * .2 + ph), w = r.range(.012, .055) * (1 + .4 * Math.sin(t * r.range(.3, .8) + ph));
    const al = r.range(.35, 1) * (.6 + .4 * Math.sin(t * r.range(.4, .9) + ph * 2)), L = length * r.range(.6, 1.1);
    const gr = bx.createLinearGradient(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L);
    gr.addColorStop(0, rgba(color, al)); gr.addColorStop(.55, rgba(color, al * .35)); gr.addColorStop(1, rgba(color, 0));
    bx.fillStyle = gr; bx.beginPath(); bx.moveTo(x, y);
    bx.lineTo(x + Math.cos(a - w) * L, y + Math.sin(a - w) * L); bx.lineTo(x + Math.cos(a + w) * L, y + Math.sin(a + w) * L); bx.closePath(); bx.fill();
  }
  const hg = bx.createRadialGradient(x, y, 0, x, y, 520); hg.addColorStop(0, rgba(color, .9)); hg.addColorStop(1, rgba(color, 0));
  bx.fillStyle = hg; bx.fillRect(x - 520, y - 520, 1040, 1040);
  g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.globalCompositeOperation = op; g.globalAlpha *= env; g.drawImage(b, 0, 0, W, H); g.restore();
}
// One glint: a four-point star with glow that pings open and shut. { x, y, t0, dur, size, color, rot }
function glint(g, t, o = {}) {
  const { x = W / 2, y = H / 2, t0 = 0, dur = .5, size = 120, color = '#fffbea', rot = 0 } = o;
  const k = (t - t0) / dur; if (k <= 0 || k >= 1) return;
  const s = Math.pow(Math.sin(Math.PI * Math.pow(k, .6)), .8), R = size * s;
  g.save(); g.globalCompositeOperation = 'screen';
  const gr = g.createRadialGradient(x, y, 0, x, y, size * 1.3); gr.addColorStop(0, `rgba(255,240,200,${.7 * s})`); gr.addColorStop(1, 'rgba(255,240,200,0)');
  g.fillStyle = gr; g.fillRect(x - size * 1.3, y - size * 1.3, size * 2.6, size * 2.6);
  g.strokeStyle = `rgba(255,246,220,${.8 * (1 - k)})`; g.lineWidth = 3 * (1 - k) + .5; g.beginPath(); g.arc(x, y, size * .3 + k * size * .9, 0, 7); g.stroke();
  g.globalCompositeOperation = 'source-over'; g.fillStyle = color;
  _fxStar(g, x, y, R, 4, .13, rot + k * .8); g.fill();
  _fxStar(g, x, y, R * .55, 4, .2, rot + k * .8 + Math.PI / 4); g.fill();
  g.restore();
}
// A field of twinkling sparkles in a box (x,y,w,h) or around (x,y) within radius. Twinkle steps on twos.
// { x, y, w, h | radius, count, size [min,max], t0, dur, seed, color, period [min,max] }
function sparkles(g, t, o = {}) {
  const { x = 0, y = 0, w = W, h = H, radius = 0, count = 24, size = [10, 32], t0 = -1e9, dur = 2e9, seed = 'spk', color = '#fffbea', period = [.6, 1.4] } = o;
  if (t < t0 || t > t0 + dur) return;
  const tq = Math.floor(t * BOIL + 1e-6) / BOIL, env = Math.min(1, (t - t0) / .2, (t0 + dur - t) / .3);
  g.save();
  for (let i = 0; i < count; i++) {
    const r = rng(seed + ':' + i);
    let px, py; if (radius) { const a = r() * 6.283, d = Math.sqrt(r()) * radius; px = x + Math.cos(a) * d; py = y + Math.sin(a) * d * .7; } else { px = x + r() * w; py = y + r() * h; }
    const per = r.range(period[0], period[1]), ph = r(), k = ((tq - t0) / per + ph) % 1, s = Math.pow(Math.max(0, Math.sin(Math.PI * k * 1.6)), 2) * env;
    if (s < .03) continue;
    const R = r.range(size[0], size[1]) * s;
    g.globalCompositeOperation = 'screen';
    const gr = g.createRadialGradient(px, py, 0, px, py, R * 2); gr.addColorStop(0, `rgba(255,232,180,${.55 * s})`); gr.addColorStop(1, 'rgba(255,232,180,0)');
    g.fillStyle = gr; g.fillRect(px - R * 2, py - R * 2, R * 4, R * 4);
    g.globalCompositeOperation = 'source-over'; g.fillStyle = color; g.globalAlpha = .95;
    _fxStar(g, px, py, R, 4, .14, r() * .4 - .2); g.fill(); g.globalAlpha = 1;
  }
  g.restore();
}
// Sheen: a diagonal light band sweeping across an image (e.g. a logo layer) at (x,y). { t0, dur, angle, width, alpha }
function sheen(g, t, img, x, y, o = {}) {
  const { t0 = 0, dur = .55, angle = -.5, width = 120, alpha = .75 } = o;
  const k = (t - t0) / dur; if (k <= 0 || k >= 1) return;
  const b = _fxBuf('sheen', img.width, img.height), bx = b.getContext('2d');
  const span = img.width + img.height, cx = lerp(-img.height, img.width + img.height * .2, ease.inOutQ(k));
  bx.save(); bx.translate(cx, img.height / 2); bx.rotate(angle);
  const gr = bx.createLinearGradient(-width, 0, width, 0); gr.addColorStop(0, 'rgba(255,250,232,0)'); gr.addColorStop(.5, `rgba(255,250,232,${alpha})`); gr.addColorStop(1, 'rgba(255,250,232,0)');
  bx.fillStyle = gr; bx.fillRect(-width, -span, width * 2, span * 2);
  bx.fillStyle = `rgba(255,250,232,${alpha * .6})`; bx.fillRect(width * 1.2, -span, width * .18, span * 2);
  bx.restore(); bx.globalCompositeOperation = 'destination-in'; bx.drawImage(img, 0, 0);
  g.save(); g.globalCompositeOperation = 'screen'; g.drawImage(b, x, y); g.restore();
}
// Anime impact starburst (spiky polygon), e.g. behind a slam. { x, y, r, spikes, color, line, seed, boil }
function impactBurst(g, x, y, R, o = {}) {
  const { spikes = 18, color = FX_WHITE, line = null, seed = 'burst', boil = 0, inner = .55, rot = 0 } = o;
  const r = rng(seed + ':' + boil), p = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = rot + i / (spikes * 2) * Math.PI * 2 + r.gauss() * .03, rr = i % 2 ? R * inner * r.range(.85, 1.1) : R * r.range(.75, 1.25);
    p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  g.save(); g.fillStyle = color; tracePoly(g, p); g.fill(); g.restore();
  if (line) inkPoly(g, p, { width: Math.max(2, R * .02), color: line, seed: seed + 'l', boil, wobble: .6 });
}

// ------------------------------------------------------------------------------------------------------------------
// 4. TYPE: painted, inked glyph sprites; kinetic chorus words; subtitles; the Q.E.D. hook
// ------------------------------------------------------------------------------------------------------------------
// Glyph styles. Sizes are fractions of the font px. Layers, bottom to top: offset print shadow → outermost ink line (ow3)
// → sticker border (ow2) → paper interior → misregistered colour fill (textured, watercolour gradient, dry-brush light)
// → ink outline (ow) → wobble (boils on twos between `variants`).
const FX_TYPE = {
  ink:   { font: 'Dela Gothic One', weight: 400, fill: '#fbf1dc', fill2: '#efd3a4', outline: FX_INK, ow: .034, shadow: '#d97757', so: [.06, .055], misreg: [.016, -.012], hl: .55 },
  clay:  { font: 'Dela Gothic One', weight: 400, fill: '#e58a5f', fill2: '#b9573a', outline: FX_INK, ow: .034, shadow: '#4f3343', so: [.06, .055], misreg: [.016, -.012], hl: .45 },
  teal:  { font: 'Dela Gothic One', weight: 400, fill: '#5f8f88', fill2: '#3f6a65', outline: FX_INK, ow: .034, shadow: '#f1e6cc', so: [.06, .055], misreg: [.016, -.012], hl: .35 },
  gold:  { font: 'Dela Gothic One', weight: 400, fill: '#f0c062', fill2: '#c98f2c', outline: FX_INK, ow: .034, shadow: '#b9573a', so: [.06, .055], misreg: [.016, -.012], hl: .5 },
  white: { font: 'Dela Gothic One', weight: 400, fill: '#fffaf0', fill2: '#f3e6cc', outline: FX_INK, ow: .032, shadow: null, so: [0, 0], misreg: [0, 0], hl: 0 },
  serif: { font: 'Fraunces', weight: 900, fill: '#fbf1dc', fill2: '#efd3a4', outline: FX_INK, ow: .045, shadow: '#d97757', so: [.06, .05], misreg: [.014, -.01], hl: .5 },
  // the title logo: clay kanji, ink line, cream sticker border, thin outer ink, plum print shadow
  logo:  { font: 'Dela Gothic One', weight: 400, fill: '#fff6e2', fill2: '#f2c983', outline: FX_INK, ow: .022, ow2: .034, outline2: '#d97757', ow3: .012, shadow: '#4f3343', so: [.045, .06], misreg: [.012, -.01], hl: .3, wob: .5 },
  logoClay: { font: 'Dela Gothic One', weight: 400, fill: '#ea9065', fill2: '#bf5a38', outline: FX_INK, ow: .02, ow2: .032, outline2: '#fbf3e0', ow3: .012, shadow: '#4f3343', so: [.05, .055], misreg: [.012, -.01], hl: .3, wob: .5 },
  logoNo: { font: 'Dela Gothic One', weight: 400, fill: '#fff6e2', fill2: '#f6dcae', outline: FX_INK, ow: .026, ow2: 0, outline2: '#fbf3e0', ow3: 0, shadow: '#4f3343', so: [.05, .055], misreg: [.012, -.01], hl: .4, wob: .5 },
};
const _fxMeasure = _fxCanvas(8, 8).getContext('2d');
function _fxGlyph(ch, px, style = 'ink', variant = 0) {
  const S = typeof style === 'string' ? FX_TYPE[style] : style, sname = typeof style === 'string' ? style : (S.name || 'custom');
  px = Math.round(px);
  const f = `${S.weight} ${px}px "${S.font}"`; _fxMeasure.font = f;
  const m = _fxMeasure.measureText(ch), adv = m.width;
  const ow = px * S.ow, ow2 = px * (S.ow2 || 0), ow3 = px * (S.ow3 || 0), sox = px * S.so[0], soy = px * S.so[1];
  const pad = Math.ceil(ow + ow2 + ow3 + Math.max(sox, soy) + px * .06);
  const asc = Math.max(m.actualBoundingBoxAscent, px * .1), desc = Math.max(0, m.actualBoundingBoxDescent), left = m.actualBoundingBoxLeft, right = m.actualBoundingBoxRight;
  const cw = Math.ceil(left + right + pad * 2), chh = Math.ceil(asc + desc + pad * 2), bx = pad + left, by = pad + asc;
  const c = cached(`fxgl:${sname}:${ch}:${px}:${variant}`, cw, chh, gg => {
    const L = (draw) => { const c2 = _fxCanvas(cw, chh), x2 = c2.getContext('2d'); x2.font = f; x2.textBaseline = 'alphabetic'; x2.textAlign = 'left'; x2.lineJoin = 'round'; x2.miterLimit = 2; draw(x2); return c2; };
    const rv = rng('glyph' + ch + px + sname);
    if (S.shadow) {
      const sh = L(x => { x.fillStyle = x.strokeStyle = S.shadow; x.lineWidth = (ow + ow2 + ow3) * 2; x.strokeText(ch, bx + sox, by + soy); x.fillText(ch, bx + sox, by + soy); });
      _fxTexturize(sh, .4, rv() * 900, rv() * 900); _fxErode(sh, 'fine', .18, ch + 's'); gg.drawImage(sh, 0, 0);
    }
    if (ow3 > 0) gg.drawImage(L(x => { x.strokeStyle = S.outline; x.lineWidth = (ow + ow2 + ow3) * 2; x.strokeText(ch, bx, by); }), 0, 0);
    if (ow2 > 0) { const o2 = L(x => { x.strokeStyle = x.fillStyle = S.outline2; x.lineWidth = (ow + ow2) * 2; x.strokeText(ch, bx, by); x.fillText(ch, bx, by); }); _fxTexturize(o2, .18, rv() * 900, rv() * 900); gg.drawImage(o2, 0, 0); }
    gg.drawImage(L(x => { x.fillStyle = FX_PAPERIN; x.fillText(ch, bx, by); }), 0, 0);
    const mx = px * S.misreg[0], my = px * S.misreg[1];
    const fl = L(x => {
      x.fillText(ch, bx + mx, by + my); x.globalCompositeOperation = 'source-atop';
      const gr = x.createLinearGradient(0, by - asc, 0, by + desc); gr.addColorStop(0, S.fill); gr.addColorStop(.55, S.fill); gr.addColorStop(1, S.fill2);
      x.fillStyle = gr; x.fillRect(0, 0, cw, chh);
      const rr = rng('bloom' + ch + sname);
      for (let i = 0; i < 4; i++) { // watercolour blooms (backruns)
        const bxx = rr() * cw, byy = by - asc + rr() * (asc + desc), R = px * rr.range(.15, .4), lighter = rr() < .5;
        const bg = x.createRadialGradient(bxx, byy, 0, bxx, byy, R);
        const bc = lighter ? mix(S.fill, '#ffffff', .35) : S.fill2;
        bg.addColorStop(0, rgba(bc, .28)); bg.addColorStop(.7, rgba(bc, .12)); bg.addColorStop(1, rgba(bc, 0));
        x.fillStyle = bg; x.fillRect(bxx - R, byy - R, 2 * R, 2 * R);
      }
      if (S.hl > 0) { // soft light from the upper left, like a lifted wash
        const lg2 = x.createLinearGradient(bx, by - asc, bx + px * .4, by - asc * .3);
        lg2.addColorStop(0, `rgba(255,250,236,${S.hl * .6})`); lg2.addColorStop(1, 'rgba(255,250,236,0)');
        x.fillStyle = lg2; x.fillRect(0, 0, cw, chh);
      }
    });
    _fxTexturize(fl, .42, rv() * 900, rv() * 900); gg.drawImage(fl, 0, 0);
    const ol = L(x => { x.strokeStyle = S.outline; x.lineWidth = ow * 2; x.strokeText(ch, bx, by); });
    _fxErode(ol, 'fine', .14, ch + 'o' + variant); gg.drawImage(ol, 0, 0);
    if (S.wob !== 0) {
      const wob = _fxWobble(gg.canvas, px * .006 * (S.wob ?? 1) + .6, px * .22, 'wob' + ch + px + variant);
      gg.clearRect(0, 0, cw, chh); gg.drawImage(wob, 0, 0);
    }
  });
  return { c, ox: bx, oy: by, adv, asc, desc };
}
// draw a glyph with its baseline-left at (0,0) in the current transform
function _fxDrawGlyph(g, gl) { g.drawImage(gl.c, -gl.ox, -gl.oy); }
// width of a string set in glyph style at px with tracking (fraction of px)
function _fxTextW(s, px, style = 'ink', track = 0) {
  const S = typeof style === 'string' ? FX_TYPE[style] : style; _fxMeasure.font = `${S.weight} ${Math.round(px)}px "${S.font}"`;
  let w = 0; for (const ch of s) w += _fxMeasure.measureText(ch).width + px * track; return w - px * track;
}
// Set a line of painted glyphs (static), centred at (x, y baseline). Returns width.
function paintedText(g, t, s, x, y, px, style = 'ink', o = {}) {
  const { track = 0, align = 'center', boil = true, rot = 0, seed = s } = o;
  const w = _fxTextW(s, px, style, track), r = rng('pt' + seed);
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const v = boil ? boilFrame(t) % 3 : 0;
  _fxMeasure.font = `${(FX_TYPE[style] || style).weight} ${Math.round(px)}px "${(FX_TYPE[style] || style).font}"`;
  for (const ch of s) {
    const adv = _fxMeasure.measureText(ch).width;
    if (ch !== ' ') { const gl = _fxGlyph(ch, px, style, v); g.save(); g.translate(cx, y + (r() - .5) * rot * px); g.rotate((r() - .5) * rot); _fxDrawGlyph(g, gl); g.restore(); }
    cx += adv + px * track;
  }
  return w;
}

// Painted brush band (a swash of gouache behind a line of type). Cached per size/colour.
function _fxBrushBand(w, h, color, seed = 'band') {
  w = Math.round(w); h = Math.round(h);
  return cached(`fxband:${w}:${h}:${color}:${seed}`, w + 80, h + 40, gg => {
    const r = rng(seed), cx = 40, cy = 20;
    const N = makeNoise(seed + 'n'), body = [], n = 40;
    for (let i = 0; i <= n; i++) { const x = cx + w * .04 + i / n * w * .9; body.push([x, cy + h * (.06 + .1 * N(i * .3, 1)) - h * .04 * Math.sin(i / n * Math.PI)]); }
    for (let k = 0; k <= 14; k++) { const y = cy + h * (.08 + .84 * k / 14); body.push([cx + w * (.94 + .06 * (k % 2 ? r() : r() * .4)), y]); }   // ragged bristle end
    for (let i = n; i >= 0; i--) { const x = cx + w * .04 + i / n * w * .9; body.push([x, cy + h * (.94 - .1 * N(i * .3, 5)) + h * .03 * Math.sin(i / n * Math.PI)]); }
    for (let k = 0; k <= 8; k++) { const a = Math.PI / 2 + k / 8 * Math.PI; body.push([cx + w * .04 + Math.cos(a) * w * .035, cy + h / 2 + Math.sin(a) * h * .44]); }
    gg.fillStyle = color; tracePoly(gg, body); gg.fill();
    gg.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < 60; i++) { // bristle streaks: darker and lighter
      const y = cy + r() * h, x0 = cx + r() * w * .3, L = r.range(w * .4, w);
      gg.strokeStyle = r() < .5 ? rgba(mix(color, '#2a1408', .35), r.range(.08, .25)) : rgba(mix(color, '#fff4dc', .4), r.range(.08, .3));
      gg.lineWidth = r.range(1, 5); gg.beginPath(); gg.moveTo(x0, y); gg.lineTo(x0 + L, y + r.gauss() * 4); gg.stroke();
    }
    gg.globalCompositeOperation = 'source-over';
    const c = gg.canvas; _fxTexturize(c, .35, r() * 900, r() * 900);
    // dry-brush gaps at the trailing end
    gg.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 40; i++) { const y = cy + r() * h, x0 = cx + w * r.range(.6, 1); gg.lineWidth = r.range(1, 4); gg.strokeStyle = `rgba(0,0,0,${r.range(.4, 1)})`; gg.beginPath(); gg.moveTo(x0, y); gg.lineTo(cx + w + 40, y + r.gauss() * 3); gg.stroke(); }
  });
}

// Kinetic chorus typography.
//   kineticWords(g, t, ['WIR', 'MÜSSEN', 'WISSEN'], [b0, b1, b2], { english: { text: 'we must know', at: b3 } })
// words: strings or { text, type, scale, ruby }; beats: one time per word (unit 'word': its letters slam in `stagger` s
// apart starting on the beat) or one per letter (unit 'letter').
// style: { type ('ink'|'clay'|'teal'|'gold'|'white'|'serif' or per-word), size (max px), maxW, x, y, layout 'stack'|'line'|'replace',
//          lineGap, stagger, track, rot (letter tilt), jitter (baseline), out (exit time), band (colour or array per line),
//          burst (impact starburst colour or null), ruby (true to show per-word katakana), english { text, at, color, size, dy },
//          seed }
function kineticWords(g, t, words, beats, style = {}) {
  const S = { type: 'ink', size: 270, maxW: 1680, x: W / 2, y: H / 2, layout: 'stack', lineGap: 1.06, stagger: 1.5 / 24, track: .02,
    rot: .09, jitter: .07, out: null, band: null, burst: FX_WHITE, ruby: true, english: null, seed: 'kw', unit: 'word', ...style };
  const ws = words.map((w, i) => typeof w === 'string' ? { text: w } : w);
  const types = ws.map((w, i) => w.type || (Array.isArray(S.type) ? S.type[i % S.type.length] : S.type));
  // per-word size and letter times
  let li = 0;
  const lines = ws.map((w, i) => {
    let px = S.size * (w.scale || 1);
    const wid = _fxTextW(w.text, px, types[i], S.track);
    const lim = S.layout === 'line' ? Infinity : S.maxW; if (wid > lim) px *= lim / wid;
    const letters = [...w.text].map((ch, k) => ({ ch, tl: S.unit === 'letter' ? beats[li++] : beats[i] + k * S.stagger }));
    return { ...w, px, type: types[i], width: _fxTextW(w.text, px, types[i], S.track), letters, beat: S.unit === 'letter' ? letters[0].tl : beats[i] };
  });
  // layout → baseline positions
  if (S.layout === 'line') {
    const gap = .35, tot = lines.reduce((s, l) => s + l.width, 0) + gap * lines[0].px * (lines.length - 1), k = Math.min(1, S.maxW / tot);
    let x = S.x - tot * k / 2;
    lines.forEach(l => { l.px *= k; l.width *= k; l.x0 = x; l.y = S.y + l.px * .36; x += l.width + gap * l.px; });
  } else if (S.layout === 'replace') {
    lines.forEach(l => { l.x0 = S.x - l.width / 2; l.y = S.y + l.px * .36; });
  } else {
    const tot = lines.reduce((s, l) => s + l.px * S.lineGap, 0);
    let y = S.y - tot / 2;
    lines.forEach(l => { y += l.px * S.lineGap; l.y = y - l.px * .14; l.x0 = S.x - l.width / 2; });
  }
  const bf = boilFrame(t), v = bf % 3, PRE = 3 / 24;
  for (const pass of [0, 1]) lines.forEach((l, i) => {
    if (S.layout === 'replace') { const next = lines[i + 1]; if (next && t >= next.beat - 1 / 24) return; }
    if (t < l.beat - PRE - 2 / 24) return;
    const r = rng(S.seed + ':' + i + l.text);
    const exitK = S.out != null ? clamp((t - S.out - i * .04) / .22) : 0;
    if (exitK >= 1) return;
    // painted band swiped in just ahead of the word
    const band = Array.isArray(S.band) ? S.band[i % S.band.length] : S.band;
    if (pass === 0 && band) {
      const bw = l.width + l.px * .9, bh = l.px * 1.08, img = _fxBrushBand(bw, bh, band, S.seed + 'b' + i);
      const k = ease.outC(clamp((t - (l.beat - PRE - 2 / 24)) / (PRE + 1 / 24)));
      g.save(); g.globalAlpha *= 1 - exitK; g.translate(l.x0 + l.width / 2, l.y - l.px * .36); g.rotate((r() - .5) * .06);
      g.beginPath(); g.rect(-img.width / 2, -img.height, img.width * k, img.height * 2); g.clip();
      g.drawImage(img, -img.width / 2, -img.height / 2); g.restore();
    }
    // impact starburst behind the word for two frames
    const fi = fxFrame(t - l.beat);
    if (pass === 0 && S.burst && fi >= 0 && fi < 3) {
      g.save(); g.globalAlpha *= fi === 2 ? .45 : 1;
      impactBurst(g, S.x + (r() - .5) * 80, l.y - l.px * .36, Math.min(560, Math.max(l.width * .42, l.px * .8)) * (1 + fi * .12), { color: S.burst, seed: S.seed + 'bu' + i, boil: fi, spikes: 22 });
      g.restore();
    }
    if (pass === 0) return;
    // ruby (katakana reading) above the word
    if (S.ruby && l.ruby) {
      const k = clamp((t - l.beat - .08) / .15);
      if (k > 0) {
        g.save(); g.globalAlpha *= k * (1 - exitK); g.font = font(Math.round(l.px * .16), 'Zen Maru Gothic', 900); g.textAlign = 'center';
        g.letterSpacing = Math.round(l.px * .05) + 'px';
        g.lineJoin = 'round'; g.strokeStyle = FX_INK; g.lineWidth = l.px * .035; g.strokeText(l.ruby, S.x, l.y - l.px * .86 + (1 - k) * 10);
        g.fillStyle = PAL.cream; g.fillText(l.ruby, S.x, l.y - l.px * .86 + (1 - k) * 10); g.restore();
      }
    }
    // letters
    let x = l.x0; _fxMeasure.font = `${FX_TYPE[l.type].weight} ${Math.round(l.px)}px "${FX_TYPE[l.type].font}"`;
    const advs = l.letters.map(L => _fxMeasure.measureText(L.ch).width);
    l.letters.forEach((L, k) => {
      const adv = advs[k], cxl = x + adv / 2; x += adv + l.px * S.track;
      if (L.ch === ' ') return;
      const rr = rng(S.seed + ':' + i + ':' + k), rot0 = (rr() - .5) * 2 * S.rot, dy = (rr() - .5) * 2 * S.jitter * l.px, sv = 1 + (rr() - .5) * .1;
      const a = t - L.tl; if (a < -PRE) return;
      let sx = 1, sy = 1, rot = rot0, al = 1, ox = 0, oy = 0;
      const gl = _fxGlyph(L.ch, l.px * sv, l.type, v);
      if (a < 0) { // incoming: from huge and tilted, smearing
        const q = (a + PRE) / PRE; sx = sy = lerp(1.9, 1, ease.inQ(q)); al = .55 + .45 * q; rot = rot0 + (1 - q) * .25 * (rr() < .5 ? -1 : 1);
        for (let gh = 1; gh <= 1; gh++) { // smear ghost
          g.save(); g.globalAlpha *= .14 * al; g.translate(cxl, l.y + dy - l.px * .36); g.rotate(rot); g.scale(sx * (1 + gh * .3), sy * (1 + gh * .3)); g.translate(-adv / 2, l.px * .36); _fxDrawGlyph(g, gl); g.restore();
        }
      } else {
        const f = fxFrame(a);
        if (f === 0) { sx = 1.16; sy = .84; } else if (f === 1) { sx = .95; sy = 1.07; }
        else { const d = Math.exp(-a * 7) * Math.cos(a * 34) * .035; sx = 1 + d; sy = 1 - d; }
        oy = f < 2 ? l.px * .03 : 0;
      }
      if (exitK > 0) { const q = clamp((t - S.out - i * .04 - k * .02) / .2); sx *= 1 + q * 1.4; sy *= 1 + q * 1.4; al *= 1 - q; rot += q * .4 * (rr() - .5); }
      g.save(); g.globalAlpha *= al; g.translate(cxl + ox, l.y + dy + oy - l.px * .36); g.rotate(rot); g.scale(sx, sy); g.translate(-adv / 2, l.px * .36); _fxDrawGlyph(g, gl); g.restore();
    });
  });
  // English translation, scribbled in the memo hand, with an underline swash drawn on
  if (S.english && t >= S.english.at) {
    const E = { color: PAL.teal, outline: PAL.cream, size: 104, dy: null, rot: -.05, ...S.english };
    const last = lines[lines.length - 1], ey = E.y ?? (E.dy != null ? S.y + E.dy : last.y + E.size * .95);
    const a = t - E.at, k = clamp(a / .35), exitK = S.out != null ? clamp((t - S.out) / .2) : 0;
    g.save(); g.globalAlpha *= 1 - exitK; g.translate(E.x ?? S.x, ey); g.rotate(E.rot);
    g.font = font(E.size, 'Caveat', 700); g.textAlign = 'center';
    const tw_ = g.measureText(E.text).width;
    g.save(); g.beginPath(); g.rect(-tw_ / 2 - 40, -E.size, (tw_ + 80) * k, E.size * 2); g.clip();
    g.lineJoin = 'round'; g.strokeStyle = E.outline; g.lineWidth = E.size * .14; g.strokeText(E.text, 0, 0);
    g.fillStyle = E.color; g.fillText(E.text, 0, 0); g.restore();
    const uk = clamp((a - .2) / .3);
    if (uk > 0) {
      const pts = bez([-tw_ * .5, E.size * .18], [-tw_ * .1, E.size * .32], [tw_ * .25, E.size * .1], [tw_ * .55, E.size * .2], 30);
      const n = Math.max(2, Math.round(pts.length * uk));
      inkPath(g, pts.slice(0, n), { width: E.size * .07, color: E.outline, seed: 'eu', boil: bf, wobble: .8 });
      inkPath(g, pts.slice(0, n), { width: E.size * .045, color: E.color, seed: 'eu', boil: bf, wobble: .8 });
    }
    g.restore();
  }
}

// Anime-style lyric subtitles, bottom-centre, per-line fade. lines: [{ t0, t1, text, sub? (smaller second line) }]
// { y, size, color, outline, fade, font }
function lyricSub(g, t, lines, o = {}) {
  const { y = H - 74, size = 48, color = '#fff8ea', outline = 'rgba(52,32,22,.85)', fade = .22, fam = 'EB Garamond', style = 'italic', weight = 500 } = o;
  for (const L of lines) {
    if (t < L.t0 - fade || t > L.t1 + fade) continue;
    const k = Math.min(clamp((t - L.t0 + fade) / fade), clamp((L.t1 + fade - t) / fade));
    const yy = y + (1 - ease.outC(clamp((t - L.t0 + fade) / fade))) * 8;
    g.save(); g.globalAlpha *= k; g.textAlign = 'center'; g.lineJoin = 'round';
    g.font = font(size, fam, weight, style);
    g.shadowColor = 'rgba(40,22,12,.45)'; g.shadowBlur = 10; g.shadowOffsetY = 2;
    g.strokeStyle = outline; g.lineWidth = size * .14; g.strokeText(L.text, W / 2, yy);
    g.shadowColor = 'transparent'; g.fillStyle = color; g.fillText(L.text, W / 2, yy);
    if (L.sub) {
      g.font = font(Math.round(size * .6), fam, weight, 'normal'); g.letterSpacing = '2px';
      g.strokeStyle = outline; g.lineWidth = size * .1; g.strokeText(L.sub, W / 2, yy - size * 1.05);
      g.fillStyle = 'rgba(255,240,215,.92)'; g.fillText(L.sub, W / 2, yy - size * 1.05);
    }
    g.restore();
  }
}

// Q.E.D. stamp sprite (rubber stamp: double border, eroded ink).
function _fxStamp(text, color, note) {
  return cached('fxstamp:' + text + color + (note || ''), 900, 420, gg => {
    const r = rng('stamp' + text), cx = 450, cy = 210, w = 760, h = 300;
    gg.fillStyle = gg.strokeStyle = color; gg.lineJoin = 'round';
    const rr = (x, y, w, h, rad) => { gg.beginPath(); gg.roundRect(x, y, w, h, rad); };
    gg.lineWidth = 18; rr(cx - w / 2, cy - h / 2, w, h, 36); gg.stroke();
    gg.lineWidth = 6; rr(cx - w / 2 + 26, cy - h / 2 + 26, w - 52, h - 52, 20); gg.stroke();
    gg.font = font(170, 'Fraunces', 900); gg.textAlign = 'center'; gg.textBaseline = 'alphabetic'; gg.letterSpacing = '10px';
    gg.fillText(text, cx + 4, note ? cy + 46 : cy + 62);
    if (note) { gg.font = font(44, 'Fraunces', 700, 'italic'); gg.letterSpacing = '1px'; gg.fillText(note, cx, cy + 122); }
    const c = gg.canvas;
    _fxErode(c, 'blotch', .35, text + 'b'); _fxErode(c, 'stamp', .7, text + 's');
    // ink pools heavier at the edges of shapes: a faint darker pass
    gg.globalCompositeOperation = 'source-atop'; gg.fillStyle = 'rgba(80,10,10,.18)';
    for (let i = 0; i < 8; i++) { gg.beginPath(); gg.arc(r() * 900, r() * 420, r.range(60, 160), 0, 7); gg.fill(); }
  });
}
// The Q.E.D.! hook: a giant red stamp slams down (3-frame drop, squash, splatter, shock ring, burst), then stays.
// { t0, x, y, size=1, rot, text='Q.E.D.', color, note (small referee's note, e.g. for 'Q.E.D.?'), out, seed, burst }
function qedHook(g, t, o = {}) {
  const { t0 = 0, x = W / 2, y = H / 2, size = 1, rot = -.12, text = 'Q.E.D.', color = '#c4383a', note = null, out = null, seed = 'qed', burst = PAL.gold } = o;
  const a = t - t0, PRE = 3 / 24; if (a < -PRE) return;
  const exitK = out != null ? clamp((t - out) / .25) : 0; if (exitK >= 1) return;
  const spr = _fxStamp(text, color, note), f = fxFrame(a), r = rng(seed);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(size, size);
  if (a >= 0 && f < 4 && burst) { g.save(); g.globalAlpha *= f === 3 ? .4 : 1; impactBurst(g, 0, 0, 560 + f * 40, { color: burst, seed: seed + 'b', boil: f, spikes: 26, inner: .62 }); impactBurst(g, 0, 0, 470 + f * 40, { color: FX_WHITE, seed: seed + 'w', boil: f, spikes: 26, inner: .66 }); g.restore(); }
  let sc = 1, al = 1, sx = 1, sy = 1;
  if (a < 0) { const q = (a + PRE) / PRE; sc = lerp(2.4, 1, ease.inQ(q)); al = q; }
  else if (f === 0) { sx = 1.07; sy = .93; } else if (f === 1) { sx = .98; sy = 1.02; }
  if (a < 0) { g.save(); g.globalAlpha *= .25 * al; g.translate(30, 40); g.scale(sc * 1.05, sc * 1.05); g.drawImage(spr, -450, -210); g.restore(); }
  g.save(); g.globalAlpha *= al * (1 - exitK); g.scale(sc * sx * (1 + exitK * .3), sc * sy * (1 + exitK * .3)); g.drawImage(spr, -450, -210); g.restore();
  if (a >= 0 && a < .5) { // splatter and shock ring
    const k = a / .5;
    g.strokeStyle = rgba(color, .5 * (1 - k)); g.lineWidth = 10 * (1 - k) + 1; g.beginPath(); g.ellipse(0, 0, 420 + k * 300, 200 + k * 160, 0, 0, 7); g.stroke();
    g.fillStyle = color;
    for (let i = 0; i < 26; i++) {
      const ang = r() * 6.283, sp = r.range(300, 900), d = sp * (1 - Math.exp(-6 * a)) / 6 + 330, s = r.range(4, 16) * (1 - k * .7);
      g.globalAlpha = (1 - k) * .9; g.beginPath(); g.ellipse(Math.cos(ang) * d * 1.2, Math.sin(ang) * d * .7, s * 1.4, s, ang, 0, 7); g.fill();
    }
  }
  g.restore();
}

// ------------------------------------------------------------------------------------------------------------------
// 5. THE TITLE LOGO — 無限の問題集 / PROBLEM SET ∞, with a sunflower-infinity emblem
// ------------------------------------------------------------------------------------------------------------------
// Emblem: a lemniscate whose two eyes are sunflower heads (golden-angle seed discs), rimmed with petals; Claude's
// eight-point spark at the crossing.
const FX_LOGO = { a: 400, ribbon: 50, kanji: 250 };
function _fxLemn(s, a = FX_LOGO.a) { const sn = Math.sin(s), cs = Math.cos(s), d = 1 + sn * sn; return [a * cs / d, a * sn * cs / d * 1.08]; }
function _fxLogoEmblem() {
  return cached('fxlogo:emblem', 1300, 700, gg => {
    const cx = 650, cy = 350, a = FX_LOGO.a, rw = FX_LOGO.ribbon;
    gg.translate(cx, cy);
    // seed discs in each eye: clip to the loop interior
    for (const sgn of [-1, 1]) {
      const loop = []; for (let i = 0; i <= 80; i++) { const s = sgn > 0 ? lerp(-Math.PI / 2, Math.PI / 2, i / 80) : lerp(Math.PI / 2, Math.PI * 1.5, i / 80); loop.push(_fxLemn(s)); }
      gg.save(); tracePoly(gg, loop); gg.clip();
      const ex = sgn * a * .56;
      const rg = gg.createRadialGradient(ex, -10, 10, ex, 0, a * .5); rg.addColorStop(0, '#7a4a24'); rg.addColorStop(.7, '#5a3418'); rg.addColorStop(1, '#3e2210');
      gg.fillStyle = rg; gg.fillRect(-a * 1.2, -a, a * 2.4, a * 2);
      // golden-angle phyllotaxis
      const GA = Math.PI * (3 - Math.sqrt(5)), r = rng('seeds' + sgn);
      for (let i = 1; i < 520; i++) {
        const rr = 9.2 * Math.sqrt(i), th = i * GA, px = ex + Math.cos(th) * rr, py = Math.sin(th) * rr * .92;
        const k = rr / 190, sz = 3.2 + k * 3.5;
        gg.fillStyle = k > .78 ? mix('#d9973a', '#f2c45a', r()) : k > .62 ? mix('#8a5420', '#b77a30', r()) : mix('#2e1808', '#6a3e1c', r() * .8 + k * .4);
        gg.beginPath(); gg.ellipse(px, py, sz, sz * .78, th, 0, 7); gg.fill();
        if (k < .8) { gg.fillStyle = 'rgba(255,220,160,.18)'; gg.beginPath(); gg.arc(px - sz * .3, py - sz * .3, sz * .35, 0, 7); gg.fill(); }
      }
      const hg = gg.createRadialGradient(ex - 40, -50, 0, ex - 40, -50, 160); hg.addColorStop(0, 'rgba(255,214,150,.35)'); hg.addColorStop(1, 'rgba(255,214,150,0)');
      gg.fillStyle = hg; gg.fillRect(-a * 1.2, -a, a * 2.4, a * 2);
      gg.restore();
    }
    // the ribbon: thick clay stroke, the far strand first, with an over-under gap at the crossing
    const strand = (s0, s1) => { const p = []; for (let i = 0; i <= 90; i++) p.push(_fxLemn(lerp(s0, s1, i / 90))); return p; };
    const stroke = (p, w, col) => { gg.strokeStyle = col; gg.lineWidth = w; gg.lineCap = 'round'; gg.lineJoin = 'round'; gg.beginPath(); gg.moveTo(p[0][0], p[0][1]); for (const q of p) gg.lineTo(q[0], q[1]); gg.stroke(); };
    const lay = (p, seed) => {
      stroke(p, rw + 16, FX_INK);
      stroke(p, rw, '#d97757');
      gg.save(); gg.translate(0, -rw * .16); stroke(p, rw * .34, 'rgba(255,214,170,.55)'); gg.restore();
      gg.save(); gg.translate(0, rw * .22); stroke(p, rw * .22, 'rgba(140,50,25,.45)'); gg.restore();
    };
    lay(strand(0, Math.PI * 2), 'a');                                   // the whole loop
    gg.save(); gg.lineCap = 'butt';
    const over = strand(Math.PI / 2 - .32, Math.PI / 2 + .32);           // re-lay one pass on top: over-under at the crossing
    const strokeB = (p, w, col) => { gg.strokeStyle = col; gg.lineWidth = w; gg.lineCap = 'butt'; gg.beginPath(); gg.moveTo(p[0][0], p[0][1]); for (const q of p) gg.lineTo(q[0], q[1]); gg.stroke(); };
    strokeB(over, rw + 16, FX_INK); strokeB(over, rw, '#d97757');
    gg.save(); gg.translate(0, -rw * .16); strokeB(over, rw * .34, 'rgba(255,214,170,.55)'); gg.restore();
    gg.save(); gg.translate(0, rw * .22); strokeB(over, rw * .22, 'rgba(140,50,25,.45)'); gg.restore();
    gg.restore();
    _fxTexturize(gg.canvas, .3, 300, 200);
  });
}
// petals of the emblem: positions along each loop's outer side, radiating outward
function _fxLogoPetals() {
  const out = [], a = FX_LOGO.a;
  for (const ring of [0, 1]) for (const sgn of [-1, 1]) {
    const n = ring ? 26 : 30;
    for (let i = 0; i < n; i++) {
      const u = (i + (ring ? .5 : 0)) / n, s = (sgn > 0 ? -Math.PI * .36 : Math.PI * .64) + u * Math.PI * .72;
      const p = _fxLemn(s), ex = sgn * a * .56, dl = Math.hypot(p[0] - ex, p[1]) || 1, nx = (p[0] - ex) / dl, ny = p[1] / dl;
      const r = rng('lp' + ring + sgn + i), ang = Math.atan2(ny, nx) + r.gauss() * .05;
      const L = (ring ? 160 : 128) * r.range(.88, 1.12);
      out.push({ x: p[0] + nx * (FX_LOGO.ribbon * .3), y: p[1] + ny * (FX_LOGO.ribbon * .3), ang, L, ring, v: ring ? (i % 2 ? 6 : 3) : [0, 4, 2, 7][i % 4], order: Math.abs(u - .5) * 2, sgn });
    }
  }
  return out;
}
function _fxLogoBanner() {
  return cached('fxlogo:banner', 1180, 190, gg => {
    const cx = 590, cy = 95, w = 900, h = 96;
    // tails folded behind
    for (const s of [-1, 1]) {
      const tx = cx + s * (w / 2 - 20), tail = [[tx, cy - h / 2 + 18], [tx + s * 150, cy - h / 2 + 18], [tx + s * 110, cy + 9 + 9], [tx + s * 150, cy + h / 2 + 18], [tx, cy + h / 2 + 18]];
      gg.fillStyle = '#3f6a65'; tracePoly(gg, tail); gg.fill();
      gg.fillStyle = '#2b4a46'; gg.beginPath(); gg.moveTo(tx, cy + h / 2); gg.lineTo(tx, cy + h / 2 + 18); gg.lineTo(tx + s * -40, cy + h / 2); gg.closePath(); gg.fill();
      inkPoly(gg, tail, { width: 5, color: FX_INK, seed: 'bt' + s, wobble: .6 });
    }
    const body = [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]];
    const bend = body.map(([x, y]) => [x, y + Math.pow((x - cx) / (w / 2), 2) * -6]);
    gg.fillStyle = '#4f7d78'; tracePoly(gg, bend); gg.fill();
    gg.save(); tracePoly(gg, bend); gg.clip(); gg.fillStyle = 'rgba(255,240,210,.18)'; gg.fillRect(cx - w / 2, cy - h / 2, w, h * .3); gg.fillStyle = 'rgba(20,40,38,.25)'; gg.fillRect(cx - w / 2, cy + h * .22, w, h * .3); gg.restore();
    _fxTexturize(gg.canvas, .35, 100, 100);
    inkPoly(gg, bend, { width: 6, color: FX_INK, seed: 'bb', wobble: .7 });
    gg.strokeStyle = 'rgba(251,243,224,.65)'; gg.lineWidth = 2; gg.setLineDash([10, 8]); gg.strokeRect(cx - w / 2 + 12, cy - h / 2 + 11, w - 24, h - 22); gg.setLineDash([]);
    // PROBLEM SET ∞
    gg.font = font(70, 'Fraunces', 900); gg.letterSpacing = '14px'; gg.textAlign = 'center'; gg.textBaseline = 'alphabetic';
    const txt = 'PROBLEM SET', tw_ = gg.measureText(txt).width, inf = 100, tot = tw_ + inf + 14, x0 = cx - tot / 2;
    gg.textAlign = 'left';
    gg.fillStyle = 'rgba(30,20,14,.45)'; gg.fillText(txt, x0 + 4, cy + 26);
    gg.fillStyle = '#fbf3e0'; gg.fillText(txt, x0, cy + 22);
    gg.letterSpacing = '0px'; gg.font = font(96, 'Dela Gothic One', 400);
    gg.lineWidth = 9; gg.lineJoin = 'round'; gg.strokeStyle = FX_INK; gg.strokeText('∞', x0 + tw_ + 22, cy + 32);
    gg.fillStyle = '#f0c062'; gg.fillText('∞', x0 + tw_ + 22, cy + 32);
  });
}
const FX_LOGO_CHARS = [
  { ch: '無', s: 1.0, rot: -.07, dy: -14 }, { ch: '限', s: .98, rot: .05, dy: 6 },
  { ch: 'の', s: .56, rot: -.04, dy: 30, style: 'logoNo', disc: true },
  { ch: '問', s: 1.0, rot: -.04, dy: -8 }, { ch: '題', s: 1.04, rot: .05, dy: 10 }, { ch: '集', s: 1.0, rot: -.06, dy: -10 },
];
function _fxLogoLayout() {
  const px = FX_LOGO.kanji, track = -.04; let tot = 0;
  const L = FX_LOGO_CHARS.map(c => { const S = FX_TYPE[c.style || 'logo']; _fxMeasure.font = `${S.weight} ${Math.round(px * c.s)}px "${S.font}"`; const adv = _fxMeasure.measureText(c.ch).width; tot += adv + px * track; return { ...c, adv, px: px * c.s }; });
  tot -= px * track; let x = -tot / 2;
  L.forEach(c => { c.x = x + c.adv / 2; x += c.adv + px * track; });
  return L;
}
// Static logo at age `a` seconds after its drop (a large = settled). Drawn centred at (0,0) in the current transform.
// parts: emblem petals unfurl, seed discs + ribbon, kanji (slam per charTimes), banner (unrolls), spark (pops).
function _fxLogoDraw(g, t, a, o = {}) {
  const charA = o.charTimes || null, layout = _fxLogoLayout(), bf = boilFrame(t), v = bf % 3;
  const ka = a; a = a - (charA ? Math.max(...charA) : 0);   // emblem, banner and spark bloom after the last kanji
  const emY = -175, kY = 90, bY = 270;
  // emblem
  const ek = clamp(a / .28);
  if (ek > 0) {
    const gr = g.createRadialGradient(0, emY + 60, 50, 0, emY + 60, 820);
    gr.addColorStop(0, `rgba(255,236,200,${.55 * ek})`); gr.addColorStop(1, 'rgba(255,236,200,0)');
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = gr; g.fillRect(-900, emY - 760, 1800, 1640); g.restore();
    const pts = _fxLogoPetals().sort((p, q) => p.ring - q.ring ? q.ring - p.ring : 0);
    g.save(); g.translate(0, emY);
    for (const p of pts) {
      const k = tw(a, .02 + p.order * .32 + p.ring * .06, .32, ease.outBack); if (k <= 0) continue;
      const sway = .035 * Math.sin(t * 1.3 + p.x * .01) + .02 * Math.sin(t * 2.1 + p.y * .02);
      const ang = p.ang + sway, L = p.L * k;
      fxPetal(g, p.x + Math.cos(ang) * L * .5, p.y + Math.sin(ang) * L * .5, L, ang, p.ring ? .5 : .15, 0, p.v, 0, 1);
    }
    const s = .7 + .3 * ease.outBack(ek), img = _fxLogoEmblem();
    g.save(); g.globalAlpha *= clamp(ek * 2); g.scale(s, s); g.drawImage(img, -650, -350); g.restore();
    g.restore();
  }
  // banner: unrolls from the centre
  const bk = ease.outC(clamp((a - .22) / .3));
  if (bk > 0) {
    const img = _fxLogoBanner(), w = img.width * bk;
    g.save(); g.beginPath(); g.rect(-w / 2, bY - 120, w, 240); g.clip(); g.drawImage(img, -img.width / 2, bY - img.height / 2); g.restore();
  }
  // kanji
  layout.forEach((c, i) => {
    const ta = charA ? ka - charA[i] : ka, PRE = 2 / 24;
    if (ta < -PRE) return;
    const gl = _fxGlyph(c.ch, c.px, c.style || 'logo', v);
    let sc = 1, al = 1;
    if (ta < 0) { sc = lerp(2.2, 1, (ta + PRE) / PRE); al = .5; }
    else { const f = fxFrame(ta); sc = f === 0 ? 1.18 : f === 1 ? .96 : 1 + .03 * Math.exp(-ta * 6) * Math.cos(ta * 26); }
    const breathe = 1 + .006 * Math.sin(t * 2.2 + i * 1.1);
    g.save(); g.globalAlpha *= al; g.translate(c.x, kY + c.dy - c.px * .36); g.rotate(c.rot + .01 * Math.sin(t * 1.7 + i)); g.scale(sc * breathe, sc * breathe);
    if (c.disc) { // の sits in a teal medallion
      const R = c.px * .64; g.translate(0, c.px * .36 - (gl.asc - gl.desc) / 2);
      g.fillStyle = '#4f3343'; g.beginPath(); g.arc(R * .1, R * .14, R + 8, 0, 7); g.fill();
      g.fillStyle = FX_INK; g.beginPath(); g.arc(0, 0, R + 9, 0, 7); g.fill();
      g.fillStyle = '#d97757'; g.beginPath(); g.arc(0, 0, R + 4, 0, 7); g.fill();
      paintFill(g, x => { x.beginPath(); x.arc(0, 0, R - 6, 0, 7); }, '#4f7d78', { tex: .3 });
      g.fillStyle = 'rgba(255,240,210,.18)'; g.beginPath(); g.arc(-R * .2, -R * .25, R * .6, 0, 7); g.fill();
      inkPath(g, polyCircle(0, 0, R - 6, R - 6, 40).concat([[R - 6, 0]]), { width: 4, color: FX_INK, seed: 'nodisc', boil: bf, wobble: .5, taper: false });
      g.translate(0, -(c.px * .36 - (gl.asc - gl.desc) / 2));
    }
    g.translate(-c.adv / 2, c.px * .36 + (c.ch === 'の' ? -c.px * .02 : 0)); _fxDrawGlyph(g, gl); g.restore();
  });
  // spark at the crossing
  const sk = tw(a, .5, .35, ease.outBack);
  if (sk > 0) _fxSpark(g, 0, emY - 4, 88 * sk, (1 - sk) * -1.6 + .08 * Math.sin(t * 1.5), { boil: bf, glow: sk, lw: 5 });
  return { layout, emY, kY, bY };
}
// Static logo (settled). { x, y, scale, t }
function titleLogo(g, t, o = {}) {
  const { x = W / 2, y = H / 2, scale = 1 } = o;
  g.save(); g.translate(x, y); g.scale(scale, scale); _fxLogoDraw(g, t, 99, o); g.restore();
}
// The title drop: converging lines → impact frame → SLAM + flash + shake → petal bursts → emblem unfurls → banner →
// spark pops with a glint → sheen sweeps the title → settle (breathing, petals in the wind, sparkles).
// { t0, x, y, scale, charTimes (per-kanji slam offsets from t0, optional), fx (true: also draws flash/petals/lines) }
function titleDrop(g, t, o = {}) {
  const { t0: tS = 0, x = W / 2, y = H / 2 + 20, scale = 1, fx = true } = o, a = t - tS;
  const t0 = tS + (o.charTimes ? Math.max(...o.charTimes) : 0);   // bloom time (= slam time unless kanji are staggered)
  if (a < -.6) return;
  if (fx && a < 0) speedLines(g, t, { x, y: y - 40, rx: 260 + 1000 * (-a / .6), ry: 170 + 640 * (-a / .6), color: FX_WHITE, alpha: .85 * (1 - (-a / .6)) + .15, count: 80, seed: 'tdpre', width: [8, 34] });
  if (a < 0) return;
  const sh = cameraShake(t, [t0, ...(o.charTimes || []).map(c => ({ t: tS + c, amp: .6 }))], { amp: 32, decay: 5.5, dur: .7 });
  g.save(); applyShake(g, sh);
  if (fx) { // behind the logo: far petals bursting out, white radial lines for a beat
    if (t - t0 >= 0 && t - t0 < .35) speedLines(g, t, { x, y: y - 60, rx: 620, ry: 330, color: FX_WHITE, alpha: 1 - (t - t0) / .35, count: 90, seed: 'tdpost', width: [10, 40] });
    petals(g, t, { mode: 'burst', seed: 'tdb1', t0, x, y: y - 120, count: 110, speed: [700, 2200], depth: [.5, 1.0], size: [50, 84], wind: [260, 120], drag: 2.2 });
  }
  g.save(); g.translate(x, y); g.scale(scale, scale);
  const info = _fxLogoDraw(g, t, a, o);
  // sheen across each kanji (staggered) and a glint on the spark
  if (t - t0 > .9 && t - t0 < 1.8) info.layout.forEach((c, i) => {
    const gl = _fxGlyph(c.ch, c.px, c.style || 'logo', boilFrame(t) % 3);
    g.save(); g.translate(c.x, info.kY + c.dy - c.px * .36); g.rotate(c.rot); g.translate(-c.adv / 2, c.px * .36);
    sheen(g, t, gl.c, -gl.ox, -gl.oy, { t0: t0 + 1.0 + i * .06, dur: .45, width: 70 }); g.restore();
  });
  g.restore();
  if (fx) {
    glint(g, t, { x: x + 0 * scale, y: y + (info.emY - 6) * scale, t0: t0 + .62, dur: .5, size: 230 * scale });
    glint(g, t, { x: x + 560 * scale, y: y + 0 * scale, t0: t0 + 1.35, dur: .45, size: 110 * scale });
    sparkles(g, t, { x: x - 700 * scale, y: y - 380 * scale, w: 1400 * scale, h: 760 * scale, count: 16, t0: t0 + .7, seed: 'tdsp', size: [10, 26] });
    petals(g, t, { mode: 'burst', seed: 'tdb2', t0, x, y: y - 80, count: 44, speed: [1000, 2600], depth: [1.3, 2.3], size: [60, 100], wind: [300, 160], drag: 1.5, dir: 0, spread: Math.PI * 2, r0: 120 });
    petals(g, t, { mode: 'wind', seed: 'tdw', t0: t0 + .3, rate: 7, wind: [380, 70], depth: [.6, 1.7], size: [40, 70] });
  }
  g.restore();
  if (fx) {
    impactFrame(g, t, { at: tS, frames: 1, mode: 'clay' });
    if (o.charTimes) flashFrame(g, t, { at: o.charTimes.slice(1).map(c => tS + c), frames: 1, tail: 1, alpha: .35 });
    flashFrame(g, t, { at: t0 + 1 / 24, frames: 1, tail: 2, color: '#fff6e4', alpha: .85 });
  }
}

// ------------------------------------------------------------------------------------------------------------------
// 6. STAFF CREDITS (anime-OP style: role in Japanese + small English, name below, fading in at a corner)
// ------------------------------------------------------------------------------------------------------------------
// { t0, dur, role ('監督'), roleEn ('Director'), names ['Claude'], pos 'bl'|'br'|'tl'|'tr'|'cl'|'cr'|[x,y], tone 'light'|'dark', size }
function staffCredit(g, t, o = {}) {
  const { t0 = 0, dur = 2.6, role = '', roleEn = '', names = [], pos = 'bl', tone = 'light', size = 1, fade = .35 } = o;
  if (t < t0 || t > t0 + dur) return;
  const k = Math.min(clamp((t - t0) / fade), clamp((t0 + dur - t) / fade)), ki = ease.outC(clamp((t - t0) / (fade * 1.6)));
  const M = 120, P = { bl: [M, H - M - 40], br: [W - M, H - M - 40], tl: [M, M + 30], tr: [W - M, M + 30], cl: [M, H / 2], cr: [W - M, H / 2] };
  const [x, y] = Array.isArray(pos) ? pos : P[pos], align = Array.isArray(pos) ? (o.align || 'left') : (pos.endsWith('r') ? 'right' : 'left');
  const fg = tone === 'light' ? '#fff8ea' : FX_INK, sh = tone === 'light' ? 'rgba(40,22,12,.6)' : 'rgba(255,248,234,.7)', acc = tone === 'light' ? '#f0b48a' : PAL.clayDeep;
  const nameN = Array.isArray(names) ? names : [names], s = size;
  g.save(); g.globalAlpha *= k; g.textAlign = align; g.textBaseline = 'alphabetic';
  g.shadowColor = sh; g.shadowBlur = 12 * s; g.shadowOffsetY = 2;
  const dir = align === 'right' ? -1 : 1, slide = (1 - ki) * 14 * dir;
  // role line: spark ✷ + Japanese + English small caps
  let rx = x + slide;
  g.save(); g.shadowColor = 'transparent';
  if (role || roleEn) { _fxSpark(g, rx + dir * 11 * s, y - 13 * s, 11 * s, 0, { fill: acc, line: tone === 'light' ? 'rgba(40,22,12,.7)' : FX_INK, lw: 1.6 }); }
  g.restore();
  rx += dir * 32 * s;
  g.font = font(Math.round(30 * s), 'Zen Maru Gothic', 500); g.fillStyle = fg; g.letterSpacing = Math.round(4 * s) + 'px';
  if (role) { g.fillText(role, rx, y); rx += dir * (g.measureText(role).width + 16 * s); }
  g.font = font(Math.round(20 * s), 'Fraunces', 600); g.letterSpacing = Math.round(4 * s) + 'px'; g.fillStyle = acc;
  if (roleEn) g.fillText(roleEn.toUpperCase(), rx, y - 3 * s);
  // names
  g.letterSpacing = lerp(10, 2, ki) * s + 'px'; g.fillStyle = fg;
  const JP = /[　-ヿ一-鿿]/;
  nameN.forEach((n, i) => { // mixed Japanese/Latin names are set per script run
    const runs = n.match(/[　-ヿ一-鿿]+|[^　-ヿ一-鿿]+/g) || [];
    const fnt = r => JP.test(r) ? font(Math.round(46 * s), 'Zen Maru Gothic', 500) : font(Math.round(54 * s), 'Fraunces', 600);
    const ws = runs.map(r => { g.font = fnt(r); return g.measureText(r).width; }), tot = ws.reduce((a, b) => a + b, 0);
    let xx = (align === 'right' ? x - tot : x) + slide * 1.6; g.textAlign = 'left';
    runs.forEach((r, k) => { g.font = fnt(r); g.fillText(r, xx, y + (62 + i * 62) * s); xx += ws[k]; });
    g.textAlign = align;
  });
  g.restore();
}
// A sequence of credits: items [{ t0, dur, role, roleEn, names, pos }]
function staffRoll(g, t, items, o = {}) { for (const it of items) staffCredit(g, t, { ...o, ...it }); }
