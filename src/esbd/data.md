---
layout: layouts/esbd_topic.njk
title: 'Standard state data'
tags: [page, esbd_topic]
orderESBD: 80
eleventyNavigation:
    key: Data
    parent: ESBD
    order: 80
---

# {{title}}

## Standard state ladder data (aqueous)

Here is the data table of relative $V^\circ_i$ values for water, that was plotted in the [Solutions](../solutions/) topic. These are converted from Atkins' _Physical Chemistry_ (8th edition, Table 2.7 in the back pages). Note these are all:

* for **ideally dilute** ions in **water**,
* at 298 K and 1 bar,
* using a reference ionic concentration of $c^\circ = 1~\mathrm{mol/L}$ (actually for molality $b^\circ = 1~\mathrm{mol/kg}$, but for pure water these are equivalent)
* continuing our usual convention that neutral chemical potentials are equal to the Gibbs formation energies (see below for how this works technically).

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
| $\mathrm{H}^{+}$ | 0.&#8199;&#8199;&#8199; | 0.&#8199;&#8199;&#8199;&#8199;&#8199; |
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

Some readers will notice that many of these entries coincide with {% wiki "Standard electrode potential (data page)", "standard electrode potentials" %}, and that is for good reason! For elemental metals (with $\mu_{\mathrm{M}}=0$ under our convention) in equilibrium with an ideal-dilute $c^\circ$ concentration of their ion $\mathrm{M}^{n+}$, we do expect $E = V^\circ_{\mathrm{M}^{n+}} - V^\circ_{\mathrm{H}^+}$.

Here is the plot again; note that a few of these values were omitted from the plot due to overlapping too tightly or being too extreme.

{% include "esbd-diagrams/V-std-ladder.html" %}

## A subtle technicality with a happy ending

Chemical tables like Atkins' commonly list standard Gibbs energy of formation, $\Delta_{\mathrm{f}} G^\circ_i$, for ionic solutes in water. But what do these values *actually* mean? We want to continue our usual convention that chemical potentials equal the molar Gibbs energy of formation but we have to be careful here.

This chemical data is only for bulk homogeneous solutions, which requires charge neutrality. So suppose we add ionic species $i$ and $j$ in charge-neutral amounts, that means we add 1 mole of $i$ and $-z_i/z_j$ moles of $j$, and the *standard state of this neutral combination* is:

$$
\Delta_{\mathrm{f}} G^\circ_{\text{$i$ with $j$}}
= \Delta_{\mathrm{f}} G^\circ_i - \frac{z_i}{z_j}\Delta_{\mathrm{f}} G^\circ_j.
$$

This seems so complex but it reflects the reality that we can't measure the standard state of $\mathrm{H}^+$ alone. Rather we experimentally measure, say, the standard state of aqueous $\mathrm{HCl}$ that dissociates into $\mathrm{H}^+$ and $\mathrm{Cl}^-$, and all we really learn is that $\Delta_{\mathrm{f}} G^\circ_{\mathrm{H}^+\text{ with }\mathrm{Cl}^-} = -131.23~\mathrm{kJ/mol}$.

> Note that all of these equations leave one degree of freedom unsatisfied. Accordingly, the table makers freely choose $\Delta_{\mathrm{f}} G^\circ_{\mathrm{H}^+} = 0$. In fact we even assert this to be 0 at all temperatures, so the standard entropy of $\mathrm{H}^+$ is zero, and the standard entropy for some other ions is negative!

Now, we assert our convention that charge-neutral chemical potentials are equal to Gibbs formation energies, but we only apply it to that charge-neutral measurable difference:

$$ \mu^\circ_{\text{$i$ with $j$}} = \Delta_{\mathrm{f}} G^\circ_{\text{$i$ with $j$}} , $$

so,

$$ \mu^\circ_{\mathrm{int},i} - \frac{z_i}{z_j}\mu^\circ_{\mathrm{int},j} = \Delta_{\mathrm{f}} G^\circ_i - \frac{z_i}{z_j}\Delta_{\mathrm{f}} G^\circ_j . $$

And finally, we can bring in $V^\circ_i$, using $\mu^\circ_{\mathrm{int},i} = z_i F (V^\circ_i - \phi)$ and $\mu^\circ_{\mathrm{int},j} = z_j F (V^\circ_j - \phi)$, divide both sides by $z_i F$, and we have a beautiful result:

$$V^\circ_i - V^\circ_j = \frac{\Delta_{\mathrm{f}} G^\circ_i}{z_i F} - \frac{\Delta_{\mathrm{f}} G^\circ_j}{z_j F}. $$

So, we can trivially re-tabulate all the $\Delta_{\mathrm{f}} G^\circ_i$ values into a $V^\circ_i$-differences table.

And, to clarify, this means we have the following relationship:

$$ \mu^\circ_{\mathrm{int},i} = \Delta_{\mathrm{f}} G^\circ_i + \lambda, $$

for some value of $\lambda$ that we simply do not know, nor do we need to know it in order to get our $V^\circ_i$'s. The value of $\lambda$ depends on solvent, temperature, and pressure, and especially it depends on how we defined $\phi$, and this broad freedom is what lets chemists keep $\Delta_{\mathrm{f}} G^\circ_{\mathrm{H}^+} = 0$ for all situations.