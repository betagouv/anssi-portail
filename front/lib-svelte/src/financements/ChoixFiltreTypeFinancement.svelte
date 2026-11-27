<script lang="ts">
  import CaseACocher from '@ui/CaseACocher.svelte';

  import { rechercheParTypeFinancement } from './stores/rechercheParTypeFinancement.store';

  let { valeur, libelle }: { valeur: string; libelle: string } = $props();
  let actif = $derived($rechercheParTypeFinancement.includes(valeur));
</script>

<div class="choix">
  <CaseACocher
    id={valeur}
    libellé={libelle}
    coché={actif}
    surChangement={() => {
      if (!actif) {
        $rechercheParTypeFinancement = [...$rechercheParTypeFinancement, valeur];
      } else {
        $rechercheParTypeFinancement = $rechercheParTypeFinancement.filter((v) => v !== valeur);
      }
    }}
  />
</div>
