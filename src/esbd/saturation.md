---
layout: layouts/esbd_topic.njk
title: 'Saturation'
tags: [page, esbd_topic]
orderESBD: 29
---

# {{title}}

Drive a current through a uniform block of a single conductor and the rule is the comfortable one: raise the voltage across the terminals and the current rises in step. Real devices keep breaking that rule. Past a certain point the current stops responding to voltage at all, flattening into a ceiling it refuses to cross. It **saturates**.

What makes saturation worth its own topic is that the same mechanism turns up in places that look unrelated: the "mass-transfer limit" of electroplating, the "pinch-off" of a field-effect transistor, the minority-carrier sweep-out of a bipolar transistor, the "salt depletion" of a battery electrolyte. In each, a *spectator* (an abundant blocked species, or a gate) screens the field and forces the active carrier into a depleted choke point, and on a $V_i$ diagram they all look the same. It is the point the [transport topic](../basictransport/) left hanging: we set the voltage, but the current that flows has a ceiling, fixed by where the active carrier runs out.

## The choke point

Apply a voltage and, for the first instant before anything moves, an electric field appears and every carrier drifts in unison, but that does not last: within a moment one species takes over the job of carrying current while the others, the spectators, find themselves blocked. (In a transistor the new steady state arrives in well under a nanosecond; in an electrochemical cell it can take minutes or hours.) Let us look at that steady state, where a single active species $i$ carries all the current.

A spectator species $j$ carries no current, so its voltage is flat, a level rail across the whole channel. The active species is the opposite. Carrying a steady current down a varying conductivity, its voltage has to slope,

$$ \nabla V_i = -\frac{J_i}{\sigma_i}, $$

with $J_i$ fixed (steady state, nothing piling up) while $\sigma_i$ is free to vary wildly from place to place. The question that decides everything is what the standard state $V^\circ_i$ does as $V_i$ tilts away beneath the flat spectator rails.

Recall that $V^\circ_i$ is not free: it floats to wherever local neutrality demands. With the active $V_i$ sliding and the spectator rails held flat, neutrality drags $V^\circ_i$ to somewhere in between, and *how far* it follows the active carrier is decided by a competition of chemical capacitances, the capacitive divider from the [capacitance topic](../capacitors/), set between the active rail and the spectator rails.^[Rails coupled by per-carrier chemical capacitances is precisely the equivalent-circuit picture of a mixed conductor drawn by J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001).] When the spectators are abundant they dominate that divider and clamp $V^\circ_i$ close to their flat rails. The active carrier is then left sliding away from a nearly pinned standard state, and since

$$ c_i \propto \exp\!\left(\frac{z_i F\,(V_i - V^\circ_i)}{RT}\right), $$

a widening gap means a falling concentration. The carrier depletes itself as it carries the current.

Now the loop closes. Falling $c_i$ means falling $\sigma_i$, which by $\nabla V_i = -J_i/\sigma_i$ means a steeper slope, which widens the gap faster, which depletes harder still. Toward the draining end the concentration collapses toward zero, the conductivity with it, and the slope of $V_i$ runs away toward the vertical. But $V_i$ has only a finite distance to fall, set by the draining boundary. Once the profile has steepened enough to bottom out there, lowering the drain further changes almost nothing upstream: the extra voltage drops across the all-but-empty sliver at the end and draws no more current. The device has found its ceiling. That is saturation, and it is the breakdown foreshadowed in the [transport topic](../basictransport/), where pushing past the point of an exhausted carrier left no steady profile able to span the channel.^[Real current–voltage curves are rarely perfectly flat past the knee. Channel-length modulation, side reactions, carrier-velocity saturation in short channels, and reaction or thermionic bottlenecks at the contacts all bend the ceiling in their own ways. We set those aside to keep the screening mechanism in view.]

How firmly the spectators pin $V^\circ_i$ splits the phenomenon into two cases.

## Hard pinning: pure diffusion

When the spectator or background charge is overwhelming, it pins $V^\circ_i$ rigidly flat (equivalently, it screens the field down to $\nabla\phi \approx 0$). The active carrier then feels no field at all and crosses the region by pure diffusion, a Fickian random walk down its concentration gradient, with a diffusion-limited current set by how steep that gradient can be made,

$$ J_i^{\,\text{lim}} \approx \frac{z_i F D_i\, c_i^{\text{bulk}}}{\delta}, $$

where $\delta$ is the width of the depleted layer. The current saturates once the surface concentration is pulled to zero and the gradient can grow no steeper.

The semiconductor version is the neutral base of a {% wiki "bipolar junction transistor" %}. The base is flooded with majority carriers (holes, in a p-type base) that screen the field flat, so the injected minority electrons drift nowhere and simply diffuse across. The collector current saturates as soon as the collector is biased far enough to hold the electron concentration at zero on its side of the base.

