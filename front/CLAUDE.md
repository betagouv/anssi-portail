# Front — Guide pour Claude Code

## Structure

```
front/
├── *.html              ← Pages Jekyll (templates Liquid)
├── _layouts/           ← Layouts Jekyll
├── _includes/          ← Partials Jekyll réutilisables
├── _data/              ← Données statiques YAML/JSON
├── assets/             ← CSS/SCSS global, images, fonts
└── lib-svelte/         ← Bibliothèque de composants Svelte compilée par Vite
    └── src/
        ├── main-*.ts   ← Points d'entrée Vite (un par fonctionnalité de page)
        ├── catalogue/  ← Composants du catalogue de guides
        ├── favoris/    ← Gestion des favoris
        ├── stores/     ← Svelte stores partagés
        └── ui/         ← Composants UI génériques
```

## Architecture : Svelte islands dans Jekyll

Jekyll génère les pages HTML statiques. Svelte est compilé par Vite en bundles JS qui sont chargés dans les
pages Jekyll pour ajouter de l'interactivité (pattern "islands").

Chaque fonctionnalité a son propre point d'entrée dans `front/lib-svelte/src/main-<nom>.ts`. Ces fichiers sont
référencés dans `front/lib-svelte/vite.config.ts` comme entrées de build distinctes.

## Svelte 5 — syntaxe à utiliser pour les nouveaux composants

```svelte
<script lang="ts">
  // Props avec $props() (Svelte 5)
  let { titre, onValider }: { titre: string; onValider: () => void } = $props();

  // État local réactif avec $state()
  let compteur = $state(0);

  // Valeurs dérivées avec $derived()
  let double = $derived(compteur * 2);
</script>

<!-- Gestionnaires d'événements : attribut HTML, pas directive -->
<button onclick={() => compteur++}>{titre} ({double})</button>
```

**Attention** : certains composants existants utilisent la syntaxe Svelte 4 (`export let`, `on:click`).
Ne pas les migrer sauf demande explicite.

## Appels API

Utiliser `axios` pour les appels vers le backend Express :

```typescript
import axios from 'axios';

// GET
const { data } = await axios.get<MonType[]>('/api/ma-ressource');

// POST
await axios.post('/api/ma-ressource', { monChamp: valeur });

// DELETE avec encodage de l'ID
await axios.delete(`/api/ma-ressource/${encodeURIComponent(id)}`);
```

Toujours encapsuler dans un try/catch pour les erreurs réseau.

## Stores partagés

Les stores globaux sont dans `front/lib-svelte/src/stores/` :

```typescript
import { favorisStore } from '../stores/favoris.store';
import { profilStore } from '../stores/profil.store';

// Dans un template Svelte
$favorisStore; // accès réactif
$profilStore;
```

## SCSS

```svelte
<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .mon-composant {
    padding: 16px;

    @include a-partir-de(md) {
      padding: 24px;
    }
  }
</style>
```

Pas de CSS inline, pas d'attribut `style=""` dans les templates.

## Tests

- Framework : Vitest
- Config : `front/vitest.config.js`
- Répertoire : `front/test/` et `front/lib-svelte/test/`
- Commande : `pnpm test` depuis `front/`

## Ajouter une nouvelle fonctionnalité

1. Créer le composant dans `front/lib-svelte/src/<domaine>/MonComposant.svelte`
2. Créer ou compléter un point d'entrée `front/lib-svelte/src/main-<domaine>.ts`
3. Ajouter l'entrée dans `front/lib-svelte/vite.config.ts` (section `input` de `rollupOptions`)
4. Inclure le bundle généré dans la page Jekyll correspondante

## Jekyll

- Pages : fichiers `.html` avec front matter YAML (`---`)
- Variables d'environnement injectées via le plugin `jekyll-dotenv`
- Ne pas modifier `_config.yml` sans comprendre l'impact sur le build CI/CD
- Build de production : `JEKYLL_ENV=production bundle exec jekyll build`
