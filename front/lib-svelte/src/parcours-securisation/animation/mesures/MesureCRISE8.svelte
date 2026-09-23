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
  id="picto-contacts"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Contacts</title>
  <desc id="picto-desc"
    >Au survol, le combiné oscille légèrement tandis que les deux cartes échangent leur place et les traits décoratifs
    se redessinent en 828 ms.</desc
  >

  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />

  <g id="artwork" transform="translate(95 33.5)">
    <g id="Group 2117">
      <g transform="translate(26 72)">
        <g class="contact-card-swap contact-card-swap-2">
          <g transform="translate(-26 -72)">
            <g id="card 2">
              <path
                id="bg"
                d="M45.1176 53H6.88235C3.63362 53 1 55.6174 1 58.8462V85.1538C1 88.3826 3.63362 91 6.88235 91H45.1176C48.3664 91 51 88.3826 51 85.1538V58.8462C51 55.6174 48.3664 53 45.1176 53Z"
                fill="#8585F6"
                stroke="#000091"
                stroke-width="2"
              />
              <g id="user">
                <path
                  id="bg_2"
                  d="M27 82C27 76.4833 22.965 72 18 72C13.035 72 9 76.4833 9 82H27Z"
                  fill="white"
                  stroke="#000091"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  id="bg_3"
                  d="M18 71C20.7614 71 23 68.7614 23 66C23 63.2386 20.7614 61 18 61C15.2386 61 13 63.2386 13 66C13 68.7614 15.2386 71 18 71Z"
                  fill="white"
                  stroke="#000091"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <path id="line" d="M32 67H44" stroke="#000091" stroke-width="3" stroke-linejoin="round" />
              <path id="line_2" d="M32 76H44" stroke="#000091" stroke-width="3" stroke-linejoin="round" />
            </g>
          </g>
        </g>
      </g>

      <g transform="translate(26 20)">
        <g class="contact-card-swap contact-card-swap-1">
          <g transform="translate(-26 -20)">
            <g id="card 1">
              <path
                id="Vector"
                d="M45.1176 1H6.88235C3.63362 1 1 3.61741 1 6.84615V33.1538C1 36.3826 3.63362 39 6.88235 39H45.1176C48.3664 39 51 36.3826 51 33.1538V6.84615C51 3.61741 48.3664 1 45.1176 1Z"
                fill="#E3E3FD"
                stroke="#000091"
                stroke-width="2"
              />
              <g id="user_2">
                <path
                  id="Vector_2"
                  d="M18 20C20.7614 20 23 17.7614 23 15C23 12.2386 20.7614 10 18 10C15.2386 10 13 12.2386 13 15C13 17.7614 15.2386 20 18 20Z"
                  fill="white"
                  stroke="#000091"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  id="Vector_3"
                  d="M27 31C27 25.4833 22.965 21 18 21C13.035 21 9 25.4833 9 31H27Z"
                  fill="white"
                  stroke="#000091"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <path id="line_3" d="M32 16H44" stroke="#000091" stroke-width="3" stroke-linejoin="round" />
              <path id="line_4" d="M32 25H44" stroke="#000091" stroke-width="3" stroke-linejoin="round" />
            </g>
          </g>
        </g>
      </g>

      <g id="feature-anchor" transform="translate(76 46)">
        <g id="feature">
          <g transform="translate(-76 -46)">
            <g id="phone">
              <path
                id="Vector_4"
                d="M89.1684 59.9246C86.4382 61.7247 83.183 61.0647 80.3328 59.4896C72.4273 55.0943 66.322 48.9439 62.0617 40.9935C61.4017 39.7484 61.0566 38.3983 61.0566 37.0482C61.0566 35.5331 61.4767 34.033 62.3317 32.7129C63.6968 30.6128 66.727 30.4028 68.3621 32.3229L72.4723 37.1382C72.8774 37.6032 73.0574 38.1583 73.0574 38.7133C73.0574 39.5384 72.6374 40.3484 71.8723 40.7984C70.8672 41.3985 70.5522 42.7036 71.1673 43.6936C72.7874 46.2888 74.8575 48.4489 77.3626 50.189C78.7277 51.1341 80.5278 50.6691 81.6079 49.409C82.343 48.5689 83.648 48.4189 84.5481 49.169L89.5134 53.3392C91.6135 55.1093 91.4635 58.4095 89.1684 59.9246Z"
                fill="white"
              />
              <path
                id="Vector_5"
                d="M89.1684 59.9246C86.4382 61.7247 83.183 61.0647 80.3328 59.4896C72.4273 55.0943 66.322 48.9439 62.0617 40.9935C61.4017 39.7484 61.0566 38.3983 61.0566 37.0482C61.0566 35.5331 61.4767 34.033 62.3317 32.7129C63.6968 30.6128 66.727 30.4028 68.3621 32.3229L72.4723 37.1382C72.8774 37.6032 73.0574 38.1583 73.0574 38.7133C73.0574 39.5384 72.6374 40.3484 71.8723 40.7984C70.8672 41.3985 70.5522 42.7036 71.1673 43.6936C72.7874 46.2888 74.8575 48.4489 77.3626 50.189C78.7277 51.1341 80.5278 50.6691 81.6079 49.409C82.343 48.5689 83.648 48.4189 84.5481 49.169L89.5134 53.3392C91.6135 55.1093 91.4635 58.4095 89.1684 59.9246Z"
                fill="#000091"
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
        d="M85.5095 67.0019C82.8693 67.0019 80.1542 66.2369 77.439 64.7368C74.7838 63.2667 72.3087 61.6016 69.9985 59.7715"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace"
      />
      <path
        id="trace_2"
        d="M65.4983 25C68.3635 25 71.0786 26.2451 72.9238 28.4352L77.034 33.2505"
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
  #picto-contacts {
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

    .contact-card-swap {
      -webkit-transform: none;
      transform: none;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      transform-box: view-box;
      -webkit-transition: -webkit-transform 828ms cubic-bezier(0.25, 1.28, 0.55, 1);
      transition: transform 828ms cubic-bezier(0.25, 1.28, 0.55, 1);
    }

    .draw-trace {
      stroke-dasharray: 1 1;
      stroke-dashoffset: 0;
    }

    &:hover,
    &.animée {
      #feature {
        -webkit-animation: contacts-ring 828ms ease-in-out 0ms 1 both;
        animation: contacts-ring 828ms ease-in-out 0ms 1 both;
      }

      .contact-card-swap-1 {
        -webkit-transform: translateY(52px);
        transform: translateY(52px);
      }

      .contact-card-swap-2 {
        -webkit-transform: translateY(-52px);
        transform: translateY(-52px);
      }

      .draw-trace {
        -webkit-animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }
    }

    @-webkit-keyframes contacts-ring {
      0%,
      100% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }

      15% {
        -webkit-transform: rotate(-2.5deg);
        transform: rotate(-2.5deg);
      }

      30% {
        -webkit-transform: rotate(2.5deg);
        transform: rotate(2.5deg);
      }

      45% {
        -webkit-transform: rotate(-2deg);
        transform: rotate(-2deg);
      }

      60% {
        -webkit-transform: rotate(2deg);
        transform: rotate(2deg);
      }

      75% {
        -webkit-transform: rotate(-1deg);
        transform: rotate(-1deg);
      }

      90% {
        -webkit-transform: rotate(1deg);
        transform: rotate(1deg);
      }
    }

    @keyframes contacts-ring {
      0%,
      100% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }

      15% {
        -webkit-transform: rotate(-2.5deg);
        transform: rotate(-2.5deg);
      }

      30% {
        -webkit-transform: rotate(2.5deg);
        transform: rotate(2.5deg);
      }

      45% {
        -webkit-transform: rotate(-2deg);
        transform: rotate(-2deg);
      }

      60% {
        -webkit-transform: rotate(2deg);
        transform: rotate(2deg);
      }

      75% {
        -webkit-transform: rotate(-1deg);
        transform: rotate(-1deg);
      }

      90% {
        -webkit-transform: rotate(1deg);
        transform: rotate(1deg);
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

      .contact-card-swap,
      &:hover .contact-card-swap,
      &.animée .contact-card-swap {
        -webkit-transition: none;
        transition: none;
      }

      &:hover .draw-trace,
      &.animée .draw-trace {
        -webkit-animation: none;
        animation: none;
      }
    }
  }
</style>
