---
layout: layouts/esbd_topic.njk
title: 'About ϕ'
tags: [page, esbd_topic]
orderESBD: 98
eleventyNavigation:
    key: About *ϕ*
    parent: ESBD
    order: 998
---

# {{title}}

## What is $\phi$?

Before we talk about problems with electrostatic potential $\phi$, let's just establish what it is, as a physical quantity. For that we're going to have to go back into Maxwell's equations for electromagnetism, and the electromagnetic potentials, especially the electric scalar potential.

Obviously, the actual nano-scale electric scalar potential in a material is going to have rapid variations in space and time, with all the various jigglings-about of nuclear cores and electrons. The electric scalar potential is not even a classical field, as it will contain quantum correlations with all the particle movements. And it's ambiguous given all the gauge freedoms with magnetic vector potential.

So let's nail all that down:

* We are working in the {% wiki "Coulomb gauge" %} or similar, so we don't have to worry much about magnetic vector potential.
* We are fine with an undetermined global offset in electrostatic potential.
* We are interested in an _average_ electric scalar potential, which is smooth.

So, for the purposes of electrochemistry and other continuum condensed-matter physics, $\phi$ is an _average_ electrostatic potential that smooths out the nano-scale variations.

The primary equation determining $\phi$ is the electrostatic Poisson equation in terms of an associated _average_ charge density $\rho$:

$$ \nabla^2 \phi = -\rho / \varepsilon_0 . $$

Most importantly, inside of a homogeneous conducting material we say that $\rho = 0$ (charge neutrality on average) and also $\nabla \phi = 0$ (no internal electric fields) and therefore $\phi$ is flat throughout. Whatever averaging procedure we use is going to have to smear enough over the microscopic mess enough to get that $\rho=0$ and flat $\phi$.

## The problem with $\phi$

What $\phi$ represents is the average energy of an infinitesimal charge that is placed at some position, without disturbing the system. That is unfortunately not what we want, which is to know what an actual charged particle will see if placed in that position. Let's go back to our electrochemical potential:

$$ \bar\mu_i = \mu_{\mathrm{int},i} + z_i F \phi. $$

The job $\phi$ is doing here is subtracting off a gross part of the electrostatic energy, that includes things like our arbitrary global offset in $\phi$. That is admirable of course, but it is a mistake to say that $z_i F \phi$ is _the_ electrostatic energy of those charged particles. Rather, each charged particle disturbs its environment and the actual electrostatic potential it experiences is going to differ from $\phi$. It may not even be possible to unambiguously specify such an energy, as it there is no sharp boundary between chemical bond and electric interaction.
Not only that, but $\phi$ itself will contain some strange contributions, like from the extreme core potentials around the nuclei of solvent molecules that would indeed be probed by an infinitesimal test charge. Since solutes will not penetrate into the same places as an infinitesimal test charge, then $\mu_{\mathrm{int},i}$ must include a component that cancels out such contributions from $\phi$.

Therefore, $\mu_{\mathrm{int},i}$ is not just an ordinary chemical potential like an uncharged particle: it also includes all the electrostatic additions and corrections to $z_i F \phi$. Those electrostatic corrections are quite sensitive to the kind of environment around the particle: which solvent, and which other charged solutes are around.

## Actually, $\phi$ could be anything we want

Since $\mu_{\mathrm{int},i}$ necessarily has to compensate for $\phi$, it means that as far as thermodynamics cares, we don't need $\phi$ to have any meaning at all. It need not satisfy $ \nabla^2 \phi = -\rho / \varepsilon_0 $, and instead $\phi$ can be whatever is convenient for us.

As long as all our $\mu_{\mathrm{int},i}$ values are redefined accordingly with an alternative $\phi$, we will get the same final $\bar\mu_i$ results!

We could for example define $\phi$ as some kind of typical "scalar potential inbetween molecules", to get rid of the strange contribution from core potentials I mentioned above. We might invent a theoretical model that only involves outer atomic orbitals. These are all workable, but unphysical, definitions of $\phi$. In the end it's no problem since all the $\mu_{\mathrm{int},i}$ values shall compensate for the fuzziness.

But then I have to ask, why do we need $\phi$ at all? If we instead centralize our analysis around the $\bar\mu_i$, then we won't have to spend so much time worrying about how to allocate effects into $\phi$ or $\mu_{\mathrm{int},i}$, or how to make them correct each other.

