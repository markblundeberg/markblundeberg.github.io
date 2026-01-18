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

To ground what we are doing in a specific example, we're going to look at ...

And we are going to show exactly what a "standard hydrogen electrode" is -- it's a virtual level $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$.

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

Earlier, we saw the silver chloride electrode, which couples $\mathrm{Cl}^-$ to $\mathrm{e}^-$:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} =  \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ). $$

{% include "esbd-diagrams/esbd-ag-agcl-electrode.html" %}

But what if another electrode comes in that couples to another ion besides cl-?

## The hydrogen electrode

One of the key reference points in electrochemistry is the standard hydrogen electrode (SHE).

A generic hydrogen electrode interconverts hydrogen ions with hydrogen gas ($\mathrm{H_2}$),
$$ \mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H_2} , $$

which in terms of $V_i$ gives the equilibrium condition:

$$ V_{\mathrm{H}^+} - V_{\mathrm{e}^-} = \frac{\mu_{\mathrm{H}_2}}{2F}. $$

or

$$ V_{\mathrm{e}^-} = V_{\mathrm{H}^+} - \frac{\mu_{\mathrm{H}_2}}{2F}. $$

Let's draw this electrode:

{% include "esbd-diagrams/esbd-she.html" %}

You can see that the concentration of $\mathrm{H}^+$ ions doesn't change the coupling between and, but the $\mathrm{H_2}$ concentration does. Note we can write the hydrogen gas chemical potential as a function of pressure (as an activity):
$\mu_{\mathrm{H}_2} = \mu^\circ_{\mathrm{H}_2} + \frac{RT}{F}\ln(a_{\mathrm{H_2}}) $
where $a_{\mathrm{H_2}} = f/p_0$ in terms of fugacity $f$ and standard pressure $p_0$.

Now, what happens when we stick together the two. While we can say the hydrogen electrode couples $V_{\mathrm{e}^-}(\text{left})$ to $V_{\mathrm{H}^+}$ and the silver chloride electrode couples $V_{\mathrm{Cl}^-}$ to $V_{\mathrm{e}^-}(\text{right})$, this leaves the question of the middle: how does $V_{\mathrm{H}^+}$ connect to $V_{\mathrm{Cl}^-}$? Well, we answered this in our [Solutions topic](../solutions/): it depends on the concentration of $\mathrm{H}^+$ ions and $\mathrm{Cl}^-$ ions, and it depends on $V^\circ_{\mathrm{Cl}^-} - V^\circ_{\mathrm{H}^+} = 1.3601~\mathrm{V}$ which is a constant from our rigid ladder of standard states.

Let's consider the case where the $\mathrm{H}^+$ ions and $\mathrm{Cl}^-$ ions are present due to dissolved $\mathrm{HCl}$:

{% include "esbd-diagrams/esbd-she-agcl.html" %}

After doing all the math, we get the following:

$$ V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) = E^\circ + \frac{RT}{F} \ln\bigg( \frac{\sqrt{a_{\mathrm{H_2}}}}{a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}} \bigg)  $$

where we have used $\mu_{\mathrm{H}_2} = \mu^\circ_{\mathrm{H}_2} + \frac{RT}{F}\ln(a_{\mathrm{H_2}}) $ and defined:

$$ E^\circ_{\mathrm{cell}} = \frac{\mu^\circ_{\mathrm{H}_2}}{2F} + [V^\circ_{\mathrm{Cl}^-}-V^\circ_{\mathrm{H}^+}] - \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ), $$

which evaluates to $E^\circ_{\mathrm{cell}} = 0.222~\mathrm{V} $.
This is the well known standard voltage of the standard silver chloride electrode against a standard hydrogen electrode, and the preceding equation gives us the voltage for actual conditions (when activities are not all 1).

> Note about nonideal solutions: as we mentioned earlier, the individual activities $a_{\mathrm{H}^+}$ and $a_{\mathrm{Cl}^-}$ are ambiguous, matching the ambiguity in placing the ladder of $V^\circ_i$ values. However, these ambiguities cancel out in the charge-neutral combination $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, and so (as must be the case) the final result $V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left})$ is unambiguous. The above plots were done assuming ideal behaviour, for simplicity.

## A change of perspective

Any electrochemist will immediately recognize the above result as the full-cell Nernst equation for $E_{\mathrm{cell}}$, but we have gotten there by a very strange route.

Logically, what I have been doing so far could be called "circuit-centered": we are interested primarily in the real thermodynamic species voltages $V_i$, and we step between them using rigorous thermodynamics.

And so, this is the chain of steps that logically connect the two sides (and in fact this is the internal logic I programmed to calculate this diagram):

$$ V_{\mathrm{e}^-}(\text{left}) \rightarrow V_{\mathrm{H}^+} \rightarrow \ldots \rightarrow V_{\mathrm{Cl}^-} \rightarrow V_{\mathrm{e}^-}(\text{right}) . $$

