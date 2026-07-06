# Site du portail de l'ANSSI

## Architecture

Ce site est construit avec Jekyll.

## Dépendances de développement

### Shell Nix

Ce dépôt fournit un shell Nix, local pour éviter l'installation système de toutes les dépendances (Node, pnpm, Ruby, Bundler, Docker Compose, Prek, etc).
Les dépendances Nix sont épinglées avec [`npins`](https://github.com/andir/npins).

Avec [`direnv`](https://direnv.net/) et [`nix-direnv`](https://github.com/nix-community/nix-direnv) :

```shell
$ direnv allow
```

Sans `direnv`, lancez le shell Nix explicitement :

```shell
$ nix-shell
```

Toutes les dépendances de la section sous-jacente [Installations manuelles](#installations-manuelles) sont maintenant installées et disponibles. Rendez-vous directement à la section [Bootstrap de l'application](#bootstrap-de-lapplication).

Pour mettre à jour les dépendances Nix épinglées :

```shell
$ npins update
```

### Installations manuelles

#### Jekyll

> N.B. : Jekyll est construit en Ruby.
> Nous ne sommes pas développeurs Ruby et nous découvrons son écosystème.
> Il se peut que les instructions ci-dessous semblent mauvaises à une personne connaissant bien Ruby 🙏

##### Ruby

Ruby est installé avec `rbenv`, ce qui permet de sélectionner la version indépendamment de celui proposé par le système d’exploitation, qui peut parfois avoir du retard sur les dernières versions stables.

```shell
sudo apt install -y build-essential libssl-dev libreadline-dev zlib1g-dev libsqlite3-dev libyaml-dev libffi-dev libgdbm-dev libncurses-dev curl git

git clone https://github.com/rbenv/rbenv.git ~/.rbenv

echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
rbenv install 4.0.5
```

##### Bundler

- Installer `bundler`

```shell
$ export GEM_HOME="$HOME/gems/" # Pointer vers un dossier sur lequel vous avez des droits en écriture

# Ne pas installer avec `sudo`
$ gem install bundler -V
```

#### Prek

Prek sert à exécuter des commandes au moment du commit. Ça nous sert en l'occurrence à formater nos fichiers avant de les pousser sur Git.

```
pnpm add -g @j178/prek
OU
npm install -g @j178/prek
```

#### Playwright CLI

Le skill d'agent Playwright utilise le CLI Playwright pour piloter un navigateur, lancer des scénarios et inspecter les pages pendant les sessions d'agent.
Installez-le globalement avec npm avant d'utiliser ce skill :

```shell
npm install -g @playwright/cli@latest
```

## Bootstrap de l'application

### Initialisation du fichier de variables d'environnement

- Créer un fichier de variables d'environnement, en se basant sur le fichier `.env.template`

### Premier démarrage de la base de données

- Démarrer le conteneur de base de données

```shell
$ docker compose up db
```

- Se connecter au conteneur de la base de données et créer une nouvelle base `msc` pour un utilisateur postgres.

```shell
$ docker compose exec db createdb -U postgres msc
```

- Éteindre la stack Docker Compose, puis lancer `pnpm dev` par la suite.

### Installation des dépendances du projet

- Installer les dépendances Jekyll et Node du projet.

```shell
$ bundler install --gemfile=front/Gemfile
$ pnpm install --frozen-lockfile
```

### Installation de Prek

- Installer le hook de pre-commit du dépôt :

```shell
prek install
```

> [!TIP] > `prek install` crée un hook de pre-commit dans le répertoire `$HOME/.git-template`

### Initialisation des clés de hachage

- Lancer la création des secrets de hachage dans un nouveau terminal :

```shell
pnpm admin:dev

> await admin.sauvegardeLesEmpreintesDesSecretsDeHachage()
```

## Démarrer l'application en local

```shell
$ pnpm dev
```

- À partir d'ici, le site doit être consultable sur http://127.0.0.1:3000

## Le build et la PROD

Le build de l'application se fait avec la commande `pnpm build`, tant en local que sur la CI/CD.

```shell
$ pnpm build
```

Les variables d'environnement nécessaires au moment du build doivent être disponibles lors de l'exécution de cette commande.
Elles sont passées à Jekyll via le plugin [jekyll-dotenv](https://www.rubydoc.info/gems/jekyll-dotenv/0.2.0).

## Exploitation

### Re-hachage avec un nouveau sel

Il est possible de hacher avec un nouveau sel nos données hachées en base de données.
Pour cela, on procède en plusieurs étapes :

1. Faire un dump de la base au cas où
2. Redémarrer le portail en mode maintenance (variable d'environnement MODE_MAINTENANCE=true)
3. Assurez-vous que les bases msc et msc-journal soient démarrées
4. Lancer la console d'administration (`pnpm admin`)
5. Exécuter la commande de migration de hache (`> await admin.migreTousLesHaches(2, 'leNouveauSel')`)
   > Où le premier paramètre est la nouvelle version du hache, et le deuxième paramètre est le nouveau sel
6. Ajouter la nouvelle variable d'environnement contenant le nouveau sel (ici, puisque la nouvelle version est la 2, on aura la variable d'env `HACHAGE_SECRET_DE_HACHAGE_2=leNouveauSel`)
7. Redémarrer le portail en désactivant le mode maintenance

### Rotation de clé de chiffrement

Certaines de nos données sont chiffrées, on peut remplacer la clé de chiffrement.
Pour cela, on procède en plusieurs étapes :

1. Faire un dump de la base au cas où
2. Redémarrer le portail en mode maintenance (variable d'environnement MODE_MAINTENANCE=true)
3. Lancer la console d'administration (`pnpm admin`)
4. Exécuter la commande de rotation (`> await admin.remplaceLaCleDeChiffrement('ancienneCle', 'nouvelleCle')`)
5. Modifier la variable d'environnement CHIFFREMENT_CHACHA20_CLE_HEX (`CHIFFREMENT_CHACHA20_CLE_HEX=nouvelleCle`)
6. Redémarrer le portail en désactivant le mode maintenance
