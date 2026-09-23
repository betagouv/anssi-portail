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
  id="picto-admin"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Admin</title>
  <desc id="picto-desc"
    >Au survol, l'engrenage pivote de 180° autour du point central tandis que le tracé inférieur poursuit le mouvement
    du supérieur et les traits décoratifs se redessinent en 828 ms.</desc
  >

  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />
  <g id="artwork" transform="translate(94.5 33.5)">
    <g id="Admin">
      <g id="user">
        <g id="body">
          <path
            id="bg"
            d="M61 64.0006V86.5006C61 88.9906 58.99 91.0006 56.5 91.0006H5.5C3.01 91.0006 1 88.9906 1 86.5006V64.0006C1 55.7206 4.36 48.2206 9.79 42.7906C12.55 40.0306 15.865 37.7956 19.54 36.2656L31 49.0006L42.46 36.2656C53.35 40.7806 61 51.4906 61 64.0006Z"
            fill="#8585F6"
          />
          <path
            id="bg_2"
            d="M42.4591 36.265L30.9991 49L19.5391 36.265C23.0641 34.81 26.9341 34 30.9991 34C35.0641 34 38.9341 34.81 42.4591 36.265Z"
            fill="#000091"
          />
          <path
            id="contour"
            d="M16 90.25V65.5"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="contour_2"
            d="M46 89.5V65.5"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="contour_3"
            d="M19.5391 36.2656L30.9991 49.0006L42.4591 36.2656"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="contour_4"
            d="M61 86.5V64C61 47.425 47.575 34 31 34C14.425 34 1 47.425 1 64V86.5C1 88.99 3.01 91 5.5 91H56.5C58.99 91 61 88.99 61 86.5Z"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <g id="face">
          <path
            id="bg_3"
            d="M31 34C40.1127 34 47.5 26.6127 47.5 17.5C47.5 8.3873 40.1127 1 31 1C21.8873 1 14.5 8.3873 14.5 17.5C14.5 26.6127 21.8873 34 31 34Z"
            fill="white"
          />
          <path
            id="contour_5"
            d="M31 34C40.1127 34 47.5 26.6127 47.5 17.5C47.5 8.3873 40.1127 1 31 1C21.8873 1 14.5 8.3873 14.5 17.5C14.5 26.6127 21.8873 34 31 34Z"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="contour_6"
            d="M26.5767 23C27.6731 24.2307 29.2679 25 31.0454 25C32.823 25 34.4178 24.2307 35.5142 23"
            stroke="#000091"
            stroke-width="3"
            stroke-linejoin="round"
          />
        </g>
      </g>
      <g id="feature-anchor" transform="translate(71 43)">
        <g id="feature">
          <g transform="translate(-71 -43)">
            <g id="gear">
              <path
                id="contour_7"
                d="M90.6671 51.0797L87.8847 55.9016C87.2076 57.0762 85.7057 57.4842 84.5361 56.8042L83.2311 56.0623C82.394 55.5802 81.3475 55.642 80.5719 56.2231C79.6978 56.866 78.7499 57.4224 77.7404 57.8798C76.8663 58.2755 76.2999 59.1533 76.2999 60.1177V61.3417C76.2999 62.8872 75.2043 63.9999 73.85 63.9999H68.2238C66.8696 64.0123 65.7616 62.9119 65.7616 61.5395V60.13C65.7616 59.1657 65.1953 58.2878 64.3089 57.8922C63.3117 57.4347 62.3637 56.8907 61.4896 56.2478C60.7017 55.6791 59.6676 55.6172 58.8181 56.0994L57.5255 56.8536C56.3559 57.5336 54.8539 57.138 54.1768 55.9634L51.3699 51.1416C50.6805 49.9546 51.0744 48.4339 52.2686 47.7539L53.5982 46.975C54.4354 46.4928 54.9032 45.5655 54.8047 44.6011C54.7554 44.0695 54.7308 43.5378 54.7308 42.9938C54.7308 42.4498 54.7554 41.9553 54.8047 41.4607C54.8909 40.4963 54.423 39.5567 53.5859 39.0745L52.244 38.3079C51.0621 37.6279 50.6435 36.1072 51.3329 34.9203L54.1153 30.0984C54.7924 28.9238 56.2943 28.5158 57.4639 29.1958L58.7689 29.9377C59.606 30.4198 60.6525 30.358 61.4281 29.7769C62.3022 29.134 63.2501 28.5776 64.2596 28.1202C65.1337 27.7245 65.7001 26.8467 65.7001 25.8823V24.6583C65.7001 23.1128 66.7957 22.0001 68.15 22.0001H73.7762C75.1304 21.9877 76.2384 23.0881 76.2384 24.4605V25.87C76.2384 26.8343 76.8047 27.7122 77.6911 28.1078C78.6883 28.5653 79.6363 29.1093 80.5104 29.7522C81.2983 30.3209 82.3324 30.3828 83.1819 29.9006L84.4745 29.1464C85.6441 28.4664 87.1461 28.862 87.8232 30.0366L90.6301 34.8584C91.3195 36.0454 90.9256 37.5661 89.7314 38.2461L88.4018 39.025C87.5646 39.5072 87.0968 40.4345 87.1953 41.3989C87.2446 41.9305 87.2692 42.4622 87.2692 43.0062C87.2692 43.5502 87.2446 44.0447 87.1953 44.5393C87.1091 45.5037 87.577 46.4433 88.4141 46.9255L89.756 47.6921C90.9379 48.3721 91.3565 49.8928 90.6671 51.0797ZM70.9938 35.5879C66.9189 35.5879 63.6072 38.9138 63.6072 43.0062C63.6072 47.0986 66.9189 50.4245 70.9938 50.4245C75.0688 50.4245 78.3805 47.0986 78.3805 43.0062C78.3805 38.9138 75.0688 35.5879 70.9938 35.5879Z"
                fill="#E3E3FD"
                stroke="#000091"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle id="vector" cx="71" cy="43" r="3" fill="#000091" />
            </g>
          </g>
        </g>
      </g>
      <path
        id="trace"
        d="M57.5 19.615C61.475 17.32 66.08 16 71 16C79.49 16 87.05 19.915 92 26.035"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace"
      />
      <path
        id="trace_2"
        d="M71 69.9998C79.49 69.9998 87.05 66.0848 92 59.9648"
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
  #picto-admin {
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

      .draw-trace {
        -webkit-animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
      }

      .draw-reverse {
        -webkit-animation: trace-draw-reverse 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
        animation: trace-draw-reverse 828ms cubic-bezier(0.4, 0.1, 0.6, 0.9) 0ms 1 forwards;
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
    }
  }
</style>
