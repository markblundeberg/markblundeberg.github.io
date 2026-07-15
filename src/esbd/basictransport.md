---
layout: layouts/esbd_topic.njk
title: 'Basic transport'
tags: [page, esbd_topic]
orderESBD: 27
---

# {{title}}

$V_i$ hands us transport almost for free: back in [species voltage](../v_i/) we saw that a carrier simply flows down its own $V_i$ slope, one of the quiet beauties of the picture, and we have even glimpsed it in action already, in [a battery's discharge](../lib/) and a [driven double layer](../basicelectrostatics/). A working device is never quite at equilibrium; the moment current flows the $V_i$ lines tilt, and the appeal of the picture is that those tilts are precisely the dissipation. This topic unpacks what that one simple law implies once the lines are free to slope.

## One driving force per species

The thermodynamic force on a carrier is the gradient of its electrochemical potential, $-\nabla\bar\mu_i$. Dividing by charge, as we always do, the force per unit charge is just

$$ -\nabla V_i. $$

That is the whole of what drives a current: each species is pushed down its own $V_i$ slope. On the band diagram the reading could not be more direct. A flat $V_i$ ordinarily carries no net current, the species sitting at equilibrium; a sloping $V_i$ marks a driving force, and the steeper the slope, the harder the dissipation. Resistance is visible as gradient.^[The exception is a perfect conductor: as $\sigma_i \to \infty$ the slope needed to carry a given current shrinks to zero, so a superconductor keeps $V_i$ flat *while* carrying current — the finite product $J_i = -\sigma_i\nabla V_i$ surviving the $0\times\infty$. It is that well-defined flat $V_{\mathrm{e}^-}$ that lets it connect sensibly to ordinary conductors; see [other conductors](../other_conductors/).]

## Drift and diffusion are one law

Because the force is $-\nabla V_i$, the current of species $i$ obeys a per-species Ohm's law,

$$ J_i = -\sigma_i \nabla V_i, $$

with $J_i$ the charge current density and $\sigma_i$ the species conductivity.^[Driving transport one species at a time by its own electrochemical potential is the core of the Jamnik–Maier equivalent-circuit treatment of mixed conductors, in which each carrier rides a "rail" at $\bar\mu_i/(z_i e)$, exactly our $V_i$. J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001).] This one equation already holds the drift-diffusion machinery that electrochemistry and semiconductor physics usually present as two separate mechanisms. Dividing through by the molar charge $z_i F$ recasts it as the {% wiki "Nernst–Planck equation" %} in its familiar form, a number-current density carrying a drift term and a diffusion term:

$$
\begin{aligned}
N_i &= \frac{J_i}{z_i F} = -\frac{\sigma_i}{z_i F}\,\nabla V_i \\
&= \underbrace{-\,u_i\, c_i\, \nabla\phi}_{\text{drift}} \;\underbrace{-\;D_i\, \nabla c_i}_{\text{diffusion}},
\end{aligned}
$$

where the split uses $\nabla V_i = \nabla\phi + \tfrac{RT}{z_i F}\tfrac{\nabla c_i}{c_i}$ in an ideal homogeneous medium. The two coefficients are the ion's diffusion coefficient $D_i$ and its (signed) electrical mobility $u_i$, and because both descend from the single conductivity they are not independent:

$$ \sigma_i = z_i F\, u_i\, c_i = \frac{z_i^2 F^2 D_i\, c_i}{RT}. $$

Reading off the last equality, $u_i$ and $D_i$ are tied by the {% wiki "Einstein relation" %}, $u_i = z_i F D_i/RT$. The Einstein relation is therefore automatic here, a consequence of drift and diffusion being two faces of the one $\sigma_i\nabla V_i$.^[The same construction gives the generalized Einstein relation for carriers that stray from ideal-dilute behaviour, such as the degenerate electron gas, by replacing $z_i^2F^2c_i/RT$ with the chemical capacitance. In strongly non-ideal, concentrated solutions the species also stop moving independently, and the transport coefficients become a coupled matrix, the territory of the Maxwell–Stefan or Onsager equations.]

