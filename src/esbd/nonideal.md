---
layout: layouts/esbd_topic.njk
title: 'Non-ideal solutions'
tags: [page, esbd_topic]
orderESBD: 72
eleventyNavigation:
    key: Non-ideal solutions
    parent: ESBD
    order: 72
---

# {{title}}

Earlier in the [Solutions](../solutions/) topic we touched a bit on non-ideal solutions. I'd like to touch on how there is a fundamental aspect of ambiguity in the ionic activity $a_i$ and the overall placement of the $V^\circ_i$ ladder. This is a well-known issue for ion chemistry and I just want to re-explain how it appears with the $V_i$'s.

To be specific, we are concerned with cases where solutes deviate from an ideal-dilute logarithmic dependence on concentration. This is commonly captured as an activity activity coefficient $\gamma_i$ that acts as a fudge factor on the concentration. The species voltage then takes the form:

$$ V_i = V^\circ_i + \frac{RT}{z_i F} \ln(\gamma_i b_i/b^\circ). $$

for reference molality $b^\circ = 1~\mathrm{mol/kg}$. I'm going to use molality in this topic just to match the chemists' preference, particularly in regards to defining activity coefficients.^[[IUPAC Gold Book "Activity coefficient"](https://goldbook.iupac.org/terms/view/A00116)]

The expectation is that when *all* solutes' concentrations go 0, then $\gamma_i$ should approach 1 for all solutes. This is a physical/definitional convention: first, $\gamma_i$ is guaranteed to converge to a finite constant at low concentration provided that the species $i$ is actually present in solution as independent solute particles^[If we misidentify the solute particle, then a {% wiki "van 't Hoff factor" %} appears that multiplies the result of the logarithm.] (i.e. that it neither dissociates nor associates); then, the entire $V^\circ_i$ ladder is defined to make this convergent finite constant equal 1 in the limit where all solute concentrations go to zero.

> **Ideal-dilute means all ions are dilute**: If *any* solute's concentration is significantly nonzero, then *all* $\gamma_i$ may be nonzero, even for other solutes that themselves are infinitely dilute. The other dilute solutes will still behave ideally dilutely for low concentrations, however they will start out with $\gamma_i \neq 1$. This reflects that they are dilute in an effective "new solvent" that is not the original pure solvent that was used to define $V^\circ_i$. E.g. if we add dilute $\mathrm{KI}$ to water with a preexisting concentration of $\mathrm{NaCl}$, then $\gamma_{\mathrm{K}^+} \neq 1$.

> **On molality/molarity**: In water, the molal $V^\circ_i$ and the molar $V^\circ_i$ are practically identical, because $b^\circ = 1~\mathrm{mol/kg}$ is practically the same as $c^\circ = 1~\mathrm{mol/L}$. In other solvents though you'd have to separately define $V^{b^\circ}_i$ and the molar $V^{c^\circ}_i$, as well as distinct activities $a^{b^\circ}$ and $a^{c^\circ}$. But in all cases, *even in water*, the molal activity coefficient $\gamma_i$ is *not* the same as the molar activity coefficient; to avoid confusion we will not use the molar activity coefficient ever.

> **Ideal mixtures vs. ideal-dilute**: In chemistry there are two kinds of idealized solution. In an {% wiki "ideal mixture" %}, the solute and solvent chemical potential both vary exactly with the logarithm of mole fraction. This reflects a case where solute-solvent, solute-solute, and solvent-solvent interactions all have the same character, and it corresponds to {% wiki "Raoult's law" %} for both the solute and solvent. That is distinct from the *ideal-dilute* form, which we are interested in, which represents a case where solute particles may have very messy and irregular interactions with the solvent, yet all the dilute solute particles are independent from other dilute solute particles and thus behave (entropically) like an ideal gas. This leads to the solutes following {% wiki "Henry's law" %}, though interestingly it remains guaranteed that the *solvent* follows Raoult's law in this case too.^[Interestingly, Henry's law (for dilute solutes) automatically implies (via the {% wiki "Gibbs–Duhem relation" %}) an *effective* Raoult's law for the *solvent*'s chemical potential, and this why {% wiki "colligative properties" %} like osmotic pressure are guaranteed. In other words, {% wiki "Raoult's law" %} is guaranteed for the solvent provided the solutes are dilute, and that has nothing to do with ideal mixtures nor any of their associated concepts like "entropy of mixing" or "solvent dilution"; chemistry textbooks are often not clear on this point.]

## It does matter: ionic non-idealities are strong

Should we really care about non-idealities? Yes! In fact ions depart from the ideally-dilute case already at surprisingly low concentrations (e.g., $0.001~\mathrm{mol/L}$ in water), at least compared to non-ionic solutes which might only depart after $0.1~\mathrm{mol/L}$.

Ions show early non-ideality due to "ionic atmosphere" effects, i.e., how ions screen their fellow ions at medium range distances. This represents a form of correlation between the positions of ions, which violates our ideal-dilute assumption that the ions are moving around independently of each other. The crucial (and robust) effect of ionic atmosphere, as encountered in {% wiki "Debye–Hückel theory" %}, is that the activity coefficients of ions deviate proportionally to the square root of concentration, $\ln\gamma_i \propto -\sqrt{I}$, where $I$ is the {% wiki "ionic strength" %}, a weighted sum of all ionic concentrations. By comparison, with non-ionic solutes the leading order deviation of activity coefficient is in the first power of concentration.

There is a lot more that can be said about the microscopic details.^[For example, if you have an ionic solution and add a new dilute ionic solute, then it will not significantly change $I$ and its effect will be first-order too. Logically, this must apply for pure water which has a preexisting nonzero ionic strength due to spontaneous autoionization. That means that technically all dilute ions added to water have $\gamma_i$ varying to first order in concentration! But the linearity only holds for tiny concentrations up to $\sim 10^{-7}~\mathrm{mol/L}$, after which the new ion is going to significantly add to $I$.] But really, the main point is that non-idealities readily manifest with ions at the usual concentrations seen in experiments. So, we really ought to care about the non-idealities of ions!

That said, being off by a factor of 2 in the activity of an ion might only correspond to a voltage error of $RT\ln(2)/F \approx 17~\mathrm{mV}$, so for imprecise work, electrochemists can often get away with ignoring the non-ideality. And due to the ambiguities in activity (discussed next), it can be annoying to properly incorporate non-ideality.

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

As we'll see below, this ambiguity gets addressed in practice by:
* focussing on activity combinations that are unaffected by the ambiguity, or,
* adopting an ion activity convention.

### Mean activity / mean activity coefficient

There are certain products of ion activities or ion activity coefficients that are overall charge-neutral, and so the $\lambda$ arbitrariness cancels out. That makes them unambiguously measurable. These are known as **mean activities** or **mean activity coefficients**. For example, products like $\gamma_{\mathrm{Na}^+}\cdot\gamma_{\mathrm{Cl}^-}$, or $\sqrt{\gamma_{\mathrm{Zn}^{2+}}} \cdot \gamma_{\mathrm{Cl}^-}$ are measurable. These relate to species voltage differences like $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ and $V_{\mathrm{Zn}^{2+}} - V_{\mathrm{Cl}^-}$, respectively.

In general a measurable mean activity has the form $\prod_{i} a_i ^{w_i / z_i}$ for some weights $w_i$.
$$\sum_i w_i = 0.$$
The same condition applies for activity coefficients $\prod_{i} \gamma_i ^{w_i / z_i}$.

Let's prove this. We can perform the $\lambda$-transformation on $\prod_{i} a_i ^{w_i / z_i}$ and see that:
$$\prod_{i} (a_i) ^{w_i / z_i} = \Big[\prod_{i} (a_i') ^{w_i / z_i}\Big] \cdot \exp\Big(\tfrac{RT}{F} \lambda \times \sum_i w_i \Big) . $$
Therefore, in order to be insensitive to $\lambda$, the weights $w_i$ must be zero-sum. $\prod_{i} (a_i) ^{w_i / z_i} = \prod_{i} (a_i') ^{w_i / z_i}$, and likewise $\prod_{i} (\gamma_i) ^{w_i / z_i} = \prod_{i} (\gamma_i') ^{w_i / z_i}$.

A mean activity like this corresponds to a sum of $V_i - V_j$ differences, i.e., a linear combination of voltages $\sum_i w_i V_i$ with zero-sum weights $w_i$:

$$
\sum_i w_i V_i = \sum_i w_i V^\circ_i + \tfrac{RT}{F} \ln \prod_i a_i^{w_i / z_i}.
$$

Here, $\sum_i w_i V^\circ_i$ is also insensitive to the overall offset (including $\lambda$ arbitrariness) because it has zero-sum weights, so it is a constant for given solvent and $w_i$'s.

### Activity-fixing conventions

Now, let's touch on some various conventions that are used to set ionic activities. In general these conventions are all regarded as "extra-thermodynamic", based on some approximate microscopic argument about what the real activity ought to be, or something equivalent to that. The Debye–Hückel theory is a good start but it only gets you so far.

**{% wiki "Bates–Guggenheim Convention" %}**: this assigns a specific activity function for $\mathrm{Cl}^-$ ions as a function of their concentration. It is used in the analysis of a primary pH standard (the Harned cell) where fixing $\gamma_{\mathrm{Cl}^-}$ leads to fixing $a_{\mathrm{H}^+}$.

**MacInnes convention**: this assigns equal activity coefficients to the potassium and chloride ions: $\gamma_{\mathrm{K}^+} = \gamma_{\mathrm{Cl}^-}$. It appears to be popular for tabulated ion activities that are fitted to empirical {% wiki "Pitzer equations" %}.

**TATB hypothesis**: the idea that the tetraphenyl arsonium cation and tetraphenyl borate anion should behave symmetrically since they are large and complementary. This assigns equal activity coefficient to these two ions.

**Liquid junction convention**: sometimes it is assumed that the liquid junction potential (see below) is zero between two solutions, or otherwise takes on some expected value. This assumption is valid provided we redefine activities to make it so.

The first three conventions generally agree for semi-dilute solutions where the main form of nonideality comes from the long-range ionic atmosphere effects, which are indeed symmmetrical for ions of $\pm z$ charge. But the conventions do diverge as we move beyond dilute solutions. Quantitatively, the disagreements in $a_i$ might amount to perhaps tens of percent between different conventions, and tens of millivolts in various potentials. This might be disastrous (in precision metrology) or negligible (in battery research). Anyway, regardless of which convention is chosen, and regardless of the accuracy of their motivations, the convention choice has no impact on actual observable results.

Of course, the conventions are technically all incompatible. This is the source of some difficulties with precision usage of single-ion activities, such as pH which is *notionally* defined as $\log_{10}(a_{\mathrm{H}^+})$. Precise pH values are actually defined *operationally* in a way that traces back to the Bates–Guggenheim convention. In other conventions, the value of $\log_{10}(a_{\mathrm{H}^+})$ will then deviate from pH (the deviation being of order 0.1 for concentrated acids around 0 pH). Unforutnately the pH activity convention is in uncommon in other contexts, so it is almost always imprecise to make a pH measurement and then to compute $a_{\mathrm{H}^+} = 10^{-\mathrm{pH}}$.

## Comparison: ionic activity ambiguity in standard chemistry of ions

In the standard chemistry of ions we notionally decompose the electrochemical potential as so:

$$\bar\mu_i = z_i F\phi + \mu^\circ_{\mathrm{int},i} + RT \ln a_i . $$

Here, we have:
* $\bar\mu_i$, the fundamental thermodynamic chemical potential for an ion, which like $V_i$ can be accessed (aside from a single, global electrostatic offset).
* $\mu^\circ_{\mathrm{int},i}$, a fixed value for solute $i$ in given solvent; it has nothing to do with non-ideality and is purely a function of the local influence of a single, solitary solute on an otherwise pure solute.
* $\phi$, an inaccessible yet supposedly physical quantity, something independent of the thermodynamics.

It seems this should leave no ambiguity at all: everything besides activity $a_i$ is determined, therefore this equation uniquely must determine physical ionic activity $a_i$. And so it is often argued that we could know the "true $a_i$" if not for the "true $\phi$" being inaccessible.

But this raises a contradiction if we choose an activity convention. We are then setting $a_i$, and therefore we are setting $\phi$ (up to a single, constant offset per solvent). If $a_i$ is subjective then so must $\phi$ be, which totally contradicts the idea that $\phi$ is a real quantity.

The answer to this paradox is that the above equation is reinterpreted into a redefinition of $\phi$ based on a practial convention for $a_i$'s. The true $\phi$ is in fact abandoned.

In other words, we should really say that $\bar\mu_i$ is decomposed as so:

$$\bar\mu_i = z_i F\phi' + \mu^\circ_{\mathrm{int},i} + RT \ln a_i $$

which serves as a *definition* of $\phi'$, an "electrostatic potential" that no longer needs to correspond to any precise physical electrical property. The flexibility in choosing an activity convention (i.e., defining the concentration-dependence of $\phi'$ regardless of what $\phi$ is actually doing) basically takes advantage of the $\lambda$-shifting property described in the previous section.

There has actually been a huge amount of debate about the problem of single-ion activities and whether they are merely operationally difficult to access, or they are fundamentally ill-defined. My viewpoint, [which I'll argue more in my later topic about $\phi$](../phi/), is that yes, we can actually in principle establish a true average electrostatic potential $\phi$, but there is a deeper problem in that $\phi$ is not even meaningful in this context. I.e., the calculation of $z_i F \phi$ for any ion has no physical meaning. Hence, there is no physical meaning to the decomposition of $\bar\mu_i$ into $\mu_{\mathrm{int},i} + z_i F \phi$. Even in an omniscient computer simulation with knowledge of the true $\phi$, a calculation of $z_i F \phi$ is *artificial* and merely ends generating one activity convention among many. The practical activity conventions are preferable since at least they are experimentally useful.

### Liquid junction potentials and electrode potentials

The usage of a conventional $a_i$ (and its conventional $\phi'$) does create a subtlety in the definition of liquid junction potentials (LJP). Nominally the LJP is the step $\phi_1 - \phi_2$ between two solutions separated by some kind of junction. But, again, the relevant factor in experiments is not the "true LJP", but instead a practical $\mathrm{LJP} = \phi_1' - \phi_2'$. The latter is what we need when we want to be consistent with electrochemistry formulas that rely on single-ion activities, such as the {% wiki "Nernst equation" %} for electrode potentials. The Nernst equation requires that electrode potentials vary logarithmically with a single-ion activity (or some product of activities that is not charge balanced), which means we have $E = V_{\mathrm{e}^-} - \phi'$ (and not $\phi$). So, for a cell including a junction then the measured voltage is $E_{12} = E_1 + \phi_1' - \phi_2' - E_2$.

This seems unfortunate since the true $\phi_1 - \phi_2$ is an objective physical quantifier of the real charge double layer and built-in electric fields that exist at/near the junction. But when we dig into the microscopics, we see that ions do not care about this objective aspect of junctions. For an ion, $z_i F (\phi_1 - \phi_2)$ does *not* represent the potential step that it experiences, and in fact ions never even see the 'raw' electric field $\nabla \phi$ except in idealized cases. As an extreme example, this $\phi_1 - \phi_2$ between different solvents would be contaminated by changes in the average atomic core electric potentials of solvent (which $\phi$ includes, but ions would never see). So, even in junctions we see that $\phi$ is of dubious value.

### Relating $\phi'$ to $V^{\circ}_i$

Let's say we are using the same activities for our $V_i$ framework as in our traditional $\phi'$ framework. We then find that
$$V^{\circ}_i = \phi' + \mu^\circ_{\mathrm{int},i}/(z_i F).$$
Since the $\mu^\circ_{\mathrm{int},i}$ are constants, then this means $\phi'$ actually sits fixed at some position on our $V^{\circ}_i$ ladder and they move rigidly together.

Interestingly, there remains an overall single degree of freedom per solvent: keeping everything else the same, we may freely redefine
$$\phi' \rightarrow \phi' - \delta$$
provided we also redefine all the ionic standard internal chemical potentials,
$$\mu^\circ_{\mathrm{int},i} \rightarrow \mu^\circ_{\mathrm{int},i} + z_i F \delta. $$
This shift leaves $\bar\mu_i$, $a_i$, and even $V^{\circ}_i$ totally unchanged. Effectively we can freely choose where we want $\phi'$ to sit on the $V^{\circ}_i$ ladder. If chemists wanted they could actually use this to make liquid junction potentials $\phi_1' - \phi_2'$ well defined under all circumstances.[^longnote]

[^longnote]:
    By adopting activity conventions, we have already abandoned the pretense of $\phi'$ being a true electrostatic potential, so we might as well put $\phi'$ somewhere convenient. Some options:
    {# pbreak #}
    * Pin $\phi' = V^\circ_{\mathrm{H}^+}$, which puts $\mu^\circ_{\mathrm{int},\mathrm{H}^+} = 0$.
    * Pin $\phi' = V^\circ_{\mathrm{SHE}}$, which is $\phi' = V^{\circ}_{\mathrm{H}^+} - \mu^{\text{SHE}}_{\mathrm{H_2}}/(2F)$. This would set $\phi'$ to the standard hydrogen electrode (SHE) in the given solvent. Here $\mu^{\text{SHE}}_{\mathrm{H_2}}$ is the chemical potential of the hydrogen gas in the SHE; see [the Potentials topic](../potentials/) for more information about the SHE. Then, all SHE-referenced electrode potentials would equal $V_{\mathrm{e}^-} - \phi'$ under all conditions.
    * Pin $\phi'$ to the ferrocenium-ferrocene electrode, which is often more appropriate in nonaqueous solvents.
    {# pbreak #}
    This would make liquid junction potentials $\phi_1' - \phi_2'$ well defined under all circumstances, even between non-ideal solutions with differing solvents, providing we have established a $\phi'$ convention for each solvent.

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
