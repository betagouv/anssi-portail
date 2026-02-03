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
$ export GEM_HOME="$HOME/gems/" # Pointer vers un dossier sur lequel vous avez des droits en écriture

# Ne pas installer avec `sudo`
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
$ pnpm install --frozen-lockfile
$ pnpm dev
```

- Lancer la création des secrets de hachage dans un nouveau terminal :

```shell
pnpm admin:dev

> await admin.sauvegardeLesEmpreintesDesSecretsDeHachage()
```

Ensuite relancer un :

```shell
$ pnpm dev
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

## Exploitation

### Re-hachage avec un nouveau sel

Il est possible de hacher avec un nouveau sel nos données hachées en base de données.
Pour celà, on procède en plusieurs étapes :

1. Faire un dump de la base au cas où
2. Redémarre le portail en mode maintenance (variable d'environnement MODE_MAINTENANCE=true)
3. lancer la console d'administration (`pnpm admin`)
4. exécuter la commande de migration de hache (`> await admin.migreToutLesHaches(2, 'leNouveauSel')`)
   > Où le premier paramètre est la nouvelle version du hache, et le deuxième paramètre est le nouveau
5. Rajouter la nouvelle variable d'environnement contenant le nouveau sel (ici, puisque la nouvelle version est la 2, on aura la variable d'env `HACHAGE_SECRET_DE_HACHAGE_2=leNouveauSel`)
6. Redémarre le portail en désactivant le mode maintenance

### Rotation de clé de chiffrement

Certaines de nos données sont chiffrées, on peut remplacer la clé de chiffrement.
Pour celà, on procède en plusieurs étapes :

1. Faire un dump de la base au cas où
2. Redémarre le portail en mode maintenance (variable d'environnement MODE_MAINTENANCE=true)
3. lancer la console d'administration (`pnpm admin`)
4. exécuter la commande de rotation (`> await admin.remplaceLaCleDeChiffrement('ancienneCle', 'nouvelleCle')`)
5. Modifier la variable d'environnement CHIFFREMENT_CHACHA20_CLE_HEX (`CHIFFREMENT_CHACHA20_CLE_HEX=nouvelleCle`)
6. Redémarre le portail en désactivant le mode maintenance
