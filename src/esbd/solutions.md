---
layout: layouts/esbd_topic.njk
title: 'Solutions'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 4
eleventyNavigation:
    key: Solutions # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 1 # Order within the parent menu
---

# {{title}}

On a purely exact thermodynamic level, we can talk about having a solid compound such as $\mathrm{NaCl}$ in equilibrium with a solvent (such as water), where part of it dissolves and dissociates into $\mathrm{Na}^+$ and $\mathrm{Cl}^-$ ions and saturates the solvent. At standard conditions (25&nbsp;°C, 1&nbsp;bar) we have $\mu_{\mathrm{NaCl}} = -384.14~\mathrm{kJ/mol}$ for solid $\mathrm{NaCl}$, and so, using $\bar\mu_{\mathrm{Na}^+} + \bar\mu_{\mathrm{Cl}^-} = \mu_{\mathrm{NaCl}}$ we have:

$$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}= \frac{1}{F}\mu_{\mathrm{NaCl}} = -3.9813~\mathrm{V}.$$

This value of $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ is a thermodynamic guarantee for an $\mathrm{NaCl}$-saturated solution: its value will not change depending on solvent nor the presence of any other ions in solution.

But suppose we only dissolve a small amount of salt, then $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ will be a lower value (more negative) than its saturated value stated above. How does $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ depend on concentration? And what if there are many ions present, then where do all their $V_i$'s lie in relation to each other?

For this topic, we'll focus primarily on the _ideally dilute_ case, and then briefly discuss the non-ideal case involving ion activity coefficients.

## Ideally dilute and the standard species voltage $V^\circ_i$

A familiar expression from chemistry is the dependence of a solute's chemical potential on its concentration, $c_i$:
$$ \mu_i(c_i) \approx \mu^\circ_i + RT \ln(c_i/c^\circ) . $$
Here, $c^\circ \equiv 1~\mathrm{mol/L}$ is the reference concentration level, and $\mu^\circ_i$ is a reference value that extrapolates the value $\mu_i(c^\circ)$ based off its behaviour in the infinite dilution limit.
This approximation only holds for small $c$ values, but it captures a behaviour known as _ideally dilute_.

The logarithmic dependence on $c_i$ is purely entropic in origin. In essence, we assume that the solute particles can have strong and nontrivial interactions with the nearby solvent (captured in $\mu^\circ_i$), but each solute particle with its disturbed 'shell' of solvent moves around independently and interacts negligibly with other solute particles.

Chemists have done heroic work in measuring and tabulating $\mu^\circ_i$ values for various solutes in various solvents, in the form of molar standard Gibbs energies of formation for solutes. And, we have adopted the convention that $\mu$ is equal to Gibbs formation energy, so these tables directly give us $\mu^\circ_i$, at least for the standard conditions listed in the data source. This is all for non-ionic solutes however, and for ions it will get slightly more tricky.

Let's try to make the same equation work with the electrochemical potential of an ion:

$$ \bar\mu_i(c_i) \approx \bar\mu^\circ_i + RT \ln(c_i/c^\circ). $$

This is fine, however, we have those electrostatic shifts in $\bar\mu_i$, and those must be captured by $\bar\mu^\circ_i$. This means that $\bar\mu^\circ_i$ cannot be so simply tabulated, since it is going to depend on both solvent and electrostatic state. Anyway, let's convert this equation into species voltages. _Divide all the things_ by $z_i F$!

$$ V_i(c_i) \approx V^\circ_i + \frac{RT}{z_i F} \ln(c_i/c^\circ). $$

where we have defined $V^\circ_i = \bar\mu^\circ_i / (z_i F)$.

OK, so that is still kind of of like our familiar neutral solutes' $\mu_i(c_i)$ equation, except:
* Cations: Still $V_{\mathrm{X}^+}$ does grow higher relative to $V^\circ_{\mathrm{X}^+}$ as concentration $c_i$ increases.
* Anions: Now $V_{\mathrm{Y}^-}$ _goes lower_ relative to $V^\circ_{\mathrm{Y}^-}$ as concentration increases.
* Higher charges: For a strong ion with charge $|z|>1$, its $V_{\mathrm{Z}^z}$ moves proportionally slower relative to $V^\circ_{\mathrm{Z}^z}$ as concentration increases.

