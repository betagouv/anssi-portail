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
  id="picto-annuaire"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Annuaire</title>
  <desc id="picto-desc"
    >Au survol, la flèche du dossier effectue un tour complet et les trois profils se rétractent puis retrouvent leur
    taille et les traits décoratifs se redessinent en 828 ms.</desc
  >

  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />
  <g id="artwork" transform="translate(95 34)">
    <g id="file">
      <g id="file_2">
        <path
          id="vector"
          d="M14.2555 13.2361C14.1178 11.4916 15.4963 10 17.2462 10H74.7538C76.5037 10 77.8822 11.4916 77.7445 13.2361L75.2182 45.2361C75.095 46.7965 73.7928 48 72.2275 48H19.7725C18.2072 48 16.905 46.7965 16.7818 45.2361L14.2555 13.2361Z"
          fill="#8585F6"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="vector_2"
          d="M18 4V10H74V9C74 6.79086 72.2091 5 70 5H40.6926C39.0664 5 37.604 4.00991 37 2.5C36.396 0.990086 34.9336 0 33.3074 0H22C19.7909 0 18 1.79086 18 4Z"
          fill="#000091"
        />
      </g>
      <g id="feature-anchor" transform="translate(46 29)">
        <g id="feature">
          <g transform="translate(-46 -29)">
            <g id="arrow">
              <path id="Vector" d="M54 18V25H47" stroke="#000091" stroke-width="3" />
              <path
                id="Ellipse 297"
                d="M55 29C55 33.9706 50.9706 38 46 38C41.0294 38 37 33.9706 37 29C37 24.0294 41.0294 20 46 20C49.5337 20 52.5918 22.0366 54.0645 25"
                stroke="#000091"
                stroke-width="3"
              />
            </g>
          </g>
        </g>
      </g>
      <g id="links">
        <path
          id="link-center"
          d="M46 63L46 49"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="link-left"
          d="M13 63C13 58.5817 16.5817 55 21 55H39C42.866 55 46 51.866 46 48"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="link-right"
          d="M79 63C79 58.5817 75.4183 55 71 55H53C49.134 55 46 51.866 46 48"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <g transform="translate(46 76)">
        <g class="annuaire-user annuaire-user-center">
          <g transform="translate(-46 -76)">
            <g id="user02">
              <path
                id="Vector_2"
                d="M46 90C53.732 90 60 83.732 60 76C60 68.268 53.732 62 46 62C38.268 62 32 68.268 32 76C32 83.732 38.268 90 46 90Z"
                fill="#E3E3FD"
              />
              <path
                id="Vector_3"
                d="M46 81C49.3137 81 52 78.3137 52 75C52 71.6863 49.3137 69 46 69C42.6863 69 40 71.6863 40 75C40 78.3137 42.6863 81 46 81Z"
                fill="white"
              />
              <path
                id="Vector_4"
                d="M55.8794 85.697C53.4044 88.352 49.8944 90.002 45.9944 90.002C42.0944 90.002 38.5844 88.352 36.1094 85.697C38.4494 82.832 42.0044 81.002 45.9944 81.002C49.9844 81.002 53.5394 82.832 55.8794 85.697Z"
                fill="white"
              />
              <path
                id="Vector_5"
                d="M60 76C60 79.6711 58.5689 83.0467 56.2511 85.5356C53.6844 88.2889 50.0444 90 46 90C41.9556 90 38.3156 88.2889 35.7489 85.5356C33.4311 83.0467 32 79.6711 32 76C32 68.2689 38.2689 62 46 62C53.7311 62 60 68.2689 60 76Z"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_6"
                d="M46 81.002C49.3137 81.002 52 78.3157 52 75.002C52 71.6882 49.3137 69.002 46 69.002C42.6863 69.002 40 71.6882 40 75.002C40 78.3157 42.6863 81.002 46 81.002Z"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_7"
                d="M36.3203 85.907C38.4953 82.937 42.0203 81.002 45.9953 81.002C49.9703 81.002 53.4953 82.937 55.6703 85.907"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
        </g>
      </g>
      <g transform="translate(79 75)">
        <g class="annuaire-user annuaire-user-right">
          <g transform="translate(-79 -75)">
            <g id="user02_2">
              <path
                id="Vector_8"
                d="M79 87.002C85.6274 87.002 91 81.6294 91 75.002C91 68.3745 85.6274 63.002 79 63.002C72.3726 63.002 67 68.3745 67 75.002C67 81.6294 72.3726 87.002 79 87.002Z"
                fill="#E3E3FD"
              />
              <path
                id="Vector_9"
                d="M79 81C82.3137 81 85 78.3137 85 75C85 71.6863 82.3137 69 79 69C75.6863 69 73 71.6863 73 75C73 78.3137 75.6863 81 79 81Z"
                fill="white"
              />
              <path
                id="Vector_10"
                d="M87.0658 83.882C84.9358 85.817 82.1008 87.002 78.9958 87.002C75.8908 87.002 73.0558 85.817 70.9258 83.882C73.1308 82.082 75.9358 81.002 78.9958 81.002C82.0558 81.002 84.8608 82.082 87.0658 83.882Z"
                fill="white"
              />
              <path
                id="Vector_11"
                d="M91 75.002C91 78.527 89.485 81.692 87.07 83.882C84.94 85.817 82.105 87.002 79 87.002C75.895 87.002 73.06 85.817 70.93 83.882C68.515 81.692 67 78.527 67 75.002C67 68.372 72.37 63.002 79 63.002C85.63 63.002 91 68.372 91 75.002Z"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_12"
                d="M79 81.002C82.3137 81.002 85 78.3157 85 75.002C85 71.6882 82.3137 69.002 79 69.002C75.6863 69.002 73 71.6882 73 75.002C73 78.3157 75.6863 81.002 79 81.002Z"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_13"
                d="M71.0664 84.002C73.1814 82.142 75.9564 81.002 79.0014 81.002C82.0464 81.002 84.8214 82.142 86.9364 84.002"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
        </g>
      </g>
      <g transform="translate(13 75)">
        <g class="annuaire-user annuaire-user-left">
          <g transform="translate(-13 -75)">
            <g id="user01">
              <path
                id="Vector_14"
                d="M13 87.002C19.6274 87.002 25 81.6294 25 75.002C25 68.3745 19.6274 63.002 13 63.002C6.37258 63.002 1 68.3745 1 75.002C1 81.6294 6.37258 87.002 13 87.002Z"
                fill="#E3E3FD"
              />
              <path
                id="Vector_15"
                d="M21.0658 83.882C18.9358 85.817 16.1008 87.002 12.9958 87.002C9.89078 87.002 7.05578 85.817 4.92578 83.882C7.13078 82.082 9.93578 81.002 12.9958 81.002C16.0558 81.002 18.8608 82.082 21.0658 83.882Z"
                fill="white"
              />
              <path
                id="Vector_16"
                d="M13 81C16.3137 81 19 78.3137 19 75C19 71.6863 16.3137 69 13 69C9.68629 69 7 71.6863 7 75C7 78.3137 9.68629 81 13 81Z"
                fill="white"
              />
              <path
                id="Vector_17"
                d="M13 87C19.6274 87 25 81.6274 25 75C25 68.3726 19.6274 63 13 63C6.37258 63 1 68.3726 1 75C1 81.6274 6.37258 87 13 87Z"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_18"
                d="M13 81.002C16.3137 81.002 19 78.3157 19 75.002C19 71.6882 16.3137 69.002 13 69.002C9.68629 69.002 7 71.6882 7 75.002C7 78.3157 9.68629 81.002 13 81.002Z"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_19"
                d="M5.06641 84.002C7.18141 82.142 9.95641 81.002 13.0014 81.002C16.0464 81.002 18.8214 82.142 20.9364 84.002"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
        </g>
      </g>
      <path
        id="trace"
        d="M11.4092 6.00195C9.13224 7.94014 7.77408 10.8884 8.03101 14.1028L8.74397 23.022"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace draw-reverse"
      />
      <path
        id="trace_2"
        d="M83.0001 25.9258L81.7151 42.0014"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace"
      />
    </g>
  </g>
