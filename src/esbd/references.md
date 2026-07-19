---
layout: layouts/esbd_topic.njk
title: 'Reference electrodes & cells'
tags: [page, esbd_topic]
orderESBD: 33
---

# {{title}}

In electrochemistry, a single electrode potential can never be measured on its own; you always need a second electrode potential to complete the picture. Together two electrodes form a **cell**. But why is this? With the [electrode potential machinery just discussed on the previous page](../e/), we have a clean visual of a cell to start our discussion.

<figure class="demo-container" style="max-width: 460px">
<!-- TODO(figure): cell-two-e — basic cell as electronic levels only (she-agcl-e style, or a levels-style schematic like levels-e-fourlevel): V_e-(left) and V_e-(right) wire levels flanking the solution, dashed V°_e-(SHE) rung in the middle; E_left and E_right marked as vertical gap arrows, cell voltage ΔV = E_right − E_left as the wire-to-wire gap. Draft caption below. -->
<p><em>[Figure placeholder: a cell as levels. Each electrode potential is its wire's gap down to the same $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ rung, and the voltmeter reads the wire-to-wire gap $E_{\text{right}} - E_{\text{left}}$: single levels float, only gaps get measured.]</em></p>
</figure>

A **reference electrode** is ostensibly a way to access (or infer) the standard reference levels (such as $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$) inside the cell. But is this actually possible? And, is the standard hydrogen electrode (SHE), the "zero level" of electrochemistry, actually a firm reference, or is the electrical ground ($V_{\mathrm{e}^-}=0$) of circuits more appropriate, or does the distinction really not matter in the end? What about the vacuum as a reference? A **liquid junction potential** complicates things further; what does that look like?

While I can't answer all the philosophical questions, what I can do is provide a rigorous visual picture where every quantity is perfectly represented.

## Reference electrodes

In the language of [half-reactions](../half/), a reference electrode is built on a couple chosen for fast, reproducible equilibration: the reaction pins the wire's $V_{\mathrm{e}^-}$ to the couple's implied level in the solution, a definite Nernst offset from the local $V^\circ_i$ ladder. Know the activities and you know exactly where the wire sits relative to that ladder. Two couples do most of this work in practice.

The **silver/silver chloride electrode** hangs off the chloride rung. Its reaction swaps an electron for a chloride ion, and equilibrium locks the wire to the solution, as we saw back in the [equilibrium topic](../equilibrium/):
$$
\begin{aligned}
V_{\mathrm{e}^-} &= V_{\mathrm{Cl}^-} - \frac{\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}}}{F} \\
&= V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) - \frac{RT}{F}\ln a_{\mathrm{Cl}^-}.
\end{aligned}
$$
The first line is the equilibrium condition; the second is the [floating Nernst equation](../half/), with the solids' fixed chemical potentials absorbed into the couple's standard level, $V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) = V^\circ_{\mathrm{Cl}^-} - (\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}})/F$, a rung riding the ladder at a fixed distance below $V^\circ_{\mathrm{Cl}^-}$.
<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-ag-agcl-electrode.njk" %}
{% figcaption %}
The Ag/AgCl electrode. The dashed line is the couple's implied electron level $V_{\mathrm{e}^-}(\mathrm{Ag/AgCl})$: the wire's own $V_{\mathrm{e}^-}$, carried out into the solution by the equilibrated reaction.
{% endfigcaption %}
</figure>

The **hydrogen electrode** hangs off the proton rung instead, interconverting hydrogen ions and hydrogen gas, $\mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H_2}$:
$$
\begin{aligned}
V_{\mathrm{e}^-} &= V_{\mathrm{H}^+} - \frac{\mu_{\mathrm{H_2}}}{2F} \\
&= V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) + \frac{RT}{F}\ln\frac{a_{\mathrm{H}^+}}{\sqrt{a_{\mathrm{H_2}}}},
\end{aligned}
$$
with $V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) = V^\circ_{\mathrm{H}^+} - \mu^\circ_{\mathrm{H_2}}/2F$. This is the electrode behind the [previous topic's](../e/) reference level: at standard activities the wire lands on $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ itself, the rung the whole $E$ scale hangs from.
<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-she.njk" %}
{% figcaption %}
The hydrogen electrode. The metal's level continues into the solution as the implied $V_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$, and its gap to the dashed standard rung is this electrode's own potential vs SHE, here purely the Nernst activity term (try both sliders). That rung wears two names: $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ lands exactly on $V^\circ_{\mathrm{H}^+}$, the two differing only by $\mu^\circ_{\mathrm{H_2}}/2F$, zero by convention ([half-reactions](../half/)).
{% endfigcaption %}
</figure>

## A reference cell

Now stick the two together: a hydrogen electrode on the left, a silver chloride electrode on the right, both dipping into the same dissolved $\mathrm{HCl}$. Each wire is pinned by its own couple, and the two standard rungs ride the same ladder at a fixed, tabulated spacing, so the cell voltage follows by subtracting the two readout forms.
<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-she-agcl.njk" %}
</figure>

The measured cell voltage comes out as
$$ V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) = E^\circ_{\mathrm{cell}} + \frac{RT}{F}\ln\!\bigg(\frac{\sqrt{a_{\mathrm{H_2}}}}{a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}}\bigg), $$
with
$$ E^\circ_{\mathrm{cell}} = V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) = 0.222~\mathrm{V}: $$
the familiar standard potential of the silver chloride electrode against the SHE, now visibly a gap between two standard rungs. (Unpacking the definitions, $E^\circ_{\mathrm{cell}} = (V^\circ_{\mathrm{Cl}^-} - V^\circ_{\mathrm{H}^+}) + \mu^\circ_{\mathrm{H_2}}/2F - (\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}})/F$, with the ladder spacing $V^\circ_{\mathrm{Cl}^-} - V^\circ_{\mathrm{H}^+} = 1.3601~\mathrm{V}$ from the [standard-state data](../data/).)