There is a subtlety hiding in the drift term. We assumed $\nabla V^\circ_i = \nabla\phi$, but that holds only inside a uniform medium. Where the medium itself changes, at an interface or through a graded material, the standard state carries its own gradient, and that extra piece is a real driving force with no electrostatic origin: a "quasi-electric field," the reason the textbook drift-diffusion split quietly fails across interfaces.^[This is the transport face of the band-offset story from the [semiconductors](../solidstate/) and [bipolar](../bipolar/) topics: a step or grade in $V^\circ_i$ pushes carriers even where $\phi$ is flat. Kroemer's "quasi-electric fields" in graded heterojunctions are exactly this.] The [inhomogeneities](../inhomog/) topic takes this up properly, graded densities of states and all. Beyond conduction, currents can also be driven by advection, thermoelectric gradients, and magnetic induction, but plain $-\nabla V_i$ conduction is our concern here.

<figure class="demo-container" style="max-width: 440px">
{% include "esbd-diagrams/esbd-tb-driftdiff.njk" %}
{% figcaption %}
One current, split two ways. The slope of $V_i$ is held fixed (fixed current) while the slider reapportions it between drift — the shared slope of $V^\circ_i$ and $\phi$ — and diffusion, the changing concentration gap; the lower panel shows the concentration itself, a gentle and nearly linear ramp. The split is bookkeeping; the total slope is what drives the current. It is also not a tug-of-war that either side has to win: past the ends of the $[0,1]$ split, drift and diffusion oppose each other, one overcompensating the other. The axis is schematic: at fixed current a heavily diffusive profile would in truth steepen toward its dilute end, since conductivity falls with concentration, and the next figure computes exactly that bending.
{% endfigcaption %}
</figure>

## The "ohmic current" shortcut

Engineering practice often collapses all of this into a single bulk current driven by one electrostatic potential,

$$
\begin{aligned}
J_{\mathrm{tot}} &= -\sigma\,\nabla\phi, \\
\sigma &= \sum_i \sigma_i.
\end{aligned}
$$

It is a handy shortcut, and its origin is easy to see: sum the per-species drift currents and assume uniform concentrations, so that every $\nabla V_i$ reduces to the shared $\nabla\phi$. The weakness is that very assumption. As soon as concentration gradients appear, the species' $V_i$ slopes part ways, the diffusion currents start contributing to the charge flow, and $J_{\mathrm{tot}} = -\sigma\nabla\phi$ no longer holds. Tracking the individual $V_i$ keeps us honest in exactly the situations where the lumped law breaks down, and those situations are the next two effects.

## Concentration polarization

Many interfaces are selective, letting one carrier through and blocking the rest: a lithium electrode passes $\mathrm{Li}^+$ while the salt anion is turned away, or an electrode reaction consumes one ion and ignores the others. The blocked species cannot leave, so it banks up on one side and is drawn down on the other, building a concentration gradient in front of the interface. On the diagram the standard-state ladder bends to track the changing concentration while the conducting species takes on a concentration-driven slope, both registering as added resistance, the "mass-transport" or polarization resistance. Pushed hard enough, the supply of the active ion at the interface runs dry and the current can climb no further, a limit we give its own topic [shortly](../saturation/). The usual remedy is a swamping excess of inert supporting electrolyte, which carries the drift and leaves the active ion to move by diffusion alone.^[What sits at the far boundary matters: a well-stirred bulk fixes the concentration a set distance away, a sealed cell end forbids flux, and an unbounded transient gives the spreading diffusion layer behind {% wiki "Warburg element", "Warburg" %} impedance.]

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-tb-concpol.njk" %}
{% figcaption %}
Concentration polarization at a silver plating cathode in binary $\mathrm{AgNO_3}$. The blocked $\mathrm{NO_3}^-$ carries no current, so its $V_i$ is *exactly flat* through the unstirred layer; the $V^\circ_i$ ladder bends with the depleted concentration and the conducting $\mathrm{Ag}^+$ bends by twice that. Out in the stirred bulk every level tilts together — the plain ohmic drop. The lower panel shows the concentration itself: an exactly linear ramp across the unstirred layer, uniform beyond it. Toggle the supporting electrolyte at the same current: the ladder pins flat and the bulk tilt vanishes, but the depletion digs twice as deep — diffusion alone must now carry what migration helped with. The nitrate also loses its billing, folding into the anonymous crowd of swamping ions below: their identities don't matter, their numbers do. What happens when the interface is driven all the way dry is the [saturation](../saturation/) story.
{% endfigcaption %}
</figure>

## Liquid junction potentials

Hold two different solutions in lasting contact, through a porous frit or a constricted opening, and a steady transition zone forms between them where the ions interdiffuse. Wherever those ions have unequal mobilities a new tension appears: the nimbler one tries to pull ahead, neutrality forbids any real charge separation, and a steady field builds across the zone that hurries the slow ion and reins in the fast one until their currents come into balance. That field is a diffusion potential, and summed across the junction it is the net **liquid junction potential** between the two solutions, a small but stubborn voltage that dogs careful electrochemical measurement. Its exact value is convention-dependent: in a nonideal solution it inherits the single-ion activity convention (see [non-ideal solutions](../nonideal/)), so it is only ever as sharp as that convention. For a single binary salt the gradients (and hence the steps) divide as a ratio between the ions by their {% wiki "Transport number", "transference numbers" %} according to $\partial_x V_+/\partial_x V_- = -t_-/t_+$.^[The transference number is the conductivity fraction $t_i = \sigma_i/\sum_j \sigma_j$; for a binary salt this gives $t_+/t_- = z_+ D_+/(|z_-|\,D_-)$, which equals $D_+/D_-$ only when $z_+ = |z_-|$. The open-circuit condition is not that a species sits still, but that the two charge currents cancel, $J_+ + J_- = 0$: the ions co-diffuse down the shared salt gradient while their opposing charge currents net to zero, and that is what locks the slopes into the ratio above.] For a 1:1 salt the transference ratio $t_+/t_-$ is simply the mobility ratio $D_+/D_-$ that the figure's slider sweeps. It gets significantly more tricky with three or more ions.^[The Planck–Henderson construction (which can be naturally expressed with $V_i$, but that's beyond the scope here) is required once three or more ions share the junction. This ends up requiring finding the root of a transcendental equation. Commonly, Henderson's equation is invoked, but it is based on an unphysical assumption that all concentrations vary linearly with position, which only happens to be guaranteed for the binary salt case.]. Either way it is the open-circuit, steady-state corner of the channel picture we turn to next.

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-tb-ljp.njk" %}
{% figcaption %}
A liquid junction between concentrated and dilute solutions of one binary salt. Unequal ion mobilities would separate charge, but the diffusion-potential field tilts both $V_i$ traces so the two species cross in step; the two $V^\circ_i$ rungs ride as one rigid ladder, and the ladder's net offset end to end is the liquid junction potential. The slider is the mobility ratio of a generic 1:1 salt (cation-led at the default); at $D_+ = D_-$ the LJP vanishes. The lower panel shows the salt profile — steady state plus neutrality force it exactly linear across the zone, whatever the mobilities. Rung spacing compressed (⌇).
{% endfigcaption %}
</figure>

