---
layout: layouts/esbd_topic.njk
title: 'Reference electrodes & cells'
tags: [page, esbd_topic]
orderESBD: 33
---

# {{title}}

In electrochemistry, a single electrode potential can never be measured on its own; you always need a second electrode potential to complete the picture. Together two electrodes form a **cell**. With the [electrode potential machinery just discussed on the previous page](../e/), we have a clean visual of a cell to start our discussion.

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-cell-e.njk" %}
{% figcaption %}
The basic cell picture. Each electrode potential is its wire's gap down to the same reference rung, $E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ (the marked gaps), and a voltmeter across the cell reads the wire-to-wire gap $E_{\text{right}} - E_{\text{left}}$: single levels float, only gaps get measured.
{% endfigcaption %}
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
The Ag/AgCl electrode. The dashed line is the couple's implied electron level $V_{\mathrm{e}^-}(\mathrm{Ag/AgCl})$: the wire's own $V_{\mathrm{e}^-}$, carried out into the solution by the equilibrated reaction. Try the slider: the wire holds still while the standard rung rides the ladder.
{% endfigcaption %}
</figure>

The **hydrogen electrode** hangs off the proton rung instead, interconverting hydrogen ions and hydrogen gas, $\mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H_2}$:
$$
\begin{aligned}
V_{\mathrm{e}^-} &= V_{\mathrm{H}^+} - \frac{\mu_{\mathrm{H_2}}}{2F} \\
&= V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) + \frac{RT}{F}\ln\frac{a_{\mathrm{H}^+}}{\sqrt{a_{\mathrm{H_2}}}},
\end{aligned}
$$
with $V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) = V^\circ_{\mathrm{H}^+} - \mu^\circ_{\mathrm{H_2}}/2F$. This is the electrode behind the [previous topic's](../e/) reference level: at standard activities the wire lands on $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ itself, the rung the whole $E$ scale hangs from. In practice that standard form is finicky to realize, its nominal $a_{\mathrm{H}^+}=1$ implying an awkward pH of 0 and its "1 bar" of $\mathrm{H_2}$ competing with water vapour, so the *standard* hydrogen electrode is more idealization than instrument.
<figure class="demo-container" style="max-width: 230px">
{% include "esbd-diagrams/esbd-she.njk" %}
{% figcaption %}
The hydrogen electrode. The metal's level continues into the solution as the implied $V_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$; its gap to the dashed standard rung is the Nernst activity term (try both sliders). That rung wears two names: $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ lands exactly on $V^\circ_{\mathrm{H}^+}$, the two differing only by $\mu^\circ_{\mathrm{H_2}}/2F$, zero by convention ([half-reactions](../half/)).
{% endfigcaption %}
</figure>

## A reference cell

Now stick the two together: a hydrogen electrode on the left, a silver chloride electrode on the right, both dipping into the same dissolved $\mathrm{HCl}$. Each wire is pinned by its own couple, and the two standard rungs ride the same ladder at a fixed, tabulated spacing, so the cell voltage follows by subtracting the two readout forms.
<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-she-agcl-e.njk" %}
{% figcaption %}
The reference cell, electronic levels only (the ionic levels look as in the single-electrode figures above). Each wire rides its couple's implied dashed level, a Nernst activity gap (↕ markers) away from the couple's standard rung, and the cell voltage readout is the wire-to-wire gap. Try the sliders: the wires move while the rungs stay put, their $0.222~\mathrm{V}$ spacing fixed.
{% endfigcaption %}
</figure>

The measured cell voltage comes out as
$$ V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) = E^\circ_{\mathrm{cell}} + \frac{RT}{F}\ln\!\bigg(\frac{\sqrt{a_{\mathrm{H_2}}}}{a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}}\bigg), $$
with
$$ E^\circ_{\mathrm{cell}} = V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) = 0.222~\mathrm{V}: $$
the familiar standard potential of the silver chloride electrode against the SHE, now visibly a gap between two standard rungs. (Unpacking the definitions, $E^\circ_{\mathrm{cell}} = (V^\circ_{\mathrm{Cl}^-} - V^\circ_{\mathrm{H}^+}) + \mu^\circ_{\mathrm{H_2}}/2F - (\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}})/F$, with the ladder spacing $V^\circ_{\mathrm{Cl}^-} - V^\circ_{\mathrm{H}^+} = 1.3601~\mathrm{V}$ from the [standard-state data](../data/).)^[Two interpretations of this $\Delta V$ coexist happily: an engineer sees the electrodes' $V_{\mathrm{e}^-}$ as reservoirs and the reaction as a generic [electromotive force](https://en.wikipedia.org/wiki/Electromotive_force) pump; a chemist sees a reversible free-energy change, $\Delta G = -zF\,\Delta V$, per formula unit ($z$ electrons passed).]

> The single-ion activities $a_{\mathrm{H}^+}$ and $a_{\mathrm{Cl}^-}$ are individually ambiguous (just like the placement of the $V^\circ_i$ ladder), but the ambiguity cancels in the charge-neutral product $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, so the measured voltage is unambiguous, as it must be.

## Solution-centered vs. circuit-centered

That subtraction was a **solution-centered** derivation, and the cell figure draws it literally: two wires sitting against two standard rungs, each electrode described by its own gap down to a rung (an $E$ against an $E^\circ$, in the [previous topic's](../e/) terms), the two descriptions then compared. Traditional electrochemistry has always read cells this way, narrated (when it is narrated at all) with $\phi$: start in the middle, at the solution's inner potential, and work outward to each electrode,
$$
\begin{aligned}
\phi(\text{soln}) &\to V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) \to V_{\mathrm{e}^-}(\text{left}), \\
\phi(\text{soln}) &\to V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) \to V_{\mathrm{e}^-}(\text{right}),
\end{aligned}
$$
the first step of each chain a fixed property of solvent and couple, the second the couple's Nernst gap (the figure's ↕ markers), and $\phi$ cancelling in the difference. The floating levels tell the same story minus the metaphysics: tradition starts its narration at $\phi$, a level nothing can measure and the diagram declines to draw; the standard rungs, each a known Nernst gap away from a measurable wire, do $\phi$'s job better. (This is also the separation urged by Boettcher et al., between the **electrode potential**, the wire's own $V_{\mathrm{e}^-}$, and the **solution potential**, the couple's implied $V_{\mathrm{e}^-}(\mathrm{rxn})$: two "potentials" that the bare word runs together, and two separate lines on the diagram.^[Boettcher, S. W., et al. (2021). [Potentially Confusing: Potentials in Electrochemistry.](https://doi.org/10.1021/acsenergylett.0c02443) ACS Energy Letters, 6(1), 261–266.])

