---
layout: layouts/esbd_topic.njk
title: 'Basic transport'
tags: [page, esbd_topic]
orderESBD: 24
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

So far, we have focused on systems at equilibrium, where species voltages ($V_i$) are flat, and chemical reactions set fixed offsets. But devices in operation are inherently non-equilibrium systems. When current flows, the $V_i$ lines must slope.

This topic explores how carriers move under load, introducing the fundamental transport equations and physical phenomena of species-specific conduction.

---

## 1. Species-Specific Driving Forces
* **Thermodynamic Force**: The fundamental driving force on any carrier $i$ is the gradient in its electrochemical potential, $-\nabla \bar\mu_i$. 
* **Voltage Representation**: Normalizing for charge, the driving force is exactly the gradient in the species voltage:
  $$ \text{Driving Force} = -\nabla V_i $$
* **Visualizing Dissipation**: In our band diagrams, any slope in a $V_i$ line indicates a driving force and active dissipation (thermodynamic resistance). Flat lines mean no net transport or infinite conductivity.

---

## 2. Ohm's Law and Nernst-Planck
* **The Unified $V_i$ Ohm's Law**: Start with the picture we have discussed. Because drift and diffusion are both expressions of the same electrochemical potential gradient, they collapse into a single species-specific Ohm's law:
  $$ J_i = -\sigma_i \nabla V_i $$
  where $J_i$ is the species charge current density and $\sigma_i$ is the species conductivity.
* **The Traditional Split**: Expand out the V_i gradient as gradient in V^0 and gradient in concentration (ideal-dilute). Classic electrochemistry and semiconductor physics split carrier motion into two distinct physical mechanisms:
  * **Drift** (driven by the electric field $-\nabla\phi$).
  * **Diffusion** (driven by concentration gradients $-\nabla c_i$).
  * Also remark during the expansion that V^0 gradient is not always phi gradient, and there is a third term (a second drift term?) from the chemical standard state gradient. This is often overlooked as it's gradient-of-constant in homogeneous materials. But it really does matters e.g. at interfaces and in inhomogeneous materials (and e.g. in graded semiconductor heterojunctions. Can be from varying binding energy or steric/entropy type gradient.) Thus the classic classic drift-diffusion picture breaks at interfaces though often a special interfacial kinetic law is desireable anyway (to handle nonlinearities).

<figure class="diagram-placeholder">
{% figcaption %}
- diagram breaking down current into drift and diffusion pieces.
{% endfigcaption %}
</figure>

{# Note -- there are so many subtleties to advanced transport. Need to balance brevity and emphasis on visuals and basic principles, with completeness which can be brief mentions that are expanded in footnotes/appendices! #}

Remarks on drift-diffusion 

* **Einstein relation**: The $V_i$-driven form automatically handles the Einstein relation ($D_i = u_i k_{\mathrm{B}}T$) without needing separate coefficients, showing that Nernst-Planck transport is just Ohm's law applied per-species. The derivation from $\nabla V_i$ also yields the proper generalized Einstein relation for species that deviate from classical ideality (especially the electronic Fermi gas that occur with dense electrons in semiconductors and semimetals) in terms of the connection to chemical capacitance. (Note though that in general non-ideal concentrated solutions, transport becomes coupled, as seen e.g. in Maxwell–Stefan diffusion equations or Onsager matrices.)
* Extra driving terms: direct conduction due to $V_i$ gradients (or drift/diffusion) is just one of many driving forces. Notably advection and thermoelectrics also drive ionic/electronic currents. In addition one can consider electromagnetic induction ($\partial A / \partial t$) and cross-coupling.

## Classic "Ohmic Current" vs. Species Conduction
* **The $\phi$-Drive Convention**: In standard engineering, electrolyte conduction is treated as a single "common-mode" current driven by a single electrostatic potential:
  $$ I = -\sigma \nabla\phi $$
  where $\sigma = \sum \sigma_i$.
* **The Drift Summation**: Explain how this "ohmic current" is a helpful mathematical construct obtained by summing up all individual drift currents under the assumption of uniform concentration.
* **The Limitation**: Show why this construct breaks down in the presence of concentration gradients (where diffusion currents contribute to the charge flow) and why tracking individual $V_i$ gradients is more physically robust.

## Two important effects in multi-ion transport

Concentration Polarization

* **Blocking Interfaces**: In many devices, an interface is selective—allowing only one type of carrier to pass while blocking others (e.g., lithium ions intercalating into an electrode while salt anions are blocked).
* **The Build-Up**: Because blocked ions cannot cross, they pile up or deplete near the interface. This sets up sharp concentration gradients.
* **Visualizing Polarization**: In the $V_i$ diagram, this manifests as a bending of the standard states ($V^\circ_i$) and concentration-driven slopes in $V_i$, representing local resistance and mass-transport limitations.
* Remark on current saturation.
* Remark on effect of supporting electrolyte.
* Boundary condition may be homogeneous solution (mixed by advection) or device end or just diffusion transient; Warburg impedance.

<figure class="diagram-placeholder">
{% figcaption %}
- diagram with conc polarization. Top: band diagram. Bottom: concentrations.
- add switch for supporting electrolyte?
{% endfigcaption %}
</figure>

Diffusion potential

* **Different Mobilities**: When a salt (like $\mathrm{HCl}$) diffuses through a concentration gradient, the hydrogen ions ($\mathrm{H}^+$) and chloride ions ($\mathrm{Cl}^-$) attempt to move at different speeds due to their different mobilities.
* **The Charge Separation Limit**: Any actual separation of charge is strictly limited by electrostatics (charge neutrality). The faster ion drags the slower one along, setting up a localized electric field.
* **The Voltage Signature**: In the $V_i$ diagram, this results in a transient slope (a "diffusion potential" or "liquid junction potential") that equalizes their velocities to preserve electroneutrality.
* Remark on binary case (mathematically easy) vs multi-ion case (complex).

<figure class="diagram-placeholder">
{% figcaption %}
- diagram with diffusion potentials, binary case.
{% endfigcaption %}
</figure>

---

## Takeaways

By treating transport per-species, we bypass the need to separate drift and diffusion, visualizing all transport resistance directly as slopes in the $V_i$ landscape.

[**NEXT TOPIC: Metals and insulators**](../metals_insulators/)
