---
layout: layouts/esbd_topic.njk
title: 'Thermodynamics'
tags: [page, esbd_topic]
orderESBD: 70
eleventyNavigation:
    key: Thermodynamics
    parent: ESBD
    order: 70
---

# {{title}}

So far I have been referring to electrochemical potentials $\bar\mu_i$ as the more fundamental true thermodynamic variable, which justifies $V_i=\bar\mu_i/q_i$ as a first-class object. In contrast I have referred to internal chemical potentials and ion activities as artificial objects from the splitting of $\bar\mu_i$. This is not the normal view in chemistry books, where we often find that electrochemical potential $\bar\mu_i$ is a footnote or that both $\bar\mu_i$ and $\mu_{\mathrm{int},i}$ are regarded as "equally valid".

We can't address this within the standard assumptions of chemistry (homogeneity, extensivity, and charge neutrality). To see what is really going on we're going to have to relax our assumptions and go back to the fundamentals of thermodynamics that deal with real systems (inhomogeneous, finite, and charged).

> A quick argument: It's worth noting that only electrochemical potentials can properly describe the chemical equilibrium of ions between different bodies. This is a 0th law of thermodynamics, for ionic chemical potentials.

## General thermodynamics with charged species

Suppose we have a thermodynamic body: floating, isolated, but at equilibrium. It has some total energy function (or free energy function)

$$ U(X, N_1, N_2, \ldots) $$

particle numbers $N_i$ for species $i$. Here $X$ stands for the static variables we are not going to vary (e.g. $X$ could be entropy and volume and solvent/medium mass so $U$ represents total energy, or $X$ could be pressure and temperature and solvent mass and $U$ is a Gibbs free energy, or other options).

We then define a chemical potential in the usual way:

$$ \mu_i = \bigg( \frac{\partial U}{\partial N_i} \bigg)_{X,N_{j\neq i}} . $$

The above is just standard thermodynamics which applies to all systems.

What happens when we allow some of the $N_i$ to represent charged species? What is the nature of $\mu_i$? Thermodynamics only defines a chemical potential, and there is no concept of electrochemical potential, internal chemical potential, or electrostatic potential. Maybe $\mu_i$ is something else entirely?

To answer this question requires care:

* **Charge-aneutrality**: Our partial derivative involves a change $\partial N_i$ that increases the number of that charged species, but as a consequence it must also increase the total charge on our thermodynamic body. In other words, the very definition of chemical potential $\mu_i$ of a charged species requires violating charge neutrality. 
* **Non-extensivity**: The nature of electricity involves long-distance interactions and surface effects which scale with neither volume nor surface area.

## Bodies without charge neutrality

At this point we could define some tiny chargeable statistical mechanical system and exactly solve it, but instead let's look at large macroscopic systems that chemistry deals with. We are going to recognize some universal phenomenology of how ions behave that is extremely different from uncharged solutes. This kind of 'toy model' will give us what we need.

### Charge decouples from ion (charge moves to surfaces)

Consider a blob of salty water floating in space, containing dissociated $\mathrm{Na}^+$ and $\mathrm{Cl}^-$ ions. We add a single ion of potassium $\mathrm{K}^+$. We later go to look where the solitary $\mathrm{K}^+$ ion ends up: we will find it is likely floating inside the volume of the blob, and surrounded by a slight excess of $\mathrm{Cl}^-$ and slight depletion of $\mathrm{Na}^+$ ions. Locally, the positive charge of the $\mathrm{K}^+$ has been entirely screened away by its environment, and the assemblage of the $\mathrm{K}^+$ plus its local disturbance makes up a charge-neutral particle.

It seems like in the above example, the charge of the ion has disappeared. But since charge is conserved, it means that its charge has been transported away elsewhere. Indeed, we will find that the surface of this saltwater blob has had its charge increase by exactly $+e$, and this tiny amount of charge is delocalized over the entire surface. The natural course of things is that when we add a charged particle, the charge basically seems to leave the particle and become imprinted on the surface.

What's curious is that the nature of the disturbance at the surface is highly sensitive to the total charge imbalance (i.e. the total surface charge), but it is far less sensitive to the exact kinds of ions we added to create the imbalance (whether we added $\mathrm{Na}^+$ or $\mathrm{K}^+$ or $\mathrm{Cu}^{2+}$). Clearly, the total charge is going to play a central role in any kind of model of a chargeable body.

