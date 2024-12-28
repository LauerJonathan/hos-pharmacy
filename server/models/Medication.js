const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const medicationSchema = new mongoose.Schema({
  medName: {
    type: String,
    required: true,
    trim: true,
  },
  form: {
    type: String,
    required: true,
    trim: true,
  },
  dose: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  stock_quantity: {
    type: Number,
    required: true,
    trim: true,
  },
  minimum_quantity: {
    type: Number,
    required: true,
    trim: true,
  },
  expiration_date: {
    type: Date,
    required: true,
  },
  prescription_required: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Medication", medicationSchema);
