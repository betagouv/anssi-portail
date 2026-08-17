<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import { préfèreMouvementRéduit } from '../../utils/mouvementReduit.svelte';
  import { suitLaVisibilité } from '../../utils/visibilite.svelte';

  type Props = {
    scènes: Component[];
    étiquette: string;
    décor?: Snippet<[number, number]>;
    enPause?: boolean;
    duréeScèneEnMs?: number;
  };

  const { scènes, étiquette, décor, enPause = false, duréeScèneEnMs = 5500 }: Props = $props();

  const mouvement = préfèreMouvementRéduit();
  let conteneur = $state<HTMLElement>();
  const àLÉcran = suitLaVisibilité(() => conteneur);
  const figée = $derived(enPause || !àLÉcran.visible);

  let index = $state(0);

  $effect(() => {
    if (mouvement.réduit) {
      index = 0;
      return;
    }

    if (figée) {
      return;
    }

    const intervalle = setInterval(() => {
      index = (index + 1) % scènes.length;
    }, duréeScèneEnMs);

    return () => {
      clearInterval(intervalle);
    };
  });
</script>

<div bind:this={conteneur} class="illustration-animee" class:en-pause={figée} role="img" aria-label={étiquette}>
  {#if décor}
    <div class="decor">{@render décor(index, scènes.length)}</div>
  {/if}
  {#each scènes as Scène, i (i)}
    <div class="scene" class:active={i === index} class:gabarit={i === 0}>
      <Scène />
    </div>
  {/each}
</div>

<style lang="scss">
  // L'animation se base sur une convention de nommage : chaque scène expose
  // les calques qu'elle possède parmi les classes ci-dessous, et hérite de
  // l'animation correspondante.

  .illustration-animee {
    position: relative;
    width: 100%;
  }

  .decor {
    position: absolute;
    inset: 0;

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .en-pause .scene :global(*) {
    animation-play-state: paused !important;
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

    :global(.icone),
    :global(.forme) {
      transform-box: fill-box;
      transform-origin: center;
    }

    &.gabarit {
      position: relative;

      :global(svg) {
        height: auto;
      }
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
      :global(.profil),
      :global(.carte),
      :global(.forme) {
        will-change: transform, opacity;
      }

      :global(.image) {
        animation: apparition-photo 0.6s ease-out 0s both;
      }
      :global(.trace) {
        animation: dessin-trace 1s ease-in-out 0.25s both;
      }
      :global(.carte) {
        animation: apparition-bulle 0.6s ease-out 0.55s both;
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
      :global(.forme) {
        animation: apparition-icone 0.5s ease-out 1.1s both;
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
