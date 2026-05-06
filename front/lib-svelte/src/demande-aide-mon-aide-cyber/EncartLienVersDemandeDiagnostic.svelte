<script lang="ts">
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  let encart = $state<HTMLDivElement | undefined>();

  onMount(() => {
    encart?.showPopover();
  });

  const fermeDialogue = () => {
    encart?.hidePopover();
  };
  const affiche = () => {
    encart?.showPopover();
  };
</script>

<button use:clic={affiche}>ouvre</button>

<div bind:this={encart} onclose={fermeDialogue} popover class="encart">
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
    <p>Diagnotic cyber gratuit</p>
    <h6>Obtenez vos 6 actions prioritaires pour sécuriser votre organisation</h6>
    <p>
      Bénéficier <strong>gratuitement</strong> de l'accompagnement d'un Aidant cyber pour faire le point sur votre
      situation et identifier les <strong>6 actions à mettre en place en priorité</strong>.
    </p>
    <button> Demander un diagnostic gratuit </button>
    <p class="note">
      Ce diagnostic gratuit proposé par l'État n'est pas adapté aux particuliers ni aux entreprises mono-salariées.
    </p>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .encart {
    left: anchor(right);
    margin: 1rem;
    width: min(422px, calc(100% - 2rem));
    padding: 1rem;
    top: anchor(bottom);
  }
</style>
