#!/usr/bin/env node
// Prerender the live D3 figures to committed seed SVGs (nojs / no-flash).
// Run:  npm run prerender
//
// LOCAL-ONLY (needs chromium; never runs in CI). Builds the real site with a
// capture hook (CAPTURE=1), serves it locally, and for each topic page loads it
// headlessly with ?static so every figure renders at its true on-page width.
// The hook stamps each diagram svg with a viewBox + its container id; we capture
// each (keyed by id, identical on the production pages) into
// src/esbd/prerendered/<id>.svg. Capturing from the real pages — not a fixed-
// width harness — is what keeps the seed at native scale (no scrunching).
//
// Freshness: one global source hash over all includes + engine. Any figure or
// engine edit stales every seed; regen is ~30s and the guard in check.mjs flags
// it. Coarse but simple, and it needs no container->include map.
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createHash } from 'node:crypto';
import http from 'node:http';

const INCLUDE_DIR = 'src/_includes/esbd-diagrams';
const ENGINE_DIR = 'src/esbd/js';
const OUT_DIR = 'src/esbd/prerendered';
const BUILD_DIR = '/tmp/esbd_prerender_site';
const PORT = 8123;
const BUDGET_MS = 10000;

const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// one global hash over every diagram include + all engine JS (option (b),
// extended to includes): any change stales all seeds. Regen is cheap (~30s).
const sourceHash = sha256(
    [
        ...readdirSync(INCLUDE_DIR).filter((f) => f.endsWith('.njk')).sort()
            .map((f) => readFileSync(join(INCLUDE_DIR, f), 'utf8')),
        ...readdirSync(ENGINE_DIR).filter((f) => f.endsWith('.js')).sort()
            .map((f) => readFileSync(join(ENGINE_DIR, f), 'utf8')),
    ].join('\n')
);

// namespace ids so multiple seed SVGs on one page can't collide on shared
// clip/gradient/marker ids
function postprocess(svg, id) {
    const pfx = id + '-';
    svg = svg.replace(/\bid="([^"]*)"/g, (_, x) => `id="${pfx}${x}"`);
    svg = svg.replace(/\b(xlink:href|href)="#([^"]*)"/g, (_, a, x) => `${a}="#${pfx}${x}"`);
    svg = svg.replace(/\burl\(#([^)]*)\)/g, (_, x) => `url(#${pfx}${x})`);
    return svg;
}

// balanced <svg>…</svg> slice (handles KaTeX inline svgs)
function sliceSvg(html, start) {
    let pos = start + 4, depth = 1;
    while (depth > 0) {
        const o = html.indexOf('<svg', pos), c = html.indexOf('</svg>', pos);
        if (c === -1) return null;
        if (o !== -1 && o < c) { depth++; pos = o + 4; }
        else { depth--; pos = c + 6; if (depth === 0) return html.slice(start, c + 6); }
    }
}

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

// every built page that loads the diagram engine (i.e. has figures), by URL path
function figurePageUrls() {
    const urls = [];
    const walk = (dir) => {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
            const p = join(dir, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name === 'index.html' && readFileSync(p, 'utf8').includes('/esbd/js/'))
                urls.push('/' + p.slice(BUILD_DIR.length + 1).replace(/index\.html$/, ''));
        }
    };
    walk(BUILD_DIR);
    return urls.sort();
}

// --------------------------------------------------------------------------
console.log('Building site with capture hook (CAPTURE=1)…');
execFileSync('npx', ['@11ty/eleventy', `--output=${BUILD_DIR}`], {
    env: { ...process.env, CAPTURE: '1' },
    stdio: 'ignore',
});

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], {
    cwd: BUILD_DIR,
    stdio: 'ignore',
});

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const ids = [];
try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);
    await sleep(300);
    for (const path of figurePageUrls()) {
        const html = execFileSync(
            'chromium',
            ['--headless', '--no-sandbox', '--window-size=1400,2400',
             `--virtual-time-budget=${BUDGET_MS}`, '--dump-dom', `http://127.0.0.1:${PORT}${path}?static`],
            { encoding: 'utf8', maxBuffer: 96 * 1024 * 1024 }
        );
        const containers = extractContainers(html);
        for (const { id, svg } of containers) {
            writeFileSync(join(OUT_DIR, id + '.svg'), postprocess(svg, id).trim() + '\n');
            ids.push(id);
        }
        if (containers.length) console.log(`  ✓ ${path} (${containers.length})`);
    }
} finally {
    server.kill();
    rmSync(BUILD_DIR, { recursive: true, force: true });
}

const uniqueIds = [...new Set(ids)].sort();
writeFileSync(
    join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ hash: sourceHash, ids: uniqueIds }, null, 2) + '\n'
);
console.log(`\nCaptured ${uniqueIds.length} seed SVG(s) across figure pages.`);
