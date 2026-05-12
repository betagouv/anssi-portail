<script lang="ts">
  import { Source } from './Catalogue.types';
  import { nombreResultats } from './stores/nombreResultats.store';
  import { rechercheParSource } from './stores/rechercheParSource.store';

  let { valeur, libelle }: { valeur: Source; libelle: string } = $props();
  let actif = $derived($rechercheParSource.includes(valeur));
</script>

<div class="choix">
  <dsfr-checkbox
    id={valeur}
    label={libelle}
    checked={actif}
    onvaluechanged={(e: CustomEvent) => {
      if (e.detail) {
        $rechercheParSource = [...$rechercheParSource, valeur];
      } else {
        $rechercheParSource = $rechercheParSource.filter((v) => v !== valeur);
      }
    }}
  ></dsfr-checkbox>
  <span class="compte">{$nombreResultats.parSource[valeur]}</span>
</div>
