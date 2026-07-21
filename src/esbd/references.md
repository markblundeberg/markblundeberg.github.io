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

The basic cell picture. Each electrode potential is its wire's gap down to the same reference rung, $E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ (the marked gaps), and a voltmeter across the cell reads the wire-to-wire gap $\Delta V = E_{\text{right}} - E_{\text{left}}$: single levels float, only gaps get measured.

{% endfigcaption %}
</figure>

A **reference electrode** is ostensibly a way to access (or infer) the standard reference levels (such as $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$) inside the cell. But is this actually possible? And, is the standard hydrogen electrode (SHE), the "zero level" of electrochemistry, actually a firm reference, or is the electrical ground ($V_{\mathrm{e}^-}=0$) of circuits more appropriate, or does the distinction really not matter in the end? What about the vacuum as a reference? A **liquid junction potential** complicates things further; what does that look like?

While I can't answer all the philosophical questions, what I can do is provide a rigorous visual picture where every quantity is perfectly represented.

## Reference electrodes

In the language of [half-reactions](../half/), a reference electrode is built on a couple chosen for fast, reproducible equilibration: the reaction pins the wire's $V_{\mathrm{e}^-}$ to the couple's implied level in the solution, a definite Nernst offset from the local $V^\circ_i$ ladder. Know the activities and you know exactly where the wire sits relative to that ladder. Two couples do most of this work in practice.

The **silver/silver chloride electrode** hangs off the chloride rung. Its reaction swaps an electron for a chloride ion, and equilibrium locks the wire to the solution, as we saw back in the [equilibrium topic](../equilibrium/):
$$ V_{\mathrm{e}^-} = V_{\mathrm{Cl}^-} - \frac{\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}}}{F}, $$
which the redox [floating Nernst equation](../half/) is equivalently:
$$
\begin{aligned}
V_{\mathrm{e}^-}
&= V_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) \\
&= V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) - \frac{RT}{F}\ln a_{\mathrm{Cl}^-}
,
\end{aligned}
$$
with the solids' fixed chemical potentials absorbed into the couple's standard level, $V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) = V^\circ_{\mathrm{Cl}^-} - (\mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}})/F$, a rung riding the ladder at a fixed distance below $V^\circ_{\mathrm{Cl}^-}$.

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

Now stick the two together: a hydrogen electrode on the left, a silver chloride electrode on the right, both dipping into the same dissolved $\mathrm{HCl}$. Each wire is pinned by its own couple, and the two standard rungs ride the same ladder at a fixed, tabulated spacing, so the cell voltage follows by subtracting the two readout forms. (For now we run everything ideal-dilute, each activity read as a plain concentration, $a_i = m_i/m^\circ$ and $a_{\mathrm{H_2}} = p_{\mathrm{H_2}}/p^\circ$; the real activities get their turn below.)

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-she-agcl-e.njk" %}
{% figcaption %}
The reference cell, electronic levels only (the ionic levels look as in the single-electrode figures above). Each wire rides its couple's implied dashed level, a Nernst concentration gap (↕ markers) away from the couple's standard rung, and the cell voltage readout is the wire-to-wire gap. Try the sliders: the left wire is our ground and holds still while the rungs (and the other wire) do the moving, the rungs' $0.222~\mathrm{V}$ spacing fixed.
{% endfigcaption %}
</figure>

The measured cell voltage comes out as
$$\begin{aligned}
\Delta V
& = V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) \\
& = E^\circ_{\mathrm{cell}} + \frac{RT}{F}\ln\!\bigg(\frac{\sqrt{p_{\mathrm{H_2}}/p^\circ}}{(m_{\mathrm{H}^+}/m^\circ)\,(m_{\mathrm{Cl}^-}/m^\circ)}\bigg),
\end{aligned}$$
with
$$
E^\circ_{\mathrm{cell}} = V^\circ_{\mathrm{e}^-}(\mathrm{Ag/AgCl}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE}) = 0.222~\mathrm{V},
$$
the familiar standard potential of the silver chloride electrode against the SHE, now visibly a gap between two standard rungs.

## The traditional picture and its limitations

The usual practice in electrochemistry is to put the standard hydrogen electrode (or some other standard reference) at 0 V, making the picture **solution-centered**:

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-she-agcl-trad.njk" %}
{% figcaption %}

