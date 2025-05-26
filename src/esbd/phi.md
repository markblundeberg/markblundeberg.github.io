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

When I came up with these $V_i$ band diagrams, it quickly became apparent that it is possible to entirely avoid invoking the electrostatic potential $\phi$. This was not surprising given my semiconductor physics background, yet this is so dissonant with $\phi$ being so fundamental in the usual electrochemistry analysis. Digging a little bit deeper, however, we find that the theoretical electrochemists are already uncomfortable with the unmeasurable $\phi$, and sometimes have argued to abolish $\phi$ entirely. This dates back to Guggenheim's [1929](https://doi.org/10.1021/j150300a003) and [1930](https://doi.org/10.1021/j150313a014) papers, and even earlier to Taylor and perhaps Gibbs.

I reaffirm Guggenheim's thesis, and I would modernize it further that it is not even necessary to reference $\phi$ in electrodes: voltmeters measure $V_{\mathrm{e}^-}$!

On this page I'll ramble on a bit about why we ought to avoid discussing $\phi$ in both semiconductors and electrochemistry. While $\phi$-based approaches have been made to work, they actually complicate matters and create a minefield of misconceptions. None of this is new, I just want to collect my thoughts on the the topic.

Note: Often, we distinguish between inner potential $\phi$ (inside materials), and outer potential $\psi$ (outside material surface, i.e. vacuum potential). I'm going to argue that they are both problematic, though for quite different reasons. I'm going to focus on the inner potential first and then later discuss why the outer potential is also *usually* problematic.

## What is $\phi$?

Before we talk about problems with electrostatic potential $\phi$, let's just establish what it is, as a physical quantity. For that we're going to have to go back into principles from the fundamental equations of electromagnetism, and especially, the electric scalar potential.

Obviously, the actual nano-scale electric scalar potential in a material is going to have rapid variations in space and time, with all the various jigglings-about of nuclear cores and electrons. The electric scalar potential is not even a classical field, as it will contain quantum correlations with all the particle movements. And worse yet, the electric scalar potential is subject to a huge amount of ambiguity given all the gauge transformations with magnetic vector potential!

So let's nail all that down:

* We invoke the "electrostatic approximation" that the electric field curl is negligible, and electrostatic potential is the anti-gradient of electric field.
* We are interested in an _average_ electric scalar potential, which is smoothed out in space and time.
* We are however fine with an undetermined global offset in electrostatic potential since we'll always consider differences anyway.

The primary equation determining $\phi$ is the electrostatic Poisson equation in terms of an associated _average_ charge density $\rho$:

$$ \nabla^2 \phi = -\rho / \varepsilon_0 . $$

This defines $\phi$ in a consistent manner both inside and outside of materials. We'll refer to $\phi$ outside of materials (in vacuum) as $\phi_{\mathrm{vac}}$, but we'll discuss that later. For now let's focus on $\phi$ inside of materials, and especially inside of conductors (which have mobile charges).

Most importantly, inside of a homogeneous electronic or ionic conducting material we say that $\rho = 0$ (charge neutrality on average), but also $\nabla \phi = 0$ (no internal electric fields) and therefore $\phi$ is flat throughout. Whatever averaging procedure we use is going to have to smear enough over the microscopic mess enough to get that $\rho=0$ and flat $\phi$.

As far as a particle cares, what does $\phi$ even mean? The answer is:

> The potential $\phi$ is the electrostatic energy per unit charge, of a *hypothetical infinitesimally charged test particle* that can permeate materials without disturbing them, and whose position is blurry enough to smear out the atomic-scale variations in the actual electric scalar potential.

Unfortunately, we are not actually interested in infinitesimally charged test particles.

## Real charges don't see $\phi$

We want to know what an actual finitely-charged particle would see if placed in a material. Such a particle definitely disturbs the system, and its position will have correlations with other particles' positions. It is a mistake to say that $z_i F \phi$ is _the_ electrostatic energy of a real ion or electron. Even to a very first approximation, the electrostatic potential felt by the particle would differ because:

