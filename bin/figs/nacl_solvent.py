#!/usr/bin/env python3
"""Generate the NaCl water/methanol comparison figures (solutions.md +
nonideal.md) as SVG into src/esbd/img/.

nacl_solvent_comparison.svg        V_Na+ - V_Cl- vs molality for NaCl in
                                   water (Pitzer) and methanol (extended
                                   Debye-Hückel estimate), with the solid-
                                   NaCl saturation line: both curves pinned
                                   to hit V_solid at their known solubility.
nacl_solvent_comparison_gamma.svg  the same nonideality re-expressed as the
                                   mean activity coefficient ln γ±.

Rescued 2026-07-21 from AI codes/nonideal/"nacl water methanol.py" (which
generated only the V panel; the γ panel previously lived only in the Colab
gist). One deliberate fix vs the gist: the γ panel's y-axis used to be
labelled ln(γ_Na+ γ_Cl-) while actually plotting ln γ± (half of that); it
is now labelled ln γ±.

Water params: Pitzer 1-1 for NaCl (β0=0.0765, β1=0.2664, Cφ=0.00127).
Methanol: extended Debye-Hückel with A_e, Ba scaled from water by
dielectric ratio (78/33), density ratio (0.79), and a ~1.5x nearest-
approach distance; solubility 0.238 mol/kg (Li et al. 2010). V_solid =
-3.9813 V from the site's iondata; the water-curve intercept construction
reproduces V°_Na+ - V°_Cl- = -4.0746 V (printed as a check).
"""

import numpy as np
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / 'src' / 'esbd' / 'img'

plt.rcParams.update({
    'svg.hashsalt': 'esbd',  # deterministic ids
})

# --- constants (25 °C) -------------------------------------------------
R = 8.314
T = 298.15
F = 96485.0
RT_F = R * T / F


def calc_gamma_pitzer(m_salt, beta0=0.0765, beta1=0.2664, Cphi=0.00127):
    """ln γ± for a 1-1 salt, simplified Pitzer (water parameters)."""
    A_phi = 0.392
    b = 1.2
    alpha = 2.0
    I = m_salt  # 1:1 salt
    sqrt_I = np.sqrt(I)
    f_gamma = -A_phi * ((sqrt_I / (1 + b * sqrt_I)) + (2 / b) * np.log(1 + b * sqrt_I))
    x = alpha * sqrt_I
    g_x = 2 * (1 - (1 + x) * np.exp(-x)) / (x**2)
    B_gamma = 2 * beta0 + 2 * beta1 * g_x
    C_gamma = 3 / 2 * Cphi
    return f_gamma + m_salt * B_gamma + m_salt**2 * C_gamma


def calc_gamma_dh(m_salt, A_e=1.176, Ba=3.29):
    """ln γ± for a 1-1 salt, extended Debye-Hückel (molal units)."""
    I = m_salt
    sqrt_I = np.sqrt(I)
    return -A_e * sqrt_I / (1.0 + Ba * sqrt_I)


# Methanol DH parameters, scaled from water:
#   dielectric eps_water/eps_meoh = 78/33 = 2.4; density ratio 0.79;
#   nearest-approach distance ~1.5x water's. A_e(water)=1.176, Ba(NaCl)=1.5.
A_E_MEOH = 1.176 * (2.4) ** 1.5 * (0.79) ** 0.5
BA_MEOH = 1.5 * (2.4) ** 0.5 * (0.79) ** 0.5 * (1.5) ** 1.0

# Saturation limits (solubility) and the solid's level
M_SAT_WATER = 6.15  # mol/kg
M_SAT_MEOH = 0.238  # mol/kg (Li et al. 2010)
V_SOLID = -3.9813  # V_Na+ - V_Cl- for solid NaCl (iondata)


def calc_V(V0, m_array, ln_gammas):
    return V0 + 2 * RT_F * (ln_gammas + np.log(m_array))


