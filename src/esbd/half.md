---
layout: layouts/esbd_topic.njk
title: 'Half-reactions'
tags: [page, esbd_topic]
orderESBD: 31
---

# {{title}}

Wherever an electronic conductor meets an ionic one, something must hand the charge from one circuit to the other; the survey of [conductors](../other_conductors/) ended on exactly that threshold. The handoff is electron transfer, and chemistry accounts for it one **half-reaction** at a time:

$$ \mathrm{Ox} + z\mathrm{e}^- \rightleftharpoons \mathrm{Red}. $$

Here $z$ electrons land on an oxidized species $\mathrm{Ox}$ and turn it into a reduced species $\mathrm{Red}$, the charges balancing as $z_{\mathrm{Ox}} - z = z_{\mathrm{Red}}$. This topic and the next few work out how the ideas built on this form, "electrode potential", "redox potential", the "standard hydrogen electrode", look in the $V_i$ world.

A half-reaction cannot run on its own, since the solvent holds no population of free electrons. To move forward it must take its electrons from an electrode or from another half-reaction, and to move backward it needs somewhere to put them.

Even so, the reaction defines an electron level all by itself. Its equilibrium condition,

$$ \bar\mu_{\mathrm{Ox}} + z \bar\mu_{\mathrm{e}^-} = \bar\mu_{\mathrm{Red}}, $$

pins down an electrochemical potential of electrons, which in our terms is a voltage:

$$ V_{\mathrm{e}^-} = \frac{\bar\mu_{\mathrm{Ox}} - \bar\mu_{\mathrm{Red}}}{zF}. $$

(We describe $\mathrm{Ox}$ and $\mathrm{Red}$ by their electrochemical potentials rather than converting them to $V_i$, since either one might be an uncharged species.)

In [Reactions](../reactions/) we met this $V_{\mathrm{e}^-}$ attached to an electrode: the half-reaction exchanged its electrons with a metal, and at equilibrium the reaction's level and the metal's agreed. Now comes the different point of view, and the central premise of redox chemistry: the reaction's $V_{\mathrm{e}^-}$ is worth talking about even when no equilibrated electrode is anywhere nearby.

## Implied $V_{\mathrm{e}^-}$ of a reaction

With no electrode in sight, the formula above still evaluates to a perfectly good voltage: an "implied" $V_{\mathrm{e}^-}$, a real thermodynamic availability of electrons in a solution where none roam free. Since the value belongs to a particular reaction, we write it $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$. It proves useful in two situations.

The first is coupling between half-reactions inside the solution,

$$V_{\mathrm{e}^-}(\mathrm{Ox_1}/\mathrm{Red_1}) \rightleftharpoons V_{\mathrm{e}^-}(\mathrm{Ox_2}/\mathrm{Red_2}).$$

A solution may host several half-reactions at once, and thermodynamics drives them all toward a common $V_{\mathrm{e}^-}$, the species trading electrons directly ('electron transfer reactions') with no electrode involved; the driving force for any such transfer is precisely the mismatch between the two implied levels. But electron transfer is often kinetically slow, and then the levels simply stay split. Natural ground water is notorious for this.^[Lindberg, R. D., & Runnells, D. D. (1984). [Ground Water Redox Reactions: An Analysis of Equilibrium State Applied to Eh Measurements and Geochemical Modeling](https://doi.org/10.1126/science.225.4665.925). Science, 225(4665), 925–927.]

The second is coupling between a half-reaction and an electrode,

$$V_{\mathrm{e}^-}(\mathrm{metal}) \rightleftharpoons V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}).$$

