---
layout: layouts/esbd_topic.njk
title: 'Equilibrium'
tags: [page, esbd_topic]
orderESBD: 11
---

# {{title}}

One of the key questions with these $V_i$ is how different species' $V_i$ values relate to each other. Charge cannot move between charged species without a chemical reaction taking place, where we count even the humblest identity change, like electron-hole recombination, as a reaction. As a result, we will see different species' $V_i$ connect with offsets depending on the nature of the reaction (and of the neutral species involved). We will quite commonly see equations like:

$$ V_i - V_j = \Delta, $$

where $\Delta$ is some nonzero offset (usually depending on neutral reactants or products). In the diagrams, we will mark equilibrium reactions with the symbol ⇌.

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-reaction-generic.njk" %}
</figure>

And of course, at equilibrium every species equilibrates with itself, and so we see $V_i$ being perfectly flat throughout each domain where the species $i$ can move freely.

A few classic examples below will demonstrate how this can appear.

> **Chemical potential convention**: For these ESBDs, I adopt the common convention that $\mu=0$ for elements in their most stable form (such as $\mathrm{H_2}$, or $\mathrm{O_2}$, or $\mathrm{Zn}$ metal), at the usual reference conditions (25&nbsp;°C and 1 bar). This is convenient since it means tabulated Gibbs formation energies of neutral species (such as $\mathrm{H_2O}$) directly give their chemical potentials. This convention is a free bookkeeping choice, not a physical input: adopting a different one slides the $V_i - V_j$ offsets around but moves nothing measurable, as [Offsets galore](../offsetsgalore/) makes concrete.

## Reactions

Consider the autoionization of water,

$$ \mathrm{H}^+ + \mathrm{OH}^- \rightleftharpoons \mathrm{H_2O}. $$

We can write the equilibrium in terms of the (electro-) chemical potentials:^[The direct translation of reaction to $\mu$ equation might seem to jump out of nowhere, but (electro)-chemical potentials are defined as partial molar free energy, so this kind of equilibrium equation falls out naturally. This is one of the pleasing fundamentals of chemical potentials that makes them nice to work with. See e.g. Newman & Balsara (2021), *Electrochemical Systems*, or Baierlein's ["The elusive chemical potential"](https://doi.org/10.1119/1.1336839) (Am. J. Phys. 69, 423 (2001)).]

$$ \bar\mu_{\mathrm{H}^+} + \bar\mu_{\mathrm{OH}^-} = \mu_{\mathrm{H_2O}}. $$

To translate this to $V_i$, we sub in our $\bar{\mu}_i = z_i F V_i$, to get:

$$ V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} = \frac{\mu_{\mathrm{H_2O}}}{F}. $$

Thus, autoionization in water directly sets up an offset between $V_{\mathrm{H}^+}$ and $V_{\mathrm{OH}^-}$.

<figure class="demo-container" style="max-width: 190px">
{% include "esbd-diagrams/esbd-h2o-autoionization.njk" %}
</figure>

How large is this offset? The chemical potential $\mu_{\mathrm{H_2O}}$ is the partial molar Gibbs energy of $\mathrm{H_2O}$, and by the convention noted above, the tabulated Gibbs *formation* energies of neutral chemicals directly give their chemical potentials. For pure water at standard conditions the tables give $\mu_{\mathrm{H_2O}} = -237.1~\mathrm{kJ/mol}$; dividing by the Faraday constant, $F = 96.485~\mathrm{kJ/mol/V}$, we get $\mu_{\mathrm{H_2O}}/F = -2.457~\mathrm{V}$. So,

$$ V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} = -2.457~\mathrm{V} $$

is the precise offset we draw in pure water. Note that $V_{\mathrm{H}^+}$ and $V_{\mathrm{OH}^-}$ are still free to move up and down (changing electrical state), but they have to keep this $2.457~\mathrm{V}$ constant spacing.

Similarly, we might consider a reaction for the dissociation of sodium chloride salt:
$$ V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = \frac{\mu_{\mathrm{NaCl}}}{F} . $$
If the solution is fully saturated with salt (meaning it is in equilibrium with solid salt), then we get $\mu_{\mathrm{NaCl}}/ F = -3.981~\mathrm{V}$, so:

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-nacl-saturation.njk" %}
</figure>

