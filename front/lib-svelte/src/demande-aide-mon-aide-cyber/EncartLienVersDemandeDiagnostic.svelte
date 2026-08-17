<script lang="ts">
  import { afficheNouvelleDA } from '$plateforme/environnement';
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';
  import Lien from '../ui/Lien.svelte';

  let encart = $state<HTMLDivElement | undefined>();
  let pageSource = $state('');
  onMount(() => {
    setTimeout(() => {
      encart?.showPopover();
    }, 500);
    pageSource = `${window.location.pathname}#encart-lien-vers-demande-diagnostic`;
  });

  const fermeDialogue = () => {
    encart?.hidePopover();
  };
</script>

<div bind:this={encart} onclose={fermeDialogue} popover="manual" class="encart-audessus">
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
    <div class="contenu" class:nouvelleDA={afficheNouvelleDA}>
      {#if afficheNouvelleDA}
        <dsfr-badge type="accent" accent="green-bourgeon" label="+6000 organisations accompagnées 🚀" size="sm"
        ></dsfr-badge>

        <h3>13 mesures simples pour protéger votre organisation contre les cyberattaques</h3>

        <ul>
          <li><strong>Rapide</strong> à mettre en place</li>
          <li><strong>Pédagogique :</strong> on vulgarise la cyber pour vous</li>
          <li><strong>Pratico-pratique :</strong> des outils pour vous aider</li>
        </ul>

        <div class="appât fond-bleu-france-950"><strong>🏆 Décrochez votre badge Cyberdépart</strong></div>
      {:else}
        <dsfr-badge type="accent" accent="yellow-tournesol" label="Diagnostic cyber gratuit" size="sm"></dsfr-badge>

        <h5>Obtenez 6 recommandations pour protéger votre organisation</h5>

        <p class="texte-standard-md">
          Bénéficiez d’un <strong>premier diagnostic gratuit</strong> accompagné d’un Aidant cyber et recevez
          <strong>6 recommandations prioritaires</strong>
          à mettre en place pour améliorer la cybersécurité de votre organisation.
        </p>
      {/if}
      <div class="conteneur-bouton" class:nouvelleDA={afficheNouvelleDA}>
        {#if afficheNouvelleDA}
          <Lien
            apparence="bouton"
            etire
            type="primaire"
            libelle="Je commence à sécuriser"
            icone="arrow-right-circle-line"
            iconeADroite
            href={`/modules/1?pageSource=${pageSource}`}
          ></Lien>
          <Lien apparence="bouton" etire type="tertiaire-sans-bordure" libelle="En savoir plus" href="/entreprises"
          ></Lien>
        {:else}
          <Lien
            apparence="bouton"
            type="primaire"
            libelle="Demander un diagnostic gratuit"
            href="/cyberdepart?origine=guide-dhygiene-informatique"
          ></Lien>
        {/if}
      </div>
      {#if !afficheNouvelleDA}
        <p class="texte-mention-xs">
          Ce diagnostic gratuit proposé par l'État n'est pas adapté aux particuliers ni aux entreprises mono-salariées.
        </p>
      {/if}
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
      transition:
        display 0.5s allow-discrete,
        transform 0.5s ease;

      transform: translateX(100%);
    }

    &[popover]:popover-open {
      transform: translateY(0);
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
        &.nouvelleDA {
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
        }

        margin: 0 1rem 1rem;
        display: flex;
        flex-direction: column;

        @include a-partir-de(lg) {
          margin: 0 2rem 2rem 2rem;
        }

        h5 {
          margin: 0.5rem 0 1rem;
        }

        .texte-mention-xs {
          margin-top: 0.5rem;
        }

        .conteneur-bouton {
          &.nouvelleDA {
            display: flex;
            gap: 1rem;

            margin-top: 1.5rem;

            :global(*) {
              flex-grow: 1;
            }
          }

          &:not(.nouvelleDA) {
            align-self: center;
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
