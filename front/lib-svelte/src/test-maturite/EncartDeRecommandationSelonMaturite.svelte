<script lang="ts">
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';
  import { profilStore } from '../stores/profil.store';
  import Alternatives from '../ui/Alternatives.svelte';
  import Separateur from '../ui/Separateur.svelte';
  import EncartDeRecommandationMaturiteFaible from './EncartDeRecommandationMaturiteFaible.svelte';
  import EncartDeRecommandationMaturiteForte from './EncartDeRecommandationMaturiteForte.svelte';
  import MessageNonResponsabilite from './MessageNonResponsabilite.svelte';

  interface Props {
    niveau: NiveauMaturite;
  }

  let { niveau }: Props = $props();

  const niveauFaible = $derived(
    niveau.id === 'insuffisant' || niveau.id === 'emergent' || niveau.id === 'intermediaire'
  );
</script>

<Alternatives affichageAlternatif={afficheParcoursSecurisation}>
  {#snippet défaut()}
    {#if niveauFaible}
      <Separateur />
      <EncartDeRecommandationMaturiteFaible />
      <MessageNonResponsabilite />
    {:else if $profilStore}
      <MessageNonResponsabilite />
    {:else}
      <Separateur />
      <EncartDeRecommandationMaturiteForte />
      <MessageNonResponsabilite />
    {/if}
  {/snippet}
  {#snippet alternatif()}
    <Separateur />
    {#if niveauFaible}
      <EncartDeRecommandationMaturiteFaible />
    {:else}
      <EncartDeRecommandationMaturiteForte />
    {/if}
  {/snippet}
</Alternatives>
