<script lang="ts">
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';
  import { récupèreStatistiquesMSC, type Statistiques } from '../passerelles/statistiquesMSC';
  import Lien from '../ui/Lien.svelte';

  let statistiques: Statistiques | undefined = $state();
  let encart = $state<HTMLDivElement | undefined>();
  let repliVisible = $state(false);
  let hrefCTA = $state('/modules/1');

  onMount(async () => {
    setTimeout(() => {
      if (!encart) return;
      if (typeof encart.showPopover === 'function' && typeof encart.hidePopover === 'function') {
        encart.showPopover();
      } else {
        repliVisible = true;
      }
    }, 500);
    const pageSource = `${window.location.pathname}-encart-lien-vers-demande-diagnostic`;
    hrefCTA = `/modules/1?pageSource=${pageSource}`;
    statistiques = await récupèreStatistiquesMSC();
  });

  const fermeDialogue = () => {
    repliVisible = false;
    encart?.hidePopover?.();
  };
</script>

<div
  bind:this={encart}
  onclose={fermeDialogue}
  popover="manual"
  class="encart-audessus"
  class:repli-visible={repliVisible}
>
  <div class="conteneur">
    <div class="entete">
      <dsfr-button
        label="Fermer"
        has-icon
        icon-place="right"
        icon="close-line"
        kind="tertiary-no-outline"
        size="sm"
        use:clic={fermeDialogue}
      ></dsfr-button>
    </div>
    <div class="contenu">
      <dsfr-badge
        type="accent"
        accent="green-bourgeon"
        label={`+${statistiques?.diagnosticsCyberArrondis ?? 0} organisations accompagnées 🚀`}
        size="sm"
      ></dsfr-badge>

      <h3>12 mesures simples pour protéger votre organisation contre les cyberattaques</h3>

      <ul>
        <li><strong>Rapide</strong> à mettre en place</li>
        <li><strong>Pédagogique :</strong> on vulgarise la cyber pour vous</li>
        <li><strong>Pratico-pratique :</strong> des outils pour vous aider</li>
      </ul>

      <div class="appât fond-bleu-france-950"><strong>🏆 Décrochez votre badge Cyberdépart</strong></div>
      <div class="conteneur-bouton">
        <Lien
          apparence="bouton"
          etire
          type="primaire"
          libelle="Je commence à sécuriser"
          icone="arrow-right-circle-line"
          iconeADroite
          href={hrefCTA}
        ></Lien>
        <Lien apparence="bouton" etire type="tertiaire-sans-bordure" libelle="En savoir plus" href="/entreprises"
        ></Lien>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille.scss' as *;

  .encart-audessus {
    border: 0;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    gap: 0;
    margin: 1rem;
    padding: 0;
    left: anchor(right);
    top: anchor(bottom);
    z-index: 9;

    &[popover] {
      display: none;
      transition:
        display 0.5s allow-discrete,
        transform 0.5s ease;

      transform: translateX(100%);
    }

    &[popover]:popover-open {
      display: block;
      transform: translateY(0);
    }

    &.repli-visible {
      z-index: calc(var(--ground) + 950);
      display: block;
      position: fixed;
      top: auto;
      left: auto;
      right: 0;
      bottom: 0;
      width: calc(100% - 2rem);
      max-height: calc(100% - 4rem);
      overflow: auto;
      background: white;
      transform: none;
    }

    @starting-style {
      &[popover]:popover-open {
        transform: translateX(100%);
      }
    }

    .conteneur {
      width: 100%;

      .entete {
        display: flex;
        flex-direction: row-reverse;
        padding: 1rem 1rem 0.5rem;

        @include a-partir-de(lg) {
          padding: 1rem 2rem 1rem;
        }
      }

      .contenu {
        h3 {
          margin: 0.5rem 0 1rem;
        }

        ul {
          margin-top: 0;
          padding-left: 0;
          list-style: none;

          li {
            position: relative;
            padding-left: 1.5rem;

            &:not(:last-child) {
              margin-bottom: 1rem;
            }

            &::before {
              position: absolute;
              left: 0;
            }

            &:nth-child(1)::before {
              content: '⚡';
            }

            &:nth-child(2)::before {
              content: '💡';
            }

            &:nth-child(3)::before {
              content: '✅';
            }
          }
        }

        .appât {
          padding: 1rem;
          margin-bottom: 0.5rem;
        }

        margin: 0 1rem 1rem;
        display: flex;
        flex-direction: column;

        @include a-partir-de(lg) {
          margin: 0 2rem 2rem 2rem;
        }

        .conteneur-bouton {
          display: flex;
          gap: 1rem;

          margin-top: 1.5rem;

          :global(*) {
            flex-grow: 1;
          }
        }
      }
    }

    @include a-partir-de(md) {
      max-width: taille-pour-colonnes(8);
    }

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(6);
      margin: 2rem;
    }

    @include a-partir-de(xxl) {
      max-width: taille-pour-colonnes(4);
    }
  }
</style>