For example, for an ×10 ('decade') concentration increase, the difference $V_i - V^\circ_i$ would change by $\frac{RT}{z_i F}\ln(10)$. At 25&nbsp;°C that would be $+59~\mathrm{mV/decade}$ for a $[]^{1+}$ ion, and $-20~\mathrm{mV/decade}$ for a $[]^{3-}$ ion.

This is still 'slippery' however, as $V_i$ and $V^\circ_i$ can move up and down together while keeping the same concentration. We now have to establish how $V_i$ and $V^\circ_i$ relate to other ions.

## The $V^\circ_i$ standard state ladder

We now have this $V^\circ_i$, which unfortunately _cannot_ be tabulated since it is sensitive to arbitrary electrostatic offsets. We're not stuck though, as we can compare the relative $V^\circ_i$ values of different ions. All differences $V^\circ_i - V^\circ_j$ are **electrically-invariant** properties of the solvent. They are going to be **concentration-invariant** too (since they apply to the ideally dilute limit). So, the $V^\circ_i$ differences will be fixed properties of the solvent at a given temperature and pressure.

Here are a number of selected $V^\circ_i$ values for water at standard conditions (25&nbsp;°C, 1 bar):

{% include "esbd-diagrams/V-std-ladder.html" %}

I call this the **standard state ladder** for water. The standard state ladder is a rigid ladder: as we change the electrical state or solute composition of the solution, the $V^\circ_i$ values may move up and down but they have to all stay rigidly locked to one another. In contrast, $V_i$ values are not rigid and their relative positions will change with composition.

In effect, the standard state ladder of $V^\circ_i$ is a stand-in for the notion of electrostatic potential $\phi$, but combining it with the average differences in the local electrostatic potentials that each ion 'feels', as well the ion's chemical structure, and the way it disturbs its solvent environment with "solvation shells". We can use any rung on the ladder as a reference point - once one rung is determined, we know the position of all the other rungs. The usual reference point is $V^\circ_{\mathrm{H}^+}$, but that's not strictly required.

The standard state ladder is also analogous to the band edges in semiconductors, insofar as it 'floats' rigidly to keep charge neutrality. We'll talk more about this analogy to semiconductors in a later topic.

Below is the data table of relative $V^\circ_i$ values for water, that was plotted above:

<details>
<summary>
Click to open ion data table.
</summary>

Chemical tables commonly list Gibbs energy of formation for aqueous ions, however there is some subtlety to this. Technically speaking it is delicate to even *define* any single ion's Gibbs formation energy, and as a result all the ionic formation energies are listed with a convention that $\Delta_{\mathrm{f}} G^\circ = 0$ for ideal-dilute $\mathrm{H^+}$ extrapolated to a concentration of $c^\circ$. This is an *electrostatic convention*, quite different from the usual convention that elements in their most stable state have $\Delta_{\mathrm{f}} G = 0$.

It works to plow ahead with our usual convention that $\mu$ is equal to molar Gibbs energy of formation, but we will have to modify it thus:

$$\bar\mu^\circ_i = \Delta_{\mathrm{f}} G^\circ_i + z_i F \phi^*$$

where $\phi^*$ is some unknown electrostatic potential (with some unknown offset from $\phi$) that would enforce $\Delta_{\mathrm{f}} G^\circ_{\mathrm{H}^+} = 0$ under whatever conditions were assumed in the table. Fortunately, this $\phi^*$ doesn't matter since we are only interested in differences $V^\circ_i - V^\circ_j$, and then $\phi^*$ cancels out:

$$V^\circ_i - V^\circ_j = \frac{\Delta_{\mathrm{f}} G^\circ_i}{z_i F} - \frac{\Delta_{\mathrm{f}} G^\circ_j}{z_j F}. $$

