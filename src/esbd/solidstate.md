---
layout: layouts/esbd_topic.njk
title: 'Semiconductors'
tags: [page, esbd_topic]
orderESBD: 22
---

# {{title}}

**WORK IN PROGRESS**

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

## The PN junction

Band diagram of PN junction in voltage mode.

## Electrons and ions compared

- Fermi-Dirac distribution vs simple ideal-dilute distribution. FD as simply another form of nonideality. Also see {%wiki "Langmuir adsorption model" %} ~ FD. Also mention actual electron/hole nonideality (strongly doped).

- Zero of energy for ions (conventionally varies) vs electrons (defined specifically)

- What semiconductorists can learn from chemists
   - Materials without good band structure (liquid or disordered)
   - 


## Nonideality in semicondcutors

Semiconductors also exhibit nonideality effects. This tends to occur for electron or hole concentrations above $10^{18}~\mathrm{cm}^{-3}$ (which corresponds to $10^{-3}~\mathrm{mol/L}$, surprisingly quite similar to where ionic nonidealities start in chemical solutions). Semiconductors are much more simple than chemical solutions, and so we often have a clearer quantitative picture of physical mechanisms behind the nonideality.[^seminote]

[^seminote]:
    * The band structure may 'morph' due to electron-electron effects. That is, in some sense there are still quasi-single-particle states, but they have moved. This is best known by its effect on bandgap, called "band gap renormalization".
    * Dopants get close enough together to form their own impurity bands, which can merge with the normal band states.
    * The dopants cause a random potential field, that smears out the the band edges.
    * Lattice strains can significantly shift the band structure.

The way that these are mathematically described is different, however! In semiconductor physics we prefer to describe the updated $E_{\mathrm{C}}$ and $E_{\mathrm{V}}$ values (which still retain some physical meaning and can be accessed e.g. via {% wiki "ARPES" %}), updated effective mass (band shape), and so on. The relationship between carrier density $ n_{\mathrm{e}^-}$ and $(\bar\mu_{\mathrm{e}^-} - E_{\mathrm{C}})$ then becomes nontrivial without needing to introduce an all-encompassing 'fudge factor'.

The chemistry approach would be like defining a formal 'standard band edges' $E^\circ_{\mathrm{C}}$ and $E^\circ_{\mathrm{V}}$, with a fixed band gap $E^\circ_{\mathrm{C}} - E^\circ_{\mathrm{V}}$ and then imposing activity coefficients when relating carrier density to chemical potentials. But, just like the ionic standard states $V^\circ_i$, such formal states $E^\circ_{\mathrm{C}}$ are fundamentally ambiguous: how much of the band gap change is due to $E_{\mathrm{C}}$ moving away from $E^\circ_{\mathrm{C}}$, and how much is due to $E_{\mathrm{V}}$ moving away from $E^\circ_{\mathrm{V}}$? Electroneutrality means we have no way of directly measuring "where $E_{\mathrm{C}}$ would have been", and we can't even define what that would mean.

Sadly, we can't quite import the semiconductor "moving band edge" picture into chemistry. chemical solutions seem to be so complicated that we don't have a clean physical concept like $E_{\mathrm{C}}$ that we could use instead of activity coefficients. The nonidealities reflect moving from a starting 'pure' situation of messy strong interactions to a slightly different flavouring of messy strong interactions.

> Note - there is another class of semiconductor 'non-ideality' which is purely statistical in nature. Ideal electrons actually act as a quantum ideal gas ({% wiki "Fermi gas" %}), not a classical Boltzmann gas. In this case, the band structure stays intact (band gap $E_{\mathrm{C}} - E_{\mathrm{V}}$ unaltered) but the electron concentration now varies as:
> $$ n_{\mathrm{e}^-} = N_{\mathrm{C}} f( (\bar\mu_{\mathrm{e}^-} - E_{\mathrm{C}})/kT) $$
> where the function $f()$ is some other mathematical function (such as involving a {% wiki "complete Fermi-Dirac integral" %}) instead of $\exp()$. But this is kind of nonideality is more trivial, not really the messy kind of nonideality that gives us headaches.
>
>It's worth noting that statistical nonideality is not exclusive to quantum mechanics: in chemistry, the ideal lattice gas ({%wiki "Langmuir adsorption model" %}) is entirely classical, but mathematically behaves like a zero temperature Fermi gas. {%wiki "Ideal mixtures" %} similarly are statistically ideal in mole fraction, which makes them trivially non-ideal in molality (or molarity). In activity models, the single factor $\gamma_i$ is a combination of statistical nonideality, concentration-measure nonideality, and the fundamental interaction nonideality.

