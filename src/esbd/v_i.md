---
layout: layouts/esbd_topic.njk
title: Species voltage
tags: [page, esbd_topic]
orderESBD: 10
---

# Species voltage: a real voltage for real charges

Our key player is the **species voltage** $V_i$, a potential defined for every type of charge carrier $i$ (e.g., electron $\mathrm{e}^-$, or hydrogen ion $\mathrm{H}^+$, or sulfate ion $\mathrm{SO_4}^{2-}$, ...). It's derived from a more fundamental thermodynamic quantity called the electrochemical potential, $\bar\mu_i$, by simply normalizing for the species' charge $q_i$:

$$ V_i = \frac{\bar\mu_i}{q_i}. $$

This may look intimidating for those not versed in the fundamentals of thermodynamics and the meaning of chemical potential. But you do not have to deeply understand electrochemical potential^[If you want to, an optional later topic, [Understanding electrochemical potential](../muintro/), makes the case that $\bar\mu_i$ is the *real*, indivisible chemical potential, which is exactly what makes $V_i$ so natural. That depth is genuinely not needed here, though.] to understand $V_i$, because you likely already know how $V_i$ works:

**The electronic quantity $V_{\mathrm{e}^-}$ is precisely the voltage seen in basic electronic circuits.**

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
* There can be *multiple* voltages in the same place. Semiconductor physicists are already comfortable with this possibility, by the name "{% wiki "quasi Fermi level" %}", but we are extending this to ions at equilibrium.

Below I'll highlight the key principles of what makes $V_i$ a voltage.

> **Voltage or potential?** Some may object to labelling $V_i$ as a "voltage" rather than "potential"; technically a voltage should be a potential difference. However, there are [way too many things called "potential" in electrochemistry](../about/#whyvoltage), most of which are potential differences; if voltages are so heavily conflated with potentials then we might as well go with it. Moreover, in electronic circuits, an unreferenced single-point voltage simply means a potential difference versus a common electronic ground point, a convention which we will tend to adopt. More technically: $V_i$ are all unreferenced (gauge covariant) quantities, and we are free to use gauge freedom to assign 0 to electronic ground.^[We can freely make $V_{\mathrm{e}^-}(\text{ground}) = 0$ by choosing our electrostatic potential (e.g. via a gauge transformation) such that $\bar\mu_{\mathrm{e}^-}(\text{ground})=0$. The ground definition of course does not change any measurable (difference) quantity. Note that for consistency, we can only zero out one ground datum for one species — we do not declare distinct grounds for distinct species.]

## What about electrostatic potential $\phi$?

It is commonly taught that the electrostatic potential $\phi$ (ostensibly from Maxwell's equations) is what defines voltage. I had to unlearn that when doing nanoelectronics,^[Datta, S. (2005), *Quantum Transport*; see also his [Lessons from Nanoelectronics](https://engineering.purdue.edu/Intranet/Groups/Schools/ECE/Admin/GradOffice/StudentResources/Datta/Datta_PartA.pdf). "*It is only under special conditions that $\tilde\mu$ and $\phi$ track each other and one can be used in place of the other*".] and it already goes wrong in something as ordinary as a copper wire joined to a blob of solder, where $\phi$ takes a step that the circuit voltage does not:

{% include "esbd-diagrams/esbd-copper-solder.njk" %}

Worse, the in-material $\phi$ is not experimentally accessible. Its overall offset is free, of course, but the deeper trouble is that even *differences* in $\phi$ (the {% wiki "Galvani potential", "Galvani potentials" %}) are generally unmeasurable. So $\phi$ ends up *assigned by convention*, material by material, at which point it is no longer an electrostatic potential at all, and $-\nabla\phi$ need not be any real electric field. The $\phi$ picture can be made to work once every convention is reconciled and every ambiguity hedged (in the end it cancels out of all observables), but that fragile apparatus is exactly what has bred so many errors and misconceptions.

So we will simply not use an in-material $\phi$. We stick to $V_i$, and later to $V^\circ_i$, which does $\phi$'s job with far less ambiguity; you will see as we go that we never actually need it.^[This generalizes the elegant $\phi$-less "Fermi levels and band edges only" philosophy of semiconductor device physics; see [H. Kroemer's Nobel Lecture](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf). It is also what lets us speak of "quasi-electric fields," far more useful than any single $-\nabla\phi$.] The full case against $\phi$ has [its own appendix](../phi/), and the [Offsets galore](../offsetsgalore/) topic lets you see for yourself just how arbitrary it is.

