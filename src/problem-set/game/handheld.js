// handheld.js — HANDHELD mode: a cosy 2000s handheld puzzle game, drawn in code.
//
// Two stacked 256×192 logical-pixel screens inside a simple device of our own design (no hinge, no buttons
// copied from real hardware), on a warm desk. Everything is drawn into one 768×432 logical canvas with a
// strict 16-colour palette and hard-edged pixel rasterising, then upscaled ×2.5 to 1920×1080 with
// "sharp bilinear" (nearest ×3, then smooth down), so the pixels stay chunky and even.
//
// Public API (all names prefixed hh / HH to stay out of other files' way):
//   HH, HHP                                  geometry + 16-colour palette
//   hhColdOpenTimeline(over)                 default event times for the cold open (seconds), overridable
//   hhColdOpenRetime(beats)                  build a timeline from a few musical anchor times
//   drawColdOpen(g, t, T, opts)              the whole cold open at time t (handles the shatter at T.drop)
//   hhColdOpenLow(lg, t, T)                  the cold-open frame drawn into a 768×432 logical canvas
//   hhShatter(g, k, drawFull, opts)          pixels → petals → full-res frame underneath (k 0..1)
//   hhTagTimeline(over), drawHandheldTag(g, t, T, opts), hhTagLow(lg, t, T)   the end tag (PROBLEM № ∞)
//   hhBlips(T, which)                        [{t, speaker, ch, pitch}] every typed character (for the sound designer)
//   hhCues(T, which)                         [{t, cue}] other sound cues (power-on, tile ticks, buzzer, sparkle, drop…)
//   hhFrame(g, t, drawTop, drawBottom, opts) generic: any two screen-drawing functions in the handheld look
//   hhText / hhTextWidth / hhTypedLines      the bitmap pixel font (5×7 + descenders, proportional)
//   hhPresent(g, lg, opts)                   sharp-upscale a logical canvas to the 1920×1080 frame
//   hhSpriteClaude(expr) / hhSpriteHilde(expr) / hhSpriteBerry() / hhSpriteTrunk() / hhSpriteCross()

// ---------------------------------------------------------------------------------------------
// palette (16 colours, warm sepia / cream / clay / teal) and geometry
// ---------------------------------------------------------------------------------------------
const HHP = {
  ink: '#2b1b14', brown: '#5a3826', umber: '#8a5d3b', tan: '#c49a6c',
  parch: '#e8d5ad', cream: '#fbf3e0', clay: '#d97757', clayDk: '#a94a30',
  skin: '#f7cfae', teal: '#4f7d78', tealDk: '#2e504d', plum: '#6d4a5e',
  gold: '#e0aa45', red: '#c4383a', silver: '#d3cccb', silverDk: '#968b92',
};
const HH = {
  SW: 256, SH: 192,                // one screen, logical px
  LW: 768, LH: 432,                // whole logical frame (×2.5 = 1920×1080)
  S: 2.5,
  top: [256, 18], bot: [256, 226], // screen positions inside the logical frame
  dev: [232, 5, 304, 422],         // device body x, y, w, h
};
const HH_SPEAK = { hilde: { pitch: 392, name: 'HILDE' }, claude: { pitch: 784, name: 'CLAUDE' }, card: { pitch: 587, name: '' } };

const _hhScratch = new Map();
function hhScratch(key, w, h) {
  let c = _hhScratch.get(key);
  if (!c || c.width !== w || c.height !== h) { c = document.createElement('canvas'); c.width = w; c.height = h; _hhScratch.set(key, c); }
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  return c;
}
const hhI = Math.round;

// ---------------------------------------------------------------------------------------------
// pixel rasteriser: hard edges, exact palette colours, no anti-aliasing
// ---------------------------------------------------------------------------------------------
function hhPx(g, x, y, c, w = 1, h = 1) { g.fillStyle = c; g.fillRect(hhI(x), hhI(y), w, h); }
// fill a polygon: a pixel is in if its centre is in (even-odd)
function hhPoly(g, pts, c) {
  let y0 = Infinity, y1 = -Infinity;
  for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  g.fillStyle = c;
  for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
    const cy = y + .5, xs = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if ((a[1] <= cy && b[1] > cy) || (b[1] <= cy && a[1] > cy)) xs.push(a[0] + (cy - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
    }
    xs.sort((p, q) => p - q);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const xa = Math.ceil(xs[i] - .5), xb = Math.floor(xs[i + 1] - .5);
      if (xb >= xa) g.fillRect(xa, y, xb - xa + 1, 1);
    }
  }
}
function hhEll(g, cx, cy, rx, ry, c) { hhPoly(g, polyCircle(cx, cy, rx, ry, 48), c); }
function hhLine(g, x0, y0, x1, y1, c, w = 1) {
  x0 = hhI(x0); y0 = hhI(y0); x1 = hhI(x1); y1 = hhI(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let e = dx + dy; g.fillStyle = c;
  for (;;) {
    g.fillRect(x0, y0, w, w);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; }
  }
}
// rounded rectangle with stepped pixel corners
function hhRRect(g, x, y, w, h, r, c) {
  g.fillStyle = c; x = hhI(x); y = hhI(y);
  for (let j = 0; j < h; j++) {
    const d = Math.min(j, h - 1 - j);
    let ins = 0;
    if (d < r) { const dy = r - d - .5; ins = Math.ceil(r - Math.sqrt(Math.max(0, r * r - dy * dy)) - .25); }
    g.fillRect(x + ins, y + j, w - 2 * ins, 1);
  }
}
// draw a character map: rows of chars, legend maps char → colour ('.'/' ' transparent)
function hhMap(g, x, y, rows, legend, flip = false) {
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      const c = legend[row[i]]; if (!c) continue;
      g.fillStyle = c; g.fillRect(hhI(x) + (flip ? row.length - 1 - i : i), hhI(y) + j, 1, 1);
    }
  }
}
// 4×4 Bayer ordered dither: overlay colour c on a rect at density 0..1 (pattern anchored to canvas origin)
const HH_BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function hhDither(g, x, y, w, h, c, level) {
  const n = Math.round(clamp(level) * 16); if (n <= 0) return;
  if (n >= 16) { hhPx(g, x, y, c, w, h); return; }
  const pc = cached('hh:bayer' + c + n, 4, 4, (q) => { q.fillStyle = c; for (let i = 0; i < 16; i++) if (HH_BAYER[i] < n) q.fillRect(i % 4, i >> 2, 1, 1); });
  g.save(); g.fillStyle = g.createPattern(pc, 'repeat'); g.fillRect(hhI(x), hhI(y), w, h); g.restore();
}
// 1-px outline around every opaque pixel of a canvas (in place)
function hhOutline(c, color, diag = false) {
  const g = c.getContext('2d'), W = c.width, H = c.height, im = g.getImageData(0, 0, W, H), d = im.data;
  const [r, gg, b] = hexToRgb(color), on = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 127;
  const mark = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (on(x, y)) continue;
    if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1) || (diag && (on(x - 1, y - 1) || on(x + 1, y - 1) || on(x - 1, y + 1) || on(x + 1, y + 1)))) mark.push((y * W + x) * 4);
  }
  for (const i of mark) { d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255; }
  g.putImageData(im, 0, 0);
}
function hhSprite(key, w, h, fn) { return cached('hh:spr:' + key, w, h, (g, c) => { g.imageSmoothingEnabled = false; fn(g, c); }); }
// blit a sprite at an integer scale
function hhBlit(g, spr, x, y, s = 1) { g.imageSmoothingEnabled = false; g.drawImage(spr, hhI(x), hhI(y), spr.width * s, spr.height * s); }

// ---------------------------------------------------------------------------------------------
// bitmap font: 5×7 caps, lowercase with 2-row descenders, proportional. '#' on, '.' off, rows split by '/'.
// ---------------------------------------------------------------------------------------------
const HH_FONT_SRC = {
  'A': '.###./#...#/#...#/#####/#...#/#...#/#...#', 'B': '####./#...#/#...#/####./#...#/#...#/####.',
  'C': '.###./#...#/#..../#..../#..../#...#/.###.', 'D': '####./#...#/#...#/#...#/#...#/#...#/####.',
  'E': '#####/#..../#..../####./#..../#..../#####', 'F': '#####/#..../#..../####./#..../#..../#....',
  'G': '.###./#...#/#..../#.###/#...#/#...#/.####', 'H': '#...#/#...#/#...#/#####/#...#/#...#/#...#',
  'I': '###/.#./.#./.#./.#./.#./###', 'J': '..###/...#./...#./...#./#..#./#..#./.##..',
  'K': '#...#/#..#./#.#../##.../#.#../#..#./#...#', 'L': '#..../#..../#..../#..../#..../#..../#####',
  'M': '#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#', 'N': '#...#/##..#/#.#.#/#..##/#...#/#...#/#...#',
  'O': '.###./#...#/#...#/#...#/#...#/#...#/.###.', 'P': '####./#...#/#...#/####./#..../#..../#....',
  'Q': '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#', 'R': '####./#...#/#...#/####./#.#../#..#./#...#',
  'S': '.####/#..../#..../.###./....#/....#/####.', 'T': '#####/..#../..#../..#../..#../..#../..#..',
  'U': '#...#/#...#/#...#/#...#/#...#/#...#/.###.', 'V': '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
  'W': '#...#/#...#/#...#/#.#.#/#.#.#/##.##/#...#', 'X': '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
  'Y': '#...#/#...#/.#.#./..#../..#../..#../..#..', 'Z': '#####/....#/...#./..#../.#.../#..../#####',
  'a': '...../...../.###./....#/.####/#...#/.####', 'b': '#..../#..../####./#...#/#...#/#...#/####.',
  'c': '..../..../.###/#.../#.../#.../.###', 'd': '....#/....#/.####/#...#/#...#/#...#/.####',
  'e': '...../...../.###./#...#/#####/#..../.###.', 'f': '..##/.#../####/.#../.#../.#../.#..',
  'g': '...../...../.####/#...#/#...#/#...#/.####/....#/.###.', 'h': '#..../#..../####./#...#/#...#/#...#/#...#',
  'i': '#/./#/#/#/#/#', 'j': '..#/.../..#/..#/..#/..#/..#/#.#/.#.',
  'k': '#.../#.../#..#/#.#./##../#.#./#..#', 'l': '#./#./#./#./#./#./.#',
  'm': '...../...../##.#./#.#.#/#.#.#/#.#.#/#.#.#', 'n': '...../...../####./#...#/#...#/#...#/#...#',
  'o': '...../...../.###./#...#/#...#/#...#/.###.', 'p': '...../...../####./#...#/#...#/#...#/####./#..../#....',
  'q': '...../...../.####/#...#/#...#/#...#/.####/....#/....#', 'r': '..../..../#.##/##../#.../#.../#...',
  's': '...../...../.####/#..../.###./....#/####.', 't': '.#../.#../####/.#../.#../.#../..##',
  'u': '...../...../#...#/#...#/#...#/#...#/.####', 'v': '...../...../#...#/#...#/#...#/.#.#./..#..',
  'w': '...../...../#...#/#.#.#/#.#.#/#.#.#/.#.#.', 'x': '...../...../#...#/.#.#./..#../.#.#./#...#',
  'y': '...../...../#...#/#...#/#...#/#...#/.####/....#/.###.', 'z': '...../...../#####/...#./..#../.#.../#####',
  '0': '.###./#...#/#..##/#.#.#/##..#/#...#/.###.', '1': '..#../.##../..#../..#../..#../..#../.###.',
  '2': '.###./#...#/....#/...#./..#../.#.../#####', '3': '####./....#/....#/.###./....#/....#/####.',
  '4': '...#./..##./.#.#./#..#./#####/...#./...#.', '5': '#####/#..../####./....#/....#/#...#/.###.',
  '6': '.###./#..../#..../####./#...#/#...#/.###.', '7': '#####/....#/...#./..#../.#.../.#.../.#...',
  '8': '.###./#...#/#...#/.###./#...#/#...#/.###.', '9': '.###./#...#/#...#/.####/....#/....#/.###.',
  '!': '#/#/#/#/#/./#', '?': '.###./#...#/....#/...#./..#../...../..#..',
  '.': '././././././#', ',': '../../../../../.#/.#/#.', "'": '#/#', '’': '#/#', ':': '././#/./././#',
  '-': '.../.../.../###', '…': '...../...../...../...../...../...../#.#.#',
  '/': '....#/...#./...#./..#../.#.../.#.../#....', '+': '...../...../..#../.###./..#..',
  '№': '#..#..../##.#.###/#.##.#.#/#..#.###/#..#..../#..#.###/#..#....',
  '✷': '...#.../.#.#.#./..###../#######/..###../.#.#.#./...#...',
  '∞': '........./........./.##...##./#..#.#..#/#...#...#/#..#.#..#/.##...##.',
  '▶': '#.../##../###./####/###./##../#...', '×': '...../#...#/.#.#./..#../.#.#./#...#',
};
const HH_FONT = (() => {
  const F = {};
  for (const [ch, src] of Object.entries(HH_FONT_SRC)) {
    const rows = src.split('/'), w = Math.max(...rows.map(r => r.length)), px = [];
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([x, y]); });
    F[ch] = { w, px };
  }
  F[' '] = { w: 3, px: [] };
  return F;
})();
function hhTextWidth(s, scale = 1) {
  let w = 0; for (const ch of s) w += ((HH_FONT[ch] || HH_FONT['?']).w + 1) * scale;
  return Math.max(0, w - scale);
}
// draw text; (x, y) is the top-left of the cap height. opts: scale, shadow colour, align 'left'|'center'|'right', wave fn(i)->dy
function hhText(g, s, x, y, color, opts = {}) {
  const { scale = 1, shadow = null, align = 'left', wave = null } = opts;
  const W = hhTextWidth(s, scale);
  let cx = hhI(align === 'center' ? x - W / 2 : align === 'right' ? x - W : x);
  y = hhI(y);
  let i = 0;
  for (const ch of s) {
    const gl = HH_FONT[ch] || HH_FONT['?'], dy = wave ? hhI(wave(i)) : 0;
    for (const pass of shadow ? [0, 1] : [1]) {
      g.fillStyle = pass ? color : shadow;
      const o = pass ? 0 : 1;
      for (const [px, py] of gl.px) g.fillRect(cx + px * scale + o, y + py * scale + o + dy, scale, scale);
    }
    cx += (gl.w + 1) * scale; i++;
  }
  return W;
}
function hhWrap(s, maxW, scale = 1) {
  const words = s.split(' '), lines = []; let cur = '';
  for (const w of words) { const test = cur ? cur + ' ' + w : w; if (hhTextWidth(test, scale) > maxW && cur) { lines.push(cur); cur = w; } else cur = test; }
  if (cur) lines.push(cur); return lines;
}

