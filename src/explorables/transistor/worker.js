// The page's transistor, solved off the page's thread: on the first message the channel at every gate
// voltage; then, for a gate voltage, the slice exactly there.

import { Gate, ZERO_CHARGE, sweep, profile, climb } from './model.js';

let sw, gate;
onmessage = ({ data: { id, V } }) => {
  sw ??= sweep(ZERO_CHARGE);
  gate ??= new Gate(ZERO_CHARGE);
  const r = gate.at(V);
  postMessage({ id, sweep: sw, here: { V, n: r.n, climb: climb(r.S), profile: profile(r.S) } });
};
