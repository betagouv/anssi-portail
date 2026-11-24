<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    titre: string;
    children: Snippet;
  };

  const { titre, children }: Props = $props();
</script>

<div class="carte-contact">
  <p class="texte-article-lg">{titre}</p>
  <div class="informations">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .carte-contact {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid var(--border-default-grey);
    box-sizing: border-box;

    p {
      margin-bottom: 0;
      font-weight: bold;
    }

    .informations {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
