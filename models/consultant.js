const mongoose = require("mongoose");
const consultantSchema = new mongoose.Schema({
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
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
});
const Consultant = mongoose.model("Consultant", consultantSchema);
module.exports = Consultant;
