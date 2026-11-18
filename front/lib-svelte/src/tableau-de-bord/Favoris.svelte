<script lang="ts">
  import { Icone } from '@lab-anssi/ui-kit';
  import { onMount } from 'svelte';
  import CarteItem from '../catalogue/CarteItem.svelte';
  import { chargeGuidesDansLeStore } from '../catalogue/stores/guides/guides.store';
  import { itemsCatalogueEnFavori } from '../catalogue/stores/itemsCatalogueEnFavori';
  import Lien from '../ui/Lien.svelte';

  onMount(chargeGuidesDansLeStore);
</script>

<div>
  <h2 class="fr-h4"><span><Icone nom="heart-line" taille="lg" /></span>Favoris</h2>

  {#if $itemsCatalogueEnFavori.length}
    <CarteItem item={$itemsCatalogueEnFavori[0]} avecBoutonFavori={true} />
  {/if}

  <Lien href="/favoris" libelle="Accéder à tous mes favoris" icone="arrow-right-line" iconeADroite />
</div>

<style lang="scss">
  h2 {
    display: flex;
    gap: 0.5rem;

    span {
      color: var(--artwork-minor-blue-france);
    }
  }
</style>
