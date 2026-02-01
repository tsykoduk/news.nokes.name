module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");

  // Date formatting filter for briefings
  eleventyConfig.addFilter("readableDate", (dateStr) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // Current date for masthead
  eleventyConfig.addFilter("currentDate", () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  });

  // Slice array (for getting older briefings)
  eleventyConfig.addFilter("slice", (array, start, end) => {
    if (!array) return [];
    return array.slice(start, end);
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
