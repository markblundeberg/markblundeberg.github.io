---
layout: layouts/esbd_topic.njk
title: 'Bipolar membranes and pn junctions'
tags: [page, esbd_topic]
orderESBD: 24
---

# {{title}}

The [previous topic](../charge_control/) ended with a fixed background charge forcing the standard-state ladder to step across a boundary, the Donnan potential. Put two such regions back to back, with fixed charge of opposite sign on each side, and you have built one of the most satisfying objects in this subject: a device that is at once a semiconductor pn-junction diode and an electrochemical bipolar membrane. The two are not merely analogous; built as $V_i$ diagrams they share the same construction and obey the same rules of depletion, generation, and recombination.

## Functional twins

A pn junction joins two doped semiconductors: an $n$-type region, with fixed positive donors and mobile electrons, against a $p$-type region, with fixed negative acceptors and mobile holes. A bipolar membrane joins two fixed-charge polymer films in the very same arrangement. An anion-exchange membrane carries fixed positive groups and conducts mobile anions (here $\mathrm{OH}^-$), making it the electrochemical $n$-type; a cation-exchange membrane carries fixed negative groups and conducts mobile cations (here $\mathrm{H}^+$), the electrochemical $p$-type.^[These fixed-charge media go by many names depending on the field — ionomers and polyelectrolytes to a materials chemist, permselective or ion-exchange membranes to an engineer — but physically each is just a medium carrying a built-in static charge, the direct counterpart of a semiconductor dopant. The dopant picture is an idealization, though: a real membrane is its own medium, with its own $V^\circ_i$ ladder set by how it solvates and sterically packs each ion, and the counter-ions may even bind locally to the fixed groups. We treat it here as lightly doped water for the sake of the analogy.]

| | pn junction | bipolar membrane |
| --- | --- | --- |
| mobile positive carrier | hole $\mathrm{h}^+$ | cation, e.g. $\mathrm{H}^+$ |
| mobile negative carrier | electron $\mathrm{e}^-$ | anion, e.g. $\mathrm{OH}^-$ |
| fixed background charge | ionized dopants $N_{\mathrm{D}}^+$, $N_{\mathrm{A}}^-$ | bound charges on the membrane |
| the two halves | $n$-type and $p$-type | anion- and cation-exchange |
| pairing reaction | $\mathrm{e}^- + \mathrm{h}^+ \rightleftharpoons \varnothing$ | $\mathrm{H}^+ + \mathrm{OH}^- \rightleftharpoons \mathrm{H_2O}$ |
| junction potential step | built-in potential | Donnan potential |

## At equilibrium

At equilibrium every mobile carrier's $V_i$ runs flat across the whole device. The pairing reaction then fixes the two carriers a constant distance apart everywhere. For the diode, $\mathrm{e}^- + \mathrm{h}^+ \rightleftharpoons \varnothing$ gives $V_{\mathrm{e}^-} = V_{\mathrm{h}^+}$, the single Fermi level. For the membrane, $\mathrm{H}^+ + \mathrm{OH}^- \rightleftharpoons \mathrm{H_2O}$ gives $V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} = \mu_{\mathrm{H_2O}}/F = -2.457~\mathrm{V}$, the same fixed offset we met for [autoionized water](../equilibrium/). The only thing distinguishing the two cases is the formation energy of the product: zero for the electron-hole pair, $-237~\mathrm{kJ/mol}$ for water. This is the one visible difference between the twins on the diagram: the diode's two carrier levels coincide into a single Fermi line, while the membrane's sit a fixed $2.457~\mathrm{V}$ apart.

The carrier voltages stay flat, but the standard-state ladder cannot. The fixed charge differs on the two sides, so the ladder must rest at a different offset on each in order to keep that bulk neutral, precisely as it did across the Donnan membrane. The transition between the two offsets is the built-in potential, and it falls across a narrow junction region where the mobile carriers have been swept aside, leaving only the bare fixed charge. This is the depletion zone. In the membrane the fixed-charge density is so high that this zone is squeezed down to a few nanometres, far thinner than its semiconductor counterpart, but it plays exactly the same role.

<figure class="diagram-placeholder">
{% figcaption %}
Equilibrium, side by side: a pn junction and a bipolar membrane as $V_i$ diagrams. The mobile carrier voltages run flat (held a fixed distance apart by the pairing reaction), while the $V^\circ_i$ ladder bends through the depletion zone, carrying the built-in potential. (Junction widths schematic, not to scale.)
{% endfigcaption %}
</figure>

## Under bias

Reverse-bias the device and the mobile carriers are pulled away from the junction, widening the depletion zone until almost none remain there to carry the current. Current can continue only if fresh carriers are created at the junction itself. In the diode, thermal or optical energy generates electron-hole pairs, $\varnothing \rightarrow \mathrm{e}^- + \mathrm{h}^+$. In the membrane, the intense junction field splits water, $\mathrm{H_2O} \rightarrow \mathrm{H}^+ + \mathrm{OH}^-$, which is exactly what an industrial bipolar membrane is built to do: manufacture acid and base from water and electricity. On the diagram the two carrier voltages split apart at the junction, and the slope of that split sweeps the new carriers out to their respective sides.

Forward-bias it instead, and carriers are injected toward the junction from both sides, where they meet and annihilate. Electrons and holes recombine, $\mathrm{e}^- + \mathrm{h}^+ \rightarrow \varnothing$, and the energy they give up emerges as light in an LED or otherwise as heat; protons and hydroxides neutralize, $\mathrm{H}^+ + \mathrm{OH}^- \rightarrow \mathrm{H_2O}$, releasing their energy as heat.

<figure class="diagram-placeholder">
{% figcaption %}
Under bias (a slider sweeps from reverse to forward). Reverse bias widens the depletion zone and splits the carrier voltages, driving pair generation in the diode or water splitting in the membrane; forward bias injects carriers inward to recombine or neutralize at the junction.
{% endfigcaption %}
</figure>

## Takeaways

A silicon diode and a water-splitting membrane are functional twins, one junction built from two different sets of carriers. Both join a region of one fixed-charge sign to a region of the other; both hold their mobile carriers a fixed distance apart at equilibrium; both bend the standard-state ladder through a depleted junction; and both answer a reverse bias by creating carrier pairs and a forward bias by destroying them.

We have leaned all along on that depleted junction, the place where neutrality finally breaks and the ladder is free to bend. What sets its width, and the shape of the bend? Those are questions of electrostatics, which is the piece we put in place next.

[**NEXT TOPIC: Basic electrostatics**](../basicelectrostatics/)
