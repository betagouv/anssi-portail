<svelte:options
  customElement={{
    tag: 'lab-anssi-mini-test-exposition',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import ExpositionCyberattaques from '@anssi-portail/svelte/src/mini-tests/exposition/ExpositionCyberattaques.svelte';

  const urlBase = import.meta.env.VITE_API_URL;
</script>

<div class="lab-anssi-mini-test-exposition" data-themeable={true}>
  <ExpositionCyberattaques mode="autonome" {urlBase} />
</div>

<style lang="scss">
  .lab-anssi-mini-test-exposition {
    font-family: Marianne, Arial, sans-serif;
    font-size: 1rem;
    font-weight: normal;
  }
</style>
