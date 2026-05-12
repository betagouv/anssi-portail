<script lang="ts">
  import { Langue } from '../Guide.types';
  import ChoixFiltreLangue from './ChoixFiltreLangue.svelte';
</script>

<fieldset>
  <legend>Langue</legend>
  <ChoixFiltreLangue valeur={Langue.FR} libelle="Français" />
  <ChoixFiltreLangue valeur={Langue.EN} libelle="Anglais " />
</fieldset>
