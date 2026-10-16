// puzzles.js — the PUZZLE layer: the game UI as punchlines.
//
// Everything here is a pure function of time. Each public function is `pzXxx(g, t, opts)` and draws
// in absolute canvas coordinates (1920x1080), with explicit start times in opts (`t0`, `at`, …) so
// it can be placed on beats. Seeded randomness only; static parts go through `cached()`.
// All names are prefixed `pz` (test.js and other files define their own `tile`, `puzzleCard`, …).
//
// Contents
//   0. fonts, palette, helpers (pzFont, pzMath typesetter, pzStrokeOn, pzSpark glyph, pzDesk)
//   1. UI kit: pzCard, pzTile, pzDialogue (+ pzRevealTimes), memo layer (pzMemo*), pzStamp (+ pzStampShake)
//   2. counters: pzSparks, pzProblemCounter, pzCalendar (+ pzCalendarSchedule), pzMosaic
//   3. verse-2 result screens: pzResultIMO, pzResultProtein, pzResultKissing, pzResultErdos,
//      pzResultJacobian, pzResultNavierStokes, pzResultZeros, pzResultFLT  (+ PZ_RESULTS list)
//   4. bridge: pzLockedCard (fever, fire, storm, wire, jacobian2, ns0, zeros), pzPadlock, pzCardBird, pzFlock
//   5. gags: pzChalkboard (9.11 vs 9.9), pzRightBubbles, pzStrawberryCard

// ============================================================================================
// 0. fonts, palette, helpers
// ============================================================================================

// Extra glyph coverage (№ ≥ ≠ ∞ → ℂ ℕ …) as tiny subsets; window.ready loads every document font.
(function pzLoadFonts() {
  if (typeof FontFace === 'undefined' || typeof document === 'undefined') return;
  const add = (fam, file, desc) => { try { document.fonts.add(new FontFace(fam, `url(fonts/${file})`, desc)); } catch (e) { } };
  add('PZ Fraunces Sym', 'pz-fraunces-sym.woff2', { weight: '300 900' });   // № ≥ ≤ ≠ × ½ ¼ ⟨ ⟩ ≈
  add('PZ Math', 'pz-libertinus-math-sym.woff2', {});                       // ∞ → ⟶ ℂ ℕ ℝ ∀ ∃ ζ λ ∑ ⁿ
  add('PZ Mono', 'pz-jetbrains-mono.woff2', { weight: '500' });              // ASCII + ℕ ≠ → ∀ ∃ ⟨ ⟩ λ
})();

const PZ = {
  ink: '#3b2a1e', inkSoft: '#6b5240', sepia: '#a07a4f',
  card: '#fbf5e6', cardOld: '#efdcae', sheet: '#f8efd8', tile: '#efd9ab',
  red: '#b8322e', redDeep: '#8a221d',          // stamp ink
  blue: '#2f5d8a',                             // "ONCE MORE!" stamp ink (kind, not red)
  memo: '#2f6f7a',                             // default memo pen (teal-blue ballpoint)
  gold: '#e3b54a', goldDeep: '#a87a22', brass: '#c99a3e',
  chalk: '#f4f0e4', slate: '#2e3b35',
  who: {
    claude: { name: 'Claude', tab: '#d97757', deep: '#b9573a' },
    hilde: { name: 'Professor Hilde', tab: '#6d4a5e', deep: '#4f3343' },
    referee: { name: 'The Referee', tab: '#4f7d78', deep: '#365753' },
    everyone: { name: 'Everyone!', tab: '#d6a443', deep: '#a87a22' },
  },
};
const PZ_FAM = {
  display: '"Fraunces", "PZ Fraunces Sym", "PZ Math"',
  body: '"EB Garamond", "PZ Fraunces Sym", "PZ Math"',
  hand: '"Caveat", "PZ Fraunces Sym", "PZ Math"',
  fell: '"IM Fell English", "PZ Fraunces Sym", "PZ Math"',
  mono: '"PZ Mono", "PZ Math"',
  math: '"EB Garamond", "PZ Math", "PZ Fraunces Sym"',
};
function pzFont(px, fam = 'body', weight = 500, style = 'normal') { return `${style} ${weight} ${Math.max(1, px).toFixed(1)}px ${PZ_FAM[fam] || `"${fam}"`}`; }
const pzSmooth = k => k * k * (3 - 2 * k);
const pzPad3 = n => typeof n === 'number' ? String(n).padStart(3, '0') : String(n);
// local-time helper: progress of [a, a+d] (no easing)
const pzK = (t, a, d) => clamp((t - a) / d);

// A reusable scratch canvas (cleared by the caller). Not state: it is fully redrawn each use.
const _pzScratch = new Map();
function pzScratch(key, w, h) {
  let c = _pzScratch.get(key);
  if (!c || c.width < w || c.height < h) { c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); _pzScratch.set(key, c); }
  const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
  return c;
}

// Resample a polyline at ~`step` px; returns [{x,y}] as arrays, plus total length.
function pzResample(pts, step = 4) {
  const out = [pts[0]]; let len = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(L / step));
    for (let k = 1; k <= n; k++) out.push([lerp(x0, x1, k / n), lerp(y0, y1, k / n)]);
    len += L;
  }
  out.len = len; return out;
}
// Draw the first fraction k of a path as a live ink/pen stroke (the "drawn on" look).
function pzStrokeOn(g, pts, k, opts = {}) {
  if (k <= 0) return;
  const R = pts.len !== undefined ? pts : pzResample(pts, opts.step || 4);
  const n = Math.max(2, Math.round(R.length * clamp(k)));
  inkPath(g, R.slice(0, n), { width: 4, color: PZ.ink, wobble: .7, ...opts });
}
const pzBoil = t => boilFrame(t);

// ---- tiny math typesetter -----------------------------------------------------------------
// Markup: letters are italic variables; `word` is upright; ^x or ^{..} superscript; _x or _{..} subscript.
// Digits, brackets and operators are upright; = + − < > ≥ ≤ ≠ → get thin spaces. Returns the width.
function pzMath(g, s, x, y, size, opts = {}) {
  const { color = PZ.ink, align = 'left', measure = false, weight = 500, opSpace = .2 } = opts;
  const toks = [];
  for (let i = 0; i < s.length;) {
    const c = s[i];
    if (c === '`') { const j = s.indexOf('`', i + 1); toks.push({ t: s.slice(i + 1, j), st: 'up' }); i = j + 1; continue; }
    if (c === '^' || c === '_') {
      let a; if (s[i + 1] === '{') { let d = 1, j = i + 2; while (d && j < s.length) { if (s[j] === '{') d++; else if (s[j] === '}') d--; j++; } a = s.slice(i + 2, j - 1); i = j; } else { a = s[i + 1]; i += 2; }
      toks.push({ t: a, st: c === '^' ? 'sup' : 'sub' }); continue;
    }
    if (/[A-Za-z]/.test(c)) toks.push({ t: c, st: 'it' });
    else if ('=+−<>≥≤≠→⟶×≈'.includes(c)) {
      let j = toks.length - 1; while (j >= 0 && toks[j].st === 'sp') j--;
      const unary = c === '−' && (j < 0 || '(,=['.includes(toks[j].t) || toks[j].st === 'op');
      if (unary && toks.length && toks[toks.length - 1].st === 'sp') toks.pop();
      toks.push({ t: c, st: unary ? 'up' : 'op' });
    }
    else if (c === ' ') toks.push({ t: ' ', st: 'sp' });
    else toks.push({ t: c, st: 'up' });
    i++;
  }
  const fUp = pzFont(size, 'math', weight), fIt = pzFont(size, 'math', weight, 'italic');
  let w = 0; const items = [];
  g.save();
  for (const tk of toks) {
    if (tk.st === 'sup' || tk.st === 'sub') {
      const ww = pzMath(g, tk.t, 0, 0, size * .62, { ...opts, measure: true, align: 'left' });
      items.push({ ...tk, x: w, w: ww }); w += ww + size * .02; continue;
    }
    g.font = tk.st === 'it' ? fIt : fUp;
    let ww = g.measureText(tk.t).width;
    if (tk.st === 'sp') ww = size * .22;
    const pad = tk.st === 'op' ? size * opSpace : 0;
    items.push({ ...tk, x: w + pad, w: ww }); w += ww + 2 * pad + (tk.st === 'it' ? size * .03 : 0);
  }
  if (!measure) {
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    g.fillStyle = color; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    for (const it of items) {
      if (it.st === 'sup') pzMath(g, it.t, x0 + it.x, y - size * .38, size * .62, { ...opts, align: 'left' });
      else if (it.st === 'sub') pzMath(g, it.t, x0 + it.x, y + size * .2, size * .62, { ...opts, align: 'left' });
      else if (it.st !== 'sp') { g.font = it.st === 'it' ? fIt : fUp; g.fillStyle = color; g.fillText(it.t, x0 + it.x, y); }
    }
  }
  g.restore();
  return w;
}

// ---- glyphs drawn in ink (no font needed) ---------------------------------------------------
// The spark ✷: an eight-point star like Claude's hair clip.
function pzSpark(g, x, y, r, opts = {}) {
  const { fill = PZ.gold, line = PZ.ink, rot = 0, lw = Math.max(1.2, r * .12), t = 0, seed = 'spk' } = opts;
  const p = [];
  for (let i = 0; i < 16; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? r * .42 : (i % 4 ? r * .78 : r); p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  g.save(); tracePoly(g, p); g.fillStyle = fill; g.fill();
  g.globalAlpha = .45; g.fillStyle = '#fff6dc'; g.beginPath(); g.arc(x - r * .12, y - r * .14, r * .22, 0, 7); g.fill(); g.restore();
  if (line) inkPoly(g, p, { width: lw, color: line, seed: seed + Math.round(r), boil: pzBoil(t), wobble: Math.min(.5, r * .03) });
}
// A little brass padlock (also used big on locked cards). open: 0 = shut, 1 = shackle up and swung.
function pzPadlock(g, x, y, s, opts = {}) {
  const { t = 0, open = 0, label = 'NOT YET', seed = 'lock', swing = 0 } = opts;
  const bf = pzBoil(t);
  g.save(); g.translate(x, y); g.rotate(swing); g.scale(s, s);
  // shackle
  g.save(); g.translate(-28, -8 - open * 26); g.rotate(-open * .5); g.translate(28, 0);
  const sh = [...bez([-28, 0], [-30, -66], [30, -66], [28, 0], 22)];
  inkPath(g, sh, { width: 17, color: '#7a6a55', seed: seed + 's', boil: bf, wobble: .4, taper: false });
  inkPath(g, sh, { width: 9, color: '#c9bba0', seed: seed + 's2', boil: bf, wobble: .3, taper: false });
  inkPath(g, sh.map(([a, b]) => [a - 2, b - 2]), { width: 2.5, color: '#efe6d2', seed: seed + 's3', boil: bf, wobble: .3, alpha: .8 });
  g.restore();
  // body
  const body = deform(polyRect(-50, -12, 100, 82), rng(seed + 'b'), 2, .012);
  paintFill(g, gg => tracePoly(gg, body), PZ.brass, { tex: .35, shade: 'rgba(120,80,20,.35)', shadeFn: gg => gg.fillRect(-60, 40, 120, 40) });
  g.save(); tracePoly(g, body); g.clip(); g.fillStyle = 'rgba(255,240,200,.45)'; g.fillRect(-46, -8, 92, 12); g.restore();
  inkPoly(g, body, { width: 3, color: PZ.ink, seed: seed + 'bo', boil: bf, wobble: .5 });
  // keyhole
  g.fillStyle = '#3a2614'; g.beginPath(); g.arc(0, 40, 7, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-4, 42); g.lineTo(4, 42); g.lineTo(6, 60); g.lineTo(-6, 60); g.closePath(); g.fill();
  // engraved label
  if (label) {
    g.font = pzFont(19, 'display', 800); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(255,240,205,.55)'; g.fillText(label, 1, 18); g.fillStyle = '#5a3a18'; g.fillText(label, 0, 17);
  }
  g.restore();
}

// ---- backgrounds ---------------------------------------------------------------------------
// The desk/study paper behind puzzle screens. tone: 'warm' | 'cool' | 'night'.
function pzDesk(g, t, opts = {}) {
  const { tone = 'warm' } = opts;
  const base = { warm: '#eadcbc', cool: '#dfe0cc', night: '#3a3446' }[tone] || tone;
  g.drawImage(paperTexture('pzdesk' + tone, W, H, base), 0, 0);
  g.drawImage(cached('pzdeskwash' + tone, W, H, gg => {
    const c1 = tone === 'night' ? '#272235' : '#c9ad7f', c2 = tone === 'night' ? '#57476a' : '#f6e7c3';
    wash(gg, polyRect(-200, 760, W + 400, 500), c1, { seed: 'pzdw1' + tone, layers: 26, alpha: .05, spread: .03, edge: false });
    wash(gg, polyCircle(W * .55, H * .42, 760, 480, 30), c2, { seed: 'pzdw2' + tone, layers: 22, alpha: .045, spread: .2, edge: false });
    wash(gg, polyRect(-200, -200, W + 400, 260), c1, { seed: 'pzdw3' + tone, layers: 18, alpha: .035, spread: .04, edge: false });
  }), 0, 0);
}
// A sheet of graph paper (the puzzle sheet). Cached per size; outline boils.
function pzSheet(g, t, opts = {}) {
  const { x = 120, y = 150, w = 1680, h = 820, seed = 'pzsheet', grid = 36, color = PZ.sheet, rot = 0 } = opts;
  const pad = 30;
  const c = cached(`pzsheet:${seed}:${w}x${h}:${color}:${grid}`, w + 2 * pad, h + 2 * pad, gg => {
    gg.translate(pad, pad);
    const sh = deform(polyRect(0, 0, w, h), rng(seed), 2, .004);
    gg.save(); gg.translate(9, 13); gg.globalAlpha = .2; gg.fillStyle = PAL.umber; tracePoly(gg, sh); gg.fill(); gg.restore();
    paintFill(gg, g2 => tracePoly(g2, sh), color, { tex: .14 });
    if (grid) {
      gg.save(); tracePoly(gg, sh); gg.clip(); gg.strokeStyle = 'rgba(79,125,120,.16)'; gg.lineWidth = 1;
      for (let x = grid; x < w; x += grid) { gg.beginPath(); gg.moveTo(x, 0); gg.lineTo(x, h); gg.stroke(); }
      for (let y = grid; y < h; y += grid) { gg.beginPath(); gg.moveTo(0, y); gg.lineTo(w, y); gg.stroke(); }
      gg.restore();
    }
  });
  g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
  g.drawImage(c, -pad, -pad);
  inkPoly(g, deform(polyRect(0, 0, w, h), rng(seed), 2, .004), { width: 2.4, seed: seed + 'o', boil: pzBoil(t) % 3, wobble: .5, color: PZ.inkSoft });
  g.restore();
}

// ============================================================================================
// 1. UI kit
// ============================================================================================

// ---- problem card ----------------------------------------------------------------------------
// opts: x, y (top-left), w=600, h=150, num (number or string like '∞' / '???'), title, sparks (number|null),
//       t0 (slide-in start; null = already there), rot, scale, band (colour), old (yellowed), label='PROBLEM'
function pzCardBody(w, h, opts = {}) {
  const { band = PAL.clay, old = false, seed = 'card', variant = 0, bandW = Math.round(h * 1.1) } = opts;
  const pad = 26, base = old ? PZ.cardOld : PZ.card;
  return cached(`pzcard:${seed}:${w}x${h}:${band}:${old}:${variant}:${bandW}`, w + 2 * pad, h + 2 * pad, gg => {
    gg.translate(pad, pad);
    const card = deform(polyRect(0, 0, w, h), rng('pzc' + seed), 2, .008);
    gg.save(); gg.translate(6, 9); gg.globalAlpha = .24; gg.fillStyle = PAL.umber; tracePoly(gg, card); gg.fill(); gg.restore();
    paintFill(gg, g2 => tracePoly(g2, card), base, { tex: old ? .3 : .18 });
    if (old) { // foxing and a darker edge
      const r = rng(seed + 'fox');
      gg.save(); tracePoly(gg, card); gg.clip();
      for (let i = 0; i < 9; i++) { const x = r() * w, y = r() * h, R = r.range(8, 40), gr = gg.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, 'rgba(150,100,45,.12)'); gr.addColorStop(1, 'rgba(150,100,45,0)'); gg.fillStyle = gr; gg.fillRect(x - R, y - R, 2 * R, 2 * R); }
      gg.strokeStyle = 'rgba(140,95,40,.18)'; gg.lineWidth = 18; tracePoly(gg, card); gg.stroke();
      gg.restore();
    }
    if (bandW > 0) {
      gg.save(); tracePoly(gg, card); gg.clip();
      wash(gg, polyRect(-10, -10, bandW + 10, h + 20), band, { seed: 'pzband' + seed, layers: 24, alpha: .085, spread: .03, depth: 4, edge: false });
      gg.restore();
      inkPath(gg, [[bandW, 4], [bandW + 1, h - 4]], { width: 2, color: PZ.ink, seed: 'pzbl' + seed, wobble: .4, alpha: .7 });
    }
    inkPoly(gg, deform(polyRect(bandW + 10, 9, w - bandW - 19, h - 18), rng('pzci' + seed), 1, .004), { width: 1.2, color: PZ.sepia, seed: 'pzci' + seed + variant, boil: variant, wobble: .4, alpha: .7 });
    inkPoly(gg, card, { width: 2.8, seed: 'pzco' + seed, boil: variant, wobble: .5 });
  });
}
function pzCard(g, t, opts = {}) {
  const { x = 100, y = 60, w = 600, h = 150, num = 1, title = 'Untitled', sparks = 10, t0 = null, rot = -.02, scale = 1,
    band = PAL.clay, old = false, label = 'PROBLEM', alpha = 1, seed = 'c' + num } = opts;
  let k = 1, dy = 0, dr = 0;
  if (t0 !== null) { k = tw(t, t0, .5, ease.outBack); if (t < t0) return; dy = (1 - k) * -260; dr = (1 - tw(t, t0, .7, ease.outElastic)) * .25; }
  const bandW = Math.round(h * 1.1), pad = 26;
  const body = pzCardBody(w, h, { band, old, seed, variant: pzBoil(t) % 3, bandW });
  g.save(); g.globalAlpha *= alpha * clamp(k * 3);
  g.translate(x + w / 2, y + h / 2 + dy); g.rotate(rot + dr); g.scale(scale, scale); g.translate(-w / 2, -h / 2);
  g.drawImage(body, -pad, -pad);
  // band text
  g.fillStyle = PZ.card; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = pzFont(h * .155, 'display', 700); g.save(); g.translate(bandW / 2, h * .34); g.fillText(label.split('').join(String.fromCharCode(8202)), 0, 0); g.restore();
  const ns = pzPad3(num);
  let fs = h * .40; g.font = pzFont(fs, 'display', 800);
  const nw = g.measureText('№' + ns).width; if (nw > bandW * .86) fs *= bandW * .86 / nw;
  g.font = pzFont(fs, 'display', 800); g.fillText('№' + ns, bandW / 2, h * .80);
  // title (shrinks to fit)
  const tx = bandW + 26, avail = w - tx - 22;
  let ts = h * .30; g.font = pzFont(ts, 'body', 600, 'italic');
  const twd = g.measureText(title).width; if (twd > avail) ts *= avail / twd;
  g.textAlign = 'left'; g.fillStyle = PZ.ink; g.font = pzFont(ts, 'body', 600, 'italic');
  g.fillText(title, tx, sparks === null ? h * .6 : h * .47);
  if (sparks !== null) {
    pzSpark(g, tx + h * .085, h * .74, h * .085, { t, seed: 'cs' + seed });
    g.font = pzFont(h * .17, 'display', 500); g.fillStyle = PZ.inkSoft;
    const sv = typeof sparks === 'number' ? sparks.toLocaleString('en-US') + (sparks === 1 ? ' spark' : ' sparks') : String(sparks);
    g.fillText(sv, tx + h * .2, h * .80);
  }
  g.restore();
}

// ---- letter tile -------------------------------------------------------------------------------
// opts: x, y (centre), ch, size=92, hi (0..1 highlight: lifts and turns clay), t0 (pop-in), seed, color (tile wood)
function pzTile(g, t, opts = {}) {
  const { x, y, ch = 'A', size = 92, hi = 0, t0 = null, seed = 'tile', color = PZ.tile, rot = null, mark = null } = opts;
  let k = 1; if (t0 !== null) { if (t < t0) return; k = tw(t, t0, .45, ease.outBack); }
  const r = rng('pzt' + seed);
  const rr = rot === null ? r.gauss() * .025 : rot;
  const pad = Math.ceil(size * .2);
  const c = cached(`pztile:${seed}:${size}:${color}:${hi > .5}:${pzBoil(t) % 2}`, size + 2 * pad, size + 2 * pad, gg => {
    gg.translate(pad + size / 2, pad + size / 2);
    const sq = deform(polyRect(-size / 2, -size / 2, size, size), rng('pzts' + seed), 2, .015);
    paintFill(gg, g2 => tracePoly(g2, sq), hi > .5 ? mix(color, PZ.gold, .45) : color, { tex: .3, shade: 'rgba(150,100,50,.28)', shadeFn: g2 => g2.fillRect(-size / 2, size * .22, size, size) });
    gg.save(); tracePoly(gg, sq); gg.clip(); gg.fillStyle = 'rgba(255,248,225,.5)'; gg.fillRect(-size / 2, -size / 2, size, size * .09); gg.restore();
    inkPoly(gg, sq, { width: Math.max(1.6, size * .028), color: PZ.ink, seed: 'pztl' + seed, boil: pzBoil(t) % 2, wobble: .5 });
  });
  const lift = hi * size * .12;
  g.save(); g.translate(x, y - lift); g.rotate(rr * (1 - hi)); g.scale(k * (1 + hi * .08), k * (1 + hi * .08));
  g.save(); g.translate(size * .05, size * .08 + lift * .6); g.globalAlpha = .22 - hi * .06; g.fillStyle = PAL.umber;
  g.fillRect(-size / 2, -size / 2, size, size); g.restore();
  g.drawImage(c, -size / 2 - pad, -size / 2 - pad);
  g.font = pzFont(size * .6, 'display', 650); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = hi > .5 ? PAL.clayDeep : PZ.ink; g.fillText(ch, 0, size * .04);
  g.restore();
}
// A row of tiles spelling a word. opts: x (centre), y, word, size, gap, t0, stagger, hi: (i, ch) => 0..1
function pzTileRow(g, t, opts = {}) {
  const { x = W / 2, y = H / 2, word = 'WORD', size = 92, gap = 12, t0 = null, stagger = .07, hi = null, seed = 'row' } = opts;
  const step = size + gap, x0 = x - (word.length - 1) * step / 2;
  for (let i = 0; i < word.length; i++)
    pzTile(g, t, { x: x0 + i * step, y, ch: word[i], size, t0: t0 === null ? null : t0 + i * stagger, seed: seed + i, hi: hi ? hi(i, word[i]) : 0 });
  return { x0, step };
}

