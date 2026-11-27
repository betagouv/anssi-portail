<script lang="ts">
  import CaseACocher from '@ui/CaseACocher.svelte';

  import { Langue } from '../Guide.types';
  import { nombreGuides } from '../stores/guides/nombreGuides.store';
  import { rechercheParLangue } from '../stores/guides/rechercheParLangue.store';

  let { valeur, libelle }: { valeur: Langue; libelle: string } = $props();
  let actif = $derived($rechercheParLangue.includes(valeur));
</script>

<div class="choix">
  <CaseACocher
    id={valeur}
    libellé={libelle}
    coché={actif}
    surChangement={() => {
      if (!actif) {
        $rechercheParLangue = [...$rechercheParLangue, valeur];
      } else {
        $rechercheParLangue = $rechercheParLangue.filter((v) => v !== valeur);
      }
    }}
  />
  <span class="compte">{$nombreGuides.parLangue[valeur]}</span>
</div>
