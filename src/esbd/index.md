---
layout: layouts/base.njk
title: 'ESBD: An Intuitive Visualization for Electrochemistry'
tags: page
eleventyNavigation:
    key: Home
    order: 1
---

# Band Diagrams for Batteries? An Intuitive Visualization

**(Optional: Compelling Header Image/Animation showing a finished ESBD)**

Ever looked at a semiconductor band diagram and thought, "Wow, that makes intuitive sense!"? They clearly show electron and hole energy levels, band bending, and driving forces; band diagrams are the universal visual language of semiconductor devices. Compare that to electrochemistry — trying to track electrode potentials, reference electrodes, solution potentials ($\phi$), ion chemical potentials ($\mu_i$), activities, junction potentials... it often feels like a confusing soup of concepts, right? What if we could bring some of that band diagram clarity to batteries, fuel cells, electrolysis, and more?

That's the idea behind **Electrochemical Species Band Diagrams (ESBDs)**. We leverage the fundamental concept governing all chemical and electrochemical processes – the **electrochemical potential ($\bar{\mu}_i$)** – to create a unified visual landscape.

This site explores this framework, with the goal of building _intuition_ for scientists and engineers working across disciplines involving charged species in materials. This page will give a quick primer, and further articles (coming soon) will explore a wide variety of concepts. Let's dive in!

## Background: The Electrochemical Potential ($\bar{\mu}_i$)

How do mobile particles know where to move and when to react? For any individual particle, this is a mess of microscopic forces. On average though, we can zoom out and talk about statistical tendencies of similar particles, and these tendencies are characterized by chemical potential $\mu_i$ for the type/_species_ of particle labelled $i$. Chemical potentials are to particles what temperature $T$ is to energy: when two bodies are in equilibrium they equalize their $\mu_i$'s and $T$'s by exchanging the fungible particles and energy. The chemical potential combines all the per-particle energy, the entropy, the diffusion, the _mess_ ... in just the right way.

You may already know the chemical potential by another representation or name: Fugacity. Activity. Water potential. Fermi level. They all encode $\mu_i$. There is also **electrochemical potential $\bar{\mu}_i$**: for reasons of convention, when we talk about charged particles (electrons and ions) we will refer to their proper thermodynamic $\mu_i$ as the electrochemical potential.

No matter what you call it and no matter the kind of particles, the particles want to go from high $\mu_i$ to low $\mu_i$, as surely as energy wants to go from high $T$ to low $T$. The value of $\mu_i$ (or $\bar{\mu}_i$) is energy per particle (or energy per mole), and you can think of it as 'particles want to roll downhill'! It's that easy.

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  **[Interactive Demo: Driving Force]**<br>
  (Using 'EnergyLevelsDiagram' showing $\bar{\mu}_i$ for one species in 'Body 1' vs 'Body 2', with an arrow indicating flow direction. Link the difference to a slider.
</p>

With charged particles, the thermodynamics is a little bit funky and weird, because part of the energy of a charged particle is due to the "absolute" electrostatic potential. So although $\bar\mu_i$ is perfectly well defined in theory, it is not simply dependent on the local material environment. Not only can two bodies with totally identical compositions have any electrostatic difference that we want, but the electrostatic potential fundamentally has an arbitrary global offset. And to make matters worse, the $\bar{\mu}_i$ levels shift up or down by an amount proportional to the species' charge, $z_i$. Electrons shift differently than $\mathrm{Li}^{+}$ ions shift differently than $\mathrm{O}^{2-}$ ions. This makes comparing $\bar{\mu}_i$ levels between different materials or conditions a bit annoying, as all the $\bar{\mu}_i$ values depend on both the local chemistry and the (often arbitrary) electrostatic offset.

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  Interactive demo of charging effect somehow?
  Left: \bar\mu_i with 'original' levels.
  Right: \bar\mu_i with 'shifted' levels. Same composition but different mu's
</p>

The standard approach in electrochemistry to deal with the weirdness of electrochemical potential is to define an electrostatic potential $\phi$ inside materials, and subtract off all that nastiness to arrive at a clean "internal chemical potential" $\mu_{\mathrm{int},i} = \bar{\mu}_i - z_i F \phi$. Let's adapt the above demo:

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  Show the 'phi' solution to the $\bar{\mu}_i$ problem here.
  Left: \bar\mu_i with shifting levels.
  Right: \mu_{int,i}
</p>

This approach of subtracting off the $\phi$ dependence is admirable. It produces equations that work. It's the textbook foundation of electrochemistry. It's ... maybe unnecessary? It turns out that the notion of 'the electrostatic potential in a material' is fundamentally hard (or impossible) to define. And so, when we correctly calculate any measurable quantity in electrochemistry, our choice of defining $\phi$ just cancels out anyway![ref] Unfortunately, the difficulties in defining $\phi$ only grow when moving beyond textbook dilute aqueous systems, and this directly translates to difficulties in defining $\mu_{\mathrm{int},i}$.

What if we could fix the weirdness in $\bar{\mu}_i$ some other way?

## Voltage for ions: $V_i$

As a solid state physicist, I had to unlearn something about a simple yet fundamental instrument: _the humble voltmeter_. I'd learned that it just measures electrostatic potentials. It turns out it's more subtle than that. The voltmeter is really a thermodynamic device that measures electrochemical potentials (much as a thermometer measures $T$).[ref] Specifically a voltmeter measures difference in the _electron's_ electrochemical potential, scaled by its charge: $\Delta V = -\Delta \bar{\mu}_{\mathrm{e}^-} /e$ (that's $- \Delta \bar{\mu}_{\mathrm{e}^-} / F$ for the chemists). The voltmeter lets electrons do thermodynamic work on it, and it measures that work. We can pretty much say that 'absolute voltage' is simply $V = -\bar{\mu}_{\mathrm{e}^-} / e$ and voltmeters just measure the differences in this 'true thermodynamic voltage'.