// ---- typewriter dialogue box ----------------------------------------------------------------------
// Per-character reveal times (for blip sounds). Punctuation adds a pause. Returns [{i, ch, t}] for every
// character (spaces included; skip them for blips). `end` is the time the last character appears.
function pzRevealTimes(text, t0, cps = 30) {
  const out = []; let tt = t0;
  for (let i = 0; i < text.length; i++) {
    out.push({ i, ch: text[i], t: tt });
    const c = text[i], dt = 1 / cps;
    tt += dt * (',;:'.includes(c) ? 5 : '.!?…'.includes(c) ? (text[i + 1] === ' ' || i === text.length - 1 ? 9 : 1) : c === '—' ? 6 : 1);
  }
  out.end = out.length ? out[out.length - 1].t : t0;
  return out;
}
// opts: x, y, w=1180, h=200, who ('claude'|'hilde'|'referee'|'everyone'|{name,tab}), name (override), text,
//       t0 (typing start), cps=30, size=44, t1 (box pop-in time; default t0-.25), font ('body'|'hand')
// Returns { times, end, shown } so a sound pass can place blips at times[i].t for non-space characters.
function pzDialogue(g, t, opts = {}) {
  const { x = 640, y = 830, w = 1180, h = 200, who = 'hilde', text = '', t0 = 0, cps = 30, size = 44, font: ff = 'body', seed = 'dlg' } = opts;
  const t1 = opts.t1 !== undefined ? opts.t1 : t0 - .25;
  const spk = typeof who === 'string' ? PZ.who[who] || PZ.who.hilde : who;
  const name = opts.name || spk.name;
  const times = pzRevealTimes(text, t0, cps);
  if (t < t1) return { times, end: times.end, shown: 0 };
  const pk = tw(t, t1, .3, ease.outBack), bf = pzBoil(t);
  g.save(); g.translate(x + w / 2, y + h); g.scale(1, lerp(.6, 1, pk)); g.globalAlpha *= clamp(pk * 2); g.translate(-x - w / 2, -y - h);
  const pad = 20;
  const body = cached(`pzdlg:${seed}:${w}x${h}`, w + 2 * pad, h + 2 * pad, gg => {
    gg.translate(pad - x, pad - y);
    const box = deform(polyRect(x, y, w, h), rng('pzdlg' + seed), 2, .004);
    gg.save(); gg.translate(5, 8); gg.globalAlpha = .2; gg.fillStyle = PAL.umber; tracePoly(gg, box); gg.fill(); gg.restore();
    gg.save(); gg.globalAlpha = .95; paintFill(gg, g2 => tracePoly(g2, box), '#fbf3df', { tex: .14 }); gg.restore();
  });
  g.drawImage(body, x - pad, y - pad);
  inkPoly(g, deform(polyRect(x, y, w, h), rng('pzdlg' + seed), 2, .004), { width: 3, seed: 'pzdl' + seed, boil: bf, wobble: .5 });
  inkPoly(g, deform(polyRect(x + 11, y + 11, w - 22, h - 22), rng('pzdlg2' + seed), 2, .004), { width: 1.3, seed: 'pzdl2' + seed, boil: bf, wobble: .4, color: PZ.sepia });
  // name tab
  g.font = pzFont(30, 'display', 700);
  const tabW = Math.max(180, g.measureText(name).width + 64);
  const np = deform(polyRect(x + 36, y - 28, tabW, 52), rng('pznp' + name), 1, .01);
  g.save(); g.translate(3, 5); g.globalAlpha = .25; g.fillStyle = PAL.umber; tracePoly(g, np); g.fill(); g.restore();
  paintFill(g, gg => tracePoly(gg, np), spk.tab, { tex: .25 });
  inkPoly(g, np, { width: 2.4, seed: 'pznp' + name, boil: bf, wobble: .4 });
  g.fillStyle = PZ.card; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText(name, x + 36 + tabW / 2, y + 9);
  // text with per-character reveal; the newest character pops up a little
  g.font = ff === 'hand' ? pzFont(size * 1.15, 'hand', 600) : pzFont(size, 'body', 500); g.fillStyle = PZ.ink; g.textAlign = 'left';
  const lines = wrap(g, text, w - 120);
  let shown = 0; while (shown < times.length && times[shown].t <= t) shown++;
  let used = 0;
  lines.forEach((ln, li) => {
    const n = clamp(shown - used, 0, ln.length), ly = y + 40 + size * 1.0 + li * size * 1.28;
    if (n > 0) {
      const last = used + n - 1, age = t - times[last].t;
      const fresh = n < ln.length || shown === used + ln.length ? clamp(1 - age / .07) : 0;
      if (fresh > 0 && ln[n - 1] !== ' ') {
        g.fillText(ln.slice(0, n - 1), x + 60, ly);
        const px = x + 60 + g.measureText(ln.slice(0, n - 1)).width;
        g.save(); g.globalAlpha *= 1 - fresh * .4; g.fillText(ln[n - 1], px, ly - fresh * size * .12); g.restore();
      } else g.fillText(ln.slice(0, n), x + 60, ly);
    }
    used += ln.length + 1;
  });
  if (shown >= text.length && t > times.end + .2) {
    const b = Math.sin((t - times.end) * 7) * 5;
    g.fillStyle = spk.deep; g.beginPath(); g.moveTo(x + w - 64, y + h - 46 + b); g.lineTo(x + w - 40, y + h - 46 + b); g.lineTo(x + w - 52, y + h - 30 + b); g.closePath(); g.fill();
  }
  g.restore();
  return { times, end: times.end, shown };
}

// ---- memo layer: hand-drawn marks that stroke on live ---------------------------------------------
// All take t0 (start) and dur; colour defaults to the memo pen; width ~4.
function pzMemoCircle(g, t, opts = {}) {
  const { x, y, rx = 60, ry = rx * .8, t0 = 0, dur = .45, color = PZ.memo, width = 4.5, seed = 'mc', turns = 1.15, rot = -.15, alpha = 1 } = opts;
  if (t < t0) return;
  const r = rng('pzmc' + seed), a0 = r.range(-2.6, -1.6), wob = r.range(.04, .08), ph = r() * 6;
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const s = i / 80, a = a0 + s * turns * Math.PI * 2, m = 1 + wob * Math.sin(a * 2 + ph) - .06 * s;
    const px = Math.cos(a) * rx * m, py = Math.sin(a) * ry * m;
    pts.push([x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]);
  }
  pzStrokeOn(g, pts, ease.inOutQ(pzK(t, t0, dur)), { width, color, seed: 'pzmc' + seed, boil: pzBoil(t), wobble: .6, alpha });
}
function pzMemoArrow(g, t, opts = {}) {
  const { from, to, bend = .18, t0 = 0, dur = .45, color = PZ.memo, width = 4.5, head = 24, seed = 'ma', alpha = 1 } = opts;
  if (t < t0) return;
  const [x0, y0] = from, [x1, y1] = to, mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
  const c = [mx - dy * bend, my + dx * bend];
  const pts = []; for (let i = 0; i <= 40; i++) { const s = i / 40, u = 1 - s; pts.push([u * u * x0 + 2 * u * s * c[0] + s * s * x1, u * u * y0 + 2 * u * s * c[1] + s * s * y1]); }
  const k = pzK(t, t0, dur * .8);
  pzStrokeOn(g, pts, ease.outQ(k), { width, color, seed: 'pzma' + seed, boil: pzBoil(t), wobble: .6, alpha });
  const hk = pzK(t, t0 + dur * .78, dur * .22);
  if (hk > 0) {
    const ang = Math.atan2(y1 - c[1], x1 - c[0]);
    for (const s of [-1, 1]) {
      const a = ang + Math.PI + s * .5;
      pzStrokeOn(g, [[x1, y1], [x1 + Math.cos(a) * head, y1 + Math.sin(a) * head]], hk, { width: width * .95, color, seed: 'pzmh' + seed + s, boil: pzBoil(t), wobble: .4, alpha });
    }
  }
}
function pzMemoTick(g, t, opts = {}) {
  const { x, y, size = 50, t0 = 0, dur = .3, color = PZ.memo, width = 6, seed = 'mt' } = opts;
  if (t < t0) return;
  const pts = [[x - size * .45, y - size * .05], [x - size * .12, y + size * .32], [x + size * .5, y - size * .5]];
  pzStrokeOn(g, pzResample(pts, 3), ease.outQ(pzK(t, t0, dur)), { width, color, seed: 'pzmt' + seed, boil: pzBoil(t), wobble: .5 });
}
function pzMemoCross(g, t, opts = {}) {
  const { x, y, size = 60, t0 = 0, dur = .35, color = PZ.red, width = 9, seed = 'mx' } = opts;
  if (t < t0) return;
  const k = pzK(t, t0, dur);
  pzStrokeOn(g, [[x - size * .5, y - size * .48], [x + size * .5, y + size * .5]], ease.outQ(clamp(k * 2)), { width, color, seed: 'pzmx1' + seed, boil: pzBoil(t), wobble: .6 });
  pzStrokeOn(g, [[x + size * .48, y - size * .5], [x - size * .5, y + size * .46]], ease.outQ(clamp(k * 2 - 1)), { width, color, seed: 'pzmx2' + seed, boil: pzBoil(t), wobble: .6 });
}
function pzMemoUnderline(g, t, opts = {}) {
  const { x, y, w = 200, t0 = 0, dur = .3, color = PZ.memo, width = 4.5, seed = 'mu', double = false, wavy = false } = opts;
  if (t < t0) return;
  const r = rng('pzmu' + seed);
  const line = (yy, s) => { const p = []; for (let i = 0; i <= 30; i++) { const u = i / 30; p.push([x + u * w, yy + (wavy ? Math.sin(u * 14) * 5 : 0) + Math.sin(u * 3 + s) * 2.5 - u * 4]); } return p; };
  const k = pzK(t, t0, dur);
  pzStrokeOn(g, line(y, r() * 6), ease.outQ(double ? clamp(k * 2) : k), { width, color, seed: 'pzmu1' + seed, boil: pzBoil(t), wobble: .5 });
  if (double) pzStrokeOn(g, line(y + 11, r() * 6), ease.outQ(clamp(k * 2 - 1)), { width: width * .85, color, seed: 'pzmu2' + seed, boil: pzBoil(t), wobble: .5 });
}
function pzMemoBox(g, t, opts = {}) {
  const { x, y, w, h, t0 = 0, dur = .5, color = PZ.memo, width = 4, seed = 'mb' } = opts;
  if (t < t0) return;
  const r = rng('pzmb' + seed), j = () => r.gauss() * 4;
  const pts = [[x + j(), y + j()], [x + w + j(), y + j()], [x + w + j(), y + h + j()], [x + j(), y + h + j()], [x + 12 + j(), y - 4 + j()]];
  pzStrokeOn(g, pzResample(pts, 4), ease.inOutQ(pzK(t, t0, dur)), { width, color, seed: 'pzmb' + seed, boil: pzBoil(t), wobble: .6 });
}
// Handwriting that writes itself: a left-to-right wipe with a soft pen edge.
// opts: text, x, y, size=44, t0, dur (default by length), color, rot, align ('left'|'center'|'right'), weight
function pzMemoText(g, t, opts = {}) {
  const { text = '', x, y, size = 44, t0 = 0, color = PZ.memo, rot = -.03, align = 'left', weight = 600, alpha = 1 } = opts;
  const dur = opts.dur !== undefined ? opts.dur : .12 + text.length * .045;
  if (t < t0 || !text) return;
  const k = pzK(t, t0, dur);
  g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha *= alpha;
  g.font = pzFont(size, 'hand', weight);
  const w = g.measureText(text).width, x0 = align === 'center' ? -w / 2 : align === 'right' ? -w : 0;
  if (k < 1) {
    const edge = x0 + k * (w + size * .4) - size * .2;
    const gr = g.createLinearGradient(edge - size * .35, 0, edge + 1, 0);
    gr.addColorStop(0, color); gr.addColorStop(1, rgba(color.length === 7 ? color : PZ.memo, 0));
    g.beginPath(); g.rect(x0 - 10, -size * 1.4, edge - x0 + 10, size * 2.2); g.clip();
    g.fillStyle = gr;
  } else g.fillStyle = color;
  g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText(text, x0, 0);
  g.restore();
}

// ---- stamps ------------------------------------------------------------------------------------------
// kind: 'qed' (Q.E.D., red) | 'contested' (Q.E.D.? + referee's note) | 'oncemore' (ONCE MORE!, blue) | 'notyet' (NOT YET, plum)
// opts: x, y (centre), t0 (impact time), scale=1, rot (default per seed), note (string | [lines]) for contested,
//       noteAt (default t0+.35), text (override), color (override), seed
const PZ_STAMPS = {
  qed: { text: 'Q.E.D.', color: PZ.red, sub: null },
  contested: { text: 'Q.E.D.?', color: PZ.red, sub: null },
  oncemore: { text: 'ONCE\u2002MORE!', color: PZ.blue, sub: null },
  notyet: { text: 'NOT YET', color: '#5d3550', sub: null },
};
function pzStampArt(kind, text, color, seed) {
  const k = PZ_STAMPS[kind] || PZ_STAMPS.qed;
  text = text || k.text; color = color || k.color;
  const fs = 120;
  const meas = document.createElement('canvas').getContext('2d'); meas.font = pzFont(fs, 'display', 900);
  const tw_ = meas.measureText(text).width;
  const w = Math.ceil(tw_ + 150), h = 230, pad = 30;
  return cached(`pzstamp:${kind}:${text}:${color}:${seed}`, w + 2 * pad, h + 2 * pad, gg => {
    gg.translate(pad, pad);
    const r = rng('pzst' + seed + text);
    gg.fillStyle = color; gg.strokeStyle = color; gg.lineJoin = 'round';
    const rr = (x, y, ww, hh, rad) => { gg.beginPath(); gg.roundRect(x, y, ww, hh, rad); };
    gg.lineWidth = 11; rr(8, 8, w - 16, h - 16, 30); gg.stroke();
    gg.lineWidth = 4; rr(26, 26, w - 52, h - 52, 18); gg.stroke();
    gg.font = pzFont(fs, 'display', 900); gg.textAlign = 'center'; gg.textBaseline = 'middle';
    gg.save(); gg.translate(w / 2, h / 2 + 8); gg.scale(1, 1.05); gg.fillText(text, 0, 0); gg.restore();
    // small stars on the inner border, top and bottom
    for (const yy of [26, h - 26]) for (const xx of [w * .3, w * .5, w * .7]) {
      gg.save(); gg.fillStyle = '#fff'; gg.globalCompositeOperation = 'destination-out'; gg.fillRect(xx - 16, yy - 6, 32, 12); gg.restore();
      pzSpark(gg, xx, yy, 9, { fill: color, line: null });
    }
    // missing ink: speckles and a dry streak
    gg.globalCompositeOperation = 'destination-out';
    const N = makeNoise('pzstn' + seed);
    const img = gg.getImageData(0, 0, w, h), d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4; if (!d[i + 3]) continue;
      const n = N.fbm(x / 4.5, y / 4.5, 2), big = N.fbm(x / 70 + 9, y / 70, 3), streak = N(x / 160, y / 10 + 4);
      let a = 1; if (n > .70) a = 0; else if (n > .655) a = .55;
      if (big < .3) a *= .72; if (streak > .84) a *= .5;
      d[i + 3] *= a * (.9 + .1 * r());
    }
    gg.putImageData(img, 0, 0);
  });
}
function pzStampShake(t, t0, amp = 12) {
  const k = t - t0; if (k < 0 || k > .35) return [0, 0];
  const d = Math.exp(-k * 14) * amp; return [Math.sin(k * 90) * d, Math.cos(k * 77) * d * .7];
}
function pzStamp(g, t, opts = {}) {
  const { x = W / 2, y = H / 2, t0 = 0, kind = 'qed', scale = 1, seed = 's', text = null, color = null, note = null } = opts;
  const r = rng('pzs' + seed + kind);
  const rot = opts.rot !== undefined ? opts.rot : -.16 + r.gauss() * .05;
  const k = t - t0, fall = .16;
  if (k < -fall) return;
  const art = pzStampArt(kind, text, color, seed);
  const ink = color || (PZ_STAMPS[kind] || PZ_STAMPS.qed).color;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(scale * .5, scale * .5);
  if (k < 0) { // falling towards the paper: big, soft, translucent, with a growing shadow
    const f = 1 + k / fall, s = lerp(2.3, 1.02, ease.inQ(f));
    g.save(); g.globalAlpha *= .3 * f; g.filter = `brightness(0) blur(${(6 + 14 * (1 - f)).toFixed(1)}px)`; const ss = lerp(1.3, 1, f); g.drawImage(art, -art.width / 2 * ss + 14 * (1 - f), -art.height / 2 * ss + 22 * (1 - f), art.width * ss, art.height * ss); g.restore();
    g.globalAlpha *= .35 + .5 * f; g.scale(s, s); g.drawImage(art, -art.width / 2, -art.height / 2);
    g.restore(); return;
  }
  // impact: squash, ink bleed halo, spatter, a dust ring; then the residual mark
  const sq = k < .14 ? 1 - .05 * Math.sin(k / .14 * Math.PI) : 1;
  const bleed = clamp(k / .25);
  g.save(); g.globalCompositeOperation = 'multiply';
  g.save(); g.globalAlpha *= .22 * (1 - bleed * .55); g.filter = `blur(${4 + bleed * 6}px)`; const bs = 1 + .035 * ease.outC(bleed); g.scale(bs, bs); g.drawImage(art, -art.width / 2, -art.height / 2); g.restore();
  g.globalAlpha *= .92; g.scale(sq, 2 - sq); g.drawImage(art, -art.width / 2, -art.height / 2);
  g.restore();
  // spatter
  const sp = rng('pzsp' + seed);
  g.fillStyle = ink;
  for (let i = 0; i < 14; i++) {
    const a = sp() * Math.PI * 2, d0 = art.width * .4 + sp() * 60, fly = ease.outC(clamp(k / .12)), rad = sp.range(2, 7);
    const px = Math.cos(a) * (d0 * .8 + fly * d0 * .25), py = Math.sin(a) * (d0 * .45 + fly * 40) * .8;
    g.globalAlpha = .55; g.beginPath(); g.arc(px, py, rad * (1 + (1 - fly) * .5), 0, 7); g.fill();
  }
  if (k < .22) { // dust ring
    const dk = k / .22; g.globalAlpha = (1 - dk) * .5; g.strokeStyle = '#fff8e6'; g.lineWidth = 10 * (1 - dk);
    g.beginPath(); g.ellipse(0, 0, art.width * (.5 + dk * .35), art.height * (.5 + dk * .5), 0, 0, 7); g.stroke();
  }
  g.restore();
  if (kind === 'contested' && note) pzRefereeNote(g, t, { x: opts.noteX !== undefined ? opts.noteX : x + art.width * .25 * scale, y: opts.noteY !== undefined ? opts.noteY : y + art.height * .32 * scale, t0: opts.noteAt !== undefined ? opts.noteAt : t0 + .35, lines: Array.isArray(note) ? note : [note], scale: scale * (opts.noteScale || 1), seed });
}
// The referee's note: a small slip clipped on, with handwriting. (Used by contested stamps; also standalone.)
function pzRefereeNote(g, t, opts = {}) {
  const { x, y, t0 = 0, lines = ['under review'], scale = 1, seed = 'rn', rot = .06 } = opts;
  if (t < t0) return;
  const k = tw(t, t0, .45, ease.outBack), r = rng('pzrn' + seed);
  const w = 360, h = 96 + lines.length * 40;
  g.save(); g.translate(x, y + (1 - k) * 40); g.rotate(rot + (1 - k) * .3); g.scale(scale * k, scale * k);
  const slip = deform(polyRect(0, 0, w, h), r, 2, .01);
  g.save(); g.translate(5, 7); g.globalAlpha = .22; g.fillStyle = PAL.umber; tracePoly(g, slip); g.fill(); g.restore();
  paintFill(g, gg => tracePoly(gg, slip), '#f6f0dc', { tex: .15 });
  // ruled lines
  g.strokeStyle = 'rgba(79,125,120,.25)'; g.lineWidth = 1.2;
  for (let i = 0; i < lines.length; i++) { g.beginPath(); g.moveTo(16, 104 + i * 40); g.lineTo(w - 16, 104 + i * 40); g.stroke(); }
  inkPoly(g, slip, { width: 2.2, seed: 'pzrs' + seed, boil: pzBoil(t), wobble: .5 });
  // header with a little whistle
  g.font = pzFont(25, 'display', 800); g.fillStyle = PZ.ink; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillText('REFEREE’S NOTE', 22, 46);
  inkPath(g, [[22, 56], [w - 90, 54]], { width: 2, seed: 'pzrl' + seed, wobble: .4 });
  lines.forEach((ln, i) => pzMemoText(g, t, { text: ln, x: 22, y: 96 + i * 40, size: 36, t0: t0 + .2 + i * .35, dur: .1 + ln.length * .028, color: '#3d3550', rot: 0 }));
  // paper clip
  g.save(); g.translate(w - 70, -18); g.rotate(.1);
  inkPath(g, [[0, 50], [0, 6], [8, -4], [18, 6], [18, 60], [9, 68], [2, 60], [2, 18]], { width: 4, color: '#8a8f95', seed: 'pzclip', wobble: .2, taper: false });
  g.restore();
  g.restore();
}

// ============================================================================================
// 2. counters, calendar, mosaic
// ============================================================================================

