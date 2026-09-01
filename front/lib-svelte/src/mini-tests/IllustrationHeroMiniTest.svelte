<script lang="ts">
  type Props = {
    large?: boolean;
  };
  const { large }: Props = $props();
</script>

<div class="composition" class:large>
  <img
    class="illustration"
    src="/assets/images/groupe-regardant-test-maturite.avif"
    alt="Groupe regardant la présentation du test maturité"
  />

  <div class="manette">
    <lab-anssi-icone nom="gamepad-fill" taille="lg"></lab-anssi-icone>
  </div>
  <div class="plante">
    <lab-anssi-icone nom="plant-fill" taille="lg"></lab-anssi-icone>
  </div>
  <img class="boucle" src="/assets/images/decorations/boucle.svg" alt="" />
  <img class="ellipse" src="/assets/images/decorations/ellipse.svg" alt="" />
</div>

<style lang="scss">
  .composition {
    aspect-ratio: 4 / 3;
    display: grid;
    place-items: center;
    position: relative;

    > .illustration {
      border-radius: 12px;
      height: 100%;
      width: 70%;
      object-fit: cover;
    }

    &.large {
      aspect-ratio: 70 / 39;

      .manette,
      .boucle,
      .ellipse {
        transform: scale(90%);
      }

      .manette {
        right: 50px;
      }
    }

    .manette {
      position: absolute;
      right: 12%;
      top: 4%;
      padding: 1rem;
      border-radius: 999px;
      background-color: var(--background-default-grey);
      color: var(--text-title-blue-france);
      box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    }

    .plante {
      position: absolute;
      left: 10%;
      bottom: 10%;
      padding: 1rem;
      border-radius: 999px;
      background-color: var(--background-default-grey);
      color: var(--text-title-blue-france);
      box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    }

    .boucle {
      top: 25%;
      color: var(--text-title-blue-france);
      position: absolute;
      left: 6%;
      width: 30%;
      transform: rotate(70deg);
    }

    .ellipse {
      top: calc(25% + 100px);
      position: absolute;
      left: 8%;
      width: 15px;
    }
  }
</style>
