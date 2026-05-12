<script lang="ts">
  import { rechercheParTypeOrganisation } from './stores/rechercheParTypeOrganisation.store';

  let { valeur, libelle }: { valeur: string; libelle: string } = $props();
  let actif = $derived($rechercheParTypeOrganisation.includes(valeur));
</script>

<div class="choix">
  <dsfr-checkbox
    id={valeur}
    label={libelle}
    checked={actif}
    onvaluechanged={(e: CustomEvent) => {
      if (e.detail) {
        $rechercheParTypeOrganisation = [...$rechercheParTypeOrganisation, valeur];
      } else {
        $rechercheParTypeOrganisation = $rechercheParTypeOrganisation.filter((v) => v !== valeur);
      }
    }}
  ></dsfr-checkbox>
</div>
