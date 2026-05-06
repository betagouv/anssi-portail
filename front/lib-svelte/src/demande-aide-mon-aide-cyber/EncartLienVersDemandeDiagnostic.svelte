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

  .encart {
    left: anchor(right);
    margin: 1rem;
    width: min(422px, calc(100% - 2rem));
    padding: 1rem;
    top: anchor(bottom);
  }
</style>
