// Eleventy configuration file
import markdownIt from 'markdown-it';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import markdownItKatex from '@vscode/markdown-it-katex';
import katex from 'katex';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItAnchor from 'markdown-it-anchor';
import fs from 'node:fs';

// `export default` is used for ESM
export default async function myConfig(eleventyConfig) {
    // --- Passthrough Copy ---
    // Copy static assets directly to the output directory (_site)
    // Adjust paths if your structure differs or you add more static folders
    eleventyConfig.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });
    eleventyConfig.addPassthroughCopy('src/css');
    eleventyConfig.addPassthroughCopy('src/js');
    eleventyConfig.addPassthroughCopy('src/img');
    eleventyConfig.addPassthroughCopy({ 'src/esbd/js': '/esbd/js/' });
    eleventyConfig.addPassthroughCopy({ 'src/esbd/img': '/esbd/img/' });
    // Companion notebooks: downloadable .ipynb (pages render them via the
    // `notebook` shortcode below)
    eleventyConfig.addPassthroughCopy({ notebooks: '/notebooks/' });
    // If you have other static assets like fonts, add them here

    // --- Set variables ---
    eleventyConfig.addGlobalData('esbdJsPath', '/esbd/js/');
    // CAPTURE=1 (set by bin/prerender.mjs) injects a client-side hook into the
    // topic layout that stamps each rendered diagram svg with a viewBox + its
    // container id, for headless seed capture. Empty in normal/production builds.
    eleventyConfig.addGlobalData('captureMode', process.env.CAPTURE || '');

    // --- Markdown Options ---
    const md = new markdownIt({
        html: true, // Allow HTML tags
    });
    eleventyConfig.setLibrary('md', md);

    // Static TeX rendering:
    // The @vscode/markdown-it-katex package is a CJS module.
    // The actual plugin function is on the .default property of the imported object.
    md.use(markdownItKatex.default);
    // Brutal hammer if markdown screws with underscores in TeX:
    // md.disable('emphasis');

    // The markdown-it-footnote package is a CJS module without a default export.
    // The actual plugin function is on the .default property of the imported object.
    md.use(markdownItFootnote);

    // Heading ids, so sections are deep-linkable (/esbd/lib/#some-section).
    // Slugs come from the raw heading text with any $TeX$ stripped, so KaTeX
    // markup never leaks into URLs.
    md.use(markdownItAnchor, {
        level: [2, 3], // h1 is the page itself; leave it bare
        slugify: (s) =>
            encodeURIComponent(
                s
                    .trim()
                    .replace(/\$[^$]*\$/g, '') // drop inline math
                    .toLowerCase()
                    .replace(/[^a-z0-9 -]/g, '')
                    .trim()
                    .replace(/\s+/g, '-')
            ),
    });

    // --- Debug: dump the post-Nunjucks, pre-markdown-it intermediate ---
    // Markdown pages are run through Nunjucks first (includes/macros expanded),
    // then the resulting string is handed to markdown-it. That intermediate is
    // what markdown-it actually parses, and it's where whitespace gremlins hide
    // (a stray blank line can drop a <figure> out of raw-HTML mode). Run the
    // build with DUMP_MD=1 to append every render's input to a file, e.g.
    //   DUMP_MD=1 npx @11ty/eleventy --output=/tmp/x
    // then inspect /tmp/eleventy-md-intermediate.txt.
    if (process.env.DUMP_MD) {
        const dumpPath = '/tmp/eleventy-md-intermediate.txt';
        fs.writeFileSync(dumpPath, ''); // fresh each build
        const origRender = md.render.bind(md);
        md.render = (src, env) => {
            const where = env?.page?.inputPath || '(no page env, e.g. a figcaption)';
            fs.appendFileSync(
                dumpPath,
                `\n===== ${where} (${src.length} chars) =====\n${src}\n`
            );
            return origRender(src, env);
        };
    }

    // --- Collections ---
    // Optional: Define collections later for things like blog posts
    // eleventyConfig.addCollection("posts", function(collectionApi) {
    //   return collectionApi.getFilteredByGlob("src/posts/*.md");
    // });

    // --- Filters / Shortcodes ---
    // Optional: Add custom filters or shortcodes later

    // --- Wikipedia Link Shortcode ---
    eleventyConfig.addShortcode(
        'wiki',
        function (pageTitle, linkText, lang = 'en') {
            if (!pageTitle) {
                return '[wiki link error: page title missing]';
            }

            // Use provided link text or format the page title
            const displayText = linkText || pageTitle.replace(/_/g, ' ');

            // Construct the Wikipedia URL (handle spaces vs underscores)
            const encodedTitle = encodeURIComponent(
                pageTitle.replace(/ /g, '_')
            );
            const url = `https://${lang}.wikipedia.org/wiki/${encodedTitle}`;

            // --- Icon HTML (Choose ONE option) ---

            // Option A: Inline SVG (Recommended for self-containment)
            // Find a simple SVG icon for Wikipedia (e.g., from Wikimedia Commons or icon sets)
            // Example using a generic external link icon as placeholder:
            const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="display: inline-block; vertical-align: baseline; margin-left: 3px;"><path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"></path></svg>`;
            // TODO: Replace with an actual Wikipedia logo SVG path if desired

            // Option B: Image Tag (Requires icon file in your img folder)
            // const iconHTML = `<img src="/img/wikipedia-icon.svg" alt="Wikipedia link" width="12" height="12" style="display: inline-block; vertical-align: baseline; margin-left: 3px;">`;

            // Option C: Icon Font (Requires loading Font Awesome or similar in your base layout)
            // const iconHTML = `<i class="fab fa-wikipedia-w" style="font-size: 0.9em; margin-left: 3px;" aria-hidden="true"></i>`;

            // --- Return Final HTML ---
            // Use target="_blank" for external links
            // rel="noopener noreferrer" is good practice for security/privacy
            return `<a href="${url}" class="wikipedia-link" target="_blank" rel="noopener noreferrer">${displayText}${iconHTML}</a>`;
        }
    );

    // --- Server-side KaTeX for control labels ---
    // Slider/checkbox labels are njk macro output (not markdown), so their $…$
    // math is normally only rendered client-side by the auto-render hook — which
    // means it shows as raw "$…$" with no JS. Render it at build time instead, so
    // labels are correct without JS (and JS users get no flash of raw TeX either).
    // Plain-text labels pass through untouched.
    eleventyConfig.addFilter('katex', (str) => {
        if (str == null) return str;
        const s = String(str);
        if (!s.includes('$')) return s;
        return s
            .replace(/\$\$([^$]+)\$\$/g, (_, m) =>
                katex.renderToString(m, { throwOnError: false, displayMode: true }))
            .replace(/\$([^$]+)\$/g, (_, m) =>
                katex.renderToString(m, { throwOnError: false, displayMode: false }));
    });

    // --- Circuit figure shortcode ---
    // Inlines a committed, pre-rendered SVG from src/_includes/circuit/<name>.svg
    // (produced by `npm run circuits`: circuitikz -> dvisvgm -> recolored to
    // currentColor). Static; no browser/LaTeX at build time. Freshness is
    // enforced by the circuit-figure guard in bin/check.mjs.
    eleventyConfig.addShortcode('circuit', function (name) {
        const p = `src/_includes/circuit/${name}.svg`;
        try {
            return fs.readFileSync(p, 'utf8').trim();
        } catch {
            return `[missing circuit figure: ${name} — run npm run circuits]`;
        }
    });

    // --- Companion notebook rendering ---
    // {% notebook "name" %} renders notebooks/<name>.ipynb — committed and
    // *executed* (see bin/notebooks.mjs) — to HTML at build time: markdown
    // cells through the site's markdown-it (KaTeX included), code cells as
    // plain <pre>, outputs as inline SVG / <img> / text. No Python at build
    // time, so CI deploys stay node-only; freshness is enforced by the
    // notebook guard in bin/check.mjs.
    // re-render notebook pages when a committed notebook changes during
    // `eleventy --serve` (the shortcode reads the file fresh each build)
    eleventyConfig.addWatchTarget('notebooks/');
    const nbStr = (v) => (Array.isArray(v) ? v.join('') : String(v ?? ''));
    const nbEscape = (s) =>
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const nbStripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
    eleventyConfig.addShortcode('notebook', function (name) {
        const path = `notebooks/${name}.ipynb`;
        let nb;
        try {
            nb = JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch {
            return `[missing notebook: ${name} — expected ${path}]`;
        }
        const parts = [];
        for (const cell of nb.cells) {
            const src = nbStr(cell.source);
            if (cell.cell_type === 'markdown') {
                parts.push(`<div class="nb-cell nb-md">${md.render(src)}</div>`);
            } else if (cell.cell_type === 'code') {
                const outs = [];
                for (const o of cell.outputs || []) {
                    if (o.output_type === 'stream') {
                        outs.push(`<pre class="nb-stream">${nbEscape(nbStr(o.text))}</pre>`);
                    } else if (o.output_type === 'error') {
                        outs.push(`<pre class="nb-error">${nbEscape(nbStripAnsi((o.traceback || []).join('\n')))}</pre>`);
                    } else if (o.data) {
                        if (o.data['image/svg+xml']) {
                            outs.push(`<div class="nb-svg">${nbStr(o.data['image/svg+xml'])}</div>`);
                        } else if (o.data['image/png']) {
                            outs.push(`<img class="nb-img" alt="notebook output" src="data:image/png;base64,${nbStr(o.data['image/png']).replace(/\n/g, '')}">`);
                        } else if (o.data['text/plain']) {
                            outs.push(`<pre class="nb-result">${nbEscape(nbStr(o.data['text/plain']))}</pre>`);
                        }
                    }
                }
                parts.push(`<div class="nb-cell nb-code-cell"><pre class="nb-code"><code>${nbEscape(src)}</code></pre>${outs.join('\n')}</div>`);
            }
        }
        return `<div class="nb-page">${parts.join('\n')}</div>`;
    });

    // --- Prerendered figure seeds (nojs / no-flash) ---
    // Inject committed seed SVGs (from `npm run prerender`) into each diagram
    // container at build time, keyed by container id. The engine clears the
    // container on boot, so JS wipes the seed and redraws — the seed is only
    // the pre-JS / no-JS frame. Inert when no seeds are committed (the dir is
    // empty), so this is a no-op until the v1.0 seed rollout.
    const PRERENDER_DIR = 'src/esbd/prerendered';
    // Re-read seeds whenever the dir changes (mtime), and watch the dir, so a
    // fresh `npm run prerender` is picked up during `eleventy --serve` WITHOUT a
    // restart (prerender rebuilds the dir, bumping its mtime). Inert when empty.
    eleventyConfig.addWatchTarget(PRERENDER_DIR);
    let seedCache = { mtime: -1, seeds: {} };
    const currentSeeds = () => {
        let mt;
        try { mt = fs.statSync(PRERENDER_DIR).mtimeMs; } catch { return {}; }
        if (mt !== seedCache.mtime) {
            const seeds = {};
            for (const f of fs.readdirSync(PRERENDER_DIR)) {
                if (f.endsWith('.svg'))
                    seeds[f.replace(/\.svg$/, '')] = fs
                        .readFileSync(`${PRERENDER_DIR}/${f}`, 'utf8')
                        .trim();
            }
            seedCache = { mtime: mt, seeds };
        }
        return seedCache.seeds;
    };
    eleventyConfig.addTransform('inject-prerender', function (content) {
        if (!(this.page.outputPath || '').endsWith('.html')) return content;
        const seeds = currentSeeds();
        if (!Object.keys(seeds).length) return content;
        // inject into empty container divs whose id has a committed seed
        return content.replace(/<div\b([^>]*)>\s*<\/div>/g, (m, attrs) => {
            const id = (attrs.match(/id="([^"]+)"/) || [])[1];
            return id && seeds[id] ? `<div${attrs}>${seeds[id]}</div>` : m;
        });
    });

    eleventyConfig.addPairedShortcode('figcaption', (content) => {
        // Renders markdown inside of it, which avoid the issues from trying
        // to temporarily escape into the outer markdown. This lets us render
        // math/links/whatever.
        // Use the full render method to support paragraphs, lists, etc.
        return `<figcaption>${md.render(content)}</figcaption>`;
    });

    eleventyConfig.setNunjucksEnvironmentOptions({
        throwOnUndefined: true,
        autoescape: false,
    });

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addCollection('esbd_topic', function (collectionApi) {
        // Get all content tagged with 'topics'
        return collectionApi.getFilteredByTag('esbd_topic').sort((a, b) => {
            // Sort by the 'orderESBD' front matter field
            return (a.data.orderESBD || 0) - (b.data.orderESBD || 0);
        });
    });

    // --- Base Config ---
    return {
        // Template formats to process (including Markdown)
        templateFormats: [
            'md',
            'njk', // Nunjucks templating language
            'html',
            'liquid', // Liquid templating language
        ],

        // Pre-process markdown files with Nunjucks (allows includes etc.)
        markdownTemplateEngine: 'njk',
        // Pre-process HTML files with Nunjucks
        htmlTemplateEngine: 'njk',

        // Directory structure (input and output)
        dir: {
            input: 'src', // Source directory
            includes: '_includes', // Relative to input dir
            data: '_data', // Relative to input dir
            output: '_site', // Output directory (generated site)
        },
    };
}
