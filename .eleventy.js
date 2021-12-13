require('dotenv').config();
const filters = require('./utils/filters.js');
const passthroughs = require('./utils/passthroughs.js');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");

const site = require('./src/data/site.json');

const localizedCollections = ['post'];

module.exports = eleventyConfig => {
	const md = new markdownIt({
		html: true
	});

	eleventyConfig.addPairedShortcode("markdown", (content) => {
		return md.render(content);
	});

    eleventyConfig.addPlugin(syntaxHighlight);

    // Copy our static assets to the output folder
    passthroughs.forEach(passthroughPath => {
        eleventyConfig.addPassthroughCopy(passthroughPath);
    });

    // Filters
    Object.keys(filters).forEach((filterName) => {
        eleventyConfig.addFilter(filterName, filters[filterName]);
    })

    // For each language, create collection of posts with given language
	if(site.langs) {
		site.langs.map(langEntry => {

			for (const localizedCollection of localizedCollections) {
				// Produces collection with the pluralized name + '_' + locale,
				// E.g.: 'posts_en'
				eleventyConfig.addCollection(`${localizedCollection}s_${langEntry.id}`, function (collectionApi) {
					return collectionApi.getFilteredByTag(localizedCollection).filter(function (item) {
						return item.data.locale === langEntry.id
					});
				});
			}
		});
	}

    return {
        pathPrefix: process.env.WEB_PATH_PREFIX || '',
        dir: { input: 'src', output: '_site' }
    };

};
