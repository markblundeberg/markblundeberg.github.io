---
layout: layouts/esbd_topic.njk
title: '"Charge neutrality and mass action"'
tags: [page, esbd_topic]
orderESBD: 23
---

# {{title}}

So far we have worked in one direction: given the concentrations, we read off the species voltages. Real problems usually run the other way around. Some of the voltages are pinned for us, whether by a contact, a reservoir, or a reaction with a solid phase, and what we are left to determine is where the standard-state ladder $V^\circ_i$ sits. Pinning the $V_i$ does not pin the ladder, and pinning the ladder does not pin the $V_i$; the two are tied together only through a constraint that we have so far set aside: **bulk charge neutrality.**

Handled algebraically this quickly becomes tedious, since every concentration depends exponentially on the gap between a carrier's voltage and its standard state. On a $V_i$ diagram, though, the whole business reduces to a single motion: sliding the rigid $V^\circ_i$ ladder up or down until the net charge balances.

As a reminder, the ideal-dilute relation from the [solutions topic](../solutions/) can be rearranged to express a concentration in terms of that gap:

$$ c_i = c^\circ \exp\!\left(\frac{z_i F\,(V_i - V^\circ_i)}{RT}\right). $$

A carrier's concentration is fixed entirely by how far its $V_i$ floats away from its own rung on the ladder, or as we will see it here: where the $V^\circ_i$ moves relative to the fixed $V_i$.

## Neutrality sets the ladder

Suppose we fix a single carrier's voltage and then slide the ladder. Because only the gap $V_i - V^\circ_i$ enters the formula, moving the ladder down widens the gap and enriches a pinned cation, while moving it up depletes it; for an anion the directions reverse. Every mobile carrier responds to the slide this way at once, exponentially, each with the sign of its own charge.

This is exactly the handle that **bulk charge neutrality** needs. Away from interfaces, a conductor carries essentially no net charge, so

$$ \sum_i z_i F c_i + \rho_{\mathrm{bg}} = 0, $$

where $\rho_{\mathrm{bg}}$ is any fixed, immobile background charge. As the ladder slides down, every cation in this sum enriches and every anion depletes, so the net charge climbs monotonically and passes through zero at exactly one position. Once the $V_i$ are given, the ladder floats to precisely the offset that neutrality requires, and to no other.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/levels-cc-neutrality.njk" %}
{% figcaption %}

A multi-ion solution with three $V_i$ fixed, and some fixed negative background charge. **Top**: species voltage levels and the $V^\circ_i$ ladder. **Bottom**: the total charge density as a function of the $V^\circ_i$ ladder offset, crossing zero at the single neutral position. Sliding the ladder is how the system "finds" neutrality; the tick on the slider marks the neutral offset.

{% endfigcaption %}
</figure>

## Electrostatic mass action: a pair invariant

Neutrality moves the ladder around: dissolve something new, or change the background charge, and the ladder must slide to a new neutral offset, carrying every concentration with it. Certain combinations of concentration, however, come through untouched. Pin two carriers, a species $A$ ($V_{\mathrm{A}}$) and a species $B$ ($V_{\mathrm{B}}$), and let the ladder go wherever neutrality sends it: one particular combination of the two concentrations stays fixed. To find it, expand the pinned difference $V_A - V_B$ with the ideal-dilute relation:

$$ V_A - V_B = \left(V^\circ_A - V^\circ_B\right) + \frac{RT}{z_A F}\ln\frac{c_A}{c^\circ} - \frac{RT}{z_B F}\ln\frac{c_B}{c^\circ}. $$

The left side is pinned, and the rung spacing $V^\circ_A - V^\circ_B$ is a rigid property of the medium, blind to the ladder's offset. The two concentration terms are therefore left holding a constant between them, and exponentiating turns that into

$$ \left(\frac{c_A}{c^\circ}\right)^{1/z_A}\!\left(\frac{c_B}{c^\circ}\right)^{-1/z_B} = K, $$

with

$$ K = \exp\!\left(\frac{F\big[(V_A - V_B) - (V^\circ_A - V^\circ_B)\big]}{RT}\right). $$

