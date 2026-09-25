<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    motif?: 'cercle' | 'gribouillis' | 'vague';
    couleur?: 'cafe-creme' | 'macaron';
    petit?: boolean;
    urlBase?: string;
  }

  let { children, motif, couleur, petit, urlBase = '' }: Props = $props();

  const nomMotif = $derived.by(() => {
    if (motif === 'vague') {
      if (petit) return 'motif-mot-souligne-petite-vague-macaron';
      return couleur === 'macaron' ? 'motif-mot-souligne-vague-macaron' : 'motif-mot-souligne-vague-moutarde';
    }
    if (motif === 'cercle') return 'motif-mot-entoure-moutarde';
    if (motif === 'gribouillis') return 'motif-mot-souligne-gribouillis-macaron';
    return undefined;
  });

  const urlMotif = $derived(nomMotif ? `url('${urlBase}/assets/images/${nomMotif}.svg')` : 'none');

  let conteneur: HTMLElement | undefined;

  $effect(() => {
    conteneur?.style.setProperty('--url-motif', urlMotif);
  });
</script>

<span bind:this={conteneur} class={['mot-en-exergue', motif, couleur, petit ? 'petit' : '']}>
  {@render children()}
</span>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .mot-en-exergue {
    position: relative;
    white-space: break-spaces;
    z-index: 10;

    &::after {
      @include a-partir-de(sm) {
        content: '';
        position: absolute;
        left: var(--left, 0);
        width: var(--width, 100%);
        height: var(--height);
        pointer-events: none;
        background: {
          image: var(--url-motif);
          repeat: no-repeat;
          position: center;
          size: contain;
        }
        z-index: -1;
      }
    }

    &.vague {
      --height: 31px;

      &::after {
        background-position: left center;
        bottom: 0;
      }
    }

    &.cercle {
      --left: 50%;
      --height: 100%;
      --width: 120%;

      &::after {
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &.gribouillis {
      --height: 42px;

      &::after {
        bottom: 0;
        transform: translateY(33%);
      }
    }

    &.cafe-creme {
      &::after {
        filter: brightness(0) saturate(100%) invert(86%) sepia(22%) saturate(391%) hue-rotate(347deg) brightness(104%)
          contrast(98%);
      }
    }
  }
</style>
