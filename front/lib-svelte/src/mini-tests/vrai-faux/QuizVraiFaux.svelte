<script lang="ts">
  import type { Action } from 'svelte/action';
  import { clic } from '../../directives/actions.svelte';
  import FilAriane from '../../ui/FilAriane.svelte';

  type Reponse = 'faux' | 'vrai';

  let question: HTMLDivElement;
  let boutonFaux: HTMLButtonElement;
  let boutonVrai: HTMLButtonElement;
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
  let réponseSurvolée = $state<Reponse | undefined>();

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
    question.setPointerCapture(event.pointerId);
  };

  const glisseQuestion = (event: PointerEvent) => {
    if (event.pointerId !== pointeurActif) return;

    const largeurQuestion = question.getBoundingClientRect().width;
    const largeurZoneNeutre = Math.min(96, largeurQuestion * 0.25);

    déplacementX = event.clientX - origineX;
    déplacementY = (event.clientY - origineY) * 0.2;
    rotation = Math.max(-10, Math.min(10, (déplacementX / largeurQuestion) * 8));
    réponseSurvolée =
      déplacementX < -largeurZoneNeutre ? 'faux' : déplacementX > largeurZoneNeutre ? 'vrai' : undefined;
  };

  const termineGlissement = (event: PointerEvent) => {
    if (event.pointerId !== pointeurActif) return;

    question.releasePointerCapture(event.pointerId);
    pointeurActif = undefined;
    glissementEnCours = false;

    if (!réponseSurvolée) {
      réinitialiseQuestion();
      return;
    }

    const réponseChoisie = réponseSurvolée;
    const direction = réponseChoisie === 'faux' ? -1 : 1;
    animationDeSortie = true;
    déplacementX = direction * (window.innerWidth + question.offsetWidth);
    rotation = direction * 16;

    délaiRéinitialisation = window.setTimeout(() => {
      (réponseChoisie === 'faux' ? boutonFaux : boutonVrai).click();
      replaceQuestionAprèsSortie();
    }, 240);
  };

  const annuleGlissement = (event: PointerEvent) => {
    if (event.pointerId === pointeurActif) réinitialiseQuestion();
  };

  const glissementQuestion: Action<HTMLDivElement> = (element) => {
    question = element;
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

<dsfr-container>
  <FilAriane
    feuille="Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?"
    branche={{ nom: 'Faire le test !', lien: '/mini-tests' }}
  />
  <h1 class="fr-h6">Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?</h1>
  <div class="conteneur-de-choix">
    <button
      bind:this={boutonFaux}
      use:clic={() => {}}
      class:est-cible={réponseSurvolée === 'faux'}
      class="vote-faux"
      aria-label="Vote-Faux"
    >
      <lab-anssi-icone nom="thumb-down-fill"></lab-anssi-icone>
      <p class="texte-standard-md vote-faux">Faux</p>
    </button>
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
      <h2 class="fr-h3">
        Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.
      </h2>
    </div>
    <button
      bind:this={boutonVrai}
      use:clic={() => {}}
      class:est-cible={réponseSurvolée === 'vrai'}
      class="vote-vrai"
      aria-label="Vote-Vrai"
    >
      <lab-anssi-icone nom="thumb-up-fill"></lab-anssi-icone>
      <p class="texte-standard-md vote-vrai">Vrai</p>
    </button>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/grille' as *;
  dsfr-container {
    display: flex;
    background-color: var(--background-alt-blue-france);
    flex-direction: column;

    h1 {
      text-align: center;
    }

    .conteneur-de-choix {
      --icon-size: 2.5rem;
      width: taille-pour-colonnes(10);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding-bottom: 4.5rem;
      margin-inline: auto;

      .question {
        display: flex;
        padding: 2rem;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 0.5rem;
        background: var(--background-default-grey);
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
        box-sizing: border-box;
        width: 40%;
        cursor: grab;
        position: relative;
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

      button {
        display: flex;
        padding: 3.5rem 1rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        flex: 1 0 0;
        border-radius: 1.5rem;
        border: 0;
        width: 30%;
        transition:
          background-color 160ms ease,
          transform 160ms ease;

        &.est-cible {
          animation: rebond-cible 240ms ease-out forwards;
        }

        p {
          background-color: transparent;
          color: inherit;
        }
      }

      button.vote-faux {
        background-color: var(--background-contrast-error);
        color: var(--text-default-error);

        &.est-cible {
          background-color: #ffc5c5;
        }
      }

      button.vote-vrai {
        background-color: var(--background-contrast-success);
        color: var(--text-default-success);

        &.est-cible {
          background-color: #46fd89;
        }
      }
    }
  }

  @keyframes rebond-cible {
    0% {
      transform: scale(1);
    }
    55% {
      transform: scale(1.09);
    }
    75% {
      transform: scale(1.04);
    }
    100% {
      transform: scale(1.06);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    dsfr-container .conteneur-de-choix {
      .question,
      button {
        transition-duration: 0.01ms;
      }

      button.est-cible {
        animation: none;
        transform: scale(1.06);
      }
    }
  }
</style>
