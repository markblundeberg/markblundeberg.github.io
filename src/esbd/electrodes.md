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

Electrodes create interfaces where electrons (in metal) and ions (in solution) meet. As a simple example, A zinc wire dipped into a solution will tend to release $\mathrm{Zn}^{2+}$ ions, or, they may deposit back. This is described by the following reaction:

$$ \mathrm{Zn} \rightleftharpoons \mathrm{Zn}^{2+} + 2\mathrm{e}^-$$

How does this translate to our band diagrams? Well, we're first going to have to convert to (electro-)chemical potentials:

$$ \mu_{\mathrm{Zn}} = \bar\mu_{\mathrm{Zn}^{2+}} + 2\bar\mu_{\mathrm{e}^-}$$

As this is our first time seeing a reaction, let's break this down:

* $\mu_{\mathrm{Zn}}$ is the chemical potential associated to zinc atoms, in the _regular solid metal state of zinc_. It's also the electrochemical potential, but since this is a neutral species, we just leave off the overbar.
* The equality ($=$) of these two sides is because we are assuming equilibrium.
* $\bar\mu_{\mathrm{Zn}^{2+}}$ is the electrochemical potential for doubly ionized zinc atoms, _in solution_.
* $\bar\mu_{\mathrm{e}^-}$ is the electrochemical potential for electrons, _in the metal_.

Now for the ionic species, we just sub in $\bar{\mu}_i = z_i F V_i$, and this becomes:

$$ \mu_{\mathrm{Zn}} = 2 F V_{\mathrm{Zn}^{2+}} - 2 F V_{\mathrm{e}^-}$$

Here the 2 in front of the $V_{\mathrm{Zn}^{2+}}$ came because of its ionic charge, whereas the 2 in front of $V_{\mathrm{e}^-}$ came from the original formula; the latter also flipped sign. Now, let's isolate the electron:

$$ V_{\mathrm{e}^-} = V_{\mathrm{Zn}^{2+}} - \frac{1}{2F} \mu_{\mathrm{Zn}} $$

Or we could write this as a difference:

$$ V_{\mathrm{Zn}^{2+}} - V_{\mathrm{e}^-} =  \frac{1}{2F} \mu_{\mathrm{Zn}} $$

We are going to see this kind of equation occur again and again: where there is a reaction of any kind, the _separation_ between $V_i$ levels is controlled by some neutral species' chemical potentials. We will always see a balance of $V_i$ levels (never any sensitivity to absolute $V_i$) because legitimate reactions are always charge-balanced.

Now, let's plot this out on a band diagram:

(...)

OK, here we see something interesting: $V_{\mathrm{Zn}^{2+}} = V_{\mathrm{e}^-}$! Where did the $\mu_{\mathrm{Zn}}$ go!? Well, this bring us to another important topic, which is how our choice of elemental reference states influences the diagram.

The universally recognized IUPAC convention for elemental reference states assigns Zn metal at STP a Gibbs free energy of formation of exactly 0. What does this mean for chemical potentials? Well, chemical potentials are exactly the partial molar Gibbs free energy.