> The single-ion activities $a_{\mathrm{H}^+}$ and $a_{\mathrm{Cl}^-}$ are individually ambiguous (just like the placement of the $V^\circ_i$ ladder), but the ambiguity cancels in the charge-neutral product $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, so the measured voltage is unambiguous, as it must be.

Two interpretations of this $\Delta V$ coexist happily: an engineer sees the electrodes' $V_{\mathrm{e}^-}$ as reservoirs and the reaction as a generic {% wiki "electromotive force" %} pump; a chemist sees a reversible free-energy change, $\Delta G = -zF\,\Delta V$, per formula unit ($z$ electrons passed).

## Solution-centered vs. circuit-centered

That subtraction was a **solution-centered** derivation: each electrode described by its own gap down to a standard rung (an $E$ against an $E^\circ$, in the [previous topic's](../e/) terms), and the two descriptions compared. Traditional electrochemistry has always read cells this way, narrated (when it is narrated at all) with $\phi$: start in the middle, at the solution's inner potential, and work outward to each electrode,
$$
\begin{aligned}
\phi(\text{soln}) &\to V^\circ_{\mathrm{H}^+} \to V_{\mathrm{H}^+} \to V_{\mathrm{e}^-}(\text{left}), \\
\phi(\text{soln}) &\to V^\circ_{\mathrm{Cl}^-} \to V_{\mathrm{Cl}^-} \to V_{\mathrm{e}^-}(\text{right}),
\end{aligned}
$$
with $\phi$ cancelling in the difference. The floating levels tell the same story minus the metaphysics: where tradition points at $\phi$, a quantity no ion can measure, the diagram points at $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$, a level ions actually respond to; it does $\phi$'s job better.

This is also the distinction Boettcher et al. draw between the **electrode potential** (the electrode's own electronic level, our $V_{\mathrm{e}^-}(\text{electrode})$) and the **solution potential** (the solution's level, our $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$): two different "potentials" that the bare word runs together.

The diagram equally invites a **circuit-centered** reading: walk the chain
$$ V_{\mathrm{e}^-}(\text{left}) \to V_{\mathrm{H}^+} \to V^\circ_{\mathrm{H}^+} \to V^\circ_{\mathrm{Cl}^-} \to V_{\mathrm{Cl}^-} \to V_{\mathrm{e}^-}(\text{right}), $$
stepping from one real species voltage to the next, and dipping into single-ion activities only for the two $V_i \to V^\circ_i$ excursions (whose sum, the mean activity, is unambiguous).

In a single well-mixed solution the two readings agree about everything observable, and choosing between them looks like taste. One question already separates them, though. The single-ion ambiguity of [nonideal solutions](../nonideal/) lets a solution's whole ladder slide by a convention-dependent offset, every rung riding along, while the real $V_i$ hold still. Read circuit-centered, the slide is invisible bookkeeping; read solution-centered, with $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ as the zero of the axis, the very same slide moves every wire in the frame instead. So which is moving, the wires or the SHE? Within one solution no measurement can tell, and the question sounds academic. Hold it; it stops being academic when a second solution arrives.

## What a "standard electrode" really is

A "standard electrode" is the hypothetical electrode that would sit exactly on its reaction's standard rung: set the activities to one in the readout forms above and the wire lands on $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$, one of the floating standard-redox levels we tabulated in the [half-reactions topic](../half/). Re-drawn with only the electronic levels, our cell is just two $V_{\mathrm{e}^-}$ values sitting against two standard rungs:
<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-she-agcl-e.njk" %}
</figure>

Anchoring $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ to "0 V" recovers the usual reference frame of electrochemistry, an arbitrary choice that stops making sense the moment $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ varies in space.

In practice the SHE is finicky to pin down: its nominal $a_{\mathrm{H}^+}=1$ implies an awkward pH of 0, its "1 bar" of $\mathrm{H_2}$ competes with water vapour, and like every standard level it must be reached by extrapolation from dilute cells, the one regime where the single-ion ambiguity dies away (the junction-free Harned cell being the classic).^[Harned, H. S., & Ehlers, R. W. (1932). J. Am. Chem. Soc., 54, 1350, and Harned, H. S., & Ehlers, R. W. (1933). J. Am. Chem. Soc., 55, 2179 — the classic extrapolation; redone definitively in Bates, R. G., & Bower, V. E. (1954). [Standard potential of the silver-silver-chloride electrode from 0° to 95° C.](https://nvlpubs.nist.gov/nistpubs/jres/53/jresv53n5p283_A1b.pdf) J. Res. Natl. Bur. Stand., 53(5), 283–290.] Any "$V_{\mathrm{e}^-}(\mathrm{SHE})$" is, in the end, a theoretical extrapolated level tied to the standard state of the aqueous proton, $V^\circ_{\mathrm{H}^+}$.

## The liquid junction potential

Real reference electrodes are usually kept in their own clean compartment and wired to the test solution through a porous frit or salt bridge; that means a junction, and a junction means a step. For a cell whose two half-cells are different solutions, the measured voltage splits as
$$
\begin{aligned}
\Delta V &= V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) \\
&= E(\text{right}) - E(\text{left}) + \mathrm{LJP},
\end{aligned}
$$
where the **liquid junction potential** is the step in the reference level across the junction, $\mathrm{LJP} = V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{right}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{left})$; that reference level is the local standard hydrogen level $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$, made explicit in the previous section.^[Expanding both $E$'s with the Nernst equation gives the full-cell form with the LJP carried along explicitly; the textbook version usually drops the LJP and the left/right labelling. How this three-way splitting fares in concentrated solutions is taken up below.] The point worth dwelling on is that whenever the $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ levels vary in space (across a junction, a Donnan membrane, or a cell polarized wall to wall like the [previous topic's](../e/) battery), "the SHE" itself varies from place to place. There is a reason a perfectly defined reference is a fiction.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-ref-junction.njk" %}
{% figcaption %}
How a reference electrode really attaches: the silver-chloride electrode sits in its own $3\ \mathrm{mol/L}$ KCl filling solution and reaches the test solution only through a porous frit. Unlike the junction-free cells above, the junction is a <em>non-equilibrium</em> object, idling at a steady interdiffusion: no species' $V_i$ runs flat across it, and the invading ions dive away as they dilute ($V_{\mathrm{H}^+}$ resurfaces at the filling solution's own pH-7 level). The dashed line is the local $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$, one and the same line as $V^\circ_{\mathrm{H}^+}$; it steps at the junction by the LJP, every $V^\circ_i$ rung stepping rigidly along with it, so the reference reads the test solution through exactly the $\mathrm{LJP}$ term above, and that step drifts with the very solution being measured (slider). Notice too that in the $3\ \mathrm{mol/L}$ filling solution both ions ride <em>inside</em> their rungs' hatching: past standard concentration — the lower panel shows the same swamp directly, chloride and potassium marching up together through the frit while the test acid hugs the floor. The dashed $V_{\mathrm{e}^-}(\mathrm{Ag/AgCl})$ line is what the filling solution's chloride sets for the electrode's electrons. The reference wire is our $0\ \mathrm{V}$. The plot is schematic — the drawn step is not to scale, and comparisons *between* the two solutions inherit the magnification (the drawn $V_{\mathrm{Cl}^-}$ even flips its true cross-junction ordering); the Henderson estimate of the LJP is in the readout.
{% endfigcaption %}
</figure>

