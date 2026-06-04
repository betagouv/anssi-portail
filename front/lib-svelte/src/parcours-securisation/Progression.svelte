<script lang="ts">
</script>

<div class="progression">
  <div class="libelle">
    <h6>Progression</h6>
    <span class="texte-standard-md">0&nbsp;/&nbsp;13</span>
  </div>
  <div class="barre"></div>
</div>

<style lang="scss">
  .progression {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .libelle {
      display: flex;
      gap: 1rem;
      align-items: center;

      h6,
      span {
        margin: 0;
      }
    }

    .barre {
      height: 12px;
      background-color: var(--background-contrast-grey);
      border-radius: 999px;
      position: relative;

      &:after {
        content: '';
        height: 32px;
        width: 32px;
        position: absolute;
        top: -10px;
        left: 80%;
        border-radius: 32px;
        background: white url('/assets/icones/icone-recompense.svg') no-repeat center;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
      }
    }
  }
</style>
