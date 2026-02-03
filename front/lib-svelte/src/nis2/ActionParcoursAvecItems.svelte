<script lang="ts">
  import CarteItem from '../catalogue/CarteItem.svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types';

  export let id: string;
  export let fondAlternatif: boolean;
  export let titre: string;
  export let explication: string;
  export let items: ItemCyber[];
</script>

<dsfr-container {id} class="action" class:fond-alternatif={fondAlternatif}>
  <div class="contenu-action">
    <div class="description">
      <h2>{titre}</h2>
      <p class="explication">{explication}</p>
      <img
        class="illustration"
        src="/assets/images/illustration-{id}.svg"
        alt="Illustration {titre}"
      />
    </div>
    <h4>Ressources</h4>
    {#each items as item (item.id)}
      <CarteItem {item}/>
    {/each}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .action {
    padding-top: 48px;
    padding-bottom: 48px;
    scroll-margin-top: 90px; /* Hauteur de la barre de navigation */

    .explication {
      margin: 0;
      font-size: 1.125rem;
      line-height: 1.75rem;
    }

    .illustration {
      margin: 32px 0 40px;
      max-width: 282px;
    }

    .contenu-action {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
      column-gap: 24px;
    }

    .description {
      grid-column: 1 / -1;
      @include a-partir-de(lg) {
        grid-column: 1;
        grid-row: 1 / 100;
        margin-right: 24px;
      }
    }

    h4 {
      grid-column: 1 / -1;
      @include a-partir-de(lg) {
        margin-top: 8px;
        grid-column: 2/-1;
      }
    }

    :global(.carte) {
      width: auto;
      margin-bottom: 24px;
    }

    &.fond-alternatif {
      background: #fff7db;
    }
  }
</style>
