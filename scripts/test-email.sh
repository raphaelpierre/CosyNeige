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
echo "  RESEND_API_KEY: ${RESEND_API_KEY:0:10}..."
echo "  ADMIN_EMAIL: $ADMIN_EMAIL"
echo "  NEXT_PUBLIC_BASE_URL: $NEXT_PUBLIC_BASE_URL"
echo ""

# Exécuter le test
npx tsx test-email.ts
