<script lang="ts">
  import { publieRéponseTestHameçonnage } from '../../passerelles/mini-tests/publicationRéponses';
  import Bouton from '../../ui/Bouton.svelte';
  import BoutonDeVoteHameconnage, { type Réponse } from './BoutonDeVoteHameconnage.svelte';
  import { idCorrélation, mailOuvert, scoreFinalAffiché, tousLesMails } from './hameconnage.store';

  let { mode, urlBase = '' }: { mode: 'mobile' | 'bureau'; urlBase?: string } = $props();

  const surVote = (réponse: Réponse) => async () => {
    if (!$mailOuvert) return;
    const idMail = $mailOuvert.id;
    const aBienVoté = réponse === $mailOuvert?.type;
    const réponseUtilisateur = aBienVoté ? 'bonne' : 'mauvaise';
    $mailOuvert.réponseUtilisateur = réponseUtilisateur;
    $tousLesMails = $tousLesMails.map((mail) => {
      if (mail.id === $mailOuvert?.id) {
        mail = { ...mail, réponseUtilisateur };
      }
      return mail;
    });
    await publieRéponseTestHameçonnage(
      {
        idCorrélation,
        idMail,
        réponse: réponseUtilisateur,
        numéroRéponse: $tousLesMails.filter((mail) => mail.réponseUtilisateur).length,
      },
      { urlBase }
    );
  };
  const tousLesMailsOntUneRéponse = $derived($tousLesMails.every((mail) => mail.réponseUtilisateur));
  const refermeLeMail = () => ($mailOuvert = undefined);
  const obtenirLeRésultat = () => ($scoreFinalAffiché = true);
</script>

<div class={['panneau', mode]} class:deja-repondu={$mailOuvert?.réponseUtilisateur}>
  {#if $mailOuvert?.réponseUtilisateur}
    {#if tousLesMailsOntUneRéponse}
      <Bouton libelle="Obtenir mon résultat" surClic={obtenirLeRésultat} etire />
    {:else}
      <Bouton libelle="Retourner à la liste de mails" surClic={refermeLeMail} etire />
    {/if}
  {:else}
    <h3 class="fr-h6">Vrai ou faux mail ?</h3>
    <div class="boutons-vote">
      <BoutonDeVoteHameconnage réponse="Légitime" surVote={surVote('Légitime')} />
      <BoutonDeVoteHameconnage réponse="Hameçonnage" surVote={surVote('Hameçonnage')} />
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  .panneau {
    display: flex;
    background-color: white;
    padding: 1rem;
    gap: 1rem;
    h3 {
      display: none;
    }

    &.mobile {
      bottom: 0;
      margin-bottom: -1.5rem;
      margin-inline: -1rem;
      position: sticky;
      z-index: calc(var(--centre-aide-z-index) + 1);

      @include a-partir-de(lg) {
        display: none;
      }
    }

    &.bureau {
      display: none;

      @include a-partir-de(lg) {
        display: flex;
        flex-direction: column;
        h3 {
          display: block;
          margin-bottom: 0.5rem;
        }
        .boutons-vote {
          flex-direction: column;
        }
      }
    }

    .boutons-vote {
      display: flex;
      flex: 1;
      gap: 1rem;
      min-width: 0;
    }

    &.deja-repondu {
      flex-direction: column;
      &.bureau {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }
  }
</style>
