---
layout: layouts/esbd_topic.njk
title: 'Bulk and surface thermodynamics'
tags: [page, esbd_topic]
orderESBD: 71
eleventyNavigation:
    key: Bulk and surface thermodynamics
    parent: ESBD
    order: 71
---

# {{title}}

In the previous topic, we discussed the case of a floating body in a fairly generic way. Obviously, there is a need to address the case of homogeneous extensive systems, like beakers of electrolyte, without all those annoying surface charging effects. But every homogeneous system has a boundary.

## The extensive bulk

We can describe a homogeneous bulk as $U_{\mathrm{bulk}}(X, N_1^{\mathrm{bulk}}, N_2^{\mathrm{bulk}}, \ldots)$. As we want it to be extensive, then consequently this bulk system must be charge neutral.

(Specifically in chemistry, usually our medium parameters $X$ are pressure and temperature and solvent mass, so $U$ would actually be the bulk Gibbs free energy: $G_{\mathrm{bulk}}(T, P, M_{\mathrm{solvent}}, N_1^{\mathrm{bulk}}, N_2^{\mathrm{bulk}}, \ldots), $ but we will just leave that choice abstracted away.)

### The problem with number-based bulk energies

Our $N_i^{\mathrm{bulk}}$ arguments are overdetermined because they are constrained by charge neutrality. And so $U_{\mathrm{bulk}}$ (and $G_{\mathrm{bulk}}$) partial derivatives don't even exist except in careful charge neutral combinations. That is,

$$ \sum_i w_i \frac{\partial U_{\mathrm{bulk}}}{\partial N^{\mathrm{bulk}}_i} = \sum_i w_i (\mu_i - \lambda q_i), $$

is only defined for a charge-neutral set of weights $w_i$ ($\sum w_i q_i = 0$). The coefficient $\lambda$ here is arbitrary, reflecting that the 'neutral plane' of $U_{\mathrm{bulk}}$ only tells us the set of $\mu_i$ values up to a totally arbitrary offset.

Accordingly, if we only have $U_{\mathrm{bulk}}$ then we have fully lost the electrical state of the system. So not only is $U_{\mathrm{bulk}}$ an overdetermined thermodynamic function but worse yet, its variable set is incomplete. So $U_{\mathrm{bulk}}$ is simultaneously both overspecified *and* missing information, which makes it a bit annoying function to work with.

### The better way: grand free energies

We can repair the misbehaving $U_{\mathrm{bulk}}$ by making a change of variables to electrochemical potentials, which are either 1) set by external constraints, or 2) obtained from the total system energy $U$ (not $U_{\mathrm{bulk}}$), as discussed in the previous topic. We get:

$$F_{\mathrm{bulk}}(X,\mu_1,\mu_2,\ldots) = U_{\mathrm{bulk}} - \sum_i \mu_i N_i^{\mathrm{bulk}} $$

This $F_{\mathrm{bulk}}$, free from the overdeterminism, is a perfectly well behaved thermodynamic function! It does have partial derivatives, which give our particle numbers:

$$ \frac{\partial F_{\mathrm{bulk}}}{\partial \mu_i} = - N_i^{\mathrm{bulk}}. $$

And the $N_i^{\mathrm{bulk}}$ numbers we get are automatically charge neutral. There's a little wrinkle about background charges though. Suppose we raise our electrical potential by $x$, which means our new electrochemical potentials are $\mu_i + q_i x$. Of course $U_{\mathrm{bulk}}$ is unchanged, but our $F_{\mathrm{bulk}}$ may acquire a shift:

$$\begin{aligned}
F_{\mathrm{bulk}}(X,\mu_1 + q_1 x,\mu_2 + q_2 x,\ldots)
& = U_{\mathrm{bulk}} - \sum_i (\mu_i + q_i x) N_i^{\mathrm{bulk}} \\
& = [U_{\mathrm{bulk}} - \sum_i \mu_i N_i^{\mathrm{bulk}}] - \sum_i q_i x N_i^{\mathrm{bulk}} \\
& = F_{\mathrm{bulk}}(X,\mu_1,\mu_2,\ldots) + x Q_{\mathrm{bg}}
\end{aligned}$$

