#!/usr/bin/env python3
"""Generate the Harned-cell extrapolation figure (nonideal.md) as SVG into
src/esbd/img/.

harned-extrapolation.svg   the classic extrapolation view: the Harned-cell
                           voltage (Pt | H2 | HCl(m) | AgCl | Ag) with the
                           ideal-dilute Nernst slope subtracted, plotted vs
                           sqrt(m). The ideal prediction becomes the flat
                           line at E°, the shaded gap is exactly
                           (2RT/F) ln γ±, and the m→0 intercept is how E°
                           (equivalently the V° ladder spacing) gets pinned.

(The full interactive Harned-cell figure lives in references.md as
esbd-harned-nonideal.njk; this static panel is nonideal.md's metrology
companion.)

The "measured" curve is the Pitzer 1-1 fit for HCl (β0=0.1775, β1=0.2945,
Cφ=0.0008; PHREEQC pitzer.dat, 25 °C), standing in for the Harned & Ehlers /
Bates & Bower data points it was fitted to. E° = 0.2221 V computed from the
site's own iondata (matches esbd-she-agcl-e.njk), vs 0.22234 V in Bates &
Bower — sub-mV, invisible here.

Also prints the single-ion convention comparison table used to pin the
"conventions disagree by ..." numbers in nonideal.md/references.md: γ_Cl-
in HCl(m) under MacInnes (= γ±KCl at same I), Bates–Guggenheim, and the
symmetric split (γ_Cl- = γ±HCl), expressed as ladder shifts (RT/F)·Δln in mV.

Colors follow figureDefs.js / phi_sketches.py idiom (electron #377EB8 for
wire-voltage curves; grey for the ideal reference).
"""

import sys

import numpy as np
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / 'src' / 'esbd' / 'img'

BLUE = '#377EB8'  # measured wire voltage (electron colour)
GREY = '#909090'  # ideal-dilute reference

plt.rcParams.update({
    'font.size': 10,
    'svg.hashsalt': 'esbd',  # deterministic ids
})

# --- constants (25 °C) -------------------------------------------------
R = 8.31446261815324
F = 96485.33212331
T = 298.15
RT_F = R * T / F  # 25.693 mV
A_PHI = 0.3915  # Debye-Hückel slope for osmotic coefficient
B_PITZER = 1.2
ALPHA = 2.0

# E° of Ag/AgCl vs SHE from the site's iondata (see esbd-she-agcl-e.njk):
# E° = μ°_H2/2F − (V°_H+ − V°_Cl-) − (μ_Ag − μ_AgCl)/F = 1.3601 − 1.1380
E0 = 1.3601 - 1.1380  # 0.2221 V

# Pitzer 1-1 binary parameters (PHREEQC pitzer.dat, 25 °C)
HCL = dict(b0=0.1775, b1=0.2945, cphi=0.0008)
KCL = dict(b0=0.04835, b1=0.2122, cphi=-0.00084)


def ln_gamma_pm(m, b0, b1, cphi):
    """ln γ± for a 1-1 electrolyte, simplified Pitzer (same as the KCl demo
    in AI codes/nonideal)."""
    m = np.asarray(m, dtype=float)
    s = np.sqrt(m)
    f_gamma = -A_PHI * (s / (1 + B_PITZER * s) + (2 / B_PITZER) * np.log(1 + B_PITZER * s))
    with np.errstate(divide='ignore', invalid='ignore'):
        Bg = 2 * b0 + (2 * b1 / (ALPHA**2 * m)) * (
            1 - (1 + ALPHA * s) * np.exp(-ALPHA * s)
        )
    Bg = np.where(m < 1e-12, 2 * b0 + b1, Bg)
    return f_gamma + m * Bg + m**2 * 1.5 * cphi


def ln_gamma_cl_macinnes(m):
    """MacInnes: γ_Cl-(any solution) = γ±(KCl) at the same ionic strength."""
    return ln_gamma_pm(m, **KCL)


def ln_gamma_cl_bg(m):
    """Bates–Guggenheim: log10 γ_Cl- = −A √I / (1 + 1.5 √I), A = 0.509."""
    s = np.sqrt(np.asarray(m, dtype=float))
    return np.log(10.0) * (-0.509 * s / (1 + 1.5 * s))