</svg>

<style lang="scss">
  #picto-annuaire {
    width: 100%;
    flex: 1;
    cursor: pointer;

    #feature {
      -webkit-transform: none;
      transform: none;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      transform-box: view-box;
      -webkit-transition: -webkit-transform 828ms cubic-bezier(0.25, 1.28, 0.55, 1);
      transition: transform 828ms cubic-bezier(0.25, 1.28, 0.55, 1);
    }

    &:hover,
    &.animée {
      #feature {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }

      .annuaire-user {
        -webkit-animation: feature-shrink-return 414ms ease-out 0ms 1 both;
        animation: feature-shrink-return 414ms ease-out 0ms 1 both;
      }

      .annuaire-user-center {
        -webkit-animation-delay: 92ms;
        animation-delay: 92ms;
      }

      .annuaire-user-right {
        -webkit-animation-delay: 184ms;
        animation-delay: 184ms;
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

    .annuaire-user {
      -webkit-transform: none;
      transform: none;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      transform-box: view-box;
    }

    .draw-trace {
      stroke-dasharray: 1 1;
      stroke-dashoffset: 0;
    }

    @-webkit-keyframes feature-shrink-return {
      0% {
        -webkit-transform: scale(1);
        transform: scale(1);
      }

      25% {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
      }

      100% {
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }

    @keyframes feature-shrink-return {
      0% {
        -webkit-transform: scale(1);
        transform: scale(1);
      }

      25% {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
      }

      100% {
        -webkit-transform: scale(1);
        transform: scale(1);
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
      }

      &:hover .draw-trace,
      &.animée .draw-trace {
        -webkit-animation: none;
        animation: none;
      }

      .annuaire-user,
      &:hover .annuaire-user,
      &.animée .annuaire-user {
        -webkit-animation: none;
        animation: none;
        -webkit-transform: none;
        transform: none;
      }
    }
  }
</style>
