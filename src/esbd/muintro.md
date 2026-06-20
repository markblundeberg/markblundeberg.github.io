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

## What binds it all together

We have been cavalier about a charged body's free energy, so let us be careful, because the care is where the insight is.

Here is the awkward fact: the energy of a charged body is not really a well-defined, local quantity. Electrostatic energy is long-ranged; a region carrying net charge stores field energy that reaches out into its surroundings and depends on the shape and the boundary, not just on what is inside. This is not hand-waving — it is the content of a hard theorem. Charged matter only has a clean, extensive (size-independent) free energy when it is charge neutral; with a net charge the free-energy density becomes shape-dependent, and the system relieves the strain by pushing the excess charge out to its boundary.^[E. H. Lieb and J. L. Lebowitz, "The Constitution of Matter: Existence of Thermodynamics for Systems Composed of Electrons and Nuclei," *Adv. Math.* **9**, 316 (1972). They prove the thermodynamic limit exists for Coulomb matter only in the neutral case, with excess charge expelled to the surface — which is exactly the toy picture of dropping one ion into a blob of saltwater and finding its charge reappear, delocalized, on the skin.] So one might conclude that we are required to work with neutral systems.

That is *almost* the right lesson, and it is worth getting exactly right, because the usual mistake is to apply it too locally. If you insist on charge neutrality *locally* — every little region its own balanced world — then the regions decouple from one another. Each acquires its own free electrostatic offset, which is precisely the "$\mu_{\mathrm{int}}$ is just as good" illusion of the previous section, and worse, you have thrown away any ability to compare or equilibrate one region against another.

The fix is to notice what the self-consistency actually requires. It is not neutrality. It is **closure**: that we are considering charge moving *within* a domain, conserved inside it. A domain can carry a net charge and the relative picture is unchanged — the net charge simply sits on the boundary and feeds into the one *absolute* offset, which we were never going to pin down anyway (and which, for a net charge, is the genuinely shape-dependent quantity from the theorem above). The relative landscape of $\bar\mu_i$ across the domain needs only that charge be free to shuttle around inside.

So the recipe is: grow the domain until whatever transfer you care about is internal to it. To equilibrate body $A$ with body $B$, you must consider them inside one domain where charge can pass between them — which is the same as saying **$A$ and $B$ live on one band diagram.** Grow it as the question demands: from species against species, to a material, to a device, to a whole circuit, and in principle to the universe. Within whatever domain you have drawn, the $\bar\mu_i$ form a single self-consistent system with one overall float, and no external reference is needed at all.

> A caution on what "joining" does and does not buy you. Setting two unconnected, floating devices side by side on a table does *not* align their diagrams. Their relative offset is whatever stray charge their histories happened to leave — genuinely undetermined by anything you cared to measure. You fix the offset only by *providing a path*, so that some species can equilibrate across the junction. And even then, working out the offset where two materials meet is the hard interface problem; it is emphatically not the trick of lining up vacuum levels, which is a notorious misconception. Snapping two diagrams together means solving the junction — when there is a junction.

It is worth naming the two ways people go wrong, because they are opposite errors about the same single degree of freedom. The chemist's error is to fix neutrality too locally, which *multiplies* the one global offset into a private offset per region ("$\mu_{\mathrm{int}}$ is fine"). The physicist's error is to *crown* the offset — to insist on an absolute zero, a vacuum level at infinity — which is unmeasurable and, for a net-charged system, not even shape-independent. Both miscount the freedom. The truth is that there is exactly one, global, and best left uncrowned: **differences in $\bar\mu_i$ are consistent across the whole domain, while differences in $\mu_{\mathrm{int},i}$ are consistent only locally.**

<figure class="diagram-placeholder">
{% figcaption %}
A growing neutral-aware domain: a small region expands to enclose two separate bodies $A$ and $B$; once charge can shuttle between them, they snap onto one shared band diagram with a single overall float. (Planned figure.)
{% endfigcaption %}
</figure>

There is one more layer of subtlety, which I will leave as a footnote so as not to derail the main point.^[Even "the electron at rest has energy $-e\phi$" is a convention. Thermodynamics hands us only the $\bar\mu_i$ and never needs $\phi$ at all; the electrostatic potential is a separate object with its own additive freedom. The statement that a free charge in vacuum has energy $-e\phi$ is the bridge we *impose* between the two, and a priori the thermodynamic level and the electrostatic gauge could differ by a global offset. So there are arguably two gauge freedoms we habitually weld into one.]

## Why a band diagram works

Now the payoff, and it is the reason all of this was worth the trouble.

If $\bar\mu_i$ is one indivisible quantity carrying a single global float, then defining a per-species voltage by dividing out the charge,

$$ V_i = \frac{\bar\mu_i}{z_i F}, $$

inherits that structure exactly: every $V_i$, for every species, shares the one float and so they all slide *together*.

{% include "esbd-diagrams/mu-V-unison-shift.html" %}

That property — one global vertical freedom, with every relative level fixed and comparable across the whole domain — is not an analogy to a band diagram. It *is* what a band diagram is. A semiconductor band diagram works for exactly this reason: the whole thing can float, but inside it the Fermi levels and band edges keep rigid relationships you can read off and trust. So the question "is $\bar\mu_i$ a real, single thing?" turns out to be the same question as "do band diagrams mean anything?" — and the answer, in both cases, is yes.

That is the foundation under [species voltage](../v_i/): $V_i$ is natural because $\bar\mu_i$ is real, and a $V_i$ landscape is a band diagram because both are pictures of one globally consistent, gauge-free quantity.

A closing attitude, rather than a result: by now you can see that the urge to nail down an absolute reference never gets satisfied and never needs to be. A material is too early to crown a zero; a disconnected device is too early; a finished circuit is a reasonable place to set $V_{\mathrm{e}^-} = 0$ at ground if you like, but you have also learned that you can keep deferring, and that joining two circuits just means choosing how their grounds relate. Hold off all the way to $\phi_\infty$ at the edge of the universe and the crowning buys you nothing you didn't already have. The float is not a loose end to be tied off. It is the freedom that lets diagrams compose.

*(Out of scope here: what sets each species' individual offset — its standard state $V^\circ_i$. That is a separate question, and an open one even for neutral species; this page is only about whether $\bar\mu_i$ is one thing, not about where each species' zero sits.)*

[**NEXT TOPIC: Thermodynamics**](../thermodynamics/)
