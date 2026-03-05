---
layout: layouts/esbd_topic.njk
title: 'Electrostatics and devices'
tags: [page, esbd_topic]
orderESBD: 61
---

# {{title}}

So far I've been focussing entirely on the thermodynamic aspect of electricity: $V_i$ equilibrating, $V_i$ driving transport, and so on. Yet this is strikingly different from the Maxwell's equations' form of electricity. For our purposes with no significant magnetic fields, we can consider Maxwell's equations to be represented by electrostatic {% wiki "Poisson's equation" %}:

$$ -\varepsilon_0 \nabla^2 \phi = \rho, $$

for the electrostatic potential $\phi$ relative to the charge density $\rho$. In combination with boundary conditions, this defines the variations in $\phi$.

To be clear, Maxwell's equations are entirely correct. The remarkable thing is that in conductive media, we just don't need to consider electrostatics for the most part! In effect, it is as if we can treat $\varepsilon_0$ as a very small number, i.e. we can set it to 0, which makes:

$$ 0 \cdot (\nabla^2 \phi ) \approx \rho. $$

This is not always valid, but it is extremely useful for constructing the large scale picture of devices.

So, electrostatics effectively says "you can put $\phi$ whereever you want, I don't care, as long as $\rho \approx 0$."

## Quasi-charge-neutrality

The principle of quasi-charge-neutrality is that Poisson's equation is replaced by:
$$\rho = 0,$$
and consequently, $\phi$ takes on whatever value is needed to make sure $\rho=0$.

Note that this is very different from assuming strict charge neutrality ($\rho=0$) and plugging it into Poisson's equation, which would yield $\nabla^2 \phi = 0$. We are saying instead that $\rho$ is a very tiny number, which (due to $\varepsilon_0$ also being tiny) has an enormous effect on $\phi$, hence $\nabla^2 \phi \neq 0$, yet the actual value of $\rho$ is otherwise too tiny to be consequential for the calculation of the properties of the matter.

This goes hand-in-hand with ideas of a local thermodynamic state and local thermodynamic equilibrium: that we have a landscape of $\tilde\mu_i$ values (or $V_i$), and at each point 

 yet **quasi-neutrality** (also called electroneutrality). 

An important consequence of QCN is that charge cannot build up over time, and so (by charge conservation) the charge current must be divergenceless:
$$ \nabla \cdot \vec J = -\frac{\partial \rho}{\partial t} = 0 $$
for total charge current $\vec J$. This doesn't mean each species' individual currents have to be divergenceless, however; it only means that any currents have to perform a local 'handoff'. We've seen this for eample with electrodes where a current of electrons hands off to a current of ions: we must have total currents $I_{\mathrm{e}^-} = I_{\mathrm{ion}} = I$. This handoff can involve an actual reaction (as at a plating/deplating metal electrode), or it may simply involve the co-mingling of different charged species in the same place (as we saw inside the Li-ion electrodes).


(or sometimes the following form: $\nabla(-\varepsilon \nabla\phi) = \rho_{\mathrm{free}}$, in materials with varying $\varepsilon$)


### When can we apply QCN?

To be clear, the "$\varepsilon_0$ small" picture is really a statement about length scales: the device has to be large enough or the mobile charge carriers have to be dense enough that the screening length is much smaller than our scale of interest.

Consequently, the quasi-charge-neutral (QCN) principle is most applicable in the bulk of conductive media, away from interfaces.

(Or electroneutrality)
https://link.springer.com/article/10.1007/s10008-011-1323-x
Newman book


<figure class="diagram-placeholder">
{% figcaption %}
- salt diffusion example - \phi varying
{% endfigcaption %}
</figure>

### When can we not apply QCN?

General themes:
- Any time $\varepsilon$ matters, so all capacitive phenomena.
- Anywhere that charge density is extremely low (vacuum, insulators).
- Nearby interfaces (double layers).

Practically every violation of QCN is localized to some extent, and hence consists of equal positive and negative charges. This is simply because there are always charge carriers nearby to perform screening (and so QCN prevails over long scales). But the actual structure of these positive and negative charges is of great interest!

- insulators.
- vacuum surfaces. (work function)
- double layers at interfaces (within debye length) -- visible as capacitance and important microscopic factors that influence kinetics.
- field effect transistors -- "the interface is the device".


## Modelling devices

Generally we try to apply the QCN principle in every bulk material.

The notion of $\phi$ is necessary to achieve charge balance at each point. In terms of calculation, this requires a self-consistent picture across the entire device, which can be computationally intensive to satisfy (this is unavoidable in electrostatics).

Interfaces are special:
- Every interface has a local microsopic electrostatic double layer disturbance, which plays a role in the time dynamics (it adds an interfacial capacitance, important in electrochemical impedance spectroscopy), and also it affects microscopic kinetics (such as Frumkin effect). 
- That said, thermodynamics wants to equilibrate $V_i$ in a way that does not care about electrostatics at all!
- When out of equilibrium, we have to consider interface kinetics (of which electrode kinetics is a case of special interest): often these can be described in terms of pure thermodynamic deviations (Butler-Volmer equation), but a realistic picture may need to zoom in for more detail.










