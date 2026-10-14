// A small sound kit for the films: gentle effects synthesised offline, in the browser, from what
// the simulation did frame by frame. No samples and no music: each sound is made here from sine
// waves and seeded noise, placed in a small room (a generated reverb), and written out as a WAV
// for tools/film.js (driftlet) to mux under the frames.
//
// A score is { seconds, drops, toks, clicks, beds }:
//   drops  [{ t, f, pan, gain }]  a water-drop "plip": a sine whose pitch springs upward
//   toks   [{ t, f, pan, gain }]  a soft wooden "tok": a sine that sags as it dies
//   bonks  [{ t, f, pan, gain }]  a soft, low, rubbery "bonk": something went a little wrong
//   clicks [{ t, gain }]          a plug going in or out
//   bells  [{ t, f, pan, gain }]  a soft chime: a few out-of-tune partials, ringing out over a second
//   beds   [{ kind: 'rush' | 'bell', fps, gain: [per frame], pan?: [per frame], f? }]  continuous
//          sounds, faded (and panned) frame by frame; a rush's f is its brightness (lowpass, Hz)

const RATE = 48000;
const mulberry = (seed) => () => ((seed = (seed + 0x6d2b79f5) | 0), (((seed ^ (seed >>> 15)) * (1 | seed)) >>> 0) / 4294967296);

function noise(ctx, seconds, seed, brown = false) {
  const rnd = mulberry(seed), n = Math.round(seconds * RATE), b = ctx.createBuffer(1, n, RATE), d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < n; i++) {
    const w = rnd() * 2 - 1;
    d[i] = brown ? (last = (last + 0.02 * w) / 1.02) * 3.5 : w;
  }
  return b;
}
// A room: two channels of decaying noise, darker as it dies.
function room(ctx, seconds = 2.2, seed = 5) {
  const n = Math.round(seconds * RATE), b = ctx.createBuffer(2, n, RATE);
  for (let c = 0; c < 2; c++) {
    const rnd = mulberry(seed + c), d = b.getChannelData(c);
    let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / RATE, a = Math.min(1, t / 0.012) * Math.exp(-t / 0.42), k = 0.25 + 0.7 * Math.exp(-t / 0.5);
      lp += k * (rnd() * 2 - 1 - lp);
      d[i] = a * lp;
    }
  }
  return b;
}
const panTo = (ctx, node, pan, out) => {
  const p = ctx.createStereoPanner();
  p.pan.value = Math.max(-1, Math.min(1, pan));
  node.connect(p).connect(out);
};

