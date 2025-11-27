---
layout: layouts/esbd_topic.njk
title: 'Time dynamics'
tags: [page, esbd_topic]
orderESBD: 44
eleventyNavigation:
    key: Time dynamics
    parent: ESBD
    order: 44
---

# {{title}}

We've talked a lot about steady-state transport but sometimes that isn't sufficient. It's important to realize that some time dynamics are transient and require us to understand the exact way the system adjusts.

## Hydrodynamics (diffusive)

Consider the case where $V_i$ and everything are time-dependent. This will reveal the importance of the diffusion process. To simplify matters we are going to reintroduce the ideal notion of an in-material electrostatic potential $\phi$, and we are going to first ask "how does each ion $i$ respond to a given time-varying $\phi$".

Key simplifying assumptions:

1. **Thermodynamic conductivity equation** (unchanged from steady state). In terms of charge quantities: $$ \mathbf J_i = -\sigma_i \nabla V_i. $$
1. **Per-ion continuity/conservation** (ions can't disappear nor transform to other ions): $$ \partial_t \rho_i + \nabla \cdot \mathbf J_i = 0. $$
2. **Simple isothermal $V_i$-vs-$\phi$ relation** (no complex interion nonidealities nor adiabatic effects): $$ V_i - \phi = f_i(\rho_i), $$
    which we will primarily encounter in its linear form,
    $$ \mathrm d V_i - \mathrm d \phi = (\chi_i)^{-1} \mathrm d \rho_i ,$$
    where $(\chi_i)^{-1} = \mathrm d f_i / \mathrm d\rho_i$ is the charge compressibility, i.e., $\chi_i$ is charge susceptibility.
    For example for ideal-dilute ions we have $V_i - \phi = f_i(\rho_i) = \mathrm{const} + \tfrac{RT}{z_i F} \ln(\tfrac{\rho_i}{z_i F})$ and so $\chi_i = (z_i F)^2 c_i / (RT)$.
    {# pbreak #}
    We will also define a diffusion coefficient:
    $D_i = (\chi_i)^{-1} \sigma_i .$

Combining the above, we get a fundamental equation for the time-dependent transport of each ion, as it reacts to the changing $\phi$. We can write this most simply in terms of $V_i$:

$$ \partial_t (V_i - \phi) = (\chi_i)^{-1} \nabla \cdot (\sigma_i \nabla V_i), $$

that is, when $\phi$ changes then $V_i$ tries to follows those changes faithfully. But thereafter $V_i$ diffuses and tries to flatten out, in spite of whatever spatial variations $\phi$ has adopted.

> Note how simple the above equation is, which is one of the powerful aspects of basing everything on $V_i$. If we try to write a similar equation in terms of $\rho_i$ we will find great complexity even in simple inhomogeneities such as the contact interface between two metals: The functional form $f_i(\rho_i)$ will change from one side to the other, and so $\phi$ will have a step and $\rho_{\mathrm{e}^-}$ will have a step.

We can also write the equation in terms of $\rho_i$:

...

This is the more familiar form known as the {% wiki "Nernst–Planck equation" %}.

Of course, in order to fully solve this, we need to also specify how $\phi$ itself reacts to changes in $\rho_i$, which is generally a {% wiki "Poisson equation" %}:

$$ \nabla(\varepsilon \nabla \phi ) = - (\rho_{\mathrm{other}} + \sum_i\rho_i )$$

where $\varepsilon$ is the medium's permittivity, and $\rho_{\mathrm{other}} + \sum_i\rho_i$ is the total free charge (not including bound polarization charges from $\varepsilon-\varepsilon_0$). The combination of the Poisson and Nernst–Planck equation is known in literature as the **Poisson–Nernst–Planck equation** (PNP equation). Often it is assumed that $\varepsilon$ and $D_i$ are independent of position and concentration, and that $\rho_{\mathrm{other}}=0$ but that is not always the case.^[For example at the interface between different mediums we will see changes and $\varepsilon$ and $D_i$ and the $f_i(\rho_i)$ functions, as well as sharp step in $\phi$ which is induced by a permanent electric double layer, i.e., which can be approximated by an ideal dipole (positive and a negative delta function) in $\rho_{\mathrm{other}}$. Note that the practical definition of $\phi$ in each material tends to be a bit subjective, and so the dipole in $\rho_{\mathrm{other}}$ tends to be a matter of bookkeeping more than reflecting whatever true dipole exists at the interface.]

We can see the two unsurprising limits relevant to inhomogeneous devices:

* **Equilibrium** $\sigma_i\nabla V_i=0$, i.e. $V_i$ is flat through every domain that it can conduct in. Yet neither $\rho_i$ nor $\phi$ need to be flat, but rather they will follow equations akin to the {% wiki "Poisson–Boltzmann equation" %}. Note that the sum of all ions' charge susceptibilities is precisely $RT$ times the {% wiki "ionic strength" %}.
* **Steady-state** transport out of equilibrium: $\nabla \cdot J_i = 0$, i.e., no species can be accumulating anywhere. Of course, per-ion continuity actually does get violated at electrodes (e.g. charge current transforms from $J_{\mathrm{ion}}$ to $J_{\mathrm{e}^-}$), so we need to make exceptions for those interfaces.

But we have also uncovered something about fast time dynamics: if the ions do not have enough time to diffuse, then $V_i$ follows $\phi$ in time, just with some offset. This relates to the question about 'what is voltage'. In DC circuits we established that voltmeters clearly measure differences in $V_{\mathrm{e}^-}$. But what about AC circuits, is it $\phi$ or $V_{\mathrm{e}^-}$ that we measure? We see now that often both of them vary in sync, in which case there is no distinction. This is especially the case in the various metallic wires that make up our circuitry. Where it could matter is when we talk about the probes of the voltmeters. What do they access? If the probes couple capacitively (like a kelvin probe), then they may be measuring more $\phi$ changes; if the probes couple by contact (like an electrode), they may be measuring more $V_i$ changes. In reality, it may be messy and an electrode may measure a mixture of both capacitive and contact effects.

### Uniform with small disturbance and suppressed electrostatics (linearize NP alone)

Putting these together we get a sort of heat equation for the charge density $\rho_i$ of species $i$:

$$ \partial_t \rho_i = D_i \nabla^2 \rho_i + \sigma_i \nabla^2 \phi , $$

where $D_i = \sigma_i / \chi_i$ is the diffusion coefficient of ion $i$.

If we treat $\phi$ as an externally controlled variable (which usually it is not, but just for the sake of argument), we can see how changes in $\phi$ cause a certain amount of $\rho_i$ to want to leave or attract.

We can also look at $V_i$,

$$ \partial_t (V_i - \phi) = D_i \nabla^2 V_i , $$

which shows that whenever $\phi$ changes, $V_i$ follows those changes faithfully, but thereafter $V_i$ tries to relax back to flat.

<figure class="diagram-placeholder">
{% figcaption %}
- Raw 1d response. Plot V and \rho .
- For computation sake use a clipped fourier series with sin waves for V clamped at the ends.
- Control knobs lets us vary \phi localized (fewer control points than number of fourier terms, for smooth beauty).
{% endfigcaption %}
</figure>

### The importance of electrostatics (linearized PNP)

- Now $\phi$ is determined in terms of $\rho$: $$-\varepsilon \nabla^2 \phi = \rho_{\mathrm{ext}} + \sum_i \rho_i $$
- Note if we set $\partial_t \rho = 0$, i.e. steady state, we recover the Poisson-Boltzmann equation.

- Since we don't have control over $\phi$, let's imagine a different control knob: an added background charge $\rho_{\mathrm{ext}}$. 
- When we add $\rho_{\mathrm{ext}}$ (or displace it? adding is ok too...), then the fluid moves to screen out.
- Multi-ion! All ions talk to $\phi$; native diffusion starts to reappear for slow ion, as if uncharged. (e.g. lithium ion electrode particles)  (I.e. actually add $\rho_{\mathrm{ion}}$ instead of $\rho_{\mathrm{ext}}$).
- Demonstrating band bending / Debye length: let's say we fix $\phi$ on one edge. But also showing diffusion dynamics?

<figure class="diagram-placeholder">
{% figcaption %}
- Modify the response to add a backaction. QUESTION: assume embedded in 
- Control knob is now an added background charge
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- Modify the response to add a backaction.
- Control knob is now an added background charge
{% endfigcaption %}
</figure>

### Quasi-charge-neutrality

What happens in the limit where $\varepsilon$ and hence debye length becomes (realistically) quite small?

- A very tiny amount of charge can accumulate and create a very large E field.
- E.g. if we drive current through the boundary between two materials of differing resistivity, then there must be a charge at the boundary that creates the difference in E field we observe.
- In the limit of $\varepsilon \rightarrow 0$ then it must be that $\rho_{\mathrm{total}} = 0$ everywhere, yet paradoxically $\nabla^2\phi \neq 0$.
- This is not steady state! Ambipolar diffusion still occurs.
- The answer is that necessarily 


## High frequency (inertia of charges)

At very high frequencies (generally THz and above), it could become important to take the *inertia* of the ions into account.

As a rule of thumb, don't worry about this for electrochemistry, nor even for electronics until above 1 THz. When I was studying graphene plasmons we got maybe a $1~\mathrm{ps}$ electronic relaxation time, which is really high for any electronic system at room temperature.^[Lundeberg, M. B., *et al.* (2017). [Tuning quantum nonlocal effects in graphene plasmonics](https://doi.org/10.1126/science.aan2735). Science, 357(6347), 187–191.] Some electronics can have longer relaxation time, but only at cryogenic temperatures. For ions, don't worry about this at all: the ionic inertia probably does also activate starting around THz frequencies, however, ions will also exhibit severe dielectric response because ions always exist in a polar solvent, and the solvent (or solvation shell) dielectric response will overwhelm any signature of ionic inertia.

When necessary, for most purposes it works to say that conductivity is frequency-dependent (as per the Drude model), and ignore the nonlocal effects above. But sometimes we have to take into account both inertia and the nonlocality. Then things get very complicated.

### Inertial hydrodynamics with nonlocality

As we increase the wavevector, it becomes important to take into account spreading effects similar to what that we saw above. But it's not just diffusion! This now becomes extremely specialized as in effect we have to talk about the natural 'speed of sound' in the fluid, that exists even when long-range electrostatic interactions are disabled.

For example we can extend our hydrodynamics to incorporate some inertia. Namely, the key modification we make is that it takes a time $1/\gamma_i$ for the current to respond to the driving force $ \partial_t \mathbf J_i = \gamma_i [ -\sigma_i \nabla V_i - \mathbf J_i ] $. That is if we suddenly change our driving force, then $\mathbf J_i$ takes a time $1/\gamma_i$ to relax to its preferred steady state value of $-\sigma_i\nabla V_i$. In other words, $\gamma_i \sigma_i$ represents 'accelerability of charge', for example it is $n q^2 / m$ in the case of dilute charges. Anyway this leads to a wave equation:

FIXME rho equation here

$$ \rho = [FACTOR] (1 - (s q/\omega)^2)^{-1} \phi $$

which (for externally controlled $\phi$) is a damped wave equation with waves travelling at speed $s = \sqrt{\gamma_i D_i}$.

{#
This leads to a wave equation:[^longnote]

$$ \partial_t^2 (V_i - \phi) + \gamma_i \partial_t (V_i - \phi) = \gamma_i D_i \nabla^2 V_i, $$

[^longnote]:
    Because of this change, now $\mathbf J_i$ is not a dependent variable but instead has become a 'momentum' or 'inertia' type of variable. So, we have to regard the present state of the ion $i$ as being $(V_i, \mathbf J_i)$ (or $(\rho_i, \mathbf J_i)$). And we get a coupled PDE for $V_i$ like so:
    $$\begin{aligned} \partial_t \mathbf J_i & = \gamma_i [ -\sigma_i \nabla V_i - \mathbf J_i ]. \\ \partial_t \mathbf (V_i - \phi) & = (\chi_i)^{-1} \nabla \cdot \mathbf J_i \end{aligned} $$
    Now it is not quite so obvious what is going on. But we can simplify it by assuming a uniform material and small perturbations, so $\gamma_i$, $\sigma_i$, $\chi_i$ are all constants. Then we get a single PDE that is second-order in time:
    $$ \partial_t^2 (V_i - \phi) + \gamma_i \partial_t (V_i - \phi) = \gamma_i D_i \nabla^2 V_i, $$
    which (for externally controlled $\phi$) is a damped wave equation with waves travelling at speed $s = \sqrt{\gamma_i D_i}$. Note this is not the plasmon speed, rather it is just the native 'sound speed' that the the charged particle fluid would have if long-range electrostatic interactions were turned off; the spring force in this case is purely due to 'overcrowding', either pauli exclusion (Fermi gas) or entropic (classical gas).
#}

The fact that there is a nonlocality there reflects the natural spreading. But it's important to note right away: the above equation is *not realistic*.

This hydrodynamic response does not precisely mirror what is happening in real systems, not even to leading nonlocal order in $q$. Generally there will be a characteristic speed $v$:

$$ \rho = [FACTOR] (1 + v^2(q/\omega)^2) \phi , $$

where the factor $v$ can actually vary quite a bit depending on assumptions.


* Hydrodynamics predics $v = \sqrt{D \gamma}$, the isothermal speed of sound
* Adiabatic hydrodynamics predics ... This mirrors what happens with sound waves in air.
* Collisionless effects: (Classical), (Quantum : RPA) . Lindhard 1954 paper.  Hydrodynamic first order in $q$ does not match collisionless, even to the first order in $q$ !!
    * Fermi gases - predicts $v =
    * Classical gas - vlasov equation $v = \sqrt{3} v_{\mathrm{th}} $ (in 3D).
* Interacting gases and/or nondegenerate fermi gas with collisionless aspects: it's complicated!



G. Giuliani, G. Vignale, Quantum Theory of the Electron Liquid (Cambridge Univ. Press, 2005).
- The hydrodynamic effects above are described as 'diffusion pole'.
- Shows that diffusive hydrodynamic works for wavelengths longer than ballistic length ($q v_F \tau \ll 1$), and frequencies slower than ballistic time ($\omega\tau \ll 1$).
- These advanced treatments show that the electrochemical potential remains the best description of effective driving field $E_{\mathrm{eff}} = -\nabla V_i$ for this diffusion regime (4.6.2). But otherwise chemical potential gets very little mention, because the very notion of a local thermodynamic equilibrium tends to fall apart at high frequency and/or high wavevector. When describing scattering effects (momentum relaxation) on these high frequency phenomena it is necessary to invoke electrochemical potential in order to get the right result (4.6.2).
- See section 5.3.3 Plasmons for discussion of classical hydrodynamics vs collisionless, and the q^2 factor!