// ---------------------------------------------------------------------------------------------
// typewriter schedule (shared by drawing and by the blip export, so they can never disagree)
// ---------------------------------------------------------------------------------------------
const HH_PAUSE = { ',': .12, '.': .22, '!': .22, '?': .22, '…': .3 };
// times at which each character of s appears
function hhSchedule(s, t0, cps = 18) {
  const out = []; let t = t0; const chars = [...s];
  for (let i = 0; i < chars.length; i++) { out.push(t); t += 1 / cps + (HH_PAUSE[chars[i]] && chars[i + 1] === ' ' ? HH_PAUSE[chars[i]] : 0); }
  return out;
}
function hhRevealed(sched, t) { let n = 0; while (n < sched.length && sched[n] <= t + 1e-6) n++; return n; }
// a typed line object: {text, t0, cps, instant}
function hhLineSched(L) { return L.instant ? [...L.text].map(() => L.t0) : hhSchedule(L.text, L.t0, L.cps || 18); }
// wrap first, then reveal, so words never jump between lines. Returns [{text, full}], n revealed, done flag
function hhTypedLines(L, t, maxW, scale) {
  const lines = hhWrap(L.text, maxW, scale), sched = hhLineSched(L);
  let n = hhRevealed(sched, t), left = n; const out = [];
  for (let i = 0; i < lines.length; i++) {
    const take = Math.max(0, Math.min(lines[i].length, left)); out.push(lines[i].slice(0, take));
    left -= lines[i].length + 1;   // the space consumed by wrapping
  }
  return { lines: out, n, done: n >= sched.length, sched };
}

