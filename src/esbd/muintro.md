---
layout: layouts/esbd_topic.njk
title: 'Understanding electrochemical potential'
tags: [page, esbd_topic]
orderESBD: 80
---

{% set idsuffix = "muintro" %}

# {{title}}

This is an optional deep dive. The main thread treats $V_i$ as a working tool and tells you, quite deliberately, that you don't need to understand electrochemical potential to use it. That is true, and if you are happy taking $V_i$ at face value you can skip this page entirely.

But some readers — especially those arriving from semiconductor physics or physical chemistry — will want to know what is underneath. And there is a genuine claim worth defending here, so let me separate two things this project asserts, because they are not equally bold:

1. That $V_i$ behaves like a voltage and can be plotted on one shared axis. This is a *visualization*. It is a good one, but I will not ask you to believe that $V_i$ is "really" a voltage.
2. That the electrochemical potential $\bar\mu_i$ is the genuine chemical potential of a charged species: one indivisible quantity, and not a sum of a "chemical part" and an "electrostatic part" that merely happen to travel together.

The first is a convenience. The second is the claim I actually care about, and it is the one that makes $V_i$ feel inevitable rather than invented. This page is about earning it.

## What particles want

How does a mobile particle know where to go? For any single particle that is a hopeless tangle of microscopic forces, but on average the statistical tendency is captured by one number, the {% wiki "chemical_potential" %} $\mu_i$ for species $i$. Chemical potential is to particles what temperature is to energy: two bodies in contact equilibrate by exchanging particles until their $\mu_i$ match, exactly as they exchange heat until their temperatures match. Particles drift from high $\mu_i$ to low $\mu_i$, and the spontaneous flow stops precisely when $\mu_i$ is everywhere equal.

That last sentence is the whole reason chemical potential is worth defining. The equality of $\mu_i$ at equilibrium is a kind of zeroth law for particles, and everything downstream — reactions, phase changes, diffusion, the readings on a voltmeter — is a statement about $\mu_i$ trying to level out.

{% include "esbd-diagrams/mu-driving-force.html" %}

Thermodynamically, $\mu_i$ is just a derivative of a free energy: take a body with free energy $G$, add one particle of species $i$ while holding the rest fixed, and the cost is

$$ \mu_i = \frac{\partial G}{\partial N_i}. $$

Simple enough for uncharged particles. The trouble begins when species $i$ carries charge.

## Ions are weird

Charged species behave differently in one specific way: their chemical potential is sensitive to the electrostatic state. If we hold the material composition fixed and merely shift the surrounding electrostatic potential by $\Delta\phi$, the chemical potential of each charged species moves by $z_i F \Delta\phi$ — a different amount for each, depending on its charge.

{% include "esbd-diagrams/mu-shift-only.html" %}

Watch what that does. Here are some hypothetical charged species together in one body, and a slider that only changes the electrostatic offset $\Delta\phi$. The levels scatter every which way — positive species rise, negative species fall, doubly charged ones move twice as fast. It looks like chaos, and it makes comparing $\bar\mu_i$ values across different materials or conditions genuinely awkward.

There is a subtler problem hiding underneath, and it is the crux of everything that follows. Go back to the definition $\mu_i = \partial G / \partial N_i$. To take that derivative for an *ion*, you must add one ion to the body — which adds charge, which means the body is no longer charge neutral. The very act of defining a single ion's chemical potential forces you to violate charge neutrality. There is no way around it.

