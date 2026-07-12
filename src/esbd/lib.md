---
layout: layouts/esbd_topic.njk
title: 'Lithium-ion batteries'
tags: [page, esbd_topic]
orderESBD: 12
---

# {{title}}

Lithium-ion batteries got a whirlwind introduction on the front page; let's now return to them with real numbers. They are a particularly friendly application for the $V_i$ approach, since all the action happens in the electrodes and the electrolyte serves merely as a channel for carrying lithium ions. (Many other battery types are messier, with the solvent playing an active role in the key reaction; the lead-acid battery goes so far as to consume its sulfuric acid electrolyte.)

Both the negative (anode) and positive (cathode) electrodes in a lithium-ion battery are typically {%wiki "Intercalation (chemistry)", "intercalation electrodes" %}, where mobile $\mathrm{Li}^+$ ions may enter and mingle with mobile electrons. With both carriers coexisting in the one material, an electrode acts as a capacitor strung straight between its $V_{\mathrm{Li}^+}$ and $V_{\mathrm{e}^-}$ rails, the [chemical capacitance](../v_i/) we just met. Charging it means intercalating more lithium, banking a $\mathrm{Li}^+$ and an $\mathrm{e}^-$ together, and every bit stored slides the gap $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$. Unlike the fixed steps at the earlier electrodes, this gap is no material constant: it grows as lithium loads into the host, along a curve set by the host material, so it tracks the state of charge. The sliding gap is just the chemical capacitance being nonlinear.

