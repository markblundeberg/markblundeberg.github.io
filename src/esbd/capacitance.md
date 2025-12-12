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

We have been framing our electrochemical problems as 'voltage-controlled', and it's interesting to see how we naturally get a form of capacitance. We've already seen this in the previous Topics about [equilibrium](../equilibrium/) and [lithium-ion batteries](../lib/), and now we're going to return to it in a more generic view:
* any number of ions
* any kinds of interactions, and
* explaining "chemical capacitance"

We are going to define two key kinds of chemical capacitance here:
* **ambipolar capacitance** (describing bulk charge storage),
* **internal chemical capacitance** (for describing space charge regions),

and the relation between them.

## Ambipolar capacitance (bulk charge storage)

### Thermodynamic setting

In our $V_i$ view, we have defined the following free energy function (for more info about this, see the [Thermodynamics topic](../thermodynamics) -- there we called this quantity $F_{\mathrm{bulk}}$):

$$ F(V_1, \ldots, V_N) $$

(I'm being a bit vague about the other control variables -- is it constant-volume with fixed solvent chemical potential or constant-pressure with fixed solvent mass? Is it isothermal or adiabatic? We'll leave that undecided for now but note that the choice does affect the capacitance values.)

When we change one of these $V_i$'s, the partial derivative gives us the charge of that species:

$$ Q_i(V_1, \ldots, V_N) = -\frac{\partial F}{\partial V_j}. $$

Each one of these $Q_i$ is a function of all the $V_i$ values. This has to be the case because the bulk is charge neutral: $ 0 = Q = Q_{\mathrm{fix}} + \sum Q_i $. So if $Q_1$ increases under some change of parameters then all the other $Q_i$'s have to decrease such that the net total change is 0. Note that there could be some dopants present which modify the free energy function, including by inducing a background charge $Q_{\mathrm{fix}} \neq 0$.

(And again, to remind, this is usually expressed in terms of electrochemical potential $\bar\mu_i = q_i V_i$ and particle number $N_i = Q_i / q_i$ but the voltage and charge units are more practical.)

### Ambipolar capacitance defined

Capacitance is a change in charge due to a change in some voltage difference $\mathrm{d}Q/\mathrm{d}V$. Beginners learn about linear plate capacitors with nice constant capacitance values ($Q/V$), but we are going to talk about capacitance in the generic differential sense: a change in some charge due to a change in some voltage.

The case of charge storage in materials we must be aware of these complications: we have 1) multiple control voltages, not just two, 2) multiple *charge types*, 3) nonlinearity, and 4) no parallel-plate geometry at all, it is simply a bulk (volumetric or gravimetric) capacitance.

We can define capacitance as a matrix, which we call **ambipolar capacitance matrix**:

$$\begin{aligned}
\mathbf{C}^{\mathrm{amb}}_{ij}
& = \left(\frac{\partial Q_i}{\partial V_j}\right)_{V_1, \ldots V_N, Q=0} \\
& = q_i q_j \left(\frac{\partial N_i}{\partial \bar\mu_j}\right)_{\bar\mu_1, \ldots \bar\mu_N, Q=0}
,
\end{aligned}$$

where we added the subscript $Q=0$ to emphasize that this is for a charge-neutral (ambipolar) bulk.

This matrix $ \mathbf{C}^{\mathrm{amb}}$ is truly a {% wiki "capacitance matrix" %} in the mathematical sense: its units are farads, its rows and columns sum to zero, it is symmetric, and it is positive semi-definite. Normally we would use capacitance matrix to describe the self- and mutual capacitance of a collection of conductors, but in this case the "conductors" are actually all overlapping in space. A regular geometrical capacitance matrix is highly sensitive to arrangement, shapes, and distances, while the ambipolar capacitance is simply proportional to volume of solvent/medium (or mass, depending on what else we are holding fixed).

In general the ambipolar capacitance is a dense matrix (all entries nonzero) and can be thought of in terms of a fully connected equivalent circuit:

*** CAPACITANCE DIAGRAM - DELTA and 5-CELL ***

A special case of ambipolar capacitance is two-carrier case: a single capacitor. Battery electrodes. This results $\mathbf{C}^{\mathrm{amb}}$ being a $2 \times 2$ matrix of the form $\big[\begin{smallmatrix} C & -C \\ -C & C \end{smallmatrix}\big]$ for some $C > 0$. This is just a single capacitor in equivalent circuit:

