---
layout: layouts/esbd_topic.njk
title: Species voltage
tags: [page, esbd_topic]
orderESBD: 10
eleventyNavigation:
    key: Species voltage
    parent: ESBD
    order: 10
---

# Species voltage: a real voltage for real charges

Our key player is the **species voltage** $V_i$, a potential defined for every type of charge carrier $i$ (e.g., electron $\mathrm{e}^-$, or hydrogen ion $\mathrm{H}^+$, or sulfate ion $\mathrm{SO_4}^{2-}$, ...). It's derived from a more fundamental thermodynamic quantity called the electrochemical potential, $\bar\mu_i$, by simply normalizing for the species' charge $q_i$:

$$ V_i = \frac{\bar\mu_i}{q_i}. $$

This may look intimidating for those not versed in the fundamentals of thermodynamics and the meaning of chemical potential. But you do not have to deeply understand $\bar\mu_i$ to understand $V_i$, because you likely already know how it works:

> **The electronic quantity $V_{\mathrm{e}^-}$ is precisely the voltage seen in basic electronic circuits.**

<figure class="demo-container" style="max-width: 250px">
<img src="/esbd/img/BJT-biasing.svg" style="max-width:100%"/>
<figcaption>

Rigorously speaking, electronic circuits are all about the electronic species voltage $V_{\mathrm{e}^-}$. The idea of $V_i$ is to extend this to ions too.
<small>[Image from Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Transistor_Simple_Circuit_Diagram_with_NPN_Labels.svg).</small>

</figcaption>
</figure>

That is,
* $V_{\mathrm{e}^-}$ equalizes when we short metal wires together,
* $V_{\mathrm{e}^-}$ drops across a resistor according to $\Delta V = IR$,
* $V_{\mathrm{e}^-}$ is thermodynamically analogous to an electronic 'pressure',
* it is a $V_{\mathrm{e}^-}$ difference that you measure across a battery's terminals,
* $V_{\mathrm{e}^-}$ is conventionally assigned to $0$ for the electrical ground,
* and so on, you get the idea.

