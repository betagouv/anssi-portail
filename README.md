# Site du portail de l'ANSSI

## Architecture
Ce site est construit avec Jekyll. 

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

 - Utiliser la commande `serve` pour builder le site et pouvoir le consulter
```shell
$ bundle exec jekyll serve --livereload

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