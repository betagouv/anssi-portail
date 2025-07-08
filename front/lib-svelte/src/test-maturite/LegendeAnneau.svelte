<script lang="ts">
  import { pourcentagesSerie, type Serie } from './Serie';

  export let serie: Serie;
</script>

<div class="legende">
  {#each pourcentagesSerie(serie) as pourcentage, index (index)}
    {@const element = serie[index]}
    <div class="ligne-legende ligne-legende-{index}">
      <span class="libelle">{element.libelle}</span>
      <div>
        <span class="total">{element.valeur}</span>
        <span class="pourcentage">({Math.round(pourcentage)}%)</span>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .legende {
    width: 242px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ligne-legende {
    display: grid;
    gap: 10px;
    grid-template-columns: 24px 2fr 1fr;
    align-items: center;

    div {
      text-wrap: nowrap;
    }

    .total {
      font-weight: bold;
    }
  }

  .ligne-legende:before {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    content: '';
    background-color: var(--couleur-puce);
  }

  .ligne-legende-0 {
    --couleur-puce: #6369f1;
  }

  .ligne-legende-1 {
    --couleur-puce: #fec54b;
  }

  .ligne-legende-2 {
    --couleur-puce: #8248a1;
  }

  .ligne-legende-3 {
    --couleur-puce: #f26c85;
  }

  .ligne-legende-4 {
    --couleur-puce: #8ed4a3;
  }
</style>