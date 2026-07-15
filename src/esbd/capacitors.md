---
layout: layouts/esbd_topic.njk
title: 'Capacitance'
tags: [page, esbd_topic]
orderESBD: 26
---

# {{title}}

By now we have quietly collected two capacitances. Back in [species voltage](../v_i/), two co-located carriers formed a capacitor wired directly between their $V_i$ rails, and in [lithium-ion batteries](../lib/) each electrode *was* that capacitor, charged deep into its nonlinear regime. Then the [last topic](../basicelectrostatics/) produced another: the "screening capacitance" $\chi$, measuring how much charge a conductor banks when its potential is nudged. Meanwhile the ordinary dielectric capacitor of circuit theory has not even made its appearance. This topic puts the whole family on one page: each piece on its own terms, and then how the pieces assemble, because assembled is the only way a measurement ever meets them.

Throughout, capacitance is the storage-side response of a conductor (charge held in proportion to a voltage *difference*), as against conductance, the flow-side response (current in proportion to a voltage *gradient*) we take up [next](../basictransport/). It is also the elastic counterpart to a reaction: a [reaction](../equilibrium/) couples two species' voltages *rigidly*, fixing the difference $V_i - V_j$, whereas a capacitance lets that difference flex, banking charge as it moves.

## Dielectric capacitance

The textbook capacitor stores charge in an electrostatic field strung across an insulating gap. An insulator is the opposite of a conductor: with its mobile-carrier concentration near zero it can neither conduct nor screen, so a species voltage has no meaning inside it and the region is left to electrostatics alone, with $\phi$ sloping freely across the gap.^[At a metal surface the one level that survives is the vacuum potential just outside, set by the electron's {% wiki "work function" %} $\Phi$: $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$. It is worth drawing only out in the vacuum, stepping down from $V_{\mathrm{e}^-}$ at the surface and never threading it back through the bulk metal, which keeps the work function clearly an interface property rather than a level living inside. More in [Vacuum levels](../vacuum/).] Two metal plates straddling such a gap sit at different $V_{\mathrm{e}^-}$, and the whole offset falls across the dielectric, giving the familiar $C = \varepsilon A/d$.

Nothing in that construction demands metal on both sides; any conductor's rail can serve as a plate. The {% wiki "electrolytic capacitor" %} makes the point: its dielectric is a very thin oxide film grown between a metal and an electrolyte, so one plate reads $V_{\mathrm{e}^-}$ while the other reads the solution's $V_{\mathrm{ion}}$, and the film's thinness makes the capacitance per area large.^[The charging speeds differ accordingly: a dielectric capacitor charges as fast as its wires allow, while an electrolytic one charges only as fast as its ions can reach the film, which shows on the diagram as transient slopes in the electrolyte's $V_i$.]

<figure class="demo-container" style="max-width: 520px">
{% include "esbd-diagrams/esbd-cap-family.njk" %}
{% figcaption %}
A dielectric capacitor two ways, one applied voltage across both (always between two metals, since that is what we actually control): metal–dielectric–metal, where the drop spans the full gap, and electrolytic, where it falls across a thin oxide between $V_{\mathrm{e}^-}$ and $V_{\mathrm{ion}}$. In the wet panel a counter-electrode sliver on the right couples to the ion at a fixed offset and passes the bias along. The vertical scale is schematic; in particular the work-function step down to $\phi$ is compressed (a real $\Phi/e$ is 4–5 V).
{% endfigcaption %}
</figure>

## The double layer

Now drop the insulator altogether and let the metal touch the electrolyte directly. The interface still stores charge. The metal piles its plate charge into a sheet right at the surface ($\lambda \to 0$ on its side), and the electrolyte answers with the diffuse screening tail of the [last topic](../basicelectrostatics/), so the two facing charges sit an effective plate spacing of roughly a Debye length apart. This is the {% wiki "electric double layer" %} read as a capacitor, wired between the metal's $V_{\mathrm{e}^-}$ and the solution's $V_{\mathrm{ion}}$. In a real electrode a molecule-thick compact layer sits in between as well (the {% wiki "Double layer (surface science)", "Stern layer" %}: solvent and adsorbed ions pressed against the surface), acting as one more thin dielectric capacitor in series with the diffuse part.

