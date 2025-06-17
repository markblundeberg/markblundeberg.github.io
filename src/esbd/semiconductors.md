---
layout: layouts/esbd_topic.njk
title: 'Semiconductors'
tags: [page, esbd_topic]
orderESBD: 22
eleventyNavigation:
    key: Semiconductors
    parent: ESBD
    order: 22
---

# {{title}}

Now that we've investigated our generalized electron/ion band diagrams in full, it's worth looking at how the good old semiconductors would look if treated the same way.

Themes:

- The $V_i$ diagrams are just flipped upside down compared to the usual electron energy band diagram.
- Electrons and holes act like anions and cations, respectively.
- Dopants are immobile ions that shift the balance of charge neutrality.
- Band edges are reference states like $V^\circ_i$, though they do not correspond to the same reference carrier density.

## Electron-holes as positive ions

Electrons at top of valence band move backwards. Specifically they have negative mass. See Kittel, summarized well on {% wiki "Electron hole" %}.

Formally treating VB holes as cations and CB electrons as anions.

Carrier density exponential in Ve only if we separate Vh as distinct species.

Ve = Vh. Except out of equilibrium.

## Dopants: stationary ions

- influence on charge neutrality

analogy - solid state electrolyte.  / fast ion conductors / YSZ

## Band edges vs standard states

MOVED FROM SOLUTIONS.MD - NEED REWORK

Conceptually, these standard state lines function much like conduction and valence band edges ($E_\mathrm{C}$, $E_\mathrm{V}$) do in semiconductor physics – they act as reference energy/potential levels. The actual potential ($V_i$) deviates from the reference $V^\circ_i$ based on the concentration, just as the Fermi level ($E_\mathrm{F}$) deviates from the band edges based on carrier concentration.

Actually, as we have alluded to before, and we will talk about in much more depth in the Semiconductors topic, we can cram semiconductors into our electrochemical $V_i$ framework too! For silicon we find that $V^\circ_\mathrm{h^+} - V^\circ_\mathrm{e^-} = 1.27~\mathrm{V}$ (for a 1 mol/L reference concentration). I.e. the 'standard state ladder' for a semiconductor really only has two entries, one for conduction band electrons ($\mathrm{e^-}$), and the other for valence band holes ($\mathrm{h^+}$). The reason this 1.27 V value differs from the bandgap of silicon ($E_\mathrm{C} - E_\mathrm{V} = 1.1~\mathrm{eV}$) is simply that the band edges each correspond to less than a 1 mol/L concentration, so, $V^\circ_\mathrm{h^+}$ sits slightly higher than $-E_\mathrm{V}/e$ and $V^\circ_\mathrm{e^-}$ sits slightly lower than $-E_\mathrm{C}/e$.

## Mass action law

MOVED FROM SOLUTIONS.MD - NEED REWORK

The above example of salt solubility is also similar to the semiconductor {% wiki "Mass_action_law_(electronics)", "law of mass action" %}; in a semiconductor, $c_{\mathrm{e^-}} c_{\mathrm{h^+}} = (c_\mathrm{i})^2$ for some value $c_\mathrm{i}$, and donor dopants (such as phosphorus $\mathrm{P^+}$) and acceptor dopants (such as boron $\mathrm{B^-}$) play the same role as above in terms of shifting the balance of concentration. The big difference is that $V_\mathrm{h^+} - V_\mathrm{e^-} = 0$ in the semiconductor, instead of maintaining a fixed separation like we saw with a saturated salt..

- $N_A$ and $N_D$.


## Electrons and ions compared

- Fermi-Dirac distribution vs simple ideal-dilute distribution. FD as simply another form of nonideality. Also see {%wiki "Langmuir adsorption model" %} ~ FD. Also mention actual electron/hole nonideality (strongly doped).

- Zero of energy for ions (conventionally varies) vs electrons (defined specifically)

- What semiconductorists can learn from chemists
   - Materials without good band structure (liquid or disordered)
   - 

## Takeaways


[**NEXT TOPIC: Redox**](../redox/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>
#}
