<script lang="ts" generics="T extends string">
  export let ongletActif: T;
  export let cetOnglet: T;
  export let labelOnglet: string;
  export let sansBordureEnBas: boolean = false;
</script>

<button
  type="button"
  class="onglet"
  class:active={ongletActif === cetOnglet}
  class:sansBordureEnBas
  on:click={() => (ongletActif = cetOnglet)}
>
  <span class="label">{labelOnglet}</span>
</button>

<style>
  .onglet {
    font-size: 1rem;
    padding: 9px 12px;
    background: #f6f6f6;
    border: none;
    cursor: pointer;
    border-top: 2px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    transform: translateY(1px);
    z-index: 3;
    text-wrap: nowrap;
    min-width: min-content;
    font-weight: bold;
  }

  .onglet:not(.sansBordureEnBas):not(.active) {
    border-bottom: 1px solid var(--gris-clair);
  }

  .onglet:hover {
    background: #dfdfdf;
  }

  .onglet.active {
    background: white;
    border-top: 2px solid var(--jaune-msc);
    border-left: 1px solid var(--gris-clair);
    border-right: 1px solid var(--gris-clair);
    border-bottom: 1px solid white;
  }
</style>
