<script lang="ts">
  import { secteurs } from "./TestMaturite.donnees";
</script>

<select>
  <option disabled selected value="null">Sélectionner une option</option>
  {#each secteurs as secteur}
    <option value={secteur.code}>{secteur.libelle}</option>
  {/each}
</select>
