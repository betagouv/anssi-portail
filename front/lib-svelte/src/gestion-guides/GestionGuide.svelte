<script lang="ts">
  import AjoutDocument from './AjoutDocument.svelte';
  import ListeDesDocuments from './ListeDesDocuments.svelte';
  import SelectionIdentifiantGuide from './SelectionIdentifiantGuide.svelte';

  let identifiantGuide: string = $state('');
</script>

<dsfr-container>
  <div class="guide">
    <h2>Guide</h2>
    <SelectionIdentifiantGuide bind:valeur={identifiantGuide} />
  </div>
  <ListeDesDocuments {identifiantGuide} />
  <AjoutDocument {identifiantGuide} />
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/grille' as *;

  .guide {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 72px 0 16px;
    max-width: taille-pour-colonnes(8);
    margin: auto;
  }

  h2 {
    margin: 0;
  }
</style>
