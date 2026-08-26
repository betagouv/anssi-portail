<script lang="ts">
  import BadgesDeCollections from './guides/BadgesDeCollections.svelte';
  import type { ItemCyber } from './Catalogue.types';
  import type { Guide } from './Guide.types';

  interface Props {
    item: ItemCyber | Guide;
    libelleBadge: 'Outil' | 'Service' | 'Contenu' | undefined;
  }

  let { item, libelleBadge }: Props = $props();

  const couleurlibelle = {
    Outil: 'pink-tuile',
    Contenu: 'blue-ecume',
    Service: 'yellow-tournesol',
  };

  const couleur = $derived(libelleBadge ? couleurlibelle[libelleBadge] : '');
</script>

{#if item.type === 'Guide'}
  <BadgesDeCollections guide={item as Guide} />
{:else}
  <dsfr-badge label={libelleBadge} size="sm" type="accent" accent={couleur}></dsfr-badge>
{/if}