// A value over time: number | fn(t) | { from, to, t0, dur, ease: 'lin'|'inC'|'outC'|'inOutC'|'exp' }.
// 'exp' interpolates logarithmically (constant growth rate), the natural shape for runaway counters.
function pzValueAt(spec, t) {
  if (typeof spec === 'number') return spec;
  if (typeof spec === 'function') return spec(t);
  const { from = 0, to = 100, t0 = 0, dur = 1, ease: e = 'outC' } = spec;
  const k = clamp((t - t0) / dur);
  if (e === 'exp') return Math.exp(lerp(Math.log(Math.max(1, from)), Math.log(Math.max(1, to)), k));
  return lerp(from, to, (ease[e] || ease.outC)(k));
}
// Time at which a non-decreasing value first reaches `target` (bisection), or null.
function pzCrossTime(spec, target, ta, tb) {
  if (pzValueAt(spec, tb) < target) return null;
  if (pzValueAt(spec, ta) >= target) return ta;
  for (let i = 0; i < 40; i++) { const m = (ta + tb) / 2; if (pzValueAt(spec, m) >= target) tb = m; else ta = m; }
  return tb;
}
// Odometer position of digit i (0 = units): integer part plus the rolling fraction during a carry.
function pzOdoPos(v, i) {
  const p = Math.pow(10, i), q = Math.floor(v / p);
  if (i === 0) return v;
  const rem = v - q * p;
  return q + clamp(rem - (p - 1));
}
// One rolling digit drum. pos = continuous digit value; speed = digits/second (for motion blur).
function pzDrum(g, cx, cy, w, h, pos, speed, opts = {}) {
  const { color = PZ.ink, size = h * .78, fam = 'display', weight = 800, bg = '#fbf3df' } = opts;
  g.save();
  g.beginPath(); g.rect(cx - w / 2, cy - h / 2, w, h); g.clip();
  g.fillStyle = bg; g.fillRect(cx - w / 2, cy - h / 2, w, h);
  const grd = g.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
  grd.addColorStop(0, 'rgba(90,60,30,.35)'); grd.addColorStop(.22, 'rgba(90,60,30,0)'); grd.addColorStop(.78, 'rgba(90,60,30,0)'); grd.addColorStop(1, 'rgba(90,60,30,.35)');
  g.font = pzFont(size, fam, weight); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = color;
  const sp = Math.abs(speed);
  if (sp > 40) { // a blur of digits
    const base = Math.floor(pos * 3) % 10;
    for (let k = -3; k <= 3; k++) { g.globalAlpha = .16; g.fillText(String((base + k + 20) % 10), cx, cy + k * h * .34 + (pos * 97 % 1) * h * .3); }
    g.globalAlpha = .5; g.fillRect(cx - w * .06, cy - h / 2, w * .12, h);
  } else {
    const d = Math.floor(pos), f = pos - d, ghosts = sp > 6 ? 3 : 1;
    for (let gi = 0; gi < ghosts; gi++) {
      const off = gi === 0 ? 0 : (gi === 1 ? -1 : 1) * Math.min(.35, sp / 60);
      g.globalAlpha = gi === 0 ? (ghosts > 1 ? .7 : 1) : .25;
      const ff = f + off;
      g.fillText(String(((d % 10) + 10) % 10), cx, cy - ff * h);
      g.fillText(String((((d + 1) % 10) + 10) % 10), cx, cy + (1 - ff) * h);
      g.fillText(String((((d - 1) % 10) + 10) % 10), cx, cy - (1 + ff) * h);
    }
  }
  g.globalAlpha = 1; g.fillStyle = grd; g.fillRect(cx - w / 2, cy - h / 2, w, h);
  g.restore();
}
const pzDigits = v => Math.max(1, Math.floor(Math.log10(Math.max(1, v)) + 1e-9) + 1);

// ---- sparks counter (slot-machine odometer that can overflow absurdly) ----------------------------
// opts: x, y (left edge, vertical centre), size=64 (digit height), value (see pzValueAt), minDigits=4,
//       maxDigits=7 (beyond: bolts pop, the plaque strains and keeps growing off-screen), tStart (earliest
//       time to search for digit crossings; default t-30), infAt (time the digits give up and show ∞)
function pzSparks(g, t, opts = {}) {
  const { x = 60, y = 70, size = 64, value = 0, minDigits = 4, maxDigits = 7, infAt = null, label = 'sparks', seed = 'spk' } = opts;
  const tStart = opts.tStart !== undefined ? opts.tStart : t - 30;
  const v = Math.max(0, pzValueAt(value, t)), vPrev = Math.max(0, pzValueAt(value, t - 1 / 24));
  const n = Math.max(minDigits, pzDigits(v));
  const dw = size * .66, dh = size * 1.08, gap = size * .07, cg = size * .16; // cg: extra gap at thousands
  // window count animates as digits are added
  let slots = minDigits;
  for (let d = minDigits + 1; d <= n; d++) {
    const tc = pzCrossTime(value, Math.pow(10, d - 1), tStart, t);
    slots += tc === null ? 0 : tw(t, tc, .22, ease.outBack);
  }
  const over = n > maxDigits ? pzCrossTime(value, Math.pow(10, maxDigits), tStart, t) : null;
  const strain = over !== null ? Math.min(1, (t - over) * 2) : 0;
  const shake = strain ? Math.sin(t * 61) * 3 * strain : 0;
  const iconW = size * 1.15, padX = size * .3;
  const commas = Math.max(0, Math.ceil(slots) - 1) / 3 | 0;
  const pw = iconW + slots * (dw + gap) + commas * cg + padX, ph = dh + size * .38;
  const slotX = i => pw - padX / 2 - (i + .5) * (dw + gap) - gap / 2 - Math.floor(i / 3) * cg;
  const bf = pzBoil(t);
  g.save(); g.translate(x + shake, y);
  // plaque
  const pl = deform(polyRect(0, -ph / 2, pw, ph), rng('pzsp' + seed), 1, .004);
  g.save(); g.translate(5, 8); g.globalAlpha = .25; g.fillStyle = PAL.umber; tracePoly(g, pl); g.fill(); g.restore();
  paintFill(g, gg => tracePoly(gg, pl), strain ? mix('#f3e6c6', '#f0c0a0', strain * .4) : '#f3e6c6', { tex: .2 });
  inkPoly(g, pl, { width: 3, seed: 'pzspo' + seed, boil: bf, wobble: .5 });
  // spark icon pulses on each unit
  const pulse = 1 + .12 * Math.max(0, Math.sin((v % 1) * Math.PI));
  pzSpark(g, iconW * .55, 0, size * .42 * pulse, { t, seed: 'pzspi' + seed, rot: v * .02 });
  // digits (right-aligned in their windows)
  const inf = infAt !== null && t >= infAt;
  const dk = inf ? 1 - tw(t, infAt, .18) : 1;
  if (dk > 0) {
    for (let i = 0; i < Math.ceil(slots); i++) {
      const cx = slotX(i);
      const a = clamp(slots - i);
      if (i > 0 && i % 3 === 0 && i < pzDigits(v)) { g.save(); g.globalAlpha *= a * dk; g.font = pzFont(size * .7, 'display', 800); g.fillStyle = PZ.ink; g.textAlign = 'center'; g.fillText(',', cx + dw / 2 + gap / 2 + cg / 2, dh * .42); g.restore(); }
      if (a <= 0) continue;
      const pos = pzOdoPos(v, i), sp = (pos - pzOdoPos(vPrev, i)) * 24;
      g.save(); g.globalAlpha *= a * dk; g.translate(cx, 0); g.scale(1, lerp(.2, 1, a) * dk);
      pzDrum(g, 0, 0, dw, dh, i < n ? pos : 0, i < n ? sp : 0, { size: size * .74 });
      inkPath(g, [[-dw / 2, -dh / 2], [dw / 2, -dh / 2], [dw / 2, dh / 2], [-dw / 2, dh / 2], [-dw / 2, -dh / 2]], { width: 2, seed: 'pzdw' + i, boil: bf, wobble: .4, taper: false });
      g.restore();
    }
  }
  if (inf) {
    const k = tw(t, infAt, .4, ease.outBack);
    g.save(); g.translate(iconW + (pw - iconW) / 2, size * .08); g.scale(k, k);
    g.font = pzFont(size * 1.5, 'math', 600); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = PAL.clayDeep;
    g.fillText('∞', 0, 0); g.restore();
  }
  // bolts that pop off when it overflows
  for (const [bx, s] of [[size * .2, -1], [pw - size * .2, 1]]) {
    if (over === null) { g.fillStyle = '#8a8070'; g.beginPath(); g.arc(bx, -ph / 2 + size * .16, size * .06, 0, 7); g.fill(); continue; }
    const k = t - over; if (k > 1.5) continue;
    const bxx = bx + s * k * 220, byy = -ph / 2 + size * .16 - 260 * k + 900 * k * k;
    g.fillStyle = '#8a8070'; g.beginPath(); g.arc(bxx, byy, size * .06, 0, 7); g.fill();
  }
  g.restore();
  return { width: pw, value: v };
}

// ---- problem-number counter: 001 → 909 → ∞, blurring as it accelerates -----------------------------
// opts: x, y (centre), scale=1, keys: [[t, n], ...] (n may be Infinity for the last key),
//       interpolation between keys is exponential (steady acceleration feel); label='PROBLEM'
function pzProblemValue(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [ta, a] = keys[i], [tb, b] = keys[i + 1];
    if (t < tb) {
      const k = (t - ta) / (tb - ta);
      if (b === Infinity) return a * Math.pow(1e7, k * k);   // runaway
      return a > 0 && b > 0 ? a * Math.pow(b / a, k) : lerp(a, b, k);
    }
  }
  return keys[keys.length - 1][1];
}
function pzProblemCounter(g, t, opts = {}) {
  const { x = W / 2, y = H / 2, scale = 1, keys = [[0, 1], [4, 909]], label = 'PROBLEM', seed = 'pc' } = opts;
  const v = pzProblemValue(keys, t), vp = pzProblemValue(keys, t - 1 / 24);
  const last = keys[keys.length - 1];
  const inf = last[1] === Infinity && t >= last[0];
  const rate = Math.abs(v - vp) * 24;                       // problems per second
  const blur = inf ? 0 : clamp((Math.log10(Math.max(1, rate)) - 1.3) / 2.2) * 9;
  const n = inf ? 3 : Math.max(3, pzDigits(Math.floor(v)));
  const size = 150, dw = size * .62, dh = size * 1.1;
  const cw = Math.max(470, 160 + n * dw + 60), ch = 290;
  const bf = pzBoil(t);
  g.save(); g.translate(x, y); g.scale(scale, scale);
  if (inf) { const k = tw(t, last[0], .5, ease.outElastic); g.scale(.85 + .15 * k, .85 + .15 * k); }
  const body = pzCardBody(Math.round(cw), ch, { band: PAL.clay, seed: 'pzpc' + seed + Math.round(cw / 40), variant: bf % 3, bandW: 0 });
  g.drawImage(body, -cw / 2 - 26, -ch / 2 - 26);
  g.save(); g.beginPath(); g.rect(-cw / 2 + 6, -ch / 2 + 6, cw - 12, 66); g.clip();
  wash(g, polyRect(-cw / 2, -ch / 2, cw, 76), PAL.clay, { seed: 'pzpcb' + seed, layers: 10, alpha: .16, spread: .02, depth: 3, edge: false });
  g.restore();
  g.font = pzFont(44, 'display', 700); g.fillStyle = PZ.card; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(label.split('').join(' '), 0, -ch / 2 + 40);
  g.font = pzFont(size * .62, 'display', 800); g.fillStyle = PZ.ink; g.textAlign = 'right';
  const total = n * dw, nx = -total / 2 + 40;
  g.fillText('№', nx - 14, 42);
  if (inf) {
    g.font = pzFont(size * 1.35, 'math', 600); g.textAlign = 'center'; g.fillStyle = PAL.clayDeep;
    g.fillText('∞', nx + total / 2, 50);
    // sparkle burst
    const k = t - last[0];
    if (k < .6) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, d = 120 + k * 260; pzSpark(g, nx + total / 2 + Math.cos(a) * d, 40 + Math.sin(a) * d * .6, 16 * (1 - k / .6), { t, line: null, fill: PZ.gold }); }
  } else {
    const sc = pzScratch('pzpc', total + 20, dh + 20), sg = sc.getContext('2d');
    for (let i = 0; i < n; i++) {
      const cx = total + 10 - (i + .5) * dw, pos = pzOdoPos(Math.floor(v) + (v % 1), i), sp = (pos - pzOdoPos(vp, i)) * 24;
      pzDrum(sg, cx, dh / 2 + 10, dw - 6, dh, pos, sp, { size: size * .8, bg: '#f7eed7' });
    }
    g.save(); if (blur > .3) g.filter = `blur(${blur.toFixed(1)}px)`;
    g.drawImage(sc, 0, 0, total + 20, dh + 20, nx - 10, 42 - dh / 2 - 10, total + 20, dh + 20);
    g.restore();
    for (let i = 0; i < n; i++) { const cx = nx + total - (i + .5) * dw; inkPoly(g, polyRect(cx - dw / 2 + 3, 42 - dh / 2, dw - 6, dh), { width: 2.2, seed: 'pzpcd' + i, boil: bf, wobble: .4 }); }
  }
  g.restore();
  return { value: v, rate, infinite: inf };
}

// ---- calendar pages tearing off: years → months → days -------------------------------------------
// pzCalendarSchedule builds the default accelerating page list; pzCalendar draws a pad from any list.
// page: { big: '2021', top: 'YEAR', foot: '', red: false, tear: time (Infinity = never) }
function pzCalendarSchedule(opts = {}) {
  const { t0 = 0, dur = 6, years = [2020, 2021, 2022, 2023, 2024, 2025], months = 9, days = 30, first = .9, lastGap = .045 } = opts;
  const MON = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const WD = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const pages = [];
  years.forEach(y => pages.push({ big: String(y), top: 'THE YEAR', foot: '' }));
  for (let m = 0; m < months; m++) pages.push({ big: MON[m].slice(0, 3), top: '2026', foot: MON[m].toLowerCase() });
  for (let d = 1; d <= days; d++) { const wd = new Date(Date.UTC(2026, 8, d)).getUTCDay(); pages.push({ big: String(d), top: 'SEPTEMBER 2026', foot: WD[wd].toLowerCase(), red: wd === 0 }); }
  pages.push({ big: '?', top: 'TOMORROW', foot: '', last: true });
  // geometric gaps from `first` down to `lastGap`, scaled to fill dur
  const N = pages.length - 1, gaps = [];
  for (let i = 0; i < N; i++) gaps.push(first * Math.pow(lastGap / first, i / (N - 1)));
  const sum = gaps.reduce((a, b) => a + b, 0), s = dur / sum;
  let tt = t0; pages.forEach((p, i) => { if (i < N) { tt += gaps[i] * s; p.tear = tt; } else p.tear = Infinity; });
  return pages;
}
function pzCalendarPage(p, w, h) {
  return cached(`pzcal:${p.top}:${p.big}:${p.foot}:${p.red}:${w}x${h}`, w + 20, h + 20, gg => {
    gg.translate(10, 10);
    const pg = deform(polyRect(0, 0, w, h), rng('pzcp' + p.big + p.top), 2, .004);
    paintFill(gg, g2 => tracePoly(g2, pg), '#fbf6e8', { tex: .14 });
    gg.save(); tracePoly(gg, pg); gg.clip();
    wash(gg, polyRect(-10, -10, w + 20, h * .2 + 10), p.red ? PAL.berry : PAL.clay, { seed: 'pzcpb' + p.top, layers: 12, alpha: .13, spread: .02, depth: 3, edge: false });
    gg.restore();
    inkPoly(gg, pg, { width: 2, seed: 'pzcpo' + p.big, wobble: .4, color: PZ.inkSoft });
    gg.textAlign = 'center'; gg.textBaseline = 'middle';
    gg.fillStyle = PZ.card; gg.font = pzFont(h * .075, 'display', 700); gg.fillText(p.top.split('').join(String.fromCharCode(8202)), w / 2, h * .105);
    gg.fillStyle = p.red ? PAL.berry : PZ.ink;
    let fs = h * (p.big.length > 3 ? .3 : .42); gg.font = pzFont(fs, 'display', 800);
    const mw = gg.measureText(p.big).width; if (mw > w * .86) { fs *= w * .86 / mw; gg.font = pzFont(fs, 'display', 800); }
    gg.fillText(p.big, w / 2, h * .57);
    if (p.foot) { gg.fillStyle = PZ.inkSoft; gg.font = pzFont(h * .075, 'body', 500, 'italic'); gg.fillText(p.foot, w / 2, h * .88); }
  });
}
// opts: x, y (centre of the pad), scale=1, pages (default: pzCalendarSchedule({t0})), t0
function pzCalendar(g, t, opts = {}) {
  const { x = W / 2, y = H / 2, scale = 1, t0 = 0, seed = 'cal' } = opts;
  const pages = opts.pages || pzCalendarSchedule({ t0 });
  const w = 380, h = 440, bf = pzBoil(t);
  let cur = pages.findIndex(p => p.tear > t); if (cur < 0) cur = pages.length - 1;
  g.save(); g.translate(x, y); g.scale(scale, scale); g.translate(-w / 2, -h / 2);
  // torn pages: the first moments of the peel are drawn in front of the pad; after that they fly BEHIND it, so an
  // older page can never land on top of a newer one (the visible order only ever increases)
  const KF = .22, flying = [];
  for (let i = Math.max(0, cur - 14); i < cur; i++) {
    const p = pages[i], gapN = (pages[i + 1] && pages[i + 1].tear < Infinity ? pages[i + 1].tear : p.tear + 1) - p.tear;
    const fly = clamp(.55 + gapN * 1.2, .55, 1.1), k = (t - p.tear) / fly;
    if (k >= 0 && k <= 1) flying.push([i, p, k]);
  }
  const drawFly = ([i, p, k]) => {
    const rr = rng('pzfly' + i), dir = rr() < .5 ? -1 : 1;
    const ang = dir * (ease.outQ(k) * rr.range(.6, 1.4) + k * k * 1.5);
    const tx = dir * (k * rr.range(260, 520)), ty = -k * rr.range(80, 200) + k * k * 900;
    g.save(); g.translate(w / 2 + tx, 4 + ty); g.rotate(ang); g.scale(1 - k * .25, 1 - k * .25);
    g.globalAlpha = 1 - clamp((k - .7) / .3);
    g.transform(1, 0, dir * .25 * Math.sin(k * Math.PI), 1 - .25 * Math.sin(k * Math.PI), 0, 0);
    g.drawImage(pzCalendarPage(p, w, h), -w / 2 - 10, -10);
    g.restore();
  };
  flying.filter(f => f[2] >= KF).forEach(drawFly);
  // back board and stack edges
  g.save(); g.translate(8, 12); g.globalAlpha = .25; g.fillStyle = PAL.umber; g.fillRect(0, -20, w, h + 30); g.restore();
  const stack = Math.min(6, pages.length - cur);
  for (let i = stack; i >= 1; i--) { g.fillStyle = i % 2 ? '#efe5cf' : '#e6dac0'; g.fillRect(i * 1.2, i * 3, w, h); g.strokeStyle = 'rgba(90,60,30,.25)'; g.strokeRect(i * 1.2, i * 3, w, h); }
  // current page
  g.drawImage(pzCalendarPage(pages[cur], w, h), -10, -10);
  // torn stubs under the binding
  g.fillStyle = '#f3ead6';
  const r = rng('pzstub'); g.beginPath(); g.moveTo(0, 0); for (let i = 0; i <= 20; i++) g.lineTo(i / 20 * w, 10 + r() * 9); g.lineTo(w, 0); g.closePath(); g.fill();
  // binding
  const bind = deform(polyRect(-14, -46, w + 28, 52), rng('pzbind' + seed), 1, .006);
  paintFill(g, gg => tracePoly(gg, bind), '#7a5233', { tex: .4, shade: 'rgba(40,20,10,.3)', shadeFn: gg => gg.fillRect(-20, -14, w + 40, 20) });
  inkPoly(g, bind, { width: 2.6, seed: 'pzbindo' + seed, boil: bf, wobble: .5 });
  for (const rx of [w * .25, w * .75]) { g.strokeStyle = PZ.brass; g.lineWidth = 7; g.beginPath(); g.arc(rx, -20, 16, Math.PI * .9, Math.PI * 2.1); g.stroke(); g.strokeStyle = PZ.ink; g.lineWidth = 1.5; g.stroke(); }
  flying.filter(f => f[2] < KF).forEach(drawFly);
  g.restore();
  return { page: pages[cur], index: cur };
}

