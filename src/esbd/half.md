---
layout: layouts/esbd_topic.njk
title: 'Half-reactions'
tags: [page, esbd_topic]
orderESBD: 31
---

# {{title}}

In this topic and the next few topics we're going to explore the $V_i$ world visualization of concepts like "electrode potential", "redox potential", "standard hydrogen electrode", and so on. These are all built around electron transfer, aka "redox".

The general idea of redox chemistry is considering **half-reactions** of the following generic form:
$$ \mathrm{Ox} + z\mathrm{e}^- \rightleftharpoons \mathrm{Red} $$

I.e. we consider $z$ electrons transferred onto an oxidized species $\mathrm{Ox}$ to become a reduced species $\mathrm{Red}$ (note the charges satisfy $z_{\mathrm{Ox}} - z = z_{\mathrm{Red}}$). 

A half-reaction can't happen on its own since the solvent generally doesn't contain a population of free electrons: for a half-reaction to move forward, the electron has to be taken from an electrode or another half-reaction, and likewise for the reaction to move backward it needs to find somewhere to give away its electron.

In terms of electrochemical potentials, this defines an electrochemical potential of electrons by equilibrium:

$$ \bar\mu_{\mathrm{Ox}} + z \bar\mu_{\mathrm{e}^-} = \bar\mu_{\mathrm{Red}}, $$

which in our $V_i$ terms becomes

$$ V_{\mathrm{e}^-} = \frac{\bar\mu_{\mathrm{Ox}} - \bar\mu_{\mathrm{Red}}}{zF}. $$

(we're describing $\mathrm{Ox}$ and $\mathrm{Red}$ with electrochemical potentials for now, instead of converting them to $V_i$, because one of them might be an uncharged species)

Previously (in the [Equilibrium](../equilibrium/) topic), we associated this $V_{\mathrm{e}^-}$ with an electrode. That is, we talked about what happens when such a half-reaction is exchanging its electrons with an electrode, and so at equilibrium this reaction $V_{\mathrm{e}^-}$ equalizes with the  $V_{\mathrm{e}^-}$ in the electrode. But now we'll take a different point of view: The central premise of redox chemistry is that yes, it is useful to talk about the reaction $V_{\mathrm{e}^-}$ even when there is no equilibrated electrode nearby.

## Implied $V_{\mathrm{e}^-}$ of a reaction

In the absence of an equilibrated electrode, it is indeed useful to calculate this $V_{\mathrm{e}^-}$ as an "implied" voltage, representing the a real thermodynamic availability of electrons even though no electrons roam freely in solution. For clarity, we write these implied values as $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ since they are specific to a certain reaction. This implied $V_{\mathrm{e}^-}$ value is useful in the following ways:

1. *In-solution coupling between different half-reactions*
   $$V_{\mathrm{e}^-}(\mathrm{\mathrm{Ox1}/\mathrm{Red1}}) \rightleftharpoons V_{\mathrm{e}^-}(\mathrm{\mathrm{Ox2}/\mathrm{Red2}})$$
    * A solution may have multiple available half-reactions.
    * All half-reactions are thermodynamically driven to equalize their $V_{\mathrm{e}^-}$ values by directly exchanging electrons with each other ('electron transfer reactions'), even in the absence of an electrode. But, electron transfer can be kinetically slow, in which case it is valuable to distinguish multiple $V_{\mathrm{e}^-}$. (for example, natural ground water is notoriously redox disequilibrated^[Lindberg, R. D., & Runnells, D. D. (1984). [Ground Water Redox Reactions: An Analysis of Equilibrium State Applied to Eh Measurements and Geochemical Modeling](https://doi.org/10.1126/science.225.4665.925). Science, 225(4665), 925–927.])
    * Where there is no electrode, electron transfer between two species can be described in terms of a mismatch in their half-reactions' $V_{\mathrm{e}^-}$ values.

2. *Coupling between half-reactions and an electrode*
    $$V_{\mathrm{e}^-}(\mathrm{metal}) \rightleftharpoons V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$$
    * A simple electrode should couple to one half-reaction, but equalization of $V_{\mathrm{e}^-}$ only occurs when the electrode has no current. At driven electrodes (with nonzero current) we can describe overpotentials at the interface as a step between $V_{\mathrm{e}^-}$ in the electrode and the equilibrium $V_{\mathrm{e}^-}$ implied by its ideal reaction.
    * Real electrodes may couple to more than one half-reaction, giving 'mixed potentials'.^[IUPAC Gold Book ["mixed potential"](https://goldbook.iupac.org/terms/view/M03944.html)]

On our diagrams we will depict these implied levels as dashed lines, inside the solution.

<figure class="diagram-placeholder">
{% figcaption %}
TODO: Abstract figure showing how implied levels look
- Left: metal, one Ve
- Right: solution multiple Ve implied

Abstract diagram showing the appearance of implied $V_{\mathrm{e}^-}$ levels: dashed lines with electron blue color. In this case, the redox levels in solution are disequilibrated with the each other and the electrode, perhaps due to slow kinetics.
{% endfigcaption %}
</figure>

The idea that a solution can have an implied electronic $V_{\mathrm{e}^-}$ (or $\bar\mu_{\mathrm{e}^-}$) is not at all new. This is often called a 'redox Fermi level' and what's attractive about it is that $\bar\mu_{\mathrm{e}^-}$ can be directly plotted on a traditional electronic energy band diagram. However, I've found that past visualizations can be a bit confusing,^[Redox band diagrams are often special-cased to equilibrium situations, in a way that degrades intuition in terms of understanding out-of-equilibrium. My goal is to 1) discourage the casual referencing to 'the vacuum' or 'the SHE' since in real devices these references vary from place to place, i.e. to 2) promote proper covariant/"reference-free" style band diagrams, and 3) emphasize that disequilibrated solutions have multiple redox Fermi levels.] so I hope to present these diagrams in a fresh light.

 I emphasize though not all solutions have a meaningful redox Fermi level, and some disequilibrated solutions have multiple redox Fermi levels.

## Nernst equation

We are interested in the case where the reactants have activities $a_{\mathrm{Ox}}$ and $a_{\mathrm{Red}}$. We can then formally break this down using standard states of the reactants (noting that $\bar\mu^\circ_i$ are also 'floating' for the charged reactants):

$$ \bar\mu_{\mathrm{Ox}} = \bar\mu^\circ_{\mathrm{Ox}} + RT\ln(a_{\mathrm{Ox}}) $$
$$ \bar\mu_{\mathrm{Red}} = \bar\mu^\circ_{\mathrm{Red}} + RT\ln(a_{\mathrm{Red}}). $$

Note that not all reactants need to be solutes, so activity (and standard state) can be defined in various ways.

Substituting these in, we arrive at the following equation which I call the "**floating Nernst equation**":

$$ V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) = V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) + \frac{RT}{zF} \ln\bigg(\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}\bigg) , $$

