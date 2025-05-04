---
layout: layouts/esbd_topic.njk
title: 'Junctions'
tags: [page, esbd_topic]
orderESBD: 5
eleventyNavigation:
    key: Junctions
    parent: ESBD
    order: 5
---

# {{title}}

So far we've covered:

* Electrodes: how electrons communicate with ions; the step $V_{\text{ion}} - V_{\mathrm{e}^-}$.
* Solutions: how ions relate to other ions in the same solvent; concentrations and standard state $V^\circ_i$.

Now we're going to talk about what happens when two solutions come into contact.

Let's repeat the band diagram we showed on the intro page:

{% include "esbd-diagrams/esbd-concentration-cell-agno3.html" %}

Here we have two solutions of silver nitrate in water, but they can have different concentrations. In the middle, a white vertical stripe represents the junction, of which we can consider different types. 

Note than on each side, we have:

$$ V_{\mathrm{Ag}^+} = V^\circ_{\mathrm{Ag}^+} +  \frac{RT}{F}\ln(c/c^\circ) $$
$$ V_{\mathrm{NO_3}^-} = V^\circ_{\mathrm{NO_3}^-} - \frac{RT}{F}\ln(c/c^\circ) $$

And the measured right-vs-left voltage $V$ will be:

$$V = V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left}) = V_{\mathrm{Ag}^+}(\text{right}) - V_{\mathrm{Ag}^+}(\text{left}) $$

We are going to be considering this cell in open circuit and steady state.

## Open circuit, steady state

If we put two different solutions into thermodynamic contact, they will be out of equilibrium as they try to equalize their $V_i$'s. Even compositionally identical solutions could have some net ionic currents as they may start at a different overall electric offset. If we add up all the ionic currents, we can compute a (net) electric current as well.

If we have the two solutions in an "open circuit" setup, that is, we don't have electrodes, or the electrodes are left 'floating' or attached to a high impedance voltmeter, then quite quickly the side receiving electric current will charge up, raising all of its $V_i$ and $V^\circ_i$ levels. Or if the electric current is directed away from a solutions, then it will lower all of its $V_i$ and $V^\circ_i$ levels.

The electrostatic effect of charging is very strong, and as a result, the electric current will fall to zero very quickly.

In this way, two solutions of identical composition can rapidly 'short circuit' to each other. Although a tiny number of ions need to flow, they are usually negligible and so we immediately reach equilibrium, with every $V_i$ level being flat across the junction.

For solutions of distinct composition however, they can rapidly reach zero electric current but this does not mean the $V_i$ are matched -- only that the flows of all the ions sum up to a total zero electric current. For example, an equal flow of $\mathrm{Ag}^+$ and $\mathrm{NO_3}^-$ in the same direction will sum up to zero electric current. Such a junction will be in a steady state but not at thermodynamic equilibrium.

## Single-ion-permeable membranes

To actually achieve equilibrium, we can suppose we have a semi-permeable membrane which only permits one kind of ion to pass through.

For example if you select 'anionic membrane' in the above example, it will only permit the $\mathrm{NO_3}^-$ ions to equilibrate across the junction.  In this case, $V_{\mathrm{NO_3}^-}$ is flat across the junction. If we were to first set this up, a very small amount of $\mathrm{NO_3}^-$ might flow across the junction, but if as we are measuring in open circuit, then it will stabilize to not only zero electric current, but also zero current for each ion.

These single-species membranes are the only possible type of junction that actually reaches thermodynamic equilibrium, as there will be no net ion flows of any species. It is interesting that in typical solid conductors, the materials only permit electrons to flow, and so it is easy to reach equilibrium between any electronic materials. Not so in ionics where achieving a true single-ion-permeable membrane is practically difficult.

Leaving aside the practical difficulties, we can easily analyze this case and calculate its voltage. Using our above equations, and setting $V_{\mathrm{NO_3}^-}(\text{right}) = V_{\mathrm{NO_3}^-}(\text{left})$ we have:

