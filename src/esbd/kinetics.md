---
layout: layouts/esbd_topic.njk
title: 'Interface kinetics'
tags: [page, esbd_topic]
orderESBD: 33.5
---

# {{title}}

Throughout this book, interfaces have been where the interesting steps happen: Donnan steps, junction steps, half-cell steps. So far those steps were all equilibrium facts. In the [Electrode potential](../e/) topic we saw what a current does to the picture: the metal's $V_{\mathrm{e}^-}$ peels away from the reaction level it was pinned to, by the surface overpotential

$$ \eta = V_{\mathrm{e}^-}(\text{electrode}) - V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}). $$

What we deferred is the question a device designer actually cares about: *how much current* does a given $\eta$ buy? Within a material, we answered this with a conductivity, $J_i = -\sigma_i \nabla V_i$ ([Basic transport](../transport_basic/)). At an interface, the answer is not a slope but a step, and the current is generally *exponential* in the step. That exponential element is the last circuit ingredient the $V_i$ picture needs.

## The Butler–Volmer element

For an electrode reaction transferring $z$ electrons, the standard current–overpotential relation is the {% wiki "Butler–Volmer equation" %}, which in our terms reads

$$ J = J_0 \left[ e^{\alpha z f \eta} - e^{-(1-\alpha) z f \eta} \right], \qquad f = F/RT, $$

with $\eta$ the $V_{\mathrm{e}^-}$ step defined above. Two parameters characterize the interface:

