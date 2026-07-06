#!/usr/bin/env node
// Pre-flight checks for the ESBD site.  Run:  npm run check
//
// Builds the site, then verifies: no stale .html include refs, no orphaned
// (unused) diagram includes, no broken internal links, no KaTeX parse errors.
// Exits non-zero if anything fails.
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { runUnitTests } from './unit.mjs';
import { createHash } from 'node:crypto';

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

const OUT = '/tmp/esbd_check_build';
let failures = 0;
const section = (s) => console.log(`\n• ${s}`);
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
    console.error(`  ✗ ${m}`);
    failures++;
};

function walk(dir, out = []) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else out.push(p);
    }
    return out;
}
const sh = (cmd) => {
    try {
        return execSync(cmd, { encoding: 'utf8' });
    } catch (e) {
        return (e.stdout || '') + (e.stderr || '');
    }
};

// 0. Unit tests (pure utils; fast, no build required) -----------------------
failures += runUnitTests();

// 1. Build ------------------------------------------------------------------
section('build');
try {
    execSync(`rm -rf ${OUT}`, { stdio: 'ignore' });
    execSync(`npx @11ty/eleventy --output=${OUT}`, { stdio: 'pipe' });
    ok('eleventy build succeeded');
} catch (e) {
    bad('build FAILED:\n' + (e.stdout || '') + (e.stderr || ''));
    console.error('\nAborting: cannot run further checks without a build.');
    process.exit(1);
}
const htmlFiles = walk(OUT).filter((f) => f.endsWith('.html'));

// 2. Stale .html include refs ----------------------------------------------
section('include extensions');
const stale = sh(`grep -rn 'esbd-diagrams/[^"]*\\.html' src || true`).trim();
if (stale) bad('stale .html include refs (should be .njk):\n' + stale);
else ok('no stale .html include refs');

// 3. Orphaned diagram includes ---------------------------------------------
section('orphaned includes');
const incDir = 'src/_includes/esbd-diagrams';
const includes = readdirSync(incDir)
    .filter((f) => f.endsWith('.njk'))
    .map((f) => f.replace(/\.njk$/, ''));
const srcText = walk('src')
    .filter((f) => /\.(md|njk|html)$/.test(f) && !f.includes('figtest'))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');
const orphans = includes.filter(
    (n) => !srcText.includes(`esbd-diagrams/${n}.njk`)
);
if (orphans.length)
    bad(`unused includes (no {% include %} anywhere): ${orphans.join(', ')}`);
else ok('every include is used');

// 4. Broken internal links --------------------------------------------------
section('internal links');
const broken = new Set();
const assetRe = /\.(css|js|mjs|svg|png|jpe?g|gif|ico|pdf|webp|woff2?|map|txt|xml)$/i;
for (const f of htmlFiles) {
    const html = readFileSync(f, 'utf8');
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        let href = m[1];
        if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(href)) continue;
        href = href.split('#')[0].split('?')[0];
        if (!href || assetRe.test(href)) continue;
        const base = href.startsWith('/') ? join(OUT, href) : resolve(dirname(f), href);
        const candidates = [base, join(base, 'index.html'), base + '.html'];
        if (!candidates.some((c) => existsSync(c)))
            broken.add(`${f.replace(OUT, '')}  →  ${m[1]}`);
    }
}
if (broken.size)
    bad(`broken internal links (${broken.size}):\n    ` + [...broken].slice(0, 50).join('\n    '));
else ok('all internal links resolve');

// 5. KaTeX parse errors -----------------------------------------------------
section('KaTeX');
const katexErr = htmlFiles.filter((f) =>
    /katex-error|KaTeX parse error|ParseError/.test(readFileSync(f, 'utf8'))
);
if (katexErr.length)
    bad('KaTeX parse errors in: ' + katexErr.map((f) => f.replace(OUT, '')).join(', '));
else ok('no KaTeX parse errors');

// 6. Circuit figure freshness (committed SVGs vs source .tex) ---------------
// Pure text: re-hash source + committed SVG, compare to manifest. No LaTeX/
// browser, so it runs in CI. Rendering (npm run circuits) is local-only.
section('circuit figures');
{
    const cdir = 'figures-src/circuit';
    const odir = 'src/_includes/circuit';
    const manPath = join(cdir, 'manifest.json');
    if (!existsSync(manPath)) {
        bad('circuit manifest.json missing (run: npm run circuits)');
    } else {
        const man = JSON.parse(readFileSync(manPath, 'utf8'));
        const texs = readdirSync(cdir)
            .filter((f) => f.endsWith('.tex'))
            .map((f) => f.replace(/\.tex$/, ''));
        const drift = [];
        for (const name of texs) {
            const rec = man[name];
            if (!rec) {
                drift.push(`${name}: no manifest entry`);
                continue;
            }
            if (sha256(readFileSync(join(cdir, name + '.tex'), 'utf8')) !== rec.tex)
                drift.push(`${name}.tex changed since last render`);
            const svgPath = join(odir, name + '.svg');
            if (!existsSync(svgPath)) {
                drift.push(`${name}.svg missing`);
                continue;
            }
            if (sha256(readFileSync(svgPath, 'utf8')) !== rec.svg)
                drift.push(`${name}.svg edited/corrupted since render`);
        }
        for (const name of Object.keys(man))
            if (!texs.includes(name))
                drift.push(`${name}: manifest entry has no source .tex`);
        if (drift.length)
            bad('circuit figures stale (run: npm run circuits):\n    ' + drift.join('\n    '));
        else ok(`all ${texs.length} circuit figures fresh`);
    }
}

// ---------------------------------------------------------------------------
console.log(
    failures ? `\n✗ ${failures} check(s) FAILED.` : '\n✓ All checks passed.'
);
process.exit(failures ? 1 : 0);
