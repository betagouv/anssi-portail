<svelte:options
  customElement={{
    tag: 'lab-anssi-mini-test-hameconnage',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import TestHameconnage from '@anssi-portail/svelte/src/mini-tests/hameconnage/TestHameconnage.svelte';

  const urlBase = import.meta.env.VITE_API_URL;
</script>

<div class="lab-anssi-mini-test-hameconnage" data-themeable={true}>
  <TestHameconnage {urlBase} mode="autonome" />
</div>

<style lang="scss">
  .lab-anssi-mini-test-hameconnage {
    font-family: Marianne, Arial, sans-serif;
    font-size: 1rem;
    font-weight: normal;
  }
</style>
