const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const sequelize = require("../config/db.config");

// Génération de token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [{ email }, { username }],
      },
    });

    if (userExists) {
      return res.status(400).json({
        message:
          "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà",
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      username,
      email,
      password,
    });

    // Retourner la réponse avec token
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Retourner la réponse avec token
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur de récupération du profil:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du profil" });
  }
};
