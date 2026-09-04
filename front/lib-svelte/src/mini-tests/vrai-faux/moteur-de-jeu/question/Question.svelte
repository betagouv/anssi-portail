<script lang="ts">
  import type { Action } from 'svelte/action';
  import BoutonDeVote from './BoutonDeVote.svelte';

  interface Props {
    question: string;
    surVoteVrai: () => void;
    surVoteFaux: () => void;
  }

  let { question, surVoteVrai, surVoteFaux }: Props = $props();

  type Réponse = 'faux' | 'vrai';

  let réfQuestion: HTMLDivElement;
  let réfBoutonFaux: HTMLButtonElement | undefined = $state();
  let réfBoutonVrai: HTMLButtonElement | undefined = $state();
  let pointeurActif: number | undefined;
  let origineX = 0;
  let origineY = 0;
  let délaiRéinitialisation: number | undefined;
  let cadreRéapparition: number | undefined;
  let déplacementX = $state(0);
  let déplacementY = $state(0);
  let rotation = $state(0);
  let glissementEnCours = $state(false);
  let animationDeSortie = $state(false);
  let repositionnementSansAnimation = $state(false);
  let réponseSurvolée = $state<Réponse | undefined>();

  const réinitialiseQuestion = () => {
    pointeurActif = undefined;
    déplacementX = 0;
    déplacementY = 0;
    rotation = 0;
    glissementEnCours = false;
    animationDeSortie = false;
    repositionnementSansAnimation = false;
    réponseSurvolée = undefined;
  };

  const replaceQuestionAprèsSortie = () => {
    déplacementX = 0;
    déplacementY = 0;
    rotation = 0;
    réponseSurvolée = undefined;
    repositionnementSansAnimation = true;

    cadreRéapparition = window.requestAnimationFrame(() => {
      cadreRéapparition = window.requestAnimationFrame(() => {
        repositionnementSansAnimation = false;
        animationDeSortie = false;
      });
    });
  };

  const commenceGlissement = (event: PointerEvent) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    pointeurActif = event.pointerId;
    origineX = event.clientX;
    origineY = event.clientY;
    glissementEnCours = true;
    réfQuestion.setPointerCapture(event.pointerId);
  };

  const glisseQuestion = (event: PointerEvent) => {
    if (event.pointerId !== pointeurActif) return;

    const largeurQuestion = réfQuestion.getBoundingClientRect().width;
    const largeurZoneNeutre = Math.min(96, largeurQuestion * 0.25);

    déplacementX = event.clientX - origineX;
    déplacementY = (event.clientY - origineY) * 0.2;
    rotation = Math.max(-10, Math.min(10, (déplacementX / largeurQuestion) * 8));
    réponseSurvolée =
      déplacementX < -largeurZoneNeutre ? 'faux' : déplacementX > largeurZoneNeutre ? 'vrai' : undefined;
  };

  const termineGlissement = (event: PointerEvent) => {
    if (event.pointerId !== pointeurActif) return;

    réfQuestion.releasePointerCapture(event.pointerId);
    pointeurActif = undefined;
    glissementEnCours = false;

    if (!réponseSurvolée) {
      réinitialiseQuestion();
      return;
    }

    const réponseChoisie = réponseSurvolée;
    const direction = réponseChoisie === 'faux' ? -1 : 1;
    animationDeSortie = true;
    déplacementX = direction * (window.innerWidth + réfQuestion.offsetWidth);
    rotation = direction * 16;

    délaiRéinitialisation = window.setTimeout(() => {
      (réponseChoisie === 'faux' ? réfBoutonFaux : réfBoutonVrai)?.click();
      replaceQuestionAprèsSortie();
    }, 240);
  };

  const annuleGlissement = (event: PointerEvent) => {
    if (event.pointerId === pointeurActif) réinitialiseQuestion();
  };

  const glissementQuestion: Action<HTMLDivElement> = (element) => {
    réfQuestion = element;
    element.addEventListener('pointerdown', commenceGlissement);
    element.addEventListener('pointermove', glisseQuestion);
    element.addEventListener('pointerup', termineGlissement);
    element.addEventListener('pointercancel', annuleGlissement);

    return {
      destroy() {
        window.clearTimeout(délaiRéinitialisation);
        window.cancelAnimationFrame(cadreRéapparition ?? 0);
        element.removeEventListener('pointerdown', commenceGlissement);
        element.removeEventListener('pointermove', glisseQuestion);
        element.removeEventListener('pointerup', termineGlissement);
        element.removeEventListener('pointercancel', annuleGlissement);
      },
    };
  };