Of course, the common teaching is that circuit voltage is determined by the electrostatic potential $\phi$. But in mixed materials, and really with any inhomogeneities, $\phi$ immediately stops behaving like a circuit voltage once you dig into the material properties.^[Riess, I. (1997). [What does a voltmeter measure?](https://doi.org/10.1016/s0167-2738(96)00542-5) Solid State Ionics, 95(3–4), 327–328.]^[Kittel & Kroemer (2000), *Thermal Physics*]^[Datta, S. (2005), *Quantum Transport*]^[Newman & Balsara (2005), *Electrochemical Systems*] This happens already in trivial cases like a metal-metal connection between a copper wire and a blob of solder where circuit voltage is clearly the same, yet $\phi$ differs. I have a lot more to say about this in [an appendix](../phi/), but in short there is a distinction between "what does a voltmeter measure" vs. "what is the potential difference seen by an imaginary non-interacting test charge". Both of these are called voltages, an unfortunate ambiguity. Traditionally, we stick with "$\phi$ is voltage" and swallow its inevitable awkwardness, and say that electronic circuits are a naive simplification. But myself I believe that practical voltmeters are more important, and to sweeten the deal, voltmeters access a thermodynamically rigorous physical quantity. So, **$V_{\mathrm{e}^-}$ is voltage**!

Accepting that $V_{\mathrm{e}^-}$ is the familiar *electronic* circuit voltage, we only have to make a couple more conceptual leaps to arrive at a voltage for ions too:
* It's not only electrons and $V_{\mathrm{e}^-}$, but by extension $V_i$ for any charged species that ought to satisfy the meaning of 'voltage', and consequently,
* Where multiple charged species are present, there will be *multiple* voltages in the same place.

Below I'll highlight the key principles of what makes $V_i$ a voltage.

> *Terminology note*: Some may object to labelling $V_i$ as a "voltage" rather than potential; technically a voltage should be a potential difference. However, there are [way too many things called "potential" in electrochemistry](../about/#whyvoltage) (including potential differences), and moreover in electronic circuits, an unreferenced single-point voltage simply means a potential difference versus a common electronic ground point, a convention which we may adopt without issue.^[We can freely make $V_{\mathrm{e}^-}(\text{ground}) = 0$ by choosing our electrostatic potential (e.g. via a gauge transformation) such that $\bar\mu_{\mathrm{e}^-}(\text{ground})=0$. The ground definition of course does not change any measurable (difference) quantity. Note that for consistency, we can only declare one ground datum for one species — we do not declare distinct grounds for distinct species.]

## Differences in $V_i$ are available work

The fundamental rule of thermodynamics is that particles flow from high to low chemical potential ($\bar\mu_i$) to release free energy. The difference, $\Delta \bar\mu_i$, is the maximum work that can be extracted from this flow. (To be precise, this is only true when both bodies have equal temperatures,^[The equal-temperature requirement means we can transfer any amount of energy between the bodies along with the particle transfer, and the amount of energy transfer does not affect the available work. But where bodies also differ in temperature, we can also extract available work from the thermal difference. Practically with temperature gradients we see thermoelectric effects that complicate the interpretation of voltages.] but we will generally assume isothermal conditions).

The available work $\Delta\bar\mu_i$ is free energy per unit of particle count (e.g. kJ/mol or eV/particle). By normalizing $V_i = \bar\mu_i/(z_i F)$, the corresponding $\Delta V_i$ is **available work per unit charge** (volts). But, it's not just the work for *any* charge, rather it is specific to charge transferred via that specific species.

> DIAGRAM - combo plot. \bar\mu_i step annotated with 'work per particle'. V_i step annotated with 'work per charge' consistently with the above. consistent and with slider.

## Differences in $V_i$ are measurable with voltmeters

The fact that $\Delta V_i$ represents available work means it is in principle measurable, for any species $i$. Practically, however, we do live in a world where one species (electrons) is much easier to probe than the others.

The common voltmeter has metal probes. It measures differences in $V_{\mathrm{e}^-}$ by permitting a small, ideally negligible, number of electrons to flow in via metal probes. In fact, the reason electronic voltmeters work so directly and conveniently is that so many of our conductors are purely electronic: we can attach wires of many different materials together, and since electrons are the only mobile carriers, then they transmit $V_{\mathrm{e}^-}$ perfectly without any of the complications we see in multi-ion solutions.

> DIAGRAM? - show V_e- with multi-metal sequence leading up to voltmeter 

For ions' $V_i$, a regular voltmeter with its metallic probes cannot directly couple to the ions. Or to be more precise, this coupling is badly controlled. But with careful probe construction, we can make a controlled coupling between $V_i$ and $V_{\mathrm{e}^-}$, and then by measuring $V_{\mathrm{e}^-}$ with a regular voltmeter we therefore have indirect access to $V_i$. In many cases these electrodes will be particularized to the situation and the nature of the target ion. There is also a [generic recipe (see later topic)](../nuances/) based on ion-selective membranes that can be used in principle to measure *any* ionic voltage $V_i$.

> DIAGRAM - sketch of a generic V_i probe as an interchange between V_i and V_e-

## About differences $V_i - V_j$

There is an important caveat: the hidden choice of chemical potential convention imparts a global offset on each ion's $V_i$. The impact of this hidden assumption is to apply a consistent (but somewhat arbitrary) offset to all values $V_i - V_j$ for each pair of distinct species $i\neq j$. But we'll see there is one fairly universal chemical potential convention that we can adopt, and we will discuss this quantitatively in the next topic.

In fact we could have defined $V_i$ differently by adding various per-species offsets (globally constant but different for each $i$), which would also definitionally impact $V_i - V_j$, and I'll explore these alternative additives in a later topic. Of particular interest is the redox band diagram picture which removes the arbitrariness of the chemical potential (but introduces its own nuances). But after much thought, I have found the un-offsetted $ V_i = \bar\mu_i / q_i $ is the most concise and elegant choice, so we'll proceed with this definition.

Regardless, all of this does not affect ionic $V_i$ differences within the same species (e.g. we can exactly define and measure the difference in $V_{\mathrm{H}^+}$ between two solutions, even if they have different solvents).

## Takeaways

So, we've seen that this electrochemical species voltage $V_i$ is no stranger to us, and in fact it just rigorously generalizes the familiar notion of electronic circuit voltage. What we are going to see going forward is that $V_i$ has a simultaneous triple function: 1) it is a hands-on voltage, 2) it is a visual tool, and 3) it is a deeply thermodynamically and chemically meaningful quantity.

As we go along through the next topics, we're going to follow a 'top-down' approach, starting with pure thermodynamics ($V_i$ only), and keeping $V_i$ as our reliable lifeline as we later dive down into microscopic concepts. This is the opposite of usual 'bottom-up' solid-state and electrochemistry teaching, which starts with idealized microscopic concepts like independent electrons and infinite crystalline solids, or ideal solutes and homogeneous solutions, and gradually adds on complications like nonideality, inhomogeneity, and junctions. In the bottom-up pedagogy, when we finally arrive at the full thermodynamic picture, we are often left clinging to strained and bandaged microscopic concepts, and the unifying power of $\bar\mu_i$ is left unappreciated.

Now that we've established $V_i$ as our core quantity, we're going to want to see what $V_i$ looks like in equilibrium. This includes the important topic of electrochemical reactions, which are what link different charged species (i.e. connecting our electronic circuit and ionic circuits) and thereby set $V_i - V_j$.

[**NEXT TOPIC: Equilibrium**](../equilibrium/)
