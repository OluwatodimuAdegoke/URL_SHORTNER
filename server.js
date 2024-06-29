const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
require("dotenv").config();
const app = express();

mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//Render the index.ejs file
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

//Create a new short URL
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

//Redirect to the original URL
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

//Delete the short URL
app.post("/:shortUrl", async (req, res) => {
  await ShortUrl.findOneAndDelete({ short: req.params.shortUrl });
  res.redirect("/");
});

app.listen(process.env.PORT || 4000);