// ---- mosaic: the screen splits into ever more tiny puzzle panels ------------------------------------
// opts: x, y, w, h (area), steps: [[t, panels], ...] with panels in 1, 2, 4, 16, 64, 256 …,
//       startNum (problem number of panel 0), live: (i, g, t, rect) => bool (draw panel i live; return
//       true if drawn) for the big early panels, seed
// Filler thumbnails. 'vortex' (Navier–Stokes) and 'strip' (zeta zeros) are deliberately NOT in this list: fillers get a
// plain Q.E.D., and those two results are only Q.E.D.? (pzThumbIcon still draws them if asked).
const PZ_THUMBS = ['tiles', 'triangle', 'medal', 'ribbon', 'spheres', 'graph', 'arrows', 'scroll', 'matches', 'maze', 'grid', 'knot', 'gears', 'balance'];
// The verdict a thumbnail of a given type may carry under the stamp policy (for chapter code that stamps thumbnails).
const pzThumbVerdict = (type, kind = 'qed') => (type === 'vortex' || type === 'strip') && kind === 'qed' ? 'contested' : kind;
function pzThumbIcon(g, type, cx, cy, s, seed) {
  const r = rng('pzti' + type + seed), ink = { width: 3.2, seed: 'pzti' + type, wobble: .5 };
  const C = (x, y, rad, col) => { wash(g, polyCircle(cx + x * s, cy + y * s, rad * s, rad * s, 18), col, { seed: 'pztw' + type + x + y, layers: 10, alpha: .12, spread: .1, depth: 3, edge: false }); inkPoly(g, polyCircle(cx + x * s, cy + y * s, rad * s, rad * s, 22), ink); };
  const L = (pts, o = {}) => inkPath(g, pts.map(([a, b]) => [cx + a * s, cy + b * s]), { ...ink, ...o });
  switch (type) {
    case 'tiles': for (let i = 0; i < 4; i++) { const p = polyRect(cx + (-1.6 + i * .82) * s, cy - .38 * s, .72 * s, .72 * s); wash(g, p, PZ.tile, { seed: 'pzttl' + i, layers: 8, alpha: .2, spread: .02, depth: 3, edge: false }); inkPoly(g, p, ink); g.font = pzFont(s * .5, 'display', 700); g.fillStyle = PZ.ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ABCD'[i], cx + (-1.24 + i * .82) * s, cy + .02 * s); } break;
    case 'triangle': L([[-1.2, .8], [1.2, .8], [-.2, -1], [-1.2, .8]], { taper: false }); inkPoly(g, polyCircle(cx + .02 * s, cy + .05 * s, 1.3 * s, 1.3 * s, 30), { ...ink, color: PZ.memo }); break;
    case 'medal': L([[-.5, -1.3], [0, -.2], [.5, -1.3]], { width: 9, color: PAL.teal }); C(0, .35, .7, PZ.gold); break;
    case 'ribbon': { const p = []; for (let i = 0; i <= 40; i++) { const u = i / 40; p.push([-1.4 + u * 2.8, Math.sin(u * 14) * .45 * Math.sin(u * Math.PI)]); } L(p, { width: 10, color: PAL.teal }); break; }
    case 'spheres': C(0, 0, .45, PAL.clay); for (let i = 0; i < 6; i++) C(Math.cos(i * Math.PI / 3) * .9, Math.sin(i * Math.PI / 3) * .9, .45, PAL.sky); break;
    case 'graph': { const P = []; for (let i = 0; i < 7; i++) P.push([Math.cos(i * 1.2) * 1.1 * r.range(.6, 1), Math.sin(i * 1.2) * .9 * r.range(.6, 1)]); for (let i = 0; i < 7; i++) L([P[i], P[(i + 2) % 7]], { width: 2 }); P.forEach(p => C(p[0], p[1], .12, PAL.clay)); break; }
    case 'arrows': for (const [a, b] of [[-1.3, -.8], [-1.3, 0], [-1.3, .8]]) L([[a, b], [.9, 0]], { color: PAL.clayDeep }); C(1.05, 0, .16, PZ.gold); break;
    case 'vortex': { const p = []; for (let i = 0; i <= 80; i++) { const a = i * .25, rr = 1.3 * Math.exp(-a * .12); p.push([Math.cos(a) * rr, Math.sin(a) * rr * .8]); } L(p, { color: PAL.teal }); break; }
    case 'strip': g.fillStyle = rgba(PAL.sky, .5); g.fillRect(cx - .5 * s, cy - 1.3 * s, s, 2.6 * s); L([[0, -1.3], [0, 1.3]], { color: PAL.clayDeep, width: 2.4 }); for (let i = 0; i < 6; i++) C(0, -1.1 + i * .44, .1, PZ.ink); break;
    case 'scroll': for (let i = 0; i < 6; i++) L([[-1.2, -1 + i * .4], [-1.2 + r.range(.8, 2.4), -1 + i * .4]], { width: 2.4, color: PZ.inkSoft }); break;
    case 'matches': for (let i = 0; i < 5; i++) { const a = i * .6 - 1.2; L([[a, .9], [a + .4, -.9]], { width: 4, color: '#a07a4f' }); C(a + .4, -.95, .1, PAL.berry); } break;
    case 'maze': for (let i = 0; i < 4; i++) L([[-1.2 + i * .25, -1 + i * .25], [1.2 - i * .25, -1 + i * .25], [1.2 - i * .25, 1 - i * .25], [-1.2 + i * .25, 1 - i * .25], [-1.2 + i * .25, -.6 + i * .25]], { width: 2.4, taper: false }); break;
    case 'grid': for (let i = 0; i <= 3; i++) { L([[-1.2 + i * .8, -1.2], [-1.2 + i * .8, 1.2]], { width: 2 }); L([[-1.2, -1.2 + i * .8], [1.2, -1.2 + i * .8]], { width: 2 }); } g.font = pzFont(s * .5, 'display', 700); g.fillStyle = PZ.ink; g.textAlign = 'center'; g.textBaseline = 'middle'; for (let i = 0; i < 4; i++) g.fillText(String(1 + Math.floor(r() * 9)), cx + (-.8 + (i % 3) * .8) * s, cy + (-.8 + Math.floor(i / 2) * .8) * s); break;
    case 'knot': { const p = []; for (let i = 0; i <= 90; i++) { const a = i / 90 * Math.PI * 2; p.push([Math.sin(a) + 2 * Math.sin(2 * a), Math.cos(a) - 2 * Math.cos(2 * a)].map(v => v * .4)); } L(p, { width: 5, color: PAL.plum }); break; }
    case 'gears': for (const [gx, gy, gr] of [[-.5, 0, .7], [.75, -.3, .5]]) { const p = []; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, rr = gr * (i % 4 < 2 ? 1 : .8); p.push([gx + Math.cos(a) * rr, gy + Math.sin(a) * rr]); } wash(g, p.map(([a, b]) => [cx + a * s, cy + b * s]), PAL.sage, { seed: 'pzg' + gx, layers: 8, alpha: .2, spread: .02, depth: 3, edge: false }); inkPoly(g, p.map(([a, b]) => [cx + a * s, cy + b * s]), ink); } break;
    case 'balance': L([[0, 1], [0, -.8]]); L([[-1.2, -.6], [1.2, -.9]]); C(-1.1, -.1, .35, PZ.gold); C(1.1, -.4, .3, PAL.sage); break;
  }
}
function pzThumb(type, w = 480, h = 270) {
  return cached(`pzthumb:${type}:${w}x${h}`, w, h, gg => {
    const sh = deform(polyRect(4, 4, w - 8, h - 8), rng('pzth' + type), 1, .005);
    paintFill(gg, g2 => tracePoly(g2, sh), PZ.sheet, { tex: .14 });
    gg.save(); tracePoly(gg, sh); gg.clip(); gg.strokeStyle = 'rgba(79,125,120,.16)'; gg.lineWidth = 1;
    for (let x = 24; x < w; x += 24) { gg.beginPath(); gg.moveTo(x, 0); gg.lineTo(x, h); gg.stroke(); }
    for (let y = 24; y < h; y += 24) { gg.beginPath(); gg.moveTo(0, y); gg.lineTo(w, y); gg.stroke(); }
    wash(gg, polyRect(0, 0, w, 64), PAL.clay, { seed: 'pzthb' + type, layers: 10, alpha: .14, spread: .02, depth: 3, edge: false });
    gg.restore();
    inkPoly(gg, sh, { width: 3, seed: 'pzths' + type, wobble: .5 });
    pzThumbIcon(gg, type, w / 2, h * .6, 62, type);
  });
}
function pzMosaicLayout(n, x, y, w, h) {
  const cols = n === 2 ? 2 : Math.round(Math.sqrt(n)), rows = Math.ceil(n / cols);
  const gap = Math.max(3, 18 / Math.sqrt(cols));
  const cw = (w - gap * (cols + 1)) / cols, chh = (h - gap * (rows + 1)) / rows;
  const rects = [];
  for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols); rects.push([x + gap + c * (cw + gap), y + gap + r * (chh + gap), cw, chh]); }
  return rects;
}
function pzMosaic(g, t, opts = {}) {
  const { x = 0, y = 0, w = W, h = H, steps = [[0, 1], [1, 2], [2, 4], [3, 16], [4, 64], [5, 256]], startNum = 120, live = null, seed = 'mos', stampRate = 1 } = opts;
  let li = 0; for (let i = 0; i < steps.length; i++) if (t >= steps[i][0]) li = i;
  const [tl, n] = steps[li];
  const rects = pzMosaicLayout(n, x, y, w, h);
  const prev = li > 0 ? pzMosaicLayout(steps[li - 1][1], x, y, w, h) : null;
  const numBase = startNum + steps.slice(0, li).reduce((a, s) => a + s[1], 0);
  const bf = pzBoil(t);
  const panel = (lv, i, rect, alpha, sc0) => {
    let [rx, ry, rw, rh] = rect;
    const nn = steps[lv][1], r = rng('pzm' + seed + lv + ':' + i), tb = steps[lv][0];
    if (live && live(i, g, t, rect, lv)) return;
    const type = PZ_THUMBS[(i * 7 + lv * 3 + Math.floor(r() * 3)) % PZ_THUMBS.length];
    const nb = startNum + steps.slice(0, lv).reduce((a, s) => a + s[1], 0);
    g.save(); g.globalAlpha *= alpha;
    g.translate(rx + rw / 2, ry + rh / 2); g.scale(sc0, sc0); g.translate(-rw / 2, -rh / 2);
    g.drawImage(pzThumb(type), 0, 0, rw, rh);
    g.beginPath(); g.rect(0, 0, rw, rh); g.clip();
    const sc = rw / 480;
    if (sc > .12) {
      g.font = pzFont(30 * sc, 'display', 800); g.fillStyle = PZ.card; g.textAlign = 'left'; g.textBaseline = 'middle';
      g.fillText('№' + (nb + i), 18 * sc, 34 * sc);
      if (sc > .3) { g.font = pzFont(26 * sc, 'display', 500); g.textAlign = 'right'; const st = (10 * (1 + (i % 9))) + ' sparks'; g.fillText(st, rw - 18 * sc, 34 * sc); pzSpark(g, rw - 32 * sc - g.measureText(st).width, 34 * sc, 11 * sc, { line: null }); }
    }
    const ts = tb + (nn > 16 ? r() * .25 : i * .04) + (.35 + r() * .9) / stampRate;
    const roll = r(), kind = roll < .8 ? 'qed' : roll < .93 ? 'contested' : 'oncemore';
    if (t >= ts - .16) pzStamp(g, t, { x: rw * (.5 + r() * .12), y: rh * (.58 + r() * .1), t0: ts, kind, scale: sc * 1.05, seed: kind + (i % 5) });
    g.restore();
  };
  // the previous level shrinks away underneath while the new panels pop in, staggered from the centre
  if (prev) {
    const fade = clamp((t - tl) / .45);
    if (fade < 1) prev.forEach((rc, i) => panel(li - 1, i, rc, 1 - fade, 1 - .08 * fade));
  }
  const cxm = x + w / 2, cym = y + h / 2, dmax = Math.hypot(w, h) / 2;
  for (let i = 0; i < n; i++) {
    const rc = rects[i];
    const d = Math.hypot(rc[0] + rc[2] / 2 - cxm, rc[1] + rc[3] / 2 - cym) / dmax;
    const k = prev ? clamp((t - tl - d * .3) / .28) : 1;
    if (k <= 0) continue;
    panel(li, i, rc, clamp(k * 3), ease.outBack(k));
  }
  return { panels: n, level: li };
}

// ============================================================================================
// 3. verse-2 result screens
// ============================================================================================
// Each screen is laid out on a full 1920x1080 frame and accepts { t0, x, y, scale, speed, bg, num, sparks, stampAt }.
// Local time lt = (t - t0) * speed: card slides in at 0, the diagram builds over ~0.3–2.3, the caption at ~1.4,
// the stamp lands at stampAt (default 2.6). At speed 1 a screen is complete in ~3 s (one rapid-fire lyric line).
// The screens never claim more than the research doc allows (see the captions and notes).

// cached watercolour blob (ellipse) for anything that does not move internally
function pzBlob(g, key, cx, cy, rx, ry, color, opts = {}) {
  const pad = Math.max(rx, ry) * .35 + 10;
  const c = cached(`pzblob:${key}:${rx}x${ry}:${color}`, Math.ceil(2 * (rx + pad)), Math.ceil(2 * (ry + pad)), gg => {
    wash(gg, polyCircle(rx + pad, ry + pad, rx, ry, 26), color, { seed: 'pzbl' + key, layers: opts.layers || 26, alpha: opts.alpha || .06, spread: opts.spread || .12, edge: opts.edge !== false });
  });
  g.drawImage(c, cx - rx - pad, cy - ry - pad);
}
// a shaded ball (fast: gradients, for things that move)
function pzBall(g, x, y, r, color, opts = {}) {
  const { line = PZ.ink, lw = Math.max(1, r * .07), alpha = 1 } = opts;
  g.save(); g.globalAlpha *= alpha;
  const gr = g.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
  gr.addColorStop(0, mix(color, '#fff8e8', .55)); gr.addColorStop(.55, color); gr.addColorStop(1, mix(color, '#3b2a1e', .35));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  if (line) { g.strokeStyle = line; g.lineWidth = lw; g.stroke(); }
  g.restore();
}
function pzLabel(g, text, x, y, size, opts = {}) {
  const { color = PZ.ink, align = 'center', fam = 'body', weight = 500, style = 'normal', alpha = 1, baseline = 'alphabetic' } = opts;
  g.save(); g.globalAlpha *= alpha; g.font = pzFont(size, fam, weight, style); g.fillStyle = color; g.textAlign = align; g.textBaseline = baseline; g.fillText(text, x, y); g.restore();
}
function pzCaption(g, lt, opts = {}) {
  const { text = '', sub = '', at = 1.4, y = 948 } = opts;
  const k = clamp((lt - at) / .35);
  if (k <= 0) return;
  g.save(); g.globalAlpha *= k; g.translate(0, (1 - ease.outC(k)) * 14);
  pzLabel(g, text, 960, y, 44, { style: 'italic', weight: 600 });
  if (sub) pzLabel(g, sub, 960, y + 40, 28, { color: PZ.inkSoft, style: 'italic' });
  g.restore();
}
// A big, phone-legible hedge label: a cream tag with heavy type that drops in (≈ 34 px cap height at 1080p even when
// the screen is shown at 0.6 scale). opts: x, y (centre), text, at, size, color, rot, math (typeset with pzMath), sub
function pzHedgeTag(g, lt, opts = {}) {
  const { x, y, text, at = 0, size = 64, color = PAL.clayDeep, rot = -.03, math = false, sub = null, subSize = size * .5, seed = text } = opts;
  const k = ease.outBack(clamp((lt - at) / .35)); if (k <= 0) return;
  g.save();
  g.font = pzFont(size, 'display', 800);
  const tw0 = math ? pzMath(g, text, 0, 0, size * 1.05, { measure: true, weight: 700 }) : g.measureText(text).width;
  g.font = pzFont(subSize, 'display', 700);
  const sw = sub ? g.measureText(sub).width : 0;
  const w = Math.max(tw0, sw) + size * .8, h = size * 1.3 + (sub ? subSize * 1.15 : 0);
  g.translate(x, y); g.rotate(rot); g.scale(k, k);
  const box = deform(polyRect(-w / 2, -h / 2, w, h), rng('pzht' + seed), 1, .01);
  g.save(); g.translate(5, 7); g.globalAlpha *= .22; g.fillStyle = PAL.umber; tracePoly(g, box); g.fill(); g.restore();
  paintFill(g, gg => tracePoly(gg, box), '#fdf6e4', { tex: .12 });
  inkPoly(g, box, { width: 3.2, color, seed: 'pzhto' + seed, boil: pzBoil(lt), wobble: .5 });
  const ty = -h / 2 + size * 1.0;
  if (math) pzMath(g, text, 0, ty, size * 1.05, { align: 'center', weight: 700, color });
  else pzLabel(g, text, 0, ty, size, { fam: 'display', weight: 800, color });
  if (sub) pzLabel(g, sub, 0, ty + subSize * 1.2, subSize, { fam: 'display', weight: 700, color: PZ.inkSoft });
  g.restore();
}
// The shared frame. spec: { id, num, title, sparks, caption, sub, captionAt, stamp: {x, y, kind, note, scale, rot, noteX, noteY}, draw(g, lt) }
function pzScreen(g, t, opts, spec) {
  const { t0 = 0, x = 0, y = 0, scale = 1, speed = 1, bg = true } = opts;
  const lt = (t - t0) * speed;
  const stampAt = opts.stampAt !== undefined ? opts.stampAt : 2.6;
  g.save(); g.translate(x, y); g.scale(scale, scale);
  if (scale < 1) { g.beginPath(); g.rect(0, 0, W, H); g.clip(); }
  if (bg) pzDesk(g, lt);
  pzSheet(g, lt, { x: 100, y: 175, w: 1720, h: 845, seed: 'pzsc' + spec.id });
  spec.draw(g, lt);
  pzCaption(g, lt, { text: spec.caption, sub: spec.sub, at: spec.captionAt || 1.5 });
  pzCard(g, lt, { x: 150, y: 52, w: 660, h: 150, num: opts.num !== undefined ? opts.num : spec.num, title: spec.title, sparks: opts.sparks !== undefined ? opts.sparks : spec.sparks, t0: 0, seed: 'pzsc' + spec.id });
  const st = spec.stamp;
  if (st) pzStamp(g, lt, { seed: spec.id, scale: 1.15, ...st, t0: stampAt, noteAt: stampAt + .3 });
  g.restore();
  return { lt, shake: pzStampShake(lt, stampAt, 10 * scale) };
}

// ---- 1. IMO gold (Jul 2025): medal + olympiad geometry figure; P1–P5 solved, P6 not -------------------
function pzMedal(g, lt, cx, cy, r, opts = {}) {
  const { at = 0, year = '2025', text = 'IMO' } = opts;
  const k = clamp((lt - at) / .5);
  if (k <= 0) return;
  const drop = (1 - ease.outBack(k)) * -320;
  const sw = .28 * Math.exp(-2.8 * Math.max(0, lt - at)) * Math.sin((lt - at) * 7);
  g.save(); g.translate(cx, cy - r * 2.1 + drop); g.rotate(sw); g.translate(0, r * 2.1);
  // ribbon
  for (const [s, col] of [[-1, PAL.teal], [1, PAL.clay]]) {
    const strap = [[s * r * .55, -r * 2.2], [s * r * .95, -r * 2.2], [s * r * .2, -r * .7], [-s * r * .05, -r * .85]];
    paintFill(g, gg => tracePoly(gg, strap), col, { tex: .3 });
    inkPoly(g, strap, { width: 2.5, seed: 'pzmr' + s, boil: pzBoil(lt), wobble: .4 });
  }
  pzBlob(g, 'medal' + r, 0, 0, r, r, PZ.gold, { alpha: .09, layers: 30, spread: .05 });
  g.save(); g.globalAlpha = .55; pzBlob(g, 'medalhl' + r, -r * .25, -r * .3, r * .45, r * .35, '#fff1c0', { alpha: .07, layers: 14, edge: false }); g.restore();
  inkPoly(g, polyCircle(0, 0, r, r, 40), { width: 3.4, seed: 'pzmo', boil: pzBoil(lt), wobble: .5 });
  inkPoly(g, polyCircle(0, 0, r * .8, r * .8, 40), { width: 1.8, seed: 'pzmi', boil: pzBoil(lt), wobble: .4, color: PZ.goldDeep });
  // laurel
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) {
    const a = Math.PI / 2 + s * (.5 + i * .3), px = Math.cos(a) * r * .68, py = Math.sin(a) * r * .68;
    g.save(); g.translate(px, py); g.rotate(a + s * 1.2); g.fillStyle = PZ.goldDeep; g.beginPath(); g.ellipse(0, 0, r * .1, r * .04, 0, 0, 7); g.fill(); g.restore();
  }
  pzLabel(g, text, 0, r * .05, r * .42, { fam: 'display', weight: 800, color: '#6e4a12' });
  pzLabel(g, year, 0, r * .42, r * .2, { fam: 'display', weight: 700, color: '#6e4a12' });
  pzSpark(g, 0, -r * .5, r * .11, { fill: '#fff3c8', t: lt, line: '#6e4a12' });
  g.restore();
}
function pzResultIMO(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'imo', num: 43, title: 'Olympiad Gold', sparks: 50,
    caption: 'IMO 2025: a gold-medal score, written in plain language, inside the 4½-hour limit',
    sub: 'five of six problems solved — problem 6 stayed locked',
    stamp: { x: 1600, y: 830, kind: 'qed', rot: -.14 },
    draw(g, lt) {
      pzMedal(g, lt, 400, 600, 150, { at: .25 });
      // the geometry figure: triangle, circumcircle, altitudes, orthocentre
      const A = [800, 740], B = [1290, 740], C = [920, 330];
      const foot = (P, Q, R) => { const dx = R[0] - Q[0], dy = R[1] - Q[1], u = ((P[0] - Q[0]) * dx + (P[1] - Q[1]) * dy) / (dx * dx + dy * dy); return [Q[0] + u * dx, Q[1] + u * dy]; };
      const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
      const sq = P => P[0] * P[0] + P[1] * P[1];
      const O = [(sq(A) * (B[1] - C[1]) + sq(B) * (C[1] - A[1]) + sq(C) * (A[1] - B[1])) / d, (sq(A) * (C[0] - B[0]) + sq(B) * (A[0] - C[0]) + sq(C) * (B[0] - A[0])) / d];
      const R = Math.hypot(A[0] - O[0], A[1] - O[1]);
      const Hh = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
      const bf = pzBoil(lt), o = { width: 3.4, seed: 'pzg', boil: bf, wobble: .6 };
      const circ = []; for (let i = 0; i <= 90; i++) { const a = -Math.PI / 2 + i / 90 * Math.PI * 2; circ.push([O[0] + Math.cos(a) * R, O[1] + Math.sin(a) * R]); }
      pzStrokeOn(g, circ, ease.inOutQ(pzK(lt, .7, .6)), { ...o, seed: 'pzgc', color: PAL.teal });
      pzStrokeOn(g, [A, B, C, A], ease.inOutQ(pzK(lt, .3, .55)), { ...o, seed: 'pzgt', taper: false, width: 4 });
      [[A, B, C], [B, C, A], [C, A, B]].forEach(([P, Q, Rr], i) => pzStrokeOn(g, [P, foot(P, Q, Rr)], pzK(lt, 1.1 + i * .15, .3), { ...o, seed: 'pzga' + i, width: 2.2, color: PZ.inkSoft }));
      if (lt > 1.6) { g.fillStyle = PAL.clayDeep; g.beginPath(); g.arc(Hh[0], Hh[1], 8, 0, 7); g.fill(); }
      pzMemoCircle(g, lt, { x: Hh[0], y: Hh[1], rx: 34, ry: 30, t0: 1.7, dur: .3, seed: 'h', color: PAL.clayDeep });
      const lab = (s, P, dx, dy, at) => { if (lt > at) pzMath(g, s, P[0] + dx, P[1] + dy, 40, { align: 'center' }); };
      lab('A', A, -26, 34, .5); lab('B', B, 26, 34, .6); lab('C', C, -10, -18, .7); lab('H', Hh, 52, -22, 1.7);
      // P1..P6 (right column, 3 x 2)
      for (let i = 0; i < 6; i++) {
        const x = 1480 + (i % 3) * 100, y = 500 + Math.floor(i / 3) * 100;
        pzTile(g, lt, { x, y, ch: '', size: 78, t0: .9 + i * .06, seed: 'pzp' + i, color: i < 5 ? PZ.tile : '#e3d6bd' });
        if (lt > .9 + i * .06) pzLabel(g, 'P' + (i + 1), x, y + 12, 34, { fam: 'display', weight: 700, color: i < 5 ? PZ.ink : PZ.inkSoft });
        if (i < 5) pzMemoTick(g, lt, { x: x + 26, y: y - 38, size: 44, t0: 1.5 + i * .1, color: PAL.leaf, width: 5.5, seed: 'p' + i });
        else if (lt > 1.9) pzPadlock(g, x + 30, y - 48, .36, { t: lt, label: '' });
      }
      // score
      const sk = clamp((lt - 1.2) / .4);
      if (sk > 0) {
        g.save(); g.globalAlpha *= sk;
        pzMath(g, '35 / 42', 1580, 350, 86, { align: 'center', weight: 700 });
        pzLabel(g, 'points — the gold cut-off', 1580, 400, 30, { style: 'italic', color: PZ.inkSoft });
        g.restore();
      }
      pzMemoText(g, lt, { text: '4½ hours!', x: 1380, y: 700, size: 54, t0: 1.9 });
      pzMemoText(g, lt, { text: '(last year: silver)', x: 1380, y: 752, size: 38, t0: 2.1, rot: -.04 });
    },
  });
}

