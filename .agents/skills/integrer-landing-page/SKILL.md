---
name: integrer-landing-page
description: >-
  Intègre une landing page de MesServicesCyber (anssi-portail) à partir d'une
  maquette Figma, en respectant le pattern du repo : page Jekyll (layout
  `defaut`) + composant Svelte 5 hydraté côté client + entry point TypeScript
  enregistré dans les configs Vite (client et SSR) + styles SCSS scopés. Les
  composants du UI Kit Lab ANSSI (`dsfr-*`, `lab-anssi-*`) sont chargés
  globalement par le layout et utilisables directement dans le markup Svelte.
  À utiliser dès qu'on fournit une URL Figma (node-id) ou qu'on demande de
  créer une nouvelle page publique, d'intégrer un écran, un héros ou une section
  de maquette. Procède section par section, avec validation de l'utilisateur.
---

# Intégrer une landing page (MesServicesCyber / anssi-portail)

Ce skill décrit comment transformer une maquette Figma en page publique navigable
dans ce dépôt : **page statique Jekyll + composant Svelte 5 hydraté côté client**.
Les web components du UI Kit (`dsfr-*`, `lab-anssi-*`) sont chargés globalement
par le layout `defaut.html` — il suffit de les écrire dans le markup Svelte.

## Principe : une « page » = 6 pièces câblées

1. **Page Jekyll** `front/<nom-de-la-page>.html` avec front matter YAML
   (`layout: defaut`, `permalink`, `titreHtml`)
2. **Entry point TypeScript** `front/lib-svelte/src/main-<nom-de-la-page>.ts`
   (importe le composant et appelle `hydrate()` de Svelte)
3. **Composant Svelte** `front/lib-svelte/src/<domaine>/<NomDeLaPage>.svelte`
   (le composant racine de la page)
4. **Enregistrement Vite** : ajouter l'entrée rollup dans `front/lib-svelte/vite.config.ts`
   (build client) **et** dans `front/lib-svelte/vite.config.ssr.ts` (build SSR)
5. **Route Express** : ajouter `'<nom-de-la-page>'` dans la liste `routesStatiques`
   de `back/src/api/msc.ts` — sans cette étape, Jekyll génère la page mais le
   serveur Express ne la sert pas (404)
6. **Styles SCSS** scopés dans le `<style lang="scss">` du composant Svelte
   (ou dans un fichier SCSS dédié si nécessaire)

Références vivantes à suivre plutôt qu'à réinventer :

- `front/collectivites.html` + `front/lib-svelte/src/main-collectivites.ts` +
  `front/lib-svelte/src/protection/collectivites/PresentationCollectivites.svelte`
- `front/entreprises.html` + `front/lib-svelte/src/main-entreprises.ts` +
  `front/lib-svelte/src/protection/entreprises/PresentationEntreprises.svelte`
- `front/associations.html` + `front/lib-svelte/src/main-associations.ts` +
  `front/lib-svelte/src/protection/associations/PresentationAssociations.svelte`

## Conventions de nommage

- URL (permalink) en **kebab-case français** : `/ma-nouvelle-page/`
- Page Jekyll en **kebab-case** : `ma-nouvelle-page.html`
- Entry point en **kebab-case** : `main-ma-nouvelle-page.ts`
- Composant Svelte en **PascalCase français** : `MaNouvellePage.svelte`
- Classes CSS et ids DOM en **kebab-case français** : `.bloc-hero`, `.conteneur-colonnes`
- Propriétés et variables TypeScript en **camelCase français** (accents autorisés) :
  `propriétésFilAriane`, `lienActif`

## Cadence : petit à petit, avec validation

Le chantier se fait **section par section**. Après le scaffolding, intégrer **une
seule section** de la maquette à la fois, montrer le résultat, et attendre la
validation de l'utilisateur avant de passer à la suivante. Ne jamais dérouler
toute la page d'un coup.

## Style de code

- Tout composant `.svelte` commence par un bloc `<script lang="ts">` en haut
  (avant le markup, puis le `<style lang="scss">`).
- Utiliser la syntaxe **Svelte 5** : `$props()`, `$state()`, `{#snippet}`, `{@render}`.
- **Pas de commentaires partout.** Le code doit s'expliquer de lui-même : préférer
  des **noms de variables explicites** et l'**extraction de composants** quand ça
  rend l'intention plus claire, plutôt que d'ajouter un commentaire.
