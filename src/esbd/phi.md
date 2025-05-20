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

Note: Often, we distinguish between inner potential $\phi$ (inside materials), and outer potential $\phi$ (outside material surface, i.e. vacuum potential). However, I'm going to argue that they are both problematic. I'm going to focus on the inner potential first and then later discuss why the outer potential (vacuum level) is also usually problematic.

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

## Real charges don't see $\phi$

We are not actually interested in infinitesimally charged test particles.

We want to know what an actual finitely-charged particle would see if placed in a material. Such a particle definitely disturbs the system, and its position will have correlations with other particles' positions.

Let's go back to our electrochemical potential partitioning:

$$ \bar\mu_i = \mu_{\mathrm{int},i} + z_i F \phi. $$

As discussed on [the intro page](../), this does get rid of some annoying aspects of electricity like general arbitrary offsets. Yet, it is a mistake to say that $z_i F \phi$ is _the_ electrostatic energy of those charged particles. Even to a very first approximation, the electrostatic potential felt by an ion would differ because:

* $z_i F \phi$ erroneously *omits* the local polarization of dielectric solvent and ionic atmosphere,
* $z_i F \phi$ erroneously *includes* the strong electric potentials around nuclear cores of surrounding particles (as $\phi$ is a uniform average over space).

And that is only a start. Of course, it may not even be possible to unambiguously specify such an idea as "electrostatic potential of an ion", as it there is no sharp boundary between chemical bond and electric interaction.

Sometimes $z_i F \phi$ is called the 'long distance part' of electrostatic energy, but even this is not correct.

Thus, $z_i F \phi$ is simply a bad estimate of the electrostatic energy felt by an ion, and so $\mu_{\mathrm{int},i}$ must include electrostatic energies as well, at least electrostatic corrections to $z_i F \phi$ that is. And that is in addition to any 'chemical-only' $\mu$ that might behave like an uncharged solute.

In principle this is fine, we can just say $\mu_{\mathrm{int},i}$ is an artificial number that shall compensate for all deficiencies in $z_i F \phi$. But then, $\mu_{\mathrm{int},i}$ has no physical meaning: it is merely an artificial difference between two energies of different nature ($\bar\mu_i$ being a thermodynamic property of ions, $z_i F \phi$ being the rest energy extrapolated from imaginary test charges that unnaturally permeate the material). I believe $\mu_{\mathrm{int},i}$ does not even deserve the name "chemical potential" since it doesn't describe equilibrium between bodies, unless they perchance happen to have the same $\phi$; $\mu_{\mathrm{int},i}$ is also not any meaningful partial molar Gibbs energy difference, except in charge-neutral combinations of $\mu_{\mathrm{int},i}$, such as $\mu_{\mathrm{int},i} - \tfrac{z_i}{z_j}\mu_{\mathrm{int},j} = \bar\mu_i - \tfrac{z_i}{z_j}\bar\mu_j = (V_i - V_j)z_i F$.

Finally, we simply don't have any experimental way to access $\phi$ inside materials. That would require us to perform measurements using infinitesimal test charges that can pass through the material like ghosts. That makes $\phi$ something we can calculate for a molecular dynamics simulation, but as far as experiments are concerned, $\phi$ is unmeasurable. And so $\mu_{\mathrm{int},i}$ is *both artificial and unmeasurable*.

### Special references are usually better

In semiconductor physics we are blessed to have well-defined band structures, so we instead refer to band edges:

$$ \bar\mu_{\mathrm{e}^-} = \mu^{\mathrm{(C)}}_{\mathrm{int}} + E_{\mathrm{C}}, $$

for electrons in conduction band with band edge $E_{\mathrm{C}}$, and similar for holes in valence band. Of course, $\mu^{\mathrm{(C)}}_{\mathrm{int}}$ is going to be totally different than the "true" $\bar\mu_{\mathrm{int},\mathrm{e}^-}$, but it will also be far more practical.

Likewise when we talk about the (kinetic) Fermi energy $\mu^{\mathrm{(C)}}_{\mathrm{int}}$ of degenerate Fermi gas electrons in a metal, we are defining kinetic energy in reference to the conduction band. We never reference kinetic energy to the electrostatic potential $-e\phi$ which has some weird and useless position on our band structure.

With electrochemical solutions, unfortunately we don't have convenient band edges. Electrochemical experiments end up using a practical reference (centralizing the dissolved $\mathrm{H}^+$ ion as a reference point, together with certain extra-thermodynamic conventions for activity coefficients in non-dilute solutions) and $\phi$ is bypassed in that way.

