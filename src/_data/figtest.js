// Powers the figure-preview gallery (src/figtest.njk + src/figtest-index.njk).
// Returns the list of diagram-include names — but ONLY when FIGTEST=1, so the
// preview pages are never emitted in a normal/production build.
//
//   FIGTEST=1 npx @11ty/eleventy --serve   →  http://localhost:8080/figtest/
//
import { readdirSync } from 'node:fs';

export default function () {
    if (!process.env.FIGTEST) return [];
    return readdirSync('src/_includes/esbd-diagrams')
        .filter((f) => f.endsWith('.njk'))
        .map((f) => f.replace(/\.njk$/, ''))
        .sort();
}