We will take the charge to be:
$$ Q = \sum_i q_i N_i + Q_0 $$
for species charge $q_i$, that is $q_i = z_i F$ (per mole) or $q_i = z_i e$ (per particle) and static background charge $Q_0$ (the background lets us represent things like semiconductor dopants). Really the main fact we are going to be using is that $\partial Q / \partial N_i = q_i$.

### The charging energy (external)

The total charge $Q$ alone lets us estimate the energetic costs of a body deviating from charge neutrality, which comes as two terms:

$$ Q \phi_\infty + \frac{Q^2}{2C} $$

The first contribution is the generic electric potential of any charge sitting in a background electric potential $\phi_\infty$.
The second term is an estimate of the energy stored in the electric field around the body, which is part of the body's energy (also called self-energy), where $C$ is the {% wiki "self-capacitance" %}, generally proportional to the radius of our body.

Also, this reveals that $\phi_{\infty}$ is an external coordinate of our system energy, so we should actually write $U$ as:

$$ U(X, \phi_{\infty}, N_1, N_2, \ldots). $$

We can take our above estimate of the charging energy and formally split it off from our total energy:

$$ U(X, \phi_{\infty}, N_1, N_2, \ldots) = U_{\mathrm{int}}(X, N_1, N_2, \ldots) + Q \phi_\infty + \frac{Q^2}{2C} , $$

for 'internal' energy $U_{\mathrm{int}}$. Note, I've added $\phi_{\infty}$ as an external coordinate that influences $U$, but it does not directly influence $U_{\mathrm{int}}$. Also, $U_{\mathrm{int}}$ will also contain both bulk and surface contributions (including some minor surface contributions due to the charge $Q$ being imprinted on the surface), but we won't get into that until the next topic.

### The chemical potential $\mu_i$

Now we can use this split-apart $U$ to calculate chemical potential:

$$\begin{aligned}
\mu_i
&= \left(\frac{\partial U}{\partial N_i}\right)_{X,\phi_{\infty},N_{j\neq i}} \\
&= \mu_{\mathrm{int},i} + q_i \tilde\psi,
\end{aligned}$$

where

$$ \mu_{\mathrm{int},i} = \frac{\partial U_{\mathrm{int}}}{\partial N_i } $$

and

$$ \tilde\psi = \phi_{\infty} + Q / C, $$

which is approximately the "outer potential" (the electric potential on the surface). The crucial thing here is that $\mu_i$ is not only dependent on local composition, but is also strongly dependent on non-local effects via the shared total charge $Q$.

This $\mu_i = \mu_{\mathrm{int},i} + q_i \tilde\psi$ resembles the standard decomposition of electrochemical potential, $ \bar\mu_i = \mu_{\mathrm{int},i}' + q_i \phi $, though the two have different electric potentials and different $\mu_{\mathrm{int},i}$. But they are both interpretable as the energy needed to move from a 'zero level' reference state to inside the body.

* $q_i \tilde\psi$ is the energy needed to bring an ion to just to outside the body's surface, and $\mu_{\mathrm{int},i}$ is the energy to move it from there to inside the chemical system.
* $q_i \phi$ is the energy needed to bring an ion instead to a hypothetical internal electrostatic potential of $\phi$, and $\mu_{\mathrm{int},i}'$ is the energy to move it from that that hypothetical potential into the actual internal chemical system.

This demonstrates that the true thermodynamic $\mu_i$ does not have the character of an internal chemical potential, but instead behaves as the electrochemical potential $\bar\mu_i$.

So **electrochemical potential *is* the only legitimate chemical potential**: $\mu_i = \bar\mu_i$. The two equations differ in their electric potentials ($\tilde\psi \neq \phi$) but that is merely a consequence of how we have chosen to artificially split apart the energy into 'electrical' and 'non-electrical', i.e., it simply amounts to different $\mu_{\mathrm{int},i}$. 

## Commentary

So, we have established that electrochemical potential is fundamental. But it's worth noting some other properties of charged bodies.

### Charging energy can dominate

The influence of $\frac{Q^2}{2C}$ is not simply a correction, but in fact for some thermodynamic properties it becomes the single dominant factor.

First, imagine we have a 10cm-wide charge-neutral blob (capacitance $C \approx 10^{-11}~\mathrm{farad}$) containing 100 moles of substance, and we add 1 mole of a solute.