## But ultimately, electrochemical potential is king

Band structures start to fall apart in some strongly correlated materials, as the notion of band structure presumes a non-interacting electron model. Nevertheless, $\bar\mu_{\mathrm{e}^-}$ remains perfectly well defined. The Fermi level $\bar\mu_{\mathrm{e}^-}$ persists even when the Fermi energy $\mu^{\mathrm{(C)}}_{\mathrm{int}}$ has fallen.

Likewise $V^\circ_i$ for ions starts to lose meaning in non-ideal solutions where the solutes interact. Still, $V_i = \bar\mu_i / (z_i F)$ remains perfectly well defined.

We cannot always expect to find a convenient energy level that describes a mobile charge at rest, and sometimes, the mobile charges do not even exist at all as independent entities: strongly charged ions may predominantly enter ion pairs, superconducting electrons may enter Cooper pairs. Yet, their electrochemical potentials and $V_i$ remain well defined as thermodynamic variables that we can use to parameterize the system state, as well as to describe the driving force with respect to other bodies.

## Galvani potentials

When we have two conductors made of different materials in direct contact, they will each internally have flat $\phi$ but there will be some step $\phi_2 - \phi_1$. Such a step corresponds to displaced positive and negative charges near the interface: on net (on the smoothing scale we use to establish $\phi$) there will be an overall nonzero electric field at/near the junction, and therefore a net step in $\phi$. The step $\phi_2 - \phi_1$ may be called {%wiki "Galvani potential" %} or {%wiki "liquid junction potential" %} depending on context.

Let's be clear, the charge double layer is absolutely real. Our averages $\rho$ and $\phi$ do smudge out some of the details, but there truly is charge and electric field there. Surely this is of direct importance, right? No! Only our test charges would perceive the complex interface as a mere electric double layer. For any real ion, the energy difference that it experiences is *not* going to be $z_i F(\phi_2 - \phi_1)$.

For example, between a metal and semiconductor, or between two distinct semiconductors (like AlGaAs and GaAs), we really care about the relative positions of Fermi levels $\bar\mu_{\mathrm{e}^-}$ and the semiconductors' conduction bands $E_{\mathrm{C}}$. Not only that, we care about the detailed structure inside of the junction (the band bending, and the atomic jump). All of this can be addressed without ever talking about the infinitesimal test charge's $\phi_2 - \phi_1$.

When it comes to electrolytes, we can ask what is the $\phi_2 - \phi_1$ between, say, a water-based solution and a benzene-based solution. Not only is $\phi_2 - \phi_1$ here not measurable, it also simply doesn't matter.

### Galvani potentials between similar materials: a misleading special case

When it comes to similar materials (same semiconductor or same solvent, with very dilute mobile charges), then we *can* try to access $\phi_2 - \phi_1$. But this is only because $z_i F\phi$ changes are going to automatically correspond to the difference in the meaningful energy levels like $E_{\mathrm{C}}$ or $z_i F V^\circ_i $.

You can say that "the corrections to $\phi_2 - \phi_1$ become small in this case", but I am saying "in this case, $\phi_2 - \phi_1$ accidentally mimics the energy differences that actually matter".

I suspect a big reason for the emphasis on liquid junction potentials ($\phi_2 - \phi_1$) in electrochemistry was the early discovery of the salt bridge. As discussed in [the earlier topic on Junctions](../junctions/), the minimization of $\phi_2 - \phi_1$ by a salt bridge is an intrinsically *nonequilibrium phenomenon* that relies on certain conditions (identical solvents and correctly selected salts that are able to dominate diffusion). Yet, introductory electrochemistry texts routinely present the salt bridge as "shorting together" the two aqueous solutions' $\phi$ values as if it was as natural as shorting together two wires. This is misleading as it suggests salt bridges between different solvents should also naturally "just work" and minimize the liquid junction potentials there as well.

Similarly, in introductory teaching of semiconductor p-n junctions we often see discussion of the "built-in potential" $\phi_2 - \phi_1$, which corresponds to a shift in the band energies. Eventually we encounter semiconductor heterostructures and graded heterojunctions, and we learn that $\phi$ actually didn't matter all along: [what truly matters is how the *bands* are bending](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf).

### Metal potentials are worthless

With semiconductors or electrolytes, the the notion of $\phi$ is at least helpful as a naive explanation of things like band bending or salt bridges. But for metals, the concept of an inner potential is particularly dubious.

