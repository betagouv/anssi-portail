<script lang="ts">
  import type { Snippet } from 'svelte';

  type Mode = 'STANDARD' | 'LARGE';
  type Props = {
    mode?: Mode;
    children: Snippet;
  };
  const { mode = 'STANDARD', children }: Props = $props();
</script>

<dsfr-container fluid={mode === 'LARGE'}>
  <div class="marges" class:large={mode === 'LARGE'}>
    {@render children()}
  </div>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 72px;
  }

  .large {
    padding: 24px 24px 72px;
  }
</style>
