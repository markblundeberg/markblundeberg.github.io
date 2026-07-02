---
layout: layouts/esbd_topic.njk
title: 'Interface kinetics'
tags: [page, esbd_topic]
orderESBD: 33.5
---

# {{title}}

**DRAFT — proposed topic, for review**

Throughout this book, interfaces have been where the interesting steps happen: Donnan steps, junction steps, half-cell steps. So far those steps were all equilibrium facts. In the [Electrode potential](../e/) topic we saw what a current does to the picture: the metal's $V_{\mathrm{e}^-}$ peels away from the reaction level it was pinned to, by the surface overpotential

$$ \eta = V_{\mathrm{e}^-}(\text{electrode}) - V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}). $$

What we deferred is the question a device designer actually cares about: *how much current* does a given $\eta$ buy? Within a material, we answered this with a conductivity, $J_i = -\sigma_i \nabla V_i$ ([Basic transport](../transport_basic/)). At an interface, the answer is not a slope but a step, and the current is generally *exponential* in the step. That exponential element is the last circuit ingredient the $V_i$ picture needs.

## The Butler–Volmer element

For a one-electron reaction at an electrode, the standard current–overpotential relation is the {% wiki "Butler–Volmer equation" %}, which in our terms reads

$$ J = J_0 \left[ e^{\alpha f \eta} - e^{-(1-\alpha) f \eta} \right], \qquad f = F/RT, $$

with $\eta$ the $V_{\mathrm{e}^-}$ step defined above. Two parameters characterize the interface:

* The **exchange current** $J_0$ is the two-way traffic at equilibrium. At $\eta = 0$ the anodic and cathodic partial currents each run at $J_0$ and cancel; equilibrium is busy, not idle. A large $J_0$ means the interface is hard to pull away from equilibrium (a good electrocatalyst, or a fast reference-electrode couple); a tiny $J_0$ means the level can be dragged far with little consequence.
* The **charge-transfer coefficient** $\alpha$ splits the influence of $\eta$ between the two directions: a fraction $\alpha$ of the step lowers the anodic barrier, and the remaining $1-\alpha$ raises the cathodic one.^[The charge-transfer coefficients could be better named "barrier-lowering coefficients," reflecting the degree to which the overpotential controls the reaction barrier in each direction. Practically they end up as empirical fitting parameters, much like a diode's ideality factor.]

<figure class="demo-container" style="max-width: 420px">
{% include "esbd-diagrams/kin-barrier.njk" %}
{% figcaption %}
Where $\alpha$ lives: the transition state between the two levels. High electron energy is low voltage, so the activation pass hangs *below* the levels on this axis. Slide $\eta$ and the pass rides with the metal level by the fraction $\alpha$ (compare the grey equilibrium mark): one barrier shrinks by $\alpha\eta$ while the other grows by $(1-\alpha)\eta$. At $\alpha = 1$ the pass moves rigidly with the metal; at $\alpha = 0$ it ignores the metal entirely.
{% endfigcaption %}
</figure>

<figure class="demo-container" style="max-width: 660px">
{% include "esbd-diagrams/kin-bv-explainer.njk" %}
{% figcaption %}
The interface as a nonlinear circuit element. Left: the overpotential $\eta$ is the $V_{\mathrm{e}^-}$ step from the reaction's implied level up to the electrode. Right: the resulting current, with the anodic and cathodic partial currents drawn faint; they cancel at $\eta = 0$ where both equal $J_0$. Slide $\alpha$ to $1$ and the cathodic branch saturates: this is the Shockley diode law.
{% endfigcaption %}
</figure>

For small $\eta$ the exponentials linearize and the interface is just a resistor, $J \approx J_0 f \eta$, the *charge-transfer resistance* $R_{\mathrm{ct}} = RT/(F J_0)$ per unit area. For large $\eta$ one exponential dominates and $\eta$ grows only logarithmically with current — the {% wiki "Tafel equation" %}, a straight line of $(\ln 10) RT/(\alpha F) \approx 59\,\mathrm{mV}/\alpha$ per decade on a log-current plot. Toggle the figure above into its Tafel view: the two partial currents become the straight asymptotes, meeting at the exchange-current notch.

## The diode connection

Electronics has its own famous exponential interface law, the {% wiki "Shockley diode equation" %}
$$ J = J_0\left[e^{fV} - 1\right], $$
and it is exactly the Butler–Volmer equation with $\alpha = 1$: forward bias lowers the injection barrier one-for-one, while reverse bias does not raise any barrier — it only shuts off the forward traffic, leaving the fixed $-J_0$ of carriers that fall down the junction regardless. You can watch this happen on the figure above. The pn-junction and the electrode are twins here in the same way the [bipolar membrane and the diode](../bipolar/) were twins at equilibrium: same exponential physics, different carriers, and the electrochemists' $\alpha$ is the knob the semiconductor version has bolted at $1$.^[A Schottky barrier is the cleaner semiconductor twin of the electrode: a metal $V_{\mathrm{e}^-}$ meeting a semiconductor's carrier levels across one interface, with thermionic emission playing the role of the electrode reaction.]

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-kin-schottky.njk" %}
{% figcaption %}
A Schottky diode: the sharp interface with a pinned barrier. The conduction edge meets the contact a fixed $\phi_B$ below the metal's $V_{\mathrm{e}^-}$ at every bias, and the applied bias is taken up entirely by band bending on the semiconductor side (the depletion zone widening in reverse). The metal-side barrier never changes — that branch of the current saturates — while the semiconductor-side barrier follows the bias one-for-one: $\alpha = 1$, drawn in space.
{% endfigcaption %}
</figure>

