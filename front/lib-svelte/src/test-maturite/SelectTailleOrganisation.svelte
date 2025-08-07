<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Option } from './SelecteurSimple';
  import SelecteurSimple from './SelecteurSimple.svelte';

  export let tailleOrganisation: string;
  export let optionDefautIntitule: string | undefined = undefined;
  export let optionDefautSelectionnable: boolean = false;

  type TrancheEffectif = {
    code: string;
    libelle: string;
  };
  let options: Option[];

  onMount(async () => {
    const reponse = await axios.get<TrancheEffectif[]>(
      '/api/annuaire/tranches-effectif'
    );
    options = reponse.data
      .filter((trancheEffectif) => trancheEffectif.code !== 'NN')
      .map((trancheEffectif) => ({
        valeur: trancheEffectif.code,
        libelle: trancheEffectif.libelle,
      }));
  });
</script>

<SelecteurSimple
  {options}
  bind:valeurSeclectionne={tailleOrganisation}
  {optionDefautIntitule}
  {optionDefautSelectionnable}
/>
