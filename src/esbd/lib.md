---
layout: layouts/esbd_topic.njk
title: 'Lithium ion batteries'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 12
eleventyNavigation:
    key: Lithium ion batteries # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 12 # Order within the parent menu
---

# {{title}}

We saw lithium-ion batteries already on the front page, and now let's return to them more quantitatively. Lithium-ion batteries are a particularly simple application for the $V_i$ approach since all the action happens in the electrodes. The electrolyte merely serves as a channel for carrying lithium ions. (Not so in many other battery types, where the solvent plays an active role in the key chemical reaction.)

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

In the lithium-ion battery field, the step size is known as the OCV value, and I adopted OCV curves from [Chen et al. 2020 "Development of Experimental Techniques for Parameterization of Multi-scale Lithium-ion Battery Models"](https://dx.doi.org/10.1149/1945-7111/ab9050): Equations 8 and 9, which are fits to Figure 12. Technically, $\mathrm{OCV} = V_{\mathrm{e}^-} - V_{\mathrm{Li}^+} + \mu_{\mathrm{Li(metal)}}$, but since we're assuming $\mu_{\mathrm{Li(metal)}}=0$, then simply $\mathrm{OCV} = V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$.

## Battery discharge

During battery discharge, the output voltage always drops below the normal equilibrium voltage that it would have at the current state of charge. For rapid discharges that would discharge the entire capacity in less than an hour, the voltage drops can be quite significant. Using our $V_i$'s, we can actually attribute this external voltage drop to being a sum of various $V_i$ drops.

First, let's clarify a bit about the actual structure inside of a lithium-ion battery. In fact, both electrodes are porous structures, sort of resembling a compressed powder:

<figure class="demo-container" style="max-width: 200px">
<img src="/esbd/img/chen2020_fig1_schematic.jpg" style="max-width:100%"/>

<figcaption>

From [Chen et al. 2020](https://dx.doi.org/10.1149/1945-7111/ab9050), license: [Creative Commons Attribution Non-Commercial No Derivatives 4.0](http://creativecommons.org/licenses/by-nc-nd/4.0/)

</figcaption>
</figure>

This porous structure is quite beneficial for the battery functioning: it is far easier for the lithium ions to move inside of the electrolyte than to move through the solid electrode materials. So, by providing ample electrolyte channels, it means the lithium ions do not have to move as far through the solid materials. Around each particle, there is a thin film layer called SEI (solid electrolyte interphase), a form of passivation that protects the solvent from being destroyed by battery.

Still, the particle sizes are not so small that we can neglect the lithium diffision. We can illustrate this using our $V_i$ band diagrams. For example, in an anode particle during discharge ($\mathrm{Li}^+$ being sucked out of it) we might see something like this where the $x$-axis represents a *radial* coordinate:

{% include "esbd-diagrams/esbd-lib-particle-discharge.html" %}

This shows the $V_{\mathrm{Li}^+}$ voltage drops due to:

* the slow diffusion of $\mathrm{Li}^+$ inside a single graphite anode particle.
* the slow diffusion through the SEI layer surrounding the anode particle.

Note that in contrast, $V_{\mathrm{e}^-}$ is quite flat since the electrons in the graphite are very conductive. As our radial coordinate increases, we have a lower value of $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$, and since $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$ directly corresponds to the local lithium concentration, it means we have a lower concentration of $\mathrm{Li}^+$ ions at the surface compared to the core.

But that is not the whole story of course, as a full picture of the battery requires understanding the voltage drop in the electrolyte, and the voltage drop in the cathode materials too. And each electrode particle is going to have different dynamics due to being positioned differently in the electrolyte! The following picture comes out of a realistic battery simulation that captures all this:

<figure class="demo-container" style="max-width: 400px">
<img src="/esbd/img/PyBaMM_DFN_V_Li_cathodetoo.svg" style="max-width:100%"/>

<figcaption>

Internal voltages during a 2C discharge, at around 40% remaining capacity. Simulation done with DFN model in [PyBaMM](https://pybamm.org/) and converted to $V_{\mathrm{e}^-}$, $V_{\mathrm{Li}^+}$ values.
See [my source code here](https://gist.github.com/markblundeberg/b7dbaeb80ae5e69350701feeeb27bb91).

</figcaption>
</figure>

What's important is that this detailed landscape reveals all sorts of local dissipation mechanisms and interesting mechanics. We know $V_{\mathrm{Li}^+}$ would be perfectly flat at equilibrium, and therefore every variation in $V_{\mathrm{Li}^+}$ represents some kind of dissipation or resistance. In the optional discussion below, we'll dig more into these mechanisms.

## Takeaways

As we saw, the ESBD diagram is quite simple in a lithium-ion battery at equilibrium, where the main operation involves only $V_{\mathrm{Li}^+}$ and $V_{\mathrm{e}^-}$ levels, and we can visually see the per-electrode OCV value.

During charge and discharge, the $V_i$ voltages form a direct visualization of how various electronic and ionic resistances are responsible for the total "internal resistance".

For the next topic, we'll talk more generally about how gradients in $V_i$ (such as the above gradients in $V_{\mathrm{Li}^+}$) drive the flow of charge.

[**NEXT TOPIC: Driving forces**](../drive/)

## Optional discussion

<details>
<summary>
More about the battery simulation mechanisms and results; click to open.
</summary>

The higher the discharge rate, the more serious the various voltage drops become. I simulated a battery being discharged at a quite high rate "2C", meaning it will go from 100% to 0% charge level in just 30 minutes, which is quite fast.

Let's zoom in on the $V_{\mathrm{Li}^+}$ variations:

<figure class="demo-container" style="max-width: 400px">
<img src="/esbd/img/PyBaMM_DFN_V_Li.svg" style="max-width:100%"/>
</figure>

Again, these are a snapshot taken midway through this discharge process, when about 40% of the capacity is remaining.

### Anode

At the leftmost part of the plot, we see that $V_{\mathrm{Li}^+}$ is equal between the core and surface of the particles. This indicates that these graphite particles have a uniform lithiation; they have been barely used at all yet.

As we move more right, we see the surface $V_{\mathrm{Li}^+}$ drop quickly, indicating that the graphite particles there are being heavily delithiated. And finally as we approach the separator, we see that even the core $V_{\mathrm{Li}^+}$ level has dropped, indicating that these particles are being fully depleted.

We see a roughly constant gap between $V_{\mathrm{Li}^+}$ on the surface and $V_{\mathrm{Li}^+}$ in the electrolyte, even with the particles that are barely used yet. This is because the model uses an "activation" type of equation for the $\mathrm{Li}^+$ moving between the particle and electrolyte. Thus, even a tiny $\mathrm{Li}^+$ current out of the graphite corresponds to a significant $V_{\mathrm{Li}^+}$ step, and a slight increase in $V_{\mathrm{Li}^+}$ gives a much larger current.

### Electrolyte

We see significant gradients in $V_{\mathrm{Li}^+}$ in the electrolyte because these dissolved lithium ions have to work their way through the narrow and twisty spaces between the particles in the electrolyte material. We do see $V_{\mathrm{Li}^+}$ flatten out in the middle separator region however. Even though the separator is a porous material, its pores are bigger and let the lithium ions pass more easily.

Another aspect (that is not very visible) is a concentration gradient in the $\mathrm{Li}^+$ ions in the electrolyte, which further reduces the electrolyte conductivity on the cathode side. This is not solely due to the $\mathrm{Li}^+$ ions behaviour, but rather has to do with a depletion of the more mobile counterion ($\mathrm{PF_6}^-$). We will talk about this two-ion transport effect in a later topic.

### Cathode

Unlike the anode, here we do not see any part of the electrode being 'untouched'. Instead, there is a vast difference in $V_{\mathrm{Li}^+}$ between surface and core, indicating very slow diffusion inside each particle. As a consequence, the near-separator cathode particles have basically had their surfaces become fully lithiated, and they are letting lithium go past them accordingly.

### Charging

During charging, we see many of these voltage drops happen, only in reverse. And something else can happen, which is that if $V_{\mathrm{Li}^+}$ rises above $V_{\mathrm{e}^-}$ then it is thermodynamically favourable ($\mu_{\mathrm{Li}} > \mu_{\mathrm{Li(metal)}}$) to precipitate out solid lithium metal! This is known as "lithium plating" and is a serious problem that limits fast charging. Typically, the lithium precipitates as needles and dendrites. Only some of the precipitated lithium is able to re-dissolve later on, as any chunk of lithium that becomes electronically disconnected becomes "dead lithium" with its internal $V_{\mathrm{e}^-}$ and $V_{\mathrm{Li}^+}$ falling down to the ambient electrolyte value of $V_{\mathrm{Li}^+}$.

</details>
