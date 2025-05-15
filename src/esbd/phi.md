---
layout: layouts/esbd_topic.njk
title: 'The case against ϕ'
tags: [page, esbd_topic]
orderESBD: 98
eleventyNavigation:
    key: About *ϕ*
    parent: ESBD
    order: 998
---

# The case against $\phi$

When I came up with these $V_i$ band diagrams, it quickly became apparent that it is possible to entirely avoid invoking the electrostatic potential $\phi$. This was not surprising given my semiconductor physics background, yet this is so dissonant with $\phi$ being so fundamental in the usual electrochemistry analysis. Digging a little bit deeper, however, we find that the theoretical electrochemists are already uncomfortable with the unmeasurable $\phi$. This dates back to Guggenheim's [1929](https://doi.org/10.1021/j150300a003) and [1930](https://doi.org/10.1021/j150313a014) papers, and even earlier to Taylor and perhaps Gibbs.

I reaffirm Guggenheim's thesis, and I would modernize it further that it is not even necessary to reference $\phi$ in electrodes: voltmeters measure $V_{\mathrm{e}^-}$!

On this page I'll ramble on a bit about why we ought to *actively* avoid $\phi$ in both semiconductors and electrochemistry. While $\phi$ initially seems okay in principle, it actually complicates matters and also has become a minefield of misconceptions. None of this is new, I just want to collect my thoughts on the the topic.

Note: Often, we distinguish between inner potential $\phi$ (inside materials), and outer potential $\phi$ (outside material surface). I'm going to focus on the inner potential first and then later discuss why the outer potential (vacuum level) is also usually problematic.

## What is $\phi$?

Before we talk about problems with electrostatic potential $\phi$, let's just establish what it is, as a physical quantity. For that we're going to have to go back into Maxwell's equations for electromagnetism, and the electromagnetic potentials, especially the electric scalar potential.

Obviously, the actual nano-scale electric scalar potential in a material is going to have rapid variations in space and time, with all the various jigglings-about of nuclear cores and electrons. The electric scalar potential is not even a classical field, as it will contain quantum correlations with all the particle movements. And worse yet, it's totally ambiguous given all the gauge transformations with magnetic vector potential!

So let's nail all that down:

* We invoke the "electrostatic approximation" that the electric field curl is negligible, and electrostatic potential is the anti-gradient of electric field.
* We are interested in an _average_ electric scalar potential, which is smoothed out in space and time.
* We are however fine with an undetermined global offset in electrostatic potential since we'll always consider differences anyway.

The primary equation determining $\phi$ is the electrostatic Poisson equation in terms of an associated _average_ charge density $\rho$:

$$ \nabla^2 \phi = -\rho / \varepsilon_0 . $$

Most importantly, inside of a homogeneous electronic or ionic conducting material we say that $\rho = 0$ (charge neutrality on average), but also $\nabla \phi = 0$ (no internal electric fields) and therefore $\phi$ is flat throughout. Whatever averaging procedure we use is going to have to smear enough over the microscopic mess enough to get that $\rho=0$ and flat $\phi$.

What $\phi$ actually means:

**The potential $\phi$ is the electrostatic energy of a hypothetical *infinitesimally charged* test particle that can permeate materials without disturbing them, and whose position is blurry enough to smear out the atomic-scale variations in the actual electric scalar potential.**

## The problem with $\phi$

We are not actually interested in infinitesimally charged test particles.

We want to know what an actual finitely-charged particle would see if placed in that material. Such a particle definitely disturbs the system, and its position will have correlations with other particles' positions.

Let's go back to our electrochemical potential partitioning:

$$ \bar\mu_i = \mu_{\mathrm{int},i} + z_i F \phi. $$

As discussed on [the intro page](../), this does get rid of some annoying aspects of $\phi$ like general arbitrary offsets. Yet, it is a mistake to say that $z_i F \phi$ is _the_ electrostatic energy of those charged particles. Even to a very first approximation, the electrostatic potential felt by an ion would differ because:

