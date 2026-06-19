---
layout: layouts/esbd_topic.njk
title: 'Other conductors'
tags: [page, esbd_topic]
orderESBD: 28
---

# {{title}}

In the dilute solutions and semiconductors of the previous topics, the standard-state ladder did real work: $V^\circ_i$ set the concentration scale and bent to enforce neutrality. Many conductors are not like that. In a metal, a fast ionic conductor, or a concentrated electrolyte, the carriers are so dense that the standard states and band structure either grow hopelessly complicated or stop mattering at all, and the diagram simplifies to the $V_i$ themselves.

## Metals: the transport-only limit

A metal is the extreme of carrier density, something like $10^{22}$ mobile electrons per cubic centimetre, enough to screen any disturbance within a fraction of an ångström. Pinning down the internal $\phi$, the electrons' activity, or the detailed band structure is a genuine theoretical ordeal, and the response of the $V_i$ picture is simply not to bother. The only quantity that matters for the bulk is $V_{\mathrm{e}^-}$: flat at equilibrium, sloping by plain Ohm's law $J_{\mathrm{e}^-} = -\sigma_{\mathrm{e}^-}\nabla V_{\mathrm{e}^-}$ under load. A metal wire is a single $V_{\mathrm{e}^-}$ trace, and that is all we ever need from it.

<figure class="diagram-placeholder">
{% figcaption %}
A metal phase as an ESBD. Screening is perfect, so the electrical state is just the flat (or, under current, linearly sloping) $V_{\mathrm{e}^-}$ trace, with no need to draw $\phi$ or $V^\circ_{\mathrm{e}^-}$.
{% endfigcaption %}
</figure>

## Fast ionic conductors: metals for ions

Some solids play the same trick with an ion. A fast, or "superionic," conductor such as {% wiki "Yttria-stabilized zirconia", "yttria-stabilized zirconia" %} carries a high concentration of mobile oxide ions, $\mathrm{O}^{2-}$, hopping through vacancies in the lattice. The microscopics are crowded and thoroughly non-dilute, yet thermodynamically the bulk is once again a single sloping species voltage, $J_{\mathrm{O}^{2-}} = -\sigma_{\mathrm{O}^{2-}}\nabla V_{\mathrm{O}^{2-}}$. These single-ion conductors are the ionic counterpart of the metal wire, and because they pass only one species, they are also the only kind of junction that can settle into true equilibrium without a standing current.

<figure class="diagram-placeholder">
{% figcaption %}
A fast ionic conductor (YSZ). The single active trace $V_{\mathrm{O}^{2-}}$ carries the whole story of oxygen transport across the solid electrolyte.
{% endfigcaption %}
</figure>

## Mixed ionic-electronic conductors

Between the purely electronic metal and the purely ionic conductor sit materials that move both at once: a battery cathode like $\mathrm{Li}_x\mathrm{CoO}_2$, or a mixed-conducting polymer. With an electronic and an ionic carrier sharing one medium, these {% wiki "Mixed ionic-electronic conductor", "mixed conductors" %} are where the electronic circuit and the ionic circuit physically meet, and they show the full richness of coupled transport, internal concentration polarization, and local charge storage. They are, in a real sense, the material embodiment of this project's premise that electrons and ions belong on the same diagram.

This is also where the per-species Ohm's law has to generalize. Once more than one mobile carrier shares a dense medium, transport need not stay a private affair of each species: the general linear law lets every gradient push every carrier,

$$ J_i = -\sum_j \sigma_{ij}\,\nabla V_j, $$

with a symmetric conductivity matrix $\sigma_{ij}$ in place of a single $\sigma_i$. The off-diagonal terms are the cross-coupling that a dense, interacting medium inevitably brings, the same physics carried by the {% wiki "Maxwell–Stefan diffusion", "Maxwell–Stefan" %} and Onsager equations, and the storage side generalizes in step, the chemical capacitance becoming an ambipolar capacitance matrix (see [capacitance](../capacitors/), with the matrix in the [appendix](../capacitance/)). The metals and single-ion conductors above are just the $1\times1$ corner of this, where the matrix holds one entry and the coupling vanishes. Throughout, the saving grace is that these media are dense and well screened: we never need to pin down $V^\circ_i$, but in exchange the whole account now rests on the $V_i$ alone.

## Further along the spectrum

The same "just plot the $V_i$" attitude carries the messier cases. In a **concentrated electrolyte** or an **ionic liquid**, the carriers are dense enough that screening is severe and $\phi$ turns both unimportant and ambiguous; we keep the present carriers' $V_i$ and accept the complications of strongly coupled, multi-ion transport that now drags on the neutral solvent as well. A **superconductor**, at the far end, is simply a metal with infinite conductivity: its $V_{\mathrm{e}^-}$ stays flat even while it carries current, and that well-defined $V_{\mathrm{e}^-}$ is what lets it connect sensibly to ordinary conductors.

## Takeaways

For dilute solutions and semiconductors, the standard states and band edges are indispensable coordinates. For metals, fast ionic conductors, and the other dense conductors here, those references fade and only the species voltages remain. One transport law spans the whole range, $J_i = -\sum_j \sigma_{ij}\nabla V_j$, from the $1\times1$ metal to the fully cross-coupled mixed conductor, and in every case it is the $V_i$, never a $V^\circ_i$, that the diagram needs.

[**NEXT TOPIC: Saturation**](../saturation/)
