---
layout: layouts/base.njk
title: 'ESBD: An Intuitive Visualization for Electrochemistry'
tags: page
eleventyNavigation:
    key: Home
    order: 1
---

# Band Diagrams for Batteries? An Intuitive Visualization

Mark Lundeberg // 2025 April

{# **(Optional: Compelling Header Image/Animation showing a finished ESBD)** #}

Ever looked at a semiconductor device {%wiki "band diagram" %} and thought, "Wow, that makes intuitive sense!"? They clearly show electron and hole energy levels, band bending, equilibria, and driving forces. Band diagrams are the universal visual language of semiconductor devices.

Compare that to electrochemistry — trying to track electrode potentials, reference electrodes, solution potentials ($\phi$), ion chemical potentials ($\mu_i$), activities, junction potentials... it often feels like a confusing soup of concepts, right? What if we could bring some of that band diagram clarity to batteries, fuel cells, electrolysis, and more?

That's the idea behind **Electrochemical Species Band Diagrams (ESBDs)**. We are going back to basics, using fundamental thermodynamics to define a **species voltage $V_i$** and create a unified visual landscape that handles both electrons and ions.

This site explores this framework, with the goal of building <em>intuition</em> for scientists and engineers working across disciplines involving charged species in materials. This page will give a review of basic thermodynamics, and give a quick primer on the new idea. Further articles (coming soon) will explore a wide variety of concepts. Let's dive in!

## Chemical potential: 'temperature' for particle flow

How do mobile particles know where to move and when to react? For any individual particle, this is a mess of microscopic forces. On average though, we can zoom out and talk about statistical tendencies of similar particles, and these tendencies are characterized by the {%wiki "chemical_potential" %} $\mu_i$ for the type/_species_ of particle labelled $i$. Chemical potentials are to particles what temperature $T$ is to energy: when two bodies are in equilibrium they equalize their $\mu_i$'s and $T$'s by exchanging the fungible particles and energy. The chemical potential combines all the per-particle energy, the entropy, the diffusion, the <em>mess</em> ... in just the right way.

The dimensions of $\mu_i$ are energy per particle (or for chemists, energy per mole), often units of electron-volts $\mathrm{eV}$ (or for chemists, $\mathrm{kJ/mol}$).
You may already know the chemical potential by another representation or name: Fugacity. Activity. Water potential. Fermi level. They all encode $\mu_i$.

Particles want to go from high $\mu_i$ to low $\mu_i$, as surely as energy wants to go from high $T$ to low $T$. You can think of it as 'particles want to roll downhill'! It's that easy, check out this interactive demo:

{% include "esbd-diagrams/mu-driving-force.html" %}

{# Note - we're assuming bodies with equal temperature for now! #}

## The electrochemical potential ($\bar{\mu}_i$)

There is also **{%wiki "electrochemical potential" %}**, denoted with a little bar on top: $\bar{\mu}_i$. To avoid some terminology ambiguities, when we talk about charged particles (electrons and ions) we will refer to their proper thermodynamic $\mu_i$ as the electrochemical potential $\bar{\mu}_i$. It works the same in many ways, like charged particles want to go from high $\bar{\mu}_i$ to low $\bar{\mu}_i$. But thermodynamics can get weird with charged particles, as the energy (and thus $\bar\mu_i$) of a charge is sensitive to the average electrostatic potential. So although $\bar\mu_i$ is perfectly well defined in theory, it is not simply dependent on the local material environment.

{# Caveat - actually neutral particles' mu are sensitve to gravitational potential too! Important in e.g. water potential. #}

Let's imagine various hypothetical charged species $\mathrm{A}^{2-}$, $\mathrm{B}^{-}$, $\mathrm{D}^{+}$, $\mathrm{E}^{2+}$, and a neutral species $\mathrm{C}$, all together in a thermodnamic body. Here's an interactive visualization of how their electrochemical potentials would vary due to a change $\Delta\phi$ in the electrostatic potential:

{% include "esbd-diagrams/mu-shift-only.html" %}

The $\bar{\mu}_i$ levels move all over the place, seemingly at random! Actually, they're moving an amount $z_iF\Delta \phi$ per mole ($F$ is {%wiki "Faraday's constant" %} and $z_i$ is the ionic charge level, $-2$ or $+1$ etc.). If you prefer per-particle, that's $z_i e\Delta \phi$. Here $\Delta\phi$ could represent anything from a deliberate control variable to the arbitrary global offset in electric potentials.

Ionic systems always include at least one positive species and one negative species, and so these charge-dependent shifts in electrochemical potentials make it rather annoying to directly compare $\bar{\mu}_i$ values in different materials or conditions.

## How to tame your ion

The traditional approach to deal with the charge-dependent shifts in electrochemical potential is to define a **material electrostatic potential** $\phi$, and then subtract off each particle's electrostatic energy $z_i F \phi$ to arrive at a clean "internal" chemical potential, $\mu_{\mathrm{int},i} = \bar{\mu}_i - z_i F \phi$.

(Often $\mu_{\mathrm{int},i}$ is called "the chemical potential" and given symbol $\mu_i$, which can create ambiguity. To avoid confusion, I've adopted the unambiguous term "electrochemical potential" $\bar\mu_i$ for the proper, _total_ chemical potential of ions.)

Adapting the previous demo, you can see now that $\mu_{\mathrm{int},i}$ are unaffected by $\Delta\phi$:

{% include "esbd-diagrams/mu-shift-mu-internal.html" %}

This approach of partitioning off the $\phi$ dependence is quite helpful as $z_i F \phi$ seems simple and $\mu_{\mathrm{int},i}$ contains normal-ish chemistry. It does however mean that for electrochemical processes, it doubles the driving forces that we have to consider: an internal chemical component and an electrostatic component, which anyway sum to the measurable total driving force (from $\bar{\mu}_i$). So this does complicate our mental picture too.

What if we could regularize the charge-dependent shifts in $\bar{\mu}_i$ some other way?

## Meet $V_i$: a voltage for ions, too

As a solid-state physicist, I had to unlearn the idea that voltmeters let us probe the electrostatic potential $\phi$. The truth is that a voltmeter is a thermodynamic device: it lets electrons flow in and do thermodynamic work on it, and it measures that work. To make a long story short, the "true" voltage probed by a voltmeter is $V = -\bar{\mu}_{\mathrm{e}^-} / F$ (or $/e$ if working per-particle). Voltmeters measure differences in this absolute voltage $V$.

{# Specifically, when we attach a voltmeter to any electron-conductive materials 1 and 2, the measured voltage difference between those points 1 and 2 is $V(1) - V(2) = -[\bar{\mu}_{\mathrm{e}^-}(1) - \bar{\mu}_{\mathrm{e}^-}(2)]/e$ (or ${}/F$ for the chemists). #}

But why privilege electrons? What are the equivalent "voltages" driving other ions? We may not have practical ionic voltmeters but why not try treating them equally with electrons?

Let's define a **species voltage, $V_i$**, for _any_ charged species $i$:

$$V_i = \frac{\bar{\mu}_i}{z_i F}$$

This is the big idea. We just divide the energy per mole by the charge per mole (for per-particle that's $V_i = \bar{\mu}_i / (z_i e)$). That seems simple, maybe _too_ simple? Stick around, because this scaling has a profound consequence on the way that we can visualize electrochemistry.

Let's try shifting that electrostatic offset one final time:

{% include "esbd-diagrams/mu-V-unison-shift.html" %}

_Aha_! The $V_i$ levels for all charged species **shift together** by the exact same amount ($\Delta V_i = \Delta \phi$)! It's no longer as messy, although, we haven't fully gotten rid of the effect of $\Delta \phi$? Also there is no $V_{\rm C}$ for the neutral species. That's all okay, we actually want it that way.

(Readers who know semiconductor band diagrams might recognize this shifting-together property. It is a fundamental trait of band diagrams that makes them work.)

Remember before when we talked about particles going downhill in $\bar\mu$? Welcome to the the $V_i$ world, it's a little different but you'll get used to it:

- **Cations ($z > 0$)** want to move from **high $V_+$ to low $V_+$**. (They "fall down" their $V_i$ landscape).
- **Anions ($z < 0$)** want to move from **low $V_-$ to high $V_-$**. (They "float up" their $V_i$ landscape).

That might sound familiar too, it's just the thermodynamic version of positive charges in a vacuum getting pushed from high $\phi$ to low $\phi$, or vice versa for negtive charges! The big difference is, now each species of particle experiences a different voltage landscape $V_i$. That's because $V_i$ includes some chemical energy, which will differ from species to species.

$V_i$ can have a landscape (dependence on position)? Let's see what it looks like.

## Introducing the Diagram: $V_i$ vs $x$

Okay, so $V_i$ gives us a consistent way to view potentials that shift uniformly. But devices have different materials and potentials change with _position_, $x$. We need to plot $V_i$ vs. $x$!

This leads us to the **Electrochemical Species Band Diagram (ESBD)**. Here's a first look at one for a textbook system (don't worry about understanding every line just yet!):

{% include "esbd-diagrams/esbd-concentration-cell-agno3.html" %}

This is a silver nitrate {%wiki "concentration cell" %}: two solutions with differing concentrations of dissolved $\mathrm{AgNO}_3$, connected to each other by an ionic junction.A measurable voltage ($V_{\mathrm{e}^-}$ difference) develops in two silver metal electrodes that are dipped in the solutions.

You can see different lines representing the $V_i$ for different species ($V_{e^-}$, $V_{\mathrm{Ag}^{+}}$, $V_{\mathrm{NO}_3^{-}}$) across different regions (electrodes, electrolytes). Features like the standard state potentials ($V^\ominus$) or interface reaction markers ($\rightleftharpoons$) provide more context, which we'll explore later. The key idea is visualizing the potential landscape for _all_ relevant charged species vs. position.

It's just like a band diagram!

- $V_i$ are like Fermi levels.
- The standard states $V^\ominus_i$ are like the band edges.
- All the relative levels are invariant to global shifts in electrostatic potential (the shifting-together property).

In fact it's not just an analogy; if we applied this method to a semiconductor device, our diagram would be _exactly_ a band diagram... only upside down. To make it a bit more comfortable for the semiconductor physicists, I've added an 'eV' button that plots energy $E_i = -e V_i$, flipping it to what we're used to. But I do believe the $V_i$ form is the more natural form, it just takes getting used to. We'll explore the connection to classic band diagrams in a later topic below.

## Explore More: Visual Guide

Intrigued? The real power of ESBDs becomes apparent when applied to various systems. Explore these topics through interactive diagrams and detailed explanations by clicking on an image below:

---

[WIP from this point onwards]

Or explore by topic:

- _Electrodes_ - Electron-ion interfaces, and lithium ion batteries. {# don't really need standard states or solutions at all for this discussion! discuss e.g. Zn2+/Zn electrode and end with Li Ion batteries. #}
- _Solutions_ - Concentrations and junctions {# neutrality, standard states, salt bridges, membranes #}
- _Semiconductors_ - Electrons and holes, and classic band diagrams {# comes after solutions so we can talk in detail about electron and hole standard states vs band edges. #}
- _Electrochemistry_ - Connecting species voltage $V_i$ to traditional $\phi$-based electrochemistry

- [Link to Electrochemistry Basics in V]
- [Link to Battery Examples]
- [Link to Advanced Concepts & Non-Equilibrium]
- [Link to Theory & Nuances]

---
