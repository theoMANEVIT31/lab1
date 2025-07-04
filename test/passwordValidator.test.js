const validatePassword = require("../src/utils/passwordValidator");

// Définition des règles pour des tests plus lisibles
const rules = {
  notEmpty: "notEmpty",
  minLength: "minLength",
  maxLength: "maxLength",
  hasUppercase: "hasUppercase",
  hasLowercase: "hasLowercase",
  hasNumber: "hasNumber",
  hasSpecialChar: "hasSpecialChar",
  noSpaces: "noSpaces",
  noConsecutiveChars: "noConsecutiveChars",
  noUsername: "noUsername",
  notCommonPassword: "notCommonPassword",
  complexityCheck: "complexityCheck",
  strengthEvaluation: "strengthEvaluation",
};

describe("PasswordValidator", () => {
  describe("Tests de base", () => {
    test("un mot de passe vide est invalide", () => {
      const result = validatePassword("", "", [rules.notEmpty]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Le mot de passe ne peut pas être vide");
    });

    test("un mot de passe valide renvoie isValid=true", () => {
      const result = validatePassword("ValidP@ss123");
      expect(result.isValid).toBe(true);
    });
  });
  describe("Longueur du mot de passe", () => {
    test("le mot de passe doit contenir au moins 6 caractères", () => {
      const result = validatePassword("Ab1@5", "", [rules.minLength]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins 6 caractères"
      );
    });

    test("le mot de passe ne doit pas dépasser 20 caractères", () => {
      const longPassword = "Abcdef1234567890@abcdef";
      const result = validatePassword(longPassword, "", [rules.maxLength]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe ne doit pas dépasser 20 caractères"
      );
    });
  });

  describe("Caractères requis", () => {
    test("le mot de passe doit contenir au moins une lettre majuscule", () => {
      const result = validatePassword("abcdef123@", "", [rules.hasUppercase]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins une lettre majuscule"
      );
    });

    test("le mot de passe doit contenir au moins une lettre minuscule", () => {
      const result = validatePassword("ABCDEF123@", "", [rules.hasLowercase]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins une lettre minuscule"
      );
    });

    test("le mot de passe doit contenir au moins un chiffre", () => {
      const result = validatePassword("Abcdef@#$", "", [rules.hasNumber]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins un chiffre"
      );
    });

    test("le mot de passe doit contenir au moins un caractère spécial", () => {
      const result = validatePassword("Abcdef123", "", [rules.hasSpecialChar]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins un caractère spécial"
      );
    });
  });

  describe("Restrictions sur le contenu", () => {
    test("le mot de passe ne doit pas contenir d'espaces", () => {
      const result = validatePassword("Valid Pass123", "", [rules.noSpaces]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe ne doit pas contenir d'espaces"
      );
    });

    test("le mot de passe ne doit pas contenir 4 caractères consécutifs identiques", () => {
      const result = validatePassword("Valid1111Pass", "", [
        rules.noConsecutiveChars,
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe ne doit pas contenir 4 caractères consécutifs identiques"
      );
    });

    test("le mot de passe ne doit pas contenir le nom d'utilisateur", () => {
      const result = validatePassword("ValidUser123", "User", [
        rules.noUsername,
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe ne doit pas contenir le nom d'utilisateur"
      );
    });

    test("le mot de passe ne peut pas être un mot de passe courant", () => {
      const result = validatePassword("password", "", [
        rules.notCommonPassword,
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe ne peut pas contenir de mots de passe couramment utilisés"
      );
    });
  });

  describe("Évaluation de la complexité", () => {
    test("le mot de passe doit avoir une complexité suffisante", () => {
      const result = validatePassword("abcdef", "", [rules.complexityCheck]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins 3 des 4 types suivants: majuscules, minuscules, chiffres et caractères spéciaux"
      );
    });

    test("la complexité est validée avec 3 types de caractères", () => {
      const result = validatePassword("Abcdef123", "", [rules.complexityCheck]);
      expect(result.errors).not.toContain(
        "Le mot de passe doit contenir au moins 3 des 4 types suivants: majuscules, minuscules, chiffres et caractères spéciaux"
      );
    });
  });

  describe("Évaluation de la force du mot de passe", () => {
    test("évaluation: mot de passe trop faible", () => {
      const result = validatePassword("aaaaaa", "", [rules.strengthEvaluation]);
      expect(result.errors).toContain("Le mot de passe est trop faible");
    });

    test("évaluation: mot de passe faible", () => {
      const result = validatePassword("abcdef7", "", [
        rules.strengthEvaluation,
      ]);
      expect(result.errors).toContain("Le mot de passe est faible");
    });

    test("évaluation: mot de passe moyen", () => {
      const result = validatePassword("Abcdef7", "", [
        rules.strengthEvaluation,
      ]);
      expect(result.errors).toContain("Le mot de passe est moyen");
    });

    test("évaluation: mot de passe fort", () => {
      const result = validatePassword("Abcde123!@#Fgh", "", [
        rules.strengthEvaluation,
      ]);   
      expect(result.errors).toContain("Le mot de passe est fort");
    });
  });

  describe("Tests de combinaisons de règles", () => {
    test("plusieurs règles échouent simultanément", () => {
      const result = validatePassword("abc", "", [
        rules.minLength,
        rules.hasUppercase,
        rules.hasNumber,
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins 6 caractères"
      );
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins une lettre majuscule"
      );
      expect(result.errors).toContain(
        "Le mot de passe doit contenir au moins un chiffre"
      );
    });

    test("comportement par défaut applique toutes les règles", () => {
      const result = validatePassword("password");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe("Cas limites", () => {
    test("longueur exacte de 6 caractères est valide", () => {
      const result = validatePassword("Abc@12", "", [rules.minLength]);
      expect(result.isValid).toBe(true);
      expect(result.errors).not.toContain(
        "Le mot de passe doit contenir au moins 6 caractères"
      );
    });

    test("longueur exacte de 20 caractères est valide", () => {
      const exactLength = "Abcdef1234567890@abc"; // 20 caractères
      const result = validatePassword(exactLength, "", [rules.maxLength]);
      expect(result.isValid).toBe(true);
      expect(result.errors).not.toContain(
        "Le mot de passe ne doit pas dépasser 20 caractères"
      );
    });

    test("le nom d'utilisateur vide ne devrait pas affecter la validation", () => {
      const result = validatePassword("ValidPass123@", "", [rules.noUsername]);
      expect(result.isValid).toBe(true);
      expect(result.errors).not.toContain(
        "Le mot de passe ne doit pas contenir le nom d'utilisateur"
      );
    });
  });

  describe("Validation basée sur la force", () => {
    test("un mot de passe est valide s'il est moyen sans erreurs critiques", () => {
      // Mot de passe 'moyen' qui respecte les règles mais n'est pas 'fort'
      const result = validatePassword("Abcdef7", "", [
        rules.minLength,
        rules.hasUppercase,
        rules.hasLowercase,
        rules.hasNumber,
        rules.strengthEvaluation,
      ]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toContain("Le mot de passe est moyen");
    });

    test("un mot de passe faible mais qui respecte les règles n'est pas valide", () => {
      const result = validatePassword("abcdef7", "", [
        rules.minLength,
        rules.hasLowercase,
        rules.hasNumber,
        rules.strengthEvaluation,
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Le mot de passe est faible");
    });

    test("un mot de passe fort avec quelques erreurs mineures est valide", () => {
      // Fort mais contient une séquence commun '123'
      const result = validatePassword("Abcde123!@#Fgh", "", [
        rules.minLength,
        rules.hasUppercase,
        rules.hasLowercase,
        rules.hasNumber,
        rules.hasSpecialChar,
        rules.strengthEvaluation,
      ]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toContain("Le mot de passe est fort");
    });

    test("un mot de passe avec des erreurs critiques n'est pas valide même s'il est fort", () => {
      // Fort mais trop long
      const longPassword = "Abcdef1234567890@abcdefghijkl";
      const result = validatePassword(longPassword, "", [
        rules.maxLength,
        rules.strengthEvaluation,
      ]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Le mot de passe ne doit pas dépasser 20 caractères"
      );
    });
  });
});