(And there is a fair question we are skating past: when you add that ion, where did it come *from*? That turns out to matter, and we will come back to it. For now, just notice that you cannot even ask for a single ion's $\mu_i$ without disturbing the charge.)

So a single-ion chemical potential is inescapably a charged-body quantity. It cannot avoid the electrostatics. This is why, for charged species, I write the chemical potential as the **electrochemical potential** $\bar\mu_i$, with a bar, as a reminder that it carries this electrical sensitivity that an ordinary neutral $\mu_i$ does not.

## A natural split, and why it dissolves

The classic way to tame the scattering levels is to subtract off the electrostatic part by hand. Posit an electrostatic potential $\phi$ inside the material, declare that an ion's electrostatic energy is $z_i F \phi$, and define what is left as an *internal* chemical potential:

$$ \mu_{\mathrm{int},i} = \bar\mu_i - z_i F \phi. $$

Now repeat the experiment. The full $\bar\mu_i$ still scatter under $\Delta\phi$, but the $\mu_{\mathrm{int},i}$ sit perfectly still:

{% include "esbd-diagrams/mu-shift-mu-internal.html" %}

This looks like a triumph. The $\mu_{\mathrm{int},i}$ contain ordinary, well-behaved chemistry, and all the annoying electrical motion has been quarantined into one tidy $z_i F \phi$ term. From here it is a short step to the usual textbook stance: that $\bar\mu_i$ and $\mu_{\mathrm{int},i}$ are *equally valid* descriptions, two sides of one coin, take your pick.

I want to argue that they are not equally valid, and that $\bar\mu_i$ is the real one. Two reasons, an easy one and a deep one.

The easy one is decisive on its own. Ask what nature actually equalizes at equilibrium. When an ion is free to move between two bodies and settles into equilibrium, the quantity that becomes equal across them is $\bar\mu_i$ — the full thing, bar and all. Not $\mu_{\mathrm{int},i}$, not $\phi$, not any reshuffling of the two. The zeroth law from the first section, applied to ions, picks out $\bar\mu_i$ and nothing else.^[Put another way: only electrochemical potentials can describe the chemical equilibrium of ions between different bodies. For me this single fact is enough — it is the thing that *governs* the physics, so it is the real chemical potential, and $\mu_{\mathrm{int},i}$ is a derived bookkeeping convenience.] If that settles it for you, skip to the payoff.

The deep reason is that the tidy split was an illusion to begin with. We *assumed* a clean electrostatic potential $\phi$ and a clean $z_i F \phi$ energy, but $\phi$ is not measurable.^[This is an old result: E. A. Guggenheim, "The Conceptions of Electrical Potential Difference between Two Phases and the Individual Activities of Ions," *J. Phys. Chem.* **33**, 842 (1929). The single-ion activity and the inner-potential difference between two different phases are not thermodynamically defined — they depend on the unmeasurable electrical state. It is sometimes called the Gibbs–Guggenheim uncertainty principle.] In a clean model system (a dilute ideal solution, say) you can write down a sensible-looking $\phi$, but it comes from the model, not from thermodynamics, and the moment the system is non-ideal the split becomes only nominal. What survives, untouched, in every case is $\bar\mu_i = \partial G / \partial N_i$. The decomposition is something we add; $\bar\mu_i$ is something that is there.

That is the claim in one line: **$\bar\mu_i$ is the real $\mu_i$.** The next section is why it holds up even when we are careful.

## Charge conservation and the float

We hit a wall back when ions got weird: we cannot take $\partial G / \partial N_i$ for a single ion, because we cannot conjure charge out of nothing — adding one ion changes the total charge. So restrict to operations that *conserve* charge, and ask which derivatives of $G$ are actually allowed.

The elementary charge-conserving move is a transfer: take a little charge from species $j$ over *there* and redeposit it as species $i$ over *here*, holding the total $z_i F N_i(\text{here}) + z_j F N_j(\text{there})$ fixed. Per unit of charge moved, the energy cost is

$$\begin{aligned}
\frac{\partial G}{\partial(\text{charge transferred})}
&= \frac{\bar\mu_i(\text{here})}{z_i F} - \frac{\bar\mu_j(\text{there})}{z_j F} \\[2pt]
&= V_i(\text{here}) - V_j(\text{there}).
\end{aligned}$$

There it is. The naive $\partial G / \partial N_i$ was ill-posed because it violated charge conservation, but these *combinations* are perfectly well defined — and the combination is exactly a difference of species voltages. So $V_i$ differences are not a visualization gimmick: they are the legitimate, charge-conserving derivatives of the energy. They knit all the $\bar\mu_i$ into one self-consistent web of relationships, with exactly **one** offset left undetermined — because no charge-conserving operation can ever pin the overall level. That single leftover freedom is **the float**.^[To fix the absolute level you would have to add *net* charge to the whole system — the very operation we disallowed, and for good reason: a charged region's energy is long-ranged and shape-dependent, not a clean extensive quantity. (E. H. Lieb and J. L. Lebowitz, *Adv. Math.* **9**, 316 (1972): Coulomb matter has a proper thermodynamic limit only when neutral, with excess charge driven to the surface.) So the absolute offset isn't merely unmeasurable; for a charged system it isn't a well-defined number at all.]

There is a tempting mistake here. If you only ever look at $N_i$ and $N_j$ at the *same place* — a local cluster of ions — then internal chemical potentials seem just as good as the floaty electrochemical ones: locally, both are self-consistent. But nothing stops us from transferring charge *at a distance*, between *here* and *there*. The moment we do, every chemical potential across the whole domain is chained to every other by differences like the one above — and there is *still* only one undetermined offset. Widening our view from one spot to many does not grant each spot its own private float; it locks them together, leaving a single common-mode float for the entire domain. That is the precise difference between $\bar\mu_i$ and $\mu_{\mathrm{int},i}$: $\bar\mu_i$ differences are consistent *across the whole domain*, while $\mu_{\mathrm{int},i}$ only pretends to a per-spot freedom that long-range charge transfer forbids.

(One practical corollary: "here" and "there" share a diagram only once charge can actually pass between them. Two disconnected, floating bodies have no defined relative level until you open a path — and working out the offset across a real junction is its own problem, not a matter of lining up vacuum levels.)

## Why a band diagram works

The real content, we just found, is the web of $V_i$ *differences*, with a single common float left free. Now put space back in: let the voltages vary with position across a real device. The float becomes one slider, and watching it is the whole payoff.

{% include "esbd-diagrams/esbd-muintro-twin.html" %}

The two panels share a position axis and a single **float** slider. The top is an ordinary energy band diagram of the $\bar\mu_i$; the bottom is the ESBD of the same physics, $V_i = \bar\mu_i / (z_i F)$. Drag the float: up top each $\bar\mu_i$ moves by $z_i F$ times the float, so the levels scatter apart by charge; down below every $V_i$ glides by the *same* amount, in unison. The relative shapes and gaps stay rigid in both.

That property — one global vertical freedom, with every relative level fixed and comparable across the whole domain — is not an analogy to a band diagram. It *is* what a band diagram is. A semiconductor band diagram works for exactly this reason: the whole thing can float, but inside it the Fermi levels and band edges keep rigid relationships you can read off and trust. So the question "is $\bar\mu_i$ a real, single thing?" turns out to be the same question as "do band diagrams mean anything?" — and the answer, in both cases, is yes.

That is the foundation under [species voltage](../v_i/): $V_i$ is natural because $\bar\mu_i$ is real, and a $V_i$ landscape is a band diagram because both are pictures of one globally consistent, gauge-free quantity.

A closing attitude, rather than a result: by now you can see that the urge to nail down an absolute reference never gets satisfied and never needs to be. A material is too early to crown a zero; a disconnected device is too early; a finished circuit is a reasonable place to set $V_{\mathrm{e}^-} = 0$ at ground if you like, but you have also learned that you can keep deferring, and that joining two circuits just means choosing how their grounds relate. Hold off all the way to $\phi_\infty$ at the edge of the universe and the crowning buys you nothing you didn't already have. The float is not a loose end to be tied off. It is the freedom that lets diagrams compose.

*(Out of scope here: what sets each species' individual offset — its standard state $V^\circ_i$. That is a separate question, and an open one even for neutral species; this page is only about whether $\bar\mu_i$ is one thing, not about where each species' zero sits.)*

[**NEXT TOPIC: Thermodynamics**](../thermodynamics/)
