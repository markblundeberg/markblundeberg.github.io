// bg.js — painted watercolour/gouache backgrounds. No outlines.
// Every painting is built once into cached layer canvases (sky / far / mid / near) and composited per
// frame with parallax. Animated bits (clouds, lamps, windows, glints, windmill, clock hands) are cheap
// per-frame draws. All randomness is seeded. Public API at the bottom of the file (search "PUBLIC API").

const BGW = (() => {
  // ---------------------------------------------------------------- canvases
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); c.getContext('2d', { willReadFrequently: CPU }); return c; };
  const CPU = false; // software canvases: much faster than emulated-GPU canvases for many composite ops in headless Chrome
  const _scr = new Map();
  // reusable scratch canvas by slot (grown as needed, cleared)
  function scratch(slot, w, h) {
    w = Math.max(1, Math.ceil(w)); h = Math.max(1, Math.ceil(h));
    let c = _scr.get(slot);
    if (!c || c.width < w || c.height < h) { c = mk(Math.max(w, c ? c.width : 0), Math.max(h, c ? c.height : 0)); _scr.set(slot, c); }
    const g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.filter = 'none';
    g.clearRect(0, 0, Math.min(c.width, w + 2), Math.min(c.height, h + 2));
    return c;
  }

  // ---------------------------------------------------------------- SVG filters (wobbly wet edges)
  // Injected once into the DOM so ctx.filter = 'url(#wcw3)' displaces edges with turbulence.
  let svgOK = false;
  // tile size of the displacement noise for wobble k (powers of two so boxes can align to it)
  const wobTile = k => k <= 2 ? 128 : k <= 5 ? 256 : k <= 12 ? 512 : 1024;
  // Edge wobble = feDisplacementMap driven by a precomputed noise tile (feImage + feTile): ~7x faster
  // than feTurbulence. Called at script load so the data-URI image has decoded before the first frame.
  function ensureSVG() {
    if (svgOK || typeof document === 'undefined' || !document.body) return svgOK;
    const n = document.createElement('canvas'); n.width = n.height = 256;
    const ng = n.getContext('2d'), id = ng.createImageData(256, 256), N1 = makeNoise('wobX'), N2 = makeNoise('wobY');
    // tileable: lattice period 256/16 = 16 cells
    const per = (N, x, y) => { let s = 0, a = .5, f = 1, t = 0; for (let o = 0; o < 3; o++) { const P = 16 * f, u = x / 256 * P, v = y / 256 * P; const xi = Math.floor(u), yi = Math.floor(v), xf = u - xi, yf = v - yi, sm = k => k * k * (3 - 2 * k); const c = (i, j) => N(((i % P) + P) % P + o * 37, ((j % P) + P) % P + o * 53) ; s += a * lerp(lerp(c(xi, yi), c(xi + 1, yi), sm(xf)), lerp(c(xi, yi + 1), c(xi + 1, yi + 1), sm(xf)), sm(yf)); t += a; a *= .5; f *= 2; } return s / t; };
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { const i = (y * 256 + x) * 4; id.data[i] = 255 * clamp(.5 + (per(N1, x, y) - .5) * 1.8); id.data[i + 1] = 255 * clamp(.5 + (per(N2, x, y) - .5) * 1.8); id.data[i + 2] = 0; id.data[i + 3] = 255; }
    ng.putImageData(id, 0, 0);
    const url = n.toDataURL();
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    let s = '';
    for (const k of [1, 2, 3, 5, 8, 12, 20, 30]) {
      const tile = wobTile(k);
      s += `<filter id="wcw${k}" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feImage href="${url}" x="0" y="0" width="${tile}" height="${tile}" preserveAspectRatio="none" result="img"/><feTile in="img" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="${k * 2}" xChannelSelector="R" yChannelSelector="G"/>
      </filter>`;
    }
    for (const k of [1, 2, 3, 4, 6]) s += `<filter id="wce${k}" x="-5%" y="-5%" width="110%" height="110%"><feMorphology operator="erode" radius="${k}"/></filter>`;
    s += `<filter id="wcboost" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="table" tableValues="0 0.34 0.58 0.75 0.86 0.93 0.97 0.99 1 1"/></feComponentTransfer></filter>`;
    svg.innerHTML = s;
    document.body.appendChild(svg);
    svgOK = true;
    return svgOK;
  }

  // ---------------------------------------------------------------- textures
  // low-frequency noise, computed at 1/4 res and scaled up. grey value in rgb and alpha.
  function smoothNoiseCanvas(key, w, h, cell, oct = 4, seed = 'n', contrast = 1) {
    return cached('wcN:' + key + w + 'x' + h + ':' + cell + oct + seed + contrast, w, h, (g) => {
      const f = 4, sw = Math.ceil(w / f), sh = Math.ceil(h / f), N = makeNoise(seed);
      const s = mk(sw, sh), sg = s.getContext('2d'), img = sg.createImageData(sw, sh), d = img.data;
      for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
        let v = N.fbm(x * f / cell, y * f / cell, oct);
        v = clamp(.5 + (v - .5) * 2.2 * contrast);
        const i = (y * sw + x) * 4; d[i] = d[i + 1] = d[i + 2] = 255 * v; d[i + 3] = 255 * v;
      }
      sg.putImageData(img, 0, 0);
      g.imageSmoothingQuality = 'high';
      g.drawImage(s, 0, 0, w, h);
    });
  }
  // tileable high-frequency textures (period 512), black with alpha
  function grainTile(kind = 'gran') {
    return cached('wcG:' + kind, 512, 512, (g) => {
      const N = makeNoise('gt' + kind), r = rng('gtr' + kind), img = g.createImageData(512, 512), d = img.data;
      for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
        let v;
        if (kind === 'gran') {         // clumpy pigment granules
          const a = N(x / 2, y / 2), b = N(x / 4 + 31, y / 4 + 17), c = N(x / 8 + 7, y / 8 + 3);
          v = clamp((a * .3 + b * .4 + c * .3 - .56) * 4.5 + (r() - .5) * .15);
        } else if (kind === 'tooth') { // paper peaks (dry-brush skips, lifting)
          const a = N(x / 2 + 50, y / 2 + 9), b = N(x / 1 + 3, y / 1 + 5);
          v = clamp((a * .6 + b * .4 - .52) * 4);
        } else if (kind === 'streak') { // horizontal dry-brush drag
          const a = N(x / 32, y / 1.5 + 11), b = N(x / 8 + 5, y / 1 + 3);
          v = clamp((a * .7 + b * .3 - .5) * 5);
        } else {                        // 'fine' sand
          v = clamp(.5 + (r() - .5) * 1.4 + (N(x, y) - .5));
          v = v > .62 ? (v - .62) * 2.6 : 0;
        }
        const i = (y * 512 + x) * 4; d[i] = d[i + 1] = d[i + 2] = 0; d[i + 3] = 255 * v;
      }
      g.putImageData(img, 0, 0);
    });
  }
  const _pats = {};
  function pattern(g, kind) { return _pats[kind] || (_pats[kind] = g.createPattern(grainTile(kind), 'repeat')); }
  // quarter-resolution noise (drawn scaled ×4 → smooth)
  function lowNoise(seed, w, h, cell, contrast = 1) {
    const sw = Math.ceil(w / 4), sh = Math.ceil(h / 4);
    return cached('wcLN:' + seed + sw + 'x' + sh + cell + contrast, sw, sh, (g) => {
      const N = makeNoise(seed), img = g.createImageData(sw, sh), d = img.data;
      for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const v = clamp(.5 + (N.fbm(x * 4 / cell, y * 4 / cell, 4) - .5) * 2.2 * contrast); const i = (y * sw + x) * 4; d[i] = d[i + 1] = d[i + 2] = 255 * v; d[i + 3] = 255 * v; }
      g.putImageData(img, 0, 0);
    });
  }

  // warm watercolour paper (cheap: flat + mottle + tooth), opaque
  function paper(w, h, base = '#f7efdc', seed = 'pp') {
    return cached('wcPaper:' + w + 'x' + h + base + seed, w, h, (g) => {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = 'multiply';
      g.globalAlpha = .07; g.drawImage(smoothNoiseCanvas('pap', w, h, 380, 4, seed), 0, 0);
      g.globalAlpha = .07; g.fillStyle = pattern(g, 'fine'); g.fillRect(0, 0, w, h);
      g.globalAlpha = .05; g.fillStyle = pattern(g, 'tooth'); g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    });
  }

  // bounding box of painted alpha in a canvas region (sampled at 1/8)
  function alphaBox(c, w, h, margin = 0) {
    const f = 8, sw = Math.ceil(w / f), sh = Math.ceil(h / f);
    const s = scratch('ab', sw, sh), sg = s.getContext('2d');
    sg.drawImage(c, 0, 0, w, h, 0, 0, sw, sh);
    const d = sg.getImageData(0, 0, sw, sh).data;
    let x0 = sw, y0 = sh, x1 = -1, y1 = -1;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (d[(y * sw + x) * 4 + 3] > 0) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    const bx = Math.max(0, x0 * f - f - margin), by = Math.max(0, y0 * f - f - margin);
    return [bx, by, Math.min(w, (x1 + 2) * f + margin) - bx, Math.min(h, (y1 + 2) * f + margin) - by];
  }

  // ---------------------------------------------------------------- geometry
  const P = {
    rect: (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]],
    circ: (cx, cy, rx, ry = rx, n = 28, rot = 0) => polyCircle(cx, cy, rx, ry, n, rot),
  };
  // jitter a polygon's edges: subdivide + gaussian (absolute px), keeps architecture straight-ish
  function rough(poly, seed, px = 1.5, step = 18, closed = true) {
    const r = rng(seed), out = [];
    const n = closed ? poly.length : poly.length - 1;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const k = Math.max(1, Math.round(L / step));
      for (let j = 0; j < k; j++) {
        const u = j / k;
        out.push([lerp(a[0], b[0], u) + r.gauss() * px * (j ? 1 : .3), lerp(a[1], b[1], u) + r.gauss() * px * (j ? 1 : .3)]);
      }
    }
    if (!closed) out.push(poly[poly.length - 1]);
    return out;
  }
  // grow a convex-ish polygon outward by px (from its centroid) — overlapping washes, no paper seams
  function inflate(p, px) { const cx = p.reduce((a, q) => a + q[0], 0) / p.length, cy = p.reduce((a, q) => a + q[1], 0) / p.length; return p.map(([x, y]) => { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1; return [x + dx / d * px, y + dy / d * px]; }); }
  function fillP(g, p, col) { if (col) g.fillStyle = col; tracePoly(g, p); g.fill(); }
  function blob(g, x, y, rx, ry, col, a0 = 1, a1 = 0) {
    g.save(); g.translate(x, y); g.scale(1, ry / rx);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, rgba(col, a0)); gr.addColorStop(1, rgba(col, a1));
    g.fillStyle = gr; g.fillRect(-rx, -rx, rx * 2, rx * 2); g.restore();
  }
  function vgrad(g, x0, y0, x1, y1, stops) {
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([k, c]) => gr.addColorStop(k, c));
    return gr;
  }
  // a tapered brush stroke along points (filled ribbon)
  function stroke(g, pts, w, col, seed = 's', taper = .7) {
    const r = rng(seed); const n = pts.length; if (n < 2) return;
    const L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const k = i / (n - 1), pr = 1 - taper * Math.pow(Math.abs(2 * k - 1), 3);
      const ww = w * .5 * pr * (1 + r.gauss() * .08);
      L.push([pts[i][0] - dy * ww, pts[i][1] + dx * ww]); R.push([pts[i][0] + dy * ww, pts[i][1] - dx * ww]);
    }
    if (col) g.fillStyle = col; g.beginPath(); g.moveTo(L[0][0], L[0][1]);
    for (const p of L) g.lineTo(p[0], p[1]);
    for (let i = n - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
    g.closePath(); g.fill();
  }
  function seg(a, b, n = 6) { const o = []; for (let i = 0; i <= n; i++) o.push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)]); return o; }

  // projective map from a rectangle (0..uw, 0..vh; v pointing UP) onto a screen quad [bl, br, tr, tl]
  function plane(q, uw = 1, vh = 1) {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
    const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
    let a, b, c, d, e, f, G, Hh;
    if (Math.abs(sx) < 1e-9 && Math.abs(sy) < 1e-9) { a = x1 - x0; b = x3 - x0; c = x0; d = y1 - y0; e = y3 - y0; f = y0; G = 0; Hh = 0; }
    else {
      const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, den = dx1 * dy2 - dx2 * dy1;
      G = (sx * dy2 - dx2 * sy) / den; Hh = (dx1 * sy - sx * dy1) / den;
      a = x1 - x0 + G * x1; b = x3 - x0 + Hh * x3; c = x0; d = y1 - y0 + G * y1; e = y3 - y0 + Hh * y3; f = y0;
    }
    const map = (U, V) => { const u = U / uw, v = V / vh, z = G * u + Hh * v + 1; return [(a * u + b * v + c) / z, (d * u + e * v + f) / z]; };
    map.scaleAt = (U, V) => { const p0 = map(U, V), p1 = map(U, V + 1); return Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); };
    map.uw = uw; map.vh = vh;
    return map;
  }

  // ---------------------------------------------------------------- the Plate: a painting surface
  // An opaque sheet of paper; glazes multiply onto it (transparent watercolour), gouache sits on top.
  // `knock` paints paper back into a silhouette (so a nearer object occludes what is behind it, as a
  // painter would leave that area white). A coverage mask records where paint went, so layers can be
  // cut out for parallax (`final()`); `full: true` plates stay opaque; `blank: true` plates are pure
  // white and meant to be composited with 'multiply' (shadow / tint overlays).
  class Plate {
    constructor(w, h, seed = 'plate', opts = {}) {
      ensureSVG();
      this.w = Math.ceil(w); this.h = Math.ceil(h); this.seed = seed; this.n = 0;
      this.full = !!opts.full || !!opts.blank;
      this.c = mk(this.w, this.h); this.g = this.c.getContext('2d');
      this.paperBase = opts.paper || '#f7efdc';
      if (opts.blank) { this.g.fillStyle = '#fff'; this.g.fillRect(0, 0, this.w, this.h); this.paperC = null; }
      else { this.paperC = paper(this.w, this.h, this.paperBase, 'pp' + (opts.paperSeed || '')); this.g.drawImage(this.paperC, 0, 0); }
      if (!this.full) { this.m = mk(this.w, this.h); this.mg = this.m.getContext('2d'); }
    }
    // draw drawFn on a full-size scratch, find its box, run it through edge filters into a box-sized canvas
    _prep(drawFn, seed, wobble, soft, margin) {
      const T = scratch('T', this.w, this.h), t = T.getContext('2d');
      drawFn(t, seed);
      const box = alphaBox(T, this.w, this.h, margin);
      if (!box) return null;
      let [bx, by, bw, bh] = box;
      // align the box to the wobble noise tile so every pass displaces a given spot identically
      if (wobble) { const ts = wobTile(wobble), ax = bx % ts, ay = by % ts; bx -= ax; by -= ay; bw += ax; bh += ay; }
      const S = scratch('S', bw, bh), s = S.getContext('2d');
      const f = [];
      if (wobble && svgOK) f.push(`url(#wcw${wobble})`);
      if (soft) f.push(`blur(${soft}px)`);
      if (f.length) s.filter = f.join(' ');
      s.drawImage(T, bx, by, bw, bh, 0, 0, bw, bh); s.filter = 'none';
      return { S, s, bx, by, bw, bh };
    }
    // Glaze: transparent watercolour pass.
    // opts: alpha, blend, edge (edge darkening 0..1), edgeW (px), dark (edge/granule darkness), gran (granulation),
    // mottle (uneven density), soft (wet-in-wet blur px), wobble (edge displacement px: 1,2,3,5,8,12,20,30),
    // lift (paper-tooth specks lifted), bloom (back-runs), cover (adds to layer mask), streak (dry drag).
    glaze(drawFn, o = {}) {
      const { alpha = 1, blend = 'multiply', edge = .5, edgeW = 8, gran = .15, mottle = .25, soft = 0, wobble = 3,
        cover = true, lift = .04, bloom = 0, coverBoost = 3, dark = .62, streak = 0, sep = 0, sepHue = -14, tight = .9 } = o;
      const seed = this.seed + ':' + (this.n++);
      const pr = this._prep(drawFn, seed, wobble, soft, wobble * 2 + soft * 3 + edgeW + 6);
      if (!pr) return this;
      const { S, s, bx, by, bw, bh } = pr;
      if (cover && !this.full) this.mg.drawImage(S, 0, 0, bw, bh, bx, by, bw, bh);
      const r = rng(seed);
      const ox = Math.floor(r() * 512), oy = Math.floor(r() * 512);
      // 1. uneven pigment density (mottling)
      if (mottle > 0) {
        s.globalCompositeOperation = 'destination-out'; s.globalAlpha = mottle;
        const nz = lowNoise('mot' + (this.n % 3), this.w + 512, this.h + 512, 260, 1.4);
        s.drawImage(nz, (bx + ox) / 4, (by + oy) / 4, bw / 4, bh / 4, 0, 0, bw, bh);
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      // 2. back-runs: pale soft rings
      if (bloom > 0) {
        const nb = Math.max(1, Math.round(bloom * (bw * bh) / 60000));
        s.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < nb; i++) {
          const x = r() * bw, y = r() * bh, R = r.range(20, 70);
          const gr = s.createRadialGradient(x, y, R * .2, x, y, R);
          gr.addColorStop(0, 'rgba(0,0,0,.3)'); gr.addColorStop(.8, 'rgba(0,0,0,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          s.fillStyle = gr; s.fillRect(x - R, y - R, 2 * R, 2 * R);
        }
        s.globalCompositeOperation = 'source-over';
      }
      const tx = -((bx + ox) % 512), ty = -((by + oy) % 512);
      // 3. dry-brush streaks
      if (streak > 0) {
        s.globalCompositeOperation = 'destination-out'; s.globalAlpha = streak;
        s.save(); s.translate(tx, ty); s.fillStyle = pattern(s, 'streak'); s.fillRect(0, 0, bw + 512, bh + 512); s.restore();
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      // darkened copy of the wash (pooled pigment colour), made once and reused
      // 3b. pigment separation: a hue-shifted copy of the wash through a noise mask (warm/cool drift)
      if (sep > 0) {
        const G = scratch('G', bw, bh), gg = G.getContext('2d');
        const nz = lowNoise('sep' + (this.n % 4), this.w + 512, this.h + 512, 120, 1.6);
        gg.drawImage(nz, (bx + oy) / 4, (by + ox) / 4, bw / 4, bh / 4, 0, 0, bw, bh);
        gg.globalCompositeOperation = 'source-in'; gg.filter = `hue-rotate(${sepHue}deg) saturate(1.25) brightness(.92)`; gg.drawImage(S, 0, 0, bw, bh, 0, 0, bw, bh); gg.filter = 'none';
        s.globalCompositeOperation = 'source-atop'; s.globalAlpha = sep; s.drawImage(G, 0, 0, bw, bh, 0, 0, bw, bh);
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      // 4. edge darkening: rim = S − blur(S), painted back darker on top (+ a tight pooled line)
      if (edge > 0) {
        const E2 = scratch('E2', bw, bh), e2 = E2.getContext('2d');
        const hw2 = Math.ceil(bw / 3), hh2 = Math.ceil(bh / 3), B2 = scratch('B2', hw2, hh2), b2 = B2.getContext('2d');
        b2.imageSmoothingQuality = 'medium'; b2.drawImage(S, 0, 0, bw, bh, 0, 0, hw2, hh2);
        e2.drawImage(S, 0, 0, bw, bh, 0, 0, bw, bh);
        e2.globalCompositeOperation = 'destination-out'; e2.drawImage(B2, 0, 0, hw2, hh2, 0, 0, bw, bh);
        s.globalCompositeOperation = 'multiply'; s.globalAlpha = Math.min(1, edge * tight * 2.2);
        s.drawImage(E2, 0, 0, bw, bh, 0, 0, bw, bh);
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      if (edge > 0) {
        const f = Math.max(3, Math.round(edgeW * .9)), sw = Math.ceil(bw / f), sh = Math.ceil(bh / f);
        const B = scratch('B', sw, sh), b = B.getContext('2d');
        b.imageSmoothingQuality = 'high'; b.drawImage(S, 0, 0, bw, bh, 0, 0, sw, sh);
        const E = scratch('E', bw, bh), e = E.getContext('2d');
        e.drawImage(S, 0, 0, bw, bh, 0, 0, bw, bh);
        e.globalCompositeOperation = 'destination-out'; e.imageSmoothingQuality = 'high'; e.drawImage(B, 0, 0, sw, sh, 0, 0, bw, bh);
        s.globalCompositeOperation = 'multiply'; s.globalAlpha = Math.min(1, edge * 1.7);
        s.drawImage(E, 0, 0, bw, bh, 0, 0, bw, bh);
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      // 5. granulation: darker clumps in the paper's valleys
      if (gran > 0) {
        const G = scratch('G', bw, bh), gg = G.getContext('2d');
        gg.save(); gg.translate(tx, ty); gg.fillStyle = pattern(gg, 'gran'); gg.fillRect(0, 0, bw + 512, bh + 512); gg.restore();
        gg.globalCompositeOperation = 'source-in'; gg.drawImage(S, 0, 0, bw, bh, 0, 0, bw, bh);
        s.globalCompositeOperation = 'multiply'; s.globalAlpha = Math.min(1, gran * 2); s.drawImage(G, 0, 0, bw, bh, 0, 0, bw, bh);
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      // 6. lifting on paper peaks
      if (lift > 0) {
        s.globalCompositeOperation = 'destination-out'; s.globalAlpha = lift;
        s.save(); s.translate(-((bx + ox * 7) % 512), -((by + oy * 3) % 512)); s.fillStyle = pattern(s, 'tooth'); s.fillRect(0, 0, bw + 512, bh + 512); s.restore();
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      this._put(S, bx, by, bw, bh, blend, alpha, false);
      return this;
    }
    _put(S, bx, by, bw, bh, blend, alpha, cover, boost = 3) {
      const g = this.g;
      g.save(); g.globalCompositeOperation = blend; g.globalAlpha = alpha; g.drawImage(S, 0, 0, bw, bh, bx, by, bw, bh); g.restore();
      if (cover && !this.full) this.mg.drawImage(S, 0, 0, bw, bh, bx, by, bw, bh);
    }
    // Gouache: opaque paint. dry (0..1) breaks it up on paper tooth.
    gouache(drawFn, o = {}) {
      const { alpha = 1, dry = 0, wobble = 2, cover = true, blend = 'source-over', soft = 0, edge = 0, dark = .7, edgeW = 4 } = o;
      const seed = this.seed + ':' + (this.n++);
      const pr = this._prep(drawFn, seed, wobble, soft, wobble * 2 + soft * 3 + 8);
      if (!pr) return this;
      const { S, s, bx, by, bw, bh } = pr;
      if (cover && !this.full) this.mg.drawImage(S, 0, 0, bw, bh, bx, by, bw, bh);
      if (dry > 0) {
        const r = rng(seed);
        s.globalCompositeOperation = 'destination-out'; s.globalAlpha = dry;
        s.save(); s.translate(-r() * 512, -r() * 512); s.fillStyle = pattern(s, 'tooth'); s.fillRect(0, 0, bw + 512, bh + 512);
        s.fillStyle = pattern(s, 'gran'); s.globalAlpha = dry * .6; s.fillRect(0, 0, bw + 512, bh + 512); s.restore();
        s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      if (edge > 0) {
        const E = scratch('E', bw, bh), e = E.getContext('2d');
        e.drawImage(S, 0, 0, bw, bh, 0, 0, bw, bh);
        e.globalCompositeOperation = 'destination-out'; e.filter = `blur(${edgeW}px)`; e.drawImage(S, 0, 0, bw, bh, 0, 0, bw, bh); e.filter = 'none';
        s.globalCompositeOperation = 'source-atop'; s.globalAlpha = edge; s.filter = `brightness(${dark})`;
        s.drawImage(E, 0, 0, bw, bh, 0, 0, bw, bh); s.filter = 'none'; s.globalAlpha = 1; s.globalCompositeOperation = 'source-over';
      }
      this._put(S, bx, by, bw, bh, blend, alpha, false);
      return this;
    }
    // Knock-out: paint clean paper into a silhouette (occlusion for transparent glazes)
    // (silhouette is eroded by `erode` px so the following wobbly glazes overlap its edge, never leaving a halo)
    knock(drawFn, o = {}) {
      const { erode = 2, cover = true } = o;
      if (!this.paperC) return this;
      const seed = this.seed + ':' + (this.n++);
      const T = scratch('T', this.w, this.h), t = T.getContext('2d');
      drawFn(t, seed);
      const box = alphaBox(T, this.w, this.h, 6);
      if (!box) return this;
      const [bx, by, bw, bh] = box;
      const S = scratch('S', bw, bh), s = S.getContext('2d');
      if (erode && svgOK) s.filter = `url(#wce${erode})`;
      s.drawImage(T, bx, by, bw, bh, 0, 0, bw, bh); s.filter = 'none';
      s.globalCompositeOperation = 'source-in'; s.drawImage(this.paperC, bx, by, bw, bh, 0, 0, bw, bh);
      this._put(S, bx, by, bw, bh, 'source-over', 1, cover, 3);
      return this;
    }
    // direct paint without processing
    direct(drawFn, o = {}) {
      const { blend = 'source-over', alpha = 1 } = o;
      const g = this.g; g.save(); g.globalCompositeOperation = blend; g.globalAlpha = alpha; drawFn(g); g.restore();
      return this;
    }
    // salt: pale star-bursts like salt dropped on a wet wash, within clipFn(g) path
    salt(clipFn, n = 60, o = {}) {
      const { rmin = 2, rmax = 7, alpha = .45, seed = 'salt', col = '255,248,232' } = o;
      const r = rng(this.seed + seed), g = this.g;
      g.save(); if (clipFn) { g.beginPath(); clipFn(g); g.clip(); }
      for (let i = 0; i < n; i++) {
        const x = r() * this.w, y = r() * this.h, R = r.range(rmin, rmax);
        const gr = g.createRadialGradient(x, y, 0, x, y, R);
        gr.addColorStop(0, `rgba(${col},${alpha})`); gr.addColorStop(.6, `rgba(${col},${alpha * .5})`); gr.addColorStop(1, `rgba(${col},0)`);
        g.fillStyle = gr; g.beginPath();
        const k = 9 + Math.floor(r() * 5);
        for (let j = 0; j < k; j++) { const a = j / k * Math.PI * 2, rr = R * (j % 2 ? .45 : 1) * r.range(.7, 1.2); g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
        g.fill();
      }
      g.restore();
      return this;
    }
    final() {
      if (this.full || this._done) return this.c;
      const g = this.g; g.save(); g.globalCompositeOperation = 'destination-in';
      g.drawImage(this.m, 0, 0);
      g.restore();
      this._done = true; this.m = null; this.mg = null;
      return this.c;
    }
  }

  // cached plate: build(plate) paints; returns the finished canvas
  const _times = {};
  function plate(key, w, h, build, opts = {}) {
    const k = 'wcPlate:' + key;
    if (_cache.has(k)) return _cache.get(k);
    const t0 = performance.now();
    const p = new Plate(w, h, key, opts);
    build(p);
    const c = p.final();
    _cache.set(k, c);
    _times[key] = Math.round(performance.now() - t0);
    return c;
  }
  function layer(g, c, x = 0, y = 0) { g.drawImage(c, Math.round(x), Math.round(y)); }

  ensureSVG();
  return { inflate, mk, scratch, ensureSVG, smoothNoiseCanvas, grainTile, pattern, paper, alphaBox, P, rough, fillP, blob, vgrad, stroke, seg, plane, Plate, plate, layer, times: _times };
})();

// =====================================================================================================
// Shared painting kit: skies, clouds, hills, houses on perspective planes, towers, trees, cobbles.
// =====================================================================================================
const BGK = (() => {
  const { P, rough, fillP, blob, vgrad, stroke } = BGW;
  const COL = {
    walls: ['#f4d9a6', '#ecbb6c', '#e8a088', '#f2b487', '#c8cf96', '#f3d282', '#dcb8b0', '#e3966a', '#b8d0b6', '#f6e2bc', '#eec29e'],
    roofs: ['#b8573c', '#a24f3a', '#c66b45', '#7a768e', '#93593f', '#b5603f', '#8a4a3a'],
    shutters: ['#4f7d78', '#7f9a6e', '#6d4a5e', '#46708e', '#c99a3a', '#a9453a', '#5f8a83', '#3f6a6a'],
    shadow: '#5b5690', glass: '#2c3646',
  };

  // ---------- sky ----------
  function skyWash(p, x, y, w, h, stops, o = {}) {
    p.glaze(g => { g.fillStyle = vgrad(g, 0, y, 0, y + h, stops); g.fillRect(x, y, w, h); },
      { edge: 0, gran: .07, mottle: .2, wobble: 0, lift: .02, sep: .25, sepHue: 12, ...o });
  }
  // cumulus as puffs [x, y, r]; flatter bottoms, a towering top
  function cloudPuffs(r, cx, cy, w, h, n = 14, tower = .5) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const u = r.range(-.5, .5), k = Math.pow(1 - Math.abs(u) * 2, .7);
      const pr = (h * .18 + h * .26 * k) * r.range(.75, 1.15);
      const py = cy - pr * .5 - h * (.6 * tower * k) * r();
      out.push([cx + u * w, py, pr]);
    }
    // bridge gaps so the cloud is one connected mass
    const byX = out.slice().sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < byX.length; i++) { const a = byX[i - 1], b = byX[i]; if (b[0] - a[0] > (a[2] + b[2]) * .7) out.push([(a[0] + b[0]) / 2, Math.max(a[1], b[1]), Math.max(a[2], b[2]) * .8]); }
    out.sort((a, b) => a[1] - b[1]); // back (top) first
    return out;
  }
  function puffPath(g, puffs) { g.beginPath(); for (const [x, y, r] of puffs) { g.moveTo(x + r, y); g.arc(x, y, r, 0, Math.PI * 2); } }
  // paint a cloud with gouache puffs (each lit toward `light`), flattened base in shade, then soft glazes.
  function cloud(p, puffs, o = {}) {
    const { body = '#fcf1e2', belly = '#d4c0c8', shade = '#a898b4', core = '#8c84ac', rim = '#ffe4b0', base = null, light = [-1, -.7], alpha = 1, soft = 1.2, shadeA = .42, rimA = .8, coreA = .3, cover = false, front = 0, seed = 'cl' } = o;
    const maxY = Math.max(...puffs.map(q => q[1] + q[2])), minY = Math.min(...puffs.map(q => q[1] - q[2]));
    const minX = Math.min(...puffs.map(q => q[0] - q[2])), maxX = Math.max(...puffs.map(q => q[0] + q[2]));
    const flat = base ?? (maxY - (maxY - minY) * .1);
    const ln = Math.hypot(light[0], light[1]), lx = light[0] / ln, ly = light[1] / ln;
    const cx = (minX + maxX) / 2, ext = Math.max(maxX - minX, flat - minY) * .5;
    const avgR = puffs.reduce((a, q) => a + q[2], 0) / puffs.length;
    const r = rng(seed + puffs.length + Math.round(minX));
    // depth layers: the whole mass, then a few front lobes (smaller, inside) that get their own light
    const inside = q => puffs.filter(o2 => o2 !== q && Math.hypot(q[0] - o2[0], q[1] - o2[1]) < o2[2] * .9).length >= 2;
    const covered = (x, y) => puffs.some(o2 => Math.hypot(x - o2[0], y - o2[1]) < o2[2] * .85);
    const fr = puffs.filter(q => inside(q) && q[1] < flat - q[2] * .6 && covered(q[0] + lx * q[2] * 1.5, q[1] + ly * q[2] * 1.5) && r() < front).map(q => [q[0], q[1], q[2] * .82]);
    const layers = [puffs, fr].filter(L => L.length);
    const clip = g => { g.beginPath(); g.rect(minX - 80, minY - 80, maxX - minX + 160, flat - minY + 80); g.clip(); };
    const union = (g, L, dx = 0, dy = 0, k = 1) => { g.beginPath(); for (const [x, y, rr] of L) { g.moveTo(x + dx + rr * k, y + dy); g.arc(x + dx, y + dy, rr * k, 0, Math.PI * 2); } };
    const d1 = avgR * (o.d1 ?? 1.1), d2 = avgR * (o.d2 ?? 2);
    layers.forEach((L, li) => {
      if (li > 0) { // front lobes: defined only by a lit cap and a soft shadow they cast on the mass behind
        p.glaze(g => { g.save(); clip(g); g.fillStyle = core; union(g, L, -lx * avgR * .35, -ly * avgR * .35, 1.02); g.fill(); g.globalCompositeOperation = 'destination-out'; union(g, L); g.fill(); g.globalCompositeOperation = 'destination-in'; union(g, puffs); g.fill(); g.restore(); },
          { alpha: .3, edge: .1, soft: 7, wobble: 8, gran: .15, cover: false });
        p.gouache(g => { g.save(); clip(g); g.fillStyle = mix(body, rim, .25); union(g, L); g.fill(); g.globalCompositeOperation = 'destination-out'; union(g, L, -lx * avgR * .55, -ly * avgR * .55); g.fill(); g.restore(); }, { wobble: 3, soft: 3, alpha: .9, cover: false });
        p.glaze(g => { g.save(); clip(g); g.fillStyle = rim; union(g, L); g.fill(); g.globalCompositeOperation = 'destination-out'; union(g, L, -lx * avgR * .25, -ly * avgR * .25); g.fill(); g.restore(); },
          { blend: 'source-over', alpha: rimA * .8, edge: 0, soft: 3, wobble: 3, gran: .05, mottle: .35, cover: false });
        return;
      }
      // body: opaque, warm cream toward the sun → lilac belly
      p.gouache(g => { g.save(); clip(g); union(g, L); g.fillStyle = vgrad(g, cx + lx * ext, minY + (flat - minY) * (.5 + ly * .5), cx - lx * ext * .6, flat, [[0, body], [.55, mix(body, belly, .4)], [1, belly]]); g.fill(); g.restore(); }, { wobble: 3, soft, alpha, cover: cover && li === 0 });
      // half shadow: the mass minus the band facing the sun
      p.glaze(g => { g.save(); clip(g); g.fillStyle = shade; union(g, L, -lx * d1, -ly * d1); g.fill(); g.globalCompositeOperation = 'destination-in'; union(g, L); g.fill(); g.restore(); },
        { alpha: shadeA, edge: .18, edgeW: 10, soft: 6, wobble: 8, gran: .15, mottle: .3, cover: false });
      // core shadow: deeper, further from the light
      p.glaze(g => { g.save(); clip(g); g.fillStyle = core; union(g, L, -lx * d2, -ly * d2, .92); g.fill(); g.globalCompositeOperation = 'destination-in'; union(g, L); g.fill(); g.restore(); },
        { alpha: coreA, edge: .15, edgeW: 12, soft: 10, wobble: 12, gran: .2, mottle: .35, cover: false });
      // billows: soft sky-lit caps on interior puffs (light from above), so the shadow side still has volume
      if (li === 0 && o.billows !== 0) p.glaze(g => { g.save(); clip(g); union(g, L); g.clip(); g.fillStyle = mix(body, '#e8e4f4', .5);
        for (const q of L) { if (!inside(q)) continue; const [x, y, rr] = q; g.save(); g.beginPath(); g.arc(x, y, rr * .95, 0, 7); g.clip(); g.beginPath(); g.arc(x, y, rr * .95, 0, 7); g.arc(x + lx * rr * .15, y + rr * .42, rr * .95, 0, 7); g.fill('evenodd'); g.restore(); }
        g.restore(); }, { blend: 'source-over', alpha: o.billows ?? .3, edge: 0, soft: 5, wobble: 5, gran: .1, mottle: .45, cover: false });
      // belly: the flat base sits in its own shadow
      if (li === 0) p.glaze(g => { g.save(); clip(g); union(g, L); g.clip(); g.fillStyle = vgrad(g, 0, flat - (flat - minY) * .35, 0, flat, [[0, rgba(core, 0)], [1, rgba(core, .7)]]); g.fillRect(minX - 80, minY, maxX - minX + 160, flat - minY + 10); g.restore(); },
        { alpha: .6, edge: 0, soft: 4, wobble: 5, gran: .15, cover: false });
      // warm rim: a thin lit band on the sunward edges
      p.glaze(g => { g.save(); clip(g); g.fillStyle = rim; union(g, L); g.fill(); g.globalCompositeOperation = 'destination-out'; union(g, L, -lx * avgR * .3, -ly * avgR * .3); g.fill(); g.restore(); },
        { blend: 'source-over', alpha: rimA, edge: 0, soft: 3, wobble: 3, gran: .05, mottle: .35, cover: false });
    });
  }
  // wispy streak clouds (cirrus/stratus) — soft horizontal glazes
  function streaks(p, r, n, x0, x1, y0, y1, col, o = {}) {
    p.glaze(g => { for (let i = 0; i < n; i++) { const y = r.range(y0, y1), x = r.range(x0, x1), w = r.range(160, 460); g.fillStyle = rgba(col, r.range(.4, .8)); g.beginPath(); g.ellipse(x, y, w, r.range(5, 16), r.gauss() * .02, 0, 7); g.fill(); } },
      { soft: 5, edge: .25, wobble: 12, gran: .1, alpha: .6, cover: false, ...o });
  }

  // ---------- hills ----------
  function ridge(seed, x0, x1, y, amp, step = 24, freq = 1) {
    const N = makeNoise(seed), pts = [];
    for (let x = x0; x <= x1 + step; x += step) pts.push([x, y - amp * (N.fbm(x / 600 * freq + 3, 7, 3) - .35) * 2]);
    return pts;
  }
  const ridgeY = (pts, x) => { for (let i = 1; i < pts.length; i++) if (pts[i][0] >= x) { const a = pts[i - 1], b = pts[i]; return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0] || 1)); } return pts[pts.length - 1][1]; };

  // ---------- houses ----------
  // A house lives on a plane (BGW.plane) at offset U0; local coords (u across 0..w, v up 0..h).
  function house(pl, U0, w, h, r, o = {}) {
    const lean = o.lean ?? r.gauss() * .035, tilt = o.tilt ?? r.gauss() * .015;
    const H = {
      w, h, lean, tilt, U0,
      pr: (u, v) => pl(U0 + u + lean * v, v + tilt * (u - w / 2)),
      wall: o.wall ?? r.pick(COL.walls), roof: o.roof ?? r.pick(COL.roofs), shutter: o.shutter ?? r.pick(COL.shutters),
      roofType: o.roofType ?? r.pick(['gable', 'gable', 'hip', 'step', 'hip', 'gable', 'mansard']),
      rh: o.rh ?? w * r.range(.4, .75), oh: o.oh ?? r.range(8, 16),
      floors: o.floors ?? Math.max(2, Math.round(h / r.range(115, 140))),
      cols: o.cols ?? Math.max(1, Math.round(w / r.range(80, 115))),
      shop: o.shop ?? null, chimneys: o.chimneys ?? (r() < .75 ? [r.range(.15, .85)] : []),
      seed: o.seed ?? ('h' + Math.floor(r() * 1e9)),
      arch: o.arch ?? (r() < .3), boxes: o.boxes ?? (r() < .65), brick: o.brick ?? (r() < .5),
      wf: o.wf ?? r.range(.34, .46), lit: o.lit ?? 1, balcony: o.balcony ?? (r() < .35 ? 1 : -1),
      shutterP: o.shutterP ?? r.range(.4, 1), curtains: o.curtains ?? r.range(0, .5), glowP: o.glowP ?? .15,
      door: o.door ?? r.range(.15, .65), sign: o.sign ?? null, detail: o.detail ?? 1,
    };
    return H;
  }
  const mapP = (H, poly) => poly.map(([u, v]) => H.pr(u, v));
  function roofPoly(H) {
    const { w, h, rh, oh } = H;
    switch (H.roofType) {
      case 'gable': return [[-oh, h - 4], [w + oh, h - 4], [w / 2, h + rh]];
      case 'hip': return [[-oh, h - 4], [w + oh, h - 4], [w * .8, h + rh * .6], [w * .2, h + rh * .6]];
      case 'mansard': return [[-oh, h - 4], [w + oh, h - 4], [w - 6, h + rh * .55], [w * .75, h + rh * .7], [w * .25, h + rh * .7], [6, h + rh * .55]];
      case 'step': {
        const n = 4, pts = [[-2, h - 2]];
        for (let i = 0; i < n; i++) { const u = i / n * .42, v = h + rh * (i + 1) / n; pts.push([w * u, v - rh / n], [w * u, v]); }
        pts.push([w * .42, h + rh + 8], [w * .58, h + rh + 8]);
        for (let i = n - 1; i >= 0; i--) { const u = 1 - i / n * .42, v = h + rh * (i + 1) / n; pts.push([w * u, v], [w * u, v - rh / n]); }
        pts.push([w + 2, h - 2]);
        return pts;
      }
      default: return [[-6, h - 2], [w + 6, h - 2], [w + 6, h + 24], [-6, h + 24]];
    }
  }
  function roofTop(H) { // v of the roof apex
    return H.h + (H.roofType === 'gable' || H.roofType === 'step' ? H.rh : H.roofType === 'flat' ? 24 : H.rh * .7);
  }
  // windows in local coords: {x, y (bottom), w, h, arch, floor, col}
  function windows(H) {
    const out = []; const top = H.h - 26, gf = H.shop ? 175 : 150;
    const fl = H.floors - 1, fh = (top - gf) / Math.max(1, fl);
    const cw = H.w / H.cols, ww = Math.min(cw * H.wf * 1.25, 40 + H.w * .05);
    for (let f = 0; f < fl; f++) {
      const wh = Math.min(fh * (f === fl - 1 && fl > 2 ? .5 : .62), ww * 2.1);
      for (let c = 0; c < H.cols; c++) out.push({ x: cw * (c + .5) - ww / 2, y: gf + f * fh + (fh - wh) * .42, w: ww, h: wh, arch: H.arch && f === fl - 1, floor: f + 1, col: c });
    }
    if (!H.shop) { // ground-floor windows beside the door
      const dw = Math.min(50, H.w * .28), dx = H.w * H.door;
      for (let c = 0; c < H.cols; c++) { const x = cw * (c + .5) - ww / 2; if (x + ww > dx - 8 && x < dx + dw + 8) continue; out.push({ x, y: 40, w: ww, h: Math.min(90, ww * 1.8), arch: false, floor: 0, col: c }); }
    }
    return out;
  }
  function winPoly(wn, inset = 0) {
    const { x, y, w, h } = wn;
    if (!wn.arch) return P.rect(x + inset, y + inset, w - 2 * inset, h - 2 * inset);
    const r = w / 2 - inset, cy = y + h - w / 2, pts = [[x + inset, y + inset], [x + w - inset, y + inset]];
    for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI; pts.push([x + w / 2 + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return pts;
  }
  function doorPoly(H) {
    const dw = Math.min(50, H.w * .28), dx = H.w * H.door, dh = 112, pts = [[dx, -4], [dx + dw, -4]];
    for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI; pts.push([dx + dw / 2 + Math.cos(a) * dw / 2, dh + Math.sin(a) * dw / 2]); }
    return pts;
  }

  return { COL, skyWash, cloudPuffs, puffPath, cloud, streaks, ridge, ridgeY, house, mapP, roofPoly, roofTop, windows, winPoly, doorPoly };
})();

// Facade painter: houses → watercolour passes (knock-out, light → dark → gouache).
// o.light: -1 sun from the left / +1 right. o.haze 0..1 + o.hazeCol for distance. o.detail 0..1.
function bgPaintFacades(p, houses, o = {}) {
  const K = BGK, { COL, mapP, roofPoly, roofTop, windows, winPoly, doorPoly } = K;
  const { P, rough, fillP, stroke, vgrad } = BGW;
  const L = o.light ?? -1, sh = o.shadow ?? COL.shadow, detail = o.detail ?? 1, haze = o.haze ?? 0;
  const lv = o.level ?? (detail ? 2 : 1), anyShop = houses.some(H => H.shop && H.shop.awning), anyDormer = houses.some(H => H.roofType === 'mansard' || H.roofType === 'hip');
  const hz = c => haze ? mix(c, o.hazeCol || '#d2bdb0', haze) : c;
  const each = fn => g => houses.forEach(H => fn(g, H, rng(H.seed + ':' + fn.length)));
  const M = mapP;
  const R = (H, u, v, w, h) => M(H, P.rect(u, v, w, h));
  const chim = H => H.chimneys.map(u => { const cu = u * H.w, apex = roofTop(H), top = H.h + (apex - H.h) * (1 - Math.abs(u - .5) * 1.3) + 30; return { cu, top }; });
  const silhouette = (g, H) => {
    fillP(g, M(H, P.rect(0, -30, H.w, H.h + 30)), '#000'); fillP(g, M(H, roofPoly(H)), '#000');
    for (const c of chim(H)) fillP(g, R(H, c.cu - 13, H.h, 26, c.top - H.h + 8), '#000');
  };
  // optional: collect every window's screen polygon (for night versions: lit windows)
  if (o.winOut) houses.forEach(H => windows(H).forEach(wn => o.winOut.push(M(H, winPoly(wn)))));
  if (o.silOut) houses.forEach(H => { o.silOut.push(M(H, P.rect(0, -30, H.w, H.h + 30)), M(H, roofPoly(H))); chim(H).forEach(c => o.silOut.push(R(H, c.cu - 13, H.h, 26, c.top - H.h + 8))); });
  // 0. knock out (occlusion)
  if (o.knock !== false) p.knock(each((g, H) => silhouette(g, H)), { erode: 3 });
  // 1. walls
  p.glaze(each((g, H) => fillP(g, rough(M(H, P.rect(0, -30, H.w, H.h + 30)), H.seed + 'w', 1, 30), hz(H.wall))), { edge: .4, gran: .12, mottle: .4, wobble: 2, edgeW: 10, bloom: detail * .3, sep: .35 });
  // 2. modelling: warm sunlit top, cool foot; streak stains
  if (lv >= 1) p.glaze(each((g, H) => {
    const a = H.pr(0, H.h), b = H.pr(0, 0);
    g.fillStyle = vgrad(g, a[0], a[1], b[0], b[1], [[0, 'rgba(255,190,110,.3)'], [.45, 'rgba(220,170,140,0)'], [1, rgba(sh, .28)]]);
    fillP(g, M(H, P.rect(-2, -30, H.w + 4, H.h + 30)));
    if (detail) { const r = rng(H.seed + 'st'); for (let i = 0; i < 3; i++) { const u = r() * H.w, v = H.h * r.range(.4, 1), len = r.range(40, 150), q0 = H.pr(u, v), q1 = H.pr(u, v - len); g.fillStyle = vgrad(g, q0[0], q0[1], q1[0], q1[1], [[0, 'rgba(130,100,80,.2)'], [1, 'rgba(130,100,80,0)']]); fillP(g, R(H, u, v - len, r.range(10, 34), len)); } }
  }), { edge: 0, gran: .2, mottle: .45, wobble: 5, soft: 3, cover: false });
  // 3. exposed brick patches
  if (lv >= 2) p.glaze(each((g, H) => {
    if (!H.brick) return; const r = rng(H.seed + 'br');
    for (let k = 0; k < 2; k++) {
      const cx = r.range(.12, .88) * H.w, cy = r.range(.15, .85) * H.h, rx = r.range(20, 44), ry = rx * r.range(.5, .8);
      const poly = deform(P.circ(cx, cy, rx, ry, 10), r, 3, .25);
      fillP(g, M(H, poly), 'rgba(196,118,84,.32)');
      g.save(); tracePoly(g, M(H, poly)); g.clip();
      for (let yy = cy - ry; yy < cy + ry; yy += 9) for (let xx = cx - rx + (Math.round(yy / 9) % 2) * 9; xx < cx + rx; xx += 18) if (r() < .7) fillP(g, R(H, xx + r.gauss(), yy + r.gauss(), 15, 6), `rgba(150,72,50,${r.range(.3, .65)})`);
      g.restore();
    }
  }), { edge: .5, gran: .3, mottle: .3, wobble: 1, cover: false });
  // 4. roofs + chimneys + dormers
  p.glaze(each((g, H) => {
    fillP(g, rough(M(H, roofPoly(H)), H.seed + 'r', 1, 20), hz(H.roof));
    for (const c of chim(H)) { fillP(g, R(H, c.cu - 11, H.h, 22, c.top - H.h), hz(mix(H.roof, '#d09a78', .45))); fillP(g, R(H, c.cu - 14, c.top - 4, 28, 9), hz(mix(H.roof, '#4a2a20', .35))); }
  }), { edge: .5, gran: .3, mottle: .35, wobble: 2 });
  if (lv >= 1 && anyDormer) p.glaze(each((g, H) => { // dormers on mansard / hip
    if (H.roofType !== 'mansard' && H.roofType !== 'hip') return;
    const n = H.w > 160 ? 2 : 1;
    for (let i = 0; i < n; i++) { const du = H.w * (n === 1 ? .5 : .3 + .4 * i), dw = 30, v0 = H.h + 8; fillP(g, M(H, P.rect(du - dw / 2, v0, dw, 36)), hz(mix(H.wall, '#fff', .2))); fillP(g, M(H, [[du - dw / 2 - 7, v0 + 34], [du + dw / 2 + 7, v0 + 34], [du, v0 + 58]]), hz(mix(H.roof, '#3a2020', .15))); fillP(g, M(H, P.rect(du - 9, v0 + 6, 18, 24)), hz(COL.glass)); }
  }), { edge: .45, gran: .2, wobble: 1, cover: false });
  // 5. roof tiles (dry rows) + ridge darkening
  if (lv >= 2) p.glaze(each((g, H) => {
    if (H.roofType === 'flat') return;
    const r = rng(H.seed + 'tl'); g.save(); tracePoly(g, M(H, roofPoly(H))); g.clip();
    const dark = mix(H.roof, '#3a1a20', .5), top = roofTop(H);
    for (let v = H.h - 4; v < top; v += 10) for (let u = -20; u < H.w + 20; u += r.range(9, 17)) fillP(g, R(H, u, v + r.gauss() * .6, r.range(5, 11), 3), rgba(dark, r.range(.08, .4)));
    const a = H.pr(H.w / 2, top), b = H.pr(H.w / 2, H.h);
    g.fillStyle = vgrad(g, a[0], a[1], b[0], b[1], [[0, rgba(dark, .32)], [1, rgba(dark, 0)]]); fillP(g, M(H, roofPoly(H)));
    g.restore();
  }), { edge: .15, gran: .3, mottle: .3, wobble: 0, cover: false, alpha: .85 });
  // 6. glass, doors, shop windows
  p.glaze(each((g, H) => {
    for (const wn of windows(H)) fillP(g, M(H, winPoly(wn)), hz(mix(COL.glass, H.wall, .08)));
    if (H.shop) { const sw = H.w - 36; fillP(g, R(H, 18, 14, sw * .62, 120), hz('#3a3a46')); fillP(g, R(H, 18 + sw * .7, -4, sw * .3, 140), hz('#4a3428')); }
    else { const r = rng(H.seed + 'dr'); fillP(g, M(H, doorPoly(H)), hz(r.pick(['#5a3a2a', '#3f5a58', '#6a3a3a', '#4a4a5a', '#2f4a5a']))); }
  }), { edge: .45, gran: .2, mottle: .25, wobble: 1 });
  // 7. glass life: sky reflections, warm interiors, curtains, mullions (semi-opaque)
  if (lv >= 1) p.glaze(each((g, H) => {
    const r = rng(H.seed + 'gl');
    for (const wn of windows(H)) {
      g.save(); tracePoly(g, M(H, winPoly(wn))); g.clip();
      if (r() < H.glowP) fillP(g, R(H, wn.x, wn.y, wn.w, wn.h), 'rgba(236,166,84,.75)');
      if (r() < H.curtains) { fillP(g, M(H, [[wn.x, wn.y + wn.h], [wn.x + wn.w * .4, wn.y + wn.h], [wn.x + wn.w * .15, wn.y]]), 'rgba(240,232,214,.75)'); fillP(g, M(H, [[wn.x + wn.w, wn.y + wn.h], [wn.x + wn.w * .6, wn.y + wn.h], [wn.x + wn.w * .85, wn.y]]), 'rgba(240,232,214,.75)'); }
      const k = r.range(.3, .7);
      fillP(g, M(H, [[wn.x, wn.y + wn.h * k], [wn.x + wn.w * .55, wn.y + wn.h], [wn.x + wn.w, wn.y + wn.h], [wn.x, wn.y + wn.h * (k - .35)]]), 'rgba(176,196,206,.5)');
      const mc = rgba(mix(H.wall, '#fff', .35), .85);
      fillP(g, R(H, wn.x + wn.w / 2 - 1.5, wn.y, 3, wn.h), mc); fillP(g, R(H, wn.x, wn.y + wn.h * .55, wn.w, 3), mc);
      g.restore();
    }
    if (H.shop) { const sw = H.w - 36; fillP(g, R(H, 22, 18, sw * .62 - 8, 108), 'rgba(240,178,96,.6)'); }
  }), { blend: 'source-over', edge: .12, gran: .1, mottle: .2, wobble: 0, cover: false, alpha: haze ? 1 - haze * .7 : 1 });
  // 8. shutters (some open flat against the wall, some closed)
  if (lv >= 1) p.glaze(each((g, H) => {
    const r = rng(H.seed + 'sh');
    for (const wn of windows(H)) {
      if (wn.floor === 0 || r() > H.shutterP) continue;
      const sw = wn.w * .5, col = hz(H.shutter);
      if (r() < .12) { fillP(g, R(H, wn.x, wn.y, wn.w / 2 - 1, wn.h), col); fillP(g, R(H, wn.x + wn.w / 2 + 1, wn.y, wn.w / 2 - 1, wn.h), col); continue; }
      fillP(g, R(H, wn.x - sw - 3, wn.y, sw, wn.h), col); fillP(g, R(H, wn.x + wn.w + 3, wn.y, sw, wn.h), col);
      if (detail) for (let v = wn.y + 5; v < wn.y + wn.h - 3; v += 6) { fillP(g, R(H, wn.x - sw - 1, v, sw - 4, 2), 'rgba(0,0,0,.16)'); fillP(g, R(H, wn.x + wn.w + 5, v, sw - 4, 2), 'rgba(0,0,0,.16)'); }
    }
  }), { edge: .45, gran: .15, mottle: .2, wobble: 1 });
  // 9. shadows: eaves, recesses, sill casts, shop/awning, whole facade if turned from the sun
  p.glaze(each((g, H) => {
    if (H.roofType !== 'step' && H.roofType !== 'flat') { const a = H.pr(0, H.h), b = H.pr(0, H.h - 34); g.fillStyle = vgrad(g, a[0], a[1], b[0], b[1], [[0, rgba(sh, .9)], [1, rgba(sh, 0)]]); fillP(g, R(H, 0, H.h - 36, H.w, 36)); }
    g.fillStyle = sh;
    for (const wn of windows(H)) {
      fillP(g, R(H, L < 0 ? wn.x : wn.x + wn.w - 6, wn.y, 6, wn.h)); fillP(g, R(H, wn.x, wn.y + wn.h - 6, wn.w, 6));
      g.globalAlpha = .6; fillP(g, R(H, wn.x - 5, wn.y - 10, wn.w + 10, 5)); g.globalAlpha = 1;
    }
    if (!H.shop) { const dw = Math.min(50, H.w * .28), dx = H.w * H.door; fillP(g, R(H, L < 0 ? dx : dx + dw - 8, -4, 8, 120)); }
    if (H.cast) fillP(g, M(H, L < 0 ? [[H.w, H.h * .95], [H.w + H.cast, H.h * .95 - H.cast * .6], [H.w + H.cast, -30], [H.w, -30]] : [[0, H.h * .95], [-H.cast, H.h * .95 - H.cast * .6], [-H.cast, -30], [0, -30]]));
    if (H.roofType === 'gable') { const rp = roofPoly(H); g.globalAlpha = .5; fillP(g, M(H, L < 0 ? [rp[2], rp[1], [H.w / 2, H.h - 4]] : [rp[2], rp[0], [H.w / 2, H.h - 4]])); g.globalAlpha = 1; }
    if (H.roofType === 'hip' || H.roofType === 'mansard') { const rp = roofPoly(H); g.globalAlpha = .6; fillP(g, M(H, L < 0 ? [rp[1], rp[2], [rp[2][0], H.h - 4]] : [rp[0], rp[rp.length - 1], [rp[rp.length - 1][0], H.h - 4]])); g.globalAlpha = 1; }
  }), { alpha: .5, edge: .45, gran: .25, mottle: .25, wobble: 1, cover: false });
  // facades turned away from the sun: one unifying cool glaze (+ warm bounce at the foot)
  if (houses.some(H => H.lit < 1)) p.glaze(each((g, H) => {
    if (H.lit >= 1) return;
    g.globalAlpha = 1 - H.lit; fillP(g, M(H, P.rect(-H.oh - 2, -30, H.w + 2 * H.oh + 4, roofTop(H) + 34)), sh);
    for (const c of chim(H)) fillP(g, R(H, c.cu - 14, H.h, 28, c.top - H.h + 8), sh);
    g.globalAlpha = 1;
  }), { alpha: .62, edge: .3, gran: .25, mottle: .3, wobble: 2, soft: 1, cover: false });
  // 10. balconies: iron railings
  if (lv >= 2) p.glaze(each((g, H) => {
    if (H.balcony < 0) return;
    for (const wn of windows(H)) {
      if (wn.floor !== H.balcony) continue;
      const u0 = wn.x - 10, u1 = wn.x + wn.w + 10, v0 = wn.y - 4;
      fillP(g, R(H, u0 - 4, v0 - 6, u1 - u0 + 8, 6), hz('#3c3a44'));
      fillP(g, R(H, u0, v0 + 28, u1 - u0, 3), hz('#3c3a44'));
      for (let u = u0; u <= u1; u += 7) fillP(g, R(H, u, v0, 1.8, 30), hz('#3c3a44'));
    }
  }), { edge: .2, gran: 0, mottle: .1, wobble: 0, cover: false });
  // 11. awnings
  if (anyShop) p.glaze(each((g, H) => {
    if (!H.shop || !H.shop.awning) return;
    const [c1, c2] = H.shop.awning, n = Math.max(3, Math.round(H.w / 28)), v0 = 170, v1 = 132, out = .1;
    for (let i = 0; i < n; i++) {
      const a = 6 + (H.w - 12) * i / n, b = 6 + (H.w - 12) * (i + 1) / n, ea = a + (a - H.w / 2) * out, eb = b + (b - H.w / 2) * out, col = hz(i % 2 ? c2 : c1);
      fillP(g, M(H, [[a, v0], [b, v0], [eb, v1], [ea, v1]]), col);
      const pts = [[ea, v1], [eb, v1], [eb, v1 - 16]]; for (let k = 1; k < 8; k++) { const u = lerp(eb, ea, k / 8); pts.push([u, v1 - 16 - Math.sin(k / 8 * Math.PI) * 9]); } pts.push([ea, v1 - 16]);
      fillP(g, M(H, pts), col);
    }
  }), { edge: .5, gran: .15, mottle: .2, wobble: 1 });
  if (anyShop) p.glaze(each((g, H) => {
    if (!H.shop || !H.shop.awning) return;
    const a = H.pr(0, 132), b = H.pr(0, 50); g.fillStyle = vgrad(g, a[0], a[1], b[0], b[1], [[0, rgba(sh, .95)], [1, rgba(sh, 0)]]); fillP(g, R(H, 6, 40, H.w - 12, 92));
    g.globalAlpha = .45; fillP(g, M(H, [[6, 170], [H.w - 6, 170], [H.w - 6, 150], [6, 150]]), sh); g.globalAlpha = 1;
  }), { alpha: .55, edge: .2, gran: .2, wobble: 2, cover: false });
  // 12. gouache: lit sills, flower boxes, sun rims, hanging signs
  if (lv >= 1) p.gouache(each((g, H) => {
    const r = rng(H.seed + 'hl'), lit = hz(mix(H.wall, '#fff6e0', .65));
    for (const wn of windows(H)) {
      fillP(g, R(H, wn.x - 6, wn.y - 5, wn.w + 12, 5), lit);
      if (H.boxes && wn.floor >= 1 && wn.floor <= 2 && r() < .55 && detail) {
        fillP(g, R(H, wn.x - 3, wn.y - 2, wn.w + 6, 11), hz('#7a5034'));
        for (let k = 0; k < 10; k++) { const q = H.pr(wn.x + r() * wn.w, wn.y + 10 + r() * 9), q2 = H.pr(wn.x, wn.y + 11), q1 = H.pr(wn.x, wn.y + 10), rr = r.range(2.6, 5.5) * Math.hypot(q2[0] - q1[0], q2[1] - q1[1]); g.fillStyle = hz(r.pick(['#c4383a', '#e05a4a', '#f2b8a0', '#f0c040', '#5d8a4a', '#4f7a40', '#5d8a4a'])); g.beginPath(); g.arc(q[0], q[1], rr * (1 - haze * .5), 0, 7); g.fill(); }
      }
    }
    if (H.lit > .5) {
      const rp = M(H, roofPoly(H));
      if (H.roofType === 'gable') stroke(g, L < 0 ? [rp[0], rp[2]] : [rp[1], rp[2]], 3.5, rgba('#ffdca4', .85), H.seed + 'rim', .9);
      fillP(g, R(H, L < 0 ? 0 : H.w - 5, 0, 5, H.h), rgba('#ffe9bc', .35));
    }
    if (H.sign && detail) {
      const { u = H.w * .85, v = 190, col = '#c99a3a', kind = 'disc' } = H.sign;
      fillP(g, R(H, u - 2, v, 34, 3), '#3c3a44');
      const c = H.pr(u + 26, v - 20); g.fillStyle = hz(col); g.beginPath();
      if (kind === 'disc') g.arc(c[0], c[1], 15, 0, 7); else { g.rect(c[0] - 15, c[1] - 12, 30, 24); }
      g.fill(); g.fillStyle = 'rgba(60,40,30,.6)'; g.beginPath(); g.arc(c[0], c[1], 6, 0, 7); g.fill();
    }
  }), { dry: .3, wobble: 0, cover: false });
}

// Clock tower (frontal, slight lean). x = left of shaft at base, base = y of base, w = width, h = shaft height.
// Returns the clock face {cx, cy, r} in plate coords (draw animated hands with bgClockHands).
function bgPaintTower(p, x, base, w, h, o = {}) {
  const { P, rough, fillP, stroke } = BGW, sh = o.shadow ?? BGK.COL.shadow, lean = o.lean ?? .018;
  const stone = o.stone ?? '#e9cc96', roofC = o.roof ?? '#6f9a8e', sideW = o.side ?? w * .24, lit = o.lit ?? 1;
  const T = (g, fn) => { g.save(); g.transform(1, 0, -lean, 1, x, base); fn(g); g.restore(); };
  const spireH = o.spireH ?? w * 1.5, belfry = w * .95;
  const clockY = -h + belfry + w * .56;
  const face = { cx: x + w / 2 + lean * (-clockY), cy: base + clockY, r: w * .33 };
  const y0 = -h - 10, tipX = (w + sideW) * .5, tip = y0 - spireH;
  const sil = g => T(g, g => {
    fillP(g, [[0, 0], [0, -h], [w + sideW, -h - sideW * .2], [w + sideW, 0]], '#000');
    for (const yy of [-h + belfry, -h + 6]) fillP(g, [[-10, yy - 16], [w, yy - 16], [w + sideW + 10, yy - 16 - sideW * .2], [w + sideW + 10, yy + 2 - sideW * .2], [w, yy + 2], [-10, yy + 2]], '#000');
    fillP(g, [[-18, y0], [w + 4, y0 + 2], [w + sideW + 18, y0 - sideW * .2], [tipX, tip]], '#000');
  });
  p.knock(sil, { erode: 2 });
  p.glaze(g => T(g, g => {
    fillP(g, rough([[0, 0], [0, -h], [w, -h], [w, 0]], 'tw1', 1, 30), stone);
    fillP(g, [[w, 0], [w, -h], [w + sideW, -h - sideW * .2], [w + sideW, 0]], mix(stone, '#c09a78', .3));
    for (const yy of [-h + belfry, -h + 6]) fillP(g, [[-10, yy - 16], [w, yy - 16], [w + sideW + 10, yy - 16 - sideW * .2], [w + sideW + 10, yy + 2 - sideW * .2], [w, yy + 2], [-10, yy + 2]], mix(stone, '#fff2d0', .35));
  }), { edge: .45, gran: .3, mottle: .4, bloom: .2 });
  p.glaze(g => T(g, g => { // modelling: warm top, cool foot
    g.fillStyle = BGW.vgrad(g, 0, -h, 0, 0, [[0, 'rgba(255,190,120,.3)'], [.5, 'rgba(255,190,120,0)'], [1, rgba(sh, .3)]]); g.fillRect(-12, -h - 20, w + sideW + 24, h + 20);
  }), { edge: 0, soft: 4, wobble: 5, cover: false });
  p.glaze(g => T(g, g => { // quoins + courses
    const r = rng('twq'); g.fillStyle = 'rgba(154,122,84,.42)';
    for (let yy = -20; yy > -h; yy -= 24) {
      const alt = (Math.round(yy / 24)) % 2;
      g.fillRect(-2, yy, alt ? 28 : 18, 20); g.fillRect(w - (alt ? 28 : 18) + 2, yy, alt ? 28 : 18, 20);
      if (r() < .6) { g.globalAlpha = .45; g.fillRect(r() * w, yy + 18, r.range(20, 70), 2); g.globalAlpha = 1; }
    }
  }), { edge: .5, gran: .3, cover: false, alpha: .7, wobble: 1 });
  p.glaze(g => T(g, g => { // spire
    fillP(g, [[-18, y0], [w + 4, y0 + 2], [tipX, tip]], roofC);
    fillP(g, [[w + 4, y0 + 2], [w + sideW + 18, y0 - sideW * .2], [tipX, tip]], mix(roofC, '#2a3a44', .4));
    fillP(g, P.rect(tipX - 3, tip - 50, 6, 52), '#8a6a3a');
    // copper streaks
    const r = rng('sp'); for (let i = 0; i < 14; i++) { const k = r(); g.fillStyle = rgba('#3f6a62', .3); g.fillRect(lerp(-18, tipX, k) + r() * (w * (1 - k)), y0 - spireH * k * r() , 3, 30); }
  }), { edge: .5, gran: .4, mottle: .35, wobble: 1 });
  p.gouache(g => T(g, g => { g.fillStyle = '#e8b54a'; g.beginPath(); g.arc(tipX, tip - 52, 7, 0, 7); g.fill(); g.fillRect(tipX - 16, tip - 40, 32, 3); }), { wobble: 0 });
  p.glaze(g => T(g, g => { // belfry openings + shadows
    const ow = w * .17, oy = -h + belfry * .18, oh = belfry * .58;
    for (const u of [.18, .6]) { const ox = w * u; g.beginPath(); g.moveTo(ox, oy + oh); g.lineTo(ox, oy + ow + 10); g.arc(ox + ow, oy + ow + 10, ow, Math.PI, 0); g.lineTo(ox + ow * 2, oy + oh); g.closePath(); g.fillStyle = '#3a3242'; g.fill(); }
    g.fillStyle = rgba(sh, .85);
    for (const yy of [-h + belfry + 2, -h + 12]) g.beginPath(), g.moveTo(0, yy), g.lineTo(w, yy), g.lineTo(w + sideW, yy - sideW * .2), g.lineTo(w + sideW, yy + 14 - sideW * .2), g.lineTo(w, yy + 14), g.lineTo(0, yy + 14), g.fill();
    fillP(g, [[w, 0], [w, -h], [w + sideW, -h - sideW * .2], [w + sideW, 0]], rgba(sh, .42));
    g.fillStyle = BGW.vgrad(g, 0, -h * .5, 0, 0, [[0, 'rgba(230,150,100,0)'], [1, 'rgba(230,150,100,.35)']]); fillP(g, [[w, 0], [w, -h * .5], [w + sideW, -h * .5 - sideW * .2], [w + sideW, 0]]);
    g.fillStyle = '#a8813a'; g.beginPath(); g.arc(w * .18 + ow, oy + oh * .62, ow * .5, Math.PI, 0); g.fill();
    if (lit < 1) { g.globalAlpha = 1 - lit; fillP(g, [[-20, 0], [-20, -h - 12], [tipX, tip], [w + sideW + 20, -h - 12], [w + sideW + 20, 0]], sh); g.globalAlpha = 1; }
  }), { edge: .45, gran: .25, cover: false, wobble: 1 });
  // clock face: gold ring + cream face + numerals
  p.glaze(g => { g.fillStyle = '#c99a3a'; g.beginPath(); g.arc(face.cx, face.cy, face.r * 1.14, 0, 7); g.fill(); }, { edge: .5, gran: .4, wobble: 1 });
  p.gouache(g => {
    g.fillStyle = '#f6ecd2'; g.beginPath(); g.arc(face.cx, face.cy, face.r, 0, 7); g.fill();
    g.fillStyle = 'rgba(214,196,160,.8)'; g.beginPath(); g.arc(face.cx + face.r * .12, face.cy + face.r * .12, face.r * .92, 0, 7); g.fill();
    g.fillStyle = '#fbf3df'; g.beginPath(); g.arc(face.cx - face.r * .06, face.cy - face.r * .06, face.r * .8, 0, 7); g.fill();
    g.fillStyle = '#4a3a30';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.save(); g.translate(face.cx + Math.sin(a) * face.r * .8, face.cy - Math.cos(a) * face.r * .8); g.rotate(a); g.fillRect(-face.r * .03, -face.r * .1, face.r * .06, face.r * (i % 3 ? .13 : .2)); g.restore(); }
  }, { wobble: 1, dry: .08 });
  return face;
}
function bgClockHands(g, face, hours, ox = 0, oy = 0, s = 1) {
  const cx = face.cx * s + ox, cy = face.cy * s + oy, r = face.r * s;
  const ah = (hours % 12) / 12 * Math.PI * 2, am = (hours % 1) * Math.PI * 2;
  g.save(); g.lineCap = 'round'; g.strokeStyle = '#3a2c26';
  g.lineWidth = r * .09; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(ah) * r * .5, cy - Math.cos(ah) * r * .5); g.stroke();
  g.lineWidth = r * .055; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(am) * r * .76, cy - Math.cos(am) * r * .76); g.stroke();
  g.fillStyle = '#c99a3a'; g.beginPath(); g.arc(cx, cy, r * .07, 0, 7); g.fill();
  g.restore();
}

