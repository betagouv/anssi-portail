<script lang="ts">
  import { Typologie } from './Catalogue.types';
  import ChoixFiltreTypologie from './ChoixFiltreTypologie.svelte';
</script>

<fieldset>
  <legend>Type</legend>
  <ChoixFiltreTypologie valeur={Typologie.SERVICE} libelle="Services" icone="icone-service" />
  <ChoixFiltreTypologie valeur={Typologie.OUTIL} libelle="Outils" icone="icone-outil" />
  <ChoixFiltreTypologie valeur={Typologie.CONTENU} libelle="Contenus" icone="icone-contenu" />
</fieldset>
