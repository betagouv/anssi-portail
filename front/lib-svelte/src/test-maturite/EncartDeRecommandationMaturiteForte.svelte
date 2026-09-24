<script lang="ts">
  import EncartPromotionParcoursComplet from '../parcours-securisation/EncartPromotionParcoursComplet.svelte';
  import TagProgrammeGratuit from '../parcours-securisation/TagProgrammeGratuit.svelte';
</script>

<dsfr-container>
  <div class="contenu-section">
    <hgroup class="preambule">
      <h1>Franchissez un cap supplémentaire</h1>
      <p>
        Pour consolider votre niveau et aller encore plus loin, l'ANSSI vous recommande de poursuivre vos efforts avec
        un <b>programme gratuit pour renforcer votre cybersécurité</b> contre les risques les plus courants et
        <b>faciliter votre démarche de mise en conformité NIS 2</b>, si vous êtes concerné.
      </p>
    </hgroup>
    <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
  </div>
</dsfr-container>
<div class="contenu-encart-parcours-securisation">
  <EncartPromotionParcoursComplet
    titre="6 modules pour vous protéger contre les risques les plus courants"
    description="Un programme d'accompagnement gratuit, pensé pour les PME/ETI et les organisations concernées par la directive NIS 2."
    orientation="droite"
  >
    {#snippet tags()}
      <TagProgrammeGratuit />
    {/snippet}
  </EncartPromotionParcoursComplet>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  dsfr-container {
    padding-top: 48px;
  }

  .contenu-encart-parcours-securisation {
    margin-top: 48px;
    padding: 96px 0;
    background-color: var(--yellow-moutarde-925-125);
  }

  .contenu-section {
    display: flex;
    flex-direction: column;
    gap: 24px;

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }

    hgroup.preambule {
      text-align: center;
      align-self: center;
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
      }
      h1 {
        margin: 0 0 24px;
      }
    }

    lab-anssi-icone {
      align-self: center;
    }
  }
</style>
