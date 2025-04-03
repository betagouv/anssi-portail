<script lang="ts">
  import { type ItemCyber } from './Catalogue.types';
  import ContenuCarteItem from './ContenuCarteItem.svelte';

  export let itemCyber: ItemCyber;
  export let avecBoutonFavori: boolean = false;
</script>

{#if itemCyber.lienInterne || itemCyber.lienExterne}
  <a
    class="carte {itemCyber.typologie}"
    target={itemCyber.lienInterne ? '' : '_blank'}
    href={itemCyber.lienInterne ?? itemCyber.lienExterne}
    class:lien-externe-produit={!itemCyber.lienInterne}
    data-source="Catalogue"
    data-cible={itemCyber.nom}
  >
    <ContenuCarteItem {itemCyber} {avecBoutonFavori} />
  </a>
{:else}
  <div class="carte {itemCyber.typologie}">
    <ContenuCarteItem {itemCyber} {avecBoutonFavori} />
  </div>

{/if}

<style lang="scss">
  .carte.service.lien-externe-produit > * {
    pointer-events: none;
  }
</style>
