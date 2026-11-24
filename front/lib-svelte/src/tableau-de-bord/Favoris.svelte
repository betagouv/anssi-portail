<script lang="ts">
  import { onMount } from 'svelte';
  import CarteItem from '../catalogue/CarteItem.svelte';
  import { chargeGuidesDansLeStore } from '../catalogue/stores/guides/guides.store';
  import { itemsCatalogueEnFavori } from '../catalogue/stores/itemsCatalogueEnFavori';
  import Lien from '../ui/Lien.svelte';
  import { détecteRendu } from '../utils/rendu.svelte';
  import TitreDeSection from './TitreDeSection.svelte';

  onMount(chargeGuidesDansLeStore);

  const rendu = détecteRendu();
  const nombreMaxDeCartesAffichées = $derived({ mobile: 1, tablette: 2, bureau: 3 }[rendu.affichageCourant]);
  const nombreDeCartesAffichées = $derived(Math.min($itemsCatalogueEnFavori.length, nombreMaxDeCartesAffichées));
</script>

{#if nombreDeCartesAffichées > 0}
  <div class="favoris">
    <TitreDeSection libellé="Favoris" icône="heart-line" />

    <div class="cartes">
      {#each { length: nombreDeCartesAffichées }, i}
        <CarteItem item={$itemsCatalogueEnFavori[i]} avecBoutonFavori={true} />
      {/each}
    </div>

    <div class="lien">
      <Lien href="/favoris" libelle="Accéder à tous mes favoris" icone="arrow-right-line" iconeADroite />
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .favoris {
    display: grid;
    grid-template-areas:
      'titre'
      'cartes'
      'lien';

    @include a-partir-de(md) {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        'titre lien'
        'cartes cartes';
    }

    .cartes {
      --nombre-cartes: 1;

      @include a-partir-de(md) {
        --nombre-cartes: 2;
      }

      @include a-partir-de(lg) {
        --nombre-cartes: 3;
      }

      display: grid;
      grid-template-columns: repeat(var(--nombre-cartes), 1fr);
      grid-area: cartes;
      gap: 1.5rem 1rem;

      :global(dsfr-card) {
        min-height: unset;
      }
    }

    .lien {
      grid-area: lien;

      @include a-partir-de(md) {
        margin-bottom: 1.5rem;
        align-self: end;
      }
    }
  }
</style>
