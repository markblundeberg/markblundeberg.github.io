---
layout: layouts/esbd_topic.njk
title: 'Vacuum levels'
tags: [page, esbd_topic]
orderESBD: 84
---

# {{title}}

It is unfortunately common to see discussions of material interfaces that involve the concept of 'vacuum level' / outer potential / Volta potential, denoted $\psi$. Here to be precise, I am going to draw a distinction:

* Vacuum potential $\phi_{\mathrm{vac}}$: the value of the electrostatic potential anywhere in the vacuum.
* Outer potential $\psi$: the value of the electrostatic potential just outside a surface (there, $\psi = \phi_{\mathrm{vac}}$).

In general, for any material surface, there will generally be some kind of charge double layer, so there will be some step $\psi - \phi = -\chi$, where $\chi$ is the surface potential (usually positive).

Unlike the inner potential $\phi$, we can actually access $\psi$ and $\phi_{\mathrm{vac}}$! The distinction between infinitesimal test charges and real charge disappears when there are no other particles around. I.e. for a real charged particle that is launched into an otherwise-empty vacuum, $z_i F \phi_{\mathrm{vac}}$ really is its electrostatic potential energy, and when it nears a surface then $\phi_{\mathrm{vac}}$ approaches the $\psi$ for that surface. We don't even need to perform any kind of microscopic smoothing process, since the microscopic electric scalar potential is automatically smooth in the vacuum.

So, given all the difficulties with the inner potential $\phi$ that [we discussed in the previous topic](../phi/), it seems attractive to build our analysis of materials off the real and accessible $\psi$ that sits nearby. Strictly speaking, we should only expect this vacuum-surface property to be useful for phenomena that actually relate to vacuum (thermionic emission, photoemission, Kelvin probe), and not for phenomena that occur strictly inside materials. But maybe we get lucky, and $\psi$ is actually useful (even approximately) in discussing material phenomena? I would say the answer here is *no*. Rather: **when it comes to describing *in-material* phenomena, references to vacuum level are often highly inaccurate and/or misleading**.

There are two major issues with $\psi$. First, $\psi$ is a poor reference, as it introduces all sorts of special surface considerations and in fact *complicates* the discussion of what is happening inside materials. Second, $\psi$ is often misused to predict the interface between two materials. The next sections will expand on these two issues.

### The vacuum is not a good reference

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

We can define

$$\alpha_i = \bar\mu_i - z_i F \psi$$

a quantity that is unfortunately called "real chemical potential".

The work function $W$ of electrons is one such quantity, actually its negative: $W = -\alpha_{\mathrm{e}^-}$. And we can generalize the idea of work function to other charged species:

$$ W_i = \varepsilon_{i,0} - \alpha_i, $$

where $\varepsilon_{i,0}$ is the internal rest energy of the particle in vacuum. (In general $\varepsilon_{i,0}$ includes things like molecular binding energies but also arbitrary offsets that have to be consistent with our convention of setting chemical potentials. Anyway, we can say $\varepsilon_{i,0}$ is just a constant for each kind of ion, and conventionally we set it to 0 for electrons.)

The naive notion is that $W_i$ describes the strength with which species $i$ is bound inside that material. With uncharged solutes we can imagine dropping them in from vacuum and $\varepsilon_{i,0} - \mu_i$ gives us an energy of solvation. This sure looks similar to $\varepsilon_{i,0} - \alpha_i$, so why can't we just say that work function $W_i$ is the equivalent energy of solvation for charged solutes?

Well, $W_i$ is only the energy of solvation for an electron or ion that starts out exactly just outside the surface. Its starting energy is sensitive to $\psi$, in other words, *its starting energy is already under the control of the surface*! This is quite different from uncharged solutes where we don't care where they start in vacuum, and their energy is totally independent of proximity to surfaces.

Examples of where this matters:

* $\psi$ may vary over the surface. Consider a "[Janus particle](https://pubs.acs.org/doi/10.1021/acs.langmuir.6b01282)" made up of two metals: the proper definition of its electron binding energy (ionization energy) is the same value for both metals despite their different $W$, because ionization energy requires moving the ejected electron far away, not just moving it to the surface. The exact value of this binding energy is sensitive to geometrical details, to both $W$ values.
* Even if $\psi$ is uniform, the energy required to remove a particle still depends on the total charge of the parent body.

