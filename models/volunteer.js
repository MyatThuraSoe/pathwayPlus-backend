const mongoose = require("mongoose");
const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required for a volunteer"],
  },
  role: {
    type: String,
    required: [true, "role is required for a volunteer"],
  },
  department: {
    type: String,
    required: [true, "department is required for a volunteer"],
  },
  startTime: {
    type: String,
    required: [true, "duration is required for a volunteer"],
  },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
