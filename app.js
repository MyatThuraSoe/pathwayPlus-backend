require("dotenv").config();
require("express-async-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");

const app = express();
const connectDB = require("./db/connect");

const {
  consultantRouter,
  consultingAppoinmentRouter,
  consultingsessionRouter,
  eventRouter,
  proofreaderRouter,
  proofreadingAppoinmentRouter,
  proofreadingsession,
  userRouter,
  vacancyRouter,
  volunteerRouter,
} = require("./routes/routes");

app.use(express.json());
app.use(cors());
app.use(cookies());

// set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views/ejs"));

// load assets
// app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
// app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

app.get("/", (req, res) => {
  res.send("Here is just a sample message");
  res.status(200);
});

app.use("/consultants", consultantRouter);
app.use("/consultingappoinments", consultingAppoinmentRouter);
app.use("/consultingsessions", consultingsessionRouter);
app.use("/events", eventRouter);
app.use("/proofreaders", proofreaderRouter);
app.use("/proofreadingappoinments", proofreadingAppoinmentRouter);
app.use("/proofreadingsessions", proofreadingsession);
app.use("/users", userRouter);
app.use("/vacancies", vacancyRouter);
app.use("/volunteers", volunteerRouter);

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
