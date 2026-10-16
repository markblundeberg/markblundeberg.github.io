// art.js — PROBLEM SET ∞ demo: the scenes, characters, boot screen, shatter and puzzle illustrations.
// Loads after the video's frozen kits (engine/core.js, chars.js, bg.js, fx.js, puzzles.js, handheld.js) and reuses them.
// Every draw is a pure function of time t and a plain state object (seeded randomness only); the only memory kept
// between frames is caches of things that are expensive to paint (baked backgrounds, character sprites, static
// illustration layers). Top screen: logical 1920×1080. Illustrations: logical 1200×640. The caller sets the transform.
//
// Public (see GAME.md): gmArtInit, gmDrawScene, GM_COINS, gmDrawBoot, gmDrawShatter, GM_SHATTER_DUR, gmDrawIllus,
// GM_P005_SPOTS, GM_TRUNK_CARDS. Extras for the shell: GM_SCENES, GM_DIALOGUE_BAND, gmArtStats.

// =====================================================================================================
// 0. state, loading, small helpers
// =====================================================================================================
const GM_SCENES = ['study', 'market', 'school', 'corridor', 'canal', 'tower', 'trunk', 'ending'];
const GMA = { img: {}, base: 'assets/', ready: false, stats: { charLive: 0, charHit: 0, charMiss: 0 } };

async function gmArtInit(base = 'assets/') {
  GMA.base = base;
  const load = id => new Promise(res => {
    const im = new Image();
    im.onload = () => { (im.decode ? im.decode().catch(() => null) : Promise.resolve()).then(() => { GMA.img[id] = im; res(); }); };
    im.onerror = () => { console.warn('[art] missing background', id); res(); };
    im.src = base + 'bg_' + id + '.webp';
  });
  await Promise.all(GM_SCENES.map(load));
  // warm the small shared textures and the boot screen so the first frames don't stall
  charTexture(); gmBootLow(0, {}); gmVignette();
  GMA.ready = true;
}

// device pixels per logical pixel for the context's current transform (uniform scale assumed)
function gmRes(g) { const m = g.getTransform(); return Math.hypot(m.a, m.b) || 1; }
const gmMk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
// A bounded LRU of offscreen canvases (budget in device pixels).
function gmLRU(budget) {
  const m = new Map(); let px = 0;
  return {
    get(k) { const v = m.get(k); if (v) { m.delete(k); m.set(k, v); } return v; },
    set(k, c) { m.set(k, c); px += c.width * c.height; for (const [kk, v] of m) { if (px <= budget || m.size <= 2) break; m.delete(kk); px -= v.width * v.height; } },
    clear() { m.clear(); px = 0; }, get size() { return m.size; }, get px() { return px; },
  };
}
// Draw a static layer at the context's current resolution, built once per (key, resolution).
const _gmStatic = gmLRU(14e6);
function gmStatic(g, key, x, y, w, h, draw) {
  const res = Math.min(2, Math.max(.25, Math.ceil(gmRes(g) * 8) / 8));
  const k = key + '@' + res;
  let c = _gmStatic.get(k);
  if (!c) { c = gmMk(w * res, h * res); const cg = c.getContext('2d'); cg.scale(res, res); cg.translate(-x, -y); draw(cg); _gmStatic.set(k, c); }
  g.drawImage(c, x, y, w, h);
}
// tiny eased helpers
const gmK = (t, a, d) => clamp((t - a) / d);
const gmE = (t, a, d, e = ease.inOutQ) => e(gmK(t, a, d));

// =====================================================================================================
// 1. characters: busts, cached as sprites per drawing (expression × mouth × blink × boil frame)
// =====================================================================================================
// Hilde stands left, Claude right; faces sit in y ≈ 20…530 (eyes ≈ 400) so a dialogue box over y ≳ 600 never covers them.
const GM_CAST = {
  hilde: { x: 405, y: 702, s: 2.05, turn: .22, look: [.35, 0], seed: 'hblink', box: [-175, -350, 175] },
  claude: { x: 1515, y: 710, s: 2.05, turn: -.22, look: [-.35, 0], seed: 'cblink', box: [-180, -370, 180] },
};
// arms per expression (a pose's own `arms` wins)
const GM_ARMS = {
  claude: { surprised: 'wave', joy: 'fists', determined: 'eureka', proud: 'eureka', teary: 'fists', sing: 'wave', shout: 'fists' },
  hilde: { joy: 'clasp', proud: 'clasp', laugh: 'clasp', teary: 'clasp' },
};
const _gmChar = gmLRU(30e6);
// The pose actually drawn (quantised so it can be cached; identical whether cached or live)
function gmCharPose(who, t, st, nBoil = 3) {
  const C = GM_CAST[who], ex = EXPR[st.expr] ? st.expr : 'neutral', E = EXPR[ex];
  const talk = st.talk || 0, tq = talk < .12 ? 0 : talk < .55 ? .45 : .9;
  const eyesShut = ['happy', 'laugh', 'closed'].includes(E.eyes);
  const b = eyesShut ? 0 : autoBlink(t + (who === 'hilde' ? 1.3 : 0), C.seed), bq = b < .25 ? 0 : b < .75 ? .5 : 1;
  const bf = bq ? 0 : boilFrame(t) % nBoil;      // drawings that boil on twos (a blink holds one)
  const pose = { expr: ex, t: bf / 12 + 1e-4, blink: bq, turn: st.turn ?? C.turn, arms: st.arms || GM_ARMS[who][ex] || (who === 'hilde' ? 'rest' : 'none') };
  if (tq > 0) pose.talk = tq; else if (E.mouth === 'open' || E.mouth === 'talk') pose.talk = .3;
  if (!E.look) pose.look = st.look || C.look;
  if (st.tilt) pose.tilt = st.tilt;
  return pose;
}
function gmDrawChar(g, who, t, st, opts = {}) {
  const res = gmRes(g), rq = Math.min(1.34, Math.max(.25, Math.ceil(res * 16) / 16));
  // big busts are expensive to ink (4–25 ms each, mostly fill), so each drawing is cached as a sprite at the
  // canvas's own resolution. Large canvases boil on two drawings instead of three to keep the cache small.
  const C = { ...GM_CAST[who], ...(opts.at || {}) }, pose = gmCharPose(who, t, st, rq > 1 ? 2 : 3);
  const draw = who === 'hilde' ? drawProfessor : drawApprentice;
  // idle breath + a small lift while the mouth is open (limited animation: the drawing moves, it doesn't redraw)
  const ph = who === 'hilde' ? 0 : 2.1;
  const bob = Math.sin(t * 1.7 + ph) * 3.5 - (pose.talk && st.talk ? pose.talk * 7 : 0) + (opts.dy || 0);
  const [bx0, by0, bx1] = C.box, s = C.s, cut = (H + 40 - C.y) / s;
  if (opts.live) {
    GMA.stats.charLive++;
    g.save(); g.beginPath(); g.rect(C.x + bx0 * s, -100, (bx1 - bx0) * s, H + 200); g.clip();
    draw(g, C.x, C.y + bob, s, pose); g.restore();
    return;
  }
  const key = [who, pose.expr, pose.talk || 0, pose.blink, pose.t.toFixed(3), pose.arms, pose.turn, (pose.look || []).join(','), pose.tilt || 0, s, rq].join('|');
  let c = _gmChar.get(key);
  if (!c) {
    GMA.stats.charMiss++;
    c = gmMk((bx1 - bx0) * s * rq, (cut - by0) * s * rq);
    const cg = c.getContext('2d'); cg.scale(rq, rq); cg.translate(-bx0 * s, -by0 * s);
    draw(cg, 0, 0, s, pose);
    _gmChar.set(key, c);
  } else GMA.stats.charHit++;
  g.drawImage(c, C.x + bx0 * s, C.y + by0 * s + bob, c.width / rq, c.height / rq);
}

// =====================================================================================================
// 2. scenes (top screen)
// =====================================================================================================
// Hidden coins: a faint glint in each scene, away from the faces and above the dialogue band. r = tap radius.
// All sit in the outer thirds (x < 640 or x > 1280: taps in the middle advance dialogue), above y 560, and clear of
// the two busts (Hilde spans x ≈ 185–625, Claude x ≈ 1215–1815).
const GM_COINS = {
  study: { x: 112, y: 300, r: 95 },         // on the bookshelf, left: the easy one (Hilde points it out)
  market: { x: 1862, y: 330, r: 95 },       // on a window box, far right
  school: { x: 118, y: 318, r: 95 },        // on the window's crossbar, left
  corridor: { x: 1852, y: 300, r: 95 },     // on the right-hand wall by a door
  canal: { x: 92, y: 420, r: 95 },          // on a window sill, far left
  tower: { x: 1862, y: 470, r: 95 },        // in the ivy on the brick wall, right
  trunk: { x: 112, y: 300, r: 95 },         // on the bookshelf, left
  boot: null, ending: null,
}

