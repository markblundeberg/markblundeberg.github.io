---
layout: layouts/esbd_topic.njk
title: 'Basic electrostatics'
tags: [page, esbd_topic]
orderESBD: 25
---

# {{title}}

The [previous topic](../bipolar/) left a question hanging: what sets the width and shape of the depletion zone at a pn junction or bipolar membrane, that sliver where the $V^\circ_i$ ladder bends and neutrality briefly breaks?

While the $V_i$ values want to flatten out for thermodynamic reasons, the same is not necessarily true of the $V^\circ_i$. To explain why $V^\circ_i$ might be flat (or not!) at equilibrium, we have to finally dip into the actual mechanics of electricity. Somewhat surprisingly, we have managed to dance around the actual electrostatic nature of electricity until now!

We can now briefly step into electrostatics to explain *why* $V^\circ_i$ wants to move to neutrality. The crucial point is that the $V^\circ_i$ ladder's spatial variations are (usually) equal to variations in the electrostatic potential $\phi$, and from electrostatics we know that variations in $\phi$ come from variations in charge. So, variations in $V^\circ_i$ must be related to variations in charge.

## $V^\circ_i$ as an agent of electrostatic screening

We discussed that $\phi$ is generally ambiguous, but in the special case where we are inside of an ideal material it does at least perfectly follow along with $V^\circ_i$. So we can confidently discuss electrostatics in this special case at least. Specifically, within each material, $V^\circ_i$ variations are also variations in $\phi$, so their gradients are equal (and equal the negative of electric field):

$$ \vec E = -\nabla\phi = -\nabla V^\circ_i. $$

