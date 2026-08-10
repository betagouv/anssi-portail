---
name: ajouter-page-publique
description: >-
  Ajoute ou expose une page publique dans anssi-portail et câble les couches
  nécessaires : page Jekyll, route Express et, selon le besoin, composant Svelte,
  entry point Vite client et rendu SSR. Utiliser pour toute création de page,
  nouvelle URL publique, nouvelle route statique ou transformation d'un écran
  existant en page navigable, avec ou sans maquette.
---

# Ajouter une page publique

Créer seulement les couches nécessaires. Une page publique n'implique pas
automatiquement un composant Svelte ni un rendu SSR.

Si demande part d'une maquette Figma, utiliser aussi `integrer-maquette-figma` :
ce skill câble page, autre skill traduit design.

## Choisir architecture

Inspecter pages analogues avant décision.

- **Jekyll seule** : contenu statique sans état ni interaction Svelte.
- **Jekyll + Svelte client** : composant interactif absent du HTML initial.
  Utiliser `mount()` et une entrée Vite client.
- **Jekyll + Svelte hydraté** : contenu Svelte rendu par serveur puis repris par
  client. Utiliser `hydrate()` et enregistrer composant dans builds client et SSR.
- **Route spéciale ou dynamique** : enregistrer gestionnaire Express dédié au
  lieu d'ajouter aveuglément page à `routesStatiques`.

Ne pas confondre entrée client et entrée SSR. `vite.config.ssr.ts` contient
seulement composants rendus par `adaptateurEnrichissement`.

## Workflow

### 1. Cadrer page

Déterminer :

- URL et permalink ;
- titre HTML et layout ;
- contenu statique ou interactif ;
- besoin SEO/rendu serveur ;
- données nécessaires et leur source ;
- route publique statique, connectée ou dynamique.

Demander précision seulement si choix change architecture ou comportement.

### 2. Inspecter références vivantes

Lire fichiers analogues et configuration actuelle. Références utiles :

- page SSR hydratée avec données : `front/collectivites.html`,
  `front/lib-svelte/src/main-collectivites.ts`,
  `front/lib-svelte/src/protection/collectivites/PresentationCollectivites.svelte` ;
- page SSR hydratée sans données : `front/entreprises.html` et fichiers associés ;
- page avec composant client monté : `front/creation-compte.html` et
  `front/lib-svelte/src/main-creation-compte.ts` ;
- routes : `back/src/api/msc.ts` ;
- client : `front/lib-svelte/vite.config.ts` ;
- SSR : `front/lib-svelte/vite.config.ssr.ts`.

Ne pas recopier ancien pattern si code courant montre convention différente.

### 3. Implémenter câblage minimal

Lire [references/cablage-jekyll-svelte.md](references/cablage-jekyll-svelte.md)
quand page utilise Svelte ou nécessite nouvelle route.

Respecter conventions :

- URL, fichier Jekyll et entry point en kebab-case français ;
- composant Svelte en PascalCase français ;
- TypeScript et CSS en français selon conventions dépôt ;
- composant dans dossier métier existant, ou nouveau dossier métier justifié ;
- composant partagé entre plusieurs pages dans `src/ui/`.

### 4. Vérifier

Exécuter validations proportionnées aux fichiers touchés. Minimum pour page
Svelte :

```bash
pnpm --filter @anssi-portail/svelte typecheck
pnpm --filter @anssi-portail/svelte lint
pnpm --filter @anssi-portail/svelte build
git diff --check
```

Ajouter tests ciblés quand logique ou comportement change. Vérifier aussi :

- route répond avec et sans slash final selon normalisation Express ;
- bundle client attendu existe ;
- entrée SSR existe uniquement si `hydrate()` est utilisé ;
- HTML serveur contient contenu attendu pour page hydratée ;
- console navigateur ne contient aucune erreur de montage/hydratation ;
- page reste utilisable aux largeurs mobile et desktop.

Ne pas déléguer validations à utilisateur si environnement permet de les lancer.
