<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';

  const { protocol, host } = window.location;
  const lienModule = `${protocol}://${host}/module-cyberdepart`;
  const urlLinkedIn = `https://www.linkedin.com/shareArticle?url=${lienModule}&title=Test de maturité Cyber`;

  const partageLinkedIn = () => {
    window.open(
      urlLinkedIn,
      'Partager sur LinkedIn',
      'toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=550,height=550'
    );
  };
</script>

<div class="badge">
  <img src="/assets/images/parcours-securisation/badge-cyberdepart.svg" alt="Badge Cyberdépart " />
  <h6>Badge Cyberdépart</h6>
  <p class="texte-standard-md">
    Ce badge témoigne de l’engagement de votre organisation dans une première démarche de sécurisation. Il valorise les
    actions mises en place pour réduire les risques cyber les plus fréquents.
  </p>
  <div class="actions">
    <Bouton
      titre="Partager sur LinkedIn"
      libelle="Partager sur LinkedIn"
      surClic={partageLinkedIn}
      type="secondaire"
      icone="linkedin-box-line"
      etire={true}
    />
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
  .badge {
    border: 1px solid var(--border-default-grey);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    img {
      margin-bottom: 1.5rem;
    }
    h6 {
      margin-bottom: 1rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
