<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import DetailsFinancement from './DetailsFinancement.svelte';
  import ListeDesFinancements from './ListeDesFinancements.svelte';

  const idFinancement = estServeur ? undefined : Number(new URL(window.location.href).pathname.split('/').pop());
</script>

{#if idFinancement}
  <DetailsFinancement />
{:else}
  <ListeDesFinancements />
{/if}
