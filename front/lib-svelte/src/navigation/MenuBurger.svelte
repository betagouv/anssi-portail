<script lang="ts">
  export let surClic: () => void;
</script>

<button on:click={surClic}>
  <img src="/assets/images/icone-menu.svg" alt="Menu burger"/>
</button>

<style lang="scss">
  @use "../../../assets/styles/responsive" as *;

  button {
    background: transparent;
    cursor: pointer;
    border: 1px solid #ddd;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    @include a-partir-de(lg) {
      display: none;
    }

    img {
      width: 24px;
      height: 24px;
    }
  }
</style>