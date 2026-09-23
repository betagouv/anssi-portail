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
  id="picto-sensibilisation"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Sensibilisation</title>
  <desc id="picto-desc"
    >Au survol, l'ampoule se rétracte puis retrouve sa taille et les six lignes du livre se tracent successivement et
    les traits décoratifs se redessinent en 828 ms.</desc
  >
  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />
  <g id="artwork" transform="translate(95 33.5)">
    <g id="Sensibilisation">
      <g id="book">
        <g id="cover">
          <path id="Vector" d="M85 38.5H91V91H50.5L46 88L41.5 91H1V38.5H7V82H85V38.5Z" fill="#8585F6" />
          <path
            id="Vector_2"
            d="M85 38.5H91V91H50.5L46 88L41.5 91H1V38.5H7"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <g id="book_2">
          <g id="book_3">
            <path id="Vector_3" d="M85 31H7V82H85V31Z" fill="white" />
            <path
              id="Vector_4"
              d="M85 31H7V82H85V31Z"
              stroke="#000091"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Vector_5"
              d="M46 59.5V82"
              stroke="#000091"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <g id="line">
            <path
              id="line06"
              d="M58 70H76"
              stroke="#000091"
              stroke-width="3"
              stroke-linejoin="round"
              pathLength="1"
              class="sensibilisation-line sensibilisation-line-6"
            />
            <path
              id="line05"
              d="M58 61H76"
              stroke="#000091"
              stroke-width="3"
              stroke-linejoin="round"
              pathLength="1"
              class="sensibilisation-line sensibilisation-line-5"
            />
            <path
              id="line04"
              d="M61 52H76"
              stroke="#000091"
              stroke-width="3"
              stroke-linejoin="round"
              pathLength="1"
              class="sensibilisation-line sensibilisation-line-4"
            />
            <path
              id="line03"
              d="M16 70H34"
              stroke="#000091"
              stroke-width="3"
              stroke-linejoin="round"
              pathLength="1"
              class="sensibilisation-line sensibilisation-line-3"
            />
            <path
              id="line02"
              d="M16 61H34"
              stroke="#000091"
              stroke-width="3"
              stroke-linejoin="round"
              pathLength="1"
              class="sensibilisation-line sensibilisation-line-2"
            />
            <path
              id="line01"
              d="M16 52H31"
              stroke="#000091"
              stroke-width="3"
              stroke-linejoin="round"
              pathLength="1"
              class="sensibilisation-line sensibilisation-line-1"
            />
          </g>
        </g>
        <g id="bookmark">
          <path id="Vector_6" d="M67 31V43L71.5 40L76 43V31" fill="white" />
          <g id="Vector_7">
            <path d="M67 31V43L71.5 40L76 43V31" fill="#000091" />
            <path
              d="M67 31V43L71.5 40L76 43V31"
              stroke="#000091"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </g>
      </g>
      <g id="feature-anchor" transform="translate(46 26)">
        <g id="feature">
          <g transform="translate(-46 -26)">
            <g id="lightbulb">
              <path
                id="Vector_8"
                d="M62.38 15.4917C63.07 21.3267 60.715 26.6667 56.68 30.0867C55.645 30.9717 55 32.2317 55 33.5817V40.0017C55 42.4917 52.99 44.5017 50.5 44.5017H41.5C39.01 44.5017 37 42.4917 37 40.0017V33.5817C37 32.2317 36.37 30.9717 35.335 30.0867C31.765 27.0567 29.5 22.5417 29.5 17.5017C29.5 7.78167 37.885 0.0416675 47.815 1.09167C55.345 1.88667 61.48 7.96167 62.38 15.4767V15.4917Z"
                fill="#E3E3FD"
              />
              <path
                id="Vector_9"
                d="M37 39.0006L55.0002 38.9997"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_10"
                d="M61.8843 15.6603C62.5534 21.5616 60.2697 26.9623 56.3569 30.4212C55.3532 31.3162 55 32.5906 55 33.9559V41C55 43.5183 53.4146 45 51 45H41C38.5854 45 37 43.5183 37 41V33.9559C37 32.5906 36.662 31.3162 35.6583 30.4212C32.8946 27.9787 30.9455 24.5805 30.2618 20.7272C30.0873 19.7412 30 18.7247 30 17.6932C30 7.86269 38.1311 0.034727 47.7604 1.09666C55.0623 1.90069 61.0115 8.04473 61.8843 15.6451V15.6603Z"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_11"
                d="M52 45C52 48.315 49.315 51 46 51C42.685 51 40 48.315 40 45"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_12"
                d="M51.985 45C52 45.0861 52 45.1722 52 45.2584C52 48.4306 49.315 51 46 51C42.685 51 40 48.4306 40 45.2584C40 45.1722 40 45.0861 40.015 45"
                fill="#000091"
              />
              <path
                id="Vector_13"
                d="M46 22V39"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_14"
                d="M46 22C48.4853 22 50.5 19.9853 50.5 17.5C50.5 15.0147 48.4853 13 46 13C43.5147 13 41.5 15.0147 41.5 17.5C41.5 19.9853 43.5147 22 46 22Z"
                fill="#000091"
              />
            </g>
          </g>
        </g>
      </g>
      <path
        id="trace"
        d="M65.8867 7C66.3967 7.96 66.8467 8.965 67.2067 10C68.0467 12.355 68.4967 14.875 68.4967 17.5C68.4967 19.045 68.3467 20.545 68.0467 22"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace"
      />
      <path
        id="trace_2"
        d="M23.95 22C23.65 20.545 23.5 19.045 23.5 17.5C23.5 14.875 23.95 12.355 24.79 10C25.15 8.965 25.6 7.96 26.11 7"
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
  #picto-sensibilisation {
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

    .sensibilisation-line {
      stroke-dasharray: 1 1;
      stroke-dashoffset: 0;
    }

    &:hover,
    &.animée {
      #feature {
        -webkit-animation: feature-shrink-return 414ms ease-out 0ms 1 both;
        animation: feature-shrink-return 414ms ease-out 0ms 1 both;
      }

      .sensibilisation-line-1 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 0ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 0ms 1 both;
      }

      .sensibilisation-line-2 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 46ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 46ms 1 both;
      }

      .sensibilisation-line-3 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 92ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 92ms 1 both;
      }

      .sensibilisation-line-4 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 322ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 322ms 1 both;
      }

      .sensibilisation-line-5 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 368ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 368ms 1 both;
      }

      .sensibilisation-line-6 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 414ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 414ms 1 both;
      }

      .draw-trace {
        -webkit-animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }
    }

    @-webkit-keyframes line-draw {
      from {
        stroke-dashoffset: 1;
      }

      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes line-draw {
      from {
        stroke-dashoffset: 1;
      }

      to {
        stroke-dashoffset: 0;
      }
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

      &:hover .sensibilisation-line,
      &.animée .sensibilisation-line,
      &:hover .draw-trace,
      &.animée .draw-trace {
        -webkit-animation: none;
        animation: none;
      }
    }
  }
</style>
