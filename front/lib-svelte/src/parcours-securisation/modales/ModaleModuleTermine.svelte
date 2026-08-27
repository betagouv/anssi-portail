<script lang="ts">
  import { onMount } from 'svelte';
  import Lien from '../../ui/Lien.svelte';
  import Modale from '../../ui/Modale.svelte';

  type Props = {
    estOuverte: boolean;
  };

  let { estOuverte = $bindable() }: Props = $props();
  let pageSource = $state('');

  onMount(() => {
    pageSource = `${window.location.pathname}-modale-module-termine`;
  });
</script>

<Modale bind:estOuverte titre="Module complété">
  <div class="corps">
    <p class="texte-standard-md">Félicitations, vous avez pris en compte toutes les mesures de ce module.</p>
    <img src="/assets/images/cotillons-100-pourcents.svg" alt="félicitations" width="524" height="188" />
    <p class="texte-standard-md">Poursuivez votre parcours de sécurisation en complétant les modules restants.</p>
  </div>
  {#snippet actions()}
    <Lien etire apparence="bouton" href={`/parcours-complet?pageSource=${pageSource}`} libelle="Afficher les modules" />
  {/snippet}
</Modale>

<style lang="scss">
  .corps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    p {
      margin: 0;
    }

    img {
      width: 100%;
      object-fit: cover;
    }
  }
</style>
