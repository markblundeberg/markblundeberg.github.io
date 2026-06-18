---
layout: layouts/esbd_topic.njk
title: 'Basic transport'
tags: [page, esbd_topic]
orderESBD: 26
---

# {{title}}

Until now we have stayed at equilibrium, where every species voltage runs flat and reactions only fix offsets between them. A working device is never quite there. The moment current flows the $V_i$ lines tilt, and the appeal of the picture is that those tilts are precisely the dissipation. This topic works out how carriers move once the lines are free to slope.

## One driving force per species

The thermodynamic force on a carrier is the gradient of its electrochemical potential, $-\nabla\bar\mu_i$. Dividing by charge, as we always do, the force per unit charge is just

$$ -\nabla V_i. $$

That is the whole of what drives a current: each species is pushed down its own $V_i$ slope. On the band diagram the reading could not be more direct. A flat $V_i$ carries no net current, the species being either at equilibrium or perfectly conducting; a sloping $V_i$ marks a driving force, and the steeper the slope, the harder the dissipation. Resistance is visible as gradient.

## Drift and diffusion are one law

Because the force is $-\nabla V_i$, the current of species $i$ obeys a per-species Ohm's law,

$$ J_i = -\sigma_i \nabla V_i, $$

with $J_i$ the charge current density and $\sigma_i$ the species conductivity.^[Driving transport one species at a time by its own electrochemical potential is the core of the Jamnik–Maier equivalent-circuit treatment of mixed conductors, in which each carrier rides a "rail" at $\bar\mu_i/(z_i e)$, exactly our $V_i$. J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001).] This one equation already holds the drift-diffusion machinery that electrochemistry and semiconductor physics usually present as two separate mechanisms. To see it, expand $V_i$ into its standard state and its concentration term, in an ideal homogeneous medium where $\nabla V^\circ_i = \nabla\phi$:

$$ \nabla V_i = \underbrace{\nabla\phi}_{\text{drift}} + \underbrace{\frac{RT}{z_i F}\frac{\nabla c_i}{c_i}}_{\text{diffusion}}. $$

The first term is drift in the electric field, the second is diffusion down a concentration gradient, and multiplying by $-\sigma_i$ recovers the {% wiki "Nernst–Planck equation" %} exactly. Because both terms descend from the same $\sigma_i$, the drift mobility and the diffusion coefficient are forced to share a single constant. That forced relationship is the {% wiki "Einstein relation" %}; in this framework it falls out for free rather than standing as a separate assumption.^[Written out, the diffusion term is $-\sigma_i \frac{RT}{z_iF}\frac{\nabla c_i}{c_i} = -z_i F D_i \nabla c_i$ once $\sigma_i = z_i^2 F^2 c_i D_i/RT$, the Nernst–Einstein relation. The same derivation gives the generalized Einstein relation for carriers that stray from ideal-dilute behaviour, such as the degenerate electron gas, by replacing $c_i/RT$ with the chemical capacitance. In strongly non-ideal, concentrated solutions the species also stop moving independently, and the transport coefficients become a coupled matrix, the territory of the Maxwell–Stefan or Onsager equations.]

