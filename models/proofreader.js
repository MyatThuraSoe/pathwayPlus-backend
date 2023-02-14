const mongoose = require("mongoose");
const proofReaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  university: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
  },
  year: {
    type: Number,
  },
  country: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
  },
});
const Proofreader = mongoose.model("Proofreader", proofReaderSchema);
module.exports = Proofreader;
