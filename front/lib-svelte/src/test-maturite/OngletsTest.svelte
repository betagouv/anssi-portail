<script lang="ts">
  import Onglet from '../ui/Onglet.svelte';
  import ConteneurOnglets from '../ui/ConteneurOnglets.svelte';
  import { profilStore } from '../stores/profil.store';

  export let ongletActif: 'votre-organisation' | 'comparaison' =
    'votre-organisation';
</script>

{#if $profilStore}
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