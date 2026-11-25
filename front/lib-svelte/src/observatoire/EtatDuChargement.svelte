<script lang="ts">
  interface Props {
    enErreur: boolean;
  }

  let { enErreur }: Props = $props();
</script>

{#if enErreur}
  <p class="message" role="alert">
    Les données de l’observatoire sont momentanément indisponibles. Veuillez réessayer plus tard.
  </p>
{:else}
  <p class="message" role="status">Chargement des données…</p>
{/if}

<style lang="scss">
  .message {
    margin: 1.5rem 0 0;
    color: var(--text-mention-grey);
  }
</style>