## Ions cross interfaces too

Nothing in the argument above was special to electrons. An ion crossing an interface — $\mathrm{Li}^+$ entering an intercalation particle, an ion transferring across an [ITIES](../charge_control/), water splitting at a bipolar-membrane junction — sees the same picture: a step $\Delta V_i$ across the interface, a barrier, and a current exponential in the step,

$$ J_i \propto e^{z_i F \Delta V_i \cdot \alpha / RT} - e^{-z_i F \Delta V_i (1-\alpha)/RT}. $$

This evenhandedness is a quiet advantage of the $V_i$ picture: electron transfer and ion transfer are drawn with the same element, and a battery's interfaces can carry an overpotential on the $V_{\mathrm{Li}^+}$ rail just as legitimately as on the $V_{\mathrm{e}^-}$ rail.

<figure class="demo-container" style="max-width: 460px">
{% include "esbd-diagrams/esbd-kin-driven.njk" %}
{% figcaption %}
One electrode under load, in space. The step at the interface is the surface overpotential; near the electrode the reaction's implied level bends as concentrations polarize across the diffusion layer, and everything in solution tilts ohmically — $E_{\mathrm{eq}}$ has become a field, as promised in [Electrode potential](../e/). Magnitudes are cartoon-sized.
{% endfigcaption %}
</figure>

## Where the electrons jump: Marcus–Gerischer

Why an exponential, and what sets $J_0$? The classic microscopic picture is due to Marcus and Gerischer. Each $\mathrm{Ox}$ ion offers a vacant electronic state and each $\mathrm{Red}$ ion an occupied one, but solvent fluctuations smear these into two broad distributions — a filled band $D_{\mathrm{red}}$ and an empty band $D_{\mathrm{ox}}$, Gaussian bumps offset from the couple's level by the reorganization energy $\lambda$ on either side. Electrons tunnel between the electrode and whatever portion of these bumps lines up with the electrode's own filled or empty states; bias slides the electrode's levels across the bumps, and the overlap integral is the current.

This is the one place in the book where the traditional electron-energy diagram and ours meet almost verbatim: a Gerischer diagram *is* a redox-level band diagram, and our $V_{\mathrm{e}^-}$ diagrams are the same picture flipped upside down (energy up = voltage down), with the $D_{\mathrm{red}}$ bump sitting above the couple's $V_{\mathrm{e}^-}$ and $D_{\mathrm{ox}}$ below. The quantitative machinery is well covered in the literature,^[Gerischer's original series, and modern treatments in e.g. Schmickler & Santos, *Interfacial Electrochemistry*, or Bard & Faulkner ch. 3. — TODO settle citations.] so I'll restrict myself to two points the standard cartoons tend to blur:

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

An interface passing current carries a step in $V_i$, and the current is exponential in that step: Butler–Volmer for electrodes, Shockley for diodes, and the same element again for ion transfer. Exchange current sets how stiff the interface is, $\alpha$ how the step splits between the two barriers, and Marcus–Gerischer supplies the microscopic picture — one that lives natively on these diagrams. With transport ([slopes](../transport_basic/)) and kinetics (steps) both priced in $V_i$, a driven electrochemical device really can be read end to end like a circuit.

[**NEXT TOPIC: Redox-flow batteries**](../redoxflow/)