The diagram equally invites a **circuit-centered** reading: walk the chain
$$ V_{\mathrm{e}^-}(\text{left}) \to V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) \to V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) \to V_{\mathrm{e}^-}(\text{right}), $$
wire to rung, rung to rung, rung to wire: a Nernst gap, the fixed $0.222~\mathrm{V}$ spacing, another Nernst gap, every station a line the cell figure actually draws. Single-ion activities enter only through the two end steps, $a_{\mathrm{H}^+}$ in one and $a_{\mathrm{Cl}^-}$ in the other, and combine into the same unambiguous neutral product as before.

In a single well-mixed solution the two readings agree about everything observable, and choosing between them looks like taste. The solution-centered habit does come with a frame: anchoring $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ to "0 V" recovers the usual reference frame of electrochemistry (a "standard electrode" being the hypothetical electrode that sits exactly on its rung, activities set to one in the readout forms above), and the cell figure quietly made this choice already, holding its rungs still while the sliders move the wires.

One question already separates the two readings, though. The single-ion ambiguity of [nonideal solutions](../nonideal/) lets a solution's whole ladder slide by a convention-dependent offset, both electron rungs riding along, while the real levels, the wires and the implied dashes alike, hold still. Read circuit-centered, the slide is invisible bookkeeping; read solution-centered, with $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ as the zero of the axis, the very same slide moves every wire in the frame instead. So which is moving, the wires or the SHE? Within one solution no measurement can tell, and the question sounds academic. Hold it; it stops being academic when a second solution arrives.

## The liquid junction potential