* if we add 1 mole of uncharged solutes the energy $U$ will grow by around 1% and it will be about the same.
* if we add 1 mole of charged solutes (with 1 mole of elementary charges), its voltage will spike to $10^{16}~\mathrm{V}$ and its energy will rise by about $10^{21}~\mathrm{J}$. The blob will then explode with the energy of a thousand nuclear weapons.

Practically of course we see that charging energy does not dominate to this degree, but that is simply because 1) bodies tend to stay very close to charge neutrality precisely because it is so costly to deviate from neutraliy, and 2) bodies practically find all sorts of ways to dissipate excess charge. That does not mean that charging energy is totally negligible however, as usually bodies equilibrate to have a slightly nonzero charge (e.g. due to differences in work function with their environment).

Second, if we look at second derivatives, we can see how each added ion will shift the other ions' chemical potentials:

$$ \frac{\partial \mu_j}{\partial N_i} = \frac{\partial^2 U_{\mathrm{int}}}{\partial N_i \partial N_j} +  q_i q_j / C. $$

Here the first term is more chemical in behaviour, and is going to generally be inversely proportional to volume $V$, while the second term is inversely proportional to the radius, or $V^{1/3}$. Except in nano-sized systems, the latter term actually dominates! A term such as $q_i q_j / C$ resembles an interaction energy between different ions, but it is a strange nonlocal interaction entirely independent of where they are positioned inside the body. This tends to create a tight coupling between all the $\mu_i$ of ions: a slight addition or of removal of charge will shift all the $V_i$ levels almost perfectly in unison.

### Can we assume charge neutrality?

Because charge aneutrality imposes such a strange energy $\tfrac{1}{2C}Q^2$, and in recognition that bodies generally tend to stay at almost perfect charge neutrality ($Q\approx 0$), it is often assumed from the outset that there is perfect charge neutrality ($Q=0$). This is unfortunately a problem.

First, real bodies are never exactly charge neutral. Even though $Q$ is usually a very small number, its effects are still important! We expect $U$ or some free energies to be minimized, which means we expect $\tfrac{1}{2C}Q^2$ is going to an energy of ordinary magnitude (not necessarily 0 though). If $\tfrac{1}{2C}Q^2$ is not extremely large then *as a consequence* we get $Q \approx 0$.

Second, the chemical potential of an ion $\mu_i$ becomes immediately ill-defined. The very definition of chemical potential, $\mu_i = \partial U / \partial N_i$, requires varying the particle number $N_i$ while keeping others constant, which requires changing $Q$! If we assume strict charge neutrality then we can only consider *combined* chemical potentials that relate to adding equal amounts of positive and negative charges (i.e., combinations like $q_j\mu_i - q_i\mu_j$ or $V_i - V_j$). There is often an erroneous conclusion from this that only such combinations are well defined, which suggests we should have no fundamental preference for electrochemical potential or internal chemical potential. But such a conclusion only flows from the unrealistic assumption of exactly $Q=0$.

That said, permitting deviations from charge neutrality can be even more problematic if the energetic cost is not correctly modelled. Given the frustratingly non-local nature of electric energy that arises from charge concentrations, simplified models benefit greatly from assuming exact local charge neutrality.

### What about $\phi$?

There is then a question about what is the in-material electrostatic potential $\phi$. Note that this is very different from both $\phi_{\infty}$ and $\tilde\psi$ above, which are both vacuum potentials.

The actual thermodynamics simply does not need $\phi$, which should be no surprise since $\phi$ is unmeasurable. Instead, $\phi$ comes about from statistical mechanical models, such as the ideal-gas theory of ionic solutes (which we covered in the [Solutions](../solutions/) topic). However, it is quite arbitrary, especially in non-ideal solutions, which we will talk about in an upcoming appendix topic.

## Takeaways

* Charge neutrality is not in fact exactly true for real thermodynamic systems. The actual deviation may be minor in terms of particle number, but the energetic consequences are overwhelming.
* Assuming charge neutrality a priori makes it impossible to define ionic or electronic chemical potentials.
* The only natural chemical potential for a charged species is electrochemical potential, $\mu_i = \bar\mu_i$. This is true for every real thermodynamic system.

In the next topic we will dissect how a finite system can be dissected into bulk and surface contributions, and what this actually means for the bulks of extensive systems that contain ions and electrons.

[**NEXT TOPIC: Bulk thermodynamics**](../thermodynamics2/)