// ---------------------------------------------------------------------------------------------
// sprites (cached). Built with the rasteriser above, then outlined, then hand-placed detail pixels.
// ---------------------------------------------------------------------------------------------
// Claude: clay sunflower bob, amber eyes, eight-point star clip, cream jacket, teal ribbon. 64×64.
const HH_CL_EYE = {   // 6×7, drawn at (23,29) and (35,29); highlight stays top-left on both eyes
  open:    ['.KKKK.', 'KWWDDK', 'DWWKKD', 'DCKKCD', 'CCCCCC', 'CGGGGC', '.CCCC.'],
  think:   ['......', 'KKKKKK', 'KDDWKK', 'DCCKKD', 'CCCCCC', 'CGGGGC', '.CCCC.'],
  blink:   ['......', '......', '......', '......', 'KKKKKK', '......', '......'],
  happy:   ['......', '......', '.KKKK.', 'K....K', '......', '......', '......'],
  shock:   ['KKKKKK', 'WWWWWW', 'WWWWWW', 'WWKKWW', 'WWKKWW', 'WWWWWW', '.WWWW.'],
  sparkA:  ['.KKKK.', 'KWWGGK', 'GWWKWG', 'GGKKGG', 'GGGGGG', 'GWGGGG', '.GGGG.'],
  sparkB:  ['.KKKK.', 'KGGWWK', 'GKKWWG', 'GKKGGG', 'GGGGGG', 'GGGGWG', '.GGGG.'],
  fierce:  ['......', 'KKKKKK', 'KDDDKK', 'DWWKKD', 'CWWKKC', 'CGGGGC', '.CCCC.'],
};
const HH_MOUTH = {   // even widths so they centre on the face (x 31.5)
  smile: ['B..B', '.BB.'], flat: ['.BB.'], talk: ['.BB.', 'BRRB', '.BB.'], grin: ['BBBBBB', '.BRRB.', '..BB..'],
  o: ['.BB.', 'BRRB', '.BB.'], shout: ['BBBBBB', 'BRRRRB', 'BRRRRB', '.BBBB.'], wobble: ['.B..B.', 'B.BB.B'],
};
function hhSpriteClaude(expr = 'smile') {
  return hhSprite('claude:' + expr, 64, 64, (g, c) => {
    const P = HHP;
    // crown of petals
    const crown = [];
    for (let i = 0; i < 120; i++) {
      const a = i / 120 * Math.PI * 2, s = ((a / (Math.PI * 2)) * 12 + .25) % 1, f = 1 - Math.abs(2 * s - 1);
      const R = .84 + .2 * Math.pow(f, .9);
      crown.push([32 + Math.cos(a) * 24.5 * R, 25 + Math.sin(a) * 22 * R]);
    }
    hhPoly(g, crown, P.clayDk);
    hhPoly(g, crown.map(([x, y]) => [32 + (x - 32) * .9, 23.5 + (y - 25) * .9]), P.clay);
    // side locks (petal tips flaring at the jaw)
    const lockL = [[12, 27], [20, 28], [22, 40], [18, 53], [14, 47], [10, 38]];
    hhPoly(g, lockL, P.clayDk); hhPoly(g, lockL.map(([x, y]) => [x + 1, y - 1]).slice(0, 5), P.clay);
    const lockR = lockL.map(([x, y]) => [64 - x, y]);
    hhPoly(g, lockR, P.clayDk); hhPoly(g, lockR.map(([x, y]) => [x - 1, y - 1]).slice(0, 5), P.clay);
    // body: cream capelet jacket
    const body = [[24, 48], [40, 48], [50, 52], [56, 57], [59, 64], [5, 64], [8, 57], [14, 52]];
    hhPoly(g, body, P.cream);
    hhPoly(g, [[44, 50], [50, 52], [56, 57], [59, 64], [46, 64]], P.parch);
    // clay collar trim and teal ribbon
    hhPoly(g, [[24, 47.5], [40, 47.5], [37, 53], [32, 55], [27, 53]], P.clay);
    hhPoly(g, [[25.5, 48], [31, 51.5], [25.5, 55]], P.teal); hhPoly(g, [[38.5, 48], [33, 51.5], [38.5, 55]], P.teal);
    hhPx(g, 31, 50, P.tealDk, 3, 3);
    // satchel strap
    hhLine(g, 12, 54, 30, 64, P.umber, 2); hhLine(g, 13, 54, 31, 64, P.brown, 1);
    // neck
    hhPx(g, 28, 41, P.skin, 9, 8); hhPx(g, 28, 41, P.tan, 9, 2);
    // face with a chin line
    hhEll(g, 32, 31.5, 13.8, 14, P.brown);
    hhEll(g, 32, 31, 13, 13.4, P.skin);
    hhPx(g, 20, 36, P.skin, 2, 1); hhPx(g, 42, 36, P.skin, 2, 1);
    // fringe: petal tips across the forehead
    const fr = [[15, 32], [15, 17], [21, 9], [32, 6.5], [43, 9], [49, 17], [49, 32], [46, 24], [43, 28.5], [40, 21], [36, 27], [32, 20.5], [28, 27], [24, 21], [21, 28.5], [18, 24]];
    hhPoly(g, fr, P.clay);
    for (let x = 21; x <= 42; x += 2) if (x < 29 || x > 34) hhPx(g, x, hhI(11 + Math.pow((x - 31.5) / 10, 2) * 3), P.gold);   // sheen arc
    hhLine(g, 32, 13, 32, 19, P.clayDk); hhLine(g, 26, 14, 25, 19, P.clayDk); hhLine(g, 38, 14, 39, 19, P.clayDk);
    hhOutline(c, P.ink);
    // eight-point star clip (the spark)
    hhMap(g, 41, 9, ['...C...', '.C.C.C.', '..CCC..', 'CCCGCCC', '..CCC..', '.C.C.C.', '...C...'], { C: P.cream, G: P.gold });
    // eyes
    const L = { K: P.ink, D: P.clayDk, C: P.clay, G: P.gold, W: P.cream };
    const eyeKey = { smile: 'open', talk: 'open', think: 'think', grin: 'happy', shock: 'shock', sparkle: 'sparkA', sparkle2: 'sparkB', shout: 'fierce', blink: 'blink', wobble: 'open' }[expr] || 'open';
    const E = HH_CL_EYE[eyeKey], flip = eyeKey === 'fierce';
    hhMap(g, 23, 29, E, L); hhMap(g, 35, 29, E, L, flip);
    const lashY = E[0][1] === 'K' ? 30 : E[1][1] === 'K' ? 30 : -1;
    if (lashY > 0) { hhPx(g, 22, lashY, P.ink); hhPx(g, 41, lashY, P.ink); hhPx(g, 21, lashY - 1, P.ink); hhPx(g, 42, lashY - 1, P.ink); }
    if (expr === 'shout') { hhLine(g, 22, 26, 27, 28, P.ink); hhLine(g, 36, 28, 41, 26, P.ink); }
    // blush
    if (['grin', 'sparkle', 'sparkle2', 'shout'].includes(expr)) { hhPx(g, 21, 37, P.clay, 2, 1); hhPx(g, 41, 37, P.clay, 2, 1); }
    // mouth
    const mk = { smile: 'smile', talk: 'talk', think: 'flat', grin: 'grin', shock: 'o', sparkle: 'o', sparkle2: 'o', shout: 'shout', blink: 'smile', wobble: 'wobble' }[expr] || 'smile';
    const M = HH_MOUTH[mk];
    hhMap(g, 32 - (M[0].length >> 1), 40, M, { B: P.brown, R: P.clayDk });
    if (expr === 'shock') hhMap(g, 49, 18, ['.T.', 'TCT', 'TCT', '.T.'], { T: P.teal, C: P.cream });   // sweat drop
  });
}
// Claude at twice the detail (128×128, same pixel size), for the "Three!" cut-in. expr: 'shout' | 'sparkle' | 'grin'
// Same construction as hhSpriteClaude with every coordinate doubled; eyes and mouth are drawn finer.
function hhSpriteClaudeBig(expr = 'shout') {
  return hhSprite('claudeBig:' + expr, 128, 128, (g, c) => {
    const P = HHP, D = pts => pts.map(([x, y]) => [x * 2, y * 2]);
    const crown = [];
    for (let i = 0; i < 200; i++) {
      const a = i / 200 * Math.PI * 2, s = ((a / (Math.PI * 2)) * 12 + .25) % 1, f = 1 - Math.abs(2 * s - 1);
      const R = .84 + .2 * Math.pow(f, .9);
      crown.push([64 + Math.cos(a) * 49 * R, 50 + Math.sin(a) * 44 * R]);
    }
    hhPoly(g, crown, P.clayDk);
    hhPoly(g, crown.map(([x, y]) => [64 + (x - 64) * .9, 47 + (y - 50) * .9]), P.clay);
    // petal seams in the crown (darker spokes between petals)
    for (let i = 0; i < 12; i++) {
      const a = (i + .75) / 12 * Math.PI * 2, r0 = 30, r1 = 38;
      hhLine(g, 64 + Math.cos(a) * r0, 48 + Math.sin(a) * r0 * .9, 64 + Math.cos(a) * r1, 48 + Math.sin(a) * r1 * .9, P.clayDk);
    }
    const lockL = D([[12, 27], [20, 28], [22, 40], [18, 53], [14, 47], [10, 38]]);
    hhPoly(g, lockL, P.clayDk); hhPoly(g, lockL.map(([x, y]) => [x + 2, y - 2]).slice(0, 5), P.clay);
    const lockR = lockL.map(([x, y]) => [128 - x, y]);
    hhPoly(g, lockR, P.clayDk); hhPoly(g, lockR.map(([x, y]) => [x - 2, y - 2]).slice(0, 5), P.clay);
    hhPoly(g, D([[24, 48], [40, 48], [50, 52], [56, 57], [59, 64], [5, 64], [8, 57], [14, 52]]), P.cream);
    hhPoly(g, D([[44, 50], [50, 52], [56, 57], [59, 64], [46, 64]]), P.parch);
    hhPoly(g, D([[24, 47.5], [40, 47.5], [37, 53], [32, 55], [27, 53]]), P.clay);
    hhPoly(g, D([[25.5, 48], [31, 51.5], [25.5, 55]]), P.teal); hhPoly(g, D([[38.5, 48], [33, 51.5], [38.5, 55]]), P.teal);
    hhPx(g, 61, 100, P.tealDk, 6, 6);
    hhLine(g, 24, 108, 60, 128, P.umber, 4); hhLine(g, 26, 108, 62, 128, P.brown, 1);
    hhPx(g, 56, 82, P.skin, 18, 16); hhPx(g, 56, 82, P.tan, 18, 3);
    hhEll(g, 64, 63, 27.6, 28, P.brown);
    hhEll(g, 64, 62, 26, 26.8, P.skin);
    hhPx(g, 40, 72, P.skin, 4, 2); hhPx(g, 84, 72, P.skin, 4, 2);
    const fr = D([[15, 32], [15, 17], [21, 9], [32, 6.5], [43, 9], [49, 17], [49, 32], [46, 24], [43, 28.5], [40, 21], [36, 27], [32, 20.5], [28, 27], [24, 21], [21, 28.5], [18, 24]]);
    hhPoly(g, fr, P.clay);
    for (let x = 42; x <= 85; x += 2) if (x < 57 || x > 70) hhPx(g, x, hhI(22 + Math.pow((x - 63.5) / 20, 2) * 6), P.gold);
    hhLine(g, 64, 26, 64, 38, P.clayDk); hhLine(g, 52, 28, 50, 38, P.clayDk); hhLine(g, 76, 28, 78, 38, P.clayDk);
    hhLine(g, 44, 34, 42, 44, P.clayDk); hhLine(g, 84, 34, 86, 44, P.clayDk);
    hhOutline(c, P.ink);
    // the spark clip, finer
    hhMap(g, 81, 17, ['......C......', '......C......', '..C...C...C..', '...C.CCC.C...', '....CCCCC....', '...CCCGCCC...', 'CCCCCGGGCCCCC', '...CCCGCCC...', '....CCCCC....', '...C.CCC.C...', '..C...C...C..', '......C......', '......C......'], { C: P.cream, G: P.gold });
    // eyes: iris + pupil + highlights, with a heavy upper lid
    const eye = (cx, side) => {
      if (expr === 'grin') {   // happy closed arcs ^ ^
        hhLine(g, cx - 6, 69, cx - 3, 64, P.ink, 2); hhLine(g, cx - 3, 64, cx + 3, 64, P.ink, 2); hhLine(g, cx + 3, 64, cx + 6, 69, P.ink, 2);
        return;
      }
      if (expr === 'sparkle') {
        hhEll(g, cx, 66, 6, 7.5, P.ink); hhEll(g, cx, 66.5, 5, 6.5, P.gold);
        hhEll(g, cx, 68, 3.5, 4, P.clay); hhPx(g, cx - 4, 60, P.cream, 3, 4); hhPx(g, cx + 2, 69, P.cream, 2, 2);
        hhSparkle(g, cx - 1, 64, 2, P.cream, P.cream);
        hhPx(g, cx - 6, 58, P.ink, 12, 2);
        return;
      }
      hhEll(g, cx, 67, 6, 7.5, P.ink);
      hhEll(g, cx, 67.5, 5, 6.5, P.clayDk);
      hhEll(g, cx, 69, 4, 4.5, P.clay); hhPx(g, cx - 3, 71, P.gold, 6, 2);
      hhEll(g, cx, 67, 2.2, 3.2, P.ink);
      hhPx(g, cx - 4 + (side < 0 ? 0 : 1), 62, P.cream, 3, 3); hhPx(g, cx + 2, 70, P.cream, 1, 1);
      // fierce lid: a slab cutting the top of the iris, lower at the nose
      const inner = side < 0 ? 1 : -1;
      hhPoly(g, [[cx - 8, 58 + (inner < 0 ? 4 : 0)], [cx + 8, 58 + (inner > 0 ? 4 : 0)], [cx + 8, 62 + (inner > 0 ? 4 : 0)], [cx - 8, 62 + (inner < 0 ? 4 : 0)]], P.ink);
      hhPx(g, side < 0 ? cx - 9 : cx + 7, side < 0 ? 59 : 59, P.ink, 2, 2);   // lash flick
    };
    eye(51, -1); eye(77, 1);
    if (expr === 'shout') { hhLine(g, 42, 50, 56, 55, P.ink, 2); hhLine(g, 72, 55, 86, 50, P.ink, 2); }
    else if (expr === 'grin') { hhLine(g, 43, 55, 56, 52, P.ink, 2); hhLine(g, 72, 52, 85, 55, P.ink, 2); }
    else { hhLine(g, 44, 52, 56, 50, P.ink, 2); hhLine(g, 72, 50, 84, 52, P.ink, 2); }
    // blush hatching
    for (const bx of [39, 82]) for (let k = 0; k < 3; k++) hhLine(g, bx + k * 3, 76, bx + k * 3 + 2, 73, P.clay);
    // mouth
    if (expr === 'grin') {   // a big confident open grin
      const m = [[50, 74], [78, 74], [75, 80], [69, 85], [59, 85], [53, 80]];
      hhPoly(g, m, P.brown); hhPoly(g, m.map(([x, y]) => [64 + (x - 64) * .86, 75 + (y - 74) * .78]), P.plum);
      hhPoly(g, [[58, 81], [70, 81], [67, 84], [61, 84]], P.clay); hhPx(g, 53, 75, P.cream, 22, 2);
    } else if (expr === 'shout') {
      const m = [[53, 75], [75, 75], [73, 82], [68, 87], [60, 87], [55, 82]];
      hhPoly(g, m, P.brown); hhPoly(g, m.map(([x, y]) => [64 + (x - 64) * .84, 76.2 + (y - 75) * .8]), P.plum);
      hhPoly(g, [[58, 82], [70, 82], [67, 85], [61, 85]], P.clay);   // tongue
      hhPx(g, 56, 76, P.cream, 16, 2);                                // teeth
    } else { hhPoly(g, [[58, 77], [70, 77], [67, 83], [61, 83]], P.brown); hhPoly(g, [[60, 78], [68, 78], [66, 82], [62, 82]], P.clayDk); }
  });
}
// Professor Hilde: silver bun with a pencil, round glasses, plum coat, mustard scarf. 64×64.
function hhSpriteHilde(expr = 'smile') {
  return hhSprite('hilde:' + expr, 64, 64, (g, c) => {
    const P = HHP;
    // coat
    const coat = [[22, 47], [42, 47], [52, 51], [58, 57], [60, 64], [4, 64], [6, 57], [12, 51]];
    hhPoly(g, coat, P.plum);
    hhPoly(g, [[25, 48], [32, 64], [20, 64], [15, 53]], P.brown); hhPoly(g, [[39, 48], [32, 64], [44, 64], [49, 53]], P.brown);  // lapels
    hhPoly(g, [[27, 48], [37, 48], [32, 60]], P.cream);
    // mustard scarf: a band round the neck and a tail down the chest
    hhPoly(g, [[24, 45], [40, 45], [41, 50], [23, 50]], P.gold);
    hhPoly(g, [[25, 49], [31, 49], [30, 64], [22, 64]], P.gold);
    hhPx(g, 23, 56, P.clayDk, 7, 1); hhPx(g, 22, 59, P.clayDk, 8, 1);
    hhLine(g, 24, 50, 39, 50, P.umber);
    // neck
    hhPx(g, 28, 41, P.skin, 9, 5); hhPx(g, 28, 41, P.tan, 9, 1);
    // hair back + side volumes
    hhEll(g, 32, 26, 18, 16, P.silverDk);
    hhEll(g, 32, 25, 17, 15, P.silver);
    hhEll(g, 17.5, 33, 4.5, 7, P.silverDk); hhEll(g, 46.5, 33, 4.5, 7, P.silverDk);
    hhEll(g, 18, 32, 3.5, 6, P.silver); hhEll(g, 46, 32, 3.5, 6, P.silver);
    // pencil through the bun (drawn first, so the bun hides its middle): eraser end low-left, point high-right
    hhLine(g, 21, 17, 44, 2, P.gold, 2); hhLine(g, 22, 18, 44, 4, P.clayDk); hhPx(g, 20, 16, P.clay, 2, 3);
    hhPx(g, 44, 1, P.tan, 2, 2); hhPx(g, 46, 0, P.ink, 1, 1);
    // bun
    hhEll(g, 32, 10, 9, 7.5, P.silverDk); hhEll(g, 31.5, 9.5, 8, 6.5, P.silver);
    hhLine(g, 27, 11, 30, 13, P.silverDk); hhLine(g, 31, 7, 36, 10, P.silverDk);
    // face
    hhEll(g, 32, 33.5, 12.8, 12.6, P.brown);
    hhEll(g, 32, 33, 12, 12, P.skin);
    // swept-back hairline
    hhPoly(g, [[19, 31], [20, 22], [26, 17], [32, 16], [38, 17], [44, 22], [45, 31], [42, 25], [36, 22], [32, 23], [28, 22], [22, 25]], P.silver);
    hhLine(g, 24, 22, 30, 19, P.silverDk); hhLine(g, 34, 19, 40, 22, P.silverDk);
    hhOutline(c, P.ink);
    // glasses: round gold rims
    const ring = (cx, cy) => { for (let a = 0; a < 40; a++) { const t = a / 40 * Math.PI * 2; hhPx(g, Math.round(cx + Math.cos(t) * 4.6 - .5), Math.round(cy + Math.sin(t) * 4.6 - .5), P.umber); } };
    ring(26.5, 33.5); ring(37.5, 33.5); hhPx(g, 31, 33, P.umber, 2, 1);
    // eyes inside the glasses
    if (expr === 'blink' || expr === 'happy') { hhPx(g, 25, 34, P.ink, 3, 1); hhPx(g, 36, 34, P.ink, 3, 1); }
    else { hhPx(g, 25, 32, P.ink, 2, 3); hhPx(g, 37, 32, P.ink, 2, 3); hhPx(g, 25, 32, P.cream); hhPx(g, 37, 32, P.cream); }
    // brows and crow's feet
    hhPx(g, 23, 27, P.silverDk, 4, 1); hhPx(g, 37, 27, P.silverDk, 4, 1);
    hhPx(g, 20, 35, P.tan); hhPx(g, 43, 35, P.tan);
    hhPx(g, 32, 37, P.tan, 1, 2); hhPx(g, 22, 38, P.clay, 2, 1); hhPx(g, 40, 38, P.clay, 2, 1);
    // mouth
    const M = HH_MOUTH[{ smile: 'smile', talk: 'talk', blink: 'smile', happy: 'smile' }[expr] || 'smile'];
    hhMap(g, 32 - (M[0].length >> 1), 40, M, { B: P.brown, R: P.clayDk });
  });
}
// pixel strawberry, 32×36
function hhSpriteBerry() {
  return hhSprite('berry', 32, 36, (g, c) => {
    const P = HHP;
    const body = [[16, 34.5], [9, 29], [4.5, 21], [4, 14], [8, 9.5], [16, 8.5], [24, 9.5], [28, 14], [27.5, 21], [23, 29]];
    hhPoly(g, body, P.plum);
    hhPoly(g, body.map(([x, y]) => [15 + (x - 16) * .86, 20 + (y - 21) * .86]), P.red);
    // seeds
    for (let row = 0; row < 6; row++) for (let k = -3; k <= 3; k++) {
      const x = 16 + k * 4 + (row % 2 ? 2 : 0), y = 13 + row * 3.6;
      const inside = Math.abs(x - 16) < 10.5 - Math.max(0, y - 18) * .5;
      if (inside) { hhPx(g, x, y, P.gold); }
    }
    // highlight
    hhPx(g, 8, 13, P.cream, 2, 1); hhPx(g, 7, 14, P.cream, 1, 3); hhPx(g, 9, 12, P.skin, 2, 1);
    // leaf crown and stem
    const leaves = [[16, 11], [5, 9], [11, 7], [9, 3], [15, 6], [16, 2], [17, 6], [23, 3], [21, 7], [27, 9]];
    hhPoly(g, leaves, P.tealDk);
    hhPoly(g, leaves.map(([x, y]) => [16 + (x - 16) * .78, 6.5 + (y - 7) * .7]), P.teal);
    hhLine(g, 16, 5, 18, 0, P.tealDk, 2);
    hhOutline(c, P.ink);
  });
}
// the Trunk of Questions (for the tag), 64×50
function hhSpriteTrunk() {
  return hhSprite('trunk', 64, 50, (g, c) => {
    const P = HHP;
    hhRRect(g, 3, 16, 58, 32, 3, P.umber);          // box
    hhPx(g, 4, 44, P.brown, 56, 3);                  // base shadow
    hhRRect(g, 3, 5, 58, 15, 6, P.brown);           // domed lid
    hhPx(g, 6, 7, P.umber, 52, 2);                   // lid highlight
    hhPx(g, 4, 19, P.tan, 56, 1);                    // lid seam
    for (let x = 8; x < 58; x += 6) hhPx(g, x, 26 + (x % 12 ? 0 : 8), P.brown, 2, 1);   // wood grain
    for (const x of [11, 49]) { hhPx(g, x, 5, P.gold, 4, 43); hhPx(g, x + 3, 5, P.clayDk, 1, 43); hhPx(g, x + 1, 10, P.umber, 1, 1); hhPx(g, x + 1, 38, P.umber, 1, 1); }
    // padlock
    hhPx(g, 27, 11, P.silverDk, 10, 2); hhPx(g, 27, 11, P.silverDk, 2, 8); hhPx(g, 35, 11, P.silverDk, 2, 8);
    hhRRect(g, 25, 18, 14, 13, 2, P.gold); hhPx(g, 26, 19, P.cream, 3, 1);
    hhMap(g, 31, 22, ['.KK.', 'KKKK', '.KK.', '.KK.', '.KK.'], { K: P.ink });
    // question cards peeking out under the lid
    hhPx(g, 42, 0, P.cream, 9, 7); hhPx(g, 45, 2, P.clay, 3, 1); hhPx(g, 47, 3, P.clay, 1, 1); hhPx(g, 46, 5, P.clay, 1, 1);
    hhPx(g, 16, 1, P.parch, 8, 6); hhPx(g, 18, 3, P.teal, 4, 1);
    hhOutline(c, P.ink);
  });
}
// the big red ✗, 52×52
function hhSpriteCross() {
  return hhSprite('cross', 74, 74, (g, c) => {
    const P = HHP, bar = (a) => { const ca = Math.cos(a), sa = Math.sin(a), L = 31, w = 9; return [[-L, -w], [L, -w], [L, w], [-L, w]].map(([x, y]) => [37 + x * ca - y * sa, 37 + x * sa + y * ca]); };
    for (const a of [Math.PI / 4, -Math.PI / 4]) hhPoly(g, bar(a).map(([x, y]) => [x + 1, y + 2]), P.plum);
    for (const a of [Math.PI / 4, -Math.PI / 4]) hhPoly(g, bar(a), P.red);
    hhLine(g, 9, 4, 16, 11, P.skin); hhLine(g, 10, 4, 17, 11, P.skin); hhLine(g, 64, 4, 59, 9, P.skin);
    hhOutline(c, P.ink);
  });
}
// the ✓ for a right answer (teal, cream glint), 40×36
function hhSpriteCheck() {
  return hhSprite('check', 40, 36, (g, c) => {
    const P = HHP, pts = [[3, 19], [10, 13], [16, 20], [32, 3], [38, 9], [16, 32]];
    hhPoly(g, pts.map(([x, y]) => [x + 1, y + 2]), P.tealDk);
    hhPoly(g, pts, P.teal);
    hhLine(g, 6, 18, 10, 15, P.cream); hhLine(g, 31, 6, 34, 4, P.cream);
    hhOutline(c, P.ink);
  });
}
// tiny icons
function hhSpriteButton() { // a brass "hint button"
  return hhSprite('button', 9, 9, (g, c) => { hhEll(g, 4.5, 4.5, 4, 4, HHP.gold); hhPx(g, 3, 3, HHP.umber); hhPx(g, 5, 3, HHP.umber); hhPx(g, 3, 5, HHP.umber); hhPx(g, 5, 5, HHP.umber); hhPx(g, 2, 2, HHP.cream); hhOutline(c, HHP.brown); });
}
function hhSparkle(g, x, y, size, c = HHP.cream, c2 = HHP.gold) { // a 4-point twinkle, size 1..3
  x = hhI(x); y = hhI(y);
  if (size <= 0) return;
  hhPx(g, x, y, c);
  for (let i = 1; i <= size; i++) { const cc = i === size ? c2 : c; hhPx(g, x - i, y, cc); hhPx(g, x + i, y, cc); hhPx(g, x, y - i, cc); hhPx(g, x, y + i, cc); }
}

