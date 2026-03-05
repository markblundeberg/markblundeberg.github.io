---
layout: layouts/esbd_topic.njk
title: 'Drift-diffusion'
tags: [page, esbd_topic]
orderESBD: 71
---

# {{title}}

The famous drift-diffusion equation (a.k.a. migration-diffusion equation or Nernst-Planck equation) explains how charged solutes both want to diffuse and want to accelerate in electric fields. Many resources explain how this can be derived from gradients in electrochemical potential, and how the drift and diffusion coefficients therefore must be related by the Einstein relation.^[Newman & Balsara (2005), *Electrochemical Systems*. Chapter 11 "Infinitely dilute solutions".] I

Let's rederive this but pay special attention to the quirk of what happens when the medium is not compositionally homogeneous. Two phenomena arise:

* **Neutral drift**: even uncharged solutes experience a drift force $-\nabla \mu^\circ_i$ due to variations in solubility.
* **Quasi-electric fields**: the drift electric field, $-\nabla V^\circ_i$, is not necessarily the same for all ions.

And in fact the general drift field of ions is really just a special case of neutral drift!

## Neutral diffusion and drift

Before we start, let's look at the diffusion of neutral particles. In standard textbook we just jump to Fick's law but I want to show how in deriving Fick's law, we *already* get a drift term which is usually neglected. As we'll see this neutral drift term is the origin of the electrical drift term.