function gmVignette() {
  return cached('gm:vig', 384, 216, q => {
    const gr = q.createRadialGradient(192, 108, 216 * .35, 192, 108, 216 * 1.05);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, 'rgb(173,163,146)');
    q.fillStyle = gr; q.fillRect(0, 0, 384, 216);
  });
}
function gmFinish(g, t, st) {
  g.save();
  g.globalCompositeOperation = 'multiply'; g.drawImage(gmVignette(), 0, 0, W, H);
  g.restore();
  if (st && st.flash > 0) { g.save(); g.globalAlpha = clamp(st.flash) * .85; g.fillStyle = '#fff6e4'; g.fillRect(0, 0, W, H); g.restore(); }
}
// Sunflower petals on the wind (cheap: filled paths). n petals crossing the frame, looping.
function gmPetals(g, t, o = {}) {
  const { n = 9, seed = 'gmpet', y0 = 60, y1 = 560, speed = 120, wind = 1, scale = 1, alpha = 1 } = o;
  g.save();
  for (let i = 0; i < n; i++) {
    const r = rng(seed + i), per = (W + 400) / (speed * r.range(.7, 1.3)), u = ((t + r() * per) % per) / per;
    const x = -200 + u * (W + 400), y = lerp(y0, y1, r()) + Math.sin(t * r.range(.8, 1.6) + i) * 40 + u * 60 * wind;
    const L = r.range(20, 34) * scale, flip = Math.cos(t * r.range(2, 4) + i * 2);
    g.save(); g.translate(x, y); g.rotate(t * r.range(-1.5, 1.5) + i); g.scale(1, .3 + .7 * Math.abs(flip));
    g.globalAlpha = alpha * .9; hhPetalPath(g, L); g.fillStyle = flip < 0 ? '#b0532f' : r.pick(['#d97757', '#e0865f', '#f2a37c']); g.fill();
    g.restore();
  }
  g.restore();
}
// dust motes drifting in a beam (soft dots)
function gmMotes(g, t, o = {}) {
  const { n = 18, x0 = 700, x1 = 1220, y0 = 80, y1 = 560, seed = 'gmmote', col = '255,240,200', a = .5 } = o;
  g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) {
    const r = rng(seed + i), ph = r() * 100, sp = r.range(.05, .12);
    const x = lerp(x0, x1, (r() + Math.sin((t + ph) * sp) * .08 + 1) % 1), y = lerp(y0, y1, ((r() - t * sp * .15) % 1 + 1) % 1);
    const tw = .5 + .5 * Math.sin(t * r.range(.8, 2) + ph);
    g.fillStyle = `rgba(${col},${a * tw})`; g.beginPath(); g.arc(x, y, r.range(1.5, 3.2), 0, 7); g.fill();
  }
  g.restore();
}
// the hidden coin: a brass coin almost edge-on, with a twinkle every ~2.6 s
function gmCoin(g, t, c, seed) {
  // A brass hint coin about 76 logical px across (≈ 15 CSS px on a 370 px phone screen), tilted a little towards us.
  // Every 1.5 s: a light sweeps across its face, a four-point glint flares and a soft halo ring spreads out.
  if (!c) return;
  const P = 1.5, ph = (hashStr(seed) % 100) / 100 * P, u = ((t + ph) % P) / P;
  const flare = u < .3 ? Math.sin(u / .3 * Math.PI) : 0, bob = Math.sin(t * 2.2 + ph) * 3;
  g.save(); g.translate(c.x, c.y + bob);
  // soft standing halo (always there, breathing) + the spreading ring
  const breathe = .5 + .5 * Math.sin((t + ph) / P * Math.PI * 2);
  let gr = g.createRadialGradient(0, 0, 10, 0, 0, 70);
  gr.addColorStop(0, `rgba(255,226,140,${.42 + .25 * breathe})`); gr.addColorStop(1, 'rgba(255,226,140,0)');
  g.fillStyle = gr; g.fillRect(-70, -70, 140, 140);
  if (u < .6) { const k = u / .6, R = 42 + 46 * ease.outQ(k); g.strokeStyle = `rgba(255,240,190,${.85 * (1 - k)})`; g.lineWidth = 6 * (1 - k) + 1.5; g.beginPath(); g.ellipse(0, 0, R, R * .82, 0, 0, 7); g.stroke(); }
  // the coin: edge, face, rim, a stamped spark
  g.rotate(-.18);
  g.fillStyle = '#6e4614'; g.beginPath(); g.ellipse(2, 6, 38, 31, 0, 0, 7); g.fill();
  g.fillStyle = '#b8862e'; g.beginPath(); g.ellipse(0, 3, 38, 31, 0, 0, 7); g.fill();
  gr = g.createLinearGradient(-30, -30, 30, 30); gr.addColorStop(0, '#fbe08a'); gr.addColorStop(.55, '#e3b54a'); gr.addColorStop(1, '#c9932e');
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, 37, 30, 0, 0, 7); g.fill();
  g.strokeStyle = '#a87a22'; g.lineWidth = 3; g.beginPath(); g.ellipse(0, 0, 29, 23, 0, 0, 7); g.stroke();
  g.strokeStyle = '#5a3a14'; g.lineWidth = 3.2; g.beginPath(); g.ellipse(0, 0, 37, 30, 0, 0, 7); g.stroke();
  g.save(); g.scale(1, .81); pzSpark(g, 0, 0, 15, { fill: '#c9932e', line: '#7a5218', lw: 2, t: 0, seed: 'gmcoin' }); g.restore();
  // the light sweeping across the face
  if (flare > 0) {
    g.save(); g.beginPath(); g.ellipse(0, 0, 37, 30, 0, 0, 7); g.clip();
    const sx = lerp(-60, 60, u / .3); g.globalAlpha = .8 * flare; g.fillStyle = '#fffbe6';
    g.beginPath(); g.moveTo(sx - 10, -40); g.lineTo(sx + 6, -40); g.lineTo(sx - 14, 40); g.lineTo(sx - 30, 40); g.closePath(); g.fill(); g.restore();
  }
  g.rotate(.18);
  // the glint
  const tw = flare;
  if (tw > 0) {
    g.globalCompositeOperation = 'screen';
    const R = 64 * tw, x = 18, y = -16; g.fillStyle = `rgba(255,246,210,${.95 * tw})`;
    g.beginPath(); g.moveTo(x, y - R); g.lineTo(x + 5, y - 5); g.lineTo(x + R, y); g.lineTo(x + 5, y + 5); g.lineTo(x, y + R); g.lineTo(x - 5, y + 5); g.lineTo(x - R, y); g.lineTo(x - 5, y - 5); g.closePath(); g.fill();
  }
  g.restore();
}
// attic: twinkling stars in the round window + the lantern's flicker
const GM_ATTIC = { lantern: [1210, 700], win: { x: 960, y: 430, r: 150 } };
function gmAtticLive(g, t) {
  const { x: wx, y: wy, r: wr } = GM_ATTIC.win, rr = rng('gmastars');
  g.save(); g.beginPath(); g.arc(wx, wy, wr - 10, 0, 7); g.clip();
  for (let i = 0; i < 22; i++) { const sx = wx + rr.range(-wr, wr), sy = wy + rr.range(-wr, wr * .2), f = .5 + .5 * Math.sin(t * rr.range(1.5, 4) + i * 3); g.fillStyle = `rgba(255,250,230,${.25 + .6 * f})`; g.fillRect(sx, sy, 2.5, 2.5); }
  g.restore();
  const [lx, ly] = GM_ATTIC.lantern;
  bgLampGlow(g, t, [[lx, ly - 40, 1]], { r: 300, a: .16, col: '255,186,100', flicker: 1.6 });
  bgLampGlow(g, t, [[lx, ly - 40, 1]], { r: 70, a: .35, col: '255,236,180', flicker: 1.6 });
}
// corridor sconces and pendants (same projection as bgCorridor at z = .35)
const GM_COR_LAMPS = (() => {
  if (typeof BGCOR === 'undefined') return [];
  const C = BGCOR, camZ = .35 * C.D, pts = [], fogA = z => 1 - Math.exp(-z / 16);
  for (let b = 0; b < 14; b++) {
    const zs = b * C.D + C.D * .78 - camZ; if (zs < .6) continue;
    for (const side of [-1, 1]) { const [x, y] = C.proj(side * (C.XW - .05), .55, zs); pts.push([x, y, 1.6 / zs * (1 - fogA(zs))]); }
    const zp = b * C.D + C.D * .55 - camZ; if (zp > .6) { const [x, y] = C.proj(0, C.YC - .25, zp); pts.push([x, y, 2.2 / zp * (1 - fogA(zp))]); }
  }
  return pts.filter(p => p[2] > .04);
})();

const GM_SCENE_LIVE = {
  study: (g, t) => { gmAtticLive(g, t); gmMotes(g, t, { x0: 780, x1: 1140, y0: 300, y1: 640, col: '210,220,255', a: .45 }); },
  trunk: (g, t) => {
    gmAtticLive(g, t);
    // the trunk breathes a little light from its open lid
    const k = .5 + .5 * Math.sin(t * 1.3);
    g.save(); g.globalCompositeOperation = 'screen';
    const gr = g.createRadialGradient(940, 560, 10, 940, 560, 240); gr.addColorStop(0, `rgba(255,214,140,${.2 + .1 * k})`); gr.addColorStop(1, 'rgba(255,214,140,0)');
    g.fillStyle = gr; g.fillRect(700, 320, 480, 480);
    g.fillStyle = `rgba(255,226,150,${.35 + .25 * k})`; g.fillRect(768, 560, 340, 5); g.restore();
    for (let i = 0; i < 5; i++) { const r = rng('gmtsp' + i), u = ((t * .5 + r()) % 1); const s = Math.sin(u * Math.PI); if (s < .2) continue; pzSpark(g, 940 + r.range(-150, 150), 552 - u * 170 + r.range(-10, 10), 10 * s, { fill: '#f3d27a', line: null }); }
    gmMotes(g, t, { x0: 760, x1: 1160, y0: 260, y1: 600, col: '255,228,170', a: .5, seed: 'gmtm' });
  },
  market: (g, t) => gmPetals(g, t, { n: 7, y0: 80, y1: 520, speed: 140 }),
  school: (g, t) => gmMotes(g, t, { x0: 60, x1: 1300, y0: 100, y1: 640, n: 24, a: .5 }),
  corridor: (g, t) => { bgLampGlow(g, t, GM_COR_LAMPS, { r: 260, a: .3, flicker: 1 }); gmMotes(g, t, { x0: 760, x1: 1160, y0: 250, y1: 600, n: 14, a: .4 }); },
  canal: (g, t) => {
    bgWaterGlints(g, t, 780, 640, 360, 70, { n: 50, seed: 'gmcg1', size: .7 });
    bgWaterGlints(g, t, 560, 720, 800, 140, { n: 70, seed: 'gmcg2', size: 1 });
    bgLampGlow(g, t, [[1080, 215, 1]], { r: 60, a: .25, flicker: .6 });
    gmPetals(g, t, { n: 4, y0: 120, y1: 420, speed: 90, seed: 'gmcp' });
  },
  tower: (g, t) => gmPetals(g, t, { n: 10, y0: 60, y1: 600, speed: 170, seed: 'gmtp' }),
  ending: (g, t) => {
    // the cards fly over the town like birds (released, not solved)
    const kinds = ['fever', 'fire', 'storm', 'wire'];
    for (let i = 0; i < 5; i++) {
      const r = rng('gmbird' + i), per = r.range(16, 24), u = ((t + r() * per) / per) % 1;
      const x = lerp(-200, W + 200, u), y = r.range(110, 330) + Math.sin(u * 9 + i) * 40 - u * 60;
      pzCardBird(g, t, { x, y, scale: r.range(.3, .42), kind: kinds[i % 4], flapRate: r.range(1.6, 2.4), phase: r() * 6, heading: Math.sin(u * 9 + i) * .08 - .05 });
    }
    gmPetals(g, t, { n: 12, y0: 40, y1: 600, speed: 130, seed: 'gmep' });
  },
};

// sceneId: 'boot' | GM_SCENES…   st: { hilde: {expr, talk}|null, claude: {expr, talk}|null, coinFound, flash }
function gmDrawScene(g, t, sceneId, st = {}) {
  if (sceneId === 'boot') { gmDrawBoot(g, t, st); return; }
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';   // the baked paintings are downscaled a lot on phones
  const im = GMA.img[sceneId];
  if (im) g.drawImage(im, 0, 0, W, H);
  else { g.fillStyle = '#e9d9b8'; g.fillRect(0, 0, W, H); }
  const live = GM_SCENE_LIVE[sceneId];
  if (live) live(g, t);
  if (st.hilde) gmDrawChar(g, 'hilde', t, st.hilde);
  if (st.claude) gmDrawChar(g, 'claude', t, st.claude);
  if (!st.coinFound && GM_COINS[sceneId]) gmCoin(g, t, GM_COINS[sceneId], sceneId);
  gmFinish(g, t, st);
}

