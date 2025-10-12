# Configuration Email pour Vercel 📧

Ce guide vous explique comment configurer le système d'email du Chalet-Balmotte810 pour qu'il fonctionne avec Vercel.

## 1. Choix du Service Email

Nous utilisons **Resend** car il est :
- ✅ Parfaitement intégré avec Vercel
- ✅ Simple à configurer
- ✅ Excellent taux de délivrabilité
- ✅ Interface moderne et intuitive

## 2. Configuration Resend

### Étape 1 : Créer un compte Resend
1. Aller sur https://resend.com
2. Créer un compte gratuit
3. Confirmer votre email

### Étape 2 : Obtenir la clé API
1. Dans le dashboard Resend, aller dans "API Keys"
2. Cliquer sur "Create API Key"
3. Donner un nom (ex: "Chalet-Balmotte810")
4. Copier la clé générée

### Étape 3 : Configurer le domaine
1. Dans Resend, aller dans "Domains"
2. Ajouter votre domaine (ex: chalet-balmotte810.com)
3. Suivre les instructions DNS fournies par Resend
4. Attendre la vérification (peut prendre quelques heures)

## 3. Configuration Vercel

### Variables d'environnement à ajouter dans Vercel :

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
ADMIN_EMAIL=admin@chalet-balmotte810.fr
NEXT_PUBLIC_BASE_URL=https://chalet-balmotte810.vercel.app
```

### Comment ajouter les variables dans Vercel :
1. Aller dans votre projet Vercel
2. Settings → Environment Variables
3. Ajouter chaque variable :
   - Name: `RESEND_API_KEY`
   - Value: Votre clé API Resend
   - Environments: Production, Preview, Development

## 4. Test du Système

### Tester localement :
```bash
# Créer un fichier .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
ADMIN_EMAIL=votre-email@example.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Lancer le serveur
npm run dev
```

### Tester en production :
1. Faire une réservation test
2. Vérifier que les emails arrivent
3. Tester le formulaire de contact

## 5. Emails Automatiques Configurés

### 📧 Email de confirmation client
- Envoyé automatiquement lors d'une réservation
- Contient les détails de la réservation
- Template HTML responsive

### 📧 Email de notification admin
- Envoyé à chaque nouvelle réservation
- Contient toutes les informations client
- Lien direct vers l'interface admin

### 📧 Email de contact
- Envoyé depuis le formulaire de contact
- Transmis directement à l'admin
- Possibilité de répondre directement

## 6. Alternatives si Resend ne fonctionne pas

### Option 2 : SendGrid
```bash
npm install @sendgrid/mail
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
```

### Option 3 : Nodemailer + Gmail
```bash
npm install nodemailer
GMAIL_USER=votre-email@gmail.com
GMAIL_APP_PASSWORD=votre-mot-de-passe-app
```

## 7. Dépannage

### Problèmes courants :

**Emails non reçus :**
- Vérifier les spams
- Confirmer la configuration DNS du domaine
- Vérifier les variables d'environnement Vercel

**Erreur de clé API :**
- Régénérer la clé dans Resend
- Mettre à jour dans Vercel
- Redéployer l'application

**Domaine non vérifié :**
- Attendre 24h pour la propagation DNS
- Utiliser temporairement le domaine resend.dev
- Vérifier les enregistrements DNS

## 8. Monitoring

### Vérifier les logs Vercel :
1. Aller dans Functions → View Function Logs
2. Rechercher les erreurs email
3. Vérifier les appels API

### Dashboard Resend :
- Voir tous les emails envoyés
- Statistiques de délivrabilité
- Logs d'erreurs détaillés

## 🎯 Résultat Final

Une fois configuré, le système enverra automatiquement :
- ✅ Confirmations de réservation aux clients
- ✅ Notifications d'admin pour nouvelles réservations  
- ✅ Messages de contact transmis à l'admin
- ✅ Templates HTML professionnels
- ✅ Gestion d'erreurs robuste