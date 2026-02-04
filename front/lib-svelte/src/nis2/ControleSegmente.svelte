<script lang="ts">
  export let elements: { id: string; titre: string }[];
</script>

<dsfr-container class="conteneur">
  <div class="controle-segmente">
    {#each elements as element, index (element.id)}
      <a href="#{element.id}" class="bouton-segmente" class:actif={index === 0}
        >{element.titre}</a
      >
    {/each}
  </div>
</dsfr-container>

<style lang="scss">
  .conteneur {
    padding-block: 16px;
    overflow: auto;
    background: var(--background-default-grey);
    position: sticky;
    top: 0;
    z-index: 2;
  }
</style>