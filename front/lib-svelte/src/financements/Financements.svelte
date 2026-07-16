<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import DetailsFinancement from './DetailsFinancement.svelte';
  import type { Financement } from './financement';
  import ListeDesFinancements from './ListeDesFinancements.svelte';

  type Props = {
    financementInitial?: Financement;
    financementsInitiaux?: Financement[];
  };

  const { financementInitial, financementsInitiaux }: Props = $props();

  const idFinancement = estServeur ? undefined : Number(new URL(window.location.href).pathname.split('/').pop());
</script>

{#if idFinancement || financementInitial}
  <DetailsFinancement {financementInitial} {idFinancement} />
{:else}
  <ListeDesFinancements {financementsInitiaux} />
{/if}
