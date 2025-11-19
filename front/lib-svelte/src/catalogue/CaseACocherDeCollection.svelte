<script lang="ts">
  import type { CollectionGuide } from './Catalogue.types';
  import { nombreGuides } from './stores/nombreGuides.store';
  import { rechercheParCollection } from './stores/rechercheParCollection.store';

  export let collection: CollectionGuide;
</script>

<label>
  <input
    type="checkbox"
    value={collection}
    bind:group={$rechercheParCollection}
  />
  <span class="libelle">{collection}</span>
  <span class="compte">
    {$nombreGuides.parCollection[collection]}
  </span>
</label>
