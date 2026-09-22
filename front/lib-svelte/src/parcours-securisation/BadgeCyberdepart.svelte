<script lang="ts">
  import { afficheBadgeCyberdépart } from '$plateforme/environnement';
  import BoutonPartageBadgeCyberdepart from './BoutonPartageBadgeCyberdepart.svelte';
  const titre = afficheBadgeCyberdépart ? 'Badge Cyberdépart' : 'Vous avez validé votre Cyberdépart\u00a0!';
  const description = afficheBadgeCyberdépart
    ? `Ce badge témoigne de l’engagement de votre organisation dans une première démarche de sécurisation. Il valorise les
      premières actions mises en place pour réduire les risques cyber les plus fréquents.`
    : `Cette étape témoigne de l’engagement de votre organisation dans une première démarche de sécurisation. Elle valorise les
      premières actions mises en place pour réduire les risques cyber les plus fréquents.`;
  const libelleCta = afficheBadgeCyberdépart ? 'Télécharger mon attestation' : 'Télécharger les visuels';
  const urlBouton = afficheBadgeCyberdépart
    ? '/api/cyberdepart/attestation_badge_cyberdepart.zip'
    : '/api/cyberdepart/visuels_cyberdepart.zip';
</script>

<div class="badge">
  <img src="/assets/images/parcours-securisation/visuel-cyberdepart.svg" width="391" height="220" alt={titre} />
  <div class="explications">
    <h6>{titre}</h6>
    <p class="texte-standard-md">
      {description}
    </p>
    <div class="actions">
      <BoutonPartageBadgeCyberdepart typeDuBouton="secondaire" />
      <dsfr-button
        label={libelleCta}
        kind="secondary"
        size="md"
        has-icon={true}
        icon="download-line"
        icon-place="left"
        markup="a"
        type="button"
        href={urlBouton}
        centered
      ></dsfr-button>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .badge {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-default-grey);
    @include a-partir-de(md) {
      flex-direction: row;
    }
    .explications {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }

    img {
      width: 100%;
      justify-self: center;
      height: 230px;
      object-fit: cover;
      @include a-partir-de(md) {
        width: auto;
      }
    }

    h6 {
      margin-bottom: 1rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @include a-partir-de(md) {
        flex-direction: row;
      }
    }
  }
</style>
