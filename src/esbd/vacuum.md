---
layout: layouts/esbd_topic.njk
title: 'A warning about vacuum levels'
tags: [page, esbd_topic]
orderESBD: 98
eleventyNavigation:
    key: A warning about vacuum levels
    parent: ESBD
    order: 998
---

# {{title}}

It is common to see discussions of material interfaces that involve the concept of 'vacuum level', that is, either the electrostatic potential $\phi_\mathrm{vac}$ just outside a surface, or the electrostatic energy $-e \phi_\mathrm{vac}$ that would be felt by an electron in that position (assuming near-surface image forces are irrelevant). Sometimes 'the vacuum' is treated as an objective reference, and sometimes we make a thought experiment of creating a material interface by bringing the two materials together gradually, sometimes the vacuum level is somehow even brought into a material.

I would like to provide a warning that **any reference to vacuum level is fraught with error, usually misleading, and at best a gross approximation, when it comes to analyzing most in-material phenomena**.

Of course, the vacuum level is super important where it comes to actual surface-vs-vacuum phenomena: work function, thermionic emission, Kelvin probe. And let's be generous: the notion of vacuum level and $\phi_\mathrm{vac}$ does retain a decent meaning even for spaces that aren't filled with literal vacuum, but might even contain dilute gases and dilute weakly ionized plasmas. We can talk confidently about the ionization energies and electron affinities of dilute atoms that are effectively isolated. But that's about it.

## "The vacuum" is inhomogeneous and messy, and a terrible reference point

Even when you are considering a single material, the level $\phi_\mathrm{vac}$ is going to vary spatially and from sample to sample depending on surface contamination, accidental static charges, crystal orientation, and the atomic surface reconstruction. When you put multiple materials nearby each other, it only gets worse.

Usually this is recognized, so there is an attempt to fix this by referring to 'vacuum infinitely far away' as a reference point, to escape the local mess. But this gets quite abstract, as now the reference is totally unrelated to the materials in question. At that point you might as well not name any reference. If a reference is needed, then the electronic Fermi level itself (in a specific conducting object, such as a ground wire) is truly the best reference point.

Conceptually, it also gets things backwards. We should not think of Fermi levels as abstract floating quantities that depend on surface charge. Rather, through our wires, power supplies, and voltmeters, it is the Fermi level which is the first-class object that can access, and the vacuum levels are a secondary dependent field.

For electrochemistry, the concept of 'solvation of an ion' considers taking an ion in vacuum and dropping it into a solvent. It sounds so simple, but the above discussion makes it clear that the enthalpy of this process will depend sensitively on both where the ion started in vacuum and the electrochemical state inside the solvent. We can nail this down however: laboriously prepare a truly pure solvent surface (free of the contaminants that love to invisibly adsorb at surfaces) and drop the ion from just above it, you will measure a reliable solvation enthalpy for that solvent _surface_. Yet, what you have measured is still a surface property, that depends on how that particular pure solvent decides to set its local $\phi_\mathrm{vac}$. And in particular, it will offer you no insight into creating a universal absolute solvation enthalpy scale that you can use to predict solvent-solvent interfaces; that gets into the next topic, of contact potentials.

## Contact potentials: a misleading thought experiment

The usual thought experiment [goes as follows](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html): we have two uncharged materials floating in vacuum some distance apart. Since they are uncharged, $\phi_\mathrm{vac}$ is flat everywhere. They in general will have different work functions, so the Fermi levels will differ. We then bring the materials together and once they touch, the Fermi levels will equalize by moving charges, creating a double layer of charge (and therefore a jump in electrostatic potential). Therefore there will be a "contact potential" given by the initial difference in Fermi levels.

One problem with this thought experiment is that it neglects the actual microscopic interactions that would occur near and at contact. [As argued by R. Tung](https://doi.org/10.1063/1.4858400), it basically supposes that the two materials come together without any interaction, in a weird unphysical sort of superposition. As a result, the vacuum contact idea gives wildly incorrect predictions, such as the {%wiki "Schottky–Mott rule" %} for the actual double-charge layer in a junction.

Another misleading outcome from this thought experiment is the [contact potential "EMF" idea](https://www.uni-konstanz.de/FuF/Physik/Jaeckle/papers/thermopower/node4.html), which is a common misexplanation for thermoelectricity.

Once you include the bonding, it typically invalidates any prediction based on vacuum levels. Sometimes it is argued that the final electrostatic state is a modification on top of the naive vacuum contact. From my point of view, you might as well discard the vacuum contact result and focus on the proper result.
