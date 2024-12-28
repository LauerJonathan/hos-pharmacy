const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Medication = require("../models/Medication");

// Route d'ajout
router.post("/additem", async (req, res) => {
  try {
    const {
      medName,
      form,
      dose,
      stock_quantity,
      minimum_quantity,
      expiration_date,
      prescription_required,
    } = req.body;

    let medication = new Medication({
      medName,
      form,
      dose,
      stock_quantity,
      minimum_quantity,
      expiration_date,
      prescription_required,
    });

    await medication.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "votre_secret_jwt",
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
