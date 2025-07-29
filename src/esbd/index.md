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

Plotting the voltage vs. position,

<figure class="diagram-placeholder">

  **plot V vs position with ??? in middle** .<br>
  vert axis reads 'Voltage'<br>

</figure>


what are we supposed to draw in place of the '???'? A straight line? A sudden jump? Something else? Or is there no useful/meaningful voltage in the electrolyte at all? What about when a battery is discharged, how do we visualize the lossy voltage drops (internal resistances)?

While the equations of electrochemistry are precise, the visual tools for building intuition are often lacking. There is a head-smackingly simple solution to this, which generalizes to vizualize all of electrochemistry, but until now it has been unused and possibly undiscovered.

## The energy problem

Semiconductor physicists are used to understanding everything in terms of electronic energies, and we use the term "{%wiki "band diagram" %}" referring to a plot electronic energies vs. position. These band diagrams are the primary visual and pedagogical tool for showing what is happening, thermodynamically, inside of semiconductor devices. So, what happens when we try to represent a battery with a regular band diagram?

<figure class="diagram-placeholder">

  **plot $\bar\mu_{\mathrm{e}^-}$ vs position with empty space in middle**.<br>
  vert axis reads 'Energy'<br>

</figure>

We still have a missing middle! But we can be more precise and say _the middle is undefined_: there simply are no free electrons inside the electrolyte.

Note: The plotted quantity $\bar\mu_{\mathrm{e}^-}$ is the chemical potential of electrons (also known as {% wiki "electrochemical potential" %} of electrons, or {% wiki "Fermi level" %}). And in fact, it is directly related to the the _thermodynamic_ voltage —i.e., the voltage you can read from a voltmeter, and the useful voltage in terms of driving power— via $V = -\bar\mu_{\mathrm{e}^-}/e$ where $-e$ is the electron charge.

So our energy diagram literally is an upside down voltage diagram, and this seems to answer firmly "there is no meaningful voltage inside of a battery".

But it is quite unsatisfying to stop at this point. To paraphrase Herbert Kroemer, "if you don't draw a band diagram, then nobody knows what you're talking about".^[https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf] The need for visualizations means that band diagrams do get anyway drawn for batteries, but are often full of misconceptions and unphysical ideas^[cite Peljo] (something I will address in a later article).

To make headway, let's recognize something crucial: in batteries, we have both electrons and ions as charge carriers. For example $\mathrm{Li}^+$ ions in the case of lithium-ion batteries. Why should we expect that we can get away with only talking about electronic energies? Why shouldn't we treat the lithium ions on equal footing with the electrons? After all, ions have their own well-defined chemical potential, such as $\bar\mu_{\mathrm{Li}^+}$.

Let's try generalizing our plot to include ionic energies:

<figure class="diagram-placeholder">

  **plot $\bar\mu_{\mathrm{e}^-}$ and $\bar\mu_{\mathrm{Li}^+}$ vs position**.<br>
  vert axis reads 'Energy'<br>
  <br>
  Sliders let us change 

</figure>

Fantastic, we have filled the gap and closed the circuit! Unfortunately, such a diagram has a serious flaw: if we change the overall voltage offset (try moving the slider above), the energies do not move in unison (because the electron and ion have different charges). In other words, this loses an important _vertical invariance_ feature of band diagrams, which is that the overall vertical offset is arbtrary, and it is only the energy differences that are of interest. So, just one more small but crucial tweak is needed...

## The $V_i$ solution

Before we saw our electronic voltage, why not just generalize this to ions as well:

$$ V_i = \frac{\bar\mu_i}{q_i}, $$

where $q_i$ is the charge of the species: $-e$ for electrons, $+e$ for lithium ions, and so on for any kind of charge carrier. I call this quantity $V_i$ the **species voltage** -- it can be either the usual electronic voltage (now $V_{\mathrm{e}^-}$), or an ionic voltage ($V_{\mathrm{Li}^+}$).

>If we are working in chemistry units, then both $\bar\mu_i$ and $q_i$ should be molar quantities, i.e., $q_i = z_i F$ where $z_i$ is the charge level (-2, +1, etc.) and $F$ is the Faraday constant. So $\bar\mu_i$ would be in joule/mol and $q_i$ in coulomb/mol. Then:

>$$ V_i = \frac{\bar\mu_i}{z_i F}, $$

> Either way, the final answer $V_i$ is a voltage quantity (measured in V: volts). 

Let's re-plot our battery with this new representation. I call these diagrams **electrochemical species band diagrams** (ESBD).

<figure class="diagram-placeholder">

  **plot $V_i$ vs position**.<br>
  vert axis reads 'Species voltage'<br>
  <br>
  Same data and sliders as previous plot -- only change is the representation.

</figure>

(and you can try moving a slider again to see: everything moves together!)

Here we can finally see how the battery works, and a satisfying answer to 'what is in the middle of a battery' -- it's ionic voltages!

I want to emphasize why this is uniquely powerful:

* It represents electrons and ions equally.
* It takes energy diagrams back into the hands-on realm of electronics (voltages).
* Charge movement is clear, as each species diffuses according to its $V_i$ curve: downhill for positive charges, and uphill for negative charges.
* Electrochemical reactions now manifest as voltage differences, $V_i - V_j$.
* We will even see electrochemical standard states manifest as reference levels $V_i^\circ$, much like semiconductor band edges.
* It remains directly connected to the most fundamental thermodynamic descriptor of charged species: their electrochemical potentials.

And, this goes beyond just batteries, as it really offers an alternative mental framework for how to think about all electrochemical phenomena. In this framework it is never even needed to bring up the inaccessible concept of an in-material electrostatic potential ($\phi$).

## Explore More

Intrigued? The real power of ESBDs becomes apparent when applied to various systems. Explore these topics through interactive diagrams and detailed explanations by clicking on a topic below:

{% include "esbd_topic_list.md" %}
