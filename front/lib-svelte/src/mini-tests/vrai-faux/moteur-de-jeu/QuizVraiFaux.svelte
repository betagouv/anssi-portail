<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Bouton from '../../../ui/Bouton.svelte';
  import CanonAConfetti from '../../../ui/CanonAConfetti.svelte';
  import FilAriane from '../../../ui/FilAriane.svelte';
  import Question from './question/Question.svelte';

  let mode: 'question' | 'bonne-réponse' | 'mauvaise-réponse' = $state('question');

  const afficheIdéeReçueSuivante = () => {
    mode = 'question';
    indexIdéeReçue = indexIdéeReçue + 1;
  };

  const afficheRéponse = (réponseDonnée: boolean) => {
    const réponseCorrecte = ideéReçueCourante.idéeReçueEstVraie === réponseDonnée;
    mode = réponseCorrecte ? 'bonne-réponse' : 'mauvaise-réponse';
  };

  type IdéeReçue = {
    idQuestion: string;
    idéeReçue: {
      emoji: string;
      texte: string;
    };
    réponse: string;
    explications: string[];
    source: string;
    idéeReçueEstVraie: boolean;
  };

  let indexIdéeReçue = $state(0);
  let idéesReçues: IdéeReçue[] = $state([]);

  onMount(async () => {
    const réponse = await axios.get('/api/mini-tests/vrai-faux');
    idéesReçues = réponse.data;
  });

  const ideéReçueCourante = $derived(idéesReçues[indexIdéeReçue]);
  const badge = $derived.by(() => {
    switch (mode) {
      case 'bonne-réponse':
        return { label: 'Bonne réponse', status: 'success' };
      case 'mauvaise-réponse':
        return { label: 'Mauvaise réponse', status: 'error' };
      default:
        return { label: '', status: '' };
    }
  });
</script>

<dsfr-container>
  <FilAriane
    feuille="Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux&nbsp;?"
    branche={{ nom: 'Faire le test !', lien: '/faire-le-test' }}
  />
  <h1 class="fr-h6">Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux&nbsp;?</h1>

  {#if ideéReçueCourante}
    {#if mode === 'question'}
      <Question
        question={ideéReçueCourante.idéeReçue.texte}
        {indexIdéeReçue}
        nombreIdéesReçues={idéesReçues.length}
        surVoteVrai={() => afficheRéponse(true)}
        surVoteFaux={() => afficheRéponse(false)}
      />
    {:else}
      <div class={['réponse', mode]}>
        <dsfr-badge label={badge.label} size="md" type="status" status={badge.status}></dsfr-badge>
        <dsfr-tag class="compte" size="md" label="{indexIdéeReçue + 1}/{idéesReçues.length}"></dsfr-tag>
        <h2 class="fr-h6">{ideéReçueCourante.réponse}</h2>
        {#each ideéReçueCourante.explications as explication, index (index)}
          <p>{explication}</p>
        {/each}
        <hr />
        <p class="texte-mention-xs">Source : {ideéReçueCourante.source}</p>
        <Bouton libelle="Suivant" surClic={afficheIdéeReçueSuivante} icone="arrow-right-line" iconeADroite />
      </div>
      {#if mode === 'bonne-réponse'}
        <CanonAConfetti lectureAutomatique={true} />
      {/if}
    {/if}
  {/if}
</dsfr-container>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;
  @use '../../../../../assets/styles/grille.scss' as *;

  dsfr-container {
    display: flex;
    background-color: var(--background-alt-blue-france);
    flex-direction: column;

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    &:has(.bonne-réponse) {
      background-color: var(--success-975-75);
    }

    &:has(.mauvaise-réponse) {
      background-color: var(--error-975-75);
    }

    .réponse {
      align-items: center;
      background: var(--background-default-grey);
      border-radius: 0.5rem;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
      display: flex;
      flex-flow: row wrap;
      row-gap: 1.5rem;
      grid-template-columns: 1fr auto;
      padding: 2rem;
      justify-content: space-between;
      margin-bottom: 4.5rem;

      @include a-partir-de(md) {
        margin-inline: auto;
        width: taille-pour-colonnes(10);
      }

      @include a-partir-de(lg) {
        margin-inline: auto;
        width: taille-pour-colonnes(6);
      }

      :nth-child(0) {
        flex: 1 100%;
      }
      :nth-child(1) {
        flex: 0 1 auto;
      }
      h2,
      p,
      hr {
        flex: 1 0 100%;
        margin: 0;
      }
      hr {
        height: 1px;
        border: 0;
        background-color: var(--border-default-grey);
      }
      :global(:last-child) {
        margin-inline: auto;
      }
    }
  }
</style>
