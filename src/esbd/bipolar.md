---
layout: layouts/esbd_topic.njk
title: 'Bipolar membranes and pn junctions'
tags: [page, esbd_topic]
orderESBD: 27
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

One of the most beautiful conceptual bridges between solid-state device physics and electrochemistry is the exact parallel between the semiconductor **p-n junction diode** and the electrochemical **bipolar membrane**.

By visualizing both side-by-side using $V_i$ band diagrams, we see that they are functional twins operating on the same fundamental rules of carrier injection, generation, and recombination.

---

## 1. Structural Comparison
* **The Semiconductor p-n Junction**:
  * Joined materials: a p-type semiconductor (rich in mobile positive holes $\mathrm{h}^+$) and an n-type semiconductor (rich in mobile negative electrons $\mathrm{e}^-$).
* **The Electrochemical Bipolar Membrane**:
  * Joined materials: a cation-exchange membrane (CEM, rich in mobile positive protons $\mathrm{H}^+$) and an anion-exchange membrane (AEM, rich in mobile negative hydroxide ions $\mathrm{OH}^-$). Membrane media act as a static background charge (effectively dopants).

---

## 2. Equilibrium: Band Bending and Depletion
* **Flat Voltage Alignment**: At equilibrium, the species voltages must remain flat across the entire junction.
  * In the p-n junction: $V_{\mathrm{e}^-} = V_{\mathrm{h}^+}$.
  * In the bipolar membrane: $V_{\mathrm{H}^+} - V_{\mathrm{OH}^-} = 2.457~\mathrm{V}$ (fixed offset).
* **Built-in Potentials**: Because the carrier concentrations change drastically across the junction, the standard states ($V^\circ_i$ band edges) must bend.
* **The Depletion Zone**: A localized electric field forms at the interface, creating a region depleted of mobile carriers (electrons/holes or protons/hydroxides).

---

## 3. Reverse Bias: Generation vs. Water Splitting
* **The Flow Direction**: Under reverse bias, mobile carriers are pulled away from the junction interface.
* **Semiconductor Carrier Generation**:
  * As carriers are swept away, thermal or optical energy generates new electron-hole pairs at the interface:
    $$ \emptyset \rightarrow \mathrm{e}^- + \mathrm{h}^+ $$
  * In the $V_i$ diagram, the electron and hole voltages split, and their slope drives these newly generated carriers out of the junction.
* **Bipolar Membrane Water Splitting**:
  * Protons and hydroxides are swept away. The intense electric field in the depletion region catalytically splits water into protons and hydroxides:
    $$ \mathrm{H_2O} \rightarrow \mathrm{H}^+ + \mathrm{OH}^- $$
  * Show how this catalytic generation is the exact chemical analog of electron-hole pair generation, driven by the split in species voltages.

---

## 4. Forward Bias: Recombination vs. Neutralization
* **The Flow Direction**: Under forward bias, carriers are injected *into* the junction interface from both sides.
* **Semiconductor Recombination**:
  * Injected electrons and holes meet at the junction and recombine:
    $$ \mathrm{e}^- + \mathrm{h}^+ \rightarrow \emptyset $$
  * This recombination releases energy (light in an LED, or heat).
* **Bipolar Membrane Neutralization**:
  * Injected protons and hydroxide ions meet at the junction and neutralize to form water:
    $$ \mathrm{H}^+ + \mathrm{OH}^- \rightarrow \mathrm{H_2O} $$
  * This chemical recombination (neutralization) releases the heat of neutralization.

---

## Takeaways

Whether in a silicon chip or a water-purification membrane, the physics of depletion, carrier injection, and generation-recombination are identical when viewed through the unifying lens of species voltages.

[**NEXT TOPIC: Half-reactions**](../half/)
