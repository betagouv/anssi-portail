<script lang="ts">
  import CarteItem from '../catalogue/CarteItem.svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types.js';
  import type { Guide } from '../catalogue/Guide.types';

  interface Props {
    itemsEnFavori?: (ItemCyber | Guide)[];
    avecBoutonFavori: boolean;
  }

  let { itemsEnFavori = [], avecBoutonFavori }: Props = $props();
</script>

<div class="grille">
  {#each itemsEnFavori as itemCyber (itemCyber.id)}
    <CarteItem item={itemCyber} {avecBoutonFavori} />
  {/each}
</div>

<style>
  .grille {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
    width: 100%;
    box-sizing: border-box;
    gap: 24px;
    align-content: flex-start;
  }
</style>
