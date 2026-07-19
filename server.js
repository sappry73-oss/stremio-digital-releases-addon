const express = require("express");
const axios = require("axios");

const app = express();

const manifest = require("./manifest.json");

app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

async function getMovies() {
  const key = process.env.TMDB_API_KEY;

  if (!key) {
    throw new Error("Missing TMDB_API_KEY");
  }

  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 90);

  const from = past.toISOString().split("T")[0];
  const to = today.toISOString().split("T")[0];

  const result = await axios.get(
    "https://api.themoviedb.org/3/discover/movie",
    {
      params: {
        api_key: key,
        language: "en-US",
        region: "US",
        sort_by: "primary_release_date.desc",
        "primary_release_date.gte": from,
        "primary_release_date.lte": to,
        with_release_type: "4|5"
      }
    }
  );

  return result.data.results.map(movie => ({
    id: `tmdb:${movie.id}`,
    type: "movie",
    name: movie.title,
    poster: movie.poster_path
      ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
      : null,
    description: movie.overview,
    releaseInfo: movie.release_date
  }));
}


app.get("/catalog/movie/:id.json", async (req,res)=>{
  try {
    const movies = await getMovies();

    res.json({
      metas: movies
    });

  } catch(err) {

    console.log(err.message);

    res.status(500).json({
      error: err.message
    });

  }
});


const port = process.env.PORT || 7000;

app.listen(port,()=>{
 console.log("Digital Releases addon running on " + port);
});
