const User = require("../models/user.model");
const sequelize = require("../config/db.config");

// Obtenir tous les utilisateurs (admin uniquement)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    console.error("Erreur de récupération des utilisateurs:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur de récupération de l'utilisateur:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.params.id;

    // Vérifier si l'utilisateur est autorisé à mettre à jour ce profil
    if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .json({ message: "Non autorisé à mettre à jour ce profil" });
    }

    // Vérifier si le nouveau username ou email existe déjà
    if (username || email) {
      const whereClause = {
        id: { [sequelize.Sequelize.Op.ne]: userId },
      };

      if (username) whereClause.username = username;
      if (email) whereClause.email = email;

      const existingUser = await User.findOne({ where: whereClause });
      if (existingUser) {
        return res.status(400).json({
          message: "Cet email ou nom d'utilisateur est déjà utilisé",
        });
      }
    }

    // Mettre à jour l'utilisateur
    await User.update(req.body, {
      where: { id: userId },
      individualHooks: true, // Pour déclencher les hooks (comme pour le hachage du mot de passe)
    });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur de mise à jour de l'utilisateur:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifier si l'utilisateur est autorisé à supprimer ce profil
    if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .json({ message: "Non autorisé à supprimer ce profil" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer l'utilisateur
    await User.destroy({ where: { id: userId } });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur de suppression de l'utilisateur:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};
