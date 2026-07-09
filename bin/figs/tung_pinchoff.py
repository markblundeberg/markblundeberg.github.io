#!/usr/bin/env python3
"""Generate the inhomog.md pinch-off figure (F9) as an SVG into src/esbd/img/.

tung-pinchoff.svg: the electron potential-energy landscape in front of a
metal-semiconductor interface whose barrier height varies from patch to
patch — a 3D wireframe homage to R. Tung's classic inhomogeneous-Schottky-
barrier picture (his site's inhomo.htm / APR 1, 011304 (2014) Figs 15-18;
redrawn, not copied).

Model (schematic but honest): a uniform high barrier V_b with depletion-
parabola decay into the bulk, plus a circular low-barrier patch of radius R
treated as an interface dipole disc; the disc's potential is computed from
its true solid angle (numerical quadrature), which is what produces the
saddle point ("pinch-off") in front of the patch rather than a sketch of one.
"""

import numpy as np
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / 'src' / 'esbd' / 'img'

plt.rcParams.update({'font.size': 9, 'svg.hashsalt': 'esbd'})

# geometry (nm) and energies (eV)
W = 30.0  # depletion width
R = 5.0  # patch radius
VB = 0.8  # uniform barrier height
DELTA = 0.55  # patch barrier reduction (dipole strength)


def disc_solid_angle(x, z, R, n=48):
    """Solid angle of a disc of radius R (centred at origin, in the z=0
    plane) seen from (x, 0, z), by quadrature over the disc."""
    r = np.linspace(0, R, n)[None, :] + (R / n) / 2
    th = np.linspace(0, 2 * np.pi, 2 * n, endpoint=False)[:, None]
    dA = (R / n) * (2 * np.pi / (2 * n)) * r
    dx = x - r * np.cos(th)
    dy = -r * np.sin(th)
    d2 = dx**2 + dy**2 + z**2
    return np.sum(z * dA / d2**1.5)


def potential(x, z):
    """Electron potential energy (eV) at lateral offset x, depth z."""
    vbb = VB * np.maximum(0.0, 1.0 - z / W) ** 2
    omega = disc_solid_angle(x, max(z, 0.05), R)
    return vbb - DELTA * (omega / (2 * np.pi)) * np.maximum(
        0.0, 1.0 - z / W
    ) ** 0.5


def main():
    xs = np.linspace(-16, 16, 49)
    zs = np.linspace(0.15, 30, 40)
    X, Z = np.meshgrid(xs, zs)
    V = np.vectorize(potential)(X, Z)

    # locate the on-axis saddle: the maximum along z through the patch centre
    zline = np.linspace(0.15, 20, 400)
    vline = np.array([potential(0.0, z) for z in zline])
    iz = int(np.argmax(vline))
    z_sad, v_sad = zline[iz], vline[iz]

    fig = plt.figure(figsize=(6.0, 4.4))
    ax = fig.add_subplot(projection='3d')
    ax.plot_wireframe(X, Z, V, rstride=1, cstride=1, color='#7a8ba0', lw=0.45)

    # the saddle, marked Tung-style with a downward arrow above it
    ax.scatter([0], [z_sad], [v_sad], color='#222222', s=12, depthshade=False)
    ax.text(0, z_sad, v_sad + 0.28, r'$\downarrow$', ha='center', fontsize=15, color='#222222')
    ax.text(0, z_sad + 3.2, v_sad + 0.34, 'saddle', ha='left', fontsize=9, color='#222222')

    ax.set_xlabel('x along interface (nm)', labelpad=-2)
    ax.set_ylabel('depth z (nm)', labelpad=-2)
    ax.set_zlabel('')
    fig.text(0.9, 0.62, 'electron energy (eV)', rotation=90, va='center', fontsize=9)
    ax.set_zlim(0, 0.9)
    ax.tick_params(pad=-2, labelsize=8)
    ax.view_init(elev=24, azim=-56)
    for pane in (ax.xaxis.pane, ax.yaxis.pane, ax.zaxis.pane):
        pane.set_visible(False)
    ax.grid(False)
    ax.set_box_aspect((1.15, 1.0, 0.8))

    fig.tight_layout(pad=0.1)
    fig.savefig(OUT / 'tung-pinchoff.svg', bbox_inches='tight')
    plt.close(fig)
    print('wrote', OUT / 'tung-pinchoff.svg', f'(saddle at z={z_sad:.1f} nm, {v_sad:.2f} eV)')


if __name__ == '__main__':
    main()
