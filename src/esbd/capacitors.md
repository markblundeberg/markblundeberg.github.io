---
layout: layouts/esbd_topic.njk
title: 'Capacitance'
tags: [page, esbd_topic]
orderESBD: 26
---

# {{title}}

In the [last topic](../basicelectrostatics/) the screening length arrived with a companion quantity, $\chi$, the "screening capacitance," measuring how much charge a conductor banks when its potential is nudged. That was another face of capacitance, the storage-side response of a conductor: charge held in proportion to a voltage *difference*, as against conductance, the flow-side response (current in proportion to a voltage *gradient*) we take up [next](../basictransport/). It is also the elastic counterpart to a reaction: a [reaction](../equilibrium/) couples two species' voltages *rigidly*, fixing the difference $V_i - V_j$, whereas a capacitance lets that difference flex, banking charge as it moves.

What makes capacitance richer in the $V_i$ picture than in an ordinary circuit is that "two voltages held apart" can mean two quite different things: two electronic plates across a gap, or a carrier crowding against a reference level. The first is the familiar dielectric capacitance; the second is chemical capacitance, and here it matters just as much.

## Dielectric capacitance

The textbook capacitor stores charge in an electrostatic field strung across an insulating gap. An insulator is the opposite of a conductor: with its mobile-carrier concentration near zero it can neither conduct nor screen, so a species voltage has no meaning inside it and the region is left to electrostatics alone, with $\phi$ sloping freely across the gap.^[At a metal surface the one level that survives is the vacuum potential just outside, set by the electron's {% wiki "work function" %} $\Phi$: $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$. It is worth drawing only out in the vacuum, stepping down from $V_{\mathrm{e}^-}$ at the surface and never threading it back through the bulk metal, which keeps the work function clearly an interface property rather than a level living inside. More in [Vacuum levels](../vacuum/).] Two metal plates straddling such a gap sit at different $V_{\mathrm{e}^-}$, and the whole offset falls across the dielectric, giving the familiar $C = \varepsilon A/d$.

How far the charge spreads is set, once again, by the screening length. In a plain metal-dielectric-metal capacitor the insulator cannot screen at all ($\lambda \to \infty$) and the charge bridges the entire gap. In an aluminium {% wiki "electrolytic capacitor" %} the gap is a very thin oxide film between a metal and an electrolyte, so the capacitance per area is much larger. And in a {% wiki "supercapacitor" %} the dielectric is dropped altogether: a metal meets a concentrated electrolyte whose screening length is mere nanometres, so the whole potential drop is squeezed into a {% wiki "Double layer (surface science)", "double layer" %} that thin, and with an effective plate separation of only $\lambda$ the capacitance becomes enormous. It is one kind of storage drawn three ways, sorted by how far neutrality is allowed to break.^[The charging speeds differ accordingly: a dielectric capacitor charges as fast as its wires allow, while a double-layer or electrolytic one charges only as fast as its ions can reach the interface, which shows on the diagram as transient slopes in the electrolyte's $V_i$.]

<figure class="demo-container" style="max-width: 760px">
{% include "esbd-diagrams/esbd-cap-family.njk" %}
{% figcaption %}
Dielectric capacitance, sorted by screening length, one applied voltage across all three (always between two metals, since that is what we actually control): a metal–dielectric–metal capacitor (the drop spans the full gap), an electrolytic capacitor (the drop across a thin oxide between $V_{\mathrm{e}^-}$ and $V_{\mathrm{ion}}$), and an EDL supercapacitor (no insulator at all: the ladder soaks up the whole drop within a Debye-length skin). In the wet panels a counter-electrode sliver on the right couples to the ion at a fixed offset and passes the bias along. The effective plate spacing shrinks left to right, and the capacitance grows accordingly. The vertical scale is schematic; in particular the work-function step down to $\phi$ is compressed (a real $\Phi/e$ is 4–5 V), and the supercapacitor's rung-to-carrier gap is widened, where a truly concentrated electrolyte would put $V^\circ_{\mathrm{ion}}$ right on $V_{\mathrm{ion}}$.
{% endfigcaption %}
</figure>

## Internal chemical capacitance

A carrier can also store charge with no dielectric gap at all, simply by growing more or less concentrated. Because its stored charge density $Q_i = z_i F c_i$ rides the concentration, and that concentration depends *exponentially* on $V_i - V^\circ_i$, this is a thoroughly **nonlinear** capacitor: it is the very exponential response to a shifting ladder that we charted in [charge neutrality and mass action](../charge_neutrality/), now read as charge stored against voltage. Its small-signal value is the slope of that exponential,

$$ c^{\mathrm{chem}}_i = \frac{\mathrm{d}Q_i}{\mathrm{d}V_i} = \frac{z_i^2 F^2 c_i}{RT}, $$

the **internal chemical capacitance**,^[The qualifier *internal* is ours, and needed: the literature says simply "chemical capacitance" for both this per-carrier object and the rail-to-rail (*mutual*) one of the next section, each the default in a different community, so this book always spells out which is meant. The term itself is due to A. D. Pelton, [The chemical capacitance — a thermodynamic solution property.](https://doi.org/10.1051/jcp/1992891931) *J. Chim. Phys.* **89**, 1931 (1992), there a matrix of thermodynamic responses $C_{ij}$ linking one solution species' $\mu_i$ to another's added moles (buffer capacity being the flagship application), in molar units with no farads in sight: the charge-free ancestor of the [matrix appendix](../chemical_capacitance_matrices/) more than of either electrical kind. The per-carrier sense here is that of J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001), whose transport circuits hang one such capacitor from every carrier's $V_i$ rail, and of J. Bisquert, who carried it into photovoltaics: [Chemical capacitance of nanostructured semiconductors](https://doi.org/10.1039/B310907K), *Phys. Chem. Chem. Phys.* **5**, 5360 (2003).] exactly the per-species piece of the screening $\chi$ from the last topic.^[The same derivative defines the {% wiki "quantum capacitance" %} of an electronic conductor; for a degenerate Fermi gas it is set by the density of states rather than by $c/RT$, but the idea is identical, charge banked per unit shift of the carrier's voltage.] Being proportional to concentration, it grows as the material fills and can dwarf any dielectric capacitance.

The devices that lean on it store charge in a material's chemical state rather than in a field. Chemical capacitance proper stores charge through the bulk, as when lithiating an intercalation electrode raises its lithium content and shifts the species voltages, so the material soaks up charge as $V_i$ moves. {% wiki "Pseudocapacitance" %} is the interfacial cousin: fast, reversible surface reactions that take up charge smoothly with voltage, behaving like a chemical capacitance pressed into a vanishingly thin surface layer.^[The line between pseudocapacitance and a plain double layer is somewhat fuzzy, and whether it is best read as a chemical capacitance or an unusually large double-layer capacitance is not always clear; on a $V_i$ diagram it would sit as a near-zero-thickness storage layer right at the surface.]

<figure class="demo-container" style="max-width: 620px">
{% include "esbd-diagrams/cap-chem.njk" %}
{% figcaption %}
Internal chemical capacitance in an intercalation host: adding charge raises the lithium content and slides $V_{\mathrm{Li}^+}$ away from its standard state, with no electrostatic gap involved. The right panel reads the same statement as a charge–voltage relation: the lattice-gas isotherm $V = V^\circ + \tfrac{RT}{F}\ln\tfrac{x}{1-x}$, plotted as $V$ against filling (hence charge). Capacitance is charge banked per volt, so the (nonlinear) capacitance here is the *inverse* slope, largest where the curve runs flattest; $V^\circ$ sits at half-filling, the natural lattice-gas reference.
{% endfigcaption %}
</figure>

## Mutual chemical capacitance

We have already met the other face of this same capacitance. In [species voltage](../v_i/) two co-located carriers made a capacitor directly between their rails, and in [lithium-ion batteries](../lib/) each electrode *was* that capacitor. It reads as a different device, the **mutual chemical capacitance** relating $V_i$ to $V_j$ rather than a carrier to its own standard state,^[Only the qualifier is ours, borrowed from capacitance-matrix language, where mutual capacitances couple pairs of conductors: here the pair of rails. The object itself is thoroughly standard: in the mixed-conductor impedance literature, this two-carrier series combination is what "chemical capacitance", unqualified, usually means (J. Jamnik and J. Maier, [Treatment of the impedance of mixed conductors](https://doi.org/10.1149/1.1392611), *J. Electrochem. Soc.* **146**, 4183 (1999); A. E. Bumberger, A. Nenning, and J. Fleig, [Transmission line revisited](https://doi.org/10.1039/d4cp00975d), *Phys. Chem. Chem. Phys.* **26**, 15068 (2024)). (The tempting alternative "ambipolar" would mislead twice over: it conventionally implies opposite-sign carriers, as in ambipolar diffusion, while this coupling exists between any two rails, same-sign pairs included; and "ambipolar capacitance" already means something else in the literature, a capacitance measured at both bias polarities across a voltage sweep.)] but it is the internal chemical capacitance above, rewritten. Because $V^\circ_i$ tracks $\phi$ with a fixed offset ($\mathrm{d}V^\circ_i = \mathrm{d}\phi$), each carrier's capacitor runs from its rail to a shared reference; set two in series, eliminate that shared node, and one capacitor is left straight between the two rails. Two pictures of one storage, not two couplings. The intercalation host above is the flagship of both faces at once: the storage it presents at its terminals is exactly this series pair, throttled by whichever carrier's $c^{\mathrm{chem}}$ is smaller (in a metallic host, the ion's; in an oxide mixed conductor, often the electrons').

<figure class="demo-container" style="max-width: 600px">
{% include "esbd-diagrams/esbd-cap-reps.njk" %}
{% figcaption %}
The same chemical capacitance, two ways, for electrons and $\mathrm{Li}^+$ in an intercalation host. In the *internal* view each rail hangs a capacitor to its own standard state $V^\circ_i$; in the *mutual* view those two combine in series (the shared $V^\circ$/$\phi$ node drops out) into a single capacitor straight between $V_{\mathrm{e}^-}$ and $V_{\mathrm{Li}^+}$. One is not a second coupling alongside the other; it is the same storage rewritten.
{% endfigcaption %}
</figure>

The full multi-carrier version, and the matrix that packages it, are in the [chemical capacitance matrices appendix](../chemical_capacitance_matrices/).

## The capacitive divider

These capacitances seldom act alone. The usual arrangement is several of them sharing one node, which then settles wherever the *ratio* of the capacitances dictates: a **capacitive divider**. Two layouts of this divider do heavy lifting in the topics ahead.

The first divider lives at a single spot of material. Every carrier there hangs its internal capacitance on the same node ($V^\circ$, equivalently $\phi$), so when the rails shift, the ladder settles at their capacitance-weighted average,

$$ \mathrm{d}V^\circ = \frac{\sum_i c^{\mathrm{chem}}_i \, \mathrm{d}V_i}{\sum_i c^{\mathrm{chem}}_i}, $$

and whichever carriers hold the most capacitance drag the ladder along with them. This is why an abundant *mobile* carrier pins $V^\circ_i$ and screens so stiffly back [in electrostatics](../basicelectrostatics/), and it is what will pin $V^\circ_i$ in [saturation](../saturation/), where a plentiful spectator clamps the standard state and forces the active carrier to deplete.

The second divider reaches across an interface, coupling a rail *here* to a ladder *there*. A thin insulating region (adsorbed solvent at an electrode, a transistor's gate oxide) forms a dielectric capacitance that lands in series with the far medium's internal capacitances. At an electrode this series pair is the textbook anatomy of the double layer: the compact ({% wiki "Double layer (surface science)", "Stern" %}) layer's dielectric capacitance in series with the diffuse layer's Debye-thick screening capacitance, the smaller of the two dominating what is measured.^[This series construction appears in Jamnik and Maier's generalised circuits as the interfacial capacitance: a "core" capacitor composed in series with the adjacent diffuse-layer chemical capacitances (Jamnik & Maier 2001, cited above, §4.1.3).] Its electronic twin is the field-effect transistor's gate, whose oxide capacitance couples the gate metal's $V_{\mathrm{e}^-}$ to the channel's band edge in series with the channel's own internal (quantum) capacitance, so the gate moves the channel's ladder only through the divider ratio. That soft, tunable pinning is precisely the coupling that [saturation](../saturation/) will lean on.

## Takeaways

Capacitance is the storage twin of conductance, and the $V_i$ picture shows it wearing three forms: a dielectric field across a gap, a single carrier crowding against its own standard state (internal), and charge traded between two carriers (mutual). The dielectric kind sorts its devices by screening length, from the full-gap capacitor to the nanometre double layer of a supercapacitor; the chemical kind, $z_i^2 F^2 c_i/RT$, grows with concentration and underlies intercalation and pseudocapacitance; and wired into dividers, within a material or across its interfaces, they set where the standard state sits whenever charge is stored or screened. With the storage response in hand, we turn to its flow-side twin: transport.

[**NEXT TOPIC: Basic transport**](../basictransport/)
