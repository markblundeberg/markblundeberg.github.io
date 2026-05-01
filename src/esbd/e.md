---
layout: layouts/esbd_topic.njk
title: 'Electrode potential'
tags: [page, esbd_topic]
orderESBD: 33
---

# {{title}}

We now have the tools needed to precisely visualize the electrode potential $E$ in our $V_i$ diagrams, as well as related concepts like 'redox potential' $E_h$, 'equilibrium potential' $E_{\mathrm{eq}}$, and so on. Mathematically, these all have the form $ E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\text{ref}) $, and the various subtleties come about from how exactly we define these two terms.

To start let's illustrate the basic concept of the electrode potential at equilibrium, referenced to the standard hydrogen electrode (SHE):

<figure class="diagram-placeholder">
{% figcaption %}
- electrode and solution
- V_e in electrode same as V_e of some reaction
- also V^0_e of the reaction
- also plotted standard reference electrode level
- E plotted as a difference.
{% endfigcaption %}
</figure>

The above figure represents the expression for the standard straight forward definition of electrode potential, at least as I interpret the IUPAC definition:^[IUPAC Gold Book, ["electrode potential"](https://goldbook.iupac.org/terms/view/E01956)]

$$ E(\text{vs SHE}) = V_{\mathrm{e}^-}({\text{electrode}}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}). $$

One of the strengths of these $V_i$ diagrams is that they let us address both of these variables separately, and really visualize what is going on. And, one way to describe the benefits of working with $V_{\mathrm{e}^-}$ directly is that it is like working with $E$ but without having to worry about references.

## What is a standard reference electrode?

A standard reference electrode is a hypothetical ideal electrode which provides access to one of the $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ values.

Really, the goal of the reference electrode is an attempt to measure 'the potential' i.e. the electrostatic potential $\phi$, in the bulk of a solution. As discussed previously, $\phi$ is ill-defined and unmeasurable, but whatever value it has, we know it is anchored somewhere on the $V^\circ$ scale. And, if a reference electrode can access *any* of the $V^\circ_{\mathrm{e}^-}(\mathrm{rxn})$ levels, then this can be trivially converted to the common reference half-reaction of choice which is the standard hydrogen electrode, $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$.

Technically, these standard electrodes are only hypothetical, and consequently $E$ is not really measurable even at perfect equilibrium:

* Most seriously, the overall offset of the standard reference levels $V^\circ_{\mathrm{e}^-}$ suffers from the ion activity ambiguity problem in concentrated solutions (see [nonideality](../nonideal/) topic for details). So this limits the well-definedness of $E$ to solutions having infinitely dilute ions.
* For practical reasons of avoiding contamination, reference electrodes usually have to be connected via liquid junctions, which always have a liquid junction potential (a step in $V^\circ_{\mathrm{e}^-}$), which we'll talk more about below. There is no technique that can fully eliminate the liquid junction potential (and, this compounds with the previous issue: a zero liquid junction potential is only well defined for infinitely dilute solutions).

For precision electrochemistry these are major issues and (in my opinion) speaks to the notion of electrode potential being a technically awkward or flawed foundation. But for everyday approximate electrochemistry, these issues appear to not be a significant problem.

## The ordinary Nernst equation

The Nernst equation describes the electrode potential when the electrode is equilibrated against a specific half-reaction, generically "$\mathrm{Ox}/\mathrm{Red}$", which takes $z$ electrons. That is, $V_{\mathrm{e}^-} = V_{\mathrm{e}^-}(\text{electrode}) = V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$. On the last page we derived a floating Nernst equation for $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ which upon substitution yields the usual Nernst equation:

$$ E = E^\circ + \frac{RT}{zF} \ln\bigg(\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}\bigg), $$

and we see what exactly the $E$ and $E^\circ$ terms mean in the Nernst equation:

$$ E = V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}),$$

$$ E^\circ = V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}).$$

<figure class="diagram-placeholder">
{% figcaption %}
- Vertical energies diagram of Nernst equation?
{% endfigcaption %}
</figure>

Note the Nernst equation only holds locally, in solution: all these $V_{\mathrm{e}^-}$ and $V^\circ_{\mathrm{e}^-}$ values are evaluated at the same position.

## Cells and the liquid junction potential

Since an electrode potentials represents a specific half-reaction, they are always meant to be used in pairs to get a full reaction.

Let's consider the case of a standard aqueous electrochemical cell that contains a junction (not all cells contain junctions but they are normal), that is 'at equilibrium' where the left electrode is equilibrated with half-reaction $\mathrm{Ox1}/\mathrm{Red1}$ and the right electrode is equilibrated with half-reaction $\mathrm{Ox2}/\mathrm{Red2}$. The two compartments may differ in ion concentrations but they have the same solvent.

