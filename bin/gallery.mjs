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
try {
    await waitForServer(`http://127.0.0.1:${PORT}/figtest/`);
    await sleep(300);
    for (const name of names) {
        const pagePath = join(BUILD_DIR, 'figtest', name, 'index.html');
        let html = readFileSync(pagePath, 'utf8').replace('</head>', HIDE_CHROME + '</head>');
        // replace everything in <main> before the figure (the literal "# Figure
        // preview…" text + <style>) with a clean one-line name label
        html = html.replace(/(<main[^>]*>)[\s\S]*?(<figure)/, `$1<div class="galtitle">${name}</div>$2`);
        // measure hook: once rendered, publish the content height via the title
        html = html.replace('</body>',
            `<script>for(let t=200;t<=6000;t+=200)setTimeout(()=>{document.title=String(Math.ceil(document.body.scrollHeight))},t)</script></body>`);
        writeFileSync(pagePath, html);
        const url = `http://127.0.0.1:${PORT}/figtest/${name}/?static`;
        // pass 1: read the rendered content height from <title>
        const dom = execFileSync('chromium',
            ['--headless', '--no-sandbox', '--window-size=760,1200', '--virtual-time-budget=6000', '--dump-dom', url],
            { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
        const h = Math.min(4000, Math.max(300, parseInt((dom.match(/<title>(\d+)<\/title>/) || [])[1] || '1000', 10) + 16));
        // pass 2: screenshot at exactly that height (no dead whitespace)
        execFileSync('chromium', [
            '--headless', '--no-sandbox', '--hide-scrollbars',
            '--force-device-scale-factor=2', `--window-size=760,${h}`,
            '--virtual-time-budget=6000',
            `--screenshot=${join(OUT_DIR, name + '.png')}`, url,
        ], { stdio: 'ignore' });
        console.log(`  ✓ ${name}.png (${h}px)`);
    }
} finally {
    server.kill();
    rmSync(BUILD_DIR, { recursive: true, force: true });
}
console.log(`\nWrote ${names.length} gallery PNG(s) to ${OUT_DIR}/`);
