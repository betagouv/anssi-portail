<script lang="ts">
  import { type ExigenceNis2 } from '../exigence.type';
  import CelluleExigenceISO from './CelluleExigenceISO.svelte';
  import CelluleExigenceNis2 from './CelluleExigenceNis2.svelte';

  export let exigencesNis2: ExigenceNis2[];
</script>

<table>
  <thead>
    <tr>
      <th>Exigence NIS&nbsp;2</th>
      <th>Correspondance</th>
      <th>Référence ISO 27001/27002</th>
      <th>Observations</th>
    </tr>
  </thead>
  <tbody>
    {#each exigencesNis2 as exigence (exigence.reference)}
      <tr>
        <td>
          <CelluleExigenceNis2 {exigence} />
        </td>
        <td>
          {exigence.correspondances.ISO.niveau}
        </td>
        <td>
          <CelluleExigenceISO {exigence} />
        </td>
        <td>
          {exigence.correspondances.ISO.observations}
        </td>
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
