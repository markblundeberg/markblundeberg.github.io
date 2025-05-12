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

When I came up with these $V_i$ band diagrams, it quickly became apparent that it is possible to entirely avoid invoking the electrostatic potential $\phi$. This was not surprising given my semiconductor physics background, yet this is so dissonant with $\phi$ being so fundamental in the usual electrochemistry analysis. Digging a little bit deeper, however, we find that the theoretical electrochemists are already uncomfortable with the unmeasurable $\phi$. This dates back to Guggenheim's [1929](https://doi.org/10.1021/j150300a003) and [1930](https://doi.org/10.1021/j150313a014) papers, and even earlier to Taylor and perhaps Gibbs.

I reaffirm Guggenheim's thesis, and I would modernize it further that it is not even necessary to reference $\phi$ in electrodes: voltmeters measure $V_{\mathrm{e}^-}$!

On this page I'll ramble on a bit about why we ought to *actively* avoid $\phi$ in both semiconductors and electrochemistry. While $\phi$ is okay in principle, it is a factory of misconceptions.

## What is $\phi$?

Before we talk about problems with electrostatic potential $\phi$, let's just establish what it is, as a physical quantity. For that we're going to have to go back into Maxwell's equations for electromagnetism, and the electromagnetic potentials, especially the electric scalar potential.

Obviously, the actual nano-scale electric scalar potential in a material is going to have rapid variations in space and time, with all the various jigglings-about of nuclear cores and electrons. The electric scalar potential is not even a classical field, as it will contain quantum correlations with all the particle movements. And worse yet, it's totally ambiguous given all the gauge transformations with magnetic vector potential!

So let's nail all that down:

* We invoke the "electrostatic approximation" that the electric field curl is negligible, and electrostatic potential is the anti-gradient of electric field.
* We are interested in an _average_ electric scalar potential, which is smooth.
* We are however fine with an undetermined global offset in electrostatic potential since we'll always consider differences anyway.

So, for the purposes of electrochemistry and other continuum condensed-matter physics, $\phi$ is an _average_ electrostatic potential that smooths out the nanometer and nanosecond variations.

The primary equation determining $\phi$ is the electrostatic Poisson equation in terms of an associated _average_ charge density $\rho$:

$$ \nabla^2 \phi = -\rho / \varepsilon_0 . $$

Most importantly, inside of a homogeneous conducting material we say that $\rho = 0$ (charge neutrality on average) and also $\nabla \phi = 0$ (no internal electric fields) and therefore $\phi$ is flat throughout. Whatever averaging procedure we use is going to have to smear enough over the microscopic mess enough to get that $\rho=0$ and flat $\phi$.

## The problem with $\phi$

What $\phi$ represents is the average energy of an infinitesimal charge that is placed at some average position, without disturbing the system. That is unfortunately not what we want, which is to know what an actual charged particle will see if placed in that position. An actual charged particle definitely disturbs the system, and its position will have correlations with other particles' positions.

Let's go back to our electrochemical potential partitioning:

$$ \bar\mu_i = \mu_{\mathrm{int},i} + z_i F \phi. $$

The job $\phi$ is doing here is only subtracting off a coarse estimate of the electrostatic energy. That is useful of course (as I described on [the intro page](../)), but it is a mistake to say that $z_i F \phi$ is _the_ electrostatic energy of those charged particles. Rather, each charged particle disturbs its environment and the actual electrostatic potential it experiences is going to differ from $\phi$. It may not even be possible to unambiguously specify such an energy, as it there is no sharp boundary between chemical bond and electric interaction.
Conversely, an infinitesimal test charge would probe extreme core potentials around the nuclei of solvent molecules, and so the average $\phi$ will have strange contributions never seen by actual solutes that will not penetrate into the same places as an infinitesimal test charge.

Therefore, $\mu_{\mathrm{int},i}$ is not just an ordinary chemical potential like that of an uncharged solute. Rather, $\mu_{\mathrm{int},i}$ it must also include all kinds of special electrostatic _corrections_ to $z_i F \phi$. These are quite sensitive to the kind of environment around the particle: which solvent, and which other charged solutes are around.