This is an example of heterogeneous equilibrium (the salt is a separate solid phase), whereas the previous autoionization example is a form of homogeneous equilibrium. Note that this $3.981~\mathrm{V}$ spacing from $\mathrm{NaCl}$ applies to any solvent, not just water; the only assumption we made was that of saturation.

(This still leaves a question: salt water has all four ions depicted above: $\mathrm{H}^+$, $\mathrm{OH}^-$, $\mathrm{Na}^+$, and $\mathrm{Cl}^-$. So how do the two figures combine — where does $V_{\mathrm{Na}^+}$ sit relative to $V_{\mathrm{H}^+}$ in salt water? As we'll see in [Solutions](../solutions/), the alignment of these two pairs would depend on further information, like the solution pH; we can also get to an answer by including more dissociation equilibria.^[Saturate the same solution with NaOH solid as well, so that NaCl pins $\mathrm{Na}^+$–$\mathrm{Cl}^-$, NaOH pins $\mathrm{Na}^+$–$\mathrm{OH}^-$, and autoionization pins $\mathrm{H}^+$–$\mathrm{OH}^-$. A strange brew, mind: the common-ion effect crowds nearly all the $\mathrm{Cl}^-$ out of solution. The water chemical potential also gets significantly reduced in this concentrated NaOH solution (at a hygroscopic activity of $a_{\mathrm{H_2O}} \approx 0.07$), so the $\mathrm{H}^+$–$\mathrm{OH}^-$ spacing itself reduces by about 70 mV ($\frac{RT}{F}\ln a_{\mathrm{H_2O}}$) from the pure-water figure above. The chloralkali industry sells nearly this exact brew as diaphragm-grade caustic soda: NaCl-saturated 50% caustic, the salt crowded out in the evaporators by the very common-ion effect just described.] Likewise for unsaturated salt water, we will see how $ V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ varies with concentration.)

## Three or more charged species

It can happen sometimes that a reaction involves more than just two $V_i$'s. Consider the precipitation of struvite ($\mathrm{MgNH_4PO_4}\cdot 6\mathrm{H_2O}$), a mineral familiar from kidney stones and from phosphorus recovery at wastewater plants:

$$ \mathrm{Mg}^{2+} + \mathrm{NH_4}^+ + \mathrm{PO_4}^{3-} + 6\,\mathrm{H_2O} \rightleftharpoons \mathrm{MgNH_4PO_4}\cdot 6\mathrm{H_2O}. $$

Writing the equilibrium in chemical potentials and substituting $\bar{\mu}_i = z_i F V_i$ as before:

$$ \bar\mu_{\mathrm{Mg}^{2+}} + \bar\mu_{\mathrm{NH_4}^+} + \bar\mu_{\mathrm{PO_4}^{3-}} = \mu_{\mathrm{struvite}} - 6 \mu_{\mathrm{H_2O}} $$

$$ 2 V_{\mathrm{Mg}^{2+}} + V_{\mathrm{NH_4}^+} - 3 V_{\mathrm{PO_4}^{3-}} = \frac{\mu_{\mathrm{struvite}} - 6 \mu_{\mathrm{H_2O}}}{F}. $$

The coefficients on the left are just the ionic charges. Notice they sum to zero, and this is no accident of struvite: every reaction equation must be charge-neutral overall, so the $V_i$ combination it pins will always balance in this way (we will never meet something like $V_i - 2V_j$). The combination can accordingly still be grouped into balanced differences, say $2(V_{\mathrm{Mg}^{2+}} - V_{\mathrm{PO_4}^{3-}}) + (V_{\mathrm{NH_4}^+} - V_{\mathrm{PO_4}^{3-}})$. But one equation cannot pin two independent gaps: unlike the two-species equilibria above, saturation with struvite fixes only this weighted sum, and a degree of freedom remains:

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-struvite.njk" %}
{% figcaption %}
A solution saturated with struvite. The reaction holds $2 V_{\mathrm{Mg}^{2+}} + V_{\mathrm{NH_4}^+} - 3 V_{\mathrm{PO_4}^{3-}}$ fixed while the individual gaps trade off against each other. Note the lever arms as the slider moves the levels: $V_{\mathrm{NH_4}^+}$ swings twice as far as $V_{\mathrm{Mg}^{2+}}$, because the doubly charged ion carries double weight in the pinned sum. (The stacking order is realistic but the axis is qualitative; the true spacings span several volts, which would dwarf the slider's motion.)
{% endfigcaption %}
</figure>

Much like the $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ spacing earlier, how the levels settle within this remaining freedom is a matter of ion concentrations, a story that comes a few topics later.

## Electrodes

Electrodes are interfaces where electrons (in metal) and ions (in solution) meet and react. This is just another kind of reaction that follows the same patterns.

For example, consider a zinc metal electrode, which may dissolve into zinc ions, separating off *two* electrons per ion.

$$ \mathrm{Zn}^{2+} + 2\mathrm{e}^- \rightleftharpoons \mathrm{Zn} $$

which becomes:

$$ V_{\mathrm{Zn}^{2+}} - V_{\mathrm{e}^-} =  \frac{1}{2F} \mu_{\mathrm{Zn}} $$

Note there is a factor of $1/2$, a consequence of the two charges transferred per ion, but we still see a balanced $V_i - V_j$ on the left hand side: charge neutrality of the reaction guarantees it, just as with struvite above.

Plotting the ESBD now,

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-zn-electrode.njk" %}
</figure>

It's a flat line with $V_{\mathrm{Zn}^{2+}} = V_{\mathrm{e}^-}$.

> **Note**: Don't mistake this flat connection for a requirement of equilibrium in general; it's only an 'accidental' consequence of $\mu_{\mathrm{Zn}}$ being zero under our conditions and conventions. Similarly we would see $V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \mu_{\mathrm{M}}/(nF) = 0$ for *all* elemental electrodes of metal $M$. But if we change the temperature or pressure, or adopt a different chemical potential convention, then we would see $V_{\mathrm{M}^{n+}} \neq V_{\mathrm{e}^-}$ at equilibrium. 

Another classic example, used as a standard reference for electrochemical studies, is the silver chloride electrode:

> $\mathrm{Ag}$ metal | $\mathrm{AgCl}$ coating | Solution containing $\mathrm{Cl}^-$ ions

The characteristic and reversible reaction here is that (in effect) the $\mathrm{AgCl}$ can take an electron from the metal and release a $\mathrm{Cl}^-$ ion into the solution, leaving behind fresh $\mathrm{Ag}$ that deposits onto the metal. (The coating is porous, so the solution soaks through it; metal, coating, and solution all meet, and the reaction runs where the three phases touch.) Let's write down that reaction:

$$ \mathrm{AgCl} + \mathrm{e}^- \rightleftharpoons \mathrm{Ag} + \mathrm{Cl}^-$$

which gives:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} =  \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ). $$

