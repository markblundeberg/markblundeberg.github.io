---
layout: layouts/esbd_topic.njk
title: 'pH'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 34
eleventyNavigation:
    key: pH # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 34 # Order within the parent menu
---

# {{title}}

The pH of a solution is defined thus:

$$ \mathrm{pH} = -\log_{10}(a_{\mathrm{H}^+}) , $$

which is known to a bit ambiguous due to its reliance on a single-ion activity. Anyway, we can rewrite this exactly in terms of our $V_i$:

$$ \mathrm{pH} = -\frac{1}{\ln(10)} \frac{F}{RT}(V_{\mathrm{H}^+} - V^\circ_{\mathrm{H}^+})$$

So $\mathrm{pH}$ is a kind of scaled voltage analogous to reduction potential $E$; this is not surprising since the best pH measurements are done electrically.

At 25&nbsp;°C, where $\ln(10)RT/F \approx 59.16~\mathrm{mV}$, this is:

$$ \mathrm{pH} \approx \frac{V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+}}{59.16~\mathrm{mV}}.$$

A pH of 0 corresponds to $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+} = 0.000~\mathrm{V}$, a pH of 7 corresponds to $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+} = 0.414~\mathrm{V}$, and a pH of 14 corresponds to $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+} = 0.828~\mathrm{V}$.

## Pourbaix diagram

It is common to plot the value of $E$ in a solution against its $\mathrm{pH}$ value, yielding a quasi-phase diagram known as as the {%wiki "Pourbaix diagram" %}. Note the similarity between the two axes' definitions:

$$
\begin{aligned}
E & =  V_{\mathrm{e}^-} - V^\circ_{\mathrm{H}^+} \\
 \mathrm{pH} & \propto V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+}
\end{aligned}
$$

This suggests that it is interesting to instead plot the voltage quantity $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+}$ on the bottom axis, so that both axes will have volt units. The usual characteristic thermal slopes on a Pourbaix diagram would then be converted to simple rational slopes such as $-1:1$ and $1:2$ and so on, directly reflecting the number of electrons and protons that are transferred when converting the species on one side to the other.

For example, $\mu_{\mathrm{H}} = FV_{\mathrm{H}^+} - F V_{\mathrm{e}^-} $ represents the availability of neutral hydrogen in reactions (note $2\mu_{\mathrm{H}} = \mu_{\mathrm{H_2}}$). This $\mu_{\mathrm{H}}$ is constant along a line of $-1:1$ slope ($\Delta E \approx -59~\mathrm{mV} \cdot \Delta \mathrm{pH}$). As we move up (increasing $V_{\mathrm{e}^-}$) and to the right (decreasing $V_{\mathrm{H}^+}$) we get less and less hydrogen availability. Since Pourbaix diagrams are for water, this _also_ means more and more neutral oxygen availability $\mu_{\mathrm{O}} = \mu_{\mathrm{H_2O}} - 2\mu_{\mathrm{H}}$, and so we see the classic $-1:1$ slopes separating compounds with more hydrogen (lower left) or more oxygen (upper right).

There are also pure pH-dependent reactions, which involve the ion $\mathrm{H}^+$. By charge neutrality a pH-dependent reaction has to involve other ions. For example, the acidic dissolution of rust into ferric ions, $\mathrm{Fe_2O_3} + 6\mathrm{H}^+ \rightleftharpoons 2\mathrm{Fe}^{3+} + 3\mathrm{H_2O}$, appears as voltage difference $V_{\mathrm{Fe}^{3+}} - V_{\mathrm{H}^+} = \tfrac{1}{6F}\mu_{\mathrm{Fe_2O_3}} - \tfrac{1}{2F} \mu_{\mathrm{H_2O}}$. This ends up creating a vertical slope on the Pourbaix diagram since in effect $V_{\mathrm{Fe}^{3+}} - V^\circ_{\mathrm{H}^+}$ is fixed by the diagram's drawing rules.^[The Pourbaix diagram is drawn assuming some characteristic concentration of ionic phases, usually $10^{-6}~\mathrm{mol/L}$. This fixes the value $V_{\mathrm{Fe}^{3+}} - V^\circ_{\mathrm{H}^+}$, and since $\mu_{\mathrm{Fe_2O_3}}$ is also fixed (solid phase assumed), this results in a fixed value for $V_{\mathrm{H}^+} - V^\circ_{\mathrm{H}^+}$ i.e. a fixed $\mathrm{pH}$.]

For concentrations, we are more interested in $V_{\mathrm{Fe}^{3+}} - V^\circ_{\mathrm{Fe}^{3+}}$ and $V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+}$. Thus, the concentration of $\mathrm{Fe}^{3+}$ ions ends up varying with the cube of the concentration of $\mathrm{H}^+$ ions (if the environment is saturated with both water and rust), i.e. $c_{\mathrm{Fe}^{3+}} \propto 10^{-3\cdot\mathrm{pH}}$.

{#
$V_{\mathrm{Fe}^{3+}} - V_{\mathrm{H}^+} = -0.053~\mathrm{V}$ if the environment is saturated with both water and rust. This assumes Fe2O3 has chem pot of hematite though, which may differ from proper hydrated rust.

compared to $V^\circ_{\mathrm{Fe}^{3+}} - V^\circ_{\mathrm{H}^+} = -0.016~\mathrm{V}$.
#}

## Takeaways


[**NEXT TOPIC: Transport**](../transport/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}
