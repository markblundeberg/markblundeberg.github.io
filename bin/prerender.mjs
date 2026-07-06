#!/usr/bin/env node
// Prerender the live D3 figures to committed seed SVGs (nojs / no-flash).
// Run:  npm run prerender          (all figures)
//       npm run prerender <name>…  (only these include names)
//
// LOCAL-ONLY (needs chromium; never runs in CI). For each diagram include it
// loads the FIGTEST page headlessly with ?static&capture, lets the figure
// render, and captures every bd-container's <svg> (keyed by the container id,
// which is identical on the real topic pages). Writes src/esbd/prerendered/
// <id>.svg plus a manifest of id -> source hash (include + engine). The 11ty
// transform injects these at build time; the guard in check.mjs re-hashes and
// fails on drift. The engine already clears bd-container on boot, so the seed
// is wiped and redrawn with zero JS change.
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createHash } from 'node:crypto';
import http from 'node:http';

const INCLUDE_DIR = 'src/_includes/esbd-diagrams';
const ENGINE_DIR = 'src/esbd/js';
const OUT_DIR = 'src/esbd/prerendered';
const BUILD_DIR = '/tmp/esbd_prerender_site';
const PORT = 8123;
const BUDGET_MS = 10000; // virtual-time budget: module load + KaTeX + render

const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// engine hash: all engine JS concatenated (option (b) — an engine edit stales
// every seed, which is honest; the guard then tells you exactly what to regen).
const engineHash = sha256(
    readdirSync(ENGINE_DIR)
        .filter((f) => f.endsWith('.js'))
        .sort()
        .map((f) => readFileSync(join(ENGINE_DIR, f), 'utf8'))
        .join('\n')
);

// namespace every id (and reference) so multiple seed SVGs on one topic page
// don't collide on shared clip/gradient/marker ids.
function postprocess(svg, id) {
    const pfx = id + '-';
    svg = svg.replace(/\bid="([^"]*)"/g, (_, x) => `id="${pfx}${x}"`);
    svg = svg.replace(/\b(xlink:href|href)="#([^"]*)"/g, (_, a, x) => `${a}="#${pfx}${x}"`);
    svg = svg.replace(/\burl\(#([^)]*)\)/g, (_, x) => `url(#${pfx}${x})`);
    return svg;
}

// balanced <svg>…</svg> slice starting at `start` (handles KaTeX inline svgs)
function sliceSvg(html, start) {
    let pos = start + 4, depth = 1;
    while (depth > 0) {
        const o = html.indexOf('<svg', pos), c = html.indexOf('</svg>', pos);
        if (c === -1) return null;
        if (o !== -1 && o < c) { depth++; pos = o + 4; }
        else { depth--; pos = c + 6; if (depth === 0) return html.slice(start, c + 6); }
    }
}

// pull every tagged diagram svg out of a dumped page. The capture hook tags each
// with data-container="<id>" (the container the engine drew into).
function extractContainers(html) {
    const out = [];
    const re = /<svg\b[^>]*\bdata-container="([^"]+)"[^>]*>/g;
    let m;
    while ((m = re.exec(html))) {
        const svg = sliceSvg(html, m.index);
        if (svg) out.push({ id: m[1], svg });
    }
    return out;
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

if (!names.length) {
    console.error('No matching include names.');
    process.exit(1);
}

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
let manifest = {};
try {
    manifest = JSON.parse(readFileSync(join(OUT_DIR, 'manifest.json'), 'utf8'));
} catch { /* first run */ }

let captured = 0;
try {
    await waitForServer(`http://127.0.0.1:${PORT}/figtest/`);
    await sleep(300);
    for (const name of names) {
        const url = `http://127.0.0.1:${PORT}/figtest/${name}/?static&capture`;
        const html = execFileSync(
            'chromium',
            ['--headless', '--no-sandbox', `--virtual-time-budget=${BUDGET_MS}`, '--dump-dom', url],
            { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
        );
        const containers = extractContainers(html);
        if (!containers.length) { console.warn(`  ⚠ ${name}: no rendered container captured`); continue; }
        const srcHash = sha256(readFileSync(join(INCLUDE_DIR, name + '.njk'), 'utf8') + engineHash);
        for (const { id, svg } of containers) {
            writeFileSync(join(OUT_DIR, id + '.svg'), postprocess(svg, id).trim() + '\n');
            manifest[id] = { include: name, hash: srcHash };
            captured++;
        }
        console.log(`  ✓ ${name} (${containers.length})`);
    }
} finally {
    server.kill();
    rmSync(BUILD_DIR, { recursive: true, force: true });
}

const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(sorted, null, 2) + '\n');
console.log(`\nCaptured ${captured} seed SVG(s) from ${names.length} figure(s).`);
