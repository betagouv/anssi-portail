<script lang="ts">
  import Badge from '../ui/Badge.svelte';
  import type { CouleurDeBadge } from '../ui/badge.type';
  import type { ItemCyber } from './Catalogue.types';
  import type { Guide } from './Guide.types';
  import BadgesDeCollections from './guides/BadgesDeCollections.svelte';

  interface Props {
    item: ItemCyber | Guide;
    libelleBadge: 'Outil' | 'Service' | 'Contenu' | undefined;
  }

  let { item, libelleBadge }: Props = $props();

  const couleurlibelle: { [k: string]: CouleurDeBadge } = {
    Outil: 'pink-tuile',
    Contenu: 'blue-ecume',
    Service: 'yellow-tournesol',
  };
</script>

{#if item.type === 'Guide'}
  <BadgesDeCollections guide={item as Guide} />
{:else}
  <Badge libellé={libelleBadge!} accent={couleurlibelle[libelleBadge!]} taille="sm" />
{/if}
