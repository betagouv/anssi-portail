<script lang="ts">
  import {
    type Correspondance,
    type Exigence,
    type ExigenceComparee,
  } from '../exigence.type';
  import CelluleNiveauCorrespondance from './CelluleNiveauCorrespondance.svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    titreColonneSource: string;
    titreColonneCible: string;
    recupereCorrespondance: (exigence: Exigence) => Correspondance;
    exigences: Exigence[];
    colonneSource: Snippet<[Exigence]>;
    colonneCible: Snippet<[ExigenceComparee[]]>;
    featureFlagNis2Observations: boolean;
  };

  const {
    exigences,
    titreColonneSource,
    titreColonneCible,
    colonneSource,
    colonneCible,
    recupereCorrespondance,
    featureFlagNis2Observations,
  }: Props = $props();
</script>

<table>
  <thead>
    <tr>
      <th>{titreColonneSource}</th>
      <th>Correspondance</th>
      <th>{titreColonneCible}</th>
      {#if featureFlagNis2Observations}
        <th>Observations</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each exigences as exigence (exigence.reference)}
      {@const correpondance = recupereCorrespondance(exigence)}
      <tr>
        {@render colonneSource(exigence)}
        <CelluleNiveauCorrespondance niveau={correpondance.niveau} />
        {@render colonneCible(correpondance.exigences)}
        {#if featureFlagNis2Observations}
          <td> {correpondance.observations} </td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    margin-bottom: 1.5rem;
    border-collapse: collapse;

    td,
    th {
      padding: 0.5rem 1rem;
      border: 1px solid black;
    }
  }
</style>
