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
    id="cyberattaques-animation"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="192"
    height="128"
    viewBox="0 0 192 128"
    fill="none"
    role="img"
    aria-labelledby="cyber-title cyber-description"
    class:animée
  >
    <title id="cyber-title">Illustration interactive des cyberattaques</title>
    <desc id="cyber-description">Les symboles grandissent et le gradient tourne pendant le survol.</desc>

    <defs>
      <clipPath id="cyber-gradient-clip">
        <circle cx="96" cy="64" r="54" />
      </clipPath>
      <path id="cyber-gradient-wedge" d="M96 64L96 10A54 54 0 0 1 105.377 10.821Z" fill="#6A6AF4" />
    </defs>

    <g id="cyber-gradient-base">
      <g id="cyber-gradient" opacity="0.4" clip-path="url(#cyber-gradient-clip)">
        <use href="#cyber-gradient-wedge" xlink:href="#cyber-gradient-wedge" opacity="0" />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(10 96 64)"
          opacity="0.028"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(20 96 64)"
          opacity="0.056"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(30 96 64)"
          opacity="0.083"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(40 96 64)"
          opacity="0.111"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(50 96 64)"
          opacity="0.139"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(60 96 64)"
          opacity="0.167"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(70 96 64)"
          opacity="0.194"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(80 96 64)"
          opacity="0.222"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(90 96 64)"
          opacity="0.25"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(100 96 64)"
          opacity="0.278"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(110 96 64)"
          opacity="0.306"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(120 96 64)"
          opacity="0.333"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(130 96 64)"
          opacity="0.361"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(140 96 64)"
          opacity="0.389"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(150 96 64)"
          opacity="0.417"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(160 96 64)"
          opacity="0.444"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(170 96 64)"
          opacity="0.472"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(180 96 64)"
          opacity="0.5"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(190 96 64)"
          opacity="0.528"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(200 96 64)"
          opacity="0.556"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(210 96 64)"
          opacity="0.583"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(220 96 64)"
          opacity="0.611"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(230 96 64)"
          opacity="0.639"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(240 96 64)"
          opacity="0.667"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(250 96 64)"
          opacity="0.694"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(260 96 64)"
          opacity="0.722"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(270 96 64)"
          opacity="0.75"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(280 96 64)"
          opacity="0.778"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(290 96 64)"
          opacity="0.806"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(300 96 64)"
          opacity="0.833"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(310 96 64)"
          opacity="0.861"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(320 96 64)"
          opacity="0.889"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(330 96 64)"
          opacity="0.917"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(340 96 64)"
          opacity="0.944"
        />
        <use
          href="#cyber-gradient-wedge"
          xlink:href="#cyber-gradient-wedge"
          transform="rotate(350 96 64)"
          opacity="0.972"
        />
      </g>
    </g>
    <g id="cyber-gradient-motion" transform="rotate(0 96 64)">
      <use href="#cyber-gradient" xlink:href="#cyber-gradient" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 96 64"
        to="360 96 64"
        dur="2.824s"
        begin="cyber.mouseenter"
        end="cyber.mouseleave"
        repeatCount="indefinite"
        fill="freeze"
        restart="always"
      />
      <animateTransform
        attributeName="transform"
        type="rotate"
        to="0 96 64"
        dur="0.6s"
        begin="cyber.mouseleave"
        fill="freeze"
        restart="always"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.22 1 0.36 1"
      />
    </g>

    <g id="chart">
      <path
        d="M96 10L147 47.4327L127.52 108H64.4803L45 47.4327L96 10Z"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M96 25.478L132.429 52.2156L118.514 95.478H73.4859L59.5714 52.2156L96 25.478Z"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M96 40.956L117.857 56.9986L109.508 82.956H82.4915L74.1429 56.9986L96 40.956Z"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M96 56.4341L103.286 61.7816L100.503 70.4341H91.4972L88.7143 61.7816L96 56.4341Z"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <g id="malware-base">
      <g id="malware">
        <circle
          id="malware-bg"
          cx="96"
          cy="27"
          r="9"
          fill="#6A6AF4"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect
          id="malware-corps"
          x="93"
          y="24"
          width="6"
          height="8"
          rx="3"
          fill="white"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="malware-tete"
          d="M99 27C96.6 27 95.4 27 93 27C93 25.3431 94.3431 24 96 24C97.6569 24 99 25.3431 99 27Z"
          fill="#000091"
        />
        <path
          id="malware-pattes"
          d="M101 25C101 26.1046 100.105 27 99 27M91 25C91 26.1046 91.8954 27 93 27M101 31C101 29.8954 100.105 29 99 29M91 31C91 29.8954 91.8954 29 93 29"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="malware-antenne"
          d="M98 22C98 23.1046 97.1046 24 96 24C94.8954 24 94 23.1046 94 22"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </g>

    <g id="spy-base">
      <g id="spy">
        <circle
          id="spy-bg"
          cx="55"
          cy="51"
          r="9"
          fill="#6A6AF4"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="spy-oeil"
          d="M59.1726 49.9146C59.7539 50.5353 59.7539 51.4647 59.1726 52.0854C58.3682 52.9443 56.9774 54 55 54C53.0226 54 51.6318 52.9443 50.8274 52.0854C50.2461 51.4647 50.2461 50.5353 50.8274 49.9146C51.6318 49.0557 53.0226 48 55 48C56.9774 48 58.3682 49.0557 59.1726 49.9146Z"
          fill="white"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle id="spy-pupille" cx="55" cy="51" r="1" fill="#000091" />
      </g>
    </g>

    <g id="bourse-base">
      <g id="bourse">
        <circle
          id="bourse-bg"
          cx="115"
          cy="90"
          r="9"
          fill="#6A6AF4"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="bourse-noeud"
          d="M115 87.7142L113.286 85.5257C113.286 85.5257 114.143 85.7446 115 85.5257C115.858 85.3069 116.715 85.5257 116.715 85.5257L115 87.7142Z"
          fill="#000091"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="bourse-sac"
          d="M119.064 92.0659C119.064 94.275 117.209 95.1428 115 95.1428C112.791 95.1428 111.064 94.275 111.064 92.0659C111.064 89.8568 113.286 87.1428 115 87.1428C116.714 87.1428 119.064 89.8568 119.064 92.0659Z"
          fill="white"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="bourse-euros"
          d="M116 95C114.343 95 113 93.6569 113 92C113 90.3431 114.343 89 116 89M112 92H116"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0"
          transform="matrix(0.7 0 0 0.7 34.2 27.6)"
        />
      </g>
    </g>

    <g id="malware-motion"><use href="#malware" xlink:href="#malware" /></g>
    <g id="spy-motion"><use href="#spy" xlink:href="#spy" /></g>
    <g id="bourse-motion">
      <use href="#bourse" xlink:href="#bourse" />
      <path
        id="bourse-euros-motion"
        d="M116 95C114.343 95 113 93.6569 113 92C113 90.3431 114.343 89 116 89M112 92H116"
        stroke="#000091"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        transform="matrix(0.7 0 0 0.7 34.2 27.6)"
      />
    </g>

    <rect id="cyber" width="192" height="128" fill="transparent" pointer-events="all" />
  </svg>
