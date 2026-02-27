<script lang="ts">
  import { type ExigenceNis2 } from '../exigence.type';
  import CelluleExigenceNis2 from './CelluleExigenceNis2.svelte';

  export let exigencesNis2: ExigenceNis2[];
</script>

<table>
  <thead>
    <tr>
      <th>Exigence NIS&nbsp;2</th>
    </tr>
  </thead>
  <tbody>
    {#each exigencesNis2 as exigence (exigence.reference)}
      <tr>
        <CelluleExigenceNis2 {exigence} />
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    margin-bottom: 1.5rem;
    border-collapse: collapse;

    th {
      padding: 0.5rem 1rem;
      border: 1px solid black;
    }
  }
</style>
