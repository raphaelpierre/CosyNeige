# Configuration Apple Pay pour Chalet-Balmotte810

## ✅ Fichiers Déjà Configurés

### 1. Fichier de vérification Apple Pay
- **Emplacement** : `/public/.well-known/apple-developer-merchantid-domain-association`
- **Status** : ✅ Créé et configuré
- **URL accessible** : `https://chalet-balmotte810.com/.well-known/apple-developer-merchantid-domain-association`

### 2. Configuration Next.js
- **Fichier** : `next.config.ts`
- **Status** : ✅ Headers configurés pour servir le fichier avec le bon Content-Type

### 3. Configuration Stripe Payment
- **Fichier** : `components/payment/PaymentForm.tsx`
- **Status** : ✅ Apple Pay et Google Pay activés dans le PaymentElement
- **Ordre** : Apple Pay → Google Pay → Carte → PayPal

## 📋 Étapes à Suivre dans Stripe Dashboard

### 1. Activer Apple Pay dans Stripe
1. Connectez-vous à votre **Stripe Dashboard**
2. Allez dans **Settings** → **Payment Methods**
3. Trouvez **Apple Pay** et cliquez sur **Enable**

### 2. Enregistrer votre domaine
1. Dans la section Apple Pay, cliquez sur **Add domain**
2. Entrez votre domaine : `chalet-balmotte810.com`
3. Stripe va vérifier automatiquement le fichier à l'URL :
   ```
   https://chalet-balmotte810.com/.well-known/apple-developer-merchantid-domain-association
   ```
4. Si la vérification réussit, votre domaine sera validé ✅

### 3. Activer les méthodes de paiement
Assurez-vous que ces méthodes sont activées :
- ✅ Cards (Cartes bancaires)
- ✅ Apple Pay
- ✅ Google Pay
- ✅ PayPal (si souhaité)

## 🧪 Test

### En Production (HTTPS requis)
Une fois déployé sur `https://chalet-balmotte810.com` :

**Sur Safari iOS/macOS** :
- Ouvrez une session de réservation
- Arrivez à l'étape de paiement
- Vous devriez voir **Apple Pay** comme première option si :
  - Vous utilisez Safari
  - Vous avez configuré Apple Pay sur votre appareil
  - Le domaine est vérifié dans Stripe

**Sur Chrome Android/Desktop** :
- Vous verrez **Google Pay** si configuré

### En Local (Développement)
- Apple Pay ne fonctionnera **PAS** en local (nécessite HTTPS)
- Vous pouvez tester avec :
  - Google Pay (si Chrome)
  - Cartes bancaires de test Stripe
  - PayPal

## 🔐 Sécurité

Le fichier `apple-developer-merchantid-domain-association` contient :
- Le certificat Apple Pay fourni par Stripe
- Aucune information sensible
- Il est public et peut être téléchargé par Apple pour vérification

## 📊 Méthodes de Paiement Disponibles

### Sur iOS (Safari)
1. 🍎 **Apple Pay** (si configuré)
2. 💳 **Carte bancaire**
3. 💰 **PayPal**

### Sur Android (Chrome)
1. 🤖 **Google Pay** (si configuré)
2. 💳 **Carte bancaire**
3. 💰 **PayPal**

### Desktop
1. 🍎 **Apple Pay** (Safari sur Mac avec Touch ID/Face ID)
2. 🤖 **Google Pay** (Chrome)
3. 💳 **Carte bancaire**
4. 💰 **PayPal**

## 🚀 Déploiement

Après avoir poussé ces modifications sur Vercel :
1. Le fichier `.well-known/apple-developer-merchantid-domain-association` sera automatiquement déployé
2. Il sera accessible à `https://chalet-balmotte810.com/.well-known/apple-developer-merchantid-domain-association`
3. Allez dans Stripe Dashboard pour vérifier le domaine
4. Apple Pay sera automatiquement disponible pour les utilisateurs Safari

## 🔗 Ressources

- [Stripe Apple Pay Documentation](https://stripe.com/docs/apple-pay)
- [Apple Pay on the Web](https://developer.apple.com/apple-pay/)
- [Stripe Payment Element](https://stripe.com/docs/payments/payment-element)

## ✨ C'est Tout !

Une fois le domaine vérifié dans Stripe Dashboard, Apple Pay fonctionnera automatiquement pour tous vos clients utilisant Safari sur iOS ou macOS ! 🎉
