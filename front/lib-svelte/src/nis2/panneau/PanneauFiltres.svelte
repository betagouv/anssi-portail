<script lang="ts">
  import type {
    Correspondance,
    ReferentielSelectionne,
  } from '../exigence.type';
  import { rechercheParCorrespondance } from '../stores/rechercheParCorrespondance';

  export let cible: ReferentielSelectionne | undefined = undefined;

  const optionsCorrespondances = [
    { value: 'NA', label: 'Non Applicable' },
    { value: 'faible', label: 'Faible / Nulle' },
    { value: 'moyen', label: 'Moyenne' },
    { value: 'élevé', label: 'Élevée' },
  ] satisfies { value: Correspondance['niveau']; label: string }[];
</script>

<div class="panneau-filtres">
  {#if cible}
    <dsfr-select
      label="Correspondance"
      placeholder="Sélectionner une option"
      options={optionsCorrespondances}
      value={$rechercheParCorrespondance ?? ''}
      onvaluechanged={(e: CustomEvent) =>
        ($rechercheParCorrespondance = e.detail)}
    ></dsfr-select>
  {/if}
</div>

<style lang="scss">
  .panneau-filtres {
    display: grid;
    gap: 24px;
    grid-template-rows: repeat(1, fit-content(100%));
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
</style>