A simple electrode couples to one half-reaction, and the two levels equalize only at zero current; at a driven electrode, the interface's overpotential appears as the step between the electrode's $V_{\mathrm{e}^-}$ and the level implied by its reaction. Real electrodes may couple to more than one half-reaction at once, giving 'mixed potentials'.^[IUPAC Gold Book ["mixed potential"](https://goldbook.iupac.org/terms/view/M03944.html)]

On our diagrams these implied levels are drawn as dashed lines, inside the solution.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/levels-half-implied.njk" %}
{% figcaption %}
How implied levels look: the metal has one actual $V_{\mathrm{e}^-}$, while the solution carries an implied level for each of its half-reactions. This particular solution is redox-disequilibrated — slow electron transfer lets four different $V_{\mathrm{e}^-}$ values coexist.
{% endfigcaption %}
</figure>

The idea that a solution can carry an implied electronic level (a $V_{\mathrm{e}^-}$ or $\bar\mu_{\mathrm{e}^-}$) is not at all new. It is often called a 'redox Fermi level',^[A careful modern discussion of how the Fermi level and the redox potential relate is given by J. Bisquert, D. Cahen, G. Hodes, S. Rühle, and A. Zaban, [Physical Chemical Principles of Photovoltaic Conversion with Nanoparticulate, Mesoporous Dye-Sensitized Solar Cells](https://doi.org/10.1021/jp0359283), *J. Phys. Chem. B* **108**, 8106 (2004).] and its attraction is that $\bar\mu_{\mathrm{e}^-}$ plots directly onto a traditional electronic energy band diagram. I've found past visualizations to be confusing in some specific ways,^[Redox band diagrams are often special-cased to equilibrium, in a way that degrades out-of-equilibrium intuition. My aims here: to discourage the casual referencing of 'the vacuum' or 'the SHE', since in real devices these references vary from place to place; to promote reference-free band diagrams instead; and to emphasize that disequilibrated solutions carry multiple redox Fermi levels.] so I hope to present these diagrams in a fresh light. One caution worth stating up front: not every solution has a meaningful redox Fermi level, and a disequilibrated solution has several at once.

## Nernst equation

Now bring in the concentrations. Give the reactants activities $a_{\mathrm{Ox}}$ and $a_{\mathrm{Red}}$ and split each electrochemical potential against its standard state (for the charged reactants, the $\bar\mu^\circ_i$ are 'floating' like every ionic standard state):

$$ \bar\mu_{\mathrm{Ox}} = \bar\mu^\circ_{\mathrm{Ox}} + RT\ln(a_{\mathrm{Ox}}) $$
$$ \bar\mu_{\mathrm{Red}} = \bar\mu^\circ_{\mathrm{Red}} + RT\ln(a_{\mathrm{Red}}). $$

Not every reactant need be a solute, so activity and standard state may each be defined in whatever way suits the species.

Substituting these in, we arrive at what I call the "**floating Nernst equation**":

$$ V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) = V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) + \frac{RT}{zF} \ln\bigg(\frac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}\bigg) , $$

where we define the **standard redox level for the $\mathrm{Ox}/\mathrm{Red}$ reaction**:

$$ V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) = \frac{\bar\mu^\circ_{\mathrm{Ox}} - \bar\mu^\circ_{\mathrm{Red}}}{zF} .$$

These levels float alongside our ionic standard states $V^\circ_i$. For the ion reactants we can substitute $\bar\mu^\circ_i = z_i F V^\circ_i$ to get formulae directly in terms of $V^\circ_i$ (a general recipe follows below).

This looks extremely like the regular {%wiki "Nernst equation" %}, except that it delivers $V_{\mathrm{e}^-}$ rather than $E$. What that traditional electrochemical $E$ actually means, we take up in the [next topic](../e/); we do not need it yet.

It helps to see where these redox levels lie among the ionic levels of the previous topics; take the ferric/ferrous couple, measurable in practice with an inert electrode.^[On the choice of that electrode: glassy carbon reads $V_{\mathrm{e}^-}(\mathrm{Fe}^{3+}/\mathrm{Fe}^{2+})$ potentiometrically without influence from other reactions, whereas platinum may also pick up hydrogen or oxygen redox couples and drift toward a mixed potential. That is a worry for open-circuit *potentiometry*; in *voltammetry*, platinum is a standard working electrode for this couple, its fast electron-transfer [kinetics](../kinetics/) outweighing the mixed-potential concern.]

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/levels-half-ferric.njk" %}
{% figcaption %}
The ferric/ferrous redox levels alongside the ionic levels they are built from (ideal-dilute, $a_i = c_i/c^\circ$). The implied level is a weighted combination of the ion levels, $V_{\mathrm{e}^-}(\mathrm{Fe}^{3+}/\mathrm{Fe}^{2+}) = 3V_{\mathrm{Fe}^{3+}} - 2V_{\mathrm{Fe}^{2+}}$, and likewise for the standard levels. Note the leverage in that weighting: a decade of $\mathrm{Fe}^{3+}$ concentration moves $V_{\mathrm{Fe}^{3+}}$ by only 20&nbsp;mV, but moves the redox level by the full 59&nbsp;mV.
{% endfigcaption %}
</figure>

### General form

In general a half-reaction can involve several species on each side, each with its own stoichiometric coefficient:

$$ a\mathrm{A}^{z_{\mathrm{A}}} + b\mathrm{B} + z\mathrm{e}^- \rightleftharpoons c\mathrm{C}^{z_{\mathrm{C}}} + d\mathrm{D} $$

