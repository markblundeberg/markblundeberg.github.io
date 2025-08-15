---
layout: layouts/esbd_topic.njk
title: 'Non-ideal solutions'
tags: [page, esbd_topic]
orderESBD: 83
eleventyNavigation:
    key: Non-ideal solutions
    parent: ESBD
    order: 83
---

# {{title}}

Earlier in the [Solutions](../solutions/) topic we touched a bit on non-ideal solutions. I'd like to touch on how there is a fundamental aspect of ambiguity in the ionic activity $a_i$, activity coefficient $\gamma_i$, and the overall placement of the $V^\circ_i$ ladder. This is a well-known issue for ion chemistry and I just want to re-explain how it appears with the $V_i$'s.

To be specific, we are concerned with cases where solutes deviate from an ideal-dilute logarithmic dependence on concentration. Again, this is commonly captured as an activity activity coefficient $\gamma_i$ that acts as a fudge factor on the concentration $c_i$. The species voltage then takes the form:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(\gamma_i c_i/c^\circ). $$

for reference concentration $c^\circ = 1~\mathrm{mol/L}$.

The expectation is that when *all* solutes' concentrations go 0, then $\gamma_i$ should approach 1 for all solutes. This is a definitional convention: if $\gamma_i$ converged to some different value other than 1 then its corresponding $V^\circ_i$ would have to be redefined.

Note: if *any* solute's concentration is significantly nonzero, then *all* $\gamma_i$ may be nonzero, even for other solutes that themselves are infinitely dilute. The other dilute solutes will still behave ideally dilutely for low concentrations, however they will start out with $\gamma_i \neq 1$. This reflects that their medium is not the original pure solvent that was used to define $V^\circ_i$.

And again, a common shorthand is activity, defined as:

$$a_i = \gamma_i c_i/c^\circ$$

so that:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(a_i), $$

