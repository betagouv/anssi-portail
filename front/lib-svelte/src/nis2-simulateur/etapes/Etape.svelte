<script lang="ts">
  import { quiScroll } from '../../ui/quiScroll.attachment';

  let { children } = $props();
</script>

<div class="etape" {@attach quiScroll}>
  {@render children()}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  .etape {
    box-sizing: border-box;
    background-color: var(--background-alt-grey);
    padding: 40px taille-pour-colonnes(1);
    margin: 40px auto;

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }
  }
</style>