One problem is with voltmeters: if we want to say that voltmeters to measure $\phi$, then we have to make sure all our unnecessary metal potentials cancel out. The common practice is to conceptually "bookend" our device's electrodes with two metals of identical composition, so that $\Delta \phi$ happens to agree with the voltage difference $\Delta V_{\mathrm{e}^-}$. Unlike a proper band diagram, a plot of $\phi$ vs position will be cluttered by the bookends and all sorts of extra Galvani potentials between metals. A pragmatic electrochemist will soon sweep this tedious $\phi$ visualization under the rug and thereafter focus on the math of electrode potentials.

Another problem relates to the double layers: where a metal meets a non-metal (semiconductor or electrolyte), there is a near-discontinuous (angstrom-scale) jump in $\phi$ just at the surface, that is going to depend nontrivially on the nature of the other material, followed by a smoother region where $\phi$ approaches its equilibrium value more gradually (band bending). Thus we actually have a triple layer. Although we can do all sorts of experiments probing the gradual-$\phi$ region (again, since bending $\phi$ corresponds to bending of relevant energy levels!), we are never able to do an experiment that relates to the abrupt $\phi$ jump, i.e, we never probe the full triple layer. The only potential of a metal that enters is $V_{\mathrm{e}^-}$, or Fermi level.

The metal potential may seem merely tedious, but it can actually mislead. With thermoelectricity, there is a [long-standing myth](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html) that thermoelectric voltages are generated at junctions, due to the way that potentials vary with temperature. In fact, the thermoelectric voltage has to do with gradients in $V_{\mathrm{e}^-}$ that occur *only in regions of thermal gradient*, and $V_{\mathrm{e}^-}$ has no step at the junction itself. And, it's important to be careful here in terms of talking about the reality or measurability of $V_{\mathrm{e}^-}$ between bodies of different temperature: due to the thermoelectric effect, this is actually the exact time when it *does* matter what our cables are made of (at least, all the cables that have thermal gradients).

