---
layout: layouts/esbd_topic.njk
title: 'Thinking with Vᵢ'
tags: [page, esbd_topic]
orderESBD: 13
---

# Thinking with $V_i$

Besides the $V_i$ being a plotting tool, my hope is that we can build a new alternative intuition about how devices behave in terms of $V_i$.

* Local thermodynamic equilibrium:
* Quasi-neutrality: $\nabla \cdot J = 0$. "Kirchhoff’s Current Law" at small scales.


## Bulk conduction

In the classic electrochemistry picture we see this as a total conduction driven by $\phi$ gradient.
In the thermodynamic $V_i$ picture we see this as each ion conducting independently in response to its own $V_i$ gradient. Either way it's the same answer.

<figure class="diagram-placeholder">
{% figcaption %}
- Bulk, all $V_i$ slope together
{% endfigcaption %}
</figure>

In electronics and naive treatments of electrolyte conduction ('primary current distribution'), bulk conduction is all we have. You probably have a lot of intuition about this basic kind of conduction.

## Quasineutral regions

A quasineutral region is made up of the same medium (solvent or whatever) but has variations in the ionic solute concentrations.

Remarkably we don't need to think about complex electrostatics, because electrostatics is enforcing strict neutrality. So $V_i$ suffices. The $\phi$ and $V^\circ_i$ and band edges are helpful as bookkeeping tool (especially in ideal-dilute solutions) but not strictly required to model the device.

Transport dominates.

These are especially important in electrochemistry but less so in semiconductors since the latter mostly only have one charge carrier type.

"Concentration polarization"

Salt diffusion arises naturally out of 1) conductivity and 2) strict neutrality. "Diffusion potential" - show

<figure class="diagram-placeholder">
{% figcaption %}
- Example: diffusing blob of HCl; show diffusion potential. 
{% endfigcaption %}
</figure>

At electrodes, it often occurs that only one ion is involved, and the others are blocked. This leads to concentration polarization. Conductivity variations naturally arise.

<figure class="diagram-placeholder">
{% figcaption %}
- Li+ concentration polarization
{% endfigcaption %}
</figure>

In chemical baths another important phenomenon is convection, which tends to mix up the fluid. 

<figure class="diagram-placeholder">
{% figcaption %}
- Diffusion + convection picture. Maybe different ions on anode/cathode?
{% endfigcaption %}
</figure>

## Junctions, a macroscopic view

- Interface as a black box.
- Continues the idea of quasi-neutrality.
- With same-species, $V_i$ jumps across, generally a step. Often exponential dependence between current and voltage, for various reasons. (Diode eqn, Tafel eqn, Butler-Volmer eqn, )
- Capacitance: Lippmann equation. The underlying microscopic reason is unspecified.

<figure class="diagram-placeholder">
{% figcaption %}
- Semiconductor diode drawn as black box V_e- to V_h+. Slider for
{% endfigcaption %}
</figure>


-When the junction has a reaction converting between species, it can be helpful to draw implied $V_i$ from reaction. Notably at electrodes where electrons react with ions, it is useful to draw implied Ve- . This connects to notions of electrode potential and overpotential.

<figure class="diagram-placeholder">
{% figcaption %}
- Example electrode
{% endfigcaption %}
</figure>

## Junctions with electrostatics

Now electrostatics start to become

Nanometers in most electrolytes (called double layer), but can be many micrometers in semiconductors.

-Warning about vacuum contact ideas.

"The interface is the device"

<figure class="diagram-placeholder">
{% figcaption %}
- Example 
{% endfigcaption %}
</figure>

## Insulators and vacuum

Work function, absolute electrode potential. $\phi_{vac}$.

Interface between insulator and conductor can be a 'black box' or zoom in with electrostatic.

<figure class="diagram-placeholder">
{% figcaption %}
- Field effect transistor, involves both insulator and in-conductor electrostatics
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- Absolute electrode potential figure? ('black box')
{% endfigcaption %}
</figure>