$K$ depends only on the pinned difference $V_A - V_B$ and a material constant, and so it holds fixed no matter where the ladder happens to float. (More rigorously, activities can be used^[In a nonideal solution, replace each $c_i/c^\circ$ with the activity $a_i$. The left-hand combination $(a_A)^{1/z_A}(a_B)^{-1/z_B}$ is then a {% wiki "Activity coefficient#Ionic_solutions", "mean-activity" %}-type product, which is exactly the charge-balanced, ladder-independent quantity that remains measurable even when single-ion activities are not. In fact this ladder-shifting is exactly the source of the ion-activity ambiguity; see the [nonideality topic](../nonideal/).].)

This is a {% wiki "mass action law" %}, though with one important difference from its chemical namesake: nothing here is actually reacting.^[The concentrations do change as the ladder slides, so ions must be coming and going somewhere: to and from whatever reservoirs pin the $V_i$. Those exchanges may themselves be reactions (an ion plating onto an electrode, a salt precipitating out), but each ties a carrier to its own reservoir; nothing converts $A$ into $B$.] The two concentrations are tied together purely electrostatically, both responding to the same shift of the ladder. For a $+1$ cation paired with a $-1$ anion both exponents reduce to $+1$, and the law takes the familiar product form,

$$ c_A\, c_B = \text{const}, $$

so the cation can be enriched only at the anion's expense, and the reverse.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/levels-cc-massaction.njk" %}
{% figcaption %}
Two carriers pinned ($V_A$, $V_B$ fixed), with a slider for the $V^\circ_i$ ladder offset. As the ladder slides, $c_A$ and $c_B$ trade off against each other, but their mass-action product holds constant. Other ions are not shown; the slider stands in for whatever unseen charges the ladder is neutralizing.
{% endfigcaption %}
</figure>

Note the same combination holds just as well for two carriers of the same sign. Pairing $\mathrm{Na}^+$ with $\mathrm{Al}^{3+}$, for instance, gives $c_{\mathrm{Na}^+}\big/c_{\mathrm{Al}^{3+}}^{1/3} = \text{const}$. The fractional power^[In chemistry one usually clears the fractional exponents by raising the relation to the power $z_A z_B$, giving the tidy integer form $c_{\mathrm{Na}^+}^{3}\big/c_{\mathrm{Al}^{3+}} = \text{const}$. It is the same law; the fractional version is just the one written per unit of charge, which is the normalization the $V_i$ picture invites.] records that a slide of the ladder moves each log-concentration in proportion to $z_i$, three times as far for the $\mathrm{Al}^{3+}$ as for the $\mathrm{Na}^+$: the combination above is locked, yet the plain ratio between the two ions remains free to range widely.

This pair of tools, neutrality to place the ladder and the invariants that survive its motion, accounts for a whole family of effects that, in their conventional presentations, appear quite unrelated. Each is a disturbance to the neutrality balance, met by a shift of the ladder.

## Dopants

The simplest disturbance is a fixed charge that has no $V_i$ of its own, because it cannot move: the ionized donors ($N_{\mathrm{D}}^+$) and acceptors ($N_{\mathrm{A}}^-$) of a semiconductor, or the fixed charged groups built into an ion-exchange membrane. Such charges enter the balance only through $\rho_{\mathrm{bg}}$, and the ladder shifts until the mobile carriers compensate them: upward for $n$-type material, lifting the conduction edge toward the pinned rail, and downward for $p$-type, bringing the valence edge down to it. This is the doping story the [previous topic](../solidstate/) promised, now read directly as a question of where the ladder sits.

The semiconductor case is the same pair of statements in the physicist's notation. Electrons and holes are the two mobile carriers, and the recombination reaction $\mathrm{e}^- + \mathrm{h}^+ \rightleftharpoons \varnothing$ has just one job here: at equilibrium it pins the two rails together, $V_{\mathrm{e}^-} = V_{\mathrm{h}^+}$ (the Fermi level), leaving the band-edge ladder to float. With that difference pinned, the electrostatic law above locks the product,

