<script context="module" lang="ts">
  export const clesOnglet = ['votre-organisation', 'comparaison', 'historique'];
  export type CleOnglet = (typeof clesOnglet)[number];
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Onglet from '../ui/Onglet.svelte';
  import ConteneurOnglets from '../ui/ConteneurOnglets.svelte';
  import { profilStore } from '../stores/profil.store';

  export let ongletActif: CleOnglet | undefined;

  const emet = createEventDispatcher<{
    reclicHistorique: null;
  }>();

  const reclicHistorique = () => {
    emet('reclicHistorique');
  };
</script>

{#if $profilStore && ongletActif}
  <section class="section-onglets">
    <div class="contenu-section">
      <ConteneurOnglets>
        <Onglet
          bind:ongletActif
          cetOnglet="votre-organisation"
          labelOnglet="Maturité cyber de votre organisation"
        ></Onglet>
        <Onglet
          bind:ongletActif
          cetOnglet="historique"
          labelOnglet="Historique"
          on:click={reclicHistorique}
        ></Onglet>
        <Onglet
          bind:ongletActif
          cetOnglet="comparaison"
          labelOnglet="Comparaison avec d’autres entités"
        ></Onglet>
      </ConteneurOnglets>
    </div>
  </section>
{/if}

<style lang="scss">
  .section-onglets {
    padding: 32px var(--gouttiere) 0;
  }
</style>
