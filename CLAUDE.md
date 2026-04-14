# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes essentielles

**Gestionnaire de paquets : `pnpm` uniquement** (ne pas utiliser `npm`).

```bash
# Développement local
pnpm install --frozen-lockfile
pnpm dev                          # Lance tout : backend + Svelte watch + Jekyll watch + DB + migrations

# Tests
pnpm test                         # Tous les packages
pnpm --filter @anssi-portail/back test          # Backend uniquement
pnpm --filter @anssi-portail/svelte test        # Svelte uniquement

# Lancer un seul test backend (Node test runner natif)
node --import tsx --test ./back/tests/metier/guide.spec.ts

# Build
pnpm --filter @anssi-portail/back build         # Compile TypeScript
pnpm --filter @anssi-portail/svelte build       # Build Svelte/Vite

# Qualité de code
pnpm --filter @anssi-portail/back typecheck
pnpm --filter @anssi-portail/back lint
pnpm --filter @anssi-portail/back lint:fix
```

> `pretest` lance automatiquement `typecheck` + `lint` avant chaque `pnpm test`.

## Architecture du monorepo

Monorepo pnpm (`pnpm-workspace.yaml`) avec deux packages principaux :

- **`back/`** — API Node.js/Express/TypeScript (port 3000), sert aussi les fichiers statiques Jekyll
- **`front/`** — Site statique Jekyll (Ruby) + bibliothèque de composants Svelte (`front/lib-svelte/`)

Le backend compile vers `back/dist/` ; Jekyll génère vers `front/_site/` ; les composants Svelte compilent vers `front/lib-svelte/dist/`.

## Architecture backend (`back/src/`)

Organisation en couches hexagonales :

### `metier/` — Domaine métier
- Classes de domaine : `Guide`, `Utilisateur`, `SessionDeGroupe`, `Financement`, etc.
- **Interfaces "Entrepôt"** (pattern Repository) : `EntrepotGuide`, `EntrepotUtilisateur`, `EntrepotFavori`…
- Services métier : `ServiceSanteGuides`, `RepartitionResultatsTest`

### `api/` — Couche HTTP
- **Pattern Ressource** : chaque fichier `ressource*.ts` exporte une fonction `(config: ConfigurationServeur) => Router`.
- `middleware.ts` : JWT, OIDC, rate limiting, CSP, validation des entrées

### `infra/` — Infrastructure
- **Implémentations des entrepôts** : PostgreSQL (`*Postgres.ts`), Grist CMS (`*Grist.ts`)
- **Adaptateurs** : `adaptateurCellar.ts` (S3), `adaptateurEmailBrevo.ts`, `adaptateurHachage.ts`, `adaptateurChiffrement.ts`
- Grist est utilisé comme CMS pour les Guides, Financements et Exigences NIS2

### `bus/` — Bus d'événements
- Publication/souscription asynchrone (ex : `CompteCreé` → email + log + Brevo)
- Câblage dans `cablage.ts`

### `serveur.ts`
Point d'entrée : instancie tous les adaptateurs, branche le bus, crée le serveur Express.

## Tests backend

- **Framework** : Node.js test runner natif (`node:test`) + `tsx`
- **Fichiers** : `back/tests/**/*.spec.ts`
- **Structure** : `tests/metier/` (tests unitaires domaine), `tests/api/` (tests d'intégration HTTP avec `supertest`), `tests/infra/` (tests infra)
- **Faux objets** : `tests/api/fauxObjets.ts` et `tests/persistance/entrepot*Memoire.ts` (implémentations mémoire des entrepôts pour les tests)
- **Objets prêts à l'emploi** : `tests/api/objetsPretsALEmploi.ts` (instances de domaine préconfigurées)

## Tests frontend (Svelte)

- **Framework** : Vitest
- **Fichiers** : `front/lib-svelte/test/**/*.spec.ts`

## Base de données

PostgreSQL 14, géré avec Knex.

```bash
docker compose up db                            # Démarre le conteneur Postgres
docker compose exec db createdb -U postgres msc # Crée la base (premier démarrage)
pnpm --filter @anssi-portail/back migre-bdd     # Applique les migrations
```

Les migrations s'exécutent automatiquement au démarrage du serveur (`pnpm dev` / `pnpm start`).

## Exploitation — opérations sensibles

Les données utilisateurs sont hachées (HMAC versionné) et certaines chiffrées (ChaCha20). Pour une rotation de sel ou de clé :

1. Activer `MODE_MAINTENANCE=true`
2. Lancer `pnpm admin` (console interactive Node.js)
3. Exécuter `await admin.migreToutLesHaches(version, 'nouveauSel')` ou `await admin.remplaceLaCleDeChiffrement('ancien', 'nouveau')`
4. Mettre à jour les variables d'environnement correspondantes, puis désactiver la maintenance