(Of course, it is possible to get the right thermoelectric voltage using $\phi$ and $\mu_{\mathrm{int},\mathrm{e}^-}$, and instead of $\bar\mu_{\mathrm{e}^-}$. This involves the difference between hot and cold junctions' contact potentials, but also the gradients in $\phi$ in regions of thermal gradient. The thermal gradients then fully cancel the contact potential contribution and add back in the correct thermoelectric result. In the end we would get the same result as simply using $\bar\mu_{\mathrm{e}^-}$ but it would be highly tedious and obscure the actual physics.)

## Vacuum levels (Volta potentials)

It is unfortunately common to see discussions of material interfaces that involve the concept of 'vacuum level' / outer potential / Volta potential. This is the electrostatic potential $\phi_\mathrm{vac}$ just outside a surface, or the electrostatic energy $-e \phi_\mathrm{vac}$ that would be felt by an electron in that position (assuming near-surface image forces are irrelevant). Sometimes 'the vacuum' is treated as an objective reference, and sometimes we make a thought experiment of creating a material interface by bringing the two materials together gradually.

Unlike the inner potential, we can actually measure $\phi_\mathrm{vac}$! The distinction between infinitesimal test charges and real charge disappears because there are no other particles around (assuming we are far enough from surfaces to ignore image-charge forces). So, given the difficulties with the $\phi$ inside of materials, it seems attractive to build our analysis of materials off the real and measurable $\phi_\mathrm{vac}$.  Unfortunately, just because it is measurable, does not make it useful. Such vacuum levels are *only* useful for actual vacuum surface phenomena (thermionic emission, photoemission, Kelvin probe). **References to vacuum level are often misleading when it comes to describing *in-material* phenomena**.

### The vacuum is inhomogeneous

We like to think of a vacuum as being pure and simple, free from the complexities of materials. Electrically, however, the vacuum is inhomogeneous: since it contains no mobile charges, it cannot flatten out its $\phi_\mathrm{vac}$. This is important even at perfect equilibrium since every material will set its surface $\phi_\mathrm{vac}$ differently, for example every metal surface has a different {% wiki "work function" %}.

Thus, a casual reference to the vacuum is too vague.

### No need to refer to the vacuum at infinity

The 'vacuum at infinity', [commonly invoked as a reference point](https://goldbook.iupac.org/terms/view/E01935), is not a good reference either. First, it unnecessarily supposes an empty universe outside of the experiment. Second, all of the experimental potentials and voltages relative to a faraway point will depend on our setup's total charge; although local charge neutrality is valid inside conductors, there is no reason to expect total charge neutrality. Third, we often want to consider idealized one-dimensional devices (infinite in the other two dimensions), and even when they are charge-neutral, there will generally be a difference in $\phi(+\infty)$ vs $\phi(-\infty)$, so there is no single 'vacuum at infinity'.

Rather than using vacuum at all, it is better to just say all of our potentials are subject to an arbitrary global offset. If we do need a reference, the best choice is a thermodynamic (electrochemical potential) reference such as an electronic ground, where we can set $V_{\mathrm{e}^-} = 0$. Not only does this directly connect to common practice in electronic circuit analysis, but is also more thermodynamically and physically justified.

### Outer potentials are not bulk properties

Even with a single perfectly homogeneous bulk material, $\phi_\mathrm{vac}$ will vary over its surface due to all kinds of surface phenomena, especially surface contamination and chemical termination. But even in for a perfectly clean surface, this still does not determine $\phi_\mathrm{vac}$:

* A perfect crystal will have $\phi_\mathrm{vac}$ varying between its crystal faces. Even within a single perfectly-aligned crystal face, there will be variations in $\phi_\mathrm{vac}$ due to {% wiki "surface reconstruction"%}.
* With conductive liquids, the surface state is especially sensitive to adsorption, even adsorption of dilute solutes that are intentionally added.

(A technique like kelvin probe force microscopy can directly measure and visualize these microscopic variations in $\phi_\mathrm{vac}$.)

When discussing in-material phenomena, there is a tendency to casually refer to the outer potential $\psi$ (which is $\phi_\mathrm{vac}$) as if it is a well-defined property of a bulk material. From the above it can be seen that this is not justified. At very least, $\psi$ for a bulk material is only defined if we further precisely specify the method of surface preparation. Thus, when discussing in-material phenomena, any reference to 'the vacuum' is ambiguous, even for a single material.

### The limited utility of 'real' vacuum references

Notwithstanding all the above, let's say we have a single homogeneous conductor and we nail down its surface preparation, defining the "real" vacuum level $\psi = \phi_\mathrm{real,vac}$. We can then define vacuum-referenced potential differences like $V_i - \psi$. Such quantities are actually measurable properties of a surface.

The electron work function $W$ is one such quantity: $W/e = V_{\mathrm{e}^-} - \psi = -e\psi - \bar\mu_{\mathrm{e}^-} $. It has been measured and tabulated for many materials.

In principle we can try to define a protonic work function similarly. This corresponds (roughly) to the idea of the absolute electrode potential.

The primary utility of these surface $V_i - \psi$ values is that they let us predict how $\phi_{\mathrm{vac}}$ will be set by a body. For example, electron work functions are important in {% wiki "electron gun", "electron emitters" %}, where a smaller work function presents a smaller barrier to an electron leaving a conductor.

Note that $(V_i - \psi)/(z_i F)$ is an energy difference of the form $\mu_{\mathrm{real},i} = \bar\mu_i - z_i F \psi$, a quantity that is unfortunately called "real chemical potential". The notion is that $-\mu_{\mathrm{real},i}$ describes the strength with which species $i$ is bound inside that material, as compared to other material. But this is only true when the materials are set up to have equal $\psi$ values, which is by no means a natural state of affairs. It only *seems* natural if we start out on the conceptual pathway of using vacuum as our reference.

This criticism of using vacuum as reference is a bit of a nitpick. But it does connect to a serious and impactful error, which I will discuss next.

### Vacuum contact: a common mis-thought experiment

It is unfortunately very common to try to predict material interfaces based on a thought experiment of two material surfaces coming gradually together in vacuum, and thereby forming a material interface.

Suppose we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat inbetween them. We then bring the materials closer and closer together until their $\phi_\mathrm{vac}$ levels magically fuse together. Since the electrochemical potentials of the various charged species in the materials likely started out unequal, then some charges will thereafter move between the materials. The movement of charge creates a charge double layer, or modifies the preexisting double layers. Crucially, for conductors with low concentrations of charged species, this predicts the properties of a *gradual* charge layer extending nearby the interface, i.e., a curved shifting in $\phi$ nearby the interface.

This gradual layer is a real feature of interfaces, and has different names in different fields: {% wiki "band bending" %} (in semiconductors), {% wiki "diffuse layer" %} (in solutions), and {% wiki "Debye sheath" %} (in plasmas). It decays as the {% wiki "Debye length" %}. Unforuntately, although the vacuum contact thought experiment predicts such a layer, it also gives quantitatively poor predictions of the sign/magnitude of layer (i.e., of the shift in $\phi$).

There are actually a few variants of this thought experiment:

* **Terrible** version: materials start off with no surface double layer ($\phi = \phi_\mathrm{vac}$). [Example here](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html). Maybe due to conflation of $\phi$ with $\phi_\mathrm{vac}$?
* Better but **still wrong** version: materials may start off with initial surface double layer ($\phi = \phi_\mathrm{vac} - \chi$, for surface potential difference $\chi$). In addition to the $\phi$-bending, this predicts a sharp jump in $\phi$ right at the interface, corresponding to the initial $\phi_2 - \phi_1 = \chi_1 - \chi_2$ that existed pre-contact.
* More practical but **still wrong** version: the unmeasurable $\phi$ is not referenced, and instead we use the so-called "electron affinity" of semiconductors (difference between $-e\phi_\mathrm{vac}$ and conduction band edge). This gives {%wiki "Schottky–Mott rule" %} and {%wiki "Anderson's rule" %}.

No matter how far we try to refine this vacuum contact thought experiment, we have made a major blunder in assuming that the $\phi_\mathrm{vac}$ levels will fuse together so nicely. In fact, what happens when materials meet is a detailed chemical bonding process that depends quite sensitively on microscopic details, and in general this detailed chemistry tends to completely wash out any prediction made by this vacuum contact idea. For semiconductors at least, vacuum contact does not even provide a useful first approximation. Measurable Schottky barriers are almost completely decorrelated from the Schottky–Mott rule, and likewise for real band alignments vs. Anderson's rule.

[As argued by R. Tung](https://doi.org/10.1063/1.4858400), the vacuum contact thought experiment basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. Arguably the vacuum contact thought experiment may have pedagogical value in introducing students to band bending (which truly does occur!). Yet, it has to be immediately stressed that its quantitative predictions are not naturally expected to work.

Conceptually, it is simply wrong to view vacuum surfaces as basic building blocks from which material interfaces are made. Materials are not legos. Rather, a vacuum surface is just another kind of interface, with its own special considerations. A material-material interface will entirely lose the special vacuum considerations of each side, and then will gain its own new considerations.

## An appeal to the theoretical and computational electrochemists

These days, we have fantastic computers and algorithms that are able to properly simulate materials, and $\phi$ becomes almost a real quantity in these simulations. The electric scalar potential basically comes for free, as it's necessary to model the dynamics. And so, it is no problem to smooth out this microscopic electric potential to obtain $\phi$. [It may even be computationally advantageous](https://www.nature.com/articles/s41524-023-01184-4) to make $\phi$ as the control variables in the simulation. Yet, this does not make $\phi$ any more of a physically meaningful variable.

Even in computation, $\phi$ *still* only corresponds to the energy of an infinitesimal ghost charge. So, if you report results referenced to $\phi$, or equivalently if you set $\phi=0$ and your results are unreferenced, then your results have lost physical significance. And regarding vacuum $\phi_\mathrm{vac}$, that can be even worse: unless you are explicitly taking care to accurately model the surface, then your surface potential is going to be way off, hence $\phi_\mathrm{vac}$ is an even worse reference point!

So, please do the work to calculate electrochemical potentials $\bar\mu_i$ and also meaningful ionic energies, and then output the differences in these energies (or equivalently use $V_i$'s). Not only will this aid in comparison with experiments, but it will also put your results on more rigorous thermodynamic grounds and simplify comparison with other theoretical results.

## Takeaways

A theory of electronic and ionic conducting materials based on electrostatic potential $\phi$ is attractive, since $\phi$ is ostensibly quite well-defined and "real". It seems as if we can almost access it in certain special cases (junctions between similar materials). Unfortunately, a thorough and functional theory of mobile charges based on $\phi$ gets quickly complicated with numerous unmeasurable Galvani potentials. This issue drives some scientist to base their analyses on the real outer potential (vacuum level), but that presents a whole new class of problems. This $\phi$-central approach has become a minefield of misconceptions and bad ideas.

Instead, our understanding of conductors should be founded on proper thermodynamics and place electrochemical potential $\bar\mu_i$ at the forefront. We must recognize that $\bar\mu_i$ the only fundamental chemical potential given by thermodynamics, and the partitioning of $\bar\mu_i$ into $\mu_{\mathrm{int},i} + z_i F \phi$ is "without physical significance", as Guggenheim said a hundred years ago.

I hope that the species voltage $V_i = \bar\mu_i/(z_i F)$ and its associated visual band diagrams will help promote this $\phi$-less approach and help bring together the semiconductor and electrochemical communities into a unified viewpoint.

-- Mark Lundeberg, 2025 May

(and if you're curious about this project, [the next topic](../about/) is about how this project came to be.)
