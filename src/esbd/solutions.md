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

On a purely exact thermodynamic level, we can talk about having a solid compound such as $\mathrm{NaCl}$ in equilibrium with water, where part of it dissolves and dissociates into $\mathrm{Na}^+$ and $\mathrm{Cl}^-$ ions, leading to

$$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}= \frac{1}{F}\mu_{\mathrm{NaCl}} \approx -4.0~\mathrm{V}.$$

This is going to correspond to some specific saturated concentration, which we can of course measure.

But suppose we only dissolve a small amount of salt, then $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ will be a lower value than its saturated value. How _exactly_ does the $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ difference depend on concentration? And what if there are many ions present, then how much of each ion do we have and where do all their $V_i$'s lie in relation to each other?

For this topic, we'll focus primarily on the _ideally dilute_ case, and put off discussions of the (surprisingly tricky!) ion activities until we get to the advanced topics.

## Ideally dilute

A familiar expression from chemistry is the dependence of a solute's chemical potential on its concentration $c$:
$$ \mu_i(c) \approx \mu^\ominus_i + RT \ln(c/c^\ominus) $$
This approximation only holds for small $c$ values, but it captures a behaviour known as _ideally dilute_. Here, $c^\ominus$ is a reference concentration level of 1 mol/L, and $\mu^\ominus_i$ is a reference value that extrapolates the value $\mu_i(c^\ominus)$ based off its behaviour in the infinite dilution limit. Chemists have done great work cataloguing $\mu^\ominus_i$ values for various solutes, in the form of molar Gibbs energies of formation for solutes (which, remember, we directly map to $\mu$!).

Well, let's try adapting that equation to ions. No problem, we just use the electrochemical potential:

$$ \bar\mu_i(c) \approx \bar\mu^\ominus_i + RT \ln(c/c^\ominus). $$

But, remember how $\bar\mu_i$ had the charge-dependent offset? Well, that must affect its reference value $\bar\mu^\ominus_i$ too. OK, well, let's just force that reference value into a species voltage too! Divide _all the things_ by $z_i F$!

$$ V_i(c) \approx V^\ominus_i + \frac{RT}{z_i F} \ln(c/c^\ominus). $$

OK, so that is still kind of of like our neutral solutes' $\mu_i(c)$ equation, except:
* Cations: Still $V_{\mathrm{X}^+}$ does grow higher relative to $V^\ominus_{\mathrm{X}^+}$ as concentration increases.
* Anions: Now $V_{\mathrm{Y}^-}$ _goes lower_ relative to $V^\ominus_{\mathrm{Y}^-}$ as concentration increases!
* Higher charges: For an ion with charge $|z_i|>1$, its $V_i$ moves proportionally slower relative to $V^\ominus_i$ as concentration increases!

For example, for a 10x ('decade') concentration increase at room temperature, the relative voltage's change $\frac{RT}{z_i F}\ln(10)$ is +59&nbsp;mV/decade for a 1+ ion, and would be -20&nbsp;mV/decade for a 3- ion.

## Standard state ladder

We now have this $V^\ominus_i$, which unfortunately _cannot_ be tabulated since it is sensitive to arbitrary electrostatic offsets. We're not stuck though, as we can compare the relative $V^\ominus_i$ values of different ions. As we've seen, differences in $V_i$'s are insensitive to the electrostatic offset, and they are going to be invariant properties of the solvent in question. Let's see how we can get these values from existing chemical literature.

When you look at a table of Gibbs energy of formation, the values for ions are _internal_: $\mu^\ominus_{\mathrm{int},i}$, which defines $\bar\mu^\ominus_i = \mu^\ominus_{\mathrm{int},i} + \phi$ according to whatever convention of $\phi$ was used for that solvent. Using this, we get (the $\phi$'s cancel):

$$V^\ominus_i - V^\ominus_j = \frac{\mu^\ominus_{\mathrm{int},i}}{z_i F} - \frac{\mu^\ominus_{\mathrm{int},j}}{z_j F}. $$

Thus we find for example that in water, $V^\ominus_{\mathrm{Na}^+} - V^\ominus_{\mathrm{Cl}^-} = -4.0746~\mathrm{V}$ -- this is the _extrapolated_ estimate of $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ that we would get if both sodium and chloride ions were present at each a concentration of 1 mol/L. Going to a more ideal concentration of 0.001 mol/L, then $\log_{10}(c/c^\ominus) = -3$, and $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = -4.43~\mathrm{V}$.

We also see on the tables that $\mathrm{H}^+$ is often defined to have exactly 0 standard Gibbs energy of formation, which we won't rely on, but it is interesting nonetheless.

In any case, we can tabulate all the $V^\ominus_i$ using any one of them as a common reference (let's use $V^\ominus_{\mathrm{H}^+}$). Here I've taken some selected values from Atkins' _Physical Chemistry_ (8th edition, Table 2.7 in the back pages), and converted them. Note these are all for **dilute ions in water** at 298 K and 1 bar.

| Ion $i$ | $\Delta_{\mathrm{f}} G^\ominus$ (kJ/mol) | $V^\ominus_i - V^\ominus_{\mathrm{H}^+}$ in (V) |
| ---: | ---: | ---: |
| a | b | c |
| a | b | c |
| a | b | c |
| a | b | c |


When it comes to particles in 

$$\bar\mu_i = z_i F\phi + \mu^\ominus_i + RT \ln a_i$$

Ideal-dilute. Molar.

$$a_i = \gamma_i \frac{c}{c^\ominus}$$

Where $\gamma_i \rightarrow 1$ as $c\rightarrow 0$. The $\mu^\ominus_i$ are tabulated and $\gamma_i$ can be tricky (especially for ions).

Neutral, or internal chem pot for
$$\mu_i = \underbrace{\mu^\ominus_i}_{\text{standard}} + \underbrace{RT \ln a_i}_{\text{active}}$$

Grouping typical:
$$\bar\mu_i = \underbrace{z_i F\phi}_{\text{electric}} + \underbrace{\mu^\ominus_i + RT \ln a_i}_{\text{chemical}}$$

Alternate grouping:
$$\bar\mu_i = \underbrace{z_i F\phi + \mu^\ominus_i}_{\text{electro-standard}} + \underbrace{RT \ln a_i}_{\text{active}}$$

$$V_i = \big[\phi + \tfrac{1}{z_i F} \mu^\ominus_i \big] + \tfrac{RT}{z_i F} \ln a_i$$

$$V_i = V^\ominus_i + \tfrac{RT}{z_i F} \ln a_i$$

$$V^\ominus_i = \phi + \tfrac{1}{z_i F} \mu^\ominus_i$$

$V^\ominus_i$ is rigid ladder. Show values.



## Takeaways

For the next topic, we'll talk about what happens where two solutions come into contact.

[**NEXT TOPIC: Junctions**](../junctions/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}

{#
"...These standard state potentials (V^⊖ᵢ or Y^⊖ᵢ) form a rigid 'ladder' whose relative positions are fixed by thermodynamics. Conceptually, these standard state lines function much like conduction and valence band edges (E<sub>C</sub>, E<sub>V</sub>) do in semiconductor physics – they act as reference energy/potential levels. The actual potential (Vᵢ) deviates from this reference based on the 'filling level' or activity (aᵢ), just as the Fermi level (μ̄ₑ⁻) sits relative to the band edges based on carrier concentration. (For readers interested in the precise mathematical relationship between standard states and band edge energies, which involves factors like effective mass and temperature, please see the Appendix.)"
#}