<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    titre: string;
    children: Snippet;
  };

  const { titre, children }: Props = $props();
</script>

<div class="carte-contact">
  <h3>{titre}</h3>
  {@render children()}
</div>

<style lang="scss">
  .carte-contact {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--border-default-grey);
    border-radius: 8px;
    box-sizing: border-box;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
</style>
