#######################
## Dockerfile multi-staged, pour être utilisé à la fois par la CI/CD et par le PaaS de PROD.
## En CI/CD on veut simplement déclencher le `build` pour vérifier la validité du code
## Sur le PaaS, on veut aller jusqu'à démarrer un serveur web pour servir le site statique.
##


####
## BUILD
###
FROM ruby:3.3.5-alpine3.20 AS build-le-site

ENV SETUPDIR=/setup
WORKDIR ${SETUPDIR}
ARG GEMFILE_DIR=.
COPY $GEMFILE_DIR/Gemfile* $GEMFILE_DIR/packages* ./

# Dépendances de build
RUN set -eux; \
    apk add --no-cache --virtual build-deps build-base zlib-dev ;

# Le bundler
RUN set -eux; gem install bundler

# Les packages "extra" s'il y en a
RUN set -eux; \
	if [ -e packages ]; then \
	    cat packages | apk add --no-cache --virtual extra-pkgs; \
    fi

# Les Gems du Gemfile
RUN set -eux; bundler install

# Suppression des dépendances de dev
RUN set -eux; apk del --no-cache build-deps

# Nettoyage
WORKDIR /srv/jekyll
RUN set -eux; \
    rm -rf \
        ${SETUPDIR} \
        /usr/gem/cache \
        /root/.bundle/cache \
    ;

# Installation de node
RUN apk update && apk add nodejs npm

ADD . /srv/jekyll

# Build du catalogue
WORKDIR /srv/jekyll/lib-svelte
RUN npm install && npm run build

# Build du site
WORKDIR /srv/jekyll
RUN set -eux; bundler exec jekyll build

####
## SERVEUR WEB
####
FROM nginx:1.27.2
COPY --from=build-le-site /srv/jekyll/_site /usr/share/nginx/html