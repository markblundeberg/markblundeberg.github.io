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

In the earlier [topic about equilibrium](../equilibrium/), we talked about how solid $\mathrm{NaCl}$ in equilibrium with a solvent (such as water) would set a fixed $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} =  -3.9813~\mathrm{V}$. But that is for a *fully saturated* solution. What happens when we only have a tiny amount dissolved? How does $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ depend on the concentration of dissolved $\mathrm{NaCl}$? And what if there are many ions present besides just $\mathrm{Na}^+$ and $\mathrm{Cl}^-$, then where do all their $V_i$'s lie in relation to each other?

For this topic, we'll focus primarily on the _ideally dilute_ case, and then briefly discuss the non-ideal case involving ion activities and activity coefficients.

## Ideally dilute and the standard species voltage $V^\circ_i$

A familiar expression from chemistry is the dependence of a dilute solute's chemical potential on its concentration, $c_i$:
$$ \mu_i(c_i) = \mu^\circ_i + RT \ln(c_i/c^\circ) . $$
Here, $c^\circ \equiv 1~\mathrm{mol/L}$ is the reference concentration level, and $\mu^\circ_i$ is a reference value that extrapolates the value $\mu_i(c^\circ)$ based off its behaviour in the infinite dilution limit. The value of $\mu^\circ_i$ varies depending on solvent and the choice of $c^\circ$, as well as temperature and pressure. This approximation only holds for small solute concentrations, but it captures a behaviour known as _ideally dilute_. (There are other ideal forms based on mole fraction or molality, but they generally agree at low solute concentrations.^[The $RT \ln(c_i/c^\circ)$ form is purely due to positional entropy just like in an ideal gas. In essence, we assume that the solute particles can have strong and nontrivial interactions with the nearby solvent (captured in $\mu^\circ_i$), but each solute particle with its disturbed 'shell' of solvent moves around independently of other solute particles. In this manner the solutes are like an ideal gas, which has the $RT \ln(c_i)$ form of chemical potential. Other ideal forms like the logarithm of mole fraction can be justified based on {% wiki "ideal mixtures" %} where the solute/solvent cannot tell each other apart, however that is less relevant for ionic solutes.])

There's no reason why we shouldn't have the same with ionic solutes:

$$ \bar\mu_i(c_i) = \bar\mu^\circ_i + RT \ln(c_i/c^\circ), $$

though since $\bar\mu_i(c_i)$ is electrically variable (and $c_i$ is not), then that means $\bar\mu^\circ_i$ must be electrically variable. Let's go ahead and divide this equation by $z_i F$ to convert into species voltage quantities:

$$ V_i(c_i) = V^\circ_i + \frac{RT}{z_i F} \ln(c_i/c^\circ). $$

where we have defined $V^\circ_i = \bar\mu^\circ_i / (z_i F)$. I call this $V^\circ_i$ the **standard species voltage** for species $i$.

> **A note for the chemists**: in chemisty one usually writes
> $$\bar\mu_i(c_i) = z_i F \phi + \mu^\circ_{\mathrm{int},i} + RT \ln(c_i/c^\circ),$$
> where $\mu^\circ_{\mathrm{int},i}$ is a *internal* standard chemical potential (a constant for the given solvent), and $\phi$ is the variable electrostatic potential. This works out to $V^\circ_i = \phi + \mu^\circ_{\mathrm{int},i}/(z_i F)$. And so, each $V^\circ_i$ moves up and down in lockstep with with $\phi$ but with a constant offset that differs for each species $i$.

## Example: dilute salt water

Let's return to our specific question of how the saltiness of saltwater affects $V_{\mathrm{Na}^+}$ and $V_{\mathrm{Cl}^-}$, in illustrated form:

<figure class="diagram-placeholder">
{% figcaption %}
- One slider for concentration of $\mathrm{Na}^+$ (= concentration of $\mathrm{Cl^-}$).
- Indicator of 'unsaturated / saturated / supersaturated'
- One slider for overall electrostatic offset.
- Checkbox for ideal/nonideal?? Use Pitzer mean activity coef.
{% endfigcaption %}
</figure>

**Floating offset**: It's worth reiterating that all the voltage quantities, both species voltages $V_i$ and the standard states $V^\circ_i$, move together when the electrostatic offset is changed. In practice we can set this offset (relative to external voltages) with electrodes and such.

**Neutrality**: Note we have assumed that the $\mathrm{Na}^+$ and $\mathrm{Cl^-}$ concentrations are equal. This is required by charge neutrality: we could add more $\mathrm{Na}^+$ ions, but the excess charge will always move to the surface of the conductor and the homogeneous bulk remains neutral. We could of course disturb the equality of $\mathrm{Na}^+$ or $\mathrm{Cl^-}$ concentrations by adding *other* charged ions; anyway, we'll talk more about charge neutrality later.

