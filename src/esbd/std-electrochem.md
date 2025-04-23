---
layout: layouts/base.njk
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

We have no fundamental physical basis to assign an electrostatic potential $\phi$ inside of materials, only conventions that vary from material to material. Although $\phi$ is well defined in vacuum, it offers only false hope when it comes to defining $\phi$ in bulk materials, since $\phi$ in vacuum is a mess that varies capriciously from place to place based on surface conditions and surface contaminations.

At least for water-based solutions, the relationship between $\phi$ and our $V_i$ values comes about via a convention that the Gibbs formation energy of ideal standard-state $\mathrm{H}^+$ is 0 at all conditions. This may seem unphysical, but $\mathrm{H}^+$ will always come together neutrally with other ions, and the Gibbs energies of the other ions can 'absorb the error' so to speak, so it works out thermodynamically. With our $V_i$'s we've adopted the convention of setting chemical potentials based on Gibbs formation energies, therefore this means we can take $\mu^\ominus_{\mathrm{int},\mathrm{H}^+} = 0$ under all conditions. Since $V^\ominus_{\mathrm{H}^+} = \phi + \mu^\ominus_{\mathrm{int},\mathrm{H}^+}/F$, then,

$$ V^\ominus_{\mathrm{H}^+} = \phi.$$

In the below I'll just use $V^\ominus_{\mathrm{H}^+}$ but you can sub in $\phi$.

There is also the question of which convention we should use to assign $\phi$ inside metals. Anyway, since voltmeters measure $V_\mathrm{e}^-$, not $\phi$, this lets us sidestep the question of which $\phi$ value we choose inside metals.

Accordingly, the change in $\phi$ at interfaces / junctions is not useful, except for the case of water-to-water junctions. In that case, the step $\Delta \phi = \Delta V^\ominus_{\mathrm{H}^+}$ is known as Galvani potential or liquid junction potential.

## Standard hydrogen electrode (SHE)

A generic hydrogen electrode interconverts hydrogen ions with hydrogen gas, $ \mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H}_2 $, which in terms of $V_i$ gives the equilibrium condition:

$$ V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \frac{\mu_{\mathrm{H}_2}}{2F}. $$

The standard hydrogen electrode (SHE) is an aqueous system defined with the activity of $\mathrm{H}^+$ ions at unity ($a_{\mathrm{H}^+} = 1$), which implies $ V_{\mathrm{H}^+}(\text{SHE}) = V^\ominus_{\mathrm{H}^+} $. Furthermore, the SHE is defined with $\mathrm{H}_2$ gas at a standard fugacity (effective pressure) of 1 bar, so we will write its chemical potential as $\mu^\ominus_{\mathrm{H}_2}(T)$. Combining the equilibrium condition $V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \mu_{\mathrm{H}_2}/(2F)$ with the standard condition $V_{\mathrm{H}^+}(\text{SHE}) = V^\ominus_{\mathrm{H}^+}$, we find:

$$ V_{\mathrm{e}^-}(\text{SHE}) = V^\ominus_{\mathrm{H}^+} - \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F}. $$

A further simplification occurs if we are at the standard reference temperature (usually 25&nbsp;°C): $\mu^\ominus_{\mathrm{H}_2}(T) = 0$. Therefore we can say for short that $ V_{\mathrm{e}^-}(\text{SHE}) = V^\ominus_{\mathrm{H}^+} $ if we're operating at standard temperature.

Practically, it's not actually necessary to achieve these ideal conditions (such as the extreme pH of 0 implied by `a_H⁺ = 1`), nor is it desirable given the uncertainties about when unit activity is exactly reached. Instead, the most precise determinations of potentials relative to the SHE reference point are made using cells without liquid junctions (like the Harned cell) where measurements are performed in well-defined dilute solutions. The results are then extrapolated back to the idealized standard state conditions. In this sense, any reference to $V_{\mathrm{e}^-}(\text{SHE})$ represents this theoretical, extrapolated potential defined relative to the standard state of the aqueous proton, $V^\ominus_{\mathrm{H}^+}$.

## Reduction potentials

Generally, electrode potentials / reduction potentials are defined operationally via measurements referenced to the SHE:

$$ E(\text{target}) = V_{\mathrm{e}^-}(\text{target}) - V_{\mathrm{e}^-}(\text{SHE}). $$

(Note that this means the reduction potential of the SHE is defined as zero at all temperatures: $E(\text{SHE}, T) = 0$.)

