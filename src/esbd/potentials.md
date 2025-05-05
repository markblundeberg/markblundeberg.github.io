---
layout: layouts/esbd_topic.njk
title: 'Potentials'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 6
eleventyNavigation:
    key: Potentials # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 1 # Order within the parent menu
---

# {{title}}

So far we've mostly avoided describing the connections to the various potentials found in standard electrochemistry, but let's state them now.

## The electrostatic potential $\phi$

The electrostatic potential inside a material is nominally of importance in standard electrochemistry, yet, with our $V_i$'s and band diagrams, so far we have avoided relying on it. This is not particularly surprising since the values of $\phi$ generally tend to cancel out in every thermodynamic observable, and indeed $\phi$ is generally regarded as unmeasurable, except when comparing two bodies of exactly identical composition (in which case $\Delta\phi = \Delta V_i$). Since $\phi$ is not thermodynamically important, I will continue with the trend of trying to refer to $\phi$ as little as possible.

Inside of a dilute solution, we know that $\phi$ sits somewhere on our 'standard state ladder' of $V^\circ_i$'s, but, I honestly don't know where that would be. If we did take $\mu^\circ_{\mathrm{int},\mathrm{H}^+} = 0$ for the solvent, then that would imply $\phi = V^\circ_{\mathrm{H}^+}$, however that would just be a convention and it would not correspond to any sort of average microscopic potential in the solvent.

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

This equation provides the precise link between the reduction potential $E$ and the $V_i$ levels at any temperature $T$. Again, for simplicity, near 25°C where $\mu^\circ_{\mathrm{H}_2}(T) \approx 0$, the small $\mu^\circ_{\mathrm{H}_2}(T)$ term is neglected:

$$ E \approx V_{\mathrm{e}^-} - V^\circ_{\mathrm{H}^+} $$

(And this corresponds to a sometimes-seen expression $E = -\tfrac{1}{F}\bar\mu_{\mathrm{e}^-} - \phi_{\text{(soln)}}$.)

Since $V^\circ_{\mathrm{H}^+}$ itself serves as a reference point for the $V^\circ_{i}$ standard state ladder, this means the reduction potential describes the position of the electron species voltage relative to the standard state ladder.

## Standard reduction potentials

Consider a metal electrode and its reduction reaction:

$$ \mathrm{M}^{n+} + n \mathrm{e}^- \rightleftharpoons \mathrm{M(s)} , $$

giving as usual our $V_i$ difference:

$$ V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \frac{1}{nF} \mu_{\mathrm{M(s)}} .$$

The **standard reduction potential** $E^\circ_{\mathrm{M}}$ is the value of $E$ when:

* $\mathrm{M}^{n+}$ ions have unit activity ($V_{\mathrm{M}^{n+}} = V^\circ_{\mathrm{M}^{n+}}$).
* The temperature is 25&nbsp;°C and the pressure is 1 bar (actually, 1 atm is commonly used but we'll ignore this distinction).

Plugging the above definition of $E$, we get:

$$ E^\circ_{\mathrm{M}} = V^\circ_{\mathrm{M}^{n+}} - V^\circ_{\mathrm{H}^+} .$$

(where we have used $\mu^\circ_{\mathrm{M(s)}} = 0 $ and $\mu^\circ_{\mathrm{H}_2} = 0$ under these standard conditions)

Thus, our $V^\circ_i$ ladder (relative to $V^\circ_{\mathrm{H}^+}$) directly maps onto the standard reduction potentials $E^\circ_{\mathrm{M}}$.

## pH

The pH of a solution is defined thus:

$$ \mathrm{pH} = -\log_{10}(a_{\mathrm{H}^+}) , $$

which is known to a bit ambiguous due to its reliance on a single-ion activity. Anyway, we can rewrite this exactly in terms of our $V_i$:

$$ \mathrm{pH} = -\frac{1}{\ln(10)} \frac{F}{RT}(V_{\mathrm{H}^+} - V^\circ_{\mathrm{H}^+})$$

At 25&nbsp;°C, where $\ln(10)RT/F \approx 59.16~\mathrm{mV}$, this is:

$$ \mathrm{pH} \approx \frac{V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+}}{59.16~\mathrm{mV}}.$$

So $\mathrm{pH}$ is a kind of scaled voltage analogous to reduction potential $E$; this is not surprising since the best pH measurements are done electrically. A pH of 0 corresponds to $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+} = 0$, a pH of 7 corresponds to $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+} = 0.414~\mathrm{V}$, and a pH of 14 corresponds to $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+} = 0.828~\mathrm{V}$.

## Pourbaix diagram

It is common to plot the value of $E$ in a solution against its $\mathrm{pH}$ value, yielding a quasi-phase diagram known as as the {%wiki "Pourbaix diagram" %}. Note the similarity between the two axes' definitions:

\begin{align}
E & =  V_{\mathrm{e}^-} - V^\circ_{\mathrm{H}^+} \notag \\\\
 \mathrm{pH} & \propto V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+} \notag
\end{align}

This suggests that it is interesting to instead plot the voltage quantity $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+}$ on the bottom axis, so that both axes will have volt units. The usual characteristic thermal slopes on a Pourbaix diagram would then be converted to simple rational slopes such as 1:1, 1:2, and so on, directly reflecting the number of electrons and protons that are transferred when converting the species on one side to the other.

For example, $\mu_{\mathrm{H}} = V_{\mathrm{H}^+} - V_{\mathrm{e}^-} $ represents the availability of neutral hydrogen in reactions. This $\mu_{\mathrm{H}}$ is constant along a line of 1:1 slope ($\Delta E \approx -59~\mathrm{mV} \cdot \Delta \mathrm{pH}$). As we move up (increasing $V_{\mathrm{e}^-}$) and to the right (decreasing $V_{\mathrm{H}^+}$) we get less and less hydrogen availability. In water this _also_ means more and more neutral oxygen availability $\mu_{\mathrm{O}} = \mu_{\mathrm{H_2O}} - 2\mu_{\mathrm{H}}$, and so we see the classic 1:1 slopes separating compounds with more hydrogen (lower left) or more oxygen (upper right). Other slopes will necessarily involve other ions besides $\mathrm{H}^+$ (and in water, $\mathrm{OH}^-$).

## Takeaways


[**NEXT TOPIC: Semiconductors**](../semiconductors/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}
