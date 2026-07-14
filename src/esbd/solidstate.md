---
layout: layouts/esbd_topic.njk
title: 'Semiconductors'
tags: [page, esbd_topic]
orderESBD: 22
---

# {{title}}

In the [last topic](../solutions/) we saw dilute ions in a liquid solution arrange themselves into a species voltage $V_i$ sitting a logarithmic distance away from a floating standard state $V^\circ_i$. It turns out that **the exact same picture describes the electronic carriers in a solid-state semiconductor.** Conduction electrons and valence holes are just charge carriers with an electrochemical potential, so they too have a species voltage, a standard state, and an Ohm's law; once we see this, the semiconductor band diagram and the electrochemical band diagram become two views of one object.

The trick is simply to treat the two solid-state carriers as charged species on the same footing as ions:

* **Conduction electrons** ($\mathrm{e}^-$): negatively charged mobile carriers ($z = -1$) — the solid-state **anion**.
* **Valence holes** ($\mathrm{h}^+$): positively charged mobile carriers ($z = +1$) — the solid-state **cation**.^[A hole isn't merely a missing electron. In the valence band the electrons have negative effective mass, so a missing valence electron behaves like a real particle with *positive* charge and *positive* mass. See Kittel, or the summary at {% wiki "Electron hole" %}.]

With that identification, everything we built for ions carries over verbatim.

## Flipping the band diagram upside-down

There is one cosmetic matter to get out of the way first, for readers arriving from semiconductor physics.

A standard semiconductor {% wiki "energy band diagram", "band diagram" %} plots **electron energy** increasing **upwards**. But electrons carry negative charge, so higher electron energy means *lower* voltage: $V_{\mathrm{e}^-} = \bar\mu_{\mathrm{e}^-}/(-e)$. Our axis is voltage, increasing upwards, to match electronic circuit schematics and the chemical scales we used for ions. The consequence is that **an ESBD is a standard band diagram flipped vertically**:

* the conduction band edge sits at the **bottom**,
* the valence band edge sits at the **top**.

<figure class="demo-container" style="max-width: 700px">
{% include "esbd-diagrams/esbd-solidstate-flip.njk" %}
{% figcaption %}
Side by side: a standard semiconductor energy band diagram (energy up, conduction band on top) and the same situation as an ESBD (voltage up, conduction band on the bottom). We'll discuss the notation differences below.
{% endfigcaption %}
</figure>

The flip is not strictly forced: putting electrons and positive ions on *one* axis forces a normalization by charge, but the sign is ours to pick. In the end it's just better with volts: a voltage axis reads in the same direction as every voltmeter, circuit schematic, and electrode-potential scale. This isn't even the first time this has been done with semiconductor devices.^[In his founding p–n junction paper, Shockley wrote the quasi-Fermi levels as voltages; his $\phi_n$ and $\phi_p$ are exactly our $V_{\mathrm{e}^-}$ and $V_{\mathrm{h}^+}$. Shockley, W. (1949). [The Theory of p-n Junctions in Semiconductors and p-n Junction Transistors](https://doi.org/10.1002/j.1538-7305.1949.tb03645.x). Bell System Technical Journal, 28(3), 435–489. The energy-based convention won out in the community. Curiously though, it seems, nobody thought to plot $\mathrm{H}^+$ the way Shockley had plotted $\mathrm{h}^+$.] You'll get used to it.

## Carriers driven by their own voltage

Because electrons and holes are just charged species, each is driven by the gradient of its own species voltage, exactly as ions are:

$$
\begin{aligned}
J_{\mathrm{e}^-} &= -\sigma_{\mathrm{e}^-} \nabla V_{\mathrm{e}^-}, \\
J_{\mathrm{h}^+} &= -\sigma_{\mathrm{h}^+} \nabla V_{\mathrm{h}^+}.
\end{aligned}
$$

A slope in $V_{\mathrm{e}^-}$ or $V_{\mathrm{h}^+}$ means current and dissipation; a flat line means equilibrium for that carrier. Same rule, same reading, whether the carrier is a lithium ion in an electrolyte or an electron in silicon.

### Quasi-Fermi levels: more than one $V_i$ at a point

We already insisted, back in the [species voltage topic](../v_i/), that there can be several distinct $V_i$ in the same place. Semiconductor physicists have long been comfortable with exactly this, under the name {% wiki "quasi Fermi level", "quasi-Fermi levels" %}: when a device is driven out of equilibrium, the electron and hole populations stop sharing a single Fermi level and we write $V_{\mathrm{e}^-} \neq V_{\mathrm{h}^+}$. This is the everyday state of affairs in the depletion region of a diode, a solar cell, or a bipolar transistor; the photovoltaic literature takes it the most seriously of all.^[P. Würfel, *Physics of Solar Cells: From Principles to New Concepts* (Wiley-VCH, 2005): a solar cell runs on the electrochemical potentials of its carriers, with the currents driven by their gradients rather than by the electric field. It is the photovoltaic community's closest counterpart to the viewpoint of this book.]

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-ss-quasifermi.njk" %}
{% figcaption %}
Out of equilibrium, the electron rail $V_{\mathrm{e}^-}$ and hole rail $V_{\mathrm{h}^+}$ pull apart and slope independently; recombination ($\mathrm{e}^- + \mathrm{h}^+ \rightarrow \varnothing$) shows up as leakage bridging the rails all along the bar: the downward arrows, conventional current falling from rail to rail through the reaction. Slide the drive to zero and the rails merge into a single flat Fermi level, the arrows fading out with the drive. Note the handoff at the left contact, carrying its own ⇌: that metal's electrons sit at the *hole* rail's level, and that contact stays equilibrated even while the bulk is driven (an ⇌ against the bar's arrows).
{% endfigcaption %}
</figure>

At equilibrium the two collapse onto a single Fermi level, $V_{\mathrm{e}^-} = V_{\mathrm{h}^+}$, and this is really a reaction equilibrium of the kind we met in the [equilibrium topic](../equilibrium/): there, chemical reactions pinned ionic differences $V_i - V_j$ with an offset $\Delta$ set by the neutral species involved. The electron/hole recombination reaction $\mathrm{e}^- + \mathrm{h}^+ \rightleftharpoons \varnothing$ involves no neutral species at all, and yields $-V_{\mathrm{e}^-} + V_{\mathrm{h}^+} = 0$.

## Band edges are standard states ($V^\circ_i$)

Here is the heart of the analogy. The band edges play exactly the role that the ionic standard states $V^\circ_i$ played in solution:

* the **conduction band edge** $E_{\mathrm{C}}$ is the electron standard state, $V^\circ_{\mathrm{e}^-} = -E_{\mathrm{C}}/e$,
* the **valence band edge** $E_{\mathrm{V}}$ is the hole standard state, $V^\circ_{\mathrm{h}^+} = -E_{\mathrm{V}}/e$.

And just as a dilute ion's voltage deviates logarithmically from its standard state according to concentration, the carriers' voltages deviate from the band edges according to how full the bands are:

$$
\begin{aligned}
V_{\mathrm{e}^-} &= V^\circ_{\mathrm{e}^-} - \frac{k_{\mathrm{B}}T}{e} \ln\!\left(\frac{n}{N_{\mathrm{C}}}\right), \\
V_{\mathrm{h}^+} &= V^\circ_{\mathrm{h}^+} + \frac{k_{\mathrm{B}}T}{e} \ln\!\left(\frac{p}{N_{\mathrm{V}}}\right),
\end{aligned}
$$

where $n$, $p$ are the electron and hole concentrations and $N_{\mathrm{C}}$, $N_{\mathrm{V}}$ are the effective {% wiki "Density of states", "densities of states" %}, playing precisely the part of the reference concentration $c^\circ$, give or take a convention.^[The "give or take": the chemist's $c^\circ$ is a round, agreed-upon $1~\mathrm{mol/L}$, while $N_{\mathrm{C}}$ and $N_{\mathrm{V}}$ are whatever the band supplies (for silicon's conduction band, $2.8\times10^{19}~\mathrm{cm^{-3}} \approx 0.05~\mathrm{mol/L}$). The two kinds of standard state are thus pinned to different reference densities. The discrepancy is worth $\tfrac{RT}{F}\ln(20) \approx 80~\mathrm{mV}$ at room temperature, small on the volts-wide scale of these diagrams, and not worth a third symbol.]

Lay these next to the dilute-ion formula from the last topic and the unification is complete:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln\!\left(\frac{c_i}{c^\circ}\right). $$

Set $z = -1$ and the minus sign for electrons falls right out; set $z = +1$ for holes. (The semiconductor convention writes $k_{\mathrm{B}}T/e$ where chemistry writes $RT/F$: the same quantity, counted per particle or per mole.) The band edges *are* a standard-state ladder; the carriers float above or below them by a logarithmic concentration term. A semiconductor is, in this light, just a peculiar two-ion solution whose "solvent" is the crystal.

<figure class="demo-container" style="max-width: 560px">
{% include "esbd-diagrams/levels-ss-ladder.njk" %}
{% figcaption %}
The standard-state ladder, two ways: an acidified nitrate/chloride solution (spectator cation not drawn), and $n$-type silicon. In both columns each carrier floats a log-concentration distance from its rung. In silicon the two carriers share one line, so $n$ and $p$ trade off about it: mass action, $np$ fixed. The columns' relative alignment is arbitrary, as nothing here is in contact.
{% endfigcaption %}
</figure>

This logarithmic (Boltzmann) form is the *dilute* form in both worlds: it assumes a non-degenerate semiconductor, the direct analog of an ideal-dilute solution. Push the carrier density high (heavy doping, or a metal) and the carriers go degenerate, switching to Fermi–Dirac statistics (more on that below); on the diagram, that is the carrier line entering the band-edge hatching, the very visual the ionic $V^\circ_i$ borrowed. We'll meet the degenerate limit properly with [metals and other dense conductors](../other_conductors/).

## Where semiconductors and solutions differ

The two systems obey one set of rules, but quantitatively they emphasize different things, partly for real physical reasons and partly just because solid-state physics and electrochemistry grew up apart and named the same phenomena differently.

* **Electrostatics and "doping."** Semiconductor devices are built from deliberately patterned *static* background charges (donors $N_{\mathrm{D}}^+$, acceptors $N_{\mathrm{A}}^-$). Solutions are usually self-balancing instead, but the parallel is exact when you look for it: a supporting electrolyte is a sea of mobile "dopants," and an ion-exchange membrane carries a *fixed* background charge that does the same job as a donor or acceptor. [Mass action and charge control](../charge_control/) is all about this.
* **Screening.** Semiconductor "band bending" near a junction and the electrochemical "electric double layer" near an electrode are the *same* phenomenon: $V^\circ_i$ curving over a {% wiki "Debye length" %} to screen charge while $V_i$ rides flat. Practically the semiconductor version reaches further (longer Debye lengths, smaller devices), but it's one physics, treated in [basic electrostatics](../basicelectrostatics/).
* **Transport.** Solutions carry more carriers and add complications semiconductors rarely face: advection, several mobile ions at once, coupling to neutral solute flows.
* **Non-ideality.** The two fields allocate their deviations differently. Condensed-matter physicists like to fold them into the carriers themselves, as quasiparticle renormalizations (effective masses, gap shifts, screening); chemists prefer to fold them into a quantity that ought to be a thermodynamic observable, the effective concentration i.e. activity (the single-ion ambiguity notwithstanding). Same deviations, different bookkeeping.
* **Quantum statistics.** Fill a band far enough and the Boltzmann form gives way to {% wiki "Fermi–Dirac statistics" %}. This could be filed under non-ideality, but it is non-ideality of a special kind: the carriers still ignore one another, forming an ideal *Fermi* gas rather than an ideal Boltzmann gas. It sounds exotically quantum, yet chemistry keeps a functionally identical statistic on hand: the {% wiki "Langmuir adsorption model", "Langmuir isotherm" %} of a lattice gas, where each binding site holds at most one occupant. Pauli exclusion or steric exclusion, the result is the same occupancy law, $1/(1 + e^{(E - \bar\mu)/k_{\mathrm{B}}T})$ per state or per site.

## Takeaways

By reading the band edges as standard states $V^\circ_i$ and the Fermi/quasi-Fermi levels as species voltages $V_i$, a semiconductor obeys the same thermodynamic rules as an ionic solution: electrons are anions, holes are cations, and a chip is a two-carrier "solution" in a crystal solvent. This bridge is what the rest of the book stands on: it is what lets us **export the band-diagram way of thinking from semiconductors into electrochemistry** and actually *draw* what is going on inside an electrochemical system.

From here on we'll mostly work with electrochemical devices, but a semiconductor analog is almost always lurking one step away, and we'll reach for it whenever it sharpens the picture. Next, we put the standard-state ladder to work: how doping, neutrality, and the common-ion effect all amount to pushing the $V^\circ_i$ ladder around.

[**NEXT TOPIC: Mass action and charge control**](../charge_control/)
