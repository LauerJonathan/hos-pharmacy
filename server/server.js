const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const medicationRoutes = require("./routes/medications");
const cors = require("cors");

const app = express();

// Configuration CORS plus détaillée
app.use(
  cors({
    origin: "http://localhost:5173", // URL de votre app Vite
    credentials: true,
  })
);

// Middleware pour parser le JSON avec limite augmentée
app.use(express.json({ limit: "10mb" }));

// Connexion à la base de données
connectDB();

// Middleware de logging amélioré
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length) {
    console.log("Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes); // Notez le pluriel pour la cohérence

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("Erreur:", err);
  res.status(500).json({
    message: "Une erreur est survenue",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Erreur interne",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`
    🚀 Serveur démarré sur le port ${PORT}
    📁 API Auth: http://localhost:${PORT}/api/auth
    💊 API Medications: http://localhost:${PORT}/api/medications
  `);
});
