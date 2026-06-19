---
layout: layouts/esbd_topic.njk
title: 'Insulators and capacitors'
tags: [page, esbd_topic]
orderESBD: 28
---

# {{title}}

A capacitor stores charge by holding two reservoirs at different voltages and letting a little charge pile up across the gap between them. What changes from one kind to the next is *where* that charge sits and what holds it apart, and the quantity that organizes the whole family is the screening length $\lambda$ we met in the [electrostatics topic](../basicelectrostatics/). At one extreme an insulator cannot screen at all and the charge spreads across the entire gap, while at the other a concentrated electrolyte screens within nanometres and the charge crowds into a thin skin at the surface. A third kind sets the electrostatic gap aside altogether and stores charge by changing a material's chemical state. In each case the $V_i$ picture shows exactly where the charge is being kept.

## Insulators and vacuum: the zero-carrier limit

An insulator, or vacuum, is the mirror image of a metal: its mobile-carrier concentration falls to zero, so it can neither conduct ($\sigma_i = 0$) nor screen, which sends the screening length off to infinity. With no carriers to anchor one, a species voltage $V_i$ has no meaning inside the bulk, and the region is governed purely by electrostatics, with $\phi$ obeying Laplace's equation and fields passing straight through.

The one place a level does reappear is at the surface, where a metal meets the vacuum and an electron must climb its {% wiki "work function" %} $\Phi$ to escape. That climb fixes the vacuum potential just outside the metal at

$$ \phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e. $$

It pays to draw $\phi_{\mathrm{vac}}$ only out in the vacuum, stepping down from $V_{\mathrm{e}^-}$ by the work function right at the surface and never carrying it back through the bulk metal. Confining it to the vacuum side makes clear that the work function is a property of the interface rather than a level living inside the metal, and it avoids the old habit of threading one continuous "vacuum level" through every phase as though it meant the same thing in each.

<figure class="diagram-placeholder">
{% figcaption %}
Metal | insulator | metal. Inside each metal $V_{\mathrm{e}^-}$ runs flat; across the insulating gap the electrostatic potential $\phi$ slopes linearly, meeting each metal at its work-function step.
{% endfigcaption %}
</figure>

## The dielectric capacitor

The textbook capacitor is two metal plates separated by a dielectric, metal | insulator | metal. Here $V_{\mathrm{e}^-}$ is flat inside each plate but offset between them by the applied voltage, and that entire offset falls across the dielectric, where $\phi$ ramps linearly from one plate to the other. Since the gap cannot screen, the stored charge is whatever it takes to bridge the full plate separation $d$, which gives the familiar $C = \varepsilon A/d$. The device charges through the displacement current $\partial \mathbf{D}/\partial t$ flowing across the dielectric, matched by ordinary electronic current in the wires.

## The electrolytic capacitor

Once one side's pathway is carried by ions, the picture gains a step. An aluminium {% wiki "electrolytic capacitor" %} stacks an anode metal, a very thin oxide insulator, a liquid electrolyte, and a cathode metal. The charge is now stored across the thin oxide, between $V_{\mathrm{e}^-}$ in the anode metal on one side and the ionic voltages of the electrolyte on the other, and the electrolyte then ferries that charge onward as ionic current before handing it back to electronic current at the cathode. Because the oxide film is so thin, the capacitance per unit area is large, which is what lets these devices pack so much into a small volume.

<figure class="diagram-placeholder">
{% figcaption %}
An electrolytic capacitor. The potential steps across the thin oxide, separating $V_{\mathrm{e}^-}$ in the anode metal from the ionic $V_{\mathrm{ion}}$ in the electrolyte; the counter electrode (not to scale) couples the ions back to electrons.
{% endfigcaption %}
</figure>

## The double-layer supercapacitor

If the dielectric is removed entirely and a metal is brought into direct contact with a concentrated electrolyte, the screening length itself takes over the insulator's role. Because $\lambda$ in a concentrated electrolyte is only nanometres, neutrality breaks down solely within that nanometre-thin skin at the metal surface, the {% wiki "Double layer (surface science)", "double layer" %}, and the whole potential drop is compressed into it while the bulk solution stays flat and neutral. The effective plate separation is no longer a manufactured gap but the Debye length, so the capacitance per unit area runs around $C \sim \varepsilon/\lambda$, and because $\lambda$ is so small that figure is enormous, which is exactly what earns a {% wiki "supercapacitor" %} its name.

<figure class="diagram-placeholder">
{% figcaption %}
An electric double-layer capacitor. The metal-electrolyte potential drop $\Delta\phi$ is confined to a Debye-length skin at the surface, while the bulk electrolyte stays neutral with flat species voltages.
{% endfigcaption %}
</figure>

## Capacitance without a dielectric

The cases so far all store charge in an electrostatic field across a gap, yet charge can also be stored with no dielectric field at all, simply by changing a material's chemical makeup. Two mechanisms manage this without a dielectric. **Pseudocapacitance** arises from fast, reversible faradaic reactions at a surface, which take up charge smoothly as the voltage changes and so behave like a capacitor. **Chemical (or ambipolar) capacitance** stores charge in the bulk of a material by shifting its composition: lithiating an intercalation electrode, for example, raises the local lithium content and with it the species voltages, so the material soaks up charge as $V_i$ moves. This is the storage counterpart of the coupled transport from [other conductors](../other_conductors/), and like it the description never refers to a $V^\circ_i$ or an electrostatic gap; we take it up more fully in the [capacitance appendix](../capacitance/).

## Charging dynamics

How fast each kind charges comes down to what has to move. A dielectric capacitor charges almost instantly, held back only by the resistance of the wires that feed it, whereas a double-layer or electrolytic capacitor charges only as quickly as its ions can work their way through the electrolyte to the interface. That slower process appears on the diagram as transient slopes in the electrolyte's $V_i$, which flatten out as the device fills.

## Takeaways

The capacitor family is really a tour along the screening length. Where $\lambda \to \infty$, in an insulator, the charge spreads across the whole gap of a dielectric capacitor; where $\lambda \to 0$, in a concentrated electrolyte, it collapses into the nanometre double layer of a supercapacitor; and where charge is stored chemically rather than electrostatically, it lives in the bulk composition itself, with no field across a gap at all. In every case the $V_i$ and $V^\circ_i$ traces show at a glance where the charge is kept and what holds it there.

[**NEXT TOPIC: Saturation**](../saturation/)
