#!/usr/bin/env node
// Flag AI-tells in ADDED prose lines, per completion-plan/VOICE.md.
//   npm run voicelint            # working tree vs HEAD
//   npm run voicelint -- HEAD~3  # last 3 commits
//   npm run voicelint -- main..HEAD
// Checks em-dash overuse, "not only/just X but Y" essayslop, and a few flagged
// casual idioms. Heuristic + advisory; exits non-zero if it finds anything.
import { execSync } from 'node:child_process';

const range = process.argv.slice(2).join(' ') || 'HEAD';
let diff;
try {
    diff = execSync(`git diff ${range} -- '*.md' '*.njk'`, { encoding: 'utf8' });
} catch (e) {
    console.error('git diff failed: ' + e.message);
    process.exit(2);
}

// VOICE.md tells. Each: [label, test(lowercasedLine) -> match|null].
const IDIOMS = [
    'watch it happen',
    'watch it break',
    'watch what happens',
    'never budges',
    'books balance',
    'in different costumes',
    'hold that thought',
];
const checks = [
    {
        label: 'em-dash',
        find: (line) => (line.match(/—|&mdash;/g) || []).length,
    },
    {
        label: '"not just/only … but" essayslop',
        find: (line) =>
            /\bnot (only|just|merely|simply)\b/i.test(line) ||
            /\b(,|but) rather\b/i.test(line)
                ? 1
                : 0,
    },
    {
        label: 'casual idiom',
        find: (line) => IDIOMS.some((p) => line.toLowerCase().includes(p)) ? 1 : 0,
    },
];

let file = '(unknown)';
const findings = [];
for (const raw of diff.split('\n')) {
    if (raw.startsWith('+++ b/')) {
        file = raw.slice(6);
        continue;
    }
    if (!raw.startsWith('+') || raw.startsWith('+++')) continue;
    const line = raw.slice(1);
    for (const c of checks) {
        const n = c.find(line);
        if (n) findings.push({ file, label: c.label, n, line: line.trim() });
    }
}

if (!findings.length) {
    console.log('✓ voicelint: no flagged tells in added lines.');
    process.exit(0);
}
const emTotal = findings
    .filter((f) => f.label === 'em-dash')
    .reduce((s, f) => s + f.n, 0);
console.log(`voicelint findings (range: ${range}):\n`);
let cur = '';
for (const f of findings) {
    if (f.file !== cur) {
        cur = f.file;
        console.log(`  ${cur}`);
    }
    const tag = f.label === 'em-dash' ? `em-dash ×${f.n}` : f.label;
    const snip = f.line.length > 110 ? f.line.slice(0, 110) + '…' : f.line;
    console.log(`    [${tag}] ${snip}`);
}
console.log(
    `\n${findings.length} flagged line(s); ${emTotal} em-dash(es) added. These are advisory — review against VOICE.md.`
);
process.exit(1);
