<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    pleineLargeur?: boolean;
    colonnesÉgales?: boolean;
    children: Snippet;
  }

  let { pleineLargeur = false, colonnesÉgales = false, children }: Props = $props();
</script>

<div class="rangee" class:pleine-largeur={pleineLargeur} class:colonnes-egales={colonnesÉgales}>
  {@render children()}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .rangee {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;

    @include a-partir-de(md) {
      grid-template-columns: 1fr 2fr;
    }

    &.pleine-largeur {
      grid-template-columns: 1fr;
    }

    &.colonnes-egales {
      @include a-partir-de(md) {
        grid-template-columns: 1fr 1fr;
      }
    }
  }
</style>