where $Q_{\mathrm{bg}}$ is the background charge (e.g. dopants), that is, our charge neutrality condition is:

$$ Q_{\mathrm{bg}} + \sum q_i N_i^{\mathrm{bulk}} = 0. $$

The result above, $F_{\mathrm{bulk}}(\mu + q x) = F_{\mathrm{bulk}}(\mu) + x Q_{\mathrm{bg}}$ shows that while $U_{\mathrm{bulk}}$ is explicitly gauge *in*variant (an upside from the complete removal of electrical state), in contrast $F_{\mathrm{bulk}}$ is generally gauge *co*variant.^[The leftover $Q_{\mathrm{bg}}x$ term makes makes the free energy covariant (it shifts linearly with potential) rather than invariant. It can also be thought of as 'charge that we have not Legendre transformed yet'; if we later decided that the fixed charges were actually mobile, then we could assign them electrochemical potentials and the free energy would then have $Q_{\mathrm{bg}}=0$ and so $F_{\mathrm{bulk}}$ would be gauge invariant. Note that it would be inappropriate to introduce the extrathermodynamic $\phi$ and subtract off $Q_{\mathrm{bg}} \phi$ to make that gauge covariant term disappear. If the charges are truly static, then the $Q_{\mathrm{bg}} x$ term is the elegant thermodynamic (and $\phi$-agnostic) way that the free energy is telling us about them, and not a mistake that needs fixing.]

## System with an homogeneous bulk and a charged surface

In the previous topic, I had split our system energy into an external geometric capacitance electrostatic energy $U_{\mathrm{geo}} = Q\phi_{\infty} + Q^2/(2C_{\mathrm{geo}})$ and a fairly vague internal energy $U_{\mathrm{int}}$. Now we're going to get more detailed about the internal energy. Specifically, we can narrow our thermodynamics into considering a single bulk material together with a surface energy $U_{\mathrm{surf}}$:

$$ U = U_{\mathrm{bulk}}(\{N_i^{\mathrm{bulk}}\}) + U_{\mathrm{surf}} + U_{\mathrm{geo}}(Q, \phi_\infty), $$

where $U_{\mathrm{bulk}}$ was discussed in the preceding section, along with a partitioning of the particle numbers:

$$ N_i = N_i^{\mathrm{bulk}} + N_i^{\mathrm{surf}}. $$

As a mental model of the surface, imagine a messy disordered surface, not necessarily spherical nor uniformly charged (this is in fact the reality of most surfaces). We are going to see how much we can deduce about this messy charged surface. The simplifying assumptions we're making are that: the bulk is homogeneous, the bulk/surface boundary is fairly well defined, and $C_{\mathrm{geo}}$ is static (our charged surface is not movable).

To tackle this problem, it helps to make a change of variables. In the usual context of having a well-characterized bulk but a messy surface, then instead of specifying $\{N_i\}$, it makes more sense to specify the problem in terms of $\{N_i^{\mathrm{bulk}}\}, Q$. That is, we have:

* $N_i^{\mathrm{surf}}(\{N_i^{\mathrm{bulk}}\}, Q)$ is our 'surface allocator' such that $\sum_i q_i N_i^{\mathrm{surf}} = Q$. This may include some neutral surface absorption such as $N_i^{\mathrm{surf}}(\{N_i^{\mathrm{bulk}}\}, 0) \neq 0$.
* Our $N_i$ values are still recoverable as $N_i = N_i^{\mathrm{bulk}} + N_i^{\mathrm{surf}}$, but it is indirect.
* Our surface energy is a function $U_{\mathrm{surf}}(\{N_i^{\mathrm{bulk}}\}, Q)$.
* (All of these also functions of $X$, which represents our static medium.)

