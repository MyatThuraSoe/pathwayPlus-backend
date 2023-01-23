const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
