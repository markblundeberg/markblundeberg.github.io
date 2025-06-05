---
layout: layouts/esbd_topic.njk
title: 'Non-ideal solutions'
tags: [page, esbd_topic]
orderESBD: 25
eleventyNavigation:
    key: Non-ideal solutions
    parent: ESBD
    order: 25
---

# {{title}}

Earlier in the [Solutions](../solutions/) topic we touched a bit on non-ideal solutions. To be specific, we are concerned with cases where solutes deviate from an ideal-dilute logarithmic dependence on concentration.

Again, this is commonly captured as an activity activity coefficient $\gamma_i$ that acts as a fudge factor on the concentration $c_i$. The species voltage then takes the form:

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

Should we really care about non-idealities? Yes! In fact ions depart from the ideally-dilute case already at surprisingly low concentrations (e.g., $0.001~\mathrm{mol/L}$), at least compared to non-ionic solutes which might only depart after $0.1~\mathrm{mol/L}$.

Ions show early non-ideality due to "ionic atmosphere" effects, i.e., how ions screen their fellow ions at medium range distances. This represents a form of correlation between the positions of ions, which violates our ideal-dilute assumption that the ions are moving around independently of each other. The crucial (and robust) effect of ionic atmosphere, as encountered from {% wiki "Debye–Hückel theory" %}, is that the activity coefficients of ions deviate proportionally to the square root of concentration, $\ln\gamma_i \propto -\sqrt{I}$, where $I$ is the {% wiki "ionic strength" %}, a weighted sum of all ionic concentrations. By comparison, with non-ionic solutes the leading order deviation of activity coefficient is in the first power of concentration.

Regardless of the precise microscopic details, however, the point is that non-idealities readily manifest with ions at the usual concentrations seen in experiments. So, we really ought to care about the non-idealities of ions!

That said, being off by a factor of 2 in the activity of an ion might only correspond to a voltage error of $RT\ln(2)/F \approx 17~\mathrm{mV}$, so for imprecise work, electrochemists can often get away with ignoring the non-ideality. And due to the ambiguities in activity (discussed next), it can be annoying to properly incorporate non-ideality.

