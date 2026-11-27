<script lang="ts">
  import Badge from '../../ui/Badge.svelte';
  import { type ExigenceISO } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  interface Props {
    exigence: ExigenceISO;
  }

  let { exigence }: Props = $props();

  const accent = $derived(exigence.norme === 'ISO 27001' ? 'purple-glycine' : 'blue-cumulus');
</script>

<Badge libellé={`ISO ${exigence.reference}`} {accent} />
{#if exigence.chapitre}
  <p class="texte-detail-sm gras">{exigence.chapitre}</p>
{/if}
<ContenuExigenceFormate {exigence} />

<style lang="scss">
  .gras {
    font-weight: bold;
  }
</style>
