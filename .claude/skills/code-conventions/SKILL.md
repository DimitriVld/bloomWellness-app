---
name: code-conventions
description: Conventions pour écrire du code propre, lisible et maintenable
---

# Conventions de code

## Commentaires

- Le code doit être auto-documenté grâce à des noms explicites
- Évite les commentaires évidents qui répètent ce que fait le code
- Commente uniquement le "pourquoi", jamais le "quoi"
- Pas de code commenté : supprime-le

```typescript
// ❌ Mauvais
// Incrémente le compteur
counter++;

// ✅ Bon (pas de commentaire nécessaire)
counter++;

// ✅ Bon (explique le pourquoi)
// Délai de 100ms pour laisser l'animation se terminer
await delay(100);
```

## Découpage du code

- Crée des composants dès qu'un bloc de JSX dépasse ~30 lignes
- Extrait la logique répétée dans des helpers ou hooks
- Un fichier = une responsabilité
- Préfère plusieurs petits fichiers à un gros

```typescript
// ❌ Mauvais : logique dupliquée
const fullName1 = `${user1.firstName} ${user1.lastName}`;
const fullName2 = `${user2.firstName} ${user2.lastName}`;

// ✅ Bon : helper réutilisable
const getFullName = (user: User) => `${user.firstName} ${user.lastName}`;
```

## Simplicité

- Écris le code le plus simple qui fonctionne
- Évite l'over-engineering et les abstractions prématurées
- Préfère la lisibilité à la concision extrême
- Si une fonction fait plus de 20 lignes, découpe-la

## Nommage

- Les noms doivent décrire clairement l'intention
- Pas d'abréviations sauf si universelles (id, url, api)
- Booléens : préfixe `is`, `has`, `should`, `can`
- Fonctions : verbe d'action (`getUser`, `calculateTotal`, `handleSubmit`)

```typescript
// ❌ Mauvais
const d = new Date();
const fn = (u) => u.n;
const flag = true;

// ✅ Bon
const createdAt = new Date();
const getUserName = (user) => user.name;
const isAuthenticated = true;
```