- Réserver les commentaires aux cas où l'intention n'est pas déductible du code
  (ex. provenance d'une valeur exacte reprise de la maquette, contournement non évident).
- **Prettier** : printWidth 120, singleQuote, trailingComma es5.
- Pas d'`!important`, pas de style inline.
- Français partout (noms de variables, classes CSS, commentaires quand il y en a).

## Workflow

### 0. Prérequis

- Une URL Figma pointant sur le node à intégrer
  (`…/design/<fileKey>/…?node-id=<n>-<m>`). Si absente, la demander.

### 1. Cadrer la maquette

- Extraire `fileKey` et `nodeId` de l'URL (`node-id=6172-6974` → nodeId `6172-6974`).
- `get_screenshot` (rendu global) + `get_metadata` (structure : frames, sections,
  tailles). Repérer les sections et leur ordre.
- Pour une section précise : `get_design_context` sur son node.

### 2. Récupérer le design system — en local, pas de réseau

Le manifest des composants est livré avec la dépendance, à la version exacte
utilisée par le site :

```
node_modules/@lab-anssi/ui-kit/dist/ui-kit-components.json
```

Le chemin exact dans le `node_modules` pnpm peut varier ; utiliser :

```bash
find . -path "*/node_modules/@lab-anssi/ui-kit/dist/ui-kit-components.json" | head -1
```

Il liste pour chaque composant son `tagName`, ses `props` (avec le nom de
l'**attribut** HTML à utiliser), ses `events`, ses `slots` et un `example`.

**Règle importante** : ne jamais inventer un tag `dsfr-*` ou `lab-anssi-*` qui
ne figure pas dans ce manifest. Si un élément de la maquette (ex. une icône)
ne correspond à aucun web component listé, utiliser du HTML natif (ex. SVG
inline, `<img>`, ou un composant Svelte existant dans `src/ui/`).
S'en servir pour choisir les bons `dsfr-*` / `lab-anssi-*` et leurs attributs
au lieu de les deviner.

La version du UI Kit chargée côté client est lue dynamiquement depuis le
`package.json` par le plugin Jekyll `front/_plugins/package_json.rb` et injectée
dans le layout via `site.version_lab_ui_kit`.

### 3. Scaffolder la page

**a. Page Jekyll** — `front/ma-nouvelle-page.html` :

```html
---
layout: defaut
permalink: /ma-nouvelle-page/
titreHtml: 'Titre de la page | MesServicesCyber'
---

{% include composant-svelte.html id="ma-nouvelle-page" %}
```

Si la page a besoin des données du catalogue (items cyber), ajouter aussi :

```html
{% include script-donnees-json.html %}
```

**b. Entry point TypeScript** — `front/lib-svelte/src/main-ma-nouvelle-page.ts` :

```typescript
import { hydrate } from 'svelte';
import Page from './<domaine>/MaNouvellePage.svelte';

hydrate(Page, {
  target: document.getElementById('ma-nouvelle-page')!,
});
```

Si le composant a besoin de données injectées par Jekyll (ex. `itemsCyber`),
les lire depuis le script JSON injecté dans le DOM :

```typescript
import { hydrate } from 'svelte';
import type { ItemCyber } from './catalogue/Catalogue.types';
import Page from './<domaine>/MaNouvellePage.svelte';

const donnees = document.getElementById('donnees-items-cyber')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
};

hydrate(Page, {
  target: document.getElementById('ma-nouvelle-page')!,
  props: { itemsCyber },
});
```

**c. Composant Svelte** — `front/lib-svelte/src/<domaine>/MaNouvellePage.svelte` :

Organiser dans un sous-dossier thématique sous `src/` (ex. `protection/`,
`catalogue/`, ou un nouveau dossier si le domaine est inédit).

```svelte
<script lang="ts">
  import Heros from '../ui/Heros.svelte';
  // ou HerosRiche pour la variante avec fond coloré
  import HerosRiche from '../ui/HerosRiche.svelte';
</script>

<HerosRiche titre="Titre principal" description="Description du héros." variante="bleu-clair">
  {#snippet illustration()}
    <img src="/assets/images/mon-illustration.svg" alt="" />
  {/snippet}
</HerosRiche>

<!-- Sections suivantes -->

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  /* styles scopés */
</style>
```

Composants héros disponibles :

- `Heros.svelte` : format `banniere` | `heros` | `heros-centre` | `details`,
  theme `sombre` | `clair`, avec fil d'Ariane, tags, actions, illustration.
- `HerosRiche.svelte` : variante `bleu-clair` | `vert-clair` | `cafe-creme`,
  avec fil d'Ariane, badges, actions, illustration (snippet).

Si le feature flag `FEATURE_FLAG_NOUVELLE_DA` est actif, utiliser le composant
`Alternatives` pour proposer les deux variantes (ancienne DA / nouvelle DA).
Se référer à `PresentationCollectivites.svelte` pour le pattern exact.

**d. Enregistrement dans les configs Vite** :

Dans `front/lib-svelte/vite.config.ts` (build client), ajouter dans
`rollupOptions.input` :

```typescript
'ma-nouvelle-page': 'src/main-ma-nouvelle-page.ts',
```

Dans `front/lib-svelte/vite.config.ssr.ts` (build SSR), ajouter dans
`rollupOptions.input` :

```typescript
'ma-nouvelle-page': 'src/<domaine>/MaNouvellePage.svelte',
```

**e. Route Express** — dans `back/src/api/msc.ts`, ajouter le nom de la page
dans le tableau `routesStatiques` :

```typescript
'ma-nouvelle-page',
```

Ce tableau alimente `enregistreRoute()` qui mappe l'URL `/<nom>` vers la page
Jekyll correspondante. Sans cette ligne, la page est générée par Jekyll mais
le serveur répond 404.

### 4. Intégrer section par section

Pour chaque section, dans l'ordre de la maquette :

1. `get_design_context` du node de la section,
2. construire le markup Svelte avec les composants du design system
   (`dsfr-container`, `dsfr-button`, `dsfr-accordion`, `dsfr-card`,
   `lab-anssi-bandeau-page`, `lab-anssi-carrousel-tuiles`, etc.),
3. certains composants du design system ont leur code disponible dans la section "Code Connect" de Figma (ex. `dsfr-tile`, `dsfr-button`) — copier-coller le code HTML et l'adapter si nécessaire,
4. styler dans le `<style lang="scss">` du composant (utiliser les mixins
   `a-partir-de()` de `responsive.scss` et la fonction `taille-pour-colonnes()`
   de `grille.scss`),
5. **montrer / faire valider** avant de continuer.

Si un fragment se répète dans la page, en faire un composant Svelte local dans le
même dossier. S'il sert à plusieurs pages, le déplacer dans `src/ui/`.

### Tokens CSS et design system disponibles

**Règle importante** : ne jamais mettre de couleur en dur (hex, rgb…) dans le
CSS si une variable CSS DSFR correspondante existe. Consulter le fichier de
variables à l'URL :

```
https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/[version]/dsfr-variables.css
```

où `[version]` est la version du UI Kit installée (visible dans
`front/lib-svelte/package.json` sous `@lab-anssi/ui-kit`). Utiliser une
couleur hex en dur **uniquement** si aucune variable de ce fichier ne
correspond à la valeur souhaitée.

Variables DSFR (exemples) :

- `--background-flat-blue-france-lab`, `--background-active-blue-france`
- `--text-title-grey`, `--text-inverted-grey`, `--text-default-grey`
- `--border-default-grey`, `--border-action-high-blue-france`
- `--blue-france-925-125`, `--yellow-moutarde-925-125`
- `--background-contrast-green-bourgeon`, `--background-alt-brown-cafe-creme`

Variables MSC custom (`front/assets/styles/site.scss`) :

- `--noir: #0d0c21`
- `--jaune-msc: #fed980`
- `--jaune-clair-msc: #fff7db`
- `--bouton-arrondi: 8px`
- `--fonts: Marianne, Arial, sans-serif`

Breakpoints (`front/assets/styles/responsive.scss`) :

- `xs: 320px`, `sm: 576px`, `md: 767px`, `lg: 992px`, `xl: 1280px`, `xxl: 1440px`

Classes typographiques DSFR (via `front/assets/styles/dsfr.scss`) :

- `.alternatif-xs`, `.alternatif-md`, `.texte-chapo-xl`, `.fr-h1`, `.fr-h2`, etc.

### 5. Assets (images)

- Télécharger les visuels depuis Figma (`download_assets` ou l'URL renvoyée par
  `get_design_context`).
- Avant d'enregistrer, **demander à l'utilisateur le nom de fichier et le
  répertoire**. Proposer par défaut `front/assets/images/` (il choisit le
  sous-dossier et le nom de fichier).
- Référencer l'asset en `/assets/images/…` dans le markup Svelte.
- Formats à privilégier : **SVG** pour les illustrations, **AVIF** pour les photos.
- Nommage : kebab-case français (ex. `personne-avec-laptop-entoure-de-diagrammes.svg`).

**Illustrations complexes (compositions UI, mockups)** : les outils Figma MCP
(`download_assets`, `get_screenshot`) n'acceptent que des node IDs de premier
niveau (`\d+:\d+`). Les calques imbriqués dans des instances de composants
(slots, media) ont des IDs composés (`I<instance>;<child>`) qui ne sont pas
ciblables directement. Plutôt que de tenter un recadrage approximatif,
**demander à l'utilisateur d'exporter ces illustrations depuis Figma** et de
les fournir comme fichiers. Utiliser un placeholder en attendant.

### 6. Vérification

Proposer les commandes de vérification et **laisser l'utilisateur les lancer** — il
communique le résultat :

```bash
# Build des composants Svelte (client + SSR)
pnpm --filter @anssi-portail/svelte build

# Lint et format
pnpm lint
pnpm format

# Tests
pnpm test

# Lancer le serveur de dev pour visualiser
pnpm dev
```

Le `pnpm dev` démarre simultanément : le backend Express, Jekyll en watch mode,
et le serveur Vite sur le port 3001 (hot reload des composants Svelte).
