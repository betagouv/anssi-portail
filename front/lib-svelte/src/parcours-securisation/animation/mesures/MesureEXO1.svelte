<script lang="ts">
  import { détecteRendu } from '../../../utils/rendu.svelte';
  import { suitLaVisibilité } from '../../../utils/visibilite.svelte';

  const { survol }: { survol?: boolean } = $props();

  const rendu = détecteRendu();
  let conteneur = $state<SVGSVGElement>();
  const àLÉcran = suitLaVisibilité(() => conteneur);

  const animée = $derived(survol || (rendu.estMobile && àLÉcran.visible));
</script>

<svg
  bind:this={conteneur}
  xmlns="http://www.w3.org/2000/svg"
  id="picto-crise"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Crise</title>
  <desc id="picto-desc"
    >Au survol, l'alerte se contracte puis s'agrandit nettement, tandis que la tête se soulève légèrement avant de
    revenir à sa position initiale et les traits décoratifs se redessinent en 828 ms.</desc
  >

  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />

  <g id="artwork" transform="translate(95 33.5)">
    <g id="hacker">
      <g id="hacker_2">
        <g id="body">
          <g id="Vector">
            <path
              d="M67.9066 39.998C71.8074 39.998 69.4969 39.998 69.962 40.0281C78.0187 40.4332 84.6651 46.5551 86.2255 54.4776L90.7864 77.4948C92.0317 83.1515 87.7258 87.983 81.8745 87.998H10.1294C4.27813 87.998 -0.0277768 83.1515 1.21749 77.4948L5.77845 54.4776C7.35378 46.5551 13.9852 40.4332 22.0419 40.0281C22.522 39.998 23.0021 39.998 23.4972 39.998"
              fill="#8585F6"
            />
            <path
              d="M67.9066 39.998C71.8074 39.998 69.4969 39.998 69.962 40.0281C78.0187 40.4332 84.6651 46.5551 86.2255 54.4776L90.7864 77.4948C92.0317 83.1515 87.7258 87.983 81.8745 87.998H10.1294C4.27813 87.998 -0.0277768 83.1515 1.21749 77.4948L5.77845 54.4776C7.35378 46.5551 13.9852 40.4332 22.0419 40.0281C22.522 39.998 23.0021 39.998 23.4972 39.998H67.9066Z"
              stroke="#000091"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <path
            id="Vector_2"
            d="M17.5041 71.496L12.2544 69.9961"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_3"
            d="M74.5012 71.496L79.7509 69.996"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>

        <g id="head-motion-anchor" transform="translate(46.002 53)">
          <g id="head-motion">
            <g transform="translate(-46.002 -53)">
              <g id="head">
                <g id="Vector_4">
                  <path
                    d="M26.8648 45.9977C26.8648 45.9977 9.40571 18.0241 40.6641 2.25993C44.0089 0.580022 47.9987 0.580022 51.3285 2.25993C82.5869 18.0091 65.1278 45.9977 65.1278 45.9977"
                    fill="#8585F6"
                  />
                  <path
                    d="M26.8648 45.9977C26.8648 45.9977 9.40571 18.0241 40.6641 2.25993C44.0089 0.580022 47.9987 0.580022 51.3285 2.25993C82.5869 18.0091 65.1278 45.9977 65.1278 45.9977"
                    stroke="#000091"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <path id="shadow" d="M46.002 59L33.002 35L59.002 35L46.002 59Z" fill="#000091" />
                <circle
                  id="face"
                  cx="46.002"
                  cy="28"
                  r="17"
                  fill="#E3E3FD"
                  stroke="#000091"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  id="mask"
                  d="M46.0031 8C62.2022 8 68.3537 19.6471 67.9865 26H65.002C65.002 26 63.502 21 46.0031 21C28.5043 21 27.002 26 27.002 26H24.0174C23.6502 19.6471 29.804 8 46.0031 8Z"
                  fill="#8585F6"
                />
                <path
                  id="Vector_5"
                  d="M65.1509 34.9998C65.1509 34.9998 67.0658 30.1902 65.1509 26.075C62.002 19.3095 30.002 19.3078 26.853 26.0749C24.9381 30.19 26.853 35 26.853 35"
                  stroke="#000091"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </g>
          </g>
        </g>
      </g>

      <g id="laptop">
        <path
          id="Vector_6"
          d="M18.7838 88.2342C18.9069 89.7946 20.2092 90.998 21.7744 90.998H70.2295C71.7948 90.998 73.097 89.7946 73.2202 88.2342L75.7465 56.2342C75.8842 54.4897 74.5057 52.998 72.7558 52.998H19.2481C17.4982 52.998 16.1197 54.4897 16.2574 56.2342L18.7838 88.2342Z"
          fill="white"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g id="feature-anchor" transform="translate(46 72)">
          <g id="feature">
            <g transform="translate(-46 -72)">
              <g id="alert">
                <g id="Vector_7">
                  <path d="M43.002 77.998H49.002V83.998H43.002V77.998Z" fill="#000091" />
                  <path d="M49.002 59.998V73.998H43.002V59.998H49.002Z" fill="#000091" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      <path
        id="trace"
        d="M91.0049 49.4174C88.995 44.0627 85.2152 39.6979 80.4304 36.998"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace draw-reverse"
      />
      <path
        id="trace_2"
        d="M27.3178 4C22.2781 8.46977 18.8882 13.7495 17.1933 19.7642C16.6983 21.5341 16.3834 23.289 16.2034 24.9989"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace draw-reverse"
      />
    </g>
  </g>
