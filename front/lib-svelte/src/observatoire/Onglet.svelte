<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    titre: string;
    introduction: string;
    children: Snippet;
  }

  let { titre, introduction, children }: Props = $props();
</script>

<section>
  <h2>{titre}</h2>
  <p class="introduction">{introduction}</p>
  {@render children()}
</section>

<style lang="scss">
  section {
    margin-top: 1.5rem;
  }

  h2 {
    color: var(--text-title-grey);
    font-size: 2rem;
    line-height: 2.5rem;
    font-weight: bold;
    margin: 0 0 0.75rem;
  }

  .introduction {
    color: var(--text-mention-grey);
    max-width: 736px;
    margin: 0;
  }
</style>
