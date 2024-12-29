const jwt = require("jsonwebtoken");

// Middleware pour vérifier le token
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Récupère le token du header

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    // Vérifie le token avec la clé secrète (utilise une clé sécurisée en production)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On ajoute les informations de l'utilisateur dans la requête
    next(); // L'accès est autorisé
  } catch (error) {
    return res.status(400).json({ message: "Token invalide" });
  }
};

module.exports = authenticate;
