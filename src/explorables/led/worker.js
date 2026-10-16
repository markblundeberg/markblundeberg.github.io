// The page's LEDs, solved off the page's thread. On the first message it measures each LED's
// current at every voltage and where every 100 electrons go in two diodes; then, for a battery
// voltage, it finds where each LED runs, and solves the one the inside picture shows (with its
// walls or without) exactly there.

import { LED, LEDS, CHIP, curve, operate, fates, profile } from './model.js';

const leds = {}, curves = {};
const get = (key, walls) => {
  const id = `${key}${walls ? '' : '-plain'}`;
  if (!leds[id]) {
    leds[id] = new LED({ kind: walls ? 'walled' : 'plain', dEg: LEDS.find((l) => l.key === key).dEg });
    curves[id] = curve(leds[id]);
  }
  return { led: leds[id], c: curves[id] };
};
let ledger;
onmessage = ({ data: { id, VB, pick, walls } }) => {
  // where every 100 electrons go, at 20 mA: a walled GaAs LED, and a plain GaAs junction
  ledger ??= [
    { name: 'GaAs, walled', f: fates(new LED({ kind: 'walled' }).drive(20 / (CHIP * 1e3)).S) },
    { name: 'GaAs, plain', f: fates(new LED({ kind: 'plain' }).drive(20 / (CHIP * 1e3)).S) },
  ];
  const out = LEDS.map((l) => {
    const { led, c } = get(l.key, true), V = operate(c, VB), S = led.at(V).S;
    return { key: l.key, V, ...fates(S) };
  });
  const { led, c } = get(pick, walls), V = operate(c, VB), S = led.at(V).S;
  postMessage({ id, VB, leds: out, curves: LEDS.map((l) => get(l.key, true).c), inside: { key: pick, walls, V, ...fates(S), profile: profile(S) }, ledger });
};
