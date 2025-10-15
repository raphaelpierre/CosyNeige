# 🔐 Guide d'Accès Administrateur

Guide pour accéder au panel d'administration de Chalet Balmotte 810.

---

## 🎯 Informations de Connexion

### Credentials Admin Production

```
Email:     admin@chalet-balmotte810.com
Mot de passe: [Défini lors de la création du compte admin]
```

### Credentials Admin Développement

```
Email:     admin@chalet-balmotte810.com
Mot de passe: admin123!
```

⚠️ **Important** : Changez le mot de passe admin par défaut en production !

---

## 🚀 Accès au Panel Admin

### Méthode 1 : Connexion Standard (Recommandée)

1. **Ouvrir la page de connexion**
   ```
   Production:    https://www.chalet-balmotte810.com/client/login
   Développement: http://localhost:3000/client/login
   ```

2. **Entrer les identifiants admin**
   - Email : `admin@chalet-balmotte810.com`
   - Mot de passe : Votre mot de passe admin

3. **Se connecter**

4. **Accéder au panel**
   - Cliquer sur votre **avatar** en haut à droite
   - Sélectionner **"⚡ Panneau Admin"** dans le menu dropdown

5. **Vous êtes sur le dashboard admin !**

### Méthode 2 : Accès Direct

Si vous êtes déjà connecté en tant qu'admin :

```
Production:    https://www.chalet-balmotte810.com/admin
Développement: http://localhost:3000/admin
```

---

## 🛠️ Fonctionnalités Admin Disponibles

### 📊 Dashboard
- Vue d'ensemble des statistiques
- Réservations récentes
- Messages non lus
- Revenus du mois

### 📅 Gestion des Réservations
- **Voir toutes les réservations** (passées, en cours, futures)
- **Modifier statut** (pending, confirmed, cancelled)
- **Modifier statut paiement** (none, partial, paid, refunded)
- **Voir détails complets** (client, dates, prix, message)
- **Générer factures PDF**
- **Supprimer réservations**

### 👥 Gestion des Utilisateurs
- **Liste tous les utilisateurs**
- **Voir profils complets**
- **Modifier rôles** (client ↔ admin)
- **Supprimer utilisateurs**
- **Voir historique réservations par utilisateur**

### 💬 Gestion des Messages
- **Lire tous les messages de contact**
- **Marquer comme lu/non lu**
- **Répondre aux messages**
- **Supprimer messages**
- **Filtrer par statut**

### 📈 Statistiques & Rapports
- **Taux d'occupation** par période
- **Revenus totaux** et par mois
- **Nombre de réservations**
- **Clients récurrents**

### 🗓️ Gestion du Calendrier
- **Voir périodes réservées**
- **Bloquer périodes** (maintenance, personnel)
- **Débloquer périodes**

---

## 🔧 Créer un Compte Admin

### En Développement

```bash
# Via Prisma Studio
npx prisma studio

# Ou via script
npm run db:studio
```

1. Ouvrir **Users** table
2. **Add record**
3. Remplir :
   ```
   email:     admin@chalet-balmotte810.com
   password:  [Hash bcrypt du mot de passe]
   firstName: Admin
   lastName:  Chalet
   role:      admin
   phone:     +33123456789
   ```

### Générer Hash Bcrypt

```javascript
// Node.js REPL ou script
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('votre-mot-de-passe', 12);
console.log(hash);
```

### En Production

```bash
# Via Vercel Postgres ou Neon Console
# Exécuter requête SQL directe

INSERT INTO "User" (
  id, email, password, "firstName", "lastName",
  role, phone, "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@chalet-balmotte810.com',
  '[hash-bcrypt]',
  'Admin',
  'Chalet',
  'admin',
  '+33123456789',
  NOW(),
  NOW()
);
```

---

## 🛡️ Sécurité Admin

### Bonnes Pratiques

1. **Mot de passe fort**
   - Minimum 12 caractères
   - Majuscules + minuscules + chiffres + symboles
   - Exemple : `Ch@let2024!Admin#Secure`

2. **Changer le mot de passe par défaut**
   ```bash
   # Immédiatement après première connexion
   ```

3. **Ne pas partager credentials**
   - Créer comptes séparés si plusieurs admins
   - Utiliser gestionnaire de mots de passe

