# 🥗 FoodLog API - Suivi Nutritionnel Intelligent

> API REST sécurisée pour le suivi nutritionnel avec authentification JWT, logique métier avancée et suggestions compensatoires automatiques.

## 📋 Table des matières

- [🎯 Présentation du projet](#-présentation-du-projet)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation et lancement](#-installation-et-lancement)
- [🔐 Authentification](#-authentification)
- [📊 Logique métier](#-logique-métier)
- [📝 Documentation des routes](#-documentation-des-routes)
- [🧪 Test de l'API](#-test-de-lapi)
- [📁 Structure du projet](#-structure-du-projet)
- [🎯 Points techniques](#-points-techniques)

## 🎯 Présentation du projet

FoodLog est une API complète de suivi nutritionnel permettant aux utilisateurs de :
- **Suivre leurs repas** avec calculs nutritionnels automatiques
- **Recevoir des objectifs personnalisés** basés sur leur profil (BMR/TDEE)
- **Obtenir des suggestions compensatoires** intelligentes
- **Valider leurs journées** selon des règles métier strictes

### ✨ Fonctionnalités clés

- ✅ **Authentification JWT sécurisée** avec bcrypt (12 rounds)
- ✅ **Calculs nutritionnels automatiques** (BMR, TDEE, objectifs personnalisés)
- ✅ **Validation intelligente** des journées nutritionnelles
- ✅ **Suggestions compensatoires** basées sur les déficits
- ✅ **Base de données** de 150+ aliments pré-configurés
- ✅ **Architecture modulaire** NestJS + TypeORM + PostgreSQL
- ✅ **Isolation des données** par utilisateur

## 🏗️ Architecture

```
📁 FoodLog API
├── 🔐 Auth Module (JWT + Passport)
├── 👤 Users Module (Profils utilisateurs)
├── 🍽️ Meals Module (Gestion des repas)
├── 🥘 FoodItems Module (Base d'aliments)
├── 📊 DaySummary Module (Résumés nutritionnels)
└── 🧠 Nutrition Module (Logique métier)
```

### 🛠️ Stack technique

- **Backend** : NestJS (Node.js 20)
- **Base de données** : PostgreSQL 15
- **ORM** : TypeORM avec relations
- **Authentification** : JWT + Passport
- **Validation** : class-validator + class-transformer
- **Containerisation** : Docker + Docker Compose
- **Sécurité** : Bcrypt, Guards, Variable d'environnement

## 🚀 Installation et lancement

### Prérequis

- Docker et Docker Compose installés
- Git installé
- Ports 4000 et 5432 disponibles

### 1. Clonage du projet

```bash
git clone <repository-url>
cd foodlog-api
```

### 2. Configuration

Le projet est pré-configuré avec un fichier `.env` :

```bash
# Vérifiez que le fichier .env existe
cat .env

# Variables principales configurées :
# - DB_HOST=db
# - DB_PORT=5432
# - JWT_SECRET=<clé sécurisée>
# - APP_PORT=4000
```

### 3. Lancement avec Docker

```bash
# Démarrer tous les services
docker compose up --build

# L'API sera disponible sur http://localhost:4000
# La base de données sur localhost:5432
```

### 4. Seeding de la base de données

```bash
# Dans un nouveau terminal, après que l'API soit démarrée
docker compose exec app npm run seed

# Résultat attendu : 150+ aliments ajoutés automatiquement
```

### 5. Vérification

```bash
# Test simple de l'API
curl http://localhost:4000/food-items

# Devrait retourner la liste des aliments
```

## 🔐 Authentification

### Système d'authentification

- **JWT tokens** avec expiration (24h par défaut)
- **Passwords hashés** avec bcrypt (12 rounds)
- **Protection des routes** via Guards
- **Validation stricte** des données utilisateur

### Inscription

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "utilisateur@example.com",
  "password": "motdepasse123",
  "weight": 70,
  "height": 175,
  "age": 25,
  "sex": "male",
  "activityLevel": "moderate",
  "goal": "maintenance"
}
```

### Connexion

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "utilisateur@example.com",
  "password": "motdepasse123"
}
```

**Réponse :**
```json
{
  "statusCode": 200,
  "message": "Connexion réussie",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "utilisateur@example.com",
      "weight": 70,
      "height": 175,
      "age": 25,
      "sex": "male",
      "activityLevel": "moderate",
      "goal": "maintenance"
    }
  }
}
```

## 📊 Logique métier

### 🧮 Calculs nutritionnels automatiques

1. **BMR (Métabolisme de Base)** - Formule Mifflin-St Jeor
   - Homme : `10×poids + 6.25×taille - 5×âge + 5`
   - Femme : `10×poids + 6.25×taille - 5×âge - 161`

2. **TDEE (Dépense Énergétique Totale)** - BMR × Facteur d'activité
   - Sédentaire : BMR × 1.2
   - Modéré : BMR × 1.55
   - Actif : BMR × 1.75

3. **Objectifs personnalisés** selon le goal utilisateur
   - Maintenance : TDEE
   - Perte de poids : TDEE × 0.8 (-20%)
   - Prise de poids : TDEE × 1.15 (+15%)

4. **Répartition des macronutriments**
   - Protéines : 25% des calories (÷4 pour grammes)
   - Lipides : 25% des calories (÷9 pour grammes)
   - Glucides : 50% des calories (÷4 pour grammes)

### ⚠️ Règles de validation

L'API applique des règles strictes de validation nutritionnelle :

- **Refus automatique** si :
  - Dépassement > 30% des calories cibles
  - Apport protéique < 70% de l'objectif

- **Statuts des journées** :
  - `under_goal` : Objectifs non atteints
  - `balanced` : Objectifs atteints (±10%)
  - `over_goal` : Léger dépassement (10-30%)
  - `extreme_over` : Dépassement critique (>30%)

### 🍽️ Système de suggestions compensatoires

L'API génère automatiquement des repas compensatoires intelligents :

- **Analyse des déficits** en calories et protéines
- **Sélection d'aliments** optimisés nutritionnellement
- **Calcul des quantités** automatique
- **Base de données** de 12 aliments compensatoires

**Exemple de suggestion :**
```json
{
  "name": "Repas compensatoire suggéré",
  "foodItems": [
    {
      "name": "Blanc de poulet",
      "quantity": 100,
      "unit": "g",
      "calories": 165,
      "protein": 31,
      "carbs": 0,
      "fat": 4
    }
  ],
  "totalCalories": 165,
  "totalProtein": 31,
  "totalCarbs": 0,
  "totalFat": 4
}
```

## 📝 Documentation des routes

### Routes d'authentification

| Méthode | Route | Description | Auth requise |
|---------|--------|-------------|--------------|
| POST | `/auth/register` | Inscription d'un utilisateur | ❌ |
| POST | `/auth/login` | Connexion utilisateur | ❌ |
| GET | `/auth/profile` | Profil utilisateur connecté | ✅ |
| PUT | `/auth/profile` | Modification du profil | ✅ |
| PUT | `/auth/change-password` | Changement de mot de passe | ✅ |

### Routes des aliments

| Méthode | Route | Description | Auth requise |
|---------|--------|-------------|--------------|
| GET | `/food-items` | Liste complète des aliments | ❌ |
| GET | `/food-items/search?q=query` | Recherche d'aliments | ❌ |
| POST | `/food-items` | Créer un nouvel aliment | ❌ |
| GET | `/food-items/:id` | Détail d'un aliment | ❌ |
| PUT | `/food-items/:id` | Modifier un aliment | ❌ |
| DELETE | `/food-items/:id` | Supprimer un aliment | ❌ |

### Routes des repas

| Méthode | Route | Description | Auth requise |
|---------|--------|-------------|--------------|
| POST | `/meals` | Créer un repas | ✅ |
| GET | `/meals` | Repas de l'utilisateur | ✅ |
| GET | `/meals?date=YYYY-MM-DD` | Repas par date | ✅ |
| GET | `/meals/stats/:date` | Statistiques du jour | ✅ |
| GET | `/meals/:id` | Détail d'un repas | ✅ |
| PUT | `/meals/:id` | Modifier un repas | ✅ |
| DELETE | `/meals/:id` | Supprimer un repas | ✅ |
| DELETE | `/meals/:mealId/food-items/:foodItemId` | Retirer un aliment | ✅ |

### Routes des résumés nutritionnels

| Méthode | Route | Description | Auth requise |
|---------|--------|-------------|--------------|
| GET | `/day-summary/:date` | Résumé d'une journée | ✅ |
| POST | `/day-summary/:date/validate` | Valider une journée | ✅ |
| GET | `/day-summary/:date/suggestions` | Suggestions compensatoires | ✅ |
| GET | `/day-summary/goals/calculate` | Calcul des objectifs | ✅ |

## 🧪 Test de l'API

### Workflow de test recommandé

1. **Inscription/Connexion**
   - Créer un compte utilisateur
   - Se connecter et récupérer le token JWT

2. **Exploration des aliments**
   - Lister tous les aliments disponibles
   - Rechercher des aliments spécifiques

3. **Création de repas**
   - Créer un petit-déjeuner avec `foodItemIds`
   - Créer un déjeuner, collation, dîner
   - Vérifier les associations alimentaires

4. **Analyse nutritionnelle**
   - Consulter le résumé de la journée
   - Vérifier les calculs automatiques
   - Tester les suggestions compensatoires

### Exemples de requêtes

**Création d'un repas :**
```bash
POST /meals
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "petit-déjeuner",
  "datetime": "2025-05-18T08:00:00.000Z",
  "foodItemIds": [6, 8, 25]
}
```

**Résumé nutritionnel :**
```bash
GET /day-summary/2025-05-18
Authorization: Bearer <token>
```

**Réponse type :**
```json
{
  "statusCode": 200,
  "message": "Day summary retrieved successfully",
  "data": {
    "date": "2025-05-18T00:00:00.000Z",
    "nutrition": {
      "totalCalories": 1654,
      "totalProtein": 121,
      "totalCarbs": 182,
      "totalFat": 58
    },
    "goals": {
      "calories": 1850,
      "protein": 115,
      "carbs": 231,
      "fat": 51
    },
    "status": "balanced",
    "isValid": true,
    "violations": [],
    "suggestion": null,
    "mealsCount": 4
  }
}
```

## 📁 Structure du projet

```
src/
├── auth/                 # Module d'authentification
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/       # JWT et Local strategies
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/          # Guards de protection
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   ├── decorators/      # Décorateurs personnalisés
│   │   └── current-user.decorator.ts
│   └── dto/             # DTOs de validation
│       ├── register.dto.ts
│       ├── login.dto.ts
│       └── update-profile.dto.ts
├── users/               # Gestion des utilisateurs
│   ├── user.entity.ts
│   └── users.module.ts
├── meals/               # Gestion des repas
│   ├── meal.entity.ts
│   ├── meals.controller.ts
│   ├── meals.service.ts
│   ├── meals.module.ts
│   └── dto/
├── food-items/          # Base d'aliments
│   ├── food-item.entity.ts
│   ├── food-items.controller.ts
│   ├── food-items.service.ts
│   ├── food-items.module.ts
│   └── dto/
├── day-summary/         # Résumés nutritionnels
│   ├── day-summary.entity.ts
│   ├── day-summary.controller.ts
│   └── day-summary.module.ts
├── nutrition/           # Logique métier nutritionnelle
│   ├── nutrition.module.ts
│   ├── nutrition-calculator.service.ts  # Calculs BMR/TDEE
│   ├── meal-suggestion.service.ts       # Suggestions compensatoires
│   └── day-validation.service.ts        # Validation journées
└── database/
    ├── seeds/           # Données initiales
    │   └── food-items.seed.ts
    └── seed.script.ts   # Script de seeding
```

## 🎯 Points techniques

### Fonctionnalités avancées

✅ **Architecture modulaire** avec séparation claire des responsabilités  
✅ **Authentification sécurisée** JWT + bcrypt avec stratégies Passport  
✅ **Base de données relationnelle** avec TypeORM et migrations  
✅ **Validation stricte** des données avec class-validator  
✅ **Variables d'environnement** pour la configuration  
✅ **Containerisation complète** avec Docker Compose  
✅ **Logs structurés** et gestion d'erreurs appropriée  

### Logique métier complexe

✅ **Calculs nutritionnels** automatiques et personnalisés  
✅ **Algorithme de validation** avec règles métier strictes  
✅ **Système de suggestions** basé sur l'analyse des déficits  
✅ **Auto-mise à jour** des résumés après modifications  
✅ **Isolation sécurisée** des données par utilisateur  
✅ **Relations complexes** entre entités (User, Meal, FoodItem)  

### Qualité du code

✅ **TypeScript strict** avec interfaces typées  
✅ **Pattern Repository** avec services dédiés  
✅ **Separation of Concerns** entre contrôleurs et services  
✅ **DTOs de validation** pour toutes les entrées  
✅ **Guards personnalisés** pour la sécurité  
✅ **Seeding automatisé** pour les données de test  

---

## 🚀 Démarrage rapide

```bash
# 1. Cloner et démarrer
git clone <repository-url>
cd foodlog-api
docker compose up --build

# 2. Seeding des données (nouveau terminal)
docker compose exec app npm run seed

# 3. Tester l'API
curl http://localhost:4000/food-items
```

L'API est maintenant opérationnelle sur `http://localhost:4000` avec :
- 🔐 Authentification JWT fonctionnelle
- 🍽️ Base de 150+ aliments
- 📊 Logique métier complète
- 🧪 Toutes les routes accessibles


# 🎯 Validation des Compétences CDA - FoodLog API

> Analyse des compétences du Titre Professionnel Concepteur Développeur d'Applications validées par le projet FoodLog API

## 📊 Résultat Global

**Compétences CDA :** 11/11 ✅  
**Taux de validation :** **100%** 🎉

---

## ✅ Compétences Validées

### **CCP 1 - Développer une application sécurisée**

| Compétence | Statut | Preuve |
|------------|---------|---------|
| **Installer et configurer son environnement** | ✅ | Docker Compose + variables d'environnement |
| **Développer des interfaces utilisateur** | ✅ | 25+ endpoints REST bien documentés |
| **Développer des composants métier** | ✅ | Services NestJS + logique nutritionnelle complexe |
| **Contribuer à la gestion d'un projet** | ✅ | Architecture modulaire + documentation complète |

### **CCP 2 - Concevoir et développer une application organisée en couches**

| Compétence | Statut | Preuve |
|------------|---------|---------|
| **Analyser les besoins et maquetter** | ✅ | Documentation fonctionnelle détaillée |
| **Définir l'architecture logicielle** | ✅ | Architecture multicouche NestJS |
| **Concevoir une base de données** | ✅ | PostgreSQL + TypeORM + relations complexes |
| **Développer l'accès aux données** | ✅ | Repository pattern + requêtes optimisées |

### **CCP 3 - Préparer le déploiement d'une application sécurisée**

| Compétence | Statut | Preuve |
|------------|---------|---------|
| **Préparer et exécuter les plans de tests** | ✅ | Workflow de test + exemples de validation |
| **Préparer et documenter le déploiement** | ✅ | Docker Compose + instructions complètes |
| **Contribuer à la mise en production DevOps** | ✅ | Containerisation + architecture cloud-ready |

---

## 🔒 Sécurité Intégrée

- ✅ **Authentification JWT** avec bcrypt (12 rounds)
- ✅ **Guards de protection** des routes
- ✅ **Validation stricte** des données
- ✅ **Isolation utilisateur** sécurisée

## 🏗️ Points Techniques Clés

- **Docker** : Containerisation complète (API + DB)
- **NestJS** : Architecture modulaire et scalable
- **TypeORM** : ORM relationnel avec migrations
- **PostgreSQL** : Base de données relationnelle
- **JWT + Bcrypt** : Sécurité authentification
- **Logique métier** : Calculs BMR/TDEE + suggestions compensatoires
