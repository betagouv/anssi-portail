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
  id="picto-inventaire"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Inventaire</title>
  <desc id="picto-desc"
    >Au survol, les trois coches et leurs lignes se dessinent à tour de rôle tandis que le stylo se rétracte puis
    retrouve sa taille et les traits décoratifs se redessinent en 828 ms.</desc
  >
  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />
  <g id="artwork" transform="translate(94.5 34)">
    <g id="Group 2118">
      <g id="Group">
        <path
          id="Vector"
          d="M66.4348 5H5.56522C3.04392 5 1 7.0387 1 9.55357V85.4464C1 87.9613 3.04392 90 5.56522 90H66.4348C68.9561 90 71 87.9613 71 85.4464V9.55357C71 7.0387 68.9561 5 66.4348 5Z"
          fill="#8585F6"
        />
        <path
          id="Vector_2"
          d="M66.4348 5H5.56522C3.04392 5 1 7.0387 1 9.55357V85.4464C1 87.9613 3.04392 90 5.56522 90H66.4348C68.9561 90 71 87.9613 71 85.4464V9.55357C71 7.0387 68.9561 5 66.4348 5Z"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_3"
          d="M63 5H9V81H63V5Z"
          fill="white"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g id="Group_2">
          <path
            id="line03"
            d="M35 57H43"
            stroke="#000091"
            stroke-width="3"
            pathLength="1"
            class="inventory-line inventory-line-3"
          />
          <path
            id="line02"
            d="M35 42H53"
            stroke="#000091"
            stroke-width="3"
            pathLength="1"
            class="inventory-line inventory-line-2"
          />
          <path
            id="line01"
            d="M35 27H53"
            stroke="#000091"
            stroke-width="3"
            pathLength="1"
            class="inventory-line inventory-line-1"
          />
          <g transform="translate(23 56.5)">
            <g class="inventory-check-pulse inventory-check-pulse-3">
              <g transform="translate(-23 -56.5)">
                <path
                  id="check03"
                  d="M18 56.108L21.5714 60L28 53"
                  stroke="#000091"
                  stroke-width="3"
                  pathLength="1"
                  class="inventory-check inventory-check-3"
                />
              </g>
            </g>
          </g>
          <g transform="translate(23 41.5)">
            <g class="inventory-check-pulse inventory-check-pulse-2">
              <g transform="translate(-23 -41.5)">
                <path
                  id="check02"
                  d="M18 41.108L21.5714 45L28 38"
                  stroke="#000091"
                  stroke-width="3"
                  pathLength="1"
                  class="inventory-check inventory-check-2"
                />
              </g>
            </g>
          </g>
          <g transform="translate(23 26.5)">
            <g class="inventory-check-pulse inventory-check-pulse-1">
              <g transform="translate(-23 -26.5)">
                <path
                  id="check01"
                  d="M18 26.108L21.5714 30L28 23"
                  stroke="#000091"
                  stroke-width="3"
                  pathLength="1"
                  class="inventory-check inventory-check-1"
                />
              </g>
            </g>
          </g>
        </g>
        <g id="Group_3">
          <rect id="Vector_4" x="23" width="26" height="10" rx="5" fill="#000091" />
        </g>
      </g>
      <g id="feature-anchor" transform="translate(69.35 51.78)">
        <g id="feature">
          <g transform="translate(-69.35 -51.78)">
            <g id="Group_4">
              <path
                id="Vector_5"
                d="M54.4242 74H48.6453C47.8155 74 47.1365 73.321 47.1365 72.4912V66.7123C47.1365 65.9126 47.4533 65.1431 48.0267 64.5848L81.2816 31.3299C83.047 29.5645 85.9138 29.5645 87.6791 31.3299L89.8066 33.4573C91.5719 35.2227 91.5719 38.0895 89.8066 39.8548L56.5517 73.1098C55.9783 73.6831 55.2239 74 54.4242 74Z"
                fill="white"
              />
              <path
                id="Vector_6"
                d="M85.5366 44.1397L56.5517 73.1246C55.9783 73.6828 55.2239 73.9997 54.4242 73.9997H48.6453C47.8004 73.9997 47.1365 73.3358 47.1365 72.4909V66.712C47.1365 65.9123 47.4533 65.1579 48.0116 64.5845L76.9965 35.5996"
                fill="#E3E3FD"
              />
              <path
                id="Vector_7"
                d="M85.5366 44.1397L56.5517 73.1246C55.9783 73.6829 55.2239 73.9997 54.4242 73.9997H48.6453C47.8004 73.9997 47.1365 73.3358 47.1365 72.4909V66.712C47.1365 65.9123 47.4533 65.1579 48.0116 64.5845L76.9965 35.5996"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_8"
                d="M89.805 39.8699L85.5349 44.14L76.9949 35.5999L81.2649 31.3299C83.0453 29.5645 85.9121 29.5645 87.6775 31.3299L89.805 33.4573C91.5703 35.2227 91.5703 38.0895 89.805 39.8699Z"
                fill="white"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_9"
                d="M89.805 39.8699L85.5349 44.14L76.9949 35.5999L81.2649 31.3299C83.0453 29.5645 85.9121 29.5645 87.6775 31.3299L89.805 33.4573C91.5703 35.2227 91.5703 38.0895 89.805 39.8699Z"
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
        id="decorative"
        d="M90.9995 46.9824L77.4998 60.4821"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace"
      />
      <path
        id="decorative_2"
        d="M76.949 27.0769C78.9589 25.0819 81.5839 24.002 84.3888 24.002C86.2038 24.002 87.9587 24.4669 89.5037 25.3219"
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
  #picto-inventaire {
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

    .inventory-check,
    .inventory-line {
      stroke-dasharray: 1 1;
      stroke-dashoffset: 0;
    }

    .inventory-check-pulse {
      -webkit-transform: none;
      transform: none;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      transform-box: view-box;
    }

    &:hover,
    &.animée {
      #feature {
        -webkit-animation: feature-shrink-return 414ms ease-out 0ms 1 both;
        animation: feature-shrink-return 414ms ease-out 0ms 1 both;
      }

      .inventory-check-1 {
        -webkit-animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
        animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
      }

      .inventory-line-1 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 0ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 0ms 1 both;
      }

      .inventory-check-2 {
        -webkit-animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 184ms 1 both;
        animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 184ms 1 both;
      }

      .inventory-line-2 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 184ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 184ms 1 both;
      }

      .inventory-check-3 {
        -webkit-animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 368ms 1 both;
        animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 368ms 1 both;
      }

      .inventory-line-3 {
        -webkit-animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 368ms 1 both;
        animation: line-draw 230ms cubic-bezier(0.4, 0, 0.2, 1) 368ms 1 both;
      }

      .draw-trace {
        -webkit-animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }
    }

    @-webkit-keyframes check-draw {
      from {
        stroke-dashoffset: 1;
      }

      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes check-draw {
      from {
        stroke-dashoffset: 1;
      }

      to {
        stroke-dashoffset: 0;
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

      &:hover .inventory-check,
      &.animée .inventory-check,
      &:hover .inventory-line,
      &.animée .inventory-line,
      &:hover .inventory-check-pulse,
      &.animée .inventory-check-pulse,
      &:hover .draw-trace,
      &.animée .draw-trace {
        -webkit-animation: none;
        animation: none;
      }
    }
  }
</style>
