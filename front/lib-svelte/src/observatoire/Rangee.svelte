<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    pleineLargeur?: boolean;
    children: Snippet;
  }

  let { pleineLargeur = false, children }: Props = $props();
</script>

<div class="rangee" class:pleine-largeur={pleineLargeur}>
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
  }
</style>
