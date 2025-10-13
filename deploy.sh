#!/bin/bash

# Script de déploiement Vercel + NeonDB
echo "🚀 Déploiement Chalet Les Sires sur Vercel avec NeonDB"

# Vérifications préalables
echo "📋 Vérifications préalables..."

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non trouvé. Installation..."
    npm install -g vercel
fi

# Vérifier la connexion NeonDB locale
echo "🔍 Test de connexion NeonDB..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Connexion NeonDB OK"
else
    echo "❌ Erreur de connexion NeonDB"
    exit 1
fi

# Build local pour vérifier
echo "🏗️  Build local..."
if npm run build; then
    echo "✅ Build réussi"
else
    echo "❌ Erreur de build"
    exit 1
fi

# Déploiement
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "📝 N'oubliez pas de :"
echo "   1. Configurer les variables d'environnement dans Vercel Dashboard"
echo "   2. Tester les API en production"
echo "   3. Vérifier les logs avec 'vercel logs'"