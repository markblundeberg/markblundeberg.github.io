---
layout: layouts/esbd_topic.njk
title: 'Capacitance'
tags: [page, esbd_topic]
orderESBD: 26
---

# {{title}}

In the [last topic](../basicelectrostatics/) the screening length arrived with a companion quantity, $\chi$, the "total chemical capacitance," measuring how much charge a conductor banks when its potential is nudged. That was our first taste of capacitance, the storage-side response of a conductor: charge held in proportion to a voltage *difference*, as against conductance, the flow-side response (current in proportion to a voltage *gradient*) we take up [next](../transport_basic/). It is also the elastic counterpart to a reaction: a [reaction](../equilibrium/) couples two species' voltages *rigidly*, fixing the difference $V_i - V_j$, whereas a capacitance lets that difference flex, banking charge as it moves. What makes capacitance richer in the $V_i$ picture than in an ordinary circuit is that "two voltages held apart" can mean two quite different things: two electronic plates across a gap, or a carrier crowding against a reference level. The first is the familiar dielectric capacitance; the second is chemical capacitance, and here it matters just as much.

## Dielectric capacitance

The textbook capacitor stores charge in an electrostatic field strung across an insulating gap. An insulator is the opposite of a conductor: with its mobile-carrier concentration near zero it can neither conduct nor screen, so a species voltage has no meaning inside it and the region is left to electrostatics alone, with $\phi$ sloping freely across the gap.^[At a metal surface the one level that survives is the vacuum potential just outside, set by the electron's {% wiki "work function" %} $\Phi$: $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$. It is worth drawing only out in the vacuum, stepping down from $V_{\mathrm{e}^-}$ at the surface and never threading it back through the bulk metal, which keeps the work function clearly an interface property rather than a level living inside. More in [Vacuum levels](../vacuum/).] Two metal plates straddling such a gap sit at different $V_{\mathrm{e}^-}$, and the whole offset falls across the dielectric, giving the familiar $C = \varepsilon A/d$.

How far the charge spreads is set, once again, by the screening length. In a plain metal-dielectric-metal capacitor the insulator cannot screen at all ($\lambda \to \infty$) and the charge bridges the entire gap. In an aluminium {% wiki "electrolytic capacitor" %} the gap is a very thin oxide film between a metal and an electrolyte, so the capacitance per area is much larger. And in a {% wiki "supercapacitor" %} the dielectric is dropped altogether: a metal meets a concentrated electrolyte whose screening length is mere nanometres, so the whole potential drop is squeezed into a {% wiki "Double layer (surface science)", "double layer" %} that thin, and with an effective plate separation of only $\lambda$ the capacitance becomes enormous. It is one kind of storage drawn three ways, sorted by how far neutrality is allowed to break.^[The charging speeds differ accordingly: a dielectric capacitor charges as fast as its wires allow, while a double-layer or electrolytic one charges only as fast as its ions can reach the interface, which shows on the diagram as transient slopes in the electrolyte's $V_i$.]

<figure class="demo-container" style="max-width: 760px">
{% include "esbd-diagrams/esbd-cap-family.njk" %}
{% figcaption %}
Dielectric capacitance, sorted by screening length, one applied voltage across all three — always between two metals, since that is what we actually control: a metal–dielectric–metal capacitor (the drop spans the full gap), an electrolytic capacitor (the drop across a thin oxide between $V_{\mathrm{e}^-}$ and $V_{\mathrm{ion}}$), and an EDL supercapacitor (no insulator at all — the ladder soaks up the whole drop within a Debye-length skin). In the wet panels a counter-electrode sliver on the right couples to the ion at a fixed offset and passes the bias along. The effective plate spacing shrinks left to right, and the capacitance grows accordingly. The vertical scale is schematic; in particular the work-function step down to $\phi$ is compressed (a real $\Phi/e$ is 4–5 V), and the supercapacitor's rung-to-carrier gap is widened — a truly concentrated electrolyte would put $V^\circ_{\mathrm{ion}}$ right on $V_{\mathrm{ion}}$.
{% endfigcaption %}
</figure>

## Chemical capacitance

A carrier can also store charge with no dielectric gap at all, simply by growing more or less concentrated. Because its stored charge density $Q_i = z_i F c_i$ rides the concentration, and that concentration depends *exponentially* on $V_i - V^\circ_i$, this is a thoroughly **nonlinear** capacitor: it is the very exponential response to a shifting ladder that we charted in [mass action and charge control](../charge_control/), now read as charge stored against voltage. Its small-signal value is the slope of that exponential,

$$ c^{\mathrm{chem}}_i = \frac{\mathrm{d}Q_i}{\mathrm{d}V_i} = \frac{z_i^2 F^2 c_i}{RT}, $$

the **chemical capacitance**,^[The term is due to A. D. Pelton, [The chemical capacitance — a thermodynamic solution property.](https://doi.org/10.1051/jcp/1992891931) *J. Chim. Phys.* **89**, 1931 (1992); its central place in solid-state ionics is due to J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001), whose transport circuits hang one such capacitor from every carrier's $V_i$ rail.] exactly the per-species piece of the screening $\chi$ from the last topic.^[The same derivative defines the {% wiki "quantum capacitance" %} of an electronic conductor; for a degenerate Fermi gas it is set by the density of states rather than by $c/RT$, but the idea is identical, charge banked per unit shift of the carrier's voltage.] Being proportional to concentration, it grows as the material fills and can dwarf any dielectric capacitance.

The devices that lean on it store charge in a material's chemical state rather than in a field. Chemical capacitance proper stores charge through the bulk, as when lithiating an intercalation electrode raises its lithium content and shifts the species voltages, so the material soaks up charge as $V_i$ moves. {% wiki "Pseudocapacitance" %} is the interfacial cousin: fast, reversible surface reactions that take up charge smoothly with voltage, behaving like a chemical capacitance pressed into a vanishingly thin surface layer.^[The line between pseudocapacitance and a plain double layer is somewhat fuzzy, and whether it is best read as a chemical or an inter-carrier capacitance is not always clear; on a $V_i$ diagram it would sit as a near-zero-thickness storage layer right at the surface.]

<figure class="demo-container" style="max-width: 620px">
{% include "esbd-diagrams/cap-chem.njk" %}
{% figcaption %}
Chemical capacitance in an intercalation host: adding charge raises the lithium content and slides $V_{\mathrm{Li}^+}$ away from its standard state, with no electrostatic gap involved. The right panel is the same statement read as a charge–voltage relation — the lattice-gas isotherm $V = V^\circ + \tfrac{RT}{F}\ln\tfrac{x}{1-x}$, plotted as $V$ against filling (hence charge), so the (nonlinear) chemical capacitance — charge banked per volt — is the *inverse* slope, largest where the curve runs flattest; here $V^\circ$ sits at half-filling, the natural lattice-gas reference.
{% endfigcaption %}
</figure>

## Ambipolar chemical capacitance

We have already met the other face of this same capacitance. In [species voltage](../v_i/) two co-located carriers made a capacitor directly between their rails, and in [lithium-ion batteries](../lib/) each electrode *was* that capacitor. It reads as a different device, the **ambipolar chemical capacitance** relating $V_i$ to $V_j$ rather than a carrier to its own standard state,^[Our term, and not yet standard: beware that "ambipolar capacitance" already means something else in the literature, a capacitance measured at both bias polarities across a voltage sweep. We mean here the chemical-capacitance coupling between two carriers. In the mixed-conductor impedance literature this two-carrier series combination is itself called *the* chemical capacitance: J. Jamnik and J. Maier, [Treatment of the impedance of mixed conductors](https://doi.org/10.1149/1.1392611), *J. Electrochem. Soc.* **146**, 4183 (1999).] but it is the chemical capacitance above, rewritten. Because $V^\circ_i$ tracks $\phi$ with a fixed offset ($\mathrm{d}V^\circ_i = \mathrm{d}\phi$), each carrier's capacitor runs from its rail to a shared reference; set two in series, eliminate that shared node, and one capacitor is left straight between the two rails. Two pictures of one storage, not two couplings.

<figure class="demo-container" style="max-width: 600px">
{% include "esbd-diagrams/esbd-cap-reps.njk" %}
{% figcaption %}
The same chemical capacitance, two ways, for electrons and $\mathrm{Li}^+$ in an intercalation host. In the *per-carrier* view each rail hangs a capacitor to its own standard state $V^\circ_i$; in the *ambipolar* view those two combine in series (the shared $V^\circ$/$\phi$ node drops out) into a single capacitor straight between $V_{\mathrm{e}^-}$ and $V_{\mathrm{Li}^+}$. One is not a second coupling alongside the other; it is the same storage rewritten.
{% endfigcaption %}
</figure>

The full multi-carrier version, and the matrix that packages it, are in the [chemical capacitance matrices appendix](../chemical_capacitance_matrices/).

## The capacitive divider

These capacitances seldom act alone. When one carrier's $V_i$ is driven while its neighbours are held, the standard state $V^\circ_i$ follows neither cleanly but settles at a point fixed by the *ratio* of the capacitances on each side: a capacitive divider. This is the quiet machinery behind two effects we lean on elsewhere. It is why an abundant *mobile* carrier pins $V^\circ_i$ and screens so stiffly back [in electrostatics](../basicelectrostatics/), and it is what will pin $V^\circ_i$ in [saturation](../saturation/), where a plentiful spectator clamps the standard state and forces the active carrier to deplete.

## Takeaways

Capacitance is the storage twin of conductance, and the $V_i$ picture shows it wearing three forms: a dielectric field across a gap, a single carrier crowding against its own standard state, and charge traded between two carriers. The dielectric kind sorts its devices by screening length, from the full-gap capacitor to the nanometre double layer of a supercapacitor; the chemical kind, $z_i^2 F^2 c_i/RT$, grows with concentration and underlies intercalation and pseudocapacitance; and acting together as a capacitive divider, they set where the standard state sits whenever charge is stored or screened. With the storage response in hand, we turn to its flow-side twin: transport.

[**NEXT TOPIC: Basic transport**](../transport_basic/)
