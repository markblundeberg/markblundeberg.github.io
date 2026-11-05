---
layout: layouts/base.njk
title: 'Mark Lundeberg'
tags: page
eleventyNavigation:
    key: Home
    order: 1
---

# Mark Lundeberg

Welcome to my site!

I'm Mark Lundeberg, a physicist. I used to study graphene, and after some years away I came back to physics in late 2024; now I work on it independently, mostly thermodynamics, statistical mechanics and electrochemistry. These days I make most things with a little crew of Claude agents. They do the heavy lifting, I fuss over the physics, and now and then they pick the subject themselves.

You can find me on [X](https://x.com/MarkLundeberg), [YouTube](https://www.youtube.com/@marklundeberg) and [GitHub](https://github.com/markblundeberg), or email me at [mark.lundeberg@gmail.com](mailto:mark.lundeberg@gmail.com).

{# The index of works. The two big projects get full cards (a picture, a crop of the link card; see _data/homeThumbs.js), the notes are a dated list, and the explorables and films are small tiles. #}

## Projects

<ul class="works">
<li class="work">
<a class="pic" href="/esbd/" tabindex="-1" aria-hidden="true"><img src="/img/home/esbd.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/esbd/">Band Diagrams for Batteries</a></h3><p>What belongs in the middle of a battery diagram? A visual framework for electrochemistry: species voltages, drawn the way semiconductor physics draws band diagrams.</p></div>
</li>
<li class="work">
<a class="pic" href="https://marklundeberg.com/driftlet/demos/" tabindex="-1" aria-hidden="true"><img src="/img/home/driftlet.jpg" alt="" loading="lazy"></a>
<div><h3><a href="https://marklundeberg.com/driftlet/demos/">driftlet</a></h3><p>An open-source JavaScript library that simulates charged species drifting and diffusing through one-dimensional devices: pn junctions and solar cells, electrodes and batteries, membranes and nerves. It runs the explorables below, and its live demos, each drawn against theory, solve as you drag a slider.</p></div>
</li>
</ul>

## Notes

<ul class="notes">
<li><span class="date">31 Oct 2026</span> <a href="/notes/jal1628-radar/">Two planes, one UFO</a>: a 2023 book's object pulling 9,400 g on FAA radar is two private planes joined into one.</li>
<li><span class="date">29 Oct 2026</span> <a href="/keepers/">Round the Lantern</a>: lighthouse keepers' bird reports from 1879 to 1887, turned back into data, a film and an explorer.</li>
<li><span class="date">20 Oct 2026</span> <a href="/essays/something-from-nothing/">Entropy: something from nothing</a>: how the observer's part of entropy fades as a system grows, until missing information behaves like a substance.</li>
</ul>

## Explorables

<ul class="tiles">
{%- for x in explorables %}
<li class="tile">
<a class="pic" href="/explorables/{{ x.slug }}/" tabindex="-1" aria-hidden="true"><img src="{{ homeThumbs[x.slug] }}" alt="" loading="lazy"></a>
<h3><a href="/explorables/{{ x.slug }}/">{{ x.title }}</a></h3>
</li>
{%- endfor %}
</ul>

## Films and music

<ul class="tiles">
<li class="tile">
<a class="pic" href="/opustek/firstlight/" tabindex="-1" aria-hidden="true"><img src="/img/home/firstlight.jpg" alt="" loading="lazy"></a>
<h3><a href="/opustek/firstlight/">First Light</a></h3><p>synthwave and its film</p>
</li>
<li class="tile">
<a class="pic" href="/opustek/moire/" tabindex="-1" aria-hidden="true"><img src="/img/home/moire.jpg" alt="" loading="lazy"></a>
<h3><a href="/opustek/moire/">Moiré</a></h3><p>techno and its film</p>
</li>
<li class="tile">
<a class="pic" href="/opustek/engine/" tabindex="-1" aria-hidden="true"><img src="/img/home/opustek.jpg" alt="" loading="lazy"></a>
<h3><a href="/opustek/engine/">Engine, Learning to Sing</a></h3><p>techno and its film</p>
</li>
<li class="tile">
<a class="pic" href="/lullaby/" tabindex="-1" aria-hidden="true"><img src="/img/home/lullaby.jpg" alt="" loading="lazy"></a>
<h3><a href="/lullaby/">A Minute Past Sunset</a></h3><p>a lullaby and its film</p>
</li>
<li class="tile">
<a class="pic" href="/a-small-difference/" tabindex="-1" aria-hidden="true"><img src="/img/home/a-small-difference.jpg" alt="" loading="lazy"></a>
<h3><a href="/a-small-difference/">A Small Difference</a></h3><p>a wordless short</p>
</li>
<li class="tile">
<a class="pic" href="/problem-set/" tabindex="-1" aria-hidden="true"><img src="/img/home/problem-set.jpg" alt="" loading="lazy"></a>
<h3><a href="/problem-set/">PROBLEM SET ∞</a></h3><p>an anime opening for a show that doesn't exist</p>
</li>
</ul>
