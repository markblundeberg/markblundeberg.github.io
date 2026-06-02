---
layout: layouts/esbd_topic.njk
title: 'Semiconductors'
tags: [page, esbd_topic]
orderESBD: 22
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

GOAL: Besides remarking on how ESBDs are just upside down energy band diagrams, we want to emphasize the similarities of semiconductors with electrolytes, but also remark on the differences (which sometimes are intrinsic and sometimes due to style)

Now that we have explored dilute ions in liquid solutions, we look at how the same electrochemical species voltage ($V_i$) framework applies to electronic carriers in solid-state semiconductors. 

By treating conduction band electrons and valence band holes as solid-state analogs to chemical anions and cations, we can unify semiconductor band diagrams and electrochemistry under a single set of rules.

## Flipping energy band diagrams upside-down

* **The Physicist's Dissonance**: Standard semiconductor band diagrams plot **electron energy** pointing **upwards**. Because electrons have a negative charge ($q = -e$), higher energy corresponds to a lower electrostatic voltage. Thus, in standard diagrams, the conduction band is at the top and the valence band is at the bottom.
* **The Voltage Representation**: Because this book uses a **voltage-mode vertical axis** (Volts pointing upwards) to align with electronic circuit schematics and chemical scales:
  * The conduction band edge ($V^\circ_{\mathrm{e}^-}$) sits at the **bottom**.
  * The valence band edge ($V^\circ_{\mathrm{h}^+}$) sits at the **top**.
* **Apology and reassurance**: Why did we do this? Really for the sake of ions, a normalization had to be done, and not flipping the diagrams would have been more awkward and less intuitive. So a mild sacrifice had to be made even if uncomfortable for electronic physics but you'll get used to it.

<figure class="diagram-placeholder">
{% figcaption %}
Comparison of a standard semiconductor energy band diagram (energy pointing up, conduction band on top) and the ESBD voltage band diagram (voltage pointing up, conduction band on the bottom). A simple flip vertical.
{% endfigcaption %}
</figure>

