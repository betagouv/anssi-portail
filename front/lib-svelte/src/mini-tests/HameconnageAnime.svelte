<script lang="ts">
  import { détecteRendu } from '../utils/rendu.svelte';
  import { suitLaVisibilité } from '../utils/visibilite.svelte';

  const { survol = $bindable() }: { survol?: boolean } = $props();

  const rendu = détecteRendu();
  let conteneur = $state<HTMLElement>();
  const àLÉcran = suitLaVisibilité(() => conteneur);

  const animée = $derived(survol || (rendu.estMobile && àLÉcran.visible));
</script>

<div bind:this={conteneur}>
  <svg
    class="courriels"
    viewBox="0 0 192 128"
    width="192"
    height="128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class:animée
  >
    <g transform="translate(20.4076 -6)">
      <g transform="translate(0 45.8632)">
        <path
          d="M3.15916 18.23L70.659 0.143493C72.8895 -0.454207 75.1827 0.869895 75.7804 3.10039L87.1784 45.6398C87.7764 47.8704 86.4524 50.1636 84.2224 50.7613L16.659 68.8648C14.4285 69.4628 12.1353 68.1388 11.5376 65.9078L0.139166 23.3684C-0.458534 21.1378 0.928565 18.8277 3.15916 18.23Z"
          fill="#F4F6FF"
          stroke="#000091"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path
          transform="translate(2.10677 0.234196)"
          d="M0 18.6337L36.9701 34.4296C40.6861 36.0316 45.0157 34.8387 47.3888 31.557L70.4474 0"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>

      <g transform="translate(60.4448 45.8775)">
        <path
          d="M16.7266 0.144703L84.2266 18.2312C86.4571 18.8289 87.7813 21.1221 87.1836 23.3526L75.7846 65.8925C75.1876 68.1225 72.8936 69.4465 70.6636 68.8485L3.10035 50.7455C0.869853 50.1478 -0.45414 47.8546 0.143459 45.6241L11.5419 3.0846C12.1396 0.854103 14.4961 -0.452997 16.7266 0.144703Z"
          fill="#DDE5FF"
          stroke="#000091"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path
          transform="translate(15.4963 0.170902)"
          d="M0 0L24.1188 32.1647C26.5363 35.4097 30.8823 36.5424 34.5783 34.8862L70.3258 19.0865"
          stroke="#000091"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>

      <g class="peche" transform="translate(30.5924 0)">
        <g class="enveloppe" transform="translate(0 40)">
          <path
            d="M86 0H5C2.23858 0 0 2.23858 0 5V56C0 58.7614 2.23858 61 5 61H86C88.7614 61 91 58.7614 91 56V5C91 2.23858 88.7614 0 86 0Z"
            fill="white"
            stroke="#000091"
            stroke-width="2"
          />
          <path
            transform="translate(2.4 1)"
            d="M0 0L37.9 28.3C41.58 31.22 46.8 31.18 50.44 28.22L86.1 0"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <path
          transform="translate(35 0)"
          d="M17 16.0684C18.74 16.6176 20 18.3425 20 20.1074C20 22.2458 18.728 23.6331 16.937 24.1533V41.3789C16.936 46.0607 13.1212 49.8758 8.4395 49.876C8.2922 49.876 8.1455 49.8719 8 49.8643L7.5 47.6064C7.8068 47.6541 8.1207 47.6787 8.4395 47.6787C11.9074 47.6786 14.739 44.8468 14.739 41.3789V24.1533C12.9477 23.633 11.6183 22.2458 11.6182 20.1074C11.6182 18.2285 13.0462 16.3944 15 15.9766V0H17V16.0684ZM0 31.0117C2.1965 32.6302 3.5838 34.5958 4.5664 36.3877H2.1963C2.1963 36.521 2.201 38.893 2.209 40.5H0.00779724C0.00269724 38.9024 0 36.5116 0 36.3877V31.0117ZM15.838 18.084C14.74 18.084 13.8145 19.0092 13.8145 20.1074C13.8146 21.2055 14.74 22.0722 15.838 22.0723C16.936 22.0723 17.804 21.2055 17.804 20.1074C17.804 19.0092 16.936 18.084 15.838 18.084Z"
          fill="#000091"
        />
        <path
          transform="translate(42.152 45.0001)"
          d="M2.92677 5.0001C1.95507 4.9838 1.00348 4.4999 0.42608 3.4999C-0.43992 1.9999 0.303775 0.8883 0.175775 0"
          stroke="#000091"
          stroke-width="2"
        />
      </g>
    </g>
  </svg>
</div>

<style lang="scss">
  .courriels {
    .peche,
    .enveloppe {
      transform-origin: 0 0;
    }

    &:hover,
    &.animée {
      .peche {
        animation: oscillation-peche 4.8s linear infinite;
      }

      .enveloppe {
        animation: balancement-enveloppe 4.8s linear infinite;
      }
    }
  }

  @keyframes oscillation-peche {
    0% {
      animation-timing-function: ease-in-out;
      transform: translateX(30.592px) translateY(0);
    }
    35% {
      animation-timing-function: ease-in-out;
      transform: translateX(30.592px) translateY(-5px);
    }
    75% {
      animation-timing-function: ease-in-out;
      transform: translateX(30.592px) translateY(2px);
    }
    100% {
      transform: translateX(30.592px) translateY(0);
    }
  }

  @keyframes balancement-enveloppe {
    0% {
      animation-timing-function: ease-in-out;
      transform: translateY(40px) translate(45.5px, 30.5px) rotate(0rad) translate(-45.5px, -30.5px);
    }
    16.67% {
      animation-timing-function: ease-in-out;
      transform: translateY(40px) translate(45.5px, 30.5px) rotate(0.07rad) translate(-45.5px, -30.5px);
    }
    33.33% {
      animation-timing-function: ease-in-out;
      transform: translateY(40px) translate(45.5px, 30.5px) rotate(0rad) translate(-45.5px, -30.5px);
    }
    50% {
      animation-timing-function: ease-in-out;
      transform: translateY(40px) translate(45.5px, 30.5px) rotate(-0.07rad) translate(-45.5px, -30.5px);
    }
    66.67%,
    100% {
      transform: translateY(40px) translate(45.5px, 30.5px) rotate(0rad) translate(-45.5px, -30.5px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .courriels * {
      animation: none !important;
    }
  }
</style>
