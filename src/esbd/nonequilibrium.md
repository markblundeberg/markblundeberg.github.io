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


Suppose that we have a cation and anion (having arbitrary charges $z_+$ and $z_-$) with their respective species voltages $V_+$ and $V_-$, both varying along the $x$ space coordinate. We can expect a general continuum linear response relating the electrical current densities ($J_\pm$) of each ion to the gradients (driving forces, $-\partial_x V_\pm$) of the voltages:

$$
\begin{pmatrix}J_+ \\ J_-\end{pmatrix} = \begin{pmatrix}\sigma_{++} & \sigma_{+-} \\ \sigma_{+-} & \sigma_{--}\end{pmatrix} \begin{pmatrix}-\partial_x V_+ \\ -\partial_x V_-\end{pmatrix}
$$

where the $\sigma_{ij}$ form a conductivity matrix (in the usual units of electrical conductivity). Note that the above is a form of the Onsager transport equations, as the $V_\pm$ are scaled electrochemical potentials and the $J_\pm$ are scaled particle fluxes. Onsager reciprocity requires $\sigma_{-+} = \sigma_{+-}$ in the absence of external magnetic fields.

Here we would expect a diagonal conductivity matrix ($\sigma_{+-} = 0$) only in the infinitely dilute limit, with each diagonal conductivity $\sigma_{\pm\pm}$ given by that ion's mobility and concentration. Going beyond the dilute limit, we expect the ions to interact (e.g., drag on each other), creating off-diagonal contributions $\sigma_{+-}$ (electrophoretic effects) as well as modifying the diagonal terms. Furthermore, some fraction of ions might not participate in conduction due to ion pairing. The cross terms are also important for describing coupled transport in other systems, such as intercalated lithium ions versus electrons inside graphite.

Anyway, let's consider two limiting cases for this electrolyte system:

### Case 1: Bulk transport driven by field

Suppose we have a homogeneous bulk solution and we apply a net electric field $E \hat x$. In this case, the $V_i$ gradients are equal for all ions and determined by the field: $\partial_x V_+ = \partial_x V_- = -E $. The resulting partial currents are:

$$ J_+ = (\sigma_{++} + \sigma_{+-}) E , $$
$$ J_- = (\sigma_{+-} + \sigma_{--}) E . $$

The total current is $J_{total} = J_+ + J_-$. Of interest are the ion transference numbers, defined as the fraction of the total current carried by each ion: $t_+ = J_+ / J_{total}$, and $t_- = J_- / J_{total}$. In particular, their ratio is:

$$ \frac{t_+}{t_-} = \frac{J_+}{J_-} = \frac{\sigma_{++} + \sigma_{+-}}{\sigma_{+-} + \sigma_{--}} . $$

### Case 2: Diffusion in open circuit (Liquid Junction)

Now, consider the diffusion case under the condition that the net electric current is zero: $J_+ + J_- = 0$. This implies $J_+ = -J_-$. Let $J = J_+$ be the constant ionic current carried by the cation across the junction. The system relating fluxes to potential gradients can be solved by inverting the conductivity matrix:

$$ \begin{pmatrix}-\partial_x V_+ \\ -\partial_x V_-\end{pmatrix} = \sigma^{-1} \begin{pmatrix}J_+ \\ J_-\end{pmatrix} = \frac{1}{\operatorname{det}(\sigma)} \begin{pmatrix}\sigma_{--} & -\sigma_{+-} \\ -\sigma_{-+} & \sigma_{++}\end{pmatrix} \begin{pmatrix}J \\ -J\end{pmatrix} $$

where $\operatorname{det}(\sigma) = \sigma_{++}\sigma_{--} - \sigma_{+-}\sigma_{-+} = \sigma_{++}\sigma_{--} - {\sigma_{+-}}^2 $.

Solving for the individual gradients gives:

$$ - \partial_x V_+ = \frac{\sigma_{--} + \sigma_{+-}}{\operatorname{det}(\sigma)} J $$

$$ - \partial_x V_- = \frac{-\sigma_{-+} - \sigma_{++}}{\operatorname{det}(\sigma)} J = \frac{- (\sigma_{+-} + \sigma_{++})}{\operatorname{det}(\sigma)} J $$

And, taking the ratio of these gradients:

$$ \frac{-\partial_x V_+}{-\partial_x V_-} = \frac{\partial_x V_+}{\partial_x V_-} = \frac{\sigma_{--} + \sigma_{+-}}{-(\sigma_{+-} + \sigma_{++})} $$

Therefore:

$$ \frac{\partial_x V_+}{\partial_x V_-} = - \frac{\sigma_{--} + \sigma_{+-}}{\sigma_{++} + \sigma_{+-}} = -\frac{t_-}{t_+}. $$

This shows that the ratio of the potential gradients across the junction under zero net current conditions is determined by the negative ratio of the transport numbers (which were defined based on the driven case). Integrating this relationship implies that the ratio of the total potential steps across the junction, $\Delta V_+ / \Delta V_-$, also equals $-t_- / t_+$.

### Case 3: single-ion transport

Another case of interest is that of lithium-ion battery electrolyte, where the cationic current $J_+ = J$ is forced by the battery discharge rate, whereas the spectator counter-ion has $J_- = 0$. In general this would also be the case during electroplating. What is of interest here is the total voltage drop in $V_+$.

At any point, the local voltage drop (gradient) in the cation is:

$$ - \partial_x V_+ = \frac{\sigma_{--}}{\operatorname{det}(\sigma)} J ,$$

and integrating this would give the overall voltage drop due to the cation travel through the electrolyte.

However, the counter-ion voltage drop matters too: if $V_+ - V_-$ grow too far apart (on the scale of $RT/F$) at one end or the other, then this means the concentrations of the ions will drop, and so the overall conductivity will drop too. This depleted region will thus contribute a large voltage drop. (see also https://lithiuminventory.com/fundamentals/introduction-li-ion/transference/ )

So, let's calculate the difference $\partial_x V_+ - \partial_x V_-$:

$$ \partial_x V_+ - \partial_x V_- = -\frac{\sigma_{--} + \sigma_{+-}}{\operatorname{det}(\sigma)} J .$$

In both of these drops, we ideally want to have $\sigma_{++}$ as large as possible, which will dominate the determinant and simply make both voltage drops small. Failing that, we want $t_-$ to be close to 0 ($\sigma_{--} + \sigma_{+-} \approx 0$) which indicates that the anions are immobilized, so then at least we can avoid the starvation effect.

## Takeaways