We accomplish the step $V_{\mathrm{H}^+} \rightarrow V_{\mathrm{Cl}^-}$ by briefly stepping into extrathermodynamics (we invoke single-ion activities temporarily), yet the overall step $V_{\mathrm{H}^+} \rightarrow V_{\mathrm{Cl}^-}$ is ultimately thermodynamic.

But, that is not the usual practice in electrochemistry, which is logically framed as *solution-centered* and more exactly *potential-centered*. Here we start "in the middle" with the $V^\circ_i$ values:

$$ \phi \rightarrow V^\circ_{\mathrm{H}^+} \rightarrow V_{\mathrm{H}^+} \rightarrow V_{\mathrm{e}^-}(\text{left}) $$

$$ \phi \rightarrow V^\circ_{\mathrm{Cl}^-} \rightarrow V_{\mathrm{Cl}^-} \rightarrow V_{\mathrm{e}^-}(\text{right}) $$

then $V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left})$ can be calculated as a difference between these two processes (and $\phi$ cancels out). This approach has the benefit of isolating each electrode with respect to a common reference ($\phi$).

However, as is our usual goal, let's try to mimic the electrochemistry approach without using $\phi$.

## Standard electrodes as electronic standard states

We can thus ask an important question: for each electrode reaction, where would $V_{\mathrm{e}^-}$ be if all activities are 1, expressed in terms of our potential ($V^\circ_i$)?
The answer is:

$$ V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) = V^\circ_{\mathrm{H}^+} - \frac{\mu^\circ_{\mathrm{H}_2}}{2F} . $$

This is the **standard hydrogen electrode**, but expressed as a virtual $V_{\mathrm{e}^-}$ level. Note that this floats just like our $V^\circ_i$ ion levels, and it truly is an electronic standard state of the solution, however very importantly it is not standard with respect to any particular standard electron concentration (and in fact most solvents do not support free electrons). It is only standard with respect to a specific standard reaction.

In terms of this standard level, our actual electrode level is:

$$ V_{\mathrm{e}^-}(\text{left}) = V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) + \frac{RT}{F} \ln (a_{\mathrm{H}^+}/\sqrt{a_{\mathrm{H_2}}} ), $$

and we can see that the activity term is identical to the activity term in the {% wiki "Nernst equation" %} for the {% wiki "standard hydrogen electrode" %}.

and so we define a very important quantity $V_{\mathrm{e}^-}(\mathrm{SHE})$:

which is equal to $V_{\mathrm{e}^-}$ when all activities are 1 (so the activity term goes to 0).

Similarly, for our silver chloride electrode we can define:

$$ V_{\mathrm{e}^-}(\mathrm{SSCE}) = V^\circ_{\mathrm{Cl}^-} + \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ) . $$

and we have:

$$ V_{\mathrm{e}^-}(\text{right}) = V_{\mathrm{e}^-}(\mathrm{SSCE}) + \frac{RT}{F} \ln (a_{\mathrm{Cl}^-}) $$

Let's now re-plot the exact same reference cell of a hydrogen electrode and a silver chloride electrode, except instead of showing ionic quantities, we'll just show the $V_{\mathrm{e}^-}$ levels:

{% include "esbd-diagrams/esbd-she-agcl.html" %}





{#
which in full evaluates to:

$$ V_{\mathrm{e}^-}(\text{left}) + \frac{\mu_{\mathrm{H}_2}}{2F} - \frac{RT}{F}\ln(a_{\mathrm{H}^+}) + [V^\circ_{\mathrm{Cl}^-}-V^\circ_{\mathrm{H}^+}] - \frac{RT}{F}\ln(a_{\mathrm{Cl}^-}) - \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ) = V_{\mathrm{e}^-}(\text{right}) $$

**Standard and actual cell voltage** - We can combine the constant factors and combine the activity factors to get the cell voltage:

$$ E_{\mathrm{cell}} = V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) = E^\circ + \frac{RT}{F} \ln\bigg( \frac{\sqrt{a_{\mathrm{H_2}}}}{a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}} \bigg)  $$

where we have used $\mu_{\mathrm{H}_2} = \mu^\circ_{\mathrm{H}_2} + \frac{RT}{F}\ln(a_{\mathrm{H_2}}) $ and defined:

$$ E^\circ = \frac{\mu^\circ_{\mathrm{H}_2}}{2F} + [V^\circ_{\mathrm{Cl}^-}-V^\circ_{\mathrm{H}^+}] - \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} ) $$

Which evaluates to $E^\circ = 0.222~\mathrm{V} $
This is the well known standard voltage of the standard silver chloride electrode against a standard hydrogen electrode, and the preceding equation gives us the voltage for actual conditions (when activities are not all 1).

While this process is nice, 
#}


## Standard electrodes as virtual levels

- $V^\circ_{\mathrm{e}^-}(\mathrm{reaction})$ as a level.
- Show plot with $V^\circ_{\mathrm{e}^-}(\mathrm{reaction})$ as a .. ??
- Show plot with ideal salt bridge connection to actual standard electrode (as opposed to virtual electrode). Hmm though actual is slightly ambiguous






## Standard hydrogen electrode is a pain in the ass

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
