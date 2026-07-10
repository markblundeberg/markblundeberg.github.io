#!/usr/bin/env node
// Render a PNG gallery of every figure (the figure PLUS its controls) for the
// diagram-review forks to look at. Run:  npm run gallery  [name…]
//
// LOCAL-ONLY (needs chromium). Builds the FIGTEST site (one isolated page per
// diagram include), serves it, hides the page chrome, and screenshots each
// /figtest/<name>/?static page to gallery/<name>.png. Deterministic (?static =
// no fades) and JS-on, so controls render in their live/default state. These
// PNGs are a review artifact (gitignored, regenerable), NOT shipped: a fork can
// `Read` a PNG and actually SEE the figure + sliders, unlike the seed SVGs.
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import http from 'node:http';

const INCLUDE_DIR = 'src/_includes/esbd-diagrams';
const BUILD_DIR = '/tmp/esbd_gallery_site';
const OUT_DIR = 'gallery';
const PORT = 8136;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Strip the site chrome so the PNG is just a name label + the figure + controls.
const HIDE_CHROME = `<style>
.site-nav, footer, .pagination-nav { display: none !important; }
.layout-wrapper { display: block !important; }
main { max-width: none !important; padding: 14px !important; }
.galtitle { font: 600 13px system-ui, sans-serif; color: #555; margin: 0 0 10px; }
body { background: #fff !important; }
</style>`;

// Each figure's real display width = the max-width of its enclosing <figure> in
// the owning .md. The figtest harness always uses 560px, which over-widens any
// figure that's narrower on its real page (e.g. copper-solder is 320). Recover
// the real width so the gallery shows true proportions.
function realWidths() {
    const map = {};
    const dir = 'src/esbd';
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        const md = readFileSync(join(dir, f), 'utf8');
        const re = /<figure[^>]*max-width:\s*(\d+)px[\s\S]{0,300}?esbd-diagrams\/([\w-]+)/g;
        let m;
        while ((m = re.exec(md))) if (!(m[2] in map)) map[m[2]] = parseInt(m[1], 10);
    }
    return map;
}

function waitForServer(url, tries = 50) {
    return new Promise((resolve, reject) => {
        const tick = (n) => {
            http.get(url, (res) => { res.destroy(); resolve(); })
                .on('error', () => (n <= 0 ? reject(new Error('server not up')) : setTimeout(() => tick(n - 1), 100)));
        };
        tick(tries);
    });
}

// --------------------------------------------------------------------------
const only = process.argv.slice(2);
const names = readdirSync(INCLUDE_DIR)
    .filter((f) => f.endsWith('.njk'))
    .map((f) => basename(f, '.njk'))
    .filter((n) => !only.length || only.includes(n))
    .sort();

console.log('Building FIGTEST site…');
execFileSync('npx', ['@11ty/eleventy', `--output=${BUILD_DIR}`], {
    env: { ...process.env, FIGTEST: '1' },
    stdio: 'ignore',
});

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], {
    cwd: BUILD_DIR,
    stdio: 'ignore',
});

mkdirSync(OUT_DIR, { recursive: true });
const widths = realWidths();
try {
    await waitForServer(`http://127.0.0.1:${PORT}/figtest/`);
    await sleep(300);
    for (const name of names) {
        const w = widths[name] || 560; // real display width; 560 = figtest default
        const pagePath = join(BUILD_DIR, 'figtest', name, 'index.html');
        let html = readFileSync(pagePath, 'utf8').replace('</head>',
            `${HIDE_CHROME}<style>.demo-container{max-width:${w}px!important}</style></head>`);
        // replace everything in <main> before the figure (the literal "# Figure
        // preview…" text + <style>) with a clean one-line name label
        html = html.replace(/(<main[^>]*>)[\s\S]*?(<figure)/, `$1<div class="galtitle">${name}</div>$2`);
        // measure hook: once rendered, publish the content height via the title
        html = html.replace('</body>',
            `<script>for(let t=200;t<=6000;t+=200)setTimeout(()=>{document.title=String(Math.ceil(document.body.scrollHeight))},t)</script></body>`);
        writeFileSync(pagePath, html);
        const url = `http://127.0.0.1:${PORT}/figtest/${name}/?static`;
        // Window must fit: main padding (2×14) + .demo-container padding/border
        // (2×8+2×1) + the figure at its true width + slack for trace-end labels
        // that legitimately overhang the plot edge by a few px. The old +40
        // squeezed the plot ~6px below its real-page width, which shifted the
        // SVG clip edge into end-of-trace labels ("V_Zr" artifacts) that render
        // fine on the real pages.
        const winW = w + 64;
        // pass 1: read the rendered content height from <title>
        const dom = execFileSync('chromium',
            ['--headless', '--no-sandbox', `--window-size=${winW},1200`, '--virtual-time-budget=6000', '--dump-dom', url],
            { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
        const h = Math.min(4000, Math.max(200, parseInt((dom.match(/<title>(\d+)<\/title>/) || [])[1] || '1000', 10) + 16));
        // pass 2: screenshot at exactly that width×height (no dead whitespace)
        execFileSync('chromium', [
            '--headless', '--no-sandbox', '--hide-scrollbars',
            '--force-device-scale-factor=2', `--window-size=${winW},${h}`,
            '--virtual-time-budget=6000',
            `--screenshot=${join(OUT_DIR, name + '.png')}`, url,
        ], { stdio: 'ignore' });
        console.log(`  ✓ ${name}.png (${winW}×${h})`);
    }
} finally {
    server.kill();
    rmSync(BUILD_DIR, { recursive: true, force: true });
}
console.log(`\nWrote ${names.length} gallery PNG(s) to ${OUT_DIR}/`);
