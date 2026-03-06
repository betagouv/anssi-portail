<script lang="ts">
  import type {
    Correspondance,
    ReferentielSelectionne,
  } from '../exigence.type';
  import { rechercheParCorrespondance } from '../stores/rechercheParCorrespondance';

  type Props = {
    estBureau: boolean;
    cible: ReferentielSelectionne | undefined;
  };

  const { cible, estBureau }: Props = $props();

  const optionsCorrespondances = [
    { value: 'NA', label: 'Non Applicable' },
    { value: 'faible', label: 'Faible / Nulle' },
    { value: 'moyen', label: 'Moyenne' },
    { value: 'élevé', label: 'Élevée' },
  ] satisfies { value: Correspondance['niveau']; label: string }[];
</script>

<div class="panneau-filtres" class:bureau={estBureau}>
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
    display: flex;
    flex-direction: column;
    gap: 16px;

    &.bureau {
      display: grid;
      gap: 24px;
      grid-template-rows: repeat(1, fit-content(100%));
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