* The **exchange current** $J_0$ is the two-way traffic at equilibrium. At $\eta = 0$ the anodic and cathodic partial currents each run at $J_0$ and cancel; equilibrium is busy, not idle. A large $J_0$ means the interface is hard to pull away from equilibrium (a good electrocatalyst, or a fast reference-electrode couple); a tiny $J_0$ means the level can be dragged far with little consequence.
* The **charge-transfer coefficient** $\alpha$ splits the influence of $\eta$ between the two directions: a fraction $\alpha$ of the step lowers the anodic barrier, and the remaining $1-\alpha$ raises the cathodic one.^[The charge-transfer coefficients could be better named "barrier-lowering coefficients," reflecting the degree to which the overpotential controls the reaction barrier in each direction. Practically they end up as empirical fitting parameters, much like a diode's ideality factor.]

<figure class="demo-container" style="max-width: 660px">
{% include "esbd-diagrams/kin-bv-explainer.njk" %}
{% figcaption %}
The interface as a nonlinear circuit element. Left: the two levels, $\eta$ apart, with the transition state between them — high electron energy is low voltage, so the activation pass hangs *below* the levels, and it rides with the metal level by the fraction $\alpha$ (the grey dash marks its equilibrium position). Right: the resulting current, with the anodic and cathodic partial currents drawn faint; they cancel at $\eta = 0$ where both equal $J_0$. Slide $\alpha$ to $1$ and the cathodic branch saturates: this is the Shockley diode law. Raise $z$ and the electrons cross as a convoy — each one multiplies the leverage of $\eta$, steepening the response by that factor.
{% endfigcaption %}
</figure>

For small $\eta$ the exponentials linearize and the interface is just a resistor, $J \approx J_0 z f \eta$, the *charge-transfer resistance* $R_{\mathrm{ct}} = RT/(z F J_0)$ per unit area. For large $\eta$ one exponential dominates and $\eta$ grows only logarithmically with current — the {% wiki "Tafel equation" %}, a straight line of $(\ln 10) RT/(\alpha z F) \approx 59\,\mathrm{mV}/(\alpha z)$ per decade on a log-current plot. Toggle the figure above into its Tafel view: the two partial currents become the straight asymptotes, meeting at the exchange-current notch.

## The diode connection

Electronics has its own famous exponential interface law, the {% wiki "Shockley diode equation" %}
$$ J = J_0\left[e^{fV} - 1\right], $$
and it is exactly the Butler–Volmer equation with $\alpha = 1$: forward bias lowers the barrier one-for-one, while reverse bias raises no barrier at all — it only shuts off the forward traffic, leaving the fixed $-J_0$ of carriers that fall down the junction regardless. The clean semiconductor twin of the electrode is the {% wiki "Schottky diode" %}: a metal's $V_{\mathrm{e}^-}$ meets a semiconductor's carrier levels across one sharp interface, and thermionic emission over the barrier plays the role of the electrode reaction — watch it in the figure below. Here the electrochemists' $\alpha$ is bolted at $1$ for a reason you can see: the barrier as approached from the metal side is pinned, while the semiconductor side follows the bias in full.^[The everyday pn junction obeys the same exponential law but arrives at it by a different route — minority-carrier injection and diffusion, with the exponential coming from equilibrium carrier statistics rather than a rate-limiting barrier crossing — so the barrier-lowering reading applies to it only loosely.]

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-kin-schottky.njk" %}
{% figcaption %}
A Schottky diode: the sharp interface with a pinned barrier. The conduction edge meets the contact a fixed $\phi_B$ below the metal's $V_{\mathrm{e}^-}$ at every bias, and the applied bias is taken up entirely by band bending on the semiconductor side (the depletion zone widening in reverse). The metal-side barrier never changes — that branch of the current saturates — while the semiconductor-side barrier follows the bias one-for-one: $\alpha = 1$, drawn in space.
{% endfigcaption %}
</figure>

## Where the electrons jump: Marcus–Gerischer

Why an exponential, and what sets $J_0$? The classic microscopic picture is due to Marcus and Gerischer. Each $\mathrm{Ox}$ ion offers a vacant electronic state and each $\mathrm{Red}$ ion an occupied one, but solvent fluctuations smear these into two broad distributions — a filled band $D_{\mathrm{red}}$ and an empty band $D_{\mathrm{ox}}$, Gaussian bumps offset to either side of the couple's *standard* level $V^\circ_{\mathrm{e}^-}$ by the reorganization energy $\lambda$. Electrons tunnel between the electrode and whatever portion of these bumps lines up with the electrode's own filled or empty states; bias slides the electrode's levels across the bumps, and the overlap integral is the current.

This is the one place in the book where the traditional electron-energy diagram and ours meet almost verbatim: a Gerischer diagram *is* a redox-level band diagram, and our $V_{\mathrm{e}^-}$ diagrams are the same picture flipped upside down (energy up = voltage down), with the $D_{\mathrm{red}}$ bump sitting above the couple's $V_{\mathrm{e}^-}$ and $D_{\mathrm{ox}}$ below. The quantitative machinery is well covered in the literature,^[Gerischer, H. (1960–61). [Über den Ablauf von Redoxreaktionen an Metallen und an Halbleitern, I–III.](https://doi.org/10.1524/zpch.1960.26.3_4.223) Z. Phys. Chem. NF, 26, 223–247 & 325–338; 27, 48–79. Modern treatments: Schmickler, W., & Santos, E. (2010). *Interfacial Electrochemistry* (2nd ed.). Springer; Bard, A. J., & Faulkner, L. R. (2022). *Electrochemical Methods* (3rd ed.), ch. 3.] so I'll restrict myself to two points the standard cartoons tend to blur:

* The bump *amplitudes* scale with the concentrations of $\mathrm{Ox}$ and $\mathrm{Red}$ — they are densities of actual ions, not of abstract states. A couple that is all $\mathrm{Red}$ has no $D_{\mathrm{ox}}$ bump to speak of.
* A disequilibrated solution simply has several pairs of bumps, one per couple, each pinned to its own implied level — the multi-level picture from [Half-reactions](../half/) carries straight over.

<figure class="demo-container" style="max-width: 480px">
{% include "esbd-diagrams/kin-gerischer.njk" %}
{% figcaption %}
The Marcus–Gerischer picture on a $V_{\mathrm{e}^-}$ axis — upside-down relative to the usual energy plot, so the filled $D_{\mathrm{red}}$ sits *above* and the empty $D_{\mathrm{ox}}$ below. The bumps sit $\pm\lambda$ about the *standard* level $V^\circ_{\mathrm{e}^-}$ (Gerischer's $E^\circ$, always their midpoint), and their amplitudes follow the actual ion populations. The couple's actual level $V_{\mathrm{e}^-}$ stays pinned as the ratio slides — the electron reservoir holds still while the whole density-of-states structure shifts beneath it by the Nernst term.
{% endfigcaption %}
</figure>

## Mixed potentials, quantitatively

The [Electrode potential](../e/) topic introduced mixed potentials as a fact about levels: an electrode coupled to several half-reactions settles at a $V_{\mathrm{e}^-}$ matching none of them. Kinetics says *where*: each couple $k$ contributes a Butler–Volmer current driven by its own $\eta_k$, and the electrode floats to the level where the currents cancel, $\sum_k J_k = 0$. A corroding metal is the canonical case — the metal-dissolution couple runs anodically, the oxygen couple cathodically, and the balance point (the *corrosion potential*) sits between the two equilibrium levels, with a steady corrosion current circulating even though the electrode as a whole draws nothing.

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/levels-kin-mixed.njk" %}
{% figcaption %}
A corroding metal, coupled to two half-reactions at once. The electrode floats to the level where the two Butler–Volmer currents cancel, leaving both overpotentials nonzero: the oxygen couple runs cathodically and the iron couple anodically, a steady corrosion loop with zero net electrode current. The slider sets the ratio of exchange currents — the mixed potential slides toward the kinetically faster couple.
{% endfigcaption %}
</figure>

## Takeaways

An interface passing current carries a step in $V_i$, and the current is exponential in that step: Butler–Volmer for electrodes, Shockley for diodes. Exchange current sets how stiff the interface is, $\alpha$ how the step splits between the two barriers, and Marcus–Gerischer supplies the microscopic picture — one that lives natively on these diagrams. With transport ([slopes](../transport_basic/)) and kinetics (steps) both priced in $V_i$, a driven electrochemical device really can be read end to end like a circuit.

That closes the main sequence. The appendices dig into the foundations underneath, starting with the one this whole framework rests on:

[**NEXT TOPIC: Understanding electrochemical potential**](../muintro/)