// ---- 2. protein structures: a bead string folds into a ribbon; 200,000,000+ predicted structures --------
const PZ_AA = 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQ';
function pzFoldPath(N) {
  // a three-helix bundle (residue i -> 3D point), helices joined by short loops
  const P = [], seg = [[0, 17], [18, 22], [23, 40], [41, 45], [46, N - 1]];
  const axes = [[-.55, .3, 1], [.55, .3, -1], [0, -.62, 1]];
  const helixPt = (h, j, n) => { const [ax, az, dir] = axes[h], y = dir * lerp(1.15, -1.15, j / (n - 1)), a = j * 1.745; return [ax + Math.cos(a) * .26, y, az + Math.sin(a) * .26]; };
  for (let i = 0; i < N; i++) {
    let h = 0, j = 0, n = 1;
    if (i <= 17) { h = 0; j = i; n = 18; P.push(helixPt(h, j, n)); }
    else if (i <= 22) { const k = (i - 17) / 6, a = helixPt(0, 17, 18), b = helixPt(1, 0, 18); P.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * .35, lerp(a[2], b[2], k) + Math.sin(k * Math.PI) * .3]); }
    else if (i <= 40) { P.push(helixPt(1, i - 23, 18)); }
    else if (i <= 45) { const k = (i - 40) / 6, a = helixPt(1, 17, 18), b = helixPt(2, 0, N - 46); P.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * Math.PI) * .35, lerp(a[2], b[2], k) - Math.sin(k * Math.PI) * .3]); }
    else P.push(helixPt(2, i - 46, N - 46));
  }
  return P;
}
function pzResultProtein(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'protein', num: 58, title: 'Predicted Folds', sparks: 80,
    caption: 'Over 200 million predicted protein structures',
    sub: 'predictions to test in the lab — and a Nobel Prize in Chemistry, 2024',
    stamp: { x: 1600, y: 800, kind: 'qed', rot: -.18 },
    draw(g, lt) {
      const N = 60, F = pzFoldPath(N), cx = 720, cy = 555, S = 212;
      const rot = 2.2 + lt * .35, cr = Math.cos(rot), sr = Math.sin(rot), tilt = .32, ct = Math.cos(tilt), st = Math.sin(tilt);
      const cols = [PAL.teal, PAL.sage, PZ.gold, PAL.clay, PAL.berry];
      const colAt = u => { const x = clamp(u) * (cols.length - 1), i = Math.min(cols.length - 2, Math.floor(x)); return mix(cols[i], cols[i + 1], x - i); };
      const view = ([x, y, z]) => { const xr = x * cr + z * sr, zr = -x * sr + z * cr; return [xr, y * ct - zr * st, y * st + zr * ct]; };
      const axes = [[-.55, .3], [.55, .3], [0, -.62]];
      const helixOf = i => i <= 17 ? 0 : i >= 23 && i <= 40 ? 1 : i >= 46 ? 2 : -1;
      // per-residue screen position (straight string -> fold) and ribbon facing
      const pts = [];
      for (let i = 0; i < N; i++) {
        const sx = 300 + i * (1000 / (N - 1)), sy = 310 + Math.sin(i * .5 + lt * 3) * 6;
        const fk = ease.inOutC(clamp((lt - .45 - (i / N) * .5) / .9));
        const v = view(F[i]), h = helixOf(i);
        let face = .35;
        if (h >= 0) { const rad = view([F[i][0] - axes[h][0], 0, F[i][2] - axes[h][1]]); face = Math.abs(rad[2]) / (Math.hypot(rad[0], rad[1], rad[2]) || 1); }
        pts.push({ x: lerp(sx, cx + v[0] * S, fk), y: lerp(sy, cy + v[1] * S, fk), z: lerp(0, v[2], fk), u: i / (N - 1), fk, face: lerp(.6, face, fk), helix: h >= 0 });
      }
      const fold = Math.min(...pts.map(p => p.fk));
      // Catmull-Rom subdivision for a smooth ribbon
      const SUB = 5, sm = [];
      for (let i = 0; i < N - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(N - 1, i + 2)];
        for (let k = 0; k < SUB; k++) {
          const u = k / SUB, u2 = u * u, u3 = u2 * u;
          const cr_ = (a, b, c, d) => .5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
          sm.push({ x: cr_(p0.x, p1.x, p2.x, p3.x), y: cr_(p0.y, p1.y, p2.y, p3.y), z: lerp(p1.z, p2.z, u), u: lerp(p1.u, p2.u, u), fk: lerp(p1.fk, p2.fk, u), face: lerp(p1.face, p2.face, u), helix: p1.helix && p2.helix });
        }
      }
      sm.push(pts[N - 1]);
      const segs = []; for (let i = 0; i < sm.length - 1; i++) segs.push([i, (sm[i].z + sm[i + 1].z) / 2]);
      segs.sort((a, b) => a[1] - b[1]);
      g.save(); g.lineCap = 'round';
      for (const pass of [0, 1]) for (const [i, z] of segs) {
        const a = sm[i], b = sm[i + 1], f = ease.inOutQ(Math.min(a.fk, b.fk));
        const base = a.helix ? lerp(9, 42, f) * (.22 + .78 * a.face * a.face) : lerp(9, 13, f);
        const wd = base * (1 + z * .15), col = colAt(a.u);
        if (pass === 0) { g.strokeStyle = PZ.ink; g.lineWidth = wd + 5.5; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); continue; }
        g.strokeStyle = mix(col, '#3b2a1e', clamp(.12 - z * .22 + (1 - a.face) * .18 * f)); g.lineWidth = wd; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        { g.strokeStyle = `rgba(255,248,230,${(.12 + .3 * a.face).toFixed(2)})`; g.lineWidth = wd * .22; g.beginPath(); g.moveTo(a.x - wd * .12, a.y - wd * .18); g.lineTo(b.x - wd * .12, b.y - wd * .18); g.stroke(); }
      }
      g.restore();
      // beads with letters fade out as the chain folds
      if (fold < 1) for (let i = 0; i < N; i++) {
        const p = pts[i], a = 1 - p.fk; if (a <= .02) continue;
        pzBall(g, p.x, p.y, 15, colAt(p.u), { alpha: a });
        pzLabel(g, PZ_AA[i], p.x, p.y + 6, 15, { fam: 'display', weight: 700, color: PZ.card, alpha: a });
      }
      pzMemoText(g, lt, { text: 'sequence  →  shape', x: 300, y: 262, size: 44, t0: .1, color: PZ.memo });
      // the counter
      const ck = clamp((lt - 1.1) / 1.0), val = Math.round(Math.exp(lerp(0, Math.log(2e8), ease.outQ(ck))));
      if (lt > 1.1) {
        pzLabel(g, val.toLocaleString('en-US'), 1440, 470, 84, { fam: 'display', weight: 800 });
        if (ck >= 1) { g.save(); g.font = pzFont(84, 'display', 800); const ww = g.measureText(val.toLocaleString('en-US')).width; g.restore(); const px = 1440 + ww / 2 + 34, py = 440; inkPath(g, [[px - 20, py], [px + 20, py]], { width: 9, seed: 'pzplus1', taper: false }); inkPath(g, [[px, py - 20], [px, py + 20]], { width: 9, seed: 'pzplus2', taper: false }); }
      }
      pzHedgeTag(g, lt, { x: 1440, y: 600, text: 'PREDICTED', sub: 'structures', size: 80, at: 1.3, seed: 'prot' });
    },
  });
}

// ---- 3. kissing spheres: 2-D 6, 3-D 12, 11-D ≥ 593 (a 2-D shadow of 593 unit vectors) ------------------
function pzResultKissing(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'kiss', num: 77, title: 'Kissing Spheres, 11-D', sparks: 120,
    caption: 'Kissing number in 11 dimensions: at least 593 (up from 592)',
    sub: 'a lower bound; the true number is still unknown · right: a 2-D shadow of 11-D',
    stamp: { x: 1640, y: 810, kind: 'qed', rot: -.12 },
    draw(g, lt) {
      // 2-D
      const c2 = [360, 560], r2 = 60;
      if (lt > .2) pzBlob(g, 'k2c', c2[0], c2[1], r2, r2, PAL.clay, { alpha: .08 });
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 3, k = ease.outBack(clamp((lt - .3 - i * .09) / .3));
        if (k <= 0) continue;
        const x = c2[0] + Math.cos(a) * 2 * r2 * k, y = c2[1] + Math.sin(a) * 2 * r2 * k;
        pzBlob(g, 'k2' + i, x, y, r2, r2, PAL.sky, { alpha: .08 });
        inkPoly(g, polyCircle(x, y, r2, r2, 30), { width: 2.6, seed: 'pzk2' + i, boil: pzBoil(lt), wobble: .5 });
      }
      if (lt > .2) inkPoly(g, polyCircle(c2[0], c2[1], r2, r2, 30), { width: 3, seed: 'pzk2c', boil: pzBoil(lt), wobble: .5 });
      if (lt > .9) { pzLabel(g, '2-D', c2[0], 290, 40, { fam: 'display', weight: 700 }); pzLabel(g, '6', c2[0], 800, 64, { fam: 'display', weight: 800 }); }
      // 3-D: icosahedron of 12 around one, rotating
      const c3 = [790, 560], r3 = 50, phi = (1 + Math.sqrt(5)) / 2;
      const V = []; for (const a of [-1, 1]) for (const b of [-1, 1]) { V.push([0, a, b * phi], [a, b * phi, 0], [b * phi, 0, a]); }
      const rot = lt * .7, cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(.4), st = Math.sin(.4);
      const k3 = clamp((lt - .6) / .5);
      if (k3 > 0) {
        const balls = V.map((v, i) => { const n = Math.hypot(...v), x = v[0] / n, y = v[1] / n, z = v[2] / n; const xr = x * cr + z * sr, zr = -x * sr + z * cr; const yr = y * ct - zr * st, zz = y * st + zr * ct; return [xr, yr, zz, i]; });
        balls.push([0, 0, 0, -1]);
        balls.sort((a, b) => a[2] - b[2]);
        for (const [x, y, z, i] of balls) {
          const kk = i < 0 ? 1 : ease.outBack(clamp((lt - .6 - i * .04) / .3));
          if (kk <= 0) continue;
          pzBall(g, c3[0] + x * 2 * r3 * kk, c3[1] + y * 2 * r3 * kk, r3 * (1 + z * .08), i < 0 ? PAL.clay : mix(PAL.sky, PAL.teal, .2 - z * .2), { alpha: k3 });
        }
        pzLabel(g, '3-D', c3[0], 290, 40, { fam: 'display', weight: 700, alpha: k3 });
        pzLabel(g, '12', c3[0], 800, 64, { fam: 'display', weight: 800, alpha: k3 });
      }
      // 11-D: 593 unit vectors in R^11, slowly rotating in several planes, projected to the page
      const c11 = [1250, 555], R11 = 170;
      const vecs = (pzResultKissing._v || (pzResultKissing._v = (() => { const r = rng('kiss11'), o = []; for (let i = 0; i < 593; i++) { const v = []; for (let d = 0; d < 11; d++) v.push(r.gauss()); const n = Math.hypot(...v); o.push(v.map(a => a / n)); } return o; })()));
      const k11 = clamp((lt - 1.0) / 1.1);
      if (k11 > 0) {
        const nShow = Math.floor(593 * ease.outQ(k11));
        const planes = [[0, 2, .5], [1, 3, .37], [0, 4, .23], [1, 5, .3], [2, 6, .2]];
        const P = [];
        for (let i = 0; i < nShow; i++) {
          const v = vecs[i].slice();
          for (const [a, b, w] of planes) { const an = lt * w, c = Math.cos(an), s = Math.sin(an), va = v[a], vb = v[b]; v[a] = va * c - vb * s; v[b] = va * s + vb * c; }
          P.push([v[0], v[1], v[2]]);
        }
        P.push([0, 0, 0, 1]);
        P.sort((a, b) => a[2] - b[2]);
        for (const [x, y, z, ctr] of P) {
          if (ctr) { pzBall(g, c11[0], c11[1], 40, PAL.clay); continue; }
          const px = c11[0] + x * R11 * 1.7, py = c11[1] + y * R11 * 1.7;
          pzBall(g, px, py, 7 + z * 5, mix(PAL.sky, PAL.teal, .3 + z * .4), { lw: 1, alpha: .55 + z * .35 });
        }
        g.save(); g.globalAlpha *= .9;
        pzLabel(g, '11-D', c11[0], 290, 40, { fam: 'display', weight: 700 });
        g.restore();
        const cnt = nShow < 593 ? String(nShow) : null;
        if (cnt) pzLabel(g, cnt, 1650, 525, 80, { fam: 'display', weight: 800, color: PZ.inkSoft });
        else pzMath(g, '≥593', 1650, 525, 96, { align: 'center', weight: 700 });
      }
      if (lt > 2.1) { pzLabel(g, '592', 1650, 400, 54, { fam: 'display', weight: 700, color: PZ.inkSoft }); pzMemoCross(g, lt, { x: 1650, y: 382, size: 96, t0: 2.15, width: 6 }); }
      pzHedgeTag(g, lt, { x: 1650, y: 640, text: 'LOWER BOUND', size: 44, at: 2.0, seed: 'kiss' });
    },
  });
}

// ---- 4. Erdős unit distances (May 2026): disproved; exponent > 1, true exponent unknown -------------
function pzResultErdos(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'erdos', num: 96, title: 'Unit Distances', sparks: 200,
    caption: 'Erdős’s unit-distance conjecture (1946) — disproved in 2026: the exponent is more than 1',
    sub: 'checked by nine mathematicians · the true exponent is still unknown',
    stamp: { x: 1640, y: 830, kind: 'qed', rot: -.15 },
    draw(g, lt) {
      // a patch of the triangular lattice: every drawn edge has length exactly 1
      const cx = 470, cy = 545, u = 98, P = [];
      for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) { if (Math.abs(q + r) > 2) continue; P.push([cx + u * (q + r / 2), cy + u * r * Math.sqrt(3) / 2]); }
      const E = []; for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) if (Math.abs(Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]) - u) < 1) E.push([i, j]);
      const order = E.map((e, i) => [e, rng('pze' + i)()]).sort((a, b) => a[1] - b[1]).map(a => a[0]);
      const ek = clamp((lt - .6) / 1.1), nE = Math.floor(order.length * ease.inOutQ(ek));
      order.forEach(([i, j], k) => { const kk = clamp((lt - .6 - k / order.length * 1.1) / .18); if (kk > 0) pzStrokeOn(g, [P[i], P[j]], kk, { width: 3.4, color: PAL.teal, seed: 'pze' + k, boil: pzBoil(lt), wobble: .5 }); });
      P.forEach((p, i) => { const k = ease.outBack(clamp((lt - .2 - i * .02) / .25)); if (k > 0) pzBall(g, p[0], p[1], 13 * k, PAL.clay); });
      if (lt > .8) {
        pzLabel(g, `${P.length} points`, cx, 290, 38, { fam: 'display', weight: 700 });
        pzLabel(g, `${nE} unit distances`, cx, 880, 38, { fam: 'display', weight: 700, color: nE === E.length ? PZ.ink : PZ.inkSoft });
      }
      // ruler showing 1
      if (lt > 1.2) { const a = [cx - u, cy + u * Math.sqrt(3)], b = [cx, cy + u * Math.sqrt(3)], yy = a[1] + 40; inkPath(g, [[a[0], yy], [b[0], yy]], { width: 2.4, seed: 'pzru' }); inkPath(g, [[a[0], yy - 9], [a[0], yy + 9]], { width: 2.4, seed: 'pzru1' }); inkPath(g, [[b[0], yy - 9], [b[0], yy + 9]], { width: 2.4, seed: 'pzru2' }); pzMath(g, '1', (a[0] + b[0]) / 2, yy + 36, 34, { align: 'center' }); }
      // exponent number line
      const X = e => 920 + (e - 1) / (4 / 3 - 1) * 700, ly = 590;
      const lk = clamp((lt - .4) / .6);
      if (lk > 0) {
        g.save(); g.globalAlpha *= lk;
        pzMath(g, 'u(n) ≈ n^{?}', 1270, 330, 64, { align: 'center' });
        pzLabel(g, 'the most unit distances among n points', 1270, 380, 30, { style: 'italic', color: PZ.inkSoft });
        inkPath(g, [[880, ly], [1700, ly]], { width: 3.4, seed: 'pzax', taper: false });
        for (const [e, s] of [[1, '1'], [4 / 3, '4/3']]) { inkPath(g, [[X(e), ly - 16], [X(e), ly + 16]], { width: 3.4, seed: 'pzt' + s }); pzMath(g, s, X(e), ly + 58, 40, { align: 'center' }); }
        g.restore();
      }
      // what Erdős believed: exponent 1 (+ o(1)) — crossed out
      if (lt > .8) { pzLabel(g, 'Erdős believed:', X(1) - 10, 436, 30, { style: 'italic', color: PZ.inkSoft, align: 'left' }); pzMath(g, '1 + o(1)', X(1), 486, 40, { align: 'left' }); }
      pzMemoUnderline(g, lt, { x: X(1) - 14, y: 474, w: 160, t0: 1.6, dur: .2, color: PZ.red, width: 6, seed: 'strike' });
      pzMemoText(g, lt, { text: 'disproved!', x: X(1) + 170, y: 488, size: 44, t0: 1.7, color: PZ.red });
      // proved: > 1 (shaded zone, unknown where exactly) ; upper bound 4/3 (1984)
      const zk = clamp((lt - 1.8) / .45);
      if (zk > 0) {
        g.save(); g.globalAlpha *= .3 * zk; g.fillStyle = PAL.clay; g.fillRect(X(1.014), ly - 26, (X(4 / 3) - X(1.014)) * ease.outC(zk), 52); g.restore();
        pzLabel(g, 'the true exponent is somewhere in here', X(1.19), ly - 44, 32, { fam: 'hand', weight: 600, color: PAL.clayDeep, alpha: zk });
      }
      pzMemoArrow(g, lt, { from: [X(1) + 20, 680], to: [X(1) + 90, ly + 24], t0: 1.9, dur: .3, color: PAL.clayDeep, seed: 'gt1', bend: -.2 });
      if (lt > 1.95) pzMath(g, '> 1 (2026)', X(1) + 4, 736, 56, { align: 'left', color: PAL.clayDeep, weight: 700 });
      if (lt > 1.0) pzLabel(g, 'upper bound (1984)', X(4 / 3), ly + 98, 28, { style: 'italic', color: PZ.inkSoft });
    },
  });
}

// ---- 5. the Jacobian counterexample (Jul 2026): the real map, det J = −2, three points → one ---------
const PZ_JAC_LINES = [
  'F(x, y, z) = ( (1 + xy)^3z + y^2(1 + xy)(4 + 3xy),',
  'y + 3x(1 + xy)^2z + 3xy^2(4 + 3xy),',
  '2x − 3x^2y − x^3z )',
];
function pzIso(o, s) { // isometric-ish projection for the little 3-D boxes
  const [ox, oy] = o, [sx, sy, sz] = s;
  return ([x, y, z]) => [ox + x * sx * .87 - y * sy * .87, oy + x * sx * .5 + y * sy * .5 - z * sz];
}
function pzResultJacobian(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'jac', num: 120, title: 'Three Points, One Door', sparks: 300,
    caption: 'The Jacobian conjecture (1939) is false for n ≥ 3',
    sub: 'its Jacobian determinant is −2 at every point, yet three points land on one · the plane, n = 2, is still open',
    stamp: { x: 1650, y: 820, kind: 'qed', rot: -.13 },
    draw(g, lt) {
      // the map, typed onto an index card
      const fx = 180, fy = 300, fs = 44;
      const ik = clamp(lt / .3);
      if (ik > 0) {
        const card = deform(polyRect(150, 228, 1260, 238), rng('pzjc'), 2, .004);
        g.save(); g.globalAlpha *= ik; g.translate(4, 6); g.globalAlpha *= .2; g.fillStyle = PAL.umber; tracePoly(g, card); g.fill(); g.restore();
        g.save(); g.globalAlpha *= ik; paintFill(g, gg => tracePoly(gg, card), '#fffaf0', { tex: .1 }); inkPoly(g, card, { width: 2, seed: 'pzjco', boil: pzBoil(lt), wobble: .4, color: PZ.inkSoft }); g.restore();
      }
      const lead = pzMath(g, 'F(x, y, z) = ( ', 0, 0, fs, { measure: true, opSpace: .15 });
      PZ_JAC_LINES.forEach((ln, i) => {
        const k = clamp((lt - .25 - i * .3) / .35); if (k <= 0) return;
        const x = i === 0 ? fx : fx + lead, y = fy + i * 66;
        g.save(); const w = pzMath(g, ln, x, y, fs, { measure: true, opSpace: .15 }); g.beginPath(); g.rect(x - 10, y - 60, (w + 20) * k, 90); g.clip(); pzMath(g, ln, x, y, fs, { opSpace: .15 }); g.restore();
      });
      // det J = −2
      const dk = ease.outBack(clamp((lt - 1.15) / .35));
      if (dk > 0) {
        g.save(); g.translate(1610, 340); g.rotate(-.04); g.scale(dk, dk);
        pzMath(g, '`det`  J = −2', 0, 18, 64, { align: 'center', weight: 600, color: PAL.clayDeep });
        g.restore();
        pzMemoBox(g, lt, { x: 1440, y: 268, w: 345, h: 110, t0: 1.3, color: PAL.clayDeep, seed: 'det' });
        pzMemoText(g, lt, { text: 'everywhere!', x: 1540, y: 430, size: 44, t0: 1.45, color: PAL.clayDeep });
      }
      pzHedgeTag(g, lt, { x: 1625, y: 575, text: 'n ≥ 3', math: true, sub: 'n = 2: still open', size: 84, subSize: 34, at: 1.9, seed: 'jac' });
      // domain and target boxes
      const D = pzIso([520, 745], [70, 42, 27]), T = pzIso([1250, 725], [70, 42, 27]);
      const axes = (Pj, at, seed, lbl) => {
        const k = clamp((lt - at) / .4); if (k <= 0) return;
        const O = Pj([0, 0, 0]);
        [[[2, 0, 0], 'x'], [[0, 2.6, 0], 'y'], [[0, 0, 7.5], 'z']].forEach(([v, n], i) => {
          const neg = Pj(v.map(a => -a * .45));
          const E = Pj(v);
          pzStrokeOn(g, [neg, E], k, { width: 2.2, color: PZ.inkSoft, seed: seed + n, wobble: .4 });
          if (k >= 1 && i === 2) pzMath(g, n, E[0], E[1] - 10, 30, { align: 'center', color: PZ.inkSoft });
        });
        if (k >= 1 && lbl) pzLabel(g, lbl, O[0], O[1] + 128, 30, { style: 'italic', color: PZ.inkSoft });
      };
      axes(D, .9, 'pzjd', 'three starting points');
      axes(T, 1.0, 'pzjt', 'one landing point');
      const src = [[[0, 0, -.25], '(0, 0, −¼)', [-24, 52, 'right']], [[1, -1.5, 6.5], '(1, −3/2, 13/2)', [22, -18, 'left']], [[-1, 1.5, 6.5], '(−1, 3/2, 13/2)', [-22, -18, 'right']]];
      const dst = T([-.25, 0, 0]);
      src.forEach(([p, lab, off], i) => {
        const at = 1.35 + i * .22, q = D(p);
        if (lt < at) return;
        // a dashed drop line to the floor for depth
        const fl = D([p[0], p[1], 0]); g.save(); g.setLineDash([6, 7]); g.strokeStyle = rgba(PZ.inkSoft, .6); g.lineWidth = 1.6; g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(fl[0], fl[1]); g.stroke(); g.restore();
        pzBall(g, q[0], q[1], 12, [PAL.teal, PAL.clay, PZ.gold][i]);
        pzMath(g, lab, q[0] + off[0], q[1] + off[1], 30, { align: off[2] });
        pzMemoArrow(g, lt, { from: [q[0] + 16, q[1]], to: [dst[0] - 14, dst[1] - 4], bend: [-.12, -.2, .12][i], t0: at + .1, dur: .4, color: [PAL.teal, PAL.clayDeep, PZ.goldDeep][i], seed: 'jac' + i, width: 4.5 });
      });
      if (lt > 1.45) {
        const hits = [0, 1, 2].filter(i => lt > 1.35 + i * .22 + .5).length;
        pzBall(g, dst[0], dst[1], 14 + hits * 2, PAL.berry);
        for (let i = 0; i < hits; i++) { const k = clamp((lt - (1.35 + i * .22 + .5)) / .4); if (k < 1) { g.save(); g.globalAlpha = 1 - k; g.strokeStyle = PAL.berry; g.lineWidth = 3; g.beginPath(); g.arc(dst[0], dst[1], 16 + k * 50, 0, 7); g.stroke(); g.restore(); } }
        pzMath(g, '(−¼, 0, 0)', dst[0] + 26, dst[1] + 46, 32, { align: 'left', weight: 600 });
        if (hits === 3) pzMemoText(g, lt, { text: '3 → 1', x: dst[0] + 60, y: dst[1] - 40, size: 50, t0: 2.25, color: PAL.berry });
      }
      if (lt > 1.6) pzMath(g, 'F', 900, 540, 54, { align: 'center', color: PAL.clayDeep, weight: 600 });
    },
  });
}

