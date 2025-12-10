---
layout: layouts/esbd_topic.njk
title: 'Capacitance'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
orderESBD: 73
eleventyNavigation:
    key: Capacitance # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 73 # Order within the parent menu
---

# {{title}}

We have been framing our electrochemical problems as 'voltage-controlled', and it's interesting to see how we naturally get a form of capacitance.

## Bulk charge storage: ambipolar capacitance

In our $V_i$ view, we have defined the following free energy function:

$$ G(V_1, \ldots, V_N, N_{\mathrm{solvent}}, P, T) $$

We've used the $V_i$ as our control variables. Any set of $V_i$ is permissible because charge neutral. This is the clean Guggenheim view of the thermodynamics of a material such as an electrolyte solution; $\phi$ does not appear.

Here we've assumed constant mass of the solvent/medium, and constant pressure, as these are the more realistic situation for most devices. Often it's assumed that no expansion 

Ambipolar capacitance:
$$ {\mathbf C}^{\mathrm{amb}}_{ij} = \frac{\partial Q_i}{\partial V_j} = -\frac{\partial^2 G}{\partial V_i \partial V_j} $$

Charge neutral means this is a real capacitance matrix

Special case of ambipolar capacitance is two-carrier case: a single capacitor. Battery electrodes.

*** CAPACITANCE DIAGRAM - SINGLE-CAP (electron-ion) ***

But it generalizes to a fully coupled matrix:

*** CAPACITANCE DIAGRAM - DELTA and 5-CELL ***

We'll see below why the full coupling naturally results

## Chemical capacitance

Violations of bulk charge neutrality - interfaces, impurities, screening, etc.

Reintroduce phi. New free energy ("local density approximation"):

$$ G^\phi (\phi, V_1, \ldots, V_N, N_{\mathrm{solvent}}, P, T) $$

Chemical capacitance can be defined in multiple equivalent ways:

$$\begin{aligned}
\mathcal{C}_{ij}
&= -\frac{\partial^2 G^\phi}{\partial V_i \partial V_j} \\
&= \left. \frac{\partial Q_i}{\partial V_j} \right|_{\{V_1\ldots V_N\},\phi} \\
&= z_i z_j F^2 \frac{\partial N_i}{\partial \mu^{\mathrm{int}}_j} \\
\end{aligned}$$

Usually the last form, and often it is assumed that each particle number only depends on its own chemical potential.

The chemical capacitance matrix $\mathcal{C}$ is positive definite but it is *not* a proper capacitance matrix because it's not charge neutral.

We also define a per-ion screening vector:
$$\begin{aligned}
s_i
&= -\left( \frac{\partial Q_i}{\partial \phi} \right)_{V_1, \cdots V_N} \\
&= \sum_j \left( \frac{\partial Q_i}{\partial V_j} \right)_{V_1, \cdots V_N,\phi}
\end{aligned}$$
where this equation works because shifting $\phi$ up is equivalent to shifting all $V_i$ down.

We then have for all ion charges:

$$ \delta\mathbf{Q} = \mathcal{C} \delta \mathbf{V} + \mathbf{s} \delta \phi $$

And note the total induced charge is:

$$ \delta Q_{\mathrm{free}} = \sum_i(\delta Q_i) = \mathbf{s}^T \delta \mathbf{V} - C_s \delta \phi $$

Where $C_s = \sum_i s_i$ as a 'total screening power. Note: for all $V_i$ fixed this leads exactly to Debye screening: $\varepsilon \nabla^2 \phi = C_s \phi$.

As mentioned above $\mathcal{C}$ is not a capacitance matrix. But at this point we can do a cool trick: we define a 'displacement charge' to be the negative of the total charge. In effect this turns $\phi$ into a circuit node that contains a displacement charge:

$$ \delta Q_d = - \delta Q_{\mathrm{free}}  = -\mathbf{s}^T \delta \mathbf{V} + C_s \delta \phi $$

Together these give us an extended chemical capacitance matrix which actually is a capacitance matrix!

$$\begin{aligned}
\begin{bmatrix}\delta Q_i \\ \delta Q_d \end{bmatrix}
&= 
\begin{bmatrix} \mathcal{C} & -\mathbf{s} \\ -\mathbf{s}^T & C_s \end{bmatrix} 
\begin{bmatrix}\delta V_i \\ \delta \phi \end{bmatrix} \\
&= {\mathbf C}^{\mathrm{ext}}_{ij} \begin{bmatrix}\delta V_i \\ \delta \phi \end{bmatrix}
\end{aligned}$$

*** CAPACITANCE DIAGRAM - WYE and WYE+DELTA ***

Ideal: star topology (WYE).

## The connection

If we take ${\mathbf C}^{\mathrm{ext}}$ and force it to be charge neutral by floating $\phi$ to whatever value it needs to be, we have:

$$ 0 = - \mathbf{s}^T \mathbf{V} + C_s \delta\phi $$
$$ \mathbf{Q} = \mathcal{C} \delta \mathbf{V} + \mathbf{s} \delta \phi $$

so we get:

$$ {\mathbf C}^{\mathrm{amb}} = \mathcal{C} - \frac{\mathbf{s} \mathbf{s}^T}{C_s} $$

## Why ambipolar capacitance matters

### Charge storage

Integrated ambipolar capacitance *is* the charge storage of a bulk material such as a battery electrode.

### Rigour in nonideal solutions

Ambipolar capacitance is a thermodynamic observable and directly relates to mean activities. E.g. Debye-Huckel or Pitzer models predict a specific ambipolar capacitance matrix.

### Ambipolar diffusion

Ambipolar capacitance directly appears in the conduction equation in quasi-charge-neutral regime:

$$ {\mathbf C}^{\mathrm{amb}} \frac{\partial \mathbf{V}}{\partial t} = {\mathbf \sigma} \nabla^2 \mathbf{V} $$

$$ \frac{\partial \mathbf{V}}{\partial t} = {\mathbf D}^{\mathrm{amb}} \nabla^2 \mathbf{V} $$

$$ \frac{\partial \mathbf{\rho}}{\partial t} = {\mathbf D}^{\mathrm{amb}} \nabla^2 \mathbf{\rho} $$


Even in the ideal case when conductivity matrix ${\mathbf \sigma}$ is diagonal and $\mathcal{C}$ is diagonal, ${\mathbf C}^{\mathrm{amb}}$ is fully dense and so ${\mathbf D}^{\mathrm{amb}}$ is fully dense. The eigvenvalues of ${\mathbf D}^{\mathrm{amb}}$ represent different rates of ambipolar diffusion, that can be observed!

