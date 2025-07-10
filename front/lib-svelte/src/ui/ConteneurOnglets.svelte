<script lang="ts">

</script>

<div class="conteneur-scrollable">
  <div class="conteneur-onglet">
    <slot />
  </div>
</div>

<style>
  .conteneur-onglet {
    margin: 0 0 0 -0.5px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    border-bottom: 1px solid var(--gris-clair);
  }
  .conteneur-scrollable {
    overflow-x: auto;
    padding-bottom: 8px;
  }
</style>
