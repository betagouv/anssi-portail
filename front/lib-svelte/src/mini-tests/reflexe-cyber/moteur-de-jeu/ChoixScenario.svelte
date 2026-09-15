<script lang="ts">
  import { onMount } from 'svelte';
  import { clic } from '../../../directives/actions.svelte';
  import Bouton from '../../../ui/Bouton.svelte';
  import type { IdScénario, Scénario } from './scenarios';

  type Props = {
    scénarios: Scénario[];
    surChoix: (id: IdScénario) => void;
  };

  const { scénarios, surChoix }: Props = $props();

  let piste: HTMLDivElement | undefined = $state();
  let précédentDésactivé = $state(true);
  let suivantDésactivé = $state(false);

  const metÀJourFlèches = () => {
    if (!piste) return;

    const positionMaximale = piste.scrollWidth - piste.clientWidth;
    précédentDésactivé = piste.scrollLeft <= 1;
    suivantDésactivé = piste.scrollLeft >= positionMaximale - 1;
  };

  onMount(() => {
    if (!piste) return;

    const observateur = new ResizeObserver(metÀJourFlèches);
    observateur.observe(piste);
    metÀJourFlèches();

    return () => observateur.disconnect();
  });

  const défile = (direction: 1 | -1) => {
    const carte = piste?.querySelector<HTMLElement>('[data-carte-scenario]');
    if (!piste || !carte) return;
    piste.scrollBy({ left: direction * (carte.offsetWidth + 24), behavior: 'smooth' });
  };
</script>

<section class="choix-scenario">
  <dsfr-container>
    <div class="entete">
      <h2 class="fr-h2">Choisissez un scénario</h2>
      <p class="fr-text--lg">Chaque événement sera différent selon le scénario sélectionné.</p>
    </div>

    <div class="carrousel-scenarios">
      <div class="piste" bind:this={piste} role="radiogroup" aria-label="Scénario" onscroll={metÀJourFlèches}>
        {#each scénarios as scénario (scénario.id)}
          <div class="carte-scenario" data-carte-scenario>
            <dsfr-card
              title={scénario.titre}
              description={scénario.description}
              has-description
              src={scénario.image.src}
              alt={scénario.image.alt}
              size="md"
              image-ratio="32x9"
              action-markup="button"
              enlarge
              use:clic={() => surChoix(scénario.id)}
            ></dsfr-card>
          </div>
        {/each}
      </div>
      <div class="fleches">
        <Bouton
          type="secondaire"
          taille="md"
          icone="arrow-left-line"
          iconeSeule
          libelle="Scénario précédent"
          desactive={précédentDésactivé}
          surClic={() => défile(-1)}
        ></Bouton>
        <Bouton
          type="secondaire"
          taille="md"
          icone="arrow-right-line"
          iconeSeule
          libelle="Scénario suivant"
          desactive={suivantDésactivé}
          surClic={() => défile(1)}
        ></Bouton>
      </div>
    </div>
  </dsfr-container>
</section>

<style lang="scss">
  $nombre-cartes: 2;
  $largeur-carte: 30.375rem;
  $espacement-cartes: 1.5rem;
  $largeur-minimale-sans-carrousel: $nombre-cartes * $largeur-carte + ($nombre-cartes - 1) * $espacement-cartes;

  dsfr-container {
    padding-block: 3rem 4.5rem;
  }

  .entete {
    margin-bottom: 2rem;
    text-align: center;

    p {
      margin: 0;
    }
  }

  .carrousel-scenarios {
    container-type: inline-size;

    .piste {
      display: flex;
      gap: $espacement-cartes;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding-bottom: 0.5rem;
    }

    .carte-scenario {
      display: flex;
      flex: 0 0 calc(100% - 3rem);
      max-width: $largeur-carte;
      scroll-snap-align: start;

      dsfr-card {
        flex: 1;
        height: 100%;
      }
    }

    .fleches {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    @container (min-width: #{$largeur-minimale-sans-carrousel}) {
      .piste {
        overflow: visible;
        justify-content: center;
      }

      .fleches {
        display: none;
      }
    }
  }
</style>
