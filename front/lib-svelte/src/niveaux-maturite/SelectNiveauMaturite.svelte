<script lang="ts">
  import { niveauxMaturite } from './NiveauxMaturite.donnees';
  import type { NiveauMaturite } from './NiveauxMaturite.type';

  export let niveauSelectionne: NiveauMaturite;
</script>

<select bind:value={niveauSelectionne}>
  {#each niveauxMaturite as niveau (niveau.id)}
    <option value={niveau}>{niveau.label}</option>
  {/each}
</select>