(Alternatively, you can view the stored lithium as neutral: the two carriers combine, $\mathrm{Li}^+ + \mathrm{e}^- \rightleftharpoons \mathrm{Li}$, so the gap becomes that neutral lithium's chemical potential, $\mu_{\mathrm{Li}} = \bar\mu_{\mathrm{Li}^+} + \bar\mu_{\mathrm{e}^-} = F(V_{\mathrm{Li}^+} - V_{\mathrm{e}^-})$. In truth the host holds nearly fully ionized lithium with its electrons delocalized around it, not neutral atoms, but the distinction is thermodynamically empty.)

With that, let's draw the electrochemical species band diagram for a whole cell:

<figure class="demo-container" style="max-width: 600px">
{% include "esbd-diagrams/esbd-lithium-ion-battery-equilibrium.njk" %}
{% figcaption %}
A graphite-NMC cell at open circuit, built from real measured OCV curves. With everything at equilibrium, $V_{\mathrm{Li}^+}$ runs perfectly flat from electrode to electrode, and the cell voltage is set by the two steps $V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$: each electrode's own OCV. The capacitor symbols stand where the ⇌ markers of the previous topic would go: intercalation ($\mathrm{Li(host)} \rightleftharpoons \mathrm{Li}^+ + \mathrm{e}^-$) pins no fixed gap; it banks charge and slides. Drag the state of charge to move lithium between the hosts and watch both steps evolve, graphite creeping through its staircase of plateaus, with the cell-voltage readout tracking the difference.
{% endfigcaption %}
</figure>

On the left is the negative electrode, whose intercalation host is graphite; on the right (positive) electrode, the host is {%wiki "Lithium nickel manganese cobalt oxides", "nickel manganese cobalt oxides" %} (NMC for short). Many other host materials exist (the front page's cell paired graphite with iron phosphate instead), but the graphite-NMC cell will be our worked example.

In the middle is the electrolyte-filled separator. Its job is simple: let $\mathrm{Li}^+$ ions flow smoothly (keeping $V_{\mathrm{Li}^+}$ flat), and let nothing else through, in particular no electrons (hence the break in $V_{\mathrm{e}^-}$). To allow an appreciable density of $\mathrm{Li}^+$, the electrolyte also contains counterions ($\mathrm{PF}_6^-$) to maintain charge neutrality; they are not consumed at the electrodes and play no direct role in the reaction, though their transport does matter, as we will see below.

The step $V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$ is hugely different on the two sides, reflecting how weakly graphite binds its lithium compared to NMC; the difference between the two steps is exactly the voltage of the cell. The steps also move with the state of charge: at a nominal 0% charge most of the lithium sits in the NMC (raising its $\mu_{\mathrm{Li}}$), while at 100% most of it has moved into the graphite (raising that $\mu_{\mathrm{Li}}$ instead). This is the capacitor from the intro made concrete: each electrode's whole charge capacity is banked by taking up lithium, and every stored $\mathrm{Li}^+$ (with its electron) shifts the local $V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$ gap.

In the lithium-ion battery field, the step size is known as the electrode's OCV (open-circuit voltage, against a $\mathrm{Li}/\mathrm{Li}^+$ reference). Technically $\mathrm{OCV} = V_{\mathrm{e}^-} - V_{\mathrm{Li}^+} + \mu_{\mathrm{Li(metal)}}/F$, but since we're assuming $\mu_{\mathrm{Li(metal)}}=0$, this is simply $\mathrm{OCV} = V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$. The curves in the figure above are real measured OCVs.^[Adopted from Chen et al. 2020, ["Development of Experimental Techniques for Parameterization of Multi-scale Lithium-ion Battery Models"](https://dx.doi.org/10.1149/1945-7111/ab9050): Equations 8 and 9, which are fits to Figure 12.]

## Battery discharge

During discharge, the output voltage always sags below the equilibrium value for the current state of charge, and for rapid discharges (draining the full capacity in under an hour) the sag becomes substantial. With the $V_i$ picture, we can attribute this external voltage drop, piece by piece, to a sum of internal $V_i$ drops.

First, a look at the actual structure inside a lithium-ion battery: both electrodes are porous, sort of resembling a compressed powder soaked in electrolyte:

<figure class="demo-container" style="max-width: 200px">
<img src="/esbd/img/chen2020_fig1_schematic.jpg" style="max-width:100%"/>
{% figcaption %}
From [Chen et al. 2020](https://dx.doi.org/10.1149/1945-7111/ab9050), license: [Creative Commons Attribution Non-Commercial No Derivatives 4.0](http://creativecommons.org/licenses/by-nc-nd/4.0/)
{% endfigcaption %}
</figure>

This porous structure is quite beneficial: lithium ions move far more easily through the electrolyte than through the solid electrode materials, so ample electrolyte channels spare the ions a long journey through solids. Around the anode particles there is also a thin film called the SEI (solid electrolyte interphase), a passivation layer that keeps the strongly reducing lithiated graphite from continuously destroying the solvent. (The cathode grows an analogous film, the CEI, usually thinner and less consequential.)

Still, the particles are not so small that the lithium diffusion inside them can be neglected, and our band diagrams can show this too. Here is an anode particle during discharge ($\mathrm{Li}^+$ being sucked out of it), with the $x$-axis now representing a *radial* coordinate:

<figure class="demo-container" style="max-width: 300px">
{% include "esbd-diagrams/esbd-lib-particle-discharge.njk" %}
</figure>

This shows $V_{\mathrm{Li}^+}$ dropping for two reasons: the slow diffusion of $\mathrm{Li}^+$ within the graphite particle itself, and the slow passage through the SEI layer at its surface. In contrast, $V_{\mathrm{e}^-}$ stays quite flat, since graphite conducts electrons well. The gap carries information too: moving outward, $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$ shrinks, and since this gap tracks the local lithium content, the particle's surface is more depleted of lithium than its core.

That is still not the whole story: a full picture requires the voltage drops in the electrolyte and in the cathode too, and each particle sees different conditions depending on where it sits in the electrode. The following landscape comes out of a realistic battery simulation that captures all of this:

<figure class="demo-container" style="max-width: 400px">
<img src="/esbd/img/PyBaMM_DFN_V_Li_cathodetoo.svg" style="max-width:100%"/>
{% figcaption %}
Internal voltages during a 2C discharge, at around 40% remaining capacity. Simulation done with DFN model in [PyBaMM](https://pybamm.org/) and converted to $V_{\mathrm{e}^-}$, $V_{\mathrm{Li}^+}$ values.
See [my source code here](https://gist.github.com/markblundeberg/b7dbaeb80ae5e69350701feeeb27bb91).
{% endfigcaption %}
</figure>

In this landscape, dissipation has nowhere to hide: $V_{\mathrm{Li}^+}$ would be perfectly flat at equilibrium, so every variation in it is some resistance mechanism at work, each one localized and readable. In the optional discussion below, we'll dig into these mechanisms one by one.

## Takeaways

At equilibrium, the lithium-ion cell is about as simple as an ESBD gets: just two levels, $V_{\mathrm{Li}^+}$ and $V_{\mathrm{e}^-}$, with each electrode's OCV directly visible as its local step (its [electrode potential](../e/) against a $\mathrm{Li}/\mathrm{Li}^+$ reference).

During charge and discharge, the same two levels become a map of the "internal resistance": every drop in $V_{\mathrm{Li}^+}$ or $V_{\mathrm{e}^-}$ is a specific dissipation mechanism, located and quantified.

Before we dive into specific materials, the next page is a quick field guide to the diagrams themselves — every line and symbol, collected in one place now that you've met them in context. After that, we look at how concentrations, activities, and standard states ($V^\circ_i$) define the voltage landscape in solutions.

[**NEXT TOPIC: How to read an ESBD**](../reading/)


## Optional discussion

<details>
<summary>
More about the battery simulation mechanisms and results; click to open.
</summary>

The higher the discharge rate, the more serious the various voltage drops become. I simulated a battery being discharged at the quite high rate of "2C", meaning it goes from 100% to 0% charge in just 30 minutes.

Let's zoom in on the $V_{\mathrm{Li}^+}$ variations:

<figure class="demo-container" style="max-width: 400px">
<img src="/esbd/img/PyBaMM_DFN_V_Li.svg" style="max-width:100%"/>
</figure>

Again, this is a snapshot from midway through the discharge, when about 40% of the capacity remains.

### Anode

At the leftmost part of the plot, $V_{\mathrm{Li}^+}$ is equal between the core and surface of the particles: these graphite particles are uniformly lithiated, barely used at all yet.

Moving right, the surface $V_{\mathrm{Li}^+}$ drops away, marking particles that are being heavily delithiated, and as we approach the separator even the core $V_{\mathrm{Li}^+}$ has dropped: those particles are being fully drained.

Notice also the roughly constant gap between the surface $V_{\mathrm{Li}^+}$ and the electrolyte's $V_{\mathrm{Li}^+}$, present even at the barely-used particles. The model uses an "activation" type of equation ([interface kinetics](../kinetics/)) for the $\mathrm{Li}^+$ moving between particle and electrolyte, so even a tiny $\mathrm{Li}^+$ current costs a significant $V_{\mathrm{Li}^+}$ step, while a slight further increase buys a much larger current.

### Electrolyte

Within the electrodes, the electrolyte's $V_{\mathrm{Li}^+}$ shows significant gradients: the dissolved lithium ions have to work their way through the narrow and twisty spaces between the particles. Across the middle separator region it flattens out; the separator is porous too, but its pores are bigger and let the ions pass more easily.

Another aspect (not very visible here) is a concentration gradient in the electrolyte, which further reduces the conductivity on the cathode side. The culprit is a depletion of the more mobile counterion ($\mathrm{PF_6}^-$), rather than anything about the $\mathrm{Li}^+$ ions themselves; this two-ion transport effect is covered in the [transport topic](../transport_basic/).

### Cathode

Unlike the anode, no part of the cathode is 'untouched'. Instead there is a vast difference in $V_{\mathrm{Li}^+}$ between surface and core throughout, the signature of very slow diffusion inside each particle. As a consequence, the near-separator particles have had their surfaces essentially saturate with lithium, and incoming lithium passes them by for particles deeper in.

### Charging

During charging, many of the same voltage drops appear in reverse, and a new hazard appears with them: wherever $V_{\mathrm{Li}^+}$ rises above $V_{\mathrm{e}^-}$, we have $\mu_{\mathrm{Li}} > \mu_{\mathrm{Li(metal)}}$, and it becomes thermodynamically favourable to precipitate out solid lithium metal. This "lithium plating" is a serious problem that limits fast charging. The lithium typically comes out as needles and dendrites, and only some of it manages to re-dissolve later: any chunk that loses its electronic connection becomes "dead lithium", its internal $V_{\mathrm{e}^-}$ and $V_{\mathrm{Li}^+}$ falling together to the ambient electrolyte's $V_{\mathrm{Li}^+}$, out of the charger's reach.

</details>
