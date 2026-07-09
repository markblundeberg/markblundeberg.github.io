#!/usr/bin/env python3
"""Generate the phi.md potential sketches (F1, F2) as SVGs into src/esbd/img/.

F1  phi-micro-mean.svg      microscopic phi (spiky cores, bond wells) inside a
                            slab, with its running mean <phi> riding flat at the
                            mean inner potential, several volts above the vacuum.
F2  hillium-junction.svg    two-panel hillium|mountainium junction: micro phi
                            gentle-left / spiky-right; the honestly-computed
                            running mean steps at the junction while the V_i /
                            V0_i ladder runs dead flat.

The running means are computed numerically from the drawn microscopic curves
(uniform window of one lattice constant): the smoothing is real, not sketched.
Colors follow figureDefs.js (electron #377EB8 for phi-family per site idiom,
sodium #d87E37, chloride #80B030); region tints echo REGION presets.
"""

import numpy as np
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / 'src' / 'esbd' / 'img'

BLUE = '#377EB8'  # phi-family (site: electron / phi dashes)
GREY = '#909090'  # microscopic potential
NA = '#d87E37'
CL = '#80B030'

plt.rcParams.update({
    'font.size': 10,
    'svg.hashsalt': 'esbd',  # deterministic ids
})


def micro_phi(x, atoms, spike_h, spike_w, well_d=3.2, well_w=0.22):
    """Cartoon microscopic potential: Lorentzian core spikes at each atom,
    Gaussian 'bond wells' midway between neighbours. Identical wells for
    every material; only the core architecture differs."""
    phi = np.zeros_like(x)
    for xa in atoms:
        phi += spike_h * spike_w**2 / ((x - xa) ** 2 + spike_w**2)
    mids = (np.asarray(atoms[:-1]) + np.asarray(atoms[1:])) / 2
    for xm in mids:
        phi -= well_d * np.exp(-((x - xm) ** 2) / (2 * well_w**2))
    return phi


def running_mean(y, x, window):
    dx = x[1] - x[0]
    n = max(3, int(round(window / dx)))
    kernel = np.ones(n) / n
    out = np.convolve(y, kernel, mode='same')
    # blank the half-window at each end where zero-padding pollutes the mean
    h = n // 2
    out[:h] = np.nan
    out[-h:] = np.nan
    return out


def region_label(ax, x0, x1, text, y=None):
    y = ax.get_ylim()[0] if y is None else y
    ax.text(
        (x0 + x1) / 2,
        y,
        text,
        ha='center',
        va='bottom',
        fontsize=10,
        family='serif',
        color='#555555',
    )


# ---------------------------------------------------------------- F1
def fig_micro_mean():
    x = np.linspace(0, 12, 6000)
    a0, a1 = 3.0, 9.0  # material slab
    atoms = list(np.arange(a0 + 0.5, a1 - 0.49, 1.0))
    phi = micro_phi(x, atoms, spike_h=55, spike_w=0.045)
    # suppress everything outside the slab (vacuum is smooth and empty)
    edge = 1 / (1 + np.exp(-(x - a0) / 0.08)) * 1 / (1 + np.exp((x - a1) / 0.08))
    phi *= edge
    mean = running_mean(phi, x, window=1.0)

    fig, ax = plt.subplots(figsize=(6.2, 3.5))
    ax.axhline(0, color='#bbbbbb', lw=0.7, ls=':', zorder=0)
    ax.axvspan(a0, a1, color='#eeeae0', zorder=0)
    ax.plot(x, phi, color=GREY, lw=0.8, zorder=2)
    ax.plot(x, mean, color=BLUE, lw=2.2, ls=(0, (5, 3)), zorder=3)

    ax.set_ylim(-9, 30)
    ax.set_xlim(0, 12)
    ax.set_xticks([])
    ax.set_yticks([0, 10, 20])
    ax.set_ylabel(r'$\phi$  (V)')
    ax.spines[['top', 'right']].add if False else None
    for s in ('top', 'right'):
        ax.spines[s].set_visible(False)

    imid = np.argmin(np.abs(x - 6.0))
    v0 = mean[imid]
    ax.annotate(
        r'$\phi_{\mathrm{micro}}$',
        xy=(4.55, 16),
        color='#666666',
        ha='center',
        fontsize=11,
    )
    ax.annotate(
        r'$\langle\phi\rangle$',
        xy=(6.9, v0 + 2.2),
        color=BLUE,
        ha='center',
        fontsize=12,
    )
    # the offset callout at right: vacuum zero up to the mean
    xa = 10.7
    ax.annotate(
        '',
        xy=(xa, v0),
        xytext=(xa, 0),
        arrowprops=dict(arrowstyle='<->', color='#555555', lw=0.9),
    )
    ax.text(
        xa + 0.25,
        v0 / 2,
        'mean inner\npotential',
        fontsize=8.5,
        color='#555555',
        va='center',
    )
    ax.plot([a1, xa + 0.02], [v0, v0], color='#bbbbbb', lw=0.7, ls=':')

    region_label(ax, 0, a0, 'vacuum', y=-8.4)
    region_label(ax, a0, a1, 'material', y=-8.4)
    region_label(ax, a1, 12, 'vacuum', y=-8.4)

    fig.tight_layout(pad=0.4)
    fig.savefig(OUT / 'phi-micro-mean.svg')
    plt.close(fig)