This is just like how when we define ionization energies for molecules floating in vacuum, we require the electron to be moved far away, not just to the "surface" of the molecule where it is sensitive to the parent molecule's 'surface variations' (electric dipole) and total charge.

So, work function $W_i$ only represents the binding energy of charged solutes in very special cases. The "semiconductor electron affinity" and "semiconductor ionization energy" share this characteristic, which makes them really misnomers. In general these are all strictly surface properties; they do not have the character of binding energies, but rather they are more like interfacial *barrier heights*.

All these criticisms of using outer potential as reference may seem like nitpicking. But it does connect to a serious and impactful error, which I will discuss next.

### Vacuum contact: a common mis-thought experiment

It is unfortunately [very common](https://www.google.com/search?q="band+diagram"+"vacuum+level"&udm=2) to try to predict material interfaces based on a thought experiment of two material surfaces coming gradually together in vacuum. The fairy tale goes like so:

> Suppose we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat inbetween them and equal to $\psi$ of both bodies. We then bring the materials closer and closer together until their $\psi$ levels *magically fuse together*.

> From the contact assumption, we then derive the degree of semiconductor {% wiki "band bending" %} or a solution's {% wiki "diffuse layer" %}. (Since the electrochemical potentials of the various charged species in the materials likely started out unequal, then some charges will move between the materials. The net movement of charge raises the potentials in one material vs. the other until there is no net movement of charges.)

[As argued by R. Tung](https://doi.org/10.1063/1.4858400), the vacuum contact thought experiment basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. What actually happens when materials meet is a detailed chemical bonding process that depends quite sensitively on microscopic details, and the specific identities of all atoms involved. In *all* cases there will be some kind of atomic-scale rearrangement of atoms, bonds, and charges, right there at the interface. This creates an additional atomic-scale double-layer that cannot be predicted from macroscopic observables ($\psi$ and electrochemical potentials).

(Often this vacuum contact is described as "the vacuum level is continuous", and frequently drawn as such on band diagrams:

<figure class="demo-container" style="max-width: 300px">
<img src="/esbd/img/vacuum-contact-bad.png" style="max-width:100%"/>
{% figcaption %}
Common naive view of metal-to-semiconductor junction, where electron vacuum energy $E_0 = -e \psi$ is drawn as continuous. [from wikimedia commons user Giulio.galderisi, CC-BY-SA-4.0 license](https://commons.wikimedia.org/wiki/File:Msemictoghandsep.png)
{% endfigcaption %}
</figure>

This is wrong on two fronts: 1. the outer potential $\psi$ should not be depicted as a bulk property, see previous section, and 2. if there was a bulk $\psi$, it would in fact be discontinuous, due to the interface-specific effect.)

In semiconductor physics, the vacuum contact idea gives {%wiki "Schottky–Mott rule" %} and {%wiki "Anderson's rule" %}. These are very testable predictions and they are **almost completely wrong**, not even being a useful first approximation. Measurable Schottky barriers on the common covalent semiconductors (silicon, GaAs) are [almost completely decorrelated](http://academic.brooklyn.cuny.edu/physics/tung/Schottky/systematics.htm) from the Schottky–Mott rule, and likewise semiconductor heterojunction alignment disagrees with Anderson's rule.^[More ionic semiconductors — many oxides — obey the rule more closely; the degree of Fermi-level pinning is captured by an interface index $S$ that runs from $0$ (covalent, fully pinned, the rule fails) toward $1$ (ionic, the rule works).]

Arguably the vacuum contact thought experiment may have pedagogical value in introducing students to band bending, which truly does occur. Yet, it has to be immediately stressed that its quantitative predictions are not naturally expected to work, that $\psi$ is in fact allowed to be discontinuous, and that indeed the vacuum contact idea is known to fail spectacularly. Sadly, the vacuum contact myth is not confined to educational settings. Vacuum alignment ideas regularly appear in scientific papers not just as an assumption, but even worse, as an *unstated* assumption.

Conceptually, it is simply wrong to view vacuum surfaces as basic building blocks from which material interfaces are made. Materials are not legos. A vacuum surface is one kind of interface, with its own special considerations. A material-material interface is another kind of interface, with its own special considerations.

[**NEXT TOPIC: Inhomogeneities and electrostatics**](../inhomog/)
