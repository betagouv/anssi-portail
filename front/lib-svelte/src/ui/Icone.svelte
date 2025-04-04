<script lang="ts">
  type Icone = 'check' | 'fleche-gauche';
  export let type: Icone;
</script>

<i class={`icone ${type}`}></i>

<style lang="scss">
  .icone {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: currentColor;
    font-weight: inherit;

    mask-size: cover;
    mask-repeat: no-repeat;
    -webkit-mask-size: cover;
    -webkit-mask-repeat: no-repeat;
    -webkit-font-smoothing: antialiased;
  }

  $icons: (
    'fleche-gauche': '/assets/icones/icone-fleche-gauche.svg',
    'check': '/assets/icones/icone-check-line.svg',
  );

  @each $name, $path in $icons {
    .icone.#{$name} {
      mask-image: url(#{$path});
      -webkit-mask-image: url(#{$path});
    }
  }
</style>
