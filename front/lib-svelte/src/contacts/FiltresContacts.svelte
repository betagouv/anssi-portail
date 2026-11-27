<script lang="ts">
  import SelectRegion from '@test-maturite/SelectRegion.svelte';
  import Bouton from '@ui/Bouton.svelte';

  import SelectSecteurContacts from './SelectSecteurContacts.svelte';

  interface Props {
    regionSelectionnee: string;
    secteurSelectionne: string;
  }

  let { regionSelectionnee = $bindable(), secteurSelectionne = $bindable() }: Props = $props();

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
<Bouton libelle="Réinitialiser les filtres" surClic={reinitialiseFiltres} etire />

<style lang="scss">
  .filtres {
    display: flex;
    flex-direction: column;
  }
</style>