Accordingly, inside of each material, the $V^\circ_i$ ladder follows a {% wiki "Poisson equation" %}, which is a consequence of a constitutive relation of the background dielectric medium:^[This form of the Poisson equation only applies inside of a reasonably well behaved medium. As we'll see later on, it necessarily breaks in non-ideal solutions, at interfaces, in graded media, and in strong electric fields.]

$$ - \varepsilon \nabla^2 V^\circ_i = - \varepsilon \nabla^2 \phi = \rho_{\mathrm{free}}, $$

where $\varepsilon$ is the material's background permittivity and $\rho_{\mathrm{free}}$ is the space charge density described above. But as we saw in the [charge control topic](../charge_control/), $\rho_{\mathrm{free}}$ is itself a function of the $V^\circ_i$ offset! This creates a natural feedback loop: the result of this equation is that any deviation of $\phi$ from its neutral point is going to be naturally suppressed, which is {% wiki "electrostatic screening" %}.

One of the beautiful things about band diagrams is the perspective they give on screening: the $V_i$ are flat, and the accumulation of charges is purely due to the variation in $\phi$ or $V^\circ_i$, known as **band bending** in semiconductors:

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-es-defect.njk" %}
{% figcaption %}
A sharp charged defect introduced inside a conductor (here a salt solution), and the mobile carriers moving in to cancel it: the whole $V^\circ_i$ ladder bulges with $\phi$ over a screening length while the $V_i$ ride flat. Below, the defect's own charge and the equal-and-opposite screening cloud it gathers.
{% endfigcaption %}
</figure>

<figure class="demo-container" style="max-width: 440px">
{% include "esbd-diagrams/esbd-es-interface.njk" %}
{% figcaption %}
Band bending: something at an interface nudges $\phi$ away from its bulk neutral value, and the deviation is screened away into the bulk. Drawn for an n-type semiconductor, where the effect got its name — the band edges bend together while $V_{\mathrm{e}^-}$ stays perfectly flat, this being still an equilibrium.
{% endfigcaption %}
</figure>

The **screening length** $\lambda$ describes the length scale of the 'tail' of exponential decay of screening into the neutral bulk:

$$\lambda = \sqrt{\varepsilon/\chi},$$

where $\chi = -\mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ is a "total chemical capacitance"^[The per-species pieces of $\chi$ are the "chemical capacitances" of Jamnik and Maier's transport circuits: J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001). They get a proper introduction in the [next topic](../capacitors/).] measuring how strongly the space charge pushes back as $\phi$ deviates from the neutral point. For ideal-dilute ions, electrons, or holes, $\chi$ is a sum of contributions from each species: $\chi = \sum_i {q_i}^2 c_i/(RT) $, which is exactly proportional to the {% wiki "ionic strength" %} and the resulting $\lambda$ is known as the {% wiki "Debye length" %}.

(Mathematically, this screening with flat $V_i$ and ideal-dilute ions or electrons is known as the {% wiki "Poisson–Boltzmann equation" %}. The approach here of flat $V_i$ (flat-$\bar\mu_i$) is a very intuitive and direct yet underappreciated way of deriving said equation. In ideal Fermi gases this is known as {% wiki "Thomas–Fermi screening" %} and the exact expressions differ slightly but the concepts are largely the same.^[For a Fermi gas, the $\rho_{\mathrm{free}}(\phi)$ curve is no longer a sum of exponentials. The screening length is still $\lambda = \sqrt{\varepsilon/\chi}$ but $\chi = -\mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ now relates to density of states and is called {% wiki "quantum capacitance" %}. In the case of a zero temperature Fermi gas, $\lambda$ is called the {% wiki "Thomas–Fermi screening", "Thomas–Fermi length" %}.])

## Quasi-neutrality: a simplification of electrostatics

The above concludes our discussion of electrostatics for now, because we usually won't need it! This is due to the practical principle of **quasi-neutrality**:

> <p align="center"><b>Quasi-neutrality principle</b><br/>"screening is very very strong"</p> 
>
> **In most conductors, the screening length $\lambda$ tends to be small (nanometers in metals and concentrated electrolytes, though reaching microns in lightly doped semiconductors or dilute solutions), so on sensible macroscopic length scales the system is usually *almost* exactly neutral everywhere.**
>
> Corollary: **the concentration of mobile charge carriers needed to produce a gradually varying $\phi$ is a tiny and negligible fraction of the total carrier concentration.**

There are exceptions to this: capacitors, field-effect transistors, and nano-devices all rely on electrostatics. But even for those devices, the bulk majority of the conducting system is neutral and only a tiny region deviates from neutrality.

Many interfaces in our devices are explicitly *not* of interest, yet each interface has one of these electrostatic screening regions (known as the "diffuse" part of the {% wiki "electric double layer" %}). One of the advantages of using electrochemical potentials like $V_i$ is that they 'ride flat' over this local craziness in $V^\circ_i$, so we can skip right over interfaces that are equilibrated.

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-es-blips.njk" %}
{% figcaption %}
The honest picture of a bulk solution between a metal electrode and vacuum: everything is flat except tiny double-layer blips of $V^\circ_i$ within a few Debye lengths of each surface. The $V_i$ ride flat straight over them — which is why, for the most part, we won't bother drawing the blips at all.
{% endfigcaption %}
</figure>

The quasi-neutrality idea also gets applied out of equilibrium, in dynamic situations. For example, if you drive a current from a low-resistance region to a high-resistance region, you create a step in the electric field, but a step in electric field means some local charge accumulated at the interface. But we almost never talk about this charge, because (except at high frequencies or low conductivities, which show {% wiki "Maxwell–Wagner–Sillars polarization", "Maxwell relaxation" %}) it is often negligible. Note however that the dynamic quasi-neutrality is distinct from the spatial quasi-neutrality described above.

<figure class="demo-container" style="max-width: 440px">
{% include "esbd-diagrams/esbd-es-kink.njk" %}
{% figcaption %}
Current driven from a low-resistivity region into a high-resistivity one: $V_{\mathrm{e}^-}$ kinks at the interface, and $\phi$ kinks right along with it. The kink in the field implies a little static charge parked at the interface — real, but negligible, which is why nobody talks about it.
{% endfigcaption %}
</figure>

## $V^\circ_i$ as a perfect neutralizer

As a convenient approximation we can 'assert' local neutrality almost everywhere as a convenience. Mathematically, we do this indirectly by sending $\varepsilon \rightarrow 0$, which converts the Poisson equation into the **local electroneutrality approximation**:^[Newman & Balsara (2021), *Electrochemical Systems*.]

$$
\begin{aligned}
0 & = \rho_{\mathrm{free}}, \\
\lambda & = 0, \\
\phi & = \text{anything}, \\
\end{aligned}
$$

that is, there is no longer any constraint on the derivatives of $\phi$, and so $\phi$ at every point can independently 'float' to produce $0 = \rho_{\mathrm{free}}$.^[Note that we do not set $0 = \rho_{\mathrm{free}}$ outright (with $\varepsilon \neq 0$), which would imply $\nabla^2 \phi = 0$, which is in general not true in conductors and is only true in insulators. Somewhat confusingly though $\nabla^2 \phi = 0$ *can* occur in conductors for a totally unrelated reason within regions of homogeneous bulk transport, i.e. due to $\phi$ following $V_i$ and $\nabla \cdot \vec J_i = - \sigma \nabla^2 V_i = 0$, which has nothing to do with the Poisson equation! See also Newman *Electrochemical Systems* section 11.8 "Electroneutrality and Laplace's equation".]

So, our $V^\circ_i$ ladder floats to whatever value it needs to be to be neutral. In a homogeneous medium where $V_i$ are flat (as they must be at equilibrium) then that means $V^\circ_i$ must be flat too, except at its surfaces (within a few Debye lengths). This is the basis of the neutrality as we assume in e.g. the [charge control topic](../charge_control/).

## Interfaces: aligning two materials

Everything so far has concerned a single medium. The moment two different materials touch, a question appears that the rest of the book has quietly been assuming an answer to: how do their $V^\circ_i$ ladders line up? This is the essential interfacial question, and at the basic level the answer is electrostatic.

At equilibrium, charge rearranges into thin double layers on either side of the contact until any carrier that can cross has equalized its $V_i$. What is left is an offset between the two ladders — a built-in step in $\phi$, fixed by the interface. The bulk-to-bulk alignment is tied to the alignment right at the contact through the screening on each side: the double layers absorb the transition within a Debye length or so, and however much each side bends, the deep bulks settle at a fixed relative offset.

The useful part is what happens when the two sides screen very differently. A strongly screening material (a metal, $\lambda \to 0$) barely bends at all, so its level is effectively rigid right up to the interface and the weakly screening side does all the accommodating. The alignment then anchors to the strong screener's $V_i$. This is exactly why everything at a metal is referenced to its $V_{\mathrm{e}^-}$: the {% wiki "Schottky barrier" %} height and the work function are both just "where the other phase's level sits relative to the metal's $V_{\mathrm{e}^-}$." The same rule, with gentler asymmetry, is behind the Donnan step of [charge control](../charge_control/) and the band offsets of semiconductor heterojunctions ([semiconductors](../solidstate/)).

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-es-hetero.njk" %}
{% figcaption %}
A heterojunction between two n-type semiconductors, at equilibrium. The edge gap right at the contact (the ↕ marker) is a fixed property of the atomic interface: no doping moves it. The far bulks, meanwhile, settle wherever their dopings put them relative to the shared flat $V_{\mathrm{e}^-}$, and band bending absorbs the mismatch — split toward whichever side screens more weakly. Crank one doping to the maximum and that side goes rigid, metal-like, right up to the contact: the Schottky picture emerges as the limiting case.
{% endfigcaption %}
</figure>

Predicting the *size* of that offset from scratch is a separate and much harder problem, which we will not attempt; the popular shortcut of lining materials up by a shared vacuum level is a rule of thumb that is notoriously unreliable, since every interface carries its own dipole. But the size is just one number. The *structure* of the alignment — electrostatic, screening-mediated, anchored to the stronger screener — is the essential part, and it is what lets the rest of this book draw interfaces at all.

## Beyond the simple case

It's worth noting what a blessing it is to have the quasi-neutrality principle, and how complicated things can get when we can't rely on it.

The full catalog of what can go wrong — patchy and charged interfaces, graded media and their quasi-electric fields, nano-scale conductors that are all interface, constitutive relations beyond any effective $\varepsilon$, and the eventual breakdown of the local continuum picture itself — is banked in [its own appendix](../inhomog/).

All of those concerns are real and important when describing interfaces, especially 1) interface kinetics and 2) interface capacitance. And there is a huge engineering importance: as Herbert Kroemer said, "the interface is the device". But interfaces are always connected to bulky reservoirs, which themselves are internally quasi-electrostatic. The vast majority of bulky regions in our devices and circuits are quasi-neutral which means electrostatics can be largely ignored inside them, and we only need to worry about the $V_i$ values (with $V^\circ_i$ acting as a mere neutralizer, as described above).

