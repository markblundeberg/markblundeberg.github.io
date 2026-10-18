#!/usr/bin/env python3
"""Mark's μ: the avatar and the site favicon, from one outline.

The μ is Latin Modern Math's U+1D707 MATHEMATICAL ITALIC SMALL MU (the Computer Modern μ of LaTeX papers), traced to
mu-path.txt in font units (GUST Font License). Near-black on electron blue (#377eb8, the electron colour in
ESBD's figureDefs.js), with a white outline 2.5% of the width. Placed by the ink's centroid, then lowered 3%.
Small icons are drawn heavier, and at 16 px the outline (a grey smear at that size) is dropped.

  python3 build.py    writes out/avatar.svg, out/avatar-{400,800,2048}.png and ../../src/img/favicon.ico
Rasterised by headless Chrome (google-chrome on PATH); the .ico needs Pillow.
"""
import os, subprocess, tempfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
PATH = open(os.path.join(HERE, 'mu-path.txt')).read().strip()
BLUE, INK, WHITE = '#377eb8', '#1c1f23', '#ffffff'
CX, CY = 272, 137                       # the ink's centroid, in font units


def svg(px, shape='full', k=.091, dy=3, bold=0, line=2.5):
    """the mark on a 100-unit square: k = font units to box units, dy = lowered by (box units), bold = extra stroke
    weight, line = white outline width (both box units). shape: 'full' (to the edges), 'round' (rounded square)"""
    tr = f'translate(50 {50 + dy}) scale({k} {-k}) translate({-CX} {-CY})'
    back = f'<rect width="100" height="100" rx="{18 if shape == "round" else 0}" fill="{BLUE}"/>'
    s = f'<svg xmlns="http://www.w3.org/2000/svg" width="{px}" height="{px}" viewBox="0 0 100 100">{back}'
    if line:
        s += f'<path d="{PATH}" fill="{WHITE}" stroke="{WHITE}" stroke-width="{2 * (bold + line) / k:.1f}" stroke-linejoin="round" transform="{tr}"/>'
    st = f' stroke="{INK}" stroke-width="{2 * bold / k:.1f}" stroke-linejoin="round"' if bold else ''
    return s + f'<path d="{PATH}" fill="{INK}"{st} transform="{tr}"/></svg>\n'


def png(svgtext, px, out):
    with tempfile.TemporaryDirectory() as d:
        f = os.path.join(d, 'm.svg'); open(f, 'w').write(svgtext)
        subprocess.run(['google-chrome', '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                        '--default-background-color=00000000', f'--window-size={px},{px}', f'--screenshot={out}', 'file://' + f],
                       check=True, capture_output=True)
    im = Image.open(out)
    assert im.size == (px, px), (out, im.size)
    return im


os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'avatar.svg'), 'w').write(svg(2048))
for px in (400, 800, 2048):
    png(svg(px), px, os.path.join(OUT, f'avatar-{px}.png'))
# the favicon: a rounded square; heavier μ; no outline at 16
icons = {16: dict(k=.105, bold=2.5, line=0), 32: dict(k=.1, bold=1.5, line=4), 48: dict(k=.1, bold=1.5, line=4)}
ims = {px: png(svg(px, 'round', **o), px, os.path.join(OUT, f'favicon-{px}.png')).convert('RGBA') for px, o in icons.items()}
ims[48].save(os.path.join(HERE, '..', '..', 'src', 'img', 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)],
             append_images=[ims[16], ims[32]])
print('wrote', OUT, 'and src/img/favicon.ico')