// ---------------------------------------------------------------------------------------------
// the device and the desk (static, cached at logical resolution)
// ---------------------------------------------------------------------------------------------
function hhDesk() {
  return cached('hh:desk', HH.LW, HH.LH, (g) => {
    g.imageSmoothingEnabled = false;
    const P = HHP, r = rng('hhdesk');
    // warm parchment desk, dithered darker towards the edges
    hhPx(g, 0, 0, P.tan, HH.LW, HH.LH);
    for (let y = 0; y < HH.LH; y += 4) for (let x = 0; x < HH.LW; x += 4) {
      const dx = (x - HH.LW / 2) / (HH.LW / 2), dy = (y - HH.LH / 2) / (HH.LH / 2), d = Math.sqrt(dx * dx * .55 + dy * dy);
      hhDither(g, x, y, 4, 4, P.parch, clamp(.55 - d * .55));
      hhDither(g, x, y, 4, 4, P.umber, clamp((d - .82) * .9));
    }
    // a faint woven cloth: sparse warm stitches
    for (let y = 2; y < HH.LH; y += 8) for (let x = (y / 8 % 2) * 4; x < HH.LW; x += 8) hhPx(g, x, y, mix(P.tan, P.umber, .25));
    // scattered petals on the desk (they foreshadow the shatter)
    const pet = (x, y, a, L) => {
      const pts = []; for (let i = 0; i <= 12; i++) { const s = i / 12, w = Math.sin(Math.PI * s) * L * .32; pts.push([s * L, -w]); } for (let i = 11; i > 0; i--) { const s = i / 12, w = Math.sin(Math.PI * s) * L * .32; pts.push([s * L, w]); }
      const ca = Math.cos(a), sa = Math.sin(a), P2p = pts.map(([u, v]) => [x + u * ca - v * sa, y + u * sa + v * ca]);
      hhPoly(g, P2p.map(([u, v]) => [u + 1, v + 2]), mix(P.tan, P.umber, .5));
      hhPoly(g, P2p, P.clay); hhLine(g, x, y, x + ca * L * .6, y + sa * L * .6, P.clayDk);
    };
    for (const [x, y, a, L] of [[96, 70, .6, 15], [118, 92, 2.2, 12], [60, 330, -.4, 16], [150, 372, 1.3, 12], [640, 60, 2.8, 14], [690, 300, .9, 16], [660, 360, -2.1, 12], [712, 140, 1.9, 11], [44, 190, -1.2, 11]]) pet(x, y, a, L);
    // a pencil
    const pc = (x, y) => {
      for (let i = 0; i < 70; i++) { const px = x + i, py = y - i * .42; hhPx(g, px, py + 2, mix(P.tan, P.umber, .5), 1, 5); }
      for (let i = 0; i < 70; i++) { const px = x + i, py = y - i * .42; hhPx(g, px, py, P.gold, 1, 4); hhPx(g, px, py + 3, P.clayDk, 1, 1); }
      for (let i = 70; i < 78; i++) { const px = x + i, py = y - i * .42; hhPx(g, px, py + (i - 70) * .25, P.skin, 1, 4 - (i - 70) * .45); }
      hhPx(g, x + 78, y - 78 * .42 + 1, P.ink, 2, 1);
      for (let i = -8; i < 0; i++) hhPx(g, x + i, y - i * .42, P.clay, 1, 4);
    };
    pc(70, 262); pc(600, 400);
  });
}
function hhDevice() {
  return cached('hh:device', HH.LW, HH.LH, (g) => {
    g.imageSmoothingEnabled = false;
    const P = HHP, [dx, dy, dw, dh] = HH.dev;
    // soft dithered shadow on the desk
    hhRRect(g, dx + 6, dy + 8, dw, dh, 16, mix(P.tan, P.umber, .55));
    // body
    hhRRect(g, dx - 1, dy - 1, dw + 2, dh + 2, 17, P.ink);
    hhRRect(g, dx, dy, dw, dh, 16, P.tealDk);
    hhRRect(g, dx, dy, dw - 3, dh - 4, 16, P.teal);
    // highlight along the top-left edge (dithered cream)
    const hl = hhScratch('hhhl', dw, dh), hg = hl.getContext('2d'); hg.clearRect(0, 0, dw, dh);
    hhRRect(hg, 0, 0, dw - 3, dh - 4, 16, '#fff'); hg.globalCompositeOperation = 'destination-out'; hhRRect(hg, 3, 3, dw - 3, dh - 4, 16, '#fff'); hg.globalCompositeOperation = 'source-over';
    hg.globalCompositeOperation = 'source-in'; hhDither(hg, 0, 0, dw, dh, P.cream, .5); hg.globalCompositeOperation = 'source-over';
    g.drawImage(hl, dx, dy);
    // screen recesses
    for (const [sx, sy] of [HH.top, HH.bot]) {
      hhRRect(g, sx - 6, sy - 6, HH.SW + 12, HH.SH + 12, 6, P.tealDk);
      hhRRect(g, sx - 5, sy - 5, HH.SW + 10, HH.SH + 10, 5, P.ink);
      hhPx(g, sx - 4, sy + HH.SH + 4, mix(P.teal, P.cream, .25), HH.SW + 8, 1);   // lower lip catches light
    }
    // speaker dots beside the top screen
    for (const side of [0, 1]) for (let j = 0; j < 6; j++) for (let i = 0; i < 2; i++) {
      const x = side ? HH.top[0] + HH.SW + 10 + i * 4 : HH.top[0] - 14 + i * 4, y = HH.top[1] + 70 + j * 6 + (i ? 3 : 0);
      hhPx(g, x, y, P.ink, 2, 2); hhPx(g, x + 1, y + 1, P.tealDk);
    }
    // emblem in the gap between the screens: our eight-point spark
    const ey = HH.top[1] + HH.SH + 8;
    hhText(g, '✷', HH.LW / 2 + 1, ey - 3 + 1, P.tealDk, { align: 'center' });
    hhText(g, '✷', HH.LW / 2, ey - 3, P.cream, { align: 'center' });
    // power lamp
    hhPx(g, HH.bot[0] - 15, HH.bot[1] + 12, P.ink, 4, 4);
  });
}
function hhLamp(lg, on) {
  const x = HH.bot[0] - 14, y = HH.bot[1] + 13;
  hhPx(lg, x, y, on ? HHP.gold : HHP.tealDk, 2, 2);
  if (on) hhPx(lg, x, y, HHP.cream, 1, 1);
}

