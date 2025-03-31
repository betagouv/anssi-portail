<script lang="ts">
  export let recherche: string;
</script>

<div>
  <input type="text" bind:value={recherche} placeholder="Rechercher" />
  <button>
    <img src="/assets/images/icone_loupe.svg" alt="Icône de recherche" />
  </button>
</div>

<style lang="scss">
  input[type='text'] {
    width: 100%;
    border-top-left-radius: 4px;
    border: none;
    border-bottom: 2px solid #3a3a3a;
    font-size: 1rem;
    padding: 8px;
    line-height: 1.5rem;
    background: #eee;
    box-sizing: border-box;
    font-family: var(--fonts);

    &:placeholder-shown {
      font-style: italic;
    }
  }

  button {
    display: flex;
    align-items: center;
    background: var(--noir);
    border: none;
    border-top-right-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #2c2640;
    }

    &:active {
      background: #393253;
    }
  }

  div {
    display: flex;
    margin-bottom: 16px;
  }
</style>
