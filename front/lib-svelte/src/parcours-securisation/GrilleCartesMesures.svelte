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
  .grille {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
