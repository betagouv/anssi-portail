#######################
## Dockerfile multi-staged, pour être utilisé à la fois par la CI/CD et par le PaaS de PROD.
## En CI/CD on veut simplement déclencher le `build` pour vérifier la validité du code
## Sur le PaaS, on veut aller jusqu'à démarrer un serveur web pour servir le site statique.
##


####
## BUILD du front
###
FROM ruby:3.3.5-alpine3.20 AS build-le-site

ENV SETUPDIR=/setup
WORKDIR ${SETUPDIR}
ARG GEMFILE_DIR=front
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

ADD front /srv/jekyll

# Build du catalogue
WORKDIR /srv/jekyll/lib-svelte
RUN npm install && npm run build

# Build du site
WORKDIR /srv/jekyll
RUN set -eux; bundler exec jekyll build

####
## BUILD du back
####
FROM node:23 AS build-le-back
RUN npm install -g npm
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
ADD back/src /usr/src/app/src
RUN npm install
WORKDIR /usr/src/app/src
RUN npx tsc

####
## SERVEUR
####
FROM node:23-alpine
EXPOSE 3000
WORKDIR /usr/src/app
COPY --from=build-le-back /usr/src/app/package.json /usr/src/app/
COPY --from=build-le-back /usr/src/app/node_modules/ /usr/src/app/node_modules/
COPY --from=build-le-site /srv/jekyll/_site/ /usr/src/app/front/_site/
COPY --from=build-le-back /usr/src/app/dist-back/ /usr/src/app/dist-back/
CMD ["npm", "start"]
