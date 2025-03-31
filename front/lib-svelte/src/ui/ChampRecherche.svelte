<script lang="ts">
  export let recherche: string;
</script>

<input type="text" bind:value={recherche} />

<style lang="scss">
  input {
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: none;
    border-bottom: 2px solid #3a3a3a;
    font-size: 1rem;
    padding: 8px;
    line-height: 1.5rem;
    background: #eee;
    margin-bottom: 0;
    box-sizing: border-box;
    font-family: var(--fonts);
  }
</style>
