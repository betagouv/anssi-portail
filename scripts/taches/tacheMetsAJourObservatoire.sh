#!/bin/bash -l

# Ce script est lancé par le crontab dédié à Clever Cloud.
# L'option `-l` permet au process node d'avoir accès aux variables d'environnement :
# https://www.clever.cloud/developers/doc/manage/cron/

# On ne veut exécuter la tâche qu'une seule fois, même si l'application a plusieurs instances.
if [[ "$INSTANCE_NUMBER" != "0" ]]; then
  echo "L'instance n'est pas la 0, c'est la ${INSTANCE_NUMBER}. On s'arrête là."
  exit 0
fi

cd "${APP_HOME}" || exit 1
pnpm observatoire