<figure class="diagram-placeholder">
{% figcaption %}
- Cell 'at equilibrium' with LJP.
- Ox1/Red1 and Ox2/Red2, both std and actual levels.
- SHE.
{% endfigcaption %}
</figure>

Here the overall voltage $\Delta V$ across the cell, also called "cell potential", is clearly:

$$ \Delta V = V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left})$$

First, let's convert that into half-reaction electrode potentials, where each electrode potential is defined according to its own compartment's SHE reference level:

$$
\begin{aligned}
\Delta V
& = \big(E(\text{right}) + V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}, \text{right})\big)  - \big(E(\text{left}) + V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}, \text{left}) \big) \\
& = E(\text{right}) - E(\text{left}) + \underbrace{\big( V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}, \text{right})  - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}, \text{left}) \big)}_{\text{liquid junction potential (LJP)}} \\
& = E(\text{right}) - E(\text{left}) + \mathrm{LJP}.
\end{aligned}
$$

And I just want to stop here to emphasize something, which is that in any case where $V^\circ_{\mathrm{e}^-}$ levels are varying with space (such as due to LJP, or Donnan equilibrium, or the non-equilibrium reasons as discussed below), then "the SHE" is also varying with space.

One may also expand out $E(\text{right})$ and $E(\text{left})$ using the Nernst equations to get the full reaction form of the Nernst equation (including LJP).[^longnernstnote]
There are two ways to interpret this cell $\Delta V$: a physicist or electrical engineer sees the electrodes' $V_{\mathrm{e}^-}$ as reservoirs and the chemical reaction acts like a generic 'pump' or net {% wiki "electromotive force" %}, which can be coupled to an arbitrary external circuit; a chemist however focusses on the chemical change of state with Gibbs free energy change of $\Delta V$ for each unit of charge that is reversibly transferred through the device, i.e., $\Delta G = -z F \Delta V$ for $z$ moles of electrons transferred. These two views agree and both are valid.

