<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Option } from './SelecteurSimple';
  import SelecteurSimple from './SelecteurSimple.svelte';

  export let secteur: string;
  export let optionDefautIntitule: string | undefined = undefined;
  export let optionDefautSelectionnable: boolean = false;

  type SecteurActivite = {
    code: string;
    libelle: string;
  };

  let options: Option[];

  onMount(async () => {
    const reponse = await axios.get<SecteurActivite[]>(
      '/api/annuaire/secteurs-activite'
    );
    options = reponse.data.map((secteur) => ({
      valeur: secteur.code,
      libelle: secteur.libelle,
    }));
  });
</script>

<SelecteurSimple
  {options}
  bind:valeurSeclectionne={secteur}
  {optionDefautIntitule}
  {optionDefautSelectionnable}
/>
