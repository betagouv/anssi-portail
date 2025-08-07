<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  export let region: string | undefined = '';

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

<select bind:value={region}>
  <option disabled selected value="">Sélectionner une région</option>
  {#each regions as uneRegion (uneRegion.codeIso)}
    <option value={uneRegion.codeIso}>{uneRegion.nom}</option>
  {/each}
</select>
