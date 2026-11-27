<script lang="ts">
  import CaseACocher from '@ui/CaseACocher.svelte';

  import type { DroitAcces } from './Catalogue.types';
  import { nombreResultats } from './stores/nombreResultats.store';
  import { rechercheParDroitAcces } from './stores/rechercheParDroitAcces.store';

  let { valeur, libelle }: { valeur: DroitAcces; libelle: string } = $props();
  let actif = $derived($rechercheParDroitAcces.includes(valeur));
</script>

<div class="choix">
  <CaseACocher
    id={valeur}
    libellé={libelle}
    coché={actif}
    surChangement={() => {
      if (!actif) {
        $rechercheParDroitAcces = [...$rechercheParDroitAcces, valeur];
      } else {
        $rechercheParDroitAcces = $rechercheParDroitAcces.filter((v) => v !== valeur);
      }
    }}
  />
  <span class="compte">{$nombreResultats.parDroitAcces[valeur]}</span>
</div>