</div>

<style lang="scss">
  #cyberattaques-animation {
    cursor: pointer;

    &:hover,
    &.animée {
      #cyber-gradient-base,
      #malware-base,
      #spy-base,
      #bourse-base {
        opacity: 0;
      }

      #cyber-gradient-motion,
      #malware-motion,
      #spy-motion,
      #bourse-motion {
        opacity: 1;
      }

      #malware-motion,
      #spy-motion,
      #bourse-motion {
        animation: cyber-pulse 2824ms linear infinite;
      }

      #bourse-motion {
        animation-delay: 1128ms;
      }

      #spy-motion {
        animation-delay: 2256ms;
      }

      #bourse-euros-motion {
        animation: cyber-euros 2824ms linear 1128ms infinite;
      }
    }
  }

  #cyber-gradient,
  #cyber-gradient-motion,
  #malware-motion,
  #spy-motion,
  #bourse-motion {
    pointer-events: none;
  }

  #cyber-gradient-base,
  #cyber-gradient-motion,
  #malware-base,
  #spy-base,
  #bourse-base,
  #malware-motion,
  #spy-motion,
  #bourse-motion {
    transition: opacity 376ms ease-out;
  }

  #cyber-gradient-base,
  #malware-base,
  #spy-base,
  #bourse-base {
    opacity: 1;
  }

  #cyber-gradient-motion,
  #malware-motion,
  #spy-motion,
  #bourse-motion {
    opacity: 0;
  }

  #cyber-gradient-base,
  #cyber-gradient-motion {
    transition-duration: 600ms;
  }

  #malware-motion,
  #spy-motion,
  #bourse-motion {
    transform-origin: 0 0;
    transform-box: view-box;
    transform: matrix(1, 0, 0, 1, 0, 0);
  }

  #malware-motion {
    --pulse-peak: matrix(1.388889, 0, 0, 1.388889, -37.3333, -10.5);
  }

  #bourse-motion {
    --pulse-peak: matrix(1.277778, 0, 0, 1.277778, -31.9444, -25);
  }

  #spy-motion {
    --pulse-peak: matrix(1.222222, 0, 0, 1.222222, -12.2222, -11.3333);
  }

  #bourse-euros-motion {
    opacity: 0;
  }

  @keyframes cyber-pulse {
    0% {
      transform: matrix(1, 0, 0, 1, 0, 0);
      animation-timing-function: cubic-bezier(0.34, 1.3, 0.64, 1);
    }
    17.49% {
      transform: var(--pulse-peak);
      animation-timing-function: cubic-bezier(0.34, 1.3, 0.64, 1);
    }
    37.5%,
    100% {
      transform: matrix(1, 0, 0, 1, 0, 0);
    }
  }

  @keyframes cyber-euros {
    0% {
      opacity: 0;
    }
    17.49% {
      opacity: 1;
    }
    37.5%,
    100% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #cyber-gradient-motion,
    #malware-motion,
    #spy-motion,
    #bourse-motion,
    #bourse-euros-motion {
      animation: none;
      transition: none;
    }

    #cyber-gradient-base,
    #malware-base,
    #spy-base,
    #bourse-base {
      transition: none;
      opacity: 1 !important;
    }

    #cyber-gradient-motion,
    #malware-motion,
    #spy-motion,
    #bourse-motion {
      opacity: 0 !important;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    #cyberattaques-animation * {
      animation: none !important;
      transition-duration: 1ms !important;
    }
  }
</style>
