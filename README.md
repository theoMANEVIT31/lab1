# API REST avec Authentification en Express.js

Une API REST simple avec gestion d'authentification d'utilisateurs utilisant Express.js, MySQL et JWT.

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Démarrer en production
npm start
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=api_auth
DB_PORT=3306
JWT_SECRET=votre_secret_jwt_super_securise
NODE_ENV=development
```

### Configuration MySQL

Cette API utilise MySQL comme base de données. Assurez-vous d'avoir :

1. **Installation MySQL** : Installez [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) sur votre machine.
2. **Création de la base de données** : Créez une base de données appelée `api_auth` (ou tout autre nom configuré dans `.env`).

```sql
CREATE DATABASE api_auth;
```

3. **Configuration des informations de connexion** : Modifiez les informations de connexion dans le fichier `.env` en fonction de votre installation MySQL.

## Routes API

### Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur

  - Body: `{ "username": "user", "email": "user@example.com", "password": "password123" }`

- `POST /api/auth/login` - Connexion d'un utilisateur

  - Body: `{ "email": "user@example.com", "password": "password123" }`

- `GET /api/auth/profile` - Obtenir le profil de l'utilisateur connecté (protégé)
  - Header: `Authorization: Bearer <token>`

### Gestion des utilisateurs

- `GET /api/users` - Obtenir tous les utilisateurs (admin uniquement)

  - Header: `Authorization: Bearer <token>`

- `GET /api/users/:id` - Obtenir un utilisateur par ID

  - Header: `Authorization: Bearer <token>`

- `PUT /api/users/:id` - Mettre à jour un utilisateur

  - Header: `Authorization: Bearer <token>`
  - Body: `{ "username": "newUsername", "email": "newemail@example.com" }`

- `DELETE /api/users/:id` - Supprimer un utilisateur
  - Header: `Authorization: Bearer <token>`

## Tests

```bash
# Exécuter les tests
npm test
```
