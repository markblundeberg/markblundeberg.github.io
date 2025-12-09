---
layout: layouts/esbd_topic.njk
title: 'Thermodynamics'
tags: [page, esbd_topic]
orderESBD: 81
eleventyNavigation:
    key: Thermodynamics
    parent: ESBD
    order: 81
---

# {{title}}

So far I have been referring to electrochemical potentials $\bar\mu_i$ as the more fundamental true thermodynamic variable, which justifies $V_i$ as a first-class object. In contrast I have referred to internal chemical potentials and ion activities as artificial objects from the splitting of $\bar\mu_i$. This is not the normal view in chemistry books, where we often find that electrochemical potential $\bar\mu_i$ is a footnote.

We can't address this within the standard assumptions of chemistry (homogeneity, extensivity, and charge neutrality). To see what is really going on we're going to have to relax our assumptions and go back to the fundamentals of thermodynamics that deal with real systems (finite, inhomogeneous, and charged).

> A quick argument: It's worth noting that only electrochemical potentials can properly describe the chemical equilibrium of ions between different bodies. This principle alone (a 0th law of thermodynamics for ions) is enough justification for me, but if you're unconvinced then read on.

## General thermodynamics with charged species

Suppose we have a thermodynamic body: floating, isolated, but at equilibrium. It has some total energy function

$$ U(S, V, N_1, N_2, \ldots) $$

depending on entropy $S$, volume $V$ and particle numbers $N_i$ for species $i$. Note that while I'm using an entropy-volume basis, all of the below arguments also apply for temperature- or -pressure as bases.

We can define a chemical potential in the usual way:

$$ \mu_i = \bigg( \frac{\partial U}{\partial N_i} \bigg)_{S,V,N_{j\neq i}} . $$

