<script lang="ts">
  export let aideSaisie = '';
  export let valeur: string = '';
  export let enErreur: boolean = false;
</script>

<textarea
  bind:value={valeur}
  placeholder={aideSaisie}
  class:en-erreur={enErreur}
></textarea>

<style lang="scss">
  textarea {
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

    &.en-erreur {
      border-color: var(--erreur-texte);
    }
  }
</style>
