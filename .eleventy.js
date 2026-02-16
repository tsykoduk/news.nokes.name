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

  // Group briefings by month (e.g., "February 2026")
  eleventyConfig.addFilter("groupByMonth", (briefings) => {
    if (!briefings) return [];
    const groups = [];
    const map = new Map();

    for (const brief of briefings) {
      const date = new Date(brief.fileSlug + "T12:00:00");
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      if (!map.has(key)) {
        const group = { key, label, items: [] };
        map.set(key, group);
        groups.push(group);
      }
      map.get(key).items.push(brief);
    }

    return groups;
  });

  // Group briefings by week (Monday-based, e.g., "Feb 10 – 16")
  eleventyConfig.addFilter("groupByWeek", (briefings) => {
    if (!briefings) return [];
    const groups = [];
    const map = new Map();

    for (const brief of briefings) {
      const date = new Date(brief.fileSlug + "T12:00:00");
      const day = date.getDay();
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((day + 6) % 7));
      const key = monday.toISOString().slice(0, 10);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      let label;
      if (monday.getMonth() === sunday.getMonth()) {
        label = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${sunday.getDate()}`;
      } else {
        label = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      }

      if (!map.has(key)) {
        const group = { key, label, items: [] };
        map.set(key, group);
        groups.push(group);
      }
      map.get(key).items.push(brief);
    }

    return groups;
  });

  // Strip first H1 from content (for homepage where title is redundant)
  eleventyConfig.addFilter("stripFirstH1", (content) => {
    if (!content) return content;
    return content.replace(/<h1[^>]*>.*?<\/h1>\s*/i, '');
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