where we define the **standard redox level for the $\mathrm{Ox}/\mathrm{Red}$ reaction**:

$$ V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) = \frac{\bar\mu^\circ_{\mathrm{Ox}} - \bar\mu^\circ_{\mathrm{Red}}}{zF} .$$

These are floating levels that float alongside our $V^\circ_i$ ionic standard states. Note that we can substitute $\bar\mu^\circ_i$ for $z_i F V^\circ_i$ for the ion reactants, to get formulae involving $V^\circ_i$ (see below for a more general formula).

{#
[^redformulae]:
    For the simple case of one Ox and one Red species, we have three cases:
    $$\begin{aligned}
    V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) &= V^\circ_{\mathrm{Ox}} - \mu^\circ_{\mathrm{Red}}/(zF) & \text{($\mathrm{Red}$ neutral)} \\
    V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) &= V^\circ_{\mathrm{Red}} + \mu^\circ_{\mathrm{Ox}}/(zF) & \text{($\mathrm{Ox}$ neutral)} \\
    V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) &= \frac{z_{\mathrm{Ox}}}{z} V^\circ_{\mathrm{Ox}} - \frac{z_{\mathrm{Red}}}{z} V^\circ_{\mathrm{Red}} & \text{(neither neutral)}
    \end{aligned}$$
    We can see here that indeed, $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ is anchored to the $V^\circ_i$ ladder.
#}

The above equation for $V_{\mathrm{e}^-}$ looks extremely similar to the regular {%wiki "Nernst equation" %}, though it involves $V_{\mathrm{e}^-}$ instead of $E$. We'll get back to what this traditional electrochemical $E$ actually means in the next topic, but we don't need it for now.

{#
$$ E(\mathrm{Ox}/\mathrm{Red}) = E^\circ(\mathrm{Ox}/\mathrm{Red}) + \frac{RT}{zF} \ln\bigg(\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}\bigg). $$

In essence, in the regular Nernst equation the $E$ and $E^\circ$ simply have had a local reference value subtracted from them, so that they are no longer floating:

$$ E(\mathrm{Ox}/\mathrm{Red}) = V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - (\mathrm{ref}) $$
$$ E^\circ(\mathrm{Ox}/\mathrm{Red}) = V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - (\mathrm{ref}) .$$

The reference value $(\mathrm{ref})$ usually refers to "the standard hydrogen electrode", which is vague. To be precise, the reference is the a *local* value $(\mathrm{ref}) = V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$. The distinction matters when you have an inhomogeneous solution, or you have more than one solution, then $V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$ will vary from place to place.
#}

