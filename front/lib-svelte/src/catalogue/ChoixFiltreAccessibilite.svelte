<script lang="ts">
  import type { DroitAcces } from './Catalogue.types';
  import { nombreResultats } from './stores/nombreResultats.store';
  import { rechercheParDroitAcces } from './stores/rechercheParDroitAcces.store';

  let { valeur, libelle }: { valeur: DroitAcces; libelle: string } = $props();
  let actif = $derived($rechercheParDroitAcces.includes(valeur));
</script>

<div class="choix">
  <dsfr-checkbox
    id={valeur}
    label={libelle}
    checked={actif}
    onvaluechanged={(e: CustomEvent) => {
      if (e.detail) {
        $rechercheParDroitAcces = [...$rechercheParDroitAcces, valeur];
      } else {
        $rechercheParDroitAcces = $rechercheParDroitAcces.filter((v) => v !== valeur);
      }
    }}
  ></dsfr-checkbox>
  <span class="compte">{$nombreResultats.parDroitAcces[valeur]}</span>
</div>
