---
layout: layouts/esbd_topic.njk
title: V_i
tags: [page, esbd_topic]
orderESBD: 10
eleventyNavigation:
    key: V_i
    parent: ESBD
    order: 10
---

# $V_i$ : the real voltage of real charges

Our key player is the "species voltage" $V_i$, a potential defined for every type of charge carrier $i$ (e.g., electron $\mathrm{e}^-$, or hydrogen ion $\mathrm{H}^+$, or sulfate ion $\mathrm{SO_4}^{2-}$, ...). It's derived from a more fundamental thermodynamic quantity called the electrochemical potential, $\bar\mu_i$, by simply normalizing for the species' charge:

$$ V_i = \frac{\bar\mu_i}{z_i F} $$

where $z_i F$ is the species charge ($F$ is Faraday's constant).

For those not versed in the fundamentals of thermodynamics and the meaning of chemical potential, this looks intimidating. But **you do not have to understand $\bar\mu_i$** to understand $V_i$, because:

> **The electronic quantity $V_{\mathrm{e}^-}$ is precisely the voltage you know well from basic electronic circuits.**

This is a bit at odds with the usual teaching that voltage is the electrostatic potential $\phi$. But when you dig into advanced studies of both solid state physics and electrochemistry, you find a big disclaimer that in fact $\bar\mu_{\mathrm{e}^-}$ (in the form of $V_{\mathrm{e}^-}$) is the measurable voltage, and $\phi$ itself often becomes frustratingly unmeasurable in materials.^[Some solid state book - Kittel maybe?]^[Newman electrochem book <3 so good on this stuff] It is $V_{\mathrm{e}^-}$ that drops across a resistor according to $\Delta V = IR$; it is $V_{\mathrm{e}^-}$ that you measure between terminals of a battery; it is $V_{\mathrm{e}^-}$ that we conventionally assign to $0$ for electrical ground.

To generalize this to $V_i$, I only ask you to make a couple of conceptual leaps:
* It's not only electrons and $V_{\mathrm{e}^-}$, but by extension $V_i$ for any charged species satisfies the practical meaning of 'voltage', and,
* There can be *multiple* voltages in the same place, such as both $V_{\mathrm{Na}^+}$ and $V_{\mathrm{Cl}^-}$ being present in salt water.

Below I'll highlight a few key principles of what makes $V_i$ a voltage, and what we mean by "voltage".

> Terminology note: Some may object to labelling $V_i$ as a "voltage"; technically $V_i$ is a potential, and a voltage should be a potential *difference*. However, we can simply adopt the usual electronics notion that an unreferenced voltage means a potential difference measured against a common electronic ground point.^[There are two ways we can make $V_{\mathrm{e}^-}(\text{ground}) = 0$: we can define our electrostatic potential (e.g. via a gauge transformation) such that $\bar\mu_{\mathrm{e}^-}(\text{ground})=0$, or, we can modify our $V_i$ definition to subtract off the ground potential explicitly as follows: $ V_i(x) = \frac{\bar\mu_i(x)}{z_i F} - \frac{\bar\mu_{\mathrm{e}^-}(\text{ground})}{-F} $. These ground definitions of course do not change any measurable (difference) quantity. Note that for consistency, we can only declare one ground datum for one species — we do not declare distinct grounds for distinct species.]

## Differences in $V_i$ are available work

The fundamental rule of thermodynamics is that particles flow from high to low chemical potential ($\bar\mu_i$) to release free energy. The difference, $\Delta \bar\mu_i$, is the maximum work that can be extracted from this flow. The available work $\Delta\bar\mu_i$ is measured per unit of particle count (e.g. kJ/mol or eV/particle).

{#
Themodynamically, where two bodies differ in their electrochemical potential (or chemical potential) $\bar\mu_i$ for some species, the difference $\Delta \bar\mu_i$ represents available free energy, that is, available work, by moving that particle species from the higher $\bar\mu_i$ to lower $\bar\mu_i$.

(To be precise, this is only true when both bodies must have equal temperatures.^[The equal-temperature requirement means we can transfer any amount of energy between the bodies along with the particle transfer, and the amount of energy transfer does not affect the available work. But where bodies also differ in temperature, we can also extract available work from the thermal difference. Practically with temperature gradients we see thermoelectric effects that complicate the interpretation of voltages.]) This energy $\Delta\bar\mu_i$ is measured per unit of particle count (e.g. kJ/mol or eV/particle). #}

> DIAGRAM - \bar\mu_i step annotated with 'work per particle' somehow

By normalizing $V_i = \bar\mu_i/(z_i F)$, the corresponding $\Delta V_i$ is energy measured per unit charge (volts). 

> DIAGRAM - V_i step annotated with 'work per charge' consistently with the above

I stress again though, this $\Delta V_i$ is *electrochemical* work specific to the charge-carrying species $i$, and is not simply electrostatic work that might be performed on a test charge (whose pure electrical work would be $\Delta\phi$). Note that in some simplified situations, the division between electrical work and chemical work is clear, but in many situations, the distinction becomes blurred or arbitrary and only the electrochemical work $\Delta V_i$ remains well defined.



{#
In other words, $V_i$ is not just available electrostatic work, but also includes any relevant chemical work. (Though, in many situations, the division between electrostatic/chemical becomes arbitrary or blurred. This however has no effect on the combined value of $\Delta V_i$.)
#}

## Differences in $V_i$ are measurable

The fact that $\Delta V_i$ represents available work means it is in principle measurable, for any species $i$. Practically, however, we do live in a world where one species (electrons) is much easier to probe than the others.

The common voltmeter measures differences in $V_{\mathrm{e}^-}$: it permits a small, ideally negligible, number of electrons to flow in its metal probes and thereby measures the available work. In fact, the reason electronic voltmeters work so directly and conveniently is that so many of our conductors are purely electronic: we can attach wires of many different materials together, and since electrons are the only mobile carriers, then they transmit $V_{\mathrm{e}^-}$ perfectly without any of the complications we see in multi-ion solutions.

> DIAGRAM? - show V_e- with multi-metal sequence leading up to voltmeter 

For ions' $V_i$, a regular voltmeter with its metallic probes cannot directly couple to the ions. Or to be more precise, this coupling is badly controlled. But with careful probe construction, we can make a controlled coupling between $V_i$ and $V_{\mathrm{e}^-}$, and then by measuring $V_{\mathrm{e}^-}$ with a regular voltmeter we therefore have indirect access to $V_i$. In many cases these electrodes will be particularized to the situation and the nature of the target ion. There is also a [generic recipe (see later topic)](../nuances/) based on ion-selective membranes that can be used in principle to measure *any* ionic voltage $V_i$.

> DIAGRAM - sketch of a generic V_i probe as an interchange between V_i and V_e-

There is an important caveat: the choice of chemical potential convention imparts a global offset on each ion's $V_i$ (we will discuss this more in the next topic). This hidden assumption therefore applies a consistent (but somewhat arbitrary) offset to all values $V_i - V_j$ for each pair of distinct species $i\neq j$. But, it does not affect ionic $V_i$ differences within the same species (e.g. we can exactly define and measure the difference in $V_{\mathrm{H}^+}$ between two solutions, even if they have different solvents).

## Takeaways

Now that we've established $V_i$ as our core quantity, we're going to want to see what $V_i$ looks like in equilibrium. This includes the important topic of electrochemical reactions, which is what sets $V_i - V_j$ between different species.

[**NEXT TOPIC: Equilibrium**](../equilibrium/)
