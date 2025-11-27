<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import CarteItem from '../CarteItem.svelte';
  import type { Guide } from '../Guide.types';
  import { guidePourCarteItem } from './guide';
  import SqueletteCarteGuide from './SqueletteCarteGuide.svelte';

  export let guide: Guide;
  let chargement = false;
  let guideDeMemesCollections: Guide[] = [];
  onMount(async () => {
    try {
      chargement = true;
      const reponse = await axios.get<Guide[]>(
        `/api${guide.id}/memes-collections`
      );
      guideDeMemesCollections = reponse.data.map(guidePourCarteItem);
    } finally {
      chargement = false;
    }
  });
</script>

<div class="grille-cartes">
  {#if chargement}
    <SqueletteCarteGuide />
    <SqueletteCarteGuide />
    <SqueletteCarteGuide />
  {:else}
    {#each guideDeMemesCollections as guide (guide.id)}
      <CarteItem item={guide} />
    {/each}
  {/if}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive.scss' as *;

  .grille-cartes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
    gap: 24px;
  }
</style>
