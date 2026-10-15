// The engine's voice from "Engine, Learning to Sing", live: a port of the
// track's own DSP (overtone's dsp.c and song.py's cloog), so what you play here
// is the instrument you hear in the track, minus its sub, phaser and effects.
//
// Three detuned saws (-7, 0, +6 cents) and a fourth saw hard-synced to them:
// it restarts every time the engine's own cycle does, so its pitch stays the
// engine's, and what moves is a resonant peak on harmonic number `ratio`.
// Both through a 4-pole ladder filter (tanh in each stage) and a lopsided
// tube stage, at twice the sample rate, then a half-band filter down.
//
// CloogCore is plain JS (tested in node against the Python); the processor
// at the bottom wraps it for an AudioWorklet.

function polyblep(t, dt) {
  if (t < dt) { t /= dt; return t + t - t * t - 1.0; }
  if (t > 1.0 - dt) { t = (t - 1.0) / dt; return t * t + t + t + 1.0; }
  return 0.0;
}

class Saw {
  constructor(phase) { this.p = phase; }
  next(dt) {
    let v = 2.0 * this.p - 1.0 - polyblep(this.p, dt);
    this.p += dt;
    if (this.p >= 1.0) this.p -= 1.0;
    return v;
  }
}

// The hard-synced saw, polyBLEP-corrected at both its own wraps and the sync
// resets; it runs one sample late so the residual before each step can land.
class SyncSaw {
  constructor(phase) { this.pm = phase; this.ps = phase; this.prev = 0.0; }
  next(dtm, ratio) {
    const dts = dtm * ratio;
    this.pm += dtm;
    const psn = this.ps + dts;
    let cur;
    const blep = (x, h) => { this.prev += h * x * x * 0.5; cur -= h * (1.0 - x) * (1.0 - x) * 0.5; };
    if (this.pm >= 1.0) {
      this.pm -= 1.0;
      const xm = this.pm / dtm;
      let at = psn - xm * dts, xw = -1.0;
      if (at >= 1.0) { xw = xm + (at - 1.0) / dts; at -= 1.0; }
      const before = 2.0 * at - 1.0;
      this.ps = xm * dts;
      while (this.ps >= 1.0) this.ps -= 1.0;
      cur = 2.0 * this.ps - 1.0;
      if (xw >= 0.0 && xw < 1.0) blep(xw, -2.0);
      blep(xm, -1.0 - before);
    } else {
      this.ps = psn;
      let xs = -1.0;
      if (this.ps >= 1.0) { this.ps -= 1.0; xs = this.ps / dts; }
      cur = 2.0 * this.ps - 1.0;
      if (xs >= 0.0) blep(xs, -2.0);
    }
    const out = this.prev;
    this.prev = cur;
    return out;
  }
}

class Ladder {
  constructor() { this.s = [0, 0, 0, 0]; this.y = 0; }
  next(input, fc, res, drive, sr) {
    const f = fc < 0.45 * sr ? fc : 0.45 * sr;
    const g = Math.tan(Math.PI * f / sr), G = g / (1 + g);
    const nd = Math.tanh(drive);
    let x = Math.tanh(drive * (input - 4.0 * res * this.y)) / nd;
    for (let k = 0; k < 4; k++) {
      const v = (x - this.s[k]) * G, o = v + this.s[k];
      this.s[k] = o + v;
      x = Math.tanh(o);
    }
    this.y = x;
    return x * (1 + res);
  }
}

function tube(x, d) {
  const k = 1.3 * (1 + 3.0 * d), bias = 0.25 * d;
  return (Math.tanh(k * (x + bias)) - Math.tanh(k * bias)) / Math.tanh(1.3) / (1 + 1.2 * d);
}

// 2x -> 1x: a 47-tap windowed-sinc half-band low-pass
const HB = (() => {
  const N = 47, h = [], c = (N - 1) / 2;
  for (let i = 0; i < N; i++) {
    const t = i - c, w = 0.42 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)) + 0.08 * Math.cos(4 * Math.PI * i / (N - 1));
    h.push((t === 0 ? 0.5 : Math.sin(Math.PI * t / 2) / (Math.PI * t)) * w);
  }
  const s = h.reduce((a, b) => a + b, 0);
  return h.map(v => v / s);
})();

export class CloogCore {
  constructor(sr) {
    this.sr = sr;
    this.sro = 2 * sr;
    this.saws = [new Saw(0), new Saw(0.31), new Saw(0.62)];
    this.sync = new SyncSaw(0.13);
    this.lad = [new Ladder(), new Ladder()];
    this.hist = [new Float64Array(HB.length), new Float64Array(HB.length)];
    this.hi = 0;
    this.p = null;
  }
  // params: f0 (Hz), ratio, blend (0..1), cutoff (Hz), drive (0..1, the tube), gain
  // Changes glide over ~15 ms so nothing clicks.
  render(outL, outR, n, params) {
    if (!this.p) {
      this.p = Object.assign({}, params);
      this.sync.next(params.f0 / this.sro, params.ratio);   // the sync saw runs a sample late: prime it so it lines up
    }
    const a = 1 - Math.exp(-1 / (0.015 * this.sro));
    const det = [-7, 0, 6].map(c => Math.pow(2, c / 1200));
    const W = [[0.55, 0.3, 0.15], [0.15, 0.3, 0.55]];
    const L = HB.length;
    for (let i = 0; i < n; i++) {
      let y2 = [0, 0];
      for (let o = 0; o < 2; o++) {
        const p = this.p;
        for (const k in params) p[k] += a * (params[k] - p[k]);
        const dt = p.f0 / this.sro;
        const v = this.saws.map((s, j) => s.next(dt * det[j]));
        const sy = this.sync.next(dt, p.ratio);
        for (let ch = 0; ch < 2; ch++) {
          const x = (W[ch][0] * v[0] + W[ch][1] * v[1] + W[ch][2] * v[2]) * (1 - 0.5 * p.blend) + sy * p.blend * 1.1;
          const b = this.lad[ch].next(x, p.cutoff, 0.42, 1.6, this.sro);
          this.hist[ch][this.hi] = tube(b, p.drive);
        }
        this.hi = (this.hi + 1) % L;
        if (o === 1) {
          for (let ch = 0; ch < 2; ch++) {
            let acc = 0;
            for (let k = 0; k < L; k++) acc += HB[k] * this.hist[ch][(this.hi + k) % L];
            y2[ch] = acc;
          }
        }
      }
      outL[i] = y2[0] * this.p.gain;
      outR[i] = y2[1] * this.p.gain;
    }
  }
}

if (typeof registerProcessor !== 'undefined') {
  registerProcessor('cloog', class extends AudioWorkletProcessor {
    constructor() {
      super();
      this.core = new CloogCore(sampleRate);
      this.params = { f0: 46.25, ratio: 1, blend: 0.4, cutoff: 900, drive: 0.15, gain: 0 };
      this.port.onmessage = e => Object.assign(this.params, e.data);
    }
    process(inputs, outputs) {
      const out = outputs[0];
      this.core.render(out[0], out[1] || out[0], out[0].length, this.params);
      return true;
    }
  });
}
