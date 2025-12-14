---
layout: layouts/esbd_topic.njk
title: 'Bulk thermodynamics'
tags: [page, esbd_topic]
orderESBD: 71
eleventyNavigation:
    key: Bulk thermodynamics
    parent: ESBD
    order: 71
---

# {{title}}

In the previous topic, we discussed the case of a floating body.

As a second part, we will discuss how we can define a grand-type ($\bar\mu_i$ control variables) free energy for bulk matter containing charged species, which is easier to use than the traditional ($N_i$ control variables) type of free energy used in electrochemistry.

Obviously, there is a need to address the case of homogeneous extensive systems, like beakers of electrolyte, without all those annoying surface charging effects. But every homogeneous system has a boundary. It thus becomes necessary to mechanically 'scrape away' the surface. But again this is no ordinary surface, and we cannot just apply regular surface methods (like Gibbs isotherm).

Let's describe the traditional electrochemistry thermodynamics approach, why it suffers problems, and what is the proper alternative.

## Review: thermodynamics of a floating charged body

In the last topic, we established that for a floating body its energy,

$$ U(X, \phi_{\infty}, N_1, N_2, \ldots), $$

will depend a great deal on the total charge $Q$, as:

$$ U = U_{\mathrm{int}} + Q \phi_\infty + \frac{Q^2}{2C} , $$

containing a contribution from electric potential $\phi_\infty$ and self-capacitance $C$, and the residual is the 'internal' energy $U_{\mathrm{int}}$ which we will be dissecting down below.

The chemical potential (which is electrochemical potential) is:

$$\begin{aligned}
\mu_i
&= \left(\frac{\partial U}{\partial N_i}\right)_{X,\phi_{\infty},N_{j\neq i}} \\
&= \mu_{\mathrm{int},i} + q_i \tilde\psi,
\end{aligned}$$

where

$$ \mu_{\mathrm{int},i} = \frac{\partial U_{\mathrm{int}}}{\partial N_i } $$

and

$$ \tilde\psi = \phi_{\infty} + Q / C, $$

We will take the charge to be:
$$ Q = \sum_i q_i N_i + Q_{\mathrm{fix}} $$
for species charge $q_i$, that is $q_i = z_i F$ (per mole) or $q_i = z_i e$ (per particle) and static background charge $Q_{\mathrm{fix}}$.

> The offset $Q_{\mathrm{fix}}$ allows us to represent things like semiconductor dopants (or their analogues): homogeneously distributed background charges that are a static part of the medium. This $Q_{\mathrm{fix}}$ is also part of our static medium variables represented by $X$, and we will assume below that it scales extensively (proportional to either the body's volume or the body's mass, whichever we are holding fixed).

## The traditional conclusion: raw bulk internal energy

Traditionally, we directly jump to simply extracting the 'bulk energy' $U_{\mathrm{bulk}}(X, N_1^{\mathrm{bulk}}, N_2^{\mathrm{bulk}}, \ldots)$. But our $N_i^{\mathrm{bulk}}$ arguments are overdetermined because they are constrained by charge neutrality. And so $U_{\mathrm{bulk}}$ partial derivatives don't even exist except in careful charge neutral combinations.

And there is another problem: we have fully lost the electrical state of the system. So not only is $U_{\mathrm{bulk}}$ an overdetermined thermodynamic function but worse yet, its variable set is incomplete.

Mathematically, the overall $U$ in the bulk limit is a singular thermodynamic energy (it explodes if any single $N_i$ is varied), while $U_{\mathrm{bulk}}$ is simultaneously both overspecified *and* missing information. These are simply awful functions to work with.


## Dissecting the internal energy into bulk and surface

Continuing the earlier discussion, we expect that the residual $U_{\mathrm{int}}$ is going to be roughly extensive (proportional to volume), however this is not strictly possible because the $N_i$ arguments we are feeding to $U_{\mathrm{int}}$ are not charge-neutral, and in contrast the bulk must be neutral.

We can expand $U_{\mathrm{int}}$ in terms of the 'charge neutral bulk':

$$U_{\mathrm{int}}(\{N_i\},\ldots) \approx U_{\mathrm{bulk}}(\{N_i^{\mathrm{bulk}}\},\ldots) + \sum_i \mu_{\mathrm{int},i} \cdot (N_i - N_i^{\mathrm{bulk}})  + \mathcal{O}((N - N^{\mathrm{bulk}})^2) $$

where:

* $\mu_{\mathrm{int},i}$ are the number derivatives of $U_{\mathrm{int}}$ and thus the internal part of chemical potentials:
  $$ \mu_{\mathrm{int},i} = \frac{\partial U_{\mathrm{int}}}{\partial N_i } $$
* $N_i^{\mathrm{bulk}}$ are close to $N_i$ but they are charge-neutral: $\sum_i q_i N_i^{\mathrm{bulk}} = -Q_{\mathrm{fix}}$ (again, $Q_{\mathrm{fix}}$ is an optional static but homogeneous background charge).
* $U_{\mathrm{bulk}}(X, N_1^{\mathrm{bulk}}, N_2^{\mathrm{bulk}},\ldots)$ is the extensive energy of the charge-neutral bulk. Note we cannot take derivatives of this function, it is only defined for a charge-neutral set of $N_i^{\mathrm{bulk}}$.
* The excess numbers $N_i - N_i^{\mathrm{bulk}}$ reflect which ions have been added/removed from the surface to make up the surface charge, and they are primarily a function of total charge $Q$ with some gradual dependence on $N_i^{\mathrm{bulk}}$.
* The term $\sum_i \mu_{\mathrm{int},i} \cdot (N_i - N_i^{\mathrm{bulk}})$ is basically an estimate of the surface's internal energy.
* We'll ignore the $\mathcal{O}((N - N^{\mathrm{bulk}})^2)$ term. Recall the phenomenology that the surface charge layer is insensitive to the exact disturbance, which means $N_i - N^{\mathrm{bulk}}_i \approx \alpha_i Q$ for some coefficients $\alpha$, and so this surface term would be $\mathcal{O}(Q^2)$ and thus effectively contain a modification to the total capacitance due to the Debye layer's chemical capacitance. For simplicity we'll assume this is insignificant compared to the system's geometric self-capacitance energy.