and finally I stress again that this is a *molarity* activity in the sense that it is relative to a reference state $V^\circ_i$ that is calculated based on a reference molarity of $c^\circ$. [Not all activities are such molarity activities](https://adamprada.net/blog/on-chemical-activities/), so activities can be subtly incompatible. I will only discuss the molarity form of activity and activity coefficient here.

(Note: there is another kind of ideal solution, perhaps better called an *ideal mixture* where the solute's chemical potential varies with the logarithm of mole fraction, not concentration. That corresponds to {% wiki "Raoult's law" %}, and reflects a case where solute-solvent, solute-solute, and solvent-solvent interactions all have the same character. That is distinct from the *ideal-dilute* form, which we are interested in, which represents a case where solute particles are all independent, being more like an ideal gas and instead corresponding to {% wiki "Henry's law" %}.)

## Ionic non-idealities matter

Should we really care about non-idealities? Yes! In fact ions depart from the ideally-dilute case already at surprisingly low concentrations (e.g., $0.001~\mathrm{mol/L}$ in water), at least compared to non-ionic solutes which might only depart after $0.1~\mathrm{mol/L}$.

Ions show early non-ideality due to "ionic atmosphere" effects, i.e., how ions screen their fellow ions at medium range distances. This represents a form of correlation between the positions of ions, which violates our ideal-dilute assumption that the ions are moving around independently of each other. The crucial (and robust) effect of ionic atmosphere, as encountered in {% wiki "Debye–Hückel theory" %}, is that the activity coefficients of ions deviate proportionally to the square root of concentration, $\ln\gamma_i \propto -\sqrt{I}$, where $I$ is the {% wiki "ionic strength" %}, a weighted sum of all ionic concentrations. By comparison, with non-ionic solutes the leading order deviation of activity coefficient is in the first power of concentration.

There is a lot more that can be said about the microscopic details. But really, the main point is that non-idealities readily manifest with ions at the usual concentrations seen in experiments. So, we really ought to care about the non-idealities of ions!

That said, being off by a factor of 2 in the activity of an ion might only correspond to a voltage error of $RT\ln(2)/F \approx 17~\mathrm{mV}$, so for imprecise work, electrochemists can often get away with ignoring the non-ideality. And due to the ambiguities in activity (discussed next), it can be annoying to properly incorporate non-ideality.

{#
Basically, around each ion, its electric field is not only suppressed by the presence of dielectric polarization (of the solvent), but is in fact totally screened out by the presence of other ions. This represents a form of correlation between the positions of ions, which violates our ideal-dilute assumption that the ions are moving around independently of each other.

The degree of screening is quantified by the {% wiki "ionic strength" %}, $I$. Essentially, the ionic strength is an idealized estimate of the total charge density that would develop in response to shifting the $V^\circ_i$ ladder while keeping all $V_i$ constant. Such a deviation from charge neutrality is not permissible in bulk but it can develop microscopically, such as in this case.

Quantitatively, we expect to see disturbances in the activity coefficients that are proportional to the square-root of ionic strength: $\ln\gamma_i \propto -\sqrt{I}$. Crucially, $I$ grows proportionally to the concentration of added ionic solutes. Thus, we see activity coefficients of ions deviate proportional to the square root of concentration. By comparison, with non-ionic solutes that only interact with each other at short ranges, the leading order deviation of activity coefficient is in the first power of concentration.

(Technically, ionic activities deviate to first order in concentration when $I$ starts out with a nonzero value due to naturally autodissociated solvent molecules, like in pure water. But when the amount of autodissociation is so low, it puts this first-order regime at such a low concentration as to be beyond experimental uncertainty limits.)
#}

## The fundamental ambiguity of ionic activity

You may have heard that single-ion activities are ill defined, or unmeasurable; or, that only mean ionic activities can be measured. Let's talk about why that is the case, first in the language of the $V_i$'s.

Suppose we have solution of specific composition, with various ions and solutes, at known concentrations $c_i$. Through careful measurements and comparison to the nearly-pure solvent case, we have determined a set of activities $a_i$ and/or activity coefficients $\gamma_i$ that describe the non-ideality in our solution. All seems good, but our conclusion is non-unique, and there are other sets of $\gamma_i$ that equally well describe the non-ideality!

### Ion activity ambiguity in the language of $V_i$

The problem is that our thermodynamic measurements really only have access to $V_i$'s, and the position of the $V^{\circ}_i$ ladder is only inferred.

The following transformation shifts the ${V^{\circ}_i}$ ladder to ${V^{\circ}_i}'$, and produces an equally valid collection of values $\gamma_i '$ and $a_i'$:

$$ {V^{\circ}_i}' = V^{\circ}_i - \lambda , $$

$$ \gamma_i ' = \gamma_i \exp([z_i F / (RT)] \cdot \lambda) , $$

$$ a_i ' = a_i \exp([z_i F / (RT)] \cdot \lambda) , $$

for any value of $\lambda$. For example, with $\lambda=\tfrac{RT}{F}\ln(0.1) = -59~\mathrm{mV}$ we can lower the entire $V^{\circ}_i$ ladder by 59 mV, and multiply $a_i$ and $\gamma_i$ for $\mathrm{[]^+}$ ions by ×10, multiply $a_i$ and $\gamma_i$ for $\mathrm{[]^{2-}}$ ions by ×0.01, and so on.

This is a *severe* form of arbitrariness, not merely a simple one-time offset but instead a continuum of offsets. We can choose a different value of $\lambda$ for each kind of solution in each set of conditions. If we have a curve of some ion's activity vs concentration, we can turn it into any other curve by making $\lambda$ vary with concentration (and adjusting all other ions' activities accordingly). This ambiguity seems troublesome, but on the other hand, it is purely a mathematical obstacle that we have unintentionally created, by trying to relate non-ideal solutions to ideal solutions.

As we'll see below, this ambiguity gets fixed in practice by:
* adopting an ion activity convention, or,
* focussing on activity combinations that are unaffected by the ambiguity.

### Mean activity / mean activity coefficient

There are certain products of ion activities or ion activity coefficients that are overall charge-neutral, and so the $\lambda$ arbitrariness cancels out. That makes them unambiguously measurable. These are known as **mean activities** or **mean activity coefficients**. For example, products like $\gamma_{\mathrm{Na}^+}\cdot\gamma_{\mathrm{Cl}^-}$, or $\sqrt{\gamma_{\mathrm{Zn}^{2+}}} \cdot \gamma_{\mathrm{Cl}^-}$ are measurable. These relate to species voltage differences like $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ and $V_{\mathrm{Zn}^{2+}} - V_{\mathrm{Cl}^-}$, respectively.

In general a measurable mean activity (or coefficient) has the form $\prod_{i} a_i ^{w_i / z_i}$ for some weights $w_i$. Let's see what form the $w_i$ need to have. We can perform the $\lambda$-transformation on $\prod_{i} a_i ^{w_i / z_i}$ and see that:
$$\prod_{i} (a_i) ^{w_i / z_i} = \Big[\prod_{i} (a_i') ^{w_i / z_i}\Big] \cdot \exp\Big(\tfrac{RT}{F} \lambda \times \sum_i w_i \Big) . $$
Therefore, in order to be insensitive to $\lambda$, the weights $w_i$ must be zero-sum:
$$\sum_i w_i = 0.$$
Then $\prod_{i} (a_i) ^{w_i / z_i} = \prod_{i} (a_i') ^{w_i / z_i}$, and likewise $\prod_{i} (\gamma_i) ^{w_i / z_i} = \prod_{i} (\gamma_i') ^{w_i / z_i}$.

A mean activity like this corresponds to a sum of $V_i - V_j$ differences, i.e., a linear combination of voltages $\sum_i w_i V_i$ with zero-sum weights $w_i$:

$$
\sum_i w_i V_i = \sum_i w_i V^\circ_i + \tfrac{RT}{F} \ln \prod_i a_i^{w_i / z_i}.
$$

Here, $\sum_i w_i V^\circ_i$ is also insensitive to the overall offset (including $\lambda$ arbitrariness) because it has zero-sum weights, so it is a constant for given solvent and $w_i$'s.

### Activity-fixing conventions

Now, let's touch on some various conventions that are used to set ionic activities. In general these conventions are all regarded as "extra-thermodynamic", based on some approximate microscopic argument about what the real activity ought to be, or something equivalent to that. The Debye–Hückel theory is a good start but it only gets you so far.

**{% wiki "Bates–Guggenheim convention" %}**: this assigns a specific activity function for $\mathrm{Cl}^-$ ions as a function of their concentration. It is used in the analysis of a primary pH standard (the Harned cell) where fixing $\gamma_{\mathrm{Cl}^-}$ leads to fixing $a_{\mathrm{H}^+}$.

**MacInnes convention**: this assigns equal activity coefficients to the potassium and chloride ions: $\gamma_{\mathrm{K}^+} = \gamma_{\mathrm{Cl}^-}$. It appears to be popular for tabulated ion activities that are fitted to empirical {% wiki "Pitzer equations" %}.

**TATB hypothesis**: the idea that the tetraphenyl arsonium cation and tetraphenyl borate anion should behave symmetrically since they are large and complementary. This assigns equal activity coefficient to these two ions.

**Liquid junction convention**: sometimes it is assumed that the liquid junction potential (see below) is zero between two solutions, or otherwise takes on some expected value. This assumption is valid provided we redefine activities to make it so.

These generally agree (except the last one) for dilute solutions where the main form of nonideality comes from the long-range ionic atmosphere effects, which are indeed symmmetrical for ions of $\pm z$ charge. But the conventions do diverge as we move beyond dilute solutions. Quantitatively, the disagreements in $a_i$ might amount to perhaps tens of percent between different conventions, and tens of millivolts in various potentials. This might be disastrous (in precision metrology) or negligible (in battery research). Anyway, regardless of which convention is chosen, and regardless of the accuracy of their motivations, the convention choice has no impact on final observable results.

Of course, the conventions are technically all incompatible. This is the source of some difficulties with precision usage of single-ion activities, such as pH which is *notionally* defined as $\log_{10}(a_{\mathrm{H}^+})$. If I understand the current state of affairs correctly, precision pH values are actually defined *operationally* in a way that traces back to a specific activity convention (the Bates–Guggenheim convention). In other conventions, the value of $\log_{10}(a_{\mathrm{H}^+})$ will then deviate from pH (the deviation being of order 0.1 for concentrated acids around 0 pH). Unforutnately the pH activity convention is in uncommon in other contexts, so it is technically improper to make a pH measurement and then to compute $a_{\mathrm{H}^+} = 10^{-\mathrm{pH}}$ in most contexts.

## Comparison: ionic activity ambiguity in standard chemistry of ions

In the standard chemistry of ions we notionally decompose the electrochemical potential as so:

$$\bar\mu_i = z_i F\phi + \mu^\circ_{\mathrm{int},i} + RT \ln a_i . $$

Here the electrostatic potential $\phi$ is notionally supposed to be a physical quantity, something independent of the thermodynamics. The standard state's $\mu^\circ_{\mathrm{int},i}$ is a constant for solute $i$ in given solvent. Compared to the above discussion, it seems this should leave no ambiguity at all: there is an objective physical $\phi$ so this defines a physical $\mu^\circ_{\mathrm{int},i}$ and physical ionic activity $a_i$.

But there is a major problem: $\phi$ itself is experimentally inaccessible, and in particular *we cannot even measure the variations of $\phi$* as solute concentrations are changed. This means the true single-ion activities $a_i$ are inaccessible by experimental means. Yet, one often sees plots of single-ion activities. The answer to this paradox is that the above equation is reinterpreted into the definition of $\phi$ based on a practial convention for $a_i$'s. The true $a_i$ and true $\phi$ are in fact abandoned.

In other words, we should really say that $\bar\mu_i$ is decomposed as so:

$$\bar\mu_i = z_i F\phi' + \mu^\circ_{\mathrm{int},i} + RT \ln a_i $$

which serves as a *definition* of $\phi'$, an "electrostatic potential" that no longer needs to correspond to any precise physical electrical property. The flexibility in choosing an activity convention (i.e., defining the concentration-dependence of $\phi'$ regardless of what $\phi$ is actually doing) basically takes advantage of the $\lambda$-shifting property described in the previous section.

There has actually been a huge amount of debate about the problem of single-ion activities and whether they are merely operationally difficult to access, or they are fundamentally ill-defined. My viewpoint, [which I'll argue more in my later topic about $\phi$](../phi/), is that we can actually in principle establish a true electrostatic potential $\phi$, but the problem is that the calculation of $z_i F \phi$ for any ion has no physical meaning. Hence, there is no physical meaning to the decomposition of $\bar\mu_i$ into $\mu_{\mathrm{int},i} + z_i F \phi$. Even in an omniscient computer simulation with knowledge of the true $\phi$, a calculation of $z_i F \phi$ is *artificial* and merely ends generating one activity convention among many. The practical activity conventions are preferable since at least they are experimentally useful.

### Liquid junction potentials and electrode potentials

The usage of a conventional $a_i$ (and its conventional $\phi'$) does create a subtlety in the definition of liquid junction potentials (LJP). Nominally the LJP is the step $\phi_1 - \phi_2$ between two solutions separated by some kind of junction. But, again, the relevant factor in experiments is not the "true LJP", but instead a practical $\mathrm{LJP} = \phi_1' - \phi_2'$. The latter is what we need when we want to be consistent with electrochemistry formulas that rely on single-ion activities, such as the {% wiki "Nernst equation" %} for electrode potentials. The Nernst equation requires that electrode potentials vary logarithmically with a single-ion activity (or some product of activities that is not charge balanced), which means we have $E = V_{\mathrm{e}^-} - \phi'$ (and not $\phi$). So, for a cell including a junction then the measured voltage is $E_{12} = E_1 + \phi_1' - \phi_2' - E_2$.

This seems unfortunate since the true $\phi_1 - \phi_2$ is an objective physical quantifier of the real charge double layer and built-in electric fields that exist at/near the junction. But when we dig into the microscopics, we see that ions do not care about this objective aspect of junctions. For an ion, $z_i F (\phi_1 - \phi_2)$ does *not* represent the potential step that it experiences, and in fact ions never even see the 'raw' electric field $\nabla \phi$ except in idealized cases. As an extreme example, this $\phi_1 - \phi_2$ between different solvents would be contaminated by changes in the average atomic core electric potentials of solvent (which $\phi$ includes, but ions would never see). So, even in junctions we see that $\phi$ is of dubious value.

### Relating $\phi'$ to $V^{\circ}_i$

Let's say we are using the same activities for our $V_i$ framework as in our traditional $\phi'$ framework. We then find that
$$V^{\circ}_i = \phi' + \mu^\circ_{\mathrm{int},i}/(z_i F).$$
Since the $\mu^\circ_{\mathrm{int},i}$ are constants, then this means $\phi'$ actually sits fixed at some position on our $V^{\circ}_i$ ladder and they move rigidly together.

Not everything is nailed down, however, as there remains an overall single degree of freedom per solvent: keeping everything else the same, we may freely redefine
$$\phi' \rightarrow \phi' - \delta$$
provided we also redefine all the ionic standard internal chemical potentials,
$$\mu^\circ_{\mathrm{int},i} \rightarrow \mu^\circ_{\mathrm{int},i} + z_i F \delta. $$
This shift leaves $\bar\mu_i$, $a_i$, and even $V^{\circ}_i$ totally unchanged. Note this $\delta$ shifting (one degree of freedom per solvent) is different from the aforementioned $\lambda$ shifting (infinite degrees of freedom per solvent).

The $\delta$ degree of freedom means that we can freely shift $\phi'$ to any desired place on the $V^{\circ}_i$ ladder. Given all the difficulties with activities and the dubious nature of a true $\phi$, there's no reason why we shouldn't take advantage of this. Indeed by adopting an activity convention, then we have already abandoned the pretense of $\phi'$ being a true electrostatic potential. And the $\mu^\circ_{\mathrm{int},i}$ constants don't care about being shifted since they have no meaning except in combination with $\phi'$. 

So, we could simply pin $\phi' = V^{\circ}_{\mathrm{H}^+}$, which puts $\mu^\circ_{\mathrm{int},\mathrm{H}^+} = 0$.

More precisely, we can set $\phi' = V^{\circ}_{\mathrm{H}^+} - \mu^{\text{SHE}}_{\mathrm{H_2}}/(2F)$, i.e., $\mu^\circ_{\mathrm{int},\mathrm{H}^+} = \mu^{\text{SHE}}_{\mathrm{H_2}}/2 $. This would set $\phi'$ to the standard hydrogen electrode (SHE) in the given solvent. Here $\mu^{\text{SHE}}_{\mathrm{H_2}}$ is the chemical potential of the hydrogen gas in the SHE; see [the Potentials topic](../potentials/) for more information about the SHE. Then, all SHE-referenced electrode potentials would equal $V_{\mathrm{e}^-} - \phi'$ under all conditions.

Of course the SHE is not necessarily convenient, so a similar pinning of $\phi'$ can be done using any other reference electrode (such as the ferrocenium-ferrocene electrode).

Anyway, by conventionally pinning $\phi'$ in such a manner for all solvents, and adopting clear activity conventions for each solvent, then this would make liquid junction potentials $\phi_1' - \phi_2'$ well defined under all circumstances, even between non-ideal solutions with differing solvents.

## Concentration ambiguity

It is worth mentioning that there is another unrelated ambiguity that affects activity coefficient $\gamma_i$ but not activity $a_i$, and this has to do with the ambiguity in how we count ionic solutes. This is not particular to ions, as it affects non-ionic solutes too.

As a classic example, consider copper (ii) sulfate ($\mathrm{CuSO_4}$) dissolving into water. [If you look up data for this](https://doi.org/10.1016/j.eti.2024.103847), you will see that the mean activity coefficient $\gamma_{\mathrm{Cu}^{2+}} \gamma_{\mathrm{SO_4}^{2-}}$ plummets rapidly towards zero as the salt concentration is increased. But this is largely because we are formally counting the $\mathrm{Cu}^{2+}$ and $\mathrm{SO_4}^{2-}$ concentrations as if they are fully dissociated free ions, but in fact they are readily forming ion pairs. If we instead count the "paired" aqeuous $\mathrm{CuSO_4}\cdot n\mathrm{H_2O}$ as a separate species, then it will reduce our count of $\mathrm{Cu}^{2+}$ and $\mathrm{SO_4}^{2-}$ ions. But this mental recounting cannot affect the actual $V_i$'s or activities, so the activity coefficients must increase to compensate for a reduced count of free ions. If we were to recalculate and replot $\gamma_{\mathrm{Cu}^{2+}} \gamma_{\mathrm{SO_4}^{2-}}$ based only on free ion concentrations, we'd get a curve sitting much closer to 1.

Similarly, in describing the activity coefficient of aqueous sulfuric acid $\mathrm{H_2SO_4}$, we might describe it as dissociating into $\mathrm{SO_4}^{2-}$ and two $\mathrm{H}^+$, which will be reasonable at dilute concentrations. At high concentrations, the 'pairing' of one $\mathrm{H}^+$ and one $\mathrm{SO_4}^{2-}$ into $\mathrm{HSO_4}^-$ becomes significant (and becomes dominant for pH of 2 and below). In the [Solutions topic](../solutions/) data table for aqueous ions, we have data for both $V^\circ_{\mathrm{SO_4}^{2-}}$ and $V^\circ_{\mathrm{HSO_4}^{-}}$; whether we included $V^\circ_{\mathrm{HSO_4}^{-}}$ or not would strongly impact the required values of both $\gamma_{\mathrm{SO_4}^{2-}}$ and $\gamma_{\mathrm{H}^{+}}$.

{# In the [Solutions topic](../solutions/) data table for aqueous ions, we saw $V^\circ_{\mathrm{SO_4}^{2-}} - V^\circ_{\mathrm{H}^+} = +3.8583~\mathrm{V}$, but also a level defined for the associated form, $V^\circ_{\mathrm{HSO_4}^{-}} - V^\circ_{\mathrm{H}^+} = +7.8345~\mathrm{V}$. The latter only becomes relevant for high enough $\mathrm{H}^+$ concentration. Specifically from this data and assuming ideally-dilute behaviour, we see that at concentration $c_{\mathrm{H}^+} = 0.0102~\mathrm{mol/L}$ (i.e., a pH of 1.99), the $\mathrm{SO_4}^{2-}$ and $\mathrm{HSO_4}^-$ concentrations become equal. #}

Basically, this is the distinction between a formal/nominal solute concentration, as compared to a "real" free solute concentration. It can be advantageous to explicitly include more forms of solutes in our analysis (like the ion pairs), which can help extract out annoying behaviours from the the activity coefficients. On the other hand, having the extra forms also adds more free parameters, and may not simplify matters in highly concentrated solutions that are fully non-ideal.

### No solvation ambiguity

It is important to remind that all the standard states of solutes, such as $\mu^\circ_{\mathrm{int},i}$ and $V^\circ_i$, will always refer to 'fully solvated' ions: the ions are ideally dilute, being far from other solutes, but they are subject to arbitrarily complicated and real influence of the solvent medium. It is normal that an ion will exert a severe disturbance on the solvent around it, and that disturbance is fully included in the definition of the standard state.

For example, when we refer to an $\mathrm{H}^+$ ion we are always referring the total concentration of a lumped group of species: $\mathrm{H}^+$, $\mathrm{H_3O}^+$, $\mathrm{H_5O_2}^+$, and so on. The actual concentration of 'naked proton' $\mathrm{H}^+$ is going to be a tiny fraction of the lumped $\mathrm{H}^+$ concentration.

Insofar as counting, there is not much point in trying to distinguish the differing hydration levels as distinct species. First, it would be hard to distinguish them. Second, we would have to actually redefine the existing standard state $V^\circ_i$ positions and add new positions. E.g., $V^\circ_{\mathrm{H}^+}$ would have to be greatly increased to reflect the rarity of naked protons, and the `actual $\mathrm{H}^+$ activity' would be tiny (very inconsistent with the usual pH definition!).

Still, as we approach more and more concentrated solutions it is important to remember that our standard states refer to ions bathed in infinite solvent. We expect non-idealities not just because solutes are interacting, but also because the solutes have less and less solvent available to them, yet we are still referencing them to a fully solvated form.

(And despite all of this, the thermodynamic quantities $V_{\mathrm{H}^+}$, $V_{\mathrm{H_3O}^+}$, etc. are all distinct and well defined (each one being incrementally offset by $\mu_{\mathrm{H_2O}}/F$), even if they don't have distinct counts / standard states. If we had a semipermeable membrane that somehow only permitted exact $\mathrm{H_7O_3}^+$ ions to pass, then $V_{\mathrm{H_7O_3}^+}$ is the voltage that would equilibrate across the membrane!)

## Takeaways

Ionic solutes tend to be non-ideal, which begs for them to be treated with activities or activity coefficients. But, the concept of single-ion activity can be surprisingly subtle. There is a fundamental ambiguity which requires us to specify some kind of convention, and since there are many different slightly incompatible conventions, things can get imprecise.

For activity coefficients (but not activities), there is also the issue of how we are counting solute concentrations, and in particular whether we are including dissociated / associated forms explicitly or implicitly.

[**NEXT TOPIC: Non-equilibrium**](../nonequilibrium/)

{#

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>

</details>
#}
