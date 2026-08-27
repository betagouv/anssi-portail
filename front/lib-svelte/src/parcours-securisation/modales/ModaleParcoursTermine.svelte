<script lang="ts">
  import Modale from '../../ui/Modale.svelte';

  type Props = {
    estOuverte: boolean;
  };

  let { estOuverte = $bindable() }: Props = $props();
</script>

<Modale bind:estOuverte titre="Félicitations&nbsp;!">
  <div class="corps">
    <p class="texte-standard-md">Vous avez pris en compte l’ensemble des mesures proposées dans ce parcours.</p>
    <img src="/assets/images/cotillons-100-pourcents.svg" alt="félicitations" width="524" height="188" />
    <p class="texte-standard-md">Cela témoigne d’un niveau d’engagement élevé dans votre démarche de sécurisation.</p>
    <p class="texte-standard-md">
      <strong>Ce parcours est terminé mais votre sécurisation continue&nbsp;:</strong>
    </p>
    <ul>
      <li>Revoir régulièrement les mesures&nbsp;;</li>
      <li>Vérifier certaines mesures critiques&nbsp;;</li>
      <li>Refaire un point dans 6 ou 12 mois&nbsp;;</li>
      <li>Suivre les nouvelles recommandations de l’ANSSI.</li>
    </ul>
  </div>
</Modale>

<style lang="scss">
  .corps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    p {
      margin: 0;
    }

    ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    img {
      width: 100%;
      object-fit: cover;
    }
  }
</style>
