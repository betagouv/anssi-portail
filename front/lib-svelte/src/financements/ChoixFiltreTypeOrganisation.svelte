<script lang="ts">
  import CaseACocher from '@ui/CaseACocher.svelte';

  import { rechercheParTypeOrganisation } from './stores/rechercheParTypeOrganisation.store';

  let { valeur, libelle }: { valeur: string; libelle: string } = $props();
  let actif = $derived($rechercheParTypeOrganisation.includes(valeur));
</script>

<div class="choix">
  <CaseACocher
    id={valeur}
    libellé={libelle}
    coché={actif}
    surChangement={() => {
      if (!actif) {
        $rechercheParTypeOrganisation = [...$rechercheParTypeOrganisation, valeur];
      } else {
        $rechercheParTypeOrganisation = $rechercheParTypeOrganisation.filter((v) => v !== valeur);
      }
    }}
  />
</div>