Now, just taking the form above (without the $\mathcal{O}((N - N^{\mathrm{bulk}})^2)$ terms and higher), we get the following useful relation which we'll use later on.

$$ U_{\mathrm{int}} - \sum_i \mu_{\mathrm{int},i} N_i = U_{\mathrm{bulk}} - \sum_i \mu_{\mathrm{int},i} N_i^{\mathrm{bulk}} $$

## The better way: grand free energies

As an alternative, let's Legendre transform our original charge-aneutral system energy into a grand-type free energy $F(X,\phi_{\infty},\mu_1,\mu_2,\ldots) = U - \sum_i \mu_i N_i$, and then extract the bulk out of that:

$$\begin{aligned}
F
& = F(X,\phi_{\infty},\mu_1,\mu_2,\ldots) \\
& = U - \sum_i \mu_i N_i \\
& = U_{\mathrm{int}} + Q \phi_{\infty} + \tfrac{1}{2C} Q^2  - \sum_i (\mu_{\mathrm{int},i} + q_i \phi_{\infty} + q_i Q/C) N_i \\
& = \big[U_{\mathrm{int}} - \sum_i \mu_{\mathrm{int},i} N_i \big] + Q \phi_{\infty} + \tfrac{1}{2C} Q^2 - (\phi_\infty + \tfrac{Q}{C}) (Q-Q_{\mathrm{fix}}) \\
& = \big[U_{\mathrm{bulk}} - \sum_i \mu_{\mathrm{int},i} N_i^{\mathrm{bulk}} \big] + Q_{\mathrm{fix}}\tilde\psi - \tfrac{1}{2C} Q^2 \\
& = \big[U_{\mathrm{bulk}} - \sum_i \mu_i N_i^{\mathrm{bulk}} - Q_{\mathrm{fix}}\tilde\psi  \big] + Q_{\mathrm{fix}}\tilde\psi - \tfrac{1}{2C} Q^2 \\
& = \big[U_{\mathrm{bulk}} - \sum_i \mu_i N_i^{\mathrm{bulk}} \big] - \tfrac{1}{2C} Q^2 \\
& = [F_{\mathrm{bulk}}] - \tfrac{1}{2} C (\tilde\psi - \phi_{\infty})^2
\end{aligned}$$

where we have used the charge neurality of $N_i^{\mathrm{bulk}}$, i.e., $\sum_i (\mu_i - \mu_{\mathrm{int},i}) N_i^{\mathrm{bulk}} = \tilde\psi \sum_i q_i N_i^{\mathrm{bulk}} = -\tilde\psi Q_{\mathrm{fix}}$, as well as $Q = C(\tilde\psi - \phi_{\infty})$ (and we are saying that $\tilde\psi$ can be written as a function of $\mu_i$, e.g. it is some weighted mean of $V_i=\mu_i/q_i$ values with a {% wiki "work function" %} offset). We thus arrive at a bulk free energy (which is the legendre transform of the 'defective' $U_{\mathrm{bulk}}$ above)

$$F_{\mathrm{bulk}}(X,\mu_1,\mu_2,\ldots) = U_{\mathrm{bulk}} - \sum_i \mu_i N_i^{\mathrm{bulk}} $$

This $F_{\mathrm{bulk}}$, free from the overdeterminism, is a perfectly well behaved thermodynamic function! Not only that, but in the classical limit (roughly $C\rightarrow 0$), the system free energy $F$ is also nonsingular (instead it is degenerate) and simply converges to $F_{\mathrm{bulk}}$. And, the properties of the bulk system are now entirely self-contained in terms of the $\mu_i$ (no $\phi_{\infty}$ dependence).

Something important to point is that while $U_{\mathrm{bulk}}$ is explicitly gauge *in*variant (because it removed electrical state altogether), in contrast $F_{\mathrm{bulk}}$ is generally gauge *co*variant. For any global potential shift $x$ we have $U_{\mathrm{bulk}}$ unchanged and thus:

$$F_{\mathrm{bulk}}(X,\mu_1 + q_1 x,\mu_2 + q_2 x,\ldots) = F_{\mathrm{bulk}}(X,\mu_1,\mu_2,\ldots) + Q_{\mathrm{fix}} x.$$

Here the leftover $Q_{\mathrm{fix}}x$ gauge covariant term can be thought of as 'charge that we have not Legendre transformed yet'; if we later decided that the fixed charges were actually mobile, then we could assign them electrochemical potentials and the free energy would then have $Q_{\mathrm{fix}}=0$ and would be gauge invariant. Note that it would be inappropriate to introduce the extrathermodynamic $\phi$ and subtract off $Q_{\mathrm{fix}} \phi$ to make that gauge covariant term disappear. If the charges are truly static, then the $Q_{\mathrm{fix}} x$ term is the elegant thermodynamic (and $\phi$-agnostic) way that the free energy is telling us about them, and not a mistake that needs fixing.

Obviously we could have gotten to $F_{\mathrm{bulk}}$ much more quickly from a postulated traditional $U_{\mathrm{bulk}}$, but the point of this journey is to emphasize that $U_{\mathrm{bulk}}$ and $F_{\mathrm{bulk}}$ are both extensive idealizations of real thermodynamic systems. It is the process of constructing that extensivity that forces us to reckon with electrostatics.
