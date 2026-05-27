<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Option } from './SelecteurSimple';
  import SelecteurSimple from './SelecteurSimple.svelte';

  type Props = {
    id?: string;
    libelle: string;
    region: string;
    optionDefautIntitule?: string;
    optionDefautSelectionnable?: boolean;
  };

  let {
    id = undefined,
    libelle,
    region = $bindable(),
    optionDefautIntitule = 'Sélectionner une région / un territoire',
    optionDefautSelectionnable = false,
  }: Props = $props();

  type Region = {
    codeIso: string;
    nom: string;
  };

  let options = $state<Option[]>([]);

  onMount(async () => {
    const reponse = await axios.get<Region[]>('/api/annuaire/regions');
    options = reponse.data.map((region) => ({
      valeur: region.codeIso,
      libelle: region.nom,
    }));
  });
</script>

<SelecteurSimple
  {id}
  {libelle}
  {options}
  bind:valeurSelectionnee={region}
  {optionDefautIntitule}
  {optionDefautSelectionnable}
/>
