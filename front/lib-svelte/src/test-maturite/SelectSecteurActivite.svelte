<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Option } from './SelecteurSimple';
  import SelecteurSimple from './SelecteurSimple.svelte';

  type SecteurActivite = {
    code: string;
    libelle: string;
  };

  type Props = {
    id?: string;
    libelle: string;
    secteur: string;
    optionDefautIntitule?: string;
    optionDefautSelectionnable?: boolean;
  };

  let {
    id = undefined,
    libelle = 'Sélectionner un secteur d’activité',
    secteur = $bindable(),
    optionDefautIntitule = "Sélectionner un secteur d'activité",
    optionDefautSelectionnable = false,
  }: Props = $props();

  let options = $state<Option[]>([]);

  onMount(async () => {
    const reponse = await axios.get<SecteurActivite[]>('/api/annuaire/secteurs-activite');
    options = reponse.data.map((secteur) => ({
      valeur: secteur.code,
      libelle: secteur.libelle,
    }));
  });
</script>

<SelecteurSimple
  {id}
  {libelle}
  {options}
  bind:valeurSelectionnee={secteur}
  {optionDefautIntitule}
  {optionDefautSelectionnable}
/>
