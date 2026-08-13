# Développement

Sommaire

1. [installer les dépendances de développement](#1-dépendances-de-développement) ;
1. [installer la toolchain](#2-installation-toolchain) ;
1. [initialiser le fichier de variables d'environnement](#3-initialisation-du-fichier-de-variables-denvironnement) ;
1. [installer les dépendances du projet](#4-installation-des-dépendances-du-projet) ;
1. [Initialiser la base de données](#5-initialisation-de-la-base-de-données) ;
1. [installer Prek](#6-installation-de-prek) ;
1. [démarrer l'application en local](#7-démarrage-de-lapplication-en-local) ;
1. [construire l'application](#8-construire-lapplication)

## 1. Dépendances de développement

Les outils suivants doivent être présent sur le poste :

- `docker` ou n'importe quel runtime OCI compatible avec `docker-compose`
- `nix` package manager
  - linux: [🐧 documentation NixOS](https://nixos.org/download/#nix-install-linux)
  - MacOS: [🍎 documentation NixOS](https://nixos.org/download/#nix-install-macos)
- `direnv` (_optionnel_): [Documentation officielle](https://direnv.net/docs/installation.html)

## 2. Installation toolchain

> Pour mettre à jour les dépendances, voir [Mettre à jour la toolchain](docs/developpement/mettre-a-jour-toolchain.md)

#### Avec `nix`

À la racine du projet, lancer:

```bash
nix-shell
```

Vous êtes maintenant dans un shell avec toutes les dépendances nécessaires au développement du projet.

#### Avec `direnv`

À la racine du projet:

```shell
direnv allow
```

Maintenant, vous avez les dépendances de projet **automatiquement chargées** lorsque vous allez sur le projet en question via votre terminal

## 3. Initialisation du fichier de variables d'environnement

Créer un fichier de variables d'environnement, en se basant sur le fichier `.env.template`

## 4. Installation des dépendances du projet

Installer les dépendances Jekyll et Node du projet :

```shell
pnpm bootstrap
```

## 5. Initialisation de la base de données

1. Démarrer le conteneur de base de données :

```shell
docker compose up db -d
```

2. Se connecter au conteneur de la base de données et créer une nouvelle base `msc` pour un utilisateur postgres :

```shell
docker compose exec db createdb -U postgres msc
```

3. Lancer les migrations :

```shell
pnpm migre-bdd
```

4. Dans un nouveau terminal, lancer la création des secrets de hachage :

```shell
pnpm admin:dev

# Créé les secrets de hachage
> await admin.sauvegardeLesEmpreintesDesSecretsDeHachage()

# Sort de la console
> .exit
```

5. Éteindre la stack docker compose :

```shell
docker compose down db
```

## 6. Installation de Prek

Installer le hook de pre-commit du dépôt :

```shell
prek install
```

## 7. Démarrage de l'application en local

```shell
pnpm dev
```

À partir d'ici, le site doit être consultable sur http://127.0.0.1:3000

## 8. Construire l'application

Le build de l'application se fait avec la commande `pnpm build`, tant en local que sur la CI/CD.

```shell
pnpm build
```
