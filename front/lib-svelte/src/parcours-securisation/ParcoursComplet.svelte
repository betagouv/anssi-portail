<script lang="ts">
  import Heros from '../ui/Heros.svelte';
  import Lien from '../ui/Lien.svelte';
</script>

<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue."
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre="Parcours de sécurisation"
  theme="sombre"
></Heros>
<dsfr-container>
  <div class="grille">
    <dsfr-card
      description="Prenez votre cyber départ..."
      enlarge={false}
      has-buttons={true}
      has-description="true"
      no-link={true}
      src="/assets/images/image-generique.avif"
      title="Cyberdépart: 13 actions pour se lancer"
    >
      <div slot="buttonsgroup" class="actions-carte">
        <Lien apparence="bouton" href="#" type="primaire" libelle="Prendre mon Cyberdépart" etire={true} />
      </div>
    </dsfr-card>
    <dsfr-card
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue."
      enlarge={false}
      has-buttons={true}
      has-description="true"
      no-link={true}
      src="/assets/images/image-generique.avif"
      title="Aggravation des conséquences d'un incident"
    >
      <div slot="buttonsgroup" class="actions-carte">
        <Lien apparence="bouton" href="#" type="primaire" libelle="Accéder aux mesures" etire={true} />
      </div>
    </dsfr-card>
  </div>
</dsfr-container>

<style lang="scss">
  .actions-carte {
    display: flex;
    flex-direction: column;
  }

  .grille {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-bottom: 1rem;
  }
</style>
