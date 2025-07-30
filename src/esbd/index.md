---
layout: layouts/esbd_topic.njk
title: 'ESBD: Intro'
tags: [page, esbd_topic]
orderESBD: 1
eleventyNavigation:
    key: ESBD
---

# Band Diagrams for Batteries: An Electrochemical Visualization

<p align='right'><small><em>Mark Lundeberg // 2025 August</em></small></p>

What is the electrical state deep inside of a battery?

If we try to visualize this by plotting voltage versus position, we immediately run into a mystery. We know the voltage at the anode (negative terminal) and the cathode (positive terminal), but what about the electrolyte in between?

<figure class="diagram-placeholder">

  **plot V vs position with ??? in middle** .<br>
  vert axis reads 'Voltage'<br>

</figure>

What are we supposed to draw in place of the '???'? A straight line? A sudden jump? Or is there no useful or meaningful voltage in the electrolyte at all? The mystery deepens when we try to understand more complex situations; how can we visualize the lossy voltage drops from internal resistance during battery discharge?

While the equations of electrochemistry are precise, the visual tools for building intuition are often lacking. There is a head-smackingly simple solution to this, which generalizes to visualize all of electrochemistry, but until now it has been unused.

## The energy problem

Semiconductor physicists are used to understanding everything in terms of electronic energies, and we use the term "{%wiki "band diagram" %}" referring to a plot electronic energies vs. position. These band diagrams are the primary visual and pedagogical tool for showing what is happening, thermodynamically, inside of semiconductor devices. So, what happens when we try to represent a battery with a regular band diagram?

<figure class="diagram-placeholder">

  **plot $\bar\mu_{\mathrm{e}^-}$ vs position with empty space in middle**.<br>
  vert axis reads 'Energy'<br>

</figure>

We still have a missing middle! We can be more precise and say _the middle is undefined_: there simply are no free electrons inside the electrolyte.


<blockquote>

**Note**: The plotted quantity $\bar\mu_{\mathrm{e}^-}$ is the chemical potential of electrons (also known as {% wiki "electrochemical potential" %} of electrons, or {% wiki "Fermi level" %}). And in fact, it is directly related to the the _thermodynamic_ voltage via $V = -\bar\mu_{\mathrm{e}^-}/e$ where $-e$ is the electron charge (differences in this voltage are what you read using a a voltmeter, and are the useful voltage in terms of driving power). Our energy band diagram quite literally is an upside-down voltage diagram, with eV units instead of V units.

</blockquote>

This seems to suggest that there is no meaningful way to complete the picture. But it is quite unsatisfying to stop at this point. To paraphrase Herbert Kroemer: if you don't draw a band diagram, then nobody knows what you're talking about.^[[H. Kroemer Nobel prize lecture, 2000](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf)] The need for visualizations means that band diagrams do get anyway drawn for batteries, but are often full of misconceptions and unphysical ideas^[cite Peljo] (something we will discuss in a later article).

## Including the ions

To make headway, let's recognize something crucial: in batteries, electrons are no longer the only charge carriers. For example $\mathrm{Li}^+$ ions in the case of lithium-ion batteries. Why should we expect that we can get away with only talking about electronic energies? Moreover why shouldn't we treat the lithium ions on equal footing with the electrons?

In fact, ions have their own well-defined chemical potential, such as $\bar\mu_{\mathrm{Li}^+}$. Let's try generalizing our plot to include ionic energies:

<figure class="diagram-placeholder">

  **plot $\bar\mu_{\mathrm{e}^-}$ and $\bar\mu_{\mathrm{Li}^+}$ vs position**.<br>
  vert axis reads 'Energy'<br>
  <br>
  Sliders let us change 

</figure>

Fantastic, we have filled the gap and closed the circuit! Unfortunately, such a diagram has a serious flaw: if we change the overall electrostatic offset of the system (try moving the slider), the energy levels for the electron and the ion move in opposite directions because of their opposite charges. This loses an important _vertical invariance_ feature of energy diagrams, where only energy differences should matter. So, just one more small but crucial tweak is needed...

## The $V_i$ solution

Before we saw our electronic voltage, why not just generalize this to ions as well:

$$ V_i = \frac{\bar\mu_i}{q_i}, $$

where $q_i$ is the charge of the species: $-e$ for electrons, $+e$ for lithium ions, and so on for any kind of charge carrier. I call this quantity $V_i$ the **species voltage** -- it can be either the usual electronic voltage (now $V_{\mathrm{e}^-}$), or an ionic voltage ($V_{\mathrm{Li}^+}$).

<blockquote>

**Note**: In chemistry, we work with molar quantities, so $\bar\mu_i$ would be in joule/mol and $q_i$ in coulomb/mol. In that case $q_i = z_i F$ where $z_i$ is the charge level (-2, +1, etc.) and $F$ is the Faraday constant. Then:

$$ V_i = \frac{\bar\mu_i}{z_i F}, $$

Either way, the final answer $V_i$ is a voltage quantity (measured in V: volts). 

</blockquote>

Let's re-plot our battery with this new representation. I call these diagrams **electrochemical species band diagrams** (ESBDs).

<figure class="diagram-placeholder">

  **plot $V_i$ vs position**.<br>
  vert axis reads 'Species voltage'<br>
  <br>
  Same data and sliders as previous plot -- only change is the representation.

</figure>

(You can try moving the offset slider again to see vertical invariance is restored: everything shifts together nicely now.)

Here we can finally see how the battery works, and a satisfying answer to 'what is in the middle of a battery' — it's the landscape of ionic voltages!

I want to emphasize why this is uniquely powerful:

* It **represents electrons and ions equally** as first-class charge carriers.
* It takes energy diagrams back into the **hands-on** realm of electronics (voltages).
* **Charge transport is unambiguous**: positive charges want to move from high to low $V_i$, and negative charges move from low to high $V_i$.
* **Electrochemical reactions appear** as voltage differences, $V_i - V_j$.
* We will even **see the ionic standard states** as reference levels $V_i^\circ$, functioning like semiconductor band edges.
* We never rely on the ill-defined extra-thermodynamic concept of an in-material electrostatic potential ($\phi$), rather:
* We **directly represent the fundamental thermodynamics** of charged species: their electrochemical potentials.

Ultimately, I found that what started out as a niche picture about batteries has turned into an refreshing alternative mental framework for all electrochemical phenomena.

## Explore More

Intrigued? The real power of ESBDs becomes apparent when applied to various systems. Explore these topics through interactive diagrams and detailed explanations by clicking on a topic below:

{% include "esbd_topic_list.md" %}