(There is of course one place where we ought to define $\phi$ physically: in the vacuum. But that is not very helpful, as I'll describe in a few sections from now.)

## Contact potentials are tedious and can mislead

When we bring two conductors into contact, they will each internally have flat $\phi$ but there will be some step $\phi_2 - \phi_1$. Such a step corresponds to displaced positive and negative charges near the interface: on net (on the smoothing scale we use to establish $\phi$) there will be a nonzero electric field at/near the junction, and therefore a net step in $\phi$.

While the above is true, it is not actually relevant to measurements.

For example, in solid state electronics we only truly care about where the band edges and Fermi levels are. The value of $\phi$ just doesn't enter into the analysis anywhere. For example, when we talk about the average kinetic energy of Fermi gas electrons in a metal, we are referencing to the conduction band, and not to any sort of fundamental $\phi$.

One often sees discussions of voltmeter measurements where there is a sequence of metals, each having its own peculiar $\phi$, and with the various contact potentials $\phi_2 - \phi_1$ at the various interfaces. In order to get a sensible voltmeter measurement we must start and end at the same metal (for example, copper): $\phi_{\text{Cu, right}} - \phi_{\text{Cu, left}}$. We must add up all the contact potentials and reassure ourselves that they cancel out. This cancellation of contact potentials is tedious, and misses the point that voltmeters actually probe $\bar\mu_{\mathrm{e}^-}$ which is flat through all the metals, and therefore we don't need to include our cabling materials into our analysis.

The contact potential tedium may seem harmless, but it can actually mislead. With thermoelectricity, there is a [long-standing myth](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html) that thermoelectric voltages are generated at junctions, due to the way contact potentials vary with temperature. In fact, thermoelectric effects have to do with gradients in $\bar\mu_{\mathrm{e}^-}$ in regions of thermal gradient, and $\bar\mu_{\mathrm{e}^-}$ has no step at the junction itself. If we wanted to ask how $\phi$ actually varies thermoelectrically, we'd have to do a lot of tedious work to figure out not only the junction $\phi$, but also the thermal-gradients $\phi$, and in the end we would gain no insight.

## Vacuum levels are unhelpful

It is common to see discussions of material interfaces that involve the concept of 'vacuum level', that is, either the electrostatic potential $\phi_\mathrm{vac}$ just outside a surface, or the electrostatic energy $-e \phi_\mathrm{vac}$ that would be felt by an electron in that position (assuming near-surface image forces are irrelevant). Sometimes 'the vacuum' is treated as an objective reference, and sometimes we make a thought experiment of creating a material interface by bringing the two materials together gradually, sometimes the vacuum level is somehow even brought into a material.

I would like to provide a warning that **any reference to vacuum level is fraught with error, usually misleading, and at best a gross approximation, when it comes to analyzing most in-material phenomena**.

Of course, the vacuum level is super important where it comes to actual surface-vs-vacuum phenomena: work function, thermionic emission, Kelvin probe. And let's be generous: the notion of vacuum level and $\phi_\mathrm{vac}$ does retain a decent meaning even for spaces that aren't filled with literal vacuum, but might even contain dilute gases and dilute weakly ionized plasmas. We can talk confidently about the ionization energies and electron affinities of dilute atoms that are effectively isolated. But that's about it.

### "The vacuum" is inhomogeneous and messy, and a terrible reference point

Even when you are considering a single material, the level $\phi_\mathrm{vac}$ is going to vary spatially and from sample to sample depending on surface contamination, accidental static charges, crystal orientation, and the atomic surface reconstruction. When you put multiple materials nearby each other, it only gets worse.

Usually this is recognized, so there is an attempt to fix this by referring to 'vacuum infinitely far away' as a reference point, to escape the local mess. But this gets quite abstract, as now the reference is totally unrelated to the materials in question. At that point you might as well not name any reference. If a reference is needed, then the electronic Fermi level itself (in a specific conducting object, such as a ground wire) is truly the best reference point.

Conceptually, it also gets things backwards. We should not think of Fermi levels as abstract floating quantities that depend on surface charge. Rather, through our wires, power supplies, and voltmeters, it is the Fermi level which is the first-class object that can access, and the vacuum levels are a secondary dependent field.

For electrochemistry, the concept of 'solvation of an ion' considers taking an ion in vacuum and dropping it into a solvent. It sounds so simple, but the above discussion makes it clear that the enthalpy of this process will depend sensitively on both where the ion started in vacuum and the electrochemical state inside the solvent. We can nail this down however: laboriously prepare a truly pure solvent surface (free of the contaminants that love to invisibly adsorb at surfaces) and drop the ion from just above it, you will measure a reliable solvation enthalpy for that solvent _surface_. Yet, what you have measured is still a surface property, that depends on how that particular pure solvent decides to set its local $\phi_\mathrm{vac}$. And in particular, it will offer you no insight into creating a universal absolute solvation enthalpy scale that you can use to predict solvent-solvent interfaces; that gets into the next topic, of contact potentials.

### Vacuum contact: a grossly inaccurate thought experiment

The usual thought experiment [goes as follows](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html): we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat everywhere. They in general will have different work functions, so the Fermi levels will differ. We then bring the materials together and once they touch, the Fermi levels will equalize by moving charges, creating a double layer of charge (and therefore a jump in electrostatic potential). Therefore there will be a "contact potential" given by the initial difference in Fermi levels.

A big problem with this thought experiment is that it neglects the actual microscopic interactions that would occur near and at contact. [As argued by R. Tung](https://doi.org/10.1063/1.4858400), it basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. As a result, the vacuum contact idea gives wildly incorrect predictions, such as the {%wiki "Schottky–Mott rule" %} for the actual double-charge layer in a junction.

Conceptually, it is simply wrong to view surfaces as building blocks from which material interfaces are made. Rather, a surface is just another kind of interface, with its own special considerations. Once you include the bonding, it typically invalidates any prediction based on vacuum levels. Sometimes it is argued that the final electrostatic state is a modification on top of the naive vacuum contact. From my point of view, you might as well discard the vacuum contact result and focus on the proper result.
