<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    motif?: 'cercle' | 'gribouillis' | 'vague';
    couleur?: 'cafe-creme' | 'macaron';
    petit?: boolean;
  }

  let { children, motif, couleur, petit }: Props = $props();
</script>

<span class={['mot-en-exergue', motif, couleur, petit ? 'petit' : '']}>
  {@render children()}
</span>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .mot-en-exergue {
    position: relative;
    white-space: nowrap;
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
        background-image: url('/assets/images/motif-mot-souligne-vague-moutarde.svg');
        background-position: left center;
        bottom: 0;
      }

      &.macaron {
        &::after {
          background-image: url('/assets/images/motif-mot-souligne-vague-macaron.svg');
        }
      }

      &.petit {
        &::after {
          background-image: url('/assets/images/motif-mot-souligne-petite-vague-macaron.svg');
        }
      }
    }

    &.cercle {
      --left: 50%;
      --height: 100%;
      --width: 120%;

      &::after {
        background-image: url('/assets/images/motif-mot-entoure-moutarde.svg');
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &.gribouillis {
      --height: 42px;

      &::after {
        background-image: url('/assets/images/motif-mot-souligne-gribouillis-macaron.svg');
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