// =====================================================================================================
// 3. boot screen (the handheld pixel mode) and the shatter into the painted world
// =====================================================================================================
// A 256×144 pixel screen in the cold open's 16-colour palette, scaled ×3 to a 768×432 logical frame (the size
// hhShatter breaks), then presented smoothly at 1920×1080 ("sharp bilinear").
const GM_BOOT = { w: 256, h: 144 };
// The three non-ASCII glyphs the boot uses, drawn from our own copy of the pixel font's patterns, so the boot screen
// is right even if a page loads the kits without a UTF-8 charset (the font table's keys would then be mis-decoded).
const GM_GLYPH = {
  inf: '........./........./.##...##./#..#.#..#/#...#...#/#..#.#..#/.##...##.',
  spark: '...#.../.#.#.#./..###../#######/..###../.#.#.#./...#...',
  play: '#.../##../###./####/###./##../#...',
};
function gmGlyph(sg, name, x, y, color, o = {}) {   // (x, y) = top-left, like hhText; align 'center' centres it
  const rows = GM_GLYPH[name].split('/'), sc = o.scale || 1, w = rows[0].length * sc;
  const x0 = Math.round(o.align === 'center' ? x - w / 2 : x), y0 = Math.round(y);
  for (const [c, dx] of o.shadow ? [[o.shadow, 1], [color, 0]] : [[color, 0]]) {
    sg.fillStyle = c;
    rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') sg.fillRect(x0 + i * sc + dx, y0 + j * sc + dx, sc, sc); });
  }
}
function gmBootLow(t, st = {}) {
  const lo = hhScratch('gmBoot', GM_BOOT.w, GM_BOOT.h), sg = lo.getContext('2d');
  sg.setTransform(1, 0, 0, 1, 0, 0); sg.imageSmoothingEnabled = false;
  const P = HHP, power = st.power ?? clamp(t / .6);
  hhScreenPower(sg, t, power, (sg2, tt) => gmBootScreen(sg2, tt, st));
  const up = hhScratch('gmBootUp', HH.LW, HH.LH), ug = up.getContext('2d');
  ug.imageSmoothingEnabled = false; ug.drawImage(lo, 0, 0, GM_BOOT.w * 3, GM_BOOT.h * 3);
  return up;
}
function gmBootScreen(sg, t, st) {
  const P = HHP, pressed = !!st.pressed, tp = st.tPressed ?? 0;
  // paper with a dot grid and a slow diagonal shimmer of sunburst rays (the cold open's backdrop)
  const step = Math.floor(t * .08 / (Math.PI / 6) * 32) % 32;   // the rays turn slowly, in 32 cached steps per 1/12 turn
  sg.drawImage(hhSprite('gmBootBg' + step, 256, 144, q => {
    hhPx(q, 0, 0, P.parch, 256, 144);
    for (let i = 0; i < 12; i++) { const a0 = i / 12 * Math.PI * 2 + step / 32 * Math.PI / 6, a1 = a0 + Math.PI / 12; hhPoly(q, [[128, 64], [128 + Math.cos(a0) * 300, 64 + Math.sin(a0) * 300], [128 + Math.cos(a1) * 300, 64 + Math.sin(a1) * 300]], mix(P.parch, P.cream, .55)); }
    for (let y = 4; y < 144; y += 8) for (let x = 4; x < 256; x += 8) hhPx(q, x, y, mix(P.parch, P.tan, .35));
  }), 0, 0);
  // the title card (static: a cached sprite)
  sg.drawImage(hhSprite('gmBootCard', 256, 72, q => {
    hhRRect(q, 31, 9, 196, 58, 4, P.tan);
    hhRRect(q, 29, 7, 196, 58, 4, P.ink); hhRRect(q, 30, 8, 194, 56, 3, P.cream);
    hhPx(q, 33, 11, P.parch, 188, 1); hhPx(q, 33, 60, P.parch, 188, 1);
    hhText(q, 'PROBLEM SET', 128, 15, P.clayDk, { scale: 3, align: 'center', shadow: P.tan });
  }), 0, 0);
  // ✷ ∞ ✷, the ∞ bobbing gently
  const by = 41 + (Math.floor(t * 2) % 2);
  gmGlyph(sg, 'inf', 128, by, P.gold, { scale: 2, align: 'center', shadow: P.umber });
  gmGlyph(sg, 'spark', 98, 44, P.clay, { shadow: P.clayDk }); gmGlyph(sg, 'spark', 151, 44, P.clay, { shadow: P.clayDk });
  // DEMO, a teal tab pinned over the card's lower right corner
  hhRRect(sg, 189, 56, 40, 14, 3, P.tealDk); hhRRect(sg, 188, 55, 40, 13, 3, P.teal);
  hhText(sg, 'DEMO', 208, 58, P.cream, { align: 'center' });
  // the two of them, in portrait frames, and the trunk between
  const blinkH = hhBlinking(t, 'hilde'), blinkC = hhBlinking(t, 'claude');
  const cl = pressed ? 'grin' : (blinkC ? 'blink' : 'smile'), hd = pressed ? 'happy' : (blinkH ? 'blink' : 'smile');
  const hop = pressed ? -Math.max(0, Math.round(3 * Math.sin(Math.min(1, (t - tp) / .3) * Math.PI))) : 0;
  hhPortrait(sg, 10, 72, 'hilde', hd, { bob: hop });
  hhPortrait(sg, 178, 72, 'claude', cl, { bob: hop, rays: pressed ? Math.floor(t * 12) * .25 : null });
  const tr = hhSpriteTrunk(), trHop = Math.floor(t * 1.5) % 2 ? -1 : 0;
  hhBlit(sg, tr, 128 - tr.width / 2, 74 + trHop);
  for (const [x, y, ph] of [[90, 80, 0], [168, 86, .4], [150, 74, .7], [100, 104, .2]]) { const k = (t * .9 + ph) % 1; hhSparkle(sg, x, y, k < .15 ? 1 : k < .3 ? 2 : k < .4 ? 1 : 0); }
  // PRESS START (blinks; fast once pressed)
  const on = pressed ? Math.floor(t * 10) % 2 === 0 : Math.floor(t * 1.6) % 2 === 0;
  if (on) hhText(sg, 'PRESS START', 128, 130, pressed ? P.clayDk : P.ink, { align: 'center', shadow: P.tan });
  else gmGlyph(sg, 'play', 82, 130, P.clay);
}
function gmPresentBoot(g, up) {
  g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(up, 0, 0, HH.LW, HH.LH, 0, 0, W, H); g.restore();
}
// st: { pressed: bool, tPressed?: seconds (t at which START was pressed, for the hop), power?: 0..1 override }
function gmDrawBoot(g, t, st = {}) {
  gmPresentBoot(g, gmBootLow(t, st));
  // glass: a soft diagonal sheen and a shade along the top edge (small cached overlays, stretched), and a vignette
  g.drawImage(cached('gm:glass', 384, 216, q => {
    const gr = q.createLinearGradient(0, 0, 384 * .6, 216); gr.addColorStop(0, 'rgba(255,250,235,.10)'); gr.addColorStop(.38, 'rgba(255,250,235,.035)'); gr.addColorStop(.39, 'rgba(255,250,235,0)');
    q.fillStyle = gr; q.fillRect(0, 0, 384, 216);
    const sh = q.createLinearGradient(0, 0, 0, 8); sh.addColorStop(0, 'rgba(30,18,10,.25)'); sh.addColorStop(1, 'rgba(30,18,10,0)');
    q.fillStyle = sh; q.fillRect(0, 0, 384, 8);
  }), 0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'multiply'; g.drawImage(gmVignette(), 0, 0, W, H); g.restore();
}
const GM_SHATTER_DUR = 1.2;
// t from 0 → GM_SHATTER_DUR: the pressed boot frame breaks into pixels and petals over the painted scene (the video's
// hhShatter move, re-implemented here with a cheaper present: the 768×432 mask is drawn straight to the frame).
// st is passed through to gmDrawScene (characters may already be there).
function gmDrawShatter(g, t, sceneId, st = {}) {
  const low = cached('gm:bootSnap', HH.LW, HH.LH, q => { q.imageSmoothingEnabled = false; q.drawImage(gmBootLow(2.05, { pressed: true, tPressed: 1.7, power: 1 }), 0, 0); });
  const k = clamp(t / GM_SHATTER_DUR), block = 8, origin = [384, 410], wind = [900, -900], S = HH.S;
  gmDrawScene(g, t, sceneId, st);
  if (k >= 1) return;
  const D = hhShatterPrep(low, block, origin, 'gmshatter', .14), sh = D.shards;
  const m = hhScratch('gmShatterMask', HH.LW, HH.LH), mg = m.getContext('2d');
  mg.globalCompositeOperation = 'source-over'; mg.clearRect(0, 0, HH.LW, HH.LH); mg.drawImage(low, 0, 0);
  let i = 0;
  for (; i < sh.length && sh[i].tau <= k; i++) mg.clearRect(sh[i].x, sh[i].y, block, block);
  mg.globalCompositeOperation = 'source-atop'; mg.fillStyle = HHP.cream;     // a hairline of light along the break
  for (let j = i; j < sh.length && sh[j].tau <= k + .012; j++) mg.fillRect(sh[j].x, sh[j].y, block, block);
  mg.globalCompositeOperation = 'source-over';
  g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(m, 0, 0, HH.LW, HH.LH, 0, 0, W, H); g.restore();
  const bs = block * S, base = g.getTransform();
  g.save();
  for (let j = 0; j < i; j++) {
    const s = sh[j], u = (k - s.tau) / s.life;
    if (u >= 1) continue;
    const e = u, x0 = (s.x + block / 2) * S, y0 = (s.y + block / 2) * S;
    if (!s.petal) {   // a plain pixel pops loose, drifts a little, shrinks away
      const q = 1 - u / .16; if (q <= 0) continue;
      const sz = bs * (u < .08 ? 1 : q);
      g.globalAlpha = 1; g.fillStyle = s.col; g.fillRect(x0 + s.vx * e * .35 + wind[0] * e * e * .15 - sz / 2, y0 + s.vy * e * .35 + 260 * e * e - sz / 2, sz, sz);
      continue;
    }
    const x = x0 + s.vx * e + wind[0] * e * e * .5 + Math.sin(e * 7 + s.ph) * 30 * s.turb * e;
    const y = y0 + s.vy * e + wind[1] * e * e * .5 + Math.cos(e * 5 + s.ph) * 22 * s.turb * e;
    const morph = clamp(u / .22);
    if (morph < 1) { g.globalAlpha = 1 - morph; g.fillStyle = s.col; const sz = bs * (1 + morph * .6); g.fillRect(x - sz / 2, y - sz / 2, sz, sz); }
    const L = s.L * 1.15 * ease.outQ(morph), fade = 1 - clamp((u - .7) / .3);
    if (L < 1) continue;
    const flip = Math.cos(s.ph + s.flut * e), under = flip < 0;
    g.globalAlpha = morph * fade;
    g.setTransform(base); g.translate(x, y); g.rotate(s.ph + s.spin * e); g.scale(1, .3 + .7 * Math.abs(flip));
    hhPetalPath(g, L); g.fillStyle = under ? '#b0532f' : s.pc; g.fill();
    if (!under) { g.globalAlpha = morph * fade * .3; g.fillStyle = '#ffe6cc'; g.beginPath(); g.ellipse(-L * .08, -L * .12, L * .2, L * .06, -.15, 0, 7); g.fill(); }
  }
  g.setTransform(base);
  g.restore();
  if (k < .05) { g.save(); g.globalAlpha = (1 - k / .05) * .85; g.fillStyle = '#fff6e4'; g.fillRect(0, 0, W, H); g.restore(); }
}

// =====================================================================================================
// 4. illustrations (bottom screen, logical 1200×640, on the paper puzzle sheet)
// =====================================================================================================
const IW = 1200, IH = 640;
// Phone legibility: gmDrawIllus sets GMI.min from st.cssW (the picture's CSS width) so that no label drops below
// ~12.5 CSS px; gmFs(size) is every label's size. Without cssW (or on wide sheets) the sizes are as designed.
const GMI = { min: 0, phone: false };
const gmFs = n => Math.max(n, GMI.min);
// shared ink/paint helpers in the puzzle cards' style
const gmInk = (g, pts, o = {}) => inkPath(g, pts, { width: 4, color: PZ.ink, wobble: .8, ...o });
const gmInkPoly = (g, pts, o = {}) => inkPoly(g, pts, { width: 4, color: PZ.ink, wobble: .7, ...o });
function gmPaint(g, pathFn, color, o = {}) { paintFill(g, pathFn, color, { tex: .25, ...o }); }
// a soft watercolour pool under a subject (cached per key)
function gmPool(g, key, cx, cy, rx, ry, color, a = .05) { pzBlob(g, key, cx, cy, rx, ry, color, { alpha: a * .25, spread: .1, layers: 22 }); }
function gmLabel(g, text, x, y, size, o = {}) { pzLabel(g, text, x, y, size, o); }
// a little paper tag with handwriting
function gmTag(g, t, x, y, text, o = {}) {
  const { size: size0 = 40, rot = -.04, color = PZ.ink, bg = '#fbf5e6', seed = text, alpha = 1, w = null } = o, size = gmFs(size0);
  g.save(); g.globalAlpha *= alpha; g.translate(x, y); g.rotate(rot);
  g.font = pzFont(size, 'hand', 700); const tw0 = w ?? g.measureText(text).width + size * .9, th = size * 1.25;
  const q = deform(polyRect(-tw0 / 2, -th / 2, tw0, th), rng('gmtag' + seed), 1, .02);
  g.save(); g.translate(4, 6); g.globalAlpha *= .2; g.fillStyle = PAL.umber; tracePoly(g, q); g.fill(); g.restore();
  paintFill(g, gg => tracePoly(gg, q), bg, { tex: .15 }); inkPoly(g, q, { width: 2.2, color: PZ.inkSoft, seed: 'gmtagi' + seed, boil: pzBoil(t), wobble: .4 });
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, size * .06);
  g.restore();
}

// ---------------------------------------------------------------------------------------------- p001
function gmIllusP001(g, t, st) {
  const ts = st.solved ? st.tSolved ?? 99 : null;
  gmStatic(g, 'p001:base', 0, 0, IW, IH, q => { gmPool(q, 'p001pool', 300, 360, 260, 230, '#f2b48a', .03); });
  pzStrawberry(g, t, { x: 290, y: 340, scale: .82, seed: 'gmsb' });
  // the word on a tag tied to the stem
  const word = 'strawberry', tx = 790, ty = 370;
  gmInk(g, bez([300, 110], [420, 30], [500, 200], [tx - 250, ty - 50], 16), { width: 3, color: '#a8834f', seed: 'gmstring', boil: pzBoil(t) });
  g.save(); g.translate(tx, ty); g.rotate(-.05);
  const q = deform(polyRect(-290, -105, 580, 210), rng('gmsbtag'), 1, .015);
  g.save(); g.translate(6, 9); g.globalAlpha = .2; g.fillStyle = PAL.umber; tracePoly(g, q); g.fill(); g.restore();
  paintFill(g, gg => tracePoly(gg, q), '#fbf5e6', { tex: .15 }); inkPoly(g, q, { width: 3, seed: 'gmsbt', boil: pzBoil(t), wobble: .5 });
  g.fillStyle = PZ.ink; g.beginPath(); g.arc(-252, -60, 10, 0, 7); g.fill();
  g.font = pzFont(132, 'hand', 700); g.textBaseline = 'alphabetic';
  const ws = g.measureText(word).width, x0 = -ws / 2, xs = [];
  for (let i = 0, x = x0; i < word.length; i++) { xs.push(x + g.measureText(word[i]).width / 2); x += g.measureText(word[i]).width; }
  g.fillStyle = PZ.ink; g.textAlign = 'left'; g.fillText(word, x0, 44);
  const R3 = [2, 7, 8], land = n => .35 + n * .5 + .7;     // each r lands in its slot at this time
  if (ts !== null) R3.forEach((i, n) => {
    if (ts < land(n)) return;
    g.save(); g.fillStyle = PAL.clayDeep; g.font = pzFont(132, 'hand', 700); g.textAlign = 'center'; g.fillText('r', xs[i], 44); g.restore();
    pzMemoCircle(g, ts, { x: xs[i], y: 8, rx: 36, ry: 54, t0: land(n), dur: .25, seed: 'gmr' + i, color: PAL.clayDeep, width: 5 });
    pzMemoText(g, ts, { text: String(n + 1), x: xs[i], y: -62, size: 56, t0: land(n) + .1, align: 'center', color: PAL.clayDeep, rot: 0 });
  });
  g.restore();
  // three r's pop out of the berry and fly into the word, one by one
  if (ts !== null) {
    const ca = Math.cos(-.05), sa = Math.sin(-.05), toG = (x, y) => [tx + x * ca - y * sa, ty + x * sa + y * ca];
    R3.forEach((i, n) => {
      const a0 = .35 + n * .5, k = gmK(ts, a0, .7); if (k <= 0 || k >= 1) return;
      const e = ease.inOutQ(k), [ex, ey] = toG(xs[i], 10), sx = 290 + (n - 1) * 40, sy = 310;
      const x = lerp(sx, ex, e), y = lerp(sy, ey, e) - Math.sin(e * Math.PI) * 190, sc = .6 + .6 * Math.sin(Math.min(1, k * 1.4) * Math.PI / 2);
      g.save(); g.translate(x, y); g.rotate((1 - e) * (n - 1) * .5 + Math.sin(k * 9) * .1); g.scale(sc, sc);
      g.font = pzFont(132, 'hand', 700); g.textAlign = 'center'; g.fillStyle = 'rgba(122,82,51,.25)'; g.fillText('r', 5, 40);
      g.fillStyle = PAL.clayDeep; g.fillText('r', 0, 34); g.restore();
      if (k < .25) pzSpark(g, sx, sy - 20, 22 * Math.sin(k / .25 * Math.PI), { fill: '#f3d27a', line: null });
    });
  }
}

