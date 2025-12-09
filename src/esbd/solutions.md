---
layout: layouts/esbd_topic.njk
title: 'Solutions'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 21
eleventyNavigation:
    key: Solutions # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 21 # Order within the parent menu
---

# {{title}}

In the earlier [topic about equilibrium](../equilibrium/), we talked about how solid $\mathrm{NaCl}$ in equilibrium with a solvent (such as water) would set a fixed $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} =  -3.9813~\mathrm{V}$. But that is for a *fully saturated* solution. What happens when we only have a tiny amount dissolved? How does $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ depend on the concentration of dissolved $\mathrm{NaCl}$?

To start our discussion, here is what the experimental data shows for salt water:

<figure class="diagram-placeholder">
{% figcaption %}
- Not a band diagram. Plot of $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ vs NaCl concentration. (Pitzer model)
- x axis should be molarity or molality?
- Add curve for 'molar ideal form (see below)' ?
{% endfigcaption %}
</figure>

As can be seen there is approximately a linear dependence on the logarithm of concentration. This is actually guaranteed in the dilute limit, for a fundamental entropic reason: each solute particle's position becomes independent of other solute particles.

Although the dilute limit is only approximate, it gives us a starting point to answer more complex questions without first laboriously measuring thermodynamic data over a range of concentrations. For example, what happens when there are many species of ion present?

## Ideal ionic voltage in dilute solutions

For dilute ions we have the following relationship between $V_i$ of an ion and its concentration $c_i$:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(c_i/c^\circ), $$

where
* $V^\circ_i$ is **standard state voltage**, a new concept. These are electrochemical standard states that float analogously to the floating band edges in semiconductors.
* $RT$ is the universal gas constant times temperature (joules per mole).
* $z_i F$ is the molar charge (coulombs per mole).
* $c_i$ is the {% wiki "molarity" %}, the concentration of the ion (moles per liter).
* $c^\circ$ is a reference concentration, always $c^\circ = 1~\mathrm{mol/L}$.

> We'll prove this down below, as well as discussing how non-ideal solutes work and discussing other concentration measures (e.g. molality).

Returning to our saltwater example, let's see what this looks like. Note that $V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-} = -4.0746~\mathrm{V}$ is is a constant for water in our conditions. When discussing solutions we can draw these $V^\circ_i$ as distinct lines from the $V_i$.

<figure class="diagram-placeholder">
{% figcaption %}
- One slider for concentration of $\mathrm{Na}^+$ (= concentration of $\mathrm{Cl^-}$).
- Indicator of 'unsaturated / saturated / supersaturated'
- One slider for overall electrostatic offset.
- Note that the high concentrations are an 'abuse' of the dilute limit.
{% endfigcaption %}
</figure>

## Ionic standard states are a floating ladder

Although the $V^\circ_i$ values float, crucially all the differences $V^\circ_i - V^\circ_j$ are invariant properties of the pure solvent. These differences also vary with temperature and pressure but that won't be too important for our purposes.

Here are a number of selected $V^\circ_i$ values for water at standard conditions (25&nbsp;°C, 1 bar):
[[Data table here](../data/)]

{% include "esbd-diagrams/V-std-ladder.html" %}

I call this the **standard state ladder** for water. The standard state ladder is a rigid ladder: as we change the electrical state or solute composition of the solution, the $V^\circ_i$ values may move up and down but they have to all stay rigidly locked to one another. In contrast, $V_i$ values are not rigid and their relative positions will change with composition.

The [Data table](../data/) topic in the appendix contains the numerical values used above, as well as the procedure used to obtain them from standard ionic Gibbs energies of formation ($\Delta_{\mathrm{f}} G^\circ_i$ values).

In effect, the standard state ladder of $V^\circ_i$ is a stand-in for the notion of electrostatic potential $\phi$, but combining it with the average differences in the local electrostatic potentials that each ion 'feels', as well the ion's chemical structure, and the way it disturbs its solvent environment with "solvation shells".

The standard state ladder is also analogous to the conduction and valence band edges in semiconductors. We'll talk more about this analogy to semiconductors in the next topic.

## More rigorously and with non-ideality

In chemistry, we have the following breakdown of the electrochemical potential:

$$ \bar\mu_i = z_i F \phi + \mu^\circ_{\mathrm{int},i} + RT \ln(a_i), $$

where $\mu^\circ_{\mathrm{int},i}$ is a (fixed) standard internal chemical potential and $a_i$ is {% wiki "activity" %}. This equation actually serves as *the definition of activity*, i.e. activity is a measure of chemical potential deviation away from a standard state. For dilute solutes, activity is proportional to concentration (by whatever measure), but for concentrated solutes it can vary, sometimes by a lot.