This means we can pretty much directly re-tabulate all the $\Delta_{\mathrm{f}} G^\circ_i$ values into $V^\circ_i$ values, by simply dividing by $z_i F$. We'll keep $\mathrm{H}^+$ as our reference.

Here I've taken some selected ionic thermodynamic data from Atkins' _Physical Chemistry_ (8th edition, Table 2.7 in the back pages), and converted them. Note these are all:

* for **ideally dilute** ions in **water**,
* at 298 K and 1 bar,
* using a reference ionic concentration of $c^\circ = 1~\mathrm{mol/L}$.

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

These are the values shown in the plot above, although a few were removed from the plot just because they were overlapping too tightly. Note the plot starts with the ladder offset arbitrarily to have $V^\circ_{\mathrm{H}^+} = -0.45~\mathrm{V}$, just to emphasize that there is no preferred absolute position.

Some readers will notice that many of these entries coincide with {% wiki "Standard electrode potential (data page)", "standard electrode potentials" %}, and that is for good reason! As we will see in the later [topic on potentials](../potentials/), for elemental metals (with $\mu_{\mathrm{M}}=0$) in equilibrium with an ideal-dilute $c^\circ$ concentration of their ion $\mathrm{M}^{n+}$, we do expect $E = V^\circ_{\mathrm{M}^{n+}} - V^\circ_{\mathrm{H}^+}$.

</details>

## Example: common-ion effect

Let's try using this $V^\circ$ ladder in an example, just to see how it works.

In the [Electrodes topic](../electrodes/) we talked about the silver / silver chloride electrode. The aqueous solution around the electrode is saturated by silver chloride (which has a low solubility). Let's consider what happens when we add some potassium chloride salt that dissolves into the solution:

{% include "esbd-diagrams/esbd-agcl-kcl-common-ion.html" %}

The solution is initially saturated with $\mathrm{AgCl}$, and as you can see, adding $\mathrm{KCl}$ causes the concentration of $\mathrm{Ag^+}$ ions to decrease. This is known as a {%wiki "common-ion effect" %}. Visually, we can see that adding the $\mathrm{KCl}$ pushes up the standard state ladder in order to increase the $\mathrm{Cl^-}$ concentration (to push $V^\circ_\mathrm{Cl^-}$ closer to $V_\mathrm{Cl^-}$). Since the ladder is rigid, this also moves $V^\circ_\mathrm{Ag^+}$ away from $V_\mathrm{Ag^+}$ thereby decreasing its concentration. If we were to do this experiment, we would likely see the solution turn cloudy with $\mathrm{AgCl}$ precipitates.

And, this relates to the saturated salt defining a {% wiki "solubility product" %}, which we can calculate from the fixed $V_\mathrm{Ag^+} - V_\mathrm{Cl^-}$ and $V^\circ_\mathrm{Ag^+} - V^\circ_\mathrm{Cl^-}$ differences (see math below):
$$c_\mathrm{Ag^+} \cdot c_\mathrm{Cl^-} = 1.76\times 10^{-10}~(\mathrm{mol/L})^2.$$