The reference cell redrawn the traditional way: the axis reads electrode potential, $E^\circ(\mathrm{SHE})$ is pinned at $0$, the tabulated $E^\circ(\mathrm{Ag/AgCl})$ hangs at its fixed height, and each electrode reads off as its own $E$, a Nernst term (↕) from its couple's standard line. Same cell and sliders as the figure above, but the opposite answer to who moves when you drag them: there the grounded wire held still and the rungs rode; here the rungs are pinned and the $E$ levels ride. (The implied-level clutter is gone, too.)

{% endfigcaption %}
</figure>

It's such a simpler picture than all the floating $V_{\mathrm{e}^-}$ and $V^\circ_{\mathrm{e}^-}$ levels, so why am I overcomplicating things? Why do I keep choosing one of the $V_{\mathrm{e}^-}$ levels as zero instead?

In short, zeroing $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ only makes sense when you're talking about a single idealized cell. When you go add complications, $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ loses its firm grounding. We already saw one issue for cells under bias (in the [previous topic](../e/), the SHE had a gradient), but in the next two sections I want to show two of the complications that appear even in quiescent electrochemical cells: junctions (the SHE in every compartment is different) and nonideality (the SHE is only virtual anyway).

### The liquid junction potential

Real reference electrodes are usually kept in their own clean compartment and wired to the test solution through a porous frit or salt bridge; that means a junction, and a junction means a step. For a cell whose two half-cells are different solutions, the measured voltage splits as
$$
\begin{aligned}
\Delta V &= V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) \\
&= E(\text{right}) - E(\text{left}) + \mathrm{LJP},
\end{aligned}
$$
where the **liquid junction potential** is the step in the reference level across the junction, $\mathrm{LJP} = V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{right}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}, \text{left})$; that reference level is the local standard hydrogen level $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$, made explicit in the previous section.^[Expanding both $E$'s with the Nernst equation gives the full-cell form with the LJP carried along explicitly; the textbook version usually drops the LJP and the left/right labelling. How this three-way splitting fares in concentrated solutions is taken up below.] Whenever the $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ levels vary in space (across a junction, a Donnan membrane, or a cell polarized wall to wall like the [previous topic's](../e/) battery), "the SHE" itself varies from place to place.

Unlike the junction-free cells above, a junction is a *non-equilibrium* object, idling at a steady interdiffusion: no species' $V_i$ runs flat across it. Even so, the $V^\circ_i$ rungs step rigidly together across it, by the LJP, the $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ rung along with them, so the reference reads the test solution through exactly the $\mathrm{LJP}$ term above, a step that drifts with the very solution being measured. The figure draws this for a typical construction, the silver chloride electrode sitting in its own $3\ \mathrm{mol/L}$ KCl filling solution behind a porous frit.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-ref-junction.njk" %}
{% figcaption %}
How a reference electrode really attaches. The dashed line is the local $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$, one and the same line as $V^\circ_{\mathrm{H}^+}$, stepping at the frit by the LJP (try the slider: the step drifts with the test solution, and the Henderson estimate of the LJP is in the readout). The invading ions dive away as they dilute, $V_{\mathrm{H}^+}$ resurfacing at the filling solution's own pH-7 level. The lower panel shows the same junction in concentrations, chloride and potassium marching up together through the frit while the test acid hugs the floor; that chloride is what sets the dashed $V_{\mathrm{e}^-}(\mathrm{Ag/AgCl})$ line above for the electrode's electrons. The reference wire is our $0\ \mathrm{V}$; the drawn step is not to scale.
{% endfigcaption %}
</figure>

### Activities: who is moving?

Take activities seriously and the story splits into a reassuring half and an unsettling half.

