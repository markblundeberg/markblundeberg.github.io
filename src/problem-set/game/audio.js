// audio.js — PROBLEM SET ∞ (the demo): every sound in the game.
//
//   GMAudio.init(base = 'assets/')  call inside the START click. Creates (and unlocks) the AudioContext synchronously,
//                                   resolves at once; the BGM files keep loading in the background (GMAudio.ready).
//   GMAudio.bgm(name)               'hub' | 'puzzle' | 'trunk' | null. 0.6 s crossfade, sample-exact seamless loops.
//                                   Asked for before its file has decoded, it starts as soon as it has.
//   GMAudio.sfx(name, opt)          start shatter tap select page coin hint qed wrong locked fanfare.
//                                   opt (all optional): { gain: 1, pitch: 0 (semitones), delay: 0 (s) }
//   GMAudio.blip(speaker, ch)       'hilde' | 'claude' | 'sys' (anything else: sys). One typewriter blip; ch (optional):
//                                   whitespace is silent. Rate-limited the way the video's cold open did it: at most
//                                   one blip per slot of the music's grid (a 16th at 108 BPM, ~0.14 s), so a stream of
//                                   calls becomes the cold open's beeping morse.
//   GMAudio.setMuted(bool), GMAudio.muted, GMAudio.setVolume(0..1) (default 1 = the modest built-in level)
//
// All sound is synthesised: the BGM in game/tools/music.py (MP3s in assets/), the SFX and blips here, as sample
// buffers computed on first use (a port of the video's tools/sfx.py palette: soft squares, triangles, pulses, a music
// box, filtered noise; melodic sounds in G major, the waltz's key). Nothing here ever throws into the game: no
// AudioContext, a failed fetch or decode, or a sandboxed page all just mean silence.
(() => {
  'use strict';
  const W = typeof window !== 'undefined' ? window : globalThis;
  const AC = W.AudioContext || W.webkitAudioContext || null;

  // ------------------------------------------------------------------ levels and loops
  // Loops: the MP3s are periodic everywhere (pre-roll = the loop's end, post-roll = its start), so these points are
  // seamless even where a browser ignores the MP3 gapless header (the loop is then just phase-shifted by ~25 ms).
  // Seconds are exact at 44.1 and 48 kHz (every loop is a whole number of 1/300 s). Mirrors assets/audio.json.
  const TRACKS = {
    hub:    { file: 'hub.mp3',    loopStart: 0.2, loopEnd: 40.2, grid: 60 / 108 / 4, level: 1.00 },
    puzzle: { file: 'puzzle.mp3', loopStart: 0.2, loopEnd: 36.2, grid: 60 / 80 / 6,  level: 1.00 },
    trunk:  { file: 'trunk.mp3',  loopStart: 0.2, loopEnd: 30.2, grid: 60 / 72 / 6,  level: 1.00 },
  };
  const MASTER = 0.8, BGM_BUS = 0.7, XFADE = 0.6, DUCK = 0.5;     // out: BGM ≈ -27..-29 dBFS RMS; SFX peaks -4..-15, blips -16..-20
  const GRID_IDLE = 60 / 108 / 4;                                 // blip grid when no music is playing

  // ------------------------------------------------------------------ tiny DSP kit (mono Float32Arrays)
  const PC = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
  const hz = n => { const m = /^([A-G]#?)(-?\d)$/.exec(n); return 440 * Math.pow(2, (PC[m[1]] - 9) / 12 + (+m[2] - 4)); };
  const TAU = Math.PI * 2;
  function rng(seed) {        // mulberry32: every sound is the same every time
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const _sq = new Map();
  function sqTable(f, bright) {   // one period of sfx.py's soft_square: odd harmonics below 9 kHz, rolled off, peak-normalised
    let nh = 0; for (let k = 1; k < 12; k += 2) { if (f * k > 9000) break; nh = k; }
    const key = nh + ':' + bright; if (_sq.has(key)) return _sq.get(key);
    const TN = 2048, t = new Float32Array(TN + 1); let mx = 0;
    for (let j = 0; j <= TN; j++) { let v = 0; for (let k = 1; k <= nh; k += 2) v += Math.sin(TAU * k * j / TN) / k * Math.pow(bright, (k - 1) / 2); t[j] = v; mx = Math.max(mx, Math.abs(v)); }
    for (let j = 0; j <= TN; j++) t[j] /= mx || 1;
    _sq.set(key, t); return t;
  }
  function Kit(sr) {
    const K = {
      sr, n: d => Math.max(1, Math.round(d * sr)),
      buf: d => new Float32Array(K.n(d)),
      add(out, x, t, g = 1) { const o = Math.round(t * sr); for (let i = 0; i < x.length && o + i < out.length; i++) if (o + i >= 0) out[o + i] += x[i] * g; return out; },
      // attack-decay envelope (sfx.py env_ad): min(1, t/a) * exp(-(t-a) * curve / d)
      env(x, a = .003, d = .08, curve = 4) { for (let i = 0; i < x.length; i++) { const t = i / sr; x[i] *= Math.min(1, t / Math.max(a, 1e-4)) * Math.exp(-Math.max(0, t - a) * curve / Math.max(d, 1e-4)); } return x; },
      // oscillators. f: Hz; o.drop/o.dropRate: pitch starts at f*(1+drop) and falls; o.vib: vibrato depth
      osc(type, f, d, o = {}) {
        const x = K.buf(d); let ph = o.phase || 0;
        const bright = o.bright == null ? .35 : o.bright, duty = o.duty || .25;
        const tab = type === 'sq' ? sqTable(f, bright) : null, TN = 2048;
        for (let i = 0; i < x.length; i++) {
          const t = i / sr; let fi = f;
          if (o.drop) fi *= 1 + o.drop * Math.exp(-t * (o.dropRate || 40));
          if (o.vib) fi *= 1 + o.vib * Math.sin(TAU * 5.5 * t) * Math.min(1, Math.max(0, (t - .08) / .15));
          ph += fi / sr; ph -= Math.floor(ph);
          let v;
          if (type === 'sine') v = Math.sin(TAU * ph);
          else if (type === 'tri') v = 1 - 4 * Math.abs(ph - .5);              // starts at -1... shaped by env attack
          else if (type === 'pulse') v = (ph < duty ? 1 : -1) - (2 * duty - 1);
          else { const p = ph * TN, j = p | 0, fr = p - j; v = tab[j] + fr * (tab[j + 1] - tab[j]); }
          x[i] = v;
        }
        if (type === 'pulse') K.lp(x, o.warm || 5200);
        return x;
      },
      // add amp * sin(2π f t) * exp(-rate t) from t = 0 (a damped-sinusoid recurrence: no Math.sin per sample)
      partial(x, f, amp, rate) {
        if (f >= sr * .48) return x;
        const w = TAU * f / sr, r = Math.exp(-rate / sr), c = 2 * r * Math.cos(w), r2 = r * r;
        let y2 = 0, y1 = amp * r * Math.sin(w); if (x.length > 1) x[1] += y1;
        for (let i = 2; i < x.length; i++) { const y = c * y1 - r2 * y2; x[i] += y; y2 = y1; y1 = y; }
        return x;
      },
      attack(x, a) { const m = Math.min(x.length, Math.round(a * sr)); for (let i = 0; i < m; i++) x[i] *= i / m; return x; },
      noise(d, r) { const x = K.buf(d); for (let i = 0; i < x.length; i++) x[i] = r() * 2 - 1; return x; },
      lp(x, fc) { const a = Math.exp(-TAU * fc / sr); let s = 0; for (let i = 0; i < x.length; i++) { s = (1 - a) * x[i] + a * s; x[i] = s; } return x; },
      hp(x, fc) { const a = Math.exp(-TAU * fc / sr); let s = 0; for (let i = 0; i < x.length; i++) { s = (1 - a) * x[i] + a * s; x[i] -= s; } return x; },
      bp(x, lo, hi) { return K.lp(K.hp(x, lo), hi); },
      chime(f, d = .6, decay = .45) {   // sfx.py s_chime: a struck, slightly stretched bell
        const x = K.buf(d), k = 4 / decay;
        K.partial(x, f, 1, k); K.partial(x, 2 * f, .5, k); K.partial(x, 3.01 * f, .25, k);
        return K.attack(x, .002);
      },
      musicbox(f, d = 1.4) {            // the BGM's music box
        const x = K.buf(d);
        K.partial(x, f, 1, 3.2); K.partial(x, 2.01 * f, .45, 12.2); K.partial(x, 4.2 * f, .2, 21.2);
        return x;
      },
      tone(f, d, a, dec, curve, mix = { tri: .6, sq: .4 }, bright = .25) {   // the video's "solve" voice: triangle + soft square
        const x = K.buf(d);
        if (mix.tri) K.add(x, K.osc('tri', f, d), 0, mix.tri);
        if (mix.sq) K.add(x, K.osc('sq', f, d, { bright }), 0, mix.sq);
        if (mix.sine) K.add(x, K.osc('sine', f, d), 0, mix.sine);
        return K.env(x, a, dec, curve);
      },
      stamp(big) {                      // sfx.py s_stamp: a sine thump with a falling pitch, a paper slap, soft-clipped
        const r = rng(big ? 11 : 12), d = big ? .5 : .3;
        const body = K.env(K.osc('sine', big ? 62 : 120, d, { drop: big ? .9 : .5, dropRate: 35 }), .002, big ? .12 : .07, 5);
        const slap = K.env(K.bp(K.noise(d, r), big ? 300 : 500, big ? 3500 : 2600), .001, big ? .03 : .02, 6);
        const x = K.buf(d);
        for (let i = 0; i < x.length; i++) x[i] = Math.tanh((body[i] * (big ? 1 : .7) + slap[i] * (big ? .8 : .5)) * 1.6) * .8;
        return x;
      },
    };
    return K;
  }

  // ------------------------------------------------------------------ the SFX palette
  // Each returns a mono Float32Array; it is then normalised to PEAK[name] (linear, before the master gain).
  const PEAK = { start: .50, shatter: .60, tap: .22, select: .32, page: .34, coin: .42, hint: .42, qed: .80, wrong: .42,
    locked: .50, fanfare: .70 };
  const SFX = {
    // boot chime: the handheld power-on (G4 D5 G5 soft squares) and a bell on top
    start(K) {
      const out = K.buf(1.3);
      ['G4', 'D5', 'G5'].forEach((n, i) => K.add(out, K.env(K.osc('sq', hz(n), .55, { bright: .3 }), .004, .35, 3), i * .09, .25));
      K.add(out, K.chime(hz('D6'), .9, .55), .30, .16); K.add(out, K.chime(hz('G6'), .9, .55), .33, .10);
      return out;
    },
    // the pixel screen shatters into the painted world: crack, glass tinkles pitched on the G pentatonic, a whoosh, a thump
    shatter(K) {
      const r = rng(7), d = 1.5, out = K.buf(d);
      K.add(out, K.env(K.hp(K.noise(d, r), 3000), .001, .08, 8), 0, .6);
      K.add(out, K.env(K.osc('sine', 85, .4, { drop: .6, dropRate: 30 }), .002, .1, 5), 0, .45);
      const pent = ['G6', 'A6', 'B6', 'D7', 'E7', 'G7', 'A7', 'B7', 'D8'];
      for (let k = 0; k < 30; k++) {
        const o = Math.pow(r(), 1.6) * .95, f = hz(pent[Math.floor(r() * pent.length)]) * (1 + (r() - .5) * .012), dd = .16;
        const c = K.buf(dd); K.partial(c, f, 1, 75); K.partial(c, 2.76 * f, .3, 75);
        K.add(out, K.attack(c, .0005), o, .08 + r() * .17);
      }
      const w = K.lp(K.hp(K.noise(1.2, r), 250), 2500);
      for (let i = 0; i < w.length; i++) w[i] *= Math.pow(Math.sin(Math.PI * i / w.length), 1.5);
      K.add(out, w, .1, .3);
      return out;
    },
    // UI tap: a tiny click with a whisper of D6
    tap(K) {
      const r = rng(3), out = K.buf(.05);
      K.add(out, K.env(K.bp(K.noise(.04, r), 2500, 8000), .0005, .01, 6), 0, .5);
      K.add(out, K.env(K.osc('sq', hz('D6'), .04, { bright: .2 }), .0008, .02, 5), 0, .3);
      return out;
    },
    // a choice: two quick rising soft squares, D5 -> G5
    select(K) {
      const out = K.buf(.16);
      K.add(out, K.env(K.osc('sq', hz('D5'), .07, { bright: .35 }), .002, .05, 3), 0, .5);
      K.add(out, K.env(K.osc('sq', hz('G5'), .1, { bright: .35 }), .002, .06, 3), .045, .5);
      return out;
    },
    // a book page: filtered noise whose brightness sweeps as the page lifts, a flutter, a soft flap as it lands
    page(K) {
      const r = rng(5), d = .32, x = K.noise(d, r), out = K.buf(.36);
      const sr = K.sr; let s1 = 0, s2 = 0;
      for (let i = 0; i < x.length; i++) {
        const t = i / sr, u = t / d;
        const fc = 1200 + 4800 * Math.sin(Math.PI * Math.min(1, u * 1.2)), a = Math.exp(-TAU * fc / sr), ah = Math.exp(-TAU * 500 / sr);
        s1 = (1 - a) * x[i] + a * s1; s2 = (1 - ah) * s1 + ah * s2;
        x[i] = (s1 - s2) * Math.pow(Math.sin(Math.PI * u), 2) * (1 + .35 * Math.sin(TAU * 23 * t));
      }
      K.add(out, x, 0, 1);
      K.add(out, K.env(K.bp(K.noise(.06, r), 300, 1500), .001, .03, 5), .22, .6);
      return out;
    },
    // a hint coin: B5 -> E6, the oldest coin in the book, and a glint
    coin(K) {
      const out = K.buf(.65);
      K.add(out, K.env(K.osc('sq', hz('B5'), .075, { bright: .45 }), .002, .2, 1), 0, .45);
      K.add(out, K.env(K.osc('sq', hz('E6'), .5, { bright: .45 }), .002, .35, 3), .07, .45);
      K.add(out, K.chime(hz('B6'), .5, .3), .07, .06);
      return out;
    },
    // a hint unlocked: a little latch click, then a rising G-pentatonic bell sparkle
    hint(K) {
      const r = rng(9), out = K.buf(.95);
      K.add(out, K.env(K.bp(K.noise(.02, r), 2000, 9000), .0005, .006, 6), 0, .5);
      ['B5', 'D6', 'E6', 'G6'].forEach((n, i) => K.add(out, K.chime(hz(n), .7), .04 + i * .055, .2));
      return out;
    },
    // Q.E.D.: the rubber stamp slams, then a short bright fanfare in G (triplet G B D, a held G5 over the G chord)
    qed(K) {
      const out = K.buf(1.75);
      K.add(out, K.stamp(true), 0, 1);
      ['G4', 'B4', 'D5'].forEach((n, i) => K.add(out, K.tone(hz(n), .14, .003, .1, 3), .15 + i * .07, .32));
      const t1 = .36;
      K.add(out, K.env(K.osc('pulse', hz('G5'), 1.1, { duty: .25, vib: .005 }), .005, .9, 2.6), t1, .30);
      for (const n of ['G4', 'B4', 'D5']) K.add(out, K.env(K.osc('tri', hz(n), 1.1), .006, .8, 2.6), t1, .13);
      K.add(out, K.env(K.osc('tri', hz('G3'), .9), .006, .6, 2.6), t1, .18);
      K.add(out, K.chime(hz('G6'), .8, .5), t1 + .02, .09); K.add(out, K.chime(hz('D7'), .7, .4), t1 + .09, .05);
      return out;
    },
    // ONCE MORE!: a light paper stamp and a kind little "hm, try again" (B4 A4, then up to D5). Soft, no buzz.
    wrong(K) {
      const out = K.buf(1.0);
      K.add(out, K.stamp(false), 0, .55);
      const v = (n, d) => K.tone(hz(n), d, .012, d * .8, 2.5, { tri: .45, sine: .55 });
      K.add(out, v('B4', .18), .12, .30); K.add(out, v('A4', .18), .27, .28); K.add(out, v('D5', .5), .43, .32);
      return out;
    },
    // NOT YET: a padlock rattling on its hasp (metal clicks with a little ring, a dull clack of the body)
    locked(K) {
      const r = rng(21), out = K.buf(.55);
      K.add(out, K.env(K.osc('sine', 120, .15, { drop: .3, dropRate: 30 }), .002, .06, 5), 0, .35);
      const hits = [[0, 1], [.058, .7], [.112, .9], [.185, .55], [.255, .4], [.33, .2]];
      for (const [t, a] of hits) {
        K.add(out, K.env(K.bp(K.noise(.02, r), 2000, 9000), .0005, .006, 6), t, .7 * a);
        const ring = K.buf(.09); for (const f of [2130, 3350, 4720]) K.partial(ring, f * (1 + (r() - .5) * .03), 1, 100);
        K.add(out, K.attack(ring, .0005), t, .09 * a);
        K.add(out, K.env(K.osc('sine', 330 * (1 + (r() - .5) * .1), .05), .001, .02, 6), t, .25 * a);
      }
      return out;
    },
    // the ending: a short waltz-flavoured fanfare in G with a bass, harmony a third below, and a music-box sparkle
    fanfare(K) {
      const Q = .36, out = K.buf(3.6);
      const LEAD = [[0, 'D5', 1 / 3], [1 / 3, 'E5', 1 / 3], [2 / 3, 'F#5', 1 / 3], [1, 'G5', 1], [2, 'D5', .5], [2.5, 'G5', .5],
        [3, 'B5', 1], [4, 'C6', .5], [4.5, 'B5', .5], [5, 'A5', .5], [5.5, 'F#5', .5], [6, 'G5', 2.6]];
      const HARM = { 'G5': 'D5', 'D5': 'B4', 'B5': 'G5', 'C6': 'E5', 'A5': 'F#5', 'F#5': 'D5', 'E5': 'C5' };
      for (const [b, n, d] of LEAD) {
        const len = d * Q + .06, last = b === 6;
        K.add(out, K.env(K.osc('pulse', hz(n), len + (last ? .6 : 0), { duty: .25, vib: last ? .006 : .003 }), .005, last ? 1.0 : d * Q * .9, last ? 2.2 : 1.2), b * Q, .30);
        if (b >= 1) K.add(out, K.env(K.osc('pulse', hz(HARM[n]), len + (last ? .6 : 0), { duty: .125 }), .005, last ? 1.0 : d * Q * .9, last ? 2.2 : 1.2), b * Q, .13);
      }
      for (const [b, n, d] of [[1, 'G2', 1], [2, 'D3', 1], [3, 'B2', 1], [4, 'C3', 1], [5, 'D3', 1], [6, 'G2', 2.4]])
        K.add(out, K.env(K.osc('tri', hz(n), d * Q + .3), .004, d * Q * .8, 2), b * Q, .34);
      for (const [b, n] of [[1, 'G4'], [3, 'G4'], [4, 'G4'], [5, 'A4'], [6, 'G4']]) {
        const ch = { 1: ['B3', 'D4'], 3: ['B3', 'D4'], 4: ['C4', 'E4'], 5: ['C4', 'F#4'], 6: ['B3', 'D4'] }[b].concat([n]);
        for (const c of ch) K.add(out, K.env(K.osc('pulse', hz(c), Q * .6, { duty: .5 }), .003, .07, 1.5), b * Q, .045);
      }
      ['G5', 'B5', 'D6', 'G6', 'B6'].forEach((n, i) => K.add(out, K.musicbox(hz(n), 1.4), 6 * Q + .12 + i * .07, .10));
      return out;
    },
  };
  const SFX_NAMES = Object.keys(SFX);

  // typewriter blips: the cold open's soft squares (sfx.py s_blip), shortened to ~30 ms
  const SPEAK = { hilde: { note: 'G4', bright: .22, peak: .13 }, claude: { note: 'G5', bright: .42, peak: .19 }, sys: { note: 'D5', bright: .3, peak: .15 } };
  const BLIP_VAR = [0, 0, 1, -1, 2];          // semitone wobble, as in the video
  function synthBlip(K, who, v) {
    const s = SPEAK[who] || SPEAK.sys, f = hz(s.note) * Math.pow(2, BLIP_VAR[v] / 12);
    const x = K.env(K.osc('sq', f, .032, { bright: s.bright }), .002, .022, 3);
    for (let i = 0, m = K.n(.004); i < m; i++) x[x.length - 1 - i] *= i / m;
    return x;
  }
  function finish(K, x, peak) {
    let m = 0; for (let i = 0; i < x.length; i++) m = Math.max(m, Math.abs(x[i]));
    const g = m > 0 ? peak / m : 0, fo = Math.min(x.length, K.n(.01));
    for (let i = 0; i < x.length; i++) x[i] *= g;
    for (let i = 0; i < fo; i++) x[x.length - 1 - i] *= i / fo;
    return x;
  }
  // pure synthesis entry (also used by the offline checks): returns the normalised mono samples
  function synth(name, sr, variant = 0) {
    const K = Kit(sr);
    if (name.startsWith('blip:')) { const who = name.slice(5).split('#')[0]; return finish(K, synthBlip(K, who, variant), (SPEAK[who] || SPEAK.sys).peak); }
    return finish(K, SFX[name](K), PEAK[name]);
  }

  // ------------------------------------------------------------------ the engine
  let ctx = null, master = null, bgmBus = null, duckNode = null, sfxBus = null;
  let initP = null, readyP = null, base = 'assets/', volume = 1;
  const bufs = {};             // decoded BGM AudioBuffers
  const sfxBufs = {};          // name -> AudioBuffer (built lazily)
  let cur = null;              // the playing track: { name, src, g, t0 }
  let want;                    // the last requested track name (undefined: none yet)
  let lastBlip = -1;           // context time of the last scheduled blip
  const quiet = fn => { try { return fn(); } catch (e) { return undefined; } };

  function attach(c) {         // wire the graph onto a context (also used by the offline checks)
    ctx = c;
    master = ctx.createGain(); master.gain.value = API.muted ? 0 : MASTER * volume; master.connect(ctx.destination);
    bgmBus = ctx.createGain(); bgmBus.gain.value = BGM_BUS;
    duckNode = ctx.createGain(); duckNode.gain.value = 1;
    bgmBus.connect(duckNode); duckNode.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(master);
  }
  function makeBuffer(x) {
    const b = ctx.createBuffer(1, x.length, ctx.sampleRate);
    if (b.copyToChannel) b.copyToChannel(x, 0); else b.getChannelData(0).set(x);
    return b;
  }
  function sfxBuffer(name) {
    if (!sfxBufs[name]) sfxBufs[name] = makeBuffer(synth(name, ctx.sampleRate, +(name.split('#')[1] || 0)));
    return sfxBufs[name];
  }
  function decode(ab) {
    return new Promise((res, rej) => {
      try { const p = ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); } catch (e) { rej(e); }
    });
  }
  function load(b) {
    base = b == null ? base : b;
    return Promise.all(Object.keys(TRACKS).map(name =>
      fetch(base + TRACKS[name].file).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(decode).then(buf => { bufs[name] = buf; if (want === name && (!cur || cur.name !== name)) startTrack(name); })
        .catch(() => { }))).then(() => { });
  }
  function startTrack(name, from) {
    const T = TRACKS[name], buf = bufs[name], now = ctx.currentTime;
    const end = Math.min(T.loopEnd, buf.duration), off = from == null ? T.loopStart : Math.max(T.loopStart, Math.min(end - .01, from));
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.loopStart = T.loopStart; src.loopEnd = end;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(T.level, now + (from == null ? XFADE : .02));
    src.connect(g); g.connect(bgmBus);
    src.start(now, off);
    cur = { name, src, g, t0: now - (off - T.loopStart), grid: T.grid };
  }
  function fadeOut(c) {
    if (!c) return;
    const now = ctx.currentTime;
    quiet(() => { c.g.gain.cancelScheduledValues(now); c.g.gain.setValueAtTime(c.g.gain.value, now); c.g.gain.linearRampToValueAtTime(0, now + XFADE); });
    quiet(() => c.src.stop(now + XFADE + .05));
    setTimeout(() => quiet(() => c.g.disconnect()), (XFADE + .3) * 1000);
  }
  function duck(dur) {
    const now = ctx.currentTime, p = duckNode.gain;
    p.cancelScheduledValues(now); p.setValueAtTime(p.value, now);
    p.linearRampToValueAtTime(DUCK, now + .06); p.setValueAtTime(DUCK, now + dur); p.linearRampToValueAtTime(1, now + dur + .8);
  }
  function play(buf, gain, rate, when) {
    const src = ctx.createBufferSource(); src.buffer = buf;
    if (rate !== 1) src.playbackRate.value = rate;
    let out = src;
    if (gain !== 1) { const g = ctx.createGain(); g.gain.value = gain; src.connect(g); out = g; }
    out.connect(sfxBus); src.start(when);
    if (out !== src) src.onended = () => quiet(() => out.disconnect());
  }
  function onVisibility() {
    if (!ctx || !ctx.suspend) return;
    quiet(() => { if (document.hidden) ctx.suspend(); else ctx.resume(); });
  }
  function kick() { if (ctx && ctx.state !== 'running' && !document.hidden) quiet(() => ctx.resume()); }

  const API = {
    muted: false,
    // call inside the START click
    init(b = 'assets/') {
      if (initP) return initP;
      initP = Promise.resolve();
      readyP = Promise.resolve();
      try {
        if (!AC) return initP;
        const c = new AC({ latencyHint: 'interactive' });
        attach(c);
        quiet(() => ctx.resume && ctx.resume());
        // iOS unlock: play one silent sample inside the gesture
        quiet(() => { const s = ctx.createBufferSource(); s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate); s.connect(ctx.destination); s.start(0); });
        quiet(() => { document.addEventListener('visibilitychange', onVisibility); ['pointerdown', 'keydown', 'touchend'].forEach(e => W.addEventListener(e, kick, { passive: true })); });
        readyP = quiet(() => load(b)) || Promise.resolve();
        API.ready = readyP;
        // build the SFX buffers a little at a time so the START frame stays smooth ('start' first, it plays next)
        // ('start' now, it plays next; 'shatter' soon; the rest after the shatter, one per idle moment. Any sound asked
        // for before its turn is simply built on the spot: a few ms.)
        quiet(() => sfxBuffer('start'));
        setTimeout(() => quiet(() => sfxBuffer('shatter')), 30);
        const order = ['tap', 'select', 'page', 'coin', 'hint', 'qed', 'wrong', 'locked', 'fanfare'];
        ['hilde', 'claude', 'sys'].forEach(w => BLIP_VAR.forEach((_, v) => order.splice(1, 0, `blip:${w}#${v}`)));
        const idle = W.requestIdleCallback ? fn => W.requestIdleCallback(fn, { timeout: 500 }) : fn => setTimeout(fn, 40);
        const step = () => { quiet(() => sfxBuffer(order.shift())); if (order.length) idle(step); };
        setTimeout(() => idle(step), 2000);
      } catch (e) { ctx = null; }
      return initP;
    },
    ready: Promise.resolve(),
    bgm(name) {
      quiet(() => {
        if (name !== null && !TRACKS[name]) return;
        want = name;
        if (!ctx) return;
        if (cur && cur.name === name) return;
        fadeOut(cur); cur = null;
        if (name && bufs[name]) startTrack(name);
      });
    },
    sfx(name, opt) {
      quiet(() => {
        if (!ctx || API.muted || !SFX[name]) return;
        const o = opt || {}, buf = sfxBuffer(name);
        const when = ctx.currentTime + Math.max(0, +o.delay || 0);
        if (name === 'qed' || name === 'fanfare') duck(buf.duration * .8);
        play(buf, o.gain == null ? 1 : Math.max(0, +o.gain), Math.pow(2, (+o.pitch || 0) / 12), when);
      });
    },
    blip(speaker, ch) {
      quiet(() => {
        if (!ctx || API.muted) return;
        if (typeof ch === 'string' && !ch.trim()) return;
        const who = SPEAK[speaker] ? speaker : 'sys';
        // one blip per slot of the music's grid (the cold open's quantised morse)
        const now = ctx.currentTime, grid = cur ? cur.grid : GRID_IDLE, t0 = cur ? cur.t0 : 0;
        const at = t0 + Math.ceil((now + .005 - t0) / grid) * grid;
        if (at < lastBlip + grid * .75) return;
        lastBlip = at;
        const v = Math.floor(Math.random() * BLIP_VAR.length);
        play(sfxBuffer(`blip:${who}#${v}`), 1, 1, at);
      });
    },
    setMuted(m) {
      quiet(() => {
        API.muted = !!m;
        if (!ctx) return;
        const now = ctx.currentTime, p = master.gain;
        p.cancelScheduledValues(now); p.setValueAtTime(p.value, now); p.linearRampToValueAtTime(API.muted ? 0 : MASTER * volume, now + .08);
      });
    },
    setVolume(v) {
      quiet(() => { volume = Math.max(0, Math.min(1, +v)); if (ctx && !API.muted) master.gain.setTargetAtTime(MASTER * volume, ctx.currentTime, .03); });
    },
    // for the offline checks and the demo page (not part of the game contract)
    _attach(c) { attach(c); }, _load: b => load(b), _synth: synth, _names: SFX_NAMES, _tracks: TRACKS,
    // demo page: jump into a track `before` seconds ahead of its loop seam, to listen to the wrap
    _preview(name, before = 3) { quiet(() => { if (!ctx || !bufs[name]) return; fadeOut(cur); want = name; startTrack(name, TRACKS[name].loopEnd - before); }); },
    _state: () => ({ ctx: ctx && ctx.state, sampleRate: ctx && ctx.sampleRate, track: cur && cur.name, loaded: Object.keys(bufs) }),
  };
  W.GMAudio = API;
})();
