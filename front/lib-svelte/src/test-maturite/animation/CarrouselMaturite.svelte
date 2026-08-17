<script lang="ts">
  import { préfèreMouvementRéduit } from '../../utils/mouvementReduit.svelte';
  import Confirme from './Confirme.svelte';
  import Decor from './Decor.svelte';
  import Emergent from './Emergent.svelte';
  import Insuffisant from './Insuffisant.svelte';
  import Intermediaire from './Intermediaire.svelte';
  import Optimal from './Optimal.svelte';
  import { suitLaVisibilité } from '../../utils/visibilite.svelte';

  type Props = {
    enPause?: boolean;
    duréeCarteEnMs?: number;
  };

  const { enPause = false, duréeCarteEnMs = 3500 }: Props = $props();

  const cartes = [
    { composant: Insuffisant, niveau: 'Insuffisant' },
    { composant: Emergent, niveau: 'Émergent' },
    { composant: Intermediaire, niveau: 'Intermédiaire' },
    { composant: Confirme, niveau: 'Confirmé' },
    { composant: Optimal, niveau: 'Optimal' },
  ];

  const CENTRE = Math.floor(cartes.length / 2);

  const mouvement = préfèreMouvementRéduit();
  const DURÉE_SORTIE_EN_MS = 320;

  let conteneur = $state<HTMLElement>();
  const àLÉcran = suitLaVisibilité(() => conteneur);
  const figé = $derived(enPause || !àLÉcran.visible);

  let actif = $state(0);
  let sortante = $state(-1);
  let sautante = $state(-1);

  const positionDe = (i: number) => ((i - actif + CENTRE + cartes.length) % cartes.length) - CENTRE;

  $effect(() => {
    if (mouvement.réduit || figé) {
      return;
    }

    let finSortie: ReturnType<typeof setTimeout>;
    let finSaut: ReturnType<typeof setTimeout>;

    const intervalle = setInterval(() => {
      sortante = (actif + CENTRE + 1) % cartes.length;

      finSortie = setTimeout(() => {
        sautante = sortante;
        sortante = -1;
        actif = (actif + 1) % cartes.length;
        finSaut = setTimeout(() => {
          sautante = -1;
        }, 60);
      }, DURÉE_SORTIE_EN_MS);
    }, duréeCarteEnMs);

    return () => {
      clearInterval(intervalle);
      clearTimeout(finSortie);
      clearTimeout(finSaut);
      sortante = -1;
      sautante = -1;
    };
  });
</script>

<div
  bind:this={conteneur}
  class="carrousel"
  class:en-pause={figé}
  role="img"
  aria-label="Cinq niveaux de maturité cyber, de insuffisant à optimal, illustrés par une plante qui pousse."
>
  <div class="decor"><Decor /></div>

  {#each cartes as { composant: Carte, niveau }, i (i)}
    {@const position = positionDe(i)}
    <div
      class="carte"
      data-position={position}
      class:sortie={i === sortante}
      class:saut={i === sautante}
      title={niveau}
    >
      <Carte />
    </div>
  {/each}
</div>

<style lang="scss">
  .carrousel {
    position: relative;
    width: 100%;
    transform-style: preserve-3d;
  }

  .decor {
    position: relative;
    z-index: 10;
    transform: translateZ(10px);
    pointer-events: none;

    :global(svg) {
      display: block;
      width: 100%;
      height: auto;
    }

    :global(.trace) {
      animation: dessin-trace 0.2s linear 0.1s both;
    }

    :global(.trace-boucle-1) {
      animation-duration: 0.1s;
      animation-delay: 0.1s;
    }

    :global(.trace-boucle-2) {
      animation-duration: 0.3s;
      animation-delay: 0.2s;
    }

    :global(.trace-boucle-3) {
      animation-duration: 0.11s;
      animation-delay: 0.5s;
    }

    :global(.trace-boucle-4) {
      animation-duration: 0.09s;
      animation-delay: 0.61s;
    }

    :global(.trace-boucle-5) {
      animation-duration: 0.1s;
      animation-delay: 0.7s;
    }

    :global(.trace-arc) {
      animation-duration: 0.2s;
      animation-delay: 0.4s;
    }

    :global(.trace-cercle) {
      animation-duration: 0.2s;
      animation-delay: 0.8s;
    }
  }

  .carte {
    position: absolute;
    left: 50%;
    top: 46.2%;
    width: 45.3%;
    opacity: 1;
    transition:
      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.7s ease;

    :global(svg) {
      width: 100%;
      height: auto;
      display: block;
    }

    &[data-position='0'] {
      transform: translate(-50%, -50%) translateZ(2px) scale(1);
    }

    &[data-position='-1'] {
      transform: translate(-50%, -50%) translateX(-50%) translateZ(1px) scale(0.727);
    }

    &[data-position='1'] {
      transform: translate(-50%, -50%) translateX(50%) translateZ(1px) scale(0.727);
    }

    &[data-position='-2'] {
      transform: translate(-50%, -50%) translateX(-75%) translateZ(0) scale(0.6);
    }

    &[data-position='2'] {
      transform: translate(-50%, -50%) translateX(75%) translateZ(0) scale(0.6);
    }

    &.sortie {
      transform: translate(-50%, -50%) translateX(-95%) translateZ(0) scale(0.5);
      opacity: 0;
      transition:
        transform 0.32s ease-in,
        opacity 0.32s ease-in;
    }

    &.saut {
      transition: none;
      opacity: 0;
    }
  }

  .en-pause .decor :global(.trace) {
    animation-play-state: paused;
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
    .carte,
    .decor :global(.trace) {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
