<svelte:options
  customElement={{
    tag: 'lab-anssi-mini-test-maturite',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import TestMaturite from '@anssi-portail/svelte/src/test-maturite/TestMaturite.svelte';

  const urlBase = import.meta.env.VITE_API_URL;
</script>

<div class="lab-anssi-mini-test-maturite" data-themeable={true}>
  <TestMaturite mode="autonome" {urlBase} />
</div>

<style lang="scss">
  .lab-anssi-mini-test-maturite {
    font-family: Marianne, Arial, sans-serif;
    font-size: 1rem;
    font-weight: normal;
  }
</style>
