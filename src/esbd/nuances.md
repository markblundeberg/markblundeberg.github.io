---
layout: layouts/esbd_topic.njk
title: 'Nuances'
tags: [page, esbd_topic]
orderESBD: 97
eleventyNavigation:
    key: 'Nuances'
    parent: ESBD
    order: 997
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

## A technicality: the choice of $\mu$ offsets

Of course, the $\text{const}$ does depend on our convention for setting chemical potentials, but setting $\mu = 0$ for elements in their most stable state, at reference conditions, is a reasonable choice. Another choice is fine too, though we should take care to be fully consistent, and be aware that it changes the offsets in our ESBD diagrams.

We might want to leave our reference chemical potentials unspecified. I.e., suppose we have

$$ \mu_{\mathrm{Zn}} = \mu_{\mathrm{Zn},\text{ref}} + \Delta\mu_{\mathrm{Zn}} $$

where $\mu_{\mathrm{Zn},\text{ref}}$ is an unspecified chemical potential at given reference conditions, and $\Delta\mu_{\mathrm{Zn}}$ is the (measurable!) difference between reference conditions and our actual conditions in our zinc electrode. In this case, we should say we actually have access to $V'_{\mathrm{Zn}^{2+}}$ according to:

$$ V'_{\mathrm{Zn}^{2+}} = V_{\mathrm{e}^-} + \frac{1}{2F} \Delta \mu_{\mathrm{Zn}} $$

where $V'_{\mathrm{Zn}^{2+}}$ is defined as:

$$ V'_{\mathrm{Zn}^{2+}} = \frac{\bar\mu_{\mathrm{Zn}^{2+}} - \mu_{\mathrm{Zn},\text{ref}}}{2 F} $$

*for given reference conditions*. This $V'_{\mathrm{Zn}^{2+}}$ is definitionally independent of our choice of elemental $\mu$ offsets, and the only remaining offset is the fundamental arbitrary offset that affects all electric potentials.

This $V'_{\mathrm{Zn}^{2+}}$ is technically superior, however it is also definitionally more verbose especially when it comes to multi-element ions. For that reason I prefer simply $V_i = \bar\mu_i / z_i F$, which I think is harmlessly casual.

## Practical difficulties with accessing $V_i$

If we had a solution containing both zinc ions and iron ions, and then we went to dip in our zinc electrode, we would find it immediately erodes as the iron drops out in a metallic precipitate. Similarly, suppose we want to access $V_{\mathrm{Na}^+}$, we cannot simply dip a bar of sodium into an aqueous solution as it will react violently, probably explosively.

The electrode might interfere in other ways. For example in a redox solution containing $\mathrm{Fe}^{2+}$ and $\mathrm{Fe}^{3+}$ ions, we might want to access each of $V_{\mathrm{Fe}^{2+}}$ and $V_{\mathrm{Fe}^{3+}}$ separately. But if we dip an iron electrode, it will enforce $V_{\mathrm{Fe}^{2+}} - \tfrac{1}{2F}\mu_{\mathrm{Fe(s)}} = V_{\mathrm{Fe}^{3+}} - \tfrac{1}{3F}\mu_{\mathrm{Fe(s)}} = V_{\mathrm{e}^-} $. And if we use our silver/silver chloride electrode in a solution concentrated $\mathrm{Ag}^+$ ions, we will access $V_{\mathrm{Ag}^+}$ instead of $V_{\mathrm{Cl}^-}$.

For certain anions and cations, we might not be able to come up with any straight-forward electrode that probes their $V_i$. Such an electrode requires some kind of reversible reaction, which might be simply unavailable.

## Hypothetical measurement of any $V_i$

To access any $V_i$, we return to the concept of an ideal ion-selective membrane. This membrane would only allow the species $i$ to pass through. No other charged species, and no other uncharged species either. Thermodynamically, such a membrane would equilibrate to have $V_i$ equal on both sides.