</script>

<div class="conteneur-de-choix">
  <div
    use:glissementQuestion
    class:en-glissement={glissementEnCours}
    class:en-sortie={animationDeSortie}
    class:sans-transition={repositionnementSansAnimation}
    class="question"
    style:--deplacement-x={`${déplacementX}px`}
    style:--deplacement-y={`${déplacementY}px`}
    style:--rotation={`${rotation}deg`}
  >
    <dsfr-tag class="compte" size="md" label="1/6"></dsfr-tag>
    <p class="fr-h2">🏢</p>
    <h2 class="fr-h3">{question}</h2>
  </div>
  <div class="boutons-de-vote">
    <BoutonDeVote
      bind:réfBouton={réfBoutonFaux}
      réponse="faux"
      estCible={réponseSurvolée === 'faux'}
      surVote={surVoteFaux}
    />
    <BoutonDeVote
      bind:réfBouton={réfBoutonVrai}
      réponse="vrai"
      estCible={réponseSurvolée === 'vrai'}
      surVote={surVoteVrai}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../../../../assets/styles/responsive' as *;
  @use '../../../../../../assets/styles/grille.scss' as *;

  .conteneur-de-choix {
    --icon-size: 1.5rem;
    position: relative;

    &::after {
      background-color: var(--background-contrast-blue-france);
      border-radius: 0.5rem;
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 340px;
    }

    .question {
      display: flex;
      padding: 2rem;
      flex-direction: column;
      align-items: flex-start;
      border-radius: 0.5rem;
      background: var(--background-default-grey);
      box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
      box-sizing: border-box;
      cursor: grab;
      height: 340px;
      width: 100%;
      margin-bottom: 4.5rem;
      position: relative;
      overflow: hidden;

      touch-action: pan-y;
      transform: translate3d(var(--deplacement-x), var(--deplacement-y), 0) rotate(var(--rotation));
      transition:
        transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 180ms ease-out;
      user-select: none;
      z-index: 1;

      &.en-glissement {
        cursor: grabbing;
        transition: none;
      }

      &.sans-transition {
        transition: none;
      }

      &.en-sortie {
        opacity: 0;
      }

      .compte {
        align-self: flex-end;
      }
    }

    .boutons-de-vote {
      background-color: var(--background-default-grey);
      bottom: 0;
      box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
      position: sticky;
      margin-inline: -1rem;
      z-index: 2;
    }

    @include a-partir-de(md) {
      --icon-size: 2.5rem;
      display: grid;
      gap: 1rem;
      grid-template-areas: 'vide1 question vide2';
      grid-template-columns: 3fr 6fr 3fr;
      margin-bottom: 4.5rem;

      .question,
      &::after {
        grid-area: question;
      }

      .question {
        margin-bottom: 0;
      }

      .boutons-de-vote {
        align-items: center;
        background: transparent;
        box-shadow: none;
        display: grid;
        gap: 1rem;
        grid-column: 1 / -1;
        grid-row: 1;
        grid-template-areas: 'faux vide vrai';
        grid-template-columns: 3fr 6fr 3fr;
        z-index: initial;

        :global(:last-child) {
          grid-area: vrai;
        }
      }
    }

    @include a-partir-de(lg) {
      width: taille-pour-colonnes(10);
      margin-inline: taille-pour-colonnes(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .question {
      transition-duration: 0.01ms;
    }
  }
</style>
