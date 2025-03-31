<script lang="ts">
  export let recherche: string;

  const efface = () => {
    recherche = '';
  };
</script>

<div>
  <input type="text" bind:value={recherche} placeholder="Rechercher" />
  <button
    class:visible={recherche}
    class="suppression-recherche"
    on:click={efface}
  >
    <img
      src="/assets/images/icone-croix-blanche.svg"
      alt="Suppression de la recherche"
    />
  </button>
  <button class="bouton-recherche">
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
    cursor: pointer;
    justify-content: center;
    padding: 0;

    &:hover {
      background: #2c2640;
    }

    &:active {
      background: #393253;
    }
  }

  .suppression-recherche {
    position: absolute;
    right: 56px;
    width: 16px;
    height: 16px;
    top: 13px;
    border-radius: 8px;
    display: none;
    &.visible {
      display: flex;
    }
  }
  .bouton-recherche {
    flex: 0 0 40px;
    border-top-right-radius: 4px;
  }

  div {
    display: flex;
    position: relative;
    margin-bottom: 16px;
  }
</style>