// ---------------------------------------------------------------------------------------------- p002
function gmIllusP002(g, t, st) {
  const ts = st.solved ? st.tSolved ?? 99 : null, s = .9;
  gmStatic(g, 'p002:board', 0, 0, IW, IH, q => {
    q.translate(600, 300);
    pzChalkboard(q, 9, { x: 0, y: 0, scale: s, t0: -9, tClaim: 1e9, tCross: 1e9, tFix: 1e9 });
    q.scale(s, s); q.translate(-620, -350);
    pzChalkText(q, 9, { text: '9.11', x: 130, y: 380, size: 190, t0: 0, dur: .01 });
    pzChalkText(q, 9, { text: '9.9', x: 800, y: 380, size: 190, t0: 0, dur: .01 });
  });
  g.save(); g.translate(600, 300); g.scale(s, s); g.translate(-620, -350);
  if (ts === null) pzChalkText(g, 9, { text: '?', x: 560, y: 380, size: 190, t0: 0, dur: .01, color: '#f6e9b8' });
  else {
    // the "?" is wiped; the sign and a zero arrive in chalk
    if (ts < .3) { g.save(); g.globalAlpha = 1 - ts / .3; pzChalkText(g, 9, { text: '?', x: 560, y: 380, size: 190, t0: 0, dur: .01, color: '#f6e9b8' }); g.restore(); }
    g.font = pzFont(190, 'hand', 700); const w99 = g.measureText('9.9').width;
    pzChalkText(g, ts, { text: '0', x: 800 + w99 - 6, y: 380, size: 190, t0: .35, dur: .35, color: '#f6e9b8' });
    pzChalkText(g, ts, { text: '<', x: 555, y: 380, size: 190, t0: 1.0, dur: .3, color: '#f6e9b8' });
    pzChalkText(g, ts, { text: '11 hundredths', x: 140, y: 520, size: 58, t0: 1.5, dur: .5, color: '#cfe3dc' });
    pzChalkText(g, ts, { text: '90 hundredths', x: 800, y: 520, size: 58, t0: 1.9, dur: .5, color: '#cfe3dc' });
    if (ts > 2.5) pzMemoTick(g, ts, { x: 1170, y: 205, size: 70, t0: 2.5, color: '#a8d39a', width: 9 });
    if (ts > .35) pzMemoUnderline(g, ts, { x: 830 + w99 - 30, y: 400, w: 100, t0: .7, color: '#f6e9b8', width: 5 });
  }
  g.restore();
}

// ---------------------------------------------------------------------------------------------- p003
const GM_P003 = { x0: 100, y0: 18, cw: 100, ch: 50, cols: 10, rows: 10 };
const GM_SQUARES = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
const GM_LOCKER_COLS = ['#5f8a83', '#6f9a8c', '#58807a', '#668f86'];
function gmLockerCell(n) { const { x0, y0, cw, ch, cols } = GM_P003, i = n - 1; return { x: x0 + (i % cols) * cw, y: y0 + Math.floor(i / cols) * ch, w: cw, h: ch }; }
function gmLockerWall(q) {
  const { x0, y0, cw, ch, cols, rows } = GM_P003, Wd = cw * cols, Ht = ch * rows;
  // wall frame
  const fr = deform(polyRect(x0 - 16, y0 - 10, Wd + 32, Ht + 22), rng('gmlf'), 1, .004);
  q.save(); q.translate(8, 12); q.globalAlpha = .22; q.fillStyle = PAL.umber; tracePoly(q, fr); q.fill(); q.restore();
  paintFill(q, gg => tracePoly(gg, fr), '#8a6a4a', { tex: .35 });
  inkPoly(q, fr, { width: 3.2, seed: 'gmlfo', wobble: .5 });
  for (let n = 1; n <= 100; n++) {
    const c = gmLockerCell(n);
    // the dark inside (shows when a door opens)
    q.fillStyle = '#3a2a22'; q.fillRect(c.x + 3, c.y + 3, c.w - 6, c.h - 6);
    q.fillStyle = 'rgba(255,220,160,.12)'; q.fillRect(c.x + 3, c.y + c.h - 12, c.w - 6, 9);
  }
}
function gmLockerDoor(g, n, k, t, hl = 0) {
  // k: 0 shut … 1 open (swung ~78° towards us on its left hinge: a narrow door in perspective, its inside showing)
  const c = gmLockerCell(n), x = c.x + 3, y = c.y + 3, w = c.w - 6, h = c.h - 6;
  if (hl > 0) {   // opened: warm light inside and its number, big
    g.save(); g.globalAlpha = hl;
    g.fillStyle = '#f7d88e'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,250,220,.6)'; g.fillRect(x + w * .25, y + 3, w * .7, 6);
    g.font = pzFont(Math.min(46, Math.max(36, GMI.min * 1.15)), 'display', 800); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = PAL.clayDeep; g.fillText(String(n), x + w * .6, y + h / 2 + 2);
    g.restore();
  }
  const th = Math.min(1, k) * 1.36, cs = Math.cos(th), sn = Math.sin(th), fx = x + w * cs, ex = 7 * sn;
  const pts = [[x, y], [fx, y - ex], [fx, y + h + ex], [x, y + h]];
  const col = GM_LOCKER_COLS[n % 4];
  g.save();
  if (k > .02) { // the door's inside face, lit from the room
    g.fillStyle = mix('#b8c8bc', col, .35 + .4 * cs); tracePoly(g, pts); g.fill();
    g.fillStyle = 'rgba(40,50,48,.25)'; g.fillRect(Math.min(x, fx), y + h * .3, Math.abs(fx - x), 3);
  } else {
    g.fillStyle = col; tracePoly(g, pts); g.fill();
    g.fillStyle = '#e8cf8a'; g.fillRect(x + 8, y + 9, 36, 24); g.strokeStyle = 'rgba(60,40,20,.55)'; g.lineWidth = 1.5; g.strokeRect(x + 8, y + 9, 36, 24);
    g.fillStyle = PZ.ink; g.font = pzFont(n === 100 ? 15 : 19, 'display', 700); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), x + 26, y + 21.5);
    g.fillStyle = '#c99a3e'; g.beginPath(); g.arc(x + w - 11, y + h / 2, 3.6, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,250,235,.18)'; g.fillRect(x + 2, y + 2, w - 4, 3);
  }
  g.strokeStyle = 'rgba(40,28,20,.8)'; g.lineWidth = 2; tracePoly(g, pts); g.stroke();
  g.restore();
}
function gmIllusP003(g, t, st) {
  const open = st.open instanceof Set ? st.open : new Set(st.open || []);
  const ts = st.solved ? st.tSolved ?? 99 : null;
  gmStatic(g, 'p003:wall', 0, 0, IW, IH, gmLockerWall);
  for (let n = 1; n <= 100; n++) {
    let k = 0, hl = 0;
    if (ts !== null) {
      const i = GM_SQUARES.indexOf(n);
      if (i >= 0) { const a = .3 + i * .42; k = gmE(ts, a, .45, ease.outBack); hl = gmK(ts, a + .2, .3); }
    } else if (open.has(n)) { k = 1; hl = .75; }
    gmLockerDoor(g, n, Math.min(1, k), t, hl);
  }
  // the memo along the bottom: the open ones are the squares
  if (ts !== null) {
    const xs = 110, step = 104;
    GM_SQUARES.forEach((n, i) => {
      const a = .3 + i * .42 + .25;
      pzMemoText(g, ts, { text: String(n), x: xs + i * step + 30, y: 616, size: 50, t0: a, align: 'center', color: PAL.clayDeep, rot: 0 });
      const sq = i + 1;
      if (ts > a + .2) pzLabel(g, `${sq}\u00b2`, xs + i * step + 30, 568, gmFs(26), { fam: 'display', weight: 600, color: PZ.inkSoft, alpha: gmK(ts, a + .2, .3) });
    });
  }
}

