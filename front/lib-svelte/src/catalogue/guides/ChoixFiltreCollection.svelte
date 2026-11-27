<script lang="ts">
  import CaseACocher from '@ui/CaseACocher.svelte';

  import { CollectionGuide } from '../Guide.types';
  import { nombreGuides } from '../stores/guides/nombreGuides.store';
  import { rechercheParCollection } from '../stores/guides/rechercheParCollection.store';

  let { valeur }: { valeur: CollectionGuide } = $props();
  let actif = $derived($rechercheParCollection.includes(valeur));
</script>

<div class="choix">
  <CaseACocher
    id={valeur}
    libellé={valeur}
    coché={actif}
    surChangement={() => {
      if (!actif) {
        $rechercheParCollection = [...$rechercheParCollection, valeur];
      } else {
        $rechercheParCollection = $rechercheParCollection.filter((v) => v !== valeur);
      }
    }}
  />
  <span class="compte">{$nombreGuides.parCollection[valeur]}</span>
</div>
