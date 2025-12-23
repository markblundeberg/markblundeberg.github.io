---
layout: layouts/esbd_topic.njk
title: 'Bulk and surface thermodynamics'
tags: [page, esbd_topic]
orderESBD: 72
eleventyNavigation:
    key: Bulk and surface thermodynamics
    parent: ESBD
    order: 72
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

The result above, $F_{\mathrm{bulk}}(\mu + q x) = F_{\mathrm{bulk}}(\mu) + x Q_{\mathrm{bg}}$ shows that while $U_{\mathrm{bulk}}$ is explicitly gauge *in*variant (by charge neutrality), in contrast $F_{\mathrm{bulk}}$ is generally gauge *co*variant.

>The leftover $Q_{\mathrm{bg}}x$ term that makes the free energy covariant can be thought of as 'charge that we have not Legendre transformed yet'; if we later decided that the fixed charges were actually mobile, then we could assign them electrochemical potentials and the free energy would then have $Q_{\mathrm{bg}}=0$ and so $F_{\mathrm{bulk}}$ would be gauge invariant.

## System free energy

Let's return to our case of considering the entire system. It has a bulk like described above, and a surface. The bulk is charge-neutral but the surface need not be. It is actually quite awkward to adapt the internal energy $U$ to cover surface effects, and that is because the surface equilibrates with the bulk (equal electrochemical potentials), i.e. $N_i = N_{\mathrm{bulk}} + N_{\mathrm{surf}}$.

Instead we can propose a free energy that expands on our $F_{\mathrm{bulk}}$ to include the surface and the external charging free energies, which we'll just call $F_{\mathrm{other}}$ for now:

$$\begin{aligned}
F(\{\mu_i\}, \phi_\infty)
&= U - \sum_i\mu_i N_i\\
&= F_{\mathrm{bulk}}(\{\mu_i\}) + F_{\mathrm{other}}(\{\mu_i\}, \phi_\infty)
\end{aligned}$$

The particle numbers are:
$$ N_i = -\frac{\partial F}{\partial \mu_i} = N^{\mathrm{bulk}}_i + N^{\mathrm{other}}_i $$

and total charge is:
$$ Q = Q_0 + \sum_i q_i N_i $$
for some fixed system charge offset $Q_0$ (which is part of our static parameters $X$).

Let's forget about the bulk/nonbulk split for a moment and establish some basics.

First, let's establish what gauge covariance must look like. Our total energy $U$ has a covariant relation: $U(\{N_i\},\phi_\infty + \lambda) = U(\{N_i\},\phi_\infty) + Q\lambda$. As a result (following similar arguments I made about $F_{\mathrm{bulk}}$ above) we have:
$$ F(\{\mu_i + q_i \lambda\}, \phi_\infty + \lambda) = F(\{\mu_i\}, \phi_\infty) + Q_0 \lambda. $$
Curiously, if $Q_0 = 0$ note this means $F$ can be invariant while $U$ is covariant. Also note this means we can write $F$ as $F(\{\mu_i\}, \phi_\infty) = F_{\mathrm{rel}}(\{\mu_i - q_i \phi_\infty\}) + Q_0 \phi_{\mathrm{rel}}$ for some function $F_{\mathrm{rel}}$ and $\phi_{\mathrm{rel}}$ which is any of $\mu_i/q_i$, or $\phi_\infty$, or any linear combination thereof.

Differentiating both sides by $\lambda$, we get:
$$ \sum_i q_i \frac{\partial F}{\partial \mu_i} + \frac{\partial F}{\partial \phi_\infty} = Q_0 $$
so
$$ \frac{\partial F}{\partial \phi_\infty} = Q = Q_0 - \sum_i q_i \frac{\partial F}{\partial \mu_i}$$
So the total differential of $F$ is:
$$ \mathrm{d}F = -N_1 \mathrm{d}\mu_1 - \ldots - N_N \mathrm{d}\mu_N + Q \mathrm{d}\phi_\infty. $$

### Capacitance

For system capacitance $\mathrm{d}Q/\mathrm{d}V$, there are two ways to vary the voltage: increase all $V_i$ together or decrease $\phi_\infty$. We can confirm that (as must be the case) these are the same capacitance $C_{\mathrm{tot}}$:
$$\begin{aligned}
- \frac{\partial^2 F}{\partial {\phi_\infty}^2}
&= - \frac{\partial Q}{\partial \phi_\infty} \\
&= -\frac{\partial}{\partial \phi_\infty} \bigg(Q_0 - \sum_i q_i \frac{\partial F}{\partial \mu_i}\bigg) \\
&= -\sum_i q_i \frac{\partial}{\partial \mu_i} \bigg(\frac{\partial F}{\partial \phi_\infty}\bigg) \\
&= \sum_i q_i \frac{\partial}{\partial \mu_i} \bigg(Q_0 - \sum_i q_j \frac{\partial F}{\partial \mu_j}\bigg) \\
&= -\sum_{ij} q_i q_j \frac{\partial^2 F}{\partial \mu_i \partial \mu_j} \\
&= C_{\mathrm{tot}}
\end{aligned}$$

