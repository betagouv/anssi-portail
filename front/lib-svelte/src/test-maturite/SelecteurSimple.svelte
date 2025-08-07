<script lang="ts">
  import type { Option } from './SelecteurSimple';

  export let options: Option[];
  export let valeurSeclectionne: string;
  export let optionDefautIntitule: string | undefined =
    'Sélectionner une option';
  export let optionDefautSelectionnable: boolean = false;
</script>

<select
  bind:value={valeurSeclectionne}
  class:defaut={valeurSeclectionne === ''}
>
  <option
    disabled={!optionDefautSelectionnable}
    class="defaut"
    selected
    value="">{optionDefautIntitule}</option
  >
  {#each options as option (option.valeur)}
    <option value={option.valeur}>{option.libelle}</option>
  {/each}
</select>

<style lang="scss">
  select {
    option {
      color: var(--noir);
    }
  }
  .defaut {
    color: var(--gris-aide-saisie);
  }
</style>