// ---------------------------------------------------------------------------------------------
// presentation: logical canvas → 1920×1080 (sharp bilinear), plus the handheld finish
// ---------------------------------------------------------------------------------------------
// opts: zoom (1 = whole frame), focus [lx, ly] logical point to keep centred when zoomed, shake [dx,dy] logical px
function hhPresent(g, lg, opts = {}) {
  const { zoom = 1, focus = [HH.LW / 2, HH.LH / 2], shake = [0, 0] } = opts;
  const f = Math.max(2, Math.ceil(HH.S * zoom));
  const up = hhScratch('hhup' + f, HH.LW * f, HH.LH * f), ug = up.getContext('2d');
  const { s, ox, oy } = hhPresentXf(opts);
  // only the logical pixels that land on screen are upscaled (a punched-in frame touches a small part)
  const lx0 = clamp(Math.floor(-ox / s) - 1, 0, HH.LW), ly0 = clamp(Math.floor(-oy / s) - 1, 0, HH.LH);
  const lx1 = clamp(Math.ceil((W - ox) / s) + 1, 0, HH.LW), ly1 = clamp(Math.ceil((H - oy) / s) + 1, 0, HH.LH);
  const lw = lx1 - lx0, lh = ly1 - ly0;
  if (lw <= 0 || lh <= 0) return;
  ug.imageSmoothingEnabled = false; ug.clearRect(0, 0, lw * f, lh * f); ug.drawImage(lg, lx0, ly0, lw, lh, 0, 0, lw * f, lh * f);
  g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(up, 0, 0, lw * f, lh * f, ox + lx0 * s, oy + ly0 * s, lw * s, lh * s);
  g.restore();
}
// screen glass + LCD texture + gentle grade. Drawn at full res over the presented frame.
function hhFinish(g, t, opts = {}) {
  const { zoom = 1, glare = 1 } = opts;
  if (zoom > 1.0001) {   // punched in: the LCD seams between logical pixels, at the presented scale
    const X = hhPresentXf(opts), sw = Math.max(1, X.s * .14);
    g.save(); g.fillStyle = 'rgba(40,24,14,.10)';
    for (const [sx, sy] of [HH.top, HH.bot]) {
      const x0 = X.ox + sx * X.s, y0 = X.oy + sy * X.s, w = HH.SW * X.s, h = HH.SH * X.s;
      if (x0 > W || y0 > H || x0 + w < 0 || y0 + h < 0) continue;
      const ya = Math.max(0, y0), yb = Math.min(H, y0 + h), xa = Math.max(0, x0), xb = Math.min(W, x0 + w);
      for (let i = 0; i <= HH.SW; i++) { const x = x0 + i * X.s; if (x >= xa - 1 && x <= xb) g.fillRect(x - sw / 2, ya, sw, yb - ya); }
      for (let j = 0; j <= HH.SH; j++) { const y = y0 + j * X.s; if (y >= ya - 1 && y <= yb) g.fillRect(xa, y - sw / 2, xb - xa, sw); }
      if (glare) {
        g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
        const gr = g.createLinearGradient(x0, y0, x0 + w * .6, y0 + h);
        gr.addColorStop(0, 'rgba(255,250,235,.09)'); gr.addColorStop(.38, 'rgba(255,250,235,.03)'); gr.addColorStop(.39, 'rgba(255,250,235,0)');
        g.fillStyle = gr; g.fillRect(x0, y0, w, h); g.restore();
      }
    }
    g.restore();
  } else {
    for (const [sx, sy] of [HH.top, HH.bot]) {
      const X = sx * HH.S, Y = sy * HH.S, Wd = HH.SW * HH.S, Hd = HH.SH * HH.S;
      g.save(); g.beginPath(); g.rect(X, Y, Wd, Hd); g.clip();
      // LCD pixel grid: faint dark seams between logical pixels
      g.drawImage(cached('hh:lcd', Wd, Hd, (q) => {
        q.fillStyle = 'rgba(40,24,14,.07)';
        for (let i = 0; i <= HH.SW; i++) q.fillRect(Math.floor(i * HH.S), 0, 1, Hd);
        for (let j = 0; j <= HH.SH; j++) q.fillRect(0, Math.floor(j * HH.S), Wd, 1);
      }), X, Y);
      // glass glare: a soft diagonal sheen + inner shadow at the top
      if (glare) {
        const gr = g.createLinearGradient(X, Y, X + Wd * .6, Y + Hd);
        gr.addColorStop(0, 'rgba(255,250,235,.10)'); gr.addColorStop(.38, 'rgba(255,250,235,.035)'); gr.addColorStop(.39, 'rgba(255,250,235,0)');
        g.fillStyle = gr; g.fillRect(X, Y, Wd, Hd);
        const sh = g.createLinearGradient(0, Y, 0, Y + 14); sh.addColorStop(0, 'rgba(30,18,10,.28)'); sh.addColorStop(1, 'rgba(30,18,10,0)');
        g.fillStyle = sh; g.fillRect(X, Y, Wd, 14);
      }
      g.restore();
    }
  }
  // warm grade: grain on twos + soft vignette (lighter than the anime finish)
  g.save();
  g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .05;
  g.drawImage(grainTexture(boilFrame(t)), 0, 0, W, H);
  g.globalCompositeOperation = 'multiply'; g.globalAlpha = 1;
  g.drawImage(cached('hh:vig', W, H, (q) => {
    const gr = q.createRadialGradient(W / 2, H / 2, H * .42, W / 2, H / 2, H * 1.0);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#c9b49a'); q.fillStyle = gr; q.fillRect(0, 0, W, H);
  }), 0, 0);
  g.restore();
}

// generic frame: draw your own two screens. drawTop/drawBottom(sg, t) draw into a 256×192 canvas.
// opts: power (0..1 screen on), lamp, shake [dx,dy], zoom, focus, finish (default true)
function hhFrameLow(lg, t, drawTop, drawBottom, opts = {}) {
  const { power = 1, lamp = true, shakeScreens = [0, 0] } = opts;
  lg.drawImage(hhDesk(), 0, 0);
  lg.drawImage(hhDevice(), 0, 0);
  hhLamp(lg, lamp);
  const scr = [[HH.top, drawTop, 'hhTop'], [HH.bot, drawBottom, 'hhBot']];
  for (const [[sx, sy], fn, key] of scr) {
    const sc = hhScratch(key, HH.SW, HH.SH), sg = sc.getContext('2d');
    sg.setTransform(1, 0, 0, 1, 0, 0); sg.clearRect(0, 0, HH.SW, HH.SH);
    hhScreenPower(sg, t, power, fn);
    lg.drawImage(sc, sx, sy);
  }
}
function hhFrame(g, t, drawTop, drawBottom, opts = {}) {
  const lg = hhScratch('hhLow', HH.LW, HH.LH).getContext('2d');
  hhFrameLow(lg, t, drawTop, drawBottom, opts);
  hhPresent(g, lg.canvas, opts);
  if (opts.finish !== false) hhFinish(g, t, opts);
}
// screen power-on: dark LCD → cream flash → content dissolves in through a Bayer dither
function hhScreenPower(sg, t, p, fn) {
  const off = mix(HHP.tealDk, HHP.ink, .55);
  if (p <= 0) { hhPx(sg, 0, 0, off, HH.SW, HH.SH); return; }
  if (p < .25) { hhPx(sg, 0, 0, off, HH.SW, HH.SH); const h = hhI(HH.SH * ease.outQ(p / .25)); hhPx(sg, 0, (HH.SH - h) >> 1, HHP.cream, HH.SW, Math.max(2, h)); return; }
  fn(sg, t);
  if (p < 1) hhDither(sg, 0, 0, HH.SW, HH.SH, HHP.cream, 1 - (p - .25) / .75);
}

