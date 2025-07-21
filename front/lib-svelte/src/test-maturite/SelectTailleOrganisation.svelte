<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  export let tailleOrganisation: string | null;
  let codeTailleOrganisation: string;
  $: tailleOrganisation =
    codeTailleOrganisation === '' ? null : codeTailleOrganisation;
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

<select bind:value={codeTailleOrganisation}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each tranchesEffectifEtablissement as tranche (tranche.code)}
    <option value={tranche.code}>{tranche.libelle}</option>
  {/each}
</select>
