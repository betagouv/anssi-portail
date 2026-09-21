---
name: mettre-a-jour-playwright-cli
description: >-
  Met à jour la version gelée de playwright-cli dans anssi-portail, recalcule
  npmDepsHash si nécessaire et régénère le skill playwright-cli fourni par
  l’outil. Utiliser pour toute montée de version de playwright-cli dans ce dépôt.
---

# Mettre à jour playwright-cli

Suivre le guide [`docs/developpement/mettre-a-jour-toolchain.md`](../../../docs/developpement/mettre-a-jour-toolchain.md), qui reste la source de vérité du dépôt.

## Déterminer la version cible

Utiliser la version demandée par l’utilisateur. Sinon, consulter les
[releases officielles](https://github.com/microsoft/playwright-cli/releases) et
retenir la dernière version stable publiée, sans choisir une préversion
implicitement.

Noter l’état initial de `git status --short` et préserver toute modification
sans rapport avec cette mise à jour.

## Mettre à jour la source gelée

Épingler explicitement la version cible :

```bash
npins add github microsoft playwright-cli \
  --name playwright-cli \
  --at <version-cible> \
  --frozen
```

La version doit inclure son préfixe `v`, par exemple `v0.1.21`. Ne pas utiliser
`npins update` pour cette source : elle est gelée.

## Actualiser le hash npm

Construire le shell avec la nouvelle source :

```bash
nix-shell --run 'playwright-cli --version'
```

Si Nix signale un `hash mismatch` pour les dépendances npm, remplacer seulement
`playwrightCli.npmDepsHash` dans `default.nix` par la valeur affichée après
`got:`, puis relancer exactement la même commande. Ne pas deviner le hash.

## Régénérer le skill fourni par playwright-cli

Exécuter l’installation depuis le nouveau shell afin de ne pas utiliser la
version encore présente dans le shell courant :

```bash
nix-shell --run 'playwright-cli install --skills'
```

Cette commande peut réécrire `.agents/skills/playwright-cli`. Examiner toutes
ses modifications et vérifier qu’aucun autre skill ni fichier sans rapport n’a
été modifié.

## Vérifier

Confirmer avant livraison :

```bash
nix-shell --run 'playwright-cli --version'
git diff --check
git status --short
```

La version affichée doit être la version cible. Le diff attendu contient :

- `npins/sources.json` ;
- `default.nix` seulement si `npmDepsHash` a changé ;
- `.agents/skills/playwright-cli/**` seulement si la commande d’installation a
  produit des changements.

Ne pas pousser. Créer un commit seulement si l’utilisateur le demande. Dans ce
cas, regrouper le pin, le hash éventuel et le skill régénéré dans un même commit
atomique, car ils décrivent une seule montée de version.
