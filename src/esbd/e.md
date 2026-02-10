---
layout: layouts/esbd_topic.njk
title: 'Electrode potential'
tags: [page, esbd_topic]
orderESBD: 33
---

# {{title}}

In classic electrochemistry, we see the symbol $E$ thrown around everywhere. What does this represent? What is an electrode potential? What about the 'redox potential' $E_h$, etc.? In short, $E$ values are $V_{\mathrm{e}^-}$ values (i.e. electronic electrochemical potentials) measured against a reference:^[Boettcher, S. W., Oener, S. Z., Lonergan, M. C., Surendranath, Y., Ardo, S., Brozek, C., & Kempler, P. A. (2020). [Potentially Confusing: Potentials in Electrochemistry.](https://doi.org/10.1021/acsenergylett.0c02443) ACS Energy Letters, 6(1), 261–266.]

$$ E = V_{\mathrm{e}^-}(\text{something}) - V_{\mathrm{e}^-}(\text{reference, somewhere}). $$

A lot of confusion can arise over "something" and "reference" and "somewhere".

To be clear, IUPAC only defines electrode potential as:^[Gold Book, ["electrode potential"](https://goldbook.iupac.org/terms/view/E01956)]

> Electromotive force of a cell in which the electrode on the left is a standard hydrogen electrode and the electrode on the right is the electrode in question.

Here "Electromotive force" is officially defined to mean a difference in $\phi$ between the ends, specifically it is the cell potential at equilibrium conditions. But as we've seen, cell potential is better expressed as a difference in $V_{\mathrm{e}^-}$, which is more explicit than a difference in $\phi$.^[The "difference in $\phi$" can be interpreted in two ways: 1) Some electrochemists define $\phi$ in metals to simply equal $V_{\mathrm{e}^-}$. 2) Otherwise, we 'bookend' the device with two metals of the same composition, e.g. copper wires, in which case $\phi_{\mathrm{Cu}}(1) - \phi_{\mathrm{Cu}}(2) = V_{\mathrm{e}^-}(1) - V_{\mathrm{e}^-}(2)$.] And so we can write:

$$ E = V_{\mathrm{e}^-}(\text{electrode}) - V_{\mathrm{e}^-}(\text{SHE}), $$

where SHE is the **standard hydrogen electrode**. But then, what actually is a "standard hydrogen electrode"? Again there is some heavy lifting behind the scenes. The standard hydrogen electrode is an idealization that is basically supposed to access what the output of the $\mathrm{H}^+ / \mathrm{H_2}$ redox couple *would be* under unit activities, but with the same solution potential. Based on the last topic, we see this means: $V_{\mathrm{e}^-}(\text{SHE}) = V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$.

And so, electrode potential can be explicitly written as:

$$ E = V_{\mathrm{e}^-}(\text{electrode}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}), $$

where the electrode is equilibrated with the solution and $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$ is uniform in the solution.

## The ordinary Nernst equation

We can take the floating Nernst equation from the last topic and now transform it into the regular Nernst equation, to provide some clarity. The Nernst equation describes the electrode potential when that electrode is equilibrated against a specific half-reaction $\mathrm{Ox}/\mathrm{Red}$ with $z$ electrons. That is, $V_{\mathrm{e}^-}(\text{electrode}) = V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$:

$$\begin{aligned}
E
&\equiv V_{\mathrm{e}^-}(\text{electrode}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}) \\
&= V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}), \\
&= V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) + \frac{RT}{zF} \ln\bigg(\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}\bigg) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}), \\
&= E^\circ(\mathrm{Ox}/\mathrm{Red}) + \frac{RT}{zF} \ln\bigg(\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}\bigg), \\
\end{aligned}$$
where we define
$$ E^\circ(\mathrm{Ox}/\mathrm{Red}) = V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2}).$$
The above equation is precisely the ordinary {% wiki "Nernst equation" %} for a half-reaction.

## The standard picture of electrochemistry

<figure class="diagram-placeholder">
{% figcaption %}
- Y axis "E"
- SHE at 0
- Generic cell with SHE on left hand side
- Junction with LJP.
{% endfigcaption %}
</figure>

Why this works: $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$ is flat throughout the solution bulk.


<figure class="diagram-placeholder">
{% figcaption %}
- Y axis "E"
- SHE at 0
- Generic cell 
- No junction
{% endfigcaption %}
</figure>

$$ E_{\mathrm{cell}} = E_2 - E_1 $$


It's worth noting the exact location of $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$ is somewhat ambiguous when it comes to nonideal solutions. 

## Electrode potential out of equilibrium

When an electrode is not simply in equilibrium, then what does "electrode potential" even mean? The answer is not always clear.

$$ E = V_{\mathrm{e}^-}(\text{something}) - V_{\mathrm{e}^-}(\text{reference, somewhere}). $$

### Reduction potential vs electrode potential

The first thing we need to clear up is the "something": is it the $V_{\mathrm{e}^-}$ in the electrode or is it the $V_{\mathrm{e}^-}$ of a reaction?

If it's a reaction, then what we're really defining is a **reduction potential**.

