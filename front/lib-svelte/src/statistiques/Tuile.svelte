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
  <img slot="pictogram" src={`/assets/images/${image}.svg`} width="96" height="96" alt={titre} />
  <span slot="description" class="mesure fr-h2">{mesure}</span>
</Tuile>

<style lang="scss">
  .mesure {
    color: #161616;
    margin-bottom: 8px;
  }
</style>
