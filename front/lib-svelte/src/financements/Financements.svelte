<script lang="ts">
  import DetailsFinancement from './DetailsFinancement.svelte';
  import ListeDesFinancements from './ListeDesFinancements.svelte';

  const idFinancement = Number(new URL(window.location.href).pathname.split('/').pop());
</script>

{#if idFinancement}
  <DetailsFinancement />
{:else}
  <ListeDesFinancements />
{/if}