## Activities: who is moving?

The held question comes due as soon as we take activities seriously, and it splits into a reassuring half and an unsettling half.

The reassuring half belongs to the junction-free cell. Its voltage touches the ions only through the charge-neutral product $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, so nonideality enters as real, measurable physics with no convention in sight: run our reference cell across a range of $\mathrm{HCl}$ concentrations (this is precisely the Harned cell of the extrapolation above) and the measured voltage peels away from the ideal-dilute prediction, the gap being exactly $\tfrac{2RT}{F}\ln\gamma_\pm$. A mean activity coefficient, read straight off a voltmeter.

<figure class="demo-container" style="max-width: 460px">
<!-- TODO(figure): harned-nonideal — measured Harned-cell voltage vs HCl molality: tabulated data points (Harned & Ehlers / Bates & Bower) or 1-1 Pitzer curve (port from AI codes/nonideal/, HCl params from Mark; exaggerated params fine for now), plus the ideal-dilute Nernst curve; shaded gap = (2RT/F) ln γ±. Optionally companion extrapolation view (intercept = E°). Static x-y plot. -->
<p><em>[Figure placeholder: the Harned cell's measured voltage vs concentration, peeling away from the ideal-dilute curve; the gap is the mean-activity term.]</em></p>
</figure>

The unsettling half is the split. Divide that same nonideality between $\mathrm{H}^+$ and $\mathrm{Cl}^-$ and no experiment can referee the division: this is the single-ion ambiguity of the [nonideal appendix](../nonideal/), and on the diagram it slides the solution's whole ladder bodily, $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ riding along, while every real $V_i$ holds still. Within one solution that stays harmless: pick a convention, zero the SHE rung, and nothing observable can complain. But put two solutions in play, joined by a junction or simply drawn side by side on one plot, and each carries its own ladder with its own independent slide. The wires' $\Delta V$ stays fixed while the decomposition $E(\text{right}) - E(\text{left}) + \mathrm{LJP}$ shuffles underneath as the conventions change, and published conventions (MacInnes, Bates–Guggenheim, and friends) genuinely disagree once solutions are concentrated.

<figure class="demo-container" style="max-width: 460px">
<!-- TODO(figure): two-solution-conventions — two bulk solutions side by side (no junction internals), wires and measured ΔV fixed; a convention toggle (MacInnes vs Bates–Guggenheim, exaggerated Pitzer params fine) slides each solution's ladder and its SHE rung independently while the E/LJP split reshuffles in a readout. -->
<p><em>[Figure placeholder: two solutions, one voltmeter reading; a convention toggle slides each solution's ladder and SHE rung while the wires and $\Delta V$ stay put.]</em></p>
</figure>

So, which is moving? With two solutions there is only one tenable reading: the wires' $V_{\mathrm{e}^-}$ are the invariants, drawn before any convention is chosen, and "the SHE" is a rung that slides per solution at the whim of bookkeeping. The circuit wins; of the two candidate zeros in the introduction, it is the humble electrical ground that holds firm. The solution-centered view survives in a more modest role, as a local convention: perfectly serviceable inside any one solution, with every cross-solution comparison quietly routed through an equally conventional LJP. The machinery of these conventions, and how far apart they land in practice, is the [nonideal appendix](../nonideal/)'s business.

## The "absolute" electrode potential

Could we sidestep all this by referencing to the vacuum instead, an "absolute" electrode potential? On a $V_i$ diagram the vacuum is just one more level, $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$, sitting $\Phi/e$ *below* the metal's electrons on this voltage axis (equivalently a work function $\Phi$ *above* them in electron energy, the step we drew for [capacitors](../capacitors/)). The widely-quoted "absolute" value of about $4.44~\mathrm{V}$ for the SHE is best read as an electrode's work function: a genuine *surface* property that drifts with preparation and contamination, not a cleaner fundamental reference, and the in-material $\phi$ it leans on is not well defined to begin with (the subject of [$\phi$ under the microscope](../phi/)). The vacuum offers no escape: it is one more floating level, handy for lining up work functions, not a universal zero. Where the $4.44~\mathrm{V}$ comes from, and what vacuum levels are honestly good for, is covered in [Vacuum levels](../vacuum/).
<!-- TODO(optional): footnote on the Trasatti definition's own activity-convention twist for nonideal solutions — Mark to supply the details; it can now lean on the "Activities: who is moving?" section above. -->

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-vac-she.njk" %}
{% figcaption %}
The "absolute" electrode potential on a $V_i$ diagram: $\phi_{\mathrm{vac}}$ just outside the cell sits $4.44~\mathrm{V}$ below the SHE rung, exactly as a work function sits below a metal's $V_{\mathrm{e}^-}$. One more floating level to line things up with, not a universal zero.
{% endfigcaption %}
</figure>

## Takeaways

A reference electrode is a half-reaction kept reliably at equilibrium, pinning its wire at a known Nernst offset from a standard rung; a cell is two such electrodes, and a junction between them adds a liquid-junction step. The whole zoo of "potentials" (electrode potential, solution potential, cell voltage, liquid junction potential, the absolute reference) are particular gaps among the $V_{\mathrm{e}^-}$ and $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ levels, and the levels come in two kinds: wire levels, whose gaps a voltmeter delivers, and standard rungs, which sit wherever each solution's activity convention puts them. Anchoring everything to one rung works within a single solution; across solutions, only the circuit-centered quantities keep their meaning. The $V_i$ diagram shows all of them as the separate lines they always were.

[**NEXT TOPIC: Interface kinetics**](../kinetics/)