def E_cell(m):
    """Harned-cell voltage at unit H2 fugacity."""
    return E0 - 2 * RT_F * (np.log(m) + ln_gamma_pm(m, **HCL))


# ---------------------------------------------------------------- figure
def fig_extrapolation():
    m = np.logspace(-3, np.log10(4.0), 400)
    E_meas = E_cell(m)

    fig, ax = plt.subplots(figsize=(5.0, 3.1))

    s = np.sqrt(m)
    y_meas = E_meas + 2 * RT_F * np.log(m)  # = E° + 2(RT/F) ln γ±
    ax.axhline(E0, color=GREY, lw=1.5, ls=(0, (5, 3)), zorder=2)
    ax.plot(s, y_meas, color=BLUE, lw=2.2, zorder=3)
    ax.fill_between(s, y_meas, E0, color=BLUE, alpha=0.15, lw=0, zorder=1)
    ax.plot([0], [E0], 'o', color=BLUE, ms=6, zorder=4)
    ax.set_xlim(0, 2.05)
    ax.set_ylim(0.195, 0.255)
    ax.set_xticks([0, 0.5, 1.0, 1.5, 2.0])
    ax.set_xlabel(r'$\sqrt{m_{\mathrm{HCl}}}$  (mol/kg)$^{1/2}$')
    ax.set_ylabel(r'$E + \frac{2RT}{F}\ln m$  (V)')
    ax.annotate(
        r'$E^\circ$',
        xy=(0.0, E0),
        xytext=(0.13, E0 + 0.012),
        color=BLUE,
        fontsize=11,
        arrowprops=dict(arrowstyle='-', color='#999999', lw=0.8),
    )
    # gap arrow at the top of the hump (γ± < 1 side)
    i = int(np.argmax(y_meas))
    ax.annotate(
        '',
        xy=(s[i], y_meas[i]),
        xytext=(s[i], E0),
        arrowprops=dict(arrowstyle='<->', color='#555555', lw=0.9),
    )
    ax.text(
        s[i] + 0.08,
        (y_meas[i] + E0) / 2 + 0.001,
        r'$\frac{2RT}{F}\ln\gamma_\pm$',
        fontsize=10,
        color='#555555',
        va='center',
    )

    for sp in ('top', 'right'):
        ax.spines[sp].set_visible(False)

    fig.tight_layout(pad=0.4)
    fig.savefig(OUT / 'harned-extrapolation.svg')
    plt.close(fig)


# ---------------------------------------------------------------- check
def convention_table():
    print('HCl(m): γ± check vs standard tables, then single-ion conventions')
    ms = np.array([0.001, 0.01, 0.1, 0.5, 1.0, 2.0, 3.0, 4.0])
    g_pm_hcl = np.exp(ln_gamma_pm(ms, **HCL))
    g_pm_kcl = np.exp(ln_gamma_pm(ms, **KCL))
    print(' m      γ±(HCl)  γ±(KCl)')
    for mi, gh, gk in zip(ms, g_pm_hcl, g_pm_kcl):
        print(f' {mi:5.3f}  {gh:7.4f}  {gk:7.4f}')

    print('\nγ_Cl-(HCl, m) under three conventions, and ladder shifts (mV):')
    ln_mi = ln_gamma_cl_macinnes(ms)
    ln_bg = ln_gamma_cl_bg(ms)
    ln_sym = ln_gamma_pm(ms, **HCL)  # symmetric split: γ_Cl- = γ±(HCl)
    print(' m      MacInnes  B-G     symm   |  MI vs BG   MI vs symm  (RT/F·Δln, mV)')
    for i, mi_ in enumerate(ms):
        d_bg = 1e3 * RT_F * (ln_mi[i] - ln_bg[i])
        d_sym = 1e3 * RT_F * (ln_mi[i] - ln_sym[i])
        print(
            f' {mi_:5.3f}  {np.exp(ln_mi[i]):7.4f}  {np.exp(ln_bg[i]):6.4f}'
            f'  {np.exp(ln_sym[i]):6.4f} | {d_bg:8.2f}   {d_sym:10.2f}'
        )
    print('\n(each Δln γ_Cl- moves that solution\'s whole ladder, SHE rung included,')
    print(' by (RT/F)·Δln; the E / LJP split reshuffles by the same amount)')


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    fig_extrapolation()
    print('wrote', OUT / 'harned-extrapolation.svg')
    convention_table()
