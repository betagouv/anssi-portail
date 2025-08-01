<script lang="ts">
</script>

<div class="avis-utilisateur-cta">
  <div class="illustration">
    <button on:keypress tabindex={0} aria-label="Fermer" class="fermer">
      <lab-anssi-icone nom="close-line" taille="sm"></lab-anssi-icone>
    </button>
    <img src="/assets/images/dragon-coeur.svg" alt="Dragon coeur" />
  </div>
  <p class="texte">Votre avis nous intéresse&nbsp;!</p>
</div>

<style lang="scss">
  .avis-utilisateur-cta {
    background-color: #ffffff;
    border-radius: 8px 0 0 8px;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 208px;
    width: 124px;
    z-index: 8;

    .fermer {
      cursor: pointer;
      background: transparent;
      border: 1px solid transparent;
      position: absolute;
      top: 0;
      right: 0;
      padding: 8px;
      margin: 2px 4px;

      &:hover {
        border-color: rgba(0, 0, 0, 0.1);
      }
      &:active {
        border-color: rgba(0, 0, 0, 0.2);
      }
    }

    .illustration {
      background-color: var(--jaune-clair-msc);
      border-top-left-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 120px;

      img {
        width: 97px;
      }
    }

    .texte {
      color: #161616;
      font-size: 14px;
      font-weight: 700;
      line-height: normal;
      margin: 8px 8px 12px;
      text-align: center;
    }
  }
</style>
