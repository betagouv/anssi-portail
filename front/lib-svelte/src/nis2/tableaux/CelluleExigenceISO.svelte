<script lang="ts">
  import { type ExigenceISO } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceISO;

  $: accent =
    exigence.norme === 'ISO 27001' ? 'purple-glycine' : 'blue-cumulus';
</script>

<dsfr-badge label={exigence.norme} type="accent" {accent}></dsfr-badge>
{#if exigence.chapitre}
  <p class="texte-detail-sm gras">{exigence.chapitre}</p>
{/if}
<ContenuExigenceFormate {exigence} />

<style lang="scss">
  .gras {
    font-weight: bold;
  }
</style>
