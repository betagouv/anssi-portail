<script lang="ts">
  import CaseACocher from '@ui/CaseACocher.svelte';

  import { Typologie } from './Catalogue.types';
  import { nombreResultats } from './stores/nombreResultats.store';
  import { rechercheParTypologie } from './stores/rechercheParTypologie.store';

  let { valeur, libelle, icone }: { valeur: Typologie; libelle: string; icone: string } = $props();

  let actif = $derived($rechercheParTypologie.includes(valeur));
</script>

<div class="choix">
  <CaseACocher
    id={valeur}
    coché={actif}
    surChangement={() => {
      if (!actif) {
        $rechercheParTypologie = [...$rechercheParTypologie, valeur];
      } else {
        $rechercheParTypologie = $rechercheParTypologie.filter((v) => v !== valeur);
      }
    }}
  >
    <img src={`/assets/images/${icone}.svg`} width="24" height="24" alt="" />{libelle}
  </CaseACocher>
  <span class="compte">{$nombreResultats.parTypologie[valeur]}</span>
</div>