// A broadleaf tree (plane / lime) painted in three foliage values with Hobbs washes.
// x, y = base of trunk; s = scale (1 ≈ 420 px tall); light = [-1..1] sun side
function bgPaintTree(p, x, y, s = 1, o = {}) { return bgPaintTrees(p, [{ x, y, s, ...o }], o)[0]; }
// Broadleaf trees (plane / lime) in three foliage values with Hobbs washes, all trees of a list in
// shared passes (fast). Each item: {x, y (trunk base), s (1 ≈ 420 px tall), seed, light, haze, hazeCol}.
function bgPaintTrees(p, list, o = {}) {
  const T = list.map((t0, i) => {
    const t = { light: -1, seed: 'tree' + i, lit: '#b9b65a', mid: '#7f8f4c', dark: '#4c5f4a', trunk: '#5a4636', haze: 0, hazeCol: '#c9bfae', ...o, ...t0 };
    const { x, y, s, seed } = t, r = rng(seed);
    t.hz = c => t.haze ? mix(c, t.hazeCol, t.haze) : c;
    t.clumps = []; const cx = x, cy = y - 300 * s;
    for (let k = 0; k < 9; k++) { const a = r.range(0, Math.PI * 2), d = r.range(0, 1) * 120 * s; t.clumps.push([cx + Math.cos(a) * d * 1.3, cy + Math.sin(a) * d * .75 - 20 * s, r.range(60, 105) * s]); }
    t.trunkP = [[x - 14 * s, y], [x - 9 * s, y - 180 * s], [x - 30 * s, y - 260 * s], [x - 20 * s, y - 266 * s], [x, y - 200 * s], [x + 22 * s, y - 280 * s], [x + 32 * s, y - 272 * s], [x + 10 * s, y - 180 * s], [x + 14 * s, y]];
    t.poly = (k, offx, offy, rs, px, py, pr) => deform(polyCircle(px + offx * pr, py + offy * pr, pr * rs, pr * rs * .85, 12), rng(seed + k + px), 3, .35);
    t.r = r; t.cx = cx; t.cy = cy;
    return t;
  });
  const blobs = (g, t, col, k, offx, offy, rs) => { for (const [px, py, pr] of t.clumps) wash(g, t.poly(k, offx, offy, rs, px, py, pr), col, { seed: t.seed + k + px, layers: 10, alpha: .14, spread: .5, depth: 5, edge: false }); };
  if (o.knock !== false) p.knock(g => T.forEach(t => { BGW.fillP(g, t.trunkP, '#000'); for (const [px, py, pr] of t.clumps) BGW.fillP(g, t.poly('m', 0, 0, 1, px, py, pr), '#000'); }), { erode: 6 });
  p.glaze(g => T.forEach(t => BGW.fillP(g, t.trunkP, t.hz(t.trunk))), { edge: .5, gran: .3 });
  p.glaze(g => T.forEach(t => blobs(g, t, t.hz(t.mid), 'm', 0, 0, 1)), { edge: .5, gran: .25, mottle: .3, wobble: 5, edgeW: 10 });
  p.glaze(g => T.forEach(t => blobs(g, t, t.hz(t.dark), 'd', -t.light * .25, .35, .7)), { edge: .55, gran: .3, mottle: .3, wobble: 5, cover: false });
  p.glaze(g => T.forEach(t => blobs(g, t, t.hz(t.lit), 'l', t.light * .3, -.35, .55)), { edge: .3, gran: .2, mottle: .4, wobble: 3, cover: false, blend: 'source-over', alpha: .75 });
  p.gouache(g => T.forEach(t => { const r = t.r; for (let i = 0; i < 40; i++) { const c = r.pick(t.clumps), a = r() * Math.PI * 2, d = r() * c[2]; g.fillStyle = r() < .5 ? t.hz('#e6dc8a') : t.hz('#3f5242'); g.beginPath(); g.ellipse(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, r.range(3, 8) * t.s, r.range(2, 5) * t.s, r(), 0, 7); g.fill(); } }), { dry: .25, wobble: 1, cover: false });
  return T.map(t => ({ clumps: t.clumps, cx: t.cx, cy: t.cy }));
}

