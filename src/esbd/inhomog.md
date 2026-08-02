---
layout: layouts/esbd_topic.njk
title: 'Inhomogeneities and electrostatics'
tags: [page, esbd_topic]
orderESBD: 85
---

# {{title}}

Having seen what the in-material $\phi$ [cannot deliver](../phi/) and where the vacuum level's [writ ends](../vacuum/), we turn to what actually governs the spatial landscape inside materials. One of the main reasons these $V_i$ diagrams are powerful is that they clearly visualize devices with inhomogeneous composition and electric fields, that is, where $V^\circ_i$ is not flat. Typically all of this is conceived of as variations in $\phi$, but $V^\circ_i$ lets us dig a bit more precisely into what is actually going on. This appendix collects the fine print: what a varying ladder really involves, why $-\nabla\phi$ is not always a real electric field, and a catalog of everything that makes interfaces hard.

## Two kinds of inhomogeneity

For a neutral solute, the standard-state level $\mu^\circ_i$ varies only where the medium itself varies, as in a graded composition; such variations are comparatively rare and slow to change. In a formal thermodynamic sense the $V^\circ_i$ are just more of the same, but pragmatically they vary far more readily. The extreme power of electrostatics means the $V^\circ_i$ react rapidly, and usually all together: within a fixed medium the whole ladder is slaved to the electrostatic potential,

$$ V^\circ_i = \phi + \text{const}. $$

Microscopically, $\phi$ obeys the Poisson equation $\nabla^2 \phi = -\rho/\varepsilon_0$, so if free charges accumulate anywhere then $\phi$ shifts, and every $V^\circ_i$ shifts along with it. Note that the quasi-neutral bulk does not mean $\nabla^2\phi = 0$; in fact, very much not. As in [basic electrostatics](../basicelectrostatics/), the local-electroneutrality trick sends $\varepsilon \to 0$, forcing $\rho_{\mathrm{free}} \to 0$ while freeing $\phi$ at every point to float to whatever value neutrality demands.

## The difference between $\phi$ and $V^\circ_i$: inhomogeneous electrostatics

That single-$\phi$ picture assumed a fixed, homogeneous medium, and it fails exactly where things get interesting. For a macroscopic description we separate the dipolar polarization charge $\rho_{\mathrm{bound}} = -\nabla\cdot P$ off into a displacement field, leaving

$$ \nabla \cdot D = \rho_{\mathrm{free}}, \qquad D = -\varepsilon\nabla\phi. $$

However, the first equation only *defines* $\rho_{\mathrm{free}}$ as "everything but polarization bound charge", and the second is only a valid constitutive relation inside a homogeneous medium.

It helps to split $\rho_{\mathrm{free}} = \rho_{\mathrm{mobile}} + \rho_{\mathrm{fixed}}$, where $\rho_{\mathrm{mobile}}$ sums our local mobile carriers, and $\rho_{\mathrm{fixed}}$ is static charge: dopants, the "fixed oxide charge" at the silicon/silicon-oxide interface, charged dislocations and grain boundaries, and sheet charges at interfaces generally. Even though these are fixed charges, we don't model them as "bound charges" in the normal (polarization) sense, since they need not come along with any compensating charge.

In an inhomogeneous region, the constitutive relation must generalize as well:

$$ D = -\varepsilon\nabla\phi + D_{\mathrm{inhomog}}. $$

The built-in displacement $D_{\mathrm{inhomog}}$ is nonzero at interfaces (a sharp, delta-function dipole layer), through graded media, and (more subtly) wherever a nonideal solution carries concentration gradients, because there it is the activity convention that dictates how $\phi$ varies (a caveat the [nonideality topic](../nonideal/) owns). Crucially, $D_{\mathrm{inhomog}}$ depends on how we defined $\phi$ in the first place: adopt a different convention $\phi(x) \to \phi(x) + \delta\phi(x)$ and a compensating $D_{\mathrm{inhomog}}$ appears to soak up the change. In other words, $-\nabla\phi$ is not always a real electric field. (There are even materials where a bulk polarization ambiguity lets $D_{\mathrm{inhomog}}$ be nonzero throughout the material, not just at its boundaries!)