Number flux in general (diffusion, isothermal): solutes go from high to low chemical potential. For the most parts solutes just move according to their own chemical potential (there can be cross terms but we'll ignore those for now):

$$ \vec N_i = - L_i \nabla \mu_i $$

for some coefficient $L_i$. Now, we're particularly interested in dilute solutes, whose chemical potential in terms of concentration $c_i$ is

$$ \mu_i = \mu^\circ_i + RT \ln c_i/c^\circ. $$

Here, $\mu^\circ_i$ is a medium-specific value, and can potentially vary from medium to medium due to changes in solubility. (Note that often the variation in solubility is represented as a non-unity activity coefficient, but here I've absorbed that into the definition of $\mu^\circ_i$.)^[Unlike with ions, we can refer neutral solutes back to a pure standard state. This could be a real solid or liquid, or it may be a gaseous ideal state; regardless, such a standard state has a constant value $\mu^*_i$ (at least constant for the current temperature and pressure). If the pure standard state is $\mu^*_i$ then for the solute we may write $ \mu_i = \mu^*_i + RT \ln \gamma^*_i c_i/c^\circ$, where $\gamma^*_i$ is a pure-referenced activity coefficient. Importantly, the value $\gamma^*_i(0)$ at infinite dilution will *not* be 1 in general, and in fact this $\gamma^*_i(0)$ varies from medium to medium. Thus even if there is no gradient in $\mu^*_i$, we still have a gradient in $\gamma^*_i$ which represents the same effect. Anyway, we may absorb this as follows: define $\mu^\circ_i = \mu^*_i + RT\ln\gamma^*_i(0)$, so we get $\mu_i = \mu^\circ_i + RT \ln \gamma_i c_i/c^\circ$, where $\gamma_i = \gamma^*_i / \gamma^*_i(0) \rightarrow 1$ at infinite dilution. We then assume normal ideal-dilute conditions i.e. $\gamma_i=1$. We can say the drift force is driven by a solubility factor $\gamma^*_i(0)$ but we have equally well represented it as being driven by $\mu^\circ_i$.]

When we plug this $\mu_i$ in, it gives:

$$ \vec N_i = - [L_i RT/c_i] \nabla c_i - L_i \nabla \mu^\circ_i . $$

This first term matches Fick's law,
$$ \vec N_i = - D_i \nabla c_i, $$
and we can identify that the diffusion coefficient must be $D_i = L_i RT/c_i$ (for ideal-dilute solutes at least). But we also see that Fick's law is missing an extra term, at least in inhomogeneous media.

And the second term is absolutely required for inhomogeneous media. If $\mu_i$ is flat then there are no spontaneous flows ($\vec N_i = 0$), regardless of how $\mu^\circ_i$ and $c_i$ are varying. The second term has to be there to explain how two media can be in equilibrium but with different concentrations. This is {% wiki "detailed balance" %}, as we can illustrate by plotting $\mu_i$, $\mu^\circ_i$, and $c_i$ against position:

<figure class="diagram-placeholder">
{% figcaption %}
- Figure showing neutral solubility vs position
- Equilibrium.
{% endfigcaption %}
</figure>

A smooth variation in $\mu^\circ_i$ could be from a variety of things:

* Hydrogen atoms diffusing in a palladium/silver alloy bar of varying composition.^[The addition of silver to palladium causes $\mu^\circ_{\mathrm{H_2}}$ to decrease, that is, the constant of {% wiki "Sieverts's law" %} decreases. See e.g. Holleck G.L. [Diffusion and solubility of hydrogen in palladium and palladium--silver alloys.](https://doi.org/10.1021/j100698a005) J. Phys. Chem. 1970;74:503–511.]
* The Gorsky effect: hydrogen atoms preferentially move to strained parts of a metal body.
* Solutes dissolving in a medium with varying pore spaces (entropic steric effect on $\mu^\circ_i$).
* Solutes adsorbing onto microscopic surface where the surfaces' area or affinity is varying with position.

Of course the usual situation is that changes between media are abrupt: $\mu^\circ_i$ changes abruptly and so there is a sharp step in $c_i$. (That said, the linear equation $ \vec N_i = - L_i \nabla \mu_i $ usually does *not* apply at abrupt changes, rather there tends to be a nonlinear dependence.)

### Drift-diffusion (neutral solutes)

The extra term is drift. We could call it "solubility drift" or "potential drift".

Often we see Fick's law augmented as a {% wiki "drift-diffusion equation" %} to allow for driving forces (which could be induced by external forces, or convection):
$$ \vec N_i = - D_i \nabla c_i + m c_i \vec F$$
for a force $\vec F$ and mobility $m$. We can thus identify that $\mu^\circ_i$ is a potential energy term that drives a force $\vec F = - \nabla \mu^\circ_i$ and by examining our equations we find the mobility is $m = L_i/c_i = D_i/(RT)$; this last equality is the {% wiki "Einstein relation (kinetic theory)", "Einstein relation" %}.

And so we see inhomogeneous medium effectively induces an *intrinsic* drift velocity $\vec v_{\mathrm{d}} = (L_i/c_i) \nabla \mu^\circ_i$, but this drift velocity differs for each ion.

$$ \vec N_i = -\underbrace{ D_i \nabla c_i}_{\text{diffusion}} - \underbrace {L_i \nabla \mu^\circ_i }_{\text{potential drift}}. $$

This closely resembles the Nernst-Planck equation for charged solutes, but in this case the solutes are totally uncharged.

{# But note, the drift term is not independent of the diffusion term. When $\mu$ is flat, they completely cancel out, and this happens because of the exact structure we assumed at the start, and the exact relationship between $D_i$ and $L_i$. #}

## Charged diffusion and drift

The same thing applies for ions, just now the driving force is electrochemical potential.

$$ \vec N_i = - L_i \nabla \bar\mu_i $$

Repeating the above derivation, we still have that drift term $\nabla\bar\mu^\circ_i$. But $\bar\mu^\circ_i$ varies much more readily with position: $\bar\mu^\circ_i$ isn't only changing because of compositional solubility variations in the medium but also due to electrical variations. So we can have a "homogeneous medium" that is inhomogeneous in $\bar\mu^\circ_i$, i.e. it is actually electrically inhomogeneous.

Usually the first term is omitted because it is a constant. But with ions, as we have seen $\mu^\circ_i$ is not necessarily a constant! This is for two reasons: 1) the real standard state is an electrochemical one, and $\tilde\mu^\circ_i = \mu^\circ_{\mathrm{int},i} + z_i F \phi$, and $\phi$ varies; 2) the value of $\mu^\circ_{\mathrm{int},i}$ varies from medium to medium.

We can also recast our equation with our $V_i$'s. As usual let's define $V_i = \tilde\mu_i/(z_i F)$, and let's also define charge current $\vec J_i = z_i F \vec N_i$.
Our diffusion equation now appears as a charge conductivity equation for this species of charge:

$$ \vec J_i = - \sigma_i \nabla V_i , $$

where we defined conductivity $\sigma_i = (z_i F)^2 L_i = (z_i F)^2 D_i c_i / (RT)$.
Simple conductivity  for diffusion coefficient $D_i$ and concentration $c_i$.

### Homogeneous medium case (Nernst-Planck)

Homogeneous medium: the $V^\circ_i$ ladder spacings are, so $\vec \nabla V^\circ_i = \vec\nabla V^\circ$.

<figure class="diagram-placeholder">
{% figcaption %}
- Homogeneous medium drift-diffusion - all $V^\circ_i$ move together
{% endfigcaption %}
</figure>

With our ideal-dilute solutes (in volumetric concentration $c_i$). $V_i = V^\circ_i + \tfrac{RT}{z_i F} \ln c_i/c^\circ $   (and always $\gamma_i = 1$) we have:

$$ \vec N_i = - D_i \nabla c_i - \tfrac{D_i c_i z_i F}{RT} \nabla V^\circ_i $$

Drift-diffusion / Nernst-Planck equation: for ideal-dilute solutes (in volumetric concentration $c_i$) in a homogeneous medium the above equation is identical to the Nernst-Planck equation. We can sub in $V_i = V^\circ_i + \tfrac{RT}{z_i F} \ln c_i/c^\circ $ and $\vec J_i = z_i F \vec N_i $ where $\vec N_i$ is the particle current density. We see that the $\nabla \phi$ in the Nernst equation really represents $\vec \nabla V^\circ_i$ which is the same for all ions because homogeneous medium.

## Quasi-electric fields

When we move between media $V^\circ_i$ ladder spacings change, thus $\vec \nabla V^\circ_i \neq \vec\nabla V^\circ_j \neq \vec\nabla\phi$. In this case the meaning of changes in $\phi$ starts to lose meaning. The change can be spatially gradual or abrupt.

Gradual: quasi-electric force [Kroemer]

Gradual or abrupt: ambiguity in $\phi$. [demo figure: define $\phi$ in each material, gradient is then indeterminate.] If $\phi$ is supposed to represent electrostatics then there is also ambiguity in $\rho$, which is true! (ambiguity in $D$ field -- it is not necessarily the case that $\nabla\cdot D = -\rho_{\mathrm{free}}$ inside of media junctions.)

Neutrals: chemical gradient / solubility gradient.

<figure class="diagram-placeholder">
{% figcaption %}
- Show two ions 
{% endfigcaption %}
</figure>

Technical footnote : In semiconductor, $\bar\mu^\circ_{\mathrm{e}^-}$ and $E_{\mathrm{c}}$ do not quite exactly follow each other due to changes in the effective mass i.e. changes in the momentum part of entropy. The gradient in $\bar\mu^\circ_{\mathrm{e}^-}$ is the quasi-electric force you need to use in a drift-diffusion equation (as a correction to Fick's law), whereas the gradient in $E_{\mathrm{c}}$ is more of the real potential felt by the electron as you would put in a ballistic electron equation. With ions, entropic corrections like this also occur due to steric effects, e.g. like in the sediment example above how the presence of sediment particles changes the coarse-grained $\mu^\circ_i$ simply due to less solvent being present per unit volume.

<figure class="diagram-placeholder">
{% figcaption %}
- Graded-based HBT
{% endfigcaption %}
</figure>


## Nonideality

When it comes to nonideality, in general even the starting point $\vec N_i = - \frac{D_i}{RT} \nabla \mu_i $ is not even true, rather usually we have an Onsager full transport matrix:

$$ \vec N_i = - \sum_j L_{ij} \nabla \mu_j $$

And in fact there are generally variations in temperature too!

### Special nonideality (one-solute)

There is an interesting special case when there is only one solute. Suppose we still have $\vec N = - L \nabla \mu $ but $\mu$ is not ideal or at least not simply ideal, $\mu = \mu^\circ + RT \ln \gamma c/c^\circ $ with a nonideality factor $\gamma$. We now get:

$$ \vec N = - L \nabla c ... $$

Now, $\gamma(c,\vec x)$ can vary both depending on concentration ($c$) and depending on changes in the medium ($\vec x$). Thus $\nabla \ln \gamma = \partial(\ln\gamma)/\partial c + \partial(\ln \gamma)/\partial x$, giving:

$$ \vec N = - D \nabla c - \sigma \nabla \phi, $$

$$ D = RTL ( 1 + c_i ... ) $$

$$ F = ... $$

The ratio 

The $D/(RTL)$ ratio is often called a "thermodynamic factor" and we frequently see it as $\Gamma = D/(RTL) = (1 + \tfrac{\mathrm{d}\gamma}{\mathrm{d}c})$,.^[https://sdkang.org/diffusion-ficks-first-law/#Generalized_flux_and_driving_force] The idea is that it just modulates diffusion as $\vec N_i = -D \nabla c_i$ with some modified diffusion coefficient $D$. But this is only valid when only one solute is nonideal otherwise we need the full thing with cross terms. And as can be seen, there is an additional force term $F$. This is just like our quasi-electric fields.

In semiconductor physics, we quite often see degenerate electron gases which are not ideal in the Boltzmannian sense. In that case we describe the same thing as a 'generalized Einstein relation' using the density of states instead of 


## Takeaways

As we've seen both the pure diffusion law and the drift-diffusion law are special cases of particles moving from high to low chemical potential.


Important facts about ions unlike neutral solutes:
* In a compositionally homogeneous medium, all the $\tilde\mu^\circ_i$ vary together consistently, and $V^\circ_i$ largely move up and down rigidly. Our plots of $V^\circ_i$ are intuitively able to represent these variations.
* $V^\circ_i$
* Unlike with neutral solutes, $V^\circ_i$ can *respond* to the motion of ions and in fact $V^\circ_i$ responds with extreme sensitivity to maintain charge neutrality!


In concentrated solutions, not only do concentrations no longer. We also tend to have transport that cross-couples and $\vec N_i = -\sum_j L_{ij} \vec\nabla \bar\mu_j$. And, not only do solutes have a chemical force but so does the solvent (osmotic vapor pressure lowering).

We ignored convection. We could include it but many of our plots are 1D and it is hard to accurately visualize convective flow. In electrochemical cells, generally the effect of convection is to homogenize and create a bulk conduction. We'll talk more about this later.

We have yet to talk about .