* $z_i F \phi$ erroneously *omits* the local polarization of dielectric solvent and ionic atmosphere.
* $z_i F \phi$ erroneously *includes* the strong electric potentials around nuclear cores of surrounding particles. These are places that test charges go but real charged species do not.

And that is only a start. Of course, it may not even be possible to unambiguously specify such an idea as "electrostatic potential of an ion", as it there is no sharp distinction between chemical bond and electric interaction. Sometimes $z_i F \phi$ is called the 'long distance part' of electrostatic energy, but even this is not correct since $\phi$ contains systematic long-distance errors.

And, we simply don't have any experimental way to access $\phi$ inside materials, as that would require infinitesimal test charges that don't exist. So $z_i F \phi$ is not only a poor approximation, it's not even tangible.

## Internal chemical potential is not real

Let's go back to our electrochemical potential partitioning:

$$ \bar\mu_i = \mu_{\mathrm{int},i} + z_i F \phi. $$

As discussed on [the intro page](../), this does get rid of some annoying aspects of electricity like general arbitrary offsets. But since $z_i F \phi$ is a bad estimate of the electrostatic energy felt by an ion, that means $\mu_{\mathrm{int},i}$ must include all the necessary electrostatic corrections to $z_i F \phi$. And that is in addition to any 'chemical-only' $\mu$ that might behave like an uncharged solute.

In principle this is fine, we can just say $\mu_{\mathrm{int},i}$ is an artificial number that shall compensate for all deficiencies in $z_i F \phi$. But then, $\mu_{\mathrm{int},i}$ has no physical meaning: it is merely an artificial difference between two energies of different nature ($\bar\mu_i$ being a thermodynamic property of ions, $z_i F \phi$ being the rest energy extrapolated from imaginary test charges that unnaturally permeate the material).

Really, $\mu_{\mathrm{int},i}$ does not deserve the name "chemical potential" since:
* it doesn't describe equilibrium between bodies (unless they perchance happen to have the same $\phi$).
* it is not any meaningful partial molar Gibbs energy (except in charge-neutral combinations of $\mu_{\mathrm{int},i}$, such as $\mu_{\mathrm{int},i} - \tfrac{z_i}{z_j}\mu_{\mathrm{int},j} = \bar\mu_i - \tfrac{z_i}{z_j}\bar\mu_j = (V_i - V_j)z_i F$).
* $\mu_{\mathrm{int},i}$ is not even experimentally accessible, since $\phi$ is experimentally inaccessible.

The one benefit of $z_i F \phi$ is that it is at least consistently applied to all ions in the same place. But this would be satisfied by any random number in place of $\phi$ -- the $\mu_{\mathrm{int},i}$ values would fully adjust to compensate for that too!

## Galvani potentials and double layers

When we have two conductors made of different materials in direct contact, they will each internally have flat $\phi$ but there will be some step $\phi_2 - \phi_1$. Such a step corresponds to displaced positive and negative charges near the interface: on net (on the smoothing scale we use to establish $\phi$) there will be an overall nonzero electric field at/near the junction, and therefore a net step in $\phi$. The step $\phi_2 - \phi_1$ may be called {%wiki "Galvani potential" %} or {%wiki "liquid junction potential" %} depending on context.

Let's be clear, the charge double layer is absolutely real. Our averages $\rho$ and $\phi$ do smudge out some of the details, but there truly is some kind of local charge displacement and electric field. Surely this is of real importance, right? No! Only our test charges would perceive the complex interface as a mere electric double layer. For any real ion, the energy difference that it experiences is *not* going to be $z_i F(\phi_2 - \phi_1)$. The double layer may be physically real, but it is mostly a distraction from what we actually care about.

For example, between a metal and semiconductor, or between two distinct semiconductors (like AlGaAs and GaAs), we really care about the relative positions of Fermi levels $\bar\mu_{\mathrm{e}^-}$ and the semiconductors' conduction bands $E_{\mathrm{C}}$. Not only that, we care about the detailed structure inside of the junction (the {% wiki "band bending" %}, and the atomic jump). All of this can be addressed without ever talking about the infinitesimal test charge's $\phi_2 - \phi_1$.

