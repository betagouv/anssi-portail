<script lang="ts">
  import EncartPromotionParcoursBasique from '../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../parcours-securisation/TagProgrammeGratuit.svelte';
  import EncartInvitationARenforcerCybersecurite from './EncartInvitationARenforcerCybersecurite.svelte';
</script>

<EncartInvitationARenforcerCybersecurite />
<div class="contenu-encart-parcours-securisation">
  <EncartPromotionParcoursBasique
    titre="12 mesures simples pour protéger votre organisation contre les cyberattaques"
    description="Un programme d'accompagnement gratuit, pensé pour les non-experts."
  >
    {#snippet tags()}
      <TagProgrammeGratuit />
    {/snippet}
  </EncartPromotionParcoursBasique>
</div>
<dsfr-container class="contenu-encart-cyberdepart">
  <p>
    <b>Vous préférez échanger avec un Aidant cyber ?</b> Le diagnostic cyberdépart vous permet de bénéficier d’un
    accompagnement gratuit d’1 heure avec un Aidant cyber bénévole, à distance ou dans vos locaux. Retrouvez votre plan
    d’action sur MesServicesCyber.
    <dsfr-link label="Demander un accompagement gratuit" neutral href="/cyberdepart"></dsfr-link>
  </p>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dsfr-container {
    padding-top: 48px;
  }

  .contenu-encart-cyberdepart {
    padding: 48px 0;
    background-color: var(--background-alt-blue-france);
  }

  .contenu-encart-parcours-securisation {
    margin-top: 48px;
    padding: 96px 0 24px;
    background-color: var(--yellow-moutarde-925-125);

    @include a-partir-de(md) {
      padding-bottom: 96px;
    }
  }
</style>
