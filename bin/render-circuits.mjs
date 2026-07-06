#!/usr/bin/env node
// Render the circuitikz figures to committed SVGs.  Run:  npm run circuits
//
// LOCAL-ONLY (needs pdflatex + dvisvgm; never runs in CI).  For each
// figures-src/circuit/<name>.tex:  pdflatex -> dvisvgm --pdf --no-fonts ->
// recolor to currentColor + make responsive -> write src/_includes/circuit/
// <name>.svg, and record source+output hashes in manifest.json.  The freshness
// guard in check.mjs re-hashes these (pure text, no LaTeX) and fails on drift.
import { execFileSync } from 'node:child_process';
import {
    readFileSync,
    writeFileSync,
    readdirSync,
    mkdtempSync,
    mkdirSync,
    rmSync,
    copyFileSync,
} from 'node:fs';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const SRC_DIR = 'figures-src/circuit';
const OUT_DIR = 'src/_includes/circuit';
const MANIFEST = join(SRC_DIR, 'manifest.json');

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

// Recolor + responsive-size the dvisvgm output so the figure follows the
// page's text color (dark-mode-safe) and scales to its container.  `name`
// namespaces every element id: dvisvgm reuses glyph ids (g0-1, g1-2, ...)
// across files, so without this the four inlined SVGs collide on one page and
// each figure's <use> grabs the first figure's glyphs.
function postprocess(svg, name) {
    const pfx = name + '-';
    // strip XML prolog + generator comment (we inline this into HTML)
    svg = svg
        .replace(/<\?xml[^>]*\?>\s*/, '')
        .replace(/<!--[^>]*-->\s*/g, '');
    // namespace ids and every reference to them (defs/use, clip-paths)
    svg = svg.replace(/\bid='([^']*)'/g, (_, id) => `id='${pfx}${id}'`);
    svg = svg.replace(
        /\b(xlink:href|href)='#([^']*)'/g,
        (_, attr, id) => `${attr}='#${pfx}${id}'`
    );
    svg = svg.replace(/\burl\(#([^)]*)\)/g, (_, id) => `url(#${pfx}${id})`);
    // strokes: black -> currentColor
    svg = svg.replace(/stroke='#000'/g, "stroke='currentColor'");
    // root <svg>: drop fixed width/height, inherit text color for fills,
    // tag with a class + role, keep the viewBox for aspect ratio.
    svg = svg.replace(/<svg\b[^>]*>/, (tag) => {
        const viewBox = (tag.match(/viewBox='[^']*'/) || [])[0] || '';
        return (
            `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' ` +
            `xmlns:xlink='http://www.w3.org/1999/xlink' ${viewBox} ` +
            `class='circuit-svg' role='img' fill='currentColor'>`
        );
    });
    return svg.trim() + '\n';
}

function render(texPath, workDir) {
    const name = basename(texPath, '.tex');
    copyFileSync(texPath, join(workDir, name + '.tex'));
    const run = (cmd, args) =>
        execFileSync(cmd, args, { cwd: workDir, stdio: 'pipe' });
    run('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', name + '.tex']);
    run('dvisvgm', ['--pdf', '--no-fonts', '--output=' + name + '.svg', name + '.pdf']);
    return postprocess(readFileSync(join(workDir, name + '.svg'), 'utf8'), name);
}

// ---------------------------------------------------------------------------
const only = process.argv[2]; // optional: render a single figure by name
const texFiles = readdirSync(SRC_DIR)
    .filter((f) => f.endsWith('.tex'))
    .filter((f) => !only || f === only + '.tex')
    .sort();

if (!texFiles.length) {
    console.error(`No .tex files in ${SRC_DIR}` + (only ? ` matching "${only}"` : ''));
    process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
const workDir = mkdtempSync(join(tmpdir(), 'esbd-circuits-'));
let manifest = {};
try {
    manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
} catch {
    /* first run */
}

try {
    for (const f of texFiles) {
        const name = basename(f, '.tex');
        const texSrc = readFileSync(join(SRC_DIR, f), 'utf8');
        const svg = render(join(SRC_DIR, f), workDir);
        writeFileSync(join(OUT_DIR, name + '.svg'), svg);
        manifest[name] = { tex: sha256(texSrc), svg: sha256(svg) };
        console.log(`  ✓ ${name}.svg`);
    }
} finally {
    rmSync(workDir, { recursive: true, force: true });
}

// keep manifest sorted + stable
const sorted = Object.fromEntries(
    Object.keys(manifest).sort().map((k) => [k, manifest[k]])
);
writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
console.log(`\nWrote ${texFiles.length} figure(s) + manifest.`);
