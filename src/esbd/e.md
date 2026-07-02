---
layout: layouts/esbd_topic.njk
title: 'Electrode potential'
tags: [page, esbd_topic]
orderESBD: 32
---

# {{title}}

We can now visualize the electrode potential $E$ on a $V_i$ diagram, along with its relatives — the 'redox potential' $E_h$, the 'equilibrium potential' $E_{\mathrm{eq}}$, and so on. They all share the form $E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\text{ref})$, and every subtlety comes down to *which* $V_{\mathrm{e}^-}$ and *which* reference we have in mind. We take the simple case first and add the complications afterward.

## Electrode potential at equilibrium

At equilibrium, with no current flowing, an electrode and its solution settle into a tidy stack of levels. The electrode reaction equalizes the metal's electrons with the solution's redox couple, so the metal level and the reaction's implied level coincide,

$$ V_{\mathrm{e}^-}(\text{electrode}) = V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}), $$

and the electrode potential is just the gap from that level down to the hydrogen reference level $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$:

$$ E = V_{\mathrm{e}^-}(\text{electrode}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE}). $$

On the diagram this is a story of four levels — the metal's $V_{\mathrm{e}^-}$ and the reaction's $V_{\mathrm{e}^-}$ (sitting one on top of the other), the reaction's standard level $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$, and the reference $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ — and $E$ is just one marked vertical distance among them.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/levels-e-fourlevel.njk" %}
{% figcaption %}
Electrode potential at equilibrium, as four levels. The metal's $V_{\mathrm{e}^-}$ and the reaction's $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ coincide; below sit the reaction's standard level $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ and the reference $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$. The electrode potential $E$ is the gap from the metal's level down to the SHE level; the reaction's own gap is the equilibrium potential $E_{\mathrm{eq}}$. At equilibrium the two coincide — they part company when current flows (below).
{% endfigcaption %}
</figure>

What that reference level actually is, and how a real reference electrode pins it, we leave to the [next topic](../references/); here we just take $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ as a level on the page.^[The IUPAC definition is in this equilibrium spirit: electrode potential is the electromotive force of a cell with the standard hydrogen electrode on the left and the electrode in question on the right, the EMF being the cell voltage at zero current. That zero-current proviso is exactly what keeps the definition tidy; everything below is what happens when we let go of it.]

## The Nernst equation

Set the redundant metal level aside and three remain: the reaction's actual level $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$, its standard level $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$, and the reference $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$. The Nernst equation is just the statement that the first sits above the second by a concentration term,

$$ E = E^\circ + \frac{RT}{zF}\ln\!\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}, $$

and the three quantities in it are the three gaps among those levels:

$$
\begin{aligned}
E &= V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE}), \\
E^\circ &= V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE}), \\
\tfrac{RT}{zF}\ln\tfrac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}} &= V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}).
\end{aligned}
$$

The equation holds locally: every level is read off at the same spot in the solution.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/levels-e-nernst.njk" %}
{% figcaption %}
The Nernst equation as a three-level partition. $E$ is the gap from the reaction level to the reference; $E^\circ$ is the gap from the reaction's standard level to the reference; and the activity term is the gap between the reaction level and its own standard level. A slider on the $\mathrm{Ox}/\mathrm{Red}$ activities slides the top level.
{% endfigcaption %}
</figure>

## Cracking open the subtleties

Everything so far assumed equilibrium and a single clean reference. Lift those and the complications appear, and each one is a question of *which* $V_{\mathrm{e}^-}$, or *where* the reference is.

**Surface overpotential.** Drive a current and the metal level peels away from the reaction level it was pinned to. That gap is the overpotential, in $V_i$ terms just a drop in $V_{\mathrm{e}^-}$ across the interface,

$$ \eta = E - E_{\mathrm{eq}} = V_{\mathrm{e}^-}(\text{electrode}) - V_{\mathrm{e}^-}(\mathrm{eq}). $$

Even this has slippery edges, and the diagram helps by making them concrete: $V_{\mathrm{e}^-}(\mathrm{eq})$ depends on which half-reaction we say is running (for copper deposition, the one-electron $\mathrm{Cu}^+$ step or the overall two-electron one?) and which activities we assign it (a gas-evolving reaction may be wildly supersaturated).^[Seidenberg, J. R., Mitsos, A., & Bongartz, D. (2025). [Interpreting Concentration and Activation Overpotentials in Electrochemical Systems: A Critical Discussion.](https://doi.org/10.1149/1945-7111/adc76c) J. Electrochem. Soc. 172(4), 043506.]

**A spatially varying $E_{\mathrm{eq}}$.** The Nernst equation still gives the reaction's equilibrium level, but under load that level is no longer a single number: it varies through the solution, both because concentrations vary (concentration polarization) and because $V^\circ$ itself slopes (the ohmic drop). $E_{\mathrm{eq}}$ has become a field.

**Where is the reference?** The deeper gotcha is then not *what* the reference is but *where*. An actual reference electrode reports whatever $V^\circ$ sits between it and the working electrode, ohmic drop and all, so the reading depends on its position. The usual escape is to flatten the bulk — subtract the $iR$ drop, reach in with a Luggin capillary, or swamp the cell with supporting electrolyte — so the reference samples a position-independent bulk. That works in a roomy, stirred analytical cell; it fails in a battery polarized wall to wall, where there is no flat bulk at all and "the electrode potential" quietly loses its referent. This is exactly where reading $V_{\mathrm{e}^-}(x)$ and $V^\circ(x)$ off the diagram beats clinging to a single number $E$.^[This whole knot is the subject of Boettcher, S. W., et al. (2021). [Potentially Confusing: Potentials in Electrochemistry.](https://doi.org/10.1021/acsenergylett.0c02443) ACS Energy Letters, 6(1), 261–266. The $V_i$ diagram is, in effect, their clarification drawn out.]

**Mixed potentials.** Finally, a real electrode may couple to several half-reactions at once, each with its own $E_{\mathrm{eq}}$; the electrode settles at a compromise mixed potential that matches none of them — one $V_{\mathrm{e}^-}$ line sitting among several dashed reaction levels.

## Takeaways

At equilibrium the electrode potential is a clean four-level picture, and $E$, $E^\circ$, and the Nernst activity term are simply the vertical gaps among those levels. The famous confusions all arrive together once we leave equilibrium: the metal level splits from the reaction level (overpotential), the reaction level spreads out in space, and the reference stops having a single home. The $V_i$ diagram keeps every one of these as a line you can point at — and the realities of the reference electrode and the full cell come next.

[**NEXT TOPIC: Reference electrodes & cells**](../references/)
