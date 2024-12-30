# Application de Gestion de Pharmacie Hospitalière

## Description

Application web pour la gestion de stock de médicaments en milieu hospitalier. Elle permet aux pharmaciens de gérer l'inventaire, suivre les stocks et recevoir des alertes importantes.

## Technologies Utilisées

- React
- Redux Toolkit pour la gestion d'état
- TailwindCSS pour le styling
- shadcn/ui pour les composants UI
- Vite comme bundler

## Structure du Projet

```bash
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx        # Formulaire de connexion
│   │   ├── RegisterForm.jsx     # Formulaire d'inscription
│   │   └── ProtectedRoute.jsx   # Protection des routes
│   ├── medications/
│   │   ├── MedicationCard.jsx   # Carte de médicament
│   │   ├── MedicationStats.jsx  # Statistiques des médicaments
│   │   ├── MedicationAlerts.jsx # Système d'alertes
│   │   └── MedicationFilters.jsx # Filtres et recherche
│   └── ui/                      # Composants UI réutilisables
│       ├── alert.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       └── select.jsx
├── store/                       # Configuration Redux
│   ├── store.js
│   ├── api/
│   │   └── apiSlice.js         # Configuration axios
│   └── features/
│       ├── auth/
│       │   ├── authSlice.js
│       │   └── authThunks.js
│       └── medications/
│           ├── medicationSlice.js
│           └── medicationThunks.js
├── layouts/
│   └── MainLayout.jsx          # Layout principal
└── pages/
    ├── DashboardPage.jsx       # Dashboard principal
    └── MedicationsPage.jsx     # Page de gestion des stocks
```

## Fonctionnalités Principales

### Authentification

- Connexion/Déconnexion
- Routes protégées par rôle (pharmacien)
- Gestion des tokens JWT

### Dashboard Pharmacien

- Vue d'ensemble des stocks
- Alertes importantes :
  - Médicaments en stock bas
  - Médicaments proche de la date d'expiration
  - Médicaments expirés
- Statistiques en temps réel

### Gestion des Stocks

- Liste complète des médicaments
- Système de recherche et filtrage
- Tri par différents critères :
  - Nom (A-Z, Z-A)
  - Niveau de stock
  - Date d'expiration
  - Stock bas en priorité
- Indicateurs visuels pour les stocks bas et dates d'expiration

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour la production
npm run build
```

## Configuration

L'application nécessite un fichier `.env` avec les variables suivantes :

```env
VITE_API_URL=http://localhost:5001
```

## API Endpoints Utilisés

```javascript
// Authentification
POST / api / auth / login; // Connexion
POST / api / auth / register; // Inscription

// Gestion des médicaments
GET / api / medications; // Liste des médicaments
POST / api / medications / additem; // Ajout d'un médicament
```

## Scripts Disponibles

```bash
# Lance le serveur de développement
npm run dev

# Compile l'application pour la production
npm run build

# Vérifie le code avec ESLint
npm run lint

# Prévisualise la version de production
npm run preview
```

## À Venir

- [ ] Gestion des commandes
- [ ] Système de notifications
- [ ] Statistiques avancées
- [ ] Export de données
- [ ] Gestion des fournisseurs

## Notes de Développement

### Design System

```javascript
// Exemple d'utilisation des composants shadcn/ui
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
```

### État Redux

```javascript
// Exemple de sélecteur Redux
const medications = useSelector(selectAllMedications);
const loading = useSelector(selectMedicationsLoading);
```

### Gestion des Erreurs

```javascript
try {
  // Actions async
} catch (error) {
  dispatch(setError(error.message));
} finally {
  dispatch(setLoading(false));
}
```
