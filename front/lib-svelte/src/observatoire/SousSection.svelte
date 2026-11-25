<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    titre: string;
    description: string;
    children: Snippet;
  }

  let { titre, description, children }: Props = $props();
</script>

<h3>{titre}</h3>
<p class="description">{description}</p>
{@render children()}

<style lang="scss">
  h3 {
    color: var(--text-title-grey);
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: bold;
    margin: 1.5rem 0 0.25rem;
  }

  .description {
    color: var(--text-mention-grey);
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin: 0;
  }
</style>
