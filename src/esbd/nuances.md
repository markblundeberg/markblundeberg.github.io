---
layout: layouts/esbd_topic.njk
title: 'Nuances'
tags: [page, esbd_topic]
orderESBD: 82
eleventyNavigation:
    key: 'Nuances'
    parent: ESBD
    order: 82
---

# Nuances about $V_i$

Are $V_i$ real voltages? Can we measure $V_i - V_j$ for arbitrary charged species $i$ and $j$?

In principle, yes. In practice, only in certain conditions.

Let's go back to the start, with [electrodes](../electrodes/). We established that for example, for a piece of zinc metal immersed in solution, we have:

$$ V_{\mathrm{Zn}^{2+}} = V_{\mathrm{e}^-} + \frac{1}{2F} \mu_{\mathrm{Zn}} $$

Thus, if we attach a voltmeter probe to the zinc metal (accessing $V_{\mathrm{e}^-}$), and provided we know $\mu_{\mathrm{Zn}}$, then it means we have access to $V_{\mathrm{Zn}^{2+}}$. Of course, this is slightly indirect, but it is also thermodynamically exact.

(To be clear, when I say "we can access $V_i$", I don't mean we can actually measure $V_i$. We cannot measure any absolute voltage, only voltage differences. But to access $V_i$ means that we can measure any voltage difference that involves $V_i$.)

Similarly, with our silver chloride electrode, we established that we can access $V_{\mathrm{Cl}^-}$ in a solution. So, if we immersed both the zinc electrode and the silver chloride electrode into a solution containing zinc and chloride ions (such as obtained by dissolving zinc chloride), we can obtain a measurement of $V_{\mathrm{Zn}^{2+}} - V_{\mathrm{Cl}^-}$ as simply a constant thermodynamic offset from our voltmeter measurement:

$$ V_{\mathrm{Zn}^{2+}} - V_{\mathrm{Cl}^-} = V_{\mathrm{e}^-}(\text{Zn}) - V_{\mathrm{e}^-}(\text{Ag}) + \text{const}. $$

### A technicality: the choice of $\mu$ convention

Of course, the $\text{const}$ above does depend on our convention for setting chemical potentials. Our choice has been to set $\mu = 0$ for elements in their most stable state, at reference conditions. Another choice is fine too, though we should take care to be fully consistent, and be aware that it changes the offsets in our ESBD diagrams.

In that sense, we do not truly have access to $V_i$ levels unless we specify the convention.

However, differences between $V_i$ levels in different places, for the same species $i$, are still well defined regardless of convention. So for example in the example of a discharging lithium ion battery, the gradients in each of $V_{\mathrm{e}^-}$ and $V_{\mathrm{Li}^+}$ are both quite well defined, and the choice of convention only affects the general offset between electron and lithium ion levels.

In principle, I could have defined species voltage differently and have it subtract off conventional offsets (as constants), which would basically be equivalent to fixing a chemical potential convention. As an example this "proper species voltage" $V'_i$ for sulfate ions could be defined as:

$$ V'_{\mathrm{SO_4}^{2-}} = \frac{\bar\mu_{\mathrm{SO_4}^{2-}} - \varepsilon_{\mathrm{S}} - 4 \varepsilon_{\mathrm{O}} - 2 \varepsilon_{\mathrm{e}^-} }{z_i F}, $$

where $\varepsilon_i$ are all energies of atoms or electrons in some kind of explicit reference state, consistent with the chemical potential scale. The reference state could be the IUPAC one, or alternatively could even be chosen more fundamentally like being the rest energy of the atom at 0 temperature in vacuum. Anyway, the $\varepsilon_i$ would all be constants so we would just get more explicit constants showing up in some of our formulae. Such a definition is technically superior, however it is also more verbose especially when it comes to multi-element ions. For that reason I prefer the concise $V_i = \bar\mu_i / z_i F$, which is casual but I think harmlessly so.

## Practical difficulties with accessing $V_i$

Sometimes, we just don't have an easy direct electrode that can noninvasively probe $V_i$ for a chosen species $i$.

Suppose we had a solution containing both zinc ions and iron ions, and we want to measure $V_{\mathrm{Zn}^{2+}}$. Unfortunately if we dip in our zinc electrode, we would find it immediately erodes as the iron drops out in a metallic precipitate. Similarly, suppose we want to access $V_{\mathrm{Na}^+}$, we cannot simply dip a bar of sodium into an aqueous solution as it will react violently, probably explosively.

The electrode might interfere in other ways. For example in a redox solution containing $\mathrm{Fe}^{2+}$ and $\mathrm{Fe}^{3+}$ ions, we might want to access each of $V_{\mathrm{Fe}^{2+}}$ and $V_{\mathrm{Fe}^{3+}}$ separately. But if we dip an iron electrode, it will enforce a fixed relationship between $V_{\mathrm{Fe}^{2+}}$, $V_{\mathrm{Fe}^{3+}}$, and $V_{\mathrm{e}^-}$ (namely, $V_{\mathrm{Fe}^{2+}} - \tfrac{1}{2F}\mu_{\mathrm{Fe(s)}} = V_{\mathrm{Fe}^{3+}} - \tfrac{1}{3F}\mu_{\mathrm{Fe(s)}} = V_{\mathrm{e}^-} $). And if we use our silver/silver chloride electrode in a very very dilute solution, then in fact some of its $\mathrm{AgCl}$ salt will dissolve.

Likewise, it is known in standard electrochemistry that certain electrodes get 'poisoned' by certain kinds of solutions, forming coatings that make them equilibrate very slowly or never.

For certain anions and cations, we might not be able to come up with any straight-forward electrode that probes their $V_i$, in *any* solvent. Such an electrode requires some kind of reversible reaction, which might be simply unavailable.

## Hypothetical measurement of any $V_i$

To access any $V_i$, we return to the concept of an ideal ion-selective membrane. This membrane would only allow the species $i$ to pass through. No other charged species, and no other uncharged species either. Thermodynamically, such a membrane would equilibrate to have $V_i$ equal on both sides for species $i$.

On one side we could place the target solution that we want to probe, and on the other side, place a fixed solution with a known (consistent) composition and an electrode. The electrode $V_{\mathrm{e}^-}$ will have some fixed offset from $V_i$, which can be calculated or calibrated, and since $V_i$ in the fixed solution will equilibrate perfectly to the target solution, then this $V_{\mathrm{e}^-} + \text{const}$ will provide access to $V_i$.

Upon dipping such an electrode into an arbitrary solution, a tiny amount of species $i$ may flow across the membrane but only to charge up the capacitance (or self-capacitance) of the probe circuitry. If the capacitance is small enough, then the fixed solution composition will not change significantly.

For example, to access $V_{\mathrm{Na}^+}$ we would need a membrane that only passes $\mathrm{Na}^+$, and the fixed solution could be aqueous, containing saturated $\mathrm{NaCl}$ (known $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} $) together with a silver chloride electrode (known $V_{\mathrm{e}^-} - V_{\mathrm{Cl}^-}$). Actually since the membrane blocks solvent molecules, the fixed solution need not be aqeuous, and the electrode might even be solid sodium metal in that case.

