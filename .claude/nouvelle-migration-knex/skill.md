# Nouvelle Migration Knex

Crée une nouvelle migration Knex pour ce projet.

## Commande

```bash
node --env-file=.env --import tsx ./back/node_modules/knex/bin/cli.js migrate:make <nom> --knexfile back/knexfile.ts
```

Remplace `<nom>` par le nom de la migration en **camelCase** (verbe + complément).

Exemples :
- `nettoyePrefixeBonneNouvelleMesures`
- `ajouteTableUtilisateurs`
- `supprimeForeignKeyObsolete`

## Résultat

Génère un fichier `back/migrations/<timestamp>_<nom>.ts` avec la structure standard :

```typescript
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // modifications de schéma ou données
}

export async function down(knex: Knex): Promise<void> {
  // rollback inversant up()
}
```

## Exécution

Applique la migration au développement (automatique lors de `pnpm dev`), ou manuellement :

```bash
pnpm migre-bdd
```

Pour tester le rollback (si supporté par le script) :

```bash
node --env-file=.env --import tsx ./back/node_modules/knex/bin/cli.js migrate:rollback --knexfile back/knexfile.ts
```
