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

Ever looked at a semiconductor band diagram and thought, "Wow, that makes intuitive sense!"? Those diagrams clearly show electron and hole energy levels, band bending, and driving forces. Now, compare that to electrochemistry – trying to track electrode potentials, reference electrodes, solution potentials ($\phi$), ion chemical potentials ($\mu_i$), activities, junction potentials... it often feels like a confusing soup of concepts, right? What if we could bring some of that band diagram clarity to batteries, fuel cells, electrolysis, and more?

That's the idea behind **Electrochemical Species Band Diagrams (ESBDs)**. We leverage the fundamental concept governing all chemical and electrochemical processes – the **electrochemical potential ($\bar{\mu}_i$)** – to create a unified visual landscape.

This site explores this framework. Our goal isn't necessarily rigorous derivations (though we'll link to those!) but building _intuition_ for scientists and engineers working across disciplines involving charged species in materials. Let's dive in!

---

## The Foundation: Electrochemical Potential ($\bar{\mu}_i$) - The "Real" Energy

Forget splitting energies into "chemical" and "electrical" for a moment. The most fundamental quantity telling us where charged particles (like ions and electrons) _want_ to go is their **electrochemical potential, $\bar{\mu}_i$**.

Think of it like gravitational potential energy – things naturally move from high energy to low energy. Similarly, **species $i$ spontaneously moves from a location with high $\bar{\mu}_i$ to a location with low $\bar{\mu}_i$**. This applies to electrons, ions, holes, everything! It's the true driving force. (Even neutral species follow their _chemical_ potential $\mu_i$, which is part of $\bar{\mu}_i$).

<div class="interactive-placeholder" style="border:1px dashed #ccc; padding: 20px; margin: 1em 0; text-align: center; background-color: #f9f9f9;">
  **[Interactive Demo: Driving Force]**<br>
  (Using 'EnergyLevelsDiagram' showing $\bar{\mu}_i$ for one species in 'Body 1' vs 'Body 2', with an arrow indicating flow direction. Maybe link $\bar{\mu}_i$ level to a slider?)
</div>

So why don't we just plot $\bar{\mu}_i$ everywhere? Because it has a "weird" property related to the electrostatic potential, $\phi$. The definition $\bar{\mu}_i = \mu_i + z_i F \phi$ means that if we change the overall electrostatic environment $\phi$ (like charging a piece of metal), the $\bar{\mu}_i$ levels shift up or down by an amount proportional to the species' charge, $z_i$. Electrons ($z_i=-1$) shift differently than Li⁺ ions ($z_i=+1$) or O²⁻ ions ($z_i=-2$). This makes comparing $\bar{\mu}_i$ levels between different materials or conditions tricky, as the shifts depend on both chemistry ($\mu_i$) and the often arbitrary electrostatic offset $\phi$. (What _is_ the absolute voltage zero, anyway? [Link to Thermodynamics Page])

What if we could scale $\bar{\mu}_i$ to remove this charge-dependent electrostatic shift?

---

## The Scaling: Species Voltage ($V_i$) - The "Real" Voltage

We know voltmeters measure potential _difference_, specifically the difference in the _electron's_ electrochemical potential, scaled by its charge: $Voltage = \Delta \bar{\mu}_e / (-F)$. But why privilege electrons? What are the equivalent "voltages" driving other ions?

Let's define a **Species Voltage, $V_i$**, for _any_ charged species $i$:

$$V_i = \bar{\mu}_i / (z_i F)$$

That's it! We just divide the fundamental energy ($\bar{\mu}_i$) by the charge involved ($z_i F$). It seems simple, maybe _too_ simple? Stick around, because this scaling has a profound consequence:

<div class="interactive-placeholder" style="border:1px dashed #ccc; padding: 20px; margin: 1em 0; text-align: center; background-color: #f9f9f9;">
  **[Interactive Demo: Unison Shift]**<br>
  (Side-by-side 'EnergyLevelsDiagram' instances. Slider controls global $\phi$. Left plots $\bar{\mu}_i$ for A²⁻, B⁻, C⁰, D⁺, E²⁺. Right plots $V_i$ for charged species.)
