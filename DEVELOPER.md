# Développement

Sommaire

1. [installer la toolchain](#1-dépendances-de-développement) ;
2. [initialiser le fichier de variables d'environnement](#2-initialisation-du-fichier-de-variables-denvironnement) ;
3. [construire l'application](#3-construire-lapplication) ;
4. [Initialiser la base de données](#4-initialisation-de-la-base-de-données) ;
5. [installer les dépendances du projet](#5-installation-des-dépendances-du-projet) ;
6. [installer Prek](#6-installation-de-prek) ;
7. [démarrer l'application en local](#7-démarrer-lapplication-en-local) ;

## 1. Dépendances de développement

### Prérequis

- `docker` ou n'importe quel runtime OCI compatible avec `docker-compose`
- `nix` package manager
  - linux: [🐧 documentation NixOS](https://nixos.org/download/#nix-install-linux)
  - MacOS: [🍎 documentation NixOS](https://nixos.org/download/#nix-install-macos)
- `direnv` (_optionnel_): [Documentation officielle](https://direnv.net/docs/installation.html)

### Installation toolchain

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

## 2. Initialisation du fichier de variables d'environnement

Créer un fichier de variables d'environnement, en se basant sur le fichier `.env.template`

## 3. Construire l'application

Le build de l'application se fait avec la commande `pnpm build`, tant en local que sur la CI/CD.

```shell
pnpm build
```

> Les variables d'environnement nécessaires au moment du build doivent être disponibles lors de l'exécution de cette commande.
> Elles sont passées à Jekyll via le plugin [jekyll-dotenv](https://www.rubydoc.info/gems/jekyll-dotenv/0.2.0).

## 4. Initialisation de la base de données

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

## 5. Installation des dépendances du projet

Installer les dépendances Jekyll et Node du projet :

```shell
pnpm bootstrap
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
