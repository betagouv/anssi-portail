<script lang="ts">
  import type { Component } from 'svelte';
  import { estEnvProduction } from '$plateforme/environnement';
  import type { Mesure } from '../mesure';
  import Procedure from './Procedure.svelte';

  const { mesure }: { mesure: Mesure } = $props();
  const boitesÀOutils = import.meta.glob<{ default: Component } | undefined>('./personnalisee/BoiteAOutils*.svelte');

  const boîtesÀOutilsPersonnaliséesÀNePasAfficher = estEnvProduction ? ['ROLE.3'] : [];

  const chargeBoiteÀOutilsPersonnalisée = $derived.by(async () => {
    if (boîtesÀOutilsPersonnaliséesÀNePasAfficher.includes(mesure.id)) return;

    return (await boitesÀOutils[`./personnalisee/BoiteAOutils${mesure.id.replaceAll('.', '')}.svelte`]?.())?.default;
  });
</script>

{#await chargeBoiteÀOutilsPersonnalisée}
  Chargement...
{:then BoiteÀOutilsPersonnalisée}
  {#if BoiteÀOutilsPersonnalisée}
    <BoiteÀOutilsPersonnalisée />
  {:else}
    {#each mesure.procédures as procédure, index (index)}
      <Procedure {procédure} />
    {/each}
  {/if}
{/await}
