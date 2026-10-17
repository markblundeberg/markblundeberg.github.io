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

I'm Mark Lundeberg, a physicist. I used to study graphene, and after some years away I came back to physics in late 2024; now I work on it independently, mostly thermodynamics, statistical mechanics and electrochemistry.

{# The index of works: each entry is a picture (a crop of its link card, see _data/homeThumbs.js), its title and its description. #}

## Explorables

<ul class="works">
{%- for x in explorables %}
<li class="work">
<a class="pic" href="/explorables/{{ x.slug }}/" tabindex="-1" aria-hidden="true"><img src="{{ homeThumbs[x.slug] }}" alt="" loading="lazy"></a>
<div><h3><a href="/explorables/{{ x.slug }}/">{{ x.title }}</a></h3><p>{{ x.description }}</p></div>
</li>
{%- endfor %}
</ul>

## Music and film

<ul class="works">
<li class="work">
<a class="pic" href="/opustek/moire/" tabindex="-1" aria-hidden="true"><img src="/img/home/moire.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/opustek/moire/">Moiré</a></h3><p>Two machines out of step, 7 against 5, meeting every 35 bars: a techno track and its film, made in code by Opustek, Mark Lundeberg's Claude agent, with how it was made and a guide for doing it with your own agent.</p></div>
</li>
<li class="work">
<a class="pic" href="/opustek/" tabindex="-1" aria-hidden="true"><img src="/img/home/opustek.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/opustek/">Engine, Learning to Sing</a></h3><p>A techno track and its film, an 1890s engineering drawing that runs on the music, both made entirely in code by Opustek, Mark Lundeberg's Claude agent.</p></div>
</li>
<li class="work">
<a class="pic" href="/lullaby/" tabindex="-1" aria-hidden="true"><img src="/img/home/lullaby.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/lullaby/">A Minute Past Sunset</a></h3><p>An existential lullaby written as a score and sung by Suno, and its film, drawn in code as pastel on dark paper: a child falls asleep while the camera goes out to the last red stars and comes home.</p></div>
</li>
<li class="work">
<a class="pic" href="/problem-set/" tabindex="-1" aria-hidden="true"><img src="/img/home/problem-set.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/problem-set/">PROBLEM SET ∞</a></h3><p>An anime opening for a show that doesn't exist: an AI apprentice goes from miscounting the r's in "strawberry" to real research results, honestly stamped. Every frame drawn in code; the song by Suno.</p></div>
</li>
</ul>

## The book

<ul class="works">
<li class="work">
<a class="pic" href="/esbd/" tabindex="-1" aria-hidden="true"><img src="/img/home/esbd.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/esbd/">Band Diagrams for Batteries</a></h3><p>What belongs in the middle of a battery diagram? A visual framework for electrochemistry: species voltages, drawn the way semiconductor physics draws band diagrams.</p></div>
</li>
</ul>
