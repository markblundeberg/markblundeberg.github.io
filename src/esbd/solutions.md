---
layout: layouts/esbd_topic.njk
title: 'Solutions'
tags: [page, esbd_topic]
orderESBD: 21
---

# {{title}}

In the earlier [topic about equilibrium](../equilibrium/), we talked about how solid $\mathrm{NaCl}$ in equilibrium with a solvent (such as water) would set a fixed $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = \tfrac{1}{F} \mu_{\mathrm{NaCl}} = -3.9813~\mathrm{V}$. But that is for a *fully saturated* solution. What happens when we only have a tiny amount dissolved? How does $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ depend on the concentration of dissolved $\mathrm{NaCl}$?

To start our discussion, here are some fairly accurate modelled curves:

<figure class="demo-container" style="max-width: 350px">
<img src="/esbd/img/nacl_solvent_comparison.svg" style="max-width:100%"/>
{% figcaption %}
$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ value for salt dissolved at varying concentrations, for two solvents: water and methanol.<small>[[source]](https://colab.research.google.com/gist/markblundeberg/7d09128737f2dd41b035e8ccb661dff3/nacl-water-methanol.ipynb)</small>
{% endfigcaption %}
</figure>

Note the roughly linear dependence on the logarithm of concentration (the "ideal slope" in the figure). This is actually guaranteed in the dilute limit, for a fundamental entropic reason: each solute particle's position becomes independent of other solute particles.

Although the dilute limit is only approximate, it gives us a starting point to answer more complex questions without first laboriously measuring thermodynamic data over a range of concentrations. For example, what happens when there are many species of ion present?

(The saturation behaviour is interesting too: When $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ in the solution rises above the value for solid $\mathrm{NaCl}$, then the solution is supersaturated, that is, it is favourable for the excess $\mathrm{NaCl}$ to precipitate. At saturation, the values of $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ will be the same in solution and solid salt.)

## Ideal ionic voltage in dilute solutions

Statistical mechanics predicts that for a given solvent and a given dilute solute $i$, then its electrochemical potential varies as
$$\bar\mu_i = z_i F \phi + \mathrm{offset} + RT \ln (\mathrm{concentration}),$$
where $\phi$ is a typical electrostatic potential value in the solution and the $\mathrm{offset}$ term is independent of concentration. The exact value of the offset depends on how $\phi$ is defined and how the concentration is defined (and its units). Now we're going to convert this formula to $V_i$'s by dividing by $z_i F$, and combine the $(z_i F \phi + \mathrm{offset})$ into one term: $z_i F V^\circ_i$.

We thus have the following relationship between $V_i$ of an ion and its concentration $c_i$:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(c_i/c^\circ), $$

where
* $V^\circ_i$ is **standard species voltage**, a new concept. These are electrochemical standard states that float analogously to the floating band edges in semiconductors.
* $RT$ is the universal gas constant times temperature (joules per mole).
* $z_i F$ is the molar charge (coulombs per mole).
* $c_i$ is the {% wiki "molar concentration" %}, the amount of ions per unit volume (moles per liter). Also called molarity.
* $c^\circ$ is a reference concentration, always $c^\circ = 1~\mathrm{mol/L}$.

> It is sometimes preferable to measure solute concentration as {% wiki "molality" %}, the amount of ions per unit of solvent (moles per kilogram). The plot shown above was in molal units. In terms of molality $b_i$ we can write a similar ideal form:
>
> $$ V_i = V^{\circ(b)}_i + \frac{RT}{z_i F} \ln(b_i/b^\circ), $$
>
> for reference molality is $b^\circ = 1~\mathrm{mol/kg}$. Note that $V^{\circ(b)}_i$ differs from $V^\circ_i$ when the solvent density is not equal to $c^\circ/b^\circ = 1~\mathrm{kg/L}$.^[Equating the two formulas for $V_i$, we get $V^{\circ(b)}_i - V^\circ_i = \tfrac{RT}{z_i F}\ln(\rho b^\circ/c^\circ)$ for solvent density $\rho$. For water at standard conditions ($\rho = 0.997~\mathrm{kg/L}$ at 25&nbsp;°C and 1 bar) this difference is tiny, only $-0.00008~\mathrm{V}/z_i$, but can be significant for other solvents.] The molality and molarity formulas also describe slightly different ideal behaviours when the solvent density varies with concentration, but that only occurs in concentrated solutions where both ideal logarithmic forms are wrong anyway, and nonideality must be considered (more about nonideality at the bottom of this page).
> 
> I'll generally prefer to use molar $c_i$ units but we may switch to molality when convenient.

### Ideal-dilute salt water

Returning to our saltwater example, we have then:
$$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = (V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-}) + 2\frac{RT}{F} \ln(c/c^\circ), $$
where $c = c_{\mathrm{Na}^+} = c_{\mathrm{Cl}^-}$ is the concentration of either ion. This gives that characteristic $2\tfrac{RT}{F}\ln(\mathrm{concentration})$ slope we saw in the plot above. Also note that $V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-} = -4.0746~\mathrm{V}$ is is a constant for water in our conditions; since $\phi$ cancels out, this difference does not depend on the ambiguous $\phi$. When discussing solutions we can draw these $V^\circ_i$ as distinct lines from the $V_i$.

