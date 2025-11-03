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
* $q_i F$ is the molar charge (coulombs per mole).
* $c_i$ is the {% wiki "molarity" %}, the concentration of the ion (moles per liter).
* $c^\circ$ is a reference concentration, always $c^\circ = 1~\mathrm{mol/L}$.

> Chemists prefer to use activity or molality or mole fraction as concentration measures here; they are more convenient measures for quantifying homogeneous solutions under constant pressure. For our purposes, volumetric concentration (molarity) is going to be more useful as it is what appears in diffusion laws and electrostatic problems, and it lets us draw a closer analogy to semiconductors. In any case, all of the concentration measures converge to be proportional in dilute solutions. We'll get back to what happens in non-dilute solutions later on.

Returning to our saltwater example, let's see what this looks like. Note that $V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-} = XXXX$ is is a constant for water in our conditions. When discussing solutions we can draw these $V^\circ_i$ as distinct lines:

<figure class="diagram-placeholder">
{% figcaption %}
- One slider for concentration of $\mathrm{Na}^+$ (= concentration of $\mathrm{Cl^-}$).
- Indicator of 'unsaturated / saturated / supersaturated'
- One slider for overall electrostatic offset.
- Note that the high concentrations are an 'abuse' of the dilute limit.
{% endfigcaption %}
</figure>

## Ionic standard states are a floating ladder

{#
The standard state $V^\circ_i$ is very closely related to the idea of standard states in chemistry.
Normally in chemistry we write for an ion that:

$$ \bar\mu_i = z_i F \phi + \mu^\circ_{\mathrm{int},i} + RT \ln(c_i/c^\circ), $$

where $\mu^\circ_{\mathrm{int},i}$ is a fixed value independent of concentration.

> Chemists actually prefer to use activity or molality or mole fraction here, but those converge with molarity concentration in dilute solutions. We'll get back to what happens in non-dilute solutions later on.

Dividing both sides by $z_i F$, this gives our species voltage as:

$$ V_i = \underbrace{\phi + \tfrac{1}{z_i F}\mu^\circ_{\mathrm{int},i}}_{V^\circ_i} + \tfrac{RT}{z_i F} \ln(c_i/c^\circ), $$

where I've identified $V^\circ_i$.

and so we can see that if $\mu^\circ_{\mathrm{int},i}$ is fixed, then every $V^\circ_i$ must float up and down in lockstep with $\phi$. Or in other words, if we forget about $\phi$ then every $V^\circ_i$ must float up and down in lockstep with each other.

All differences $V^\circ_i - V^\circ_j$ are invariant properties of the pure solvent.**
#} 

Although the $V^\circ_i$ values float, crucially all the differences $V^\circ_i - V^\circ_j$ are invariant properties of the pure solvent. These differences also vary with temperature and pressure but that won't be too important for our purposes.

Here are a number of selected $V^\circ_i$ values for water at standard conditions (25&nbsp;°C, 1 bar):

{% include "esbd-diagrams/V-std-ladder.html" %}

I call this the **standard state ladder** for water. The standard state ladder is a rigid ladder: as we change the electrical state or solute composition of the solution, the $V^\circ_i$ values may move up and down but they have to all stay rigidly locked to one another. In contrast, $V_i$ values are not rigid and their relative positions will change with composition.

In effect, the standard state ladder of $V^\circ_i$ is a stand-in for the notion of electrostatic potential $\phi$, but combining it with the average differences in the local electrostatic potentials that each ion 'feels', as well the ion's chemical structure, and the way it disturbs its solvent environment with "solvation shells". We can use any rung on the ladder as a reference point - once one rung is determined, we know the position of all the other rungs. A convenient reference point is $V^\circ_{\mathrm{H}^+}$, but that's not strictly required.

The standard state ladder is also analogous to the conduction and valence band edges in semiconductors. We'll talk more about this analogy to semiconductors in a later topic.

## Non-ideal solutions

The usual practice to include solute non-idealities is to include an {%wiki "activity coefficient" %} $\gamma_i$ next to $c_i/c^\circ$.

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(\gamma_i c_i/c^\circ). $$

This $\gamma_i$ captures all the deviations from ideality, and of course we have $\gamma_i \rightarrow 1$ as all solutes' concentrations go to zero (including $c_i \rightarrow 0$). We can also write in terms of activity $a_i = \gamma_i c_i/c^\circ$, either is fine:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(a_i). $$

For example, with our saturated salt $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = -3.9813~\mathrm{V}$, this would correspond to $c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = 37.8~\mathrm{mol^2/L^2}$ if it were ideal-dilute (using the aqueous $V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-} = -4.0746~\mathrm{V}$). But measurements of the actual amount of $\mathrm{NaCl}$ that we can dissolve in water show instead $c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = 29~\mathrm{mol^2/L^2}$, and so we must have $\gamma_{\mathrm{Na}^+} \gamma_{\mathrm{Cl}^-} = 0.77$.

The above leaves open the question of how much of this non-ideality product is due to $\gamma_{\mathrm{Na}^+}$ and how much due to $\gamma_{\mathrm{Cl}^-}$, but that is actually not answerable since we only have measurement access to $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$, not $V_{\mathrm{Na}^+} - V^\circ_{\mathrm{Na}^+}$. This demonstrates the well-known issue that single-ion activity coefficients are actually ambiguous, and we can only measure charge-neutral products like $\gamma_{\mathrm{Na}^+} \gamma_{\mathrm{Cl}^-}$. Once we permit $\gamma_i \neq 1$ for the solutes, we actually have a degree of freedom in how to allocate non-ideality between different ions, and that shows up as ambiguity in the positioning of the $V^\circ_i$ ladder.

> **Note on molar/molal**: I am using the _molar_ activity coefficient and _molar_ activity, defined for a *molar ideal* with *reference molarity* $c^\circ=1~\mathrm{mol/L}$. There are also molal, mole fraction, and pressure activities which are are distinct in subtle and quite confusing ways.^[See Adam Přáda's blog (2019), ["On chemical activities"](https://adamprada.net/blog/on-chemical-activities/). Not only do the standard state $\mu^\circ_i$ and $V^\circ_i$ values vary, but each of these bases has a distinct 'ideal $\mu$ curve'. So, the result of even an ideal calculation will depend on whether you use molar or molal basis. For non-ideal calculations, the activities and especially activity coefficients (deviation from ideality) will change value non-trivially even when describing the exact same substance!] As a physicist I find the molar basis easier to understand (due to the close resemblance to ideal gases), but note that much of the ionic chemistry literature prefers the molal basis. At least for dilute aqueous solutions, the molal basis does numerically agree with the molar basis.
https://goldbook.iupac.org/terms/view/A00116.html

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