On one side we could place the target solution that we want to probe, and on the other side, place a fixed solution with a consistent composition, with an electrode. The electrode $V_{\mathrm{e}^-}$ will have some fixed offset from $V_i$, which can be calculated or calibrated, and since $V_i$ in the fixed solution will equilibrate perfectly to the target solution, then this $V_{\mathrm{e}^-} + \text{const}$ will provide access to $V_i$.

Upon dipping such an electrode into an arbitrary solution, a tiny amount of species $i$ may flow across the membrane but only so much needed to charge up the capacitance (or self-capacitance) of the probe circuity.

For example, to access $V_{\mathrm{Na}^+}$ we would need a membrane that only passes $\mathrm{Na}^+$, and the fixed solution could be aqeous, containing saturated $\mathrm{NaCl}$ (known $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} $) together with a silver chloride electrode (known $V_{\mathrm{e}^-} - V_{\mathrm{Cl}^-}$). The fixed solution could even be non-aqeous and the electrode could be solid sodium metal.

At least *in principle* we can hypothetically have an ion-selective membrane for any ion, and so in principle every $V_i$ really is accessible. We are only limited by technology in creating these membranes.

## Repurposing ion-selective electrodes

The idea of accessing $V_i$ through an ion-selective membrane is closely related to the {%wiki "ion-selective electrode" %} (ISE), which is normally thought of as a way to measure activity of ion $i$. I'd like to reinterpret the ISE in the $V_i$ framework and show how it is useful (and maybe more appropriate) to say that an ISE actually accesses $V_i$.

An ion-selective electrode actually contains two electrodes: one side equilibrates through an ion-selective membrane ($V_i$ flat), and the other side is a standard reference electrode that probes $V^\circ_{\mathrm{H}^+}$. So, given prior thermodynamic knowledge of $V^\circ_i - V^\circ_{\mathrm{H}^+}$, or simply doing a calibration on a known solution (which is usually necessary anyway due to drifts), this means we can determine the single-ion activity $a_i$, according to the definition of ion activity: $V_i - V^\circ_i = \tfrac{RT}{z_i F}\ln a_i$.

However, we know that we cannot actually measure single-ion activities (except in the ideal dilute limit, where activity is simply $a_i = c_i/c^\circ$), because single-ion activities are actually non-thermodynamic. Therefore the ISE must have a hidden non-thermodynamic assumption. Indeed, the reference electrode in an ISE generally is connected by a porous plug or salt bridge, and assumptions are made about the liquid junction potential changes in calibration solutions vs target solutions. So, the claim that ISEs measure activity is on shaky foundations.

But, let's forget about the reference electrode, and just use the ion-selective part! To the extent that we have a good ion-selective electrode for species $i$, we also have good access to $V_i$ without making any assumptions about liquid junction potentials or single-ion activities.

## Why electrons are different

It is so much easier to measure $V_{\mathrm{e}^-}$, just use a voltmeter. But it is quite obvious why this is the case:

Electrons are the only mobile charge in most familiar conductors, like metals. In other words, most electronic conductors and junction between them are automatically going to be 'ion-selective membranes' that only permit electrons to pass through them.

Of course, this is not a guarantee. Some electronic conductors *will* contain other mobile charges, which could make determination of $V_{\mathrm{e}^-}$ as tricky as any other ion. Probably, the presence of other ions will be negligible. For example liquid mercury containing dissolved sodium, or lithium-intercalated graphite, both nominally contain mobile alkali ions, however the ionic contribution to conductivity would be vastly smaller than the electronic conductivity.)

So, $V_{\mathrm{e}^-}$ is indeed practically unique, however from pure thermodynamics, it is not special.

## Takeaways

The notion that "every ion has a voltage" might sound too good to be true, but I hope the above discussion makes it clear that the $V_i$ truly are meaningful and accessible voltages. Although ionic $V_i$'s are practically more difficult to access than the regular electronic voltage $V_{\mathrm{e}^-}$, they are fundamentally (and sometimes practically) real voltages!

For the next topic, I am going to criticise the traditional approach to electrochemistry, which is based on electrostatic potential $\phi$.

[**NEXT TOPIC: The case against $\phi$**](../phi/)
