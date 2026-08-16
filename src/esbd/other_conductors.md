---
layout: layouts/esbd_topic.njk
title: 'Other conductors'
tags: [page, esbd_topic]
orderESBD: 29
---

# {{title}}

In the dilute solutions and semiconductors of the previous topics, the standard-state ladder did real work: $V^\circ_i$ set the concentration scale, bent to enforce neutrality, and, in the [saturation](../saturation/) drama just past, its pinning set the very ceiling on current. Many conductors are not like that. In a metal, a fast ionic conductor, or a concentrated electrolyte, the carriers are so dense that the standard states and band structure either grow hopelessly complicated or stop mattering at all, and the diagram simplifies to the $V_i$ themselves.

## Metals: the transport-only limit

A metal is the extreme of carrier density, something like $10^{22}$ mobile electrons per cubic centimetre, enough to screen any disturbance within a fraction of an ångström. Pinning down the internal $\phi$, the electrons' activity, or the detailed band structure is a genuine theoretical ordeal (argued at length in [$\phi$ under the microscope](../phi/)), and the response of the $V_i$ picture is simply not to bother. The only quantity that matters for the bulk is $V_{\mathrm{e}^-}$: flat at equilibrium, sloping by plain Ohm's law $J_{\mathrm{e}^-} = -\sigma_{\mathrm{e}^-}\nabla V_{\mathrm{e}^-}$ under load. A metal wire is a single $V_{\mathrm{e}^-}$ trace, and that is all we ever need from it.

<figure class="demo-container" style="max-width: 380px">
{% include "esbd-diagrams/esbd-oc-metal.njk" %}
{% figcaption %}
A metal phase as an ESBD. Screening is perfect, so the electrical state is just the flat (or, under current, linearly sloping) $V_{\mathrm{e}^-}$ trace — deliberately drawn with nothing else, no $\phi$ and no $V^\circ_{\mathrm{e}^-}$.
{% endfigcaption %}
</figure>

## Fast ionic conductors: metals for ions

Some solids play the same trick with an ion. A fast, or "superionic," conductor such as {% wiki "Yttria-stabilized zirconia", "yttria-stabilized zirconia" %} carries a high concentration of mobile oxide ions, $\mathrm{O}^{2-}$, hopping through vacancies in the lattice; this one material serves as the electrolyte of solid oxide fuel cells and of the lambda oxygen sensor in virtually every car exhaust. The microscopics are crowded and thoroughly non-dilute, yet thermodynamically the bulk is once again a single sloping species voltage, $J_{\mathrm{O}^{2-}} = -\sigma_{\mathrm{O}^{2-}}\nabla V_{\mathrm{O}^{2-}}$. These single-ion conductors are the ionic counterpart of the metal wire, and because they pass only one species, a junction involving such an "ion wire" can settle into equilibrium without a standing current, there being no diffusion potentials with only one carrier ([basic transport](../basictransport/)).

<figure class="demo-container" style="max-width: 380px">
{% include "esbd-diagrams/esbd-oc-ysz.njk" %}
{% figcaption %}
A fast ionic conductor (YSZ): the single trace $V_{\mathrm{O}^{2-}}$ carries the whole story of oxygen transport across the solid electrolyte. Deliberately the same picture as the metal above with one label changed — in charge-normalized voltage, a superionic conductor is a metal for its ion, sign and valence notwithstanding.
{% endfigcaption %}
</figure>

## Mixed ionic-electronic conductors

Between the purely electronic metal and the purely ionic conductor sit materials that move both at once: a battery cathode like $\mathrm{Li}_x\mathrm{CoO}_2$, or a mixed-conducting polymer. With an electronic and an ionic carrier sharing one medium, these {% wiki "Mixed ionic-electronic conductor", "mixed conductors" %} are where the electronic circuit and the ionic circuit physically meet, and they show the full richness of coupled transport, internal concentration polarization, and local charge storage. Indeed we have already been inside one: the ambipolar lockstep at the end of [basic transport](../basictransport/), where electrons slow to the pace of the lithium ions they escort, is mixed conduction at work.

This is also where the per-species Ohm's law has to generalize. Once more than one mobile carrier shares a dense medium, transport need not stay a private affair of each species: the general linear law lets every gradient push every carrier,

$$ J_i = -\sum_j \sigma_{ij}\,\nabla V_j, $$

with a symmetric conductivity matrix $\sigma_{ij}$ in place of a single $\sigma_i$. The off-diagonal terms are the cross-coupling that a dense, interacting medium inevitably brings, the same physics carried by the {% wiki "Maxwell–Stefan diffusion", "Maxwell–Stefan" %} and Onsager equations, and the storage side generalizes in step, the two-rail mutual chemical capacitance widening into a full matrix (see [capacitance](../capacitors/), with the matrix in the [appendix](../chemical_capacitance_matrices/)). The metals and single-ion conductors above are just the $1\times1$ corner of this, where the matrix holds one entry and the coupling vanishes. Throughout, the saving grace is that these media are dense and well screened: we never need to pin down $V^\circ_i$, but in exchange the whole account now rests on the $V_i$ alone.

## Further along the spectrum

The same "just plot the $V_i$" attitude carries the messier cases. In a **concentrated electrolyte** or an **ionic liquid**, the carriers are dense enough that screening is severe and $\phi$ turns both unimportant and ambiguous; we keep the present carriers' $V_i$ and accept the complications of strongly coupled, multi-ion transport that now drags on the neutral solvent as well. A **dense plasma** is the same picture run hot: free electrons and bare ions, severely screened, in essence an ionic liquid that has shed its solvent (the two fields even share their strong-coupling theory). Each species keeps a well-defined $V_i$ so long as collisions keep it thermalized; the dilute, collisionless plasmas of space physics are where that assumption, and the framework with it, finally frays. A **superconductor**, at the far end, is the limit the metal figure only approximated: with infinite conductivity its $V_{\mathrm{e}^-}$ stays exactly flat even under current, so a superconducting lead hands a terminal's $V_{\mathrm{e}^-}$ across the lab without spending any of it, the perfect wire made literal.

## Takeaways

For dilute solutions and semiconductors, the standard states and band edges are indispensable coordinates. For metals, fast ionic conductors, and the other dense conductors here, those references fade and only the species voltages remain. One transport law spans the whole range, $J_i = -\sum_j \sigma_{ij}\nabla V_j$, from the $1\times1$ metal to the fully cross-coupled mixed conductor, and in every case it is the $V_i$, never a $V^\circ_i$, that the diagram needs.

With this, our survey of conduction is complete, and the mixed conductors have already posed the next question: where the electronic and the ionic circuit meet, something must hand the charge from one to the other. That handoff is a redox reaction. Reactions coupling the rails are nothing new, of course; they have been with us since [Reactions](../reactions/). What the coming topics add is the dedicated "electrons in solution" picture: half-reactions, electrode potentials, and what they really mean on a $V_i$ diagram.

[**NEXT TOPIC: Half-reactions**](../half/)