// ---- 6. Navier–Stokes WITH forcing (Sep 2026): a swirl pinches to a point; Q.E.D.? under review ------------
function pzResultNavierStokes(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'ns', num: 141, title: 'The Swirl, Pushed', sparks: 500,
    caption: 'A fluid that starts at rest, pushed just right, blows up at t = 1',
    sub: 'Navier–Stokes with a smooth force — not yet refereed; the unforced case is still open',
    captionAt: 1.7,
    stamp: { x: 1290, y: 800, kind: 'contested', rot: -.12, note: ['under review.', 'f = 0: still open'], noteX: 1470, noteY: 690 },
    draw(g, lt) {
      const cx = 640, cy = 580, R = 280;
      const tau = clamp(lt / 2.2) * .995;               // physical time 0 -> 1
      const shrink = Math.pow(1 - tau, .55);
      pzBlob(g, 'nswater', cx, cy, R * 1.05, R * .92, PAL.sky, { alpha: .05, layers: 30, spread: .16 });
      pzBlob(g, 'nswater2', cx, cy, R * .62, R * .52, PAL.teal, { alpha: .03, layers: 20, spread: .2, edge: false });
      // streamlines: log spirals, rotating faster and pinching towards the core as t -> 1
      const phi = -2.6 * Math.log(1 - tau) + lt * .8;
      const bf = pzBoil(lt);
      for (let k = 0; k < 7; k++) {
        const pts = [], a0 = k / 7 * Math.PI * 2 + phi;
        for (let i = 0; i <= 70; i++) {
          const s = i / 70, rr = R * .95 * Math.pow(1 - s, 1 + 4.5 * tau) * lerp(1, .8, tau) + 2, a = a0 + s * (4 + 16 * tau);
          pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .82]);
        }
        inkPath(g, pts, { width: 3.2 - k * .1, color: mix(PAL.teal, PZ.blue, k / 7), seed: 'pzns' + k, boil: bf, wobble: .6, alpha: .85 });
      }
      // the hot core
      const core = 10 + 40 * tau * tau;
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, core * 2.2);
      gr.addColorStop(0, rgba('#fff2d0', .95)); gr.addColorStop(.4, rgba(PAL.clay, .7 * tau)); gr.addColorStop(1, rgba(PAL.clay, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, core * 2.2, 0, 7); g.fill();
      if (lt > 2.2) { // the moment it breaks
        const k = clamp((lt - 2.2) / .5);
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, d0 = 30 + k * 150; inkPath(g, [[cx + Math.cos(a) * d0, cy + Math.sin(a) * d0 * .82], [cx + Math.cos(a) * (d0 + 40 * (1 - k)), cy + Math.sin(a) * (d0 + 40 * (1 - k)) * .82]], { width: 4, color: PAL.clayDeep, seed: 'pznb' + i, alpha: 1 - k }); }
        pzSpark(g, cx, cy, 26 + 10 * Math.sin(lt * 9), { fill: '#fff6dc', t: lt, line: PAL.clayDeep });
      }
      // the force: little pushes around the swirl, pulsing
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + .6, pul = .5 + .5 * Math.sin(lt * 9 + i * 1.7), r0 = R * 1.18, k = clamp((lt - .3 - i * .1) / .3);
        if (k <= 0) continue;
        const px = cx + Math.cos(a) * r0, py = cy + Math.sin(a) * r0 * .82, tx = -Math.sin(a), ty = Math.cos(a) * .82;
        g.save(); g.globalAlpha *= k;
        pzMemoArrow(g, 9, { from: [px - tx * 40 * (1 + pul * .3), py - ty * 40 * (1 + pul * .3)], to: [px + tx * 34, py + ty * 34], t0: 0, dur: .1, color: PAL.clayDeep, seed: 'nsf' + i, width: 5, head: 16, bend: .1 });
        pzMath(g, 'f', px + Math.cos(a) * 34, py + Math.sin(a) * 30 + 12, 36, { align: 'center', color: PAL.clayDeep, weight: 600 });
        g.restore();
      }
      // the luggage tag: "with forcing, f ≠ 0"
      const tk = ease.outBack(clamp((lt - .7) / .4));
      if (tk > 0) {
        const tx = 1010, ty = 300, sw = Math.sin(lt * 2.3) * .05;
        inkPath(g, bez([cx + R * .62, cy - R * .55], [cx + R * .9, cy - R * 1.0], [tx - 120, ty + 40], [tx - 70, ty + 30], 16), { width: 2, color: PZ.inkSoft, seed: 'pztag', taper: false });
        g.save(); g.translate(tx, ty); g.rotate(-.08 + sw); g.scale(tk, tk);
        const tag = [[-80, -64], [330, -64], [330, 64], [-80, 64], [-118, 0]];
        paintFill(g, gg => tracePoly(gg, tag), '#f6ead0', { tex: .2 }); inkPoly(g, tag, { width: 2.4, seed: 'pztago', boil: pzBoil(lt), wobble: .4 });
        g.fillStyle = '#e7d6b4'; g.beginPath(); g.arc(-80, 0, 9, 0, 7); g.fill(); g.strokeStyle = PZ.ink; g.lineWidth = 2; g.stroke();
        pzLabel(g, 'with forcing', 125, -10, 56, { fam: 'display', weight: 800 });
        pzMath(g, 'f ≠ 0', 125, 50, 64, { align: 'center', weight: 700, color: PAL.clayDeep });
        g.restore();
      }
      // clock t → 1 and a speed gauge → ∞
      const gx = 1290, gy = 470;
      if (lt > .4) {
        inkPoly(g, polyCircle(gx, gy, 80, 80, 36), { width: 3, seed: 'pzclk', boil: pzBoil(lt), wobble: .4 });
        g.save(); g.fillStyle = rgba(PAL.clay, .35); g.beginPath(); g.moveTo(gx, gy); g.arc(gx, gy, 74, -Math.PI / 2, -Math.PI / 2 + tau * Math.PI * 2); g.closePath(); g.fill(); g.restore();
        inkPath(g, [[gx, gy], [gx + Math.cos(-Math.PI / 2 + tau * Math.PI * 2) * 66, gy + Math.sin(-Math.PI / 2 + tau * Math.PI * 2) * 66]], { width: 4, seed: 'pzclh' });
        pzMath(g, 't = ' + tau.toFixed(2), gx, gy + 130, 38, { align: 'center' });
        const sx = 1560, sy = 520;
        inkPath(g, polyCircle(sx, sy, 110, 110, 40).slice(20, 41), { width: 3, seed: 'pzsg', taper: false });
        for (let i = 0; i <= 6; i++) { const a = Math.PI + i / 6 * Math.PI; inkPath(g, [[sx + Math.cos(a) * 96, sy + Math.sin(a) * 96], [sx + Math.cos(a) * 110, sy + Math.sin(a) * 110]], { width: 2.4, seed: 'pzsgt' + i }); }
        const sp = 1 - Math.pow(1 - tau, .35), na = Math.PI + sp * Math.PI + (tau > .97 ? Math.sin(lt * 40) * .03 : 0);
        inkPath(g, [[sx, sy], [sx + Math.cos(na) * 92, sy + Math.sin(na) * 92]], { width: 5, color: PAL.berry, seed: 'pzsgn' });
        g.fillStyle = PZ.ink; g.beginPath(); g.arc(sx, sy, 8, 0, 7); g.fill();
        pzLabel(g, '0', sx - 132, sy + 10, 30, { color: PZ.inkSoft });
        pzMath(g, '∞', sx + 134, sy + 10, 40, { align: 'center', color: PAL.berry });
        pzLabel(g, 'top speed', sx, sy + 60, 32, { style: 'italic', color: PZ.inkSoft });
      }
    },
  });
}

// ---- 7. zeros on the critical line (Aug 2026): at least two-thirds proved; RH needs all of them -----------
// The first twenty nontrivial zeros of ζ (imaginary parts; all lie on Re s = ½ numerically).
const PZ_ZETA_ZEROS = [14.1347, 21.0220, 25.0109, 30.4249, 32.9351, 37.5862, 40.9187, 43.3271, 48.0052, 49.7738, 52.9703, 56.4462, 59.3470, 60.8318, 65.1125, 67.0798, 69.5464, 72.0672, 75.7047, 77.1448];
function pzZetaBar(g, lt, x, y, w, h, opts = {}) {
  // progress bar "proved on the critical line": 1/3 (1974), 2/5 (1989), 5/12 (2020), 2/3 (2026); the rest locked
  const { at = .6, leapAt = 1.6, labels = true, locked = true, fillTo = null } = opts;
  const marks = [[1 / 3, '1/3', '1974'], [2 / 5, '2/5', '1989'], [5 / 12, '5/12', '2020'], [2 / 3, '2/3', '2026']];
  const box = deform(polyRect(x, y, w, h), rng('pzzb'), 1, .004);
  paintFill(g, gg => tracePoly(gg, box), '#f3ead2', { tex: .15 });
  // fill: quick historical steps, then the 2026 leap on the beat
  let f = 0;
  if (fillTo !== null) f = fillTo;
  else {
    const hk = clamp((lt - at) / .7);
    f = hk <= 0 ? 0 : hk < .4 ? lerp(0, 1 / 3, hk / .4) : hk < .7 ? lerp(1 / 3, 2 / 5, (hk - .4) / .3) : lerp(2 / 5, 5 / 12, (hk - .7) / .3);
    if (lt > leapAt) f = lerp(5 / 12, 2 / 3, ease.outBack(clamp((lt - leapAt) / .35)));
  }
  g.save(); tracePoly(g, box); g.clip();
  wash(g, polyRect(x - 10, y - 10, (w + 20) * f + 10, h + 20), PAL.clay, { seed: 'pzzf', layers: 8, alpha: .2, spread: .01, depth: 3, edge: false });
  if (locked) { // hatch the last third
    g.beginPath(); g.rect(x + w * 2 / 3, y, w / 3 + 2, h); g.clip();
    g.strokeStyle = rgba(PZ.inkSoft, .45); g.lineWidth = 2;
    for (let xx = x + w * 2 / 3; xx < x + w + h; xx += 14) { g.beginPath(); g.moveTo(xx, y + h); g.lineTo(xx - h, y); g.stroke(); }
  }
  g.restore();
  inkPoly(g, box, { width: 3, seed: 'pzzbo', boil: pzBoil(lt), wobble: .5 });
  if (labels) marks.forEach(([v, s, yr], i) => {
    const mx = x + w * v, shown = f >= v - .002;
    inkPath(g, [[mx, y - 8], [mx, y + h + 8]], { width: 2, seed: 'pzzm' + i, alpha: shown ? 1 : .35 });
    const up = i % 2 === 0, al = i === 0 ? 'right' : i === 2 ? 'left' : 'center', dx = i === 0 ? 6 : i === 2 ? -6 : 0;
    pzMath(g, s, mx + dx, up ? y - 22 : y + h + 44, 32, { align: al, color: shown ? PZ.ink : PZ.inkSoft, weight: i === 3 ? 700 : 500 });
    pzLabel(g, yr, mx + dx, up ? y - 58 : y + h + 78, 24, { style: 'italic', color: PZ.inkSoft, align: al });
  });
  return f;
}
function pzResultZeros(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'zeros', num: 163, title: 'Two-Thirds on the Line', sparks: 800,
    caption: 'At least two-thirds of the zeta zeros lie on the critical line',
    sub: 'a preprint, not yet refereed — and the Riemann hypothesis needs all of them',
    stamp: { x: 990, y: 822, kind: 'contested', rot: -.1, note: ['preprint.', 'Lean check claimed'], noteX: 1478, noteY: 756, noteScale: .78 },
    draw(g, lt) {
      // the critical strip 0 < Re(s) < 1, the line Re(s) = ½, and the zeros as dots
      const x0 = 300, x1 = 620, xm = (x0 + x1) / 2, yb = 860, yt = 305, sc = (yb - yt - 40) / 80;
      const sk = clamp(lt / .4);
      if (sk > 0) {
        g.save(); g.globalAlpha *= sk;
        g.drawImage(cached('pzzstrip', x1 - x0 + 40, yb - yt + 40, gg => wash(gg, polyRect(20, 20, x1 - x0, yb - yt), PAL.sky, { seed: 'pzzs', layers: 24, alpha: .035, spread: .02, edge: true })), x0 - 20, yt - 20);
        inkPath(g, [[x0, yb + 10], [x0, yt]], { width: 2.4, seed: 'pzz0', taper: false, color: PZ.inkSoft });
        inkPath(g, [[x1, yb + 10], [x1, yt]], { width: 2.4, seed: 'pzz1', taper: false, color: PZ.inkSoft });
        inkPath(g, [[x0 - 70, yb], [x1 + 70, yb]], { width: 2.4, seed: 'pzzr', taper: false });
        g.save(); g.setLineDash([14, 10]); g.strokeStyle = PAL.clayDeep; g.lineWidth = 3.5; g.beginPath(); g.moveTo(xm, yb); g.lineTo(xm, yt - 10); g.stroke(); g.restore();
        pzMath(g, '0', x0, yb + 42, 32, { align: 'center' }); pzMath(g, '½', xm, yb + 42, 34, { align: 'center', color: PAL.clayDeep }); pzMath(g, '1', x1, yb + 42, 32, { align: 'center' });
        pzMath(g, '`Re`(s) = ½', xm, yt - 24, 34, { align: 'center', color: PAL.clayDeep });
        g.restore();
      }
      PZ_ZETA_ZEROS.forEach((im, i) => {
        const k = ease.outBack(clamp((lt - .3 - i * .05) / .25)); if (k <= 0) return;
        const y = yb - im * sc;
        pzBall(g, xm, y, 9 * k, PAL.berry);
        if (i < 3 && lt > .6) pzMath(g, '½ + ' + im.toFixed(2) + 'i', xm + 20, y + 9, 24, { align: 'left', color: PZ.inkSoft, opSpace: .1 });
      });
      pzMemoText(g, lt, { text: 'ζ(s) = 0', x: x1 + 50, y: 440, size: 50, t0: .9, color: PZ.memo });
      pzMemoArrow(g, lt, { from: [x1 + 60, 460], to: [xm + 22, 560], t0: 1.05, dur: .3, seed: 'z', color: PZ.memo });
      // the progress bar
      const bx = 900, by = 610, bw = 780, bh = 70;
      if (lt > .5) {
        pzLabel(g, 'proved to lie on the line:', bx, 330, 36, { align: 'left', style: 'italic', weight: 600 });
        if (lt > 1.6) pzMath(g, '≥ 2/3', bx, 470, 112, { align: 'left', weight: 700, color: PAL.clayDeep });
        pzHedgeTag(g, lt, { x: 1555, y: 440, text: 'PREPRINT', size: 54, color: '#5d3550', at: 1.8, rot: .03, seed: 'zeros' });
        const f = pzZetaBar(g, lt, bx, by, bw, bh, { at: .6, leapAt: 1.6 });
        if (lt > 1.6) pzMath(g, '≥ 2/3', bx + bw * f - 16, by + bh / 2 + 16, 44, { align: 'right', weight: 700, color: PZ.card });
        if (lt > 1.8) { pzPadlock(g, bx + bw - 60, by + bh / 2 - 6, .5, { t: lt, label: '' }); }
        if (lt > 2.0) { pzLabel(g, '100% = the Riemann hypothesis:', bx + bw, by - 62, 28, { align: 'right', style: 'italic', color: PZ.inkSoft }); pzLabel(g, 'NOT YET', bx + bw, by - 22, 30, { align: 'right', fam: 'display', weight: 800, color: '#5d3550' }); }
      }
    },
  });
}

