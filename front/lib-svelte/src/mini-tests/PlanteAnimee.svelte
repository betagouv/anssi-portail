<script lang="ts">
  const { survol }: { survol?: boolean } = $props();
</script>

<div>
  <svg
    id="maturite-animation"
    xmlns="http://www.w3.org/2000/svg"
    width="192"
    height="128"
    viewBox="0 0 192 128"
    fill="none"
    role="img"
    aria-labelledby="title description"
    class:survol
  >
    <title id="title">Illustration interactive de maturité</title>
    <desc id="description">La plante grandit avec un léger rebond lorsque le pointeur la survole.</desc>

    <g id="pictogramme-maturite">
      <circle
        id="terre"
        cx="96"
        cy="90"
        r="17"
        fill="#000091"
        stroke="#000091"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        id="tige"
        d="M96 60L96 74"
        stroke="#000091"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />

      <g id="feuille-droite">
        <path
          id="feuille-droite-fond"
          d="M119 57.2116C119 57.2116 117.671 64.1098 112.7 67.0074C107.729 69.905 101 68.7885 101 68.7885C101 68.7885 102.329 61.8902 107.3 58.9926C112.271 56.095 119 57.2116 119 57.2116Z"
          fill="#8585F6"
        />
        <path
          id="feuille-droite-contour"
          d="M101 68.7885C101 68.7885 107.729 69.905 112.7 67.0074C117.671 64.1098 119 57.2116 119 57.2116C119 57.2116 112.271 56.095 107.3 58.9926C102.329 61.8902 101 68.7885 101 68.7885ZM101 68.7885L112.7 61.6643"
          stroke="#000091"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </g>

      <g id="feuille-gauche">
        <path
          id="feuille-gauche-fond"
          d="M73 57.2115C73 57.2115 74.3294 64.1098 79.3 67.0074C84.2706 69.905 91 68.7885 91 68.7885C91 68.7885 89.6706 61.8902 84.7 58.9926C79.7294 56.095 73 57.2115 73 57.2115Z"
          fill="#8585F6"
        />
        <path
          id="feuille-gauche-contour"
          d="M91 68.7885C91 68.7885 84.2706 69.905 79.3 67.0074C74.3294 64.1098 73 57.2115 73 57.2115C73 57.2115 79.7294 56.095 84.7 58.9926C89.6706 61.8902 91 68.7885 91 68.7885ZM91 68.7885L79.3 61.6642"
          stroke="#000091"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </g>

      <g id="feuille-haute">
        <path
          id="feuille-haute-fond"
          d="M96 45C96 45 100 48.2941 100 53C100 57.7059 96 61 96 61C96 61 92 57.7059 92 53C92 48.2941 96 45 96 45Z"
          fill="#8585F6"
        />
        <path
          id="feuille-haute-contour"
          d="M96 51.6667L96 60.3334M96 45C96 45 100 48.2941 100 53C100 57.7059 96 61 96 61C96 61 92 57.7059 92 53C92 48.2941 96 45 96 45Z"
          stroke="#000091"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </g>

      <g id="pot">
        <path
          id="pot-corps"
          d="M69.2997 79.6175C69.1369 76.5647 71.5683 74 74.6255 74H117.374C120.432 74 122.863 76.5647 122.7 79.6175L120.815 114.951C120.664 117.782 118.324 120 115.489 120H76.5109C73.6758 120 71.3362 117.782 71.1851 114.951L69.2997 79.6175Z"
          fill="#E3E3FD"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect
          id="pot-bord"
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
      </g>

      <path
        id="accent"
        d="M87 53C87 49.6842 88.5439 46.8941 90 45"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </g>
  </svg>
</div>

<style lang="scss">
  #maturite-animation {
    cursor: pointer;

    #terre,
    #tige,
    #feuille-droite,
    #feuille-gauche,
    #feuille-haute,
    #accent {
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      transform-box: view-box;
      -webkit-transition: -webkit-transform 800ms cubic-bezier(0.34, 1.3, 0.64, 1);
      transition: transform 800ms cubic-bezier(0.34, 1.3, 0.64, 1);
    }

    &:hover,
    &.survol {
      #terre {
        -webkit-transform: matrix(1, 0, 0, 1, 0, -4);
        transform: matrix(1, 0, 0, 1, 0, -4);
      }

      #tige {
        -webkit-transform: matrix(1, 0, 0, 2.5, 0, -111);
        transform: matrix(1, 0, 0, 2.5, 0, -111);
      }

      #feuille-droite {
        -webkit-transform: matrix(2, 0, 0, 2, -101, -78);
        transform: matrix(2, 0, 0, 2, -101, -78);
        -webkit-transition-delay: 60ms;
        transition-delay: 60ms;
      }

      #feuille-gauche {
        -webkit-transform: matrix(2, 0, 0, 2, -91, -78);
        transform: matrix(2, 0, 0, 2, -91, -78);
        -webkit-transition-delay: 120ms;
        transition-delay: 120ms;
      }

      #feuille-haute {
        -webkit-transform: matrix(2.25, 0, 0, 2.125, -120, -88.625);
        transform: matrix(2.25, 0, 0, 2.125, -120, -88.625);
      }

      #accent {
        -webkit-transform: matrix(2, 0, 0, 2, -92, -83);
        transform: matrix(2, 0, 0, 2, -92, -83);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition-duration: 1ms !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  }
</style>
