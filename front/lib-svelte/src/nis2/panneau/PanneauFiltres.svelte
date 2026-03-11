<script lang="ts">
  import type {
    Correspondance,
    Referentiel,
    ReferentielSelectionne,
  } from '../exigence.type';
  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';
  import { rechercheParCorrespondance } from '../stores/rechercheParCorrespondance';
  import { rechercheParEntiteNis2 } from '../stores/rechercheParEntiteNis2';
  import { rechercheParNormeISO } from '../stores/rechercheParNormeISO';
  import { rechercheParObjectifNis2 } from '../stores/rechercheParObjectifNis2';
  import { rechercheParThematiqueNis2 } from '../stores/rechercheParThematiqueNis2';

  type Props = {
    estBureau: boolean;
    source: Referentiel;
    cible: ReferentielSelectionne | undefined;
  };

  const { source, cible, estBureau }: Props = $props();

  const optionsCorrespondances = [
    { value: 'faible', label: 'Faible / Nulle' },
    { value: 'moyen', label: 'Moyenne' },
    { value: 'élevé', label: 'Élevée' },
  ] satisfies { value: Correspondance['niveau']; label: string }[];
</script>

<div class="panneau-filtres" class:bureau={estBureau}>
  {#if source === 'NIS2'}
    <dsfr-select
      label="Type d'entité"
      placeholder="Sélectionner une option"
      options={[
        { value: 'EntiteEssentielle', label: 'Entité essentielle' },
        { value: 'EntiteImportante', label: 'Entité importante' },
      ]}
      value={$rechercheParEntiteNis2 ?? ''}
      onvaluechanged={(e: CustomEvent) => ($rechercheParEntiteNis2 = e.detail)}
    ></dsfr-select>
    <dsfr-select
      label="Objectif de sécurité"
      placeholder="Sélectionner une option"
      options={$exigencesFiltrees.objectifs}
      value={$rechercheParObjectifNis2 ?? ''}
      onvaluechanged={(e: CustomEvent) =>
        ($rechercheParObjectifNis2 = e.detail)}
    ></dsfr-select>
    <dsfr-select
      label="Thématique"
      placeholder="Sélectionner une option"
      options={$exigencesFiltrees.thematiques}
      value={$rechercheParThematiqueNis2 ?? ''}
      onvaluechanged={(e: CustomEvent) =>
        ($rechercheParThematiqueNis2 = e.detail)}
    ></dsfr-select>
  {:else if source === 'ISO'}
    <dsfr-select
      label="Norme ISO"
      placeholder="Sélectionner une option"
      options={$exigencesFiltrees.normesISO}
      value={$rechercheParNormeISO ?? ''}
      onvaluechanged={(e: CustomEvent) => ($rechercheParNormeISO = e.detail)}
    ></dsfr-select>
  {/if}
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
