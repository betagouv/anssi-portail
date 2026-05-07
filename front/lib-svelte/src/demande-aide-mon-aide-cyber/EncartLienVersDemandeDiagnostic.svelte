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
      <dsfr-badge type="accent" accent="yellow-tournesol" label="Diagnotic cyber gratuit"></dsfr-badge>
      <h5>Obtenez vos 6 actions prioritaires pour sécuriser votre organisation</h5>
      <p class="texte-standard-md">
        Bénéficier <strong>gratuitement</strong> de l'accompagnement d'un Aidant cyber pour faire le point sur votre
        situation et identifier les <strong>6 actions à mettre en place en priorité</strong>.
      </p>
      <Lien apparence="bouton" type="primaire" libelle="Demander un diagnostic gratuit" href="/cyberdepart"></Lien>
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
      }

      .contenu {
        margin: 0 1rem 1rem;

        h5 {
          margin: 0.5rem 0 1rem;
        }

        .texte-mention-xs {
          margin-top: 0.5rem;
        }
      }
    }

    @include a-partir-de(md) {
      max-width: taille-pour-colonnes(8);
    }

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(4);
    }
  }
</style>