{#
Basically, around each ion, its electric field is not only suppressed by the presence of dielectric polarization (of the solvent), but is in fact totally screened out by the presence of other ions. This represents a form of correlation between the positions of ions, which violates our ideal-dilute assumption that the ions are moving around independently of each other.

The degree of screening is quantified by the {% wiki "ionic strength" %}, $I$. Essentially, the ionic strength is an idealized estimate of the total charge density that would develop in response to shifting the $V^\circ_i$ ladder while keeping all $V_i$ constant. Such a deviation from charge neutrality is not permissible in bulk but it can develop microscopically, such as in this case.

Quantitatively, we expect to see disturbances in the activity coefficients that are proportional to the square-root of ionic strength: $\ln\gamma_i \propto -\sqrt{I}$. Crucially, $I$ grows proportionally to the concentration of added ionic solutes. Thus, we see activity coefficients of ions deviate proportional to the square root of concentration. By comparison, with non-ionic solutes that only interact with each other at short ranges, the leading order deviation of activity coefficient is in the first power of concentration.

(Technically, ionic activities deviate to first order in concentration when $I$ starts out with a nonzero value due to naturally autodissociated solvent molecules, like in pure water. But when the amount of autodissociation is so low, it puts this first-order regime at such a low concentration as to be beyond experimental uncertainty limits.)
#}


## The fundamental ambiguity of ionic activity

You may have heard that single-ion activities are ill defined, or unmeasurable; or, that only mean ionic activities can be measured. Let's talk about why that is the case.

Suppose we have solution of specific composition, containing various ions and solutes, at known concentrations $c_i$. We perform certain measurements of $V_i$, and compare to the $V^{\circ}_i$ ladders that occurs in the same solvent but in the ideally-dilute limit. This will yield certain $\gamma_i$ values that describe the non-ideality in our solution. All seems good, but our conclusion is non-unique, and there are other sets of $\gamma_i$ that equally well describe the non-ideality!

The following transformation produces an equally valid collection of values $\gamma_i '$ and ${V^{\circ}_i}'$:

$$ \gamma_i ' = \gamma_i \exp([z_i F / (RT)] \cdot \lambda) , $$

$$ a_i ' = a_i \exp([z_i F / (RT)] \cdot \lambda) , $$

$$ {V^{\circ}_i}' = V^{\circ}_i - \lambda , $$

for any value of $\lambda$. For example, with $\lambda=\tfrac{RT}{F}\ln(0.1) = -59~\mathrm{mV}$ we can lower the entire $V^{\circ}_i$ ladder by 59 mV, and multiply $a_i$ and $\gamma_i$ for $\mathrm{X^+}$ ions by ×10, multiply $a_i$ and $\gamma_i$ for $\mathrm{Y^{2-}}$ ions by ×0.01, and so on. The problem is, we can't tell the difference, because all we can measure are $c_i$ and $V_i$.

The arbitrariness is _severe_: we can choose a different value of $\lambda$ for every possible composition of solution at every temperature and every pressure, completely arbitrarily. It would make no measurable difference. This ambiguity seems troublesome, but on the other hand, it is purely a mathematical obstacle that we have unintentionally created, by trying to relate non-ideal solutions to ideal solutions.

### Mean activity / mean activity coefficient

The only unambiguously measurable ion activity coefficients are combinations that are overall charge-neutral, and so the the $\lambda$ arbitrariness cancels out. These are known as **mean activities** or **mean activity coefficients**.

For example, products like $\gamma_{\mathrm{Na}^+}\cdot\gamma_{\mathrm{Cl}^-}$, or $\sqrt{\gamma_{\mathrm{Zn}^{2+}}} \cdot \gamma_{\mathrm{Cl}^-}$ are measurable. These relate to species voltage differences like $V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$ and $V_{\mathrm{Zn}^{2+}} - V_{\mathrm{Cl}^-}$, respectively.

In general such a measurable mean activity (or coefficient) has the form $\prod_{i} a_i ^{w_i / z_i}$ for some weights $w_i$. We can perform the $\lambda$-transformation on $\prod_{i} a_i ^{w_i / z_i}$ and see that:
$$\prod_{i} (a_i) ^{w_i / z_i} = \Big[\prod_{i} (a_i') ^{w_i / z_i}\Big] \cdot \exp\Big(\tfrac{RT}{F} \lambda \times \sum_i w_i \Big) . $$
Therefore, in order to be insensitive to $\lambda$, the weights $w_i$ must be zero-sum:
$$\sum_i w_i = 0.$$
Then $\prod_{i} (a_i) ^{w_i / z_i} = \prod_{i} (a_i') ^{w_i / z_i}$, and likewise $\prod_{i} (\gamma_i) ^{w_i / z_i} = \prod_{i} (\gamma_i') ^{w_i / z_i}$.

A mean activity like this corresponds to a sum of $V_i - V_j$ differences, i.e., a linear combination of voltages $\sum_i w_i V_i$ with zero-sum weights $w_i$:

$$
\sum_i w_i V_i = \sum_i w_i V^\circ_i + \tfrac{RT}{F} \ln \prod_i a_i^{w_i / z_i}.
$$

Here, $\sum_i w_i V^\circ_i$ is also insensitive to the overall offset (including $\lambda$ arbitrariness) because it has zero-sum weights, so it is a constant for given solvent and $w_i$'s.

### The ambiguity in standard chemistry of ions

In the standard chemistry of ions we nominally decompose the electrochemical potential as so:

$$\bar\mu_i = z_i F\phi + \mu^\circ_{\mathrm{int},i} + RT \ln a_i . $$

Here the electrostatic potential $\phi$ is in principle a well-defined physical quantity independent of the thermodynamics, and the standard state's $\mu^\circ_{\mathrm{int},i}$ is a constant for solute $i$ in given solvent. Compared to the above discussion, it seems this should leave no ambiguity at all. There is a specific 'true $\phi$' so this defines a 'true ionic activity $a_i$'.

But, there is a problem, which is that $\phi$ is experimentally inaccessible. This means the true ionic activities $a_i$ are also inaccessible.

So instead, what is done in chemistry is to choose certain activity-fixing conventions (which we'll touch on next) that basically *redefine* activity $a_i$ according to:

$$\bar\mu_i = z_i F\phi' + \mu^\circ_{\mathrm{int},i} + RT \ln a_i $$

where $\phi'$ is an alternative conventionally defined potential that is displaced from the true $\phi$. Here we can see that $V^{\circ}_i = \phi' + \mu^\circ_{\mathrm{int},i}/(z_i F)$, and the flexibility in defining $\phi'$ corresponds exactly to the $\lambda$-shifting property described in the previous section.

Since the true $\phi$ is not accessible, the redefinition using $\phi'$ ends up being the actual decomposition of $\bar\mu_i$ that gets used. Note that there is still a single overall degree of freedom in $\phi'$ which is undetermined here. (Optional: we can go ahead assign the standard internal chemical potential of $\mathrm{H}^+$ to zero: $\mu^\circ_{\mathrm{int},\mathrm{H}^+} = 0$. This gives exactly $\phi' = V^{\circ}_{\mathrm{H}^+}$. Thus in some sense $V^{\circ}_{\mathrm{H}^+}$ is equivalent to the practical and conventional electrostatic potential.)

The usage of an alternative $\phi'$ and conventional $a_i$ does create a subtlety though in the definition of liquid junction potentials (the step in $\phi$ between solutions or across a salt bridge). In order for the redefined $a_i$ to work properly with classic electrochemistry formulas like the {% wiki "Nernst equation" %}, it is necessary that liquid junction potentials be defined in terms of $\phi'$, not the 'true' $\phi$. So, not only are single-ion activities ambiguous, but so are liquid junction potentials for the same reason. This is a well-known issue in discussions of electrochemistry fundamentals.

There has actually been a huge amount of debate about the problem of single-ion activities and whether they are merely operationally difficult to access, or they are fundamentally ill-defined. My viewpoint, [which I'll argue more in my later topic about $\phi$](../phi/), is that we can actually in principle establish a true electrostatic potential $\phi$ (and thus a true single-ion activity). But that is besides the point, because there is no real physical meaning to the decomposition of $\bar\mu_i$ into $\mu_{\mathrm{int},i} + z_i F \phi$! For that reason, a conventionally-defined $\phi'$ (or $V^\circ_i$) is preferable since it is at least experimentally accessible.

### Activity-fixing conventions

Now, let's touch on some various conventions that are used to set ionic activities. In general these conventions are all regarded as "extra-thermodynamic", based on some approximate microscopic argument about what the real activity or $\phi'$ ought to be. Regardless of whether the microscopic argument is valid, it always produces a valid activity convention since the convention has no impact on observable results.

**{% wiki "Bates–Guggenheim convention" %}**: this assigns a specific activity function for chloride ions as a function of their concentration, and seems to be based on arguments about the hydration levels around chloride ions. Anyway, it is primarily used in defining the activity of $\mathrm{H}^+$ ions as used to calculate pH values.

**MacInnes convention**: this assigns equal activity coefficients to the potassium and chloride ions: $\gamma_{\mathrm{K}^+} = \gamma_{\mathrm{Cl}^-}$. It appears to be popular for tabulated ion activities that are fitted to empirical {% wiki "Pitzer equations" %}.

**Liquid junction convention**: this is usually more of a sloppy, implicit assumption. In certain experiments there will be a salt bridge or liquid junction, and it will be assumed that the liquid junction potential difference is zero between the two solutions ($\phi_2 - \phi_1 = 0$). This can actually be made exactly true, provided we redefine all ionic activities to make it so (then $\phi_2' - \phi_1' = 0$).

What really matters is that the conventions are *incompatible*. For example if we measure the pH value of a certain solution according to the Bates–Guggenheim convention, then technically we cannot use that pH value in an experiment where we assume a zero liquid junction potential.

## Concentration ambiguity

It is worth mentioning that there is another ambiguity that affects activity coefficient $\gamma_i$ but not activity $a_i$, and this has to do with the ambiguity in how we count ionic solutes. This is actually more general since it affects non-ionic solutes too.

As a classic example, consider the salt copper (ii) sulfate, $\mathrm{CuSO_4}$, dissolving into water. If you look up data for this, you will see that the mean activity coefficient $\gamma_{\mathrm{Cu}^{2+}} \gamma_{\mathrm{SO_4}^{2-}}$ plummets rapidly towards zero as the salt concentration is increased. But this is largely because we are formally counting the $\mathrm{Cu}^{2+}$ and $\mathrm{SO_4}^{2-}$ concentrations as if they are fully dissociated free ions, but in fact they are readily forming ion pairs. If we count the "paired" aqeuous $\mathrm{CuSO_4}\cdot n\mathrm{H_2O}$ as a separate species, then it will reduce our count of $\mathrm{Cu}^{2+}$ and $\mathrm{SO_4}^{2-}$ ions. But this mental recounting cannot affect the actual $V_i$'s or activities, so, if we are only counting the "actually free" ions, giving them lower concentrations, then accordingly the activity coefficients must increase to compensate. So, even the mean activity coefficient $\gamma_{\mathrm{Cu}^{2+}} \gamma_{\mathrm{SO_4}^{2-}}$ is vague in the sense that we must define how we are counting the ions.

Similarly, in describing the activity coefficient of aqueous sulfuric acid $\mathrm{H_2SO_4}$, we might describe it as dissociating into $\mathrm{SO_4}^{2-}$ and two $\mathrm{H}^+$, which will be reasonable at dilute concentrations. At high concentrations however, the 'pairing' into $\mathrm{HSO_4}^-$ becomes siginificant. In the [Solutions topic](../solutions/) data table for aqueous ions, we saw $V^\circ_{\mathrm{SO_4}^{2-}} - V^\circ_{\mathrm{H}^+} = +3.8583~\mathrm{V}$, but also a level defined for the associated form, $V^\circ_{\mathrm{HSO_4}^{-}} - V^\circ_{\mathrm{H}^+} = +7.8345~\mathrm{V}$. The latter only becomes relevant for high enough $\mathrm{H}^+$ concentration. Specifically from this data and assuming ideally-dilute behaviour, we see that at concentration $c_{\mathrm{H}^+} = 0.0102~\mathrm{mol/L}$ (i.e., a pH of 1.99), the $\mathrm{SO_4}^{2-}$ and $\mathrm{HSO_4}^-$ concentrations become equal. Depending on how we count the ions, the mean activity $(\gamma_{\mathrm{H}^{+}})^2 \gamma_{\mathrm{SO_4}^{2-}}$ will change.

Basically, this is the distinction between a formal/nominal solute concentration, as compared to a "real" free solute concentration. It can be advantageous to explicitly include more forms of solutes in our analysis (like the ion pairs), which will allow their various dissociation equilibria to appear more naturally and ideal-dilute behaviour will continue to higher concentrations (i.e., activity coefficients will stay closer to 1). That is particularly useful with ions that exhibit strong ion pairing (including weak acids and bases, or higher-charged metal salts). But in highly concentrated solutions which are anyway non-ideal, having the extra forms can become annoying as it leads to more mathematical entities that must be tracked. There might not even be a clean distinction between associated and dissociated ions, so trying to include more forms of solutes might create more vagueness.

### No solvation ambiguity

It is important to remind that all the standard states $\mu^\circ_{\mathrm{int},i}$ and $V^\circ_i$ will always refer to 'fully solvated' ions: the ions are ideally dilute, being far from other solutes, but they are subject to arbitrarily complicated and real influence of the solvent medium.

So, when we refer to an $\mathrm{H}^+$ ion we are always referring the total concentration of a lumped group of species: $\mathrm{H}^+$, $\mathrm{H_3O}^+$, $\mathrm{H_5O_2}^+$, and so on. The actual concentration of 'naked proton' $\mathrm{H}^+$ is going to be a tiny fraction of the lumped $\mathrm{H}^+$ concentration. Many metal ions also naturally dissolve in a form with water ligands.

There is not much point in trying to distinguish the differing hydration levels as distinct species. First, it would be hard to distinguish them. Second, we would have to actually redefine the existing standard state $V^\circ_i$ positions and add new positions. E.g., $V^\circ_{\mathrm{H}^+}$ would have to be greatly increased to reflect the rarity of naked protons, and the `actual $\mathrm{H}^+$ activity' would be tiny (very inconsistent with the usual pH definition!).

Still, as we approach more and more concentrated solutions it is important to remember that our standard states refer to ions bathed in infinite solvent. Part of the reason for non-idealities (going beyond Debye-Huckel) is that ions in a real solution have become partly de-solvated, but we are still referencing them to a fully solvated form.

## Takeaways

Ionic solutes tend to be non-ideal, which begs for them to be treated with activities or activity coefficients. But, the concept of single-ion activity can be surprisingly subtle. Due to charge-neutrality, there is an ambiguity which requires us to specify some kind of convention. For activity coefficients, there is also the issue of how we are counting solute concentrations, and in particular whether we are including dissociated / associated forms explicitly or implicitly.

[**NEXT TOPIC: Non-equilibrium**](../nonequilibrium/)

{#

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>

</details>
#}
