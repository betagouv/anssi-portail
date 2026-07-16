<script lang="ts">
  import CarrouselDesInterlocuteurs from '../interlocuteurs/CarrouselDesInterlocuteurs.svelte';
  import { profilStore } from '../stores/profil.store';
</script>

{#if $profilStore?.parcoursSecurisation.parcoursActuel === 'complet'}
  <dsfr-container>
    <CarrouselDesInterlocuteurs mode="compact" />
  </dsfr-container>
{/if}

<style lang="scss">
  dsfr-container {
    padding-top: 3rem;
    background-color: var(--background-alt-grey);
  }
</style>
