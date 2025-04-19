---
layout: layouts/base.njk
title: 'ESBD: Electrode Reactions & Li-ion Batteries'
tags: [page, esbd_topic] # Assign to 'page' and 'esbd_topic' collections
eleventyNavigation:
    key: Electrodes & Li-ion # Text used in navigation menus
    parent: ESBD # Optional: Assumes you have a main 'ESBD' menu item defined elsewhere
    order: 1 # Order within the parent menu
---

([&#x2190; Back to ESBD landing page](/esbd/))

# {{title}}

Electrodes create interfaces where electrons (in metal) and ions (in solution) meet. A classic example, used as a standard reference for electrochemical studies, is the silver chloride electrode:

>    $\mathrm{Ag}$ metal | $\mathrm{AgCl}$ coating | Solution containing $\mathrm{Cl}^-$ ions

The characteristic and reversible reaction here is that the silver chloride can take an electron from the metal, and release a $\mathrm{Cl}^-$ ion, in the process leaving behind some Ag that deposits on the metal. Let's write down that reaction:

$$ \mathrm{AgCl} + \mathrm{e}^- \rightleftharpoons \mathrm{Ag} + \mathrm{Cl}^-$$

Let's convert this reversible reaction to (electro)-chemical potentials:

$$ \mu_{\mathrm{AgCl}} + \bar\mu_{\mathrm{e}^-} = \mu_{\mathrm{Ag}} + \bar\mu_{\mathrm{Cl}^-}$$

As this is our first time seeing a reaction, let's break this down:

* $\mu_{\mathrm{AgCl}}$ is the chemical potential of the salt. It's also the electrochemical potential, but since this is a neutral species, we just leave off the overbar.
* $\bar\mu_{\mathrm{e}^-}$ is the electrochemical potential for electrons, in the silver metal.
* The equality ($=$) of these two sides is because we are assuming equilibrium.
* $\mu_{\mathrm{Ag}}$ is the chemical potential associated to silver atoms, in the solid metal state.
* $\bar\mu_{\mathrm{Cl}^-}$ is the electrochemical potential for chloride ions, _in solution_.

Now for the ionic species, we just sub in $\bar{\mu}_i = z_i F V_i$, and this becomes:

$$ \mu_{\mathrm{AgCl}} - F V_{\mathrm{e}^-} = \mu_{\mathrm{Ag}} - F V_{\mathrm{Cl}^-}$$

or rearranging,

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} =  \frac{1}{F} ( \mu_{\mathrm{Ag}} - \mu_{\mathrm{AgCl}} )$$

We are going to see this kind of equation occur again and again: where there is a reaction of any kind, the _separation_ between $V_i$ levels is controlled by some neutral species' chemical potentials. We will always see a balance of $V_i$ levels (never any sensitivity to absolute $V_i$) because legitimate reactions are always charge-balanced.

So, what is this difference? Well, since chemical potentials are partial molar Gibbs free energy, we can just look up the Gibbs free energies of formation in a table: $\mu_{\mathrm{Ag}} = 0~\mathrm{kJ/mol}$ and $\mu_{\mathrm{AgCl}} = -109.8~\mathrm{kJ/mol}$ at standard temperature and pressure (STP). Note that we use the convention that $\mu=0$ for elements in their most stable form, at STP. Plug those in with the faraday constant, and we get:

$$ V_{\mathrm{Cl}^-} - V_{\mathrm{e}^-} = +1.138~\mathrm{V}$$

So let's plot this out on a band diagram:

(...)

