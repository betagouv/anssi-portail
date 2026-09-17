<script lang="ts" module>
  export type IdéeReçue = {
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
</script>

<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { v7 as uuidv7 } from 'uuid';
  import { publieRéponseQuestionnaireVraiFaux } from '../../../passerelles/mini-tests/publicationRéponses';
  import FilAriane from '../../../ui/FilAriane.svelte';
  import ScoreFinalQuizVraiFaux from './ScoreFinalQuizVraiFaux.svelte';
  import Question from './question/Question.svelte';
  import ReponseVraiFaux from './ReponseVraiFaux.svelte';
  import { fabriqueFilAriane } from '../../../ui/filAriane';
  import EnteteAutonome from '../../../ui/EnteteAutonome.svelte';

  let { urlBase = '', mode: modeWebc }: { urlBase?: string; mode?: string } = $props();

  const idCorrélation = uuidv7();
  let mode: 'question' | 'bonne-réponse' | 'mauvaise-réponse' | 'score-final' = $state('question');

  const afficheIdéeReçueSuivante = () => {
    mode = 'question';
    indexIdéeReçue = indexIdéeReçue + 1;
  };

  const afficheRéponse = async (réponseDonnée: boolean) => {
    const réponseCorrecte = idéeReçueCourante.idéeReçueEstVraie === réponseDonnée;
    mode = réponseCorrecte ? 'bonne-réponse' : 'mauvaise-réponse';
    réponses.push(réponseCorrecte);
    await publieRéponseQuestionnaireVraiFaux(
      {
        idCorrélation,
        idQuestion: idéeReçueCourante.idQuestion,
        réponseUtilisateur: réponseDonnée,
      },
      urlBase ? { urlBase } : undefined
    );
  };

  const obtenirScore = () => {
    mode = 'score-final';
  };

  let indexIdéeReçue = $state(0);
  let idéesReçues: IdéeReçue[] = $state([]);
  let réponses: boolean[] = $state([]);

  onMount(async () => {
    const réponse = await axios.get(`${urlBase}/api/mini-tests/vrai-faux`);
    idéesReçues = réponse.data;
  });

  const idéeReçueCourante = $derived(idéesReçues[indexIdéeReçue]);
</script>

{#if modeWebc !== 'autonome'}
  <dsfr-container class={mode}>
    <FilAriane
      segments={fabriqueFilAriane({
        feuille: 'Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux&nbsp;?',
        branche: { nom: 'Faire le test !', lien: '/faire-le-test' },
      })}
    />
  </dsfr-container>
{/if}

{#if mode === 'score-final'}
  <ScoreFinalQuizVraiFaux {réponses} {urlBase} mode={modeWebc} />
{:else}
  <dsfr-container class={[mode, 'conteneur-extensible']}>
    {#if modeWebc === 'autonome'}
      <EnteteAutonome {urlBase} />
    {/if}
    <h1 class="fr-h6">Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux&nbsp;?</h1>

    {#if idéeReçueCourante}
      {#if mode === 'question'}
        <Question
          question={idéeReçueCourante.idéeReçue.texte}
          {indexIdéeReçue}
          nombreIdéesReçues={idéesReçues.length}
          emoji={idéeReçueCourante.idéeReçue.emoji}
          surVoteVrai={() => afficheRéponse(true)}
          surVoteFaux={() => afficheRéponse(false)}
          mode={modeWebc}
        />
      {:else}
        <ReponseVraiFaux
          {mode}
          {indexIdéeReçue}
          idéeReçue={idéeReçueCourante}
          nombreIdéesReçues={idéesReçues.length}
          suivant={afficheIdéeReçueSuivante}
          {obtenirScore}
        />
      {/if}
    {/if}
  </dsfr-container>
{/if}

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  dsfr-container {
    display: flex;
    background-color: var(--background-alt-blue-france);
    flex-direction: column;

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    &.bonne-réponse {
      background-color: var(--success-975-75);
    }

    &.mauvaise-réponse {
      background-color: var(--error-975-75);
    }

    &.score-final {
      background-color: var(--background-default-grey);
    }

    &.conteneur-extensible {
      min-height: calc(100dvh - 165px - 68px); // 165px correspond au header, 68px correspond au fil d'Ariane
      @include a-partir-de(md) {
        min-height: initial;
      }
    }
  }
</style>
