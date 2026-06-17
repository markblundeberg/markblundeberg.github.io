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

<figure class="diagram-placeholder">
{% figcaption %}
- $V^\circ_i$ screening around a defect left and right.
- slider controls defect charge
- (1D)
- subplot: charge density

If a sharp charged defect is introduced inside a conductor, then mobile carriers naturally move in to cancel out the defect.
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- screening at an interface.
- slider controls $\phi$ at interface
- "band bending"

At interfaces it is common for the electrostatic potential to be nudged away from its bulk neutral value.
{% endfigcaption %}
</figure>

The **screening length** $\lambda$ describes the length scale of the 'tail' of exponential decay of screening into the neutral bulk:

$$\lambda = \sqrt{\varepsilon/\chi},$$

where $\chi = -\mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ is a "total chemical capacitance" measuring how strongly the space charge pushes back as $\phi$ deviates from the neutral point. For ideal-dilute ions, electrons, or holes, $\chi$ is a sum of contributions from each species: $\chi = \sum_i {q_i}^2 c_i/(RT) $, which is exactly proportional to the {% wiki "ionic strength" %} and the resulting $\lambda$ is known as the {% wiki "Debye length" %}.

(Mathematically, this screening with flat $V_i$ and ideal-dilute ions or electrons is known as the {% wiki "Poisson–Boltzmann equation" %}. The approach here of flat $V_i$ (flat-$\bar\mu_i$) is a very intuitive and direct yet underappreciated way of deriving said equation. In ideal Fermi gases this is known as {% wiki "Thomas–Fermi screening" %} and the exact expressions differ slightly but the concepts are largely the same.^[For a Fermi gas, the $\rho_{\mathrm{free}}(\phi)$ curve is no longer a sum of exponentials. The screening length is still $\lambda = \sqrt{\varepsilon/\chi}$ but $\chi = -\mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ now relates to density of states and is called {% wiki "quantum capacitance" %}. In the case of a zero temperature Fermi gas, $\lambda$ is called the {% wiki "Thomas–Fermi screening", "Thomas–Fermi length" %}.])

## Quasi-neutrality: a simplification of electrostatics

The above concludes our discussion of electrostatics for now, because we usually won't need it! This is due to the practical principle of **quasi-neutrality**:

> <p align="center"><b>Quasi-neutrality principle</b><br/>"screening is very very strong"</p> 
>
> **In most conductors, the screening length $\lambda$ tends to be quite small (nanometers or less) and so by sensible macroscopic length scales, the system is *almost* exactly neutral everywhere.**
>
> Corollary: **the concentration of mobile charge carriers needed to produce a gradually varying $\phi$ is a tiny and negligible fraction of the total carrier concentration.**

There are exceptions to this: capacitors, field-effect transistors, and nano-devices all rely on electrostatics. But even for those devices, the bulk majority of the conducting system is neutral and only a tiny region deviates from neutrality.

Many interfaces in our devices are explicitly *not* of interest, yet each interface has one of these electrostatic screening regions (known as the "diffuse" part of the {% wiki "electric double layer" %}). One of the advantages of using electrochemical potentials like $V_i$ is that they 'ride flat' over this local craziness in $V^\circ_i$, so we can skip right over interfaces that are equilibrated.

<figure class="diagram-placeholder">
{% figcaption %}
- metal electrode | solution | vacuum
- flat region with tiny blips at the end

In a realistic picture of a bulk solution, we should draw very sharp deviations of $V^\circ_i$ nearby the surfaces. But we won't even bother to draw these for the most part.
{% endfigcaption %}
</figure>

The quasi-neutrality idea also gets applied out of equilibrium, in dynamic situations. For example, if you drive a current from a low-resistance region to a high-resistance region, you create a step in the electric field, but a step in electric field means some local charge accumulated at the interface. But we almost never talk about this charge, because (except at high frequencies or low conductivities, which show {% wiki "Maxwell–Wagner–Sillars polarization", "Maxwell relaxation" %}) it is often negligible. Note however that the dynamic quasi-neutrality is distinct from the spatial quasi-neutrality described above.

