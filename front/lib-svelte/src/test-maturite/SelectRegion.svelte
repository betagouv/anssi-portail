<script lang="ts">
  import { onMount } from 'svelte';
  import axios, { type AxiosResponse } from 'axios';

  export let region: string | null;
  let regionSelectionnee: string;
  $: region = regionSelectionnee === '' ? null : regionSelectionnee;

  type Region = {
    codeIso: string;
    nom: string;
  };

  let regions: Region[];

  onMount(async () => {
    let reponse: AxiosResponse<Region[]>;
    try {
      reponse = await axios.get<Region[]>('/api/annuaire/regions');
    } catch {
      reponse = await axios.get<Region[]>('/api/annuaire/regions');
    }
    regions = reponse.data;
  });
</script>

<select bind:value={regionSelectionnee}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each regions as uneRegion (uneRegion.codeIso)}
    <option value={uneRegion.codeIso}>{uneRegion.nom}</option>
  {/each}
</select>
