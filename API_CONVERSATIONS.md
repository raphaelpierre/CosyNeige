# 📡 API Conversations - Documentation

## Vue d'ensemble

Système de conversations unifié avec envoi automatique d'emails pour chaque message.

---

## 🔐 Authentification

Toutes les APIs nécessitent un token JWT dans les cookies (`auth-token`).

- **Client:** Accès uniquement à ses propres conversations
- **Admin:** Accès à toutes les conversations

---

## 📋 Endpoints

### 1. **GET /api/conversations**
Récupérer la liste des conversations

**Authentification:** Requise

**Réponse Client:**
```json
{
  "conversations": [
    {
      "id": "conv_123",
      "subject": "Question sur ma réservation",
      "status": "open",
      "unreadByClient": 1,
      "lastMessageAt": "2025-10-22T12:00:00Z",
      "lastMessageFrom": "admin",
      "reservation": {
        "id": "res_456",
        "checkIn": "2025-12-20",
        "checkOut": "2025-12-27"
      },
      "messages": [
        {
          "id": "msg_789",
          "content": "Dernière réponse...",
          "isFromAdmin": true,
          "createdAt": "2025-10-22T12:00:00Z"
        }
      ]
    }
  ]
}
```

**Réponse Admin:** Inclut toutes les conversations de tous les utilisateurs avec les infos user.

---

### 2. **POST /api/conversations**
Créer une nouvelle conversation (avec premier message)

**Authentification:** Optionnelle (peut être utilisé par visiteur anonyme)

**Body (utilisateur authentifié):**
```json
{
  "subject": "Question sur les équipements",
  "content": "Bonjour, avez-vous des chaises hautes pour bébé?",
  "reservationId": "res_456" // Optionnel
}
```

**Body (utilisateur non authentifié):**
```json
{
  "subject": "Demande de renseignements",
  "content": "Je souhaite réserver pour Noël...",
  "fromEmail": "john@example.com",
  "fromName": "John Doe",
  "reservationId": null
}
```

**Réponse:**
```json
{
  "id": "conv_123",
  "userId": "user_456",
  "subject": "Question sur les équipements",
  "status": "open",
  "unreadByAdmin": 1,
  "unreadByClient": 0,
  "messages": [
    {
      "id": "msg_789",
      "content": "Bonjour, avez-vous...",
      "fromEmail": "john@example.com",
      "fromName": "John Doe",
      "isFromAdmin": false,
      "createdAt": "2025-10-22T12:00:00Z"
    }
  ]
}
```

**Side Effect:** ✉️ Email envoyé automatiquement à l'admin

---

### 3. **GET /api/conversations/[id]**
Récupérer une conversation complète avec tous ses messages

**Authentification:** Requise
**Permissions:** Client (owner) ou Admin

**Réponse:**
```json
{
  "id": "conv_123",
  "subject": "Question sur ma réservation",
  "status": "open",
  "unreadByAdmin": 0,
  "unreadByClient": 0,
  "user": {
    "id": "user_456",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "reservation": {
    "id": "res_789",
    "checkIn": "2025-12-20",
    "checkOut": "2025-12-27",
    "guestName": "John Doe"
  },
  "messages": [
    {
      "id": "msg_1",
      "content": "Bonjour...",
      "fromName": "John Doe",
      "fromEmail": "john@example.com",
      "isFromAdmin": false,
      "read": true,
      "readAt": "2025-10-22T12:05:00Z",
      "createdAt": "2025-10-22T12:00:00Z",
      "emailLog": {
        "id": "email_123",
        "status": "sent",
        "sentAt": "2025-10-22T12:00:10Z"
      }
    },
    {
      "id": "msg_2",
      "content": "Bonjour John, oui nous avons...",
      "fromName": "Admin Chalet",
      "fromEmail": "info@chalet-balmotte810.com",
      "isFromAdmin": true,
      "read": false,
      "createdAt": "2025-10-22T13:00:00Z",
      "emailLog": {
        "id": "email_124",
        "status": "sent",
        "sentAt": "2025-10-22T13:00:05Z"
      }
    }
  ]
}
```

**Side Effect:** ✅ Marque automatiquement les messages comme lus

---

### 4. **PATCH /api/conversations/[id]**
Mettre à jour le statut d'une conversation

