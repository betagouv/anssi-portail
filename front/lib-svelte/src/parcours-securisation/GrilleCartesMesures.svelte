<script lang="ts">
  import CarteMesure from './CarteMesure.svelte';
  import type { Mesure } from './mesure';

  interface Props {
    mesures: Mesure[];
  }

  const { mesures }: Props = $props();
</script>

<div class="grille">
  {#each mesures as mesure (mesure.id)}
    <CarteMesure {mesure} />
  {/each}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .grille {
    display: grid;
    --colonnes: 1;
    grid-template-columns: repeat(var(--colonnes), 1fr);
    gap: 1rem;
    @include a-partir-de(md) {
      --colonnes: 2;
    }
    @include a-partir-de(lg) {
      --colonnes: 3;
    }
    @include a-partir-de(xl) {
      --colonnes: 4;
    }
  }
</style>