The [hillium–mountainium junction](../phi/) makes this concrete. There, $\langle\phi\rangle$ stepped at an interface between two chemically identical liquids, so $-\varepsilon\nabla\langle\phi\rangle$ acquired a violent spike that no ion feels; and since the physical $D$ vanishes everywhere in that system, $D_{\mathrm{inhomog}}$ must contain the exact opposite spike. The fictitious field and its cancelling partner are two entries of one bookkeeping identity, and both evaporate under a different choice of smoothing.

### Is the electric field real?

That subjectivity of $-\nabla\phi$ sounds like a disaster for electromagnetism, yet notice what survives: the field $-\nabla\phi$ is subjective, the split between $-\varepsilon\nabla\phi$ and $D_{\mathrm{inhomog}}$ is subjective, and the total $D$ is unaffected by any of it. This "agree on $D$, disagree on $E$" is an interesting backwards twist on the usual polarization ambiguity, where everyone agrees on $E$ but the separation of charge into bound and free (and hence $D$) is ambiguous; I don't think the two are related. The practical upshot: on large scales we ignore $D_{\mathrm{inhomog}}$ by leaning on quasi-neutrality, while right at interfaces there is no honest way to reduce the physics to a naive $\phi$, which is part of why interfaces get their own laws.

Maxwell's equations weather all of this, because only the curl of $E$ carries any direct weight: you may add an arbitrary conservative field to $E$ and, as long as $D$, $J$, and $\rho$ are untouched, nothing observable moves. The usual argument for the reality of $E$ (and $B$) comes from the Lorentz force, but this argument breaks inside of media: we know for example that in graded-bandgap heterostructures, we get a different $E$ field for electrons and holes! You can appeal to the Lorentz force on ghostly test charges to resolve this, but then you get back to the question of exactly how those test charges should sit inside the material. Yes, you can insist on a true $\phi$ by taking the smoothed average $\langle\phi\rangle$ of [$\phi$ under the microscope](../phi/), which means $E$ will be the smoothed-out microscopic field $-\nabla\langle\phi\rangle$, but *this does not even win you any favour from the Maxwell equations*.

## Graded media and quasi-electric fields

A graded medium is an interface smeared into a continuum: the composition, and with it the whole standard-state ladder $V^\circ_i$, varies smoothly across an extended region rather than jumping at a sharp plane. Everything from the previous section now happens in the bulk. Because the $V^\circ_i$ of different species depend differently on the local composition, they need not slope together, and each carrier ends up feeling its own **quasi-electric field** $-\nabla V^\circ_i$.

This is Kroemer's insight from graded-bandgap semiconductors (the {% wiki "heterojunction bipolar transistor" %} being the famous case): the quasi-fields for different carriers are independent, they can differ in magnitude and direction, and none of them need equal the electrostatic $-\nabla\phi$.^[H. Kroemer, [Nobel Lecture](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf) (2000), "Quasi-electric fields and band offsets: teaching electrons new tricks." The striking semiconductor version is that a graded gap can drive electrons and holes in the *same* direction, which no electrostatic field can do.] A graded composition is, in this sense, a genuinely new kind of force on carriers, not reducible to any single field.

There is a further wrinkle specific to semiconductors. Our electron standard state is pinned to the band edge at its effective density of states $N_{\mathrm{C}}$, and in a graded material $N_{\mathrm{C}}$ (and $N_{\mathrm{V}}$ for holes) vary along with everything else. The drift-diffusion decomposition then splits into *three* pieces rather than two: the quasi-field $-\nabla V^\circ_{\mathrm{e}^-}$, the familiar Fickian $\nabla n$ term, and a term in $\nabla \ln N_{\mathrm{C}}$ from the sliding reference concentration. Consider a flat band edge with a graded effective mass: at equilibrium the electrons pile up where states are plentiful ($n \propto N_{\mathrm{C}}$), and the ordinary diffusion term would read that pile-up as a current. The $\nabla \ln N_{\mathrm{C}}$ term exists to cancel exactly that mistake. Meanwhile $J_{\mathrm{e}^-} = -\sigma_{\mathrm{e}^-} \nabla V_{\mathrm{e}^-}$ never split anything and needs no correction.

