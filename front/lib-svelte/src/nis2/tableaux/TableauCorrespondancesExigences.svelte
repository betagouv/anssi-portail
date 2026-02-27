<script lang="ts">
  import {
    type Correspondance,
    type Exigence,
    type ExigenceComparee,
    type Referentiel,
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
  };

  const {
    exigences,
    titreColonneSource,
    titreColonneCible,
    colonneSource,
    colonneCible,
    recupereCorrespondance,
  }: Props = $props();
</script>

<table>
  <thead>
    <tr>
      <th>{titreColonneSource}</th>
      <th>Correspondance</th>
      <th>{titreColonneCible}</th>
      <th>Observations</th>
    </tr>
  </thead>
  <tbody>
    {#each exigences as exigence}
      {@const correpondance = recupereCorrespondance(exigence)}
      <tr>
        {@render colonneSource(exigence)}
        <CelluleNiveauCorrespondance niveau={correpondance.niveau} />
        {@render colonneCible(correpondance.exigences)}
        <td> {correpondance.observations} </td>
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