## Differences in $V_i$ are available work

The fundamental rule of thermodynamics is that particles flow from high to low chemical potential ($\bar\mu_i$) to release free energy. The difference, $\Delta \bar\mu_i$, is the maximum work that can be extracted from this flow. (To be precise, this is only true when both bodies have equal temperatures,^[The equal-temperature requirement means we can transfer any amount of energy between the bodies along with the particle transfer, and the amount of energy transfer does not affect the available work. But where bodies also differ in temperature, we can also extract available work from the thermal difference.] but we will generally assume isothermal conditions).

The available work $\Delta\bar\mu_i$ is free energy per unit of particle count (e.g. kJ/mol or eV/particle). By normalizing $V_i = \bar\mu_i / q_i$, the corresponding $\Delta V_i$ is **available work per unit charge** (volts). But, it's not just the work for *any* charge, rather it is specific to charge transferred via that specific species.

{% include "esbd-diagrams/levels-mu-V-work.njk" %}

## Differences in $V_i$ drive currents

Since $V_i$ is available work, then currents from high to low $V_i$ will occur spontaneously (such flows increase entropy). The simplest form of this is Ohm's law:

$$J_i = -\sigma_i \nabla V_i$$

Note this is simpler than the common split seen in electrochemistry and solid state physics, where the driving force $-\nabla V_i$ is split into drift (from $-\nabla\phi$) and diffusion (from $-\nabla c_i$). The drift and diffusion coefficients have an exact relation (the {% wiki "Einstein relation" %}) since they are both manifestations of $-\nabla V_i$.

Not all currents are so simple as Ohm's law, of course. Interfaces often have a nonlinear current-voltage relationship; there may be cross coupling where electrochemical potential gradients in one species drives another species (including neutral species); there may be other driving forces like magnetic induction or thermoelectricity; there may be convection/advection.

## Differences in $V_i$ are measurable

Because $\Delta V_i$ is available work, it is in principle measurable for any species, though in practice one species, electrons, is far easier to probe than the rest.

A common voltmeter has metal probes and reads differences in $V_{\mathrm{e}^-}$, letting a tiny, ideally negligible electron current flow in. It works so cleanly because so many of our conductors are purely electronic: join wires of any assortment of metals and, since electrons are the only mobile carrier, $V_{\mathrm{e}^-}$ carries across all of them perfectly.

{% include "esbd-diagrams/esbd-multi-metal-voltmeter.njk" %}

Ions are harder. We have no good "ion wires" (an electrolyte carries at least one cation *and* one anion), and no ionic voltmeters, so we can only probe $V_{\mathrm{ion}}$ indirectly, by coupling it to $V_{\mathrm{e}^-}$. A carefully prepared **ion-reversible electrode** chemically locks $V_{\mathrm{e}^-}$ to the $V_i$ of exactly one ion, producing a fixed step $V_{\mathrm{e}^-} - V_{\mathrm{ion}} = \Delta$.

{% include "esbd-diagrams/esbd-electrode-generic.njk" %}

