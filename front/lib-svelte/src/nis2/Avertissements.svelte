<script lang="ts">
  type Props = {
    estBureau: boolean;
  };
  const { estBureau }: Props = $props();
</script>

{#if !estBureau}
  <dsfr-alert type="info" size="sm" hasTitle={false}>
    <p slot="description" class="contenu">
      Cette page n’est pas optimisée pour un affichage mobile.
    </p>
  </dsfr-alert>
{/if}

<style lang="scss">
  dsfr-alert {
    margin-bottom: 1.5rem;
  }
</style>
