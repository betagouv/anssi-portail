<script lang="ts">
  import DetailsFinancement from './DetailsFinancement.svelte';
  import ListeDesFinancements from './ListeDesFinancements.svelte';

  const idFinancement = Number(
    new URLSearchParams(window.location.search).get('idFinancement')
  );
</script>

{#if idFinancement}
  <DetailsFinancement />
{:else}
  <ListeDesFinancements />
{/if}
