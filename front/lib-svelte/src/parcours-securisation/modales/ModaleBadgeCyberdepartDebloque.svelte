<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import Modale from '../../ui/Modale.svelte';
  import BoutonPartageBadgeCyberdepart from '../BoutonPartageBadgeCyberdepart.svelte';

  type Props = {
    estOuverte: boolean;
  };

  let { estOuverte = $bindable() }: Props = $props();
</script>

<Modale bind:estOuverte>
  <h2 class="fr-h4">🎉 Bravo, vous avez pris votre Cyberdépart</h2>
  <div class="corps">
    <img src="/assets/images/parcours-securisation/badge-cyberdepart.svg" alt="Badge Cyberdépart" />
    <p class="texte-standard-md">
      Ce badge témoigne de l’engagement de votre organisation dans une première démarche de sécurisation. Il valorise
      les actions mises en place pour réduire les risques cyber les plus fréquents.
    </p>
  </div>
  {#snippet actions()}
    <BoutonPartageBadgeCyberdepart typeDuBouton="primaire" />
    <Bouton libelle="Continuer ma progression" type="secondaire" surClic={() => (estOuverte = false)} />
  {/snippet}
</Modale>

<style lang="scss">
  .fr-h4 {
    margin-bottom: 1rem;
  }
  .corps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    img {
      margin-top: 1.5rem;
      align-self: center;
    }

    p {
      text-align: center;
    }
  }
</style>
