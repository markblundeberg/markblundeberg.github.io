---
layout: layouts/esbd_topic.njk
title: 'Basic electrostatics'
tags: [page, esbd_topic]
orderESBD: 25
---

# {{title}}

The [previous topic](../bipolar/) left a question hanging: what sets the width and shape of the depletion zone at a p-n junction or bipolar membrane, that sliver where the $V^\circ_i$ ladder bends and neutrality locally breaks?

While the $V_i$ values want to flatten out for thermodynamic reasons, the same is not necessarily true of the $V^\circ_i$. To explain why $V^\circ_i$ might be flat (or not) at equilibrium, we finally have to open up the actual mechanics of electricity, kept offstage until now. The crucial point is that the $V^\circ_i$ ladder's spatial variations are (usually) equal to variations in the electrostatic potential $\phi$, and electrostatics ties variations in $\phi$ to charge. Bends in the ladder are therefore statements about charge.

## $V^\circ_i$ as an agent of electrostatic screening

We have mentioned a few times that $\phi$ is generally ambiguous, but in the special case where we are inside an ideal material it does perfectly follow along with $V^\circ_i$. So there, at least, we can confidently discuss electrostatics. Specifically, within each material, $V^\circ_i$ variations are also variations in $\phi$, so their gradients are equal (and equal the negative of electric field):

$$ \vec E = -\nabla\phi = -\nabla V^\circ_i. $$

Accordingly, inside each material, the $V^\circ_i$ ladder follows a {% wiki "Poisson equation" %}, Gauss's law combined with the constitutive response of the background dielectric medium:^[This form of the Poisson equation only applies inside a reasonably well behaved medium. As we'll see [later on](../inhomog/), it necessarily breaks in nonideal solutions, at interfaces, in graded media, and in strong electric fields.]

$$ - \varepsilon \nabla^2 V^\circ_i = - \varepsilon \nabla^2 \phi = \rho_{\mathrm{free}}, $$

where $\varepsilon$ is the material's background permittivity and $\rho_{\mathrm{free}}$ is the space charge density of the mobile carriers (plus any fixed charges). But as we saw in the [charge neutrality topic](../charge_neutrality/), $\rho_{\mathrm{free}}$ is itself a function of the $V^\circ_i$ offset. This closes a feedback loop: any deviation of $\phi$ from its neutral point summons a charge that pushes it back, which is {% wiki "electrostatic screening" %}.

One of the beautiful things about band diagrams is the perspective they give on screening: the $V_i$ are flat, and all the action sits in the ladder, where charge appears exactly as curvature of $\phi$ or $V^\circ_i$:

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-es-defect.njk" %}
{% figcaption %}
A sharp charged defect introduced inside a conductor (here a salt solution), and the mobile carriers moving in to cancel it: the whole $V^\circ_i$ ladder bulges with $\phi$ over a screening length while the $V_i$ ride flat (the bulge is exaggerated for visibility). Below, the defect's own charge and the equal-and-opposite screening cloud it gathers.
{% endfigcaption %}
</figure>

In fact, we already plotted the engine of this feedback loop back in [charge neutrality](../charge_neutrality/); here is its central figure again, now carrying a second meaning:

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/levels-cc-neutrality.njk" %}
{% figcaption %}
A multi-ion solution with every $V_i$ pinned, and below, the net charge as a function of the $V^\circ_i$ ladder offset. Note that unlike this topic's other charge plots, the horizontal axis here is not position but the offset itself. Last time, the ladder slid along this curve to find its zero; read it now as the feedback loop's spring, handing back a countering charge whenever $\phi$ strays from the neutral crossing. Its slope at the crossing is precisely the screening capacitance $\chi$ defined next.
{% endfigcaption %}
</figure>

The **screening length** $\lambda$ sets how far the screening tail reaches into the neutral bulk:

$$\lambda = \sqrt{\varepsilon/\chi},$$