## Takeaways


[**NEXT TOPIC: XXX**](../xxx/)

{#   

## Optional discussion

<details>
<summary>
Click to open extended discussion.
</summary>


Gemini July 4

Proposed Outline for "Semiconductors" Topic
Introduction: Bridging Electrochemistry and Solid-State Physics

Concept: State the goal of the topic: to show that the Vᵢ framework and the "species potential level" concept can be applied directly to semiconductors, providing a unified view with electrochemistry.

The Mobile Carriers: Introduce the mobile charge carriers in a semiconductor: electrons (e⁻) in the conduction band and holes (h⁺) in the valence band. Frame them as the "ions" of the solid state.

Species Potentials in Semiconductors

Definitions: Define the species potential levels for electrons and holes based on their electrochemical potentials (μ̃):

V_e⁻ = μ̃_e⁻ / (-F)

V_h⁺ = μ̃_h⁺ / (+F)

The Fermi Level: Explicitly state that the electron's electrochemical potential μ̃_e⁻ is what solid-state physicists call the Fermi Level (E_F). Therefore, V_e⁻ is the scaled and inverted Fermi level.

Equilibrium: Explain that in any single piece of semiconductor at equilibrium, the electron and hole potentials must be equal: V_e⁻ = V_h⁺. This single level is the "Fermi level" of the system on your diagram.

Microscopic Energy Levels: The Band Edges

Concept: Introduce the idea of microscopic energy levels, analogous to the "ion site energy" we discussed for YSZ.

Conduction Band Edge (E_C): The minimum energy required to add an electron to the crystal as a mobile carrier. This is the "site energy" for an electron.

Valence Band Edge (E_V): The maximum energy of electrons in the valence band. Removing an electron from here creates a mobile hole. This is effectively the "site energy" for a hole.

The Band Gap (E_g): Define the band gap as the energy difference E_g = E_C - E_V. This is the energy required to create an electron-hole pair (null ⇌ e⁻ + h⁺).

ESBD Visualization: Explain how these band edges (E_C and E_V) can be plotted on the Vᵢ diagram as V_e⁻(site) and V_h⁺(site), creating the familiar band structure.

Doping: The Analogy to Solid Electrolytes

Concept: Describe n-type doping (e.g., adding Phosphorus to Silicon) and p-type doping (e.g., adding Boron).

The Key Analogy: Frame the dopant atoms as fixed, immobile background charges within the crystal lattice (P⁺ for donors, B⁻ for acceptors). This is directly analogous to the Y³⁺ dopants in YSZ creating a fixed background charge.

Controlling Carrier Concentration: Explain that to maintain charge neutrality, the concentration of mobile carriers (n for electrons or p for holes) is determined by the concentration of these fixed dopant ions.

ESBD View: Show on a diagram how n-type doping raises the equilibrium V_e⁻/V_h⁺ level closer to the conduction band edge, while p-type doping lowers it closer to the valence band edge.

The P-N Junction: The Power of the Band Diagram

Concept: This is the crucial application that demonstrates the power of the diagram. Describe joining a p-type and an n-type semiconductor.

Equilibrium Condition: Explain that when they are joined, the system must reach a new equilibrium where the thermodynamic potential (the Fermi level, or the V_e⁻/V_h⁺ level) is flat and continuous across the entire device.

Band Bending: Show that the only way for the V_e⁻/V_h⁺ level to be flat is for the microscopic site energy levels (the band edges) to bend in the region of the junction.

Consequences: Explain that this "band bending" creates the depletion region and the built-in potential, which are responsible for the diode's rectifying behavior. This cannot be understood by only looking at the thermodynamic potential (V_e⁻) without also plotting the microscopic levels (the band edges).

Conclusion

Summarize that the Vᵢ framework provides a common language for both electrolytes and semiconductors.

Reiterate that the utility of the "band diagram" approach lies in its ability to visualize both the macroscopic thermodynamic driving forces (Vᵢ levels) and the underlying microscopic energy landscape (band edges/site energies) that dictates the system's properties and device function.
#}
