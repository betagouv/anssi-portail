<script lang="ts">
  export let region: string | null;
  let regionSelectionnee: string;
  $: region = regionSelectionnee === "" ? null : regionSelectionnee;
</script>

<select bind:value={regionSelectionnee}>
  <option disabled selected value="">Sélectionner une option</option>
  <option>Auvergne-Rhône-Alpes</option>
  <option>Bourgogne-Franche-Comté</option>
  <option>Bretagne</option>
  <option>Centre-Val de Loire</option>
  <option>Corse</option>
  <option>Grand Est</option>
  <option>Guadeloupe</option>
  <option>Guyane</option>
  <option>Hauts-de-France</option>
  <option>Ile-de-France</option>
  <option>Martinique</option>
  <option>Mayotte</option>
  <option>Nouvelle-Aquitaine</option>
  <option>Normandie</option>
  <option>Occitanie</option>
  <option>Pays de la Loire</option>
  <option>Provence-Alpes-Côte d'Azur</option>
  <option>La Réunion</option>
</select>