When it comes to electrolytes, we can ask what is the double layer (or $\phi_2 - \phi_1$) at the interface of a water-based solution and a benzene-based solution. But that is not what we care about, and indeed $\phi_2 - \phi_1$ is totally unmeasurable here. Instead we want to analyze equilibration of (electro-) chemical potentials, and we also care about the ionic {% wiki "diffuse layer" %} ("band bending").

### Galvani potentials between similar materials: a misleading special case

When it comes to similar materials (same semiconductor or same solvent, with very dilute mobile charges), then we *can* try to access $\phi_2 - \phi_1$. But this is only because $z_i F\phi$ changes are going to automatically correspond to the difference in the meaningful energy levels like conduction band energy $E_{\mathrm{C}}$, or ionic standard states $V^\circ_i $.

You can say that "the corrections to $\phi_2 - \phi_1$ become small in this case", but I am saying "in this case, $\phi_2 - \phi_1$ accidentally mimics the energy differences that actually matter".

I suspect a big reason for the emphasis on liquid junction potentials ($\phi_2 - \phi_1$) in electrochemistry was the early discovery of the salt bridge. As discussed in [the earlier topic on Junctions](../junctions/), the minimization of $\phi_2 - \phi_1$ by a salt bridge is an compicated *nonequilibrium* phenomenon that relies on certain conditions (identical solvents and correctly selected salts that are able to dominate diffusion). Yet, introductory electrochemistry texts routinely present the salt bridge as "shorting together" the two aqueous solutions' $\phi$ values as if it was as natural as shorting together two wires. This is misleading as it suggests salt bridges between different solvents, or even between non-ideal solutions with the same solvent, should also naturally "just work" and minimize the liquid junction potentials there as well.

Similarly, in introductory teaching of semiconductor p-n junctions we often see discussion of the "built-in potential" $\phi_2 - \phi_1$, which corresponds to a shift in the band energies. Eventually we encounter semiconductor heterostructures and graded heterojunctions, and we learn that $\phi$ actually didn't matter all along: [what truly matters is how the *bands* are bending](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf).

### Inner potentials of metals: tedious and misleading

With semiconductors or electrolytes, the the notion of $\phi$ is at least helpful as a naive explanation of things like band bending or salt bridges. But in metals there is no significant band bending, and the concept of an inner potential is simply dubious.

One problem is with voltmeters: if we want to say that voltmeters to measure $\phi$, then we have to make sure all our unnecessary metal potentials cancel out. The common practice is to conceptually "bookend" our device's electrodes with two metals of identical composition, so that $\Delta \phi$ happens to agree with the voltage difference $\Delta V_{\mathrm{e}^-}$. For example, the following figure:

<div class="demo-container" style="max-width: 400px">
<img src="/esbd/img/bard-faulkner-fig1.1.2.png" style="max-width:100%"/>

<small>Profile of $\phi$ across a device, as relating to measured voltage $E$. From Bard & Faulkner's [<em>Electrochemical Methods</em> (2022)](https://www.wiley.com/en-kr/Electrochemical+Methods%3A+Fundamentals+and+Applications%2C+3rd+Edition-p-9781119334064) Fig 1.1.2 (fair use reproduction).</small>
</div>

Unlike a proper band diagram, a plot of $\phi$ vs position is cluttered by the matching-metal bookends and all sorts of extra Galvani potentials between metals. A pragmatic electrochemist will soon sweep this tedious $\phi$ visualization under the rug and thereafter focus on the math of electrode potentials.

