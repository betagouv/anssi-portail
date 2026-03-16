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
  <dsfr-table
    class:chargement
    id="table-nis2"
    caption="Exigences NIS&nbsp;2"
    multiline
    rich
    columns={[
      {
        key: 'exigence',
        label: 'Exigence applicable à NIS 2',
        multiline: true,
      },
    ]}
    rows={exigences}
  >
    {#each exigences as exigence, i (exigence.reference)}
      <div slot={`cell:exigence:${i}`}>
        {#if estUneExigenceNis2(exigence)}
          <CelluleExigenceNis2 {exigence} />
        {/if}
      </div>
    {/each}
  </dsfr-table>
{:else if $exigencesFiltrees.filtresActifs}
  <AucunResultat />
{/if}

<style lang="scss">
  dsfr-table.chargement {
    opacity: 0.25;
  }
</style>