<figure class="diagram-placeholder">
{% figcaption %}
- simulation of resistance change with drive?
- $\phi$ and $V_e$ with kink.
{% endfigcaption %}
</figure>

## $V^\circ_i$ as a perfect neutralizer

As a convenient approximation we can 'assert' local neutrality almost everywhere as a convenience. Mathematically, we do this indirectly by sending $\varepsilon \rightarrow 0$, which converts the Poisson equation into the **local electroneutrality approximation**:^[Newman & Balsara (2005), *Electrochemical Systems*.]

$$
\begin{aligned}
0 & = \rho_{\mathrm{free}}, \\
\lambda & = 0, \\
\phi & = \text{anything}, \\
\end{aligned}
$$

that is, there is no longer any constraint on the derivatives of $\phi$, and so $\phi$ at every point can independently 'float' to produce $0 = \rho_{\mathrm{free}}$.^[Note that we do not set $0 = \rho_{\mathrm{free}}$ outright (with $\varepsilon \neq 0$), which would imply $\nabla^2 \phi = 0$, which is in general not true in conductors and is only true in insulators. Somewhat confusingly though $\nabla^2 \phi = 0$ *can* occur in conductors for a totally unrelated reason within regions of homogeneous bulk transport, i.e. due to $\phi$ following $V_i$ and $\nabla \cdot \vec J_i = - \sigma \nabla^2 V_i = 0$, which has nothing to do with the Poisson equation! See also Newman *Electrochemical Systems* section 11.8 "Electroneutrality and Laplace's equation".]

<figure class="diagram-placeholder">
{% figcaption %}
- flat region with tiny blips at the end

In a realistic picture of a bulk solution, we should draw very sharp deviations of $V^\circ_i$ nearby surfaces. But we won't even bother to draw these for the most part.
{% endfigcaption %}
</figure>

So, our $V^\circ_i$ ladder floats to whatever value it needs to be to be neutral. In a homogeneous medium where $V_i$ are flat (as they must be at equilibrium) then that means $V^\circ_i$ must be flat too, except at its surfaces (within a few Debye lengths). This is the basis of the neutrality as we assume in e.g. the [charge control topic](../charge_control/).

## Beyond the simple case

It's worth noting what a blessing it is to have the quasi-neutrality principle, and how complicated things can get when we can't rely on it.

Above we described an incredibly elementary form of screening: an ideal homogeneous linear dielectric medium with a nice ideal dependence of charge carrier accumulation on $\phi$, which led to relatively trivial results like the Poisson Boltzmann screening equation. In general, electrostatics is a far harder problem and requires much more information:

* Almost anything can get very messy:
  * Simple interfaces (e.g. electrodes, or heterojunctions): not only is there a jump in $\phi$ but the $V^\circ_i$ ladder rearranges. Often a "vacuum contact" (contact potential difference) picture is used to try to predict the jump in $V^\circ_i$ but this is only a rule of thumb, and is notoriously unreliable in semiconductors.
  * Patchy and non-planar interfaces: Electrostatics is fundamentally a three dimensional problem, and even 'planar' interfaces tend to be microsopically irregular. Both microscopic irregularities in the geometry and irregularity in $\phi$ alignment of the interface will produce a complex three dimensional electrostatic situation.
  * Interface-specific charges: While the intrinsic interfacial dipoles get a lot of attention, it's worth noting that built-in monopolar charges are also possible. These can be static and dopant-like (e.g. fixed oxide charges at the Si/SiO2 interface) or they can be specific interface (e.g. metal-induced gap states, electronic {% wiki "surface states" %}, specific ion adsorption)
