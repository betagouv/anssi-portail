<script lang="ts">
  import { détecteRendu } from '../utils/rendu.svelte';
  import { suitLaVisibilité } from '../utils/visibilite.svelte';

  const { survol }: { survol?: boolean } = $props();

  const rendu = détecteRendu();
  let conteneur = $state<HTMLElement>();
  const àLÉcran = suitLaVisibilité(() => conteneur);

  const animée = $derived(survol || (rendu.estMobile && àLÉcran.visible));
</script>

<div bind:this={conteneur}>
  <svg
    id="reflexes-animation"
    xmlns="http://www.w3.org/2000/svg"
    width="192"
    height="128"
    viewBox="0 0 192 128"
    fill="none"
    role="img"
    aria-labelledby="reflexes-title reflexes-description"
    class:animée
  >
    <title id="reflexes-title">Pictogramme interactif des réflexes</title>
    <desc id="reflexes-description"
      >Au survol, les applications disparaissent et une alerte d'insecte avec deux indicateurs de connexion coupée
      apparaît avec un léger rebond.</desc
    >

    <rect width="192" height="128" fill="transparent" pointer-events="all" />

    <g id="screen">
      <path
        id="screen-outer"
        d="M32 23C32 19.6863 34.6863 17 38 17H154C157.314 17 160 19.6863 160 23V101H32V23Z"
        fill="#E3E3FD"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      <path
        id="screen-inner"
        d="M37 24C37 22.8954 37.8954 22 39 22H153C154.105 22 155 22.8954 155 24V96H37V24Z"
        fill="white"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </g>

    <g id="keyboard">
      <path
        d="M22 103C22 101.895 22.8954 101 24 101H168C169.105 101 170 101.895 170 103C170 107.418 166.418 111 162 111H30C25.5817 111 22 107.418 22 103Z"
        fill="#E3E3FD"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M84 102.25C84 101.56 84.5596 101 85.25 101H106.75C107.44 101 108 101.56 108 102.25C108 104.321 106.321 106 104.25 106H87.75C85.6789 106 84 104.321 84 102.25Z"
        fill="#CACAFB"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </g>

    <g id="apps">
      <g id="mail">
        <rect x="56" y="41" width="36" height="36" rx="8" fill="#E3E3FD" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M65 50H83C83.5523 50 84 50.4477 84 51V67C84 67.5523 83.5523 68 83 68H65C64.4477 68 64 67.5523 64 67V51C64 50.4477 64.4477 50 65 50ZM82 54.238L74.072 61.338L66 54.216V66H82V54.238ZM66.511 52L74.061 58.662L81.502 52H66.511Z"
          fill="#000091"
        />
      </g>
      <g id="calendar">
        <rect x="100" y="41" width="36" height="36" rx="8" fill="#E3E3FD" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M115 48V50H121V48H123V50H127C127.552 50 128 50.4477 128 51V67C128 67.5523 127.552 68 127 68H109C108.448 68 108 67.5523 108 67V51C108 50.4477 108.448 50 109 50H113V48H115ZM126 58H110V66H126V58ZM117 60V64H112V60H117ZM113 52H110V56H126V52H123V54H121V52H115V54H113V52Z"
          fill="#000091"
        />
      </g>
    </g>

    <g id="alerte">
      <rect
        x="56"
        y="29"
        width="80"
        height="60"
        rx="4"
        fill="#8585F6"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      <path
        transform="translate(0 8)"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M88.0745 46.0667C88.1595 45.9312 88.248 45.7978 88.3398 45.6667H103.66C103.752 45.7974 103.84 45.9321 103.925 46.0667L106.619 44.5121L107.952 46.8214L105.001 48.5254C105.217 49.3121 105.333 50.1427 105.333 51.0001V52.3334H109.333V55.0001H105.333C105.333 56.2707 105.08 57.4827 104.619 58.5868L107.952 60.5121L106.619 62.8214L103.251 60.8774C101.772 62.7035 99.6587 63.904 97.3332 64.2388V53.6667H94.6665V64.2401C92.3408 63.905 90.2274 62.704 88.7492 60.8774L85.3812 62.8214L84.0478 60.5121L87.3812 58.5881C86.9079 57.4512 86.665 56.2316 86.6665 55.0001H82.6665V52.3334H86.6665V51.0001C86.6665 50.1427 86.7825 49.3134 86.9985 48.5254L84.0478 46.8214L85.3812 44.5121L88.0745 46.0667ZM90.6665 43.0001C90.6665 40.0546 93.0543 37.6667 95.9998 37.6667C98.9454 37.6667 101.333 40.0546 101.333 43.0001H90.6665Z"
        fill="#000091"
      />
    </g>

    <g id="badge-wifi">
      <rect
        x="22"
        y="29"
        width="28"
        height="28"
        rx="14"
        fill="white"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      <path
        d="M35.9999 46.9998C36.4761 46.9998 36.9134 47.1662 37.2569 47.4441L35.9999 48.9998L34.7428 47.4441C35.0863 47.1662 35.5236 46.9998 35.9999 46.9998ZM29.8716 35.9287L41.6567 47.7138L40.7139 48.6566L38.2595 46.2027L38.0948 46.4069C37.5224 45.9438 36.7935 45.6664 35.9999 45.6664C35.2065 45.6664 34.4779 45.9436 33.9056 46.4064L32.6489 44.8504C33.4996 44.1626 34.566 43.731 35.7308 43.6731L34.5487 42.4915C33.5284 42.718 32.5961 43.1783 31.8109 43.8132L30.5538 42.2576C31.2661 41.6815 32.0716 41.216 32.9441 40.8872L31.9231 39.8658C31.1271 40.2216 30.386 40.6785 29.7164 41.22L28.4595 39.6643C29.0689 39.1714 29.7275 38.737 30.4269 38.3696L28.9288 36.8715L29.8716 35.9287ZM38.7228 42.9127L36.1442 40.3347L35.9999 40.3331C38.063 40.3331 39.9578 41.054 41.446 42.2577L40.1892 43.8135C39.744 43.4535 39.2516 43.1496 38.7228 42.9127ZM35.9999 36.9998C38.8564 36.9998 41.4798 37.9979 43.5404 39.6644L42.2834 41.2201C40.5663 39.8315 38.3802 38.9998 35.9999 38.9998C35.6188 38.9998 35.2426 39.0211 34.8726 39.0626L33.1495 37.3403C34.0632 37.1178 35.0177 36.9998 35.9999 36.9998Z"
        fill="#000091"
      />
    </g>

    <g id="badge-globe">
      <rect
        x="141"
        y="45"
        width="28"
        height="28"
        rx="14"
        fill="white"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      <path
        d="M161.691 61.9192L160.276 63.3333L161.691 64.748L160.748 65.6907L159.333 64.276L157.919 65.6907L156.977 64.748L158.391 63.3333L156.977 61.9192L157.919 60.9765L159.333 62.3905L160.748 60.9765L161.691 61.9192ZM155.319 52.3411C158.853 52.5078 161.667 55.425 161.667 58.9999V59.6666H153.689C153.793 61.359 154.291 62.9435 155.093 64.3307C155.147 64.3297 155.202 64.3299 155.256 64.3274C155.369 64.3221 155.482 64.313 155.593 64.3007L155.74 65.6263C155.601 65.6416 155.461 65.6521 155.319 65.6588C155.213 65.6638 155.107 65.6666 155 65.6666C154.893 65.6666 154.787 65.6638 154.681 65.6588C151.147 65.492 148.333 62.5749 148.333 58.9999C148.333 55.425 151.147 52.5078 154.681 52.3411C154.787 52.3361 154.893 52.3333 155 52.3333C155.107 52.3333 155.213 52.3361 155.319 52.3411ZM149.71 59.6666C149.974 61.7848 151.479 63.5173 153.475 64.1119C152.833 62.7503 152.44 61.2491 152.354 59.6666H149.71ZM153.475 53.8873C151.479 54.4818 149.974 56.215 149.71 58.3333H152.354C152.44 56.7505 152.833 55.249 153.475 53.8873ZM155 53.8346C154.253 55.1819 153.789 56.7075 153.689 58.3333H156.311C156.211 56.7075 155.748 55.1819 155 53.8346ZM156.524 53.8873C157.167 55.2491 157.56 56.7504 157.647 58.3333H160.29C160.026 56.2148 158.521 54.4817 156.524 53.8873Z"
        fill="#000091"
      />
    </g>

    <path
      id="trace"
      d="M152 11H154.8C160.986 11 166 16.0144 166 22.2V25"
      stroke="#6A6AF4"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>

