<script lang="ts">
  import { clic } from '../directives/actions.svelte';
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
  <legend>Région et territoire</legend>
  <SelectRegion
    libelle="Sélectionner une région / un territoire"
    bind:region={regionSelectionnee}
    optionDefautSelectionnable
  />
</fieldset>
<fieldset class="filtres secteurs">
  <legend>Secteur d’activité</legend>
  <SelectSecteurContacts libelle="Sélectionner un secteur d’activité" bind:secteur={secteurSelectionne} />
</fieldset>
<dsfr-button label="Réinitialiser les filtres" centered use:clic={reinitialiseFiltres}></dsfr-button>

<style lang="scss">
  .filtres {
    display: flex;
    flex-direction: column;
  }

  dsfr-button {
    display: flex;
  }
</style>
