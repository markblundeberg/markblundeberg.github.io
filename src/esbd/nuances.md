---
layout: layouts/esbd_topic.njk
title: 'Reaching any species voltage'
tags: [page, esbd_topic]
orderESBD: 92
---

# Reaching any $V_i$

We [saw earlier](../v_i/) that electrons are the easy case (any voltmeter reads a difference in $V_{\mathrm{e}^-}$), while an ion takes a carefully prepared ion-reversible electrode, and even then what comes out cleanly is a *same-ion difference*, not an absolute. Two honest questions are left. When does even that indirect route fail? And is there a recipe that reaches an *arbitrary* $V_i$?

One piece of fine print carries over from before: to *access* a $V_i$ means only that we can measure some voltage difference involving it, never an absolute voltage, since no absolute voltage is measurable for any species, electrons included.

Two ion-reversible electrodes already reach past a single one. Dip a zinc electrode (accessing $V_{\mathrm{Zn}^{2+}}$) and a silver chloride electrode (accessing $V_{\mathrm{Cl}^-}$) into the same zinc chloride solution, and the voltmeter reading between them is fixed to the physical *different*-ion difference $V_{\mathrm{Zn}^{2+}} - V_{\mathrm{Cl}^-}$ by a constant offset:

$$ V_{\mathrm{Zn}^{2+}} - V_{\mathrm{Cl}^-} = V_{\mathrm{e}^-}(\text{Zn}) - V_{\mathrm{e}^-}(\text{Ag}) + \text{const}. $$

## The one convention behind the constant

That $\text{const}$ depends on our convention for chemical potentials. Our choice has been $\mu = 0$ for elements in their most stable state at reference conditions; another choice is fine, provided we stay consistent and remember it shifts the offsets in our ESBD diagrams. In that sense we do not truly reach absolute $V_i$ *levels* until we fix a convention.

Differences in $V_i$ at different places, for the *same* species, escape this entirely: they are well defined no matter the convention. In a discharging lithium-ion battery the gradients in $V_{\mathrm{e}^-}$ and in $V_{\mathrm{Li}^+}$ are each perfectly meaningful, and the convention only sets the overall offset between the electron and lithium-ion ladders.

One could fold the convention straight into the definition, subtracting explicit reference-state constants. This "proper species voltage" $V'_i$ for sulfate would read

$$ V'_{\mathrm{SO_4}^{2-}} = \frac{\bar\mu_{\mathrm{SO_4}^{2-}} - \varepsilon_{\mathrm{S}} - 4 \varepsilon_{\mathrm{O}} - 2 \varepsilon_{\mathrm{e}^-} }{z_i F}, $$

where the $\varepsilon$'s are energies of atoms and electrons in some explicit reference state, whether the IUPAC one or something more fundamental like the atom's rest energy at zero temperature in vacuum.^[These elemental references are exactly the constants written $\mu^*_i$ in [offsets galore](../offsetsgalore/); $\varepsilon_i$ and $\mu^*_i$ name the same thing.] It is technically superior but verbose, especially for multi-element ions, so I keep the concise $V_i = \bar\mu_i / z_i F$, which is casual but I think harmlessly so.

## When the direct electrode fails

Sometimes no easy electrode noninvasively probes the $V_i$ we want. Dip a zinc electrode into a solution holding both zinc and iron ions and it erodes as the iron plates out; try to reach $V_{\mathrm{Na}^+}$ by dipping sodium metal into water and it reacts violently, probably explosively.

An electrode can interfere more subtly. In a solution of $\mathrm{Fe}^{2+}$ and $\mathrm{Fe}^{3+}$ we might want $V_{\mathrm{Fe}^{2+}}$ and $V_{\mathrm{Fe}^{3+}}$ separately, but an iron electrode forces a fixed relationship among $V_{\mathrm{Fe}^{2+}}$, $V_{\mathrm{Fe}^{3+}}$, and $V_{\mathrm{e}^-}$ (namely $V_{\mathrm{Fe}^{2+}} - \tfrac{1}{2F}\mu_{\mathrm{Fe(s)}} = V_{\mathrm{Fe}^{3+}} - \tfrac{1}{3F}\mu_{\mathrm{Fe(s)}} = V_{\mathrm{e}^-}$). A silver/silver chloride electrode in a very dilute solution starts to dissolve its own $\mathrm{AgCl}$. Electrodes can also be 'poisoned' by a solution, forming coatings that make them equilibrate slowly or never. And for some ions no straightforward reversible electrode exists in *any* solvent.

