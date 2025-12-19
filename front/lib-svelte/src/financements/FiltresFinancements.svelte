<script lang="ts">
  import SelectRegion from '../test-maturite/SelectRegion.svelte';
  import SqueletteCheckbox from './SqueletteCheckbox.svelte';
  import { financementsFiltre } from './stores/financementsFiltre.store';
  import { rechercheParRegion } from './stores/rechercheParRegion.store';
  import { rechercheParTypeFinancement } from './stores/rechercheParTypeFinancement.store';
  import { rechercheParTypeOrganisation } from './stores/rechercheParTypeOrganisation.store';

  export let chargement: boolean;
  export let estConnecte: boolean;

  const reinitialiseFiltres = () => {
    rechercheParRegion.reinitialise();
    rechercheParTypeOrganisation.reinitialise();
    rechercheParTypeFinancement.reinitialise();
  };
</script>

{#if !estConnecte}
  <fieldset class="filtres regions">
    <legend>Région</legend>
    <label class="colonne">
      <span class="libelle">Sélectionner une région</span>
      <SelectRegion
        bind:region={$rechercheParRegion}
        optionDefautSelectionnable
      />
    </label>
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
            <label>
              <input
                type="checkbox"
                value={type}
                name="filtreOrganisation"
                bind:group={$rechercheParTypeOrganisation}
              />
              <span class="libelle">{type}</span>
            </label>
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
          <label>
            <input
              type="checkbox"
              value={type}
              name="filtreFinancement"
              bind:group={$rechercheParTypeFinancement}
            />
            <span class="libelle">{type}</span>
          </label>
        </li>
      {/each}
    {/if}
  </ul>
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
</style>
