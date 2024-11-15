# Site du portail de l'ANSSI

## Architecture
Ce site est construit avec Jekyll.   
Les fichiers générés sont servis par un `nginx`.

## Développement
### Démarrage
> N.B. : Jekyll est construit en Ruby.  
> Nous ne sommes pas développeurs Ruby et nous découvrons son écosystème.  
> Il se peut que les instructions ci-dessous semblent mauvaises à une personne connaissant bien Ruby 🙏 

 - Installer les [pré-requis Jekyll](https://jekyllrb.com/docs/#prerequisites)

 - Installer `bundler`
```shell
$ gem install bundler -V
```

 - Installer les dépendances de ce projet
```shell
$ bundler install
```

 - Exécuter le script `dev.sh` pour lancer la génération du Svelte & Jekyll… tout ça en mode `watch`.
```shell
$ ./dev.sh

# vite v5.4.11 building for production...
# watching for file changes...
# build started...
# transforming (1) index.html      
#     Regenerating: 1 file(s) changed at 2024-11-15 15:41:53
#                   ...done in 0.026235 seconds.
# Generating... 
#                     done in 0.072 seconds.
#  Auto-regeneration: enabled for '<path>/anssi-portail'
# LiveReload address: http://127.0.0.1:35729
#     Server address: http://127.0.0.1:4000
#   Server running... press ctrl-c to stop.
#         LiveReload: Browser connected

```

 - Arrivé ici, le site doit être consultable sur http://127.0.0.1:4000
 - Avec le paramètre `--livereload`, chaque changement au code source doit être visible instantanément dans le navigateur

## Le build et la PROD
On utilise un unique `Dockerfile` pour le build via CI/CD et l'hébergement sur notre PaaS.  
Le `Dockerfile` unique est la solution qui semble la plus simple.