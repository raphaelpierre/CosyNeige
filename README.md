# 🏔️ Chalet Balmotte 810

Une plateforme de réservation moderne pour un chalet alpin premium dans les Alpes françaises.

**🌐 Site Web:** https://www.chalet-balmotte810.com

---

## ✨ Fonctionnalités Principales

### 🏠 Chalet de Luxe
- **Capacité 10 personnes** - 4 chambres, 3 salles de bains (200m²)
- **Équipements premium** - Sauna privatif, jacuzzi extérieur, cheminée, local à ski
- **Localisation stratégique** - Entre vallées de l'Arve et du Giffre
- **Accès à 5 stations de ski** en moins de 30 minutes

### 📱 Système de Réservation
- **Calendrier interactif** avec vérification temps réel des disponibilités
- **Calculateur de prix automatique** avec tarifs saisonniers
- **Paiements sécurisés** (Stripe + virement bancaire)
- **Génération de factures PDF** professionnelles
- **Confirmation instantanée** par email

### 👥 Gestion Utilisateurs
- **Authentification sécurisée** (JWT + bcrypt)
- **Dashboard client** - Historique réservations, profil, messages
- **Panel admin** - Gestion complète réservations, utilisateurs, messages
- **Système de messagerie** intégré

### 🌍 Interface Multilingue
- **Support bilingue** complet (Français/English)
- **Traductions contextuelles** avec hook personnalisé
- **SEO optimisé** pour les deux langues

---

## 🛠️ Stack Technique

### Frontend
- **Next.js 15.5.4** (App Router)
- **React 19.1.0** avec TypeScript
- **Tailwind CSS 4.0**
- **jsPDF + html2canvas** pour génération PDF
- **React DatePicker** pour calendrier

### Backend & Base de Données
- **Prisma ORM** avec PostgreSQL (Neon)
- **NextAuth.js** pour authentification
- **JWT tokens** pour sessions
- **bcryptjs** pour sécurité mots de passe

### Paiements & Communication
- **Stripe** pour paiements en ligne
- **Resend** pour notifications email
- **Support virement bancaire**

### Déploiement
- **Vercel** (production)
- **Vercel Analytics** & **Speed Insights**
- **GitHub** pour versioning

---

## 📊 Architecture Base de Données

```prisma
User           # Comptes utilisateurs (clients + admin)
├─ id, email, password, role
├─ firstName, lastName, phone
└─ reservations[], messages[]

Reservation    # Système de réservation
├─ guestName, firstName, lastName
├─ checkIn, checkOut, guests
├─ totalPrice, status, paymentStatus
└─ userId (relation User)

Message        # Messagerie interne
├─ subject, content
├─ fromUserId, fromEmail, fromName
├─ isFromAdmin, read, replyTo
└─ fromUser (relation User)

ContactMessage # Formulaire contact public
├─ name, email, subject
└─ message, read

BookedPeriod   # Gestion disponibilités
└─ startDate, endDate
```

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- PostgreSQL (recommandé: Neon.tech)
- npm/yarn/pnpm

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/raphaelpierre/CosyNeige.git
cd CosyNeige

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# Éditer .env.local avec vos valeurs :
# DATABASE_URL="postgresql://..."
# NEXTAUTH_SECRET="..." (min 32 caractères)
# NEXTAUTH_URL="http://localhost:3000"
# JWT_SECRET="..." (min 32 caractères)
# RESEND_API_KEY="..." (optionnel)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..." (optionnel)
# STRIPE_SECRET_KEY="..." (optionnel)

# 4. Initialiser la base de données
npx prisma generate
npx prisma db push

# 5. Lancer le serveur de développement
npm run dev

# 6. Ouvrir http://localhost:3000
```

---

## 📁 Structure du Projet

```
CosyNeige/
├── app/                     # Next.js App Router
│   ├── api/                # Routes API
│   │   ├── auth/          # Authentification
│   │   ├── reservations/  # Gestion réservations
│   │   ├── messages/      # Messagerie
│   │   ├── payments/      # Paiements Stripe
│   │   └── admin/         # Endpoints admin
│   ├── booking/           # Flux de réservation
│   ├── client/            # Espace client
│   ├── admin/             # Panel admin
│   ├── gallery/           # Galerie photos
│   ├── location/          # Informations localisation
│   ├── contact/           # Formulaire contact
│   └── guide/             # Guide voyageur
├── components/            # Composants réutilisables
│   ├── booking/          # Composants réservation
│   ├── invoice/          # Génération PDF factures
│   ├── layout/           # Navigation, Footer
│   ├── payment/          # Composants paiement
│   └── ui/               # Composants UI génériques
├── lib/                  # Utilitaires
│   ├── data/            # Données statiques chalet
│   ├── hooks/           # Hooks React personnalisés
│   ├── context/         # Providers contexte
│   ├── translations/    # Support i18n
│   └── utils/           # Fonctions helpers
├── prisma/              # Configuration BDD
│   └── schema.prisma    # Schéma Prisma
└── public/              # Assets statiques
    └── images/          # Images chalet
