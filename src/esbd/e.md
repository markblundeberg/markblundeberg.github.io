---
layout: layouts/esbd_topic.njk
title: 'Electrode potential'
tags: [page, esbd_topic]
orderESBD: 32
---

# {{title}}

We can now visualize the electrode potential $E$ on a $V_i$ diagram, along with its relatives — the 'redox potential' $E_h$, the 'equilibrium potential' $E_{\mathrm{eq}}$, and so on. They all share the form $E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\text{ref})$, and every subtlety comes down to *which* $V_{\mathrm{e}^-}$ and *which* reference we have in mind.

## Two levels at one electrode

Dip a single electrode into a solution and there are already two electronic levels in play, and the whole art of reading electrode potentials is keeping them apart:

* the metal's own $V_{\mathrm{e}^-}(\text{electrode})$, the Fermi level of the wire, the level a voltmeter actually reaches;
* the solution's implied redox level $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ from the [last topic](../half/), where the solution "wants" its electrons to sit.

At equilibrium, with no current flowing, the electrode reaction equalizes the two. Pass a current and they pull apart. "Electrode potential" is then just the metal's level read against some agreed reference level. The reason potentials in electrochemistry are notoriously confusing^[This topic is largely a $V_i$ retelling of the fine survey by Boettcher, S. W., Oener, S. Z., Lonergan, M. C., Surendranath, Y., Ardo, S., Brozek, C., & Kempler, P. A. (2021). [Potentially Confusing: Potentials in Electrochemistry.](https://doi.org/10.1021/acsenergylett.0c02443) ACS Energy Letters, 6(1), 261–266.] is that the single word "potential" gets stretched across all three things at once: the metal's level, the solution's level, and the reference. On a $V_i$ diagram we simply draw them as separate lines, and the confusion lifts.

<figure class="diagram-placeholder">
{% figcaption %}
One electrode in a solution. The metal's $V_{\mathrm{e}^-}(\text{electrode})$ (solid) and the solution's implied $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ (dashed) are distinct levels; the electrode potential $E$ is the metal's level measured down to a reference level. At equilibrium the two solution/metal levels coincide.
{% endfigcaption %}
</figure>

## Electrode potential, referenced

The standard definition, as I read the IUPAC one,^[IUPAC Gold Book, ["electrode potential"](https://goldbook.iupac.org/terms/view/E01956).] references the metal's level to the standard hydrogen electrode:

$$ E(\text{vs SHE}) = V_{\mathrm{e}^-}(\text{electrode}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}). $$

A reference, in this conceptual sense, is just a device that pins a known $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ level so the metal's $V_{\mathrm{e}^-}$ can be read against it. The actual hardware — silver chloride, the hydrogen electrode — and the realities of wiring it into a full cell are the [next topic](../references/); here we treat the reference as an agreed zero-level. Working with $V_{\mathrm{e}^-}$ directly is like working with $E$, but without having to carry a reference around.

Two things keep $E$ from being as clean as it looks, even at equilibrium. The standard reference levels inherit the single-ion-activity ambiguity of concentrated solutions, so $E$ is only sharply defined in the dilute limit (see the [nonideality topic](../nonideal/)); and any real reference must be wired in through a junction, which adds a liquid-junction potential we take up [next topic](../references/). For precision work these are real problems; for everyday electrochemistry they are usually small.

## The (half-cell) Nernst equation

When the electrode equilibrates against a single half-reaction $\mathrm{Ox}/\mathrm{Red}$, its $V_{\mathrm{e}^-}$ sits at that reaction's implied level, and the floating Nernst equation from the [last topic](../half/) turns into the familiar one:

$$ E = E^\circ + \frac{RT}{zF}\ln\!\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}, $$

where, read in $V_i$ terms,

$$
\begin{aligned}
E &= V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}), \\
E^\circ &= V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}).
\end{aligned}
$$

So $E$ and $E^\circ$ are just the reaction's level — actual and standard — measured down to the hydrogen reference. The equation holds locally: every term is evaluated at the same spot in the solution.

## Out of equilibrium: working potential and overpotential

Drive a current and the equilibrium picture breaks in a specific, visible way: the metal's $V_{\mathrm{e}^-}(\text{electrode})$ separates from the level $V_{\mathrm{e}^-}(\mathrm{eq})$ that the local reactants would equilibrate to. That gap is the **overpotential**, and in $V_i$ terms it is simply a drop in $V_{\mathrm{e}^-}$ across the interface:

$$ \eta = E - E_{\mathrm{eq}} = V_{\mathrm{e}^-}(\text{electrode}) - V_{\mathrm{e}^-}(\mathrm{eq}). $$

The partitioning of that drop is famously slippery, and the diagram helps by making it concrete rather than verbal.^[Seidenberg, J. R., Mitsos, A., & Bongartz, D. (2025). [Interpreting Concentration and Activation Overpotentials in Electrochemical Systems: A Critical Discussion.](https://doi.org/10.1149/1945-7111/adc76c) Journal of The Electrochemical Society, 172(4), 043506.] The "surface overpotential" is the sudden step right at the interface (from $V_{\mathrm{e}^-}(\text{electrode})$ to the reaction's $V_{\mathrm{e}^-}(\mathrm{eq})$),^[Newman & Balsara (2005), *Electrochemical Systems*, ch. 8 "Electrode Kinetics".] but even $V_{\mathrm{e}^-}(\mathrm{eq})$ is open to interpretation: which half-reaction we say is running (for copper deposition, the one-electron $\mathrm{Cu}^+$ step or the overall two-electron one?), and which activities we assign it (a gas-evolving reaction may be wildly supersaturated). Rather than argue over which $E$ and which reference, we point at the levels and read the gaps.

A real electrode often couples to several half-reactions at once, each with its own $E_{\mathrm{eq}}$. The electrode then settles at a compromise **mixed potential** that matches none of them — straightforward to draw as one $V_{\mathrm{e}^-}$ line sitting among several dashed reaction levels.

## Takeaways

At one electrode the whole story is two levels and a reference: the metal's $V_{\mathrm{e}^-}$, the solution's redox level $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$, and whatever zero we measure against. "Electrode potential," "equilibrium potential," and "overpotential" are all gaps among these, which the diagram shows directly instead of hiding them inside one overloaded symbol. Next we wire two electrodes into a full cell, where the reference electrode and the liquid junction finally enter the picture.

[**NEXT TOPIC: Reference electrodes & cells**](../references/)
