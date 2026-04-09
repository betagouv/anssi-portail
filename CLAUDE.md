# Portail ANSSI — Guide pour Claude Code

## Contexte projet

Portail de ressources cybersécurité de l'ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information).
Monorepo pnpm hébergé sur CleverCloud.

## Règle absolue : tout le code est en français

Variables, fonctions, classes, noms de fichiers, commentaires, messages de commit : **tout est en français**.
Ne jamais écrire d'identifiant en anglais sauf pour les APIs externes (ex. `axios`, `express`, `knex`),
les noms de librairies, et les mots-clés du langage TypeScript/JavaScript.

## Structure du monorepo

| Package                     | Rôle                                                |
| --------------------------- | --------------------------------------------------- |
| `back/`                     | Serveur Express + API REST (Node.js 24, TypeScript) |
| `front/`                    | Site statique Jekyll + composants Svelte montés     |
| `front/lib-svelte/`         | Bibliothèque de composants Svelte 5                 |
| `demande-diag/`             | Web Components (Svelte + Vite)                      |
| `mise-a-jour-financements/` | Outil CLI de synchronisation Grist                  |
| `comparaison-grist/`        | Outil de comparaison des guides                     |

## Format des commits

```
[CATEGORIE] Message impératif en français
```

Catégories courantes : `DOCUMENTATION`, `SOIN` (refacto/formatage), `SECU` (mise à jour sécurité),
`CORRECTION`, et des noms de feature (ex. `[FAVORIS]`, `[NIS2]`, `[INFOLETTRE]`, `[GUIDES]`).

Exemples :

- `[SOIN] Renomme la variable pour plus de clarté`
- `[CORRECTION] Corrige la pagination des financements`
- `[SECU] Monte la version de lodash en 4.18.1`
- `[FAVORIS] Ajoute le partage de liste de favoris`

## Commandes disponibles

```bash
pnpm dev          # Lance tous les services (back + svelte + jekyll + bdd + migrations)
pnpm test         # Lance tous les tests (précédé de typecheck et lint)
pnpm build        # Compile tous les packages
pnpm lint         # ESLint sur tous les packages
pnpm format       # Prettier sur tous les packages
pnpm migre-bdd    # Exécute les migrations Knex
pnpm admin        # Lance la console d'administration
```

## Style de code (Prettier)

- 120 caractères par ligne
- Guillemets simples
- Virgules finales style ES5
- Config dans `.prettierrc.json` à la racine

## Pre-commit hook

`prek` exécute `pnpm format` avant chaque commit. Ne jamais contourner avec `--no-verify`.

## Interdictions

- Pas de type `any` (eslint le refuse)
- Pas de `console.log` en production (utiliser l'adaptateur journal)
- Pas d'identifiants en anglais dans le code métier
- Pas de secret codé en dur (utiliser `adaptateurEnvironnement`)
