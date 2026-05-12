<script lang="ts">
  import { Langue } from '../Guide.types';
  import { nombreGuides } from '../stores/guides/nombreGuides.store';
  import { rechercheParLangue } from '../stores/guides/rechercheParLangue.store';

  let { valeur, libelle }: { valeur: Langue; libelle: string } = $props();
  let actif = $derived($rechercheParLangue.includes(valeur));
</script>

<div class="choix">
  <dsfr-checkbox
    id={valeur}
    label={libelle}
    checked={actif}
    onvaluechanged={(e: CustomEvent) => {
      if (e.detail) {
        $rechercheParLangue = [...$rechercheParLangue, valeur];
      } else {
        $rechercheParLangue = $rechercheParLangue.filter((v) => v !== valeur);
      }
    }}
  ></dsfr-checkbox>
  <span class="compte">{$nombreGuides.parLangue[valeur]}</span>
</div>