Another problem relates to the double layers: where a metal meets a non-metal (semiconductor or electrolyte), there is a near-discontinuous (angstrom-scale) jump in $\phi$ just at the surface, that is going to depend nontrivially on the nature of the other material, followed by a smoother region where $\phi$ approaches its equilibrium value more gradually ({% wiki "band bending" %}). Thus we actually have a triple layer. Although we can do all sorts of experiments probing the gradual-$\phi$ region (again, since bending $\phi$ corresponds to bending of relevant energy levels!), we are never able to do an experiment that relates to the abrupt $\phi$ jump, i.e, we never probe the full triple layer. The only potential of a metal that enters is $V_{\mathrm{e}^-}$, or Fermi level.

#### The thermoelectricity myth

The elecrostatic potential of metals may seem merely tedious, but it can actually mislead. With thermoelectricity, there is a long-standing myth that thermoelectric voltages are generated at junctions, and attributed to the way that the Galvani potential varies with temperature. Alternatively they are attributed to contact potentials (*outer* potential differences), [as illustrated here](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html). Anyway, both of these are simply wrong.

In fact, the thermoelectric voltage has to do with gradients in the proper voltage (electrochemical potential, i.e., $V_{\mathrm{e}^-}$) that occur *only in regions of thermal gradient*, and $V_{\mathrm{e}^-}$ has no step at the junction itself. Thermodynamically, we describe thermoelectricity in terms of coupled transport of heat and electrons; it is only one of many kinds of coupled heat-particle transport phenomena.

Of course, it is possible to get the right thermoelectric voltage using $\phi$ (and $\mu_{\mathrm{int},\mathrm{e}^-}$), instead of $\bar\mu_{\mathrm{e}^-}$. This does involve the difference between hot and cold junctions' Galvani potentials, but we also have to include the gradients in $\phi$ in regions of thermal gradient. The thermal gradients' $\delta \phi$ contribution would then fully cancel the Galvani potentials' $\delta \phi$ contribution, and add back in the correct thermoelectric result. We could also do the same with reference to outer potential $\psi$, or conduction band $E_{\mathrm{C}}$, with all the same considerations but different in quantity. In the end, we would have to get the same result as simply using $\bar\mu_{\mathrm{e}^-}$ but it would be highly tedious and tend to obscure the interesting physics.

## Vacuum levels (outer potentials / Volta potentials)

It is unfortunately common to see discussions of material interfaces that involve the concept of 'vacuum level' / outer potential / Volta potential, denoted $\psi$. Outer potential $\psi$ is the value of the electrostatic potential just outside a surface.

In general, for any material surface, there will generally be some kind of charge double layer, so there will be some step $\psi - \phi = -\chi$, where $\chi$ is the surface potential (usually positive).

Unlike the inner potential $\phi$, we can actually access $\psi$! The distinction between infinitesimal test charges and real charge disappears when there are no other particles around. I.e. for a real charged particle that is launched into an otherwise-empty vacuum, $z_i F \phi_{\mathrm{vac}}$ really is its electrostatic potential energy, and when it nears a surface then $\phi_{\mathrm{vac}}$ approaches the $\psi$ for that surface. We don't even need to perform any kind of microscopic smoothing process, since the microscopic electric scalar potential is automatically smooth in the vacuum.

So, given all the difficulties with the inner potential $\phi$ that we've discussed above, it seems attractive to build our analysis of materials off the real and accessible $\psi$ that sits nearby. Wait though... it's clear we can only strictly expect this vacuum-surface property to be useful for phenomena that actually relate to vacuum (thermionic emission, photoemission, Kelvin probe), and not for phenomena that occur strictly inside materials. But maybe we get lucky, and $\psi$ is actually useful (even approximately) in discussing material phenomena? Nope! Rather: **when it comes to describing *in-material* phenomena, references to vacuum level are often highly inaccurate and/or misleading**.

There are two major issues with $\psi$. First, $\psi$ is a poor reference, as it introduces all sorts of special surface considerations and in fact *complicates* the discussion of what is happening inside materials. Second, $\psi$ is often misused to predict the interface between two materials.

### The vacuum is a not a good reference

It is common to see energies in a material referenced "relative to vacuum".

#### The vacuum is not flat

First, a point about ambiguity.

