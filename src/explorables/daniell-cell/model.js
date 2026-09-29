// Daniell cell model: Zn | ZnSO4 || KCl bridge || CuSO4 | Cu
// Ideal dilute solutions, Henderson (linear-mixing) liquid junctions,
// stirred bulk + Nernst diffusion layers, symmetric Butler–Volmer kinetics.
// Gauge: chemists' convention (ΔGf of elements and H+(aq) = 0), ground = Zn metal.
const MODEL = (() => {
  const F = 96485.33, R = 8.314462, T = 298.15, f = R * T / F; // f = RT/F ≈ 25.69 mV
  const K = F * F / (R * T); // conductivity prefactor: κ = K Σ z² D c
  // standard levels V°_i = ΔGf°/(z F), volts; D in m²/s (infinite dilution)
  const SP = {
    Zn: { z: 2, V0: -147.06e3 / (2 * F), D: 0.703e-9 },
    Cu: { z: 2, V0: 65.49e3 / (2 * F), D: 0.714e-9 },
    SO4: { z: -2, V0: -744.53e3 / (-2 * F), D: 1.065e-9 },
    K: { z: 1, V0: -283.27e3 / F, D: 1.957e-9 },
    Cl: { z: -1, V0: -131.23e3 / (-F), D: 2.032e-9 },
  };
  const P = {
    A: 1e-4,        // electrode + compartment cross-section, m² (1 cm²)
    Lbulk: 0.005,   // each half-cell bulk path, m
    Ab: 1e-4,       // bridge cross-section, m² (1 cm²)
    Lb: 0.02,       // bridge length, m
    Lj: 0.001,      // each bridge junction mixing zone, m
    Lpot: 0.003,    // porous-pot wall thickness (the whole mixing zone), m
    Apot: 0.3e-4,   // effective open area of the porous wall, m² (30 % porosity)
    cB: 1.0,        // bridge KCl, mol/L
    delta: 50e-6,   // diffusion-layer thickness, m
    i0Zn: 2.0,      // exchange current densities, A/m²
    i0Cu: 1.0,
  };
  // schematic x layout (0..1)
  const X = { m1: 0.07, d1: 0.13, b1: 0.33, j1: 0.39, br: 0.61, j2: 0.67, b2: 0.87, d2: 0.93 };
  const kappa = (cs) => { let s = 0; for (const k in cs) s += SP[k].z ** 2 * SP[k].D * cs[k] * 1000; return K * s; };
  const saltD = (a, b) => { const z = SP[a].z; return 2 * SP[a].D * SP[b].D / (SP[a].D + SP[b].D); };
  const tplus = (a, b) => SP[a].D / (SP[a].D + SP[b].D);
  const ilim = (ion, c) => 2 * F * saltD(ion, 'SO4') * c * 1000 / ((1 - tplus(ion, 'SO4')) * P.delta);
  const Vi = (k, c, psi) => SP[k].V0 + (f / SP[k].z) * Math.log(c) + psi;

  // Walk the cell left→right for a given current I (A). Returns profiles + summary.
  function profile(cZn, cCu, I, withProfiles = true, sep = 'bridge') {
    const i = I / P.A;
    const etaA = f * Math.asinh(i / (2 * P.i0Zn));
    const etaC = f * Math.asinh(i / (2 * P.i0Cu));
    const ilA = ilim('Zn', cZn), ilC = ilim('Cu', cCu);
    const csA = cZn * (1 + i / ilA), csC = cCu * (1 - i / ilC);
    const pts = []; // {x, psi, c:{...}}
    const push = (x, psi, c) => { if (withProfiles) pts.push({ x, psi, c: { ...c } }); };
    // Zn surface: V_e(Zn) = 0 = V_Zn(s) + etaA  (oxidation needs metal V_e above the couple)
    const VZn_s = -etaA;
    const psi_s1 = VZn_s - SP.Zn.V0 - (f / 2) * Math.log(csA);
    const VSO4_L = Vi('SO4', csA, psi_s1); // flat across the anode diffusion layer (no anion flux)
    const N = 24;
    let psi;
    for (let n = 0; n <= N; n++) {
      const s = n / N, c = csA + (cZn - csA) * s;
      psi = VSO4_L - SP.SO4.V0 + (f / 2) * Math.log(c);
      push(X.m1 + (X.d1 - X.m1) * s, psi, { Zn: c, SO4: c });
    }
    const dlA = psi - psi_s1;
    // left bulk: ohmic
    const RbL = P.Lbulk / (kappa({ Zn: cZn, SO4: cZn }) * P.A);
    const psiB1 = psi;
    for (let n = 1; n <= 8; n++) { const s = n / 8; psi = psiB1 - I * RbL * s; push(X.d1 + (X.b1 - X.d1) * s, psi, { Zn: cZn, SO4: cZn }); }
    // junction integrator (linear mixing between two compositions), includes ohmic term
    function junction(cL, cR, x0, x1, L = P.Lj, A = P.Ab) {
      let psiJ = psi, ljp = 0, ohm = 0;
      const mix = (s) => { const o = {}; for (const k of new Set([...Object.keys(cL), ...Object.keys(cR)])) o[k] = (cL[k] || 0) * (1 - s) + (cR[k] || 0) * s; return o; };
      // grid clustered at both ends so vanishing species show their log dive
      const G = [0, 1e-6, 1e-5, 1e-4];
      const M = 90; for (let n = 1; n < M; n++) G.push(0.5 * (1 - Math.cos(Math.PI * n / M)));
      G.push(1 - 1e-4, 1 - 1e-5, 1 - 1e-6, 1);
      G.sort((a, b) => a - b);
      for (let n = 0; n < G.length - 1; n++) {
        const s0 = G[n], s1 = G[n + 1], ds = s1 - s0, c = mix((s0 + s1) / 2);
        if (ds <= 0) continue;
        let num = 0, den = 0;
        for (const k in c) { const dc = ((cR[k] || 0) - (cL[k] || 0)) * ds; num += SP[k].z * SP[k].D * dc; den += SP[k].z ** 2 * SP[k].D * c[k]; }
        const dDiff = -f * num / den, dOhm = -I * (L * ds) / (kappa(c) * A);
        psiJ += dDiff + dOhm; ljp += dDiff; ohm += dOhm;
        push(x0 + (x1 - x0) * s1, psiJ, mix(s1));
      }
      psi = psiJ; return { ljp, ohm };
    }
    let J1, J2 = { ljp: 0, ohm: 0 }, Rbr = 0;
    if (sep === 'bridge') {
      const bridge = { K: P.cB, Cl: P.cB };
      J1 = junction({ Zn: cZn, SO4: cZn }, bridge, X.b1, X.j1);
      Rbr = P.Lb / (kappa(bridge) * P.Ab);
      const psiBr = psi;
      for (let n = 1; n <= 8; n++) { const s = n / 8; psi = psiBr - I * Rbr * s; push(X.j1 + (X.br - X.j1) * s, psi, bridge); }
      J2 = junction(bridge, { Cu: cCu, SO4: cCu }, X.br, X.j2);
    } else {
      J1 = junction({ Zn: cZn, SO4: cZn }, { Cu: cCu, SO4: cCu }, X.b1, X.j2, P.Lpot, P.Apot);
    }
    const RbR = P.Lbulk / (kappa({ Cu: cCu, SO4: cCu }) * P.A);
    const psiB2 = psi;
    for (let n = 1; n <= 8; n++) { const s = n / 8; psi = psiB2 - I * RbR * s; push(X.j2 + (X.b2 - X.j2) * s, psi, { Cu: cCu, SO4: cCu }); }
    // cathode diffusion layer: sulfate flat again
    const VSO4_R = Vi('SO4', cCu, psi);
    const psiD2 = psi;
    for (let n = 1; n <= N; n++) {
      const s = n / N, c = cCu + (csC - cCu) * s;
      psi = VSO4_R - SP.SO4.V0 + (f / 2) * Math.log(c);
      push(X.b2 + (X.d2 - X.b2) * s, psi, { Cu: c, SO4: c });
    }
    const dlC = psi - psiD2;
    const VCu_s = Vi('Cu', csC, psi);
    const VeCu = VCu_s - etaC;
    const ohmic = I * (RbL + Rbr + RbR) - (J1.ohm + J2.ohm);
    const Rjun = -(J1.ohm + J2.ohm) / (I || 1);
    return {
      pts, V: VeCu, etaA, etaC, csA, csC, ilA, ilC, dlA, dlC,
      ljp: J1.ljp + J2.ljp, ljp1: J1.ljp, ljp2: J2.ljp, ohmic, Rint: RbL + Rbr + RbR,
      psiSurfA: psi_s1, psiSurfC: psi, VZn_s, VCu_s,
    };
  }
  const nernst = (cZn, cCu) => SP.Cu.V0 - SP.Zn.V0 + (f / 2) * Math.log(cCu / cZn);
  // Solve for current through a load resistance Rl (Infinity = open circuit)
  function solve(cZn, cCu, Rl, sep = 'bridge') {
    let I = 0;
    if (isFinite(Rl)) {
      const Imax = 0.9999 * ilim('Cu', cCu) * P.A;
      let lo = 0, hi = Imax;
      for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; const g = profile(cZn, cCu, mid, false, sep).V - mid * Rl; if (g > 0) lo = mid; else hi = mid; }
      I = lo;
    }
    const r = profile(cZn, cCu, I, true, sep);
    r.I = I; r.Rl = Rl; r.sep = sep; r.cZn = cZn; r.cCu = cCu; r.E = nernst(cZn, cCu); r.ilimCu = ilim('Cu', cCu) * P.A;
    return r;
  }
  return { SP, P, X, f, solve, nernst, Vi };
})();
if (typeof module !== 'undefined') module.exports = MODEL;
