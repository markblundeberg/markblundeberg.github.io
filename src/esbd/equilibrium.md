---
layout: layouts/esbd_topic.njk
title: 'Equilibrium'
tags: [page, esbd_topic]
orderESBD: 11
---

# {{title}}

One of the key questions with these $V_i$ is how different species' $V_i$ values relate to each other. Charge cannot move between charged species without an accompanying chemical reaction taking place. As a result, we will see different species' $V_i$ connect with offsets depending on the nature of the reaction (and the nature of the neutral species in the reaction). We will quite commonly see equations like:

$$ V_i - V_j = \Delta, $$

where $\Delta$ is some nonzero offset (usually depending on neutral reactants or products). In the diagrams, we will mark equilibrium reactions with the symbol ⇌.

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-reaction-generic.njk" %}
</figure>

And of course, at equilibrium every species equilibrates with itself (which can be understood as a trivial reaction $ V_i - V_i = 0 $), and so we see $V_i$ being perfectly flat throughout each domain where the species $i$ can move freely.

A few classic examples below will demonstrate how this can appear.

> **Important technical note**: For these ESBDs, I adopt the common convention that $\mu=0$ for elements in their most stable form (such as $\mathrm{H_2}$, or $\mathrm{O_2}$, or $\mathrm{Zn}$ metal), at the usual reference conditions (25&nbsp;°C and 1 bar). This is convenient since it means tabulated Gibbs formation energies of neutral species (such as $\mathrm{H_2O}$) directly give their chemical potentials.

## Reactions

Consider the auto-ionization of water,

$$ \mathrm{H}^+ + \mathrm{OH}^- \rightleftharpoons \mathrm{H_2O}. $$

We can write the equilibrium in terms of the (electro-) chemical potentials:

$$ \bar\mu_{\mathrm{H}^+} + \bar\mu_{\mathrm{OH}^-} = \mu_{\mathrm{H_2O}}. $$

To translate this to $V_i$, we sub in our $\bar{\mu}_i = z_i F V_i$, to get:

$$ V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} = \frac{\mu_{\mathrm{H_2O}}}{F}. $$

Thus, auto-ionization in water directly sets up an offset between $V_{\mathrm{H}^+}$ and $V_{\mathrm{OH}^-}$.

<figure class="demo-container" style="max-width: 190px">
{% include "esbd-diagrams/esbd-h2o-autoionization.njk" %}
</figure>

How large is this offset? The chemical potential $\mu_{\mathrm{H_2O}}$ is the partial molar Gibbs energy for $\mathrm{H_2O}$. We can look up Gibbs *formation* energies for neutral chemicals like $\mathrm{H_2O}$ in chemical data tables, and for convenience, we adopt the chemical potential system that makes chemical potentials equal to Gibbs formation energies.

For pure water at standard conditions we know from chemical data tables that the Gibbs formation energy of $\mathrm{H_2O}$ is $-237.1~\mathrm{kJ/mol}$. This means for pure water we have $\mu_{\mathrm{H_2O}} = -237.1~\mathrm{kJ/mol}$, and as a reminder the Faraday constant is $F = 96.485~\mathrm{kJ/mol/V}$. Thus $\mu_{\mathrm{H_2O}}/F = -2.457~\mathrm{V}$. So,

$$ V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} = -2.457~\mathrm{V} $$

is the precise offset we draw in pure water. Note that $V_{\mathrm{H}^+}$ and $V_{\mathrm{OH}^-}$ are still free to move up and down (changing electrical state), but they have to keep this $2.457~\mathrm{V}$ constant spacing.

Similarly, we might consider a reaction for the dissociation of sodium chloride salt:
$$ V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = \frac{\mu_{\mathrm{NaCl}}}{F} . $$
If the solution is fully saturated with salt (meaning it is in equilibrium with solid salt), then we get $\mu_{\mathrm{NaCl}}/ F = -3.9813~\mathrm{V}$, so:

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-nacl-saturation.njk" %}
</figure>