Frequently we see energy level charts with 'vacuum level' drawn flat across the top as a zero line, a common reference point for different materials. Likewise a casual reference to "the vacuum" may assume $\phi_\mathrm{vac}$ is flat.

But, the vacuum is naturally an electrically inhomogeneous "material". Since vacuum contains no mobile charges, i.e., it is an insulator, it cannot flatten out its $\phi_\mathrm{vac}$. This is important even at perfect equilibrium since every conductor will set its surface $\phi_\mathrm{vac} = \psi$ differently, for example every metal surface has a different {% wiki "work function" %}. Inbetween conductors, the vacuum level interpolates according to the Laplace equation $\nabla^2 \phi_\mathrm{vac} = 0$.

Achieving flat $\phi_\mathrm{vac}$ would require all surfaces to have the same outer potential $\psi$. To achieve this, it is necessary that 1. for each electrically self-connected body, its surface has been prepared with a uniform work function, and 2. each body has carefully had its total charge neutralized. 

Aside from that unlikely, artificially engineered special case, we always have to contend with $\phi_\mathrm{vac}$ variations. There are two answers to this:

* *Local*: refer to the outer potential $\psi$ just outside a specific material surface. In that case there are many "the vacuum"s, as there may be (and often is) a different $\psi$ for every point on every surface.
* *Absolute*: refer to $\phi_\mathrm{vac}$ at some specific reference point, which might be far removed. Sometimes this is "vacuum at infinity" $\phi_\mathrm{vac}(\infty)$, however even that can be ill-specified, irrelevant, or even undefined. In particular, $\phi_\mathrm{vac}(\infty)$ is a poor choice of reference for an electronic or electrochemical device that is attached to electrodes.

#### The outer potential is not a "natural" bulk property

Even with a single perfectly homogeneous bulk material, $\psi$ will vary over its surface due to all kinds of surface phenomena, especially surface contamination and surface oxidation. In solids there are further static variations in $\psi$ depending on crystal facet, surface roughness, surface termination, and even spontaneous {% wiki "surface reconstruction" %}.

Nevertheless, we can imagine nailing down our surface preparation to such a degree that $\psi$ is well-defined for that surface. So, if $\psi$ is to be a consistent bulk property, what it would refer to is "what $\psi$ *would be* if we created a surface with such and such surface condition". This is unsatisfactory as we really hoped to have a natural bulk $\psi$ that all the particles inside the material are somehow connected to and "aware" of.

The reality is that for a particle that is deep inside a material, it does not care about what is happening at some distant hypothetical surface. It doesn't care how well we have chosen to prepare the surfaces of the material, or whether its host material even has any exposed surfaces at all. Any bulk $\psi$ that we define is merely notional and artificial.

#### Work function is a surface barrier height, not a bulk binding energy

Notwithstanding the above, let's suppose that 'bulk $\psi$' was actually a reliable property for every material. It is then a reliable reference, but is it a *meaningful* reference?

We can define a quantity

$$\alpha_i = \bar\mu_i - z_i F \psi$$

a quantity that is unfortunately called "real chemical potential".

The work function $W$ of electrons is one such quantity, actually a negative: $W = -\alpha_{\mathrm{e}^-}$. And we can generalize the idea of work function to other charged species:

$$ W_i = \varepsilon_{i,0} - \alpha_{\mathrm{e}^-}, $$

where $\varepsilon_{i,0}$ is the internal rest energy of the particle in vacuum. (In general $\varepsilon_{i,0}$ includes things like molecular binding energies but also arbitrary offsets that have to be consistent with our convention of setting chemical potentials. Anyway, we can say $\varepsilon_{i,0}$ is just a constant for each kind of ion, and conventionally we set it to 0 for electrons.)

The naive notion is that $W_i$ describes the strength with which species $i$ is bound inside that material. With uncharged solutes we can imagine dropping them in from vacuum and $\varepsilon_{i,0} - \mu_i$ gives us an energy of solvation. This sure looks similar to $\varepsilon_{i,0} - \alpha_{\mathrm{e}^-}$, so why can't we just say that work function $W_i$ is the equivalent energy of solvation for charged solutes?

