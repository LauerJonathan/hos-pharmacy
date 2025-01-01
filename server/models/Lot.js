const mongoose = require("mongoose");

const lotSchema = new mongoose.Schema({
  lot_number: {
    type: String,
    required: true,
  },
  medication_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expiration_date: {
    type: Date,
    required: true,
  },
  reception_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lot", lotSchema);