$$ n_{\mathrm{e}}\, n_{\mathrm{h}} = K = n_i^2, $$

the squared intrinsic carrier density, a material constant set by the band gap and the band-edge densities. Neutrality then selects where the ladder rests,

$$ -e\, n_{\mathrm{e}} + e\, n_{\mathrm{h}} + \rho_{\mathrm{bg}} = 0, $$

with $\rho_{\mathrm{bg}}$ the ionized dopants ($+eN_{\mathrm{D}}^+$ for donors, $-eN_{\mathrm{A}}^-$ for acceptors). The two equations close the system just as before: mass action fixes the product, neutrality picks the offset, and together they place $n_{\mathrm{e}}$ and $n_{\mathrm{h}}$.

<figure class="demo-container" style="max-width: 320px">
{% include "esbd-diagrams/levels-cc-dopant.njk" %}
{% figcaption %}

The same solve in the physicist's notation. **Top**: the two carriers share a single pinned rail $V_{\mathrm{e}^-} = V_{\mathrm{h}^+}$ (the Fermi level), and it is the band-edge ladder $V^\circ_{\mathrm{e}^-}$, $V^\circ_{\mathrm{h}^+}$ that floats. **Bottom**: net charge versus ladder offset. This time the slider sets the fixed dopant charge $\rho_{\mathrm{bg}}$, not the offset: raising it lifts the $\rho$ curve bodily, sliding its zero-crossing (the neutral offset) to a new place, and the ladder follows. Donors ($\rho_{\mathrm{bg}} > 0$) drive it $n$-type, lifting the conduction edge toward the rail; acceptors do the reverse. (The two $V_i$ coincide, so the rail looks single, but neutrality is found the same way whether there is one mobile carrier or twenty.)

{% endfigcaption %}
</figure>

## The common-ion effect

The same reasoning recovers a classic result of solution chemistry. Consider a solution saturated with $\mathrm{AgCl}$, so that the solid pins the difference $V_{\mathrm{Ag}^+} - V_{\mathrm{Cl}^-}$ at its saturation value: a two-carrier mass-action constraint, with the product $c_{\mathrm{Ag}^+} c_{\mathrm{Cl}^-}$ locked at the solubility product. Now dissolve a little $\mathrm{KCl}$. The $\mathrm{K}^+$ has no salt of its own to pin it, and so it behaves as a pure positive disturbance to neutrality, a mobile dopant. The ladder shifts to restore the balance, and because the product is locked, that shift enriches $\mathrm{Cl}^-$ while depleting $\mathrm{Ag}^+$, which precipitates back onto the solid. (The solid serves as the reservoir that holds the $V_{\mathrm{Ag}^+} - V_{\mathrm{Cl}^-}$ gap rigid throughout.) The result is the textbook common-ion effect, in which added chloride suppresses the solubility of silver, and in the $V_i$ picture it appears directly as a shift of the ladder.

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-agcl-kcl-common-ion.njk" %}
{% figcaption %}
The common-ion effect in action. The solid pins the $V_{\mathrm{Ag}^+}$–$V_{\mathrm{Cl}^-}$ gap while added KCl supplies a mobile-dopant $\mathrm{K}^+$, shifting the whole ladder: chloride enriched, silver depleted, product locked (readouts below). The $V^\circ_{\mathrm{H}^+}$ rung rides along as a bystander to show the shift is shared by every rung. The checkbox runs the counter-experiment, dosing $\mathrm{AgNO_3}$ instead: the same ladder shift in reverse, now suppressing chloride.
{% endfigcaption %}
</figure>

## Trapped charge and the Donnan potential

