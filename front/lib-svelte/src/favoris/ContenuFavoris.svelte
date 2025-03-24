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
