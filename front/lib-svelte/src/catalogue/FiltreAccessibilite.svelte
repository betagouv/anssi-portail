<script lang="ts">
  import { DroitAcces } from './Catalogue.types';
  import ChoixFiltreAccessibilite from './ChoixFiltreAccessibilite.svelte';
</script>

<fieldset>
  <legend>Accessibles pour</legend>
  <ChoixFiltreAccessibilite valeur={DroitAcces.ACCES_LIBRE} libelle="Accès libre" />
  <ChoixFiltreAccessibilite valeur={DroitAcces.ENTITES_PUBLIQUES} libelle="Entités publiques" />
  <ChoixFiltreAccessibilite valeur={DroitAcces.REGULES_NIS2} libelle="Entités régulées / NIS2" />
</fieldset>
