---
layout: layouts/esbd_topic.njk
title: 'Driving Forces'
tags: [page, esbd_topic]
orderESBD: 13
eleventyNavigation:
    key: Driving Forces
    parent: ESBD
    order: 13
---

# {{title}}

**WORK IN PROGRESS**

Let's talk a bit about how charge moves in this $V_i$ framework, when we have a system out of equilibrium.

## Charge moves from high voltage to low voltage

One of the basic facts of electricity is that charge "wants" to move from high to low voltage. With these $V_i$, we see the more precise thermodynamic statement is **"the charge as carried by species $i$ will spontaneously move from high $V_i$ to low $V_i$"**.

This is a special case of the general statement in thermodynamics that all species (including uncharged species) move from high to low chemical potential $\mu_i$. Such flows produce an increase in entropy, and reverse flows cannot happen because they would decrease entropy. For charged species, their electrochemical potential *is* their proper chemical potential ($\bar\mu_i$ is just an alias for $\mu_i$). So, electrons move from high to low $\bar\mu_{\mathrm{e}^-}$, meaning they move from low to high $V_{\mathrm{e}^-}$; but since they are negatively charged, this means the charge carried by electrons moves from high to low $V_{\mathrm{e}^-}$. For positive charges like a lithium ion, of course the particle flow is in the same direction as the charge flow: from high to low $V_{\mathrm{Li}^+}$.

{% include "esbd-diagrams/V-driving-force-two.html" %}

Naively, the motion of charge is often explained in terms of microscopic mechanics, that charges are accelerated towards lower electrostatic potential $\phi$. But such microscopic mechanics are fully reversible, and so charges can move uphill just as often as downhill. To explain the spontaneous and irreversible motion of charges we have to turn to irreversible frameworks of statistical mechanics and thermodynamics. This is why our thermodynamic voltage $V_i$ is the key player, not the microscopic electrostatic potential.

## Conduction

In any material or device with current being driven through it, we generally can see gradients in $V_i$.

> DIAGRAM - V_e- in resistor

The amount of gradient is represented by $\nabla V_i$ (in general a vector quantity, but in our band diagrams it tends to be simply directed left-to-right). In most cases the current is linear in the gradient, which gives Ohm's law:

$$ J_i = \sigma_i \cdot (-\nabla V_i)$$

where $\sigma_i$ is a conductivity. For a three-dimensional system, the current density $J_i$ has units of ampere per square meter and $\sigma_i$ has units of inverse ohm-meters. We can also integrate this over a block of material (with simplifying assumptions) to get the famous $ I_i = \tfrac{1}{R}\Delta V_i $.

Again, I stress that $-\nabla V_i$ is not the electric field. If we tried to compute the current in terms of the raw electric field ($-\nabla \phi$), we will often get the wrong answer. There are common equations for ion flow based on electric field that add the necessary correction to get the correct answer, e.g., the {% wiki "Nernst–Planck equation" %}. But, writing the current in terms of $-\nabla V_i$ is far simpler, directly arriving at the correct answer, and it is more thermodynamically fundamental.

