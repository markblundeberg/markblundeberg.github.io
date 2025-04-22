---
layout: layouts/base.njk
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

Unlike the previous electrodes however, $\mu_{\mathrm{Li}}$ is not a material constant but varies depending on the amount of $\mathrm{Li}$ or $\mathrm{Li}^+$ present in the electrode, as well as the nature of the electrode material that hosts the lithium. Thus, we will see variations in the step $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$.

With that, let's show the electrochemical species band diagram for a lithium ion battery cell:

(...)

On the left, we have the negative terminal, where the intercalation host material is graphite. On the right, positive, electrode the intercalation host material is {%wiki "Lithium nickel manganese cobalt oxides", "nickel manganese cobalt oxides" %} (NMC for short). There are many other choices for lithium ion electrode materials, however we'll just focus on the graphite-NMC cell as an example.

In the middle is the electrolyte / separator. Its job is simple: 1) allow $\mathrm{Li}^+$ ions to flow smoothly (keeping $V_{\mathrm{Li}^+}$ flat), and 2) do not permit electrons to flow (providing a break in $V_{\mathrm{e}^-}$), nor anything else. To allow an appreciable density of $\mathrm{Li}^+$, the electrolyte also contains some counterions ($\mathrm{PF}_6^-$) to maintain charge neutrality, however they otherwise do not significantly influence the cell operation.

The fact that the step $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$ is so hugely different on the left and right sides reflects how weakly bound the lithium ions are in graphite, compared to NMC. And of course this difference in step sizes is what sets the voltage of the cell, $V_{\mathrm{e}^-}(\text{right}) -  V_{\mathrm{e}^-}(\text{left}) \approx 3\text{--}4~\mathrm{V}$. We can also see however that the step size varies with the state of charge: at a nominal 0% charge, most of the lithium is in the NMC (increasing its $\mu_{\mathrm{Li}}$), and at a nominal 100% charge level, most of the lithium has moved into the graphite (increasing its $\mu_{\mathrm{Li}}$).

Below I've plotted the step $V_{\mathrm{Li}^+} - V_{\mathrm{e}^-}$ for both graphite and NMC used for the above plot. (this is based on publicly available experimental data [cite]; it is far beyond our scope here to model!)

(...)

These curves are known in the field as OCV curves (open circuit voltage). Technically, OCV curves are measured for each electrode against a pure lithium metal reference, but since we use an elemental reference of $\mu_{\mathrm{Li(metal)}}=0$, the OCV curve is one and the same as $V_{\mathrm{e}^-} - V_{\mathrm{Li}^+}$.





## Takeaways

As we saw, the ESBD diagram is quite simple in a lithium-ion battery, where the main operation involves only $V_{\mathrm{Li}^+}$ and $V_{\mathrm{e}^-}$ levels, and we can visually see the per-electrode OCV value.

For the next topic, we'll return to general discussions.

