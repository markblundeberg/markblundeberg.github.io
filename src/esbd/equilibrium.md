---
layout: layouts/esbd_topic.njk
title: 'Equilibrium'
tags: [page, esbd_topic]
orderESBD: 11
eleventyNavigation:
    key: Equilibrium
    parent: ESBD
    order: 11
---

# {{title}}

One of the key questions with these $V_i$ is how different species' $V_i$ values relate to each other. Charge cannot move between charged species without an accompanying chemical reaction taking place. As a result, we will see different species' $V_i$ connect with offsets depending on the nature of the reaction (and the nature of the neutral species in the reaction). We will quite commonly see equations like:

$$ V_i - V_j = \Delta, $$

where $\Delta$ is some nonzero offset (usually depending on neutral reactants or products). In the diagrams, we will show a symbol with the marker ⇌ to indicate an equlibrium reaction.

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

{% include "esbd-diagrams/esbd-h2o-autoionization.html" %}

How large is this offset? The chemical potential $\mu_{\mathrm{H_2O}}$ is the partial molar Gibbs energy for $\mathrm{H_2O}$. We can look up Gibbs *formation* energy energies for neutral chemicals like $\mathrm{H_2O}$ in chemical data tables, and for convenience, we adopt the chemical potential system that makes chemical potentials equal to Gibbs formation energies.

For pure water at standard conditions we know from chemical data tables that the Gibbs formation energy of $\mathrm{H_2O}$ is $-237.1~\mathrm{kJ/mol}$. This means for pure water we have $\mu_{\mathrm{H_2O}} = -237.1~\mathrm{kJ/mol}$, and thus $\mu_{\mathrm{H_2O}}/F = -2.457~\mathrm{V}$. So,

$$ V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} = -2.457~\mathrm{V} $$

is the precise offset we draw in pure water. Note that $V_{\mathrm{H}^+}$ and $V_{\mathrm{OH}^-}$ are still free to move up and down (changing electrical state), but they have to keep this $2.457~\mathrm{V}$ constant spacing.

Similarly, we might consider a reaction for the dissociation of sodium chloride salt:
$$ V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = \frac{\mu_{\mathrm{NaCl}}}{F} . $$
If the solution is fully saturated with salt (meaning it is in equilibrium with solid salt), then we get $\mu_{\mathrm{NaCl}}/ F = -3.9813~\mathrm{V}$, so:

{% include "esbd-diagrams/esbd-nacl-saturation.html" %}

This is an example of heterogeneous equilibrium (the salt is a separate solid phase), whereas the previous autoionization example is a form of homogeneous equilibrium. Note that this $3.9813~\mathrm{V}$ spacing from $\mathrm{NaCl}$ applies to any solvent, not just water; the only assumption we made was that of saturation.

(This still leaves a question: where does $V_{\mathrm{Na}^+}$ sit relative to $V_{\mathrm{H}^+}$? As we'll see in later topics, this difference is well-defined, but is going to depend on the solvent and on pH!)

## Electrodes

Electrodes are interfaces where electrons (in metal) and ions (in solution) meet and react. In ordinary electrochemistry, the electrons are given special status, but with these $V_i$ diagrams we see they are no more complicated than the preceding ionic reactions. The only minor difference is that now the two charged reactants live in different materials.

For example, consider a zinc metal electrode, which may dissolve into zinc ions, separating off *two* electrons per ion.

$$ \mathrm{Zn}^{2+} + 2\mathrm{e}^- \rightleftharpoons \mathrm{Zn} $$

which becomes:

$$ V_{\mathrm{Zn}^{2+}} - V_{\mathrm{e}^-} =  \frac{1}{2F} \mu_{\mathrm{Zn}} $$

Note there is a factor of $1/2$, a consequence of the double charged nature of the reaction, but we still see a balanced $V_i - V_j$ on the left hand side. We will *always* see balanced differences like this (and never something like $V_i - 2V_j$), as a consequence of the reactions being charge-neutral overall.

Plotting the ESBD now,

{% include "esbd-diagrams/esbd-zn-electrode.html" %}

It's a flat line with $V_{\mathrm{Zn}^{2+}} = V_{\mathrm{e}^-}$.

> **Note**: Don't mistake this flat connection as being required for equilibrium in general, as it's only an 'accidental' consequence of $\mu_{\mathrm{Zn}}$ being zero under our conditions and conventions. Similarly we would see $V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \mu_{\mathrm{M}}/(nF) = 0$ for *all* elemental electrodes of metal $M$. But if we change the temperature or pressure, or adopt a different chemical potential convention, then we would see $V_{\mathrm{M}^{n+}} \neq V_{\mathrm{e}^-}$ at equilibrium. 

Another classic example, used as a standard reference for electrochemical studies, is the silver chloride electrode:

> $\mathrm{Ag}$ metal | $\mathrm{AgCl}$ coating | Solution containing $\mathrm{Cl}^-$ ions

The characteristic and reversible reaction here is that (in effect) the $\mathrm{AgCl}$ can take an electron from the metal, and release a $\mathrm{Cl}^-$ ion. In the process this leaves behind some $\mathrm{Ag}$ that deposits on the metal (and the silver chloride is in fact porous, so this happens in direct contact). Let's write down that reaction:

$$ \mathrm{AgCl} + \mathrm{e}^- \rightleftharpoons \mathrm{Ag} + \mathrm{Cl}^-$$

which results:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} =  \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ). $$

Let's plot this on a band diagram once again:

{% include "esbd-diagrams/esbd-ag-agcl-electrode.html" %}

Since we have $\mu_{\mathrm{Ag}} = 0~\mathrm{kJ/mol}$ and $\mu_{\mathrm{AgCl}} = -109.8~\mathrm{kJ/mol}$ we get:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} = +1.138~\mathrm{V}$$

