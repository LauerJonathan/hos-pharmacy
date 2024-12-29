const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Ajout de l'import manquant
const Medication = require("../models/Medication");

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requis" });
  }

  try {
    // Utilisez la même clé secrète que celle utilisée pour créer le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_jwt"
    );

    // Vérification du rôle
    if (decoded.role !== "pharmacien") {
      return res.status(403).json({
        message:
          "Accès non autorisé. Seuls les pharmaciens peuvent ajouter des médicaments.",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erreur de vérification du token:", err);
    return res.status(401).json({ message: "Token invalide" });
  }
};

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
