---
layout: layouts/base.njk
title: 'Traditional electrochemistry'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 5
eleventyNavigation:
    key: Traditional electrochemistry # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 1 # Order within the parent menu
---

# {{title}}

So far we've mostly avoided describing the connections to the standard electrochemistry quantifiers, but let's state them now.

## The electrostatic potential $\phi$

The relationship between $\phi$ and our $V_i$ values comes about via a convention that $\mu^\ominus_{\mathrm{int},\mathrm{H}^+} = 0$ under all conditions. That is, if you look up the standard Gibbs formation energies of ions, you'll see $\mathrm{H}^+$ listed as 0 at all temperatures, and we've adopted the convention of setting chemical potentials based on Gibbs formation energies. Therefore, this gives

$$ \phi = V^\ominus_{\mathrm{H}^+} .$$

In the below I'll just use $V^\ominus_{\mathrm{H}^+}$ but you can sub in $\phi$.

## Standard hydrogen electrode (SHE)

A generic hydrogen electrode interconverts hydrogen ions with hydrogen gas, $ \mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H}_2 $, which in terms of $V_i$ gives:

$$ V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \tfrac{1}{2}\mu_{\mathrm{H}_2}/F $$

The standard hydrogen electrode (SHE) is an aqueous system that assumes activity of $\mathrm{H}^+$ is 1, which implies:

$$ V_{\mathrm{H}^+}(\text{SHE}) = V^\ominus_{\mathrm{H}^+} $$

And moreover, the SHE is exposed to $\mathrm{H}_2$ gas at a fugacity (effective pressure) of 1 bar, which at least at 25&nbsp;°C are the standard reference conditions for hydrogen so $\mu_{\mathrm{H}_2} = 0$. (Technically for other temperatures, we are supposed to maintain a fugacity of 1 bar which means $\mu_{\mathrm{H}_2}$ varies from 0, but it seems to be common to neglect this contribution.)

This gives the key defining relationship, that the SHE serves as a measuring point for $V^\ominus_{\mathrm{H}^+}$:

$$ V_{\mathrm{e}^-}(\text{SHE}) = V^\ominus_{\mathrm{H}^+}. $$

## Reduction potentials

Generally, electrode potentials / reduction potentials are in principle voltmeter measurements referenced to the SHE as a baseline:

$$ E(\text{target}) = V_{\mathrm{e}^-}(\text{target}) - V_{\mathrm{e}^-}(\text{SHE}). $$

Practically we might not always be able to install an SHE with its highly acidic solution, but the preceding discussion showed us that $ V_{\mathrm{e}^-}(\text{SHE}) $ would actually just measure $V^\ominus_{\mathrm{H}^+} $ anyway. And so, we get a local description of the electrode potential:

$$ E = V_{\mathrm{e}^-} - V^\ominus_{\mathrm{H}^+}. $$

(And sometimes this may be encountered as $E = -\tfrac{1}{F}\bar\mu_{\mathrm{e}^-} - \phi$.)

Since $V^\ominus_{\mathrm{H}^+}$ itself serves as a reference point for the $V^\ominus_{i}$ standard state ladder, this means the electrode potential describes the position of the standard state ladder in relation to the electron species voltage.

It is not even necessary for there to be an actual electrode present, such as with in-solution redox couples like $\mathrm{Fe}^{2+}$-$\mathrm{Fe}^{3+}$. Redox couples define an effective $V_{\mathrm{e}^-}$ and thus a reduction potential (usually called redox potential).

## Standard reduction potentials

Consider a metal electrode and its reduction reaction:

$$ \mathrm{M}^{n+} + n \mathrm{e}^- \rightleftharpoons \mathrm{M(s)}$$

Giving as usual our $V_i$ difference:

$$ V_{\mathrm{M}^{n+}} - V_{\mathrm{e}^-} = \frac{1}{nF} \mu_{\mathrm{M(s)}} .$$

The standard reduction potential $E^\ominus$ is the value of $E$ when the $M$ ions have unit activity ($V_{\mathrm{M}^{n+}} = V^\ominus_{\mathrm{M}^{n+}}$), thus we have:

$$ E^\ominus = V^\ominus_{\mathrm{M}^{n+}} - V^\ominus_{\mathrm{H}^+} - \frac{1}{nF} \mu_{\mathrm{M(s)}}.$$

And, assuming we are at standard conditions and so $\mathrm{M(s)}$ is a standard reference state (most stable allotrope) we have $\mu_{\mathrm{M(s)}} = 0$, and so our $V^\ominus_i$ ladder has exactly the structure of the reduction potentials, the only difference being that $V^\ominus_i$ can be shifted up and down together.

## pH

$$ \mathrm{pH} = -\log_{10}(a_{\mathrm{H}^+}) = -\log_{10}(e) \frac{F}{RT}(V_{\mathrm{H}^+} - V^\ominus_{\mathrm{H}^+})$$

At 25 deg C:

$$ \mathrm{pH} = \frac{V^\ominus_{\mathrm{H}^+} - V_{\mathrm{H}^+}}{59~\mathrm{mV}}$$


## Pourbaix diagrams


## Takeaways


[**NEXT TOPIC: aaaaa**](../aaaaa/)

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