[**NEXT TOPIC: Solutions**](../solutions/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}
{#
Gemini suggested outline

Proposed Structure & Main Points:

Introduction: What Makes LIBs Special?

Briefly state their importance (energy density, rechargeability).
Introduce the core components: Anode (e.g., Graphite), Cathode (e.g., LCO), Electrolyte (Li⁺ conductor), Separator.
Key Idea: Unlike simple metal electrodes, LIBs work by intercalation – inserting/removing Li ions into/from host materials.
Intercalation and Chemical Potential (μ_Li)

Explain the concept: xLi⁺ + xe⁻ + Host ⇌ LiₓHost.
Crucial Point: The energy required to add/remove lithium (its chemical potential, μ_Li) changes depending on how much lithium is already in the host (x, the state of charge). Analogy: Like parking cars in a multi-level garage, the first spots are easy (low energy), the last ones are harder (high energy).
Briefly mention this contrasts with plating pure Li metal where μ_Li is constant (μ°(Li)).
The ESBD Picture - Open Circuit Voltage (OCV)

Introduce a representative ESBD for a partially charged LIB (e.g., Graphite || LCO).
Show Levels:
V_e⁻ for anode (Graphite) current collector.
V_e⁻ for cathode (LCO) current collector.
V_Li⁺ level in the electrolyte (flat at OCV).
Show V_Li⁺ penetrating into both anode and cathode hosts, continuous with the electrolyte level.
Show V_e⁻ levels within each host (same as collector).
Highlight the Steps: Show the different potential steps within each electrode:
Anode: V_Li⁺ - V_e⁻ = μ_Li_anode / F
Cathode: V_Li⁺ - V_e⁻ = μ_Li_cathode / F
Place Reaction Markers: Put the ⇌ marker within the anode phase (connecting V_Li⁺ and V_e⁻ there) and within the cathode phase (connecting V_Li⁺ and V_e⁻ there), representing the internal Li⁺ + e⁻ ⇌ Li equilibrium in each host.
Define OCV: Clearly show that OCV = V_e⁻_cathode - V_e⁻_anode. Explain this difference arises because μ_Li_cathode is different from μ_Li_anode at a given SOC.
Why Voltage Changes: Electrode Potential vs. State of Charge (SOC)

Focus on μ_Li vs x: Explain that because μ_Li changes with x differently in the anode and cathode, the steps V_Li⁺ - V_e⁻ change differently as Li moves.
Anode Example (Graphite): Show its characteristic OCV curve vs Li/Li⁺ (low voltage, relatively flat plateaus). Explain this reflects specific energy levels for Li in graphite stages. Relate flat plateaus to regions where μ_Li_anode is constant (two-phase coexistence during staging). On ESBD: V_e⁻_anode stays relatively constant during plateaus.
Cathode Example (LCO): Show its characteristic OCV curve vs Li/Li⁺ (higher voltage, generally sloping). Explain this reflects gradual changes in Co oxidation state / Li interaction energy. On ESBD: V_e⁻_cathode changes more continuously.
Full Cell Voltage: Explain that the overall cell OCV curve results from the difference between the cathode and anode OCV curves (V_e⁻_cathode - V_e⁻_anode).
Visualizing Charge / Discharge with ESBD

Discharge: Start with charged state ESBD (large V_e⁻ difference). Show Li⁺ moving anode -> cathode, e⁻ moving anode -> cathode externally. Explain how x changes, causing μ_Li_anode to increase (making V_e⁻_anode go down) and μ_Li_cathode to decrease (making V_e⁻_cathode go up). Show the V_e⁻ levels moving closer, reducing cell voltage.
Charge: Start with discharged state ESBD (small V_e⁻ difference). Show external voltage forcing e⁻ cathode -> anode, Li⁺ moving cathode -> anode. Explain how x changes, causing μ_Li_anode to decrease (V_e⁻_anode goes up) and μ_Li_cathode to increase (V_e⁻_cathode goes down). Show V_e⁻ levels moving apart, increasing cell voltage.
Conclusion & Takeaways

Summarize: LIB voltage is determined by the difference in Li chemical potential (μ_Li) between anode and cathode hosts. μ_Li varies with SOC, causing voltage changes. ESBD visualizes these changing energy levels (V_Li⁺, V_e⁻) and the resulting voltage.
Reiterate the power of the ESBD approach for understanding this complex system.
NEXT Link: To Topic 3 (Solutions).

Optional Discussion Ideas:

Variety of Materials: Briefly show OCV curves and mention the resulting ESBD differences for other common materials (LFP's flat plateau, NMC's slope, Si anode's low potential and large volume change).
Solid Electrolyte Interphase (SEI): Briefly explain its formation on the anode during the first charge, its necessity (preventing continuous electrolyte reduction), and its character (ion conductor, electron insulator). Mentioning how it might affect the ESBD at the interface (e.g., adding a resistive or tunneling barrier) could be interesting but complex.
Kinetics & Operating Voltage: Explain that the OCV is the equilibrium potential. When current flows, overpotentials (due to charge transfer resistance, ion transport limits in electrolyte/solids) cause the actual operating voltage to be lower during discharge and higher during charge than the OCV. Show a simple diagram illustrating this deviation.
Energy Density vs. Power Density: Briefly relate the voltage (from Δμ_Li) and capacity (amount of Li stored) to energy density, and relate kinetics/overpotentials to power density.


===

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
#}