We really don't have any experimental way to access $\phi$ inside materials: it would require us to perform measurements using infinitesimal test charges that can pass through the material like ghosts. As far as experiments are concerned, $\phi$ and $\mu_{\mathrm{int},i}$ are simply not real.

## Substitutes for $\phi$ are better

In semiconductor physics we are blessed to have well-defined band structures, so we instead refer to band edges:

$$ \bar\mu_{\mathrm{e}^-} = \mu^{\mathrm{(C)}}_{\mathrm{int}} + E_{\mathrm{C}}, $$

for electrons in conduction band with band edge $E_{\mathrm{C}}$, and similar for holes in valence band. It is truly useful and quite accurate to imagine the electrons as if they are a dilute gas in a vacuum having electrostatic potential $\phi = -E_{\mathrm{C}} / e$, even though this is totally different than the real $\phi$ in the semiconductor, and $\mu^{\mathrm{(C)}}_{\mathrm{int}}$ is going to be totally different than the "true" $\bar\mu_{\mathrm{int},\mathrm{e}^-}$.

Likewise when we talk about the average kinetic energy of degenerate Fermi gas electrons in a metal, we are defining kinetic energy in reference to the conduction band, and not to any sort of fundamental energy $-e\phi$.

With electrochemical solutions, unfortunately we don't have convenient band edges. But, we could for example define $\phi$ as some kind of typical "scalar potential inbetween molecules", to get rid of the strange contribution from core potentials I mentioned above. We might invent a theoretical model that only involves outer atomic orbitals. These are all workable, but not-quite-physical, definitions of $\phi$. In the end it seems to be no problem since all the $\mu_{\mathrm{int},i}$ values shall compensate for the fuzziness. My standard state species voltages $V^\circ_i$ do work as well.

Of course by abandoning physically "real" reference $\phi$, and instead using a special reference for each material, then any sort of contact potential between different materials would lose physical meaning, no longer obeying $ \nabla^2 \phi = -\rho / \varepsilon_0 $. It would be sensitive to the arbitrary conventions we choose on both sides. But it turns out that contact potentials aren't very helpful anyway...

## Contact potentials are usually not important

When we have two conductors made of different materials in direct contact, they will each internally have flat $\phi$ but there will be some step $\phi_2 - \phi_1$. Such a step corresponds to displaced positive and negative charges near the interface: on net (on the smoothing scale we use to establish $\phi$) there will be an overall nonzero electric field at/near the junction, and therefore a net step in $\phi$.

It seems like this real double charge layer must be quite important, therefore, $\phi_2 - \phi_1$ must be important too. But again, this is only the potential step that would be experienced by an infinitesimal test charge. Across all kinds of phenomena in electrochemistry and solid-state physics, we see that $\phi_2 - \phi_1$ is generally a distraction from what actually matters.

For example, between a metal and semiconductor, or between two distinct semiconductors (like AlGaAs and GaAs), we really care about the relative positions of Fermi levels $\bar\mu_{\mathrm{e}^-}$ and the semiconductors' conduction bands $E_{\mathrm{C}}$. Not only that, we care about the detailed structure inside of the junction (the band bending, and the atomic jump). But all of this can be addressed without talking about the infinitesimal test charge's $\phi_2 - \phi_1$.

In electrolytes, not only is $\phi_2 - \phi_1$ between, say, water and benzene not measurable, it also simply doesn't matter.

## Contact potentials between similar materials: a misleading special case

When it comes to similar materials (same semiconductor or same solvent), then we *can* try to access $\phi_2 - \phi_1$. But this is only because $\phi_2 - \phi_1$ in this special case is going to automatically correspond to the difference in the accessible energy levels like $E_{\mathrm{C}}$ or $V^\circ_i $.

