<script lang="ts">
  import type { Component } from 'svelte';
  import { mailOuvert } from './hameconnage.store';

  const corpsDeMails = import.meta.glob<{ default: Component } | undefined>('./corps-de-mail/CorpsMail*.svelte');

  const chargeCorpsDeMail = $derived.by(async () => {
    const id = $mailOuvert?.id.replaceAll('.', '');
    return (await corpsDeMails[`./corps-de-mail/CorpsMail${id}.svelte`]?.())?.default;
  });
</script>

<div class="mail">
  <div class="mail-ouvert">
    <div class="entete-mail">
      <h2 class="fr-h6">
        {$mailOuvert?.objet}
      </h2>
      <p class="texte-mention-xs">
        {Intl.DateTimeFormat('fr-FR').format(new Date())}
        {$mailOuvert?.heuresMinutesRéception}
      </p>
      <div class="mail-info">
        <p>de&nbsp;:</p>
        <p><strong>{$mailOuvert?.expediteur.nom}</strong>&nbsp;&lt;{$mailOuvert?.expediteur.mail}&gt;</p>
      </div>
      <div class="mail-info">
        <p>à&nbsp;:</p>
        <p>{$mailOuvert?.destinataire}</p>
      </div>

      {#await chargeCorpsDeMail then CorpsDeMail}
        {#if CorpsDeMail}
          <CorpsDeMail />
        {/if}
      {/await}
    </div>
  </div>
  <p class="texte-mention-xs">
    Exemples fictifs inspirés de services réels utilisés par les entreprises et organismes publics, à des fins
    uniquement pédagogiques.<br /> Si vous ne souhaitez pas que votre organisation et son image apparaissent sur cette page
    contactez-nous pour demander le retrait de cet exemple.
  </p>
</div>

<style lang="scss">
  .mail {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    .texte-mention-xs {
      font-style: italic;
      color: black;
    }
    .mail-ouvert {
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
      display: flex;
      flex: 1;
      flex-direction: column;
      font-family: Roboto, serif;
      min-width: 0;
      margin-bottom: 1rem;
      .entete-mail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 1rem;
        overflow: hidden;
        border-bottom: 1px solid var(--border-default-grey);

        h2 {
          margin: 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
        }
        p {
          margin: 0;
          text-align: start;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mail-info {
          display: grid;
          grid-template-columns: 4rem 1fr;
          width: 100%;
        }
      }
    }
  }
</style>
