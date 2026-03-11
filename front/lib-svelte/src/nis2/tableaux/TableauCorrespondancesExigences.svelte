<script lang="ts">
  import {
    type Exigence,
    type ExigenceAE,
    type ExigenceComparee,
    type ExigenceISO,
    type ExigenceNis2,
  } from '../exigence.type';
  import CelluleExigenceAE from './CelluleExigenceAE.svelte';
  import CelluleExigenceISO from './CelluleExigenceISO.svelte';
  import CelluleExigenceNis2 from './CelluleExigenceNis2.svelte';
  import CelluleExigencesISOCibles from './CelluleExigencesISOCibles.svelte';
  import CelluleNiveauCorrespondance from './CelluleNiveauCorrespondance.svelte';
  import CelluleSimpleExigencesCibles from './CelluleSimpleExigencesCibles.svelte';
  import type {
    Comparaison,
    ConfigurationTableauComparaison,
  } from './configuration.type';

  type Props = {
    comparaison: Comparaison;
    exigences: Exigence[];
    featureFlagNis2Observations: boolean;
    chargement: boolean;
  };

  const {
    exigences,
    comparaison,
    featureFlagNis2Observations,
    chargement,
  }: Props = $props();

  const configurationTableau: ConfigurationTableauComparaison = {
    COMPARAISON_NIS2_ISO: {
      titreColonneSource: 'Exigence NIS 2',
      titreColonneCible: 'Référence ISO 27001/27002',
      colonneSource: colonneSourceNIS2,
      colonneCible: colonneCibleISO,
    },
    COMPARAISON_NIS2_AE: {
      titreColonneSource: 'Exigence NIS 2',
      titreColonneCible: 'AE 2690',
      colonneSource: colonneSourceNIS2,
      colonneCible: colonneCibleSimple,
    },
    COMPARAISON_ISO_NIS2: {
      titreColonneSource: 'Référence ISO 27001/27002',
      titreColonneCible: 'Exigence NIS 2',
      colonneSource: colonneSourceISO,
      colonneCible: colonneCibleSimple,
    },
    COMPARAISON_AE_NIS2: {
      titreColonneSource: 'AE 2690',
      titreColonneCible: 'Exigence NIS 2',
      colonneSource: colonneSourceAE,
      colonneCible: colonneCibleSimple,
    },

    // Combinaisons impossibles
    COMPARAISON_ISO_ISO: undefined,
    COMPARAISON_ISO_AE: undefined,
    COMPARAISON_AE_ISO: undefined,
    COMPARAISON_AE_AE: undefined,
  };

  const configurationCourante = $derived(configurationTableau[comparaison]);
</script>

{#snippet colonneSourceNIS2(exigenceSource: Exigence)}
  {@const exigence = exigenceSource as ExigenceNis2}
  <CelluleExigenceNis2 {exigence} />
{/snippet}

{#snippet colonneSourceISO(exigenceSource: Exigence)}
  {@const exigence = exigenceSource as ExigenceISO}
  <CelluleExigenceISO {exigence} />
{/snippet}

{#snippet colonneSourceAE(exigenceSource: Exigence)}
  {@const exigence = exigenceSource as ExigenceAE}
  <CelluleExigenceAE {exigence} />
{/snippet}

{#snippet colonneCibleSimple(exigences: ExigenceComparee[])}
  <CelluleSimpleExigencesCibles {exigences} />
{/snippet}

{#snippet colonneCibleISO(exigences: ExigenceComparee[])}
  <CelluleExigencesISOCibles {exigences} />
{/snippet}

{#if configurationCourante}
  <table class:chargement>
    <thead>
      <tr>
        <th>{configurationCourante.titreColonneSource}</th>
        <th>Correspondance</th>
        <th>{configurationCourante.titreColonneCible}</th>
        {#if featureFlagNis2Observations}
          <th>Observations</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each exigences as exigence (exigence.reference)}
        <tr>
          {@render configurationCourante.colonneSource(exigence)}
          <CelluleNiveauCorrespondance
            niveau={exigence.correspondance?.niveau ?? 'NA'}
          />
          {@render configurationCourante.colonneCible(
            exigence.correspondance?.exigences ?? []
          )}
          {#if featureFlagNis2Observations}
            <td> {exigence.correspondance?.observations} </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style lang="scss">
  table {
    margin-bottom: 1.5rem;
    border-collapse: collapse;
    width: 100%;

    td,
    th {
      padding: 0.5rem 1rem;
      border: 1px solid black;
    }
  }
</style>
