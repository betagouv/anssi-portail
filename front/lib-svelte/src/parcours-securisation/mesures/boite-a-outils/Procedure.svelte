<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import Lien from '../../../ui/Lien.svelte';
  import type { Procédure } from '../../mesure';
  import EtapeProcedure from './EtapeProcedure.svelte';
  import EtapesProcedure from './EtapesProcedure.svelte';

  let { procédure }: { procédure: Procédure } = $props();
</script>

<div>
  <h2>{procédure.titre}</h2>
  {#if procédure.description}
    <p class="texte-standard-md">{procédure.description}</p>
  {/if}

  <h5 class="fr-h6">Étapes générales</h5>

  <EtapesProcedure>
    {#each procédure.étapes as étape, index (index)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      <EtapeProcedure>{@html aseptiseHtml(étape)}</EtapeProcedure>
    {/each}
  </EtapesProcedure>

  {#if procédure.note}
    <div class="bloc-note">
      <h5 class="fr-h6 petit-titre">Remarque</h5>
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      <div class="texte-standard-md">{@html aseptiseHtml(procédure.note)}</div>
    </div>
  {/if}

  {#if procédure.lienPourAllerPlusLoin}
    <div class="bloc-pour-aller-plus-loin">
      <h5 class="fr-h6 petit-titre">Pour aller plus loin</h5>
      <Lien href={procédure.lienPourAllerPlusLoin.url} libelle={procédure.lienPourAllerPlusLoin.libelle}></Lien>
    </div>
  {/if}
</div>

<style lang="scss">
  .bloc-note {
    margin-bottom: 1.5rem;
  }

  .bloc-pour-aller-plus-loin {
    margin-bottom: 0.5rem;
  }

  .petit-titre {
    margin-bottom: 1rem;
  }
</style>
