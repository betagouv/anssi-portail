<script lang="ts">
  import { secteurs } from "./TestMaturite.donnees";

  export let secteur: string | null;
  let codeSecteur: string;
  $: secteur = codeSecteur === "" ? null : codeSecteur;
</script>

<select bind:value={codeSecteur}>
  <option disabled selected value="">Sélectionner une option</option>
  {#each secteurs as secteur}
    <option value={secteur.code}>{secteur.libelle}</option>
  {/each}
</select>
