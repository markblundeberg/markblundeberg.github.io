---
layout: layouts/base.njk
title: 'ESBD: An Intuitive Visualization for Electrochemistry'
tags: page
eleventyNavigation:
    key: Home
    order: 1
---

# Band Diagrams for Batteries? An Intuitive Visualization

Mark Lundeberg // originally uploaded 2025 April

**(Optional: Compelling Header Image/Animation showing a finished ESBD)**

Ever looked at a semiconductor {%wiki "band diagram" %} and thought, "Wow, that makes intuitive sense!"? They clearly show electron and hole energy levels, band bending, and driving forces; band diagrams are the universal visual language of semiconductor devices. Compare that to electrochemistry — trying to track electrode potentials, reference electrodes, solution potentials ($\phi$), ion chemical potentials ($\mu_i$), activities, junction potentials... it often feels like a confusing soup of concepts, right? What if we could bring some of that band diagram clarity to batteries, fuel cells, electrolysis, and more?

That's the idea behind **Electrochemical Species Band Diagrams (ESBDs)**. We leverage the fundamental thermodynamic concept governing all chemical and electrochemical processes – the **electrochemical potential ($\bar{\mu}_i$)** – to define the **species voltage $V_i$** and create a unified visual landscape that generalizes the band diagram to things besides just electrons.

This site explores this framework, with the goal of building <em>intuition</em> for scientists and engineers working across disciplines involving charged species in materials. This page will give a quick primer, and further articles (coming soon) will explore a wide variety of concepts. Let's dive in!

## Background: the electrochemical potential ($\bar{\mu}_i$)

How do mobile particles know where to move and when to react? For any individual particle, this is a mess of microscopic forces. On average though, we can zoom out and talk about statistical tendencies of similar particles, and these tendencies are characterized by the {%wiki "chemical_potential" %} $\mu_i$ for the type/_species_ of particle labelled $i$. Chemical potentials are to particles what temperature $T$ is to energy: when two bodies are in equilibrium they equalize their $\mu_i$'s and $T$'s by exchanging the fungible particles and energy. The chemical potential combines all the per-particle energy, the entropy, the diffusion, the <em>mess</em> ... in just the right way.

The dimensions of $\mu_i$ are energy per particle (or for chemists, energy per mole), often units of electron-volts $\mathrm{eV}$ (or for chemists, $\mathrm{kJ/mol}$).
You may already know the chemical potential by another representation or name: Fugacity. Activity. Water potential. Fermi level. They all encode $\mu_i$.

Particles want to go from high $\mu_i$ to low $\mu_i$, as surely as energy wants to go from high $T$ to low $T$. You can think of it as 'particles want to roll downhill'! It's that easy, check out this interactive demo:

{% include "esbd-diagrams/mu-driving-force.html" %}

