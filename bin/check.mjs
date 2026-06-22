#!/usr/bin/env node
// Pre-flight checks for the ESBD site.  Run:  npm run check
//
// Builds the site, then verifies: no stale .html include refs, no orphaned
// (unused) diagram includes, no broken internal links, no KaTeX parse errors.
// Exits non-zero if anything fails.
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

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

// ---------------------------------------------------------------------------
console.log(
    failures ? `\n✗ ${failures} check(s) FAILED.` : '\n✓ All checks passed.'
);
process.exit(failures ? 1 : 0);
