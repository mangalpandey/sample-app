const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://mangal:mangal5289@cluster0.kherr.mongodb.net/test?retryWrites=true&w=majority";

const customerRoute = require("./routes/customer");
const productRoute = require("./routes/product");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/customer", customerRoute);
app.use("/product", productRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

console.log("Please wait, Connecting to mongoDB");
mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    console.log("Connedted to mongoDB and server has started at port 3001");
    app.listen(3001);
  })
  .catch((err) => {
    console.log("MongoDB conection error =>  " + err);
  });
