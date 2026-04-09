---
name: nouvelle-migration
description: |
  Crée une migration Knex PostgreSQL avec la bonne commande de génération, le nommage camelCase, et la structure
  up/down respectant les conventions du projet (emails hachés, snake_case français).
---

Utilise le sous-agent **`migration-bdd`** pour réaliser cette tâche.

Crée une migration Knex pour la modification suivante :

**Modification de base de données :** $ARGUMENTS

## Étapes

### 1. Lire des migrations existantes pour référence

```
back/migrations/
```

Lire 2-3 migrations récentes pour comprendre le style (notamment `creeTableFavoris.ts`
et `ajouteColonneHacheEmailUtilisateurs.ts`).

### 2. Générer le fichier de migration

```bash
node --env-file=.env --import tsx ./back/node_modules/knex/bin/cli.js migrate:make <nomCamelCase> --knexfile back/knexfile.ts
```

Choisir un nom camelCase décrivant l'action :
- Création de table : `creeTable<Nom>`
- Ajout de colonne : `ajouteColonne<Nom>A<Table>`
- Suppression de colonne : `supprimeColonne<Nom>De<Table>`
- Renommage : `renommeColonne<Ancien>En<Nouveau>Dans<Table>`
- Migration de données : `remplis<Nom>`

### 3. Implémenter `up` et `down`

Ouvrir le fichier généré dans `back/migrations/` et implémenter les deux fonctions.

### 4. Vérifier les contraintes de sécurité

- Colonnes d'email : nommer `*_hache` — jamais d'email en clair
- Noms de colonnes et tables : `snake_case` en français
- IDs : type `text` (pas d'UUID natif Postgres)
- Toujours implémenter `down` pour permettre le rollback

### 5. Appliquer

```bash
pnpm migre-bdd
```

### 6. Mettre à jour l'entrepôt Postgres

Si une nouvelle colonne est ajoutée, mettre à jour `back/src/infra/entrepot<Nom>Postgres.ts` pour l'utiliser.
