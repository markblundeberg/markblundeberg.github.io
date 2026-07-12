---
layout: layouts/esbd_topic.njk
title: 'Band Diagrams for Batteries'
tags: [page, esbd_topic]
orderESBD: 1
eleventyNavigation:
    key: ESBD
---

# Band Diagrams for Batteries<br/><small>An Electrochemical Visualization</small>

<p class="epigraph">A semiconductor physicist wanders into electrochemistry and refuses to leave without a band diagram.</p>

<p class="byline">Mark Lundeberg // July 2026</p>

<p class="lede">What is the electrical state deep inside of a battery?</p>

If we try to visualize this by plotting voltage versus position, we immediately run into a mystery. We know the voltage at the anode (negative terminal) and the cathode (positive terminal), but what about the electrolyte in between?

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/bd-basicbattery-voltage-missing.njk" %}
</figure>

What are we supposed to draw in place of the '???'? A straight line? A sudden jump? Why doesn't the current just flow backwards?^[Ed Fontes (2015), COMSOL Blog: ["Does the Current Flow Backwards Inside a Battery?"](https://www.comsol.com/blogs/does-the-current-flow-backwards-inside-a-battery). Fontes opens with this same puzzle, and makes the conventional move of drawing the inner electrostatic potential $\phi$. We are going to explore an alternative answer that is (in my opinion) far more thermodynamically satisfying.] The mystery deepens when we try to understand more complex situations: how can we visualize the voltage drops from internal resistance during battery discharge?

These questions turn out to have a head-smackingly simple answer. One that, oddly, nobody seems to draw, even though it requires no new physics at all. The thermodynamics involved is textbook material;^[Newman & Balsara (2021), *Electrochemical Systems*.] what's been missing is a good way to picture it. Below, we'll take a brief scenic route to the new picture: two motivating false starts, then one small trick that snaps everything into focus.

## Electrons: an incomplete picture

Semiconductor physicists are used to understanding everything in terms of electronic energies, and we use the term "{%wiki "Band diagram", "energy band diagram" %}" to refer to a plot of electronic energies vs. position. These band diagrams are the primary visual and pedagogical tool for showing what is happening, thermodynamically, inside semiconductor devices. What happens, then, when we try to represent a battery with a regular band diagram?

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/bd-basicbattery-energy-missing.njk" %}
</figure>

We still have a missing middle! We can be more precise and say _the middle is undefined_: a good battery electrolyte contains no mobile electrons to define an energy level for^[A redox-savvy electrochemist will object that we can still *mark* an electron level in the electrolyte: the level implied by a redox couple, in the manner of Gerischer. That is a genuinely good answer, and no accident: in this battery, the level implied by the $\mathrm{Li}^+/\mathrm{Li}$ couple will turn out to plot as the very same line we are about to construct by other means (see [Half-reactions](half/)). These are however not *occupied* electron levels in the semiconductor, mobile-electron sense.] (by design, otherwise the electrons would just short the battery internally).

The quantity we just plotted, $\bar\mu_{\mathrm{e}^-}$, is the {% wiki "electrochemical potential" %} of electrons, also known as the {% wiki "Fermi level" %}. It is exactly what a voltmeter senses: a reading between two terminals is $\Delta V = \Delta\bar\mu_{\mathrm{e}^-}/(-e)$, where $-e$ is the electron charge. Now, notice that band diagrams already drop a $\Delta$ on the right-hand side, drawing $\bar\mu_{\mathrm{e}^-}$ as a curve and shrugging off its arbitrary overall offset. Let's do the same on the left, and give every point an electronic voltage: $V_{\mathrm{e}^-} = \bar\mu_{\mathrm{e}^-}/(-e)$. Our energy band diagram is quite literally an upside-down voltage diagram. Flipping it back upright, we can answer our opening puzzle as directly as a semiconductor physicist knows how:

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/bd-basicbattery-voltage-missing-clarified.njk" %}
</figure>

That unsatisfying blank is real information: the diagram is telling us that electrons are simply not the whole story inside a battery.