export async function render(score) {
  const n = Math.ceil(score.seconds * RATE), ctx = new OfflineAudioContext(2, n, RATE);
  const master = ctx.createGain(), comp = ctx.createDynamicsCompressor(), bus = ctx.createGain(), verb = ctx.createConvolver(), wet = ctx.createGain();
  master.gain.value = score.master ?? 1;
  comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25; comp.knee.value = 12;
  verb.normalize = true;
  verb.buffer = room(ctx);
  wet.gain.value = 0.32;
  bus.connect(master);
  bus.connect(verb).connect(wet).connect(master);
  master.connect(comp).connect(ctx.destination);

  for (const { t, f, pan, gain } of score.drops ?? []) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 1.7, t + 0.035);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.003);
    g.gain.exponentialRampToValueAtTime(gain * 0.25, t + 0.03);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.09);
    o.connect(g);
    panTo(ctx, g, pan, bus);
    o.start(t); o.stop(t + 0.1);
  }
  for (const { t, f, pan, gain } of score.toks ?? []) {
    const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = 'triangle';
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.86, t + 0.07);
    lp.type = 'lowpass'; lp.frequency.value = f * 2.2;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.002);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.08);
    o.connect(lp).connect(g);
    panTo(ctx, g, pan, bus);
    o.start(t); o.stop(t + 0.09);
  }
  for (const { t, f, pan, gain } of score.bonks ?? []) {
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1400;
    // a body that drops in pitch, and a hollow overtone that dies first
    for (const [mult, a, die] of [[1, 1, 0.24], [2.6, 0.3, 0.07]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.frequency.setValueAtTime(f * mult * 1.25, t);
      o.frequency.exponentialRampToValueAtTime(f * mult, t + 0.03);
      o.frequency.exponentialRampToValueAtTime(f * mult * 0.8, t + die);
      og.gain.setValueAtTime(0, t);
      og.gain.linearRampToValueAtTime(a * gain, t + 0.005);
      og.gain.exponentialRampToValueAtTime(1e-4, t + die);
      o.connect(og).connect(lp);
      o.start(t); o.stop(t + die + 0.02);
    }
    lp.connect(g);
    panTo(ctx, g, pan, bus);
  }
  for (const { t, f, pan, gain } of score.bells ?? []) {
    const g = ctx.createGain();
    for (const [mult, a, die] of [[1, 1, 1.4], [2.76, 0.3, 0.6], [5.4, 0.1, 0.3]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.frequency.value = f * mult;
      og.gain.setValueAtTime(0, t);
      og.gain.linearRampToValueAtTime(a * gain, t + 0.006);
      og.gain.exponentialRampToValueAtTime(1e-4, t + die);
      o.connect(og).connect(g);
      o.start(t); o.stop(t + die + 0.05);
    }
    panTo(ctx, g, pan, bus);
  }
  const burst = noise(ctx, 0.05, 99);
  for (const { t, gain } of score.clicks ?? []) {
    const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = burst;
    bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 1.2;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.025);
    s.connect(bp).connect(g).connect(bus);
    s.start(t);
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(70, t + 0.06);
    og.gain.setValueAtTime(gain * 0.7, t);
    og.gain.exponentialRampToValueAtTime(1e-4, t + 0.08);
    o.connect(og).connect(bus);
    o.start(t); o.stop(t + 0.1);
  }
  for (const bed of score.beds ?? []) {
    const g = ctx.createGain(), dt = 1 / bed.fps, out = ctx.createStereoPanner();
    g.gain.setValueAtTime(bed.gain[0] ?? 0, 0);
    bed.gain.forEach((v, k) => g.gain.linearRampToValueAtTime(v, (k + 1) * dt));
    out.pan.setValueAtTime(bed.pan?.[0] ?? 0, 0);
    bed.pan?.forEach((v, k) => out.pan.linearRampToValueAtTime(Math.max(-1, Math.min(1, v)), (k + 1) * dt));
    out.connect(bus);
    if (bed.kind === 'rush') {
      // a soft, warm rush, like air through a vent
      const s = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), hp = ctx.createBiquadFilter();
      s.buffer = noise(ctx, 6, 7, true);
      s.loop = true;
      lp.type = 'lowpass'; lp.frequency.value = bed.f ?? 520;
      hp.type = 'highpass'; hp.frequency.value = 70;
      s.connect(hp).connect(lp).connect(g);
      if (bed.pan) g.connect(out); else g.connect(master);
      s.start(0);
    } else if (bed.kind === 'bell') {
      // a soft, wavering glass tone, its partials out of tune with each other
      const lfo = ctx.createOscillator(), depth = ctx.createGain(), trem = ctx.createGain();
      lfo.frequency.value = 4.2; depth.gain.value = 0.35; trem.gain.value = 0.65;
      lfo.connect(depth).connect(trem.gain);
      for (const [mult, a, det] of [[1, 1, 0], [2.76, 0.35, 1.5], [5.4, 0.12, -2]]) {
        const o = ctx.createOscillator(), og = ctx.createGain();
        o.frequency.value = (bed.f ?? 392) * mult + det;
        og.gain.value = a;
        o.connect(og).connect(trem);
        o.start(0);
      }
      lfo.start(0);
      trem.connect(g).connect(out);
    }
  }
  const out = await ctx.startRendering();
  return wavBase64(out);
}

function wavBase64(buf) {
  const ch = [buf.getChannelData(0), buf.getChannelData(1)], n = buf.length, bytes = new Uint8Array(44 + n * 4), v = new DataView(bytes.buffer);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) v.setInt16(44 + 4 * i + 2 * c, Math.max(-1, Math.min(1, ch[c][i])) * 32767, true);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