* $z_i F \phi$ erroneously *omits* the local polarization of dielectric solvent and ionic atmosphere,
* $z_i F \phi$ erroneously *includes* the strong electric potentials around nuclear cores of surrounding particles (as $\phi$ is a uniform average over space).

And that is only a start. Of course, it may not even be possible to unambiguously specify such an idea as "electrostatic potential of an ion", as it there is no sharp boundary between chemical bond and electric interaction.

Thus, $z_i F \phi$ is simply a bad estimate of the electrostatic energy felt by an ion, and so $\mu_{\mathrm{int},i}$ must include electrostatic energies as well, at least electrostatic corrections to $z_i F \phi$ that is. And that is in addition to any 'chemical-only' $\mu$ that might behave like an uncharged solute.

In principle this is fine, we can just say $\mu_{\mathrm{int},i}$ is an artificial number that is defined to fully compensate for deficiencies in $z_i F \phi$. But likewise, it is easy to see that $\mu_{\mathrm{int},i}$ has no physical meaning: it is merely an artificial difference between two energies of different nature ($\bar\mu_i$ being a thermodynamic property of real ions, $z_i F \phi$ being the rest energy extrapolated from imaginary test charges that unnaturally permeate the material).

Finally, we simply don't have any experimental way to access $\phi$ inside materials. That would require us to perform measurements using infinitesimal test charges that can pass through the material like ghosts. That makes $\phi$ something we can calculate for a molecular dynamics simulation, but as far as experiments are concerned, $\phi$ is unmeasurable. And so $\mu_{\mathrm{int},i}$ is *both artificial and unmeasurable*.

## Alternative references are better than $\phi$

In semiconductor physics we are blessed to have well-defined band structures, so we instead refer to band edges:

$$ \bar\mu_{\mathrm{e}^-} = \mu^{\mathrm{(C)}}_{\mathrm{int}} + E_{\mathrm{C}}, $$

for electrons in conduction band with band edge $E_{\mathrm{C}}$, and similar for holes in valence band. Of course, $\mu^{\mathrm{(C)}}_{\mathrm{int}}$ is going to be totally different than the "true" $\bar\mu_{\mathrm{int},\mathrm{e}^-}$, but it will also be far more practical.

Likewise when we talk about the (kinetic) Fermi energy $\mu^{\mathrm{(C)}}_{\mathrm{int}}$ of degenerate Fermi gas electrons in a metal, we are defining kinetic energy in reference to the conduction band. We never reference kinetic energy to the electrostatic potential $-e\phi$ which has some weird and useless position on our band structure.

With electrochemical solutions, unfortunately we don't have convenient band edges. But, we could for example define $\phi$ as some kind of typical "scalar potential inbetween molecules", to get rid of the strange contribution from core potentials I mentioned above. We might invent a theoretical model that only involves outer atomic orbitals. These are all workable, but not-quite-physical, definitions of $\phi$. In the end it seems to be no problem since all the $\mu_{\mathrm{int},i}$ values shall compensate for the fuzziness. My standard state species voltages $V^\circ_i$ do work as well.

(Of course, only the universal reference $\phi$ is able to give a true contact potential between different materials, that corresponds to $ \nabla^2 \phi = -\rho / \varepsilon_0 $ with the true $\rho$ charge density double layer at the interface. But, as I'll describe below, this true $\phi$ contact potential isn't very helpful anyway.)

### Ultimately, electrochemical potential is king

Band structures start to fall apart in some strongly correlated materials, as the notion of band structure presumes a non-interacting electron model. Nevertheless, $\bar\mu_{\mathrm{e}^-}$ remains perfectly well defined. The Fermi level $\bar\mu_{\mathrm{e}^-}$ persists even when the Fermi energy $\mu^{\mathrm{(C)}}_{\mathrm{int}}$ has fallen.

