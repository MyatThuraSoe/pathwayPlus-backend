const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consultingAppointmentSchema = new Schema({
  consultingsession: {
    type: Schema.Types.ObjectId,
    ref: "ConsultingSession",
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

const ConsultingAppointment = mongoose.model(
  "ConsultingAppointment",
  consultingAppointmentSchema
);

module.exports = ConsultingAppointment;
