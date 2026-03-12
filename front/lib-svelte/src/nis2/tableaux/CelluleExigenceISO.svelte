<script lang="ts">
  import { type ExigenceISO } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceISO;

  $: accent =
    exigence.norme === 'ISO 27001' ? 'purple-glycine' : 'blue-cumulus';
</script>

<td>
  <dsfr-badge label={exigence.norme} type="accent" {accent}></dsfr-badge>
  {#if exigence.chapitre}
    <p class="texte-detail-sm gras">{exigence.chapitre}</p>
  {/if}
  <ContenuExigenceFormate {exigence} />
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;

    .gras {
      font-weight: bold;
    }
  }
</style>
