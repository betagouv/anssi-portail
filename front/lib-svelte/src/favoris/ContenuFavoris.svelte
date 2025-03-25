<script lang="ts">
  import CarteItem from '../catalogue/CarteItem.svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types.js';

  export let itemsEnFavori: ItemCyber[] = [];
  export let avecBoutonFavori: boolean;
</script>

<div class="grille">
  {#each itemsEnFavori as itemCyber}
    <CarteItem {itemCyber} {avecBoutonFavori} />
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