where $\mathrm{A}$, $\mathrm{C}$ are generic charged species (ions), and $\mathrm{B}$, $\mathrm{D}$ are generic neutral species ($z_{\mathrm{B}} = z_{\mathrm{D}} = 0$). The Nernst equation is then (writing just "rxn" for short instead of "$\mathrm{A},\mathrm{B}/\mathrm{C},\mathrm{D}$"):

$$ V_{\mathrm{e}^-}(\mathrm{rxn}) = V^\circ_{\mathrm{e}^-}(\mathrm{rxn}) + \frac{RT}{zF} \ln\bigg(\frac{(a_{\mathrm{A}})^a (a_{\mathrm{B}})^b }{(a_{\mathrm{C}})^c (a_{\mathrm{D}})^d }\bigg) , $$

and for the standard redox level we can use $V^\circ_i$ for the charged species:

$$V^\circ_{\mathrm{e}^-}(\mathrm{rxn}) = \frac{az_{\mathrm{A}}}{z}V^\circ_{\mathrm{A}} - \frac{cz_{\mathrm{C}}}{z}V^\circ_{\mathrm{C}} + \frac{b\mu^\circ_{\mathrm{B}} - d\mu^\circ_{\mathrm{D}}}{zF} . $$

The recipe extends in the obvious way to more ionic or more neutral reactants. Note that the $V^\circ_i$ weights on the right hand side always total 1, since the original reaction is charge-balanced ($az_{\mathrm{A}} - z = cz_{\mathrm{C}}$ in this case).

### Plating couples

The simplest case is a metal plating couple, where the reduced species is the pure metal itself. A footnote on the [front page](../) hinted at this one:

$$ \mathrm{Li}^+ + \mathrm{e}^- \rightleftharpoons \mathrm{Li(s)}, $$

for which the implied level needs no Nernst machinery at all:

$$ V_{\mathrm{e}^-}(\mathrm{Li}^+/\mathrm{Li}) = \frac{\bar\mu_{\mathrm{Li}^+} - \mu_{\mathrm{Li}}}{F} = V_{\mathrm{Li}^+} - \frac{\mu_{\mathrm{Li}}}{F}. $$

Under our convention (and at the reference temperature and pressure) $\mu_{\mathrm{Li}} = 0$, so $V_{\mathrm{e}^-}(\mathrm{Li}^+/\mathrm{Li}) = V_{\mathrm{Li}^+}$: the couple's implied electron level plots exactly on top of the ion's own level, at every concentration, since $\bar\mu_{\mathrm{Li}^+}$ carries the whole activity dependence. This cashes that footnote's promise: the line we drew there as $V_{\mathrm{Li}^+}$ doubles as the electrolyte's redox Fermi level, in the manner of Gerischer. The same holds for every metal plating couple $\mathrm{M}^{n+}/\mathrm{M}$ (compare the $\mathrm{Fe}^{2+}/\mathrm{Fe(s)}$ row in the table below), and it is the same accident that put $V_{\mathrm{e}^-} = V_{\mathrm{Zn}^{2+}}$ at the [zinc electrode](../reactions/): the elemental $\mu = 0$ convention wearing another hat.

Keep in mind what kind of coincidence this is. The two lines are different objects, $V_{\mathrm{Li}^+}$ being the level of ions really present in the electrolyte while $V_{\mathrm{e}^-}(\mathrm{Li}^+/\mathrm{Li})$ is an implied electron level. They separate the moment $\mu_{\mathrm{Li}} \neq 0$: pick a different convention and the implied level shifts away; or, more physically, put a temperature gradient across the cell and $\mu_{\mathrm{Li}}(T)$ varies from place to place, peeling the $V_{\mathrm{e}^-}(\mathrm{Li}^+/\mathrm{Li})$ level off of $V_{\mathrm{Li}^+}$ by a real, position-dependent amount.

## Standard redox levels in water

The standard reduction potential $E^\circ$, also known as the standard electrode potential, refers to a half-reaction with every species in its standard state. For dissolved ions that means the hypothetical ideally-dilute concentration $c^\circ = 1~\mathrm{mol/L}$, so in practice these values are best extrapolated from dilute solutions; the temperature is 25&nbsp;°C and the pressure 1 bar.^[Actually, 1 atm is commonly used, which tweaks $\mu_{\mathrm{H}_2} / 2F$ by a sub-millivolt correction ($\approx 0.2~\mathrm{mV}$); we'll ignore that.] The effect of the unit-activity condition is simply that every dissolved ion's $V_i$ is replaced by its $V^\circ_i$, and each implied level lands on its standard redox level.

As with our ionic standard states, we can tabulate all the relative positions of the $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ ladder, by defining one half-reaction (usually $\mathrm{H}^+/\mathrm{H_2}$) as a reference level.^[Note that we have used the $\mathrm{H}^+$ ion as a convenient reference 'ladder rung' for both redox potentials ($V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2})$) and the ionic standard states ($V^\circ_{\mathrm{H}^+}$). But these two choices don't need to be related, and it's not necessary to use the same ion: they are in fact performing two different tasks (and they differ by $\tfrac{1}{2F} \mu^\circ_{\mathrm{H_2}}$, which we only assign to be 0 by convention).] We'll call the gap from that reference $E^\circ$, because this is in fact the {% wiki "standard electrode potential" %} (the meaning of "electrode potential" gets its due in the next topic):

