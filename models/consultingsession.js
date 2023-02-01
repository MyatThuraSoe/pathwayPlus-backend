const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consultingsessionSchema = new Schema(
  {
    consultant: {
      type: Schema.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },
    available: { type: Boolean, required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String }, // required is not true bcoz sometimes there is unexpected sessions
  },
  { timestamps: true }
);

const ConsultingSession = mongoose.model(
  "ConsultingSession",
  consultingsessionSchema
);

module.exports = ConsultingSession;
