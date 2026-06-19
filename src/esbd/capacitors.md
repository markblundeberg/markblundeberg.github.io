---
layout: layouts/esbd_topic.njk
title: 'Capacitance'
tags: [page, esbd_topic]
orderESBD: 26
---

# {{title}}

In the [last topic](../basicelectrostatics/) the screening length arrived with a companion quantity, $\chi$, the "total chemical capacitance," measuring how much charge a conductor banks when its potential is nudged. That was our first taste of capacitance, the storage-side response of a conductor: charge held in proportion to a voltage *difference*, as against conductance, the flow-side response (current in proportion to a voltage *gradient*) we take up [next](../transport_basic/). What makes capacitance richer in the $V_i$ picture than in an ordinary circuit is that "two voltages held apart" can mean three quite different things: two electronic plates across a gap, a single carrier held away from its own standard state, or two different carriers sharing one place. The first is the familiar dielectric capacitance; the other two are flavours of chemical capacitance, and here they matter just as much.

## Dielectric capacitance

The textbook capacitor stores charge in an electrostatic field strung across an insulating gap. An insulator is the opposite of a conductor: with its mobile-carrier concentration near zero it can neither conduct nor screen, so a species voltage has no meaning inside it and the region is left to electrostatics alone, with $\phi$ sloping freely across the gap.^[At a metal surface the one level that survives is the vacuum potential just outside, set by the electron's {% wiki "work function" %} $\Phi$: $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$. It is worth drawing only out in the vacuum, stepping down from $V_{\mathrm{e}^-}$ at the surface and never threading it back through the bulk metal, which keeps the work function clearly an interface property rather than a level living inside.] Two metal plates straddling such a gap sit at different $V_{\mathrm{e}^-}$, and the whole offset falls across the dielectric, giving the familiar $C = \varepsilon A/d$.

How far the charge spreads is set, once again, by the screening length. In a plain metal-dielectric-metal capacitor the insulator cannot screen at all ($\lambda \to \infty$) and the charge bridges the entire gap. In an aluminium {% wiki "electrolytic capacitor" %} the gap is a very thin oxide film between a metal and an electrolyte, so the capacitance per area is much larger. And in a {% wiki "supercapacitor" %} the dielectric is dropped altogether: a metal meets a concentrated electrolyte whose screening length is mere nanometres, so the whole potential drop is squeezed into a {% wiki "Double layer (surface science)", "double layer" %} that thin, and with an effective plate separation of only $\lambda$ the capacitance becomes enormous. It is one kind of storage drawn three ways, sorted by how far neutrality is allowed to break.^[The charging speeds differ accordingly: a dielectric capacitor charges as fast as its wires allow, while a double-layer or electrolytic one charges only as fast as its ions can reach the interface, which shows on the diagram as transient slopes in the electrolyte's $V_i$.]

<figure class="diagram-placeholder">
{% figcaption %}
Dielectric capacitance, sorted by screening length: a metal-dielectric-metal capacitor (charge across the full gap), an electrolytic capacitor (charge across a thin oxide between $V_{\mathrm{e}^-}$ and $V_{\mathrm{ion}}$), and an EDL supercapacitor (the drop confined to a Debye-length skin).
{% endfigcaption %}
</figure>

## Chemical capacitance

A carrier can also store charge with no dielectric gap at all, simply by growing more or less concentrated. Because its stored charge $Q_i = z_i F c_i$ rides the concentration, and that concentration depends *exponentially* on $V_i - V^\circ_i$, this is a thoroughly **nonlinear** capacitor: it is the very exponential response to a shifting ladder that we charted in [mass action and charge control](../charge_control/), now read as charge stored against voltage. Its small-signal value is the slope of that exponential,

$$ c^{\mathrm{chem}}_i = \frac{\mathrm{d}Q_i}{\mathrm{d}V_i} = \frac{z_i^2 F^2 c_i}{RT}, $$

the **chemical capacitance**, exactly the per-species piece of the screening $\chi$ from the last topic.^[The same derivative defines the {% wiki "quantum capacitance" %} of an electronic conductor; for a degenerate Fermi gas it is set by the density of states rather than by $c/RT$, but the idea is identical, charge banked per unit shift of the carrier's voltage.] Being proportional to concentration, it grows as the material fills and can dwarf any dielectric capacitance.

The devices that lean on it store charge in a material's chemical state rather than in a field. Chemical capacitance proper stores charge through the bulk, as when lithiating an intercalation electrode raises its lithium content and shifts the species voltages, so the material soaks up charge as $V_i$ moves. {% wiki "Pseudocapacitance" %} is the interfacial cousin: fast, reversible surface reactions that take up charge smoothly with voltage, behaving like a chemical capacitance pressed into a vanishingly thin surface layer.^[The line between pseudocapacitance and a plain double layer is somewhat fuzzy, and whether it is best read as a chemical or an inter-carrier capacitance is not always clear; on a $V_i$ diagram it would sit as a near-zero-thickness storage layer right at the surface.]

<figure class="diagram-placeholder">
{% figcaption %}
Chemical capacitance in an intercalation host: adding charge raises the carrier concentration and slides $V_i$ away from its standard state, with no electrostatic gap involved.
{% endfigcaption %}
</figure>

## Ambipolar chemical capacitance

The third coupling is between two carriers sharing one place. When two species coexist, charge can shift from one to the other while the total stays neutral, an **ambipolar chemical capacitance** relating $V_i$ to $V_j$ rather than either to its standard state.^[Our term, and not yet standard: beware that "ambipolar capacitance" already means something else in the literature, a capacitance measured at both bias polarities across a voltage sweep. We mean here the chemical-capacitance coupling between two carriers.] It is the storage seen, for instance, between electrons and lithium ions inside an intercalation host. The full multi-carrier version is a capacitance matrix, which we take up in the [capacitance appendix](../capacitance/).

## The capacitive divider

These capacitances seldom act alone. When one carrier's $V_i$ is driven while its neighbours are held, the standard state $V^\circ_i$ follows neither cleanly but settles at a point fixed by the *ratio* of the capacitances on each side: a capacitive divider. This is the quiet machinery behind two effects we lean on elsewhere. It is why an abundant background charge pins $V^\circ_i$ and screens so stiffly back [in electrostatics](../basicelectrostatics/), and it is what will pin $V^\circ_i$ in [saturation](../saturation/), where a plentiful spectator clamps the standard state and forces the active carrier to deplete.

## Takeaways

Capacitance is the storage twin of conductance, and the $V_i$ picture shows it wearing three forms: a dielectric field across a gap, a single carrier crowding against its own standard state, and charge traded between two carriers. The dielectric kind sorts its devices by screening length, from the full-gap capacitor to the nanometre double layer of a supercapacitor; the chemical kind, $z_i^2 F^2 c_i/RT$, grows with concentration and underlies intercalation and pseudocapacitance; and acting together as a capacitive divider, they set where the standard state sits whenever charge is stored or screened. With both responses now in hand, storage and flow, we turn to transport.

[**NEXT TOPIC: Basic transport**](../transport_basic/)
