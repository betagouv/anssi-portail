<script lang="ts">
</script>

<div class="avis-utilisateur-cta">
  <div class="illustration">
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
    position: absolute;
    right: 0;
    top: 208px;
    width: 124px;

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
