#!/usr/bin/env node
// Unit tests for the pure numeric/util seam of src/esbd/js/utils.js.
// Run:  npm run unit    (also invoked by npm run check)
//
// These pin down the hand-rolled bits d3 can't do for us — chiefly bandScale
// (whose whole reason to exist is the single-band / pixel-minimum padding
// behavior d3.scaleBand silently botches) and interpAtFrac (the shared trace-
// anchor helper extracted in the DRY pass). Expected values were derived
// analytically and confirmed against the implementation.
import { pathToFileURL } from 'node:url';
import {
    bandScale,
    interpAtFrac,
    rejectUnexpectedFields,
    linspace,
} from '../src/esbd/js/utils.js';

let failures = 0;
const section = (s) => console.log(`\n• ${s}`);
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
    console.error(`  ✗ ${m}`);
    failures++;
};

const EPS = 1e-9;
const near = (a, b) => a != null && Math.abs(a - b) <= EPS;
const assert = (name, cond) => (cond ? ok(name) : bad(name));
const assertNear = (name, got, want) =>
    near(got, want)
        ? ok(`${name} = ${want}`)
        : bad(`${name}: expected ${want}, got ${got}`);
const assertThrows = (name, fn) => {
    try {
        fn();
        bad(`${name}: expected throw, none thrown`);
    } catch {
        ok(name);
    }
};

export function runUnitTests() {
    failures = 0;

    // bandScale --------------------------------------------------------------
    section('bandScale');
    // Its raison d'être: a single band with paddingOuter 0 fills the whole
    // range, its edge exactly on the margin (d3.scaleBand can't — it drops
    // paddingOuter when n = 1).
    {
        const s = bandScale()
            .domain(['a'])
            .range([0, 100])
            .paddingInner(1)
            .paddingOuter(0);
        assertNear('single band, pOut=0 → bandwidth', s.bandwidth(), 100);
        assertNear('single band, pOut=0 → pos', s('a'), 0);
    }
    {
        const s = bandScale().domain(['a']).range([0, 100]).paddingOuter(0.5);
        assertNear('single band, pOut=0.5 → bandwidth', s.bandwidth(), 50);
        assertNear('single band, pOut=0.5 → pos (inset)', s('a'), 25);
    }
    {
        const s = bandScale()
            .domain(['a', 'b'])
            .range([0, 90])
            .paddingInner(1)
            .paddingOuter(0);
        assertNear('two bands, pIn=1 → bandwidth', s.bandwidth(), 30);
        assertNear('two bands → first pos', s('a'), 0);
        assertNear('two bands → second pos', s('b'), 60);
    }
    // Pixel-minimum outer padding: "always exactly 60px of label room on the
    // left", independent of bandwidth — the honest version of the old align hack.
    {
        const s = bandScale()
            .domain(['a'])
            .range([0, 100])
            .paddingOuter(0)
            .minPaddingOuter({ left: 60, right: 0 });
        assertNear('px-min outer L=60 → bandwidth', s.bandwidth(), 40);
        assertNear('px-min outer L=60 → pos', s('a'), 60);
    }
    // Degenerate: container smaller than the fixed pixel minimums → keep a 1px
    // sliver rather than going negative, and STILL honour the left label room.
    {
        const s = bandScale()
            .domain(['a'])
            .range([0, 100])
            .paddingOuter(0)
            .minPaddingOuter({ left: 60, right: 60 });
        assertNear('degenerate (mins > range) → sliver bandwidth', s.bandwidth(), 1);
        assertNear('degenerate → left room preserved', s('a'), 60);
    }
    // copy() reproduces geometry.
    {
        const o = bandScale()
            .domain(['a', 'b'])
            .range([0, 90])
            .paddingInner(1)
            .paddingOuter(0);
        const c = o.copy();
        assert(
            'copy() reproduces bandwidth + positions',
            c.bandwidth() === o.bandwidth() &&
                c('a') === o('a') &&
                c('b') === o('b')
        );
    }
    // empty domain is safe.
    {
        const s = bandScale().domain([]).range([0, 100]);
        assert(
            'empty domain → bandwidth 0, undefined lookup',
            s.bandwidth() === 0 && s('x') === undefined
        );
    }

    // interpAtFrac -----------------------------------------------------------
    section('interpAtFrac');
    assert('empty polyline → null', interpAtFrac([], [], 0.5) === null);
    {
        const p = interpAtFrac([3], [7], 0.5);
        assert('single point → that point', p.x === 3 && p.y === 7);
    }
    {
        const xs = [0, 1],
            ys = [0, 10];
        assert('frac 0 → start', near(interpAtFrac(xs, ys, 0).y, 0));
        assert('frac 0.5 → midpoint', near(interpAtFrac(xs, ys, 0.5).y, 5));
        assert('frac 1 → end', near(interpAtFrac(xs, ys, 1).y, 10));
    }
    {
        // duplicate x (vertical segment): must stay finite, not divide-by-zero
        const p = interpAtFrac([0, 0.5, 0.5, 1], [1, 2, 5, 6], 0.5);
        assert('vertical-segment seam stays finite', Number.isFinite(p.y));
    }
    {
        // fraction is of the x-EXTENT, not the index: tx = 0.5*10 = 5, which
        // falls in the (1,100)-(10,1000) segment → y = 100 + (4/9)*900.
        const p = interpAtFrac([0, 1, 10], [0, 100, 1000], 0.5);
        assertNear('non-uniform x uses x-extent', p.y, 100 + (4 / 9) * 900);
    }

    // rejectUnexpectedFields -------------------------------------------------
    section('rejectUnexpectedFields');
    assertThrows('throws on extra keys', () =>
        rejectUnexpectedFields({ bogus: 1 })
    );
    {
        let threw = false;
        try {
            rejectUnexpectedFields({});
        } catch {
            threw = true;
        }
        assert('no-op on empty object', !threw);
    }

    // linspace (quick sanity) ------------------------------------------------
    section('linspace');
    {
        const a = linspace(0, 1, 5);
        assert(
            'endpoints + count + midpoint',
            a.length === 5 && a[0] === 0 && near(a[4], 1) && near(a[2], 0.5)
        );
    }
    {
        const a = linspace(2, 9, 1);
        assert('n=1 → [start]', a.length === 1 && a[0] === 2);
    }

    // ------------------------------------------------------------------------
    console.log(
        failures
            ? `\n✗ ${failures} unit test(s) FAILED.`
            : '\n✓ All unit tests passed.'
    );
    return failures;
}

// Standalone entry: node bin/unit.mjs  (robust to relative argv + spaces in path)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    process.exit(runUnitTests() ? 1 : 0);
}
