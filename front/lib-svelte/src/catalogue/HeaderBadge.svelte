<script lang="ts">
  import BadgesDeCollections from './guides/BadgesDeCollections.svelte';
  import type { ItemCyber } from './Catalogue.types';
  import type { Guide } from './Guide.types';

  export let item: ItemCyber | Guide;
  export let libelleBadge: 'Outil' | 'Service' | 'Contenu' | undefined;

  const couleurlibelle = {
    Outil: 'pink-tuile',
    Contenu: 'blue-ecume',
    Service: 'yellow-tournesol',
  };

  const couleur = libelleBadge ? couleurlibelle[libelleBadge] : '';
</script>

{#if item.type === 'Guide'}
  <BadgesDeCollections guide={item as Guide} />
{:else}
  <dsfr-badge label={libelleBadge} size="sm" type="accent" accent={couleur}></dsfr-badge>
{/if}
