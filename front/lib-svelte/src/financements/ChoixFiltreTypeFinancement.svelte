<script lang="ts">
  import { rechercheParTypeFinancement } from './stores/rechercheParTypeFinancement.store';

  let { valeur, libelle }: { valeur: string; libelle: string } = $props();
  let actif = $derived($rechercheParTypeFinancement.includes(valeur));
</script>

<div class="choix">
  <dsfr-checkbox
    id={valeur}
    label={libelle}
    checked={actif}
    onvaluechanged={(e: CustomEvent) => {
      if (e.detail) {
        $rechercheParTypeFinancement = [...$rechercheParTypeFinancement, valeur];
      } else {
        $rechercheParTypeFinancement = $rechercheParTypeFinancement.filter((v) => v !== valeur);
      }
    }}
  ></dsfr-checkbox>
</div>