*** CAPACITANCE DIAGRAM - SINGLE-CAP (electron-ion) ***

(Often this two-species coupling $C$ value is called 'chemical capacitance' but that term is ambiguous. In other context it instead refers to the *internal* chemical capacitance I define below.)

If you only cared about two carriers, then the $\mathbf{C}^{\mathrm{amb}}$ matrix looks like overkill (why not just use $C$) but it is absolutely necessary in the case of more than two carriers. Note that some other multicarrier generalizations of chemical capacitance seen in the literature are not correct.^[E.g. In JM2001 they defined 'component chemical capacitance', which only works for the two ion case and is not meaningful beyond that.]

Ambipolar capacitances can be very large, e.g. for a typical $1~\mathrm{mol/L}$ solution of $+e$ and $-e$ carriers, you'll have a $V_{\mathrm{cation}}$-$V_{\mathrm{anion}}$ mutual capacitance of order $2~\mathrm{farads}$ per $\mathrm{cm}^3$ of volume, which is a {% wiki "supercapacitor" %} level of volumetric capacitance. The ambipolar charge storage capacity is a key factor for both lithium ion batteries (in the electrodes) and lead-acid batteries (in solution). The ambipolar diffusion associated with ambipolar capacitance is often too slow for capacitor use cases, though finely ground mixtures of charge storage materials can alleviate this and so some supercapacitors can be described in terms of ambipolar capacitance (ambipolar capacitance can be equally well used to describe mixtures of materials as long as they are reasonably homogeneous on the large scale).

We'll see below how ambipolar capacitance naturally comes about even in ideal systems, and how the ambipolar capacitance can be expressed in terms of ideal quantities.

### Why ambipolar capacitance matters

#### Charge storage

Integrated ambipolar capacitance *is* the charge storage of a bulk material such as a battery electrode. Note that for $N$ independent charged species, the charge storage 'space' is $(N-1)$-dimensional. For all practical charge storage materials $N=2$ so the charging is one dimensional.

#### Rigour in nonideal solutions

Ambipolar capacitance is a thermodynamic observable and directly relates to mean activities. E.g. Debye-Huckel or Pitzer models predict a specific ambipolar capacitance matrix. Descriptions of these nonideal electrolytes in terms of single-ion activities corresponds to a description in terms of $\mathcal{C}$, which will be a dense matrix in nonideal solutions and generally regarded as unmeasurable. The ambipolar $\mathbf{C}^{\mathrm{amb}}$ (based on a real thermodynamic free energy as we established in the beginning) relates to measurable mean activities.

#### Ambipolar diffusion

Ambipolar capacitance directly appears in the conduction equation in quasi-charge-neutral regime:

$$ \mathbf{C}^{\mathrm{amb}} \frac{\partial \mathbf{V}}{\partial t} = {\mathbf \sigma} \nabla^2 \mathbf{V} $$

$$ \frac{\partial \mathbf{V}}{\partial t} = {\mathbf D}^{\mathrm{amb}} \nabla^2 \mathbf{V} $$

$$ \frac{\partial \mathbf{\rho}}{\partial t} = {\mathbf D}^{\mathrm{amb}} \nabla^2 \mathbf{\rho} $$

Even in the ideal case when conductivity matrix ${\mathbf \sigma}$ is diagonal and $\mathcal{C}$ is diagonal, $\mathbf{C}^{\mathrm{amb}}$ is fully dense and so ${\mathbf D}^{\mathrm{amb}}$ is fully dense. The eigvenvalues of ${\mathbf D}^{\mathrm{amb}}$ represent different rates of ambipolar diffusion, that can be observed!

## Internal chemical capacitance (space charge)

Near interfaces, impurities, and in/around depletion regions, there are variations in charge neutrality. We want to model these regions as having some continuum space charge $\rho$ and some continuum electrostatic potential $\phi$. To this end we make a "local density approximation", by declaring that each infinitesimal volume $\mathrm{d}V$ has a local free energy function:

$$ F^\phi (V_1, \ldots, V_N, \phi) \propto \mathrm{d}V $$

It's worth reminding that we are abandoning thermodynamic rigour when we asking for continuum thermodynamics to apply, especially in the case of space charge at microscopic scales. The local density approximation is justified in some idealized systems, but it is only approximately correct in reality.

