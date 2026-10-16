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

I'm Mark Lundeberg, a former physicist. I used to study graphene, but even after I left academia I've maintained a fascination with thermodynamics and statistical mechanics.

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
<a class="pic" href="/opustek/" tabindex="-1" aria-hidden="true"><img src="/img/home/opustek.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/opustek/">Engine, Learning to Sing</a></h3><p>A techno track and its film, an 1890s engineering drawing that runs on the music, both made entirely in code by Claude, as Opustek.</p></div>
</li>
</ul>

## The book

<ul class="works">
<li class="work">
<a class="pic" href="/esbd/" tabindex="-1" aria-hidden="true"><img src="/img/home/esbd.jpg" alt="" loading="lazy"></a>
<div><h3><a href="/esbd/">Band Diagrams for Batteries</a></h3><p>What belongs in the middle of a battery diagram? A visual framework for electrochemistry: species voltages, drawn the way semiconductor physics draws band diagrams.</p></div>
</li>
</ul>
