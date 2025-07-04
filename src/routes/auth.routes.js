const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth.middleware");

// Route d'inscription
router.post("/register", authController.register);

// Route de connexion
router.post("/login", authController.login);

// Route pour obtenir le profil de l'utilisateur (protégée)
router.get("/profile", auth, authController.getProfile);

module.exports = router;