But why privilege electrons? What are the equivalent "voltages" driving other ions? We may not have practical ionic voltmeters but why not try treating them equally with electrons? Well get ready for it, here's the big idea I want you to take to heart:

Let's define a **Species Voltage, $V_i$**, for _any_ charged species $i$:

$$V_i = \frac{\bar{\mu}_i}{z_i F}$$

That's it! We just divide the energy per mole by the charge per mole! (for per-particle that's $V_i = \bar{\mu}_i / (z_i e)$) It seems simple, maybe _too_ simple? Stick around, because this scaling has a profound consequences in the way we can visualize electrochemistry. Let's try shifting that electrostatic offset again:

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  **[Interactive Demo: Unison Shift]**<br>
  (Side-by-side 'EnergyLevelsDiagram' instances. Slider controls global $\phi$. Left plots $\bar{\mu}_i$ for A²⁻, B⁻, C⁰, D⁺, E²⁺. Right plots $V_i$ for charged species.)
</div>

**Aha! Moment #1:** As you change the electrostatic offset $\phi$ with the slider, notice how the $\bar{\mu}_i$ levels on the left shift by different amounts (depending on $z_i$), creating a confusing picture. But on the right, the $V_i$ levels for all charged species **shift together** by the exact same amount ($\Delta V_i = \Delta \phi$)! This "Unison Shift" means the $V_i$ representation cleanly separates the intrinsic chemical/activity effects from simple, uniform electrostatic offsets. The _relative differences_ between $V_i$ levels become invariant to the choice of $\phi$ zero.

Now, how do things move in this $V$ world? The driving force ($\nabla \bar{\mu}_i$) translates nicely:

- **Cations ($z > 0$)** want to move from **high $V_+$ to low $V_+$**. (They "fall down" the $V$ landscape).
- **Anions ($z < 0$)** want to move from **low $V_-$ to high $V_-$**. (They "float up" the $V$ landscape).

<p class="diagram-placeholder" style="border: 1px dashed #ccc;">
  **[Interactive Demo: Driving Force V]**<br>
  (Simple 'EnergyLevelsDiagram' showing $V$ levels for a cation and an anion in 'Body 1' vs 'Body 2', with arrows indicating flow direction based on the rules above.)
</div>

This gives us the complete thermodynamic driving force, analogous to $\Delta V$ driving current in Ohm's law, but specific to each type of charge carrier. This might be **Aha! Moment #2**!

---

## Introducing the ESBD Diagram

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

- [Link to Electrochemistry Basics in V]
- [Link to Battery Examples]
- [Link to Advanced Concepts & Non-Equilibrium]
- [Link to Theory & Nuances]

---
