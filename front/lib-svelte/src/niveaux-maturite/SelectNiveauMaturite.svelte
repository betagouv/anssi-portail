<script lang="ts">
  import {
    type NiveauMaturite,
    niveauxMaturite,
  } from './NiveauxMaturite.donnees';

  export let niveauSelectionne: NiveauMaturite;
</script>

<select bind:value={niveauSelectionne}>
  {#each niveauxMaturite as niveau (niveau.id)}
    <option value={niveau}>{niveau.label}</option>
  {/each}
</select>
