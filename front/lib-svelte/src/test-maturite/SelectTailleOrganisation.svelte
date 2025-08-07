<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  export let tailleOrganisation: string | undefined = '';

  type TrancheEffectif = {
    code: string;
    libelle: string;
  };
  let tranchesEffectifEtablissement: TrancheEffectif[];

  onMount(async () => {
    const reponse = await axios.get<TrancheEffectif[]>(
      '/api/annuaire/tranches-effectif'
    );
    tranchesEffectifEtablissement = reponse.data.filter(
      (trancheEffectif) => trancheEffectif.code !== 'NN'
    );
  });
</script>

<select bind:value={tailleOrganisation}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each tranchesEffectifEtablissement as tranche (tranche.code)}
    <option value={tranche.code}>{tranche.libelle}</option>
  {/each}
</select>
