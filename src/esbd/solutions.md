---
layout: layouts/esbd_topic.njk
title: 'Solutions'
tags: [page, esbd_topic]
orderESBD: 21
---

# {{title}}

In the earlier [topic about equilibrium](../equilibrium/), we talked about how solid $\mathrm{NaCl}$ in equilibrium with a solvent (such as water) would set a fixed $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = \tfrac{1}{F} \mu_{\mathrm{NaCl}} = -3.9813~\mathrm{V}$. But that is for a *fully saturated* solution. What happens when we only have a tiny amount dissolved? How does $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ depend on the concentration of dissolved $\mathrm{NaCl}$?

To start our discussion, here are some fairly accurate modelled curves:

<figure class="demo-container" style="max-width: 350px">
<img src="/esbd/img/nacl_solvent_comparison.svg" style="max-width:100%"/>
{% figcaption %}
$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ value for salt dissolved at varying concentrations, for two solvents: water and methanol.<small>[[source]](https://colab.research.google.com/gist/markblundeberg/7d09128737f2dd41b035e8ccb661dff3/nacl-water-methanol.ipynb)</small>
{% endfigcaption %}
</figure>

Note the roughly linear dependence on the logarithm of concentration (the "ideal slope" in the figure). This is actually guaranteed in the dilute limit, for a fundamental entropic reason: each solute particle's position becomes independent of other solute particles.

Although the dilute limit is only approximate, it gives us a starting point to answer more complex questions without first laboriously measuring thermodynamic data over a range of concentrations. For example, what happens when there are many species of ion present?

(The saturation behaviour is interesting too: When $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ in the solution rises above the value for solid $\mathrm{NaCl}$, then the solution is supersaturated, that is, it is favourable for the excess $\mathrm{NaCl}$ to precipitate. At saturation, the values of $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ will be the same in solution and solid salt.)

## Ideal ionic voltage in dilute solutions

Statistical mechanics tells us that a dilute solute's electrochemical potential breaks into three parts:

$$ \bar\mu_i = \underbrace{z_i F \phi}_{\text{electrostatic}} + \underbrace{\mu^\circ_{\mathrm{int},i}}_{\text{offset}} + \underbrace{RT \ln(c_i/c^\circ)}_{\text{entropic}}. $$

The first term is the electrostatic energy of the ion's charge at a local potential $\phi$. The second, the **standard internal chemical potential** $\mu^\circ_{\mathrm{int},i}$, is fixed by the ion's chemical identity and the way it disturbs its solvent (its solvation shell); it does not depend on concentration.^[I label this term the *offset* rather than "chemical," because neither word quite fits. It is not purely chemical: $\mu^\circ_{\mathrm{int},i}$ quietly absorbs the ion's solvation electrostatics (the Born energy and more) and local entropy alongside any chemical binding. Nor is it the full "chemical part," which a chemist would take to include the activity term as well. It is really just the fixed, ion-specific piece left once the bath potential and the dilution entropy are set aside, and even its boundary with $z_i F \phi$ is a convention rather than a physical fact. I make this case in [the case against $\phi$](../phi/).] Only the third, entropic term does, growing logarithmically as the solute is diluted. Here $c_i$ is the {% wiki "molar concentration" %} (moles per litre, also called molarity) and $c^\circ = 1~\mathrm{mol/L}$ is a fixed reference.

The split between the first two terms is partly conventional, since it turns on how one defines the ambiguous $\phi$, so rather than carry them separately we fold them together. Dividing through by the molar charge $z_i F$ to cast everything in volts, and gathering the two concentration-independent terms into one, gives

$$ V_i = \underbrace{\Big(\phi + \tfrac{1}{z_i F}\mu^\circ_{\mathrm{int},i}\Big)}_{V^\circ_i} + \frac{RT}{z_i F} \ln(c_i/c^\circ), $$

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(c_i/c^\circ). $$

The new quantity $V^\circ_i$ is the **standard species voltage**, the voltage an ion would carry at the reference concentration $c^\circ$. Like $\phi$ it is not pinned to an absolute value, floating with the electrical state of the solution, but as we will see its differences from ion to ion are rigid, and it behaves much like the floating band edges of a semiconductor. The two remaining symbols are the gas constant times temperature $RT$ (joules per mole) and the molar charge $z_i F$ (coulombs per mole).

> Concentration can equally be measured as {% wiki "molality" %} $b_i$ (moles per kilogram of solvent), giving the same ideal form $V_i = V^{\circ(b)}_i + \tfrac{RT}{z_i F}\ln(b_i/b^\circ)$ with $b^\circ = 1~\mathrm{mol/kg}$. The molal and molar standard states differ only through the solvent density,^[Equating the two forms gives $V^{\circ(b)}_i - V^\circ_i = \tfrac{RT}{z_i F}\ln(\rho\, b^\circ/c^\circ)$ for solvent density $\rho$. For water ($\rho = 0.997~\mathrm{kg/L}$ at 25&nbsp;°C, 1 bar) this is a negligible $-0.00008~\mathrm{V}/z_i$, though it can matter in other solvents. The two measures also describe slightly different ideal behaviour once the density varies with concentration, but that happens only in the concentrated regime where both logarithmic forms already fail.] which for water is negligible. The plot above used molal units; I will mostly prefer molar $c_i$ and switch when convenient.

### Ideal-dilute salt water

Returning to our saltwater example, we have then:
$$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-} = (V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-}) + 2\frac{RT}{F} \ln(c/c^\circ), $$
where $c = c_{\mathrm{Na}^+} = c_{\mathrm{Cl}^-}$ is the concentration of either ion. This gives that characteristic $2\tfrac{RT}{F}\ln(\mathrm{concentration})$ slope we saw in the plot above. Also note that $V^\circ_{\mathrm{Na}^+} - V^\circ_{\mathrm{Cl}^-} = -4.0746~\mathrm{V}$ is a constant for water in our conditions; since $\phi$ cancels out, this difference does not depend on the ambiguous $\phi$. When discussing solutions we can draw these $V^\circ_i$ as distinct lines from the $V_i$.

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-nacl-dilute.njk" %}
</figure>

