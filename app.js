const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");

app.use(express.static(path.join(__dirname, "utils")));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (status == 404) {
    res.status(status).render("notfound");
  } else {
    if (!err.message) err.message = "Oh No, Something went wrong";
    res.status(status).render("notfound");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on Port ${port}`);
});
