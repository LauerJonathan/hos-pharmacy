const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Medication = require("../models/Medication");

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requis" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_jwt"
    );

    // Vérification du rôle
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

// Route pour récupérer tous les médicaments
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("1. Début de la récupération des médicaments");

    const now = new Date();

    const medications = await Medication.find({})
      .select(
        "medName form dose stock_quantity minimum_quantity expiration_date prescription_required"
      )
      .sort({ medName: 1 });

    console.log(`2. ${medications.length} médicaments trouvés`);

    const formattedMedications = medications.map((med) => ({
      id: med._id,
      name: med.medName,
      form: med.form,
      dose: med.dose,
      currentStock: med.stock_quantity,
      minQuantity: med.minimum_quantity,
      expirationDate: med.expiration_date,
      isExpired: new Date(med.expiration_date) < now,
      prescriptionRequired: med.prescription_required,
      stockStatus:
        med.stock_quantity <= med.minimum_quantity ? "low" : "normal",
    }));

    res.status(200).json({
      message: "Médicaments récupérés avec succès",
      medications: formattedMedications,
      summary: {
        total: medications.length,
        lowStock: formattedMedications.filter(
          (med) => med.stockStatus === "low"
        ).length,
        expired: formattedMedications.filter((med) => med.isExpired).length,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des médicaments:", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des médicaments",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// Route d'ajout avec middleware d'auth
router.post("/additem", authMiddleware, async (req, res) => {
  try {
    console.log("1. Début de la route additem");
    const {
      medName,
      form,
      dose,
      stock_quantity,
      minimum_quantity,
      expiration_date,
      prescription_required,
    } = req.body;

    console.log("2. Données reçues:", {
      medName,
      form,
      dose,
      stock_quantity,
      minimum_quantity,
      expiration_date,
      prescription_required,
    });

    let medication = new Medication({
      medName,
      form,
      dose,
      stock_quantity,
      minimum_quantity,
      expiration_date,
      prescription_required,
    });

    console.log("3. Modèle créé:", medication);

    const savedMedication = await medication.save();
    console.log("4. Médicament sauvegardé:", savedMedication);

    res.status(201).json({
      message: "Médicament ajouté avec succès",
      medication: savedMedication,
    });
  } catch (err) {
    console.error("Erreur détaillée:", err);
    console.error("Stack trace:", err.stack);
    res.status(500).json({
      message: "Erreur lors de l'ajout du médicament",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

module.exports = router;
