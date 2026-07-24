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
The simplest way to drive a semiconductor out of equilibrium: shine light on it. In this uniformly illuminated bar, photogeneration runs the recombination reaction in reverse ($\varnothing \rightarrow \mathrm{e}^- + \mathrm{h}^+$), pumping conventional current from the electron rail up to the hole rail (the upward arrows), and the rails split apart. Each plain metal contact is a perfect recombination surface that keeps the rails pinned together at its face (the ⇌), so the splitting is largest mid-bar and closes at the ends. The slopes tell the transport story: both photocarriers flow outward toward the contacts, and the two species currents cancel exactly at every point. The bar carries zero net current everywhere while dissipating steadily, a situation no single-curve picture can display. Slide the illumination to zero and the rails merge into one flat Fermi level.
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

where $n$, $p$ are the electron and hole concentrations and $N_{\mathrm{C}}$, $N_{\mathrm{V}}$ are the effective {% wiki "Density of states", "densities of states" %}, playing precisely the part of the reference concentration $c^\circ$.

Lay these next to the dilute-ion formula from the last topic and the unification is complete:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln\!\left(\frac{c_i}{c^\circ}\right). $$

Set $z = -1$ and the minus sign for electrons falls right out; set $z = +1$ for holes. (The semiconductor convention writes $k_{\mathrm{B}}T/e$ where chemistry writes $RT/F$: the same quantity, counted per particle or per mole.) The band edges *are* a standard-state ladder; the carriers float above or below them by a logarithmic concentration term. A semiconductor is, in this light, just a peculiar two-ion solution whose "solvent" is the crystal.

> **One honest asterisk on the shared symbol.** The band-edge $V^\circ_{\mathrm{h}^+}$ marks a hole at rest, whereas the ionic standard state $V^\circ_{\mathrm{H}^+}$ marks only an extrapolated standard concentration of $\mathrm{H}^+$ ions. Though ontologically different, the two are thermodynamically the same thing, as the equations above show, so I've chosen to put them under one symbol.^[Where would the hole's standard state sit if we referenced it to the chemist's $c^\circ$ instead? For silicon's valence band, $N_{\mathrm{V}} \approx 1\times10^{19}~\mathrm{cm^{-3}} \approx 0.02~\mathrm{mol/L}$, so a $c^\circ$-referenced $V^\circ_{\mathrm{h}^+}$ would sit about $0.1~\mathrm{V}$ up into the band: it is the convention of taking $N_{\mathrm{V}}$ itself as the reference concentration that parks the standard state exactly on the at-rest level. Note that $N_{\mathrm{V}}$ varies with temperature, pressure, and material (graded band gaps included, see [inhomogeneities](../inhomog/)), so the $c^\circ$-referenced level would not keep a constant offset from the at-rest level.]

<figure class="demo-container" style="max-width: 560px">
{% include "esbd-diagrams/levels-ss-ladder.njk" %}
{% figcaption %}
The standard-state ladder, two ways: an acidified nitrate/chloride solution (spectator cation not drawn), and $n$-type silicon. In both columns each carrier floats a log-concentration distance from its rung. In silicon the two carriers share one line, so $n$ and $p$ trade off about it: mass action, $np$ fixed. The columns' relative alignment is arbitrary, as nothing here is in contact.
{% endfigcaption %}
</figure>

This logarithmic (Boltzmann) form is the *dilute* form in both worlds: it assumes a non-degenerate semiconductor, the direct analog of an ideal-dilute solution. Push the carrier density high (heavy doping, or a metal) and the carriers go degenerate, switching to Fermi–Dirac statistics (more on that below); on the diagram, that is the carrier line entering the band-edge hatching, the very visual the ionic $V^\circ_i$ borrowed. We'll meet the degenerate limit properly with [metals and other dense conductors](../other_conductors/).

## Where semiconductors and solutions differ

The two systems obey one set of rules, but quantitatively they emphasize different things, partly for real physical reasons and partly just because solid-state physics and electrochemistry grew up apart and named the same phenomena differently.

