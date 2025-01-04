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

// Obtenir tous les médicaments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const medications = await Medication.find({})
      .select("medName form dose minimum_quantity prescription_required cip13")
      .sort({ medName: 1 });

    const formattedMedications = await Promise.all(
      medications.map(async (med) => {
        const lots = await Lot.find({ medication_id: med._id });
        const now = new Date();

        return {
          id: med._id,
          name: med.medName,
          form: med.form,
          dose: med.dose,
          currentStock: lots.reduce(
            (sum, lot) =>
              new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
            0
          ),
          minQuantity: med.minimum_quantity,
          lots: lots.map((lot) => ({
            lotNumber: lot.lot_number,
            quantity: lot.quantity,
            expirationDate: lot.expiration_date,
            isExpired: new Date(lot.expiration_date) < now,
          })),
          prescriptionRequired: med.prescription_required,
          cip13: med.cip13,
          stockStatus:
            lots.reduce(
              (sum, lot) =>
                new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
              0
            ) <= med.minimum_quantity
              ? "low"
              : "normal",
        };
      })
    );

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

// Ajouter un médicament ou mettre à jour les lots
router.post("/additem", authMiddleware, async (req, res) => {
  try {
    const { name, form, dose, minQuantity, cip13, prescriptionRequired, lots } =
      req.body;

    let medication = await Medication.findOne({ cip13 });

    if (!medication) {
      medication = new Medication({
        medName: name,
        form,
        dose,
        minimum_quantity: minQuantity,
        prescription_required: prescriptionRequired,
        cip13,
      });
      await medication.save();
    }

    // Sauvegarder les nouveaux lots
    await Promise.all(
      lots.map(async (lotData) => {
        const lot = new Lot({
          medication_id: medication._id,
          lot_number: lotData.lotNumber,
          quantity: lotData.quantity,
          expiration_date: lotData.expirationDate,
        });
        return lot.save();
      })
    );

    // Récupérer tous les lots après l'ajout
    const allLots = await Lot.find({ medication_id: medication._id });
    const now = new Date();

    const formattedMedication = {
      id: medication._id,
      name: medication.medName,
      form: medication.form,
      dose: medication.dose,
      currentStock: allLots.reduce(
        (sum, lot) =>
          new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
        0
      ),
      minQuantity: medication.minimum_quantity,
      lots: allLots.map((lot) => ({
        lotNumber: lot.lot_number,
        quantity: lot.quantity,
        expirationDate: lot.expiration_date,
        isExpired: new Date(lot.expiration_date) < now,
      })),
      prescriptionRequired: medication.prescription_required,
      cip13: medication.cip13,
      stockStatus:
        allLots.reduce(
          (sum, lot) =>
            new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
          0
        ) <= medication.minimum_quantity
          ? "low"
          : "normal",
    };

    res.status(201).json({
      message: "Lot ajouté avec succès",
      medication: formattedMedication,
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout du médicament:", err);
    res.status(500).json({
      message: "Erreur lors de l'ajout du médicament",
      error: err.message,
    });
  }
});

// Rechercher un médicament par CIP13
router.get("/search-cip13/:cip13", authMiddleware, async (req, res) => {
  try {
    const { cip13 } = req.params;
    const medication = await Medication.findOne({ cip13 });

    if (!medication) {
      return res
        .status(404)
        .json({ message: "Aucun médicament trouvé avec ce CIP13" });
    }

    const lots = await Lot.find({ medication_id: medication._id });
    const now = new Date();

    const formattedMedication = {
      id: medication._id,
      name: medication.medName,
      form: medication.form,
      dose: medication.dose,
      currentStock: lots.reduce(
        (sum, lot) =>
          new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
        0
      ),
      minQuantity: medication.minimum_quantity,
      lots: lots.map((lot) => ({
        lotNumber: lot.lot_number,
        quantity: lot.quantity,
        expirationDate: lot.expiration_date,
        isExpired: new Date(lot.expiration_date) < now,
      })),
      prescriptionRequired: medication.prescription_required,
      cip13: medication.cip13,
      stockStatus:
        lots.reduce(
          (sum, lot) =>
            new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
          0
        ) <= medication.minimum_quantity
          ? "low"
          : "normal",
    };

    res.status(200).json(formattedMedication);
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Mettre à jour la quantité d'un lot
router.patch("/:cip13/lots/:lotNumber", authMiddleware, async (req, res) => {
  try {
    const { cip13, lotNumber } = req.params;
    const { increment } = req.body;

    console.log("Requête reçue:", {
      cip13,
      lotNumber,
      increment,
      body: req.body,
    });

    const medication = await Medication.findOne({ cip13 });
    if (!medication) {
      console.log("Médicament non trouvé:", cip13);
      return res.status(404).json({ message: "Médicament non trouvé" });
    }

    const lot = await Lot.findOne({
      medication_id: medication._id,
      lot_number: lotNumber,
    });
    if (!lot) {
      console.log("Lot non trouvé:", lotNumber);
      return res.status(404).json({ message: "Lot non trouvé" });
    }

    console.log("Avant mise à jour:", {
      ancienneQuantité: lot.quantity,
      nouvelleQuantité: lot.quantity + increment,
    });

    lot.quantity += increment ? 1 : -1;
    await lot.save();

    // Récupérer tous les lots après la mise à jour
    const allLots = await Lot.find({ medication_id: medication._id });
    const now = new Date();

    const formattedMedication = {
      id: medication._id,
      name: medication.medName,
      form: medication.form,
      dose: medication.dose,
      currentStock: allLots.reduce(
        (sum, lot) =>
          new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
        0
      ),
      minQuantity: medication.minimum_quantity,
      lots: allLots.map((lot) => ({
        lotNumber: lot.lot_number,
        quantity: lot.quantity,
        expirationDate: lot.expiration_date,
        isExpired: new Date(lot.expiration_date) < now,
      })),
      prescriptionRequired: medication.prescription_required,
      cip13: medication.cip13,
      stockStatus:
        allLots.reduce(
          (sum, lot) =>
            new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
          0
        ) <= medication.minimum_quantity
          ? "low"
          : "normal",
    };

    res.json(formattedMedication);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du lot:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Supprimer un lot
router.delete("/:cip13/lots/:lotNumber", authMiddleware, async (req, res) => {
  try {
    const { cip13, lotNumber } = req.params;

    const medication = await Medication.findOne({ cip13 });
    if (!medication) {
      return res.status(404).json({ message: "Médicament non trouvé" });
    }

    const lot = await Lot.findOneAndDelete({
      medication_id: medication._id,
      lot_number: lotNumber,
    });
    if (!lot) {
      return res.status(404).json({ message: "Lot non trouvé" });
    }

    // Récupérer tous les lots restants
    const allLots = await Lot.find({ medication_id: medication._id });
    const now = new Date();

    const formattedMedication = {
      id: medication._id,
      name: medication.medName,
      form: medication.form,
      dose: medication.dose,
      currentStock: allLots.reduce(
        (sum, lot) =>
          new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
        0
      ),
      minQuantity: medication.minimum_quantity,
      lots: allLots.map((lot) => ({
        lotNumber: lot.lot_number,
        quantity: lot.quantity,
        expirationDate: lot.expiration_date,
        isExpired: new Date(lot.expiration_date) < now,
      })),
      prescriptionRequired: medication.prescription_required,
      cip13: medication.cip13,
      stockStatus:
        allLots.reduce(
          (sum, lot) =>
            new Date(lot.expiration_date) > now ? sum + lot.quantity : sum,
          0
        ) <= medication.minimum_quantity
          ? "low"
          : "normal",
    };

    res.json(formattedMedication);
  } catch (err) {
    console.error("Erreur lors de la suppression du lot:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