Substituting the expression we found for $V_{\mathrm{e}^-}(\text{SHE})$:
$$ E(\text{target}, T) = V_{\mathrm{e}^-}(\text{target}, T) - \left[ V^\ominus_{\mathrm{H}^+}(aq, T) - \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F} \right] $$
$$ E = V_{\mathrm{e}^-} - V^\ominus_{\mathrm{H}^+} + \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F} $$

This equation provides the precise link between the electrode potential $E$ and the $V_i$ levels at any temperature $T$. Again, for simplicity, near 25°C where $\mu^\ominus_{\mathrm{H}_2}(T) \approx 0$, the small $\mu^\ominus_{\mathrm{H}_2}(T)$ term is neglected, leading to the common approximation:

$$ E \approx V_{\mathrm{e}^-} - V^\ominus_{\mathrm{H}^+} $$

(And this corresponds to $E \approx -\tfrac{1}{F}\bar\mu_{\mathrm{e}^-} - \phi$, and expression sometimes seen.)

Since $V^\ominus_{\mathrm{H}^+}$ itself serves as a reference point for the $V^\ominus_{i}$ standard state ladder, this means the electrode potential describes the position of the electron species voltage relative to the standard state ladder.

It is not even necessary for there to be an actual electrode present, such as with in-solution redox couples.. Redox couples define an effective $V_{\mathrm{e}^-}$ (such as $V_{\mathrm{e}^-} = 3V_{\mathrm{Fe}^{3+}} - 2V_{\mathrm{Fe}^{2+}} $ for the $\mathrm{Fe}^{2+}$-$\mathrm{Fe}^{3+}$ couple) and thus they have a reduction potential, usually called redox potential.

## Standard reduction potentials

Consider a metal electrode and its reduction reaction:

$$ \mathrm{M}^{n+} + n \mathrm{e}^- \rightleftharpoons \mathrm{M(s)}$$

Giving as usual our $V_i$ difference:

$$ V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \frac{1}{nF} \mu_{\mathrm{M(s)}} .$$

The standard reduction potential $E^\ominus$ is the value of $E$ when the $M$ ions have unit activity ($V_{\mathrm{M}^{n+}} = V^\ominus_{\mathrm{M}^{n+}}$) and the metal is in its standard state ($\mu_{\mathrm{M(s)}} = \mu^\ominus_{\mathrm{M(s)}}$). Substituting the precise expression for $E$ (valid at any temperature T) into this gives:

$$ E^\ominus(T) = V^\ominus_{\mathrm{M}^{n+}}(T) - V^\ominus_{\mathrm{H}^+}(T) - \frac{1}{nF} \mu^\ominus_{\mathrm{M(s)}}(T) + \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F} .$$

This is the general expression relating the standard potential at temperature T to the standard state potentials of the species involved.

If we specifically consider the standard reference conditions (25°C and 1 bar) then by convention, the standard chemical potentials of elements in their stable reference states are zero: $\mu^\ominus_{\mathrm{M(s)}} = 0$ and $\mu^\ominus_{\mathrm{H}_2} = 0$. Under these specific conditions, the equation simplifies to:

$$ E^\ominus = V^\ominus_{\mathrm{M}^{n+}} - V^\ominus_{\mathrm{H}^+} .$$

Thus, at the standard reference conditions, our $V^\ominus_i$ ladder (relative to $V^\ominus_{\mathrm{H}^+}$) directly maps onto the standard reduction potentials $E^\ominus$. At other conditions, however, the small offsets due to the non-zero $\mu^\ominus_{\mathrm{M(s)}}$ and $\mu^\ominus_{\mathrm{H}_2}$ do affect this correpondence.

## pH

$$ \mathrm{pH} = -\log_{10}(a_{\mathrm{H}^+}) = -\frac{\ln(a_{\mathrm{H}^+})}{\ln(10)} = -\frac{1}{\ln(10)} \frac{F}{RT}(V_{\mathrm{H}^+} - V^\ominus_{\mathrm{H}^+})$$

At 25 deg C (where $RT/F \approx 25.69$ mV and $\ln(10) \approx 2.303$):

$$ \mathrm{pH} \approx \frac{V^\ominus_{\mathrm{H}^+} - V_{\mathrm{H}^+}}{59.16~\mathrm{mV}}$$


## Pourbaix diagrams


## Takeaways


[**NEXT TOPIC: Semiconductors**](../semiconductors/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}