## Two cases of one channel

Both effects are the same calculation seen from two sides. Take a channel with a fixed set of $V_i$ at one end and, in steady state, a spatially constant current $J_i$ for each species; march across, re-imposing local neutrality at every step so that $V^\circ_i$ stays pinned, and the $V_i$ at the far end follow. Concentration polarization is the case where every current vanishes but one; the liquid junction potential is the open-circuit case, total current zero, with the individual currents set by the fixed end concentrations. In practice, though, we usually fix the voltage instead and let the device settle on the currents, and if we push past the point where the active carrier runs dry, no steady profile can span the channel at all. That breakdown is the current limit, and chasing it down is the climax this chapter builds toward in [saturation](../saturation/).

## Beyond steady state

Steady state is not the only place these ideas live. Picture a blob of salt left to spread on its own, its profile relaxing into a widening Gaussian. The two ions would each diffuse at their own rate, but the faster one cannot simply leave the slower behind without breaking neutrality, so the same diffusion-potential field we met at the steady-state junction reappears here, transient though the situation is, holding the quick ion back and urging the slow one along. The salt therefore spreads as a single entity, with an effective diffusion coefficient that is neither $D_+$ nor $D_-$ but a blend of the two.^[For a binary salt with ion charges $z_+$ and $z_-\,(<0)$, the ambipolar (Nernst–Hartley) coefficient is $D = \dfrac{(z_+ - z_-)\,D_+ D_-}{z_+ D_+ - z_- D_-}$, which reduces to the harmonic-type mean $2 D_+ D_-/(D_+ + D_-)$ for a 1:1 salt. Either way it is pulled toward the slower ion.]

The coupling reaches past the spreading salt itself. A third, dilute species drifts in that same diffusion-potential field, so a tracer ion or a charged colloid can be carried along by another salt's gradient, even drawn *up* it, an effect known as {% wiki "diffusiophoresis" %}. The same mechanism runs inside a lithium-ion electrode: there the electrons are so much faster than the $\mathrm{Li}^+$ that it is the electrons who are held back, and the pair migrates as though neutral lithium were diffusing through the material, with no need to name a $\phi$ anywhere inside it.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-tb-saltblob.njk" %}
{% figcaption %}
A blob of salt spreading by diffusion — scrub time with the slider. The two ions spread as one Gaussian (the ambipolar $D$); on the band diagram the diffusion-potential field shows up as the two $V_i$ features, with the *slower* ion carrying the larger one (it needs the bigger push to keep up). The two $V^\circ_i$ rungs dip over the blob as one rigid ladder (that shared dip is the diffusion potential itself), while each rung–carrier gap narrows where the salt is dense. A dilute tracer cation rides the same field — drawn *up* the salt gradient, toward the blob (its trajectory integrated from the drift equation, not sketched). Rung spacing compressed (⌇).
{% endfigcaption %}
</figure>

## Takeaways

Giving each species its own Ohm's law, $J_i = -\sigma_i\nabla V_i$, folds drift and diffusion back into the single quantity that actually drives them, and turns every transport resistance into a visible slope. The lumped "ohmic" law is just the special case of uniform concentration, while concentration polarization and diffusion potentials are what the per-species picture captures and the lumped one misses.

[**NEXT TOPIC: Other conductors**](../other_conductors/)