This is an example of heterogeneous equilibrium (the salt is a separate solid phase), whereas the previous autoionization example is a form of homogeneous equilibrium. Note that this $3.9813~\mathrm{V}$ spacing from $\mathrm{NaCl}$ applies to any solvent, not just water; the only assumption we made was that of saturation.

(This still leaves a question: salt water has both $\mathrm{Na}^+$ and $\mathrm{H}^+$ ions. So, where does $V_{\mathrm{Na}^+}$ sit relative to $V_{\mathrm{H}^+}$? As we'll see in later topics, this difference is well-defined, but is going to depend on the solvent and on pH. Likewise for unsaturated salt water, we will see how $ V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ varies with concentration.)

## Electrodes

Electrodes are interfaces where electrons (in metal) and ions (in solution) meet and react. This is just another kind of reaction that follows the same patterns.

For example, consider a zinc metal electrode, which may dissolve into zinc ions, separating off *two* electrons per ion.

$$ \mathrm{Zn}^{2+} + 2\mathrm{e}^- \rightleftharpoons \mathrm{Zn} $$

which becomes:

$$ V_{\mathrm{Zn}^{2+}} - V_{\mathrm{e}^-} =  \frac{1}{2F} \mu_{\mathrm{Zn}} $$

Note there is a factor of $1/2$, a consequence of the two charges transferred per ion, but we still see a balanced $V_i - V_j$ on the left hand side. We will *always* see balanced differences like this (and never something like $V_i - 2V_j$), as a consequence of the reactions being charge-neutral overall.

Plotting the ESBD now,

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-zn-electrode.njk" %}
</figure>

It's a flat line with $V_{\mathrm{Zn}^{2+}} = V_{\mathrm{e}^-}$.

> **Note**: Don't mistake this flat connection as being required for equilibrium in general, as it's only an 'accidental' consequence of $\mu_{\mathrm{Zn}}$ being zero under our conditions and conventions. Similarly we would see $V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \mu_{\mathrm{M}}/(nF) = 0$ for *all* elemental electrodes of metal $M$. But if we change the temperature or pressure, or adopt a different chemical potential convention, then we would see $V_{\mathrm{M}^{n+}} \neq V_{\mathrm{e}^-}$ at equilibrium. 

Another classic example, used as a standard reference for electrochemical studies, is the silver chloride electrode:

> $\mathrm{Ag}$ metal | $\mathrm{AgCl}$ coating | Solution containing $\mathrm{Cl}^-$ ions

The characteristic and reversible reaction here is that (in effect) the $\mathrm{AgCl}$ can take an electron from the metal, and release a $\mathrm{Cl}^-$ ion. In the process this leaves behind some $\mathrm{Ag}$ that deposits on the metal (and the silver chloride is in fact porous, so this happens in direct contact). Let's write down that reaction:

$$ \mathrm{AgCl} + \mathrm{e}^- \rightleftharpoons \mathrm{Ag} + \mathrm{Cl}^-$$

which results:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} =  \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ). $$

Let's plot this on a band diagram once again:

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-ag-agcl-electrode.njk" %}
</figure>

Since we have $\mu_{\mathrm{Ag}} = 0~\mathrm{kJ/mol}$ and $\mu_{\mathrm{AgCl}} = -109.8~\mathrm{kJ/mol}$ we get:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} = +1.138~\mathrm{V}$$

By the way, don't confuse this with the [electrode potential](../e/) $E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$, which is approximately 0.2 V with this electrode.

## Implied levels and half-reactions

Electrons are not present as free constituents in a solution, however their thermodynamic availability (and $V_{\mathrm{e}^-}$) can be well defined in specific contexts, particularly with half-reactions.

* Some half-reactions are actually 'redox-active' in solution, and can swap electrons directly with other half-reactions. It's useful to plot their distinct $V_{\mathrm{e}^-}$ values to show disequilibrium. (→ [half-reactions](../half/))
* Some half-reactions like the AgCl reaction are only happening at electrodes. It is helpful to show the $V_{\mathrm{e}^-}$ that the solution "wants" especially when it is out of equilibrium with the electrode.

