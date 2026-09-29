---
layout: layouts/base.njk
title: 'Explorables'
description: 'Standalone interactive pieces on electrochemistry and thermodynamics.'
tags: page
---

# Explorables

Standalone interactive pieces: shorter than [the book](/esbd/), and meant to be played with.

{% for x in explorables %}
- [**{{ x.title }}**](/explorables/{{ x.slug }}/): {{ x.description }}
{% endfor %}