diffusiophoresis




In electrostatics we learn the Poisson equation

$$ \nabla(-\varepsilon \nabla\phi) = \rho_{\mathrm{free}} $$

Here, $-\varepsilon \nabla\phi$ is the displacement field and $-\nabla\phi$ is the electric field.

If $\rho_{\mathrm{free}}=0$ then this equation allows $\phi$ to vary smoothly (linearly in 1D), but if $\phi$ is to have any other variations then it must have $\rho_{\mathrm{free}} \neq 0$:

* If $\phi$ has a 'kink' or change in slope, this must arise from $\rho_{\mathrm{free}}\neq 0$ (or a change in $\varepsilon$).
* If $\phi$ has a step (common at interfaces), there must be a sharp double layer, consisting of positive and negative charges next to each other.

The general principle of **quasi-charge-neutrality** (which I'll usually refer to as **QCN**) is that even though $\nabla\phi$ changes from place to place, still $\varepsilon$ is a quite "small number" so $-\varepsilon\nabla\phi$ is small.

It's not that the Poisson equation goes away, rather it just turns into
$$ 0 = \rho_{\mathrm{free}}.$$


* Most of the slope changes in $\phi$ involve only tiny charges:
  $$\rho_{\mathrm{free}} \rightarrow 0, \qquad \text{(inside of each material)},$$
  and this equation replaces Poisson's equation: even though the charge imbalance is negligible, its influence on $\phi$ is not negligible: $\nabla(-\varepsilon \nabla\phi) \neq 0$.
* Interfaces have steps in $\phi$ but these can be handled specially:
  $$\Delta \phi \neq 0, \qquad \text{(at interfaces)},$$
  and
  $$\Delta V^\circ_i \neq 0, \qquad \text{(at interfaces)},$$

(Maybe put this later?)
Debye length or screening length depends on the susceptibility: how much charge appears when $\phi$ is varied but $V_i$ stay the same.

$$\chi = \Big(\frac{\partial \rho_{\mathrm{free}}}{\partial \phi}\Big)_{V_1,V_2,\ldots} $$

This requires formally violating charge neutrality so it is a strange property. Anyway in ideal dilute it is ... $\chi = \sum_i ... (z_i F)^2 c_i/(RT)$. In metallic conductors $\chi$ has a different formula based on Fermi gas statistics, but is also simply enormous. Anyway, if we linearize $\rho_{\mathrm{free}} = 0 + \chi (\phi - \phi_0)$ then we get the screening length: $ \kappa^{-2} \phi = (\chi /\varepsilon)\phi $.


The quasi-charge-neutrality naturally falls out of the detailed electrostatics, as we will see later. But to give a handwaving explanation, the origin of the idea is that $\varepsilon$ (or $\varepsilon_0$) is very small (more precisely, it is that the screening length (Debye length) is very short compared to our device length scale). If we send $\varepsilon \rightarrow 0$ then the amount of charge accumulation needed to effect a change in $\phi$ becomes very small; hence as $\varepsilon \rightarrow 0$ then also $\rho_{\mathrm{free}} \rightarrow 0$.

In terms of our $V_i$ picture, we saw that we prefer to work with $V^\circ_i$, which function like $\phi$. What's remarkable about the quasineutral regime is that we don't need to figure out the ambiguity in $\phi$ and we mostly don't even need $V^\circ_i$ except as a bookkeeping tool to balance out out carrier concentrations.



In quasi-charge-neutrality we say that $\rho_{\mathrm{free}} = 0$ even though $\phi$ can have funky variations:
$$ \rho_{\mathrm{free}} = 0,  $$
$$ \nabla(-\varepsilon \nabla\phi) \neq 0. $$

which seems like it contradicts the Poisson equation! Indeed, with quasi-charge-neutrality, we must find $\phi$ by other means.


## Example: a change in resistance

Consider a typical electronic current density $J_x$ being driven from a low-conductivity material into a high-conductivity material ($\sigma_1 \neq \sigma_2$ but both same $\varepsilon$), for example going from lightly $n$-doped silicon to a more strongly $n$-doped silicon:

$$ \frac{\partial \phi}{\partial x} = \frac{\partial V_{\mathrm{e}^-}}{\partial x} = 
\begin{cases}
   -J_x / \sigma_1, &\text{first material}, x<0, \\
   -J_x / \sigma_2, &\text{second material}, x>0,
\end{cases}
$$

<figure class="diagram-placeholder">
{% figcaption %}
- $\phi$ and $V_e$ with kink.
{% endfigcaption %}
</figure>

Poisson's equation tells us that if $\phi$ changed slope at the junction then there must be an accumulation of charge at the boundary: $\rho_{\mathrm{free}} = J_x \varepsilon ({\sigma_1}^{-1} - {\sigma_2}^{-1}) $! Clearly, these kinds of temporary charge accumulations must be happening every time we connect electronic components together. Why is this not an issue, and why don't we have to take it into account in elementary circuit analysis. Well, the actual amount of charge is tiny: 