<figure class="demo-container" style="max-width: 340px">
{% include "esbd-diagrams/esbd-ag-agcl-implied.njk" %}
{% figcaption %}
The silver chloride electrode again, now with the reaction's implied $V_{\mathrm{e}^-}$ drawn in the solution (thick dashed). At zero bias the metal's electrons line up with it and we recover the earlier diagram. Move the bias and the metal's $V_{\mathrm{e}^-}$ departs, while the solution — its composition held fixed here — still "wants" the same level; the gap between the two is the disequilibrium available to drive the reaction.
{% endfigcaption %}
</figure>

In principle other species can have implied levels. For example $\mathrm{H}^-$ (hydride) ions are not present in solution, but half-reactions may exchange $\mathrm{H}^-$; we can draw $V_{\mathrm{H}^-}$ implied levels. Similarly, reactions may output $\mathrm{O}^{2-}$ into certain ceramic solid electrolytes (like YSZ) that can transport $\mathrm{O}^{2-}$.

## Three or more charged species

It can happen sometimes that a reaction involves more than just two $V_i$'s. For example, the case of a solution containing both ferrous ($\mathrm{Fe}^{2+}$) and ferric ($\mathrm{Fe}^{3+}$) ions, in equilibrium with an inert platinum electrode that provides electrons ($\mathrm{e}^-$):

$$ \mathrm{Fe}^{2+} \rightleftharpoons \mathrm{Fe}^{3+} + \mathrm{e}^{-} $$
$$ \bar\mu_{\mathrm{Fe}^{2+}} = \bar\mu_{\mathrm{Fe}^{3+}} + \bar\mu_{\mathrm{e}^{-}} $$
$$ 2 V_{\mathrm{Fe}^{2+}} = 3 V_{\mathrm{Fe}^{3+}} - V_{\mathrm{e}^-} $$

Note this can still be represented in terms of $V_i - V_j$ differences:
$$2 (V_{\mathrm{Fe}^{2+}} - V_{\mathrm{Fe}^{3+}}) = V_{\mathrm{Fe}^{3+}} - V_{\mathrm{e}^-}.$$

Such a reaction no longer sets a rigid gap, and now a degree of freedom remains:

<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-ferrous-ferric.njk" %}
</figure>

Much like we discussed with $ V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ earlier, the difference like $V_{\mathrm{Fe}^{2+}} - V_{\mathrm{Fe}^{3+}}$ relates to ion concentrations, but we will elaborate this later in a few topics.

Note that the $\mathrm{Fe}^{2+}$/$\mathrm{Fe}^{3+}$ combination acts as an in-solution redox couple: it can supply or remove electrons to other reactions, not just to inert metals. For this reason, I am plotting an implied $V_{\mathrm{e}^-}$ in solution, which corresponds to the notion that a redox-active solution can have a meaningful Fermi level.^[Reiss, H. (1985). [The Fermi level and the redox potential.](https://doi.org/10.1021/j100264a005) The Journal of Physical Chemistry, 89(18), 3783–3791.]^[Peljo, P., Villevieille, C., & Girault, H. H. (2025). [The redox aspects of lithium-ion batteries.](https://doi.org/10.1039/d4ee04560b) Energy &amp; Environmental Science, 18(4), 1658–1672.  ]

## Takeaways

The main point is that with reactions (including electrode reactions),
* We establish a difference $V_i - V_j$, connecting charged species $i$ and $j$.
* In the diagrams, we will mark these reactions with a ⇌ symbol.
* At electrodes we get a relative step up or down going from $V_{\mathrm{e}^-}$ to $V_{\mathrm{ion}}$. This step should not be confused with the electrode potential of standard electrochemistry.
* The quantitative value of that step at equilibrium depends on the chemical potentials of neutral species involved in the reaction.
* Our convention that chemical potentials are equal to Gibbs formation energy is a choice that influences the quantitative $V_i - V_j$ and in turn the visual appearance of our band diagrams. This is however a fairly universal choice.

Alright, we're ready now to tackle a real application!

[**NEXT TOPIC: Lithium-ion batteries**](../lib/)
