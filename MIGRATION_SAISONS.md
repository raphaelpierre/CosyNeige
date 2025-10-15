# Migration du Système de Saisons vers la Base de Données

## 📋 Résumé des Modifications

Ce document décrit la migration du système de gestion des saisons depuis des valeurs codées en dur vers un système dynamique basé sur la base de données.

## ✅ Étapes Complétées

### 1. Modèle de Données Prisma
**Fichier**: `prisma/schema.prisma`

Ajout de deux nouveaux modèles:

- **`SeasonPeriod`**: Gère les périodes de saison (Noël, Février, etc.)
  - `name`: Nom de la période (ex: "Vacances de Noël 2025")
  - `startDate` / `endDate`: Dates de début et fin
  - `seasonType`: "high" ou "low"
  - `pricePerNight`: Prix par nuit pour cette période
  - `minimumStay`: Nombre de nuits minimum
  - `sundayToSunday`: Si vrai, réservations uniquement dimanche à dimanche
  - `year`: Année (pour faciliter les requêtes)
  - `isActive`: Actif/Inactif

- **`PricingSettings`**: Paramètres globaux de tarification
  - `cleaningFee`: Frais de ménage
  - `linenPerPerson`: Linge par personne
  - `depositAmount`: Montant de la caution
  - `defaultHighSeasonPrice`: Prix haute saison par défaut
  - `defaultLowSeasonPrice`: Prix basse saison par défaut
  - `defaultMinimumStay`: Séjour minimum par défaut

### 2. APIs Créées

#### `/api/admin/seasons` (CRUD complet)
- **GET**: Récupérer toutes les périodes de saison
- **POST**: Créer une nouvelle période
- **PUT**: Mettre à jour une période existante
- **DELETE**: Supprimer une période

#### `/api/admin/pricing-settings`
- **GET**: Récupérer les paramètres de tarification
- **PUT**: Mettre à jour les paramètres

#### `/api/seasons` (API Publique)
- **GET**: Récupérer les saisons actives + paramètres (pour le module de réservation)

### 3. Nouvelles Fonctions Utilitaires
**Fichier**: `lib/utils/pricing.ts`

Fonctions créées pour remplacer celles de `lib/utils/index.ts`:
- `fetchSeasons()`: Récupère les saisons depuis l'API
- `findSeasonForDate()`: Trouve la saison pour une date donnée
- `getPriceForDate()`: Obtient le prix pour une date
- `calculatePriceWithSeasons()`: Calcule le prix total avec détails nuit par nuit
- `containsHighSeasonDays()`: Vérifie si une période contient des jours de haute saison
- `validateBookingDatesWithSeasons()`: Valide les dates de réservation selon les règles

### 4. Interface Admin
**Fichier**: `app/admin/page.tsx`

Nouvel onglet "Paramètres" avec:
- **Paramètres Généraux**: Modification des frais de ménage, caution, prix par défaut, etc.
- **Gestion des Saisons**:
  - Tableau listant toutes les saisons
  - Bouton pour ajouter une nouvelle saison
  - Édition/suppression de saisons existantes
  - Modal d'ajout/édition avec tous les champs

## 🔄 Étapes Restantes

### 5. ✅ Adapter le Module de Réservation
**Fichier modifié**: `app/booking/page.tsx`

**Modifications effectuées**:
1. ✅ Remplacé l'import de `calculatePrice` par `calculatePriceWithSeasons`
2. ✅ Remplacé `validateBookingDates` par `validateBookingDatesWithSeasons`
3. ✅ Ajout d'un useEffect pour charger les saisons au montage du composant
4. ✅ Ajout des états pour `seasons`, `pricingSettings`, et `isLoadingSeasons`
5. ✅ Mise à jour de l'affichage des tarifs pour utiliser les données dynamiques de la base de données
6. ✅ Ajout d'un état de chargement pendant la récupération des saisons
7. ✅ Affichage des périodes de saison réelles au lieu des dates codées en dur

### 6. ✅ Nettoyage du Code Legacy
**Fichiers modifiés**:
- `lib/utils/index.ts`: Suppression de toutes les anciennes fonctions de pricing
- `lib/data/chalet.ts`: Suppression de l'objet `pricing` exporté
- `types/index.ts`: Suppression de l'interface `Pricing`

