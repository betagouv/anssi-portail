<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  export let secteur: string | undefined = '';

  let secteurs: SecteurActivite[];
  type SecteurActivite = {
    code: string;
    libelle: string;
  };

  onMount(async () => {
    const reponse = await axios.get<SecteurActivite[]>(
      '/api/annuaire/secteurs-activite'
    );
    secteurs = reponse.data;
  });
</script>

<select bind:value={secteur}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each secteurs as secteur (secteur.code)}
    <option value={secteur.code}>{secteur.libelle}</option>
  {/each}
</select>
