---
layout: layouts/esbd_topic.njk
title: 'Vacuum levels'
tags: [page, esbd_topic]
orderESBD: 84
---

# {{title}}

[The previous topic](../phi/) was hard on the in-material $\phi$, so let me start this one with good news: there is a place where the electrostatic potential is beyond reproach, and it is the vacuum. With no particles around there is nothing to smooth over; the microscopic potential is already smooth, and a real charged particle launched into it has electrostatic energy exactly $z_i F \phi_{\mathrm{vac}}$, no test-charge fiction required. The test charge and the real charge finally agree. To be precise about names:

* Vacuum potential $\phi_{\mathrm{vac}}$: the value of the electrostatic potential anywhere in the vacuum.
* Outer potential $\psi$: the value of the electrostatic potential just outside a particular material surface (there, $\psi = \phi_{\mathrm{vac}}$). Between it and the material's inner $\phi$ sits that surface's own charge double layer, giving a step $\psi - \phi = -\chi$, where $\chi$ is the surface potential (usually positive).

This honesty is why $\phi_{\mathrm{vac}}$ has already earned a line on our band diagrams. In the [capacitance topic](../capacitors/) we drew it in the gap between metal plates, stepping down from each electrode's $V_{\mathrm{e}^-}$ by the work function. The right mental picture is that the vacuum is *one more material*: an insulator with no mobile charges, whose interior potential obeys the Laplace equation $\nabla^2 \phi_{\mathrm{vac}} = 0$, and whose boundary values are dictated by whatever surfaces face it. Drawn that way, it earns its line like any other level.

The trouble begins when the vacuum is promoted from a material to a *reference frame*: a universal zero hovering above the physics, from which all the in-material energies can be hung. This topic is about why that promotion fails. The vacuum level is real, but its writ ends at the surface.

## The vacuum is not flat

Frequently we see energy level charts with 'vacuum level' drawn flat across the top as a zero line, a common reference for different materials. But the vacuum is naturally an electrically inhomogeneous "material": containing no mobile charges, it cannot screen, so it has no mechanism to flatten its own $\phi_{\mathrm{vac}}$. Every conductor sets its surface $\psi$ differently (every metal surface has its own {% wiki "work function" %}), and in between the surfaces, the vacuum level interpolates according to the Laplace equation.

Achieving a flat $\phi_{\mathrm{vac}}$ would require every surface of every body to present the same outer potential: uniform work functions everywhere, and every body carefully charge-neutralized. Aside from that artificially engineered special case, "the vacuum" is many vacuums, with a different $\psi$ at every point of every surface. Retreating to a far-away reference like $\phi_{\mathrm{vac}}(\infty)$ escapes the local mess only by becoming irrelevant, and it can be ill-defined or undefined for an electrochemical device wired to electrodes.

## Nor is $\psi$ a bulk property

Even for a single, perfectly homogeneous bulk material, $\psi$ varies over its surface with contamination, oxidation, crystal facet, roughness, termination, and spontaneous {% wiki "surface reconstruction" %}. We can nail $\psi$ down with heroic surface preparation, but what we have then defined is "what $\psi$ would be for such-and-such surface condition", which is a property of the preparation, no longer of the bulk. A particle deep inside the material does not know or care how well we prepared some distant surface, or whether its host has any exposed surface at all.

Electrochemistry has its own version of this trap. The "solvation energy of an ion" sounds like a bulk handshake between ion and solvent, and one can indeed measure a reproducible energy by dropping an ion from just above a scrupulously clean solvent surface. But the number so obtained is a property of that *surface*, and it offers no route to a universal absolute solvation scale, for the same reason that a work function does not measure a bulk binding energy.

## One vacuum level per species

There is one more distinction to draw, and the diagrams have been quietly begging for it: why do we draw "the" vacuum level as a single line at all? For electrons there is a genuine tie. The convention that an electron at rest in vacuum has energy $E_{\mathrm{e}^-} = -e\,\phi_{\mathrm{vac}}$, its electrostatic energy and nothing more, is so universal that it feels like physics rather than convention ([offsets galore](../offsetsgalore/) tours this bolted-down knob), and thermionic emission and photoemission then genuinely do connect a metal's $V_{\mathrm{e}^-}$ to the vacuum outside across the work function $\Phi$, so that $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$ on the voltage axis.

