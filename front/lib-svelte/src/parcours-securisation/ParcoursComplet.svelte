<script lang="ts">
  import Heros from '../ui/Heros.svelte';
  import Lien from '../ui/Lien.svelte';
  const modules = [
    {
      description: 'Prenez votre cyber départ..',
      titre: 'Cyberdépart: 13 actions pour se lancer',
      libelleLien: 'Prendre mon Cyberdépart',
    },
    {
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue.',
      titre: "Aggravation des conséquences d'un incident",
      libelleLien: 'Accéder aux mesures',
    },
    {
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue.',
      titre: 'Exploitation de faille dans la défense',
      libelleLien: 'Accéder aux mesures',
    },
    {
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue.',
      titre: 'Incapacité de réagir',
      libelleLien: 'Accéder aux mesures',
    },
  ];
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
    {#each modules as module (module.titre)}
      <dsfr-card
        description={module.description}
        enlarge={false}
        has-buttons={true}
        has-description="true"
        no-link={true}
        src="/assets/images/image-generique.avif"
        title={module.titre}
      >
        <div slot="buttonsgroup" class="actions-carte">
          <Lien apparence="bouton" href="#" type="primaire" libelle={module.libelleLien} etire={true} />
        </div>
      </dsfr-card>
    {/each}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .actions-carte {
    display: flex;
    flex-direction: column;
  }

  .grille {
    display: grid;
    --colonnes: 1;
    grid-template-columns: repeat(var(--colonnes), 1fr);
    gap: 1rem;
    padding-bottom: 1rem;
    @include a-partir-de(md) {
      --colonnes: 2;
    }
  }
</style>
