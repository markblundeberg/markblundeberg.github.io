---
layout: layouts/esbd_topic.njk
title: 'Saturation'
tags: [page, esbd_topic]
orderESBD: 29
---

# {{title}}

**WORK IN PROGRESS (OUTLINE)**

When we drive current through a material, we expect that increasing the voltage difference across its terminals will drive more current. This does happen in a simple resistive material, but it is only really guaranteed when there is a uniform block of material with a single conducting carrier type. In real devices what tends to happen instead is that the current instead hits a strict maximum and refuses to increase further—it **saturates**.

Interestingly, current limits in both classic transistors and in electrochemistry are closely related, having to do with spatial depletion of the active charge carrier due to the screening presence of mobile 'spectator' species. So, there is a close analogy between limiting current in electroplating, "pinch-off" in a field-effect transistor, minority carrier diffusion in a bipolar junction transistor, and "salt depletion" in a battery electrolyte, and we will discuss this below.

## The core mechanism: Spectator screening causes depletion

{# Note need to sync this with preceding discussion of concentration polarization; how much is redundant remains to be seen #}

Initially when voltage is applied, and before any carrier has had a chance to move, then an electric field appears and all carriers move in unison. But, soon it happens that one species of carrier takes over the current and other species (spectators) are blocked. Let's look at the steady state.

Traditionally this is discussed in terms of drift/diffusion but the $V_i$ approach gives us an alternative view.

Key pieces ($V_i$ view):

* **Spectators 'flat rail'**: Because spectator charges are mobile and would move according to their own $V_j$ gradients. Since they have zero current (after reaching steady state), then they have flat $V_j$. 
* **Resistance**: Since species $i$ is carrying the current, $V_i$ must slope.
* **Screening**: Quantitative question: At equilibrium if we move $V_i$ (due to slope) while $V_j$ (flat rails) stay in place, how far does $V^\circ_i$ move? This is a capacitive divider.
  The capacitance (chemical capacitance or gate capacitance) beween spectators' $V_j$ and the $V^\circ_i$ of the conducting species means $V^\circ_i$ is 'pinned' somewhat. 
* **Depletion**: The slope of $V_i$ is steeper than $V^\circ_i$ which means the distance between them is growing i.e. $c_i$ is decreasing.
  $$ c \propto \exp\left(\frac{q(V - V^\circ)}{RT}\right) \rightarrow 0 $$
* **The Resistance and slope Divergence**: If the carrier concentration at a boundary drops to near zero, the conductivity $\sigma_i$ at that point plunges to near zero, meaning the local resistance diverges to infinity. Since $J_i$ current is constant across the channel then the slope of $V_i$ must also diverge.
* **Saturation**: The channel's $V_i$ slopes down until it reaches the value set by the draining boundary condition. Once the slope has gotten steep enough, changing that boundary condition has very little effect anymore on the profile the channel $V_i$, and hence saturation!

That said, there are indirect effects of drain voltage like channel length modulation or side reactions that can change the picture and de-saturate the overall IV curve. Also, we haven't talked about other mechanisms that can cause saturation: electrode reaction bottlenecks or thermionic emission (which are also analogous), or carrier velocity saturation (short FETs). We'll just focus on the basic screening mechanism here.

## 'Hard pinning' means pure diffusion: BJTs and electroplating

* **The Physics**: A massive concentration of background charge carriers screens out any internal electric field, forcing the active carrier to move purely by random walk (Fickian diffusion).
* **The Semiconductor Analog: The BJT Base**:
  * In a bipolar junction transistor (BJT) neutral base, majority carriers (holes in a p-type base) are highly concentrated. They screen out the electric field, pinning $\nabla \phi \approx 0$.
  * Injected minority carriers (electrons) are blind to electrostatic forces and must navigate the base by **pure diffusion**. 
  * The collector current saturates once the collector voltage is biased high enough to pull the electron concentration to zero at the collector junction interface.
* **The Electrochemical Analog: Supporting Electrolyte**:
  * In a plating bath with a high concentration of inert supporting electrolyte (e.g. $\mathrm{KNO}_3$) and a dilute active species (e.g. $\mathrm{Cu}^{2+}$), the background ions screen the electric field.
  * The active $\mathrm{Cu}^{2+}$ ions move through the diffusion layer by **pure diffusion**.
  * The current saturates (the **limiting current density**) when the active ion concentration is pulled to zero at the electrode surface.
  * Note on realism: for electroplating, we can plot a hard diffusion region separating from a bulk fully-mixed region (ideal Nernst Diffusion Layer) and regardless we should remark on the way that the source BC is getting set.

<figure class="diagram-placeholder">
{% figcaption %}
Comparison of Hard Pinning saturation. Left: BJT neutral base, where majority holes screen the field, forcing injected electrons to diffuse to a zero-concentration collector boundary. Right: Supporting electrolyte, where inert ions screen the field, forcing electroactive ions to diffuse to a zero-concentration electrode boundary.
{% endfigcaption %}
</figure>

## 'Soft pinning' gives mixed drift-diffusion: FETs and binary electrolytes
* **The Physics**: Screening is partial or geometric. A longitudinal electric field exists, driving transport via a shifting balance of drift and diffusion.
* **The Electrochemical Analog: Binary Electrolyte**:
  * In a binary electrolyte (only active cations and counter-anions), there is no background salt. An electric field (diffusion potential) must exist to maintain charge neutrality between the two moving species.
  * Example: salt gradients in battery electrolytes (though these are not usually driven to the limit)
  * Cations move by a combination of both drift and diffusion (ambipolar transport).
  * Current saturates when the cation concentration is depleted to zero at the electrode.
* **The Semiconductor Analog: The FET Channel**:
  * In a field-effect transistor (FET) channel, there is no bulk majority-carrier sea to screen fields longitudinally. 
  * The gate electrode provides "soft pinning" transversely (coupling to $V^\circ_{\mathrm{e}^-}$ via gate capacitance), but a longitudinal electric field must exist to drive the drift current from source to drain.
  * Note unlike the 1:1 binary electrolyte (where chemical capacitances are 1:1 at any concentration), here the ratio between gate dielectric capacitance and channel-carrier's chemical capacitance is varying with concentration. So the pinning is has a spatially distinct profile (getting harder towards the depletion point) but it's still 'soft'. (Technically there is also channel-substrate capacitance but I think that is negligible compared to gate?)
  * Near the drain, the channel **pinches off** (electron concentration $n \to 0$), and current saturates.

<figure class="diagram-placeholder">
{% figcaption %}
Comparison of Soft Pinning saturation. Left: FET channel, where the gate transversely couples to $V^\circ_{\mathrm{e}^-}$, but a longitudinal field exists until pinch-off at the drain. Right: Binary electrolyte, where charge neutrality couples cations to the flat-rail $V_{\mathrm{anion}}$, but a diffusion potential field exists until depletion at the electrode.
{% endfigcaption %}
</figure>

## Takeaways

Whether in a silicon transistor channel or a metal-plating bath, current saturation is governed by the same rules. In both systems, a flat-voltage rail (the gate metal or the blocked counter-ion) acts through a capacitive coupling to lock the carrier's standard energy level in place. When driven, the carrier's voltage drops below this level, depleting the carriers to zero at the boundary and choking the flow.

This concludes our discussion how electrons in semiconductors and ions in solution have very close analogies. Over the next several topics we're going to switch gears to talking about "electrons in solution": redox reactions and the visual meaning of electrode potential in our $V_i$ diagrams.

[**NEXT TOPIC: Half-reactions**](../half/)
