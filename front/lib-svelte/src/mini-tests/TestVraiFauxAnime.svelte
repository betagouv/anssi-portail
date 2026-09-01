<script lang="ts">
  const { survol = $bindable() }: { survol?: boolean } = $props();
</script>

<div>
  <svg
    width="192"
    height="128"
    viewBox="0 0 192 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="cartes"
    class:survol
  >
    <rect
      class="carte-gauche"
      x="34"
      y="38"
      width="48"
      height="58"
      rx="6"
      fill="#E3E3FD"
      stroke="#000091"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      class="croix-gauche-1"
      d="M50 57.7727L66 73.5909"
      stroke="#000091"
      stroke-width="4"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <path
      class="croix-gauche-2"
      d="M66 57.7727L50 73.5909"
      stroke="#000091"
      stroke-width="4"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <rect
      class="carte-droite"
      x="109"
      y="38"
      width="48"
      height="58"
      rx="6"
      fill="#8585F6"
      stroke="#000091"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      class="check-droite"
      d="M124 66.7143L130.788 74.3333L142.667 61"
      stroke="#000091"
      stroke-width="4"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- CARTE CENTRALE -->
    <rect
      class="carte-centre"
      x="59"
      y="21"
      width="74"
      height="92"
      rx="6"
      fill="white"
      stroke="#000091"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      class="ligne-1"
      d="M75 53H117"
      stroke="#000091"
      stroke-width="6"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <path
      class="ligne-2"
      d="M75 67L117 66.9998"
      stroke="#000091"
      stroke-width="6"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <path
      class="ligne-3"
      d="M75 81H99"
      stroke="#000091"
      stroke-width="6"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <path
      class="accent"
      d="M125 15H127.8C133.986 15 139 20.0144 139 26.2V29"
      stroke="#6A6AF4"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>

<style lang="scss">
  .cartes {
    width: 192px;
    height: 128px;
    overflow: visible;

    /*
     * Même effet ressort que pour la plante.
     *
     * Le 1.56 sur le deuxième coefficient provoque
     * un léger dépassement de la position finale,
     * puis un retour.
     */
    $spring: cubic-bezier(0.34, 1.56, 0.64, 1);

    .carte-gauche {
      transition:
        x 700ms $spring,
        y 700ms $spring,
        transform 700ms $spring;
      transform-origin: center;
    }

    .croix-gauche-1 {
      transition: d 700ms $spring;
    }

    .croix-gauche-2 {
      transition: d 700ms $spring;
    }

    .carte-droite {
      transition:
        x 700ms $spring,
        y 700ms $spring,
        transform 700ms $spring;
      transform-origin: center;
    }

    .check-droite {
      transition: d 700ms $spring;
    }

    .carte-centre {
      transition:
        x 700ms $spring,
        y 700ms $spring,
        width 700ms $spring,
        height 700ms $spring;
    }

    .ligne-1,
    .ligne-2,
    .ligne-3 {
      transition: d 700ms $spring;
    }

    .accent {
      transition: d 700ms $spring;
    }

    &:hover,
    &.survol {
      .carte-gauche {
        x: 12px;
        y: 43.0173px;
        transform: rotate(-6deg);
        transform-origin: 36px 72px;
      }

      .croix-gauche-1 {
        d: path('M30.0029 61.2354L47.5877 75.4752');
      }

      .croix-gauche-2 {
        d: path('M45.915 59.563L31.6751 77.1478');
      }

      .carte-droite {
        x: 132.062px;
        y: 38px;
        transform: rotate(6deg);
        transform-origin: 156px 67px;
      }

      .check-droite {
        d: path('M143.682 67.7584L149.637 76.0453L162.844 64.0266');
      }

      .carte-centre {
        x: 53px;
        y: 15px;
        width: 86px;
        height: 104px;
      }

      .ligne-1 {
        d: path('M71.6665 49.3335H119.667');
      }

      .ligne-2 {
        d: path('M71.6665 65.3337L119.667 65.3336');
      }

      .ligne-3 {
        d: path('M71.6665 81.3335H101');
      }

      .accent {
        d: path('M130.516 8.66675H133.316C139.501 8.66675 144.516 13.6812 144.516 19.8667V22.6667');
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cartes * {
      transition: none !important;
    }
  }
</style>
