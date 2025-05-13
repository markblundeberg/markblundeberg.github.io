---
layout: layouts/esbd_topic.njk
title: 'Non-equilibrium'
tags: [page, esbd_topic]
orderESBD: 16
eleventyNavigation:
    key: Non-equilibrium
    parent: ESBD
    order: 16
---

# {{title}}

Let's talk a bit about how ions move. At equilibrium, all chemical potentials and all temperatures will be equal throughout the bodies, so there is no driving force for energy or particle movement. Likewise $V_i$ will be uniform for each ion. Particles and energy may randomly move between bodies but there will be no net movement.

Once we disturb the equilibrium, technically we might not have well defined thermodynamic variables anymore. But as a first level of treatment, we can hope that the system is locally in quasi-equilibrium, and imagine that there are variations in $V_i$, $\mu_i$, $T$. This is the general domain of "Thermodynamics of Irreversible Processes" (TIP) and Onsager-type transport equations.

We'll also discuss the topic of overpotentials and chemical reactions out of equilibrium.

## Gradient transport (two-ion)

Suppose that we have a cation and anion (having arbitrary charges $z_+$ and $z_-$) with their respective species voltages $V_+$ and $V_-$, both varying gradually along the $x$ space coordinate. We can expect a general continuum linear response relating the electrical current densities ($J_\pm$) of each ion to the gradients (driving forces, $-\partial_x V_\pm$) of the voltages:

$$
\begin{pmatrix}J_+ \\ J_-\end{pmatrix} = \begin{pmatrix}\sigma_{++} & \sigma_{+-} \\ \sigma_{+-} & \sigma_{--}\end{pmatrix} \begin{pmatrix}-\partial_x V_+ \\ -\partial_x V_-\end{pmatrix}
$$

where the $\sigma_{ij}$ form a conductivity matrix (in the usual units of electrical conductivity). Note that the above is a form of the Onsager transport equations, as the $V_\pm$ are scaled electrochemical potentials and the $J_\pm$ are scaled particle fluxes. Onsager reciprocity requires $\sigma_{-+} = \sigma_{+-}$ in the absence of external magnetic fields.

Here we would expect a diagonal conductivity matrix ($\sigma_{+-} = 0$) only in the infinitely dilute limit, with each diagonal conductivity $\sigma_{\pm\pm}$ given by that ion's mobility and concentration. Going beyond the dilute limit, we expect the ions to interact (e.g., drag on each other), creating off-diagonal contributions $\sigma_{+-}$ (electrophoretic effects) as well as modifying the diagonal terms. Furthermore, some fraction of ions might not participate in conduction due to ion pairing. The cross terms are also important for describing coupled transport in other systems, such as intercalated lithium ions versus electrons inside graphite.

The conductivities themselves would also depend on concentration. Since $V_+ - V_-$ is related to local concentration, then for example in the ideal dilute limit with constant ionic mobilities, we would have $\sigma_{ij}$ being proportional to an exponential function of $V_+ - V_-$.

Anyway, let's consider a few special cases for this electrolyte system:

### Case 1: Bulk transport driven by field

Suppose we have a homogeneous bulk solution and we apply a net electric field $E \hat x$. In this case, the $V_i$ gradients are equal for all ions and determined by the field: $\partial_x V_+ = \partial_x V_- = -E $. The resulting partial currents are:

$$ J_+ = (\sigma_{++} + \sigma_{+-}) E , $$
$$ J_- = (\sigma_{+-} + \sigma_{--}) E . $$

The total current is $J_{total} = J_+ + J_-$. Of interest are the ion transference numbers, defined as the fraction of the total current carried by each ion: $t_+ = J_+ / J_{total}$, and $t_- = J_- / J_{total}$. In particular, their ratio is:

$$ \frac{t_+}{t_-} = \frac{J_+}{J_-} = \frac{\sigma_{++} + \sigma_{+-}}{\sigma_{+-} + \sigma_{--}} . $$

and their sum is:

$$t_+ + t_- = 1.$$

We will make use of these $t_-$ and $t_+$ below.

### Case 2: Diffusion in open circuit (Liquid Junction)

When it comes to two solutions with different ion concentrations in direct contact, we will have diffusion from the higher concentration to the lower concentration. The higher concentration will have a larger difference $V_+ - V_-$ than the lower concentration, and we want to know how the $V_+$ and $V_-$ will align.

Consider the diffusion case under the condition that the net electric current is zero. Let $J = J_+$ be the constant ionic current carried by the cation across the junction. Then we must have: $J_- = -J$, so that the total electric current is zero: $J_+ + -J_- = 0$.

The system relating fluxes to potential gradients can be solved by inverting the conductivity matrix:

$$ \begin{pmatrix}-\partial_x V_+ \\ -\partial_x V_-\end{pmatrix} = \sigma^{-1} \begin{pmatrix}J_+ \\ J_-\end{pmatrix} = \frac{1}{\operatorname{det}(\sigma)} \begin{pmatrix}\sigma_{--} & -\sigma_{+-} \\ -\sigma_{-+} & \sigma_{++}\end{pmatrix} \begin{pmatrix}J \\ -J\end{pmatrix} $$

where $\operatorname{det}(\sigma) = \sigma_{++}\sigma_{--} - \sigma_{+-}\sigma_{-+} = \sigma_{++}\sigma_{--} - {\sigma_{+-}}^2 $.

Solving for the individual gradients gives:

$$ - \partial_x V_+ = \frac{\sigma_{--} + \sigma_{+-}}{\operatorname{det}(\sigma)} J $$

$$ - \partial_x V_- = \frac{-\sigma_{-+} - \sigma_{++}}{\operatorname{det}(\sigma)} J = \frac{- (\sigma_{+-} + \sigma_{++})}{\operatorname{det}(\sigma)} J $$

And, taking the ratio of these gradients:

$$ \frac{-\partial_x V_+}{-\partial_x V_-} = \frac{\partial_x V_+}{\partial_x V_-} = \frac{\sigma_{--} + \sigma_{+-}}{-(\sigma_{+-} + \sigma_{++})} $$

Therefore:

$$ \frac{\partial_x V_+}{\partial_x V_-} = - \frac{\sigma_{--} + \sigma_{+-}}{\sigma_{++} + \sigma_{+-}} = -\frac{t_-}{t_+}. $$

This shows that the ratio of the potential gradients across the junction under zero net current conditions is determined by the negative ratio of the transport numbers (which were defined based on the driven case). Integrating this relationship implies that the ratio of the total potential steps across the junction, $\Delta V_+ / \Delta V_-$, also equals $-t_- / t_+$, provided $t_-$ and $t_+$ are constants.

We also want to know how $V_+ - V_-$ (which relates to local concentration) evolves along the junction. We have:

$$\partial_x(V_+ - V_-) = -\frac{\sigma_{++} + \sigma_{+-} + \sigma_{+-} + \sigma_{--}}{\operatorname{det}(\sigma)} J$$

Since $\sigma_{ij}$ themselves depend on concentration (usually an increasing function, but not always), this means that the greatest changes in $V_+ - V_-$ will be near the lower concentration side.

### Case 3: single-ion transport

Another case of interest is that of lithium-ion battery electrolyte, where the cationic current $J_+ = J$ is forced by the battery discharge rate, whereas the spectator counter-ion has $J_- = 0$. In general this would also be the case during electroplating. What is of interest here is the total voltage drop in $V_+$.

At any point, the local voltage drop (gradient) in the cation is:

$$ - \partial_x V_+ = \frac{\sigma_{--}}{\operatorname{det}(\sigma)} J ,$$

and integrating this would give the overall voltage drop due to the cation travel through the electrolyte.

However, the counter-ion voltage drop matters too: if $V_+ - V_-$ grow too far apart (on the scale of $RT/F$) at one end or the other, then this means the concentrations of the ions will drop, and so the overall conductivity will drop too. This depleted region will thus contribute a large voltage drop. (see also [the Lithium Inventory page on transport](https://lithiuminventory.com/fundamentals/introduction-li-ion/transference/))

So, let's calculate the difference $\partial_x V_+ - \partial_x V_-$:

$$ \partial_x V_+ - \partial_x V_- = -\frac{\sigma_{--} + \sigma_{+-}}{\operatorname{det}(\sigma)} J .$$

In both of these drops, we ideally want to have $\sigma_{++}$ as large as possible, which will dominate the determinant and simply make both voltage drops small. Failing that, we want $t_-$ to be close to 0 ($\sigma_{--} + \sigma_{+-} \approx 0$) which indicates that the anions are immobilized, so then at least we can avoid the starvation effect.

## Thermal and non-ion gradients

Another case of interest is that of thermal gradients, as well as gradients in non-ionic species (such as the solvent) however that is a bit beyond our concern here.

* Osmotic pressure
* Thermoelectric and soret effects

In general we can set up a giant transport matrix that relates every driving force gradient ($\nabla V_i$ for ions, $\nabla \mu_i$ for non-ions, and $\nabla T$) to every flux (electric current $J_i$ for ions, particle flow $j_i$ for non-ions, and energy flow $q$), however it can get a bit unwieldy with all the cross-coefficients.

## Overpotentials

... TODO ...