// ---------------------------------------------------------------------------------------------
// screen building blocks
// ---------------------------------------------------------------------------------------------
function hhPaperBG(sg, base = HHP.cream, dots = HHP.parch) {
  hhPx(sg, 0, 0, base, HH.SW, HH.SH);
  for (let y = 4; y < HH.SH; y += 8) for (let x = 4; x < HH.SW; x += 8) hhPx(sg, x, y, dots);
}
// the problem card on the top screen. C = {num, title, sparks, enter, question:{text,t0,cps}, answer:{label,value,t}, verdict:{t}, footer:{text,t}, hints}
function hhCardScreen(sg, t, C) {
  const P = HHP;
  hhPx(sg, 0, 0, P.parch, HH.SW, HH.SH);
  for (let y = 0; y < HH.SH; y += 2) for (let x = (y % 4) ? 1 : 0; x < HH.SW; x += 6) hhPx(sg, x, y, mix(P.parch, P.tan, .22));
  // paper card with a thin rule border
  hhRRect(sg, 4, 4, 248, 184, 3, P.cream);
  hhPx(sg, 7, 7, P.tan, 242, 1); hhPx(sg, 7, 184, P.tan, 242, 1); hhPx(sg, 7, 7, P.tan, 1, 178); hhPx(sg, 248, 7, P.tan, 1, 178);
  const ent = clamp((t - C.enter) / .35);
  if (ent <= 0) return;
  // header tab slides in from the left: PROBLEM № 001
  const tabW = hhTextWidth('PROBLEM № ' + C.num) + 14, tx = hhI(lerp(-tabW, 0, ease.outC(ent)));
  hhRRect(sg, tx + 2, 11, tabW + 4, 15, 3, P.clayDk);
  hhRRect(sg, tx, 10, tabW + 4, 14, 3, P.clay);
  hhText(sg, 'PROBLEM № ' + C.num, tx + 9, 14, P.cream, { shadow: P.clayDk });
  // sparks (top right)
  const sp = clamp((t - C.enter - .3) / .2);
  if (sp > 0 && C.sparks != null) {
    const s = C.sparks + (C.sparks === 1 ? ' spark' : ' sparks');
    hhText(sg, '✷', 244 - hhTextWidth(s) - 10, 14, P.gold, { shadow: P.umber });
    hhText(sg, s, 244, 14, P.umber, { align: 'right' });
  }
  // title, big
  const tt = clamp((t - C.enter - .15) / .3);
  if (tt > 0) {
    const n = Math.ceil(C.title.length * tt);
    hhText(sg, C.title.slice(0, n), 13, 33, P.clayDk, { scale: 2, shadow: P.tan });
  }
  if (tt >= 1) for (let x = 13; x < 244; x += 3) hhPx(sg, x, 53, P.tan);
  // question, typed
  if (C.question) {
    const Q = hhTypedLines(C.question, t, 228, 2);
    Q.lines.forEach((s, i) => {
      hhText(sg, s, 13, 62 + i * 21, P.ink, { scale: 2, shadow: P.parch });
      const hl = C.question.hl, full = hl ? hhWrap(C.question.text, 228, 2)[i] || '' : '';   // optional key word, re-inked in clay as it types
      if (hl) for (let j = s.indexOf(hl[0]); j >= 0; j = s.indexOf(hl[0], j + 1)) {
        if (full.slice(j, j + hl.length) !== hl) continue;
        const x = 13 + (j ? hhTextWidth(s.slice(0, j), 2) + 2 : 0);
        hhText(sg, s.slice(j, j + hl.length), x, 62 + i * 21, P.clayDk, { scale: 2, shadow: P.parch });
      }
    });
  }
  // answer box
  if (C.answer && t >= C.answer.show) {
    const A = C.answer, bx = 103, by = 128, bw = 50, bh = 30;
    hhText(sg, A.label || 'ANSWER', 128, 118, P.umber, { align: 'center' });
    hhRRect(sg, bx, by + 2, bw, bh, 3, P.tan);
    hhRRect(sg, bx, by, bw, bh, 3, P.brown); hhRRect(sg, bx + 1, by + 1, bw - 2, bh - 2, 2, P.cream);
    const fixed = C.fix && t >= C.fix.t;
    if (fixed) {
      const pop = t - C.fix.t < .08 ? 3 : 2;
      hhText(sg, C.fix.value, 128, by + 15 - 3.5 * pop, P.tealDk, { scale: pop, align: 'center' });
    } else if (A.t != null && t >= A.t) {
      const pop = t - A.t < .08 ? 3 : 2;
      hhText(sg, A.value, 128, by + 15 - 3.5 * pop, P.ink, { scale: pop, align: 'center' });
    } else if (Math.floor(t * 2.5) % 2 === 0) hhText(sg, '?', 128, by + 8, P.tan, { scale: 2, align: 'center' });
    // hint buttons (our own: brass sewing buttons)
    if (C.hints) {
      hhText(sg, 'HINTS', 210, 125, P.umber, { align: 'center' });
      for (let i = 0; i < 3; i++) hhBlit(sg, hhSpriteButton(), 194 + i * 12, 136);
      hhText(sg, 'MEMO', 46, 125, P.umber, { align: 'center' });
      hhPx(sg, 37, 136, P.cream, 18, 12); hhPx(sg, 37, 136, P.tan, 18, 1); hhPx(sg, 37, 147, P.tan, 18, 1); hhPx(sg, 37, 136, P.tan, 1, 12); hhPx(sg, 54, 136, P.tan, 1, 12);
      hhLine(sg, 40, 140, 50, 140, P.tan); hhLine(sg, 40, 143, 47, 143, P.tan);
      hhLine(sg, 49, 145, 56, 134, P.gold, 2); hhPx(sg, 49, 145, P.ink);
    }
  }
  // verdict: big ✗ stamped over the answer + ONCE MORE!
  if (C.fix && t >= C.fix.t) {   // the right answer: the ✗ is gone, a ✓ stamps beside the box
    const dt = t - C.fix.t, sc = dt < 1 / 24 ? 2 : 1, ck = hhSpriteCheck();
    hhBlit(sg, ck, 166 - ck.width * sc / 2 + (sc - 1) * 4, 140 - ck.height * sc / 2, sc);
    const tx = C.fix.text || 'CORRECT!', k = clamp(dt / .25);
    hhText(sg, tx.slice(0, Math.ceil(tx.length * k)), 128, 171, P.tealDk, { scale: 2, align: 'center', shadow: P.parch, wave: i => (dt < 1 ? -Math.max(0, Math.sin(dt * 14 - i * .5)) * 2 : 0) });
  } else if (C.verdict && t >= C.verdict.t) {
    const dt = t - C.verdict.t, s = dt < 1 / 24 ? 3 : dt < 2 / 24 ? 2 : 1, cr = hhSpriteCross();
    hhBlit(sg, cr, 128 - cr.width * s / 2, 136 - cr.height * s / 2, s);
    const om = C.verdict.text || 'ONCE MORE!';
    if (dt > .2) {
      const k = clamp((dt - .2) / .3);
      hhText(sg, om.slice(0, Math.ceil(om.length * k)), 128, 171, P.red, {
        scale: 2, align: 'center', shadow: P.ink,
        wave: i => (dt < 1.2 ? -Math.max(0, Math.sin((dt - .2) * 14 - i * .5)) * 2 : 0),
      });
    }
  }
  // footer (tag): "to be continued…"
  if (C.footer && t >= C.footer.t) {
    const F = C.footer, dt = t - F.t, n = Math.min(F.text.length, Math.floor(dt * 16) + 1);
    const tri = Math.floor(t * 2.5) % 2 === 0;
    hhText(sg, F.text.slice(0, n), 128, 160, P.clayDk, { scale: 2, align: 'center', shadow: P.tan });
    if (n >= F.text.length && tri) hhText(sg, '▶', 128 + hhTextWidth(F.text, 2) / 2 + 6, 163, P.clay);
  }
}
// letter tiles. st(i) → {state: 'idle'|'lit'|'glow', badge: '1'} ; drop-in times per tile
function hhTiles(sg, t, word, x0, y0, opts = {}) {
  const { t0 = 0, step = .07, st = () => ({}), tw = 20, gap = 3 } = opts;
  const P = HHP, letters = [...word];
  letters.forEach((ch, i) => {
    const ti = t0 + i * step; if (t < ti) return;
    const dt = t - ti, drop = dt < .12 ? hhI(-10 * (1 - dt / .12) ** 2) : (dt < .2 ? -1 : 0);
    const S = st(i) || {}, x = x0 + i * (tw + gap), y = y0 + drop + (S.bob || 0);
    const face = S.state === 'lit' ? P.clay : S.state === 'glow' ? P.gold : P.parch;
    const edge = S.state === 'lit' ? P.clayDk : S.state === 'glow' ? P.clayDk : P.tan;
    const fg = S.state === 'lit' ? P.cream : S.state === 'glow' ? P.ink : P.ink;
    hhRRect(sg, x - 1, y - 1, tw + 2, tw + 5, 3, P.ink);
    hhRRect(sg, x, y, tw, tw + 3, 2, edge);
    hhRRect(sg, x, y, tw, tw, 2, face);
    hhPx(sg, x + 2, y + 1, mix(face, '#ffffff', .45), tw - 4, 1);
    if (ch !== ' ') hhText(sg, ch, x + tw / 2 + .5, y + 3, fg, { scale: 2, align: 'center' });
    if (S.badge) {
      const bx = x + tw / 2, by = y0 - 11, bc = S.state === 'glow' ? P.gold : P.clay;
      hhEll(sg, bx, by + 4, 5.5, 5.5, P.ink); hhEll(sg, bx, by + 4, 4.5, 4.5, bc);
      hhText(sg, S.badge, bx + .5, by + 1, S.state === 'glow' ? P.ink : P.cream, { align: 'center' });
    }
  });
}
// a portrait in a frame. who 'claude'|'hilde', expr, bob (px), side 'left'|'right'
function hhPortrait(sg, x, y, who, expr, opts = {}) {
  const P = HHP, { bob = 0, dim = 0 } = opts;
  const bg = who === 'claude' ? P.teal : P.gold, bgDk = who === 'claude' ? P.tealDk : P.clayDk;
  hhRRect(sg, x, y, 68, 68, 4, P.ink);
  hhRRect(sg, x + 1, y + 1, 66, 66, 3, P.brown);
  hhRRect(sg, x + 2, y + 2, 64, 64, 2, bg);
  if (opts.rays != null) {      // realisation burst: radial cream/gold rays behind her
    sg.save(); sg.beginPath(); sg.rect(x + 2, y + 2, 64, 64); sg.clip();
    hhPx(sg, x + 2, y + 2, HHP.gold, 64, 64);
    const cx = x + 34, cy = y + 36, n = 12;
    for (let i = 0; i < n; i++) { const a0 = (i + opts.rays) / n * Math.PI * 2, a1 = a0 + Math.PI / n; hhPoly(sg, [[cx, cy], [cx + Math.cos(a0) * 70, cy + Math.sin(a0) * 70], [cx + Math.cos(a1) * 70, cy + Math.sin(a1) * 70]], HHP.cream); }
    sg.restore();
  } else for (let j = 0; j < 64; j += 4) for (let i = (j / 4 % 2) * 2; i < 64; i += 4) hhPx(sg, x + 2 + i, y + 2 + j, bgDk);
  const spr = who === 'claude' ? hhSpriteClaude(expr) : hhSpriteHilde(expr);
  sg.save(); sg.beginPath(); sg.rect(x + 2, y + 2, 64, 64); sg.clip();
  hhBlit(sg, spr, x + 2, y + 3 + bob);
  sg.restore();
  if (dim) hhDither(sg, x + 2, y + 2, 64, 64, P.tealDk, dim);
}
// dialogue: box with a name tab, typed text and a blinking ▼ when the line is done
function hhDialogue(sg, t, L, opts = {}) {
  const P = HHP, side = L.who === 'hilde' ? 'right' : 'left';
  const px = side === 'left' ? 6 : 182, bx = side === 'left' ? 80 : 6, by = 116, bw = 170, bh = 70;
  // portrait
  const typing = hhTypedLines(L, t, bw - 18, L.scale || 2);
  let expr = L.expr || 'smile';
  if (L.exprAt) for (const [te, e] of L.exprAt) if (t >= te) expr = e;
  const lastCh = L.text[Math.max(0, typing.n - 1)] || ' ';
  const talking = !typing.done && typing.n > 0 && !L.instant;
  if (talking && L.talk !== false && (typing.n >> 1) % 2 === 0 && lastCh !== ' ') expr = L.talkExpr || 'talk';
  if (!talking && (expr === 'smile' || expr === 'think') && hhBlinking(t, L.who)) expr = 'blink';
  const bob = talking ? -((typing.n >> 1) % 2) : (L.bob ? L.bob(t) : 0);
  hhPortrait(sg, px, by - 2, L.who, expr, { bob, rays: L.rays ? Math.floor(t * 12) * .25 : null });
  // box
  hhRRect(sg, bx + 1, by + 2, bw, bh, 4, P.tan);
  hhRRect(sg, bx, by, bw, bh, 4, P.ink);
  hhRRect(sg, bx + 1, by + 1, bw - 2, bh - 2, 3, P.cream);
  hhPx(sg, bx + 4, by + bh - 4, P.parch, bw - 8, 1);
  // name tab
  const nm = HH_SPEAK[L.who] ? HH_SPEAK[L.who].name : L.who.toUpperCase(), nw = hhTextWidth(nm) + 12;
  const tx = side === 'left' ? bx + 8 : bx + bw - 8 - nw, tc = L.who === 'claude' ? P.clay : P.plum;
  hhRRect(sg, tx - 1, by - 11, nw + 2, 14, 3, P.ink);
  hhRRect(sg, tx, by - 10, nw, 13, 2, tc);
  hhText(sg, nm, tx + 6, by - 7, P.cream);
  // text
  const scale = L.scale || 2;
  typing.lines.forEach((s, i) => hhText(sg, s, bx + 9, by + 11 + i * (scale * 10 + 1), L.color || P.ink, { scale, shadow: P.parch, wave: L.wave ? (j => L.wave(t, j)) : null }));
  if (typing.done && L.next !== false && Math.floor(t * 3) % 2 === 0) hhMap(sg, bx + bw - 14, by + bh - 9, ['#####', '.###.', '..#..'], { '#': P.clay });
}
function hhEmptyBox(sg) {   // the dialogue box, waiting
  hhRRect(sg, 7, 118, 244, 70, 4, HHP.tan);
  hhRRect(sg, 6, 116, 244, 70, 4, HHP.ink); hhRRect(sg, 7, 117, 242, 68, 3, HHP.cream);
  hhPx(sg, 10, 182, HHP.parch, 236, 1);
}
function hhBlinking(t, who) { const p = who === 'hilde' ? 3.7 : 2.9, o = who === 'hilde' ? 1.3 : .4; return ((t + o) % p) < .1; }
// active dialogue line at time t
function hhActiveLine(lines, t) { let L = null; for (const l of lines) if (t >= l.t0) L = l; return L; }

