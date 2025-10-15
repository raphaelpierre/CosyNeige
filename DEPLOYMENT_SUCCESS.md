# 🚀 Déploiement Vercel - Chalet Balmotte 810

## ✅ Déploiement Réussi !

**URL de Production:** https://www.chalet-balmotte810.com

## 🔧 Configuration

### Variables d'environnement configurées :
- ✅ `DATABASE_URL` - Connexion PostgreSQL NeonDB
- ✅ `JWT_SECRET` - Clé secrète pour l'authentification
- ✅ `RESEND_API_KEY` - API pour l'envoi d'emails
- ✅ `ADMIN_EMAIL` - Email administrateur
- ✅ `NEXT_PUBLIC_BASE_URL` - URL de base de l'application
- ✅ Variables Stripe configurées

### 🔐 Accès Admin

**URL de connexion:** https://www.chalet-balmotte810.com/client/login

**Credentials Admin:**
- Email: `admin@chalet-balmotte810.com`
- Mot de passe: `ChaletAdmin123!`

Une fois connecté, vous serez automatiquement redirigé vers `/admin`

### 📊 Fonctionnalités déployées

1. **Site public** - Page d'accueil, galerie, contact, réservation
2. **Espace client** - Dashboard, messages, réservations
3. **Panel Admin** - Gestion des réservations, utilisateurs, messages, factures
4. **API complète** - Authentification, CRUD operations, emails
5. **Base de données** - PostgreSQL via NeonDB

### 🔍 Test de fonctionnement

- ✅ Page d'accueil: https://www.chalet-balmotte810.com
- ✅ API d'authentification: https://www.chalet-balmotte810.com/api/auth/me
- ✅ Connexion client/admin: https://www.chalet-balmotte810.com/client/login
- ✅ Réservation: https://www.chalet-balmotte810.com/booking

### 🛠️ Commandes de gestion

```bash
# Voir les déploiements
npx vercel ls

# Voir les logs
npx vercel logs [deployment-url]

# Gérer les variables d'environnement
npx vercel env ls
npx vercel env add [NAME] [ENVIRONMENT]
npx vercel env rm [NAME]

# Redéployer
npx vercel --prod
```

### 🎯 Étapes suivantes

1. **Domaine personnalisé** (optionnel)
   ```bash
   npx vercel domains add votre-domaine.com
   npx vercel alias votre-domaine.com
   ```

2. **Monitoring**
   - Dashboard Vercel: https://vercel.com/dashboard
   - Analytics: Activées via `@vercel/analytics`

3. **Maintenance**
   - Les déploiements sont automatiques lors des push sur main
   - Base de données NeonDB gérée automatiquement

## 🔗 Liens utiles

- **Production:** https://www.chalet-balmotte810.com
- **Dashboard Vercel:** https://vercel.com/ras-projects-8da82c27/cosy-neige
- **NeonDB Console:** https://console.neon.tech