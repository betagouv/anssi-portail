<script lang="ts">
  const { survol }: { survol?: boolean } = $props();
</script>

<div>
  <svg
    width="192"
    height="128"
    viewBox="0 0 192 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="plante"
    class:survol
  >
    <circle
      class="racines"
      cx="96"
      cy="91"
      r="17"
      fill="#000091"
      stroke="#000091"
      stroke-width="2.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      class="tige"
      d="M96 71L96 75"
      stroke="#000091"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <path
      class="feuille-droite-remplissage"
      d="M115.167 75.1763C115.167 75.1763 114.12 80.9248 110.208 83.3395C106.296 85.7542 101 84.8237 101 84.8237C101 84.8237 102.046 79.0752 105.958 76.6605C109.87 74.2458 115.167 75.1763 115.167 75.1763Z"
      fill="#8585F6"
    />

    <path
      class="feuille-droite-contour"
      d="M101 84.8237C101 84.8237 106.296 85.7542 110.208 83.3395C114.12 80.9248 115.167 75.1763 115.167 75.1763C115.167 75.1763 109.87 74.2458 105.958 76.6605C102.046 79.0752 101 84.8237 101 84.8237ZM101 84.8237L110.208 78.8869"
      stroke="#000091"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <path
      class="feuille-gauche-remplissage"
      d="M75.9998 75.1763C75.9998 75.1763 77.0462 80.9248 80.9582 83.3395C84.8702 85.7542 90.1665 84.8237 90.1665 84.8237C90.1665 84.8237 89.1202 79.0752 85.2082 76.6605C81.2962 74.2458 75.9998 75.1763 75.9998 75.1763Z"
      fill="#8585F6"
    />

    <path
      class="feuille-gauche-contour"
      d="M90.1665 84.8237C90.1665 84.8237 84.8702 85.7542 80.9582 83.3395C77.0462 80.9248 75.9998 75.1763 75.9998 75.1763C75.9998 75.1763 81.2962 74.2458 85.2082 76.6605C89.1202 79.0752 90.1665 84.8237 90.1665 84.8237ZM90.1665 84.8237L80.9582 78.8869"
      stroke="#000091"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />

    <!-- POT-->
    <path
      d="M69.2997 79.6175C69.1369 76.5647 71.5683 74 74.6255 74H117.374C120.432 74 122.863 76.5647 122.7 79.6175L120.815 114.951C120.664 117.782 118.324 120 115.489 120H76.5109C73.6758 120 71.3362 117.782 71.1851 114.951L69.2997 79.6175Z"
      fill="#E3E3FD"
      stroke="#000091"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <rect
      x="65"
      y="74"
      width="62"
      height="14"
      rx="7"
      fill="#E3E3FD"
      stroke="#000091"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- FLEUR-->

    <path
      class="fleur-remplissage"
      d="M96.0001 52C96.0001 52 101.03 55.9118 101.03 61.5C101.03 67.0882 96.0001 71 96.0001 71C96.0001 71 90.9707 67.0882 90.9707 61.5C90.9707 55.9118 96.0001 52 96.0001 52Z"
      fill="#8585F6"
    />

    <path
      class="fleur-contour"
      d="M96.0001 59.9167L96.0001 70.2084M96.0001 52C96.0001 52 101.03 55.9118 101.03 61.5C101.03 67.0882 96.0001 71 96.0001 71C96.0001 71 90.9707 67.0882 90.9707 61.5C90.9707 55.9118 96.0001 52 96.0001 52Z"
      stroke="#000091"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      class="fleur-surlignage"
      d="M86 63C86 58.4408 87.5439 54.6043 89 52"
      stroke="#6A6AF4"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>

<style lang="scss">
  .plante {
    /*
     * La fonction de timing est volontairement "overshoot".
     *
     * Elle dépasse légèrement la valeur finale puis revient.
     * C'est ce qui donne l'effet ressort.
    */

    width: 192px;
    height: 128px;
    overflow: visible;

    .racines {
      cx: 96px;
      cy: 91px;

      /*
       * Le ressort est légèrement plus marqué
       * sur le cercle pour rendre le mouvement visible.
       */
      transition: cy 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .tige {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .feuille-droite-remplissage {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .feuille-droite-contour {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .feuille-gauche-remplissage {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .feuille-gauche-contour {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .fleur-remplissage {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .fleur-contour {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .fleur-surlignage {
      transition: d 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &:hover,
    &.survol {
      .racines {
        cy: 86px;
      }

      .tige {
        d: path('M96 39L96 70');
      }

      .feuille-droite-remplissage {
        d: path(
          'M135 36.423C135 36.423 132.489 50.2196 123.1 56.0148C113.711 61.81 101 59.577 101 59.577C101 59.577 103.511 45.7804 112.9 39.9851C122.289 34.1899 135 36.423 135 36.423Z'
        );
      }

      .feuille-droite-contour {
        d: path(
          'M101 59.577C101 59.577 113.711 61.81 123.1 56.0148C132.489 50.2196 135 36.423 135 36.423C135 36.423 122.289 34.1899 112.9 39.9851C103.511 45.7804 101 59.577 101 59.577ZM101 59.577L123.1 45.3285'
        );
      }

      .feuille-gauche-remplissage {
        d: path(
          'M57 36.423C57 36.423 59.5112 50.2196 68.9 56.0148C78.2888 61.81 91 59.577 91 59.577C91 59.577 88.4888 45.7804 79.1 39.9851C69.7112 34.1899 57 36.423 57 36.423Z'
        );
      }

      .feuille-gauche-contour {
        d: path(
          'M91 59.577C91 59.577 78.2888 61.81 68.9 56.0148C59.5112 50.2196 57 36.423 57 36.423C57 36.423 69.7112 34.1899 79.1 39.9851C88.4888 45.7804 91 59.577 91 59.577ZM91 59.577L68.9 45.3285'
        );
      }

      .fleur-remplissage {
        d: path('M95.9999 7C95.9999 7 105 14 105 24C105 34 96 41 96 41C96 41 87 34 87 24C87 14 95.9999 7 95.9999 7Z');
      }

      .fleur-contour {
        d: path(
          'M96 21.1667L96 39.5834M95.9999 7C95.9999 7 105 14 105 24C105 34 96 41 96 41C96 41 87 34 87 24C87 14 95.9999 7 95.9999 7Z'
        );
      }

      .fleur-surlignage {
        d: path('M82 23C82 16.3684 85.0879 10.7881 88 7');
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .plante * {
      transition: none !important;
    }
  }
</style>