Let's plot this on a band diagram once again:

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-ag-agcl-electrode.njk" %}
</figure>

Since we have $\mu_{\mathrm{Ag}} = 0~\mathrm{kJ/mol}$ and $\mu_{\mathrm{AgCl}} = -109.8~\mathrm{kJ/mol}$ we get:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} = +1.138~\mathrm{V}$$

By the way, don't confuse this with the [electrode potential](../e/) $E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$, which is approximately 0.2 V with this electrode.

## Implied levels and half-reactions

Electrons are not present as free constituents in a solution; however, their thermodynamic availability (and $V_{\mathrm{e}^-}$) can be well defined in specific contexts, particularly with half-reactions.

* Some half-reactions are actually 'redox-active' in solution, and can swap electrons directly with other half-reactions. It's useful to plot their distinct $V_{\mathrm{e}^-}$ values to show disequilibrium. (An iron-ion example follows below.)
* Some half-reactions like the AgCl reaction only happen at electrodes. It can still be useful to show the $V_{\mathrm{e}^-}$ that the solution "wants", especially when it is out of equilibrium with the electrode; the disequilibrium is then directly readable as an *overpotential*:

<figure class="demo-container" style="max-width: 340px">
{% include "esbd-diagrams/esbd-ag-agcl-implied.njk" %}
{% figcaption %}
The silver chloride electrode again, now with the reaction's implied $V_{\mathrm{e}^-}$ drawn as a dashed stub anchored at the interface. At zero bias the metal's electrons line up with it and we recover the earlier diagram. Move the bias and the metal's $V_{\mathrm{e}^-}$ departs, while the solution (its composition held fixed here) still "wants" the same level; the gap between the two is the overpotential, the disequilibrium available to drive the reaction.
{% endfigcaption %}
</figure>