**Fonctions supprimées de `lib/utils/index.ts`**:
- ❌ `calculateNights()` - Remplacée par celle dans `lib/utils/pricing.ts`
- ❌ `getSeason()` - Remplacée par `findSeasonForDate()` basée sur la DB
- ❌ `calculatePrice()` - Remplacée par `calculatePriceWithSeasons()`
- ❌ `isSunday()` - Déplacée vers `lib/utils/pricing.ts`
- ❌ `containsHighSeasonDays()` - Remplacée par `containsHighSeasonDays()` dans pricing.ts
- ❌ `validateBookingDates()` - Remplacée par `validateBookingDatesWithSeasons()`

**Fonctions conservées dans `lib/utils/index.ts`**:
- ✅ `formatEuro()` - Utilisée partout dans l'app
- ✅ `formatDate()` - Utilitaire de formatage de dates
- ✅ `cn()` - Utilitaire pour classes CSS

### 7. ✅ Migration de la Base de Données

**Commandes exécutées**:

```bash
# ✅ Migration créée et appliquée
npx prisma migrate dev --name add_season_pricing_tables

# ✅ Client Prisma généré automatiquement
# (inclus dans la commande migrate)

# ✅ Base de données seedée avec données initiales
npm run db:seed
```

**Résultat**:
- ✅ Tables `SeasonPeriod` et `PricingSettings` créées
- ✅ Paramètres de tarification initialisés (450€ ménage, 1500€ caution, etc.)
- ✅ 6 saisons créées pour 2025:
  - Vacances de Noël 2024-2025 (20 déc - 7 jan)
  - Février 2025 (tout le mois)
  - Pâques 2025 (24 mars - 14 avr)
  - Été 2025 - Juin, Juillet, Août

### 8. ✅ Fichier de Seed Créé
**Fichier**: `prisma/seed-seasons.ts`

Le script de seed a été créé et exécuté avec succès. Il initialise:
- Les paramètres de tarification (frais de ménage, caution, prix par défaut)
- 6 saisons pour 2025 (Noël, Février, Pâques, Juin, Juillet, Août)

**Commandes disponibles**:
```bash
# Seed la base (script principal)
npm run db:seed

# Ou via Prisma directement
npx prisma db seed
```

**Note**: Le script utilise `upsert` pour éviter les doublons et peut être exécuté plusieurs fois sans problème.

## 🎯 Avantages du Nouveau Système

1. **Flexibilité**: Les saisons peuvent être modifiées sans toucher au code
2. **Granularité**: Chaque période peut avoir ses propres règles (prix, minimum, dimanche-dimanche)
3. **Historique**: Les saisons passées restent en base pour référence
4. **Multi-années**: Possibilité de gérer plusieurs années à l'avance
5. **Interface Admin**: Modification facile via l'interface web

## 📝 Notes

- ✅ Les anciennes fonctions de pricing ont été supprimées de `lib/utils/index.ts` (nettoyage effectué)
- ✅ L'objet `pricing` a été supprimé de `lib/data/chalet.ts` et le type `Pricing` de `types/index.ts`
- Le fichier `lib/utils/index.ts` ne contient maintenant que les utilitaires génériques (`formatEuro`, `formatDate`, `cn`)
- Le système de cache (5 minutes) évite trop d'appels à la base de données
- Les paramètres par défaut sont utilisés si aucune saison ne correspond à une date
- L'API publique `/api/seasons` est optimisée pour le module de réservation

## 🔧 Tests à Effectuer

### Tests Admin
1. ⚠️ Vérifier que l'onglet Paramètres charge correctement
2. ⚠️ Créer une nouvelle saison
3. ⚠️ Modifier une saison existante
4. ⚠️ Supprimer une saison
5. ⚠️ Modifier les paramètres de tarification

### Tests Module de Réservation
6. ⚠️ Tester le module de réservation avec les nouvelles fonctions
7. ⚠️ Vérifier que les prix sont calculés correctement selon les saisons
8. ⚠️ Vérifier les validations (séjour minimum)
9. ⚠️ Vérifier la règle dimanche-dimanche pour haute saison
10. ⚠️ Tester une réservation qui chevauche plusieurs saisons

**Prochaine étape**: Démarrer le serveur de développement et tester l'interface:
```bash
npm run dev
```

Puis accéder à:
- Module de réservation: http://localhost:3000/booking
- Interface admin: http://localhost:3000/admin (onglet Paramètres)
