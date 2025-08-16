---
layout: layouts/esbd_topic.njk
title: 'Potentials'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 33
eleventyNavigation:
    key: Potentials # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 33 # Order within the parent menu
---

# {{title}}

So far we've mostly avoided describing the connections to the various potentials found in standard electrochemistry, but let's state them now.

## The electrostatic potential $\phi$

The electrostatic potential inside a material, $\phi$, is nominally of importance in standard electrochemistry, however, it generally cancels out of thermodynamically observable quantities (like cell potentials or equilibrium constants). Indeed, $\phi$ is generally regarded as elusive and unmeasurable, except in specific cases like comparing two bodies of identical composition (where $\Delta\phi = \Delta V_i$ for all species $i$). So far we haven't needed to use $\phi$ in our $V_i$-based diagrams, and so I'll continue with that theme.

## Standard hydrogen electrode (SHE)

A generic hydrogen electrode interconverts hydrogen ions with hydrogen gas, $ \mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H}_2 $, which in terms of $V_i$ gives the equilibrium condition:

$$ V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \frac{\mu_{\mathrm{H}_2}}{2F}. $$

The standard hydrogen electrode (SHE) is an aqueous system defined with the activity of $\mathrm{H}^+$ ions at unity ($a_{\mathrm{H}^+} = 1$), which implies $ V_{\mathrm{H}^+}(\text{SHE}) = V^\circ_{\mathrm{H}^+} $. Furthermore, the SHE is defined with $\mathrm{H}_2$ gas at a standard fugacity (effective pressure) of 1 bar, so we will write its chemical potential as $\mu^\circ_{\mathrm{H}_2}(T)$. Combining the equilibrium condition $V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \mu_{\mathrm{H}_2}/(2F)$ with the standard condition $V_{\mathrm{H}^+}(\text{SHE}) = V^\circ_{\mathrm{H}^+}$, we find:

$$ V_{\mathrm{e}^-}(\text{SHE}) = V^\circ_{\mathrm{H}^+} - \frac{\mu^\circ_{\mathrm{H}_2}(T)}{2F}. $$

A further simplification occurs if we are at the standard reference temperature (usually 25&nbsp;°C): $\mu^\circ_{\mathrm{H}_2}(T) = 0$. Therefore we can say for short that $ V_{\mathrm{e}^-}(\text{SHE}) = V^\circ_{\mathrm{H}^+} $ if we're operating at standard temperature.

Practically, it's not actually necessary to achieve these ideal conditions (such as the extreme pH of 0 implied by $a_{\mathrm{H}^+} = 1$), nor is it even desirable to do so, given the uncertainties about when unit activity is exactly reached. Instead, the most precise determinations of potentials relative to the SHE reference point are made using cells without liquid junctions (like the Harned cell) where measurements are performed in well-defined dilute solutions. The results are then extrapolated back to the idealized standard state conditions. In this sense, any reference to $V_{\mathrm{e}^-}(\text{SHE})$ represents this theoretical, extrapolated potential defined relative to the standard state of the aqueous proton, $V^\circ_{\mathrm{H}^+}$.

## Reduction potentials

Generally, reduction potentials are defined operationally via measurements referenced to the SHE:

$$ E(\text{target}) = V_{\mathrm{e}^-}(\text{target}) - V_{\mathrm{e}^-}(\text{SHE}). $$

(Note that this means the reduction potential of the SHE is defined as zero at all temperatures: $E(\text{SHE}, T) = 0$.)

The key assumption in these measurements is the lack of any kind of junction potential between the target and the SHE. In particular, this means that $V^\circ_{\mathrm{H}^+}$ is the same value for both the solution near the target, and the solution near the SHE.

Substituting the expression we found for $V_{\mathrm{e}^-}(\text{SHE})$:
$$ E(\text{target}, T) = V_{\mathrm{e}^-}(\text{target}, T) - \left[ V^\circ_{\mathrm{H}^+}(T) - \frac{\mu^\circ_{\mathrm{H}_2}(T)}{2F} \right] $$
$$ E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{H}^+} + \frac{\mu^\circ_{\mathrm{H}_2}(T)}{2F} $$

