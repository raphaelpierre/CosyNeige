# 📧 Guide de Configuration Email - Chalet-Balmotte810

## 🎯 Situation Actuelle

### ✅ Ce qui FONCTIONNE :
- **Envoi d'emails** : Le site peut envoyer des emails via Resend
- Confirmations de réservation
- Notifications admin
- Messages de conversations
- Emails automatiques

### ❌ Ce qui NE FONCTIONNE PAS :
- **Réception d'emails** : Le site ne reçoit PAS les emails entrants
- Si quelqu'un envoie un email à `admin@chalet-balmotte810.com`, il ne sera PAS traité par le site

---

## 🔧 Solutions Disponibles

### Solution 1 : Utiliser le Formulaire de Contact (RECOMMANDÉ ✅)

**Comment ça marche :**
1. Les clients utilisent le formulaire de contact sur le site
2. Cela crée automatiquement une conversation
3. Vous recevez une notification par email
4. Vous répondez depuis l'interface admin
5. Le client reçoit votre réponse par email

**Avantages :**
- ✅ Tout est centralisé dans le site
- ✅ Historique complet des conversations
- ✅ Pas de configuration supplémentaire
- ✅ Fonctionne déjà parfaitement

**Inconvénients :**
- ❌ Les clients doivent passer par le formulaire

---

### Solution 2 : Redirection Email Simple

**Comment configurer :**

#### Option A : Chez votre registrar de domaine (OVH, Gandi, etc.)

1. Connectez-vous à votre interface de gestion de domaine
2. Allez dans la section "Emails" ou "Redirections"
3. Créez une redirection :
   - `admin@chalet-balmotte810.com` → `votre-email@gmail.com`
   - `contact@chalet-balmotte810.com` → `votre-email@gmail.com`

**Exemple chez OVH :**
1. Panneau de configuration OVH
2. Nom de domaine → chalet-balmotte810.com
3. Emails → Redirections
4. Créer une redirection
5. Source : admin@chalet-balmotte810.com
6. Destination : sebastien@exemple.com (ou Valérie, Loan)

**Avantages :**
- ✅ Simple à configurer
- ✅ Les emails arrivent dans votre boîte habituelle
- ✅ Vous pouvez répondre normalement depuis Gmail

**Inconvénients :**
- ❌ Les emails ne créent PAS de conversations sur le site
- ❌ Pas d'historique centralisé
- ❌ Vous devez copier-coller les infos importantes dans le site

---

### Solution 3 : Resend Inbound Emails (AVANCÉ)

**Comment ça marche :**
Resend peut recevoir des emails et les transférer à votre application via webhook.

**Configuration requise :**

#### Étape 1 : Configurer Resend Inbound

1. Allez sur https://resend.com/domains
2. Sélectionnez `chalet-balmotte810.com`
3. Activez "Inbound Emails"
4. Ajoutez les enregistrements DNS MX fournis par Resend

**Enregistrements DNS à ajouter :**
```
Type: MX
Priority: 10
Value: inbound.resend.com
```

#### Étape 2 : Créer un Webhook pour recevoir les emails

Resend enverra une requête POST à votre API quand un email arrive.

**Fichier à créer :** `app/api/webhooks/inbound-email/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Data contient :
    // - from: { email, name }
    // - to: "admin@chalet-balmotte810.com"
    // - subject: "Sujet de l'email"
    // - text: "Contenu texte"
    // - html: "Contenu HTML"

    const fromEmail = data.from.email;
    const fromName = data.from.name || fromEmail;
    const subject = data.subject;
    const content = data.text || data.html;

    // Chercher si l'utilisateur existe
    let user = await prisma.user.findUnique({
      where: { email: fromEmail },
    });

    if (!user) {
      // Créer un utilisateur temporaire
      const nameParts = fromName.split(' ');
      user = await prisma.user.create({
        data: {
          email: fromEmail,
          firstName: nameParts[0] || 'Guest',
          lastName: nameParts.slice(1).join(' ') || '',
          role: 'client',
          passwordSet: false,
        },
      });
    }

    // Créer ou trouver une conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: user.id,
        subject: subject,
        status: { not: 'archived' },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          subject: subject || 'Email sans sujet',
          status: 'open',
          unreadByAdmin: 1,
          lastMessageFrom: 'client',
        },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          unreadByAdmin: { increment: 1 },
          lastMessageAt: new Date(),
          lastMessageFrom: 'client',
        },
      });
    }

    // Créer le message
    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        fromUserId: user.id,
        fromEmail,
        fromName,
        isFromAdmin: false,
        content,
      },
    });

    // Envoyer notification aux admins
    // (utiliser sendConversationMessageToAdmin)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing inbound email:', error);
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 });
  }
}
```

#### Étape 3 : Configurer le webhook dans Resend

