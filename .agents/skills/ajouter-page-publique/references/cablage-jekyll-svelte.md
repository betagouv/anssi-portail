# Câblage Jekyll, Svelte et Express

## Page Jekyll

Créer `front/<nom>.html` :

```html
---
layout: defaut
permalink: /ma-nouvelle-page/
titreHtml: 'Titre de la page | MesServicesCyber'
---

{% include composant-svelte.html id="ma-nouvelle-page" %}
```

Omettre include Svelte pour page purement statique. Si page utilise catalogue
injecté dans DOM, ajouter :

```html
{% include script-donnees-json.html %}
```

## Rendu client seul

Utiliser `mount()` quand serveur ne pré-rend pas composant :

```typescript
import { mount } from 'svelte';
import Page from './<domaine>/MaNouvellePage.svelte';

mount(Page, {
  target: document.getElementById('ma-nouvelle-page')!,
});
```

Enregistrer seulement entry point dans `front/lib-svelte/vite.config.ts` :

```typescript
'ma-nouvelle-page': 'src/main-ma-nouvelle-page.ts',
```

Référence vivante : `main-creation-compte.ts`.

## Rendu serveur hydraté

Utiliser `hydrate()` quand composant est produit par build SSR et injecté par
backend :

```typescript
import { hydrate } from 'svelte';
import Page from './<domaine>/MaNouvellePage.svelte';

hydrate(Page, {
  target: document.getElementById('ma-nouvelle-page')!,
});
```

Enregistrer même nom logique dans client :

```typescript
'ma-nouvelle-page': 'src/main-ma-nouvelle-page.ts',
```

Et composant racine dans `front/lib-svelte/vite.config.ssr.ts` :

```typescript
'ma-nouvelle-page': 'src/<domaine>/MaNouvellePage.svelte',
```

Plugin `emetComposantsAutorisés` génère liste consommée par
`back/src/infra/enrichissement/adaptateurEnrichissement.ts`. Nom de div Jekyll,
entrée client et entrée SSR doivent donc correspondre.

## Props injectées

Pour données Jekyll présentes dans script JSON :

```typescript
import { hydrate } from 'svelte';
import type { ItemCyber } from './catalogue/Catalogue.types';
import Page from './<domaine>/MaNouvellePage.svelte';

const donnees = document.getElementById('donnees-items-cyber')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données du catalogue');

const { itemsCyber } = JSON.parse(donnees) as { itemsCyber: ItemCyber[] };

hydrate(Page, {
  target: document.getElementById('ma-nouvelle-page')!,
  props: { itemsCyber },
});
```

Si backend injecte props SSR via chargeur, vérifier que mêmes props sont
disponibles côté client lors hydratation. Suivre chargeurs existants plutôt que
créer second canal de données sans nécessité.

## Route Express

Pour page publique statique simple, ajouter nom sans slash à `routesStatiques`
dans `back/src/api/msc.ts` :

```typescript
'ma-nouvelle-page',
```

`enregistreRoute()` mappe `/<nom>` vers page Jekyll et normalise slash final.
Ne pas utiliser cette liste pour :

- page connectée ;
- paramètre dynamique ;
- redirection ;
- réponse produite par gestionnaire spécifique.

Suivre route analogue dans ces cas.

## Nommage

- permalink : `/ma-nouvelle-page/` ;
- page Jekyll : `ma-nouvelle-page.html` ;
- entry point : `main-ma-nouvelle-page.ts` ;
- composant racine : `MaNouvellePage.svelte` ;
- id et clé Vite : `ma-nouvelle-page` ;
- classes CSS : kebab-case français ;
- variables TypeScript : camelCase français.