## Ionic standard states are a floating ladder

Although the $V^\circ_i$ values float, crucially all the differences $V^\circ_i - V^\circ_j$ are invariant properties of the pure solvent. These differences also vary with temperature and pressure but that won't be too important for our purposes.

Here are a number of selected $V^\circ_i$ values for water at standard conditions (25&nbsp;°C, 1 bar):
[[Data table here](../data/)]

<figure class="demo-container" style="max-width: 200px">
{% include "esbd-diagrams/V-std-ladder.njk" %}
</figure>

I call this the **standard state ladder** for water. The standard state ladder is a rigid ladder: as we change the electrical state or solute composition of the solution, the $V^\circ_i$ values may move up and down but they have to all stay rigidly locked to one another. In contrast, $V_i$ values are not rigid and their relative positions will change with composition.

The [Data table](../data/) topic in the appendix contains the numerical values used above, as well as the procedure used to obtain them from standard ionic Gibbs energies of formation ($\Delta_{\mathrm{f}} G^\circ_i$ values).

In effect, the standard state ladder of $V^\circ_i$ is a stand-in for the notion of electrostatic potential $\phi$, but combining it with the average differences in the local electrostatic potentials that each ion 'feels', as well the ion's chemical structure, and the way it disturbs its solvent environment with solvation shells.

The standard state ladder is also analogous to the conduction and valence band edges in semiconductors. We'll talk more about this analogy to semiconductors in the next topic.

## Spatial variations

We have drawn the ladder as a static object, but in a working device it rarely sits still. A brief look ahead is worth it here, even though every mechanism shown belongs to a later topic. The contrast to hold onto is this: while $V_i$ tends to ramp smoothly and monotonically across space, tied down as it is by the pull toward thermodynamic equilibrium, the $V^\circ_i$ levels are free to vary far more wildly. They slope gently under an ohmic or diffusion field, swing sharply over a few nanometres in the diffuse layer beside an interface, and jump outright wherever the medium itself changes, since a different solvent or phase carries its own ladder.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/esbd-solutions-amalgam.njk" %}
{% figcaption %}
Schematic, not to scale: a single ion, $\mathrm{Na}^+$, plated into a mercury amalgam from aqueous solution, as happens at a dropping-mercury electrode or a chlor-alkali mercury cell. Don't worry about the mechanisms yet, since each gets its own topic later; the point is only this. The species voltage $V_{\mathrm{Na}^+}$ glides smoothly across the whole system, while its standard state $V^\circ_{\mathrm{Na}^+}$ roams over three length scales at once: a gentle slope through the micron-thick diffusion layer, a sharp excursion in the nanometre diffuse layer at the surface, and an outright jump at the mercury–water boundary. The gap between the two lines, drawn in the lower panel, is exactly the concentration $c_{\mathrm{Na}^+}$.
{% endfigcaption %}
</figure>

