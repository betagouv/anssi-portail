<script lang="ts">
  type Icone = 'check' | 'fleche-gauche';

  const srcDesIcones: Record<Icone, string> = {
    'fleche-gauche': '/assets/icones/icone-fleche-gauche.svg',
    check: '/assets/icones/icone-check-line.svg',
  };

  export let type: Icone;

</script>

<img src={srcDesIcones[type]} alt="" />

<style lang="scss">
  .icone {
    display: inline-block;
    width: 1rem;
    height: 1rem;
  }
</style>
