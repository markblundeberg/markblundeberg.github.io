# AGENTS.md — Mark Lundeberg's site + ESBD web book (really just ESBD for now)

Eleventy (11ty v3, ESM) static site. Markdown topics in `src/esbd/*.md` are run
through **Nunjucks first** (includes/macros), then **markdown-it**. Interactive
D3 figures are includes in `src/_includes/esbd-diagrams/*.njk`; their components
live in `src/esbd/js/` (`ResponsivePlot` → `BandDiagram` / `EnergyLevelsDiagram`
/ `XYPlot` → the `ElectrochemicalSpeciesBandDiagram` wrapper; shared
`figureDefs.js`, `utils.js`, and the `controls.njk` slider/checkbox macros).
Use `XYPlot` for any non-spatial x axis (charge-vs-offset, I–V, Q–V…) — don't
abuse `BandDiagram`'s spatial regions for that.

## Commands (npm scripts)
- `npm run build` / `npm run serve` — build / dev server.
- `npm run check` (also `npm test`) — build + verify: no stale `.html` include
  refs, no orphaned includes, no broken internal links, no KaTeX errors.
  **Run before committing.**
- `npm run fig` — `FIGTEST=1` serve → a `/figtest/` gallery and a
  `/figtest/<include-name>/` preview per figure (gated out of normal builds).
- `npm run newfig <name>` — scaffold a new diagram include.
- `npm run voicelint [git-range]` — flag AI-tells in added prose (advisory).

## Screenshotting figures (deterministic)
Do NOT screenshot against `eleventy --serve` (hot-reload mangles D3). Do:
1. clean build → `npx @11ty/eleventy --output=/tmp/build`
2. static server (from the build dir) → `python3 -m http.server 8099 --bind 127.0.0.1`
3. headless capture **with `?static`**:
   `chromium --headless --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --screenshot=/tmp/s.png --window-size=W,H --virtual-time-budget=8000 "http://127.0.0.1:8099/esbd/<page>/?static"`

`?static` makes rendering fully deterministic (2026-07-02): transitions apply
synchronously, fade-ins are skipped (no opacity-0 birth state), and the figure
re-measures itself at load/fonts-ready — identical bytes across repeat shots.
(The old "blank labels at scale 2" gotcha was this raciness; it's fixed.)
Keep images < 2000px (the Read limit). For a single figure in isolation, use
the `/figtest/<name>/?static` gallery page. Append `&debug` to tint the
plot area lightpink (visualizes margins/padding instantly).
**Gotcha:** headless chromium clamps the window to a ~500px minimum and CROPS
the screenshot — `--window-size=340,...` does NOT give a narrow viewport. To
test true narrow layouts, load the page in a fixed-width `<iframe>` harness
and screenshot that.

## Figure conventions
- **An include emits ONLY the figure mechanism** (the `bd-container` div, any
  slider divs, the `<script>`). The **markdown owns the `<figure>` wrapper and
  the `{% figcaption %}`** — captions are prose, they live with the page.
- Build figures from the kit: `figureDefs.js` (`SPECIES`/`REGION` palettes), the
  `controls.slider` macro. Inline sliders go in a grid
  (`grid-template-columns: max-content minmax(0, 200px)`). Per-trace label
  placement via `labelFrac` + `labelHAlign`; hide y-ticks with `{ yMode: 'abstract' }`.
- **markdown-it whitespace gotcha:** a blank line inside the page's `<figure>`
  drops it out of raw-HTML mode and markdown-it injects `<p>` tags that wreck
  slider grids. The `controls` macro is whitespace-controlled (`{%- … -%}`,
  single-line branches) — keep it so; keep include markup at column 0 and
  blank-line-free. Inspect the post-Nunjucks intermediate with
  `DUMP_MD=1 npx @11ty/eleventy --output=/tmp/x` → `/tmp/eleventy-md-intermediate.txt`.

## Markdown writing notes
- KaTeX inline `$…$` / display `$$…$$`; prefer narrow/stacked equations for mobile viewing.
- Topics order by the `orderESBD` front-matter field; prev/next nav is automatic.