// ---------------------------------------------------------------------------------------------
// COLD OPEN — "PROBLEM № 001: Counting Fruit"
// ---------------------------------------------------------------------------------------------
// All event times in seconds from the start of the cold open. Override any of them, or use hhColdOpenRetime.
function hhColdOpenTimeline(over = {}) {
  const T = {
    power: 0.0,          // screens switch on (0.3 s)
    card: 0.22,          // problem card slides in (header, title, sparks)
    berry: 0.3,          // strawberry pops in on the bottom screen
    tiles: 0.38, tileStep: 0.05,  // S T R A W B E R R Y drop in, one per step
    intro: 0.5,          // Hilde: "Problem one!"
    question: 1.5, qcps: 16,      // question typed on the card
    think: 4.55,         // Claude: "Hmm…" while a cursor scans the tiles
    scan: 4.7, scanStep: 0.12,    // cursor hops along the tiles, lighting the R's it finds (only two!)
    answer: 6.05,        // Claude: "Two!"  (answer box shows 2)
    buzz: 6.75,          // big red ✗ + ONCE MORE!
    hilde: 7.65,         // Hilde: "Once more."
    flash: 8.85,         // Claude's eyes flash; the missed R glows
    three: 9.85,         // "Three!" (shouted, instant) — the first sung word
    drop: 10.0,          // the beat drops: the shatter begins
    shatter: 1.4,        // shatter duration (s)
  };
  return Object.assign(T, over);
}
// Re-time from musical anchors: { start, buzz, drop } (seconds, absolute). Everything else scales between them.
function hhColdOpenRetime({ start = 0, buzz, drop } = {}) {
  const D = hhColdOpenTimeline(), out = { ...D };
  const b = buzz == null ? start + D.buzz : buzz, d = drop == null ? b + (D.drop - D.buzz) : drop;
  const k1 = (b - start) / D.buzz, k2 = (d - b) / (D.drop - D.buzz);
  for (const key of Object.keys(D)) {
    if (['tileStep', 'qcps', 'scanStep', 'shatter'].includes(key)) continue;
    const v = D[key];
    out[key] = v <= D.buzz ? start + v * k1 : b + (v - D.buzz) * k2;
  }
  out.qcps = D.qcps / k1; out.tileStep = D.tileStep * k1; out.scanStep = D.scanStep * k1;
  return out;
}
const HH_WORD = 'STRAWBERRY';
function hhColdOpenLines(T) {
  return [
    { who: 'hilde', text: 'Problem one!', t0: T.intro, cps: 16, expr: 'smile' },
    { who: 'claude', text: 'Hmm…', t0: T.think, cps: 10, expr: 'think', talk: false, next: false },
    { who: 'claude', text: 'Two!', t0: T.answer, cps: 14, expr: 'grin', talkExpr: 'grin', exprAt: [[T.buzz, 'shock']], bob: t => (t > T.buzz && t < T.buzz + .4 ? (Math.floor(t * 24) % 2 ? 1 : -1) : 0) },
    { who: 'hilde', text: 'Once more.', t0: T.hilde, cps: 14, expr: 'smile' },
    { who: 'claude', text: '…!', t0: T.flash, cps: 10, expr: 'sparkle', next: false, talk: false },
    { who: 'claude', text: 'Three!', t0: T.three, instant: true, expr: 'shout', next: false, color: HHP.clayDk, scale: 3, rays: true, wave: (t, j) => (t - T.three < .12 ? -2 : 0) },
  ];
}
function hhColdOpenCard(T) {
  return {
    num: '001', title: 'Counting Fruit', sparks: 1, enter: T.card, hints: true,
    question: { text: "How many r's are in the word strawberry?", t0: T.question, cps: T.qcps, hl: 'strawberry' },
    answer: { show: T.card + .5, value: '2', t: T.answer + .1 },
    verdict: { t: T.buzz, text: 'ONCE MORE!' },
    fix: { t: T.three, value: '3', text: 'CORRECT!' },   // on "Three!": the ✗ clears, 3 ✓
  };
}
// which tiles the cursor lit, and when
function hhTileState(T, t) {
  const lit = { 2: 1, 7: 2 };                // she finds the R at 2 and 7… and misses 8
  return (i) => {
    const S = {}, ts = T.scan + i * T.scanStep;
    if (lit[i] && t >= ts) { S.state = 'lit'; S.badge = String(lit[i]); if (t - ts < .1) S.bob = -2; }
    if (T.count3) {   // optional recount after the eye flash: the three R's glow in turn on [t1, t2, t3], the 3rd earns its badge
      const k = [2, 7, 8].indexOf(i);
      if (k >= 0 && t >= T.count3[k]) {
        const dt = t - T.count3[k];
        if (k === 2) { S.state = 'glow'; S.badge = '3'; S.bob = dt < .1 ? -3 : -1; }
        else { S.state = dt < .22 ? 'glow' : 'lit'; if (dt < .1) S.bob = -3; }
      } else if (i === 8 && t >= T.flash) { const on = Math.floor((t - T.flash) * 8) % 2 === 0; S.state = on ? 'glow' : 'idle'; }
      return S;
    }
    if (i === 8 && t >= T.flash) {
      const on = t >= T.three || Math.floor((t - T.flash) * 6) % 2 === 0;
      S.state = on ? 'glow' : 'idle'; S.bob = t >= T.three ? -2 : (on ? -1 : 0);
      if (t >= T.three) S.badge = '3';
    }
    return S;
  };
}
function hhColdOpenTop(T) { const C = hhColdOpenCard(T); return (sg, t) => hhCardScreen(sg, t, C); }
function hhColdOpenBottom(T) {
  const lines = hhColdOpenLines(T);
  return (sg, t) => {
    const P = HHP;
    hhPaperBG(sg);
    // strawberry
    if (t >= T.berry) {
      const dt = t - T.berry, b = hhSpriteBerry(), s = dt < .06 ? 0 : 1;
      const bob = Math.floor(t * 2) % 2;
      if (dt >= .06) hhBlit(sg, b, 128 - b.width / 2, 6 + bob - (dt < .16 ? 3 : 0));
      if (dt < .06) hhSparkle(sg, 128, 24, 3);
      // little twinkles around the berry
      for (const [x, y, ph] of [[104, 12, 0], [154, 30, .5], [100, 36, .25]]) {
        const k = (t * .8 + ph) % 1; hhSparkle(sg, x, y, k < .15 ? 1 : k < .3 ? 2 : k < .4 ? 1 : 0);
      }
    }
    // tiles
    const tx = 14, ty = 58;
    hhTiles(sg, t, HH_WORD, tx, ty, { t0: T.tiles, step: T.tileStep, st: hhTileState(T, t) });
    // scanning cursor (a clay ▼ hopping along the tiles)
    const si = Math.floor((t - T.scan) / T.scanStep);
    if (t >= T.scan && si < HH_WORD.length + 1 && t < T.answer + .2) {
      const i = Math.min(si, HH_WORD.length - 1), x = tx + i * 23 + 10, hop = ((t - T.scan) / T.scanStep) % 1 < .35 ? -2 : 0;
      hhMap(sg, x - 3, ty - 9 + hop - 4, ['KKKKKKK', 'KCCCCCK', '.KCCCK.', '..KCK..', '...K...'], { K: P.ink, C: P.clay });
    }
    // sparkles around the missed R
    if (t >= T.flash) {
      const x = tx + 8 * 23 + 10, y = ty + 10;
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + t * 3, r = 15 + 2 * Math.sin(t * 9 + k); hhSparkle(sg, x + Math.cos(a) * r, y + Math.sin(a) * r * .8, 1 + ((Math.floor(t * 12) + k) % 3 === 0 ? 1 : 0)); }
    }
    // dialogue
    const L = hhActiveLine(lines, t);
    if (L) {
      hhDialogue(sg, t, L);
      if (L.expr === 'sparkle' || L.expr === 'shout') {
        // eye flash: alternate star frames + twinkles around the portrait
        const fr = Math.floor(t * 8) % 2;
        if (L.expr === 'sparkle') {
          const dt0 = t - L.t0;
          hhPortrait(sg, 6, 114, 'claude', fr ? 'sparkle2' : 'sparkle', { rays: dt0 < .6 ? Math.floor(dt0 * 12) * .25 : null });
          const ph = Math.floor(dt0 * 12) % 4;               // kira! glints on both eyes
          hhSparkle(sg, 32, 147, [4, 3, 2, 3][ph]); hhSparkle(sg, 45, 147, [2, 3, 4, 3][ph]);
        }
        const dt = t - L.t0;
        if (dt < .1) hhDither(sg, 8, 116, 64, 64, P.cream, 1 - dt / .1);
        for (const [x, y, ph] of [[14, 122, 0], [62, 126, .33], [58, 168, .66], [12, 160, .5]]) { const k = (t * 2 + ph) % 1; hhSparkle(sg, x, y, k < .3 ? 2 : k < .5 ? 1 : 0); }
      }
    } else if (t >= T.card) hhEmptyBox(sg);
  };
}
// the cold-open frame in logical pixels (768×432)
function hhColdOpenLow(lg, t, T = hhColdOpenTimeline()) {
  const power = clamp((t - T.power) / .3);
  hhFrameLow(lg, t, hhColdOpenTop(T), hhColdOpenBottom(T), { power, lamp: t >= T.power });
}
// camera: a slow push-in, and a punch-in on the top screen when the ✗ lands (back to 1.0 before the drop)
function hhColdOpenCam(T, t) {
  const push = 1 + .03 * tw(t, T.card, T.buzz - T.card, ease.inOutQ);
  const punch = t < T.buzz ? 0 : t < T.buzz + 3 / 24 ? (t - T.buzz) / (3 / 24) : 1 - tw(t, T.hilde - .2, .9, ease.inOutC);
  const z = lerp(push, 1.12, punch * (t < T.flash ? 1 : 0));
  const back = 1 - tw(t, T.flash - .5, .45, ease.inOutQ);   // be at exactly 1.0 for the drop
  const zoom = t >= T.flash ? 1 + (z - 1) * back : z;
  const fy = lerp(HH.LH / 2, HH.top[1] + HH.SH * .62, punch);
  return { zoom: Math.max(1, zoom), focus: [HH.LW / 2, fy] };
}
function hhColdOpenShake(T, t) {
  const dt = t - T.buzz;
  if (dt >= 0 && dt < .3) { const k = Math.floor(dt * 24); return [[2, 0], [-2, 1], [1, -1], [-1, 0], [1, 1], [0, 0], [0, 0]][k] || [0, 0]; }
  return [0, 0];
}
// The whole cold open. opts.drawFull(g, t) draws the full-res frame revealed by the shatter.
function drawColdOpen(g, t, T = hhColdOpenTimeline(), opts = {}) {
  const lgc = hhScratch('hhLow', HH.LW, HH.LH), lg = lgc.getContext('2d');
  if (t < T.drop) {
    hhColdOpenLow(lg, t, T);
    const cam = opts.camera === false ? { zoom: 1 } : hhColdOpenCam(T, t);
    hhPresent(g, lgc, { shake: hhColdOpenShake(T, t), ...cam, ...opts.present });
    hhFinish(g, t, { shake: hhColdOpenShake(T, t), ...cam, ...opts.present });
    return;
  }
  const k = (t - T.drop) / T.shatter;
  const frozen = cached('hh:freeze:' + JSON.stringify(T), HH.LW, HH.LH, (q) => { q.imageSmoothingEnabled = false; hhColdOpenLow(q, T.drop - 1e-4, T); });
  hhShatter(g, k, (gg) => (opts.drawFull ? opts.drawFull(gg, t) : hhPlaceholderFull(gg, t)), { low: frozen, t, ...opts.shatter });
}

