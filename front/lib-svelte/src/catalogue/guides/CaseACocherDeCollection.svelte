<script lang="ts">
  import type { CollectionGuide } from '../Guide.types';
  import { nombreGuides } from '../stores/guides/nombreGuides.store';
  import { rechercheParCollection } from '../stores/guides/rechercheParCollection.store';

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
