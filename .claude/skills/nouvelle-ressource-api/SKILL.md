---
name: nouvelle-ressource-api
description: |
  Crée une nouvelle ressource API Express complète (ressource*.ts + entité métier + entrepôt interface +
  entrepôt mémoire pour les tests + tests) en respectant les conventions du projet.
---

Utilise le sous-agent **`developpeur-back`** pour réaliser cette tâche.

Crée une nouvelle ressource API Express pour la fonctionnalité suivante :

**Fonctionnalité :** $ARGUMENTS

## Étapes à suivre dans l'ordre

### 1. Lire les fichiers de référence

Commencer par lire ces fichiers pour comprendre les patterns en vigueur :
- `back/src/api/favoris/ressourceFavoris.ts` — exemple complet (JWT, validation, bus, entrepôt)
- `back/src/api/configurationServeur.ts` — pour savoir comment déclarer les dépendances
- `back/src/api/msc.ts` — pour savoir comment monter la route
- `back/tests/api/fauxObjets.ts` — pour savoir comment écrire les tests

### 2. Créer la couche métier (si elle n'existe pas)

- `back/src/metier/<entite>.ts` — la classe ou le type
- `back/src/metier/entrepot<Entite>.ts` — l'interface du dépôt

### 3. Créer l'implémentation mémoire pour les tests

`back/tests/persistance/entrepot<Entite>Memoire.ts`

Ajouter une instance à `configurationDeTestDuServeur` dans `back/tests/api/fauxObjets.ts`.

Fichier cible : `back/tests/api/<domaine>/ressource<Entite>.spec.ts`
Implémentation cible : `back/src/api/<domaine>/ressource<Entite>.ts`

Respecter pour l'implémentation :
- Destructuration de `ConfigurationServeur` en paramètre
- `middleware.verifieJWT` sur toutes les routes protégées
- `middleware.aseptise()` + schéma **zod** (`z.object(...).safeParse(requete.body)`) sur toutes les entrées
- `filetRouteAsynchrone` pour les handlers async
- Tout le code en français

Suivre le cycle Rouge → Vert → Refactor pour chaque cas, dans cet ordre :

### 4a. Cas nominal
- **Rouge** : écrire le test — appel valide retourne 200 ou 201
- **Vert** : créer le fichier ressource avec le handler minimal
- **Refactor** si nécessaire

### 4b. Vérification JWT (si la route doit être sécurisée)

Si la description de la fonctionnalité ne précise pas si la route doit être protégée, **demander au développeur** avant de continuer.

Si oui :
- **Rouge** : écrire le test — sans token, la route retourne 401
- **Vert** : ajouter `middleware.verifieJWT` sur la route
- **Refactor** si nécessaire

### 4c. Cas d'erreur de validation (si la route accepte un corps)
- **Rouge** : écrire le test — corps invalide retourne 400
- **Vert** : ajouter `middleware.aseptise()` + validation zod dans le handler
- **Refactor** si nécessaire

### 4d. Persistance dans l'entrepôt (si applicable)
- **Rouge** : écrire le test — vérifier que la donnée est bien sauvegardée dans l'entrepôt mémoire
- **Vert** : ajouter l'appel à l'entrepôt dans le handler
- **Refactor** si nécessaire

### 4e. Publication d'événement sur le bus (si applicable)
- **Rouge** : écrire le test — vérifier que l'événement est publié sur le bus
- **Vert** : ajouter la publication dans le handler
- **Refactor** si nécessaire

### 6. Monter la route

Dans `back/src/api/msc.ts` : ajouter `app.use('/api/<chemin>', ressource<Entite>(configurationServeur));`

### 7. Déclarer les dépendances

Dans `back/src/api/configurationServeur.ts` : ajouter les nouveaux entrepôts/adaptateurs au type `ConfigurationServeur`.

## Règles absolues

- Tout en français (identifiants, commentaires, noms de tests)
- Pas de type `any`
- Constructeur avec objet paramètre : `constructor({ champ }: { champ: type })`
- Emails toujours hachés via `adaptateurHachage.hache(email)`
