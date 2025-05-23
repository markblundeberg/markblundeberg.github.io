---
layout: layouts/esbd_topic.njk
title: 'Lithium ion batteries'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 3
eleventyNavigation:
    key: Lithium ion batteries # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 1 # Order within the parent menu
---

# {{title}}

Lithium-ion batteries are interesting in that all the action happens in the electrodes. In many other battery types, the solution / electrolyte plays an active role in the chemical reaction. Not so in lithium-ion batteries, where the electrolyte merely serves as a channel for carrying lithium ions.

Both the negative (anode) and positive (cathode) electrodes in a lithium-ion battery are typically {%wiki "Intercalation (chemistry)", "intercalation electrodes" %}, where mobile $\mathrm{Li}^+$ ions may enter and mingle with mobile electrons. Their presence together means that they may combine to provide lithium,

$$ \mathrm{Li}^+ + \mathrm{e}^- \rightleftharpoons \mathrm{Li} , $$

thereby setting the chemical potential of $\mathrm{Li}$ via $ \bar\mu_{\mathrm{Li}^+} + \bar\mu_{\mathrm{e}^-} = \mu_{\mathrm{Li}} $. And thus we arrive at another difference-of-$V_i$'s, 

$$ V_{\mathrm{Li}^+} - V_{\mathrm{e}^-} =  \frac{1}{F} \mu_{\mathrm{Li}}.$$

Unlike the previous electrodes however, $\mu_{\mathrm{Li}}$ is not a material constant but varies depending on the amount of $\mathrm{Li}$ or $\mathrm{Li}^+$ present in the electrode, as well as the nature of the electrode material that hosts the lithium. Thus, we will see variations in the step $ V_{\mathrm{e}^-} - V_{\mathrm{Li}^+} $.

With that, let's show the electrochemical species band diagram for a lithium ion battery cell:

{% include "esbd-diagrams/esbd-lithium-ion-battery-equilibrium.html" %}

On the left, we have the negative terminal, where the intercalation host material is graphite. On the right, positive, electrode the intercalation host material is {%wiki "Lithium nickel manganese cobalt oxides", "nickel manganese cobalt oxides" %} (NMC for short). There are many other choices for lithium ion electrode materials, however we'll just focus on the graphite-NMC cell as an example.

In the middle is the electrolyte / separator. Its job is simple: 1) allow $\mathrm{Li}^+$ ions to flow smoothly (keeping $V_{\mathrm{Li}^+}$ flat), and 2) do not permit electrons to flow (providing a break in $V_{\mathrm{e}^-}$), nor anything else. To allow an appreciable density of $\mathrm{Li}^+$, the electrolyte also contains some counterions ($\mathrm{PF}_6^-$) to maintain charge neutrality, however they otherwise do not significantly influence the cell operation.

The fact that the step $V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$ is so hugely different on the left and right sides reflects how weakly bound the lithium ions are in graphite, compared to NMC. And of course this difference in step sizes is what sets the voltage of the cell. We can also see however that the step size varies with the state of charge: at a nominal 0% charge, most of the lithium is in the NMC (increasing its $\mu_{\mathrm{Li}}$), and at a nominal 100% charge level, most of the lithium has moved into the graphite (increasing its $\mu_{\mathrm{Li}}$).

In the lithium-ion battery field, the step size is known as the OCV value, and I adopted OCV curves from the following open-access paper:

