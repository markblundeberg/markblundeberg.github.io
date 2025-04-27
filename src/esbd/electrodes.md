---
layout: layouts/esbd_topic.njk
title: 'Electrodes'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 2
eleventyNavigation:
    key: Electrodes # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 1 # Order within the parent menu
---

# {{title}}

Electrodes are interfaces where electrons (in metal) and ions (in solution) meet and react. A classic example, used as a standard reference for electrochemical studies, is the silver chloride electrode:

> $\mathrm{Ag}$ metal | $\mathrm{AgCl}$ coating | Solution containing $\mathrm{Cl}^-$ ions

The characteristic and reversible reaction here is that (in effect) the silver chloride can take an electron from the metal, and release a $\mathrm{Cl}^-$ ion. In the process this leaves behind some Ag that deposits on the metal. Let's write down that reaction:

$$ \mathrm{AgCl} + \mathrm{e}^- \rightleftharpoons \mathrm{Ag} + \mathrm{Cl}^-$$

Let's convert this reversible reaction to (electro)-chemical potentials:

$$ \mu_{\mathrm{AgCl}} + \bar\mu_{\mathrm{e}^-} = \mu_{\mathrm{Ag}} + \bar\mu_{\mathrm{Cl}^-}$$

As this is our first time seeing a reaction, let's break this down:

* $\mu_{\mathrm{AgCl}}$ is the chemical potential of the salt. It's also the electrochemical potential, but since this is a neutral species, we just leave off the overbar.
* $\bar\mu_{\mathrm{e}^-}$ is the electrochemical potential for electrons, in the silver metal.
* The equality ($=$) of these two sides is because we are assuming equilibrium.
* $\mu_{\mathrm{Ag}}$ is the chemical potential associated to silver atoms, in the solid metal state.
* $\bar\mu_{\mathrm{Cl}^-}$ is the electrochemical potential for chloride ions, _in solution_.

Now for the ionic species, we just sub in $\bar{\mu}_i = z_i F V_i$, and this becomes:

$$ \mu_{\mathrm{AgCl}} - F V_{\mathrm{e}^-} = \mu_{\mathrm{Ag}} - F V_{\mathrm{Cl}^-}$$

or rearranging,

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} =  \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} )$$

We are going to see this kind of equation occur again and again: where there is a reaction of any kind, the _separation_ between $V_i$ levels is related to some neutral species' chemical potentials. Reactions are always charge-balanced, so we will never see one $V$ value on its own, only balanced $V_x - V_y$ differences (in more complicated reactions, sometimes sums of $V_x - V_y$ differences, but we will touch on that in a later Topic).

Let's plot this on a band diagram:

{% include "esbd-diagrams/esbd-ag-agcl-electrode.html" %}

The diagram shows the actual quantitative step $V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-}$. Let's calculate it now, assuming standard temperature and pressure. Since chemical potentials are partial molar Gibbs free energy, we can just look up the Gibbs free energies of formation in a table: $\mu_{\mathrm{Ag}} = 0~\mathrm{kJ/mol}$ and $\mu_{\mathrm{AgCl}} = -109.8~\mathrm{kJ/mol}$ at standard conditions. Note that we use the common convention that $\mu=0$ for elements in their most stable form, at the standard reference conditions (25&nbsp;°C and 1 bar). Plug those in with the faraday constant, and we get:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} = +1.138~\mathrm{V}$$

(Don't confuse this with the electrode potential $E = V_{\mathrm{e}^-} - \phi$, which is approximately 0.2 V with this electrode.)

In the diagrams, we will show a symbol with the marker ⇌ to indicate an equlibrium reaction, especially at the electrodes.


## Elemental metal electrodes

Another classic electrode is the zinc metal electrode, which releases / captures $\mathrm{Zn}^{2+}$ ions. Let's quickly run through the reaction:

$$ \mathrm{Zn} \rightleftharpoons \mathrm{Zn}^{2+} + 2\mathrm{e}^-$$

which becomes:

$$ \mu_{\mathrm{Zn}} = 2 F V_{\mathrm{Zn}^{2+}} - 2 F V_{\mathrm{e}^-}$$

Here the 2 in front of the $V_{\mathrm{Zn}^{2+}}$ came because of its ionic charge, whereas the 2 in front of $V_{\mathrm{e}^-}$ came from the original formula; the latter also flipped sign. We see again this sets a $V_i$ difference,

$$ V_{\mathrm{Zn}^{2+}} - V_{\mathrm{e}^-} =  \frac{1}{2F} \mu_{\mathrm{Zn}} $$

Plotting the ESBD now,

(....)

It's a flat line with $V_{\mathrm{Zn}^{2+}} = V_{\mathrm{e}^-}$.

Don't mistake this flat connection as being required for equilibrium in general, as it's only an 'accidental' consequence of $\mu_{\mathrm{Zn}}$ being zero under our conditions and conventions: the zinc metal is at standard reference conditions, and we have adopted the convention that elements in most stable form have $\mu=0$, and indeed the zinc metal is the most stable form of $\mathrm{Zn}$. So, $\mu_{\mathrm{Zn}} = 0$ and thus $V_{\mathrm{Zn}^{2+}} - V_{\mathrm{e}^-} = 0$. Yet, away from standard conditions will have $\mu_{\mathrm{Zn}} \neq 0$ and thus have equilibrium with $V_{\mathrm{Zn}^{2+}} \neq V_{\mathrm{e}^-}$. In the previous $\mathrm{AgCl}$ example, we also had a large ~1 V step, and it was also at equilibrium.

## Takeaways

The main point is that at electrodes reacting with a single species of ion,
* We get a relative step up or down going from $V_{\mathrm{e}^-}$ to $V_{\mathrm{ion}}$.
* The quantitative value of that step at equilibrium depends on the chemical potentials of neutral species, depending on the specifics of the reaction.
* This step should not be confused with the electrode potential of standard electrochemistry.
* In the diagrams, we will mark these reactions with a ⇌ symbol.

Alright, we're ready now to tackle a real application!

[**NEXT TOPIC: Lithium-ion batteries**](../lib/)

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
