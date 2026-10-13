<script lang="ts">
  import type { Mesure } from '../mesure';
  import BoiteAOutilsCrise8 from './boite-a-outils/BoiteAOutilsCrise8.svelte';
  import Procedure from './Procedure.svelte';

  const { mesure }: { mesure: Mesure } = $props();
</script>

{#if mesure.id === 'CRISE.8'}
  <BoiteAOutilsCrise8 />
{:else}
  {#each mesure.procédures as procédure, index (index)}
    <Procedure {procédure} />
  {/each}
{/if}