Likewise $V^\circ_i$ for ions starts to lose meaning in non-ideal solutions where the solutes interact. Still, $V_i = \bar\mu_i / (z_i F)$ remains perfectly well defined.

## Contact potentials

When we have two conductors made of different materials in direct contact, they will each internally have flat $\phi$ but there will be some step $\phi_2 - \phi_1$. Such a step corresponds to displaced positive and negative charges near the interface: on net (on the smoothing scale we use to establish $\phi$) there will be an overall nonzero electric field at/near the junction, and therefore a net step in $\phi$. The step may be called names such as {%wiki "Galvani potential" %} or {%wiki "liquid junction potential" %} depending on context.

It seems like this real double charge layer must be quite important, therefore, $\phi_2 - \phi_1$ must be important too. But again, this is only the potential step that would be experienced by an infinitesimal test charge. Across all kinds of phenomena in electrochemistry and solid-state physics, we see that $\phi_2 - \phi_1$ is generally a distraction from what actually matters.

For example, between a metal and semiconductor, or between two distinct semiconductors (like AlGaAs and GaAs), we really care about the relative positions of Fermi levels $\bar\mu_{\mathrm{e}^-}$ and the semiconductors' conduction bands $E_{\mathrm{C}}$. Not only that, we care about the detailed structure inside of the junction (the band bending, and the atomic jump). But all of this can be addressed without talking about the infinitesimal test charge's $\phi_2 - \phi_1$.

In electrolytes, not only is $\phi_2 - \phi_1$ between, say, water and benzene not measurable, it also simply doesn't matter.

But again, there is a real electric double layer! So how could it be the case that we don't care about its nature? The answer is that the only our hypothetical infinitesimal test particles that would actually be able to perceive the complex interface as a mere double layer. For any real particle, it is going to care about the precise spatial distribution of the electric fields as well as the nature of the particles inside this interface region. The energy difference that the ion experiences is *not* going to be $z_i F\phi_2 - z_i F\phi_1$.

### Contact potentials between similar materials: a misleading special case

When it comes to similar materials (same semiconductor or same solvent), then we *can* try to access $\phi_2 - \phi_1$. But this is only because $z_i F\phi$ changes are going to automatically correspond to the difference in the meaningful energy levels like $E_{\mathrm{C}}$ or $z_i F V^\circ_i $.

You can say that "the corrections to $\phi_2 - \phi_1$ become small in this case", but I am saying "in this case, $\phi$ accidentally mimics the energies that actually matter".

I suspect a big reason for the emphasis on liquid junction potentials ($\phi_2 - \phi_1$) in electrochemistry was the early discovery of the salt bridge. As discussed in [the earlier topic on Junctions](../junctions/), the minimization of $\phi_2 - \phi_1$ by a salt bridge is an intrinsically *nonequilibrium phenomenon* that relies on certain conditions (identical solvents and correctly selected salts that are able to dominate diffusion). Yet, introductory electrochemistry texts routinely present the salt bridge as "shorting together" the two aqueous solutions as if it was as natural as shorting together two wires. This is misleading as it suggests salt bridges between different solvents should also naturally "just work" and minimize the liquid junction potentials there as well.

Similarly, in introductory teaching of semiconductor p-n junctions we often see discussion of the "built-in potential" $\phi_2 - \phi_1$, which corresponds to a shift in the band energies. Eventually we encounter semiconductor heterostructures and graded heterojunctions, and we learn that $\phi$ actually didn't matter all along: [what truly matters is how the *bands* are bending](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf).

### Metal-to-metal contact potentials are pure bad

Between semiconductors or between electrolytes, the idea of a contact potential $\phi_2 - \phi_1$ is dubious since it again has to to with what an infinitesimal test charge would see. But it is particularly bad when it comes to metals.