$$ E^\circ = V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{H}^+/\mathrm{H_2}) $$

| Ox | / | Red | $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ | $E^\circ$ (V) |
| ---: | --- | :--- | ---: | ---: |
| $\mathrm{H}^+$ | / | $\mathrm{H_2(g)}$ | $V^\circ_{\mathrm{H}^+} - \tfrac{1}{2F} \mu^\circ_{\mathrm{H_2}}$ | 0 |
| $\mathrm{O_2(g)},\mathrm{H_2O}$ | / | $\mathrm{OH}^-$ | $V^\circ_{\mathrm{OH}^-} + \tfrac{1}{4F} \mu^\circ_{\mathrm{O_2}} + \tfrac{1}{2F} \mu^\circ_{\mathrm{H_2O}} $ | +0.401 |
| $\mathrm{O_2(g)},\mathrm{H}^+$ | / | $\mathrm{H_2O}$ | $V^\circ_{\mathrm{H}^+} + \tfrac{1}{4F} \mu^\circ_{\mathrm{O_2}} - \tfrac{1}{2F} \mu^\circ_{\mathrm{H_2O}} $ | +1.229 |
| $\mathrm{AgCl(s)}$ | / | $\mathrm{Ag(s)},\mathrm{Cl}^-$ | $V^\circ_{\mathrm{Cl}^-} - \tfrac{1}{F} \mu^\circ_{\mathrm{Ag}} + \tfrac{1}{F}\mu^\circ_{\mathrm{AgCl}}$ | +0.222 |
| $\mathrm{Fe}^{3+}$ | / | $\mathrm{Fe}^{2+}$ | $3V^\circ_{\mathrm{Fe}^{3+}} - 2V^\circ_{\mathrm{Fe}^{2+}}$ | +0.769 |
| $\mathrm{Fe}^{2+}$ | / | $\mathrm{Fe(s)}$ | $V^\circ_{\mathrm{Fe}^{2+}} - \tfrac{1}{2F} \mu^\circ_{\mathrm{Fe}} $ | −0.409 |

Wikipedia's {% wiki "Standard_electrode_potential_(data_page)", "standard electrode potential data page" %} is a fantastic resource to find more of these. The middle column has a venerable precedent, too: Newman's classic textbook carries an extremely similar table, each $E^\circ$ resolved into the chemical potentials of its reactants, with the hydrogen reference written out in every row.^[Newman & Balsara (2021), *Electrochemical Systems*, Table 2.2 (p. 53).]

It's worth visualizing the $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ levels alongside the ionic levels $V^\circ_i$. We plot the standard redox levels dashed (they are 'implied' levels) and thin (they are only standard states):

<figure class="demo-container" style="max-width: 520px">
{% include "esbd-diagrams/levels-half-ladder.njk" %}
{% figcaption %}
Standard redox levels $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ (left) alongside ionic standard states $V^\circ_i$ (right), all computed from one table of formation energies in water. Try the sliders: the electrical offset, and our arbitrary assignments of $\mu^\circ$ for three neutral elements (conventionally zero).
{% endfigcaption %}
</figure>

Move the electrical offset and both 'ladders' slide in lockstep. But the ionic standard states are sensitive to our arbitrary zeros for the neutral elements' chemical potentials, whereas the standard redox levels sit totally immune: they really are electronic in nature, as promised by the $V^\circ_{\mathrm{e}^-}$ label.

## Takeaways

Every half-reaction defines its own electron level, the implied $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$: a real thermodynamic availability of electrons in a solution that holds no free electrons at all. Reactant activities move that level according to the floating Nernst equation, anchored to a new ladder of standard redox levels $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ that floats alongside the ionic one and is tabulated in every $E^\circ$ table. An equilibrated solution carries one implied level; a disequilibrated solution carries several; an electrode brings a level of its own, which may or may not agree with them.

The traditional variables of electrochemistry, electrode potential first among them, are gaps between these levels, and reading them off the diagram is the next topic's job.

[**NEXT TOPIC: Electrode potential**](../e/)