#!/usr/bin/env node
// spellvariants.mjs — find inconsistent spellings across the book's prose.
//
// Reports three kinds of clash, each only when BOTH variants actually occur:
//   1. hyphenation:   extra-thermodynamic vs extrathermodynamic
//   2. spaced compounds: "band gap" vs "bandgap" / "band-gap"
//   3. British/American pairs: ionise/ionize, colour/color, modelled/modeled, ...
// Also dumps the full vocabulary with --vocab (one word per line, freq-sorted)
// for eyeball scans.
//
// Usage: node bin/spellvariants.mjs [--vocab]

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/esbd', 'src/_includes'];

function mdFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return mdFiles(p);
    return e.name.endsWith('.md') ? [p] : [];
  });
}

// Strip everything that isn't prose: frontmatter, code, math, templating, HTML, URLs.
function stripToProse(text) {
  return text
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/{%[\s\S]*?%}/g, ' ')
    .replace(/{{[\s\S]*?}}/g, ' ')
    .replace(/<[^>\n]*>/g, ' ')
    .replace(/\]\([^)\n]*\)/g, '] ') // link targets
    .replace(/https?:\/\/\S+/g, ' ');
}

// word -> { count, files: Map<file, count>, forms: Set<original casing> }
const vocab = new Map();
const bigrams = new Set(); // lowercased "a b" pairs seen adjacent in prose

for (const root of ROOTS) {
  for (const file of mdFiles(root)) {
    const prose = stripToProse(readFileSync(file, 'utf8'));
    const words = prose.match(/[A-Za-z][A-Za-z'-]*[A-Za-z]|[A-Za-z]/g) ?? [];
    let prev = null;
    for (const w of words) {
      const key = w.toLowerCase();
      let entry = vocab.get(key);
      if (!entry) vocab.set(key, (entry = { count: 0, files: new Map(), forms: new Set() }));
      entry.count++;
      entry.files.set(file, (entry.files.get(file) ?? 0) + 1);
      entry.forms.add(w);
      if (prev) bigrams.add(`${prev} ${key}`);
      prev = key;
    }
  }
}

function where(word) {
  const e = vocab.get(word);
  return [...e.files].map(([f, n]) => `${f.replace('src/', '')}×${n}`).join(', ');
}

const clashes = [];

// 1. hyphenation: same letters, different hyphens
const byDehyphen = new Map();
for (const word of vocab.keys()) {
  const key = word.replace(/-/g, '');
  if (!byDehyphen.has(key)) byDehyphen.set(key, []);
  byDehyphen.get(key).push(word);
}
for (const group of byDehyphen.values()) {
  if (group.length > 1) clashes.push({ kind: 'hyphenation', group });
}

// 2. spaced compound vs solid word ("band gap" vs "bandgap").
// Spaced-vs-HYPHENATED is deliberately not flagged by default: "standard-state
// ladder" next to "the standard state" is correct attributive hyphenation, not
// a clash. Opt in with --compounds to eyeball those too.
const STOP = new Set(['not', 'every', 'far', 'cut', 'out', 'off', 'per', 'two', 'well', 'long', 'no', 'an', 'the', 'own']);
const wantHyphenCompounds = process.argv.includes('--compounds');
for (const bg of bigrams) {
  const [a, b] = bg.split(' ');
  if (a.length < 3 || b.length < 3 || STOP.has(a) || STOP.has(b)) continue;
  const forms = wantHyphenCompounds ? [a + b, `${a}-${b}`] : [a + b];
  for (const joined of forms) {
    if (vocab.has(joined)) {
      clashes.push({ kind: 'compound', group: [`${a} ${b}`, joined], bigram: bg });
    }
  }
}

// 3. British/American: normalize via suffix rules; clash only if both forms exist
// Suffix rules carry minimum-stem guards so short common words don't alias
// (our/or, four/for, filled/filed, rise/rize). Both variants must occur anyway.
function americanize(w) {
  let x = w;
  x = x.replace(/isation\b/, 'ization').replace(/ising\b/, 'izing').replace(/(..)ise\b/, '$1ize').replace(/(..)ised\b/, '$1ized').replace(/(..)iser\b/, '$1izer');
  x = x.replace(/(..)yse\b/, '$1yze').replace(/(..)ysed\b/, '$1yzed').replace(/(..)ysing\b/, '$1yzing');
  x = x.replace(/(..)our\b/, '$1or').replace(/(..)ours\b/, '$1ors').replace(/(..)ourly\b/, '$1orly');
  x = x.replace(/(t|b|it|et)re\b/, '$1er').replace(/(t|b|it|et)res\b/, '$1ers'); // centre, fibre, litre, metre
  x = x.replace(/(...)lled\b/, '$1led').replace(/(...)lling\b/, '$1ling').replace(/(...)ller\b/, '$1ler').replace(/(...)llers\b/, '$1lers');
  x = x.replace(/ogue\b/, 'og').replace(/ogues\b/, 'ogs');
  if (x.length >= 6) x = x.replace(/ae/g, 'e').replace(/oe/g, 'e');
  x = x.replace(/sulph/g, 'sulf').replace(/grey/g, 'gray').replace(/aluminium/g, 'aluminum');
  return x;
}
// Words that only ever appear capitalized are proper nouns (names, titles) —
// their spelling isn't ours to standardize.
function properNoun(word) {
  return [...vocab.get(word).forms].every((f) => /^[A-Z]/.test(f));
}
const byAmerican = new Map();
for (const word of vocab.keys()) {
  if (properNoun(word)) continue;
  const key = americanize(word);
  if (!byAmerican.has(key)) byAmerican.set(key, []);
  byAmerican.get(key).push(word);
}
for (const group of byAmerican.values()) {
  if (group.length > 1) clashes.push({ kind: 'BrE/AmE', group });
}

// report
let bad = 0;
const seen = new Set();
for (const { kind, group } of clashes) {
  const id = group.slice().sort().join('|');
  if (seen.has(id)) continue;
  seen.add(id);
  bad++;
  console.log(`[${kind}]`);
  for (const w of group) {
    if (vocab.has(w)) console.log(`  ${w} (${vocab.get(w).count}): ${where(w)}`);
    else console.log(`  "${w}" (as adjacent words)`);
  }
  console.log();
}

if (process.argv.includes('--vocab')) {
  const sorted = [...vocab.entries()].sort((a, b) => b[1].count - a[1].count);
  for (const [w, e] of sorted) console.log(`${String(e.count).padStart(5)}  ${w}`);
} else {
  console.log(bad ? `${bad} spelling clash(es) found.` : 'No spelling clashes found.');
  process.exitCode = bad ? 1 : 0;
}
