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

This may look intimidating for those not versed in the fundamentals of thermodynamics and the meaning of chemical potential. But you do not have to deeply understand electrochemical potential to understand $V_i$, because you likely already know how $V_i$ works:

> **The electronic quantity $V_{\mathrm{e}^-}$ is precisely the voltage seen in basic electronic circuits.**

<figure class="demo-container" style="max-width: 250px">
<img src="/esbd/img/BJT-biasing.svg" style="max-width:100%"/>
{% figcaption %}
Rigorously speaking, electronic circuits are all about the electronic species voltage $V_{\mathrm{e}^-}$. The idea of $V_i$ is to extend this to ions too.
<small>[Image from Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Transistor_Simple_Circuit_Diagram_with_NPN_Labels.svg).</small>
{% endfigcaption %}
</figure>

That is,
* $V_{\mathrm{e}^-}$ equalizes when we short metal wires together,
* $V_{\mathrm{e}^-}$ drops across a resistor according to $\Delta V = IR$,
* $V_{\mathrm{e}^-}$ is thermodynamically analogous to an electronic 'pressure',
* $V_{\mathrm{e}^-}$ differences are what we measure with voltmeters,^[Riess, I. (1997). [What does a voltmeter measure?](https://doi.org/10.1016/s0167-2738(96)00542-5) Solid State Ionics, 95(3–4), 327–328.]^[Kittel & Kroemer (2000), *Thermal Physics*]
* it is a $V_{\mathrm{e}^-}$ difference that you measure across a battery's terminals,
* $V_{\mathrm{e}^-}$ is conventionally assigned to $0$ for the electrical ground,
* and so on, you get the idea.

We only have to make a couple more conceptual leaps to arrive at a voltage for ions too:
* It's not only electrons and $V_{\mathrm{e}^-}$, but by extension $V_i$ for any charged species that ought to satisfy the meaning of 'voltage', and consequently,
* Where multiple charged species are present, there will be *multiple* voltages in the same place.

Below I'll highlight the key principles of what makes $V_i$ a voltage.

> **Voltage or potential?** Some may object to labelling $V_i$ as a "voltage" rather than "potential"; technically a voltage should be a potential difference. However, there are [way too many things called "potential" in electrochemistry](../about/#whyvoltage) (ironically, even proper voltages are sometimes called potentials), and moreover in electronic circuits, an unreferenced single-point voltage simply means a potential difference versus a common electronic ground point, a convention which we may adopt without issue.^[We can freely make $V_{\mathrm{e}^-}(\text{ground}) = 0$ by choosing our electrostatic potential (e.g. via a gauge transformation) such that $\bar\mu_{\mathrm{e}^-}(\text{ground})=0$. The ground definition of course does not change any measurable (difference) quantity. Note that for consistency, we can only declare one ground datum for one species — we do not declare distinct grounds for distinct species.]

## What about electrostatic potential $\phi$?

It is commonly taught that the electrostatic potential $\phi$ (ostensibly from Maxwell's equations) is what defines voltage. Myself I had to unlearn this idea long ago when doing nanoelectronic research.^[Datta, S. (2005), *Quantum Transport*. See also Datta's excellent [Lessons from Nanoelectronics](https://engineering.purdue.edu/Intranet/Groups/Schools/ECE/Admin/GradOffice/StudentResources/Datta/Datta_PartA.pdf) (also available as [video lecture](https://www.youtube.com/watch?v=0IJYCyZ98Tw)). "*It is only under special conditions that $\tilde\mu$ and $\phi$ track each other and one can be used in place of the other*".] The problem can be seen already in the commonplace connection between a copper wire and a blob of solder where electrostatic potential stops behaving like a familiar circuit voltage:

{% include "esbd-diagrams/esbd-copper-solder.njk" %}

Actually it's even worse than this. I will [elaborate on this in an appendix](../phi/), but in short:

The "real electrostatic potential" in a material is not experimentally accessible (unlike $V_i$). Consequently, it usually happens that $\phi$ gets *assigned arbitrarily* based on ad-hoc special rules for each material.^[Newman & Balsara (2005), *Electrochemical Systems*.] E.g. the strangeness of $\phi$ in basic electronics is sometimes glossed over by assigning every electronic conductor's $\phi$ to equal $V_{\mathrm{e}^-}$.^[The assignment $\phi = V_{\mathrm{e}^-}$ is often implicit: either a sneaky 'lie to children', or even unintentional. This is how many people end up unknowingly using $V_{\mathrm{e}^-}$ under the alias '$\phi$', thinking it is an electrostatic quantity when it was actually the thermodynamic electrochemical potential all along.] When these arbitrary assignments are done, then it means *$\phi$ is no longer even an electrostatic potential and its gradient is not always electric field*. We can try to avoid arbitrary $\phi$ assignments and keep $\phi$ strictly connected to electrostatics, but even this can fail for subtle reasons.^[See Bard & Faulkner's *Electrochemical Methods*, where in chapter 2 they define $\phi$ by strict electrostatics. The problem, well known in electrochemical thermodynamics, occurs when we try to treat the chemistry of ions in concentrated solutions using the {% wiki "Nernst equation" %}, which uses ion activities. Any practical definition of ion activities requires an 'ion activity convention' that is tantamount to a partial fixing of $\phi$, and thus an abandonment of the strict electrostatic meaning of $\phi$. See the [nonideality appendix](../nonideal/) for my take on this.]

The problems with $\phi$ make it a shaky foundation for any rigorous theory, yet it is the basis for traditional electrochemistry and some semiconductor engineering. To be clear, the $\phi$ view does work after all necessary corrections are applied, inconsistent conventions are reconciled, and ambiguities are hedged: $\phi$ simply cancels out of every observable! Unfortunately this complicated apparatus has led to errors, misconceptions, and misguided research.

In this project, a major theme is that I actively *avoid* using $\phi$, and try to construct a picture without it. I am taking the elegant and honest "circuit voltage is $V_{\mathrm{e}^-}$" view and extending it all the way across solid-state physics and into ionics and electrochemistry. We will reintroduce electrostatic potential only when needed and when we can be honest about its function.

## Differences in $V_i$ are available work

The fundamental rule of thermodynamics is that particles flow from high to low chemical potential ($\bar\mu_i$) to release free energy. The difference, $\Delta \bar\mu_i$, is the maximum work that can be extracted from this flow. (To be precise, this is only true when both bodies have equal temperatures,^[The equal-temperature requirement means we can transfer any amount of energy between the bodies along with the particle transfer, and the amount of energy transfer does not affect the available work. But where bodies also differ in temperature, we can also extract available work from the thermal difference.] but we will generally assume isothermal conditions).

The available work $\Delta\bar\mu_i$ is free energy per unit of particle count (e.g. kJ/mol or eV/particle). By normalizing $V_i = \bar\mu_i / q_i$, the corresponding $\Delta V_i$ is **available work per unit charge** (volts). But, it's not just the work for *any* charge, rather it is specific to charge transferred via that specific species.

{% include "esbd-diagrams/levels-mu-V-work.html" %}

## Differences in $V_i$ drive currents

Since $V_i$ is available work, then currents from high to low $V_i$ will occur spontaneously (such flows increase entropy). The simplest form of this is Ohm's law:

$$J_i = -\sigma_i \nabla V_i$$

Note this is simpler than the common split seen in electrochemistry and solid state physics, where the driving force $-\nabla V_i$ is split into drift (from $-\nabla\phi$) and diffusion (from $-\nabla c_i$). The drift and diffusion coefficients have an exact relation (the {% wiki "Einstein relation" %}) since they are both manifestations of $-\nabla V_i$.

Not all currents are so simple as Ohm's law, of course. Interfaces often have a nonlinear current-voltage relationship; there may be cross coupling where electrochemical potential gradients in one species drives another species (including neutral species); there may be other driving forces like magnetic induction or thermoelectricity; there may be convection/advection.

## Differences in $V_i$ are measurable with voltmeters

The fact that $\Delta V_i$ represents available work means it is in principle measurable, for any species $i$. Practically, however, we do live in a world where one species (electrons) is much easier to probe than the others.

The common voltmeter has metal probes. It measures differences in $V_{\mathrm{e}^-}$ by permitting a small, ideally negligible, number of electrons to flow in via metal probes. In fact, the reason electronic voltmeters work so directly and conveniently is that so many of our conductors are purely electronic: we can attach wires of many different materials together, and since electrons are the only mobile carriers, then they transmit $V_{\mathrm{e}^-}$ perfectly without any of the complications we see in multi-ion solutions.

{% include "esbd-diagrams/esbd-multi-metal-voltmeter.njk" %}

With ions, it is much harder to probe $V_i$ due to practical complications: we generally don't have single-ion conductors (e.g. electrolytes contain at least one positive and one negative ionic species) that we could use to make "ion wires". Even when we do have single-ion wires, we would also need ionic voltmeters to make a full ionic circuit. Due to both of these factors, we will only probe ionic $V_{\mathrm{ion}}$ in-situ, and indirectly via coupling to $V_{\mathrm{e}^-}$ regular (electronic) voltmeters. My argument is that $V_{\mathrm{ion}}$ is no less real, it is just trickier to access.

A regular voltmeter with its metallic probes tends to have a poorly controlled connection between $V_{\mathrm{ion}}$ and $V_{\mathrm{e}^-}$. But with careful preparation of the probe surface, we get an **ion-reversible electrode**: an interface that chemically couples $V_{\mathrm{e}^-}$ to the $V_i$ of exactly one ionic species, while ignoring all others.". This manifests as a step $V_{\mathrm{e}^-} - V_{\mathrm{ion}} = \Delta$ for some value $\Delta$ that is determined by chemical equilibration; provided the $\Delta$ is well controlled, we therefore have indirect access to $V_{\mathrm{ion}}$ by probing the $V_{\mathrm{e}^-}$ with a regular voltmeter and subtracting $\Delta$.

> Note that $\Delta$ is related to, but very much distinct from, the electrode potential.

{% include "esbd-diagrams/esbd-electrode-generic.html" %}

And of course, if we use two such electrodes (with the same $\Delta$) then we can perform a differential measurement between two arbitrary solutions:

{% include "esbd-diagrams/esbd-electrode-generic-differential.html" %}

In this way, the difference $\Delta$ will perfectly cancel and so the measured voltage will be equal to $V_{\mathrm{ion}}(\text{solution B}) - V_{\mathrm{ion}}(\text{solution A})$. This shows that variations in $V_{\mathrm{ion}}$ can be measured even when we don't know the value of $\Delta$.^[Riess, I. ["Mixed ionic–electronic conductors—material properties and applications."](https://doi.org/10.1016/S0167-2738(02)00182-0) Solid State Ionics 157.1-4 (2003): 1-17.]

In many cases these electrodes will be particularized to both the target ion and to the environment of that ion. A key criterion is that $V_{\mathrm{e}^-}$ only couples to the target $V_{\mathrm{ion}}$ and not to any other charged species. There is also a [generic recipe (see later topic)](../nuances/) that can be used in principle to non-invasively measure any ionic voltage $V_i$, but it is based on ion-selective membranes which are only practically available for some ions in some compatible solutions.

## About differences $V_i - V_j$

There is an important caveat: the hidden choice of chemical potential convention imparts a global offset on each ion's $V_i$. The impact of this hidden assumption is to apply a consistent (but somewhat arbitrary) offset to all values $V_i - V_j$ for each pair of distinct species $i\neq j$. This does not affect ionic $V_i$ differences within the same species (e.g. we can exactly define and measure the difference in $V_{\mathrm{H}^+}$ between two solutions, even if they have different solvents).

We will discuss this more quantitatively in the next topic.

{#
In fact we could have defined $V_i$ differently by adding various per-species offsets (globally constant but different for each $i$), which would also definitionally impact $V_i - V_j$, and I'll explore these alternative additives in a later topic. Of particular interest is the redox band diagram picture which removes the arbitrariness of the chemical potential (but introduces its own nuances). But after much thought, I have found the un-offsetted $ V_i = \bar\mu_i / q_i $ is the most concise and elegant choice, so we'll proceed with this definition.
#}


## Takeaways

So, we've seen that this electrochemical species voltage $V_i$ is no stranger to us, and in fact it just rigorously generalizes the familiar notion of electronic circuit voltage. What we are going to see going forward is that $V_i$ has a simultaneous triple function: 1) it is a hands-on voltage, 2) it is a visual tool, and 3) it is a deeply thermodynamically and chemically meaningful quantity.

As we go along through the next topics, we're going to follow a 'top-down' approach, starting with pure thermodynamics ($V_i$ only), and keeping $V_i$ as our reliable lifeline as we later dive down into microscopic concepts. This is the opposite of usual 'bottom-up' solid-state and electrochemistry teaching, which starts with idealized microscopic concepts like independent electrons and infinite crystalline solids, or ideal solutes and homogeneous solutions, and gradually adds on complications like nonideality, inhomogeneity, and junctions. In the bottom-up pedagogy, when we finally arrive at the full thermodynamic picture, we are often left clinging to strained and bandaged microscopic concepts, and the unifying power of $\bar\mu_i$ is left unappreciated.

Now that we've established $V_i$ as our core quantity, we're going to want to see what $V_i$ looks like in equilibrium. This includes the important topic of electrochemical reactions, which are what link different charged species (i.e. connecting our electronic circuit and ionic circuits) and thereby set $V_i - V_j$.

[**NEXT TOPIC: Equilibrium**](../equilibrium/)