> [Chen et al. 2020 "Development of Experimental Techniques for Parameterization of Multi-scale Lithium-ion Battery Models"](https://dx.doi.org/10.1149/1945-7111/ab9050)
>
> Equations 8 and 9, which are fits to Figure 12.

(OCV curves are measured for each electrode sepearately against a pure lithium metal reference electrode, and so $\mathrm{OCV} = V_{\mathrm{e}^-} - V_{\mathrm{Li}^+} + \mu_{\mathrm{Li(metal)}}$. We're assuming standard reference conditions where $\mu_{\mathrm{Li(metal)}}=0$, and so $\mathrm{OCV} = V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$.)

## Battery discharge

The above diagram suggests that the anode and cathode materials are monolithic blocks of graphite or NMC, which is actually an inaccurate picture of what the real materials look like. Due to the slow diffusion of lithium ions inside these materials, it is desirable that the anode and cathode are instead porous to the electrolyte, and so typically they are basically granular matrices, like in the following schematic:

<div class="demo-container" style="max-width: 200px">
<img src="/esbd/img/chen2020_fig1_schematic.jpg" style="max-width:100%"/>

<small>From [Chen et al. 2020](https://dx.doi.org/10.1149/1945-7111/ab9050), license: [Creative Commons Attribution Non-Commercial No Derivatives 4.0](http://creativecommons.org/licenses/by-nc-nd/4.0/)</small>
</div>

During battery discharge, the output voltage always drops below the normal equilibrium voltage that it would have at that state of charge. For rapid discharges that would discharge the entire capacity in less than an hour, the voltage drops can be quite significant. Using our $V_i$'s, we can actually attribute this external voltage drop to being a sum of various $V_i$ drops.

* Anode electronic resistance: a drop in $V_{\mathrm{e}^-}$ moving from the negative battery terminal to the anode graphite particle.
* Anode lithium diffusion: a drop in $V_{\mathrm{Li}^+}$ from the center of anode particles to their surface.
* SEI diffusion: a drop in $V_{\mathrm{Li}^+}$ as it penetrates the solid electrolyte interphase (SEI) that surrounds each anode particle.
* Electrolyte resistance: A drop in $V_{\mathrm{Li}^+}$ in the electrolyte as lithium ions move through the electrolyte.
* Cathode lithium diffusion: a drop in $V_{\mathrm{Li}^+}$ from the surface of cathode particles to their center.
* Cathode electronic resistance: a drop in $V_{\mathrm{e}^-}$ moving from the cathode particles to the positive battery terminal.

We can illustrate this using our band diagrams. For example, in an anode particle we might see something like this where the $x$-axis represents a *radial* coordinate:

{% include "esbd-diagrams/esbd-lib-particle-discharge.html" %}

This shows the $V_{\mathrm{Li}^+}$ voltage drops due to the slow diffusion of $\mathrm{Li}^+$ inside a single graphite anode particle, and the SEI layer surrounding it. Note that $V_{\mathrm{e}^-}$ is quite flat since the electrons in the graphite are very conductive. As our radial coordinate increases, we have a lower value of $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$. Since $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$ directly corresponds to the local lithium concentration, it means we have a lower concentration of $\mathrm{Li}^+$ ions at the surface compared to the core.

And if we want to plot the entire cell, we might draw something like this:

... TODO ...

Here we draw two $V_{\mathrm{Li}^+}$ levels - one for the core of particles, and one for the lithium ions inside the electrolytes.

This type of diagram is a simplification of the gold standard of battery modelling, which is the "pseudo-2D" model: one axis is the physical distance between electrodes, and the other axis is the radius inside the electrodes' particles (which are assumed to have uniform sizes).

During charging, we see many of these voltage drops happen, only in reverse. And something else can happen, which is that if $V_{\mathrm{Li}^+}$ rises above $V_{\mathrm{e}^-}$ then it is thermodynamically favourable ($\mu_{\mathrm{Li}} > \mu_{\mathrm{Li(metal)}}$) to precipitate out solid lithium metal! This is known as "lithium plating" and is a serious problem that limits fast charging. Typically, the lithium precipitates as needles and dendrites. Only some of the precipitated lithium is able to re-dissolve later on, as any chunk of lithium that becomes electronically disconnected becomes "dead lithium" with its internal $V_{\mathrm{e}^-}$ and $V_{\mathrm{Li}^+}$ falling down to the ambient electrolyte value of $V_{\mathrm{Li}^+}$.

## Takeaways

As we saw, the ESBD diagram is quite simple in a lithium-ion battery, where the main operation involves only $V_{\mathrm{Li}^+}$ and $V_{\mathrm{e}^-}$ levels, and we can visually see the per-electrode OCV value.

During charge and discharge, the $V_i$ voltages form a direct visualization of how various electronic and ionic resistances are responsible for the total "internal resistance".

For the next topic, we'll return to general discussions, and get into detail about how the $V_i$'s work inside of solutions.

[**NEXT TOPIC: Solutions**](../solutions/)

{#   
Kinetics ideas:
- Just draw a sketch.
- V_Li+ gradient inside electrodes.
- TWO distinct V_Li+ levels in cathode representing 'desync' of in-particle Li+ vs in-solution Li+.
- Noticeable V_e- gradient in cathode due to electron hopping being low conductivity.
- Overall V_Li+ gradient in the electrolyte (linear?), and a sudden V_Li+ voltage drop across the SEI (SEI resistance).

Kinetics 1 particle:
- Let's say we're discharging fast from 100% and we have reached 50%.
- Look at a single graphite spherical particle.
- Let's say center SoC is 70-80% (100mV) and surface is 30% (150 mV)
- Draw V_Li+ as parabola going from V_e- - 100mV at center down to V_e- - 150mV at surface.
- Draw a further drop of V_Li+ of ~50 mV going through the SEI.

"The total overpotential was estimated around 400 mV in our example. The SEI drop (estimated at 50 mV) is a noticeable chunk (~12.5%), but not necessarily the single dominant factor in that specific scenario. Other factors contributed comparable amounts (e.g., electrolyte 50mV, anode kinetics ~100mV, cathode kinetics/ohmic ~200mV)."



===

Kinetics and cross terms:

In general we might expect [J_+, J_-] = -[sigma matrix] * [grad V_+, grad V_-].
sigma_-- will be very large (electronic conductivity), dominating this matrix.
sigma_++ would be the lithium ionic mobility
sigma_+- the cross term would be what?

Ultimately not relevant for this case because V_- is basically flat.
But we would notice the difference if we measured bulk conductivity (V_- and V_+ same slope).

If the Li were actually present in a neutral form (with a specific stuck-on electron), then sigma_++ + sigma_+- ~= 0 and it wouldn't move much in bulk conductivity.
I.e. neutral Li would only diffuse per mu_Li = (F/RT) * (V_Li+ - V_e-).
More realistically, Li is actually present as Li+ surrounded by a *screening cloud*, which is not sticky. And so Li would move as per the ionic mobility, thus sigma_+- ~= 0.
I.e. ionic Li diffuses per V_Li+ .

For the V_- flat case, either way the Li+ diffuses as if it was neutral, but it likely is only superficial.

#}