If the disturbance is confined to one side of a membrane, the effect becomes spatial. Let a membrane pass the small mobile ions ($\mathrm{Na}^+$ and $\mathrm{Cl}^-$) while blocking a large polyion, say a protein $\mathrm{Pr}^-$, on the right. The mobile ions equilibrate across the membrane, so $V_{\mathrm{Na}^+}$ and $V_{\mathrm{Cl}^-}$ run perfectly flat through it. The trapped $\mathrm{Pr}^-$, however, is a background charge present on the right alone, and so the ladder must sit at a different offset on each side in order to keep both sides neutral. That step in the $V^\circ_i$ ladder across the membrane is the {% wiki "Gibbs–Donnan effect", "Donnan potential" %}. With the mobile $V_i$ flat and the ladder stepped, the concentrations step as well: the protein side is left richer in $\mathrm{Na}^+$ and poorer in $\mathrm{Cl}^-$, which is precisely Donnan exclusion.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/esbd-cc-donnan.njk" %}
{% figcaption %}
Gibbs–Donnan equilibrium. The mobile-ion traces $V_{\mathrm{Na}^+}$ and $V_{\mathrm{Cl}^-}$ run flat across the membrane; the $V^\circ_i$ ladder steps between the two sides to neutralize the trapped protein, and that step is the Donnan potential. A slider sets the blocked-protein concentration on the right. (Saline at $1\ \mathrm{mmol/L}$; the drawn rung spacing is compressed for display, but the gaps and the step are to scale.)
{% endfigcaption %}
</figure>

### A different solvent on each side

The Donnan step assumed one solvent throughout, so the ladder shifted as a rigid unit: every $V^\circ_i$ jumped by the single electrostatic step $\Delta\phi$. Let the two sides instead be genuinely different solvents, water against an immiscible organic phase such as nitrobenzene, and the construction barely changes, except that the ladder no longer steps rigidly. Each rung now jumps by its own amount: the shared electrostatic step plus an ion-specific solvation term, the standard Gibbs energy of transfer between the solvents. Where the Donnan ladder shifted rigidly, this one deforms.

Any ion free to cross still equilibrates to a flat $V_i$, just as the mobile ions did across the Donnan membrane, and pinning two such ions again leaves a charge-balanced combination independent of $\Delta\phi$, the same mass-action cancellation we saw above. Here that ladder-independent quantity is what an electrochemist calls the standard partition coefficient of the salt. The individual single-ion transfer energies, by contrast, are no more measurable than single-ion activities were, and for the same reason: they depend on the unknowable offset between the two ladders. This liquid–liquid interface is known as {% wiki "Interface between two immiscible electrolyte solutions", "ITIES" %}.

A semiconductor reader will recognize this deforming ladder: a junction between two different media is a heterojunction. There too each species' edge takes its own step at the contact (the conduction and valence band offsets differ), and no single potential step aligns the two sides. How such alignments get set, and what screening does with them, is where [basic electrostatics](../basicelectrostatics/) picks the story up.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/esbd-cc-ities.njk" %}
{% figcaption %}
A liquid–liquid interface (ITIES): water against an immiscible organic solvent. A shared ion runs flat across the boundary ($V_i$ continuous), but the two solvents' $V^\circ_i$ ladders step by a different amount for each ion, set by how each prefers one solvent over the other. The anatomy at the contact reads like a heterojunction: within each solvent the ladder is rigid, so the two rungs bend *together* through the double layer, while the species-specific part arrives as each rung's own sharp step right at the boundary. The salt's overall partition across the interface is fixed; how that partition splits between the individual ions is not. (Schematic, for a generic salt $\mathrm{C^+A^-}$ that prefers the water.)
{% endfigcaption %}
</figure>

## Takeaways

Everything in this topic comes down to a single motion: sliding the rigid $V^\circ_i$ ladder to the one offset at which the bulk is neutral. The pinned $V_i$ values and any fixed background charge together decide where that offset falls. Mass-action products emerge independent of the ladder, since the offset cancels, and dopants, the common-ion effect, and the Donnan potential turn out to be the same neutrality-restoring shift in three different guises. A boundary between two solvents generalizes the picture one step further, to a ladder that deforms as well as shifts.

The Donnan case, in which a fixed background charge on one side of a boundary forces a step in the ladder, has an exact counterpart in the solid state. The next topic sets the two side by side: the electrochemical bipolar membrane and its semiconductor twin, the pn junction.

[**NEXT TOPIC: Bipolar membranes and pn junctions**](../bipolar/)