// ---- 8. Fermat's Last Theorem in Lean (Sep 2026): a known proof, machine-checked -------------------------
// The statement, verbatim from Mathlib (Mathlib/NumberTheory/FLT/Basic.lean, checked Oct 2026), only re-wrapped to fit.
// [text, kind]: 'c' comment, 'k' line starting with a keyword. The proof itself is never shown as readable text.
const PZ_LEAN_SRC = [
  ['-- Mathlib/NumberTheory/FLT/Basic.lean', 'c'],
  ['def FermatLastTheoremWith (R : Type*) [Semiring R]', 'k'],
  ['    (n : ℕ) : Prop :=', ''],
  ['  ∀ a b c : R, a ≠ 0 → b ≠ 0 → c ≠ 0 →', ''],
  ['    a ^ n + b ^ n ≠ c ^ n', ''],
  ['def FermatLastTheoremFor (n : ℕ) : Prop :=', 'k'],
  ['  FermatLastTheoremWith ℕ n', ''],
  ['def FermatLastTheorem : Prop :=', 'k'],
  ['  ∀ n ≥ 3, FermatLastTheoremFor n', ''],
  ['', ''],
  ['theorem flt : FermatLastTheorem := by', 'k'],
];
function pzResultFLT(g, t, opts = {}) {
  return pzScreen(g, t, opts, {
    id: 'flt', num: 187, title: 'Fermat, Checked', sparks: 1000,
    caption: 'Fermat’s Last Theorem: the known proof, checked line by line in Lean',
    sub: 'no new mathematics — the proof by Wiles (with Taylor, 1994–95), now machine-checked',
    stamp: { x: 1660, y: 830, kind: 'qed', rot: -.13 },
    draw(g, lt) {
      // Fermat's margin: an old printed page with the famous note
      const pk = clamp(lt / .35);
      if (pk > 0) {
        g.save(); g.globalAlpha *= pk; g.translate(450, 570); g.rotate(-.035);
        const page = cached('pzfltpage', 600, 620, gg => {
          const pg = deform(polyRect(10, 10, 580, 600), rng('pzfp'), 2, .006);
          paintFill(gg, g2 => tracePoly(g2, pg), PZ.cardOld, { tex: .32 });
          gg.save(); tracePoly(gg, pg); gg.clip(); gg.strokeStyle = 'rgba(140,95,40,.2)'; gg.lineWidth = 26; tracePoly(gg, pg); gg.stroke(); gg.restore();
          inkPoly(gg, pg, { width: 2, seed: 'pzfpo', wobble: .4, color: PZ.inkSoft });
          gg.font = pzFont(22, 'fell', 400); gg.fillStyle = 'rgba(59,42,30,.75)'; gg.textAlign = 'left';
          gg.fillText('ARITHMETICORVM LIB. II.', 60, 62);
          const r = rng('pzfl');
          for (let i = 0; i < 13; i++) { let x = 60; const y = 100 + i * 30; while (x < 380) { const w = r.range(20, 70); gg.fillStyle = 'rgba(59,42,30,.38)'; gg.fillRect(x, y, w, 6); x += w + r.range(8, 14); } }
          gg.font = pzFont(25, 'fell', 400, 'italic'); gg.fillStyle = 'rgba(70,40,25,.9)';
          const note = ['Cuius rei', 'demonstrationem', 'mirabilem sane', 'detexi. Hanc', 'marginis exiguitas', 'non caperet.'];
          note.forEach((s, i) => { gg.save(); gg.translate(410, 120 + i * 34); gg.rotate(-.05); gg.fillText(s, 0, 0); gg.restore(); });
          gg.font = pzFont(19, 'fell', 400, 'italic'); gg.fillStyle = 'rgba(70,40,25,.7)'; gg.fillText('— P. de Fermat', 420, 345);
        });
        g.drawImage(page, -300, -310);
        g.restore();
        pzMath(g, 'a^n + b^n = c^n', 450, 820, 58, { align: 'center' });
        if (lt > .7) pzLabel(g, 'no whole-number solutions when n > 2', 450, 862, 28, { style: 'italic', color: PZ.inkSoft });
      }
      pzMemoText(g, lt, { text: '“the margin', x: 560, y: 668, size: 34, t0: .5, rot: -.07, color: PZ.memo }); pzMemoText(g, lt, { text: 'is too small!”', x: 566, y: 704, size: 34, t0: .8, rot: -.07, color: PZ.memo });
      // the Lean file: the real Mathlib statement types in, then the proof scrolls past as an unreadable texture
      const ex = 860, ey = 240, ew = 920, eh = 580;
      const ek = clamp((lt - .3) / .3);
      if (ek <= 0) return;
      g.save(); g.globalAlpha *= ek;
      const ed = deform(polyRect(ex, ey, ew, eh), rng('pzed'), 1, .003);
      g.save(); g.translate(5, 8); g.globalAlpha *= .22; g.fillStyle = PAL.umber; tracePoly(g, ed); g.fill(); g.restore();
      paintFill(g, gg => tracePoly(gg, ed), '#f4f1e4', { tex: .1 });
      g.save(); tracePoly(g, ed); g.clip();
      g.fillStyle = rgba(PAL.teal, .12); g.fillRect(ex, ey, ew, 46);
      pzLabel(g, 'FLT.lean', ex + 24, ey + 31, 24, { fam: 'mono', align: 'left', color: PZ.inkSoft });
      const fs = 25, lh = 32, top = ey + 62, lx = ex + 30;
      PZ_LEAN_SRC.forEach(([ln, kind], i) => {
        const k = clamp((lt - .35 - i * .07) / .12); if (k <= 0 || !ln) return;
        g.save(); g.globalAlpha *= k; const y = top + 24 + i * lh;
        if (kind === 'c') pzLabel(g, ln, lx, y, fs, { fam: 'mono', align: 'left', color: rgba(PZ.inkSoft, .8) });
        else if (kind === 'k') {
          const kw = ln.split(' ')[0]; g.font = pzFont(fs, 'mono', 500); const kwW = g.measureText(kw + ' ').width;
          pzLabel(g, kw, lx, y, fs, { fam: 'mono', align: 'left', color: PAL.plum });
          let rest = ln.slice(kw.length + 1); const byEnd = rest.endsWith(':= by');
          if (byEnd) rest = rest.slice(0, -2);
          pzLabel(g, rest, lx + kwW, y, fs, { fam: 'mono', align: 'left', color: PZ.ink });
          if (byEnd) { g.font = pzFont(fs, 'mono', 500); pzLabel(g, 'by', lx + kwW + g.measureText(rest).width, y, fs, { fam: 'mono', align: 'left', color: PAL.plum }); }
        } else pzLabel(g, ln, lx, y, fs, { fam: 'mono', align: 'left', color: PZ.ink });
        g.restore();
      });
      // the proof: a fast-scrolling texture of code-shaped marks, too small and blurred to read (on purpose)
      const py0 = top + PZ_LEAN_SRC.length * lh + 12, py1 = ey + eh - 52;
      const ls = Math.min(lt, 2.2), sl = ls < 1.2 ? 0 : Math.pow((ls - 1.2) * 5, 2.4) * 9;
      g.save(); g.beginPath(); g.rect(ex + 20, py0, ew - 40, py1 - py0); g.clip();
      g.filter = lt < 2.2 ? 'blur(1.6px)' : 'blur(1px)';
      const rowH = 9, first = Math.floor(sl / rowH);
      for (let r = 0; r < (py1 - py0) / rowH + 2; r++) {
        const rr = rng('pzlt' + ((first + r) % 4096)), y = py0 + (r - (sl / rowH - first)) * rowH;
        let x = lx + 14 * Math.floor(rr() * 4) + 18;
        const n = 1 + Math.floor(rr() * 6);
        for (let j = 0; j < n && x < ex + ew - 60; j++) { const w = rr.range(12, 90); g.fillStyle = rr() < .2 ? rgba(PAL.plum, .55) : rgba(PZ.ink, .42); g.fillRect(x, y, w, 4); x += w + rr.range(6, 14); }
      }
      g.filter = 'none'; g.restore();
      const fade = g.createLinearGradient(0, py0, 0, py0 + 24); fade.addColorStop(0, '#f4f1e4'); fade.addColorStop(1, 'rgba(244,241,228,0)');
      g.fillStyle = fade; g.fillRect(ex, py0, ew, 24);
      // status bar
      const done = lt > 2.25;
      g.fillStyle = done ? rgba(PAL.leaf, .2) : rgba(PZ.gold, .2); g.fillRect(ex, ey + eh - 50, ew, 50);
      if (done) { pzMemoTick(g, lt, { x: ex + 40, y: ey + eh - 26, size: 30, t0: 2.25, color: PAL.leaf, width: 5, seed: 'lean' }); pzLabel(g, 'no errors · machine-checked', ex + 74, ey + eh - 16, 24, { fam: 'mono', align: 'left', color: '#3d5f30' }); }
      else if (lt > 1.2) pzLabel(g, 'checking the proof… ' + '·'.repeat(1 + Math.floor(lt * 8) % 3), ex + 24, ey + eh - 16, 24, { fam: 'mono', align: 'left', color: PZ.inkSoft });
      g.restore();
      g.restore();
    },
  });
}
// The eight verse-2 screens in lyric order (for sequencing / mosaics).
const PZ_RESULTS = [pzResultIMO, pzResultProtein, pzResultKissing, pzResultErdos, pzResultJacobian, pzResultNavierStokes, pzResultZeros, pzResultFLT];

// ============================================================================================
// 4. bridge: locked future cards (NOT YET), and cards that fly like birds
// ============================================================================================
// pzLockedCard(g, t, { x, y (centre), scale, kind, rot, num, jiggleAt, openAt, t0 (appear), lock: true })
// kinds: 'fever' (cancer) | 'fire' (fusion) | 'storm' (climate) | 'wire' (room-temperature superconductivity)
//        | 'jacobian2' (n = 2) | 'ns0' (Navier–Stokes, f = 0) | 'zeros' (the last third)
const PZ_LOCKED = {
  fever: { title: 'The Fever', sub: 'A CURE FOR CANCER', foot: 'not one disease, but many' },
  fire: { title: 'The Fire', sub: 'FUSION POWER', foot: 'more energy out than in — at the wall plug' },
  storm: { title: 'The Storm', sub: 'THE CLIMATE', foot: 'clean energy, and carbon caught cheaply' },
  wire: { title: 'Room-Temperature Superconductor', sub: 'AT EVERYDAY PRESSURE  ·  “A WARM WIRE”', foot: 'zero resistance — no fridge, no crushing press', big: true },
  jacobian2: { title: 'The Plane Jacobian', sub: 'THE CASE n = 2', foot: 'if det J is a constant, must F be invertible?' },
  ns0: { title: 'The Swirl, Left Alone', sub: 'NAVIER–STOKES, f = 0', foot: 'can a fluid break all on its own?' },
  zeros: { title: 'The Last Third', sub: 'THE RIEMANN HYPOTHESIS', foot: 'are all the zeros on the line?' },
};
function pzLockedDiagram(g, kind, cx, cy) {
  const r = rng('pzld' + kind), ink = (pts, o = {}) => inkPath(g, pts, { width: 3, seed: 'pzld' + kind + pts.length, wobble: .5, ...o });
  if (kind === 'fever') {
    const cols = [PAL.clay, PAL.plum, PAL.sage, PZ.gold, PAL.berry, PAL.teal];
    const cells = []; for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 120; cells.push([cx + Math.cos(a) * d * 1.25, cy + Math.sin(a) * d * .9, r.range(18, 27), r.pick(cols)]); }
    cells.sort((a, b) => a[1] - b[1]);
    for (const [x, y, rad, c] of cells) { pzBall(g, x, y, rad, c, { lw: 2 }); g.fillStyle = rgba('#3b2a1e', .45); g.beginPath(); g.arc(x + rad * .15, y + rad * .1, rad * .3, 0, 7); g.fill(); }
  } else if (kind === 'fire') {
    const D = []; for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + i / 40 * Math.PI; D.push([cx - 40 + Math.cos(a) * 130, cy + Math.sin(a) * 140]); } D.push([cx - 40, cy - 140]);
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i + .5) / 8 * Math.PI, px = cx - 40 + Math.cos(a) * 165, py = cy + Math.sin(a) * 172; g.save(); g.translate(px, py); g.rotate(a); paintFill(g, gg => gg.rect(-12, -18, 24, 36), PZ.brass, { tex: .3 }); g.strokeStyle = PZ.ink; g.lineWidth = 2; g.strokeRect(-12, -18, 24, 36); g.restore(); }
    const gr = g.createRadialGradient(cx + 10, cy, 5, cx + 10, cy, 95);
    gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(.35, 'rgba(240,150,110,.9)'); gr.addColorStop(1, 'rgba(200,90,120,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(cx + 10, cy, 70, 100, 0, 0, 7); g.fill();
    ink(D, { taper: false, width: 4 });
  } else if (kind === 'storm') {
    pzBlob(g, 'pzglobe', cx, cy + 160, 190, 60, PAL.teal, { alpha: .04, spread: .08 });
    for (let k = 0; k < 4; k++) { const p = []; for (let i = 0; i <= 50; i++) { const a = k * Math.PI / 2 + i * .22, rr = 130 * Math.exp(-i * .045); p.push([cx + Math.cos(a) * rr * 1.2, cy - 20 + Math.sin(a) * rr * .55]); } ink(p, { color: '#6a7888', width: 5, alpha: .8 }); }
    for (const [mx, my] of [[cx - 120, cy - 110], [cx + 110, cy - 90], [cx + 30, cy + 70]]) { ink([[mx - 30, my], [mx + 30, my]], { width: 3 }); pzBall(g, mx - 34, my, 12, PAL.berry); pzBall(g, mx, my, 14, '#555555'); pzBall(g, mx + 34, my, 12, PAL.berry); }
    pzMath(g, '`CO`_2', cx + 150, cy - 130, 30, { align: 'center', color: PZ.inkSoft });
  } else if (kind === 'wire') {
    pzThermometer(g, cx, cy);
  } else if (kind === 'jacobian2') {
    g.save(); g.strokeStyle = rgba(PAL.teal, .35); g.lineWidth = 1.5;
    for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(cx + i * 36, cy - 140); g.lineTo(cx + i * 36, cy + 140); g.stroke(); g.beginPath(); g.moveTo(cx - 150, cy + i * 34); g.lineTo(cx + 150, cy + i * 34); g.stroke(); }
    g.restore();
    const a = [cx - 100, cy - 70], b = [cx - 90, cy + 80], c = [cx + 110, cy];
    for (const p of [a, b]) { g.save(); g.setLineDash([8, 8]); g.strokeStyle = PZ.inkSoft; g.lineWidth = 3; g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo((p[0] + c[0]) / 2, (p[1] + c[1]) / 2 - 30, c[0] - 10, c[1]); g.stroke(); g.restore(); }
    pzBall(g, a[0], a[1], 13, PAL.teal); pzBall(g, b[0], b[1], 13, PZ.gold); pzBall(g, c[0], c[1], 15, PAL.berry);
    pzLabel(g, '?', cx + 10, cy + 10, 90, { fam: 'display', weight: 800, color: rgba(PAL.clayDeep, .8) });
    pzMath(g, 'F : ℂ^2 → ℂ^2', cx, cy - 158, 32, { align: 'center' });
  } else if (kind === 'ns0') {
    pzBlob(g, 'pzns0', cx, cy, 150, 125, PAL.sky, { alpha: .06, spread: .12 });
    for (let k = 0; k < 5; k++) { const p = []; for (let i = 0; i <= 60; i++) { const s = i / 60, a = k / 5 * Math.PI * 2 + s * 7, rr = 140 * Math.pow(1 - s, 1.6) + 3; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .82]); } ink(p, { color: mix(PAL.teal, PZ.blue, k / 5), width: 3 }); }
    const tx = cx + 100, ty = cy - 150;
    const tag = [[tx - 60, ty - 30], [tx + 80, ty - 30], [tx + 80, ty + 30], [tx - 60, ty + 30], [tx - 84, ty]];
    paintFill(g, gg => tracePoly(gg, tag), '#f6ead0', { tex: .2 }); inkPoly(g, tag, { width: 2.2, seed: 'pzns0t', wobble: .4 });
    pzMath(g, 'f = 0', tx + 10, ty + 12, 34, { align: 'center', color: PAL.clayDeep, weight: 600 });
  } else if (kind === 'zeros') {
    pzZetaBar(g, 9, cx - 190, cy - 30, 380, 60, { fillTo: 2 / 3, labels: false });
    pzMath(g, '2/3', cx - 190 + 380 * 2 / 3 - 12, cy + 12, 30, { align: 'right', color: PZ.card, weight: 700 });
    pzMath(g, '`Re`(s) = ½', cx, cy - 90, 34, { align: 'center', color: PAL.clayDeep });
    for (let i = 0; i < 9; i++) pzBall(g, cx - 160 + i * 40, cy + 100 + Math.sin(i * 1.7) * 6, 7, PAL.berry);
  }
}
// The honest thermometer for the room-temperature superconductor card (0–300 K): the highest temperatures at which known
// superconductors lose all resistance, from the research doc's F5 / #33 / #35.
function pzThermometer(g, cx, cy) {
  const x = cx - 150, y0 = cy + 222, y1 = cy - 150, Y = K => y0 - (K / 300) * (y0 - y1);
  // tube and bulb
  g.save(); g.fillStyle = '#fbf7ec'; g.beginPath(); g.roundRect(x - 16, y1 - 20, 32, y0 - y1 + 30, 16); g.fill(); g.restore();
  g.fillStyle = rgba(PAL.berry, .85); g.fillRect(x - 8, Y(151), 16, y0 - Y(151) + 6);
  pzBall(g, x, y0 + 24, 28, PAL.berry);
  inkPath(g, [[x - 16, y0 + 4], [x - 16, y1 - 4], [x - 10, y1 - 18], [x + 10, y1 - 18], [x + 16, y1 - 4], [x + 16, y0 + 4]], { width: 3, seed: 'pzthm', wobble: .4, taper: false });
  for (let K = 0; K <= 300; K += 50) { inkPath(g, [[x - 26, Y(K)], [x - 16, Y(K)]], { width: 2, seed: 'pztk' + K }); pzLabel(g, K + ' K', x - 32, Y(K) + 7, 18, { align: 'right', color: PZ.inkSoft }); }
  const mark = (K, label, sub, o = {}) => {
    const yy = Y(K) + (o.dy || 0);
    inkPath(g, [[x + 16, Y(K)], [x + 40, yy]], { width: 1.6, seed: 'pzm' + K, color: o.ghost ? PZ.inkSoft : PZ.ink });
    pzMath(g, label, x + 46, yy + 7, 21, { align: 'left', color: o.color || (o.ghost ? PZ.inkSoft : PZ.ink), weight: o.bold ? 700 : 500 });
    if (sub) pzLabel(g, sub, x + 46, yy + 28, 16, { align: 'left', style: 'italic', color: PZ.inkSoft });
  };
  mark(4.2, '4.2 `K`  `mercury` (1911)', null, { dy: 6 });
  mark(39, '39 `K`  `MgB`_2 (2001)', null, { dy: -6 });
  mark(77, '77 `K`  `liquid nitrogen`', null, { color: PAL.teal });
  mark(133, '133 `K`  `cuprate` (1993)', null, { dy: 16 });
  mark(151, '151 `K`  `the record` (2026)', 'at everyday pressure — metastable', { bold: true, color: PAL.clayDeep, dy: -24 });
  mark(203, '203 `K`  `H`_3`S` (2015)', null, { ghost: true, dy: 8 });
  mark(250, '250 `K`  `LaH`_{10} (2019)', 'hydrides: only at ~1.5–1.7 million atmospheres', { ghost: true, dy: -2 });
  // room temperature: locked
  const yr = Y(293);
  g.save(); g.setLineDash([10, 8]); g.strokeStyle = PAL.clayDeep; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 30, yr); g.lineTo(x + 330, yr); g.stroke(); g.restore();
  pzLabel(g, 'room temperature (293 K)', x + 46, yr - 12, 21, { align: 'left', fam: 'display', weight: 700, color: PAL.clayDeep });
  pzPadlock(g, x + 345, yr - 26, .3, { label: '' });
  // LK-99: a crossed-out ghost above the scale
  pzLabel(g, 'LK-99 (2023), “near 400 K”', x + 46, y1 - 66, 21, { align: 'left', color: rgba(PZ.inkSoft, .75), style: 'italic' });
  inkPath(g, [[x + 40, y1 - 72], [x + 300, y1 - 72]], { width: 3, color: PZ.red, seed: 'pzlk' });
  pzLabel(g, 'debunked — not a superconductor', x + 46, y1 - 42, 17, { align: 'left', color: PZ.red, style: 'italic' });
}
function pzLockedArt(kind, w, h) {
  const spec = PZ_LOCKED[kind] || PZ_LOCKED.fever;
  return cached(`pzlocked:${kind}:${w}x${h}`, w + 40, h + 40, gg => {
    gg.translate(20, 20);
    const card = deform(polyRect(0, 0, w, h), rng('pzlc' + kind), 2, .006);
    gg.save(); gg.translate(7, 10); gg.globalAlpha = .26; gg.fillStyle = PAL.umber; tracePoly(gg, card); gg.fill(); gg.restore();
    paintFill(gg, g2 => tracePoly(g2, card), PZ.cardOld, { tex: .3 });
    gg.save(); tracePoly(gg, card); gg.clip();
    const r = rng('pzlf' + kind);
    for (let i = 0; i < 10; i++) { const x = r() * w, y = r() * h, R = r.range(10, 50), gr = gg.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, 'rgba(150,100,45,.13)'); gr.addColorStop(1, 'rgba(150,100,45,0)'); gg.fillStyle = gr; gg.fillRect(x - R, y - R, 2 * R, 2 * R); }
    gg.strokeStyle = 'rgba(140,95,40,.2)'; gg.lineWidth = 22; tracePoly(gg, card); gg.stroke();
    wash(gg, polyRect(-10, -10, w + 20, 100), PAL.plum, { seed: 'pzlb' + kind, layers: 16, alpha: .11, spread: .02, depth: 3, edge: false });
    gg.restore();
    inkPoly(gg, card, { width: 3, seed: 'pzlco' + kind, wobble: .5 });
    gg.textAlign = 'center'; gg.fillStyle = PZ.card;
    gg.font = pzFont(22, 'display', 700); gg.fillText('P R O B L E M', w / 2, 38);
    gg.font = pzFont(40, 'display', 800); gg.fillText('№ ? ? ?', w / 2, 80);
    // title: one line, or two balanced lines when one would have to shrink below ~40 px (keeps long names big)
    gg.fillStyle = PZ.ink; let ts = 46; gg.font = pzFont(ts, 'body', 600, 'italic');
    let lines = [spec.title];
    if (gg.measureText(spec.title).width > (w - 50) * 1.15 && spec.title.includes(' ')) {
      const words = spec.title.split(' '); let best = null;
      for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(' '), b = words.slice(i).join(' '), m = Math.max(gg.measureText(a).width, gg.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; }
      lines = best[1]; ts = 52;
    }
    gg.font = pzFont(ts, 'body', 600, 'italic');
    const tw0 = Math.max(...lines.map(l => gg.measureText(l).width)); if (tw0 > w - 50) { ts *= (w - 50) / tw0; gg.font = pzFont(ts, 'body', 600, 'italic'); }
    const dy = (lines.length - 1) * ts * 1.02;
    lines.forEach((l, i) => gg.fillText(l, w / 2, 148 + i * ts * 1.02));
    let ss = 18; gg.font = pzFont(ss, 'display', 700); gg.fillStyle = PAL.plum;
    const sw = gg.measureText(spec.sub).width; if (sw > w - 50) { ss *= (w - 50) / sw; gg.font = pzFont(ss, 'display', 700); }
    gg.fillText(spec.sub, w / 2, 180 + dy);
    inkPath(gg, [[w * .2, 196 + dy], [w * .8, 196 + dy]], { width: 1.5, color: PZ.sepia, seed: 'pzlu' + kind });
    pzLockedDiagram(gg, kind, w / 2, 196 + dy + (h - 196 - dy - 90) / 2);
    gg.font = pzFont(21, 'body', 500, 'italic'); gg.fillStyle = PZ.inkSoft; gg.fillText(spec.foot, w / 2, h - 52);
  });
}
function pzLockedCard(g, t, opts = {}) {
  const { x = W / 2, y = H / 2, scale = 1, kind = 'fever', rot = 0, t0 = null, jiggleAt = null, openAt = null, lock = true, seed = kind } = opts;
  const spec = PZ_LOCKED[kind] || PZ_LOCKED.fever;
  const w = spec.big ? 600 : 500, h = spec.big ? 860 : 660;
  let k = 1; if (t0 !== null) { if (t < t0) return; k = ease.outBack(clamp((t - t0) / .5)); }
  const art = pzLockedArt(kind, w, h);
  g.save(); g.translate(x, y); g.rotate(rot + (1 - k) * .2); g.scale(scale * k, scale * k);
  g.drawImage(art, -w / 2 - 20, -h / 2 - 20);
  if (lock) {
    // twine around the card, and the padlock on the knot
    const ty = h * .5 - 22, bf = pzBoil(t);
    const op = openAt !== null ? ease.inOutQ(clamp((t - openAt) / .5)) : 0;
    g.save(); g.globalAlpha *= 1 - op * .7;
    inkPath(g, [[-w / 2 - 6, ty - 6], [-40, ty + 4], [40, ty + 4], [w / 2 + 6, ty - 8]], { width: 7, color: '#a8834f', seed: 'pztw' + seed, boil: bf, wobble: .6, taper: false });
    inkPath(g, [[-w / 2 - 6, ty - 6], [-40, ty + 4], [40, ty + 4], [w / 2 + 6, ty - 8]], { width: 2, color: '#e6cf9f', seed: 'pztw2' + seed, boil: bf, wobble: .6, taper: false, alpha: .8 });
    g.restore();
    let sw = Math.sin(t * 1.3 + hashStr(seed) % 7) * .04;
    if (jiggleAt !== null && t > jiggleAt) sw += Math.exp(-(t - jiggleAt) * 4) * Math.sin((t - jiggleAt) * 26) * .3;
    pzPadlock(g, 0, ty + 52, 1.15, { t, open: op, swing: sw, seed: 'pzlk' + seed });
  }
  g.restore();
}

