<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Option } from './SelecteurSimple';
  import SelecteurSimple from './SelecteurSimple.svelte';

  type TrancheEffectif = {
    code: string;
    libelle: string;
  };

  type Props = {
    id?: string;
    libelle: string;
    tailleOrganisation: string;
    optionDefautIntitule?: string;
    optionDefautSelectionnable?: boolean;
  };
  let {
    id = undefined,
    libelle = "Sélectionner une taille d'organisation",
    tailleOrganisation = $bindable(),
    optionDefautIntitule = "Sélectionner une taille d'organisation",
    optionDefautSelectionnable = false,
  }: Props = $props();

  let options = $state<Option[]>([]);

  onMount(async () => {
    const reponse = await axios.get<TrancheEffectif[]>('/api/annuaire/tranches-effectif');
    options = reponse.data
      .filter((trancheEffectif) => trancheEffectif.code !== 'NN')
      .map((trancheEffectif) => ({
        valeur: trancheEffectif.code,
        libelle: trancheEffectif.libelle,
      }));
  });
</script>

<SelecteurSimple
  {id}
  {libelle}
  {options}
  bind:valeurSelectionnee={tailleOrganisation}
  {optionDefautIntitule}
  {optionDefautSelectionnable}
/>
