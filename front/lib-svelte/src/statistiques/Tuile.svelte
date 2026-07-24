<script lang="ts">
  import Tuile from '../ui/Tuile.svelte';

  type Props = {
    image: string;
    mesure: number;
    description: string;
  };

  const { image, mesure, description: titre }: Props = $props();
</script>

<Tuile {titre}>
  {#snippet illustration()}
    <img src={`/assets/images/${image}.svg`} width="96" height="96" alt={titre} />
  {/snippet}
  {#snippet description()}
    <span class="mesure fr-h2">{mesure}</span>
  {/snippet}
</Tuile>

<style lang="scss">
  .mesure {
    color: #161616;
    margin-bottom: 8px;
  }
</style>
