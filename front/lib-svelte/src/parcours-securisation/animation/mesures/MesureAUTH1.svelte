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
  id="picto-changer-mdp"
  width="282"
  height="159"
  viewBox="0 0 282 159"
  fill="none"
  role="img"
  aria-labelledby="picto-title picto-desc"
  class:animée
>
  <title id="picto-title">Changer le mot de passe</title>
  <desc id="picto-desc"
    >Au survol, la flèche de renouvellement effectue un tour complet et les quatre points grandissent successivement
    depuis leur centre et les traits décoratifs se redessinent en 828 ms.</desc
  >

  <rect width="282" height="159" fill="#FBF6ED" pointer-events="all" />
  <g id="artwork" transform="translate(95 33.5)">
    <g id="password">
      <path
        id="Vector"
        d="M77.4968 64.0039H14.4994C7.0439 64.0039 1 70.0478 1 77.5033C1 84.9589 7.0439 91.0028 14.4994 91.0028H77.4968C84.9523 91.0028 90.9963 84.9589 90.9963 77.5033C90.9963 70.0478 84.9523 64.0039 77.4968 64.0039Z"
        fill="white"
      />
      <path
        id="Vector_2"
        d="M77.4968 64.0039H14.4994C7.0439 64.0039 1 70.0478 1 77.5033C1 84.9589 7.0439 91.0028 14.4994 91.0028H77.4968C84.9523 91.0028 90.9963 84.9589 90.9963 77.5033C90.9963 70.0478 84.9523 64.0039 77.4968 64.0039Z"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g transform="translate(72.4963 77.5)">
        <g class="password-dot password-dot-4">
          <g transform="translate(-72.4963 -77.5)">
            <path
              id="dots04"
              d="M67.9963 77.5C67.9963 75.01 70.0063 73 72.4963 73C74.9863 73 76.9963 75.01 76.9963 77.5C76.9963 79.99 74.9863 82 72.4963 82C70.0063 82 67.9963 79.99 67.9963 77.5Z"
              fill="#000091"
            />
          </g>
        </g>
      </g>
      <g transform="translate(18.4963 77.5)">
        <g class="password-dot password-dot-1">
          <g transform="translate(-18.4963 -77.5)">
            <path
              id="dots03"
              d="M18.4963 73C16.0063 73 13.9963 75.01 13.9963 77.5C13.9963 79.99 16.0063 82 18.4963 82C20.9863 82 22.9963 79.99 22.9963 77.5C22.9963 75.01 20.9863 73 18.4963 73Z"
              fill="#000091"
            />
          </g>
        </g>
      </g>
      <g transform="translate(36.4963 77.5)">
        <g class="password-dot password-dot-2">
          <g transform="translate(-36.4963 -77.5)">
            <path
              id="dots02"
              d="M31.9963 77.5C31.9963 75.01 34.0063 73 36.4963 73C38.9863 73 40.9963 75.01 40.9963 77.5C40.9963 79.99 38.9863 82 36.4963 82C34.0063 82 31.9963 79.99 31.9963 77.5Z"
              fill="#000091"
            />
          </g>
        </g>
      </g>
      <g transform="translate(54.4963 77.5)">
        <g class="password-dot password-dot-3">
          <g transform="translate(-54.4963 -77.5)">
            <path
              id="dots01"
              d="M54.4963 82C56.9863 82 58.9963 79.99 58.9963 77.5C58.9963 75.01 56.9863 73 54.4963 73C52.0063 73 49.9963 75.01 49.9963 77.5C49.9963 79.99 52.0063 82 54.4963 82Z"
              fill="#000091"
            />
          </g>
        </g>
      </g>
    </g>
    <g id="Group">
      <g id="lock">
        <path
          id="Vector_3"
          d="M63.9963 19H27.9963C26.3395 19 24.9963 20.3838 24.9963 22.0909V49.9091C24.9963 51.6162 26.3395 53 27.9963 53H63.9963C65.6532 53 66.9963 51.6162 66.9963 49.9091V22.0909C66.9963 20.3838 65.6532 19 63.9963 19Z"
          fill="#8585F6"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_4"
          d="M57.9963 19V13C57.9963 6.37258 52.6238 1 45.9963 1C39.3689 1 33.9963 6.37258 33.9963 13V19H39.9963V13C39.9963 9.68629 42.6826 7 45.9963 7C49.31 7 51.9963 9.68629 51.9963 13V19H57.9963Z"
          fill="#E3E3FD"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g id="feature-anchor" transform="translate(46 36)">
          <g id="feature">
            <g transform="translate(-46 -36)">
              <g id="arrow">
                <path id="Vector_5" d="M53.9963 25V32H46.9963" stroke="#000091" stroke-width="3" />
                <path
                  id="Ellipse 297"
                  d="M54.9963 36C54.9963 40.9706 50.9669 45 45.9963 45C41.0258 45 36.9963 40.9706 36.9963 36C36.9963 31.0294 41.0258 27 45.9963 27C49.5301 27 52.5881 29.0366 54.0608 32"
                  stroke="#000091"
                  stroke-width="3"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
      <path
        id="decorative"
        d="M18.9971 34V21.475C18.9971 17.56 21.5021 14.23 24.9971 13"
        stroke="#6A6AF4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        class="draw-trace"
      />
      <path
        id="decorative_2"
        d="M72.9971 35.0078V47.5028"
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
  #picto-changer-mdp {
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
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
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
