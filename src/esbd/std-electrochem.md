---
layout: layouts/base.njk
title: 'Potentials'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 5
eleventyNavigation:
    key: Potentials # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 1 # Order within the parent menu
---

# {{title}}

So far we've mostly avoided describing the connections to the various potentials found in standard electrochemistry, but let's state them now.

## The electrostatic potential $\phi$

The relationship between $\phi$ and our $V_i$ values comes about via a convention that $\mu^\ominus_{\mathrm{int},\mathrm{H}^+} = 0$ under all conditions. That is, if you look up the standard Gibbs formation energies of ions, you'll see $\mathrm{H}^+$ listed as 0 at all temperatures, and we've adopted the convention of setting chemical potentials based on Gibbs formation energies. Therefore, since $V^\ominus_{\mathrm{H}^+} = \phi + \mu^\ominus_{\mathrm{int},\mathrm{H}^+}/F$, this gives

$$ V^\ominus_{\mathrm{H}^+} = \phi.$$

In the below I'll just use $V^\ominus_{\mathrm{H}^+}$ but you can sub in $\phi$.

## Standard hydrogen electrode (SHE)

A generic hydrogen electrode interconverts hydrogen ions with hydrogen gas, $ \mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H}_2 $, which in terms of $V_i$ gives the equilibrium condition:

$$ V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \frac{\mu_{\mathrm{H}_2}}{2F}. $$

The standard hydrogen electrode (SHE) is an aqueous system defined with the activity of $\mathrm{H}^+$ ions at unity (`a_H⁺ = 1`), which implies:

$$ V_{\mathrm{H}^+}(\text{SHE}) = V^\ominus_{\mathrm{H}^+} . $$

Furthermore, the SHE is defined with $\mathrm{H}_2$ gas at a standard fugacity (effective pressure) of 1 bar. The chemical potential of hydrogen under these conditions is $\mu_{\mathrm{H}_2}(\text{SHE}, T) = \mu^\ominus_{\mathrm{H}_2}(T)$. This standard chemical potential is zero by convention only at the reference temperature (usually 25&nbsp;°C), and varies at other temperatures.

Combining the equilibrium condition $V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \mu_{\mathrm{H}_2}/(2F)$ with the standard condition $V_{\mathrm{H}^+}(\text{SHE}) = V^\ominus_{\mathrm{H}^+}$, we find the electron potential in the SHE's conductor:

$$ V_{\mathrm{e}^-}(\text{SHE}) = V^\ominus_{\mathrm{H}^+} - \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F}. $$

This specific electron potential level serves as the fundamental reference point against which electrode potentials are measured, as we will discuss in the next section.

And since we established $V^\ominus_{\mathrm{H}^+} = \phi$ (due to the $\mu^\ominus_{\mathrm{H}^+}=0$ convention), we can also write:

$$ V_{\mathrm{e}^-}(\text{SHE}) = \phi - \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F}. $$

Practically, it's not actually necessary to achieve these ideal conditions (such as the extreme pH of 0 implied by `a_H⁺ = 1`), nor is it desirable given the uncertainties about when unit activity is exactly reached. Instead, the most precise determinations of potentials relative to the SHE reference point are made using cells without liquid junctions (like the Harned cell) where measurements are performed in well-defined dilute solutions. The results are then extrapolated back to the idealized standard state conditions. In this sense, any reference to $V_{\mathrm{e}^-}(\text{SHE})$ represents this theoretical, extrapolated potential defined relative to the standard state of the aqueous proton, $V^\ominus_{\mathrm{H}^+}$.

## Reduction potentials

Generally, electrode potentials / reduction potentials are defined operationally via measurements referenced to the SHE. The standard potential of the SHE is defined as zero at all temperatures, `E°(SHE) = 0`. This means the measured potential of a target electrode is:

$$ E(\text{target}) = V_{\mathrm{e}^-}(\text{target}) - V_{\mathrm{e}^-}(\text{SHE}). $$

Substituting the expression we found for $V_{\mathrm{e}^-}(\text{SHE})$:
$$ E(\text{target}, T) = V_{\mathrm{e}^-}(\text{target}, T) - \left[ V^\ominus_{\mathrm{H}^+}(aq, T) - \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F} \right] $$
$$ E = V_{\mathrm{e}^-} - V^\ominus_{\mathrm{H}^+} + \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F} $$

This equation provides the precise link between the electrode potential `E` and the $V_i$ levels. Often, for simplicity especially near 25°C where $\mu^\ominus_{\mathrm{H}_2}(T) \approx 0$, the small $\mu^\ominus_{\mathrm{H}_2}(T)$ term is neglected, leading to the common approximation:

$$ E \approx V_{\mathrm{e}^-} - V^\ominus_{\mathrm{H}^+} $$

(And sometimes this may be encountered as $E \approx -\tfrac{1}{F}\bar\mu_{\mathrm{e}^-} - \phi$, recognizing that $V^\ominus_{\mathrm{H}^+} = \phi$ by convention.)

Since $V^\ominus_{\mathrm{H}^+}$ itself serves as a reference point for the $V^\ominus_{i}$ standard state ladder, this means the electrode potential describes the position of the electron species voltage relative to the standard state ladder.

It is not even necessary for there to be an actual electrode present, such as with in-solution redox couples like $\mathrm{Fe}^{2+}$-$\mathrm{Fe}^{3+}$. Redox couples define an effective $V_{\mathrm{e}^-}$ and thus a reduction potential (usually called redox potential).

## Standard reduction potentials

Consider a metal electrode and its reduction reaction:

$$ \mathrm{M}^{n+} + n \mathrm{e}^- \rightleftharpoons \mathrm{M(s)}$$

Giving as usual our $V_i$ difference:

$$ V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \frac{1}{nF} \mu_{\mathrm{M(s)}} .$$

The standard reduction potential $E^\ominus$ is the value of $E$ when the $M$ ions have unit activity ($V_{\mathrm{M}^{n+}} = V^\ominus_{\mathrm{M}^{n+}}$) and the metal is in its standard state ($\mu_{\mathrm{M(s)}} = \mu^\ominus_{\mathrm{M(s)}}$). Substituting the precise expression for $E$ into this gives:

$$ E^\ominus = V^\ominus_{\mathrm{M}^{n+}} - V^\ominus_{\mathrm{H}^+} - \frac{1}{nF} \mu^\ominus_{\mathrm{M(s)}} + \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F} .$$

Assuming we adopt the convention that $\mu^\ominus_{\mathrm{M(s)}} = 0$ for elements in their standard reference state, this simplifies to:

$$ E^\ominus = V^\ominus_{\mathrm{M}^{n+}} - V^\ominus_{\mathrm{H}^+} + \frac{\mu^\ominus_{\mathrm{H}_2}(T)}{2F} .$$

Thus, our $V^\ominus_i$ ladder (relative to $V^\ominus_{\mathrm{H}^+}$) has exactly the structure of the standard reduction potentials $E^\ominus$, offset by the small temperature-dependent hydrogen chemical potential term. This confirms that $V^\ominus_i$ can be shifted up and down together (by changing $\phi$ or the $\mu^\ominus_{\mathrm{H}^+}=0$ convention) without affecting measurable potential differences like $E^\ominus$ (as the offset term cancels when taking differences).

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
