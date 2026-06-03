---
layout: layouts/esbd_topic.njk
title: 'Mass action and charge control'
tags: [page, esbd_topic]
orderESBD: 23
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

If we know the concentrations (and activities) of reactants, then we can determine each species voltage $V_i$ relative to its standard state $V^\circ_i$. But in practical devices, we often face the inverse problem: we know the voltages $V_i$ (e.g. from connection to external terminals or reservoirs), and we need to determine the carrier concentrations.

To do this, we must combine two physical constraints: the chemical **Mass Action Law** and the electrical constraint of **Charge Neutrality**. Remarkably, we can solve many of these charge-control problems using simple point-thermodynamics before we even introduce permittivity ($\epsilon$) or spatial electrostatics.

---

## 1. $V^\circ_i$ as a Charge Control
* **The float of $V^\circ_i$**: A full set of $\{V_i\}$ values only contains $N-1$ independent pieces of information about the composition, since a collective electrical offset (the "float" of the standard state ladder) does not affect relative concentration. 
* **Tuning standard states**: The offset of the $V^\circ_i$ ladder relative to $V_i$ determines the total free charge density. If we push the standard states $V^\circ_i$ up relative to $V_i$, we reduce $V_i - V^\circ_i$ for all species, which exponentially decreases the concentration of positive carriers and increases the concentration of negative carriers.
* **Bare charge control**: We seek the position of $V^\circ_i$ that satisfies the charge balance of the material.

<figure class="diagram-placeholder">
{% figcaption %}
- demo showing how $V^\circ_i$ offset influences the space charge
- background charge slider
- 'fix neutrality' checkbox
- subplot with delta phi on x axis and space charge on y axis
{% endfigcaption %}
</figure>

---

## 2. Doping and the Mass Action Law
* **The Semiconductor Mass Action Law**: In an ideal semiconductor at equilibrium, the electron and hole voltages coincide ($V_{\mathrm{e}^-} = V_{\mathrm{h}^+}$). Multiplying their Boltzmann equations together yields a constant carrier product:
  $$ n \cdot p = n_{\mathrm{i}}^2 $$
* **Doping (Fixed Charge)**: Introducing immobile donor dopants ($N_{\mathrm{D}}^+$) or acceptor dopants ($N_{\mathrm{A}}^-$) imposes a fixed background charge density.
* **Solving the Bulk**: Imposing bulk neutrality ($p - n + N_{\mathrm{D}}^+ = 0$) and the mass action product ($n \cdot p = n_{\mathrm{i}}^2$) uniquely fixes both carrier concentrations:
  $$ n \approx N_{\mathrm{D}}^+, \quad p \approx n_{\mathrm{i}}^2 / N_{\mathrm{D}}^+ $$
  By shifting $V^\circ_i$ relative to $V_i$, the system satisfies this charge balance.

---

## 3. The Solubility Product and Common-Ion Effect
* **The Solubility Analog**: Just like semiconductor carriers, ions in solution obey a mass-action product. For a saturated salt in equilibrium with solid $\mathrm{NaCl}$:
  $$ c_{\mathrm{Na}^+} \cdot c_{\mathrm{Cl}^-} = K_{\mathrm{sp}} $$
* **The Common-Ion Effect**: If we add another salt sharing an ion (e.g., adding $\mathrm{HCl}$ to the saturated $\mathrm{NaCl}$ solution), we introduce extra $\mathrm{Cl}^-$.
* **Solving the Balance**: To satisfy both the solubility product ($c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = K_{\mathrm{sp}}$) and bulk charge neutrality ($c_{\mathrm{Na}^+} + c_{\mathrm{H}^+} - c_{\mathrm{Cl}^-} = 0$), the concentration of $\mathrm{Na}^+$ must drop, forcing excess $\mathrm{NaCl}$ to precipitate.

<figure class="diagram-placeholder">
{% figcaption %}
- Common-ion effect: salt region sets $V_i - V_j = \mathrm{sat}$. Slider controls common ion addition.
{% endfigcaption %}
</figure>

---

## 4. Gibbs-Donnan Membrane Equilibrium
* **The Constrained Carrier**: A semipermeable membrane separates two electrolyte chambers. The membrane allows water and small ions ($\mathrm{Na}^+$, $\mathrm{Cl}^-$) to pass, but is impermeable to a large charged species (like a protein $\mathrm{Pr}^-$) restricted to one side.
* **The Donnan Potential**: Because the protein cannot cross, charge neutrality forces an unequal distribution of the mobile ions across the membrane.
* **Solving the Step**: The mobile ions must satisfy the mass-action product equality across the membrane ($c_{\mathrm{Na}^+, \text{left}} c_{\mathrm{Cl}^-, \text{left}} = c_{\mathrm{Na}^+, \text{right}} c_{\mathrm{Cl}^-, \text{right}}$). This forces a step change in the standard state ladders across the membrane—creating the **Donnan potential**.

<figure class="diagram-placeholder">
{% figcaption %}
- Gibbs-Donnan equilibrium: showing the step change in $V^\circ_i$ (Donnan potential) across the membrane boundary to balance the impermeable protein charges.
{% endfigcaption %}
</figure>

---

## 5. Quasi-Fermi Levels and Supersaturation
* **Nonequilibrium splits**: Out of equilibrium, the species voltages split ($V_{\mathrm{e}^-} \neq V_{\mathrm{h}^+}$ or $V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} \neq \Delta$).
* **The Analogy**: 
  * A split in semiconductor quasi-Fermi levels ($V_{\mathrm{e}^-} - V_{\mathrm{h}^+} > 0$) is the exact thermodynamic analog of a chemical solution that has become **supersaturated** (where the ion activity product exceeds the equilibrium solubility limit).
  * This split represents the thermodynamic driving force for carrier recombination (or water neutralization).

---

## 6. The Aneutrality Mystery
At boundaries, membranes, and junctions, local charge neutrality is violated, creating localized space charge regions. 
* We know that at equilibrium, the species voltages $V_i$ must remain perfectly flat.
* If charge neutrality is violated at a boundary, the standard states $V^\circ_i(x)$ must bend spatially to accommodate the charge.
* **The Mystery**: *How far does this bending extend into the bulk? What determines the spatial width and shape of this transition zone?*

To answer this, we must finally introduce permittivity ($\epsilon$) and Poisson's equation to model the spatial physics of electrostatic screening.

[**NEXT TOPIC: Bipolar membranes and pn junctions**](../bipolar/)