// ---------------------------------------------------------------------------------------------- p004
function gmTeacup(q, x, y, s) {
  q.save(); q.translate(x, y); q.scale(s, s);
  const ink = (pts, o = {}) => inkPath(q, pts, { width: 4 / s, color: PZ.ink, seed: 'gmcup' + pts.length + (o.k || ''), wobble: .6, ...o });
  // saucer
  q.save(); q.fillStyle = 'rgba(122,82,51,.18)'; q.beginPath(); q.ellipse(10, 112, 210, 34, 0, 0, 7); q.fill(); q.restore();
  paintFill(q, gg => { gg.beginPath(); gg.ellipse(0, 100, 200, 34, 0, 0, 7); }, '#f6efe0', { tex: .2 });
  q.save(); q.fillStyle = 'rgba(109,74,94,.25)'; q.beginPath(); q.ellipse(0, 104, 150, 20, 0, 0, Math.PI); q.fill(); q.restore();
  ink(polyCircle(0, 100, 200, 34, 40), { taper: false, k: 's' });
  // cup body
  const body = [...bez([-140, -20], [-140, 70], [-80, 104], [0, 104], 14), ...bez([0, 104], [80, 104], [140, 70], [140, -20], 14).slice(1)];
  paintFill(q, gg => { tracePoly(gg, body); }, '#fbf5e6', { tex: .2, shade: 'rgba(109,74,94,.28)', shadeFn: gg => gg.fillRect(40, -30, 120, 140) });
  q.save(); tracePoly(q, body); q.clip(); q.fillStyle = PAL.plum; q.globalAlpha = .85; q.fillRect(-150, 10, 300, 16); q.fillStyle = PZ.gold; q.fillRect(-150, 30, 300, 6); q.restore();
  // handle
  ink(bez([136, 0], [210, -10], [210, 70], [118, 66], 14), { width: 9 / s, taper: false, k: 'h' });
  inkPath(q, bez([136, 0], [210, -10], [210, 70], [118, 66], 14), { width: 4 / s, color: '#fbf5e6', seed: 'gmcuphi', wobble: .4, taper: false });
  ink(body, { k: 'b' });
  // the tea surface
  paintFill(q, gg => { gg.beginPath(); gg.ellipse(0, -20, 140, 28, 0, 0, 7); }, '#a8622e', { tex: .3 });
  q.save(); q.beginPath(); q.ellipse(0, -20, 140, 28, 0, 0, 7); q.clip(); q.fillStyle = 'rgba(255,220,170,.35)'; q.beginPath(); q.ellipse(-40, -28, 60, 8, -.1, 0, 7); q.fill(); q.restore();
  ink(polyCircle(0, -20, 140, 28, 40), { taper: false, k: 'r' });
  q.restore();
}
function gmMilkJug(q, x, y, s) {
  q.save(); q.translate(x, y); q.scale(s, s);
  const body = [[-46, -70], [40, -70], [52, -86], [56, -74], [46, -60], [58, 40], [40, 60], [-40, 60], [-58, 40], [-46, -60]];
  paintFill(q, gg => tracePoly(gg, crSpline(body, true, 4)), '#f2ead8', { tex: .2, shade: 'rgba(79,125,120,.25)', shadeFn: gg => gg.fillRect(10, -90, 60, 160) });
  q.save(); tracePoly(q, crSpline(body, true, 4)); q.clip(); q.fillStyle = PAL.teal; q.globalAlpha = .7; for (let i = 0; i < 5; i++) { q.beginPath(); q.arc(-30 + i * 15, 0 + (i % 2) * 14, 5, 0, 7); q.fill(); } q.restore();
  inkPoly(q, crSpline(body, true, 4), { width: 3.6 / s, seed: 'gmjug', wobble: .5 });
  inkPath(q, bez([-50, -50], [-96, -50], [-96, 30], [-54, 26], 12), { width: 6 / s, seed: 'gmjugh', taper: false, wobble: .5 });
  q.fillStyle = '#fffaf0'; q.beginPath(); q.ellipse(-2, -70, 42, 9, 0, 0, 7); q.fill();
  q.restore();
}
function gmClock(g, t, x, y, r, o = {}) {
  const { minutes = 5, k = 1, label = '5 min', seed = 'gmclk' } = o;
  g.save(); g.translate(x, y);
  g.save(); g.translate(5, 8); g.globalAlpha = .2; g.fillStyle = PAL.umber; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.restore();
  paintFill(g, gg => { gg.beginPath(); gg.arc(0, 0, r, 0, 7); }, '#fbf5e6', { tex: .15 });
  // the 5-minute wedge (from 12)
  const a0 = -Math.PI / 2, a1 = a0 + minutes / 60 * Math.PI * 2 * k;
  g.fillStyle = rgba(PAL.clay, .45); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * .86, a0, a1); g.closePath(); g.fill();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillStyle = PZ.ink; g.fillRect(Math.cos(a) * r * .8 - 2, Math.sin(a) * r * .8 - 2, 4, 4); }
  inkPoly(g, polyCircle(0, 0, r, r, 36), { width: 3.5, seed: seed + 'o', boil: pzBoil(t), wobble: .5 });
  inkPath(g, [[0, 0], [Math.cos(a1) * r * .74, Math.sin(a1) * r * .74]], { width: 4, seed: seed + 'm', boil: pzBoil(t), taper: false });
  inkPath(g, [[0, 0], [0, -r * .5]], { width: 5, seed: seed + 'h', boil: pzBoil(t), taper: false });
  g.fillStyle = PZ.ink; g.beginPath(); g.arc(0, 0, 5, 0, 7); g.fill();
  g.restore();
  if (label) gmTag(g, t, x, y + r + 40, label, { size: 36, rot: .03, seed: seed + 'l' });
}
function gmThermo(g, t, x, y, h, frac, label, sub, o = {}) {
  const { color = PAL.berry, best = false, seed = 'gmth', k = 1 } = o;
  g.save();
  g.fillStyle = '#fbf7ec'; g.beginPath(); g.roundRect(x - 16, y - h, 32, h + 20, 16); g.fill();
  const lv = h * frac * k;
  g.fillStyle = rgba(color, .9); g.fillRect(x - 8, y - lv, 16, lv + 6);
  pzBall(g, x, y + 22, 26, color);
  inkPath(g, [[x - 16, y + 4], [x - 16, y - h + 4], [x - 10, y - h - 12], [x + 10, y - h - 12], [x + 16, y - h + 4], [x + 16, y + 4]], { width: 3, seed, wobble: .4, taper: false, boil: pzBoil(t) });
  for (let i = 1; i < 6; i++) inkPath(g, [[x + 16, y - h * i / 6], [x + 26, y - h * i / 6]], { width: 2, seed: seed + i });
  g.restore();
  pzLabel(g, label, x, y + 92, gmFs(38), { fam: 'display', weight: 700, color: best ? PAL.clayDeep : PZ.ink });
  pzLabel(g, sub, x, y + 92 + gmFs(38) * 1.15, gmFs(42), { fam: 'hand', weight: 700, color: best ? PAL.clayDeep : PZ.inkSoft });
}
function gmIllusP004(g, t, st) {
  const ts = st.solved ? st.tSolved ?? 99 : null, sk = ts === null ? 0 : gmE(ts, 0, .6);
  // the still life slides left to make room for the thermometers when solved
  const dx = -190 * sk, sc = 1 - .2 * sk;
  g.save(); g.translate(dx + 600 * (1 - sc) * 0, 0);
  g.save(); g.translate(500, 360); g.scale(sc, sc); g.translate(-500, -360);
  gmStatic(g, 'p004:still', 0, 0, IW, IH, q => {
    gmPool(q, 'p004pool', 520, 420, 380, 170, PAL.gold, .04);
    gmTeacup(q, 440, 400, 1.15);
    gmMilkJug(q, 760, 430, 1.05);
    // the fridge-cold bottle hint: a milk bottle with a frosty tag
    q.save(); q.translate(905, 380);
    const bot = crSpline([[-34, 120], [34, 120], [36, -10], [20, -50], [20, -92], [-20, -92], [-20, -50], [-36, -10]], true, 4);
    paintFill(q, gg => tracePoly(gg, bot), '#fbfbf4', { tex: .15, shade: 'rgba(120,160,180,.35)', shadeFn: gg => gg.fillRect(8, -100, 40, 230) });
    q.fillStyle = PAL.teal; q.fillRect(-22, -104, 44, 16);
    inkPoly(q, bot, { width: 3.4, seed: 'gmbot', wobble: .5 });
    q.restore();
  });
  // frost sparkle on the bottle
  for (let i = 0; i < 3; i++) { const k = (t * .7 + i * .33) % 1; if (k < .4) pzSpark(g, 890 + i * 18, 330 + i * 40, 10 * Math.sin(k / .4 * Math.PI), { fill: '#d8eef2', line: null }); }
  pzLabel(g, '4 \u00b0C', 905, 560, gmFs(34), { fam: 'hand', weight: 700, color: PAL.teal });
  // steam from the cup
  for (let i = 0; i < 3; i++) {
    const ph = (t * .45 + i / 3) % 1, x = 400 + i * 40, y0 = 340;
    const pts = []; for (let j = 0; j <= 16; j++) { const v = j / 16; pts.push([x + Math.sin(v * 6 + t * 1.5 + i) * 18 * v, y0 - v * 170 - ph * 40]); }
    inkPath(g, pts, { width: 10, color: '#ffffff', seed: 'gmst' + i, wobble: .3, alpha: .8 * Math.sin(ph * Math.PI) });
    inkPath(g, pts, { width: 3, color: PZ.inkSoft, seed: 'gmst2' + i, wobble: .3, alpha: .55 * Math.sin(ph * Math.PI) });
  }
  g.restore();
  g.restore();
  gmClock(g, t, 160 + 0 * sk, 140, 80 - 10 * sk, { k: 1 });
  if (ts !== null) {
    const k = gmE(ts, .5, .9);
    g.save(); g.globalAlpha = gmK(ts, .4, .3);
    pzLabel(g, 'milk in\u2026', 980, 62, gmFs(40), { fam: 'hand', weight: 700, color: PZ.ink });
    gmThermo(g, t, 870, 370, 250, .78, 'now', '\u2248 59.0 \u00b0C', { best: true, k, seed: 'gmth1' });
    gmThermo(g, t, 1090, 370, 250, .755, 'later', '\u2248 58.5 \u00b0C', { color: PAL.clay, k, seed: 'gmth2' });
    g.restore();
    if (ts > 1.6) pzSpark(g, 830, 112, 22 * gmE(ts, 1.6, .3, ease.outBack), { t, seed: 'gmthsp' });
    pzLabel(g, 'illustrative numbers', 980, 626, gmFs(26), { style: 'italic', color: PZ.inkSoft, alpha: gmK(ts, 1.2, .4) });
  }
}

// ---------------------------------------------------------------------------------------------- p005
// A glass cup in cross-section: walls at x 330 / 870, floor at y 560, surface at y 160.
const GM_CUP = { L: 330, R: 870, top: 112, surf: 165, floor: 560, cx: 600 };
const GM_P005_SPOTS = { A: { x: 392, y: 528 }, B: { x: 600, y: 540 }, C: { x: 600, y: 158 }, D: { x: 790, y: 330 } };
function gmCupPath(g, inset = 0) {
  const { L, R, top, floor } = GM_CUP, rr = 70;
  g.beginPath(); g.moveTo(L + inset, top); g.lineTo(L + inset, floor - rr); g.quadraticCurveTo(L + inset, floor - inset, L + rr, floor - inset);
  g.lineTo(R - rr, floor - inset); g.quadraticCurveTo(R - inset, floor - inset, R - inset, floor - rr); g.lineTo(R - inset, top);
}
function gmLeaf(g, x, y, a, s, col = '#5a5a26') {
  g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
  g.fillStyle = col; g.beginPath(); g.moveTo(-14, 0); g.quadraticCurveTo(0, -9, 14, 0); g.quadraticCurveTo(0, 9, -14, 0); g.fill();
  g.strokeStyle = '#2e2a14'; g.lineWidth = 1.6; g.stroke();
  g.strokeStyle = 'rgba(220,210,140,.6)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-10, 0); g.lineTo(10, 0); g.stroke();
  g.restore();
}
function gmIllusP005(g, t, st) {
  const ts = st.solved ? st.tSolved ?? 99 : null, { L, R, top, surf, floor, cx } = GM_CUP;
  gmStatic(g, 'p005:cup', 0, 0, IW, IH, q => {
    gmPool(q, 'p005pool', 600, 360, 380, 270, PAL.sky, .04);
    // tea (a deep amber wash, lighter at the top)
    q.save(); gmCupPath(q, 8); q.lineTo(R - 8, surf); q.lineTo(L + 8, surf); q.closePath(); q.clip();
    const gr = q.createLinearGradient(0, surf, 0, floor); gr.addColorStop(0, 'rgba(196,124,62,.55)'); gr.addColorStop(1, 'rgba(150,80,36,.72)');
    q.fillStyle = gr; q.fillRect(L, surf, R - L, floor - surf);
    q.globalCompositeOperation = 'multiply'; q.globalAlpha = .25; q.fillStyle = q.createPattern(charTexture(), 'repeat'); q.fillRect(L, surf, R - L, floor - surf);
    q.restore();
    // the glass: thick walls with highlights
    q.save(); q.lineCap = 'round';
    q.strokeStyle = 'rgba(185,215,215,.55)'; q.lineWidth = 16; gmCupPath(q, 0); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,.75)'; q.lineWidth = 4; q.beginPath(); q.moveTo(L + 16, top + 40); q.lineTo(L + 16, floor - 120); q.stroke();
    q.restore();
    const outline = []; { const rr = 70; outline.push([L - 8, top - 4], [L - 8, floor - rr]); for (let i = 0; i <= 8; i++) { const a = Math.PI - i / 8 * Math.PI / 2; outline.push([L + rr - 8 + Math.cos(a) * (rr), floor - rr + Math.sin(a) * (rr + 8)]); } outline.push([R - rr + 8, floor + 8]); for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 - i / 8 * Math.PI / 2; outline.push([R - rr + 8 + Math.cos(a) * rr, floor - rr + Math.sin(a) * (rr + 8)]); } outline.push([R + 8, top - 4]); }
    inkPath(q, outline, { width: 4.2, seed: 'gmcupo', wobble: .6, taper: false });
    // the saucer line under the glass
    inkPath(q, [[L - 80, floor + 30], [R + 80, floor + 30]], { width: 3, seed: 'gmcupb', wobble: .6, color: PZ.inkSoft });
  });
  // the surface, with the stir: a swirl ellipse and a spoon-arrow
  const spin = t * 1.4;
  g.save(); g.strokeStyle = 'rgba(80,40,20,.55)'; g.lineWidth = 3;
  g.beginPath(); g.ellipse(cx, surf, (R - L) / 2 - 12, 16, 0, 0, 7); g.stroke(); g.restore();
  inkPath(g, [[L + 12, surf], [R - 12, surf]], { width: 3.4, seed: 'gmsurf', boil: pzBoil(t), color: '#6a3a1e', taper: false, wobble: .5 });
  const swirlK = ts === null ? 1 : 1 - gmK(ts, 0, 1.2);
  if (swirlK > 0) {
    g.save(); g.globalAlpha = swirlK;
    const arc = []; for (let i = 0; i <= 24; i++) { const a = spin + i / 24 * 4.2; arc.push([cx + Math.cos(a) * 200, surf - 52 + Math.sin(a) * 26]); }
    pzStrokeOn(g, arc, 1, { width: 5, color: PZ.memo, seed: 'gmswirl', boil: pzBoil(t) });
    const a = spin + 4.2, hx = cx + Math.cos(a) * 200, hy = surf - 52 + Math.sin(a) * 26, d = [-Math.sin(a) * 200, Math.cos(a) * 26], dl = Math.hypot(d[0], d[1]), ux = d[0] / dl, uy = d[1] / dl;
    for (const s of [-1, 1]) inkPath(g, [[hx, hy], [hx - ux * 22 - uy * 12 * s, hy - uy * 22 + ux * 12 * s]], { width: 5, color: PZ.memo, seed: 'gmswh' + s });
    g.restore();
  }
  // leaves: swirling in the tea; once solved they sink and slide inward to the middle of the floor
  const N = 16;
  for (let i = 0; i < N; i++) {
    const r = rng('gmleaf' + i), ph = r() * 6.28, rad = r.range(.25, .95), y = lerp(surf + 40, floor - 30, r()), om = r.range(.8, 1.4);
    let x = cx + Math.cos(spin * om + ph) * rad * ((R - L) / 2 - 40), yy = y + Math.sin(t * 1.3 + ph) * 6, a = Math.sin(spin * om + ph) * .8, sc = .8 + .4 * (Math.sin(spin * om + ph) * .5 + .5);
    if (ts !== null) {
      const k1 = gmE(ts, .4 + r() * .3, 1.4), k2 = gmE(ts, 1.6 + r() * .4, 1.8);
      const fx = cx + Math.cos(ph + 1.1 * i) * lerp(220, 0, 0), restX = cx + (r() - .5) * 70, restY = floor - 18 - (i % 3) * 7;
      const edgeX = cx + (i % 2 ? -1 : 1) * r.range(170, 230);
      x = lerp(lerp(x, edgeX, k1), restX, k2); yy = lerp(lerp(yy, floor - 18, k1), restY, k2); a = lerp(a, (r() - .5) * .6, k1); sc = lerp(sc, 1, k1);
    }
    gmLeaf(g, x, yy, a, sc * 1.45);
  }
  // the secondary flow, once solved: two loops (in along the floor, up the middle, out along the top, down the sides)
  if (ts !== null) {
    const fa = gmK(ts, 1.2, .6);
    if (fa > 0) {
      g.save(); g.globalAlpha = fa;
      for (const sd of [-1, 1]) {
        const xo = cx + sd * 215, xi = cx + sd * 30, yb = floor - 50, yt = surf + 50;
        const loop = [[xo, yt + 30], [xo, yb - 30], [xo - sd * 40, yb], [xi + sd * 40, yb], [xi, yb - 40], [xi, yt + 40], [xi + sd * 40, yt], [xo - sd * 40, yt], [xo, yt + 30]];
        const R2 = pzResample(crSpline(loop, false, 6), 6), n = R2.length, off = Math.floor((ts * 40) % 20);
        for (let j = off; j < n - 1; j += 20) {
          const seg = R2.slice(j, Math.min(n, j + 11)); if (seg.length < 3) continue;
          inkPath(g, seg, { width: 4.5, color: PZ.memo, seed: 'gmflow' + sd + j, wobble: .4, taper: false, alpha: .9 });
          const [x1, y1] = seg[seg.length - 1], [x0, y0] = seg[seg.length - 3], ang = Math.atan2(y1 - y0, x1 - x0);
          for (const s of [-1, 1]) inkPath(g, [[x1, y1], [x1 + Math.cos(ang + Math.PI + s * .55) * 16, y1 + Math.sin(ang + Math.PI + s * .55) * 16]], { width: 4, color: PZ.memo, seed: 'gmfh' + sd + j + s, taper: false });
        }
      }
      g.restore();
      pzMemoText(g, ts, { text: 'in along the floor', x: cx, y: floor + 62, size: gmFs(40), t0: 2.0, align: 'center', color: PZ.memo, rot: 0 });
      if (ts > 2.4) pzMemoCircle(g, ts, { x: cx, y: floor - 22, rx: 70, ry: 30, t0: 2.4, dur: .4, color: PAL.clayDeep, seed: 'gmpile' });
    }
  }
}