If we want to say that voltmeters to measure $\phi$, then we have to make sure all our unnecessary contact potentials cancel out. This means we have to attach two metals of identical composition to the electrodes, and compare $\phi$ between those identical metals. Then $\Delta \phi$ happens to agree with the voltage difference $\Delta V_{\mathrm{e}^-}$. Unlike a proper band diagram, a plot of $\phi$ vs position will be contaminated with extra matching metal 'bookends' and lots of visually complicated contact potentials between metals. A pragmatic electrochemist will thereafter focus on the electrode potentials and sweep this tedious $\phi$ visualization under the rug.

The contact potential tedium may seem harmless, but it can actually mislead. With thermoelectricity, there is a [long-standing myth](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html) that thermoelectric voltages are generated at junctions, due to the way contact potentials vary with temperature. In fact, thermoelectric effects have to do with gradients in $\bar\mu_{\mathrm{e}^-}$ in regions of thermal gradient, and $\bar\mu_{\mathrm{e}^-}$ has no step at the junction itself. When it comes to thermoelectricity, this is actually the exact time when we *do* care what our cables are made of -- at least all the cables that have thermal gradients!

(Of course, it is possible to make the right answer come out using $\phi$ and $\mu_{\mathrm{int},\mathrm{e}^-}$ instead of $\bar\mu_{\mathrm{e}^-}$. We must include not just the difference between hot and cold junctions' contact potentials, but also the gradients in $\phi$ in regions of thermal gradient. The thermal gradients then fully cancel the contact potential contribution and add back in the correct thermoelectric result. In the end we would get the same result as simply using $\bar\mu_{\mathrm{e}^-}$ but it would be highly tedious and obscure the actual physics.)

We also occasionally see the $\phi$ in a metal get re-invoked in terms of vacuum levels, which adds a whole new layer of misconceptions. We'll talk about this next:

## Vacuum levels

It is unfortunately common to see discussions of material interfaces that involve the concept of 'vacuum level', that is, either the electrostatic potential $\phi_\mathrm{vac}$ just outside a surface, or the electrostatic energy $-e \phi_\mathrm{vac}$ that would be felt by an electron in that position (assuming near-surface image forces are irrelevant). Sometimes 'the vacuum' is treated as an objective reference, and sometimes we make a thought experiment of creating a material interface by bringing the two materials together gradually.

I would like to provide a warning that **any reference to vacuum level is error-prone, often misleading, and at best a gross approximation, when it comes to analyzing most in-material phenomena**.

Of course, the vacuum level is super important where it comes to actual surface-vs-vacuum phenomena: work function, thermionic emission, Kelvin probe. And let's be generous: the notion of vacuum level and $\phi_\mathrm{vac}$ does retain a decent meaning even for spaces that aren't filled with literal vacuum, but might even contain dilute gases and dilute weakly ionized plasmas. We can talk confidently about the ionization energies and electron affinities of dilute atoms that are effectively isolated. But that's about it.

### "The vacuum" is inhomogeneous and messy, and a terrible reference point

Even when you are considering a single "homogeneous" conductive material, the level $\phi_\mathrm{vac}$ is going to vary spatially and from sample to sample depending on surface contamination, crystal orientation, and the atomic surface reconstruction. When you put multiple materials nearby each other, it only gets worse.

Conceptually, this gets things backwards. We should not think of Fermi levels as abstract floating quantities that depend on surface charge. Rather, through our wires, power supplies, and voltmeters, it is the Fermi level which is the first-class object that can access, and the vacuum levels are a secondary dependent field.

For electrochemistry, the concept of 'solvation of an ion' considers taking an ion in vacuum and dropping it into a solvent. It sounds so simple, but the above discussion makes it clear that the enthalpy of this process will depend sensitively on both where the ion started in vacuum and the electrochemical state inside the solvent. We can nail this down however: laboriously prepare a truly pure solvent surface (free of the contaminants that love to invisibly adsorb at surfaces) and drop the ion from just above it, you will measure a reliable solvation enthalpy for that solvent _surface_. Yet, what you have measured is still a surface property, that depends on how that particular pure solvent decides to set its local $\phi_\mathrm{vac}$. And in particular, it will offer you no insight into creating a universal absolute solvation enthalpy scale that you can use to predict solvent-solvent interfaces. This brings us to the next topic, of vacuum-predicted contact potentials.

### Vacuum contact: a grossly inaccurate thought experiment

The usual thought experiment [goes as follows](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html): we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat everywhere. They in general will have different work functions, so the Fermi levels will differ. We then bring the materials together and once they touch, the Fermi levels will equalize by moving charges, creating a double layer of charge (and therefore a jump in electrostatic potential). Therefore the contact potential will be given by the initial difference in Fermi levels.

The big problem with this thought experiment is that it neglects the actual microscopic interactions that would occur near and at contact. [As argued by R. Tung](https://doi.org/10.1063/1.4858400), it basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. As a result, the vacuum contact idea gives wildly incorrect predictions, such as the {%wiki "Schottky–Mott rule" %}.

Conceptually, it is simply wrong to view vacuum surfaces as basic building blocks from which material interfaces are made. Materials are not legos. Rather, a vacuum surface is just another kind of interface, with its own special considerations. A material-material interface will entirely lose the special vacuum considerations of each side, and then will gain its own new considerations.

## An appeal to the theoretical and computational electrochemists

These days, we have fantastic computers and algorithms that are able to properly simulate materials, and $\phi$ becomes almost a real quantity in these simulations. The electric scalar potential basically comes for free, as it's necessary to model the dynamics. And so, it is no problem to smooth out this microscopic electric potential to obtain $\phi$. [It may even be computationally advantageous](https://www.nature.com/articles/s41524-023-01184-4) to make $\phi$ as the control variables in the simulation. Yet, this does not make $\phi$ any more of a physically meaningful variable.

Even in computation, $\phi$ *still* only corresponds to the energy of an infinitesimal ghost charge. So, if you report results referenced to $\phi$, or equivalently if you set $\phi=0$ and your results are unreferenced, then your results have lost physical significance. And regarding vacuum $\phi_\mathrm{vac}$, that is even worse: unless you are actively tackling the super difficult task of work function modelling, then it is unlikely you are taking sufficient care to model surface conditions, so $\phi_\mathrm{vac}$ is an even worse reference point!

So, please only report energy differences involving meaningful energies and electrochemical potentials $\bar\mu_i$. Not only will this aid in comparison with experiments, but it will also put your results on more rigorous thermodynamic grounds and simplify comparison with other theoretical results.

## Takeaways

A theory of electronic and ionic conducting materials based on electrostatic potential $\phi$ is attractive, since $\phi$ is ostensibly quite well-defined and "real". We can almost access it in certain special cases (junctions between similar materials). Unfortunately, a thorough and functional theory of mobile charges based on $\phi$ gets quickly complicated with numerous unmeasurable contact potentials. We have to constantly make corrections from naive result to proper result. And so, this $\phi$-based approach has become a minefield of misconceptions and bad ideas.

Instead, our understanding of conductors should be founded on proper thermodynamics and place electrochemical potential $\bar\mu_i$ at the forefront. We must recognize that $\bar\mu_i$ the only fundamental chemical potential given by thermodynamics, and the partitioning of $\bar\mu_i$ into $\mu_{\mathrm{int},i} + z_i F \phi$ is "without physical significance", as Guggenheim said a hundred years ago.

I hope that the species voltage $V_i = \bar\mu_i/(z_i F)$ and its associated visual band diagrams will help promote this $\phi$-less approach and bring together the semiconductor and electrochemical communities into a unified viewpoint.

-- Mark Lundeberg, 2025 May

(and if you're curious about this project, [the next topic](../about/) is about how this project came to be.)