Well, $W_i$ is only the energy of solvation for an electron or ion that starts out exactly just outside the surface. Its starting energy is sensitive to $\psi$, in other words, *its starting energy already under the control of the surface*! This is quite different from uncharged solutes where we don't care where they start in vacuum, and their energy is totally independent of proximity to surfaces.

Examples of where this matters:

* $\psi$ may vary over the surface. Consider a "[Janus particle](https://pubs.acs.org/doi/10.1021/acs.langmuir.6b01282)" made up of two metals: the proper definition of its electron binding energy (ionization energy) is the same value for both metals despite their different $W_i$, because ionization energy requires moving the ejected electron far away, not just moving it to the surface. The exact value of this binding energy is sensitive to geometrical details, to both $W_i$ values.
* Even if $\psi$ is uniform, the energy required to remove a particle still depends on the total charge of the parent body.

This is just like how when we define ionization energies for molecules floating in vacuum, we require the electron to be moved far away, not just to the "surface" of the molecule where it is sensitive to the parent molecule's 'surface variations' (electric dipole) and total charge.

So, work function $W_i$ only represents the binding energy of charged solutes in very special cases of uncharged parent bodies with totally uniform surface $\psi$. The "semiconductor electron affinity" and "semiconductor ionization energy" share this characteristic, which makes them really misnomers. In general these are all strictly surface properties; they do not have the character of binding energies, but rather they are more like interfacial *barrier heights*.

All these criticisms of using outer potential as reference may seem like nitpicking. But it does connect to a serious and impactful error, which I will discuss next.

### Vacuum contact: a common mis-thought experiment