But $\Delta$ is a gap between *different* species (an electron and an ion), so, like any $V_i - V_j$ below, it carries a chemical convention, and a single electrode does **not** hand you an absolute $V_{\mathrm{ion}}$. What it gives cleanly is a *same-ion difference*: put a matched electrode in each of two solutions and $\Delta$ cancels, leaving exactly $V_{\mathrm{ion}}(\text{B}) - V_{\mathrm{ion}}(\text{A})$, a fully physical voltage obtained without ever knowing $\Delta$.^[Riess, I. ["Mixed ionic–electronic conductors—material properties and applications."](https://doi.org/10.1016/S0167-2738(02)00182-0) Solid State Ionics 157.1-4 (2003): 1-17.]

{% include "esbd-diagrams/esbd-electrode-generic-differential.njk" %}

So ionic $V_i$ is no less real than electronic $V_{\mathrm{e}^-}$; it is just that only its differences, for a given ion, are directly accessible. (A more general but less practical recipe, using ion-selective membranes, comes [later](../nuances/).)

## $V_i$ are thermodynamic state variables

Alongside temperature $T$, pressure $P$, and the chemical potentials $\mu_i$ of neutral elements, the $V_i$ (or $\bar\mu_i$) are the proper intensive state variables for charged species. Since $T$, $P$, and the solvent $\mu$ tends to be constant or implicitly clear, it means that our plots of varying $V_i$ will be a complete visualization of the spatial varations thermodynamic state in many cases.

Note that in general if we have $N$ charged species then there are $N$ independent $V_i$ values, however there are only $N-1$ independent charged species concentrations, because the body has to (generally) be charge neutral. The extra degree of freedom in the set of $V_i$ values is not redundant but actually represents important state information: it is the electrical state of the body. If we uniformly increase all the $V_i \rightarrow V_i + \delta$ then the body is in a distinct thermodynamic state (electrically) even though it is equivalent in all other aspects. This brings us to our next point...

## $V_i$ floats, and $V_i - V_j$ carries a convention

Two last subtleties round out the picture. Both are better *seen* than told, so the [Offsets galore](../offsetsgalore/) topic puts them under interactive sliders; here is the short version.

The whole set of $V_i$ shares one **global float**: raise every $V_i$ (along with $V^\circ_i$, $\phi_{\mathrm{vac}}$, and the rest) by the same amount, and nothing observable changes. It is a single gauge degree of freedom for the entire universe, so there is no meaningful *absolute* voltage; only differences carry meaning.^[This covariance is a feature, not a redundancy to apologize for. Traditional electrochemistry instead leans on a patchwork of *local* references (the SHE, the vacuum, …), one per phase, and these can even drift across a device under bias, when there is really only ever *one* global freedom to fix. Staying reference-free sidesteps the perennial "but what is the *true* zero?" debates. The thermodynamic origin of this float is derived in [Understanding electrochemical potential](../muintro/).] To actually draw a diagram we of course pin the zero somewhere; I put the negative electrode at $0$, as is usual in electronics.

Comparing *different* species, $V_i - V_j$, inherits a chemical-potential convention: a globally-consistent but somewhat arbitrary offset, set by how we reference each element. Comparing the *same* species across places, $V_i(x) - V_i(y)$, has no such ambiguity; it is always physical, even between different solvents. (This is the same fact we just met when measuring ions: a matched pair of electrodes cleanly reads exactly these same-ion differences.)


## Takeaways

So, we've seen that this electrochemical species voltage $V_i$ is no stranger to us, and in fact it just rigorously generalizes the familiar notion of electronic circuit voltage. What we are going to see going forward is that $V_i$ has a simultaneous triple function: 1) it is a hands-on voltage, 2) it is a visual tool, and 3) it is a deeply thermodynamically and chemically meaningful quantity.

As we go along through the next topics, we're going to follow a 'top-down' approach, starting with pure thermodynamics ($V_i$ only), and keeping $V_i$ as our reliable lifeline as we later dive down into microscopic concepts. This is the opposite of usual 'bottom-up' solid-state and electrochemistry teaching, which starts with idealized microscopic concepts like independent electrons and infinite crystalline solids, or ideal solutes and homogeneous solutions, and gradually adds on complications like nonideality, inhomogeneity, and junctions. In the bottom-up pedagogy, when we finally arrive at the full thermodynamic picture, we are often left clinging to strained and bandaged microscopic concepts, and the unifying power of $\bar\mu_i$ is left unappreciated.

Now that we've established $V_i$ as our core quantity, we're ready to put it to work. Next we turn to equilibrium and the electrochemical reactions that link different charged species (connecting our electronic and ionic circuits) and thereby set $V_i - V_j$.

[**NEXT TOPIC: Equilibrium**](../equilibrium/)
