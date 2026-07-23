<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import Modale from '../../ui/Modale.svelte';
  import BoutonPartageBadgeCyberdepart from '../BoutonPartageBadgeCyberdepart.svelte';

  type Props = {
    estOuverte: boolean;
  };

  let { estOuverte = $bindable() }: Props = $props();
</script>

<Modale bind:estOuverte titre="🎉 Bravo, vous avez pris votre Cyberdépart">
  <div class="corps">
    <img
      src="/assets/images/parcours-securisation/badge-cyberdepart.svg"
      width="157"
      height="157"
      alt="Badge Cyberdépart"
    />
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
