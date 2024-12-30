## Middleware d'Authentification

### Configuration

```javascript
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token invalide" });
  }
};
```

### Utilisation du Middleware

#### Protection des Routes

```javascript
// Exemple de route protégée
router.get("/medications", authenticate, async (req, res) => {
  // Accès autorisé uniquement avec un token valide
  // req.user contient les informations du token décodé
});
```

### Réponses du Middleware

#### Erreur 401 - Token Manquant

```json
{
  "message": "Accès refusé, token manquant"
}
```

#### Erreur 400 - Token Invalide

```json
{
  "message": "Token invalide"
}
```

### Fonctionnalités

- Extraction automatique du token du header Authorization
- Validation du token JWT
- Injection des données utilisateur dans l'objet request
- Gestion des erreurs de token

### Sécurité

- Vérification de la présence du token
- Validation de la signature JWT
- Utilisation d'une variable d'environnement pour la clé secrète
- Messages d'erreur génériques pour la sécurité

### Bonnes Pratiques

```javascript
// Configuration correcte du header Authorization
const headers = {
  Authorization: "Bearer " + token,
};

// Utilisation dans les requêtes
fetch("/api/protected-route", {
  headers: headers,
});

// Exemple de protection d'une route avec vérification de rôle
router.get("/admin-only", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès non autorisé" });
  }
  // Suite du traitement
});
```

### Notes Importantes

- Toujours utiliser HTTPS en production
- Stocker JWT_SECRET dans les variables d'environnement
- Ne pas exposer les détails des erreurs en production
- Implémenter une liste noire de tokens si nécessaire
- Considérer l'ajout d'un refresh token pour plus de sécurité