For ions there is no such collapse. Each ionic species parks at its own rest level in vacuum, offset from $\phi_{\mathrm{vac}}$ by a gas-phase formation energy that our chemical-potential conventions have already fixed: on the voltage axis, a gaseous $\mathrm{Na}^+$ at rest sits near $\phi_{\mathrm{vac}} + 6\ \mathrm{V}$.^[From $V = \phi_{\mathrm{vac}} + \Delta_{\mathrm f}G^\circ/(z_i F)$ with $\Delta_{\mathrm f}G^\circ(\mathrm{Na}^+\!,\mathrm{g}) \approx 574$ kJ/mol.] So "the vacuum level" is really a family, one rung per species, and it collapses onto a single line only for electrons, and only by convention. The idea of work function generalizes accordingly: each species has a well-defined $W_i$, the gap from its in-material $V_i$ up to *its own* vacuum rung.^[The combination $\alpha_i = \bar\mu_i - z_i F \psi$ is sometimes called the "real chemical potential", and the generalized work function is $W_i = \varepsilon_{i,0} - \alpha_i$, where $\varepsilon_{i,0}$ is the species' conventional rest energy in vacuum.] That gap is convention-independent and physically meaningful; the placement of the rungs is bookkeeping.

<figure class="demo-container" style="max-width: 480px">
<div style="border: 2px dashed #bbb; border-radius: 8px; padding: 3em 1.5em; text-align: center; color: #888; font-style: italic">Figure placeholder: per-species vacuum rungs (metal | solution | vacuum)</div>
{% figcaption %}
A metal, an aqueous solution, and the vacuum above them, on one voltage axis. $\phi_{\mathrm{vac}}$ is drawn only in the vacuum region. Each species keeps its own vacuum rung at its gas-phase formation offset (gaseous $\mathrm{Na}^+$ sits about $+6$ V above $\phi_{\mathrm{vac}}$), and each species' work function is the gap from its in-material $V_i$ to its own rung, never to a shared line.
{% endfigcaption %}
</figure>

Even these honest $W_i$ have to be read carefully: a work function is a *surface barrier height*, the cost of stepping just outside one particular surface, and it is easy to mistake for a bulk binding energy. Consider a "[Janus particle](https://pubs.acs.org/doi/10.1021/acs.langmuir.6b01282)" faced with two different metals: its true electron binding energy (ionization energy) is a single number, defined by carrying the electron far away, and it matches neither face's $W$. Likewise, the energy to remove a particle depends on the parent body's total charge, however uniform $\psi$ may be. (The "electron affinity" and "ionization energy" quoted for semiconductor surfaces share this character: they are barrier heights, not binding energies.) Barrier heights describe surfaces; binding energies require the full journey.

## Vacuum contact: a thought experiment that fails

It is [very common](https://www.google.com/search?q="band+diagram"+"vacuum+level"&udm=2) to try to predict material interfaces from a thought experiment of two surfaces approaching each other through vacuum. The story goes:

> Suppose we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat inbetween them and equal to $\psi$ of both bodies. We then bring the materials closer and closer together until their $\psi$ levels *fuse together*. From the contact assumption, we then derive the charge transfer, the degree of semiconductor {% wiki "band bending" %}, or a solution's {% wiki "diffuse layer" %}.

[As argued by R. Tung](https://doi.org/10.1063/1.4858400), the vacuum contact thought experiment basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. What actually happens when materials meet is a detailed chemical bonding process that depends quite sensitively on microscopic details and the specific identities of all atoms involved. In *all* cases there is some kind of atomic-scale rearrangement of atoms, bonds, and charges right at the interface, creating an interface-specific double layer that cannot be predicted from macroscopic observables ($\psi$ included).

(Often the assumption is stated as "the vacuum level is continuous", and drawn as such on band diagrams:

<figure class="demo-container" style="max-width: 300px">
<img src="/esbd/img/vacuum-contact-bad.png" style="max-width:100%"/>
{% figcaption %}
Common naive view of metal-to-semiconductor junction, where electron vacuum energy $E_0 = -e \psi$ is drawn as continuous. [from wikimedia commons user Giulio.galderisi, CC-BY-SA-4.0 license](https://commons.wikimedia.org/wiki/File:Msemictoghandsep.png)
{% endfigcaption %}
</figure>

This is doubly wrong: the outer potential should not be depicted as a bulk level threading through materials, and where it does exist, it is allowed to be discontinuous, because the interface dipole is a new object that neither surface contained.)

The predictions that follow from vacuum contact, the {%wiki "Schottky–Mott rule" %} and {%wiki "Anderson's rule" %}, are eminently testable. In fairness, they often work tolerably in the more ionic materials, many oxides among them.^[The degree of Fermi-level pinning is captured by an interface index $S$ that runs from $0$ (covalent, fully pinned, the rule fails) toward $1$ (ionic, the rule works).] But a rule derived from first principles does not get to choose its materials: measured Schottky barriers on the common covalent semiconductors (silicon, GaAs) are [almost completely decorrelated](http://academic.brooklyn.cuny.edu/physics/tung/Schottky/systematics.htm) from the Schottky–Mott prediction, and semiconductor heterojunction alignment disagrees with Anderson's rule likewise. An exception on that scale disproves the rule: whatever aligns those interfaces, it is not the vacuum levels, and a new interface does not announce in advance which regime it belongs to. The thought experiment retains some pedagogical value for introducing band bending, which truly does occur, but its quantitative alignment claims cannot be trusted in advance, and they regularly appear in the literature as unstated assumptions. Materials are not legos: a vacuum surface is one kind of interface with its own special considerations, and a material-material junction is another.

## What vacuum reasoning is for

Vacuum levels are excellent at their actual job, which is the physics of surfaces facing vacuum: thermionic emission, photoemission and work-function spectroscopy, {% wiki "Kelvin probe" %} measurements, charged-particle optics in the space between surfaces. In all of these, $\psi$ and $\phi_{\mathrm{vac}}$ are exactly the right variables.

The famous "absolute" electrode potential belongs on this list. The widely-quoted $4.44\ \mathrm{V}$ for the standard hydrogen electrode^[From Farrell & McTigue's measurements as interpreted by Trasatti; the procedure quietly splits a mean activity coefficient evenly between the ions to locate "the SHE." See also Hees & Zhang, [doi:10.1021/acs.jpclett.4c02923](https://doi.org/10.1021/acs.jpclett.4c02923), on the link to an "ionic work function."] is best read as an electrode's work function: a legitimate, useful *surface* property, drifting with surface preparation and contamination like any other work function, and no more a universal zero than any other rung. [The reference-electrodes topic](../references/) shows where it sits on a cell diagram.

If simulation is your business, the same rule applies: a computed $\psi$ is only as meaningful as the modelled surface, so state the surface. (The vacuum contact story, at least, is something molecular simulation refutes all by itself.)

In the end, the textbook hierarchy is upside down. Through our wires, power supplies, and voltmeters, it is the Fermi level $V_{\mathrm{e}^-}$ that is directly accessed and controlled; the vacuum levels draped over every surface are a secondary, dependent field, following from the materials and their surface conditions. If you need a reference, anchor to the wire, not to the sky.

## Takeaways

The vacuum potential is the one honest electrostatic potential: unsmoothed, measurable, and felt identically by test charges and real charges. It is also honest about what it is, namely a property of particular surfaces and of the space between them. It is not flat, it is not a bulk property, every charged species carries its own vacuum rest level, and interfaces formed by contact owe it nothing (as the failures of the Schottky–Mott and Anderson rules attest). Use $\psi$ for vacuum-facing physics; for everything in-material, anchor to the $V_i$ of a wire you can actually touch.

[**NEXT TOPIC: Inhomogeneities and electrostatics**](../inhomog/)
