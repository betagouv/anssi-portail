<script lang="ts">
  import type { Mesure } from '../../mesure';
  import BoiteAOutilsCrise8 from './BoiteAOutilsCrise8.svelte';
  import BoiteAOutilsExo1 from './BoiteAOutilsExo1.svelte';
  import Procedure from './Procedure.svelte';

  const { mesure }: { mesure: Mesure } = $props();
</script>

{#if mesure.id === 'CRISE.8'}
  <BoiteAOutilsCrise8 />
{:else if mesure.id === 'EXO.1'}
  <BoiteAOutilsExo1 />
{:else}
  {#each mesure.procédures as procédure, index (index)}
    <Procedure {procédure} />
  {/each}
{/if}
