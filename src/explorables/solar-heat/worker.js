// The page's two panels, solved off the page's thread: given the temperatures, the sun and whether
// both are held at the first one's best voltage, it measures each panel (its curve and best point)
// and its state where it runs, and posts back plain numbers for the pictures.

import { Panel, levels } from './model.js';

const panels = [];
onmessage = ({ data: { id, T, sun, same } }) => {
  T.forEach((t, i) => {
    if (!panels[i]) panels[i] = new Panel(t, sun);
    else if (panels[i].T !== t || panels[i].sun !== sun) panels[i].set(t, sun);
  });
  const V = [panels[0].Vmp, same ? panels[0].Vmp : panels[1].Vmp];
  postMessage({
    id,
    panels: panels.map((p, i) => {
      const op = p.operate(V[i]);
      return {
        T: p.T,
        panel: { Jsc: p.Jsc, Voc: p.Voc, Vmp: p.Vmp, Pmax: p.Pmax, curve: p.curve, short: p.short },
        op: { V: op.V, J: op.J, P: op.P, leak: op.leak, fates: op.fates, hill: op.hill, levels: levels(op.S) },
      };
    }),
  });
};
