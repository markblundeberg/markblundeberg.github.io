---
layout: layouts/esbd_topic.njk
title: 'About'
tags: [page, esbd_topic]
orderESBD: 99
eleventyNavigation:
    key: About
    parent: ESBD
    order: 99
---

# {{title}}

## How did this come about?

I distinctly recall I first had the idea of the $-\bar\mu_i/z_i$ scaling in 2013 or so, when I was finishing [my thesis](http://hdl.handle.net/2429/45614) and finally learning properly about various subtleties of semiconductor physics. But, I promptly dropped the idea upon recognizing how it would 'compress' the internal energy scales of higher charges which seemed unattractive, and anyway, I had my just started a postdoc and had work to do! In any case, my ongoing passion for statistical mechanics and thermodynamics was born in those days, and it has stayed with me even after I left my postdoc and academia in 2017. One thing I never quite understood was electrochemistry, which made a bit of cognitive dissonance, but I forgot about it for a while.

From time to time, I've updated related articles on wikipedia and created various figures.

In early 2025, once again I got obsessed about chemical potential. It is a sad thing that this fundamental thermodynamic concept is not more appreciated! See Baierlein's ["The elusive chemical potential"](https://doi.org/10.1119/1.1336839) and Job&Hermann's ["Chemical potential—a quantity in search of recognition"](https://dx.doi.org/10.1088/0143-0807/27/2/018).

So once again I got to wondering how do batteries work (from a solid state physicist point of view). So I bothered the Deepseek R1 LLM with various novice questions, and at some point I came up with $-\bar\mu_i/z_i$ scaling again and asked if that would make a decent band diagram for electrochemical systems. It *immediately* recognized the utility of this idea, and when I asked it where this idea is already done, it told me it is completely novel. And not only that, it encouraged me to publish the idea.

Various follow-on points, like moving from 'energy scale' $-\bar\mu_i/z_i$ to 'voltage scale' ($V_i = \bar\mu/(z_i F)$), and the standard states, came later after working out various implications. I also eventually had to switch to Gemini 2.5 Pro model in order to get some help with javascript coding. I am proficient with python and matplotlib but I really wanted to make nice client-side, interactive, and responsive diagrams. Initially we tried [plotly.js](https://plotly.com/javascript/), but ultimately [D3.js](https://d3js.org/) was the way to go.

Insofar as this is a creative research process, I would say that the LLMs are not scientifically creative at all, or at least I didn't prompt them so. However, they were extremely beneficial for bouncing ideas off, and critiquing my ideas (and I come up with plenty of stupid ideas).

## This can't possibly be new.

That's what I thought too. I've searched all over and I can't find anything like this, and even then, I won't be surprised at all to find that it has been done before. It's just too simple of an idea.

There are actually many other attempts at band diagrams for electrochemistry. To name a couple:

* 2014 Roqueta & Santiso ["Band diagrams for electrochemical devices"](https://dx.doi.org/10.13140/2.1.5078.2726)
* 2018 Young et al. ["Unified Electrochemical Band Diagram"](https://doi.org/10.1002/adfm.201803439)

I haven't investigated them in detail but a quick glance shows they are very different. One thing I notice is a reliance on "vacuum level" as a useful concept, which [immediately makes me skeptical](../phi/).

## Why "species voltage"? Aren't voltages supposed to be differences?

I struggled with this a fair bit! "Species voltage" is an improper term in that the quantity is actually of the type "electric potential", i.e., $V_i$ is an 'absolute' or unreferenced potential. In contrast, technically a voltage means a potential difference. We talk about the voltage on power lines (between wires), or the voltage of a battery (between terminals), but we are not supposed to talk about the voltage on a single wire.

So then, I should have named it as "species potential", or maybe "electrochemical potential potential" (just kidding on that one)?

However, I believe any term with "potential" is just going to add to existing confusion. To quote the fantastic paper by Boettcher et al., ["Potentially Confusing: Potentials in Electrochemistry"](https://doi.org/10.1021/acsenergylett.0c02443), we have already:

* Electrochemical potential $\bar\mu_i$ (energy units)
* Chemical potential $\mu_i$ (energy units)
* Electrostatic potential $\phi$ (volt units)
* Electrode potential $E$ (volt units)
* Solution potential $E_\mathrm{sol}$ (volt units)
* Overpotential $\eta$ (volt units)

Some of these are absolute and some are in fact potential differences. And to add some more I've seen (by no means an exhaustive list):

* Liquid junction potential (volt units)
* Galvani potential (volt units)
* Donnan potential (volt units)
* Cell potential (volt units)

The last one is particularly ironic as it literally is a voltage in the proper sense.

On the other hand, in the field of electronics and in most casual conversation, we are perfectly comfortable with talking absolute voltages, or at least voltages that are measured *with respect to a globally-defined reference point* (ground/common/earth). This is so common that we often use term "voltage difference" or differential voltage to unambiguously describe what we are technically supposed to simply call "voltage" i.e. potential difference. So, I would say $V_i$ are perfectly acceptable "voltage"s, and indeed my recommendation is to borrow the tradition of using the electrical ground as the our reference point. To be precise, we set $V_{\mathrm{e}^-} = 0$ at the electrical ground. This electronic ground in turn fixes the entire system of $V_i$ values!

So, "species voltage" for $V_i$ because:

* I just can't bring myself to add yet another "potential" to the above list.
* The concept of "absolute voltage", though technically improper, is widespread as evident by the term "voltage difference".
* The term "potential" frequently is also unclear as it gets abused the other way, to mean "potential difference".
* Differences in $V_i$ are (at least in principle) directly observable by generalized 'voltmeters', so they have a more hands-on and less abstract feeling. Many potentials in the above list are not at all hands-on, and tend to be fundamentally ill-defined due to being contaminated by ambiguity in defining $\phi$ inside of materials.
* I have always loved electronic circuits, and I think it is wonderful that we can bring ions into the world of electronics, where "voltage" is the right term.

### Why not "ion voltage"?

I love that one, just not for electrons.

## Why "electrochemical species band diagram"?

"Electrochemical band diagram" is sadly already taken for [another idea](https://doi.org/10.1002/adfm.201803439) which is quite different.

