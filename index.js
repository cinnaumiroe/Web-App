var express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const {
  getSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSongById,
  patchSong,
} = require("./songController");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/songs", async function (req, res) {
  const title = req.query.title;
  const artist = req.query.artist;

  const songs = await getSongs({
    title,
    artist,
  });
  res.send(songs);
});

app.get("/songs/:id", async function (req, res) {
  const id = req.params.id;
  const song = await getSongById(id);
  res.send(song);
});

app.post("/songs", async function (req, res) {
  const body = req.body;
  await addSong(body);
  res.send("CREATED");
});

app.put("/songs/:id", async function (req, res) {
  const id = req.params.id;
  const body = req.body;
  await updateSong(id, body);
  res.send("UPDATED");
});

app.delete("/songs/:id", async function (req, res) {
  const id = req.params.id;
  await deleteSongById(id);
  res.send("DELETED");
});

app.patch("/songs/:id", async function (req, res) {
  const id = req.params.id;
  const body = req.body;
  await patchSong(id, body);
  res.send("PATCHED");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
