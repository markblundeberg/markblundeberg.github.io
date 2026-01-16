---
layout: layouts/esbd_topic.njk
title: 'Reference electrodes'
tags: [page, esbd_topic]
orderESBD: 31
eleventyNavigation:
    key: Reference electrodes
    parent: ESBD
    order: 31
---

# {{title}}

Now we're going to get into some more classic electrochemistry situations. Electrochemistry traditionally is built around cells, electrode potentials, salt bridges. Using the $V_i$ picture we can visualize a lot of what has been going on in those classic electrochemical equations.


This topic:
- reference electrodes and cells
- she and virtual she level $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$
- SSCE (standard silver chloride electrode) $V^\circ_{\mathrm{e}^-}(\mathrm{SSCE})$ together with SHE. Cite old works like Harned and Bates
- "absolute electrode potential"

Let's return to looking at electrochemical cells. In particular we're going to be looking at the equilibrium case.

- Abstract cell (Ve on both sides, abstract V_ion and V^circ_ion in middle) - equilibrium
- Cell potential = Ve-Ve.
- (The above is almost trivial but a reminder)
- Add an offset to emphasize the zero is unimportant.


# Reference cells and electrodes

## The silver/silver chloride electrode

Earlier, we saw ...

But what if another electrode comes in that couples to another ion besides cl-?

## The hydrogen electrode

One of the key reference points in electrochemistry is the standard hydrogen electrode (SHE).

A generic hydrogen electrode interconverts hydrogen ions with hydrogen gas,
$$ \mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H}_2 , $$

which in terms of $V_i$ gives the equilibrium condition:

$$ V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \frac{\mu_{\mathrm{H}_2}}{2F}. $$

or

$$ V_{\mathrm{e}^-} = V_{\mathrm{H}^+} - \frac{\mu_{\mathrm{H}_2}}{2F}. $$

{% include "esbd-diagrams/esbd-she.html" %}

Now, what happens when we stick together the two:

{% include "esbd-diagrams/esbd-she-agcl.html" %}


The standard hydrogen electrode (SHE) is an aqueous system defined with the activity of $\mathrm{H}^+$ ions at unity ($a_{\mathrm{H}^+} = 1$), which implies $ V_{\mathrm{H}^+}(\text{SHE}) = V^\circ_{\mathrm{H}^+} $. Furthermore, the SHE is defined with $\mathrm{H}_2$ gas at a standard fugacity (effective pressure) of 1 bar, so we will write its chemical potential as $\mu^\circ_{\mathrm{H}_2}(T)$. Combining the equilibrium condition $V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \mu_{\mathrm{H}_2}/(2F)$ with the standard condition $V_{\mathrm{H}^+}(\text{SHE}) = V^\circ_{\mathrm{H}^+}$, we find:

$$ V_{\mathrm{e}^-}(\text{SHE}) = V^\circ_{\mathrm{H}^+} - \frac{\mu^\circ_{\mathrm{H}_2}(T)}{2F}. $$

A further simplification occurs if we are at the standard reference temperature (usually 25&nbsp;°C): $\mu^\circ_{\mathrm{H}_2}(T) = 0$. Therefore we can say for short that $ V_{\mathrm{e}^-}(\text{SHE}) = V^\circ_{\mathrm{H}^+} $ if we're operating at standard temperature.

Practically, the SHE is slightly annoying:
- 1 bar H2 fugacity contradicts 1 bar absolute pressure (because total pressure includes water vapor too), so need to correct slightly.
- As with other standard potentials relies on extrapolating from ideal dilute
- On the other hand, the effect of dissolved H2 (at 1 bar fugacity) on the solvent is minor and negligible.

SHE reference defined in another solution as
- The value of $V_{\mathrm{e}^-}$ that would be obtained by
- Connecting the solution under test
- Via an ideal salt bridge (all $V^\circ_{\mathrm{H}^+}$ flat)
- To an solution made up of the same solvent at same temperature and same pressure
- But with an ideal-dilute concentration of $\mathrm{H}^+$ ions of $1~\mathrm{mol/kg}$.

$$ V^\circ_{\mathrm{SHE}} = V^\circ_{\mathrm{H}^+} - \frac{\mu^\circ_{\mathrm{H}_2}(T)}{2F}. $$

Practically, it's not actually necessary to achieve these ideal conditions (such as the extreme pH of 0 implied by $a_{\mathrm{H}^+} = 1$), nor is it even desirable to do so, given the uncertainties about when unit activity is exactly reached. Instead, the most precise determinations of potentials relative to the SHE reference point are made using cells without liquid junctions (like the Harned cell) where measurements are performed in well-defined dilute solutions. The results are then extrapolated back to the idealized standard state conditions. In this sense, any reference to $V_{\mathrm{e}^-}(\text{SHE})$ represents this theoretical, extrapolated potential defined relative to the standard state of the aqueous proton, $V^\circ_{\mathrm{H}^+}$.

{% include "esbd-diagrams/esbd-she-agcl.html" %}

## Standard electrodes as virtual levels

- $V^\circ_{\mathrm{e}^-}(\mathrm{reaction})$ as a level.
- Show plot with $V^\circ_{\mathrm{e}^-}(\mathrm{reaction})$ as a .. ??
- Show plot with ideal salt bridge connection to actual standard electrode (as opposed to virtual electrode). Hmm though actual is slightly ambiguous





