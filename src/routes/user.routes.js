const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth, adminOnly } = require("../middleware/auth.middleware");

// Routes protégées par authentification
router.use(auth);

// Route pour obtenir tous les utilisateurs (admin uniquement)
router.get("/", adminOnly, userController.getAllUsers);

// Route pour obtenir un utilisateur par ID
router.get("/:id", userController.getUserById);

// Route pour mettre à jour un utilisateur
router.put("/:id", userController.updateUser);

// Route pour supprimer un utilisateur
router.delete("/:id", userController.deleteUser);

module.exports = router;