</svg>

<style lang="scss">
  #picto-crise {
    width: 100%;
    flex: 1;
    cursor: pointer;

    #feature {
      -webkit-transform: none;
      transform: none;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      transform-box: view-box;
      -webkit-transition: none;
      transition: none;
    }

    #head-motion {
      -webkit-transform: none;
      transform: none;
      transform-box: view-box;
    }

    .draw-trace {
      stroke-dasharray: 1 1;
      stroke-dashoffset: 0;
    }

    &:hover,
    &.animée {
      #feature {
        -webkit-animation: crisis-alert-pulse 828ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
        animation: crisis-alert-pulse 828ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
      }

      #head-motion {
        -webkit-animation: crisis-head-lift 747ms cubic-bezier(0.4, 0, 0.2, 1) 81ms 1 both;
        animation: crisis-head-lift 747ms cubic-bezier(0.4, 0, 0.2, 1) 81ms 1 both;
      }

      .draw-trace {
        -webkit-animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }

      .draw-reverse {
        -webkit-animation: trace-draw-reverse 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw-reverse 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }
    }

    @-webkit-keyframes crisis-alert-pulse {
      0%,
      100% {
        -webkit-transform: scale(1);
        transform: scale(1);
      }

      18% {
        -webkit-transform: scale(0.82);
        transform: scale(0.82);
      }

      52% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
      }
    }

    @keyframes crisis-alert-pulse {
      0%,
      100% {
        -webkit-transform: scale(1);
        transform: scale(1);
      }

      18% {
        -webkit-transform: scale(0.82);
        transform: scale(0.82);
      }

      52% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
      }
    }

    @-webkit-keyframes crisis-head-lift {
      0%,
      100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
      }

      48% {
        -webkit-transform: translateY(-2px);
        transform: translateY(-2px);
      }
    }

    @keyframes crisis-head-lift {
      0%,
      100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
      }

      48% {
        -webkit-transform: translateY(-2px);
        transform: translateY(-2px);
      }
    }

    @-webkit-keyframes trace-draw {
      from {
        stroke-dashoffset: 1;
      }

      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes trace-draw {
      from {
        stroke-dashoffset: 1;
      }

      to {
        stroke-dashoffset: 0;
      }
    }

    @-webkit-keyframes trace-draw-reverse {
      from {
        stroke-dashoffset: -1;
      }

      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes trace-draw-reverse {
      from {
        stroke-dashoffset: -1;
      }

      to {
        stroke-dashoffset: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #feature,
      &:hover #feature,
      &.animée #feature {
        -webkit-transition: none;
        transition: none;
        -webkit-transform: none;
        transform: none;
        -webkit-animation: none;
        animation: none;
      }

      #head-motion,
      &:hover #head-motion,
      &.animée #head-motion {
        -webkit-animation: none;
        animation: none;
        -webkit-transform: none;
        transform: none;
      }

      &:hover .draw-trace,
      &.animée .draw-trace {
        -webkit-animation: none;
        animation: none;
      }
    }
  }
</style>