By the way, don't confuse this with the electrode potential $E = V_{\mathrm{e}^-} - V_{\mathrm{SHE}}$, which is approximately 0.2 V with this electrode.

## Three or more charged species

It can happen sometimes that a reaction involves more than just two $V_i$'s. For example, the case of a solution containing both ferrous ($\mathrm{Fe}^{2+}$) and ferric ($\mathrm{Fe}^{3+}$) ions, in equilibrium with an inert platinum electrode:

$$ \bar\mu_{\mathrm{Fe}^{2+}} \rightleftharpoons \bar\mu_{\mathrm{Fe}^{3+}} + \bar\mu_{\mathrm{e}^{-}} $$
$$ 2 V_{\mathrm{Fe}^{2+}} = 3 V_{\mathrm{Fe}^{3+}} - V_{\mathrm{e}^-} $$

Such a reaction no longer sets a rigid gap, and now a degree of freedom remains:

> DIAGRAM - include slider for extra DoF.

Note that charge neutrality still holds, so this can still be represented in terms of $V_i - V_j$ differences, e.g., $2 (V_{\mathrm{Fe}^{2+}} - V_{\mathrm{Fe}^{3+}}) = V_{\mathrm{Fe}^{3+}} - V_{\mathrm{e}^-}$.

 - manganous / permanganate?

## Takeaways

The main point is that reactions and electrodes,
* We establish a difference $V_i - V_j$, connecting charged species $i$ and $j$.
* In the diagrams, we will mark these reactions with a ⇌ symbol.
* At electrodes we get a relative step up or down going from $V_{\mathrm{e}^-}$ to $V_{\mathrm{ion}}$. This step should not be confused with the electrode potential of standard electrochemistry.
* The quantitative value of that step at equilibrium depends on the chemical potentials of neutral species involved in the reaction.
* Our convention that chemical potentials are equal to Gibbs formation energy is a choice that influences the quantitative $V_i - V_j$ and in turn the visual appearance of our band diagrams. This is however a fairly universal choice.

Alright, we're ready now to tackle a real application!

[**NEXT TOPIC: Lithium-ion batteries**](../lib/)

{#
## Optional discussion

For the keen, it's worth noting that the silver metal in the $\mathrm{AgCl}$ example is also acting as an elemental electrode for $\mathrm{Ag}^{+}$ ions. I discuss this and the relation to the normal electrode potential in the following optional content:

<details>
<summary>
Click to open extended discussion.
</summary>
At the silver electrode, we have $\mathrm{Ag} \rightleftharpoons \mathrm{Ag^{+}} + \mathrm{e}^-$, so 

$$ V_{\mathrm{Ag}^{+}} - V_{\mathrm{e}^-} =  \frac{1}{F} \mu_{\mathrm{Ag}} = 0~\mathrm{V}$$

Again, 0 V because we're assuming standard conditions and this is the elemental standard reference state of silver. Together with the previous reaction I gave, this also sets a difference in the solution:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{Ag}^{+}} =  - \frac{1}{F}\mu_{\mathrm{AgCl}} = 1.138~\mathrm{V}$$

And note that we could have gotten this equation directly based on the dissociation reaction $\mathrm{AgCl} \rightleftharpoons \mathrm{Ag^{+}} + \mathrm{Cl}^-$. In other words, as far as equilibrium is concerned, the $\mathrm{AgCl}$ just acts to dissolve until saturation (it doesn't take much -- silver chloride has a quite low solubility in water).

We saw the $V_i$ step does not depend at all on the actual concentration of ions. In contrast, the electrode potential of standard electrochemistry _does_ depend on chloride concentration: a massive excess of $\mathrm{Cl}^-$ ions are typically supplied by dissolving $\mathrm{KCl}$ salt into the solution at a concentration of 0.5 to 3 mol/L, and the commonly quoted value of 0.222&nbsp;V refers specifically to the case of 'unit activity' of chloride ions, which occurs around 2 mol/L of dissolved $\mathrm{KCl}$.

Let's use the definition of electrode potential, $E = V_{\mathrm{e}^-} - \phi$, together with the value we found for $V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} = \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ) = 1.138~\mathrm{V}$, and finally substitute the partitioned form $V_{\mathrm{Cl}^-} = \phi -\frac{1}{F}\mu^\circ_{\mathrm{Cl}^-} - \frac{RT}{F}\ln(a_{\mathrm{Cl}^-})$. Then we get:

\begin{align}
 E  & \equiv V_{\mathrm{e}^-} - \phi \notag \\\\
    & = \Big[V_{\mathrm{Cl}^-} - [V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-}] \Big] - \phi \notag \\\\
    & = \Big[\phi -\frac{1}{F}\mu^\circ_{\mathrm{Cl}^-} - \frac{RT}{F}\ln(a_{\mathrm{Cl}^-}) - [V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-}] \Big] - \phi \notag \\\\
    & = \Big[-\frac{1}{F}\mu^\circ_{\mathrm{Cl}^-} - [V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-}] \Big] - \frac{RT}{F}\ln(a_{\mathrm{Cl}^-}) \notag \\\\
    & = \big[1.360~\mathrm{V} - 1.138~\mathrm{V} \big] - \frac{RT}{F}\ln(a_{\mathrm{Cl}^-}) \notag \\\\
    & = 0.222~\mathrm{V} - \frac{RT}{F}\ln(a_{\mathrm{Cl}^-}) \notag
\end{align}

where we've used $\mu^\circ_{\mathrm{Cl}^-} = -F \cdot 1.360~\mathrm{V}$, the standard internal chemical potential for chloride ions.

We will further discuss ionic concentrations, ionic standard states, and ionic activities in the next-next topic.

</details>
#}