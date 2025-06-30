<script lang="ts">

</script>

<button class="fermer" on:click type="button">Fermer</button>

<style lang="scss">
  .fermer {
    font-size: 0.875rem;
    line-height: 1.5rem;
    font-weight: 500;
    border: none;
    background: none;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 4px 0 4px 12px;
    cursor: pointer;
    align-self: flex-end;

    &:after {
      content: '';
      display: inline-block;
      background-repeat: no-repeat;
      background-size: contain;
      width: 16px;
      height: 16px;
      line-height: 1.5rem;
      background-image: url('/assets/images/icone-croix.svg');
      filter: brightness(0) saturate(100%);
    }
  }
</style>