---
layout: layouts/esbd_topic.njk
title: 'Semiconductors'
tags: [page, esbd_topic]
orderESBD: 22
---

# {{title}}

In the [last topic](../solutions/) we saw dilute ions in a liquid solution arrange themselves into a species voltage $V_i$ sitting a logarithmic distance away from a floating standard state $V^\circ_i$. We now make the move that the rest of this project leans on: **the exact same picture describes the electronic carriers in a solid-state semiconductor.** Conduction electrons and valence holes are just charge carriers with an electrochemical potential, so they too have a species voltage, a standard state, and an Ohm's law — and once we see this, the semiconductor band diagram and the electrochemical band diagram become two views of one object.

The trick is simply to treat the two solid-state carriers as charged species on the same footing as ions:

* **Conduction electrons** ($\mathrm{e}^-$): negatively charged mobile carriers ($z = -1$) — the solid-state **anion**.
* **Valence holes** ($\mathrm{h}^+$): positively charged mobile carriers ($z = +1$) — the solid-state **cation**.^[A hole isn't merely a missing electron. In the valence band the electrons have negative effective mass, so a missing valence electron behaves like a real particle with *positive* charge and *positive* mass. See Kittel, or the summary at {% wiki "Electron hole" %}.]

With that identification, everything we built for ions carries over verbatim.

## Flipping the band diagram upside-down

There is one cosmetic price to pay first, and it is worth naming clearly because it will jar any physicist.

A standard semiconductor {% wiki "energy band diagram", "band diagram" %} plots **electron energy** increasing **upwards**. But electrons carry negative charge, so higher electron energy means *lower* voltage: $V_{\mathrm{e}^-} = \bar\mu_{\mathrm{e}^-}/(-e)$. Our axis is voltage, increasing upwards — to match electronic circuit schematics and the chemical scales we used for ions. The consequence is that **an ESBD is a standard band diagram flipped vertically**:

* the conduction band edge ($V^\circ_{\mathrm{e}^-}$) sits at the **bottom**,
* the valence band edge ($V^\circ_{\mathrm{h}^+}$) sits at the **top**.

<figure class="diagram-placeholder">
{% figcaption %}
Side by side: a standard semiconductor energy band diagram (energy up, conduction band on top) and the same situation as an ESBD (voltage up, conduction band on the bottom). It is a simple vertical flip.
{% endfigcaption %}
</figure>

I won't pretend this is comfortable — it cost me some discomfort too. But the flip isn't a quirk of taste; it's forced. The moment we want electrons and ions on *one* axis, that axis has to be charge-normalized (volts), and a charge-normalized axis turns electron energies upside down. The reward is that the diagram now reads in the same direction as a voltmeter and a circuit schematic, and lines up rung-for-rung with the ionic ladders of the previous topic.

> **This isn't even new to semiconductors.** Voltage-scaled Fermi levels appear right at the origin of the field: in his founding p–n junction paper, Shockley wrote the quasi-Fermi levels as voltages — his $\phi_n$ and $\phi_p$ are exactly our $V_{\mathrm{e}^-}$ and $V_{\mathrm{h}^+}$.^[Shockley, W. (1949). [The Theory of p-n Junctions in Semiconductors and p-n Junction Transistors](https://doi.org/10.1002/j.1538-7305.1949.tb03645.x). Bell System Technical Journal, 28(3), 435–489. The energy-based convention won out in the community, and of course no one carried the voltage scaling over to ions.] As is a recurring theme in this project: the quantities are old; what's new is putting them on a shared picture.

## Carriers driven by their own voltage

Because electrons and holes are just charged species, each is driven by the gradient of its own species voltage, exactly as ions are:

$$ J_{\mathrm{e}^-} = -\sigma_{\mathrm{e}^-} \nabla V_{\mathrm{e}^-}, \qquad J_{\mathrm{h}^+} = -\sigma_{\mathrm{h}^+} \nabla V_{\mathrm{h}^+}. $$

A slope in $V_{\mathrm{e}^-}$ or $V_{\mathrm{h}^+}$ means current and dissipation; a flat line means equilibrium for that carrier. Same rule, same reading, whether the carrier is a lithium ion in an electrolyte or an electron in silicon.

### Quasi-Fermi levels: more than one $V_i$ at a point

We already insisted, back in the [species voltage topic](../v_i/), that there can be several distinct $V_i$ in the same place. Semiconductor physicists have long been comfortable with exactly this, under the name {% wiki "quasi Fermi level", "quasi-Fermi levels" %}: when a device is driven out of equilibrium, the electron and hole populations stop sharing a single Fermi level and we write $V_{\mathrm{e}^-} \neq V_{\mathrm{h}^+}$. This is the everyday state of affairs in the depletion region of a diode, a solar cell, or a bipolar transistor.

At equilibrium the two collapse onto each other, $V_{\mathrm{e}^-} = V_{\mathrm{h}^+}$ — the single Fermi level — which is just our familiar statement that the electron/hole recombination reaction $\mathrm{e}^- + \mathrm{h}^+ \rightleftharpoons \varnothing$ has equilibrated, pinning the two species' voltages together. This kind of constraint, of the form $V_i = V_j$, has important consequences and also has direct parallels in electrochemistry that we will be exploring in the next topic.

## Band edges are standard states ($V^\circ_i$)

Here is the heart of the analogy. The band edges play exactly the role that the ionic standard states $V^\circ_i$ played in solution:

* the **conduction band edge** $E_{\mathrm{C}}$ is the electron standard state, $V^\circ_{\mathrm{e}^-} = -E_{\mathrm{C}}/e$,
* the **valence band edge** $E_{\mathrm{V}}$ is the hole standard state, $V^\circ_{\mathrm{h}^+} = -E_{\mathrm{V}}/e$.

And just as a dilute ion's voltage deviates logarithmically from its standard state according to concentration, the carriers' voltages deviate from the band edges according to how full the bands are:

$$ V_{\mathrm{e}^-} = V^\circ_{\mathrm{e}^-} - \frac{k_{\mathrm{B}}T}{e} \ln\!\left(\frac{n}{N_{\mathrm{C}}}\right), \qquad V_{\mathrm{h}^+} = V^\circ_{\mathrm{h}^+} + \frac{k_{\mathrm{B}}T}{e} \ln\!\left(\frac{p}{N_{\mathrm{V}}}\right), $$

where $n$, $p$ are the electron and hole concentrations and $N_{\mathrm{C}}$, $N_{\mathrm{V}}$ are the effective {% wiki "Density of states", "densities of states" %} — playing precisely the part of the reference concentration $c^\circ$.

Lay these next to the dilute-ion formula from the last topic and the unification is complete:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln\!\left(\frac{c_i}{c^\circ}\right). $$

Set $z = -1$ and the minus sign for electrons falls right out; set $z = +1$ for holes. (The semiconductor convention writes $k_{\mathrm{B}}T/e$ per particle where chemistry writes $RT/F$ per mole — the same quantity in different clothing.) The band edges *are* a standard-state ladder; the carriers float above or below them by a logarithmic concentration term. A semiconductor is, in this light, just a peculiar two-ion solution whose "solvent" is the crystal.

<figure class="diagram-placeholder">
{% figcaption %}
The standard-state ladder, two ways. Left: a solution's $V^\circ_i$ rungs (e.g. $V^\circ_{\mathrm{Na}^+}$, $V^\circ_{\mathrm{H}^+}$, $V^\circ_{\mathrm{Cl}^-}$) with each ion's $V_i$ floating a $\log$-concentration distance away. Right: a semiconductor's two-rung ladder — the conduction-band edge $V^\circ_{\mathrm{e}^-}$ (bottom) and valence-band edge $V^\circ_{\mathrm{h}^+}$ (top) — with $V_{\mathrm{e}^-}$ and $V_{\mathrm{h}^+}$ floating away from them by carrier concentration.
{% endfigcaption %}
</figure>

It's worth noting that this logarithmic (Boltzmann) form is the *dilute* form in both worlds: it assumes a non-degenerate semiconductor, the direct analog of an ideal-dilute solution. Push the carrier density high — heavy doping, or a metal — and the carriers go degenerate and Fermi–Dirac, exactly as a concentrated electrolyte goes non-ideal. We'll meet that limit again with [metals and other dense conductors](../other_conductors/).

## Where semiconductors and solutions differ

The two systems obey one set of rules, but quantitatively they emphasize different things — partly for real physical reasons, and partly just because solid-state physics and electrochemistry grew up apart and named the same phenomena differently.

* **Electrostatics and "doping."** Semiconductor devices are built from deliberately patterned *static* background charges (donors $N_{\mathrm{D}}^+$, acceptors $N_{\mathrm{A}}^-$). Solutions are usually self-balancing instead, but the parallel is exact when you look for it: a supporting electrolyte is a sea of mobile "dopants," and an ion-exchange membrane carries a *fixed* background charge that does the same job as a donor or acceptor. This is the subject of the [next topic](../charge_control/).
* **Screening.** Semiconductor "band bending" near a junction and the electrochemical "electric double layer" near an electrode are the *same* phenomenon — $V^\circ_i$ curving over a {% wiki "Debye length" %} to screen charge while $V_i$ rides flat. Practically the semiconductor version reaches further (longer Debye lengths, smaller devices), but it's one physics, treated in [basic electrostatics](../basicelectrostatics/).
* **Transport.** Solutions carry more carriers and add complications semiconductors rarely face — advection, several mobile ions at once, coupling to neutral solute flows.
* **Non-ideality.** Because bands and electrons are relatively well-characterized, physicists attribute deviations to specific mechanisms (band-structure detail, quantum statistics, interactions). Ionic chemistry can rarely pin these down, so it lumps everything into a thermodynamic activity coefficient. Same deviation, different bookkeeping.

## Takeaways

By reading the band edges as standard states $V^\circ_i$ and the Fermi/quasi-Fermi levels as species voltages $V_i$, a semiconductor obeys the identical thermodynamic rules as an ionic solution — electrons are anions, holes are cations, and a chip is a two-carrier "solution" in a crystal solvent. This is the central bridge of the whole project: to **export the band-diagram way of thinking from semiconductors into electrochemistry**, so that — to finally honor Kroemer's law — we can actually *draw* what is going on inside an electrochemical system.

From here on we'll mostly work with electrochemical devices, but a semiconductor analog is almost always lurking one step away, and we'll reach for it whenever it sharpens the picture. Next, we put the standard-state ladder to work: how doping, neutrality, and the common-ion effect all amount to pushing the $V^\circ_i$ ladder around.

[**NEXT TOPIC: Mass action and charge control**](../charge_control/)
