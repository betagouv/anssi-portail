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
    </defs>

    <g id="cyber-gradient" opacity="0.4" clip-path="url(#cyber-gradient-clip)">
      <foreignObject x="42" y="10" width="108" height="108">
        <div xmlns="http://www.w3.org/1999/xhtml" class="cyber-gradient-fond"></div>
      </foreignObject>
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
      />
    </g>
  </svg>
</div>

<style lang="scss">
  $transition-forme: 800ms cubic-bezier(0.34, 1.3, 0.64, 1);

  #cyberattaques-animation {
    cursor: pointer;

    &:hover,
    &.animée {
      #cyber-gradient {
        animation: cyber-gradient-rotation 2.4s linear infinite;
      }

      #malware-bg {
        r: 16px;
      }

      #malware-corps {
        x: 91px;
        y: 21px;
        width: 10px;
        height: 15px;
        rx: 5px;
      }

      #malware-tete {
        d: path('M101 26C97 26 95 26 91 26C91 23.2386 93.2386 21 96 21C98.7614 21 101 23.2386 101 26Z');
      }

      #malware-pattes {
        d: path(
          'M104 23C104 24.6569 102.657 26 101 26M88 23C88 24.6569 89.3431 26 91 26M104 33C104 31.3431 102.657 30 101 30M88 33C88 31.3431 89.3431 30 91 30'
        );
      }

      #malware-antenne {
        d: path('M100 18C100 20.2091 98.2091 22 96 22C93.7909 22 92 20.2091 92 18');
      }

      #spy * {
        transition-delay: 60ms;
      }

      #spy-bg {
        r: 13px;
      }

      #spy-oeil {
        d: path(
          'M61.1383 49.1055C62.4138 50.0958 62.4138 51.9042 61.1383 52.8945C59.8066 53.9284 57.7605 55 55 55C52.2395 55 50.1934 53.9284 48.8617 52.8945C47.5862 51.9042 47.5862 50.0958 48.8617 49.1055C50.1934 48.0716 52.2395 47 55 47C57.7605 47 59.8066 48.0716 61.1383 49.1055Z'
        );
      }

      #spy-pupille {
        r: 2px;
      }

      #bourse * {
        transition-delay: 120ms;
      }

      #bourse-bg {
        r: 14px;
      }

      #bourse-noeud {
        d: path(
          'M115 86L112 82.1702C112 82.1702 113.5 82.5532 115 82.1702C116.5 81.7872 118 82.1702 118 82.1702L115 86Z'
        );
      }

      #bourse-sac {
        d: path(
          'M122.112 93.6154C122.112 97.4814 118.866 99 115 99C111.134 99 108.112 97.4814 108.112 93.6154C108.112 89.7494 112 85 115 85C118 85 122.112 89.7494 122.112 93.6154Z'
        );
      }

      #bourse-euros {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  #cyber-gradient {
    transform-box: fill-box;
    transform-origin: center;
  }

  .cyber-gradient-fond {
    width: 108px;
    height: 108px;
    background: conic-gradient(from 90deg, rgba(255, 255, 255, 0) 0deg, rgba(106, 106, 244, 1) 360deg);
  }

  #malware-bg,
  #spy-bg,
  #bourse-bg,
  #spy-pupille {
    transition: r $transition-forme;
  }

  #malware-corps {
    transition:
      x $transition-forme,
      y $transition-forme,
      width $transition-forme,
      height $transition-forme,
      rx $transition-forme;
  }

  #malware-tete,
  #malware-pattes,
  #malware-antenne,
  #spy-oeil,
  #bourse-noeud,
  #bourse-sac {
    transition: d $transition-forme;
  }

  #bourse-euros {
    opacity: 0;
    transform: scale(0.7);
    transform-box: fill-box;
    transform-origin: center;
    transition:
      opacity 400ms ease-out,
      transform $transition-forme;
  }

  @keyframes cyber-gradient-rotation {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #cyberattaques-animation * {
      animation: none !important;
      transition-duration: 1ms !important;
    }
  }
</style>
