<script lang="ts">
  import { CollectionGuide } from '../Guide.types';
  import { nombreGuides } from '../stores/guides/nombreGuides.store';
  import { rechercheParCollection } from '../stores/guides/rechercheParCollection.store';

  let { valeur }: { valeur: CollectionGuide } = $props();
  let actif = $derived($rechercheParCollection.includes(valeur));
</script>

<div class="choix">
  <dsfr-checkbox
    id={valeur}
    label={valeur}
    checked={actif}
    onvaluechanged={(e: CustomEvent) => {
      if (e.detail) {
        $rechercheParCollection = [...$rechercheParCollection, valeur];
      } else {
        $rechercheParCollection = $rechercheParCollection.filter((v) => v !== valeur);
      }
    }}
  ></dsfr-checkbox>
  <span class="compte">{$nombreGuides.parCollection[valeur]}</span>
</div>
