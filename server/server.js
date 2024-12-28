const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const medicationRoutes = require("./routes/medication");

const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medication", medicationRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
