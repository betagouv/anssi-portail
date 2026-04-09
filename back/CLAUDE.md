# Back — Guide pour Claude Code

## Architecture en couches (respecter l'ordre)

```
back/src/
├── api/          ← Présentation : routes Express, validation entrées, middlewares HTTP
├── metier/       ← Domaine : interfaces, entités, logique métier pure
├── infra/        ← Infrastructure : implémentations concrètes (Postgres, Brevo, S3, Grist…)
├── bus/          ← Bus d'événements et handlers (consignes)
└── admin/        ← Console d'administration interactive
```

La couche `metier/` ne doit jamais importer depuis `api/` ou `infra/`. La couche `api/` peut importer depuis
`metier/` mais pas directement depuis `infra/` (passer par `ConfigurationServeur`).

## Conventions de nommage (strictes)

| Concept                        | Convention                 | Exemple                           |
| ------------------------------ | -------------------------- | --------------------------------- |
| Route Express                  | `ressource<Nom>.ts`        | `ressourceFavoris.ts`             |
| Interface de dépôt             | `entrepot<Nom>.ts`         | `entrepotFavori.ts`               |
| Implémentation Postgres        | `entrepot<Nom>Postgres.ts` | `entrepotFavoriPostgres.ts`       |
| Implémentation mémoire (tests) | `entrepot<Nom>Memoire.ts`  | `entrepotFavoriMemoire.ts`        |
| Adaptateur service externe     | `adaptateur<Nom>.ts`       | `adaptateurEmail.ts`              |
| Handler d'événement            | `consigne<Nom>.ts`         | `consigneEvenementDansJournal.ts` |
| Événement du bus               | `bus/evenements/<nom>.ts`  | `bus/evenements/compteCree.ts`    |

## Pattern constructeur (obligatoire pour les entités)

Toujours passer un objet paramètre nommé, jamais des arguments positionnels multiples :

```typescript
class MonEntite {
  readonly champ1: string;
  readonly champ2: number;

  constructor({ champ1, champ2 }: { champ1: string; champ2: number }) {
    this.champ1 = champ1;
    this.champ2 = champ2;
  }
}
```

## Pattern d'une ressource API

Voir `back/src/api/favoris/ressourceFavoris.ts` comme référence complète.

```typescript
// back/src/api/monDomaine/ressourceMonEntite.ts
import { ConfigurationServeur } from '../configurationServeur';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { filetRouteAsynchrone } from '../middleware';

const schemaCorps = z.object({
  monChamp: z.string().min(1, 'Le champ est invalide'),
});

const ressourceMonEntite = ({
  middleware,
  entrepotMonEntite,
  adaptateurHachage,
  entrepotUtilisateur,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    middleware.verifieJWT,
    middleware.aseptise('monChamp'),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const resultatValidation = schemaCorps.safeParse(requete.body);
      if (!resultatValidation.success) {
        reponse.sendStatus(400);
        return;
      }
      const { monChamp } = resultatValidation.data;
      // logique métier
      reponse.sendStatus(201);
    })
  );

  return routeur;
};

export { ressourceMonEntite };
```

Après création : monter dans `back/src/api/msc.ts` et déclarer les dépendances
dans `back/src/api/configurationServeur.ts`.

## Pattern d'une interface d'entrepôt (couche métier)

```typescript
// back/src/metier/entrepotMonEntite.ts
import { MonEntite } from './monEntite';

export interface EntrepotMonEntite {
  ajoute(entite: MonEntite): Promise<void>;
  parId(id: string): Promise<MonEntite | undefined>;
  tous(): Promise<MonEntite[]>;
}
```

## Bus d'événements

1. **Définir l'événement** dans `back/src/bus/evenements/` :

```typescript
export class MonEvenement {
  readonly donnee: string;
  constructor({ donnee }: { donnee: string }) {
    this.donnee = donnee;
  }
}
```

2. **Créer le handler** dans `back/src/bus/consigne<Nom>.ts` :

```typescript
export const consigneMonEvenementDansJournal =
  (adaptateurJournal: AdaptateurJournal) =>
  async (evenement: MonEvenement) => {
    await adaptateurJournal.consigne({ ... });
  };
```

3. **Abonner** dans `back/src/bus/cablage.ts` :

```typescript
busEvenements.abonne(MonEvenement, consigneMonEvenementDansJournal(adaptateurJournal));
```

4. **Publier** depuis la ressource :

```typescript
await busEvenements.publie(new MonEvenement({ donnee: '...' }));
```

## Tests backend

- Runner : `node:test` + `assert` (pas de Jest, pas de Mocha)
- HTTP : `supertest`
- Pas de mocks de fonctions — utiliser les implémentations mémoire
- Répertoire : `back/tests/` (miroir de `back/src/`)
- Faux objets centraux : `back/tests/api/fauxObjets.ts` — contient `configurationDeTestDuServeur`,
  `fauxMiddleware`, `fauxAdaptateurJWT`, etc.
- Utilisateurs de test prêts à l'emploi : `back/tests/api/objetsPretsALEmploi.ts`
- Implémentations mémoire : `back/tests/persistance/entrepot*Memoire.ts`

Structure minimale d'un test de ressource :

1. Vérifier que `middleware.verifieJWT` est appelé sur chaque route protégée
2. Tester le cas nominal (statut correct + données attendues)
3. Tester les cas d'erreur de validation (400)
4. Vérifier la persistance dans l'entrepôt mémoire

## Migrations Knex

Créer :

```bash
node --env-file=.env --import tsx ./back/node_modules/knex/bin/cli.js migrate:make <nomCamelCase> --knexfile back/knexfile.ts
```

Nommage camelCase décrivant l'action : `creeTableFavoris`, `ajouteColonneRoleUtilisateur`,
`supprimeColonneEmailCleEtrangere`.

Structure standard :

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ma_table', (table) => {
    table.text('id').primary();
    table.text('email_hache').notNullable(); // jamais d'email en clair
    table.datetime('date_creation').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ma_table');
}
```

Appliquer : `pnpm migre-bdd`

## Sécurité (contexte ANSSI — critique)

- Les **emails** sont toujours **hachés** avant stockage — jamais d'email en clair en base
- Les données sensibles sont **chiffrées** via `adaptateurChiffrement` (ChaCha20)
- L'authentification utilise uniquement OIDC (AgentConnect) — jamais de mot de passe maison
- Toutes les routes avec données utilisateur → `middleware.verifieJWT`
- Toutes les entrées utilisateur → `middleware.aseptise()` puis validation via un schéma **zod**
  (`z.object(...).safeParse(requete.body)`)
- Ne jamais construire de requête SQL par concaténation — utiliser Knex
- Ne jamais exposer de détails d'implémentation dans les réponses d'erreur
