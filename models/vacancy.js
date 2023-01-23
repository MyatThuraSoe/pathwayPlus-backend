const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    registerlink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Vacancy = mongoose.model("vacancy", vacancySchema);
module.exports = Vacancy;
