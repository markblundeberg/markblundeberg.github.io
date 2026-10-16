// The page's LEDs, solved off the page's thread. On the first message it measures each LED's
// current at every voltage; then, for a battery voltage, it finds where each LED runs, and solves
// the one the inside picture shows exactly there.

import { LED, LEDS, curve, operate, fates, profile } from './model.js';

const leds = {}, curves = {};
const get = (key) => {
  if (!leds[key]) {
    leds[key] = new LED({ kind: 'walled', dEg: LEDS.find((l) => l.key === key).dEg });
    curves[key] = curve(leds[key]);
  }
  return { led: leds[key], c: curves[key] };
};
onmessage = ({ data: { id, VB, pick } }) => {
  const out = LEDS.map((l) => {
    const { led, c } = get(l.key), V = operate(c, VB);
    return { key: l.key, V, ...fates(led.at(V).S) };
  });
  // the inside: its own copy, so the three above stay where they are
  const { c } = get(pick), V = operate(c, VB);
  inside[pick] ??= new LED({ kind: 'walled', dEg: LEDS.find((l) => l.key === pick).dEg });
  const S = inside[pick].at(V).S;
  postMessage({ id, VB, leds: out, curves: LEDS.map((l) => get(l.key).c), inside: { key: pick, walls: true, V, ...fates(S), profile: profile(S) } });
};
const inside = {};
