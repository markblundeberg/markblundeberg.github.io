// Eleventy configuration file

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
