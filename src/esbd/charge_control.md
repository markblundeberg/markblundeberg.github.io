---
layout: layouts/esbd_topic.njk
title: 'Mass action and charge control'
tags: [page, esbd_topic]
orderESBD: 23
---

# {{title}}

So far we have played the game in one direction: given the concentrations, we read off the species voltages. Real problems usually run the other way around. Some of the voltages are pinned for us, whether by a contact, a reservoir, or a reaction with a solid phase, and what we are left to determine is where the standard-state ladder $V^\circ_i$ sits. Pinning the $V_i$ does not pin the ladder, and pinning the ladder does not pin the $V_i$; the two are tied together only through a constraint that we have so far set aside: **bulk charge neutrality.**

Handled algebraically this quickly becomes tedious, since every concentration depends exponentially on the gap between a carrier's voltage and its standard state. On a $V_i$ diagram, though, the whole business reduces to a single motion: sliding the rigid $V^\circ_i$ ladder up or down until the net charge balances.

The ideal-dilute relation from the [solutions topic](../solutions/) can be rearranged to express a concentration in terms of that gap:

$$ c_i = c^\circ \exp\!\left(\frac{z_i F\,(V_i - V^\circ_i)}{RT}\right). $$

A carrier's concentration is fixed entirely by how far its $V_i$ floats away from its own rung on the ladder.

## Pinning one carrier

Suppose we fix a single carrier's voltage and then slide the ladder. Because only the gap $V_i - V^\circ_i$ enters the formula, moving the ladder down toward a pinned cation ($z = +1$) widens that gap and enriches the carrier, while moving the ladder up narrows the gap and depletes it. A single pinned carrier, together with a definite ladder position, is therefore enough to fix that carrier's concentration. What remains is to find out what sets the ladder, and we return to that question shortly.

## Pinning two carriers: an electrostatic mass-action law

Now pin two carriers, a species $A$ and a species $B$, and again slide the ladder. Both concentrations shift, yet a particular combination of them does not budge. If we take the gap for each carrier, divide through by its charge, and subtract, the term $V^\circ_A - V^\circ_B$ appears; because the ladder is rigid, this difference is a fixed property of the medium, and it cancels:

$$
\begin{aligned}
\left(\frac{c_A}{c^\circ}\right)^{1/z_A}\!\left(\frac{c_B}{c^\circ}\right)^{-1/z_B} &= K, \\
K &= \exp\!\left(\frac{F\big[(V_A - V_B) - (V^\circ_A - V^\circ_B)\big]}{RT}\right).
\end{aligned}
$$

The ladder offset has dropped out completely, leaving $K$ a function only of the pinned difference $V_A - V_B$ and a material constant. It therefore holds fixed no matter where the ladder happens to float. (More rigorously, activities can be used^[In a nonideal solution, replace each $c_i/c^\circ$ with the activity $a_i$. The left-hand combination $(a_A)^{1/z_A}(a_B)^{-1/z_B}$ is then a {% wiki "Activity coefficient#Ionic_solutions", "mean-activity" %}-type product, which is exactly the charge-balanced, ladder-independent quantity that remains measurable even when single-ion activities are not. In fact this ladder-shifting is exactly the source of the ion-activity ambiguity; see the [nonideality topic](../nonideal/).].)

This is a {% wiki "mass action law" %}, though with one important difference from its chemical namesake: nothing here is actually reacting. The relation simply compares two electrostatic states. For a $+1$ cation paired with a $-1$ anion both exponents reduce to $+1$, and the law takes the familiar product form,

$$ c_A\, c_B = \text{const}, $$

so the cation can be enriched only at the anion's expense, and the reverse.

Note the same combination holds just as well for two carriers of the same sign. Pairing $\mathrm{Na}^+$ with $\mathrm{Al}^{3+}$, for instance, gives $c_{\mathrm{Na}^+}\big/c_{\mathrm{Al}^{3+}}^{1/3} = \text{const}$. The fractional power^[In chemistry one usually clears the fractional exponents by raising the relation to the power $z_A z_B$, giving the tidy integer form $c_{\mathrm{Na}^+}^{3}\big/c_{\mathrm{Al}^{3+}} = \text{const}$. It is the same law; the fractional version is just the one written per unit of charge, which is the normalization the $V_i$ picture invites.] means that as the ladder slides, the trivalent $\mathrm{Al}^{3+}$ must swing three times as hard in its log-concentration as the $\mathrm{Na}^+$, which means the ratio between the two ions can vary greatly.

<figure class="diagram-placeholder">
{% figcaption %}
Two carriers pinned ($V_A$, $V_B$ fixed), with a slider for the $V^\circ_i$ ladder offset. As the ladder slides, $c_A$ and $c_B$ trade off against each other, but their mass-action product holds constant. Other ions are not shown.
{% endfigcaption %}
</figure>

## What fixes the ladder? Neutrality

The mass-action law tells us what remains invariant as the ladder slides, but it does not tell us where the ladder finally comes to rest. That position is set by **bulk charge neutrality**. Away from interfaces, a conductor carries essentially no net charge, so

$$ \sum_i z_i F c_i + \rho_{\mathrm{bg}} = 0, $$

where $\rho_{\mathrm{bg}}$ is any fixed, immobile background charge. Each mobile $c_i$ in this sum is an exponential function of the ladder offset, so as the ladder slides the net charge passes monotonically through zero at exactly one position. Once the $V_i$ are given, the ladder floats to precisely the offset that neutrality requires, and to no other.

<figure class="diagram-placeholder">
{% figcaption %}
Top: a multi-ion solution with all $V_i$ fixed. Bottom: the total free charge density as a function of the $V^\circ_i$ ladder offset, crossing zero at the single neutral position. Sliding the ladder is how the system "finds" neutrality.
{% endfigcaption %}
</figure>

