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

On a purely exact thermodynamic level, we can talk about having a solid compound such as $\mathrm{NaCl}$ in equilibrium with a solvent (such as water), where part of it dissolves and dissociates into $\mathrm{Na}^+$ and $\mathrm{Cl}^-$ ions and saturates the solvent, leading to

$$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}= \frac{1}{F}\mu_{\mathrm{NaCl}} = -3.9813~\mathrm{V}.$$

This value of $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ is a thermodynamic guarantee for an $\mathrm{NaCl}$-saturated solution, at least for the standard conditions (25&nbsp;°C, 1 bar) listed in the table where I found the value $\mu_{\mathrm{NaCl}} = -384.14~\mathrm{kJ/mol}$. Its value will not change depending on solvent nor the presence of any other ions in solution.

But suppose we only dissolve a small amount of salt, then $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ will be a lower value than its saturated value. How _exactly_ does the $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ difference depend on concentration? And what if there are many ions present, then how much of each ion do we have and where do all their $V_i$'s lie in relation to each other?

For this topic, we'll focus primarily on the _ideally dilute_ case, and put off discussions of the (surprisingly tricky!) concept of ion activities until we get to the advanced topics.

## Ideally dilute and the standard species voltage $V^\ominus_i$

A familiar expression from chemistry is the dependence of a solute's chemical potential on its concentration $c$:
$$ \mu_i(c_i) \approx \mu^\ominus_i + RT \ln(c_i/c^\ominus) $$
This approximation only holds for small $c$ values, but it captures a behaviour known as _ideally dilute_. Here, $c^\ominus$ is a reference concentration level of 1 mol/L, and $\mu^\ominus_i$ is a reference value that extrapolates the value $\mu_i(c^\ominus)$ based off its behaviour in the infinite dilution limit. The reason for this logarithmic dependence on $c_i$ is fundamental and entropic, having to do with each particle in $c_i$ acting independently and exploring the volume of the solvent.

Chemists have done heroic work cataloguing $\mu^\ominus_i$ values for various solutes in various solvents, in the form of molar standard Gibbs energies of formation for solutes. And, we have adopted the convention that $\mu$ is be equal to Gibbs formation energy, so these tables directly give us $\mu^\ominus_i$, at least for the standard conditions listed in the data source.

Well, let's try adapting that equation to ions. No problem, we just use the electrochemical potential:

$$ \bar\mu_i(c_i) \approx \bar\mu^\ominus_i + RT \ln(c_i/c^\ominus). $$

But, remember how $\bar\mu_i$ had the charge-dependent offset? Well, that must affect its reference value $\bar\mu^\ominus_i$ too. OK, well, let's just force that reference value into a species voltage too! _Divide all the things_ by $z_i F$!

$$ V_i(c_i) \approx V^\ominus_i + \frac{RT}{z_i F} \ln(c_i/c^\ominus). $$

