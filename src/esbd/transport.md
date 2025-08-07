---
layout: layouts/esbd_topic.njk
title: 'Transport'
tags: [page, esbd_topic]
orderESBD: 14
eleventyNavigation:
    key: Transport
    parent: ESBD
    order: 14
---

# {{title}}

**WORK IN PROGRESS**

- Steal some stuff from non-equilibrium.md.
- Address conductivity variations with concentration. Set the stage for junctions topic.
- Less emphasis on matrix (put in Optional)
- Mention induction $\partial A / \partial t$ driving force (non-conservative).
- Diagrams Diagrams Diagrams!!!!

## Takeaways

[**NEXT TOPIC: Junctions**](../junctions/)

{#
## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>

</details>


GEMINI July 4

Proposed Outline for "Redox" Topic
The Redox Potential of a Solution:

Concept: Begin by establishing that a solution containing a reversible redox couple (e.g., Fe³⁺/Fe²⁺) has a well-defined equilibrium electron potential level, V_e⁻(solution), independent of any electrode. This can be described as the "Fermi level of the solution."

Derivation: Show that the equilibrium Fe³⁺ + e⁻ ⇌ Fe²⁺ leads to the relationship V_e⁻ = 3V_Fe³⁺ - 2V_Fe²⁺.

Measurement: Explain that an inert electrode (like Platinum) acts as a probe, aligning its electron potential with this V_e⁻(solution), which allows the redox potential (E) to be measured.

The Electrochemical Stability Window:

Concept: Contrast the redox-active solution with an "inert" solvent (like water or a battery electrolyte). Explain that these solvents do not have a single intrinsic V_e⁻ but rather a range of potentials they can tolerate before decomposing.

Boundaries: Define this window by the two limiting half-reactions:

Anodic Limit (Oxidation): The potential V_e⁻(oxidation) where the solvent or salt anion loses electrons.

Cathodic Limit (Reduction): The potential V_e⁻(reduction) where the solvent or salt cation gains electrons.

ESBD Visualization: Describe how these two potentials form the upper and lower boundaries of the stable region for the electrolyte on the diagram.

Thermodynamic Stability in Practice (Combining Concepts):

Requirement: State the key principle: a system is only thermodynamically stable if the electron potentials of the electrodes and any dissolved redox couples lie within the stability window of the solvent.

Application to LIBs:

Anode & SEI: Explain that the charged graphite anode's V_e⁻ is below the electrolyte's reduction limit. This thermodynamic instability drives the formation of the SEI, which provides kinetic stability.

Cathode & CEI: Explain that the charged cathode's V_e⁻ operates very close to, or slightly beyond, the electrolyte's oxidation limit, leading to slow, continuous oxidative side reactions and the formation of the Cathode Electrolyte Interphase (CEI).

Related Redox Phenomena:

Redox Shuttling: Explain how a soluble redox couple can act as a charge carrier, diffusing between two electrodes at different potentials. This can be a useful mechanism (in redox flow batteries) or a parasitic one (as a self-discharge pathway in LIBs caused by impurities).

Corrosion as a Mixed Potential: Introduce corrosion as a non-equilibrium process where two different redox reactions (e.g., Fe/Fe²⁺ and O₂/H₂O) occur on the same conductive surface. The surface settles at an intermediate "mixed potential" where the rates of oxidation and reduction are equal, driving the degradation of the material. This serves as a good bridge to the "Non-equilibrium" topic.
#}