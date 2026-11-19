<script lang="ts">
  import type { Component } from 'svelte';
  import { estEnvProduction } from '$plateforme/environnement';
  import type { Mesure } from '../mesure';
  import Procedure from './Procedure.svelte';

  const { mesure }: { mesure: Mesure } = $props();
  const boitesÀOutils = import.meta.glob<{ default: Component } | undefined>('./personnalisee/BoiteAOutils*.svelte');
  const IDS_DE_MESURE_À_MASQUER: Mesure['id'][] = ['MCO_MCS.6'];
  const boîtesÀOutilsPersonnaliséesÀNePasAfficher = estEnvProduction ? IDS_DE_MESURE_À_MASQUER : [];

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