> Note that we can define a capacitance matrix between the $V_i$'s, as $C_{ij} = - q_i q_j (\partial^2 F / \partial \mu_i \partial \mu_j) = (\partial Q_i / \partial V_j)_{\phi_\infty}$. This is a capacitance matrix in the 'open' sense, as it contains 'leaky' capacitance to an external fixed node (in this case to infinity). We'll return to capacitance matrices later on, especially focussing on the bulk contribution to $C_{ij}$; note however that $\sum_{ij} C_{ij}^{\mathrm{bulk}} = 0$, so the value of $C_{\mathrm{tot}}$ comes entirely from the surface.

### Charging

Now we can look at charging behaviour. Most simply by the variation of $\phi_\infty$ and using $\partial F / \partial \phi_\infty = Q$:

$$ F(\{\mu_i\},\phi_\infty) = F_0 + \int_{\tilde\psi_{\mathrm{PZC}}}^{\phi_\infty} Q \,\mathrm{d}\phi $$

where $\tilde\psi_{\mathrm{PZC}}$ is the "point of zero charge": a function of $\{\mu_i\}$ defined such that $Q=0$ when $\phi_\infty = \tilde\psi_{\mathrm{PZC}}$. You can think of this as the natural value of $\phi_\infty$ that the surface 'wants' to be at. It must be understood however that this $\tilde\psi_{\mathrm{PZC}}$ is a *surface* property, not intrinsic to the bulk, and can vary with e.g. contamination.

For example, in an electronic material $\tilde\psi_{\mathrm{PZC}} = -e(\bar\mu_{\mathrm{e}^-} + W_0)$ where $W_0$ would be the value of {% wiki "work function" %} for that surface, in the 'flat vacuum' condition. The value of $\tilde\psi_{\mathrm{PZC}}(\{\bar\mu_i\})$ is a sort of generalized owrk

Consequently, if our capacitance $C_{\mathrm{tot}}$ is a fixed number, then: $ F = F_0 - \tfrac{1}{2} C_{\mathrm{tot}} (\tilde\psi_{\mathrm{PZC}} - \phi_\infty)^2 $.

### Outer potential split

If you recall, in our previous topic we considered the value $\tilde\psi$ representing outer potential, where $\tilde\psi = \phi_\infty + Q/C_{\mathrm{geo}}$, where $C_{\mathrm{geo}}$ is the geometrical part of the capacitance. The idea of a well-defined geometrical capacitance can be an idealization, but it would mean $\mathrm{d}\phi_\infty = \mathrm{d}\tilde\psi - \mathrm{d}Q/C_{\mathrm{geo}}$, and the above integral would split into two parts:

$$ F(\{\mu_i\},\phi_\infty) = F_0 + \int_{\tilde\psi_{\mathrm{PZC}}}^{\tilde\psi} Q \,\mathrm{d}\psi + \int_0^Q \frac{-q}{C_{\mathrm{geo}}} \,\mathrm{d} q . $$

The first integral is the 'surface charging' energy, solely in terms of the $\tilde\psi$ value nearby the surface. The second integral evaluates to $- Q^2/(2C_{\mathrm{geo}})$ which then we can express in terms of $\tilde\psi$, as $- \tfrac{1}{2} C_{\mathrm{geo}} (\tilde\psi - \phi_\infty)^2$. In this way, we can break our $F$ function into modular parts:

$$ F(\{\mu_i\},\phi_\infty) = \underbrace{F_{\mathrm{bulk}}(\{\mu_i\}) + F_{\mathrm{surf}}(\{\mu_i\})}_{\text{neutral terms},~Q=0} + \underbrace{\int_{\tilde\psi_{\mathrm{PZC}}}^{\tilde\psi} Q(\psi) \,\mathrm{d}\psi}_{\text{surface capacitance}} - \underbrace{\tfrac{1}{2} C_{\mathrm{geo}} (\tilde\psi - \phi_\infty)^2}_{\text{external capacitance}}. $$

When written this way we must understand that $\tilde\psi$ represents a 'middle node' between $\tilde\psi_{\mathrm{PZC}}$ and $\phi_\infty$, and the value of $\tilde\psi$ must be self-consistent such that $\tilde\psi = \phi_\infty + Q(\tilde\psi)/C_{\mathrm{geo}}$.

## Takeaways

* Electrochemical potentials (and thus $V_i$) form a more natural set for describing the thermodynamics of charged bodies.
* When we try to split off the surface free energy of a charged system, we get surface charging capacitance type effects.

In the next topic we will return to $F_{\mathrm{bulk}}$ and examine its internal charge storage properties as a form of capacitance.

[**NEXT TOPIC: Capacitance**](../capacitance/)





{#    The following is unused: it is too much of a pain to try to go from U to F. The approach below is effectively a hybrid inbetween, and difficult to grasp.

## System with an homogeneous bulk and a charged surface (energy view)

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

#}
