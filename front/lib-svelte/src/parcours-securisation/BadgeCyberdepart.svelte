<script lang="ts">
  import BoutonPartageBadgeCyberdepart from './BoutonPartageBadgeCyberdepart.svelte';
</script>

<div class="badge">
  <img src="/assets/images/parcours-securisation/badge-cyberdepart.svg" alt="Badge Cyberdépart " />
  <h6>Badge Cyberdépart</h6>
  <p class="texte-standard-md">
    Ce badge témoigne de l’engagement de votre organisation dans une première démarche de sécurisation. Il valorise les
    actions mises en place pour réduire les risques cyber les plus fréquents.
  </p>
  <div class="actions">
    <BoutonPartageBadgeCyberdepart typeDuBouton="secondaire" />
    <dsfr-button
      label="Télécharger mon badge"
      kind="secondary"
      size="md"
      has-icon={true}
      icon="download-line"
      icon-place="left"
      markup="a"
      type="button"
      href="/assets/images/parcours-securisation/badge-cyberdepart.png"
      target="blank"
      centered
    ></dsfr-button>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .badge {
    border: 1px solid var(--border-default-grey);
    display: grid;
    flex-direction: column;
    padding: 1.5rem;
    grid-template-areas: 'image' 'titre' 'description' 'actions';

    @include a-partir-de(md) {
      column-gap: 1.5rem;
      grid-template-areas: 'image titre' 'image description' 'image actions';
    }

    img {
      margin-bottom: 1.5rem;
      grid-area: image;
      justify-self: center;
    }
    h6 {
      grid-area: titre;
      margin-bottom: 1rem;
    }
    p {
      grid-area: description;
    }

    .actions {
      grid-area: actions;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @include a-partir-de(md) {
        flex-direction: row;
      }
    }
  }
</style>