// Cobbles on a ground plane gp (BGW.plane: X across, Z depth, Z up the screen). Rows of rounded stones,
// dropped out in light (suggested, not rendered), with a dry drag.
function bgPaintCobbles(p, gp, o = {}) {
  const { x0 = 0, x1 = gp.uw, z0 = 0, z1 = gp.vh, size = 34, cols = ['#c4a07a', '#b69a88', '#cfae86', '#a88e80'], alpha = .6, seed = 'cob', drop = .3, minPx = 3.5, shadow = '#5b5690', fade = null } = o;
  const N = makeNoise(seed);
  const stones = [];
  const r = rng(seed);
  for (let Z = z0, row = 0; Z < z1; Z += size * .82, row++) {
    const sc = gp.scaleAt(x0 + (x1 - x0) / 2, Z) * size;
    if (sc < minPx) break;
    for (let X = x0 + (row % 2) * size * .5; X < x1; X += size * r.range(.95, 1.1)) {
      const keep = N.fbm(X / 260, Z / 200, 3) + r.range(-.15, .15) - (fade ? fade(X, Z) : 0);
      if (keep < drop + .25) continue;
      const w = size * r.range(.82, .98), d = size * r.range(.62, .78), cx = X + w * .5, cz = Z + d * .5;
      const ring = (k = 1, dx = 0, dz = 0) => { const pts = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; pts.push(gp(cx + dx + Math.cos(a) * w * .47 * k, cz + dz + Math.sin(a) * d * .47 * k)); } return pts; };
      stones.push({ ring, v: r.range(-.2, .2), c: r.pick(cols), w, d, k: clamp(keep * 1.3) });
    }
  }
  // stone tints
  p.glaze(g => stones.forEach(st => BGW.fillP(g, st.ring(), mix(st.c, st.v > 0 ? '#f4e0bc' : '#7a6a78', Math.abs(st.v)))),
    { edge: .55, edgeW: 3, gran: .3, mottle: .5, wobble: 1, cover: false, alpha: alpha * .6, dark: .55 });
  // gap shadows: crescents on the near (lower) side of each stone
  p.glaze(g => {
    g.fillStyle = shadow;
    stones.forEach(st => { const A = st.ring(1.04), B = st.ring(1.04, st.w * .06, st.d * .2); g.save(); tracePoly(g, A); g.clip(); g.beginPath(); g.moveTo(A[0][0], A[0][1]); A.forEach(q => g.lineTo(q[0], q[1])); g.closePath(); g.moveTo(B[0][0], B[0][1]); B.forEach(q => g.lineTo(q[0], q[1])); g.closePath(); g.fill('evenodd'); g.restore(); });
  }, { edge: .3, edgeW: 2, gran: .3, mottle: .5, wobble: 1, cover: false, alpha: alpha * .8, streak: .2 });
  // sunlit tops: pale dabs (gouache, broken)
  p.gouache(g => stones.forEach(st => { if (st.v < .05) return; const A = st.ring(.6, -st.w * .08, st.d * .12); BGW.fillP(g, A, 'rgba(255,236,200,.5)'); }), { wobble: 1, dry: .45, cover: false });
}

// =====================================================================================================
// Animated helpers (cheap per frame)
// =====================================================================================================
// small drifting clouds: painted sprites (cached), moving with t
function bgCloudSprite(seed, w, h, o = {}) {
  const { rim = '#ffe0a8', shade = '#9888ac', body = '#fcf1e2', belly = '#cdbac8', light = [-1, -.7] } = o;
  return BGW.plate('cloudsprite:' + seed + ':' + w + 'x' + h + rim + shade + light, w, h, p => {
    const r = rng(seed);
    BGK.cloud(p, BGK.cloudPuffs(r, w / 2, h * .82, w * .58, h * .66, 10, .5), { body, belly, shade, rim, light, soft: 1.2, cover: true, front: 0 });
  });
}
function bgCloudDrift(g, t, o = {}) {
  const { y0 = 100, y1 = 300, seed = 'cd', n = 3, speed = 10, offset = 0, alpha = .95, scale = 1, span = W } = o;
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const w = Math.round(r.range(240, 420) * scale), h = Math.round(w * r.range(.4, .55)), y = r.range(y0, y1), sp = speed * r.range(.6, 1.4);
    const S = span + w * 2, x = ((r() * S + t * sp + offset) % S + S) % S - w;
    g.save(); g.globalAlpha = alpha; g.drawImage(bgCloudSprite(seed + i, w, h, o), x, y); g.restore();
  }
}
function bgSunGlow(g, x, y, o = {}) {
  const { a = .5, r = 900, col = '255,196,120' } = o;
  g.save(); g.globalCompositeOperation = 'screen';
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(.35, `rgba(${col},${a * .4})`); gr.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
}
// flickering warm glows: pts [[x, y, scale?], ...]
function bgLampGlow(g, t, pts, o = {}) {
  const { r = 80, a = .5, col = '255,200,120', flicker = 1 } = o;
  g.save(); g.globalCompositeOperation = 'screen';
  pts.forEach(([x, y, s = 1], i) => {
    const R = r * s; if (x < -R * 2 || x > W + R * 2 || y < -R * 2 || y > H + R * 2) return;
    const f = 1 + flicker * (.07 * Math.sin(t * 9.1 + i * 2.3) + .05 * Math.sin(t * 23.7 + i * 5.1) + (Math.sin(t * 2.3 + i * 7) > .985 ? -.2 : 0));
    const gr = g.createRadialGradient(x, y, 0, x, y, R * f);
    gr.addColorStop(0, `rgba(${col},${a * f})`); gr.addColorStop(.25, `rgba(${col},${a * .5 * f})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.fillRect(x - R * 1.3, y - R * 1.3, R * 2.6, R * 2.6);
  });
  g.restore();
}
// windmill (tower + rotating sails), drawn per frame; muted for distance via col/sail
function bgWindmill(g, t, x, y, s = 1, o = {}) {
  const { col = '#b8a49a', sail = '#e2d4be', cap = '#8a6a5a', speed = .25, angle = null, shade = 'rgba(80,70,110,.35)', soft = s < .7 ? .9 : 0 } = o;
  if (soft) { // draw at full size into a small offscreen, blur it there, blit (a filter on the main canvas is very slow)
    const S = 300 * s, A = BGW.scratch('mill-a', S, S), B = BGW.scratch('mill-b', S, S);
    bgWindmill(A.getContext('2d'), t, S / 2, S * .55, s, { ...o, soft: 0 });
    const b = B.getContext('2d'); b.filter = `blur(${soft}px)`; b.drawImage(A, 0, 0); b.filter = 'none';
    g.drawImage(B, 0, 0, S, S, x - S / 2, y - S * .55, S, S);
    return;
  }
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = col; g.beginPath(); g.moveTo(-30, 90); g.lineTo(-19, -40); g.lineTo(19, -40); g.lineTo(30, 90); g.closePath(); g.fill();
  g.fillStyle = shade; g.beginPath(); g.moveTo(4, 90); g.lineTo(4, -40); g.lineTo(19, -40); g.lineTo(30, 90); g.closePath(); g.fill();
  g.fillStyle = cap; g.beginPath(); g.moveTo(-25, -38); g.quadraticCurveTo(0, -74, 25, -38); g.closePath(); g.fill();
  g.fillStyle = 'rgba(58,48,64,.6)'; g.fillRect(-6, 60, 12, 30); g.fillRect(-4, 10, 8, 12);
  const a0 = angle ?? t * speed * Math.PI * 2;
  g.translate(0, -44);
  for (let i = 0; i < 4; i++) {
    g.save(); g.rotate(a0 + i * Math.PI / 2);
    g.fillStyle = cap; g.fillRect(-2, 0, 4, 125);
    g.globalAlpha = .9; g.fillStyle = sail; g.fillRect(3, 24, 22, 100);
    g.globalAlpha = .4; g.fillStyle = cap; for (let k = 32; k < 122; k += 13) g.fillRect(3, k, 22, 1.6); g.fillRect(14, 24, 1.6, 100);
    g.restore();
  }
  g.globalAlpha = 1; g.fillStyle = cap; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill();
  g.restore();
}
// twinkling windows: pts [[x, y, w, h], ...]; a deterministic subset turns on/off over time
function bgWindowTwinkle(g, t, pts, o = {}) {
  const { col = '255,196,110', a = .85, rate = .15, seed = 'tw' } = o;
  g.save(); g.globalCompositeOperation = 'screen';
  pts.forEach(([x, y, w, h], i) => {
    const ph = (hashStr(seed + i) % 1000) / 1000, k = Math.floor(t * rate + ph * 7);
    const on = (hashStr(seed + i + ':' + k) % 100) < 70;
    const f = on ? 1 : .15, fl = .9 + .1 * Math.sin(t * 7 + i);
    g.fillStyle = `rgba(${col},${a * f * fl})`; g.fillRect(x, y, w, h);
    const gr = g.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) * 1.6);
    gr.addColorStop(0, `rgba(${col},${.35 * f})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.fillRect(x - w * 1.5, y - h * 1.5, w * 4, h * 4);
  });
  g.restore();
}
// water glints: short horizontal flecks that blink, inside rect [x, y, w, h] (y-band perspective: denser near)
function bgWaterGlints(g, t, x, y, w, h, o = {}) {
  const { n = 120, col = '255,236,190', seed = 'wg', a = .9, size = 1 } = o;
  const r = rng(seed);
  g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) {
    const u = r(), v = Math.pow(r(), .7), ph = r() * 10, sp = r.range(1.5, 4);
    const k = Math.sin(t * sp + ph); if (k < .55) continue;
    const px = x + u * w + Math.sin(t * .5 + ph) * 6, py = y + v * h, L = (4 + v * 22) * size * r.range(.6, 1.4);
    g.fillStyle = `rgba(${col},${a * (k - .55) / .45})`;
    g.fillRect(px - L / 2, py, L, Math.max(1, (1 + v * 2.5) * size));
  }
  g.restore();
}

