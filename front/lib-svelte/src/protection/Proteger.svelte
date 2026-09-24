<script lang="ts">
  import CarrouselDesInterlocuteurs from '../interlocuteurs/CarrouselDesInterlocuteurs.svelte';
  import EquipeBizDev from '../interlocuteurs/EquipeBizDev.svelte';
  import EncartPromotionParcoursBasique from '../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../parcours-securisation/TagProgrammeGratuit.svelte';
</script>

<div class="contenu-encart-parcours-basique">
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
<dsfr-container class="interlocuteurs-avec-parcours-securisation">
  <CarrouselDesInterlocuteurs />
</dsfr-container>

<dsfr-container class="equipe-biz-dev">
  <EquipeBizDev />
</dsfr-container>

<style lang="scss">
  .contenu-encart-parcours-basique {
    padding-top: 48px;
  }

  .contenu-encart-cyberdepart {
    padding: 48px 0;
    background-color: var(--background-default-grey);
  }

  .interlocuteurs-avec-parcours-securisation {
    padding: 72px 0 24px;
    background-color: var(--blue-france-850-200);
  }

  .equipe-biz-dev {
    padding-block: 56px;
    background-color: var(--brown-cafe-creme-975-75);
  }
</style>