{#
This is one of the awkward definitions of chemical potential since it requires holding entropy constant. Note though that it gives the same value as:

$$ \mu_i = \bigg( \frac{\partial A}{\partial N_i} \bigg)_{T,V,N_{j\neq i}}, $$

where $A(T,V,N_1, N_2, \ldots) = U - TS$ is the Helmholtz free energy.
#}

The above is just standard thermodynamics which applies to all systems.

What happens when we allow some of the $N_i$ to represent charged species? What is the nature of $\mu_i$? Thermodynamics only defines a chemical potential, and there is no concept of electrochemical potential, internal chemical potential, or electrostatic potential.

To answer this question requires care:

* **Charge-aneutrality**: Our partial derivative involves a change $\partial N_i$ that increases the number of that charged species, but as a consequence it must also increase the total charge on our thermodynamic body. In other words, the very definition of chemical potential $\mu_i$ of a charged species requires violating charge neutrality. 
* **Non-extensivity**: The nature of electricity involves long-distance interactions and surface effects which scale with neither volume nor surface area.

## Bodies without charge neutrality

At this point we could define some tiny chargeable statistical mechanical system and exactly solve it, but instead let's look at large bulky systems as chemistry tries to deal with. We are going to recognize some universal phenomenology of how ions behave that is extremely different from uncharged solutes. This kind of 'toy model' will give us what we need.

### Charge decouples from ion (charge moves to surfaces)

Consider a blob of salty water floating in space, containing dissociated $\mathrm{Na}^+$ and $\mathrm{Cl}^-$ ions. We add a single ion of potassium $\mathrm{K}^+$. We later go to look where the solitary $\mathrm{K}^+$ ion ends up: we will find it is likely floating inside the volume of the blob, and surrounded by a slight excess of $\mathrm{Cl}^-$ and slight depletion of $\mathrm{Na}^+$ ions. Locally, the positive charge of the $\mathrm{K}^+$ has been entirely screened away by its environment, and the assemblage of the $\mathrm{K}^+$ plus its local disturbance makes up a charge-neutral particle.

It seems like in the above example, the charge of the ion has disappeared. But since charge is conserved, it means that its charge has been transported away elsewhere. Indeed, we will find that the surface of this saltwater blob has had its charge increase by exactly $+e$, and this tiny amount of charge is delocalized over the entire surface. The natural course of things is that when we add a charged particle, the charge basically seems to leave the particle and become imprinted on the surface.

What's curious is that the amount of disturbance at the surface is highly sensitive to the total charge imbalance (i.e. the total surface charge), but it is far less sensitive to the exact kinds of ions we added to create the imbalance (whether we added $\mathrm{Na}^+$ or $\mathrm{K}^+$ or $\mathrm{Cu}^{2+}$). Clearly, the total charge is going to play a central role in any kind of toy model.

The total charge will be precisely
$$ Q = \sum_i q_i N_i $$
for species charge $q_i$, that is $q_i = z_i F$ (molar) or $q_i = z_i e$ (particular).

### The charging energy

We can use $Q$ alone estimate the energetic costs of a body deviating from charge neutrality as $U_{\mathrm{pot}} + U_{\mathrm{cap}}$.

The first term is the generic electric potential of the body sitting in a background electric potential $\phi_\infty$:

$$ U_{\mathrm{pot}} = Q \phi_\infty . $$

And in fact, this reveals that $\phi_{\infty}$ is a hidden external coordinate of our system energy, so we should actually write $U$ as:

$$ U(S, V, \phi_{\infty}, N_1, N_2, \ldots). $$

The second term is an estimate of the energy stored in the electric field around the body, which is part of the body's energy:

$$U_{\mathrm{cap}} = \frac{Q^2}{2C},$$

where $C$ is the {% wiki "self-capacitance" %}, which is proportional to the radius of our body.

### The residual energy (internal)

We can take our above estimate of the charging energy and formally split it off from our total energy:

$$ U = U_{\mathrm{int}} + U_{\mathrm{pot}} + U_{\mathrm{cap}} , $$

which leaves a residual "internal" energy $U_{\mathrm{int}}$. We expect that the residual $U_{\mathrm{int}}$ is going to be roughly extensive (proportional to volume), however the $N_i$ arguments we are feeding to $U_{\mathrm{int}}$ are not charge-neutral. We can expand $U_{\mathrm{int}}$ in terms of the 'charge neutral bulk':

$$U_{\mathrm{int}}(\{N_i\},\ldots) \approx U_{\mathrm{bulk}}(\{N_i^{\mathrm{bulk}}\},\ldots) + \sum_i \mu_{\mathrm{int},i} \cdot (N_i - N_i^{\mathrm{bulk}})  + \mathcal{O}((N - N^{\mathrm{bulk}})^2) $$

where:

* $\mu_{\mathrm{int},i}$ are the number derivatives of $U_{\mathrm{int}}$ and thus the internal part of chemical potentials:
  $$ \mu_{\mathrm{int},i} = \frac{\partial U_{\mathrm{int}}}{\partial N_i } $$
* $N_i^{\mathrm{bulk}}$ are close to $N_i$ but they are charge-neutral: $\sum_i q_i N_i^{\mathrm{bulk}} = 0$.
* $U_{\mathrm{bulk}}(S,V,N_1^{\mathrm{bulk}}, N_2^{\mathrm{bulk}},\ldots)$ is the extensive energy of the charge-neutral bulk.
* The excess numbers $N_i - N_i^{\mathrm{bulk}}$ reflect which ions have been added/removed from the surface to make up the surface charge, and they are primarily a function of total charge $Q$ with some gradual dependence on $N_i^{\mathrm{bulk}}$.
* We'll ignore the $\mathcal{O}((N - N^{\mathrm{bulk}})^2)$ term. Because approximately $N - N^{\mathrm{bulk}} \propto Q$, this would be $\mathcal{O}(Q^2)$ and thus effectively contain a modification to the total capacitance due to the Debye layer, but for simplicity we'll proceed without it.

### Impact of charging energy on $\mu_i$

Now we can use this split-apart $U$ to calculate chemical potential. Note that:

$$\bigg(\frac{\partial(U_{\mathrm{pot}} + U_{\mathrm{cap}})}{\partial N_i}\bigg)_{N_{j\neq i}} = q_i \tilde\psi, $$

where we have defined

$$ \tilde\psi = \phi_{\infty} + Q / C, $$

which is approximately the "outer potential" (the electric potential on the surface), so for the chemical potential we have:

$$ \mu_i = \frac{\partial U}{\partial N_i} = \mu_{\mathrm{int},i} + q_i \tilde\psi. $$

Here we see that this $\mu_i$ resembles the standard decomposition of electrochemical potential, $ \bar\mu_i = \mu_{\mathrm{int},i} + q_i \phi $, though the two have different electric potentials. The crucial thing here is that $\mu_i$ is not only dependent on local composition, but is also strongly dependent on non-local effects via the shared total charge $Q$. This demonstrates that the true thermodynamic $\mu_i$ does not have the character of an internal chemical potential, but instead behaves as the electrochemical potential $\bar\mu_i$.

So electrochemical potential *is* the only legitimate chemical potential: $\mu_i = \bar\mu_i$. The two equations differ in their electric potentials ($\tilde\psi \neq \phi$) but that is merely a consequence of how we have chosen to artificially split apart the energy into 'electrical' and 'non-electrical', i.e., it simply amounts to different $\mu_{\mathrm{int},i}$.

### Charging energy can dominate

The influence of $U_{\mathrm{cap}}$ is not simply a correction, but in fact for some thermodynamic properties it becomes the single dominant factor.

First, imagine we have a 10cm-wide charge-neutral blob (capacitance $C \approx 10^{-11}~\mathrm{farad}$) containing 100 moles of substance, and we add 1 mole of a solute.

* if we add 1 mole of uncharged solutes the energy $U$ will grow by around 1% and it will be about the same.
* if we add 1 mole of charged solutes (with 1 mole of elementary charges), its voltage will spike to $10^{16}~\mathrm{V}$ and its energy will rise by about $10^{21}~\mathrm{J}$. The blob will then explode with the energy of a thousand nuclear weapons.

Practically of course we see that charging energy does not dominate to this degree, but that is simply because 1) bodies tend to stay very close to charge neutrality precisely because it is so costly to deviate from neutraliy, and 2) bodies practically find all sorts of ways to dissipate excess charge. That does not mean that charging energy is totally negligible however, as usually bodies equilibrate to have a slightly nonzero charge (e.g. due to differences in work function with their environment).

