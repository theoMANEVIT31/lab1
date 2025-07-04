const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db.config");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Route de base
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API d'authentification" });
});

// Connexion à la base de données MongoDB
// Initialisation de la base de données MySQL
const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à MySQL établie avec succès");

    // Synchronisation des modèles
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Base de données synchronisée avec succès");
  } catch (error) {
    console.error(
      "Erreur de connexion à la base de données MySQL:",
      error.message
    );

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

initDb();

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

module.exports = app;
