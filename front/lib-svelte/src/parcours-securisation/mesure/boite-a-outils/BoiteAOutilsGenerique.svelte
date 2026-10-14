<script lang="ts">
  import type { Mesure } from '../../mesure.ts';
  import Procedure from './Procedure.svelte';

  const { mesure }: { mesure: Mesure } = $props();
</script>

{#each mesure.procédures as procédure, index (index)}
  <Procedure {procédure} />
{/each}