Second, if we look at second derivatives, we can see how each added ion will shift the other ions' chemical potentials:

$$ \frac{\partial \mu_j}{\partial N_i} = \frac{\partial^2 U_{\mathrm{int}}}{\partial N_i \partial N_j} +  q_i q_j / C. $$

Here the first term is more chemical in behaviour, and is going to generally be inversely proportional to volume $V$, while the second term is inversely proportional to the radius, or $V^{1/3}$. Except in nano-sized systems, the latter term actually dominates! A term such as $q_i q_j / C$ resembles an interaction energy between different ions, but it is a strange nonlocal interaction entirely independent of where they are positioned inside the body. This tends to create a tight coupling between all the $\mu_i$ of ions: a slight addition or of removal of charge will shift all the $V_i$ levels almost perfectly in unison.

{#
### Non-floating bodies

In statistical mechanics and thermodynamics it is also common to switch from $N_i$ to $\mu_i$ as our thermodynamic variables. Conceptually this represents switching from a body that is isolated in particle exchange to one that that can freely exchange particles with a reservoir.

If we switch all particles to $\mu_i$, we obtain a so-called "grand" thermodynamics. We can also just switch some particles ("semi-grand").

Suppose we switch all charged particles to being reservoir-controlled (and while we're at it, we fix temperature $T$ as well). What we get is a thermodynamic free energy of the form:

$$ \Omega = U - TS - \sum_i \mu_i N_i . $$

What is interesting here is that (using our charging energy term) we will get something like:

$$ \Omega = \Omega_{\mathrm{int}} - \tfrac{1}{2} \frac{Q^2}{C}, $$

where $\Omega_{\mathrm{int}}$ is the internal grand free energy ($\Omega_{\mathrm{int}} \approx - P V$ for pressure $P$), but we see the electrostatic energy term here has flipped sign.
#}

## Can we assume charge neutrality?

Because charge aneutrality imposes such a strange energy $U_{\mathrm{cap}}$, and in recognition that bodies generally tend to stay at almost perfect charge neutrality ($Q\approx 0$), it is often assumed from the outset that there is perfect charge neutrality ($Q=0$). This is unfortunately a problem.

First, real bodies are never exactly charge neutral. Even though $Q$ is usually a very small number, its effects are still important! We expect $U$ or some free energies to be minimized, which means we expect $U_{\mathrm{cap}}$ is going to an energy of ordinary magnitude (not necessarily 0 though). If $U_{\mathrm{cap}}$ is not extremely large then *as a consequence* we get $Q \approx 0$.

Second, the chemical potential of an ion $\mu_i$ becomes immediately ill-defined. The very definition of chemical potential, $\mu_i = \partial U / \partial N_i$, requires varying the particle number $N_i$ while keeping others constant, which requires changing $Q$! If we assume strict charge neutrality then we can only consider *combined* chemical potentials that relate to adding equal amounts of positive and negative charges (i.e., combinations like $q_j\mu_i - q_i\mu_j$ or $V_i - V_j$). There is often an erroneous conclusion from this that only such combinations are well defined, which suggests we should have no fundamental preference for electrochemical potential or internal chemical potential. But such a conclusion only flows from the unrealistic assumption of exactly $Q=0$.

That said, permitting deviations from charge neutrality can be even more problematic if the energetic cost is not correctly modelled. Given the frustratingly non-local nature of electric energy that arises from charge concentrations, simplified models benefit greatly from assuming exact local charge neutrality.

## Going bulk: how to describe a homogeneous, charge-neutral *interior* of a thermodynamic system

Obviously, there is a need to address the case of homogeneous extensive systems, like beakers of electrolyte, without all those annoying surface charging effects. But every homogeneous system has a boundary. It thus becomes necessary to mechanically 'scrape away' the surface. But again this is no ordinary surface, and we cannot just apply regular surface methods (like Gibbs isotherm).

Let's describe the traditional approach, why it suffers problems, and what is the proper alternative.

### The traditional awkward path: raw bulk internal energy

Traditionally, we directly jump to simply extracting the 'bulk energy' $U_{\mathrm{bulk}}(S, V, N_1^{\mathrm{bulk}}, N_2^{\mathrm{bulk}}, \ldots)$, described above. But these our $N_i^{\mathrm{bulk}}$ arguments are overdetermined because they are constrained by charge neutrality. And so $U_{\mathrm{bulk}}$ partial derivatives don't even exist except in careful charge neutral combinations.

Mathematically, $U$ in the bulk limit is a singular thermodynamic energy (it explodes if any single $N_i$ is varied), while $U_{\mathrm{bulk}}$ isn't even a proper thermodynamic energy.

And there is another problem: we have fully lost the electrical state of the system. So not only is $U_{\mathrm{bulk}}$ an overdetermined thermodynamic function but worse yet, its variable set is incomplete.

### A better way: grand free energies

As an alternative, let's Legendre transform our original charge-aneutral system energy into a grand-type free energy $F(S,V,\phi_{\infty},\mu_1,\mu_2,\ldots) = U - \sum_i \mu_i N_i$, and then extract the bulk out of that:

$$\begin{aligned}
F
& = F(S,V,\phi_{\infty},\mu_1,\mu_2,\ldots) \\
& = U - \sum_i \mu_i N_i \\
& = U_{\mathrm{int}} + Q \phi_{\infty} + \tfrac{1}{2C} Q^2  - \sum_i (\mu_{\mathrm{int},i} + q_i \phi_{\infty} + q_i Q/C) N_i \\
& = \big[U_{\mathrm{int}} - \sum_i \mu_{\mathrm{int},i} N_i \big] + \tfrac{1}{2C} Q^2 - \tfrac{1}{C} Q^2 \\
& = \big[U_{\mathrm{bulk}} + \sum_i (N_i - N_i^{\mathrm{bulk}}) \mu_{\mathrm{int},i} - \sum_i \mu_{\mathrm{int},i} N_i \big] - \tfrac{1}{2C} Q^2 \\
& = \big[U_{\mathrm{bulk}} - \sum_i \mu_{\mathrm{int},i} N_i^{\mathrm{bulk}} \big] - \tfrac{1}{2C} Q^2 \\
& = \big[U_{\mathrm{bulk}} - \sum_i \mu_i N_i^{\mathrm{bulk}} \big] - \tfrac{1}{2C} Q^2 \\
& \approx [F_{\mathrm{bulk}}] - \tfrac{1}{2} C (\tilde\psi - \phi_{\infty})^2
\end{aligned}$$

where we have used the charge neurality of $N_i^{\mathrm{bulk}}$, i.e., $\sum_i (\mu_i - \mu_{\mathrm{int},i}) N_i^{\mathrm{bulk}} = \tilde\phi \sum_i q_i N_i^{\mathrm{bulk}} = 0$, as well as $Q = C(\tilde\psi - \phi_{\infty})$ (and we are saying that $\tilde\psi$ can be written as a function of $\mu_i$, e.g. it is some weighted mean of $V_i=\mu_i/q_i$ values with a {% wiki "work function" %} offset). We thus arrive at a bulk free energy (which is the legendre transform of the 'defective' $U_{\mathrm{bulk}}$ above)

$$F_{\mathrm{bulk}}(S,V,\mu_1,\mu_2,\ldots) = U_{\mathrm{bulk}} - \sum_i \mu_i N_i^{\mathrm{bulk}} $$

This $F_{\mathrm{bulk}}$, free from the overdeterminism, is a perfectly well behaved thermodynamic function! Not only that, but in the classical limit (roughly $C\rightarrow 0$), the system free energy $F$ is also nonsingular (instead it is degenerate) and simply converges to $F_{\mathrm{bulk}}$.

The properties of the bulk system are now entirely self-contained in terms of the $\mu_i$ (no $\phi_{\infty}$ dependence). Also note what the gauge invariance must look like now: For any $x$ we have
$$F_{\mathrm{bulk}}(S,V,\mu_1,\mu_2,\ldots) = F_{\mathrm{bulk}}(S,V,\mu_1 + q_1 x,\mu_2 + q_2 x,\ldots).$$

Although it does mean there are many sets of $\mu_i$ values that describe the same bulk chemical system, the fact is that *they are different systems* --- they are chemically the same but they differ in electrical state.

And, instead of us having to carefully feed in a set of charge neutral $N_i'$, the free energy simply spits out such a set for any set of arguments $\mu_i$:
$$ N_i' = -\frac{\partial F_{\mathrm{bulk}}}{\partial \mu_i} $$
where we can use the above gauge invariance to confirm that the set it outputs is always charge neutral:
$$ 0 = \frac{\partial F_{\mathrm{bulk}}}{\partial x} = \sum_i q_i \frac{\partial F_{\mathrm{bulk}}}{\partial \mu_i} = -\sum_i q_i N_i' = Q_{\mathrm{bulk}}$$

Obviously we could have gotten to $F_{\mathrm{bulk}}$ much more quickly from a postulated traditional $U_{\mathrm{bulk}}$, but the point of this journey is to emphasize that $U_{\mathrm{bulk}}$ and $F_{\mathrm{bulk}}$ are both extensive idealizations of real thermodynamic systems, and it is the process of constructing that extensivity that causes strange things to happen in the case of electrostatics.

### What about $\phi$?

There is then a question about what is the in-material electrostatic potential $\phi$. Note that this is very different from both $\phi_{\infty}$ and $\tilde\psi$ above, which are both vacuum potentials.

The actual thermodynamics simply does not need $\phi$, which should be no surprise since $\phi$ is unmeasurable. Instead, $\phi$ comes about from statistical mechanical models, such as the ideal-gas theory of ionic solutes (which we covered in the [Solutions](../solutions/) topic). However, it is quite arbitrary, especially in non-ideal solutions, which we will talk about in upcoming appendix topics.

## Takeaways

* Charge neutrality is not in fact exactly true for real thermodynamic systems. The actual deviation may be minor in terms of particle number, but the energetic consequences are overwhelming.
* The only natural chemical potential for a charged species is electrochemical potential, $\mu_i = \bar\mu_i$. This is true for every real thermodynamic system.
* When we idealize a real system to be extensive, the system itself forces charge neutrality.

