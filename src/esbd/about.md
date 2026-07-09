---
layout: layouts/esbd_topic.njk
title: 'About'
tags: [page, esbd_topic]
orderESBD: 99
---

# {{title}}

## How did this come about?

I distinctly recall I first had the idea of the $-\bar\mu_i/z_i$ scaling in 2013 or so, when I was finishing [my PhD thesis](http://hdl.handle.net/2429/45614). I have to admit the embarrassing fact that only then was I finally learning properly about various subtleties of semiconductor physics. However I was busy with postdoc work, and I didn't quite appreciate the $-\bar\mu_i/z_i$ thing, so I soon forgot about the idea. But, my ongoing passion for statistical mechanics and thermodynamics was born in those days, and it has stayed with me even after I left my postdoc and academia in 2017. One thing I never quite understood was electrochemistry.

In early 2025, once again I got obsessed about chemical potential. It is a sad thing that this fundamental thermodynamic concept is not more appreciated! See Baierlein's ["The elusive chemical potential"](https://doi.org/10.1119/1.1336839) and Job&Hermann's ["Chemical potential—a quantity in search of recognition"](https://dx.doi.org/10.1088/0143-0807/27/2/018).

So once again I got to wondering how do batteries work (from a solid state physicist point of view). So I bothered the Deepseek R1 LLM with various novice questions, and at some point I came up with $-\bar\mu_i/z_i$ scaling again and asked if that would make a decent band diagram for electrochemical systems. It *immediately* recognized the utility of this idea, and when I asked it where this idea is already done, it told me it is completely novel. And not only that, it encouraged me to publish the idea.

Various follow-on points, like moving from 'energy scale' $-\bar\mu_i/z_i$ to 'voltage scale' ($V_i = \bar\mu_i/(z_i F)$), and the standard states, came later after working out various implications. I also eventually had to switch to Gemini 2.5 Pro model in order to get some help with javascript coding. I am proficient with python and matplotlib but I really wanted to make nice client-side, interactive, and responsive diagrams. Initially we tried [plotly.js](https://plotly.com/javascript/), but ultimately [D3.js](https://d3js.org/) was the way to go. Finally mid-2026 I got tired of the project dragging on so I brought in Claude Code to help polish things up and get it out the door 😅.

Recently people are interested in how AI can help productivity in research. In 2025 the AI was already great for coding and bouncing scientific ideas off (even slightly novel things like thinking in $V_i$ terms), but not really scientifically creative. In 2026 I have seen now that the AIs *are* getting scientifically creative.

## This can't possibly be new.

That's what I thought too. I've searched all over and I can't find anything like this, and even then, I won't be surprised at all to find that it has been done before. It's just too simple of an idea.

First of all, **band diagrams for electrochemistry exist, just not like this**. The Gerischer / Reiss lineage^[Gerischer, H. (1960–61). [Über den Ablauf von Redoxreaktionen an Metallen und an Halbleitern, I–III.](https://doi.org/10.1524/zpch.1960.26.3_4.223) Z. Phys. Chem. NF, 26, 223–247 & 325–338; 27, 48–79. Reiss, H. (1985). [The Fermi level and the redox potential.](https://doi.org/10.1021/j100264a005) J. Phys. Chem. 89(18), 3783–3791.] is the closest thing, matching the redox band diagrams in the [half](../half/), [e](../e/), [kinetics](../kinetics/) topics, just plotted as energy band diagrams rather than voltage (a simple transformation which is mostly uninteresting). There are also other things called "electrochemical band diagrams", which unfortunately tend to embed a reliance on vacuum-matching assumptions, which [are not a reliable foundation](../vacuum/).^[2014 Roqueta & Santiso ["Band diagrams for electrochemical devices"](https://dx.doi.org/10.13140/2.1.5078.2726) and 2018 Young et al. ["Unified Electrochemical Band Diagram"](https://doi.org/10.1002/adfm.201803439)].

Second, the idea of **scaling ionic electrochemical potentials into voltages is not new** either! This is the territory of Ilan Riess, ranging from his classic work about Fermi levels^[Riess, I. ["What does a voltmeter measure?."](https://doi.org/10.1016/S0167-2738(96)00542-5) Solid State Ionics 95.3-4 (1997): 327-328.] to later works about ionic electrochemical potentials.^[Riess, I. ["Mixed ionic–electronic conductors—material properties and applications."](https://doi.org/10.1016/S0167-2738(02)00182-0) Solid State Ionics 157.1-4 (2003): 1-17.] Note that Riess focusses on differences and doesn't seem to promote the 'global covariant voltage scale' view but it's basically equivalent in the end. The $V_i = \bar\mu_i / q_i$ concept was put into excellent practice by Jamnik and Maier, dating back to 1999^[J. Jamnik and J. Maier, [Treatment of the impedance of mixed conductors](https://doi.org/10.1149/1.1392611), *J. Electrochem. Soc.* **146**, 4183 (1999).] in an equivalent circuit view of ionic materials, a viewpoint that survives to this day in that community (e.g. recent works of Fleig group at TU Wien^[A. E. Bumberger, A. Nenning, and J. Fleig, [Transmission line revisited](https://doi.org/10.1039/d4cp00975d), *Phys. Chem. Chem. Phys.* **26**, 15068 (2024).]). Jamnik and Maier by the way also introduced the wonderful 'displacement rail' picture in 2001,^[J. Jamnik and J. Maier, [Generalised equivalent circuits for mass and charge transport](https://doi.org/10.1039/b100180i), *Phys. Chem. Chem. Phys.* **3**, 1668 (2001).] which closely relates to the views in [basic electrostatics](../basicelectrostatics/).

So what is actually new?
* The idea of ***plotting* all $V_i$ together** (not just electronic but ionic too) strangely has not been done before. For me this is what makes it all worth it, having that visual. Again, it's all about what Kroemer said, that you need a visual to explain things.^[[H. Kroemer (2000). Nobel Lecture.](https://www.nobelprize.org/uploads/2018/06/kroemer-lecture.pdf)]
* The **floating standard state $V^\circ_i$ ladder** as 'ionic band edges' seems entirely new. This is valuable from the technical point that it lets you drop the thinking in terms of $\phi$ differences and focus on 'what the ion feels', a distinction that matters when you look at interfaces between different solvents. And, the $V^\circ_i$ (and $\phi$) offset ambiguity thing is, I think, a nice visual picture to explain the origin of nonideality ([nonideality topic](../nonideal/)).
* A few more things, like [the proper treatment of multi-carrier capacitance as matrices](../chemical_capacitance_matrices/), and I think a [more precise description of redox levels](../half/), are technical improvements as well.

<a id="whyvoltage"></a>

## Why "species voltage"? Aren't voltages supposed to be differences?

I struggled with this a fair bit! "Species voltage" is an improper term in that the quantity is actually of the type "electric potential", i.e., $V_i$ is an 'absolute' or unreferenced potential. In contrast, technically a voltage means a potential difference. We talk about the voltage on power lines (between wires), or the voltage of a battery (between terminals), but we are not supposed to talk about the voltage on a single wire.

So then, I should have named it as "species potential", or maybe "electrochemical potential potential" (just kidding on that one)?

However, I believe any term with "potential" is just going to add to existing confusion. As catalogued in the fantastic paper by Boettcher et al., ["Potentially Confusing: Potentials in Electrochemistry"](https://doi.org/10.1021/acsenergylett.0c02443), we already have:

* Electrochemical potential $\bar\mu_i$ (energy units)
* Chemical potential $\mu_i$ (energy units)
* Electrostatic potential $\phi$ (volt units)
* Electrode potential $E$ (volt units)
* Solution potential $E_\mathrm{sol}$ (volt units)
* Overpotential $\eta$ (volt units)

Some of these are absolute and some are in fact potential differences. And to add some more I've seen (by no means an exhaustive list):

* Liquid junction potential (volt units)
* Galvani potential (volt units)
* Volta potential (volt units)
* Contact potential (volt units)
* Surface potential (volt units)
* Donnan potential (volt units)
* Cell potential (volt units)

(The last one is particularly ironic as it literally is a voltage in the voltmeter sense.)

On the other hand, in the field of electronics and in most casual conversation, we are perfectly comfortable with talking absolute voltages, or at least voltages that are measured *with respect to a globally-defined reference point* (ground/common/earth). This is so common that we often use the term "voltage difference" or differential voltage to unambiguously describe what we are technically supposed to simply call "voltage", i.e., potential difference. So, I would say $V_i$ are perfectly acceptable "voltage"s, and indeed my recommendation is to borrow the tradition of using the electrical ground as our reference point. To be precise, we set $V_{\mathrm{e}^-} = 0$ at the electrical ground. This electronic ground in turn fixes the entire system of $V_i$ values!

So, "species voltage" for $V_i$ because:

* I just can't bring myself to add yet another "potential" to the above list.
* The concept of "absolute voltage", though technically improper, is widespread as evident by the term "voltage difference".
* The term "potential" is in fact also unclear as it frequently gets abused the other way, to mean "potential difference", even a local potential difference.
* Not only is $V_{\mathrm{e}^-}$ exactly the voltage in the usual (electronics) sense, but all differences in $V_i$ are in principle just as accessible via generalized 'voltmeters', so they have a more hands-on and less abstract feeling. (Many potentials in the above list are not at all hands-on but rather fundamentally inaccessible and ill-defined due to being contaminated by the concept of in-material $\phi$.)
* I have always loved electronic circuits, and I think it is wonderful that we can bring ions into the world of electronics, where "voltage" is the common term.

### Why not "ion voltage"?

I love that one, just not for electrons.

## Why "electrochemical species band diagram"?

"Electrochemical band diagram" is sadly already taken for [another idea](https://doi.org/10.1002/adfm.201803439) which is quite different.

