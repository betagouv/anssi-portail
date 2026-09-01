<script lang="ts">
  import BoutonPartageBadgeCyberdepart from './BoutonPartageBadgeCyberdepart.svelte';
</script>

<div class="badge">
  <img
    src="/assets/images/parcours-securisation/badge-cyberdepart.svg"
    width="391"
    height="220"
    alt="Badge Cyberdépart "
  />
  <div class="explications">
    <h6>Badge Cyberdépart</h6>
    <p class="texte-standard-md">
      Ce badge témoigne de l’engagement de votre organisation dans une première démarche de sécurisation. Il valorise
      les 1ères actions mises en place pour réduire les risques cyber les plus fréquents.
    </p>
    <div class="actions">
      <BoutonPartageBadgeCyberdepart typeDuBouton="secondaire" />
      <dsfr-button
        label="Télécharger mon attestation"
        kind="secondary"
        size="md"
        has-icon={true}
        icon="download-line"
        icon-place="left"
        markup="a"
        type="button"
        href="/api/cyberdepart/attestation_badge_cyberdepart.zip"
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
