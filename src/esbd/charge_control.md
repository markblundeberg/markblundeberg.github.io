---
layout: layouts/esbd_topic.njk
title: 'Constraints and charge neutrality'
tags: [page, esbd_topic]
orderESBD: 23
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

How do we actually wrangle with thermodynamic constraints in practical situations? We've seen the easy part: how to find relative $V_i$ values if we know the concentrations. But often, we face the inverse problem: one or more $V_i$ are fixed (e.g. by external reservoirs or contacts), leaving open the question of where to put the standard states $V^\circ_i$.

Dealing with these mixed constraints algebraically can be a mathematical chore. However, using our $V_i$ diagrams, we can visualize exactly what is going on. 

## 1. The electrostatic mass-action law

What happens when we fix some species voltages but allow the standard state ladder $V^\circ_i$ to shift? 

* **One $V_i$ fixed (A single charge carrier)**: If we fix $V_{\mathrm{pos}}$ and shift the $V^\circ_i$ ladder down, the concentration of the positive carrier is enhanced. Shifting the ladder up causes depletion. If we isolate $c_i$ from our formula and focus on what changes in $V^\circ_i$ do, we get:
  $$ c_i \propto \exp(\delta V^\circ / ...) $$
* **But why does $V^\circ_i$ shift?**: What actually determines its position? The full answer is has to do with electrostatics (which we will discuss), but almost always we can invoke **bulk charge neutrality** as a constraint. Various factors like spectator ions or dopants can force neutrality to shift, dragging the $V^\circ_i$ ladder with it. We will explore these specific cases below.
* **Two $V_i$ fixed (The mass-action law)**: What if we fix both $V_{\mathrm{pos}}$ and $V_{\mathrm{neg}}$? If we shift the $V^\circ_i$ ladder, the individual concentrations of the positive and negative carriers will change. However, because the shift applies to both standard states equally, the *product* of their activities (or the mean activity product) remains perfectly constant! The $V^\circ_i$ shift completely cancels out of the product. Quantitatively, if we evaluate $V_A - V_B$ we can isolate:
  $$ c_A^{1/z_A} c_B^{-1/z_B} = K $$
  where $ K = {const} \times \exp(V_A - V_B / ...) $.
  This is known as a {% wiki "mass action law" %}; in this case the mass-action law describes not a chemical reaction but instead an comparison of electrostatic states. E.g. we have  $c_A c_B = K$ in the case of +1 and -1 ions, which means we can increase the concentration of A (cation) at the expense of B (anion), or vice versa. 
* Activity note; mean activity products link to (Nonideality)[../nonideal] topic; and, if there are >2 V_i fixed we can construct one of these 

<figure class="diagram-placeholder">
{% figcaption %}
Diagram: fixed V_A and V_B, with slider for V^0.
"other ions not shown" -- don't talk about total charge right now, just c_A and c_B and the product c_A c_B.
{% endfigcaption %}
</figure>

## 2. Disturbances that affect neutrality

Let's look at practical examples of "disturbances" that force the $V^\circ_i$ ladder to shift in order to maintain bulk charge neutrality.

### Dopants
* Static background charges (like $N_{\mathrm{D}}^+$ or $N_{\mathrm{A}}^-$ in semiconductors) don't have a meaningful $V_i$ since they are immobile.
* They act as a pure neutrality disturbance. The $V^\circ_i$ ladder must shift up or down until the mobile carriers (electrons and holes) exactly balance the static dopant charge.

### Common-ion effect
* Usually, the common-ion effect is taught purely chemically. Here, we reframe it by treating the new, uncommon ions essentially as dopants!
* Example: Adding $\mathrm{KCl}$ to a saturated $\mathrm{AgCl}$ solution. We treat the added $\mathrm{K}^+$ as a neutrality disturbance.
* Because the solution is saturated, the gap between $V_{\mathrm{Ag}^+}$ and $V_{\mathrm{Cl}^-}$ is fixed (mass action). To restore neutrality against the $\mathrm{K}^+$ disturbance, the $V^\circ_i$ ladder shifts. This simultaneously depletes $\mathrm{Ag}^+$ (precipitation) and enhances $\mathrm{Cl}^-$, satisfying both mass action and charge neutrality.
* We pretend that the precipitating ions automatically exchange with imaginary reservoirs to keep the $V_i$ gap rigid.

{# old common-ion demo that had been unused, may need tweaking #}
{% include "esbd-diagrams/esbd-agcl-kcl-common-ion.html" %}

### Spectator ions (Gibbs-Donnan Equilibrium)
* A semipermeable membrane separates two electrolyte chambers. Mobile ions ($\mathrm{Na}^+$, $\mathrm{Cl}^-$) can cross, but a large spectator ion (like a protein $\mathrm{Pr}^-$) is blocked on one side.
* The blocked protein acts as a localized dopant—a neutrality disturbance that exists only on one side of the membrane.
* Because the mobile ions can equilibrate, their $V_i$ levels are perfectly flat across the membrane.
* To satisfy local charge neutrality on *both* sides, the $V^\circ_i$ ladder on the protein side must shift relative to the empty side. This step in the $V^\circ_i$ ladder across the boundary is the **Donnan potential**.

<figure class="diagram-placeholder">
{% figcaption %}
[PLACEHOLDER: D3 diagram of Gibbs-Donnan equilibrium. Mobile ion $V_i$ traces are flat. Slider controls blocked protein concentration on the right side, driving the Donnan potential step in $V^\circ_i$.]
{% endfigcaption %}
</figure>

## 3. All $V_i$ fixed

We already saw the case of "all $V_i$ fixed" when discussing the mass-action law with exactly two charge carriers (like in a pure semiconductor). But what happens in a multi-ion case when every $V_i$ is rigidly fixed by external constraints?

* If all $V_i$ are locked, the only degree of freedom left is the single global offset of the $V^\circ_i$ ladder.
* We can visualize how shifting this single $V^\circ_i$ ladder affects the *total* free charge density of the system.
* There is only one exact position for the ladder where the total charge is perfectly neutral. 

<figure class="diagram-placeholder">
{% figcaption %}
[PLACEHOLDER: D3 diagram. Top panel: Multi-ion case with all $V_i$ fixed. Bottom panel: Plot of total free charge vs $V^\circ_i$ offset.]
{% endfigcaption %}
</figure>

**The Cliffhanger:** We've seen that to maintain bulk neutrality, the $V^\circ_i$ ladder must sometimes jump or step (like in the Donnan membrane). But physical solvents don't change their properties instantaneously across an imaginary line. If the $V^\circ_i$ ladder has to bend smoothly to transition between two neutral bulk states, what happens to the charge neutrality in that bending region? 

This localized break-down of neutrality leads us directly into spatial electrostatics.

But first, let's examine a concrete analogy between electrochemistry and semiconductors...

[**NEXT TOPIC: Bipolar membranes and pn junctions**](../bipolar/)
