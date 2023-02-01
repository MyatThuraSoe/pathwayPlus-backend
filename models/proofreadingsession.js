const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proofreadingsessionSchema = new mongoose.Schema(
  {
    proofreader: {
      type: Schema.Types.ObjectId,
      ref: "Proofreader",
      required: true,
    },
    available: { type: Boolean, required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String }, // required is not true bcoz sometimes there is unexpected sessions
  },
  { timestamps: true }
);

const ProofReadingSession = mongoose.model(
  "ProofReadingSession",
  proofreadingsessionSchema
);

module.exports = ProofReadingSession;
