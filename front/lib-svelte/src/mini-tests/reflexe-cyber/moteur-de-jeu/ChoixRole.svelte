<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Bouton from '../../../ui/Bouton.svelte';
  import { détecteRendu } from '../../../utils/rendu.svelte';
  import type { IdRôle, Rôle } from './roles';

  type Props = {
    rôles: Rôle[];
    rôleSélectionné: IdRôle | undefined;
    surChoix: (id: IdRôle) => void;
    surÉtapePrécédente: () => void;
    surÉtapeSuivante: () => void;
  };

  const { rôles, rôleSélectionné, surChoix, surÉtapePrécédente, surÉtapeSuivante }: Props = $props();

  let piste: HTMLDivElement | undefined = $state();
  let précédentDésactivé = $state(true);
  let suivantDésactivé = $state(false);

  const metÀJourFlèches = () => {
    if (!piste) return;

    const positionMaximale = piste.scrollWidth - piste.clientWidth;
    précédentDésactivé = piste.scrollLeft <= 1;
    suivantDésactivé = piste.scrollLeft >= positionMaximale - 1;
  };

  const positionneSurRôleSélectionné = () => {
    const indexRôleSélectionné = rôles.findIndex(({ id }) => id === rôleSélectionné);
    const carteSélectionnée = piste?.querySelectorAll<HTMLElement>('[data-carte-role]')[indexRôleSélectionné];
    if (!piste || !carteSélectionnée) return;

    const limitesPiste = piste.getBoundingClientRect();
    const limitesCarte = carteSélectionnée.getBoundingClientRect();

    if (limitesCarte.left < limitesPiste.left) {
      piste.scrollLeft -= limitesPiste.left - limitesCarte.left;
    } else if (limitesCarte.right > limitesPiste.right) {
      piste.scrollLeft += limitesCarte.right - limitesPiste.right;
    }
  };

  onMount(() => {
    if (!piste) return;

    const observateur = new ResizeObserver(metÀJourFlèches);
    observateur.observe(piste);
    void tick().then(() => {
      positionneSurRôleSélectionné();
      metÀJourFlèches();
    });

    return () => observateur.disconnect();
  });

  const défile = (direction: 1 | -1) => {
    const carte = piste?.querySelector<HTMLElement>('[data-carte-role]');
    if (!piste || !carte) return;
    piste.scrollBy({ left: direction * (carte.offsetWidth + 24), behavior: 'smooth' });
  };

  let carrousel: HTMLElement | undefined = $state();

  const rendu = détecteRendu();

  const choisis = (idRôle: IdRôle) => {
    if (rendu.estMobile) {
      carrousel?.scrollIntoView({ behavior: 'smooth' });
    }
    surChoix(idRôle);
  };
</script>

<dsfr-container>
  <div class="entete">
    <h2 class="fr-h2">Sélectionnez un rôle</h2>
    <p class="fr-text--lg">Les choix seront adaptés selon le rôle sélectionné.</p>
  </div>

  <div class="carrousel-roles" bind:this={carrousel}>
    <div
      class="piste"
      bind:this={piste}
      role="radiogroup"
      aria-label="Sélectionnez votre rôle"
      onscroll={metÀJourFlèches}
      tabindex="-1"
    >
      {#each rôles as rôle (rôle.id)}
        <label class="carte-role" class:selectionnee={rôleSélectionné === rôle.id} data-carte-role>
          <span class="media" aria-hidden="true">
            <img src={rôle.image.src} alt={rôle.image.alt} />
          </span>
          <span class="contenu">
            <strong class="fr-h6 titre">{rôle.nom}</strong>
            <span class="fr-text--sm description">{rôle.description}</span>
            <input
              class="radio-natif"
              type="radio"
              name="role"
              value={rôle.id}
              checked={rôleSélectionné === rôle.id}
              onchange={() => choisis(rôle.id)}
            />
          </span>
        </label>
      {/each}
    </div>
    <div class="fleches">
      <Bouton
        type="secondaire"
        taille="md"
        icone="arrow-left-line"
        iconeSeule
        libelle="Rôle précédent"
        desactive={précédentDésactivé}
        surClic={() => défile(-1)}
      ></Bouton>
      <Bouton
        type="secondaire"
        taille="md"
        icone="arrow-right-line"
        iconeSeule
        libelle="Rôle suivant"
        desactive={suivantDésactivé}
        surClic={() => défile(1)}
      ></Bouton>
    </div>
  </div>

  <div class="actions">
    <Bouton libelle="Précédent" type="secondaire" taille="lg" surClic={surÉtapePrécédente} />
    <Bouton libelle="Suivant" taille="lg" desactive={!rôleSélectionné} surClic={surÉtapeSuivante} />
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  dsfr-container {
    padding-block: 3rem 4.5rem;
  }

  .entete {
    margin-bottom: 2rem;
    text-align: center;

    h2 {
      margin-bottom: 1rem;
    }

    p {
      margin: 0 0 1rem;
    }
  }

  .carrousel-roles {
    .piste {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding-bottom: 0.5rem;
    }

    .fleches {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  }

  .carte-role {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 0 0 16rem;
    width: 16rem;
    scroll-snap-align: start;
    background-color: var(--background-default-grey);
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid var(--border-default-grey);
      pointer-events: none;
    }

    &:hover {
      background-color: var(--background-default-grey-hover);
    }

    &:active {
      background-color: var(--background-default-grey-active);
    }

    &.selectionnee {
      &::after {
        border: 3px solid #6a6af4;
      }
    }

    .media {
      display: block;
      aspect-ratio: 3 / 2;
      overflow: hidden;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .contenu {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }

    .titre {
      color: var(--text-title-blue-france);
      margin: 0;
    }

    .description {
      color: var(--text-default-grey);
      margin: 0;
    }

    .radio-natif {
      accent-color: var(--text-title-blue-france);
      width: 1.5rem;
      height: 1.5rem;
      margin: auto 0 0;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 3rem;
  }

  @keyframes apparition-carte-role {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 981px) {
    .carte-role {
      animation: apparition-carte-role 300ms ease-out both;

      @for $index from 2 through 6 {
        &:nth-child(#{$index}) {
          animation-delay: ($index - 1) * 60ms;
        }
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .carte-role {
      animation-duration: 0ms;
      animation-delay: 0ms;
    }
  }
</style>