{#

For a complete set of $\{V_i\}$ values, we only fix the mean activity products. Principle of neutrality can now only be used 'backwards': for a large homogeneous solution we know it is neutral and hence we may assign $V^\circ_i$ to any position, which fixes all the activities. The Gibbs–Guggenheim principle says that we have no reason to prefer one convention for $\phi$ over another.

Pethica, B. A. (2007). Are electrostatic potentials between regions of different chemical composition measurable? The Gibbs–Guggenheim principle reconsidered, extended and its consequences revisited. Physical Chemistry Chemical Physics, 9(47), 6253. https://doi.org/10.1039/b706153f

But this raises a question about how we describe deviations from neutrality, which we need to describe electrostatics. The concept of a "real $\phi$" seems like it would help but that's only true if the constitutive relation of the medium has a simple permittivity, which is no longer even necessarily true: any false $\phi$ will work with an appropriate constitutive relation! Fortunately, the practical reality of a highly concentrated and non-ideal substance is that the screening length $\lambda$ tends to be extremely small. So, it is precisely in these situations where electrostatics is the least important and where we care the least about what the "real $\phi$" actually is. While there is still a surface double layer, we can comfortably describe it as a 0-thickness isotherm as in the .

#}

## Takeaways

Electrostatics entered our picture mainly to justify leaving it out: screening is so strong that almost everywhere, the $V^\circ_i$ ladder simply floats to whatever offset keeps the bulk neutral, while the $V_i$ ride flat over the interfacial blips. Where two materials meet, the same screening decides how their ladders align, anchored to whichever side screens more stiffly. Along the way we met the screening response $\chi$, and it has a second life: read as charge banked against a voltage, it is a capacitance, which is where we turn next.

[**NEXT TOPIC: Capacitance**](../capacitors/)
