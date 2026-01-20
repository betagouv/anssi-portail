<script lang="ts">
  import LegendeLigne from './LegendeLigne.svelte';
  import { pourcentagesSerie, type Serie } from './Serie';

  export let serie: Serie;
  export let actif: string | undefined = undefined;

  let pourcentages: number[] = [];
  $: {
    pourcentages = pourcentagesSerie(serie);
  }
</script>

<div class="legende">
  {#each pourcentages as pourcentage, index (index)}
    {@const element = serie[index]}
    <LegendeLigne
      actif={actif === element.libelle}
      {index}
      libelle={element.libelle}
      valeur={element.valeur}
      {pourcentage}
    />
  {/each}
</div>

<style lang="scss">
  .legende {
    width: 242px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
</style>