We also now make the idealization that the medium is fixed, and does not expand at all due to the motion of the ionic/electronic solutes.

We're going to define internal chemical capacitance. It is exactly equivalent to {% wiki "quantum capacitance" %}, though that is usually restricted to one carrier. Internal chemical capacitance can be defined in multiple equivalent ways:

$$\begin{aligned}
\mathcal{C}_{ij}
&= -\frac{\partial^2 F^\phi}{\partial V_i \partial V_j} \\
&= \left( \frac{\partial Q_i}{\partial V_j} \right)_{\{V_1\ldots V_N\},\phi} \\
&= q_i q_j \frac{\partial N_i}{\partial \mu^{\mathrm{int}}_j} \\
\end{aligned}$$

This is quite similar to ambipolar capacitance above, but note we are fixing $\phi$ instead of fixing $Q=0$.

> Note that "chemical capacitance" is ambiguous. Sometimes that refers to internal chemical capacitance as just defined (cite JM2001 and others) but often in ionics the term "chemical capacitance" refers to the 2-carrier ambipolar capacitance described above (cite JM1999 and others). 

Internal chemical capacitance is usually invoked in systems with a well defined mean field $\phi$, such as ideal-dilute solutes, ideal Fermi gases, and such. Consequently, it tends to be the case that $\mathcal{C}$ is diagonal:

$$ \mathcal{C}^{\mathrm{ideal}} = \begin{bmatrix}
\mathcal{C}_{11} & 0 & \cdots & 0 \\
0 & \mathcal{C}_{22} & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & \mathcal{C}_{NN}
\end{bmatrix} $$

(And in fact in ideal cases we often see internal chemical capacitance defined as $\mathcal{C}_{ii} = q_i^2 (\partial \mu_i / \partial c_i)^{-1}$; this definition only makes sense however when the $\mathcal{C}$ matrix is diagonal.^[Technically $\mathcal{P}_{ij} = (\partial \mu_i / \partial c_j)_{c_1,\ldots,c_N}$ is an *internal chemical elastance* matrix, and $\mathcal{C} = \mathcal{P}^{-1}$. The diagonals of these matrices are inverses of each other only when the matrices are diagonal.])

For example:
* In a degenerate Fermi gas of electrons, $\mathcal{C}/V = e^2 g(E_F)$ for density of states $g(E_F)$ better known as {% wiki "quantum capacitance" %}. For dilute (thermal) electrons or holes in semiconductors, $\mathcal{C}/V = e^2 n / (kT)$ for carrier density $n$.
* In ideal-dilute electrolytes, $\mathcal{C}_{ii}/V = (z_i F)^2 c_i / (RT)$ for ion molarity $c_i$, for each ion species.

Going beyond the ideal case, however, correlations will cause cross terms. And in fact charged solutes are very happy to correlate with each other even when fairly dilute (this is the essence of Debye-Huckel effect), because the microscopic electrostatic interactions between ions are so long ranged.

Note the internal chemical capacitance matrix $\mathcal{C}$ is generally symmetric and positive definite, but it is *not* a proper capacitance matrix because it's not charge neutral: the rows do not add to zero.

### Screening properties

We define a per-ion screening vector:
$$\begin{aligned}
s_i
&= -\left( \frac{\partial Q_i}{\partial \phi} \right)_{V_1, \cdots V_N} \\
&= \sum_j \left( \frac{\partial Q_i}{\partial V_j} \right)_{V_1, \cdots V_N,\phi} \\
&= \sum_j \mathcal{C}_{ij}
\end{aligned}$$
where this step works because of gauge invariance shifting $\phi$ up is equivalent to shifting all $V_i$ down. We can write this as $\mathbf{s} = \mathcal{C} \mathbf{1}_{N}$. In the ideal case, we have simply $s_i = \mathcal{C}_{ii}$.

We then have for all ion charges a full description of charge variations.

$$ \delta\mathbf{Q} = \mathcal{C} \delta \mathbf{V} + \mathbf{s} \delta \phi $$

