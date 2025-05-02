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

I haven't investigated them in detail but a quick glance shows they are very different. One thing I notice is a reliance on "vacuum level" as a useful concept, which [immediately makes me skeptical](../vacuum/).

## Why "species voltage"?

I strugged with this a fair bit. The main problem is that $V_i = \bar\mu_i/(z_i F)$ is an 'absolute' or unreferenced potential, whereas technically a voltage should be a potential difference. So then, I should have named it as "species potential", or maybe "electrochemical potential potential" (just kidding on that one).

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
* Cell potential (volt units) -- this one is literally voltmeter voltage!

So, "species voltage" for $V_i$ because:

* I just can't bring myself to add yet another "potential" to the above list.
* The concept of "absolute voltage" though technically improper, is widespread as can be seen by the frequent use of the term "voltage difference".
* Differences in $V_i$ are (at least in principle) directly observable by generalized 'voltmeters', so they have a more hands-on and less abstract feeling.
* I have always loved electronic circuits. I like the idea of putting electronics and ionics on the same playing field, just perturbed with the idea that 'each charged species rides a slightly different voltage'.

### Why not "ion voltage"?

I love that one, just not for electrons.

## Why "electrochemical species band diagram"?

"Electrochemical band diagram" is sadly already taken for [another idea](https://doi.org/10.1002/adfm.201803439) which is quite different.

