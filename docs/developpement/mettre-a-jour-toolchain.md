# Mettre à jour la toolchain

## Mettre à jour `nixpkgs-unstable`

Si `npins` indique que le format des fichiers est obsolète :

```bash
npins upgrade
```

Puis mettre à jour les sources :

```bash
npins update
```

`playwright-cli` étant gelé, cette commande ne le met pas à jour.

## Mettre à jour `playwright-cli`

Choisir une version dans les [releases de `playwright-cli`](https://github.com/microsoft/playwright-cli/releases), puis l'épingler explicitement :

```bash
npins add github microsoft playwright-cli --name playwright-cli --at v0.1.18 --frozen
```

Remplacer `v0.1.18` par la version choisie.

Si `nix-shell` signale une erreur `hash mismatch` pour les dépendances npm, copier le hash indiqué après `got:` dans `npmDepsHash` de [`default.nix`](../../default.nix), puis relancer `nix-shell`.

### Mise à jour du skill playwright-cli

Une mise à jour de `playwright-cli` peut inclure une mise à jour des skills. Lancer la commande:

```bash
playwright-cli install --skills
```

et commiter les modifications avec la mise à jour de playwright-cli.
