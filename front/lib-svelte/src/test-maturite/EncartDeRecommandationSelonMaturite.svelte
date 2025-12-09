<script lang="ts">
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';
  import { profilStore } from '../stores/profil.store';
  import Separateur from '../ui/Separateur.svelte';
  import EncartDeRecommandationMaturiteFaible from './EncartDeRecommandationMaturiteFaible.svelte';
  import EncartDeRecommandationMaturiteForte from './EncartDeRecommandationMaturiteForte.svelte';
  import EncartDeRecommandationVersCatalogue from './EncartDeRecommandationVersCatalogue.svelte';
  import MessageNonResponsabilite from './MessageNonResponsabilite.svelte';

  export let niveau: NiveauMaturite;

  $: niveauFaible =
    niveau.id === 'insuffisant' ||
    niveau.id === 'emergent' ||
    niveau.id === 'intermediaire';
</script>

{#if niveauFaible}
  <Separateur />
  <EncartDeRecommandationMaturiteFaible />
  <MessageNonResponsabilite />
{:else if $profilStore}
  <MessageNonResponsabilite />
  <EncartDeRecommandationVersCatalogue />
{:else}
  <Separateur />
  <EncartDeRecommandationMaturiteForte />
  <MessageNonResponsabilite />
{/if}
