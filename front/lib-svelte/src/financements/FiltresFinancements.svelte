<script lang="ts">
  import { rechercheParRegion } from './stores/rechercheParRegion.store';
  import SelectRegion from '../test-maturite/SelectRegion.svelte';
  import { financementsFiltre } from './stores/financementsFiltre.store';
  import { rechercheParTypeOrganisation } from './stores/rechercheParTypeOrganisation.store';
  import { rechercheParTypeFinancement } from './stores/rechercheParTypeFinancement.store';

  const reinitialiseFiltres = () => {
    rechercheParRegion.reinitialise();
    rechercheParTypeOrganisation.reinitialise();
    rechercheParTypeFinancement.reinitialise();
  };
</script>

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
<fieldset class="filtres organisations">
  <legend>Type d'organisation</legend>
  <ul>
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
  </ul>
</fieldset>
<fieldset class="filtres financements">
  <legend>Type de financement</legend>
  <ul>
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
    width: 100%;
  }

  fieldset {
    margin: 0;
    padding: 0 0 2rem;
    border: 0;
    border-bottom: 1px solid var(--gris-clair);

    legend {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 0.875rem;
      line-height: 1.25rem;
      margin-bottom: 1rem;
      padding: 0;
    }

    ul {
      display: grid;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 1rem;
    }

    label {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      cursor: pointer;

      .libelle {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      input[type='checkbox'] {
        appearance: none;
        border: 1px solid var(--noir);
        border-radius: 4px;
        width: 24px;
        height: 24px;
        margin: 0;
        cursor: pointer;

        &:checked {
          background-color: var(--jaune-msc);

          &::before {
            content: '';
            display: block;
            margin: auto;
            width: 6px;
            height: 12px;
            border-right: 2px var(--noir) solid;
            border-bottom: 2px var(--noir) solid;
            transform: translateY(2px) rotate(0.12turn);
          }
        }

        &:indeterminate {
          /* Ce style est prévu pour être cumulatif avec l'état coché */
          &::before {
            width: 9px;
            height: 10px;
            border-right: none;
            transform: none;
          }
        }
      }

      &.colonne {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
</style>
