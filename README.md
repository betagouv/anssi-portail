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

 - Installer les dépendances de ce projet
```shell
$ cd front
$ bundler install
```

 - Créer un fichier de variables d'environnement pour le backend, en se basant sur le fichier `back/.env.template`

 - Revenir à la racine, installer les dépendances Node et lancer le projet en mode "dev"
```shell
$ cd ..
$ npm run installe-tout
$ npm run dev
```

 - Arrivé ici, le site doit être consultable sur http://127.0.0.1:3000

## Le build et la PROD
On utilise un unique `Dockerfile` pour le build via CI/CD et l'hébergement sur notre PaaS.  
Le `Dockerfile` unique est la solution qui semble la plus simple.