<script lang="ts">
  let { children } = $props();
</script>

<ol>
  {@render children()}
</ol>

<style lang="scss">
  ol {
    --largeur-numéro: 2.5rem;
    --espacement-numéro: 1rem;
    --largeur-totale: calc(var(--largeur-numéro) + var(--espacement-numéro));

    counter-reset: item;
    list-style: none;
    margin: 0;
    padding: 1rem 0 0;
  }
</style>