The electrochemical twin is a plating bath run with a large excess of inert **supporting electrolyte**. The background salt (say $\mathrm{KNO_3}$) screens the field, so a dilute active ion such as $\mathrm{Ag}^{+}$ reaches the cathode only by diffusing across the stagnant **Nernst diffusion layer** between the electrode and the stirred bulk.^[The stirred bulk fixes the source boundary condition, holding $c_i^{\text{bulk}}$ a fixed distance $\delta$ from the electrode; $\delta$ is essentially the thickness of that unstirred layer.] The familiar **limiting current density** is reached when the surface $\mathrm{Ag}^{+}$ concentration hits zero.

<figure class="demo-container" style="max-width: 700px">
{% include "esbd-diagrams/esbd-sat-hard.njk" %}
{% figcaption %}
Hard pinning, side by side, one drive slider for both. Left: a BJT base — majority holes hold everything flat while injected electrons diffuse toward the collector. Right: a silver-plating cathode in excess $\mathrm{KNO_3}$ — the supporting ions hold the ladder flat while $\mathrm{Ag}^+$ diffuses across the Nernst layer (the reversible cathode's $V_{\mathrm{e}^-}$ rides the surface $V_{\mathrm{Ag}^+}$). In both, only the active carrier's $V_i$ bends, and at $j = j_{\mathrm{lim}}$ it dives off the plot at the draining boundary: the logarithmic divergence is the ceiling. The strips below track the active carrier's concentration — one identical linear ramp in both devices, touching zero exactly at the limit.
{% endfigcaption %}
</figure>

## Soft pinning: mixed drift and diffusion

When there is no overwhelming spectator sea, the pinning is only partial and a longitudinal field survives. The active carrier then moves by a shifting blend of drift and diffusion, and $V^\circ_i$ slopes along with $V_i$ rather than staying flat.

In a **binary electrolyte** the only ions present are the active cation and its counter-anion, with no inert background to lean on. Neutrality must be held by the two movers alone, which demands a diffusion-potential field across the cell; the cation rides that field and its own concentration gradient together (ambipolar transport), and the current saturates when the cation is depleted to zero at the electrode. The salt gradients inside a working battery electrolyte are exactly this situation, though they are seldom driven all the way to the limit.

The semiconductor twin is the **FET channel**. There is no majority-carrier sea to screen along the channel, so a longitudinal field must drive the drift from source to drain; the gate supplies only a *transverse* pinning, coupling to $V^\circ_{\mathrm{e}^-}$ through the gate capacitance.^[This pinning is not spatially uniform. The gate's dielectric capacitance competes against the channel carriers' chemical capacitance, and their ratio shifts with carrier density, so the pinning stiffens as the channel nears depletion. The 1:1 binary electrolyte escapes this complication: its two chemical capacitances track each other at every concentration, which locks its steepening to a clean factor of two. The FET panel is drawn from the actual long-channel model, and there the local steepening is $1 + C_{\mathrm{gate}}/C_{\mathrm{chem}}$: barely above one near the source, where the channel's own carriers dominate the screening; exactly two where the two capacitances cross, which lands within a thermal voltage of the classical pinch-off point; and diverging in the thin subthreshold sliver beyond, where the gate wins outright and holds the band edge to a fixed ceiling.] Near the drain the carrier concentration falls to zero, the channel **pinches off**, and the current saturates.

<figure class="demo-container" style="max-width: 700px">
{% include "esbd-diagrams/esbd-sat-soft.njk" %}
{% figcaption %}
Soft pinning, side by side, one drive slider for both. Left: a FET channel, where the gate pins $V^\circ_{\mathrm{e}^-}$ only through a capacitance, so the edge slopes and $V_{\mathrm{e}^-}$ pinches off at the drain. Right: a binary electrolyte, where the blocked anion stays flat but the ladder bends with the salt concentration and $V_{\mathrm{Ag}^+}$ bends by twice that, the ambipolar factor. At $j_{\mathrm{lim}}$ both active carriers dive at the draining boundary. The electrolyte's ladder dives along with $V_{\mathrm{Ag}^+}$; the FET's edge does not, flattening instead onto a ceiling set by the gate, which by then has taken over the pinning from the depleted channel. The concentration strips tell the same story: the electrolyte's ramp is the exact straight line of the hard-pinned figure, while the FET's bows, a carrier-rich channel needing almost no gradient until close to the drain. The two-to-one steepening is the electrolyte's alone; the FET's factor drifts along the channel, as the footnote details.
{% endfigcaption %}
</figure>

## Takeaways

A silicon transistor and a plating bath choke off their current for one and the same reason. A flat-voltage rail, whether the transistor's gate or contact or the electrolyte's blocked spectator, couples capacitively to the active carrier's standard state and holds it in place. Drive the carrier and its voltage slides away from that pinned level, thinning the concentration toward zero at the draining boundary, where the conductivity collapses and the current can grow no more. Hard pinning leaves the carrier diffusing alone; soft pinning leaves a field to push it; either way the ceiling is the same.

This closes our long comparison between electrons in semiconductors and ions in solution. The next several topics change tack, turning to "electrons in solution": redox reactions, and what electrode potential really means on a $V_i$ diagram.

[**NEXT TOPIC: Half-reactions**](../half/)
