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
  id="picto-mdp-robuste"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Mot de passe robuste</title>
  <desc id="picto-desc"
    >Au survol, l'aiguille balaie la jauge depuis la gauche jusqu'à sa position Figma et les quatre points grandissent
    successivement depuis leur centre et les traits décoratifs se redessinent en 828 ms.</desc
  >

  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />
  <g id="artwork" transform="translate(95 33.5)">
    <g id="compteur">
      <g id="password">
        <path
          id="Vector"
          d="M77.4968 63.998H14.4994C7.0439 63.998 1 70.042 1 77.4975C1 84.953 7.0439 90.9969 14.4994 90.9969H77.4968C84.9523 90.9969 90.9963 84.953 90.9963 77.4975C90.9963 70.042 84.9523 63.998 77.4968 63.998Z"
          fill="white"
        />
        <path
          id="Vector_2"
          d="M77.4968 63.998H14.4994C7.0439 63.998 1 70.042 1 77.4975C1 84.953 7.0439 90.9969 14.4994 90.9969H77.4968C84.9523 90.9969 90.9963 84.953 90.9963 77.4975C90.9963 70.042 84.9523 63.998 77.4968 63.998Z"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g transform="translate(72.4963 77.4936)">
          <g class="password-dot password-dot-4">
            <g transform="translate(-72.4963 -77.4936)">
              <path
                id="dots04"
                d="M67.9963 77.4941C67.9963 75.0041 70.0063 72.9941 72.4963 72.9941C74.9863 72.9941 76.9963 75.0041 76.9963 77.4941C76.9963 79.9841 74.9863 81.9941 72.4963 81.9941C70.0063 81.9941 67.9963 79.9841 67.9963 77.4941Z"
                fill="#000091"
              />
            </g>
          </g>
        </g>
        <g transform="translate(18.4963 77.4936)">
          <g class="password-dot password-dot-1">
            <g transform="translate(-18.4963 -77.4936)">
              <path
                id="dots03"
                d="M18.4963 72.9941C16.0063 72.9941 13.9963 75.0041 13.9963 77.4941C13.9963 79.9841 16.0063 81.9941 18.4963 81.9941C20.9863 81.9941 22.9963 79.9841 22.9963 77.4941C22.9963 75.0041 20.9863 72.9941 18.4963 72.9941Z"
                fill="#000091"
              />
            </g>
          </g>
        </g>
        <g transform="translate(36.4963 77.4936)">
          <g class="password-dot password-dot-2">
            <g transform="translate(-36.4963 -77.4936)">
              <path
                id="dots02"
                d="M31.9963 77.4941C31.9963 75.0041 34.0063 72.9941 36.4963 72.9941C38.9863 72.9941 40.9963 75.0041 40.9963 77.4941C40.9963 79.9841 38.9863 81.9941 36.4963 81.9941C34.0063 81.9941 31.9963 79.9841 31.9963 77.4941Z"
                fill="#000091"
              />
            </g>
          </g>
        </g>
        <g transform="translate(54.4963 77.4936)">
          <g class="password-dot password-dot-3">
            <g transform="translate(-54.4963 -77.4936)">
              <path
                id="dots01"
                d="M54.4963 81.9941C56.9863 81.9941 58.9963 79.9841 58.9963 77.4941C58.9963 75.0041 56.9863 72.9941 54.4963 72.9941C52.0063 72.9941 49.9963 75.0041 49.9963 77.4941C49.9963 79.9841 52.0063 81.9941 54.4963 81.9941C56.9863 81.9941 58.9963 79.9841 58.9963 77.4941Z"
                fill="#000091"
              />
            </g>
          </g>
        </g>
      </g>
      <g id="compteur_2">
        <g id="compteur_3">
          <path
            id="Vector_3"
            d="M68.5981 7.0767L58.7886 23.951C55.0237 21.7611 50.6589 20.5011 45.9941 20.5011C32.8396 20.5011 22.0101 30.4607 20.6451 43.2552C20.4801 44.8001 19.2202 46.0001 17.6603 46.0001H4.11583C2.3759 46.0001 0.980958 44.5301 1.10095 42.7902C2.75088 19.4362 22.2201 1.00195 45.9941 1.00195C54.2287 1.00195 61.9534 3.22186 68.5981 7.0767Z"
            fill="#E3E3FD"
          />
          <path
            id="Vector_4"
            d="M90.8814 42.7916C91.0014 44.5316 89.6065 46.0015 87.8665 46.0015H74.3221C72.7621 46.0015 71.5022 44.8016 71.3372 43.2566C70.4522 35.007 65.6374 27.9273 58.7827 23.9524L68.5923 7.07812C81.1168 14.3678 89.8014 27.5373 90.8814 42.7916Z"
            fill="#8585F6"
          />
          <path
            id="Vector_5"
            d="M58.7885 23.951C55.0237 21.7611 50.6589 20.5011 45.9941 20.5011C32.8396 20.5011 22.0101 30.4607 20.6451 43.2552C20.4801 44.8001 19.2202 46.0001 17.6603 46.0001H4.11583C2.3759 46.0001 0.980958 44.5301 1.10095 42.7902C2.75088 19.4362 22.2201 1.00195 45.9941 1.00195C54.2287 1.00195 61.9534 3.22186 68.5981 7.0767"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_6"
            d="M90.8814 42.7916C91.0014 44.5316 89.6064 46.0015 87.8665 46.0015H74.3221C72.7621 46.0015 71.5022 44.8016 71.3372 43.2566C70.4522 35.007 65.6374 27.9273 58.7827 23.9524L68.5923 7.07812C81.1168 14.3678 89.8014 27.5373 90.8814 42.7916Z"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <g id="feature-anchor" transform="translate(45.9963 44.9941)">
          <g id="feature">
            <g transform="translate(-45.9963 -44.9941)">
              <g id="aiguille">
                <circle id="vector" cx="45.9963" cy="44.9941" r="10" fill="#000091" />
                <path
                  id="vector_2"
                  d="M79.7712 25.4938C80.2916 26.3952 80.0064 27.5814 79.0999 28.2856L51.099 50.037C47.3674 52.9357 42.0764 52.2045 39.9341 48.4938C37.7917 44.7832 39.8039 39.8354 44.1802 38.0531L77.0179 24.6793C78.0809 24.2464 79.2508 24.5925 79.7712 25.4938Z"
                  fill="#000091"
                />
                <circle id="vector_3" cx="45.9963" cy="44.9941" r="3" fill="white" />
              </g>
            </g>
          </g>
        </g>
      </g>
      <path
        id="trace"
        d="M70.0896 1L71.6195 1.88496C79.9442 6.74476 86.6039 13.7345 90.9987 21.9841"
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
  #picto-mdp-robuste {
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

    .password-dot {
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

    &:hover,
    &.animée {
      #feature {
        -webkit-animation: robust-password-needle 828ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
        animation: robust-password-needle 828ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
      }

      .password-dot-1 {
        -webkit-animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 0ms 1 both;
        animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 0ms 1 both;
      }

      .password-dot-2 {
        -webkit-animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 115ms 1 both;
        animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 115ms 1 both;
      }

      .password-dot-3 {
        -webkit-animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 230ms 1 both;
        animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 230ms 1 both;
      }

      .password-dot-4 {
        -webkit-animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 345ms 1 both;
        animation: password-dot-expand 207ms cubic-bezier(0.2, 0.8, 0.2, 1) 345ms 1 both;
      }

      .draw-trace {
        -webkit-animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }
    }

    @-webkit-keyframes robust-password-needle {
      from {
        -webkit-transform: rotate(-120deg);
        transform: rotate(-120deg);
      }

      to {
        -webkit-transform: none;
        transform: none;
      }
    }

    @keyframes robust-password-needle {
      from {
        -webkit-transform: rotate(-120deg);
        transform: rotate(-120deg);
      }

      to {
        -webkit-transform: none;
        transform: none;
      }
    }

    @-webkit-keyframes password-dot-expand {
      from {
        -webkit-transform: scale(0);
        transform: scale(0);
      }

      to {
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }

    @keyframes password-dot-expand {
      from {
        -webkit-transform: scale(0);
        transform: scale(0);
      }

      to {
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

    @media (prefers-reduced-motion: reduce) {
      #feature,
      &:hover #feature,
      &.animée #feature {
        -webkit-animation: none;
        animation: none;
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

      .password-dot,
      &:hover .password-dot,
      &.animée .password-dot {
        -webkit-animation: none;
        animation: none;
      }
    }
  }
</style>