// ---- cards that fly like birds -------------------------------------------------------------------------
// pzCardBird draws any card image as a flapping bird: the two halves fold around the spine.
// opts: x, y (centre), scale, art (canvas; default: a small locked card of `kind`), t, flapRate=2.6 (Hz), phase, heading (rad)
function pzCardBird(g, t, opts = {}) {
  const { x, y, scale = .4, kind = 'fever', flapRate = 2.6, phase = 0, heading = 0, alpha = 1 } = opts;
  const art = opts.art || pzBirdArt(kind);
  const aw = art.width, ah = art.height;
  const th = Math.sin(t * flapRate * Math.PI * 2 + phase) * 1.0;   // wing angle
  const c = Math.max(.08, Math.cos(th)), sN = Math.sin(th);
  g.save(); g.globalAlpha *= alpha; g.translate(x, y - sN * 10 * scale); g.rotate(heading); g.scale(scale, scale);
  const shade = (1 - c) * .45 + (sN < 0 ? .1 : 0);
  for (const side of [-1, 1]) {
    // each wing: the half-card, darkened (only where there is card) as it turns away
    const sc = pzScratch('pzbirdwing', aw / 2 + 2, ah), sg = sc.getContext('2d');
    sg.drawImage(art, side < 0 ? 0 : aw / 2, 0, aw / 2, ah, 0, 0, aw / 2, ah);
    if (shade > .02) { sg.globalCompositeOperation = 'source-atop'; sg.globalAlpha = shade; sg.fillStyle = '#3b2a1e'; sg.fillRect(0, 0, aw / 2, ah); sg.globalCompositeOperation = 'source-over'; sg.globalAlpha = 1; }
    g.save();
    g.transform(c, -side * sN * .38, 0, 1, 0, 0);
    g.drawImage(sc, 0, 0, aw / 2, ah, side < 0 ? -aw / 2 : 0, -ah / 2, aw / 2, ah);
    g.restore();
  }
  g.restore();
}
function pzBirdArt(kind) {
  return cached('pzbird:' + kind, 290, 420, gg => {
    const spec = PZ_LOCKED[kind] || PZ_LOCKED.fever, w = spec.big ? 600 : 500, h = spec.big ? 860 : 660;
    const art = pzLockedArt(kind, w, h), s = Math.min(270 / (w + 40), 360 / (h + 40));
    gg.translate(145, 185); gg.scale(s, s); gg.drawImage(art, -(w + 40) / 2, -(h + 40) / 2);
    pzPadlock(gg, 0, h * .5 + 30, 1.15, { open: 0, swing: .25, seed: 'pzbl' + kind });   // still locked: released, not solved
  });
}
// A flock released from one point (the trunk), rising over the town. Not solved: released.
// opts: t0, n=28, from=[x,y], kinds (cycled), spread (rad), speed, scale
function pzFlock(g, t, opts = {}) {
  const { t0 = 0, n = 28, from = [W / 2, H * .85], kinds = ['fever', 'fire', 'storm', 'jacobian2', 'wire', 'ns0', 'zeros'], spread = 1.25, speed = 620, scale = .34, stagger = .09 } = opts;
  const birds = [];
  for (let i = 0; i < n; i++) {
    const r = rng('pzflock' + i), ti = t0 + i * stagger * r.range(.6, 1.4), tau = t - ti;
    if (tau < 0) continue;
    const a = -Math.PI / 2 + r.range(-spread, spread), sp = speed * r.range(.7, 1.3), depth = r.range(-.45, .9);
    const lift = ease.outC(clamp(tau / .6));
    const px = from[0] + Math.cos(a) * sp * tau + Math.sin(tau * 1.4 + i) * 40 * lift;
    const py = from[1] + Math.sin(a) * sp * tau * .85 + Math.cos(tau * 1.9 + i) * 26 * lift + 30 * tau * tau * (a > -Math.PI / 2 ? .2 : .1);
    const sc = scale * lift * Math.max(.15, 1 + depth * tau * .8) * r.range(.7, 1.1);
    if (px < -300 || px > W + 300 || py < -400 || py > H + 300 || sc > 4) continue;
    birds.push({ px, py, sc, kind: kinds[i % kinds.length], rate: r.range(2.2, 3.2), ph: r() * 6, heading: Math.cos(a) * .35 + Math.sin(tau * 2 + i) * .06 });
  }
  birds.sort((a, b) => a.sc - b.sc);
  for (const b of birds) pzCardBird(g, t, { x: b.px, y: b.py, scale: b.sc, kind: b.kind, flapRate: b.rate, phase: b.ph, heading: b.heading });
  return birds.length;
}

// ============================================================================================
// 5. early gags: the strawberry, 9.11 vs 9.9, "You're absolutely right!"
// ============================================================================================

// The painted strawberry (moved from test.js and given an opts API).
function pzStrawberry(g, t, opts = {}) {
  const { x = W / 2, y = H / 2, scale = .55, seed = 'sb', rot = 0 } = opts;
  const s = scale;
  const c = cached('pzberry' + seed + s, Math.ceil(520 * s), Math.ceil(560 * s), gg => {
    gg.translate(260 * s, 300 * s); gg.scale(s, s);
    const body = [...bez([0, 220], [-150, 150], [-190, -40], [-120, -110], 24), ...bez([-120, -110], [-60, -150], [60, -150], [120, -110], 16).slice(1), ...bez([120, -110], [190, -40], [150, 150], [0, 220], 24).slice(1)];
    wash(gg, body, PAL.berry, { seed: seed + 'b', layers: 44, alpha: .06, spread: .25 });
    wash(gg, deform(polyCircle(-60, -40, 60, 90, 18), rng(seed + 'h'), 1, .2), '#ffd0b0', { seed: seed + 'hl', layers: 18, alpha: .05, spread: .3 });
    wash(gg, deform(polyCircle(50, 90, 90, 80, 18), rng(seed + 's'), 1, .2), '#7a1420', { seed: seed + 'sh', layers: 22, alpha: .045, spread: .3 });
    const r = rng(seed + 'seeds');
    for (let row = 0; row < 7; row++) for (let k = 0; k < 6 - Math.abs(row - 2) * .6; k++) {
      const yy = -80 + row * 40 + r.gauss() * 4, half = 120 - Math.abs(yy - 20) * .45, xx = -half + (k + .5) / (6 - Math.abs(row - 2) * .6) * 2 * half + r.gauss() * 6;
      gg.save(); gg.translate(xx, yy); gg.rotate(r.gauss() * .3);
      gg.fillStyle = '#f2cf6a'; gg.beginPath(); gg.ellipse(0, 0, 4.5, 7.5, 0, 0, 7); gg.fill();
      gg.fillStyle = 'rgba(90,20,20,.35)'; gg.beginPath(); gg.ellipse(1.5, 3, 4, 3, 0, 0, 7); gg.fill();
      gg.restore();
    }
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .48; wash(gg, petal(0, -120, a + Math.PI, -10, 110, 26, 0), PAL.leaf, { seed: seed + 'l' + i, layers: 16, alpha: .09, spread: .12, depth: 4 }); }
    wash(gg, polyRect(-8, -200, 16, 70), '#4f6e36', { seed: seed + 'stem', layers: 14, alpha: .1, spread: .1, depth: 4 });
    inkPath(gg, body, { width: 3.5, color: '#5a1a14', seed: seed + 'o', wobble: .8, taper: false });
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .48; inkPath(gg, petal(0, -120, a + Math.PI, -10, 110, 26, 0), { width: 2.4, color: '#2f4a22', seed: seed + 'lo' + i, wobble: .6, taper: false }); }
  });
  g.save(); g.translate(x, y); g.rotate(rot + Math.sin(t * 1.6) * .02); g.drawImage(c, -c.width / 2, -c.height * 300 / 560); g.restore();
}

// The strawberry card, painted version. Timeline (all optional, absolute times):
//   t0: sheet + card + tiles appear; tTokens: the tokeniser's view (str | aw | berry) washes under the tiles;
//   tWrong: answer "2" + ONCE MORE! stamp; tCount: memo circles count the r's 1, 2, 3; tRight: "3 ✓" + Q.E.D.
// opts: x, y, scale (whole composition, laid out on 1920x1080), bg
function pzStrawberryCard(g, t, opts = {}) {
  const { t0 = 0, tTokens = null, tWrong = null, tCount = t0 + 1.2, tRight = t0 + 2.6, x = 0, y = 0, scale = 1, bg = true } = opts;
  g.save(); g.translate(x, y); g.scale(scale, scale);
  if (bg) pzDesk(g, t);
  pzSheet(g, t, { x: 120, y: 175, w: 1680, h: 800, seed: 'pzsbs' });
  pzCard(g, t, { x: 170, y: 52, w: 640, h: 150, num: 1, title: 'Counting Fruit', sparks: 1, t0, seed: 'pzsb' });
  pzLabel(g, 'How many r’s are there in “strawberry”?', 960, 300, 52, { style: 'italic', weight: 600, alpha: clamp((t - t0 - .3) / .3) });
  pzStrawberry(g, t, { x: 1620, y: 300, scale: .42 });
  const word = 'STRAWBERRY', size = 104, step = 118, x0 = 960 - (word.length - 1) * step / 2, ty = 520;
  if (tTokens !== null && t > tTokens) { // what the model "sees": three tokens
    const toks = [[0, 3, PAL.teal, 'str'], [3, 5, PZ.goldDeep, 'aw'], [5, 10, PAL.plum, 'berry']];
    toks.forEach(([a, b, c, lab], i) => {
      const k = clamp((t - tTokens - i * .15) / .3); if (k <= 0) return;
      g.save(); g.globalAlpha *= .35 * k; g.fillStyle = c; g.beginPath(); g.roundRect(x0 + a * step - size * .62, ty - size * .66, (b - a - 1) * step + size * 1.24, size * 1.32, 22); g.fill(); g.restore();
      pzLabel(g, lab, x0 + ((a + b - 1) / 2) * step, ty + size * .66 + 44, 34, { fam: 'mono', color: c, alpha: k });
    });
  }
  for (let i = 0; i < word.length; i++) {
    const isR = word[i] === 'R', ri = [2, 7, 8].indexOf(i);
    const hi = isR && t > tCount + ri * .3 ? tw(t, tCount + ri * .3, .2) : 0;
    pzTile(g, t, { x: x0 + i * step, y: ty, ch: word[i], size, t0: t0 + .3 + i * .06, seed: 'pzsbt' + i, hi });
    if (isR) {
      pzMemoCircle(g, t, { x: x0 + i * step, y: ty, rx: 64, ry: 66, t0: tCount + ri * .3, dur: .25, seed: 'r' + i, color: PAL.clayDeep });
      pzMemoText(g, t, { text: String(ri + 1), x: x0 + i * step, y: ty - 92, size: 60, t0: tCount + ri * .3 + .1, align: 'center', color: PAL.clayDeep });
    }
  }
  // the answer box
  const bx = 960, by = 800;
  if (t > t0 + .6) {
    pzLabel(g, 'answer:', bx - 140, by + 18, 44, { style: 'italic', color: PZ.inkSoft, align: 'right' });
    const box = deform(polyRect(bx - 110, by - 70, 220, 130), rng('pzans'), 1, .01);
    paintFill(g, gg => tracePoly(gg, box), '#fffaf0', { tex: .1 }); inkPoly(g, box, { width: 3, seed: 'pzanso', boil: pzBoil(t), wobble: .5 });
    const wrongShown = tWrong !== null && t > tWrong && t < tRight;
    if (wrongShown) { pzMemoText(g, t, { text: '2', x: bx, y: by + 40, size: 110, t0: tWrong, align: 'center', color: PZ.ink, rot: 0 }); pzMemoCross(g, t, { x: bx, y: by - 4, size: 80, t0: tWrong + .35 }); }
    if (t > tRight) { pzMemoText(g, t, { text: '3', x: bx - 20, y: by + 40, size: 120, t0: tRight, align: 'center', color: PAL.clayDeep, rot: 0 }); pzMemoTick(g, t, { x: bx + 52, y: by - 4, size: 70, t0: tRight + .2, color: PAL.leaf, width: 8 }); }
  }
  if (tWrong !== null) pzStamp(g, t < tRight ? t : -9, { kind: 'oncemore', x: 1460, y: 800, t0: tWrong + .5, scale: .95, seed: 'sbw' });
  pzStamp(g, t, { kind: 'qed', x: 1480, y: 790, t0: tRight + .45, scale: 1.15, seed: 'sbr' });
  g.restore();
}

// ---- the 9.11 vs 9.9 chalkboard ----------------------------------------------------------------------------
// Timeline: t0 board; tClaim "9.11 > 9.9" in chalk; tCross a big red ✗; tFix "9.90 > 9.11" ✓ with "9.9 = 9.90".
// opts: x, y (centre), scale
function pzChalkText(g, t, opts) { // chalk handwriting: a wipe-on, with a dry, speckled texture
  const { text, x, y, size = 90, t0 = 0, dur = .5, color = PZ.chalk, align = 'left', rot = 0 } = opts;
  if (t < t0) return;
  const k = clamp((t - t0) / dur);
  g.save(); g.font = pzFont(size, 'hand', 700);
  const w = g.measureText(text).width + 20, h = size * 1.5;
  const sc = pzScratch('pzchalk', w + 20, h + 20), sg = sc.getContext('2d');
  sg.font = pzFont(size, 'hand', 700); sg.fillStyle = color; sg.textBaseline = 'alphabetic'; sg.fillText(text, 10, size * 1.1);
  sg.globalCompositeOperation = 'destination-out'; sg.drawImage(pzChalkGrain(), (hashStr(text) % 200), (hashStr(text) % 97), w + 20, h + 20, 0, 0, w + 20, h + 20);
  sg.globalCompositeOperation = 'destination-in'; const gr = sg.createLinearGradient(0, 0, w + 20, 0); gr.addColorStop(clamp(k * 1.05), 'rgba(0,0,0,1)'); gr.addColorStop(clamp(k * 1.05 + .04), 'rgba(0,0,0,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, w + 20, h + 20);
  sg.globalCompositeOperation = 'source-over';
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  g.translate(x0, y - size * 1.1); g.rotate(rot); g.drawImage(sc, 0, 0, w + 20, h + 20, -10, 0, w + 20, h + 20);
  g.restore();
}
function pzChalkGrain() {
  return cached('pzchalkgrain', 1400, 400, gg => {
    const img = gg.createImageData(1400, 400), d = img.data, N = makeNoise('chalk'), r = rng('chalkg');
    for (let i = 0; i < d.length; i += 4) { const p = i / 4, x = p % 1400, y = (p / 1400) | 0; const n = N(x / 2.2, y / 2.2) * .7 + N(x / 14, y / 3) * .3; d[i] = d[i + 1] = d[i + 2] = 0; d[i + 3] = n > .67 ? 255 : n > .58 ? 110 * r() : 0; }
    gg.putImageData(img, 0, 0);
  });
}
function pzChalkboard(g, t, opts = {}) {
  const { x = W / 2, y = H / 2, scale = 1, t0 = 0, tClaim = t0 + .5, tCross = t0 + 1.8, tFix = t0 + 2.6 } = opts;
  const w = 1240, h = 700;
  g.save(); g.translate(x, y); g.scale(scale, scale); g.translate(-w / 2, -h / 2);
  g.drawImage(cached('pzboard', w + 60, h + 60, gg => {
    gg.translate(30, 30);
    gg.save(); gg.translate(10, 14); gg.globalAlpha = .3; gg.fillStyle = '#2a1a10'; gg.fillRect(-18, -18, w + 36, h + 36); gg.restore();
    const fr = deform(polyRect(-22, -22, w + 44, h + 44), rng('pzbf'), 1, .003);
    paintFill(gg, g2 => tracePoly(g2, fr), '#8a5a34', { tex: .45 });
    inkPoly(gg, fr, { width: 3, seed: 'pzbfo', wobble: .4 });
    paintFill(gg, g2 => g2.rect(0, 0, w, h), PZ.slate, { tex: .25 });
    // old chalk ghosts and dust
    gg.save(); gg.beginPath(); gg.rect(0, 0, w, h); gg.clip();
    const r = rng('pzghost'); gg.fillStyle = '#fff'; gg.filter = 'blur(18px)';
    for (let i = 0; i < 14; i++) { gg.globalAlpha = r.range(.025, .06); gg.save(); gg.translate(r() * w, r() * h); gg.rotate(r.gauss() * .15); gg.fillRect(-r.range(120, 320), -r.range(12, 40), r.range(240, 640), r.range(24, 80)); gg.restore(); }
    gg.filter = 'none';
    gg.globalAlpha = .1; gg.font = pzFont(60, 'hand', 600); gg.fillText('a² + b² = c²', 60, 640); gg.fillText('∫ x dx', 900, 120);
    gg.restore();
    inkPoly(gg, polyRect(0, 0, w, h), { width: 2.5, seed: 'pzbo', wobble: .3 });
    // the ledge with a chalk stub
    paintFill(gg, g2 => g2.rect(-10, h + 6, w + 20, 22), '#74482a', { tex: .4 });
    gg.fillStyle = '#f2eee2'; gg.fillRect(w - 200, h + 1, 46, 10);
  }), -30, -30);
  pzChalkText(g, t, { text: 'Which is bigger?', x: 70, y: 110, size: 64, t0, dur: .4 });
  pzChalkText(g, t, { text: '9.11  >  9.9', x: 150, y: 300, size: 150, t0: tClaim, dur: .55 });
  if (t > tCross) pzMemoCross(g, t, { x: 520, y: 240, size: 260, t0: tCross, dur: .3, width: 22, color: '#d4483e' });
  pzChalkText(g, t, { text: '9.90  >  9.11', x: 150, y: 560, size: 150, t0: tFix, dur: .55, color: '#f6e9b8' });
  pzChalkText(g, t, { text: '9.9 = 9.90', x: 900, y: 420, size: 64, t0: tFix + .6, dur: .35, color: '#cfe3dc', rot: -.04 });
  if (t > tFix + .7) pzMemoArrow(g, t, { from: [890, 400], to: [610, 452], t0: tFix + .7, dur: .3, color: '#cfe3dc', seed: 'chalkarrow', width: 5, bend: .25 });
  if (t > tFix + .6) pzMemoTick(g, t, { x: 1080, y: 510, size: 90, t0: tFix + .55, color: '#a8d39a', width: 10 });
  g.restore();
}

// ---- "You're absolutely right!" — speech bubbles multiplying until they fill the screen ---------------------
// opts: t0, rate (doublings per second, default 2.2), max=140, x, y, w, h (area), origin [x,y] (who is speaking),
//       text. The count doubles every 1/rate seconds; later bubbles are smaller and fill the gaps.
function pzBubbleArt(size, variant, text) {
  return cached(`pzbub:${size}:${variant}:${text}`, Math.ceil(size * 2.3), Math.ceil(size * .95), gg => {
    const w = size * 2.1, h = size * .78, x = (size * 2.3 - w) / 2, y = (size * .95 - h) / 2;
    const b = deform(polyCircle(x + w / 2, y + h / 2, w / 2, h / 2, 30), rng('pzbb' + variant), 2, .02);
    gg.save(); gg.translate(4, 6); gg.globalAlpha = .2; gg.fillStyle = PAL.umber; tracePoly(gg, b); gg.fill(); gg.restore();
    paintFill(gg, g2 => tracePoly(g2, b), variant % 3 === 0 ? '#fdf3dc' : variant % 3 === 1 ? '#fbeedd' : '#f7f1e2', { tex: .12 });
    inkPoly(gg, b, { width: Math.max(1.5, size * .022), seed: 'pzbo' + variant, wobble: .5 });
    let fs = size * .23; gg.font = pzFont(fs, 'body', 600, 'italic');
    const tw0 = gg.measureText(text).width; if (tw0 > w * .84) { fs *= w * .84 / tw0; gg.font = pzFont(fs, 'body', 600, 'italic'); }
    gg.fillStyle = PZ.ink; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText(text, x + w / 2, y + h / 2 + fs * .05);
  });
}
function pzRightBubbles(g, t, opts = {}) {
  const { t0 = 0, rate = 2.2, max = 140, x = 0, y = 0, w = W, h = H, origin = [200, H - 80], text = 'You’re absolutely right!', seed = 'yar' } = opts;
  if (t < t0) return 0;
  // deterministic best-candidate placement (cached on the function as a pure memo)
  const key = `${seed}:${max}:${x},${y},${w},${h}`;
  pzRightBubbles._m = pzRightBubbles._m || {};
  const P = pzRightBubbles._m[key] || (pzRightBubbles._m[key] = (() => {
    const r = rng('pzyar' + seed), out = [];
    for (let i = 0; i < max; i++) {
      const size = lerp(250, 95, Math.pow(i / max, .5));
      let best = null, bd = -Infinity;
      for (let c = 0; c < 24; c++) {
        const px = x + size + r() * (w - 2 * size), py = y + size * .45 + r() * (h - size * .9);
        let d = 1e9; for (const o of out) d = Math.min(d, Math.hypot((o.x - px) / 2.2, o.y - py) - o.s * .35);
        if (i === 0) { best = [x + w * .5, y + h * .4]; break; }
        if (d > bd) { bd = d; best = [px, py]; }
      }
      out.push({ x: best[0], y: best[1], s: size, rot: r.gauss() * .07, v: Math.floor(r() * 6) });
    }
    return out;
  })());
  const n = Math.min(max, Math.floor(Math.pow(2, (t - t0) * rate)));
  for (let i = 0; i < n; i++) {
    const b = P[i], ti = t0 + Math.log2(i + 1) / rate, k = ease.outBack(clamp((t - ti) / .22));
    if (k <= 0) continue;
    const art = pzBubbleArt(Math.round(b.s / 10) * 10, b.v, text);
    // tail towards the speaker
    const dx = origin[0] - b.x, dy = origin[1] - b.y, dd = Math.hypot(dx, dy) || 1, ux = dx / dd, uy = dy / dd;
    g.save(); g.translate(b.x, b.y); g.rotate(b.rot); g.scale(k, k);
    const tl = b.s * .55, bx = ux * b.s * .7, by = uy * b.s * .25;
    const tail = [[bx - uy * b.s * .12, by + ux * b.s * .12], [bx + ux * tl, by + uy * tl], [bx + uy * b.s * .12, by - ux * b.s * .12]];
    g.fillStyle = '#fbf0da'; tracePoly(g, tail); g.fill();
    inkPath(g, tail.slice(0, 2), { width: 2.2, seed: 'pzbt' + i, wobble: .4 }); inkPath(g, tail.slice(1), { width: 2.2, seed: 'pzbt2' + i, wobble: .4 });
    g.drawImage(art, -art.width / 2, -art.height / 2);
    g.restore();
  }
  return n;
}
