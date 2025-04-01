<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  export let region: string | null;
  let regionSelectionnee: string;
  $: region = regionSelectionnee === '' ? null : regionSelectionnee;

  type Region = {
    codeIso: string;
    nom: string;
  };

  let regions: Region[];

  onMount(async () => {
    const reponse = await axios.get<Region[]>('/api/annuaire/regions');
    regions = reponse.data;
  });
</script>

<select bind:value={regionSelectionnee}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each regions as uneRegion (uneRegion.codeIso)}
    <option value={uneRegion.codeIso}>{uneRegion.nom}</option>
  {/each}
</select>
