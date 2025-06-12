---
layout: layouts/esbd_topic.njk
title: 'Thermodynamics'
tags: [page, esbd_topic]
orderESBD: 96
eleventyNavigation:
    key: Thermodynamics
    parent: ESBD
    order: 996
---

# {{title}}

So far I have been referring to electrochemical potentials $\bar\mu_i$ as the more fundamental true thermodynamic variable, which justifies $V_i$ as a first-class object. In contrast I have referred to internal chemical potentials and ion activities as artificial objects from the splitting of $\bar\mu_i$. I'd like to justify this point of view.

We can't address this within the standard assumptions of chemistry (homogeneity, extensivity, and charge neutrality). To see what is really going on we're going to have to relax our assumptions and go back to the fundamentals of thermodynamics that deal with real systems (inhomogeneous and charged).

## General thermodynamics with charged species

Suppose we have a thermodynamic body: floating, isolated, but at equilibrium. It has some total energy function

$$ U(S, V, N_1, N_2, \ldots) $$

depending on entropy $S$, volume $V$ and particle numbers $N_i$ for species $i$. We can define a chemical potential in the usual way:

$$ \mu_i = \bigg( \frac{\partial U}{\partial N_i} \bigg)_{S,V,N_{j\neq i}} . $$

{#
This is one of the awkward definitions of chemical potential since it requires holding entropy constant. Note though that it gives the same value as:

$$ \mu_i = \bigg( \frac{\partial A}{\partial N_i} \bigg)_{T,V,N_{j\neq i}}, $$

where $A(T,V,N_1, N_2, \ldots) = U - TS$ is the Helmholtz free energy.
#}

The above is just standard thermodynamics which applies to all systems.

What happens when we allow some of the $N_i$ to represent charged species? What is the nature of $\mu_i$? Thermodynamics only defines a chemical potential, and there is no concept of electrochemical potential, internal chemical potential, or electrostatic potential.

To answer this question requires care:

* **Equilibrium between bodies**: When two bodies are in equilibrium with respect to exchanging particles, they must have equal chemical potentials.
* **Charge-aneutrality**: Our partial derivative involves a change $\partial N_i$ that increases the number of that charged species, but as a consequence it must also increase the total charge on our thermodynamic body. In other words, the very definition of chemical potential $\mu_i$ of a charged species requires violating charge neutrality. 
* **Non-extensivity**: The nature of electricity involves long-distance interactions and surface effects which scale with neither volume nor surface area.

## Equilibrium between bodies

The zeroth law of thermodynamics concerns the idea of transitive equilibrium, that temperature is a well defined quantity. If body A and body B are each in thermal equilibrium with 
body C, then body A and B are also in thermal equilibrium. The equilibrium is described by a single parameter, the temperature $T$.

The same logic goes for chemical potential!

As we have seen, it is the electrochemical potential which equilibrates between bodies, and so the electrochemical potential does behave like a proper thermodynamic chemical potential. 

## Bodies without charge neutrality

The pure thermodynamic equations above have no distinction between "ion" or "non-ion". The usual next step is to push ahead by formally imposing ideas of charge and electrostatic potential.

But before that, I think a better approach is to look at phenomenology and play with some toy models. It is more important to get a feel of what kinds of things happen with ions.

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

The second term is an estimate of the energy stored in the electric field around the body:

$$U_{\mathrm{cap}} = \frac{Q^2}{2C},$$

where $C$ is the self-capacitance, which is proportional to the radius of our body.

### Impact of charging energy on $\mu_i$

We can take our above estimate of the charging energy and formally split it off from our total energy:

$$ U = U_{\mathrm{int}} + U_{\mathrm{pot}} + U_{\mathrm{cap}} , $$

where we expect that the residual $U_{\mathrm{int}}$ is going to be roughly extensive (proportional to volume). The main point is, the energy cost of deviating from charge neutrality is not a minor correction to internal energy (like a surface effect), but is a separate significant contribution.

Now we can use this split-apart $U$ to calculate chemical potential. Note that:

$$\bigg(\frac{\partial(U_{\mathrm{pot}} + U_{\mathrm{cap}})}{\partial N_i}\bigg)_{N_{j\neq i}} = q_i \tilde\psi, $$

where we have defined

$$ \tilde\psi = \phi_{\infty} + Q / C, $$

which is approximately the "outer potential" (the electric potential on the surface), so for the chemical potential we have:

$$ \mu_i = \bigg( \frac{\partial U_{\mathrm{int}}}{\partial N_i} \bigg)_{S,V,N_{j\neq i}} + q_i \tilde\psi. $$

Here we see that this $\mu_i$ resembles the standard decomposition of electrochemical potential, $ \bar\mu_i = \mu_{\mathrm{int},i} + q_i \phi $, though the two have different electric potentials. The crucial thing here is that $\mu_i$ is not only dependent on local composition, but is also strongly dependent on non-local effects via the shared total charge $Q$. This demonstrates that the true thermodynamic $\mu_i$ does not have the character of an internal chemical potential, but instead behaves as the electrochemical potential $\bar\mu_i$. So we can say simply $\mu_i = \bar\mu_i$. The two equations differ in their electric potentials ($\tilde\psi \neq \phi$) but that is merely a consequence of how we have chosen to artificially split apart the energy, i.e., it simply amounts to different $\mu_{\mathrm{int},i}$.

### Charging energy can dominate

The influence of $U_{\mathrm{cap}}$ is not simply a correction, but in fact for some thermodynamic properties it becomes the single dominant factor.

First, imagine we have a 10cm-wide charge-neutral blob (capacitance $C \approx 10^{-11}~\mathrm{farad}$) containing 100 moles of substance, and we add 1 mole of a solute.

* if we add 1 mole of uncharged solutes the energy $U$ will grow by around 1% and it will be about the same.
* if we add 1 mole of charged solutes (with 1 mole of elementary charges), its voltage will spike to $10^{16}~\mathrm{V}$ and its energy will rise by about $10^{21}~\mathrm{J}$. The blob will then explode with the energy of a thousand nuclear weapons.

Practically of course we see that charging energy does not dominate to this degree, but that is simply because 1) bodies tend to stay very close to charge neutrality precisely because it is so costly to deviate from neutraliy, and 2) bodies practically find all sorts of ways to dissipate excess charge. That does not mean that charging energy is totally negligible however, as usually bodies equilibrate to have a slightly nonzero charge!

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

