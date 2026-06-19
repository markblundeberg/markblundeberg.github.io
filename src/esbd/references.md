---
layout: layouts/esbd_topic.njk
title: 'Reference electrodes & cells'
tags: [page, esbd_topic]
orderESBD: 33
---

# {{title}}

A single electrode's potential can never be measured on its own; you always need a second electrode to close the circuit. That second electrode is the **reference**, and the pair of them is a **cell**. This topic is about the reference electrode, the full cell, the junction that usually sits between the two half-cells, and finally the tempting idea of referencing everything to the vacuum.

## Reference electrodes

Two electrodes do most of the reference work in practice.

The **silver/silver chloride electrode** couples chloride to electrons, as we saw back in the [equilibrium topic](../equilibrium/):
$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} = \frac{1}{F}(\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}}). $$
{% include "esbd-diagrams/esbd-ag-agcl-electrode.html" %}

The **hydrogen electrode** interconverts hydrogen ions and hydrogen gas, $\mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H_2}$, giving
$$ V_{\mathrm{e}^-} = V_{\mathrm{H}^+} - \frac{\mu_{\mathrm{H_2}}}{2F}, $$
with $\mu_{\mathrm{H_2}} = \mu^\circ_{\mathrm{H_2}} + \tfrac{RT}{F}\ln a_{\mathrm{H_2}}$ depending on the gas pressure. Its standard form is the reference the whole $E$ scale is built on.
{% include "esbd-diagrams/esbd-she.html" %}

## A reference cell

Now stick the two together: a hydrogen electrode on the left, a silver chloride electrode on the right, both dipping into the same dissolved $\mathrm{HCl}$. The left electrode couples $V_{\mathrm{e}^-}(\text{left})$ to $V_{\mathrm{H}^+}$, the right couples $V_{\mathrm{Cl}^-}$ to $V_{\mathrm{e}^-}(\text{right})$, and the middle is bridged by the solution's fixed ladder gap $V^\circ_{\mathrm{Cl}^-} - V^\circ_{\mathrm{H}^+} = 1.3601~\mathrm{V}$ (from the [solutions topic](../solutions/)).
{% include "esbd-diagrams/esbd-she-agcl.html" %}

Walking $V_{\mathrm{e}^-}$ across, the measured cell voltage comes out as
$$ V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) = E^\circ_{\mathrm{cell}} + \frac{RT}{F}\ln\!\bigg(\frac{\sqrt{a_{\mathrm{H_2}}}}{a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}}\bigg), $$
with
$$ E^\circ_{\mathrm{cell}} = \frac{\mu^\circ_{\mathrm{H_2}}}{2F} + (V^\circ_{\mathrm{Cl}^-} - V^\circ_{\mathrm{H}^+}) - \frac{1}{F}(\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}}) = 0.222~\mathrm{V}, $$
the familiar standard potential of the silver chloride electrode against the SHE.

> The single-ion activities $a_{\mathrm{H}^+}$ and $a_{\mathrm{Cl}^-}$ are individually ambiguous (just like the placement of the $V^\circ_i$ ladder), but the ambiguity cancels in the charge-neutral product $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, so the measured voltage is unambiguous, as it must be.

## Two ways to read a cell

That derivation took a peculiar route, and it is worth seeing why. We walked the chain
$$ V_{\mathrm{e}^-}(\text{left}) \to V_{\mathrm{H}^+} \to V^\circ_{\mathrm{H}^+} \to V^\circ_{\mathrm{Cl}^-} \to V_{\mathrm{Cl}^-} \to V_{\mathrm{e}^-}(\text{right}), $$
stepping from one real species voltage to the next. Call this the **circuit-centered** reading: track the actual $V_i$ straight across, dipping into single-ion activities only for the middle ladder step (which is ultimately thermodynamic anyway).

Traditional electrochemistry takes the other route, which is **solution-centered** (really *potential*-centered). It starts in the middle, at the solution's $\phi$ — a stand-in for the $V^\circ_i$ ladder — and works outward to each electrode:
$$
\begin{aligned}
\phi(\text{soln}) &\to V^\circ_{\mathrm{H}^+} \to V_{\mathrm{H}^+} \to V_{\mathrm{e}^-}(\text{left}), \\
\phi(\text{soln}) &\to V^\circ_{\mathrm{Cl}^-} \to V_{\mathrm{Cl}^-} \to V_{\mathrm{e}^-}(\text{right}).
\end{aligned}
$$
The cell voltage is the difference of the two, and $\phi$ cancels. Its appeal is that each electrode is described against a common reference; its cost is that each half now leans on a single-ion activity, and on the unmeasurable $\phi$. The $V_i$ picture keeps the same split into two electrodes but anchors it to the real, ladder-based $V^\circ_i$ rather than to $\phi$.