def calc_V_sat(m_sat, m_array, ln_gammas):
    """Pin the curve to hit V_SOLID exactly at the known solubility."""
    raw_V = calc_V(0, m_array, ln_gammas)
    V0 = V_SOLID - np.interp(m_sat, m_array, raw_V)
    return V0, V0 + raw_V


M_WATER = np.logspace(-3.5, 0.9, 500)
M_MEOH = np.logspace(-3.5, -0.3, 400)  # stop earlier for MeOH
LNG_WATER = calc_gamma_pitzer(M_WATER)
LNG_MEOH = calc_gamma_dh(M_MEOH, A_e=A_E_MEOH, Ba=BA_MEOH)


def fig_v():
    V0_water, V_water = calc_V_sat(M_SAT_WATER, M_WATER, LNG_WATER)
    V0_meoh, V_meoh = calc_V_sat(M_SAT_MEOH, M_MEOH, LNG_MEOH)
    print(f'Water V0 = {V0_water:.4f} V  (-4.0746 V expected)')
    print(f' MeOH V0 = {V0_meoh:.4f} V')

    plt.figure(figsize=(4, 3), dpi=150)
    plt.axes((0.17, 0.16, 0.8, 0.83))

    plt.plot(M_MEOH, V_meoh, linewidth=2.5, color='purple', label='NaCl in methanol', zorder=100)
    plt.plot(M_WATER, V_water, linewidth=2.5, label='NaCl in water', zorder=100)
    plt.axhline(V_SOLID, color='red', linestyle=':', linewidth=2, label='NaCl solid')
    plt.plot(M_WATER, calc_V(V0_water, M_WATER, 0), 'k--', alpha=0.3, label='Ideal slope')
    plt.plot(M_WATER, calc_V(V0_meoh, M_WATER, 0), 'k--', alpha=0.3)
    plt.plot(M_SAT_WATER, V_SOLID, 'o', color='tab:blue', markersize=6, zorder=10)
    plt.plot(M_SAT_MEOH, V_SOLID, 'o', color='purple', markersize=6, zorder=10)

    plt.annotate('↑supersaturated', (3.5e-4, V_SOLID), xytext=(0, 10),
                 textcoords='offset points', ha='left', va='center', color='r', alpha=0.5)
    plt.annotate('↓undersaturated', (3.5e-4, V_SOLID), xytext=(0, -10),
                 textcoords='offset points', ha='left', va='center', color='r', alpha=0.5)

    plt.xscale('log')
    plt.xlabel(r'NaCl moles per kg solvent')
    plt.ylabel(r'$V_{\mathrm{Na}^+} - V_{\mathrm{Cl}^-}$  (volts)')
    plt.grid(True, which='both', alpha=0.3)
    plt.legend(loc='lower right', fontsize=10)
    plt.xlim(10**-3.5, 10)
    plt.ylim(V_SOLID - 0.55, V_SOLID + 0.1)
    plt.savefig(OUT / 'nacl_solvent_comparison.svg')
    plt.close()


def fig_gamma():
    plt.figure(figsize=(4, 3), dpi=150)
    plt.axes((0.17, 0.16, 0.8, 0.83))

    plt.plot(M_WATER, LNG_WATER, linewidth=2.5, color='tab:blue', label='NaCl in water', zorder=100)
    plt.plot(M_MEOH, LNG_MEOH, linewidth=2.5, color='purple', label='NaCl in methanol', zorder=100)
    plt.axhline(0, color='grey', linestyle='--', alpha=0.6, label='Ideal')

    plt.xscale('log')
    plt.xlabel(r'NaCl moles per kg solvent')
    plt.ylabel(r'$\ln \gamma_\pm$')
    plt.grid(True, which='both', alpha=0.3)
    plt.legend(loc='upper left', fontsize=10)
    plt.xlim(10**-3.5, 10)
    plt.ylim(-0.95, 0.45)
    plt.savefig(OUT / 'nacl_solvent_comparison_gamma.svg')
    plt.close()


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    fig_v()
    fig_gamma()
    print('wrote', OUT / 'nacl_solvent_comparison.svg')
    print('wrote', OUT / 'nacl_solvent_comparison_gamma.svg')
