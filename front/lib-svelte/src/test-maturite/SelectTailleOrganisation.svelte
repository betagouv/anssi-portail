<script lang="ts">
  import { tranchesEffectifEtablissement } from "./TestMaturite.donnees";
</script>

<select>
  <option disabled selected value="null">Sélectionner une option</option>
  {#each tranchesEffectifEtablissement as tranche}
    <option value={tranche.code}>{tranche.libelle}</option>
  {/each}
</select>