This directly maps to a non-ideal form of our $V_i$ equation:

$$ V_i = \underbrace{\phi + \tfrac{1}{z_i F}\mu^\circ_{\mathrm{int},i}}_{V^\circ_i} + \tfrac{RT}{z_i F} \ln(a_i), $$

which shows that $V^\circ_i = \phi + \frac{1}{z_i F}\mu^\circ_{\mathrm{int},i}$ is the precise link to normal electrochemistry notation. In this way we can see how all the standard state $V^\circ_i$ values float rigidly together (and with $\phi$), but with various fixed offsets according to $\mu^\circ_{\mathrm{int},i}$.

Anyway, we can choose $\mu^\circ_{\mathrm{int},i}$ such that $a_i \rightarrow c_i/c^\circ$ in the limit where all solutes are dilute (pure solvent). This justifies our earlier dilute $V_i$ equation in terms of $a_i \approx c_i/c^\circ$.

> **Single-ion activities are technically ambiguous**: There is a fundamental difficulty with non-ideal activities: we can only infer the $V^\circ_i$ ladder, i.e. we only have experimental access to quantities like $V_i - V_j$, but not $V_i - V^\circ_i$. And so, if activities are no longer anchored to observables (concentration) then we don't know how to position the ladder of $V^\circ_i$ values. In fact, single-ion activities are fundamentally ambiguous, which corresponds to us being free to locate the $V^\circ_i$ ladder to where we wish. In chemistry it is said "we can only measure {% wiki "Activity_coefficient#Ionic_solutions", "*mean* ion activities" %}"; those exactly correspond to measurable differences like $V_i - V_j$.
>
> For more about this, see the [appendix Topic on non-ideality](../nonideal/).

## About concentration measures

Chemists prefer not to use molarity $c_i$, but rather {% wiki "molality" %} (concentration per amount of solvent, usually mol/kg) or {% wiki "mole fraction" %} (moles of solute per total moles of solute and solvent). This is for good reason, relating to how solutions behave under constant pressure: generally the solution expands because of solute addition, and so determining molarity in non-dilute solutions requires the extra step of measuring and compensating for that volume change. In this blog I chose to adopt molarity because it is what appears in diffusion laws and electrostatic problems, and it lets us draw a closer analogy to semiconductors.

Each concentration measure is subtly different, and it can get confusing.^[See Adam Přáda's blog (2019), ["On chemical activities"](https://adamprada.net/blog/on-chemical-activities/)] This affects the standard state and the activity and especially the activity coefficient. To sum up:

* Standard state: The choice of concentration measure and reference value ($c^\circ$, $b^\circ$, etc.) has an influence on the standard state $\mu^\circ_{\mathrm{int},i}$. For water (kg = L), though, the usual molality and molarity standard states do coincide.
* Activity: Each concentration measure (and reference) will have a different activity, but by the definition of activity these will all be some constant multiple of each other. In water (kg = L), the molal and molar activities are identical.
* Activity coefficient: An {%wiki "activity coefficient" %} describes how $a_i$ deviates away from its ideal dilute form. But, this depends what you define as the ideal form: $c_i/c^\circ$, or $b_i/b^\circ$, or $x_i$? These are all different numbers in non-ideal solutions, and therefore each gives a distinct activity coefficient in a nontrivial way, *even in water*! Since ionic chemists work exclusively with molal activity coefficients, I am not going to confuse matters by using the molar activity coefficient.

Importantly, what all of these concentration measures, activities, and activity coefficients *do* agree on is $\bar\mu_i$ and $V_i$.

## Takeaways

For the next topic, we'll talk about the close analogies in semiconductors and other solid state electronic materials.

[**NEXT TOPIC: Solid state**](../solidstate/)

{#
## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>

</details>
#}

{#
Neutral, or internal chem pot
$$\mu_i = \underbrace{\mu^\circ_i}_{\text{standard}} + \underbrace{RT \ln a_i}_{\text{active}}$$

Grouping typical:
$$\bar\mu_i = \underbrace{z_i F\phi}_{\text{electric}} + \underbrace{\mu^\circ_i + RT \ln a_i}_{\text{chemical}}$$

Alternate grouping:
$$\bar\mu_i = \underbrace{z_i F\phi + \mu^\circ_i}_{\text{``electro-standard''}} + \underbrace{RT \ln a_i}_{\text{active}}$$

$$V_i = \big[\phi + \tfrac{1}{z_i F} \mu^\circ_i \big] + \tfrac{RT}{z_i F} \ln a_i$$

$$V_i = V^\circ_i + \tfrac{RT}{z_i F} \ln a_i$$

$$V^\circ_i = \phi + \tfrac{1}{z_i F} \mu^\circ_i$$
#}