At least *in principle* we can have an ion-selective membrane for any ion. Thus, in principle every $V_i$ is accessible. We are only limited by technology in creating these membranes.

## Repurposing ion-selective electrodes

The idea of accessing $V_i$ through an ion-selective membrane is closely related to the {%wiki "ion-selective electrode" %} (ISE), which is normally thought of as a way to measure activity of ion $i$. I'd like to reinterpret the ISE in the $V_i$ framework and show how it is useful (and maybe more appropriate) to say that an ISE actually accesses $V_i$.

An ion-selective electrode actually contains two electrodes: one side equilibrates to the target solution through an ion-selective membrane ($V_i$ flat), and the other side is a standard reference electrode that connects to the target solution through a salt bridge (or similar). After some calibration, this combination lets us measure $V_i - V^\circ_i$. This means we can determine the single-ion activity $a_i$, according to the definition of ion activity: $V_i - V^\circ_i = \tfrac{RT}{z_i F}\ln a_i$.

However, we know that we cannot actually measure single-ion activities (except in the ideal dilute limit, where activity is simply $a_i = c_i/c^\circ$), because single-ion activities have serious fundamental ambiguities. Therefore the ISE must have a hidden non-thermodynamic assumption. Indeed, the reference electrode in an ISE generally is connected by a porous plug or salt bridge, and assumptions are made about the liquid junction potential. Specifically, something would have to be assumed about how the liquid junction potential changes from calibration solutions to target solutions. So, the claim that ISEs measure activity is on shaky foundations.

But, let's forget about the reference electrode, and just use the ion-selective half of the ISE! The ion-selective part has exactly what we want in terms of equilibrating $V_i$ with a fixed solution, and we can simply not make use of the reference electrode and its shaky assumptions about liquid junction potentials. To the extent that we have a good ion selective electrode for species $i$, we have good access to $V_i$.

## Why electrons are different

It is so much easier to measure $V_{\mathrm{e}^-}$, just use a voltmeter. By now it should be clear why this is the case:

Electrons are the *only* mobile charge in most familiar conductors, like metals. For these electronic conductors, and for the junctions between them, we automatically have the behaviour of an 'electron-selective membrane'. So, the flatness of $V_{\mathrm{e}^-}$ across a wide variety of connected electronic materials comes for free.

Of course, this is not a guarantee. Some electronic conductors *will* contain other mobile charges, for example both liquid mercury and graphite can contain lithium ions (dissolved or intercalated). This can make determination of $V_{\mathrm{e}^-}$ as tricky as any other ion, but it will tend to be the case that electronic conductivity vastly exceeds ionic conductivities.

In the case of semiconductors, when we have to treat both electrons and holes (out of equilibrium) we do actually effectively have two charged species present, and so many of the subtleties of having multiple $V_i$'s actually do appear! In bipolar junction transistors, for example we can basically say the electrodes attached to *p*-type material are directly accessing the $V_{\mathrm{h}^+}$ level.

So, mobile electrons and their $V_{\mathrm{e}^-}$ are practically unique, even though they are not special from the point of view of pure thermodynamics.

## Takeaways

The notion that "every ion has a voltage" might sound too good to be true, but I hope the above discussion makes it clear that the $V_i$ truly are meaningful and accessible voltages. Although ionic $V_i$'s are practically more difficult to access than the regular electronic voltage $V_{\mathrm{e}^-}$, they are fundamentally (and sometimes practically) real voltages!

For the next topic, I am going to criticise the traditional approach to electrochemistry, which is based on electrostatic potential $\phi$.

[**NEXT TOPIC: The case against $\phi$**](../phi/)
