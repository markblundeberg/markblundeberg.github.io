---
layout: layouts/esbd_topic.njk
title: 'Offsets galore'
tags: [page, esbd_topic]
orderESBD: 80.5
---

# {{title}}

Every time you draw an ESBD you are forced, somewhere, to fix a zero. The [previous topic](../muintro/) established the one that genuinely matters — the global float, the single overall level the whole diagram is free to slide. But that is not the only arbitrary choice lurking in the framework. There are standard-state conventions, single-ion activity conventions, and the unmeasurable inner potential $\phi$ of every phase. It is easy to lose track of which of these actually move something and which are pure bookkeeping.

So here is a sandbox. Two solutions sit side by side — an aqueous acid and a lithium electrolyte, each with an electrode — and every arbitrary choice in the picture is wired to its own slider. Drag them and watch what moves.

{% include "esbd-diagrams/esbd-offsets-galore.njk" %}

Give yourself a minute with it before reading on. The sliders fall into two completely different kinds, and telling them apart is the whole point.

## Knobs that move the levels

Two of the sliders shift the physical $\bar\mu_i$, so the rails — the $V_i$ lines — genuinely move.

The **global float** is the one from the [last topic](../muintro/): it shifts every $\bar\mu_i$ by $z_i F$ times the same amount, so every line in both solutions, electrons included, slides together. It is the real gauge freedom of the diagram.

The **element references** — one slider each for the arbitrary zero of hydrogen, oxygen, and lithium — shift a species by its atom count. Drag the hydrogen slider and $V_{\mathrm{H}^+}$ rises while $V_{\mathrm{OH}^-}$ falls (opposite charges), and any oxygen- or lithium-bearing rail answers to its own slider. Because both solutions here are aqueous, the hydrogen and oxygen sliders move rails in *both* of them at once — an element's reference is global, not a property of a single phase (lithium moves only solution 2 because that is the only place lithium lives). These are the answer to the question the last topic set aside, *what sets each species' standard offset*: each conserved element carries one arbitrary constant.

Notice what the element sliders leave alone — the electron levels $V_{\mathrm{e}^-}$. An electron carries no hydrogen, oxygen, or lithium, so its rail does not move, and neither does a redox level $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$, because a half-reaction conserves its elements (the references cancel between the two sides of $\mathrm{H}^+ + \mathrm{e}^- \rightleftharpoons \tfrac{1}{2}\mathrm{H}_2$). So of all the sliders, only the global float moves an electron level. That is exactly why a cell voltage — a difference of two $V_{\mathrm{e}^-}$ — is so robust.

## Knobs that move only labels

The other four sliders — an activity convention and a $\phi$ choice for each solution — never move a single $V_i$ rail. They cannot, because all they do is re-apportion a fixed $\bar\mu_i$ among its conventional parts:

$$ \bar\mu_i = \underbrace{\left[\, z_i F \phi + \mu^\circ_{\mathrm{int},i} \,\right]}_{=\; z_i F V^\circ_i} + \big[\, RT \ln a_i \,\big]. $$

The **activity convention** trades the standard-state term against the activity term. It moves the $V^\circ_i$ lines, and because it holds $\mu^\circ_{\mathrm{int},i}$ fixed it drags $\phi$ along with them — but $V_i$ itself does not budge. The **$\phi$ choice** moves $\phi$ alone, dumping the change into $\mu^\circ_{\mathrm{int},i}$ and leaving $V^\circ_i$ where it was.

So the two stack rather than coincide, and the drawn quantities end up in a small hierarchy of how convention-laden they are:

- $V_i$, the rail, is moved by neither convention. Bedrock.
- $V^\circ_i$, the standard-state line, moves with the activity convention but not the $\phi$ choice.
- $\phi$, the inner-potential line, moves with both.

The inner potential is the most arbitrary thing on the diagram; the rail is the least.

## What survives all of it

You have six live sliders, and only two of them — the float and the element references — move a $V_i$ rail at all, and only one, the float, moves an electron level. But here is the part worth sitting with: every quantity you could actually *measure* is untouched by all six. A cell voltage is a difference of electron levels, so the element sliders cancel and the float cancels. Any real equilibrium, or the difference of one species' $V_i$ between the two solutions, conserves charge and elements, so every gauge cancels there too. Six arbitrary knobs, two of which visibly move the rails, and not one of them changes a number you could read off an instrument.

That is the honest status of an ESBD. The diagram is not convention-free; you did have to fix some zeros to draw it. But the *content* — the gaps, the differences, the things a voltmeter or an equilibrium responds to — is.

## The seventh knob, bolted shut

There is one more convention, so well established it never gets a slider. The electron could carry its own arbitrary reference, just like the elements do, but for conductors that choice merges into the global float, so it never appears as an independent freedom. The one place it *would* show its face is as a redefinition of every work function — it tunes the vacuum level $\phi_{\mathrm{vac}}$ against the electron level $V_{\mathrm{e}^-}$. We weld it shut with the universal convention that an electron at rest in vacuum has energy $-e\phi_{\mathrm{vac}}$. The sole experiment that would notice if we ever changed it is thermionic emission — Richardson's law is quietly built on exactly that convention. It is real, it touches precisely one phenomenon, and nobody ever varies it, so it does not get a knob.

[**NEXT TOPIC: Non-ideal solutions**](../nonideal/)
