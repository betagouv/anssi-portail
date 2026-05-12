<script lang="ts">
  import { Typologie } from './Catalogue.types';
  import { nombreResultats } from './stores/nombreResultats.store';
  import { rechercheParTypologie } from './stores/rechercheParTypologie.store';

  let { valeur, libelle, icone }: { valeur: Typologie; libelle: string; icone: string } = $props();

  let actif = $derived($rechercheParTypologie.includes(valeur));
</script>

<div class="choix">
  <dsfr-checkbox
    id={valeur}
    checked={actif}
    onvaluechanged={(e: CustomEvent) => {
      if (e.detail) {
        $rechercheParTypologie = [...$rechercheParTypologie, valeur];
      } else {
        $rechercheParTypologie = $rechercheParTypologie.filter((v) => v !== valeur);
      }
    }}><img src={`/assets/images/${icone}.svg`} alt="" />{libelle}</dsfr-checkbox
  >
  <span class="compte">{$nombreResultats.parTypologie[valeur]}</span>
</div>
