<script lang="ts">
  import type { Component } from 'svelte';
  import type { Mesure } from '../../mesure';
  import BoiteÀOutilsGénérique from './BoiteAOutilsGenerique.svelte';

  const { mesure }: { mesure: Mesure } = $props();
  const boitesÀOutils = import.meta.glob<{ default: Component } | undefined>('./personnalisee/BoiteAOutils*.svelte');

  const chargeBoiteÀOutilsPersonnalisée = $derived.by(async () => {
    return (await boitesÀOutils[`./personnalisee/BoiteAOutils${mesure.id.replaceAll('.', '')}.svelte`]?.())?.default;
  });
</script>

{#await chargeBoiteÀOutilsPersonnalisée}
  Chargement...
{:then BoiteÀOutilsPersonnalisée}
  {#if BoiteÀOutilsPersonnalisée}
    <BoiteÀOutilsPersonnalisée />
  {:else}
    <BoiteÀOutilsGénérique {mesure} />
  {/if}
{/await}