{#
### Drift or diffusion?

Note that $-\nabla V_i$ is in general *not* the same as the electric field $-\nabla \phi$. At equilibrium, it is common to see a nonzero electric field near interfaces (e.g. band bending) and inhomogeneities, even though $V_i$ is completely flat.

> DIAGRAM showing V_i flat and \phi sloped.

An alternate and common view arises when electrochemical potential is broken down into an internal chemical potential and electrostatic energy. And furthermore, it is often assumed that the internal chemical potential is logarithmic in concentration, so that $V_i = \phi + \text{const} + \frac{RT}{z_i F} \ln c_i$. Then, the current works out to two terms, called "diffusion" and "drift":

$$ J_i =  \underbrace{- \sigma_i \nabla \phi}_{J_{\text{drift},i}} + \underbrace{-D_i \nabla c_i}_{J_{\text{diffusion},i}} . $$

where $D_i = RT\sigma_i/(z_i F c_i)$ is called the diffusion coefficient. This is known as the {% wiki "Nernst–Planck equation" %}. This is an appealing breakdown since $J_{\text{drift},i}$ is Ohm's law (but in terms of raw electric field, from $\phi$), and $J_{\text{diffusion},i}$ looks just like regular neutral particle diffusion.

But, this split also has weaknesses:
* It is not possible to separately measure the drift and diffusion currents.
* In the equilibrium case shown above (flat $V_i$ but non-flat $\phi$), it means we have zero current but the drift and diffusion currents will be both nonzero (and opposing).
* The assumed logarithmic relation with concentration is only true in the dilute limit.
* Where different materials meet, the $\text{const}$ above actually can change depending on the material, giving rise to yet another current contribution.

The most general description of the spontaneous thermodynamic flow uses chemical potential, and for charged particles means using their full electrochemical potentials $\bar\mu_i$. These $V_i = \bar\mu_i/(z_i F)$ adapt this general rule into a special statement for charged speces: "charge moves from high to low voltage ($V_i$)".
#}

### Multiple ions

When multiple different kinds of charge carriers are present, then the total current will actually be a combination. The total current is

$$ J = \sum_i J_i .$$

It is possible (and often happens) that different ions have different driving forces $-\nabla V_i$, and they may even point in completely opposing directions.

> DIAGRAM showing two V_i's

An important detail though, with multiple ions, is that they can easily set up concentration gradients, which in turn mean that the conductivities $\sigma_i$ vary with position. We will return to the topic of transport in the later [Transport](../transport2.md) topic, covering specific cases that arise when multiple ions are present.

## Driving across interfaces

Not all voltage drops happen continuously through materials. Interfaces between materials tend to be another case where a voltage drop may occur.

For the most part, junctions between electronic conductors have negligible interfacial resistance. But, metal-semiconductor junctions frequently do have voltage drops.

> DIAGRAM - schottky diode V_e- zoomed out

It is often the case that this interfacial current is exponentially dependent on the interfacial voltage drop, i.e. roughly $J_i \propto \exp(\Delta V_i \cdot z_i F/RT)$. In electrochemistry this exponential form is best represented by the {% wiki "Butler–Volmer equation" %}. In electronics, there is the {% wiki "Shockley diode equation" %}, which is a special case of the Butler–Volmer equation with one of the charge-transfer coefficients set to 0.^[The charge-transfer coefficients could be better named as "barrier lowering coefficients", as they nominally reflect the degree to which the bias/overpotential $\Delta V$ controls the reaction barrier in the specified direction. In a diode, the reverse bias has zero influence on the barrier height, which is why it evaluates to $\exp(0) = 1$. Practically though, the charge-transfer coefficients just end up as empirical fitting parameters, much like the ideality factor in the diode equation.] The idea is that there is a barrier that normally keeps the reaction happening at a slow rate, and $\Delta V_i$ is able to speed the reaction by lowering the barrier for either the reverse or forward reaction.

> Plot - exponential IV relationship

> Interactive explainer for B-V relationship; one slider for bias, one slider for \alpha (barrier control). Schematic shows exponential tails for forward and backwards species. etc. etc. Also can have side plot for the IV relationship.

(It is also possible for the in-material conduction we saw above to be non-linear in the voltage gradient, however, the nonlinearity usually only happens at interfaces.)

At electrodes

> Another example with V_e- implied level? Electroplating?

## Reactions in general

In reactions, it's not always appropriate to assign the voltage drop to just one species. As a visual alternative, we can draw the equilibrium reaction in a way that balances. We can also decorate the reaction with arrows that show which $V_i$ levels are providing charge to the reaction, and which are receiving charge from the reaction.

> DIAGRAM - alternative (fancy reaction marker)
> Which reaction? Could do 

This is just a visualization however, and does not provide any more meaning.

It does raise a question though, with multiple $V_i$ which one is the overpotential?

## Other driving forces ??

- Mention induction $\partial A / \partial t$ driving force (non-conservative).
- Mention advection term!
- Thermoelectric term (Seebeck-ish)

- Diagrams Diagrams Diagrams!!!!

- Matrix cross terms? (put in Optional?)

## Takeaways

As we've seen, in various ways the charge as carried by species $i$ will spontaneously move from high $V_i$ to low $V_i$.

In the next topic, we'll start to dig into actual material properties.

[**NEXT TOPIC: Solutions**](../solutions/)

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