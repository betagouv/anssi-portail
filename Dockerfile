#checkov:skip=CKV_DOCKER_2:Clever Cloud n'utiliser pas HEALTHCHECK
#######################
## Dockerfile multi-staged, pour être utilisé à la fois par la CI/CD et par le PaaS de PROD.
## En CI/CD on veut simplement déclencher le `build` pour vérifier la validité du code
## Sur le PaaS, on veut aller jusqu'à démarrer un serveur web pour servir le site statique.
##

####
## BUILD du svelte
###
FROM docker.io/node:23 AS build-le-svelte

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

COPY package.json pnpm-lock.yaml  pnpm-workspace.yaml ./
COPY front ./front
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @anssi-portail/svelte build

####
## BUILD du front
###
FROM docker.io/ruby:3.3.5-alpine3.20 AS build-le-site

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

COPY front /srv/jekyll

COPY --from=build-le-svelte /usr/src/app/front/lib-svelte/dist /srv/jekyll/lib-svelte/dist

# Build du site
WORKDIR /srv/jekyll
ARG GOOGLE_SEARCH_CONSOLE_VERIFICATION
ARG MATOMO_ID
ARG MATOMO_URL_TAG_MANAGER
ARG SENTRY_DSN
ARG SENTRY_ENVIRONNEMENT
ARG FEATURE_FLAG_FILTRES_COMPARAISON
ARG FEATURE_FLAG_AVIS_UTILISATEUR
ARG FEATURE_FLAG_GUIDES
RUN touch .env
RUN echo "GOOGLE_SEARCH_CONSOLE_VERIFICATION=${GOOGLE_SEARCH_CONSOLE_VERIFICATION}" >> .env
RUN echo "MATOMO_ID=${MATOMO_ID}" >> .env
RUN echo "MATOMO_URL_TAG_MANAGER=${MATOMO_URL_TAG_MANAGER}" >> .env
RUN echo "SENTRY_DSN=${SENTRY_DSN}" >> .env
RUN echo "SENTRY_ENVIRONNEMENT=${SENTRY_ENVIRONNEMENT}" >> .env
RUN echo "FEATURE_FLAG_FILTRES_COMPARAISON=${FEATURE_FLAG_FILTRES_COMPARAISON}" >> .env
RUN echo "FEATURE_FLAG_AVIS_UTILISATEUR=${FEATURE_FLAG_AVIS_UTILISATEUR}" >> .env
RUN echo "FEATURE_FLAG_GUIDES=${FEATURE_FLAG_GUIDES}" >> .env
RUN set -eux; bundler exec jekyll build

####
## BUILD du back
####
FROM docker.io/node:23 AS build-le-back
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
ENV PNPM_HOME=/usr/local/bin

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /usr/src/app/
COPY back/package.json /usr/src/app/back/

RUN pnpm install --frozen-lockfile

COPY back/tsconfig.json back/knexfile.ts /usr/src/app/back/
COPY back/src /usr/src/app/back/src

WORKDIR /usr/src/app/back/src
RUN ../node_modules/.bin/tsc
COPY back/migrations /usr/src/app/dist-back/migrations

####
## SERVEUR
####
FROM docker.io/node:23-alpine
EXPOSE 3000

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
ENV PNPM_HOME=/usr/local/bin

RUN set -eux; \
    apk add --no-cache bash ;
WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY package.json /usr/src/app/
COPY --from=build-le-back /usr/src/app/node_modules/ /usr/src/app/node_modules/
COPY --from=build-le-back /usr/src/app/back/node_modules/ /usr/src/app/dist-back/node_modules/
COPY --from=build-le-site /srv/jekyll/_site/ /usr/src/app/front/_site/
COPY --from=build-le-back /usr/src/app/dist-back/ /usr/src/app/dist-back/
CMD ["pnpm", "start"]
