<script lang="ts">
  type Props = {
    texte: string;
    enPause?: boolean;
  };

  const { texte, enPause = false }: Props = $props();
  const lettres = $derived(texte.split('').concat('\u00A0'));
</script>

<span class="machine-a-ecrire" class:en-pause={enPause} aria-label={texte}>
  {#each lettres as lettre, i (`${texte}-${i}`)}
    {@const estDernièreLettre = i === lettres.length - 1}
    <span aria-hidden="true" class="lettre" class:curseur={estDernièreLettre} style="animation-delay: {i * 0.05}s">
      {lettre}
    </span>
  {/each}
</span>

<style lang="scss">
  .machine-a-ecrire {
    display: inline;
  }

  .en-pause .lettre,
  .en-pause .curseur {
    animation-play-state: paused;
  }

  .lettre {
    opacity: 0;
    animation: apparition-lettre 0.05s linear forwards;
  }

  .curseur {
    border-right: 4px solid var(--yellow-moutarde-925-125);
    opacity: 0;
    animation:
      apparition 0.01s linear forwards,
      curseur-clignotant 0.75s step-end infinite;
    animation-fill-mode: forwards, none;
    vertical-align: text-bottom;
  }

  @keyframes apparition-lettre {
    0% {
      border-right: 4px solid var(--yellow-moutarde-925-125);
      opacity: 1;
    }
    90% {
      border-right: 4px solid var(--yellow-moutarde-925-125);
    }
    100% {
      opacity: 1;
      border-right: none;
    }
  }

  @keyframes apparition {
    to {
      opacity: 1;
    }
  }

  @keyframes curseur-clignotant {
    from,
    to {
      border-color: transparent;
    }
    50% {
      border-color: var(--yellow-moutarde-925-125);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lettre,
    .curseur {
      opacity: 1;
      animation: none;
    }
  }
</style>