// ---------------------------------------------------------------------------------------------- p006
// A pond in cross-section: water from x 120 to 1080, surface at y 300 (drops a little when the stone goes in),
// bed at y 600; the boat floats left of centre; a gauge post stands right.
const GM_POND = { L: 110, R: 1090, surf: 300, bed: 598, post: 900 };
function gmBoatShape(q) {
  // hull in local coords (waterline at y = 0 when loaded), keel at y ≈ 60
  return crSpline([[-210, -60], [210, -60], [190, -10], [140, 40], [0, 62], [-140, 40], [-195, -10]], true, 6);
}
function gmBoatSprite() {
  return cached('gm:boat', 520, 260, q => {
    q.translate(260, 150);
    const hull = gmBoatShape(q);
    paintFill(q, gg => tracePoly(gg, hull), '#a0603a', { tex: .35, shade: 'rgba(60,30,20,.4)', shadeFn: gg => gg.fillRect(-220, 10, 440, 80) });
    q.save(); tracePoly(q, hull); q.clip(); q.fillStyle = '#d97757'; q.fillRect(-230, -62, 460, 14); q.fillStyle = 'rgba(255,230,190,.5)'; q.fillRect(-230, -60, 460, 4);
    q.strokeStyle = 'rgba(60,30,20,.5)'; q.lineWidth = 2; for (const y of [-26, 6, 34]) { q.beginPath(); q.moveTo(-230, y); q.quadraticCurveTo(0, y + 18, 230, y); q.stroke(); } q.restore();
    inkPoly(q, hull, { width: 4, seed: 'gmhull', wobble: .5 });
    // oars resting
    inkPath(q, [[-120, -80], [150, -40]], { width: 8, color: '#7a5233', seed: 'gmoar', taper: false });
    inkPath(q, [[-120, -80], [150, -40]], { width: 2.4, seed: 'gmoar2', taper: false, alpha: .7 });
    q.save(); q.translate(165, -37); q.rotate(.15); q.fillStyle = '#c99060'; q.beginPath(); q.ellipse(0, 0, 30, 10, 0, 0, 7); q.fill(); q.restore();
  });
}
function gmStone(g, x, y, s, t) {
  const p = deform(polyCircle(0, 0, 62, 46, 16), rng('gmstone'), 2, .08);
  g.save(); g.translate(x, y); g.scale(s, s);
  paintFill(g, gg => tracePoly(gg, p), '#8e8a86', { tex: .45, shade: 'rgba(40,40,50,.45)', shadeFn: gg => gg.fillRect(-10, 0, 90, 60) });
  g.fillStyle = 'rgba(255,250,235,.35)'; g.beginPath(); g.ellipse(-20, -20, 22, 9, -.3, 0, 7); g.fill();
  inkPoly(g, p, { width: 4 / s, seed: 'gmstoneo', boil: pzBoil(t), wobble: .5 });
  g.restore();
}
function gmIllusP006(g, t, st) {
  const ts = st.solved ? st.tSolved ?? 99 : null, { L, R, surf, bed, post } = GM_POND;
  // timeline (solved): .3 lift → over the side, splash at 1.25, on the bed by 2.6; the boat rises 1.25 → 2.2; the level drops 1.3 → 2.4
  const thrown = ts === null ? 0 : gmK(ts, .3, .95), sink = ts === null ? 0 : gmE(ts, 1.25, 1.35, ease.inOutQ);
  const drop = ts === null ? 0 : gmE(ts, 1.3, 1.1), rise = ts === null ? 0 : gmE(ts, 1.25, .95, ease.outBack);
  const dLevel = 26 * drop, ws = surf + dLevel;
  const boatX = 400, bob = Math.sin(t * 1.4) * 3, boatY = ws + bob - 44 * rise;
  gmStatic(g, 'p006:bank', 0, 0, IW, IH, q => {
    gmPool(q, 'p006sky', 600, 140, 520, 130, PAL.sky, .03);
    const bank = side => side < 0 ? [[-10, 230], [L + 40, 250], [L + 10, 330], [L - 10, 620], [-10, 640]] : [[1210, 230], [R - 40, 250], [R - 10, 330], [R + 10, 620], [1210, 640]];
    for (const sd of [-1, 1]) { paintFill(q, gg => tracePoly(gg, bank(sd)), '#8fa27c', { tex: .35, shade: 'rgba(60,70,40,.4)', shadeFn: gg => gg.fillRect(-20, 320, 1240, 340) }); inkPoly(q, bank(sd), { width: 3.4, seed: 'gmbank' + sd, wobble: .6 }); }
    for (let i = 0; i < 9; i++) { const r = rng('gmreed' + i), x = i < 5 ? r.range(10, 120) : r.range(1080, 1190), y = 240 + r.range(-6, 10); inkPath(q, bez([x, y], [x + 4, y - 40], [x - 6, y - 80], [x + r.range(-14, 14), y - r.range(90, 130)], 10), { width: 4, color: '#4f6e36', seed: 'gmrd' + i }); }
    const bedPts = [[L - 10, bed - 8], [300, bed + 4], [600, bed - 4], [900, bed + 6], [R + 10, bed - 6], [R + 10, 650], [L - 10, 650]];
    paintFill(q, gg => tracePoly(gg, bedPts), '#b39478', { tex: .4 });
    inkPath(q, bedPts.slice(0, 5), { width: 3, seed: 'gmbed', wobble: .6, color: PZ.inkSoft });
    for (let i = 0; i < 14; i++) { const r = rng('gmpeb' + i), x = r.range(L + 30, R - 30); q.fillStyle = r.pick(['#9a8a7a', '#a89888', '#8a7a6c']); q.beginPath(); q.ellipse(x, bed + r.range(2, 18), r.range(6, 14), r.range(4, 8), 0, 0, 7); q.fill(); }
  });
  // the gauge post (behind the water)
  const px = post;
  g.save(); g.fillStyle = '#c99a6a'; g.fillRect(px - 16, 130, 32, bed - 120); g.fillStyle = 'rgba(80,50,30,.3)'; g.fillRect(px + 4, 130, 12, bed - 120); g.restore();
  for (let y = 160; y < bed; y += 20) { const big = (y - 160) % 100 === 0; g.fillStyle = PZ.ink; g.fillRect(px - 16, y - 1.5, big ? 26 : 14, 3); }
  inkPath(g, [[px - 16, 130], [px - 16, bed + 4], [px + 16, bed + 4], [px + 16, 130], [px - 16, 130]], { width: 3, seed: 'gmpost', taper: false, boil: pzBoil(t) });
  // the stone once it's in the water (drawn before the water so the water tints it)
  let sx = null, sy = null;
  if (ts !== null && thrown >= .05) {
    if (ts < 1.25) { const k = ease.inOutQ(thrown); sx = lerp(boatX + 10, 680, k); sy = boatY - 64 - Math.sin(k * Math.PI) * 150; }
    else { sx = 680 + 20 * sink; sy = lerp(ws - 6, bed - 50, sink); }
  }
  if (sx !== null && ts >= 1.25) gmStone(g, sx, sy, 1.15, t);
  // the boat: the stone sits inside it (behind the near side of the hull) until it's thrown
  const bs = gmBoatSprite();
  g.save(); g.translate(boatX, boatY); g.rotate(Math.sin(t * 1.1) * .015 + (thrown > 0 && thrown < 1 ? Math.sin(thrown * Math.PI) * -.05 : 0));
  if (thrown < .05) gmStone(g, 10, -56, 1.35, t);
  g.drawImage(bs, -260, -150);
  g.restore();
  // the water, translucent, over everything below the surface (hull, stone, bed)
  g.save();
  g.beginPath(); g.moveTo(L + 6, ws); g.lineTo(R - 6, ws); g.lineTo(R + 4, bed + 30); g.lineTo(L - 4, bed + 30); g.closePath();
  const gr = g.createLinearGradient(0, ws, 0, bed); gr.addColorStop(0, 'rgba(110,165,178,.5)'); gr.addColorStop(1, 'rgba(55,105,118,.62)');
  g.fillStyle = gr; g.fill();
  g.restore();
  inkPath(g, [[L + 6, ws], [R - 6, ws]], { width: 3.5, color: '#2f5d6a', seed: 'gmsurf6', boil: pzBoil(t), taper: false, wobble: .5 });
  bgWaterGlints(g, t, L + 40, ws + 4, R - L - 80, 40, { n: 40, seed: 'gmpg', size: .9 });
  for (const sd of [-1, 1]) inkPath(g, [[boatX + sd * 200, ws + 1], [boatX + sd * 250, ws + 1]], { width: 3, color: '#ffffff', seed: 'gmrip' + sd, alpha: .8 });
  // the stone in flight (above the water)
  if (sx !== null && ts < 1.25) gmStone(g, sx, sy, 1.15, t);
  if (ts !== null && ts > 1.25 && ts < 2.2) { // splash + rings
    const k = (ts - 1.25) / .95;
    for (let i = 0; i < 3; i++) { const rr = 30 + k * 160 + i * 30; g.save(); g.globalAlpha = (1 - k) * .8; g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.beginPath(); g.ellipse(680, ws, rr, rr * .12, 0, 0, 7); g.stroke(); g.restore(); }
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .3, d = k * 120; g.fillStyle = `rgba(230,245,250,${1 - k})`; g.beginPath(); g.arc(680 + Math.cos(a) * d, ws + Math.sin(a) * d + k * k * 120, 7 * (1 - k) + 2, 0, 7); g.fill(); }
  }
  if (ts !== null && ts > 2.6) for (let i = 0; i < 4; i++) { const k = ((ts - 2.6) * .6 + i * .25) % 1; g.fillStyle = `rgba(230,245,250,${.7 * (1 - k)})`; g.beginPath(); g.arc(700 + Math.sin(k * 8 + i) * 8, lerp(bed - 76, ws + 8, k), 5, 0, 7); g.fill(); }
  // the level on the post: the old line stays (dashed), the new one is lower
  if (drop > 0) {
    g.save(); g.setLineDash([12, 9]); g.strokeStyle = PAL.clayDeep; g.lineWidth = 4; g.beginPath(); g.moveTo(px - 80, surf); g.lineTo(px + 60, surf); g.stroke(); g.restore();
    gmTag(g, t, px - 150, surf - 34, 'before', { size: 30, seed: 'gmbef', color: PAL.clayDeep, alpha: gmK(drop, 0, .3) });
    if (drop > .5) {
      gmTag(g, t, px - 150, ws + 40, 'after', { size: 30, seed: 'gmaft', color: '#2f5d6a', alpha: gmK(drop, .5, .3), rot: .04 });
      pzMemoArrow(g, ts, { from: [px + 44, surf - 46], to: [px + 44, ws - 4], t0: 2.0, dur: .4, color: PAL.clayDeep, bend: 0, head: 16, width: 4.5 });
    }
  }
  if (rise > .6) pzMemoText(g, ts, { text: 'the boat rides higher', x: boatX, y: boatY - 150, size: gmFs(40), t0: 2.1, align: 'center', color: PZ.memo, rot: -.03 });
}

