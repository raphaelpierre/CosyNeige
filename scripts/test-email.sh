#!/bin/bash

# Script wrapper pour charger les variables d'environnement et exécuter le test

echo "📧 Chargement des variables d'environnement depuis .env..."

# Charger les variables depuis .env
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
  echo "✅ Variables chargées"
else
  echo "❌ Fichier .env non trouvé"
  exit 1
fi

# Afficher les configs (masquer les valeurs sensibles)
echo ""
echo "Configuration:"
echo "  SMTP_HOST: $SMTP_HOST"
echo "  SMTP_PORT: $SMTP_PORT"
echo "  SMTP_FROM: $SMTP_FROM"
echo "  ADMIN_EMAIL: $ADMIN_EMAIL"
echo "  NEXT_PUBLIC_BASE_URL: $NEXT_PUBLIC_BASE_URL"
echo ""

# Exécuter le test
npx tsx test-email.ts
