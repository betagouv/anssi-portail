<script lang="ts">
  import { onMount } from 'svelte';
  import CarteItem from '../CarteItem.svelte';
  import type { Guide } from '../Guide.types';
  import SqueletteCarteGuide from './SqueletteCarteGuide.svelte';

  export let guide: Guide;
  let chargement = false;
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  onMount(async () => {
    try {
      chargement = true;
      await delay(3000);
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
    <SqueletteCarteGuide />
  {:else}
    <CarteItem item={guide} />
    <CarteItem item={guide} />
    <CarteItem item={guide} />
    <CarteItem item={guide} />
  {/if}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive.scss' as *;

  .grille-cartes {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @include a-partir-de(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include a-partir-de(md) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