# ---------------------------------------------------------------- F2
def fig_hillium():
    x = np.linspace(0, 12, 8000)
    xj = 6.0  # the junction
    atoms_h = list(np.arange(0.5, xj - 0.49, 1.0))
    atoms_m = list(np.arange(xj + 0.5, 12 - 0.49, 1.0))
    # identical bond wells; only the cores differ: broad+gentle vs sharp+tall.
    # NB the Lorentzian areas (h·w) deliberately differ ~4x — that area is
    # what the running mean sees, and the mismatch IS the fictitious step.
    phi = micro_phi(x, atoms_h, spike_h=3.5, spike_w=0.25) + micro_phi(
        x, atoms_m, spike_h=70, spike_w=0.05
    )
    mean = running_mean(phi, x, window=1.0)

    fig, (ax1, ax2) = plt.subplots(
        2, 1, figsize=(6.2, 4.8), sharex=True, height_ratios=[1, 1]
    )
    for ax in (ax1, ax2):
        ax.axvspan(0, xj, color='#f3eedd', zorder=0)
        ax.axvspan(xj, 12, color='#e8e0cc', zorder=0)
        ax.axvline(xj, color='#c8bfa8', lw=0.8, zorder=1)
        for s in ('top', 'right'):
            ax.spines[s].set_visible(False)
        ax.set_xticks([])

    # top: the microscopic truth
    ax1.plot(x, phi, color=GREY, lw=0.8, zorder=2)
    ax1.set_ylim(-6, 26)
    ax1.set_yticks([])
    ax1.set_ylabel(r'$\phi_{\mathrm{micro}}$', fontsize=11)
    region_label(ax1, 0, xj, 'hillium', y=21)
    region_label(ax1, xj, 12, 'mountainium', y=21)

    # bottom: the averaged potential steps; the ladder does not
    ax2.plot(x, mean, color=BLUE, lw=2.2, ls=(0, (5, 3)), zorder=3)
    # plateaus computed above sit at ~0.9 (hillium) and ~9.2 (mountainium);
    # thread the ladder so the left plateau clears every rail by >= 1 V
    for y, c, lw in ((1.9, NA, 2.6), (-1.0, CL, 2.6), (3.1, NA, 1.1), (-2.4, CL, 1.1)):
        ax2.plot([0.3, 11.7], [y, y], color=c, lw=lw, solid_capstyle='butt', zorder=2)
    ax2.set_ylim(-4.0, 13)
    ax2.set_yticks([])

    ax2.annotate(
        r'$\langle\phi\rangle$', xy=(8.9, 10.6), color=BLUE, ha='center', fontsize=12
    )
    ax2.annotate(
        r'$V_{\mathrm{Na}^+}$', xy=(1.15, 2.25), color=NA, fontsize=10, ha='center'
    )
    ax2.annotate(
        r'$V^\circ_{\mathrm{Na}^+}$', xy=(10.7, 3.6), color=NA, fontsize=9, ha='center'
    )
    ax2.annotate(
        r'$V_{\mathrm{Cl}^-}$', xy=(1.15, -0.5), color=CL, fontsize=10, ha='center'
    )
    ax2.annotate(
        r'$V^\circ_{\mathrm{Cl}^-}$', xy=(10.7, -1.95), color=CL, fontsize=9, ha='center'
    )

    fig.tight_layout(pad=0.4, h_pad=0.6)
    fig.savefig(OUT / 'hillium-junction.svg')
    plt.close(fig)


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    fig_micro_mean()
    fig_hillium()
    print('wrote', OUT / 'phi-micro-mean.svg')
    print('wrote', OUT / 'hillium-junction.svg')
