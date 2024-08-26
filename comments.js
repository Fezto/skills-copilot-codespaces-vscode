// Create web server
// npm install express
// npm install body-parser
// npm install mongoose
// npm install nodemon
// npm install ejs
// npm install express-sanitizer
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/comments", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.redirect("/comments");
});

app.get("/comments", (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { comments: comments });
    }
  });
});

app.get("/comments/new", (req, res) => {
  res.render("new");
});

app.post("/comments", (req, res) => {
  req.body.comment.body = req.sanitize(req.body.comment.body);
  Comment.create(req.body.comment, (err, newComment) => {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/comments");
    }
  });
});

app.get("/comments/:id", (req, res) => {
  Comment.findById(req.params.id, (err, foundComment) => {
    if (err) {
      res.redirect("/comments");
    } else {
      res.render("show", { comment: foundComment });
    }
  });
});

app.get("/comments/:id/edit", (req, res) => {
  Comment.findById(req.params.id, (err, foundComment) => {
    if (err) {
      res.redirect("/comments");
    } else {
      res.render("edit", { comment: foundComment });
    }
  });
});

app.put("/comments/:id", (req, res) => {
  req.body.comment.body = req.sanitize(req.body.comment.body);
  Comment.findByIdAndUpdate(
    req.params.id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("/comments");