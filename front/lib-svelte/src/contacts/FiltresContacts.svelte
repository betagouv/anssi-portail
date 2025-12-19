<script lang="ts">
  import SelectRegion from '../test-maturite/SelectRegion.svelte';

  export let regionSelectionnee: string;

  const reinitialiseFiltres = () => {
    regionSelectionnee = '';
  };
</script>

<fieldset class="filtres regions">
  <legend>Région</legend>
  <label class="colonne">
    <span class="libelle">Sélectionner une région</span>
    <SelectRegion bind:region={regionSelectionnee} optionDefautSelectionnable />
  </label>
</fieldset>
<lab-anssi-bouton
  on:click={reinitialiseFiltres}
  on:keypress
  role="button"
  taille="md"
  tabindex={0}
  titre="Réinitialiser les filtres"
  variante="primaire"
  largeurMaximale
></lab-anssi-bouton>

<style lang="scss">
  .filtres {
    display: flex;
    flex-direction: column;
  }

  label.colonne {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  lab-anssi-bouton {
    margin-top: 16px;
  }
</style>
