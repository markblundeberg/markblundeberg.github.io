---
layout: layouts/esbd_topic.njk
title: 'How to read an ESBD'
tags: [page, esbd_topic]
orderESBD: 12.5
---

# {{title}}

An electrochemical species band diagram packs several different kinds of line and marker onto a single voltage axis. This page is the field guide to all of them: every creature you will meet as we go. There is no need to memorize it: every figure in the book carries a small link back here, so whenever a diagram starts to look like a thicket, one click returns you to the key.

<figure class="demo-container" style="max-width: 380px">
{% include "esbd-diagrams/esbd-reading-legend.njk" %}
</figure>

## The axis

Up is **voltage**, in volts. That sounds unremarkable until you recall that the energy band diagrams of semiconductor physics plot *energy* upward, and for electrons energy runs opposite to voltage. So an ESBD is an energy band diagram flipped top to bottom: the conduction band sits at the **bottom**, the valence band at the **top** (more on that in [semiconductors](../solidstate/)). The horizontal axis is usually position across a device, though now and then it is a radial coordinate or just an abstract "here versus there".

The whole diagram can be slid up or down freely: only vertical *differences* carry meaning. That freedom is deliberate, and we lean on it throughout.

## The lines

**Species voltage $V_i$** — a solid, species-coloured line, one for each mobile carrier (an electron, a lithium ion, a chloride ion, and so on). It is the star of the show. A flat $V_i$ usually means that carrier is in equilibrium and carries no net current, while a sloping $V_i$ usually means current is flowing and dissipating; the real link between slope and current is the conductivity, a tie that loosens in several entertaining ways.^[All three ties are loose. Since $J_i = \sigma_i(-\nabla V_i)$: a steep $V_i$ in a *poor* conductor carries almost no current, and almost no dissipation; a *superconductor* is the opposite limit, a persistent current at perfectly flat $V_i$, dissipating nothing (a genuine, if constrained, equilibrium). And a flat $V_i$ can still hide a current driven by something other than its own slope: a changing flux ($\partial\mathbf{A}/\partial t$), a thermal gradient (Seebeck), or cross-coupling to another carrier.] Several $V_i$ can run through the same place at once. (→ [species voltage](../v_i/))

**Standard state $V^\circ_i$** — a thinner line of the same colour, the carrier's "band edge" or reference level. A carrier's $V_i$ floats away from its $V^\circ_i$ by a distance set by the logarithm of concentration, so the gap between the two reads as a concentration. Which side the carrier floats on depends on the sign of its charge, so a faint hatching marks the rung's *concentrated* side: a carrier below standard concentration sits in the clear, and a carrier line entering the hatching means the concentration has passed $1~\mathrm{mol/L}$, the same visual as a Fermi level entering a band. The texture even carries the charge itself, being drawn compressed by the diagram's own $1/(z_i F)$ scaling: stripes run at slope $1/z_i$, so an anion's stripes mirror over and a divalent ion's flatten to half height. The $V^\circ_i$ lines shift together as one rigid ladder. (→ [solutions](../solutions/), [semiconductors](../solidstate/))

**Implied redox level $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$** — a dashed, electron-coloured line drawn inside a solution: the level where one of the solution's redox couples "wants" the electrons to sit, even with no electrode present. A solution out of equilibrium can show several at once. (→ [half-reactions](../half/))

**Standard redox level $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$** — the standard-state sibling of the line above, drawn thin *and* dashed: a redox couple's level at unit activities, floating along with the rest of the $V^\circ$ ladder. It is the "standard electrode potential" $E^\circ$, before any reference has been subtracted off. (→ [half-reactions](../half/))

**Vacuum level $\phi_{\mathrm{vac}}$** — a dashed line wearing the electron's colour, because by convention it *is* the electron's vacuum rest level. Drawn only out in a vacuum or insulator, stepping *down* from a metal's $V_{\mathrm{e}^-}$ by the work function; we never thread it through the bulk of a conductor. (In the master figure above, and in most figures, that step is compressed: a real $\Phi/e$ is $4$–$5\ \mathrm{V}$ and would fall clean off the plot. It always steps *down*, though.) (→ [capacitance](../capacitors/), [vacuum levels](../vacuum/))

## The markers

**The ⇌ symbol** marks a reaction. With two species, this fixes the step $V_i - V_j$ between their lines (including the step from $V_{\mathrm{e}^-}$ to an ion's $V_i$ at an electrode). Its ends always sit on *carrier* levels (solid $V_i$, or a dashed implied level like $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$), never on a $V^\circ$ rung: a reaction ties what the carriers actually feel. The same reaction *driven* (running net, out of equilibrium) wears its overpotential openly: a species-coloured dot marks where the tied level *would* sit at equilibrium (its ghost), and a thick coloured stub runs from the ghost to the actual level, tipped with an arrow giving the direction of the conventional current through the reaction. Almost always that arrow points **down**: current falls through a dissipative reaction. A *pumped* reaction points it **up**, current driven uphill by an external energy source, as light does in the [solid state](../solidstate/) topic's illuminated bar. Which rail the stub touches tells you where that current lands or departs. When the reaction is a plain same-carrier hop (an electrode exchanging electrons with a redox couple's implied level, or electron–hole recombination), the ⇌ bubble is dropped and the bare arrow *is* the marker. At equilibrium the stub shrinks away and only the ⇌ remains. (→ [equilibrium](../equilibrium/), [kinetics](../kinetics/))

**A capacitor symbol (‖) between two lines** marks a chemical capacitance: the storage that lets their gap flex as charge is banked, the elastic counterpart to the rigid ⇌. It may bridge a carrier and its own standard state $V^\circ_i$, or two different carriers' rails $V_i$ and $V_j$; those are two portrayals of the same banked charge. (→ [capacitance](../capacitors/))

**An ↕ in a bubble** marks a plain vertical *distance*: a labelled gap between two levels (a work function, a band gap, a Nernst activity term), asserting no reaction and no coupling, just how far apart they sit. Hover it for what the gap is. Cousins you will meet: a circled **V** is a voltmeter reading the gap it bridges, and a circled **Δ** names a fixed step defined in the surrounding text.

**A small zigzag break (⌇) across a line** (as on the generic ion in the master figure above, always accompanied by a corner note "⌇&nbsp;=&nbsp;per-species offset") flags a species drawn with a *display offset*: all of its levels have been shifted together by a constant (hover the mark for the exact value) so that widely separated species can share one readable plot. Everything about the flagged species itself is still to scale; only its raw vertical distance to other species (including any step a ⇌ marker bridges to them) is not. This is less of a cheat than it may sound: the distance between species that share no reaction was set by bookkeeping convention in the first place. (→ [solutions](../solutions/))

**A slider** on a figure lets you move something (a concentration, an applied voltage, the overall offset) and watch the lines respond. Reach for it; the diagrams are built to be played with.

## Lost?

Those are the core players. If a later figure ever shows a line or symbol you don't recognize, the link in its corner brings you straight back to this page.

[**NEXT TOPIC: Solutions**](../solutions/)