or in matrix form:
$$
\begin{bmatrix}\delta Q_1 \\ \vdots \\ \delta Q_N \end{bmatrix}
= 
\begin{bmatrix}
\mathcal{C}_{11} & \cdots & \mathcal{C}_{1N} & -\mathbf{s}_1 \\
\vdots & \ddots & \vdots & \vdots \\
\mathcal{C}_{N1} & \cdots & \mathcal{C}_{NN} & -\mathbf{s}_N \\
\end{bmatrix} 
\begin{bmatrix}\delta V_1 \\ \vdots \\ \delta V_N \\ \delta \phi \end{bmatrix}
.
$$

Note also the total induced charge is:

$$ \delta Q_{\mathrm{free}} = \sum_i(\delta Q_i) = \mathbf{s}^T \delta \mathbf{V} - \mathcal{C}_{\mathrm{tot}} \delta \phi $$

Where $\mathcal{C}_{\mathrm{tot}} = \sum_i s_i = \sum_{ij} \mathcal{C}_{ij}$ is the total screening power.

> Screening is often derived laboriously in a particle-number basis. But in a $V_i$ basis we know simply that all $V_i$ are flat at equilibrium, and so the above equation means that at every point in space the induced free charge density from small variations $\delta \phi$ is $\delta \rho_{\mathrm{free}} = c_s \delta \phi $ where $c_s = \mathcal{C}_{\mathrm{tot}} / \mathrm{volume}$ is the volumetric screening power, and again this is a sum of all the internal chemical capacitances, per unit volume.
>
> The Poisson equation then leads exactly to the linear screening equation: $\varepsilon \nabla^2 \delta \phi = c_s \delta \phi + \rho_{\mathrm{imp}}$ where $\varepsilon$ is the medium's absolute permittivity and $\rho_{\mathrm{imp}}$ is the impurity charge density. This means $\sqrt{\varepsilon/c_s}$ is precisely the screening length in the general case of mixed charge carriers with any statistics (the {% wiki "Debye length" %} and {% wiki "Thomas–Fermi screening length" %} are both special cases of this).

### Ambipolar capacitance and internal chemical capacitance related

If we take our internal chemical capacitance and force the volume to be charge neutral ($\delta Q_{\mathrm{free}} = 0$), then $\phi$ must float to whatever value is necessary to get neutrality. We then get:

$$ 0 = - \mathbf{s}^T \delta \mathbf{V} + \mathcal{C}_{\mathrm{tot}} \delta\phi $$
$$ \mathbf{Q} = \mathcal{C} \delta \mathbf{V} + \mathbf{s} \delta \phi $$

and so we see that the ambipolar and internal chemical capacitance matrices are precisely related:

$$\begin{aligned}
\mathbf{C}^{\mathrm{amb}}
& = \mathcal{C} - \frac{\mathbf{s} \mathbf{s}^T}{\mathcal{C}_{\mathrm{tot}}} \\
\mathbf{C}^{\mathrm{amb}}_{ij} & = \mathcal{C}_{ij} - \frac{\sum_{kl}\mathcal{C}_{ik}\mathcal{C}_{jl}}{\sum_{kl}\mathcal{C}_{kl}} \\
\end{aligned}$$

So, $\mathbf{C}^{\mathrm{amb}}$ has strictly less information than $\mathcal{C}$. On the other hand, $\mathbf{C}^{\mathrm{amb}}$ is a general thermodynamic property that does not make any microscopic assumptions as are usually needed for $\mathcal{C}$, but only the latter can be used to model continuum space charges.

IDEA: SHOW VENN DIAGRAM OF APPLICABILITY?

### Extended chemical capacitance matrix (the Jamnik-Maier trick)

As mentioned above $\mathcal{C}$ is not a capacitance matrix, and that's because the capacitances therein are with respect to $\phi$, which is unusual for a capacitance since usually capacitance needs a balanced charge on both sides (and $\phi$ normally does not 'store charge'). At this point we can do a cool trick:(cite JM2001) we define a 'displacement charge' to be the negative of the total charge. In effect this turns $\phi$ into a proper circuit node that contains a displacement charge.

$$ \delta Q_{\mathrm d} = - \delta Q_{\mathrm{free}}  = -\mathbf{s}^T \delta \mathbf{V} + \mathcal{C}_{\mathrm{tot}} \delta \phi $$

Together these give us a full system like so:

