---
layout: layouts/esbd_topic.njk
title: 'Basic electrostatics'
tags: [page, esbd_topic]
orderESBD: 23
---

# {{title}}

Let's talk about how we determine the 'structure' of relative $V_i$ and $V^\circ_i$ values. Of course, if we know the concentrations (and activities) of reactants, then we can just plug those into our equation to determine each $V_i$ relative to its $V^\circ_i$. But what happens if we don't know the concentrations ahead of time?

The inverse problem is where we know all the $V_i$ values, and our task is to determine the concentrations. This situation arises for various reasons:

* Our solution may be equilibrated with large reservoirs that set the $V_i$ values (e.g. Gibbs-Donnan equilibrium, see below).
* Our solution may be in a solubility equilibrium, dissociation equilibrium, or recombination-generation equilibrium, that sets $V_i - V_j$.
* We may be examining a small region (such as an electrostatic diffuse layer) within a much larger conductor that acts as a reservoir for our $V_i$ values.
* We may simply want to use the set of $\{V_i\}$ values as a description of the thermodynamic state (together with temperature, pressure, etc., and either $\{\mu_i\}$ or concentrations of neutral species).

The problem is that a set $\{V_i\}$ containing $N$ independent values only contains $N-1$ independent pieces of information about the compositional state, since the collective electrical offset is not related to concentrations. The last missing parameter is the position of the $V^\circ_i$ ladder, but that also controls the total charge density, and that brings us to the topic of electrostatics and neutrality.

## $V^\circ_i$ as a charge control

Depending on where we position $V^\circ_i$, we will get more or less space charge. For example as we move $V^\circ_i$ up, we reduce $V_i - V^\circ_i$ for all ions, which means we get a lower concentration positive ions, and a higher concentration of negative ions:

