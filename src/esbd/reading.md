---
layout: layouts/esbd_topic.njk
title: 'How to read an ESBD'
tags: [page, esbd_topic]
orderESBD: 10.5
---

# {{title}}

An electrochemical species band diagram packs several different kinds of line and marker onto a single voltage axis. This page is the field guide to all of them — every creature you will meet as we go. There is no need to memorize it: every figure in the book carries a small link back here, so whenever a diagram starts to look like a thicket, one click returns you to the key.

{% include "esbd-diagrams/esbd-reading-legend.html" %}

## The axis

Up is **voltage**, in volts. That sounds unremarkable until you recall that the energy band diagrams of semiconductor physics plot *energy* upward, and for electrons energy runs opposite to voltage. So an ESBD is an energy band diagram flipped top to bottom: the conduction band sits at the **bottom**, the valence band at the **top** (more on that in [semiconductors](../solidstate/)). The horizontal axis is usually position across a device, though now and then it is a radial coordinate or just an abstract "here versus there."

The whole diagram can be slid up or down freely: only vertical *differences* carry meaning. That freedom is deliberate, and we lean on it throughout.

## The lines

**Species voltage $V_i$** — a solid, species-coloured line, one for each mobile carrier (an electron, a lithium ion, a chloride ion, and so on). It is the star of the show. A flat $V_i$ means that carrier is in equilibrium, carrying no net current; a sloping $V_i$ means current is flowing and energy is being dissipated. Several $V_i$ can run through the same place at once. (→ [species voltage](../v_i/))

**Standard state $V^\circ_i$** — a thinner line of the same colour, the carrier's "band edge" or reference level. A carrier's $V_i$ floats a distance away from its $V^\circ_i$ that grows with the logarithm of concentration, so the gap between the two reads as a concentration. The $V^\circ_i$ lines shift together as one rigid ladder. (→ [solutions](../solutions/), [semiconductors](../solidstate/))

**Implied redox level $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$** — a dashed, electron-coloured line drawn inside a solution: the level where the solution's redox couples "want" the electrons to sit, even with no electrode present. A solution out of equilibrium can show several at once. (→ [half-reactions](../half/))

**Standard redox level $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$** — the standard-state sibling of the line above, drawn thin *and* dashed: a redox couple's level at unit activities, floating along with the rest of the $V^\circ$ ladder. It is the "standard electrode potential" $E^\circ$, before any reference has been subtracted off. (→ [half-reactions](../half/))

**Vacuum level $\phi_{\mathrm{vac}}$** — drawn only out in a vacuum or insulator, stepping *down* from a metal's $V_{\mathrm{e}^-}$ by the work function. We never thread it through the bulk of a conductor. (→ [capacitance](../capacitors/))

## The markers

**The ⇌ symbol** marks a reaction that links two species, fixing the step $V_i - V_j$ between their lines — including the step from $V_{\mathrm{e}^-}$ to an ion's $V_i$ at an electrode. (→ [equilibrium](../equilibrium/))

**A slider** on a figure lets you move something — a concentration, an applied voltage, the overall offset — and watch the lines respond. Reach for it; the diagrams are built to be played with.

## Lost?

That is the whole menagerie. If a later figure ever shows a line or symbol you don't recognise, the link in its corner brings you straight back to this page.

[**NEXT TOPIC: Equilibrium**](../equilibrium/)