{% include "esbd-diagrams/esbd-nacl-dilute.html" %}

## Ionic standard states are a floating ladder

Although the $V^\circ_i$ values float, crucially all the differences $V^\circ_i - V^\circ_j$ are invariant properties of the pure solvent. These differences also vary with temperature and pressure but that won't be too important for our purposes.

Here are a number of selected $V^\circ_i$ values for water at standard conditions (25&nbsp;°C, 1 bar):
[[Data table here](../data/)]

{% include "esbd-diagrams/V-std-ladder.html" %}

I call this the **standard state ladder** for water. The standard state ladder is a rigid ladder: as we change the electrical state or solute composition of the solution, the $V^\circ_i$ values may move up and down but they have to all stay rigidly locked to one another. In contrast, $V_i$ values are not rigid and their relative positions will change with composition.

The [Data table](../data/) topic in the appendix contains the numerical values used above, as well as the procedure used to obtain them from standard ionic Gibbs energies of formation ($\Delta_{\mathrm{f}} G^\circ_i$ values).

In effect, the standard state ladder of $V^\circ_i$ is a stand-in for the notion of electrostatic potential $\phi$, but combining it with the average differences in the local electrostatic potentials that each ion 'feels', as well the ion's chemical structure, and the way it disturbs its solvent environment with solvation shells.

The standard state ladder is also analogous to the conduction and valence band edges in semiconductors. We'll talk more about this analogy to semiconductors in the next topic.

## Activities and non-ideality

In chemistry, the standard approach is the following breakdown of the electrochemical potential:

$$ \bar\mu_i = z_i F \phi + \mu^\circ_{\mathrm{int},i} + RT \ln(a_i), $$

where $\mu^\circ_{\mathrm{int},i}$ is a (fixed) standard internal chemical potential and $a_i$ is {% wiki "activity" %}. This equation actually serves as *the definition of activity*, i.e. activity is a measure of chemical potential deviation away from a standard state. For dilute solutes, activity is proportional to concentration (by whatever measure), but for concentrated solutes it can vary, sometimes by a lot.

This directly maps to a non-ideal form of our $V_i$ equation:

$$ V_i = \underbrace{\phi + \tfrac{1}{z_i F}\mu^\circ_{\mathrm{int},i}}_{V^\circ_i} + \tfrac{RT}{z_i F} \ln(a_i), $$

$$ V_i = V^\circ_i + \tfrac{RT}{z_i F} \ln(a_i), $$

which shows that $V^\circ_i = \phi + \frac{1}{z_i F}\mu^\circ_{\mathrm{int},i}$ is the precise link to normal electrochemistry notation. The standard state $V^\circ_i$ values float rigidly together (and with $\phi$), but with various fixed offsets according to $\mu^\circ_{\mathrm{int},i}$.

Anyway, the idea is to choose $\mu^\circ_{\mathrm{int},i}$ (i.e. to choose $V^\circ_i$) such that $a_i \rightarrow c_i/c^\circ$ in the limit where all solutes are dilute (pure solvent). This justifies our earlier dilute $V_i$ equation in terms of $a_i \approx c_i/c^\circ$.

There are a number of big gotchas when it comes to nonideality. I talk about this a lot more in the [appendix Topic on non-ideality](../nonideal/), but the key points are:

* **Single-ion activities are ambiguous**: we can access $V_i$ but we cannot directly access $\phi$ nor $V^\circ_i$. Consequently in nonideal solutions we have no basis on how to fix the reference point for activities. In chemistry it is said "we can only measure {% wiki "Activity_coefficient#Ionic_solutions", "*mean* ion activities" %}"; those [exactly correspond](../nonideal/) to measurable differences like $(V_i - V^\circ_i) - (V_j - V^\circ_j)$, where the 'ladder offset' or $\phi$ cancels out. This ambiguity is very severe: it adds infinite degrees of freedom as every solution of every composition can settle the ambiguity independently.
* **Activities depend on concentration reference**: depending on our choice of concentration reference (either switching from molarity $c^\circ$ to molality $b^\circ$, or changing their values), we will have different $V^\circ_i$ values. This choice doesn't change the $V_i$, rather it changes activity $a_i$. This can get confusing!^[See Adam Přáda's blog (2019), ["On chemical activities"](https://adamprada.net/blog/on-chemical-activities/)]
* **Activity coefficients are trickier**: it is common in chemistry to introduce a dimensionless activity coefficient as a sort of fudge factor on the concentration. These become especially tricky when trying to convert between different concentration measures.

Again, see the [appendix Topic on non-ideality](../nonideal/) for more information.

Importantly, what all of these different approaches using various concentration measures, electrostatic potentials, activities, and activity coefficients *must* agree on is the actual thermodynamic observable: electrochemical potential $\bar\mu_i$ (and thus $V_i$).

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