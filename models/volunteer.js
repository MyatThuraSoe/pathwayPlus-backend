const mongoose = require("mongoose");
const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required for a volunteer"],
  },
  position: {
    type: String,
    required: [true, "position is required for a volunteer"],
  },
  department: {
    type: String,
    required: [true, "department is required for a volunteer"],
  },
  startDate: {
    type: String,
    required: [true, "duration is required for a volunteer"],
  },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