The following is the operational definition of $V^\ominus_i$ by the way: make the above curve approach accuracy as we approach pure solvent. (i.e., as _all the solutes_' concentrations go to zero, including ion $i$.)

OK, so that is still kind of of like our familiar neutral solutes' $\mu_i(c_i)$ equation, except:
* Cations: Still $V_{\mathrm{X}^+}$ does grow higher relative to $V^\ominus_{\mathrm{X}^+}$ as concentration $c_i$ increases.
* Anions: Now $V_{\mathrm{Y}^-}$ _goes lower_ relative to $V^\ominus_{\mathrm{Y}^-}$ as concentration increases!
* Higher charges: For a strong ion with charge $|z|>1$, its $V_{\mathrm{Z}^z}$ moves proportionally slower relative to $V^\ominus_{\mathrm{Z}^z}$ as concentration increases!

For example, for an ×10 ('decade') concentration increase at room temperature, the change $V_i - V^\ominus_i$ would be $\frac{RT}{z_i F}\ln(10)$. That would be +59&nbsp;mV/decade for a 1+ ion, and -20&nbsp;mV/decade for a 3- ion.

## The $V^\ominus_i$ standard state ladder

We now have this $V^\ominus_i$, which unfortunately _cannot_ be tabulated since it is sensitive to arbitrary electrostatic offsets. We're not stuck though, as we can compare the relative $V^\ominus_i$ values of different ions. As we've seen, _differences_ in $V_i$'s are insensitive to the electrostatic offset, and that now includes $V^\ominus_i$'s too. So _differences_ in $V^\ominus_i$ are **electrically-invariant** properties of the solvent. And they are going to be **concentration-invariant** too (since they apply to the ideally dilute limit). Here are a number of selected $V^\ominus_i$ values for real water, with an arbitrary offset:

(... ELD DIAGRAM GOES HERE ...)

I call this the **standard state ladder** for water. The standard state ladder is a rigid ladder: as we change the electrical or chemical conditions of the solution, the $V^\ominus_i$ values may move up and down but they have to all stay rigidly locked to one another. In contrast, $V_i$ values are not rigid and will change with composition.

In effect, the standard state ladder of $V^\ominus_i$ is a stand-in for the notion of electrostatic potential $\phi$, but combining it with the average differences in the local electrostatic potentials that each ion 'feels', as well the ion's chemical structure, and the way it disturbs its solvent environment with "solvation shells". Conversely, we can imagine $\phi$ as the single degree of freedom describing the offset of the rigid ladder. Specifically, the usual convention for $\phi$ sets it at exactly $V^\ominus_{\mathrm{H^+}}$.

For the interested, let's see how I calculated those values from existing chemical literature:

<details>
<summary>
Click to open ion $V^\ominus_i$ table.
</summary>
When you look at a table of Gibbs energy of formation, the values for ions are _internal_: $\mu^\ominus_{\mathrm{int},i}$, which defines $\bar\mu^\ominus_i = \mu^\ominus_{\mathrm{int},i} + z_i F \phi$ according to whatever convention of $\phi$ was used for that solvent. Using this and $V^\ominus_i = \bar\mu^\ominus_i/(z_i F)$, we get (the $\phi$'s cancel):

$$V^\ominus_i - V^\ominus_j = \frac{\mu^\ominus_{\mathrm{int},i}}{z_i F} - \frac{\mu^\ominus_{\mathrm{int},j}}{z_j F}. $$

This means we can re-tabulate all the $V^\ominus_i$ using any one of them as a common reference.

Here I've taken some selected ionic thermodynamic data from Atkins' _Physical Chemistry_ (8th edition, Table 2.7 in the back pages), and converted them. Note these are all for:

* **ideally dilute** ions in **water**,
* at 298 K and 1 bar,
* a reference ionic concentration of $c^\ominus = 1~\mathrm{mol/L}$, and,
* all referenced to $V^\ominus_{\mathrm{H}^+}$.

| Ion $i$ | $\Delta_{\mathrm{f}} G^\ominus$ (kJ/mol) | $V^\ominus_i - V^\ominus_{\mathrm{H}^+}$ (V) |
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

(We also see on the $\Delta_{\mathrm{f}} G^\ominus$ tables that $\mathrm{H}^+$ is often defined to have exactly 0 standard Gibbs energy of formation. This will have no effect on us as it's more related to defining $\phi$, which we will talk about in our later topic Potentials.)

</details>

## Example: common-ion effect

Earlier in the Electrodes topic we talked about the silver / silver chloride electrode. Let's consider what happens when we dissolve some potassium chloride salt into its solution:

{% include "esbd-diagrams/esbd-agcl-kcl-common-ion.html" %}

The solution is initially saturated with $\mathrm{AgCl}$, and as you can see, adding $\mathrm{KCl}$ causes the concentration of $\mathrm{Ag^+}$ ions to decrease. This is known as a {%wiki "common-ion effect" %}. Visually, we can see that adding the $\mathrm{KCl}$ pushes up the standard state ladder in order to increase the $\mathrm{Cl^-}$ concentration. Since the ladder is rigid, this also moves $V^\ominus_\mathrm{Ag^+}$ away from $V_\mathrm{Ag^+}$ thereby decreasing its concentration. If we were to do this experiment, we would likely see the solution turn cloudy with $\mathrm{AgCl}$ precipitates, but the excess $\mathrm{AgCl}$ could also collect on the electrode.

And, this relates to the saturated salt defining a solubility product, which we can calculate from the diagram too:
$$c_\mathrm{Ag^+} \cdot c_\mathrm{Cl^-} = 1.76\times 10^{-10}~(\mathrm{mol/L})^2.$$

We may also consider adding a common-cation salt like silver nitrate, donating $\mathrm{Ag^+}$ and $\mathrm{NO_3^-}$ ions. In that case, it will suppress the $\mathrm{Cl^-}$ concentration instead. And if we added both $\mathrm{KCl}$ and $\mathrm{AgNO_3}$ into the same beaker, we'd see massive precipitation of $\mathrm{AgCl}$ as we cannot exceed the solubility product. (In the above diagram, you can enable this with a checkbox.)

<details>
<summary>
The math.
</summary>
Using our definition equation for $V^\ominus_i$, we have:

$$ c_\mathrm{Ag^+} = c^\ominus \exp(+\tfrac{F}{RT}(V_\mathrm{Ag^+} - V^\ominus_\mathrm{Ag^+})). $$
$$ c_\mathrm{Cl^-} = c^\ominus \exp(-\tfrac{F}{RT}(V_\mathrm{Cl^-} - V^\ominus_\mathrm{Cl^-})). $$

Here, under all conditions the saturated $\mathrm{AgCl}$ sets $V_\mathrm{Ag^+} - V_\mathrm{Cl^-} = \tfrac{1}{F}\mu_\mathrm{AgCl} = -1.1379~\mathrm{V}$, whereas $V^\ominus_\mathrm{Ag^+} - V^\ominus_\mathrm{Cl^-} = -0.5609~\mathrm{V}$. We are also at temperature $\tfrac{RT}{F} = 0.02569~\mathrm{V}$. Thus:

\begin{align}
c_\mathrm{Ag^+} \cdot c_\mathrm{Cl^-} & = (c^\ominus)^2 \exp(\tfrac{F}{RT} [V_\mathrm{Ag^+} - V_\mathrm{Cl^-} - (V^\ominus_\mathrm{Ag^+} - V^\ominus_\mathrm{Cl^-})]) \notag \\\\
& = \exp \bigg(\frac{-1.1379~\mathrm{V} + 0.5609~\mathrm{V}}{0.02569~\mathrm{V}} \bigg) \notag \\\\
& = 1.76\times 10^{-10}~(\mathrm{mol/L})^2, \notag
\end{align}

And this value is independent of the relative shift of the $V_i$'s vs. the $V^\ominus_i$'s.

Initially there are only $\mathrm{Ag^+}$ and $\mathrm{Cl^-}$ ions, so by charge neutrality their concentrations have to be equal, and we find $c_\mathrm{Ag^+} = c_\mathrm{Cl^-} = \sqrt{c_\mathrm{Ag^+} \cdot c_\mathrm{Cl^-}} = 1.33\times10^{-5}~\mathrm{mol/L}$. This also means the standard states $V^\ominus_\mathrm{Ag^+}$, $V^\ominus_\mathrm{Cl^-}$ have to fit equidistantly from $V_\mathrm{Ag^+}$ and $V_\mathrm{Cl^-}$ respectively.

When we add some $\mathrm{KCl}$ and/or $\mathrm{AgNO_3}$ salt, we are controlling $c_\mathrm{K^+}$ and $c_\mathrm{NO_3^-}$ and modifying the charge neutrality equilibrium:

$$ c_\mathrm{Ag^+} - c_\mathrm{Cl^-} + c_\mathrm{K^+} - c_\mathrm{NO_3^-}= 0 .$$

And thus, we get a quadratic equation in terms of $c_\mathrm{Ag^+}$ :

$$ (c_\mathrm{Ag^+})^2 - (c_\mathrm{Ag^+} \cdot c_\mathrm{Cl^-}) + (c_\mathrm{K^+} - c_\mathrm{NO_3^-}) c_\mathrm{Ag^+} = 0 ,$$

where $(c_\mathrm{Ag^+} \cdot c_\mathrm{Cl^-})$ and $(c_\mathrm{K^+} - c_\mathrm{NO_3^-})$ are given values.

</details>

This example also shows how the electrode potential, $E = V_\mathrm{e^-} - V^\ominus_\mathrm{H^+}$ (which we will derive in the Potentials topic), is a function of the $c_\mathrm{Cl^-}$ concentration. When we bring our ideal $\mathrm{Cl^-}$ ions up to $c_\mathrm{Cl^-} = c^\ominus = 1~\mathrm{mol/L}$, there we find $E = 0.222~\mathrm{V}$, which is the standard electrode potential for the {%wiki "silver chloride electrode" %}.

## Relation to semiconductor bands

Conceptually, these standard state lines function much like conduction and valence band edges ($E_\mathrm{C}$, $E_\mathrm{V}$) do in semiconductor physics – they act as reference energy/potential levels. The actual potential ($V_i$) deviates from the reference $V^\ominus_i$ based on the concentration, just as the Fermi level ($E_\mathrm{F}$) deviates from the band edges based on carrier concentration.

Actually, as we have alluded to before, and we will talk about in much more depth in the Semiconductors topic, we can cram semiconductors into our electrochemical $V_i$ framework too! For silicon we find that $V^\ominus_\mathrm{h^+} - V^\ominus_\mathrm{e^-} = 1.27~\mathrm{V}$ (for a 1 mol/L reference concentration). I.e. the 'standard state ladder' for a semiconductor really only has two entries, one for conduction band electrons ($\mathrm{e^-}$), and the other for valence band holes ($\mathrm{h^+}$). The reason this 1.27 V value differs from the bandgap of silicon ($E_\mathrm{C} - E_\mathrm{V} = 1.1~\mathrm{eV}$) is simply that the band edges each correspond to less than a 1 mol/L concentration, so, $V^\ominus_\mathrm{h^+}$ sits slightly higher than $-E_\mathrm{V}/e$ and $V^\ominus_\mathrm{e^-}$ sits slightly lower than $-E_\mathrm{C}/e$.

The above example of salt solubility is also similar to the semiconductor {% wiki "Mass_action_law_(electronics)", "law of mass action" %}; in a semiconductor, $c_{\mathrm{e^-}} c_{\mathrm{h^+}} = (c_\mathrm{i})^2$ for some value $c_\mathrm{i}$, and donor dopants (such as phosphorus $\mathrm{P^+}$) and acceptor dopants (such as boron $\mathrm{B^-}$) play the same role as above in terms of shifting the balance of concentration.

## Takeaways

For the next topic, we'll talk about what happens where two solutions come into contact.

[**NEXT TOPIC: Junctions**](../junctions/)

## Optional discussion

Chemists may be begging me to introduce activities and activity coefficients, and go beyond the ideally dilute limit. Fair enough! We'll get more into that in the later topic about non-ideal solutions, but let's talk a bit about that now:

<details>
<summary>
Click to open extended discussion.
</summary>

Yes, you are right, we can just tack on in the (molar) activity activity coefficient $\gamma_i$ next to $c_i/c^\ominus$!

$$ V_i = V^\ominus_i + \frac{RT}{z_i F} \ln(\gamma_i c_i/c^\ominus). $$

(Or, define activity $a_i = \gamma_i c_i/c^\ominus$, but let's just stick to $\gamma_i$.) 

Of course, $\gamma_i \rightarrow 1$ as all solutes' concentrations go to zero (including $c_i \rightarrow 0$). This is a perfectly legitimate mathematical re-representation of the electrochemical potentials into two numbers $V^\ominus_i$ and $\gamma_i$. Now we can pack all the imperfections into $\gamma_i$.

However...

You may have heard that single-ion activities are ill defined, or unmeasurable; or, that only mean ionic activity coefficients can be measured. That is the truth, and let's talk about why that is the case.

Suppose we have solution of specific composition, containing various ions and solutes, at known concentrations $c_i$, and certain measurable values of ionic $V_i$. We have somehow determined a collection of $\gamma_i$ values that correctly and consistently relate the various $V_i$ to their $V^{\ominus}_i$. All seems good, but our conclusion is non-unique.

The following transformation produces an equally valid collection of values $\gamma_i '$ and ${V^{\ominus}_i}'$:

$$ \gamma_i ' = \gamma_i \exp([z_i F / (RT)] \cdot \psi) , $$

$$ {V^{\ominus}_i}' = V^{\ominus}_i - \psi , $$

for any value of $\psi$. For example, with $\psi=-59~\mathrm{mV}$ we can lower the entire $V^{\ominus}_i$ ladder by 59 mV, and multiply $\gamma_i$ for $\mathrm{X^+}$ ions by ×10, multiply $\gamma_i$ for $\mathrm{Y^{2-}}$ ions by ×0.01, and so on. If you are using electrostatic potential $\phi$, then $\phi' = \phi - \psi$ too. The problem is, we can't tell the difference, because all we can measure are $c_i$ and $V_i$.

The arbitrariness is _severe_: we can choose a different value of $\psi$ for every possible composition of solution at every temperature and every pressure, completely arbitrarily. It would make no measurable difference. **Once we permit the presence of activity coefficients, we no longer have _any_ anchor on how to offset the $V^{\ominus}_i$ ladder**, nor the electrostatic potential $\phi$.

The only unambiguously measureable ion activity coefficients are charge-neutral products like $\gamma_{\mathrm{Na}^+}\cdot\gamma_{\mathrm{Cl}^-}$, or $\sqrt{\gamma_{\mathrm{Zn}^{2+}}} \cdot \gamma_{\mathrm{Cl}^-}$ where the $\psi$ arbitrariness cancels out. These charge-neutral $\gamma_i$ products are the mean activity coefficients, and they directly relate to measurable balanced differences like $\sum_i w_i V_i$ with $\sum_i w_i = 0$.

Anyway, that is one reason I'm just going to focus on ideal dilute case for now. There's a lot more to say on this, but I'll leave that for the dedicated topic on non-ideal solutions.

</details>

{#
Neutral, or internal chem pot
$$\mu_i = \underbrace{\mu^\ominus_i}_{\text{standard}} + \underbrace{RT \ln a_i}_{\text{active}}$$

Grouping typical:
$$\bar\mu_i = \underbrace{z_i F\phi}_{\text{electric}} + \underbrace{\mu^\ominus_i + RT \ln a_i}_{\text{chemical}}$$

Alternate grouping:
$$\bar\mu_i = \underbrace{z_i F\phi + \mu^\ominus_i}_{\text{``electro-standard''}} + \underbrace{RT \ln a_i}_{\text{active}}$$

$$V_i = \big[\phi + \tfrac{1}{z_i F} \mu^\ominus_i \big] + \tfrac{RT}{z_i F} \ln a_i$$

$$V_i = V^\ominus_i + \tfrac{RT}{z_i F} \ln a_i$$

$$V^\ominus_i = \phi + \tfrac{1}{z_i F} \mu^\ominus_i$$
#}