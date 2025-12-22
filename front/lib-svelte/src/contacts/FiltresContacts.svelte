<script lang="ts">
  import SelectRegion from '../test-maturite/SelectRegion.svelte';
  import SelectSecteurContacts from './SelectSecteurContacts.svelte';

  export let regionSelectionnee: string;
  export let secteurSelectionne: string;

  const reinitialiseFiltres = () => {
    regionSelectionnee = '';
    secteurSelectionne = '';
  };
</script>

<fieldset class="filtres regions">
  <legend>Région</legend>
  <label class="colonne">
    <span class="libelle">Sélectionner une région</span>
    <SelectRegion bind:region={regionSelectionnee} optionDefautSelectionnable />
  </label>
</fieldset>
<fieldset class="filtres secteurs">
  <legend>Secteur d’activité</legend>
  <label class="colonne">
    <span class="libelle">Sélectionner un secteur d’activité</span>
    <SelectSecteurContacts bind:secteur={secteurSelectionne} />
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
