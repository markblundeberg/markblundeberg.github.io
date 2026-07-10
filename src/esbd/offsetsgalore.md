---
layout: layouts/esbd_topic.njk
title: 'Offsets galore'
tags: [page, esbd_topic]
orderESBD: 80.5
---

# {{title}}

Every time you draw an ESBD you are forced, somewhere, to fix a zero. The big easy one is the global float, the single overall level the whole diagram is free to slide.
In the [previous topic](../muintro/) we derived this one thermodynamically. But that is not the only arbitrary choice lurking in the framework. There are chemical conventions, single-ion activity conventions, and the inner potential $\phi$ of every phase, which no ion can measure. It is easy to lose track of which of these actually move something and which are pure bookkeeping.

So here is a sandbox, and I'm going to throw all of them in at once. The following band diagram shows a **fixed physical situation**, together with sliders that control our various *arbitrary conventions / interpretations* of the situation. It looks like a lot, but just play with it.

<figure class="demo-container" style="max-width: 500px">
{% include "esbd-diagrams/esbd-offsets-galore.njk" %}
</figure>

In detail: five regions sit side by side: two aqueous solutions (an acid and a base) flanking a metal electrode, then — across a vacuum gap, so no junction is implied — a third solution in a different solvent, a lithium salt in an organic electrolyte. Every *kind* of arbitrary choice in the picture is wired to a slider (the elemental references are represented by hydrogen and lithium; oxygen's would act just the same). Drag them and watch what moves. Again: *none of these sliders is changing anything of physical meaning: the ion concentrations are fixed; all charges and measurable potential differences are fixed*.

Note: the potentials and slider magnitudes shown are not to scale or realistic; the point is just to show the effects. Give yourself a minute with it before reading on, to tell apart the sliders that actually move something from the ones that are pure bookkeeping.

## Kinds of knobs

The **global float** is the one from the [last topic](../muintro/): it shifts everything by the same amount, not just $V_i$ but also $\phi$. It is the real global gauge freedom of the diagram.

The **elemental references** such as $\mu^*_{\mathrm{H}}$ (per atom, $=\tfrac12\mu^*_{\mathrm{H_2}}$) and $\mu^*_{\mathrm{Li}}$ are the chemical potential of pure elements in their reference states (298 K, 1 bar, etc.). As can be seen, these affect all ionic $V_i$ and $V^\circ_i$ for ions that include the element in question. Note that changes in these sliders also affect neutral matter (not shown), for example the chemical potential of pure water in our conditions would be $\mu_{\mathrm{H_2 O}} = 2\mu^*_{\mathrm{H}} + \mu^*_{\mathrm{O}} - 237.14~\mathrm{kJ/mol}$. As I mentioned early on, the usual choice (and my preference) is simply $\mu^*_i = 0$ for all elements in their pure reference states, because that makes the chemical potentials for all neutral species coincide with their Gibbs formation energies, e.g. simply $\mu_{\mathrm{H_2 O}} = \Delta G_{f,\mathrm{H_2 O}} = - 237.14~\mathrm{kJ/mol}$.

The **$\phi$ convention** determines where $\phi$ sits relative to the $V^\circ_i$ ladder. This is a choice you can make per solvent. Recall we have
$$ \bar\mu_i = \underbrace{\left[\, z_i F \phi + \mu^\circ_{\mathrm{int},i} \,\right]}_{=\; z_i F V^\circ_i} + \big[\, RT \ln a_i \,\big]. $$
and so this convention amounts to a redistribution of 'extrinsic' electrostatic energy ($z_i F \phi$) back and forth with the 'intrinsic' ionic standard states $\mu^\circ_{\mathrm{int},i}$ (but leaving $V^\circ_i$ unchanged). Each solvent has its own fixed $\mu^\circ_{\mathrm{int},i}$ system, which is why you can independently choose $\phi$ for water and for the other solvent (EC, ethylene carbonate, in this case).

The **activity conventions** are the most fine-grained, very much local in effect. These apply to any solution which is away from ideal-dilute behaviour, and in terms of the above equation now amount to a *redistribution of activity-energy between different ions in the same place*. We will discuss this more in [next topic, on nonideality](../nonideal/), but as you can see with the slider, it affects all $V^\circ$ levels and $\phi$ as well. This is not just per-solvent but **per-solution** (i.e. if you change the solute concentrations, you get to choose a whole new activity coefficient).

## Consequences

First, the global float means that there is no meaningful absolute voltage. Only voltage differences matter, but as can be seen, some voltage differences also suffer from a loss of physical meaning. I'm going to highlight some of the crucial ones.

$V_i - V_j$: we have been prizing the physical meaning of $V_i$ differences, but I hope the above figure makes abundantly clear the one gotcha: these depend on the elemental chemical potential conventions, which are not necessarily universal. Nonetheless these conventions are applied in a globally consistent way over the whole band diagram, across all materials. This means same-ion differences are always well defined: e.g., $V_{\mathrm{Li}^+}(x) - V_{\mathrm{Li}^+}(y)$ is well defined if you are comparing very distant locations, different solvents, or whatever. This is the real beauty of $V_i$: **each species' global $V_i(x)$ trace has an unambiguous physical shape, no matter how complicated the situation**.[^extraEMF]

[^extraEMF]:
    That said, some "extra EMF" drive forces can introduce ambiguity, notably
    * electromagnetic induction (the extra $\partial A / \partial t$ that drives charges along with $-\nabla V_i$) can be redistributed around a circuit according to the electromagnetic gauge freedom, so gauge changes redefine the $V_i$ landscape, and,
    * thermoelectric gradients and $V_i$ differences between bodies of different temperatures are only unambiguous if you carefully enforce the third law of thermodynamics, which e.g. requires you to use a consistent {% wiki "Seebeck coefficient", "absolute Seebeck coefficient" %} scale across electrons and all charge carriers.

$V^\circ_i(x) - V^\circ_j(y)$: these differences suffer the same (mild) global chemical convention. But now also it is sensitive to the activity conventions used at locations $x$ and $y$. This means even a same-ion $V^\circ_i(x) - V^\circ_i(y)$ is only unambiguous when the two solutions are either ideal-dilute or compositionally identical. Besides the chemical potential convention though, the structure of the $V^\circ_i$ ladder at one place is a well defined physical property of the solvent.

$\phi(x) - \phi(y)$: this is the famous **{% wiki "Galvani_potential", "Galvani potential difference" %}** — or, in the special case that $x$ and $y$ sit across a diffusing junction between two solutions, the **liquid junction potential**. This difference is independent of our chemical potential conventions but it depends on everything else: most importantly each material can have its own $\phi$ choice, which immediately rules out any meaningful liquid junction potential ($\phi$ difference) between different solvents. But, even between two solutions of the same solvent (where $\phi(x) - \phi(y) = V^\circ_i(x) - V^\circ_i(y)$ for all $i$), this difference is still not always physically meaningful because the activity convention appears as well.

$V_{\mathrm{e}^-}$ and $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ and $\phi_{\mathrm{vac}}$: curiously, these are unaffected by anything but the global offset. So, for example at a metal surface, $V_{\mathrm{e}^-} - \phi_{\mathrm{vac}}$ is well defined (relating to work function). But why are electrons and the vacuum special? Why no electron chemical offset or 'vacuum solvent' offset? In fact, there is a convention here too, but it is an extremely universal and innocent one: declaring the energy of an electron at rest in vacuum to be $E_{\mathrm{e^-}}(x) = -e\phi_{\mathrm{vac}}(x)$.^[Deviating from this electron energy convention would alter the value of all {% wiki "Work function", "work functions" %}, and alter the law of thermal electron emission, and probably many other things too. But it would be self-consistent. Interestingly in the field of gas-phase ionization, some folk do effectively adopt an alternative convention here (see [NIST Chemistry WebBook "Gas-Phase Ion Thermochemistry", § Thermochemical Conventions for the Electron](https://webbook.nist.gov/chemistry/ion/#TC)), which I suspect amounts to defining a $V^\circ_{\mathrm{e}^-}$ and $V^\circ_i$ in vacuum, as if ions and electrons can be ideal-dilute 'vacuum solutes' that can be extrapolated up to concentration $c^\circ = 1~\mathrm{mol/L}$. Also note: we can't similarly demand that $E_{\mathrm{ion}} = z_{\mathrm{ion}} e\phi_{\mathrm{vac}}$ because it would conflict with our elemental chemical potential conventions, and anyway you couldn't really make this true for all ions because of molecular ion binding energies. The per-ion vacuum rungs drawn in [Vacuum levels](../vacuum/) are exactly such gas-phase standard-state levels.] So, no slider for this convention (vacuum levels get [a topic of their own](../vacuum/)).

## The tally

The knobs above are not equally guilty. The float and the elemental references are *global*: chosen once, applied consistently across the whole diagram, cancelling out of every same-species comparison — a reference frame, not an ambiguity. The knobs that actually poison comparisons are the *local* ones, the ones that proliferate: the activity convention (one per solution; per composition, even) and the $\phi$ convention (one per solvent). The scoreboard:

| Quantity | Global frame | Local conventions |
| --- | --- | --- |
| $\phi$ | float | **2**: activity convention + $\phi$-seat |
| $V^\circ_i$ | float + elemental refs | **1**: activity convention |
| $a_i$ | none | **1**: activity convention |
| $V_i$ (an ion) | float + elemental refs | **0** |
| $V_{\mathrm{e}^-}$ | float | **0** |
| same-ion $V_i(x) - V_i(y)$, mean activities | none | **0** |

Read down the local column first: it counts the arbitrary choices that can differ between here and there, and that is the count that matters. By this measure the real rival of $V_i$ is not $\phi$ ($\phi$ simply loses) but the activity $a_i$: a pure dimensionless number, immune to the float, the elemental references, and the $\phi$-seat alike. That global cleanliness is the traditional framework's genuine pride, and it was bought at a price: one local convention, of the severe per-composition kind. The species voltage makes precisely the opposite trade. It accepts the global covariance (a band diagram was never embarrassed to float) and carries no local convention at all. $\phi$ makes both sacrifices and collects neither prize.

The $V_{\mathrm{e}^-}$ row is the Fermi level's quiet privilege: by the bolted-down electron convention above, it drags no elemental reference, which threatens to demote the ionic $V_i$ to second-class citizens. It shouldn't: there is enough freedom in the elemental references to crown any species you like,^[The NIST gas-phase electron conventions mentioned above are a move of exactly this kind, re-seating the electron itself.] and the electron wears the crown only because its convention is the one everybody happens to share.

## Takeaways

Choices, choices! It's complicated, but that is just how electrochemical thermodynamics is. In the pure mathematical thermodynamics, we don't have to make these choices, and we can keep everything expressed in covariant/convention-free terms. But when we do visualizations, we do have to decide.

In the next topic we'll discuss the activity convention aspect in much more detail: the slider aspect, and things like mean activities.

[**NEXT TOPIC: Non-ideal solutions**](../nonideal/)