$$ E_{\mathrm{h}} = V_{\mathrm{e}^-}(x, \mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(x, \mathrm{H}^+ / \mathrm{H_2}) $$

This is a local difference, based on local reactant activities. And it's simply the output of the Nernst equation for that reaction.

But for an electrode potential, clearly we want "something" to mean the electrode, so we have:

$$ E = V_{\mathrm{e}^-}(\text{electrode}) - V_{\mathrm{e}^-}(\text{reference, somewhere}). $$

### Where is the reference?

The real ambiguity about electrode potentials has to do with the reference.

* Operationally, we can define $V_{\mathrm{e}^-}(\text{reference, somewhere})$ as literally the output of a third reference electrode placed in solution.
* In analytical electrochemistry where there is a homogeneous bulk solution, we can define $V_{\mathrm{e}^-}(\text{reference, somewhere})$ to correct for a long-range ohmic drop.^[This definition is used in Bard & Faulkner *Electrochemical Methods*. See 1.5 "Cell Resistance and the Measurement of Potential".] This is a useful operational definition for studies of 
* In battery simulations we may not have any homogeneous bulk, and so electrode potential may be instead defined on the local mass concentrations.
* In fundamental microscopic studies of interface kinetics, we want to use an imaginary reference right next to the electrode, at the innermost part of the electric double layer. This will give us the most 'real' representation of the interface based on the very local ion concentrations, and is the basis of the Frumkin effect.

<figure class="diagram-placeholder">
{% figcaption %}
- Zoom on electrode showing  electrode, DL, mass transfer (diffusion), bulk regions
- Ve(electrode) flat
- Ve(rxn) has exp drop through diffusion layer then slope in bulk.
- Ve0(ref) has spike in DL, gentle exp drop through diffusion layer, then slope in bulk.
- Also need to plot straight line for bulk extrapolation.
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




The second thing we need to clear up is the "reference, somewhere", and this is more serious.

* What if the electrode does *not* couple to a specific half-reaction?
* What if the electrode is driven out of equilibrium?
* What if the reference $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$ is not flat?

Now, to define an "$E$" we have to be very particular about what we are measuring, and against exactly what. A fantastic paper by Boettcher et al., ["Potentially Confusing: Potentials in Electrochemistry"](https://doi.org/10.1021/acsenergylett.0c02443) notes that there are many confusing aspects of what these "$E$" values might be.





To illustrate, consider the following cell:

<figure class="diagram-placeholder">
{% figcaption %}
- A driven cell
- Overpotentials at ends
- Gradient in SHE
- LJP
{% endfigcaption %}
</figure>

First of all it is helpful to carry over the result of the Nernst equation. The **reduction potential**, $E_{\mathrm{h}} = V_{\mathrm{e}^-}(x, \mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(x, \mathrm{H}^+ / \mathrm{H_2})$, is a locally-referenced $E$ defined for all $x$ in solution. This is simply the output of the Nernst equation based on the local activities of reactants. If the solution has a nice homogeneous, well defined bulk, the value of $E_{\mathrm{h}}$ in the bulk is called $E_{\mathrm{eq}}$.

## Where is the reference


   This is 
* **Working potential**, $ E = V_{\mathrm{e}^-}(\mathrm{electrode}) - V^\circ_{\mathrm{e}^-}(\mathrm{bulk}, \mathrm{H}^+ / \mathrm{H_2}) $

    While $E$ $V^\circ_{\mathrm{e}^-}(\mathrm{bulk}, \mathrm{H}^+ / \mathrm{H_2})$... a few options
    * The SHE as obtained from a third electrode. This is fairly concrete, 
    * The local SHE just 

| Symbol | Name | Referent | Reference place |
| --- | --- | --- | --- |
| $E$ | Working | $V_{\mathrm{e}^-}$ of electrode | Bulk solution next to electrode |
| $E$ | Working | $V_{\mathrm{e}^-}$ of electrode | Reference electrode |
| $E$ | Working | $V_{\mathrm{e}^-}$ of electrode | Reference electrode |
| $E_h$ | Reduction potential | $V_{\mathrm{e}^-}$ of solution | local |
| $E_h$ | Reduction potential | $V_{\mathrm{e}^-}$ of specific half-reaction | local |

What happens when the cell is *not* equilibrated?


'Non-ohmic' SHE reference (electrode kinetics)

When studying the kinetics of electrodes, it is desirable to separate out the 'overpotential' into several terms.
In Bard & Faulkner, 


The bulk non-flatness of the potential $\phi$ in solution, as evident by the variations in $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$, seems to be treated as a nuisance that can be experimentally eliminated by subtracting off a background ohmic resistance; in the Bard & Faulkner book, they distinguish the overall cell voltage $E_{\mathrm{appl}}$ from an 'ideal $E$'.^[Bard & Faulkner *Electrochemical Methods*. See 1.5 "Cell Resistance and the Measurement of Potential" and 4.3 "Mixed Migration and Diffusion Near an Active Electrode"] Alternatively, experiments can be modified by adding a supporting electrolyte which suppresses the variations in $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$.

In effect the approach of Bard & Faulkner is to extrapolate $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+ / \mathrm{H_2})$

## Overpotential

Allocation of non-ohmic part can be ambiguous
https://iopscience.iop.org/article/10.1149/1945-7111/adc76c


## Where is the reference?




But 

But how does that generalize?

We see then that $E$ is just 

* I've seen electrode potential defined as .

Alternative seen sometimes:

$$ E = V_{\mathrm{e}^-}(\text{electrode}) - \phi(\text{solution}) $$




## What is a reference

- junction

- usually: an actual electrode with $V_{\mathrm{e}^-}$ that has algorithm to estimate $V^\circ_{\mathrm{e}^-}(\text{SHE})$
    - LJP estimate
    - 

## Electrode potential out of equilibrium

#}