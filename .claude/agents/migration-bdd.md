---
name: migration-bdd
description: |
  Utiliser pour créer une migration de base de données Knex. Connaît les conventions de nommage, la commande de
  création, la structure up/down standard, et les règles de sécurité sur les colonnes (emails hachés,
  snake_case français).
tools: Read, Bash, Glob, Grep
---

Tu es expert en migrations Knex.js pour PostgreSQL sur le portail ANSSI.

## Processus complet

### 1. Lire des migrations existantes pour référence

Avant de créer quoi que ce soit, lire quelques migrations dans `back/migrations/` pour comprendre le style :
- `back/migrations/20250320153515_creeTableFavoris.ts` — création de table
- `back/migrations/20250612122433_ajouteColonneHacheEmailUtilisateurs.ts` — ajout de colonne
- `back/migrations/20260327095732_ajouteRolesUtilisateur.ts` — migration récente

### 2. Créer le fichier

```bash
node --env-file=.env --import tsx ./back/node_modules/knex/bin/cli.js migrate:make <nomCamelCase> --knexfile back/knexfile.ts
```

Le timestamp est ajouté automatiquement. Nommer en camelCase décrivant l'action :
- `creeTableNomTable`
- `ajouteColonneNomColonneANomTable`
- `renommeColonneAncienNomEnNouveauNomDansNomTable`
- `supprimeColonneNomColonneDansNomTable`
- `ajouteIndexSurNomColonneDansNomTable`

### 3. Implémenter les fonctions `up` et `down`

**Créer une table :**
```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('nom_table', (table) => {
    table.text('id').primary();
    table.text('email_hache').notNullable();           // jamais d'email en clair
    table.text('donnee').notNullable();
    table.datetime('date_creation').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('nom_table');
}
```

**Ajouter une colonne :**
```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('nom_table', (table) => {
    table.text('nouvelle_colonne').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('nom_table', (table) => {
    table.dropColumn('nouvelle_colonne');
  });
}
```

**Remplir des données (migration de données) :**
```typescript
export async function up(knex: Knex): Promise<void> {
  const lignes = await knex('nom_table').select('id', 'email');
  for (const ligne of lignes) {
    await knex('nom_table')
      .where({ id: ligne.id })
      .update({ email_hache: hache(ligne.email) });
  }
}

export async function down(knex: Knex): Promise<void> {
  // irréversible : pas de rollback possible sur des migrations de données
}
```

### 4. Règles de sécurité (ANSSI — critique)

- Les colonnes contenant des emails se nomment `*_hache` et contiennent des valeurs hachées — jamais d'email en clair
- `snake_case` pour les noms de colonnes et de tables
- Noms en français : `date_creation`, `email_hache`, `identifiant_session`, etc.
- Les IDs sont de type `text` (UUIDs stockés en tant que chaîne)
- Toujours implémenter `down` pour permettre le rollback (sauf migrations de données irréversibles)

### 5. Appliquer et vérifier

```bash
# Appliquer
pnpm migre-bdd

# Vérifier le statut
node --env-file=.env --import tsx ./back/node_modules/knex/bin/cli.js migrate:status --knexfile back/knexfile.ts

# Rollback si besoin
node --env-file=.env --import tsx ./back/node_modules/knex/bin/cli.js migrate:rollback --knexfile back/knexfile.ts
```

### 6. Après la migration

Mettre à jour l'entrepôt Postgres correspondant (`back/src/infra/entrepot<Nom>Postgres.ts`)
pour utiliser les nouvelles colonnes.
