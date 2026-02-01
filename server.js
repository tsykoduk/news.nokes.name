const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from _site
app.use(express.static(path.join(__dirname, "_site")));

// Fallback to index for SPA-like behavior
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "_site", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
