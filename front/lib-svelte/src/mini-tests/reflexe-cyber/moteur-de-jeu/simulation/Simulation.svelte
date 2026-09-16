<script lang="ts">
  import type { Rôle } from '../roles';
  import type { Scénario } from '../scenarios';
  import Evenement from './Evenement.svelte';
  import { type Évènement, évènementsParScénario } from './evenements';
  import Progression from './Progression.svelte';
  import { type Réflexe, réflexesParRôle } from './reflexes';

  type Props = {
    scénario: Scénario;
    rôle: Rôle;
  };

  const { scénario, rôle }: Props = $props();

  let évènementsDuScénario: Évènement[] = $derived(évènementsParScénario[scénario.id]);
  let réflexesDuRôle: Réflexe[] = $derived(réflexesParRôle[rôle.id]);

  const nombreÉvènementsTotaux: number = $derived(évènementsDuScénario.length);
  let numéroÉvènementCourant: number = $state(1);

  let évènementCourant: Évènement = $derived(évènementsDuScénario[numéroÉvènementCourant - 1]);
  let réflexeCourant: Réflexe = $derived(réflexesDuRôle[numéroÉvènementCourant - 1]);

  const passeÉvènementSuivant = () => {
    numéroÉvènementCourant++;
  };
</script>

<dsfr-container class="simulation-contenu">
  <div class="alerte-mobile">
    <dsfr-alert type="info" size="sm" hasTitle={false} dismissible>
      <p slot="description">
        Expérimentez une simulation plus immersive sur desktop. Messages en directs, effets sonores...
      </p>
    </dsfr-alert>
  </div>

  <Progression {nombreÉvènementsTotaux} {numéroÉvènementCourant} />

  <div class="grille-simulation">
    <section class="evenement" aria-labelledby="titre-evenement">
      <div class="media" aria-hidden="true">
        <img src="/assets/images/mini-tests/reflexe-cyber/evenement-1.avif" alt="" />
      </div>

      <div class="contenu-evenement">
        <Evenement
          {rôle}
          évènement={évènementCourant}
          réflexe={réflexeCourant}
          surÉvènementSuivant={passeÉvènementSuivant}
        />
      </div>
    </section>

    <aside class="indicateur-crise" aria-label="État de la crise">
      <p class="fr-text--xs">
        {scénario.labelMétrique}
      </p>
      <strong class="fr-h4">0</strong>
      <span class="fr-icon-error-warning-line" aria-hidden="true"></span>
    </aside>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../../../assets/styles/responsive' as *;

  dsfr-container {
    padding-bottom: 4.5rem;

    .alerte-mobile {
      margin-bottom: 0;

      @include a-partir-de(md) {
        display: none;
      }
    }

    .grille-simulation {
      display: grid;
      gap: 1.5rem;
      padding-top: 1.5rem;

      @include a-partir-de(md) {
        grid-template-columns: 8fr 4fr;
        gap: 0.625rem;
      }

      @include a-partir-de(xl) {
        grid-template-columns: 9fr 3fr;
        gap: 1.5rem;
      }

      .evenement {
        display: grid;
        min-width: 0;

        @include a-partir-de(xl) {
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
        }

        .media {
          display: none;
          padding-right: 1rem;

          @include a-partir-de(xl) {
            display: block;
          }

          img {
            display: block;
            width: 100%;
            aspect-ratio: 266 / 354;
            object-fit: contain;
          }
        }

        .contenu-evenement {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
      }

      .indicateur-crise {
        position: sticky;
        top: 0;
        display: none;
        align-self: start;
        min-height: 5.75rem;
        box-sizing: border-box;
        padding: 1rem;
        color: var(--text-default-warning);
        background-color: var(--background-contrast-warning);

        @include a-partir-de(md) {
          display: block;
        }

        p {
          margin: 0;
          color: inherit;
          font-weight: 700;
          text-transform: uppercase;
        }

        strong {
          margin: 0;
          color: inherit;
        }

        span {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 2rem;
        }
      }
    }

    dsfr-alert {
      width: 100%;
    }
  }
</style>
