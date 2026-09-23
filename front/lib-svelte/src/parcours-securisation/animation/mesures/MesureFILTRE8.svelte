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
  id="picto-pare-feu"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Pare-feu</title>
  <desc id="picto-desc"
    >Au survol, les briques construisent rapidement le mur tandis que le bouclier se rétracte puis retrouve sa taille et
    que sa coche se dessine et les traits décoratifs se redessinent en 828 ms.</desc
  >
  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />
  <g id="artwork" transform="translate(95 33.5)">
    <g id="firewall">
      <g id="globe">
        <path
          id="bg"
          d="M46 67C64.2254 67 79 52.2254 79 34C79 15.7746 64.2254 1 46 1C27.7746 1 13 15.7746 13 34C13 52.2254 27.7746 67 46 67Z"
          fill="#E3E3FD"
        />
        <path
          id="contour"
          d="M46 67C64.2254 67 79 52.2254 79 34C79 15.7746 64.2254 1 46 1C27.7746 1 13 15.7746 13 34C13 52.2254 27.7746 67 46 67Z"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="contour_2"
          d="M46.0005 67C54.0196 67 60.5205 52.2254 60.5205 34C60.5205 15.7746 54.0196 1 46.0005 1C37.9813 1 31.4805 15.7746 31.4805 34C31.4805 52.2254 37.9813 67 46.0005 67Z"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="contour_3"
          d="M16.8906 49.5402C22.4406 45.7902 33.4056 43.2402 46.0056 43.2402C58.6056 43.2402 69.5706 45.7902 75.1206 49.5402"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="contour_4"
          d="M16.8906 18.4609C22.4406 22.2109 33.4056 24.7609 46.0056 24.7609C58.6056 24.7609 69.5706 22.2109 75.1206 18.4609"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>

      <g id="wall">
        <g class="wall-brick wall-brick-1">
          <path
            id="brick"
            d="M29 76H3C1.89543 76 1 76.8954 1 78V89C1 90.1046 1.89543 91 3 91H29C30.1046 91 31 90.1046 31 89V78C31 76.8954 30.1046 76 29 76Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
        <g class="wall-brick wall-brick-2">
          <path
            id="brick_2"
            d="M59 76H33C31.8954 76 31 76.8954 31 78V89C31 90.1046 31.8954 91 33 91H59C60.1046 91 61 90.1046 61 89V78C61 76.8954 60.1046 76 59 76Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
        <g class="wall-brick wall-brick-3">
          <path
            id="brick_3"
            d="M89 76H63C61.8954 76 61 76.8954 61 78V89C61 90.1046 61.8954 91 63 91H89C90.1046 91 91 90.1046 91 89V78C91 76.8954 90.1046 76 89 76Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
        <g class="wall-brick wall-brick-4">
          <path
            id="brick_4"
            d="M44 61H18C16.8954 61 16 61.8954 16 63V74C16 75.1046 16.8954 76 18 76H44C45.1046 76 46 75.1046 46 74V63C46 61.8954 45.1046 61 44 61Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
        <g class="wall-brick wall-brick-5">
          <path
            id="brick_5"
            d="M74 61H48C46.8954 61 46 61.8954 46 63V74C46 75.1046 46.8954 76 48 76H74C75.1046 76 76 75.1046 76 74V63C76 61.8954 75.1046 61 74 61Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
        <g class="wall-brick wall-brick-6">
          <path
            id="brick_6"
            d="M29 46H3C1.89543 46 1 46.8954 1 48V59C1 60.1046 1.89543 61 3 61H29C30.1046 61 31 60.1046 31 59V48C31 46.8954 30.1046 46 29 46Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
        <g class="wall-brick wall-brick-7">
          <path
            id="brick_7"
            d="M59 46H33C31.8954 46 31 46.8954 31 48V59C31 60.1046 31.8954 61 33 61H59C60.1046 61 61 60.1046 61 59V48C61 46.8954 60.1046 46 59 46Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
        <g class="wall-brick wall-brick-8">
          <path
            id="brick_8"
            d="M89 46H63C61.8954 46 61 46.8954 61 48V59C61 60.1046 61.8954 61 63 61H89C90.1046 61 91 60.1046 91 59V48C91 46.8954 90.1046 46 89 46Z"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
          />
        </g>
      </g>

      <g id="feature-anchor" transform="translate(46 58)">
        <g id="feature">
          <g transform="translate(-46 -58)">
            <g id="shied">
              <path
                id="shield"
                d="M68.1598 40.525L46.1698 31L23.8348 40.525C21.8698 56.245 28.4548 71.8 41.0848 81.295L45.9898 84.985L50.8948 81.295C63.5248 71.8 70.1098 56.23 68.1448 40.525H68.1598Z"
                fill="#F5F5FE"
                stroke="#000091"
                stroke-width="2"
              />
              <g transform="translate(46.5 55.5)">
                <g id="check-pulse">
                  <g transform="translate(-46.5 -55.5)">
                    <path
                      id="check"
                      d="M37.9993 55L43.9993 61L54.9993 50"
                      stroke="#000091"
                      stroke-width="6"
                      pathLength="1"
                      class="shield-check"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      <path
        id="trace"
        d="M7.12 37C7.045 36.01 7 35.005 7 34C7 24.955 10.09 16.63 15.28 10"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace"
      />
      <path
        id="trace_2"
        d="M76.7148 10C81.9048 16.63 84.9948 24.955 84.9948 34C84.9948 35.005 84.9498 36.01 84.8748 37"
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
  #picto-pare-feu {
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

    .wall-brick {
      -webkit-transform: none;
      transform: none;
      opacity: 1;
      transform-box: view-box;
    }

    .shield-check {
      stroke-dasharray: 1 1;
      stroke-dashoffset: 0;
    }

    #check-pulse {
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
        -webkit-animation: feature-shrink-return 414ms ease-out 0ms 1 both;
        animation: feature-shrink-return 414ms ease-out 0ms 1 both;
      }

      .wall-brick {
        -webkit-animation: wall-build 207ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
        animation: wall-build 207ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
      }

      .wall-brick-1 {
        -webkit-animation-delay: 0ms;
        animation-delay: 0ms;
      }

      .wall-brick-2 {
        -webkit-animation-delay: 63ms;
        animation-delay: 63ms;
      }

      .wall-brick-3 {
        -webkit-animation-delay: 127ms;
        animation-delay: 127ms;
      }

      .wall-brick-4 {
        -webkit-animation-delay: 196ms;
        animation-delay: 196ms;
      }

      .wall-brick-5 {
        -webkit-animation-delay: 259ms;
        animation-delay: 259ms;
      }

      .wall-brick-6 {
        -webkit-animation-delay: 328ms;
        animation-delay: 328ms;
      }

      .wall-brick-7 {
        -webkit-animation-delay: 391ms;
        animation-delay: 391ms;
      }

      .wall-brick-8 {
        -webkit-animation-delay: 454ms;
        animation-delay: 454ms;
      }

      .shield-check {
        -webkit-animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
        animation: check-draw 460ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both;
      }

      .draw-trace {
        -webkit-animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }
    }

    @-webkit-keyframes wall-build {
      0% {
        opacity: 0;
        -webkit-transform: translateY(-9px);
        transform: translateY(-9px);
      }

      78% {
        opacity: 1;
        -webkit-transform: translateY(1px);
        transform: translateY(1px);
      }

      100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }

    @keyframes wall-build {
      0% {
        opacity: 0;
        -webkit-transform: translateY(-9px);
        transform: translateY(-9px);
      }

      78% {
        opacity: 1;
        -webkit-transform: translateY(1px);
        transform: translateY(1px);
      }

      100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
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
        transform: none;
      }

      to {
        stroke-dashoffset: 0;
        transform: none;
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

      &:hover .wall-brick,
      &.animée .wall-brick {
        -webkit-animation: none;
        animation: none;
      }

      &:hover .draw-trace,
      &.animée .draw-trace {
        -webkit-animation: none;
        animation: none;
      }

      &:hover .shield-check,
      &.animée .shield-check,
      &:hover #check-pulse,
      &.animée #check-pulse {
        -webkit-animation: none;
        animation: none;
      }
    }
  }
</style>
