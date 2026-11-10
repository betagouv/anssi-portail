<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import Bouton from '../ui/Bouton.svelte';

  const parcoursUtilisateur = $derived($profilStore?.parcoursSecurisation?.parcoursActuel);
  const labelParcours = $derived.by(() => {
    switch (parcoursUtilisateur) {
      case 'allégé':
        return ' Cyberdépart';
      case 'complet':
        return ' complet';
      default:
        return '';
    }
  });

  const idPanneau = 'retour-utilisateur-sur-parcours';
  let panneauOuvert = $state(false);
  let estSurvolé = false;

  const estLg = () => window.matchMedia('(min-width: 992px)').matches;

  const surEntréeSouris = () => {
    if (!estLg()) return;
    estSurvolé = true;
    panneauOuvert = true;
  };

  const surSortieSouris = (e: MouseEvent & { currentTarget: HTMLElement }) => {
    estSurvolé = false;
    if (estLg() && !e.currentTarget.querySelector(':focus-visible')) panneauOuvert = false;
  };

  const surEntréeFocus = (e: FocusEvent) => {
    if (estLg() && e.target instanceof HTMLElement && e.target.matches(':focus-visible')) panneauOuvert = true;
  };

  const surSortieFocus = (e: FocusEvent & { currentTarget: HTMLElement }) => {
    if (estLg() && !estSurvolé && !e.currentTarget.contains(e.relatedTarget as Node | null)) panneauOuvert = false;
  };

  const surToucheEnfoncée = (e: KeyboardEvent) => {
    if (e.key === 'Escape') panneauOuvert = false;
  };
</script>

<svelte:window onkeydown={surToucheEnfoncée} />

<aside
  class="retour-utilisateur-sur-parcours"
  aria-label="Votre avis"
  onmouseenter={surEntréeSouris}
  onmouseleave={surSortieSouris}
  onfocusin={surEntréeFocus}
  onfocusout={surSortieFocus}
>
  <button
    class="onglet"
    type="button"
    aria-expanded={panneauOuvert}
    aria-controls={idPanneau}
    onclick={() => (panneauOuvert = !panneauOuvert)}
  >
    <span class="illustration">
      <img src="/assets/images/dragon-coeur.svg" alt="" width="52" height="60" />
    </span>
    <span class="libelle"><span class="texte-pivote">Je donne mon avis</span></span>
  </button>

  <div id={idPanneau} class={['conteneur-panneau', { ouvert: panneauOuvert }]}>
    <div class="rognage">
      <div class={['panneau', parcoursUtilisateur]}>
        <h2 class="fr-h6">Que pensez-vous du parcours{labelParcours}&#8239;?</h2>
        <p class="texte-detail-sm">Votre retour peut rendre ce parcours plus utile à tous 🙏.</p>
        <Bouton libelle="Partager mon ressenti" type="primaire" taille="md" surClic={() => {}} />
      </div>
    </div>
  </div>
</aside>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .retour-utilisateur-sur-parcours {
    display: flex;
    align-items: stretch;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    border-radius: 0.5rem 0 0 0.5rem;
    background-color: var(--background-default-grey);
    position: fixed;
    right: 0;
    top: 13rem;
    max-width: 100vw;
    z-index: calc(var(--centre-aide-z-index) + 2);

    .onglet {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 3rem;
      padding: 0;
      border: none;
      border-radius: 0.5rem 0 0 0.5rem;
      background-color: var(--background-default-grey);
      cursor: pointer;

      &:hover {
        background-color: var(--controle-segmente-fond-hover);
      }

      &:active {
        background-color: var(--controle-segmente-fond-clique);
      }

      &:focus-visible {
        outline: 2px solid var(--bleu-contour-mis-en-valeur);
        outline-offset: 2px;
      }

      @include a-partir-de(lg) {
        cursor: default;

        &:hover,
        &:active {
          background-color: var(--background-default-grey);
        }
      }

      .illustration {
        display: block;
        height: 3.5rem;
        overflow: hidden;
        border-top-left-radius: 0.5rem;
        background-color: var(--green-bourgeon-975-75);

        img {
          display: block;
          margin-left: 0.25rem;
          margin-top: 0.125rem;
          max-width: none;
        }
      }

      .libelle {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 0.75rem 0.625rem 0.75rem 0.75rem;
      }

      .texte-pivote {
        color: var(--text-label-grey);
        font-size: 0.875rem;
        font-weight: 700;
        line-height: 1.5rem;
        white-space: nowrap;
        writing-mode: vertical-rl;
      }
    }

    .conteneur-panneau {
      display: grid;
      grid-template-columns: 0fr;
      opacity: 0;
      visibility: hidden;
      transition:
        grid-template-columns 400ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 250ms ease-out,
        visibility 0s linear 400ms;

      &.ouvert {
        grid-template-columns: 1fr;
        opacity: 1;
        visibility: visible;
        transition:
          grid-template-columns 400ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 250ms ease-out 100ms,
          visibility 0s;
      }

      @media (prefers-reduced-motion: reduce) {
        &,
        &.ouvert {
          transition: none;
        }
      }

      .rognage {
        min-width: 0;
        overflow: hidden;
      }

      .panneau {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        max-width: calc(100vw - 3rem);
        padding: 1.25rem;
        border-left: 1px solid var(--border-default-grey);
        box-sizing: border-box;

        &.allégé {
          width: 16.8rem;
        }

        &.complet {
          width: 15.1rem;
        }

        h2 {
          color: var(--text-title-grey);
          margin: 0;
        }

        p {
          color: var(--text-default-grey);
          margin: 0 0 0.5rem;
        }
      }
    }
  }
</style>