We may also consider adding a common-cation salt like silver nitrate, donating $\mathrm{Ag^+}$ and $\mathrm{NO_3^-}$ ions; in the above diagram, you can enable this with a checkbox. In that case, it will suppress the $\mathrm{Cl^-}$ concentration instead. And if we added both $\mathrm{KCl}$ and $\mathrm{AgNO_3}$ into the same beaker, [then we would see significant precipitation](https://www.youtube.com/watch?v=kt8cJQKDxfE) of $\mathrm{AgCl}$ since we cannot exceed the solubility product $c_\mathrm{Ag^+} \cdot c_\mathrm{Cl^-}$ stated above.

<details>
<summary>
Click here to see the math.
</summary>

Using our definition equation for $V^\circ_i$, we have:

$$ c_\mathrm{Ag^+} = c^\circ \exp(+\tfrac{F}{RT}(V_\mathrm{Ag^+} - V^\circ_\mathrm{Ag^+})). $$
$$ c_\mathrm{Cl^-} = c^\circ \exp(-\tfrac{F}{RT}(V_\mathrm{Cl^-} - V^\circ_\mathrm{Cl^-})). $$

And so, their product is:

$$ c_\mathrm{Ag^+} c_\mathrm{Cl^-} = (c^\circ)^2 \exp(\tfrac{F}{RT} [(V_\mathrm{Ag^+} - V_\mathrm{Cl^-}) - (V^\circ_\mathrm{Ag^+} - V^\circ_\mathrm{Cl^-})]) $$

Here, under all conditions the saturated $\mathrm{AgCl}$ sets $V_\mathrm{Ag^+} - V_\mathrm{Cl^-} = \tfrac{1}{F}\mu_\mathrm{AgCl} = -1.1379~\mathrm{V}$, whereas $V^\circ_\mathrm{Ag^+} - V^\circ_\mathrm{Cl^-} = -0.5609~\mathrm{V}$. We are also at temperature $\tfrac{RT}{F} = 0.02569~\mathrm{V}$. Thus:

\begin{align}
c_\mathrm{Ag^+} c_\mathrm{Cl^-}
& = (c^\circ)^2 \exp \bigg(\frac{-1.1379~\mathrm{V} + 0.5609~\mathrm{V}}{0.02569~\mathrm{V}} \bigg) \notag \\\\
& = 1.76\times 10^{-10}~(\mathrm{mol/L})^2. \notag
\end{align}

Initially there are only $\mathrm{Ag^+}$ and $\mathrm{Cl^-}$ ions, so by charge neutrality their concentrations have to be equal, and we find $c_\mathrm{Ag^+} = c_\mathrm{Cl^-} = \sqrt{c_\mathrm{Ag^+} c_\mathrm{Cl^-}} = 1.33\times10^{-5}~\mathrm{mol/L}$. This also means the standard states $V^\circ_\mathrm{Ag^+}$, $V^\circ_\mathrm{Cl^-}$ have to fit equidistantly from $V_\mathrm{Ag^+}$ and $V_\mathrm{Cl^-}$ respectively.

When we add some $\mathrm{KCl}$ and/or $\mathrm{AgNO_3}$ salt, we are controlling $c_\mathrm{K^+}$ and $c_\mathrm{NO_3^-}$ and modifying the charge neutrality equilibrium:

$$ c_\mathrm{Ag^+} - c_\mathrm{Cl^-} + c_\mathrm{K^+} - c_\mathrm{NO_3^-}= 0 .$$

And thus, we get a quadratic equation in terms of $c_\mathrm{Ag^+}$ :

$$ (c_\mathrm{Ag^+})^2 - (c_\mathrm{Ag^+} c_\mathrm{Cl^-}) + (c_\mathrm{K^+} - c_\mathrm{NO_3^-}) c_\mathrm{Ag^+} = 0 ,$$

where $(c_\mathrm{Ag^+} c_\mathrm{Cl^-})$ and $(c_\mathrm{K^+} - c_\mathrm{NO_3^-})$ are given values.

</details>

This example also shows how the electrode potential, $E = V_\mathrm{e^-} - V^\circ_\mathrm{H^+}$ (which we will derive in the Potentials topic), is a function of the $c_\mathrm{Cl^-}$ concentration. When we bring our ideal $\mathrm{Cl^-}$ ions up to $c_\mathrm{Cl^-} = c^\circ = 1~\mathrm{mol/L}$, there we find $E = 0.222~\mathrm{V}$, which is the standard electrode potential for the {%wiki "silver chloride electrode" %}.

(In general, with single-solution chemistry we don't see much new insight with the $V_i$ approach compared to the traditional chemistry approach that uses internal chemical potentials. That is because the reactions are strictly charge-neutral and the value of electrostatic potential $\phi$ cancels out.)

{#
## Relation to semiconductor bands

Conceptually, these standard state lines function much like conduction and valence band edges ($E_\mathrm{C}$, $E_\mathrm{V}$) do in semiconductor physics – they act as reference energy/potential levels. The actual potential ($V_i$) deviates from the reference $V^\circ_i$ based on the concentration, just as the Fermi level ($E_\mathrm{F}$) deviates from the band edges based on carrier concentration.

Actually, as we have alluded to before, and we will talk about in much more depth in the Semiconductors topic, we can cram semiconductors into our electrochemical $V_i$ framework too! For silicon we find that $V^\circ_\mathrm{h^+} - V^\circ_\mathrm{e^-} = 1.27~\mathrm{V}$ (for a 1 mol/L reference concentration). I.e. the 'standard state ladder' for a semiconductor really only has two entries, one for conduction band electrons ($\mathrm{e^-}$), and the other for valence band holes ($\mathrm{h^+}$). The reason this 1.27 V value differs from the bandgap of silicon ($E_\mathrm{C} - E_\mathrm{V} = 1.1~\mathrm{eV}$) is simply that the band edges each correspond to less than a 1 mol/L concentration, so, $V^\circ_\mathrm{h^+}$ sits slightly higher than $-E_\mathrm{V}/e$ and $V^\circ_\mathrm{e^-}$ sits slightly lower than $-E_\mathrm{C}/e$.

The above example of salt solubility is also similar to the semiconductor {% wiki "Mass_action_law_(electronics)", "law of mass action" %}; in a semiconductor, $c_{\mathrm{e^-}} c_{\mathrm{h^+}} = (c_\mathrm{i})^2$ for some value $c_\mathrm{i}$, and donor dopants (such as phosphorus $\mathrm{P^+}$) and acceptor dopants (such as boron $\mathrm{B^-}$) play the same role as above in terms of shifting the balance of concentration. The big difference is that $V_\mathrm{h^+} - V_\mathrm{e^-} = 0$ in the semiconductor, instead of maintaining a fixed separation like we saw with a saturated salt..
#}

## Non-ideal solutions

The usual practice to include solute non-idealities is to add an {%wiki "activity coefficient" %} $\gamma_i$ next to $c_i/c^\circ$.

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(\gamma_i c_i/c^\circ). $$

This $\gamma_i$ captures all the deviations from ideality, and of course we have $\gamma_i \rightarrow 1$ as all solutes' concentrations go to zero (including $c_i \rightarrow 0$). We can also write in terms of activity $a_i = \gamma_i c_i/c^\circ$, either is fine.

(Note that this is the _molar_ activity coefficient and _molar_ activity, defined for a particular $c^\circ$! There are also molal, mole fraction, and pressure activities, which can sometimes be similar but they are quantitatively different and each will have a distinct standard state, including different $\mu^\circ_i$ and $V^\circ_i$. [It can get a bit confusing](https://adamprada.net/blog/on-chemical-activities/)!)

For example, with our saturated salt $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = -3.9813~\mathrm{V}$, this would correspond to $c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = 37.8~\mathrm{mol^2/L^2}$ if it were ideal-dilute (using the aqueous $V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-} = -4.0746~\mathrm{V}$). But measurements of the actual amount of $\mathrm{NaCl}$ that we can dissolve in water show instead $c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = 29~\mathrm{mol^2/L^2}$, and so we must have $\gamma_{\mathrm{Na}^+} \gamma_{\mathrm{Cl}^-} = 0.77$.

The above leaves open the question of how much of this non-ideality product is due to $\gamma_{\mathrm{Na}^+}$ and how much due to $\gamma_{\mathrm{Cl}^-}$, but that is actually not answerable since we only have measurement access to $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$, not $V_{\mathrm{Na}^+} - V^\circ_{\mathrm{Na}^+}$. This demonstrates the well-known issue that single-ion activity coefficients are actually ambiguous, and we can only measure charge-neutral products like $\gamma_{\mathrm{Na}^+} \gamma_{\mathrm{Cl}^-}$. Once we permit $\gamma_i \neq 1$ for the solutes, we actually have a degree of freedom in how to allocate non-ideality between different ions, and that shows up as ambiguity in the positioning of the $V^\circ_i$ ladder.

## Takeaways

For the next topic, we'll talk about what happens where two solutions come into contact.

[**NEXT TOPIC: Junctions**](../junctions/)

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