**Saturation**: Regarding saturation, we can compute the gap $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ for any concentration, but note that once it gets too high (above $-3.9813~\mathrm{V}$) it exceeds the conditions required to precipitate out salt. The keen will notice that you need to bring the concentration up to *FIXME* $c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = 37.8~\mathrm{mol^2/L^2}$ in order to reach saturation. But in fact *FIXME* $c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = 29~\mathrm{mol^2/L^2}$, which bring us to the topic of non-ideality, which we'll discuss below.

## The $V^\circ_i$ standard state ladder

Since for a given solvent all the $V^\circ_i$ values remain fixed in relation to each other, we can compare the relative $V^\circ_i$ values of different ions. All differences $V^\circ_i - V^\circ_j$ are **electrically-invariant** properties of the solvent.

Here are a number of selected $V^\circ_i$ values for water at standard conditions (25&nbsp;°C, 1 bar):

{% include "esbd-diagrams/V-std-ladder.html" %}

I call this the **standard state ladder** for water. The standard state ladder is a rigid ladder: as we change the electrical state or solute composition of the solution, the $V^\circ_i$ values may move up and down but they have to all stay rigidly locked to one another. In contrast, $V_i$ values are not rigid and their relative positions will change with composition.

In effect, the standard state ladder of $V^\circ_i$ is a stand-in for the notion of electrostatic potential $\phi$, but combining it with the average differences in the local electrostatic potentials that each ion 'feels', as well the ion's chemical structure, and the way it disturbs its solvent environment with "solvation shells". We can use any rung on the ladder as a reference point - once one rung is determined, we know the position of all the other rungs. A convenient reference point is $V^\circ_{\mathrm{H}^+}$, but that's not strictly required.

The standard state ladder is also analogous to the conduction and valence band edges in semiconductors. We'll talk more about this analogy to semiconductors in a later topic.

### Standard state ladder data (aqueous)

Here is the data table of relative $V^\circ_i$ values for water, that was plotted above. These are converted from Atkins' _Physical Chemistry_ (8th edition, Table 2.7 in the back pages). Note these are all:

* for **ideally dilute** ions in **water**,
* at 298 K and 1 bar,
* using a reference ionic concentration of $c^\circ = 1~\mathrm{mol/L}$,
* continuing our usual convention that chemical potentials are equal to the Gibbs formation energies.[^deltaGconversionnote]