<figure class="diagram-placeholder">
{% figcaption %}
- demo showing how $V^\circ_i$ influences the space charge
- background charge slider
- 'fix neutrality' checkbox
- subplot with delta phi on x axis and space charge on y axis (x center on intrinsic point? but I don't want to talk about intrinsic point so much..)
{% endfigcaption %}
</figure>

Note the above demo allows you to add a background charge. Such a background charge occurs in fixed-charge media of various kinds: doped semiconductors, ionomers, and polyelectrolyte networks. The background charge can also be used to describe spectator ions whose concentration is already known (even though they are mobile and thus have a $V_i$, they are operationally static at equilibrium).

But of course we know that conductining body doesn't want to be internally charged, i.e. we know that $V^\circ_i$ should seek point of zero space charge. But why is that?

## $V^\circ_i$ as an agent of electrostatic screening

We can now briefly step into electrostatics to explain *why* $V^\circ_i$ wants to move to neutrality. To this end we should remember that the $V^\circ_i$ ladder's variations relate to variations in the electrostatic potential $\phi$, and so the variations of $V^\circ_i$ must obey electrostatic laws.

We discussed that $\phi$ is generally ambiguous, but in the special case where we are inside of an ideal material it does at least perfectly follow along with $V^\circ_i$. So we can confidently discuss electrostatics in this special case at least. Specifically, within each material, $V^\circ_i$ variations are also variations in $\phi$, so their gradients are equal (and equal the negative of electric field):

$$ E = -\nabla\phi = -\nabla V^\circ_i. $$

Accordingly, inside of each material, the $V^\circ_i$ ladder follows a {% wiki "Poisson equation" %}, which is a consequence of a constitutive relation of the background dielectric medium:^[This form of the Poisson equation only applies inside of a reasonably well behaved medium. As we'll see later on, it necessarily breaks in non-ideal solutions, at interfaces, in graded media, and in strong electric fields.]

$$ \varepsilon \nabla^2 V^\circ_i = \varepsilon \nabla^2 \phi = \rho_{\mathrm{free}}, $$

where $\varepsilon$ is the material's background permittivity and $\rho_{\mathrm{free}}$ is the space charge density described above. But as we saw above, $\rho_{\mathrm{free}}$ is itself a function of the $V^\circ_i$ offset! This creates a natural feedback loop: the result of this equation is that any deviation of $\phi$ from neutral is going to be naturally suppressed, which is {% wiki "electrostatic screening" %}.

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

where $\chi = \mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ is a "total chemical capacitance", describing the sensitivity of the space charge to deviations in $\phi$ away from the neutral point. For ideal-dilute ions, electrons, or holes, $\chi$ is a sum of contributions from each species: $\chi = \sum_i {q_i}^2 c_i/(RT) $, which is exactly proportional to the {% wiki "ionic strength" %} and the resulting $\lambda$ is known as the {% wiki "Debye length" %}.

(Mathematically, this screening with flat $V_i$ and ideal-dilute ions or electrons is described known as the {% wiki "Poisson–Boltzmann equation" %}. The approach here of flat $V_i$ (flat-$\bar\mu_i$) is a very intuitive and direct yet underappreciated way of deriving said equation. In ideal Fermi gases this is known as {% wiki "Thomas–Fermi screening" %} and the exact expressions differ slightly but the concepts are largely the same.^[For a Fermi gas, the $\rho_{\mathrm{free}}(\phi)$ curve is no longer a sum of exponentials. The screening length is still $\lambda = \sqrt{\varepsilon/\chi}$ but $\chi = \mathrm{d}\rho_{\mathrm{free}}/\mathrm{d}\phi$ now relates to density of states and is called {% wiki "quantum capacitance" %}. In the case of a zero temperature Fermi gas, $\lambda$ is called the {% wiki "Thomas–Fermi screening", "Thomas–Fermi length" %}.])

## Quasi-neutrality: a simplification of electrostatics

The above concludes our discussion of electrostatics for now, because we usually won't need it! This is due to the practical principle of **qausi-neutrality**:

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

As a convenient approximation we can 'assert' local neutrality almost everywhere as a convenience. Mathematically, we do this indirectly by we sending $\varepsilon \rightarrow 0$, which converts the Poisson equation into the **local electroneutrality approximation**:^[Newman & Balsara (2005), *Electrochemical Systems*.]

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

So, our $V^\circ_i$ ladder floats to whatever value it needs to be to be neutral. In a homogeneous medium wher $V_i$ are flat (as they must be at equilibrium) then that means $V^\circ_i$ must be flat too, except at its surfaces (within a few Debye lengths).

> **Algorithm note**: Mathematically, finding neutrality means solving a equation like $\rho_{\mathrm{free}} = z_1 F c_1 + z_2 F c_2 + \ldots + \rho_{\mathrm{bg}} = 0 $, where each of the $c_i$ terms are trancendental functions, exponentially sensitive to the $V^\circ_i$ ladder offset. Some special cases have algebraic solutions,^[In general with ideal-dilute ions the equation can be converted to a polynomial. If all positive species have equal charge $+z$ and all negative species have equal charge $-z$, then the neutrality condition can be converted to a quadratic equation.] but the general case has no analytic solution. There are also some gotchas with finding neutrality by numerical methods.^[Applying Newton iterations to the equation can be tricky as these exponentials quickly blow up, so some tricks are needed to help stabilize the convergence of root-finding algorithms. As an initial guess you can find out (for large postive $c_{\mathrm{bg}}$) the **dominant cation** has the biggest $V_i - V^\circ_i$ and then pin its $V^\circ_i$ to $V_i$, or (for large negative $c_{\mathrm{bg}}$) which **dominant anion** and analogously pin $V^\circ_i$ to it, or (for small $c_{\mathrm{bg}}$) pin $V^\circ_i$ somewhere halfway between the two extremes. This lets you find a rough but safe initial offset of the $V^\circ_i$ ladder that doesn't blow up from the start. After that, Newton-Raphson iterations are be carried out to zero the space charge, however it is likely necessary to clamp the steps in $\phi$ to only a few times $V_{\mathrm{th}}$, to avoid blowups that can occur when the intrinsic ion densities would be very low but the $c_{\mathrm{bg}}$ is large.]

### Neutrality examples

To a very good approximation, we can apply neutrality locally to every point in space, which means that $V^\circ_i$ at each place must float up and down to achieve this.


Gibbs-Donnan equilibrium, common-ion effect, dopants.


<figure class="diagram-placeholder">
{% figcaption %}
- pn junction
{% endfigcaption %}
</figure>

The ionic equivalent of the pn junction's built-in voltage is the Donnan potential. Here we consider a case where some background charges have been held in place either due to a semipermeable membrane that excludes ions (such as large charged proteins), or due to a solid structure that holds them in place (as in ionomers and polyelectrolyte networks). This is often described in terms of a detailed balance that is being imposed by the membrane, but with our $V_i$ diagrams we can easily visualize this Gibbs–Donnan equilibrium:

<figure class="diagram-placeholder">
{% figcaption %}
- Gibbs-Donnan equilibrium: jump across membrane.
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- Common-ion effect: salt region sets $V_i - V_j = \mathrm{sat} $. 
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- ITIES
{% endfigcaption %}
</figure>

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
  * Very short ranges: even in linear response both charge density and $\varepsilon$ can get nonlocal. (Fermi gas gets Friedel oscillations; ions get pair correlations etc.; solvent exhibits a correlation length, 'overscreening', and )
  * High electric fields: In general, the dielectric response of a solvent is nonlinear ({% wiki "dielectric saturation" %}). Note though that dielectric saturation in an electric double layer tends to occur in the same conditions that the aforementioned non-local effects also appear, so it becomes a real mess!
  * Local thermodynamic equilibrium breakdown: $V_i$ itself can become ill-defined or requires further refinement in meaning when there is a combination of both small scales and strong driving conditions.

All of these concerns are very much valid and important when describing interfaces, especially 1) interface kinetics and 2) interface capacitance. And there is a huge engineering importance: as Herbert Kroemer said, "the interface is the device". But interfaces are always connected to bulky reservoirs, which themselves are internally quasi-electrostatic.The vast majority of bulky regions in our devices and circuits are quasi-neutral which means electrostatics can be largely ignored inside them, and we only need to worry about the $V_i$ values (with $V^\circ_i$ acting as a mere neutralizer, as described above).

{#

For a complete set of $\{V_i\}$ values, we only fix the mean activity products. Principle of neutrality can now only be used 'backwards': for a large homogeneous solution we know it is neutral and hence we may assign $V^\circ_i$ to any position, which fixes all the activities. The Gibbs–Guggenheim principle says that we have no reason to prefer one convention for $\phi$ over another.

Pethica, B. A. (2007). Are electrostatic potentials between regions of different chemical composition measurable? The Gibbs–Guggenheim principle reconsidered, extended and its consequences revisited. Physical Chemistry Chemical Physics, 9(47), 6253. https://doi.org/10.1039/b706153f

But this raises a question about how we describe deviations from neutrality, which we need to describe electrostatics. The concept of a "real $\phi$" seems like it would help but that's only true if the constitutive relation of the medium has a simple permittivity, which is no longer even necessarily true: any false $\phi$ will work with an appropriate constitutive relation! Fortunately, the practical reality of a highly concentrated and non-ideal substance is that the screening length $\lambda$ tends to be extremely small. So, it is precisely in these situations where electrostatics is the least important and where we care the least about what the "real $\phi$" actually is. While there is still a surface double layer, we can comfortably describe it as a 0-thickness isotherm as in the .

#}

## Takeaways


[**NEXT TOPIC: XXX**](../xxx/)