Each of these features has a home further on: the diffusion-layer slope in [basic transport](../transport_basic/), the diffuse-layer excursion in [basic electrostatics](../basicelectrostatics/), and the jump between two different media in [mass action and charge control](../charge_control/). For now it is enough to see that the ladder is a living thing rather than a fixed backdrop.

## Activities and non-ideality

The dilute law leaned on that logarithmic term being exact, which holds only when the solute is dilute enough that each ion ignores the others. Beyond that, chemistry keeps the form but folds every deviation into an effective concentration, the {% wiki "activity" %} $a_i$, defined precisely so that

$$ \bar\mu_i = z_i F \phi + \mu^\circ_{\mathrm{int},i} + RT \ln(a_i) $$

holds exactly, with the very same standard $\mu^\circ_{\mathrm{int},i}$ we met above. In $V_i$ terms this is just our earlier equation with $c_i/c^\circ$ replaced by the activity:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(a_i). $$

The standard state is fixed by the convention that $a_i \to c_i/c^\circ$ in the dilute limit, which is exactly what made the ideal form exact there. The activity is then the single bookkeeping device carrying every departure from ideal-dilute behaviour.

There are a number of big gotchas when it comes to nonideality. I talk about this a lot more in the [appendix Topic on non-ideality](../nonideal/), but the key points are:

* **Single-ion activities are ambiguous**: we can access $V_i$ but we cannot directly access $\phi$ nor $V^\circ_i$. Consequently in nonideal solutions we have no basis on how to fix the reference point for activities. In chemistry it is said "we can only measure {% wiki "Activity_coefficient#Ionic_solutions", "*mean* ion activities" %}"; those [exactly correspond](../nonideal/) to measurable differences like $(V_i - V^\circ_i) - (V_j - V^\circ_j)$, where the 'ladder offset' or $\phi$ cancels out. This ambiguity is very severe: it adds infinite degrees of freedom as every solution of every composition can settle the ambiguity independently.
* **Activities depend on concentration reference**: depending on our choice of concentration reference (either switching from molarity $c^\circ$ to molality $b^\circ$, or changing their values), we will have different $V^\circ_i$ values. This choice doesn't change the $V_i$, rather it changes activity $a_i$. This can get confusing!^[See Adam Přáda's blog (2019), ["On chemical activities"](https://adamprada.net/blog/on-chemical-activities/)]
* **Activity coefficients are trickier**: it is common in chemistry to introduce a dimensionless activity coefficient as a sort of fudge factor on the concentration. These become especially tricky when trying to convert between different concentration measures.

Again, see the [appendix Topic on non-ideality](../nonideal/) for more information.

Importantly, what all of these different approaches using various concentration measures, electrostatic potentials, activities, and activity coefficients *must* agree on is the actual thermodynamic observable: electrochemical potential $\bar\mu_i$ (and thus $V_i$).

## Takeaways

A dilute ion's species voltage sits a logarithmic distance from its standard species voltage $V^\circ_i$, the distance set by concentration through $V_i = V^\circ_i + \tfrac{RT}{z_i F}\ln(c_i/c^\circ)$. The $V^\circ_i$ float with the electrical state of the solution, yet their differences form a rigid ladder fixed by the solvent, and once the solution is no longer dilute the concentration term generalizes to an activity. This same structure, a carrier floating logarithmically above a standard-state level, turns out to describe the electronic carriers in a semiconductor every bit as well, and that is where we go next.

[**NEXT TOPIC: Semiconductors**](../solidstate/)