// ---------------------------------------------------------------------------------------------
// THE SHATTER — the low-res image breaks into pixels; some pixels become clay sunflower petals and
// blow away on the wind, revealing the full-resolution frame underneath.
//   k: 0..1 progress. drawFull(g): draws the frame underneath (full res).
//   opts.low: 768×432 logical canvas to shatter (default: the frozen cold-open frame)
//   opts.origin [lx,ly]: where the break starts (default: Claude's eyes on the bottom screen)
//   opts.block (logical px per shard, default 3), opts.petals (fraction of shards that become petals, .14),
//   opts.wind [x,y] px over the shard's life, opts.flash (cream flash on the drop, default true), opts.seed
//   opts.present {zoom, focus, shake}: break the frame as framed by hhPresent (so a punched-in shot shatters in place);
//   petals scale up with the zoom (opts.petalScale overrides). Petals are clay #d97757 with #b0532f undersides.
// ---------------------------------------------------------------------------------------------
const _hhShatterData = new WeakMap();
function hhShatterPrep(low, block, origin, seed, petals) {
  let byKey = _hhShatterData.get(low); if (!byKey) { byKey = {}; _hhShatterData.set(low, byKey); }
  const key = [block, origin.join(','), seed, petals].join('|');
  if (byKey[key]) return byKey[key];
  const d = low.getContext('2d').getImageData(0, 0, low.width, low.height).data;
  const N = makeNoise(seed), r = rng(seed), nx = Math.ceil(low.width / block), ny = Math.ceil(low.height / block);
  const maxD = Math.hypot(Math.max(origin[0], low.width - origin[0]), Math.max(origin[1], low.height - origin[1]));
  const shards = [];
  const petalCols = ['#d97757', '#d97757', '#dd7f5a', '#d46f4e', '#e0865f', '#cf6a49'];   // clay; undersides #b0532f
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = i * block, y = j * block, cx = Math.min(low.width - 1, x + (block >> 1)), cy = Math.min(low.height - 1, y + (block >> 1));
    const p = (cy * low.width + cx) * 4;
    const dist = Math.hypot(x - origin[0], y - origin[1]) / maxD;
    const tau = clamp(.42 * Math.pow(dist, .85) + .16 * (N.fbm(i * .07, j * .07, 3) - .5) + .02 * r(), 0, .5);
    const ang = Math.atan2(y - origin[1], x - origin[0]);
    shards.push({
      x, y, tau, col: `rgb(${d[p]},${d[p + 1]},${d[p + 2]})`,
      vx: Math.cos(ang) * r.range(180, 560), vy: Math.sin(ang) * r.range(180, 520) - r.range(40, 260),
      spin: r.range(-9, 9), ph: r() * 6.28, flut: r.range(5, 13),
      petal: r() < petals, L: r.range(18, 38), pc: r.pick(petalCols), life: r.range(.4, .5),
      turb: r.range(.5, 1.5),
    });
  }
  shards.sort((a, b) => a.tau - b.tau);
  return (byKey[key] = { shards, nx, ny });
}
function hhPetalPath(g, L) {
  const w = L * .36;
  g.beginPath(); g.moveTo(-L * .5, 0);
  g.bezierCurveTo(-L * .25, -w, L * .25, -w * 1.05, L * .5, -w * .1);
  g.quadraticCurveTo(L * .56, 0, L * .5, w * .1);
  g.bezierCurveTo(L * .25, w * 1.05, -L * .25, w, -L * .5, 0);
  g.closePath();
}
// the screen transform hhPresent uses: logical (lx, ly) → screen (ox + lx * s, oy + ly * s)
function hhPresentXf(opts = {}) {
  const { zoom = 1, focus = [HH.LW / 2, HH.LH / 2], shake = [0, 0] } = opts;
  const s = HH.S * zoom;
  let ox = W / 2 - focus[0] * s, oy = H / 2 - focus[1] * s;
  ox = clamp(ox, W - HH.LW * s, 0); oy = clamp(oy, H - HH.LH * s, 0);
  return { s, ox: ox + shake[0] * s, oy: oy + shake[1] * s };
}
function hhShatter(g, k, drawFull, opts = {}) {
  const { low, block = 3, origin = [HH.bot[0] + 14 + 8 * 23 + 10, HH.bot[1] + 68], petals = .09, wind = [1500, -700], flash = true, seed = 'hhshatter', present = {} } = opts;
  drawFull(g);
  if (k >= 1 || !low) return;
  k = Math.max(0, k);
  const D = hhShatterPrep(low, block, origin, seed, petals);
  const X = hhPresentXf(present), S = X.s, zk = S / HH.S, ps = opts.petalScale ?? (1 + (zk - 1) * .55), vs = 1 + (zk - 1) * .35;
  // what's still intact
  const m = hhScratch('hhShatterMask', HH.LW, HH.LH), mg = m.getContext('2d');
  mg.globalCompositeOperation = 'source-over'; mg.clearRect(0, 0, HH.LW, HH.LH); mg.drawImage(low, 0, 0);
  let i = 0; const sh = D.shards;
  for (; i < sh.length && sh[i].tau <= k; i++) mg.clearRect(sh[i].x, sh[i].y, block, block);
  // a hairline of light along the breaking front
  mg.globalCompositeOperation = 'source-atop'; mg.fillStyle = HHP.cream;
  for (let j = i; j < sh.length && sh[j].tau <= k + .012; j++) mg.fillRect(sh[j].x, sh[j].y, block, block);
  mg.globalCompositeOperation = 'source-over';
  hhPresent(g, m, present);
  // flying shards → petals
  const bs = block * S;
  g.save();
  for (let j = 0; j < i; j++) {
    const s = sh[j], u = (k - s.tau) / s.life;
    if (u >= 1) continue;
    const e = u, x0 = X.ox + (s.x + block / 2) * S, y0 = X.oy + (s.y + block / 2) * S;
    if (x0 < -400 || x0 > W + 400 || y0 < -400 || y0 > H + 400) continue;   // off-frame in a punched-in shot
    if (!s.petal) {   // plain pixel: pops loose, drifts a little, shrinks away
      const q = 1 - u / .16; if (q <= 0) continue;
      const x = x0 + s.vx * vs * e * .35 + wind[0] * e * e * .15, y = y0 + s.vy * vs * e * .35 + 260 * e * e;
      const sz = bs * (u < .08 ? 1 : q);
      g.globalAlpha = 1; g.fillStyle = s.col; g.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      continue;
    }
    // petal: pixel square for a moment, then it blooms into a petal and tumbles
    const x = x0 + s.vx * vs * e + wind[0] * e * e * .5 + Math.sin(e * 7 + s.ph) * 30 * s.turb * e;
    const y = y0 + s.vy * vs * e + wind[1] * e * e * .5 + Math.cos(e * 5 + s.ph) * 22 * s.turb * e;
    const morph = clamp(u / .22);
    if (morph < 1) { g.globalAlpha = 1 - morph; g.fillStyle = s.col; const sz = bs * (1 + morph * .6); g.fillRect(x - sz / 2, y - sz / 2, sz, sz); }
    const L = s.L * ps * ease.outQ(morph), fade = 1 - clamp((u - .7) / .3);
    if (L < 1) continue;
    const flip = Math.cos(s.ph + s.flut * e), under = flip < 0;   // tumbling: the darker underside shows half the time
    g.globalAlpha = morph * fade;
    g.setTransform(1, 0, 0, 1, x, y); g.rotate(s.ph + s.spin * e); g.scale(1, .3 + .7 * Math.abs(flip));
    hhPetalPath(g, L); g.fillStyle = under ? '#b0532f' : s.pc; g.fill();
    g.globalAlpha = morph * fade * (under ? .35 : .5); g.strokeStyle = under ? '#7e3820' : '#a9472c'; g.lineWidth = 1.2 * Math.max(1, ps * .8);
    g.beginPath(); g.moveTo(-L * .42, 0); g.quadraticCurveTo(0, -L * .04, L * .32, 0); g.stroke();
    if (!under) {
      g.globalAlpha = morph * fade * .3; g.fillStyle = '#ffe6cc';
      g.beginPath(); g.ellipse(-L * .08, -L * .12, L * .2, L * .06, -.15, 0, 7); g.fill();
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
  }
  g.restore();
  // flash frames on the drop
  if (flash && k < .05) { g.save(); g.globalAlpha = (1 - k / .05) * .85; g.fillStyle = '#fff6e4'; g.fillRect(0, 0, W, H); g.restore(); }
}

// placeholder full-res frame for demos: warm watercolour wash + "ANIME OP"
function hhPlaceholderFull(g, t) {
  g.drawImage(cached('hh:placeholder', W, H, (q) => {
    q.drawImage(paperTexture('sheet'), 0, 0);
    wash(q, polyRect(-100, -100, W + 200, 640), '#f2b48a', { seed: 'phsky', layers: 30, alpha: .06, spread: .3 });
    wash(q, polyRect(-100, 380, W + 200, 300), '#e9c79a', { seed: 'phmid', layers: 26, alpha: .05, spread: .3 });
    wash(q, polyRect(-100, 640, W + 200, 600), '#8fa27c', { seed: 'phhill', layers: 34, alpha: .06, spread: .25 });
    wash(q, polyCircle(1460, 300, 180, 180, 30), '#fbe2b0', { seed: 'phsun', layers: 24, alpha: .07, spread: .4 });
    wash(q, polyRect(300, 700, 600, 500), '#4f7d78', { seed: 'phteal', layers: 20, alpha: .05, spread: .5 });
  }), 0, 0);
  const z = 1 + .03 * Math.min(1, Math.max(0, t - 10));
  g.save(); g.translate(W / 2, H / 2); g.scale(z, z);
  g.font = font(230, 'Fraunces', 800); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(122,82,51,.25)'; g.fillText('ANIME OP', 8, 12);
  g.fillStyle = PAL.clayDeep; g.fillText('ANIME OP', 0, 0);
  g.font = font(44, 'EB Garamond', 500, 'italic'); g.fillStyle = PAL.inkSoft; g.fillText('(the full-resolution frame goes here)', 0, 150);
  g.restore();
  finishFrame(g, t);
}

// ---------------------------------------------------------------------------------------------
// THE TAG — "PROBLEM № ∞" · Hilde: "Ready?" · Claude: "Ready!" · "to be continued…"
// ---------------------------------------------------------------------------------------------
function hhTagTimeline(over = {}) {
  return Object.assign({
    start: 0,            // absolute time of the tag's first frame
    power: 0.0, card: 0.4, trunk: 0.7,
    question: 1.2, qcps: 17,
    ready: 3.3,          // Hilde: "Ready?"
    reply: 4.3,          // Claude: "Ready!"
    footer: 5.3,         // "to be continued…"
    off: 7.6,            // screens power down (set to Infinity to hold)
    title: 'The Next One', question_text: 'What shall we find out next?',
  }, over);
}
function hhTagAbs(T) { const o = { ...T }; for (const k of ['power', 'card', 'trunk', 'question', 'ready', 'reply', 'footer', 'off']) o[k] = T.start + T[k]; return o; }
function hhTagLines(A) {
  return [
    { who: 'hilde', text: 'Ready?', t0: A.ready, cps: 12, expr: 'smile' },
    { who: 'claude', text: 'Ready!', t0: A.reply, cps: 12, expr: 'grin', talkExpr: 'grin', next: false },
  ];
}
function hhTagLow(lg, t, T = hhTagTimeline()) {
  const A = hhTagAbs(T), lines = hhTagLines(A);
  const C = { num: '∞', title: T.title, sparks: null, enter: A.card, question: { text: T.question_text, t0: A.question, cps: T.qcps }, footer: { text: 'to be continued…', t: A.footer } };
  const top = (sg, tt) => { hhCardScreen(sg, tt, C); if (C.sparks == null && tt >= A.card + .3) { hhText(sg, '✷ ∞ sparks', 244, 14, HHP.umber, { align: 'right' }); } };
  const bot = (sg, tt) => {
    hhPaperBG(sg);
    if (tt >= A.trunk) {
      const tr = hhSpriteTrunk(), dt = tt - A.trunk, hop = dt < .15 ? -3 : (Math.floor(tt * 1.5) % 2 ? -1 : 0);
      hhBlit(sg, tr, 128 - tr.width / 2, 8 + hop);
      for (const [x, y, ph] of [[86, 18, 0], [172, 30, .4], [160, 8, .7], [90, 50, .2]]) { const k = (tt * .9 + ph) % 1; hhSparkle(sg, x, y, k < .15 ? 1 : k < .3 ? 2 : k < .4 ? 1 : 0); }
      hhText(sg, 'THE TRUNK OF QUESTIONS', 128, 66, HHP.umber, { align: 'center' });
      for (let x = 60; x < 196; x += 3) hhPx(sg, x, 77, HHP.tan);
      hhText(sg, 'NOT YET OPENED', 128, 84, HHP.tan, { align: 'center' });
    }
    const L = hhActiveLine(lines, tt);
    if (L) { hhDialogue(sg, tt, L); if (L.who === 'claude' && tt > L.t0 + .3) for (const [x, y, ph] of [[14, 122, 0], [62, 126, .33], [58, 168, .66]]) { const k = (tt * 2 + ph) % 1; hhSparkle(sg, x, y, k < .3 ? 2 : k < .5 ? 1 : 0); } }
    else if (tt >= A.card) hhEmptyBox(sg);
  };
  const power = tt => tt >= A.off ? 1 - clamp((tt - A.off) / .5) : clamp((tt - A.power) / .45);
  hhFrameLow(lg, t, top, bot, { power: power(t), lamp: t >= A.power && t < A.off + .5 });
}
function drawHandheldTag(g, t, T = hhTagTimeline(), opts = {}) {
  const lgc = hhScratch('hhLow', HH.LW, HH.LH);
  hhTagLow(lgc.getContext('2d'), t, T);
  hhPresent(g, lgc, opts.present || {});
  hhFinish(g, t);
}

// ---------------------------------------------------------------------------------------------
// SOUND: blips and cues (derived from the same schedules the drawing uses)
// ---------------------------------------------------------------------------------------------
// which: 'coldopen' (T from hhColdOpenTimeline) or 'tag' (T from hhTagTimeline). Spaces get no blip.
function hhBlips(T = hhColdOpenTimeline(), which = 'coldopen') {
  const out = [], push = (speaker, L, until = Infinity) => {
    const sch = hhLineSched(L); [...L.text].forEach((ch, i) => { if (ch !== ' ' && sch[i] < until) out.push({ t: +sch[i].toFixed(4), speaker, ch, pitch: HH_SPEAK[speaker].pitch, line: L.text }); });
  };
  if (which === 'tag') {
    const A = hhTagAbs(T);
    push('card', { text: T.question_text, t0: A.question, cps: T.qcps });
    hhTagLines(A).forEach(L => push(L.who, L));
  } else {
    const C = hhColdOpenCard(T); push('card', C.question);
    const lines = hhColdOpenLines(T);
    lines.forEach((L, i) => { if (!L.instant) push(L.who, L, i + 1 < lines.length ? lines[i + 1].t0 : Infinity); });
  }
  return out.sort((a, b) => a.t - b.t);
}
function hhCues(T = hhColdOpenTimeline(), which = 'coldopen') {
  if (which === 'tag') {
    const A = hhTagAbs(T);
    return [{ t: A.power, cue: 'power-on' }, { t: A.card, cue: 'card-swoosh' }, { t: A.trunk, cue: 'pop' }, { t: A.footer, cue: 'to-be-continued' }, { t: A.off, cue: 'power-off' }];
  }
  const out = [{ t: T.power, cue: 'power-on' }, { t: T.card, cue: 'card-swoosh' }, { t: T.berry, cue: 'pop' }];
  for (let i = 0; i < HH_WORD.length; i++) out.push({ t: T.tiles + i * T.tileStep, cue: 'tile-tick' });
  for (let i = 0; i < HH_WORD.length; i++) out.push({ t: T.scan + i * T.scanStep, cue: [2, 7].includes(i) ? 'count-ding' : 'cursor-tick' });
  out.push({ t: T.answer + .1, cue: 'answer-enter' }, { t: T.buzz, cue: 'buzzer' }, { t: T.buzz + .2, cue: 'once-more-jingle' },
    { t: T.flash, cue: 'sparkle' }, { t: T.three, cue: 'shout-three' }, { t: T.drop, cue: 'shatter' });
  if (T.count3) T.count3.forEach((c, k) => out.push({ t: c, cue: 'recount-ding-' + (k + 1) }));
  return out.sort((a, b) => a.t - b.t).map(c => ({ ...c, t: +c.t.toFixed(4) }));
}
