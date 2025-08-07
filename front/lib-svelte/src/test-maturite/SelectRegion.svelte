<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Option } from './SelecteurSimple';
  import SelecteurSimple from './SelecteurSimple.svelte';

  export let region: string;
  export let optionDefautIntitule: string | undefined = undefined;
  export let optionDefautSelectionnable: boolean = false;

  type Region = {
    codeIso: string;
    nom: string;
  };

  let options: Option[];

  onMount(async () => {
    const reponse = await axios.get<Region[]>('/api/annuaire/regions');
    options = reponse.data.map((region) => ({
      valeur: region.codeIso,
      libelle: region.nom,
    }));
  });
</script>

<SelecteurSimple
  {options}
  bind:valeurSeclectionne={region}
  {optionDefautIntitule}
  {optionDefautSelectionnable}
/>
