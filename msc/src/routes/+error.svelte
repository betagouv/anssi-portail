<script lang="ts">
  import { page } from '$app/state';
  import Page404 from '$msc/ui/404.svelte';
</script>

{#if page.status === 404}
  <Page404 />
{:else}
  <h1>{page.status}</h1>
  <p>{page.error?.message}</p>
{/if}
