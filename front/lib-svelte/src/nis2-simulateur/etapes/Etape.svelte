<script lang="ts">
  let { children } = $props();
</script>

<div class="etape">
  {@render children()}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  .etape {
    box-sizing: border-box;
    background: #f6f6f6;
    padding: 40px taille-pour-colonnes(1);
    margin: 40px auto;

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }
  }
</style>
