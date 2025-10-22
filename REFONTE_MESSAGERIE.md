# 🚀 Refonte du Système de Messagerie - DOCUMENTATION

## ✅ Ce qui a été fait

### 1. **Nouveau Schema Prisma** ✅
Créé deux nouveaux modèles:

- **`Conversation`**: Gère les threads de conversation
  - Lié à un utilisateur (client)
  - Optionnellement lié à une réservation
  - Tracking des messages non lus (admin et client)
  - Statut: open, closed, archived

- **`ConversationMessage`**: Messages individuels dans une conversation
  - Lié à une conversation
  - Expéditeur (peut être admin ou client)
  - Contenu du message
  - Lié à un EmailLog (pour tracking)
  - Statut de lecture

### 2. **Migration Base de Données** ✅
- Migration créée et appliquée: `20251022121528_add_conversation_system`
- Tables créées dans PostgreSQL
- Relations établies

### 3. **Fonctions d'Envoi d'Emails** ✅
Créé `lib/conversation-emails.ts` avec:
- `sendConversationMessageToAdmin()`: Notifie l'admin d'un nouveau message client
- `sendConversationMessageToClient()`: Notifie le client d'une réponse admin
- Logging automatique dans `EmailLog`
- Templates HTML professionnels

---

## 📋 Ce qu'il reste à faire

### 4. **APIs pour les Conversations**
À créer:
- `POST /api/conversations` - Créer une nouvelle conversation
- `GET /api/conversations` - Lister les conversations (client ou admin)
- `GET /api/conversations/[id]` - Voir une conversation complète
- `POST /api/conversations/[id]/messages` - Ajouter un message
- `PATCH /api/conversations/[id]/read` - Marquer comme lu

APIs admin:
- `GET /api/admin/conversations` - Toutes les conversations
- `PATCH /api/admin/conversations/[id]/status` - Changer le statut
- `POST /api/admin/conversations/[id]/reply` - Répondre (avec email auto)

### 5. **Interfaces Utilisateur**
À créer/modifier:
- **Client:**
  - Page liste des conversations: `/client/conversations`
  - Page détail conversation: `/client/conversations/[id]`
  - Formulaire nouveau message

- **Admin:**
  - Page liste des conversations: `/admin/conversations`
  - Page détail conversation: `/admin/conversations/[id]`
  - Formulaire de réponse

### 6. **Migration des Données Existantes** (Optionnel)
Si vous avez des données dans `Message` ou `ContactMessage`:
- Script de migration pour convertir en `Conversation`
- OU marquer les anciens comme "legacy"

### 7. **Nettoyage**
Une fois le nouveau système validé:
- Supprimer le modèle `Message` (legacy)
- Supprimer le modèle `ContactMessage` (fusionné)
- Supprimer les anciennes APIs `/api/messages`
- Mettre à jour les pages qui utilisent l'ancien système

---

## 🎯 Architecture du Nouveau Système

### Flux: Client envoie un message

1. Client utilise le formulaire de contact ou son dashboard
2. Création d'une `Conversation` (si nouvelle) + `ConversationMessage`
3. **Email automatique envoyé à l'admin** via `sendConversationMessageToAdmin()`
4. EmailLog créé et lié au message
5. Admin reçoit notification par email

### Flux: Admin répond

1. Admin répond via le dashboard admin
2. Création d'un nouveau `ConversationMessage` dans la conversation existante
3. **Email automatique envoyé au client** via `sendConversationMessageToClient()`
4. EmailLog créé et lié au message
5. Client reçoit notification par email

### Avantages

✅ **Toutes les communications sont trackées** (base de données + emails)
✅ **Historique complet** de chaque conversation
✅ **Notifications automatiques** par email
✅ **Thread cohérent** (pas de messages isolés)
✅ **Compteurs de messages non lus**
✅ **Lien avec réservations** pour contexte
✅ **Statuts** (ouvert, fermé, archivé) pour organisation

---

## 🔧 Prochaines Étapes Recommandées

1. **Finir la configuration Resend** (domaine vérifié) → emails fonctionnels
2. **Créer les APIs** pour les conversations
3. **Créer les interfaces** client et admin
4. **Tester** le flux complet
5. **Migrer** les anciennes données si nécessaire
6. **Supprimer** l'ancien système

---

## 📝 Notes Importantes

- Les anciens modèles `Message` et `ContactMessage` existent toujours en base
- Ils ont été marqués "legacy" dans le schema
- Ne pas les supprimer avant d'avoir migré les données ou validé qu'elles ne sont plus utiles
- Le système de logging `EmailLog` est réutilisé pour les conversations

---

## 🐛 État Actuel du Projet

### ✅ Fonctionnel:
- Système de réservations
- Système de paiement (Stripe)
- EmailLog (logging des emails)
- Nouveau schema de conversations

### ⚠️ En attente:
- **Domaine Resend non vérifié** (emails échouent)
- APIs conversations à créer
- Interfaces conversations à créer

### 🎯 Objectif:
Avoir un système de communication unifié où:
- Tout message génère un email
- Historique complet en base
- Thread de conversations cohérent