This equation provides the precise link between the reduction potential $E$ and the $V_i$ levels at any temperature $T$. Again, for simplicity, near 25°C where $\mu^\circ_{\mathrm{H}_2}(T) \approx 0$, the small $\mu^\circ_{\mathrm{H}_2}(T)$ can be neglected:

$$ E \approx V_{\mathrm{e}^-} - V^\circ_{\mathrm{H}^+} $$

Since $V^\circ_{\mathrm{H}^+}$ itself serves as a reference point for the $V^\circ_{i}$ standard state ladder, this means the reduction potential describes the position of the electron species voltage relative to the standard state ladder.

## Electrode potentials

Electrode potentials are closely related to reduction potentials, and usually defined the same way. But, we sometimes see an expression $E = -\tfrac{1}{F}\bar\mu_{\mathrm{e}^-} - \phi_{\text{(soln)}}$ ([Trasatti 1986](https://publications.iupac.org/pac/1986/pdf/5807x0955.pdf)) for the electrode potential. This is a more abstract form of single electrode potential that is referenced to the unmeasurable $\phi$ instead of the SHE. Differences of $E$'s will of course match, as the $V^\circ_{\mathrm{H}^+}$ or $\phi_{\text{(soln)}}$ will just cancel out.

Nevertheless, the *standard* electrode potential and *standard* reduction potential (defined next) are both defined in reference to the SHE.

There is also the so-called "absolute electrode potential" which instead is $V_{\mathrm{e}^-} - \phi_{\mathrm{vac}}$, where $\phi_{\mathrm{vac}}$ is the (measurable!) electrostatic potential just above the solution surface, in vacuum. Although absolute electrode potential is measurable (with difficulty and uncertainty), it is of limited utility. Absolute electrode potential is really a surface-specific quantity, analogous to work function, and its value is of limited value for any application that doesn't literally involve charges moving through the vacuum above the solution surface. You can try to use it to estimate interface properties using a vacuum-contact assumption, but as I'll argue in a later topic, [this is often far from correct](../phi/) as it misses specific interface interactions.

## Standard reduction potentials

Also known as the standard electrode potential, the standard reduction potential $E^\circ$ is the reduction potential for a reaction that involves species in their standard states. In particular this means that dissolved ions are at a hypothetical ideally-dilute concentration of $c^\circ = 1~\mathrm{mol/L}$; practically this means that these standard reduction potentials are best extrapolated from dilute solutions.

It is also assumed that the temperature is 25&nbsp;°C and the pressure is 1 bar. (Actually, 1 atm is commonly used, which tweaks $\mu_{\mathrm{H}_2} / 2F$ by a millivolt-level correction, but we'll ignore that.)

The consequence of the standard-ideal-concentration (or unit activity) condition is that all $V_i$ for dissolved ions are replaced by $V^\circ_i$.

For example, consider metal ions and their reduction reaction at their solid metal electrode:

$$ \mathrm{M}^{n+} + n \mathrm{e}^- \rightleftharpoons \mathrm{M(s)} , $$

giving as usual our $V_i$ difference:

$$ V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \frac{1}{nF} \mu_{\mathrm{M(s)}} .$$

For the standard reduction potential, then the $\mathrm{M}^{n+}$ ions have unit activity ($V_{\mathrm{M}^{n+}} = V^\circ_{\mathrm{M}^{n+}}$). Plugging the above definition of $E$, we get:

$$ E^\circ_{\mathrm{M}} = V^\circ_{\mathrm{M}^{n+}} - V^\circ_{\mathrm{H}^+} .$$

(where we have used $\mu^\circ_{\mathrm{M(s)}} = 0 $ and $\mu^\circ_{\mathrm{H}_2} = 0$ under these standard conditions)

Thus, our $V^\circ_i$ ladder (relative to $V^\circ_{\mathrm{H}^+}$) directly maps onto the standard reduction potentials $E^\circ_{\mathrm{M}}$.

## Takeaways

For the next topic, we'll cover the pH, a standard measure of acidity.

[**NEXT TOPIC: pH**](../pH/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}
