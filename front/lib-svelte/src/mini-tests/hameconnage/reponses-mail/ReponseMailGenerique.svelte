<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    estLégitime?: boolean;
    résumé?: string;
    children: Snippet;
  };

  const { estLégitime = false, résumé, children }: Props = $props();
</script>

<h3 class="fr-h6">
  {estLégitime ? 'Cet email est un mail légitime.' : 'Cet email est bien une tentative de hameçonnage.'}<br />
  Les indices clés à retenir&nbsp;:
</h3>
<ul class="texte-article-lg">
  {@render children()}
</ul>

{#if résumé}
  <dsfr-highlight size="lg" text={résumé}></dsfr-highlight>
{/if}

<style lang="scss">
  h3 {
    margin: 0;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
    padding-inline-start: 1.75rem;
  }
</style>
