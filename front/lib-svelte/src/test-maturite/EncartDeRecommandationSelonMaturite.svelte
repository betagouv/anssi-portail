<script lang="ts">
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';
  import Separateur from '../ui/Separateur.svelte';
  import EncartDeRecommandationMaturiteFaible from './EncartDeRecommandationMaturiteFaible.svelte';
  import EncartDeRecommandationMaturiteForte from './EncartDeRecommandationMaturiteForte.svelte';

  interface Props {
    niveau: NiveauMaturite;
  }

  let { niveau }: Props = $props();

  const niveauFaible = $derived(
    niveau.id === 'insuffisant' || niveau.id === 'emergent' || niveau.id === 'intermediaire'
  );
</script>

<Separateur />
{#if niveauFaible}
  <EncartDeRecommandationMaturiteFaible />
{:else}
  <EncartDeRecommandationMaturiteForte />
{/if}