It is unfortunately [very common](https://www.google.com/search?q="band+diagram"+"vacuum+level"&udm=2) to try to predict material interfaces based on a thought experiment of two material surfaces coming gradually together in vacuum. The fairy tale goes like so:

> Suppose we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat inbetween them and equal to $\psi$ of both bodies. We then bring the materials closer and closer together until their $\psi$ levels *magically fuse together*.

> From contact assumption, we then derive the degree of semiconductor {% wiki "band bending" %} or a solution's {% wiki "diffuse layer" %}. (Since the electrochemical potentials of the various charged species in the materials likely started out unequal, then some charges will move between the materials. The net movement of charge raises the potentials in one material vs. the other until there is no net movement of charges.)

[As argued by R. Tung](https://doi.org/10.1063/1.4858400), the vacuum contact thought experiment basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. What actually happens when materials meet is a detailed chemical bonding process that depends quite sensitively on microscopic details, and the specific identities of all atoms involved. In *all* cases there will be some kind of atomic-scale rearrangement of atoms, bonds, and charges, right there at the interface. This creates an additional atomic-scale double-layer that cannot be predicted from macroscopic observables ($\psi$ and electrochemical potentials).

(Often this vacuum contact is described as "the vacuum level is continuous", and frequently drawn as such on band diagrams:

<div class="demo-container" style="max-width: 300px">
<img src="/esbd/img/vacuum-contact-bad.png" style="max-width:100%"/>

<small>Common naive view of metal-to-semiconductor junction, where electron vacuum energy $E_0 = -e \psi$ is drawn as continuous. [from wikimedia commons user Giulio.galderisi, CC-BY-SA-4.0 license](https://commons.wikimedia.org/wiki/File:Msemictoghandsep.png)</small>
</div>

This is wrong on two fronts: 1. the outer potential $\psi$ should not be depicted as a bulk property, see previous section, and 2. if there was a bulk $\psi$, it would in fact be discontinuous, due to the interface-specific effect.)

In semiconductor physics, the vacuum contact idea gives {%wiki "Schottky–Mott rule" %} and {%wiki "Anderson's rule" %}. These are very testable predictions and they are **almost completely wrong**, not even being a useful first approximation. Measurable Schottky barriers are [almost completely decorrelated](http://academic.brooklyn.cuny.edu/physics/tung/Schottky/systematics.htm) from the Schottky–Mott rule, and likewise semiconductor heterojunction alignment disagrees with Anderson's rule.

Arguably the vacuum contact thought experiment may have pedagogical value in introducing students to band bending, which truly does occur. Yet, it has to be immediately stressed that its quantitative predictions are not naturally expected to work, that $\psi$ is in fact allowed to be discontinuous, and that indeed the vacuum contact idea is known to fail spectacularly. Sadly, the vacuum contact myth is not only contained to educational settings. Vacuum alignment ideas regularly appear in scientific papers not just as an assumption, but even worse, as an *unstated* assumption.

Conceptually, it is simply wrong to view vacuum surfaces as basic building blocks from which material interfaces are made. Materials are not legos. A vacuum surface is one kind of interface, with its own special considerations. A material-material interface is another kind of interface, with its own special conserations.

## A plea to the theoretical and computational electrochemists

These days, we have fantastic computers and algorithms that are able to properly simulate materials, and $\phi$ is a tangible quantity in these simulations. The electric scalar potential basically comes for free, as it's necessary to model the precise microscopic electric interactions. And so, it is no problem to [smooth this out](https://doi.org/10.1021/acsomega.0c04420) to obtain $\phi$. [It may even be computationally advantageous](https://www.nature.com/articles/s41524-023-01184-4) to use $\phi$ as a control variable in the simulation.

But, even in computation, the inner potential $\phi$ *still* only corresponds to the energy of an infinitesimal ghost charge. So it is calculable, but it is not physically relevant. So, if you report results referenced to $\phi$, or equivalently if you set $\phi=0$ and your results are unreferenced, then your results have lost physical significance.

Regarding vacuum level (and specifically, outer potential $\psi$), all of the considerations I stated about vacuum levels still apply! If you don't take sufficient consideration in modelling the surface conditions (analogous to the experimentalist reproducibly creating certain surface conditions), then the $\psi$ value you obtain is going to be an unreliable reference. But even if $\psi$ is carefully modelled, remember that a work function does not represent a binding energy reference level, but only a surface barrier height. As for the vacuum contact myth, molecular simulations of course easily reveal this.

Ideally, please do the work to calculate electrochemical potentials $\bar\mu_i$ and any meaningful energies that are actually experienced by the electrons/ions, and then output the differences in these real quantities. Not only will this aid in comparison with experiments, but it will also put your results on more rigorous thermodynamic grounds and simplify comparison with other theoretical results.

## Takeaways

A theory of electronic and ionic conducting materials based on electrostatics is attractive. The inner potential $\phi$ seems well-defined and physically "real". It seems as if we can almost access it in certain special cases (junctions between similar materials), or at least control it (with salt bridges). Unfortunately, a thorough and functional theory of mobile charges based on $\phi$ gets quickly complicated with numerous unmeasurable quantities, which all stems from $\phi$ being a poor reference. And, it may seem like the outer potential $\psi$ provides an escape from this ambiguity, however, it actually presents a whole new class of problems and misconceptions. Quite simply, electrostatics make a poor foundation for a thermodynamic theory of conductors.

Instead, we should place electrochemical potential $\bar\mu_i$ at the forefront. We must recognize that:
* Electrochemical potential $\bar\mu_i$ the only fundamental chemical potential given by thermodynamics, and the partitioning of $\bar\mu_i$ into $\mu_{\mathrm{int},i} + z_i F \phi$ is "without physical significance", as Guggenheim said a hundred years ago.
* The outer potential $\psi$ only deserves to be discussed in the context of actual vacuum surface experiments.

I hope that the species voltage $V_i = \bar\mu_i/(z_i F)$ and its associated visual band diagrams will help promote this $\phi$-less approach and help bring together the semiconductor and electrochemical communities into a unified viewpoint.

-- Mark Lundeberg, 2025 May

(and if you're curious about this project, [the next topic](../about/) is about how this project came to be.)
