<script lang="ts">
  import { onMount } from 'svelte';
  import NavigationBureau from './NavigationBureau.svelte';
  import NavigationMobile from './NavigationMobile.svelte';

  let estBureau = false;
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });
</script>

{#if estBureau}
  <NavigationBureau />
{:else}
  <NavigationMobile />
{/if}