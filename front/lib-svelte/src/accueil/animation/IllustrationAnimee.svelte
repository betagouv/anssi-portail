<script lang="ts">
  import { préfèreMouvementRéduit } from '../../utils/mouvementReduit.svelte';
  import Association from './Association.svelte';
  import DPO from './DPO.svelte';
  import DSI from './DSI.svelte';
  import RSSI from './RSSI.svelte';

  const DURÉE_SCÈNE_EN_MS = 5500;

  const scènes = [DSI, DPO, Association, RSSI];

  const mouvement = préfèreMouvementRéduit();
  let index = $state(0);

  $effect(() => {
    if (mouvement.réduit) {
      index = 0;
      return;
    }

    const intervalle = setInterval(() => {
      index = (index + 1) % scènes.length;
    }, DURÉE_SCÈNE_EN_MS);

    return () => {
      clearInterval(intervalle);
    };
  });
</script>

<div
  class="illustration-animee"
  role="img"
  aria-label="Des responsables d’organisations protègent leur activité, leurs données et leurs équipes."
>
  {#each scènes as Scène, i (i)}
    <div class="scene" class:active={i === index}>
      <Scène />
    </div>
  {/each}
</div>

<style lang="scss">
  .illustration-animee {
    position: relative;
    width: 100%;
    aspect-ratio: 522 / 363;
  }

  .scene {
    position: absolute;
    inset: 0;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.5s ease,
      visibility 0s linear 0.5s;

    :global(svg) {
      width: 100%;
      height: 100%;
    }

    :global(.icone) {
      transform-box: fill-box;
      transform-origin: center;
    }

    &:not(.active) :global(*) {
      animation: none;
    }

    &.active {
      opacity: 1;
      visibility: visible;
      transition-delay: 0s;

      :global(.image),
      :global(.icone),
      :global(.bulle),
      :global(.profil) {
        will-change: transform, opacity;
      }

      :global(.image) {
        animation: apparition-photo 0.6s ease-out 0s both;
      }
      :global(.trace) {
        animation: dessin-trace 1s ease-in-out 0.25s both;
      }
      :global(.icone) {
        animation: apparition-icone 0.5s ease-out 0.6s both;
      }
      :global(.bulle) {
        animation: apparition-bulle 0.6s ease-out 0.8s both;
      }
      :global(.profil) {
        animation: apparition-profil 0.6s ease-out 1s both;
      }
    }
  }

  @keyframes apparition-photo {
    from {
      opacity: 0;
    }
  }

  @keyframes apparition-bulle {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
  }

  @keyframes apparition-profil {
    from {
      opacity: 0;
      transform: translateX(-18px);
    }
  }

  @keyframes apparition-icone {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    55% {
      opacity: 1;
      transform: scale(1.06);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes dessin-trace {
    from {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }
    to {
      stroke-dasharray: 1;
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scene,
    .scene :global(*) {
      animation: none !important;
      transition: none !important;
    }

    .scene:not(.active) {
      display: none;
    }
  }
</style>