1. Resend Dashboard → Inbound
2. Configure webhook URL : `https://chalet-balmotte810.com/api/webhooks/inbound-email`
3. Testez avec un email

**Avantages :**
- ✅ Les emails créent automatiquement des conversations
- ✅ Tout est centralisé dans le site
- ✅ Historique complet
- ✅ Les clients peuvent envoyer des emails normaux

**Inconvénients :**
- ❌ Configuration technique complexe
- ❌ Nécessite des modifications DNS
- ❌ Nécessite du code supplémentaire
- ❌ Peut prendre 24-48h pour la propagation DNS

---

## 🎯 Recommandation

### Pour Sébastien, Valérie et Loan

**Recommandation : Solution 2 (Redirection Simple)**

**Pourquoi ?**
1. **Simple** : Configuration en 5 minutes chez votre registrar
2. **Fiable** : Pas de dépendance technique
3. **Pratique** : Emails dans votre boîte habituelle
4. **Immédiat** : Fonctionne tout de suite

**Comment faire :**
1. Allez sur votre interface OVH/Gandi/autre
2. Créez une redirection :
   - `admin@chalet-balmotte810.com` → `sebastien@gmail.com`
   - `contact@chalet-balmotte810.com` → `valerie@gmail.com`
   - Ou vers une liste de distribution si vous voulez tous recevoir

**Pour les clients :**
- Encouragez-les à utiliser le formulaire de contact du site
- Ajoutez un lien "Contactez-nous" bien visible
- Le formulaire crée automatiquement une conversation tracée

---

## 📝 Configuration Actuelle du Site

### Emails de Transfert (Forwarding)

Actuellement configurés dans l'admin (Paramètres → Email) :
- Tous les emails SORTANTS du site peuvent être copiés à plusieurs adresses
- Par exemple : notification de réservation envoyée à Sébastien + Valérie + Loan

**Comment configurer :**
1. Connexion admin : `/admin`
2. Onglet **Paramètres**
3. Section **Paramètres Email**
4. "Adresses de Transfert"
5. Ajoutez vos emails
6. Cochez les notifications que vous voulez recevoir

### Emails Actuels

- `contact@chalet-balmotte810.com` : Email public sur le site
- `noreply@chalet-balmotte810.com` : Email d'envoi technique
- `admin@chalet-balmotte810.com` : Non configuré actuellement

---

## ❓ FAQ

### Q : Pourquoi mes emails à admin@chalet-balmotte810.com ne fonctionnent pas ?

**R :** Parce que cet email n'est pas configuré pour recevoir. C'est juste une variable d'environnement dans le code, pas une vraie boîte email.

### Q : Est-ce que je peux répondre aux emails des clients depuis Gmail ?

**R :** Oui, MAIS :
- Si vous utilisez la Solution 2 (redirection), vous pouvez répondre depuis Gmail
- Par contre, la réponse ne sera PAS enregistrée dans le système de conversations du site
- Le client ne verra pas la réponse dans son espace client

### Q : Comment faire pour que tout soit centralisé ?

**R :** Encouragez vos clients à :
1. Utiliser le formulaire de contact du site
2. Se connecter à leur espace client
3. Utiliser l'onglet "Messages/Conversations"

Vous répondez depuis l'admin, et tout est tracké.

### Q : Puis-je avoir admin@chalet-balmotte810.com ET contact@chalet-balmotte810.com ?

**R :** Oui ! Configurez deux redirections :
- `admin@chalet-balmotte810.com` → vos emails
- `contact@chalet-balmotte810.com` → vos emails

Ou faites-les pointer vers le même endroit.

---

## 🔍 Pour Vérifier

### Test 1 : Envoi depuis le site (devrait fonctionner)

1. Allez sur le site
2. Remplissez le formulaire de contact
3. Envoyez
4. Vérifiez que vous recevez un email de notification

### Test 2 : Envoi vers admin@... (ne fonctionnera pas sans config)

1. Envoyez un email depuis Gmail vers admin@chalet-balmotte810.com
2. L'email sera rejeté OU perdu (selon la config DNS actuelle)

### Test 3 : Redirection (après configuration)

1. Configurez la redirection chez votre registrar
2. Attendez 5-10 minutes
3. Envoyez un email depuis Gmail vers admin@chalet-balmotte810.com
4. L'email devrait arriver dans votre boîte Gmail

---

## 📞 Besoin d'Aide ?

**Pour configurer les redirections email :**
- Contactez votre hébergeur de domaine (OVH, Gandi, etc.)
- Support technique : Ils peuvent le faire en 5 minutes

**Pour la Solution 3 (Resend Inbound) :**
- Contactez le développeur du site
- Nécessite des modifications de code et DNS

---

**Dernière mise à jour :** Janvier 2025
