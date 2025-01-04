const mongoose = require("mongoose");
const medicationSchema = new mongoose.Schema({
  medName: String,
  form: String,
  dose: String,
  minimum_quantity: Number,
  prescription_required: Boolean,
  cip13: {
    type: String,
    unique: true,
    required: true,
  },
  atc_code: {
    type: String,
  },
  lots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lot",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Medication", medicationSchema);