[^deltaGconversionnote]: {# this is a multiline footnote #}
    Chemical tables like Atkins' commonly list standard Gibbs energy of formation, $\Delta_{\mathrm{f}} G^\circ_i$, for ionic solutes in water, however this can be a delicate concept. There is an electrostatic degree of freedom (which comes from charge neutrality), which lets the table makers freely choose $\Delta_{\mathrm{f}} G^\circ_{\mathrm{H}^+} = 0$. But what does this mean for us; how can we convert these into chemical potentials and $V^\circ_i$ values?
    {# p break but keep syntax highlighting #}
    We want to continue our usual convention that chemical potentials equal the molar Gibbs energy of formation, but to be proper we must also reintroduce the unknown electrostatic degree of freedom that is implicitly assumed in the table:
    $$\bar\mu^\circ_i = \Delta_{\mathrm{f}} G^\circ_i + z_i F \phi^*,$$
    where $\phi^*$ is some unknown quantity that is like an electrostatic potential, distinct from $\phi$. The job of $\phi^*$ is not fundamental (like $\phi$) but rather it simply normalizes the table such that $\Delta_{\mathrm{f}} G^\circ_{\mathrm{H}^+} = 0$. Not to worry though, because $\phi^*$ cancels out in the quantities we are interested in, which are differences of $V^\circ_i = \bar\mu^\circ_i /(z_i F)$:
    $$V^\circ_i - V^\circ_j = \frac{\Delta_{\mathrm{f}} G^\circ_i}{z_i F} - \frac{\Delta_{\mathrm{f}} G^\circ_j}{z_j F}. $$
    So, we can trivially re-tabulate all the $\Delta_{\mathrm{f}} G^\circ_i$ values into a $V^\circ_i - V^\circ_{\mathrm{H}^+}$ table, since $\Delta_{\mathrm{f}} G^\circ_{\mathrm{H}^+} = 0$.

| Ion $i$ | $\Delta_{\mathrm{f}} G^\circ_i$ (kJ/mol) | $V^\circ_i - V^\circ_{\mathrm{H}^+}$ (V) |
| ---: | ---: | ---: |
| $\mathrm{HSO_4}^{-}$ | -755.91&#8199; | +7.8345&#8199; |
| $\mathrm{Cr_2O_7}^{2-}$ | -1301.1&#8199;&#8199; | +6.742&#8199;&#8199; |
| $\mathrm{HCO_3}^{-}$ | -586.77&#8199; | +6.0814&#8199; |
| $\mathrm{SO_4}^{2-}$ | -744.53&#8199; | +3.8583&#8199; |
| $\mathrm{CrO_4}^{2-}$ | -727.75&#8199; | +3.7713&#8199; |
| $\mathrm{PO_4}^{3-}$ | -1018.7&#8199;&#8199; | +3.519&#8199;&#8199; |
| $\mathrm{F}^{-}$ | -278.79&#8199; | +2.8895&#8199; |
| $\mathrm{CO_3}^{2-}$ | -527.81&#8199; | +2.7352&#8199; |
| $\mathrm{OH}^{-}$ | -157.24&#8199; | +1.6297&#8199; |
| $\mathrm{Cl}^{-}$ | -131.23&#8199; | +1.3601&#8199; |
| $\mathrm{NO_3}^{-}$ | -108.74&#8199; | +1.1270&#8199; |
| $\mathrm{Br}^{-}$ | -103.96&#8199; | +1.0775&#8199; |
| $\mathrm{Hg}^{2+}$ | +164.40&#8199; | +0.8519&#8199; |
| $\mathrm{Ag}^{+}$ | +77.11&#8199; | +0.7992&#8199; |
| $\mathrm{Hg_2}^{2+}$ | +153.52&#8199; | +0.7956&#8199; |
| $\mathrm{I}^{-}$ | -51.57&#8199; | +0.5345&#8199; |
| $\mathrm{Cu}^{+}$ | +49.98&#8199; | +0.5180&#8199; |
| $\mathrm{Cu}^{2+}$ | +65.49&#8199; | +0.3394&#8199; |
| $\mathrm{H}^{+}$ | 0&#8199;&#8199;&#8199;&#8199; | 0&#8199;&#8199;&#8199;&#8199;&#8199;&#8199; |
| $\mathrm{Fe}^{3+}$ | -4.7&#8199;&#8199; | -0.016&#8199;&#8199; |
| $\mathrm{HS}^{-}$ | +12.08&#8199; | -0.1252&#8199; |
| $\mathrm{Pb}^{2+}$ | -24.43&#8199; | -0.1266&#8199; |
| $\mathrm{Sn}^{2+}$ | -27.2&#8199;&#8199; | -0.141&#8199;&#8199; |
| $\mathrm{Cd}^{2+}$ | -77.612 | -0.40220 |
| $\mathrm{Fe}^{2+}$ | -78.90&#8199; | -0.4089&#8199; |
| $\mathrm{S}^{2-}$ | +85.8&#8199;&#8199; | -0.445&#8199;&#8199; |
| $\mathrm{Zn}^{2+}$ | -147.06&#8199; | -0.7621&#8199; |
| $\mathrm{NH_4}^{+}$ | -79.31&#8199; | -0.8220&#8199; |
| $\mathrm{Al}^{3+}$ | -485.&#8199;&#8199;&#8199; | -1.68&#8199;&#8199;&#8199; |
| $\mathrm{CN}^{-}$ | +172.4&#8199;&#8199; | -1.787&#8199;&#8199; |
| $\mathrm{Mg}^{2+}$ | -454.8&#8199;&#8199; | -2.357&#8199;&#8199; |
| $\mathrm{Na}^{+}$ | -261.91&#8199; | -2.7145&#8199; |
| $\mathrm{Ca}^{2+}$ | -553.58&#8199; | -2.8687&#8199; |
| $\mathrm{Ba}^{2+}$ | -560.77&#8199; | -2.9060&#8199; |
| $\mathrm{K}^{+}$ | -283.27&#8199; | -2.9359&#8199; |
| $\mathrm{Cs}^{+}$ | -292.02&#8199; | -3.0266&#8199; |
| $\mathrm{Li}^{+}$ | -293.31&#8199; | -3.0399&#8199; |

A few of these values were omitted from the plot just because they were overlapping too tightly. Note the plot starts with the ladder offset arbitrarily to have $V^\circ_{\mathrm{H}^+} = -0.45~\mathrm{V}$, just to emphasize that there is no preferred absolute position.

Some readers will notice that many of these entries coincide with {% wiki "Standard electrode potential (data page)", "standard electrode potentials" %}, and that is for good reason! As we will see in the later [topic on potentials](../potentials/), for elemental metals (with $\mu_{\mathrm{M}}=0$) in equilibrium with an ideal-dilute $c^\circ$ concentration of their ion $\mathrm{M}^{n+}$, we do expect $E = V^\circ_{\mathrm{M}^{n+}} - V^\circ_{\mathrm{H}^+}$.

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