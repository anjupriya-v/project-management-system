const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const passport = require("passport");
const path = require("path");
const { google } = require("googleapis");
const fs = require("fs").promises;
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
// const qs = require("query-string");
require("dotenv").config();
require("./config/passport")(passport);

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join("images")));
app.use(express.static(__dirname + "/"));
app.use(express.json());
app.use(routes);

mongoose
  .connect(process.env.mongoDBURL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("Database is not connected");
  });
app.listen(5000, () => {
  console.log("app is listening at port 5000");
});
