<script lang="ts">
  import { type Exigence, type ExigenceNis2 } from '../exigence.type';
  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';
  import AucunResultat from './AucunResultat.svelte';
  import CelluleExigenceNis2 from './CelluleExigenceNis2.svelte';

  export let exigences: Exigence[];
  export let chargement: boolean = false;

  const estUneExigenceNis2 = (exigence: Exigence): exigence is ExigenceNis2 =>
    !!(exigence as ExigenceNis2).entitesCible;
</script>

{#if exigences.length > 0 || chargement}
  <table class:chargement>
    <thead>
      <tr>
        <th>Exigence applicable à NIS&nbsp;2</th>
      </tr>
    </thead>
    <tbody>
      {#each exigences as exigence (exigence.reference)}
        <tr>
          {#if estUneExigenceNis2(exigence)}
            <CelluleExigenceNis2 {exigence} />
          {/if}
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
