<script lang="ts">
  import DetailsFinancement from './DetailsFinancement.svelte';
  import type { Financement } from './financement';
  import ListeDesFinancements from './ListeDesFinancements.svelte';

  type Props = {
    financementInitial?: Financement;
    idFinancement?: number;
    financementsInitiaux?: Financement[];
  };

  const { financementInitial, financementsInitiaux, idFinancement }: Props = $props();
</script>

{#if idFinancement || financementInitial}
  <DetailsFinancement {financementInitial} {idFinancement} />
{:else}
  <ListeDesFinancements {financementsInitiaux} />
{/if}
