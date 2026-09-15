<script lang="ts">
  import FilAriane from '../../../ui/FilAriane.svelte';
</script>

<div class="parcours-reflexe-cyber">
  <dsfr-container>
    <FilAriane
      feuille="Réflexe cyber&nbsp;: comment réagirez-vous en cas de cyberattaque&nbsp;?"
      branche={{ nom: 'Faire le test !', lien: '/faire-le-test' }}
    />
  </dsfr-container>
</div>

<style lang="scss">
  .parcours-reflexe-cyber {
    display: flex;
    flex-direction: column;
    background-color: var(--background-alt-blue-france);
  }
</style>
