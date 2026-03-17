<script lang="ts">
  import {
    type Exigence,
    type ExigenceAE,
    type ExigenceComparee,
    type ExigenceCyFun23,
    type ExigenceISO,
    type ExigenceNis2,
  } from '../exigence.type';
  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';
  import AucunResultat from './AucunResultat.svelte';
  import CelluleExigenceAE from './CelluleExigenceAE.svelte';
  import CelluleExigenceCyFun23 from './CelluleExigenceCyFun23.svelte';
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
    chargement: boolean;
  };

  const { exigences, comparaison, chargement }: Props = $props();

  const titreColonneNIS2 = 'Exigence applicable à NIS 2';
  const configurationTableau: ConfigurationTableauComparaison = {
    COMPARAISON_NIS2_ISO: {
      titreColonneSource: titreColonneNIS2,
      titreColonneCible: 'Référence ISO 2700x',
      colonneSource: colonneSourceNIS2,
      colonneCible: colonneCibleISO,
    },
    COMPARAISON_NIS2_AE: {
      titreColonneSource: titreColonneNIS2,
      titreColonneCible: 'Annexe au Règlement d’exécution 2024/2690',
      colonneSource: colonneSourceNIS2,
      colonneCible: colonneCibleSimple,
    },
    COMPARAISON_ISO_NIS2: {
      titreColonneSource: 'Référence ISO 2700x',
      titreColonneCible: titreColonneNIS2,
      colonneSource: colonneSourceISO,
      colonneCible: colonneCibleSimple,
    },
    COMPARAISON_AE_NIS2: {
      titreColonneSource: 'Annexe au Règlement d’exécution 2024/2690',
      titreColonneCible: titreColonneNIS2,
      colonneSource: colonneSourceAE,
      colonneCible: colonneCibleSimple,
    },
    COMPARAISON_NIS2_CyFun23: {
      titreColonneSource: titreColonneNIS2,
      titreColonneCible: 'CyFun 2023',
      colonneSource: colonneSourceNIS2,
      colonneCible: colonneCibleSimple,
    },
    COMPARAISON_CyFun23_NIS2: {
      titreColonneSource: 'CyFun 2023',
      titreColonneCible: titreColonneNIS2,
      colonneSource: colonneSourceCyFun23,
      colonneCible: colonneCibleSimple,
    },
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

{#snippet colonneSourceCyFun23(exigenceSource: Exigence)}
  {@const exigence = exigenceSource as ExigenceCyFun23}
  <CelluleExigenceCyFun23 {exigence} />
{/snippet}

{#snippet colonneCibleSimple(exigences: ExigenceComparee[])}
  <CelluleSimpleExigencesCibles {exigences} />
{/snippet}

{#snippet colonneCibleISO(exigences: ExigenceComparee[])}
  <CelluleExigencesISOCibles {exigences} />
{/snippet}

{#if exigences.length > 0 || chargement}
  <dsfr-table
    class:chargement
    id="table-nis2"
    multiline
    rich
    columns={[
      {
        key: 'source',
        label: configurationCourante.titreColonneSource,
        multiline: true,
      },
      {
        key: 'niveauCorrespondance',
        label: 'Correspondance',
        multiline: true,
      },
      {
        key: 'cible',
        label: configurationCourante.titreColonneCible,
        multiline: true,
      },
      {
        key: 'observations',
        label: 'Observations',
        multiline: true,
      },
    ]}
    rows={exigences}
  >
    {#each exigences as exigence, i (exigence.reference)}
      <div slot={`cell:source:${i}`}>
        {@render configurationCourante.colonneSource(exigence)}
      </div>
      <div slot={`cell:niveauCorrespondance:${i}`}>
        <CelluleNiveauCorrespondance
          niveau={exigence.correspondance?.niveau ?? 'NA'}
        />
      </div>
      <div slot={`cell:cible:${i}`}>
        {@render configurationCourante.colonneCible(
          exigence.correspondance?.exigences ?? []
        )}
      </div>
      <div slot={`cell:observations:${i}`}>
        <p class="texte-detail-sm">
          {exigence.correspondance?.observations}
        </p>
      </div>
    {/each}
  </dsfr-table>
{:else if $exigencesFiltrees.filtresActifs}
  <AucunResultat />
{/if}
