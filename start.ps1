# Installer les dépendances et démarrer le serveur
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Installation terminée avec succès, démarrage du serveur..."
    npm run dev
}
else {
    Write-Host "Erreur lors de l'installation des dépendances"
    exit 1
}
