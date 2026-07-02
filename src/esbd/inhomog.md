---
layout: layouts/esbd_topic.njk
title: 'Inhomogeneities and electrostatics'
tags: [page, esbd_topic]
orderESBD: 63
---

# {{title}}

One of the main reasons these $V_i$ diagrams are powerful is in clearly visualizing devices with inhomogeneous composition and electric fields. That is, $V^\circ_i$ is not flat. Typically this is conceived of as variations in $\phi$ however $V^\circ_i$ lets us dig a bit more precisely into that.


Neutral variations

<figure class="diagram-placeholder">
{% figcaption %}
- mu, mu0, c_i variations
{% endfigcaption %}
</figure>

While the local potential $\mu^\circ_i$ for a neutral particle can vary smoothly with position, and it can also vary in time, these are pretty rare conditions.

In a formal thermodynamic sense, we can think of these $V^\circ_i$ as being just another inhomogeneity. Pragmatically though $V^\circ_i$ vary much more readily.
The extreme power of electrostatics means that $V^\circ_i$ react rapidly and often all together. For a fixed medium we have $V^\circ_i = \phi + \mathrm{const}$.

Microscopically, poisson equation:
$$ \nabla^2 \phi = \rho/\epsilon_0 $$

If free charges accumulate then generally $\rho$ changes too so $\phi$ shifts, which makes all the $V^\circ_i$ shift.

<figure class="diagram-placeholder">
{% figcaption %}
- some kind of demo
{% endfigcaption %}
</figure>

But $\phi$ is often somewhat arbitrary and also macroscopic. And we don't always know the microscopic $\rho$. In terms of accumulated free charge we have $\rho_{\mathrm{free}}$.

## Quasi-electrostatics

Although $\rho$ is very small, 
It's not true that $ \nabla^2 \phi = 0 $, in fact this is very much not the case. Rather $ \nabla^2 \phi = \rho/\epsilon_0 $ but both $\rho$ and $\varepsilon_0$ are very small.


## Inhomogeneous electrostatics: the difference between $\phi$ and $V^\circ_i$

Since we want $\phi$ to be macroscopic ... bla bla.

$$ \nabla \cdot D = \rho_{\mathrm{free}}$$
$$ D = -\varepsilon\nabla\phi .$$

This is done by separating off dipolar electric charges into 'bound charge' $\rho_{\mathrm{bound}} = -\nabla\cdot P$. However: the first equation only defines $\rho_{\mathrm{free}}$ as "everything but polarization bound charge", and the second equation is only a valid constitutive relation for a homogeneous medium.

More generally, we can split $\rho_{\mathrm{free}}$ into $\rho_{\mathrm{mobile}} + \rho_{\mathrm{fixed}}$. Where $\rho_{\mathrm{mobile}}$ is a sum of all our local mobile ions' concentrations, and $\rho_{\mathrm{fixed}}$ is a static charge. The $\rho_{\mathrm{fixed}}$ need not be zero, and may contain sheet charge at interfaces.^[The $\rho_{\mathrm{fixed}}$ can include for example dopants, but that isn't the only contribution. Notably at the silicon/silicon-oxide interface there is a "fixed oxide charge". Many dislocations ] Even though $\rho_{\mathrm{fixed}}$ are fixed charges, we don't model them as "bound charges" in the normal sense (polarization charges) since they need not be associated with a dipole, i.e. they need not come along with a compensating charge.

So we have

$$ \nabla \cdot D = \rho_{\mathrm{mobile}} + \rho_{\mathrm{fixed}} $$

In fact our constitutive relation should more generally be: 

$$ D = -\varepsilon\nabla\phi + D_{\mathrm{inhomog}} $$

Here $D_{\mathrm{inhomog}}$

$-\nabla\phi$ is not always a real electric field!

$D_{\mathrm{inhomog}}$ is nonzero at interfaces (with sharp delta function), and nonzero in graded media. It depends on how we defined $\phi$: if we have $\phi(x) = \phi_{\mathrm{real}}(x) + \delta(x)$ then this naturally creates $D_{\mathrm{inhomog}}$. $D_{\mathrm{inhomog}}$ is also nonzero where there are gradients in nonideal solutions, because the activity convention fixes the variations in $\phi$. (Also: there are some material with 'polarization ambiguity' and $D_{\mathrm{inhomog}}$ can be nonzero throughout a material!) The fact that $D_{\mathrm{inhomog}}$ is so poorly controlled leaves us with a conundrum of what to do. For large scales we ignore it by applying quasi-neutrality, but at interfaces we have a serious problem.

At interfaces, we have a sharp step in $\delta(x)$ so there is a sharp $D_{\mathrm{inhomog}}$ corresponding to a jump in $\phi$ (the step size depending on how we even defined $\phi$).

Although the $\phi$ ambiguity means $-\nabla \phi$ is a subjective electric field, and $D_{\mathrm{inhomog}}$ dipolar charge is also subjective, interestingly the total $D$ is not affected by this. This "agree on $D$ but disagree on $E$" is an interesting backwards twist on the polarization ambiguity, where we have "agree on $E$ but disagree on $D$"; I don't think the two are related.

## 


## Beyond the simple case: the catalog

Above we described an incredibly elementary form of screening: an ideal homogeneous linear dielectric medium with a nice ideal dependence of charge carrier accumulation on $\phi$, which led to relatively trivial results like the Poisson Boltzmann screening equation. In general, electrostatics is a far harder problem and requires much more information:

* Almost anything can get very messy:
  * Simple interfaces (e.g. electrodes, or heterojunctions): beyond the basic alignment above, pinning down the *value* of the offset from first principles is hard — the "vacuum contact" / contact-potential-difference rule of thumb is notoriously unreliable in semiconductors.
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


## Takeaways
