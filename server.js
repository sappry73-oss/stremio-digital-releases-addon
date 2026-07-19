const express = require("express");

const app = express();

const manifest = require("./manifest.json");

app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

app.get("/catalog/movie/:id.json", (req, res) => {

  const movies = [];

  res.json({
    metas: movies
  });

});

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log("Digital Releases addon running on port " + port);
});
