---
layout: layouts/esbd_topic.njk
title: 'Redox'
tags: [page, esbd_topic]
orderESBD: 6
eleventyNavigation:
    key: Junctions
    parent: ESBD
    order: 6
---

# {{title}}

Electrode potential of a particular solution is $E = V_{\mathrm{e}^-} - V^\circ_0$, where $V^\circ_0$ is a chosen position on the standard state ladder of that solution.

## Electrons in redox-active solutions

In some solutions, $V_{\mathrm{e}^-}$ is directly defined by the presence of species which are readily exchanging electrons.

Iron

In effect it is as if there are electrons dissolved in solution, though not physically so.

$$ \bar\mu_{\mathrm{Fe}^{2+}} = \bar\mu_{\mathrm{Fe}^{3+}} + \bar\mu_{\mathrm{e}^-} $$

$$ 2 V_{\mathrm{Fe}^{2+}} = 3 V_{\mathrm{Fe}^{3+}} - V_{\mathrm{e}^-}$$

$$ V_{\mathrm{e}^-} = 3 V_{\mathrm{Fe}^{3+}} - 2 V_{\mathrm{Fe}^{2+}} $$

as avg + offset:
$$ V_{\mathrm{e}^-} = 0.5 (V_{\mathrm{Fe}^{3+}} + V_{\mathrm{Fe}^{2+}}) + 2.5 (V_{\mathrm{Fe}^{3+}} - V_{\mathrm{Fe}^{2+}} )$$

GEM-- Measurement: Explain that an inert electrode (like Platinum) acts as a probe, aligning its electron potential with this V_e⁻(solution), which allows the redox potential (E) to be measured.

## Electrons in "inert" solutions - limits

Often a solution does not have a well defined $V_{\mathrm{e}^-}$ value, though it can be said to be within a certain range.

$$ V_{\mathrm{e}^-} (\text{oxidation}) < V_{\mathrm{e}^-} < V_{\mathrm{e}^-} (\text{reduction}) $$


## Water & air

$$ \mathrm{O_2} \rightleftharpoons \mathrm{OH}^- $$

$V_{\mathrm{e}^-}$

## Takeaways


{#
[**NEXT TOPIC: Potentials**](../potentials/)

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