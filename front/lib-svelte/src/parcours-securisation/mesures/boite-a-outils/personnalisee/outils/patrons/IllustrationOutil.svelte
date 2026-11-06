<script lang="ts">
  const { illustration }: { illustration: string } = $props();
</script>

<div class="illustration">
  <img src={illustration} alt="" />
</div>

<style lang="scss">
  .illustration {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 9;
    background-color: #f7f9fd;
    background-image: url('/assets/images/parcours-securisation/outils/points-outil.avif');
    background-size: 98% 41%;
    background-position: center 98%;
    background-repeat: no-repeat;

    img {
      max-width: 90px;
      max-height: 64px;
      object-fit: contain;
    }
  }
</style>