{# Note - we're assuming bodies with equal temperature for now! #}

There is also **{%wiki "electrochemical potential" %}**, denoted with a little bar on top: $\bar{\mu}_i$. For reasons of convention, when we talk about charged particles (electrons and ions) we will refer to their proper thermodynamic $\mu_i$ as the electrochemical potential $\bar{\mu}_i$. It works the same in many ways, like charged particles want to go from high $\bar{\mu}_i$ to low $\bar{\mu}_i$. But thermodynamics can get weird with charged particles, and the energy of a charge is now sensitive to the average electrostatic potential it experiences. So although $\bar\mu_i$ is perfectly well defined in theory, it is not simply dependent on the local material environment.

{# Caveat - actually neutral particles' mu are sensitve to gravitational potential too! Important in e.g. water potential. #}

Not only can two bodies with totally identical compositions have any electrostatic offset that we want, but the electrostatic potential fundamentally has an arbitrary global offset. And to make matters worse, when the electrostatic offset changes by any amount (call it $\Delta \phi$), the $\bar{\mu}_i$ levels shift up or down _differently_, by an amount $z_iF\Delta \phi$ per mole ($z_i e\Delta \phi$ per particle) that is proportional to the species' charge level $z_i$. Here $F$ is Faraday's constant, which is the charge of 1 mole of protons (each with charge $e$).

This is illustrated in the following demo showing $\bar{\mu}_i$ for variously charged particles ($z_i = \{-2,-1,+1,+2\}$ for $\mathrm{A}^{2-}$, $\mathrm{B}^{-}$, $\mathrm{D}^{+}$, $\mathrm{E}^{2+}$) and a neutral particle ($\mathrm{C}$) in a hypothetical body of fixed composition.

{% include "esbd-diagrams/mu-shift-only.html" %}

Observe the effect when you move $\Delta \phi$. This makes comparing $\bar{\mu}_i$ levels between different materials or conditions rather annoying.

The traditional approach to deal with the weirdness of electrochemical potential is to define a **material electrostatic potential** $\phi$, and then subtract off each particle's electrostatic energy $z_i F \phi$ to arrive at a clean "internal" chemical potential, $\mu_{\mathrm{int},i} = \bar{\mu}_i - z_i F \phi$.

Adapting the previous demo, you can see now that $\mu_{\mathrm{int},i}$ are unaffected by $\Delta\phi$:

{% include "esbd-diagrams/mu-shift-mu-internal.html" %}

(Here, our value of $\phi=0$ happens to occur when we move the $\Delta\phi$ slider a bit to the right.)

This approach of subtracting off the $\phi$ dependence is helpful. It produces equations that work and resemble normal (neutral) chemistry. It's the textbook foundation of electrochemistry. It's ... maybe misleading? It turns out that while it was justified to define $\Delta \phi$ between otherwise identical bodies, the notion of 'the electrostatic potential in a material' $\phi$ is fundamentally hard (or impossible) to define. And so, when we correctly calculate any measurable quantity in electrochemistry, our choice of defining $\phi$ just cancels out anyway![ref] Unfortunately, the difficulties in defining $\phi$ only grow when moving beyond textbook dilute aqueous systems, and this directly translates to difficulties in defining $\mu_{\mathrm{int},i}$.

What if we could fix address the weirdness in $\bar{\mu}_i$ some other way?

## Voltage for ions: $V_i$

As a solid state physicist, I had to unlearn the idea that voltmeters let us measure electrostatic potential $\phi$. The subtle truth is that a voltmeter is a thermodynamic device: it lets electrons do thermodynamic work on it, and it measures that work. And so the voltmeter measures differences in the electron's electrochemical potential, not the electrostatic potential. For short, we can pretty much say that the "true" voltage is just $V = -\bar{\mu}_{\mathrm{e}^-} / F$ (or $/e$ if working per-particle) and that voltmeters just measure the differences in this voltage.

{# Specifically, when we attach a voltmeter to any electron-conductive materials 1 and 2, the measured voltage difference between those points 1 and 2 is $V(1) - V(2) = -[\bar{\mu}_{\mathrm{e}^-}(1) - \bar{\mu}_{\mathrm{e}^-}(2)]/e$ (or ${}/F$ for the chemists). #}

But why privilege electrons? What are the equivalent "voltages" driving other ions? We may not have practical ionic voltmeters but why not try treating them equally with electrons?

Let's define a **species voltage, $V_i$**, for _any_ charged species $i$:

$$V_i = \frac{\bar{\mu}_i}{z_i F}$$

This is the big idea. We just divide the energy per mole by the charge per mole (for per-particle that's $V_i = \bar{\mu}_i / (z_i e)$). That seems simple, maybe _too_ simple? Stick around, because this scaling has a profound consequences on the way that we can visualize electrochemistry.

Let's try shifting that electrostatic offset one more time:

{% include "esbd-diagrams/mu-V-unison-shift.html" %}

_Aha_! The $V_i$ levels for all charged species **shift together** by the exact same amount ($\Delta V_i = \Delta \phi$)! No longer a mess, although we haven't fully gotten rid of the effect of $\Delta \phi$ have we? That's okay, _we actually want it that way_!

(Readers who know semiconductor band diagrams might recognize this shifting-together property. It is a fundamental trait of band diagrams that makes them work.)

Remember before when we talked about particles going downhill in $\bar\mu$? Welcome to the the $V_i$ world, it's a little different but you'll get used to it:

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  **[Interactive Demo: Driving Force V]**<br>
  (Simple 'EnergyLevelsDiagram' showing $V$ levels for a cation and an anion in 'Body 1' vs 'Body 2', with arrows indicating flow direction based on the rules above.)
</div>

- **Cations ($z > 0$)** want to move from **high $V_+$ to low $V_+$**. (They "fall down" their $V_i$ landscape).
- **Anions ($z < 0$)** want to move from **low $V_-$ to high $V_-$**. (They "float up" their $V_i$ landscape).

That might sound familiar too, it's just the thermodynamic version of positive charges in a vacuum getting pushed from high $\phi$ to low $\phi$, or vice versa for negtive charges! The big difference is, now every specie of particle experiences a different voltage landscape $V_i$.

$V_i$ can have a landscape (dependence on position)? Let's see what it looks like.

## Introducing the Diagram: $V_i$ vs $x$

Okay, so $V_i$ gives us a consistent way to view potentials that shift uniformly. But devices have different materials and potentials change with _position_, $x$. We need to plot $V_i$ vs. $x$!

This leads us to the **Electrochemical Species Band Diagram (ESBD)**. Here's a first look at one for a simple system (don't worry about understanding every line just yet!):

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  **[Interactive ESBD Diagram: Concentration Cell (Salt Bridge)]**<br>
  (Show the diagram generated by ConcentrationCellComponent.js. Maybe initially hide standard states/anion via config.)
</div>

You can see different lines representing the $V_i$ for different species ($V_{e^-}$, $V_{\mathrm{Ag}^{+}}$, $V_{\mathrm{NO}_3^{-}}$) across different regions (electrodes, electrolytes). Features like the standard state potentials ($V^\ominus$) or interface reaction markers ($\rightleftharpoons$) provide more context, which we'll explore later. The key idea is visualizing the potential landscape for _all_ relevant charged species vs. position.

_Hint:_ Try clicking the Y-axis label or using the dropdown (if available in the example above) to switch between Volts, eV, and kJ/mol display modes!

---

## Explore More: Visual Guide

Intrigued? The real power of ESBDs becomes apparent when applied to various systems. Explore these topics through interactive diagrams and detailed explanations by clicking on an image below:

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  **[Gallery of Thumbnails: Grid of appealing images/GIFs linking to detailed pages/sections for Standard State Ladders, Concentration Cells, Li-ion Battery, Lead-Acid Battery, Electrolysis, Semiconductor Junctions, Theory/Nuances, etc.]**
</div>

**(Optional Text Navigation)**

Or explore by topic:

- _Electrodes_ - Electrodes and Lithium ion batteries. {# don't really need standard states or solutions at all for this discussion! discuss e.g. Zn2+/Zn electrode and end with Li Ion batteries. #}
- _Solutions_ - Concentrations and Junctions {# neutrality, standard states, salt bridges, membranes #}
- _Electrons and holes_ - Semiconductors {# comes after solutions so we can talk in detail about electron and hole standard states vs band edges. #} -- or,
- _Semiconductors_ - Electrons and holes {# comes after solutions so we can talk in detail about electron and hole standard states vs band edges. #}

- [Link to Electrochemistry Basics in V]
- [Link to Battery Examples]
- [Link to Advanced Concepts & Non-Equilibrium]
- [Link to Theory & Nuances]

---
