const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    // Récupération du token depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Accès non autorisé, token manquant" });
    }

    const token = authHeader.split(" ")[1];

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupération de l'utilisateur
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Ajout de l'utilisateur à l'objet request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Accès refusé, réservé aux administrateurs" });
  }
};

module.exports = { auth, adminOnly };
