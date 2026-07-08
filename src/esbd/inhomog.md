---
layout: layouts/esbd_topic.njk
title: 'Inhomogeneities and electrostatics'
tags: [page, esbd_topic]
orderESBD: 90.5
---

# {{title}}

One of the main reasons these $V_i$ diagrams are powerful is in clearly visualizing devices with inhomogeneous composition and electric fields, that is, where $V^\circ_i$ is not flat. Typically all of this is conceived of as variations in $\phi$, but $V^\circ_i$ lets us dig a bit more precisely into what is actually going on. This appendix collects the fine print: what a varying ladder really involves, why $-\nabla\phi$ is not always a real electric field, and a catalog of everything that makes interfaces hard.

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

The built-in displacement $D_{\mathrm{inhomog}}$ is nonzero at interfaces (a sharp, delta-function dipole layer), through graded media, and (more subtly) wherever a nonideal solution carries concentration gradients, because there it is the activity convention that dictates how $\phi$ varies. Crucially, $D_{\mathrm{inhomog}}$ depends on how we defined $\phi$ in the first place: adopt a different convention $\phi(x) \to \phi(x) + \delta\phi(x)$ and a compensating $D_{\mathrm{inhomog}}$ appears to soak up the change. In other words, $-\nabla\phi$ is not always a real electric field. (There are even materials where a bulk polarization ambiguity lets $D_{\mathrm{inhomog}}$ be nonzero throughout the material, not just at its boundaries!)

This sounds like a disaster for electromagnetism, yet notice what survives: the field $-\nabla\phi$ is subjective, the split between $-\varepsilon\nabla\phi$ and $D_{\mathrm{inhomog}}$ is subjective, and the total $D$ is unaffected by any of it. This "agree on $D$, disagree on $E$" is an interesting backwards twist on the usual polarization ambiguity, where everyone agrees on $E$ but the separation of charge into bound and free (and hence $D$) is ambiguous; I don't think the two are related. The practical upshot: on large scales we ignore $D_{\mathrm{inhomog}}$ by leaning on quasi-neutrality, while right at interfaces there is no honest way to reduce the physics to a naive $\phi$, which is part of why interfaces get their own laws.

## Beyond the simple case: the catalog

In [basic electrostatics](../basicelectrostatics/) we described an incredibly elementary form of screening: an ideal homogeneous linear dielectric medium with a nice ideal dependence of charge carrier accumulation on $\phi$, which led to relatively trivial results like the Poisson–Boltzmann screening equation. In general, electrostatics is a far harder problem and requires much more information:

* Almost anything can get very messy:
  * Simple interfaces (e.g. electrodes, or heterojunctions): beyond the basic alignment, pinning down the *value* of the offset from first principles is hard — the "vacuum contact" / contact-potential-difference rule of thumb is notoriously unreliable in semiconductors.
  * Patchy and non-planar interfaces: electrostatics is fundamentally a three dimensional problem, and even 'planar' interfaces tend to be microscopically irregular. Both microscopic irregularities in the geometry and irregularity in $\phi$ alignment of the interface will produce a complex three dimensional electrostatic situation.
  * Interface-specific charges: while the intrinsic interfacial dipoles get a lot of attention, it's worth noting that built-in monopolar charges are also possible. These can be static and dopant-like (e.g. fixed oxide charges at the Si/SiO2 interface) or they can be interface-specific (e.g. metal-induced gap states, electronic {% wiki "surface states" %}, specific ion adsorption).
* Graded media (as used in the {% wiki "heterojunction bipolar transistor" %}): these are effectively slow distributed interfaces, which means all the problems of the interface exist through a whole continuum region. $\phi$ and $V^\circ_i$ now all vary differently. Charge carriers only see "quasi-electric fields" $-\nabla V^\circ_i$ which differ from each other and from the "real" electric field $-\nabla\phi$.
* Nano geometry: for example in conductors which are very thin (such as a graphene {% wiki "2D electron gas" %}), the active material can only screen and conduct in two dimensions but electrostatics remains three dimensional. Such conductors have no quasi-neutral bulk; they are 'all interface'.
* Non-ideal conductors (concentrated electrolytes): establishing an $E$ field here requires single-ion activity coefficients, which are not measurable from bulk neutral solutions (see the [nonideality topic](../nonideal/), which owns this caveat). (Though ultimately, the $D$ field is the goal.)
* Complex constitutive relations ($\mathbf{D} \neq \varepsilon \mathbf{E}$ for many reasons that no linear 'effective $\varepsilon$' can capture):
  * Static dipoles: especially at interfaces but also inside of graded media.
  * Chemical gradient dipoles: where there is a strong gradient in chemical concentration, it is perfectly possible for there to be induced dipoles.
  * Ambiguous $E$ field: the Gibbs–Guggenheim principle that the value of $\phi$ is ambiguous means that in many complex cases, even $\mathbf{E} = -\nabla\phi$ is ambiguous. This is permitted in Maxwell's equations, but crucially the $\mathbf{D}$ field is not affected by this thermodynamic-type ambiguity. Thus $\mathbf{D}$ becomes partially independent of $\mathbf{E}$.
* Local linear continuum breakdown:
  * Very short ranges: even in linear response both charge density and $\varepsilon$ can get nonlocal. (Fermi gas gets Friedel oscillations; ions get pair correlations etc.; solvent exhibits a correlation length and 'overscreening'.)
  * High electric fields: in general, the dielectric response of a solvent is nonlinear ({% wiki "dielectric saturation" %}). Note though that dielectric saturation in an electric double layer tends to occur in the same conditions that the aforementioned non-local effects also appear, so it becomes a real mess!
  * Local thermodynamic equilibrium breakdown: $V_i$ itself can become ill-defined or require further refinement in meaning when there is a combination of both small scales and strong driving conditions.

## Takeaways

In the bulk, quasi-neutrality spares us from almost all of this: the $V^\circ_i$ ladder acts as a mere neutralizer, and the diagrams stay simple. The difficulty concentrates at interfaces, in graded and nonideal media, and at small scales, exactly where $\phi$ splinters into per-species quasi-fields and even $E$ loses its objectivity. The $V_i$ themselves remain well defined through all of it, and that is the point of building on them.

[**NEXT TOPIC: Standard state data**](../data/)
