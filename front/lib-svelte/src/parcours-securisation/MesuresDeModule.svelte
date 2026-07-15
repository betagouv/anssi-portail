<script lang="ts">
  import GrilleCartesMesures from './GrilleCartesMesures.svelte';
  import type { Mesure } from './mesure';

  const { mesures }: { mesures: Mesure[] } = $props();

  const mesuresMisesEnAvant = $derived(mesures.filter((_, index) => index < 4));
  const autresMesures = $derived(mesures.filter((_, index) => index >= 4));
</script>

<dsfr-container class="actions-en-avant">
  <h4>🚀 Lancez-vous avec ces premières actions</h4>
  <GrilleCartesMesures mesures={mesuresMisesEnAvant}></GrilleCartesMesures>
</dsfr-container>

<dsfr-container class="autres-actions">
  <GrilleCartesMesures mesures={autresMesures}></GrilleCartesMesures>
</dsfr-container>

<style lang="scss">
  dsfr-container.actions-en-avant {
    background-color: var(--background-alt-blue-france);
    padding-block: 3rem;

    h4 {
      margin-bottom: 2rem;
    }
  }

  .autres-actions {
    padding-block: 3rem;
  }
</style>
