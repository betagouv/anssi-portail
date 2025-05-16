<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
</script>

<div class="tuiles-niveau">
  {#each niveauxMaturite as niveau, index (index)}
    <div class="tuile-niveau">
      <img
        class="plante"
        src="/assets/images/test-maturite/niveaux/{niveau.id}.svg"
        alt="Niveau de maturité"
      />
      <span>{niveau.label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .tuiles-niveau {
    display: flex;
    gap: 24px;
    padding-top: 16px;
    padding-bottom: 32px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    position: relative;
    left: -20px;
    justify-content: center;

    &:before {
      content: '';
      display: block;
      width: 1px;
    }

    .tuile-niveau {
      scroll-snap-align: center;

      border: 1px solid #dddddd;
      border-radius: 8px;
      padding: 16px;
      flex: 0 0 214px;
      width: 214px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      font-weight: bold;
      gap: 8px;
      position: relative;
      justify-content: space-between;
      background: white;

      .plante {
        z-index: 2;
      }

      span {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }

      &:before {
        content: '';
        position: absolute;
        z-index: 0;
        bottom: 39px;
        border: 2px solid #0d0c21;
        left: 0;
        right: 0;
      }
    }
  }
</style>