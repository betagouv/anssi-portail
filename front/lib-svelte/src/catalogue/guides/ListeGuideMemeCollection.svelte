<script lang="ts">
  import CarteItem from '../CarteItem.svelte';
  import type { Guide } from '../Guide.types';

  export let guide: Guide;
</script>

<div class="grille-cartes">
  <CarteItem item={guide} />
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive.scss' as *;

  .grille-cartes {
    display: grid;
    grid-template-columns: 1fr;

    @include a-partir-de(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include a-partir-de(md) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