This is the distinction Boettcher et al. draw between the **electrode potential** (the electrode's own electronic level, our $V_{\mathrm{e}^-}(\text{electrode})$) and the **solution potential** (the solution's level, our $V^\circ_{\mathrm{e}^-}$): two different "potentials" that the bare word runs together.

## The liquid junction potential

Real reference electrodes are usually kept in their own clean compartment and wired to the test solution through a porous frit or salt bridge — which means a junction, and a junction means a step. For a cell whose two half-cells are different solutions, the measured voltage splits as
$$
\begin{aligned}
\Delta V &= V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) \\
&= E(\text{right}) - E(\text{left}) + \mathrm{LJP},
\end{aligned}
$$
where the **liquid junction potential** is the step in the reference level across the junction, $\mathrm{LJP} = V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{right}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{left})$.^[Expanding both $E$'s with the Nernst equation gives the full-cell form with the LJP carried along explicitly; the textbook version usually drops the LJP and the left/right labelling. In a concentrated cell only $\Delta V$ is unambiguous: the LJP and the activity terms are each individually ambiguous, because the two half-cells carry distinct activity ambiguities.] The point worth dwelling on is that whenever the $V^\circ_{\mathrm{e}^-}$ levels vary in space — across a junction, a Donnan membrane, or under load — "the SHE" itself varies from place to place. There is a reason a perfectly defined reference is a fiction.

Two readings of this $\Delta V$ coexist happily: an engineer sees the electrodes' $V_{\mathrm{e}^-}$ as reservoirs and the reaction as a generic {% wiki "electromotive force" %} pump; a chemist sees a reversible free-energy change, $\Delta G = -zF\,\Delta V$, per electron passed.

## What a "standard electrode" really is

The chains above show what the standard reference levels are: a "standard electrode" is the hypothetical electrode that would sit at a given reaction's standard level $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ — the floating standard-redox levels we tabulated in the [half-reactions topic](../half/). Setting the reactant activities to one in our two electrodes gives
$$
\begin{aligned}
V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) &= V^\circ_{\mathrm{H}^+} - \frac{\mu^\circ_{\mathrm{H_2}}}{2F}, \\
V^\circ_{\mathrm{e}^-}(\mathrm{SSCE}) &= V^\circ_{\mathrm{Cl}^-} + \frac{1}{F}(\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}}),
\end{aligned}
$$
and their difference is again the $0.222~\mathrm{V}$ from above. Re-drawn with only the electronic levels, the cell is just two $V_{\mathrm{e}^-}$ values sitting against two standard levels:
{% include "esbd-diagrams/esbd-she-agcl-e.html" %}
Anchoring $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ to "0 V" recovers the usual reference frame of electrochemistry — an arbitrary choice that stops making sense the moment $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ varies in space.

In practice the SHE is finicky to pin down: its nominal $a_{\mathrm{H}^+}=1$ implies an awkward pH of 0, its "1 bar" of $\mathrm{H_2}$ competes with water vapour, and like every standard level it must be reached by extrapolation from dilute cells (the junction-free Harned cell being the classic).^[TODO: Harned & Bates citations.] Any "$V_{\mathrm{e}^-}(\mathrm{SHE})$" is, in the end, a theoretical extrapolated level tied to the standard state of the aqueous proton, $V^\circ_{\mathrm{H}^+}$.

## The "absolute" electrode potential

Could we sidestep all this by referencing to the vacuum instead — an "absolute" electrode potential? On a $V_i$ diagram the vacuum is just one more level, $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$, sitting a work function $\Phi$ above the metal's electrons (the step we drew for [capacitors](../capacitors/)). The widely-quoted "absolute" value of about $4.44~\mathrm{V}$ for the SHE^[From Farrell & McTigue's measurements as interpreted by Trasatti; the procedure quietly splits a mean activity coefficient evenly between the ions to locate "the SHE." See also Hees & Zhang, [doi:10.1021/acs.jpclett.4c02923](https://doi.org/10.1021/acs.jpclett.4c02923), on the link to an "ionic work function."] is really a *surface* property of this kind, not a cleaner fundamental reference: like any work function it drifts with surface preparation and contamination, and the deeper trouble is that the in-material $\phi$ it leans on is not well defined to begin with (the subject of the [appendix on $\phi$](../phi/)). The vacuum offers no escape — it is one more floating level, handy for lining up work functions, not a universal zero.

## Takeaways

A reference electrode is a device for pinning one $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ level so a working electrode's $V_{\mathrm{e}^-}$ can be read against it; a cell is two such electrodes; and a junction between them adds a liquid-junction step. The whole zoo of "potentials" — electrode potential, solution potential, cell voltage, liquid junction potential, the absolute reference — are particular gaps among the $V_{\mathrm{e}^-}$ and $V^\circ_{\mathrm{e}^-}$ levels, and the $V_i$ diagram simply shows them as the separate lines they always were.

[**NEXT TOPIC: Redox-flow batteries**](../redoxflow/)