It's helpful to visualize an example of where these redox levels lie in relation to the ionic levels we've been discussing previously, in this case with the ferric/ferrous redox couple. Note that in order to read out $V_{\mathrm{e}^-}(\mathrm{Fe}^{3+}/\mathrm{Fe}^{2+})$ without influence from other reactions, a glassy carbon electrode could be used (but not a platinum electrode which would also strongly pick up hydrogen or oxygen redox couples).

<figure class="diagram-placeholder">
{% figcaption %}
Example usage of floating Nernst equation


Illustration of redox levels, alongside the ionic levels as we've been discussing previously.

Redox: $V_{\mathrm{e}^-}(\mathrm{Fe}^{3+}/\mathrm{Fe}^{2+})$,  $V^\circ_{\mathrm{e}^-}(\mathrm{Fe}^{3+}/\mathrm{Fe}^{2+})$,  $V^\circ_{\mathrm{e}^-}(\mathrm{H}^{+}/\mathrm{H_2})$

Ion (optional checkbox?) : $V_{\mathrm{Fe}^{3+}}$, $V_{\mathrm{Fe}^{2+}}$, $V^\circ_{\mathrm{Fe}^{3+}}$, $V^\circ_{\mathrm{Fe}^{2+}}$.

Sliders: $\mathrm{Fe}^{3+}$ and $\mathrm{Fe}^{2+}$ concentration.
{% endfigcaption %}
</figure>

### General form

In general we might consider a half-reaction containing more than one species on each side, coming in more than one number:

$$ a\mathrm{A}^{z_{\mathrm{A}}} + b\mathrm{B} + z\mathrm{e}^- \rightleftharpoons c\mathrm{C}^{z_{\mathrm{C}}} + d\mathrm{D} $$

where $A$, $C$ are generic charged species (ions), and $B$, $D$ are generic neutral species ($z_{\mathrm{B}} = z_{\mathrm{D}} = 0$). The Nernst equation is then (writing just "rxn" for short instead of "$\mathrm{A},\mathrm{B}/\mathrm{C},\mathrm{D}$"):

$$ V_{\mathrm{e}^-}(\mathrm{rxn}) = V^\circ_{\mathrm{e}^-}(\mathrm{rxn}) + \frac{RT}{zF} \ln\bigg(\frac{(a_{\mathrm{A}})^a (a_{\mathrm{B}})^b }{(a_{\mathrm{C}})^c (a_{\mathrm{D}})^d }\bigg) , $$

and for the standard redox level we can use $V^\circ_i$ for the charged species:

$$V^\circ_{\mathrm{e}^-}(\mathrm{rxn}) = \frac{az_{\mathrm{A}}}{z}V^\circ_{\mathrm{A}} - \frac{cz_{\mathrm{C}}}{z}V^\circ_{\mathrm{C}} + \frac{b\mu^\circ_{\mathrm{B}} - d\mu^\circ_{\mathrm{D}}}{zF} . $$

This provides a general recipe and it's easy to see how to extend it to more ionic or more neutral reactants.
(Note that the weighting of $V^\circ_i$ levels is always balanced to a total of 1, since original reaction is neutral, $az_{\mathrm{A}} - z = cz_{\mathrm{C}}$ in this case.)

## Standard redox levels in water

Wikipedia's {% wiki "Standard_electrode_potential_(data_page)", "standard electrode potential data page" %} is a fantastic resource to find more of these.

Also known as the standard electrode potential, the standard reduction potential $E^\circ$ is the reduction potential for a reaction that involves species in their standard states. In particular this means that dissolved ions are at a hypothetical ideally-dilute concentration of $c^\circ = 1~\mathrm{mol/L}$; practically this means that these standard reduction potentials are best extrapolated from dilute solutions.

It is also assumed that the temperature is 25&nbsp;°C and the pressure is 1 bar. (Actually, 1 atm is commonly used, which tweaks $\mu_{\mathrm{H}_2} / 2F$ by a millivolt-level correction, but we'll ignore that.)

The consequence of the standard-ideal-concentration (or unit activity) condition is that all $V_i$ for dissolved ions are replaced by $V^\circ_i$.

As with our ionic standard states, we can tabulate all the relative positions of the $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ ladder, by defining one half-reaction (usually $\mathrm{H}^+/\mathrm{H_2}$) as a reference level.^[Note that we have used the $\mathrm{H}^+$ ion as a convenient reference 'ladder rung' for both redox potentials ($V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$) and the ionic standard states ($V^\circ_{\mathrm{H}^+}$). But, these two choices don't need to be related and it's not necessary to use the same ion. Even though they seem related they are in fact performing two different tasks (and they differ by $\tfrac{1}{2F} \mu^\circ_{\mathrm{H_2}}$, which we only assign to be 0 by convention).] We'll call this $E^\circ$, because this is in fact the {% wiki "standard electrode potential" %} (we'll discuss the meaning of "electrode potential" more in the next topic):

