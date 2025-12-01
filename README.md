# Site du portail de l'ANSSI

## Architecture

Ce site est construit avec Jekyll.

## Développement

### Démarrage

> N.B. : Jekyll est construit en Ruby.  
> Nous ne sommes pas développeurs Ruby et nous découvrons son écosystème.  
> Il se peut que les instructions ci-dessous semblent mauvaises à une personne connaissant bien Ruby 🙏

- Installer les [pré-requis Jekyll](https://jekyllrb.com/docs/#prerequisites) (suivre les pages détaillées de prérequis pour chaque OS)

- Installer `bundler`

```shell
$ gem install bundler -V
```

- Installer les dépendances Jekyll de ce projet

```shell
$ cd front
$ bundler install
```

- Créer un fichier de variables d'environnement, en se basant sur le fichier `.env.template`

- Démarrer le conteneur de base de données

```shell
$ docker compose up db
```

- Se connecter au conteneur de la base de données et créer une nouvelle base `msc` pour un utilisateur postgres.

```shell
$ docker compose exec db createdb -U postgres msc
```

- Revenir à la racine, installer les dépendances Node et lancer le projet en mode "dev"

```shell
$ cd ..
$ npm ci
$ npm run dev
```

- Lancer la création des secrets de hachage avec la console d'administration (procédure sauvegardeLesEmpreintesDesSecretsDeHachage()) puis relancer un :

```shell
$ npm run dev
```

- Arrivé ici, le site doit être consultable sur http://127.0.0.1:3000

## Le build et la PROD

On utilise un unique `Dockerfile` pour le build via CI/CD et l'hébergement sur notre PaaS.  
Le `Dockerfile` unique est la solution qui semble la plus simple.
Certaines variables d'environnement sont nécessaires au moment de la construction du site statique (avec Jekyll).
Pour ce faire, ces variables sont passées via les `--build-arg` par CleverCloud. On peut donc les utiliser dans notre Dockerfile.
Exemple :

```Dockerfile
ARG MA_VARIABLE
RUN echo "MA_VARIABLE=${MA_VARIABLE}" >> .env
```

Ces variables sont passées à Jekyll via le plugin [jekyll-dotenv](https://www.rubydoc.info/gems/jekyll-dotenv/0.2.0)