// =====================================================================================================
// 1. TOWN SQUARE at golden hour — U-shaped square, wide panorama, 4 parallax layers
// =====================================================================================================
const BGTOWN = { MW: 3200, HY: 560, VPX: 1600, BASE: 790 };
BGTOWN.layers = function () {
  const { MW, HY, VPX, BASE } = BGTOWN, PAN = MW - W;
  const { P, rough, fillP, blob, vgrad, stroke } = BGW, K = BGK, sh = K.COL.shadow;
  const L = {};
  // ---------------- sky (factor .2)
  L.skyF = .2;
  L.sky = BGW.plate('town-sky', W + PAN * L.skyF, H, p => {
    const w = p.w, r = rng('tsky');
    K.skyWash(p, 0, 0, w, H, [[0, '#5383b8'], [.22, '#86a9c6'], [.42, '#d6c6b2'], [.58, '#f3cd98'], [1, '#f8dba2']]);
    p.glaze(g => { g.save(); g.scale(1, .45); const gr = g.createRadialGradient(-150, 600 / .45, 40, -150, 600 / .45, 1500); gr.addColorStop(0, 'rgba(255,184,104,.85)'); gr.addColorStop(.5, 'rgba(250,176,116,.3)'); gr.addColorStop(1, 'rgba(250,176,116,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, H / .45); g.restore(); }, { edge: 0, wobble: 0, gran: .04, mottle: .25 });
    p.glaze(g => { g.fillStyle = vgrad(g, 0, 0, w, 0, [[0, 'rgba(110,130,170,0)'], [1, 'rgba(100,120,170,.4)']]); g.fillRect(0, 0, w, 460); }, { edge: 0, wobble: 0, gran: .08, soft: 40 });
    K.streaks(p, r, 7, -100, w, 330, 520, '#d79f8e');
    K.streaks(p, r, 4, 300, w, 120, 240, '#c9a9b4', { alpha: .35 });
    K.cloud(p, K.cloudPuffs(r, 1500, 470, 700, 420, 30, .9), { light: [-1, -.55] });
    K.cloud(p, K.cloudPuffs(r, 2060, 400, 360, 200, 16, .6), { light: [-1, -.55] });
    K.cloud(p, K.cloudPuffs(r, 620, 330, 260, 110, 12, .3), { light: [-1, -.55], shadeA: .35 });
    p.salt(g => g.rect(0, 0, w, 200), 70, { rmin: 2, rmax: 8, alpha: .2 });
  }, { full: true });
  // ---------------- far: hills, windmill hill, distant roofs (factor .5)
  L.farF = .5;
  L.far = BGW.plate('town-far', W + PAN * L.farF, H, p => {
    const w = p.w, r = rng('tfar');
    const h1 = K.ridge('th1', -40, w + 40, 520, 60, 24, 1.1), h2 = K.ridge('th2', -40, w + 40, 590, 34, 24, 2.2);
    p.glaze(g => fillP(g, [...h1, [w + 40, H], [-40, H]], '#b0a7ae'), { edge: .3, soft: 2, wobble: 8, alpha: .55, gran: .2 });
    p.glaze(g => fillP(g, [...h2, [w + 40, H], [-40, H]], '#a4ab8e'), { edge: .35, soft: 1, wobble: 5, alpha: .55, gran: .25 });
    p.glaze(g => { for (let i = 0; i < 90; i++) { const x = r() * w, y = K.ridgeY(h2, x) + r.range(6, 40); g.fillStyle = '#7d8a6a'; g.beginPath(); g.ellipse(x, y, r.range(5, 12), r.range(6, 14), 0, 0, 7); g.fill(); } }, { edge: .5, alpha: .45, gran: .2, wobble: 2 });
    // distant roofs
    const pl = BGW.plane([[0, 600], [w, 600], [w, 360], [0, 360]], w / .6, 400);
    const hs = []; let u = -30;
    while (u < w / .6) { const hw = r.range(120, 200); hs.push(K.house(pl, u, hw, r.range(260, 380), r, { brick: false, boxes: false, balcony: -1, detail: 0, shutterP: 0, curtains: 0, glowP: 0 })); u += hw + r.range(-8, 4); }
    bgPaintFacades(p, hs, { haze: .55, hazeCol: '#cdb7b2', detail: 0 });
    // church spire
    const sx = w * .74;
    p.knock(g => fillP(g, [[sx, 700], [sx, 300], [sx + 60, 300], [sx + 60, 700]], '#000'));
    p.glaze(g => { fillP(g, [[sx, 700], [sx, 300], [sx + 60, 300], [sx + 60, 700]], '#c2b0ac'); fillP(g, [[sx - 6, 304], [sx + 30, 120], [sx + 66, 304]], '#9a96a8'); fillP(g, P.rect(sx + 18, 250, 24, 36), '#7c7488'); }, { edge: .4, alpha: .85 });
  });
  L.mill = [L.far.width * .14, 470, .5];
  // ---------------- mid: the square (factor 1)
  L.mid = BGW.plate('town-mid', MW, H, p => {
    const r = rng('tmid');
    const BL = 700, BR = 2500, slope = (BASE - HY) / (VPX - BL);       // receding bottom lines
    const yAt = x => HY + Math.abs(VPX - x) * slope;
    const topY = (x, x0, y0) => HY + (y0 - HY) * (VPX - x) / (VPX - x0);
    // ground plane
    const GZ = 1180, gl = VPX - (GZ - HY) / slope, gr = VPX + (GZ - HY) / slope;
    const gp = BGW.plane([[gl, GZ], [gr, GZ], [BR, BASE], [BL, BASE]], 1800, 1500);
    p.glaze(g => { g.fillStyle = vgrad(g, 0, BASE - 20, 0, H, [[0, '#e3c495'], [.5, '#d4b088'], [1, '#b39478']]); g.fillRect(0, BASE - 40, MW, H - BASE + 40); }, { edge: 0, gran: .3, mottle: .4, wobble: 0, cover: true });
    // shadow of the left row across the floor (sun front-left → shadows fall back-right)
    // (painted before cobbles so stones sit in it)
    p.glaze(g => fillP(g, [gp(-400, 0), gp(380, 0), gp(330, 300), gp(250, 700), gp(180, 1100), gp(120, 1500), gp(-400, 1500)].map(q => q), sh), { alpha: .5, edge: .35, wobble: 8, soft: 2, cover: false });
    bgPaintCobbles(p, gp, { x0: -900, x1: 2700, z0: 0, z1: 1500, size: 30, alpha: .55, drop: .12, minPx: 3 });
    // warm light pooling on the lit part of the square
    p.glaze(g => { const c = gp(1100, 600); const grd = g.createRadialGradient(c[0], c[1], 20, c[0], c[1], 900); grd.addColorStop(0, 'rgba(255,200,120,.55)'); grd.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = grd; g.fillRect(0, BASE - 20, MW, H); }, { blend: 'soft-light', edge: 0, wobble: 0, cover: false });
    // --- back row (frontal)
    const fr = BGW.plane([[0, BASE], [MW, BASE], [MW, BASE - 400], [0, BASE - 400]], MW, 400);
    const backL = [], backR = [];
    let u = BL - 10;
    for (const hw of [190, 170, 200]) { backL.push(K.house(fr, u, hw, r.range(330, 420), r)); u += hw; }
    u = 1950;
    for (const hw of [180, 200, 180]) { backR.push(K.house(fr, u, hw, r.range(330, 420), r)); u += hw; }
    backL[1].shop = { awning: ['#d97757', '#f3e6cf'] }; backR[1].shop = { awning: ['#4f7d78', '#efe3c8'] };
    backL[2].sign = { kind: 'disc', col: '#c99a3a' }; backR[0].balcony = 1;
    // hall wings either side of the tower
    const wingL = K.house(fr, 1250, 262, 290, r, { roofType: 'hip', rh: 90, wall: '#f0dcae', roof: '#a24f3a', cols: 3, floors: 3, shutter: '#4f7d78', arch: true, boxes: true, brick: false, chimneys: [], lean: .004, tilt: 0, balcony: 1, shutterP: 1, glowP: .1, door: .4 });
    const wingR = K.house(fr, 1688, 262, 290, r, { roofType: 'hip', rh: 90, wall: '#f0dcae', roof: '#a24f3a', cols: 3, floors: 3, shutter: '#4f7d78', arch: true, boxes: true, brick: false, chimneys: [], lean: -.004, tilt: 0, balcony: 1, shutterP: 1, glowP: .1, door: .4 });
    bgPaintFacades(p, [...backL, ...backR, wingL, wingR], {});
    L.face = bgPaintTower(p, 1512, BASE, 176, 565, { lean: .015, side: 40, spireH: 165 });
    // tower door + steps
    p.glaze(g => { const x0 = 1560, dw = 80; g.beginPath(); g.moveTo(x0, BASE); g.lineTo(x0, BASE - 120); g.arc(x0 + dw / 2, BASE - 120, dw / 2, Math.PI, 0); g.lineTo(x0 + dw, BASE); g.closePath(); g.fillStyle = '#4e3426'; g.fill(); }, { edge: .5 });
    p.gouache(g => { for (let s = 0; s < 3; s++) { g.fillStyle = s % 2 ? '#e6d2ac' : '#d8c29a'; g.fillRect(1530 - s * 16, BASE + s * 9 - 4, 140 + s * 32, 9); } }, { wobble: 1, dry: .2 });
    // --- left row (receding, in shade) and right row (receding, sunlit)
    const lx0 = -160, ltop0 = topY(lx0, BL, BASE - 410);
    const lpl = BGW.plane([[lx0, yAt(lx0)], [BL, BASE], [BL, BASE - 410], [lx0, ltop0]], 1500, 410);
    const left = []; u = 0;
    for (const hw of [230, 200, 190, 220, 180, 200, 170, 200]) { left.push(K.house(lpl, u, hw, r.range(330, 430), r, { lit: .2 })); u += hw; }
    left[0].shop = { awning: ['#a9453a', '#f2e6d0'] }; left[3].shop = { awning: ['#6d4a5e', '#efe0c9'] };
    const rx0 = MW + 160, rtop0 = topY(rx0, BR, BASE - 410);
    const rpl = BGW.plane([[BR, BASE], [rx0, yAt(rx0)], [rx0, rtop0], [BR, BASE - 410]], 1500, 410);
    const right = []; u = 0;
    const rws = [180, 210, 190, 200, 230, 200, 190, 200];
    for (const hw of rws) { right.push(K.house(rpl, u, hw, r.range(330, 430), r, { lit: 1 })); u += hw; }
    right[2].shop = { awning: ['#d6a443', '#f3e6cf'] }; right[6].shop = { awning: ['#d97757', '#f3e6cf'] }; right[4].sign = { kind: 'rect', col: '#4f7d78', u: 20 };
    // paint far → near: houses nearer the camera last (knock-out handles overlap)
    bgPaintFacades(p, left.slice().reverse(), { light: -1 });
    bgPaintFacades(p, right.slice(), { light: -1 });
    // extra golden glaze on the sunlit right row
    p.glaze(g => fillP(g, [rpl(0, -30), rpl(1500, -30), rpl(1500, 520), rpl(0, 520)], 'rgba(255,190,110,.35)'), { blend: 'soft-light', edge: 0, wobble: 0, cover: false });
    // trees in the square
    bgPaintTrees(p, [{ x: 560, y: 905, s: 1.05, seed: 'treeL' }, { x: 2780, y: 900, s: .9, seed: 'treeR' }], { light: -1 });
    // tree shadows on the cobbles
    p.glaze(g => { for (const [tx, ty, s] of [[560, 905, 1.05], [2780, 900, .9]]) { g.fillStyle = sh; g.beginPath(); g.ellipse(tx + 160 * s, ty + 6, 220 * s, 26 * s, -.08, 0, 7); g.fill(); } }, { alpha: .4, soft: 4, wobble: 8, cover: false });
    L.gp = gp;
  });
  // ---------------- near: café tables, lamps, sunflowers (factor 1.3)
  L.nearF = 1.3;
  const NW = W + PAN * L.nearF;
  L.lamps = [[150, 300], [1300, 300], [2950, 300]];
  L.near = BGW.plate('town-near', NW, H, p => {
    const r = rng('tnear');
    // lamp posts: dark green iron with lit left edge
    p.knock(g => L.lamps.forEach(([lx, ly]) => { fillP(g, P.rect(lx - 8, ly + 30, 16, H - ly), '#000'); fillP(g, [[lx - 34, ly], [lx + 34, ly], [lx + 22, ly - 52], [lx - 22, ly - 52]], '#000'); fillP(g, [[lx - 22, ly], [lx + 22, ly], [lx + 18, ly + 44], [lx - 18, ly + 44]], '#000'); }));
    p.glaze(g => L.lamps.forEach(([lx, ly]) => {
      fillP(g, P.rect(lx - 7, ly + 40, 14, H - ly), '#34463f'); fillP(g, P.rect(lx - 16, H - 70, 32, 80), '#34463f'); fillP(g, P.rect(lx - 12, ly + 40, 24, 12), '#34463f');
      fillP(g, [[lx - 34, ly], [lx + 34, ly], [lx + 22, ly - 52], [lx - 22, ly - 52]], '#2f3d38'); fillP(g, P.rect(lx - 3, ly - 70, 6, 20), '#2f3d38');
    }), { edge: .5, gran: .25, wobble: 1 });
    p.gouache(g => L.lamps.forEach(([lx, ly]) => { fillP(g, [[lx - 22, ly], [lx + 22, ly], [lx + 18, ly + 42], [lx - 18, ly + 42]], '#f6dfa4'); g.fillStyle = 'rgba(255,226,170,.6)'; g.fillRect(lx - 7, ly + 50, 3, H - ly - 50); }), { wobble: 1, dry: .1 });
    // café tables + chairs (left, near the café)
    const tables = [[380, 930], [700, 980]];
    p.knock(g => tables.forEach(([tx, ty]) => { g.beginPath(); g.ellipse(tx, ty - 120, 80, 14, 0, 0, 7); g.fill(); fillP(g, P.rect(tx - 6, ty - 120, 12, 120), '#000'); fillP(g, P.rect(tx - 44, ty - 6, 88, 10), '#000'); }));
    p.glaze(g => tables.forEach(([tx, ty]) => {
      fillP(g, P.rect(tx - 5, ty - 118, 10, 116), '#4a3a34'); fillP(g, P.rect(tx - 42, ty - 6, 84, 8), '#4a3a34');
      for (const [cx, dir] of [[tx - 120, -1], [tx + 120, 1]]) { // bistro chairs
        g.beginPath(); g.ellipse(cx, ty - 64, 24, 7, 0, 0, 7); g.fillStyle = '#6a4434'; g.fill();
        stroke(g, [[cx - 18, ty - 62], [cx - 22, ty]], 4, '#3e3230', 'cl' + cx, .1); stroke(g, [[cx + 18, ty - 62], [cx + 22, ty]], 4, '#3e3230', 'cr' + cx, .1);
        stroke(g, [[cx + dir * 20, ty - 64], [cx + dir * 24, ty - 120], [cx + dir * 4, ty - 140], [cx - dir * 14, ty - 124], [cx - dir * 6, ty - 66]], 4.5, '#3e3230', 'cb' + cx, .15);
      }
    }), { edge: .45, gran: .2, wobble: 1 });
    p.gouache(g => tables.forEach(([tx, ty], i) => {
      g.fillStyle = '#f5ead2'; g.beginPath(); g.ellipse(tx, ty - 120, 80, 14, 0, 0, 7); g.fill();
      g.fillStyle = 'rgba(160,140,170,.6)'; g.beginPath(); g.ellipse(tx + 8, ty - 116, 72, 9, 0, 0, Math.PI); g.fill();
      g.fillStyle = '#f9f3e3'; g.fillRect(tx - 20 + i * 10, ty - 142, 14, 18); g.fillStyle = '#7a4a2a'; g.fillRect(tx - 20 + i * 10, ty - 142, 14, 4);
      g.fillStyle = '#d97757'; g.fillRect(tx + 18, ty - 150, 8, 26); g.fillStyle = '#f2c94c'; g.beginPath(); g.arc(tx + 22, ty - 154, 7, 0, 7); g.fill();
    }), { wobble: 1, dry: .15 });
    // sunflower pots (right of centre) and a bench
    const pots = [[2260, 1030, 1], [2350, 1050, .9]];
    const flowers = []; pots.forEach(([px, py, s], j) => { for (let k = 0; k < 4; k++) flowers.push([px + (k - 1.5) * 34 * s + r.gauss() * 6, py - (220 + k * 34 + r.range(0, 50)) * s, s, px + (k - 1.5) * 10, py - 70 * s]); });
    p.knock(g => { pots.forEach(([px, py, s]) => fillP(g, [[px - 52 * s, py - 72 * s], [px + 52 * s, py - 72 * s], [px + 38 * s, py + 40], [px - 38 * s, py + 40]], '#000')); });
    p.glaze(g => { pots.forEach(([px, py, s]) => { fillP(g, [[px - 52 * s, py - 72 * s], [px + 52 * s, py - 72 * s], [px + 38 * s, py + 40], [px - 38 * s, py + 40]], '#c66a44'); fillP(g, P.rect(px - 56 * s, py - 82 * s, 112 * s, 16 * s), '#b0583a'); }); flowers.forEach(([fx, fy, s, bx, by], i) => { stroke(g, [[bx, by], [lerp(bx, fx, .5) + 6, lerp(by, fy, .5)], [fx, fy]], 6 * s, '#5d7a3e', 'stm' + i, .2); fillP(g, deform(polyCircle(lerp(bx, fx, .6) + 18, lerp(by, fy, .6), 22 * s, 10 * s, 8, .5), rng('lf' + i), 2, .2), '#6d8a44'); }); }, { edge: .45, gran: .25, wobble: 1 });
    p.gouache(g => flowers.forEach(([fx, fy, s], i) => { for (let q = 0; q < 16; q++) { const a = q / 16 * Math.PI * 2 + i; g.fillStyle = q % 2 ? '#f2b33d' : '#e39a24'; g.beginPath(); g.ellipse(fx + Math.cos(a) * 24 * s, fy + Math.sin(a) * 20 * s, 15 * s, 6.5 * s, a, 0, 7); g.fill(); } g.fillStyle = '#5e3a20'; g.beginPath(); g.arc(fx, fy, 14 * s, 0, 7); g.fill(); g.fillStyle = 'rgba(255,220,150,.5)'; g.beginPath(); g.arc(fx - 4 * s, fy - 4 * s, 6 * s, 0, 7); g.fill(); }), { wobble: 1, dry: .1, edge: .5, edgeW: 2 });
    // pot shading (sun from the left)
    p.glaze(g => pots.forEach(([px, py, s]) => fillP(g, [[px + 6 * s, py - 72 * s], [px + 52 * s, py - 72 * s], [px + 38 * s, py + 40], [px + 4 * s, py + 40]], sh)), { alpha: .45, cover: false, wobble: 1 });
  });
  // shadow overlay for the near layer (multiply): foreground shade band + long lamp/pot shadows
  L.nearShadow = BGW.plate('town-nearsh', NW, H, p => {
    const w = p.w;
    // the long shadow of the buildings behind the camera: a roofline silhouette thrown across the cobbles
    p.glaze(g => {
      const r = rng('roofsh'); g.beginPath(); g.moveTo(-10, H + 10); let x = -10, y0 = 945;
      g.lineTo(x, y0);
      while (x < w + 10) {
        const bw = r.range(140, 300), by = y0 + x * .018, kind = r();
        if (kind < .45) { g.lineTo(x, by); g.lineTo(x + bw / 2, by - r.range(26, 50)); g.lineTo(x + bw, by); }
        else if (kind < .7) { g.lineTo(x, by); g.lineTo(x + bw * .4, by); g.lineTo(x + bw * .4, by - 40); g.lineTo(x + bw * .4 + 22, by - 40); g.lineTo(x + bw * .4 + 22, by); g.lineTo(x + bw, by); }
        else { g.lineTo(x, by - 14); g.lineTo(x + bw, by - 14); }
        x += bw;
      }
      g.lineTo(w + 10, H + 10); g.closePath(); g.fillStyle = sh; g.fill();
    }, { alpha: .5, soft: 3, wobble: 8, edge: .35 });
    p.glaze(g => L.lamps.forEach(([lx]) => { g.fillStyle = sh; g.beginPath(); g.moveTo(lx - 10, 1080); g.lineTo(lx + 1100, 800); g.lineTo(lx + 1130, 806); g.lineTo(lx + 24, 1080); g.closePath(); g.fill(); }), { alpha: .35, soft: 2, wobble: 5 });
    p.glaze(g => [[380, 930], [700, 980], [2260, 1030], [2350, 1050]].forEach(([x, y]) => { g.fillStyle = sh; g.beginPath(); g.ellipse(x + 120, y + 4, 150, 14, -.12, 0, 7); g.fill(); }), { alpha: .35, soft: 3, wobble: 5 });
  }, { blank: true });
  return L;
};

// opts: pan 0..1, light 0..1 (extra golden glow), clock (hours), lamps 0..1, drift (cloud speed mult)
function bgTown(g, t, opts = {}) {
  const L = BGTOWN._L || (BGTOWN._L = BGTOWN.layers());
  const pan = clamp(opts.pan ?? 0), cam = pan * (BGTOWN.MW - W), part = opts.part || 'all';
  const nx = -cam * L.nearF;
  if (part !== 'front') {
  BGW.layer(g, L.sky, -cam * L.skyF);
  bgCloudDrift(g, t * (opts.drift ?? 1), { y0: 140, y1: 300, seed: 'townc', n: 2, offset: -cam * L.skyF * 1.4, scale: .8 });
  const fx = -cam * L.farF;
  BGW.layer(g, L.far, fx);
  bgWindmill(g, t, L.mill[0] + fx, L.mill[1], L.mill[2], { col: '#b5a8a8', sail: '#d8ccc0', cap: '#958484' });
  BGW.layer(g, L.mid, -cam);
  bgClockHands(g, L.face, opts.clock ?? 18.66, -cam, 0);
  bgSunGlow(g, -250 - cam * .15, 420, { a: .45 + .3 * (opts.light ?? 0), r: 1100 });
  g.save(); g.globalCompositeOperation = 'multiply'; BGW.layer(g, L.nearShadow, nx); g.restore();
  }
  if (part === 'back') return;
  BGW.layer(g, L.near, nx);
  bgLampGlow(g, t, L.lamps.map(([x, y]) => [x + nx, y + 20]), { r: 70, a: .25 * (opts.lamps ?? 1) });
}

// =====================================================================================================
// 2. CLOCK-TOWER ROOFTOP at golden hour — the chorus stage. Sun low at the right; upper left calm sky.
// =====================================================================================================
const BGROOF = { WW: 2240 };
BGROOF.layers = function () {
  const { WW } = BGROOF, PAN = WW - W;
  const { P, rough, fillP, vgrad, stroke } = BGW, K = BGK, sh = '#5e5890';
  const L = {};
  L.skyF = .15;
  L.sky = BGW.plate('roof-sky', W + PAN * L.skyF, H, p => {
    const w = p.w, r = rng('rsky');
    K.skyWash(p, 0, 0, w, H, [[0, '#5d88b8'], [.3, '#90adc6'], [.48, '#d9c7b2'], [.6, '#f3c993'], [1, '#f6d29a']]);
    p.glaze(g => { const gr = g.createRadialGradient(w - 120, 560, 30, w - 120, 560, 1200); gr.addColorStop(0, 'rgba(255,186,100,.9)'); gr.addColorStop(.35, 'rgba(252,176,110,.45)'); gr.addColorStop(1, 'rgba(250,170,110,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, H); }, { edge: 0, wobble: 0, gran: .04, mottle: .25 });
    K.streaks(p, r, 6, w * .45, w + 200, 380, 540, '#e09a7e', { alpha: .55 });
    K.streaks(p, r, 3, w * .55, w, 200, 300, '#d6a6a8', { alpha: .3 });
    K.cloud(p, K.cloudPuffs(r, w * .74, 470, 600, 400, 26, .9), { light: [1, -.75], d1: 1.3, body: '#fff0d6', rim: '#ffd08c' });
    K.cloud(p, K.cloudPuffs(r, w * .56, 430, 240, 110, 12, .4), { light: [1, -.4], shadeA: .35 });
  }, { full: true });
  L.farF = .3;
  L.far = BGW.plate('roof-far', W + PAN * L.farF, H, p => {
    const w = p.w, r = rng('rfar');
    const h1 = K.ridge('rh1', -40, w + 40, 470, 80, 24, 1.0), h2 = K.ridge('rh2', -40, w + 40, 525, 36, 24, 1.8);
    p.glaze(g => fillP(g, [...h1, [w + 40, H], [-40, H]], '#b9a9b6'), { edge: .35, soft: 1.5, wobble: 8, gran: .2, sep: .3 });
    p.glaze(g => { g.fillStyle = vgrad(g, 0, 400, 0, 560, [[0, 'rgba(150,140,170,.0)'], [1, 'rgba(150,140,170,.35)']]); fillP(g, [...h1, [w + 40, H], [-40, H]]); }, { edge: 0, soft: 3, wobble: 0, cover: false });
    p.glaze(g => fillP(g, [...h2, [w + 40, H], [-40, H]], '#adb08e'), { edge: .4, soft: 1, wobble: 5, gran: .25, sep: .3 });
    // fields & hedgerows on the near hill
    p.glaze(g => { for (let i = 0; i < 30; i++) { const x = r() * w, y = K.ridgeY(h2, x) + r.range(10, 50), ww = r.range(60, 160); g.fillStyle = r.pick(['#c2b97e', '#9fab70', '#cdb886', '#b7a46e']); g.beginPath(); g.moveTo(x, y); g.lineTo(x + ww, y - 5); g.lineTo(x + ww + 16, y + 9); g.lineTo(x + 10, y + 14); g.closePath(); g.fill(); } }, { edge: .45, alpha: .55, gran: .25, wobble: 2, cover: false });
    p.glaze(g => { for (let i = 0; i < 90; i++) { const x = r() * w, y = K.ridgeY(h2, x) + r.range(4, 60); g.fillStyle = '#6c7a60'; g.beginPath(); g.ellipse(x, y, r.range(4, 9), r.range(5, 10), 0, 0, 7); g.fill(); } }, { edge: .5, alpha: .5, gran: .2, wobble: 2 });
    // funicular track up the far hill
    const fx0 = w * .64, fx1 = w * .74; L.fun = [[fx0, K.ridgeY(h2, fx0) + 40], [fx1, K.ridgeY(h1, fx1) + 14]];
    p.glaze(g => { stroke(g, [L.fun[0], L.fun[1]], 5, '#7a6a6a', 'fun', 0); stroke(g, [[L.fun[1][0] - 14, L.fun[1][1] + 2], [L.fun[1][0] + 18, L.fun[1][1] - 4]], 12, '#9a8a86', 'fun2', 0); }, { edge: .4, alpha: .7, wobble: 1, cover: false });
    L.mill = [w * .27, K.ridgeY(h1, w * .27) + 8 - 90 * .5, .5];
    // haze band at the foot of the hills
    p.glaze(g => { g.fillStyle = vgrad(g, 0, 470, 0, 600, [[0, 'rgba(244,206,166,0)'], [1, 'rgba(244,206,166,.85)']]); g.fillRect(0, 470, w, 300); }, { blend: 'screen', edge: 0, wobble: 0, cover: false, alpha: .55 });
  });
  // ---- the sea of roofs, far → near; each row hazier with distance, simpler too
  L.midF = .6;
  L.mid = BGW.plate('roof-mid', W + PAN * L.midF, H, p => {
    const w = p.w, r = rng('rmid');
    const rows = [[548, .2, .6, 0], [585, .28, .48, 0], [632, .38, .36, 1], [700, .5, .24, 1], [790, .64, .13, 1], [900, .8, .05, 2], [1040, 1, 0, 2]];
    L.glints = [];
    rows.forEach(([base, s, haze, lv], i) => {
      const pl = BGW.plane([[0, base], [w, base], [w, base - 400 * s], [0, base - 400 * s]], w / s, 400);
      const hs = []; let u = -r.range(20, 120);
      const gapA = i === 3 ? [1300, 2300] : i === 5 ? [1500, 1760] : null;
      while (u < w / s + 40) {
        if (gapA && u > gapA[0] && u < gapA[1]) { u = gapA[1]; continue; }
        const big = r() < .2, hw = big ? r.range(300, 440) : r.range(130, 240);
        const type = r.pick(['hip', 'hip', 'gable', 'mansard', 'gable', 'hip']), rh = Math.min(140, hw * (type === 'gable' ? r.range(.5, .75) : r.range(.32, .55)));
        const tot = (base - (470 + (base - 470) * .5)) / s, hh = Math.max(90, tot * r.range(.8, 1.15) - rh * (type === 'gable' ? .6 : .7));
        hs.push(K.house(pl, u, hw, hh, r, { roofType: type, rh, floors: i >= 5 ? 3 : 2, cols: Math.max(1, Math.round(hw / 95)), boxes: i >= 5, balcony: i >= 5 && r() < .3 ? 1 : -1, shop: null, brick: i >= 5 && r() < .4, chimneys: big ? [.2, .55, .85] : r() < .8 ? [r.range(.15, .85)] : [], lean: r.gauss() * .03 }));
        u += hw + r.range(-16, 8);
      }
      if (i === 1) hs.push(K.house(pl, 3200, 260, 300, r, { roofType: 'gable', rh: 260, wall: '#ecdcc4', roof: '#7a768e', cols: 2, floors: 3, arch: true, chimneys: [] }));
      if (i === 2) hs.push(K.house(pl, 1150, 300, 260, r, { roofType: 'step', rh: 200, wall: '#f0d9b0', roof: '#a24f3a', cols: 3, floors: 3, arch: true, chimneys: [] }));
      L.rowWin = L.rowWin || []; L.rowSil = L.rowSil || []; L.rowWin[i] = []; L.rowSil[i] = [];
      bgPaintFacades(p, hs, { light: 1, haze, hazeCol: '#dcc2b0', level: lv, winOut: L.rowWin[i], silOut: L.rowSil[i] });
      if (i === 1) { // church spire on the far church
        const a = pl(3200 + 130, 300 + 260), sx = a[0], sy = a[1];
        p.knock(g => fillP(g, [[sx - 22, sy + 40], [sx + 22, sy + 40], [sx + 22, sy - 60], [sx, sy - 190], [sx - 22, sy - 60]], '#000'));
        p.glaze(g => { fillP(g, [[sx - 22, sy + 40], [sx + 22, sy + 40], [sx + 22, sy - 60], [sx - 22, sy - 60]], mix('#d9c0a8', '#dcc2b0', haze)); fillP(g, [[sx - 26, sy - 58], [sx + 26, sy - 58], [sx, sy - 190]], mix('#7f7c96', '#dcc2b0', haze * .7)); fillP(g, [[sx + 2, sy + 40], [sx + 22, sy + 40], [sx + 22, sy - 60], [sx + 2, sy - 60]], 'rgba(140,120,160,.35)'); }, { edge: .45 });
      }
      if (i === 3) { // the canal through the gap
        const a = pl(gapA[0] - 10, -10), b = pl(gapA[1] + 10, -10);
        p.glaze(g => fillP(g, [[a[0], a[1] - 6], [b[0], b[1] - 6], [b[0] + 80, b[1] + 40], [a[0] - 60, a[1] + 40]], '#93aeb8'), { edge: .45, sep: .3 });
        p.glaze(g => { g.fillStyle = 'rgba(255,214,160,.7)'; g.fillRect(a[0], a[1] + 4, b[0] - a[0], 6); }, { blend: 'screen', edge: 0, soft: 3, cover: false });
        L.glints.push([a[0], a[1] - 2, b[0] - a[0], 40]);
      }
      // trees between rows
      if (i >= 3 && i <= 5) bgPaintTrees(p, Array.from({ length: i >= 4 ? 3 : 2 }, (_, k2) => ({ x: r.range(60, w - 60), y: base + 6 * s, s: s * r.range(.42, .6), seed: 'rt' + i + k2 })), { light: 1, haze, hazeCol: '#dcc2b0' });
      // atmospheric veil over everything painted so far (far rows recede)
      if (i < 4) p.glaze(g => { g.fillStyle = vgrad(g, 0, base - 260 * s, 0, base + 20, [[0, 'rgba(244,214,176,0)'], [1, 'rgba(244,214,176,.55)']]); g.fillRect(0, base - 260 * s, w, 280 * s + 20); }, { blend: 'screen', edge: 0, wobble: 0, cover: false, alpha: .3 * (1 - i / rows.length) });
    });
    // long golden light raking over the roofs from the right
    p.glaze(g => { g.fillStyle = vgrad(g, w, 0, w * .3, 0, [[0, 'rgba(255,180,100,.55)'], [1, 'rgba(255,180,100,0)']]); g.fillRect(0, 450, w, 600); }, { blend: 'soft-light', edge: 0, wobble: 0, cover: false });
  });
  // ---- the terrace (factor 1)
  L.nearF = 1;
  L.near = BGW.plate('roof-near', W + PAN * L.nearF, H, p => {
    const w = p.w, r = rng('rnear');
    const top = 846, floorY = 975, px = 1880;
    // floor (warm stone slabs)
    p.glaze(g => { g.fillStyle = vgrad(g, 0, floorY, 0, H, [[0, '#e6c48e'], [1, '#c99f74']]); g.fillRect(0, floorY - 10, w, H - floorY + 10); }, { edge: .3, gran: .35, mottle: .45, bloom: .3, sep: .3 });
    p.glaze(g => { g.fillStyle = 'rgba(120,90,70,.55)'; for (let y = floorY + 24, k = 0; y < H; y += 28 + k * 12, k++) g.fillRect(0, y, w, 2); for (let x = -600; x < w + 600; x += 190) { g.beginPath(); g.moveTo(w * .45 + (x - w * .45) * .55, floorY); g.lineTo(w * .45 + (x - w * .45) * 1.5, H); g.lineTo(w * .45 + (x - w * .45) * 1.5 + 2.5, H); g.lineTo(w * .45 + (x - w * .45) * .55 + 2, floorY); g.fill(); } }, { edge: .2, gran: .3, alpha: .5, cover: false, wobble: 1 });
    // parapet
    const bal = []; for (let x = 24; x < px - 20; x += 64) bal.push(x);
    const balPoly = x => { const pts = [], hgt = floorY - top - 44; const f = v => 8 + 8 * Math.sin(v * Math.PI) * (v > .22 ? 1 : .25) - (v < .12 ? 3 : 0) + (v > .9 ? 3 : 0); for (let k = 0; k <= 16; k++) pts.push([x + 15 - f(k / 16), top + 4 + k / 16 * hgt]); for (let k = 16; k >= 0; k--) pts.push([x + 15 + f(k / 16), top + 4 + k / 16 * hgt]); return pts; };
    p.knock(g => { fillP(g, P.rect(-10, top - 34, px + 30, 38), '#000'); fillP(g, P.rect(-10, floorY - 44, px + 30, 56), '#000'); bal.forEach(x => fillP(g, balPoly(x), '#000')); }, { erode: 2 });
    p.glaze(g => { fillP(g, rough(P.rect(-10, top - 34, px + 30, 38), 'rail', .6, 40), '#e8cb9a'); fillP(g, rough(P.rect(-10, floorY - 44, px + 30, 56), 'pbase', .6, 40), '#dcbb8c'); bal.forEach(x => fillP(g, balPoly(x), '#e6c795')); }, { edge: .5, gran: .35, mottle: .4, wobble: 0, sep: .3 });
    // sun from the right: baluster left halves in shade, rail underside, base shadow
    p.glaze(g => { g.fillStyle = sh; g.fillRect(-10, top - 2, px + 30, 9); bal.forEach(x => { g.save(); tracePoly(g, balPoly(x)); g.clip(); g.fillRect(x - 10, top, 22, floorY - top); g.restore(); }); g.globalAlpha = .7; g.fillRect(-10, floorY + 12, px + 30, 12); }, { alpha: .5, edge: .4, soft: 1, cover: false, wobble: 1 });
    p.gouache(g => { g.fillStyle = 'rgba(255,230,176,.8)'; g.fillRect(-10, top - 34, px + 30, 5); bal.forEach(x => { g.fillRect(x + 21, top + 14, 3.5, floorY - top - 66); }); }, { dry: .3, wobble: 1, cover: false });
    // long baluster shadows across the floor (toward the left)
    p.glaze(g => { g.fillStyle = sh; bal.forEach(x => { g.beginPath(); g.moveTo(x + 8, floorY + 12); g.lineTo(x - 200, H); g.lineTo(x - 168, H); g.lineTo(x + 24, floorY + 12); g.fill(); }); }, { alpha: .3, soft: 2, cover: false, wobble: 2 });
    // weathering: lichen and stains on the rail
    p.glaze(g => { for (let i = 0; i < 34; i++) { g.fillStyle = r() < .6 ? 'rgba(140,146,84,.6)' : 'rgba(120,96,70,.5)'; g.beginPath(); g.ellipse(r() * px, top - 14 + r.range(-14, 14), r.range(8, 40), r.range(2, 5), 0, 0, 7); g.fill(); } }, { edge: .45, gran: .4, cover: false, alpha: .6, wobble: 2 });
    // the belfry pier at the right: big framing shape, front face in cool half-shade, inner face darker
    p.knock(g => fillP(g, P.rect(px, -10, 360, H + 20), '#000'), { erode: 0 });
    p.glaze(g => fillP(g, rough(P.rect(px, -10, 360, H + 20), 'pier', 1, 40), '#d8c4a8'), { edge: .45, gran: .35, mottle: .45, bloom: .3, sep: .3 });
    p.glaze(g => { for (let y = -10, k = 0; y < H; y += 74, k++) for (let x = px - (k % 2) * 120; x < px + 360; x += 240) { g.fillStyle = r.pick(['#c9a882', '#bfa48e', '#d2b08a', '#b89c84', '#c7ad92']); g.fillRect(x + 3, y + 3, 234, 68); } }, { edge: .7, edgeW: 4, gran: .4, mottle: .4, cover: false, alpha: .7, wobble: 1, dark: .5 });
    p.glaze(g => { g.fillStyle = vgrad(g, px, 0, px + 360, 0, [[0, rgba('#3f3a70', 1)], [.15, rgba('#5b5794', .9)], [1, rgba('#6a68a0', .7)]]); g.fillRect(px, -10, 360, H + 20); }, { alpha: .8, edge: .2, soft: 2, cover: false, wobble: 2, gran: .3 });
    p.glaze(g => { g.fillStyle = vgrad(g, 0, H * .55, 0, H, [[0, 'rgba(240,160,100,0)'], [1, 'rgba(240,160,100,.45)']]); g.fillRect(px, H * .5, 360, H * .5); }, { blend: 'screen', edge: 0, soft: 4, cover: false, wobble: 0 });
    p.gouache(g => { g.fillStyle = 'rgba(255,214,150,.55)'; g.fillRect(px + 2, 0, 5, H); }, { soft: 1.5, wobble: 2, cover: false, dry: .3 });
    // the pier's long shadow across the terrace floor (sun low behind it, to the right)
    p.glaze(g => { g.fillStyle = sh; g.beginPath(); g.moveTo(px + 10, floorY - 30); g.lineTo(px + 10, H + 10); g.lineTo(px - 520, H + 10); g.lineTo(px - 160, floorY - 30); g.closePath(); g.fill(); }, { alpha: .45, soft: 3, cover: false, wobble: 5 });
    // ivy tumbling down the pier
    p.glaze(g => { for (let i = 0; i < 160; i++) { const y = Math.pow(r(), 1.6) * 640, x = px + 6 + r.range(0, 70) * (1 - y / 900) + Math.sin(y / 60) * 10; g.fillStyle = r() < .5 ? '#5d7a44' : '#46623e'; g.beginPath(); g.ellipse(x, y, r.range(6, 13), r.range(4, 9), r() * 3, 0, 7); g.fill(); } }, { edge: .5, gran: .3, wobble: 2 });
    p.gouache(g => { for (let i = 0; i < 40; i++) { const y = Math.pow(r(), 1.6) * 600, x = px + 10 + r.range(0, 60) * (1 - y / 900) + Math.sin(y / 60) * 10; g.fillStyle = 'rgba(200,214,120,.8)'; g.beginPath(); g.ellipse(x - 2, y - 2, r.range(3, 6), r.range(2, 4), r() * 3, 0, 7); g.fill(); } }, { dry: .2, wobble: 1, cover: false });
    // bunting from the pier off to the left
    L.bunt = [[px + 10, 170], [1180, 640]];
    p.gouache(g => {
      const [a, b] = L.bunt, n = 12, cols = ['#d97757', '#d6a443', '#4f7d78', '#f3e6cf', '#6d4a5e', '#c4383a'];
      const pt = k => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * Math.PI) * 70];
      stroke(g, Array.from({ length: 30 }, (_, i) => pt(i / 29)), 2.5, '#5a4a40', 'bline', 0);
      fillP(g, P.rect(b[0] - 4, b[1] - 8, 8, top - 30 - b[1] + 8), '#5a4a40'); g.fillStyle = '#d6a443'; g.beginPath(); g.arc(b[0], b[1] - 10, 7, 0, 7); g.fill();
      for (let i = 0; i < n; i++) { const k = (i + .5) / n, [x, y] = pt(k), [x2, y2] = pt(k + .02); g.fillStyle = cols[i % cols.length]; g.beginPath(); g.moveTo(x - 18, y); g.lineTo(x + 18, y2); g.lineTo((x + x2) / 2 + 2, (y + y2) / 2 + 42); g.closePath(); g.fill(); g.fillStyle = 'rgba(80,60,100,.25)'; g.beginPath(); g.moveTo((x + x2) / 2, y + 2); g.lineTo(x + 18, y2); g.lineTo((x + x2) / 2 + 2, (y + y2) / 2 + 42); g.closePath(); g.fill(); }
    }, { wobble: 1, dry: .12, edge: .4, edgeW: 2 });
  });
  return L;
};

// opts: pan 0..1 (slow drift), light 0..1, petals (none; fx dept), clockless
function bgRooftop(g, t, opts = {}) {
  const L = BGROOF._L || (BGROOF._L = BGROOF.layers());
  const pan = clamp(opts.pan ?? .5), cam = pan * (BGROOF.WW - W), part = opts.part || 'all';
  if (part !== 'front') {
  BGW.layer(g, L.sky, -cam * L.skyF);
  bgCloudDrift(g, t * (opts.drift ?? 1), { y0: 300, y1: 420, seed: 'roofc', n: 2, offset: -cam * L.skyF * 1.4, scale: .6, light: [1, -.4], speed: -8 });
  const fx = -cam * L.farF;
  BGW.layer(g, L.far, fx);
  bgWindmill(g, t, L.mill[0] + fx, L.mill[1], L.mill[2], { col: '#ad9aa2', sail: '#d6c4bc', cap: '#958088', shade: 'rgba(90,80,120,.25)' });
  bgFunicular(g, t, L.fun, fx, 0, .45);
  const mx = -cam * L.midF;
  BGW.layer(g, L.mid, mx);
  L.glints.forEach(([x, y, w, h], i) => bgWaterGlints(g, t, x + mx, y, w, h, { n: 60, seed: 'rg' + i, size: .6 }));
  // depth below the parapet: the street far below reads darker between the balusters
  g.save(); g.fillStyle = BGW.vgrad(g, 0, 830, 0, 960, [[0, 'rgba(70,58,90,.35)'], [1, 'rgba(60,48,80,.6)']]); g.fillRect(0, 830, W, 140); g.restore();
  bgSunGlow(g, W + 160 - cam * .1, 520, { a: .5 + .3 * (opts.light ?? 0), r: 1200 });
  }
  if (part === 'back') return;
  BGW.layer(g, L.near, -cam * L.nearF);
  bgSunGlow(g, W + 160 - cam * .1, 520, { a: .12, r: 900 });
}

// a little funicular car climbing its track [[x0,y0],[x1,y1]] (bottom → top), s = scale
function bgFunicular(g, t, track, ox = 0, oy = 0, s = 1, o = {}) {
  const { speed = .05, col = '#c4503a' } = o;
  const k = .5 - .5 * Math.cos(t * speed * Math.PI * 2);
  const [a, b] = track, x = lerp(a[0], b[0], k) + ox, y = lerp(a[1], b[1], k) + oy, ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.fillStyle = col; g.fillRect(-18, -22, 36, 18); g.fillStyle = 'rgba(255,236,190,.8)'; g.fillRect(-14, -19, 8, 7); g.fillRect(-3, -19, 8, 7); g.fillRect(8, -19, 6, 7);
  g.fillStyle = 'rgba(60,40,40,.6)'; g.fillRect(-18, -6, 36, 3);
  g.restore();
}

// =====================================================================================================
// 3. SKY PAN — a tall painted sky (1920 × 3200 virtual), blue zenith to warm horizon, towering clouds.
// =====================================================================================================
const BGSKY = { HH: 3200 };
// a towering cumulus: stacked cauliflower masses narrowing upward
function bgCloudTower(r, cx, baseY, topY, width) {
  const puffs = [], HH = baseY - topY;
  let y = baseY;
  while (y > topY) {
    const f = (baseY - y) / HH, w = width * (.78 + .3 * Math.sin(Math.PI * Math.min(1, f * 1.1)) - .45 * f) * (1 + .16 * Math.sin(f * 11 + cx) + .08 * Math.sin(f * 23 + cx * 3));
    const c = cx + Math.sin(f * 2.4 + cx * .01) * width * .12;
    const re = w * r.range(.13, .22);
    puffs.push([c - w / 2 + re * r.range(.4, .9), y + r.gauss() * 8, re, 1], [c + w / 2 - re * r.range(.4, .9), y + r.gauss() * 8, re * r.range(.85, 1.15), 1]);
    for (let k = 0; k < 3; k++) puffs.push([c + r.range(-w * .28, w * .28), y, w * r.range(.26, .36), r() < .35 ? .35 : 0]);
    if (r() < .18) { const side = r() < .5 ? -1 : 1, rr = w * r.range(.18, .26); puffs.push([c + side * (w / 2 + rr * .2), y - rr * .3, rr, 1], [c + side * (w / 2 - rr * .2), y - rr * 1.1, rr * .8, 1]); }
    y -= re * r.range(.8, 1.1);
  }
  // the crown: a ring of billows around the top
  const tw = width * .45, tc = cx + Math.sin(2.4 + cx * .01) * width * .12;
  for (let k = 0; k < 7; k++) { const a = Math.PI * (1.05 + k / 6 * .9); puffs.push([tc + Math.cos(a) * tw * .45, topY + Math.sin(a) * tw * .3 + tw * .1, tw * r.range(.2, .3), 1]); }
  // the base: a broad flat skirt
  for (let k = 0; k < 6; k++) puffs.push([cx + r.range(-.6, .6) * width, baseY - r.range(0, 30), width * r.range(.14, .22), 1]);
  puffs.sort((a, b) => a[1] - b[1]);
  return puffs;
}
BGSKY.layers = function () {
  const R = BGSKY.HH - H, { fillP, vgrad, P } = BGW, K = BGK;
  const L = {};
  L.bgF = .45;
  L.bg = BGW.plate('sky-bg', W, H + R * L.bgF, p => {
    const h = p.h;
    K.skyWash(p, 0, 0, W, h, [[0, '#3d6aa6'], [.3, '#5f8dc0'], [.55, '#97b6cf'], [.75, '#d9cdb8'], [.88, '#f2cf9c'], [1, '#f7d7a0']], { gran: .1 });
    p.glaze(g => { const gr = g.createRadialGradient(300, h - 80, 30, 300, h - 80, 1400); gr.addColorStop(0, 'rgba(255,186,104,.8)'); gr.addColorStop(.4, 'rgba(250,176,116,.3)'); gr.addColorStop(1, 'rgba(250,176,116,0)'); g.fillStyle = gr; g.fillRect(0, h - 1500, W, 1500); }, { edge: 0, wobble: 0, gran: .04, mottle: .25 });
    const r = rng('skybg');
    // high cirrus near the zenith: feathery strokes
    p.glaze(g => { for (let i = 0; i < 14; i++) { const x = r() * W, y = r.range(80, h * .35), L2 = r.range(260, 560), a = r.range(-.22, .05); for (let k = 0; k < 7; k++) { g.save(); g.translate(x + k * r.range(20, 50), y + k * r.range(6, 16)); g.rotate(a + k * .02); g.fillStyle = `rgba(240,242,250,${r.range(.12, .3)})`; g.beginPath(); g.ellipse(0, 0, L2 * r.range(.3, 1), r.range(4, 12), 0, 0, 7); g.fill(); g.restore(); } } }, { blend: 'source-over', soft: 9, wobble: 5, edge: 0, gran: .05, alpha: .55, streak: .3 });
    K.streaks(p, r, 8, -100, W + 100, h - 520, h - 200, '#e2a48a', { alpha: .55 });
    p.salt(g => g.rect(0, 0, W, h * .45), 140, { rmin: 2, rmax: 9, alpha: .22 });
  }, { full: true });
  L.cloudF = .75;
  L.clouds = BGW.plate('sky-clouds', W, H + R * L.cloudF, p => {
    const h = p.h, r = rng('skycl');
    // two great towers rising from the warm horizon, lit from the lower left
    K.cloud(p, bgCloudTower(r, 1380, h - 380, h - 1900, 760), { light: [-1, .15], shade: '#9a8cb4', core: '#8a7eaa', belly: '#d2b8c0', rim: '#ffd296', shadeA: .4, cover: true, body: '#fff0d8' });
    K.cloud(p, bgCloudTower(r, 380, h - 300, h - 1250, 520), { light: [-1, .15], shade: '#9a8cb4', core: '#8a7eaa', belly: '#d2b8c0', rim: '#ffd296', shadeA: .38, cover: true, body: '#fff0d8' });
    // mid-level fair-weather cumulus higher up
    for (let i = 0; i < 5; i++) K.cloud(p, K.cloudPuffs(r, r.range(100, W - 100), r.range(300, h - 1900), r.range(200, 380), r.range(80, 140), 12, .4), { light: [-1, .1], shadeA: .35, lobes: .35, shade: '#8f96c0', belly: '#c4c8de', cover: true });
  });
  L.groundF = 1;
  L.ground = BGW.plate('sky-ground', W, H + R * L.groundF, p => {
    const h = p.h, r = rng('skygr');
    // rooftops and the clock tower top in warm backlit haze at the very bottom
    const pl = BGW.plane([[0, h + 60], [W, h + 60], [W, h - 340], [0, h - 340]], W, 400);
    const hs = []; let u = -40;
    while (u < W + 40) { const hw = r.range(140, 260); hs.push(K.house(pl, u, hw, r.range(160, 260), r, { roofType: r.pick(['gable', 'hip', 'step', 'gable', 'mansard']), detail: 0, lit: .35, shutterP: .3, glowP: .3 })); u += hw + r.range(-10, 6); }
    bgPaintFacades(p, hs, { light: -1, level: 1, haze: .25, hazeCol: '#e9b98c' });
    L.face = bgPaintTower(p, 1500, h + 40, 170, 540, { lean: .015, side: 38, spireH: 170, lit: .5 });
    p.glaze(g => { g.fillStyle = vgrad(g, 0, h - 700, 0, h, [[0, 'rgba(255,190,120,0)'], [1, 'rgba(255,190,120,.4)']]); g.fillRect(0, h - 700, W, 700); }, { blend: 'screen', edge: 0, wobble: 0, cover: false });
  });
  L.nearF = 1.25;
  L.near = BGW.plate('sky-near', W, H + R * L.nearF, p => {
    const h = p.h, r = rng('skynr');
    // a few small fast clouds and wisps for depth during the tilt
    for (let i = 0; i < 6; i++) K.cloud(p, K.cloudPuffs(r, r.range(0, W), r.range(400, h - 1000), r.range(120, 220), r.range(50, 90), 9, .3), { light: [-1, .1], shadeA: .3, lobes: .3, shade: '#959cc4', belly: '#cfd2e6', cover: true });
  });
  return L;
};
// opts: y 0..1 (0 = looking at the horizon / rooftops, 1 = looking up at the zenith); drift (cloud speed)
function bgSky(g, t, opts = {}) {
  const L = BGSKY._L || (BGSKY._L = BGSKY.layers());
  const R = BGSKY.HH - H, k = clamp(opts.y ?? 0), off = (1 - k) * R; // off = how far down the virtual sky we look
  const lay = (c, f, dx = 0) => BGW.layer(g, c, dx, -off * f);
  lay(L.bg, L.bgF);
  const dr = t * (opts.drift ?? 1);
  lay(L.clouds, L.cloudF, Math.sin(dr * .05) * 20);
  bgCloudDrift(g, dr, { y0: 300 - off * .9, y1: 300 + R * .9 - off * .9, seed: 'skyd', n: 5, speed: 14, scale: .9, light: [-1, .1] });
  lay(L.near, L.nearF, dr * 6 % 1 * 0);
  lay(L.ground, L.groundF);
  if (k < .35) bgClockHands(g, L.face, opts.clock ?? 18.66, 0, -off * L.groundF);
  bgSunGlow(g, 200, H + 300 - (R * .3) * k, { a: .45 * (1 - k * .6), r: 1300 });
}

// =====================================================================================================
// 4. THE CORRIDOR OF DOORS — a one-point-perspective hallway rendered per frame from painted bay
// textures (walls / floor / ceiling sliced into perspective strips), so the camera can dolly forever.
// =====================================================================================================
const BGCOR = { F: 900, VX: 960, VY: 470, XW: 1.4, YF: -1.1, YC: 1.3, D: 2.4, TW: 1024, TH: 1024, ZFAR: 70 };
BGCOR.doorCols = [['#5a9a90', '#3f7a72'], ['#de7a52', '#b35a3a'], ['#9a6a86', '#77506a'], ['#e3b04e', '#b88a30'], ['#6a90b8', '#4f7299'], ['#9aae62', '#7a8e48']];
// wall bay texture (u along the corridor, v from ceiling (0) to floor (TH)); variant picks the door colour
BGCOR.wallTex = function (variant) {
  const { TW, TH, D, YC, YF } = BGCOR, ppu = TW / D;
  const vy = y => (YC - y) * ppu; // world height → texture v
  return BGW.plate('cor-wall' + variant, TW, TH, p => {
    const { P, fillP, vgrad, rough, stroke } = BGW, r = rng('corw' + variant);
    const [dc, dd] = BGCOR.doorCols[variant % BGCOR.doorCols.length];
    // wallpaper: warm ochre with faint vertical stripes and a sprig pattern
    p.glaze(g => { g.fillStyle = vgrad(g, 0, 0, 0, TH, [[0, '#d9b486'], [.5, '#e6c493'], [1, '#d7b084']]); g.fillRect(0, 0, TW, TH); }, { edge: 0, gran: .25, mottle: .45, sep: .3, wobble: 0, bloom: .3 });
    p.glaze(g => { for (let x = 0; x < TW; x += 64) { g.fillStyle = 'rgba(176,120,80,.35)'; g.fillRect(x, 0, 14, vy(-.2)); } }, { edge: .3, gran: .2, alpha: .5, cover: false, wobble: 1, streak: .3 });
    p.glaze(g => { for (let y = 40; y < vy(-.2); y += 90) for (let x = 32 + ((y / 90) % 2) * 32; x < TW; x += 64) { g.fillStyle = 'rgba(150,90,70,.5)'; g.beginPath(); g.ellipse(x, y, 4, 7, .5, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + 5, y + 3, 4, 6, -.5, 0, 7); g.fill(); } }, { edge: .3, alpha: .5, cover: false, wobble: 1 });
    // picture rail + wainscot panels (dark wood) below
    p.glaze(g => { fillP(g, P.rect(0, vy(-.18), TW, TH - vy(-.18)), '#7a5136'); fillP(g, P.rect(0, vy(.75), TW, 12), '#8a6040'); }, { edge: .45, gran: .3, mottle: .4, wobble: 1 });
    p.glaze(g => { for (let x = 30; x < TW - 60; x += 170) fillP(g, P.rect(x, vy(-.28), 140, vy(YF + .12) - vy(-.28)), 'rgba(60,34,24,.55)'); }, { edge: .6, gran: .3, alpha: .6, cover: false, wobble: 1 });
    p.gouache(g => { g.fillStyle = 'rgba(255,214,160,.45)'; g.fillRect(0, vy(-.18), TW, 4); for (let x = 30; x < TW - 60; x += 170) g.fillRect(x, vy(-.28), 140, 3); }, { dry: .3, wobble: 0, cover: false });
    // the door: frame (architrave), leaf with panels, transom, knob, card plate
    const dx0 = TW * .18, dw = ppu * 1.0, dTop = vy(YF + 2.05), dBot = vy(YF);
    p.knock(g => fillP(g, P.rect(dx0 - 26, dTop - 70, dw + 52, dBot - dTop + 70), '#000'), { erode: 0 });
    p.glaze(g => { fillP(g, P.rect(dx0 - 26, dTop - 70, dw + 52, dBot - dTop + 70), '#5e3b28'); }, { edge: .5, gran: .3, mottle: .3, wobble: 1 });
    p.knock(g => fillP(g, P.rect(dx0, dTop - 62, dw, dBot - dTop + 62), '#000'), { erode: 1 });
    p.glaze(g => { fillP(g, P.rect(dx0, dTop, dw, dBot - dTop), dc); }, { edge: .55, gran: .3, mottle: .4, sep: .3, wobble: 1 });
    p.glaze(g => { g.fillStyle = dd; const pw = dw * .36, ph = (dBot - dTop) * .32; for (const [ax, ay] of [[.09, .08], [.55, .08], [.09, .55], [.55, .55]]) { const x = dx0 + dw * ax, y = dTop + (dBot - dTop) * ay; g.globalAlpha = .55; g.fillRect(x, y, pw, ph); g.globalAlpha = 1; } }, { edge: .6, gran: .3, alpha: .8, cover: false, wobble: 1 });
    p.gouache(g => { g.fillStyle = 'rgba(255,220,170,.35)'; const pw = dw * .36, ph = (dBot - dTop) * .32; for (const [ax, ay] of [[.09, .08], [.55, .08], [.09, .55], [.55, .55]]) { const x = dx0 + dw * ax, y = dTop + (dBot - dTop) * ay; g.fillRect(x, y, pw, 3); g.fillRect(x, y, 3, ph); } }, { dry: .25, wobble: 0, cover: false });
    // transom glass (warm), knob, card plate
    p.glaze(g => { fillP(g, P.rect(dx0 + 6, dTop - 60, dw - 12, 46), '#f2c37a'); }, { edge: .5, wobble: 1 });
    p.gouache(g => { g.fillStyle = 'rgba(120,80,40,.6)'; for (let k = 1; k < 4; k++) g.fillRect(dx0 + 6 + (dw - 12) * k / 4, dTop - 60, 3, 46);
      g.fillStyle = '#d6a443'; g.beginPath(); g.arc(dx0 + dw * .86, dTop + (dBot - dTop) * .52, 11, 0, 7); g.fill(); g.fillStyle = '#fff0c0'; g.beginPath(); g.arc(dx0 + dw * .86 - 3, dTop + (dBot - dTop) * .52 - 3, 4, 0, 7); g.fill();
      g.fillStyle = '#eadab4'; g.fillRect(dx0 + dw * .2, dTop + (dBot - dTop) * .3, dw * .6, (dBot - dTop) * .16); g.fillStyle = 'rgba(120,90,60,.5)'; g.fillRect(dx0 + dw * .2, dTop + (dBot - dTop) * .3 + (dBot - dTop) * .16 - 4, dw * .6, 4); }, { dry: .15, wobble: 1, cover: false });
    // shadow side of the frame (light comes from the sconce to the right of the door)
    p.glaze(g => { g.fillStyle = '#4a3a5a'; g.fillRect(dx0, dTop, 18, dBot - dTop); g.fillRect(dx0, dTop, dw, 12); }, { alpha: .45, edge: .3, cover: false, soft: 1, wobble: 1 });
    // sconce between doors: brass arm + warm shade, with a painted light pool
    const sx = TW * .78, sy = vy(.55);
    p.glaze(g => { const gr = g.createRadialGradient(sx, sy, 10, sx, sy, 330); gr.addColorStop(0, 'rgba(255,214,140,.85)'); gr.addColorStop(.45, 'rgba(255,200,120,.25)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(sx - 340, sy - 340, 680, 680); }, { blend: 'screen', edge: 0, wobble: 0, cover: false, soft: 2 });
    p.glaze(g => { stroke(g, [[sx, sy + 70], [sx, sy + 20], [sx + 8, sy + 6]], 7, '#8a6a30', 'sc', 0); fillP(g, [[sx - 34, sy + 10], [sx + 34, sy + 10], [sx + 22, sy - 40], [sx - 22, sy - 40]], '#f2d08a'); }, { edge: .5, wobble: 1 });
    p.gouache(g => { g.fillStyle = 'rgba(255,246,220,.85)'; g.beginPath(); g.ellipse(sx, sy - 12, 14, 18, 0, 0, 7); g.fill(); }, { soft: 3, wobble: 0, cover: false });
    // cast shadow under the picture rail and along the floor line
    p.glaze(g => { g.fillStyle = vgrad(g, 0, TH - 60, 0, TH, [[0, 'rgba(60,40,60,0)'], [1, 'rgba(60,40,60,.6)']]); g.fillRect(0, TH - 60, TW, 60); }, { edge: 0, cover: false, wobble: 2 });
  }, { full: true });
};
// floor tile: u along the corridor (TW = one bay), v across (0 = left wall … FH = right wall)
BGCOR.floorTex = function () {
  const { TW, D, XW } = BGCOR, ppu = TW / D, FH = Math.round(2 * XW * ppu);
  return BGW.plate('cor-floor', TW, FH, p => {
    const { P, fillP, vgrad } = BGW, r = rng('corf');
    p.glaze(g => { g.fillStyle = '#b07a52'; g.fillRect(0, 0, TW, FH); }, { edge: 0, gran: .3, mottle: .4, wobble: 0, sep: .3 });
    p.glaze(g => { for (let v = 0; v < FH; v += 56) { g.fillStyle = r.pick(['rgba(120,70,40,.5)', 'rgba(150,96,60,.45)', 'rgba(100,60,36,.4)']); g.fillRect(0, v, TW, 54); g.fillStyle = 'rgba(60,34,20,.7)'; g.fillRect(0, v + 54, TW, 2); const j = r() * TW; g.fillRect(j, v, 2, 54); } }, { edge: .4, gran: .3, alpha: .7, cover: false, wobble: 0, streak: .35 });
    // runner carpet down the middle: clay with a mustard border
    const c0 = FH * .3, c1 = FH * .7;
    p.glaze(g => { fillP(g, P.rect(0, c0, TW, c1 - c0), '#b5503a'); }, { edge: .4, gran: .35, mottle: .45, wobble: 0 });
    p.glaze(g => { fillP(g, P.rect(0, c0 + 14, TW, 16), '#d6a443'); fillP(g, P.rect(0, c1 - 30, TW, 16), '#d6a443'); for (let u = 30; u < TW; u += 120) { g.fillStyle = '#7a3428'; g.beginPath(); g.moveTo(u, (c0 + c1) / 2); g.lineTo(u + 40, (c0 + c1) / 2 - 50); g.lineTo(u + 80, (c0 + c1) / 2); g.lineTo(u + 40, (c0 + c1) / 2 + 50); g.closePath(); g.fill(); } }, { edge: .45, gran: .3, alpha: .8, cover: false, wobble: 0 });
    // warm pools from the sconces near both walls
    p.glaze(g => { for (const v of [0, FH]) { const gr = g.createRadialGradient(TW * .78, v, 10, TW * .78, v, 420); gr.addColorStop(0, 'rgba(255,200,120,.6)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, TW, FH); } }, { blend: 'screen', edge: 0, wobble: 0, cover: false });
  }, { full: true });
};
BGCOR.ceilTex = function () {
  const { TW, D, XW } = BGCOR, ppu = TW / D, FH = Math.round(2 * XW * ppu);
  return BGW.plate('cor-ceil', TW, FH, p => {
    const { P, fillP } = BGW;
    p.glaze(g => { g.fillStyle = '#e2c79c'; g.fillRect(0, 0, TW, FH); }, { edge: 0, gran: .2, mottle: .4, wobble: 0, bloom: .4 });
    p.glaze(g => { fillP(g, P.rect(0, 0, 90, FH), '#6a4630'); fillP(g, P.rect(0, 0, TW, 40), '#6a4630'); fillP(g, P.rect(0, FH - 40, TW, 40), '#6a4630'); }, { edge: .5, gran: .3, mottle: .3, wobble: 1 });
    p.glaze(g => { g.fillStyle = 'rgba(60,40,70,.5)'; g.fillRect(90, 0, 26, FH); }, { soft: 3, edge: 0, cover: false, wobble: 1 });
    // pendant lamp rose in the middle of the bay
    p.glaze(g => { const gr = g.createRadialGradient(TW * .55, FH / 2, 10, TW * .55, FH / 2, 360); gr.addColorStop(0, 'rgba(255,214,150,.8)'); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(0, 0, TW, FH); }, { blend: 'screen', edge: 0, wobble: 0, cover: false });
  }, { full: true });
};
// project world (x, y, z-relative-to-camera) to screen
BGCOR.proj = (x, y, z) => [BGCOR.VX + BGCOR.F * x / z, BGCOR.VY - BGCOR.F * y / z];
// opts: z = camera position in bays (float; animate it for the dolly), fog colour, sway (camera bob, px)
function bgCorridor(g, t, opts = {}) {
  const C = BGCOR, { F, VX, VY, XW, YF, YC, D, TW, ZFAR } = C;
  const camZ = (opts.z ?? 0) * D, fogC = opts.fog ?? '#f0cf98';
  const walls = [0, 1, 2, 3, 4, 5].map(v => C.wallTex(v));
  const floor = C.floorTex(), ceil = C.ceilTex(), FHt = floor.height;
  const bob = opts.bob ?? 0;
  g.save(); g.translate(0, bob);
  g.fillStyle = fogC; g.fillRect(0, -40, W, H + 80);
  const fogA = z => 1 - Math.exp(-z / 16);
  const mod = (a, n) => ((a % n) + n) % n;
  // walls: vertical strips (left wall x = −XW, right wall x = +XW); slight overdraw top/bottom, floor/ceiling are clipped over them
  const sw = 4;
  for (const side of [-1, 1]) {
    for (let k = 0; k < 400; k++) {
      const xa = side < 0 ? k * sw : W - (k + 1) * sw, xb = xa + sw;
      const xNear = side < 0 ? xa : xb, dx = Math.abs(xNear - VX);
      if (dx < 3) break;
      const z0 = F * XW / dx, z1 = F * XW / Math.max(1, dx - sw), zm = (z0 + z1) / 2;
      if (z0 > ZFAR) break;
      const Z0 = z0 + camZ, bay = Math.floor(Z0 / D), u0 = mod(Z0, D) / D * TW, du = Math.max(.5, (z1 - z0) / D * TW);
      const tex = walls[mod(bay * 2 + (side > 0 ? 1 : 0), 6)];
      const top = VY - F * YC / Math.min(z0, z1) - 2, bot = VY - F * YF / Math.min(z0, z1) + 2;
      const su = Math.min(TW - .5, u0), sd = Math.max(.5, Math.min(du, TW - su));
      if (side < 0) g.drawImage(tex, su, 0, sd, C.TH, xa, top, sw, bot - top);
      else { g.save(); g.translate(xb, 0); g.scale(-1, 1); g.drawImage(tex, su, 0, sd, C.TH, 0, top, sw, bot - top); g.restore(); }
      g.globalAlpha = fogA(zm); g.fillStyle = fogC; g.fillRect(xa, top, sw, bot - top); g.globalAlpha = 1;
    }
  }
  // floor & ceiling: horizontal strips, clipped to their exact trapezoids (clean wall seams)
  const strip = 3, S = 50;
  for (const [tex, ylev] of [[floor, YF], [ceil, YC]]) {
    g.save(); g.beginPath();
    g.moveTo(VX, VY); g.lineTo(VX - F * XW * S, VY - F * ylev * S); g.lineTo(VX + F * XW * S, VY - F * ylev * S); g.closePath(); g.clip();
    const y0 = ylev < 0 ? VY + 1 : -40, y1 = ylev < 0 ? H + 40 : VY - 1;
    for (let sy = Math.floor(y0); sy < y1; sy += strip) {
      const dy = ylev < 0 ? sy - VY : VY - (sy + strip), z = F * Math.abs(ylev) / Math.max(.5, dy);
      if (z > ZFAR * 1.2) { continue; }
      const Z = z + camZ, u = mod(Z, D) / D * TW;
      const xl = VX - F * XW / z - 4, xr = VX + F * XW / z + 4;
      g.save(); g.translate(xl, sy); g.rotate(Math.PI / 2); g.scale(1, -1);
      g.drawImage(tex, Math.min(TW - 2, u), 0, 2, FHt, 0, 0, strip + 1, xr - xl);
      g.restore();
      g.globalAlpha = fogA(z); g.fillStyle = fogC; g.fillRect(xl, sy, xr - xl, strip); g.globalAlpha = 1;
    }
    g.restore();
  }
  // lamp glows (flicker): sconces + pendants, for bays in view
  const pts = [];
  const b0 = Math.floor(camZ / D);
  for (let b = b0; b < b0 + 14; b++) {
    const zs = b * D + D * .78 - camZ; if (zs < .6) continue;
    for (const side of [-1, 1]) { const [x, y] = C.proj(side * (XW - .05), .55, zs); pts.push([x, y, 1.6 / zs * (1 - fogA(zs))]); }
    const zp = b * D + D * .55 - camZ; if (zp > .6) { const [x, y] = C.proj(0, YC - .25, zp); pts.push([x, y, 2.2 / zp * (1 - fogA(zp))]); }
  }
  bgLampGlow(g, t, pts, { r: 260, a: .45, flicker: 1 });
  bgSunGlow(g, VX, VY, { a: .55, r: 420, col: '255,220,160' });
  g.restore();
}
// screen quads of the card plates on doors in view (for the puzzles layer): [{bay, side, z, quad:[tl,tr,br,bl]}]
function bgCorridorDoors(opts = {}) {
  const C = BGCOR, { D, XW, YF, TW } = C, camZ = (opts.z ?? 0) * D, out = [];
  const ppu = TW / D, dx0 = TW * .18 / ppu, dw = 1.0, dh = 2.05;
  const b0 = Math.floor(camZ / D);
  for (let b = b0; b < b0 + 12; b++) for (const side of [-1, 1]) {
    const za = b * D + dx0 + dw * .2 - camZ, zb = b * D + dx0 + dw * .8 - camZ;
    if (za < .5) continue;
    const ya = YF + dh * (1 - .3), yb = YF + dh * (1 - .46);
    const x = side * XW, P = (y, z) => C.proj(x, y, z);
    out.push({ bay: b, side, z: (za + zb) / 2, index: b * 2 + (side > 0 ? 1 : 0), quad: [P(ya, za), P(ya, zb), P(yb, zb), P(yb, za)] });
  }
  return out;
}

// =====================================================================================================
// 5. ATTIC STUDY at night — gable room, round window with the moon, bookshelves, desk with a lantern.
// Leaves the floor centre (moonlit) free for the trunk. Warm lantern glow, cool moon shaft.
// =====================================================================================================
const BGATT = { WW: 2080, VX: 1040, VY: 560, K: 3.4 };
BGATT.layers = function () {
  const { WW, VX, VY, K: k } = BGATT, PAN = WW - W;
  const { P, fillP, vgrad, rough, stroke } = BGW;
  const L = {};
  const V = [VX, VY], near = (p) => [VX + (p[0] - VX) * k, VY + (p[1] - VY) * k];
  // back wall (gable) corners
  const bx0 = VX - 430, bx1 = VX + 430, bFloor = 870, bKnee = 640, apex = [VX, 170];
  const BL = [bx0, bFloor], BR = [bx1, bFloor], KL = [bx0, bKnee], KR = [bx1, bKnee];
  const win = { x: VX, y: 430, r: 150 };
  const lantern = [VX + 250, 700];
  L.lantern = lantern; L.win = win;
  L.main = BGW.plate('attic-main', WW, H, p => {
    const r = rng('attic');
    const sh = '#3a3560';
    // --- night sky + moon seen through the round window (painted first, the wall is knocked over it)
    p.glaze(g => { g.fillStyle = vgrad(g, 0, win.y - win.r, 0, win.y + win.r, [[0, '#1f2f58'], [1, '#3d5684']]); g.beginPath(); g.arc(win.x, win.y, win.r + 10, 0, 7); g.fill(); }, { edge: .2, gran: .2, mottle: .4, wobble: 1, sep: .3 });
    p.gouache(g => { const mx = win.x + 50, my = win.y - 40; g.fillStyle = 'rgba(255,248,220,.25)'; g.beginPath(); g.arc(mx, my, 70, 0, 7); g.fill(); g.fillStyle = '#f8f0d4'; g.beginPath(); g.arc(mx, my, 42, 0, 7); g.fill(); g.fillStyle = 'rgba(200,190,160,.6)'; g.beginPath(); g.arc(mx - 10, my + 6, 9, 0, 7); g.arc(mx + 14, my - 10, 6, 0, 7); g.arc(mx + 6, my + 18, 5, 0, 7); g.fill(); }, { soft: 1, wobble: 1 });
    p.glaze(g => { for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(120,130,170,.6)'; g.beginPath(); g.ellipse(win.x - 120 + i * 70, win.y + 40 + (i % 2) * 30, 90, 12, 0, 0, 7); g.fill(); } }, { soft: 3, wobble: 8, cover: false, alpha: .6 });
    // town roofs silhouetted far below the window
    p.glaze(g => { g.fillStyle = '#26304e'; g.beginPath(); g.moveTo(win.x - 170, win.y + 170); let x = win.x - 170; while (x < win.x + 170) { const w2 = r.range(30, 60), h2 = r.range(10, 40); g.lineTo(x, win.y + 110 - h2 * .3); g.lineTo(x + w2 / 2, win.y + 90 - h2); g.lineTo(x + w2, win.y + 110 - h2 * .3); x += w2; } g.lineTo(win.x + 170, win.y + 170); g.closePath(); g.fill(); }, { edge: .4, wobble: 1, cover: false });
    p.gouache(g => { for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(255,200,110,.9)'; g.fillRect(win.x - 120 + r() * 240, win.y + 105 + r() * 30, 3, 4); } }, { wobble: 0, cover: false });
    // --- room surfaces (warm local colours; the night glaze comes later)
    const sur = [];
    const leftSlope = [KL, apex, near(apex), near(KL)], rightSlope = [apex, KR, near(KR), near(apex)];
    const leftKnee = [BL, KL, near(KL), near(BL)], rightKnee = [KR, BR, near(BR), near(KR)];
    const floorQ = [BL, BR, near(BR), near(BL)];
    const backWall = [BL, BR, KR, apex, KL];
    p.knock(g => { fillP(g, backWall, '#000'); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(win.x, win.y, win.r, 0, 7); g.fill(); g.globalCompositeOperation = 'source-over'; [leftSlope, rightSlope, leftKnee, rightKnee, floorQ].forEach(q => fillP(g, q, '#000')); }, { erode: 0 });
    p.glaze(g => { fillP(g, BGW.inflate(backWall, 6), '#e2c49a'); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(win.x, win.y, win.r, 0, 7); g.fill(); }, { edge: .4, gran: .25, mottle: .45, sep: .3, bloom: .4 });
    const inf = q => BGW.inflate(q, 6);
    p.glaze(g => { fillP(g, inf(leftSlope), '#d9b98e'); fillP(g, inf(rightSlope), '#d4b48a'); }, { edge: .4, gran: .25, mottle: .35, sep: .3, bloom: .3 });
    p.glaze(g => { fillP(g, inf(leftKnee), '#c9a27a'); fillP(g, inf(rightKnee), '#c4a078'); }, { edge: .4, gran: .25, mottle: .3 });
    p.glaze(g => { fillP(g, inf(floorQ), '#a8764e'); }, { edge: .3, gran: .3, mottle: .3, sep: .3 });
    // floorboards converging to the vanishing point
    p.glaze(g => { g.save(); tracePoly(g, floorQ); g.clip(); for (let i = -14; i <= 14; i++) { const a = [VX + i * 62, bFloor], b = near(a); stroke(g, [a, b], 2 + Math.abs(i) * .3, 'rgba(70,40,26,.6)', 'fb' + i, 0); } for (let j = 0; j < 9; j++) { const t2 = Math.pow(j / 9, 1.6), y = bFloor + (H + 400 - bFloor) * t2; g.fillStyle = 'rgba(70,40,26,.25)'; g.fillRect(0, y, WW, 2); } g.restore(); }, { edge: .3, gran: .3, cover: false, alpha: .7, streak: .3 });
    // rafters on both slopes (receding strips) + ridge beam + the wall plate
    const raf = (q, f0, f1) => { const [a, b, c, d] = q; const A = [lerp(a[0], d[0], f0), lerp(a[1], d[1], f0)], B = [lerp(b[0], c[0], f0), lerp(b[1], c[1], f0)], C = [lerp(b[0], c[0], f1), lerp(b[1], c[1], f1)], D = [lerp(a[0], d[0], f1), lerp(a[1], d[1], f1)]; return [A, B, C, D]; };
    const fr = f => 1 - 1 / (1 + f * 2.6); // perspective spacing
    p.glaze(g => { for (let i = 0; i < 7; i++) { const f0 = fr(i * .5), f1 = f0 + .022 * (1 + i * .5); fillP(g, raf(leftSlope, f0, f1), '#6a4630'); fillP(g, raf(rightSlope, f0, f1), '#6a4630'); } stroke(g, [apex, near(apex)], 28, '#5a3a28', 'ridge', 0); stroke(g, [KL, near(KL)], 22, '#5a3a28', 'wpl', 0); stroke(g, [KR, near(KR)], 22, '#5a3a28', 'wpr', 0); }, { edge: .5, gran: .3, mottle: .3, wobble: 1 });
    // ceiling boards running parallel to the ridge (lines converge on the vanishing point)
    p.glaze(g => { for (const q of [leftSlope, rightSlope]) { g.save(); tracePoly(g, q); g.clip(); for (let i = 1; i < 16; i++) { const f = i / 16, a = [lerp(q[0][0], q[1][0], f), lerp(q[0][1], q[1][1], f)], b = near(a); stroke(g, [a, b], 1.6 + f, 'rgba(110,74,50,.55)', 'pl' + i + q[0][0], 0); } g.restore(); } }, { edge: .2, gran: .3, cover: false, alpha: .7, wobble: 1, streak: .4 });
    // plaster on the gable: patches, a crack, a damp bloom
    p.glaze(g => { g.save(); tracePoly(g, backWall); g.clip(); for (let i = 0; i < 9; i++) { g.fillStyle = r() < .5 ? 'rgba(190,150,110,.35)' : 'rgba(230,210,180,.45)'; const poly = deform(polyCircle(VX + r.range(-380, 380), r.range(250, 820), r.range(30, 90), r.range(20, 60), 10), r, 3, .3); tracePoly(g, poly); g.fill(); } stroke(g, [[VX - 300, 300], [VX - 270, 360], [VX - 285, 410], [VX - 250, 470]], 2, 'rgba(110,80,60,.6)', 'crack', .5); g.restore(); }, { edge: .5, gran: .3, cover: false, wobble: 2, bloom: .5 });
    // round window: deep reveal + frame + mullions
    p.glaze(g => { g.lineWidth = 26; g.strokeStyle = '#6a4630'; g.beginPath(); g.arc(win.x, win.y, win.r + 4, 0, 7); g.stroke(); g.fillStyle = '#5a3a28'; g.fillRect(win.x - 5, win.y - win.r, 10, win.r * 2); g.fillRect(win.x - win.r, win.y - 5, win.r * 2, 10); }, { edge: .5, gran: .25, wobble: 1 });
    // --- bookshelves along the left knee wall (and one tall case in the near left)
    const kw = (u, v) => { // knee-wall plane point: u 0 (back) … 1 (near, scaled), v 0 floor … 1 knee top
      const a = [bx0, lerp(bFloor, bKnee, v)], b = near(a); const f = fr(u * 2.2); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
    p.glaze(g => { for (const v of [.02, .34, .66]) fillP(g, [kw(.02, v), kw(.95, v), kw(.95, v + .03), kw(.02, v + .03)], '#5a3a28'); }, { edge: .5, wobble: 1 });
    p.glaze(g => { const cols = ['#8a3a2e', '#3f5a6a', '#6a7a3a', '#b0803a', '#6d4a5e', '#2f4a44', '#a9553c', '#c9a46a']; for (const v of [.05, .37, .69]) { let u = .03; while (u < .93) { const du = r.range(.012, .03), hh = r.range(.2, .28); fillP(g, [kw(u, v), kw(u + du, v), kw(u + du, v + hh), kw(u, v + hh)], r.pick(cols)); u += du + .003; } } }, { edge: .55, gran: .25, mottle: .3, wobble: 1, sep: .3 });
    // pinned papers & a star chart on the right knee wall
    const kr = (u, v) => { const a = [bx1, lerp(bFloor, bKnee, v)], b = near(a); const f = fr(u * 2.2); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
    p.glaze(g => { for (let i = 0; i < 6; i++) { const u = .05 + i * .14, v = r.range(.35, .7), du = .07, dv = .26; fillP(g, [kr(u, v), kr(u + du, v), kr(u + du, v + dv), kr(u, v + dv)], r.pick(['#efe2c4', '#e9d6b0', '#f2e8d0'])); } }, { edge: .45, gran: .2, wobble: 1 });
    p.glaze(g => { g.strokeStyle = 'rgba(60,60,110,.55)'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { const u = .05 + i * .14 + .01, v = .45; const a = kr(u, v + .1), b = kr(u + .05, v + .12); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); const c2 = kr(u + .01, v + .05), d2 = kr(u + .045, v + .02); g.beginPath(); g.moveTo(c2[0], c2[1]); g.lineTo(d2[0], d2[1]); g.stroke(); } }, { edge: 0, cover: false, wobble: 1 });
    // a chalkboard on the right knee wall, scribbled with chalk
    p.glaze(g => { fillP(g, [kr(0.030, .3), kr(0.220, .3), kr(0.220, .92), kr(0.030, .92)], '#5a4632'); fillP(g, [kr(0.038, .34), kr(0.212, .34), kr(0.212, .88), kr(0.038, .88)], '#2f3d36'); }, { edge: .5, gran: .3, wobble: 1 });
    p.gouache(g => { g.strokeStyle = 'rgba(240,236,220,.75)'; g.lineCap = 'round';
      const L2 = (u0, v0, u1, v1, w = 2) => { const a = kr(u0, v0), b = kr(u1, v1); g.lineWidth = w; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
      for (let k = 0; k < 5; k++) { const v = .78 - k * .1; let u = .05; while (u < .2) { const du = r.range(.004, .014); L2(u, v + r.gauss() * .01, u + du, v + r.gauss() * .01, 2.2); u += du + r.range(.002, .007); } }
      const c = kr(0.167, .55), c2 = kr(0.197, .55); g.lineWidth = 2; g.beginPath(); g.ellipse(c[0], c[1], Math.abs(c2[0] - c[0]) * .8, 26, 0, 0, 7); g.stroke();
      L2(0.060, .4, 0.106, .4); L2(0.060, .4, 0.083, .52); L2(0.083, .52, 0.106, .4); }, { wobble: 1, dry: .35, cover: false });
    // star chart pinned to the left slope
    const ls = (u, v) => { const a = [lerp(KL[0], apex[0], v), lerp(KL[1], apex[1], v)], b = near(a), f = fr(u * 2.2); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
    p.glaze(g => fillP(g, [ls(.12, .25), ls(.32, .25), ls(.32, .6), ls(.12, .6)], '#2a3458'), { edge: .45, gran: .3, wobble: 1 });
    p.gouache(g => { for (let i = 0; i < 40; i++) { const q = ls(r.range(.13, .31), r.range(.27, .58)); g.fillStyle = 'rgba(250,240,200,.85)'; g.fillRect(q[0], q[1], 2.4, 2.4); } g.strokeStyle = 'rgba(250,240,200,.45)'; g.lineWidth = 1.2; g.beginPath(); for (let i = 0; i < 6; i++) { const q = ls(.15 + i * .028, .35 + Math.sin(i * 1.7) * .08); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke(); }, { wobble: 0, cover: false });
    // --- desk under the window, papers, lantern, telescope, chair
    const dTop = 720, dx0 = VX - 330, dx1 = VX + 360;
    p.knock(g => { fillP(g, [[dx0, dTop], [dx1, dTop], [dx1 + 30, dTop + 24], [dx0 - 30, dTop + 24]], '#000'); fillP(g, P.rect(dx0 - 20, dTop + 24, 50, bFloor + 30 - dTop - 24), '#000'); fillP(g, P.rect(dx1 - 30, dTop + 24, 50, bFloor + 30 - dTop - 24), '#000'); fillP(g, P.rect(dx0 + 40, dTop + 24, 240, 70), '#000'); });
    p.glaze(g => { fillP(g, [[dx0, dTop], [dx1, dTop], [dx1 + 30, dTop + 24], [dx0 - 30, dTop + 24]], '#8a5a3a'); fillP(g, P.rect(dx0 - 30, dTop + 24, dx1 - dx0 + 60, 14), '#6a4630'); fillP(g, P.rect(dx0 - 20, dTop + 38, 50, bFloor + 30 - dTop - 38), '#5a3a28'); fillP(g, P.rect(dx1 - 30, dTop + 38, 50, bFloor + 30 - dTop - 38), '#5a3a28'); fillP(g, P.rect(dx0 + 40, dTop + 38, 240, 60), '#6a4630'); }, { edge: .55, gran: .3, mottle: .3, wobble: 1 });
    p.gouache(g => { // papers, books, inkwell, quill, globe
      for (let i = 0; i < 7; i++) { g.save(); g.translate(dx0 + 60 + r() * 330, dTop + 8 + r() * 10); g.rotate(r.gauss() * .15); g.fillStyle = r.pick(['#f4ead2', '#efe0c0', '#f7f0de']); g.fillRect(-46, -10, 92, 18); g.fillStyle = 'rgba(80,60,90,.35)'; for (let k2 = 0; k2 < 3; k2++) g.fillRect(-38, -6 + k2 * 4, 60 + r() * 14, 1.5); g.restore(); }
      g.fillStyle = '#2f3a4a'; g.fillRect(dx0 + 20, dTop - 26, 22, 24); g.fillStyle = '#f2e8d0'; stroke(g, [[dx0 + 34, dTop - 20], [dx0 + 64, dTop - 80]], 5, '#f2e8d0', 'quill', .6);
      g.fillStyle = '#8a3a2e'; g.fillRect(dx1 - 150, dTop - 22, 90, 20); g.fillStyle = '#3f5a6a'; g.fillRect(dx1 - 140, dTop - 40, 76, 18); g.fillStyle = '#c9a46a'; g.fillRect(dx1 - 146, dTop - 54, 84, 14);
    }, { wobble: 1, dry: .1, edge: .4, edgeW: 2 });
    // a globe on the desk
    p.glaze(g => { const gx = VX + 120, gy = dTop - 52; g.fillStyle = '#5f8aa0'; g.beginPath(); g.arc(gx, gy, 38, 0, 7); g.fill(); g.fillStyle = '#9ab070'; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(gx + r.range(-22, 22), gy + r.range(-22, 22), r.range(6, 14), r.range(4, 10), r(), 0, 7); g.fill(); } }, { edge: .5, gran: .3, wobble: 1 });
    p.glaze(g => { const gx = VX + 120, gy = dTop - 52; g.strokeStyle = '#a8813a'; g.lineWidth = 4; g.beginPath(); g.arc(gx, gy, 46, Math.PI * .6, Math.PI * 2.1); g.stroke(); g.fillStyle = '#6a4630'; g.fillRect(gx - 22, dTop - 8, 44, 8); g.fillRect(gx - 3, gy + 40, 6, 12); }, { edge: .4, cover: false, wobble: 0 });
    // brass telescope on a tripod, pointed at the window
    p.glaze(g => { stroke(g, [[VX - 230, dTop - 4], [VX - 150, dTop - 160]], 5, '#5a3a28', 'tp1', 0); stroke(g, [[VX - 120, dTop - 4], [VX - 150, dTop - 160]], 5, '#5a3a28', 'tp2', 0); stroke(g, [[VX - 210, dTop - 140], [VX - 60, dTop - 230]], 16, '#c99a3a', 'tube', .2); stroke(g, [[VX - 70, dTop - 224], [VX - 40, dTop - 242]], 22, '#b08030', 'lens', 0); }, { edge: .5, gran: .25, wobble: 1 });
    // lantern on the desk (glass panes glow; metal frame)
    p.gouache(g => { const [lx, ly] = lantern; g.fillStyle = '#ffe4a8'; g.fillRect(lx - 26, ly - 70, 52, 62); g.fillStyle = '#fff6dc'; g.beginPath(); g.ellipse(lx, ly - 40, 10, 18, 0, 0, 7); g.fill(); g.fillStyle = '#3a2c26'; g.fillRect(lx - 30, ly - 10, 60, 10); g.fillRect(lx - 30, ly - 78, 60, 9); g.beginPath(); g.moveTo(lx - 24, ly - 78); g.lineTo(lx, ly - 104); g.lineTo(lx + 24, ly - 78); g.fill(); g.fillRect(lx - 30, ly - 70, 4, 62); g.fillRect(lx + 26, ly - 70, 4, 62); g.fillRect(lx - 2, ly - 70, 4, 62); g.lineWidth = 3; g.strokeStyle = '#3a2c26'; g.beginPath(); g.arc(lx, ly - 112, 10, 0, 7); g.stroke(); }, { wobble: 0, soft: .5 });
    // a rug on the floor (in the moon shaft, where the trunk goes)
    const fl = (x, z) => { const a = [VX + x, bFloor], b = near(a); return [lerp(a[0], b[0], z), lerp(a[1], b[1], z)]; };
    p.glaze(g => { fillP(g, [fl(-300, .08), fl(300, .08), fl(300, .28), fl(-300, .28)], '#8a3a3a'); }, { edge: .5, gran: .35, mottle: .4, wobble: 2 });
    p.glaze(g => { fillP(g, [fl(-270, .095), fl(270, .095), fl(270, .265), fl(-270, .265)], '#b0603a'); fillP(g, [fl(-200, .12), fl(200, .12), fl(200, .24), fl(-200, .24)], '#7a3434'); fillP(g, [fl(-40, .15), fl(40, .15), fl(40, .21), fl(-40, .21)], '#d6a443'); }, { edge: .5, gran: .3, alpha: .8, cover: false, wobble: 2 });
    // stacks of books on the floor, right
    p.glaze(g => { const cols = ['#8a3a2e', '#3f5a6a', '#6a7a3a', '#b0803a', '#6d4a5e']; let y = 1000; for (let i = 0; i < 6; i++) { const w2 = r.range(150, 190), h2 = r.range(22, 30); fillP(g, P.rect(1560 - w2 / 2 + r.gauss() * 8, y - h2, w2, h2), r.pick(cols)); y -= h2; } y = 960; for (let i = 0; i < 4; i++) { const w2 = r.range(110, 140), h2 = r.range(20, 26); fillP(g, P.rect(1720 - w2 / 2 + r.gauss() * 6, y - h2, w2, h2), r.pick(cols)); y -= h2; } }, { edge: .55, gran: .3, wobble: 1 });
    // --- night: a big indigo glaze over everything, thinning toward the lantern (warm light survives)
    p.glaze(g => { const [lx, ly] = lantern; const gr = g.createRadialGradient(lx, ly - 40, 40, lx, ly - 40, 1100); gr.addColorStop(0, 'rgba(58,53,110,0)'); gr.addColorStop(.18, 'rgba(58,53,110,.12)'); gr.addColorStop(.5, 'rgba(48,46,100,.6)'); gr.addColorStop(1, 'rgba(36,34,80,.88)'); g.fillStyle = gr; g.fillRect(0, 0, WW, H); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(win.x, win.y, win.r - 6, 0, 7); g.fill(); }, { edge: 0, gran: .2, mottle: .07, wobble: 0, cover: false, sep: .2, sepHue: 20, lift: .02 });
    p.glaze(g => { const gr = g.createRadialGradient(VX + 100, 620, 300, VX + 100, 620, 1250); gr.addColorStop(0, 'rgba(30,30,80,0)'); gr.addColorStop(1, 'rgba(24,24,66,.6)'); g.fillStyle = gr; g.fillRect(0, 0, WW, H); }, { edge: 0, gran: .15, mottle: .05, wobble: 0, cover: false, lift: 0 });
    // moonlight: cool shaft from the round window onto the floor
    p.glaze(g => { const a = fl(-230, .1), b = fl(230, .1), c = fl(260, .3), d = fl(-260, .3); g.fillStyle = 'rgba(170,190,240,.5)'; g.beginPath(); g.moveTo(win.x - win.r * .8, win.y + 40); g.lineTo(win.x + win.r * .8, win.y + 40); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath(); g.fill(); }, { blend: 'screen', soft: 14, edge: 0, cover: false, alpha: .55, wobble: 0 });
    p.glaze(g => { const c = fl(0, .19); g.fillStyle = 'rgba(190,205,250,.8)'; g.beginPath(); g.ellipse(c[0], c[1], 300, 70, 0, 0, 7); g.fill(); }, { blend: 'screen', soft: 12, edge: 0, cover: false, alpha: .45, wobble: 3 });
    // warm lantern light pooling on the desk, wall and ceiling
    p.glaze(g => { const [lx, ly] = lantern; const gr = g.createRadialGradient(lx, ly - 40, 10, lx, ly - 40, 520); gr.addColorStop(0, 'rgba(255,190,100,.9)'); gr.addColorStop(.3, 'rgba(255,170,90,.4)'); gr.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = gr; g.fillRect(0, 0, WW, H); }, { blend: 'screen', edge: 0, wobble: 0, cover: false, alpha: .7 });
    // window sill catching moonlight, frame rim
    p.gouache(g => { g.strokeStyle = 'rgba(200,214,255,.55)'; g.lineWidth = 3; g.beginPath(); g.arc(win.x, win.y, win.r - 8, Math.PI * 1.1, Math.PI * 1.6); g.stroke(); }, { wobble: 1, soft: 1, cover: false });
  }, { full: true });
  // near layer: a big collar tie beam across the top and a hanging lamp chain; the corner of a bookcase at left
  L.nearF = 1.35;
  L.near = BGW.plate('attic-near', W + PAN * L.nearF, H, p => {
    const w = p.w, r = rng('atticn');
    p.knock(g => { fillP(g, [[-20, 60], [w + 20, 30], [w + 20, 150], [-20, 180]], '#000'); });
    p.glaze(g => fillP(g, rough([[-20, 60], [w + 20, 30], [w + 20, 150], [-20, 180]], 'tie', 1.5, 40), '#5a3a28'), { edge: .5, gran: .35, mottle: .12, wobble: 1 });
    p.glaze(g => { g.fillStyle = 'rgba(40,30,60,.75)'; g.beginPath(); g.moveTo(-20, 130); g.lineTo(w + 20, 104); g.lineTo(w + 20, 150); g.lineTo(-20, 180); g.closePath(); g.fill(); for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(30,20,20,.5)'; g.fillRect(r() * w, 60 + r() * 60, r.range(40, 160), 2); } }, { edge: .3, gran: .3, cover: false, wobble: 1 });
    p.gouache(g => { g.fillStyle = 'rgba(255,190,120,.4)'; g.beginPath(); g.moveTo(w * .55, 34); g.lineTo(w + 20, 30); g.lineTo(w + 20, 40); g.lineTo(w * .55, 46); g.fill(); }, { soft: 2, wobble: 1, cover: false });
    // bookcase edge at the near left, deep in shadow
    p.knock(g => fillP(g, P.rect(-20, 120, 150, H), '#000'));
    p.glaze(g => { fillP(g, P.rect(-20, 120, 150, H), '#4a3226'); for (let y = 260; y < H; y += 190) fillP(g, P.rect(-20, y, 150, 16), '#3a261c'); for (let y = 270; y < H; y += 190) { let x = -20; while (x < 120) { const bw2 = r.range(14, 24); fillP(g, P.rect(x, y + 16, bw2, r.range(120, 160)), r.pick(['#6a2a24', '#2f4450', '#4a5a2a', '#805a2a', '#4d3443'])); x += bw2 + 2; } } }, { edge: .5, gran: .3, wobble: 1 });
    p.glaze(g => { g.fillStyle = 'rgba(30,28,60,.7)'; g.fillRect(-20, 120, 150, H); }, { cover: false, edge: 0, wobble: 0 });
  });
  return L;
};
// opts: pan 0..1 (tiny drift), lantern 0..1 (glow strength), moon 0..1
function bgAttic(g, t, opts = {}) {
  const L = BGATT._L || (BGATT._L = BGATT.layers());
  const PAN = BGATT.WW - W, pan = clamp(opts.pan ?? .5), cam = pan * PAN, part = opts.part || 'all';
  if (part !== 'front') {
  BGW.layer(g, L.main, -cam);
  // twinkling stars in the round window
  const { x: wx, y: wy, r: wr } = L.win, rr = rng('astars');
  g.save(); g.beginPath(); g.arc(wx - cam, wy, wr - 8, 0, 7); g.clip();
  for (let i = 0; i < 26; i++) { const sx = wx - cam + rr.range(-wr, wr), sy = wy + rr.range(-wr, wr * .3), f = .5 + .5 * Math.sin(t * rr.range(1.5, 4) + i * 3); g.fillStyle = `rgba(255,250,230,${.35 + .6 * f})`; g.fillRect(sx, sy, 2, 2); }
  g.restore();
  const [lx, ly] = L.lantern, lv = opts.lantern ?? 1;
  bgLampGlow(g, t, [[lx - cam, ly - 40, 1]], { r: 420, a: .38 * lv, col: '255,186,100', flicker: 1.4 });
  bgLampGlow(g, t, [[lx - cam, ly - 40, 1]], { r: 90, a: .5 * lv, col: '255,236,180', flicker: 1.4 });
  bgSunGlow(g, wx + 50 - cam, wy - 40, { a: .18 * (opts.moon ?? 1), r: 260, col: '200,215,255' });
  }
  if (part === 'back') return;
  BGW.layer(g, L.near, -cam * L.nearF);
}

// =====================================================================================================
// 6. SUNRISE over the town — the finale. Rooftops in silhouette, the sun climbing out of the hills.
// =====================================================================================================
const BGSUN = { WW: 2200, SX: 820 };
BGSUN.layers = function () {
  const { WW } = BGSUN, PAN = WW - W, { P, fillP, vgrad, rough, stroke } = BGW, K = BGK;
  const L = {};
  L.skyF = .1;
  const SW = W + PAN * L.skyF;
  const skyPlate = (key, stops, glow, cloudCols) => BGW.plate(key, SW, H, p => {
    const r = rng('sunsky');
    K.skyWash(p, 0, 0, SW, H, stops, { gran: .08 });
    p.glaze(g => { const gr = g.createRadialGradient(BGSUN.SX, 640, 20, BGSUN.SX, 640, 1300); gr.addColorStop(0, glow[0]); gr.addColorStop(.35, glow[1]); gr.addColorStop(1, 'rgba(255,200,140,0)'); g.fillStyle = gr; g.fillRect(0, 0, SW, H); }, { edge: 0, wobble: 0, gran: .04, mottle: .2 });
    // long horizontal clouds lit from below (pink-gold undersides)
    for (let i = 0; i < 7; i++) {
      const y = r.range(140, 520), x = r.range(-200, SW), w = r.range(300, 700), h = r.range(18, 46);
      p.glaze(g => { g.fillStyle = cloudCols[0]; g.beginPath(); g.ellipse(x, y, w, h, r.gauss() * .02, 0, 7); g.fill(); }, { soft: 4, wobble: 12, edge: .3, alpha: .8, gran: .1, cover: false });
      p.glaze(g => { g.fillStyle = cloudCols[1]; g.beginPath(); g.ellipse(x + 20, y + h * .45, w * .85, h * .35, 0, 0, 7); g.fill(); }, { blend: 'source-over', soft: 3, wobble: 8, edge: 0, alpha: .85, cover: false });
    }
  }, { full: true });
  L.dawn = skyPlate('sun-dawn', [[0, '#3a3f78'], [.35, '#6a5a8e'], [.6, '#c47c8a'], [.78, '#eda07a'], [1, '#f6c58a']], ['rgba(255,170,110,.7)', 'rgba(240,140,120,.3)'], ['#7a5a88', '#f0a088']);
  L.day = skyPlate('sun-day', [[0, '#5c86b8'], [.35, '#9cb4cc'], [.6, '#f0c89a'], [.78, '#fbd59a'], [1, '#fde2aa']], ['rgba(255,226,150,.9)', 'rgba(255,200,130,.4)'], ['#c99aa0', '#ffe2a6']);
  // far hills (cool, hazy), sun sits behind these until it clears them
  L.farF = .3;
  L.far = BGW.plate('sun-far', W + PAN * L.farF, H, p => {
    const w = p.w, h1 = K.ridge('sh1', -40, w + 40, 610, 60, 24, 1.2), h2 = K.ridge('sh2', -40, w + 40, 660, 30, 24, 2.4);
    p.glaze(g => fillP(g, [...h1, [w + 40, H], [-40, H]], '#9a88a8'), { edge: .35, soft: 1.5, wobble: 8, gran: .2, sep: .3 });
    p.glaze(g => fillP(g, [...h2, [w + 40, H], [-40, H]], '#7e6e96'), { edge: .4, soft: 1, wobble: 5, gran: .25 });
    p.glaze(g => { g.fillStyle = vgrad(g, 0, 560, 0, 720, [[0, 'rgba(255,190,150,0)'], [1, 'rgba(255,190,150,.7)']]); g.fillRect(0, 560, w, 300); }, { blend: 'screen', edge: 0, wobble: 0, cover: false, alpha: .6 });
    L.mill = [w * .72, K.ridgeY(h1, w * .72) + 8 - 90 * .42, .42];
  });
  // mid: the town's rooftops as violet silhouettes with warm rims; a few windows still lit
  L.midF = .62;
  L.mid = BGW.plate('sun-mid', W + PAN * L.midF, H, p => {
    const w = p.w, r = rng('sunmid');
    L.wins = [];
    for (const [base, s, col, haze] of [[700, .35, '#7a6890', .3], [770, .5, '#584672', .15], [860, .7, '#3e2f58', 0]]) {
      const pl = BGW.plane([[0, base], [w, base], [w, base - 400 * s], [0, base - 400 * s]], w / s, 400);
      const hs = []; let u = -40;
      while (u < w / s + 40) { const hw = r.range(140, 260); hs.push(K.house(pl, u, hw, r.range(150, 300), r, { roofType: r.pick(['gable', 'hip', 'step', 'gable', 'mansard']), wall: col, roof: mix(col, '#2a2040', .25), shutter: col, lit: 1, brick: false, boxes: false, balcony: -1, shutterP: 0, curtains: 0, glowP: 0, shop: null, chimneys: r() < .8 ? [r.range(.2, .8)] : [] })); u += hw + r.range(-12, 6); }
      if (s === .5) hs.push(K.house(pl, 1900, 200, 520, r, { roofType: 'gable', rh: 360, wall: col, roof: mix(col, '#2a2040', .25), chimneys: [], lit: 1, shutterP: 0, glowP: 0 }));
      p.knock(g => hs.forEach(H0 => { fillP(g, BGK.mapP(H0, P.rect(0, -30, H0.w, H0.h + 30)), '#000'); fillP(g, BGK.mapP(H0, BGK.roofPoly(H0)), '#000'); H0.chimneys.forEach(cu => { const c = cu * H0.w; fillP(g, BGK.mapP(H0, P.rect(c - 11, H0.h, 22, BGK.roofTop(H0) - H0.h + 20)), '#000'); }); }), { erode: 2 });
      p.glaze(g => hs.forEach(H0 => { fillP(g, BGK.mapP(H0, P.rect(0, -30, H0.w, H0.h + 30)), col); fillP(g, BGK.mapP(H0, BGK.roofPoly(H0)), mix(col, '#2a2040', .2)); H0.chimneys.forEach(cu => { const c = cu * H0.w; fillP(g, BGK.mapP(H0, P.rect(c - 11, H0.h, 22, BGK.roofTop(H0) - H0.h + 20)), mix(col, '#2a2040', .2)); }); }), { edge: .45, gran: .25, mottle: .1, wobble: 2, sep: .3, sepHue: 18, lift: .02 });
      p.glaze(g => hs.forEach(H0 => { fillP(g, BGK.mapP(H0, P.rect(0, -30, H0.w, H0.h + 30)), col); fillP(g, BGK.mapP(H0, BGK.roofPoly(H0)), col); }), { edge: .2, gran: .2, mottle: .1, wobble: 2, cover: false, alpha: .6, lift: 0 });
      p.glaze(g => { g.fillStyle = vgrad(g, 0, base - 200 * s, 0, base, [[0, 'rgba(40,24,60,0)'], [1, `rgba(40,24,60,${.35 + (1 - haze) * .25})`]]); g.fillRect(0, base - 260 * s, w, 260 * s + 20); }, { edge: 0, wobble: 0, cover: false, soft: 4 });
      // warm rim on roof edges facing the sun (sun ahead, low): top edges glow
      p.gouache(g => hs.forEach(H0 => { const rp = BGK.mapP(H0, BGK.roofPoly(H0)); g.lineWidth = 2.5 * s + 1; g.strokeStyle = `rgba(255,${196 + haze * 40},${140 + haze * 60},.7)`; g.beginPath(); g.moveTo(rp[1][0], rp[1][1]); for (let i = 2; i < rp.length; i++) g.lineTo(rp[i][0], rp[i][1]); g.lineTo(rp[0][0], rp[0][1]); g.stroke(); }), { wobble: 1, soft: .8, cover: false, dry: .45 });
      // lit windows (some), remembered for twinkling
      hs.forEach(H0 => { BGK.windows(H0).forEach(wn => { if (r() < .18) { const q = BGK.mapP(H0, BGK.winPoly(wn)); const xs = q.map(a => a[0]), ys = q.map(a => a[1]); L.wins.push([Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]); } }); });
      p.glaze(g => { g.fillStyle = vgrad(g, 0, base - 300 * s, 0, base, [[0, 'rgba(255,190,150,0)'], [1, `rgba(255,190,150,${.15 + haze})`]]); g.fillRect(0, base - 300 * s, w, 300 * s + 10); }, { blend: 'screen', edge: 0, wobble: 0, cover: false, alpha: .4 });
    }
    // the clock tower silhouette at the right
    L.face = bgPaintTower(p, w * .74, 900, 150, 560, { lean: .015, side: 34, spireH: 150, lit: .15, stone: '#5a4a74', roof: '#3f3a5e' });
  });
  // near: the roof we stand on (tiles, ridge, chimney), dark with a warm rim along the ridge
  L.nearF = 1;
  L.near = BGW.plate('sun-near', W + PAN * L.nearF, H, p => {
    const w = p.w, r = rng('sunnear');
    const ridge = y => 900 + Math.sin(y / 500) * 8;
    const roofQ = [[-20, ridge(0)], [w + 20, ridge(w) - 20], [w + 20, H + 10], [-20, H + 10]];
    p.knock(g => fillP(g, roofQ, '#000'), { erode: 0 });
    p.glaze(g => fillP(g, rough(roofQ, 'rq', 1.5, 30), '#5a3a44'), { edge: .4, gran: .3, mottle: .25, wobble: 2, sep: .3 });
    p.glaze(g => { for (let y = ridge(0) + 24, k = 0; y < H + 20; y += 22 + k * 2, k++) for (let x = -20 + (k % 2) * 30; x < w + 20; x += 60) { g.fillStyle = 'rgba(40,24,34,.55)'; g.beginPath(); g.ellipse(x + 30, y, 30, 9 + k * .4, 0, 0, Math.PI); g.fill(); } }, { edge: .4, gran: .3, alpha: .7, cover: false, wobble: 1 });
    p.gouache(g => { stroke(g, [[-20, ridge(0) + 2], [w * .5, ridge(w * .5) - 8], [w + 20, ridge(w) - 18]], 7, 'rgba(255,196,130,.85)', 'rim', 0); }, { wobble: 1, soft: 1, cover: false, dry: .2 });
    // chimney at the left with a little pot
    const cx = 260;
    p.knock(g => fillP(g, P.rect(cx, 700, 90, 230), '#000'), { erode: 0 });
    p.glaze(g => { fillP(g, P.rect(cx, 700, 90, 230), '#6a4048'); fillP(g, P.rect(cx - 10, 690, 110, 22), '#4a2c36'); fillP(g, P.rect(cx + 30, 650, 30, 44), '#7a4a3a'); }, { edge: .5, gran: .3, wobble: 1 });
    p.gouache(g => { g.fillStyle = 'rgba(255,196,130,.8)'; g.fillRect(cx + 84, 712, 6, 210); g.fillRect(cx + 54, 652, 5, 40); }, { wobble: 1, cover: false, dry: .2 });
    p.glaze(g => { g.fillStyle = vgrad(g, 0, 900, 0, H, [[0, 'rgba(30,20,40,0)'], [1, 'rgba(30,20,40,.5)']]); g.fillRect(0, 880, w, 220); }, { edge: 0, cover: false, wobble: 0 });
  });
  return L;
};
// soft god rays (cached, blurred once), centred on (1400, 1400)
function bgRays(seed = 'rays') {
  return cached('bgRays' + seed, 2800, 2800, g => {
    const T = BGW.mk(2800, 2800), t = T.getContext('2d'), rr = rng(seed);
    const rg = t.createRadialGradient(1400, 1400, 80, 1400, 1400, 1400); rg.addColorStop(0, 'rgba(255,226,176,.32)'); rg.addColorStop(.5, 'rgba(255,226,176,.12)'); rg.addColorStop(1, 'rgba(255,226,176,0)'); t.fillStyle = rg;
    for (let i = 0; i < 16; i++) { const a = -Math.PI * rr.range(.02, .98), w0 = rr.range(.01, .05); t.beginPath(); t.moveTo(1400, 1400); t.lineTo(1400 + Math.cos(a - w0) * 1400, 1400 + Math.sin(a - w0) * 1400); t.lineTo(1400 + Math.cos(a + w0) * 1400, 1400 + Math.sin(a + w0) * 1400); t.closePath(); t.fill(); }
    g.filter = 'blur(14px)'; g.drawImage(T, 0, 0); g.filter = 'none';
  });
}
// opts: k 0..1 sunrise progress (sun climbs, sky warms from dawn violet to gold), pan 0..1
function bgSunrise(g, t, opts = {}) {
  const L = BGSUN._L || (BGSUN._L = BGSUN.layers());
  const k = clamp(opts.k ?? .5), PAN = BGSUN.WW - W, cam = clamp(opts.pan ?? .3) * PAN, part = opts.part || 'all';
  if (part === 'front') { BGW.layer(g, L.near, -cam * L.nearF); return; }
  const sx = BGSUN.SX - cam * L.skyF, sy = lerp(700, 360, ease.outQ(k));
  BGW.layer(g, L.dawn, -cam * L.skyF);
  g.save(); g.globalAlpha = ease.inOutQ(k); BGW.layer(g, L.day, -cam * L.skyF); g.restore();
  // god rays from the sun (slowly turning)
  g.save(); g.globalCompositeOperation = 'screen';
  g.globalAlpha = .55 + .45 * k; g.translate(sx, sy); g.rotate(Math.sin(t * .05) * .03); g.drawImage(bgRays(), -1400, -1400); g.setTransform(1, 0, 0, 1, 0, 0);
  g.restore();
  // the sun disc + halo
  bgSunGlow(g, sx, sy, { a: .55 + .3 * k, r: 900, col: '255,206,140' });
  g.save(); g.fillStyle = '#fff3d0'; g.beginPath(); g.arc(sx, sy, 70, 0, 7); g.fill(); g.fillStyle = 'rgba(255,236,190,.5)'; g.beginPath(); g.arc(sx, sy, 92, 0, 7); g.fill(); g.restore();
  const fx = -cam * L.farF;
  BGW.layer(g, L.far, fx);
  bgWindmill(g, t, L.mill[0] + fx, L.mill[1], L.mill[2], { col: '#6a5a80', sail: '#8a7aa0', cap: '#54466a', shade: 'rgba(40,30,60,.3)' });
  const mx = -cam * L.midF;
  BGW.layer(g, L.mid, mx);
  bgWindowTwinkle(g, t, L.wins.map(([x, y, w, h]) => [x + mx, y, w, h]), { a: .75 * (1 - k * .7), rate: .2 });
  bgClockHands(g, L.face, opts.clock ?? 6.1, mx, 0);
  bgSunGlow(g, sx, sy + 120, { a: .25 + .2 * k, r: 1300, col: '255,190,140' });
  if (part === 'back') return;
  BGW.layer(g, L.near, -cam * L.nearF);
}

// =====================================================================================================
// 7a. THE TOWN AT NIGHT, every window lit — the rooftop view re-lit for night (shares the roof plates).
// =====================================================================================================
// a cached night-tinted copy of a layer canvas (multiply by colour, alpha preserved)
function bgTinted(src, key, col, a = 1) {
  return cached('bgTint:' + key, src.width, src.height, g => {
    g.drawImage(src, 0, 0);
    g.globalCompositeOperation = 'multiply'; g.globalAlpha = a; g.fillStyle = col; g.fillRect(0, 0, src.width, src.height);
    g.globalAlpha = 1; g.globalCompositeOperation = 'destination-in'; g.drawImage(src, 0, 0);
  });
}
const BGNIGHT = {};
BGNIGHT.sky = () => BGW.plate('night-sky', W + (BGROOF.WW - W) * .15, H, p => {
  const w = p.w, r = rng('nsky');
  BGK.skyWash(p, 0, 0, w, H, [[0, '#141c3c'], [.45, '#24305a'], [.62, '#3d4672'], [.72, '#6a5a7a'], [1, '#8a6a74']], { gran: .12, sepHue: 25 });
  p.glaze(g => { const gr = g.createRadialGradient(w * .22, 160, 10, w * .22, 160, 600); gr.addColorStop(0, 'rgba(210,220,255,.5)'); gr.addColorStop(1, 'rgba(210,220,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, H); }, { blend: 'screen', edge: 0, wobble: 0, cover: false });
  p.gouache(g => { g.fillStyle = '#f6f0d8'; g.beginPath(); g.arc(w * .22, 160, 46, 0, 7); g.fill(); g.fillStyle = 'rgba(190,190,170,.55)'; g.beginPath(); g.arc(w * .22 - 12, 152, 10, 0, 7); g.arc(w * .22 + 14, 172, 7, 0, 7); g.fill(); }, { soft: 1, wobble: 1 });
  p.glaze(g => { for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(80,80,120,.7)'; g.beginPath(); g.ellipse(r.range(0, w), r.range(240, 470), r.range(200, 420), r.range(8, 18), 0, 0, 7); g.fill(); } }, { soft: 5, wobble: 12, edge: .3, alpha: .5, cover: false });
  p.salt(g => g.rect(0, 0, w, 420), 90, { rmin: 2, rmax: 7, alpha: .14, col: '200,210,255' });
  p.gouache(g => { for (let i = 0; i < 260; i++) { const y = Math.pow(r(), 1.4) * 520; g.fillStyle = `rgba(255,250,235,${r.range(.25, .9)})`; const s2 = r() < .08 ? 2.6 : 1.4; g.fillRect(r() * w, y, s2, s2); } }, { wobble: 0, cover: false });
}, { full: true });
// lit windows painted once (warm panes + soft glow), aligned with the roof-mid plate
BGNIGHT.lights = () => {
  const L = BGROOF._L || (BGROOF._L = BGROOF.layers()), mid = L.mid;
  return cached('bgNightLights', mid.width, mid.height, g => {
    const r = rng('nlights');
    const T = BGW.mk(mid.width, mid.height), t = T.getContext('2d');
    // far → near: each row first erases what it hides, then lights its own windows
    (L.rowWin || []).forEach((wins, i) => {
      t.globalCompositeOperation = 'destination-out'; t.fillStyle = '#000'; (L.rowSil[i] || []).forEach(q => { tracePoly(t, q); t.fill(); });
      t.globalCompositeOperation = 'source-over';
      wins.forEach(q => {
        if (r() < .12) return;
        t.globalAlpha = r.range(.55, 1); t.fillStyle = r.pick(['#ffd27a', '#ffc464', '#ffe0a0', '#f6b25a', '#ffb050']); tracePoly(t, q); t.fill();
        // mullions: a dark cross
        const cx = q.reduce((a, b) => a + b[0], 0) / q.length, cy = q.reduce((a, b) => a + b[1], 0) / q.length, xs = q.map(a => a[0]), ys = q.map(a => a[1]);
        const ww = Math.max(...xs) - Math.min(...xs), hh = Math.max(...ys) - Math.min(...ys);
        t.globalAlpha = .55; t.fillStyle = '#4a3a40'; t.fillRect(cx - Math.max(.6, ww * .05), Math.min(...ys), Math.max(1.2, ww * .1), hh); t.fillRect(Math.min(...xs), cy - Math.max(.6, hh * .03), ww, Math.max(1.2, hh * .06));
        t.globalAlpha = 1;
      });
    });
    t.globalCompositeOperation = 'destination-in'; t.drawImage(mid, 0, 0);
    g.filter = 'blur(10px)'; g.globalAlpha = .7; g.drawImage(T, 0, 0); g.filter = 'none'; g.globalAlpha = 1;
    g.drawImage(T, 0, 0);
  });
};
// opts: pan 0..1, twinkle (0..1)
function bgNightTown(g, t, opts = {}) {
  const L = BGROOF._L || (BGROOF._L = BGROOF.layers());
  const pan = clamp(opts.pan ?? .5), cam = pan * (BGROOF.WW - W);
  BGW.layer(g, BGNIGHT.sky(), -cam * L.skyF);
  const fx = -cam * L.farF, mx = -cam * L.midF;
  BGW.layer(g, bgTinted(L.far, 'roof-far-n', '#3c4478', 1), fx);
  bgWindmill(g, t, L.mill[0] + fx, L.mill[1], L.mill[2], { col: '#3a3a5e', sail: '#4a4a70', cap: '#2e2e4e', shade: 'rgba(0,0,0,0)' });
  BGW.layer(g, bgTinted(L.mid, 'roof-mid-n', '#384070', 1), mx);
  // windows: lit layer (screen) + a few that switch on/off
  g.save(); g.globalCompositeOperation = 'screen'; BGW.layer(g, BGNIGHT.lights(), mx); g.restore();
  const wp = [].concat(...(L.rowWin || []).slice(3)), rr = rng('ntw');
  g.save();
  for (let i = 0; i < 70; i++) { const q = wp[Math.floor(rr() * wp.length)]; if (!q) continue; const k = Math.floor(t * .3 + rr() * 9); if ((hashStr('nw' + i + ':' + k) % 100) < 45) { g.fillStyle = 'rgba(40,44,80,.85)'; g.beginPath(); q.forEach(([x, y], j) => j ? g.lineTo(x + mx, y) : g.moveTo(x + mx, y)); g.closePath(); g.fill(); } }
  g.restore();
  L.glints.forEach(([x, y, w, h], i) => bgWaterGlints(g, t, x + mx, y, w, h, { n: 50, seed: 'ng' + i, size: .6, col: '255,214,150', a: .7 }));
  g.save(); g.fillStyle = 'rgba(20,20,50,.45)'; g.fillRect(0, 830, W, 140); g.restore();
  BGW.layer(g, bgTinted(L.near, 'roof-near-n', '#47507e', 1), -cam * L.nearF);
  bgSunGlow(g, 300 - cam * .15, 160, { a: .12, r: 700, col: '200,215,255' });
}

// =====================================================================================================
// 7b. SEA AND SKY VORTEX — a whirlpool in the sea mirrored by a spiral of cloud with sun in its eye.
// The spirals are painted flat once and turned per frame (cheap), squashed into perspective.
// =====================================================================================================
const BGVOR = { HY: 560, R: 1300 };
// a flat painted spiral disc (size 2R): kind 'sea' | 'sky'
BGVOR.disc = function (kind) {
  const R = BGVOR.R, S = R * 2;
  return BGW.plate('vortex-' + kind, S, S, p => {
    const r = rng('vx' + kind), c = R;
    const sea = kind === 'sea';
    // base disc
    p.glaze(g => { const gr = g.createRadialGradient(c, c, 0, c, c, R); if (sea) { gr.addColorStop(0, '#0e2a3e'); gr.addColorStop(.12, '#1f4c62'); gr.addColorStop(.5, '#3b7486'); gr.addColorStop(1, 'rgba(70,128,140,0)'); } else { gr.addColorStop(0, 'rgba(255,236,190,1)'); gr.addColorStop(.1, 'rgba(250,214,160,1)'); gr.addColorStop(.3, 'rgba(200,186,196,.95)'); gr.addColorStop(.75, 'rgba(150,150,184,.8)'); gr.addColorStop(1, 'rgba(150,150,184,0)'); } g.fillStyle = gr; g.fillRect(0, 0, S, S); }, { edge: 0, gran: .3, mottle: .3, wobble: 0, sep: .3 });
    // spiral arms: logarithmic spirals of strokes (foam streaks / cloud bands)
    const arms = sea ? 5 : 4;
    for (const pass of [0, 1, 2]) {
      p.glaze(g => {
        for (let a = 0; a < arms; a++) for (let k = 0; k < (sea ? 30 : 18); k++) {
          const th0 = a / arms * Math.PI * 2 + r.range(0, sea ? .5 : .9), rad0 = R * Math.pow(r(), .8) * .95 + R * .05;
          const n = 8 + Math.floor(r() * 12), pts = []; for (let j = 0; j < n; j++) { const th = th0 + j * .09, rr = rad0 * Math.exp(-j * .045) * (1 + Math.sin(j * .7 + k) * .02); pts.push([c + Math.cos(th) * rr, c + Math.sin(th) * rr]); }
          const wdt = (sea ? r.range(2, 14) : r.range(30, 110)) * (rad0 / R + .2);
          let col;
          if (sea) col = pass === 0 ? 'rgba(20,60,80,.6)' : pass === 1 ? 'rgba(150,200,205,.55)' : 'rgba(240,250,245,.75)';
          else col = pass === 0 ? 'rgba(110,104,150,.32)' : pass === 1 ? 'rgba(252,240,222,.6)' : 'rgba(255,214,150,.55)';
          BGW.stroke(g, pts, pass === 2 ? wdt * .4 : wdt, col, 'sp' + kind + pass + a + k, .9);
        }
      }, { blend: pass === 0 ? 'multiply' : 'source-over', edge: pass === 0 ? .3 : 0, soft: sea ? 1.5 : 6, wobble: sea ? 2 : 8, gran: .2, mottle: .3, cover: false, streak: sea ? .3 : 0 });
    }
    // eye
    if (sea) p.glaze(g => { const gr = g.createRadialGradient(c, c, 0, c, c, R * .2); gr.addColorStop(0, 'rgba(6,20,30,1)'); gr.addColorStop(.4, 'rgba(10,30,44,.7)'); gr.addColorStop(1, 'rgba(6,20,30,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); }, { edge: 0, wobble: 0, cover: false });
    else p.gouache(g => { const gr = g.createRadialGradient(c, c, 0, c, c, R * .14); gr.addColorStop(0, 'rgba(255,250,228,1)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); }, { wobble: 0, cover: false });
    // fade the disc edge to transparent so it melts into the surrounding sea / sky
    p.direct(g => { g.globalCompositeOperation = 'destination-in'; const gr = g.createRadialGradient(c, c, R * .55, c, c, R); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); });
  }, { full: true });
};
BGVOR.base = () => BGW.plate('vortex-base', W, H, p => {
  const { HY } = BGVOR, r = rng('vbase');
  // stormy-bright sky: lavender clouds, gold breaking through at the centre
  BGK.skyWash(p, 0, 0, W, HY + 10, [[0, '#4a5a8a'], [.5, '#8a8fb0'], [.85, '#e6c6a6'], [1, '#f2d8b0']], { gran: .12 });
  // sea: deep teal, lighter toward the horizon, with swell streaks
  p.glaze(g => { g.fillStyle = BGW.vgrad(g, 0, HY, 0, H, [[0, '#9cc0c4'], [.2, '#5a8e9a'], [1, '#1e4a5e']]); g.fillRect(0, HY, W, H - HY); }, { edge: 0, gran: .25, mottle: .3, wobble: 0, sep: .3 });
  p.glaze(g => { for (let i = 0; i < 160; i++) { const y = HY + Math.pow(r(), 1.6) * (H - HY), w = (8 + (y - HY) * .5) * r.range(.5, 1.5); g.fillStyle = r() < .5 ? 'rgba(20,60,80,.5)' : 'rgba(190,225,225,.5)'; g.beginPath(); g.ellipse(r() * W, y, w, 1 + (y - HY) * .012, 0, 0, 7); g.fill(); } }, { edge: .2, soft: 1, wobble: 3, cover: false, streak: .3 });
  p.glaze(g => { g.fillStyle = 'rgba(255,230,180,.7)'; g.fillRect(0, HY - 3, W, 6); }, { blend: 'screen', soft: 4, edge: 0, cover: false, wobble: 3 });
}, { full: true });
// opts: spin (rad/s multiplier, default 1), k 0..1 (vortex strength: 0 = calm sea, 1 = full vortex)
function bgVortex(g, t, opts = {}) {
  const { HY } = BGVOR, R = BGVOR.R, spin = opts.spin ?? 1, k = clamp(opts.k ?? 1);
  BGW.layer(g, BGVOR.base(), 0);
  // sky spiral: centred above, squashed (seen from below at an angle), turning
  g.save(); g.globalAlpha = k; g.translate(W / 2, 250); g.scale(1, .42); g.rotate(-t * .05 * spin); g.drawImage(BGVOR.disc('sky'), -R, -R); g.restore();
  bgSunGlow(g, W / 2, 250, { a: .55 * k + .2, r: 700, col: '255,226,170' });
  // horizon glow line
  g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(0, HY - 8, W, 16); g.restore();
  // sea whirlpool: centred below the horizon, squashed into perspective, turning the other way
  g.save(); g.beginPath(); g.rect(0, HY, W, H - HY); g.clip();
  g.globalAlpha = k; g.translate(W / 2, 800); g.scale(1, .3); g.rotate(t * .08 * spin); g.drawImage(BGVOR.disc('sea'), -R, -R); g.restore();
  // spray + glints
  bgWaterGlints(g, t, W * .3, HY + 4, W * .4, 200, { n: 50, seed: 'vg', size: .45, col: '255,246,220', a: .7 });
  // the column of light between the eyes
  const col = cached('vortexColumn', 360, 640, c => { const gr = c.createLinearGradient(90, 0, 270, 0); gr.addColorStop(0, 'rgba(255,230,180,0)'); gr.addColorStop(.5, 'rgba(255,236,196,.28)'); gr.addColorStop(1, 'rgba(255,230,180,0)'); c.fillStyle = gr; c.filter = 'blur(12px)'; c.beginPath(); c.moveTo(140, 20); c.lineTo(220, 20); c.lineTo(290, 570); c.quadraticCurveTo(180, 600, 70, 570); c.closePath(); c.fill(); });
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = k; g.drawImage(col, W / 2 - 180, 230); g.restore();
}

// =====================================================================================================
// 7c. SUNLIT HOSPITAL WARD (1950s) — beds down both walls, tall windows pouring sunlight, sunflowers.
// =====================================================================================================
const BGWARD = { F: 820, VX: 960, VY: 430, XL: -3.2, XR: 3.2, YF: -1.6, YC: 2.2, Z0: 1.0, Z1: 15 };
BGWARD.plate = () => BGW.plate('ward', W, H, p => {
  const C = BGWARD, { F, VX, VY, XL, XR, YF, YC, Z0, Z1 } = C, { fillP, vgrad, stroke, P } = BGW, r = rng('ward');
  const P3 = (x, y, z) => [VX + F * x / z, VY - F * y / z];
  const quad = (a, b, c, d) => [P3(...a), P3(...b), P3(...c), P3(...d)];
  const sh = '#7a86a8';
  // room shell
  const floorQ = quad([XL, YF, Z0], [XR, YF, Z0], [XR, YF, Z1], [XL, YF, Z1]);
  const ceilQ = quad([XL, YC, Z0], [XR, YC, Z0], [XR, YC, Z1], [XL, YC, Z1]);
  const leftQ = quad([XL, YF, Z0], [XL, YF, Z1], [XL, YC, Z1], [XL, YC, Z0]);
  const rightQ = quad([XR, YF, Z0], [XR, YF, Z1], [XR, YC, Z1], [XR, YC, Z0]);
  const endQ = quad([XL, YF, Z1], [XR, YF, Z1], [XR, YC, Z1], [XL, YC, Z1]);
  p.glaze(g => { fillP(g, BGW.inflate(endQ, 4), '#efe4c8'); }, { edge: .3, gran: .15, mottle: .25 });
  p.glaze(g => { fillP(g, BGW.inflate(leftQ, 4), '#f2e8cf'); fillP(g, BGW.inflate(rightQ, 4), '#eadfc4'); }, { edge: .3, gran: .15, mottle: .25, sep: .2 });
  p.glaze(g => { fillP(g, BGW.inflate(ceilQ, 4), '#f6eedb'); }, { edge: .2, gran: .1, mottle: .2 });
  p.glaze(g => { fillP(g, BGW.inflate(floorQ, 4), '#d9c49a'); }, { edge: .2, gran: .25, mottle: .3, sep: .3 });
  // mint dado on the walls (1950s hospital green)
  const dado = .0;
  p.glaze(g => { fillP(g, quad([XL, YF, Z0], [XL, YF, Z1], [XL, dado, Z1], [XL, dado, Z0]), '#a9c9b4'); fillP(g, quad([XR, YF, Z0], [XR, YF, Z1], [XR, dado, Z1], [XR, dado, Z0]), '#a2c2ae'); fillP(g, quad([XL, YF, Z1], [XR, YF, Z1], [XR, dado, Z1], [XL, dado, Z1]), '#a9c9b4'); }, { edge: .4, gran: .2, mottle: .3 });
  // linoleum tiles: a soft checker in perspective
  p.glaze(g => { for (let i = -6; i < 6; i++) for (let j = 0; j < 22; j++) { if ((i + j) % 2) continue; const x0 = i * .55, z0 = Z0 + j * .62; if (x0 < XL || x0 + .55 > XR) continue; fillP(g, quad([x0, YF, z0], [x0 + .55, YF, z0], [x0 + .55, YF, z0 + .62], [x0, YF, z0 + .62]), 'rgba(170,140,100,.18)'); } }, { edge: .3, gran: .2, cover: false, wobble: 0 });
  // windows: tall, between the beds, on both walls; sky blue panes
  const bedZ = [2.6, 4.7, 6.8, 8.9, 11, 13.1];
  const winZ = [1.15, 3.25, 5.35, 7.45, 9.55, 11.65, 13.75];
  const winQ = (x, z) => quad([x, .25, z - .42], [x, .25, z + .42], [x, 2.05, z + .42], [x, 2.05, z - .42]);
  p.knock(g => winZ.forEach(z => { if (z > Z0 + .1) { fillP(g, winQ(XL, z), '#000'); fillP(g, winQ(XR, z), '#000'); } }), { erode: 0 });
  p.glaze(g => winZ.forEach(z => { if (z > Z0 + .1) { const a = winQ(XL, z), b = winQ(XR, z); g.fillStyle = vgrad(g, 0, a[2][1], 0, a[0][1], [[0, '#9ec2dc'], [1, '#e8eef0']]); fillP(g, a); g.fillStyle = vgrad(g, 0, b[2][1], 0, b[0][1], [[0, '#a8c6dc'], [1, '#e2eaec']]); fillP(g, b); } }), { edge: .3, gran: .1, wobble: 1 });
  p.glaze(g => winZ.forEach(z => { if (z <= Z0 + .1) return; for (const x of [XL, XR]) { g.strokeStyle = '#c8bca0'; g.lineWidth = Math.max(1, 30 / z); const q = winQ(x, z); g.beginPath(); g.moveTo(...q[0]); g.lineTo(...q[1]); g.lineTo(...q[2]); g.lineTo(...q[3]); g.closePath(); g.stroke(); const m = P3(x, 1.15, z), m2 = P3(x, 1.15, z); const t0 = P3(x, .25, z), t1 = P3(x, 2.05, z); g.beginPath(); g.moveTo(...t0); g.lineTo(...t1); g.stroke(); const l0 = P3(x, 1.4, z - .42), l1 = P3(x, 1.4, z + .42); g.beginPath(); g.moveTo(...l0); g.lineTo(...l1); g.stroke(); } }), { edge: .2, cover: false, wobble: 0, gran: 0 });
  // end wall: double doors, a clock, a round window
  p.glaze(g => { fillP(g, quad([-.7, YF, Z1 - .01], [.7, YF, Z1 - .01], [.7, .9, Z1 - .01], [-.7, .9, Z1 - .01]), '#c9b48a'); }, { edge: .45, gran: .2 });
  p.gouache(g => { const c = P3(0, 1.75, Z1 - .01); g.fillStyle = '#fbf6ea'; g.beginPath(); g.arc(c[0], c[1], 11, 0, 7); g.fill(); g.strokeStyle = '#6a5a4a'; g.lineWidth = 2; g.stroke(); g.beginPath(); g.moveTo(c[0], c[1]); g.lineTo(c[0] + 5, c[1] - 4); g.moveTo(c[0], c[1]); g.lineTo(c[0], c[1] - 8); g.stroke(); }, { wobble: 0 });
  // beds (far → near), heads against the walls, feet to the aisle
  const bed = (side, zc) => {
    const xh = side < 0 ? XL + .05 : XR - .05, xf = side < 0 ? XL + 1.95 : XR - 1.95, ym = -.9, yb = -1.22, z0 = zc - .44, z1 = zc + .44;
    const top = quad([xh, ym, z0], [xf, ym, z0], [xf, ym, z1], [xh, ym, z1]);
    const front = quad([xh, ym, z0], [xf, ym, z0], [xf, yb, z0], [xh, yb, z0]);
    const foot = quad([xf, ym, z0], [xf, ym, z1], [xf, yb, z1], [xf, yb, z0]);
    const tz = z1 + .32, tx1 = xh + (side < 0 ? .5 : -.5);
    const tFront = quad([xh, -.75, tz - .2], [tx1, -.75, tz - .2], [tx1, YF, tz - .2], [xh, YF, tz - .2]);
    const tTop = quad([xh, -.75, tz - .2], [tx1, -.75, tz - .2], [tx1, -.75, tz + .2], [xh, -.75, tz + .2]);
    const tSide = quad([tx1, -.75, tz - .2], [tx1, -.75, tz + .2], [tx1, YF, tz + .2], [tx1, YF, tz - .2]);
    return { top, front, foot, xh, xf, zc, z0, z1, ym, yb, side, tz, tx1, tFront, tTop, tSide };
  };
  const beds = []; bedZ.forEach(z => { beds.push(bed(-1, z + .9)); beds.push(bed(1, z + .9)); });
  beds.sort((a, b) => b.zc - a.zc);
  for (let i = 0; i < beds.length; i += 2) {
    const pair = beds.slice(i, i + 2);
    const sw = b => Math.max(1.2, 26 / b.zc);
    // bedside tables (behind the bed, nearer the far end)
    p.knock(g => pair.forEach(b => { fillP(g, b.tFront, '#000'); fillP(g, b.tTop, '#000'); fillP(g, b.tSide, '#000'); }), { erode: 0 });
    p.glaze(g => pair.forEach(b => { fillP(g, b.tFront, '#e8e2d4'); fillP(g, b.tTop, '#f4efe4'); fillP(g, b.tSide, '#d8d0c0'); }), { edge: .45, gran: .1, wobble: 0 });
    p.gouache(g => pair.forEach(b => { const x = (b.xh + b.tx1) / 2, v = P3(x, -.75, b.tz), s = 34 / b.tz; g.fillStyle = '#86aec4'; g.fillRect(v[0] - s * .22, v[1] - s * .8, s * .44, s * .8); for (let k = 0; k < 3; k++) { const fx = v[0] + (k - 1) * s * .42, fy = v[1] - s * (1.7 + (k % 2) * .3); g.strokeStyle = '#5d8a4a'; g.lineWidth = Math.max(1, s * .07); g.beginPath(); g.moveTo(v[0], v[1] - s * .7); g.lineTo(fx, fy); g.stroke(); g.fillStyle = '#f2b33d'; g.beginPath(); g.arc(fx, fy, s * .3, 0, 7); g.fill(); g.fillStyle = '#6a4024'; g.beginPath(); g.arc(fx, fy, s * .12, 0, 7); g.fill(); } }), { wobble: 0, dry: .1 });
    // iron headboard against the wall
    p.glaze(g => pair.forEach(b => { const w = sw(b) * .8; for (const z of [b.z0, b.z1]) stroke(g, [P3(b.xh, YF, z), P3(b.xh, -.3, z)], w, '#d8dce0', 'hp' + z, 0); for (const y of [-.32, -.6]) stroke(g, [P3(b.xh, y, b.z0), P3(b.xh, y, b.z1)], w * .8, '#d8dce0', 'hr' + y + b.zc, 0); }), { edge: .5, cover: false, wobble: 0, dark: .7 });
    // shadow under the bed on the floor
    p.glaze(g => pair.forEach(b => fillP(g, quad([b.xh, YF, b.z0 + .05], [b.xf + (b.side < 0 ? .1 : -.1), YF, b.z0 + .1], [b.xf + (b.side < 0 ? .1 : -.1), YF, b.z1 + .1], [b.xh, YF, b.z1 + .05]), '#6a6a88')), { alpha: .45, soft: 3, edge: 0, cover: false, wobble: 2 });
    // the bed: white sheets, pale blue blanket, pillow
    p.knock(g => pair.forEach(b => { fillP(g, b.top, '#000'); fillP(g, b.front, '#000'); fillP(g, b.foot, '#000'); }), { erode: 0 });
    p.glaze(g => pair.forEach(b => { fillP(g, b.front, '#f2eee6'); fillP(g, b.foot, '#ece8e0'); }), { edge: .45, gran: .1, mottle: .2, wobble: 1 });
    p.glaze(g => pair.forEach(b => { const xs = b.xh + (b.xf - b.xh) * .34; fillP(g, quad([xs, b.ym, b.z0], [b.xf, b.ym, b.z0], [b.xf, b.ym, b.z1], [xs, b.ym, b.z1]), '#c2d2dc'); fillP(g, quad([xs, b.ym, b.z0], [b.xf, b.ym, b.z0], [b.xf, b.yb + .03, b.z0], [xs, b.yb + .03, b.z0]), '#b4c6d4'); fillP(g, quad([b.xf, b.ym, b.z0], [b.xf, b.ym, b.z1], [b.xf, b.yb + .03, b.z1], [b.xf, b.yb + .03, b.z0]), '#b0c2d0'); }), { edge: .45, gran: .15, mottle: .25, wobble: 1 });
    p.glaze(g => pair.forEach(b => { const xs = b.xh + (b.xf - b.xh) * .34; for (let k = 0; k < 3; k++) { const u = lerp(xs, b.xf, .2 + k * .28); stroke(g, [P3(u, b.ym, b.z0), P3(u + (b.xf - b.xh) * .06, b.ym, b.z1)], Math.max(2, 40 / b.zc), 'rgba(110,130,160,.5)', 'fold' + k + b.zc + b.side, .8); } }), { soft: 2, edge: .2, cover: false, wobble: 2 });
    p.gouache(g => pair.forEach(b => { const xp0 = b.xh + (b.xf - b.xh) * .04, xp1 = b.xh + (b.xf - b.xh) * .22; fillP(g, quad([xp0, b.ym + .1, b.z0 + .08], [xp1, b.ym + .1, b.z0 + .08], [xp1, b.ym + .1, b.z1 - .08], [xp0, b.ym + .1, b.z1 - .08]), '#ffffff'); const xs = b.xh + (b.xf - b.xh) * .34; fillP(g, quad([xs - .04 * b.side * -1, b.ym + .02, b.z0], [xs + (b.side < 0 ? .12 : -.12), b.ym + .02, b.z0], [xs + (b.side < 0 ? .12 : -.12), b.ym + .02, b.z1], [xs, b.ym + .02, b.z1]), '#fbf9f2'); }), { wobble: 1, edge: .35, edgeW: 3, dark: .85 });
    p.glaze(g => pair.forEach(b => { g.globalAlpha = b.side < 0 ? .4 : .15; fillP(g, b.front, sh); g.globalAlpha = b.side < 0 ? .2 : .45; fillP(g, b.foot, sh); g.globalAlpha = .35; fillP(g, b.tSide, sh); g.globalAlpha = 1; }), { edge: .3, cover: false, wobble: 0, soft: 1 });
    // foot rail + legs (iron, cream enamel)
    p.glaze(g => pair.forEach(b => { const w = sw(b); stroke(g, [P3(b.xf, -.62, b.z0), P3(b.xf, -.62, b.z1)], w, '#c8ccd0', 'rl' + b.zc + b.side, 0); for (const z of [b.z0, b.z1]) { stroke(g, [P3(b.xf, -.62, z), P3(b.xf, b.ym, z)], w * .9, '#c8ccd0', 'lg' + z + b.side, 0); stroke(g, [P3(b.xf, b.yb, z), P3(b.xf, YF, z)], w * .9, '#c8ccd0', 'lh' + z + b.side, 0); } stroke(g, [P3(b.xh, b.yb, b.z0), P3(b.xh, YF, b.z0)], w * .9, '#c8ccd0', 'lk' + b.zc + b.side, 0); }), { edge: .5, cover: false, wobble: 0, dark: .65 });
  }
  // pendant lamps
  p.gouache(g => [3, 6, 9, 12].forEach(z => { const a = P3(0, YC, z), b = P3(0, 1.75, z), s = 36 / z; g.strokeStyle = '#6a6a70'; g.lineWidth = Math.max(1, s * .08); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.fillStyle = '#e8e4d8'; g.beginPath(); g.moveTo(b[0] - s, b[1] + s * .6); g.lineTo(b[0] + s, b[1] + s * .6); g.lineTo(b[0] + s * .3, b[1]); g.lineTo(b[0] - s * .3, b[1]); g.closePath(); g.fill(); }), { wobble: 0 });
  // sunlight: shafts from the left windows down to bright patches on the floor (sun high, from the left)
  const sun = [1.5, -1.2, -.25]; // direction the light travels (x, y, z) per unit
  const patch = z => { const pts = [[XL, .25, z - .42], [XL, .25, z + .42], [XL, 2.05, z + .42], [XL, 2.05, z - .42]].map(([x, y, zz]) => { const tt = (y - YF) / -sun[1]; return [x + sun[0] * tt, YF, zz + sun[2] * tt]; }); return pts; };
  p.glaze(g => winZ.forEach(z => { if (z < Z0 + .3) return; const pts = patch(z).map(q => P3(...q)); g.fillStyle = 'rgba(255,240,200,1)'; fillP(g, pts); }), { blend: 'screen', edge: 0, soft: 2, wobble: 3, cover: false, alpha: .85 });
  p.glaze(g => winZ.forEach(z => { if (z < Z0 + .6) return; const w0 = winQ(XL, z), pt = patch(z).map(q => P3(...q)); g.fillStyle = 'rgba(255,240,205,.32)'; g.beginPath(); g.moveTo(...w0[3]); g.lineTo(...w0[2]); g.lineTo(...pt[1]); g.lineTo(...pt[0]); g.closePath(); g.fill(); g.beginPath(); g.moveTo(...w0[0]); g.lineTo(...w0[1]); g.lineTo(...pt[2]); g.lineTo(...pt[3]); g.closePath(); g.fill(); }), { blend: 'screen', edge: 0, soft: 10, wobble: 5, cover: false, alpha: .6 });
  // general airy light + atmospheric fade toward the end of the ward
  p.glaze(g => { const c = P3(0, .5, Z1); const gr = g.createRadialGradient(c[0], c[1], 20, c[0], c[1], 700); gr.addColorStop(0, 'rgba(255,248,228,.6)'); gr.addColorStop(1, 'rgba(255,248,228,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }, { blend: 'screen', edge: 0, wobble: 0, cover: false });
}, { full: true });
// opts: motes 0..1 (dust in the sunbeams)
function bgWard(g, t, opts = {}) {
  BGW.layer(g, BGWARD.plate(), 0);
  // dust motes drifting in the beams
  const r = rng('motes'), n = Math.round(90 * (opts.motes ?? 1));
  g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) { const x0 = r.range(80, 1100), y0 = r.range(150, 950), ph = r() * 6.28, sp = r.range(.1, .3); const x = x0 + Math.sin(t * sp + ph) * 30 + t * 6 % 40, y = y0 + Math.cos(t * sp * .7 + ph) * 20 - t * 4 % 30, f = .5 + .5 * Math.sin(t * 2 + ph); g.fillStyle = `rgba(255,246,220,${.25 + .5 * f})`; g.beginPath(); g.arc(x, y, r.range(1, 2.4), 0, 7); g.fill(); }
  g.restore();
}


// =====================================================================================================
// Staging helpers
// =====================================================================================================
// Where to stand a character on the town square: u 0..1 across the 3200-px square, depth 0 (at the far
// facades) … 1 (front edge of frame). Returns screen {x, y, s}: feet position and a scale (1 at the front).
function bgTownSpot(pan, u, depth) {
  const cam = clamp(pan) * (BGTOWN.MW - W), y = lerp(BGTOWN.BASE + 6, H - 10, depth);
  return { x: u * BGTOWN.MW - cam, y, s: lerp(.42, 1, depth) };
}
// Rooftop terrace: x in screen px at pan; feet line on the terrace floor (in front of the parapet).
function bgRooftopSpot(pan, x, depth = .5) { return { x, y: lerp(1000, 1075, depth), s: lerp(.9, 1.05, depth) }; }

// =====================================================================================================
// PUBLIC API (all pure functions of their arguments; heavy painting is cached on first use)
// =====================================================================================================
//  bgTown(g, t, {pan 0..1, light 0..1, clock hours, lamps 0..1, drift, part})      town square, 3200-px pan
//  bgRooftop(g, t, {pan 0..1, light, drift, part})                                 clock-tower terrace, chorus stage
//  bgSky(g, t, {y 0..1 (0 horizon … 1 zenith), drift, clock})                       tall sky for tilts / title drop
//  bgCorridor(g, t, {z bays (dolly), bob px, fog})  + bgCorridorDoors({z}) → door card quads
//  bgAttic(g, t, {pan, lantern 0..1, moon 0..1, part})                             night study (BGATT._L.lantern / .win)
//  bgSunrise(g, t, {k 0..1 sunrise progress, pan, clock, part})                    finale
//  bgNightTown(g, t, {pan})                                                         every window lit (rooftop view at night)
//  bgVortex(g, t, {k 0..1 strength, spin})                                          sea + sky whirl
//  bgWard(g, t, {motes 0..1})                                                       sunlit 1950s hospital ward
//  part: 'all' (default) | 'back' (everything behind the nearest layer) | 'front' (nearest layer only), so
//        characters can be drawn between them: bgTown(g,t,{pan,part:'back'}); drawChar(...); bgTown(g,t,{pan,part:'front'}).
//  Animated bits usable anywhere: bgCloudDrift, bgWindmill, bgLampGlow, bgWindowTwinkle, bgWaterGlints,
//        bgSunGlow, bgClockHands, bgFunicular.  Painting kit: BGW.Plate (glaze / gouache / knock / salt),
//        BGK (sky, clouds, houses), bgPaintFacades, bgPaintTower, bgPaintTrees, bgPaintCobbles.
