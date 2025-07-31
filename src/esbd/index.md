---
layout: layouts/esbd_topic.njk
title: 'ESBD: Intro'
tags: [page, esbd_topic]
orderESBD: 1
eleventyNavigation:
    key: ESBD
---

# Band Diagrams for Batteries: An Electrochemical Visualization

<p align='right'><small><em>Mark Lundeberg // August 2025</em></small></p>

What is the electrical state deep inside of a battery?

If we try to visualize this by plotting voltage versus position, we immediately run into a mystery. We know the voltage at the anode (negative terminal) and the cathode (positive terminal), but what about the electrolyte in between?

{% include "esbd-diagrams/bd-basicbattery-voltage-missing.html" %}

What are we supposed to draw in place of the '???'? A straight line? A sudden jump? The mystery deepens when we try to understand more complex situations; how can we visualize the voltage drops from internal resistance during battery discharge?

While the equations of electrochemistry are precise, the visual tools for building intuition are often lacking. There is a head-smackingly simple solution to this, which generalizes to visualize all of electrochemistry, but until now it has been unused.

## The Energy Problem

Semiconductor physicists are used to understanding everything in terms of electronic energies, and we use the term "{%wiki "band diagram" %}" to refer to a plot of electronic energies vs. position. These band diagrams are the primary visual and pedagogical tool for showing what is happening, thermodynamically, inside semiconductor devices. So, what happens when we try to represent a battery with a regular band diagram?

{% include "esbd-diagrams/bd-basicbattery-energy-missing.html" %}

We still have a missing middle! We can be more precise and say _the middle is undefined_: there simply are no free electrons inside the electrolyte to define an energy level for.

> **Note**: The plotted quantity $\bar\mu_{\mathrm{e}^-}$ is the electrochemical potential of electrons (also known as the {% wiki "Fermi level" %}). It is directly related to the _thermodynamic_ voltage via $V = -\bar\mu_{\mathrm{e}^-}/e$, where $-e$ is the electron charge (differences in this voltage are what you read using a voltmeter). Our energy band diagram is quite literally an upside-down voltage diagram.

This seems to suggest that there is no meaningful way to complete the picture. But it is quite unsatisfying to stop at this point. To paraphrase Herbert Kroemer: "if you don't draw a band diagram, then nobody knows what you're talking about".^[[H. Kroemer Nobel prize lecture, 2000](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf)] The need for visualizations means that band diagrams do get drawn for batteries anyway, but are often full of misconceptions and unphysical ideas^[cite Peljo] (something we will discuss in a later article).

## Including the Ions

To make headway, let's recognize something crucial: in batteries, electrons are not the only charge carriers. For example, we have $\mathrm{Li}^+$ ions in the case of lithium-ion batteries. Why should we expect to get away with only talking about electronic energies? Why shouldn't we treat the lithium ions on equal footing? After all, ions have their own well-defined electrochemical potential, such as $\bar\mu_{\mathrm{Li}^+}$.

Let's try generalizing our plot to include ionic energies:

{% include "esbd-diagrams/bd-basicbattery-energy-ion-too.html" %}

Fantastic, we have filled the gap and closed the circuit! And, we can visualize how during charging or discharge, there is a gradient in $\bar\mu_{\mathrm{Li}^+}$ showing internal resistance.

Unfortunately, such a diagram has a serious flaw: if we change the overall electrostatic offset of the system (try moving the slider), the energy levels for the electron and the ion move in opposite directions because of their opposite charges. This breaks a key principle of energy diagrams: the absolute vertical position is arbitrary, and only the *differences* between levels should have physical meaning. Here, the energy gap between the electron and ion levels changes with the offset, making the diagram ambiguous. So, just one more small but crucial tweak is needed...

## The $V_i$ Solution

We saw that electronic voltage is $V_{\mathrm{e}^-} = \bar\mu_{\mathrm{e}^-}/(-e)$. Why not just generalize this to ions as well?

$$ V_i = \frac{\bar\mu_i}{q_i}, $$

where $q_i$ is the charge of the species: $-e$ for electrons, $+e$ for lithium ions, and so on for any kind of charge carrier. I call this quantity $V_i$ the **species voltage**.

> **Note**: In chemistry, we work with molar quantities, so $\bar\mu_i$ would be in joules/mol and $q_i$ in coulombs/mol. In that case, $q_i = z_i F$ where $z_i$ is the charge number (-1, +1, +2, etc.) and $F$ is the Faraday constant. Either way, the final quantity $V_i$ is a voltage measured in Volts (V).

Let's re-plot our battery with this new representation. I call these diagrams **electrochemical species band diagrams (ESBDs)**.

{% include "esbd-diagrams/bd-basicbattery-voltage-esbd.html" %}

(You can try moving the offset slider again to see vertical invariance is restored: everything shifts together nicely now.)

Here we can finally see how the battery works, and we have a satisfying answer to 'what is in the middle of a battery' — it's the landscape of ionic voltages! In this case, the voltage $V_{\mathrm{Li}^+}$ sits just below $V_{\mathrm{e}^-}$ in the anode due to how loosely the ions are bound in the anode (typically graphite), whereas the $V_{\mathrm{Li}^+}$ sits far below $V_{\mathrm{e}^-}$ in the cathode (e.g. $\mathrm{LiFePO_4}$) due to the lithium ions being very tightly bound there. Anyway, we will get back more into the details of lithium-ion batteries later on.

I want to emphasize why this is uniquely powerful:

* It **represents electrons and ions equally** as first-class charge carriers.
* It takes energy diagrams back into the **hands-on** realm of electronics (voltages).
* **Charge transport is unambiguous**: positive charges move from high to low $V_i$, and negative charges move from low to high $V_i$.
* **Electrochemical reactions appear** as well-defined differences, $V_i - V_j$.
* We will see that **ionic standard states** appear as reference levels $V_i^\circ$, functioning like semiconductor band edges.
* We can build a complete picture without ever needing to bring up the inaccessible concept of an in-material electrostatic potential ($\phi$).
* It **directly represents the fundamental thermodynamics** of charged species: their electrochemical potentials.

Ultimately, what started out as a niche picture about batteries has turned into a refreshing alternative mental framework for all electrochemical phenomena.

## Explore More

Intrigued? The real power of ESBDs becomes apparent when applied to various systems. Explore these topics through interactive diagrams and detailed explanations by clicking on a topic below:

{% include "esbd_topic_list.md" %}
