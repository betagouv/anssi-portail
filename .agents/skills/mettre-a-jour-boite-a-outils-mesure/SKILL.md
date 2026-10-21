---
name: mettre-a-jour-boite-a-outils-mesure
description: >-
  Personnalise ou met à jour la boîte à outils d’une mesure du parcours de
  sécurisation dans anssi-portail : étapes, liens, téléchargements XLSX ou ICS,
  routes API, suivi des téléchargements et tests. Utiliser lorsqu’une mesure
  doit recevoir une procédure personnalisée ou de nouveaux outils associés.
---

# Mettre à jour la boîte à outils d’une mesure

Recueillir le contenu et les contrats d’intégration avant toute modification.
Ne pas inventer une URL, un fichier, un contenu métier ni une règle calendrier.

## Cadrer la demande

Inspecter d’abord l’état du dépôt, la mesure concernée et les implémentations
analogues. Le code courant reste la source de vérité. Tenir compte notamment de
l’organisation des modèles XLSX dans un dossier par outil.

À partir des informations déjà données, poser seulement les questions encore
sans réponse. Regrouper les questions en un message court et numéroté. Attendre
les réponses nécessaires avant d’écrire le code.

Questions communes :

1. Quel est l’identifiant exact de la mesure, par exemple `COMPTE.4`, et quel
   titre doit apparaître en tête de la boîte à outils ?
2. Quelles sont les étapes, dans l’ordre ? Pour chacune, demander le titre
   éventuel, le texte, les listes ou liens, puis l’emplacement de chaque outil.
3. Pour chaque outil, s’agit-il d’un outil déjà présent, d’un lien, d’un XLSX,
   d’un ICS ou d’un autre format ? Demander son titre affiché et son rôle.

Pour chaque lien, demander :

- l’URL exacte et si elle est interne ou externe ;
- le texte, la description, le badge et l’illustration attendus ;
- si la destination doit s’ouvrir dans un nouvel onglet.

Pour chaque téléchargement, demander :

- le nom de fichier public, le type MIME, la taille affichée et l’identifiant
  utilisé pour le retour utilisateur ;
- l’URL publique exacte. À défaut, proposer `/api/outils/<nom-de-fichier>` et
  demander confirmation ;
- si la route exige une session connectée ;
- la provenance du contenu : fichier fourni, fichier déjà versionné, contenu
  généré, ou API distante.

Pour un XLSX, demander aussi le fichier source et toutes les transformations
attendues : date, nom de feuille, données utilisateur ou données externes.

Pour un ICS, demander aussi le titre, la description, la date initiale, le
fuseau, le caractère journée entière ou horaire, la récurrence, les alarmes et
les liens inclus dans l’évènement.

Si le serveur doit récupérer l’outil auprès d’une API distante, demander :

- URL et méthode HTTP exactes ;
- paramètres, corps et en-têtes nécessaires ;
- mécanisme d’authentification et nom de la variable d’environnement, jamais le
  secret lui-même ;
- format de réponse, nom de fichier et type MIME attendus ;
- comportement en cas d’erreur, délai maximal et besoin éventuel de cache ;
- choix entre appel direct du navigateur et proxy backend authentifié.

## Implémenter la boîte personnalisée

Créer ou modifier :

`front/lib-svelte/src/parcours-securisation/mesures/boite-a-outils/personnalisee/BoiteAOutils<ID_SANS_POINT>.svelte`

Le chargement est automatique via `import.meta.glob` dans `BoiteAOutils.svelte`.
Ne pas ajouter de registre manuel si ce contrat reste inchangé.

Réutiliser `EtapeProcedure.svelte`, `EtapesProcedure.svelte` et les composants
existants. Conserver le balisage sémantique, les diacritiques françaises et les
styles locaux nécessaires. Ne pas recopier un composant d’outil déjà adapté.

Pour un nouvel outil visuel, créer un composant ciblé sous
`personnalisee/outils/`. Réutiliser :

- `patrons/OutilLien.svelte` pour une carte pointant vers une URL ;
- `patrons/OutilTelechargement.svelte` pour un XLSX ou un ICS téléchargé.

Ajouter l’illustration dans le chemin déjà attendu par `OutilLien` seulement si
elle est fournie ou explicitement demandée. Ne pas fabriquer d’asset manquant.

## Câbler un téléchargement backend

Ne créer que les couches requises par le contrat demandé.

Pour un outil téléchargé via `/api/outils` :

1. ajouter l’identifiant dans `back/src/metier/outils/outils.ts` ;
2. créer la ressource Express et l’enregistrer dans
   `back/src/api/msc/routes/API/outils.ts` ;
3. appliquer le contrat d’authentification demandé ;
4. servir le type MIME et le `Content-Disposition` exacts ;
5. publier `OutilTéléchargé` après envoi réussi quand le téléchargement est
   associé à un utilisateur ;
6. mettre à jour les faux partagés par les tests.

Pour un XLSX transformé, ranger le modèle, la ressource et le service dans
`back/src/api/outils/<nomOutil>/`. Câbler le fournisseur de chemin,
`ConfigurationServeur`, `serveur.ts` et `back/tests/api/fauxObjets.ts`. Réutiliser
`ServiceÉditionXLSX` au lieu de manipuler directement le classeur si ses
opérations couvrent le besoin.

Pour un ICS généré, utiliser `adaptateurHorloge` et la bibliothèque `ics` déjà
présente. Ne pas lire l’heure système directement. Générer le contenu demandé
dans la ressource ou extraire un service seulement si la logique le justifie.

Pour une API distante, isoler l’accès derrière l’adaptateur ou le service
approprié. Ne jamais exposer un secret au client ni écrire une valeur secrète
dans le dépôt.

## Tester

Tout nouveau téléchargement doit avoir un test de ressource couvrant au moins :

- statut réussi ;
- `Content-Type` et `Content-Disposition` ;
- contenu valide ou structure minimale attendue ;
- refus sans session si la route est authentifiée ;
- appel du service quand il existe ;
- évènement `OutilTéléchargé` avec email et identifiant exacts quand applicable.

Un XLSX transformé doit avoir un test de service qui ouvre réellement le
classeur produit et vérifie chaque transformation métier observable.

Un ICS doit figer l’horloge et vérifier dates, récurrence, alarmes et contenu
utile. Éviter les assertions dépendant d’une date réelle.

Ajouter un test Svelte seulement si une logique ou interaction nouvelle est
introduite et que l’infrastructure de test la couvre. Ne pas créer de snapshot
ou de test qui répète seulement le texte statique. Le typecheck, le lint et le
build couvrent l’intégration statique des composants.

Exécuter les tests backend ciblés, puis :

```bash
pnpm --filter @anssi-portail/back typecheck
pnpm --filter @anssi-portail/back lint
pnpm --filter @anssi-portail/svelte typecheck
pnpm --filter @anssi-portail/svelte lint
pnpm --filter @anssi-portail/svelte build
git diff --check
```

Lancer une validation plus large si une abstraction partagée change. Signaler
précisément toute validation impossible ou interrompue.

Ne pas pousser. Ne créer ou modifier un commit que sur demande explicite.