There is a subtlety hiding in the drift term. We assumed $\nabla V^\circ_i = \nabla\phi$, but that holds only inside a uniform medium. Where the medium itself changes, at an interface or through a graded material, the standard state carries its own gradient, $\nabla V^\circ_i = \nabla\phi + \tfrac{1}{z_i F}\nabla\mu^\circ_{\mathrm{int},i}$, and that extra piece is a real driving force with no electrostatic origin, arising from changing binding energy, solvation, or steric packing. Carriers feel it as a "quasi-electric field," and it is why the textbook drift-diffusion split quietly fails across interfaces, where a dedicated interfacial law is usually wanted anyway.^[This is the transport face of the band-offset story from the [semiconductors](../solidstate/) and [bipolar](../bipolar/) topics: a step or grade in $V^\circ_i$ pushes carriers even where $\phi$ is flat. Kroemer's "quasi-electric fields" in graded heterojunctions are exactly this.] Beyond conduction, currents can also be driven by advection, thermoelectric gradients, and magnetic induction, but plain $-\nabla V_i$ conduction is our concern here.

<figure class="diagram-placeholder">
{% figcaption %}
A single sloping $V_i$ split into its drift part (the slope of $\phi$, i.e. of $V^\circ_i$) and its diffusion part (the concentration term). The two add up to the one thermodynamic slope that actually drives the current.
{% endfigcaption %}
</figure>

## The "ohmic current" shortcut

Engineering practice often collapses all of this into a single bulk current driven by one electrostatic potential,

$$ I = -\sigma\,\nabla\phi, \qquad \sigma = \sum_i \sigma_i. $$

It is a handy shortcut, and its origin is easy to see: sum the per-species drift currents and assume uniform concentrations, so that every $\nabla V_i$ reduces to the shared $\nabla\phi$. The weakness is that very assumption. As soon as concentration gradients appear, the species' $V_i$ slopes part ways, the diffusion currents start contributing to the charge flow, and $I = -\sigma\nabla\phi$ no longer holds. Tracking the individual $V_i$ keeps us honest in exactly the situations where the lumped law breaks down, and those situations are the next two effects.

## Concentration polarization

Many interfaces are selective, letting one carrier through and blocking the rest: a lithium electrode passes $\mathrm{Li}^+$ while the salt anion is turned away, or an electrode reaction consumes one ion and ignores the others. The blocked species cannot leave, so it banks up on one side and is drawn down on the other, building a concentration gradient in front of the interface. On the diagram the standard-state ladder bends to track the changing concentration while the conducting species takes on a concentration-driven slope, both registering as added resistance, the "mass-transport" or polarization resistance. Pushed hard enough, the supply of the active ion at the interface runs dry and the current can climb no further, a limit we give its own topic [shortly](../saturation/). The usual remedy is a swamping excess of inert supporting electrolyte, which carries the drift and leaves the active ion to move by diffusion alone.^[What sits at the far boundary matters: a well-stirred bulk fixes the concentration a set distance away, a sealed cell end forbids flux, and an unbounded transient gives the spreading diffusion layer behind {% wiki "Warburg element", "Warburg" %} impedance.]

<figure class="diagram-placeholder">
{% figcaption %}
Concentration polarization at a blocking interface. Top: the $V_i$ band diagram, with $V^\circ_i$ bending and the conducting species sloping. Bottom: the concentration profiles. A toggle adds a supporting electrolyte.
{% endfigcaption %}
</figure>

## Liquid junction potentials

Hold two different solutions in lasting contact, through a porous frit or a constricted opening, and a steady transition zone forms between them where the ions interdiffuse. Wherever those ions have unequal mobilities a new tension appears: the nimbler one tries to pull ahead, neutrality forbids any real charge separation, and a steady field builds across the zone that hurries the slow ion and reins in the fast one until their currents come into balance. That field is a diffusion potential, and summed across the junction it is the net **liquid junction potential** between the two solutions, a small but stubborn voltage that dogs careful electrochemical measurement. For a single binary salt the step divides between the ions by their {% wiki "Transport number", "transference numbers" %}; with several ions present the profile must be found from the Planck–Henderson equation. Either way it is the open-circuit, steady-state corner of the channel picture we turn to next.

<figure class="diagram-placeholder">
{% figcaption %}
A liquid junction between two solutions of a single binary salt. Unequal ion mobilities would separate charge, but the diffusion-potential field tilts both $V_i$ traces so the two species cross in step; the net offset between the solutions is the liquid junction potential.
{% endfigcaption %}
</figure>

## Two cases of one channel

Both effects are the same calculation seen from two sides. Take a channel with a fixed set of $V_i$ at one end and, in steady state, a spatially constant current $J_i$ for each species; march across, re-imposing local neutrality at every step so that $V^\circ_i$ stays pinned, and the $V_i$ at the far end follow. Concentration polarization is the case where every current vanishes but one; the liquid junction potential is the open-circuit case, total current zero, with the individual currents set by the fixed end concentrations. In practice, though, we usually fix the voltage instead and let the device settle on the currents, and if we push past the point where the active carrier runs dry, no steady profile can span the channel at all. That breakdown is the current limit, and chasing it down is the climax this chapter builds toward in [saturation](../saturation/).

## Beyond steady state

Steady state is not the only place these ideas live. Picture a blob of salt left to spread on its own, its profile relaxing into a widening Gaussian. The two ions would each diffuse at their own rate, but the faster one cannot simply leave the slower behind without breaking neutrality, so the same diffusion-potential field we met at the steady-state junction reappears here, transient though the situation is, holding the quick ion back and urging the slow one along. The salt therefore spreads as a single entity, with an effective diffusion coefficient that is neither $D_+$ nor $D_-$ but a blend of the two.^[For a 1:1 salt the ambipolar (Nernst–Hartley) coefficient is the harmonic-type mean $D = 2 D_+ D_-/(D_+ + D_-)$, pulled toward the slower ion.]

The coupling reaches past the spreading salt itself. A third, dilute species drifts in that same diffusion-potential field, so a tracer ion or a charged colloid can be carried along by another salt's gradient, even drawn *up* it, an effect known as {% wiki "diffusiophoresis" %}. The same mechanism runs inside a lithium-ion electrode: there the electrons are so much faster than the $\mathrm{Li}^+$ that it is the electrons who are held back, and the pair migrates as though neutral lithium were diffusing through the material, with no need to name a $\phi$ anywhere inside it.

<figure class="diagram-placeholder">
{% figcaption %}
A blob of salt spreading by diffusion (an animation of widening Gaussians). The faster ion is held back by the slower through the diffusion-potential field, so the salt moves as one; a dilute tracer is swept along by the same field.
{% endfigcaption %}
</figure>

## Takeaways

Giving each species its own Ohm's law, $J_i = -\sigma_i\nabla V_i$, folds drift and diffusion back into the single quantity that actually drives them, and turns every transport resistance into a visible slope. The lumped "ohmic" law is just the special case of uniform concentration, while concentration polarization and diffusion potentials are what the per-species picture captures and the lumped one misses.

[**NEXT TOPIC: Other conductors**](../other_conductors/)