[^longnernstnote]:
    Expanding our cell potential using the Nernst equation we have:
    $$ \Delta V = \mathrm{LJP} + E^\circ_{\mathrm{Ox2}/\mathrm{Red2}} - E^\circ_{\mathrm{Ox1}/\mathrm{Red1}} + \frac{RT}{F} \ln\bigg(\frac{(a_{\mathrm{Ox2}}(\text{right}))^{1/z_2}(a_{\mathrm{Red1}}(\text{left}))^{1/z_1}}{(a_{\mathrm{Red2}}(\text{right}))^{1/z_2}(a_{\mathrm{Ox1}}(\text{left}))^{1/z_1}}\bigg). $$
{#    which corresponds to the following full reaction that (reacting forward) transfers an electron from the left to the right electrode.
    $$ \tfrac{1}{z_1}\mathrm{Ox1}(\text{left}) + \tfrac{1}{z_2}\mathrm{Red2}(\text{right}) + \mathrm{e}^-(\mathrm{left~electrode}) \rightleftharpoons \tfrac{1}{z_1}\mathrm{Red1}(\text{left}) + \tfrac{1}{z_2}\mathrm{Ox2}(\text{right}) + \mathrm{e}^-(\mathrm{right~electrode}) .$$ #}
    This expression is often presented in a far simpler form without a liquid junction and without all the left/right labelling, however I thought it was worthwhile to show the general case.
    {# pbreak #}
    In regards to the ion activity ambiguity in concentrated solutions, note that only $\Delta V$ is unambiguous, while both $\mathrm{LJP}$ and the activity term are ambiguous, because the left and right half-cells have different concentrations and thus distinct activity ambiguities. Note that the ratio of activities is charge-neutral yet it is ambiguous; this demonstrates why a charge-neutral activity ratio is only unambigous if all sampled in the same solution!



## What about out-of-equilibrium cases?

If electrode potential is of the form $ E = V_{\mathrm{e}^-} - V^\circ_{\mathrm{e}^-}(\text{ref}) $, then what happens if the first term $V_{\mathrm{e}^-}$ is varying in space? What if the reference $V^\circ_{\mathrm{e}^-}(\text{ref})$ varies? There is an excellent article by Boettcher et al. about these distinctions,^[Boettcher, S. W., Oener, S. Z., Lonergan, M. C., Surendranath, Y., Ardo, S., Brozek, C., & Kempler, P. A. (2020). [Potentially Confusing: Potentials in Electrochemistry.](https://doi.org/10.1021/acsenergylett.0c02443) ACS Energy Letters, 6(1), 261–266.] and I'd like to give my own take (in terms of the $V_i$).

Working vs equilibrium $E$: the split at the electrode. Activation overpotential.

<figure class="diagram-placeholder">
{% figcaption %}
- As before but split V_e
{% endfigcaption %}
</figure>

But also in general there will be gradients inside the solution. So beyond just the 

<figure class="diagram-placeholder">
{% figcaption %}
- Illustration of general variations both V_i and V^0.
{% endfigcaption %}
</figure>

These gradients are quite real: The V_e of the active reaction can actually be measured by a second micro electrode of the same type, while V^0 is supposed to be accessible (assuming junction potentials can be minimized) via Luggin capillary.

Practically, variation in V^0 levels can be suppressed by having a dominant and reasonably well mixed supporting electrolyte, in which case the V_e of the active reaction will vary due to concentration gradients, which is supposed to be simpler to analyze.



Another thing that happens at equilibrium is multiple electrode reactions occuring at the same time. Each half-reaction has a distinct $E_{eq}$ that is distinct from the electrode $E$. (And of course half-reactions can directly equilibrate with each other, no electrode needed.) Mixed potentials.

<figure class="diagram-placeholder">
{% figcaption %}
- multiple reactions equilibrated
{% endfigcaption %}
</figure>






### Overpotential

This is tightly coupled to the problem of defining 'overpotential' $\eta$, which measures the deviation of $E$ from its equilibrium value $E_{\mathrm{eq}}$:
$$ \eta = E - E_{\mathrm{eq}} . $$
The reference point for $E_{\mathrm{eq}}$ needs to be the same as for $E$, which generally means it is either at the surface or it is bulk (ohmic-corrected). But having the same reference point means overpotential is just "the drop in $V_{\mathrm{e}^-}$":
$$ \eta = V_{\mathrm{e}^-}(\mathrm{electrode}) - V_{\mathrm{e}^-}(\mathrm{eq}) . $$

With $E_{\mathrm{eq}}$ (and $V_{\mathrm{e}^-}(\mathrm{eq})$) we still have the question of whether we are measuring 1) at the surface or 2) the bulk (ohmic-corrected). But additionally to that, there are subtleties about what "eq" even is.

But, it depends very much where you define the start and endpoint of the drop. The partitioning of overpotentials into different mechanisms can be ambiguous.^[Seidenberg, J. R., Mitsos, A., & Bongartz, D. (2025). [Interpreting Concentration and Activation Overpotentials in Electrochemical Systems: A Critical Discussion. Journal of The Electrochemical Society](https://doi.org/10.1149/1945-7111/adc76c), 172(4), 043506.]

The "surface overpotential" $\eta_s$ is generally defined as the sudden drop across the interface, i.e. the drop from $V_{\mathrm{e}^-}(\mathrm{electrode})$ to $V_{\mathrm{e}^-}(\mathrm{eq})$.^[Newman & Balsara (2005), *Electrochemical Systems*. Chapter 8 "Electrode Kinetics".] However even $V_{\mathrm{e}^-}(\mathrm{eq})$ is slightly open to interpretation since 1) we can change which half-reaction we say is occuring at the surface (I.e. for copper deplating is it the more microscopically realistic $\mathrm{Cu} \rightarrow \mathrm{Cu}^+ + \mathrm{e}^-$ or the overall $\mathrm{Cu} \rightarrow \mathrm{Cu}^{2+} + 2\mathrm{e}^-$?); 2) we may choose activities for $V_{\mathrm{e}^-}(\mathrm{eq})$ that do not respect the actual activities present (e.g. in a gas evolution reation we may put "1 atm" for the gas pressure even though it may be supersaturated to the level of 100 atm).

I believe that diagrams of $V_{\mathrm{e}^-}$ like the above can help clear up this issue a great deal.





{# 

The bulk non-flatness of the potential $\phi$ in solution, as evident by the variations in $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$, seems to be treated as a nuisance that can be experimentally eliminated by subtracting off a background ohmic resistance; in the Bard & Faulkner book, they distinguish the overall cell voltage $E_{\mathrm{appl}}$ from an 'ideal $E$'.^[Bard & Faulkner *Electrochemical Methods*. See 1.5 "Cell Resistance and the Measurement of Potential" and 4.3 "Mixed Migration and Diffusion Near an Active Electrode"] Alternatively, experiments can be modified by adding a supporting electrolyte which suppresses the variations in $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$.

In effect the approach of Bard & Faulkner is to extrapolate $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$

#}

