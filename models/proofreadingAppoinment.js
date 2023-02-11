const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proofreadingAppointmentSchema = new Schema({
  proofreadingsession: {
    type: Schema.Types.ObjectId,
    ref: "ProofReadingSession",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  facebook: String,
  age: String,
  phone: String,
  education: String,
  purpose: String,
  status: String,
});

const proofreadingAppointment = mongoose.model(
  "proofreadingAppointment",
  proofreadingAppointmentSchema
);

module.exports = proofreadingAppointment;