// ---------------------------------------------------------------------------------------------- p007
// The clock tower in cut-away: three flights zig-zag from the door (bottom left) to the bell room (top right).
// Yesterday Hilde climbed it from 9:00; today she comes down from 9:00. Some step is the same place at the same time.
const GM_TOWER = { L: 300, R: 880, floors: [616, 476, 336, 196], fx0: 380, fx1: 780 };
const GM_TPATH = (() => {
  const { floors: F, fx0, fx1 } = GM_TOWER;
  const pts = [[330, F[0]], [fx0, F[0]], [fx1, F[1]], [fx1 + 50, F[1]], [fx1, F[1]], [fx0, F[2]], [fx0 - 50, F[2]], [fx0, F[2]], [fx1, F[3]], [840, F[3]]];
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, L, len: L[L.length - 1] };
})();
// position and heading (+1 right, −1 left) at fraction u of the way up
function gmStairPoint(u) {
  const { pts, L, len } = GM_TPATH, d = clamp(u) * len;
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const a = pts[i - 1], b = pts[i], k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.sign(b[0] - a[0]) || 1];
}
// u on the stairs as a function of the clock (minutes past 9) for the two walks (deliberately uneven paces)
const gmUp = m => clamp(Math.pow(m / 48, .8));           // yesterday: brisk at first, slower near the top
const gmDown = m => clamp(1 - Math.pow(m / 30, 1.3));    // today: a slow start, then quicker down
const GM_MEET = (() => { let lo = 0, hi = 30; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (gmUp(m) < gmDown(m)) lo = m; else hi = m; } return (lo + hi) / 2; })();
function gmMiniHilde(g, t, x, y, s, o = {}) {
  const { dir = 1, ghost = false, walking = true } = o;
  g.save(); g.translate(x, y); if (dir < 0) g.scale(-1, 1);
  // yesterday is a pale, blue-grey memory of her; both are sprites (one per walk drawing)
  const c = gmMiniSprite(t, walking, s, ghost);
  if (ghost) g.globalAlpha *= .62;
  g.drawImage(c, -c.width / 4, -c.height / 2 * .86, c.width / 2, c.height / 2);
  g.restore();
}
function gmMiniSprite(t, walking, s, ghost) {
  const fr = walking ? Math.floor(t * 8) % 4 : 9;
  return cached('gm:mini' + fr + ':' + s + ':' + ghost, 400, 400, q => {
    q.scale(2, 2); q.translate(100, 172);
    drawProfessorFull(q, 0, 0, s, { t: 0, pose: walking ? 'walk' : 'stand', trunk: false, yaw: walking ? .95 : .5, frame: walking ? fr : 0, shadow: false });
    if (ghost) { q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-atop'; q.fillStyle = 'rgba(150,175,200,.55)'; q.fillRect(0, 0, 400, 400); }
  });
}
function gmMiniClock(g, t, x, y, r, mins, o = {}) {
  g.save(); g.translate(x, y);
  if (o.case) { g.fillStyle = o.case; g.beginPath(); g.arc(0, 0, r * 1.18, 0, 7); g.fill(); }
  g.fillStyle = '#fbf5e6'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillStyle = PZ.ink; const d = i % 3 ? 2.5 : 4; g.fillRect(Math.cos(a) * r * .8 - d / 2 * r / 30, Math.sin(a) * r * .8 - d / 2 * r / 30, d * r / 30, d * r / 30); }
  const hA = (9 + mins / 60) / 12 * Math.PI * 2 - Math.PI / 2, mA = mins / 60 * Math.PI * 2 - Math.PI / 2;
  g.strokeStyle = PZ.ink; g.lineCap = 'round';
  g.lineWidth = r * .12; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(hA) * r * .5, Math.sin(hA) * r * .5); g.stroke();
  g.lineWidth = r * .07; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(mA) * r * .78, Math.sin(mA) * r * .78); g.stroke();
  g.fillStyle = PAL.clayDeep; g.beginPath(); g.arc(0, 0, r * .07, 0, 7); g.fill();
  g.restore();
  inkPoly(g, polyCircle(x, y, r, r, 32), { width: Math.max(2.5, r * .06), seed: 'gmmc' + Math.round(x), boil: pzBoil(t), wobble: .4 });
}
function gmTowerBase(q) {
  const { L, R, floors: F, fx0, fx1 } = GM_TOWER;
  // sky behind the tower and a few far roofs
  gmPool(q, 'p007sky', 600, 300, 600, 300, PAL.sky, .014);
  const roofs = [[0, 640], [0, 520], [60, 470], [120, 520], [180, 490], [240, 530], [L, 520], [L, 640]], roofsR = [[R, 640], [R, 500], [960, 450], [1020, 500], [1080, 470], [1150, 520], [1200, 500], [1200, 640]];
  for (const rp of [roofs, roofsR]) { paintFill(q, gg => tracePoly(gg, rp), '#b9c4a4', { tex: .3 }); inkPath(q, rp.slice(1, -1), { width: 2.4, color: PZ.inkSoft, seed: 'gmfr' + rp[1][1], wobble: .5 }); }
  // the tower: walls in section, a pointed roof, the clock in its gable
  const T = [[L - 30, 640], [L - 30, 110], [590, 4], [R + 30, 110], [R + 30, 640]];
  paintFill(q, gg => tracePoly(gg, T), '#d9b98e', { tex: .35 });
  paintFill(q, gg => { gg.beginPath(); gg.moveTo(L - 54, 118); gg.lineTo(590, -8); gg.lineTo(R + 54, 118); gg.lineTo(R + 30, 128); gg.lineTo(590, 18); gg.lineTo(L - 30, 128); gg.closePath(); }, '#a24f3a', { tex: .35 });
  // the inside, cut open
  paintFill(q, gg => gg.rect(L, 112, R - L, 528), '#efdcb8', { tex: .3, shade: 'rgba(120,80,50,.18)', shadeFn: gg => gg.fillRect(L, 112, 60, 528) });
  q.save(); q.beginPath(); q.rect(L, 112, R - L, 528); q.clip(); q.strokeStyle = 'rgba(160,110,70,.2)'; q.lineWidth = 2;
  for (let y = 120; y < 640; y += 32) { q.beginPath(); q.moveTo(L, y); q.lineTo(R, y); q.stroke(); for (let x = L + ((y / 32) % 2) * 36; x < R; x += 72) { q.beginPath(); q.moveTo(x, y); q.lineTo(x, y + 32); q.stroke(); } }
  q.restore();
  // windows (arched slits)
  for (const [x, y] of [[480, 540], [700, 398], [480, 262]]) {
    const win = gg => { gg.beginPath(); gg.moveTo(x - 20, y + 46); gg.lineTo(x - 20, y); gg.arc(x, y, 20, Math.PI, 0); gg.lineTo(x + 20, y + 46); gg.closePath(); };
    paintFill(q, win, '#a9c6d2', { tex: .2 }); q.save(); q.strokeStyle = PZ.ink; q.lineWidth = 2.6; win(q); q.stroke(); q.restore();
  }
  // floors / landings
  const slab = (x0, x1, y) => { paintFill(q, gg => gg.rect(x0, y, x1 - x0, 16), '#8a5634', { tex: .35 }); inkPath(q, [[x0, y], [x1, y]], { width: 3, seed: 'gmsl' + x0 + y, taper: false }); };
  slab(L, R, F[0]); slab(fx1 - 4, R, F[1]); slab(L, fx0 + 4, F[2]); slab(fx1 - 4, R, F[3]);
  paintFill(q, gg => gg.rect(L, F[0] + 16, R - L, 40), '#6a3e24', { tex: .35 });
  // the flights (stepped, with a solid stringer under them)
  const flight = (x0, y0, x1, y1, n, key) => {
    const st = [];
    for (let i = 0; i < n; i++) { const xa = lerp(x0, x1, i / n), xb = lerp(x0, x1, (i + 1) / n), yb = lerp(y0, y1, (i + 1) / n); st.push([xa, lerp(y0, y1, i / n)], [xa, yb]); if (i === n - 1) st.push([xb, yb]); }
    const under = [...st, [x1, y1 + 16], [x0 + Math.sign(x1 - x0) * 30, y0 + 16]];
    paintFill(q, gg => tracePoly(gg, under), '#b07a4c', { tex: .35, shade: 'rgba(60,30,20,.3)', shadeFn: gg => { gg.beginPath(); gg.moveTo(x0, y0 + 2); gg.lineTo(x1, y1 + 16); gg.lineTo(x1, y1 + 30); gg.lineTo(x0, y0 + 30); gg.fill(); } });
    inkPath(q, st, { width: 3.2, seed: 'gmfl' + key, wobble: .5, taper: false });
    inkPath(q, [[x0 + Math.sign(x1 - x0) * 30, y0 + 16], [x1, y1 + 16]], { width: 2.6, seed: 'gmflu' + key, wobble: .5, taper: false });
    inkPath(q, [[x0, y0 - 78], [x1, y1 - 78]], { width: 3.4, seed: 'gmrail' + key, wobble: .5, taper: false, color: '#5a3420' });
    for (let i = 0; i <= 4; i++) { const x = lerp(x0, x1, i / 4), y = lerp(y0, y1, i / 4); inkPath(q, [[x, y - 78], [x, y]], { width: 2, seed: 'gmbal' + key + i, wobble: .4, color: '#5a3420' }); }
  };
  flight(fx0, F[0], fx1, F[1], 9, 'a'); flight(fx1, F[1], fx0, F[2], 9, 'b'); flight(fx0, F[2], fx1, F[3], 9, 'c');
  // the door at the bottom, the bell up in the roof
  paintFill(q, gg => { gg.beginPath(); gg.moveTo(L + 4, F[0]); gg.lineTo(L + 4, F[0] - 92); gg.arc(L + 34, F[0] - 92, 30, Math.PI, 0); gg.lineTo(L + 64, F[0]); gg.closePath(); }, '#4e3426', { tex: .3 });
  inkPath(q, [[590, 20], [590, 52]], { width: 3, seed: 'gmbellr', taper: false }); q.save(); q.translate(590, 82);
  const bell = crSpline([[-30, 34], [30, 34], [23, 0], [16, -22], [-16, -22], [-23, 0]], true, 4);
  paintFill(q, gg => tracePoly(gg, bell), PZ.brass, { tex: .3, shade: 'rgba(120,80,20,.4)', shadeFn: gg => gg.fillRect(4, -30, 40, 80) }); inkPoly(q, bell, { width: 3, seed: 'gmbell' }); q.restore();
  // outer walls and roof in ink
  inkPath(q, [[L, 640], [L, 112]], { width: 5, seed: 'gmwl', taper: false }); inkPath(q, [[R, 640], [R, 112]], { width: 5, seed: 'gmwr', taper: false });
  inkPath(q, [[L - 54, 118], [590, -8], [R + 54, 118]], { width: 4, seed: 'gmroof', wobble: .5 });
  // the clock's iron bracket on the outer wall
  inkPath(q, [[R + 30, 196], [950, 200]], { width: 9, color: '#3e3230', seed: 'gmbrk', taper: false }); inkPath(q, bez([R + 30, 260], [920, 250], [940, 224], [950, 206], 10), { width: 5, color: '#3e3230', seed: 'gmbrk2', taper: false });
}
// Before the solve: two separate little pictures of the same tower, so nothing hints that the two walks overlap.
// Yesterday she starts up from the door at 9:00; today she starts down from the top at 9:00.
function gmP007Panels(g, t, alpha) {
  if (alpha <= 0) return;
  const sc = .72, PW = 560, PH = 580;
  for (const i of [0, 1]) {
    const cx = i ? 905 : 295, x0 = cx - PW / 2, y0 = 34, yest = i === 0;
    g.save(); g.globalAlpha *= alpha;
    const fr = deform(polyRect(x0, y0, PW, PH), rng('gmp7f' + i), 1, .004);
    g.save(); g.translate(6, 9); g.globalAlpha *= .2; g.fillStyle = PAL.umber; tracePoly(g, fr); g.fill(); g.restore();
    g.fillStyle = '#f8efd8'; tracePoly(g, fr); g.fill();
    g.save(); tracePoly(g, fr); g.clip();
    const ox = cx - 590 * sc, oy = y0 + 70 + 8 * sc;
    g.save(); g.translate(ox, oy); g.scale(sc, sc);
    gmStatic(g, 'p007:tower', 0, 0, IW, IH, gmTowerBase);
    const p = gmStairPoint(yest ? 0 : 1);
    gmMiniHilde(g, t, p[0] + (yest ? 8 : -12), p[1], .27, { dir: yest ? 1 : -1, ghost: yest, walking: false });
    // which way she goes: an arrow along her first flight
    const a = gmStairPoint(yest ? .03 : .97), b = gmStairPoint(yest ? .26 : .74);
    pzMemoArrow(g, 9, { from: [a[0] + (yest ? 50 : -50), a[1] - 120], to: [b[0], b[1] - 120], t0: 0, dur: .1, color: yest ? '#4f6f8a' : PAL.clayDeep, bend: 0, head: 26, width: 7, seed: 'gmp7a' + i });
    g.restore();
    gmMiniClock(g, t, x0 + PW - 64, y0 + 66, 44, 0, { case: '#8a5634' });
    g.restore();
    inkPoly(g, fr, { width: 3, seed: 'gmp7fo' + i, boil: pzBoil(t), wobble: .5, color: PZ.inkSoft });
    gmTag(g, t, x0 + 120, y0 + 50, yest ? 'yesterday' : 'today', { size: 44, seed: 'gmp7t' + i, color: yest ? '#4f6f8a' : PZ.ink, rot: -.04 });
    gmTag(g, t, x0 + 120, y0 + 50 + gmFs(44) * 1.3, yest ? '9:00 \u2191 up' : '9:00 \u2193 down', { size: 34, seed: 'gmp7u' + i, color: PZ.inkSoft, rot: .03 });
    g.restore();
  }
}
function gmIllusP007(g, t, st) {
  gmIllusP007Main(g, t, st);
  const ts = st.solved ? st.tSolved ?? 99 : null;
  if (ts !== null && ts < .6) gmP007Panels(g, t, 1 - ts / .6);
}
function gmIllusP007Main(g, t, st) {
  const ts = st.solved ? st.tSolved ?? 99 : null, s = .21;
  if (ts === null) { gmP007Panels(g, t, 1); return; }
  gmStatic(g, 'p007:tower', 0, 0, IW, IH, gmTowerBase);
  const run = ts === null ? 0 : clamp((ts - .5) / 3.3), mins = run * GM_MEET, met = ts !== null && ts >= .5 + 3.3;
  // the tower clock (right): it runs from 9:00 to the meeting
  gmMiniClock(g, t, 1045, 200, 96, mins, { case: '#8a5634' });
  pzLabel(g, '9:' + String(Math.floor(mins)).padStart(2, '0'), 1045, 350, gmFs(46), { fam: 'display', weight: 800, color: PZ.ink });
  const pa = gmStairPoint(gmUp(mins)), pb = gmStairPoint(gmDown(mins));
  const mp = gmStairPoint(gmUp(GM_MEET));
  if (met) { // the meeting step glows
    const k = gmK(ts, 3.8, .4);
    g.save(); g.globalAlpha = k; g.globalCompositeOperation = 'screen'; const gr = g.createRadialGradient(mp[0], mp[1] - 50, 4, mp[0], mp[1] - 50, 140); gr.addColorStop(0, 'rgba(255,220,140,.85)'); gr.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = gr; g.fillRect(mp[0] - 150, mp[1] - 200, 300, 300); g.restore();
    pzMemoCircle(g, ts, { x: mp[0], y: mp[1] + 2, rx: 64, ry: 16, t0: 3.9, dur: .35, color: PAL.clayDeep, seed: 'gmmeet' });
  }
  // at the meeting they stand on the same step, face to face
  const off = met ? 16 : 0;
  gmMiniHilde(g, t, pa[0] - off * pa[2], pa[1], s, { dir: pa[2], ghost: true, walking: !met });
  gmMiniHilde(g, t, pb[0] + off * pa[2], pb[1], s, { dir: met ? -pa[2] : -pb[2], walking: !met });
  if (!met) {
    pzLabel(g, 'yesterday', pa[0], pa[1] + 44, gmFs(30), { fam: 'hand', weight: 700, color: '#4f6f8a' });
    pzLabel(g, 'today', pb[0], pb[1] + 44, gmFs(30), { fam: 'hand', weight: 700, color: PZ.ink });
  } else {
    const k = gmE(ts, 3.9, .45, ease.outBack);
    if (k > 0) { g.save(); g.translate(mp[0], mp[1] - 190); g.scale(k, k); gmMiniClock(g, t, 0, 0, 34, GM_MEET, { case: '#c99a3e' }); g.restore(); }
    inkPath(g, [[mp[0], mp[1] - 150], [mp[0], mp[1] - 128]], { width: 3, seed: 'gmmstem', alpha: k });
    pzMemoText(g, ts, { text: 'same step,', x: 150, y: 400, size: 44, t0: 4.2, align: 'center', color: PAL.clayDeep, rot: -.03 });
    pzMemoText(g, ts, { text: 'same time', x: 150, y: 452, size: 44, t0: 4.6, align: 'center', color: PAL.clayDeep, rot: -.03 });
    pzMemoArrow(g, ts, { from: [215, 430], to: [mp[0] - 70, mp[1] - 60], t0: 5.0, dur: .4, color: PAL.clayDeep, bend: -.15, head: 18, width: 4 });
  }
}

