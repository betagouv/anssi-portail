<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    affichageAlternatif?: boolean;
    alternatif: Snippet;
    défaut: Snippet;
  };
  const { affichageAlternatif, alternatif, défaut }: Props = $props();
</script>

{#if affichageAlternatif}
  {@render alternatif()}
{:else}
  {@render défaut()}
{/if}
