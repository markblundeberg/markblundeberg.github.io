---
layout: layouts/esbd_topic.njk
title: 'Traditional electrochemistry, translated'
tags: [page, esbd_topic]
orderESBD: 94
---

# {{title}}

If you arrive already fluent in electrochemistry, here is a Rosetta Stone: the familiar symbols and equations on the left, their species-voltage readings on the right. None of it is new physics — it is the same quantities re-expressed on one shared voltage axis (see [what this is and isn't](../about/)). Each entry points to the topic where the translation is worked out.

## Potentials and levels

| Traditional | In $V_i$ terms |
| --- | --- |
| electrochemical potential $\bar\mu_i$ | $z_i F\,V_i$ |
| Fermi level $E_{\mathrm{F}}$ ($=\bar\mu_{\mathrm{e}^-}$) | $-e\,V_{\mathrm{e}^-}$ |
| (Galvani / inner) potential $\phi$ | an unmeasurable stand-in for the $V^\circ_i$ ladder ([the case against $\phi$](../phi/)) |
| electrode potential $E$ (vs SHE) | $V_{\mathrm{e}^-}(\text{electrode}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ ([electrode potential](../e/)) |
| standard electrode potential $E^\circ$ | $V^\circ_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ ([half-reactions](../half/)) |
| redox (solution) potential $E_h$ | $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red}) - V^\circ_{\mathrm{e}^-}(\mathrm{SHE})$ |
| overpotential $\eta$ | a drop in $V_{\mathrm{e}^-}$: $V_{\mathrm{e}^-}(\text{electrode}) - V_{\mathrm{e}^-}(\mathrm{eq})$ |
| cell voltage / EMF | $V_{\mathrm{e}^-}(\text{right}) - V_{\mathrm{e}^-}(\text{left})$ ([reference electrodes & cells](../references/)) |
| liquid junction potential | a step in the $V^\circ_{\mathrm{e}^-}$ ladder across the junction |

## Concentrations and the Nernst equation

| Traditional | In $V_i$ terms |
| --- | --- |
| activity $a_i$ | defined by $V_i = V^\circ_i + \tfrac{RT}{z_i F}\ln a_i$ ([solutions](../solutions/)) |
| standard internal chemical potential $\mu^\circ_{\mathrm{int},i}$ | $z_i F\,(V^\circ_i - \phi)$ |
| Nernst, $E = E^\circ + \tfrac{RT}{zF}\ln\tfrac{a_{\mathrm{Ox}}}{a_{\mathrm{Red}}}$ | the floating Nernst on $V_{\mathrm{e}^-}(\mathrm{Ox}/\mathrm{Red})$ ([half-reactions](../half/)) |
| mass-action / solubility constant $K$ | a fixed $V_i - V_j$ gap ([mass action](../charge_control/)) |
| $\mathrm{pH} = -\log_{10} a_{\mathrm{H}^+}$ | $(V^\circ_{\mathrm{H}^+} - V_{\mathrm{H}^+})\big/(2.303\,RT/F)$ |

## Transport and storage

| Traditional | In $V_i$ terms |
| --- | --- |
| Nernst–Planck (drift + diffusion) flux | $J_i = -\sigma_i \nabla V_i$ ([transport](../transport_basic/)) |
| ionic conductivity $\sigma_i$ | $z_i^2 F^2 D_i\, c_i / RT$ |
| "ohmic" electrolyte current $-\sigma\nabla\phi$ | the uniform-concentration limit of $\textstyle\sum_i -\sigma_i\nabla V_i$ |
| chemical capacitance | $z_i^2 F^2 c_i / RT$ ([capacitance](../capacitors/)) |

## What does *not* translate cleanly

A few traditional quantities have no clean $V_i$ counterpart, and that is the point rather than a gap. The inner potential $\phi$, single-ion activities $a_i$, and single-ion activity coefficients $\gamma_i$ are each individually ambiguous; only charge-balanced combinations, and differences sampled within one solution, are well defined. The $V_i$ picture keeps exactly the unambiguous part and leaves the rest floating, which is why it never needs to commit to a value of $\phi$. (See [non-ideal solutions](../nonideal/).)
