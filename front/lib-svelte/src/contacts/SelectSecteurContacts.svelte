<script lang="ts">
  import type { Option } from '../test-maturite/SelecteurSimple';
  import SelecteurSimple from '../test-maturite/SelecteurSimple.svelte';
  import { secteursContacts } from './contacts.donnees';

  export let secteur: string;

  const options: Option[] = secteursContacts;
</script>

<SelecteurSimple
  {options}
  bind:valeurSeclectionne={secteur}
  optionDefautSelectionnable
/>