$$
\begin{bmatrix}\delta Q_1 \\ \vdots \\ \delta Q_N \\ \delta Q_{\mathrm d} \end{bmatrix}
= 
\begin{bmatrix}
\mathcal{C}_{11} & \cdots & \mathcal{C}_{1N} & -\mathbf{s}_1 \\
\vdots & \ddots & \vdots & \vdots \\
\mathcal{C}_{N1} & \cdots & \mathcal{C}_{NN} & -\mathbf{s}_N \\
-\mathbf{s}_1 & \cdots & -\mathbf{s}_N & \mathcal{C}_{\mathrm{tot}} \\
\end{bmatrix} 
\begin{bmatrix}\delta V_1 \\ \vdots \\ \delta V_N \\ \delta \phi \end{bmatrix}
.
$$

And this large matrix I call the **extended chemical capacitance matrix** $\mathbf{C}^{\mathrm{ext}}$, in block matrix form:
$$\mathbf{C}^{\mathrm{ext}} = \begin{bmatrix} \mathcal{C} & -\mathbf{s} \\ -\mathbf{s}^T & \mathcal{C}_{\mathrm{tot}} \end{bmatrix}  $$

The extended chemical capacitance matrix is a capacitance matrix!

{#
For the ideal case the matrix looks like:

$$ \mathbf{C}^{\mathrm{ext,ideal}} = \begin{bmatrix}
\mathcal{C}_{11} & 0 & \cdots & 0 & -\mathcal{C}_{11} \\
0 & \mathcal{C}_{22} & \cdots & 0 & -\mathcal{C}_{22}\\
\vdots & \vdots & \ddots & 0 & \vdots\\
0 & 0 & \cdots & \mathcal{C}_{NN} & -\mathcal{C}_{NN} \\
-\mathcal{C}_{11} & -\mathcal{C}_{22} & \cdots & -\mathcal{C}_{NN} & \sum \mathcal{C}
\end{bmatrix} $$
#}

*** CAPACITANCE DIAGRAM - WYE+DELTA and WYE (ideal)***

In relation to this, the ambipolar capacitance can be seen as elimination of the $\phi$ node from the $\mathbf{C}^{\mathrm{ext}}$ capacitance matrix (a {% wiki "Schur complement" %} operation), which when viewing both $\mathbf{C}^{\mathrm{ext}}$ and $\mathbf{C}^{\mathrm{amb}}$ as capacitor networks is known as a {% wiki "Kron reduction" %} or a {% wiki "star-mesh transform" %}.

This makes $\mathbf{C}^{\mathrm{amb}}$ to be a dense matrix ('fully connected'), even when $\mathcal{C}$ is ideal and diagonal (so $\mathbf{C}^{\mathrm{ext}}$ is a 'star' topology).

*** CAPACITANCE DIAGRAMS - WYE (ideal) -> DELTA ***

We can use this to express the Jamnik-Maier equivalent circuit picture of charge conservation in transport and electrostatics. (Assuming that the movement of ions is not causing any expansion of the medium):

$$
\frac{\mathbf{C}^{\mathrm{ext}}}{\mathrm{volume}} 
\frac{\partial}{\partial t}
\begin{bmatrix} V_1 \\ \vdots \\ V_N \\ \phi \end{bmatrix}
=
- \begin{bmatrix}  \nabla \cdot \mathbf{J}_1 \\ \vdots \\ \nabla \cdot \mathbf{J}_N \\ \nabla \cdot \mathbf{J}_{\mathrm{d}} \end{bmatrix}
$$

where $\mathbf{J}_{\mathrm{d}} = \partial \mathbf{D} / \partial t$ is the {% wiki "displacement current" %}. The last row is basically Gauss's law, $\rho_{\mathrm{free}} = \nabla \cdot D$ but in a time-derivated form!^[The fact that it's time derivative means we might start out with the 'wrong' displacment charges, which corresponds to the Jamnik-Maier equivalent circuit having $\phi$ nodes that are fully floating and thus having indeterminate starting charges.] The other part of the Jamnik-Maier picture is the constitutive relations: $\mathbf J_i = -\sigma_i \nabla V_i$ (ohm's law i.e. drift-diffusion; resistors in the equivalent circuit), and $\mathbf{D} = - \varepsilon \nabla \phi $ (capacitors between displacement nodes on the equivalent circuit). The Jamnik-Maier equivalent circuit is based on discretizing this into finite volumes, but in fact the above is an elegant restatement of the Poisson-Nernst-Planck equations (which are continuum).
