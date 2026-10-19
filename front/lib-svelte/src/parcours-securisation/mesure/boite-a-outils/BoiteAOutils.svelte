<script lang="ts">
  import type { Component } from 'svelte';
  import type { Mesure } from '../../mesure';
  import BoiteAOutilsGenerique from './BoiteAOutilsGenerique.svelte';

  const { mesure }: { mesure: Mesure } = $props();
  const boitesÀOutils = import.meta.glob<{ default: Component } | undefined>('./personnalisee/BoiteAOutils*.svelte');

  const boiteÀOutils = $derived.by(async () => {
    return (await boitesÀOutils[`./personnalisee/BoiteAOutils${mesure.id.replaceAll('.', '')}.svelte`]?.())?.default;
  });
</script>

{#await boiteÀOutils}
  Chargement...
{:then BoiteAOutils}
  {#if BoiteAOutils}
    <BoiteAOutils />
  {:else}
    <BoiteAOutilsGenerique {mesure} />
  {/if}
{/await}
