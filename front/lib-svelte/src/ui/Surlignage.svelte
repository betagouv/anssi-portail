<script lang="ts">
  let { children } = $props();
</script>

<span>
  {@render children()}
</span>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  span {
    position: relative;
    z-index: 10;

    @include a-partir-de(md) {
      &:after {
        background: url('/assets/images/surligne-gauche-droite-vert-clair.svg') no-repeat;
        content: '';
        width: 100%;
        height: 100%;
        top: 70%;
        right: 0;
        position: absolute;
        z-index: -1;
      }
    }
  }
</style>