The measured double-layer capacitance is therefore already an assembly: a series pair, dominated by whichever member is smaller, splitting any applied voltage between the compact drop and the diffuse tail in inverse proportion to the capacitances. It is our first **capacitive divider**. Even the diffuse part is secretly an assembly of its own: zoomed in, it is a continuous chain of dielectric and screening capacitances in series and parallel, and summing the chain gives the tidy result $\varepsilon/\lambda$ per unit area, which is $\sqrt{\varepsilon \chi}$.^[The chain, its closed-form sum, and the compact layer's series "core" partner are all drawn out in J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001), Fig. 4.]

The {% wiki "supercapacitor" %} is this interface pushed to its engineering limit: a concentrated electrolyte squeezes $\lambda$ down to nanometres, a porous electrode multiplies the area, and with an effective plate spacing of only $\lambda$ the capacitance becomes enormous. From the full-gap capacitor through the oxide film to the Debye-length skin, it is one kind of storage sorted by how far neutrality is allowed to break.

<figure class="demo-container" style="max-width: 340px">
{% include "esbd-diagrams/esbd-cap-edl.njk" %}
{% figcaption %}
A bare metal–electrolyte interface under bias: the ladder soaks up the diffuse part of the drop within a Debye-length skin, while the compact (Stern) layer, the thin sliver between metal and solution, takes the rest as one more dielectric step. A counter-electrode sliver on the right passes the bias along, as before. The rung-to-carrier gap is widened for legibility; a truly concentrated electrolyte would put $V^\circ_{\mathrm{ion}}$ right on $V_{\mathrm{ion}}$.
{% endfigcaption %}
</figure>

## Internal chemical capacitance

A carrier can also store charge with no dielectric gap at all, simply by growing more or less concentrated. Because its stored charge density $Q_i = z_i F c_i$ rides the concentration, and that concentration depends *exponentially* on $V_i - V^\circ_i$, this is a thoroughly **nonlinear** capacitor: it is the very exponential response to a shifting ladder that we charted in [charge neutrality and mass action](../charge_neutrality/), now read as charge stored against voltage. Its small-signal value is the slope of that exponential,

$$ c^{\mathrm{chem}}_i = \frac{\mathrm{d}Q_i}{\mathrm{d}V_i} = \frac{z_i^2 F^2 c_i}{RT}, $$

the **internal chemical capacitance**,^[The qualifier *internal* is ours, and needed: the literature says simply "chemical capacitance" for both this per-carrier object and the rail-to-rail (*mutual*) one of the next section, each the default in a different community, so this book always spells out which is meant. The term itself is due to A. D. Pelton, [The chemical capacitance — a thermodynamic solution property.](https://doi.org/10.1051/jcp/1992891931) *J. Chim. Phys.* **89**, 1931 (1992), there a matrix of thermodynamic responses $C_{ij}$ linking one solution species' $\mu_i$ to another's added moles (buffer capacity being the flagship application), in molar units with no farads in sight: the charge-free ancestor of the [matrix appendix](../chemical_capacitance_matrices/) more than of either electrical kind. The per-carrier sense here is that of J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001), whose transport circuits hang one such capacitor from every carrier's $V_i$ rail, and of J. Bisquert, who carried it into photovoltaics: [Chemical capacitance of nanostructured semiconductors](https://doi.org/10.1039/B310907K), *Phys. Chem. Chem. Phys.* **5**, 5360 (2003).] exactly the per-species piece of the screening $\chi$ from the last topic.^[The same derivative defines the {% wiki "quantum capacitance" %} of an electronic conductor; for a degenerate Fermi gas it is set by the density of states rather than by $c/RT$, but the idea is identical, charge banked per unit shift of the carrier's voltage.] Being proportional to concentration, it grows as the material fills and can dwarf any dielectric capacitance.

But treat the internal capacitance as a building block rather than as a device: it is real, yet hard to probe on its own, for one of its terminals is the carrier's rail and the other is the ladder itself, and no wire attaches to a ladder. What a measurement meets are its assemblies. At any one spot, every carrier hangs its internal capacitance on the same ladder node, in *parallel*, and the sum is exactly the screening capacitance $\chi = \sum_i c^{\mathrm{chem}}_i$ that has been doing the work since the last topic, most recently inside the diffuse layer above. The other assembly puts two of them in *series*, and that one deserves its own section.

## Mutual chemical capacitance

We have already met the series assembly; it was the first capacitance this book introduced. In [species voltage](../v_i/) two co-located carriers made a capacitor directly between their rails, and in [lithium-ion batteries](../lib/) each electrode *was* that capacitor. It reads as a different device, the **mutual chemical capacitance** relating $V_i$ to $V_j$ rather than a carrier to its own standard state,^[Only the qualifier is ours, borrowed from capacitance-matrix language, where mutual capacitances couple pairs of conductors: here the pair of rails. The object itself is thoroughly standard: in the mixed-conductor impedance literature, this two-carrier series combination is what "chemical capacitance", unqualified, usually means (J. Jamnik and J. Maier, [Treatment of the impedance of mixed conductors](https://doi.org/10.1149/1.1392611), *J. Electrochem. Soc.* **146**, 4183 (1999); A. E. Bumberger, A. Nenning, and J. Fleig, [Transmission line revisited](https://doi.org/10.1039/d4cp00975d), *Phys. Chem. Chem. Phys.* **26**, 15068 (2024)). (The tempting alternative "ambipolar" would mislead twice over: it conventionally implies opposite-sign carriers, as in ambipolar diffusion, while this coupling exists between any two rails, same-sign pairs included; and "ambipolar capacitance" already means something else in the literature, a capacitance measured at both bias polarities across a voltage sweep.)] but it is assembled from the internal pieces above. Because $V^\circ_i$ tracks $\phi$ with a fixed offset ($\mathrm{d}V^\circ_i = \mathrm{d}\phi$), each carrier's capacitor runs from its rail to a shared node; set two in series, eliminate that shared node, and one capacitor is left straight between the two rails. Two pictures of one storage, not two couplings.

<figure class="demo-container" style="max-width: 600px">
{% include "esbd-diagrams/esbd-cap-reps.njk" %}
{% figcaption %}
The same chemical capacitance, two ways, for electrons and $\mathrm{Li}^+$ in an intercalation host. In the *internal* view each rail hangs a capacitor to its own standard state $V^\circ_i$; in the *mutual* view those two combine in series (the shared $V^\circ$/$\phi$ node drops out) into a single capacitor straight between $V_{\mathrm{e}^-}$ and $V_{\mathrm{Li}^+}$. One is not a second coupling alongside the other; it is the same storage rewritten.
{% endfigcaption %}
</figure>

The devices that lean on chemical capacitance store charge in a material's chemical state rather than in a field, and their terminals always see the mutual kind. Lithiating an intercalation electrode raises its lithium content and slides $V_{\mathrm{Li}^+}$ against the host's $V_{\mathrm{e}^-}$: the storage presented is the series pair, throttled by whichever carrier's $c^{\mathrm{chem}}$ is smaller (in a metallic host, the ion's; in an oxide mixed conductor, often the electrons'). {% wiki "Pseudocapacitance" %} is the interfacial cousin: fast, reversible surface reactions that take up charge smoothly with voltage, behaving like a chemical capacitance pressed into a vanishingly thin surface layer.^[The line between pseudocapacitance and a plain double layer is somewhat fuzzy, and whether it is best read as a chemical capacitance or an unusually large double-layer capacitance is not always clear; on a $V_i$ diagram it would sit as a near-zero-thickness storage layer right at the surface.]

<figure class="demo-container" style="max-width: 620px">
{% include "esbd-diagrams/cap-chem.njk" %}
{% figcaption %}
An intercalation host charging, watched from its terminals. Adding charge raises the lithium content and slides $V_{\mathrm{Li}^+}$, while the metallic host's $V_{\mathrm{e}^-}$ barely moves, its own internal capacitance being huge. The right panel plots the terminal-visible gap $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$ (an open-circuit voltage) against filling: the lattice-gas isotherm $V = V^\circ + \tfrac{RT}{F}\ln\tfrac{x}{1-x}$. Capacitance is charge banked per volt, so the (nonlinear) mutual capacitance is the *inverse* slope, largest where the curve runs flattest; $V^\circ$ sits at half-filling, the natural lattice-gas reference. That the measured curve is essentially the ion's own isotherm is the metallic-host limit: the electron's giant $c^{\mathrm{chem}}$ hides in the series pair.
{% endfigcaption %}
</figure>

Step back and there is a pattern. Every capacitance a terminal can actually measure is of this mutual, rail-to-rail kind, a $V_i$ here held against a $V_j$ there. The plain dielectric capacitor is $V_{\mathrm{e}^-}$-to-$V_{\mathrm{e}^-}$ across a gap; the double layer is $V_{\mathrm{e}^-}$-to-$V_{\mathrm{ion}}$ across an interface; the intercalation electrode is $V_{\mathrm{Li}^+}$-to-$V_{\mathrm{e}^-}$ within one volume. The dielectric capacitors and internal chemical capacitances are the messenger pieces in between, coupling rails to the hidden $\phi$ nodes; once the assembly is complete, the $\phi$ nodes drop out of sight, and what remains is charge banked between species voltages. (With three or more carriers the bookkeeping becomes a matrix; the [chemical capacitance matrices appendix](../chemical_capacitance_matrices/) does it properly.)

## The capacitive divider

One pattern from the double layer deserves its general statement: whenever several capacitances share a node, the node settles wherever the *ratio* of the capacitances dictates, and any driven voltage splits between them accordingly. Two layouts of this **capacitive divider** carry the topics ahead.

The first lives at a single spot of material. Every carrier there hangs its internal capacitance on the same node ($V^\circ$, equivalently $\phi$), so when the rails shift, the ladder settles at their capacitance-weighted average,

$$ \mathrm{d}V^\circ = \frac{\sum_i c^{\mathrm{chem}}_i \, \mathrm{d}V_i}{\sum_i c^{\mathrm{chem}}_i}, $$

and whichever carriers hold the most capacitance drag the ladder along with them. This is why an abundant *mobile* carrier pins $V^\circ_i$ and screens so stiffly back [in electrostatics](../basicelectrostatics/), and it is what will pin $V^\circ_i$ in [saturation](../saturation/), where a plentiful spectator clamps the standard state and forces the active carrier to deplete.

The second reaches across an interface, and it is the one we met at the double layer: a dielectric capacitance in series with a medium's screening response, coupling a rail *here* to a ladder *there*. Its electronic twin is the field-effect transistor's gate: the gate oxide's dielectric capacitance in series with the channel's internal (quantum) capacitance, so the gate metal's $V_{\mathrm{e}^-}$ moves the channel's band edge only through the divider ratio. That soft, tunable pinning is precisely the coupling that [saturation](../saturation/) will lean on.

## Takeaways

Capacitance in the $V_i$ picture is built from two kinds of primitive piece: dielectric capacitors, which couple through the electrostatic $\phi$, and each carrier's internal chemical capacitance, $z_i^2 F^2 c_i/RT$, its concentration crowding against its own rung. Neither is ever measured alone. In parallel the internal pieces sum to the screening capacitance $\chi$; chained with $\varepsilon$ they make the double layer's $\sqrt{\varepsilon\chi}$; in series across the hidden ladder node they make the mutual chemical capacitance that a battery electrode presents at its terminals. Indeed, every capacitance a terminal can measure is mutual, some $V_i$ held against some $V_j$, with even the parallel-plate capacitor of the circuits classroom reading $V_{\mathrm{e}^-}$-to-$V_{\mathrm{e}^-}$. And wherever several of these pieces share a node they form a capacitive divider that decides where the ladder sits: the quiet mechanism behind stiff screening now, and [saturation](../saturation/) later. With the storage response in hand, we turn to its flow-side twin: transport.

[**NEXT TOPIC: Basic transport**](../basictransport/)
