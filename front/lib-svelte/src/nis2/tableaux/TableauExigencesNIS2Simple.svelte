<script lang="ts">
  import { type ExigenceNis2 } from '../exigence.type';
  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';
  import AucunResultat from './AucunResultat.svelte';
  import CelluleExigenceNis2 from './CelluleExigenceNis2.svelte';

  export let exigencesNis2: ExigenceNis2[];
  export let chargement: boolean = false;
</script>

{#if exigencesNis2.length > 0 || chargement}
  <table class:chargement>
    <thead>
      <tr>
        <th>Exigence applicable à NIS&nbsp;2</th>
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
{:else if $exigencesFiltrees.filtresActifs}
  <AucunResultat />
{/if}

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
