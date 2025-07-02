<script lang="ts">
  import { onMount } from 'svelte';
  import axios, { type AxiosResponse } from 'axios';

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
    let reponse: AxiosResponse<TrancheEffectif[]>;
    try {
      reponse = await axios.get<TrancheEffectif[]>(
        '/api/annuaire/tranches-effectif'
      );
    } catch {
      reponse = await axios.get<TrancheEffectif[]>(
        '/api/annuaire/tranches-effectif'
      );
    }
    tranchesEffectifEtablissement = reponse.data;
  });
</script>

<select bind:value={codeTailleOrganisation}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each tranchesEffectifEtablissement as tranche (tranche.code)}
    <option value={tranche.code}>{tranche.libelle}</option>
  {/each}
</select>