## A recipe that reaches any ion

To reach *any* $V_i$, return to the ideal ion-selective membrane, one that passes species $i$ and nothing else, charged or neutral. Thermodynamically it equilibrates to hold $V_i$ equal on its two sides.

Put the target solution on one side and, on the other, a fixed solution of known composition with an electrode in it. That electrode's $V_{\mathrm{e}^-}$ sits a fixed, calibrated offset from $V_i$ in the fixed solution, and the membrane pins that $V_i$ to the target's, so $V_{\mathrm{e}^-} + \text{const}$ tracks the target's $V_i$. Dipping the probe lets a trace of $i$ cross the membrane, but only enough to charge the probe's small capacitance; keep that capacitance low and the fixed solution's composition barely moves.

To reach $V_{\mathrm{Na}^+}$, for instance, we would want a membrane passing only $\mathrm{Na}^+$, with a fixed solution of saturated $\mathrm{NaCl}$ (known $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$) and a silver chloride electrode (known $V_{\mathrm{e}^-} - V_{\mathrm{Cl}^-}$). Since the membrane blocks solvent too, the fixed solution need not even be aqueous, and the electrode could be solid sodium. In principle a membrane exists for any ion, so in principle every $V_i$ is reachable, limited only by the technology of making the membranes. (The classic real one is the {% wiki "Fluoride selective electrode", "fluoride-selective electrode" %}, whose $\mathrm{LaF_3}$ crystal passes $\mathrm{F}^-$ and little else.)

## Repurposing ion-selective electrodes

This is closely related to the {%wiki "ion-selective electrode" %} (ISE), normally described as a way to measure the activity of ion $i$. I would rather reinterpret it in the $V_i$ framework, where it is more honest to say an ISE *accesses* $V_i$.

An ISE really contains two electrodes: one equilibrates to the target through an ion-selective membrane ($V_i$ flat across it), the other is a standard reference electrode joined to the target by a salt bridge. After calibration the pair reports $V_i - V^\circ_i$, and hence the single-ion activity, via $V_i - V^\circ_i = \tfrac{RT}{z_i F}\ln a_i$.

But single-ion activities can't actually be measured outside the ideal-dilute limit (where $a_i = c_i/c^\circ$); they carry deep ambiguities, so the ISE must be smuggling in a non-thermodynamic assumption. It is: the reference side's salt bridge needs an assumption about how the liquid junction potential drifts from the calibration solutions to the target. The claim that an ISE measures activity rests on that shaky footing.

So drop the reference electrode and keep the ion-selective half. That half does exactly what we want, equilibrating $V_i$ to a fixed solution with none of the liquid-junction guesswork. To the extent the ion-selective electrode is good, we have good access to $V_i$.

## Electrons are just the easy case

Seen this way the voltmeter is not a special instrument at all: a metal wire, or a junction between metals, simply *is* an ideal 'electron-selective membrane', and it comes for free because electrons are the only mobile charge in ordinary conductors. That is the whole of why $V_{\mathrm{e}^-}$ is so easy to reach.

This is not guaranteed, of course. Some electronic conductors carry other mobile charges too (liquid mercury and graphite both take up lithium), which can make $V_{\mathrm{e}^-}$ as awkward to pin down as any ion, though electronic conductivity usually swamps the ionic. And in semiconductors out of equilibrium, electrons *and* holes both matter, so the multi-$V_i$ subtleties reappear in full: a bipolar transistor's contacts to $p$-type material are, in effect, directly accessing the $V_{\mathrm{h}^+}$ level.

So mobile electrons are practically unique, though not thermodynamically special: they are the easy case of a principle that reaches every species.

## Takeaways

"Every ion has a voltage" sounds too good to be true, but the $V_i$ really are meaningful, and really are reachable: trivially for electrons, and with more effort (an ion-reversible electrode, or ultimately an ion-selective membrane) for the rest. The difficulty is only ever one of reach, set by our instruments, and it never bears on whether each $V_i$ is a genuine voltage.

Next, having leaned so hard on species voltages, I turn to criticize the traditional foundation of electrochemistry: the electrostatic potential $\phi$.

[**NEXT TOPIC: The case against $\phi$**](../phi/)
