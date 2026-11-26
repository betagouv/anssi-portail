<svelte:options
  customElement={{
    tag: 'lab-anssi-mini-test-reflexes-cyber',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import ParcoursReflexeCyber from '@anssi-portail/svelte/src/mini-tests/reflexe-cyber/moteur-de-jeu/ParcoursReflexeCyber.svelte';

  const urlBase = import.meta.env.VITE_API_URL;
</script>

<div class="lab-anssi-mini-test-reflexes-cyber" data-themeable="true">
  <ParcoursReflexeCyber {urlBase} mode="autonome" />
</div>
