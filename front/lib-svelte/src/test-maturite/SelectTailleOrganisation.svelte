<script lang="ts">
  import { tranchesEffectifEtablissement } from "./TestMaturite.donnees";

  export let tailleOrganisation: string | null;
  let codeTailleOrganisation: string;
  $: tailleOrganisation =
    codeTailleOrganisation === "" ? null : codeTailleOrganisation;
</script>

<select bind:value={codeTailleOrganisation}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each tranchesEffectifEtablissement as tranche}
    <option value={tranche.code}>{tranche.libelle}</option>
  {/each}
</select>