One remark on notation: the ⇌ marker stays in the biased figure, even though electrode and solution are plainly out of equilibrium. The marker belongs to the half-reaction, which still holds, pinning its implied level to $V_{\mathrm{Cl}^-}$ at the reaction's fixed offset; a half-reaction drawn this way amounts to a half-equilibrium. The disequilibrium lives entirely in the remaining gap between the implied level and the metal's actual $V_{\mathrm{e}^-}$.

For the redox-active case, consider a solution containing both ferrous ($\mathrm{Fe}^{2+}$) and ferric ($\mathrm{Fe}^{3+}$) ions, in equilibrium with an inert platinum electrode that provides electrons ($\mathrm{e}^-$):

$$ \mathrm{Fe}^{2+} \rightleftharpoons \mathrm{Fe}^{3+} + \mathrm{e}^{-} $$
$$ \bar\mu_{\mathrm{Fe}^{2+}} = \bar\mu_{\mathrm{Fe}^{3+}} + \bar\mu_{\mathrm{e}^{-}} $$
$$ V_{\mathrm{e}^-} = 3 V_{\mathrm{Fe}^{3+}} - 2 V_{\mathrm{Fe}^{2+}} $$

This is another reaction with three charged species, so no rigid pairwise gap is set; where the couple's $V_{\mathrm{e}^-}$ sits depends on both iron concentrations.

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-ferrous-ferric.njk" %}
{% figcaption %}
Note the ⇌ marker stands in the open solution: this half-reaction is homogeneous, available everywhere in the bulk, unlike the interface-bound electrode reactions above.
{% endfigcaption %}
</figure>

Note that the $\mathrm{Fe}^{2+}$/$\mathrm{Fe}^{3+}$ combination acts as an in-solution redox couple: it can exchange electrons with other reactions as well as with inert metals. For this reason, the implied $V_{\mathrm{e}^-}$ now earns a line across the whole solution (in contrast to the interface-bound stub of the AgCl example), corresponding to the notion that a redox-active solution can have a meaningful Fermi level.^[Reiss, H. (1985). [The Fermi level and the redox potential.](https://doi.org/10.1021/j100264a005) The Journal of Physical Chemistry, 89(18), 3783–3791 (no relation to the Riess cited elsewhere in this book). See also Peljo, P., Villevieille, C., & Girault, H. H. (2025). [The redox aspects of lithium-ion batteries.](https://doi.org/10.1039/d4ee04560b) Energy &amp; Environmental Science, 18(4), 1658–1672.]

In principle other species can have implied levels. For example $\mathrm{H}^-$ (hydride) ions are not present in solution, but half-reactions may exchange $\mathrm{H}^-$; we can draw $V_{\mathrm{H}^-}$ implied levels. Similarly, reactions may output $\mathrm{O}^{2-}$ into certain ceramic solid electrolytes (like YSZ) that can transport $\mathrm{O}^{2-}$.

(For the next several topics we won't be talking about these implied levels much, but we will return to them later in the redox topics, starting with [Half-reactions](../half/).)

## Takeaways

The main point is that with reactions (including electrode reactions),
* We establish a difference $V_i - V_j$, connecting charged species $i$ and $j$.
* In the diagrams, we will mark these reactions with a ⇌ symbol.
* When a reaction involves three or more charged species, it no longer sets a rigid gap; a concentration-dependent degree of freedom remains.
* At electrodes we get a relative step up or down going from $V_{\mathrm{e}^-}$ to $V_{\mathrm{ion}}$. This step should not be confused with the electrode potential of standard electrochemistry.
* The quantitative value of that step at equilibrium depends on the chemical potentials of neutral species involved in the reaction.
* A reaction can also *imply* a level for a species that is not actually present, drawn dashed: as a stub at the interface for an interface-bound reaction, or across the whole solution for a bulk redox couple.
* Our convention that chemical potentials equal Gibbs formation energies influences the quantitative $V_i - V_j$, and in turn the visual appearance of our band diagrams; happily, this particular choice is nearly universal.

Alright, we're ready now to tackle a real application!

[**NEXT TOPIC: Lithium-ion batteries**](../lib/)