$$V = 2 \frac{RT}{F}\ln \frac{c(\text{right})}{c(\text{left})} . $$

On the other hand, if we have a cation membrane that only permits $\mathrm{Ag}^+$ ions to pass, then $V_{\mathrm{Ag}^+}(\text{right}) = V_{\mathrm{Ag}^+}(\text{left})$ and:

$$ V = 0 . $$

Note that the latter (cation) case would hold even if the solvents were different on each side, whereas the anionic case would need a correction due to the change in $V^\circ_{\mathrm{Ag}^+} - V^\circ_{\mathrm{NO_3}^-}$.

## Direct junctions

Alternatively, we can imagine that the two solutions are allowed to directly touch each other, but in some mechanically constrained manner thats prevent overall convective flows from mechanically mixing the solutions together. For example, the solutions might be separated by a porous screen or they only connect to each other via a thin tube.

As mentioned above, the open-circuit steady state would require an equal flow of $\mathrm{Ag}^+$ and $\mathrm{NO_3}^-$ ions, which in effect is the higher concentration trying to diffuse into the lower concentration. This is slightly complicated since the two ions might not have similar mobility, and so in order to achieve a zero net electric current, one ion will have to be driven harder.

In general, as we move through the junction the ratio of the slopes of the cation and anion $V_i$ levels will be:

$$ \frac{V_+'(x)}{V_-'(x)} = -\frac{t_-}{t_+} $$

where $t_-$ and $t_+$ are the {%wiki "ion transport number" %} for cation and anion. I will prove this later, but for now, suppose $t_-$ and $t_+$ are constant through the range of concentrations in the junction, then this ratio will also be the ratio of the total change in $V_+$ to the total change in $V_-$. In other words, the total step in $V_+ - V_-$ will be allocated according to this ratio.

Unfortunately this means the junction behaviour now depends on an kinetic property $t_- / t_+$ which needs to be obtained somehow.

## Salt bridges

A salt bridge is basically a tube of sponge/gel that contains water with a very high concentration of salt (usually $\mathrm{KCl}$, and usually saturated). When its ends are inserted into two solutions, it forms another kind of controllable junction.

In introductory electrochemistry, the salt bridge is introduced as a simple sort of 'ionic short circuit' device that works to equalize the electrostatic potential on its two ends. The truth is more complex: the salt in a salt bridge is persistently diffusing into the solutions, and through this diffusion it tends to wash out the influence of the solutions.

The salt diffusion raises the salinity of the solutions, and also depletes the salt bridge. The hope is that the experiment or analysis  is quick enough that it doesn't matter. The process of the salt ions' diffusion out of the salt bridge acts in competition with the ions in the solution trying to diffuse _into_ the bridge. This is yet another case of competing ion diffusion, and it now involves several ions. It is hard to predict exactly how the $V_i$'s within the salt bridge will vary in space and time. However, this is not necessary. The idea is that the potassium and chloride ions are quite mobile and numerous, so their diffusion will override any effect of the other ions' diffusion. Then, on each end of the salt bridge we should get a similar (but opposite-sign) jump in the electrostatic potential.

In the end, the _net_ effect of a salt bridge is that the electrostatic potential $\phi$, and hence the $V^\circ_i$ ladders, will try to line up on the left and right sides. Ideally, a salt bridge will make them line up perfectly.

We can also easily analyze this case and calculate its voltage. Using our above equations, and setting $V^\circ_{\mathrm{Ag}^+}(\text{right}) = V^\circ_{\mathrm{Ag}^+}(\text{left})$ we have:

$$V = \frac{RT}{F}\ln \frac{c(\text{right})}{c(\text{left})} , $$

which is the famous Nernst voltage for a concentration cell that uses a salt bridge.

## Takeaways


[**NEXT TOPIC: Potentials**](../potentials/)

{#
## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>

</details>
#}