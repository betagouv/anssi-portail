<script lang="ts">
  import { clic } from '../directives/actions.svelte';
  import SelectRegion from '../test-maturite/SelectRegion.svelte';
  import ChoixFiltreTypeFinancement from './ChoixFiltreTypeFinancement.svelte';
  import ChoixFiltreTypeOrganisation from './ChoixFiltreTypeOrganisation.svelte';
  import SqueletteCheckbox from './SqueletteCheckbox.svelte';
  import { financementsFiltre } from './stores/financementsFiltre.store';
  import { rechercheParRegion } from './stores/rechercheParRegion.store';
  import { rechercheParTypeFinancement } from './stores/rechercheParTypeFinancement.store';
  import { rechercheParTypeOrganisation } from './stores/rechercheParTypeOrganisation.store';

  interface Props {
    chargement: boolean;
    estConnecte: boolean;
  }

  let { chargement, estConnecte }: Props = $props();

  const reinitialiseFiltres = () => {
    rechercheParRegion.reinitialise();
    rechercheParTypeOrganisation.reinitialise();
    rechercheParTypeFinancement.reinitialise();
  };
</script>

{#if !estConnecte}
  <fieldset class="filtres regions">
    <legend>Région et territoire</legend>
    <SelectRegion
      libelle="Sélectionner une région / un territoire"
      bind:region={$rechercheParRegion}
      optionDefautSelectionnable
    />
  </fieldset>
{/if}
{#if !estConnecte}
  <fieldset class="filtres organisations">
    <legend>Type d'organisation</legend>
    <ul>
      {#if chargement}
        <SqueletteCheckbox />
        <SqueletteCheckbox />
        <SqueletteCheckbox />
        <SqueletteCheckbox />
      {:else}
        {#each $financementsFiltre.typesOrganisation as type (type)}
          <li>
            <ChoixFiltreTypeOrganisation valeur={type} libelle={type} />
          </li>
        {/each}
      {/if}
    </ul>
  </fieldset>
{/if}
<fieldset class="filtres financements">
  <legend>Type de financement</legend>
  <ul>
    {#if chargement}
      <SqueletteCheckbox />
      <SqueletteCheckbox />
      <SqueletteCheckbox />
      <SqueletteCheckbox />
    {:else}
      {#each $financementsFiltre.typesFinancement as type (type)}
        <li>
          <ChoixFiltreTypeFinancement valeur={type} libelle={type} />
        </li>
      {/each}
    {/if}
  </ul>
</fieldset>

<dsfr-button label="Réinitialiser les filtres" centered use:clic={reinitialiseFiltres}></dsfr-button>

<style lang="scss">
  .filtres {
    display: flex;
    flex-direction: column;
  }
</style>