This one principle accounts for a whole family of effects that, in their conventional presentations, appear quite unrelated. Each is simply a disturbance to the neutrality balance, met by a shift of the ladder.

## Dopants

The simplest disturbance is a fixed charge that has no $V_i$ of its own, because it cannot move: the ionized donors ($N_{\mathrm{D}}^+$) and acceptors ($N_{\mathrm{A}}^-$) of a semiconductor, or the fixed charged groups built into an ion-exchange membrane. Such charges enter the balance only through $\rho_{\mathrm{bg}}$, and the ladder shifts until the mobile carriers compensate them: downward toward the conduction edge for $n$-type material, upward toward the valence edge for $p$-type. This is exactly the doping story from the [previous topic](../solidstate/), now read directly as a question of where the ladder sits.

## The common-ion effect

The same reasoning recovers a classic result of solution chemistry. Consider a solution saturated with $\mathrm{AgCl}$, so that the solid pins the difference $V_{\mathrm{Ag}^+} - V_{\mathrm{Cl}^-}$ at its saturation value: a two-carrier mass-action constraint, with the product $c_{\mathrm{Ag}^+} c_{\mathrm{Cl}^-}$ locked at the solubility product. Now dissolve a little $\mathrm{KCl}$. The $\mathrm{K}^+$ has no salt of its own to pin it, and so it behaves as a pure positive disturbance to neutrality, a mobile dopant. The ladder shifts to restore the balance, and because the product is locked, that shift enriches $\mathrm{Cl}^-$ while depleting $\mathrm{Ag}^+$, which precipitates back onto the solid. (The solid serves as the reservoir that holds the $V_{\mathrm{Ag}^+} - V_{\mathrm{Cl}^-}$ gap rigid throughout.) The result is the textbook common-ion effect, in which added chloride suppresses the solubility of silver, and in the $V_i$ picture it appears directly as a shift of the ladder.

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-agcl-kcl-common-ion.njk" %}
</figure>

## Spectator ions and the Donnan potential

If the disturbance is confined to one side of a membrane, the effect becomes spatial. Let a membrane pass the small mobile ions ($\mathrm{Na}^+$ and $\mathrm{Cl}^-$) while blocking a large polyion, say a protein $\mathrm{Pr}^-$, on the right. The mobile ions equilibrate across the membrane, so $V_{\mathrm{Na}^+}$ and $V_{\mathrm{Cl}^-}$ run perfectly flat through it. The trapped $\mathrm{Pr}^-$, however, is a background charge present on the right alone, and so the ladder must sit at a different offset on each side in order to keep both sides neutral. That step in the $V^\circ_i$ ladder across the membrane is the {% wiki "Gibbs–Donnan effect", "Donnan potential" %}. With the mobile $V_i$ flat and the ladder stepped, the concentrations step as well: the protein side is left richer in $\mathrm{Na}^+$ and poorer in $\mathrm{Cl}^-$, which is precisely Donnan exclusion.

<figure class="diagram-placeholder">
{% figcaption %}
Gibbs–Donnan equilibrium. The mobile-ion traces $V_{\mathrm{Na}^+}$ and $V_{\mathrm{Cl}^-}$ run flat across the membrane; the $V^\circ_i$ ladder steps between the two sides to neutralize the trapped protein, and that step is the Donnan potential. A slider sets the blocked-protein concentration on the right.
{% endfigcaption %}
</figure>

## A different solvent on each side

The Donnan step assumed one solvent throughout, so the ladder shifted as a rigid unit: every $V^\circ_i$ jumped by the single electrostatic step $\Delta\phi$. Let the two sides instead be genuinely different solvents, water against an immiscible organic phase such as nitrobenzene, and the construction barely changes, except that the ladder no longer steps rigidly. Each rung now jumps by its own amount: the shared electrostatic step plus an ion-specific solvation term, the standard Gibbs energy of transfer between the solvents. Where the Donnan ladder shifted rigidly, this one deforms.

Any ion free to cross still equilibrates to a flat $V_i$, just as the mobile ions did across the Donnan membrane, and pinning two such ions again leaves a charge-balanced combination independent of $\Delta\phi$, the same mass-action cancellation we saw above. Here that ladder-independent quantity is what an electrochemist calls the standard partition coefficient of the salt. The individual single-ion transfer energies, by contrast, are no more measurable than single-ion activities were, and for the same reason: they depend on the unknowable offset between the two ladders. This liquid–liquid interface is known as {% wiki "Interface between two immiscible electrolyte solutions", "ITIES" %}.

<figure class="diagram-placeholder">
{% figcaption %}
A liquid–liquid interface (ITIES): water against an immiscible organic solvent. A shared ion runs flat across the boundary ($V_i$ continuous), but the two solvents' $V^\circ_i$ ladders step by a different amount for each ion, set by how each prefers one solvent over the other. The salt's overall partition across the interface is fixed; how that partition splits between the individual ions is not.
{% endfigcaption %}
</figure>

## Takeaways

Everything in this topic comes down to a single motion: sliding the rigid $V^\circ_i$ ladder to the one offset at which the bulk is neutral. The pinned $V_i$ values and any fixed background charge together decide where that offset falls. Mass-action products emerge independent of the ladder, since the offset cancels, and dopants, the common-ion effect, and the Donnan potential turn out to be the same neutrality-restoring shift in three different guises.

The Donnan case, in which a fixed background charge on one side of a boundary forces a step in the ladder, has an exact counterpart in the solid state. The next topic sets the two side by side: the electrochemical bipolar membrane and its semiconductor twin, the pn junction.

[**NEXT TOPIC: Bipolar membranes and pn junctions**](../bipolar/)