* **Electrostatics and "doping."** Semiconductor devices are built from deliberately patterned *static* background charges (donors $N_{\mathrm{D}}^+$, acceptors $N_{\mathrm{A}}^-$). Solutions are usually self-balancing instead, but the parallel is exact when you look for it: a supporting electrolyte is a sea of mobile "dopants," and an ion-exchange membrane carries a *fixed* background charge that does the same job as a donor or acceptor. [Charge neutrality and mass action](../charge_neutrality/) is all about this.
* **Screening.** Semiconductor "band bending" near a junction and the electrochemical "electric double layer" near an electrode are the *same* phenomenon: $V^\circ_i$ curving over a {% wiki "Debye length" %} to screen charge while $V_i$ rides flat. Practically the semiconductor version reaches further (longer Debye lengths, smaller devices), but it's one physics, treated in [basic electrostatics](../basicelectrostatics/).
* **Transport.** Solutions carry more carriers and add complications semiconductors rarely face: advection, several mobile ions at once, coupling to neutral solute flows.
* **Nonideality.** The two fields allocate their deviations differently. Condensed-matter physicists like to fold them into the carriers themselves, as quasiparticle renormalizations (effective masses, gap shifts, screening); chemists prefer to fold them into a quantity that ought to be a thermodynamic observable, the effective concentration, i.e. activity (the single-ion ambiguity notwithstanding). Same deviations, different bookkeeping.
* **The sign of the band gap.** Look again at the two-ladder figure: silicon's edges bracket its carriers, while the solution column is inside-out, cation rung at the bottom hatching up, anion rungs at the top hatching down, carriers floating outside. Read as a band structure, the ion bands overlap: a negative band gap. This is partly a bookkeeping artifact, since cation-to-anion distances carry the offset conventions of [Offsets galore](../offsetsgalore/), and a convention that pulled the carrier levels together would redraw the column right-side out. But negative gaps are also genuinely permitted here: overlapping bands in a crystal flood with carriers, because a pair costs nothing to create but the gap energy and recombination always runs, whereas an ion pair must be sourced from some neutral species. The gap's real job, setting how scarce the carriers are, passes to the sourcing reaction's equilibrium constant: $59~\mathrm{mV}$ of effective gap per unit of $\mathrm{p}K$.^[Worked out in the book's own numbers: water sources its own ions, and autoionization pins the $\mathrm{H}^+$–$\mathrm{OH}^-$ spacing at $2.46~\mathrm{V}$ while their rungs sit only $1.63~\mathrm{V}$ apart, squeezing the carriers a combined $0.83~\mathrm{V} = 14 \times 59~\mathrm{mV}$ out onto their dilute sides. (The rung gap and the pinned spacing each depend on the offset conventions; their difference is $\mathrm{p}K_{\mathrm{w}}$, convention-free.) So pure water is an intrinsic ionic semiconductor with a $\mathrm{p}K_{\mathrm{w}}$-sized effective gap, and pH 7 plays the part of $n_i$. Saturated AgCl ($\mathrm{p}K_{\mathrm{sp}} \approx 9.7$) makes a $0.58~\mathrm{V}$ wide-gap ionic semiconductor; saturated NaCl, with its $K_{\mathrm{sp}} > 1$, really is an ionic semimetal, both carriers pinned degenerate. A salt solution with no solid present runs no sourcing reaction at all, so its pair splitting simply floats: the permanent "quasi-Fermi splitting" of [Species voltage](../v_i/). Silicon fits the same accounting with the crystal as source, its "$\mathrm{p}K$" being $E_g/59~\mathrm{mV} \approx 19$.]
* **Quantum statistics.** Fill a band far enough and the Boltzmann form gives way to {% wiki "Fermi–Dirac statistics" %}. This could be filed under nonideality, but it is nonideality of a special kind: the carriers still ignore one another, forming an ideal *Fermi* gas rather than an ideal Boltzmann gas. While this sounds exotic, chemistry has a thermodynamically identical concept: **lattice gas statistics** (the {% wiki "Langmuir adsorption model", "Langmuir isotherm" %}), where each binding site holds at most one occupant. Pauli exclusion or steric exclusion, the result is the same occupancy law, $1/(1 + e^{(E - \bar\mu)/k_{\mathrm{B}}T})$ per state or per site. That law converges on ideal-dilute statistics in the nearly-empty (or nearly-full^[A nearly-full band *is* the thermodynamic essence of what holes are, and in chemistry, mobile vacancies work much the same. Though, electron holes can also *ballistically* move just like positive particles, as mentioned in the first footnote.]) limit.

## Takeaways

By reading the band edges as standard states $V^\circ_i$ and the Fermi/quasi-Fermi levels as species voltages $V_i$, a semiconductor obeys the same thermodynamic rules as an ionic solution: electrons are anions, holes are cations, and a chip is a two-carrier "solution" in a crystal solvent. This bridge is what the rest of the book stands on: it is what lets us **export the band-diagram way of thinking from semiconductors into electrochemistry** and actually *draw* what is going on inside an electrochemical system.

From here on we'll mostly work with electrochemical devices, but a semiconductor analog is almost always lurking one step away, and we'll reach for it whenever it sharpens the picture. Next, we put the standard-state ladder to work: how doping, neutrality, and the common-ion effect all amount to pushing the $V^\circ_i$ ladder around.

[**NEXT TOPIC: Charge neutrality and mass action**](../charge_neutrality/)
