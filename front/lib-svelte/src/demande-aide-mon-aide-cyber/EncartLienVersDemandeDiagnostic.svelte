<script lang="ts">
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';
  import Lien from '../ui/Lien.svelte';

  let encart = $state<HTMLDivElement | undefined>();
  onMount(() => {
    setTimeout(() => {
      encart?.showPopover();
    }, 500);
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
        use:clic={fermeDialogue}
      ></dsfr-button>
    </div>
    <div class="contenu">
      <dsfr-badge type="accent" accent="yellow-tournesol" label="Diagnostic cyber gratuit" size="sm"></dsfr-badge>
      <h5>Obtenez 6 recommandations pour protéger votre organisation</h5>
      <p class="texte-standard-md">
        Bénéficiez d’un <strong>premier diagnostic gratuit</strong> accompagné d’un Aidant cyber et recevez
        <strong>6 recommandations prioritaires</strong>
        à mettre en place pour améliorer la cybersécurité de votre organisation.
      </p>
      <div class="conteneur-bouton">
        <Lien
          apparence="bouton"
          type="primaire"
          libelle="Demander un diagnostic gratuit"
          href="/cyberdepart?origine=guide-dhygiene-informatique"
        ></Lien>
      </div>
      <p class="texte-mention-xs">
        Ce diagnostic gratuit proposé par l'État n'est pas adapté aux particuliers ni aux entreprises mono-salariées.
      </p>
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
          align-self: center;
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

    @include a-partir-de(xl) {
      max-width: taille-pour-colonnes(4);
    }
  }
</style>
