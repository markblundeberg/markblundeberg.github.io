#!/usr/bin/env node
// Execute the committed companion notebooks (notebooks/*.ipynb) in place and
// stamp a freshness manifest. Run:  npm run notebooks
//
// LOCAL-ONLY (needs python3; never runs in CI). The site build renders the
// *committed, executed* notebooks with the `notebook` shortcode in .eleventy.js,
// so deploys stay Python-free and deterministic — this script is how the
// committed outputs get (re)generated, seeds-style. It manages its own venv in
// .cache/nbvenv (first run downloads pybamm etc., ~1 min; later runs reuse it).
//
// Determinism: matplotlib SVG ids are stabilized by svg.hashsalt in the
// notebooks themselves; the one leftover wobble is the <dc:date> stamp inside
// inline SVG outputs, which we strip here after execution.
//
// Freshness: notebooks/manifest.json records a hash of each notebook's code
// cells at execution time. The guard in bin/check.mjs recomputes and compares,
// so an edited-but-not-rerun notebook fails the checks.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const NB_DIR = 'notebooks';
const VENV = '.cache/nbvenv';
const REQS = 'bin/notebook-requirements.txt';

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

export function notebookCodeHash(nbPath) {
    const nb = JSON.parse(readFileSync(nbPath, 'utf8'));
    const code = nb.cells.filter((c) => c.cell_type === 'code').map((c) => c.source.join(''));
    return sha256(JSON.stringify(code));
}

// --------------------------------------------------------------------------
// only run the pipeline when invoked directly (check.mjs imports the hash fn)
if (process.argv[1] && process.argv[1].endsWith('notebooks.mjs')) {
    // 1. venv, provisioned once per requirements change
    const reqs = readFileSync(REQS, 'utf8');
    const stampFile = join(VENV, '.reqs-stamp');
    const stamp = sha256(reqs);
    if (!existsSync(stampFile) || readFileSync(stampFile, 'utf8') !== stamp) {
        console.log(`Provisioning ${VENV} (pybamm + nbconvert; first run takes a minute)…`);
        execFileSync('python3', ['-m', 'venv', VENV], { stdio: 'inherit' });
        execFileSync(join(VENV, 'bin/pip'), ['install', '-q', '-r', REQS], { stdio: 'inherit' });
        writeFileSync(stampFile, stamp);
    }

    // 2. execute each notebook in place (cwd = notebooks/, so the in-repo
    //    figure-save paths like ../src/esbd/img resolve)
    const files = readdirSync(NB_DIR).filter((f) => f.endsWith('.ipynb')).sort();
    const manifest = {};
    for (const f of files) {
        console.log(`Executing ${f}…`);
        execFileSync(
            join('..', VENV, 'bin/jupyter-nbconvert'),
            ['--to', 'notebook', '--execute', '--inplace',
             '--ExecutePreprocessor.timeout=900', f],
            { cwd: NB_DIR, stdio: 'inherit' }
        );
        // 3. strip the <dc:date> stamps from inline SVG outputs
        const p = join(NB_DIR, f);
        const nb = JSON.parse(readFileSync(p, 'utf8'));
        for (const cell of nb.cells) {
            for (const out of cell.outputs || []) {
                const svg = out.data?.['image/svg+xml'];
                if (svg) {
                    out.data['image/svg+xml'] = svg
                        .join('')
                        .replace(/<dc:date>[^<]*<\/dc:date>/g, '<dc:date></dc:date>')
                        .split(/(?<=\n)/);
                }
            }
        }
        writeFileSync(p, JSON.stringify(nb, null, 1) + '\n');
        manifest[f] = { codeHash: notebookCodeHash(p) };
        console.log(`  ✓ ${f}`);
    }

    writeFileSync(join(NB_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    console.log(`\nExecuted ${files.length} notebook(s); manifest updated.`);
}