// ---------------------------------------------------------------------------------------------- trunk
const GM_TRUNK_KINDS = ['fever', 'fire', 'storm', 'wire'];
const GM_TRUNK_LAYOUT = { fever: { x: 165, y: 236, s: .4, rot: -.07 }, fire: { x: 455, y: 214, s: .4, rot: -.02 }, storm: { x: 745, y: 214, s: .4, rot: .03 }, wire: { x: 1035, y: 222, s: .33, rot: .07 } };
const GM_TRUNK_CARDS = Object.fromEntries(GM_TRUNK_KINDS.map(k => {
  const L = GM_TRUNK_LAYOUT[k], big = PZ_LOCKED[k] && PZ_LOCKED[k].big, w = (big ? 600 : 500) * L.s, h = (big ? 860 : 660) * L.s + 70 * L.s;
  return [k, { x: Math.round(L.x - w / 2), y: Math.round(L.y - h / 2 + 20 * L.s), w: Math.round(w), h: Math.round(h + 30) }];
}));
function gmIllusTrunk(g, t, st) {
  const shake = st.shake || {};
  gmStatic(g, 'trunk:base', 0, 0, IW, IH, q => {
    gmPool(q, 'trunkpool', 600, 380, 560, 260, PAL.plum, .04);
    drawTrunk(q, 600, 690, 2.1, { t: 0, open: 1, side: .25 });
  });
  for (const k of GM_TRUNK_KINDS) {
    const L = GM_TRUNK_LAYOUT[k], t0 = shake[k];
    const bob = Math.sin(t * 1.1 + L.x * .01) * 4;
    pzLockedCard(g, t, { x: L.x, y: L.y + bob, scale: L.s, kind: k, rot: L.rot, jiggleAt: t0 == null ? null : t0, seed: 'gm' + k });
    if (t0 != null && t - t0 >= 0 && t - t0 < 1.8) {   // NOT YET, stamped small over the rattled card
      pzStamp(g, t, { kind: 'notyet', x: L.x, y: L.y - 30, t0: t0 + .05, scale: GMI.phone ? .62 : .42, seed: 'gmny' + k + Math.floor(t0 * 10) });
    }
  }
}

const GM_ILLUS = { p001: gmIllusP001, p002: gmIllusP002, p003: gmIllusP003, p004: gmIllusP004, p005: gmIllusP005, p006: gmIllusP006, p007: gmIllusP007, trunk: gmIllusTrunk };
// id: 'p001'..'p007' | 'trunk'; st: puzzle state + { solved, tSolved }
function gmDrawIllus(g, t, id, st = {}) {
  const f = GM_ILLUS[id]; if (!f) return;
  const cw = +st.cssW || 0; GMI.phone = cw > 0 && cw < 500; GMI.min = GMI.phone ? 12.5 * IW / cw : 0;
  g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; f(g, t, st); g.restore();
}
// Pre-build the caches behind the given scenes / illustrations at the sizes they will be drawn, so the first frame
// of each doesn't stall (painted fruit, chalk grain, static layers, character sprites). Yields between items.
//   ids: e.g. ['study', 'p001', 'p002']   o: { top: device px per logical px of the top canvas (default: #top's
//   width / 1920), illus: device px per logical px of the illustration canvas (default: 360 CSS px at the DPR),
//   cssW: illustration CSS width (default 360) }. Returns a Promise that resolves when done.
async function gmArtWarm(ids = [], o = {}) {
  const dpr = Math.min(2, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1), topC = typeof document !== 'undefined' && document.getElementById('top');
  const cssW = o.cssW || 360, sTop = o.top || (topC ? topC.width / W : .5), sIll = o.illus || cssW * dpr / IW;
  const idle = () => new Promise(r => (typeof requestIdleCallback === 'function' ? requestIdleCallback(() => r(), { timeout: 300 }) : setTimeout(r, 0)));
  const cv = gmMk(8, 8), g = cv.getContext('2d');
  for (const id of ids) {
    await idle();
    try {
      if (GM_ILLUS[id]) {
        cv.width = Math.ceil(IW * sIll); cv.height = Math.ceil(IH * sIll);
        for (const st of [{ solved: false }, { solved: true, tSolved: .8 }, { solved: true, tSolved: 2.5 }, { solved: true, tSolved: 99 }]) {
          g.setTransform(sIll, 0, 0, sIll, 0, 0); gmDrawIllus(g, 0, id, { open: new Set([1, 4]), shake: {}, cssW, ...st });
        }
      } else if (GM_SCENES.includes(id)) {
        cv.width = Math.ceil(W * sTop); cv.height = Math.ceil(H * sTop);
        g.setTransform(sTop, 0, 0, sTop, 0, 0);
        gmDrawScene(g, 0, id, { hilde: { expr: 'neutral' }, claude: { expr: 'neutral' } });
      } else if (id === 'chars') {   // the usual drawings: neutral / talking / joy, both characters
        cv.width = Math.ceil(W * sTop); cv.height = Math.ceil(H * sTop);
        for (const ex of ['neutral', 'talk', 'joy']) for (const talk of [0, .3, .8]) for (const t of [0, 1 / 12, 2 / 12]) {
          g.setTransform(sTop, 0, 0, sTop, 0, 0); gmDrawChar(g, 'hilde', t, { expr: ex, talk }); gmDrawChar(g, 'claude', t, { expr: ex, talk });
          if (talk === 0) await idle();
        }
      }
    } catch (e) { console.warn('[art] warm', id, e); }
  }
  cv.width = cv.height = 1;
}
function gmArtStats() { return { ...GMA.stats, charSprites: _gmChar.size, charMpx: +(_gmChar.px / 1e6).toFixed(1), staticMpx: +(_gmStatic.px / 1e6).toFixed(1) }; }