where $\chi = -\mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ is a "screening capacitance"^[The per-species pieces of $\chi$ are the "chemical capacitances" of Jamnik and Maier's transport circuits: J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001). They get a proper introduction, under the name *internal chemical capacitance*, in the [next topic](../capacitors/).] measuring how strongly the space charge pushes back as $\phi$ deviates from the neutral point (the slope at the neutral crossing just plotted). For ideal-dilute ions, electrons, or holes, $\chi$ is a sum of contributions from each species: $\chi = \sum_i z_i^2 F^2 c_i/(RT) $, which is exactly proportional to the {% wiki "ionic strength" %} and the resulting $\lambda$ is known as the {% wiki "Debye length" %}.

(The approach here of flat $V_i$ (flat-$\bar\mu_i$) is a very intuitive and direct yet underappreciated way of deriving the screening equation for ideal-dilute ions, which is known as the {% wiki "Poisson–Boltzmann equation" %}. The ladder-moving feedback figure above is literally the "Boltzmann" part of it. In ideal Fermi gases this extends to {% wiki "Thomas–Fermi screening" %}, where the Boltzmann charging curve gets swapped out for a new quantum-derived curve, and otherwise it works the same.^[For a Fermi gas, the $\rho_{\mathrm{free}}(\phi)$ curve is no longer a sum of exponentials. The screening length is still $\lambda = \sqrt{\varepsilon/\chi}$ but $\chi = -\mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ now relates to density of states and is called {% wiki "quantum capacitance" %}. In the case of a zero temperature Fermi gas, $\lambda$ is called the {% wiki "Thomas–Fermi screening", "Thomas–Fermi length" %}.])

## Diffuse layers are band bending

So far our screening charge has answered a defect buried in the bulk. The far more common provocation is an interface: nearly every real surface or contact nudges $\phi$ somehow (adsorbed charges, surface states, or simply contact with a different material), and the medium answers with the same screened response, a charge tail decaying according to the same screening length $\lambda$ defined above. Electrochemists know this tail as the diffuse (Gouy–Chapman) part of the {% wiki "electric double layer" %}. Semiconductor physicists know the very same object as **band bending**: near a contact the band edges bend together while $V_{\mathrm{e}^-}$ runs flat. Two vocabularies, one picture:

<figure class="demo-container" style="max-width: 700px">
{% include "esbd-diagrams/esbd-es-interface.njk" %}
{% figcaption %}
The same event in two media: something at the surface nudges $\phi$ away from its bulk neutral value, and the deviation is screened away into the interior. In the semiconductor the band edges bend together, the namesake band bending; in the salt solution the $V^\circ_i$ rungs do exactly the same, the electrochemist's diffuse layer. The carrier voltages ride flat in both, these being equilibria still. Below each panel, the same charge pair: the nudging surface charge and the equal-and-opposite screening tail answering it.
{% endfigcaption %}
</figure>

## Quasi-neutrality: a simplification of electrostatics

That is the heart of the electrostatics, and the good news is that we can mostly ignore it! This is due to the practical principle of **quasi-neutrality**:

> <p align="center"><b>Quasi-neutrality principle</b><br/>"screening is very very strong"</p> 
>
> **In most conductors, the screening length $\lambda$ tends to be small (nanometres in metals and concentrated electrolytes, though reaching microns in lightly doped semiconductors or dilute solutions), so on sensible macroscopic length scales the system is usually *almost* exactly neutral everywhere.**
>
> Corollary: **the concentration of mobile charge carriers needed to produce a gradually varying $\phi$ is a tiny and negligible fraction of the total carrier concentration.**

There are exceptions to this: capacitors, field-effect transistors, and nano-devices all rely on electrostatics. But even for those devices, the bulk majority of the conducting system is neutral and only a tiny region deviates from neutrality.

Many interfaces in our devices are explicitly *not* of interest, yet each one carries its diffuse double layer all the same. One of the advantages of using electrochemical potentials like $V_i$ is that they 'ride flat' over this local craziness in $V^\circ_i$, so we can skip right over interfaces that are equilibrated.

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-es-blips.njk" %}
{% figcaption %}
The honest picture of a bulk solution between a metal electrode and vacuum: everything is flat except tiny double-layer blips of $V^\circ_i$ within a few Debye lengths of each surface. The $V_i$ ride flat straight over them, which is why, for the most part, we won't bother drawing the blips at all. The lower panel shows where the charge actually sits: two wall-hugging double layers, zero everywhere else. This is quasi-neutrality, drawn literally. (The step down to $\phi_{\mathrm{vac}}$ is compressed, like the rung spacing (⌇), to keep everything in one frame.)
{% endfigcaption %}
</figure>

The quasi-neutrality idea also gets applied out of equilibrium, in dynamic situations. For example, if you drive a current from a low-resistivity region to a high-resistivity region, you create a step in the electric field, but a step in electric field means some local charge accumulated at the interface. Yet we almost never talk about this charge, because (except at high frequencies or low conductivities, which show {% wiki "Maxwell–Wagner–Sillars polarization", "Maxwell relaxation" %}) it is often negligible. Note however that the dynamic quasi-neutrality is distinct from the spatial quasi-neutrality described above: there, deviations from neutrality occupy negligible space; here, any accumulating charge relaxes away on the dielectric relaxation time $\varepsilon/\sigma$, too fast for slow dynamics to notice.

<figure class="demo-container" style="max-width: 440px">
{% include "esbd-diagrams/esbd-es-kink.njk" %}
{% figcaption %}
Current driven from a low-resistivity region into a high-resistivity one: $V_{\mathrm{e}^-}$ kinks at the interface, and $\phi$ kinks right along with it. The kink in the field implies a little static charge parked at the interface: real, but negligible.
{% endfigcaption %}
</figure>

## $V^\circ_i$ as a perfect neutralizer

As a convenient approximation, we can simply 'assert' local neutrality almost everywhere. Mathematically, we do this indirectly by sending $\varepsilon \rightarrow 0$, which converts the Poisson equation into the **local electroneutrality approximation**:^[Newman & Balsara (2021), *Electrochemical Systems*.]

$$
\begin{aligned}
0 & = \rho_{\mathrm{free}}, \\
\lambda & = 0, \\
\phi & = \text{anything}, \\
\end{aligned}
$$

that is, there is no longer any constraint on the derivatives of $\phi$, and so $\phi$ at every point can independently 'float' to produce $0 = \rho_{\mathrm{free}}$.^[Note that we do not set $0 = \rho_{\mathrm{free}}$ outright (with $\varepsilon \neq 0$), which would imply $\nabla^2 \phi = 0$, which is in general not true in conductors and is only true in insulators. Somewhat confusingly though $\nabla^2 \phi = 0$ *can* occur in conductors for a totally unrelated reason within regions of homogeneous bulk transport, i.e. due to $\phi$ following $V_i$ and $\nabla \cdot \vec J_i = - \sigma \nabla^2 V_i = 0$, which has nothing to do with the Poisson equation! See also Newman *Electrochemical Systems* section 11.8 "Electroneutrality and Laplace's equation".]

So, our $V^\circ_i$ ladder floats to whatever value neutrality demands. In a homogeneous medium where the $V_i$ are flat (as they must be at equilibrium), $V^\circ_i$ must be flat too, except at its surfaces (within a few Debye lengths). This is the footing under the neutrality we assumed in the [charge neutrality topic](../charge_neutrality/).

## Interfaces: aligning two materials

Everything so far has concerned a single medium. The moment two different materials touch, a question appears that the rest of the book has quietly been assuming an answer to: how do their $V^\circ_i$ ladders line up? This is the essential interfacial question, and at the basic level the answer is electrostatic.

At equilibrium, charge rearranges into thin double layers on either side of the contact until any carrier that can cross has equalized its $V_i$. What is left is an offset between the two ladders: a built-in step in $\phi$, fixed by the interface. The bulk-to-bulk alignment is tied to the alignment right at the contact through the screening on each side: the double layers absorb the transition within a Debye length or so, and however much each side bends, the deep bulks settle at a fixed relative offset.

The useful part is what happens when the two sides screen very differently. A strongly screening material (a metal, $\lambda \to 0$) barely bends at all, so its level is effectively rigid right up to the interface and the weakly screening side does all the accommodating. The alignment then anchors to the strong screener's $V_i$. This is exactly why everything at a metal is referenced to its $V_{\mathrm{e}^-}$: the {% wiki "Schottky barrier" %} height and the work function are both just "where the other phase's level sits relative to the metal's $V_{\mathrm{e}^-}$." The same rule, with gentler asymmetry, is behind the Donnan step of [charge neutrality](../charge_neutrality/) and the band offsets of semiconductor heterojunctions (below).

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-es-hetero.njk" %}
{% figcaption %}
A heterojunction between two n-type semiconductors, at equilibrium. The edge gap right at the contact (the ↕ marker) is a fixed property of the atomic interface: no doping moves it. The far bulks, meanwhile, settle wherever their dopings put them relative to the shared flat $V_{\mathrm{e}^-}$, and band bending absorbs the mismatch, split toward whichever side screens more weakly. Crank one doping to the maximum and that side goes rigid, metal-like, right up to the contact: the Schottky picture emerges as the limiting case. Below, the contact's double layer, drawn to true shape and relative magnitude. Side A depletes, and its exposed donors form the textbook boxcar: a flat-topped slab at the dopant density, rounded off by a diffuse tail into the bulk. Side B piles up carriers in a spike so dense and thin that it runs off the frame; its area still cancels the slab's exactly, however the sliders sit.
{% endfigcaption %}
</figure>

Predicting the *size* of that offset from scratch is a separate and much harder problem, which we will not attempt; the popular shortcut of lining materials up by a shared vacuum level is a rule of thumb that is [notoriously unreliable](../vacuum/), since every interface carries its own dipole. But the size is just one number. The *structure* of the alignment (electrostatic, screening-mediated, anchored to the stronger screener) is the essential part, and it is what lets the rest of this book draw interfaces at all.

There is one more thing to notice here: this is precisely where $\phi$ runs out of meaning. The figure draws the conduction edges, and their step at the contact is a definite, fixed number; the valence edges would take a *different* step at the same contact (the two offsets differ by the band-gap difference). A junction between two media has band offsets, plural, one per species, and none of them is "the" electrostatic step. The liquid version of this fact already appeared at the [ITIES](../charge_neutrality/), where each ion's rung steps by its own transfer energy; it is why no liquid junction potential can be defined between two different solvents. Within one medium the distinction never bit, since following $\phi$ just meant following the ladder; between two different media only the per-species offsets remain, and $\phi$ names nothing. The full autopsy is deferred to [$\phi$ under the microscope](../phi/).

## Beyond the simple case

It's worth noting what a blessing it is to have the quasi-neutrality principle, and how complicated things can get when we can't rely on it.

The full catalog of what can go wrong is banked in [its own appendix](../inhomog/): patchy and charged interfaces, graded media and their quasi-electric fields, nano-scale conductors that are all interface, constitutive relations beyond any effective $\varepsilon$, and the eventual breakdown of the local continuum picture itself.

All of those concerns are real and important when describing interfaces, especially interface kinetics and interface capacitance. And there is a huge engineering importance: as Herbert Kroemer said, "the interface is the device". But interfaces are always connected to bulky reservoirs, and the vast majority of those bulk regions in our devices and circuits are quasi-neutral, which means electrostatics can be largely ignored inside them and we only need to worry about the $V_i$ values (with $V^\circ_i$ acting as a mere neutralizer, as described above).

## Takeaways

Electrostatics entered our picture mainly to justify leaving it out: screening is so strong that almost everywhere, the $V^\circ_i$ ladder simply floats to whatever offset keeps the bulk neutral, while the $V_i$ ride flat over the interfacial blips. Where two materials meet, the same screening decides how their ladders align, anchored to whichever side screens more stiffly.

The exceptions are narrow, and they are readable. Wherever the ladder does bend, the bend is paid for in charge — curvature of $V^\circ_i$ *is* local charge density, by the Poisson equation — and the payment always arrives in equal-and-opposite pairs a screening length apart: a defect and its cloud, a surface charge and its screened answer, the two lobes of a contact's double layer. That is what the charge panels under this topic's figures draw, and that read is worth keeping: the bends of a band diagram are a map of its charge. The screening length $\lambda = \sqrt{\varepsilon/\chi}$ says how far each bend reaches, and the response $\chi$ that sets it has a second life: read as charge banked against a voltage, it is a capacitance, which is where we turn next.

[**NEXT TOPIC: Capacitance**](../capacitors/)
