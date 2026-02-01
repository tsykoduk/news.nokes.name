module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");

  // Date formatting filter
  eleventyConfig.addFilter("readableDate", (dateStr) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // Sort briefings by date (newest first)
  eleventyConfig.addCollection("briefings", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/briefs/*.md").sort((a, b) => {
      return b.fileSlug.localeCompare(a.fileSlug);
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
