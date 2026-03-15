---
layout: layouts/esbd_topic.njk
title: 'Neutrality'
tags: [page, esbd_topic]
orderESBD: 23
---

# {{title}}

Let's talk about how we determine the 'structure' of relative $V_i$ and $V^\circ_i$ values. Of course, if we know the concentrations (and activities) of reactants, then we can just plug those into our equation to determine each $V_i$ relative to its $V^\circ_i$.

The **inverse problem** is where we know all the $V_i$ values, and our task is to determine the concentrations. This situation arises for various reasons:

* Our solution may be equilibrated with large reservoirs or electrodes that set the $V_i$ values.
* Our solution may be in a solubility equilibrium, dissociation equilibrium, or recombination-generation equilibrium, that sets $V_i - V_j$.
* We may want to use the set of $\{V_i\}$ values as a description of the thermodynamic state (together with temperature, pressure, etc., and either $\{\mu_i\}$ or concentrations of neutral species).

The problem is that a set $\{V_i\}$ containing $N$ independent values only contains $N-1$ independent pieces of information about the compositional state, and the last degree of freedom is our collective electrical offset (which is meaningful in terms of comparing bodies, but useless for determining local concentrations). For a homogeneous solution, that last degree of freedom is settled by applying charge neutrality. The movable $V^\circ_i$ ladder is a helpful tool to that end.

## $V^\circ_i$ as the neutralizer

At macroscopic scales, every place is locally neutral and so for a given $V_i$ landscape, $V^\circ_i$ has no choice but to assume the position that will produce local neutrality. The $V_i$ picture lets us see how this works visually. Depending on where we position $V^\circ_i$, 

<figure class="diagram-placeholder">
{% figcaption %}
- demo showing how $V^\circ_i$ influences the space charge
- background charge slider
- 'fix neutrality' checkbox
{% endfigcaption %}
</figure>

> Mathematically, this involves solving a trancendental equation like $z_1 c_1 + z_2 c_2 + \ldots = - c_{\mathrm{bg}} $, where each of the $c_i$ terms are exponentially sensitive to the $V^\circ_i$ ladder offset. Note however each of these exponentials is of the form $\exp(\ldots)^{z_i}$ so technically it can be rewritten as a polynomial equation. Numerically, this is tricky since it's quite easy for these exponentials to blow up, so some hacks are needed to help stabilize the convergence.^[As an initial guess you can find out (for large postive $c_{\mathrm{bg}}$) the **dominant cation** has the biggest $V_i - V^\circ_i$ and then pin its $V^\circ_i$ to $V_i$, or (for large negative $c_{\mathrm{bg}}$) which **dominant anion** and analogously pin $V^\circ_i$ to it, or (for small $c_{\mathrm{bg}}$) pin $V^\circ_i$ somewhere halfway between the two extremes. This lets you find a rough but safe initial offset of the $V^\circ_i$ ladder that doesn't blow up from the start. After that, Newton-Raphson iterations are be carried out to zero the space charge, however it is likely necessary to clamp the steps in $\phi$ to only a few times $V_{\mathrm{th}}$, to avoid blowups that can occur when the intrinsic ion densities would be very low but the $c_{\mathrm{bg}}$ is large.]

## Examples

Gibbs-Donnan equilibrium, common-ion effect, dopants,

<figure class="diagram-placeholder">
{% figcaption %}
- how charge imbalance for given salt $V_i$ influences concentrations
{% endfigcaption %}
</figure>




## Non-ideality: the Gibbs-Guggenheim principle

For a complete set of ${\V_i\}$ values, we fix mean activity products. Principle of neutrality can now only be used 'backwards': for a large homogeneous solution we know it is neutral and hence we may assign $V^\circ_i$ to any position, which fixes all the activities.

Pethica, B. A. (2007). Are electrostatic potentials between regions of different chemical composition measurable? The Gibbs–Guggenheim principle reconsidered, extended and its consequences revisited. Physical Chemistry Chemical Physics, 9(47), 6253. https://doi.org/10.1039/b706153f


## Takeaways


[**NEXT TOPIC: XXX**](../xxx/)