{#

## Why bodies tend to stay close to charge neutrality

Practically, all bodies are charged to some degree but it is unusual to see them strongly charged.

From the above argument we can see why this is the case. Deviations from charge neutrality are simply energetically expensive.

 If an isolated body is strongly positively charged then $Q/C$ will be very large. So, its $\mu_i$ for positive ions will be very high (they want to leave), and its $\mu_i$ for negative ions will be very low (they want to come in). What's interesting here is that no matter which charged species is transferred, the effect is largely the same since they all influence each other through the total charge $Q$, and only a tiny number of charged particles (relative to the total number of particles) needs to be moved to neutralize the total charge. 

The precise mechanisms by which the dissipation varies in practice:

* Direct conduction: in contact with anything that is even slightly electrically conducting.
* Surface conduction: especially in humid environments, adsorbed water layers carry charge along the surfaces that are supposed to be electrically insulating.
* Air conduction: air tends to contain some ions due to ambient radiation (cosmic rays or nuclear decays).
* Coulomb instability: small suspended liquid droplets are only stable up to a certain charge, known as the Rayleigh limit (depending on size and surface tension). Beyond this [they tend to "spit" off excess charge](https://www.youtube.com/watch?v=F0F8P23DUo0) as microdroplets.

#}

## An ambiguity in energy




## Homogeneous and extensive systems

Finally, we turn to the 


## Takeaways

