<script lang="ts">
  import type { Option } from '../test-maturite/SelecteurSimple';
  import SelecteurSimple from '../test-maturite/SelecteurSimple.svelte';
  import { secteursContacts } from './contacts.type';

  export let secteur: string;

  const options: Option[] = secteursContacts.map((s) => ({
    valeur: s.valeur,
    libelle: s.libelle,
  }));
</script>

<SelecteurSimple
  {options}
  bind:valeurSeclectionne={secteur}
  optionDefautSelectionnable
/>
