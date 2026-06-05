<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
</script>

<div class="conteneur">
  <div class="aide">
    <lab-anssi-icone
      nom="question-line"
      taille="sm"
      title="une recommandation prise en compte signifie que vous avez compris son intérêt, vous avez identifié si elle est pertinente pour votre organisation et si c'est le cas, vous allez désormais faire en sorte de l'appliquer."
    ></lab-anssi-icone>
  </div>
  <p class="texte-article-lg">Cette mesure est-elle prise en compte ?</p>
  <div class="action">
    <Bouton type="primaire" libelle="Prendre en compte" etire={true} />
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  :global(dsfr-footer) {
    margin-bottom: 192px;
    @include a-partir-de(md) {
      margin-bottom: 0;
    }
  }

  .conteneur {
    display: flex;
    flex-direction: column;

    position: fixed;
    box-sizing: border-box;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: var(--background-alt-blue-france);
    z-index: 10;
    padding: 8px 8px 32px;
    @include a-partir-de(md) {
      position: sticky;
      width: auto;
      top: 24px;
      margin-top: 24px;
      margin-left: 16px;
    }
  }
  .aide {
    align-self: flex-end;
  }
  .texte-article-lg {
    font-weight: bold;
    color: var(--text-title-grey);
    margin-inline: 16px;
  }
  .action {
    display: flex;
    flex-direction: column;
    margin-inline: 16px;
  }
  lab-anssi-icone {
    cursor: help;
    margin-right: 8px;
  }
</style>