4. **Sessions sécurisées**
   - Se déconnecter après utilisation
   - JWT tokens avec expiration automatique
   - Cookies sécurisés (httpOnly, secure)

5. **Monitoring des accès**
   - Vérifier logs régulièrement
   - Surveiller activités suspectes

### Permissions Admin vs Client

| Fonctionnalité | Client | Admin |
|----------------|--------|-------|
| Voir ses réservations | ✅ | ✅ |
| Voir toutes réservations | ❌ | ✅ |
| Modifier réservations | ❌ | ✅ |
| Gérer utilisateurs | ❌ | ✅ |
| Voir messages | ✅ (siens) | ✅ (tous) |
| Générer factures | ❌ | ✅ |
| Bloquer périodes | ❌ | ✅ |
| Statistiques | ❌ | ✅ |

---

## 🐛 Dépannage

### Problème : "Identifiants incorrects"

**Solutions** :
1. Vérifier email (sensible à la casse)
2. Vérifier mot de passe
3. Vérifier compte existe dans DB
4. Vérifier hash bcrypt correct

### Problème : "Accès refusé au panel admin"

**Solutions** :
1. Vérifier `role = "admin"` dans DB
2. Vider cache navigateur (F12 > Application > Clear Storage)
3. Se déconnecter et reconnecter
4. Vérifier token JWT valide

### Problème : "Page admin ne charge pas"

**Solutions** :
1. Vérifier connexion internet
2. Vérifier serveur fonctionne (dev) ou déploiement OK (prod)
3. Vérifier console navigateur (F12) pour erreurs
4. Vérifier logs Vercel (production)

### Problème : "Impossible de créer compte admin"

**Solutions** :
1. Vérifier connexion DB
2. Utiliser hash bcrypt valide (12 rounds)
3. Vérifier contraintes DB (email unique)
4. Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour setup DB

---

## 📝 API Admin Endpoints

### Authentification
```
POST /api/auth/login
Body: { email, password }
```

### Vérifier User Actuel
```
GET /api/auth/me
Headers: { Cookie: token }
```

### Réservations Admin
```
GET    /api/admin/reservations      # Toutes réservations
PUT    /api/admin/reservations/[id] # Modifier réservation
DELETE /api/admin/reservations/[id] # Supprimer réservation
```

### Utilisateurs Admin
```
GET    /api/admin/users      # Tous utilisateurs
PUT    /api/admin/users/[id] # Modifier utilisateur
DELETE /api/admin/users/[id] # Supprimer utilisateur
```

### Messages Admin
```
GET    /api/admin/messages      # Tous messages
DELETE /api/admin/messages/[id] # Supprimer message
```

### Factures Admin
```
POST /api/admin/invoices
Body: { reservationId }
```

---

## 🔄 Workflow Admin Typique

### Traiter une Nouvelle Réservation

1. **Recevoir notification email** (si configuré)
2. **Se connecter au panel admin**
3. **Aller dans "Réservations"**
4. **Voir nouvelle réservation** (statut: pending)
5. **Vérifier détails client** et dates
6. **Confirmer réservation** (changer statut: confirmed)
7. **Générer facture PDF** si besoin
8. **Envoyer confirmation au client**

### Gérer un Message de Contact

1. **Voir notification** message non lu
2. **Aller dans "Messages"**
3. **Lire message**
4. **Répondre via email** ou téléphone
5. **Marquer comme lu**

### Bloquer une Période

1. **Aller dans "Calendrier"**
2. **Sélectionner dates** à bloquer
3. **Ajouter raison** (ex: "Maintenance")
4. **Confirmer blocage**
5. **Période invisible** pour nouveaux clients

---

## 📚 Ressources Complémentaires

- [README.md](README.md) - Documentation générale projet
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guide déploiement
- [EMAIL_SETUP.md](EMAIL_SETUP.md) - Configuration emails

---

## 📞 Support Technique

**Problèmes d'accès admin** :
- Vérifier logs application
- Consulter documentation Vercel
- Ouvrir issue GitHub si bug

**Contact développeur** :
- GitHub: [@raphaelpierre](https://github.com/raphaelpierre)
- Repository: [CosyNeige](https://github.com/raphaelpierre/CosyNeige)

---

*Dernière mise à jour : Octobre 2025*
