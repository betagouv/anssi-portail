<script lang="ts">
  import type { Snippet } from 'svelte';

  type Mode = 'STANDARD' | 'LARGE';
  type Props = {
    mode?: Mode;
    children: Snippet;
  };
  const { mode = 'STANDARD', children }: Props = $props();
</script>

{#if mode === 'STANDARD'}
  <dsfr-container>
    {@render children()}
  </dsfr-container>
{:else}
  <div class="conteneur-large">
    {@render children()}
  </div>
{/if}

<style lang="scss">
  dsfr-container {
    padding-bottom: 72px;
  }

  .conteneur-large {
    padding: 24px 24px 72px;
  }
</style>
