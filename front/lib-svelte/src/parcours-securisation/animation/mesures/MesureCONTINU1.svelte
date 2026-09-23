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
  id="picto-sauvegarde"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Sauvegarde</title>
  <desc id="picto-desc"
    >Au survol, les repères du cadran pivotent et le cadenas se rétracte puis retrouve sa taille et les traits
    décoratifs se redessinent en 828 ms.</desc
  >

  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />

  <g id="artwork" transform="translate(95 33.5)">
    <g id="Safe">
      <g id="safe">
        <g id="safe_2">
          <path
            id="Vector"
            d="M21.9993 85.002H33.9988V88.0018C33.9988 89.6518 32.6489 91.0017 30.9989 91.0017H24.9992C23.3492 91.0017 21.9993 89.6518 21.9993 88.0018V85.002Z"
            fill="#E3E3FD"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_2"
            d="M57.999 85.0039H69.9986V88.0038C69.9986 89.6537 68.6486 91.0037 66.9987 91.0037H60.9989C59.349 91.0037 57.999 89.6537 57.999 88.0038V85.0039Z"
            fill="#E3E3FD"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <rect
            id="Vector_3"
            x="6.99805"
            y="1"
            width="78"
            height="84"
            rx="8"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <rect
            id="Vector_4"
            x="9.99805"
            y="51"
            width="12"
            height="6"
            rx="3"
            transform="rotate(90 9.99805 51)"
            fill="#000091"
          />
          <rect
            id="Vector_5"
            x="9.99805"
            y="23"
            width="12"
            height="6"
            rx="3"
            transform="rotate(90 9.99805 23)"
            fill="#000091"
          />
          <rect
            id="handle"
            x="79.998"
            y="37"
            width="12"
            height="3"
            rx="1.5"
            transform="rotate(90 79.998 37)"
            fill="#000091"
          />
        </g>

        <g id="door">
          <g id="door_2">
            <path
              id="Vector_6"
              d="M45.998 69C60.3575 69 71.998 57.3594 71.998 43C71.998 28.6406 60.3575 17 45.998 17C31.6386 17 19.998 28.6406 19.998 43C19.998 57.3594 31.6386 69 45.998 69Z"
              fill="white"
              stroke="#000091"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Vector_7"
              d="M45.998 61C55.9392 61 63.998 52.9411 63.998 43C63.998 33.0589 55.9392 25 45.998 25C36.0569 25 27.998 33.0589 27.998 43C27.998 52.9411 36.0569 61 45.998 61Z"
              fill="#E3E3FD"
              stroke="#000091"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="feature-anchor" transform="translate(46 43)">
              <g id="feature">
                <g transform="translate(-46 -43)">
                  <path
                    id="Vector_8"
                    d="M58.8037 30.2008L63.6803 25.3242M28.325 60.6796L33.2016 55.803M63.6828 60.6796L58.8062 55.803M33.2041 30.2008L28.3275 25.3242"
                    stroke="#000091"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </g>
              </g>
            </g>
          </g>

          <g id="lock-feature-anchor" transform="translate(45.998 42.5)">
            <g id="lock-feature">
              <g transform="translate(-45.998 -42.5)">
                <g id="lock">
                  <rect id="Vector_9" x="36.998" y="39" width="18" height="14" rx="2" fill="#000091" />
                  <rect id="Vector_10" x="44.998" y="45" width="2" height="4" rx="1" fill="white" />
                  <circle id="Vector_11" cx="45.998" cy="45" r="2" fill="white" />
                  <path
                    id="Vector_12"
                    d="M40.998 40V37C40.998 34.2386 43.2366 32 45.998 32C48.7595 32 50.998 34.2386 50.998 37V40"
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
      </g>

      <path
        id="trace"
        d="M87.9854 85.003C89.8753 82.4981 91.0002 79.3782 91.0002 76.0034V61.0039"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace draw-reverse"
      />
      <path
        id="trace_2"
        d="M4.01489 1.00586C2.12496 3.51077 1 6.63065 1 10.0055V25.005"
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
  #picto-sauvegarde {
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

    #lock-feature {
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
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
      }

      #lock-feature {
        -webkit-animation: feature-shrink-return 414ms ease-out 0ms 1 both;
        animation: feature-shrink-return 414ms ease-out 0ms 1 both;
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

      #lock-feature,
      &:hover #lock-feature,
      &.animée #lock-feature {
        -webkit-animation: none;
        animation: none;
        -webkit-transform: none;
        transform: none;
      }
    }
  }
</style>
