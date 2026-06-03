---
layout: layouts/esbd_topic.njk
title: 'Other conductors'
tags: [page, esbd_topic]
orderESBD: 27
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

Besides the dilute solutions and semiconductors we have looked at, there are other classes of electronic and ionic conductors. In these materials, the standard states ($V^\circ_i$) or band structures are often complex or irrelevant. Instead, their behavior is dominated by their high carrier density (perfect screening) or multi-carrier transport.

## Metals: the transport-only limit

* **Asymptotic Condition**: Mobile electron density is extremely high ($c_{\mathrm{e}^-} \rightarrow \infty$, typically $\sim 10^{22}~\mathrm{cm}^{-3}$).
* **Perfect Screening**: The screening length approaches zero ($\lambda \rightarrow 0$, sub-angstrom in practice).
* **Trivializing the Complexity**: 
  * Trying to define the internal electrostatic potential $\phi$ and the activity coefficient of electrons in a metal is a theoretical nightmare due to strong electron-electron repulsion and quantum lattice interactions. Nontrivial band structures too.
  * In the $V_i$ framework, we bypass this complexity: the only variable we care about is $V_{\mathrm{e}^-}$. Inside the bulk metal, $V_{\mathrm{e}^-}$ is perfectly flat (at equilibrium) or slopes linearly under current according to simple Ohm's law ($J_{\mathrm{e}^-} = -\sigma_{\mathrm{e}^-} \nabla V_{\mathrm{e}^-}$).

<figure class="diagram-placeholder">
{% figcaption %}
ESBD of a metal phase. Because screening is perfect, the internal electrical state is represented solely by the flat or sloped $V_{\mathrm{e}^-}$ trace, with no need to draw or reference $\phi$ or $V^\circ_{\mathrm{e}^-}$.
{% endfigcaption %}
</figure>

## Fast ionic conductors: metals for ions

* **The Ionic Metal**: These solid materials conduct a single ion species (e.g., oxygen ions $\mathrm{O}^{2-}$ in Yttria-Stabilized Zirconia (YSZ)) with a very high carrier concentration.
* **Microscopic Mechanics**: Conduction often occurs via vacancy hopping in a crowded lattice. It is highly non-dilute, but thermodynamically it is perfectly represented by the single species voltage $V_{\mathrm{ion}}$ driving the current:
  $$ J_{\mathrm{ion}} = -\sigma_{\mathrm{ion}} \nabla V_{\mathrm{ion}} $$

<figure class="diagram-placeholder">
{% figcaption %}
ESBD of YSZ. The active species voltage $V_{\mathrm{O}^{2-}}$ represents the driving force for oxygen transport across the solid electrolyte.
{% endfigcaption %}
</figure>

## Mixed Ionic-Electronic Conductors (MIECs)
* **Dual Carriers**: Materials (such as $\mathrm{Li}_x\mathrm{CoO}_2$ or mixed-conducting polymers) where both electrons and ions can move.
* **Cross-Coupled Transport**: These materials exhibit rich concentration polarization and local charge separation, acting as the ultimate physical bridge between electronic circuit components and electrochemical solutions.

## Further materials

* **Concentrated electrolytes**: When ions are concentrated enough, the strong screening washes out the important of the potential, and nonidealities make the potential ambiguous too. Like a metal we want to focus on plotting $V_i$ of the present charge carriers, but now we get all the complications of coupled multi-ion transport plus coupling to neutral species (and solvent!). 
* **Ionic liquids**: Much like concentrated electrolytes?
* **Plasma**: Include this?
* **Superconductors**: These might seem exotic but for our purposes they can be treated as metals with infinite conductivity. Superconductors do have a well defined $V_{\mathrm{e}^-}$ which is important for their connection to other electronic conductors.

## Takeaways

When discussing solutions and semiconductors, standard states ($V^\circ_i$) and band edges are useful coordinates. However, in metals and other dense conductors, these reference states become irrelevant. By focusing on the species voltages ($V_i$), we can model transport across electronic, ionic, and mixed conductors under a single unified equation.

[**NEXT TOPIC: Insulators and capacitors**](../capacitors/)
