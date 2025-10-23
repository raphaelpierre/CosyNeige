# 📚 Guide d'Administration - Chalet-Balmotte810

Guide complet pour l'utilisation de l'interface d'administration du site web Chalet-Balmotte810.

---

## 📋 Table des Matières

1. [Connexion à l'Administration](#connexion)
2. [Tableau de Bord](#tableau-de-bord)
3. [Gestion des Réservations](#gestion-des-réservations)
4. [Gestion des Utilisateurs](#gestion-des-utilisateurs)
5. [Système de Messagerie](#système-de-messagerie)
6. [Gestion des Factures](#gestion-des-factures)
7. [Calendrier des Disponibilités](#calendrier)
8. [Paramètres et Configuration](#paramètres)
9. [Comptabilité](#comptabilité)
10. [Résolution de Problèmes](#résolution-de-problèmes)

---

## 🔐 Connexion à l'Administration {#connexion}

### Accès à l'Interface

1. **URL d'administration** : `https://chalet-balmotte810.com/admin`
2. **Page de connexion** : `https://chalet-balmotte810.com/client/login`
3. Utilisez vos identifiants administrateur (email + mot de passe)

### Vérifications de Sécurité

- Seuls les utilisateurs avec le rôle `admin` peuvent accéder à l'interface
- Les utilisateurs non-admins sont automatiquement redirigés vers leur tableau de bord client
- Les utilisateurs non-connectés sont redirigés vers la page de connexion

---

## 📊 Tableau de Bord {#tableau-de-bord}

Le tableau de bord principal affiche plusieurs onglets pour gérer différents aspects du site.

### Onglets Disponibles

- **Réservations** : Gestion des réservations et disponibilités
- **Utilisateurs** : Gestion des comptes clients et administrateurs
- **Messages** : LEGACY - Ancien système de messagerie (à ne plus utiliser)
- **Conversations** : Nouveau système de messagerie unifié
- **Factures** : Création et gestion des factures
- **Comptabilité** : Suivi des transactions financières
- **Calendrier** : Vue calendrier des réservations
- **Paramètres** : Configuration du site, tarifs, saisons, emails

---

## 🏨 Gestion des Réservations {#gestion-des-réservations}

### Vue d'Ensemble

L'onglet **Réservations** permet de :
- Voir toutes les réservations (en attente, confirmées, annulées)
- Filtrer par statut
- Créer manuellement une réservation
- Modifier les détails d'une réservation
- Changer le statut de paiement
- Supprimer une réservation

### Filtres Disponibles

- **Tous** : Affiche toutes les réservations
- **En attente** : Réservations non encore confirmées
- **Confirmées** : Réservations validées et confirmées
- **Annulées** : Réservations annulées

### Informations Affichées

Pour chaque réservation :
- **Nom du client** : Prénom et nom
- **Dates** : Check-in → Check-out (nombre de nuits)
- **Nombre de personnes**
- **Prix total**
- **Statut** : pending, confirmed, cancelled
- **Statut de paiement** :
  - `none` : Aucun paiement
  - `pending` : En attente
  - `pending_bank_transfer` : Virement bancaire en attente
  - `deposit_paid` : Acompte payé (30%)
  - `paid` : Entièrement payé
- **Actions** : Modifier, Supprimer

### Créer une Réservation Manuellement

1. Cliquer sur le bouton **"+ Nouvelle Réservation"**
2. Remplir le formulaire :
   - Prénom et Nom du client
   - Email et Téléphone
   - Date d'arrivée (Check-in)
   - Date de départ (Check-out)
   - Nombre de personnes
   - Prix total
   - Montant de l'acompte (par défaut 30%)
   - Statut (pending/confirmed/cancelled)
   - Statut de paiement
   - Message optionnel
3. Cliquer sur **"Créer la réservation"**

### Modifier une Réservation

1. Cliquer sur **"Modifier"** à côté de la réservation
2. Modifier les champs nécessaires dans le formulaire
3. Cliquer sur **"Enregistrer"**

### Supprimer une Réservation

1. Cliquer sur **"Supprimer"** (bouton rouge)
2. Confirmer la suppression
3. ⚠️ **Attention** : Cette action est irréversible

---

## 👥 Gestion des Utilisateurs {#gestion-des-utilisateurs}

### Vue d'Ensemble

L'onglet **Utilisateurs** permet de :
- Voir tous les comptes utilisateurs (clients et admins)
- Créer un nouveau compte
- Modifier les informations d'un utilisateur
- Changer le rôle (client → admin ou admin → client)
- Supprimer un compte

### Informations Affichées

Pour chaque utilisateur :
- **Nom complet** : Prénom et Nom
- **Email** : Adresse email de connexion
- **Téléphone** : Numéro de téléphone
- **Rôle** :
  - `client` : Utilisateur standard
  - `admin` : Administrateur avec accès complet
- **Date de création** : Date d'inscription
- **Actions** : Modifier, Supprimer

### Créer un Nouvel Utilisateur

1. Cliquer sur **"+ Nouvel Utilisateur"**
2. Remplir le formulaire :
   - Email (unique, servira d'identifiant)
   - Prénom et Nom
   - Téléphone (optionnel)
   - Mot de passe temporaire
   - Rôle : client ou admin
3. Cliquer sur **"Créer l'utilisateur"**
4. L'utilisateur recevra un email de création de compte

### Modifier un Utilisateur

1. Cliquer sur **"Modifier"** à côté de l'utilisateur
2. Modifier les informations nécessaires
3. Pour changer le mot de passe : entrer un nouveau mot de passe
4. Pour changer le rôle : sélectionner client ou admin
5. Cliquer sur **"Enregistrer"**

### Supprimer un Utilisateur

1. Cliquer sur **"Supprimer"** (bouton rouge)
2. Confirmer la suppression
3. ⚠️ **Attention** : Cette action supprime aussi :
   - Toutes les réservations associées
   - Toutes les conversations associées
   - Tous les messages associés

---

## 💬 Système de Messagerie {#système-de-messagerie}

### Nouveau Système : Conversations

Le système de **Conversations** est le nouveau système unifié pour communiquer avec les clients.

#### Accès aux Conversations

- **URL directe** : `https://chalet-balmotte810.com/admin/conversations`
- **Depuis le menu** : Onglet "Conversations"

#### Fonctionnalités

##### Vue Liste des Conversations

Affiche toutes les conversations avec :
- **Sujet** : Titre de la conversation
- **Client** : Nom et email du client
- **Statut** :
  - 🟢 `open` : Conversation active
  - 🔴 `closed` : Conversation fermée
  - 📦 `archived` : Conversation archivée
- **Messages non lus** : Nombre de messages non lus par l'admin
- **Dernier message** : Date du dernier message
- **Dernier expéditeur** : client ou admin
- **Actions** : Voir, Changer statut, Archiver

##### Filtres Disponibles

- **Tous** : Toutes les conversations
- **Ouvertes** : Conversations actives uniquement
- **Fermées** : Conversations fermées
- **Archivées** : Conversations archivées

##### Recherche

- Rechercher par nom de client, email ou sujet
- La recherche est instantanée

##### Répondre à une Conversation

1. Cliquer sur **"Voir"** pour ouvrir la conversation
2. Lire tous les messages de la conversation
3. Écrire votre réponse dans le champ **"Votre Réponse"**
4. Cliquer sur **"Envoyer la réponse"**
5. Le client recevra un email avec votre réponse
6. L'email contiendra un lien vers la conversation complète

##### Emails Automatiques

Lorsque vous répondez :
- ✅ Un email est envoyé au client
- ✅ L'email contient votre réponse
- ✅ Un lien vers la conversation est inclus
- ✅ L'email est loggé dans `EmailLog`
- ✅ Le statut d'envoi est tracké

Lorsqu'un client envoie un message :
- ✅ Vous recevez un email de notification
- ✅ L'email contient le message du client
- ✅ Un lien vers l'admin pour répondre est inclus
- ✅ Tous les emails configurés dans les paramètres reçoivent une copie

##### Marquer comme Lu

- Les messages sont automatiquement marqués comme lus lorsque vous ouvrez une conversation
- Le compteur de messages non lus se met à jour automatiquement

##### Changer le Statut

1. Dans la liste, cliquer sur **"Changer statut"**
2. Sélectionner : Open, Closed, ou Archived
3. Le statut est mis à jour immédiatement

### Ancien Système : Messages (LEGACY)

⚠️ **Note** : L'ancien système de messages est obsolète. Utilisez le système de Conversations à la place.

L'onglet "Messages" de l'admin principal reste disponible pour consulter les anciens messages, mais il est recommandé de :
1. Migrer vers le système de Conversations
2. Ne plus utiliser l'ancien système pour les nouvelles communications

---

## 🧾 Gestion des Factures {#gestion-des-factures}

### Vue d'Ensemble

L'onglet **Factures** permet de :
- Créer des factures pour les réservations
- Gérer les factures existantes
- Filtrer par statut et type
- Générer des PDF
- Envoyer les factures par email
- Suivre les paiements

### Types de Factures

- **Acompte (deposit)** : Facture pour l'acompte (généralement 30%)
- **Solde (balance)** : Facture pour le solde restant
- **Complète (full)** : Facture pour le montant total
- **Personnalisée (custom)** : Facture avec montant personnalisé

### Statuts de Facture

- **Brouillon (draft)** : Facture en préparation, non envoyée
- **Envoyée (sent)** : Facture envoyée au client
- **Payée (paid)** : Facture entièrement payée
- **Partiellement payée (partial)** : Paiement partiel reçu
- **Annulée (cancelled)** : Facture annulée

### Créer une Facture

#### Méthode 1 : Depuis une Réservation

1. Dans l'onglet **Réservations**, cliquer sur une réservation
2. Cliquer sur **"Créer une facture"**
3. Le formulaire est pré-rempli avec les données de la réservation
4. Ajuster si nécessaire :
   - Type de facture
   - Montants
   - Notes
5. Cliquer sur **"Créer la facture"**

#### Méthode 2 : Création Directe

1. Dans l'onglet **Factures**, cliquer sur **"+ Nouvelle Facture"**
2. Sélectionner la réservation associée
3. Remplir les informations :
   - Type de facture
   - Montants (base, nettoyage, linge, taxe)
   - Méthode de paiement
   - Date d'échéance
   - Notes publiques et privées
4. Cliquer sur **"Créer"**

### Numérotation Automatique

Les factures sont numérotées automatiquement :
- Format : `CHB-YYYY-XXX`
- Exemple : `CHB-2025-001`
- XXX = numéro incrémental par année

### Modifier une Facture

1. Cliquer sur **"Modifier"** dans la liste des factures
2. Modifier les champs nécessaires
3. ⚠️ Une fois qu'une facture est envoyée ou payée, certains champs ne peuvent plus être modifiés
4. Cliquer sur **"Enregistrer"**

### Générer et Télécharger le PDF

1. Cliquer sur **"Voir PDF"** ou **"Télécharger PDF"**
2. Le PDF contient :
   - Informations du chalet (logo, adresse, contacts)
   - Numéro de facture et date
   - Informations client
   - Détails de la réservation
   - Détail des montants (base, frais, taxes)
   - Total TTC
   - Conditions de paiement
3. Le PDF peut être sauvegardé ou imprimé

### Envoyer une Facture par Email

1. Cliquer sur **"Envoyer par email"**
2. Vérifier l'email du destinataire
3. Ajouter un message personnalisé (optionnel)
4. Cliquer sur **"Envoyer"**
5. Le client reçoit :
   - La facture en pièce jointe (PDF)
   - Un lien pour payer en ligne (si applicable)
   - Les instructions de paiement

### Marquer comme Payée

1. Cliquer sur **"Marquer comme payée"**
2. Indiquer :
   - Méthode de paiement (Stripe, virement, chèque, espèces)
   - Référence de paiement
   - Montant payé
   - Date de paiement
3. Cliquer sur **"Valider"**
4. Le statut de la facture est mis à jour
5. Un email de confirmation peut être envoyé au client

### Filtres et Recherche

**Filtres par Statut** :
- Tous
- Brouillon
- Envoyées
- Payées
- Partielles
- Annulées

**Filtres par Type** :
- Tous
- Acompte
- Solde
- Complète

**Recherche** :
- Par numéro de facture
- Par nom de client
- Par email

---

## 📅 Calendrier des Disponibilités {#calendrier}

### Vue d'Ensemble

L'onglet **Calendrier** affiche une vue mensuelle de toutes les réservations.

### Fonctionnalités

- **Navigation** : Mois précédent / suivant
- **Vue mensuelle** : Affichage de toutes les réservations du mois
- **Légende des couleurs** :
  - 🟢 Vert : Dates disponibles
  - 🟡 Jaune : Réservation en attente
  - 🔵 Bleu : Réservation confirmée
  - 🔴 Rouge : Réservation annulée

### Informations sur les Réservations

En cliquant sur une date réservée :
- Nom du client
- Dates de séjour
- Nombre de personnes
- Statut de la réservation
- Actions rapides (voir, modifier)

---

## ⚙️ Paramètres et Configuration {#paramètres}

### Vue d'Ensemble

L'onglet **Paramètres** regroupe toutes les configurations du site.

### Sections Disponibles

1. **Paramètres Email**
2. **Tarifs et Frais**
3. **Périodes Saisonnières**

---

### 📧 Paramètres Email

Configuration des emails et notifications automatiques.

#### Adresses Email

**Email de Contact (Public)** :
- Email affiché publiquement sur le site
- Email par défaut : `contact@chalet-balmotte810.com`
- Les clients utilisent cet email pour vous contacter

**Adresses de Transfert** :
- Liste des emails qui recevront des copies de tous les emails importants
- Vous pouvez en configurer plusieurs (admin@..., owner@..., etc.)
- Utilisé pour les notifications de :
  - Nouvelles réservations
  - Nouveaux messages clients
  - Confirmations de paiement
  - Formulaires de contact

**Email de Réponse (Reply-To)** :
- Email utilisé quand les clients répondent
- Par défaut : `contact@chalet-balmotte810.com`

**Nom de l'Expéditeur** :
- Nom affiché dans les emails sortants
- Par défaut : `Chalet-Balmotte810`

**Email Expéditeur (From)** :
- Email technique utilisé pour l'envoi (via Resend)
- Par défaut : `noreply@chalet-balmotte810.com`
- ⚠️ Ce champ ne peut pas être modifié (configuré dans Resend)

#### Ajouter une Adresse de Transfert

1. Entrer l'email dans le champ **"email@exemple.com"**
2. Cliquer sur **"+ Ajouter"**
3. L'email apparaît dans la liste
4. Vous pouvez en ajouter autant que nécessaire

#### Retirer une Adresse de Transfert

1. Cliquer sur le **❌** à côté de l'email
2. L'email est supprimé de la liste

#### Notifications Email

Activez ou désactivez les notifications pour :

- ✅ **Nouvelles réservations** : Email envoyé quand une nouvelle réservation est créée
- ✅ **Nouveaux messages** : Email envoyé quand un client envoie un message
- ✅ **Paiements** : Email envoyé lors d'un paiement reçu
- ✅ **Formulaire de contact** : Email envoyé quand le formulaire de contact est soumis

**Comment modifier** :
1. Cocher ou décocher les cases
2. Cliquer sur **"Enregistrer les Paramètres Email"**

---

### 💰 Tarifs et Frais

Configuration des prix par défaut et frais supplémentaires.

#### Frais Standards

**Frais de Ménage** :
- Montant fixe par séjour
- Par défaut : 450€
- Appliqué une seule fois par réservation

**Forfait Linge par Personne** :
- Prix par personne pour le linge de maison
- Par défaut : 25€ / personne
- Inclut : draps, serviettes, linge de toilette

**Taxe de Séjour par Personne/Nuit** :
- Taxe obligatoire
- Par défaut : 3€ / personne / nuit
- Versée à la mairie

**Montant de la Caution** :
- Caution demandée pour le séjour
- Par défaut : 1500€
- Restituée après vérification de l'état du chalet

#### Tarifs par Défaut

**Prix Haute Saison** :
- Prix par nuit en haute saison
- Par défaut : 410€ / nuit
- Appliqué pendant les périodes de vacances scolaires et pic de saison

**Prix Basse Saison** :
- Prix par nuit en basse saison
- Par défaut : 310€ / nuit
- Appliqué en dehors des périodes de vacances

#### Durées Minimales de Séjour

**Séjour Minimum (défaut)** :
- Nombre de nuits minimum
- Par défaut : 3 nuits

**Séjour Minimum Haute Saison** :
- Nombre de nuits minimum en haute saison
- Par défaut : 7 nuits (semaine complète)
- Souvent "dimanche à dimanche" pendant les vacances

#### Sauvegarder les Modifications

1. Modifier les valeurs nécessaires
2. Cliquer sur **"Enregistrer les Paramètres"**
3. Les nouveaux tarifs s'appliquent immédiatement aux nouvelles réservations

---

### 📆 Périodes Saisonnières

Définition des périodes de haute et basse saison avec tarifs spécifiques.

#### Liste des Périodes

Affiche toutes les périodes configurées :
- **Nom** : Description de la période (ex: "Vacances de Noël 2025")
- **Dates** : Date de début → Date de fin
- **Type** :
  - 🔴 Haute saison (high)
  - 🔵 Basse saison (low)
- **Prix par Nuit** : Tarif pour cette période
- **Séjour Minimum** : Nombre de nuits minimum
- **Dimanche à Dimanche** : ✅ si obligatoire
- **Statut** : Active ou Inactive
- **Actions** : Modifier, Supprimer

#### Créer une Nouvelle Période

1. Cliquer sur **"+ Nouvelle Période"**
2. Remplir le formulaire :
   - **Nom** : Description claire (ex: "Février 2025")
   - **Date de début** : Premier jour de la période
   - **Date de fin** : Dernier jour de la période
   - **Type de saison** : Haute ou Basse
   - **Prix par nuit** : Tarif spécifique à cette période
   - **Séjour minimum** : Nombre de nuits minimum
   - **Dimanche à dimanche** : Cocher si les arrivées/départs sont uniquement le dimanche
3. Cliquer sur **"Créer la période"**

#### Modifier une Période

1. Cliquer sur **"Modifier"** à côté de la période
2. Modifier les champs nécessaires
3. Cliquer sur **"Enregistrer"**

#### Désactiver une Période

1. Cliquer sur **"Désactiver"**
2. La période n'est plus appliquée aux nouvelles réservations
3. Pour réactiver : Modifier et cocher "Active"

#### Supprimer une Période

1. Cliquer sur **"Supprimer"** (bouton rouge)
2. Confirmer la suppression
3. ⚠️ **Attention** : Cette action est irréversible

#### Exemples de Périodes

**Vacances de Noël** :
- Nom : "Vacances de Noël 2025"
- Dates : 20/12/2025 → 05/01/2026
- Type : Haute saison
- Prix : 450€ / nuit
- Minimum : 7 nuits
- Dimanche à dimanche : ✅

**Février Hors Vacances** :
- Nom : "Février 2025 (Hors Vacances)"
- Dates : 06/02/2025 → 21/02/2025
- Type : Basse saison
- Prix : 310€ / nuit
- Minimum : 3 nuits
- Dimanche à dimanche : ❌

---

## 💳 Comptabilité {#comptabilité}

### Vue d'Ensemble

L'onglet **Comptabilité** permet de suivre toutes les transactions financières du chalet.

### Types de Transactions

**Recettes (Income)** :
- Paiements de réservations
- Acomptes reçus
- Soldes reçus
- Autres revenus

**Dépenses (Expense)** :
- Maintenance
- Utilitaires (électricité, eau, internet)
- Assurances
- Taxes
- Fournitures
- Marketing
- Autres dépenses

### Catégories Disponibles

- **booking** : Revenus de réservation
- **maintenance** : Entretien et réparations
- **utilities** : Factures d'électricité, eau, internet
- **taxes** : Impôts et taxes
- **insurance** : Assurances
- **supplies** : Fournitures et consommables
- **marketing** : Publicité et promotion
- **other** : Autres

### Créer une Transaction

1. Cliquer sur **"+ Nouvelle Transaction"**
2. Remplir le formulaire :
   - **Type** : Recette ou Dépense
   - **Catégorie** : Sélectionner dans la liste
   - **Montant** : Montant en euros
   - **Description** : Description courte
   - **Notes** : Détails supplémentaires (optionnel)
   - **Date** : Date de la transaction
   - **Méthode de paiement** : Stripe, virement, espèces, chèque, carte
   - **Référence** : Numéro de transaction, chèque, etc.
   - **Lien réservation** : Si applicable, lier à une réservation
   - **Lien facture** : Si applicable, lier à une facture
3. Cliquer sur **"Créer"**

### Valider une Transaction

Les transactions peuvent être marquées comme "validées" :
1. Cliquer sur **"Valider"** à côté de la transaction
2. Une transaction validée ne peut plus être modifiée (protection)

### Filtres

- Par type (recettes/dépenses)
- Par catégorie
- Par période (mois, année)
- Par statut (validée/non validée)

### Rapports

L'interface affiche :
- **Total des recettes** sur la période sélectionnée
- **Total des dépenses** sur la période sélectionnée
- **Bénéfice net** (recettes - dépenses)
- **Graphiques** : Évolution des revenus et dépenses

---

## 🔧 Résolution de Problèmes {#résolution-de-problèmes}

### Problèmes Courants

#### 1. Je ne reçois pas les emails de notification

**Vérifications** :
1. Aller dans **Paramètres → Email**
2. Vérifier que les notifications sont activées (cases cochées)
3. Vérifier que votre adresse email est bien dans les "Adresses de Transfert"
4. Vérifier vos spams/indésirables
5. Tester l'envoi avec le formulaire de contact du site

**Si le problème persiste** :
- Vérifier que la variable `RESEND_API_KEY` est correctement configurée
- Consulter les logs d'emails dans l'onglet Admin → Email Logs (si disponible)

#### 2. Un client ne peut pas se connecter

**Vérifications** :
1. Aller dans **Utilisateurs**
2. Chercher le client par email
3. Vérifier que le compte existe
4. Vérifier que `passwordSet` est à `true`
5. Si nécessaire : cliquer sur "Modifier" et réinitialiser le mot de passe

**Solution** :
- Utiliser "Mot de passe oublié" sur la page de connexion
- Ou créer un nouveau mot de passe temporaire depuis l'admin

#### 3. Une réservation n'apparaît pas dans le calendrier

**Vérifications** :
1. Aller dans **Réservations**
2. Vérifier le statut de la réservation
3. Vérifier que les dates sont correctes
4. Rafraîchir la page du calendrier

**Solution** :
- Modifier la réservation et sauvegarder à nouveau
- Vérifier qu'il n'y a pas de conflit de dates

#### 4. Les tarifs ne se calculent pas correctement

**Vérifications** :
1. Aller dans **Paramètres → Tarifs**
2. Vérifier les frais standards (ménage, linge, taxe)
3. Aller dans **Paramètres → Périodes**
4. Vérifier que la période correspondante est active
5. Vérifier les prix par nuit configurés

**Solution** :
- Recréer les périodes saisonnières avec les bons tarifs
- Vérifier que les périodes ne se chevauchent pas

#### 5. Une facture ne se génère pas en PDF

**Vérifications** :
1. Vérifier que toutes les informations de la facture sont complètes
2. Vérifier la connexion internet
3. Essayer de rafraîchir la page

**Solution** :
- Réessayer après quelques minutes
- Vérifier les erreurs dans la console du navigateur (F12)

#### 6. Les messages d'une conversation ne s'affichent pas

**Vérifications** :
1. Rafraîchir la page
2. Vérifier que vous êtes bien connecté en tant qu'admin
3. Vérifier l'URL : doit être `/admin/conversations/[id]`

**Solution** :
- Revenir à la liste des conversations
- Rouvrir la conversation

---

## 📞 Support et Assistance

### Informations Techniques

**Technologies utilisées** :
- Frontend : Next.js 15, React, TypeScript
- Backend : Next.js API Routes
- Base de données : PostgreSQL (NeonDB)
- Emails : Resend API
- Paiements : Stripe (Apple Pay, Google Pay)

### Variables d'Environnement Importantes

Les variables suivantes doivent être configurées dans `.env` :

```env
DATABASE_URL=...           # Connexion à la base de données
RESEND_API_KEY=...        # Clé API Resend pour les emails
ADMIN_EMAIL=...           # Email admin par défaut
NEXT_PUBLIC_BASE_URL=...  # URL du site
```

### Logs et Débogage

Pour consulter les logs :
1. Ouvrir la console du navigateur (F12)
2. Onglet "Console" pour voir les erreurs JavaScript
3. Onglet "Network" pour voir les requêtes API

Les logs serveur sont visibles dans les logs de Vercel (si hébergé sur Vercel).

### Contacts

Pour toute question technique ou assistance :
- Email technique : contact@chalet-balmotte810.com
- En cas d'urgence : Contacter le développeur du site

---

## 🎯 Bonnes Pratiques

### Sécurité

1. **Ne jamais partager vos identifiants admin**
2. **Utiliser un mot de passe fort** (minimum 12 caractères, chiffres, lettres, symboles)
3. **Se déconnecter** après chaque session, surtout sur ordinateur partagé
4. **Vérifier l'URL** : doit commencer par `https://chalet-balmotte810.com`

### Gestion des Réservations

1. **Confirmer rapidement** : Confirmer ou refuser les réservations sous 24h
2. **Communiquer clairement** : Utiliser le système de conversations pour toute communication
3. **Vérifier les paiements** : S'assurer que l'acompte est reçu avant confirmation définitive
4. **Envoyer les factures** : Envoyer une facture d'acompte et une de solde

### Gestion des Emails

1. **Vérifier régulièrement** : Vérifier les emails de notification quotidiennement
2. **Répondre rapidement** : Répondre aux messages clients sous 24h
3. **Configurer les transferts** : Ajouter plusieurs adresses email pour ne rien manquer
4. **Archiver** : Archiver les conversations terminées pour garder une vue claire

### Maintenance

1. **Mettre à jour les tarifs** : Réviser les tarifs annuellement
2. **Créer les périodes** : Créer les périodes saisonnières pour l'année à venir
3. **Vérifier le calendrier** : S'assurer que le calendrier est à jour
4. **Nettoyer les données** : Supprimer les anciennes réservations annulées si nécessaire

---

## 📝 Notes de Version

### Version Actuelle : 2.0 (2025)

**Nouvelles Fonctionnalités** :
- ✅ Système de Conversations unifié
- ✅ Gestion avancée des factures avec PDF
- ✅ Paramètres email configurables
- ✅ Système de transfert d'emails multiples
- ✅ Apple Pay et Google Pay intégrés
- ✅ Paiement par virement bancaire
- ✅ Logs d'emails complets
- ✅ Interface responsive (mobile-friendly)

**Améliorations** :
- Interface modernisée
- Performance optimisée
- Sécurité renforcée
- Emails transactionnels professionnels

---

**Fin du Guide d'Administration** 🎉

Pour toute question ou suggestion d'amélioration de ce guide, contactez l'administrateur du site.
