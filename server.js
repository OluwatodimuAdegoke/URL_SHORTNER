const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const ShortUrl = require("./models/shortUrl");
const User = require("./models/users");
require("dotenv").config();
const app = express();

mongoUri = process.env.MONGO_URI;
tokenSecret = process.env.TOKEN_SECRET;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4000",
  })
);
app.use(express.urlencoded({ extended: false }));

//Render the index.ejs file
app.get("/", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    if (!cookie) throw new Error("No cookie");

    const claims = jwt.verify(cookie, tokenSecret);
    if (!claims) throw new Error("Invalid token");

    const user = await User.findOne({ _id: claims._id });
    if (!user) throw new Error("User not found");

    const shortUrls = await ShortUrl.find({ user: user._id });
    res.render("index", { shortUrls: shortUrls });
  } catch (err) {
    if (
      err.message === "No cookie" ||
      err.message === "Invalid token" ||
      err.message === "User not found"
    ) {
      res.redirect("/login");
    } else {
      console.log(err);
      res.redirect("/login");
    }
  }
});

//Register Routes
app.get("/register", (req, res) => {
  res.render("register", { error: req.query.error ? req.query.error : "" });
});
app.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) throw new Error("User already exists");

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (user) {
      res.redirect("/login?error=Successfully registered, please login");
    } else {
      throw new Error("User not created");
    }
  } catch (err) {
    res.redirect("/register?error=" + err.message);
  }
});

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.redirect("/login");
});

// Login Routes
app.get("/login", (req, res) => {
  res.render("login", { error: req.query.error ? req.query.error : "" });
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email,
    });

    if (!user) throw new Error("User not found");

    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("Invalid password");

    const token = jwt.sign({ _id: user._id }, tokenSecret);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (err) {
    if (err.message === "User not found") {
      res.redirect("/login?error=User not found");
    } else {
      res.redirect("/login?error=Invalid password");
    }
  }
});

//Create a new short URL
app.post("/shortUrls", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    await ShortUrl.create({
      full: req.body.fullUrl,
      user: jwt.verify(cookie, tokenSecret)._id,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//Redirect to the original URL
app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//Delete the short URL
app.post("/:shortUrl", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    await ShortUrl.findOneAndDelete({
      short: req.params.shortUrl,
      user: jwt.verify(cookie, tokenSecret)._id,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 4000);
