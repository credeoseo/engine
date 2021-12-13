let site = {
    buildTime: new Date(),
};

if (process.env.WEB_ROOT_URL) {
    site.rootUrl = process.env.WEB_ROOT_URL;
}

if (process.env.WEB_PATH_PREFIX) {
    site.pathPrefix = process.env.WEB_PATH_PREFIX;
}

if (process.env.ELEVENTY_ENV !== 'production' && process.env.GOOGLE_TAG_ID) {
    site.googleTagId = process.env.GOOGLE_TAG_ID;
}

if (process.env.ALGOLIA_APP_ID) {
    site.enableAlgolia = true;
}

if (process.env.REPO_URL) {
    site.repoUrl = process.env.REPO_URL;
}

if (process.env.DISQUS_SITE_NAME) {
    site.DISQUS_SITE_NAME = process.env.DISQUS_SITE_NAME;
}

module.exports = site;