**Authentification:** Admin uniquement

**Body:**
```json
{
  "status": "closed" // "open", "closed", ou "archived"
}
```

**Réponse:**
```json
{
  "id": "conv_123",
  "status": "closed",
  // ... autres champs
}
```

---

### 5. **POST /api/conversations/[id]/messages**
Ajouter un message à une conversation existante

**Authentification:** Requise
**Permissions:** Client (owner) ou Admin

**Body:**
```json
{
  "content": "Merci pour votre réponse!"
}
```

**Réponse:**
```json
{
  "id": "msg_new",
  "conversationId": "conv_123",
  "content": "Merci pour votre réponse!",
  "fromUserId": "user_456",
  "fromEmail": "john@example.com",
  "fromName": "John Doe",
  "isFromAdmin": false,
  "read": false,
  "createdAt": "2025-10-22T14:00:00Z"
}
```

**Side Effects:**
- ✉️ Email envoyé automatiquement (admin → client ou client → admin)
- 📊 Compteur `unreadBy*` incrémenté
- 🕐 `lastMessageAt` mis à jour

---

## 🔄 Flux de Communication

### Scénario 1: Client envoie un message

1. Client POST `/api/conversations` ou `/api/conversations/[id]/messages`
2. Message créé en base de données
3. **Email automatique envoyé à l'admin** via `sendConversationMessageToAdmin()`
4. Email loggé dans `EmailLog`
5. Compteur `unreadByAdmin` incrémenté

### Scénario 2: Admin répond

1. Admin POST `/api/conversations/[id]/messages`
2. Message créé en base de données
3. **Email automatique envoyé au client** via `sendConversationMessageToClient()`
4. Email loggé dans `EmailLog`
5. Compteur `unreadByClient` incrémenté

### Scénario 3: Lecture de conversation

1. User GET `/api/conversations/[id]`
2. Messages marqués comme lus
3. Compteur `unreadBy*` réinitialisé à 0

---

## 📊 Modèles de Données

### Conversation
```typescript
{
  id: string
  userId: string // Propriétaire (client)
  reservationId?: string // Optionnel
  subject: string
  status: "open" | "closed" | "archived"
  unreadByAdmin: number
  unreadByClient: number
  lastMessageAt: Date
  lastMessageFrom: "client" | "admin"
  createdAt: Date
  updatedAt: Date
}
```

### ConversationMessage
```typescript
{
  id: string
  conversationId: string
  fromUserId?: string
  fromEmail: string
  fromName: string
  isFromAdmin: boolean
  content: string // Texte du message
  emailLogId?: string // Lien vers EmailLog
  read: boolean
  readAt?: Date
  createdAt: Date
}
```

---

## ✉️ Emails Automatiques

Chaque message déclenche automatiquement un email:

**Client → Admin:**
- Template: Notification avec bouton "Répondre"
- ReplyTo: Email du client
- Lien vers: `/admin/conversations/[id]`

**Admin → Client:**
- Template: Réponse professionnelle
- ReplyTo: Email admin (info@chalet-balmotte810.com)
- Lien vers: `/client/conversations/[id]`

Tous les emails sont:
- ✅ Loggés dans `EmailLog`
- ✅ Liés au message via `emailLogId`
- ✅ Trackables (statut, date d'envoi, erreurs)

---

## 🎯 Prochaines Étapes

1. ✅ **APIs créées** (toutes fonctionnelles)
2. ⏳ **Interfaces utilisateur** à créer:
   - Page liste conversations client: `/client/conversations`
   - Page détail conversation client: `/client/conversations/[id]`
   - Page liste conversations admin: `/admin/conversations`
   - Page détail conversation admin: `/admin/conversations/[id]`
3. ⏳ **Résoudre vérification domaine Resend** (pour emails fonctionnels)
4. ⏳ **Tests end-to-end**

---

## 🐛 Gestion des Erreurs

Toutes les APIs gèrent:
- ✅ Authentification manquante (401)
- ✅ Permissions insuffisantes (403)
- ✅ Ressources non trouvées (404)
- ✅ Données invalides (400)
- ✅ Erreurs serveur (500)

Les erreurs d'envoi d'email **ne bloquent pas** la création des messages.
Elles sont loggées et trackées dans `EmailLog` avec `status: "failed"`.
