<script lang="ts">
  import type { Component } from 'svelte';
  import { mailOuvert } from './hameconnage.store';

  const contenusDeRéponse = import.meta.glob<{ default: Component } | undefined>('./reponses-mail/ReponseMail*.svelte');

  const chargeContenuDeRéponse = $derived.by(async () => {
    const id = $mailOuvert?.id.replaceAll('.', '');
    return (await contenusDeRéponse[`./reponses-mail/ReponseMail${id}.svelte`]?.())?.default;
  });

  const bonneRéponse = $derived($mailOuvert?.réponseUtilisateur === 'bonne');
</script>

<div class="reponse-mail">
  <div class="entete">
    <dsfr-badge
      label={bonneRéponse ? 'Bonne réponse' : 'Mauvaise réponse'}
      size="md"
      type="status"
      status={bonneRéponse ? 'success' : 'error'}
    ></dsfr-badge>
    {#if bonneRéponse}
      <dsfr-tag label="+ 1 pt" size="md"></dsfr-tag>
    {/if}
  </div>

  {#await chargeContenuDeRéponse then ContenuDeRéponse}
    {#if ContenuDeRéponse}
      <ContenuDeRéponse />
    {/if}
  {/await}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .reponse-mail {
    background-color: var(--background-default-grey);
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    color: var(--text-default-grey);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    margin-bottom: 1rem;

    @include a-partir-de(lg) {
      margin-bottom: 6rem;
    }

    .entete {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