</div>

**Aha! Moment #1:** As you change the electrostatic offset $\phi$ with the slider, notice how the $\bar{\mu}_i$ levels on the left shift by different amounts (depending on $z_i$), creating a confusing picture. But on the right, the $V_i$ levels for all charged species **shift together** by the exact same amount ($\Delta V_i = \Delta \phi$)! This "Unison Shift" means the $V_i$ representation cleanly separates the intrinsic chemical/activity effects from simple, uniform electrostatic offsets. The _relative differences_ between $V_i$ levels become invariant to the choice of $\phi$ zero.

Now, how do things move in this $V$ world? The driving force ($\nabla \bar{\mu}_i$) translates nicely:

- **Cations ($z > 0$)** want to move from **high $V_+$ to low $V_+$**. (They "fall down" the $V$ landscape).
- **Anions ($z < 0$)** want to move from **low $V_-$ to high $V_-$**. (They "float up" the $V$ landscape).

<div class="interactive-placeholder" style="border:1px dashed #ccc; padding: 20px; margin: 1em 0; text-align: center; background-color: #f9f9f9;">
  **[Interactive Demo: Driving Force V]**<br>
  (Simple 'EnergyLevelsDiagram' showing $V$ levels for a cation and an anion in 'Body 1' vs 'Body 2', with arrows indicating flow direction based on the rules above.)
</div>

This gives us the complete thermodynamic driving force, analogous to $\Delta V$ driving current in Ohm's law, but specific to each type of charge carrier. This might be **Aha! Moment #2**!

---

## Introducing the ESBD Diagram

Okay, so $V_i$ gives us a consistent way to view potentials that shift uniformly. But devices have different materials and potentials change with _position_, $x$. We need to plot $V_i$ vs. $x$!

This leads us to the **Electrochemical Species Band Diagram (ESBD)**. Here's a first look at one for a simple system (don't worry about understanding every line just yet!):

<div class="interactive-placeholder" style="border:1px dashed #ccc; padding: 20px; margin: 1em 0; text-align: center; background-color: #f9f9f9;">
  **[Interactive ESBD Diagram: Concentration Cell (Salt Bridge)]**<br>
  (Show the diagram generated by ConcentrationCellComponent.js. Maybe initially hide standard states/anion via config.)
</div>

You can see different lines representing the $V_i$ for different species ($V_{e^-}$, $V_{\mathrm{Ag}^{+}}$, $V_{\mathrm{NO}_3^{-}}$) across different regions (electrodes, electrolytes). Features like the standard state potentials ($V^\ominus$) or interface reaction markers ($\rightleftharpoons$) provide more context, which we'll explore later. The key idea is visualizing the potential landscape for _all_ relevant charged species vs. position.

_Hint:_ Try clicking the Y-axis label or using the dropdown (if available in the example above) to switch between Volts, eV, and kJ/mol display modes!

---

## Explore More: Visual Guide

Intrigued? The real power of ESBDs becomes apparent when applied to various systems. Explore these topics through interactive diagrams and detailed explanations by clicking on an image below:

<div class="gallery-placeholder" style="border:1px dashed #ccc; padding: 20px; margin: 1em 0; text-align: center; background-color: #f9f9f9;">
  **[Gallery of Thumbnails: Grid of appealing images/GIFs linking to detailed pages/sections for Standard State Ladders, Concentration Cells, Li-ion Battery, Lead-Acid Battery, Electrolysis, Semiconductor Junctions, Theory/Nuances, etc.]**
</div>

**(Optional Text Navigation)**

Or explore by topic:

- [Link to Electrochemistry Basics in V]
- [Link to Battery Examples]
- [Link to Advanced Concepts & Non-Equilibrium]
- [Link to Theory & Nuances]

---