And our energy function is now:

$$ U = U_{\mathrm{bulk}}(\{N_i^{\mathrm{bulk}}\}) + U_{\mathrm{surf}}(\{N_i^{\mathrm{bulk}}\}, Q) + U_{\mathrm{geo}}(Q, \phi_\infty), $$

Since we don't have direct control over $N_i$, it is no longer a simply matter to compute $\mu_i = \partial U / \partial N_i$ (this will involve large Jacobian matrix inverses to change coordinate systems). We do *almost* have $\mu_i$ though: our knowledge of $U_{\mathrm{bulk}}$, and its partial derivatives along the neutral plane, means we can construct a set of $\mu_i$ values but $\mu_i + q_i \lambda$ are also equally valid for some totally arbitrary $\lambda$, as discussed earlier. However, we can calculate $\partial U/\partial Q$ in two different ways to get a self-consistency condition and nail down the arbitrary offset. First, by considering a set of changes $\partial N_i$ that leave the bulk unchanged but change the charge $\partial Q$:

$$\begin{aligned}
\left(\frac{\partial U}{\partial Q}\right)_{\{N^{\mathrm{bulk}}_i\}}
& = \sum_i \left(\frac{\partial U(\{N_i\})}{\partial N_i}\right) \left(\frac{\partial N_i}{\partial Q}\right)_{\{N^{\mathrm{bulk}}\}} \\
& = \sum_i \mu_i \left(\frac{\partial N_i^{\mathrm{surf}}}{\partial Q}\right)_{\{N^{\mathrm{bulk}}\}}
\end{aligned}$$

and second by just considering the direct differentiation of our energy, which leaves $U_{\mathrm{bulk}}$ unchanged:

$$\begin{aligned}
\left(\frac{\partial U}{\partial Q}\right)_{\{N^{\mathrm{bulk}}_i\}}
& = \left(\frac{\partial (U_{\mathrm{surf}} + U_{\mathrm{geo}})}{\partial Q}\right)_{\{N^{\mathrm{bulk}}_i\}}
\end{aligned}$$

and so we get an anchor on our $\mu_i$.

$$ \sum_i \mu_i \left(\frac{\partial N_i^{\mathrm{surf}}}{\partial Q}\right)_{\{N^{\mathrm{bulk}}\}} =  \left(\frac{\partial (U_{\mathrm{surf}} + U_{\mathrm{geo}})}{\partial Q}\right)_{\{N^{\mathrm{bulk}}_i\}}. $$

However, this is pretty awkward. Note that with $N^{\mathrm{bulk}}$ fixed, variations in $Q$ only shift our chemical potentials, i.e., $\partial \mu_i / \partial Q = q_i/C_{\mathrm{tot}}$ for some total capacitance $C_{\mathrm{tot}}$. By differentiating the above anchor a second time and using $\sum_i q_i \partial N_i/\partial Q = 1$, we thus get:

$$ \frac{1}{C_{\mathrm{tot}}} = \left(\frac{\partial (U_{\mathrm{surf}} + U_{\mathrm{geo}})}{\partial Q}\right)_{\{N^{\mathrm{bulk}}_i\}} - \sum_i \mu_i \left(\frac{\partial^2 N_i^{\mathrm{surf}}}{\partial Q^2}\right)_{\{N^{\mathrm{bulk}}\}} $$

This reveals that the structure of $U_{\mathrm{surf}}$ must be complex, which is not entirely surprising: our process of charging by $\partial Q$ necessarily involves adding a carefully controlled cocktail of particles, and the ratios in the mixtures may change as we increase $Q$ more and more.

### System free energy

We can propose a free energy that expands on our $F_{\mathrm{bulk}}$ to include the surface:

$$ F(\{\mu_i\}, \phi_\infty) = U - \mu_i N = F_{\mathrm{bulk}}(\{\mu_i\}) + F_{\mathrm{other}}. $$

