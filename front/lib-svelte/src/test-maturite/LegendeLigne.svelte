<script lang="ts">
  export let index: number;
  export let actif = false;
  export let libelle: string;
  export let valeur: number | undefined;
  export let pourcentage: number | undefined;
</script>

<div
  class="ligne-legende ligne-legende-{index}"
  class:actif
  class:avec-valeur={valeur || pourcentage}
>
  <span class="libelle">{libelle}</span>
  {#if valeur || pourcentage}
    <div>
      {#if valeur}
        <span class="total">{valeur}</span>
      {/if}
      {#if pourcentage}
        <span class="pourcentage">({Math.round(pourcentage)}%)</span>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .ligne-legende {
    display: grid;
    gap: 10px;
    grid-template-columns: 24px 2fr;
    align-items: center;

    &.avec-valeur {
      grid-template-columns: 24px 2fr 1fr;
    }

    div {
      text-wrap: nowrap;
    }

    .total {
      font-weight: bold;
    }

    &.actif {
      outline: 2px solid #fed980;
      outline-offset: 8px;
      border-radius: 2px;
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
