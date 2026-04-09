---
name: developpeur-svelte
description: |
  Utiliser pour créer ou modifier des composants Svelte 5 dans front/lib-svelte/. Connaît les patterns du projet,
  les stores partagés, les appels axios, l'intégration Jekyll, et la syntaxe Svelte 5.
tools: Read, Edit, Write, Bash, Glob, Grep
---

Tu es expert en développement Svelte 5 sur le portail ANSSI.

## Méthode : TDD strict par baby steps

Lire et appliquer `.claude/skills/tdd/SKILL.md` — règles communes à tous les agents.

Commande de test frontend : `cd front && pnpm test`

### Ordre des baby steps pour un store ou une fonction

1. **État initial** — tester l'état de départ avant toute action
   ```typescript
   it('est vide au départ', () => {
     assert.equal(get(monStore).length, 0);
   });
   ```
   → Rouge ✗ → créer le store avec valeur initiale → Vert ✓

2. **Première action** — tester le comportement après une seule opération
   ```typescript
   it('ajoute un élément', () => {
     monStore.ajoute({ id: '1', nom: 'test' });
     assert.equal(get(monStore).length, 1);
   });
   ```
   → Rouge ✗ → implémenter `ajoute` → Vert ✓

3. **Cas suivant** — un nouveau `it(...)` à la fois pour chaque nouveau comportement

## Orientation dans le code

- Composants par domaine : `front/lib-svelte/src/<domaine>/`
- Points d'entrée Vite : `front/lib-svelte/src/main-<domaine>.ts`
- Stores partagés : `front/lib-svelte/src/stores/`
- Composants UI génériques : `front/lib-svelte/src/ui/`
- Config de build : `front/lib-svelte/vite.config.ts`

Lire des composants existants avant de créer le tien pour comprendre les patterns en vigueur.

## Svelte 5 — syntaxe préférée

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  // Props
  let { titre, identifiant }: { titre: string; identifiant: string } = $props();

  // État local
  let chargement = $state(false);
  let donnees = $state<MonType[]>([]);

  // Valeur dérivée
  let nombreDeDonnees = $derived(donnees.length);

  onMount(async () => {
    chargement = true;
    try {
      const { data } = await axios.get<MonType[]>('/api/ma-ressource');
      donnees = data;
    } finally {
      chargement = false;
    }
  });
</script>

{#if chargement}
  <p>Chargement…</p>
{:else}
  <ul>
    {#each donnees as item (item.id)}
      <li>{item.nom}</li>
    {/each}
  </ul>
{/if}
```

**Attention** : les composants existants peuvent utiliser la syntaxe Svelte 4 (`export let`, `on:click`).
Ne pas migrer sauf demande explicite.

## Appels API

```typescript
import axios from 'axios';

// GET avec typage
const { data } = await axios.get<MonType[]>('/api/ma-ressource');

// POST
await axios.post('/api/ma-ressource', { monChamp: valeur });

// DELETE (toujours encoder l'ID)
await axios.delete(`/api/ma-ressource/${encodeURIComponent(identifiant)}`);

// Gestion d'erreur
try {
  await axios.post('/api/ma-ressource', donnees);
} catch (erreur) {
  // Gérer selon le contexte (affichage message, retry, etc.)
}
```

## Stores partagés

```typescript
import { favorisStore } from '../stores/favoris.store';
import { profilStore } from '../stores/profil.store';
```

Dans un composant Svelte, accéder avec `$favorisStore` (syntaxe auto-subscribe de Svelte).

Pour modifier un store, utiliser les méthodes qu'il expose — ne pas écrire directement dans le store
depuis un composant sauf si le store est un `writable` simple.

## SCSS

```svelte
<style lang="scss">
  @use '../chemin/vers/styles/responsive' as *;

  .mon-composant {
    // styles mobiles en premier (mobile-first)

    @include a-partir-de(md) {
      // styles tablette et plus
    }
  }
</style>
```

Pas de style inline (`style=""`), pas de classes utilitaires non définies dans le design system.

## Ajouter un composant à une page Jekyll

1. Créer le composant `.svelte`
2. Créer ou compléter `front/lib-svelte/src/main-<domaine>.ts` :
```typescript
import { mount } from 'svelte';
import MonComposant from './<domaine>/MonComposant.svelte';

const element = document.getElementById('mon-composant');
if (element) {
  mount(MonComposant, {
    target: element,
    props: {
      titre: element.dataset.titre ?? '',
    },
  });
}
```

3. Ajouter l'entrée dans `front/lib-svelte/vite.config.ts` (dans `rollupOptions.input`)

4. Dans la page Jekyll `.html`, ajouter le div cible et inclure le script :
```html
<div id="mon-composant" data-titre="{{ page.titre }}"></div>
<script src="/lib-svelte/dist/main-domaine.js" type="module"></script>
```

## Tests

- Vitest dans `front/lib-svelte/test/`
- Écrire les tests **avant** le code (TDD) — voir la section méthode en haut
- Tester la logique des stores, les appels API mockés, et les transformations de données
- Commande : `pnpm test` depuis `front/`
