// Eleventy configuration file
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');

module.exports = function (eleventyConfig) {
    // --- Passthrough Copy ---
    // Copy static assets directly to the output directory (_site)
    // Adjust paths if your structure differs or you add more static folders
    eleventyConfig.addPassthroughCopy('src/css');
    eleventyConfig.addPassthroughCopy('src/js');
    eleventyConfig.addPassthroughCopy('src/img');
    // If you have other static assets like fonts, add them here

    // --- Markdown Options ---
    // Optional: Configure markdown-it library if needed
    // let markdownIt = require("markdown-it");
    // let options = { html: true, breaks: true, linkify: true };
    // eleventyConfig.setLibrary("md", markdownIt(options));

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

    // Static TeX rendering:
    const markdownItKatex = require('@vscode/markdown-it-katex').default;
    eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(markdownItKatex));
    // Brutal hammer if markdown screws with underscores in TeX:
    //  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.disable('emphasis'));

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
};