$$ E^\circ = V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}) $$

| Ox | / | Red | $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ | $E^0$ (V) |
| ---: | --- | :--- | ---: | ---: |
| $\mathrm{H}^+$ | / | $\mathrm{H_2(g)}$ | $V^\circ_{\mathrm{H}^+} - \tfrac{1}{2F} \mu^\circ_{\mathrm{H_2}}$ | 0 |
| $\mathrm{O_2(g)},\mathrm{H_2O}$ | / | $\mathrm{OH}^-$ | $V^\circ_{\mathrm{OH}^-} + \tfrac{1}{4F} \mu^\circ_{\mathrm{O_2}} + \tfrac{1}{2F} \mu^\circ_{\mathrm{H_2O}} $ | +0.401 |
| $\mathrm{O_2(g)},\mathrm{H}^+$ | / | $\mathrm{H_2O}$ | $V^\circ_{\mathrm{H}^+} + \tfrac{1}{4F} \mu^\circ_{\mathrm{O_2}} + \tfrac{1}{2F} \mu^\circ_{\mathrm{H_2O}} $ | +1.229 |
| $\mathrm{AgCl(s)}$ | / | $\mathrm{Ag(s)},\mathrm{Cl}^-$ | $V^\circ_{\mathrm{Cl}^-} - \tfrac{1}{F} \mu^\circ_{\mathrm{Ag}} + \tfrac{1}{F}\mu^\circ_{\mathrm{AgCl}}$ | +0.222 |
| $\mathrm{Fe}^{3+}$ | / | $\mathrm{Fe}^{2+}$ | $3V^\circ_{\mathrm{Fe}^{3+}} - 2V^\circ_{\mathrm{Fe}^{2+}}$ | +0.771 |
| $\mathrm{Fe}^{2+}$ | / | $\mathrm{Fe(s)}$ | $V^\circ_{\mathrm{Fe}^{2+}} - \tfrac{1}{2F} \mu^\circ_{\mathrm{Fe}} $ | −0.44 |

It's worth visualizing the $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ levels alogngside the ionic levels $V^\circ_i$. We plot the standard redox levels as dashed (representing that they are 'implied' levels), and as thin lines (representing that they are only standard states):

<figure class="diagram-placeholder">
{% figcaption %}
TODO: Energy levels plot!
- left side: selected half reactions
- right side: selected ions

Controls:
- slider 1: floating offset
- slider 2: reference-state of H
- slider 3: reference-state of O
- slider 4: reference-state of Fe

Caption: "water ..."
{% endfigcaption %}
</figure>

As can be seen, when we change the electrical offset, both 'ladders' move in lockstep. However, the ionic standard states are sensitive to our choice of zero of neutral elements' chemical potentials, whereas the standard redox levels are totally immune to that (since they really are electronic in nature).

{#
## Redox kinetics

When it comes to understanding redox processes, one very helpful idea is the Marcus-Gerischer theory, where one plots two Gaussian bumps representing "redox density of states".  These naturally fit onto energy band diagrams (as pioneered by Gerischer), and could also be plotted (though perhaps awkwardly as they would be upside down) on $V_{\mathrm{e}^-}$ diagrams. However, it's a bit beyond the scope of this project so we won't be getting into this.

It's important to understand that these are a sort of 'electron tunneling density of states' and they largely represent irreversible processes. As Marcus theory indicates, these Gaussians have a significant spread due to random thermal variations in molecular configurations.

* The unfilled bump (at higher energy / lower voltage) represents low energy unoccupied states of the $\mathrm{Ox}$ species. If an electron does jump in, it forms a temporary excited $\mathrm{Red}$ molecule, which then relaxes.
* The filled bump (at lower energy / higher voltage) represents high energy occupied states of the $\mathrm{Red}$ species. If an electron does jump out, it forms a temporary excited $\mathrm{Ox}$ molecule, which then relaxes.

The important of these Gaussians is that they represent the actual necessary activation window for redox processes. If two redox processes' windows don't overlap, then they might not proceed even if there is a strong thermodynamic drive.
#}

## Takeaways

And so we've arrived at a description of redox half-reactions in terms of a virtual or implied value $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$, and in relating this to reactant activities, we've identified a new ladder of "standard redox levels" $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$. 

In the next topic, we'll talk about how we can explain traditional elecrochemical variables in terms of these redox levels.

[**NEXT TOPIC: Potentials**](../e/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}