I suspect a big reason for the emphasis on liquid junction potentials ($\phi_2 - \phi_1$) in electrochemistry was the early discovery of the salt bridge. As discussed in [the earlier topic on Junctions](../junctions/), the minimization of $\phi_2 - \phi_1$ by a salt bridge is a _remarkable and specialized_ nonequilibrium phenomenon that relies on having identical solvents and having certain salts that are able to dominate diffusion. The observable result is alignment of $V^\circ_i$ ladders. Yet, introductory electrochemistry texts routinely present the salt bridge as "shorting together" the two aqueous solutions as if it was as natural as shorting together two wires. This is misleading as it suggests salt bridges between different solvents should also naturally "just work".

Similarly, in introductory teaching of semiconductor p-n junctions we often see discussion of the "built-in potential" $\phi_2 - \phi_1$, which corresponds to a shift in the band energies. This is often accompanied with a lengthy discussion of how it is unmeasurable by voltmeters due to careful cancellation with other built-in potentials at metal contacts. The idea is that we can forward bias the junction and `turn on' the junction when we neutralize the $\phi_2 - \phi_1$, or, we can shine light on it and cause the open circuit voltage to manifest the built-in voltage. These are not quite correct quantitatively, but even worse these are confusing concepts that have to be unlearned anyway.

## Metal-to-metal contact potentials are bad

Between semiconductors or between electrolytes, the idea of a contact potential $\phi_2 - \phi_1$ is dubious since it again has to to with what an infinitesimal test charge would see. But it is particularly bad when it comes to metals.

If we want to say that voltmeters to measure $\phi$, then we have to make sure all our unnecessary contact potentials cancel out. This means we have to attach two metals of identical composition to the electrodes, and compare $\phi$ between those identical metals. Then, measured voltage is $\Delta \phi = \Delta V_{\mathrm{e}^-}$. In order to find the total measured voltage, we should add up each interface's contact potential. A pragmatic electrochemist will thereafter focus on the electrode potentials, which lets us sweep this tedious visualization under the rug.

The contact potential tedium may seem harmless, but it can actually mislead. With thermoelectricity, there is a [long-standing myth](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html) that thermoelectric voltages are generated at junctions, due to the way contact potentials vary with temperature. In fact, thermoelectric effects have to do with gradients in $\bar\mu_{\mathrm{e}^-}$ in regions of thermal gradient, and $\bar\mu_{\mathrm{e}^-}$ has no step at the junction itself. Somewhat perversely, when it comes to temperature gradients it *does* matter what our wires are made of, at least all the wires that have thermal gradients! With great care it is possible to to properly derive thermoelectricity using a $\phi$ approach, but we'd have to do a lot of tedious work to figure out not only the junction $\phi$, but also the thermal-gradients $\phi$, and all the variations in $\mu_{\mathrm{int},\mathrm{e}^-}$, and in the end we get the same result as simply using $\bar\mu_{\mathrm{e}^-}$.

We also occasionally see the $\phi$ in a metal get re-invoked in terms of vacuum levels, which is a whole new layer of bad physics.

## Vacuum levels are unhelpful

It is unfortunately common to see discussions of material interfaces that involve the concept of 'vacuum level', that is, either the electrostatic potential $\phi_\mathrm{vac}$ just outside a surface, or the electrostatic energy $-e \phi_\mathrm{vac}$ that would be felt by an electron in that position (assuming near-surface image forces are irrelevant). Sometimes 'the vacuum' is treated as an objective reference, and sometimes we make a thought experiment of creating a material interface by bringing the two materials together gradually, sometimes the vacuum level is somehow even brought into a material.

I would like to provide a warning that **any reference to vacuum level is error-prone, often misleading, and at best a gross approximation, when it comes to analyzing most in-material phenomena**.

Of course, the vacuum level is super important where it comes to actual surface-vs-vacuum phenomena: work function, thermionic emission, Kelvin probe. And let's be generous: the notion of vacuum level and $\phi_\mathrm{vac}$ does retain a decent meaning even for spaces that aren't filled with literal vacuum, but might even contain dilute gases and dilute weakly ionized plasmas. We can talk confidently about the ionization energies and electron affinities of dilute atoms that are effectively isolated. But that's about it.

### "The vacuum" is inhomogeneous and messy, and a terrible reference point

Even when you are considering a single "homogeneous" conductive material, the level $\phi_\mathrm{vac}$ is going to vary spatially and from sample to sample depending on surface contamination, crystal orientation, and the atomic surface reconstruction. When you put multiple materials nearby each other, it only gets worse.

Usually this is recognized, so there is an attempt to fix this by referring to 'vacuum infinitely far away' as a reference point, to escape the local mess. But this gets quite abstract, as now the reference is totally unrelated to the materials in question. At that point you might as well not name any reference. If a reference is needed, then the electronic Fermi level itself (in a specific conducting object, such as a ground wire) is truly the best reference point.

Conceptually, it also gets things backwards. We should not think of Fermi levels as abstract floating quantities that depend on surface charge. Rather, through our wires, power supplies, and voltmeters, it is the Fermi level which is the first-class object that can access, and the vacuum levels are a secondary dependent field.

For electrochemistry, the concept of 'solvation of an ion' considers taking an ion in vacuum and dropping it into a solvent. It sounds so simple, but the above discussion makes it clear that the enthalpy of this process will depend sensitively on both where the ion started in vacuum and the electrochemical state inside the solvent. We can nail this down however: laboriously prepare a truly pure solvent surface (free of the contaminants that love to invisibly adsorb at surfaces) and drop the ion from just above it, you will measure a reliable solvation enthalpy for that solvent _surface_. Yet, what you have measured is still a surface property, that depends on how that particular pure solvent decides to set its local $\phi_\mathrm{vac}$. And in particular, it will offer you no insight into creating a universal absolute solvation enthalpy scale that you can use to predict solvent-solvent interfaces. This brings us to the next topic, of vacuum-predicted contact potentials.

### Vacuum contact: a grossly inaccurate thought experiment

The usual thought experiment [goes as follows](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html): we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat everywhere. They in general will have different work functions, so the Fermi levels will differ. We then bring the materials together and once they touch, the Fermi levels will equalize by moving charges, creating a double layer of charge (and therefore a jump in electrostatic potential). Therefore the contact potential will be given by the initial difference in Fermi levels.

The big problem with this thought experiment is that it neglects the actual microscopic interactions that would occur near and at contact. [As argued by R. Tung](https://doi.org/10.1063/1.4858400), it basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. As a result, the vacuum contact idea gives wildly incorrect predictions, such as the {%wiki "Schottky–Mott rule" %}.

This also gives wrong values for the contact potentials between metals, as these analyses often assume that the vacuum level extends _inside_ a metal as if it has no surface double layer, i.e., $\phi = \phi_\mathrm{vac}$. This is hopelessly wrong, though in the end it doesn't even matter since there are no phenomena that even depend on metal contact potentials, as described above.

Conceptually, it is simply wrong to view vacuum surfaces as basic building blocks from which material interfaces are made. Materials are not legos. Rather, a vacuum surface is just another kind of interface, with its own special considerations. A material-material interface will entirely lose the special vacuum considerations of each side, and then will gain its own new considerations.

## Takeaways

A theory of electronic and ionic conducting materials based on electrostatic potential $\phi$ is attractive, since $\phi$ is ostensibly quite well-defined and "real". We can almost access it in certain special cases (junctions between similar materials). But as soon as we try to work it out in detail, it becomes a mess. An extensive theory based on $\phi$ gets quickly complicated with numerous unmeasurable contact potentials. It has also become a minefield of misconceptions and bad ideas. Instead, our understanding of conductors should be founded on proper thermodynamics and place electrochemical potential $\bar\mu_i$ at the forefront, and reference $\phi$ as little as possible.

I hope that the species voltage $V_i = \bar\mu_i/(z_i F)$ and its associated visual band diagrams will help promote this $\phi$-less approach and bring together the semiconductor and electrochemical communities into a unified viewpoint.

-- Mark Lundeberg, 2025 May

(and if you're curious about this project, [the next topic](../about/) is about how this project came to be.)
