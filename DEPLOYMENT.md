# 🚀 Guide de Déploiement - Chalet Balmotte 810

Guide complet pour déployer l'application sur Vercel avec PostgreSQL (Neon).

---

## 📋 Prérequis

- [x] Compte Vercel ([vercel.com](https://vercel.com))
- [x] Compte Neon Database ([neon.tech](https://neon.tech))
- [x] Compte GitHub avec repository pushé
- [x] CLI Vercel installé : `npm i -g vercel`

---

## 🗄️ Étape 1 : Configuration Base de Données

### Option 1 : Neon PostgreSQL (Recommandé)

1. **Créer compte sur** [neon.tech](https://neon.tech)
2. **Créer nouveau projet** :
   - Nom : `chalet-balmotte810`
   - Région : Europe (Frankfurt/Paris)
   - PostgreSQL version : Latest
3. **Récupérer connection string** :
   - Dashboard > Connection String
   - Format : `postgresql://user:password@host/database?sslmode=require`

### Option 2 : Alternatives

**Supabase** ([supabase.com](https://supabase.com))
- Free tier : 500 MB
- Backup automatique
- Interface admin incluse

**PlanetScale** ([planetscale.com](https://planetscale.com))
- Free tier : 1 GB
- Branching database
- Excellent pour scale

---

## 🌐 Étape 2 : Déploiement Vercel

### Option A : Via Dashboard Vercel (Recommandé)

1. **Se connecter à** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Cliquer sur** "New Project"
3. **Importer repository GitHub** `CosyNeige`
4. **Configurer projet** :
   - Framework Preset : Next.js
   - Build Command : `npm run build`
   - Output Directory : `.next`
5. **Configurer variables d'environnement** (voir section suivante)
6. **Cliquer sur** "Deploy"

### Option B : Via CLI Vercel

```bash
# 1. Installer CLI Vercel
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Lier projet
vercel link

# 4. Configurer variables d'env (voir section suivante)

# 5. Déployer en production
vercel --prod
```

---

## 🔐 Étape 3 : Variables d'Environnement

Configurer dans **Vercel Dashboard** > **Settings** > **Environment Variables**

### Variables Essentielles (OBLIGATOIRES)

```bash
# Base de données
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Authentification (générer avec: openssl rand -base64 32)
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=https://your-app.vercel.app
JWT_SECRET=your-jwt-secret-min-32-chars

# Email admin
ADMIN_EMAIL=admin@chalet-balmotte810.com
```

### Variables Emails (Resend - RECOMMANDÉ)

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

**Comment obtenir RESEND_API_KEY** :
1. Créer compte sur [resend.com](https://resend.com)
2. Dashboard > API Keys > Create API Key
3. Copier la clé générée

### Variables Paiement (Stripe - OPTIONNEL)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

**Comment obtenir clés Stripe** :
1. Créer compte sur [stripe.com](https://stripe.com)
2. Dashboard > Developers > API keys
3. Utiliser **test keys** pour dev, **live keys** pour production

### Générer Secrets Sécurisés

```bash
# Générer NEXTAUTH_SECRET
openssl rand -base64 32

# Générer JWT_SECRET
openssl rand -base64 32
```

### Configurer dans Vercel

Pour **chaque variable** :
1. Name : `DATABASE_URL`
2. Value : Votre valeur
3. Environments : ✅ Production ✅ Preview ✅ Development

---

## 🔄 Étape 4 : Migration Base de Données

### Après déploiement initial

```bash
# 1. Récupérer variables d'env depuis Vercel
vercel env pull .env.production

# 2. Générer Prisma Client
npx prisma generate

# 3. Appliquer migrations
npx prisma db push

# Ou via migrations versionnées (production)
npx prisma migrate deploy
```

### Vérifier connexion DB

```bash
# Ouvrir Prisma Studio
npx prisma studio

# Tester connexion
npx prisma db execute --stdin <<< "SELECT NOW();"
```

---

## 🌍 Étape 5 : Domaine Personnalisé (Optionnel)

### Configurer domaine sur Vercel

1. **Dashboard Vercel** > **Settings** > **Domains**
2. **Ajouter domaine** : `chalet-balmotte810.com`
3. **Ajouter www** : `www.chalet-balmotte810.com`

### Configuration DNS chez Registraire

**Pour domaine principal** (`chalet-balmotte810.com`) :
```dns
Type: A     Name: @      Value: 76.76.21.21
```

**Pour sous-domaine www** :
```dns
Type: CNAME Name: www    Value: cname.vercel-dns.com
```

### Mettre à jour NEXTAUTH_URL

```bash
# Changer dans Vercel > Environment Variables
NEXTAUTH_URL=https://www.chalet-balmotte810.com
```

Redéployer après changement :
```bash
vercel --prod
```

---

## ✅ Étape 6 : Vérifications Post-Déploiement

### Checklist Fonctionnelle

- [ ] **Homepage accessible** : `https://your-app.vercel.app`
- [ ] **API Auth fonctionne** : `https://your-app.vercel.app/api/auth/me`
- [ ] **Page login accessible** : `https://your-app.vercel.app/client/login`
- [ ] **Réservation fonctionne** : `https://your-app.vercel.app/booking`
- [ ] **Images se chargent** correctement
- [ ] **Pas d'erreurs 500** dans logs Vercel

### Vérifier Logs Vercel

1. **Dashboard Vercel** > **Deployments**
2. **Cliquer sur dernier déploiement**
3. **Onglet "Functions"** > **View Function Logs**
4. **Chercher erreurs** (rouge)

### Tester Connexion DB

```bash
# Via fonction API de test
curl https://your-app.vercel.app/api/health
```

---

## 🔧 Optimisations Vercel + Neon

### Configuration Prisma pour Serverless

Déjà configuré dans `lib/prisma.ts` :
```typescript
import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

const neon = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(neon)

export const prisma = new PrismaClient({ adapter })
```

### Configuration vercel.json

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "PRISMA_GENERATE_SKIP_AUTOINSTALL": "true"
  }
}
```

---

## 📊 Étape 7 : Monitoring & Analytics

### Vercel Analytics (Déjà intégré)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Surveiller Performances

- **Dashboard Vercel** > **Analytics**
- **Dashboard Neon** > **Monitoring**
- **Vercel Functions** > **Logs**

---

## 🔄 Déploiements Continus

### Déploiement Automatique

**Configuré automatiquement** :
- Push sur `main` → Déploiement production
- Pull request → Déploiement preview
- Autres branches → Pas de déploiement

### Déploiement Manuel

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Voir logs
vercel logs
```

---

## 🐛 Troubleshooting

### Erreur : "DATABASE_URL not found"

**Solution** :
1. Vérifier variable dans Vercel Dashboard
2. Environment : Production ✅
3. Redéployer : `vercel --prod`

### Erreur : "Prisma Client not generated"

**Solution** :
```bash
# Ajouter dans package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Erreur : "Cannot connect to database"

**Solution** :
1. Vérifier DATABASE_URL contient `?sslmode=require`
2. Tester connexion depuis Neon Dashboard
3. Vérifier firewall/IP whitelist (Neon = auto)

### Erreur : "Function timeout after 10s"

**Solution** :
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Erreur : "Module not found" en production

**Solution** :
```bash
# Vérifier dépendance dans dependencies (pas devDependencies)
npm install <package> --save
```

### Emails ne s'envoient pas

**Solution** :
1. Vérifier `RESEND_API_KEY` dans Vercel
2. Vérifier domaine vérifié dans Resend Dashboard
3. Checker Resend Logs pour erreurs

---

## 📝 Commandes Utiles

```bash
# Déploiements
vercel                    # Preview deployment
vercel --prod            # Production deployment
vercel ls                # Liste déploiements
vercel inspect <URL>     # Détails déploiement

# Variables d'environnement
vercel env ls            # Liste variables
vercel env add <NAME>    # Ajouter variable
vercel env rm <NAME>     # Supprimer variable
vercel env pull          # Télécharger variables localement

# Logs
vercel logs <URL>        # Logs déploiement
vercel logs --follow     # Suivre logs en temps réel

# Domaines
vercel domains ls        # Liste domaines
vercel domains add       # Ajouter domaine
vercel alias set         # Créer alias

# Projets
vercel link              # Lier projet local
vercel projects ls       # Liste projets
```

---

## 🎯 Checklist Finale

Avant mise en production :

- [ ] Toutes variables d'environnement configurées
- [ ] Base de données migrée et testée
- [ ] Authentification fonctionnelle
- [ ] Paiements Stripe testés (mode test)
- [ ] Emails Resend configurés
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Analytics activés
- [ ] Logs Vercel vérifiés (pas d'erreurs)
- [ ] Tests utilisateurs effectués
- [ ] Backup base de données configuré

---

## 📚 Ressources Complémentaires

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Documentation Neon** : [neon.tech/docs](https://neon.tech/docs)
- **Documentation Prisma** : [prisma.io/docs](https://prisma.io/docs)
- **Configuration Email** : Voir [EMAIL_SETUP.md](EMAIL_SETUP.md)
- **Accès Admin** : Voir [ADMIN_LOGIN_GUIDE.md](ADMIN_LOGIN_GUIDE.md)

---

## 📞 Support

**Problèmes Vercel** :
- Dashboard > Help
- [vercel.com/support](https://vercel.com/support)

**Problèmes Neon** :
- [neon.tech/discord](https://neon.tech/discord)
- [neon.tech/docs/support](https://neon.tech/docs/support)

**Problèmes Application** :
- GitHub Issues : [github.com/raphaelpierre/CosyNeige/issues](https://github.com/raphaelpierre/CosyNeige/issues)

---

*Dernière mise à jour : Octobre 2025*
