<script lang="ts">
</script>

<span>
  <slot />
</span>

<style lang="scss">
  span {
    font-size: 0.75rem;
    font-weight: bold;
    line-height: 1.25rem;

    color: var(--tag-couleur-texte);
    background-color: var(--tag-couleur-fond);
    padding: 0 6px;
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: fit-content;
    white-space: nowrap;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
  }
</style>