{#
History note:
Curiously, the voltage scaling was actually used in Shockley's founding paper on bipolar transistors, where his voltage quasi-fermi levels $\phi_p$ and $\phi_n$ are identical to $V_{\mathrm{h}^+}$ and $V_{\mathrm{e}^-}$ discussed here,^[Shockley, W. (1949). [The Theory of p-n Junctions in Semiconductors and p-n Junction Transistors](https://doi.org/10.1002/j.1538-7305.1949.tb03645.x). Bell System Technical Journal, 28(3), 435–489.], however this was not adopted by the broader community.
The band model of semiconductors was developed in 1931 by Wilson, and very soon after, energy band diagrams (plots of electronic energies vs. position) were found to be highly beneficial in explaining metal-semiconductor junction rectification.^[See e.g., Mott's paper, Mott, N. F. (1939). [The theory of crystal rectifiers](https://doi.org/10.1098/rspa.1939.0051). Proceedings of the Royal Society of London. Series A. Mathematical and Physical Sciences, 171(944), 27–38.]
#}

## Carriers as Solid-State Ions

* **Conduction Electrons ($\mathrm{e}^-$)**: Negatively charged mobile carriers, behaving as solid-state **anions**.
* **Valence Holes ($\mathrm{h}^+$)**: Positively charged mobile vacancies in the valence band, behaving as solid-state **cations**.^[Note holes aren't just absences of electrons, rather the key point is that in the valence band the electrons move 'backwards' (negative mass) so a missing valence band electron acts just like a positively charged, positive-mass particle. See Kittel, summarized well on {% wiki "Electron hole" %}.]
* **Symmetric Conduction**: Both carriers are driven by their own species-specific voltage gradients ($-\nabla V_{\mathrm{e}^-}$ and $-\nabla V_{\mathrm{h}^+}$), flowing to release free energy.

### Quasi-fermi levels: multiple $V_i$ in semiconductors.

The idea of having multiple distinct $V_i$ is not exclusive to solutions but also appears in semiconductors, albeit only when driven out of equilibrium.

It is common to see $ V_{\mathrm{e}^-} \neq V_{\mathrm{h}^+} $ in active devices especially the pn junctions in diodes, solar cells, and bipolar transistors.

## Band Edges as Standard States ($V^\circ_i$)
* **Conduction Band Edge ($E_{\mathrm{C}}$)**: Acts as the standard state species voltage for electrons: $V^\circ_{\mathrm{e}^-} = -E_{\mathrm{C}}/e$.
* **Valence Band Edge ($E_{\mathrm{V}}$)**: Acts as the standard state species voltage for holes: $V^\circ_{\mathrm{h}^+} = -E_{\mathrm{V}}/e$.
* **Boltzmann Concentration Deviations**: Just like dilute ions in solution, the actual species voltages deviate from these standard states based on carrier concentrations:
  $$ V_{\mathrm{e}^-} = V^\circ_{\mathrm{e}^-} - \frac{k_{\mathrm{B}}T}{e} \ln\left(\frac{n}{N_{\mathrm{C}}}\right) $$
  $$ V_{\mathrm{h}^+} = V^\circ_{\mathrm{h}^+} + \frac{k_{\mathrm{B}}T}{e} \ln\left(\frac{p}{N_{\mathrm{V}}}\right) $$
  where $n$ and $p$ are carrier concentrations, and $N_{\mathrm{C}}$ and $N_{\mathrm{V}}$ are effective densities of states (acting as the standard concentration reference $c^\circ$).

<figure class="diagram-placeholder">
{% figcaption %}
-Side by side comparison of V^0_i standard ion ladder in solution and V^0 band edge ladder in semiconductor.
{% endfigcaption %}
</figure>

### The Law of Mass Action

{# Why talk about this: gives a nice parallel principle #}

(follows naturally from standard states)

* **Carrier Product**: In an ideal semiconductor, the product of mobile carrier densities is a constant:
  $$ n \cdot p = n_{\mathrm{i}}^2 $$
  where $n_{\mathrm{i}}$ is the intrinsic carrier concentration.
* **The Solubility Analog**: This is the exact equivalent of the ionic solubility product (e.g., $c_{\mathrm{Na}^+} c_{\mathrm{Cl}^-} = K_{\mathrm{sp}}$) or the water self-ionization constant ($K_{\mathrm{w}}$).
* Recombination-generation is just like autodissociation; will address this more in bipolar topic.
* Discuss the detailed balance / kinetic viewpoint too.

<figure class="diagram-placeholder">
{% figcaption %}
Parallel semiconductor/electrolyte diagrams with fixed V_i and movable slider for V^0 offset?
{% endfigcaption %}
</figure>

## Further comparing semiconductors and solutions

As described above, semiconductors and solutions are closely analogous. Practically however, there are quantitative differences in their behaviour which cause different phenomena to be emphasized differently. Also, some differences in the way we treat these materials are just due to the two fields growing independently and coming up with different viewpoints on the same phenomena.

* Electrostatics
  * Dopants: Semiconductor devices rely on carefully imprinted spatial patterns of static charges. Solutions tend to be self-balancing, though extra supporting electrolytes can act as mobile 'dopants' and there are solid ionic media (like ion exchange membranes) with fixed background charges that act just like dopants (which we will talk more about later)
  * Band bending in semiconductors is the same phenomenon as the electric double layer, both relating to the Debye screening length. Practically, semiconductor band bending tends to be more spatially relevant due to longer Debye length and smaller devices, but electrochemical double layers are still important in terms of capacitance.
* Transport: The many-carrier nature of solutions means their transport can show more complexity. Solutions also have advection and neutral solute flows to think about. We'll talk more about transport in upcoming transport topic.
* Non-ideality: As semiconductor bands tend to be reasonably well defined and electrons are reasonably well behaved, physicists try to dig into precise mechanisms that attribute deviations to band structure morphing, quantum statistics, interactions, and the like. In contrast with ion chemistry it's far harder to nail these things down (and harder to measure mechanisms too) so everything gets lumped into a thermodynamic non-ideality factor.

{# As a juicy preview, put some figures here that are imported from later topic, e.g. the pn junction / bipolar membrane comparison. #}

<figure class="diagram-placeholder">
{% figcaption %}
- band bending / EDL
{% endfigcaption %}
</figure>

<figure class="diagram-placeholder">
{% figcaption %}
- pn junction / bipolar membrane
{% endfigcaption %}
</figure>

## Takeaways

By translating semiconductor band edges and Fermi levels into standard states ($V^\circ_i$) and species voltages ($V_i$), we show that solid-state electronics obeys the exact same thermodynamic rules as ionic solutions. Our $V_i$ diagrams nicely unify the two, and really this is the goal of the project: to export the "band diagram way of thinking" from semiconductors to electrochemistry.

For the remainder of the topics we will generally focus on electrochemical devices but we keep in mind at every step that there is often a close semiconductor parallel analog. From time to time we'll dive deeper into how solutions and semiconductors have their own special considerations.

[**NEXT TOPIC: Basic electrostatics**](../basicelectrostatics/)
