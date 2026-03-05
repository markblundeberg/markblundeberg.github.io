---
layout: layouts/esbd_topic.njk
title: 'Steady transport'
tags: [page, esbd_topic]
orderESBD: 72
---

# {{title}}

This largely follows the logic of Newman's book, chapter 11. But we want to illustrate it.^[Newman & Balsara (2005), *Electrochemical Systems*. Chapter 11 "Infinitely dilute solutions".]

Number flux in general (diffusion, isothermal):

$$ \vec N_i = - \frac{D_i}{RT} \nabla \mu_i $$

for diffusion coefficient $D_i$. For ideal-dilute solutes $\mu_i = \mu^\circ_i + RT \ln c_i/c^\circ $, which gives:

$$ \vec N_i = - \frac{D_i}{RT} \nabla \mu^\circ_i - D_i \nabla c_i . $$

Usually the first term is omitted because it is a constant. But with ions, as we have seen $\mu^\circ_i$ is not necessarily a constant!

What this means for charges... it still works for electrochemical potential! Let's define $V_i = \tilde\mu_i/(z_i F)$ and charge current $\vec J_i = z_i F \vec N_i$.
Our diffusion equation now appears as a conductivity equation!

$ \vec J_i = - \sigma_i \nabla V_i $

For conductivity $\sigma_i = \tfrac{(z_i F)^2}{RT} D_i c_i$.
Simple conductivity  for diffusion coefficient $D_i$ and concentration $c_i$.

Well for ideal-dilute solutes (in volumetric concentration $c_i$). $V_i = V^\circ_i + \tfrac{RT}{z_i F} \ln c_i/c^\circ $

$$ \vec N_i = - D_i \nabla c_i - \tfrac{D_i z_i F}{RT} \nabla V^\circ_i $$

> Drift-diffusion / Nernst-Planck equation: for ideal-dilute solutes (in volumetric concentration $c_i$) in a homogeneous medium the above equation is identical to the Nernst-Planck equation. We can sub in $V_i = V^\circ_i + \tfrac{RT}{z_i F} \ln c_i/c^\circ $ and $\vec J_i = z_i F \vec N_i $ where $\vec N_i$ is the particle current density. We see that the $\nabla \phi$ in the Nernst equation really represents $\vec \nabla V^\circ_i$ which is the same for all ions because homogeneous medium.



Homogeneous medium: the $V^\circ_i$ ladder spacings are, so $\vec \nabla V^\circ_i = \vec\nabla V^\circ$.

Quasi-charge-neutrality with no static dopants: $\sum z_i F c_i = 0 $.

Finally steady state and no reactions: $\vec\nabla \cdot \vec J_i = 0$. Actually we will even focus on 1D so $J_i = \mathrm{const}$ for each species.

In general these equations involve concentration gradients.

## Bulk conductivity

The simplest case we can consider is where all $V_i$ slope the same, $-\vec\nabla V_i = E$ for all $i$. In this case at least we don't have to worry about concentration differences.

<figure class="diagram-placeholder">
{% figcaption %}
- Several slanting $V_i$ and $V^\circ_i$.
{% endfigcaption %}
</figure>

Noteworthy: if bulk conductivity applied everywhere in a material, then you could use Laplace equation to solve conductivity.[cite newman] The $\phi$ could represent $V_i$ or $V^\circ_i$, it wouldn't matter which one because they all track together. This is the basis of the so-called "primary current distribution" and "secondary current distribution". 

The reason bulk conductivity does not happen is: 1) ion blocking as seen below (only one ion is reacting), 2) inhomogeneity in concentrations. No longer can be be vague about what 'voltage' or 'potential' -- this is why we need 

## Single-ion conduction

$J_i = 0$ except for one ion. That means $V_i$ flat for all but one ion.

Supporting electrolyte and no supporting electrolyte

Newman 19.5 "PARADOXES WITH SUPPORTING ELECTROLYTE"

<figure class="diagram-placeholder">
{% figcaption %}
- No supporting electrolyte case -- just two ion
{% endfigcaption %}
</figure>


<figure class="diagram-placeholder">
{% figcaption %}
- Supporting electrolyte case -- all flat except $V_i$ of active ion
- 
- Slider for amount of support?
- Allow varying z?
{% endfigcaption %}
</figure>

## Ambipolar (zero current)

Two-ion case and multi-ion

DONT NEED TO DO BIG DERIVATIONS JUST QUALITATIVE AND LINK TO OTHER RESOURCES

LJP

<figure class="diagram-placeholder">
{% figcaption %}
- Two-ion case
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- Multi-ion case
{% endfigcaption %}
</figure>

## Takeaways

We assumed very simplified transport in this case.

* In concentrated solutions, not only do concentrations no longer. We also tend to have transport that cross-couples and $\vec N_i = -\sum_j L_{ij} \vec\nabla \bar\mu_j$.
* We ignored convection. Convection is hard to depict in 1D. Generally the effect of convection is to homogenize and create a bulk conduction. We'll talk more about this later.
* In general space charges matter so we can't assume quasi-charge-neutrality. This is less important for electrochemistry but very important for semiconductors.
* We assumed no dopants $\sum z_i F c_i = 0 $.
* In inhomogeneous media, one has $\vec \nabla V^\circ_i \neq \vec \nabla V^\circ_j$ so each species can feel a different 'electric field'.

