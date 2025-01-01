const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Medication = require("../models/Medication");
const Lot = require("../models/Lot");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requis" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_jwt"
    );
    if (decoded.role !== "pharmacien") {
      return res.status(403).json({
        message:
          "Accès non autorisé. Seuls les pharmaciens peuvent accéder aux médicaments.",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erreur de vérification du token:", err);
    return res.status(401).json({ message: "Token invalide" });
  }
};

router.get("/", authMiddleware, async (req, res) => {
  try {
    const medications = await Medication.find({})
      .populate("lots")
      .select(
        "medName form dose minimum_quantity lots prescription_required cip13"
      )
      .sort({ medName: 1 });

    const now = new Date();
    const formattedMedications = medications.map((med) => ({
      id: med._id,
      name: med.medName,
      form: med.form,
      dose: med.dose,
      currentStock: med.lots.reduce(
        (sum, lot) =>
          new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
        0
      ),
      minQuantity: med.minimum_quantity,
      lots: med.lots.map((lot) => ({
        lotNumber: lot.lot_number,
        quantity: lot.quantity,
        expirationDate: lot.expiration_date,
        isExpired: new Date(lot.expiration_date) < now,
      })),
      prescriptionRequired: med.prescription_required,
      cip13: med.cip13,
      stockStatus:
        med.lots.reduce(
          (sum, lot) =>
            new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
          0
        ) <= med.minimum_quantity
          ? "low"
          : "normal",
    }));

    res.status(200).json({
      message: "Médicaments récupérés avec succès",
      medications: formattedMedications,
      summary: {
        total: medications.length,
        lowStock: formattedMedications.filter(
          (med) => med.stockStatus === "low"
        ).length,
        expired: formattedMedications.filter((med) =>
          med.lots.some((lot) => lot.isExpired)
        ).length,
      },
    });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.post("/additem", authMiddleware, async (req, res) => {
  try {
    const {
      medName,
      form,
      dose,
      minimum_quantity,
      prescription_required,
      lot_number,
      quantity,
      expiration_date,
      cip13,
      atc_code,
    } = req.body;

    // Vérifier si le médicament existe
    let medication = await Medication.findOne({ cip13 });

    if (!medication) {
      // Créer nouveau médicament
      medication = new Medication({
        medName,
        form,
        dose,
        minimum_quantity,
        prescription_required,
        cip13,
        atc_code,
      });
      await medication.save();
    }

    // Ajouter le lot
    const lot = new Lot({
      lot_number,
      medication_id: medication._id,
      quantity,
      expiration_date,
    });

    const savedLot = await lot.save();

    // Mettre à jour les lots du médicament
    await Medication.findByIdAndUpdate(medication._id, {
      $push: { lots: savedLot._id },
    });

    res.status(201).json({
      message: medication
        ? "Lot ajouté avec succès"
        : "Médicament et lot ajoutés avec succès",
      medication,
      lot: savedLot,
    });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
