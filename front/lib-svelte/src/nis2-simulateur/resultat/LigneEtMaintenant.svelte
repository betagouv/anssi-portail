<script lang="ts">
</script>

<div class="fluide">
  <dsfr-container>
    <div class="et-maintenant">
      <h4>Et maintenant ?</h4>
      <p>La prochaine étape est de vous déclarer auprès de l&apos;ANSSI en pré-enregistrant votre organisation</p>

      <dsfr-button
        label="Se pré-enregistrer"
        size="md"
        icon="checkbox-line"
        icon-place="left"
        markup="a"
        type="button"
        href="https://club.ssi.gouv.fr/#/nis2/introduction"
        target="_blank"
        kind="primary"
      ></dsfr-button>
    </div>
  </dsfr-container>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  .fluide {
    background-color: var(--background-alt-blue-france);
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    margin-top: 24px;
  }

  .et-maintenant {
    box-sizing: border-box;
    padding: 40px taille-pour-colonnes(1);
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: auto;
    max-width: taille-pour-colonnes(12);

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }

    h4 {
      color: var(--text-title-blue-france);
      margin-bottom: 0;
    }
  }
</style>
