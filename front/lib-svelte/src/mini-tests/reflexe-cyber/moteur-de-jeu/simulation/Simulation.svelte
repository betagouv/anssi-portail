<script lang="ts">
  import Bouton from '../../../../ui/Bouton.svelte';
  import type { Rôle } from '../roles';
  import type { IdScénario, Scénario } from '../scenarios';

  type Contexte = {
    éléments: string[];
    conclusion: string;
    indicateur: string;
  };

  type Props = {
    scénario: Scénario;
    rôle: Rôle;
  };

  const { scénario, rôle }: Props = $props();

  const contextes: Record<IdScénario, Contexte> = {
    entreprise: {
      éléments: [
        'agendas bloqués,',
        'secrétariat incapable de gérer les rendez-vous clients — un client menace de rompre son contrat après un rendez-vous en visio raté.',
      ],
      conclusion:
        "Le système de paie et des fichiers internes (contrats, commandes) deviennent inaccessibles, et le site web tombe. Le technicien support investigue, sans résultat clair pour l'instant.",
      indicateur: 'Commandes bloquées',
    },
    collectivité: {
      éléments: ['agendas bloqués,', 'paie inaccessible,', 'application cantine hors service.'],
      conclusion:
        'Sur X, un administré interpelle publiquement la mairie et évoque une cyberattaque. Le technicien est sur le coup, mais sans résultat clair pour l’instant.',
      indicateur: 'Démarches bloquées',
    },
  };

  const contexte = $derived(contextes[scénario.id]);
  let actionsAffichées = $state(false);
</script>

<dsfr-container class="simulation-contenu">
  <div class="alerte-mobile">
    <dsfr-alert type="info" size="sm" hasTitle={false} dismissible>
      <p slot="description">
        Expérimentez une simulation plus immersive sur desktop. Messages en directs, effets sonores...
      </p>
    </dsfr-alert>
  </div>

  <div
    class="progression"
    role="progressbar"
    aria-label="Progression de la simulation"
    aria-valuenow="1"
    aria-valuemin="1"
    aria-valuemax="6"
  >
    {#each Array(6) as _, index (index)}
      <span class:active={index === 0} aria-hidden="true"></span>
    {/each}
  </div>

  <div class="grille-simulation">
    <section class="evenement" aria-labelledby="titre-evenement">
      <div class="media" aria-hidden="true">
        <img src="/assets/images/mini-tests/reflexe-cyber/evenement-1.avif" alt="" />
      </div>

      <div class="contenu-evenement">
        <div class="contexte">
          <div class="titre">
            <dsfr-tag label="9h30" type="default" size="md" has-icon icon="time-fill"></dsfr-tag>
            <h2 class="fr-h3" id="titre-evenement">Début de l’incident</h2>
          </div>

          <div class="texte-evenement fr-text--md">
            <p>Les premières alertes arrivent en cascade&nbsp;:</p>
            <ul>
              {#each contexte.éléments as élément (élément)}
                <li>{élément}</li>
              {/each}
            </ul>
            <p>{contexte.conclusion}</p>
          </div>
        </div>

        {#if actionsAffichées}
          <div class="choix">
            <div class="entete-choix">
              <img src={rôle.image.src} alt={rôle.image.alt} />
              <h3 class="fr-h6">Sélectionnez le bon réflexe</h3>
            </div>

            <div class="options" role="radiogroup" aria-label="Réflexes proposés">
              <label>
                <input type="radio" name="reflexe" value="option-1" />
                <span>Libellé</span>
              </label>
              <label>
                <input type="radio" name="reflexe" value="option-2" />
                <span>Libellé</span>
              </label>
            </div>
          </div>

          <div class="minuteur">
            <p>Temps restant&nbsp;: <strong>30 secondes</strong></p>
            <div class="barre-temps" aria-hidden="true"></div>
          </div>

          <dsfr-alert title="Bon réflexe !" text="Description" type="success" size="md" has-description></dsfr-alert>

          <Bouton libelle="Événement suivant" taille="md" />
        {:else}
          <Bouton libelle="Afficher les actions" taille="md" surClic={() => (actionsAffichées = true)} />
        {/if}
      </div>
    </section>

    <aside class="indicateur-crise" aria-label="État de la crise">
      <p class="fr-text--xs">{contexte.indicateur}</p>
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

    .progression {
      position: sticky;
      z-index: 2;
      top: 0;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
      height: 2.5rem;
      box-sizing: border-box;
      padding-block: 1rem;
      background-color: var(--background-default-grey);

      span {
        height: 0.5rem;
        background-color: var(--background-contrast-grey);

        &.active {
          background-color: var(--background-action-high-blue-france);
        }
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

          .contexte,
          .titre {
            display: flex;
            width: 100%;
            flex-direction: column;
          }

          .contexte {
            gap: 1.5rem;

            .titre {
              align-items: flex-start;
              gap: 0.5rem;

              h2 {
                margin: 0;
                color: var(--text-title-blue-france);
              }
            }

            .texte-evenement {
              width: 100%;

              p,
              ul {
                margin: 0 0 1.5rem;
              }

              ul {
                padding-left: 1.5rem;
              }

              > :last-child {
                margin-bottom: 0;
              }
            }
          }

          .choix {
            display: flex;
            width: 100%;
            box-sizing: border-box;
            flex-direction: column;
            gap: 1.5rem;
            padding: 1.5rem;
            background-color: var(--background-alt-blue-france);

            .entete-choix {
              display: flex;
              align-items: center;
              gap: 0.75rem;

              img {
                border-radius: 999px;
                object-fit: cover;
                object-position: center;
                border: 2px solid white;
                width: 3.75rem;
                height: 3.75rem;
              }

              h3 {
                margin: 0;
              }
            }

            .options {
              display: flex;
              width: 100%;
              flex-direction: column;
              gap: 1rem;

              label {
                display: flex;
                min-height: 3rem;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                border: 1px solid var(--border-default-grey);
                background-color: var(--background-default-grey);
                cursor: pointer;
              }

              input {
                flex: 0 0 auto;
                width: 1rem;
                height: 1rem;
                margin: 0;
                accent-color: var(--background-action-high-blue-france);
              }
            }
          }

          .minuteur {
            display: flex;
            width: 100%;
            box-sizing: border-box;
            flex-direction: column;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background-color: var(--background-alt-grey);

            p {
              margin: 0;
            }

            .barre-temps {
              width: 100%;
              height: 0.5rem;
              border-radius: 999px;
              background-color: var(--border-default-blue-france);
            }
          }
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