The electrochemical version is a compositionally graded **mixed ionic-electronic conductor**, say a doping-graded ceria in which both oxide ions $\mathrm{O}^{2-}$ and electrons are mobile. Across the graded slab the electronic level $V^\circ_{\mathrm{e}^-}$ and the ionic level $V^\circ_{\mathrm{O}^{2-}}$ slope at different rates, so electrons and oxide ions are pushed by different quasi-fields while $-\nabla\phi$ is a third, separate slope.

One thing worth stating plainly: a fast solid-ion conductor is a concentrated, strongly nonideal medium, so the placement of the $V^\circ_i$ levels themselves inherits the single-ion activity ambiguity we keep running into. That is less a defect of the example than the whole point of this topic. The graded solid is exactly where the standard-state ladder, the per-carrier quasi-fields, and the activity conventions all turn subtle at once, and where reading everything off the $V_i$ traces rather than off $\phi$ matters most.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-inh-miec.njk" %}
{% figcaption %}
Homage to Kroemer's graded-bandgap picture, in ionic form: across a compositionally graded MIEC, the electronic level $V^\circ_{\mathrm{e}^-}$ and the ionic level $V^\circ_{\mathrm{O}^{2-}}$ slope in opposite directions, a push no single electrostatic field could give two like-signed carriers, while the electrostatic $-\nabla\phi$ is a third, separate slope. No single field describes all the carriers.
{% endfigcaption %}
</figure>

## Beyond the simple case: the catalog

In [basic electrostatics](../basicelectrostatics/) we described an incredibly elementary form of screening: an ideal homogeneous linear dielectric medium with a nice ideal dependence of charge carrier accumulation on $\phi$, which led to relatively trivial results like the Poisson–Boltzmann screening equation. In general, electrostatics is a far harder problem. What follows is a deliberately non-exhaustive catalog of the main complications, grouped by kind:

* **Interfaces are hard to pin down.** Even for a simple interface (an electrode or heterojunction), fixing the *value* of the offset from first principles is hard; the "vacuum contact" / contact-potential-difference rule of thumb is [notoriously unreliable](../vacuum/) in semiconductors. Real interfaces are also patchy and non-planar (electrostatics is fundamentally three-dimensional, and even 'planar' interfaces are microscopically irregular), and they can carry built-in monopolar charges, whether static and dopant-like (fixed oxide charge at the $\mathrm{Si/SiO_2}$ interface) or interface-specific (metal-induced gap states, electronic {% wiki "surface states" %}, specific ion adsorption).

<figure class="demo-container" style="max-width: 480px">
<img src="/esbd/img/tung-pinchoff.svg" style="max-width:100%"/>
{% figcaption %}
The first item drawn: in front of an interface whose barrier height varies from patch to patch, the potential is a genuinely three-dimensional Laplace problem. A low-barrier patch sits in a saddle point walled in by its higher-barrier surroundings (R. Tung's "pinch-off": Figs. 15–18 of his [Schottky-barrier review](https://doi.org/10.1063/1.4858400)), so the junction behaves like no single one-dimensional barrier at all.
{% endfigcaption %}
</figure>

* **Nano geometry**: very thin conductors (such as a graphene {% wiki "2D electron gas" %}) can only screen and conduct in two dimensions while electrostatics remains three-dimensional, so they have no quasi-neutral bulk and are 'all interface'.
* **Breakdown of the local linear continuum**: at very short ranges both charge density and $\varepsilon$ can get nonlocal (a Fermi gas gets Friedel oscillations; ions get pair correlations; the solvent has a correlation length and 'overscreening'); at high fields the solvent's dielectric response is nonlinear ({% wiki "dielectric saturation" %}), and it tends to set in under the same double-layer conditions where the nonlocal effects also appear, so it becomes a real mess; and where small scales and strong driving combine, $V_i$ itself can become ill-defined or need further refinement in meaning.

## Takeaways

In the bulk, quasi-neutrality spares us from almost all of this: the $V^\circ_i$ ladder acts as a mere neutralizer, and the diagrams stay simple. The difficulty concentrates at interfaces, in graded and nonideal media, and at small scales, exactly where $\phi$ splinters into per-species quasi-fields and even $E$ loses its objectivity. The $V_i$ themselves remain well defined through all of it, and that is the point of building on them.

[**NEXT TOPIC: Standard state data**](../data/)