The reassuring half belongs to the junction-free cell. Its voltage touches the ions only through the charge-neutral product $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, so nonideality enters as real, measurable physics with no convention in sight: run our reference cell across a range of $\mathrm{HCl}$ concentrations (this is the classic **Harned cell**, and it is exactly the cell drawn in the figure above, there in its ideal-dilute version) and the measured voltage peels away from the ideal-dilute prediction, the gap being exactly $\tfrac{2RT}{F}\ln\gamma_\pm$. A mean activity coefficient, read straight off a voltmeter. The same cell, extrapolated to the dilute limit where the single-ion ambiguity dies away, is how the standard levels get pinned down in the first place;^[Harned, H. S., & Ehlers, R. W. (1932). J. Am. Chem. Soc., 54, 1350, and Harned, H. S., & Ehlers, R. W. (1933). J. Am. Chem. Soc., 55, 2179 — the classic extrapolation; redone definitively in Bates, R. G., & Bower, V. E. (1954). [Standard potential of the silver-silver-chloride electrode from 0° to 95° C.](https://nvlpubs.nist.gov/nistpubs/jres/53/jresv53n5p283_A1b.pdf) J. Res. Natl. Bur. Stand., 53(5), 283–290.] any tabulated $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ is, in the end, a theoretical extrapolated level tied to the standard state of the aqueous proton.

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-harned-nonideal.njk" %}
{% figcaption %}

The Harned cell run nonideal ($p_{\mathrm{H_2}}$ now pinned at $1$ bar). Bottom: the measured cell voltage across concentration (the Pitzer fit for $\mathrm{HCl}$ standing in for measured points) peels away from the ideal-dilute Nernst prediction, the shaded gap being the mean-activity term $\tfrac{2RT}{F}\ln\gamma_\pm$; the dot rides at the concentration slider. Top: the same cell in levels, the left wire grounded, so the right wire's height *is* the plotted cell voltage. The split slider re-divides $\gamma_\pm$ between $\mathrm{H}^+$ and $\mathrm{Cl}^-$: only the rungs move, rigidly together, while every wire and the $\Delta V$ readout hold still.

{% endfigcaption %}
</figure>

The unsettling half is the split. The measured $\gamma_\pm$ is a property of the *pair*; divide it between $\mathrm{H}^+$ and $\mathrm{Cl}^-$ and no experiment can referee the division — the single-ion ambiguity of the [nonideal appendix](../nonideal/). A named convention (MacInnes, Bates–Guggenheim) is a rule that assigns a split smoothly across every composition, but the freedom underneath is pointwise: each solution's split is its own free choice. The figure's split slider exercises that freedom directly, exaggerated well past any published convention (the named ones stay within a few tens of millivolts of one another even at $4~\mathrm{mol/kg}$). Watch what moves when you drag it: not the wires, not the implied levels, not $\Delta V$ — only the rungs. Tradition puts this the other way around, saying the single-ion problem "contaminates" the electrode potentials; the diagram shows what that means. Each $E$ is a fine gap, but its lower edge, $V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$, is the conventional object, so $E(\text{left})$ and $E(\text{right})$ shift together with the split while the cell voltage, wire-to-wire, is agreed on by every convention.

Now put two solutions in play, joined by a junction or simply drawn side by side on one plot, and each carries its own ladder with its own independent split. The wires' $\Delta V$ stays fixed while the decomposition $E(\text{right}) - E(\text{left}) + \mathrm{LJP}$ shuffles underneath as the two choices change.^[The stakes are practical: the pH scale itself is defined through exactly this machinery (a Harned-cell measurement plus the Bates–Guggenheim convention to split off $a_{\mathrm{H}^+}$), so the most-measured quantity in chemistry carries a single-ion convention inside its definition.] The figure strips the junction construction down to its skeleton to show it: a hydrogen electrode in dilute $\mathrm{HCl}$ on the left, our $\mathrm{KCl}$-jacketed silver chloride reference on the right, and one free split per compartment.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-two-splits.njk" %}
{% figcaption %}

Two compartments, two free splits ($\mathrm{HCl}$ at $0.1~\mathrm{mol/kg}$, $\mathrm{KCl}$ at $3~\mathrm{mol/kg}$; sliders exaggerated as before). Each slider slides only its own solution's rungs, so the local SHEs are independently movable and the LJP, the rung step at the frit, is contaminated by both. The zero selector re-pins the drawing to any one level without changing a single gap. It starts on the traditional choice, SHE (left): drag the *left* slider and the entire rest of the universe, both wires and the other solution's rungs, moves to honor a bookkeeping choice. Pin the zero to a wire instead and each slider moves nothing but its own rungs.

{% endfigcaption %}
</figure>

So, which is moving? With two solutions there is only one tenable reading: the wires' $V_{\mathrm{e}^-}$ are the invariants, drawn before any convention is chosen, and "the SHE" is a rung that slides per solution at the whim of bookkeeping. The zero selector lets you try each reading: pin a wire and you have chosen an inertial frame, arbitrary but agreeing with every other such choice about what is moving; pin a local SHE and you are in a rotating frame, where the sweep of the whole sky is an artifact of your anchor. The circuit wins; of the two candidate zeros in the introduction, it is the humble electrical ground that holds firm, and when a reference must be picked, a wire is where to pin it. (Often none must be picked: stay in the $V_i$ and $V_{\mathrm{e}^-}$ levels themselves and every measurable quantity is already a gap, no zero assigned.) The solution-centered view survives in a more modest role, as a local convention: perfectly serviceable inside any one solution, with every cross-solution comparison quietly routed through an equally conventional LJP. The machinery of these conventions, and how far apart they land in practice, is the [nonideal appendix](../nonideal/)'s business.

## The "absolute" electrode potential

Could we sidestep all this by referencing to the vacuum instead, an "absolute" electrode potential? On a $V_i$ diagram the vacuum is just one more level, $\phi_{\mathrm{vac}} = V_{\mathrm{e}^-} - \Phi/e$, sitting $\Phi/e$ *below* the metal's electrons on this voltage axis (equivalently a work function $\Phi$ *above* them in electron energy, the step we drew for [capacitors](../capacitors/)). The widely-quoted "absolute" value of about $4.44~\mathrm{V}$ for the SHE is best read as an electrode's work function: a genuine *surface* property that drifts with preparation and contamination, not a cleaner fundamental reference, and the in-material $\phi$ it leans on is not well defined to begin with (the subject of [$\phi$ under the microscope](../phi/)). Even the number's pedigree is telling: the measurement chain beneath it had to exit the solution through a single-ion activity convention and a model of the water surface.^[The experimental backbone of the $4.44~\mathrm{V}$ (Farrell, J. R., & McTigue, P. (1982). [Precise compensating potential difference measurements with a voltaic cell: the surface potential of water.](https://doi.org/10.1016/0022-0728%2882%2985102-4) J. Electroanal. Chem., 139, 37–56) is a pair of voltaic cells that are our Harned cell sawed in half: each electrode faces a mercury-jet reference across a gas gap, and the two measured potential differences recombine into the Harned-cell voltage. Sawing the cell through vacuum splits the charge-neutral product $a_{\mathrm{H}^+}a_{\mathrm{Cl}^-}$, so the standard-state extrapolation must put single-ion numbers on the halves: Farrell & McTigue take $\gamma_{\mathrm{H}^+} = \gamma_{\mathrm{Cl}^-} = \gamma_\pm$ below $0.02~\mathrm{mol/kg}$ (Guggenheim's convention; the split sliders above sit at exactly this choice when centered), together with a fitted model of how dissolved ions disturb the water surface's dipole layer (putting the surface potential of pure water at $25 \pm 10~\mathrm{mV}$). Trasatti's recommendation is upfront about both: the determination of the standard Volta potential difference "necessarily involves&nbsp;… model assumptions," with "Guggenheim's convention for the activity coefficients of single ionic species" accepted (Trasatti, S. (1986). [The absolute electrode potential: an explanatory note.](https://doi.org/10.1351/pac198658070955) Pure Appl. Chem., 58(7), 955–966). In the dilute range used the choice costs well under a millivolt, buried beneath the $\pm 0.02~\mathrm{eV}$ on mercury's work function; the point is where the convention sits, not its size. The road from a solution out to vacuum passes through a single-ion split and a surface model, and there is no convention-free exit.] The vacuum offers no escape: it is one more floating level, handy for lining up work functions, not a universal zero. Where the $4.44~\mathrm{V}$ comes from, and what vacuum levels are honestly good for, is covered in [Vacuum levels](../vacuum/).

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-vac-she.njk" %}
{% figcaption %}

The "absolute" electrode potential on a $V_i$ diagram: $\phi_{\mathrm{vac}}$ just outside the cell sits $4.44~\mathrm{V}$ below the SHE rung, exactly as a work function sits below a metal's $V_{\mathrm{e}^-}$. One more floating level to line things up with, not a universal zero. (Drawn tilted because that is its natural state: stray fields and patchy surfaces bend a real vacuum level, and only careful compensation experiments iron it flat.)

{% endfigcaption %}
</figure>

## Takeaways

A reference electrode is a half-reaction kept reliably at equilibrium, pinning its wire at a known Nernst offset from a standard rung; a cell is two such electrodes, and a junction between them adds a liquid-junction step. The whole zoo of "potentials" (electrode potential, solution potential, cell voltage, liquid junction potential, the absolute reference) are particular gaps among the $V_{\mathrm{e}^-}$ and $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ levels, and the levels come in two kinds: wire levels, whose gaps a voltmeter delivers, and standard rungs, which sit wherever each solution's activity convention puts them. Anchoring everything to one rung works within a single solution; across solutions, only the circuit-centered quantities keep their meaning. The $V_i$ diagram shows all of them as the separate lines they always were.

[**NEXT TOPIC: Interface kinetics**](../kinetics/)