<style lang="scss">
  #reflexes-animation {
    cursor: pointer;

    #apps {
      transform-origin: 0 0;
      transform-box: view-box;
      transition:
        transform 250ms ease-in,
        opacity 200ms ease-in;
    }

    #alerte,
    #badge-wifi,
    #badge-globe {
      opacity: 0;
      transform-origin: 0 0;
      transform-box: view-box;
      transition:
        transform 620ms cubic-bezier(0.32, 1.42, 0.58, 1),
        opacity 190ms ease-out;
      pointer-events: none;
    }

    #alerte {
      transform: matrix(0.72, 0, 0, 0.72, 26.88, 16.52);
    }

    #badge-wifi {
      transform: matrix(0.75, 0, 0, 0.75, 9, 10.75);
    }

    #badge-globe {
      transform: matrix(0.75, 0, 0, 0.75, 38.75, 14.75);
    }

    #trace {
      transition: transform 350ms ease-out;
    }

    &:hover,
    &.animée {
      #trace {
        transform: translateY(1px);
      }

      #apps {
        opacity: 0;
        transform: matrix(0.8, 0, 0, 0.8, 19.2, 11.8);
      }

      #alerte,
      #badge-wifi,
      #badge-globe {
        opacity: 1;
        transform: matrix(1, 0, 0, 1, 0, 0);
      }

      #alerte {
        transition-delay: 110ms, 110ms;
      }

      #badge-wifi {
        transition-delay: 190ms, 190ms;
      }

      #badge-globe {
        transition-delay: 260ms, 260ms;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #reflexes-animation * {
      -webkit-transition-duration: 1ms !important;
      transition-duration: 1ms !important;
      -webkit-transition-delay: 0ms !important;
      transition-delay: 0ms !important;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    #reflexes-animation * {
      animation: none !important;
      transition-duration: 1ms !important;
    }
  }
</style>