Nobody is happy to stop here, of course. To paraphrase Herbert Kroemer: "if you don't draw a band diagram, then nobody knows what you're talking about".^[[H. Kroemer (2000). Nobel Lecture.](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf)] So band diagrams for batteries get drawn regardless, and they are often full of irrelevant or even unphysical ideas,^[Peljo, P., & Girault, H. (2018). [Electrochemical potential window of battery electrolytes: the HOMO–LUMO misconception.](http://dx.doi.org/10.1039/C8EE01286E) Energy Environ. Sci., 11, 2306-2309.] decorations invented to fill exactly this blank. Let's fill it with something real instead.

## Including the ions: awkward energies

In a lithium-ion battery, the other mobile charge carriers are of course the $\mathrm{Li}^+$ ions. Why shouldn't we treat the lithium ions on equal footing? After all, the lithium ion has a perfectly well-defined electrochemical potential of its own: $\bar\mu_{\mathrm{Li}^+}$.

Let's draw it in:

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/bd-basicbattery-energy-ion-too.njk" %}
</figure>

Fantastic, we have filled the gap and closed the circuit! And, we can visualize how during charging or discharge, there is a gradient in $\bar\mu_{\mathrm{Li}^+}$ showing internal resistance. Note that $\bar\mu_{\mathrm{Li}^+}$ does extend into the electrodes themselves, representing the mingling of electrons and lithium ions inside the active materials: graphite (anode) and {% wiki "Lithium iron phosphate", "lithium iron phosphate" %} (cathode), which make this a ~3.3 V cell.

This joint accounting of $\bar\mu_{\mathrm{e}^-}$ and $\bar\mu_{\mathrm{Li}^+}$ is, in fact, the thermodynamic backbone of the industry-standard Doyle–Fuller–Newman battery modeling, and as mathematical bookkeeping it is flawless.^[Goyal and Monroe ([2017 J. Electrochem. Soc. 164 E3647 "New Foundations of Newman’s Theory for Solid Electrolytes"](https://dx.doi.org/10.1149/2.0611711jes)) provide a modern perspective on this model.]

But our naive visualization of it has a serious flaw: if we change the overall electrostatic offset of the system (try moving the slider), the energy levels for the electron and the ion move in opposite directions because of their opposite charges. This breaks a key principle of band diagrams: the absolute vertical position is arbitrary, and only the *differences* between levels should have physical meaning. Yet here, the most prominent feature of the plot, the wide gap between the electron and ion levels, is exactly what the arbitrary offset controls. The diagram invites the eye to read a distance that means nothing. We will see it get even worse in the multi-cell battery further down this page, where the two levels splay farther apart with every added cell.

Just one more small but crucial tweak is needed...

## The $V_i$ solution

We saw that electronic voltage is $V_{\mathrm{e}^-} = \bar\mu_{\mathrm{e}^-}/(-e)$. Why not just generalize this to ions as well?

$$ V_i = \frac{\bar\mu_i}{q_i}, $$

where $q_i$ is the charge of the species: $-e$ for electrons, $+e$ for lithium ions, and so on for any kind of charge carrier. I call this quantity $V_i$ the **species voltage**.^[The 'species voltage' name is my coinage, but the quantity itself has an honourable history. J. Jamnik and J. Maier ([Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001)) rescale every electrochemical potential by its carrier's charge (their $\tilde\mu^*_i$ is exactly our $V_i$) and wire up equivalent circuits between an "ionic rail" and an "electronic rail" that carry these voltages, lithium-ion battery included. What they never quite do is plot the rails as curves versus position; that last small step is the launching-off point of this book. See [About](about/) for a fuller history.]

> **Chemistry units**: In chemistry, we work with molar quantities, so $\bar\mu_i$ would be in joules/mol and $q_i$ in coulombs/mol. In that case, $q_i = z_i F$ where $z_i$ is the charge number (&minus;1, +1, +3, etc.) and $F$ is the {%wiki "Faraday constant" %}. Either way, the final quantity $V_i$ is a voltage measured in volts (V).

Let's re-plot our battery with this new representation. These diagrams deserve a name: **electrochemical species band diagrams (ESBDs)**.

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/bd-basicbattery-voltage-esbd.njk" %}
</figure>

Try the offset slider again: now everything shifts together as one rigid ladder, and nothing the eye can measure changes.

Here we can finally see how the battery works, and our opening question has its answer: the electrical state deep inside a battery is a landscape of ionic voltages! Two features deserve a closer look. First, the step $V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$ on each side has a very specific meaning: it measures how tightly that electrode binds (neutral) lithium atoms, and the cathode binds them far more tightly. Second, slide the current away from equilibrium and the internal resistance appears beautifully as a 'lithium voltage drop'; the plain linear ramp is a simplification, but it gets at the heart of the matter. We dig into lithium-ion internals properly [later on](lib/).

A multi-cell battery makes the contrast stark. In the raw energy picture (left), the electron and ion levels splay farther apart with every added cell; as species voltages (right), they climb the stack together, rung by rung:

<figure class="demo-container" style="max-width: 700px">
{% include "esbd-diagrams/bd-basicbattery-multicell.njk" %}
</figure>

So what have we gained? In the $V_i$ picture, electrons and ions enter as equals: one line per charge carrier, all on a single voltage axis. Charge transport reads off the slopes, with positive carriers sliding from high $V_i$ to low and negative carriers from low to high. Electrochemical reactions read off the vertical gaps, as well-defined differences like $V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$. And the whole construction speaks the hands-on language of electronics: volts.

Nor is any of this a bookkeeping fiction. The $V_i$ are real voltages: directly measurable for electrons, and measurable through ion-reversible electrodes for ions. Each level *is* an electrochemical potential, rescaled, so the diagram directly displays the fundamental thermodynamics of every charged species. Notice too that we built the complete picture without once invoking the practically inaccessible in-material electrostatic potential $\phi$; nor is the ladder just $\phi$ in disguise, since it spends strictly fewer arbitrary conventions ([Offsets galore](offsetsgalore/) keeps score). And there is more where this came from: we will see ionic standard states appear as reference levels $V_i^\circ$, playing the part of semiconductor band edges.

In the next few topics we dig a little deeper into how $V_i$ works.

[**NEXT TOPIC: Species voltage**](v_i/)

## Explore more

Intrigued? The battery was only the first example. The same picture serves electrode kinetics, bipolar membranes and pn junctions, solid-state ionics, and semiconductors, and it keeps working away from equilibrium (quasi-Fermi splitting, concentration polarization, redox disequilibrium) where static textbook pictures give out. Every topic below is built on interactive diagrams.

{% include "esbd_topic_list.md" %}
