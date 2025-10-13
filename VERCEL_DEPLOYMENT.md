# Guide de Déploiement Vercel + NeonDB

## Prérequis
- [x] Projet NeonDB configuré
- [x] Application Next.js prête
- [x] CLI Vercel installé (`npm i -g vercel`)

## Étapes de déploiement

### 1. Préparer les variables d'environnement

Dans le dashboard Vercel de votre projet, configurez ces variables :

#### Variables essentielles
```bash
DATABASE_URL=postgresql://neondb_owner:npg_eJ3MZi5gyUqN@ep-odd-band-adxde2pk-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-production
NEXTAUTH_SECRET=your-nextauth-secret-production
NEXTAUTH_URL=https://your-app.vercel.app
```

#### Variables email (Resend)
```bash
RESEND_API_KEY=re_T9vciQHL_A4CNcikcHGpuEtQdMAbdLwCy
ADMIN_EMAIL=info@chalet-balmotte810.com
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

#### Variables Stack (si utilisées)
```bash
NEXT_PUBLIC_STACK_PROJECT_ID=9b694b8f-87f3-4d94-bcc3-06e2b1fc0cfd
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_j1cjy54a1zsw3fpc4jgkwyd8r3pykf6g58214fjdndt80
STACK_SECRET_SERVER_KEY=ssk_zkgh1saj3ysvf1m77jk8ay1p24ymj5cf21ac05dgre7a0
```

### 2. Déployer via CLI

```bash
# Connectez-vous à Vercel
vercel login

# Déployez en production
vercel --prod
```

### 3. Alternative : Déploiement GitHub

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement dans le dashboard
3. Chaque push sur `main` déclenche un déploiement automatique

### 4. Vérifications post-déploiement

- [ ] Application accessible sur l'URL Vercel
- [ ] API `/api/auth/register` fonctionnelle
- [ ] API `/api/reservations` fonctionnelle
- [ ] Connexion NeonDB établie (pas d'erreurs 500)

### 5. Optimisations NeonDB + Vercel

✅ **Connection Pooling** : Activé automatiquement avec l'adapter NeonDB
✅ **Cold Start Optimization** : Configuration Prisma optimisée
✅ **Serverless Functions** : Durée max 30s configurée
✅ **Environment Variables** : Sécurisées via Vercel Dashboard

### 6. Surveillance et Monitoring

- **Vercel Analytics** : Déjà intégré (`@vercel/analytics`)
- **Speed Insights** : Déjà intégré (`@vercel/speed-insights`)
- **NeonDB Dashboard** : Monitoring des performances DB

## Commandes utiles

```bash
# Déploiement preview
vercel

# Déploiement production
vercel --prod

# Voir les logs
vercel logs

# Voir les variables d'env
vercel env ls
```

## Troubleshooting

### Erreur de connexion DB
- Vérifier `DATABASE_URL` dans Vercel dashboard
- Confirmer que NeonDB permet les connexions externes
- Vérifier les logs avec `vercel logs`

### Erreur de build Prisma
- `PRISMA_GENERATE_SKIP_AUTOINSTALL=true` configuré dans vercel.json
- Script `postinstall` présent dans package.json

### Timeout des fonctions
- Durée max configurée à 30s dans vercel.json
- Optimiser les requêtes DB si nécessaire