<script lang="ts">
  import CaseACocher from '@ui/CaseACocher.svelte';

  import { Source } from './Catalogue.types';
  import { nombreResultats } from './stores/nombreResultats.store';
  import { rechercheParSource } from './stores/rechercheParSource.store';

  let { valeur, libelle }: { valeur: Source; libelle: string } = $props();
  let actif = $derived($rechercheParSource.includes(valeur));
</script>

<div class="choix">
  <CaseACocher
    id={valeur}
    libellé={libelle}
    coché={actif}
    surChangement={() => {
      if (!actif) {
        $rechercheParSource = [...$rechercheParSource, valeur];
      } else {
        $rechercheParSource = $rechercheParSource.filter((v) => v !== valeur);
      }
    }}
  />
  <span class="compte">{$nombreResultats.parSource[valeur]}</span>
</div>
