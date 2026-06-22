#!/usr/bin/env node
// Scaffold a new diagram include with the house conventions.
//   npm run newfig esbd-my-figure
// Creates src/_includes/esbd-diagrams/<name>.njk and prints the markdown
// snippet to drop into a topic page (the .md owns the <figure> + caption).
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';

const name = process.argv[2];
if (!name || name.startsWith('-')) {
    console.error('usage: npm run newfig <name>      (e.g. esbd-my-figure)');
    process.exit(1);
}
const dir = 'src/_includes/esbd-diagrams';
const path = `${dir}/${name}.njk`;
if (existsSync(path)) {
    console.error(`✗ ${path} already exists.`);
    process.exit(1);
}
mkdirSync(dir, { recursive: true });

// NB: keep the markup blank-line-free / column-0 — markdown-it sees this once
// it's wrapped in the page's <figure>. Sliders use the controls macro (which is
// whitespace-controlled); a parent grid is shown commented out below.
const tpl = `{% set idprefix = "${name}" %}
{# {% import "macros/controls.njk" as controls %}  ← uncomment for sliders #}
<div class="bd-container" id="{{idprefix}}-plot" style="height: 240px; width: 100%"></div>
{#
<div id="{{idprefix}}-sliders" style="display: grid; grid-template-columns: max-content minmax(0, 200px); gap: 0.35em 0.7em; align-items: center; justify-content: center; margin-top: 0.6em">
    {{ controls.slider(idprefix + "-x", "Label", { min: 0, max: 1, step: "any", value: 0.5, snap: 0, inline: true }) }}
</div>
#}

<script type="module">
    import ElectrochemicalSpeciesBandDiagram from '{{ esbdJsPath }}ElectrochemicalSpeciesBandDiagram.js';
    import { SPECIES, REGION } from '{{ esbdJsPath }}figureDefs.js';
    // import { makeSlider } from '{{ esbdJsPath }}utils.js';

    const esbd = new ElectrochemicalSpeciesBandDiagram('{{idprefix}}-plot', {
        electron: SPECIES.electron,
    });
    esbd.setSpatialLayout([0, 1], [{ ...REGION.solution, name: 'Region' }]);
    esbd.setVRange(-1, 1);

    function update() {
        esbd.updateTraceData([
            { id: 'e', speciesId: 'electron', curveType: 'voltage', x: [0, 1], y: [0, 0] },
        ]);
    }
    // ['x'].forEach((n) => makeSlider('{{idprefix}}-' + n, () => update(), { fire: false }));
    update();
</script>
`;
writeFileSync(path, tpl);
console.log(`✓ created ${path}`);
console.log(`
Add it to a topic .md (the markdown owns the <figure> + caption):

<figure class="demo-container" style="max-width: 360px">
{% include "esbd-diagrams/${name}.njk" %}
{% figcaption %}
…caption…
{% endfigcaption %}
</figure>

Preview it with:  FIGTEST=1 npx @11ty/eleventy --serve   →  /figtest/${name}/
`);