* Graded media (as used in the {% wiki "heterojunction bipolar transistor" %}): These are effectively slow distributed interfaces, which means all the problems of the interface exist through a whole continuum region. $\phi$ and $V^\circ_i$ now all vary differently. Charge carriers only see "quasi-electric fields" $-\nabla V^\circ_i$ which differ from each other and from the "real" electric field $-\nabla\phi$.
* Nano geometry: For example in conductors which are very thin (such as a graphene {% wiki "2D electron gas" %}), the active material can only screen and conduct in two dimensions but electrostatics remains three dimensional. Such conductors have no quasi-neutral bulk, they are 'all interface'.
* Non-ideal conductors (concentrated electrolytes): in order to establish an $E$ field it becomes necessary to nail down single-ion activity coefficients, which are completely unavailable from measurements of bulk charge-neutral solutions. (though ultimately, the $D$ field is the goal)
* Complex constitutive relations ($\mathbf{D} \neq \varepsilon \mathbf{E}$ for many reasons, that cannot be described by any linear 'effective $\varepsilon$'):
  * Static dipoles: Especially at interfaces but also inside of graded media.
  * Chemical gradient dipoles: Where there is a strong gradient in chemical concentration, it is perfectly possible for there to be induced dipoles.
  * Ambiguous $E$ field: The Gibbs–Guggenheim principle that the value of $\phi$ is ambiguous means that in many complex cases, even $\mathbf{E} = -\nabla\phi$ is ambiguous. This is permitted in Maxwell's equations, but crucially the $\mathbf{D}$ field is not affected by this thermodynamic-type ambiguity. Thus $\mathbf{D}$ becomes partially independent of $\mathbf{E}$.
* Local linear continuum breakdown:
  * Very short ranges: even in linear response both charge density and $\varepsilon$ can get nonlocal. (Fermi gas gets Friedel oscillations; ions get pair correlations etc.; solvent exhibits a correlation length and 'overscreening')
  * High electric fields: In general, the dielectric response of a solvent is nonlinear ({% wiki "dielectric saturation" %}). Note though that dielectric saturation in an electric double layer tends to occur in the same conditions that the aforementioned non-local effects also appear, so it becomes a real mess!
  * Local thermodynamic equilibrium breakdown: $V_i$ itself can become ill-defined or requires further refinement in meaning when there is a combination of both small scales and strong driving conditions.

All of these concerns are very much valid and important when describing interfaces, especially 1) interface kinetics and 2) interface capacitance. And there is a huge engineering importance: as Herbert Kroemer said, "the interface is the device". But interfaces are always connected to bulky reservoirs, which themselves are internally quasi-electrostatic. The vast majority of bulky regions in our devices and circuits are quasi-neutral which means electrostatics can be largely ignored inside them, and we only need to worry about the $V_i$ values (with $V^\circ_i$ acting as a mere neutralizer, as described above).

{#

For a complete set of $\{V_i\}$ values, we only fix the mean activity products. Principle of neutrality can now only be used 'backwards': for a large homogeneous solution we know it is neutral and hence we may assign $V^\circ_i$ to any position, which fixes all the activities. The Gibbs–Guggenheim principle says that we have no reason to prefer one convention for $\phi$ over another.

Pethica, B. A. (2007). Are electrostatic potentials between regions of different chemical composition measurable? The Gibbs–Guggenheim principle reconsidered, extended and its consequences revisited. Physical Chemistry Chemical Physics, 9(47), 6253. https://doi.org/10.1039/b706153f

But this raises a question about how we describe deviations from neutrality, which we need to describe electrostatics. The concept of a "real $\phi$" seems like it would help but that's only true if the constitutive relation of the medium has a simple permittivity, which is no longer even necessarily true: any false $\phi$ will work with an appropriate constitutive relation! Fortunately, the practical reality of a highly concentrated and non-ideal substance is that the screening length $\lambda$ tends to be extremely small. So, it is precisely in these situations where electrostatics is the least important and where we care the least about what the "real $\phi$" actually is. While there is still a surface double layer, we can comfortably describe it as a 0-thickness isotherm as in the .

#}

## Takeaways

Now that we have established how electrostatic forces enforce local charge neutrality, we are ready to explore how these carriers move when driven by gradients under load.

[**NEXT TOPIC: Basic transport**](../transport_basic/)
