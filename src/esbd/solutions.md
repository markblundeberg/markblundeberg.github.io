---
layout: layouts/base.njk
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

$$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}= \frac{1}{F}\mu_{\mathrm{NaCl}} \approx ~ -4.1~\mathrm{V}.$$

This is going to correspond to some specific saturated concentration, which we can of course measure. But suppose we fully dissolve the salt, and it has a lower than saturated concentration, then $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ will have a lower value than its saturated value. How _exactly_ does the $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ difference depend on concentration? And what if there are many ions present, then how much of each ion do we have and where do all their $V_i$'s lie in relation to each other?

## Standard states

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