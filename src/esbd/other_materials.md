---
layout: layouts/esbd_topic.njk
title: 'Other materials'
tags: [page, esbd_topic]
orderESBD: 26
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

Besides the solutions and semiconductors we just looked at, there are other important materials. Chiefly, metals and insulators play important roles in practical devices, so let's talk a bit about how we want to model them.

## Metals: the transport-only limit

Message: "you can sort of think of metals as being semiconductors with extremely high electron density; this isn't exactly true but the qualitative consequences (perfect screening) are right in terms of letting us neglect many complexities. Anyway, all you need to do is plot V_e. This gets back to one of the original points we made back in v_i.md, which is that V_e is the main character of electronic circuits.".

* **Asymptotic Condition**: Mobile electron concentration is extremely high ($c_{\mathrm{e}^-} \rightarrow \infty$, typically $\sim 10^{22}~\mathrm{cm}^{-3}$).
* **Debye Length**: The Debye screening length approaches zero ($\lambda \rightarrow 0$, sub-angstrom in practice). Screening is perfect.
* **Trivializing the Complexity**: 
  * Trying to define the internal electrostatic potential $\phi$ and the activity coefficient of electrons in a metal is a theoretical nightmare due to strong electron-electron repulsion and quantum lattice interactions. Nontrivial band structures too.
  * In the $V_i$ framework, we bypass this complexity: the only variable we care about is $V_{\mathrm{e}^-}$. Inside the bulk metal, $V_{\mathrm{e}^-}$ is perfectly flat (at equilibrium) or slopes linearly under current according to simple Ohm's law ($J_{\mathrm{e}^-} = -\sigma_{\mathrm{e}^-} \nabla V_{\mathrm{e}^-}$).

<figure class="diagram-placeholder">
{% figcaption %}
- one possibility for a diagram here: simply a band diagram of metal with just V_e; extremely boring but that is the point (metals = boring)
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- another possibility: show metal or two connected pieces of metal with $V^\circ_{\mathrm{e}^-}$ or conduction band marked too, but caption emphasizes that the $V^\circ$ is irrelvant info anyway. (sort of reiterates v_i.md point)
{% endfigcaption %}
</figure>

### Fast ionic conductors

The ionic analog of a metal is a material that only conducts one species of ion, and there is a preexisting concentration of that ion which is very large, so the material is also efficient at screening.

Just like a metal these are often microscopically nontrivial, in that it is not accurate at all to think about the ions as being a dilute. E.g. sometimes the ions are so dense that it might be better to think of the microscopic transport as being due to vacancy hopping. Regardless, we can choose $V_{\mathrm{ion}}$ to represent the internal electrical state and we have $J = J_{\mathrm{ion}} = -\sigma_{\mathrm{ion}} \nabla V_{\mathrm{ion}}$. (Note that anyway $V_{\mathrm{ion}} = V_{\mathrm{ionvacancy}}$.)

{# Note probably focus on YSZ as a practical example material here #}

<figure class="diagram-placeholder">
{% figcaption %}
- diagram that mirrors one of the above metal diagrams.
{% endfigcaption %}
</figure>

## Insulators: the electrostatics-only limit

* **Asymptotic Condition**: Carrier concentration goes to zero ($c_i \rightarrow 0$).
* **Debye Length**: The Debye screening length approaches infinity ($\lambda \rightarrow \infty$). Insulators have no mobile charge to screen external fields.
* **No Conduction**: Species conductivity is zero ($\sigma_i = 0$), so no transport occurs ($J_i = 0$).
* **The Potential Landscape**: Because there are no mobile carriers, the concept of a species voltage $V_i$ is undefined or irrelevant. The potential landscape is governed entirely by electrostatics (Poisson's equation or Laplace's equation for $\phi$), and electric fields penetrate completely through the material.

Note that while charges don't easily move in the insulator, it is not true that insulators are automatically charge neutral. Rather the opposite: it is common for interfaces to contain trapped charges which are left unscreened over arbitrarily long distances. E.g. fixed oxide charge in MOSFETs.

How do we plot insulators? In principle, inside insulators we could define $V^\circ_i$ based on hypothetical trapped ion or electron populations. And, in band diagrams it is common to depict the insulator as a wide-gap semiconductor (so wide that charge carrier populations are negligible). This can be a bit of a cartoon, though, so maybe here we can make an exception to the 'never plot $\phi$' rule. 

Work function etc: Insulator-metal contact also has a potential jump; note though because the metal only needs $V_{\mathrm{e}^-}$, then the only relevant difference is $\phi(\text{insulator}) - V_{\mathrm{e}^-}(\text{metal})$. When the insulator is vacuum, this called the {% wiki "work function" %}.

Interfaces between insulators have a potential jump too. Band alignment just like semiconductors.

<figure class="diagram-placeholder">
{% figcaption %}
- top: nontrivial depiction of an insulator: mismatched work functions, trapped charges, interfacial jumps between two insulators.
- bottom: simplified equivalent insulator: straight lines (kink due to epsilon mismatch).
{% endfigcaption %}
</figure>

Discuss capacitors, capacitance, and displacement currents. (Though don't give the impression that these are unique to insulators.) Contrast naive electrostatics picture to 

<figure class="diagram-placeholder">
{% figcaption %}
- top: realistic and messy capacitor
- bottom: naive capacitor (voltage continuous)
{% endfigcaption %}
</figure>

A brief discussion about vacuum, its inhomogeneity, and brief remarks about 'vacuum contact' / 'vacuum referencing' with reference to the appendices. 

## Complex materials

* **Concentrated electrolytes**: When ions are concentrated enough, the strong screening washes out the important of the potential, and nonidealities make the potential ambiguous too. Like a metal we want to focus on plotting $V_i$ of the present charge carriers, but now we get all the complications of coupled multi-ion transport plus coupling to neutral species (and solvent!).
* **Ionic liquids**: Much like concentrated electrolytes?
* **Plasma**: Include this?
* **Mixed Ionic-Electronic Conductors (MIECs)**: Materials where both ions and electrons can conduct. These exhibit rich, cross-coupled transport and local concentration polarization, serving as the bridge between pure electronics and pure electrochemistry.
* **Superconductors**: These might seem exotic but for our purposes they can be treated as metals with infinite conductivity. Superconductors do have a well defined $V_{\mathrm{e}^-}$ which is important for their connection to other electronic conductors.

## Takeaways

When discussing solutions and semiconductors, we found it helpful to introduce the dilute standard state $V^\circ_i$ and band edges, however these reference states are not always relevant. When we look at other conductors, we see that a focus on the thermodynamically fundamental $V_i$ is still crucial and $V_i$ are the core quantities we want to see plotted. 

[**NEXT TOPIC: Bipolar membranes and pn junctions**](../bipolar/)