```

---

## 🎯 API Routes

### Authentification
```
POST   /api/auth/register     # Inscription utilisateur
POST   /api/auth/login        # Connexion
POST   /api/auth/logout       # Déconnexion
GET    /api/auth/me           # Info utilisateur actuel
```

### Réservations
```
GET    /api/reservations      # Liste réservations (user/admin)
POST   /api/reservations      # Créer réservation
PUT    /api/reservations/[id] # Modifier réservation
DELETE /api/reservations/[id] # Annuler réservation
```

### Disponibilités
```
GET    /api/booked-periods    # Périodes réservées
POST   /api/booked-periods    # Bloquer période (admin)
```

### Communication
```
GET    /api/messages          # Récupérer messages
POST   /api/messages          # Envoyer message
POST   /api/contact           # Soumettre formulaire contact
```

### Administration
```
GET    /api/admin/reservations # Toutes réservations
GET    /api/admin/users        # Gestion utilisateurs
GET    /api/admin/messages     # Tous messages
DELETE /api/admin/messages/[id] # Supprimer message
POST   /api/admin/invoices     # Générer facture
```

### Paiements
```
POST   /api/payments/create-payment-intent # Intent Stripe
```

---

## 🎨 Design System

### Palette de Couleurs
- **Primary:** Forest Green `#1a5b3c`
- **Secondary:** Warm Gold `#d4af37`
- **Accent:** Mountain Blue `#2563eb`
- **Neutral:** Warm Grays `#64748b`, `#94a3b8`, `#e2e8f0`

### Composants
- **Cards** - Coins arrondis avec ombres subtiles
- **Buttons** - Gradients avec effets hover
- **Forms** - Labels clairs avec états validation
- **Modals** - Overlays centrés avec backdrop blur

---

## 🔐 Sécurité

- **Hashing mots de passe** - bcryptjs (12 rounds)
- **Gestion sessions JWT** avec secrets sécurisés
- **Protection XSS** via validation entrées
- **Protection CSRF** via NextAuth.js
- **Contrôle accès par rôles** (client/admin)
- **Routes API protégées** avec middleware authentification

---

## 📈 Optimisations Performance

- **Code splitting automatique** (Next.js App Router)
- **Génération statique** pour contenu public
- **Optimisation images** (Next.js Image)
- **Lazy loading** galeries photos
- **Optimisation requêtes DB** (Prisma)
- **Edge Functions** (Vercel)

---

## 🚀 Déploiement Production

### Déploiement Vercel

```bash
# Via CLI
npx vercel --prod

# Ou push sur main (déploiement auto)
git push origin main
```

### Variables d'Environnement Vercel

Configurer dans Dashboard Vercel > Settings > Environment Variables :

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-32-chars-min
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your-jwt-secret-32-chars-min
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@your-domain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour instructions détaillées.

---

## 🛣️ Roadmap

### ✅ Phase 1 - Complétée
- Interface réservation unifiée
- Génération factures PDF
- Système paiement multiple
- Déploiement Vercel

### 🚧 Phase 2 - En cours
- Flux Stripe complet
- Emails automatiques confirmations
- Système remboursements

### 📋 Phase 3 - Planifiée
- Synchronisation calendriers externes (Airbnb, Booking.com)
- Système avis clients
- Tarification dynamique
- Analytics avancés
- Application mobile React Native

---

## 🤝 Contribution

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Guidelines Développement
- Suivre les best practices TypeScript
- Utiliser Tailwind CSS pour styling
- Implémenter gestion erreurs appropriée
- Ajouter commentaires JSDoc
- Assurer responsiveness mobile
- Tester avec les deux langues (FR/EN)

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour détails.

---

## 📞 Contact

**Développeur:** Raphaël Pierre
**GitHub:** [@raphaelpierre](https://github.com/raphaelpierre)
**Repository:** [CosyNeige](https://github.com/raphaelpierre/CosyNeige)
**Site Web:** [chalet-balmotte810.com](https://www.chalet-balmotte810.com)

---

## 📚 Documentation Complémentaire

- [Guide de Déploiement](DEPLOYMENT.md) - Instructions déploiement détaillées
- [Configuration Email](EMAIL_SETUP.md) - Setup emails avec Resend
- [Accès Admin](ADMIN_LOGIN_GUIDE.md) - Guide connexion administrateur

---

*Construit avec ❤️ pour les montagnes | Déployé sur Vercel | Propulsé par Next.js*
