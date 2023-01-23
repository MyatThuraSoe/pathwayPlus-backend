require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Here is just a sample message");
  res.status(200);
});

const PORT = process.env.PORT || 5050;

const strater = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server is listening to port number ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

strater();