Real reference electrodes are usually kept in their own clean compartment and wired to the test solution through a porous frit or salt bridge; that means a junction, and a junction means a step. For a cell whose two half-cells are different solutions, the measured voltage splits as
$$
\begin{aligned}
\Delta V &= V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) \\
&= E(\text{right}) - E(\text{left}) + \mathrm{LJP},
\end{aligned}
$$
where the **liquid junction potential** is the step in the reference level across the junction, $\mathrm{LJP} = V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{right}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{left})$; that reference level is the local standard hydrogen level $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$, made explicit in the previous section.^[Expanding both $E$'s with the Nernst equation gives the full-cell form with the LJP carried along explicitly; the textbook version usually drops the LJP and the left/right labelling. How this three-way splitting fares in concentrated solutions is taken up below.] Whenever the $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ levels vary in space (across a junction, a Donnan membrane, or a cell polarized wall to wall like the [previous topic's](../e/) battery), "the SHE" itself varies from place to place.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-ref-junction.njk" %}
{% figcaption %}
How a reference electrode really attaches: the silver-chloride electrode sits in its own $3\ \mathrm{mol/L}$ KCl filling solution and reaches the test solution only through a porous frit. Unlike the junction-free cells above, the junction is a <em>non-equilibrium</em> object, idling at a steady interdiffusion: no species' $V_i$ runs flat across it, and the invading ions dive away as they dilute ($V_{\mathrm{H}^+}$ resurfaces at the filling solution's own pH-7 level). The dashed line is the local $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$, one and the same line as $V^\circ_{\mathrm{H}^+}$; it steps at the junction by the LJP, every $V^\circ_i$ rung stepping rigidly along with it, so the reference reads the test solution through exactly the $\mathrm{LJP}$ term above, and that step drifts with the very solution being measured (slider). The lower panel shows the same junction in concentrations, chloride and potassium marching up together through the frit while the test acid hugs the floor; the dashed $V_{\mathrm{e}^-}(\mathrm{Ag/AgCl})$ line above is what the filling solution's chloride sets for the electrode's electrons. The reference wire is our $0\ \mathrm{V}$. The plot is schematic and the drawn step is not to scale; the Henderson estimate of the LJP is in the readout.
{% endfigcaption %}
</figure>

## Activities: who is moving?

The held question comes due as soon as we take activities seriously, and it splits into a reassuring half and an unsettling half.

The reassuring half belongs to the junction-free cell. Its voltage touches the ions only through the charge-neutral product $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, so nonideality enters as real, measurable physics with no convention in sight: run our reference cell across a range of $\mathrm{HCl}$ concentrations (this arrangement is the classic **Harned cell**) and the measured voltage peels away from the ideal-dilute prediction, the gap being exactly $\tfrac{2RT}{F}\ln\gamma_\pm$. A mean activity coefficient, read straight off a voltmeter. The same cell, extrapolated to the dilute limit where the single-ion ambiguity dies away, is how the standard levels get pinned down in the first place;^[Harned, H. S., & Ehlers, R. W. (1932). J. Am. Chem. Soc., 54, 1350, and Harned, H. S., & Ehlers, R. W. (1933). J. Am. Chem. Soc., 55, 2179 — the classic extrapolation; redone definitively in Bates, R. G., & Bower, V. E. (1954). [Standard potential of the silver-silver-chloride electrode from 0° to 95° C.](https://nvlpubs.nist.gov/nistpubs/jres/53/jresv53n5p283_A1b.pdf) J. Res. Natl. Bur. Stand., 53(5), 283–290.] any tabulated $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ is, in the end, a theoretical extrapolated level tied to the standard state of the aqueous proton.

<figure class="demo-container" style="max-width: 460px">
<!-- TODO(figure): harned-nonideal — measured Harned-cell voltage vs HCl molality: tabulated data points (Harned & Ehlers / Bates & Bower) or 1-1 Pitzer curve (port from AI codes/nonideal/, HCl params from Mark; exaggerated params fine for now), plus the ideal-dilute Nernst curve; shaded gap = (2RT/F) ln γ±. Optionally companion extrapolation view (intercept = E°). Static x-y plot. -->
<p><em>[Figure placeholder: the Harned cell's measured voltage vs concentration, peeling away from the ideal-dilute curve; the gap is the mean-activity term.]</em></p>
</figure>

The unsettling half is the split. Divide that same nonideality between $\mathrm{H}^+$ and $\mathrm{Cl}^-$ and no experiment can referee the division: this is the single-ion ambiguity of the [nonideal appendix](../nonideal/), the very ladder-slide we held above, harmless within one solution. But put two solutions in play, joined by a junction or simply drawn side by side on one plot, and each carries its own ladder with its own independent slide. The wires' $\Delta V$ stays fixed while the decomposition $E(\text{right}) - E(\text{left}) + \mathrm{LJP}$ shuffles underneath as the conventions change, and the published conventions (MacInnes, Bates–Guggenheim, and friends) genuinely part ways once solutions leave the dilute regime, at the level of millivolts and up.{# ⚠ CHECK: magnitude of convention disagreements; pin a real number when the two-solution figure is built #} The stakes are practical: the pH scale itself is defined through exactly this machinery (a Harned-cell measurement plus the Bates–Guggenheim convention to split off $a_{\mathrm{H}^+}$), so the most-measured quantity in chemistry carries a single-ion convention inside its definition.

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
